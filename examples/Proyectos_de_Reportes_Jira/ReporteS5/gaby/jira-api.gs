/**
 * Módulo para manejo de API de Jira
 * Contiene todas las funciones relacionadas con consultas a Jira
 */

class JiraAPI {
  
  /**
   * Constructor de la clase JiraAPI
   */
  constructor() {
    this.domain = CONFIG_JIRA.dominio;
    
    // Intentar cargar credenciales del almacén si están vacías en config
    if (typeof CredManager !== 'undefined') {
      CredManager.cargarCredenciales();
    }
    
    this.email = CONFIG_JIRA.email;
    this.apiToken = CONFIG_JIRA.apiToken;
    this.auth = "Basic " + Utilities.base64Encode(this.email + ":" + this.apiToken);
  }

  /**
   * Obtiene la lista de colaboradores (usuarios asignables) de un proyecto específico en Jira
   * @returns {Array} Lista de usuarios asignables
   */
  obtenerListaColaboradores() {
    Logger.log("👥 Obteniendo colaboradores...");
    
    try {
      // Validar configuración antes de hacer la consulta
      this._validarConfiguracion();
      
      const url = `https://${this.domain}/rest/api/3/user/assignable/search?project=${CONFIG_JIRA.projectKey}`;
      Logger.log(`🔗 URL de consulta: ${url}`);
      
      const options = this._crearOpcionesRequest("GET");

      const response = UrlFetchApp.fetch(url, options);
      const responseCode = response.getResponseCode();
      const responseText = response.getContentText();
      
      Logger.log(`📡 Respuesta HTTP: ${responseCode}`);
      Logger.log(`📄 Contenido de respuesta: ${responseText.substring(0, 500)}...`);
      
      if (responseCode !== 200) {
        let errorMessage = this._interpretarErrorHTTP(responseCode, responseText);
        throw new Error(errorMessage);
      }
      
      const data = JSON.parse(responseText);
      Logger.log(`✅ Colaboradores encontrados: ${data.length}`);
      
      return data;
      
    } catch (error) {
      Logger.log(`❌ Error obteniendo lista de colaboradores: ${error.message}`);
      throw ErrorManager.handleJiraAPIError(error, 'obtener colaboradores', {
        domain: this.domain,
        projectKey: CONFIG_JIRA.projectKey
      });
    }
  }

  /**
   * Obtiene las tareas de Jira según el colaborador y período especificado
   * @param {string} colaborador - ID del colaborador
   * @param {string} periodo - Período a consultar (sprint, dia, semanaAct, semanaAnt)
   * @returns {Array} Lista de issues de Jira
   */
  obtenerListaTareas(colaborador, periodo) {
    try {
      const jql = this._construirJQL(colaborador, periodo);
      const fields = this._obtenerCamposSolicitud();
      
      const encodedJql = encodeURIComponent(jql);
      const url = `https://${this.domain}/rest/api/3/search?jql=${encodedJql}&fields=${fields}&maxResults=${CONFIG_JIRA.maxResults}`;
      
      const options = this._crearOpcionesRequest("GET");
      
      Logger.log(`🔍 Ejecutando consulta JQL: ${jql}`);
      
      const response = UrlFetchApp.fetch(url, options);
      const data = JSON.parse(response.getContentText());
      
      if (response.getResponseCode() !== 200) {
        throw new Error(`Error en API: ${response.getResponseCode()} - ${data.errorMessages || 'Error desconocido'}`);
      }
      
      Logger.log(`✅ Se encontraron ${data.issues.length} tareas`);
      return data.issues;
      
    } catch (error) {
      Logger.log(`❌ Error obteniendo tareas: ${error.message}`);
      throw new Error(`Error al obtener tareas de Jira: ${error.message}`);
    }
  }

