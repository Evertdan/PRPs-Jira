/**
 * Reports.gs - Contiene toda la lógica para la generación de reportes de sprint.
 */

// ========================================
// FUNCIONES DE GENERACIÓN DE REPORTES
// ========================================

/**
 * Inicia el flujo para generar el reporte por proyecto.
 */
function iniciarReportePorProyecto() {
  mostrarDialogoGrupos('generarReportePorProyecto');
}

/**
 * Inicia el flujo para generar el reporte por asignado.
 */
function iniciarReportePorAsignado() {
  mostrarDialogoGrupos('generarReportePorAsignado');
}

/**
 * Muestra el diálogo de selección de sprint al usuario.
 * @param {string} targetFunction - La función que se ejecutará al seleccionar un sprint.
 */
function mostrarDialogoGrupos(targetFunction) {
  const ui = SpreadsheetApp.getUi();
  try {
    const { gruposValidos } = obtenerGruposDeSprintsPorPrefijo();
    if (gruposValidos.length === 0) {
      ui.alert('No se encontraron sprints con la nomenclatura "Q#-S#-Año".');
      return;
    }
    const html = crearHtmlParaDialogo(gruposValidos, targetFunction);
    ui.showModalDialog(html, 'Selecciona un Periodo de Sprint');
  } catch (e) {
    registrarError(e, 'mostrarDialogoGrupos');
    ui.alert('Error', e.message);
  }
}

/**
 * Crea el HTML para el diálogo de selección de sprint.
 * @param {Array<string>} grupos - La lista de prefijos de sprint.
 * @param {string} targetFunction - La función a llamar.
 * @returns {HtmlOutput}
 */
function crearHtmlParaDialogo(grupos, targetFunction) {
  let html = `
    <style>
      body { font-family: Arial, sans-serif; padding: 10px; }
      select { width: 100%; padding: 8px; margin-bottom: 10px; border-radius: 4px; border: 1px solid #ccc; }
      button { padding: 10px 15px; border: none; background-color: #4285f4; color: white; border-radius: 4px; cursor: pointer; }
      button:hover { background-color: #357ae8; }
      #loader { display: none; text-align: center; padding-top: 20px; }
    </style>
    <div id="form">
      <label for="sprint-select">Selecciona el período:</label>
      <select id="sprint-select">
  `;
  
  grupos.forEach(grupo => {
    const textoMostrado = parseSprintForDisplay(grupo);
    html += `<option value="${grupo}">${textoMostrado}</option>`;
  });
  
  html += `
      </select>
      <button onclick="ejecutarReporte()">Generar Reporte</button>
    </div>
    <div id="loader">
      <p>🔄 Generando reporte, por favor espera...</p>
    </div>
    <script>
      function ejecutarReporte() {
        document.getElementById('form').style.display = 'none';
        document.getElementById('loader').style.display = 'block';
        const grupoSeleccionado = document.getElementById('sprint-select').value;
        google.script.run
              .withSuccessHandler(() => google.script.host.close())
              .withFailureHandler(err => { alert('Error: ' + err); google.script.host.close(); })
              .${targetFunction}(grupoSeleccionado);
      }
    </script>
  `;
  
  return HtmlService.createHtmlOutput(html).setWidth(350).setHeight(150);
}

/**
 * Función maestra que genera cualquier tipo de reporte de sprint.
 * @param {string} prefijo - El prefijo del período de sprint.
 * @param {string} tipo - El tipo de reporte: 'proyecto' o 'asignado'.
 */
