/**
 * Triggers.gs - Configuración y manejo de triggers automáticos
 * Separado de Code.gs para cumplir límite de 500 líneas de CLAUDE.md
 */

/**
 * Configurar triggers automáticos para sincronización
 * Función principal para setup de automatización
 */
function configurarTriggers() {
  logEstructurado('INFO', 'Configurando triggers automáticos');
  
  // Limpiar triggers existentes del proyecto
  limpiarTriggersExistentes();
  
  const config = obtenerConfiguracionPorEntorno();
  
  // Trigger principal: Sincronización Jira → Sheets cada 15 minutos
  ScriptApp.newTrigger('triggerSyncJiraToSheets')
    .timeBased()
    .everyMinutes(config.syncInterval)
    .create();
  
  // Trigger secundario: Sincronización Sheets → Jira cada 5 minutos
  ScriptApp.newTrigger('triggerSyncSheetsToJira')
    .timeBased()
    .everyMinutes(5)
    .create();
  
  // Trigger diario: Health check a las 9 AM
  ScriptApp.newTrigger('triggerHealthCheck')
    .timeBased()
    .everyDays(1)
    .atHour(9)
    .create();
  
  // Trigger diario: Limpieza de logs a las 2 AM
  ScriptApp.newTrigger('triggerLimpiezaLogs')
    .timeBased()
    .everyDays(1)
    .atHour(2)
    .create();
  
  // Trigger semanal: Reporte de métricas los lunes a las 8 AM
  ScriptApp.newTrigger('triggerReporteMetricas')
    .timeBased()
    .onWeekDay(ScriptApp.WeekDay.MONDAY)
    .atHour(8)
    .create();
  
  const triggersCreados = ScriptApp.getProjectTriggers().length;
  logEstructurado('SUCCESS', `Triggers configurados exitosamente: ${triggersCreados} activos`);
}

/**
 * Limpiar triggers existentes del proyecto
 */
function limpiarTriggersExistentes() {
  const triggers = ScriptApp.getProjectTriggers();
  let eliminados = 0;
  
  triggers.forEach(trigger => {
    const handlerFunction = trigger.getHandlerFunction();
    
    // Solo eliminar triggers relacionados con nuestro sistema
    if (handlerFunction.startsWith('trigger') || 
        handlerFunction.includes('sync') || 
        handlerFunction.includes('Sync')) {
      ScriptApp.deleteTrigger(trigger);
      eliminados++;
    }
  });
  
  if (eliminados > 0) {
    logEstructurado('INFO', `Eliminados ${eliminados} triggers existentes`);
  }
}

/**
 * Trigger: Sincronización Jira → Sheets automática
 */
function triggerSyncJiraToSheets() {
  const metrics = new MetricsCollector();
  const tiempoInicio = Date.now();
  
  try {
    logEstructurado('INFO', '🤖 Trigger automático: Jira → Sheets');
    
    const resultado = sincronizarJiraASheets();
    
    metrics.recordTiming('trigger_jira_to_sheets', Date.now() - tiempoInicio);
    metrics.incrementCounter('trigger_jira_success');
    
    logEstructurado('SUCCESS', '✅ Trigger Jira → Sheets completado', resultado);
    
  } catch (error) {
    metrics.recordError('trigger_jira_error', { error: error.message });
    logEstructurado('ERROR', '❌ Error en trigger Jira → Sheets', { error: error.message });
    
    // Enviar alerta si está configurada
    enviarAlertaError('Trigger Jira → Sheets', error.message);
  }
}

/**
 * Trigger: Sincronización Sheets → Jira automática
 */
function triggerSyncSheetsToJira() {
  const metrics = new MetricsCollector();
  const tiempoInicio = Date.now();
  
  try {
    logEstructurado('INFO', '🤖 Trigger automático: Sheets → Jira');
    
    const resultado = sincronizarSheetsAJira();
    
    metrics.recordTiming('trigger_sheets_to_jira', Date.now() - tiempoInicio);
    metrics.incrementCounter('trigger_sheets_success');
    
    logEstructurado('SUCCESS', '✅ Trigger Sheets → Jira completado', resultado);
    
  } catch (error) {
    metrics.recordError('trigger_sheets_error', { error: error.message });
    logEstructurado('ERROR', '❌ Error en trigger Sheets → Jira', { error: error.message });
    
    enviarAlertaError('Trigger Sheets → Jira', error.message);
  }
}

/**
 * Trigger: Health check diario automático
 */
