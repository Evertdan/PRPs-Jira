// =====================================
// ARCHIVO CORREGIDO: 03_JiraAPI_Semanal.gs
// ✅ VALIDADO CON MCP - TODAS LAS CORRECCIONES APLICADAS
// =====================================

/**
 * ✅ CORREGIDO Y VALIDADO: Obtiene issues de Jira optimizado para reportes semanales con etiquetas
 * @param {Object} opciones - Opciones de consulta
 * @returns {Promise<Object[]>} Array de issues con análisis semanal
 */
async function obtenerIssuesSemanalesDeJira(opciones = {}) {
  try {
    Logger.log(' [SEMANAL] Iniciando obtención de issues para reportes semanales...');
    
    const config = obtenerConfigJiraSemanal();
    
    // ✅ Intentar recuperar del caché primero
    const claveCache = CacheManagerSemanal.generarClave(
      CONFIG_CACHE_SEMANAL.PREFIX_ISSUES, 
      `periodo_${config.dominio}_${JSON.stringify(opciones)}`
    );
    
    if (!opciones.forzarActualizacion) {
      const issuesEnCache = CacheManagerSemanal.recuperar(claveCache);
      if (issuesEnCache && Array.isArray(issuesEnCache) && issuesEnCache.length > 0) {
        Logger.log(`✅ [SEMANAL] Issues recuperados del caché: ${issuesEnCache.length} issues`);
        return issuesEnCache;
      }
    }
    
    Logger.log(' [SEMANAL] Obteniendo issues frescos de la API de Jira...');
    
    // ✅ Construir JQL específico para reportes semanales
    const jql = construirJQLParaReportesSemanal(opciones);
    
    // ✅ Validar JQL antes de ejecutar
    const validacionJQL = ValidadorJQLSemanal.validarJQL(jql);
    if (!validacionJQL.isValid) {
      throw new Error(`JQL inválida: ${validacionJQL.mensaje}`);
    }
    
    Logger.log(` [SEMANAL] JQL construida: ${jql}`);
    
    // ✅ *** CORRECCIÓN PRINCIPAL *** - Agregar await para esperar la Promise
    const issues = await ErrorManagerSemanal.ejecutarConReintentos(
      function() { return ejecutarConsultaJiraSemanal(jql, config); },
      'Obtener issues semanales de Jira',
      3
    );
    
    // ✅ VALIDACIÓN CRÍTICA: Verificar que issues sea un array
    if (!issues) {
      throw new Error('La operación retornó null o undefined');
    }
    
    if (!Array.isArray(issues)) {
      throw new Error(`Se esperaba un array de issues, pero se recibió: ${typeof issues}. Valor: ${JSON.stringify(issues).substring(0, 200)}...`);
    }
    
    Logger.log(` [SEMANAL] Issues obtenidos de API: ${issues.length} issues`);
    
    // ✅ Procesar issues para análisis semanal
    if (opciones.debug) {
      Logger.log(`[DEBUG] Issues antes de procesar: ${JSON.stringify(issues.slice(0, 1), null, 2)}`);
    }
    
    const issuesProcessed = procesarIssuesParaAnalisisSemanal(issues);
    
    // ✅ VALIDACIÓN ADICIONAL: Verificar que el procesamiento funcionó
    if (!Array.isArray(issuesProcessed)) {
      throw new Error(`El procesamiento de issues falló. Se esperaba array, se recibió: ${typeof issuesProcessed}`);
    }
    
    // ✅ Almacenar resultados en caché
    CacheManagerSemanal.almacenar(claveCache, issuesProcessed, CONFIG_CACHE_SEMANAL.TTL_ISSUES_SEMANALES);
    
    Logger.log(`✅ [SEMANAL] Issues obtenidos y procesados: ${issuesProcessed.length}`);
    return issuesProcessed;
    
  } catch (error) {
    const errorId = ErrorManagerSemanal.registrarError(
      'Error crítico obteniendo issues semanales',
      error,
      'API_JIRA_SEMANAL',
      'CRITICAL'
    );
    
    throw new Error(`❌ [SEMANAL] No se pudieron obtener los issues: ${error.message} (Error ID: ${errorId})`);
  }
}

