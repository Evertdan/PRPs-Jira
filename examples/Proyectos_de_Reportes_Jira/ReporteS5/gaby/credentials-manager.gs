/**
 * Módulo para manejo de credenciales de Jira
 * Permite configurar y almacenar credenciales de forma segura
 */

class CredentialsManager {
  
  constructor() {
    this.properties = PropertiesService.getDocumentProperties();
  }

  /**
   * Solicita y guarda las credenciales de Jira al usuario
   */
  configurarCredenciales() {
    const ui = SpreadsheetApp.getUi();
    
    try {
      // Obtener credenciales existentes si las hay
      const currentEmail = this.getEmail();
      const currentToken = this.getApiToken();
      
      let emailMessage = 'Ingresa tu email de Jira:';
      if (currentEmail) {
        emailMessage = `Email actual: ${currentEmail}\n\nIngresa nuevo email o deja vacío para mantener actual:`;
      }
      
      // Solicitar email
      const emailResponse = ui.prompt(
        '📧 Configurar Email de Jira',
        emailMessage,
        ui.ButtonSet.OK_CANCEL
      );
      
      if (emailResponse.getSelectedButton() !== ui.Button.OK) {
        return false; // Usuario canceló
      }
      
      let newEmail = emailResponse.getResponseText().trim();
      if (!newEmail && currentEmail) {
        newEmail = currentEmail; // Mantener actual si está vacío
      }
      
      if (!newEmail || !this._validarEmail(newEmail)) {
        ui.alert('Error', 'Email inválido. Debe ser una dirección de email válida.', ui.ButtonSet.OK);
        return false;
      }
      
      let tokenMessage = 'Ingresa tu API Token de Jira:\n\n' +
        'Para obtener tu API Token:\n' +
        '1. Ve a: https://id.atlassian.com/manage-profile/security/api-tokens\n' +
        '2. Crea un nuevo token\n' +
        '3. Copia y pega el token aquí';
      
      if (currentToken) {
        tokenMessage = `Token actual: ${currentToken.substring(0, 8)}...\n\n` +
          'Ingresa nuevo API Token o deja vacío para mantener actual:\n\n' +
          'Para obtener nuevo token: https://id.atlassian.com/manage-profile/security/api-tokens';
      }
      
      // Solicitar API Token
      const tokenResponse = ui.prompt(
        '🔑 Configurar API Token de Jira',
        tokenMessage,
        ui.ButtonSet.OK_CANCEL
      );
      
      if (tokenResponse.getSelectedButton() !== ui.Button.OK) {
        return false; // Usuario canceló
      }
      
      let newToken = tokenResponse.getResponseText().trim();
      if (!newToken && currentToken) {
        newToken = currentToken; // Mantener actual si está vacío
      }
      
      if (!newToken || newToken.length < 10) {
        ui.alert('Error', 'API Token inválido. Debe tener al menos 10 caracteres.', ui.ButtonSet.OK);
        return false;
      }
      
      // Guardar credenciales
      this.setEmail(newEmail);
      this.setApiToken(newToken);
      
      // Actualizar configuración global
      CONFIG_JIRA.email = newEmail;
      CONFIG_JIRA.apiToken = newToken;
      
      // Intentar detectar proyectos disponibles
      this._detectarProyectoDisponible();
      
      ui.alert(
        '✅ Credenciales Configuradas',
        `Email: ${newEmail}\n` +
        `Token: ${newToken.substring(0, 8)}...\n\n` +
        'Usa "🧪 Test Conexión" para verificar que funcionen correctamente.',
        ui.ButtonSet.OK
      );
      
      return true;
      
    } catch (error) {
      Logger.log(`❌ Error configurando credenciales: ${error.message}`);
      ui.alert('Error', `Error configurando credenciales: ${error.message}`, ui.ButtonSet.OK);
      return false;
    }
  }

  /**
   * Obtiene el email almacenado
   * @returns {string} Email o cadena vacía si no existe
   */
  getEmail() {
    return this.properties.getProperty('JIRA_EMAIL') || '';
  }

  /**
   * Obtiene el API token almacenado
   * @returns {string} API token o cadena vacía si no existe
   */
  getApiToken() {
    return this.properties.getProperty('JIRA_API_TOKEN') || '';
  }

  /**
   * Obtiene el proyecto configurado
   * @returns {string} Clave del proyecto o cadena vacía si no existe
   */
  getProjectKey() {
    return this.properties.getProperty('JIRA_PROJECT_KEY') || '';
  }

  /**
   * Guarda el email
   * @param {string} email - Email a guardar
   */
  setEmail(email) {
    this.properties.setProperty('JIRA_EMAIL', email);
  }

  /**
   * Guarda el API token
   * @param {string} token - Token a guardar
   */
  setApiToken(token) {
    this.properties.setProperty('JIRA_API_TOKEN', token);
  }

  /**
   * Guarda la clave del proyecto
   * @param {string} projectKey - Clave del proyecto a guardar
   */
  setProjectKey(projectKey) {
    this.properties.setProperty('JIRA_PROJECT_KEY', projectKey);
    CONFIG_JIRA.projectKey = projectKey;
  }

  /**
   * Carga las credenciales almacenadas en CONFIG_JIRA
   */
  cargarCredenciales() {
    CONFIG_JIRA.email = this.getEmail();
    CONFIG_JIRA.apiToken = this.getApiToken();
    CONFIG_JIRA.projectKey = this.getProjectKey();
  }

