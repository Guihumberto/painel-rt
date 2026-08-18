# Painel de Acompanhamento de Atividades Institucionais

**Documento de especificação — versão 1.0**
Sistema de gestão, validação e publicação de atividades das 21 áreas da instituição, com transparência, engajamento e competitividade sadia.

---

## 1. Visão geral

O sistema acompanha as atividades planejadas por cada uma das 21 áreas da instituição, com prazos definidos, comprovação documental de execução e validação central antes da publicação. O resultado é apresentado em um **painel público interno**, aberto a todos os servidores, que combina:

- **Feed de notícias** das entregas validadas (vitrine institucional);
- **Ranking e pódio** das áreas, com índice de cumprimento;
- **Páginas por área** com o plano completo: concluídas, em andamento, atrasadas e pendências;
- **Detalhe de cada atividade** com prazos, relato, comprovações e impacto declarado.

### Princípios de desenho

1. **Transparência nos dois sentidos**: quem cumpre é exaltado; quem atrasa aparece com a pendência nomeada — mas sempre com o caminho de regularização visível. Pressão positiva, não exposição punitiva.
2. **O feed só publica coisa boa**: atrasos e pendências aparecem no ranking e na página da área, nunca como "notícia de fracasso". O feed é espaço aspiracional; o ranking é espaço de cobrança.
3. **Nada vira "concluído" sem validação**: a credibilidade do ranking depende da conferência central das comprovações.
4. **Reconhecimento social como motor**: reações, comentários, selos e palco (seminário) valem mais que certificados.
5. **Cooperação dentro da competição**: atividades colaborativas rendem pontos para todas as áreas envolvidas.

---

## 2. Perfis de usuário

| Perfil | Atribuições |
|---|---|
| **Responsável de área** | Cadastra atividades e prazos; registra andamentos; informa conclusão; anexa comprovações; responde a devoluções. Um ou mais por área. |
| **Validador** | Acessa a fila de validação; confere documento e conteúdo; aprova, aprova com edição ou devolve com justificativa; libera para publicação. |
| **Administrador** | Gerencia áreas, usuários e perfis; define parâmetros de pontuação, pesos, limiares e SLAs; agenda publicações e rituais. |
| **Visitante** (todos os servidores) | Acesso somente leitura ao painel, feed e páginas das áreas; pode reagir, comentar e clicar em "Quero saber mais". |

---

## 3. Modelo de atividades

### 3.1 Tipos de prazo

Cada atividade é cadastrada com um dos três tipos:

1. **Janela** — data de início e data de fim;
2. **Data-limite** — apenas data de conclusão;
3. **Contínua/anual** — sem data específica, executada ao longo do ano. Exige **comprovação periódica** (mensal ou trimestral, configurável) em vez de comprovação única no fim do ano, para não ficar invisível até dezembro.

### 3.2 Campos da atividade (cadastro)

- Título e descrição;
- Tipo de prazo e datas;
- **O que muda** — a entrega concreta (preenchido no cadastro, não na conclusão);
- **Impacto para a instituição** — o benefício: economia, celeridade, conformidade, atendimento ao cidadão etc.;
- **Peso** (1 a 3) — definido na validação inicial do plano, refletindo complexidade/esforço;
- Área líder e, quando aplicável, áreas parceiras (ver seção 8.2).

> Preencher impacto no início força a área a pensar em resultado desde o planejamento — e é esse texto que alimenta a notícia do feed.

### 3.3 Estados da atividade

```
planejada → em andamento → em validação → concluída/publicada
```

Desvios:

- **devolvida** — retorna a "em andamento" com justificativa registrada;
- **atrasada** — calculado automaticamente pelo prazo; sobrepõe qualquer estado não concluído;
- **em risco** — estado preventivo privado (ver seção 8.3).

No painel: verde = em dia/concluída · amarelo = em validação · vermelho = atrasada.

---

## 4. Fluxo de funcionamento

### Etapa 1 — Cadastro
O responsável da área registra as atividades do plano anual, com prazos, impacto declarado e peso. O plano passa por validação inicial (confere pesos e coerência) antes de entrar no painel.

### Etapa 2 — Execução e comprovação
Durante a execução, o responsável pode registrar **andamentos parciais** ("iniciamos a fase 2"), que alimentam o histórico e o radar de risco. Ao concluir, marca "concluída", escreve um breve relato e anexa evidências (PDF, imagem, link de processo/documento oficial). A atividade muda para **em validação** — amarela no painel, ainda não pontua.

### Etapa 3 — Validação
O validador vê uma fila de pendências. Para cada uma, três ações:

- **Aprovar** — segue para publicação;
- **Aprovar com edição** — ajusta o texto da notícia sem devolver;
- **Devolver com justificativa** — retorna à área com o motivo registrado.

Tudo com trilha de auditoria. **SLA de validação: 5 dias úteis** (configurável) — sem SLA, o gargalo do sistema vira o próprio validador e as áreas se desmotivam.

### Etapa 4 — Liberação e publicação
A aprovação dispara três efeitos simultâneos:

