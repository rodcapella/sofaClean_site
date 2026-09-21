'use client';

import { useEffect } from 'react';
import { X } from 'lucide-react';

type LegalKind = 'terms' | 'returns' | 'privacy';

const titles: Record<LegalKind, string> = {
  terms: 'Termos e Condições',
  returns: 'Política de Devoluções',
  privacy: 'Política de Privacidade',
};

export function LegalModal({ kind, onClose }: { kind: LegalKind; onClose: () => void }) {
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => event.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = previous; };
  }, [onClose]);

  return <div className="legal-modal-backdrop" role="presentation" onMouseDown={event => event.target === event.currentTarget && onClose()}>
    <section className="legal-modal" role="dialog" aria-modal="true" aria-labelledby="legal-modal-title">
      <button className="legal-modal-close" type="button" onClick={onClose} aria-label="Fechar"><X size={22} /></button>
      <div className="legal-modal-content">
        <p className="kicker">INFORMAÇÃO AO CLIENTE</p><h2 id="legal-modal-title">{titles[kind]}</h2><p className="legal-updated">Última atualização: setembro de 2026</p>
        {kind === 'terms' && <><p>A Sofa Clean Porto presta serviços de limpeza, higienização e impermeabilização profissional de sofás, colchões, tapetes, cadeiras e outros estofos, no domicílio do cliente ou em local acordado.</p><h3>Orçamentos e marcações</h3><p>Os orçamentos são gratuitos e sem compromisso. O preço final é confirmado antes da marcação, considerando os artigos, dimensões, tratamentos e deslocação. Qualquer serviço adicional solicitado no local será previamente reorçamentado.</p><h3>Condições do serviço</h3><p>O cliente deve assegurar acesso ao local e pontos funcionais de água e eletricidade. Os resultados dependem do estado, idade, composição e tipo de sujidade do estofo; limitações técnicas e manchas permanentes são comunicadas antes da intervenção.</p><h3>Pagamento, cancelamento e reclamações</h3><p>O pagamento é feito no final, por transferência bancária, MB Way ou numerário. Cancelamentos ou reagendamentos devem ser comunicados com 24 horas de antecedência. Insatisfações fundamentadas devem ser comunicadas até 48 horas após o serviço para análise e eventual repetição da intervenção.</p><p>O tratamento de dados segue a Política de Privacidade e o RGPD. Estes termos regem-se pela lei portuguesa.</p></>}
        {kind === 'returns' && <><p>A Sofa Clean Porto presta um serviço personalizado de limpeza e higienização ao domicílio. Por se tratar de uma prestação de serviços, não existem devoluções de produtos após a conclusão da intervenção.</p><h3>Direito de livre resolução</h3><p>Nos contratos celebrados à distância aplica-se, quando legalmente previsto, o prazo de 14 dias. Se o cliente solicitar o início imediato e o serviço for integralmente concluído, o direito de livre resolução extingue-se nos termos da legislação aplicável.</p><h3>Garantia de serviço</h3><p>Qualquer insatisfação fundamentada deve ser comunicada até 48 horas após a conclusão. Depois de validada, a empresa poderá repetir a intervenção sem custos adicionais, considerando as limitações do material e da mancha.</p><p>Para esclarecimentos, contacte-nos através de <a href="mailto:sofaclean.porto@gmail.com">sofaclean.porto@gmail.com</a>.</p></>}
        {kind === 'privacy' && <><p>A Sofa Clean Porto trata os dados pessoais fornecidos através do website, email, telefone e WhatsApp para responder a pedidos, preparar orçamentos e prestar serviços.</p><h3>Dados e conservação</h3><p>Recolhemos apenas os dados necessários, como nome, contacto e detalhes do serviço. Os dados são conservados pelo período necessário à finalidade ou exigido por lei e não são vendidos a terceiros.</p><h3>Os seus direitos</h3><p>Pode solicitar acesso, retificação, apagamento, limitação, portabilidade ou oposição ao tratamento dos seus dados. Para exercer os seus direitos, escreva para <a href="mailto:sofaclean.porto@gmail.com">sofaclean.porto@gmail.com</a>. Também pode reclamar junto da <a href="https://www.cnpd.pt/" target="_blank" rel="noreferrer">CNPD</a>.</p></>}
      </div>
    </section>
  </div>;
}
