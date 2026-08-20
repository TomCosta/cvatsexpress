# Requirements

## Princípios

- Funcionar offline por padrão e sem cadastro.
- Manter os currículos no dispositivo no modo offline.
- Priorizar fluxo mobile rápido, acessível e com poucos cliques.
- Nunca prometer aprovação por sistemas ATS.
- Manter serviços nativos, cobrança e IA atrás de contratos.

## Requisitos do MVP

1. Criar, editar, renomear, duplicar e excluir currículos locais.
2. Editar dados pessoais, cargo, resumo, experiências, formação, competências, idiomas e cursos.
3. Validar nome obrigatório, email e URLs preenchidas sem bloquear casos legítimos.
4. Salvar automaticamente com debounce e feedback discreto.
5. Escolher Classic ATS ou Modern ATS e visualizar o resultado.
6. Calcular ATS-Friendly Score heurístico entre 0 e 100, com achados e disclaimer.
7. Gerar PDF profissional com texto selecionável e compartilhá-lo quando suportado.
8. Tratar estados vazios, falhas locais e ausência de conexão sem tela quebrada.

## Critérios de aceite do MVP offline

- Fluxo completo entre Home, editor, biblioteca local e preview.
- CRUD e duplicação persistidos via `ResumeRepository`, com schema versionado.
- Autosave com debounce, flush na saída e feedback de estado.
- Templates Classic ATS e Modern ATS em uma coluna.
- Score entre 0 e 100 separado da UI, com testes e disclaimer.
- PDF textual no browser e em cache privado para compartilhamento Android.
- Auto Backup Android desligado e nenhum envio automático de currículo.
- Lint, testes web, build, sync e build/teste Android executados com Node compatível.

## Não implementado no MVP

Monetização, anúncios, templates premium, login, cloud sync, analytics, backend, IA e match de vaga.
