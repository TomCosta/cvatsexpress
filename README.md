# CV ATS Express

Aplicativo Android offline-first para criar currículos profissionais e ATS-friendly em poucos minutos. A versão 0.3.0 entrega o MVP funcional e multilíngue sem cadastro, backend ou dependência de internet.

## Estado atual

- Ionic 8 + Angular 20 com componentes standalone
- Capacitor 8, plataforma Android sincronizada e build debug validado
- editor completo com autosave local via Capacitor Preferences
- gestão de currículos: criar, editar, renomear, duplicar e excluir
- interface completa em português do Brasil, inglês dos Estados Unidos, espanhol da Espanha e espanhol da América Latina
- detecção do idioma do sistema no primeiro acesso e seletor persistente na Home
- Classic ATS e Modern ATS com preview nos quatro idiomas suportados
- ATS-Friendly Score heurístico, com achados e disclaimer
- PDF com texto selecionável, download web e compartilhamento Android
- configuração central; IA, billing, anúncios e backend desativados
- documentação durável e agentes de revisão do projeto

## Requisitos

- Node.js 22.12 ou superior; `.nvmrc` usa 22.17.0
- npm 10 ou superior
- Android Studio e Android SDK para executar a versão nativa

## Comandos

```bash
nvm use
npm install
npm start
npm run lint
npm run test:ci
npm run build
npm run android:sync
npm run android:open
```

`android:open` abre uma aplicação gráfica e requer Android Studio instalado.

## Arquitetura

A direção é offline-first com Adapter Pattern e feature flags. Componentes de UI consomem contratos; Preferences e os plugins de arquivo/compartilhamento ficam atrás de boundaries. A localização usa catálogo tipado em runtime; idioma dos menus e idioma de cada currículo são independentes. O backend de IA é futuro e opcional.

Versões instaladas estão fixadas em `package-lock.json`. Consulte [documentação](docs/INDEX.md), [estado real](docs/context/PROJECT_STATE.md) e [arquitetura](docs/architecture/ARCHITECTURE.md).

## Android e publicação

O projeto nativo está em `android/`, com package id `com.cvatsexpress.app`. Não existem keystore, credenciais de assinatura, billing real ou configuração de Play Store. Um release exigirá branding definitivo, política de privacidade publicada, testes em dispositivos, assinatura e configuração no Play Console.
