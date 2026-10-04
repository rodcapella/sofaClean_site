import { createHash } from 'node:crypto';
import { isIP } from 'node:net';
import { NextResponse } from 'next/server';

const RATE_LIMIT_MAX = 3;
const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000;
const MAX_BODY_BYTES = 16 * 1024;
const attempts = new Map<string, { count: number; resetAt: number }>();
const limits = { name: 100, email: 254, phone: 30, subject: 100, topic: 100, message: 2000 } as const;
const clean = (value: unknown, limit: number) => typeof value === 'string' ? value.replace(/[<>]/g, '').trim().slice(0, limit) : '';
const hasUnsafeHeaderChars = (value: string) => /[\r\n\0-\x08\x0B\x0C\x0E-\x1F\x7F]/.test(value);

function hasOversizedFields(body: Record<string, unknown>) {
  return (Object.entries(limits) as Array<[keyof typeof limits, number]>).some(
    ([field, limit]) => typeof body[field] === 'string' && body[field].length > limit,
  );
}

function requestHasAllowedOrigin(request: Request) {
  const allowedOrigins = new Set([
    'https://sofacleanpt.pt', 'https://www.sofacleanpt.pt',
    ...(process.env.CONTACT_ALLOWED_ORIGINS || '').split(',').map((origin) => origin.trim().replace(/\/$/, '')).filter(Boolean),
    ...(process.env.NODE_ENV !== 'production' ? ['http://localhost:3000', 'http://127.0.0.1:3000', 'http://localhost:5173', 'http://127.0.0.1:5173'] : []),
  ]);
  const origin = request.headers.get('origin');
  if (origin) return allowedOrigins.has(origin.replace(/\/$/, ''));
  const referer = request.headers.get('referer');
  if (!referer) return process.env.NODE_ENV !== 'production';
  try { return allowedOrigins.has(new URL(referer).origin); } catch { return false; }
}

function getClientIp(request: Request) {
  for (const header of ['cf-connecting-ip', 'x-real-ip']) {
    const value = request.headers.get(header)?.trim();
    if (value && isIP(value)) return value;
  }
  if (process.env.VERCEL || process.env.CLOUDFLARE_ENV) {
    const forwarded = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim();
    if (forwarded && isIP(forwarded)) return forwarded;
  }
  return 'unknown';
}

function isLocallyRateLimited(ip: string) {
  const now = Date.now();
  if (attempts.size > 1000) for (const [key, value] of attempts) if (value.resetAt <= now) attempts.delete(key);
  const current = attempts.get(ip);
  if (!current || current.resetAt <= now) {
    attempts.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return false;
  }
  current.count += 1;
  return current.count > RATE_LIMIT_MAX;
}

async function isRateLimited(ip: string): Promise<boolean | null> {
  const redisUrl = (process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL || '').replace(/\/$/, '');
  const redisToken = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!redisUrl || !redisToken) return process.env.NODE_ENV === 'production' ? null : isLocallyRateLimited(ip);
  const key = `contact-rate:${createHash('sha256').update(ip).digest('hex')}`;
  try {
    const response = await fetch(`${redisUrl}/pipeline`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${redisToken}`, 'Content-Type': 'application/json' },
      body: JSON.stringify([['INCR', key], ['PEXPIRE', key, RATE_LIMIT_WINDOW_MS, 'NX']]),
      signal: AbortSignal.timeout(3000),
    });
    if (!response.ok) return null;
    const result = await response.json() as Array<{ result?: number }>;
    const count = Number(result?.[0]?.result);
    return Number.isFinite(count) ? count > RATE_LIMIT_MAX : null;
  } catch (error) {
    // Never include request data, IPs, tokens, credentials or provider URLs in production logs.
    if (process.env.NODE_ENV === 'production') console.error('contact_rate_limit_unavailable');
    else console.error('contact_rate_limit_unavailable', error);
    return null;
  }
}

function json(error: string, status: number, extraHeaders: Record<string, string> = {}) {
  return NextResponse.json({ error }, { status, headers: { 'Cache-Control': 'no-store', Vary: 'Origin', ...extraHeaders } });
}

export async function POST(request: Request) {
  const contentType = request.headers.get('content-type') || '';
  if (!/^application\/json(?:\s*;|$)/i.test(contentType) || !requestHasAllowedOrigin(request)) return json('request_rejected', 400);
  const declaredBytes = Number(request.headers.get('content-length'));
  if (Number.isFinite(declaredBytes) && declaredBytes > MAX_BODY_BYTES) return json('request_rejected', 413);
  const rawBody = await request.text().catch(() => '');
  if (!rawBody || new TextEncoder().encode(rawBody).byteLength > MAX_BODY_BYTES) return json('request_rejected', 413);

  let body: Record<string, unknown>;
  try {
    const parsed: unknown = JSON.parse(rawBody);
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return json('request_rejected', 400);
    body = parsed as Record<string, unknown>;
  } catch { return json('request_rejected', 400); }
  if (clean(body.website, 100) || hasOversizedFields(body)) return json('request_rejected', 400);

  const name = clean(body.name, limits.name), email = clean(body.email, limits.email).toLowerCase();
  const phone = clean(body.phone, limits.phone), subject = clean(body.subject, limits.subject);
  const topic = clean(body.topic, limits.topic), message = clean(body.message, limits.message);
  if (!name || !email || !topic || !message) return json('request_rejected', 400);
  if ([name, email, subject, topic].some(hasUnsafeHeaderChars)) return json('request_rejected', 400);
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return json('request_rejected', 400);
  if (/@(tempmail|10minutemail|guerrillamail|mailinator|yopmail)\./i.test(email)) return json('disposable_email', 422);

  const rateLimitResult = await isRateLimited(getClientIp(request));
  if (rateLimitResult === null) return json('request_failed', 503);
  if (rateLimitResult) return json('rate_limited', 429, { 'Retry-After': String(RATE_LIMIT_WINDOW_MS / 1000) });

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return json('request_failed', 503);
  const text = [`Nome: ${name}`, `Email: ${email}`, `Telefone: ${phone || '-'}`, `Assunto: ${subject || 'Contacto'}`, `Serviço: ${topic}`, '', message].join('\n');
  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ from: process.env.CONTACT_FROM_EMAIL || 'SofaClean <onboarding@resend.dev>', to: [process.env.CONTACT_EMAIL_TO || 'sofaclean.porto@gmail.com'], reply_to: email, subject: `SofaClean — ${subject || topic}`, text }),
      signal: AbortSignal.timeout(10_000),
    });
    if (!response.ok) {
      console.error('contact_delivery_failed', { providerStatus: response.status });
      return json('request_failed', 502);
    }
    return NextResponse.json({ ok: true }, { headers: { 'Cache-Control': 'no-store', Vary: 'Origin' } });
  } catch (error) {
    if (process.env.NODE_ENV === 'production') console.error('contact_delivery_failed');
    else console.error('contact_delivery_failed', error);
    return json('request_failed', 502);
  }
}

