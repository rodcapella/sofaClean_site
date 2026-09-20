'use client';

import Image from 'next/image';
import { SofaCleanFooter } from './Footer';
import { SofaCleanWhatsApp } from './SofaCleanWhatsApp';
import type { MouseEvent } from 'react';
import { useState } from 'react';
import { ArrowRight, Check, ChevronDown, MapPin, MessageCircle, Phone, Sparkles, ShieldCheck } from 'lucide-react';
import type { GeneralServicesContent } from './content';
import './index.css';
import { CustomerReviews } from './CustomerReviews';
import { ContactModal } from './ContactModal';

export function GeneralServicesLandingPage({ content: c, demo = false, onOpenContact }: { content: GeneralServicesContent; demo?: boolean; onOpenContact?: (topic?: string) => void }) {
  const [contactOpen, setContactOpen] = useState(false);
  const whatsappDigits = c.whatsappNumber.replace(/\D/g, '');
  const phoneDigits = c.phone.replace(/[^+\d]/g, '');
  const encodedMapQuery = encodeURIComponent(c.mapQuery);
  const mapHref = `https://www.google.com/maps/search/?api=1&query=${encodedMapQuery}`;

  const canWhatsApp = !demo && /^\d{7,15}$/.test(whatsappDigits);
  const canCall = !demo && /^\+?\d{7,15}$/.test(phoneDigits);
  const whatsapp = canWhatsApp ? `https://wa.me/${whatsappDigits}?text=${encodeURIComponent(c.whatsappMessage)}` : '#orcamento';
  const phone = canCall ? `tel:${phoneDigits}` : '#orcamento';
  const emailContact = (subject: string) => ({ href: `mailto:cleansolutions.pt25@gmail.com?subject=${encodeURIComponent(subject)}` });
  const contactProps = (topic = 'Higienização de estofos') => {
    const serviceWhatsapp = canWhatsApp ? `https://wa.me/${whatsappDigits}?text=${encodeURIComponent(`Olá! Gostaria de pedir um orçamento para ${topic}.`)}` : '#orcamento';
    return !canWhatsApp && onOpenContact ? { href: '#', onClick: (event: MouseEvent<HTMLAnchorElement>) => { event.preventDefault(); onOpenContact(topic); } } : { href: serviceWhatsapp, target: '_blank', rel: 'noreferrer' };
  };
  return <div className="template">
    <a className="skip-link" href="#servicos-conteudo">Saltar para o conteúdo</a>
    <header className="nav shell"><a className="brand brand-logo-crop" href="#top" aria-label={`${c.name} — início`}><Image unoptimized src="/sofa-clean-logo.png" alt={c.name} width={220} height={110} /></a><nav aria-label="Navegação de serviços"><a href="#servicos">Serviços</a><a href="#processo">Como funciona</a><a href="#faq">FAQ</a><a href="#contacto" onClick={event => { event.preventDefault(); setContactOpen(true); }}>Contacto</a></nav></header>
    <main id="servicos-conteudo">
      <section className="hero" id="top"><div className="shell hero-grid"><div className="hero-copy"><div className="eyebrow">Serviços ao domicílio · {c.area}</div><h1>{c.title[0]}<br /><em>{c.title[1]}</em><br />{c.title[2]}</h1><p>{c.description}</p><div className="hero-actions"><a className="button primary" {...contactProps()}><MessageCircle size={20} aria-hidden="true" />Pedir orçamento <ArrowRight size={18} aria-hidden="true" /></a><a className="button secondary" href="#servicos">Conhecer os serviços</a></div><div className="trust-row"><span><Check aria-hidden="true" />Atendimento local</span><span><Check aria-hidden="true" />Proposta à sua medida</span></div></div>
      {c.heroImage ? <Image unoptimized className="work-photo" src={c.heroImage.src} alt={c.heroImage.alt} width={640} height={600} /> : <aside className="service-overview" aria-label="Áreas de serviço"><span className="kicker">CUIDADO PARA OS SEUS ESTOFOS</span><h2>Deixe os detalhes<br />connosco.</h2>{c.services.slice(0, 3).map(({ icon: Icon, title }) => <div key={title}><Icon aria-hidden="true" /><span>{title}</span><Check aria-hidden="true" /></div>)}<p><MapPin size={18} aria-hidden="true" />{c.area}</p></aside>}</div></section>
      <section className="services section shell" id="servicos"><div className="section-head"><div><div className="kicker">OS NOSSOS SERVIÇOS</div><h2>Soluções práticas.<br /><em>Espaços bem cuidados.</em></h2></div><p>Higienização de estofados e limpeza de casas, alojamentos e espaços profissionais.</p></div><div className="service-grid">{c.services.map((service, index) => <article className="service-card" key={service.title}><div className="service-top"><Image unoptimized className="service-thumbnail" src={service.image} alt="" width={160} height={128} /><b>{String(index + 1).padStart(2, '0')}</b></div><h3>{service.title}</h3><p>{service.text}</p><a {...contactProps(service.title)}>Pedir orçamento <ArrowRight aria-hidden="true" /></a></article>)}</div><a className="back-top" href="#top">↑ Voltar ao topo</a></section>
      <section className="benefits section"><div className="shell benefits-grid"><div className="benefit-intro"><div className="kicker light">CUIDADO DO PRINCÍPIO AO FIM</div><h2>Mais tempo para o que importa.</h2><p>Encontre o apoio de que precisa para manter o seu espaço cuidado, com condições claras e um serviço combinado consigo.</p><a {...emailContact('Contacto SofaClean')}>Falar connosco <ArrowRight aria-hidden="true" /></a></div><div className="benefit-list">{c.benefits.map(({ icon: Icon, title, text }) => <div key={title}><Icon aria-hidden="true" /><h3>{title}</h3><p>{text}</p></div>)}</div></div></section>
      {c.projects.length > 0 && <section className="section shell results"><div className="section-head"><div><div className="kicker">TRABALHOS REALIZADOS</div><h2>Antes & depois</h2></div></div>{c.projects.map(project => <article key={project.title}><h3>{project.title}</h3><div className="before-after"><Image unoptimized src={project.before} alt={`${project.title}: antes`} width={600} height={430} /><Image unoptimized src={project.after} alt={`${project.title}: depois`} width={600} height={430} /></div></article>)}</section>}
      <section className="process section" id="processo"><div className="shell"><div className="center-head"><div className="kicker">SIMPLES E CLARO</div><h2>Como funciona</h2><p>Do primeiro contacto à conclusão do trabalho.</p></div><div className="steps">{c.steps.map((step, index) => <article key={step.title}><b>{index + 1}</b><ShieldCheck aria-hidden="true" /><h3>{step.title}</h3><p>{step.text}</p></article>)}</div><a className="back-top" href="#top">↑ Voltar ao topo</a></div></section>
      <section className="area section shell"><div className="area-card"><div><div className="kicker">ÁREA DE ATUAÇÃO</div><h2>Perto de si,<br />em {c.area}.</h2><p>Atendimento ao domicílio nas regiões do Porto e Braga. Partilhe a sua localização e confirme connosco a disponibilidade para a sua zona.</p><a className="button white" href={mapHref} target="_blank" rel="noreferrer"><MapPin aria-hidden="true" />Abrir no Google Maps</a></div><div className="coverage map-coverage"><MapPin size={52} aria-hidden="true" /><p>Porto · Braga</p><span>Confirme a cobertura da sua localidade pelo WhatsApp.</span><span>{c.address}</span></div></div></section>
      <section className="section faq shell" id="faq"><div className="faq-intro"><div className="kicker">PERGUNTAS FREQUENTES</div><h2>Ainda tem dúvidas?</h2><p>Encontre respostas rápidas ou fale diretamente connosco.</p><a {...emailContact('Pedido de informações — SofaClean')}>Pedir informações <ArrowRight aria-hidden="true" /></a></div><div className="accordion">{c.faqs.map(({ question, answer, link }) => <details key={question}><summary>{question}<ChevronDown aria-hidden="true" /></summary><p className="faq-answer">{answer}</p>{link && <a className="faq-answer-link" href={link.href}>{link.label} <ArrowRight size={16} aria-hidden="true" /></a>}</details>)}</div><a className="back-top" href="#top">↑ Voltar ao topo</a></section>
      <CustomerReviews content={c} />
      <section className="og-panel section" aria-label="SofaClean"><div className="shell og-panel-inner"><Image unoptimized className="og-panel-image" src="/og.png" alt="SofaClean — higienização profissional de sofás e estofados no Porto e Braga" width={1734} height={907} /></div></section>
      <section className="final-cta" id="orcamento"><div className="shell"><div className="kicker light">VAMOS CUIDAR DO SEU ESPAÇO</div><h2>Em que podemos<br />ajudar?</h2><p>Conte-nos o que precisa e peça uma proposta para o seu serviço.</p><div className="hero-actions centered"><a className="button green" {...contactProps('Higienização de estofos')}><MessageCircle aria-hidden="true" />Pedir orçamento</a>{canCall && <a className="button ghost" href={phone}><Phone aria-hidden="true" />{c.phone}</a>}</div></div></section>
    </main>
    <SofaCleanFooter />
    <SofaCleanWhatsApp />
    <ContactModal isOpen={contactOpen} onClose={() => setContactOpen(false)} />
  </div>;
}





