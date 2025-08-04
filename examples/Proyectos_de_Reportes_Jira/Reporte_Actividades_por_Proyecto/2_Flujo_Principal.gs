// =====================================
// ARCHIVO 20: FLUJO PRINCIPAL DE REPORTE DE ACTIVIDADES
// =====================================

/**
 * Inicia el proceso de generación de reporte de actividades mostrando un diálogo para seleccionar el proyecto.
 */
function iniciarReporteActividadesPorProyecto() {
  const ui = SpreadsheetApp.getUi();
  try {
    Logger.log("🚀 Iniciando selección de proyecto para reporte de actividades.");
    ui.showModalDialog(
      HtmlService.createHtmlOutput('<p>Cargando lista de proyectos...</p>').setWidth(300).setHeight(100),
      'Cargando...'
    );

    const proyectos = obtenerTodosLosProyectosJiraSimple(); // Reutilizamos la función del reporte simple
    if (proyectos.length === 0) {
      ui.alert("No se pudieron cargar los proyectos de Jira.");
      return;
    }

    const html = crearDialogoSeleccionProyecto(proyectos);
    ui.showModalDialog(html, '1/2: Selecciona un Proyecto');

  } catch (e) {
    Logger.log(`Error al iniciar el reporte de actividades: ${e.stack}`);
    ui.alert(`Error: ${e.message}`);
  }
}

/**
 * Crea el HTML para el diálogo de selección de proyecto.
 */
function crearDialogoSeleccionProyecto(proyectos) {
  let options = proyectos
    .sort((a, b) => a.name.localeCompare(b.name))
    .map(p => `<option value="${p.key}">${p.name} (${p.key})</option>`)
    .join("");

  return HtmlService.createHtmlOutput(`
    <style>body{font-family: Arial, sans-serif;}</style>
    <h3>Selecciona el Proyecto</h3>
    <select id="proyecto" style="width: 100%; padding: 5px;">${options}</select>
    <br><br>
    <button onclick="google.script.run.withSuccessHandler(closeDialog).mostrarDialogoFechas(document.getElementById('proyecto').value)">Siguiente</button>
    <script>function closeDialog(){ google.script.host.close(); }</script>
  `).setWidth(400).setHeight(150);
}

/**
 * Muestra el segundo diálogo para seleccionar el rango de fechas.
 * @param {string} proyectoKey - La clave del proyecto seleccionado en el primer diálogo.
 */
function mostrarDialogoFechas(proyectoKey) {
  const ui = SpreadsheetApp.getUi();
  const html = crearDialogoFechas(proyectoKey);
  ui.showModalDialog(html, `2/2: Fechas para el Proyecto ${proyectoKey}`);
}

/**
 * Crea el HTML para el diálogo de selección de fechas.
 */
function crearDialogoFechas(proyectoKey) {
  return HtmlService.createHtmlOutput(`
    <style>body{font-family: Arial, sans-serif;} .form-group{margin-bottom:10px;}</style>
    <h3>Selecciona el Rango de Fechas</h3>
    <p>Se buscarán tareas <b>creadas</b> en este período.</p>
    <input type="hidden" id="proyectoKey" value="${proyectoKey}">
    <div class="form-group">
      <label for="fechaInicio">Fecha de Inicio:</label><br>
      <input type="date" id="fechaInicio" style="width: 95%; padding: 5px;">
    </div>
    <div class="form-group">
      <label for="fechaFin">Fecha de Fin:</label><br>
      <input type="date" id="fechaFin" style="width: 95%; padding: 5px;">
    </div>
    <br>
    <button onclick="ejecutarReporte()">Generar Reporte</button>
    <script>
      function ejecutarReporte() {
        const data = {
          proyectoKey: document.getElementById('proyectoKey').value,
          fechaInicio: document.getElementById('fechaInicio').value,
          fechaFin: document.getElementById('fechaFin').value
        };
        if (!data.fechaInicio || !data.fechaFin) {
          alert("Por favor, selecciona ambas fechas.");
          return;
        }
        google.script.run
          .withSuccessHandler(() => google.script.host.close())
          .withFailureHandler(err => { alert("Error: " + err); google.script.host.close(); })
          .procesarYGenerarReporteActividades(data);
      }
    </script>
  `).setWidth(400).setHeight(250);
}

/**
 * Función final que obtiene, procesa y escribe el reporte.
 * @param {Object} data - Objeto con {proyectoKey, fechaInicio, fechaFin}.
 */
function procesarYGenerarReporteActividades(data) {
  const ui = SpreadsheetApp.getUi();
  try {
    Logger.log(`🚀 Generando reporte para ${data.proyectoKey} entre ${data.fechaInicio} y ${data.fechaFin}`);
    ui.showModalDialog(
      HtmlService.createHtmlOutput(`<p>Buscando actividades para el proyecto <b>${data.proyectoKey}</b>...</p>`).setWidth(400).setHeight(100),
      'Procesando...'
    );

    const jql = `project = "${data.proyectoKey}" AND created >= "${data.fechaInicio}" AND created <= "${data.fechaFin}" ORDER BY key ASC`;
    const campos = 'summary,assignee,duedate,status,timetracking,labels,customfield_10020';
    const tareas = LibreriaCoreJira.fetchJiraAPI('/rest/api/3/search', { jql: jql, fields: campos });

    if (tareas.length === 0) {
      ui.alert("No se encontraron actividades para el proyecto y rango de fechas seleccionados.");
      return;
    }

    const datosProcesados = procesarDatosActividades(tareas);
    escribirReporteActividades(datosProcesados, data.proyectoKey);

    ui.alert("Reporte Generado", `Se ha generado el reporte de actividades para el proyecto ${data.proyectoKey}.`, ui.ButtonSet.OK);

  } catch (e) {
    LibreriaCoreJira.registrarError(e, 'procesarYGenerarReporteActividades');
  }
}
