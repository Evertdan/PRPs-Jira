/**
 * @file Code.gs
 * @description Punto de entrada principal y lógica de aplicación para la integración de Google Apps Script con Atlassian.
 * @version 3.0.0
 * @license MIT
 *
 * @summary
 * Este script orquesta la aplicación, gestiona la interfaz de usuario (menú y sidebar),
 * y contiene la lógica de negocio principal. Implementa patrones avanzados como el procesamiento
 * por lotes para tareas largas y se integra con los módulos AtlassianApi.gs, Config.gs y Utils.gs.
 */

const VERSION = '3.0.0';

// =============================================
// PUNTO DE ENTRADA PRINCIPAL
// =============================================

/**
 * Función principal de inicialización. Punto de entrada para ejecuciones manuales o triggers.
 * Realiza una verificación de configuración y luego delega a la lógica de negocio principal.
 */
function main() {
  const versionInfo = getVersion();
  logEstructurado('INFO', 'Iniciando aplicación Apps Script + Atlassian', versionInfo);

  try {
    const config = obtenerConfiguracion();
    logEstructurado('DEBUG', 'Configuración cargada', { environment: config.app.environment });

    ejecutarLogicaPrincipal();

    logEstructurado('SUCCESS', 'Ejecución principal completada exitosamente.');
    mostrarMensaje('✅ Éxito', 'La operación principal se completó correctamente.');

  } catch (error) {
    logEstructurado('ERROR', 'Error crítico en la ejecución principal', {
      error: error.message,
      stack: error.stack
    });
    new MetricsCollector().recordError('main_execution_error', { error: error.message });
    mostrarMensaje('❌ Error Crítico', `Ocurrió un error: ${error.message}`);
    throw error;
  }
}

/**
 * Contiene la lógica de negocio principal. Debe ser personalizada.
 * Esta función demuestra una operación segura que valida la conectividad.
 */
function ejecutarLogicaPrincipal() {
  logEstructurado('INFO', 'Ejecutando la lógica de negocio principal...');

  // --- PERSONALIZAR AQUÍ ---
  // Reemplazar este bloque con la lógica específica de tu proyecto.
  // Por ejemplo:
  // sincronizarJiraConSheets();
  // crearReporteEnConfluence();

  // Ejemplo de operación segura: validar conectividad y registrar.
  const jiraApi = crearApiAtlassian('jira');
  const usuario = jiraApi.makeJsonRequest('/myself');
  logEstructurado('INFO', 'Lógica principal: Conectado a Jira como', { user: usuario.displayName });

  logEstructurado('INFO', 'La lógica de negocio principal (ejemplo) se ejecutó. Personalizar según sea necesario.');
}


// =============================================
// INTERFAZ DE USUARIO (UI)
// =============================================

/**
 * Se ejecuta al abrir el documento. Crea el menú de la aplicación.
 */
function onOpen() {
  try {
    const ui = SpreadsheetApp.getUi() || DocumentApp.getUi();
    ui.createMenu('🔗 Atlassian Pro')
      .addItem('📊 Abrir Dashboard', 'mostrarSidebar')
      .addSeparator()
      .addItem('⚡ Sincronizar Jira con Hoja', 'sincronizarJiraConSheets')
      .addItem('📄 Crear Reporte en Confluence', 'crearReporteEnConfluence')
      .addSeparator()
      .addItem('🧪 Ejecutar Tests', 'runAllTestsUI')
      .addItem('🧹 Limpiar Recursos Antiguos', 'limpiarRecursos')
      .addToUi();
    logEstructurado('DEBUG', 'Menú personalizado creado.');
  } catch (error) {
    console.error('Error al crear el menú personalizado:', error);
  }
}

/**
 * Muestra la barra lateral (sidebar) principal de la aplicación.
 * La sidebar se renderiza a partir del archivo Sidebar.html.
 */
function mostrarSidebar() {
  const html = HtmlService.createTemplateFromFile('Sidebar')
    .evaluate()
    .setTitle('Dashboard de Atlassian')
    .setWidth(350);
  (SpreadsheetApp.getUi() || DocumentApp.getUi()).showSidebar(html);
}

/**
 * Proporciona los datos necesarios para renderizar la sidebar.
 * Es llamada desde el frontend de la sidebar.
 * @returns {Object} Un objeto con datos de configuración, estado y métricas.
 */
function getDashboardData() {
  return {
    config: exportarConfiguracion(), // Asume que existe en Config.gs
    health: healthCheck(),           // Asume que existe en Tests.gs
    metrics: new MetricsCollector().getMetricsReport(),
  };
}

/**
 * Ejecuta todos los tests desde la UI y muestra un resumen.
 */
function runAllTestsUI() {
  try {
    const resultados = runAllTests(); // Asume que existe en Tests.gs
    const resumen = `Tests Ejecutados: ${resultados.total}\n` +
                    `✅ Pasaron: ${resultados.passed}\n` +
                    `❌ Fallaron: ${resultados.failed}`;
    mostrarMensaje('Resultados de los Tests', resumen);
  } catch (error) {
    mostrarMensaje('Error en Tests', `Falló la ejecución de tests: ${error.message}`);
  }
}


