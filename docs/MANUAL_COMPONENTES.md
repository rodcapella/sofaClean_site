# Manual dos componentes reutilizáveis

Versão 1.0 · 8 de outubro de 2026 · Sapiente.AI

Este manual explica o que foi criado, como instalar, o que configurar e como confirmar o funcionamento. Foi elaborado a partir dos ficheiros locais atuais. Os exemplos usam dados fictícios e não contêm credenciais.

## 1. Catálogo e localização

O repositório principal é `rodcapella/componentes_reutilizaveis`. Localmente encontra-se em `C:\Users\Rodrigo\Documents\GitHub\componentes_reutilizaveis`.

| Componente | Pasta | Finalidade | Estado |
|---|---|---|---|
| WhatsApp | `whatsapp/` | Widget flutuante e mensagens contextuais | Componente React configurável |
| ContactModal | `contactModal/` | Modal e estados do formulário | Componente React com adaptadores |
| API de contacto | `CONTACT_FORM/` | Validação, Turnstile e envio SMTP | Backend extraído da Sapiente |
| Cookies, analytics e privacidade | `Cookies_and_Privacy/` | Preferências, GA e páginas legais | Extração com dependências da origem |
| SEO/GEO/AEO | `SEO_GEO_AEO/` | Recursos de identificação e descoberta | Seis ficheiros de referência da Infolite |
| Avaliações Google manuais | `get_google_reviews/` | Apresentar nota, contagem e testemunhos | Dados mantidos manualmente |
| Avaliações Google automáticas | `shared/google-reviews/`, na SofaClean | Consultar um perfil e servir cache ao site | Desenvolvido no branch `feat/google-reviews-by-profile` |

A solução automática está no repositório `sofaclean_site`, commit de implementação `4d25df7`. A aplicação atual está limitada à SofaClean; Sapiente AI e Infolite são destinos posteriores. rpovoadata e Miko não fazem parte dessa integração.

## 2. Como escolher e instalar

### 2.1 Quando usar cada módulo

Para um botão que abre conversa, use WhatsApp. Para contacto por email dentro do site, combine ContactModal com uma API real. O ContactModal não envia emails por si só; `CONTACT_FORM` fornece uma das opções de backend. O pacote de privacidade tem o banner e a integração de analytics, mas exige adaptação ao site. O pacote SEO contém referências a personalizar e colocar na pasta pública. Para avaliações, escolha dados manuais ou a solução automática conforme o acesso disponível ao perfil Google.

### 2.2 Preparação comum

1. Confirme se a aplicação usa React/Vite, Next/Vinext ou outro framework.
2. Copie apenas o módulo pretendido e os imports necessários. As pastas de referência preservam contexto e não são uma aplicação pronta a instalar.
3. Ajuste nome, identidade visual, contactos, URLs, idioma, rotas e destinatários.
4. Configure serviços externos no ambiente do servidor, sem copiar segredos de outro site.
5. Verifique tipos/build e o comportamento no navegador.
6. Faça um teste real do serviço externo, quando aplicável, antes de o considerar ativo.

WhatsApp e ContactModal podem também ser consumidos pelo pacote principal, após gerar `dist/` com `npm run build`. Os outros módulos têm instruções próprias; não estão todos exportados pelo pacote principal.

```sh
# Na raiz de componentes_reutilizaveis:
npm install
npm run build
npm test
```

No Windows, use `npm.cmd` se a política do PowerShell bloquear `npm.ps1`. Os imports dos exemplos seguintes partem de pastas copiadas para a aplicação; ajuste o caminho relativo ao seu ficheiro.

## 3. WhatsApp

### O que faz

Abre `wa.me` numa nova aba com uma mensagem codificada. Pode ser um widget flutuante ou um link contextual num serviço. O visitante confirma o envio no WhatsApp; este módulo não envia mensagens automaticamente nem usa a WhatsApp Business API.

### Instalar e configurar

Copie os ficheiros de primeiro nível de `whatsapp/` e importe o CSS. Defina um número internacional com indicativo, sem prefixo `00`, e a mensagem adequada ao contexto.

```tsx
import { WhatsAppWidget, whatsappLink, createWhatsAppMessages } from './whatsapp';
import './whatsapp/styles.css';

const messages = createWhatsAppMessages('Empresa Exemplo');

export function Contactos() {
  return <>
    <WhatsAppWidget number="351912345678" message={messages.help} label="Fale connosco" />
    <a href={whatsappLink('351912345678', messages.service('Limpeza de sofás'))}
       target="_blank" rel="noopener noreferrer">Pedir orçamento</a>
  </>;
}
```

