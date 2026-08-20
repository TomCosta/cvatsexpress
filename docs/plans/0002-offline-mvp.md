# 0002 — Offline MVP

## Goal

Entregar o primeiro aplicativo minimamente funcional conforme os critérios do prompt: criar, editar, salvar, recuperar e gerenciar currículos; escolher template; visualizar; calcular ATS-Friendly Score; gerar e compartilhar PDF textual.

## Context

Milestones 0 e 1 criaram memória, shell, modelo e contratos, mas deixaram todas as ações da Home desabilitadas. O corte anterior não satisfaz o critério de aceite do primeiro MVP.

## Current State

Versão 0.1.0 com Ionic/Angular/Capacitor, Home, `Resume`, `ResumeRepository` abstrato, configuração central e Android validado. Não existe provider de repository, formulário, storage, score ou PDF.

## Scope

- Milestone 2: editor completo com Reactive Forms.
- Milestone 3: CRUD local, duplicação, schema versionado e autosave com debounce.
- Milestone 4: Classic ATS e Modern ATS.
- Milestone 5: score heurístico offline e testes.
- Milestone 6: PDF com texto real, Filesystem e Share.
- Milestones 7–8: validação, revisões e handoff.

## Non-Goals

Backend, IA, job matching, login, cloud sync, billing real, anúncios, analytics, Play Store e templates premium.

## Architecture

Features dependem de `ResumeRepository` e serviços de aplicação. `LocalResumeRepository` depende de um adapter key/value baseado em Capacitor Preferences. ATS e mapeamento de PDF recebem `Resume` e não conhecem UI. PDF é escrito em cache privado para compartilhamento e baixado no browser quando não houver runtime nativo.

## Files/Areas Affected

`core/storage`, `core/repositories`, `core/services`, `features/resume-editor`, `features/my-resumes`, `features/resume-preview`, `templates`, routes, Home, providers, dependências Capacitor/pdfmake, testes, Android e documentação.

## Milestones

- [x] Validar e instalar dependências
- [x] Implementar storage/repository e testes
- [x] Implementar editor/autosave
- [x] Implementar gestão local
- [x] Implementar templates/preview
- [x] Implementar ATS Score e testes
- [x] Implementar PDF/share e testes aplicáveis
- [x] Validar/revisar/corrigir
- [x] Atualizar memória persistente

## Testing

Testes unitários para repository/schema, model factory, ATS e PDF document definition; testes de rotas/componentes críticos; lint, typecheck, Karma, build, Capacitor sync e Gradle debug.

## Security Considerations

Nenhum currículo é enviado automaticamente; Share só ocorre após ação explícita. Android Auto Backup continua desligado. Preferences recebe JSON pequeno; PDFs compartilháveis ficam no cache e o fallback informado usa Documentos. Nenhum log inclui dados pessoais e nenhum secret é introduzido.

## Risks

Bundle do gerador PDF e fontes; diferenças browser/native no compartilhamento; corrupção de JSON local; corrida de autosave; formulários longos em telas pequenas; APIs nativas indisponíveis durante testes web.

## Progress

Concluído em 2026-08-17. Lint, ngc, 25 testes web, build, sync, testes Gradle e APK debug passaram. Revisão visual headless cobriu Home e editor em viewport estreito.

## Decisions

- Um editor único com seções reduz navegação e mantém o MVP simples.
- Persistência usa um único envelope versionado, adequado ao baixo volume inicial.
- O limite Free não será aplicado até existir boundary de monetização; bloquear currículos agora prejudicaria o MVP.
- pdfmake 0.3 foi aceito após prova de bundle e geração textual; o adapter fica no chunk lazy do preview.
- Mutações do envelope local são serializadas para evitar lost updates.
- O builder Angular `browser` substitui temporariamente `application` devido a deadlock reproduzível do esbuild 0.28.x.

## Final Outcome

MVP offline entregue: o usuário cria e edita todas as seções, recupera e gerencia currículos locais, escolhe dois templates, revisa score heurístico e baixa/compartilha PDF textual. IA, backend, monetização e anúncios permanecem fora do escopo. Validação do share sheet e ciclo de vida em hardware Android está registrada como pendência de dispositivo.
