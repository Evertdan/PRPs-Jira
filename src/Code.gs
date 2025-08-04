/**
 * Code.gs - Funciones principales y punto de entrada
 * Implementa funcionalidades principales de sincronización Jira ↔ Google Sheets
 * Siguiendo patrones obligatorios de CLAUDE.md
 */

/**
 * Función ejecutada al abrir Google Sheets
 * Crea menú personalizado para operaciones de sincronización
 */
function onOpen() {
  const ui = SpreadsheetApp.getUi();
  
  ui.createMenu('🔄 Jira Sync')
    .addItem('🔽 Sincronizar Jira → Sheets', 'sincronizarJiraASheets')
    .addItem('🔼 Sincronizar Sheets → Jira', 'sincronizarSheetsAJira')
    .addSeparator()
    .addItem('🔄 Sincronización Completa', 'sincronizacionCompleta')
    .addItem('⚙️ Configurar Sincronización', 'mostrarConfiguracion')
    .addSeparator()
    .addItem('📊 Health Check', 'mostrarHealthCheck')
    .addItem('📈 Ver Métricas', 'mostrarMetricas')
    .addItem('🧹 Limpiar Logs', 'limpiarLogs')
    .addSeparator()
    .addItem('🧪 Ejecutar Tests', 'runTests')
    .addItem('🚀 Setup Inicial', 'setupInicial')
    .addToUi();
  
  // Logging de versión en cada apertura
  const versionInfo = getVersion();
  logEstructurado('INFO', 'Jira Sync inicializado', versionInfo);
}

/**
 * Función principal: Sincronización Jira → Google Sheets
 * Descarga issues de proyectos configurados y actualiza Sheets
 */
function sincronizarJiraASheets() {
  return operacionCriticaConLock(() => {
    const metrics = new MetricsCollector();
    const tiempoInicio = Date.now();
    
    try {
      // Marcar inicio de ejecución
      PropertiesService.getScriptProperties().setProperty('EXECUTION_START', Date.now().toString());
      
      logEstructurado('INFO', '🔽 Iniciando sincronización Jira → Sheets');
      
      // Obtener configuración
      const config = obtenerConfiguracion();
      const proyectos = config.projects;
      
      const ultimaSyncStr = PropertiesService.getScriptProperties().getProperty('LAST_SYNC_TIMESTAMP');
      const ultimaSync = ultimaSyncStr ? new Date(parseInt(ultimaSyncStr)) : null;
      
      logEstructurado('INFO', 'Configuración cargada', {
        proyectos: proyectos.length,
        ultimaSync: ultimaSync ? ultimaSync.toISOString() : 'Primera sincronización'
      });
      
      let totalIssues = 0;
      
      // Procesar cada proyecto
      for (const proyecto of proyectos) {
        const issuesProyecto = sincronizarProyecto(proyecto, ultimaSync);
        totalIssues += issuesProyecto;
        
        // Verificar timeout entre proyectos
        if (shouldBreakForTimeout()) {
          logEstructurado('WARN', 'Interrumpiendo sincronización por timeout', {
            proyectosProcesados: proyectos.indexOf(proyecto) + 1,
            totalProyectos: proyectos.length
          });
          break;
        }
      }
      
      // Actualizar timestamp de última sincronización
      PropertiesService.getScriptProperties().setProperty('LAST_SYNC_TIMESTAMP', Date.now().toString());
      
      // Registrar métricas
      const tiempoTotal = Date.now() - tiempoInicio;
      metrics.recordTiming('sync_jira_to_sheets', tiempoTotal);
      metrics.incrementCounter('sync_jira_success');
      
      const resultado = {
        issuesSincronizados: totalIssues,
        tiempoEjecucion: tiempoTotal,
        proyectos: proyectos.length
      };
      
      logEstructurado('SUCCESS', '✅ Sincronización Jira → Sheets completada', resultado);
      registrarEventoSync(`Sincronizados ${totalIssues} issues en ${(tiempoTotal/1000).toFixed(1)}s`, 'SUCCESS');
      
      return resultado;
      
    } catch (error) {
      metrics.recordError('sync_jira_error', { error: error.message });
      logEstructurado('ERROR', '❌ Error en sincronización Jira → Sheets', { error: error.message });
      registrarEventoSync(`Error: ${error.message}`, 'ERROR');
      throw error;
    }
  });
}

/**
 * Sincroniza issues de un proyecto específico
 * @param {string} projectKey - Clave del proyecto
 * @param {Date} ultimaSync - Fecha de última sincronización
 * @returns {number} Número de issues sincronizados
 */
