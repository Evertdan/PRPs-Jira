// =====================================
// ARCHIVO 23: ESCRITURA DE REPORTE DE ACTIVIDADES
// =====================================

/**
 * Escribe el reporte de actividades de un proyecto en la hoja de cálculo.
 * @param {Object[]} datosProcesados - La lista de actividades formateadas.
 * @param {string} proyectoKey - La clave del proyecto para nombrar la hoja.
 */
function escribirReporteActividades(datosProcesados, proyectoKey) {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  const sheetName = `${CONFIG_SHEET_ACTIVIDADES.sheetNamePrefix}${proyectoKey}`;
  let sheet = spreadsheet.getSheetByName(sheetName);

  if (sheet) {
    sheet.clear();
  } else {
    sheet = spreadsheet.insertSheet(sheetName);
  }
  spreadsheet.setActiveSheet(sheet);

  // Escribir encabezado
  const headers = CONFIG_SHEET_ACTIVIDADES.headers;
  sheet.getRange(1, 1, 1, headers.length).setValues([headers])
    .setFontWeight("bold")
    .setBackground("#006644") // Verde oscuro para el encabezado
    .setFontColor("#ffffff");

  // Preparar datos para escribir
  const datosParaEscribir = datosProcesados.map(d => [
    d.llave,
    d.id,
    d.resumen,
    d.asignado,
    d.fechaLimite,
    d.estado,
    d.tiempoEstimado,
    d.sprint,
    d.etiquetas
  ]);

  // Escribir todos los datos
  if (datosParaEscribir.length > 0) {
    sheet.getRange(2, 1, datosParaEscribir.length, headers.length).setValues(datosParaEscribir);
  }

  // Ajustar formato
  sheet.autoResizeColumns(1, headers.length);
  sheet.setColumnWidth(3, 350); // Resumen
  sheet.setColumnWidth(8, 200); // Sprint
  sheet.setFrozenRows(1);
  
  Logger.log(`✍️ Se escribió el reporte de actividades para ${proyectoKey} en la hoja '${sheetName}'.`);
}
