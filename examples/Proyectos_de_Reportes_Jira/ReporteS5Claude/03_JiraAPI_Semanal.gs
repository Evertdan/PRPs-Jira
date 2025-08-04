// =====================================
// ARCHIVO REFACTORIZADO: 03_JiraAPI_Semanal.gs
// ENFOQUE: 100% WORKLOG
// =====================================

/**
 * ✅ REFACTORIZADO: Obtiene issues de Jira optimizado para reportes basados en worklog
 * @param {Object} opciones - Opciones de consulta
 * @returns {Promise<Object[]>} Array de issues con análisis de worklog
 */
async function obtenerIssuesSemanalesDeJira(opciones = {}) {
  try {
    Logger.log(' [WORKLOG] Iniciando obtención de issues para reportes de worklog...');
    
    const config = obtenerConfigJiraSemanal();
    
    // ✅ Intentar recuperar del caché primero
    const claveCache = CacheManagerSemanal.generarClave(
      CONFIG_CACHE_SEMANAL.PREFIX_ISSUES, 
      `worklog_${config.dominio}_${JSON.stringify(opciones)}`
    );
    
    if (!opciones.forzarActualizacion) {
      const issuesEnCache = CacheManagerSemanal.recuperar(claveCache);
      if (issuesEnCache && Array.isArray(issuesEnCache) && issuesEnCache.length > 0) {
        Logger.log(`✅ [WORKLOG] Issues recuperados del caché: ${issuesEnCache.length} issues`);
        return issuesEnCache;
      }
    }
    
    Logger.log(' [WORKLOG] Obteniendo issues frescos de la API de Jira...');
    
    // ✅ Construir JQL específico para reportes de worklog
    const jql = construirJQLParaReportesWorklog(opciones);
    
    // ✅ Validar JQL antes de ejecutar
    const validacionJQL = ValidadorJQLSemanal.validarJQL(jql);
    if (!validacionJQL.isValid) {
      throw new Error(`JQL inválida: ${validacionJQL.mensaje}`);
    }
    
    Logger.log(` [WORKLOG] JQL construida: ${jql}`);
    
    const issues = await ErrorManagerSemanal.ejecutarConReintentos(
      function() { return ejecutarConsultaJiraSemanal(jql, config); },
      'Obtener issues con worklog de Jira',
      3
    );
    
    if (!issues || !Array.isArray(issues)) {
      throw new Error(`Se esperaba un array de issues, pero se recibió: ${typeof issues}.`);
    }
    
    Logger.log(` [WORKLOG] Issues obtenidos de API: ${issues.length} issues`);
    
    const issuesProcessed = procesarIssuesParaAnalisisWorklog(issues, opciones);
    
    if (!Array.isArray(issuesProcessed)) {
      throw new Error(`El procesamiento de issues falló. Se esperaba array, se recibió: ${typeof issuesProcessed}`);
    }
    
    CacheManagerSemanal.almacenar(claveCache, issuesProcessed, CONFIG_CACHE_SEMANAL.TTL_ISSUES_SEMANALES);
    
    Logger.log(`✅ [WORKLOG] Registros de trabajo obtenidos y procesados: ${issuesProcessed.length}`);
    return issuesProcessed;
    
  } catch (error) {
    const errorId = ErrorManagerSemanal.registrarError(
      'Error crítico obteniendo issues con worklog',
      error,
      'API_JIRA_WORKLOG',
      'CRITICAL'
    );
    
    throw new Error(`❌ [WORKLOG] No se pudieron obtener los issues: ${error.message} (Error ID: ${errorId})`);
  }
}

/**
 * ✅ REFACTORIZADO: Construye JQL para reportes basados en worklog
 * @param {Object} opciones - Opciones de filtrado
 * @returns {string} Consulta JQL optimizada para worklog
 */
