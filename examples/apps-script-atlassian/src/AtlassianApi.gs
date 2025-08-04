/**
 * @file AtlassianApi.gs
 * @description Wrappers especializados y robustos para las APIs de Atlassian (Jira y Confluence).
 * @version 3.0.0
 * @license MIT
 *
 * @summary
 * Este script proporciona un conjunto de clases y utilidades para interactuar con las APIs REST
 * de Jira (v3) y Confluence (v2) desde Google Apps Script.
 * Incluye manejo avanzado de autenticación, reintentos automáticos con exponential backoff,
 * paginación, métricas y logging estructurado.
 */

// =============================================
// CONSTANTES Y CONFIGURACIÓN
// =============================================

const JIRA_API_BASE_PATH = '/rest/api/3';
const CONFLUENCE_API_BASE_PATH = '/rest/api/2';

// =============================================
// CLASE BASE PARA APIS DE ATLASSIAN
// =============================================

/**
 * Clase base para la interacción con las APIs de Atlassian.
 * Maneja la configuración, autenticación, reintentos y la lógica de requests.
 */
class AtlassianApiBase {
  /**
   * @param {string} apiBasePath - La ruta base para la API específica (ej. '/rest/api/3').
   */
  constructor(apiBasePath) {
    const config = obtenerConfiguracion(); // Asume que esta función existe en otro archivo (Config.gs).
    this.domain = config.atlassian.domain;
    this.email = config.atlassian.email;
    this.apiToken = config.atlassian.apiToken;
    this.baseUrl = `https://${this.domain}`;
    this.apiBaseUrl = `${this.baseUrl}${apiBasePath}`;
    this.maxRetries = config.app.maxRetries || 3;

    // Asume que estas clases de utilidad existen en otro archivo (Utils.gs).
    this.metrics = new MetricsCollector();
    this.quotaManager = new QuotaManager();

    this._validarConfiguracion();
  }

  /**
   * Valida que la configuración esencial de Atlassian esté presente.
   * @private
   * @throws {Error} Si falta alguna credencial.
   */
  _validarConfiguracion() {
    if (!this.domain || !this.email || !this.apiToken) {
      throw new Error('Configuración de Atlassian incompleta. Verifique domain, email y apiToken en PropertiesService.');
    }
  }

  /**
   * Construye los encabezados de autenticación estándar para las APIs de Atlassian.
   * @returns {Object} Un objeto con los encabezados HTTP.
   */
  getAuthHeaders() {
    const authString = Utilities.base64Encode(`${this.email}:${this.apiToken}`);
    return {
      'Authorization': `Basic ${authString}`,
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'User-Agent': 'GoogleAppsScript-AtlassianIntegration/3.0',
    };
  }

  /**
   * Realiza una solicitud a la API de Atlassian con manejo completo de errores y reintentos.
   * @param {string} endpoint - El endpoint relativo de la API (ej. '/project').
   * @param {GoogleAppsScript.URL_Fetch.URLFetchRequestOptions} [opciones={}] - Opciones para UrlFetchApp.
   * @returns {GoogleAppsScript.URL_Fetch.HTTPResponse} La respuesta de la API.
   */
  makeRequest(endpoint, opciones = {}) {
    const url = `${this.apiBaseUrl}${endpoint}`;
    const startTime = Date.now();

    try {
      this.quotaManager.consume(); // Asume que QuotaManager maneja el rate limiting.

      const requestOptions = {
        method: 'GET',
        headers: this.getAuthHeaders(),
        muteHttpExceptions: true,
        ...opciones,
      };

      logEstructurado('DEBUG', 'Realizando request a Atlassian API', {
        url: url,
        method: requestOptions.method,
      });

      // Asume que esta función existe y maneja la lógica de reintentos (Utils.gs).
      const respuesta = realizarRequestConRateLimit(url, requestOptions, this.maxRetries);
      const responseCode = respuesta.getResponseCode();
      const duration = Date.now() - startTime;

      this.metrics.recordTiming('atlassian.api.request', duration, { endpoint });
      this.metrics.incrementCounter(`atlassian.api.status_code.${String(responseCode)[0]}xx`);

      return respuesta;

    } catch (error) {
      this.metrics.incrementCounter('atlassian.api.error.fatal');
      logEstructurado('ERROR', 'Error fatal en request a Atlassian API', {
        endpoint: endpoint,
        error: error.message,
        stack: error.stack,
      });
      throw error;
    }
  }

