// =====================================
// ESCRITURA DE REPORTES - VALIDACIÓN BACKLOG
// =====================================

/**
 * Escribe el detalle completo de tareas validadas
 */
function escribirDetalleTareasValidacion(hoja, tareas) {
  hoja.clear();
  
  // Título
  hoja.getRange('A1').setValue('📋 DETALLE DE TAREAS - VALIDACIÓN DE BACKLOG CCsoft')
    .setFontSize(16).setFontWeight('bold').setFontColor(CONFIG_FORMATO_SHEETS.colores.header);
  
  hoja.getRange('A2').setValue(`📊 Total de tareas: ${tareas.length} • Generado: ${Utilities.formatDate(new Date(), Session.getScriptTimeZone(), "dd/MM/yyyy HH:mm")}`)
    .setFontStyle('italic').setFontColor('#666');
  
  // Encabezados
  const encabezados = [
    'Clave', 'Resumen', 'Proyecto', 'Área', 'Responsable', 
    'Sprint', 'Fecha Venc.', 'Etiqueta Semana', 'Story Points', 'Horas Est.', 
    'Estado Validación', 'Puntaje (%)', 'Recomendaciones'
  ];
  
  const rangoEncabezados = hoja.getRange(4, 1, 1, encabezados.length);
  rangoEncabezados.setValues([encabezados])
    .setFontWeight('bold')
    .setBackground(CONFIG_FORMATO_SHEETS.colores.header)
    .setFontColor(CONFIG_FORMATO_SHEETS.colores.headerText);
  
  // Aplicar anchos de columna (ajustados para incluir Sprint)
  hoja.setColumnWidth(1, CONFIG_FORMATO_SHEETS.anchos.clave);        // Clave
  hoja.setColumnWidth(2, CONFIG_FORMATO_SHEETS.anchos.resumen);      // Resumen
  hoja.setColumnWidth(3, CONFIG_FORMATO_SHEETS.anchos.proyecto);     // Proyecto
  hoja.setColumnWidth(4, 80);                                        // Área
  hoja.setColumnWidth(5, CONFIG_FORMATO_SHEETS.anchos.responsable);  // Responsable
  hoja.setColumnWidth(6, 120);                                       // Sprint
  hoja.setColumnWidth(7, CONFIG_FORMATO_SHEETS.anchos.fecha);        // Fecha Venc.
  hoja.setColumnWidth(8, CONFIG_FORMATO_SHEETS.anchos.etiqueta);     // Etiqueta Semana
  hoja.setColumnWidth(9, 90);                                        // Story Points
  hoja.setColumnWidth(10, 90);                                       // Horas Est.
  hoja.setColumnWidth(11, CONFIG_FORMATO_SHEETS.anchos.estado);      // Estado Validación
  hoja.setColumnWidth(12, CONFIG_FORMATO_SHEETS.anchos.puntaje);     // Puntaje
  hoja.setColumnWidth(13, CONFIG_FORMATO_SHEETS.anchos.recomendaciones); // Recomendaciones
  
  // Preparar datos de tareas
  const filasDatos = tareas.map(tarea => [
    tarea.key,
    truncarTexto(tarea.fields.summary, 60),
    tarea.fields.project.key,
    obtenerEmojiArea(tarea.area) + ' ' + tarea.area,
    tarea.responsable,
    obtenerSprintTarea(tarea), // ✅ NUEVO: Sprint de la tarea
    tarea.fields.duedate ? formatearFechaCorta(tarea.fields.duedate) : 'Sin fecha',
    tarea.validacion.semanaEtiqueta || 'Sin etiqueta',
    tarea.validacion.tipoTiempo === 'Story Points' ? tarea.validacion.valorTiempo || 0 : '',
    tarea.validacion.tipoTiempo === 'Horas' ? tarea.validacion.valorTiempo || 0 : '',
    `${tarea.validacion.estado.emoji} ${tarea.validacion.estado.texto}`,
    `${tarea.validacion.puntaje}%`,
    tarea.validacion.recomendaciones.slice(0, 2).join('; ') // Máximo 2 recomendaciones
  ]);
  
  // Escribir datos si hay tareas
  if (filasDatos.length > 0) {
    const rangoDatos = hoja.getRange(5, 1, filasDatos.length, encabezados.length);
    rangoDatos.setValues(filasDatos);
    
    // Aplicar colores según estado de validación
    filasDatos.forEach((fila, index) => {
      const filaExcel = 5 + index;
      const tarea = tareas[index];
      
      // Color de fondo para estado (columna 11 ahora)
      hoja.getRange(filaExcel, 11).setBackground(tarea.validacion.estado.color);
      
      // Color de fondo para puntaje (columna 12 ahora)
      const colorPuntaje = obtenerColorPuntaje(tarea.validacion.puntaje);
      hoja.getRange(filaExcel, 12).setBackground(colorPuntaje);
      
      // Alternar colores de filas
      if (index % 2 === 0) {
        hoja.getRange(filaExcel, 1, 1, encabezados.length)
          .setBackground(CONFIG_FORMATO_SHEETS.colores.alternateRow);
      }
    });
    
    // Aplicar bordes
    rangoDatos.setBorder(
      true, true, true, true, true, true, 
      CONFIG_FORMATO_SHEETS.colores.border, 
      SpreadsheetApp.BorderStyle.SOLID
    );
  }
  
  // Congelar filas de encabezados
  hoja.setFrozenRows(4);
}

