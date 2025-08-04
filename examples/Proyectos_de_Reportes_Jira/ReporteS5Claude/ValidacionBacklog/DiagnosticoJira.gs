// =====================================
// DIAGNÓSTICO DE JIRA - DETECCIÓN AUTOMÁTICA
// =====================================

/**
 * Diagnostica y detecta automáticamente proyectos y estados de Jira
 */
function diagnosticarProyectosYEstados() {
  const ui = SpreadsheetApp.getUi();
  
  try {
    Logger.log('🔍 Iniciando diagnóstico automático de Jira...');
    
    const config = obtenerConfigJiraValidacion();
    
    // Obtener proyectos disponibles
    const proyectos = obtenerProyectosDisponibles(config);
    
    // Obtener estados disponibles
    const estados = obtenerEstadosDisponibles(config);
    
    // Crear reporte de diagnóstico
    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    const timestamp = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), "yyyyMMdd_HHmm");
    const hoja = obtenerOCrearHojaValidacion(spreadsheet, `DiagnosticoJira_${timestamp}`);
    
    escribirReporteDiagnostico(hoja, proyectos, estados);
    
    // Mostrar resumen
    const proyectosEncontrados = proyectos.filter(p => 
      ['FENIX', 'BDMS', 'INFLYV', 'MAAC', 'VYP', 'IAO', 'DC', 'DTO', 'DT', 'IP'].includes(p.key)
    );
    
    ui.alert(
      '🔍 Diagnóstico Completado',
      `📊 RESULTADOS:\n\n` +
      `🎯 Proyectos encontrados: ${proyectos.length}\n` +
      `✅ Proyectos CCsoft detectados: ${proyectosEncontrados.length}/10\n` +
      `📋 Estados disponibles: ${estados.length}\n\n` +
      `📋 Proyectos CCsoft encontrados:\n` +
      `${proyectosEncontrados.map(p => `• ${p.key}: ${p.name}`).join('\n')}\n\n` +
      `📄 Reporte detallado en: DiagnosticoJira_${timestamp}\n\n` +
      `💡 Use esta información para actualizar la configuración.`,
      ui.ButtonSet.OK
    );
    
  } catch (error) {
    Logger.log(`❌ Error en diagnóstico: ${error.message}`);
    ui.alert(
      '❌ Error de Diagnóstico',
      `Error obteniendo información de Jira:\n\n${error.message}\n\n` +
      `💡 Verificar:\n` +
      `• Credenciales configuradas correctamente\n` +
      `• Permisos en Jira\n` +
      `• Conexión a internet`,
      ui.ButtonSet.OK
    );
  }
}

/**
 * Obtiene lista de proyectos disponibles en Jira
 */
function obtenerProyectosDisponibles(config) {
  const url = `https://${config.dominio}.atlassian.net/rest/api/3/project/search?maxResults=100`;
  
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
    throw new Error(`Error obteniendo proyectos: ${respuesta.getResponseCode()} - ${respuesta.getContentText()}`);
  }
  
  const datos = JSON.parse(respuesta.getContentText());
  
  return datos.values.map(proyecto => ({
    key: proyecto.key,
    name: proyecto.name,
    id: proyecto.id,
    projectTypeKey: proyecto.projectTypeKey
  }));
}

/**
 * Obtiene lista de estados disponibles en Jira
 */
function obtenerEstadosDisponibles(config) {
  const url = `https://${config.dominio}.atlassian.net/rest/api/3/status`;
  
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
    throw new Error(`Error obteniendo estados: ${respuesta.getResponseCode()} - ${respuesta.getContentText()}`);
  }
  
  const datos = JSON.parse(respuesta.getContentText());
  
  return datos.map(estado => ({
    id: estado.id,
    name: estado.name,
    statusCategory: estado.statusCategory.name
  }));
}

/**
 * Escribe reporte de diagnóstico en hoja
 */