1. Entra no **feed** como notícia (área, entrega, impacto, anexos públicos);
2. Atualiza o **índice** e a posição da área no **ranking**;
3. Muda o **status** no plano da área.

Publicação imediata ou **agendada em lote** (ex.: toda sexta), criando um ritual semanal de novidades que dá ritmo ao engajamento.

---

## 5. Feed de notícias

Cada publicação exibe:

- Área (com avatar/sigla) e data;
- Selo de contexto: **No prazo** · **Antecipada** · validador responsável;
- Título da entrega;
- Duas frases: **"O que muda"** + **"Impacto"** (texto do cadastro, refinado na validação);
- Comprovações anexadas (públicas);
- Reações e comentários;
- Botão **"Quero saber mais"** (seção 7).

Regras editoriais:

- O selo "Antecipada" celebra comportamento, não só cumprimento;
- Reações e comentários dão audiência à conquista — reconhecimento social é o motor mais barato de competitividade sadia;
- Resumo semanal automático do feed (e-mail ou grupo interno) com pódio, quem subiu e pendências vencendo em 7 dias.

---

## 6. Pontuação, ranking e premiação

### 6.1 Índice de Cumprimento

Percentual de atividades concluídas no prazo, ponderado pelo **peso** de cada atividade (1 a 3). A ponderação evita o incentivo perverso do denominador: quem prometeu pouco não pode cumprir 100% fácil e vencer de quem assumiu 30 atividades complexas.

Componentes:

- Base: `Σ(peso das concluídas no prazo) / Σ(peso total do plano)`;
- **Bônus por antecipação** (conclusão antes do prazo);
- **Bônus de engajamento** por conteúdo adicional produzido (seção 7);
- **Bônus de colaboração** por atividades conjuntas (seção 8.2);
- Sem punição excessiva por volume — o peso já normaliza esforço.

### 6.2 Rankings e ritmo

- **Ranking mensal** com "Destaque do Mês";
- **Ranking anual** acumulado;
- Alertas preventivos ("sua atividade vence em 5 dias") — reduzem atraso muito mais que a exposição pós-fato.

### 6.3 Selos automáticos

Mantêm o engajamento entre premiações:

- **100% em dia** — nenhuma pendência no mês;
- **Primeira a concluir** — primeira entrega validada do ciclo;
- **Sequência** — 3+ meses consecutivos sem atraso;
- **Maior evolução** — maior salto no ranking (tão importante quanto o 1º lugar: dá motivo para a área lá embaixo continuar jogando);
- **Ponte** — área que mais participa de entregas colaborativas.

---

## 7. Botão "Quero saber mais" e seminário

### 7.1 Mecânica do interesse

- Cada servidor pode clicar **uma vez por atividade** (evita disputa de mobilização artificial entre áreas);
- O clique é um **sinal acumulado**, não uma obrigação — se cada clique gerasse tarefa, as áreas torceriam para ninguém clicar e o incentivo inverteria;
- Contador visível publicamente **apenas a partir de um mínimo** (ex.: 5 cliques), para atividade com poucos cliques não parecer "rejeitada";
- Ao cruzar um **limiar configurável** (ex.: 20–30 interessados), o sistema notifica a área com um **convite, não uma ordem**: preparar conteúdo adicional leve — post "bastidores da entrega", vídeo curto, documento explicativo;
- Produzir o conteúdo extra rende **pontos bônus de engajamento**; não produzir não gera punição. O mecanismo é positivo dos dois lados.

### 7.2 Seminário periódico

A cada trimestre (ou semestre), as **3 atividades mais demandadas** viram apresentações curtas num encontro institucional — 15 minutos cada, formato "como fizemos e o que aprendemos". Efeitos:

1. **Palco de prestígio real** para as equipes — apresentar para a casa toda é premiação de verdade, melhor que certificado;
2. **Transferência de conhecimento** entre áreas que normalmente não conversam;
3. **Evento recorrente** que mantém o painel vivo na cultura: as pessoas clicam sabendo que o clique delas escolhe a pauta do próximo seminário.

---

## 8. Funcionalidades adicionais

### 8.1 Relatório de gestão automático

Cada publicação já carrega entrega, impacto, comprovação e validação. Ao final do ano, o sistema gera automaticamente:

- **Relatório anual por área**: planejado vs. realizado, impactos declarados, evidências, trilha de auditoria;
- **Relatório consolidado da instituição**.

Valor institucional: prestação de contas, relatório de gestão para o TCE, resposta a demandas de transparência. O argumento para a alta gestão deixa de ser "um painel de engajamento" e vira **"o fim do sufoco de dezembro montando relatório"** — o trabalho de documentar já foi feito ao longo do ano, no fluxo natural. Para as áreas, saber que cada publicação vira parágrafo do relatório oficial dá peso ao ato de comprovar bem.

### 8.2 Atividades colaborativas

Competição pura entre 21 áreas mata a cooperação — ajudar outra área não renderia nada. Correção:

