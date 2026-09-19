'use client';

import { FormEvent, useEffect, useState } from 'react';
import { CheckCircle2, MessageCircle, X } from 'lucide-react';
import styles from './general-services.module.css';

type ContactModalProps = { isOpen: boolean; onClose: () => void; initialTopic?: string };

export function ContactModal({ isOpen, onClose, initialTopic = '' }: ContactModalProps) {
  const [sent, setSent] = useState(false);
  useEffect(() => { if (!isOpen) setSent(false); }, [isOpen]);
  if (!isOpen) return null;
  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const message = [`Nome: ${data.get('name')}`, `Email: ${data.get('email')}`, `Telefone: ${data.get('phone')}`, `Serviço: ${data.get('topic')}`, `Mensagem: ${data.get('message')}`].join('\n');
    const response = await fetch('/api/contact', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name: data.get('name'), email: data.get('email'), phone: data.get('phone'), topic: data.get('topic'), message: data.get('message') }) });
    if (!response.ok) { window.location.href = `mailto:cleansolutions.pt25@gmail.com?subject=${encodeURIComponent(`Pedido SofaClean — ${data.get('topic')}`)}&body=${encodeURIComponent(message)}`; return; }
    setSent(true);
  };
  return <div className={styles.contactOverlay} role="presentation" onMouseDown={onClose}>
    <section className={styles.contactModal} role="dialog" aria-modal="true" aria-labelledby="contact-title" onMouseDown={event => event.stopPropagation()}>
      <button className={styles.contactClose} type="button" onClick={onClose} aria-label="Fechar contacto"><X size={20} /></button>
      {sent ? <div className={styles.contactSuccess}><CheckCircle2 size={44} /><h2>Mensagem preparada</h2><p>A conversa foi aberta no WhatsApp. Envie a mensagem para concluirmos o seu pedido.</p><button className="button green" type="button" onClick={onClose}>Fechar</button></div> : <>
        <div className={styles.contactHeading}><span className={styles.contactIcon}><MessageCircle size={22} /></span><div><span className="kicker">CONTACTO</span><h2 id="contact-title">Peça o seu orçamento</h2></div></div>
        <p className={styles.contactIntro}>Partilhe os detalhes do serviço e respondemos com uma proposta à sua medida para o Porto, Braga e arredores.</p>
        <form className={styles.contactForm} onSubmit={submit}>
          <label>Nome *<input name="name" required placeholder="O seu nome" /></label>
          <label>Email *<input name="email" type="email" required placeholder="nome@email.com" /></label>
          <label>Telemóvel<input name="phone" type="tel" placeholder="+351 ..." /></label>
          <label>Serviço *<select name="topic" required defaultValue={initialTopic}><option value="" disabled>Escolha um serviço</option><option>Higienização de sofás</option><option>Higienização de poltronas</option><option>Higienização de colchões</option><option>Limpeza doméstica</option><option>Outro serviço</option></select></label>
          <label className={styles.contactFull}>Mensagem *<textarea name="message" required rows={4} placeholder="Conte-nos o que precisa..." /></label>
          <button className="button green" type="submit"><MessageCircle size={18} /> Enviar pedido por email</button>
        </form>
      </>}
    </section>
  </div>;
}


