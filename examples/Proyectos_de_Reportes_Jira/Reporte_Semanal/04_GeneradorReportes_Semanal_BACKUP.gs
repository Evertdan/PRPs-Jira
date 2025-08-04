// =====================================
// ARCHIVO 4: GENERADOR DE REPORTES SEMANALES OPTIMIZADO
// =====================================

/**
 * ✅ Genera reporte semanal completo con análisis por etiquetas SEMANA_X
 * @param {Object} opciones - Opciones de generación del reporte
 * @returns {boolean} true si se generó exitosamente
 */
async function generarReporteSemanalCompleto(opciones = {}) {
  const ui = SpreadsheetApp.getUi();
  
  try {
    Logger.log(' [SEMANAL] Iniciando generación de reporte semanal completo...');
    
    // ✅ Verificar configuración
    if (!verificarCredencialesJiraSemanal()) {
      ui.alert(
        'Configuración Requerida',
        '❌ Las credenciales no están configuradas.\n\n' +
        'Ve al menú " Reportes Semanales" → " Configurar Credenciales"',
        ui.ButtonSet.OK
      );
      return false;
    }
    
    // ✅ Mostrar progreso
    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = spreadsheet.getActiveSheet();
    
    ui.showModalDialog(
      HtmlService.createHtmlOutput('<p> Generando reporte semanal...</p><p>Obteniendo datos de Jira...</p>')
        .setWidth(400).setHeight(100),
      'Generando Reporte'
    );
    
    // ✅ CORRECCIÓN VALIDADA: await ya está presente, pero agregar validaciones robustas
    const issues = await obtenerIssuesSemanalesDeJira(opciones);
    
    // ✅ VALIDACIÓN ROBUSTA MEJORADA
    if (!issues) {
      throw new Error('obtenerIssuesSemanalesDeJira retornó null o undefined');
    }
    
    if (!Array.isArray(issues)) {
      throw new Error(`Se esperaba un array de issues, pero se recibió: ${typeof issues}. Valor: ${JSON.stringify(issues).substring(0, 200)}...`);
    }
    
    if (opciones.debug) {
      Logger.log(`[DEBUG] Issues recibidos en generador: ${issues.length} issues`);
      if (issues.length > 0) {
        Logger.log(`[DEBUG] Primer issue keys: ${issues.slice(0, 3).map(i => i.key).join(', ')}`);
        Logger.log(`[DEBUG] Primer issue tiene analisisSemanal: ${!!issues[0].analisisSemanal}`);
      }
    }
    
    if (issues.length === 0) {
      ui.alert(
        'Sin Datos',
        '⚠️ No se encontraron issues con etiquetas semanales.\n\n' +
        ' Asegúrate de que tus issues tengan etiquetas como:\n' +
        '• SEMANA_1\n• SEMANA_2\n• SEMANA_3\n• etc.',
        ui.ButtonSet.OK
      );
      return false;
    }
    
    // ✅ NUEVO: Clasificar issues por PERSONA PRIMERO, luego por semana
    const issuesPorPersona = clasificarIssuesPorPersonaYSemana(issues);
    
    // ✅ VALIDACIÓN: Verificar que la clasificación funcionó
    if (!issuesPorPersona || typeof issuesPorPersona !== 'object') {
      throw new Error('La clasificación de issues por persona falló');
    }
    
    const personasEncontradas = Object.keys(issuesPorPersona).length;
    if (personasEncontradas === 0) {
      ui.alert(
        'Sin Personas Válidas',
        '⚠️ No se pudieron clasificar issues por personas.\n\n' +
        'Esto puede ocurrir si:\n' +
        '• Los issues no tienen personas asignadas\n' +
        '• Las etiquetas no siguen el formato SEMANA_X\n' +
        '• Los issues no tienen etiquetas semanales válidas',
        ui.ButtonSet.OK
      );
      return false;
    }
    
    // ✅ NUEVO: Generar reporte con agrupación por personas
    const exito = escribirReporteAgrupadoPorPersonas(sheet, issuesPorPersona, opciones);
    
    if (exito) {
      // ✅ Calcular estadísticas para el mensaje
      const totalSemanas = new Set();
      Object.values(issuesPorPersona).forEach(persona => {
        Object.keys(persona.semanas).forEach(semana => totalSemanas.add(semana));
      });
      
      ui.alert(
        'Reporte Generado',
        `✅ Reporte con agrupación por personas generado exitosamente!\n\n` +
        `👥 Total de personas: ${personasEncontradas}\n` +
        `📊 Total de issues: ${issues.length}\n` +
        `📅 Semanas encontradas: ${totalSemanas.size}\n` +
        `🕐 Generado: ${new Date().toLocaleString()}`,
        ui.ButtonSet.OK
      );
      
      Logger.log('✅ [SEMANAL] Reporte semanal generado exitosamente');
      return true;
    } else {
      throw new Error('La escritura del reporte en la hoja falló');
    }
    
  } catch (error) {
    const errorId = ErrorManagerSemanal.registrarError(
      'Error generando reporte semanal completo',
      error,
      'GENERADOR_REPORTES',
      'CRITICAL'
    );
    
    Logger.log(`❌ [SEMANAL] Error generando reporte: ${error.message}`);
    ui.alert(
      'Error en Reporte',
      `❌ No se pudo generar el reporte semanal.\n\n` +
      ` Error: ${error.message}\n` +
      ` Error ID: ${errorId}\n\n` +
      ` Revisa los logs para más detalles.`,
      ui.ButtonSet.OK
    );
    
    return false;
  }
}

/**
 * ✅ NUEVA: Clasifica issues por PERSONA PRIMERO, luego por semana
 * Esta es la función principal que implementa la agrupación estricta por personas
 * @param {Object[]} issues - Array de issues procesados
 * @returns {Object} Issues organizados por persona -> semana
 */
