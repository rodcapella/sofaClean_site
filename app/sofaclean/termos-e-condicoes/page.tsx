import Link from 'next/link';
import { LegalPage } from '@/sofaclean_site/LegalPage';
export const metadata = { title: 'Termos e Condições | Sofa Clean Porto', description: 'Orçamentos, serviços, pagamentos, cancelamentos e condições da Sofa Clean Porto.' };
export default function TermsPage() {
  return <LegalPage title="Termos e Condições" updatedAt="setembro de 2026">
    <h2>1. Identificação</h2>
    <ul><li><strong>Marca:</strong> Sofa Clean Porto (serviço de limpeza e higienização profissional de estofos ao domicílio).</li><li><strong>Área de atuação:</strong> regiões do Porto e Braga, Portugal.</li><li><strong>Telefone / WhatsApp:</strong> <a href="tel:+351920320174">+351 920 320 174</a> · <a href="https://wa.me/351920320174">Contactar pelo WhatsApp</a>.</li></ul>
    <h2>2. Objeto</h2>
    <p>A Sofa Clean Porto presta serviços de limpeza, higienização e impermeabilização profissional de sofás, colchões, tapetes, cadeiras e outros estofos, realizados no domicílio do cliente ou em local previamente acordado entre as partes.</p>
    <h2>3. Orçamentos e reservas</h2>
    <p><strong>3.1.</strong> Os orçamentos iniciais são gratuitos e sem compromisso, podendo ser solicitados via WhatsApp ou telefone. A confirmação do serviço é feita por escrito e só se torna vinculativa após a validação expressa de ambas as partes.</p>
    <p><strong>3.2.</strong> Os valores apresentados em simulações automáticas online, quando disponibilizadas, constituem estimativas. O preço final é confirmado com base na tipologia dos artigos, dimensões, tratamentos aplicados e taxa de deslocação antes da validação da marcação.</p>
    <p><strong>3.3.</strong> O valor confirmado mantém-se inalterado para o serviço contratado; quaisquer alterações ou adições solicitadas no local serão objeto de reorçamentação prévia.</p>
    <h2>4. Prestação do serviço</h2>
    <p><strong>4.1.</strong> O cliente obriga-se a assegurar condições mínimas de acesso ao local, bem como pontos de água e eletricidade funcionais. Em caso de impossibilidade de acesso na data e hora acordadas por motivo imputável ao cliente, poderá ser aplicada uma taxa de deslocação.</p>
    <p><strong>4.2.</strong> A empresa aplica os produtos, técnicas e equipamentos adequados ao tipo de material identificado. Os resultados obtidos dependem estritamente do estado de conservação, idade, composição e natureza da sujidade pré-existente no estofo.</p>
    <p><strong>4.3.</strong> As limitações técnicas, o desgaste natural ou a existência de manchas permanentes são explicadas previamente ou no início da intervenção. Estas limitações não constituem motivo de reembolso, sem prejuízo da garantia comercial de repetição prevista na cláusula 8.</p>
    <h2>5. Direito de livre resolução</h2>
    <p>Nos termos do Decreto-Lei n.º 24/2014, de 14 de fevereiro, o consumidor dispõe, em regra, de um prazo de 14 dias para resolver livremente contratos celebrados à distância. Ao confirmar a marcação, o cliente solicita expressamente o início imediato da prestação e reconhece que, após a conclusão integral do serviço, perde o direito de livre resolução, nos termos da alínea a) do n.º 1 do artigo 17.º do referido diploma.</p>
    <h2>6. Pagamento</h2>
    <p>O pagamento do serviço é efetuado integralmente no final da respetiva prestação, salvo acordo prévio escrito em contrário. São aceites os seguintes métodos de pagamento: transferência bancária, MB Way e numerário.</p>
    <h2>7. Cancelamentos e reagendamentos</h2>
    <p>O cancelamento ou reagendamento de um serviço deve ser comunicado com uma antecedência mínima de 24 horas. Cancelamentos efetuados com menos de 24 horas de antecedência ou ausências injustificadas no local poderão implicar a aplicação de uma taxa de deslocação e inconveniência.</p>
    <h2>8. Reclamações e garantia comercial</h2>
    <p>Caso o cliente manifeste insatisfação fundamentada, dispõe de um prazo máximo de 48 horas após a conclusão do serviço para o comunicar. Validada a reclamação, a empresa procede à repetição da intervenção sem custos adicionais. Após este prazo, a garantia comercial de repetição expira, salvaguardando-se os direitos legais aplicáveis. Para mais detalhes, consulte a nossa <a href="/sofaclean/politica-de-devolucoes">Política de Devoluções / Reembolsos</a>.</p>
    <h2>9. Propriedade intelectual</h2>
    <p>Todo o conteúdo disponibilizado neste website (incluindo textos, imagens, gráficos, logótipos e código) é propriedade exclusiva da Sofa Clean Porto, encontrando-se protegido pelos direitos de autor e propriedade intelectual, sendo expressamente proibida a sua reprodução sem autorização prévia.</p>
    <h2>10. Proteção de dados</h2>
    <p>O tratamento de dados recolhidos no âmbito da atividade comercial é efetuado em estrito cumprimento da nossa <a href="/sofaclean/privacidade">Política de Privacidade</a> e do Regulamento Geral de Proteção de Dados (RGPD).</p>
    <h2>11. Resolução alternativa de litígios e lei aplicável</h2>
    <p>Em caso de litígio de consumo, o consumidor pode recorrer ao Centro Nacional de Informação e Arbitragem de Conflitos de Consumo (CNIACC), com sítio em <a href="https://www.cniacc.pt/">www.cniacc.pt</a>. Os presentes Termos e Condições regem-se integralmente pela lei portuguesa. Para a resolução de quaisquer litígios emergentes deste contrato que não sejam resolvidos por via arbitral, será competente o tribunal da comarca do Porto.</p>
  </LegalPage>;
}