function generarReporteGenerico(prefijo, tipo) {
  const esPorProyecto = tipo === 'proyecto';
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  const sheetName = esPorProyecto ? `Reporte_Proyecto_${prefijo}` : `Reporte_Asignado_${prefijo}`;
  let sheet = spreadsheet.getSheetByName(sheetName) || spreadsheet.insertSheet(sheetName);
  sheet.clear();
  spreadsheet.setActiveSheet(sheet);

  try {
    mostrarMensajeDeProgreso(sheet, '🔄 Obteniendo datos de Jira, por favor espera...');
    logEstructurado('INFO', `🎯 Iniciando reporte por ${tipo.toUpperCase()} para: ${prefijo}`);
    
    const sprints = obtenerSprintsPorPrefijo(prefijo);
    if (sprints.length === 0) throw new Error(`No se encontraron sprints para "${prefijo}".`);

    const sprintIds = sprints.map(s => s.id);
    const orderBy = esPorProyecto ? 'project, status' : 'assignee, status';
    const jql = `sprint IN (${sprintIds.join(',')}) AND updated >= -90d ORDER BY ${orderBy}`;
    
    const tareas = new JiraApiManager().fetchJiraAPI(`/rest/api/3/search`, { jql });

    if (!tareas || !tareas.issues || tareas.issues.length === 0) {
      mostrarMensajeDeProgreso(sheet, `✅ No se encontraron tareas para "${prefijo}".`);
      return;
    }
    
    mostrarMensajeDeProgreso(sheet, '📊 Analizando entregables y agrupando tareas...');
    
    if (esPorProyecto) {
      const tareasAgrupadas = agruparTareasPorProyecto(tareas.issues);
      mostrarMensajeDeProgreso(sheet, '✍️ Escribiendo reporte en la hoja de cálculo...');
      escribirReportePersonalizadoEnHoja(sheet, tareasAgrupadas, prefijo, sprints);
    } else {
      const tareasAgrupadas = agruparTareasPorAsignado(tareas.issues);
      mostrarMensajeDeProgreso(sheet, '✍️ Escribiendo reporte en la hoja de cálculo...');
      escribirReportePorAsignadoEnHoja(sheet, tareasAgrupadas, prefijo, sprints);
    }
    
    mostrarMensajeDeProgreso(sheet, '✅ ¡Reporte completado!');

  } catch (e) {
    registrarError(e, `generarReporteGenerico (${tipo})`);
    mostrarMensajeDeProgreso(sheet, `❌ Error: ${e.message}`);
  }
}

function generarReportePorProyecto(prefijo) {
  generarReporteGenerico(prefijo, 'proyecto');
}

function generarReportePorAsignado(prefijo) {
  generarReporteGenerico(prefijo, 'asignado');
}

function obtenerGruposDeSprintsPorPrefijo() {
  const todosLosSprints = obtenerTodosLosSprints();
  const grupos = new Set();
  const sprintsNoConformes = [];
  const regex = /^Q([1-4])\s*-\s*S([1-6])\s*-\s*(\d{2,4})/; 

  todosLosSprints.forEach(sprint => {
    const match = sprint.name.trim().match(regex);
    if (match) {
      let anio = match[3].length === 4 ? match[3].substring(2) : match[3];
      grupos.add(`Q${match[1]}-S${match[2]}-${anio}`);
    } else {
      sprintsNoConformes.push(sprint.name);
    }
  });
  return { gruposValidos: Array.from(grupos).sort(), sprintsNoConformes };
}

/**
 * Convierte un prefijo de sprint (ej. Q1-S2-24) a un formato legible.
 * @param {string} prefijo - El prefijo del sprint.
 * @returns {string} El texto formateado para mostrar.
 */
function parseSprintForDisplay(prefijo) {
  const match = prefijo.match(/^Q([1-4])-S([1-6])-(\d{2})$/);
  if (!match) return prefijo; // Devuelve el original si no coincide

  const [, trimestre, sprint, anio] = match;
  return `Trimestre ${trimestre}, Sprint ${sprint} - 20${anio}`;
}

function obtenerSprintsPorPrefijo(prefijo) {
  const todosLosSprints = obtenerTodosLosSprints();
  const regex = /^Q([1-4])\s*-\s*S([1-6])\s*-\s*(\d{2,4})/; 
  return todosLosSprints.filter(sprint => {
    const match = sprint.name.trim().match(regex);
    if (!match) return false;
    let anio = match[3].length === 4 ? match[3].substring(2) : match[3];
    return `Q${match[1]}-S${match[2]}-${anio}` === prefijo;
  });
}

function agruparTareasPorProyecto(tareas) {
  return tareas.reduce((acc, tarea) => {
    const proyecto = tarea.fields.project.name;
    if (!acc[proyecto]) acc[proyecto] = [];
    acc[proyecto].push(tarea);
    return acc;
  }, {});
}

