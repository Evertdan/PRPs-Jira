/**
 * AtlassianApi.gs - API wrapper unificado para Atlassian (Jira/Confluence)
 * Implementa patrones obligatorios de CLAUDE.md
 * COMPLETAMENTE AUTOCONTENIDO - Sin dependencias externas
 * Incluye todas las funciones de LibreriaCoreJira integradas
 */

/**
 * Clase base obligatoria para APIs de Atlassian siguiendo CLAUDE.md
 * Implementa autenticación, rate limiting y manejo de errores estándar
 */
class AtlassianApiBase {
  constructor() {
    const config = obtenerConfiguracion();
    this.domain = config.domain;
    this.email = config.email;
    this.apiToken = config.apiToken;
    this.baseUrl = `https://${this.domain}`;
    this.quotaManager = new QuotaManager();
  }
  
  /**
   * Genera headers de autenticación estándar
   * @returns {Object} Headers con autenticación Basic
   */
  getAuthHeaders() {
    const auth = Utilities.base64Encode(`${this.email}:${this.apiToken}`);
    return {
      'Authorization': `Basic ${auth}`,
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'User-Agent': 'GoogleAppsScript-JiraSync/2.0',
      'X-Atlassian-Token': 'no-check'
    };
  }
  
  /**
   * Realiza request con rate limiting y manejo de errores
   * Patrón obligatorio de CLAUDE.md
   * @param {string} endpoint - Endpoint de la API
   * @param {Object} opciones - Opciones de request
   * @returns {Object} Respuesta de la API
   */
  makeRequest(endpoint, opciones = {}) {
    const url = `${this.baseUrl}${endpoint}`;
    const requestOptions = {
      method: 'GET',
      headers: this.getAuthHeaders(),
      muteHttpExceptions: true,
      ...opciones
    };
    
    // Aplicar rate limiting inteligente
    aplicarRateLimit(endpoint);
    
    // Incrementar contador de quota
    this.quotaManager.incrementar('urlFetch');
    
    // Realizar request con rate limiting
    return realizarRequestConRateLimit(url, requestOptions);
  }
}

/**
 * Manager específico para operaciones de Jira
 * Extiende AtlassianApiBase con funcionalidades específicas
 */
class JiraApiManager extends AtlassianApiBase {
  constructor() {
    super();
  }
  
  /**
   * Busca issues usando JQL con paginación optimizada
   * @param {string} jql - Query JQL
   * @param {number} startAt - Índice de inicio
   * @param {number} maxResults - Máximo resultados por página
   * @returns {Object} Respuesta con issues y metadata
   */
  searchIssues(jql, startAt = 0, maxResults = 50) {
    const fields = [
      // Campos básicos
      'key', 'summary', 'status', 'assignee', 'priority',
      'issuetype', 'created', 'updated', 'reporter',
      'labels', 'components', 'project', 'duedate',
      // Campos para análisis de entregables
      'attachment', 'comment', 'remotelinks', 'description', 'worklog',
      // Campos personalizados clave
      'customfield_10020', // Sprint
      'customfield_10230', // Comentarios (campo de texto)
      'customfield_10231', // Desviaciones (campo de texto)
      'customfield_10016', // Story Points
      'customfield_10003'  // Epic Link
    ];
    
    const endpoint = `/rest/api/3/search?jql=${encodeURIComponent(jql)}&startAt=${startAt}&maxResults=${maxResults}&fields=${fields.join(',')}&expand=renderedFields`;
    
    logEstructurado('INFO', 'Buscando issues en Jira', { 
      jql: jql.substring(0, 100) + (jql.length > 100 ? '...' : ''),
      startAt, 
      maxResults 
    });
    
    const response = this.makeRequest(endpoint);
    
    if (response.getResponseCode() !== 200) {
      throw new Error(`Error en búsqueda Jira: ${response.getResponseCode()} - ${response.getContentText()}`);
    }
    
    return JSON.parse(response.getContentText());
  }
  
