export function whatsappLink(number: string, message: string) {
  return `https://wa.me/${number.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`;
}

export const whatsappMessages = {
  specialist: 'Olá! Gostaria de falar com um especialista da SofaClean sobre a higienização do meu sofá.',
  information: 'Olá! Tenho dúvidas sobre os serviços da SofaClean e gostaria de receber mais informações.',
  contact: 'Olá! Gostaria de falar com a SofaClean sobre os cuidados e serviços adequados ao meu sofá.',
  quote: 'Olá! Gostaria de pedir um orçamento à SofaClean. Posso enviar a minha localidade e os detalhes do serviço?',
  coverage: 'Olá! Gostaria de pedir um orçamento e confirmar a disponibilidade da SofaClean para uma localidade fora do Porto e Braga e região.',
  help: 'Olá! Preciso de ajuda para escolher o serviço da SofaClean adequado ao meu sofá.',
  support: 'Olá! Gostaria de contactar a SofaClean sobre cancelamentos, reembolsos ou apoio pós-serviço.',
  review: 'Olá! Gostaria de partilhar a minha experiência com a SofaClean.',
};

export function serviceWhatsAppMessage(service: string) {
  return `Olá! Gostaria de pedir um orçamento para o serviço de ${service.toLocaleLowerCase('pt-PT')}. Posso enviar a minha localidade e mais detalhes?`;
}
