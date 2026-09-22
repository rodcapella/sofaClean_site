'use client';

import { FormEvent, useEffect, useState } from 'react';
import { CheckCircle2, Mail, MessageCircle, X } from 'lucide-react';

type ContactModalProps = { isOpen: boolean; onClose: () => void; initialTopic?: string };

export function ContactModal({ isOpen, onClose, initialTopic = '' }: ContactModalProps) {
  const [sent, setSent] = useState(false);
  useEffect(() => { if (!isOpen) setSent(false); }, [isOpen]);
  if (!isOpen) return null;
  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const subject = String(data.get('subject') || 'Contato');
    const message = [`Nome: ${data.get('name')}`, `Email: ${data.get('email')}`, `Telefone: ${data.get('phone')}`, `Assunto: ${subject}`, `Serviço: ${data.get('topic')}`, `Mensagem: ${data.get('message')}`].join('\n');
    const response = await fetch('/api/contact', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name: data.get('name'), email: data.get('email'), phone: data.get('phone'), subject, topic: data.get('topic'), message: data.get('message') }) });
    if (!response.ok) { window.location.href = `mailto:sofaclean.porto@gmail.com?subject=${encodeURIComponent(`SofaClean — ${subject}`)}&body=${encodeURIComponent(message)}`; return; }
    setSent(true);
  };
  return <div className={"contactOverlay"} role="presentation" onMouseDown={onClose}>
    <section className={"contactModal"} role="dialog" aria-modal="true" aria-labelledby="contact-title" onMouseDown={event => event.stopPropagation()}>
      <button className={"contactClose"} type="button" onClick={onClose} aria-label="Fechar contacto"><X size={20} /></button>
      {sent ? <div className={"contactSuccess"}><CheckCircle2 size={44} /><h2>Pedido enviado</h2><p>Recebemos o seu pedido por email. Entraremos em contacto assim que possível.</p><button className="button green" type="button" onClick={onClose}>Fechar</button></div> : <>
        <div className={"contactHeading"}><span className={"contactIcon"}><MessageCircle size={22} /></span><div><span className="kicker">CONTACTO</span><h2 id="contact-title">Peça o seu orçamento</h2></div></div>
        <p className={"contactIntro"}>Partilhe os detalhes do serviço e respondemos com uma proposta à sua medida para o Porto, Braga e arredores.</p>
        <form className={"contactForm"} onSubmit={submit}>
          <label>Nome *<input name="name" required placeholder="O seu nome" /></label>
          <label>Email *<input name="email" type="email" required placeholder="nome@email.com" /></label>
          <label>Telemóvel<input name="phone" type="tel" placeholder="+351 ..." /></label>
          <label>Assunto *<select name="subject" required defaultValue=""><option value="" disabled>Escolha o assunto</option><option value="Contato">Contato</option><option value="Dúvidas">Dúvidas</option><option value="Orçamento">Orçamento</option><option value="Reclamação">Reclamação</option><option value="Sugestão">Sugestão</option><option value="Outros">Outros</option></select></label>
          <label>Serviço *<select name="topic" required defaultValue={initialTopic}><option value="" disabled>Escolha um serviço</option><option>Higienização de colchões</option><option>Higienização de poltronas</option><option>Higienização de sofás</option><option>Limpeza doméstica</option><option>Outros</option></select></label>
          <label className={"contactFull"}>Mensagem *<textarea name="message" required rows={4} placeholder="Conte-nos o que precisa..." /></label>
          <button className="button green" type="submit"><Mail size={18} /> Enviar pedido por email</button>
          <p className="contactRequiredNote">Os campos assinalados com * são obrigatórios.</p>
        </form>
      </>}
    </section>
  </div>;
}