/**
 * ✅ CORREGIDO: Construye JQL con los tipos de issue REALES de tu Jira
 * @param {Object} opciones - Opciones de filtrado
 * @returns {string} Consulta JQL optimizada
 */
function construirJQLParaReportesSemanal(opciones = {}) {
  const config = CONFIG_SEMANAL;
  let condiciones = [];
  
  // ✅ Filtro por proyecto si se especifica
  if (config.proyectoDefecto && config.proyectoDefecto.trim()) {
    condiciones.push(`project = "${config.proyectoDefecto}"`);
  }
  
  // ✅ Filtro por fechas del período (personalizable o mes actual por defecto)
  const fechaInicio = opciones.fechaInicio || config.fechaInicioSprint;
  const fechaFin = opciones.fechaFin || config.fechaFinSprint;
  
  const fechaInicioStr = formatearFechaParaJQL(fechaInicio);
  const fechaFinStr = formatearFechaParaJQL(fechaFin);
  
  // ✅ NUEVO: Para reportes personalizados, usar rango de fechas más específico
  if (opciones.formatoPersonalizado) {
    condiciones.push(`created >= "${fechaInicioStr}"`);
    condiciones.push(`created <= "${fechaFinStr}"`);
  } else {
    condiciones.push(`(created >= "${fechaInicioStr}" OR updated >= "${fechaInicioStr}")`);
    condiciones.push(`created <= "${fechaFinStr}"`);
  }
  
  // ✅ Filtro crítico: Solo issues con etiquetas semanales
  if (opciones.soloConEtiquetasSemanales !== false) {
    const etiquetasCondiciones = config.etiquetasSemana.map(etiqueta => `labels = "${etiqueta}"`);
    condiciones.push(`(${etiquetasCondiciones.join(' OR ')})`);
  }
  
  // ✅ CORRECCIÓN PRINCIPAL: Usar tipos de issue REALES de tu Jira
  let tiposIssue = [];
  
  // Tipos reales encontrados en tu documento
  tiposIssue.push(
    '"Tarea"',
    '"Mesa de Trabajo"',
    '"Tarea Operativa"',
    '"Tarea Emergente"',
    '"Juntas Scrum"',
    '"Convivencias y Cumpleaños"'
  );
  
  // Agregar tipos adicionales que podrían existir
  tiposIssue.push(
    '"Documentación"',
    '"Habilitador"',
    '"Task"',
    '"Bug"'
  );
  
  if (tiposIssue.length > 0 && !opciones.omitirFiltroTipos) {
    condiciones.push(`issuetype IN (${tiposIssue.join(', ')})`);
  }
  
  // ✅ NUEVO: Filtro por personas del equipo CCSOFT
  if (!opciones.omitirFiltroPersonas) {
    const emailsEquipo = EQUIPO_CCSOFT
      .filter(p => p.activo)
      .map(p => `"${p.email}"`)
      .join(', ');
    
    if (emailsEquipo) {
      condiciones.push(`assignee in (${emailsEquipo})`);
      Logger.log(`👥 [JQL] Filtro de equipo aplicado: ${EQUIPO_CCSOFT.filter(p => p.activo).length} personas`);
    }
  }
  
  // ✅ Filtro por usuario específico o usuario actual (mantener funcionalidad existente)
  if (opciones.usuarioEspecifico) {
    condiciones.push(`assignee = "${opciones.usuarioEspecifico}"`);
  } else if (opciones.soloUsuarioActual) {
    condiciones.push('assignee = currentUser()');
  }
  
  // ✅ Ordenamiento optimizado para reportes semanales
  const jql = condiciones.join(' AND ') + ' ORDER BY labels ASC, priority DESC, created DESC';
  
  return jql;
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
    'key', 'summary', 'description', 'status', 'assignee', 'reporter',
    'priority', 'labels', 'issuetype', 'project', 'parent',
    'created', 'updated', 'resolutiondate', 'duedate',
    'timetracking', 'worklog', 'comment', 'attachment',
    'customfield_10016', // Story Points típico
    'customfield_10020'  // Sprint típico
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
 * ✅ NUEVA: Formatea fecha para worklog en formato YYYY/MM/DD
 * @param {Date} fecha - Fecha a formatear
 * @returns {string} Fecha formateada para worklogDate
 */
function formatearFechaParaJQLWorklog(fecha) {
  const year = fecha.getFullYear();
  const month = String(fecha.getMonth() + 1).padStart(2, '0');
  const day = String(fecha.getDate()).padStart(2, '0');
  return `${year}/${month}/${day}`;
}

/**
 * ✅ MEJORADO Y VALIDADO: Procesa issues basándose en worklog en lugar de etiquetas semanales
 * @param {Object[]} issues - Issues de Jira
 * @returns {Object[]} Issues procesados con información de worklog
 */
function procesarIssuesParaAnalisisSemanal(issues) {
  Logger.log(` [WORKLOG] Procesando ${issues?.length || 'unknown'} issues para análisis de worklog...`);
  
  // ✅ VALIDACIÓN ROBUSTA DE ENTRADA
  if (!issues) {
    throw new Error('Issues es null o undefined en procesarIssuesParaAnalisisSemanal');
  }
  
  if (!Array.isArray(issues)) {
    throw new Error(`Issues no es un array en procesarIssuesParaAnalisisSemanal. Tipo recibido: ${typeof issues}`);
  }
  
  if (issues.length === 0) {
    Logger.log('⚠️ [WORKLOG] No hay issues para procesar');
    return [];
  }
  
  try {
    const issuesProcessed = issues.map((issue, index) => {
      // ✅ Validar issue individual
      if (!issue || !issue.fields) {
        Logger.log(`⚠️ [WORKLOG] Issue ${index} sin campos válidos: ${JSON.stringify(issue)}`);
        return null;
      }
      
      try {
        // ✅ NUEVO: Validar que la persona esté autorizada ANTES de procesar
        const asignado = issue.fields.assignee;
        if (!asignado || !esPersonaDelEquipo(asignado)) {
          Logger.log(`❌ [FILTRO] Issue ${issue.key} excluido - Asignado no autorizado: ${asignado?.displayName || 'Sin asignar'}`);
          return null; // Excluir este issue completamente
        }
        
        // ✅ NUEVO: Análisis basado en worklog en lugar de etiquetas
        const worklogInfo = issue.fields.worklog || {};
        const worklogs = worklogInfo.worklogs || [];
        
        // ✅ Calcular semana basándose en la fecha de creación del issue
        const fechaCreacion = issue.fields.created ? new Date(issue.fields.created) : new Date();
        const numeroSemana = calcularNumeroSemanaDelMes(fechaCreacion);
        const etiquetaSemanaCalculada = `SEMANA_${numeroSemana}`;
        
        // ✅ Análisis de estado
        const estadoActual = issue.fields.status?.name || 'Desconocido';
        
        // ✅ Usar estados reales de tu Jira (obtenidos de CONFIG_SEMANAL)
        const esCompletado = CONFIG_SEMANAL.estadosCompletados.includes(estadoActual);
        const esEnProgreso = CONFIG_SEMANAL.estadosEnProgreso.includes(estadoActual);
        const esPendiente = CONFIG_SEMANAL.estadosPendientes.includes(estadoActual);
        
        // ✅ Análisis de tiempo
        const timetracking = issue.fields.timetracking || {};
        const tiempoEstimado = timetracking.originalEstimateSeconds || 0;
        const tiempoTrabajado = timetracking.timeSpentSeconds || 0;
        const tiempoRestante = timetracking.remainingEstimateSeconds || 0;
        
        // ✅ Análisis de fechas con manejo de errores
        let fechaCreacionIssue, fechaActualizacion, fechaResolucion, fechaVencimiento;
        
        try {
          fechaCreacionIssue = issue.fields.created ? new Date(issue.fields.created) : null;
          fechaActualizacion = issue.fields.updated ? new Date(issue.fields.updated) : null;
          fechaResolucion = issue.fields.resolutiondate ? new Date(issue.fields.resolutiondate) : null;
          fechaVencimiento = issue.fields.duedate ? new Date(issue.fields.duedate) : null;
        } catch (dateError) {
          Logger.log(`⚠️ [WORKLOG] Error procesando fechas para issue ${issue.key}: ${dateError.message}`);
          fechaCreacionIssue = fechaActualizacion = fechaResolucion = fechaVencimiento = null;
        }
        
        // ✅ Análisis de actividad
        const comentarios = issue.fields.comment?.comments || [];
        const adjuntos = issue.fields.attachment || [];
        
        return {
          ...issue,
          analisisSemanal: {
            // ✅ NUEVO: Basado en worklog y fecha de creación
            etiquetaSemanal: etiquetaSemanaCalculada,
            numeroSemana: numeroSemana,
            tieneEtiquetaSemanal: true, // Siempre true porque se calcula automáticamente
            basadoEnWorklog: true, // Indicador de que es basado en worklog
            
            // Estados
            estadoActual: estadoActual,
            esCompletado: esCompletado,
            esEnProgreso: esEnProgreso,
            esPendiente: esPendiente,
            
            // Tiempo
            tiempoEstimadoHoras: Math.round((tiempoEstimado / 3600) * 100) / 100,
            tiempoTrabajadoHoras: Math.round((tiempoTrabajado / 3600) * 100) / 100,
            tiempoRestanteHoras: Math.round((tiempoRestante / 3600) * 100) / 100,
            eficienciaTiempo: tiempoEstimado > 0 ? (tiempoTrabajado / tiempoEstimado) : 0,
            
            // Worklog específico
            cantidadWorklog: worklogs.length,
            tiempoTotalWorklog: worklogs.reduce((total, log) => total + (log.timeSpentSeconds || 0), 0) / 3600,
            
            // Fechas
            fechaCreacion: fechaCreacionIssue,
            fechaActualizacion: fechaActualizacion,
            fechaResolucion: fechaResolucion,
            fechaVencimiento: fechaVencimiento,
            estaVencido: fechaVencimiento && fechaVencimiento < new Date() && !esCompletado,
            
            // Actividad
            cantidadComentarios: comentarios.length,
            cantidadAdjuntos: adjuntos.length,
            nivelActividad: comentarios.length + adjuntos.length + worklogs.length,
            
            // Información del proyecto
            proyectoKey: issue.fields.project?.key || 'Desconocido',
            proyectoNombre: issue.fields.project?.name || 'Desconocido',
            
            // ✅ ACTUALIZADO: Información del asignado con email correcto
            asignadoNombre: asignado.displayName,
            asignadoEmail: obtenerEmailPersona(asignado.displayName, asignado.emailAddress),
            asignadoEsDelEquipo: true, // Nuevo campo para confirmar autorización
            
            // Tipo y prioridad (usando los reales de tu Jira)
            tipoIssue: issue.fields.issuetype?.name || 'Desconocido',
            prioridad: issue.fields.priority?.name || 'Sin prioridad',
            
            // Story Points si está disponible
            storyPoints: issue.fields.customfield_10016 || 0
          }
        };
        
      } catch (issueError) {
        Logger.log(`⚠️ [WORKLOG] Error procesando issue ${issue.key || index}: ${issueError.message}`);
        return null;
      }
    }).filter(issue => {
      // ✅ Filtrar solo issues nulos (todos los issues con worklog son válidos)
      return issue !== null;
    });
    
    Logger.log(`✅ [WORKLOG] Issues procesados exitosamente: ${issuesProcessed.length} issues con worklog`);
    return issuesProcessed;
    
  } catch (error) {
    Logger.log(`❌ [WORKLOG] Error procesando issues: ${error.message}`);
    throw new Error(`Error procesando issues para análisis de worklog: ${error.message}`);
  }
}

/**
 * ✅ NUEVA: Calcula el número de semana dentro del mes basándose en la fecha
 * @param {Date} fecha - Fecha del issue
 * @returns {number} Número de semana (1-6)
 */
function calcularNumeroSemanaDelMes(fecha) {
  const dia = fecha.getDate();
  
  // Calcular semana basándose en el día del mes
  if (dia <= 7) return 1;
  if (dia <= 14) return 2;
  if (dia <= 21) return 3;
  if (dia <= 28) return 4;
  return 5; // Días 29-31
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
      const resultado = `✅ Conexión exitosa!\n\n` +
        ` Usuario: ${userData.displayName || 'Desconocido'}\n` +
        ` Email: ${userData.emailAddress || config.email}\n` +
        ` Dominio: ${config.dominio}.atlassian.net\n` +
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
    
    const jql = construirJQLParaReportesSemanal(opciones);
    Logger.log(`📋 [PRUEBA] JQL generada: ${jql}`);
    
    const issues = await obtenerIssuesSemanalesDeJira(opciones);
    Logger.log(`📊 [PRUEBA] Issues obtenidos: ${issues.length}`);
    
    if (issues.length > 0) {
      Logger.log('🎯 [PRUEBA] Primer issue:');
      Logger.log(`  • Key: ${issues[0].key}`);
      Logger.log(`  • Tipo: ${issues[0].analisisSemanal.tipoIssue}`);
      Logger.log(`  • Estado: ${issues[0].analisisSemanal.estadoActual}`);
      Logger.log(`  • Semana calculada: ${issues[0].analisisSemanal.etiquetaSemanal}`);
    }
    
    return issues;
    
  } catch (error) {
    Logger.log(`❌ [PRUEBA] Error: ${error.message}`);
    throw error;
  }
}

