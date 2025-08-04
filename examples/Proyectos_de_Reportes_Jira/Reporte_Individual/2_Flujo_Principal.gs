// =====================================
// ARCHIVO 3: REPORTE INDIVIDUAL
// =====================================

/**
 * ✅ Inicia el proceso para generar un reporte individual de entregables por persona.
 */
function generarReporteIndividualEntregables() {
  const ui = SpreadsheetApp.getUi();
  try {
    Logger.log("🎯 Iniciando reporte individual de entregables...");
    ui.showModalDialog(
      HtmlService.createHtmlOutput('<p>🔍 Obteniendo lista de usuarios y sprints...</p>').setWidth(400).setHeight(100),
      'Cargando datos...'
    );

    const usuariosActivos = obtenerUsuariosActivos();
    const { gruposValidos } = obtenerGruposDeSprintsPorPrefijo();

    if (usuariosActivos.length === 0) {
      ui.alert('Sin Usuarios', 'No se encontraron usuarios activos en las tareas recientes.', ui.ButtonSet.OK);
      return;
    }

    const html = crearDialogoConfiguracionIndividual(usuariosActivos, gruposValidos);
    ui.showModalDialog(html, '👤 Configurar Reporte Individual');

  } catch (error) {
    Logger.log(`❌ Error en reporte individual: ${error.message}`);
    ui.alert('Error', `Error generando reporte individual: ${error.message}`, ui.ButtonSet.OK);
  }
}

/**
 * ✅ Crea el diálogo HTML unificado para configurar el reporte individual.
 */
function crearDialogoConfiguracionIndividual(usuarios, sprints) {
  let html = `
    <style>
      body { font-family: Arial, sans-serif; margin: 15px; background-color: #f8f9fa; }
      .container { max-width: 500px; margin: 0 auto; }
      .form-group { margin-bottom: 15px; }
      label { display: block; margin-bottom: 5px; font-weight: bold; color: #495057; }
      select, button { width: 100%; padding: 10px; border-radius: 4px; border: 1px solid #ced4da; font-size: 14px; }
      button { background-color: #007bff; color: white; border: none; cursor: pointer; transition: background-color 0.2s; }
      button:hover { background-color: #0056b3; }
      #loader { display: none; text-align: center; padding: 20px; }
    </style>
    <div class="container">
      <h3>👤 Configurar Reporte Individual</h3>
      <div class="form-group">
        <label for="usuario">Seleccionar Usuario:</label>
        <select id="usuario">
          ${usuarios.map(u => `<option value="${u.accountId}" data-email="${u.emailAddress || ''}" data-name="${u.displayName.replace(/"/g, '&quot;')}">${u.displayName} (${u.emailAddress || 'Sin email'})</option>`).join('')}
        </select>
      </div>
      <div class="form-group">
        <label for="periodo">Seleccionar Período:</label>
        <select id="periodo">
          <option value="ultimos_6_meses">Últimos 6 meses (por defecto)</option>
          <optgroup label="Sprints Específicos">
            ${sprints.map(s => `<option value="${s}">${s}</option>`).join('')}
          </optgroup>
        </select>
      </div>
      <button onclick="ejecutarReporte()">🚀 Generar Reporte</button>
    </div>
    <div id="loader"><p>🔄 Generando reporte... Por favor, espera.</p></div>
    <script>
      function ejecutarReporte() {
        document.querySelector('.container').style.display = 'none';
        document.getElementById('loader').style.display = 'block';
        const select = document.getElementById('usuario');
        const selectedOption = select.options[select.selectedIndex];
        const accountId = selectedOption.value;
        const nombreUsuario = selectedOption.getAttribute('data-name');
        const emailUsuario = selectedOption.getAttribute('data-email');
        const periodo = document.getElementById('periodo').value;
        google.script.run
          .withSuccessHandler(() => google.script.host.close())
          .withFailureHandler(err => { alert('Error: ' + err); google.script.host.close(); })
          .procesarReporteIndividual(accountId, periodo, nombreUsuario, emailUsuario);
      }
    </script>
  `;
  return HtmlService.createHtmlOutput(html).setWidth(550).setHeight(350);
}

/**
 * ✅ Procesa y genera el reporte individual para un usuario y período específicos.
 */
function procesarReporteIndividual(accountId, periodo, nombreUsuario, emailUsuario) {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  try {
    Logger.log(`🎯 Procesando reporte individual para: ${nombreUsuario} (${accountId}) en el período: ${periodo}`);
    if (!accountId) {
      throw new Error('Account ID inválido proporcionado');
    }

    const sprintPrefix = (periodo !== 'ultimos_6_meses') ? periodo : null;
    const tareasUsuario = LibreriaCoreJira.obtenerTareasDeUsuario(accountId, sprintPrefix);

    const nombreArchivo = sprintPrefix ? `Individual_${nombreUsuario.replace(/\s/g, '_')}_${sprintPrefix}` : `Individual_${nombreUsuario.replace(/\s/g, '_')}_6M`;
    const sheetName = nombreArchivo.replace(/[^a-zA-Z0-9_]/g, '_');
    
    let sheet = spreadsheet.getSheetByName(sheetName);
    if (sheet) {
      sheet.clear();
    } else {
      sheet = spreadsheet.insertSheet(sheetName);
    }
    spreadsheet.setActiveSheet(sheet);

    if (tareasUsuario.length === 0) {
      escribirMensajeUsuarioSinTareas(sheet, nombreUsuario, periodo);
      return;
    }

    Logger.log(`📊 Encontradas ${tareasUsuario.length} tareas para ${nombreUsuario}`);
    const tareasConAnalisis = tareasUsuario.map(tarea => ({
      ...tarea,
      entregables: LibreriaCoreJira.evaluarEntregablesYEvidencia(tarea)
    }));

    escribirReporteIndividualCompleto(sheet, tareasConAnalisis, nombreUsuario, emailUsuario, periodo);
    aplicarFormatoReporteIndividual(sheet);
    mostrarResumenReporteIndividual(tareasConAnalisis, nombreUsuario);
    Logger.log(`✅ Reporte individual generado exitosamente para ${nombreUsuario}`);

  } catch (error) {
    LibreriaCoreJira.registrarError(error, 'procesarReporteIndividual');
  }
}

/**
 * ✅ Muestra un resumen del reporte individual generado.
 */
function mostrarResumenReporteIndividual(tareasConAnalisis, nombreUsuario) {
  const ui = SpreadsheetApp.getUi();
  const stats = calcularEstadisticasUsuario(tareasConAnalisis);
  let resumen = `✅ Reporte para ${nombreUsuario} generado exitosamente.\n\n` +
                `📊 Tareas analizadas: ${stats.totalTareas}\n` +
                `⭐ Puntuación promedio: ${stats.puntuacionPromedio}/10\n\n`;
  if (stats.mejorTarea) {
    resumen += `🏆 Tarea destacada: ${stats.mejorTarea.key} (${stats.mejorTarea.puntuacion} puntos)\n`;
  }
  if (stats.peorTarea) {
    resumen += `📉 Tarea con menor evidencia: ${stats.peorTarea.key} (${stats.peorTarea.puntuacion} puntos)\n`;
  }
  ui.alert('Reporte Individual Completo', resumen, ui.ButtonSet.OK);
}
