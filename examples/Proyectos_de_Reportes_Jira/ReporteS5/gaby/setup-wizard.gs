/**
 * Asistente de configuración específico para la instancia ccsoft.atlassian.net
 * Guía paso a paso para configurar credenciales correctamente
 */

class SetupWizard {
  
  constructor() {
    this.ui = SpreadsheetApp.getUi();
  }

  /**
   * Ejecuta el asistente de configuración completo
   */
  ejecutarAsistente() {
    try {
      // Paso 1: Mostrar información inicial
      this._mostrarInformacionInicial();
      
      // Paso 2: Configurar email
      const email = this._configurarEmail();
      if (!email) return false;
      
      // Paso 3: Configurar API Token
      const apiToken = this._configurarAPIToken();
      if (!apiToken) return false;
      
      // Paso 4: Guardar configuración
      this._guardarConfiguracion(email, apiToken);
      
      // Paso 5: Probar conexión
      return this._probarConexion();
      
    } catch (error) {
      Logger.log(`❌ Error en asistente: ${error.message}`);
      this.ui.alert('Error', `Error en configuración: ${error.message}`, this.ui.ButtonSet.OK);
      return false;
    }
  }

  /**
   * Muestra la información inicial del asistente
   * @private
   */
  _mostrarInformacionInicial() {
    const mensaje = `🚀 ASISTENTE DE CONFIGURACIÓN JIRA\n\n` +
      `Te ayudaré a configurar tu conexión con:\n` +
      `🏢 Dominio: ccsoft.atlassian.net\n` +
      `📂 Proyecto: FENIX\n\n` +
      `Necesitarás:\n` +
      `📧 Tu email de Jira (computocontable@gmail.com)\n` +
      `🔑 Un API Token (te ayudo a obtenerlo)\n\n` +
      `¿Continuar?`;
    
    const response = this.ui.alert(
      '🎯 Configuración Sistema Jira',
      mensaje,
      this.ui.ButtonSet.YES_NO
    );
    
    if (response !== this.ui.Button.YES) {
      throw new Error('Configuración cancelada por el usuario');
    }
  }

  /**
   * Configura el email del usuario
   * @private
   * @returns {string|null} Email configurado o null si se cancela
   */
  _configurarEmail() {
    const mensaje = `📧 CONFIGURAR EMAIL DE JIRA\n\n` +
      `Por favor, confirma tu email de acceso a Jira:\n\n` +
      `(El sistema sugiere: computocontable@gmail.com)\n\n` +
      `Si es diferente, ingresa el correcto:`;
    
    const response = this.ui.prompt(
      'Paso 1: Email de Jira',
      mensaje,
      this.ui.ButtonSet.OK_CANCEL
    );
    
    if (response.getSelectedButton() !== this.ui.Button.OK) {
      return null;
    }
    
    let email = response.getResponseText().trim();
    if (!email) {
      email = 'computocontable@gmail.com'; // Valor por defecto
    }
    
    if (!this._validarEmail(email)) {
      this.ui.alert('Error', 'Email inválido. Debe ser una dirección válida.', this.ui.ButtonSet.OK);
      return this._configurarEmail(); // Reintentar
    }
    
    return email;
  }

