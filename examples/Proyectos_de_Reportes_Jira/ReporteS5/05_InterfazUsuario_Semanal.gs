// =====================================
// ARCHIVO 5: INTERFAZ DE USUARIO Y MENÚS PARA REPORTES DE WORKLOG
// =====================================

/**
 * ✅ Se ejecuta cuando el usuario abre la hoja de cálculo
 * Crea menús personalizados optimizados para reportes de worklog
 */
function onOpen() {
  const ui = SpreadsheetApp.getUi();
  
  // Menú principal de reportes de worklog
  ui.createMenu('📊 Reportes de Horas (Worklog)')
    .addItem('🔐 Configurar Credenciales', 'configurarCredencialesJiraSemanal')
    .addItem('🧪 Probar Conexión', 'verificarConexionJiraSemanal')
    .addSeparator()
    .addItem('📅 Reporte Personalizado por Fechas', 'generarReportePersonalizado')
    .addItem('👤 Reporte por Persona', 'generarReportePorPersona')
    .addItem('🏢 Reporte por Área', 'generarReportePorArea')
    .addItem('🚀 Reporte por Sprint', 'generarReportePorSprint')
    .addItem('📊 Reporte del Mes Actual', 'generarReporteSemanalCompleto')
    .addSeparator()
    .addItem('📅 Programar Reporte Automático', 'programarReporteAutomaticoSemanal')
    .addItem('🔄 Cancelar Reportes Automáticos', 'cancelarReportesAutomaticos')
    .addSeparator()
    .addItem('🧹 Limpiar Caché', 'limpiarTodoElCacheSemanal')
    .addSeparator()
    .addItem('📖 Ayuda y Documentación', 'mostrarAyudaCompletaSemanal')
    .addToUi();

  // Menú de herramientas de reporte
  ui.createMenu('🛠️ Herramientas de Reporte')
    .addItem('🔄 Reorganizar por Semanas', 'reorganizarReportePorSemanas')
    .addToUi();

  // Menú de administración avanzada
  ui.createMenu('⚙️ Administración')
    .addItem('🔄 Actualizar Menús', 'actualizarMenus')
    .addItem('🔍 Diagnosticar Menús', 'diagnosticarMenus')
    .addSeparator()
    .addItem('📊 Ver Estadísticas de Caché', 'mostrarEstadisticasCacheSemanal')
    .addItem('🧹 Limpiar Caché Expirado', 'limpiarCacheExpiradoSemanal')
    .addItem('🗑️ Limpiar Todo el Caché', 'limpiarTodoElCacheSemanal')
    .addSeparator()
    .addItem('🚨 Ver Errores Críticos', 'mostrarErroresCriticosSemanal')
    .addItem('🧹 Limpiar Errores Críticos', 'limpiarErroresCriticosSemanal')
    .addSeparator()
    .addItem('👥 Verificar Filtro de Equipo', 'verificarFiltroPersonasEquipo')
    .addItem('🔍 Validar Sistema Filtrado Completo', 'validarSistemaFiltradoCompleto')
    .addSeparator()
    .addItem('💾 Crear Backup de Configuración', 'crearBackupConfiguracionSemanal')
    .addItem('🔄 Restaurar Configuración', 'restaurarConfiguracionSemanal')
    .addSeparator()
    .addItem('🔧 Reset Completo del Sistema', 'resetCompletoSistemaSemanal')
    .addSeparator()
    .addItem('🧪 Validar Sistema (Paso a Paso)', 'validarSistemaCompletoSemanal')
    .addToUi();
}

/**
 * ✅ NUEVA: Función para forzar actualización del menú
 */
function actualizarMenus() {
  const ui = SpreadsheetApp.getUi();
  
  try {
    Logger.log('🔄 [MENU] Forzando actualización de menús...');
    
    onOpen();
    
    ui.alert(
      'Menús Actualizados',
      '✅ Los menús han sido actualizados para el sistema de worklog.',
      ui.ButtonSet.OK
    );
    
    Logger.log('✅ [MENU] Menús actualizados exitosamente');
    
  } catch (error) {
    Logger.log(`❌ [MENU] Error actualizando menús: ${error.message}`);
    ui.alert(
      'Error Actualizando Menús',
      `❌ No se pudieron actualizar los menús.\n\n${error.message}`,
      ui.ButtonSet.OK
    );
  }
}

