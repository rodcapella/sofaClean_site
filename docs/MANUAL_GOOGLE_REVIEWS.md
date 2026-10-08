# Manual do componente de avaliações Google

Versão 1.0 · 8 de outubro de 2026 · SofaClean / Sapiente.AI

Este guia descreve a implementação no repositório `sofaclean_site`, branch `feat/google-reviews-by-profile`, commit inicial `4d25df7`. A configuração atual é para a SofaClean. Sapiente AI e Infolite são destinos posteriores; rpovoadata e Miko ficam fora desta integração.

## 1. Finalidade e funcionamento

O módulo consulta avaliações de **um perfil Google Business**, identificado por `accountId` e `locationId`. Renova o access token, percorre todas as páginas e guarda uma seleção limitada numa cache temporária. O site lê essa cache e apresenta autor, comentário original, estrelas, data e link de origem.

```text
IDs e autorização OAuth no servidor
  → atualização privada autenticada
  → páginas de avaliações do perfil Google
  → cache temporária Redis
  → API de leitura do site
  → componente de avaliações SofaClean
```

A média e contagem globais vêm do Google. Não são recalculadas a partir dos cartões apresentados. O módulo não pesquisa empresas por nome, não descobre automaticamente contas/perfis, não faz scraping e não envia respostas às avaliações.

## 2. Ficheiros

| Caminho, relativo à raiz SofaClean | Função |
|---|---|
| `shared/google-reviews/server/google-client.mjs` | OAuth e recolha completa das páginas |
| `shared/google-reviews/server/cache.mjs` | Cache Redis; memória apenas para testes/desenvolvimento |
| `shared/google-reviews/server/service.mjs` | Seleção, substituição, expiração e bloqueio de atualização |
| `shared/google-reviews/server/http.mjs` | Adaptadores HTTP e autenticação da atualização |
| `shared/google-reviews/react/useGoogleReviews.ts` | Leitura do endpoint pelo navegador |
| `shared/google-reviews/react/GoogleReviews.tsx` | Widget independente para reutilização |
| `shared/google-reviews/adapters/sofaclean.ts` | Conversão para os campos do layout SofaClean |
| `sofaclean_site/CustomerReviews.tsx` | Componente existente ligado à consulta |
| `app/api/google-reviews/route.ts` | Endpoint público de leitura |
| `app/api/google-reviews-refresh/route.ts` | Atualização privada e eliminação de cache |
| `shared/google-reviews/.env.example` | Nomes das variáveis, sem segredos |
| `shared/google-reviews/tests/` | Testes simulados e testes no navegador |
| `shared/google-reviews/examples/` | Templates `.ts.example` para outras aplicações |

A implementação é própria em JavaScript/TypeScript. O projeto Python `google-reviews-client` foi avaliado, mas não é uma dependência desta solução.

## 3. Requisitos

