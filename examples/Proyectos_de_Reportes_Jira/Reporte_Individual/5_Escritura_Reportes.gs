// =====================================
// ARCHIVO 6: ESCRITURA Y FORMATO DE REPORTES
// =====================================

/**
 * ✅ Escribe el contenido completo del reporte individual en la hoja de cálculo.
 */
function escribirReporteIndividualCompleto(sheet, tareasConAnalisis, nombreUsuario, emailUsuario, periodo) {
  const fechaGeneracion = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), "dd/MM/yyyy HH:mm");
  const periodoFormateado = periodo === 'ultimos_6_meses' ? 'Últimos 6 meses' : periodo;

  sheet.getRange("A1").setValue(`👤 REPORTE INDIVIDUAL DE ENTREGABLES`).setFontSize(18).setFontWeight("bold").setFontColor("#1565c0");
  sheet.getRange("A2").setValue(`📧 Usuario: ${nombreUsuario}` + (emailUsuario ? ` (${emailUsuario})` : '')).setFontSize(14).setFontWeight("bold");
  sheet.getRange("A3").setValue(`📅 Generado: ${fechaGeneracion} • Período: ${periodoFormateado}`).setFontSize(10).setFontColor("#666666");

  const estadisticas = calcularEstadisticasUsuario(tareasConAnalisis);
  let currentRow = escribirEstadisticasUsuario(sheet, estadisticas, 5);
  const tareasPorProyecto = agruparTareasPorProyecto(tareasConAnalisis);
  currentRow = escribirAnalisisPorProyecto(sheet, tareasPorProyecto, currentRow + 2);
  currentRow = escribirDetalleTareasIndividual(sheet, tareasConAnalisis, currentRow + 3);
  escribirResumenMejoresPracticas(sheet, estadisticas, currentRow + 3);
}

/**
 * ✅ Escribe la sección de estadísticas del usuario en la hoja.
 */
function escribirEstadisticasUsuario(sheet, stats, startRow) {
  sheet.getRange(startRow, 1).setValue("📊 ESTADÍSTICAS GENERALES:").setFontWeight('bold').setFontSize(14).setFontColor("#0052CC");
  startRow += 2;
  const estadisticas = [
    ["📋 Total de tareas:", stats.totalTareas],
    ["✅ Tareas completadas:", `${stats.tareasCompletadas} (${Math.round(stats.tareasCompletadas/stats.totalTareas*100)}%)`],
    ["⏳ Tareas pendientes:", `${stats.tareasPendientes} (${Math.round(stats.tareasPendientes/stats.totalTareas*100)}%)`],
    ["", ""],
    ["📎 Tareas con archivos:", `${stats.conArchivos} (${Math.round(stats.conArchivos/stats.totalTareas*100)}%)`],
    ["🚫 Tareas sin evidencia:", `${stats.sinEvidencia} (${Math.round(stats.sinEvidencia/stats.totalTareas*100)}%)`],
    ["⭐ Tareas con evidencia completa:", `${stats.evidenciaCompleta} (${Math.round(stats.evidenciaCompleta/stats.totalTareas*100)}%)`],
    ["📊 Puntuación promedio:", `${stats.puntuacionPromedio}/10`]
  ];
  estadisticas.forEach(([etiqueta, valor], index) => {
    sheet.getRange(startRow + index, 1).setValue(etiqueta).setFontWeight('bold').setFontSize(10);
    sheet.getRange(startRow + index, 3).setValue(valor).setFontSize(10);
  });
  return startRow + estadisticas.length;
}

/**
 * ✅ Escribe la sección de análisis por proyecto.
 */
function escribirAnalisisPorProyecto(sheet, tareasPorProyecto, startRow) {
  sheet.getRange(startRow, 1).setValue("📁 ANÁLISIS POR PROYECTO:").setFontWeight('bold').setFontSize(14).setFontColor("#0052CC");
  startRow += 2;
  const proyectos = Object.keys(tareasPorProyecto).sort();
  proyectos.forEach(proyectoKey => {
    const proyecto = tareasPorProyecto[proyectoKey];
    const stats = calcularEstadisticasEntregables(proyecto.tareas);
    sheet.getRange(startRow, 1).setValue(`📁 ${proyecto.nombre} (${proyectoKey})`).setFontWeight('bold').setFontSize(12);
    startRow++;
    sheet.getRange(startRow, 2).setValue(`📊 ${stats.total} tareas • ${Math.round(stats.puntuacionPromedio*10)/10} puntos promedio`).setFontSize(10);
    startRow++;
    sheet.getRange(startRow, 2).setValue(`📎 ${stats.totalArchivos} archivos • 🔗 ${stats.totalEnlaces} enlaces • 🔀 ${stats.totalPRs} PRs`).setFontSize(10).setFontColor("#666666");
    startRow += 2;
  });
  return startRow;
}

/**
 * ✅ Escribe la tabla con el detalle de todas las tareas del usuario.
 */
