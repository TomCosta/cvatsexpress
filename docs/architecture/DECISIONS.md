# Architecture Decisions

## DEC-001 — Offline First

Status: Accepted

Context: currículos contêm dados pessoais e o produto deve funcionar sem conta ou conexão.

Decision: o modo padrão é integralmente local; backend só poderá ampliar recursos opcionais.

Reasons: privacidade, velocidade, menor custo operacional e menor fricção.

Consequences: funcionalidades centrais não podem depender de autenticação, rede ou serviço remoto. Veja ADR-0001.

## DEC-002 — Repository boundary before storage adapter

Status: Accepted

Context: Preferences é adequado ao volume inicial, mas não deve contaminar a UI nem impedir migração.

Decision: features dependerão de `ResumeRepository`; `LocalResumeRepository` será criado no milestone de storage.

Reasons: testabilidade e substituição do mecanismo local sem reescrever componentes.

Consequences: `LocalResumeRepository` implementa o contrato com `KeyValueStorage`, fornecido por `PreferencesStorage`. Veja ADR-0002.

## DEC-003 — Selectable-text PDF

Status: Accepted

Context: screenshots em PDF prejudicam leitura, acessibilidade e ATS.

Decision: usar pdfmake 0.3 para texto real e concentrar mapping em definição pura + adapter de `PdfGeneratorService`.

Reasons: qualidade do documento e interoperabilidade.

Consequences: o chunk de preview é maior; PDF permanece lazy e é escrito apenas em cache privado no Android. Veja ADR-0003.

## DEC-004 — Optional AI backend

Status: Accepted

Context: IA pode melhorar o produto, mas introduz rede, custo e transmissão de conteúdo sensível.

Decision: IA fica desligada por flag e atrás de interface; backend mínimo só depois do MVP offline.

Reasons: preservar o valor principal e impedir exposição de chaves.

Consequences: nenhuma feature offline importa SDK de IA. Veja ADR-0004.

## DEC-005 — Central injected configuration

Status: Accepted

Context: branding, limites e flags não devem ficar espalhados em componentes.

Decision: environments fornecem `AppConfig` via `APP_CONFIG` no bootstrap.

Reasons: tipagem, teste e substituição centralizada.

Consequences: componentes que precisam de configuração injetam o token; valores secretos são proibidos.

## DEC-006 — Runtime localization with separate UI and document languages

Status: Accepted

Context: o documento já suporta quatro idiomas, enquanto menus e formulários permanecem em português.

Decision: usar catálogo tipado em runtime e preferência local inicializada pelo locale do sistema. Idioma global da interface e idioma de cada currículo permanecem independentes.

Reasons: troca imediata dentro do app, uma única distribuição Android, funcionamento offline e preservação da intenção de documentos já salvos.

Consequences: novas strings visíveis precisam de tradução nos quatro idiomas; novos currículos herdam o idioma da interface, sem alterar os existentes. Veja ADR-0005.