| Opção | Uso |
|---|---|
| `number` | Obrigatório; número internacional válido |
| `message` | Obrigatório; texto da conversa |
| `label` | Legenda e nome acessível; por defeito “Precisa de ajuda?” |
| `className` / `style` | Personalização visual |
| `onClick` | Integração opcional com eventos da aplicação |

A fábrica de mensagens disponibiliza `help`, `information`, `quote`, `coverage`, `support`, `review` e `service(nome)`. As mensagens geradas são portuguesas; para inglês, passe texto próprio. O número é validado e a mensagem é codificada, incluindo acentos e quebras de linha.

Personalização CSS: `--cr-whatsapp-color`, `--cr-whatsapp-label-bg`, `--cr-whatsapp-label-color` e `--cr-whatsapp-z`. Se ligar `onClick` a analytics, respeite as preferências da aplicação.

### Confirmar funcionamento

Verifique o número de destino, a mensagem com acentos, o link num telemóvel e num computador, o rótulo acessível e a sobreposição com outros botões flutuantes. Um clique bem-sucedido abre a conversa; não comprova que a mensagem foi enviada.

## 4. ContactModal

### O que faz

Apresenta um formulário num `<dialog>` nativo, com foco contido, Escape, retorno do foco, envio em curso, sucesso, erro e nova tentativa. O envio tem timeout de 20 segundos e é cancelado quando o modal fecha. Inclui honeypot e integração opcional de Turnstile.

```tsx
import { useState } from 'react';
import { ContactModal } from './contactModal';
import './contactModal/styles.css';

export function Contacto() {
  const [open, setOpen] = useState(false);
  return <>
    <button onClick={() => setOpen(true)}>Contactar</button>
    <ContactModal isOpen={open} onClose={() => setOpen(false)}
      topics={['Consultoria', 'Outros']} endpoint="/api/contact"
      privacyUrl="/privacidade" />
  </>;
}
```

O exemplo funciona sem Turnstile apenas se o endpoint escolhido não o exigir. Para ligar à API `CONTACT_FORM`, forneça a verificação conforme a secção seguinte.

| Propriedade | Função |
|---|---|
| `isOpen`, `onClose` | Abertura e fecho, obrigatórios |
| `topics` | Lista de serviços/tópicos, obrigatória |
| `privacyUrl` | Rota de privacidade real, obrigatória |
| `endpoint` | Por defeito `/api/contact` |
| `initialTopic` | Tópico inicial para um botão contextual |
| `title`, `description` | Texto inicial |
| `successMessage`, `errorMessage` | Mensagens de resultado |
| `lang` | Idioma enviado ao servidor; não traduz todos os rótulos |
| `requireVerification`, `turnstileToken`, `verification` | Integração do desafio de verificação |
| `onVerificationReset` | Reiniciar o desafio após utilização |
| `onSubmit` | Adaptador próprio, que deve lançar erro quando o envio falhar |

O contrato padrão considera sucesso apenas HTTP 2xx com `{ "ok": true }`. Uma resposta HTML ou `{ok:false}` não é sucesso. O adaptador `submitRpovoaContact` aceita `{ "success": true }`; existe para a API original desse site, independentemente do âmbito das avaliações Google.

### Turnstile

O componente pai mantém o token e a chave de reinício. Exemplo de ligação ao modal:

```tsx
import { ContactModal, TurnstileWidget } from './contactModal';

// Dentro do componente pai, depois de declarar open, token e verificationKey:
<ContactModal isOpen={open} onClose={() => setOpen(false)}
  topics={['Consultoria']} privacyUrl="/privacidade"
  requireVerification turnstileToken={token}
  verification={<TurnstileWidget key={verificationKey} siteKey={publicSiteKey}
    action="contact_form" onVerify={setToken}
    onError={() => setToken('')} onExpire={() => setToken('')} />}
  onVerificationReset={() => {
    setToken(''); setVerificationKey(k => k + 1);
  }} />
```

Reinicie o token ao abrir uma nova sessão. A chave pública pertence ao domínio; a chave secreta fica no servidor. A API valida o hostname e a ação `contact_form`. Integre CSP/Trusted Types para o carregador Cloudflare, usando o padrão já existente na aplicação.

O formulário envia `name`, `email`, `phone`, `company`, `source`, `subject`, `topic`, `message`, `website`, `lang` e `turnstileToken`. `website` é o honeypot e deve ficar vazio.