function clasificarIssuesPorPersonaYSemana(issues) {
  Logger.log(`👥 [AGRUPACION] Clasificando ${issues.length} issues por persona y semana...`);
  
  const issuesPorPersona = {};
  const estadisticas = {
    totalPersonas: 0,
    totalSemanas: new Set(),
    conEtiquetaSemanal: 0,
    sinEtiquetaSemanal: 0
  };
  
  issues.forEach(issue => {
    const analisis = issue.analisisSemanal;
    const nombrePersona = analisis.asignadoNombre || 'Sin asignar';
    
    // ✅ CRÍTICO: Obtener la primera etiqueta semanal válida (prioridad numérica)
    const etiquetaSemanaActual = obtenerPrimeraEtiquetaSemanal(issue);
    
    if (etiquetaSemanaActual) {
      estadisticas.conEtiquetaSemanal++;
      estadisticas.totalSemanas.add(etiquetaSemanaActual);
      
      // ✅ Crear estructura de persona si no existe
      if (!issuesPorPersona[nombrePersona]) {
        issuesPorPersona[nombrePersona] = {
          nombreCompleto: nombrePersona,
          semanas: {},
          totales: {
            tiempoTrabajadoSegundos: 0,
            tiempoEstimadoSegundos: 0,
            totalIssues: 0,
            semanasActivas: new Set(),
            proyectos: new Set()
          }
        };
        estadisticas.totalPersonas++;
      }
      
      // ✅ Crear estructura de semana dentro de persona si no existe
      if (!issuesPorPersona[nombrePersona].semanas[etiquetaSemanaActual]) {
        issuesPorPersona[nombrePersona].semanas[etiquetaSemanaActual] = {
          etiqueta: etiquetaSemanaActual,
          issues: [],
          totales: {
            tiempoTrabajadoSegundos: 0,
            tiempoEstimadoSegundos: 0,
            totalIssues: 0,
            completados: 0,
            enProgreso: 0,
            pendientes: 0
          }
        };
      }
      
      // ✅ Obtener tiempos originales en segundos
      const tiempoTrabajadoSegundos = issue.fields.timetracking?.timeSpentSeconds || 0;
      const tiempoEstimadoSegundos = issue.fields.timetracking?.originalEstimateSeconds || 0;
      
      // ✅ Agregar issue a la semana de la persona
      issuesPorPersona[nombrePersona].semanas[etiquetaSemanaActual].issues.push(issue);
      
      // ✅ Actualizar totales de la semana
      const totalesSemana = issuesPorPersona[nombrePersona].semanas[etiquetaSemanaActual].totales;
      totalesSemana.tiempoTrabajadoSegundos += tiempoTrabajadoSegundos;
      totalesSemana.tiempoEstimadoSegundos += tiempoEstimadoSegundos;
      totalesSemana.totalIssues++;
      
      if (analisis.esCompletado) totalesSemana.completados++;
      if (analisis.esEnProgreso) totalesSemana.enProgreso++;
      if (analisis.esPendiente) totalesSemana.pendientes++;
      
      // ✅ Actualizar totales de la persona
      const totalesPersona = issuesPorPersona[nombrePersona].totales;
      totalesPersona.tiempoTrabajadoSegundos += tiempoTrabajadoSegundos;
      totalesPersona.tiempoEstimadoSegundos += tiempoEstimadoSegundos;
      totalesPersona.totalIssues++;
      totalesPersona.semanasActivas.add(etiquetaSemanaActual);
      totalesPersona.proyectos.add(analisis.proyectoKey);
      
    } else {
      estadisticas.sinEtiquetaSemanal++;
    }
  });
  
  // ✅ Convertir Sets a arrays para facilitar el uso
  Object.keys(issuesPorPersona).forEach(nombrePersona => {
    const persona = issuesPorPersona[nombrePersona];
    persona.totales.semanasActivas = Array.from(persona.totales.semanasActivas);
    persona.totales.proyectos = Array.from(persona.totales.proyectos);
  });
  
  Logger.log(`✅ [AGRUPACION] Clasificación por persona completada:`);
  Logger.log(`   • Total personas: ${estadisticas.totalPersonas}`);
  Logger.log(`   • Issues con etiqueta semanal: ${estadisticas.conEtiquetaSemanal}`);
  Logger.log(`   • Issues sin etiqueta semanal: ${estadisticas.sinEtiquetaSemanal}`);
  Logger.log(`   • Semanas detectadas: ${estadisticas.totalSemanas.size} (${Array.from(estadisticas.totalSemanas).sort().join(', ')})`);
  
  return issuesPorPersona;
}

/**
 * ✅ NUEVA: Obtiene la primera etiqueta semanal válida (prioridad numérica)
 * Implementa la regla: Si un issue tiene múltiples etiquetas, usar SOLO la primera en orden numérico
 * @param {Object} issue - Issue de Jira
 * @returns {string|null} Primera etiqueta semanal encontrada o null
 */
function obtenerPrimeraEtiquetaSemanal(issue) {
  if (!issue.fields.labels || !Array.isArray(issue.fields.labels)) {
    return null;
  }
  
  // ✅ Obtener todas las etiquetas semanales válidas
  const etiquetasSemanales = issue.fields.labels
    .map(label => typeof label === 'string' ? label : (label.name || ''))
    .filter(labelName => labelName.match(/^SEMANA_[1-6]$/))
    .sort(); // Ordenamiento alfabético = ordenamiento numérico para SEMANA_X
  
  // ✅ Retornar la primera (menor número) o null si no hay ninguna
  return etiquetasSemanales.length > 0 ? etiquetasSemanales[0] : null;
}

/**
 * ✅ COMPATIBILIDAD: Mantener función original para reportes legacy
 * @deprecated Usar clasificarIssuesPorPersonaYSemana en su lugar
 */
function clasificarIssuesPorSemana(issues) {
  // Para compatibilidad, convertir la nueva estructura a la antigua
  const issuesPorPersona = clasificarIssuesPorPersonaYSemana(issues);
  const issuesPorSemana = {};
  
  // Convertir estructura persona->semana a semana->issues
  Object.values(issuesPorPersona).forEach(persona => {
    Object.entries(persona.semanas).forEach(([etiquetaSemana, datosSeamana]) => {
      if (!issuesPorSemana[etiquetaSemana]) {
        issuesPorSemana[etiquetaSemana] = {
          issues: [],
          estadisticas: {
            total: 0,
            completados: 0,
            enProgreso: 0,
            pendientes: 0,
            vencidos: 0,
            conStoryPoints: 0,
            tiempoEstimadoTotal: 0,
            tiempoTrabajadoTotal: 0,
            proyectos: new Set(),
            asignados: new Set()
          }
        };
      }
      
      issuesPorSemana[etiquetaSemana].issues.push(...datosSeamana.issues);
      const stats = issuesPorSemana[etiquetaSemana].estadisticas;
      stats.total += datosSeamana.totales.totalIssues;
      stats.completados += datosSeamana.totales.completados;
      stats.enProgreso += datosSeamana.totales.enProgreso;
      stats.pendientes += datosSeamana.totales.pendientes;
      stats.tiempoEstimadoTotal += datosSeamana.totales.tiempoEstimadoSegundos / 3600;
      stats.tiempoTrabajadoTotal += datosSeamana.totales.tiempoTrabajadoSegundos / 3600;
    });
  });
  
  return issuesPorSemana;
}

/**
 * ✅ Escribe el reporte semanal en la hoja de Google Sheets
 * @param {Sheet} sheet - Hoja de Google Sheets
 * @param {Object} issuesPorSemana - Issues clasificados por semana
 * @param {Object} opciones - Opciones de formato
 * @returns {boolean} true si se escribió exitosamente
 */
function escribirReporteSemanalEnHoja(sheet, issuesPorSemana, opciones = {}) {
  try {
    Logger.log('📝 [SEMANAL] Escribiendo reporte en hoja de Google Sheets...');
    
    // ✅ Limpiar hoja
    sheet.clear();
    let filaActual = 1;
    
    // ✅ Crear encabezado principal
    filaActual = crearEncabezadoPrincipalSemanal(sheet, filaActual, issuesPorSemana);
    
    // ✅ Crear resumen ejecutivo
    filaActual = crearResumenEjecutivoSemanal(sheet, filaActual, issuesPorSemana);
    
    // ✅ Crear detalle por semana
    filaActual = crearDetallePorSemana(sheet, filaActual, issuesPorSemana);
    
    // ✅ Aplicar formato general
    aplicarFormatoGeneralSemanal(sheet);
    
    Logger.log('✅ [SEMANAL] Reporte escrito exitosamente en la hoja');
    return true;
    
  } catch (error) {
    ErrorManagerSemanal.registrarError(
      'Error escribiendo reporte en hoja',
      error,
      'ESCRITURA_REPORTE',
      'HIGH'
    );
    
    Logger.log(`❌ [SEMANAL] Error escribiendo reporte: ${error.message}`);
    return false;
  }
}

/**
 * ✅ Crea el encabezado principal del reporte semanal
 * @param {Sheet} sheet - Hoja de Google Sheets
 * @param {number} fila - Fila inicial
 * @param {Object} issuesPorSemana - Datos del reporte
 * @returns {number} Siguiente fila disponible
 */