function sincronizarProyecto(projectKey, ultimaSync) {
  logEstructurado('INFO', `📋 Sincronizando proyecto ${projectKey}`);
  
  try {
    const jiraApi = new JiraApiManager();
    
    // Obtener issues del proyecto
    const issues = jiraApi.getAllIssuesFromProject(projectKey, ultimaSync);
    
    if (issues.length === 0) {
      logEstructurado('INFO', `Sin cambios en proyecto ${projectKey}`);
      return 0;
    }
    
    logEstructurado('INFO', `Obtenidos ${issues.length} issues de ${projectKey}`);
    
    // Transformar issues a formato de Sheets
    const sheetData = issues.map(transformJiraIssueToSheetRow);
    
    // Actualizar Sheets en lotes
    actualizarSheetsEnLotes(sheetData);
    
    logEstructurado('SUCCESS', `✅ Proyecto ${projectKey} sincronizado: ${issues.length} issues`);
    return issues.length;
    
  } catch (error) {
    logEstructurado('ERROR', `❌ Error sincronizando proyecto ${projectKey}`, { error: error.message });
    throw new Error(`Error en proyecto ${projectKey}: ${error.message}`);
  }
}

/**
 * Actualiza Google Sheets con datos de issues en lotes optimizados
 * @param {Array} sheetData - Array de filas para insertar/actualizar
 */
function actualizarSheetsEnLotes(sheetData) {
  if (!sheetData || sheetData.length === 0) return;
  
  logEstructurado('INFO', `📊 Actualizando Sheets con ${sheetData.length} issues`);
  
  try {
    const config = obtenerConfiguracion();
    const spreadsheet = SpreadsheetApp.openById(config.sheetId);
    let sheet = spreadsheet.getSheetByName(SHEETS_CONFIG.MAIN_SHEET);
    
    // Crear hoja si no existe
    if (!sheet) {
      sheet = crearHojaPrincipal(spreadsheet);
    }
    
    // Obtener datos existentes para merge inteligente
    const existingData = sheet.getDataRange().getValues();
    const existingKeys = new Map();
    
    // Mapear keys existentes con sus filas (skip header row)
    for (let i = 1; i < existingData.length; i++) {
      const key = existingData[i][0]; // Column A = Key
      if (key) existingKeys.set(key, i + 1); // +1 for 1-indexed sheet rows
    }
    
    // Separar updates vs inserts
    const updates = [];
    const inserts = [];
    
    for (const rowData of sheetData) {
      const issueKey = rowData[0];
      
      if (existingKeys.has(issueKey)) {
        const rowNumber = existingKeys.get(issueKey);
        updates.push({ rowNumber, data: rowData });
      } else {
        inserts.push(rowData);
      }
    }
    
    // Ejecutar updates en batch
    if (updates.length > 0) {
      logEstructurado('INFO', `🔄 Actualizando ${updates.length} issues existentes`);
      
      for (const update of updates) {
        sheet.getRange(update.rowNumber, 1, 1, update.data.length).setValues([update.data]);
      }
    }
    
    // Ejecutar inserts en batch
    if (inserts.length > 0) {
      logEstructurado('INFO', `➕ Insertando ${inserts.length} issues nuevos`);
      
      const lastRow = sheet.getLastRow();
      sheet.getRange(lastRow + 1, 1, inserts.length, inserts[0].length).setValues(inserts);
    }
    
    // Aplicar formato y validación
    aplicarFormatoYValidacion(sheet);
    
    logEstructurado('SUCCESS', '✅ Sheets actualizado', {
      actualizados: updates.length,
      insertados: inserts.length
    });
    
  } catch (error) {
    logEstructurado('ERROR', '❌ Error actualizando Sheets', { error: error.message });
    throw error;
  }
}

/**
 * Función principal: Sincronización Sheets → Jira
 * Detecta cambios en Sheets y los aplica a Jira
 */
