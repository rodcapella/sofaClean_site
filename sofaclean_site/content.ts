import { Building2, SprayCan, Sofa, Armchair, BedDouble, Hotel, House, Paintbrush, ShieldCheck, CalendarCheck, Sparkles } from 'lucide-react';

export const generalServicesContent = {
  name: 'Sofa Clean',
  tagline: 'Higienização de estofados.',
  area: 'Porto e Braga',
  address: 'Porto e Braga, Portugal',
  mapQuery: 'Porto, Portugal',
  title: ['O seu sofá.', 'Mais cuidado.', 'Mais conforto.'],
  description: 'Higienização de sofás e estofados ao domicílio nas regiões do Porto e Braga. Cuidados adequados ao tecido, com avaliação e orçamento antes de cada intervenção.',
  phone: '+351 920 320 174',
  whatsappNumber: '351920320174',
  whatsappMessage: 'Olá! Gostaria de pedir um orçamento para higienização de sofás ou estofados.',
  heroImage: { src: '/sofaclean/photos/equipa.webp', alt: 'Equipa SofaClean preparada para cuidar dos seus estofos' } as { src: string; alt: string } | null,
  services: [
    { icon: Sofa, title: 'Higienização de sofás', text: 'Cuidados para o tecido e limpeza do sofá, com avaliação prévia do seu estado.', note: 'Valores a consultar', image: '/sofaclean/icons/sofas.svg' },
    { icon: Armchair, title: 'Higienização de poltronas', text: 'Limpeza cuidada de poltronas, adaptada ao material e às necessidades de cada peça.', note: 'Valores a consultar', image: '/sofaclean/icons/poltronas.svg' },
    { icon: BedDouble, title: 'Higienização de colchões', text: 'Higienização do colchão com avaliação do revestimento e orientação sobre a secagem.', note: 'Valores a consultar', image: '/sofaclean/icons/colchoes.svg' },
    { icon: Hotel, title: 'Limpeza de alojamento', text: 'Limpeza de espaços de alojamento, com tarefas e condições acordadas antes do serviço.', note: 'Valores a consultar', image: '/sofaclean/icons/alojamento.svg' },
    { icon: Building2, title: 'Limpeza de escritórios', text: 'Cuidados de limpeza para postos de trabalho e áreas comuns de espaços profissionais.', note: 'Valores a consultar', image: '/sofaclean/icons/escritorios.svg' },
    { icon: House, title: 'Limpeza doméstica', text: 'Limpeza da sua casa, ajustada às divisões e às tarefas de que precisa.', note: 'Valores a consultar', image: '/sofaclean/icons/domestica.svg' },
    { icon: SprayCan, title: 'Limpeza em geral', text: 'Soluções de limpeza para diferentes espaços, mediante avaliação e orçamento.', note: 'Valores a consultar', image: '/sofaclean/icons/geral.svg' },
    { icon: Paintbrush, title: 'Limpeza pós obra', text: 'Limpeza após obras ou remodelações, com avaliação das superfícies e dos resíduos.', note: 'Valores a consultar', image: '/sofaclean/icons/pos-obra.svg' },
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
    { question: 'Onde atua a Sofa Clean Porto?', answer: 'Prestamos serviços ao domicílio nas regiões do Porto e Braga. Envie a sua localidade para confirmar a cobertura, disponibilidade e condições de deslocação.' },
    { question: 'Como peço um orçamento?', answer: 'Contacte-nos pelo WhatsApp, telemóvel ou email. Indique a sua localidade, o tipo e a dimensão do artigo e, se possível, envie fotografias do estofo.' },
    { question: 'O sofá fica molhado? Quanto tempo demora a secar?', answer: 'Utilizamos equipamentos profissionais de alta extração para deixar o estofado com humidade residual mínima. A secagem média varia entre 3 a 6 horas, dependendo da ventilação, do tecido e das condições do ambiente.' },
    { question: 'Posso utilizar o sofá logo após a higienização?', answer: 'Recomendamos aguardar a secagem completa para garantir o melhor resultado e evitar marcas prematuras no tecido.' },
    { question: 'Conseguem tirar manchas e odores de vinho, sangue e gordura?', answer: 'Trabalhamos com técnicas avançadas para remover sujidade, manchas e odores (como vinho, sangue, café, gordura e urina). O resultado final depende do tipo de tecido, da substância e do tempo da nódoa. Envie uma fotografia para avaliarmos previamente; não garantimos a remoção a 100% de todas as manchas.' },
    { question: 'A higienização elimina ácaros e bactérias?', answer: 'Sim. Utilizamos produtos e técnicas profissionais que ajudam a eliminar ou reduzir significativamente ácaros, bactérias e outros microrganismos presentes no estofado.' },
    { question: 'Qual a diferença entre a limpeza normal e a higienização completa?', answer: 'A limpeza remove a sujidade superficial e resíduos profundos. Os tratamentos adicionais (como anti-ácaros e desbacterização profunda) são recomendados para casos de alergias ou para uma desinfeção sanitária completa.' },
    { question: 'Com que frequência devo higienizar o sofá?', answer: 'Recomendamos realizar a higienização profissional a cada 6 meses, podendo este período variar conforme a intensidade de uso, a presença de animais de estimação ou crianças, e as caraterísticas do ambiente.' },
    { question: 'Limpam sofás de couro, alcântara e veludo?', answer: 'Sim, com produtos e técnicas específicos para cada material:\n\n• Couro e pele genuína: limpeza com produto desengordurante neutro seguido de hidratante, que preserva a flexibilidade e evita rachas.\n• Alcântara: produto de pH neutro aplicado a seco com pressão controlada.\n• Veludo: extração na direção do pelo com cabeçote especializado para restaurar a textura.\n• Couro sintético (PU) e microfibra: processo adaptado ao nível de sujidade.' },
    { question: 'É necessário preparar alguma coisa antes da vinda do técnico?', answer: 'Apenas pedimos que retire objetos pessoais, mantas ou almofadas decorativas do estofado. O técnico necessita apenas de acesso a uma tomada elétrica e, pontualmente, a uma fonte de água para o funcionamento do equipamento.' },
    { question: 'Quais são os métodos de pagamento aceites?', answer: 'Aceitamos pagamentos por transferência bancária, MB Way ou dinheiro, a efetuar no momento da conclusão do serviço após a verificação e aprovação por parte do cliente.' },
    { question: 'Existe alguma garantia no serviço prestado?', answer: 'Sim. Se detetar alguma inconformidade relacionada diretamente com a execução da limpeza nas primeiras 24 horas após o serviço, pedimos que nos contacte de imediato para avaliarmos a situação e efetuarmos o ajuste necessário sem custos adicionais.' }
  ],
  // Apenas fotografias e avaliações reais autorizadas. Secções ocultas quando vazias.
  projects: [
    { title: 'Higienização de sofá', before: '/sofaclean/photos/sofa_antes.webp', after: '/sofaclean/photos/sofa_depois.webp' },
    { title: 'Higienização de colchão', before: '/sofaclean/photos/colchao_antes.webp', after: '/sofaclean/photos/colchao_depois.webp' },
    { title: 'Limpeza de tapete', before: '/sofaclean/photos/tapete_antes.webp', after: '/sofaclean/photos/tapete_depois.webp' },
    { title: 'Higienização de banco de carro', before: '/sofaclean/photos/banco_carro_antes.webp', after: '/sofaclean/photos/banco_carro_depois.webp' },
  ] as { title: string; before: string; after: string }[],
  googleReviews: { url: 'https://share.google/sy3XCoSj15maT1CxE', rating: 5 as number | null, count: 42 as number | null, checkedOn: '18/09/2026' },
  testimonials: [
    { quote: 'Empresa de confiabilidade, transparência e muito profissionalismo. Indico imenso!', author: 'Daniel Cambui', rating: 5, url: 'https://share.google/sy3XCoSj15maT1CxE' },
    { quote: 'Amei! Profissionais super competentes, responsáveis e ágeis. Obrigada 🙏', author: 'Luiza Bittencourt', rating: 5, url: 'https://share.google/sy3XCoSj15maT1CxE' },
    { quote: 'Muito bom serviço , grandes profissionais. …', author: 'Luiz Felipe Gomes da Costa', rating: 5, url: 'https://share.google/sy3XCoSj15maT1CxE' },
  ] as { quote: string; author: string; rating?: number; date?: string; url?: string }[],
};

export type GeneralServicesContent = typeof generalServicesContent;