function crearEncabezadoPrincipalSemanal(sheet, fila, issuesPorSemana) {
  const totalSemanas = Object.keys(issuesPorSemana).length;
  const totalIssues = Object.values(issuesPorSemana).reduce((sum, semana) => sum + semana.estadisticas.total, 0);
  const fechaGeneracion = new Date().toLocaleString();
  
  // ✅ Título principal
  sheet.getRange(fila, 1, 1, 8).merge();
  sheet.getRange(fila, 1)
    .setValue(`📊 REPORTE SEMANAL DE ACTIVIDADES JIRA`)
    .setFontSize(18)
    .setFontWeight('bold')
    .setBackground(CONFIG_SEMANAL.colores.headerPrincipal)
    .setFontColor('white')
    .setHorizontalAlignment('center')
    .setVerticalAlignment('middle');
  
  sheet.setRowHeight(fila, 40);
  fila++;
  
  // ✅ Información del reporte
  sheet.getRange(fila, 1, 1, 8).merge();
  sheet.getRange(fila, 1)
    .setValue(`📅 Generado: ${fechaGeneracion} | 📊 ${totalSemanas} semanas | 📋 ${totalIssues} issues`)
    .setFontSize(11)
    .setBackground(CONFIG_SEMANAL.colores.headerSecundario)
    .setFontColor('white')
    .setHorizontalAlignment('center');
  
  fila += 2;
  
  return fila;
}

/**
 * ✅ Crea el resumen ejecutivo del reporte semanal
 * @param {Sheet} sheet - Hoja de Google Sheets
 * @param {number} fila - Fila inicial
 * @param {Object} issuesPorSemana - Datos del reporte
 * @returns {number} Siguiente fila disponible
 */
function crearResumenEjecutivoSemanal(sheet, fila, issuesPorSemana) {
  // ✅ Título de sección
  sheet.getRange(fila, 1, 1, 8).merge();
  sheet.getRange(fila, 1)
    .setValue('📈 RESUMEN EJECUTIVO')
    .setFontSize(14)
    .setFontWeight('bold')
    .setBackground(CONFIG_SEMANAL.colores.headerSecundario)
    .setFontColor('white')
    .setHorizontalAlignment('center');
  
  fila += 2;
  
  // ✅ Calcular estadísticas generales
  let totalIssues = 0;
  let totalCompletados = 0;
  let totalEnProgreso = 0;
  let totalPendientes = 0;
  let totalVencidos = 0;
  let totalTiempoEstimado = 0;
  let totalTiempoTrabajado = 0;
  const todosLosProyectos = new Set();
  const todosLosAsignados = new Set();
  
  Object.values(issuesPorSemana).forEach(semana => {
    const stats = semana.estadisticas;
    totalIssues += stats.total;
    totalCompletados += stats.completados;
    totalEnProgreso += stats.enProgreso;
    totalPendientes += stats.pendientes;
    totalVencidos += stats.vencidos;
    totalTiempoEstimado += stats.tiempoEstimadoTotal;
    totalTiempoTrabajado += stats.tiempoTrabajadoTotal;
    stats.proyectos.forEach(p => todosLosProyectos.add(p));
    stats.asignados.forEach(a => todosLosAsignados.add(a));
  });
  
  const porcentajeCompletadoGeneral = totalIssues > 0 ? Math.round((totalCompletados / totalIssues) * 100) : 0;
  const eficienciaGeneral = totalTiempoEstimado > 0 ? Math.round((totalTiempoTrabajado / totalTiempoEstimado) * 100) : 0;
  
  // ✅ Headers del resumen
  const headers = ['Métrica', 'Valor', 'Porcentaje', 'Estado'];
  const headerRange = sheet.getRange(fila, 1, 1, 4);
  headerRange.setValues([headers]);
  headerRange.setFontWeight('bold');
  headerRange.setBackground(CONFIG_SEMANAL.colores.filaAlternada2);
  fila++;
  
  // ✅ Datos del resumen
  const datosResumen = [
    ['📋 Total de Issues', totalIssues, '100%', '📊'],
    ['✅ Completados', totalCompletados, `${porcentajeCompletadoGeneral}%`, porcentajeCompletadoGeneral >= 70 ? '🟢' : porcentajeCompletadoGeneral >= 40 ? '🟡' : '🔴'],
    ['🔄 En Progreso', totalEnProgreso, `${Math.round((totalEnProgreso / totalIssues) * 100)}%`, '🔵'],
    ['⏳ Pendientes', totalPendientes, `${Math.round((totalPendientes / totalIssues) * 100)}%`, '⚪'],
    ['⚠️ Vencidos', totalVencidos, `${Math.round((totalVencidos / totalIssues) * 100)}%`, totalVencidos > 0 ? '🔴' : '🟢'],
    ['⏱️ Eficiencia Tiempo', `${eficienciaGeneral}%`, '', eficienciaGeneral >= 90 ? '🟢' : eficienciaGeneral >= 70 ? '🟡' : '🔴'],
    ['📁 Proyectos Activos', todosLosProyectos.size, '', '📊'],
    ['👥 Personas Asignadas', todosLosAsignados.size, '', '👤']
  ];
  
  const resumenRange = sheet.getRange(fila, 1, datosResumen.length, 4);
  resumenRange.setValues(datosResumen);
  
  // ✅ Formato alternado
  for (let i = 0; i < datosResumen.length; i++) {
    const rowRange = sheet.getRange(fila + i, 1, 1, 4);
    rowRange.setBackground(i % 2 === 0 ? CONFIG_SEMANAL.colores.filaAlternada1 : 'white');
  }
  
  fila += datosResumen.length + 2;
  
  return fila;
}

/**
 * ✅ Crea el detalle por semana
 * @param {Sheet} sheet - Hoja de Google Sheets
 * @param {number} fila - Fila inicial
 * @param {Object} issuesPorSemana - Datos del reporte
 * @returns {number} Siguiente fila disponible
 */
function crearDetallePorSemana(sheet, fila, issuesPorSemana) {
  // ✅ Ordenar semanas por número
  const semanasOrdenadas = Object.keys(issuesPorSemana).sort((a, b) => {
    const numA = CONFIG_SEMANAL.obtenerNumeroSemana(a);
    const numB = CONFIG_SEMANAL.obtenerNumeroSemana(b);
    return numA - numB;
  });
  
  semanasOrdenadas.forEach(etiquetaSemana => {
    const datosSemanaSemana = issuesPorSemana[etiquetaSemana];
    const stats = datosSemanaSemana.estadisticas;
    
    // ✅ Título de la semana
    sheet.getRange(fila, 1, 1, 8).merge();
    sheet.getRange(fila, 1)
      .setValue(`📅 ${etiquetaSemana} - ${stats.total} Issues (${stats.porcentajeCompletado}% Completado)`)
      .setFontSize(13)
      .setFontWeight('bold')
      .setBackground(CONFIG_SEMANAL.colores.semanaActiva)
      .setFontColor('white')
      .setHorizontalAlignment('center');
    
    fila += 2;
    
    // ✅ Headers de la tabla de issues
    const headersIssues = ['Key', 'Resumen', 'Estado', 'Asignado', 'Prioridad', 'Tiempo Est.', 'Tiempo Real', 'Proyecto'];
    const headerRangeIssues = sheet.getRange(fila, 1, 1, 8);
    headerRangeIssues.setValues([headersIssues]);
    headerRangeIssues.setFontWeight('bold');
    headerRangeIssues.setBackground(CONFIG_SEMANAL.colores.filaAlternada2);
    fila++;
    
    // ✅ Datos de los issues
    const datosIssues = datosSemanaSemana.issues.map(issue => {
      const analisis = issue.analisisSemanal;
      return [
        issue.key,
        (issue.fields.summary ? issue.fields.summary.substring(0, 50) : ''),
        analisis.estadoActual,
        analisis.asignadoNombre,
        analisis.prioridad,
        `${analisis.tiempoEstimadoHoras}h`,
        `${analisis.tiempoTrabajadoHoras}h`,
        analisis.proyectoKey
      ];
    });
    
    if (datosIssues.length > 0) {
      const issuesRange = sheet.getRange(fila, 1, datosIssues.length, 8);
      issuesRange.setValues(datosIssues);
      
      // ✅ Formato alternado para issues
      for (let i = 0; i < datosIssues.length; i++) {
        const rowRange = sheet.getRange(fila + i, 1, 1, 8);
        rowRange.setBackground(i % 2 === 0 ? CONFIG_SEMANAL.colores.filaAlternada1 : 'white');
        
        // ✅ Colores según estado
        const estadoColor = getColorPorEstado(datosSemanaSemana.issues[i].analisisSemanal.estadoActual);
        if (estadoColor) {
          sheet.getRange(fila + i, 3).setBackground(estadoColor);
        }
      }
      
      fila += datosIssues.length;
    }
    
    // ✅ Estadísticas de la semana
    fila++;
    sheet.getRange(fila, 1, 1, 8).merge();
    sheet.getRange(fila, 1)
      .setValue(`📊 Proyectos: ${stats.proyectos.join(', ')} | 👥 Asignados: ${stats.asignados.join(', ')} | ⏱️ Eficiencia: ${stats.eficienciaTiempo}%`)
      .setFontSize(10)
      .setBackground(CONFIG_SEMANAL.colores.info)
      .setFontColor('white')
      .setHorizontalAlignment('center');
    
    fila += 3;
  });
  
  return fila;
}

