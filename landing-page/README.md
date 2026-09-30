# CV ATS Express — Landing Page

Single-page multilíngue preparada para o Firebase Hosting principal `cv-ats-express`.

## Comportamento de idioma

- Prioriza uma preferência manual válida em `localStorage`.
- Sem preferência, detecta o primeiro locale compatível do navegador/sistema.
- Suporta `pt-BR`, `en-US`, `es-ES` e `es-419`.
- Usa `en-US` como fallback.

## Prévia local

```bash
cd landing-page
firebase emulators:start --only hosting
```

## Deploy

```bash
cd landing-page
firebase deploy --only hosting
```

URL configurada:

```text
https://cv-ats-express.web.app/
```

## Antes de divulgar

Quando a listagem do Google Play estiver pública, substitua a chamada “Em breve no Google Play” por um link direto para a loja em todos os quatro idiomas. Depois do primeiro deploy, valide a URL no Google Rich Results Test e cadastre o domínio no Google Search Console, enviando `/sitemap.xml`.
