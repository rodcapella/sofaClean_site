import { ArrowRight, BedDouble, Check, ChevronDown, MapPin, MessageCircle, Phone, ShieldCheck, Sofa, Sparkles, SprayCan, Wind } from "lucide-react";

const whatsapp = "https://wa.me/351968857414?text=Ol%C3%A1%20Master%20Clean!%20Gostaria%20de%20pedir%20um%20or%C3%A7amento.";
const phone = "tel:+351968857414";

const services = [
  { icon: Sofa, number: "01", title: "Limpeza de sofás", text: "Higienização cuidada para renovar o conforto e a frescura do seu sofá.", note: "Sofás, cadeiras e poltronas" },
  { icon: BedDouble, number: "02", title: "Higienização de colchões", text: "Limpeza profunda para um ambiente de descanso mais limpo e agradável.", note: "Colchões e cabeceiras" },
  { icon: Sparkles, number: "03", title: "Limpeza de carpetes", text: "Tratamento profissional para remover a sujidade acumulada nas fibras.", note: "Carpetes, tapetes e alcatifas" },
];

const faqs = [
  ["Quanto tempo demora a limpeza?", "Depende do tipo, dimensão e estado da peça. Envie-nos uma fotografia pelo WhatsApp e indicamos-lhe uma estimativa."],
  ["Quanto tempo demora a secar?", "O tempo de secagem varia com o tecido, a ventilação e as condições do dia. No final do serviço, damos-lhe uma indicação adequada à sua peça."],
  ["Como posso pedir um orçamento?", "Basta enviar uma mensagem pelo WhatsApp com fotografias, a sua localização e o serviço pretendido. Respondemos com uma proposta adequada."],
  ["Deslocam-se a minha casa?", "Sim. Prestamos o serviço no local, em Fátima e nas localidades próximas, mediante confirmação de disponibilidade."],
];