function sincronizarSheetsAJira() {
  return operacionCriticaConLock(() => {
    const metrics = new MetricsCollector();
    const tiempoInicio = Date.now();
    
    try {
      logEstructurado('INFO', '🔼 Iniciando sincronización Sheets → Jira');
      
      const cambios = detectarCambiosEnSheets();
      
      if (cambios.length === 0) {
        logEstructurado('INFO', 'Sin cambios pendientes en Sheets');
        return { cambiosProcesados: 0 };
      }
      
      logEstructurado('INFO', `Procesando ${cambios.length} cambios detectados`);
      
      // Procesar cambios en lotes para respetar rate limits
      const cambiosProcesados = procesarCambiosEnLotes(cambios);
      
      // Registrar métricas
      const tiempoTotal = Date.now() - tiempoInicio;
      metrics.recordTiming('sync_sheets_to_jira', tiempoTotal);
      metrics.incrementCounter('sync_sheets_success');
      
      const resultado = {
        cambiosProcesados,
        tiempoEjecucion: tiempoTotal
      };
      
      logEstructurado('SUCCESS', '✅ Sincronización Sheets → Jira completada', resultado);
      registrarEventoSync(`Aplicados ${cambiosProcesados} cambios en ${(tiempoTotal/1000).toFixed(1)}s`, 'SUCCESS');
      
      return resultado;
      
    } catch (error) {
      metrics.recordError('sync_sheets_error', { error: error.message });
      logEstructurado('ERROR', '❌ Error en sincronización Sheets → Jira', { error: error.message });
      registrarEventoSync(`Error: ${error.message}`, 'ERROR');
      throw error;
    }
  });
}

/**
 * Detecta cambios en Google Sheets que necesitan sincronizarse con Jira
 * @returns {Array} Array de cambios detectados
 */
function detectarCambiosEnSheets() {
  try {
    const config = obtenerConfiguracion();
    const spreadsheet = SpreadsheetApp.openById(config.sheetId);
    const sheet = spreadsheet.getSheetByName(SHEETS_CONFIG.MAIN_SHEET);
    
    if (!sheet) {
      logEstructurado('WARN', 'Hoja principal no encontrada');
      return [];
    }
    
    const data = sheet.getDataRange().getValues();
    if (data.length <= 1) return []; // Solo headers
    
    const headers = data[0];
    const cambios = [];
    
    // Índices de columnas editables
    const editableColumns = {
      key: headers.indexOf('Key'),
      status: headers.indexOf('Status'),
      assignee: headers.indexOf('Assignee'),
      priority: headers.indexOf('Priority'),
      syncStatus: headers.indexOf('Sync Status')
    };
    
    // Verificar cada fila (skip header)
    for (let i = 1; i < data.length; i++) {
      const row = data[i];
      const issueKey = row[editableColumns.key];
      const syncStatus = row[editableColumns.syncStatus];
      
      if (!issueKey) continue;
      
      // Detectar cambios pendientes basado en Sync Status
      if (syncStatus === 'PENDING' || syncStatus === 'ERROR') {
        cambios.push({
          issueKey,
          rowIndex: i + 1, // +1 for 1-indexed sheets
          changes: {
            status: row[editableColumns.status],
            assignee: row[editableColumns.assignee],
            priority: row[editableColumns.priority]
          }
        });
      }
    }
    
    logEstructurado('INFO', `Detectados ${cambios.length} cambios pendientes`);
    return cambios;
    
  } catch (error) {
    logEstructurado('ERROR', 'Error detectando cambios en Sheets', { error: error.message });
    return [];
  }
}

/**
 * Procesa cambios en lotes respetando rate limits
 * @param {Array} cambios - Array de cambios a procesar
 * @returns {number} Número de cambios procesados exitosamente
 */
function procesarCambiosEnLotes(cambios) {
  const jiraApi = new JiraApiManager();
  const BATCH_SIZE = 10; // Procesar 10 cambios por lote
  let cambiosProcesados = 0;
  
  for (let i = 0; i < cambios.length; i += BATCH_SIZE) {
    const lote = cambios.slice(i, i + BATCH_SIZE);
    
    for (const cambio of lote) {
      try {
        aplicarCambioAJira(jiraApi, cambio);
        actualizarEstadoSincronizacion(cambio.rowIndex, 'OK');
        cambiosProcesados++;
        
      } catch (error) {
        logEstructurado('ERROR', `Error aplicando cambio a ${cambio.issueKey}`, { 
          error: error.message,
          cambio: cambio.changes
        });
        actualizarEstadoSincronizacion(cambio.rowIndex, 'ERROR');
      }
    }
    
    // Pausa entre lotes para rate limiting
    if (i + BATCH_SIZE < cambios.length) {
      Utilities.sleep(RATE_LIMITS.BATCH_DELAY_MS);
    }
    
    // Verificar timeout
    if (shouldBreakForTimeout()) {
      logEstructurado('WARN', 'Interrumpiendo por timeout', {
        procesados: cambiosProcesados,
        pendientes: cambios.length - (i + BATCH_SIZE)
      });
      break;
    }
  }
  
  return cambiosProcesados;
}