  /**
   * Obtiene todos los issues de un proyecto con paginación automática
   * @param {string} projectKey - Clave del proyecto
   * @param {Date} modifiedSince - Fecha desde la cual buscar cambios
   * @returns {Array} Array de issues
   */
  getAllIssuesFromProject(projectKey, modifiedSince = null) {
    let jql = `project = "${projectKey}" ORDER BY updated DESC`;
    
    if (modifiedSince) {
      const dateStr = modifiedSince.toISOString().split('T')[0];
      jql = `project = "${projectKey}" AND updated >= "${dateStr}" ORDER BY updated DESC`;
    }
    
    const allIssues = [];
    let startAt = 0;
    const maxResults = 100; // Máximo permitido por Jira
    
    logEstructurado('INFO', `Iniciando descarga de issues del proyecto ${projectKey}`);
    
    while (true) {
      const result = this.searchIssues(jql, startAt, maxResults);
      if (result && result.issues) {
        allIssues.push(...result.issues);
        logEstructurado('DEBUG', `Descargados ${allIssues.length}/${result.total} issues`);
        
        if (startAt + maxResults >= result.total) break;
        startAt += maxResults;
        
        if (allIssues.length % 500 === 0) {
          logEstructurado('INFO', `Progreso: ${allIssues.length}/${result.total} issues descargados`);
        }
        
        if (this.shouldBreakForTimeout()) {
          logEstructurado('WARN', 'Interrumpiendo por límite de tiempo de Apps Script',
            {
            descargados: allIssues.length,
            total: result.total
          });
          break;
        }
      } else {
        logEstructurado('WARN', 'La búsqueda de issues no retornó resultados válidos.', { jql, startAt });
        break;
      }
    }
    
    logEstructurado('SUCCESS', `Descarga completada: ${allIssues.length} issues del proyecto ${projectKey}`);
    return allIssues;
  }
  
  /**
   * Actualiza un issue específico
   * @param {string} issueKey - Clave del issue (ej: PROJ-123)
   * @param {Object} updateData - Datos a actualizar
   * @returns {boolean} true si fue exitoso
   */
  updateIssue(issueKey, updateData) {
    const endpoint = `/rest/api/3/issue/${issueKey}`;
    logEstructurado('INFO', `Actualizando issue ${issueKey}`, { updateData });
    
    const response = this.makeRequest(endpoint, {
      method: 'PUT',
      payload: JSON.stringify(updateData)
    });
    
    if (response.getResponseCode() !== 204) {
      throw new Error(`Error actualizando issue ${issueKey}: ${response.getResponseCode()} - ${response.getContentText()}`);
    }
    
    logEstructurado('SUCCESS', `Issue ${issueKey} actualizado exitosamente`);
    return true;
  }
  
  /**
   * Obtiene transiciones disponibles para un issue
   * @param {string} issueKey - Clave del issue
   * @returns {Array} Array de transiciones disponibles
   */
  getIssueTransitions(issueKey) {
    const endpoint = `/rest/api/3/issue/${issueKey}/transitions`;
    const response = this.makeRequest(endpoint);
    
    if (response.getResponseCode() !== 200) {
      throw new Error(`Error obteniendo transiciones para ${issueKey}: ${response.getResponseCode()}`);
    }
    
    const data = JSON.parse(response.getContentText());
    return data.transitions || [];
  }
  
  /**
   * Ejecuta una transición de estado en un issue
   * @param {string} issueKey - Clave del issue
   * @param {string} targetStatus - Estado objetivo
   * @returns {boolean} true si fue exitoso
   */
  transitionIssueStatus(issueKey, targetStatus) {
    const transitions = this.getIssueTransitions(issueKey);
    const targetTransition = transitions.find(t => t.to.name.toLowerCase() === targetStatus.toLowerCase());
    
    if (!targetTransition) {
      const available = transitions.map(t => t.to.name).join(', ');
      throw new Error(`Transición a '${targetStatus}' no disponible para ${issueKey}. Disponibles: ${available}`);
    }
    
    const endpoint = `/rest/api/3/issue/${issueKey}/transitions`;
    const transitionData = {
      transition: { id: targetTransition.id }
    };
    
    logEstructurado('INFO', `Ejecutando transición ${issueKey}: ${targetTransition.name} → ${targetStatus}`);
    
    const response = this.makeRequest(endpoint, {
      method: 'POST',
      payload: JSON.stringify(transitionData)
    });
    
    if (response.getResponseCode() !== 204) {
      throw new Error(`Error ejecutando transición en ${issueKey}: ${response.getResponseCode()} - ${response.getContentText()}`);
    }
    
    logEstructurado('SUCCESS', `Transición exitosa: ${issueKey} → ${targetStatus}`);
    return true;
  }
  
