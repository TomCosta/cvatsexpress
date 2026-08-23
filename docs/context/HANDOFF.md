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

Milestones 0–8 estão implementados. A versão 0.3.0 inclui localização completa da interface em runtime para `pt-BR`, `en-US`, `es-ES` e `es-419`, editor, autosave/CRUD local, dois templates, preview, score heurístico, PDF/download/share e Android. O fluxo de criação do primeiro currículo foi estabilizado sem alterar o schema local.

Em 2026-08-23, os campos LinkedIn e portfólio passaram a normalizar entradas simplificadas: identificadores recebem `https://www.linkedin.com/in/` e domínios de portfólio recebem `https://`. A regra também roda antes da persistência e não altera campos vazios nem duplica URLs completas.

## Last Significant Change

Em 2026-08-22, `CreateResumeService` passou a criar e persistir o currículo antes da navegação. Home e biblioteca acionam esse caso de uso diretamente, bloqueiam cliques repetidos, distinguem falha de criação, abertura e leitura e evitam redirecionamento tardio depois que a tela perde atividade. Se a navegação falhar na Home, a tentativa seguinte abre o mesmo currículo já salvo. A rota `/resume/new` foi removida e o editor carrega somente `/resume/:id/edit`. IDs e clonagem possuem fallbacks para WebViews sem APIs modernas ou com implementações defeituosas.

## Current Problems

Nenhum bloqueio conhecido. O bug que prendia o primeiro currículo entre editor e biblioteca está resolvido. Faltam validar em hardware Android a detecção do locale, o modal de idioma e o share sheet; também faltam branding nativo/release signing e triagem dedicada dos 24 achados do npm audit. `PreferencesStorage` ainda importa Capacitor de dentro de `core/storage`, dívida preexistente de localização física do adapter. O builder Angular `application` foi substituído por `browser` após deadlock do esbuild 0.28.x neste projeto.

## Recommended Next Task

Validar primeiro acesso com locales distintos, troca/persistência no modal, teclado, reinício e compartilhamento em pelo menos um aparelho Android. Tratar branding/release em plano próprio depois desse passe.

## Last Validation

Em 2026-08-23 passaram lint, 64/64 testes Karma, build de produção e Capacitor sync com Filesystem/Preferences/Share. `testDebugUnitTest` e `assembleDebug` passaram por último em 2026-08-22. Revisões de arquitetura, produto e QA foram concluídas sem pendência bloqueadora nessa entrega maior.

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

Node 24.19+ é obrigatório; `.nvmrc` seleciona 24.19.0. `android:open` requer ambiente gráfico e Android Studio. Gradle pode precisar de acesso ao cache do usuário.
