// =====================================
// API DE JIRA PARA REPORTE POR PERSONA
// =====================================

/**
 * ✅ Obtiene issues de Jira optimizado para reportes basados en worklog
 */
async function obtenerIssuesSemanalesDeJira(opciones = {}) {
  try {
    Logger.log('🔍 [WORKLOG] Iniciando obtención de issues para reportes de worklog...');
    
    const config = obtenerConfigJiraSemanal();
    
    Logger.log('📊 [WORKLOG] Obteniendo issues frescos de la API de Jira...');
    
    // Construir JQL específico para reportes de worklog
    const jql = construirJQLParaReportesWorklog(opciones);
    
    Logger.log(`📋 [WORKLOG] JQL construida: ${jql}`);
    
    const issues = await ejecutarConsultaJiraSemanal(jql, config);
    
    if (!issues || !Array.isArray(issues)) {
      throw new Error(`Se esperaba un array de issues, pero se recibió: ${typeof issues}.`);
    }
    
    Logger.log(`📊 [WORKLOG] Issues obtenidos de API: ${issues.length} issues`);
    
    const issuesProcessed = procesarIssuesParaAnalisisWorklog(issues, opciones);
    
    if (!Array.isArray(issuesProcessed)) {
      throw new Error(`El procesamiento de issues falló. Se esperaba array, se recibió: ${typeof issuesProcessed}`);
    }
    
    Logger.log(`✅ [WORKLOG] Registros de trabajo obtenidos y procesados: ${issuesProcessed.length}`);
    return issuesProcessed;
    
  } catch (error) {
    Logger.log(`❌ [WORKLOG] Error: ${error.message}`);
    throw new Error(`❌ [WORKLOG] No se pudieron obtener los issues: ${error.message}`);
  }
}

/**
 * ✅ Construye JQL para reportes basados en worklog
 */
function construirJQLParaReportesWorklog(opciones = {}) {
  let condiciones = [];

  // Filtro por sprint si se proporciona
  if (opciones.sprintId) {
    condiciones.push(`sprint = ${opciones.sprintId}`);
  } else {
    // Filtro principal por fechas de worklog
    const fechaInicio = opciones.fechaInicio || new Date(new Date().setDate(new Date().getDate() - 30)); // Por defecto, últimos 30 días
    const fechaFin = opciones.fechaFin || new Date();
    
    condiciones.push(`worklogDate >= "${formatearFechaParaJQL(fechaInicio)}"`);
    condiciones.push(`worklogDate <= "${formatearFechaParaJQL(fechaFin)}"`);
  }

  // Filtro por proyecto específico si se requiere
  if (opciones.proyecto) {
    condiciones.push(`project = "${opciones.proyecto}"`);
  }

  // Filtro dinámico por autor(es)
  if (opciones.accountId) {
    // Si se especifica una persona, filtrar solo por ella
    condiciones.push(`worklogAuthor = "${opciones.accountId}"`);
  } else {
    // Si no, filtrar por todo el equipo
    const autores = EQUIPO_CCSOFT.map(p => `"${p.accountId}"`).join(',');
    condiciones.push(`worklogAuthor in (${autores})`);
  }

  // Ordenamiento optimizado
  const jql = condiciones.join(' AND ') + ' ORDER BY updated DESC';
  
  return jql;
}

/**
 * ✅ Procesa issues para análisis de worklog
 */
function procesarIssuesParaAnalisisWorklog(issues) {
  const registrosWorklog = [];
  
  issues.forEach(issue => {
    // Verificar si el issue tiene worklogs
    if (!issue.fields.worklog || !issue.fields.worklog.worklogs) {
      return;
    }
    
    issue.fields.worklog.worklogs.forEach(worklog => {
      registrosWorklog.push({
        // Datos del issue
        issueKey: issue.key,
        issueSummary: issue.fields.summary,
        issueType: issue.fields.issuetype?.name || 'Desconocido',
        issueStatus: issue.fields.status?.name || 'Desconocido',
        
        // Datos del proyecto
        projectKey: issue.fields.project?.key || 'Desconocido',
        projectName: issue.fields.project?.name || 'Desconocido',
        
        // Datos del worklog
        worklogId: worklog.id,
        worklogAuthor: worklog.author.displayName,
        worklogAuthorEmail: worklog.author.emailAddress,
        worklogAuthorAccountId: worklog.author.accountId,
        worklogDate: new Date(worklog.started),
        timeSpentSeconds: worklog.timeSpentSeconds,
        timeSpentHours: Math.round((worklog.timeSpentSeconds / 3600) * 100) / 100,
        worklogComment: worklog.comment || '',
        
        // Información adicional del issue
        issuePadre: issue.fields.parent?.key || null,
        sprint: issue.fields.customfield_10020?.[0]?.name || null,
        tiempoTotalIssue: issue.fields.timespent || 0,
        estimacionOriginal: issue.fields.timetracking?.originalEstimateSeconds || issue.fields.timeoriginalestimate || 0,
        fechaVencimiento: issue.fields.duedate ? new Date(issue.fields.duedate) : null,
        etiquetas: issue.fields.labels ? issue.fields.labels.map(label => label.name || label) : [],
        asignadoA: issue.fields.assignee?.displayName || 'Sin asignar'
      });
    });
  });
  
  return registrosWorklog;
}

