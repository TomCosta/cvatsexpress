# Testing

## Current toolchain

Karma + Jasmine for unit/component tests, Angular ESLint for TypeScript/templates, Angular production build for compilation and budgets. Use Node from `.nvmrc`.

```bash
npm run lint
npm run test:ci
npm run build
npm run android:sync
cd android && ./gradlew testDebugUnitTest assembleDebug
```

Os 25 testes web cobrem app/router, redirects e rotas críticas, Home, factory do Resume, CRUD/schema/concorrência do repository, regras e limites do ATS Score, conteúdo da definição PDF e geração real de um arquivo PDF. O teste Gradle passa, mas seu único teste nativo continua sendo o placeholder aritmético do scaffold.

## Required future coverage

- Forms: validation, repeated entities, reorder and edge cases.
- Autosave: debounce, errors and lifecycle recovery.
- Mobile: empty states, keyboard, navigation, process restart, native file/share errors and offline behavior.

## Última validação completa

Em 2026-08-17: lint, `ngc`, 25 testes Karma, build de produção, `cap sync android`, `testDebugUnitTest` e `assembleDebug`. O sync encontrou exatamente Filesystem, Preferences e Share. O build Android apresentou apenas warnings internos do plugin Filesystem sobre APIs legadas de download que o app não usa.

Do not treat a passing web build as an Android native build. Record skipped checks and environment blockers.
