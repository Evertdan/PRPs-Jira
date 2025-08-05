/**
 * Code.gs - Funciones principales y punto de entrada del sistema de sincronización.
 */

/**
 * Se ejecuta al abrir la hoja de cálculo. Crea el menú personalizado.
 */
function onOpen() {
  const ui = SpreadsheetApp.getUi();
  
  const subMenu = ui.createMenu('📊 Generar Reporte')
    .addItem('Por Proyecto', 'iniciarReportePorProyecto')
    .addItem('Por Asignado', 'iniciarReportePorAsignado');
  
  ui.createMenu('🔄 Jira Sync')
    .addItem('🔽 Sincronizar Jira → Sheets', 'sincronizarJiraASheets')
    .addItem('🔼 Sincronizar Sheets → Jira', 'sincronizarSheetsAJira')
    .addSeparator()
    .addSubMenu(subMenu)
    .addSeparator()
    .addItem('🚀 Setup Inicial / Configurar', 'setupInicial')
    .addItem('⚙️ Mostrar Configuración Actual', 'mostrarConfiguracion')
    .addSeparator()
    .addItem('📊 Health Check', 'mostrarHealthCheck')
    .addItem('📈 Ver Métricas', 'mostrarMetricas')
    .addItem('🔍 Diagnosticar Issue Específico', 'diagnosticarIssue')
    .addToUi();
  
  logEstructurado('INFO', 'Jira Sync inicializado', getVersion());
}

/**
 * Función principal: Sincronización Jira → Google Sheets.
 */
function sincronizarJiraASheets() {
  return operacionCriticaConLock(() => {
    const tiempoInicio = Date.now();
    PropertiesService.getScriptProperties().setProperty('EXECUTION_START', tiempoInicio.toString());
    
    logEstructurado('INFO', '🔽 Iniciando sincronización Jira → Sheets');
    const config = obtenerConfiguracion();
    const ultimaSync = PropertiesService.getScriptProperties().getProperty('LAST_SYNC_TIMESTAMP');
    
    let totalIssues = 0;
    for (const proyecto of config.projects) {
      totalIssues += sincronizarProyecto(proyecto, ultimaSync ? new Date(parseInt(ultimaSync)) : null);
      if (shouldBreakForTimeout()) {
        logEstructurado('WARN', 'Interrupción por timeout durante la sincronización de proyectos.');
        break;
      }
    }
    
    PropertiesService.getScriptProperties().setProperty('LAST_SYNC_TIMESTAMP', Date.now().toString());
    const tiempoTotal = Date.now() - tiempoInicio;
    
    new MetricsCollector().recordTiming('sync_jira_to_sheets', tiempoTotal);
    new MetricsCollector().incrementCounter('sync_jira_success');
    
    logEstructurado('SUCCESS', `✅ Sincronización Jira → Sheets completada.`, {
      issuesSincronizados: totalIssues,
      tiempoEjecucionSeg: (tiempoTotal / 1000).toFixed(2)
    });
  });
}

/**
 * Sincroniza los issues de un proyecto específico.
 * @param {string} projectKey - La clave del proyecto a sincronizar.
 * @param {Date} ultimaSync - La fecha de la última sincronización.
 * @returns {number} El número de issues sincronizados.
 */
function sincronizarProyecto(projectKey, ultimaSync) {
  logEstructurado('INFO', `📋 Sincronizando proyecto ${projectKey}`);
  const jiraApi = new JiraApiManager();
  const issues = jiraApi.getAllIssuesFromProject(projectKey, ultimaSync);

  if (issues.length === 0) {
    logEstructurado('INFO', `Sin issues nuevos o modificados en ${projectKey}.`);
    return 0;
  }

  logEstructurado('INFO', `Obtenidos ${issues.length} issues de ${projectKey} para procesar.`);
  const sheetData = issues.map(transformJiraIssueToSheetRow);
  actualizarSheetsEnLotes(sheetData);
  
  return issues.length;
}

/**
 * Actualiza la hoja de cálculo con los datos de los issues de forma optimizada.
 * @param {Array<Array<any>>} sheetData - Array de filas para insertar o actualizar.
 */