  /**
   * Crea un nuevo issue en Jira
   * @param {Object} issueData - Datos del issue a crear
   * @returns {Object} Datos del issue creado
   */
  createIssue(issueData) {
    const endpoint = '/rest/api/3/issue';
    const validatedData = validarDatosIssue(issueData);
    
    logEstructurado('INFO', 'Creando nuevo issue en Jira', { 
      project: validatedData.project,
      summary: validatedData.summary 
    });
    
    const response = this.makeRequest(endpoint, {
      method: 'POST',
      payload: JSON.stringify({ fields: validatedData })
    });
    
    if (response.getResponseCode() !== 201) {
      throw new Error(`Error creando issue: ${response.getResponseCode()} - ${response.getContentText()}`);
    }
    
    const issue = JSON.parse(response.getContentText());
    logEstructurado('SUCCESS', `Issue creado exitosamente: ${issue.key}`);
    return issue;
  }
  
  /**
   * Obtiene información del usuario actual
   * @returns {Object} Datos del usuario autenticado
   */
  getCurrentUser() {
    const endpoint = '/rest/api/3/myself';
    const response = this.makeRequest(endpoint);
    
    if (response.getResponseCode() !== 200) {
      throw new Error(`Error obteniendo usuario actual: ${response.getResponseCode()}`);
    }
    
    return JSON.parse(response.getContentText());
  }
  
  /**
   * Petición genérica a la API de Jira con manejo de errores y paginación
   * @param {string} endpoint - Endpoint de la API
   * @param {Object} params - Parámetros para la URL
   * @param {string} method - Método HTTP
   * @param {Object} payload - Datos para POST/PUT
   * @returns {Array|Object} Resultado de la API (array si es paginado)
   */
  fetchJiraAPI(endpoint, params = {}, method = 'GET', payload = null) {
    logEstructurado('INFO', `Realizando petición ${method} a ${endpoint}`, { params });
    
    try {
      let url = endpoint;
      if (Object.keys(params).length > 0) {
        const paramString = Object.entries(params)
          .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
          .join('&');
        url += (url.includes('?') ? '&' : '?') + paramString;
      }
      
      const opciones = { method, headers: this.getAuthHeaders() };
      
      if (payload && (method === 'POST' || method === 'PUT')) {
        opciones.payload = JSON.stringify(payload);
      }
      
      const response = this.makeRequest(url, opciones);
      
      if (response.getResponseCode() >= 200 && response.getResponseCode() < 300) {
        const text = response.getContentText();
        if (!text) return null; // Para respuestas 204 No Content
        const data = JSON.parse(text);
        
        if (data.issues && data.total && data.startAt !== undefined) {
          return this.handlePaginatedResponse(data, url, opciones);
        }
        
        return data;
      } else {
        throw new Error(`HTTP ${response.getResponseCode()}: ${response.getContentText()}`);
      }
      
    } catch (error) {
      logEstructurado('ERROR', `Error en fetchJiraAPI`, { endpoint, error: error.message });
      throw error;
    }
  }
  