/**
 * Aplica cambios de un issue específico a Jira
 * @param {JiraApiManager} jiraApi - Instancia de la API de Jira
 * @param {Object} cambio - Objeto con cambios a aplicar
 */
function aplicarCambioAJira(jiraApi, cambio) {
  const updateData = { fields: {} };
  
  logEstructurado('INFO', `🔄 Aplicando cambios a ${cambio.issueKey}`, cambio.changes);
  
  // Manejar cambio de status con transiciones
  if (cambio.changes.status) {
    jiraApi.transitionIssueStatus(cambio.issueKey, cambio.changes.status);
  }
  
  // Preparar otros campos para update
  if (cambio.changes.assignee) {
    if (cambio.changes.assignee.trim() === '') {
      updateData.fields.assignee = null; // Desasignar
    } else {
      updateData.fields.assignee = { emailAddress: cambio.changes.assignee };
    }
  }
  
  if (cambio.changes.priority) {
    updateData.fields.priority = { name: cambio.changes.priority };
  }
  
  // Aplicar cambios de campos (no status)
  if (Object.keys(updateData.fields).length > 0) {
    jiraApi.updateIssue(cambio.issueKey, updateData);
  }
  
  logEstructurado('SUCCESS', `✅ Cambios aplicados a ${cambio.issueKey}`);
}

/**
 * Sincronización completa bidireccional
 */
function sincronizacionCompleta() {
  logEstructurado('INFO', '🔄 Iniciando sincronización completa bidireccional');
  
  try {
    // Primero Jira → Sheets
    const resultadoJiraToSheets = sincronizarJiraASheets();
    
    // Esperar un momento para que se procesen los datos
    Utilities.sleep(2000);
    
    // Luego Sheets → Jira
    const resultadoSheetsToJira = sincronizarSheetsAJira();
    
    const resultado = {
      jiraToSheets: resultadoJiraToSheets,
      sheetsToJira: resultadoSheetsToJira,
      tiempoTotal: (resultadoJiraToSheets.tiempoEjecucion || 0) + (resultadoSheetsToJira.tiempoEjecucion || 0)
    };
    
    logEstructurado('SUCCESS', '✅ Sincronización completa finalizada', resultado);
    return resultado;
    
  } catch (error) {
    logEstructurado('ERROR', '❌ Error en sincronización completa', { error: error.message });
    throw error;
  }
}

/**
 * Actualiza el estado de sincronización de una fila específica
 * @param {number} rowIndex - Índice de la fila (1-indexed)
 * @param {string} status - Estado: OK, ERROR, PENDING
 */
function actualizarEstadoSincronizacion(rowIndex, status) {
  try {
    const config = obtenerConfiguracion();
    const spreadsheet = SpreadsheetApp.openById(config.sheetId);
    const sheet = spreadsheet.getSheetByName(SHEETS_CONFIG.MAIN_SHEET);
    
    if (!sheet) return;
    
    // Actualizar columnas Last Sync (P) y Sync Status (Q)
    const lastCol = sheet.getLastColumn();
    sheet.getRange(rowIndex, lastCol - 1, 1, 2).setValues([[new Date(), status]]);
    
  } catch (error) {
    logEstructurado('ERROR', 'Error actualizando estado de sincronización', { 
      rowIndex, 
      status, 
      error: error.message 
    });
  }
}

/**
 * Crea la hoja principal con estructura y formato
 * @param {Spreadsheet} spreadsheet - Instancia del spreadsheet
 * @returns {Sheet} Hoja creada
 */
function crearHojaPrincipal(spreadsheet) {
  logEstructurado('INFO', 'Creando hoja principal de issues');
  
  const sheet = spreadsheet.insertSheet(SHEETS_CONFIG.MAIN_SHEET);
  
  // Configurar headers
  const headers = Object.values(SHEET_COLUMNS);
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  
  // Aplicar formato inicial
  aplicarFormatoYValidacion(sheet);
  
  return sheet;
}

/**
 * Aplica formato y validación de datos a la hoja
 * @param {Sheet} sheet - Hoja a formatear
 */