function actualizarSheetsEnLotes(sheetData) {
  if (!sheetData || sheetData.length === 0) return;

  logEstructurado('INFO', `📊 Actualizando Sheets con ${sheetData.length} issues.`);
  const config = obtenerConfiguracion();
  const spreadsheet = SpreadsheetApp.openById(config.sheetId);
  let sheet = spreadsheet.getSheetByName(SHEETS_CONFIG.MAIN_SHEET);
  if (!sheet) {
    sheet = crearHojaPrincipal(spreadsheet);
  }

  const data = sheet.getDataRange().getValues();
  const headers = data[0];
  const keyColIndex = headers.indexOf('Key');
  const existingKeys = new Map(data.slice(1).map((row, index) => [row[keyColIndex], index + 2]));

  const updates = [];
  const inserts = [];

  sheetData.forEach(rowData => {
    const issueKey = rowData[keyColIndex];
    if (existingKeys.has(issueKey)) {
      updates.push({ rowNumber: existingKeys.get(issueKey), data: rowData });
    } else {
      inserts.push(rowData);
    }
  });

  if (updates.length > 0) {
    logEstructurado('INFO', `🔄 Actualizando ${updates.length} issues existentes.`);
    updates.forEach(update => sheet.getRange(update.rowNumber, 1, 1, update.data.length).setValues([update.data]));
  }

  if (inserts.length > 0) {
    logEstructurado('INFO', `➕ Insertando ${inserts.length} issues nuevos.`);
    sheet.getRange(sheet.getLastRow() + 1, 1, inserts.length, inserts[0].length).setValues(inserts);
  }
  
  aplicarFormatoYValidacion(sheet);
}

/**
 * Función principal: Sincronización Sheets → Jira.
 */
function sincronizarSheetsAJira() {
  return operacionCriticaConLock(() => {
    const tiempoInicio = Date.now();
    logEstructurado('INFO', '🔼 Iniciando sincronización Sheets → Jira');
    
    const cambios = detectarCambiosEnSheets();
    if (cambios.length === 0) {
      logEstructurado('INFO', 'Sin cambios pendientes en Sheets para sincronizar.');
      return;
    }

    logEstructurado('INFO', `Procesando ${cambios.length} cambios de Sheets a Jira.`);
    const cambiosProcesados = procesarCambiosEnLotes(cambios);
    
    const tiempoTotal = Date.now() - tiempoInicio;
    new MetricsCollector().recordTiming('sync_sheets_to_jira', tiempoTotal);
    new MetricsCollector().incrementCounter('sync_sheets_success');

    logEstructurado('SUCCESS', `✅ Sincronización Sheets → Jira completada.`, {
      cambiosProcesados,
      tiempoEjecucionSeg: (tiempoTotal / 1000).toFixed(2)
    });
  });
}

/**
 * Detecta filas marcadas como 'PENDING' en la hoja para sincronizar con Jira.
 * @returns {Array<Object>} Un array de objetos, cada uno representando un cambio.
 */
function detectarCambiosEnSheets() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEETS_CONFIG.MAIN_SHEET);
  if (!sheet) return [];

  const data = sheet.getDataRange().getValues();
  const headers = data[0];
  const syncStatusCol = headers.indexOf('Sync Status');
  const keyCol = headers.indexOf('Key');
  const statusCol = headers.indexOf('Status');
  const assigneeCol = headers.indexOf('Assignee');
  const priorityCol = headers.indexOf('Priority');

  const cambios = [];
  for (let i = 1; i < data.length; i++) {
    if (data[i][syncStatusCol] === 'PENDING') {
      cambios.push({
        issueKey: data[i][keyCol],
        rowIndex: i + 1,
        changes: {
          status: data[i][statusCol],
          assignee: data[i][assigneeCol],
          priority: data[i][priorityCol]
        }
      });
    }
  }
  return cambios;
}

/**
 * Procesa los cambios detectados en la hoja y los aplica a Jira.
 * @param {Array<Object>} cambios - Un array de cambios a procesar.
 * @returns {number} El número de cambios procesados exitosamente.
 */
