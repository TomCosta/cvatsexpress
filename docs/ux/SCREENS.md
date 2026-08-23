# Screens

## Fluxo implementado

Home → criar currículo/editor → dados pessoais → objetivo/resumo → experiências → formação → competências → idiomas/cursos → preview/template → ATS-Friendly Score → PDF/download/share.

“Meus currículos” lista documentos locais e permite editar, visualizar, duplicar, renomear e excluir com confirmação.

## Home

Apresenta marca, proposta de valor, ações “Criar meu currículo” e “Meus currículos” e três pontos de confiança. O header inclui botão de idioma com código curto atual. O botão abre modal de escolha única com nomes nativos, cancelar e selecionar; a troca atualiza a UI sem reload e é persistida quando o storage está disponível.

## Biblioteca

Exibe estados de carregamento, vazio e erro, cards dos currículos e ações CRUD. Datas, sufixo de duplicação, diálogos e mensagens seguem o idioma atual da interface.

## Editor

Formulário completo com validações, seções repetíveis, reordenação, autosave e acesso ao preview. “Idioma do currículo” é um campo separado do idioma do app e controla os títulos do documento/PDF. Um currículo novo herda a interface atual; um currículo existente preserva seu valor.

## Preview

Permite escolher Classic ATS ou Modern ATS, inspecionar o documento, ver score e achados localizados e baixar/compartilhar PDF. O conteúdo estrutural do documento segue `Resume.language`; controles, score e status de exportação seguem o idioma global.

## Princípios de interação

Alvos de toque grandes, rótulos explícitos, foco previsível, estados vazios significativos, poucos níveis de navegação e nenhum onboarding obrigatório. Erros e status não dependem apenas de cor. Experiência e formação continuam opcionais para quem busca o primeiro emprego.

O smoke web em 320 px e 360 px não encontrou overflow na Home ou no editor. O modal nativo/Ionic e a detecção real de locale ainda precisam de validação manual em Android.
