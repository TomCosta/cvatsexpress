# Política de Privacidade — publicação

Este diretório contém um site estático independente, preparado para Firebase Hosting.

## Antes de publicar

1. Em `index.html` e `language.js`, substitua os marcadores de e-mail (`REPLACE`, `SUBSTITUIR`, `SUSTITUIR` e `REEMPLAZAR`) pelo mesmo e-mail público informado na Google Play Console.
2. Leia e valide o texto jurídico para sua jurisdição. O conteúdo reflete a versão atual do código: offline-first, sem conta, backend, anúncios, analytics ou IA remota.
3. Confirme que futuras versões do app continuam coerentes com esta política antes de cada release.

## Publicar no Firebase Hosting

Instale a Firebase CLI, caso ainda não esteja disponível:

```bash
npm install --global firebase-tools
```

Entre neste diretório e autentique:

```bash
cd politicaDePrivacidade
firebase login
```

Associe o diretório a um projeto Firebase já criado:

```bash
firebase use --add
```

Escolha o projeto correto e use `default` como alias. Esse comando criará `.firebaserc` localmente.

Faça uma prévia local:

```bash
firebase emulators:start --only hosting
```

Publique:

```bash
firebase deploy --only hosting
```

Após o deploy, copie a URL HTTPS exibida pela CLI e informe-a em **Google Play Console → Política e programas → Conteúdo do app → Política de Privacidade**.

A configuração está vinculada ao site Firebase `cv-ats-express-privacy-policy` e publica a política tanto na raiz quanto na rota:

```text
https://cv-ats-express-privacy-policy.web.app/
https://cv-ats-express-privacy-policy.web.app/privacy-policy
```

O domínio alternativo fornecido pelo Firebase segue o mesmo identificador:

```text
https://cv-ats-express-privacy-policy.firebaseapp.com/
```

## Conteúdo publicado

- `index.html`: estrutura single page e conteúdo padrão em inglês.
- `language.js`: detecção, preferência persistida e textos completos em `pt-BR`, `en-US`, `es-ES` e `es-419`.
- `styles.css`: identidade visual responsiva e imprimível.
- `assets/cv-ats-express.png`: logotipo do aplicativo.
- `firebase.json`: configuração de Hosting e cabeçalhos de segurança.

Não execute `firebase init hosting` dentro deste diretório sem revisar as opções, pois ele pode substituir a configuração existente.