function procesarCambiosEnLotes(cambios) {
  const jiraApi = new JiraApiManager();
  let cambiosProcesados = 0;

  for (const cambio of cambios) {
    try {
      aplicarCambioAJira(jiraApi, cambio);
      actualizarEstadoSincronizacion(cambio.rowIndex, 'OK', null);
      cambiosProcesados++;
    } catch (error) {
      registrarError(error, 'procesarCambiosEnLotes');
      actualizarEstadoSincronizacion(cambio.rowIndex, 'ERROR', error.message);
    }
    if (shouldBreakForTimeout()) {
      logEstructurado('WARN', 'Interrupción por timeout durante el procesamiento de cambios.');
      break;
    }
  }
  return cambiosProcesados;
}

/**
 * Aplica un cambio específico a un issue de Jira.
 * @param {JiraApiManager} jiraApi - La instancia del gestor de la API de Jira.
 * @param {Object} cambio - El objeto de cambio a aplicar.
 */
function aplicarCambioAJira(jiraApi, cambio) {
  logEstructurado('INFO', `🔄 Aplicando cambios a ${cambio.issueKey}`, cambio.changes);
  
  const updateData = { fields: {} };
  if (cambio.changes.assignee !== undefined) {
    updateData.fields.assignee = cambio.changes.assignee ? { emailAddress: cambio.changes.assignee } : null;
  }
  if (cambio.changes.priority) {
    updateData.fields.priority = { name: cambio.changes.priority };
  }

  if (Object.keys(updateData.fields).length > 0) {
    jiraApi.updateIssue(cambio.issueKey, updateData);
  }
  
  // El cambio de estado se maneja por separado y al final a través de transiciones
  if (cambio.changes.status) {
    jiraApi.transitionIssueStatus(cambio.issueKey, cambio.changes.status);
  }
}

/**
 * Sincronización completa bidireccional.
 */
function sincronizacionCompleta() {
  logEstructurado('INFO', '🔄 Iniciando sincronización completa bidireccional.');
  sincronizarJiraASheets();
  Utilities.sleep(2000); // Pequeña pausa
  sincronizarSheetsAJira();
  logEstructurado('SUCCESS', '✅ Sincronización completa finalizada.');
}

/**
 * Actualiza el estado de sincronización de una fila en la hoja.
 * @param {number} rowIndex - El índice de la fila a actualizar.
 * @param {string} status - El nuevo estado ('OK', 'ERROR', 'PENDING').
 * @param {string|null} errorMessage - Un mensaje de error si lo hay.
 */
function actualizarEstadoSincronizacion(rowIndex, status, errorMessage = null) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEETS_CONFIG.MAIN_SHEET);
  if (!sheet) return;
  
  const syncStatusCol = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0].indexOf('Sync Status') + 1;
  if (syncStatusCol > 0) {
    const cell = sheet.getRange(rowIndex, syncStatusCol);
    cell.setValue(status);
    if (errorMessage) {
      cell.setNote(errorMessage);
    } else {
      cell.clearNote();
    }
  }
}

/**
 * Crea la hoja principal con su estructura y formato.
 * @param {Spreadsheet} spreadsheet - La hoja de cálculo.
 * @returns {Sheet} La hoja creada.
 */
function crearHojaPrincipal(spreadsheet) {
  logEstructurado('INFO', 'Creando hoja principal de issues...');
  const sheet = spreadsheet.insertSheet(SHEETS_CONFIG.MAIN_SHEET, 0);
  const headers = Object.values(SHEET_COLUMNS);
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  aplicarFormatoYValidacion(sheet);
  return sheet;
}

/**
 * Crea la estructura completa de hojas si no existen.
 */
function crearEstructuraCompletaSheets() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  const sheetNames = Object.values(SHEETS_CONFIG);

  sheetNames.forEach(name => {
    if (!spreadsheet.getSheetByName(name)) {
      logEstructurado('INFO', `La hoja "${name}" no existe. Creándola...`);
      const sheet = spreadsheet.insertSheet(name);
      
      if (name === SHEETS_CONFIG.MAIN_SHEET) {
        const headers = Object.values(SHEET_COLUMNS);
        sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
        aplicarFormatoYValidacion(sheet);
      } else if (name === SHEETS_CONFIG.LOG_SHEET) {
        sheet.getRange('A1:D1').setValues([['Timestamp', 'Level', 'Message', 'Context']]).setFontWeight('bold');
      } else if (name === SHEETS_CONFIG.ERROR_LOG_SHEET) {
        sheet.getRange('A1:E1').setValues([['Timestamp', 'Usuario', 'Función', 'Mensaje', 'Stack']]).setFontWeight('bold');
      }
    } else {
      logEstructurado('DEBUG', `La hoja "${name}" ya existe. Omitiendo creación.`);
    }
  });
}