function escribirReporteDiagnostico(hoja, proyectos, estados) {
  hoja.clear();
  
  // Título
  hoja.getRange('A1').setValue('🔍 DIAGNÓSTICO DE JIRA - PROYECTOS Y ESTADOS')
    .setFontSize(16).setFontWeight('bold').setFontColor('#1565c0');
  
  hoja.getRange('A2').setValue(`📅 Generado: ${Utilities.formatDate(new Date(), Session.getScriptTimeZone(), "dd/MM/yyyy HH:mm")}`)
    .setFontStyle('italic').setFontColor('#666');
  
  // Sección de proyectos
  let fila = 4;
  hoja.getRange(fila, 1).setValue('🎯 PROYECTOS DISPONIBLES')
    .setFontSize(14).setFontWeight('bold');
  fila += 2;
  
  // Encabezados de proyectos
  const encabezadosProyectos = ['Clave', 'Nombre', 'ID', 'Tipo', 'Estado CCsoft'];
  hoja.getRange(fila, 1, 1, encabezadosProyectos.length).setValues([encabezadosProyectos])
    .setFontWeight('bold').setBackground('#1565c0').setFontColor('white');
  fila++;
  
  // Datos de proyectos
  const proyectosCCsoft = ['FENIX', 'BDMS', 'INFLYV', 'MAAC', 'VYP', 'IAO', 'DC', 'DTO', 'DT', 'IP', 'OM', 'PMO', 'RCP', 'SGC', 'SIB', 'TH', 'WEB'];
  
  proyectos.forEach(proyecto => {
    const esCCsoft = proyectosCCsoft.includes(proyecto.key);
    const estado = esCCsoft ? '✅ CCsoft' : '⚪ Otro';
    
    const filaProyecto = [
      proyecto.key,
      proyecto.name,
      proyecto.id,
      proyecto.projectTypeKey,
      estado
    ];
    
    hoja.getRange(fila, 1, 1, encabezadosProyectos.length).setValues([filaProyecto]);
    
    if (esCCsoft) {
      hoja.getRange(fila, 5).setBackground('#d4edda');
    }
    
    fila++;
  });
  
  // Sección de estados
  fila += 2;
  hoja.getRange(fila, 1).setValue('📋 ESTADOS DISPONIBLES')
    .setFontSize(14).setFontWeight('bold');
  fila += 2;
  
  // Encabezados de estados
  const encabezadosEstados = ['ID', 'Nombre', 'Categoría', 'Uso Sugerido'];
  hoja.getRange(fila, 1, 1, encabezadosEstados.length).setValues([encabezadosEstados])
    .setFontWeight('bold').setBackground('#2e7d32').setFontColor('white');
  fila++;
  
  // Datos de estados
  estados.forEach(estado => {
    let usoSugerido = '';
    if (estado.statusCategory === 'To Do') usoSugerido = '📝 Para hacer';
    else if (estado.statusCategory === 'In Progress') usoSugerido = '🔄 En progreso';
    else if (estado.statusCategory === 'Done') usoSugerido = '✅ Terminado';
    
    const filaEstado = [
      estado.id,
      estado.name,
      estado.statusCategory,
      usoSugerido
    ];
    
    hoja.getRange(fila, 1, 1, encabezadosEstados.length).setValues([filaEstado]);
    fila++;
  });
  
  // Recomendaciones
  fila += 2;
  hoja.getRange(fila, 1).setValue('💡 RECOMENDACIONES DE CONFIGURACIÓN')
    .setFontSize(14).setFontWeight('bold');
  fila += 2;
  
  const proyectosEncontrados = proyectos.filter(p => proyectosCCsoft.includes(p.key));
  const estadosTerminados = estados.filter(e => e.statusCategory === 'Done');
  
  const recomendaciones = [
    `✅ Proyectos CCsoft encontrados: ${proyectosEncontrados.map(p => p.key).join(', ')}`,
    `📋 Estados para excluir (terminados): ${estadosTerminados.map(e => e.name).join(', ')}`,
    '',
    '🔧 CONFIGURACIÓN SUGERIDA:',
    `proyectosPrioritarios: [${proyectosEncontrados.slice(0, 5).map(p => `"${p.key}"`).join(', ')}]`,
    `estadosExcluir: [${estadosTerminados.slice(0, 5).map(e => `"${e.name}"`).join(', ')}]`
  ];
  
  recomendaciones.forEach(rec => {
    hoja.getRange(fila, 1).setValue(rec);
    if (rec.startsWith('🔧') || rec.startsWith('proyectosPrioritarios') || rec.startsWith('estadosExcluir')) {
      hoja.getRange(fila, 1).setBackground('#fff3cd').setFontWeight('bold');
    }
    fila++;
  });
  
  hoja.autoResizeColumns(1, 5);
}

