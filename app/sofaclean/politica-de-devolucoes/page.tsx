import { LegalPage } from '@/sofaclean_site/LegalPage';
import { returnsPolicyHtml } from '@/sofaclean_site/returnsPolicy';

export const metadata = { alternates: { canonical: 'https://www.sofacleanpt.pt/sofaclean/politica-de-devolucoes' }, title: 'Política de Reembolsos e Cancelamentos | SofaClean Porto', description: 'Condições de cancelamento, reembolso de pagamentos antecipados, garantia de repetição e contactos da SofaClean Porto.' };

export default function ReturnsPolicyPage() {
  return <LegalPage title="Política de Reembolsos e Cancelamentos"><div dangerouslySetInnerHTML={{ __html: returnsPolicyHtml }} /></LegalPage>;
}