/**
 * Escribe métricas por equipos/áreas
 */
function escribirMetricasEquiposValidacion(hoja, datosPorEquipo) {
  hoja.clear();
  
  // Título
  hoja.getRange('A1').setValue('👥 MÉTRICAS POR EQUIPOS - VALIDACIÓN DE BACKLOG')
    .setFontSize(16).setFontWeight('bold').setFontColor(CONFIG_FORMATO_SHEETS.colores.header);
  
  hoja.getRange('A2').setValue('📊 Análisis de validación por área organizacional CCsoft')
    .setFontStyle('italic').setFontColor('#666');
  
  // Encabezados de métricas por equipo
  const encabezados = [
    'Área/Equipo', 'Total Tareas', 'Válidas Completas', '% Cumplimiento',
    'Sin Tiempo Est.', 'Sin Etiqueta', 'Sin Fecha Venc.', 'Desalineadas',
    'Estado Equipo', 'Proyectos Involucrados'
  ];
  
  hoja.getRange(4, 1, 1, encabezados.length).setValues([encabezados])
    .setFontWeight('bold')
    .setBackground('#37474f')
    .setFontColor('white');
  
  let fila = 5;
  
  // Ordenar áreas por total de tareas (descendente)
  const areasOrdenadas = Object.keys(datosPorEquipo).sort((a, b) => {
    return datosPorEquipo[b].total - datosPorEquipo[a].total;
  });
  
  areasOrdenadas.forEach(area => {
    const datos = datosPorEquipo[area];
    const porcentaje = datos.total > 0 ? Math.round((datos.validasCompletas / datos.total) * 100) : 0;
    const areaInfo = ORGANIZACION_CCSOFT.AREAS[area];
    
    // Determinar estado del equipo
    const estadoEquipo = determinarEstadoEquipo(porcentaje);
    
    // Contar tareas desalineadas
    const desalineadas = datos.tareas.filter(t => 
      t.validacion.fechaVencimiento && !t.validacion.alineacionFecha
    ).length;
    
    // Lista de proyectos únicos
    const proyectosUnicos = Array.from(datos.proyectos).join(', ');
    
    const filaDatos = [
      `${areaInfo?.emoji || '📋'} ${area}`,
      datos.total,
      datos.validasCompletas,
      `${porcentaje}%`,
      datos.sinTiempoEstimado,
      datos.sinEtiquetaSemana,
      datos.sinFechaVencimiento,
      desalineadas,
      estadoEquipo.texto,
      proyectosUnicos
    ];
    
    hoja.getRange(fila, 1, 1, encabezados.length).setValues([filaDatos]);
    
    // Aplicar colores
    hoja.getRange(fila, 9).setBackground(estadoEquipo.color); // Estado del equipo
    hoja.getRange(fila, 1).setBackground(areaInfo?.color || '#e0e0e0'); // Color del área
    
    fila++;
  });
  
  // Agregar fila de totales
  fila += 1;
  escribirTotalesEquipos(hoja, fila, datosPorEquipo);
  
  hoja.autoResizeColumns(1, encabezados.length);
}

/**
 * Escribe seguimiento semanal de tareas
 */