  /**
   * Maneja respuestas paginadas de Jira automáticamente
   * @private
   */
  handlePaginatedResponse(initialData, baseUrl, opciones) {
    const allIssues = [...initialData.issues];
    let startAt = initialData.startAt + initialData.maxResults;
    
    while (startAt < initialData.total) {
      const paginatedUrl = baseUrl + (baseUrl.includes('?') ? '&' : '?') + `startAt=${startAt}`;
      
      try {
        const response = this.makeRequest(paginatedUrl, opciones);
        const pageData = JSON.parse(response.getContentText());
        
        allIssues.push(...pageData.issues);
        startAt += pageData.maxResults;
        
        logEstructurado('DEBUG', `Paginación: ${allIssues.length}/${initialData.total} issues`);
        
        if (this.shouldBreakForTimeout()) {
          logEstructurado('WARN', 'Interrumpiendo paginación por timeout');
          break;
        }
        
      } catch (error) {
        logEstructurado('ERROR', 'Error en paginación', { error: error.message });
        break;
      }
    }
    
    return { ...initialData, issues: allIssues, actualTotal: allIssues.length };
  }
  
  /**
   * Obtiene todos los proyectos de Jira con cache
   * @returns {Array} Array con todos los proyectos
   */
  obtenerTodosLosProyectos() {
    const cacheKey = CACHE_CONFIG.PROJECTS;
    const cached = PropertiesService.getScriptProperties().getProperty(cacheKey);
    
    if (cached) {
      const cacheData = JSON.parse(cached);
      if (Date.now() - cacheData.timestamp < CACHE_CONFIG.DEFAULT_EXPIRATION * 1000) {
        logEstructurado('DEBUG', 'Usando proyectos desde cache');
        return cacheData.data;
      }
    }
    
    logEstructurado('INFO', 'Obteniendo proyectos desde Jira API');
    const response = this.fetchJiraAPI('/rest/api/3/project');
    
    const cacheData = { data: response, timestamp: Date.now() };
    PropertiesService.getScriptProperties().setProperty(cacheKey, JSON.stringify(cacheData));
    
    return response;
  }
  
  /**
   * Obtiene todos los sprints de todos los tableros
   * @returns {Array} Array con todos los sprints únicos
   */
  obtenerTodosLosSprints() {
    const cacheKey = CACHE_CONFIG.SPRINTS;
    const cached = PropertiesService.getScriptProperties().getProperty(cacheKey);
    
    if (cached) {
      const cacheData = JSON.parse(cached);
      if (Date.now() - cacheData.timestamp < CACHE_CONFIG.DEFAULT_EXPIRATION * 1000) {
        logEstructurado('DEBUG', 'Usando sprints desde cache');
        return cacheData.data;
      }
    }
    
    logEstructurado('INFO', 'Obteniendo sprints desde Jira API');
    
    try {
      const boards = this.fetchJiraAPI('/rest/agile/1.0/board');
      const allSprints = [];
      
      for (const board of boards.values || []) {
        try {
          const sprints = this.fetchJiraAPI(`/rest/agile/1.0/board/${board.id}/sprint`);
          allSprints.push(...(sprints.values || []));
        } catch (error) {
          logEstructurado('WARN', `Error obteniendo sprints del board ${board.id}`, { error: error.message });
        }
      }
      
      const uniqueSprints = allSprints.filter((sprint, index, self) => 
        index === self.findIndex(s => s.id === sprint.id)
      );
      
      const cacheData = { data: uniqueSprints, timestamp: Date.now() };
      PropertiesService.getScriptProperties().setProperty(cacheKey, JSON.stringify(cacheData));
      
      logEstructurado('SUCCESS', `Obtenidos ${uniqueSprints.length} sprints únicos`);
      return uniqueSprints;
      
    } catch (error) {
      logEstructurado('ERROR', 'Error obteniendo sprints', { error: error.message });
      return [];
    }
  }
  
  /**
   * Verifica si debe interrumpir por timeout de Apps Script
   * @returns {boolean} true si se acerca al límite de tiempo
   */
  shouldBreakForTimeout() {
    const startTime = PropertiesService.getScriptProperties().getProperty('EXECUTION_START');
    if (!startTime) return false;
    const tiempoEjecucion = Date.now() - parseInt(startTime);
    return tiempoEjecucion > APPS_SCRIPT_LIMITS.EXECUTION_BUFFER_MS;
  }
}