/**
 * ✅ NUEVA: Función para diagnosticar problemas de menú
 */
function diagnosticarMenus() {
  const ui = SpreadsheetApp.getUi();
  
  try {
    Logger.log('🔍 [DIAGNOSTICO] Iniciando diagnóstico de menús...');
    
    let diagnostico = '🔍 DIAGNÓSTICO DE MENÚS\n\n';
    
    try {
      if (typeof generarReportePersonalizado === 'function') {
        diagnostico += '✅ Función generarReportePersonalizado: Existe\n';
      } else {
        diagnostico += '❌ Función generarReportePersonalizado: No existe\n';
      }
    } catch (e) {
      diagnostico += `❌ Función generarReportePersonalizado: Error - ${e.message}\n`;
    }
    
    try {
      if (typeof onOpen === 'function') {
        diagnostico += '✅ Función onOpen: Existe\n';
      } else {
        diagnostico += '❌ Función onOpen: No existe\n';
      }
    } catch (e) {
      diagnostico += `❌ Función onOpen: Error - ${e.message}\n`;
    }
    
    diagnostico += '\n📋 RECOMENDACIONES:\n';
    diagnostico += '1. Usar "🔄 Actualizar Menús" en Administración\n';
    diagnostico += '2. Cerrar y reabrir la hoja de cálculo\n';
    
    ui.alert('Diagnóstico de Menús', diagnostico, ui.ButtonSet.OK);
    
    Logger.log('✅ [DIAGNOSTICO] Diagnóstico de menús completado');
    
  } catch (error) {
    Logger.log(`❌ [DIAGNOSTICO] Error: ${error.message}`);
    ui.alert(
      'Error en Diagnóstico',
      `❌ Error ejecutando diagnóstico de menús.\n\n${error.message}`,
      ui.ButtonSet.OK
    );
  }
}

/**
 * ✅ Verifica conexión con Jira y muestra resultado al usuario
 */
function verificarConexionJiraSemanal() {
  const ui = SpreadsheetApp.getUi();
  
  try {
    Logger.log('🔍 [SEMANAL] Verificando conexión con Jira...');
    
    ui.showModalDialog(
      HtmlService.createHtmlOutput('<p>🔄 Verificando conexión con Jira...</p><p>Por favor espera...</p>')
        .setWidth(400).setHeight(100),
      'Verificando Conexión'
    );
    
    const resultado = probarConexionJiraSemanal();
    
    ui.alert(
      'Verificación de Conexión',
      resultado,
      ui.ButtonSet.OK
    );
    
  } catch (error) {
    Logger.log(`❌ [SEMANAL] Error verificando conexión: ${error.message}`);
    ui.alert(
      'Error de Conexión',
      `❌ No se pudo conectar con Jira.\n\n` +
      `🔍 Error: ${error.message}\n\n` +
      `💡 Soluciones:\n` +
      `• Verifica tus credenciales usando "🔐 Configurar Credenciales"\n` +
      `• Confirma que el dominio sea correcto\n` +
      `• Verifica tu conectividad a internet\n` +
      `• Asegúrate de que el API Token sea válido`,
      ui.ButtonSet.OK
    );
  }
}

/**
 * ✅ Programa ejecución automática de reportes semanales
 */
