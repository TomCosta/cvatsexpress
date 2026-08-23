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

Os 64 testes web cobrem app/router, redirects e rotas críticas, Home, factory do Resume, CRUD/schema/concorrência do repository, normalização de links profissionais, regras e limites do ATS Score, conteúdo da definição PDF, geração real de um arquivo PDF e localização runtime. A cobertura de i18n inclui mapeamento de locale (`es-MX → es-419`), precedência da preferência persistida, fallback, catálogo completo, serialização de mudanças, títulos de rota, renderização localizada de telas críticas e independência entre UI e `Resume.language`.

A criação confiável tem testes para o caso de uso, IDs com e sem Web Crypto, clonagem nativa e fallback JSON, criação/persistência/abertura integradas pela Home e biblioteca, falha de storage, falha de navegação, recarga da lista, mudança de idioma após erro, clique repetido e saída da tela durante uma gravação pendente. O editor também verifica que um ID ausente gera erro e não cria um documento. O teste Gradle passa, mas seu único teste nativo continua sendo o placeholder aritmético do scaffold.

## Required future coverage

- Forms: validation, repeated entities, reorder and edge cases.
- Autosave: debounce, errors and lifecycle recovery.
- Mobile: empty states, keyboard, navigation, process restart, native file/share errors and offline behavior.
- Android i18n: locale real do sistema, modal de seleção e persistência após encerramento do processo.

## Última validação completa

Em 2026-08-23: lint, 64/64 testes Karma, build de produção e `cap sync android`; o sync encontrou exatamente Filesystem, Preferences e Share. `testDebugUnitTest` e `assembleDebug` passaram por último em 2026-08-22. Revisões de arquitetura, produto e QA terminaram sem pendência bloqueadora nessa entrega maior. O smoke visual de 2026-08-20 continua sendo a última inspeção registrada: verificou `es-MX → es-419` e ausência de overflow na Home e no editor em viewports de 320 px e 360 px. O build Android apresentou apenas warnings internos do plugin Filesystem sobre APIs legadas de download que o app não usa.

Do not treat a passing web build as an Android native build. Record skipped checks and environment blockers.