  /**
   * Realiza una solicitud y parsea la respuesta JSON automáticamente, manejando errores.
   * @param {string} endpoint - El endpoint de la API.
   * @param {GoogleAppsScript.URL_Fetch.URLFetchRequestOptions} [opciones={}] - Opciones de la solicitud.
   * @returns {Object | null} Los datos parseados de la respuesta JSON, o null si no hay contenido.
   * @throws {Error} Si la solicitud falla o el JSON es inválido.
   */
  makeJsonRequest(endpoint, opciones = {}) {
    const respuesta = this.makeRequest(endpoint, opciones);
    const responseCode = respuesta.getResponseCode();
    const content = respuesta.getContentText();

    if (responseCode >= 400) {
      let errorMessage = `Error de API [${responseCode}] en ${endpoint}`;
      try {
        const errorJson = JSON.parse(content);
        const messages = errorJson.errorMessages || (errorJson.errors ? Object.values(errorJson.errors) : []);
        if (messages.length > 0) {
          errorMessage += `: ${messages.join(', ')}`;
        }
      } catch (e) {
        errorMessage += `: ${content.substring(0, 200)}`;
      }
      throw new Error(errorMessage);
    }

    if (!content) {
      return null;
    }

    try {
      return JSON.parse(content);
    } catch (error) {
      logEstructurado('ERROR', 'Error parseando respuesta JSON', {
        endpoint: endpoint,
        error: error.message,
        responsePreview: content.substring(0, 200),
      });
      throw new Error(`Fallo al parsear JSON desde ${endpoint}: ${error.message}`);
    }
  }

  /**
   * Realiza solicitudes paginadas y acumula todos los resultados.
   * @param {string} endpoint - El endpoint base que soporta paginación.
   * @param {Object} [queryParams={}] - Parámetros de consulta iniciales.
   * @param {number} [totalMaxResults=1000] - Límite máximo de resultados a obtener.
   * @returns {Array} Un array con todos los resultados acumulados.
   */
  makePagedRequest(endpoint, queryParams = {}, totalMaxResults = 1000) {
    const allResults = [];
    let startAt = 0;
    const maxResultsPerPage = 100;

    while (allResults.length < totalMaxResults) {
      const params = new URLSearchParams({
        ...queryParams,
        startAt: startAt,
        maxResults: maxResultsPerPage,
      });
      const paginatedEndpoint = `${endpoint}?${params.toString()}`;

      const response = this.makeJsonRequest(paginatedEndpoint);
      if (!response) break;

      const items = response.values || response.results || response.issues || [];
      if (items.length === 0) break;
      
      allResults.push(...items);

      const totalAvailable = response.total || response.size || (startAt + items.length + 1);
      startAt += items.length;

      if (startAt >= totalAvailable || items.length < maxResultsPerPage) break;
    }

    logEstructurado('INFO', 'Paginación completada', {
      endpoint: endpoint,
      totalResultados: allResults.length,
    });

    return allResults.slice(0, totalMaxResults);
  }
}

// =============================================
// CLASE ESPECIALIZADA PARA JIRA API
// =============================================

/**
 * Clase especializada para interactuar con la API REST de Jira (v3).
 */
class JiraApi extends AtlassianApiBase {
  constructor() {
    super(JIRA_API_BASE_PATH);
  }

  /**
   * Crea un nuevo issue en Jira.
   * @param {Object} issueData - Datos del issue (project, summary, issuetype, description, etc.).
   * @returns {Object} El issue creado.
   */
  createIssue(issueData) {
    validarDatosIssue(issueData); // Asume que esta función de validación existe en Utils.gs.

    const payload = {
      fields: {
        project: { key: issueData.project },
        summary: issueData.summary,
        issuetype: { name: issueData.issuetype },
        ...issueData.extraFields,
      },
    };

    if (issueData.description) {
      payload.fields.description = _createAtlassianDocument(issueData.description);
    }
    if (issueData.assignee) {
      payload.fields.assignee = { accountId: issueData.assignee };
    }

    logEstructurado('INFO', 'Creando nuevo issue en Jira', { project: issueData.project });
    const result = this.makeJsonRequest('/issue', {
      method: 'POST',
      payload: JSON.stringify(payload),
    });

    this.metrics.incrementCounter('jira.issues.created');
    return result;
  }
  
  /**
   * Obtiene un issue específico por su clave.
   * @param {string} issueKey - La clave del issue (ej. 'PROJ-123').
   * @returns {Object} Los datos del issue.
   */
  getIssue(issueKey) {
    if (!issueKey) throw new Error('El issueKey es requerido.');
    logEstructurado('DEBUG', 'Obteniendo issue', { issueKey });
    return this.makeJsonRequest(`/issue/${issueKey}`);
  }

