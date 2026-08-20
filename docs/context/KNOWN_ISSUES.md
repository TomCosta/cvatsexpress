# Known Issues

## KI-001 — Node default is incompatible

The machine's default Node is 18.14.0, while Angular 20 and Capacitor 8 require a newer runtime. Run `nvm use` to select the repository's Node 22.17.0 before npm/ng/cap commands.

## KI-002 — Generated Android branding

Icons, splash assets, displayed native version and release configuration are scaffold defaults. Final branding and Play Store release setup are future work.

## KI-003 — Dependency audit findings not triaged

The package installation reported npm audit findings inherited from the current dependency tree. Do not run `npm audit fix --force`; review reachability, fixes and framework compatibility in a dedicated dependency task.

## KI-004 — Android test is only scaffold coverage

`testDebugUnitTest` passes, but the only native unit test is Capacitor's generated arithmetic smoke test. It does not exercise application or Android integration behavior; add meaningful native coverage when such behavior is introduced.

## KI-005 — Android device validation pending

Web smoke inspection, Capacitor sync and APK debug build pass, but keyboard behavior, process restart, file opening and the native share sheet still require a real-device or emulator pass.

## KI-006 — Angular application builder deadlock

The `application` builder reproducibly aborted inside esbuild 0.28.x with `all goroutines are asleep - deadlock`, including after cache cleanup and a patch override. The supported `browser`/Webpack builder completes production builds. Re-evaluate after a compatible Angular build-tool update.

## Resolved during foundation

Android Gradle access initially failed inside the sandbox. After approved native access and the final Capacitor sync, `testDebugUnitTest` and `assembleDebug` completed successfully. This is not a current application issue.
