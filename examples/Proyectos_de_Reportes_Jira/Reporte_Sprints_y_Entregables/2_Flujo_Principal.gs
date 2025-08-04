// =====================================
// ARCHIVO 2: REPORTE PRINCIPAL Y UI
// =====================================

/**
 * Muestra un diálogo HTML al usuario para que seleccione un grupo de sprints (prefijo).
 * Primero, obtiene los sprints de Jira, los agrupa y luego presenta las opciones en un diálogo.
 */
function mostrarDialogoGrupos() {
  const ui = SpreadsheetApp.getUi();
  try {
    Logger.log("🚀 Mostrando diálogo de selección de prefijo de sprint...");
    // Muestra un diálogo de carga mientras se obtienen los datos.
    ui.showModalDialog(
      HtmlService.createHtmlOutput('<p>Analizando sprints y validando entregables, por favor espera...</p>')
        .setWidth(400).setHeight(100), 
      'Cargando...'
    );
    
    // Obtiene los grupos de sprints y aquellos que no cumplen con el formato esperado.
    const { gruposValidos, sprintsNoConformes } = obtenerGruposDeSprintsPorPrefijo();
    
    if (sprintsNoConformes.length > 0) {
      Logger.log(`⚠️ Se encontraron ${sprintsNoConformes.length} sprints con formato no válido que fueron ignorados:`);
      sprintsNoConformes.forEach(nombre => Logger.log(` - ${nombre}`));
    }

    if (gruposValidos.length === 0) {
      ui.alert('Sin Sprints', 'No se encontraron sprints que sigan la nomenclatura "Q#-S#-Año" para agrupar.', ui.ButtonSet.OK);
      return;
    }
    
    // Crea y muestra el diálogo HTML con la lista de grupos de sprints.
    const html = crearHtmlParaDialogo(gruposValidos);
    ui.showModalDialog(html, 'Selecciona un Periodo de Sprint');

  } catch (error) {
    Logger.log(`❌ Error al mostrar el diálogo: ${error.message}`);
    ui.alert('Error', `Ocurrió un error: ${error.message}`, ui.ButtonSet.OK);
  }
}

/**
 * Crea el contenido HTML para el diálogo de selección de grupo de sprints.
 * @param {string[]} grupos - Un array con los nombres de los grupos de sprints.
 * @returns {HtmlOutput} El objeto HTML para mostrar en el diálogo.
 */
function crearHtmlParaDialogo(grupos) {
  let html = `
    <style>
      body { font-family: Arial, sans-serif; margin: 0; }
      ul { list-style-type: none; padding: 0; margin: 0; max-height: 300px; overflow-y: auto; }
      li { padding: 10px 15px; border-bottom: 1px solid #ddd; cursor: pointer; transition: background-color 0.2s; }
      li:hover { background-color: #f0f8ff; }
      li:last-child { border-bottom: none; }
      .sprint-info { font-size: 0.9em; color: #666; }
      #loader { display: none; padding: 20px; text-align: center; font-size: 1.1em; }
    </style>
    <ul>
  `;
  
  grupos.forEach(grupo => {
    const grupoEscapado = grupo.replace(/'/g, "\'").replace(/"/g, "&quot;");
    const sprintInfo = parseSprintForDisplay(grupo);
    html += `
      <li onclick="seleccionarGrupo('${grupoEscapado}')">
        <div><strong>${grupo}</strong></div>
        <div class="sprint-info">${sprintInfo}</div>
      </li>
    `;
  });
  
  html += `
    </ul>
    <div id="loader">
      <p>🔄 Generando reporte con análisis de entregables...</p>
      <p style="font-size: 0.9em; color: #666;">Validando archivos, imágenes y comentarios</p>
    </div>
    <script>
      function seleccionarGrupo(grupo) {
        document.querySelector('ul').style.display = 'none';
        document.getElementById('loader').style.display = 'block';
        google.script.run
              .withSuccessHandler(function() { google.script.host.close(); })
              .withFailureHandler(function(err) { alert('Error: ' + err); google.script.host.close(); })
              .generarReportePorGrupo(grupo);
      }
    </script>
  `;
  
  return HtmlService.createHtmlOutput(html).setWidth(450).setHeight(350);
}

/**
 * Genera el reporte consolidado para un grupo de sprints específico.
 * @param {string} prefijoNormalizado - El prefijo del grupo de sprints a reportar.
 */
function generarReportePorGrupo(prefijoNormalizado) {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  const sheetName = `${prefijoNormalizado.replace(/[^a-zA-Z0-9]/g, '_')}`;
  let sheet = spreadsheet.getSheetByName(sheetName) || spreadsheet.insertSheet(sheetName);
  sheet.clear();
  spreadsheet.setActiveSheet(sheet);

  try {
    Logger.log(`🎯 Iniciando generación de reporte para: ${prefijoNormalizado}`);
    
    const todosLosSprints = LibreriaCoreJira.obtenerTodosLosSprints();
    
    const sprintsCoincidentes = todosLosSprints.filter(sprint => {
      const regex = /^Q([1-4])\s*-\s*S([1-6])\s*-\s*(\d{2,4})/;
      const match = sprint.name.trim().match(regex);
      if (match) {
        let anio = match[3];
        if (anio.length === 4) anio = anio.substring(2);
        const claveNormalizada = `Q${match[1]}-S${match[2]}-${anio}`;
        return claveNormalizada === prefijoNormalizado;
      }
      return false;
    });
    
    if (sprintsCoincidentes.length === 0) {
      throw new Error(`No se encontraron sprints para el prefijo "${prefijoNormalizado}".`);
    }

    const sprintIds = sprintsCoincidentes.map(s => s.id);
    const tareas = LibreriaCoreJira.fetchJiraAPI('/rest/api/3/search', { 
      jql: `sprint IN (${sprintIds.join(',')}) ORDER BY project, status`,
      fields: 'project,summary,status,assignee,priority,labels,issuetype,created,updated,resolutiondate,attachment,comment,description,worklog,issuelinks,remotelinks,customfield_10020,customfield_10230,customfield_10231,customfield_10228,customfield_10016,customfield_10003'
    });

    if (tareas.length === 0) {
      sheet.getRange("A1").setValue(`✅ No se encontraron tareas para el prefijo "${prefijoNormalizado}".`);
      return;
    }
    
    const tareasConAnalisis = tareas.map(tarea => ({
      ...tarea,
      entregables: LibreriaCoreJira.evaluarEntregablesYEvidencia(tarea)
    }));
    
    const tareasAgrupadas = tareasConAnalisis.reduce((acc, tarea) => {
      const proyecto = tarea.fields.project.name;
      if (!acc[proyecto]) acc[proyecto] = [];
      acc[proyecto].push(tarea);
      return acc;
    }, {});

    escribirDatosAgrupadosConEntregables(sheet, tareasAgrupadas, prefijoNormalizado, sprintsCoincidentes);
    aplicarFormatoReporteSprintConEntregables(sheet);
    
    Logger.log(`✅ Reporte generado exitosamente para: ${prefijoNormalizado}`);
    
  } catch (error) {
    LibreriaCoreJira.registrarError(error, 'generarReportePorGrupo');
  }
}
