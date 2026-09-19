import { SofaCleanPage as LandingPage } from '@/sofaclean_site/SofaCleanPage';
import { generalServicesContent } from '@/sofaclean_site/content';
export const metadata = { title: 'SofaClean | Seu estofo novo de novo | Porto e Braga', description: 'Seu estofo novo de novo. Higienização de sofás e estofados ao domicílio nas regiões do Porto e Braga. Peça orçamento pelo WhatsApp +351 920 320 174.' };
export default function SofaCleanPage() {
  const schema = { '@context':'https://schema.org', '@graph': [
    { '@type':'LocalBusiness', '@id':'/sofaclean#business', name:'SofaClean', slogan:'Seu estofo novo de novo', description:metadata.description, url:'/sofaclean', telephone:'+351920320174', areaServed:['Porto','Braga'], sameAs:['https://www.instagram.com/sofaclean.porto'], priceRange:'Consultar', hasOfferCatalog:{ '@type':'OfferCatalog', name:'Serviços SofaClean', itemListElement:generalServicesContent.services.map(s=>({'@type':'Offer', itemOffered:{'@type':'Service', name:s.title, description:s.text, provider:{'@id':'/sofaclean#business'}}})) } },
    { '@type':'WebSite', '@id':'/sofaclean#website', name:'SofaClean', url:'/sofaclean', inLanguage:'pt-PT', publisher:{'@id':'/sofaclean#business'} },
    { '@type':'FAQPage', '@id':'/sofaclean#faq', mainEntity:generalServicesContent.faqs.map(f=>({'@type':'Question', name:f.question, acceptedAnswer:{'@type':'Answer', text:f.answer}})) },
  ] };
  return <><script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(schema).replace(/</g,'\\u003c')}} /><LandingPage /></>;
}
