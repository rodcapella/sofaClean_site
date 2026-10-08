# get_google_reviews

Módulo reutilizável de avaliações de **um perfil Google Business por instalação**, configurado com `accountId` e `locationId` no servidor. Inclui recolha paginada, renovação OAuth, cache temporária Redis, API de leitura, atualização protegida, hook React, widget e adaptador para o layout da SofaClean.

Implementação própria em JavaScript/TypeScript, usando a API oficial. A avaliação de `cauethenorio/google-reviews-client` orientou a decisão; não copiámos código Python nem dependemos dessa biblioteca. Neste branch, o componente original da SofaClean encontra-se na raiz da aplicação em `sofaclean_site/`; os estilos e dados manuais continuam a servir de base à integração.

## Fluxo

```text
OAuth autorizado + accountId + locationId (servidor)
  → tarefa de atualização autenticada
  → Google /reviews: páginas de até 50 até terminar
  → substituição da cache temporária Redis
  → GET /api/google-reviews
  → hook / widget do site
```

Não existe listagem de contas/perfis no fluxo. Os visitantes não escolhem IDs, não recebem tokens e não provocam chamadas ao Google. Cada site configura o seu perfil. Partilhar as credenciais OAuth do projeto Sapiente entre instalações só é possível quando a conta autorizada tem acesso aos respetivos perfis; o token nunca é distribuído aos clientes/browser.

## Configurar o servidor

Requer Node 22+, projeto Google com acesso aprovado à Business Profile API e um utilizador OAuth autorizado no perfil verificado. `accountId` e `locationId` são os IDs de recursos Business Profile; **não são Place ID, CID, nome ou URL pública**.

Preencha as variáveis de `.env.example` no gestor de segredos da plataforma. Nunca use prefixos `VITE_`/`NEXT_PUBLIC_` para IDs, tokens ou credenciais. Use `GOOGLE_REVIEWS_NAMESPACE` diferente por site/ambiente quando partilhar Redis. `GOOGLE_REVIEWS_URL` deve ser o link público real do perfil, por exemplo `https://share.google/...`.