/**
 * Función de rate limiting inteligente por endpoint
 * @param {string} endpoint - Endpoint para aplicar rate limiting
 */
function aplicarRateLimit(endpoint) {
  const ahora = Date.now();
  const ultimaLlamada = PropertiesService.getScriptProperties().getProperty(`LAST_CALL_${endpoint}`) || '0';
  
  const tiempoTranscurrido = ahora - parseInt(ultimaLlamada);
  const delayMinimo = RATE_LIMITS.MIN_REQUEST_INTERVAL_MS;
  
  if (tiempoTranscurrido < delayMinimo) {
    Utilities.sleep(delayMinimo - tiempoTranscurrido);
  }
  
  PropertiesService.getScriptProperties().setProperty(`LAST_CALL_${endpoint}`, ahora.toString());
}

/**
 * Realizar request con rate limiting y exponential backoff
 * @param {string} url - URL completa del request
 * @param {Object} opciones - Opciones de UrlFetchApp
 * @param {number} maxReintentos - Máximo número de reintentos
 * @returns {Object} Respuesta de UrlFetchApp
 */
function realizarRequestConRateLimit(url, opciones, maxReintentos = 3) {
  const metrics = new MetricsCollector();
  const tiempoInicio = Date.now();
  
  for (let intento = 1; intento <= maxReintentos; intento++) {
    const respuesta = UrlFetchApp.fetch(url, { ...opciones, muteHttpExceptions: true });
    const codigoRespuesta = respuesta.getResponseCode();
    
    if (codigoRespuesta === 429) {
      const delayBase = RATE_LIMITS.EXPONENTIAL_BACKOFF_BASE ** (intento - 1) * 1000;
      const jitter = Math.random() * 1000;
      const delayTotal = Math.min(delayBase + jitter, RATE_LIMITS.MAX_BACKOFF_MS);
      
      logEstructurado('WARN', `Rate limit detectado, esperando ${delayTotal.toFixed(0)}ms`, { intento, url: url.substring(0, 100) });
      Utilities.sleep(delayTotal);
      continue;
    }
    
    if (codigoRespuesta >= 200 && codigoRespuesta < 300) {
      metrics.recordTiming('api_request', Date.now() - tiempoInicio);
      return respuesta;
    }
    
    if (codigoRespuesta >= 400 && codigoRespuesta < 500) {
      metrics.recordError('client_error', {codigo: codigoRespuesta, url: url.substring(0, 100) });
      throw new Error(`Client Error ${codigoRespuesta}: ${respuesta.getContentText()}`);
    }
    
    if (codigoRespuesta >= 500 && intento < maxReintentos) {
      const delay = 1000 * intento;
      logEstructurado('WARN', `Server Error ${codigoRespuesta}, reintentando en ${delay}ms`, { intento, url: url.substring(0, 100) });
      Utilities.sleep(delay);
      continue;
    }
    
    metrics.recordError('server_error', {codigo: codigoRespuesta, intentos: intento });
    throw new Error(`HTTP ${codigoRespuesta}: ${respuesta.getContentText()}`);
  }
  throw new Error('La solicitud falló después de múltiples reintentos.');
}

// ========================================
// FUNCIONES DE COMPATIBILIDAD con LibreriaCoreJira
// ========================================

function fetchJiraAPI(endpoint, params = {}, method = 'GET', payload = null) {
  const api = new JiraApiManager();
  return api.fetchJiraAPI(endpoint, params, method, payload);
}

function obtenerTodosLosProyectos() {
  const api = new JiraApiManager();
  return api.obtenerTodosLosProyectos();
}

function obtenerTodosLosSprints() {
  const api = new JiraApiManager();
  return api.obtenerTodosLosSprints();
}

function registrarError(error, nombreFuncion) {
  logEstructurado('ERROR', `Error en ${nombreFuncion}`, {
    error: error.message,
    stack: error.stack,
    timestamp: new Date().toISOString()
  });
  
  const metrics = new MetricsCollector();
  metrics.recordError(`function_error_${nombreFuncion}`, {
    error: error.message,
    function: nombreFuncion
  });
}