function escribirSeguimientoSemanalValidacion(hoja, datosPorSemana) {
  hoja.clear();
  
  // Título
  hoja.getRange('A1').setValue('📅 SEGUIMIENTO SEMANAL - DISTRIBUCIÓN DE TAREAS')
    .setFontSize(16).setFontWeight('bold').setFontColor(CONFIG_FORMATO_SHEETS.colores.header);
  
  hoja.getRange('A2').setValue('🗓️ Análisis de distribución temporal por etiquetas SEMANA_X')
    .setFontStyle('italic').setFontColor('#666');
  
  // Encabezados
  const encabezados = [
    'Semana', 'Total Tareas', 'Válidas Completas', '% Cumplimiento',
    'Principales Proyectos', 'Responsables Clave', 'Estado Semana', 'Observaciones'
  ];
  
  hoja.getRange(4, 1, 1, encabezados.length).setValues([encabezados])
    .setFontWeight('bold')
    .setBackground('#2e7d32')
    .setFontColor('white');
  
  let fila = 5;
  
  // Ordenar semanas correctamente (SEMANA_1, SEMANA_2, etc.)
  const semanasOrdenadas = Object.keys(datosPorSemana).sort((a, b) => {
    // Extraer número de semana, tratar 'Sin_Etiqueta' como 999
    const numA = a === 'Sin_Etiqueta' ? 999 : parseInt(a.split('_')[1]) || 999;
    const numB = b === 'Sin_Etiqueta' ? 999 : parseInt(b.split('_')[1]) || 999;
    return numA - numB;
  });
  
  semanasOrdenadas.forEach(semana => {
    const datos = datosPorSemana[semana];
    const porcentaje = datos.total > 0 ? Math.round((datos.validasCompletas / datos.total) * 100) : 0;
    
    // Determinar estado de la semana
    const estadoSemana = determinarEstadoSemana(porcentaje, datos.total);
    
    // Principales proyectos (máximo 3)
    const proyectosUnicos = [...new Set(datos.proyectos)];
    const proyectosPrincipales = proyectosUnicos.slice(0, 3).join(', ') + 
      (proyectosUnicos.length > 3 ? ` (+${proyectosUnicos.length - 3})` : '');
    
    // Responsables clave (máximo 3)
    const responsablesUnicos = [...new Set(datos.responsables.filter(r => r !== 'Sin asignar'))];
    const responsablesClave = responsablesUnicos.slice(0, 3).join(', ') + 
      (responsablesUnicos.length > 3 ? ` (+${responsablesUnicos.length - 3})` : '');
    
    // Observaciones
    const observaciones = generarObservacionesSemana(datos);
    
    const filaDatos = [
      semana === 'Sin_Etiqueta' ? '❌ Sin Etiqueta' : `📅 ${semana}`,
      datos.total,
      datos.validasCompletas,
      `${porcentaje}%`,
      proyectosPrincipales,
      responsablesClave || 'Sin asignar',
      estadoSemana.texto,
      observaciones
    ];
    
    hoja.getRange(fila, 1, 1, encabezados.length).setValues([filaDatos]);
    hoja.getRange(fila, 7).setBackground(estadoSemana.color);
    
    // Resaltar semanas sin etiqueta
    if (semana === 'Sin_Etiqueta') {
      hoja.getRange(fila, 1).setBackground('#ffcdd2');
    }
    
    fila++;
  });
  
  // Agregar análisis de distribución temporal
  fila += 2;
  escribirAnalisisDistribucionTemporal(hoja, fila, datosPorSemana);
  
  hoja.autoResizeColumns(1, encabezados.length);
}

/**
 * Aplica formato general a todas las hojas del reporte
 */
function aplicarFormatoReporteValidacion(hojas) {
  Object.values(hojas).forEach(hoja => {
    try {
      // Congelar filas de encabezados
      if (hoja.getLastRow() >= 4) {
        hoja.setFrozenRows(4);
      }
      
      // Aplicar bordes generales
      const lastRow = hoja.getLastRow();
      const lastCol = hoja.getLastColumn();
      
      if (lastRow > 4 && lastCol > 0) {
        const rangoDatos = hoja.getRange(4, 1, lastRow - 3, lastCol);
        rangoDatos.setBorder(
          true, true, true, true, true, true,
          CONFIG_FORMATO_SHEETS.colores.border,
          SpreadsheetApp.BorderStyle.SOLID
        );
      }
      
      // Configurar zoom y vista
      hoja.getRange('A1').activate();
      
    } catch (error) {
      Logger.log(`⚠️ Error aplicando formato a hoja: ${error.message}`);
    }
  });
}

