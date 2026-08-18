import type { CategoriaDoc } from '@/types/documentacao'

export const CATEGORIAS_DOCUMENTACAO: CategoriaDoc[] = [
  {
    id: 'visao-geral',
    titulo: 'Visão geral',
    artigos: [
      {
        id: 'proposito',
        titulo: 'O que é o Painel de Governança do RT',
        resumo: 'Por que o painel existe e o que ele resolve.',
        blocos: [
          {
            tipo: 'paragrafo',
            texto:
              'O Painel de Governança do RT acompanha o plano de ação das 21 áreas da SEFAZ/MA para a ' +
              'Reforma Tributária (o trabalho do CTRT — Comitê Técnico da Reforma Tributária). Cada área tem ' +
              'um conjunto de atividades planejadas, com prazo, impacto declarado e peso; o painel mostra o ' +
              'andamento de tudo isso de forma pública, para qualquer servidor.',
          },
          {
            tipo: 'paragrafo',
            texto:
              'A ideia central é competitividade sadia com transparência: nada vira "concluído" sem ' +
              'passar por validação central, e o ranking/índice de cumprimento só existe porque essa ' +
              'validação é levada a sério.',
          },
          {
            tipo: 'destaque',
            texto:
              'Este é um protótipo de front-end — os dados de atividade que você cria ou edita ficam salvos ' +
              'no navegador (localStorage), não em um servidor. Servem para validar o fluxo antes de existir ' +
              'um backend de verdade.',
          },
        ],
      },
      {
        id: 'dados-reais',
        titulo: 'De onde vêm os dados',
        resumo: 'Os dados são reais, extraídos do guia oficial do CTRT — não são fictícios.',
        blocos: [
          {
            tipo: 'paragrafo',
            texto:
              'As 21 áreas, os 72 mapeamentos de impacto/risco/oportunidade e as 132 atividades planejadas ' +
              'que você vê no painel vieram do documento oficial "Guia de Ações para Implementação da Reforma ' +
              'Tributária na SEFAZ/MA" — não foram inventados para a demonstração.',
          },
          {
            tipo: 'subtitulo',
            texto: 'Honestidade em cima de dados reais',
          },
          {
            tipo: 'paragrafo',
            texto:
              'Como a maioria das atividades do documento ainda não tem data de conclusão registrada, o ' +
              'painel nunca marca algo como "concluído" por suposição. Uma atividade só aparece concluída ' +
              'quando o texto original diz explicitamente "Finalizado" ou "Realizado" — ou, no protótipo, ' +
              'quando alguém de fato passa pelo fluxo de conclusão e validação. Isso significa que o índice ' +
              'de cumprimento pode parecer baixo: é a leitura honesta do estágio real do plano, não um bug.',
          },
        ],
      },
      {
        id: 'estrutura',
        titulo: 'Como o painel está organizado',
        resumo: 'Áreas, atividades, feed, ranking e o seminário trimestral.',
        blocos: [
          {
            tipo: 'lista',
            itens: [
              'Painel principal — indicadores gerais, seletor de área, gráficos de execução e o feed de notícias.',
              'Página de uma área — plano de atividades daquela área, com abas por status e a posição dela no ranking.',
              'Página de uma atividade — todos os detalhes: prazo, impacto, linha do tempo de andamentos, comprovações anexadas e a trilha de auditoria completa.',
              'Feed — notícias publicadas a partir de atividades concluídas e validadas.',
              'Ranking — as 21 áreas ordenadas pelo índice de cumprimento ponderado por peso.',
              'Próximo evento — destaque do seminário trimestral do CTRT.',
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'perfis',
    titulo: 'Perfis de acesso',
    artigos: [
      {
        id: 'perfil-visitante',
        titulo: 'Visitante',
        resumo: 'Qualquer servidor, sem login — só leitura.',
        blocos: [
          {
            tipo: 'paragrafo',
            texto:
              'É o que qualquer pessoa vê sem entrar no painel: todas as áreas, atividades, o feed de ' +
              'notícias e o ranking. O Visitante pode reagir às publicações do feed e clicar em "Quero saber ' +
              'mais" numa atividade para demonstrar interesse — cada clique conta uma vez por navegador.',
          },
          {
            tipo: 'destaque',
            texto:
              'O feed é curado: só mostra entregas já validadas, sempre em tom positivo. Já a página de cada ' +
              'área e de cada atividade é a "planilha crua" — mostra também atrasos e devoluções, porque essa ' +
              'transparência é o ponto central do painel.',
          },
        ],
      },
      {
        id: 'perfil-responsavel',
        titulo: 'Responsável de área',
        resumo: 'Cadastra, edita e atualiza o andamento das atividades da própria área.',
        blocos: [
          {
            tipo: 'paragrafo',
            texto:
              'Ao entrar como Responsável, a área do painel "Minha área" mostra o plano completo da sua área ' +
              'e permite cadastrar atividades novas e editar as existentes.',
          },
          {
            tipo: 'lista',
            itens: [
              'Cadastrar e editar atividades da própria área (título, descrição, prazo, impacto, peso, áreas parceiras).',
              'Registrar atualizações de andamento na página de cada atividade: início, atualização, paralisação e conclusão — sempre com um artefato comprovando.',
              'Ver quando uma atividade foi devolvida pelo Validador, com o motivo, e reenviar depois de corrigir.',
            ],
          },
          {
            tipo: 'destaque',
            texto:
              'Não existe exclusão de atividade. São registros de um plano oficial de governo — dá para ' +
              'corrigir qualquer campo, mas não apagar um registro.',
          },
        ],
      },
      {
        id: 'perfil-validador',
        titulo: 'Validador',
        resumo: 'Confere as entregas de todas as áreas antes de publicar.',
        blocos: [
          {
            tipo: 'paragrafo',
            texto:
              'O Validador vê a fila de tudo que está "Em validação", de todas as áreas, ordenada pela ' +
              'atividade que está esperando há mais tempo. Para cada uma, três decisões possíveis: aprovar, ' +
              'aprovar com edição (ajustando o texto que vai para o feed) ou devolver com justificativa.',
          },
          {
            tipo: 'paragrafo',
            texto:
              'Aprovar uma atividade dispara, ao mesmo tempo: ela entra no feed como notícia, o índice de ' +
              'cumprimento e o ranking da área são recalculados, e o status muda no plano da área — tudo ' +
              'automático a partir da decisão do Validador.',
          },
        ],
      },
      {
        id: 'perfil-administrador',
        titulo: 'Administrador',
        resumo: 'Gerencia parâmetros e usuários, e pode agir no lugar de Responsável ou Validador.',
        blocos: [
          {
            tipo: 'lista',
            itens: [
              'Ajustar os parâmetros do sistema: SLA de validação, limiar do contador de interesse, bônus do índice de cumprimento.',
              'Gerenciar os usuários de demonstração: criar, editar e excluir.',
              'Agir em nome de qualquer área, como se fosse o Responsável dela.',
              'Agir como Validador em qualquer decisão pendente.',
            ],
          },
          {
            tipo: 'destaque',
            texto:
              'Quando o Administrador age no lugar de alguém, isso fica marcado no autor registrado — por ' +
              'exemplo, "Administrador de Demonstração (em nome de COTEC)" — visível na trilha de auditoria ' +
              'da atividade.',
          },
        ],
      },
      {
        id: 'perfil-auditor',
        titulo: 'Auditor',
        resumo: 'Só leitura, mas privilegiada — visão consolidada de todas as áreas.',
        blocos: [
          {
            tipo: 'paragrafo',
            texto:
              'O Auditor não edita nada. A tela de Auditoria reúne, de todas as 21 áreas numa lista só: ' +
              'atividades devolvidas aguardando reenvio (com o motivo), atividades atrasadas e a fila de ' +
              'validação com o tempo de espera de cada uma.',
          },
          {
            tipo: 'paragrafo',
            texto:
              'Essa informação já é pública nas páginas de cada área — o valor do Auditor é não precisar ' +
              'visitar as 21 áreas uma por uma para montar esse retrato.',
          },
        ],
      },
    ],
  },
  {
    id: 'como-fazer',
    titulo: 'Como fazer',
    artigos: [
      {
        id: 'como-entrar',
        titulo: 'Como entrar no painel',
        resumo: 'Login simulado — sem senha, com usuários de demonstração.',
        blocos: [
          {
            tipo: 'paragrafo',
            texto:
              'Clique em "Entrar" no canto superior direito. O botão "Entrar com SSO da SEFAZ-MA" ainda está ' +
              'desabilitado — a integração real com o SSO institucional (Keycloak) depende de um pedido de ' +
              'cadastro à COTEC que ainda não foi feito. Enquanto isso, escolha um dos usuários de ' +
              'demonstração listados abaixo do botão.',
          },
          {
            tipo: 'destaque',
            texto:
              'Não existe campo de senha em lugar nenhum — nem hoje, nem no fluxo real. Quando o SSO estiver ' +
              'integrado, quem autentica é o Keycloak; o painel só recebe a informação de volta.',
          },
        ],
      },
      {
        id: 'como-cadastrar-atividade',
        titulo: 'Como cadastrar uma atividade nova',
        resumo: 'Responsável de área, em "Minha área".',
        blocos: [
          {
            tipo: 'passos',
            itens: [
              'Entre como Responsável e abra "Minha área" no menu do topo.',
              'Clique em "+ Nova atividade".',
              'Preencha título, descrição, o que muda, impacto, tipo de prazo (janela, data limite ou contínua), peso e, se houver, as áreas parceiras.',
              'Clique em "Cadastrar atividade".',
            ],
          },
          {
            tipo: 'paragrafo',
            texto: 'A atividade nasce com status "Planejada" — o próximo passo é registrar o início dela (ver "Como registrar uma atualização").',
          },
        ],
      },
      {
        id: 'como-editar-atividade',
        titulo: 'Como editar uma atividade existente',
        resumo: 'Corrigir campos como título, prazo ou impacto — sem mexer no status.',
        blocos: [
          {
            tipo: 'passos',
            itens: [
              'Em "Minha área", encontre a atividade na lista (use as abas para filtrar por status).',
              'Clique em "Editar".',
              'Altere os campos necessários e clique em "Salvar alterações".',
            ],
          },
          {
            tipo: 'destaque',
            texto:
              'Toda edição fica registrada: quem mudou, o quê, e o valor antigo e novo — visível na trilha ' +
              'de auditoria da atividade. Esse formulário não muda o status nem o andamento; isso é feito ' +
              'na página da própria atividade (ver "Como registrar uma atualização").',
          },
        ],
      },
      {
        id: 'como-registrar-atualizacao',
        titulo: 'Como registrar uma atualização de andamento',
        resumo: 'Início, atualização, paralisação ou conclusão — sempre com um artefato.',
        blocos: [
          {
            tipo: 'paragrafo',
            texto:
              'Na página da própria atividade (clique nela a partir de "Minha área" ou da página da área), o ' +
              'Responsável vê o botão "+ Registrar atualização". As opções disponíveis mudam de acordo com o ' +
              'status atual da atividade.',
          },
          {
            tipo: 'lista',
            itens: [
              'Planejada → só "Iniciar atividade" (muda o status para "Em andamento").',
              'Em andamento → "Registrar atualização" (fica em andamento), "Sinalizar paralisação" (fica marcada de atenção na linha do tempo, sem mudar o status) ou "Concluir atividade".',
            ],
          },
          {
            tipo: 'paragrafo',
            texto:
              'Toda atualização exige um artefato — PDF, imagem ou link — que comprove aquele momento. Ao ' +
              'concluir, além do relatório do que foi entregue, é preciso escrever um texto separado para o ' +
              'feed público. Concluir muda o status para "Em validação": a partir daí, só o Validador decide ' +
              'o próximo passo.',
          },
        ],
      },
      {
        id: 'como-validar',
        titulo: 'Como validar uma entrega',
        resumo: 'Aprovar, aprovar com edição ou devolver com justificativa.',
        blocos: [
          {
            tipo: 'passos',
            itens: [
              'Entre como Validador e abra "Fila de validação".',
              'Clique numa atividade da fila (as mais antigas aparecem primeiro).',
              'Revise o relatório de conclusão e o artefato anexado, na própria página.',
              'Escolha "Aprovar", "Aprovar com edição" ou "Devolver".',
            ],
          },
          {
            tipo: 'lista',
            itens: [
              'Aprovar — publica a atividade como está: vai para o feed, atualiza o índice e o ranking.',
              'Aprovar com edição — mesma coisa, mas o texto que vai para o feed pode ser reescrito antes de publicar.',
              'Devolver — exige uma justificativa; a atividade volta para "Em andamento" e o Responsável vê o motivo.',
            ],
          },
        ],
      },
      {
        id: 'como-configurar-parametros',
        titulo: 'Como configurar os parâmetros do sistema',
        resumo: 'SLA, limiar de interesse e bônus do índice — Administrador.',
        blocos: [
          {
            tipo: 'passos',
            itens: [
              'Entre como Administrador e abra "Administração" → "Parâmetros".',
              'Ajuste o valor desejado (dias de SLA, limiar de interesse, percentuais de bônus).',
              'Clique em "Salvar parâmetros".',
            ],
          },
          {
            tipo: 'paragrafo',
            texto: 'A mudança vale imediatamente em todo o painel — não precisa recarregar a página.',
          },
        ],
      },
      {
        id: 'como-gerenciar-usuarios',
        titulo: 'Como gerenciar usuários',
        resumo: 'Criar, editar e excluir usuários de demonstração — Administrador.',
        blocos: [
          {
            tipo: 'passos',
            itens: [
              'Entre como Administrador e abra "Administração" → "Usuários".',
              'Para criar: clique em "+ Novo usuário", preencha nome, matrícula, e-mail e perfil (a área só aparece para o perfil Responsável) e clique em "Criar usuário".',
              'Para editar: clique em "Editar" na linha do usuário.',
              'Para excluir: clique em "Excluir" e depois confirme em "Sim".',
            ],
          },
          {
            tipo: 'destaque',
            texto:
              'Um usuário criado aqui já aparece como opção na tela de login — é assim que dá para testar o ' +
              'painel com um perfil novo.',
          },
        ],
      },
      {
        id: 'como-agir-como-admin',
        titulo: 'Como agir no lugar de uma área ou do Validador',
        resumo: 'O Administrador pode assumir qualquer papel, com o autor registrado.',
        blocos: [
          {
            tipo: 'passos',
            itens: [
              'Entre como Administrador.',
              'Para agir como Responsável: abra "Minha área", escolha a área na lista de chips e trabalhe normalmente (cadastrar, editar, registrar atualização).',
              'Para agir como Validador: abra "Fila de validação" e decida como qualquer Validador decidiria.',
              'Para trocar de área sem sair do modo admin: use o link "← Trocar área" no topo de "Minha área".',
            ],
          },
          {
            tipo: 'destaque',
            texto:
              'O nome gravado como autor deixa isso explícito — por exemplo "(em nome de COTEC)" ou "(como ' +
              'Validador)" — visível na trilha de auditoria da atividade.',
          },
        ],
      },
      {
        id: 'como-consultar-auditoria',
        titulo: 'Como consultar a auditoria consolidada',
        resumo: 'Visão de todas as áreas numa tela só — Auditor.',
        blocos: [
          {
            tipo: 'passos',
            itens: [
              'Entre como Auditor (ou Administrador) e abra "Auditoria".',
              'Veja as três listas: devolvidas aguardando reenvio, atrasadas e aguardando validação.',
              'Clique em qualquer linha para abrir a atividade e ver a trilha de auditoria completa.',
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'conceitos',
    titulo: 'Conceitos',
    artigos: [
      {
        id: 'fluxo-de-estados',
        titulo: 'Fluxo de estados de uma atividade',
        resumo: 'Planejada → Em andamento → Em validação → Concluída (ou devolvida).',
        blocos: [
          {
            tipo: 'lista',
            itens: [
              'Planejada — cadastrada, ainda não iniciada.',
              'Em andamento — o Responsável já registrou o início; pode receber atualizações e paralisações sem sair desse status.',
              'Em validação — o Responsável concluiu; aguardando decisão do Validador.',
              'Concluída — o Validador aprovou; aparece no feed e conta no índice de cumprimento.',
              '(Devolvida não é um status à parte — a atividade volta para "Em andamento" com o motivo registrado.)',
            ],
          },
          {
            tipo: 'paragrafo',
            texto:
              '"Atrasada" também não é um status gravado — é calculado automaticamente comparando o prazo com ' +
              'a data de hoje, e some assim que a atividade é concluída.',
          },
        ],
      },
      {
        id: 'historico-e-auditoria',
        titulo: 'Histórico e trilha de auditoria',
        resumo: 'Toda mudança relevante fica registrada — e visível.',
        blocos: [
          {
            tipo: 'paragrafo',
            texto:
              'Cada atividade tem uma trilha de auditoria que junta, em ordem cronológica: quando foi ' +
              'cadastrada, cada campo alterado depois (com o valor antigo e o novo), cada comprovação anexada ' +
              'e cada decisão de validação — inclusive devoluções, com a justificativa.',
          },
          {
            tipo: 'destaque',
            texto:
              'Essa trilha é pública — qualquer Visitante pode ver, na página da atividade. A transparência é ' +
              'o ponto, não um extra para quem audita.',
          },
        ],
      },
      {
        id: 'sla-validacao',
        titulo: 'SLA de validação',
        resumo: 'Quantos dias úteis uma atividade pode esperar na fila do Validador.',
        blocos: [
          {
            tipo: 'paragrafo',
            texto:
              'Por padrão, uma atividade "Em validação" tem 5 dias úteis de prazo antes de ser considerada ' +
              'fora do SLA — esse número é configurável pelo Administrador. O contador conta só dias úteis, ' +
              'pulando sábado e domingo.',
          },
          {
            tipo: 'paragrafo',
            texto:
              'Enquanto o prazo não estoura, o tempo de espera aparece em amarelo; depois de estourar, em ' +
              'vermelho — tanto na fila do Validador quanto na página da própria atividade.',
          },
        ],
      },
      {
        id: 'indice-cumprimento',
        titulo: 'Índice de cumprimento e ranking',
        resumo: 'Como a posição de cada área no ranking é calculada.',
        blocos: [
          {
            tipo: 'paragrafo',
            texto:
              'O índice de uma área começa pela proporção do peso das atividades concluídas no prazo sobre o ' +
              'peso total do plano dela. Em cima disso, três bônus (também configuráveis pelo Administrador):',
          },
          {
            tipo: 'lista',
            itens: [
              'Antecipação — atividades concluídas antes do prazo.',
              'Engajamento — atividades com bastante interesse demonstrado por outros servidores.',
              'Colaboração — atividades concluídas em parceria com outra área.',
            ],
          },
          {
            tipo: 'paragrafo',
            texto: 'O ranking ordena as 21 áreas por esse índice, do maior para o menor.',
          },
        ],
      },
    ],
  },
]
