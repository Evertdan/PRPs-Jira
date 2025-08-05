/**
 * Triggers.gs - Configuración y manejo de triggers automáticos
 */

/**
 * Configura todos los triggers automáticos para el sistema.
 * Limpia los triggers antiguos antes de crear los nuevos para evitar duplicados.
 */
function configurarTriggers() {
  logEstructurado('INFO', 'Configurando triggers automáticos...');
  
  limpiarTriggersExistentes();
  
  const config = obtenerConfiguracion();
  const envConfig = { syncInterval: JIRA_CONFIG.SYNC_INTERVAL || 15 };

  // Trigger para sincronización Jira -> Sheets
  ScriptApp.newTrigger('triggerSyncJiraToSheets')
    .timeBased()
    .everyMinutes(envConfig.syncInterval)
    .create();
  
  // Trigger para sincronización Sheets -> Jira
  ScriptApp.newTrigger('triggerSyncSheetsToJira')
    .timeBased()
    .everyMinutes(5)
    .create();
  
  // Trigger para detectar ediciones en la hoja y marcar para sincronización
  ScriptApp.newTrigger('handleEdit')
    .forSpreadsheet(config.sheetId)
    .onEdit()
    .create();

  // Trigger diario para Health check
  ScriptApp.newTrigger('triggerHealthCheck')
    .timeBased()
    .everyDays(1)
    .atHour(9)
    .create();
  
  // Trigger diario para limpieza de logs
  ScriptApp.newTrigger('triggerLimpiezaLogs')
    .timeBased()
    .everyDays(1)
    .atHour(2)
    .create();
  
  // Trigger semanal para reporte de métricas
  ScriptApp.newTrigger('triggerReporteMetricas')
    .timeBased()
    .onWeekDay(ScriptApp.WeekDay.MONDAY)
    .atHour(8)
    .create();
  
  const triggersCreados = ScriptApp.getProjectTriggers().length;
  logEstructurado('SUCCESS', `Triggers configurados exitosamente: ${triggersCreados} activos.`);
}

/**
 * Limpia todos los triggers existentes del proyecto para evitar duplicados.
 */
function limpiarTriggersExistentes() {
  const triggers = ScriptApp.getProjectTriggers();
  let eliminados = 0;
  
  triggers.forEach(trigger => {
    ScriptApp.deleteTrigger(trigger);
    eliminados++;
  });
  
  if (eliminados > 0) {
    logEstructurado('INFO', `Eliminados ${eliminados} triggers existentes.`);
  }
}

/**
 * Trigger que se ejecuta al editar la hoja. Marca la fila como 'PENDING' para sincronización.
 * @param {Object} e - El objeto de evento de edición.
 */
function handleEdit(e) {
  try {
    const range = e.range;
    const sheet = range.getSheet();

    // Salir si la edición no es en la hoja principal o si se editan múltiples celdas
    if (sheet.getName() !== SHEETS_CONFIG.MAIN_SHEET || range.getNumRows() !== 1 || range.getNumColumns() !== 1) {
      return;
    }

    const editedRow = range.getRow();
    if (editedRow <= 1) return; // Ignorar ediciones en la fila de encabezado

    const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
    const editedColName = headers[range.getColumn() - 1];
    
    const COLUMNAS_EDITABLES = ['Status', 'Assignee', 'Priority'];
    
    if (COLUMNAS_EDITABLES.includes(editedColName)) {
      const syncStatusCol = headers.indexOf('Sync Status') + 1;
      if (syncStatusCol > 0) {
        sheet.getRange(editedRow, syncStatusCol).setValue('PENDING');
      }
    }
  } catch (error) {
    logEstructurado('ERROR', 'Error en el trigger handleEdit', { error: error.message, event: e });
  }
}

/**
 * Trigger automático para la sincronización de Jira a Sheets.
 */
