/**
 * @OnlyCurrentDoc
 */

// =====================================
// ARCHIVO 8: ORGANIZADOR DE REPORTES POR SEMANA
// =====================================

/**
 * ✅ Reorganiza el reporte de la hoja activa para agrupar por persona y por semana.
 */
function reorganizarReportePorSemanas() {
  const ui = SpreadsheetApp.getUi();
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    const data = sheet.getDataRange().getValues();

    if (data.length < 2) {
      ui.alert('No hay datos suficientes para reorganizar.');
      return;
    }

    ui.showModalDialog(
      HtmlService.createHtmlOutput('<p>📊 Reorganizando el reporte por semanas...</p>')
        .setWidth(400).setHeight(100),
      'Procesando...'
    );

    const { agrupado, ordenPersonas } = agruparDatosPorPersonaYSemana(data);
    escribirDatosAgrupados(sheet, agrupado, ordenPersonas, data[0]);

    ui.alert('✅ Reporte reorganizado exitosamente por semanas.');

  } catch (error) {
    Logger.log(`❌ Error reorganizando el reporte: ${error.message}`);
    ui.alert(`Ocurrió un error al reorganizar el reporte: ${error.message}`);
  }
}

/**
 * Agrupa los datos por persona y luego por semana.
 * @param {Array<Array<String>>} data - Los datos de la hoja.
 * @returns {Object} - Objeto con los datos agrupados y el orden de las personas.
 */
function agruparDatosPorPersonaYSemana(data) {
  const agrupado = {};
  const ordenPersonas = [];
  const semanaRegex = /SEMANA_([1-5])/;

  data.slice(1).forEach(row => {
    const persona = row[0];
    if (!persona) return; // Ignorar filas vacías

    const etiquetaSemana = row[9] ? (row[9].toString().match(semanaRegex) || [])[0] : null;
    if (!etiquetaSemana) return; // Ignorar filas sin etiqueta de semana

    if (!agrupado[persona]) {
      agrupado[persona] = {};
      ordenPersonas.push(persona);
    }
    if (!agrupado[persona][etiquetaSemana]) {
      agrupado[persona][etiquetaSemana] = {
        filas: [],
        totalTiempo: 0,
        totalEstimacion: 0
      };
    }

    const grupo = agrupado[persona][etiquetaSemana];
    grupo.filas.push(row);
    grupo.totalTiempo += parseFloat(row[5].toString().replace(',', '.')) || 0;
    grupo.totalEstimacion += parseFloat(row[6].toString().replace(',', '.')) || 0;
  });

  return { agrupado, ordenPersonas };
}

/**
 * Escribe los datos agrupados de nuevo en la hoja.
 * @param {Sheet} sheet - La hoja de cálculo.
 * @param {Object} agrupado - Los datos agrupados.
 * @param {Array<String>} ordenPersonas - El orden de las personas.
 * @param {Array<String>} header - La fila de encabezado.
 */
function escribirDatosAgrupados(sheet, agrupado, ordenPersonas, header) {
  sheet.clear();
  let filaActual = 1;

  ordenPersonas.forEach(persona => {
    const semanas = Object.keys(agrupado[persona]).sort();

    semanas.forEach(semana => {
      const grupo = agrupado[persona][semana];
      
      // Escribir encabezado para cada grupo
      sheet.getRange(filaActual, 1, 1, header.length).setValues([header]).setFontWeight('bold');
      filaActual++;

      // Escribir filas de datos
      const filasData = grupo.filas.map(r => r.slice(0, header.length));
      sheet.getRange(filaActual, 1, filasData.length, filasData[0].length).setValues(filasData);
      filaActual += filasData.length;

      // Escribir fila de totales
      const totalRow = new Array(header.length).fill('');
      totalRow[4] = `TOTAL ${semana}:`;
      totalRow[5] = grupo.totalTiempo.toFixed(2);
      totalRow[6] = grupo.totalEstimacion.toFixed(2);
      sheet.getRange(filaActual, 1, 1, header.length).setValues([totalRow]).setFontWeight('bold').setBackground('#e6e6e6');
      filaActual++;

      // Añadir espacio entre semanas
      filaActual++;
    });
  });

  FormateadorHoja.ajustarAnchoColumnas(sheet); // Reutiliza el formateador existente
}