  /**
   * Configura el API Token del usuario
   * @private
   * @returns {string|null} API Token o null si se cancela
   */
  _configurarAPIToken() {
    // Mostrar instrucciones para obtener el token
    const instrucciones = `🔑 OBTENER API TOKEN\n\n` +
      `Pasos para obtener tu API Token:\n\n` +
      `1. Abre una nueva pestaña en tu navegador\n` +
      `2. Ve a: https://id.atlassian.com/manage-profile/security/api-tokens\n` +
      `3. Inicia sesión con tu cuenta de Jira\n` +
      `4. Haz clic en "Create API token"\n` +
      `5. Nombre: "Google Sheets Reportes"\n` +
      `6. Copia el token completo\n\n` +
      `⚠️ El token es LARGO (como 200 caracteres)\n` +
      `⚠️ Solo se muestra UNA VEZ, cópialo completo\n\n` +
      `¿Ya tienes tu API Token listo?`;
    
    const readyResponse = this.ui.alert(
      'Paso 2: API Token',
      instrucciones,
      this.ui.ButtonSet.YES_NO
    );
    
    if (readyResponse !== this.ui.Button.YES) {
      return null;
    }
    
    // Solicitar el token
    const tokenPrompt = `🔑 INGRESAR API TOKEN\n\n` +
      `Pega aquí tu API Token completo:\n\n` +
      `(Debería empezar con ATATT3xFfGF0...)\n` +
      `(Y ser muy largo, ~200 caracteres)`;
    
    const tokenResponse = this.ui.prompt(
      'Ingresar Token',
      tokenPrompt,
      this.ui.ButtonSet.OK_CANCEL
    );
    
    if (tokenResponse.getSelectedButton() !== this.ui.Button.OK) {
      return null;
    }
    
    const token = tokenResponse.getResponseText().trim();
    
    if (!token || token.length < 50) {
      this.ui.alert(
        'Token Muy Corto',
        `El token parece incompleto (${token.length} caracteres).\n\n` +
        `Un API Token válido tiene ~200 caracteres.\n\n` +
        `¿Copiaste el token completo?`,
        this.ui.ButtonSet.OK
      );
      return this._configurarAPIToken(); // Reintentar
    }
    
    if (!token.startsWith('ATATT')) {
      const continueResponse = this.ui.alert(
        'Token Inusual',
        `El token no empieza con "ATATT" como es normal.\n\n` +
        `Token ingresado: ${token.substring(0, 20)}...\n\n` +
        `¿Estás seguro que es correcto?`,
        this.ui.ButtonSet.YES_NO
      );
      
      if (continueResponse !== this.ui.Button.YES) {
        return this._configurarAPIToken(); // Reintentar
      }
    }
    
    return token;
  }

  /**
   * Guarda la configuración en el sistema
   * @private
   * @param {string} email - Email del usuario
   * @param {string} apiToken - API Token del usuario
   */
  _guardarConfiguracion(email, apiToken) {
    // Guardar en el sistema de credenciales
    if (typeof CredManager !== 'undefined') {
      CredManager.setEmail(email);
      CredManager.setApiToken(apiToken);
      CredManager.setProjectKey('FENIX');
    }
    
    // Actualizar configuración global
    CONFIG_JIRA.email = email;
    CONFIG_JIRA.apiToken = apiToken;
    CONFIG_JIRA.projectKey = 'FENIX';
    
    Logger.log(`✅ Configuración guardada: ${email} / Token: ${apiToken.substring(0, 10)}...`);
  }

  /**
   * Prueba la conexión con Jira
   * @private
   * @returns {boolean} True si la conexión es exitosa
   */
  _probarConexion() {
    this.ui.alert(
      'Probando Conexión',
      '🔄 Probando conexión con Jira...\n\nEsto puede tomar unos segundos.',
      this.ui.ButtonSet.OK
    );
    
    try {
      const jiraAPI = new JiraAPI();
      const colaboradores = jiraAPI.obtenerListaColaboradores();
      
      this.ui.alert(
        '✅ Configuración Exitosa',
        `¡Conexión establecida correctamente!\n\n` +
        `📧 Email: ${CONFIG_JIRA.email}\n` +
        `🔑 Token: Configurado\n` +
        `📂 Proyecto: ${CONFIG_JIRA.projectKey}\n` +
        `👥 Colaboradores encontrados: ${colaboradores.length}\n\n` +
        `¡Ya puedes generar reportes!`,
        this.ui.ButtonSet.OK
      );
      
      return true;
      
    } catch (error) {
      Logger.log(`❌ Error probando conexión: ${error.message}`);
      
      this.ui.alert(
        '❌ Error de Conexión',
        `No se pudo conectar con Jira:\n\n` +
        `${error.message}\n\n` +
        `Revisa:\n` +
        `• Email correcto\n` +
        `• API Token completo\n` +
        `• Conexión a internet\n\n` +
        `Usa "🔍 Diagnóstico Completo" para más detalles.`,
        this.ui.ButtonSet.OK
      );
      
      return false;
    }
  }

  /**
   * Valida formato de email
   * @private
   * @param {string} email - Email a validar
   * @returns {boolean} True si es válido
   */
  _validarEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}

// Función global para ejecutar el asistente
function ejecutarAsistenteConfiguracion() {
  const wizard = new SetupWizard();
  return wizard.ejecutarAsistente();
}