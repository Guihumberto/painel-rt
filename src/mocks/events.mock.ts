import type { Evento } from '@/types/event'

/**
 * Sem seminários "realizados" ainda: o guia real da Reforma Tributária não
 * registra nenhuma apresentação já feita, então não há como popular um
 * histórico sem inventar dado sobre entregas que não existem. O seminário
 * trimestral fica com pauta 100% dinâmica (ver `pautaProvisoria` na store de
 * eventos), então não depende de nenhum id fixo de atividade.
 *
 * Já a série de Reuniões Ordinárias do CTRT tem pauta fixa, com assunto e
 * responsável nomeados — por isso usa `assuntos`/`informes` em vez de
 * `atividadesIds`. As reuniões nº 12 e 13 ficam com `status: 'realizado'`
 * para dar histórico de verdade à série (mesmo `tipo`), que
 * `EventoDetalheView` usa para listar "próxima" vs. "já ocorreu" — regra:
 * inscrição só é permitida em reunião agendada.
 */
export const eventos: Evento[] = [
  {
    id: 'evt-ctrt-12-2026',
    titulo: 'Reunião Ordinária nº 12/2026 — CTRT',
    tipo: 'Reunião ordinária',
    numero: '12/2026',
    data: '2026-07-21',
    hora: '16h30',
    local: 'Salas de Aula 01 e 02',
    modalidade: 'Presencial',
    publicoAlvo: 'Secretário de Estado da Fazenda, gestores, servidores e integrantes do Encat.',
    descricao: 'Reunião ordinária do Comitê Técnico da Reforma Tributária (CTRT/SEFAZ).',
    status: 'realizado',
    assuntos: [
      {
        ordem: 1,
        titulo: 'Apresentação do plano de trabalho do CTRT para o 2º semestre de 2026',
        responsavel: 'Coordenação Executiva — Humberto',
      },
      {
        ordem: 2,
        titulo: 'Diagnóstico preliminar de preparação institucional da Reforma Tributária do Consumo',
        responsavel: 'Iolanda Barbosa',
      },
      {
        ordem: 3,
        titulo: 'Definição dos grupos de estudo temáticos do comitê',
        responsavel: 'Comissão de Organização',
      },
    ],
    informes: [
      'Lançamento do Diagnóstico de Preparação Institucional da Reforma Tributária do Consumo.',
      'Divulgação do calendário de reuniões ordinárias do CTRT para o 2º semestre.',
    ],
  },
  {
    id: 'evt-ctrt-13-2026',
    titulo: 'Reunião Ordinária nº 13/2026 — CTRT',
    tipo: 'Reunião ordinária',
    numero: '13/2026',
    data: '2026-08-04',
    hora: '16h30',
    local: 'Salas de Aula 01 e 02',
    modalidade: 'Presencial',
    publicoAlvo: 'Secretário de Estado da Fazenda, gestores, servidores e integrantes do Encat.',
    descricao: 'Reunião ordinária do Comitê Técnico da Reforma Tributária (CTRT/SEFAZ).',
    status: 'realizado',
    assuntos: [
      {
        ordem: 1,
        titulo: 'Revisão do cronograma de transição para o Comitê Gestor do IBS',
        responsavel: 'André Massa',
      },
      {
        ordem: 2,
        titulo: 'Levantamento de sistemas legados impactados pela extinção do ICMS',
        responsavel: 'Luciano Dutra',
      },
      {
        ordem: 3,
        titulo: 'Alinhamento sobre o calendário de testes do ambiente de homologação da CBS',
        responsavel: 'Marcelo Queiroz',
      },
      {
        ordem: 4,
        titulo: 'Definição da equipe de apoio ao Seminário sobre a Reforma Tributária',
        responsavel: 'Comissão de Organização',
      },
    ],
    informes: [
      'Abertura das inscrições do Curso Básico sobre a Reforma Tributária para servidores.',
      'Publicação da Nota Técnica nº 08/2026 sobre split payment.',
    ],
  },
  {
    id: 'evt-ctrt-14-2026',
    titulo: 'Reunião Ordinária nº 14/2026 — CTRT',
    tipo: 'Reunião ordinária',
    numero: '14/2026',
    data: '2026-08-18',
    hora: '16h30',
    local: 'Salas de Aula 01 e 02',
    modalidade: 'Presencial',
    publicoAlvo: 'Secretário de Estado da Fazenda, gestores, servidores e integrantes do Encat.',
    descricao: 'Reunião ordinária do Comitê Técnico da Reforma Tributária (CTRT/SEFAZ).',
    status: 'agendado',
    assuntos: [
      {
        ordem: 1,
        titulo: 'Análise da saída do Estado de São Paulo da Substituição Tributária',
        responsavel: 'André Massa',
      },
      {
        ordem: 2,
        titulo:
          'Reporte sobre Visita Técnica e Imersão nos Sistemas do IBS e Integração com a CBS na SEFAZ-RS / PROCERGS',
        responsavel: 'Luciano Dutra',
      },
      {
        ordem: 3,
        titulo: 'Impactos da Reforma Tributária no Comércio Exterior',
        responsavel: 'Marcelo Queiroz',
      },
      {
        ordem: 4,
        titulo: 'Atualizações sobre organização do Seminário sobre a Reforma Tributária',
        responsavel: 'Comissão de Organização',
      },
      {
        ordem: 5,
        titulo:
          'Apresentação de Painel de Monitoramento e Controle do CTRT das ações previstas nos planos operativos',
        responsavel: 'Coordenação Executiva — Humberto',
      },
    ],
    informes: [
      'Quantitativo de respostas por perfil dos formulários do Diagnóstico de Preparação Institucional da Reforma Tributária do Consumo — Iolanda Barbosa.',
      'Curso Básico sobre a Reforma Tributária para servidores — data: 25 e 26 de agosto.',
      'Curso sobre a Reforma Tributária para a sociedade — data: 03/09 a 25/11.',
      'Grupo de Estudo — data: 27/08 — tema "Comitê Gestor do Imposto sobre Bens e Serviços: Art. 25 ao 53 da Lei Complementar nº 227/2026", com exposição de Diego Secchin.',
    ],
  },
  {
    id: 'evt-2026-q3',
    titulo: 'Seminário Institucional — 3º trimestre',
    tipo: 'Seminário trimestral',
    data: '2026-09-25',
    local: 'Auditório principal',
    descricao:
      'Pauta definida pelas 3 atividades mais demandadas em "Quero saber mais" até a data do evento.',
    status: 'agendado',
  },
]