/**
 * ✅ Obtiene color según el estado del issue
 * @param {string} estado - Estado del issue
 * @returns {string|null} Color hexadecimal o null
 */
function getColorPorEstado(estado) {
  if (CONFIG_SEMANAL.estadosCompletados.includes(estado)) {
    return CONFIG_SEMANAL.colores.exito;
  } else if (CONFIG_SEMANAL.estadosEnProgreso.includes(estado)) {
    return CONFIG_SEMANAL.colores.advertencia;
  } else if (CONFIG_SEMANAL.estadosPendientes.includes(estado)) {
    return CONFIG_SEMANAL.colores.info;
  }
  return null;
}

/**
 * ✅ Aplica formato general a la hoja
 * @param {Sheet} sheet - Hoja de Google Sheets
 */
function aplicarFormatoGeneralSemanal(sheet) {
  try {
    // ✅ Ajustar ancho de columnas
    sheet.setColumnWidth(1, 120); // Key
    sheet.setColumnWidth(2, 300); // Resumen
    sheet.setColumnWidth(3, 120); // Estado
    sheet.setColumnWidth(4, 150); // Asignado
    sheet.setColumnWidth(5, 100); // Prioridad
    sheet.setColumnWidth(6, 90);  // Tiempo Est.
    sheet.setColumnWidth(7, 90);  // Tiempo Real
    sheet.setColumnWidth(8, 100); // Proyecto
    
    // ✅ Formato general
    const rangeCompleto = sheet.getDataRange();
    rangeCompleto.setFontFamily('Arial');
    rangeCompleto.setFontSize(10);
    rangeCompleto.setVerticalAlignment('middle');
    
    // ✅ Bordes
    rangeCompleto.setBorder(true, true, true, true, true, true, '#cccccc', SpreadsheetApp.BorderStyle.SOLID);
    
    Logger.log('✅ [SEMANAL] Formato aplicado exitosamente');
    
  } catch (error) {
    Logger.log(`⚠️ [SEMANAL] Error aplicando formato: ${error.message}`);
  }
}

// =====================================
// GENERADOR DE REPORTE CON FORMATO ESPECÍFICO
// =====================================

/**
 * ✅ NUEVO: Escribe el reporte en el formato EXACTO que necesitas
 * @param {Sheet} sheet - Hoja de Google Sheets
 * @param {Object} issuesPorSemana - Issues clasificados por semana
 * @param {Object} opciones - Opciones de formato
 * @returns {boolean} true si se escribió exitosamente
 */
function escribirReporteSemanalFormatoEspecifico(sheet, issuesPorSemana, opciones = {}) {
  try {
    Logger.log('📝 [FORMATO] Escribiendo reporte en formato específico...');
    
    // ✅ Limpiar hoja
    sheet.clear();
    let filaActual = 1;
    
    // ✅ Ordenar semanas por número
    const semanasOrdenadas = Object.keys(issuesPorSemana).sort((a, b) => {
      const numA = CONFIG_SEMANAL.obtenerNumeroSemana(a);
      const numB = CONFIG_SEMANAL.obtenerNumeroSemana(b);
      return numA - numB;
    });
    
    semanasOrdenadas.forEach((etiquetaSemana, indice) => {
      const datosSemana = issuesPorSemana[etiquetaSemana];
      const issues = datosSemana.issues;
      
      // ✅ Headers de la tabla (formato exacto)
      const headers = [
        'Nombre del proyecto',
        'Clave de incidencia', 
        'Tipo de Incidencia',
        'Resumen',
        'Tiempo Trabajado',
        'Estimación original',
        'Fecha de vencimiento',
        'Estado',
        'Etiquetas'
      ];
      
      const headerRange = sheet.getRange(filaActual, 1, 1, 9);
      headerRange.setValues([headers]);
      headerRange.setFontWeight('bold');
      headerRange.setBackground('#e8f2ff');
      headerRange.setBorder(true, true, true, true, true, true, '#000000', SpreadsheetApp.BorderStyle.SOLID);
      filaActual++;
      
      // ✅ Datos de los issues en formato exacto
      let tiempoTotalTrabajado = 0;
      let tiempoTotalEstimado = 0;
      
      const datosFilas = issues.map(issue => {
        const analisis = issue.analisisSemanal;
        
        // Convertir tiempo de segundos a horas
        const tiempoTrabajadoHoras = analisis.tiempoTrabajadoHoras;
        const tiempoEstimadoHoras = analisis.tiempoEstimadoHoras;
        
        tiempoTotalTrabajado += tiempoTrabajadoHoras;
        tiempoTotalEstimado += tiempoEstimadoHoras;
        
        // Formatear fecha de vencimiento
        let fechaVencimiento = '';
        if (analisis.fechaVencimiento) {
          const fecha = analisis.fechaVencimiento;
          fechaVencimiento = `${String(fecha.getDate()).padStart(2, '0')}/${String(fecha.getMonth() + 1).padStart(2, '0')}/${fecha.getFullYear()} 00:00`;
        }
        
        return [
          analisis.proyectoNombre,
          issue.key,
          analisis.tipoIssue,
          issue.fields.summary || '',
          Math.round(tiempoTrabajadoHoras * 3600), // Convertir de vuelta a segundos para mostrar
          Math.round(tiempoEstimadoHoras * 3600), // Convertir de vuelta a segundos para mostrar
          fechaVencimiento,
          analisis.estadoActual,
          etiquetaSemana
        ];
      });
      
      if (datosFilas.length > 0) {
        const datosRange = sheet.getRange(filaActual, 1, datosFilas.length, 9);
        datosRange.setValues(datosFilas);
        datosRange.setBorder(true, true, true, true, true, true, '#cccccc', SpreadsheetApp.BorderStyle.SOLID);
        
        // ✅ Formato alternado para mejor legibilidad
        for (let i = 0; i < datosFilas.length; i++) {
          const rowRange = sheet.getRange(filaActual + i, 1, 1, 9);
          if (i % 2 === 0) {
            rowRange.setBackground('#f8fcff');
          }
        }
        
        filaActual += datosFilas.length;
      }
      
      // ✅ Fila de totales (formato exacto como en tu documento)
      const filasTotales = [
        ['', '', '', '', Math.round(tiempoTotalTrabajado * 10) / 10, Math.round(tiempoTotalEstimado * 10) / 10, '', '', '']
      ];
      
      const totalesRange = sheet.getRange(filaActual, 1, 1, 9);
      totalesRange.setValues(filasTotales);
      totalesRange.setFontWeight('bold');
      totalesRange.setBackground('#ffeb3b');
      totalesRange.setBorder(true, true, true, true, true, true, '#000000', SpreadsheetApp.BorderStyle.SOLID);
      filaActual++;
      
      // ✅ Fila vacía entre semanas (como en tu documento)
      if (indice < semanasOrdenadas.length - 1) {
        filaActual++;
      }
    });
    
    // ✅ Aplicar formato general mejorado
    aplicarFormatoEspecifico(sheet);
    
    Logger.log('✅ [FORMATO] Reporte escrito en formato específico exitosamente');
    return true;
    
  } catch (error) {
    ErrorManagerSemanal.registrarError(
      'Error escribiendo reporte en formato específico',
      error,
      'FORMATO_REPORTE',
      'HIGH'
    );
    
    Logger.log(`❌ [FORMATO] Error escribiendo reporte: ${error.message}`);
    return false;
  }
}