function triggerHealthCheck() {
  try {
    logEstructurado('INFO', '🤖 Trigger automático: Health Check diario');
    
    const health = healthCheck();
    
    if (health.status !== 'HEALTHY') {
      logEstructurado('WARN', '⚠️ Sistema no está completamente saludable', health);
      enviarAlertaHealthCheck(health);
    } else {
      logEstructurado('SUCCESS', '✅ Health check diario: Sistema saludable');
    }
    
  } catch (error) {
    logEstructurado('ERROR', '❌ Error en health check automático', { error: error.message });
    enviarAlertaError('Health Check', error.message);
  }
}

/**
 * Trigger: Limpieza automática de logs
 */
function triggerLimpiezaLogs() {
  try {
    logEstructurado('INFO', '🤖 Trigger automático: Limpieza de logs');
    
    limpiarLogsAntiguos();
    
    // También limpiar métricas y contadores antiguos (más de 7 días)
    const quota = new QuotaManager();
    const metrics = new MetricsCollector();
    
    // Esto se hace automáticamente en sus métodos guardar()
    quota.guardar();
    metrics.guardar();
    
    logEstructurado('SUCCESS', '✅ Limpieza automática completada');
    
  } catch (error) {
    logEstructurado('ERROR', '❌ Error en limpieza automática', { error: error.message });
  }
}

/**
 * Trigger: Reporte semanal de métricas
 */
function triggerReporteMetricas() {
  try {
    logEstructurado('INFO', '🤖 Trigger automático: Reporte semanal de métricas');
    
    const metrics = new MetricsCollector();
    const quota = new QuotaManager();
    
    // Generar reporte de la semana
    const reporte = generarReporteSemanal(metrics, quota);
    
    // Enviar reporte por email si está configurado
    enviarReporteSemanal(reporte);
    
    logEstructurado('SUCCESS', '✅ Reporte semanal enviado');
    
  } catch (error) {
    logEstructurado('ERROR', '❌ Error generando reporte semanal', { error: error.message });
  }
}

/**
 * Envía alerta por email cuando ocurre un error crítico
 * @param {string} origen - Origen del error
 * @param {string} mensaje - Mensaje de error
 */
function enviarAlertaError(origen, mensaje) {
  try {
    const alertEmail = PropertiesService.getScriptProperties().getProperty('ALERT_EMAIL');
    if (!alertEmail) {
      logEstructurado('WARN', 'Email de alertas no configurado');
      return;
    }
    
    const asunto = `🚨 Error en Jira Sync - ${origen}`;
    const cuerpo = `
❌ ERROR DETECTADO

Origen: ${origen}
Mensaje: ${mensaje}
Timestamp: ${new Date().toLocaleString()}
Entorno: ${PropertiesService.getScriptProperties().getProperty('ENVIRONMENT') || 'development'}

---
Sistema: Jira-Sheets Sync v${VERSION}
    `;
    
    GmailApp.sendEmail(alertEmail, asunto, cuerpo);
    logEstructurado('INFO', 'Alerta de error enviada', { origen, alertEmail });
    
  } catch (error) {
    logEstructurado('ERROR', 'Error enviando alerta de error', { error: error.message });
  }
}

/**
 * Envía alerta cuando el health check detecta problemas
 * @param {Object} healthStatus - Resultado del health check
 */
function enviarAlertaHealthCheck(healthStatus) {
  try {
    const alertEmail = PropertiesService.getScriptProperties().getProperty('ALERT_EMAIL');
    if (!alertEmail) return;
    
    const problemasEncontrados = healthStatus.checks
      .filter(check => check.status !== 'OK')
      .map(check => `• ${check.name}: ${check.status} - ${check.error || check.details || 'Sin detalles'}`)
      .join('\n');
    
    const asunto = `⚠️ Health Check - Estado: ${healthStatus.status}`;
    const cuerpo = `
📊 REPORTE DE SALUD DEL SISTEMA

Estado General: ${healthStatus.status}
Timestamp: ${new Date(healthStatus.timestamp).toLocaleString()}

PROBLEMAS DETECTADOS:
${problemasEncontrados}

TODAS LAS VERIFICACIONES:
${healthStatus.checks.map(check => 
  `${check.status === 'OK' ? '✅' : check.status === 'WARN' ? '⚠️' : '❌'} ${check.name}: ${check.status}`
).join('\n')}

---
Sistema: Jira-Sheets Sync v${healthStatus.version.version}
    `;
    
    GmailApp.sendEmail(alertEmail, asunto, cuerpo);
    logEstructurado('INFO', 'Alerta de health check enviada', { status: healthStatus.status });
    
  } catch (error) {
    logEstructurado('ERROR', 'Error enviando alerta de health check', { error: error.message });
  }
}

