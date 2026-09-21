import { NextResponse } from 'next/server';
const attempts = new Map<string, { count: number; resetAt: number }>();
const clean = (value: unknown, limit: number) => String(value ?? '').replace(/[<>]/g, '').trim().slice(0, limit);
export async function POST(request: Request) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return NextResponse.json({ error: 'email_not_configured' }, { status: 503 });
  const body = await request.json().catch(() => null) as Record<string, unknown> | null;
  if (!body || clean(body.website, 100)) return NextResponse.json({ error: 'request_rejected' }, { status: 400 });
  const name=clean(body.name,100), email=clean(body.email,254), phone=clean(body.phone,30), topic=clean(body.topic,100), message=clean(body.message,2000);
  if (!name || !email || !topic || !message) return NextResponse.json({ error: 'missing_fields' }, { status: 400 });
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return NextResponse.json({ error: 'invalid_email' }, { status: 400 });
  if (/@(tempmail|10minutemail|guerrillamail|mailinator|yopmail)\./i.test(email)) return NextResponse.json({ error: 'disposable_email' }, { status: 400 });
  const ip=request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()||'unknown', now=Date.now(), current=attempts.get(ip);
  if (current && current.resetAt>now && current.count>=3) return NextResponse.json({error:'rate_limited'},{status:429});
  attempts.set(ip,current&&current.resetAt>now?{count:current.count+1,resetAt:current.resetAt}:{count:1,resetAt:now+900000});
  const text = [`Nome: ${name}`, `Email: ${email}`, `Telefone: ${phone || '-'}`, `Serviço: ${topic}`, '', message].join('\n');
  const response = await fetch('https://api.resend.com/emails', { method: 'POST', headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' }, body: JSON.stringify({ from: process.env.CONTACT_FROM_EMAIL || 'SofaClean <onboarding@resend.dev>', to: ['sofaclean.porto@gmail.com'], reply_to: email, subject: `Novo pedido SofaClean — ${topic}`, text }) });
  if (!response.ok) return NextResponse.json({ error: 'email_failed' }, { status: 502 });
  return NextResponse.json({ ok: true });
}