/**
 * ✅ NUEVO: Aplica formato específico según tu documento
 * @param {Sheet} sheet - Hoja de Google Sheets
 */
function aplicarFormatoEspecifico(sheet) {
  try {
    // ✅ Ajustar ancho de columnas según tu formato
    sheet.setColumnWidth(1, 200); // Nombre del proyecto
    sheet.setColumnWidth(2, 100); // Clave de incidencia
    sheet.setColumnWidth(3, 120); // Tipo de Incidencia
    sheet.setColumnWidth(4, 300); // Resumen
    sheet.setColumnWidth(5, 100); // Tiempo Trabajado
    sheet.setColumnWidth(6, 120); // Estimación original
    sheet.setColumnWidth(7, 140); // Fecha de vencimiento
    sheet.setColumnWidth(8, 80);  // Estado
    sheet.setColumnWidth(9, 100); // Etiquetas
    
    // ✅ Formato general
    const rangeCompleto = sheet.getDataRange();
    if (rangeCompleto && rangeCompleto.getNumRows() > 0) {
      rangeCompleto.setFontFamily('Arial');
      rangeCompleto.setFontSize(10);
      rangeCompleto.setVerticalAlignment('middle');
    }
    
    Logger.log('✅ [FORMATO] Formato específico aplicado exitosamente');
    
  } catch (error) {
    Logger.log(`⚠️ [FORMATO] Error aplicando formato específico: ${error.message}`);
  }
}

/**
 * ✅ NUEVA: Función para generar reporte con formato específico
 * @param {Object} opciones - Opciones de generación del reporte
 * @returns {boolean} true si se generó exitosamente
 */
async function generarReporteFormatoEspecifico(opciones = {}) {
  // Activar formato específico
  opciones.formatoEspecifico = true;
  
  // Llamar a la función principal
  return await generarReporteSemanalCompleto(opciones);
}

/**
 * ✅ NUEVA: Escribe reporte por persona en formato de tabla específico
 * @param {Sheet} sheet - Hoja de Google Sheets
 * @param {Object} issuesPorSemana - Issues clasificados por semana
 * @param {Object} opciones - Opciones de formato
 * @returns {boolean} true si se escribió exitosamente
 */
function escribirReportePersonaEspecifica(sheet, issuesPorSemana, opciones = {}) {
  try {
    Logger.log('👤 [PERSONA] Escribiendo reporte por persona...');
    
    // ✅ Limpiar hoja
    sheet.clear();
    let filaActual = 1;
    
    // ✅ Ordenar semanas por número
    const semanasOrdenadas = Object.keys(issuesPorSemana).sort((a, b) => {
      const numA = CONFIG_SEMANAL.obtenerNumeroSemana(a);
      const numB = CONFIG_SEMANAL.obtenerNumeroSemana(b);
      return numA - numB;
    });
    
    semanasOrdenadas.forEach((etiquetaSemana, indice) => {
      const datosSemana = issuesPorSemana[etiquetaSemana];
      const issues = datosSemana.issues;
      
      if (issues.length === 0) return; // Saltar semanas sin issues
      
      // ✅ Headers de la tabla (formato exacto)
      const headers = [
        'Nombre del proyecto',
        'Clave de incidencia', 
        'Tipo de Incidencia',
        'Resumen',
        'Tiempo Trabajado',
        'Estimación original',
        'Fecha de vencimiento',
        'Estado',
        'Etiquetas'
      ];
      
      const headerRange = sheet.getRange(filaActual, 1, 1, 9);
      headerRange.setValues([headers]);
      headerRange.setFontWeight('bold');
      headerRange.setBackground('#e8f2ff');
      headerRange.setBorder(true, true, true, true, true, true, '#000000', SpreadsheetApp.BorderStyle.SOLID);
      filaActual++;
      
      // ✅ Procesar datos de los issues
      let tiempoTotalTrabajadoHoras = 0;
      let tiempoTotalEstimadoHoras = 0;
      
      const datosFilas = issues.map(issue => {
        const analisis = issue.analisisSemanal;
        
        // ✅ Convertir tiempo de segundos a horas con decimales
        const tiempoTrabajadoHoras = Math.round((analisis.tiempoTrabajadoHoras || 0) * 100) / 100;
        const tiempoEstimadoHoras = Math.round((analisis.tiempoEstimadoHoras || 0) * 100) / 100;
        
        tiempoTotalTrabajadoHoras += tiempoTrabajadoHoras;
        tiempoTotalEstimadoHoras += tiempoEstimadoHoras;
        
        // ✅ Formatear fecha de vencimiento
        let fechaVencimiento = '';
        if (analisis.fechaVencimiento) {
          const fecha = analisis.fechaVencimiento;
          fechaVencimiento = `${String(fecha.getDate()).padStart(2, '0')}/${String(fecha.getMonth() + 1).padStart(2, '0')}/${fecha.getFullYear()} 00:00`;
        }
        
        return [
          analisis.proyectoNombre || 'Sin proyecto',
          issue.key || 'Sin clave',
          analisis.tipoIssue || 'Sin tipo',
          issue.fields.summary || 'Sin resumen',
          tiempoTrabajadoHoras,
          tiempoEstimadoHoras,
          fechaVencimiento,
          analisis.estadoActual || 'Sin estado',
          etiquetaSemana
        ];
      });
      
      if (datosFilas.length > 0) {
        const datosRange = sheet.getRange(filaActual, 1, datosFilas.length, 9);
        datosRange.setValues(datosFilas);
        datosRange.setBorder(true, true, true, true, true, true, '#cccccc', SpreadsheetApp.BorderStyle.SOLID);
        
        // ✅ Formato alternado para mejor legibilidad
        for (let i = 0; i < datosFilas.length; i++) {
          const rowRange = sheet.getRange(filaActual + i, 1, 1, 9);
          if (i % 2 === 0) {
            rowRange.setBackground('#f8fcff');
          }
        }
        
        filaActual += datosFilas.length;
      }
      
      // ✅ Fila de totales (formato exacto como en tu ejemplo)
      const tiempoTotalTrabajadoRedondeado = Math.round(tiempoTotalTrabajadoHoras * 100000000) / 100000000;
      const tiempoTotalEstimadoRedondeado = Math.round(tiempoTotalEstimadoHoras * 100000000) / 100000000;
      
      const filasTotales = [
        ['', '', '', '', tiempoTotalTrabajadoRedondeado, tiempoTotalEstimadoRedondeado, '', '', '']
      ];
      
      const totalesRange = sheet.getRange(filaActual, 1, 1, 9);
      totalesRange.setValues(filasTotales);
      totalesRange.setFontWeight('bold');
      totalesRange.setBackground('#ffeb3b');
      totalesRange.setBorder(true, true, true, true, true, true, '#000000', SpreadsheetApp.BorderStyle.SOLID);
      filaActual++;
      
      // ✅ Fila vacía entre semanas (como en tu ejemplo)
      if (indice < semanasOrdenadas.length - 1) {
        filaActual++;
      }
    });
    
    // ✅ Aplicar formato específico para persona
    aplicarFormatoPersonaEspecifica(sheet);
    
    Logger.log('✅ [PERSONA] Reporte por persona escrito exitosamente');
    return true;
    
  } catch (error) {
    ErrorManagerSemanal.registrarError(
      'Error escribiendo reporte por persona',
      error,
      'REPORTE_PERSONA',
      'HIGH'
    );
    
    Logger.log(`❌ [PERSONA] Error escribiendo reporte: ${error.message}`);
    return false;
  }
}

