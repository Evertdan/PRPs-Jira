// =====================================
// ARCHIVO 7: PRUEBAS Y VALIDACIÓN DEL SISTEMA DE WORKLOG
// =====================================

/**
 * ✅ Suite completa de pruebas para validar el sistema de worklog
 */
async function ejecutarSuitePruebasCompleta() {
  const ui = SpreadsheetApp.getUi();
  
  try {
    Logger.log('🧪 [PRUEBAS-WORKLOG] Iniciando suite completa de pruebas...');
    
    let resultados = {
      total: 0,
      exitosas: 0,
      fallidas: 0,
      advertencias: 0,
      detalles: []
    };
    
    await ejecutarPruebasWorklog(resultados);
    
    mostrarResultadosPruebas(resultados);
    
    Logger.log(`✅ [PRUEBAS-WORKLOG] Suite de pruebas completada: ${resultados.exitosas}/${resultados.total} exitosas`);
    
  } catch (error) {
    ErrorManagerSemanal.registrarError('Error ejecutando suite de pruebas de worklog', error, 'SUITE_PRUEBAS_WORKLOG', 'HIGH');
    ui.alert('Error en Pruebas', `❌ Error ejecutando suite de pruebas.\n\nError: ${error.message}`, ui.ButtonSet.OK);
  }
}

/**
 * ✅ Ejecuta pruebas del sistema de worklog
 * @param {Object} resultados - Objeto para acumular resultados
 */
async function ejecutarPruebasWorklog(resultados) {
  Logger.log('🚀 [PRUEBAS-WORKLOG] Ejecutando pruebas de worklog...');

  // Prueba 1: Construcción de JQL para worklog
  try {
    resultados.total++;
    const hoy = new Date();
    const hace7dias = new Date(hoy.getTime() - 7 * 24 * 60 * 60 * 1000);
    const opciones = { fechaInicio: hace7dias, fechaFin: hoy };
    const jql = construirJQLParaReportesWorklog(opciones);

    if (jql.includes('worklogDate >=') && jql.includes('worklogAuthor in')) {
      resultados.exitosas++;
      resultados.detalles.push('✅ JQL Worklog: Construcción correcta con worklogDate y worklogAuthor');
    } else {
      throw new Error('JQL no contiene los campos de worklog esperados.');
    }
  } catch (error) {
    resultados.fallidas++;
    resultados.detalles.push(`❌ JQL Worklog: ${error.message}`);
  }

  // Prueba 2: Obtención de registros de trabajo
  if (verificarCredencialesJiraSemanal()) {
    try {
      resultados.total++;
      const worklogs = await probarConsultaWorklog();
      if (Array.isArray(worklogs)) {
        resultados.exitosas++;
        resultados.detalles.push(`✅ Obtención de Worklogs: Se obtuvieron ${worklogs.length} registros.`);
      } else {
        throw new Error('La función de prueba de worklog no retornó un array.');
      }
    } catch (error) {
      resultados.fallidas++;
      resultados.detalles.push(`❌ Obtención de Worklogs: ${error.message}`);
    }
  }
}

/**
 * ✅ Muestra resultados detallados de las pruebas
 * @param {Object} resultados - Resultados de las pruebas
 */
function mostrarResultadosPruebas(resultados) {
  const ui = SpreadsheetApp.getUi();
  
  let mensaje = `🧪 RESULTADOS DE PRUEBAS - Sistema de Worklog v${SCRIPT_METADATA.version}\n\n`;
  
  mensaje += '📊 RESUMEN:\n';
  mensaje += `   • Total de pruebas: ${resultados.total}\n`;
  mensaje += `   • ✅ Exitosas: ${resultados.exitosas}\n`;
  mensaje += `   • ❌ Fallidas: ${resultados.fallidas}\n`;
  mensaje += `   • ⚠️  Advertencias: ${resultados.advertencias}\n\n`;
  
  const porcentajeExito = resultados.total > 0 ? Math.round((resultados.exitosas / resultados.total) * 100) : 0;
  let estadoGeneral = porcentajeExito >= 90 ? '🟢 EXCELENTE' : (porcentajeExito >= 75 ? '🟡 BUENO' : '🔴 CRÍTICO');
  
  mensaje += `🎯 ESTADO GENERAL: ${estadoGeneral} (${porcentajeExito}%)\n\n`;
  
  mensaje += '📋 DETALLES:\n';
  resultados.detalles.forEach(detalle => {
    mensaje += `${detalle}\n`;
  });
  
  ui.alert('Resultados de Pruebas del Sistema', mensaje, ui.ButtonSet.OK);
}