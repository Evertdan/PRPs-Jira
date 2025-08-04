// =====================================
// MÓDULO DE INTERFAZ DE USUARIO (UI)
// =====================================

/**
 * Muestra un formulario HTML para agregar una tarea individual.
 */
function agregarTareaIndividual() {
  const html = HtmlService.createHtmlOutputFromFile('FormularioTarea')
      .setWidth(600)
      .setHeight(500);
  SpreadsheetApp.getUi().showModalDialog(html, '➕ Agregar Nueva Tarea');
}

/**
 * Muestra un diálogo HTML avanzado para seleccionar proyectos.
 * @param {Array} proyectos - La lista de proyectos obtenida de Jira.
 */
function mostrarDialogoSeleccionProyectos(proyectos) {
  const htmlTemplate = HtmlService.createTemplateFromFile('DialogoProyectos');
  htmlTemplate.proyectos = proyectos;
  const html = htmlTemplate.evaluate().setWidth(600).setHeight(400);
  SpreadsheetApp.getUi().showModalDialog(html, '🏗️ Seleccionar Proyectos para Plantilla');
}

/**
 * Función que es llamada desde el HTML del diálogo para procesar la selección.
 * @param {Array} selectedKeys - Un array de las claves de proyecto seleccionadas.
 */
function procesarProyectosSeleccionados(selectedKeys) {
  const ui = SpreadsheetApp.getUi();
  if (!selectedKeys || selectedKeys.length === 0) {
    ui.alert("No se seleccionó ningún proyecto.");
    return;
  }

  const proyectos = LibreriaCoreJira.obtenerTodosLosProyectos();
  let generadas = 0;
  selectedKeys.forEach(key => {
    const proyecto = proyectos.find(p => p.key === key);
    if (proyecto) {
      crearHojaProyecto(proyecto);
      generadas++;
    }
  });

  ui.alert('✅ Proceso completado', `Se han generado ${generadas} hojas de plantilla.`);
}

/**
 * Muestra el diálogo del centro de ayuda.
 */
function mostrarCentroAyuda() {
  const ui = SpreadsheetApp.getUi();
  let mensaje = '🆘 CENTRO DE AYUDA - JIRA TASKS PRO v3.0 (Refactorizado)\n\n';
  mensaje += 'Esta versión utiliza una librería central para mayor eficiencia y mantenibilidad.\n\n';
  mensaje += '🚀 PASOS INICIALES:\n';
  mensaje += '1. Configura tus credenciales (Herramientas -> Configurar Credenciales).\n';
  mensaje += '2. Ejecuta un diagnóstico (Herramientas -> Diagnóstico Completo).\n';
  mensaje += '3. Genera una plantilla para tu proyecto (Plantillas -> Generar Hojas por Proyecto).\n';
  
  ui.alert('Centro de Ayuda', mensaje, ui.ButtonSet.OK);
}