  /**
   * Actualiza un issue existente.
   * @param {string} issueKey - La clave del issue.
   * @param {Object} updateData - Un objeto con los campos a actualizar.
   */
  updateIssue(issueKey, updateData) {
    if (!issueKey) throw new Error('El issueKey es requerido.');
    
    const payload = { fields: updateData };
    logEstructurado('INFO', 'Actualizando issue', { issueKey });
    this.makeRequest(`/issue/${issueKey}`, {
      method: 'PUT',
      payload: JSON.stringify(payload),
    });
    this.metrics.incrementCounter('jira.issues.updated');
  }

  /**
   * Busca issues usando JQL (Jira Query Language) con paginación automática.
   * @param {string} jql - La consulta JQL.
   * @param {number} [totalMaxResults=1000] - Máximo total de issues a devolver.
   * @returns {Array} Un array con todos los issues encontrados.
   */
  searchIssues(jql, totalMaxResults = 1000) {
    if (!jql) throw new Error('La consulta JQL es requerida.');

    logEstructurado('INFO', 'Ejecutando búsqueda JQL con paginación', { jql });
    const results = this.makePagedRequest('/search', { jql }, totalMaxResults);

    this.metrics.incrementCounter('jira.searches.executed');
    return results;
  }

  /**
   * Agrega un comentario a un issue existente.
   * @param {string} issueKey - La clave del issue.
   * @param {string} commentBody - El texto del comentario.
   * @returns {Object} El comentario creado.
   */
  addComment(issueKey, commentBody) {
    if (!issueKey || !commentBody) throw new Error('issueKey y commentBody son requeridos.');

    const payload = { body: _createAtlassianDocument(commentBody) };

    logEstructurado('INFO', 'Agregando comentario a issue', { issueKey });
    const result = this.makeJsonRequest(`/issue/${issueKey}/comment`, {
      method: 'POST',
      payload: JSON.stringify(payload),
    });

    this.metrics.incrementCounter('jira.comments.added');
    return result;
  }
  
  /**
   * Obtiene las transiciones de workflow disponibles para un issue.
   * @param {string} issueKey - La clave del issue.
   * @returns {Array} Un array de objetos de transición disponibles.
   */
  getAvailableTransitions(issueKey) {
    if (!issueKey) throw new Error('El issueKey es requerido.');
    logEstructurado('DEBUG', 'Obteniendo transiciones disponibles', { issueKey });
    const response = this.makeJsonRequest(`/issue/${issueKey}/transitions`);
    return response.transitions || [];
  }

  /**
   * Transiciona un issue a un nuevo estado.
   * @param {string} issueKey - La clave del issue.
   * @param {string} transitionId - El ID de la transición a ejecutar.
   */
  transitionIssue(issueKey, transitionId) {
    if (!issueKey || !transitionId) throw new Error('issueKey y transitionId son requeridos.');
    
    const payload = { transition: { id: transitionId } };
    logEstructurado('INFO', 'Transicionando issue', { issueKey, transitionId });
    this.makeRequest(`/issue/${issueKey}/transitions`, {
      method: 'POST',
      payload: JSON.stringify(payload),
    });
    this.metrics.incrementCounter('jira.issues.transitioned');
  }
}

// =============================================
// CLASE ESPECIALIZADA PARA CONFLUENCE API
// =============================================

/**
 * Clase especializada para interactuar con la API REST de Confluence (v2).
 */
class ConfluenceApi extends AtlassianApiBase {
  constructor() {
    super(CONFLUENCE_API_BASE_PATH);
  }

  /**
   * Crea una nueva página en Confluence.
   * @param {Object} pageData - Datos de la página (title, spaceKey, content, parentId).
   * @returns {Object} La página creada.
   */
  createPage(pageData) {
    const { title, spaceKey, content, parentId } = pageData;
    if (!title || !spaceKey || !content) {
      throw new Error('title, spaceKey y content son requeridos.');
    }

    const payload = {
      spaceId: this.getSpaceId(spaceKey),
      status: 'current',
      title: title,
      parentId: parentId,
      body: {
        representation: 'storage', // Formato de almacenamiento de Confluence
        value: content,
      },
    };

    logEstructurado('INFO', 'Creando nueva página en Confluence', { title, spaceKey });
    const result = this.makeJsonRequest('/pages', {
      method: 'POST',
      payload: JSON.stringify(payload),
    });

    this.metrics.incrementCounter('confluence.pages.created');
    return result;
  }
  