function programarReporteAutomaticoSemanal() {
  const ui = SpreadsheetApp.getUi();
  
  const respuesta = ui.alert(
    'Programar Reporte Automático',
    '📅 ¿Cómo quieres programar los reportes automáticos?\n\n' +
    '✅ SÍ = Reporte semanal (cada lunes)\n' +
    '🔄 NO = Reporte mensual (primer día del mes)\n' +
    '❌ CANCELAR = No programar',
    ui.ButtonSet.YES_NO_CANCEL
  );
  
  if (respuesta === ui.Button.CANCEL) {
    return;
  }
  
  try {
    const triggers = ScriptApp.getProjectTriggers();
    triggers.forEach(trigger => {
      if (trigger.getHandlerFunction() === 'ejecutarReporteAutomaticoSemanal') {
        ScriptApp.deleteTrigger(trigger);
      }
    });
    
    if (respuesta === ui.Button.YES) {
      ScriptApp.newTrigger('ejecutarReporteAutomaticoSemanal')
        .timeBased()
        .everyWeeks(1)
        .onWeekDay(ScriptApp.WeekDay.MONDAY)
        .atHour(8)
        .create();
      
      ui.alert(
        'Reporte Programado',
        '✅ Reporte semanal programado exitosamente!\n\n' +
        '📅 Se ejecutará cada lunes a las 8:00 AM',
        ui.ButtonSet.OK
      );
      
    } else {
      ScriptApp.newTrigger('ejecutarReporteAutomaticoSemanal')
        .timeBased()
        .everyMonths(1)
        .onMonthDay(1)
        .atHour(8)
        .create();
      
      ui.alert(
        'Reporte Programado',
        '✅ Reporte mensual programado exitosamente!\n\n' +
        '📅 Se ejecutará el primer día de cada mes a las 8:00 AM',
        ui.ButtonSet.OK
      );
    }
    
    Logger.log('✅ [SEMANAL] Reporte automático programado exitosamente');
    
  } catch (error) {
    Logger.log(`❌ [SEMANAL] Error programando reporte automático: ${error.message}`);
    ui.alert(
      'Error de Programación',
      `❌ No se pudo programar el reporte automático.\n\n` +
      `🔍 Error: ${error.message}`,
      ui.ButtonSet.OK
    );
  }
}

/**
 * ✅ Función que ejecuta el reporte automático (llamada por trigger)
 */
async function ejecutarReporteAutomaticoSemanal() {
  try {
    Logger.log('🤖 [SEMANAL] Ejecutando reporte automático...');
    
    const opciones = {
      esAutomatico: true,
      notificarPorEmail: true
    };
    
    const exito = await generarReporteSemanalCompleto(opciones);
    
    if (exito) {
      Logger.log('✅ [SEMANAL] Reporte automático generado exitosamente');
    }
    
  } catch (error) {
    ErrorManagerSemanal.registrarError(
      'Error en reporte automático semanal',
      error,
      'REPORTE_AUTOMATICO',
      'CRITICAL'
    );
  }
}

/**
 * ✅ Cancela todos los reportes automáticos programados
 */
function cancelarReportesAutomaticos() {
  const ui = SpreadsheetApp.getUi();
  
  const confirmacion = ui.alert(
    'Cancelar Reportes Automáticos',
    '⚠️ ¿Estás seguro de que quieres cancelar todos los reportes automáticos?',
    ui.ButtonSet.YES_NO
  );
  
  if (confirmacion === ui.Button.YES) {
    try {
      const triggers = ScriptApp.getProjectTriggers();
      let eliminados = 0;
      
      triggers.forEach(trigger => {
        if (trigger.getHandlerFunction() === 'ejecutarReporteAutomaticoSemanal') {
          ScriptApp.deleteTrigger(trigger);
          eliminados++;
        }
      });
      
      ui.alert(
        'Reportes Cancelados',
        `✅ Se cancelaron ${eliminados} programaciones de reportes automáticos.`,
        ui.ButtonSet.OK
      );
      
      Logger.log(`✅ [SEMANAL] ${eliminados} reportes automáticos cancelados`);
      
    } catch (error) {
      Logger.log(`❌ [SEMANAL] Error cancelando reportes automáticos: ${error.message}`);
      ui.alert(
        'Error',
        `❌ No se pudieron cancelar los reportes automáticos.\n\n${error.message}`,
        ui.ButtonSet.OK
      );
    }
  }
}

/**
 * ✅ Muestra configuración completa del sistema
 */