- Atividade com **área líder + áreas parceiras**;
- Pontos **divididos** entre as envolvidas, com **bônus de 10–20%** justamente por ser colaborativa;
- Notícia no feed **assinada por todas** ("COTEC e COGEP entregaram juntas...");
- Selo **"Ponte"** para a área que mais participa de entregas conjuntas.

Resultado: cooperar passa a ser jogada inteligente dentro da própria competição.

### 8.3 Radar de risco preventivo

O painel tradicional mostra o atraso depois que aconteceu. Camada preditiva simples:

- Atividade com prazo a **menos de 15 dias** e **sem nenhuma movimentação** (nenhum andamento, nenhum anexo parcial) entra em estado **"em risco"**;
- Visível primeiro **só para a área e seu responsável** (alerta privado);
- Só vira vermelho público se o prazo de fato estourar.

Dá à área a chance de reagir antes da exposição — mais justo, e reduz a sensação de "painel dedo-duro". Pré-requisito: permitir registros de andamento parciais mesmo antes da conclusão.

### 8.4 IA na redação das notícias

O maior atrito operacional previsível: responsável escreve relato burocrático ilegível, validador não tem tempo de reescrever, feed fica chato, engajamento morre. Solução:

- No momento da validação, uma chamada à API de IA recebe o **relato bruto + campos de impacto + contexto da atividade** e propõe a versão "notícia": título chamativo, duas frases de impacto, tom institucional-mas-humano;
- O validador **só ajusta e aprova** — a decisão editorial continua humana;
- O mesmo motor gera o **resumo semanal do feed** e, ao final do ano, os **textos do relatório anual** (seção 8.1).

Custo baixíssimo por publicação; resolve um problema que nenhum manual de redação resolveria.

---

## 9. Estrutura de navegação

1. **Painel macro** (página inicial, aberta a todos)
   - Indicadores gerais: cumprimento geral, concluídas no prazo, aguardando validação, atrasadas;
   - Pódio do mês (1º, 2º, 3º + selos);
   - Ranking completo das 21 áreas com barra de progresso e status;
   - Feed de notícias das entregas validadas.

2. **Página da área** (clique no ranking ou no feed)
   - Plano completo: concluídas, em andamento, atrasadas, pendências nomeadas;
   - Histórico de publicações e selos conquistados;
   - Evolução do índice ao longo do ano.

3. **Detalhe da atividade**
   - Prazos, relato, andamentos parciais;
   - Comprovações anexadas;
   - Impacto declarado ("o que muda" / "impacto");
   - Contador de interessados e conteúdos adicionais produzidos;
   - Trilha: quem cadastrou, quem comprovou, quem validou, quando publicou.

4. **Áreas restritas por perfil**
   - Responsável: gestão do plano, registro de andamentos, envio de comprovações;
   - Validador: fila de validação com SLA visível;
   - Administrador: parâmetros, usuários, agendamentos.

---

## 10. Modelo de dados (entidades principais)

| Entidade | Campos principais |
|---|---|
| **Área** | nome, sigla, cor/avatar, responsáveis |
| **Usuário** | nome, área, perfil (responsável / validador / admin / visitante) |
| **Atividade** | título, descrição, tipo de prazo, datas, o que muda, impacto, peso (1–3), estado, área líder, áreas parceiras |
| **Andamento** | atividade, texto, data, autor (registros parciais) |
| **Comprovação** | atividade, arquivo/link, tipo, data, autor |
| **Validação** | atividade, decisão (aprovada / aprovada com edição / devolvida), validador, data, observação |
| **Publicação** | atividade, texto final da notícia, data de publicação, selos |
| **Reação/Comentário** | publicação, usuário, tipo/texto, data |
| **Interesse** | usuário + atividade + data (único por par usuário-atividade) |
| **Parâmetro** | limiares (interesse, risco), SLA de validação, bônus, calendário de publicação |

Com isso o sistema mantém **trilha de auditoria completa** de ponta a ponta.

---

## 11. Roteiro de implantação sugerido

**Versão 1 (núcleo):**
- Cadastro de áreas, usuários e atividades com os três tipos de prazo;
- Fluxo completo: execução → comprovação → validação → publicação;
- Painel macro com indicadores, ranking ponderado e feed;
- Botão "Quero saber mais" (entidade Interesse + limiar);
- Relatório automático (estrutura de dados já preparada desde o dia 1);
- IA na redação das notícias (baixo custo, alto impacto na qualidade do feed).

**Versão 2 (ciclo seguinte):**
- Atividades colaborativas na configuração do plano do ano seguinte;
- Radar de risco preventivo (assim que houver dados de movimentação suficientes);
- Seminário trimestral com pauta definida pelos cliques;
- Resumo semanal automático e alertas preventivos de prazo.

**Cuidados críticos de adoção:**
- SLA de validação desde o início — o validador não pode ser o gargalo;
- Validação inicial dos planos e pesos — sem isso, o ranking nasce sem credibilidade;
- Ritual de publicação semanal — ritmo previsível sustenta o hábito de visitar o painel;
- Feed nunca publica fracasso — cobrança fica no ranking e na página da área.
