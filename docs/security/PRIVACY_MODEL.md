# Privacy and Security Model

## Current phase

The application persists resume data locally through Preferences. It has no backend, account, analytics, ads or AI, and does not transmit resume content automatically. An explicit Share action hands a generated PDF to the app selected by the user. UI copy must not imply cloud backup.

## Offline MVP

- Store resumes locally behind `ResumeRepository`.
- Collect only fields needed for the document.
- Do not log email, phone, full resumes or generated documents.
- Do not require account, network or remote analytics.
- Keep native plugins behind application services and handle file/share failures.
- Keep Android Auto Backup disabled for resume data and expose only explicit cache paths through FileProvider.

## Optional AI future

Before transmitting content, explain remote processing and require an explicit user action. API keys stay in server-side secrets, never environments bundled in Angular, assets, manifests or Capacitor config. Backend validates action/payload/size, applies timeout, returns structured errors, avoids content logs and stores no resume.

## Secrets and release

No secrets, signing keys or production credentials belong in Git. `.env` and Android `local.properties` are ignored. Real billing, ads or backend integration requires a separate threat/privacy review and updated documentation.
