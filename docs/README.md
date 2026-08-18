# Documentação — Painel de Governança do RT

Este diretório documenta o que foi construído até agora (protótipo de front-end, dados reais do
CTRT, perfil Visitante) e dá o direcionamento para a próxima fase (perfis Responsável de área,
Validador e Administrador).

## Onde procurar o quê

| Documento | Conteúdo |
|---|---|
| [`arquitetura-e-dados.md`](./arquitetura-e-dados.md) | Como o projeto é organizado, como os dados fluem do JSON até a tela, o modelo de dados completo, o sistema de design (cores, tipografia, animação) |
| [`roteiro-fase-2.md`](./roteiro-fase-2.md) | O que falta para os perfis Responsável de área, Validador e Administrador — permissões, fluxo de estados, o que muda no modelo de dados, telas sugeridas |
| [`reforma-tributaria-ctrt.md`](./reforma-tributaria-ctrt.md) | Transcrição de referência do PDF oficial (Guia de Ações da Reforma Tributária na SEFAZ/MA) — a fonte dos dados reais usados no protótipo |
| [`Manual de integração com SSO da SEFAZ-MA.pdf`](./Manual%20de%20integração%20com%20SSO%20da%20SEFAZ-MA.pdf) | Manual oficial da COTEC (Keycloak/OpenID Connect) — como funciona o SSO real da SEFAZ-MA e o que pedir pra integrar; resumido em [`roteiro-fase-2.md`](./roteiro-fase-2.md#sso-real-cotecKeycloak) |
| [`especificacao-painel-atividades.md`](../especificacao-painel-atividades.md) | Especificação original do produto (na raiz do projeto) — perfis de usuário, fluxo de validação, pontuação, feed, selos |

## Resumo de uma frase

Um painel público (somente leitura, perfil **Visitante**) que mostra o plano de ação dos 21
setores da SEFAZ/MA para a Reforma Tributária — indicadores, ranking, gráficos de execução, feed
de entregas e um seminário trimestral — construído em Vue 3 + Pinia, alimentado por dados reais
extraídos do guia oficial do CTRT (não por dados fictícios).

## Como rodar

```bash
pnpm install
pnpm run dev        # http://localhost:5173
pnpm run typecheck  # vue-tsc --noEmit
pnpm run build
```

## Estado atual em uma tabela

| Perfil da especificação | Implementado? |
|---|---|
| **Visitante** (leitura, reações, "quero saber mais") | ✅ Sim — é tudo que existe hoje |
| **Responsável de área** (cadastra, registra andamento, anexa comprovação) | ❌ Não — ver [`roteiro-fase-2.md`](./roteiro-fase-2.md) |
| **Validador** (fila de validação, aprova/devolve) | ❌ Não — ver [`roteiro-fase-2.md`](./roteiro-fase-2.md) |
| **Administrador** (parâmetros, usuários, agendamentos) | ❌ Não — ver [`roteiro-fase-2.md`](./roteiro-fase-2.md) |

Hoje **não existe backend** — todo o "banco de dados" é um conjunto de arquivos JSON estáticos em
`public/data/`, buscados por `fetch()` no carregamento da página (ver
[`arquitetura-e-dados.md`](./arquitetura-e-dados.md)). Existe uma página de login (`/login`), mas é
uma **sessão simulada** — escolhe entre usuários de demonstração, sem senha real; o SSO
institucional de verdade (Keycloak/OpenID Connect, mantido pela COTEC) ainda não está integrado
(ver [`roteiro-fase-2.md`](./roteiro-fase-2.md#sso-real-cotecKeycloak)).
