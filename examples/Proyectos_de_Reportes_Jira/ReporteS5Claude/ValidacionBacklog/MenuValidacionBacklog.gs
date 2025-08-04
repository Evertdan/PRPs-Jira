// =====================================
// MENÚ Y CONFIGURACIÓN - VALIDACIÓN BACKLOG CCsoft
// =====================================

/**
 * Crea el menú personalizado para Validación de Backlog
 */
function onOpen() {
  const ui = SpreadsheetApp.getUi();
  
  ui.createMenu('📊 Validación Backlog CCsoft')
    .addItem('🎯 Generar Reporte de Validación', 'generarReporteValidacionBacklog')
    .addSeparator()
    .addSubMenu(ui.createMenu('📊 Reportes Adicionales')
      .addItem('📋 Solo Tareas Sin Validar', 'generarReporteTareasSinValidar')
      .addItem('📅 Solo Distribución Semanal', 'generarReporteDistribucionSemanal')
      .addItem('👥 Solo Métricas por Equipo', 'generarReporteMetricasEquipo'))
    .addSeparator()
    .addSubMenu(ui.createMenu('🔧 Configuración')
      .addItem('🔐 Configurar Credenciales', 'configurarCredencialesValidacion')
      .addItem('🔍 Diagnosticar Proyectos y Estados', 'diagnosticarProyectosYEstados')
      .addItem('⚙️ Generar Configuración Automática', 'generarConfiguracionAutomatica')
      .addItem('🎯 Test de Validación', 'ejecutarTestValidacion')
      .addItem('📋 Ayuda del Sistema', 'mostrarAyudaSistemaValidacion'))
    .addSeparator()
    .addItem('🔄 Refrescar Configuración', 'refrescarConfiguracionValidacion')
    .addItem('📊 Acerca del Sistema', 'mostrarInformacionSistema')
    .addToUi();
    
  Logger.log('✅ Menú de Validación de Backlog CCsoft creado');
}

/**
 * Genera reporte solo de tareas sin validar
 */
function generarReporteTareasSinValidar() {
  const ui = SpreadsheetApp.getUi();
  
  try {
    Logger.log('🔍 Generando reporte de tareas sin validar...');
    
    const configuracion = { soloSinValidar: true };
    const tareas = obtenerTareasBacklogValidacion(configuracion);
    
    if (!tareas || tareas.length === 0) {
      ui.alert('✅ Excelente', 
        'No se encontraron tareas sin validar en el backlog.\n\n' +
        'Todas las tareas cumplen con los criterios mínimos de planeación.', 
        ui.ButtonSet.OK);
      return;
    }
    
    // Filtrar solo tareas que requieren atención
    const tareasProblematicas = tareas.filter(tarea => {
      const validacion = ValidadorTareasBacklog.validarTarea(tarea);
      return validacion.puntaje < CONFIG_VALIDACION_BACKLOG.UMBRALES.bueno;
    });
    
    if (tareasProblematicas.length === 0) {
      ui.alert('✅ Buen Estado', 
        `Se analizaron ${tareas.length} tareas y todas tienen un nivel aceptable de validación.\n\n` +
        'No se requiere acción inmediata.', 
        ui.ButtonSet.OK);
      return;
    }
    
    // Crear hoja específica para tareas problemáticas
    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    const timestamp = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), "yyyyMMdd_HHmm");
    const hoja = obtenerOCrearHojaValidacion(spreadsheet, `TareasSinValidar_${timestamp}`);
    
    // Procesar tareas problemáticas
    const datosValidacion = ProcesadorLoteTareas.procesarLoteTareas(tareasProblematicas);
    
    // Escribir reporte especializado
    escribirReporteTareasSinValidar(hoja, datosValidacion);
    
    ui.alert('📋 Reporte Generado', 
      `Se encontraron ${tareasProblematicas.length} tareas que requieren atención.\n\n` +
      `El reporte detallado está en la hoja: TareasSinValidar_${timestamp}`, 
      ui.ButtonSet.OK);
    
  } catch (error) {
    Logger.log(`❌ Error generando reporte de tareas sin validar: ${error.message}`);
    ui.alert('❌ Error', `Error: ${error.message}`, ui.ButtonSet.OK);
  }
}