  /**
   * Construye la consulta JQL según el período especificado
   * @private
   * @param {string} colaborador - ID del colaborador
   * @param {string} periodo - Período a consultar
   * @returns {string} Consulta JQL construida
   */
  _construirJQL(colaborador, periodo) {
    const baseConditions = this._obtenerCondicionesBase(colaborador);
    
    // Solo usar condiciones de fecha/hora si el campo está configurado
    const usarFechaHora = CONFIG_JIRA.customFields.fechaHora && CONFIG_JIRA.customFields.fechaHora.trim() !== "";
    
    let condicionesPeriodo = {};
    
    if (usarFechaHora) {
      // Versión original con campo de fecha/hora
      condicionesPeriodo = {
        "sprint": "",
        "dia": ` AND (duedate = now() OR ("${CONFIG_JIRA.customFields.fechaHora}" >= startOfDay() AND "${CONFIG_JIRA.customFields.fechaHora}" <= endOfDay()))`,
        "semanaAct": ` AND ((duedate >= startOfWeek() AND duedate <= endOfWeek()) OR ("${CONFIG_JIRA.customFields.fechaHora}" >= startOfWeek() AND "${CONFIG_JIRA.customFields.fechaHora}" <= endOfWeek()))`,
        "semanaAnt": ` AND ((duedate >= startOfWeek(-1w) AND duedate <= endOfWeek(-1w)) OR ("${CONFIG_JIRA.customFields.fechaHora}" >= startOfWeek(-1w) AND "${CONFIG_JIRA.customFields.fechaHora}" <= endOfWeek(-1w)))`
      };
    } else {
      // Versión simplificada solo con duedate
      condicionesPeriodo = {
        "sprint": "",
        "dia": ` AND duedate = now()`,
        "semanaAct": ` AND (duedate >= startOfWeek() AND duedate <= endOfWeek())`,
        "semanaAnt": ` AND (duedate >= startOfWeek(-1w) AND duedate <= endOfWeek(-1w))`
      };
    }

    const condicionPeriodo = condicionesPeriodo[periodo] || "";
    return `${baseConditions}${condicionPeriodo} ORDER BY key`;
  }

  /**
   * Obtiene las condiciones base para todas las consultas JQL
   * @private
   * @param {string} colaborador - ID del colaborador
   * @returns {string} Condiciones base de JQL
   */
  _obtenerCondicionesBase(colaborador) {
    const tiposExcluidos = FILTROS_JQL.tiposExcluidos.map(tipo => `"${tipo}"`).join(" AND type != ");
    const palabrasExcluidas = FILTROS_JQL.palabrasExcluidas.map(palabra => `summary !~ "${palabra}"`).join(" AND ");
    
    return `Sprint in openSprints() AND assignee = "${colaborador}" AND (type != ${tiposExcluidos}) AND (${palabrasExcluidas})`;
  }

  /**
   * Obtiene la lista de campos a solicitar en la consulta
   * @private
   * @returns {string} Campos separados por coma
   */
  _obtenerCamposSolicitud() {
    const campos = [
      "key",
      "summary", 
      "status",
      "duedate",
      "timespent",
      "issuetype",
      "assignee",
      CONFIG_JIRA.customFields.compromiso,
      "parent"
    ];
    
    // Solo agregar campo de fecha/hora si está configurado
    if (CONFIG_JIRA.customFields.fechaHora && CONFIG_JIRA.customFields.fechaHora.trim() !== "") {
      campos.push(CONFIG_JIRA.customFields.fechaHora);
    }
    
    return campos.filter(campo => campo && campo.trim() !== "").join(",");
  }

  /**
   * Crea las opciones para las requests HTTP
   * @private
   * @param {string} method - Método HTTP
   * @returns {Object} Opciones de request
   */
  _crearOpcionesRequest(method) {
    return {
      method: method.toLowerCase(),
      headers: {
        "Authorization": this.auth,
        "Accept": "application/json",
        "Content-Type": "application/json"
      },
      muteHttpExceptions: true
    };
  }