/**
 * Aplica formato y reglas de validación a la hoja principal.
 * @param {Sheet} sheet - La hoja a la que se aplicará el formato.
 */
function aplicarFormatoYValidacion(sheet) {
  const headers = Object.values(SHEET_COLUMNS);
  sheet.getRange(1, 1, 1, headers.length)
    .setFontWeight('bold').setBackground('#4285f4').setFontColor('white').setHorizontalAlignment('center');
  sheet.setFrozenRows(1);

  const rules = getValidationRules();
  const statusColIndex = headers.indexOf('Status');
  const priorityColIndex = headers.indexOf('Priority');
  
  if (statusColIndex !== -1) {
    const statusCol = String.fromCharCode('A'.charCodeAt(0) + statusColIndex);
    sheet.getRange(`${statusCol}2:${statusCol}`).setDataValidation(SpreadsheetApp.newDataValidation().requireValueInList(rules.Status).build());
  }
  
  if (priorityColIndex !== -1) {
    const priorityCol = String.fromCharCode('A'.charCodeAt(0) + priorityColIndex);
    sheet.getRange(`${priorityCol}2:${priorityCol}`).setDataValidation(SpreadsheetApp.newDataValidation().requireValueInList(rules.Priority).build());
  }
  
  sheet.autoResizeColumns(1, headers.length);
}

/**
 * Verifica si el script está a punto de alcanzar el límite de tiempo de ejecución.
 * @returns {boolean} Verdadero si el tiempo de ejecución está cerca del límite.
 */
function shouldBreakForTimeout() {
  const executionStart = PropertiesService.getScriptProperties().getProperty('EXECUTION_START');
  if (!executionStart) return false;
  return (Date.now() - parseInt(executionStart)) > APPS_SCRIPT_LIMITS.EXECUTION_BUFFER_MS;
}

/**
 * Muestra la configuración actual en un diálogo.
 */
function mostrarConfiguracion() {
  try {
    const config = obtenerConfiguracion();
    const mensaje = `
      Domain: ${config.domain}
      Email: ${config.email}
      Proyectos: ${config.projects.join(', ')}
      Sheet ID: ${config.sheetId.substring(0, 15)}...
      Entorno: ${config.environment}
    `;
    SpreadsheetApp.getUi().alert('🔧 Configuración Actual', mensaje, SpreadsheetApp.getUi().ButtonSet.OK);
  } catch (e) {
    registrarError(e, 'mostrarConfiguracion');
    SpreadsheetApp.getUi().alert('Error', 'No se pudo cargar la configuración. Ejecute el Setup Inicial.', SpreadsheetApp.getUi().ButtonSet.OK);
  }
}

/**
 * Muestra el resultado del Health Check en un diálogo.
 */
function mostrarHealthCheck() {
  const health = healthCheck();
  const mensaje = `
    Estado General: ${health.status}
    ${health.checks.map(c => `${c.status === 'OK' ? '✅' : '❌'} ${c.name}: ${c.details || c.error || ''}`).join('\n')}
  `;
  SpreadsheetApp.getUi().alert('📊 Health Check', mensaje, SpreadsheetApp.getUi().ButtonSet.OK);
}

/**
 * Muestra las métricas del día en un diálogo.
 */
function mostrarMetricas() {
  const reporte = new MetricsCollector().getMetricsReport();
  const quota = new QuotaManager();
  const mensaje = `
    Syncs Jira->Sheets: ${reporte.sync_jira_success || 0}
    Syncs Sheets->Jira: ${reporte.sync_sheets_success || 0}
    Errores totales: ${reporte.errors_total || 0}
    URL Fetches hoy: ${quota.getUso('urlFetch')} / ${APPS_SCRIPT_LIMITS.URL_FETCH_DAILY}
  `;
  SpreadsheetApp.getUi().alert('📈 Métricas del Día', mensaje, SpreadsheetApp.getUi().ButtonSet.OK);
}