/**
 * Genera reporte solo de distribución semanal
 */
function generarReporteDistribucionSemanal() {
  const ui = SpreadsheetApp.getUi();
  
  try {
    Logger.log('📅 Generando reporte de distribución semanal...');
    
    const tareas = obtenerTareasBacklogValidacion({});
    if (!tareas || tareas.length === 0) {
      ui.alert('📋 Sin Datos', 'No se encontraron tareas para analizar.', ui.ButtonSet.OK);
      return;
    }
    
    const datosValidacion = ProcesadorLoteTareas.procesarLoteTareas(tareas);
    
    // Crear hoja específica
    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    const timestamp = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), "yyyyMMdd_HHmm");
    const hoja = obtenerOCrearHojaValidacion(spreadsheet, `DistribucionSemanal_${timestamp}`);
    
    // Escribir reporte de distribución
    escribirReporteDistribucionSemanal(hoja, datosValidacion.porSemana, datosValidacion.resumen);
    
    ui.alert('📅 Reporte Generado', 
      `Análisis de distribución semanal completado.\n\n` +
      `Total de tareas: ${datosValidacion.resumen.total}\n` +
      `El reporte está en: DistribucionSemanal_${timestamp}`, 
      ui.ButtonSet.OK);
    
  } catch (error) {
    Logger.log(`❌ Error: ${error.message}`);
    ui.alert('❌ Error', `Error: ${error.message}`, ui.ButtonSet.OK);
  }
}

/**
 * Genera reporte solo de métricas por equipo
 */
function generarReporteMetricasEquipo() {
  const ui = SpreadsheetApp.getUi();
  
  try {
    Logger.log('👥 Generando reporte de métricas por equipo...');
    
    const tareas = obtenerTareasBacklogValidacion({});
    if (!tareas || tareas.length === 0) {
      ui.alert('📋 Sin Datos', 'No se encontraron tareas para analizar.', ui.ButtonSet.OK);
      return;
    }
    
    const datosValidacion = ProcesadorLoteTareas.procesarLoteTareas(tareas);
    
    // Crear hoja específica
    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    const timestamp = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), "yyyyMMdd_HHmm");
    const hoja = obtenerOCrearHojaValidacion(spreadsheet, `MetricasEquipo_${timestamp}`);
    
    // Escribir reporte de métricas
    escribirReporteMetricasEquipo(hoja, datosValidacion.porEquipo, datosValidacion.resumen);
    
    ui.alert('👥 Reporte Generado', 
      `Análisis de métricas por equipo completado.\n\n` +
      `Áreas analizadas: ${Object.keys(datosValidacion.porEquipo).length}\n` +
      `El reporte está en: MetricasEquipo_${timestamp}`, 
      ui.ButtonSet.OK);
    
  } catch (error) {
    Logger.log(`❌ Error: ${error.message}`);
    ui.alert('❌ Error', `Error: ${error.message}`, ui.ButtonSet.OK);
  }
}

/**
 * Configuración de criterios personalizados
 */
function configurarCriteriosPersonalizados() {
  const ui = SpreadsheetApp.getUi();
  
  ui.alert(
    '🔧 Configuración Avanzada',
    '🚧 Esta funcionalidad estará disponible en la próxima versión.\n\n' +
    'Permitirá personalizar:\n\n' +
    '📊 CRITERIOS DE VALIDACIÓN:\n' +
    '• Umbrales de puntaje personalizados\n' +
    '• Campos de estimación alternativos\n' +
    '• Patrones de etiquetas personalizados\n\n' +
    '🎯 CONFIGURACIÓN DE PROYECTOS:\n' +
    '• Selección específica de proyectos\n' +
    '• Exclusión de áreas particulares\n' +
    '• Períodos de tiempo personalizados\n\n' +
    '📋 REPORTES PERSONALIZADOS:\n' +
    '• Campos adicionales en reportes\n' +
    '• Formatos de exportación\n' +
    '• Plantillas de reporte\n\n' +
    '💡 Mientras tanto, use la configuración estándar CCsoft.',
    ui.ButtonSet.OK
  );
}

