// =====================================
// ARCHIVO 18: ESCRITURA DE REPORTE SIMPLE DE PROYECTOS
// =====================================

/**
 * Escribe el reporte simple de proyectos en la hoja de cálculo.
 * @param {Object[]} datosProyectos - La lista de proyectos con sus datos procesados.
 */
function escribirReporteSimple(datosProyectos) {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  const sheetName = CONFIG_SHEET_PROYECTOS_SIMPLES.sheetName;
  let sheet = spreadsheet.getSheetByName(sheetName);

  if (sheet) {
    sheet.clear();
  } else {
    sheet = spreadsheet.insertSheet(sheetName);
  }
  spreadsheet.setActiveSheet(sheet);

  // Escribir el encabezado
  const headers = CONFIG_SHEET_PROYECTOS_SIMPLES.headers;
  sheet.getRange(1, 1, 1, headers.length).setValues([headers])
    .setFontWeight("bold")
    .setBackground("#4a90e2")
    .setFontColor("#ffffff");

  // Preparar los datos para escribir
  const datosParaEscribir = datosProyectos.map(p => [
    p.id,
    p.clave,
    p.nombre,
    p.tipoProyecto,
    p.estilo,
    p.estado,
    p.avatarId,
    p.tiposDeIncidencia
  ]);

  // Escribir todos los datos de una vez
  if (datosParaEscribir.length > 0) {
    sheet.getRange(2, 1, datosParaEscribir.length, headers.length).setValues(datosParaEscribir);
  }

  // Ajustar formato
  sheet.autoResizeColumns(1, headers.length);
  sheet.setColumnWidth(3, 300); // Nombre Completo
  sheet.setColumnWidth(8, 300); // Tipos de Incidencia
  sheet.setFrozenRows(1);
  
  Logger.log(`✍️ Se escribió el reporte simple de proyectos en la hoja '${sheetName}'.`);
}