// ========================================
// FUNCIONES DE REPORTES DE SPRINTS
// ========================================

/**
 * Inicia el flujo para generar el reporte por proyecto.
 */
function iniciarReportePorProyecto() {
  mostrarDialogoGrupos('generarReportePorProyecto');
}

/**
 * Inicia el flujo para generar el reporte por asignado.
 */
function iniciarReportePorAsignado() {
  mostrarDialogoGrupos('generarReportePorAsignado');
}

function mostrarDialogoGrupos(targetFunction) {
  const ui = SpreadsheetApp.getUi();
  try {
    const { gruposValidos } = obtenerGruposDeSprintsPorPrefijo();
    if (gruposValidos.length === 0) {
      ui.alert('No se encontraron sprints con la nomenclatura "Q#-S#-Año".');
      return;
    }
    const html = crearHtmlParaDialogo(gruposValidos, targetFunction);
    ui.showModalDialog(html, 'Selecciona un Periodo de Sprint');
  } catch (e) {
    registrarError(e, 'mostrarDialogoGrupos');
    ui.alert('Error', e.message);
  }
}

function crearHtmlParaDialogo(grupos, targetFunction) {
  let html = `
    <style>
      body { font-family: Arial, sans-serif; padding: 10px; }
      select { width: 100%; padding: 8px; margin-bottom: 10px; border-radius: 4px; border: 1px solid #ccc; }
      button { padding: 10px 15px; border: none; background-color: #4285f4; color: white; border-radius: 4px; cursor: pointer; }
      button:hover { background-color: #357ae8; }
      #loader { display: none; text-align: center; padding-top: 20px; }
    </style>
    <div id="form">
      <label for="sprint-select">Selecciona el período:</label>
      <select id="sprint-select">
  `;
  
  grupos.forEach(grupo => {
    const textoMostrado = parseSprintForDisplay(grupo);
    html += `<option value="${grupo}">${textoMostrado}</option>`;
  });
  
  html += `
      </select>
      <button onclick="ejecutarReporte()">Generar Reporte</button>
    </div>
    <div id="loader">
      <p>🔄 Generando reporte, por favor espera...</p>
    </div>
    <script>
      function ejecutarReporte() {
        document.getElementById('form').style.display = 'none';
        document.getElementById('loader').style.display = 'block';
        const grupoSeleccionado = document.getElementById('sprint-select').value;
        google.script.run
              .withSuccessHandler(() => google.script.host.close())
              .withFailureHandler(err => { alert('Error: ' + err); google.script.host.close(); })
              .${targetFunction}(grupoSeleccionado);
      }
    </script>
  `;
  
  return HtmlService.createHtmlOutput(html).setWidth(350).setHeight(150);
}



function generarReportePorAsignado(prefijo) {
  generarReporteGenerico(prefijo, 'asignado');
}

/**
 * Función maestra que genera cualquier tipo de reporte de sprint.
 * @param {string} prefijo - El prefijo del período de sprint.
 * @param {string} tipo - El tipo de reporte: 'proyecto' o 'asignado'.
 */
