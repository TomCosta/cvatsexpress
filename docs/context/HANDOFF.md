# AI / Developer Handoff

## Read These First

1. `AGENTS.md`
2. `docs/INDEX.md`
3. `docs/product/PRODUCT.md`
4. `docs/context/PROJECT_STATE.md`
5. `docs/architecture/ARCHITECTURE.md`
6. `docs/architecture/DECISIONS.md`

## What the App Does

CV ATS Express cria, salva, avalia e exporta currículos ATS-friendly sem cadastro ou backend. O fluxo offline do MVP está ativo.

## Current Development State

Milestones 0–8 estão implementados. A versão 0.3.0 acrescenta localização completa da interface em runtime para `pt-BR`, `en-US`, `es-ES` e `es-419`, mantendo editor, autosave/CRUD local, dois templates, preview, score heurístico, PDF/download/share e Android.

## Last Significant Change

Em 2026-08-20 a UI inteira passou a usar catálogo tipado em runtime. `AppLanguageService` inicializa antes da primeira renderização, prioriza preferência válida, depois o primeiro locale compatível do sistema e por fim `APP_CONFIG.defaultLanguage`, e persiste em `cv-ats-express.app-language.v1`. A Home expõe o seletor; a escolha da UI não altera `Resume.language` de documentos existentes, enquanto novos currículos a herdam.

## Current Problems

Nenhum bloqueio conhecido. Faltam validar em hardware Android a detecção do locale, o modal de idioma e o share sheet; também faltam branding nativo/release signing e triagem dedicada dos 24 achados do npm audit. `PreferencesStorage` ainda importa Capacitor de dentro de `core/storage`, dívida preexistente de localização física do adapter. O builder Angular `application` foi substituído por `browser` após deadlock do esbuild 0.28.x neste projeto.

## Recommended Next Task

Validar primeiro acesso com locales distintos, troca/persistência no modal, teclado, reinício e compartilhamento em pelo menos um aparelho Android. Tratar branding/release em plano próprio depois desse passe.

## Commands

```bash
nvm use
npm install
npm start
npm run lint
npm run test:ci
npm run build
npm run android:sync
(cd android && ./gradlew testDebugUnitTest assembleDebug)
npm run android:open
```

Node 22.12+ é obrigatório; `.nvmrc` seleciona 22.17.0. `android:open` requer ambiente gráfico e Android Studio. Gradle pode precisar de acesso ao cache do usuário.
