# AI Change Log

## 2026-09-28

### Added

- Criado em `politicaDePrivacidade/public/` um site estático responsivo com a política de privacidade do CV ATS Express em `pt-BR`, `en-US`, `es-ES` e `es-419`.
- Criada em `landing-page/public/` uma landing page responsiva e orientada a conversão para o site principal `cv-ats-express.web.app`, com hero, demonstração visual, recursos, fluxo de uso, privacidade, FAQ e CTA do Google Play.
- A landing page inclui os quatro locales, detecção inicial do sistema com fallback `en-US`, preferência manual persistida, conteúdo SEO semântico, microdados de aplicativo, metadados canônicos/Open Graph/Twitter, `robots.txt`, `sitemap.xml` e web manifest.
- O texto cobre armazenamento local, PDF e compartilhamento explícito, ausência de conta/backend/anúncios/analytics, controles do usuário, hospedagem da página e contato.
- Reutilizado o logotipo existente e aplicada a identidade visual em verde-petróleo, azul e ciano.
- Adicionados `firebase.json` com cabeçalhos de segurança e `README.md` com os passos de prévia e deploy no Firebase Hosting.
- Adicionado seletor no topo; no primeiro acesso a página detecta o primeiro locale compatível do sistema com fallback em `en-US`, e depois prioriza a preferência manual persistida em `localStorage`.
- Corrigidos os caminhos após a migração para a raiz `public`: CSS, JavaScript, favicon e logotipo agora usam URLs absolutas da raiz publicada. O Hosting passou a servir também a rota `/privacy-policy` e a excluir `skills-lock.json` do deploy.
- Associado o `firebase.json` ao novo Hosting site `cv-ats-express-privacy-policy`, com URL esperada `https://cv-ats-express-privacy-policy.web.app/` após o deploy.

### Validation

- JSON do Firebase validado com `jq`, HTML validado com `tidy`, JavaScript validado com `node --check`, caminhos dos recursos verificados e `git diff --check` concluído sem erros.
- O emulador do Firebase confirmou HTTP 200 para `/privacy-policy`, `/styles.css`, `/language.js` e `/assets/cv-ats-express.png`, incluindo os cabeçalhos de segurança configurados.
- Na landing page, o emulador confirmou HTTP 200 para HTML, CSS, JavaScript, logotipo, robots, sitemap e manifest; os quatro catálogos possuem as mesmas 74 chaves, e a hero foi inspecionada em capturas desktop e mobile pelo Chrome headless.
- O deploy não foi executado; ainda falta substituir os marcadores pelo e-mail público de privacidade.

## 2026-08-23

### Changed

- Substituídos os ícones launcher padrão do scaffold pela identidade CV ATS Express nas densidades `mdpi`, `hdpi`, `xhdpi`, `xxhdpi` e `xxxhdpi`.
- Geradas variantes legacy, round, foreground adaptativa e monochrome para ícones temáticos do Android 13+, com margem segura para máscaras diferentes de launcher.
- Adicionado `npm run android:icons`, que recria o conjunto a partir de `assets/cvatsexpress.png` usando apenas o JDK local.
- O editor agora completa identificadores do LinkedIn com `https://www.linkedin.com/in/` e endereços de portfólio sem protocolo com `https://`.
- A normalização ocorre ao sair do campo e também antes do autosave, preserva campos vazios e evita duplicar protocolos em URLs completas.
- Variantes comuns de perfil do LinkedIn são persistidas no formato canônico com HTTPS e `www`.

### Architecture impact

- A geração de branding é uma ferramenta de build isolada e não altera runtime, contratos ou dados do aplicativo.
- Nenhum contrato ou schema de persistência foi alterado. A regra determinística e offline foi isolada em `core/models/profile-url.ts` e consumida pelo editor.

### Validation

- Lint, 64/64 testes Karma, build de produção e `cap sync android` passaram.
- `lintDebug` e `assembleDebug` validaram os PNGs, adaptive icons e recursos Android 13+.

## 2026-08-22

### Changed

- Adicionado `CreateResumeService` para gerar e persistir um currículo antes de navegar ao editor.
- Home e biblioteca deixaram de usar `/resume/new`; a rota foi removida e o editor passou a carregar somente currículos identificados por `/resume/:id/edit`.
- Adicionados estado de criação, bloqueio de cliques repetidos, mensagens separadas para falhas de criar, abrir e ler e proteção por epoch contra navegação tardia depois de sair da tela.
- A Home preserva o ID já criado quando apenas a navegação falha, permitindo tentar abrir novamente sem duplicar o currículo; a biblioteca recarrega e exibe o documento persistido.
- Geração de IDs e clonagem do modelo JSON-safe ganharam fallbacks para WebViews sem `crypto.randomUUID` ou `structuredClone` utilizável.
- Mantidos `schemaVersion: 1`, Preferences e os contratos offline existentes.

### Why

- Corrigir o ciclo que impedia criar o primeiro currículo quando uma API do runtime, persistência ou navegação falhava, preservando uma recuperação clara na tela de origem.

### Architecture impact

- A criação passou a ser um caso de uso em `core/services`; a UI continua dependente de `ResumeRepository` e não acessa storage nativo. A revisão de arquitetura concluiu que a mudança respeita decisões existentes e não requer novo ADR.

### Validation

- Lint, 60/60 testes Karma e build de produção passaram.
- `cap sync android` encontrou Filesystem, Preferences e Share; `testDebugUnitTest` e `assembleDebug` passaram.
- Revisões de arquitetura, produto e QA concluídas sem pendência bloqueadora.

## 2026-08-20

### Changed

- Atualizada a versão para 0.3.0 e localizada toda a interface em runtime para `pt-BR`, `en-US`, `es-ES` e `es-419`.
- Adicionados catálogo tipado, `AppLanguageService`, inicialização antes da primeira renderização, `html[lang]` e títulos de rota reativos.
- Adicionado seletor de idioma no header da Home, com preferência persistida separadamente em `cv-ats-express.app-language.v1`.
- Localizados Home, biblioteca, editor, preview, ATS Score e mensagens de PDF/compartilhamento.
- Mantidos idioma da interface e idioma do currículo como conceitos independentes; novos currículos herdam a UI e documentos existentes preservam sua escolha.

### Why

- Tornar o MVP utilizável nos quatro mercados já suportados pelo documento, sem rede, builds separados ou tradução automática do conteúdo do usuário.

### Architecture impact

- Registrados DEC-006 e ADR-0005. Features consomem `core/i18n`; persistência continua atrás de `KeyValueStorage`.

### Validation

- Lint, `ngc`, 41 testes Karma e build de produção passaram.
- `cap sync android` encontrou Filesystem, Preferences e Share; `testDebugUnitTest` e `assembleDebug` passaram.
- Smoke visual confirmou `es-MX → es-419` e ausência de overflow na Home e no editor em 320 px e 360 px.

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
