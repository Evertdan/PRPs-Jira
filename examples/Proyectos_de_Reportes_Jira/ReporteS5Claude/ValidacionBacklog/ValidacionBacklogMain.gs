// =====================================
// FUNCIÓN PRINCIPAL - VALIDACIÓN DE BACKLOG CCsoft
// =====================================

/**
 * Función principal del reporte de validación de backlog
 * Implementa todos los criterios definidos en las respuestas integradas
 */
function generarReporteValidacionBacklog() {
  const ui = SpreadsheetApp.getUi();
  
  try {
    Logger.log('🎯 Iniciando reporte de validación de backlog CCsoft...');
    
    // Mostrar diálogo de configuración
    const configuracion = mostrarDialogoConfiguracionValidacion();
    if (!configuracion) {
      Logger.log('ℹ️ Usuario canceló la generación del reporte');
      return;
    }
    
    // Crear estructura de hojas
    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    const hojas = crearEstructuraHojasValidacion(spreadsheet);
    
    // Obtener datos de Jira
    ui.alert('📊 Obteniendo Datos', 
      'Conectando con Jira para obtener tareas del backlog...', 
      ui.ButtonSet.OK);
    
    const tareas = obtenerTareasBacklogValidacion(configuracion);
    
    if (!tareas || tareas.length === 0) {
      ui.alert('📋 Sin Datos', 
        'No se encontraron tareas en el backlog que cumplan los criterios de búsqueda.\n\n' +
        'Verifique:\n' +
        '• Proyectos configurados\n' +
        '• Período de fechas\n' +
        '• Estado de las tareas', 
        ui.ButtonSet.OK);
      return;
    }
    
    Logger.log(`📊 Se encontraron ${tareas.length} tareas para validar`);
    
    // Procesar y validar tareas
    ui.alert('🔍 Procesando', 
      `Validando ${tareas.length} tareas según criterios de planeación...`, 
      ui.ButtonSet.OK);
    
    const datosValidacion = ProcesadorLoteTareas.procesarLoteTareas(tareas);
    
    // Escribir reportes en las hojas
    escribirDashboardValidacion(hojas.dashboard, datosValidacion);
    escribirDetalleTareasValidacion(hojas.detalle, datosValidacion.tareas);
    escribirMetricasEquiposValidacion(hojas.metricas, datosValidacion.porEquipo);
    escribirSeguimientoSemanalValidacion(hojas.seguimiento, datosValidacion.porSemana);
    
    // Aplicar formato
    aplicarFormatoReporteValidacion(hojas);
    
    // Mostrar resumen final
    mostrarResumenValidacionFinal(datosValidacion.resumen);
    
    Logger.log('✅ Reporte de validación de backlog completado exitosamente');
    
  } catch (error) {
    Logger.log(`❌ Error generando reporte: ${error.message}`);
    ui.alert('❌ Error en Reporte', 
      `Error generando el reporte de validación:\n\n${error.message}\n\n` +
      'Verifique:\n' +
      '• Configuración de credenciales Jira\n' +
      '• Conexión a internet\n' +
      '• Permisos en Google Sheets', 
      ui.ButtonSet.OK);
  }
}

/**
 * Obtiene tareas del backlog para validación
 */
function obtenerTareasBacklogValidacion(configuracion) {
  try {
    const config = obtenerConfigJiraValidacion();
    
    // Construir JQL basado en configuración
    const jql = construirJQLValidacionBacklog(configuracion);
    
    // Campos necesarios para validación
    const campos = CAMPOS_JIRA_VALIDACION.join(',');
    
    Logger.log(`🔍 JQL construida: ${jql}`);
    
    const url = `https://${config.dominio}.atlassian.net/rest/api/3/search?jql=${encodeURIComponent(jql)}&fields=${campos}&maxResults=500`;
    
    const opciones = {
      method: 'GET',
      headers: {
        'Authorization': `Basic ${Utilities.base64Encode(config.email + ':' + config.apiToken)}`,
        'Accept': 'application/json'
      },
      muteHttpExceptions: true
    };
    
    const respuesta = UrlFetchApp.fetch(url, opciones);
    
    if (respuesta.getResponseCode() !== 200) {
      throw new Error(`Error API Jira: ${respuesta.getResponseCode()} - ${respuesta.getContentText()}`);
    }
    
    const datos = JSON.parse(respuesta.getContentText());
    
    if (!datos.issues) {
      throw new Error('Respuesta de API no contiene issues');
    }
    
    Logger.log(`✅ Tareas obtenidas de Jira: ${datos.issues.length}`);
    return datos.issues;
    
  } catch (error) {
    Logger.log(`❌ Error obteniendo tareas: ${error.message}`);
    throw new Error(`Error conectando con Jira: ${error.message}`);
  }
}

