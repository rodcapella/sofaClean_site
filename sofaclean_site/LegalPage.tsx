import { SofaCleanFooter } from './Footer';
import { SofaCleanWhatsApp } from './SofaCleanWhatsApp';
import Link from 'next/link';
import './index.css';

export function LegalPage({ title, children, updatedAt = '18 de setembro de 2026' }: { title: string; children: React.ReactNode; updatedAt?: string }) {
  return <div className="template" id="top"><header className="shell nav"><Link href="/sofaclean" className="brand"><strong>SofaClean</strong></Link><Link href="/sofaclean">Voltar ao início</Link></header><main className="shell legal-content"><p className="kicker">INFORMAÇÃO AO CLIENTE</p><h1>{title}</h1><p>Última atualização: {updatedAt}</p>{children}<p className="legal-back-top"><a href="#top">↑ Voltar ao topo</a></p></main><SofaCleanFooter /><SofaCleanWhatsApp /></div>;
}