function escribirReportePersonalizadoEnHoja(sheet, tareasAgrupadas, prefijo, sprints) {
  const output = [];
  
  // Títulos e información
  output.push([`📊 REPORTE DE SPRINTS: ${prefijo}`]);
  output.push([]); // Fila vacía
  output.push(['Sprints incluidos:', sprints.map(s => s.name).join(', ')]);
  output.push([]); // Fila vacía

  // Encabezados
  const headers = ["Key", "Resumen", "Asignado", "Tipo de Incidencia", "Fecha de vencimiento", "Etiquetas", "Score", "Calidad", "Resumen Entregables"];
  output.push(headers);

  // Procesar datos
  for (const proyecto in tareasAgrupadas) {
    output.push([`🏢 PROYECTO: ${proyecto}`]); // Fila de agrupación
    
    tareasAgrupadas[proyecto].forEach(tarea => {
      const analisis = evaluarEntregablesYEvidencia(tarea);
      const fechaVencimiento = tarea.fields.duedate ? new Date(tarea.fields.duedate).toLocaleDateString() : 'N/A';
      output.push([
        tarea.key,
        tarea.fields.summary,
        tarea.fields.assignee?.displayName || 'Sin Asignar',
        tarea.fields.issuetype?.name || 'N/A',
        fechaVencimiento,
        (tarea.fields.labels || []).join(', '),
        analisis.puntuacion, 
        `${analisis.calidad.emoji} ${analisis.calidad.texto}`, 
        analisis.resumen
      ]);
    });
  }

  // Escribir todo de una vez
  sheet.getRange(1, 1, output.length, headers.length).setValues(output);

  // Aplicar formato después de escribir
  sheet.getRange(1, 1).setFontSize(16).setFontWeight('bold');
  sheet.getRange(3, 1).setFontWeight('bold');
  sheet.getRange(5, 1, 1, headers.length).setBackground('#4285f4').setFontColor('white').setFontWeight('bold');

  let filaActual = 6; // Empezar a formatear después de los encabezados
  for (const proyecto in tareasAgrupadas) {
    sheet.getRange(filaActual, 1, 1, headers.length).merge().setBackground('#f0f0f0').setFontWeight('bold');
    filaActual += tareasAgrupadas[proyecto].length + 1;
  }
  
  // Formato de calidad (esto aún requiere iterar, pero es más rápido sobre datos ya escritos)
  let dataRowIndex = 6;
  for (const proyecto in tareasAgrupadas) {
    dataRowIndex++; // Saltar fila de proyecto
    tareasAgrupadas[proyecto].forEach(tarea => {
      const analisis = evaluarEntregablesYEvidencia(tarea);
      sheet.getRange(dataRowIndex, headers.indexOf('Calidad') + 1).setBackground(analisis.calidad.color);
      dataRowIndex++;
    });
  }

  sheet.autoResizeColumns(1, headers.length);
}

// ========================================
// NUEVO REPORTE POR ASIGNADO
// ========================================

/**
 * Agrupa las tareas por la persona asignada.
 * @param {Array<Object>} tareas - La lista de tareas de Jira.
 * @returns {Object} Tareas agrupadas por nombre de asignado.
 */
function agruparTareasPorAsignado(tareas) {
  return tareas.reduce((acc, tarea) => {
    const asignado = tarea.fields.assignee ? tarea.fields.assignee.displayName : 'Sin Asignar';
    if (!acc[asignado]) acc[asignado] = [];
    acc[asignado].push(tarea);
    return acc;
  }, {});
}

/**
 * Escribe el reporte agrupado por asignado en la hoja de cálculo.
 * @param {Sheet} sheet - La hoja de destino.
 * @param {Object} tareasAgrupadas - Tareas agrupadas por asignado.
 * @param {string} prefijo - El prefijo del período.
 * @param {Array<Object>} sprints - La lista de sprints incluidos.
 */
