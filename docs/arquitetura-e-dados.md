# Arquitetura e dados

## Stack

- **Vue 3** — Composition API, `<script setup lang="ts">` em todo componente (nenhum Options API no projeto)
- **Vite** + **TypeScript** (`vue-tsc` para checagem de tipos — `pnpm run typecheck`)
- **Vue Router 4** — rotas em `src/router/index.ts`, todas as views com `import()` (code-split por rota)
- **Pinia** — setup stores (não Options stores) em `src/stores/`
- **Tailwind CSS v4** — configuração 100% em CSS (`src/assets/styles/main.css`, bloco `@theme`), sem `tailwind.config.js`
- **pnpm** como gerenciador de pacotes

Sem backend, sem autenticação, sem banco de dados — ver seção [De onde vêm os dados](#de-onde-vêm-os-dados).

## Estrutura de pastas

```
public/data/                  # o "banco de dados": JSON estático, servido por HTTP
  areas.json                  # 21 áreas reais do guia do CTRT
  mapeamentos.json             # impactos/riscos/oportunidades por área (72 registros)
  atividades.json               # 132 atividades reais (plano operativo do guia)

src/
  services/
    ctrt-api.ts                # simula chamadas de backend: fetch() nos JSON acima
    ctrt-adapter.ts             # transforma o formato bruto do JSON no modelo de domínio do app
    ctrt-types.ts                # tipos do formato bruto (AreaRaw, AtividadeRaw, MapeamentoRaw)

  mocks/
    activity-builder.ts          # monta andamentos/comprovações/validação sintéticos p/ uma Atividade
    badges.mock.ts               # selos — só os que têm respaldo real no guia (ver arquivo)
    events.mock.ts               # seminário trimestral — só o próximo (agendado); sem histórico fictício

  stores/                       # Pinia — um arquivo por domínio, ver tabela abaixo
  types/                        # interfaces TypeScript do modelo de domínio (Atividade, Area, ...)
  composables/                   # lógica reativa reutilizável (índice de cumprimento, status, gráficos)
  components/
    painel/                     # componentes da tela inicial (placar, pódio, gráficos, seletor de área)
    area/                       # componentes da página de uma área
    activity/                   # componentes do detalhe de uma atividade
    events/                     # componentes de eventos/seminário
    shared/                     # componentes reaproveitados em várias telas (StatusBadge, AreaAvatar, ...)
    layout/                     # AppHeader, AppFooter
  views/                        # uma view por rota — ver tabela de rotas abaixo
```

## De onde vêm os dados

**Não é mock no sentido de "dado inventado".** Os dados reais do guia oficial do CTRT
(`docs/reforma-tributaria-ctrt.md`, extraído do PDF) foram transcritos para três arquivos JSON em
`public/data/`, e o app busca esses arquivos por `fetch()` como buscaria de uma API de verdade:

```
public/data/*.json  →  ctrt-api.ts (fetch)  →  ctrt-adapter.ts (transforma)  →  stores  →  componentes
```

Trocar por um backend real é trocar só `ctrt-api.ts` — nada mais no app precisa mudar, porque o
formato de saída do adapter (`Area`, `Atividade`, `Mapeamento`) já é o modelo de domínio final.

### As 3 fontes brutas

| Arquivo | Registros | Formato bruto (`ctrt-types.ts`) |
|---|---|---|
| `areas.json` | 21 | `{ id, sigla, nome, descricao }` |
| `mapeamentos.json` | 72 | `{ id, areaId, impacto, risco, oportunidade }` (qualquer campo pode ser `null`) |
| `atividades.json` | 132 | `{ id, areaId, titulo, resultadoEsperado, dataInicio, dataFim }` — **datas como o guia realmente escreve**: `"22/09/2025"`, `"Abril/2026"`, `"Em andamento"`, `"Aguardando legislação"`, `"-"`, `"Realizado em 06/03/2026"` |

### O que o adapter (`ctrt-adapter.ts`) precisa inferir

O guia real só dá título, resultado esperado e datas em formato de texto livre. Tudo que o modelo
de domínio precisa além disso é **heurística de demonstração**, documentada em comentário no
próprio código-fonte. Resumo:

| Campo derivado | Regra | Por quê |
|---|---|---|
| `estado` | `'concluida'` **só** se o texto da data-fim contém "finalizado"/"realizado"; `'planejada'` se o texto diz "aguardando"/"pendente de definição" ou a data de início é futura; senão `'em-andamento'` | O guia quase não marca conclusão — só **2 das 132 atividades** têm esse sinal explícito. Deliberadamente **não tratamos prazo vencido como concluído** (seria inventar que a SEFAZ entregou algo sem evidência) — um prazo vencido e não concluído vira `'atrasada'` automaticamente (ver `useStatusAtividade.ts`), o que é uma leitura honesta do próprio plano real. |
| `tipoPrazo` | `'janela'` se início e fim resolvem para data; `'data-limite'` se só o fim resolve; `'continua'` se nenhum resolve ou o texto diz "permanente"/"contínua" | Direto da presença/ausência de datas parseáveis |
| `dataFim` quando não há data nenhuma | Horizonte fixo `2032-12-31` | O `Atividade.dataFim` é obrigatório no tipo; sem isso a atividade não teria como ser ordenada/comparada. `2032` é o fim do horizonte de transição citado no próprio guia. |
| `peso` (1–3) | Heurística por tamanho do texto de "resultado esperado" + duração do prazo | **Não existe no guia.** Serve só para o índice de cumprimento (seção 6.1 da especificação) ter alguma variação. |
| `interessados` (clique em "Quero saber mais") | Hash determinístico do id da atividade, módulo 42 | Recurso do protótipo (engajamento) sem paralelo no guia real — claramente sintético, não é uma alegação sobre a SEFAZ. |
| `areasParceirasIds` (atividade colaborativa) | Lista **fixa, escrita à mão** (`COLABORACOES` no topo do arquivo) — só nas 4 atividades onde o próprio texto do guia cita outra área explicitamente (ex.: "Grupo Temático CEGPA, ASJUR, CSL") | Não é varredura automática por sigla porque uma das siglas (`CADASTRO`) também é uma palavra comum do português — geraria falso positivo o tempo todo. |
| `impacto` (texto exibido em "Impacto") | Roda entre os registros de `mapeamentos.json` daquela área, um por atividade (`indiceNaArea % mapeamentos.length`) | Uma área pode ter várias atividades e só 1–3 registros de mapeamento; isso evita repetir sempre o mesmo texto. |
| `andamentos`, `comprovações`, `validação` | Gerados por `activity-builder.ts` a partir do `estado` (atividade `'planejada'` não tem andamento nem comprovação; `'concluida'` tem os três) | Textos de andamento são genéricos ("Levantamento inicial concluído...") — não fingem ser um relato real, só preenchem a timeline pra a tela não ficar vazia. |
| Selos (`badges.mock.ts`) | Só 2 selos no total: "Primeira a concluir" pra COTRH (única atividade com "Finalizado" no guia) e "Ponte" pra CEGPA (participa dos grupos temáticos multi-área reais) | Selos como "100% em dia" ou "Maior evolução" exigiriam histórico comparativo entre meses que não existe — preferimos não conceder em vez de inventar. |
| Eventos (`events.mock.ts`) | Só o próximo seminário (agendado), pauta calculada ao vivo pelos cliques reais em "Quero saber mais" (`useEventsStore.pautaProvisoria`) | Sem seminário "realizado" — nada no guia real indica que algum já aconteceu. |

Se um número parecer baixo demais (2 atividades concluídas em 132, índice de cumprimento geral de
6%), **é o dado real**, não um bug — o plano do guia vai até 2032/2033 e a maior parte das ações
ainda não venceu ou não tem confirmação de entrega.

### Como uma atividade nasce, passo a passo

1. `stores/activities.ts` chama `fetchAtividadesRaw()` (`ctrt-api.ts`) e, em paralelo,
   `useMapeamentosStore().fetchMapeamentos()`.
2. Para cada `AtividadeRaw`, calcula o índice dela dentro da própria área (`indiceNaArea`) — usado
   só para revezar qual registro de mapeamento vira o texto de "Impacto".
3. Chama `transformarAtividade(raw, indiceNaArea, mapeamentosDaArea)` (`ctrt-adapter.ts`), que:
   - resolve as datas (`derivarDatas`) e o `estado`;
   - resolve o `peso` (`derivarPeso`);
   - monta um objeto `RawAtividade` (formato intermediário) e chama `criarAtividade()`
     (`activity-builder.ts`), que preenche andamentos/comprovações/validação sintéticos e devolve
     o `Atividade` final.
4. O array final vai para `activitiesStore.atividades` (um `ref<Atividade[]>` reativo).

## Modelo de dados (domínio final, `src/types/`)

| Tipo | Arquivo | Campos principais |
|---|---|---|
| `Area` | `area.ts` | `id, sigla, nome, responsaveis: string[], colorIndex` |
| `Atividade` | `activity.ts` | `id, areaLiderId, areasParceirasIds[], titulo, descricao, tipoPrazo, dataInicio?, dataFim, oQueMuda, impacto, peso (1-3), estado, criadaEm, concluidaEm?, antecipada, andamentos[], comprovacoes[], validacao?, interessados` |
| `Andamento` | `activity.ts` | `id, atividadeId, texto, data, autor` |
| `Comprovacao` | `activity.ts` | `id, atividadeId, tipo ('pdf'|'imagem'|'link'), nome, data, autor, publica` |
| `Validacao` | `activity.ts` | `id, atividadeId, decisao ('aprovada'|'aprovada-com-edicao'|'devolvida'), validador, data, observacao?` |
| `Mapeamento` | `mapeamento.ts` | `id, areaId, impacto?, risco?, oportunidade?` |
| `Publicacao` (feed) | `publication.ts` | `id, atividadeId, areaIds[], tituloNoticia, oQueMuda, impacto, publicadoEm, seloContexto, validadorResponsavel, comprovacoesPublicas[], reacoes[], comentariosCount` |
| `Selo` | `badge.ts` | `id, tipo, areaId, titulo, descricao, conquistadoEm` |
| `Evento` | `event.ts` | `id, titulo, tipo, data, local, descricao, status ('agendado'|'realizado'), atividadesIds?` |

`EstadoAtividade` = `'planejada' | 'em-andamento' | 'em-validacao' | 'concluida' | 'atrasada'`.
**`'atrasada'` nunca é gravado** — é sempre derivado na hora de exibir, comparando `dataFim` com
hoje (`useStatusAtividade.ts`, função `getStatusAtividade`). Isso é importante para a fase 2: se
um backend real vier a existir, ele não precisa (e não deve) persistir `'atrasada'` como estado —
só as datas e o estado de fato.

## As stores (`src/stores/`)

| Store | Responsabilidade | Observação |
|---|---|---|
| `areas.ts` | Lista de áreas + `ranking` (computed que cruza áreas × atividades × selos, ordenado por índice) | O ranking **não tem estado próprio** — é 100% derivado de `activities.ts` e `badges.mock.ts` |
| `activities.ts` | Lista de atividades; `fetchAtividades()` roda o pipeline JSON → adapter descrito acima | Fonte de verdade que quase tudo mais deriva |
| `mapeamentos.ts` | Lista de `Mapeamento`; usada pelo adapter e disponível para telas futuras (hoje sem UI própria) | |
| `feed.ts` | `publicacoes` — **computed**, não tem fetch próprio: filtra `activitiesStore.atividades` por `estado === 'concluida'` e monta a "notícia" a partir da própria atividade | Trocar isso por um endpoint real de feed é direto: só passar a expor um `ref` fetchado em vez do `computed` |
| `interest.ts` | Cliques em "Quero saber mais" — persistidos em `localStorage`, 1 clique por atividade por navegador | Simula "1 clique por servidor" sem autenticação real |
| `events.ts` | Próximo seminário + `pautaProvisoria` (top-3 atividades por `interessados`, ao vivo) | |
| `institucional.ts` | Nome do painel, sigla/nome do comitê (CTRT), sigla/nome do órgão (SEFAZ/MA) | Centralizado para não repetir texto fixo em componente — já pensado para virar editável numa tela de admin (`atualizarIdentidade()`) |

Todas seguem o mesmo padrão: `ref` de estado + `loading`/`carregado` (guarda contra fetch
duplicado) + função `fetchX()` assíncrona. Nenhuma delas usa `mockDelay` real de rede além do que
o `fetch()` já naturalmente tem — a exceção é `events.ts`, que ainda usa `mocks/events.mock.ts`
com um `mockDelay()` artificial (não migrou para JSON porque não há dado real de eventos).

## Rotas (`src/router/index.ts`)

| Caminho | View | Conteúdo |
|---|---|---|
| `/` | `PainelMacroView.vue` | Placar geral, seletor de área, KPIs/gráficos de execução, pódio do mês, feed resumido, próximo evento |
| `/ranking` | `RankingView.vue` | Ranking completo das 21 áreas |
| `/feed` | `FeedView.vue` | Feed completo, com filtro por área |
| `/eventos` | `EventsView.vue` | Próximos seminários + histórico |
| `/areas/:areaId` | `AreaView.vue` | Página de uma área: evolução do índice, plano de atividades (abas por status), histórico de publicações/selos |
| `/areas/:areaId/atividades/:activityId` | `ActivityDetailView.vue` | Detalhe de uma atividade: prazos, andamentos, comprovações, trilha de auditoria, "Quero saber mais" |
| `/:pathMatch(.*)*` | `NotFoundView.vue` | 404 |

`PainelMacroView` tem um seletor de área (`AreaSelectorGrid.vue`) que **filtra os KPIs, os
gráficos e o feed da própria home** sem navegar — é diferente de ir para `/areas/:id`, que mostra
a página completa daquela área.

## Sistema de design

Tokens em `src/assets/styles/main.css`, bloco `@theme` (Tailwind v4 — sem arquivo de config
separado):

- **Cores** (OKLCH): `ink`/`ink-2`/`ink-soft` (tinta, mastro/placar), `paper`/`paper-dim` (fundo),
  `card` (fundo de painel), `line` (borda), `brass`/`brass-ink` (latão — accent de celebração:
  destaque do pódio, "em andamento" nos gráficos), `status-good`/`status-warning`/`status-critical`
  (+ variantes `-bg`) — únicas cores com significado semântico fixo (verde/amarelo/vermelho da
  seção 3.3 da especificação), sempre pareadas com rótulo de texto, nunca só cor.
- **Tipografia**: `font-display` (Archivo — títulos, números grandes), `font-body` (Public Sans —
  texto corrido), `font-mono` (IBM Plex Mono — rótulos, datas, dados tabulares). Carregadas via
  Google Fonts em `index.html`.
- **Raio**: `--radius-card` (0.375rem) e `--radius-chip` (0.25rem) — deliberadamente quase
  quadrado, linha "boletim institucional", não o cantos-bem-arredondados de dashboard SaaS genérico.
- **`.panel`** (`@layer components`): `rounded-card border border-line bg-card` — a classe-base de
  todo cartão da aplicação; sem sombra flutuante.
- **Cor de área**: não é uma lista de 21 cores escolhidas à mão — `useAreaColor.ts` gera a cor pelo
  `colorIndex` da área usando ângulo dourado (`hue = (index * 137.5) % 360`), então qualquer
  quantidade de áreas recebe cores bem distribuídas e determinísticas.
- **Animação**: `--animate-rise` (entrada com leve translateY + fade, usada com `animation-delay`
  escalonado entre seções) e `--animate-flap` (dígitos do placar). `useSplitFlap.ts` anima contagem
  de 0 até o valor — reobservado via `watch`, então também anima quando o valor muda depois (troca
  de área), não só na primeira montagem. Transições nomeadas do Vue (`fade`, `fade-rise`) cobrem
  aparecer/sumir de blocos inteiros (ex.: pódio ao entrar numa área). Tudo respeita
  `prefers-reduced-motion: reduce` (regra global no fim do `main.css`).

## Convenções de código

- Composition API + `<script setup lang="ts">` em 100% dos componentes; nada de Options API.
- Pinia sempre em **setup store** (função com `ref`/`computed`, não objeto `{ state, actions }`),
  e sempre retornando **todo** o estado (regra do skill `vue-pinia-best-practices`: estado que não
  é retornado quebra devtools/SSR).
- Import de tipo separado do de valor (`import type { X } from ...`) — ajuda tree-shaking e deixa
  claro o que é tipo vs runtime.
- Nomes de variável, função e comentário em **português**; nomes de arquivo/pasta em inglês
  (convenção do ecossistema JS).
- Sem testes automatizados ainda — é protótipo de front-end validando fluxo, não produção.
