// =====================================
// ARCHIVO 15: FLUJO PRINCIPAL DE REPORTE SIMPLE DE PROYECTOS
// =====================================

/**
 * Función principal que orquesta la generación del reporte simple de proyectos.
 */
function generarReporteSimpleDeProyectos() {
  const ui = SpreadsheetApp.getUi();
  try {
    Logger.log("🚀 Iniciando la generación del reporte simple de proyectos...");
    
    ui.showModalDialog(
      HtmlService.createHtmlOutput('<p>🔍 Obteniendo la lista de todos los proyectos de Jira...</p>')
        .setWidth(400).setHeight(100), 
      'Generando Reporte...'
    );
    
    const todosLosProyectos = LibreriaCoreJira.obtenerTodosLosProyectos();
    if (todosLosProyectos.length === 0) {
      ui.alert('No se encontraron proyectos en Jira.');
      return;
    }
    Logger.log(`✅ Se encontraron ${todosLosProyectos.length} proyectos.`);

    const datosProcesados = procesarDatosDeProyectosSimples(todosLosProyectos);
    
    escribirReporteSimple(datosProcesados);
    
    Logger.log("✅ Reporte simple de proyectos generado exitosamente.");
    
    ui.alert('Reporte Generado', 'El reporte simple de proyectos ha sido creado exitosamente.', ui.ButtonSet.OK);

  } catch (error) {
    LibreriaCoreJira.registrarError(error, 'generarReporteSimpleDeProyectos');
  }
}
