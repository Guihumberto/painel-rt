# Roteiro — fase 2 (Responsável de área, Validador, Administrador)

Direcionamento para sair do estado atual (só Visitante, só leitura) para os três perfis que
faltam, descritos na [especificação original](../especificacao-painel-atividades.md), seção 2:
**Responsável de área**, **Validador** e **Administrador**. Este documento assume que quem for
implementar já leu [`arquitetura-e-dados.md`](./arquitetura-e-dados.md).

## O que muda de patamar

Hoje o app é **só leitura**: todo dado vem de `public/data/*.json` via `fetch()`, nenhuma store
tem uma action que grave algo. Fase 2 introduz **escrita** — cadastro de atividade, registro de
andamento, envio de comprovação, decisão de validação. Isso muda a natureza do projeto em dois
eixos que precisam de decisão explícita antes de codar:

1. **Quem está logado?** Não existe autenticação hoje. Ver [Sessão simulada](#sessão-simulada-sem-backend-de-autenticação).
2. **Onde a escrita é persistida?** `public/data/*.json` é estático — um `fetch()` não grava nada
   de volta no arquivo. Ver [Onde gravar enquanto não há backend](#onde-gravar-enquanto-não-há-backend).

## Perfis e permissões (seção 2 da especificação)

| Perfil | Pode fazer | Hoje existe? |
|---|---|---|
| Visitante | Ler tudo, reagir, comentar, clicar "Quero saber mais" | ✅ |
| Responsável de área | Cadastrar atividade e prazos da **própria área**; registrar andamento parcial; marcar concluída + anexar comprovação; responder devolução do validador | ✅ |
| Validador | Ver fila de `em-validacao`; aprovar / aprovar com edição / devolver com justificativa | ✅ |
| Administrador | Gerenciar usuários/perfis; definir peso/limiares/SLA/bônus (seção 10 — entidade `Parametro`); **agir no lugar de qualquer Responsável ou Validador**, com o autor registrado como texto (registro estruturado ainda depende de backend — ver seção "Registrar ação 'no lugar de'"); falta agendar publicações em lote | ✅ (parcial) |
| Auditor / Controle Interno *(proposto, fora da especificação original)* | Só leitura, mas **privilegiada**: vê a trilha de auditoria crua, devoluções e pendências de todas as áreas — diferente do Visitante, que só vê o feed curado (nunca mostra atraso, por desenho — seção 5) | ✅ |
| Aprovador do plano inicial *(em aberto — ver nota abaixo)* | Confere pesos/coerência do plano anual antes dele entrar no painel (Etapa 1 da seção 4) | ❌ |

Um usuário só deveria conseguir editar o que a especificação permite pro perfil dele — em
particular, **Responsável só edita a própria área** (`usuario.areaId === atividade.areaLiderId`).

### Os dois perfis extras

Nenhum dos dois está na especificação original — surgiram de uma lacuna real nela, não são
capricho. Antes de implementar, vale confirmar com quem escreveu a especificação se fazem sentido
como perfis novos ou se cabem dentro dos 4 já definidos:

- **Auditor / Controle Interno — implementado (`/auditoria`).** A própria especificação justifica a
  necessidade na seção 8.1 (relatório de gestão automático, prestação de contas ao TCE) — alguém
  vai precisar consultar devolução, atraso e fila de validação de forma crua e consolidada pra
  compor esse relatório. Saiu como previsto: só leitura, sem action nova em nenhuma store —
  `AuditoriaView.vue` só lê `activitiesStore.atividades` e reaproveita `foiDevolvida`,
  `motivoDevolucao`, `getStatusAtividade` e `filaDeValidacao` (extraído de `ValidacaoView.vue` pra
  ficar reaproveitável). Nota: como a página pública de cada área já mostra atraso e devolução (não
  eram informação escondida do Visitante — só a *fila curada* do feed esconde isso, por desenho), o
  valor real do Auditor aqui é **consolidar as 21 áreas numa tela só**, não revelar algo oculto.
- **Aprovador do plano inicial.** A seção 4 (Etapa 1) diz que o plano "passa por validação inicial
  (confere pesos e coerência) antes de entrar no painel", mas não deixa claro **quem** faz essa
  validação — pode ser o mesmo Validador fazendo uma etapa a mais (fila separada de "plano novo"
  antes da fila de "entrega pra validar"), ou pode ser uma pessoa/perfil diferente, tipo a chefia
  da própria área aprovando antes de submeter à instituição. Enquanto isso não for confirmado, a
  recomendação é **não criar um 5º perfil** — modelar como uma etapa extra dentro do fluxo do
  Validador (ver [Fluxo de estados](#fluxo-de-estados-a-implementar-seção-4-da-especificação)) e
  revisitar se a prática mostrar que precisa ser gente diferente.

### Sessão simulada (sem backend de autenticação) — implementado

Para continuar sendo um protótipo de front-end (o objetivo original desta fase, ver primeira
mensagem do projeto: validar o fluxo antes de plugar backend), a página de login **não** faz
autenticação de verdade ainda. Já está construído:

- `src/views/LoginView.vue` — mostra um botão desabilitado "Entrar com SSO da SEFAZ-MA" (explicando
  que a integração com a COTEC ainda não existe — ver seção seguinte) e, abaixo, cards de
  usuários de demonstração (um por perfil elevado) que logam com um clique, sem senha.
- `src/stores/session.ts` — `usuarioAtual: Usuario | null`, `estaLogado`, `entrarComo(usuario)`,
  `sair()`, persistido em `localStorage` (mesmo padrão de `stores/interest.ts`).
- `src/mocks/usuarios.mock.ts` — os 4 usuários de demonstração; o Responsável fica ligado a `cotec`
  (área com dados reais).
- `AppHeader.vue` — "Entrar →" quando deslogado; "{{ nome }} · {{ perfil }} · Sair" quando logado.
- Toda mutação (ver seções abaixo) grava `usuarioAtual.nome`/`id` como autor — isso já é
  compatível com o jeito que `Andamento.autor`, `Comprovacao.autor` e `Validacao.validador` já
  funcionam hoje (são só `string`), então a integração é direta.
- Quando um Admin faz algo "no lugar de" um Responsável/Validador (ver seção seguinte), grava os
  dois: quem foi o autor de fato (o Admin) e em nome de quem a ação foi registrada.

Isso não é autenticação — é uma sessão de mentira, suficiente pra validar o fluxo. Trocar pelo SSO
real depois é trocar só essa store, do mesmo jeito que trocar `ctrt-api.ts` troca a fonte de dados.

### SSO real (COTEC/Keycloak)

A SEFAZ-MA **já tem** um SSO institucional em produção — não é algo a construir, é algo a integrar.
Fonte: `docs/Manual de integração com SSO da SEFAZ-MA.pdf` (manual da COTEC, v2.4).

- Tecnologia: **Red Hat SSO 7.5.2** (baseado em **Keycloak** 15.0.6), protocolo **OpenID Connect**
  (extensão do OAuth 2.0). O app nunca vê usuário/senha — o usuário é redirecionado para a tela do
  Keycloak, autentica lá, e volta com um **token JWT**.
- O token traz `sub`, `name`, `preferred_username` (no exemplo do manual, um CPF), `email`,
  `realm_access.roles` (papéis globais) e `resource_access.<clientId>.roles` (papéis específicos
  deste sistema) — é daí que sairia o `perfil` do usuário.
- Front-end Angular usa `keycloak-angular` + `keycloak-js`; não há equivalente Vue oficial da SEFAZ —
  precisaria avaliar uma lib OIDC genérica (`oidc-client-ts` ou similar) quando chegar a hora.
- Back-end Spring Boot usa `keycloak-spring-boot-starter`, configurado com
  `keycloak.auth-server-url`, `keycloak.realm`, `keycloak.resource`.
- **Para integrar de verdade é preciso pedir** (e-mail à COTEC/Segurança), primeiro em
  homologação e depois em produção:
  - um **Client** (nome/sigla do sistema, Access Type Público/Confidencial, Valid Redirect URL, se
    usa Refresh Token, tipo de usuário interno/externo);
  - as **Roles** (um papel por `Perfil` nosso: `responsavel`, `validador`, `admin`, `auditor`);
  - os **Users** que vão logar (nome, CPF, e-mail, tipo consultor/servidor).
- Essa solicitação é um passo organizacional (e-mail + espera de retorno da COTEC), não um passo de
  código — por isso ainda não foi feita. Quando o backend desta fase existir, é o gatilho certo pra
  disparar esse pedido.

### Nova entidade: `Usuario` — implementado (`src/types/usuario.ts`)

Os nomes de campo já foram escolhidos para bater com as claims do JWT real (tabela acima), pra que
trocar a sessão simulada pelo SSO de verdade não exija remodelar o tipo:

```ts
type Perfil = 'responsavel' | 'validador' | 'admin' | 'auditor'
// 'visitante' não entra aqui — é o estado de "sem Usuario logado" (usuarioAtual === null), não um Perfil.

interface Usuario {
  id: string        // ~ sub
  nome: string       // ~ name
  matricula: string  // ~ preferred_username
  email: string       // ~ email
  perfil: Perfil       // ~ resource_access.<clientId>.roles
  areaId?: string   // obrigatório se perfil === 'responsavel'; um responsável pode ter mais de uma área — considerar areaIds: string[] se aparecer o caso real
}
```

### Registrar ação "no lugar de" (Admin substituindo) — implementado (versão simplificada)

Pedido explícito: o Admin pode fazer alterações e inserções "fazendo a vez" do Validador ou do
Responsável, **registrando isso**. Implementado:

- Guard do router (`router/index.ts`) deixa de exigir o perfil exato — Admin passa por qualquer
  `meta.requerPerfil`. Isso sozinho já dá acesso a `/minha-area` e `/validacao`.
- `MinhaAreaView.vue` — quando quem está logado é Admin (sem `areaId` próprio), mostra um seletor
  de área antes do conteúdo normal; a partir daí a tela funciona igual à do Responsável, mas agindo
  na área escolhida. Um link "← Trocar área" permite sair do modo escolhido.
- `ActivityDetailView.vue` — `podeAtualizar`/`podeValidar` passam a aceitar Admin, sem checar
  `areaId` (Admin pode agir em qualquer atividade, de qualquer área, em qualquer momento em que o
  Responsável/Validador poderia).
- O registro de autoria, por enquanto, é só **texto**: quando o autor é o Admin, o nome gravado já
  sai como `"Administrador de Demonstração (em nome de COTEC)"` ou `"(como Validador)"` — aparece
  automaticamente na trilha de auditoria (`ActivityAuditTrail.vue`) porque ela já exibe o campo
  `autor`/`validador` como texto livre, sem precisar mudar esse componente.

**Ainda não implementado, de propósito** (confirmado com o usuário — fica para quando existir
backend de verdade): um campo estruturado separando autor real de "em nome de quem", tipo

```ts
interface RegistroDeAutoria {
  autorId: string        // quem de fato agiu — pode ser o admin
  autorNome: string
  emNomeDe?: string       // preenchido só quando o autor é admin substituindo alguém
}
```

Hoje isso é só uma convenção de texto dentro do campo `autor` (`string`) que já existe em
`Andamento`, `Comprovacao` e `Validacao` — funciona bem pra demonstração, mas não é uma trilha de
autoria de verdade (não dá pra, por exemplo, filtrar "toda ação feita por admin em nome de
terceiros" de forma confiável — teria que fazer parsing de texto). Migrar pra um campo estruturado
é trabalho de backend, junto com autenticação real (ver seção "SSO real").

## Onde gravar enquanto não há backend — implementado

`activitiesStore.atividades` já é um `ref` reativo — mutar um item dele (ex.:
`atividade.andamentos.push(novoAndamento)`) já atualiza a tela em todo lugar que usa a store,
sem precisar de mais nada. Já construído:

1. **Actions de mutação em `activities.ts`**: `cadastrarAtividade(areaId, dados)` (usa
   `mocks/activity-builder.ts::criarAtividade` para montar a atividade com os defaults certos, id
   no formato `` `${areaId}-novo-${Date.now()}` `` — deliberadamente diferente do esquema `area-N`
   dos dados reais) e `atualizarAtividade(id, dados)` (sobrescreve só os campos descritivos:
   título, descrição, "o que muda", impacto, tipo de prazo, datas, peso, parceiras — nunca
   `estado`/`andamentos`/`comprovacoes`/`validacao`, que são as ações de fluxo abaixo, ainda não
   construídas). Ainda faltam: `registrarAndamento`, `anexarComprovacao`, `marcarConcluida`,
   `aplicarValidacao` — são a próxima etapa (ver seção seguinte).
2. **Persistência entre reloads** — `salvarLocalAteExistirBackend()` grava `atividades.value`
   inteiro em `localStorage` (`painel-rt:atividades`) a cada mutação; `fetchAtividades()` checa
   isso primeiro e pula o `fetch()`/transform se já existir algo salvo — mesmo princípio que
   `stores/interest.ts` já usa pros cliques em "Quero saber mais".
3. Isso está **marcado no código** com esse nome (`salvarLocalAteExistirBackend`) justamente pra
   deixar claro que é um substituto temporário — a primeira ação real ao plugar um backend é trocar
   essas actions para chamar uma API em vez de mutar o `ref` local.

## Fluxo de estados a implementar (seção 4 da especificação)

O `EstadoAtividade` já existe (`'planejada' | 'em-andamento' | 'em-validacao' | 'concluida'`, mais
`'atrasada'` derivado). Todas as transições, dos dois lados, estão **implementadas**:

```
planejada ──(responsável registra "Início", com artefato)──► em-andamento
em-andamento ──(responsável registra "Atualização", com artefato)──► em-andamento  [Andamento criado, estado não muda]
em-andamento ──(responsável registra "Paralisação", com artefato)──► em-andamento  [só marcação visual na timeline, não muda estado — decisão tomada de propósito pra não mexer em gráficos/ranking/filtros existentes]
em-andamento ──(responsável registra "Conclusão": relatório + texto pro feed + artefato)──► em-validacao  [grava entrouEmValidacaoEm e resumoPublico]
em-validacao ──(validador aprova)──► concluida  [dispara: publica no feed, atualiza ranking — automático, são projeções do estado]
em-validacao ──(validador aprova com edição)──► concluida  [idem; Validacao.decisao = 'aprovada-com-edicao'; validador pode reescrever o resumoPublico antes de publicar]
em-validacao ──(validador devolve + justificativa)──► em-andamento  [Validacao.decisao = 'devolvida', observacao obrigatória; entrouEmValidacaoEm é limpo]
```

Lado Responsável implementado em `stores/activities.ts::registrarAtualizacao(atividadeId, input,
autor)` — uma única action pros quatro tipos (`tipo: TipoAtualizacao` em `types/activity.ts`), em
vez das 4 ações separadas cogitadas originalmente aqui (`registrarAndamento`/`anexarComprovacao`/
`marcarConcluida`), porque toda atualização exige um artefato pareado (`Comprovacao.andamentoId`),
e centralizar evita duplicar essa lógica de pareamento. UI em `components/activity/AtualizacaoForm.vue`.

Lado Validador implementado em `stores/activities.ts::aplicarValidacao(atividadeId, input,
validador)` — UI em `components/activity/ValidacaoForm.vue`. Ambas as ações vivem na própria tela
pública da atividade (`/areas/:areaId/atividades/:activityId`), condicionadas ao perfil de quem
está logado — não precisou de rota nova pra elas; só a **fila** (`/validacao`, ver "Telas
sugeridas") é rota nova, porque precisa cruzar atividades de todas as áreas.

`Atividade.validacao?: Validacao` virou `validacoes: Validacao[]` — uma decisão só (aprovar) fazia
sentido quando não existia devolução; agora que uma atividade pode ser devolvida e concluída de
novo depois, cada ciclo de decisão precisa ficar registrado (mesmo princípio de trilha de auditoria
usado em `andamentos`/`comprovacoes`/`historico`). `ActivityAuditTrail.vue` mostra uma linha por
decisão, incluindo a devolução com a justificativa — antes a devolução nem aparecia na trilha.

Toda edição de campo (via `AtividadeForm.vue`, cadastro/edição de atividade) também fica registrada
— nova store `stores/historico.ts` (`AlteracaoAtividade`), mesclada na trilha de auditoria
(`ActivityAuditTrail.vue`) por ordem cronológica junto com cadastro/comprovação/validação/publicação.

SLA de validação (seção 4, Etapa 3: "5 dias úteis, configurável") — `composables/useSla.ts`
(`diasUteisDesde`, cálculo puro) + `Parametro.slaDiasUteis` (`stores/parametros.ts`) pro valor em
si, agora **de fato configurável** em `/admin/parametros` (ver seção seguinte).

Pontos da especificação que ainda não têm campo/lugar no modelo de dados atual:

- **Publicação agendada em lote** (seção 4, Etapa 4: "imediata ou agendada, ex. toda sexta") — não
  existe hoje nenhum conceito de "publicação pendente vs. publicada"; `feed.ts` hoje publica
  automaticamente qualquer atividade com `estado === 'concluida'`. Precisaria de um campo
  `publicadoEm?: string` separado de `concluidaEm` (nulo = aprovado mas ainda não liberado pro
  feed) e uma tela de admin pra disparar a publicação do lote.

### Entidade `Parametro` e telas de admin — implementado (parâmetros + usuários)

`src/types/parametro.ts` + `src/stores/parametros.ts` centralizam o que antes eram constantes
espalhadas: `SLA_DIAS_UTEIS` (`useSla.ts`), `INTERESSE_CONTADOR_MINIMO` (`stores/interest.ts`), os
bônus de antecipação/engajamento/colaboração (`useComplianceIndex.ts`, antes `0.05`/`0.01`/`0.15`
fixos). `calcularIndiceCumprimento` passou a receber `Parametro` como segundo argumento em vez de
ler constantes internas. Tela em `/admin/parametros` (`AdminParametrosView.vue`) edita os 7 campos
— persistido em `localStorage`, mesmo padrão das outras stores de mutação.

`HORIZONTE_SEM_DATA` (`ctrt-adapter.ts`, "2032-12-31") ficou de fora de propósito: só é usado no
momento único de transformar o JSON bruto em `Atividade`, então tornar isso "configurável" não
teria efeito depois que os dados já foram transformados e cacheados.

`Usuario` deixou de ser uma lista estática (`mocks/usuarios.mock.ts`) — agora é
`stores/usuarios.ts` (CRUD completo, incluindo exclusão: diferente de `Atividade`, são contas de
demonstração sintéticas, sem o problema de honestidade de apagar um registro real). `LoginView.vue`
lê da store, não do mock direto — um usuário criado pelo admin já aparece como opção de login.

Admin "fazer a vez" de uma área ou validador está **implementado** — ver seção "Registrar ação 'no
lugar de'" acima (`MinhaAreaView.vue` com seletor de área, `ActivityDetailView.vue` liberado pro
Admin). O registro estruturado (`emNomeDe`) fica pra quando existir backend, também descrito lá.

## Telas sugeridas

| Rota proposta | Perfil | Conteúdo |
|---|---|---|
| `/minha-area` — **implementado** | Responsável | Plano da própria área (reaproveita `AreaPlanTabs.vue`, agora com prop `editavel`) + botão "+ Nova atividade" (`AtividadeForm.vue`) + "Editar" em cada linha, mesmo formulário pré-preenchido |
| `/areas/:areaId/atividades/:activityId` — **atualização e validação implementadas** | Responsável (na própria área) / Validador | Mesma rota pública de sempre; Responsável ganha "+ Registrar atualização" (`AtualizacaoForm.vue`); Validador, quando `estado === 'em-validacao'`, ganha o badge de dias de espera e o `ValidacaoForm.vue` (aprovar / aprovar com edição / devolver) direto na página, sem precisar abrir formulário |
| `/validacao` — **implementado** | Validador | Fila de atividades `em-validacao` de **todas** as áreas (`ValidacaoView.vue`), ordenada por tempo de espera (mais antiga primeiro), badge de dias úteis (crítico se passou do SLA) |
| `/admin`, `/admin/parametros`, `/admin/usuarios` — **implementados** | Administrador | `/admin` (landing com os cards), `/admin/parametros` (`AdminParametrosView.vue` — SLA/limiares/bônus), `/admin/usuarios` (`AdminUsuariosView.vue` — CRUD completo, com exclusão). Falta `/admin/publicacoes` (agendamento em lote) |
| `/minha-area`, `/areas/:areaId/atividades/:activityId`, `/validacao` — **admin liberado** | Administrador | Mesmas telas do Responsável/Validador, reaproveitadas (não veio rota nova) — `/minha-area` ganha um seletor de área quando quem está logado é Admin |
| `/auditoria` — **implementado** | Auditor (e Admin) | `AuditoriaView.vue` — três listas consolidadas de todas as áreas: devolvidas aguardando reenvio (com o motivo), atrasadas (ordenadas por prazo) e aguardando validação (com dias úteis de espera); cada linha leva pra página da atividade, onde a trilha completa já existe |

Note que **nenhuma dessas rotas precisa de componente de exibição novo** — `AreaActivityRow`,
`StatusBadge`, `ActivityTimeline`, `ActivityAttachments`, `ProgressBar`, etc. já sabem renderizar
uma `Atividade`; o que muda é que essas telas novas colocam **controles de ação** ao redor deles
(botões, formulários) que hoje não existem em lugar nenhum do app.

## Reaproveitável x precisa construir

**Reaproveitável quase sem alteração:**
- Todo componente de exibição em `components/shared/`, `components/activity/`, `components/area/`
- `useStatusAtividade`, `useComplianceIndex`, `useExecutionOverview` — continuam lendo `Atividade`
  do jeito que já leem, não se importam se ela foi criada por JSON ou por formulário
- A trilha de auditoria (`ActivityAuditTrail.vue`) — só precisa passar a receber dados reais em vez
  de sintetizados

**Já construído:** store de sessão + seletor no header, todas as actions de mutação em
`activities.ts` (`cadastrarAtividade`, `atualizarAtividade`, `registrarAtualizacao`,
`aplicarValidacao`), formulário de cadastro/edição de atividade (`AtividadeForm.vue`), fluxo de
atualização com artefato (`AtualizacaoForm.vue`), fila e decisão de validação com SLA
(`ValidacaoView.vue`, `ValidacaoForm.vue`, `composables/useSla.ts`), histórico de alterações
(`stores/historico.ts`), guarda de rota por perfil (`router.beforeEach` em `router/index.ts`),
entidade `Parametro` com tela de admin (`stores/parametros.ts`, `AdminParametrosView.vue`), CRUD de
`Usuario` (`stores/usuarios.ts`, `AdminUsuariosView.vue`), admin "fazer a vez" de área/validador,
painel do Auditor (`/auditoria`, `composables/useFilaValidacao.ts`).

Com isso, **todos os 5 perfis da especificação + os 2 extras propostos estão implementados** —
falta só o que cada seção acima já marcou como pendente (abaixo) e o perfil "Aprovador do plano
inicial", que ficou deliberadamente de fora (ver "Os dois perfis extras").

**Ainda precisa construir:**
- Registro estruturado de "agir no lugar de" (`emNomeDe`) — depende de backend, ver seção acima
- `/admin/publicacoes` (agendamento em lote)

## Ordem sugerida de implementação

1. ~~`Usuario` (tipo) + `stores/session.ts` + seletor no header~~ — feito.
2. ~~Actions de mutação em `activities.ts` + persistência em `localStorage`~~ — feito.
3. ~~Tela do Responsável (`/minha-area`) — cadastro, edição, andamento e comprovação~~ — feito.
4. ~~Tela do Validador (`/validacao`) — os 3 botões~~ — feito.
5. ~~`stores/parametros.ts` centralizando os valores hoje fixos no código~~ — feito.
6. ~~Tela do Admin — parâmetros e usuários~~ — feito. Falta "agir no lugar de" (é o que mais
   depende de tudo anterior já funcionar, por isso ficou por último).
