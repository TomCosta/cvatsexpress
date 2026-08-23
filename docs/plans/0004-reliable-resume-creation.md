# 0004 — Reliable Resume Creation

## Goal

Eliminar o ciclo de falha ao criar o primeiro currículo, tornando criação, persistência, navegação e recuperação estados explícitos e testáveis.

## Context

O fluxo que motivou este plano direcionava Home e biblioteca para `/resume/new`. O próprio `ResumeEditorPage` gerava um ID, salvava um rascunho e navegava para `/resume/:id/edit` durante sua inicialização. Qualquer falha de geração de ID, clonagem, Preferences ou navegação aparecia como erro genérico de abertura; quando nenhum registro era salvo, o usuário voltava à biblioteca vazia e repetia o mesmo fluxo sem conseguir avançar.

## Current State

No início do plano, `ResumeEditorPage.initialize()` possuía duas responsabilidades: criar um currículo quando não existia parâmetro `id` e carregar um currículo existente quando existia. Home e os dois botões de criação da biblioteca eram links declarativos para `/resume/new`. Testes isolados usavam repository e router simulados, mas não validavam criação, persistência, navegação e reabertura como um único fluxo. O estado entregue está descrito em “Final Outcome”.

## Scope

- Criar um caso de uso central para gerar e persistir um novo currículo.
- Acionar o caso de uso na Home e na biblioteca antes da navegação.
- Manter erro e nova tentativa na tela de origem e impedir criações concorrentes por clique repetido.
- Fazer o editor carregar apenas currículos identificados por `/resume/:id/edit`.
- Remover a rota intermediária `/resume/new`.
- Tornar geração de IDs e clonagem local compatíveis com runtimes sem `randomUUID` ou `structuredClone`.
- Adicionar traduções e testes unitários/de integração para sucesso e falha.

## Non-Goals

Alterar schema do banco, migrar Preferences, criar backend, sincronização, autenticação, limite Free/Pro ou reformular o editor.

## Architecture

Um serviço de aplicação em `core/services` cria o modelo usando idioma/título atuais e persiste por `ResumeRepository`. Home e biblioteca coordenam apenas estado visual e navegação. O editor deixa de produzir entidades e volta a ter responsabilidade única de carregar/editar um ID existente. Helpers puros em `core` fornecem IDs locais e clonagem JSON-safe sem dependência obrigatória de APIs recentes do WebView.

## Files/Areas Affected

Rotas; Home; biblioteca; editor; `core/services`; helpers/modelos locais; repository; catálogo de traduções; testes; documentação de arquitetura, testes e contexto.

## Milestones

- [x] Diagnosticar o fluxo e reproduzir em runtime limpo
- [x] Implementar caso de uso e compatibilidade local
- [x] Integrar Home, biblioteca, rotas e editor
- [x] Adicionar testes de sucesso, falha e recuperação
- [x] Executar lint, testes, build e Capacitor sync
- [x] Concluir revisões e atualizar memória persistente

## Testing

Testes do gerador de ID com e sem APIs modernas; teste do caso de uso; testes de componente para Home e biblioteca em sucesso/falha; teste de rota com repository real em memória que cria, persiste e abre o editor; regressão integral, lint, build e Capacitor sync.

## Security Considerations

IDs são identificadores locais, não tokens de autorização. O fallback não transmite dados nem adiciona rede. Mensagens de erro não devem incluir conteúdo do currículo. A persistência continua atrás de `ResumeRepository` e `KeyValueStorage`.

## Risks

Cliques repetidos criarem duplicatas, navegação falhar após uma gravação bem-sucedida, testes não aguardarem a navegação assíncrona e fallback de clonagem perder valores não serializáveis. O modelo `Resume` é deliberadamente JSON-safe porque já é persistido como JSON.

## Progress

Iniciado em 2026-08-22 após diagnóstico do relato, leitura da documentação canônica e reprodução do fluxo em Chrome limpo. A reprodução funcionou nesse ambiente, confirmando fragilidade dependente de runtime/estado local em vez de rota invariavelmente inválida.

Concluído em 2026-08-22. Foram implementados o caso de uso, integração das duas origens, remoção da rota intermediária, fallbacks de runtime e cobertura de sucesso/erro/concorrência/lifecycle. Lint, 60/60 testes Karma, build de produção, Capacitor sync e tarefas Gradle debug passaram. Revisões de arquitetura, produto e QA não encontraram pendência bloqueadora.

## Decisions

- Criação deve terminar antes da navegação para o editor.
- Em falha de navegação após salvar, a Home preserva o ID para tentar abrir o mesmo currículo; a biblioteca recarrega a lista e expõe o documento já persistido.
- O editor não cria implicitamente currículos.
- `/resume/new` deixa de ser uma rota pública interna; entradas de criação são ações explícitas da Home e biblioteca.
- Cliques repetidos são ignorados enquanto a criação está pendente; uma epoch de atividade da view impede redirecionamento tardio depois que a tela deixa de estar ativa.
- Erros persistentes na Home e biblioteca armazenam chaves de tradução, para que a mensagem acompanhe o idioma atual.
- `createLocalId` e `cloneJsonValue` mantêm o fluxo disponível em WebViews sem APIs modernas ou com implementação defeituosa. O fallback de clonagem é seguro para o domínio JSON-safe persistido.
- O envelope continua em `schemaVersion: 1`; não houve migração de dados.
- A revisão arquitetural concluiu que o caso de uso reforça os boundaries aceitos e não exige um novo ADR.

## Final Outcome

Concluído em 2026-08-22. `CreateResumeService` gera o ID compatível, inicializa o currículo com idioma/título atuais e aguarda `ResumeRepository.save()` antes de devolver o documento. Home e biblioteca coordenam estado e navegam somente depois da persistência; `/resume/new` foi removida e `ResumeEditorPage` apenas carrega o ID recebido.

Falhas de criação, abertura e leitura têm mensagens separadas e reativas ao idioma. A Home reutiliza o currículo salvo se apenas a navegação falhar; a biblioteca recarrega a lista para expor esse documento. Guardas contra clique repetido e epochs de atividade evitam duplicatas e redirecionamentos tardios. O repositório e IDs de itens repetíveis usam fallbacks compatíveis para `structuredClone` e Web Crypto, sem mudar `schemaVersion: 1`.

Validação final: lint, 60/60 testes Karma, build de produção, Capacitor sync com Filesystem/Preferences/Share, `testDebugUnitTest` e `assembleDebug`. Revisões de arquitetura, produto e QA concluídas sem pendência bloqueadora.