  /**
   * Valida la configuración de Jira antes de hacer consultas
   * @private
   * @throws {Error} Si la configuración es inválida
   */
  _validarConfiguracion() {
    const errores = [];
    const sugerencias = [];
    
    if (!this.domain || this.domain === 'tu-dominio.atlassian.net') {
      errores.push('Dominio de Jira no configurado correctamente');
    }
    
    if (!this.email || this.email === '' || this.email === 'tu-email@empresa.com') {
      errores.push('Email de Jira no configurado');
      sugerencias.push('📧 Usa: Menú > ⚙️ Configuración > 🚀 Asistente de Configuración');
    }
    
    if (!this.apiToken || this.apiToken === '' || this.apiToken === 'tu-api-token-aqui') {
      errores.push('API Token de Jira no configurado');
      sugerencias.push('🔑 Obtén tu token en: https://id.atlassian.com/manage-profile/security/api-tokens');
    }
    
    if (!CONFIG_JIRA.projectKey) {
      errores.push('Clave de proyecto no configurada');
      sugerencias.push('📂 El proyecto FENIX debería estar preconfigurado');
    }
    
    if (errores.length > 0) {
      let mensaje = `❌ Configuración incompleta:\n- ${errores.join('\n- ')}\n\n`;
      
      // Agregar información sobre credenciales almacenadas
      if (typeof CredManager !== 'undefined') {
        const emailAlmacenado = CredManager.getEmail();
        const tokenAlmacenado = CredManager.getApiToken();
        
        mensaje += `💾 Estado del almacén de credenciales:\n`;
        mensaje += `📧 Email almacenado: ${emailAlmacenado || '❌ Vacío'}\n`;
        mensaje += `🔑 Token almacenado: ${tokenAlmacenado ? '✅ Presente' : '❌ Vacío'}\n\n`;
      }
      
      if (sugerencias.length > 0) {
        mensaje += `🎯 Soluciones recomendadas:\n- ${sugerencias.join('\n- ')}\n\n`;
      }
      
      mensaje += `⚡ SOLUCIÓN RÁPIDA: Usa el "🚀 Asistente de Configuración" desde el menú`;
      
      throw new Error(mensaje);
    }
  }

  /**
   * Interpreta y proporciona mensajes específicos para errores HTTP
   * @private
   * @param {number} statusCode - Código de estado HTTP
   * @param {string} responseText - Texto de respuesta
   * @returns {string} Mensaje de error específico
   */
  _interpretarErrorHTTP(statusCode, responseText) {
    let data = {};
    try {
      data = JSON.parse(responseText);
    } catch (e) {
      // Si no se puede parsear JSON, usar texto plano
    }
    
    const errorMessages = data.errorMessages || [];
    const errors = data.errors || {};
    
    switch (statusCode) {
      case 400:
        return `Error 400 - Solicitud inválida: ${errorMessages.join(', ') || 'Parámetros incorrectos'}`;
      
      case 401:
        return `Error 401 - No autorizado: Verifica tu email y API token en config.gs. ${errorMessages.join(', ')}`;
      
      case 403:
        return `Error 403 - Sin permisos: No tienes acceso al proyecto "${CONFIG_JIRA.projectKey}". Verifica que el proyecto exista y tengas permisos.`;
      
      case 404:
        let mensaje404 = `Error 404 - No encontrado: `;
        if (errorMessages.length > 0) {
          mensaje404 += errorMessages.join(', ');
        } else {
          mensaje404 += `El proyecto "${CONFIG_JIRA.projectKey}" no existe o no tienes acceso. `;
          mensaje404 += `Verifica la clave del proyecto en config.gs.`;
        }
        return mensaje404;
      
      case 429:
        return `Error 429 - Demasiadas solicitudes: Espera un momento antes de intentar nuevamente.`;
      
      case 500:
        return `Error 500 - Error interno del servidor Jira: ${errorMessages.join(', ') || 'Intenta más tarde'}`;
      
      default:
        return `Error HTTP ${statusCode}: ${errorMessages.join(', ') || responseText.substring(0, 200)}`;
    }
  }
}

// Funciones globales para mantener compatibilidad
function obtenerListaColaboradores() {
  const jiraAPI = new JiraAPI();
  return jiraAPI.obtenerListaColaboradores();
}

function obtenerListaTareas(colaborador, periodo) {
  const jiraAPI = new JiraAPI();
  return jiraAPI.obtenerListaTareas(colaborador, periodo);
}