// =====================================
// ARCHIVO 6: ESCRITURA Y FORMATO DE REPORTES
// =====================================

/**
* ✅ Escribe los datos de las tareas agrupadas por proyecto en la hoja de cálculo, incluyendo el análisis de entregables.
*/
function escribirDatosAgrupadosConEntregables(sheet, tareasAgrupadas, nombreGrupo, sprintsCoincidentes) {
  sheet.getRange("A1").setValue(`📊 Reporte con Análisis de Entregables: ${nombreGrupo}`).setFontSize(16).setFontWeight("bold").setFontColor("#0052CC");
  const sprintInfo = parseSprintForDisplay(nombreGrupo);
  const todasLasTareas = Object.values(tareasAgrupadas).flat();
  const totalTareas = todasLasTareas.length;
  const estadisticasEntregables = calcularEstadisticasEntregables(todasLasTareas);
  sheet.getRange("A2").setValue(`📅 ${sprintInfo} • ${sprintsCoincidentes.length} sprints • ${totalTareas} tareas`).setFontSize(12).setFontColor("#666666");
  sheet.getRange("A3").setValue(`📎 Entregables: ${estadisticasEntregables.conArchivos} con archivos • ${estadisticasEntregables.conImagenes} con imágenes • ${estadisticasEntregables.conPRs} con PRs`).setFontSize(10).setFontColor("#0066cc");
  const nombresSprintsOriginales = sprintsCoincidentes.map(s => s.name).join(', ');
  sheet.getRange("A4").setValue(`🎯 Sprints: ${nombresSprintsOriginales}`).setFontSize(9).setFontColor("#666666").setWrap(true);

  let currentRow = 6;
  const proyectosOrdenados = Object.keys(tareasAgrupadas).sort();

  for (const proyecto of proyectosOrdenados) {
    const tareasDelProyecto = tareasAgrupadas[proyecto];
    const totalTareasProyecto = tareasDelProyecto.length;
    const tareasCerradas = tareasDelProyecto.filter(t => ['Done', 'Listo', 'Cerrado', 'Completado'].includes(t.fields.status.name)).length;
    const tareasConEntregables = tareasDelProyecto.filter(t => t.entregables && t.entregables.puntuacion > 0).length;
    const porcentajeCompletitud = Math.round((tareasCerradas / totalTareasProyecto) * 100);
    const porcentajeConEntregables = Math.round((tareasConEntregables / totalTareasProyecto) * 100);

    sheet.getRange(currentRow, 1, 1, 7).merge().setValue(`📁 ${proyecto} (${totalTareasProyecto} tareas • ${porcentajeCompletitud}% completadas • ${porcentajeConEntregables}% con entregables)`).setFontWeight('bold').setBackground('#F4F5F7').setHorizontalAlignment('center');
    currentRow++;

    const headers = ["Clave", "Tarea", "Responsable", "Estado", "📎 Archivos", "🔗 Enlaces", "🎯 Evidencia"];
    sheet.getRange(currentRow, 1, 1, 7).setValues([headers]).setFontWeight('bold').setBackground('#DFE1E6');
    currentRow++;

    const datosTareas = tareasDelProyecto.map(tarea => {
      const entregables = tarea.entregables;
      let infoArchivos = entregables.archivos.length > 0 ? `${entregables.archivos.length} (${entregables.imagenes.length} img)` : "Sin archivos";
      let infoEnlaces = (entregables.enlaces.length + entregables.pullRequests.length) > 0 ? `${entregables.enlaces.length + entregables.pullRequests.length} (${entregables.pullRequests.length} PR)` : "Sin enlaces";
      const estadoEvidencia = `${entregables.calidad.emoji} ${entregables.calidad.texto}`;
      return [tarea.key, tarea.fields.summary.substring(0, 57) + (tarea.fields.summary.length > 60 ? "..." : ""), tarea.fields.assignee ? tarea.fields.assignee.displayName : "Sin asignar", tarea.fields.status.name, infoArchivos, infoEnlaces, estadoEvidencia];
    });

    const range = sheet.getRange(currentRow, 1, datosTareas.length, 7);
    range.setValues(datosTareas).setBorder(true, true, true, true, true, true, "#cccccc", SpreadsheetApp.BorderStyle.SOLID);

    for (let i = 0; i < tareasDelProyecto.length; i++) {
      const tarea = tareasDelProyecto[i];
      const filaActual = currentRow + i;
      sheet.getRange(filaActual, 7).setBackground(tarea.entregables.calidad.color);
      if (tarea.entregables.puntuacion === 0) {
        sheet.getRange(filaActual, 1, 1, 7).setBackground("#ffebee");
      } else if (tarea.entregables.puntuacion >= 4) {
        sheet.getRange(filaActual, 1, 1, 7).setBackground("#f1f8e9");
      }
    }
    currentRow += datosTareas.length + 1;
    currentRow = escribirResumenEntregablesProyecto(sheet, currentRow, proyecto, tareasDelProyecto);
  }
  currentRow += 2;
  escribirEstadisticasGlobalesEntregables(sheet, currentRow, estadisticasEntregables, todasLasTareas);
}