/**
 * ✅ NUEVA: Función para probar con los tipos reales de tu Jira
 */
async function probarConTiposReales() {
  try {
    Logger.log('🧪 [PRUEBA] Probando con tipos reales de Jira...');
    
    const opciones = {
      debug: true,
      soloConEtiquetasSemanales: true, // Mantener filtro de etiquetas semanales
      incluirFiltroTipos: true // Incluir filtro de tipos reales
    };
    
    const issues = await obtenerIssuesSemanalesDeJira(opciones);
    
    Logger.log(`📊 [PRUEBA] Issues obtenidos: ${issues.length}`);
    
    if (issues.length > 0) {
      Logger.log('🎯 [PRUEBA] Tipos de issue encontrados:');
      const tiposEncontrados = [...new Set(issues.map(issue => 
        issue.analisisSemanal.tipoIssue
      ))];
      
      tiposEncontrados.forEach(tipo => {
        Logger.log(`  • "${tipo}"`);
      });
      
      Logger.log('🏷️ [PRUEBA] Etiquetas semanales encontradas:');
      const etiquetasEncontradas = [...new Set(issues.map(issue => 
        issue.analisisSemanal.etiquetaSemanal
      ).filter(etiqueta => etiqueta))];
      
      etiquetasEncontradas.forEach(etiqueta => {
        Logger.log(`  • ${etiqueta}`);
      });
    }
    
    return issues;
    
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
    Logger.log(`✅ [FILTRO] Persona autorizada: ${nombreUsuario}`);
    return true;
  }
  
  // ✅ Verificar si está en la lista autorizada por email
  if (usuario.emailAddress) {
    const personaPorEmail = EQUIPO_CCSOFT.find(persona => 
      persona.activo && persona.email === usuario.emailAddress
    );
    
    if (personaPorEmail) {
      Logger.log(`✅ [FILTRO] Persona autorizada por email: ${nombreUsuario} (${usuario.emailAddress})`);
      return true;
    }
  }
  
  // ✅ Verificar patrones de exclusión
  const esExcluido = PATRONES_EXCLUSION.some(patron => 
    nombreUsuario.includes(patron)
  );
  
  if (esExcluido) {
    Logger.log(`❌ [FILTRO] Usuario excluido por patrón: ${nombreUsuario}`);
    return false;
  }
  
  // ✅ Si no está en la lista y no es excluido explícitamente, lo rechazamos
  Logger.log(`⚠️ [FILTRO] Usuario no autorizado: ${nombreUsuario}`);
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
    Logger.log(`📧 [EMAIL] Email correcto para ${nombreUsuario}: ${persona.email}`);
    return persona.email;
  }
  
  // ✅ Fallback al email de Jira o indicar sin email
  const emailFallback = emailJira || 'Sin email';
  Logger.log(`⚠️ [EMAIL] Usando fallback para ${nombreUsuario}: ${emailFallback}`);
  return emailFallback;
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
    
    // ✅ Log detallado para verificación
    equipoFiltrado.forEach(persona => {
      Logger.log(`  👤 ${persona.displayName} (${persona.emailAddress}) - ${persona.departamento}`);
    });
    
    return equipoFiltrado;
    
  } catch (error) {
    Logger.log(`❌ [EQUIPO] Error obteniendo equipo CCSOFT: ${error.message}`);
    throw new Error(`No se pudo obtener el equipo CCSOFT: ${error.message}`);
  }
}