// =====================================
// FUNCIONES AUXILIARES DE FORMATO
// =====================================

/**
 * Trunca texto a longitud máxima
 */
function truncarTexto(texto, maxLength) {
  if (!texto) return '';
  return texto.length > maxLength ? texto.substring(0, maxLength - 3) + '...' : texto;
}

/**
 * Formatea fecha de manera corta
 */
function formatearFechaCorta(fechaString) {
  try {
    const fecha = new Date(fechaString);
    return Utilities.formatDate(fecha, Session.getScriptTimeZone(), "dd/MM/yy");
  } catch (error) {
    return fechaString;
  }
}

/**
 * Obtiene emoji para área
 */
function obtenerEmojiArea(area) {
  const areaInfo = ORGANIZACION_CCSOFT.AREAS[area];
  return areaInfo ? areaInfo.emoji : '📋';
}

/**
 * Obtiene sprint de una tarea
 */
function obtenerSprintTarea(tarea) {
  try {
    const sprints = tarea.fields.customfield_10020;
    if (sprints && Array.isArray(sprints) && sprints.length > 0) {
      // Tomar el sprint más reciente (último en el array)
      const sprintActual = sprints[sprints.length - 1];
      if (sprintActual && sprintActual.name) {
        // Determinar estado del sprint
        const estado = sprintActual.state;
        let emoji = '';
        if (estado === 'active') emoji = '🔄';
        else if (estado === 'future') emoji = '📅';
        else if (estado === 'closed') emoji = '✅';
        
        return `${emoji} ${truncarTexto(sprintActual.name, 15)}`;
      }
    }
    return '📋 Backlog';
  } catch (error) {
    Logger.log(`⚠️ Error obteniendo sprint para ${tarea.key}: ${error.message}`);
    return '❓ Error';
  }
}

/**
 * Obtiene color para puntaje
 */
function obtenerColorPuntaje(puntaje) {
  const umbrales = CONFIG_VALIDACION_BACKLOG.UMBRALES;
  
  if (puntaje >= umbrales.excelente) return MENSAJES_SISTEMA.estados.excelente.color;
  if (puntaje >= umbrales.bueno) return MENSAJES_SISTEMA.estados.bueno.color;
  if (puntaje >= umbrales.aceptable) return MENSAJES_SISTEMA.estados.aceptable.color;
  return MENSAJES_SISTEMA.estados.critico.color;
}

/**
 * Determina estado de un equipo basado en porcentaje
 */
function determinarEstadoEquipo(porcentaje) {
  if (porcentaje >= 85) return { texto: '🟢 Excelente', color: MENSAJES_SISTEMA.estados.excelente.color };
  if (porcentaje >= 70) return { texto: '🟡 Bueno', color: MENSAJES_SISTEMA.estados.bueno.color };
  if (porcentaje >= 50) return { texto: '🟠 Regular', color: MENSAJES_SISTEMA.estados.aceptable.color };
  return { texto: '🔴 Crítico', color: MENSAJES_SISTEMA.estados.critico.color };
}

/**
 * Determina estado de una semana
 */
function determinarEstadoSemana(porcentaje, totalTareas) {
  if (totalTareas === 0) {
    return { texto: '⚪ Sin tareas', color: '#f5f5f5' };
  }
  
  if (porcentaje >= 85) return { texto: '🟢 Bien planeada', color: MENSAJES_SISTEMA.estados.excelente.color };
  if (porcentaje >= 70) return { texto: '🟡 Mejorable', color: MENSAJES_SISTEMA.estados.bueno.color };
  if (porcentaje >= 50) return { texto: '🟠 Regular', color: MENSAJES_SISTEMA.estados.aceptable.color };
  return { texto: '🔴 Mal planeada', color: MENSAJES_SISTEMA.estados.critico.color };
}

/**
 * Genera observaciones para una semana
 */