function mostrarConfiguracionCompletaSemanal() {
  const ui = SpreadsheetApp.getUi();
  
  try {
    const config = obtenerConfigJiraSemanal();
    const triggers = ScriptApp.getProjectTriggers().filter(t => 
      t.getHandlerFunction() === 'ejecutarReporteAutomaticoSemanal'
    );
    
    let mensaje = '⚙️ CONFIGURACIÓN ACTUAL DEL SISTEMA\n\n';
    mensaje += `🌐 Dominio: ${config.dominio}.atlassian.net\n`;
    mensaje += `📧 Email: ${config.email}\n`;
    mensaje += `🔑 Token: ${'●'.repeat(12)}\n\n`;
    
    mensaje += '📊 CONFIGURACIÓN DE REPORTES:\n';
    mensaje += `   • Basado en Worklog: ✅ Sí\n`;
    mensaje += `   • Días por defecto para reporte: ${CONFIG_SEMANAL.diasParaReporte}\n\n`;
    
    mensaje += '🤖 REPORTES AUTOMÁTICOS:\n';
    mensaje += `📅 Programados: ${triggers.length}\n`;
    if (triggers.length > 0) {
      triggers.forEach(trigger => {
        mensaje += `   • ${trigger.getEventType()}: ${trigger.toString()}\n`;
      });
    }
    mensaje += '\n';
    
    mensaje += `📊 Versión: ${SCRIPT_METADATA.version}\n`;
    mensaje += `📅 Última actualización: ${SCRIPT_METADATA.fecha}`;
    
    ui.alert('Configuración del Sistema', mensaje, ui.ButtonSet.OK);
    
  } catch (error) {
    Logger.log(`❌ [SEMANAL] Error mostrando configuración: ${error.message}`);
    ui.alert(
      'Error',
      '❌ Las credenciales no están configuradas.\n\n' +
      'Ve al menú "📊 Reportes de Horas (Worklog)" → "🔐 Configurar Credenciales"',
      ui.ButtonSet.OK
    );
  }
}

/**
 * ✅ Ejecuta diagnóstico completo del sistema semanal
 */
function ejecutarDiagnosticoCompletoSemanal() {
  const ui = SpreadsheetApp.getUi();
  
  try {
    Logger.log('🔧 [SEMANAL] Iniciando diagnóstico completo del sistema...');
    
    let reporte = `🔧 DIAGNÓSTICO SISTEMA - ${new Date().toLocaleString()}\n\n`;
    
    reporte += '1️⃣ CONFIGURACIÓN:\n';
    try {
      const config = obtenerConfigJiraSemanal();
      reporte += `   • Dominio: ✅ ${config.dominio}.atlassian.net\n`;
      reporte += `   • Email: ✅ ${config.email}\n`;
    } catch (error) {
      reporte += `   • Configuración: ❌ ${error.message}\n`;
    }
    reporte += '\n';
    
    reporte += '2️⃣ CONECTIVIDAD:\n';
    try {
      const startTime = new Date().getTime();
      probarConexionJiraSemanal();
      const endTime = new Date().getTime();
      reporte += `   • Conexión: ✅ Exitosa (${endTime - startTime}ms)\n`;
    } catch (error) {
      reporte += `   • Conexión: ❌ ${error.message}\n`;
    }
    reporte += '\n';
    
    reporte += `📊 Sistema: ${SCRIPT_METADATA.nombre} v${SCRIPT_METADATA.version}\n`;
    
    ui.alert('Diagnóstico Completo del Sistema', reporte, ui.ButtonSet.OK);
    
  } catch (error) {
    Logger.log(`❌ [SEMANAL] Error en diagnóstico: ${error.message}`);
    ui.alert(
      'Error de Diagnóstico',
      `❌ Error ejecutando diagnóstico completo:\n${error.message}`,
      ui.ButtonSet.OK
    );
  }
}

/**
 * ✅ Muestra ayuda completa del sistema
 */