function generarReporteGenerico(prefijo, tipo) {
  const esPorProyecto = tipo === 'proyecto';
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  const sheetName = esPorProyecto ? `Reporte_Proyecto_${prefijo}` : `Reporte_Asignado_${prefijo}`;
  let sheet = spreadsheet.getSheetByName(sheetName) || spreadsheet.insertSheet(sheetName);
  sheet.clear();
  spreadsheet.setActiveSheet(sheet);

  try {
    mostrarMensajeDeProgreso(sheet, '🔄 Obteniendo datos de Jira, por favor espera...');
    logEstructurado('INFO', `🎯 Iniciando reporte por ${tipo.toUpperCase()} para: ${prefijo}`);
    
    const sprints = obtenerSprintsPorPrefijo(prefijo);
    if (sprints.length === 0) throw new Error(`No se encontraron sprints para "${prefijo}".`);

    const sprintIds = sprints.map(s => s.id);
    const orderBy = esPorProyecto ? 'project, status' : 'assignee, status';
    const jql = `sprint IN (${sprintIds.join(',')}) AND updated >= -90d ORDER BY ${orderBy}`;
    
    const tareas = new JiraApiManager().fetchJiraAPI(`/rest/api/3/search`, { jql });

    if (!tareas || !tareas.issues || tareas.issues.length === 0) {
      mostrarMensajeDeProgreso(sheet, `✅ No se encontraron tareas para "${prefijo}".`);
      return;
    }
    
    mostrarMensajeDeProgreso(sheet, '📊 Analizando entregables y agrupando tareas...');
    
    if (esPorProyecto) {
      const tareasAgrupadas = agruparTareasPorProyecto(tareas.issues);
      mostrarMensajeDeProgreso(sheet, '✍️ Escribiendo reporte en la hoja de cálculo...');
      escribirReportePersonalizadoEnHoja(sheet, tareasAgrupadas, prefijo, sprints);
    } else {
      const tareasAgrupadas = agruparTareasPorAsignado(tareas.issues);
      mostrarMensajeDeProgreso(sheet, '✍️ Escribiendo reporte en la hoja de cálculo...');
      escribirReportePorAsignadoEnHoja(sheet, tareasAgrupadas, prefijo, sprints);
    }
    
    // El mensaje final se muestra dentro de la función de escritura para asegurar que terminó.
    // Lo movemos aquí para consistencia.
    mostrarMensajeDeProgreso(sheet, '✅ ¡Reporte completado!');

  } catch (e) {
    registrarError(e, `generarReporteGenerico (${tipo})`);
    mostrarMensajeDeProgreso(sheet, `❌ Error: ${e.message}`);
  }
}

function obtenerGruposDeSprintsPorPrefijo() {
  const todosLosSprints = obtenerTodosLosSprints();
  const grupos = new Set();
  const sprintsNoConformes = [];
  const regex = /^Q([1-4])\s*-\s*S([1-6])\s*-\s*(\d{2,4})/; 

  todosLosSprints.forEach(sprint => {
    const match = sprint.name.trim().match(regex);
    if (match) {
      let anio = match[3].length === 4 ? match[3].substring(2) : match[3];
      grupos.add(`Q${match[1]}-S${match[2]}-${anio}`);
    } else {
      sprintsNoConformes.push(sprint.name);
    }
  });
  return { gruposValidos: Array.from(grupos).sort(), sprintsNoConformes };
}

/**
 * Convierte un prefijo de sprint (ej. Q1-S2-24) a un formato legible.
 * @param {string} prefijo - El prefijo del sprint.
 * @returns {string} El texto formateado para mostrar.
 */
function parseSprintForDisplay(prefijo) {
  const match = prefijo.match(/^Q([1-4])-S([1-6])-(\d{2})$/);
  if (!match) return prefijo; // Devuelve el original si no coincide

  const [, trimestre, sprint, anio] = match;
  return `Trimestre ${trimestre}, Sprint ${sprint} - 20${anio}`;
}

function obtenerSprintsPorPrefijo(prefijo) {
  const todosLosSprints = obtenerTodosLosSprints();
  const regex = /^Q([1-4])\s*-\s*S([1-6])\s*-\s*(\d{2,4})/; 
  return todosLosSprints.filter(sprint => {
    const match = sprint.name.trim().match(regex);
    if (!match) return false;
    let anio = match[3].length === 4 ? match[3].substring(2) : match[3];
    return `Q${match[1]}-S${match[2]}-${anio}` === prefijo;
  });
}

function agruparTareasPorProyecto(tareas) {
  return tareas.reduce((acc, tarea) => {
    const proyecto = tarea.fields.project.name;
    if (!acc[proyecto]) acc[proyecto] = [];
    acc[proyecto].push(tarea);
    return acc;
  }, {});
}

