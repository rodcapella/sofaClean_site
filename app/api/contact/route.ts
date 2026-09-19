import { NextResponse } from 'next/server';
export async function POST(request: Request) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return NextResponse.json({ error: 'email_not_configured' }, { status: 503 });
  const body = await request.json().catch(() => null) as Record<string, string> | null;
  if (!body?.name || !body.email || !body.topic || !body.message) return NextResponse.json({ error: 'missing_fields' }, { status: 400 });
  const text = [`Nome: ${body.name}`, `Email: ${body.email}`, `Telefone: ${body.phone || '-'}`, `Serviço: ${body.topic}`, '', body.message].join('\n');
  const response = await fetch('https://api.resend.com/emails', { method: 'POST', headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' }, body: JSON.stringify({ from: process.env.CONTACT_FROM_EMAIL || 'SofaClean <onboarding@resend.dev>', to: ['cleansolutions.pt25@gmail.com'], reply_to: body.email, subject: `Novo pedido SofaClean — ${body.topic}`, text }) });
  if (!response.ok) return NextResponse.json({ error: 'email_failed' }, { status: 502 });
  return NextResponse.json({ ok: true });
}
