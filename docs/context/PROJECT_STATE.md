# Current Project State

Last updated: 2026-08-20

## Current Version

0.3.0 — MVP offline com localização completa da interface em runtime.

## Working Features

- Home, biblioteca, editor e preview em rotas lazy com fallback.
- Interface completa em `pt-BR`, `en-US`, `es-ES` e `es-419`, incluindo navegação, formulários, estados, score ATS e mensagens de PDF/compartilhamento.
- No primeiro acesso, o idioma é escolhido nesta ordem: preferência persistida válida, primeiro locale compatível do sistema e `APP_CONFIG.defaultLanguage`. A Home oferece seletor persistente no header e a troca é aplicada sem reload.
- Editor Reactive Forms para dados pessoais, objetivo, resumo, experiências, formação, competências, idiomas e cursos.
- Reordenação, validações simples e descarte de seções repetíveis vazias.
- Autosave com debounce e flush na saída, Preferences, CRUD, duplicação e envelope de schema 1 atrás de `ResumeRepository`.
- Classic ATS e Modern ATS, com cabeçalhos do documento em `pt-BR`, `en-US`, `es-ES` e `es-419`. Idioma da interface e `Resume.language` são independentes; novos currículos herdam o idioma atual da interface, sem alterar os existentes.
- ATS-Friendly Score offline de 0 a 100, achados separados e disclaimer.
- PDF textual via pdfmake, download web e Filesystem/Share Android usando arquivo único em cache privado.
- Android `com.cvatsexpress.app` sincronizado; testes unitários e APK debug validados.

## Not Implemented

Monetização, anúncios, templates premium, autenticação, cloud sync, analytics, backend, IA e match de vaga.

## Current Architecture

Standalone Angular UI depende de modelos e contratos centrais. `LocalResumeRepository` e `AppLanguageService` usam o boundary `KeyValueStorage`, implementado por Preferences. O contrato `PdfGeneratorService` é implementado no adapter local/Capacitor carregado com o preview. Score e definição PDF não dependem da UI. A localização segue DEC-006 e ADR-0005.

## Important Services

`LocalResumeRepository`, `PreferencesStorage`, `AppLanguageService`, `ATSScoreService`, `PdfGeneratorService` e `LocalPdfGeneratorService`.

## Important Components

`HomePage`, `MyResumesPage`, `ResumeEditorPage`, `ResumePreviewPage`, `ResumeDocumentComponent` e `AppHeaderComponent`.

## Current Storage Strategy

Preferences armazena o banco de currículos em `cv-ats-express.database`, com JSON versionado (`schemaVersion: 1`), e a preferência independente da interface em `cv-ats-express.app-language.v1`. Mutações de currículos e mudanças rápidas de idioma são serializadas. Android Auto Backup está desligado; no browser o plugin usa localStorage.

## Current PDF Strategy

pdfmake produz uma definição textual de uma coluna. No Android, base64 é escrito em `Directory.Cache/shared` com nome único e entregue ao Share; sem share disponível, é salvo em Documentos. No browser o arquivo é baixado. Exportação exige nome preenchido.

## Current Monetization Strategy

Flags e limite Free continuam centralizados, mas não são aplicados. Billing e monetização não existem.

## Current AI Strategy

Desligada por configuração. Não há backend, chamada remota, SDK ou segredo.

## Technical Debt

- `PreferencesStorage` está em `core/storage` e importa Capacitor diretamente. Features continuam isoladas pelo `KeyValueStorage`, mas mover o adapter para `infrastructure/storage` deixaria a direção física de dependências coerente com a arquitetura declarada.
- O builder `application`/esbuild apresentou deadlock reproduzível; o build usa o builder Angular `browser` (Webpack) como workaround.
- Branding Android ainda usa assets gerados e release signing não está configurado.
- O único teste Android é o smoke test aritmético do scaffold; integração nativa não tem cobertura automatizada.

## Known Bugs

Nenhum bug funcional bloqueador verificado. Veja `KNOWN_ISSUES.md` para limitações.

## Next Recommended Tasks

Executar teste manual em dispositivo Android real: detecção do locale, modal e persistência do idioma, teclado, reinício de processo, abertura do PDF e share sheet. Depois, planejar branding/release ou Milestone 9 opcional sem transformar IA em dependência.