function triggerSyncJiraToSheets() {
  try {
    logEstructurado('INFO', '🤖 Trigger automático: Jira → Sheets');
    sincronizarJiraASheets();
  } catch (error) {
    registrarError(error, 'triggerSyncJiraToSheets');
    enviarAlertaError('Trigger Jira → Sheets', error.message);
  }
}

/**
 * Trigger automático para la sincronización de Sheets a Jira.
 */
function triggerSyncSheetsToJira() {
  try {
    logEstructurado('INFO', '🤖 Trigger automático: Sheets → Jira');
    sincronizarSheetsAJira();
  } catch (error) {
    registrarError(error, 'triggerSyncSheetsToJira');
    enviarAlertaError('Trigger Sheets → Jira', error.message);
  }
}

/**
 * Trigger diario para ejecutar el Health Check.
 */
function triggerHealthCheck() {
  try {
    logEstructurado('INFO', '🤖 Trigger automático: Health Check diario');
    const health = healthCheck();
    if (health.status !== 'HEALTHY') {
      enviarAlertaHealthCheck(health);
    }
  } catch (error) {
    registrarError(error, 'triggerHealthCheck');
    enviarAlertaError('Health Check', error.message);
  }
}

/**
 * Trigger diario para la limpieza de logs antiguos.
 */
function triggerLimpiezaLogs() {
  try {
    logEstructurado('INFO', '🤖 Trigger automático: Limpieza de logs');
    limpiarLogsAntiguos();
  } catch (error) {
    registrarError(error, 'triggerLimpiezaLogs');
  }
}

/**
 * Trigger semanal para generar y enviar el reporte de métricas.
 */
function triggerReporteMetricas() {
  try {
    logEstructurado('INFO', '🤖 Trigger automático: Reporte semanal de métricas');
    const reporte = generarReporteSemanal();
    enviarReporteSemanal(reporte);
  } catch (error) {
    registrarError(error, 'triggerReporteMetricas');
  }
}

/**
 * Envía una alerta por email cuando ocurre un error crítico.
 * @param {string} origen - La función o proceso donde ocurrió el error.
 * @param {string} mensaje - El mensaje de error.
 */
function enviarAlertaError(origen, mensaje) {
  try {
    const config = obtenerConfiguracion();
    if (!config.alertEmail) {
      logEstructurado('WARN', 'Email de alertas no configurado, no se puede enviar alerta.');
      return;
    }
    
    const asunto = `🚨 Error en Jira Sync - ${origen}`;
    const cuerpo = `
      Un error ha ocurrido en el sistema de sincronización Jira-Sheets.

      Origen: ${origen}
      Mensaje: ${mensaje}
      Timestamp: ${new Date().toLocaleString()}
      Entorno: ${config.environment}

      Por favor, revise los logs en la hoja "Sync Log" para más detalles.
    `;
    
    GmailApp.sendEmail(config.alertEmail, asunto, cuerpo);
    logEstructurado('INFO', 'Alerta de error enviada', { origen, alertEmail: config.alertEmail });
    
  } catch (error) {
    logEstructurado('ERROR', 'Fallo al enviar la alerta de error por email', { error: error.message });
  }
}

/**
 * Envía una alerta por email si el Health Check detecta problemas.
 * @param {Object} healthStatus - El objeto con el resultado del health check.
 */
function enviarAlertaHealthCheck(healthStatus) {
  try {
    const config = obtenerConfiguracion();
    if (!config.alertEmail) return;
    
    const problemas = healthStatus.checks
      .filter(check => check.status !== 'OK')
      .map(check => `• ${check.name}: ${check.status} - ${check.error || check.details || 'N/A'}`)
      .join('\n');
    
    const asunto = `⚠️ Health Check del sistema Jira-Sync: ${healthStatus.status}`;
    const cuerpo = `
      El Health Check diario ha detectado problemas en el sistema.

      Estado General: ${healthStatus.status}
      Timestamp: ${new Date(healthStatus.timestamp).toLocaleString()}

      Problemas Detectados:
      ${problemas}
    `;
    
    GmailApp.sendEmail(config.alertEmail, asunto, cuerpo);
    logEstructurado('INFO', 'Alerta de health check enviada', { status: healthStatus.status });
    
  } catch (error) {
    logEstructurado('ERROR', 'Fallo al enviar la alerta de health check', { error: error.message });
  }
}

