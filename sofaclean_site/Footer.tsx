
export function SofaCleanFooter({ onOpenLegal }: { onOpenLegal?: (kind: 'terms' | 'returns' | 'privacy') => void }) {
  return <footer className="sofaclean-footer"><div className="shell">
    <nav className="footer-policy-links" aria-label="Informação legal">
      <a href="#privacidade" onClick={event => { if (onOpenLegal) { event.preventDefault(); onOpenLegal('privacy'); } }}>Política de Privacidade</a>
      <a href="#termos" onClick={event => { if (onOpenLegal) { event.preventDefault(); onOpenLegal('terms'); } }}>Termos e Condições</a>
      <a href="#devolucoes" onClick={event => { if (onOpenLegal) { event.preventDefault(); onOpenLegal('returns'); } }}>Política de Reembolsos e Cancelamentos</a>
    </nav>
    <p className="footer-copyright">© 2026 Sofa Clean Porto . Todos os direitos reservados.</p>
    <div className="footer-developer"><span>Desenvolvido por</span><a href="https://www.sapienteai.com/pt" target="_blank" rel="noopener"><Image unoptimized src="/sofaclean/logos/logo_sapiente_transparente.webp" alt="" width={1536} height={1024} /></a></div>
  </div></footer>;
}


import Image from 'next/image';