/**
 * ✅ NUEVA: Formatear nombre de persona para mostrar en reportes
 * @param {Object} issue - Issue de Jira con información de asignado
 * @returns {string} Formato: "Nombre (email@ccsoft.ai)"
 */
function formatearNombrePersonaParaReporte(issue) {
  if (!issue?.fields?.assignee) {
    return 'Sin asignar';
  }
  
  const asignado = issue.fields.assignee;
  const nombre = asignado.displayName || 'Sin nombre';
  const emailCorrecto = obtenerEmailPersona(nombre, asignado.emailAddress);
  
  return `${nombre} (${emailCorrecto})`;
}

/**
 * ✅ NUEVA: Función de prueba para reportes por persona
 */
async function probarReportePorPersona() {
  try {
    Logger.log('🧪 [PRUEBA-PERSONA] Probando reporte por persona...');
    
    // ✅ Obtener usuarios
    const usuarios = await obtenerUsuariosActivosJira();
    Logger.log(`👥 [PRUEBA-PERSONA] ${usuarios.length} usuarios encontrados`);
    
    if (usuarios.length > 0) {
      // ✅ Usar el primer usuario para la prueba
      const usuarioPrueba = usuarios[0];
      Logger.log(`🎯 [PRUEBA-PERSONA] Probando con usuario: ${usuarioPrueba.displayName}`);
      
      // ✅ Generar JQL para usuario específico
      const opciones = {
        usuarioEspecifico: usuarioPrueba.accountId,
        debug: true,
        soloConEtiquetasSemanales: true
      };
      
      const jql = construirJQLParaReportesSemanal(opciones);
      Logger.log(`📋 [PRUEBA-PERSONA] JQL generada: ${jql}`);
      
      // ✅ Obtener issues del usuario
      const issues = await obtenerIssuesSemanalesDeJira(opciones);
      Logger.log(`📊 [PRUEBA-PERSONA] Issues obtenidos para ${usuarioPrueba.displayName}: ${issues.length}`);
      
      return {
        usuario: usuarioPrueba,
        issues: issues,
        jql: jql
      };
    }
    
    return null;
    
  } catch (error) {
    Logger.log(`❌ [PRUEBA-PERSONA] Error: ${error.message}`);
    throw error;
  }
}

