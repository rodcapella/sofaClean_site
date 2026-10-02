import { SofaCleanPage as LandingPage } from '@/sofaclean_site/SofaCleanPage';
import { generalServicesContent } from '@/sofaclean_site/content';
export const metadata = { alternates: { canonical: 'https://www.sofacleanpt.pt/' }, title: 'SofaClean | Higienização de sofás no Porto e Braga e região', description: 'Higienização de sofás, poltronas e colchões, limpeza de tapete e de banco de carro e impermeabilização de estofos ao domicílio nas regiões do Porto e Braga e região. Peça orçamento pelo WhatsApp +351 925 535 456.' };
export default function SofaCleanPage() {
  const schema = { '@context':'https://schema.org', '@graph': [
    { '@type':'LocalBusiness', '@id':'https://www.sofacleanpt.pt/#business', name:'SofaClean', description:metadata.description, url:'https://www.sofacleanpt.pt/', telephone:'+351925535456', email:'sofaclean.porto@gmail.com', areaServed:['Porto','Braga','Porto e Braga e região'], sameAs:['https://www.instagram.com/sofaclean.porto', 'https://www.tiktok.com/@sofaclean.porto'], priceRange:'Consultar', hasOfferCatalog:{ '@type':'OfferCatalog', name:'Serviços SofaClean', itemListElement:generalServicesContent.services.map(s=>({'@type':'Offer', itemOffered:{'@type':'Service', name:s.title, description:s.text, provider:{'@id':'https://www.sofacleanpt.pt/#business'}}})) } },
    { '@type':'WebSite', keywords:'estofados, estofos, sofás, poltronas, colchões, tapetes, bancos de carro, impermeabilização', '@id':'https://www.sofacleanpt.pt/#website', name:'SofaClean', url:'https://www.sofacleanpt.pt/', inLanguage:'pt-PT', publisher:{'@id':'https://www.sofacleanpt.pt/#business'}, creator:{'@type':'Organization', name:'Sapiente.AI', url:'https://www.sapienteai.com/pt'} },
    { '@type':'FAQPage', '@id':'https://www.sofacleanpt.pt/sofaclean#faq', mainEntity:generalServicesContent.faqs.map(f=>({'@type':'Question', name:f.question, acceptedAnswer:{'@type':'Answer', text:f.answer}})) },
  ] };
  return <><script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(schema).replace(/</g,'\\u003c')}} /><LandingPage /></>;
}