O backend instalado usa Node/Vercel/Vinext. Requer projeto Google com acesso às APIs Business Profile, perfil verificado e autorização OAuth de um utilizador com acesso ao perfil. A API exige o scope `https://www.googleapis.com/auth/business.manage` e suporta páginas de até 50 avaliações. [Referência oficial](https://developers.google.com/my-business/reference/rest/v4/accounts.locations.reviews/list).

Também são necessários Redis REST e uma tarefa privada periódica. O módulo não obtém a aprovação do Google nem cria automaticamente credenciais ou agendamentos.

`accountId` e `locationId` são os IDs dos recursos Business Profile. Não são o nome da empresa, Place ID, CID ou URL pública. A localização pretendida tem o formato:

```text
accounts/123456789/locations/987654321
```

Os valores acima são fictícios. O código atual aceita IDs numéricos de 1–40 caracteres. Cada instalação utiliza um par de IDs fixo no servidor.

## 4. Variáveis e local de configuração

| Variável | Onde fica | Finalidade |
|---|---|---|
| `GOOGLE_REVIEWS_ACCOUNT_ID` | Servidor | ID da conta |
| `GOOGLE_REVIEWS_LOCATION_ID` | Servidor | ID da localização |
| `GOOGLE_REVIEWS_URL` | Servidor; devolvido como link público | URL pública real do perfil |
| `GOOGLE_REVIEWS_NAMESPACE` | Servidor | Isolar site/ambiente na cache |
| `GOOGLE_REVIEWS_CLIENT_ID` | Servidor | Cliente OAuth do projeto |
| `GOOGLE_REVIEWS_CLIENT_SECRET` | Segredo do servidor | Autenticação OAuth |
| `GOOGLE_REVIEWS_REFRESH_TOKEN` | Segredo do servidor | Renovar access tokens |
| `UPSTASH_REDIS_REST_URL` | Servidor | Endpoint HTTPS Redis REST |
| `UPSTASH_REDIS_REST_TOKEN` | Segredo do servidor | Acesso à cache |
| `CRON_SECRET` | Segredo do servidor | Autenticar atualização/eliminação; mínimo 32 caracteres |
| `VITE_GOOGLE_REVIEWS_ENABLED` | Ambiente de compilação frontend | `true` ativa a consulta visual; por defeito desativada |

Defina segredos na plataforma, não em ficheiros versionados ou no frontend. Não use `VITE_` ou `NEXT_PUBLIC_` para IDs/credenciais. A opção `VITE_GOOGLE_REVIEWS_ENABLED` é pública e não contém dados de autenticação. Alterá-la exige recompilar a aplicação.

Use, por exemplo, namespace `sofaclean-production` em produção e outro em preview. Redis pode ser partilhado com os formulários, mantendo chaves separadas. Sem Redis configurado, a API falha de forma fechada.

O link público precisa de HTTPS e de um hostname aceite: `google.com`, `www.google.com`, `maps.google.com`, `share.google`, `maps.app.goo.gl` ou `g.page`. Use o link real fornecido pelo perfil; não invente um link específico para cada avaliação quando a API não o fornece.

## 5. Obter a autorização OAuth

1. Prepare o projeto Google autorizado, o consentimento OAuth e as credenciais de uma aplicação web.
2. Inicie a autorização com o scope `business.manage`, acesso offline e consentimento do utilizador autorizado.
3. Troque o authorization code por tokens e guarde o refresh token como segredo.
4. Configure client ID, client secret e refresh token no mesmo ambiente que executará as atualizações.

O refresh token permite renovar access tokens sem repetir o login a cada tarefa. O acesso offline e a troca de códigos estão descritos no [guia OAuth oficial](https://developers.google.com/identity/protocols/oauth2/web-server).

Para configuração assistida, pode usar o [OAuth Playground](https://developers.google.com/oauthplayground/) com **as suas próprias credenciais**, adicionando temporariamente o redirect URI `https://developers.google.com/oauthplayground`. Depois de configurar, reveja e remova redirects de teste que não sejam necessários. Confirme também o estado de publicação/Testing do consentimento e a validade efetiva do token.

Não envie tokens por chat, email, capturas ou Git. Autorizar um utilizador não torna todos os perfis acessíveis: os IDs configurados têm de corresponder a um perfil autorizado para essa conta.

## 6. Primeira sincronização e ativação

### Passo 1 — Configurar o backend

Preencha as variáveis do servidor e disponibilize os endpoints no ambiente a validar. Mantenha a opção visual desativada durante esta preparação. A SofaClean continua com os dados manuais e a respetiva data real.

### Passo 2 — Executar a atualização privada

Exemplo PowerShell para um administrador, com o segredo já carregado numa variável de ambiente local. O domínio abaixo é ilustrativo; use o ambiente correto.

```powershell
$reviewsSiteUrl = 'https://www.sofacleanpt.pt'
$reviewsHeaders = @{ Authorization = 'Bearer ' + $env:CRON_SECRET }
Invoke-RestMethod -Method Post `
  -Uri ($reviewsSiteUrl + '/api/google-reviews-refresh') `
  -Headers $reviewsHeaders
```

Uma atualização concluída devolve `ok`, `fetchedAt`, `totalReviewCount` e `displayedReviewCount`. O POST não precisa de corpo nem de IDs. Não coloque o segredo na URL.

### Passo 3 — Confirmar a leitura

```powershell
Invoke-RestMethod -Method Get `
  -Uri ($reviewsSiteUrl + '/api/google-reviews')
```

Confirme a URL do perfil, os autores, a média, a contagem e a data da consulta. O endpoint não aceita `?accountId=...` nem `?locationId=...`; o perfil é escolhido no servidor.

### Passo 4 — Agendar

Configure uma tarefa privada que chama GET ou POST `/api/google-reviews-refresh` com Bearer `CRON_SECRET`. Escolha uma frequência com margem antes da expiração de 24h, de acordo com o plano e a quota efetiva. Vercel Cron usa GET; outro agendador pode usar POST. O agendamento deve ter monitorização de falhas.

Não existe agendamento instalado por esta implementação. Uma tarefa diária tem pouca margem: atrasos/falhas podem fazer a cache expirar. Não prolongue a retenção para esconder uma atualização que deixou de funcionar.

### Passo 5 — Ativar no frontend

Defina `VITE_GOOGLE_REVIEWS_ENABLED=true`, recompile e publique depois da verificação. No navegador, confirme `/api/google-reviews` com 200 e a apresentação automática. Até esta etapa, uma compilação bem-sucedida não significa que o Google está ligado.

## 7. API e respostas

| Endpoint | Método | Autenticação | Resultado |
|---|---|---|---|
| `/api/google-reviews` | GET | Sem segredo Google no visitante | Última cache válida |
| `/api/google-reviews-refresh` | GET / POST | Bearer `CRON_SECRET` | Nova recolha completa |
| `/api/google-reviews-refresh` | DELETE | Bearer `CRON_SECRET` | Apaga a cache |

Exemplo de resposta de leitura, com valores fictícios:

```json
{
  "source": "Google",
  "googleUrl": "https://share.google/exemplo",
  "fetchedAt": "2026-10-08T12:00:00.000Z",
  "averageRating": 4.7,
  "totalReviewCount": 42,
  "reviews": [{
    "id": "avaliacao-exemplo",
    "author": "Cliente de exemplo",
    "rating": 5,
    "comment": "Texto original da avaliação.",
    "createTime": "2026-10-01T10:00:00.000Z",
    "updateTime": "2026-10-01T10:00:00.000Z"
  }]
}
```

| HTTP | Significado | Ação |
|---|---|---|
| 200 | Leitura ou atualização concluída | Confirmar os dados |
| 400 | Query parameters não permitidos | Chamar a URL sem parâmetros |
| 401 | Bearer ausente/incorreto ou segredo insuficiente | Rever autenticação da tarefa |
| 405 | Método inválido | Usar os métodos da tabela |
| 409 | Outra sincronização em curso | Aguardar; não iniciar várias tarefas iguais |
| 503 | Cache, configuração ou Google indisponíveis | Verificar ambiente, OAuth, perfil e serviços |

Os erros públicos são genéricos. A API não revela tokens nem mensagens internas do Google. As respostas têm `Cache-Control: no-store`; a cache gerida é Redis.

## 8. Regras de recolha, cache e apresentação

| Regra atual | Valor/comportamento |
|---|---|
| Perfil | Um par `accountId`/`locationId` por instalação |
| Página Google | Até 50 resultados |
| Ordem | `updateTime desc` |
| Seleção guardada | Primeiros 12 resultados por defeito |
| `displayLimit` na fábrica do serviço | Inteiro de 1–20 |
| `cacheTtlSeconds` na fábrica do serviço | 300–86400 segundos; por defeito 24h |
| Limite de recolha | 1000 páginas por defeito |
| Tempo da recolha Google | 25 segundos por defeito |
| Tentativas transitórias | Até 4 por pedido para 429/5xx selecionados |
| Bloqueio de atualização | Redis, 120 segundos |
| Média/contagem | Valores globais fornecidos pelo Google |

`displayLimit` e TTL são opções da fábrica `createReviewsService`, não variáveis de ambiente implementadas. Para alterá-las, adapte a construção do serviço; não crie variáveis que o código não lê. O hook rejeita dados com mais de 24h desde a consulta. Se reduzir o TTL no servidor, a validade de uma página já aberta continua limitada pelo prazo do hook; considere harmonizar a expiração visual numa futura adaptação.

Todas as páginas são recolhidas antes de guardar a seleção limitada. Token repetido, limite excedido, resposta inválida ou mudança de contagem/média impedem a substituição por dados incompletos. O Google não fornece uma transação entre páginas; uma mudança durante a leitura pode exigir nova tentativa.

Atualizações completas refletem comentários editados e avaliações removidas. Uma resposta válida com zero avaliações substitui as antigas. Falhas conservam a cache anterior apenas até ao prazo original; não renovam a sua data. A cache não é um arquivo histórico.

No widget comum, comentários são texto React, sem execução de HTML, e não são carregadas fotografias externas. Na SofaClean, o adaptador mantém o layout existente. Se a consulta estiver desativada/indisponível, regressa ao conteúdo manual e à data manual; isso não equivale a uma consulta atual ao Google.

## 9. Reutilizar depois na Sapiente AI ou Infolite

Copie o núcleo `server/`, o frontend necessário e `types.ts`, configure um perfil próprio e use namespace distinto. Nunca envie as credenciais Google ao browser ou a outro cliente.

Para Vite/Vercel, os templates em `examples/vercel/*.ts.example` tornam-se `api/google-reviews.ts` e `api/google-reviews-refresh.ts`. Para Next/Vinext, os templates em `examples/next/*.ts.example` tornam-se as rotas App Router. Retire `.example` e ajuste os imports para a localização real.

Escolha o widget independente ou o hook para manter a identidade visual do site:

```tsx
import { GoogleReviews } from './shared/google-reviews/react';
import './shared/google-reviews/react/styles.css';

<GoogleReviews enabled={true} locale="pt-PT" title="A opinião dos nossos clientes" />;
```

O exemplo pressupõe backend configurado e primeira sincronização concluída. A opção `enabled` controla a leitura; `endpoint` pode selecionar outra rota da mesma origem. O hook recusa uma origem externa. O widget inclui textos PT/EN segundo o locale; não traduz o comentário original. Outros idiomas exigem adaptação de textos. O adaptador HTTP usa `node:crypto`; em Workers confirme compatibilidade Node ou forneça adaptação Web Crypto.

## 10. Diagnóstico

| Sintoma | Verificação |
|---|---|
| Aparecem apenas os testemunhos manuais | Opção de build, resposta da API e data da cache |
| Leitura devolve 503 antes da primeira atualização | IDs, URL, Redis e primeira sincronização |
| Atualização devolve 401 | `CRON_SECRET`, comprimento e cabeçalho Bearer |
| Atualização devolve 503 | Acesso Google, refresh token, IDs, quota ou Redis |
| Atualização devolve 409 | Tarefa concorrente; aguardar o bloqueio |
| Dados deixam de aparecer após 24h | Falha/ausência do agendamento |
| Menos cartões que avaliações globais | Seleção limitada para apresentação; contagem continua global |
| Perfil errado | Corrigir IDs e namespace no servidor; limpar cache antes de ativar |
| Interface não muda após alterar a opção | Recompilar a aplicação |

Ao diagnosticar, registe estados e códigos controlados, sem passwords, tokens ou corpos pessoais de avaliações. Não desative a autenticação ou aceite IDs arbitrários na API pública para resolver erros de configuração.

## 11. Testes e limites de validação

Na raiz SofaClean:

```sh
npm run test:google-reviews
npm run typecheck
```

No PowerShell, para a compilação Vercel:

```powershell
$env:VERCEL = '1'
npm.cmd run build:vercel
```

Os 18 testes simulados cobrem páginas, OAuth, cache, alterações/remoções, expiração, isolamento, bloqueio, retries, erros e contratos HTTP/frontend. O harness opcional no Chrome encontra-se em `shared/google-reviews/tests/browser/check.mjs` e cobre 6 cenários. Requer Chrome, Vite e `@playwright/test`; pode resolver as ferramentas de outro checkout através de `GOOGLE_REVIEWS_TEST_PACKAGE`, com o caminho absoluto do respetivo `package.json`.

Na implementação, passaram testes, verificações de navegador, tipos e build SofaClean. Esses registos não comprovam aprovação Google, OAuth de produção, acesso ao perfil, tarefa periódica ou publicação. Os testes não executam chamadas reais ao Google.

## 12. Desativar e manter

Desative a opção visual e pare o agendamento. Faça DELETE autenticado no endpoint de atualização para apagar a cache, revogue a autorização OAuth quando deixar de ser necessária e retire os segredos. Confirme que a tarefa não pode voltar a preencher a cache após a desativação.

A implementação limita armazenamento a uma seleção temporária de 24h. Não grave avaliações automáticas em Git, recursos SEO estáticos ou arquivos permanentes. A política Google estabelece regras de armazenamento temporário/limitado, acesso e atribuição; a retenção implementada não substitui a avaliação do uso autorizado pelo projeto. [Política oficial](https://developers.google.com/my-business/content/policies).

Reveja tokens, permissões, quota efetiva e falhas do agendamento periodicamente. Preserve autoria, comentários e atribuição. Na expansão para outra marca, configure e valide o respetivo perfil antes de ativar o frontend.