function mostrarAyudaCompletaSemanal() {
  const ui = SpreadsheetApp.getUi();
  
  let mensaje = `📖 AYUDA - ${SCRIPT_METADATA.nombre} v${SCRIPT_METADATA.version}\n\n`;
  
  mensaje += '🚀 GUÍA DE INICIO RÁPIDO:\n';
  mensaje += '1. 🔐 Configurar Credenciales - Configura tu API token\n';
  mensaje += '2. 🧪 Probar Conexión - Verifica que funcione\n';
  mensaje += '3. 📅 Generar Reporte - Crea tu primer reporte por fechas\n\n';
  
  mensaje += '⚙️ CÓMO FUNCIONA:\n';
  mensaje += 'El sistema se basa 100% en los registros de trabajo (worklogs) de Jira.\n';
  mensaje += 'No necesitas usar etiquetas especiales como SEMANA_X.\n\n';
  
  mensaje += '📊 TIPOS DE REPORTE:\n';
  mensaje += '• 📅 Personalizado: Elige un rango de fechas para el reporte.\n';
  mensaje += '• 👤 Por Persona: Filtra los registros de una persona específica.\n';
  mensaje += '• 🏢 Por Departamento: Agrupa los resultados por departamento.\n';
  mensaje += '• 📊 Mes Actual: Un reporte rápido de todo el mes en curso.\n\n';
  
  mensaje += '💡 CONSEJOS:\n';
  mensaje += '• Asegúrate de que tu equipo registre sus horas (worklogs) en Jira.\n';
  mensaje += '• Mantén la lista del equipo CCSOFT actualizada en el script de configuración.\n\n';
  
  mensaje += `📞 INFORMACIÓN TÉCNICA:\n`;
  mensaje += `• Versión: ${SCRIPT_METADATA.version}\n`;
  mensaje += `• Fecha: ${SCRIPT_METADATA.fecha}\n`;
  mensaje += `• Autor: ${SCRIPT_METADATA.autor}`;
  
  ui.alert('Ayuda Completa del Sistema', mensaje, ui.ButtonSet.OK);
}

/**
 * ✅ NUEVA: Genera reporte semanal por persona específica
 */
async function generarReportePorSprint() {
  const ui = SpreadsheetApp.getUi();
  
  try {
    Logger.log('🚀 [SPRINT] Iniciando reporte por sprint...');
    
    if (!verificarCredencialesJiraSemanal()) {
      ui.alert('Configuración Requerida', 'Las credenciales no están configuradas.', ui.ButtonSet.OK);
      return;
    }
    
    const sprintId = await mostrarDialogoSprint();
    
    if (sprintId) {
      const opciones = { sprintId: sprintId };
      await generarReporteSemanalCompleto(opciones);
    }
    
  } catch (error) {
    Logger.log(`❌ [SPRINT] Error: ${error.message}`);
    ui.alert('Error Generando Reporte', `No se pudo generar el reporte por sprint.\n\n${error.message}`, ui.ButtonSet.OK);
  }
}

async function generarReportePorPersona() {
  const ui = SpreadsheetApp.getUi();
  
  try {
    Logger.log('👤 [PERSONA] Iniciando generación de reporte por persona...');
    
    if (!verificarCredencialesJiraSemanal()) {
      ui.alert('Configuración Requerida', 'Las credenciales no están configuradas.', ui.ButtonSet.OK);
      return;
    }
    
    // ✅ CORRECCIÓN: Usar EQUIPO_CCSOFT como la fuente de verdad directa.
    const equipoParaSidebar = EQUIPO_CCSOFT.map(p => {
      return { 
        displayName: p.nombre, 
        accountId: p.accountId, 
        rol: p.rol 
      };
    }).sort((a, b) => a.displayName.localeCompare(b.displayName));

    if (equipoParaSidebar.length === 0) {
      ui.alert('Sin Personal del Equipo', 'La constante EQUIPO_CCSOFT está vacía o no se pudo leer.', ui.ButtonSet.OK);
      return;
    }
    
    const template = HtmlService.createTemplateFromFile('Sidebar');
    template.personas = equipoParaSidebar;
    const html = template.evaluate().setTitle('Reporte por Persona');
    ui.showSidebar(html);
    
  } catch (error) {
    Logger.log(`❌ [PERSONA] Error: ${error.message}`);
    ui.alert('Error Generando Reporte', `No se pudo generar el reporte por persona.\n\n${error.message}`, ui.ButtonSet.OK);
  }
}

