// =====================================
// ARCHIVO 10: FLUJO PRINCIPAL DE REPORTE DE PROYECTOS
// =====================================

/**
 * Función principal que orquesta la generación del reporte de proyectos y épicas.
 * Se invoca desde el menú de la hoja de cálculo.
 */
function generarReporteProyectosEpicas() {
  const ui = SpreadsheetApp.getUi();
  try {
    Logger.log("🚀 Iniciando la generación del reporte de Proyectos y Épicas...");
    
    ui.showModalDialog(
      HtmlService.createHtmlOutput('<p>🔍 Obteniendo todos los proyectos, épicas y tareas desde Jira... Este proceso puede tardar varios minutos.</p>')
        .setWidth(450).setHeight(150), 
      'Generando Reporte Completo...'
    );
    
    const todosLosProyectos = LibreriaCoreJira.obtenerTodosLosProyectos();
    if (todosLosProyectos.length === 0) {
      ui.alert('No se encontraron proyectos en Jira.');
      return;
    }
    Logger.log(`✅ Se encontraron ${todosLosProyectos.length} proyectos.`);

    const proyectosConDetalles = procesarProyectosConEpicasYTareas(todosLosProyectos);
    
    Logger.log("📊 Datos de proyectos, épicas y tareas procesados.");
    
    escribirReporteProyectosCompleto(proyectosConDetalles);
    
    Logger.log("✅ Reporte de Proyectos y Épicas generado exitosamente.");
    
    ui.alert('Reporte Generado', 'El reporte de Proyectos y Épicas ha sido creado y formateado exitosamente.', ui.ButtonSet.OK);

  } catch (error) {
    LibreriaCoreJira.registrarError(error, 'generarReporteProyectosEpicas');
  }
}