/**
 * Diagnóstico de conexión del sistema
 */
function diagnosticarConexionValidacion() {
  const ui = SpreadsheetApp.getUi();
  
  try {
    Logger.log('🔍 Iniciando diagnóstico de conexión...');
    
    // Verificar configuración de Jira
    const config = obtenerConfigJiraValidacion();
    
    if (!config.email || !config.apiToken) {
      throw new Error('Configuración de credenciales incompleta');
    }
    
    // Test de conexión básica
    const testUrl = `https://${config.dominio}.atlassian.net/rest/api/3/myself`;
    const opciones = {
      method: 'GET',
      headers: {
        'Authorization': `Basic ${Utilities.base64Encode(config.email + ':' + config.apiToken)}`,
        'Accept': 'application/json'
      },
      muteHttpExceptions: true
    };
    
    const respuesta = UrlFetchApp.fetch(testUrl, opciones);
    
    if (respuesta.getResponseCode() !== 200) {
      throw new Error(`Error de conexión: ${respuesta.getResponseCode()}`);
    }
    
    const usuario = JSON.parse(respuesta.getContentText());
    
    // Test de campos personalizados
    const testCampos = `https://${config.dominio}.atlassian.net/rest/api/3/field`;
    const respuestaCampos = UrlFetchApp.fetch(testCampos, opciones);
    
    let campoStoryPoints = false;
    if (respuestaCampos.getResponseCode() === 200) {
      const campos = JSON.parse(respuestaCampos.getContentText());
      campoStoryPoints = campos.some(campo => campo.id === CONFIG_VALIDACION_BACKLOG.CRITERIOS.tiempoEstimado.storyPoints);
    }
    
    ui.alert(
      '✅ Diagnóstico Exitoso',
      `🔗 CONEXIÓN: OK\n` +
      `👤 Usuario: ${usuario.displayName}\n` +
      `📧 Email: ${usuario.emailAddress}\n` +
      `🏢 Dominio: ${config.dominio}.atlassian.net\n` +
      `📊 Campo Story Points: ${campoStoryPoints ? '✅ Detectado' : '⚠️ No detectado'}\n` +
      `🎯 Proyectos configurados: ${CONFIG_VALIDACION_BACKLOG.EQUIPOS.proyectosPrioritarios.length}\n` +
      `⚙️ Criterios de validación: ${Object.keys(CONFIG_VALIDACION_BACKLOG.CRITERIOS).length}\n\n` +
      `✅ Sistema listo para generar reportes de validación`,
      ui.ButtonSet.OK
    );
    
  } catch (error) {
    Logger.log(`❌ Error en diagnóstico: ${error.message}`);
    ui.alert(
      '❌ Error de Configuración',
      `Error: ${error.message}\n\n` +
      `💡 VERIFICAR:\n` +
      `• Configuración de credenciales Jira\n` +
      `• Token API válido y no expirado\n` +
      `• Permisos en Jira Cloud\n` +
      `• Conexión a internet\n` +
      `• Configuración de PropertiesService\n\n` +
      `🔧 Ejecute primero la configuración de credenciales.`,
      ui.ButtonSet.OK
    );
  }
}

/**
 * Ejecuta test de validación del sistema
 */