/**
 * Genera el reporte semanal de métricas.
 * @returns {Object} El objeto con los datos del reporte.
 */
function generarReporteSemanal() {
  const metrics = new MetricsCollector();
  const quota = new QuotaManager();
  const metricas7Dias = {};
  const quotas7Dias = {};

  for (let i = 0; i < 7; i++) {
    const fecha = new Date(Date.now() - i * 24 * 60 * 60 * 1000);
    const fechaStr = fecha.toDateString();
    
    const dailyMetrics = metrics.metrics[fechaStr] || {};
    for (const key in dailyMetrics) {
      metricas7Dias[key] = (metricas7Dias[key] || 0) + dailyMetrics[key];
    }

    const dailyQuotas = quota.contadores[fechaStr] || {};
    for (const key in dailyQuotas) {
      quotas7Dias[key] = (quotas7Dias[key] || 0) + dailyQuotas[key];
    }
  }
  
  return {
    periodo: `${new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toLocaleDateString()} - ${new Date().toLocaleDateString()}`,
    sincronizaciones: {
      jiraToSheets: metricas7Dias.sync_jira_success || 0,
      sheetsToJira: metricas7Dias.sync_sheets_success || 0,
      errores: metricas7Dias.errors_total || 0,
    },
    quotas: {
      urlFetch: quotas7Dias.urlFetch || 0,
      email: quotas7Dias.email || 0,
    },
    performance: {
      requestsAPI: metricas7Dias.api_request_count || 0,
      tiempoPromedioAPI_ms: metricas7Dias.api_request_avg_ms || 0
    }
  };
}

/**
 * Envía el reporte semanal de métricas por email.
 * @param {Object} reporte - El objeto del reporte generado.
 */
function enviarReporteSemanal(reporte) {
  try {
    const config = obtenerConfiguracion();
    if (!config.alertEmail) return;
    
    const totalSyncs = reporte.sincronizaciones.jiraToSheets + reporte.sincronizaciones.sheetsToJira;
    const totalErrores = reporte.sincronizaciones.errores;
    const exitoTotal = totalSyncs + totalErrores;
    const porcentajeExito = exitoTotal > 0 ? ((totalSyncs / exitoTotal) * 100).toFixed(1) : '100';
    
    const asunto = `📈 Reporte Semanal - Jira Sync (${porcentajeExito}% éxito)`;
    const cuerpo = `
      📊 REPORTE SEMANAL - JIRA SHEETS SYNC
      Período: ${reporte.periodo}

      🔄 SINCRONIZACIONES:
      • Jira → Sheets: ${reporte.sincronizaciones.jiraToSheets}
      • Sheets → Jira: ${reporte.sincronizaciones.sheetsToJira}
      • Errores totales: ${totalErrores}
      • Tasa de éxito: ${porcentajeExito}%

      💾 USO DE QUOTAS (Últimos 7 días):
      • URL Fetch: ${reporte.quotas.urlFetch} / ${APPS_SCRIPT_LIMITS.URL_FETCH_DAILY * 7}
      • Emails enviados: ${reporte.quotas.email} / ${APPS_SCRIPT_LIMITS.EMAIL_DAILY * 7}
    `;
    
    GmailApp.sendEmail(config.alertEmail, asunto, cuerpo);
    logEstructurado('SUCCESS', 'Reporte semanal enviado', { email: config.alertEmail });
    
  } catch (error) {
    logEstructurado('ERROR', 'Error enviando reporte semanal', { error: error.message });
  }
}