/**
* ✅ Escribe un resumen de los entregables para un proyecto específico.
*/
function escribirResumenEntregablesProyecto(sheet, currentRow, proyecto, tareas) {
  const stats = calcularEstadisticasEntregables(tareas);
  sheet.getRange(currentRow, 2).setValue(`📊 Resumen de entregables para ${proyecto}:`).setFontWeight('bold').setFontSize(10);
  currentRow++;
  const resumenTexto = [
    `📎 ${stats.totalArchivos} archivos en ${stats.conArchivos} tareas`,
    `📷 ${stats.totalImagenes} imágenes en ${stats.conImagenes} tareas`,
    `🔗 ${stats.totalEnlaces} enlaces en ${stats.conEnlaces} tareas`,
    `🔀 ${stats.totalPRs} pull requests en ${stats.conPRs} tareas`,
    `⭐ Puntuación promedio: ${stats.puntuacionPromedio}/10`
  ];
  resumenTexto.forEach(texto => {
    sheet.getRange(currentRow, 3).setValue(texto).setFontSize(9).setFontColor("#666666");
    currentRow++;
  });
  return currentRow + 1;
}

/**
* ✅ Escribe las estadísticas globales de entregables en el pie del reporte.
*/
function escribirEstadisticasGlobalesEntregables(sheet, currentRow, stats, tareas) {
  sheet.getRange(currentRow, 1).setValue("📊 ESTADÍSTICAS GLOBALES DE ENTREGABLES:").setFontWeight('bold').setFontSize(12).setFontColor("#0052CC");
  currentRow += 2;
  const estadisticas = [
    [`📋 Total de tareas analizadas:`, stats.total],
    [`📎 Tareas con archivos:`, `${stats.conArchivos} (${Math.round(stats.conArchivos/stats.total*100)}%)`],
    [`📷 Tareas con imágenes:`, `${stats.conImagenes} (${Math.round(stats.conImagenes/stats.total*100)}%)`],
    [`🔗 Tareas con enlaces:`, `${stats.conEnlaces} (${Math.round(stats.conEnlaces/stats.total*100)}%)`],
    [`🔀 Tareas con Pull Requests:`, `${stats.conPRs} (${Math.round(stats.conPRs/stats.total*100)}%)`],
    [`🚫 Tareas sin evidencia:`, `${stats.sinEvidencia} (${Math.round(stats.sinEvidencia/stats.total*100)}%)`],
    [`⭐ Tareas con evidencia completa:`, `${stats.evidenciaCompleta} (${Math.round(stats.evidenciaCompleta/stats.total*100)}%)`],
    [`📊 Puntuación promedio:`, `${stats.puntuacionPromedio}/10`]
  ];
  estadisticas.forEach(([etiqueta, valor]) => {
    sheet.getRange(currentRow, 1).setValue(etiqueta).setFontWeight('bold').setFontSize(10);
    sheet.getRange(currentRow, 3).setValue(valor).setFontSize(10);
    currentRow++;
  });
  currentRow += 1;
  sheet.getRange(currentRow, 1).setValue(`📊 Generado: ${new Date().toLocaleString()} • Análisis de entregables v7.0`).setFontSize(8).setFontColor("#999999");
}

/**
* ✅ Aplica formato a la hoja de cálculo del reporte de sprint.
*/
function aplicarFormatoReporteSprintConEntregables(sheet) {
  const lastRow = sheet.getLastRow();
  const lastCol = sheet.getLastColumn();
  sheet.autoResizeColumns(1, lastCol);
  if (lastCol >= 2) sheet.setColumnWidth(2, 250);
  if (lastCol >= 5) sheet.setColumnWidth(5, 100);
  if (lastCol >= 6) sheet.setColumnWidth(6, 100);
  if (lastCol >= 7) sheet.setColumnWidth(7, 150);

  const estados = CONSTANTES.COLORES_ESTADO;
  if (lastRow > 1) {
    const rangoEstados = sheet.getRange(1, 4, lastRow, 1);
    const rules = Object.keys(estados).map(estado => 
      SpreadsheetApp.newConditionalFormatRule().whenTextContains(estado).setBackground(estados[estado]).setRanges([rangoEstados]).build()
    );
    sheet.setConditionalFormatRules(rules);
  }
  sheet.setFrozenRows(4);
}