function aplicarFormatoYValidacion(sheet) {
  try {
    const headers = Object.values(SHEET_COLUMNS);
    
    // Formatear headers
    const headerRange = sheet.getRange(1, 1, 1, headers.length);
    headerRange
      .setFontWeight('bold')
      .setBackground('#4285f4')
      .setFontColor('white')
      .setHorizontalAlignment('center');
    
    // Congelar primera fila
    sheet.setFrozenRows(1);
    
    // Configurar validación de datos
    const validationRules = getValidationRules();
    
    // Status validation (columna C)
    const statusRule = SpreadsheetApp.newDataValidation()
      .requireValueInList(validationRules.Status, true)
      .setAllowInvalid(false)
      .build();
    sheet.getRange('C:C').setDataValidation(statusRule);
    
    // Priority validation (columna E)
    const priorityRule = SpreadsheetApp.newDataValidation()
      .requireValueInList(validationRules.Priority, true)
      .setAllowInvalid(false)
      .build();
    sheet.getRange('E:E').setDataValidation(priorityRule);
    
    // Issue Type validation (columna F)
    const issueTypeRule = SpreadsheetApp.newDataValidation()
      .requireValueInList(validationRules['Issue Type'], true)
      .setAllowInvalid(false)
      .build();
    sheet.getRange('F:F').setDataValidation(issueTypeRule);
    
    // Formatear columnas de fecha
    sheet.getRange('G:H').setNumberFormat('dd/mm/yyyy hh:mm');
    sheet.getRange('P:P').setNumberFormat('dd/mm/yyyy hh:mm');
    
    // Auto-resize columnas
    sheet.autoResizeColumns(1, headers.length);
    
    logEstructurado('INFO', 'Formato y validación aplicados a la hoja');
    
  } catch (error) {
    logEstructurado('ERROR', 'Error aplicando formato', { error: error.message });
  }
}

/**
 * Verifica si debe interrumpir por timeout de Apps Script
 * @returns {boolean} true si se acerca al límite de tiempo
 */
function shouldBreakForTimeout() {
  const executionStart = PropertiesService.getScriptProperties().getProperty('EXECUTION_START');
  if (!executionStart) return false;
  
  const tiempoEjecucion = Date.now() - parseInt(executionStart);
  return tiempoEjecucion > APPS_SCRIPT_LIMITS.EXECUTION_BUFFER_MS;
}

/**
 * Muestra diálogo de configuración
 */
function mostrarConfiguracion() {
  const config = obtenerConfiguracion();
  const mensaje = `
🔧 Configuración Actual:

Domain: ${config.domain}
Email: ${config.email}
Proyectos: ${config.projects.join(', ')}
Entorno: ${config.environment}

Para modificar, usar PropertiesService en el editor de script.
  `;
  
  SpreadsheetApp.getUi().alert('Configuración de Jira Sync', mensaje, SpreadsheetApp.getUi().ButtonSet.OK);
}

/**
 * Muestra health check en diálogo
 */
function mostrarHealthCheck() {
  const healthStatus = healthCheck();
  const mensaje = `
📊 Estado del Sistema: ${healthStatus.status}

Verificaciones:
${healthStatus.checks.map(check => 
  `${check.status === 'OK' ? '✅' : '❌'} ${check.name}: ${check.status}`
).join('\n')}

Versión: ${healthStatus.version.version}
Última actualización: ${new Date(healthStatus.timestamp).toLocaleString()}
  `;
  
  SpreadsheetApp.getUi().alert('Health Check', mensaje, SpreadsheetApp.getUi().ButtonSet.OK);
}

/**
 * Muestra métricas del día
 */
function mostrarMetricas() {
  const metrics = new MetricsCollector();
  const reporte = metrics.getMetricsReport();
  
  const mensaje = `
📈 Métricas del Día:

Sincronizaciones:
• Jira → Sheets exitosas: ${reporte.sync_jira_success || 0}
• Sheets → Jira exitosas: ${reporte.sync_sheets_success || 0}
• Errores totales: ${reporte.errors_total || 0}

Performance:
• Tiempo promedio sync: ${reporte.sync_jira_to_sheets_avg_ms || 0}ms
• Requests API: ${reporte.api_request_count || 0}

Quota Usage:
• URL Fetch: ${new QuotaManager().getUso('urlFetch')} / 20,000
  `;
  
  SpreadsheetApp.getUi().alert('Métricas', mensaje, SpreadsheetApp.getUi().ButtonSet.OK);
}

/**
 * Limpia logs antiguos
 */
function limpiarLogs() {
  try {
    limpiarLogsAntiguos();
    SpreadsheetApp.getUi().alert('✅ Logs limpiados exitosamente', '', SpreadsheetApp.getUi().ButtonSet.OK);
  } catch (error) {
    SpreadsheetApp.getUi().alert('❌ Error limpiando logs', error.message, SpreadsheetApp.getUi().ButtonSet.OK);
  }
}