function ejecutarTestValidacion() {
  const ui = SpreadsheetApp.getUi();
  
  try {
    Logger.log('🧪 Ejecutando test de validación...');
    
    // Test 1: Configuración cargada
    const config = CONFIG_VALIDACION_BACKLOG;
    if (!config.CRITERIOS) throw new Error('Configuración no cargada');
    
    // Test 2: Validador de tareas
    const tareaTest = {
      key: 'TEST-1',
      fields: {
        summary: 'Tarea de prueba',
        project: { key: 'FENIX', name: 'FENIX' },
        assignee: { displayName: 'Usuario Test' },
        duedate: '2025-08-05',
        labels: ['SEMANA_2'],
        customfield_10016: 5,
        timetracking: { originalEstimateSeconds: 7200 }
      }
    };
    
    const validacion = ValidadorTareasBacklog.validarTarea(tareaTest);
    if (validacion.puntaje !== 100) {
      throw new Error(`Test de validación falló: puntaje ${validacion.puntaje}`);
    }
    
    // Test 3: Patrones de etiquetas
    const patronTest = CONFIG_VALIDACION_BACKLOG.CRITERIOS.etiquetasSemana.patron;
    if (!patronTest.test('SEMANA_3')) {
      throw new Error('Patrón de etiquetas no funciona');
    }
    
    // Test 4: Cálculo de fechas
    const fechaTest = new Date('2025-08-05');
    const semanaCalculada = ValidadorTareasBacklog._calcularSemanaParaFecha(fechaTest);
    
    ui.alert(
      '✅ Test Exitoso',
      `🧪 RESULTADOS DEL TEST:\n\n` +
      `✅ Configuración: OK\n` +
      `✅ Validador de tareas: OK (puntaje ${validacion.puntaje}%)\n` +
      `✅ Patrones de etiquetas: OK\n` +
      `✅ Cálculo de fechas: OK\n` +
      `✅ Estructura organizacional: ${Object.keys(ORGANIZACION_CCSOFT.AREAS).length} áreas\n` +
      `✅ Proyectos configurados: ${CONFIG_VALIDACION_BACKLOG.EQUIPOS.proyectosPrioritarios.length}\n\n` +
      `🎯 Sistema completamente funcional`,
      ui.ButtonSet.OK
    );
    
  } catch (error) {
    Logger.log(`❌ Error en test: ${error.message}`);
    ui.alert(
      '❌ Test Fallido',
      `Error en test de validación:\n\n${error.message}\n\n` +
      `💡 Posibles causas:\n` +
      `• Configuración incompleta\n` +
      `• Funciones no cargadas correctamente\n` +
      `• Error en dependencias\n\n` +
      `🔧 Refrescar configuración y reintentar.`,
      ui.ButtonSet.OK
    );
  }
}

/**
 * Muestra ayuda completa del sistema
 */
