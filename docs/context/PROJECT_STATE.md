# Current Project State

Last updated: 2026-09-28

## Current Version

0.3.0 — MVP offline com localização completa da interface em runtime.

## Working Features

- Home, biblioteca, editor e preview em rotas lazy com fallback.
- Criação confiável pela Home e biblioteca: o currículo é gerado e persistido antes da navegação, com bloqueio de cliques repetidos e erros distintos de criação, abertura e leitura.
- Interface completa em `pt-BR`, `en-US`, `es-ES` e `es-419`, incluindo navegação, formulários, estados, score ATS e mensagens de PDF/compartilhamento.
- No primeiro acesso, o idioma é escolhido nesta ordem: preferência persistida válida, primeiro locale compatível do sistema e `APP_CONFIG.defaultLanguage`. A Home oferece seletor persistente no header e a troca é aplicada sem reload.
- Editor Reactive Forms para dados pessoais, objetivo, resumo, experiências, formação, competências, idiomas e cursos.
- LinkedIn e portfólio aceitam preenchimento simplificado: o editor completa automaticamente o prefixo canônico ao sair do campo e antes de salvar, sem preencher campos opcionais vazios.
- Reordenação, validações simples e descarte de seções repetíveis vazias.
- Autosave com debounce e flush na saída, Preferences, CRUD, duplicação e envelope de schema 1 atrás de `ResumeRepository`.
- Classic ATS e Modern ATS, com cabeçalhos do documento em `pt-BR`, `en-US`, `es-ES` e `es-419`. Idioma da interface e `Resume.language` são independentes; novos currículos herdam o idioma atual da interface, sem alterar os existentes.
- ATS-Friendly Score offline de 0 a 100, achados separados e disclaimer.
- PDF textual via pdfmake, download web e Filesystem/Share Android usando arquivo único em cache privado.
- Android `com.cvatsexpress.app` sincronizado; testes unitários e APK debug validados.
- Launcher Android usa a identidade CV ATS Express em todas as densidades, com ícones legacy, round, adaptativos e temáticos do Android 13+ reproduzíveis por `npm run android:icons`.

## Not Implemented

Monetização, anúncios, templates premium, autenticação, cloud sync, analytics, backend, IA e match de vaga.

## Store Publication Preparation

A standalone privacy-policy site is prepared under `politicaDePrivacidade/public/`, with the app logo, responsive styling and Firebase Hosting configuration. The single page provides complete content in `pt-BR`, `en-US`, `es-ES` and `es-419`; it prioritizes a valid saved choice, then detects the first compatible browser/system locale, and falls back to `en-US`. Hosting is explicitly assigned to the site `cv-ats-express-privacy-policy`, whose expected primary URL is `https://cv-ats-express-privacy-policy.web.app/`; the `/privacy-policy` route is also configured, and root-relative assets were validated in the Hosting emulator. It reflects the verified offline behavior and has no analytics or third-party frontend dependencies. Publication remains pending: the placeholders must be replaced with the public privacy contact email, the site must be deployed, and the resulting HTTPS URL must be registered in Play Console.

A separate multilingual product landing page is prepared under `landing-page/public/` for the default Firebase Hosting site `cv-ats-express` and expected URL `https://cv-ats-express.web.app/`. It presents only implemented capabilities, uses the same persisted-locale resolution for `pt-BR`, `en-US`, `es-ES` and `es-419`, and includes responsive marketing content, software-app microdata, canonical/Open Graph metadata, `robots.txt`, `sitemap.xml` and a web manifest. It links to the dedicated privacy site and intentionally shows Google Play as coming soon until a public listing URL exists. Deployment is pending.

## Current Architecture

Standalone Angular UI depende de modelos e contratos centrais. `CreateResumeService` cria e persiste antes de Home ou biblioteca navegarem para o editor; o editor apenas carrega um ID existente. `LocalResumeRepository` e `AppLanguageService` usam o boundary `KeyValueStorage`, implementado por Preferences. O contrato `PdfGeneratorService` é implementado no adapter local/Capacitor carregado com o preview. Score e definição PDF não dependem da UI. A localização segue DEC-006 e ADR-0005.

## Important Services

`CreateResumeService`, `LocalResumeRepository`, `PreferencesStorage`, `AppLanguageService`, `ATSScoreService`, `PdfGeneratorService` e `LocalPdfGeneratorService`.

## Important Components

`HomePage`, `MyResumesPage`, `ResumeEditorPage`, `ResumePreviewPage`, `ResumeDocumentComponent` e `AppHeaderComponent`.

## Current Storage Strategy

Preferences armazena o banco de currículos em `cv-ats-express.database`, com JSON versionado (`schemaVersion: 1`), e a preferência independente da interface em `cv-ats-express.app-language.v1`. A correção do fluxo de criação não alterou esse schema. Mutações de currículos e mudanças rápidas de idioma são serializadas. IDs e clonagem de dados JSON-safe possuem fallback para WebViews sem `randomUUID` ou `structuredClone` funcional. Android Auto Backup está desligado; no browser o plugin usa localStorage.

## Current PDF Strategy

pdfmake produz uma definição textual de uma coluna. No Android, base64 é escrito em `Directory.Cache/shared` com nome único e entregue ao Share; sem share disponível, é salvo em Documentos. No browser o arquivo é baixado. Exportação exige nome preenchido.

## Current Monetization Strategy

Flags e limite Free continuam centralizados, mas não são aplicados. Billing e monetização não existem.

## Current AI Strategy

Desligada por configuração. Não há backend, chamada remota, SDK ou segredo.

## Technical Debt

- `PreferencesStorage` está em `core/storage` e importa Capacitor diretamente. Features continuam isoladas pelo `KeyValueStorage`, mas mover o adapter para `infrastructure/storage` deixaria a direção física de dependências coerente com a arquitetura declarada.
- O builder `application`/esbuild apresentou deadlock reproduzível; o build usa o builder Angular `browser` (Webpack) como workaround.
- Splash Android ainda usa os assets gerados do scaffold e release signing não está configurado; os ícones launcher já estão personalizados.
- O único teste Android é o smoke test aritmético do scaffold; integração nativa não tem cobertura automatizada.

## Known Bugs

Nenhum bug funcional bloqueador verificado. O ciclo que impedia criar o primeiro currículo foi corrigido em 2026-08-22. Veja `KNOWN_ISSUES.md` para limitações.

## Next Recommended Tasks

Executar teste manual em dispositivo Android real: detecção do locale, modal e persistência do idioma, teclado, reinício de processo, abertura do PDF e share sheet. Depois, planejar branding/release ou Milestone 9 opcional sem transformar IA em dependência.
