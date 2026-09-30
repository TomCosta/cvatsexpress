(() => {
  'use strict';

  const STORAGE_KEY = 'cv-ats-express.privacy-language.v1';
  const SUPPORTED_LANGUAGES = ['pt-BR', 'en-US', 'es-ES', 'es-419'];
  const FALLBACK_LANGUAGE = 'en-US';

  const policyCard = document.querySelector('#policy-card');
  const englishPolicy = policyCard.innerHTML;

  const translations = {
    'en-US': {
      title: 'Privacy Policy',
      documentTitle: 'Privacy Policy | CV ATS Express',
      description: 'Privacy Policy for the CV ATS Express application.',
      logoAlt: 'CV ATS Express logo',
      languageLabel: 'Language',
      skip: 'Skip to content',
      summary: 'Your resumes stay on your device. The app works without an account and does not automatically send your personal data to us.',
      updated: 'Last updated: September 28, 2026',
      overviewTitle: 'Privacy at a glance',
      overview: ['No registration or account', 'Resumes stored locally', 'No ads or analytics', 'Sharing only when you request it'],
      backToTop: 'Back to top',
      policy: englishPolicy,
    },
    'pt-BR': {
      title: 'Política de Privacidade',
      documentTitle: 'Política de Privacidade | CV ATS Express',
      description: 'Política de Privacidade do aplicativo CV ATS Express.',
      logoAlt: 'Logotipo do CV ATS Express',
      languageLabel: 'Idioma',
      skip: 'Ir para o conteúdo',
      summary: 'Seus currículos permanecem no seu dispositivo. O aplicativo funciona sem conta e não envia automaticamente seus dados pessoais para nós.',
      updated: 'Última atualização: 28 de setembro de 2026',
      overviewTitle: 'Privacidade em resumo',
      overview: ['Sem cadastro ou conta', 'Currículos armazenados localmente', 'Sem anúncios ou analytics', 'Compartilhamento somente quando você solicitar'],
      backToTop: 'Voltar ao início',
      policy: `
        <section><h2>1. Sobre esta política</h2><p>Esta Política de Privacidade descreve como o <strong>CV ATS Express</strong> trata informações quando você cria, edita, visualiza, exporta ou compartilha currículos. Ela se aplica à versão atual do aplicativo Android, identificada pelo pacote <code>com.cvatsexpress.app</code>, e a esta página informativa.</p><p>O CV ATS Express foi projetado como um aplicativo offline-first. Na versão atual, não há conta de usuário, autenticação, sincronização em nuvem, publicidade, ferramentas de análise comportamental ou recursos de inteligência artificial conectados a servidores.</p></section>
        <section><h2>2. Informações inseridas por você</h2><p>Para montar um currículo, você pode inserir informações como nome, dados de contato, localização, links profissionais, objetivo, resumo, experiências, formação, competências, idiomas e cursos.</p><p>Essas informações são fornecidas voluntariamente e utilizadas apenas para criar, editar, exibir e gerar seus currículos no próprio dispositivo. O CV ATS Express não transmite automaticamente o conteúdo dos currículos ao desenvolvedor nem a um servidor remoto.</p></section>
        <section><h2>3. Armazenamento local</h2><p>Os currículos e a preferência de idioma da interface são armazenados localmente no dispositivo por meio dos recursos de armazenamento do aplicativo. O backup automático do Android está desativado para os dados do app.</p><p>Os dados permanecem no dispositivo até que você exclua um currículo, limpe os dados do aplicativo ou desinstale o CV ATS Express. Como não mantemos uma cópia remota, não podemos recuperar currículos apagados, perdidos ou armazenados em um dispositivo que deixou de funcionar.</p></section>
        <section><h2>4. PDFs e compartilhamento</h2><p>Quando você solicita a exportação, o PDF é gerado localmente. No Android, um arquivo temporário pode ser gravado na área privada de cache do aplicativo para possibilitar o compartilhamento. Quando o compartilhamento não está disponível, você pode optar por salvar o documento no dispositivo.</p><p>O compartilhamento ocorre somente após uma ação explícita sua. Ao escolher outro aplicativo — como e-mail, mensageiro ou serviço de armazenamento — o tratamento posterior do PDF passa a depender do serviço escolhido e de sua respectiva política de privacidade. Revise o destinatário antes de enviar um documento com dados pessoais.</p></section>
        <section><h2>5. Coleta, venda e compartilhamento de dados</h2><p>Na versão atual do CV ATS Express:</p><ul><li>não coletamos o conteúdo dos seus currículos;</li><li>não vendemos dados pessoais;</li><li>não usamos dados para publicidade;</li><li>não utilizamos SDKs de analytics ou rastreamento;</li><li>não criamos perfis de comportamento;</li><li>não exigimos cadastro ou login.</li></ul><p>Uma ação de compartilhamento iniciada por você não significa que o CV ATS Express esteja coletando o documento; ela apenas entrega o arquivo ao aplicativo ou destino que você selecionar.</p></section>
        <section><h2>6. Recursos do dispositivo</h2><p>O aplicativo utiliza recursos locais necessários ao seu funcionamento, incluindo armazenamento das preferências, criação de arquivos e a interface de compartilhamento do Android. Esses recursos são usados para executar as ações solicitadas por você e não para criar uma base remota de dados pessoais.</p></section>
        <section><h2>7. Esta página e o Firebase Hosting</h2><p>Esta Política de Privacidade é hospedada no Firebase Hosting, serviço fornecido pelo Google. Ao acessar a página, dados técnicos necessários para entregar e proteger o conteúdo — como endereço IP, informações do navegador, data e horário da solicitação — podem ser processados pelo provedor de hospedagem.</p><p>Esta página não instala ferramentas de analytics, pixels publicitários ou cookies próprios de rastreamento. Ela armazena somente o idioma escolhido manualmente no armazenamento local do navegador, para utilizar o mesmo idioma em sua próxima visita.</p><p>Consulte a <a href="https://policies.google.com/privacy" rel="noopener noreferrer">Política de Privacidade do Google</a> para saber mais sobre o tratamento realizado pelo provedor.</p></section>
        <section><h2>8. Segurança</h2><p>Adotamos uma arquitetura local e evitamos transmissões desnecessárias para reduzir a exposição de dados. Ainda assim, nenhum dispositivo ou sistema é completamente imune a riscos. Recomendamos manter o Android atualizado, usar bloqueio de tela e proteger os PDFs exportados ou compartilhados.</p></section>
        <section><h2>9. Seus controles e direitos</h2><p>Como os currículos permanecem no seu dispositivo, você controla seus dados diretamente no aplicativo: pode editar ou excluir currículos e pode remover todos os dados limpando o armazenamento do app ou desinstalando-o.</p><p>Como não recebemos uma cópia dos currículos, normalmente não temos acesso a dados para consultar, corrigir, exportar ou excluir em seu nome. Se você tiver dúvidas sobre privacidade ou quiser exercer algum direito aplicável relacionado a informações que eventualmente tenha fornecido diretamente ao desenvolvedor em uma comunicação de suporte, entre em contato pelo endereço indicado ao final desta política.</p></section>
        <section><h2>10. Crianças e adolescentes</h2><p>O CV ATS Express é uma ferramenta geral para elaboração de currículos e não é direcionado especificamente a crianças. Menores de idade devem utilizar o aplicativo com a orientação de seus responsáveis e evitar inserir ou compartilhar dados pessoais desnecessários.</p></section>
        <section><h2>11. Alterações desta política</h2><p>Esta política poderá ser atualizada para refletir mudanças no aplicativo, na legislação ou nos serviços utilizados. A versão vigente estará disponível nesta página, acompanhada da data da última atualização. Mudanças relevantes no tratamento de dados serão comunicadas de forma apropriada antes de entrarem em vigor, quando exigido.</p></section>
        <section class="contact-card"><h2>12. Contato</h2><p>Para perguntas, solicitações ou dúvidas relacionadas à privacidade do CV ATS Express, entre em contato:</p><p class="contact-placeholder"><strong>E-mail:</strong> <span>viva@tomsys.page</span></p></section>`,
    },
    'es-ES': {
      title: 'Política de privacidad',
      documentTitle: 'Política de privacidad | CV ATS Express',
      description: 'Política de privacidad de la aplicación CV ATS Express.',
      logoAlt: 'Logotipo de CV ATS Express',
      languageLabel: 'Idioma',
      skip: 'Ir al contenido',
      summary: 'Tus currículums permanecen en tu dispositivo. La aplicación funciona sin una cuenta y no nos envía automáticamente tus datos personales.',
      updated: 'Última actualización: 28 de septiembre de 2026',
      overviewTitle: 'Privacidad de un vistazo',
      overview: ['Sin registro ni cuenta', 'Currículums almacenados localmente', 'Sin anuncios ni analítica', 'Solo se comparte cuando tú lo solicitas'],
      backToTop: 'Volver al principio',
      policy: `
        <section><h2>1. Acerca de esta política</h2><p>Esta Política de privacidad explica cómo <strong>CV ATS Express</strong> trata la información cuando creas, editas, previsualizas, exportas o compartes currículums. Se aplica a la versión actual de la aplicación Android, identificada por el paquete <code>com.cvatsexpress.app</code>, y a esta página informativa.</p><p>CV ATS Express se ha diseñado como una aplicación offline-first. La versión actual no tiene cuentas de usuario, autenticación, sincronización en la nube, publicidad, analítica de comportamiento ni funciones de inteligencia artificial conectadas a servidores remotos.</p></section>
        <section><h2>2. Información que introduces</h2><p>Para crear un currículum, puedes introducir información como tu nombre, datos de contacto, ubicación, enlaces profesionales, objetivo, perfil, experiencia, formación, competencias, idiomas y cursos.</p><p>Proporcionas esta información voluntariamente. Se utiliza únicamente para crear, editar, mostrar y generar tus currículums en tu dispositivo. CV ATS Express no transmite automáticamente el contenido de los currículums al desarrollador ni a un servidor remoto.</p></section>
        <section><h2>3. Almacenamiento local</h2><p>Tus currículums y la preferencia de idioma de la interfaz se almacenan localmente en tu dispositivo mediante las funciones de almacenamiento de la aplicación. La copia de seguridad automática de Android está desactivada para los datos de la app.</p><p>Los datos permanecen en el dispositivo hasta que elimines un currículum, borres los datos de la aplicación o desinstales CV ATS Express. Como no conservamos una copia remota, no podemos recuperar currículums eliminados, perdidos o guardados en un dispositivo que ya no esté disponible.</p></section>
        <section><h2>4. PDF y uso compartido</h2><p>Cuando solicitas una exportación, el PDF se genera localmente. En Android, puede guardarse un archivo temporal en la caché privada de la aplicación para permitir que se comparta. Si la función de compartir no está disponible, puedes guardar el documento en tu dispositivo.</p><p>Solo se comparte después de una acción explícita tuya. Cuando eliges otra aplicación —como correo electrónico, mensajería o almacenamiento en la nube— el tratamiento posterior del PDF depende de ese servicio y de su política de privacidad. Comprueba el destinatario antes de enviar un documento que contenga datos personales.</p></section>
        <section><h2>5. Recogida, venta y comunicación de datos</h2><p>En la versión actual de CV ATS Express:</p><ul><li>no recogemos el contenido de tus currículums;</li><li>no vendemos datos personales;</li><li>no utilizamos datos para publicidad;</li><li>no utilizamos SDK de analítica o seguimiento;</li><li>no elaboramos perfiles de comportamiento;</li><li>no exigimos registro ni inicio de sesión.</li></ul><p>Una acción para compartir iniciada por ti no significa que CV ATS Express recoja el documento; únicamente entrega el archivo a la aplicación o destino que selecciones.</p></section>
        <section><h2>6. Funciones del dispositivo</h2><p>La aplicación utiliza funciones locales necesarias para operar, incluido el almacenamiento de preferencias, la creación de archivos y la interfaz para compartir de Android. Estas funciones se utilizan para realizar las acciones que solicitas, no para crear una base remota de datos personales.</p></section>
        <section><h2>7. Esta página y Firebase Hosting</h2><p>Esta Política de privacidad está alojada en Firebase Hosting, un servicio proporcionado por Google. Al acceder a la página, el proveedor de alojamiento puede tratar datos técnicos necesarios para entregar y proteger el contenido, como la dirección IP, información del navegador y la fecha y hora de la solicitud.</p><p>Esta página no instala herramientas de analítica, píxeles publicitarios ni cookies propias de seguimiento. Solo guarda el idioma que eliges manualmente en el almacenamiento local del navegador para utilizar el mismo idioma en tu próxima visita.</p><p>Consulta la <a href="https://policies.google.com/privacy" rel="noopener noreferrer">Política de privacidad de Google</a> para obtener más información sobre el tratamiento realizado por el proveedor.</p></section>
        <section><h2>8. Seguridad</h2><p>Utilizamos una arquitectura local y evitamos transmisiones innecesarias para reducir la exposición de datos. Aun así, ningún dispositivo o sistema es completamente inmune a los riesgos. Recomendamos mantener Android actualizado, utilizar un bloqueo de pantalla y proteger los PDF exportados o compartidos.</p></section>
        <section><h2>9. Tus controles y derechos</h2><p>Como los currículums permanecen en tu dispositivo, controlas tus datos directamente en la aplicación: puedes editar o eliminar currículums y borrar todos los datos eliminando el almacenamiento de la app o desinstalándola.</p><p>Como no recibimos una copia de tus currículums, normalmente no disponemos de datos que podamos consultar, rectificar, exportar o eliminar en tu nombre. Si tienes dudas sobre privacidad o deseas ejercer un derecho aplicable respecto a información que hayas facilitado directamente al desarrollador en una comunicación de soporte, utiliza el contacto indicado al final de esta política.</p></section>
        <section><h2>10. Niños y adolescentes</h2><p>CV ATS Express es una herramienta general para elaborar currículums y no está dirigida específicamente a niños. Los menores deben utilizar la aplicación con la orientación de su padre, madre o tutor y evitar introducir o compartir datos personales innecesarios.</p></section>
        <section><h2>11. Cambios en esta política</h2><p>Podemos actualizar esta política para reflejar cambios en la aplicación, en la legislación aplicable o en los servicios utilizados. La versión vigente estará disponible en esta página junto con la fecha de la última actualización. Los cambios relevantes en el tratamiento de datos se comunicarán adecuadamente antes de que entren en vigor cuando sea obligatorio.</p></section>
        <section class="contact-card"><h2>12. Contacto</h2><p>Para preguntas, solicitudes o dudas sobre la privacidad en CV ATS Express, contacta con:</p><p class="contact-placeholder"><strong>Correo electrónico:</strong> <span>viva@tomsys.page</span></p></section>`,
    },
    'es-419': {
      title: 'Política de privacidad',
      documentTitle: 'Política de privacidad | CV ATS Express',
      description: 'Política de privacidad de la aplicación CV ATS Express.',
      logoAlt: 'Logotipo de CV ATS Express',
      languageLabel: 'Idioma',
      skip: 'Ir al contenido',
      summary: 'Tus currículums permanecen en tu dispositivo. La aplicación funciona sin una cuenta y no nos envía automáticamente tus datos personales.',
      updated: 'Última actualización: 28 de septiembre de 2026',
      overviewTitle: 'Privacidad en resumen',
      overview: ['Sin registro ni cuenta', 'Currículums guardados localmente', 'Sin anuncios ni analítica', 'Solo se comparte cuando tú lo solicitas'],
      backToTop: 'Volver al inicio',
      policy: `
        <section><h2>1. Acerca de esta política</h2><p>Esta Política de privacidad explica cómo <strong>CV ATS Express</strong> trata la información cuando creas, editas, previsualizas, exportas o compartes currículums. Se aplica a la versión actual de la aplicación Android, identificada por el paquete <code>com.cvatsexpress.app</code>, y a esta página informativa.</p><p>CV ATS Express fue diseñada como una aplicación offline-first. La versión actual no tiene cuentas de usuario, autenticación, sincronización en la nube, publicidad, analítica de comportamiento ni funciones de inteligencia artificial conectadas a servidores remotos.</p></section>
        <section><h2>2. Información que ingresas</h2><p>Para crear un currículum, puedes ingresar información como tu nombre, datos de contacto, ubicación, enlaces profesionales, objetivo, perfil, experiencia, educación, habilidades, idiomas y cursos.</p><p>Proporcionas esta información voluntariamente. Se utiliza únicamente para crear, editar, mostrar y generar tus currículums en tu dispositivo. CV ATS Express no transmite automáticamente el contenido de los currículums al desarrollador ni a un servidor remoto.</p></section>
        <section><h2>3. Almacenamiento local</h2><p>Tus currículums y la preferencia de idioma de la interfaz se guardan localmente en tu dispositivo mediante las funciones de almacenamiento de la aplicación. La copia de seguridad automática de Android está desactivada para los datos de la app.</p><p>Los datos permanecen en el dispositivo hasta que elimines un currículum, borres los datos de la aplicación o desinstales CV ATS Express. Como no conservamos una copia remota, no podemos recuperar currículums eliminados, perdidos o guardados en un dispositivo que ya no esté disponible.</p></section>
        <section><h2>4. Archivos PDF y uso compartido</h2><p>Cuando solicitas una exportación, el PDF se genera localmente. En Android, se puede guardar un archivo temporal en la memoria caché privada de la aplicación para permitir que se comparta. Si la función de compartir no está disponible, puedes guardar el documento en tu dispositivo.</p><p>Solo se comparte después de una acción explícita tuya. Cuando eliges otra aplicación —como correo electrónico, mensajería o almacenamiento en la nube— el tratamiento posterior del PDF depende de ese servicio y de su política de privacidad. Verifica el destinatario antes de enviar un documento que contenga datos personales.</p></section>
        <section><h2>5. Recopilación, venta y divulgación de datos</h2><p>En la versión actual de CV ATS Express:</p><ul><li>no recopilamos el contenido de tus currículums;</li><li>no vendemos datos personales;</li><li>no utilizamos datos para publicidad;</li><li>no utilizamos SDK de analítica o seguimiento;</li><li>no elaboramos perfiles de comportamiento;</li><li>no exigimos registro ni inicio de sesión.</li></ul><p>Una acción para compartir iniciada por ti no significa que CV ATS Express recopile el documento; únicamente entrega el archivo a la aplicación o destino que selecciones.</p></section>
        <section><h2>6. Funciones del dispositivo</h2><p>La aplicación utiliza funciones locales necesarias para operar, incluido el almacenamiento de preferencias, la creación de archivos y la interfaz para compartir de Android. Estas funciones se utilizan para realizar las acciones que solicitas, no para crear una base remota de datos personales.</p></section>
        <section><h2>7. Esta página y Firebase Hosting</h2><p>Esta Política de privacidad está alojada en Firebase Hosting, un servicio proporcionado por Google. Al acceder a la página, el proveedor de alojamiento puede tratar datos técnicos necesarios para entregar y proteger el contenido, como la dirección IP, información del navegador y la fecha y hora de la solicitud.</p><p>Esta página no instala herramientas de analítica, píxeles publicitarios ni cookies propias de seguimiento. Solo guarda el idioma que eliges manualmente en el almacenamiento local del navegador para utilizar el mismo idioma en tu próxima visita.</p><p>Consulta la <a href="https://policies.google.com/privacy" rel="noopener noreferrer">Política de privacidad de Google</a> para obtener más información sobre el tratamiento realizado por el proveedor.</p></section>
        <section><h2>8. Seguridad</h2><p>Utilizamos una arquitectura local y evitamos transmisiones innecesarias para reducir la exposición de datos. Aun así, ningún dispositivo o sistema es completamente inmune a los riesgos. Recomendamos mantener Android actualizado, usar un bloqueo de pantalla y proteger los archivos PDF exportados o compartidos.</p></section>
        <section><h2>9. Tus controles y derechos</h2><p>Como los currículums permanecen en tu dispositivo, controlas tus datos directamente en la aplicación: puedes editar o eliminar currículums y borrar todos los datos eliminando el almacenamiento de la app o desinstalándola.</p><p>Como no recibimos una copia de tus currículums, normalmente no disponemos de datos que podamos consultar, corregir, exportar o eliminar en tu nombre. Si tienes dudas sobre privacidad o deseas ejercer un derecho aplicable respecto a información que hayas proporcionado directamente al desarrollador en una comunicación de soporte, utiliza el contacto indicado al final de esta política.</p></section>
        <section><h2>10. Niños y adolescentes</h2><p>CV ATS Express es una herramienta general para crear currículums y no está dirigida específicamente a niños. Los menores deben utilizar la aplicación con la orientación de su padre, madre o tutor y evitar ingresar o compartir datos personales innecesarios.</p></section>
        <section><h2>11. Cambios en esta política</h2><p>Podemos actualizar esta política para reflejar cambios en la aplicación, en la legislación aplicable o en los servicios utilizados. La versión vigente estará disponible en esta página junto con la fecha de la última actualización. Los cambios relevantes en el tratamiento de datos se comunicarán adecuadamente antes de que entren en vigor cuando sea obligatorio.</p></section>
        <section class="contact-card"><h2>12. Contacto</h2><p>Para preguntas, solicitudes o dudas sobre la privacidad en CV ATS Express, comunícate con:</p><p class="contact-placeholder"><strong>Correo electrónico:</strong> <span>viva@tomsys.page</span></p></section>`,
    },
  };

  function detectLanguage(locales) {
    for (const locale of locales) {
      const normalized = String(locale).trim().replace('_', '-').toLowerCase();
      const [language, region] = normalized.split('-');
      if (language === 'pt') return 'pt-BR';
      if (language === 'en') return 'en-US';
      if (language === 'es') return region === 'es' ? 'es-ES' : 'es-419';
    }
    return FALLBACK_LANGUAGE;
  }

  function readStoredLanguage() {
    try {
      const value = localStorage.getItem(STORAGE_KEY);
      return SUPPORTED_LANGUAGES.includes(value) ? value : null;
    } catch {
      return null;
    }
  }

  function storeLanguage(language) {
    try {
      localStorage.setItem(STORAGE_KEY, language);
    } catch {
      // The selected language remains active for this visit.
    }
  }

  function systemLocales() {
    if (navigator.languages && navigator.languages.length) return navigator.languages;
    return navigator.language ? [navigator.language] : [];
  }

  function renderOverview(items) {
    const list = document.querySelector('#summary-list');
    list.replaceChildren(...items.map((item) => {
      const row = document.createElement('li');
      const check = document.createElement('span');
      const text = document.createElement('span');
      check.className = 'check';
      check.setAttribute('aria-hidden', 'true');
      check.textContent = '✓';
      text.textContent = item;
      row.append(check, text);
      return row;
    }));
  }

  function applyLanguage(language) {
    const translation = translations[language] || translations[FALLBACK_LANGUAGE];
    document.documentElement.lang = language;
    document.title = translation.documentTitle;
    document.querySelector('#page-description').setAttribute('content', translation.description);
    document.querySelector('.brand-logo').alt = translation.logoAlt;
    document.querySelector('#language-label').textContent = translation.languageLabel;
    document.querySelector('#skip-link').textContent = translation.skip;
    document.querySelector('#page-title').textContent = translation.title;
    document.querySelector('#page-summary').textContent = translation.summary;
    document.querySelector('#updated-date').textContent = translation.updated;
    document.querySelector('#summary-title').textContent = translation.overviewTitle;
    document.querySelector('#back-to-top').textContent = translation.backToTop;
    document.querySelector('#language-select').value = language;
    policyCard.innerHTML = translation.policy;
    renderOverview(translation.overview);
  }

  const initialLanguage = readStoredLanguage() || detectLanguage(systemLocales());
  applyLanguage(initialLanguage);

  document.querySelector('#language-select').addEventListener('change', (event) => {
    const language = event.target.value;
    if (!SUPPORTED_LANGUAGES.includes(language)) return;
    applyLanguage(language);
    storeLanguage(language);
  });
})();