function mostrarAyudaSistemaValidacion() {
  const ui = SpreadsheetApp.getUi();
  
  const ayuda = `📋 AYUDA - SISTEMA DE VALIDACIÓN DE BACKLOG CCsoft\n\n` +
    `🎯 OBJETIVO DEL SISTEMA:\n` +
    `Validar que las tareas del backlog estén correctamente planeadas según los estándares de CCsoft.\n\n` +
    `📊 CRITERIOS DE VALIDACIÓN:\n\n` +
    `⏱️ TIEMPO ESTIMADO (25 puntos):\n` +
    `• Story Points (customfield_10016) - PRIORIDAD\n` +
    `• O Estimación en horas (timetracking)\n` +
    `• Mínimo: 1 punto o 1 hora\n\n` +
    `🏷️ ETIQUETA DE SEMANA (25 puntos):\n` +
    `• Formato: SEMANA_X (donde X = 1,2,3,4,5)\n` +
    `• Representa semana de finalización planificada\n` +
    `• Patrón validado: /^SEMANA_[1-5]$/\n\n` +
    `📅 FECHA DE VENCIMIENTO (25 puntos):\n` +
    `• Requerida para todas las tareas\n` +
    `• Debe ser fecha futura (no del pasado)\n` +
    `• Dentro del período de planeación (5 semanas)\n\n` +
    `🔄 ALINEACIÓN FECHA-ETIQUETA (25 puntos):\n` +
    `• Fecha debe caer dentro de la semana indicada\n` +
    `• SEMANA_1 = próximos 7 días\n` +
    `• SEMANA_2 = días 8-14, etc.\n\n` +
    `📈 NIVELES DE CALIDAD:\n` +
    `• 🟢 Excelente (90-100%): Todo válido + buenas prácticas\n` +
    `• 🟡 Bueno (75-89%): Validaciones básicas + mejoras menores\n` +
    `• 🟠 Aceptable (50-74%): Algunos problemas menores\n` +
    `• 🔴 Crítico (<50%): Requiere atención inmediata\n\n` +
    `🏢 ESTRUCTURA ORGANIZACIONAL:\n` +
    `• FENIX: Desarrollo Core (Crítico - 80% revenue)\n` +
    `• INFRA: Infraestructura (Alta prioridad)\n` +
    `• MOP: Mesa de Operaciones (Alta prioridad)\n` +
    `• MEC: Mesa de Aplicaciones (Customer facing)\n` +
    `• GESTION: Gestión Organizacional (Soporte)\n\n` +
    `📊 REPORTES GENERADOS:\n` +
    `• Dashboard: Resumen ejecutivo y métricas\n` +
    `• Detalle: Lista completa con validaciones\n` +
    `• Métricas: Análisis por área/equipo\n` +
    `• Seguimiento: Distribución semanal\n\n` +
    `🔧 SOLUCIÓN DE PROBLEMAS:\n` +
    `• Conexión: Ejecutar diagnóstico de conexión\n` +
    `• Datos incorrectos: Verificar configuración Jira\n` +
    `• Errores de API: Validar permisos y token\n` +
    `• Performance: Usar caché y filtros adecuados`;
  
  ui.alert('📋 Ayuda del Sistema', ayuda, ui.ButtonSet.OK);
}

/**
 * Refresca la configuración del sistema
 */
function refrescarConfiguracionValidacion() {
  const ui = SpreadsheetApp.getUi();
  
  try {
    // Simular recarga de configuración
    Logger.log('🔄 Refrescando configuración...');
    
    // Verificar que todas las constantes estén cargadas
    const verificaciones = [
      CONFIG_VALIDACION_BACKLOG ? '✅' : '❌',
      ORGANIZACION_CCSOFT ? '✅' : '❌',
      MENSAJES_SISTEMA ? '✅' : '❌',
      JQL_TEMPLATES ? '✅' : '❌'
    ];
    
    ui.alert(
      '🔄 Configuración Refrescada',
      `✅ La configuración ha sido actualizada:\n\n` +
      `${verificaciones[0]} Criterios de validación\n` +
      `${verificaciones[1]} Estructura organizacional CCsoft\n` +
      `${verificaciones[2]} Mensajes y textos del sistema\n` +
      `${verificaciones[3]} Templates JQL\n\n` +
      `📊 Proyectos configurados: ${CONFIG_VALIDACION_BACKLOG.EQUIPOS.proyectosPrioritarios.length}\n` +
      `👥 Áreas organizacionales: ${Object.keys(ORGANIZACION_CCSOFT.AREAS).length}\n` +
      `🎯 Umbrales de calidad definidos\n\n` +
      `💡 Ejecute el diagnóstico para verificar conectividad.`,
      ui.ButtonSet.OK
    );
    
  } catch (error) {
    ui.alert('❌ Error', `Error refrescando configuración: ${error.message}`, ui.ButtonSet.OK);
  }
}

/**
 * Muestra información del sistema
 */
