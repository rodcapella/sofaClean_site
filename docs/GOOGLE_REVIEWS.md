# Avaliações Google — SofaClean

Implementação no branch `feat/google-reviews-by-profile`, limitada a um perfil por configuração: `accountId` e `locationId`. A Sapiente AI e a Infolite são destinos posteriores; rpovoadata e Miko ficam fora desta aplicação.

## O que está implementado

- `shared/google-reviews/server/`: cliente Google, renovação OAuth, paginação completa, cache Redis e adaptadores HTTP.
- `app/api/google-reviews/route.ts`: leitura da cache, sem receber perfis via query nem chamar Google por visitante.
- `app/api/google-reviews-refresh/route.ts`: atualização GET/POST e eliminação de cache DELETE, sempre com Bearer `CRON_SECRET`.
- `shared/google-reviews/react/`: hook e widget independente para reutilização futura.
- `shared/google-reviews/adapters/sofaclean.ts`: mapeamento para o componente atual.
- `sofaclean_site/CustomerReviews.tsx`: ligação ao hook, mantendo o layout existente e dados manuais quando a integração ainda está desativada/indisponível.
- `shared/google-reviews/tests/`: testes Google/Redis/HTTP/contrato frontend simulados.

A implementação é própria em JavaScript/TypeScript, alinhada com Node/Vercel/Vinext. A avaliação do projeto Python `google-reviews-client` serviu de referência; não existe dependência nem cópia desse código.

## Ativar

1. Obtenha acesso aprovado às APIs Google Business Profile e autorização OAuth de uma conta proprietária/gestora sobre o perfil verificado da SofaClean.
2. Configure os segredos de `shared/google-reviews/.env.example` no servidor: IDs de recursos Business Profile, URL pública real, client ID, client secret, refresh token, Redis e `CRON_SECRET` aleatório com pelo menos 32 caracteres. Os IDs não são Place ID ou CID.
3. Use scope `https://www.googleapis.com/auth/business.manage` e acesso offline para obter um refresh token. O [OAuth Playground oficial](https://developers.google.com/oauthplayground/) pode ajudar durante a configuração com credenciais próprias; nunca partilhe os tokens neste chat ou em Git. O guia completo está em `shared/google-reviews/README.md`.
4. Execute GET ou POST `/api/google-reviews-refresh` com `Authorization: Bearer <CRON_SECRET>`. Confirme que GET `/api/google-reviews` devolve 200 e o perfil correto.
5. Configure uma tarefa privada periódica segundo o plano do alojamento, com margem antes das 24h de expiração. Nenhum agendamento foi criado nesta etapa.
6. Configure `VITE_GOOGLE_REVIEWS_ENABLED=true` no ambiente de compilação e publique após validação. Essa opção é pública, sem credenciais. Mantenha todos os outros valores apenas no servidor.

## Dados e falhas

Recolhe todas as páginas de até 50 avaliações na ordem `updateTime desc` e só substitui a cache após uma recolha completa e consistente. Guarda temporariamente os primeiros 12 cartões, sem filtrar apenas críticas positivas. Apresenta o comentário original, autor, estrelas, data e link do perfil; a classificação e contagem globais vêm do Google, sem recalcular médias dos cartões selecionados.

Uma nova recolha completa reflete alterações e remoções. Uma consulta válida com zero avaliações elimina os testemunhos antigos na apresentação automática. Uma falha preserva a consulta anterior apenas até à expiração original de 24h. Até ativar a opção, a SofaClean mantém os dados manuais e a sua data de consulta; não indica uma consulta automática inexistente.

A API de leitura usa `Cache-Control: no-store`, aceita apenas GET e rejeita query parameters. A cache Redis é separada por namespace e perfil, com bloqueio de atualizações concorrentes. Tokens e mensagens internas de erro não são enviados ao browser. O hook trata os comentários como texto React, sem executar HTML, e remove dados expirados.

Na desativação, pare o agendamento, faça DELETE autenticado no endpoint de atualização, revogue a autorização e remova os segredos. Não acrescente as avaliações automáticas ao Git ou a arquivos SEO permanentes. A [política Google](https://developers.google.com/my-business/content/policies) exige armazenamento temporário e limitado e regras de acesso/atribuição; confirme o enquadramento do projeto antes de produção. A [documentação reviews.list](https://developers.google.com/my-business/reference/rest/v4/accounts.locations.reviews/list) descreve o endpoint usado.

## Verificação

```sh
npm run test:google-reviews
npm run typecheck
# Testes opcionais no Chrome, com Vite e @playwright/test disponíveis:
node shared/google-reviews/tests/browser/check.mjs
# PowerShell, compilação para Vercel:
$env:VERCEL = '1'
npm run build:vercel
```

Na implementação inicial: 18 testes simulados passaram; verificação TypeScript e compilação Vercel passaram. Foram também realizadas 6 verificações no Chrome local com respostas simuladas: apresentação móvel, comentário HTML como texto, perfil vazio, falha API, expiração, opção desativada e IDs distintos em duas instâncias (as duas primeiras partilham um cenário). Não houve consulta Google real, configuração de segredos/agendamento nem publicação.

O harness do navegador encontra-se em `shared/google-reviews/tests/browser/`. Requer Chrome instalado e as ferramentas de teste locais. Para reutilizar as ferramentas de outro checkout sem instalar novas dependências de produção, configure `GOOGLE_REVIEWS_TEST_PACKAGE` com o caminho absoluto do seu `package.json`.