function generarObservacionesSemana(datosSemana) {
  const observaciones = [];
  
  const totalTareas = datosSemana.total;
  const tareasValidas = datosSemana.validasCompletas;
  const porcentaje = totalTareas > 0 ? Math.round((tareasValidas / totalTareas) * 100) : 0;
  
  if (totalTareas === 0) {
    return 'Sin tareas asignadas';
  }
  
  if (totalTareas > 15) {
    observaciones.push('Carga alta');
  }
  
  if (porcentaje < 50) {
    observaciones.push('Requiere atención urgente');
  } else if (porcentaje < 70) {
    observaciones.push('Mejorar planeación');
  }
  
  const proyectosUnicos = new Set(datosSemana.proyectos);
  if (proyectosUnicos.size > 4) {
    observaciones.push('Multi-proyecto');
  }
  
  const sinAsignar = datosSemana.responsables.filter(r => r === 'Sin asignar').length;
  if (sinAsignar > 0) {
    observaciones.push(`${sinAsignar} sin asignar`);
  }
  
  return observaciones.length > 0 ? observaciones.join(', ') : 'Normal';
}

/**
 * Escribe totales por equipos
 */
function escribirTotalesEquipos(hoja, fila, datosPorEquipo) {
  const totales = Object.values(datosPorEquipo).reduce((acc, datos) => {
    acc.total += datos.total;
    acc.validasCompletas += datos.validasCompletas;
    acc.sinTiempoEstimado += datos.sinTiempoEstimado;
    acc.sinEtiquetaSemana += datos.sinEtiquetaSemana;
    acc.sinFechaVencimiento += datos.sinFechaVencimiento;
    return acc;
  }, { total: 0, validasCompletas: 0, sinTiempoEstimado: 0, sinEtiquetaSemana: 0, sinFechaVencimiento: 0 });
  
  const porcentajeTotal = totales.total > 0 ? Math.round((totales.validasCompletas / totales.total) * 100) : 0;
  
  hoja.getRange(fila, 1).setValue('📊 TOTALES GENERALES')
    .setFontWeight('bold').setFontSize(12);
  
  const filaTotales = [
    '🎯 TOTAL CCsoft',
    totales.total,
    totales.validasCompletas,
    `${porcentajeTotal}%`,
    totales.sinTiempoEstimado,
    totales.sinEtiquetaSemana,
    totales.sinFechaVencimiento,
    '',
    porcentajeTotal >= 75 ? '🟢 Aceptable' : '🟠 Requiere atención',
    'Todas las áreas'
  ];
  
  hoja.getRange(fila + 1, 1, 1, filaTotales.length).setValues([filaTotales]);
  hoja.getRange(fila + 1, 1, 1, filaTotales.length).setBackground('#e3f2fd').setFontWeight('bold');
}

/**
 * Escribe análisis de distribución temporal
 */
function escribirAnalisisDistribucionTemporal(hoja, fila, datosPorSemana) {
  hoja.getRange(fila, 1).setValue('📈 ANÁLISIS DE DISTRIBUCIÓN TEMPORAL')
    .setFontWeight('bold').setFontSize(12);
  
  fila += 2;
  
  const totalTareas = Object.values(datosPorSemana).reduce((sum, datos) => sum + datos.total, 0);
  
  const semanasValidas = Object.keys(datosPorSemana).filter(s => s !== 'Sin_Etiqueta');
  const tareasConEtiqueta = semanasValidas.reduce((sum, semana) => sum + datosPorSemana[semana].total, 0);
  const tareasSinEtiqueta = datosPorSemana['Sin_Etiqueta']?.total || 0;
  
  const analisis = [
    ['📊 Total de tareas analizadas:', totalTareas],
    ['📅 Tareas con etiqueta semanal:', `${tareasConEtiqueta} (${Math.round((tareasConEtiqueta/totalTareas)*100)}%)`],
    ['❌ Tareas sin etiqueta:', `${tareasSinEtiqueta} (${Math.round((tareasSinEtiqueta/totalTareas)*100)}%)`],
    ['📈 Semanas con tareas:', semanasValidas.length],
    ['🎯 Recomendación:', tareasSinEtiqueta > 0 ? 'Asignar etiquetas a tareas pendientes' : 'Mantener disciplina de etiquetado']
  ];
  
  analisis.forEach((item, index) => {
    hoja.getRange(fila + index, 1, 1, 2).setValues([item]);
  });
}

Logger.log('✅ EscrituraReportes cargado - Funciones de escritura listas');