// =============================================
// FUNCIONES DE EJEMPLO (CASOS DE USO)
// =============================================

/**
 * Sincroniza issues de una query JQL con la hoja de cálculo activa.
 * Esta versión es más avanzada: actualiza filas existentes si la clave del issue ya se encuentra.
 */
function sincronizarJiraConSheets() {
  logEstructurado('INFO', 'Iniciando sincronización: Jira -> Google Sheets');
  try {
    if (typeof SpreadsheetApp === 'undefined') throw new Error('Función solo disponible en Google Sheets.');
    
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Jira_Sync") || SpreadsheetApp.getActiveSpreadsheet().insertSheet("Jira_Sync");
    const jiraApi = crearApiAtlassian('jira');
    const config = obtenerConfiguracion();

    const JQL_QUERY = config.app.jiraSyncJql || 'project = "PROJ" AND status != "Done" ORDER BY created DESC';
    const issues = jiraApi.searchIssues(JQL_QUERY, 500); // Límite de 500 para este ejemplo

    const headers = ['Key', 'Summary', 'Status', 'Assignee', 'Created', 'Updated', 'URL'];
    const dataMap = new Map(sheet.getRange(2, 1, sheet.getLastRow(), 1).getValues().map((row, i) => [row[0], i + 2]));

    let updatedRows = 0;
    let newRows = [];

    issues.forEach(issue => {
      const rowData = [
        issue.key,
        issue.fields.summary,
        issue.fields.status.name,
        issue.fields.assignee ? issue.fields.assignee.displayName : 'N/A',
        new Date(issue.fields.created).toISOString(),
        new Date(issue.fields.updated).toISOString(),
        `${config.atlassian.domain}/browse/${issue.key}`
      ];
      
      if (dataMap.has(issue.key)) {
        const rowIndex = dataMap.get(issue.key);
        sheet.getRange(rowIndex, 1, 1, headers.length).setValues([rowData]);
        updatedRows++;
      } else {
        newRows.push(rowData);
      }
    });

    // Escribir cabeceras y nuevas filas
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]).setFontWeight('bold').setBackground('#f0f0f0');
    if (newRows.length > 0) {
      sheet.getRange(sheet.getLastRow() + 1, 1, newRows.length, headers.length).setValues(newRows);
    }
    sheet.autoResizeColumns(1, headers.length);

    const resumen = `Sincronización completada. ${updatedRows} filas actualizadas, ${newRows.length} filas nuevas.`;
    logEstructurado('SUCCESS', resumen);
    mostrarMensaje('Sincronización Exitosa', resumen);

  } catch (error) {
    logEstructurado('ERROR', 'Falló la sincronización Jira -> Sheets', { error: error.message });
    mostrarMensaje('Error de Sincronización', error.message);
  }
}

/**
 * Crea una página de reporte semanal en Confluence con datos de Jira.
 */
function crearReporteEnConfluence() {
  logEstructurado('INFO', 'Iniciando creación de reporte en Confluence...');
  try {
    const jiraApi = crearApiAtlassian('jira');
    const confluenceApi = crearApiAtlassian('confluence');
    const config = obtenerConfiguracion();

    const CONFLUENCE_SPACE_KEY = config.app.confluenceReportSpaceKey || 'REPORTS';
    const CONFLUENCE_PARENT_PAGE_ID = config.app.confluenceReportParentId || null;

    const issuesResueltos = jiraApi.searchIssues('status = "Done" AND resolved >= -7d');
    const issuesCreados = jiraApi.searchIssues('created >= -7d');

    const fechaReporte = new Date().toLocaleDateString('es-ES', { dateStyle: 'long' });
    const contenido = `
      <h1>Reporte Semanal de Actividad - ${fechaReporte}</h1>
      <p>Este reporte resume la actividad clave en Jira durante la última semana.</p>
      <h2>📊 Resumen Ejecutivo</h2>
      <table><tbody>
        <tr><th>Issues Creados</th><td>${issuesCreados.length}</td></tr>
        <tr><th>Issues Resueltos</th><td>${issuesResueltos.length}</td></tr>
      </tbody></table>
      <h2>✅ Issues Resueltos Esta Semana</h2>
      <table>
        <thead><tr><th>Clave</th><th>Resumen</th><th>Asignado</th></tr></thead>
        <tbody>
          ${issuesResueltos.map(issue => `<tr><td><a href="${config.atlassian.domain}/browse/${issue.key}">${issue.key}</a></td><td>${issue.fields.summary}</td><td>${issue.fields.assignee ? issue.fields.assignee.displayName : 'N/A'}</td></tr>`).join('') || '<tr><td colspan="3">No se resolvieron issues esta semana.</td></tr>'}
        </tbody>
      </table>
      <p><br/><i><small>Reporte generado automáticamente por la integración de Google Apps Script v${VERSION}.</small></i></p>
    `;

    const pageData = {
      title: `Reporte Semanal - ${fechaReporte}`,
      spaceKey: CONFLUENCE_SPACE_KEY,
      content: contenido,
      parentId: CONFLUENCE_PARENT_PAGE_ID,
    };
    const nuevaPagina = confluenceApi.createPage(pageData);

    logEstructurado('SUCCESS', 'Reporte creado exitosamente en Confluence.', { pageId: nuevaPagina.id });
    mostrarMensaje('Reporte Creado', `El reporte semanal ha sido creado en Confluence. ID: ${nuevaPagina.id}`);

  } catch (error) {
    logEstructurado('ERROR', 'Falló la creación de reporte en Confluence', { error: error.message });
    mostrarMensaje('Error de Reporte', error.message);
  }
}


