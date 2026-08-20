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

Milestones 0–8 estão implementados. Há editor, autosave/CRUD local, dois templates, preview, score heurístico, PDF/download/share, Android e documentação durável.

## Last Significant Change

Em 2026-08-17 o escopo avançou da fundação ao MVP offline. Preferences, Filesystem e Share foram integrados atrás de boundaries; pdfmake gera texto selecionável; saves concorrentes são serializados; seções vazias não afetam score/documento.

## Current Problems

Nenhum bloqueio conhecido. Faltam teste manual em hardware Android, branding nativo/release signing e triagem dedicada dos 24 achados do npm audit. O builder Angular `application` foi substituído por `browser` após deadlock do esbuild 0.28.x neste projeto.

## Recommended Next Task

Validar teclado, persistência após reinício e compartilhamento em pelo menos um aparelho Android. Tratar branding/release em plano próprio ou iniciar arquitetura opcional de IA somente com consentimento e backend.

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
