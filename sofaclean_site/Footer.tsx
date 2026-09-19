import Image from 'next/image';
import Link from 'next/link';

export function SofaCleanFooter() {
  return <footer className="sofaclean-footer"><div className="shell">
    <p>© 2026 Sofa Clean Porto . Todos os direitos reservados.</p>
    <nav className="footer-policy-links" aria-label="Informação legal">
      <a href="https://cleansolutions.com.pt/politica-de-privacidade">Política de Privacidade</a>
      <a href="/sofaclean/termos-e-condicoes">Termos e Condições</a>
      <a href="/sofaclean/politica-de-devolucoes">Política de Devoluções</a>
      <a href="https://www.livroreclamacoes.pt/inicio">Livro de Reclamações</a>
    </nav>
    <div className="footer-developer"><span>Desenvolvido por</span><a href="https://sapienteai.com" target="_blank" rel="noopener noreferrer" aria-label="Sapiente.AI — visitar site"><Image unoptimized src="/sofaclean/images/logo_sapiente_transparente.webp" alt="Sapiente.AI" width={1536} height={1024} /></a></div>
  </div></footer>;
}


