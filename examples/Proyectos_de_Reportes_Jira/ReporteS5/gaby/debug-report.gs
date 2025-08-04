/**
 * FUNCIONES DE DEBUG PARA DIAGNOSTICAR REPORTES EN BLANCO
 * Estas funciones ayudan a identificar problemas en la generación de reportes
 */

/**
 * Debug completo del proceso de generación de reportes
 */
function debugReportGeneration() {
  try {
    Logger.log("🔍 DEBUG: Iniciando diagnóstico completo de reportes...");
    
    // 1. Verificar que las clases y configuraciones existen
    Logger.log("=== VERIFICACIÓN DE COMPONENTES ===");
    Logger.log(`ReportGenerator existe: ${typeof ReportGenerator !== 'undefined'}`);
    Logger.log(`CONFIG_JIRA existe: ${typeof CONFIG_JIRA !== 'undefined'}`);
    Logger.log(`CredManager existe: ${typeof CredManager !== 'undefined'}`);
    Logger.log(`JiraAPI existe: ${typeof JiraAPI !== 'undefined'}`);
    
    if (typeof CONFIG_JIRA !== 'undefined') {
      Logger.log(`Campo compromiso configurado: ${CONFIG_JIRA.customFields.compromiso}`);
      Logger.log(`Campo fechaHora configurado: ${CONFIG_JIRA.customFields.fechaHora || 'VACÍO (correcto)'}`);
      Logger.log(`Proyecto configurado: ${CONFIG_JIRA.projectKey}`);
    }
    
    // 2. Probar instanciación de clases
    Logger.log("=== PRUEBA DE INSTANCIACIÓN ===");
    try {
      const rg = new ReportGenerator();
      Logger.log("✅ ReportGenerator se instancia correctamente");
    } catch (e) {
      Logger.log(`❌ Error instanciando ReportGenerator: ${e.message}`);
      return;
    }
    
    try {
      const jiraAPI = new JiraAPI();
      Logger.log("✅ JiraAPI se instancia correctamente");
    } catch (e) {
      Logger.log(`❌ Error instanciando JiraAPI: ${e.message}`);
      return;
    }
    
    // 3. Verificar credenciales
    Logger.log("=== VERIFICACIÓN DE CREDENCIALES ===");
    if (typeof CredManager !== 'undefined') {
      CredManager.cargarCredenciales();
      Logger.log(`Email: ${CONFIG_JIRA.email || '❌ VACÍO'}`);
      Logger.log(`Token: ${CONFIG_JIRA.apiToken ? '✅ PRESENTE' : '❌ VACÍO'}`);
    }
    
    // 4. Probar obtención de colaboradores
    Logger.log("=== PRUEBA DE OBTENCIÓN DE COLABORADORES ===");
    try {
      const jiraAPI = new JiraAPI();
      const colaboradores = jiraAPI.obtenerListaColaboradores();
      Logger.log(`✅ Colaboradores obtenidos: ${colaboradores.length}`);
      
      if (colaboradores.length > 0) {
        Logger.log(`Primer colaborador: ${colaboradores[0].displayName} (${colaboradores[0].accountId})`);
        
        // 5. Probar obtención de tareas
        Logger.log("=== PRUEBA DE OBTENCIÓN DE TAREAS ===");
        const primeColaborador = colaboradores[0].accountId;
        const tareas = jiraAPI.obtenerListaTareas(primeColaborador, 'sprint');
        Logger.log(`✅ Tareas obtenidas: ${tareas.length}`);
        
        if (tareas.length > 0) {
          Logger.log(`Primera tarea: ${tareas[0].key} - ${tareas[0].fields.summary}`);
          Logger.log(`Tipo: ${tareas[0].fields.issuetype?.name}`);
          Logger.log(`Estado: ${tareas[0].fields.status?.name}`);
          Logger.log(`Compromiso: ${JSON.stringify(tareas[0].fields[CONFIG_JIRA.customFields.compromiso])}`);
          
          // 6. Probar generación de reporte
          Logger.log("=== PRUEBA DE GENERACIÓN DE REPORTE ===");
          const reportGenerator = new ReportGenerator();
          reportGenerator.generarReporteCompromisos(tareas, `DEBUG_${colaboradores[0].displayName}`);
          Logger.log("✅ Reporte generado exitosamente");
        } else {
          Logger.log("⚠️ No se encontraron tareas para probar reporte");
        }
      } else {
        Logger.log("❌ No se encontraron colaboradores");
      }
    } catch (e) {
      Logger.log(`❌ Error en prueba de Jira: ${e.message}`);
    }
    
    Logger.log("🏁 DEBUG: Diagnóstico completado");
    
  } catch (error) {
    Logger.log(`❌ Error general en debug: ${error.message}`);
    Logger.log(`Stack trace: ${error.stack}`);
  }
}