export default function Home() {
  return (
    <main>
      <header className="nav shell">
        <a className="brand brand-logo-crop" href="#top" aria-label="Master Clean — início"><img src="/master-clean-logo.png" alt="Master Clean" /></a>
        <nav aria-label="Navegação principal">
          <a href="#servicos">Serviços</a><a href="#processo">Como funciona</a><a href="#faq">FAQ</a>
        </nav>
        <a className="nav-call" href={phone}><Phone size={17} /> 968 857 414</a>
      </header>

      <section className="hero" id="top">
        <div className="hero-orb orb-one"/><div className="hero-orb orb-two"/>
        <div className="shell hero-grid">
          <div className="hero-copy">
            <div className="eyebrow"><span /> Serviço ao domicílio · Fátima e arredores</div>
            <h1>O seu espaço.<br/><em>Mais limpo.</em><br/>Mais saudável.</h1>
            <p>Limpeza e higienização profissional de sofás, colchões e carpetes, com atenção ao detalhe e o cuidado que a sua casa merece.</p>
            <div className="hero-actions">
              <a className="button primary" href={whatsapp} target="_blank" rel="noreferrer"><MessageCircle size={20}/> Pedir orçamento no WhatsApp <ArrowRight size={18}/></a>
              <a className="button secondary" href={phone}><Phone size={19}/> Ligar agora</a>
            </div>
            <div className="trust-row"><span><Check/> Atendimento local</span><span><Check/> Orçamento sem compromisso</span></div>
          </div>
          <div className="hero-visual" aria-label="Espaço reservado para uma fotografia real de limpeza de sofá">
            <div className="photo-placeholder photo-main"><span className="photo-icon"><Sofa/></span><small>FOTOGRAFIA REAL</small><strong>O seu melhor trabalho<br/>em destaque</strong><i>Substituir imagem</i></div>
            <div className="floating-card"><span><Sparkles/></span><div><strong>Cuidado em cada detalhe</strong><small>Higienização profissional</small></div></div>
            <div className="area-stamp"><MapPin/><span>FÁTIMA<br/><small>& ARREDORES</small></span></div>
          </div>
        </div>
      </section>

      <section className="services section shell" id="servicos">
        <div className="section-head"><div><div className="kicker">OS NOSSOS SERVIÇOS</div><h2>Limpeza profunda.<br/><em>Conforto renovado.</em></h2></div><p>Soluções profissionais para os têxteis que fazem parte do seu dia a dia.</p></div>
        <div className="service-grid">{services.map(({icon: Icon, ...item}) => <article className="service-card" key={item.title}><div className="service-top"><span className="service-icon"><Icon/></span><b>{item.number}</b></div><h3>{item.title}</h3><p>{item.text}</p><div className="service-note"><Check/> {item.note}</div><a href={whatsapp} target="_blank" rel="noreferrer">Pedir orçamento <ArrowRight/></a></article>)}</div>
      </section>

      <section className="benefits section">
        <div className="shell benefits-grid"><div className="benefit-intro"><div className="kicker light">PORQUÊ HIGIENIZAR?</div><h2>Não é só sobre parecer limpo.</h2><p>É sobre cuidar da sua casa, do conforto da sua família e prolongar a vida dos seus têxteis.</p><a href={whatsapp} target="_blank" rel="noreferrer">Falar connosco <ArrowRight/></a></div><div className="benefit-list">
          <div><SprayCan/><h3>Higienização profunda</h3><p>Tratamento cuidado das fibras e da sujidade acumulada.</p></div>
          <div><ShieldCheck/><h3>Produtos profissionais</h3><p>Produtos e equipamentos adequados a cada serviço.</p></div>
          <div><Wind/><h3>Odores e ácaros</h3><p>Ajuda a reduzir odores e a presença de ácaros.</p></div>
          <div><Sparkles/><h3>Mais limpeza e saúde</h3><p>Uma sensação renovada de frescura e bem-estar em casa.</p></div>
        </div></div>
      </section>

      <section className="section shell results">
        <div className="section-head"><div><div className="kicker">RESULTADOS QUE SE VEEM</div><h2>Antes & depois</h2></div><p>Este espaço está preparado para mostrar resultados reais da Master Clean.</p></div>
        <div className="before-after"><div className="photo-placeholder before"><span>ANTES</span><small>Adicionar fotografia</small></div><div className="split-handle"><ArrowRight/></div><div className="photo-placeholder after"><span>DEPOIS</span><small>Adicionar fotografia</small></div></div>
        <div className="gallery"><div className="photo-placeholder"><Sofa/><small>Serviço real · Sofá</small></div><div className="photo-placeholder"><BedDouble/><small>Serviço real · Colchão</small></div><div className="photo-placeholder"><Sparkles/><small>Serviço real · Carpete</small></div></div>
      </section>

      <section className="process section" id="processo"><div className="shell"><div className="center-head"><div className="kicker">SIMPLES E RÁPIDO</div><h2>Como funciona</h2><p>Do primeiro contacto ao conforto renovado, sem complicações.</p></div><div className="steps">
        <article><b>1</b><MessageCircle/><h3>Envie uma mensagem</h3><p>Partilhe fotografias e diga-nos onde se encontra.</p></article><span className="step-line"/><article><b>2</b><ShieldCheck/><h3>Receba o orçamento</h3><p>Avaliamos o serviço e combinamos o melhor dia consigo.</p></article><span className="step-line"/><article><b>3</b><Sparkles/><h3>Nós tratamos de tudo</h3><p>Realizamos a limpeza no local, com cuidado e profissionalismo.</p></article>
      </div></div></section>

      <section className="area section shell"><div className="area-card"><div><div className="kicker light">ÁREA DE ATUAÇÃO</div><h2>Perto de si,<br/>em Fátima e arredores.</h2><p>Deslocamo-nos ao seu domicílio em Fátima e localidades próximas. Confirme connosco a disponibilidade para a sua zona.</p><a className="button white" href={whatsapp} target="_blank" rel="noreferrer"><MessageCircle/> Confirmar a minha zona</a></div><div className="map-art"><div className="map-ring r1"/><div className="map-ring r2"/><div className="map-ring r3"/><span><MapPin/><b>FÁTIMA</b><small>Portugal</small></span></div></div></section>

      <section className="section testimonials shell"><div className="center-head"><div className="kicker">A CONFIANÇA CONSTRÓI-SE</div><h2>O que dizem os nossos clientes</h2><p>Em breve, poderá encontrar aqui opiniões reais de clientes Master Clean.</p></div><div className="testimonial-empty"><span>“</span><p>Espaço reservado para testemunhos verificados.</p><small>As avaliações serão publicadas quando estiverem disponíveis.</small></div></section>

      <section className="section faq shell" id="faq"><div className="faq-intro"><div className="kicker">PERGUNTAS FREQUENTES</div><h2>Ainda tem dúvidas?</h2><p>Encontre respostas rápidas ou fale diretamente connosco.</p><a href={whatsapp} target="_blank" rel="noreferrer">Perguntar no WhatsApp <ArrowRight/></a></div><div className="accordion">{faqs.map(([q,a]) => <details key={q}><summary>{q}<ChevronDown/></summary><p>{a}</p></details>)}</div></section>

      <section className="final-cta"><div className="shell"><div className="kicker light">A SUA CASA MERECE ESTE CUIDADO</div><h2>Pronto para sentir<br/>a diferença?</h2><p>Envie uma fotografia e peça já o seu orçamento sem compromisso.</p><div className="hero-actions centered"><a className="button green" href={whatsapp} target="_blank" rel="noreferrer"><MessageCircle/> Pedir orçamento no WhatsApp</a><a className="button ghost" href={phone}><Phone/> 968 857 414</a></div></div></section>

      <footer><div className="shell footer-grid"><div><a className="footer-logo" href="#top"><img src="/master-clean-logo.png" alt="Master Clean — limpeza e higienização" /></a><p>Limpeza e higienização profissional<br/>em Fátima e arredores.</p></div><div><b>Serviços</b><a href="#servicos">Limpeza de sofás</a><a href="#servicos">Higienização de colchões</a><a href="#servicos">Limpeza de carpetes</a></div><div><b>Contactos</b><a href={phone}>+351 968 857 414</a><a href={whatsapp} target="_blank" rel="noreferrer">WhatsApp</a><span>Fátima, Portugal</span></div></div><div className="shell copyright">© {new Date().getFullYear()} Master Clean. Todos os direitos reservados.<span>Limpeza profissional ao domicílio.</span></div></footer>
      <div className="mobile-bar"><a href={phone}><Phone/> Ligar</a><a href={whatsapp} target="_blank" rel="noreferrer"><MessageCircle/> Pedir orçamento</a></div>
    </main>
  );
}
