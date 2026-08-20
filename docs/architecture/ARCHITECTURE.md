# Architecture

## Stack verificada

- Ionic Angular 8.8.18
- Angular 20.3.25, standalone components e strict TypeScript
- Capacitor Core/CLI/Android 8.5.0
- Preferences 8.0.1, Filesystem 8.1.2 e Share 8.0.1
- pdfmake 0.3.11
- RxJS 7.8.2, SCSS, Karma/Jasmine e Angular ESLint
- Node 22.12+; `.nvmrc` fixa 22.17.0

Versões resolvidas completas estão em `package-lock.json`.

## Princípio e direção de dependências

O produto segue Offline First + Adapter Pattern + Feature Flags.

```text
features / shared UI
        ↓
core models + application contracts/services
        ↑
storage e PDF/native adapters
```

Features importam `core`, `shared` e componentes de template. `core` não importa features, UI ou Capacitor. O preview fornece o adapter PDF local no escopo da rota lazy.

## Estrutura atual

- `core/config`: `AppConfig`, flags e token de injeção.
- `core/models`: Resume, template/cópia do documento e envelope versionado.
- `core/repositories`: contrato `ResumeRepository` e implementação local.
- `core/storage`: boundary key/value e adapter Preferences.
- `core/services`: ATS Score, contrato PDF e definição textual pura.
- `infrastructure/pdf`: adapter pdfmake/Filesystem/Share.
- `features`: editor, biblioteca e preview.
- `templates`: componente visual Classic/Modern.
- `shared/components`: header reutilizável.
- `home`: entrada do fluxo funcional.

## Configuração e feature flags

`APP_CONFIG` é fornecido no bootstrap a partir do environment substituído no build. Flags (`ai`, `ads`, `realBilling`, `premiumTemplates`) são `false` em todos os ambientes. Flags não substituem autorização segura.

## Domínio e storage

`Resume` não depende de framework. Features usam `ResumeRepository`; `LocalResumeRepository` usa `KeyValueStorage`, fornecido por `PreferencesStorage`. O envelope tem `schemaVersion`; mutações são serializadas e versões não suportadas são rejeitadas. A UI não acessa Preferences.

## Fluxos do MVP

```text
Editor → Resume → ResumeRepository → Preferences
                  ↓
Preview → ATSScoreService
        → PdfGeneratorService → LocalPdfGeneratorService
                              → pdfmake → cache privado → Share
```

## ATS e PDF

ATS aplica regras offline totalizando 100 e sempre exibe disclaimer. Seções repetíveis vazias não contam. pdfmake gera uma coluna com texto selecionável; nenhum screenshot é convertido. Exportação web baixa o arquivo; Android usa nome único em `cache/shared` e share sheet, com fallback para Documentos quando Share não está disponível.

## Build web

O builder Angular `application` apresentou deadlock reproduzível no esbuild 0.28.x. O projeto usa o builder suportado `@angular-devkit/build-angular:browser` (Webpack) e mantém output em `www` para o Capacitor.

## Monetização, anúncios e IA

Não implementados. Futuras integrações terão adapters disabled/remote separados. Backend de IA só depois do MVP, opcional, sem chaves no app.

## Segurança e privacidade

Currículos ficam no dispositivo e não são enviados automaticamente. O usuário pode compartilhar explicitamente um PDF com outro app. Não há analytics, backend ou secrets. Android desativa Auto Backup e limita o FileProvider a `cache/shared/`.
