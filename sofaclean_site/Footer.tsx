import Image from 'next/image';

export function SofaCleanFooter({ onOpenLegal }: { onOpenLegal?: (kind: 'terms' | 'returns' | 'privacy') => void }) {
  return <footer className="sofaclean-footer"><div className="shell">
    <p>© 2026 Sofa Clean Porto . Todos os direitos reservados.</p>
    <nav className="footer-policy-links" aria-label="Informação legal">
      <a href="#privacidade" onClick={event => { if (onOpenLegal) { event.preventDefault(); onOpenLegal('privacy'); } }}>Política de Privacidade</a>
      <a href="#termos" onClick={event => { if (onOpenLegal) { event.preventDefault(); onOpenLegal('terms'); } }}>Termos e Condições</a>
      <a href="#devolucoes" onClick={event => { if (onOpenLegal) { event.preventDefault(); onOpenLegal('returns'); } }}>Política de Devoluções</a>
      <a href="https://www.livroreclamacoes.pt/inicio" target="_blank" rel="noopener noreferrer">Livro de Reclamações</a>
    </nav>
    <div className="footer-developer"><span>Desenvolvido por</span><a href="https://sapienteai.com" target="_blank" rel="noopener noreferrer" aria-label="Sapiente.AI — visitar site"><Image unoptimized src="/sofaclean/images/logo_sapiente_transparente.webp" alt="Sapiente.AI" width={1536} height={1024} /></a></div>
  </div></footer>;
}

