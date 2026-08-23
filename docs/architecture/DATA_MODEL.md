# Data Model

O modelo canônico está em `src/app/core/models/resume.model.ts`.

## Resume

Um currículo possui id, título, idioma, dados pessoais, cargo desejado e resumo opcionais, listas de experiências/formações/skills/idiomas/cursos, template e timestamps ISO 8601.

- Idiomas aceitos pelo modelo: `pt-BR`, `en-US`, `es-ES`, `es-419`.
- O factory exige o idioma recebido da configuração/camada chamadora.
- Template padrão: `classic-ats`.
- Nome começa vazio e será obrigatório no formulário, não no tipo de domínio.
- Experiência e formação são listas opcionais em conteúdo para suportar primeiro emprego.
- Datas são strings para preservar entrada de mês/ano sem conversão prematura de timezone.

Entidades repetíveis (`Experience`, `Education`, `Skill`, `LanguageSkill`, `Course`) possuem id próprio para edição e reordenação estáveis.

`Resume.language` é o idioma do documento, não da interface. Alterar a preferência global do app não migra currículos existentes. O factory recebe o idioma da camada chamadora; na criação pela UI, esse valor inicial é o idioma atual do aplicativo.

## Storage envelope

`LocalDatabase` contém `schemaVersion` e `resumes`. `CURRENT_SCHEMA_VERSION` é 1. `LocalResumeRepository` serializa o envelope em Preferences, serializa mutações concorrentes e rejeita versões sem migração explícita ou registros estruturalmente inválidos. Testes cobrem save, retrieve, update, duplicate, delete, concorrência e schema.

O banco de currículos usa a chave `cv-ats-express.database`.

## Preferência do aplicativo

O idioma global da interface não faz parte de `LocalDatabase` e não altera seu schema. `AppLanguageService` armazena somente um dos quatro códigos suportados na chave independente `cv-ats-express.app-language.v1`. A resolução inicial prioriza valor persistido válido, depois o primeiro locale compatível do sistema e, por último, `APP_CONFIG.defaultLanguage`. Um valor ausente ou inválido é substituído pela resolução atual; falha de storage mantém a sessão funcional em memória.

## Regras de evolução

Mudanças incompatíveis exigem incremento de schema, migração testada, atualização deste documento e decisão arquitetônica quando significativas. Nunca interpretar dados ausentes de versões antigas sem estratégia explícita.