/**
 * Genera configuración automática basada en diagnóstico
 */
function generarConfiguracionAutomatica() {
  const ui = SpreadsheetApp.getUi();
  
  try {
    Logger.log('⚙️ Generando configuración automática...');
    
    const config = obtenerConfigJiraValidacion();
    
    // Obtener datos de Jira
    const proyectos = obtenerProyectosDisponibles(config);
    const estados = obtenerEstadosDisponibles(config);
    
    // Filtrar proyectos CCsoft
    const proyectosCCsoft = ['FENIX', 'BDMS', 'INFLYV', 'MAAC', 'VYP', 'IAO', 'DC', 'DTO', 'DT', 'IP'];
    const proyectosEncontrados = proyectos.filter(p => proyectosCCsoft.includes(p.key));
    
    // Filtrar estados terminados
    const estadosTerminados = estados.filter(e => e.statusCategory === 'Done');
    
    // Crear configuración
    const configuracionGenerada = {
      proyectosPrioritarios: proyectosEncontrados.map(p => p.key),
      estadosExcluir: estadosTerminados.map(e => e.name),
      fecha: new Date().toISOString()
    };
    
    // Mostrar configuración
    const configuracionTexto = 
      `📊 CONFIGURACIÓN GENERADA AUTOMÁTICAMENTE:\n\n` +
      `🎯 Proyectos encontrados: ${configuracionGenerada.proyectosPrioritarios.length}\n` +
      `${configuracionGenerada.proyectosPrioritarios.join(', ')}\n\n` +
      `📋 Estados a excluir: ${configuracionGenerada.estadosExcluir.length}\n` +
      `${configuracionGenerada.estadosExcluir.join(', ')}\n\n` +
      `⚙️ Para aplicar esta configuración:\n` +
      `1. Ejecutar 'aplicarConfiguracionAutomatica()'\n` +
      `2. O actualizar manualmente CONFIG_VALIDACION_BACKLOG\n\n` +
      `¿Aplicar configuración automáticamente?`;
    
    const respuesta = ui.alert(
      '⚙️ Configuración Automática',
      configuracionTexto,
      ui.ButtonSet.YES_NO
    );
    
    if (respuesta === ui.Button.YES) {
      aplicarConfiguracionDetectada(configuracionGenerada);
      ui.alert('✅ Configuración Aplicada', 
        'La configuración automática ha sido aplicada.\n\n' +
        '🔄 Refrescar la página y probar generar un reporte.', 
        ui.ButtonSet.OK);
    }
    
  } catch (error) {
    Logger.log(`❌ Error generando configuración: ${error.message}`);
    ui.alert('❌ Error', `Error: ${error.message}`, ui.ButtonSet.OK);
  }
}

/**
 * Aplica configuración detectada automáticamente
 */
function aplicarConfiguracionDetectada(configuracion) {
  // Guardar en PropertiesService para uso posterior
  const propiedades = PropertiesService.getScriptProperties();
  propiedades.setProperty('CONFIG_AUTO_PROYECTOS', JSON.stringify(configuracion.proyectosPrioritarios));
  propiedades.setProperty('CONFIG_AUTO_ESTADOS', JSON.stringify(configuracion.estadosExcluir));
  propiedades.setProperty('CONFIG_AUTO_FECHA', configuracion.fecha);
  
  Logger.log('✅ Configuración automática guardada en PropertiesService');
}

/**
 * Obtiene configuración automática guardada
 */
function obtenerConfiguracionAutomatica() {
  const propiedades = PropertiesService.getScriptProperties();
  
  const proyectos = propiedades.getProperty('CONFIG_AUTO_PROYECTOS');
  const estados = propiedades.getProperty('CONFIG_AUTO_ESTADOS');
  
  if (proyectos && estados) {
    return {
      proyectosPrioritarios: JSON.parse(proyectos),
      estadosExcluir: JSON.parse(estados)
    };
  }
  
  return null;
}

Logger.log('✅ DiagnosticoJira cargado - Funciones de detección automática listas');