function construirJQLParaReportesWorklog(opciones = {}) {
  let condiciones = [];

  // ✅ Filtro por sprint si se proporciona
  if (opciones.sprintId) {
    condiciones.push(`sprint = ${opciones.sprintId}`);
  } else {
    // ✅ Filtro principal por fechas de worklog
    const fechaInicio = opciones.fechaInicio || new Date(new Date().setDate(new Date().getDate() - 30)); // Por defecto, últimos 30 días
    const fechaFin = opciones.fechaFin || new Date();
    
    condiciones.push(`worklogDate >= "${formatearFechaParaJQL(fechaInicio)}"`);
    condiciones.push(`worklogDate <= "${formatearFechaParaJQL(fechaFin)}"`);
  }

  // ✅ Filtro por proyecto específico si se requiere
  if (opciones.proyecto) {
    condiciones.push(`project = "${opciones.proyecto}"`);
  }

  // ✅ CORREGIDO: Filtro dinámico por autor(es)
  if (opciones.accountId) {
    // Si se especifica una persona, filtrar solo por ella
    condiciones.push(`worklogAuthor = "${opciones.accountId}"`);
  } else {
    // Si no, filtrar por todo el equipo
    const autores = EQUIPO_CCSOFT.map(p => `"${p.accountId}"`).join(',');
    condiciones.push(`worklogAuthor in (${autores})`);
  }

  // ✅ Ordenamiento optimizado
  const jql = condiciones.join(' AND ') + ' ORDER BY updated DESC';
  
  return jql;
}

/**
 * ✅ PROCESAMIENTO MEJORADO compatible con MCP
 */
function procesarIssuesParaAnalisisWorklog(issues) {
  const registrosWorklog = [];
  
  issues.forEach(issue => {
    // ✅ Verificar si el issue tiene worklogs
    if (!issue.fields.worklog || !issue.fields.worklog.worklogs) {
      return;
    }
    
    issue.fields.worklog.worklogs.forEach(worklog => {
      registrosWorklog.push({
        // ✅ Datos del issue
        issueKey: issue.key,
        issueSummary: issue.fields.summary,
        issueType: issue.fields.issuetype?.name || 'Desconocido',
        issueStatus: issue.fields.status?.name || 'Desconocido',
        
        // ✅ Datos del proyecto
        projectKey: issue.fields.project?.key || 'Desconocido',
        projectName: issue.fields.project?.name || 'Desconocido',
        
        // ✅ Datos del worklog
        worklogId: worklog.id,
        worklogAuthor: worklog.author.displayName,
        worklogAuthorEmail: worklog.author.emailAddress,
        worklogAuthorAccountId: worklog.author.accountId,
        worklogDate: new Date(worklog.started),
        timeSpentSeconds: worklog.timeSpentSeconds,
        timeSpentHours: Math.round((worklog.timeSpentSeconds / 3600) * 100) / 100,
        worklogComment: worklog.comment || '',
        
        // ✅ Información adicional del issue
        issuePadre: issue.fields.parent?.key || null,
        sprint: issue.fields.customfield_10020?.[0]?.name || null,
        tiempoTotalIssue: issue.fields.timespent || 0,

        // Nuevos campos
        estimacionOriginal: issue.fields.timetracking?.originalEstimateSeconds || 0,
        fechaVencimiento: issue.fields.duedate ? new Date(issue.fields.duedate) : null,
        etiquetas: issue.fields.labels || []
      });
    });
  });
  
  return registrosWorklog;
}

/**
 * ✅ VALIDACIÓN de autor del equipo CCSOFT
 */
function validarAutorEquipoCCSOFT(autor) {
  // ✅ Verificar por email domain
  if (autor.emailAddress && autor.emailAddress.endsWith('@ccsoft.ai')) {
    return true;
  }
  
  // ✅ Verificar por nombres conocidos del equipo
  const nombresEquipo = EQUIPO_CCSOFT.map(p => p.nombre);
  
  return nombresEquipo.includes(autor.displayName);
}


/**
 * ✅ VALIDADO: Ejecuta consulta JQL en Jira con manejo de paginación
 * @param {string} jql - Consulta JQL
 * @param {Object} config - Configuración de Jira
 * @returns {Object[]} Array de issues
 */