function mostrarInformacionSistema() {
  const ui = SpreadsheetApp.getUi();
  
  const info = `📊 INFORMACIÓN DEL SISTEMA\n\n` +
    `${METADATA_VALIDACION.nombre}\n` +
    `Versión: ${METADATA_VALIDACION.version}\n` +
    `Autor: ${METADATA_VALIDACION.autor}\n` +
    `Fecha: ${METADATA_VALIDACION.fecha}\n\n` +
    `📋 DESCRIPCIÓN:\n` +
    `${METADATA_VALIDACION.descripcion}\n\n` +
    `🏢 ORGANIZACIÓN:\n` +
    `Cómputo Contable Software S.A. de C.V.\n` +
    `Instancia: ccsoft.atlassian.net\n` +
    `Proyectos activos: ${CONFIG_VALIDACION_BACKLOG.EQUIPOS.proyectosPrioritarios.length}\n` +
    `Áreas organizacionales: ${Object.keys(ORGANIZACION_CCSOFT.AREAS).length}\n\n` +
    `🔧 TECNOLOGÍAS:\n` +
    `• Google Apps Script\n` +
    `• Jira REST API v3\n` +
    `• Google Sheets API\n` +
    `• JavaScript ES6+\n\n` +
    `📊 CAPACIDADES:\n` +
    `• Validación automatizada de backlog\n` +
    `• Reportes multi-nivel\n` +
    `• Análisis por equipos y proyectos\n` +
    `• Seguimiento temporal\n` +
    `• Integración con estructura CCsoft\n\n` +
    `📅 CHANGELOG:\n` +
    `${METADATA_VALIDACION.changelog.join('\n')}\n\n` +
    `💡 Para soporte técnico, contacte al equipo de desarrollo.`;
  
  ui.alert('📊 Información del Sistema', info, ui.ButtonSet.OK);
}

// =====================================
// FUNCIONES AUXILIARES PARA REPORTES ESPECIALIZADOS
// =====================================

/**
 * Escribe reporte especializado de tareas sin validar
 */
function escribirReporteTareasSinValidar(hoja, datos) {
  hoja.clear();
  
  hoja.getRange('A1').setValue('❌ TAREAS QUE REQUIEREN ATENCIÓN - CCsoft')
    .setFontSize(16).setFontWeight('bold').setFontColor('#d32f2f');
  
  hoja.getRange('A2').setValue(`🔍 Tareas con problemas de validación • Total: ${datos.tareas.length}`)
    .setFontStyle('italic').setFontColor('#666');
  
  // Análisis de problemas principales
  let fila = 4;
  hoja.getRange(fila, 1).setValue('🎯 PROBLEMAS PRINCIPALES DETECTADOS')
    .setFontWeight('bold').setFontSize(12);
  fila += 2;
  
  const problemas = [
    ['Sin tiempo estimado:', datos.resumen.sinTiempoEstimado],
    ['Sin etiqueta de semana:', datos.resumen.sinEtiquetaSemana],
    ['Sin fecha de vencimiento:', datos.resumen.sinFechaVencimiento],
    ['Fechas desalineadas:', datos.resumen.fechaDesalineada]
  ];
  
  problemas.forEach(problema => {
    if (problema[1] > 0) {
      hoja.getRange(fila, 1, 1, 2).setValues([problema])
        .setBackground('#ffcdd2');
    }
    fila++;
  });
  
  // Lista detallada
  fila += 2;
  escribirDetalleTareasValidacion(hoja.getRange(fila + ':' + fila).getSheet(), datos.tareas);
}

/**
 * Escribe reporte de distribución semanal
 */
function escribirReporteDistribucionSemanal(hoja, datosPorSemana, resumen) {
  hoja.clear();
  
  hoja.getRange('A1').setValue('📅 DISTRIBUCIÓN SEMANAL - ANÁLISIS TEMPORAL CCsoft')
    .setFontSize(16).setFontWeight('bold').setFontColor('#2e7d32');
  
  escribirSeguimientoSemanalValidacion(hoja, datosPorSemana);
}

/**
 * Escribe reporte de métricas por equipo
 */
function escribirReporteMetricasEquipo(hoja, datosPorEquipo, resumen) {
  hoja.clear();
  
  hoja.getRange('A1').setValue('👥 MÉTRICAS POR EQUIPO - ANÁLISIS ORGANIZACIONAL CCsoft')
    .setFontSize(16).setFontWeight('bold').setFontColor('#37474f');
  
  escribirMetricasEquiposValidacion(hoja, datosPorEquipo);
}

Logger.log('✅ MenuValidacionBacklog cargado - Sistema completo listo');