/**
 * Construye JQL para validación de backlog
 */
function construirJQLValidacionBacklog(configuracion) {
  const config = CONFIG_VALIDACION_BACKLOG;
  
  // Intentar usar configuración automática si está disponible
  const configAuto = obtenerConfiguracionAutomatica();
  let proyectos, estadosExcluir;
  
  if (configAuto) {
    proyectos = configAuto.proyectosPrioritarios.join(',');
    estadosExcluir = configAuto.estadosExcluir;
  } else {
    proyectos = config.EQUIPOS.proyectosPrioritarios.join(',');
    estadosExcluir = ["Done", "Closed", "Resolved", "Listo", "Cerrado", "Completado"];
  }
  
  // Calcular fechas
  const fechaHoy = new Date();
  const fechaFin = new Date(fechaHoy.getTime() + (config.PERIODO.semanasAdelante * 7 * 24 * 60 * 60 * 1000));
  
  const fechaInicio = Utilities.formatDate(fechaHoy, Session.getScriptTimeZone(), "yyyy-MM-dd");
  const fechaFinFormateada = Utilities.formatDate(fechaFin, Session.getScriptTimeZone(), "yyyy-MM-dd");
  
  // Construir JQL más flexible incluyendo sprints activos
  let jql = `project IN (${proyectos}) AND status NOT IN (${estadosExcluir.map(s => `"${s}"`).join(',')})`;
  
  // Incluir tareas del backlog Y del sprint activo
  jql += ` AND (`;
  jql += `(duedate >= "${fechaInicio}" OR duedate IS EMPTY)`;  // Tareas del backlog
  jql += ` OR customfield_10020 IN openSprints()`;             // Tareas del sprint activo
  jql += `)`;
  
  jql += ` ORDER BY customfield_10020 DESC, duedate ASC, project ASC, assignee ASC`;
  
  return jql;
}

/**
 * Crea estructura de hojas para el reporte
 */
function crearEstructuraHojasValidacion(spreadsheet) {
  const timestamp = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), "yyyyMMdd_HHmm");
  const prefijo = CONFIG_HOJAS_REPORTE.prefijo;
  
  const hojas = {
    dashboard: obtenerOCrearHojaValidacion(spreadsheet, `${prefijo}_Dashboard_${timestamp}`),
    detalle: obtenerOCrearHojaValidacion(spreadsheet, `${prefijo}_Detalle_${timestamp}`),
    metricas: obtenerOCrearHojaValidacion(spreadsheet, `${prefijo}_Metricas_${timestamp}`),
    seguimiento: obtenerOCrearHojaValidacion(spreadsheet, `${prefijo}_Seguimiento_${timestamp}`)
  };
  
  // Activar dashboard por defecto
  spreadsheet.setActiveSheet(hojas.dashboard);
  
  return hojas;
}

/**
 * Obtiene o crea una hoja para validación
 */
function obtenerOCrearHojaValidacion(spreadsheet, nombre) {
  let hoja = spreadsheet.getSheetByName(nombre);
  if (!hoja) {
    hoja = spreadsheet.insertSheet(nombre);
  } else {
    hoja.clear();
  }
  return hoja;
}

/**
 * Escribe el dashboard principal de validación
 */