function ejecutarConsultaJiraSemanal(jql, config) {
  const todasLosIssues = [];
  
  // ✅ Campos específicos para análisis semanal
  const camposRequeridos = [
    'key', 'summary', 'status', 'issuetype', 'project',
    'timetracking', 'worklog', 'duedate', 'labels' // Campos añadidos
  ].join(',');
  
  let url = `https://${config.dominio}.atlassian.net/rest/api/3/search?jql=${encodeURIComponent(jql)}&fields=${camposRequeridos}&maxResults=100`;
  
  const options = {
    method: "get",
    headers: {
      "Authorization": "Basic " + Utilities.base64Encode(config.email + ":" + config.apiToken),
      "Accept": "application/json",
      "Content-Type": "application/json"
    },
    muteHttpExceptions: true
  };
  
  let iteracion = 0;
  const maxIteraciones = 50; // Límite de seguridad
  
  do {
    iteracion++;
    if (iteracion > maxIteraciones) {
      throw new Error(`Superado el límite de iteraciones (${maxIteraciones}) obteniendo issues semanales`);
    }
    
    Logger.log(` [SEMANAL] Obteniendo issues - página ${iteracion}`);
    
    const response = UrlFetchApp.fetch(url, options);
    
    if (response.getResponseCode() !== 200) {
      throw new Error(`Error HTTP ${response.getResponseCode()}: ${response.getContentText()}`);
    }
    
    const json = JSON.parse(response.getContentText());
    
    if (!json.issues || !Array.isArray(json.issues)) {
      Logger.log('⚠️ Respuesta de API no contiene issues válidos');
      break;
    }
    
    todasLosIssues.push(...json.issues);
    
    // ✅ Verificar límite de seguridad
    if (todasLosIssues.length > CONFIG_VALIDACION_SEMANAL.MAX_ISSUES_POR_CONSULTA) {
      Logger.log(`⚠️ [SEMANAL] Límite de issues alcanzado: ${CONFIG_VALIDACION_SEMANAL.MAX_ISSUES_POR_CONSULTA}`);
      break;
    }
    
    url = (json.startAt + json.maxResults < json.total) ?
      `https://${config.dominio}.atlassian.net/rest/api/3/search?jql=${encodeURIComponent(jql)}&fields=${camposRequeridos}&maxResults=100&startAt=${json.startAt + json.maxResults}` :
      null;
      
  } while (url);
  
  Logger.log(`✅ [SEMANAL] Total de issues obtenidos: ${todasLosIssues.length}`);
  return todasLosIssues;
}

/**
 * ✅ VALIDADO: Formatea fecha para uso en JQL
 * @param {Date} fecha - Fecha a formatear
 * @returns {string} Fecha formateada para JQL
 */