  /**
   * Verifica si las credenciales están configuradas
   * @returns {boolean} True si están configuradas
   */
  credencialesConfiguradas() {
    const email = this.getEmail();
    const token = this.getApiToken();
    return email !== '' && token !== '' && this._validarEmail(email) && token.length >= 10;
  }

  /**
   * Elimina todas las credenciales almacenadas
   */
  limpiarCredenciales() {
    this.properties.deleteProperty('JIRA_EMAIL');
    this.properties.deleteProperty('JIRA_API_TOKEN');
    this.properties.deleteProperty('JIRA_PROJECT_KEY');
    
    CONFIG_JIRA.email = '';
    CONFIG_JIRA.apiToken = '';
    CONFIG_JIRA.projectKey = '';
    
    const ui = SpreadsheetApp.getUi();
    ui.alert('🗑️ Credenciales Eliminadas', 'Todas las credenciales han sido eliminadas.', ui.ButtonSet.OK);
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

  /**
   * Intenta detectar automáticamente un proyecto disponible
   * @private
   */
  _detectarProyectoDisponible() {
    try {
      const jiraAPI = new JiraAPI();
      const testUrl = `https://${CONFIG_JIRA.dominio}/rest/api/3/project`;
      
      const response = UrlFetchApp.fetch(testUrl, {
        method: "GET",
        headers: {
          "Authorization": "Basic " + Utilities.base64Encode(CONFIG_JIRA.email + ":" + CONFIG_JIRA.apiToken),
          "Accept": "application/json"
        },
        muteHttpExceptions: true
      });
      
      if (response.getResponseCode() === 200) {
        const projects = JSON.parse(response.getContentText());
        if (projects.length > 0) {
          // Usar el primer proyecto disponible
          const firstProject = projects[0];
          this.setProjectKey(firstProject.key);
          Logger.log(`✅ Proyecto detectado automáticamente: ${firstProject.key} (${firstProject.name})`);
        }
      }
    } catch (error) {
      Logger.log(`⚠️ No se pudo detectar proyecto automáticamente: ${error.message}`);
    }
  }

  /**
   * Muestra un diálogo para seleccionar proyecto de una lista
   */
  seleccionarProyecto() {
    const ui = SpreadsheetApp.getUi();
    
    try {
      if (!this.credencialesConfiguradas()) {
        ui.alert('Sin Credenciales', 'Primero configura tus credenciales de Jira.', ui.ButtonSet.OK);
        return;
      }

      // Cargar credenciales
      this.cargarCredenciales();
      
      const testUrl = `https://${CONFIG_JIRA.dominio}/rest/api/3/project`;
      
      const response = UrlFetchApp.fetch(testUrl, {
        method: "GET",
        headers: {
          "Authorization": "Basic " + Utilities.base64Encode(CONFIG_JIRA.email + ":" + CONFIG_JIRA.apiToken),
          "Accept": "application/json"
        },
        muteHttpExceptions: true
      });
      
      if (response.getResponseCode() !== 200) {
        ui.alert('Error', 'No se pudieron obtener los proyectos. Verifica tus credenciales.', ui.ButtonSet.OK);
        return;
      }
      
      const projects = JSON.parse(response.getContentText());
      
      if (projects.length === 0) {
        ui.alert('Sin Proyectos', 'No tienes acceso a ningún proyecto en Jira.', ui.ButtonSet.OK);
        return;
      }
      
      // Crear lista de proyectos para mostrar al usuario
      let projectList = 'Proyectos disponibles:\n\n';
      projects.slice(0, 10).forEach((project, index) => {
        projectList += `${index + 1}. ${project.key} - ${project.name}\n`;
      });
      
      projectList += `\nIngresa el número del proyecto (1-${Math.min(projects.length, 10)}):`;
      
      const selectionResponse = ui.prompt(
        '📋 Seleccionar Proyecto',
        projectList,
        ui.ButtonSet.OK_CANCEL
      );
      
      if (selectionResponse.getSelectedButton() !== ui.Button.OK) {
        return;
      }
      
      const selection = parseInt(selectionResponse.getResponseText().trim());
      
      if (isNaN(selection) || selection < 1 || selection > Math.min(projects.length, 10)) {
        ui.alert('Error', 'Selección inválida.', ui.ButtonSet.OK);
        return;
      }
      
      const selectedProject = projects[selection - 1];
      this.setProjectKey(selectedProject.key);
      
      ui.alert(
        '✅ Proyecto Configurado',
        `Proyecto seleccionado: ${selectedProject.key}\n(${selectedProject.name})`,
        ui.ButtonSet.OK
      );
      
    } catch (error) {
      Logger.log(`❌ Error seleccionando proyecto: ${error.message}`);
      ui.alert('Error', `Error: ${error.message}`, ui.ButtonSet.OK);
    }
  }
}

// Instancia global del manejador de credenciales
const CredManager = new CredentialsManager();

// Funciones globales de conveniencia
function configurarCredenciales() {
  return CredManager.configurarCredenciales();
}

function seleccionarProyecto() {
  return CredManager.seleccionarProyecto();
}

function limpiarCredenciales() {
  return CredManager.limpiarCredenciales();
}