/**
 * ✅ Ejecuta consulta JQL en Jira con manejo de paginación
 */
function ejecutarConsultaJiraSemanal(jql, config) {
  const todasLosIssues = [];
  
  // Campos específicos para análisis semanal y reporte individual
  const camposRequeridos = [
    'key', 'summary', 'status', 'issuetype', 'project',
    'timetracking', 'worklog', 'duedate', 'labels', 'parent',
    'assignee', 'timespent', 'timeoriginalestimate'
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
    
    Logger.log(`📊 [SEMANAL] Obteniendo issues - página ${iteracion}`);
    
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
    
    // Verificar límite de seguridad
    if (todasLosIssues.length > 2000) {
      Logger.log(`⚠️ [SEMANAL] Límite de issues alcanzado: 2000`);
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
 * ✅ Formatea fecha para uso en JQL
 */
function formatearFechaParaJQL(fecha) {
  const year = fecha.getFullYear();
  const month = String(fecha.getMonth() + 1).padStart(2, '0');
  const day = String(fecha.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * ✅ Obtiene la información del usuario actual basado en las credenciales
 */
async function obtenerUsuarioActual() {
  try {
    Logger.log('👤 [USUARIO] Obteniendo información del usuario actual...');
    
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
      
      // Buscar el usuario en el equipo CCSOFT por email
      const personaEquipo = EQUIPO_CCSOFT.find(p => 
        p.activo && (
          p.email.toLowerCase() === userData.emailAddress.toLowerCase() ||
          p.email.toLowerCase() === config.email.toLowerCase()
        )
      );
      
      if (!personaEquipo) {
        throw new Error(`El usuario ${userData.emailAddress} no está registrado en el equipo CCSOFT`);
      }
      
      Logger.log(`✅ [USUARIO] Usuario encontrado: ${personaEquipo.nombre}`);
      
      return {
        accountId: personaEquipo.accountId,
        nombre: personaEquipo.nombre,
        email: personaEquipo.email,
        area: personaEquipo.area,
        rol: personaEquipo.rol,
        jiraDisplayName: userData.displayName,
        jiraEmail: userData.emailAddress
      };
      
    } else {
      throw new Error(`Error HTTP ${response.getResponseCode()}: ${response.getContentText()}`);
    }
    
  } catch (error) {
    Logger.log(`❌ [USUARIO] Error obteniendo usuario actual: ${error.message}`);
    throw new Error(`No se pudo obtener la información del usuario: ${error.message}`);
  }
}

/**
 * ✅ Función para probar conexión con Jira
 */
function probarConexionJiraSemanal() {
  try {
    Logger.log('🔍 [SEMANAL] Probando conexión con Jira...');
    
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

🙋‍♂️ Usuario: ${userData.displayName || 'Desconocido'}
📧 Email: ${userData.emailAddress || config.email}
🌐 Dominio: ${config.dominio}.atlassian.net
📊 Sistema listo para reportes por persona`;
      
      Logger.log('✅ [SEMANAL] Conexión exitosa con Jira');
      return resultado;
    } else {
      const errorMsg = `Error HTTP ${response.getResponseCode()}: ${response.getContentText()}`;
      Logger.log(`❌ [SEMANAL] Error de conexión: ${errorMsg}`);
      throw new Error(errorMsg);
    }
    
  } catch (error) {
    Logger.log(`❌ [SEMANAL] Error probando conexión: ${error.message}`);
    throw new Error(`No se pudo conectar con Jira: ${error.message}`);
  }
}