function formatearFechaParaJQL(fecha) {
  const year = fecha.getFullYear();
  const month = String(fecha.getMonth() + 1).padStart(2, '0');
  const day = String(fecha.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * ✅ VALIDADO: Función para probar conexión con Jira específica para reportes semanales
 * @returns {string} Resultado de la prueba
 */
function probarConexionJiraSemanal() {
  try {
    Logger.log(' [SEMANAL] Probando conexión con Jira...');
    
    const config = obtenerConfigJiraSemanal();
    const options = {
      method: "get",
      headers: {
        "Authorization": "Basic " + Utilities.base64Encode(config.email + ":" + config.apiToken),
        "Accept": "application/json"
      },
      muteHttpExceptions: true
    };
    
    const url = `https://${config.dominio}.atlassian.net/rest/api/3/myself`;
    const response = UrlFetchApp.fetch(url, options);
    
    if (response.getResponseCode() === 200) {
      const userData = JSON.parse(response.getContentText());
      const resultado = `✅ Conexión exitosa!

` +
        ` Usuario: ${userData.displayName || 'Desconocido'}
` +
        ` Email: ${userData.emailAddress || config.email}
` +
        ` Dominio: ${config.dominio}.atlassian.net
` +
        ` Sistema listo para reportes semanales`;
      
      Logger.log('✅ [SEMANAL] Conexión con Jira verificada exitosamente');
      return resultado;
    } else {
      throw new Error(`HTTP ${response.getResponseCode()}: ${response.getContentText()}`);
    }
    
  } catch (error) {
    const errorId = ErrorManagerSemanal.registrarError(
      'Error probando conexión con Jira',
      error,
      'CONEXION_JIRA_SEMANAL',
      'HIGH'
    );
    
    throw new Error(`❌ Error de conexión: ${error.message} (Error ID: ${errorId})`);
  }
}

/**
 * ✅ NUEVA: Función de prueba específica para worklog
 */
async function probarConsultaWorklog() {
  try {
    Logger.log('🧪 [PRUEBA] Probando consulta basada en worklog...');
    
    const hoy = new Date();
    const haceUnaSemana = new Date(hoy.getTime() - (7 * 24 * 60 * 60 * 1000));
    
    const opciones = {
      fechaInicio: haceUnaSemana,
      fechaFin: hoy,
      debug: true
    };
    
    const jql = construirJQLParaReportesWorklog(opciones);
    Logger.log(`📋 [PRUEBA] JQL generada: ${jql}`);
    
    const worklogs = await obtenerIssuesSemanalesDeJira(opciones);
    Logger.log(`📊 [PRUEBA] Registros de trabajo obtenidos: ${worklogs.length}`);
    
    if (worklogs.length > 0) {
      Logger.log('🎯 [PRUEBA] Primer registro de trabajo:');
      Logger.log(`  • Issue Key: ${worklogs[0].issueKey}`);
      Logger.log(`  • Autor: ${worklogs[0].worklogAuthor}`);
      Logger.log(`  • Horas: ${worklogs[0].timeSpentHours}`);
      Logger.log(`  • Fecha: ${worklogs[0].worklogDate.toLocaleDateString()}`);
    }
    
    return worklogs;
    
  } catch (error) {
    Logger.log(`❌ [PRUEBA] Error: ${error.message}`);
    throw error;
  }
}

/**
 * ✅ NUEVA: Obtiene lista de usuarios activos de Jira para selección
 * @returns {Object[]} Array de usuarios con displayName y accountId
 */
async function obtenerUsuariosActivosJira() {
  try {
    Logger.log('👥 [USUARIOS] Obteniendo usuarios activos de Jira...');
    
    const config = obtenerConfigJiraSemanal();
    
    // ✅ Usar endpoint de búsqueda de usuarios
    const url = `https://${config.dominio}.atlassian.net/rest/api/3/users/search?maxResults=50`;
    
    const options = {
      method: "get",
      headers: {
        "Authorization": "Basic " + Utilities.base64Encode(config.email + ":" + config.apiToken),
        "Accept": "application/json"
      },
      muteHttpExceptions: true
    };
    
    const response = UrlFetchApp.fetch(url, options);
    
    if (response.getResponseCode() !== 200) {
      throw new Error(`Error HTTP ${response.getResponseCode()}: ${response.getContentText()}`);
    }
    
    const usuarios = JSON.parse(response.getContentText());
    
    // ✅ Filtrar usuarios activos y formatear
    const usuariosActivos = usuarios
      .filter(user => user.active === true)
      .map(user => ({
        displayName: user.displayName || user.name || 'Usuario sin nombre',
        accountId: user.accountId,
        emailAddress: user.emailAddress || 'Sin email'
      }))
      .sort((a, b) => a.displayName.localeCompare(b.displayName));
    
    Logger.log(`✅ [USUARIOS] ${usuariosActivos.length} usuarios activos encontrados`);
    return usuariosActivos;
    
  } catch (error) {
    Logger.log(`❌ [USUARIOS] Error obteniendo usuarios: ${error.message}`);
    throw new Error(`No se pudieron obtener los usuarios de Jira: ${error.message}`);
  }
}

// =====================================
// ✅ NUEVA: SISTEMA DE FILTRADO DE PERSONAS DEL EQUIPO
// =====================================

/**
 * ✅ NUEVA: Determinar si un usuario es válido para reportes (persona del equipo)
 * @param {Object} usuario - Usuario de Jira con displayName, emailAddress, etc.
 * @returns {boolean} true si es persona del equipo autorizada
 */
function esPersonaDelEquipo(usuario) {
  if (!usuario || !usuario.displayName) return false;
  
  const nombreUsuario = usuario.displayName.trim();
  
  // ✅ Verificar si está en la lista autorizada por nombre
  const personaEncontrada = EQUIPO_CCSOFT.find(persona => 
    persona.activo && persona.nombre === nombreUsuario
  );
  
  if (personaEncontrada) {
    return true;
  }
  
  // ✅ Verificar si está en la lista autorizada por email
  if (usuario.emailAddress) {
    const personaPorEmail = EQUIPO_CCSOFT.find(persona => 
      persona.activo && persona.email === usuario.emailAddress
    );
    
    if (personaPorEmail) {
      return true;
    }
  }
  
  // ✅ Verificar patrones de exclusión
  const esExcluido = PATRONES_EXCLUSION.some(patron => 
    nombreUsuario.includes(patron)
  );
  
  if (esExcluido) {
    return false;
  }
  
  // ✅ Si no está en la lista y no es excluido explícitamente, lo rechazamos
  return false;
}

/**
 * ✅ NUEVA: Obtener email correcto desde la lista autorizada del equipo
 * @param {string} nombreUsuario - Nombre del usuario en Jira
 * @param {string} emailJira - Email reportado por Jira (puede estar incompleto)
 * @returns {string} Email correcto @ccsoft.ai o fallback
 */
function obtenerEmailPersona(nombreUsuario, emailJira) {
  // ✅ Buscar por nombre exacto
  let persona = EQUIPO_CCSOFT.find(p => 
    p.activo && p.nombre === nombreUsuario
  );
  
  // ✅ Si no encuentra por nombre, buscar por email de Jira
  if (!persona && emailJira) {
    persona = EQUIPO_CCSOFT.find(p => 
      p.activo && p.email === emailJira
    );
  }
  
  if (persona) {
    return persona.email;
  }
  
  // ✅ Fallback al email de Jira o indicar sin email
  return emailJira || 'Sin email';
}

/**
 * ✅ NUEVA: Filtrar lista de usuarios para mostrar solo personas del equipo
 * @param {Object[]} usuarios - Lista de usuarios de Jira
 * @returns {Object[]} Lista filtrada con solo personas del equipo
 */
function filtrarSoloPersonasEquipo(usuarios) {
  if (!Array.isArray(usuarios)) return [];
  
  const personasEquipo = usuarios.filter(usuario => esPersonaDelEquipo(usuario));
  
  // ✅ Enriquecer con información del equipo
  const personasEnriquecidas = personasEquipo.map(usuario => {
    const persona = obtenerPersonaEquipo(usuario.displayName) || 
                   obtenerPersonaEquipo(usuario.emailAddress);
    
    return {
      ...usuario,
      emailAddress: obtenerEmailPersona(usuario.displayName, usuario.emailAddress),
      departamento: persona?.departamento || 'Sin departamento',
      nombreCorto: persona?.nombreCorto || usuario.displayName,
      esDelEquipo: true
    };
  });
  
  Logger.log(`👥 [FILTRO] Filtradas ${personasEnriquecidas.length} personas del equipo de ${usuarios.length} usuarios totales`);
  
  return personasEnriquecidas.sort((a, b) => a.displayName.localeCompare(b.displayName));
}

/**
 * ✅ NUEVA: Obtener solo usuarios del equipo CCSOFT
 * @returns {Object[]} Array de usuarios del equipo con información completa
 */
async function obtenerSoloEquipoCCSOFT() {
  try {
    Logger.log('👥 [EQUIPO] Obteniendo solo personal del equipo CCSOFT...');
    
    // ✅ Obtener todos los usuarios de Jira
    const todosLosUsuarios = await obtenerUsuariosActivosJira();
    
    // ✅ Filtrar solo personas del equipo
    const equipoFiltrado = filtrarSoloPersonasEquipo(todosLosUsuarios);
    
    Logger.log(`✅ [EQUIPO] ${equipoFiltrado.length} personas del equipo CCSOFT encontradas`);
    
    return equipoFiltrado;
    
  } catch (error) {
    Logger.log(`❌ [EQUIPO] Error obteniendo equipo CCSOFT: ${error.message}`);
    throw new Error(`No se pudo obtener el equipo CCSOFT: ${error.message}`);
  }
}