/**
 * ✅ NUEVA: Aplica formato específico para reportes por persona
 * @param {Sheet} sheet - Hoja de Google Sheets
 */
function aplicarFormatoPersonaEspecifica(sheet) {
  try {
    // ✅ Ajustar ancho de columnas según el ejemplo
    sheet.setColumnWidth(1, 250); // Nombre del proyecto
    sheet.setColumnWidth(2, 100); // Clave de incidencia
    sheet.setColumnWidth(3, 120); // Tipo de Incidencia
    sheet.setColumnWidth(4, 400); // Resumen
    sheet.setColumnWidth(5, 120); // Tiempo Trabajado
    sheet.setColumnWidth(6, 130); // Estimación original
    sheet.setColumnWidth(7, 140); // Fecha de vencimiento
    sheet.setColumnWidth(8, 80);  // Estado
    sheet.setColumnWidth(9, 100); // Etiquetas
    
    // ✅ Formato general
    const rangeCompleto = sheet.getDataRange();
    if (rangeCompleto && rangeCompleto.getNumRows() > 0) {
      rangeCompleto.setFontFamily('Arial');
      rangeCompleto.setFontSize(10);
      rangeCompleto.setVerticalAlignment('middle');
      rangeCompleto.setHorizontalAlignment('left');
    }
    
    Logger.log('✅ [PERSONA] Formato específico aplicado exitosamente');
    
  } catch (error) {
    Logger.log(`⚠️ [PERSONA] Error aplicando formato específico: ${error.message}`);
  }
}

/**
 * ✅ NUEVA: Escribe reporte personalizado completo con columna Persona Asignada
 * @param {Sheet} sheet - Hoja de Google Sheets
 * @param {Object} issuesPorSemana - Issues clasificados por semana
 * @param {Object} opciones - Opciones de formato
 * @returns {boolean} true si se escribió exitosamente
 */
function escribirReportePersonalizadoCompleto(sheet, issuesPorSemana, opciones = {}) {
  try {
    Logger.log('📊 [PERSONALIZADO] Escribiendo reporte personalizado completo...');
    
    // ✅ Limpiar hoja
    sheet.clear();
    let filaActual = 1;
    
    // ✅ Recopilar todos los issues y agrupar por persona
    const todosLosIssues = [];
    Object.values(issuesPorSemana).forEach(semana => {
      todosLosIssues.push(...semana.issues);
    });
    
    if (todosLosIssues.length === 0) {
      Logger.log('⚠️ [PERSONALIZADO] No hay issues para procesar');
      return false;
    }
    
    // ✅ Agrupar issues por persona asignada
    const issuesPorPersona = agruparIssuesPorPersona(todosLosIssues);
    
    // ✅ Definir headers con "Persona asignada" como primera columna
    const headers = [
      'Persona asignada',        // NUEVA: Primera columna
      'Nombre del proyecto',
      'Clave de incidencia',
      'Tipo de Incidencia',
      'Resumen',
      'Tiempo Trabajado',        // En segundos (original)
      'Estimación original',     // En segundos (original)
      'Fecha de vencimiento',
      'Estado',
      'Etiquetas'
    ];
    
    // ✅ Crear encabezado principal
    const headerRange = sheet.getRange(filaActual, 1, 1, 10);
    headerRange.setValues([headers]);
    headerRange.setFontWeight('bold');
    headerRange.setBackground('#4a90e2');
    headerRange.setFontColor('white');
    headerRange.setBorder(true, true, true, true, true, true, '#000000', SpreadsheetApp.BorderStyle.SOLID);
    filaActual++;
    
    // ✅ Procesar cada persona
    const personasOrdenadas = Object.keys(issuesPorPersona).sort();
    
    personasOrdenadas.forEach((nombrePersona, indicePersona) => {
      const datosPersona = issuesPorPersona[nombrePersona];
      const issues = datosPersona.issues;
      
      if (issues.length === 0) return;
      
      Logger.log(`👤 [PERSONALIZADO] Procesando ${issues.length} issues para ${nombrePersona}`);
      
      // ✅ Procesar datos de los issues
      let tiempoTotalTrabajadoSegundos = 0;
      let tiempoTotalEstimadoSegundos = 0;
      
      const datosFilas = issues.map(issue => {
        const analisis = issue.analisisSemanal;
        
        // ✅ CORREGIDO: Obtener valores originales en segundos desde el timetracking
        const tiempoTrabajadoSegundos = issue.fields.timetracking?.timeSpentSeconds || 0;
        const tiempoEstimadoSegundos = issue.fields.timetracking?.originalEstimateSeconds || 0;
        
        tiempoTotalTrabajadoSegundos += tiempoTrabajadoSegundos;
        tiempoTotalEstimadoSegundos += tiempoEstimadoSegundos;
        
        // ✅ Formatear fecha de vencimiento
        let fechaVencimiento = '';
        if (analisis.fechaVencimiento) {
          const fecha = analisis.fechaVencimiento;
          fechaVencimiento = `${String(fecha.getDate()).padStart(2, '0')}/${String(fecha.getMonth() + 1).padStart(2, '0')}/${fecha.getFullYear()} 0:00`;
        }
        
        // ✅ CORREGIDO: Obtener todas las etiquetas semanales del issue
        let etiquetasSemanales = '';
        if (issue.fields.labels && Array.isArray(issue.fields.labels)) {
          const etiquetasSemana = issue.fields.labels
            .filter(label => {
              const labelName = typeof label === 'string' ? label : (label.name || '');
              return labelName.match(/^SEMANA_[1-6]$/);
            })
            .map(label => typeof label === 'string' ? label : (label.name || ''))
            .sort();
          etiquetasSemanales = etiquetasSemana.join(', ') || 'Sin etiquetas semanales';
        } else {
          etiquetasSemanales = 'Sin etiquetas';
        }
        
        return [
          nombrePersona,                                    // NUEVA: Persona asignada
          analisis.proyectoNombre || 'Sin proyecto',
          issue.key || 'Sin clave',
          analisis.tipoIssue || 'Sin tipo',
          issue.fields.summary || 'Sin resumen',
          tiempoTrabajadoSegundos,                          // CORREGIDO: Segundos originales directos
          tiempoEstimadoSegundos,                           // CORREGIDO: Segundos originales directos
          fechaVencimiento,
          analisis.estadoActual || 'Sin estado',
          etiquetasSemanales                                // CORREGIDO: Todas las etiquetas semanales
        ];
      });
      
      // ✅ Escribir datos de la persona
      if (datosFilas.length > 0) {
        const datosRange = sheet.getRange(filaActual, 1, datosFilas.length, 10);
        datosRange.setValues(datosFilas);
        datosRange.setBorder(true, true, true, true, true, true, '#cccccc', SpreadsheetApp.BorderStyle.SOLID);
        
        // ✅ Formato alternado por fila
        for (let i = 0; i < datosFilas.length; i++) {
          const rowRange = sheet.getRange(filaActual + i, 1, 1, 10);
          if (i % 2 === 0) {
            rowRange.setBackground('#f8fcff');
          }
        }
        
        filaActual += datosFilas.length;
      }
      
      // ✅ Fila de totales por persona (CRÍTICO: Mostrar en horas con decimales)
      const tiempoTotalTrabajadoHoras = Math.round((tiempoTotalTrabajadoSegundos / 3600) * 100000000) / 100000000;
      const tiempoTotalEstimadoHoras = Math.round((tiempoTotalEstimadoSegundos / 3600) * 100000000) / 100000000;
      
      const filaTotales = [
        '', '', '', '', '',  // Columnas vacías hasta Tiempo Trabajado
        tiempoTotalTrabajadoHoras,   // Total en horas con decimales
        tiempoTotalEstimadoHoras,    // Total en horas con decimales
        '', '', ''
      ];
      
      const totalesRange = sheet.getRange(filaActual, 1, 1, 10);
      totalesRange.setValues([filaTotales]);
      totalesRange.setFontWeight('bold');
      totalesRange.setBackground('#ffeb3b');
      totalesRange.setBorder(true, true, true, true, true, true, '#000000', SpreadsheetApp.BorderStyle.SOLID);
      filaActual++;
      
      // ✅ Fila vacía entre personas
      if (indicePersona < personasOrdenadas.length - 1) {
        filaActual++;
      }
    });
    
    // ✅ Aplicar formato específico
    aplicarFormatoPersonalizadoCompleto(sheet);
    
    Logger.log('✅ [PERSONALIZADO] Reporte personalizado completo escrito exitosamente');
    return true;
    
  } catch (error) {
    ErrorManagerSemanal.registrarError(
      'Error escribiendo reporte personalizado completo',
      error,
      'REPORTE_PERSONALIZADO',
      'HIGH'
    );
    
    Logger.log(`❌ [PERSONALIZADO] Error escribiendo reporte: ${error.message}`);
    return false;
  }
}

