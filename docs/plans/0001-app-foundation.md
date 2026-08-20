# 0001 — App Foundation

## Goal

Estabelecer memória persistente e fundação técnica do CV ATS Express sem iniciar as funcionalidades do editor/MVP.

## Context

O repositório continha scaffold Ionic/Angular parcial com página vazia, menu de exemplo, Capacitor sem Android e nenhuma documentação de produto.

## Current State

Ionic 8, Angular 20 e Capacitor 8 estavam instalados. O runtime padrão era Node 18, incompatível; Node 22.17 já existia via NVM.

## Scope

Documentação, agentes locais, branding, shell, Home, routing, configuração, feature flags, modelo Resume, contrato de repositório, Android e validação básica.

## Non-Goals

Editor, storage adapter, autosave, templates, ATS, PDF, Share, monetização e backend.

## Architecture

Standalone components; configuração injetada; domínio em `core/models`; boundary de storage em `core/repositories`; features sem dependências nativas diretas.

## Files/Areas Affected

Raiz, `docs/`, `.codex/agents/`, `src/app/core`, `src/app/shared`, Home, ambientes, Capacitor e Android.

## Milestones

- [x] Auditar scaffold e versões
- [x] Criar memória do projeto
- [x] Implementar fundação web e contratos
- [x] Adicionar plataforma Android
- [x] Concluir validações e revisão final
- [x] Fechar documentação com resultados verificados

## Testing

Lint, typecheck, Karma/ChromeHeadless, build Angular, `cap sync android` e Gradle `testDebugUnitTest assembleDebug`; teste unitário do factory de currículo e smoke tests de componentes. O teste unitário Android continua sendo apenas o placeholder aritmético gerado pelo scaffold.

## Security Considerations

Nenhum backend, analytics, storage ou transmissão de dados. Todas as flags externas desligadas.

## Risks

Toolchain exige Node >=22.12. Build Gradle depende de Android SDK, Java e acesso ao cache global fora do sandbox.

## Progress

Fundação implementada e validada em 2026-08-16. Revisões de produto, arquitetura e QA foram consolidadas; achados aplicáveis foram corrigidos.

## Decisions

Nome de trabalho mantido como CV ATS Express. Interfaces de domínio não importam Capacitor. A Home torna ações futuras explicitamente indisponíveis.

## Final Outcome

Milestones 0 e 1 concluídos sem antecipar funcionalidades do editor. Lint, typecheck, 7 testes web, build web, Capacitor sync e Gradle `testDebugUnitTest assembleDebug` passaram. A inspeção visual mobile encontrou e corrigiu overflow horizontal. Backup Android foi desligado, FileProvider restringido e plugins padrão não usados removidos. Limitações restantes estão em `KNOWN_ISSUES.md`.
