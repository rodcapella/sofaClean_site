# SofaClean — higienização de sofás e estofados

Módulo da aplicação principal, disponível em `/sofaclean`. Usa as dependências e comandos da raiz.

- `content.ts`: marca, serviços, FAQ, Porto e Braga e região, telefone e WhatsApp.
- `SofaCleanPage.tsx`: ligação do conteúdo ao componente no cliente.
- `GeneralServicesLandingPage.tsx`: página e rodapé com contactos reais.
- `LegalPage.tsx`: apresentação comum das páginas legais.
- `app/sofaclean/termos-e-condicoes` e `app/sofaclean/privacidade`: textos específicos.
- `public/sofaclean/`: llms.txt, llms-full.txt e ai.json. O robots.txt é gerado por `app/robots.txt/route.ts` e o manifesto está em `public/.well-known/agent.json`.
- `app/sofaclean/sitemap.xml/route.ts`: sitemap com o endereço do alojamento atual.

## Referências e adaptação

Recursos de descoberta adaptados dos conceitos de `sapienteai_site/client/public`: identidade, serviços, respostas diretas, contactos, atribuição, limites de inferência e manifesto. Não é anunciada negociação Markdown, porque não está implementada. As preferências de IA são declarativas; os ficheiros não garantem indexação nem cumprimento por terceiros.

Temas dos termos revistos a partir de https://cleansolutions.com.pt/termos-e-condicoes, com redação própria. Não foram adotadas a garantia comercial de 48 horas, taxas, métodos de pagamento nem a renúncia automática por simples marcação da empresa de referência. Fontes legais: https://diariodarepublica.pt/dr/detalhe/decreto-lei/24-2014-572450 e https://www.cnpd.pt/cidadaos/direitos/.

## Antes da publicação definitiva

Faltam confirmar domínio, denominação legal, NIF, morada, email, entidade RAL competente, condições comerciais e informação operacional sobre conservação de dados e fornecedores. Os textos legais são uma base e devem receber essa identificação antes da publicação.

O Livro de Reclamações liga ao portal oficial geral; não afirma que o registo da empresa já foi verificado. Substituir pelo link da entidade quando disponível.

Domínio oficial: https://www.sofacleanpt.pt/. Metadados, URLs canónicas, sitemaps, robots.txt e recursos de SEO/GEO/AEO usam este domínio. Os caminhos existentes em `/sofaclean` são preservados; o robots.txt da raiz controla a descoberta.

O módulo não carrega mapas ou ferramentas de marketing automaticamente. WhatsApp, Instagram, TikTok e Google Maps são links externos. O componente global de contactos demonstrativos é omitido nesta rota.

Validação: `npm run typecheck`, `npm run lint`, `npm run build` e inspeção do navegador.