/**
 * Genera reporte semanal de métricas y performance
 * @param {MetricsCollector} metrics - Instancia de métricas
 * @param {QuotaManager} quota - Instancia de quotas
 * @returns {Object} Reporte estructurado
 */
function generarReporteSemanal(metrics, quota) {
  const hoy = new Date();
  const hace7Dias = new Date(hoy.getTime() - 7 * 24 * 60 * 60 * 1000);
  
  // Obtener métricas de los últimos 7 días
  const metricas7Dias = {};
  const quotas7Dias = {};
  
  for (let i = 0; i < 7; i++) {
    const fecha = new Date(hoy.getTime() - i * 24 * 60 * 60 * 1000);
    const fechaStr = fecha.toDateString();
    
    if (metrics.metrics[fechaStr]) {
      Object.keys(metrics.metrics[fechaStr]).forEach(key => {
        metricas7Dias[key] = (metricas7Dias[key] || 0) + metrics.metrics[fechaStr][key];
      });
    }
    
    if (quota.contadores[fechaStr]) {
      Object.keys(quota.contadores[fechaStr]).forEach(key => {
        quotas7Dias[key] = (quotas7Dias[key] || 0) + quota.contadores[fechaStr][key];
      });
    }
  }
  
  return {
    periodo: `${hace7Dias.toLocaleDateString()} - ${hoy.toLocaleDateString()}`,
    sincronizaciones: {
      jiraToSheetsExitosas: metricas7Dias.sync_jira_success || 0,
      sheetsToJiraExitosas: metricas7Dias.sync_sheets_success || 0,
      erroresTotal: metricas7Dias.errors_total || 0,
      tiempoPromedioSync: metricas7Dias.sync_jira_to_sheets_avg_ms || 0
    },
    quotas: {
      urlFetch: quotas7Dias.urlFetch || 0,
      email: quotas7Dias.email || 0,
      properties: quotas7Dias.properties || 0
    },
    performance: {
      requestsAPI: metricas7Dias.api_request_count || 0,
      tiempoPromedioAPI: metricas7Dias.api_request_avg_ms || 0
    }
  };
}

/**
 * Envía reporte semanal por email
 * @param {Object} reporte - Reporte generado
 */
function enviarReporteSemanal(reporte) {
  try {
    const alertEmail = PropertiesService.getScriptProperties().getProperty('ALERT_EMAIL');
    if (!alertEmail) return;
    
    const tasaExito = reporte.sincronizaciones.jiraToSheetsExitosas + reporte.sincronizaciones.sheetsToJiraExitosas;
    const tasaError = reporte.sincronizaciones.erroresTotal;
    const porcentajeExito = tasaExito > 0 ? ((tasaExito / (tasaExito + tasaError)) * 100).toFixed(1) : 'N/A';
    
    const asunto = `📈 Reporte Semanal - Jira Sync (${porcentajeExito}% éxito)`;
    const cuerpo = `
📊 REPORTE SEMANAL - JIRA SHEETS SYNC

Período: ${reporte.periodo}

🔄 SINCRONIZACIONES:
• Jira → Sheets exitosas: ${reporte.sincronizaciones.jiraToSheetsExitosas}
• Sheets → Jira exitosas: ${reporte.sincronizaciones.sheetsToJiraExitosas}
• Errores total: ${reporte.sincronizaciones.erroresTotal}
• Tasa de éxito: ${porcentajeExito}%
• Tiempo promedio sync: ${reporte.sincronizaciones.tiempoPromedioSync}ms

📈 PERFORMANCE:
• Requests API realizados: ${reporte.performance.requestsAPI}
• Tiempo promedio API: ${reporte.performance.tiempoPromedioAPI}ms

💾 USO DE QUOTAS:
• URL Fetch utilizados: ${reporte.quotas.urlFetch} / ${APPS_SCRIPT_LIMITS.URL_FETCH_DAILY * 7} (semanal)
• Emails enviados: ${reporte.quotas.email} / ${APPS_SCRIPT_LIMITS.EMAIL_DAILY * 7} (semanal)
• Properties accedidas: ${reporte.quotas.properties}

---
Generado automáticamente por Jira-Sheets Sync v${VERSION}
${new Date().toLocaleString()}
    `;
    
    GmailApp.sendEmail(alertEmail, asunto, cuerpo);
    logEstructurado('SUCCESS', 'Reporte semanal enviado', { email: alertEmail });
    
  } catch (error) {
    logEstructurado('ERROR', 'Error enviando reporte semanal', { error: error.message });
  }
}