/**
 * Verificación rápida de componentes básicos
 */
function verificarRapida() {
  Logger.log("=== VERIFICACIÓN RÁPIDA ===");
  
  // Verificar que las clases existen
  Logger.log(`ReportGenerator existe: ${typeof ReportGenerator !== 'undefined'}`);
  Logger.log(`CONFIG_JIRA existe: ${typeof CONFIG_JIRA !== 'undefined'}`);
  
  if (typeof CONFIG_JIRA !== 'undefined') {
    Logger.log(`Campo compromiso: ${CONFIG_JIRA.customFields?.compromiso || 'NO DEFINIDO'}`);
  }
  
  // Probar crear instancia
  try {
    const rg = new ReportGenerator();
    Logger.log("✅ ReportGenerator se puede instanciar");
  } catch (e) {
    Logger.log(`❌ Error instanciando ReportGenerator: ${e.message}`);
  }
}

/**
 * Debug específico de una tarea individual
 */
function debugTareaIndividual() {
  try {
    Logger.log("🔍 DEBUG: Analizando estructura de tarea individual...");
    
    // Cargar credenciales
    if (typeof CredManager !== 'undefined') {
      CredManager.cargarCredenciales();
    }
    
    // Obtener una tarea de ejemplo
    const jiraAPI = new JiraAPI();
    const colaboradores = jiraAPI.obtenerListaColaboradores();
    
    if (colaboradores.length === 0) {
      Logger.log("❌ No hay colaboradores disponibles");
      return;
    }
    
    const tareas = jiraAPI.obtenerListaTareas(colaboradores[0].accountId, 'sprint');
    
    if (tareas.length === 0) {
      Logger.log("❌ No hay tareas disponibles");
      return;
    }
    
    const tarea = tareas[0];
    Logger.log("=== ANÁLISIS DE TAREA ===");
    Logger.log(`Key: ${tarea.key}`);
    Logger.log(`Summary: ${tarea.fields.summary}`);
    Logger.log(`Issue Type: ${JSON.stringify(tarea.fields.issuetype)}`);
    Logger.log(`Status: ${JSON.stringify(tarea.fields.status)}`);
    Logger.log(`Due Date: ${tarea.fields.duedate}`);
    Logger.log(`Time Spent: ${tarea.fields.timespent}`);
    Logger.log(`Parent: ${JSON.stringify(tarea.fields.parent)}`);
    
    // Campo de compromiso
    const campoCompromiso = CONFIG_JIRA.customFields.compromiso;
    Logger.log(`Campo compromiso (${campoCompromiso}): ${JSON.stringify(tarea.fields[campoCompromiso])}`);
    
    // Todos los campos personalizados
    Logger.log("=== CAMPOS PERSONALIZADOS DISPONIBLES ===");
    Object.keys(tarea.fields).filter(key => key.startsWith('customfield_')).forEach(key => {
      Logger.log(`${key}: ${JSON.stringify(tarea.fields[key])}`);
    });
    
  } catch (error) {
    Logger.log(`❌ Error en debug de tarea: ${error.message}`);
  }
}

/**
 * Función mejorada para reporteCompromisos con debugging
 */
function reporteCompromisosDebug(tareas, colaboradorNombre) {
  try {
    Logger.log(`🐛 DEBUG REPORTE: Iniciando para ${colaboradorNombre} con ${tareas ? tareas.length : 0} tareas`);
    
    if (!tareas) {
      Logger.log("❌ ERROR: Parámetro tareas es null/undefined");
      return;
    }
    
    if (!Array.isArray(tareas)) {
      Logger.log(`❌ ERROR: Parámetro tareas no es array: ${typeof tareas}`);
      return;
    }
    
    if (tareas.length === 0) {
      Logger.log("⚠️ WARNING: Array de tareas está vacío");
    }
    
    // Verificar ReportGenerator
    if (typeof ReportGenerator === 'undefined') {
      Logger.log("❌ ERROR: ReportGenerator no está definido");
      return;
    }
    
    Logger.log("✅ Creando instancia de ReportGenerator...");
    const reportGenerator = new ReportGenerator();
    
    Logger.log("✅ Ejecutando generarReporteCompromisos...");
    reportGenerator.generarReporteCompromisos(tareas, colaboradorNombre);
    
    Logger.log("✅ Reporte completado exitosamente");
    
  } catch (error) {
    Logger.log(`❌ ERROR en reporteCompromisosDebug: ${error.message}`);
    Logger.log(`Stack: ${error.stack}`);
    throw error;
  }
}

