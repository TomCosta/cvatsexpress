# ADR 0005 — Runtime Localization

Status: Accepted — 2026-08-19

## Context

O documento exportado já suporta quatro idiomas, mas a interface compilada permanece em português. O app precisa iniciar no idioma compatível do sistema, permitir troca imediata e continuar totalmente offline. Compilações separadas por locale aumentariam distribuição e não resolveriam a troca dentro do app.

## Decision

Usar catálogo tipado em runtime para `pt-BR`, `en-US`, `es-ES` e `es-419`. `AppLanguageService` persiste apenas o código selecionado via `KeyValueStorage`, na chave independente `cv-ats-express.app-language.v1`, e atualiza reativamente a interface, o atributo `html[lang]` e títulos de rota. O bootstrap aguarda a leitura inicial para evitar renderização no idioma errado.

A resolução inicial prioriza uma preferência persistida válida, depois o primeiro locale compatível em `navigator.languages` e por último `APP_CONFIG.defaultLanguage`. Falha de leitura ou escrita não bloqueia o app; o idioma resolvido continua em memória durante a sessão.

Idioma da interface e `Resume.language` são independentes. Currículos existentes mantêm seu idioma; novos currículos herdam o idioma atual da interface como valor inicial. Textos de documento usam `Resume.language`; mensagens de navegação, ATS e compartilhamento usam o idioma global.

## Consequences

A troca não requer reload, rede ou builds separados. Features dependem somente de `core/i18n` e não acessam Preferences. Toda string visível nova deve entrar no catálogo completo dos quatro idiomas. O catálogo cresce no bundle inicial, mas o volume é pequeno e previsível. Tradução do conteúdo digitado continua fora de escopo.