Para obter o refresh token, faça a autorização OAuth da conta proprietária/gestora com o scope `https://www.googleapis.com/auth/business.manage`, acesso offline e consentimento. Pode usar temporariamente o [OAuth Playground oficial](https://developers.google.com/oauthplayground/) com **as suas próprias credenciais** e redirect URI `https://developers.google.com/oauthplayground`. Troque o authorization code e guarde o refresh token como segredo; não o coloque em Git, mensagens ou capturas. Reveja o estado de publicação do consentimento OAuth: aplicações em modo Testing podem ter tokens de curta duração. Depois da configuração, remova redirects de teste desnecessários. O acesso real e a aprovação não são concedidos pelo módulo.

Redis usa `UPSTASH_REDIS_REST_URL`/`UPSTASH_REDIS_REST_TOKEN`; pode reutilizar o serviço existente dos formulários com namespace próprio. A cache de produção falha de forma fechada se faltar Redis. O adaptador em memória serve apenas para desenvolvimento/testes.

## Instalar nos sites Vite/Vercel (Sapiente e rpovoadata)

1. Copie `server/`, `react/` e `types.ts` para `shared/google-reviews/` na raiz do site. Não importe `server/` no frontend.
2. Copie os dois templates `examples/vercel/*.ts.example` para `api/google-reviews.ts` e `api/google-reviews-refresh.ts`, retirando o sufixo `.example`.
3. Configure os segredos no ambiente do projeto.
4. Agende uma chamada a `/api/google-reviews-refresh` com `Authorization: Bearer <CRON_SECRET>`. Vercel Cron usa GET e envia esse segredo quando `CRON_SECRET` está configurado; a frequência depende do plano. Outra tarefa privada pode usar POST.
5. Execute uma primeira atualização autenticada e confirme que GET `/api/google-reviews` devolve 200.
6. Monte o widget ou utilize o hook no layout existente. Ative a opção pública `VITE_GOOGLE_REVIEWS_ENABLED=true` só depois da primeira sincronização.

Exemplo para adicionar ao `vercel.json` existente (escolha a frequência suportada pelo seu plano):

```json
{ "crons": [{ "path": "/api/google-reviews-refresh", "schedule": "0 * * * *" }] }
```

Em planos com apenas uma execução diária, programe-a diariamente e aumente `cacheTtlSeconds` apenas até ao máximo implementado de 24h; haverá indisponibilidade caso a atualização atrase. Para continuidade com margem, use um agendador com maior frequência. Não foi criado um agendamento no projeto por esta implementação.

```tsx
import { GoogleReviews } from '../../shared/google-reviews/react';
import '../../shared/google-reviews/react/styles.css';

<GoogleReviews enabled={import.meta.env.VITE_GOOGLE_REVIEWS_ENABLED === 'true'} />
```

Ajuste o caminho relativo ao ficheiro de destino. O widget tem texto português, título e locale configuráveis, IDs únicos, estrelas acessíveis, datas, classificação global devolvida pelo Google e link de origem. Renderiza o comentário original como texto React; não usa HTML arbitrário nem fotografias externas. O CSS é limitado à classe `.google-reviews`.

## SofaClean / Next / Vinext

Use os templates `examples/next/*.ts.example` em `app/api/google-reviews/route.ts` e `app/api/google-reviews-refresh/route.ts`, retirando o sufixo `.example`, com runtime Node, no alojamento que suporte este runtime. O transporte HTTP para Vercel/Node usa `node:crypto`; em Workers confirme o suporte `nodejs_compat` ou substitua a verificação por Web Crypto. O cliente Google/cache/service usa fetch e pode receber um adaptador próprio para outro alojamento.

Para manter o layout original:

```tsx
const { data } = useGoogleReviews({ enabled: liveReviewsEnabled });
const displayedContent = data ? withGoogleReviews(content, data) : content;
return <CustomerReviews content={displayedContent} />;
```

`adapters/sofaclean.ts` mostra o mapeamento. Dados manuais de fallback devem manter a sua data real de consulta, sem indicar uma consulta automática que falhou. Uma resposta válida com zero avaliações substitui os testemunhos antigos. Os ficheiros originais copiados continuam disponíveis para uso manual.

## API

`GET /api/google-reviews` devolve:

```json
{
  "source": "Google",
  "googleUrl": "https://share.google/...",
  "fetchedAt": "2026-10-08T12:00:00.000Z",
  "averageRating": 4.7,
  "totalReviewCount": 42,
  "reviews": [{ "id": "...", "author": "...", "rating": 5, "comment": "Texto original", "createTime": "...", "updateTime": "..." }]
}
```

Não recebe parâmetros de consulta. Em falta de configuração/cache retorna 503 genérico. Não altera a classificação global com base nos cartões selecionados. Por defeito guarda os primeiros 12 resultados na ordem `updateTime desc`, sem escolher apenas avaliações positivas; o limite configurável é 1–20. Recolhe **todas** as páginas antes de substituir a cache, mas só persiste essa seleção limitada. Existem proteções contra tokens de paginação repetidos, limite de páginas, tempo máximo e mudanças na contagem/classificação durante a recolha. Uma recolha inconsistente é rejeitada e pode ser repetida na próxima atualização; a API Google não fornece uma transação entre páginas.

`GET`/`POST /api/google-reviews-refresh` exige Bearer `CRON_SECRET` com pelo menos 32 caracteres. Renova o access token, recolhe o perfil e publica o resultado só quando completo. `DELETE` no mesmo endpoint e com a mesma autenticação apaga a cache (desativação do serviço). Desative também o agendamento, revogue o acesso OAuth e retire os segredos quando terminar o serviço. A API de leitura não funciona como proxy para consultar perfis arbitrários.

O bloqueio Redis impede atualizações concorrentes. Erros do Google não expõem mensagens/tokens. Falhas temporárias 429/5xx têm tentativas limitadas e respeitam Retry-After dentro do orçamento de execução. Não existem ficheiros JSONL para substituir, evitando a falha Windows encontrada no projeto Python.

## Retenção e limites

Apenas cache temporária, TTL de 24h, leitura com verificação de expiração e `Cache-Control: no-store` no HTTP. O hook também remove dados ao atingir 24h desde a consulta. Atualizações substituem integralmente a seleção, incluindo alterações e remoções; falhas conservam a última consulta apenas até ao seu prazo original. Não adicione as avaliações automáticas ao Git, SEO estático ou a arquivos permanentes.

A [política Business Profile](https://developers.google.com/my-business/content/policies) limita armazenamento a conteúdo temporário e limitado, até 30 dias, e estabelece regras de acesso e atribuição. A retenção implementada é deliberadamente menor; não equivale a uma aprovação do Google para o uso comercial específico. Preserve autores, comentários e atribuição; confirme o enquadramento do projeto e dos sites antes de publicação. A [API reviews.list](https://developers.google.com/my-business/reference/rest/v4/accounts.locations.reviews/list) exige perfil verificado, OAuth e paginação até 50 avaliações por página. Verifique a quota efetiva do projeto aprovado no Google Cloud; o módulo não cria nem amplia quotas.

## Validação

```sh
npm run test
npm run typecheck
```

Testes locais usam Google e Redis simulados. Cobrem perfil único, OAuth, paginação, perfil vazio, alterações/remoções, cache/expiração/isolamento, bloqueio, retries, acesso negado, sanitização de erros, contratos frontend e adaptadores HTTP. Não comprovam aprovação, acesso real ao perfil, execução do agendador nem publicação em produção.