function escribirDetalleTareasIndividual(sheet, tareas, startRow) {
  sheet.getRange(startRow, 1).setValue("📋 DETALLE DE TODAS LAS TAREAS:").setFontWeight('bold').setFontSize(14).setFontColor("#0052CC");
  startRow += 2;
  const headers = ["Clave", "Proyecto", "Tarea", "Estado", "Fecha", "📎 Archivos", "📷 Imgs", "🔗 Enlaces", "🔀 PRs", "🎯 Evidencia", "📊 Puntos"];
  sheet.getRange(startRow, 1, 1, headers.length).setValues([headers]).setFontWeight('bold').setBackground('#37474f').setFontColor('white');
  startRow++;
  const tareasOrdenadas = tareas.sort((a, b) => b.entregables.puntuacion - a.entregables.puntuacion);
  const datosTareas = tareasOrdenadas.map(tarea => {
    const e = tarea.entregables;
    const fechaStr = Utilities.formatDate(new Date(tarea.fields.created), Session.getScriptTimeZone(), "dd/MM/yyyy");
    return [tarea.key, tarea.fields.project.key, tarea.fields.summary.substring(0, 47) + (tarea.fields.summary.length > 50 ? "..." : ""), tarea.fields.status.name, fechaStr, e.archivos.length, e.imagenes.length, e.enlaces.length, e.pullRequests.length, `${e.calidad.emoji} ${e.calidad.texto}`, e.puntuacion];
  });
  const range = sheet.getRange(startRow, 1, datosTareas.length, headers.length);
  range.setValues(datosTareas).setBorder(true, true, true, true, true, true, "#cccccc", SpreadsheetApp.BorderStyle.SOLID);
  for (let i = 0; i < tareasOrdenadas.length; i++) {
    const tarea = tareasOrdenadas[i];
    const filaActual = startRow + i;
    sheet.getRange(filaActual, 10).setBackground(tarea.entregables.calidad.color);
    if (tarea.entregables.puntuacion >= 6) {
      sheet.getRange(filaActual, 1, 1, headers.length).setBackground("#f1f8e9");
    } else if (tarea.entregables.puntuacion === 0) {
      sheet.getRange(filaActual, 1, 1, headers.length).setBackground("#ffebee");
    }
  }
  return startRow + datosTareas.length;
}

/**
* ✅ Escribe un resumen de fortalezas y áreas de mejora.
*/
function escribirResumenMejoresPracticas(sheet, stats, startRow) {
  sheet.getRange(startRow, 1).setValue("💡 RESUMEN Y RECOMENDACIONES:").setFontWeight('bold').setFontSize(14).setFontColor("#0052CC");
  startRow += 2;
  const buenasPracticas = [];
  const areasDeMejora = [];
  if (stats.conArchivos / stats.totalTareas >= 0.7) buenasPracticas.push("✅ Excelente documentación con archivos adjuntos");
  if (stats.conPRs / stats.totalTareas >= 0.5) buenasPracticas.push("✅ Buena práctica de Pull Requests y código");
  if (stats.conImagenes / stats.totalTareas >= 0.3) buenasPracticas.push("✅ Buena evidencia visual con capturas de pantalla");
  if (stats.puntuacionPromedio >= 4) buenasPracticas.push("✅ Calidad general de evidencia por encima del promedio");
  if (stats.sinEvidencia / stats.totalTareas >= 0.3) areasDeMejora.push("📈 Mejorar documentación en tareas sin evidencia");
  if (stats.conPRs / stats.totalTareas < 0.2) areasDeMejora.push("📈 Incrementar referencias a código y Pull Requests");
  if (stats.conArchivos / stats.totalTareas < 0.4) areasDeMejora.push("📈 Adjuntar más archivos como evidencia de trabajo");
  if (stats.puntuacionPromedio < 2) areasDeMejora.push("📈 Mejorar calidad general de documentación de tareas");

  if (buenasPracticas.length > 0) {
    sheet.getRange(startRow, 1).setValue("🌟 FORTALEZAS IDENTIFICADAS:").setFontWeight('bold').setFontColor("#2e7d32");
    startRow++;
    buenasPracticas.forEach(practica => {
      sheet.getRange(startRow, 2).setValue(practica).setFontSize(10);
      startRow++;
    });
    startRow++;
  }
  if (areasDeMejora.length > 0) {
    sheet.getRange(startRow, 1).setValue("📈 OPORTUNIDADES DE MEJORA:").setFontWeight('bold').setFontColor("#c62828");
    startRow++;
    areasDeMejora.forEach(mejora => {
      sheet.getRange(startRow, 2).setValue(mejora).setFontSize(10);
      startRow++;
    });
  }
}

/**
 * ✅ Aplica formato a la hoja de cálculo del reporte individual.
 */
function aplicarFormatoReporteIndividual(sheet) {
  const lastRow = sheet.getLastRow();
  const lastCol = sheet.getLastColumn();
  sheet.autoResizeColumns(1, lastCol);
  if (lastCol >= 3) sheet.setColumnWidth(3, 300);
  if (lastCol >= 10) sheet.setColumnWidth(10, 150);
  if (lastCol >= 11) sheet.setColumnWidth(11, 80);

  const estados = CONSTANTES.COLORES_ESTADO;
  if (lastRow > 1) {
    const rangoEstados = sheet.getRange(1, 4, lastRow, 1);
    const rules = Object.keys(estados).map(estado => 
      SpreadsheetApp.newConditionalFormatRule().whenTextContains(estado).setBackground(estados[estado]).setRanges([rangoEstados]).build()
    );
    sheet.setConditionalFormatRules(rules);
  }
  const tableHeaderRow = 15; // Asumiendo que la tabla de detalle empieza en la fila 15
  if (lastRow > tableHeaderRow) {
    sheet.setFrozenRows(tableHeaderRow);
  }
}

/**
 * ✅ Escribe un mensaje en la hoja cuando no se encuentran tareas para el usuario.
 */
function escribirMensajeUsuarioSinTareas(sheet, nombreUsuario, periodo) {
  const periodoFormateado = periodo === 'ultimos_6_meses' ? 'los últimos 6 meses' : `el período ${periodo}`;
  sheet.getRange("A1").setValue(`👤 Reporte Individual para: ${nombreUsuario}`).setFontWeight("bold").setFontSize(14);
  sheet.getRange("A3").setValue(`No se encontraron tareas asignadas a este usuario en ${periodoFormateado}.`);
}