Personalização CSS: `--cr-contact-bg`, `--cr-contact-text` e `--cr-contact-accent`. A versão comum mantém o erro visível e os dados para nova tentativa; não ativa automaticamente o fallback `mailto` da referência SofaClean.

### Confirmar funcionamento

Teste abertura, Tab/Shift+Tab, Escape, retorno do foco, duplicação de cliques, token expirado, erro do servidor, preservação dos campos e nova tentativa. Verifique depois um envio real e a receção do email; a demo da biblioteca não envia mensagens.

## 5. CONTACT_FORM — backend de contacto

### Instalação

Copie `api/contact.ts`, `api/_inputSecurity.ts`, `api/_ipAllowlist.ts` e `api/_httpTypes.ts`, mantendo os imports relativos. É um handler Node com `req.body`, `res.status()` e `res.json()`, adequado à interface das funções Vercel. Para Next App Router, adapte para `Request/Response` em vez de copiar o handler diretamente.

Instale as dependências declaradas no `CONTACT_FORM/package.json`, incluindo Nodemailer e `@rodcapella/common-resources`. Este último exige acesso ao repositório GitHub da dependência. Fixar um commit facilita instalações reproduzíveis.

### Variáveis do servidor

| Variável | Finalidade |
|---|---|
| `SMTP_HOST`, `SMTP_PORT` | Servidor e porta; 465 ativa TLS direto |
| `SMTP_USER`, `SMTP_PASSWORD` | Autenticação do remetente |
| `CONTACT_EMAIL_TO` | Destinatário; na ausência usa `SMTP_USER` |
| `TURNSTILE_SECRET_KEY` | Verificação do desafio |
| `TURNSTILE_EXPECTED_HOSTNAMES` | Hostnames adicionais autorizados |
| `CONTACT_ALLOWED_ORIGINS` | Origens adicionais autorizadas |
| `KV_REST_API_URL`, `KV_REST_API_TOKEN` | Redis/KV para limitação distribuída |
| `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN` | Alternativa ao par KV |

As variáveis acrescentam origens/hostnames aos valores originais. Ao usar noutra marca, reveja também as listas predefinidas no código, os templates de email, os links e as imagens. A extração mantém a identidade Sapiente.

### Contrato de envio

`POST /api/contact`, JSON, máximo de 16 KiB. Exemplo ilustrativo; o token é gerado pelo widget:

```json
{
  "name": "Pessoa de teste",
  "email": "pessoa@example.com",
  "phone": "",
  "company": "",
  "source": "website",
  "topic": "Pedido de informação",
  "message": "Gostaria de receber mais informações.",
  "lang": "pt",
  "website": "",
  "turnstileToken": "TOKEN_DO_WIDGET"
}
```

Nome: 3–100 caracteres. Email: até 254. Tópico: até 160. Mensagem: 10–1000. Turnstile válido é obrigatório. `analysisSummary` é opcional e específico da análise de websites; consulte o tipo da API antes de o utilizar.

| HTTP | Significado |
|---|---|
| 200 + `{ok:true}` | SMTP aceitou o envio |
| 400 | Pedido ou verificação inválidos |
| 405 | Método não permitido |
| 422 | Email descartável |
| 429 | Limite de pedidos atingido |
| 503 | Configuração/serviço indisponível |
| 502 | Falha SMTP |

A limitação normal é de 3 pedidos por IP numa janela de 15 minutos. A lista de IPs autorizados pode dispensar essa limitação, mantendo as restantes verificações. Em produção, a API exige Redis/KV e recusa o envio quando o serviço obrigatório falta; o contador local é apenas de desenvolvimento.

O sucesso SMTP não comprova chegada à caixa de entrada. O handler não grava os contactos numa base de dados nem envia uma confirmação automática ao visitante. Cancelar o pedido no frontend também não garante que um email já aceite pelo servidor deixe de ser enviado.

### Confirmar funcionamento

Execute `npm run typecheck` nesta pasta ou na aplicação de destino. Faça um envio controlado com Turnstile válido, confirme o email recebido e teste origem não autorizada, token expirado, honeypot e excesso de pedidos. Não registe passwords, tokens ou o conteúdo pessoal de pedidos nos logs de diagnóstico.

## 6. Cookies_and_Privacy

### O que inclui

Banner, botão para reabrir preferências, Google Analytics, integração Vercel Analytics, referências de Speed Insights, páginas de privacidade/cookies em PT/EN, conteúdo, estilos e imports da Sapiente. É uma extração com dependências de Wouter e da aplicação original; não é um componente isolado pronto para qualquer router.