// =============================================
// MANEJO DE TAREAS LARGAS (PROCESAMIENTO POR LOTES)
// =============================================

/**
 * Procesa un array de items en lotes para evitar exceder el tiempo de ejecución.
 * @param {Array<any>} items - El array completo de items a procesar.
 * @param {string} funcionProcesamientoNombre - El nombre de la función que procesará cada lote.
 * @param {number} [tamanoLote=50] - El número de items a procesar en cada lote.
 */
function procesarEnLotes(items, funcionProcesamientoNombre, tamanoLote = 50) {
  const lotes = [];
  for (let i = 0; i < items.length; i += tamanoLote) {
    lotes.push(items.slice(i, i + tamanoLote));
  }

  const loteActual = lotes.shift();
  if (!loteActual) {
    logEstructurado('SUCCESS', 'Procesamiento por lotes completado.');
    PropertiesService.getScriptProperties().deleteProperty('PROCESAMIENTO_PENDIENTE');
    return;
  }
  
  // Ejecutar la función de procesamiento para el lote actual
  globalThis[funcionProcesamientoNombre](loteActual);
  logEstructurado('INFO', `Lote procesado. Lotes restantes: ${lotes.length}`);

  if (lotes.length > 0) {
    const estado = { lotes: lotes, funcionProcesamiento: funcionProcesamientoNombre, tamanoLote: tamanoLote };
    PropertiesService.getScriptProperties().setProperty('PROCESAMIENTO_PENDIENTE', JSON.stringify(estado));
    
    // Crear un trigger para continuar en 1 minuto
    ScriptApp.newTrigger('continuarProcesamiento')
      .timeBased()
      .after(60 * 1000)
      .create();
    logEstructurado('INFO', 'Trigger creado para continuar el procesamiento.');
  }
}

/**
 * Trigger que reanuda un procesamiento por lotes pendiente.
 */
function continuarProcesamiento() {
  limpiarTriggersAntiguosPorNombre('continuarProcesamiento');
  const estadoJson = PropertiesService.getScriptProperties().getProperty('PROCESAMIENTO_PENDIENTE');
  
  if (estadoJson) {
    const estado = JSON.parse(estadoJson);
    const itemsRestantes = estado.lotes.flat();
    procesarEnLotes(itemsRestantes, estado.funcionProcesamiento, estado.tamanoLote);
  } else {
    logEstructurado('WARN', 'Se llamó a continuarProcesamiento sin estado pendiente.');
  }
}


// =============================================
// MANTENIMIENTO
// =============================================

/**
 * Limpia recursos antiguos como triggers y propiedades de caché.
 */
function limpiarRecursos() {
  logEstructurado('INFO', '🧹 Iniciando limpieza de recursos...');
  try {
    limpiarTriggersAntiguosPorNombre('continuarProcesamiento');
    new MetricsCollector().limpiarMetricasAntiguas(30);
    logEstructurado('SUCCESS', '✅ Limpieza de recursos completada.');
    mostrarMensaje('Limpieza Completa', 'Los recursos antiguos han sido limpiados.');
  } catch (error) {
    logEstructurado('ERROR', 'Error durante la limpieza de recursos', { error: error.message });
    mostrarMensaje('Error de Limpieza', error.message);
  }
}


// =============================================
// FUNCIONES AUXILIARES
// =============================================

/**
 * Muestra un diálogo de alerta al usuario.
 * @param {string} titulo - El título del diálogo.
 * @param {string} mensaje - El mensaje a mostrar.
 */
function mostrarMensaje(titulo, mensaje) {
  try {
    const ui = SpreadsheetApp.getUi() || DocumentApp.getUi();
    ui.alert(titulo, mensaje, ui.ButtonSet.OK);
  } catch (e) {
    console.log(`[${titulo}] ${mensaje}`);
  }
}

/**
 * Obtiene información de la versión actual del script.
 * @returns {Object} Un objeto con información de la versión.
 */
function getVersion() {
  return {
    version: VERSION,
    buildDate: new Date().toISOString(),
    environment: PropertiesService.getScriptProperties().getProperty('ENVIRONMENT') || 'development',
  };
}