/**
 * Setup inicial completo del sistema
 * Función principal para configurar todo desde cero
 */
function setupInicial() {
  logEstructurado('INFO', '🚀 Iniciando setup inicial completo de Jira-Sheets Sync');
  
  try {
    // 1. Verificar propiedades de configuración
    logEstructurado('INFO', 'Paso 1: Verificando configuración...');
    verificarPropiedadesRequeridas();
    
    // 2. Test de conectividad básica
    logEstructurado('INFO', 'Paso 2: Probando conectividad...');
    testConectividadJira();
    
    // 3. Crear estructura de Sheets
    logEstructurado('INFO', 'Paso 3: Creando estructura de Sheets...');
    crearEstructuraCompleta();
    
    // 4. Configurar triggers automáticos
    logEstructurado('INFO', 'Paso 4: Configurando triggers automáticos...');
    configurarTriggers();
    
    // 5. Inicializar sistemas de monitoreo
    logEstructurado('INFO', 'Paso 5: Inicializando sistemas de monitoreo...');
    new QuotaManager(); // Inicializa contadores
    new MetricsCollector(); // Inicializa métricas
    
    // 6. Ejecutar primera sincronización de prueba
    logEstructurado('INFO', 'Paso 6: Ejecutando sincronización inicial...');
    const resultadoSync = sincronizarJiraASheets();
    
    // 7. Health check final
    logEstructurado('INFO', 'Paso 7: Verificación final...');
    const health = healthCheck();
    
    const resultado = {
      configuracion: 'OK',
      conectividad: 'OK',
      sheets: 'OK',
      triggers: ScriptApp.getProjectTriggers().length,
      primeraSync: resultadoSync,
      healthCheck: health.status
    };
    
    logEstructurado('SUCCESS', '✅ Setup inicial completado exitosamente', resultado);
    
    // Mostrar mensaje de éxito en UI si está disponible
    try {
      SpreadsheetApp.getUi().alert(
        '🎉 Setup Completado',
        `✅ Sistema configurado exitosamente!\n\n• Triggers activos: ${resultado.triggers}\n• Issues sincronizados: ${resultadoSync.issuesSincronizados || 0}\n• Estado: ${health.status}\n\nEl sistema está listo para usar.`,
        SpreadsheetApp.getUi().ButtonSet.OK
      );
    } catch (e) {
      // Ignorar si no hay UI disponible
    }
    
    return resultado;
    
  } catch (error) {
    logEstructurado('ERROR', '❌ Error en setup inicial', { error: error.message });
    
    try {
      SpreadsheetApp.getUi().alert(
        '❌ Error en Setup',
        `Error durante la configuración inicial:\n\n${error.message}\n\nRevisa los logs y la configuración.`,
        SpreadsheetApp.getUi().ButtonSet.OK
      );
    } catch (e) {
      // Ignorar si no hay UI disponible
    }
    
    throw error;
  }
}

/**
 * Crea estructura completa de Sheets con todas las hojas necesarias
 */
function crearEstructuraCompleta() {
  const config = obtenerConfiguracion();
  const spreadsheet = SpreadsheetApp.openById(config.sheetId);
  
  // Crear hoja principal de issues
  let issuesSheet = spreadsheet.getSheetByName(SHEETS_CONFIG.MAIN_SHEET);
  if (!issuesSheet) {
    issuesSheet = crearHojaPrincipal(spreadsheet);
  }
  
  // Crear hoja de logs
  let logSheet = spreadsheet.getSheetByName(SHEETS_CONFIG.LOG_SHEET);
  if (!logSheet) {
    logSheet = spreadsheet.insertSheet(SHEETS_CONFIG.LOG_SHEET);
    logSheet.getRange(1, 1, 1, 4).setValues([['Timestamp', 'Level', 'Message', 'Context']]);
    
    // Formato de headers
    logSheet.getRange(1, 1, 1, 4)
      .setFontWeight('bold')
      .setBackground('#f1c232')
      .setFontColor('white');
  }
  
  // Crear hoja de configuración
  let configSheet = spreadsheet.getSheetByName(SHEETS_CONFIG.CONFIG_SHEET);
  if (!configSheet) {
    configSheet = spreadsheet.insertSheet(SHEETS_CONFIG.CONFIG_SHEET);
    crearInterfazConfiguracion(configSheet);
  }
  
  // Crear hoja de métricas dashboard
  let metricsSheet = spreadsheet.getSheetByName(SHEETS_CONFIG.METRICS_SHEET);
  if (!metricsSheet) {
    metricsSheet = spreadsheet.insertSheet(SHEETS_CONFIG.METRICS_SHEET);
    crearDashboardMetricas(metricsSheet);
  }
  
  logEstructurado('SUCCESS', 'Estructura completa de Sheets creada');
}

