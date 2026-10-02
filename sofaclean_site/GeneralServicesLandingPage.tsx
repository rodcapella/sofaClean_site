'use client';

import Image from 'next/image';
import { whatsappLink, whatsappMessages, serviceWhatsAppMessage } from './whatsapp';
import { SofaCleanFooter } from './Footer';
import { SofaCleanWhatsApp } from './SofaCleanWhatsApp';
import type { MouseEvent } from 'react';
import { ArrowRight, Check, ChevronDown, Mail, MapPin, MessageCircle, Phone } from 'lucide-react';
import type { GeneralServicesContent } from './content';
import { CustomerReviews } from './CustomerReviews';
import { LegalModal } from './LegalModal';
import { useState } from 'react';
import { BeforeAfterShowcase } from './BeforeAfterShowcase';

export function GeneralServicesLandingPage({ content: c, demo = false, onOpenContact }: { content: GeneralServicesContent; demo?: boolean; onOpenContact?: (topic?: string) => void }) {
  const [legalKind, setLegalKind] = useState<'terms' | 'returns' | 'privacy' | null>(null);
  const whatsappDigits = c.whatsappNumber.replace(/\D/g, '');
  const phoneDigits = c.phone.replace(/[^+\d]/g, '');

  const canWhatsApp = !demo && /^\d{7,15}$/.test(whatsappDigits);
  const canCall = !demo && /^\+?\d{7,15}$/.test(phoneDigits);
  const phone = canCall ? `tel:${phoneDigits}` : '#orcamento';
  const contactProps = (topic = 'Higienização de sofás', message = serviceWhatsAppMessage(topic)) => !canWhatsApp && onOpenContact ? { href: '#', onClick: (event: MouseEvent<HTMLAnchorElement>) => { event.preventDefault(); onOpenContact(topic); } } : { href: canWhatsApp ? whatsappLink(whatsappDigits, message) : '#orcamento', target: '_blank', rel: 'noopener noreferrer' };
  return <div className="template">
    <a className="skip-link" href="#servicos-conteudo">Saltar para o conteúdo</a>
    <header className="nav shell"><div className="brand" aria-label={`${c.name} — início`}><span className="brand-logo"><Image unoptimized src="/sofaclean/logos/sofa-clean-logo.webp" alt="SofaClean" width={180} height={72} /></span><span><strong>{c.name}</strong><b>{c.tagline}</b></span></div><nav aria-label="Navegação de serviços"><a href="#servicos">Serviços</a><a href="#processo">Como funciona</a><a href="#faq">FAQ</a></nav><div className="nav-actions"><a className="nav-call" href="#contacto" onClick={(event) => { event.preventDefault(); onOpenContact?.('Higienização de estofos'); }}><Mail size={17} aria-hidden="true" />Contactos</a><a className="nav-phone" href="tel:+351925535456"><Phone size={17} aria-hidden="true" />Ligar</a></div></header>
    <main id="servicos-conteudo">
      <section className="hero" id="top"><div className="shell hero-grid"><div className="hero-copy"><div className="eyebrow">Serviços ao domicílio · {c.area}</div><h1>{c.title[0]}<br /><em>{c.title[1]}</em><br />{c.title[2]}</h1><p>{c.description}</p><div className="hero-actions"><a className="button primary" {...contactProps('Higienização de sofás', whatsappMessages.specialist)}><MessageCircle size={20} aria-hidden="true" />Fale com um Especialista <ArrowRight size={18} aria-hidden="true" /></a></div><div className="trust-row"><span><Check aria-hidden="true" />Atendimento local</span><span><Check aria-hidden="true" />Proposta à sua medida</span></div></div>
      {c.heroImage ? <Image unoptimized className="work-photo" src={c.heroImage.src} alt={c.heroImage.alt} width={640} height={600} /> : <aside className="service-overview" aria-label="Áreas de serviço"><span className="kicker">CUIDADO PARA OS SEUS ESTOFOS</span><h2>Deixe os detalhes<br />connosco.</h2>{c.services.slice(0, 3).map(({ icon: Icon, title }) => <div key={title}><Icon aria-hidden="true" /><span>{title}</span><Check aria-hidden="true" /></div>)}<p><MapPin size={18} aria-hidden="true" />{c.area}</p></aside>}</div></section>
      <section className="trust-indicators" aria-label="Indicadores SofaClean"><div className="trust-indicators-grid"><div><strong>+2 anos</strong><span>no mercado português</span></div><div><strong>+5 mil</strong><span>atendimentos realizados</span></div><div><strong>45 min</strong><span>tempo médio de serviço</span></div><div><strong>Desde 19,90€</strong><span>higienização profissional</span></div></div></section>
      <section className="services section shell" id="servicos"><div className="section-head services-heading"><h2>Nossos Serviços</h2></div><div className="service-grid">{c.services.map((service, index) => <article className="service-card" key={service.title}><div className="service-top"><Image unoptimized className="service-thumbnail" src={service.image} alt="" width={600} height={430} /><b>{String(index + 1).padStart(2, '0')}</b></div><h3>{service.title}</h3><p>{service.text}</p><a {...contactProps(service.title)}>Pedir orçamento <ArrowRight aria-hidden="true" /></a></article>)}</div><a className="back-to-top" href="#top">Voltar ao topo <ArrowRight aria-hidden="true" /></a></section>
      <section className="benefits section"><div className="shell benefits-grid"><div className="benefit-intro"><div className="kicker light">CUIDADO DO INÍCIO AO FIM</div><h2>Mais tempo para o que importa.</h2><p>Encontre o apoio de que precisa para manter o seu espaço cuidado, com condições claras e um serviço combinado consigo.</p><a {...contactProps('Higienização de sofás', whatsappMessages.contact)}>Falar connosco <ArrowRight aria-hidden="true" /></a></div><div className="benefit-list">{c.benefits.map(({ icon: Icon, title, text }) => <div key={title}><Icon aria-hidden="true" /><h3>{title}</h3><p>{text}</p></div>)}</div></div></section>
      <CustomerReviews content={c} />
      <BeforeAfterShowcase />
      <section className="process section" id="processo"><div className="shell"><div className="center-head"><div className="kicker">SIMPLES E CLARO</div><h2>Como funciona</h2><p>Do primeiro contacto à conclusão do trabalho.</p></div><div className="steps">{c.steps.map((step, index) => <article key={step.title}><b>{index + 1}</b><h3>{step.title}</h3><p>{step.text}</p></article>)}</div><a className="back-to-top" href="#top">Voltar ao topo <ArrowRight aria-hidden="true" /></a></div></section>
      <section className="outside-coverage section"><div className="outside-coverage-card"><h2>Precisa de serviços fora destas zonas?</h2><p>Entre em contacto connosco para avaliar a disponibilidade de deslocação para a sua localidade.</p><a className="button green" {...contactProps('Pedido de orçamento fora da área', whatsappMessages.coverage)}>Pedir orçamento grátis <ArrowRight aria-hidden="true" /></a></div></section>
      <section className="section faq shell" id="faq"><div className="faq-intro"><div className="kicker">PERGUNTAS FREQUENTES</div><h2>Ainda tem dúvidas?</h2><p>Encontre respostas rápidas ou fale diretamente connosco.</p><a {...contactProps('Informações sobre os serviços', whatsappMessages.information)}>Pedir informações <ArrowRight aria-hidden="true" /></a></div><div className="accordion">{c.faqs.map(({ question, answer }) => <details key={question}><summary>{question}<ChevronDown aria-hidden="true" /></summary><p className="faq-answer">{answer}</p></details>)}</div><a className="back-to-top" href="#top">Voltar ao topo <ArrowRight aria-hidden="true" /></a></section>
      <section className="og-panel section" aria-label="SofaClean"><div className="shell og-panel-inner"><Image unoptimized className="og-panel-image" src="/sofaclean/banners/finalCTA.webp" alt="SofaClean — higienização profissional de sofá no Porto e Braga e região" width={1734} height={907} /></div></section>
      <section className="final-cta" id="orcamento"><div className="shell"><div className="kicker light">VAMOS CUIDAR DO SEU ESPAÇO</div><h2>Em que podemos<br />ajudar?</h2><p>Conte-nos o que precisa e peça uma proposta para o seu serviço.</p><div className="hero-actions centered"><a className="button green" {...contactProps('Pedido de orçamento', whatsappMessages.quote)}><MessageCircle aria-hidden="true" />Pedir orçamento</a>{canCall && <a className="button ghost" href={phone}><Phone aria-hidden="true" />{c.phone}</a>}</div><div className="final-social"><strong>Siga-nos e conheça mais sobre o nosso trabalho nas nossas redes sociais:</strong><div className="social-links"><a className="instagram-link" href="https://www.instagram.com/sofaclean.porto" target="_blank" rel="noopener noreferrer" aria-label="Instagram da SofaClean"><svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5" fill="none" stroke="currentColor" strokeWidth="2"/><circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" strokeWidth="2"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor"/></svg><span>Instagram</span></a><a className="instagram-link" href="https://www.tiktok.com/@sofaclean.porto" target="_blank" rel="noopener noreferrer" aria-label="TikTok da SofaClean"><svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12.53.02C13.84 0 15.14.01 16.44 0c.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/></svg><span>TikTok</span></a></div></div></div></section>
    </main>
    <SofaCleanFooter onOpenLegal={setLegalKind} />
    <SofaCleanWhatsApp />
    {legalKind && <LegalModal kind={legalKind} onClose={() => setLegalKind(null)} />}
  </div>;
}










