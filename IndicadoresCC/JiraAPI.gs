// =====================================
// GESTIÓN DE API DE JIRA
// Archivo: JiraAPI.gs
// Versión: 7.1 - Paginación robusta y manejo de errores mejorado
// =====================================

const JiraAPI = {
  /**
   * Realiza una solicitud a la API de Jira y maneja la autenticación y errores.
   * @param {string} url - La URL completa del endpoint de la API.
   * @returns {Object} El objeto JSON de la respuesta.
   * @private
   */
  _fetch(url) {
    const options = {
      method: "get",
      headers: {
        "Authorization": "Basic " + Utilities.base64Encode(CONFIG_JIRA.email + ":" + CONFIG_JIRA.apiToken)
      },
      muteHttpExceptions: true // Esencial para capturar y personalizar mensajes de error
    };

    const response = UrlFetchApp.fetch(url, options);
    const responseCode = response.getResponseCode();
    const responseBody = response.getContentText();

    if (responseCode === 200) {
      return JSON.parse(responseBody);
    } else {
      // Proporciona un error más detallado
      throw new Error(`Error en la API de Jira (${responseCode}): ${responseBody}`);
    }
  },

  /**
   * Obtiene TODOS los sprints de TODOS los tableros en la instancia de Jira.
   * Maneja la paginación tanto para tableros como para sprints.
   * @returns {Array<Object>} Un array con todos los objetos de sprint encontrados.
   */
  obtenerTodosLosSprintsDeInstancia() {
    Logger.log("🔄 Obteniendo todos los sprints de la instancia de Jira...");
    const todosLosSprints = new Map(); // Usar un Map para evitar duplicados por ID
    let startAtBoards = 0;
    let isLastBoard = false;

    // 1. Iterar sobre todos los tableros (boards)
    do {
      const boardsUrl = `https://${CONFIG_JIRA.dominio}/rest/agile/1.0/board?maxResults=50&startAt=${startAtBoards}`;
      const boardsJson = this._fetch(boardsUrl);
      
      if (boardsJson.values && boardsJson.values.length > 0) {
        Logger.log(`🔎 Encontrados ${boardsJson.values.length} tableros...`);
        
        // 2. Para cada tablero, obtener sus sprints
        for (const tablero of boardsJson.values) {
          let startAtSprints = 0;
          let isLastSprint = false;
          do {
            const sprintsUrl = `https://${CONFIG_JIRA.dominio}/rest/agile/1.0/board/${tablero.id}/sprint?maxResults=50&startAt=${startAtSprints}`;
            try {
              const sprintsJson = this._fetch(sprintsUrl);
              if (sprintsJson.values) {
                sprintsJson.values.forEach(sprint => todosLosSprints.set(sprint.id, sprint));
              }
              isLastSprint = sprintsJson.isLast;
              startAtSprints = sprintsJson.startAt + sprintsJson.maxResults;
            } catch (e) {
              // Si un tablero no tiene sprints o da error, lo ignoramos y continuamos
              Logger.log(`⚠️ No se pudieron obtener sprints para el tablero ${tablero.name} (ID: ${tablero.id}). Error: ${e.message}`);
              isLastSprint = true; // Salir del bucle para este tablero
            }
          } while (!isLastSprint);
        }
      }
      
      isLastBoard = boardsJson.isLast;
      startAtBoards = boardsJson.startAt + boardsJson.maxResults;

    } while (!isLastBoard);
    
    const sprintsArray = Array.from(todosLosSprints.values());
    Logger.log(`✅ Total de ${sprintsArray.length} sprints únicos encontrados en la instancia.`);
    return sprintsArray;
  },

  /**
   * Obtiene todas las tareas que pertenecen a una lista de IDs de sprint.
   * @param {string[]} sprintIds - Un array de IDs de los sprints a consultar.
   * @returns {Array<Object>} Un array con todos los objetos de tarea encontrados.
   */
  obtenerTareasDeSprints(sprintIds) {
    if (!sprintIds || sprintIds.length === 0) {
      Logger.log("⚠️ No se proporcionaron IDs de sprint para buscar tareas.");
      return [];
    }
  
    Logger.log(`🔄 Obteniendo tareas para ${sprintIds.length} sprint(s)...`);
    const todasLasTareas = [];
    const jql = `sprint IN (${sprintIds.join(',')}) ORDER BY project, status`;
    
    // Lista completa de campos necesarios para el análisis.
    const camposCompletos = Object.values(CAMPOS_ENTREGABLES).filter(Boolean).join(',');
    
    let startAt = 0;
    let isLast = false;

    do {
      const url = `https://${CONFIG_JIRA.dominio}/rest/api/3/search?jql=${encodeURIComponent(jql)}&fields=${camposCompletos}&maxResults=100&startAt=${startAt}`;
      const json = this._fetch(url);
      
      if (json.issues) {
        todasLasTareas.push(...json.issues);
      }
      
      const totalFetched = json.startAt + json.maxResults;
      isLast = totalFetched >= json.total;
      startAt = totalFetched;

    } while (!isLast);

    Logger.log(`✅ Encontradas ${todasLasTareas.length} tareas en los sprints seleccionados.`);
    return todasLasTareas;
  }
};

// --- VERIFICACIÓN DE CARGA ---
try {
  if (typeof Logger !== 'undefined') {
    Logger.log("✅ JiraAPI.gs cargado - Módulo de comunicación con Jira listo.");
  }
} catch (e) {