### Integrar

1. Selecione os componentes e dependências em `client/src/`; configure o alias `@/` ou adapte os imports.
2. Personalize identidade, textos legais, URLs, contactos, idioma e estilos antes de usar noutra marca.
3. Inicialize no navegador, antes da montagem React:

```tsx
initializeTrustedTypes();
initializeGoogleConsentMode();
restoreStoredGoogleConsent();
```

As funções vêm de `lib/trustedTypes.ts` e `lib/googleAnalytics.ts`. Integre a política Trusted Types com a já existente na aplicação.

4. Monte `CookieBanner` e `CookieFloatingButton` uma vez, dentro do contexto de rotas. Preserve/adapte o elemento `#root` e o isolamento do fundo nas preferências.
5. Disponibilize `/pt/privacy`, `/en/privacy`, `/pt/cookies`, `/en/cookies` e os links de termos usados no banner, ou adapte as rotas.
6. Chame `trackGooglePageView()` nas mudanças de rota SPA.
7. Decida separadamente como montar Vercel Analytics e Speed Insights.

### Preferências e comportamento atual

| Elemento | Comportamento |
|---|---|
| `cookieConsent`, `cookiePreferences`, `cookieBannerVersion` | Chaves de localStorage |
| `sapiente:open-cookie-preferences` | Evento para reabrir preferências |
| Google Analytics | Consentimento começa negado; carregamento após autorização de analytics |
| Rejeição posterior | Atualiza consentimento e tenta limpar cookies `_ga`; não remove o script já carregado |
| Opção marketing | Publicidade Google continua negada; não há carregador de campanhas |
| Vercel Analytics / Speed Insights | Não estão ligados ao seletor de consentimento nesta extração |

O restauro GA lê as preferências antes do banner e não verifica a versão do banner. Se alterar a política/versão, harmonize também o restauro; não presuma que mudar apenas a interface impede todo o carregamento.

Substitua `GA_MEASUREMENT_ID` pela propriedade do site, os domínios de remoção de cookies e as chaves/eventos quando necessário. Uma cópia do banner não autoriza nem ativa analytics automaticamente para outra aplicação.

### Confirmar funcionamento

Execute `npm run test:analytics` na pasta. No navegador, teste primeira visita, aceitar, rejeitar, personalizar, reabrir, recarregar e navegação entre rotas. Observe os pedidos de rede e confirme a propriedade GA. O teste simulado verifica a fila de eventos; não comprova entrega de métricas nem conformidade dos textos legais.

## 7. SEO_GEO_AEO

### Conteúdo

São seis ficheiros copiados da Infolite. Mantêm identidade, idioma, URLs e conteúdo da origem e precisam de adaptação antes de publicar noutro negócio.

| Ficheiro | Função | Rever |
|---|---|---|
| `site.webmanifest` | Identidade e opções de apresentação da aplicação | Nome, cores, idioma, scope/start_url e ícones reais |
| `robots.txt` | Orientação a crawlers e sitemap | Domínio, caminhos e URL do sitemap |
| `llms.txt` | Resumo e referências públicas | Marca, descrição, contactos e links |
| `llms-full.txt` | Contexto público mais detalhado | Textos factuais, serviços e referências |
| `ai.json` | Dados estruturados de identidade | URLs canónicas, idioma, datas, publisher/developer e negócio |
| `ai-catalog.json` | Catálogo de produtos/serviços | Host, identificadores, descrições e URLs de entradas |

### Instalar e manter

Copie para a pasta pública que publica os ficheiros na raiz do domínio: `public/` em muitos projetos; `client/public/` na Sapiente atual. Confirme os caminhos efetivos do seu build.

Preserve a atribuição ao publisher/developer quando aplicável, mas substitua os dados do negócio de destino. Atualize datas apenas após rever o conteúdo. Disponibilize os ícones referenciados no manifest; eles não vêm nesta pasta. Verifique que o sitemap indicado existe.

Depois de mudar produtos, serviços ou URLs, atualize a fonte do conteúdo e os recursos de descoberta em conjunto. Se o site tiver geradores, use-os; editar apenas a saída pode perder-se no build seguinte. Não acrescente avaliações automáticas Google a estes ficheiros como arquivo permanente.

### Confirmar funcionamento

Abra as seis URLs publicadas e confirme que devolvem os ficheiros certos, não uma página HTML de fallback. Valide o JSON, os links internos, o manifest e o sitemap. `Disallow: /api/` orienta crawlers e não substitui a proteção dos endpoints. Estes recursos complementam o site; a sua existência não garante indexação ou citações por agentes.

