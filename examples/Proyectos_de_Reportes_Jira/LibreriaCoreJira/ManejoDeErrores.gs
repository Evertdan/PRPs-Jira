// =====================================
// ARCHIVO 3: MANEJO DE ERRORES
// =====================================

/**
 * Registra un error en una hoja de cálculo dedicada para facilitar la depuración.
 * @param {Error} error - El objeto del error capturado.
 * @param {string} nombreFuncion - El nombre de la función donde ocurrió el error.
 */
function registrarError(error, nombreFuncion) {
  try {
    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    const sheetName = 'Logs de Errores';
    let sheet = spreadsheet.getSheetByName(sheetName);
    if (!sheet) {
      sheet = spreadsheet.insertSheet(sheetName);
      sheet.getRange('A1:E1').setValues([['Timestamp', 'Usuario', 'Función', 'Mensaje de Error', 'Stack Trace']]).setFontWeight('bold');
      sheet.setColumnWidth(5, 400);
    }

    sheet.appendRow([
      new Date(),
      Session.getActiveUser().getEmail(),
      nombreFuncion,
      error.message,
      error.stack
    ]);

    const ui = SpreadsheetApp.getUi();
    ui.alert('Ocurrió un Error', `Se ha producido un error en la función '${nombreFuncion}'. Se ha registrado el detalle en la hoja 'Logs de Errores' para su revisión.`, ui.ButtonSet.OK);

  } catch (e) {
    // Si falla el registro de errores, lo muestra en el log para no entrar en un bucle infinito.
    Logger.log(`FALLO CRÍTICO EN EL REGISTRO DE ERRORES: ${e.message}`);
    Logger.log(`Error original en ${nombreFuncion}: ${error.message}`);
  }
}
