/**
 * AtlassianApi.gs - Wrapper para APIs de Atlassian
 * Implementa patrones obligatorios de CLAUDE.md: rate limiting, manejo de errores, logging
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
      'User-Agent': 'GoogleAppsScript-JiraSync/1.0',
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
 * Rate Limiter específico para Jira con queue inteligente
 * Respeta límite de 10 req/seg de Jira Cloud
 */
class JiraRateLimiter {
  constructor() {
    this.queue = [];
    this.processing = false;
    this.lastRequest = 0;
    this.MIN_INTERVAL = RATE_LIMITS.MIN_REQUEST_INTERVAL_MS;
  }
  
  /**
   * Añade request a la queue con manejo asíncrono
   * @param {Function} requestFn - Función que realiza el request
   * @returns {Promise} Promise que resuelve con el resultado
   */
  addRequest(requestFn) {
    return new Promise((resolve, reject) => {
      this.queue.push({ requestFn, resolve, reject });
      this.processQueue();
    });
  }
  
  /**
   * Procesa la queue respetando rate limits
   */
  processQueue() {
    if (this.processing || this.queue.length === 0) return;
    
    this.processing = true;
    
    // Procesar queue en el siguiente tick para no bloquear
    setTimeout(() => {
      this.processQueueSync();
    }, 0);
  }
  
  processQueueSync() {
    while (this.queue.length > 0) {
      const { requestFn, resolve, reject } = this.queue.shift();
      
      // Asegurar intervalo mínimo entre requests
      const elapsed = Date.now() - this.lastRequest;
      if (elapsed < this.MIN_INTERVAL) {
        Utilities.sleep(this.MIN_INTERVAL - elapsed);
      }
      
      try {
        this.lastRequest = Date.now();
        const result = requestFn();
        resolve(result);
      } catch (error) {
        reject(error);
      }
    }
    
    this.processing = false;
  }
}

/**
 * Manager específico para operaciones de Jira
 * Extiende AtlassianApiBase con funcionalidades específicas
 */
class JiraApiManager extends AtlassianApiBase {
  constructor() {
    super();
    this.rateLimiter = new JiraRateLimiter();
  }
  
  /**
   * Busca issues usando JQL con paginación optimizada
   * @param {string} jql - Query JQL
   * @param {number} startAt - Índice de inicio
   * @param {number} maxResults - Máximo resultados por página
   * @returns {Object} Respuesta con issues y metadata
   */
  async searchIssues(jql, startAt = 0, maxResults = 50) {
    const fields = [
      'key', 'summary', 'status', 'assignee', 'priority',
      'issuetype', 'created', 'updated', 'reporter',
      'labels', 'description', 'components', 'project'
    ];
    
    const endpoint = `/rest/api/3/search?jql=${encodeURIComponent(jql)}&startAt=${startAt}&maxResults=${maxResults}&fields=${fields.join(',')}`;
    
    logEstructurado('INFO', 'Buscando issues en Jira', { 
      jql: jql.substring(0, 100) + (jql.length > 100 ? '...' : ''),
      startAt, 
      maxResults 
    });
    
    return this.rateLimiter.addRequest(() => {
      const response = this.makeRequest(endpoint);
      
      if (response.getResponseCode() !== 200) {
        throw new Error(`Error en búsqueda Jira: ${response.getResponseCode()} - ${response.getContentText()}`);
      }
      
      return JSON.parse(response.getContentText());
    });
  }
  
