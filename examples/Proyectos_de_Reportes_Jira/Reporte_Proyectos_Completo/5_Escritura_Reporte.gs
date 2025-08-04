// =====================================
// ARCHIVO 13: ESCRITURA DE REPORTE DE PROYECTOS
// =====================================

/**
 * Escribe el reporte completo de proyectos, épicas y tareas en la hoja de cálculo.
 * @param {Object[]} proyectosConDetalles - La lista de proyectos con sus datos procesados.
 */
function escribirReporteProyectosCompleto(proyectosConDetalles) {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  const sheetName = CONFIG_SHEET_PROYECTOS.sheetName;
  let sheet = spreadsheet.getSheetByName(sheetName);

  if (sheet) {
    sheet.clear();
  } else {
    sheet = spreadsheet.insertSheet(sheetName);
  }
  spreadsheet.setActiveSheet(sheet);

  let currentRow = 1;

  // Escribir un título general para el reporte
  sheet.getRange(currentRow, 1, 1, 6).merge()
    .setValue("📊 Reporte General de Proyectos, Épicas y Tareas")
    .setFontSize(18).setFontWeight("bold").setHorizontalAlignment("center").setVerticalAlignment("middle");
  currentRow += 2;

  // Iterar sobre cada proyecto y escribir su sección
  proyectosConDetalles.forEach(proyecto => {
    // Escribir el nombre del proyecto como un gran encabezado
    sheet.getRange(currentRow, 1, 1, 6).merge()
      .setValue(`📁 Proyecto: ${proyecto.nombre} (${proyecto.clave})`)
      .setFontSize(14).setFontWeight("bold").setBackground("#4a90e2").setFontColor("#ffffff");
    currentRow++;

    // Escribir la tabla de detalles del proyecto
    sheet.getRange(currentRow, 1, 1, CONFIG_SHEET_PROYECTOS.projectHeaders.length)
      .setValues([CONFIG_SHEET_PROYECTOS.projectHeaders])
      .setFontWeight("bold").setBackground("#dfe1e6");
    currentRow++;
    
    const projectDetails = [
      proyecto.id,
      proyecto.clave,
      proyecto.nombre,
      proyecto.tipoProyecto,
      proyecto.estilo,
      proyecto.tiposDeIncidencia
    ];
    sheet.getRange(currentRow, 1, 1, projectDetails.length).setValues([projectDetails]);
    currentRow += 2; // Espacio después de los detalles del proyecto

    // Escribir las épicas y sus tareas
    if (proyecto.epicas.length > 0) {
      proyecto.epicas.forEach(epica => {
        sheet.getRange(currentRow, 1, 1, 6).merge()
          .setValue(`⚡ ÉPICA: ${epica.titulo} (${epica.clave})`)
          .setFontWeight("bold").setBackground("#f4f5f7");
        currentRow++;
        
        if (epica.tareas.length > 0) {
          escribirTablaDeTareas(sheet, epica.tareas, currentRow);
          currentRow += epica.tareas.length + 1; // +1 para la cabecera
        } else {
          sheet.getRange(currentRow, 1).setValue("Esta épica no tiene tareas.").setFontStyle("italic");
          currentRow++;
        }
        currentRow++; // Espacio después de cada épica
      });
    }

    // Escribir tareas que no tienen épica
    if (proyecto.tareasSinEpica.length > 0) {
      sheet.getRange(currentRow, 1, 1, 6).merge()
        .setValue("📝 Tareas sin Épica Asignada")
        .setFontWeight("bold").setBackground("#fff0b3");
      currentRow++;
      escribirTablaDeTareas(sheet, proyecto.tareasSinEpica, currentRow);
      currentRow += proyecto.tareasSinEpica.length + 1;
    }
    
    currentRow += 2; // Espacio grande entre proyectos
  });

  ajustarFormatoGeneralProyectos(sheet);
  Logger.log("✍️ Se escribió el reporte de proyectos en la hoja.");
}

/**
 * Escribe una tabla de tareas en la hoja.
 * @param {Sheet} sheet - La hoja de cálculo.
 * @param {Object[]} tareas - La lista de tareas a escribir.
 * @param {number} startRow - La fila inicial para escribir la tabla.
 */
function escribirTablaDeTareas(sheet, tareas, startRow) {
  sheet.getRange(startRow, 1, 1, CONFIG_SHEET_PROYECTOS.taskHeaders.length)
    .setValues([CONFIG_SHEET_PROYECTOS.taskHeaders])
    .setFontWeight("bold").setBackground("#deebff");

  const datosTareas = tareas.map(t => [
    t.clave, t.titulo, t.estado, t.responsable, t.tiempoEstimado, t.etiquetas
  ]);
  
  sheet.getRange(startRow + 1, 1, datosTareas.length, datosTareas[0].length)
    .setValues(datosTareas)
    .setBorder(true, true, true, true, true, true, "#cccccc", SpreadsheetApp.BorderStyle.SOLID);
}

/**
 * Ajusta el formato final de la hoja de reporte de proyectos.
 * @param {Sheet} sheet - La hoja de cálculo a formatear.
 */
function ajustarFormatoGeneralProyectos(sheet) {
  sheet.autoResizeColumns(1, CONFIG_SHEET_PROYECTOS.taskHeaders.length);
  sheet.setColumnWidth(2, 300); // Ancho para Nombre Completo / Título Tarea
  sheet.setColumnWidth(3, 300); // Ancho para Nombre Completo / Título Tarea
  sheet.setColumnWidth(6, 200); // Ancho para Tipos de Incidencia / Etiquetas
  sheet.getRange("A:F").setVerticalAlignment("middle");
}
