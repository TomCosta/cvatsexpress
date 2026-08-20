# AI Change Log

## 2026-08-17

### Changed

- Entregues editor completo, autosave, CRUD/duplicação local, biblioteca e rotas do fluxo.
- Adicionados Classic ATS/Modern ATS, localização dos cabeçalhos e preview responsivo.
- Implementados ATS-Friendly Score e PDF textual com download/compartilhamento.
- Integrados Preferences, Filesystem e Share; Android usa cache compartilhável restrito.
- Serializadas mutações locais, adicionado flush de autosave e bloqueada exportação sem nome.
- Ajustado o build para o builder Webpack após deadlock reproduzível do esbuild.

### Why

- Levar a fundação até o primeiro app minimamente funcional previsto pelo master prompt.

### Validation

- Lint e compilação strict passaram.
- 25 testes web passaram em Chrome Headless, incluindo geração real do PDF.
- Build de produção, Capacitor sync, `testDebugUnitTest` e `assembleDebug` passaram.
- Home e editor foram inspecionados em Chrome headless com viewport estreito.

## 2026-08-16

### Changed

- Replaced Ionic starter shell with branded Home and shared header.
- Added central AppConfig/feature flags, Resume model/factory, schema envelope and repository contract.
- Added Android dependency/platform, scripts, lint configuration and Node runtime requirement.
- Created initial durable project documentation and local agent definitions.
- Corrected mobile overflow, zoom/contrast accessibility, Android package tests, backup/file exposure and secret ignore rules after review.

### Why

- Establish Milestones 0 and 1 while keeping later MVP features out of scope.

### Files

- Root configuration, `src/app`, `src/environments`, `android/`, `docs/`, `.codex/agents/`.

### Architecture impact

- Established offline-first dependency direction and adapter boundary.

### Documentation updated

- All documents linked by `docs/INDEX.md` were initialized.

### Validation

- Lint and TypeScript checks passed.
- 7 browser tests passed in Chrome Headless.
- Production build and Capacitor Android sync passed.
- Gradle `testDebugUnitTest` and `assembleDebug` passed after the final native sync.