/**
 * Crea interfaz de configuración en la hoja correspondiente
 * @param {Sheet} sheet - Hoja de configuración
 */
function crearInterfazConfiguracion(sheet) {
  const config = obtenerConfiguracion();
  const versionInfo = getVersion();
  
  const datosConfiguracion = [
    ['CONFIGURACIÓN JIRA-SHEETS SYNC', ''],
    ['', ''],
    ['Parámetro', 'Valor'],
    ['Domain', config.domain],
    ['Email', config.email],
    ['Proyectos', config.projects.join(', ')],
    ['Entorno', config.environment],
    ['Versión', versionInfo.version],
    ['Build Date', versionInfo.buildDate],
    ['', ''],
    ['ESTADO DEL SISTEMA', ''],
    ['', ''],
    ['Última Sincronización', new Date(parseInt(PropertiesService.getScriptProperties().getProperty('LAST_SYNC_TIMESTAMP') || '0')).toLocaleString()],
    ['Triggers Activos', ScriptApp.getProjectTriggers().length.toString()],
    ['', ''],
    ['INSTRUCCIONES', ''],
    ['', ''],
    ['1. Verificar configuración arriba', ''],
    ['2. Usar menú "Jira Sync" para operaciones', ''],
    ['3. Ejecutar "Health Check" regularmente', ''],
    ['4. Revisar logs en hoja "Sync Log"', '']
  ];
  
  sheet.getRange(1, 1, datosConfiguracion.length, 2).setValues(datosConfiguracion);
  
  // Formato
  sheet.getRange('A1:B1').merge().setFontSize(16).setFontWeight('bold').setHorizontalAlignment('center');
  sheet.getRange('A3:B3').setFontWeight('bold').setBackground('#e6f3ff');
  sheet.getRange('A11:B11').setFontWeight('bold').setBackground('#fff2cc');
  sheet.getRange('A16:B16').setFontWeight('bold').setBackground('#d9ead3');
  
  sheet.autoResizeColumns(1, 2);
}

/**
 * Crea dashboard de métricas
 * @param {Sheet} sheet - Hoja de métricas
 */
function crearDashboardMetricas(sheet) {
  const headers = [
    ['DASHBOARD DE MÉTRICAS - JIRA SYNC', '', '', ''],
    ['', '', '', ''],
    ['Métrica', 'Hoy', 'Esta Semana', 'Estado'],
    ['Sync Jira → Sheets', '=COUNTIF(\'Sync Log\'!B:B,"SUCCESS")', '=SUMPRODUCT(--(\'Sync Log\'!A:A>=TODAY()-7), --(\'Sync Log\'!B:B="SUCCESS"))', '🟢'],
    ['Errores Total', '=COUNTIF(\'Sync Log\'!B:B,"ERROR")', '=SUMPRODUCT(--(\'Sync Log\'!A:A>=TODAY()-7), --(\'Sync Log\'!B:B="ERROR"))', '🔴'],
    ['Health Checks', '=COUNTIFS(\'Sync Log\'!C:C,"*Health*",\'Sync Log\'!B:B,"SUCCESS")', '=SUMPRODUCT(--(\'Sync Log\'!A:A>=TODAY()-7), --(ISNUMBER(SEARCH("Health",\'Sync Log\'!C:C))))', '🟡'],
    ['', '', '', ''],
    ['PERFORMANCE', '', '', ''],
    ['', '', '', ''],
    ['Tiempo Prom. Sync', 'N/A', 'N/A', '⏱️']
  ];
  
  sheet.getRange(1, 1, headers.length, 4).setValues(headers);
  
  // Formato
  sheet.getRange('A1:D1').merge().setFontSize(16).setFontWeight('bold').setHorizontalAlignment('center');
  sheet.getRange('A3:D3').setFontWeight('bold').setBackground('#4285f4').setFontColor('white');
  sheet.getRange('A8:D8').setFontWeight('bold').setBackground('#34a853').setFontColor('white');
  
  sheet.autoResizeColumns(1, 4);
  
  logEstructurado('INFO', 'Dashboard de métricas creado');
}