function escribirDashboardValidacion(hoja, datos) {
  hoja.clear();
  
  // Título principal
  hoja.getRange('A1').setValue(MENSAJES_SISTEMA.titulo)
    .setFontSize(CONFIG_FORMATO_SHEETS.fuentes.titulo.size)
    .setFontWeight(CONFIG_FORMATO_SHEETS.fuentes.titulo.weight)
    .setFontColor(CONFIG_FORMATO_SHEETS.colores.header);
  
  // Información de generación
  const fechaGeneracion = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), "dd/MM/yyyy HH:mm");
  hoja.getRange('A2').setValue(`📅 Generado: ${fechaGeneracion} • CCsoft.atlassian.net`)
    .setFontStyle('italic').setFontColor('#666');
  
  // Resumen general
  let fila = 4;
  hoja.getRange(fila, 1).setValue('🎯 RESUMEN GENERAL')
    .setFontSize(CONFIG_FORMATO_SHEETS.fuentes.subtitulo.size)
    .setFontWeight(CONFIG_FORMATO_SHEETS.fuentes.subtitulo.weight);
  fila += 2;
  
  const metricas = [
    ['📊 Total de tareas analizadas:', datos.resumen.total],
    ['✅ Tareas válidas completas:', `${datos.resumen.validasCompletas} (${datos.resumen.porcentajeValidas}%)`],
    ['⏱️ Sin tiempo estimado:', `${datos.resumen.sinTiempoEstimado} (${datos.resumen.porcentajeSinTiempo}%)`],
    ['🏷️ Sin etiqueta de semana:', `${datos.resumen.sinEtiquetaSemana} (${datos.resumen.porcentajeSinEtiqueta}%)`],
    ['📅 Sin fecha vencimiento:', `${datos.resumen.sinFechaVencimiento} (${datos.resumen.porcentajeSinFecha}%)`],
    ['🔄 Fecha desalineada:', `${datos.resumen.fechaDesalineada} (${datos.resumen.porcentajeDesalineada}%)`],
    ['📈 Promedio completitud:', `${datos.estadisticas.promedioCompletitud}%`]
  ];
  
  metricas.forEach(metrica => {
    hoja.getRange(fila, 1, 1, 2).setValues([metrica]);
    fila++;
  });
  
  // Estado general de planeación
  fila += 2;
  hoja.getRange(fila, 1).setValue('🎯 ESTADO GENERAL DE PLANEACIÓN')
    .setFontSize(CONFIG_FORMATO_SHEETS.fuentes.subtitulo.size)
    .setFontWeight(CONFIG_FORMATO_SHEETS.fuentes.subtitulo.weight);
  fila++;
  
  const estadoGeneral = determinarEstadoGeneralValidacion(datos.resumen);
  hoja.getRange(fila, 1).setValue(estadoGeneral.texto)
    .setBackground(estadoGeneral.color).setFontWeight('bold');
  
  // Distribución por estado
  fila += 3;
  escribirDistribucionEstados(hoja, fila, datos.estadisticas);
  
  // Top problemas detectados
  fila += 8;
  escribirProblemasDetectados(hoja, fila, datos);
  
  hoja.autoResizeColumns(1, 3);
}

/**
 * Escribe la distribución de estados en el dashboard
 */
function escribirDistribucionEstados(hoja, filaInicio, estadisticas) {
  hoja.getRange(filaInicio, 1).setValue('📊 DISTRIBUCIÓN POR ESTADO')
    .setFontSize(CONFIG_FORMATO_SHEETS.fuentes.subtitulo.size)
    .setFontWeight(CONFIG_FORMATO_SHEETS.fuentes.subtitulo.weight);
  
  const distribucion = estadisticas.distribucionPuntajes;
  const estados = [
    ['🟢 Excelente (90-100%):', distribucion.excelente, MENSAJES_SISTEMA.estados.excelente.color],
    ['🟡 Bueno (75-89%):', distribucion.bueno, MENSAJES_SISTEMA.estados.bueno.color],
    ['🟠 Aceptable (50-74%):', distribucion.aceptable, MENSAJES_SISTEMA.estados.aceptable.color],
    ['🔴 Crítico (<50%):', distribucion.critico, MENSAJES_SISTEMA.estados.critico.color]
  ];
  
  estados.forEach((estado, index) => {
    const fila = filaInicio + 1 + index;
    hoja.getRange(fila, 1, 1, 2).setValues([[estado[0], estado[1]]]);
    hoja.getRange(fila, 2).setBackground(estado[2]);
  });
}

/**
 * Escribe los problemas detectados
 */
function escribirProblemasDetectados(hoja, filaInicio, datos) {
  hoja.getRange(filaInicio, 1).setValue('⚠️ PRINCIPALES PROBLEMAS DETECTADOS')
    .setFontSize(CONFIG_FORMATO_SHEETS.fuentes.subtitulo.size)
    .setFontWeight(CONFIG_FORMATO_SHEETS.fuentes.subtitulo.weight);
  
  const problemas = [];
  
  if (datos.resumen.porcentajeSinTiempo > 20) {
    problemas.push(`🎯 ${datos.resumen.porcentajeSinTiempo}% de tareas sin estimación de tiempo`);
  }
  
  if (datos.resumen.porcentajeSinEtiqueta > 15) {
    problemas.push(`🏷️ ${datos.resumen.porcentajeSinEtiqueta}% de tareas sin etiqueta de semana`);
  }
  
  if (datos.resumen.porcentajeSinFecha > 10) {
    problemas.push(`📅 ${datos.resumen.porcentajeSinFecha}% de tareas sin fecha de vencimiento`);
  }
  
  if (datos.resumen.porcentajeDesalineada > 5) {
    problemas.push(`🔄 ${datos.resumen.porcentajeDesalineada}% de tareas con fechas desalineadas`);
  }
  
  if (problemas.length === 0) {
    hoja.getRange(filaInicio + 1, 1).setValue('✅ No se detectaron problemas significativos')
      .setBackground(MENSAJES_SISTEMA.estados.excelente.color);
  } else {
    problemas.forEach((problema, index) => {
      hoja.getRange(filaInicio + 1 + index, 1).setValue(problema)
        .setBackground(MENSAJES_SISTEMA.estados.aceptable.color);
    });
  }
}