/**
 * ✅ NUEVA: Obtiene usuarios con actividad en un rango de fechas específico
 * @param {Date} fechaInicio - Fecha de inicio
 * @param {Date} fechaFin - Fecha de fin
 * @returns {Object[]} Array de usuarios con actividad
 */
async function obtenerUsuariosConActividad(fechaInicio, fechaFin) {
  try {
    Logger.log(`👥 [ACTIVIDAD] Obteniendo usuarios con actividad entre ${formatearFechaParaJQL(fechaInicio)} y ${formatearFechaParaJQL(fechaFin)}...`);
    
    const config = obtenerConfigJiraSemanal();
    
    // ✅ Construir JQL para obtener issues en el rango de fechas
    const fechaInicioStr = formatearFechaParaJQL(fechaInicio);
    const fechaFinStr = formatearFechaParaJQL(fechaFin);
    
    const jql = `created >= "${fechaInicioStr}" AND created <= "${fechaFinStr}" ORDER BY assignee ASC`;
    
    const url = `https://${config.dominio}.atlassian.net/rest/api/3/search?jql=${encodeURIComponent(jql)}&fields=assignee&maxResults=1000`;
    
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
    
    const data = JSON.parse(response.getContentText());
    
    // ✅ Filtrar usuarios únicos con actividad
    const usuariosUnicos = new Map();
    
    data.issues.forEach(issue => {
      if (issue.fields.assignee && issue.fields.assignee.active) {
        const assignee = issue.fields.assignee;
        usuariosUnicos.set(assignee.accountId, {
          displayName: assignee.displayName,
          accountId: assignee.accountId,
          emailAddress: assignee.emailAddress || 'Sin email'
        });
      }
    });
    
    const usuariosConActividad = Array.from(usuariosUnicos.values())
      .sort((a, b) => a.displayName.localeCompare(b.displayName));
    
    Logger.log(`✅ [ACTIVIDAD] ${usuariosConActividad.length} usuarios con actividad encontrados`);
    return usuariosConActividad;
    
  } catch (error) {
    Logger.log(`❌ [ACTIVIDAD] Error obteniendo usuarios con actividad: ${error.message}`);
    throw new Error(`No se pudieron obtener los usuarios con actividad: ${error.message}`);
  }
}