/**
 * ✅ NUEVA: Agrupa issues por persona asignada
 * @param {Object[]} issues - Array de issues
 * @returns {Object} Issues agrupados por persona
 */
function agruparIssuesPorPersona(issues) {
  const grupos = {};
  
  issues.forEach(issue => {
    const nombrePersona = issue.analisisSemanal?.asignadoNombre || 'Sin asignar';
    
    if (!grupos[nombrePersona]) {
      grupos[nombrePersona] = {
        issues: [],
        totalTiempoTrabajado: 0,
        totalTiempoEstimado: 0
      };
    }
    
    grupos[nombrePersona].issues.push(issue);
    grupos[nombrePersona].totalTiempoTrabajado += (issue.analisisSemanal?.tiempoTrabajadoHoras || 0);
    grupos[nombrePersona].totalTiempoEstimado += (issue.analisisSemanal?.tiempoEstimadoHoras || 0);
  });
  
  return grupos;
}

/**
 * ✅ NUEVA: Aplica formato específico para reportes personalizados
 * @param {Sheet} sheet - Hoja de Google Sheets
 */
function aplicarFormatoPersonalizadoCompleto(sheet) {
  try {
    // ✅ Ajustar ancho de columnas según especificaciones
    sheet.setColumnWidth(1, 200); // Persona asignada
    sheet.setColumnWidth(2, 200); // Nombre del proyecto
    sheet.setColumnWidth(3, 100); // Clave de incidencia
    sheet.setColumnWidth(4, 120); // Tipo de Incidencia
    sheet.setColumnWidth(5, 300); // Resumen
    sheet.setColumnWidth(6, 120); // Tiempo Trabajado
    sheet.setColumnWidth(7, 120); // Estimación original
    sheet.setColumnWidth(8, 140); // Fecha de vencimiento
    sheet.setColumnWidth(9, 80);  // Estado
    sheet.setColumnWidth(10, 100); // Etiquetas
    
    // ✅ Formato general
    const rangeCompleto = sheet.getDataRange();
    if (rangeCompleto && rangeCompleto.getNumRows() > 0) {
      rangeCompleto.setFontFamily('Arial');
      rangeCompleto.setFontSize(10);
      rangeCompleto.setVerticalAlignment('middle');
      rangeCompleto.setHorizontalAlignment('left');
    }
    
    Logger.log('✅ [PERSONALIZADO] Formato personalizado aplicado exitosamente');
    
  } catch (error) {
    Logger.log(`⚠️ [PERSONALIZADO] Error aplicando formato: ${error.message}`);
  }
}

// =====================================
// 🎯 NUEVA FUNCIÓN PRINCIPAL: AGRUPACIÓN ESTRICTA POR PERSONAS
// =====================================

/**
 * ✅ NUEVA: Escribe reporte con agrupación estricta por personas
 * Implementa la jerarquía: PERSONA -> SEMANAS -> ISSUES
 * @param {Sheet} sheet - Hoja de Google Sheets
 * @param {Object} issuesPorPersona - Issues organizados por persona y semana
 * @param {Object} opciones - Opciones de formato
 * @returns {boolean} true si se escribió exitosamente
 */
