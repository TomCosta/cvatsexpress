# Known Issues

## KI-001 — Node default is incompatible

The machine's default Node is 18.14.0, while Angular 20 and Capacitor 8 require a newer runtime. Run `nvm use` to select the repository's Node 24.19.0 before npm/ng/cap commands.

## KI-002 — Android splash and release branding incomplete

Launcher icons are branded in all Android densities, including adaptive, round and Android 13+ themed variants. Splash assets still use the generated scaffold artwork, and release signing/Play Store assets are not configured; the native version is synchronized with package version 0.3.0.

## KI-003 — Dependency audit findings not triaged

The package installation reported npm audit findings inherited from the current dependency tree. Do not run `npm audit fix --force`; review reachability, fixes and framework compatibility in a dedicated dependency task.

## KI-004 — Android test is only scaffold coverage

`testDebugUnitTest` passes, but the only native unit test is Capacitor's generated arithmetic smoke test. It does not exercise application or Android integration behavior; add meaningful native coverage when such behavior is introduced.

## KI-005 — Android device validation pending

Web smoke inspection, Capacitor sync and APK debug build pass, but system-locale detection, the language modal, keyboard behavior, process restart, file opening and the native share sheet still require a real-device or emulator pass.

## KI-006 — Angular application builder deadlock

The `application` builder reproducibly aborted inside esbuild 0.28.x with `all goroutines are asleep - deadlock`, including after cache cleanup and a patch override. The supported `browser`/Webpack builder completes production builds. Re-evaluate after a compatible Angular build-tool update.

## KI-007 — Preferences adapter is physically inside core

`PreferencesStorage` implements the correct `KeyValueStorage` boundary, so features do not access Capacitor directly. Its file currently lives in `core/storage` and imports `@capacitor/preferences`, which is inconsistent with the intended physical boundary that keeps native adapters under `infrastructure`. Move it in a focused refactor; no behavior is currently blocked.

## Resolved during foundation

Android Gradle access initially failed inside the sandbox. After approved native access and the final Capacitor sync, `testDebugUnitTest` and `assembleDebug` completed successfully. This is not a current application issue.

## Resolved in reliable resume creation

O primeiro currículo podia cair no erro genérico de abertura e devolver o usuário à biblioteca vazia, repetindo o fluxo sem diagnóstico útil. Em 2026-08-22, a criação foi movida para um caso de uso que persiste antes da navegação; Home e biblioteca agora exibem falhas recuperáveis e não usam mais `/resume/new`. Esta não é uma limitação atual.
