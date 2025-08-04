// =====================================
// ARCHIVO 2: JIRA API
// =====================================

/**
 * Realiza una petición genérica a la API de Jira con manejo de errores y paginación.
 * @param {string} endpoint - El endpoint de la API a consultar (ej. '/rest/api/3/search').
 * @param {Object} params - Parámetros para la URL.
 * @returns {Array} Un array con todos los resultados de la paginación.
 */
function fetchJiraAPI(endpoint, params = {}, method = 'get', payload = null) {
  const CONFIG_JIRA = obtenerConfigJira();
  const options = {
    method: method,
    headers: { 
      "Authorization": "Basic " + Utilities.base64Encode(CONFIG_JIRA.email + ":" + CONFIG_JIRA.apiToken),
      "Content-Type": "application/json"
    },
    muteHttpExceptions: true
  };

  if (payload) {
    options.payload = JSON.stringify(payload);
  }

  let allResults = [];
  let startAt = 0;
  let maxResults = 100;
  let isLast = false;

  const queryParams = new URLSearchParams(params);

  do {
    if (method === 'get') {
      queryParams.set('startAt', startAt);
      queryParams.set('maxResults', maxResults);
    }
    let url = `https://${CONFIG_JIRA.dominio}${endpoint}?${queryParams.toString()}`;

    const response = UrlFetchApp.fetch(url, options);
    const responseCode = response.getResponseCode();
    const contentText = response.getContentText();

    if (responseCode >= 300) {
      throw new Error(`Error en la API de Jira (${responseCode}): ${contentText}`);
    }

    if (method !== 'get') {
      return JSON.parse(contentText || '{}');
    }

    const json = JSON.parse(contentText);
    const values = json.issues || json.values || [];
    allResults.push(...values);

    if (json.isLast === true || (json.startAt + json.maxResults >= json.total)) {
      isLast = true;
    } else {
      startAt += maxResults;
    }

  } while (!isLast);

  return allResults;
}

/**
 * Obtiene todos los proyectos de Jira, usando la caché.
 * @returns {Object[]} Un array con todos los proyectos.
 */
function obtenerTodosLosProyectos() {
  const cache = CacheService.getScriptCache();
  const cacheKey = 'JIRA_TODOS_LOS_PROYECTOS';
  const cached = cache.get(cacheKey);
  if (cached) {
    return JSON.parse(cached);
  }
  
  const proyectos = fetchJiraAPI('/rest/api/3/project/search', { expand: 'issueTypes' });
  cache.put(cacheKey, JSON.stringify(proyectos), CONSTANTES.CACHE_EXPIRATION_SECONDS);
  Logger.log(`✅ ${proyectos.length} proyectos de Jira obtenidos y cacheados.`);
  return proyectos;
}

/**
 * Obtiene todos los sprints de todos los tableros.
 * @returns {Object[]} Un array con todos los sprints.
 */
function obtenerTodosLosSprints() {
  const cache = CacheService.getScriptCache();
  const cacheKey = 'JIRA_TODOS_LOS_SPRINTS';
  const cached = cache.get(cacheKey);
  if (cached) {
    return JSON.parse(cached);
  }

  const boards = fetchJiraAPI('/rest/agile/1.0/board');
  let allSprints = [];
  boards.forEach(board => {
    try {
      const sprintsDeTablero = fetchJiraAPI(`/rest/agile/1.0/board/${board.id}/sprint`);
      allSprints.push(...sprintsDeTablero);
    } catch (e) {
      Logger.log(`No se pudieron obtener sprints para el tablero ${board.name} (ID: ${board.id}). Error: ${e.message}`);
    }
  });

  const sprintsUnicos = [...new Map(allSprints.map(item => [item.id, item])).values()];
  cache.put(cacheKey, JSON.stringify(sprintsUnicos), CONSTANTES.CACHE_EXPIRATION_SECONDS);
  Logger.log(`✅ ${sprintsUnicos.length} sprints únicos obtenidos y cacheados.`);
  return sprintsUnicos;
}
