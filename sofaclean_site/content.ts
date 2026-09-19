import { Building2, SprayCan, Sofa, Armchair, BedDouble, Hotel, House, Paintbrush, ShieldCheck, CalendarCheck, Sparkles } from 'lucide-react';

export const generalServicesContent = {
  name: 'SofaClean',
  tagline: 'Seu estofo novo de novo',
  area: 'Porto e Braga',
  address: 'Porto e Braga, Portugal',
  mapQuery: 'Porto, Portugal',
  title: ['O seu sofá.', 'Mais cuidado.', 'Mais conforto.'],
  description: 'Higienização de sofás e estofados ao domicílio nas regiões do Porto e Braga. Cuidados adequados ao tecido, com avaliação e orçamento antes de cada intervenção.',
  phone: '+351 920 320 174',
  whatsappNumber: '351920320174',
  whatsappMessage: 'Olá! Gostaria de pedir um orçamento para higienização de sofás ou estofados.',
  heroImage: null as { src: string; alt: string } | null,
  services: [
    { icon: Sofa, title: 'Higienização de sofás', text: 'Cuidados para o tecido e limpeza do sofá, com avaliação prévia do seu estado.', note: 'Valores a consultar', image: '/sofaclean/images/sofas.svg' },
    { icon: Armchair, title: 'Higienização de poltronas', text: 'Limpeza cuidada de poltronas, adaptada ao material e às necessidades de cada peça.', note: 'Valores a consultar', image: '/sofaclean/images/poltronas.svg' },
    { icon: BedDouble, title: 'Higienização de colchões', text: 'Higienização do colchão com avaliação do revestimento e orientação sobre a secagem.', note: 'Valores a consultar', image: '/sofaclean/images/colchoes.svg' },
    { icon: Hotel, title: 'Limpeza de alojamento', text: 'Limpeza de espaços de alojamento, com tarefas e condições acordadas antes do serviço.', note: 'Valores a consultar', image: '/sofaclean/images/alojamento.svg' },
    { icon: Building2, title: 'Limpeza de escritórios', text: 'Cuidados de limpeza para postos de trabalho e áreas comuns de espaços profissionais.', note: 'Valores a consultar', image: '/sofaclean/images/escritorios.svg' },
    { icon: House, title: 'Limpeza doméstica', text: 'Limpeza da sua casa, ajustada às divisões e às tarefas de que precisa.', note: 'Valores a consultar', image: '/sofaclean/images/domestica.svg' },
    { icon: SprayCan, title: 'Limpeza em geral', text: 'Soluções de limpeza para diferentes espaços, mediante avaliação e orçamento.', note: 'Valores a consultar', image: '/sofaclean/images/geral.svg' },
    { icon: Paintbrush, title: 'Limpeza pós obra', text: 'Limpeza após obras ou remodelações, com avaliação das superfícies e dos resíduos.', note: 'Valores a consultar', image: '/sofaclean/images/pos-obra.svg' },
  ],
  benefits: [
    { icon: Building2, title: 'Para casas e empresas', text: 'Uma proposta ajustada ao espaço e ao serviço de que precisa.' },
    { icon: ShieldCheck, title: 'Cuidado na execução', text: 'Métodos e equipamentos adequados a cada trabalho.' },
    { icon: CalendarCheck, title: 'Planeamento consigo', text: 'Dias, horários e condições combinados antes da intervenção.' },
    { icon: Sparkles, title: 'Atenção ao detalhe', text: 'Acompanhamento desde o pedido até à conclusão do serviço.' },
  ],
  steps: [
    { title: 'Conte-nos o que precisa', text: 'Indique o serviço, a localização e a sua disponibilidade.' },
    { title: 'Receba uma proposta', text: 'Avaliamos o trabalho e apresentamos o orçamento e as condições.' },
    { title: 'Combine a intervenção', text: 'Após a sua aprovação, agendamos o serviço consigo.' },
  ],
  faqs: [
    { question: 'Onde atua a SofaClean?', answer: 'Prestamos serviços ao domicílio nas regiões do Porto e Braga. Envie a sua localidade para confirmar a cobertura, disponibilidade e condições de deslocação.' },
    { question: 'Como peço um orçamento?', answer: 'Contacte-nos pelo WhatsApp +351 920 320 174. Indique a localidade, o tipo e a dimensão do artigo e, se possível, envie fotografias do estofo.' },
    { question: 'O sofá fica molhado após a limpeza? Quanto tempo seca?', answer: 'Secagem média de 3 a 6 horas, dependendo da ventilação, do tecido e das condições do espaço.' },
    { question: 'Conseguem tirar manchas de vinho, sangue e gordura?', answer: 'Tratamos manchas de vinho, sangue, café, gordura e urina. O resultado depende do tecido, da substância e do tempo decorrido. Envie uma fotografia para avaliarmos as possibilidades antes de marcar; não garantimos a remoção de todas as manchas.' },
    { question: 'Qual a diferença entre higienização e limpeza de sofá?', answer: 'A limpeza remove sujidade, resíduos e partículas. O tratamento anti-ácaros e a desbacterização são extras opcionais, orçamentados separadamente. A limpeza normal não promete eliminação de microrganismos.' },
    { question: 'Limpam sofás de couro, alcântara e veludo?', answer: 'Sim, com produtos e técnicas específicos para cada material.\n\nCouro e pele genuína: limpeza com produto desengordurante neutro seguido de hidratante de couro, que preserva a flexibilidade e evita rachas.\n\nAlcântara: produto de pH neutro aplicado a seco com técnica de pressão controlada para não danificar a microfibra.\n\nVeludo: extração na direção do pelo com cabeçote especializado que restaura a textura.\n\nCouro sintético (PU) e microfibra: processo adaptado ao nível de sujidade.' },
    { question: 'Quanto custa limpar um tapete profissionalmente?', answer: 'A limpeza profissional de tapetes é sempre orçamentada à medida: cada tapete é medido individualmente (largura × comprimento) e o preço depende do tipo de fibra, dimensão e estado de sujidade, sem tabela fixa por m².', link: { label: 'Pedir orçamento para limpeza de tapetes', href: 'https://wa.me/351920320174?text=Ol%C3%A1!%20Gostaria%20de%20pedir%20um%20or%C3%A7amento%20para%20limpeza%20de%20tapetes.' } },
    { question: 'Qual é a diferença entre tapete e alcatifa para efeitos de limpeza?', answer: 'Tapete é uma peça solta com dimensões definidas que pode ser movida e transportada. Alcatifa é um revestimento de piso fixo ou semi-fixo que cobre toda uma divisão.\n\nDo ponto de vista de limpeza: tapetes avulsos são tratados ao domicílio ou com recolha e entrega; alcatifas são sempre limpas no local por extração a vapor sem remoção. Em ambos os casos o orçamento é sempre feito à medida, sem tabela fixa por m².' },
  ],
  // Apenas fotografias e avaliações reais autorizadas. Secções ocultas quando vazias.
  projects: [] as { title: string; before: string; after: string }[],
  googleReviews: { url: 'https://share.google/sy3XCoSj15maT1CxE', rating: 5 as number | null, count: 42 as number | null, checkedOn: '18/09/2026' },
  testimonials: [
    { quote: 'Empresa de confiabilidade, transparência e muito profissionalismo. Indico imenso!', author: 'Daniel Cambui', rating: 5, url: 'https://share.google/sy3XCoSj15maT1CxE' },
    { quote: 'Amei! Profissionais super competentes, responsáveis e ágeis. Obrigada 🙏', author: 'Luiza Bittencourt', rating: 5, url: 'https://share.google/sy3XCoSj15maT1CxE' },
    { quote: 'Muito bom serviço , grandes profissionais. …', author: 'Luiz Felipe Gomes da Costa', rating: 5, url: 'https://share.google/sy3XCoSj15maT1CxE' },
  ] as { quote: string; author: string; rating?: number; date?: string; url?: string }[],
};

export type GeneralServicesContent = typeof generalServicesContent;
