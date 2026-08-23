# 0003 — Runtime Localization

## Goal

Localizar toda a interface do CV ATS Express em `pt-BR`, `en-US`, `es-ES` e `es-419`, iniciando no idioma compatível do sistema no primeiro acesso e permitindo troca persistente pela Home.

## Context

O MVP offline já localiza cabeçalhos do currículo exportado, mas toda a interface permanece em português. O idioma da interface precisa melhorar a usabilidade sem acoplar o fluxo offline a backend ou confundir a preferência do aplicativo com o idioma de conteúdo de cada currículo.

## Current State

No início do plano, a versão 0.2.0 possuía quatro valores em `ResumeLanguage`, cópia parcial do documento e strings da UI distribuídas entre templates, componentes, ATS Score e adapter de PDF. Não havia preferência global de idioma, detecção do sistema ou seletor. O resultado entregue é a versão 0.3.0 descrita em “Final Outcome”.

## Scope

- Catálogo tipado de interface para os quatro idiomas suportados.
- Serviço reativo de idioma, detecção pelo locale do sistema e persistência via `KeyValueStorage`.
- Inicialização antes da primeira renderização, atualização de `lang` e títulos de rota.
- Seletor acessível no header da Home.
- Localização de Home, biblioteca, editor, preview, score ATS e mensagens de exportação/compartilhamento.
- Novos currículos herdando o idioma atual da interface, sem alterar currículos existentes.
- Testes de locale, persistência e renderização crítica.

## Non-Goals

Tradução automática do conteúdo digitado, alteração em massa do idioma de currículos existentes, backend, IA, contas, cloud sync ou dependência de serviço remoto de tradução.

## Architecture

`AppLanguageService` vive em `core/i18n`, expõe sinais somente leitura e usa o boundary `KeyValueStorage`. O bootstrap aguarda sua inicialização. Features consomem cópia tipada do serviço; nenhuma UI acessa Preferences. Idioma da interface e `Resume.language` são conceitos separados. Serviços que produzem texto visível recebem explicitamente o idioma da interface ou do documento, conforme o contexto.

## Files/Areas Affected

Bootstrap, rotas/títulos, `core/i18n`, header, Home, biblioteca, editor, preview, ATS Score, PDF/share, modelo/cópia do documento, testes e documentação durável.

## Milestones

- [x] Definir decisão arquitetural e catálogo tipado
- [x] Implementar detecção, persistência e bootstrap
- [x] Implementar seletor da Home
- [x] Localizar todas as telas e mensagens
- [x] Localizar score e exportação sem misturar idiomas
- [x] Cobrir comportamento com testes
- [x] Executar validações e revisões
- [x] Atualizar memória persistente

## Testing

Testes unitários do mapeamento de locale e serviço persistente; componentes críticos em mais de um idioma; regressão do score/PDF; lint, typecheck, Karma, build, Capacitor sync e Gradle debug.

## Security Considerations

A preferência contém apenas um código de idioma e permanece no storage local. Não haverá rede, telemetria ou envio de conteúdo. Falha de storage deve manter o app utilizável com fallback em memória.

## Risks

Strings residuais em templates, pluralização/interpolação incorreta, título/documento em idioma diferente do desejado, flash no idioma padrão durante bootstrap e regressões de layout com textos maiores.

## Progress

Iniciado em 2026-08-19 após leitura da memória canônica e inspeção dos fluxos existentes. Implementação, revisões e validação concluídas em 2026-08-20.

## Decisions

- `es-ES` é usado somente quando o locale do sistema identifica Espanha; outros locales `es-*` e `es` usam `es-419`.
- Se nenhum locale for compatível, o app usa `APP_CONFIG.defaultLanguage`, atualmente `pt-BR`, coerente com o público inicial.
- A preferência da interface não altera currículos já salvos; novos currículos a herdam como valor inicial do idioma do documento.

## Final Outcome

Concluído na versão 0.3.0. A interface inteira usa catálogo tipado em runtime para `pt-BR`, `en-US`, `es-ES` e `es-419`. O bootstrap resolve preferência persistida válida, depois o primeiro locale compatível do sistema e por último `APP_CONFIG.defaultLanguage`, persistindo o resultado na chave independente `cv-ats-express.app-language.v1`. A Home oferece seletor acessível; a troca atualiza UI, `html[lang]` e títulos de rota sem reload.

Idioma da UI e `Resume.language` permanecem independentes: documentos existentes são preservados e novos currículos herdam a preferência atual. Score e mensagens de exportação seguem a UI; documento e PDF seguem o currículo.

Validação final: lint, `ngc`, 41 testes Karma, build de produção, Capacitor sync com Filesystem/Preferences/Share, `testDebugUnitTest` e `assembleDebug`. Smoke visual confirmou `es-MX → es-419` e ausência de overflow na Home e no editor em 320 px e 360 px. Permanecem pendentes testes manuais em Android real/emulador do locale, modal e share sheet.