function escribirReporteAgrupadoPorPersonas(sheet, issuesPorPersona, opciones = {}) {
  try {
    Logger.log('👥 [AGRUPACION-PERSONAS] Escribiendo reporte con agrupación estricta por personas...');
    
    // ✅ Limpiar hoja
    sheet.clear();
    let filaActual = 1;
    
    // ✅ Definir headers de la tabla
    const headers = [
      'Persona asignada',
      'Nombre del proyecto', 
      'Clave de incidencia',
      'Tipo de Incidencia',
      'Resumen',
      'Tiempo Trabajado',
      'Estimación original',
      'Fecha de vencimiento',
      'Estado',
      'Etiquetas'
    ];
    
    // ✅ Ordenar personas alfabéticamente
    const personasOrdenadas = Object.keys(issuesPorPersona).sort();
    
    // ✅ Variables para totales generales
    let totalGeneralTrabajadoSegundos = 0;
    let totalGeneralEstimadoSegundos = 0;
    
    personasOrdenadas.forEach((nombrePersona, indicePersona) => {
      const datosPersona = issuesPorPersona[nombrePersona];
      const semanasPersona = datosPersona.semanas;
      
      if (Object.keys(semanasPersona).length === 0) return;
      
      Logger.log(`👤 [PERSONA] Procesando ${nombrePersona} con ${datosPersona.totales.totalIssues} issues`);
      
      // ✅ 1. SECCIÓN DE PERSONA (Header principal)
      sheet.getRange(filaActual, 1, 1, 10).merge();
      sheet.getRange(filaActual, 1)
        .setValue(`📊 ${nombrePersona}`)
        .setFontSize(16)
        .setFontWeight('bold')
        .setBackground('#1e3c72')
        .setFontColor('white')
        .setHorizontalAlignment('center')
        .setVerticalAlignment('middle');
      sheet.setRowHeight(filaActual, 35);
      filaActual++;
      
      // ✅ Variables para totales de la persona
      let totalPersonaTrabajadoSegundos = 0;
      let totalPersonaEstimadoSegundos = 0;
      
      // ✅ 2. ORDENAR SEMANAS NUMÉRICAMENTE (SEMANA_1, SEMANA_2, etc.)
      const semanasOrdenadas = Object.keys(semanasPersona).sort((a, b) => {
        const numA = parseInt(a.replace('SEMANA_', '')) || 0;
        const numB = parseInt(b.replace('SEMANA_', '')) || 0;
        return numA - numB;
      });
      
      semanasOrdenadas.forEach((etiquetaSemana, indiceSemana) => {
        const datosSemana = semanasPersona[etiquetaSemana];
        const issuesSemana = datosSemana.issues;
        
        if (issuesSemana.length === 0) return;
        
        // ✅ 3. SUBSECCIÓN DE SEMANA
        sheet.getRange(filaActual, 1, 1, 10).merge();
        sheet.getRange(filaActual, 1)
          .setValue(`${etiquetaSemana}`)
          .setFontSize(12)
          .setFontWeight('bold')
          .setBackground('#4a90e2')
          .setFontColor('white')
          .setHorizontalAlignment('left')
          .setVerticalAlignment('middle');
        sheet.setRowHeight(filaActual, 25);
        filaActual++;
        
        // ✅ 4. HEADERS DE LA TABLA PARA ESTA SEMANA
        const headerRange = sheet.getRange(filaActual, 1, 1, 10);
        headerRange.setValues([headers]);
        headerRange.setFontWeight('bold');
        headerRange.setBackground('#e8f2ff');
        headerRange.setFontColor('black');
        headerRange.setBorder(true, true, true, true, true, true, '#000000', SpreadsheetApp.BorderStyle.SOLID);
        filaActual++;
        
        // ✅ 5. DATOS DE LOS ISSUES DE ESTA SEMANA
        let tiempoSemanaSegundos = 0;
        let tiempoEstimadoSemanaSegundos = 0;
        
        const datosFilas = issuesSemana.map(issue => {
          const analisis = issue.analisisSemanal;
          
          // ✅ Obtener tiempos originales en segundos
          const tiempoTrabajadoSegundos = issue.fields.timetracking?.timeSpentSeconds || 0;
          const tiempoEstimadoSegundos = issue.fields.timetracking?.originalEstimateSeconds || 0;
          
          tiempoSemanaSegundos += tiempoTrabajadoSegundos;
          tiempoEstimadoSemanaSegundos += tiempoEstimadoSegundos;
          
          // ✅ Formatear fecha de vencimiento
          let fechaVencimiento = '';
          if (analisis.fechaVencimiento) {
            const fecha = analisis.fechaVencimiento;
            fechaVencimiento = `${fecha.getDate().toString().padStart(2, '0')}/${(fecha.getMonth() + 1).toString().padStart(2, '0')}/${fecha.getFullYear()} 0:00`;
          }
          
          // ✅ Obtener SOLO la primera etiqueta semanal (regla de prioridad numérica)
          const primeraEtiquetaSemanal = obtenerPrimeraEtiquetaSemanal(issue) || etiquetaSemana;
          
          return [
            nombrePersona,
            analisis.proyectoNombre || 'Sin proyecto',
            issue.key || 'Sin clave',
            analisis.tipoIssue || 'Sin tipo',
            issue.fields.summary || 'Sin resumen',
            tiempoTrabajadoSegundos,
            tiempoEstimadoSegundos,
            fechaVencimiento,
            analisis.estadoActual || 'Sin estado',
            primeraEtiquetaSemanal
          ];
        });
        
        // ✅ Escribir datos de los issues
        if (datosFilas.length > 0) {
          const datosRange = sheet.getRange(filaActual, 1, datosFilas.length, 10);
          datosRange.setValues(datosFilas);
          datosRange.setBorder(true, true, true, true, true, true, '#cccccc', SpreadsheetApp.BorderStyle.SOLID);
          
          // ✅ Formato alternado por fila
          for (let i = 0; i < datosFilas.length; i++) {
            const rowRange = sheet.getRange(filaActual + i, 1, 1, 10);
            rowRange.setBackground(i % 2 === 0 ? '#f8fcff' : 'white');
          }
          
          filaActual += datosFilas.length;
        }
        
        // ✅ 6. TOTAL DE LA SEMANA (en horas con decimales)
        const tiempoSemanaHoras = Math.round((tiempoSemanaSegundos / 3600) * 100) / 100;
        const tiempoEstimadoSemanaHoras = Math.round((tiempoEstimadoSemanaSegundos / 3600) * 100) / 100;
        
        const filaTotalSemana = [
          '', '', '', '', '',
          tiempoSemanaHoras,
          tiempoEstimadoSemanaHoras,
          '', '', ''
        ];
        
        const totalSemanaRange = sheet.getRange(filaActual, 1, 1, 10);
        totalSemanaRange.setValues([filaTotalSemana]);
        totalSemanaRange.setFontWeight('bold');
        totalSemanaRange.setBackground('#ffeb3b');
        totalSemanaRange.setBorder(true, true, true, true, true, true, '#000000', SpreadsheetApp.BorderStyle.SOLID);
        
        // ✅ Agregar texto indicativo en la primera columna
        sheet.getRange(filaActual, 1).setValue(`TOTAL ${etiquetaSemana}:`);
        sheet.getRange(filaActual, 6).setValue(tiempoSemanaHoras + 'h');
        sheet.getRange(filaActual, 7).setValue(tiempoEstimadoSemanaHoras + 'h');
        
        filaActual++;
        filaActual++; // Fila vacía entre semanas
        
        // ✅ Acumular totales de la persona
        totalPersonaTrabajadoSegundos += tiempoSemanaSegundos;
        totalPersonaEstimadoSegundos += tiempoEstimadoSemanaSegundos;
      });
      
      // ✅ 7. TOTAL DE LA PERSONA (en horas con decimales)
      const totalPersonaHoras = Math.round((totalPersonaTrabajadoSegundos / 3600) * 100) / 100;
      const totalEstimadoPersonaHoras = Math.round((totalPersonaEstimadoSegundos / 3600) * 100) / 100;
      
      const filaTotalPersona = [
        '', '', '', '', '',
        totalPersonaHoras,
        totalEstimadoPersonaHoras,
        '', '', ''
      ];
      
      const totalPersonaRange = sheet.getRange(filaActual, 1, 1, 10);
      totalPersonaRange.setValues([filaTotalPersona]);
      totalPersonaRange.setFontWeight('bold');
      totalPersonaRange.setBackground('#dc3545');
      totalPersonaRange.setFontColor('white');
      totalPersonaRange.setBorder(true, true, true, true, true, true, '#000000', SpreadsheetApp.BorderStyle.SOLID);
      
      // ✅ Agregar texto indicativo
      sheet.getRange(filaActual, 1).setValue(`TOTAL ${nombrePersona}:`);
      sheet.getRange(filaActual, 6).setValue(totalPersonaHoras + 'h');
      sheet.getRange(filaActual, 7).setValue(totalEstimadoPersonaHoras + 'h');
      
      filaActual++;
      filaActual += 2; // Espacio entre personas
      
      // ✅ Acumular totales generales
      totalGeneralTrabajadoSegundos += totalPersonaTrabajadoSegundos;
      totalGeneralEstimadoSegundos += totalPersonaEstimadoSegundos;
    });
    
    // ✅ 8. APLICAR FORMATO ESPECÍFICO
    aplicarFormatoAgrupadoPorPersonas(sheet);
    
    Logger.log('✅ [AGRUPACION-PERSONAS] Reporte con agrupación por personas escrito exitosamente');
    return true;
    
  } catch (error) {
    ErrorManagerSemanal.registrarError(
      'Error escribiendo reporte agrupado por personas',
      error,
      'AGRUPACION_PERSONAS',
      'HIGH'
    );
    
    Logger.log(`❌ [AGRUPACION-PERSONAS] Error: ${error.message}`);
    return false;
  }
}

/**
 * ✅ NUEVA: Aplica formato específico para reportes agrupados por personas
 * @param {Sheet} sheet - Hoja de Google Sheets
 */
function aplicarFormatoAgrupadoPorPersonas(sheet) {
  try {
    // ✅ Ajustar ancho de columnas
    sheet.setColumnWidth(1, 200); // Persona asignada
    sheet.setColumnWidth(2, 200); // Nombre del proyecto
    sheet.setColumnWidth(3, 120); // Clave de incidencia
    sheet.setColumnWidth(4, 150); // Tipo de Incidencia
    sheet.setColumnWidth(5, 350); // Resumen
    sheet.setColumnWidth(6, 120); // Tiempo Trabajado
    sheet.setColumnWidth(7, 130); // Estimación original
    sheet.setColumnWidth(8, 140); // Fecha de vencimiento
    sheet.setColumnWidth(9, 100); // Estado
    sheet.setColumnWidth(10, 100); // Etiquetas
    
    // ✅ Formato general
    const rangeCompleto = sheet.getDataRange();
    if (rangeCompleto && rangeCompleto.getNumRows() > 0) {
      rangeCompleto.setFontFamily('Arial');
      rangeCompleto.setFontSize(10);
      rangeCompleto.setVerticalAlignment('middle');
      rangeCompleto.setHorizontalAlignment('left');
    }
    
    Logger.log('✅ [AGRUPACION-PERSONAS] Formato aplicado exitosamente');
    
  } catch (error) {
    Logger.log(`⚠️ [AGRUPACION-PERSONAS] Error aplicando formato: ${error.message}`);
  }
}