function escribirReportePorAsignadoEnHoja(sheet, tareasAgrupadas, prefijo, sprints) {
  const output = [];
  
  // Títulos e información
  output.push([`📊 REPORTE POR ASIGNADO: ${prefijo}`]);
  output.push([]);
  output.push(['Sprints incluidos:', sprints.map(s => s.name).join(', ')]);
  output.push([]);

  // Encabezados actualizados
  const headers = ["Key", "Resumen", "Proyecto", "Tipo de Incidencia", "Fecha de vencimiento", "Etiquetas", "Score", "Calidad"];
  output.push(headers);

  // Procesar datos
  for (const asignado in tareasAgrupadas) {
    output.push([`👤 ASIGNADO: ${asignado}`]);
    
    const tareasDelAsignado = tareasAgrupadas[asignado];
    tareasDelAsignado.forEach(tarea => {
      const analisis = evaluarEntregablesYEvidencia(tarea);
      const fechaVencimiento = tarea.fields.duedate ? new Date(tarea.fields.duedate).toLocaleDateString() : 'N/A';
      output.push([
        tarea.key,
        tarea.fields.summary,
        tarea.fields.project.name,
        tarea.fields.issuetype?.name || 'N/A',
        fechaVencimiento,
        (tarea.fields.labels || []).join(', '),
        analisis.puntuacion, 
        `${analisis.calidad.emoji} ${analisis.calidad.texto}`
      ]);
    });

    // Calcular y añadir estadísticas
    const estadisticas = calcularEstadisticasDeEntregables(tareasDelAsignado);
    output.push([
      `Estadísticas:`,
      `Tareas: ${estadisticas.totalTareas}`,
      `Score Promedio: ${estadisticas.scorePromedio.toFixed(2)}`,
      `Calidad: ${estadisticas.resumenCalidad}`
    ]);
    output.push([]); // Espacio extra
  }

  // Escribir todo de una vez
  sheet.getRange(1, 1, output.length, headers.length).setValues(output);

  // Aplicar formato después de escribir
  sheet.getRange(1, 1).setFontSize(16).setFontWeight('bold');
  sheet.getRange(3, 1).setFontWeight('bold');
  sheet.getRange(5, 1, 1, headers.length).setBackground('#34a853').setFontColor('white').setFontWeight('bold');

  let filaActual = 6;
  for (const asignado in tareasAgrupadas) {
    sheet.getRange(filaActual, 1, 1, headers.length).merge().setBackground('#f0f0f0').setFontWeight('bold');
    filaActual++;
    
    tareasAgrupadas[asignado].forEach(tarea => {
      const analisis = evaluarEntregablesYEvidencia(tarea);
      sheet.getRange(filaActual, headers.indexOf('Calidad') + 1).setBackground(analisis.calidad.color);
      filaActual++;
    });
    
    sheet.getRange(filaActual, 1, 1, 4).setFontStyle('italic').setBackground('#e6f4ea');
    filaActual += 2;
  }

  sheet.autoResizeColumns(1, headers.length);
}

/**
 * Calcula estadísticas de entregables para un conjunto de tareas.
 * @param {Array<Object>} tareas - Lista de tareas de un asignado.
 * @returns {Object} Objeto con las estadísticas calculadas.
 */
function calcularEstadisticasDeEntregables(tareas) {
  if (tareas.length === 0) {
    return { totalTareas: 0, scorePromedio: 0, resumenCalidad: 'N/A' };
  }

  let scoreTotal = 0;
  const conteoCalidad = {};

  tareas.forEach(tarea => {
    const analisis = evaluarEntregablesYEvidencia(tarea);
    scoreTotal += analisis.puntuacion;
    const nivel = analisis.calidad.texto;
    conteoCalidad[nivel] = (conteoCalidad[nivel] || 0) + 1;
  });

  const resumenCalidad = Object.entries(conteoCalidad)
    .map(([nivel, count]) => `${count} ${nivel}`)
    .join(', ');

  return {
    totalTareas: tareas.length,
    scorePromedio: scoreTotal / tareas.length,
    resumenCalidad: resumenCalidad
  };
}

/**
 * Muestra un mensaje de progreso en la primera celda de una hoja.
 * @param {Sheet} sheet - La hoja donde se mostrará el mensaje.
 * @param {string} mensaje - El texto a mostrar.
 */
function mostrarMensajeDeProgreso(sheet, mensaje) {
  sheet.getRange("A1").setValue(mensaje);
  SpreadsheetApp.flush(); // Forzar la actualización de la UI
}


// ... (El resto de las funciones de reporte que ya existen)