function escribirReportePersonalizadoEnHoja(sheet, tareasAgrupadas, prefijo, sprints) {
  const output = [];
  
  // Títulos e información
  output.push([`📊 REPORTE DE SPRINTS: ${prefijo}`]);
  output.push([]); // Fila vacía
  output.push(['Sprints incluidos:', sprints.map(s => s.name).join(', ')]);
  output.push([]); // Fila vacía

  // Encabezados
  const headers = ["Key", "Resumen", "Asignado", "Tipo de Incidencia", "Fecha de vencimiento", "Etiquetas", "Score", "Calidad", "Resumen Entregables"];
  output.push(headers);

  // Procesar datos
  for (const proyecto in tareasAgrupadas) {
    output.push([`🏢 PROYECTO: ${proyecto}`]); // Fila de agrupación
    
    tareasAgrupadas[proyecto].forEach(tarea => {
      const analisis = evaluarEntregablesYEvidencia(tarea);
      const fechaVencimiento = tarea.fields.duedate ? new Date(tarea.fields.duedate).toLocaleDateString() : 'N/A';
      output.push([
        tarea.key,
        tarea.fields.summary,
        tarea.fields.assignee?.displayName || 'Sin Asignar',
        tarea.fields.issuetype?.name || 'N/A',
        fechaVencimiento,
        (tarea.fields.labels || []).join(', '),
        analisis.puntuacion, 
        `${analisis.calidad.emoji} ${analisis.calidad.texto}`, 
        analisis.resumen
      ]);
    });
  }

  // Escribir todo de una vez
  sheet.getRange(1, 1, output.length, headers.length).setValues(output);

  // Aplicar formato después de escribir
  sheet.getRange(1, 1).setFontSize(16).setFontWeight('bold');
  sheet.getRange(3, 1).setFontWeight('bold');
  sheet.getRange(5, 1, 1, headers.length).setBackground('#4285f4').setFontColor('white').setFontWeight('bold');

  let filaActual = 6; // Empezar a formatear después de los encabezados
  for (const proyecto in tareasAgrupadas) {
    sheet.getRange(filaActual, 1, 1, headers.length).merge().setBackground('#f0f0f0').setFontWeight('bold');
    filaActual += tareasAgrupadas[proyecto].length + 1;
  }
  
  // Formato de calidad (esto aún requiere iterar, pero es más rápido sobre datos ya escritos)
  let dataRowIndex = 6;
  for (const proyecto in tareasAgrupadas) {
    dataRowIndex++; // Saltar fila de proyecto
    tareasAgrupadas[proyecto].forEach(tarea => {
      const analisis = evaluarEntregablesYEvidencia(tarea);
      sheet.getRange(dataRowIndex, headers.indexOf('Calidad') + 1).setBackground(analisis.calidad.color);
      dataRowIndex++;
    });
  }

  sheet.autoResizeColumns(1, headers.length);
}

// ========================================
// NUEVO REPORTE POR ASIGNADO
// ========================================

/**
 * Genera el reporte de sprint agrupado por asignado.
 * @param {string} prefijo - El prefijo del período de sprint.
 */


/**
 * Agrupa las tareas por la persona asignada.
 * @param {Array<Object>} tareas - La lista de tareas de Jira.
 * @returns {Object} Tareas agrupadas por nombre de asignado.
 */
function agruparTareasPorAsignado(tareas) {
  return tareas.reduce((acc, tarea) => {
    const asignado = tarea.fields.assignee ? tarea.fields.assignee.displayName : 'Sin Asignar';
    if (!acc[asignado]) acc[asignado] = [];
    acc[asignado].push(tarea);
    return acc;
  }, {});
}

/**
 * Escribe el reporte agrupado por asignado en la hoja de cálculo.
 * @param {Sheet} sheet - La hoja de destino.
 * @param {Object} tareasAgrupadas - Tareas agrupadas por asignado.
 * @param {string} prefijo - El prefijo del período.
 * @param {Array<Object>} sprints - La lista de sprints incluidos.
 */