  /**
   * Obtiene todos los issues de un proyecto con paginación automática
   * @param {string} projectKey - Clave del proyecto
   * @param {Date} modifiedSince - Fecha desde la cual buscar cambios
   * @returns {Array} Array de issues
   */
  async getAllIssuesFromProject(projectKey, modifiedSince = null) {
    let jql = `project = ${projectKey} ORDER BY updated DESC`;
    
    if (modifiedSince) {
      const dateStr = modifiedSince.toISOString().split('T')[0];
      jql = `project = ${projectKey} AND updated >= "${dateStr}" ORDER BY updated DESC`;
    }
    
    const allIssues = [];
    let startAt = 0;
    const maxResults = 100; // Máximo permitido por Jira
    
    logEstructurado('INFO', `Iniciando descarga de issues del proyecto ${projectKey}`);
    
    while (true) {
      const result = await this.searchIssues(jql, startAt, maxResults);
      allIssues.push(...result.issues);
      
      logEstructurado('DEBUG', `Descargados ${allIssues.length}/${result.total} issues`);
      
      if (startAt + maxResults >= result.total) break;
      startAt += maxResults;
      
      // Progress log cada 500 issues
      if (allIssues.length % 500 === 0) {
        logEstructurado('INFO', `Progreso: ${allIssues.length}/${result.total} issues descargados`);
      }
      
      // Verificar timeout de Apps Script
      if (this.shouldBreakForTimeout()) {
        logEstructurado('WARN', 'Interrumpiendo por límite de tiempo de Apps Script', {
          descargados: allIssues.length,
          total: result.total
        });
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
  async updateIssue(issueKey, updateData) {
    const endpoint = `/rest/api/3/issue/${issueKey}`;
    
    logEstructurado('INFO', `Actualizando issue ${issueKey}`, { updateData });
    
    return this.rateLimiter.addRequest(() => {
      const response = this.makeRequest(endpoint, {
        method: 'PUT',
        payload: JSON.stringify(updateData)
      });
      
      if (response.getResponseCode() !== 204) {
        throw new Error(`Error actualizando issue ${issueKey}: ${response.getResponseCode()} - ${response.getContentText()}`);
      }
      
      logEstructurado('SUCCESS', `Issue ${issueKey} actualizado exitosamente`);
      return true;
    });
  }
  
  /**
   * Obtiene transiciones disponibles para un issue
   * @param {string} issueKey - Clave del issue
   * @returns {Array} Array de transiciones disponibles
   */
  async getIssueTransitions(issueKey) {
    const endpoint = `/rest/api/3/issue/${issueKey}/transitions`;
    
    return this.rateLimiter.addRequest(() => {
      const response = this.makeRequest(endpoint);
      
      if (response.getResponseCode() !== 200) {
        throw new Error(`Error obteniendo transiciones para ${issueKey}: ${response.getResponseCode()}`);
      }
      
      const data = JSON.parse(response.getContentText());
      return data.transitions;
    });
  }
  
  /**
   * Ejecuta una transición de estado en un issue
   * @param {string} issueKey - Clave del issue
   * @param {string} targetStatus - Estado objetivo
   * @returns {boolean} true si fue exitoso
   */
  async transitionIssueStatus(issueKey, targetStatus) {
    const transitions = await this.getIssueTransitions(issueKey);
    const targetTransition = transitions.find(t => t.to.name === targetStatus);
    
    if (!targetTransition) {
      throw new Error(`Transición a '${targetStatus}' no disponible para ${issueKey}. Disponibles: ${transitions.map(t => t.to.name).join(', ')}`);
    }
    
    const endpoint = `/rest/api/3/issue/${issueKey}/transitions`;
    const transitionData = {
      transition: { id: targetTransition.id }
    };
    
    logEstructurado('INFO', `Ejecutando transición ${issueKey}: ${targetTransition.name} → ${targetStatus}`);
    
    return this.rateLimiter.addRequest(() => {
      const response = this.makeRequest(endpoint, {
        method: 'POST',
        payload: JSON.stringify(transitionData)
      });
      
      if (response.getResponseCode() !== 204) {
        throw new Error(`Error ejecutando transición en ${issueKey}: ${response.getResponseCode()}`);
      }
      
      logEstructurado('SUCCESS', `Transición exitosa: ${issueKey} → ${targetStatus}`);
      return true;
    });
  }
  
  /**
   * Crea un nuevo issue en Jira
   * @param {Object} issueData - Datos del issue a crear
   * @returns {Object} Datos del issue creado
   */
  async createIssue(issueData) {
    const endpoint = '/rest/api/3/issue';
    
    // Validar datos de entrada
    const validatedData = validarDatosIssue(issueData);
    
    logEstructurado('INFO', 'Creando nuevo issue en Jira', { 
      project: validatedData.project,
      summary: validatedData.summary 
    });
    
    return this.rateLimiter.addRequest(() => {
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
    });
  }
  
  /**
   * Obtiene información del usuario actual
   * @returns {Object} Datos del usuario autenticado
   */
  async getCurrentUser() {
    const endpoint = '/rest/api/3/myself';
    
    return this.rateLimiter.addRequest(() => {
      const response = this.makeRequest(endpoint);
      
      if (response.getResponseCode() !== 200) {
        throw new Error(`Error obteniendo usuario actual: ${response.getResponseCode()}`);
      }
      
      return JSON.parse(response.getContentText());
    });
  }
  
  /**
   * Verifica si debe interrumpir por timeout de Apps Script
   * @returns {boolean} true si se acerca al límite de tiempo
   */
  shouldBreakForTimeout() {
    const tiempoEjecucion = Date.now() - (PropertiesService.getScriptProperties().getProperty('EXECUTION_START') || Date.now());
    return tiempoEjecucion > APPS_SCRIPT_LIMITS.EXECUTION_BUFFER_MS;
  }
}

/**
 * Función de rate limiting inteligente por endpoint
 * Patrón obligatorio de CLAUDE.md
 * @param {string} endpoint - Endpoint para aplicar rate limiting
 */
function aplicarRateLimit(endpoint) {
  const ahora = Date.now();
  const ultimaLlamada = PropertiesService.getScriptProperties()
    .getProperty(`LAST_CALL_${endpoint}`) || '0';
  
  const tiempoTranscurrido = ahora - parseInt(ultimaLlamada);
  const delayMinimo = RATE_LIMITS.MIN_REQUEST_INTERVAL_MS;
  
  if (tiempoTranscurrido < delayMinimo) {
    const espera = delayMinimo - tiempoTranscurrido;
    Utilities.sleep(espera);
  }
  
  PropertiesService.getScriptProperties()
    .setProperty(`LAST_CALL_${endpoint}`, ahora.toString());
}

/**
 * Realizar request con rate limiting y exponential backoff
 * Patrón obligatorio de CLAUDE.md con jitter
 * @param {string} url - URL completa del request
 * @param {Object} opciones - Opciones de UrlFetchApp
 * @param {number} maxReintentos - Máximo número de reintentos
 * @returns {Object} Respuesta de UrlFetchApp
 */
function realizarRequestConRateLimit(url, opciones, maxReintentos = 3) {
  const metrics = new MetricsCollector();
  const tiempoInicio = Date.now();
  
  for (let intento = 1; intento <= maxReintentos; intento++) {
    try {
      const respuesta = UrlFetchApp.fetch(url, {
        ...opciones,
        muteHttpExceptions: true
      });
      
      const codigoRespuesta = respuesta.getResponseCode();
      
      // Rate limit detectado - aplicar exponential backoff con jitter
      if (codigoRespuesta === 429) {
        const delayBase = RATE_LIMITS.EXPONENTIAL_BACKOFF_BASE ** (intento - 1) * 1000;
        const jitter = Math.random() * 1000;
        const delayTotal = Math.min(delayBase + jitter, RATE_LIMITS.MAX_BACKOFF_MS);
        
        logEstructurado('WARN', `Rate limit detectado, esperando ${delayTotal}ms`, { 
          intento, 
          url: url.substring(0, 100) 
        });
        
        Utilities.sleep(delayTotal);
        continue;
      }
      
      // Success codes
      if (codigoRespuesta >= 200 && codigoRespuesta < 300) {
        metrics.recordTiming('api_request', Date.now() - tiempoInicio);
        return respuesta;
      }
      
      // Client errors - no reintentar
      if (codigoRespuesta >= 400 && codigoRespuesta < 500) {
        metrics.recordError('client_error', { 
          codigo: codigoRespuesta, 
          url: url.substring(0, 100) 
        });
        throw new Error(`Client Error ${codigoRespuesta}: ${respuesta.getContentText()}`);
      }
      
      // Server errors - reintentar con delay
      if (codigoRespuesta >= 500 && intento < maxReintentos) {
        const delay = 1000 * intento;
        logEstructurado('WARN', `Server Error ${codigoRespuesta}, reintentando en ${delay}ms`, { 
          intento, url: url.substring(0, 100) 
        });
        Utilities.sleep(delay);
        continue;
      }
      
      // Error final
      metrics.recordError('server_error', { 
        codigo: codigoRespuesta,
        intentos: intento 
      });
      throw new Error(`HTTP ${codigoRespuesta}: ${respuesta.getContentText()}`);
      
    } catch (error) {
      if (intento === maxReintentos) {
        metrics.recordError('request_failed', { 
          error: error.message,
          intentos: intento 
        });
        throw error;
      }
      logEstructurado('WARN', `Intento ${intento} falló: ${error.toString()}`);
    }
  }
}