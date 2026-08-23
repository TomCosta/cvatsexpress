# Product Copy

## Idiomas implementados

A interface usa catálogo tipado em runtime para:

- `pt-BR` — Português (Brasil)
- `en-US` — English (United States)
- `es-ES` — Español (España)
- `es-419` — Español (Latinoamérica)

Toda string nova visível deve ser incluída nos quatro catálogos. As variantes espanholas podem compartilhar termos, mas diferenças de vocabulário como “Añadir” e “Agregar” devem ser preservadas quando relevantes. Interpolações usam placeholders nomeados, por exemplo `{date}`, `{title}` e `{score}`.

## Fonte da cópia

Textos da interface, score e ações de compartilhamento ficam em `src/app/core/i18n/app-translations.ts`. Cabeçalhos do currículo e do PDF seguem `Resume.language`; menus e mensagens seguem `AppLanguageService`. Não duplicar strings visíveis diretamente nos templates quando houver chave de catálogo.

## Mensagens centrais em pt-BR

- Proposta de valor: “Crie um currículo profissional e ATS-friendly em poucos minutos.”
- Ação primária: “Criar meu currículo”
- Ação secundária: “Meus currículos”
- Estado de salvamento: “Salvo neste dispositivo”
- Nome do score: “ATS-Friendly Score”
- Disclaimer: “Esta análise é baseada em boas práticas e regras heurísticas. Sistemas de recrutamento podem utilizar critérios diferentes.”

## Regras de linguagem

Nunca dizer que o currículo tem aprovação, passagem ou ranking garantido em ATS. Usar orientação direta e encorajadora. Distinguir claramente ATS-Friendly Score de um futuro Job Match Score. Alertar antes de qualquer processamento remoto opcional futuro.

O seletor apresenta o nome nativo de cada idioma. A ajuda do editor deve deixar explícito que “Idioma do currículo” controla o documento/PDF e não os menus do aplicativo.