function escribirReportePorAsignadoEnHoja(sheet, tareasAgrupadas, prefijo, sprints) {
  const output = [];
  
  // Títulos e información
  output.push([`📊 REPORTE POR ASIGNADO: ${prefijo}`]);
  output.push([]);
  output.push(['Sprints incluidos:', sprints.map(s => s.name).join(', ')]);
  output.push([]);

  // Encabezados actualizados
  const headers = ["Key", "Resumen", "Proyecto", "Tipo de Incidencia", "Fecha de vencimiento", "Etiquetas", "Score", "Calidad"];
  output.push(headers);

  // Procesar datos
  for (const asignado in tareasAgrupadas) {
    output.push([`👤 ASIGNADO: ${asignado}`]);
    
    const tareasDelAsignado = tareasAgrupadas[asignado];
    tareasDelAsignado.forEach(tarea => {
      const analisis = evaluarEntregablesYEvidencia(tarea);
      const fechaVencimiento = tarea.fields.duedate ? new Date(tarea.fields.duedate).toLocaleDateString() : 'N/A';
      output.push([
        tarea.key,
        tarea.fields.summary,
        tarea.fields.project.name,
        tarea.fields.issuetype?.name || 'N/A',
        fechaVencimiento,
        (tarea.fields.labels || []).join(', '),
        analisis.puntuacion, 
        `${analisis.calidad.emoji} ${analisis.calidad.texto}`
      ]);
    });

    // Calcular y añadir estadísticas
    const estadisticas = calcularEstadisticasDeEntregables(tareasDelAsignado);
    output.push([
      `Estadísticas:`,
      `Tareas: ${estadisticas.totalTareas}`,
      `Score Promedio: ${estadisticas.scorePromedio.toFixed(2)}`,
      `Calidad: ${estadisticas.resumenCalidad}`
    ]);
    output.push([]); // Espacio extra
  }

  // Escribir todo de una vez
  sheet.getRange(1, 1, output.length, headers.length).setValues(output);

  // Aplicar formato después de escribir
  sheet.getRange(1, 1).setFontSize(16).setFontWeight('bold');
  sheet.getRange(3, 1).setFontWeight('bold');
  sheet.getRange(5, 1, 1, headers.length).setBackground('#34a853').setFontColor('white').setFontWeight('bold');

  let filaActual = 6;
  for (const asignado in tareasAgrupadas) {
    sheet.getRange(filaActual, 1, 1, headers.length).merge().setBackground('#f0f0f0').setFontWeight('bold');
    filaActual++;
    
    tareasAgrupadas[asignado].forEach(tarea => {
      const analisis = evaluarEntregablesYEvidencia(tarea);
      sheet.getRange(filaActual, headers.indexOf('Calidad') + 1).setBackground(analisis.calidad.color);
      filaActual++;
    });
    
    sheet.getRange(filaActual, 1, 1, 4).setFontStyle('italic').setBackground('#e6f4ea');
    filaActual += 2;
  }

  sheet.autoResizeColumns(1, headers.length);
}

/**
 * Calcula estadísticas de entregables para un conjunto de tareas.
 * @param {Array<Object>} tareas - Lista de tareas de un asignado.
 * @returns {Object} Objeto con las estadísticas calculadas.
 */
function calcularEstadisticasDeEntregables(tareas) {
  if (tareas.length === 0) {
    return { totalTareas: 0, scorePromedio: 0, resumenCalidad: 'N/A' };
  }

  let scoreTotal = 0;
  const conteoCalidad = {};

  tareas.forEach(tarea => {
    const analisis = evaluarEntregablesYEvidencia(tarea);
    scoreTotal += analisis.puntuacion;
    const nivel = analisis.calidad.texto;
    conteoCalidad[nivel] = (conteoCalidad[nivel] || 0) + 1;
  });

  const resumenCalidad = Object.entries(conteoCalidad)
    .map(([nivel, count]) => `${count} ${nivel}`)
    .join(', ');

  return {
    totalTareas: tareas.length,
    scorePromedio: scoreTotal / tareas.length,
    resumenCalidad: resumenCalidad
  };
}

/**
 * Muestra un mensaje de progreso en la primera celda de una hoja.
 * @param {Sheet} sheet - La hoja donde se mostrará el mensaje.
 * @param {string} mensaje - El texto a mostrar.
 */
function mostrarMensajeDeProgreso(sheet, mensaje) {
  sheet.getRange("A1").setValue(mensaje);
  SpreadsheetApp.flush(); // Forzar la actualización de la UI
}
