import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { LegalModal } from './LegalModal';
import { Mail, Phone } from 'lucide-react';

export function SofaCleanFooter() {
  const [legal, setLegal] = useState<{path:string;title:string}|null>(null);
  return <footer className="sofaclean-footer"><div className="shell">
    <div className="footer-contact"><a href="tel:+351920320174"><Phone size={16}/> +351 920 320 174</a><a href="mailto:sofaclean.porto@gmail.com"><Mail size={16}/> sofaclean.porto@gmail.com</a></div>
    <p>© 2026 Sofa Clean Porto . Todos os direitos reservados.</p>
    <nav className="footer-policy-links" aria-label="Informação legal">
      <a href="/sofaclean/privacidade" onClick={e=>{e.preventDefault();setLegal({path:'/sofaclean/privacidade',title:'Política de Privacidade'})}}>Política de Privacidade</a>
      <a href="/sofaclean/termos-e-condicoes" onClick={e=>{e.preventDefault();setLegal({path:'/sofaclean/termos-e-condicoes',title:'Termos e Condições'})}}>Termos e Condições</a>
      <a href="/sofaclean/politica-de-devolucoes" onClick={e=>{e.preventDefault();setLegal({path:'/sofaclean/politica-de-devolucoes',title:'Política de Devoluções'})}}>Política de Devoluções</a>
      <a href="https://www.livroreclamacoes.pt/inicio" target="_blank" rel="noopener noreferrer">Livro de Reclamações</a>
    </nav>
    <div className="footer-developer"><span>Desenvolvido por</span><a href="https://sapienteai.com" target="_blank" rel="noopener noreferrer" aria-label="Sapiente.AI — visitar site"><Image unoptimized src="/sofaclean/logos/logo_sapiente_transparente.webp" alt="Sapiente.AI" width={1536} height={1024} /></a></div>
  </div>{legal && <LegalModal {...legal} onClose={()=>setLegal(null)} />}</footer>;
}





