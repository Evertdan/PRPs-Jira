/**
 * Tests.gs - Suite de tests unitarios y de integración
 * Siguiendo patrones obligatorios de CLAUDE.md para testing completo
 */

/**
 * Ejecuta una consulta para un issue específico y muestra la respuesta completa de la API en una nueva hoja.
 * Esto es útil para depurar por qué el análisis de entregables puede no estar funcionando para un issue concreto.
 */
function diagnosticarIssue() {
  const ui = SpreadsheetApp.getUi();
  try {
    const response = ui.prompt('Diagnóstico de Issue', 'Ingresa la clave del issue (ej. CCSOFT-123):', ui.ButtonSet.OK_CANCEL);

    if (response.getSelectedButton() !== ui.Button.OK || !response.getResponseText()) {
      return;
    }
    
    const issueKey = response.getResponseText().trim().toUpperCase();
    logEstructurado('INFO', `🔍 Iniciando diagnóstico para el issue: ${issueKey}`);
    
    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    const sheetName = `Diagnostico_${issueKey}`;
    let sheet = spreadsheet.getSheetByName(sheetName);
    if (sheet) {
      spreadsheet.deleteSheet(sheet);
    }
    sheet = spreadsheet.insertSheet(sheetName, 0);
    spreadsheet.setActiveSheet(sheet);
    
    mostrarMensajeDeProgreso(sheet, `🔄 Obteniendo datos para ${issueKey}...`);

    const jiraApi = new JiraApiManager();
    const resultado = jiraApi.searchIssues(`key = "${issueKey}"`, 0, 1);

    if (!resultado || !resultado.issues || resultado.issues.length === 0) {
      throw new Error(`No se encontró el issue "${issueKey}" o no tienes permiso para verlo.`);
    }

    const issue = resultado.issues[0];
    
    // Escribir los datos en la hoja
    const data = JSON.stringify(issue.fields, null, 2);
    sheet.getRange("A1").setValue(`Datos de la API para ${issueKey}`);
    sheet.getRange("A2").setValue(data).setFontFamily('Courier New');
    sheet.autoResizeColumn(1);

    logEstructurado('SUCCESS', `Diagnóstico completado para ${issueKey}.`);
    
  } catch (e) {
    registrarError(e, 'diagnosticarIssue');
    ui.alert('Error en Diagnóstico', e.message, ui.ButtonSet.OK);
  }
}

/**
 * Health check completo del sistema
 * Función obligatoria según CLAUDE.md
 */
function healthCheck() {
  const checks = [];
  
  // 1. Configuración
  try {
    obtenerConfiguracion();
    checks.push({ name: 'Configuración', status: 'OK' });
  } catch (e) {
    checks.push({ name: 'Configuración', status: 'ERROR', error: e.message });
  }

  // 2. Conectividad Jira
  try {
    const user = new JiraApiManager().getCurrentUser();
    checks.push({ name: 'Conectividad Jira', status: 'OK', details: `Usuario: ${user.displayName}` });
  } catch (e) {
    checks.push({ name: 'Conectividad Jira', status: 'ERROR', error: e.message });
  }

  // 3. Acceso Google Sheets
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet();
    checks.push({ name: 'Acceso Google Sheets', status: 'OK', details: `${sheet.getSheets().length} hojas` });
  } catch (e) {
    checks.push({ name: 'Acceso Google Sheets', status: 'ERROR', error: e.message });
  }

  // 4. Triggers
  const triggers = ScriptApp.getProjectTriggers();
  if (triggers.length < 3) { // Debería haber al menos onEdit, y dos time-based
    checks.push({ name: 'Triggers Automáticos', status: 'WARN', details: `${triggers.length} triggers configurados. Se recomienda ejecutar el Setup.` });
  } else {
    checks.push({ name: 'Triggers Automáticos', status: 'OK', details: `${triggers.length} triggers` });
  }

  // 5. Sincronización Reciente
  const lastSync = PropertiesService.getScriptProperties().getProperty('LAST_SYNC_TIMESTAMP');
  if (lastSync) {
    const hoursAgo = (Date.now() - parseInt(lastSync)) / (1000 * 60 * 60);
    if (hoursAgo > 24) {
      checks.push({ name: 'Sincronización Reciente', status: 'WARN', details: `Última sync hace ${hoursAgo.toFixed(1)} horas.` });
    } else {
      checks.push({ name: 'Sincronización Reciente', status: 'OK', details: `Última sync hace ${hoursAgo.toFixed(1)} horas.` });
    }
  } else {
    checks.push({ name: 'Sincronización Reciente', status: 'WARN', details: 'Nunca ejecutada.' });
  }

  const status = checks.some(c => c.status === 'ERROR') ? 'UNHEALTHY' : checks.some(c => c.status === 'WARN') ? 'WARNING' : 'HEALTHY';
  
  return {
    status: status,
    timestamp: new Date().toISOString(),
    version: getVersion(),
    checks: checks
  };
}