/**
 * Test de reporte con datos simulados
 */
function testReporteConDatosSimulados() {
  Logger.log("🧪 TEST: Generando reporte con datos simulados...");
  
  const tareasSimuladas = [
    {
      key: "TEST-001",
      fields: {
        summary: "Tarea de prueba 1",
        issuetype: { name: "Story" },
        status: { name: "En Progreso" },
        duedate: "2024-01-15",
        timespent: 3600,
        parent: null,
        assignee: { displayName: "Usuario Test" },
        [CONFIG_JIRA.customFields.compromiso]: { value: "Comprometido" }
      }
    },
    {
      key: "TEST-002", 
      fields: {
        summary: "Tarea de prueba 2",
        issuetype: { name: "Bug" },
        status: { name: "Cerrado" },
        duedate: "2024-01-16",
        timespent: 7200,
        parent: null,
        assignee: { displayName: "Usuario Test 2" },
        [CONFIG_JIRA.customFields.compromiso]: { value: "Tarea Emergente" }
      }
    }
  ];
  
  try {
    reporteCompromisos(tareasSimuladas, "TEST_USUARIO");
    Logger.log("✅ Test con datos simulados completado");
  } catch (error) {
    Logger.log(`❌ Error en test: ${error.message}`);
  }
}

/**
 * Función de backup para reportes - Usar si la principal falla
 */
function reporteCompromisosBackup(tareas, colaboradorNombre) {
  Logger.log("🔄 Usando función de backup");
  
  try {
    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = spreadsheet.getSheetByName(colaboradorNombre) || spreadsheet.insertSheet(colaboradorNombre);
    
    sheet.clear();
    sheet.appendRow([`Reporte de Backup para: ${colaboradorNombre}`]);
    sheet.appendRow([`Fecha: ${new Date().toLocaleDateString('es-ES')}`]);
    sheet.appendRow([`Tareas encontradas: ${tareas ? tareas.length : 0}`]);
    
    if (tareas && tareas.length > 0) {
      sheet.appendRow([" "]);
      sheet.appendRow(["Clave", "Resumen", "Estado"]);
      
      tareas.forEach(issue => {
        sheet.appendRow([
          issue.key,
          issue.fields.summary,
          issue.fields.status?.name || "Sin estado"
        ]);
      });
    }
    
    Logger.log("✅ Reporte de backup completado");
  } catch (error) {
    Logger.log(`❌ Error en reporte de backup: ${error.message}`);
  }
}

/**
 * Debug completo para validar todo el sistema
 */
function debugCompleto() {
  Logger.log("=== DEBUG COMPLETO DEL SISTEMA ===");
  
  try {
    // Verificar configuración
    Logger.log(`CONFIG_JIRA existe: ${typeof CONFIG_JIRA !== 'undefined'}`);
    if (typeof CONFIG_JIRA !== 'undefined') {
      Logger.log(`Campo compromiso: ${CONFIG_JIRA.customFields.compromiso}`);
      Logger.log(`Campo fechaHora: ${CONFIG_JIRA.customFields.fechaHora || 'VACÍO (correcto)'}`);
      Logger.log(`Proyecto: ${CONFIG_JIRA.projectKey}`);
      Logger.log(`Dominio: ${CONFIG_JIRA.dominio}`);
    }
    
    // Verificar clases
    Logger.log(`ReportGenerator existe: ${typeof ReportGenerator !== 'undefined'}`);
    Logger.log(`JiraAPI existe: ${typeof JiraAPI !== 'undefined'}`);
    Logger.log(`CredManager existe: ${typeof CredManager !== 'undefined'}`);
    
    // Test básico de sheets
    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    Logger.log(`Spreadsheet: ${spreadsheet.getName()}`);
    
    const testSheet = spreadsheet.insertSheet("TEST_DEBUG_" + Date.now());
    testSheet.appendRow(["Test", "Funciona", new Date()]);
    Logger.log("✅ Test de escritura funciona");
    
    // Limpiar hoja de test
    spreadsheet.deleteSheet(testSheet);
    Logger.log("🧹 Hoja de test eliminada");
    
    Logger.log("✅ DEBUG COMPLETO EXITOSO");
    
  } catch (error) {
    Logger.log(`❌ Error en debug completo: ${error.message}`);
  }
}