## 8. get_google_reviews — apresentação manual

Copie `sofaclean_site/CustomerReviews.tsx`, `content.ts`, `whatsapp.ts` e os estilos necessários. O componente usa React e lucide-react, recebe o conteúdo da landing page e depende do ancestral `.template`.

```tsx
import { CustomerReviews } from './sofaclean_site/CustomerReviews';
import { generalServicesContent } from './sofaclean_site/content';
import './styles/general-services.css';

<div className="template"><CustomerReviews content={generalServicesContent} /></div>;
```

Personalize `googleReviews.url`, `rating`, `count`, `checkedOn`, `testimonials`, o número WhatsApp e a mensagem de convite. A nota, contagem e data não são consultadas automaticamente. Confirme-as na origem antes de alterar a data.

Com nota/contagem `null` e `testimonials: []`, apresenta o convite alternativo por WhatsApp. Esse convite não publica uma avaliação no Google. Para várias instâncias, adapte os IDs fixos `depoimentos` e `reviews-title`.

Execute `npm run typecheck` na pasta e confirme no navegador os cartões, estrelas, links e versão móvel. Evite importar os estilos globais de referência integralmente sobre uma aplicação já estilizada.

## 9. Avaliações automáticas — SofaClean

A versão automática é diferente da cópia manual anterior. Tem backend, OAuth, cache, atualização protegida e consulta completa das páginas de um único perfil. Está no branch SofaClean; não foi aplicada ao rpovoadata nem à Miko.

Os parâmetros `accountId` e `locationId` são definidos no servidor. A API pública não recebe identificadores por query. Os visitantes lêem a cache; não provocam uma chamada ao Google por visita. A seleção temporária contém os 12 cartões mais recentes por atualização, mantendo a média e contagem globais fornecidas pelo Google.

Leia o [manual específico](MANUAL_GOOGLE_REVIEWS.md) para obter a lista de variáveis, autorização OAuth, primeira sincronização, agendamento, respostas HTTP, diagnóstico e desativação. A aplicação inicial será SofaClean; a reutilização na Sapiente AI e Infolite é posterior e exige configuração própria.

## 10. Manutenção e diagnóstico comum

| Sintoma | Verificar primeiro |
|---|---|
| WhatsApp abre contacto errado | Número com indicativo e configuração por marca |
| Modal não mostra sucesso | HTTP 2xx e contrato `ok`/`success`, token e endpoint real |
| Contacto recebe 503 | Redis/KV e SMTP no ambiente do servidor |
| Turnstile falha | Chaves do domínio, hostname, ação e CSP |
| Métricas aparecem noutro site | Propriedade GA e configuração copiada |
| Rejeitar cookies não bloqueia toda a telemetria | Montagem separada de Vercel Analytics/Speed Insights |
| SEO devolve HTML | Pasta pública, rewrites e geradores |
| Avaliações automáticas continuam manuais | Opção pública desativada, cache vazia ou API indisponível |

Ao atualizar uma extração, mantenha os nomes das pastas, reveja dependências, registe a origem e volte a executar apenas as verificações relevantes. `ORIGEM.json`/`ORIGENS.json` documentam hashes e commit base de cópias; não provam que a produção tem o mesmo código.

## 11. O que foi verificado e o que ainda depende do destino

| Módulo | Evidência disponível | Verificação no destino |
|---|---|---|
| WhatsApp / ContactModal | Build/testes da extração e testes de foco/erro/mobile documentados | Contacto/número real, acessibilidade e entrega |
| CONTACT_FORM | Verificação de tipos documentada na extração | Turnstile, Redis e receção SMTP reais |
| Cookies_and_Privacy | Teste simulado de consentimento e page views | Banner, rede, propriedade GA e textos da marca |
| SEO_GEO_AEO | Cópia de referência | Conteúdo correto, URLs e respostas publicadas |
| Avaliações manuais | Tipos da extração | Atualidade da nota, contagem e testemunhos |
| Avaliações automáticas | 18 testes e 6 cenários de navegador; tipos/build SofaClean | Aprovação Google, OAuth, perfil real e agendamento |

As verificações anteriores são registos da implementação, não foram todas repetidas para escrever este manual. Instalar/copiar um módulo não configura serviços, não publica sites e não comprova integração externa.

Documentação complementar: READMEs de cada pasta, `contactModal/AMBIENTE.md`, os manifests de origem e, na SofaClean, `docs/GOOGLE_REVIEWS.md` e `shared/google-reviews/README.md`.