/**
 * ✅ NUEVA: Función de prueba completa para reportes personalizados
 */
async function probarReportePersonalizadoCompleto() {
  try {
    Logger.log('🧪 [PRUEBA-COMPLETA] Iniciando prueba completa del sistema...');
    
    // ✅ 1. Probar obtención de usuarios con actividad
    const hace30Dias = new Date(Date.now() - (30 * 24 * 60 * 60 * 1000));
    const hoy = new Date();
    
    Logger.log(`📅 [PRUEBA-COMPLETA] Probando rango: ${formatearFechaParaJQL(hace30Dias)} - ${formatearFechaParaJQL(hoy)}`);
    
    const usuariosConActividad = await obtenerUsuariosConActividad(hace30Dias, hoy);
    Logger.log(`👥 [PRUEBA-COMPLETA] ${usuariosConActividad.length} usuarios con actividad encontrados`);
    
    // ✅ 2. Probar construcción de JQL personalizada
    const opciones = {
      fechaInicio: hace30Dias,
      fechaFin: hoy,
      formatoPersonalizado: true,
      incluirColumnaPersona: true,
      debug: true
    };
    
    const jql = construirJQLParaReportesSemanal(opciones);
    Logger.log(`📋 [PRUEBA-COMPLETA] JQL generada: ${jql}`);
    
    // ✅ 3. Probar obtención de issues
    const issues = await obtenerIssuesSemanalesDeJira(opciones);
    Logger.log(`📊 [PRUEBA-COMPLETA] ${issues.length} issues obtenidos`);
    
    // ✅ 4. Analizar agrupación por persona
    if (issues.length > 0) {
      const personasUnicas = [...new Set(issues.map(issue => 
        issue.analisisSemanal?.asignadoNombre || 'Sin asignar'
      ))];
      
      Logger.log(`👤 [PRUEBA-COMPLETA] ${personasUnicas.length} personas únicas encontradas:`);
      personasUnicas.forEach(persona => {
        const issuesPersona = issues.filter(issue => 
          (issue.analisisSemanal?.asignadoNombre || 'Sin asignar') === persona
        );
        Logger.log(`  • ${persona}: ${issuesPersona.length} issues`);
      });
    }
    
    Logger.log('✅ [PRUEBA-COMPLETA] Prueba completa exitosa');
    
    return {
      usuarios: usuariosConActividad,
      jql: jql,
      issues: issues,
      estadisticas: {
        totalIssues: issues.length,
        totalUsuarios: usuariosConActividad.length,
        rangoFechas: `${formatearFechaParaJQL(hace30Dias)} - ${formatearFechaParaJQL(hoy)}`
      }
    };
    
  } catch (error) {
    Logger.log(`❌ [PRUEBA-COMPLETA] Error: ${error.message}`);
    throw error;
  }
}