async function obtenerSprintsDeJira() {
  try {
    const config = obtenerConfigJiraSemanal();
    const url = `https://${config.dominio}.atlassian.net/rest/agile/1.0/board/1/sprint`; // Reemplaza 1 con el ID de tu tablero
    const options = {
      method: "get",
      headers: {
        "Authorization": "Basic " + Utilities.base64Encode(config.email + ":" + config.apiToken),
        "Accept": "application/json",
        "Content-Type": "application/json"
      },
      muteHttpExceptions: true
    };

    const response = UrlFetchApp.fetch(url, options);
    const data = JSON.parse(response.getContentText());

    if (response.getResponseCode() !== 200) {
      throw new Error(`Error al obtener sprints: ${data.errorMessages.join(', ')}`);
    }

    return data.values.map(sprint => ({ id: sprint.id, name: sprint.name }));
  } catch (error) {
    Logger.log(`❌ Error obteniendo sprints: ${error.message}`);
    return [];
  }
}

async function mostrarDialogoSprint() {
  const ui = SpreadsheetApp.getUi();
  const sprints = await obtenerSprintsDeJira();

  if (sprints.length === 0) {
    ui.alert('No se encontraron sprints.');
    return null;
  }

  const sprintsNombres = sprints.map(s => s.name);
  const sprintSeleccionadoNombre = ui.prompt('Seleccionar Sprint', 'Elige un sprint de la lista:', sprintsNombres);

  if (sprintSeleccionadoNombre.getSelectedButton() !== ui.Button.OK) {
    return null;
  }

  const sprintSeleccionado = sprints.find(s => s.name === sprintSeleccionadoNombre.getResponseText());

  return sprintSeleccionado ? sprintSeleccionado.id : null;
}

/**
 * ✅ NUEVA: Muestra diálogo de configuración del reporte personalizado
 * @returns {Object|null} Configuración del reporte o null si se cancela
 */
function mostrarDialogoConfiguracionReporte() {
  const ui = SpreadsheetApp.getUi();
  
  try {
    const hoy = new Date();
    const hace30Dias = new Date(hoy.getTime() - (30 * 24 * 60 * 60 * 1000));
    
    const fechaInicioDefault = `${String(hace30Dias.getDate()).padStart(2, '0')}/${String(hace30Dias.getMonth() + 1).padStart(2, '0')}/${hace30Dias.getFullYear()}`;
    const fechaFinDefault = `${String(hoy.getDate()).padStart(2, '0')}/${String(hoy.getMonth() + 1).padStart(2, '0')}/${hoy.getFullYear()}`;
    
    const respuestaInicio = ui.prompt(
      'Configurar Reporte - Fecha de Inicio',
      `📅 Ingresa la fecha de inicio del reporte:\nFormato: DD/MM/YYYY\nEjemplo: ${fechaInicioDefault}`,
      ui.ButtonSet.OK_CANCEL
    );
    
    if (respuestaInicio.getSelectedButton() !== ui.Button.OK) return null;
    
    const respuestaFin = ui.prompt(
      'Configurar Reporte - Fecha de Fin',
      `📅 Ingresa la fecha de fin del reporte:\nFormato: DD/MM/YYYY\nEjemplo: ${fechaFinDefault}`,
      ui.ButtonSet.OK_CANCEL
    );
    
    if (respuestaFin.getSelectedButton() !== ui.Button.OK) return null;
    
    const fechaInicio = parsearFecha(respuestaInicio.getResponseText().trim());
    const fechaFin = parsearFecha(respuestaFin.getResponseText().trim());
    
    if (!fechaInicio || !fechaFin) {
      ui.alert('Error de Fecha', 'Formato de fecha inválido. Usa DD/MM/YYYY.', ui.ButtonSet.OK);
      return null;
    }
    
    if (fechaFin < fechaInicio) {
      ui.alert('Error de Rango', 'La fecha de fin debe ser posterior a la fecha de inicio.', ui.ButtonSet.OK);
      return null;
    }
    
    return { fechaInicio, fechaFin };
    
  } catch (error) {
    Logger.log(`❌ Error en diálogo de configuración: ${error.message}`);
    ui.alert('Error de Configuración', `Error configurando el reporte: ${error.message}`, ui.ButtonSet.OK);
    return null;
  }
}

/**
 * ✅ NUEVA: Parsea fecha en formato DD/MM/YYYY
 * @param {string} fechaStr - Fecha en formato DD/MM/YYYY
 * @returns {Date|null} Fecha parseada o null si es inválida
 */