// ========================================
// CONSTANTES INTEGRADAS (de LibreriaCoreJira)
// ========================================

const CONSTANTES = {
  CACHE_EXPIRATION_SECONDS: 3600, // 1 hora
  ESTADOS_JIRA: {
    COMPLETADO: ['Done', 'Listo', 'Cerrado', 'Completado'],
    EN_PROGRESO: ['In Progress', 'En progreso', 'Validación'],
    PENDIENTE: ['To Do', 'Por hacer']
  },
  COLORES_ESTADO: {
    "Por hacer": "#DEEBFF", "En progreso": "#FFF0B3", "To Do": "#DEEBFF",
    "In Progress": "#FFF0B3", "Done": "#E3FCEF", "Listo": "#E3FCEF",
    "Cerrado": "#EBECF0", "Validación": "#FEF2E0", "Completado": "#E3FCEF"
  }
};

/**
 * Clase de compatibilidad que integra todas las funciones de LibreriaCoreJira
 */
class LibreriaCoreJira {
  static fetchJiraAPI(endpoint, params = {}, method = 'GET', payload = null) {
    return fetchJiraAPI(endpoint, params, method, payload);
  }
  
  static obtenerTodosLosProyectos() {
    return obtenerTodosLosProyectos();
  }
  
  static obtenerTodosLosSprints() {
    return obtenerTodosLosSprints();
  }
  
  static evaluarEntregablesYEvidencia(tarea) {
    return evaluarEntregablesYEvidencia(tarea);
  }
  
  static registrarError(error, nombreFuncion) {
    return registrarError(error, nombreFuncion);
  }
}

/**
 * Configuración de credenciales de Jira - Mejorada
 */
function configurarCredenciales() {
  const ui = SpreadsheetApp.getUi();
  
  try {
    logEstructurado('INFO', 'Iniciando configuración de credenciales Jira');
    
    const email = ui.prompt('Configuración de Jira', 'Ingresa tu email de Jira:', ui.ButtonSet.OK_CANCEL);
    if (email.getSelectedButton() !== ui.Button.OK || !email.getResponseText()) {
      ui.alert('Configuración cancelada.');
      return;
    }

    const apiToken = ui.prompt('Configuración de Jira', 'Ingresa tu Token de API de Jira:\n(Generar en: https://id.atlassian.com/manage-profile/security/api-tokens)', ui.ButtonSet.OK_CANCEL);
    if (apiToken.getSelectedButton() !== ui.Button.OK || !apiToken.getResponseText()) {
      ui.alert('Configuración cancelada.');
      return;
    }

    const emailText = email.getResponseText().trim();
    if (!emailText.includes('@')) throw new Error('El email no tiene un formato válido');

    const tokenText = apiToken.getResponseText().trim();
    if (tokenText.length < 20) throw new Error('El token de API parece ser muy corto.');

    const userProperties = PropertiesService.getUserProperties();
    userProperties.setProperty('JIRA_EMAIL', emailText);
    userProperties.setProperty('JIRA_API_TOKEN', tokenText);
    
    try {
      testConectividadAtlassian();
      ui.alert('✅ Configuración Exitosa', 'Credenciales de Jira guardadas y verificadas exitosamente.', ui.ButtonSet.OK);
      logEstructurado('SUCCESS', 'Credenciales configuradas y verificadas', { email: emailText });
    } catch (connectError) {
      logEstructurado('ERROR', 'Error verificando credenciales', { error: connectError.message });
      ui.alert('⚠️ Credenciales Guardadas con Advertencia', `Las credenciales se guardaron, pero la verificación falló:\n\nError: ${connectError.message}\n\nVerifica que el email y el token sean correctos.`, ui.ButtonSet.OK);
    }
    
  } catch (error) {
    logEstructurado('ERROR', 'Error configurando credenciales', { error: error.message });
    ui.alert('❌ Error en Configuración', `No se pudieron configurar las credenciales:\n\n${error.message}`, ui.ButtonSet.OK);
  }
}