  /**
   * Actualiza una página existente.
   * @param {string} pageId - El ID de la página a actualizar.
   * @param {string} newTitle - El nuevo título de la página.
   * @param {string} newContent - El nuevo contenido en formato de almacenamiento.
   * @param {number} newVersionNumber - El número de la nueva versión (actual + 1).
   * @returns {Object} La página actualizada.
   */
  updatePage(pageId, newTitle, newContent, newVersionNumber) {
    if (!pageId || !newTitle || !newContent || !newVersionNumber) {
      throw new Error("pageId, newTitle, newContent y newVersionNumber son requeridos.");
    }
    
    const payload = {
      id: pageId,
      status: 'current',
      title: newTitle,
      body: {
        representation: 'storage',
        value: newContent,
      },
      version: {
        number: newVersionNumber,
      }
    };
    
    logEstructurado('INFO', 'Actualizando página en Confluence', { pageId, newVersionNumber });
    const result = this.makeJsonRequest(`/pages/${pageId}`, {
      method: 'PUT',
      payload: JSON.stringify(payload)
    });
    
    this.metrics.incrementCounter('confluence.pages.updated');
    return result;
  }

  /**
   * Obtiene el ID numérico de un espacio a partir de su clave.
   * @param {string} spaceKey - La clave del espacio (ej. 'DOC').
   * @returns {string} El ID numérico del espacio.
   */
  getSpaceId(spaceKey) {
    const response = this.makeJsonRequest(`/spaces?keys=${spaceKey}`);
    if (!response.results || response.results.length === 0) {
      throw new Error(`No se pudo encontrar el espacio con la clave: ${spaceKey}`);
    }
    return response.results[0].id;
  }
}

// =============================================
// FUNCIONES DE UTILIDAD
// =============================================

/**
 * Crea un objeto de documento en el formato estándar de Atlassian.
 * @param {string} textContent - El texto plano a convertir.
 * @returns {Object} Un objeto compatible con el Atlassian Document Format.
 * @private
 */
function _createAtlassianDocument(textContent) {
  return {
    type: 'doc',
    version: 1,
    content: [{
      type: 'paragraph',
      content: [{ type: 'text', text: textContent }],
    }],
  };
}

/**
 * Registra un mensaje de log estructurado.
 * @param {'DEBUG'|'INFO'|'WARN'|'ERROR'|'SUCCESS'} level - El nivel del log.
 * @param {string} message - El mensaje principal.
 * @param {Object} [data={}] - Datos adicionales para el contexto.
 */
function logEstructurado(level, message, data = {}) {
  const logEntry = {
    timestamp: new Date().toISOString(),
    level: level,
    message: message,
    ...data,
  };
  console.log(JSON.stringify(logEntry));
}

/**
 * Función de fábrica para obtener una instancia de una API de Atlassian.
 * @param {'jira' | 'confluence'} type - El tipo de API deseado.
 * @returns {JiraApi | ConfluenceApi} Una instancia de la clase de API correspondiente.
 */
function crearApiAtlassian(type) {
  switch (type.toLowerCase()) {
    case 'jira':
      return new JiraApi();
    case 'confluence':
      return new ConfluenceApi();
    default:
      throw new Error(`Tipo de API no soportado: ${type}. Use 'jira' o 'confluence'.`);
  }
}

/**
 * Realiza un test de conectividad completo para validar credenciales y acceso.
 */
function testConectividadAtlassian() {
  logEstructurado('INFO', 'Iniciando test de conectividad con Atlassian...');
  try {
    const jiraApi = crearApiAtlassian('jira');
    const user = jiraApi.makeJsonRequest('/myself');
    logEstructurado('SUCCESS', 'Conectividad con Jira exitosa.', { user: user.displayName });
    
    const confluenceApi = crearApiAtlassian('confluence');
    const spaces = confluenceApi.makePagedRequest('/spaces', {}, 1);
    logEstructurado('SUCCESS', 'Conectividad con Confluence exitosa.', { spacesFound: spaces.length });
    
    return true;
  } catch(e) {
    logEstructurado('ERROR', 'Test de conectividad falló.', { error: e.message });
    return false;
  }
}

/**
 * Obtiene un resumen de las capacidades de las APIs disponibles.
 * @returns {Object} Un objeto con el estado y capacidades de cada API.
 */
function obtenerCapacidadesAtlassian() {
  const capacidades = {
    jira: { disponible: false, error: null },
    confluence: { disponible: false, error: null }
  };
  
  try {
    crearApiAtlassian('jira').makeJsonRequest('/myself');
    capacidades.jira.disponible = true;
  } catch (e) {
    capacidades.jira.error = e.message;
  }
  
  try {
    crearApiAtlassian('confluence').makePagedRequest('/spaces', {}, 1);
    capacidades.confluence.disponible = true;
  } catch (e) {
    capacidades.confluence.error = e.message;
  }
  
  return capacidades;
}