/**
 * Determina el estado general de validación
 */
function determinarEstadoGeneralValidacion(resumen) {
  const umbrales = CONFIG_VALIDACION_BACKLOG.UMBRALES;
  
  if (resumen.porcentajeValidas >= umbrales.excelente) {
    return { texto: '🟢 EXCELENTE - Backlog bien planeado', color: MENSAJES_SISTEMA.estados.excelente.color };
  } else if (resumen.porcentajeValidas >= umbrales.bueno) {
    return { texto: '🟡 BUENO - Mejoras menores requeridas', color: MENSAJES_SISTEMA.estados.bueno.color };
  } else if (resumen.porcentajeValidas >= umbrales.aceptable) {
    return { texto: '🟠 ACEPTABLE - Requiere atención', color: MENSAJES_SISTEMA.estados.aceptable.color };
  } else {
    return { texto: '🔴 CRÍTICO - Planeación insuficiente', color: MENSAJES_SISTEMA.estados.critico.color };
  }
}

/**
 * Muestra diálogo de configuración para el reporte
 */
function mostrarDialogoConfiguracionValidacion() {
  const ui = SpreadsheetApp.getUi();
  
  const confirmacion = ui.alert(
    '🎯 Configuración del Reporte de Validación',
    `¿Generar reporte con la configuración CCsoft?\n\n` +
    `📊 CRITERIOS DE VALIDACIÓN:\n` +
    `• Tiempo estimado: Story Points (prioridad) O Horas\n` +
    `• Etiquetas de semana: SEMANA_1 a SEMANA_5\n` +
    `• Fecha de vencimiento requerida y futura\n` +
    `• Alineación fecha-etiqueta validada\n\n` +
    `📅 PERÍODO: Próximas ${CONFIG_VALIDACION_BACKLOG.PERIODO.semanasAdelante} semanas\n` +
    `🔄 INCLUYE: Tareas del backlog Y sprints activos\n` +
    `🎯 PROYECTOS: ${CONFIG_VALIDACION_BACKLOG.EQUIPOS.proyectosPrioritarios.join(', ')}\n\n` +
    `📋 REPORTES: Dashboard, Detalle, Métricas por Equipo, Seguimiento Semanal`,
    ui.ButtonSet.YES_NO
  );
  
  return confirmacion === ui.Button.YES ? {} : null;
}

/**
 * Muestra resumen final de validación
 */
function mostrarResumenValidacionFinal(resumen) {
  const ui = SpreadsheetApp.getUi();
  
  const estadoGeneral = determinarEstadoGeneralValidacion(resumen);
  
  ui.alert(
    '📊 Reporte de Validación de Backlog Completado',
    `${estadoGeneral.texto}\n\n` +
    `📊 RESULTADOS PRINCIPALES:\n` +
    `• Total de tareas: ${resumen.total}\n` +
    `• Válidas completas: ${resumen.validasCompletas} (${resumen.porcentajeValidas}%)\n` +
    `• Sin tiempo estimado: ${resumen.sinTiempoEstimado} (${resumen.porcentajeSinTiempo}%)\n` +
    `• Sin etiqueta semana: ${resumen.sinEtiquetaSemana} (${resumen.porcentajeSinEtiqueta}%)\n` +
    `• Sin fecha vencimiento: ${resumen.sinFechaVencimiento} (${resumen.porcentajeSinFecha}%)\n` +
    `• Fechas desalineadas: ${resumen.fechaDesalineada} (${resumen.porcentajeDesalineada}%)\n\n` +
    `📋 Los reportes detallados están disponibles en las pestañas:\n` +
    `• Dashboard: Resumen ejecutivo\n` +
    `• Detalle: Lista completa de tareas\n` +
    `• Métricas: Análisis por equipo\n` +
    `• Seguimiento: Distribución semanal\n\n` +
    `💡 Use estos datos para mejorar la planeación del backlog.`,
    ui.ButtonSet.OK
  );
}

Logger.log('✅ ValidacionBacklogMain cargado - Función principal lista');