function parsearFecha(fechaStr) {
  try {
    const patron = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/;
    const match = fechaStr.match(patron);
    if (!match) return null;
    const dia = parseInt(match[1]);
    const mes = parseInt(match[2]) - 1;
    const año = parseInt(match[3]);
    const fecha = new Date(año, mes, dia);
    if (fecha.getDate() !== dia || fecha.getMonth() !== mes || fecha.getFullYear() !== año) return null;
    return fecha;
  } catch (error) {
    return null;
  }
}

/**
 * ✅ NUEVA: Genera reporte personalizado con selección de fechas
 */
async function generarReportePersonalizado() {
  const ui = SpreadsheetApp.getUi();
  
  try {
    Logger.log('📅 [PERSONALIZADO] Iniciando reporte personalizado...');
    
    if (!verificarCredencialesJiraSemanal()) {
      ui.alert('Configuración Requerida', 'Las credenciales no están configuradas.', ui.ButtonSet.OK);
      return;
    }
    
    const configuracion = mostrarDialogoConfiguracionReporte();
    if (!configuracion) return;
    
    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    const nombreHoja = `Reporte_${new Date().toISOString().replace(/:/g, '-')}`;
    const sheet = spreadsheet.insertSheet(nombreHoja);
    spreadsheet.setActiveSheet(sheet);

    ui.showModalDialog(
      HtmlService.createHtmlOutput(`<p>📊 Generando reporte personalizado...</p>`)
        .setWidth(400).setHeight(100),
      'Generando Reporte'
    );
    
    const opciones = {
      fechaInicio: configuracion.fechaInicio,
      fechaFin: configuracion.fechaFin
    };
    
    await generarReporteSemanalCompleto(opciones);
    
  } catch (error) {
    Logger.log(`❌ [PERSONALIZADO] Error: ${error.message}`);
    ui.alert('Error Generando Reporte', `No se pudo generar el reporte personalizado.\n\n${error.message}`, ui.ButtonSet.OK);
  }
}

/**
 * ✅ NUEVA: Formatea fecha para mostrar
 * @param {Date} fecha - Fecha a formatear
 * @returns {string} Fecha formateada DD/MM/YYYY
 */
function formatearFechaParaMostrar(fecha) {
  return `${String(fecha.getDate()).padStart(2, '0')}/${String(fecha.getMonth() + 1).padStart(2, '0')}/${fecha.getFullYear()}`;
}

/**
 * ✅ NUEVA: Generar reporte por departamento específico
 */
async function generarReportePorArea() {
  const ui = SpreadsheetApp.getUi();
  
  try {
    Logger.log('🏢 [AREA] Iniciando reporte por área...');
    
    if (!verificarCredencialesJiraSemanal()) {
      ui.alert('Configuración Requerida', 'Las credenciales no están configuradas.', ui.ButtonSet.OK);
      return;
    }
    
    const areas = obtenerAreasEquipo();
    if (areas.length === 0) {
      ui.alert('Sin Áreas', 'No se encontraron áreas en el equipo.', ui.ButtonSet.OK);
      return;
    }
    
    const opcionesAreas = areas.map((area, index) => `${index + 1}. ${area}`).join('\n');
    
    const respuesta = ui.prompt(
      'Seleccionar Área',
      `🏢 Selecciona el área para el reporte:\n\n${opcionesAreas}\n\nIngresa el número (1-${areas.length}):`,
      ui.ButtonSet.OK_CANCEL
    );
    
    if (respuesta.getSelectedButton() !== ui.Button.OK) return;
    
    const numeroSeleccionado = parseInt(respuesta.getResponseText());
    if (isNaN(numeroSeleccionado) || numeroSeleccionado < 1 || numeroSeleccionado > areas.length) {
      ui.alert('Selección Inválida', 'Número de área inválido.', ui.ButtonSet.OK);
      return;
    }
    
    const areaSeleccionada = areas[numeroSeleccionado - 1];
    
    const opciones = { area: areaSeleccionada };
    
    await generarReporteSemanalCompleto(opciones);
    
  } catch (error) {
    Logger.log(`❌ [AREA] Error: ${error.message}`);
    ui.alert('Error Generando Reporte', `No se pudo generar el reporte por área.\n\n${error.message}`, ui.ButtonSet.OK);
  }
}