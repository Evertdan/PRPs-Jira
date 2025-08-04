// =====================================
// ARCHIVO 5: INTERFAZ DE USUARIO Y MENÚS PARA REPORTES SEMANALES
// =====================================

/**
 * ✅ Se ejecuta cuando el usuario abre la hoja de cálculo
 * Crea menús personalizados optimizados para reportes semanales
 */
function onOpen() {
  const ui = SpreadsheetApp.getUi();
  
  // ✅ Menú principal de reportes semanales
  ui.createMenu('📊 Reportes Semanales Jira Pro')
    .addItem('🔐 Configurar Credenciales', 'configurarCredencialesJiraSemanal')
    .addItem('🧪 Probar Conexión', 'verificarConexionJiraSemanal')
    .addSeparator()
    .addItem('📊 Generar Reporte Semanal Completo', 'generarReporteSemanalCompleto')
    .addItem('👤 Generar Reporte por Persona', 'generarReportePorPersona')
    .addItem('🏢 Generar Reporte por Departamento', 'generarReportePorDepartamento')
    .addItem('📅 Reporte Personalizado por Fechas', 'generarReportePersonalizado')
    .addItem('📈 Reporte Estadístico Avanzado', 'generarReporteEstadisticoSemanal')
    .addItem('⚡ Reporte Rápido por Semana', 'generarReporteRapidoSemanal')
    .addSeparator()
    .addItem('📅 Programar Reporte Automático', 'programarReporteAutomaticoSemanal')
    .addItem('🔄 Cancelar Reportes Automáticos', 'cancelarReportesAutomaticos')
    .addSeparator()
    .addItem('👥 Ver Información del Equipo CCSOFT', 'mostrarInformacionEquipoCCSOFT')
    .addItem('⚙️ Ver Configuración Actual', 'mostrarConfiguracionCompletaSemanal')
    .addItem('🧪 Ejecutar Diagnóstico Completo', 'ejecutarDiagnosticoCompletoSemanal')
    .addSeparator()
    .addItem('📖 Ayuda y Documentación', 'mostrarAyudaCompletaSemanal')
    .addToUi();
  
  // ✅ Menú de administración avanzada
  ui.createMenu('⚙️ Administración Semanal')
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
    
    // Llamar onOpen() manualmente para actualizar menús
    onOpen();
    
    ui.alert(
      'Menús Actualizados',
      '✅ Los menús han sido actualizados exitosamente.\n\n' +
      'Ahora deberías ver el nuevo elemento:\n' +
      '📅 "Reporte Personalizado por Fechas"\n\n' +
      'Si no lo ves, intenta:\n' +
      '• Cerrar y abrir la hoja nuevamente\n' +
      '• Actualizar la página del navegador',
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
    
    // ✅ Verificar que la función generarReportePersonalizado existe
    try {
      if (typeof generarReportePersonalizado === 'function') {
        diagnostico += '✅ Función generarReportePersonalizado: Existe\n';
      } else {
        diagnostico += '❌ Función generarReportePersonalizado: No existe\n';
      }
    } catch (e) {
      diagnostico += `❌ Función generarReportePersonalizado: Error - ${e.message}\n`;
    }
    
    // ✅ Verificar onOpen
    try {
      if (typeof onOpen === 'function') {
        diagnostico += '✅ Función onOpen: Existe\n';
      } else {
        diagnostico += '❌ Función onOpen: No existe\n';
      }
    } catch (e) {
      diagnostico += `❌ Función onOpen: Error - ${e.message}\n`;
    }
    
    // ✅ Verificar SpreadsheetApp
    try {
      const sheet = SpreadsheetApp.getActiveSpreadsheet();
      if (sheet) {
        diagnostico += '✅ SpreadsheetApp: Funcionando\n';
      } else {
        diagnostico += '❌ SpreadsheetApp: Sin hoja activa\n';
      }
    } catch (e) {
      diagnostico += `❌ SpreadsheetApp: Error - ${e.message}\n`;
    }
    
    diagnostico += '\n📋 RECOMENDACIONES:\n';
    diagnostico += '1. Usar "🔄 Actualizar Menús" en Administración\n';
    diagnostico += '2. Cerrar y reabrir la hoja de cálculo\n';
    diagnostico += '3. Actualizar la página del navegador\n';
    diagnostico += '4. Verificar permisos de script\n\n';
    diagnostico += `🕐 Diagnóstico: ${new Date().toLocaleString()}`;
    
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
    
    // Mostrar diálogo de progreso
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
 * ✅ Genera reporte estadístico avanzado con métricas semanales
 */
async function generarReporteEstadisticoSemanal() {
  const ui = SpreadsheetApp.getUi();
  
  try {
    Logger.log('📈 [SEMANAL] Iniciando reporte estadístico avanzado...');
    
    const respuesta = ui.alert(
      'Reporte Estadístico Avanzado',
      '📈 ¿Generar reporte con análisis estadístico detallado?\n\n' +
      '✅ Incluirá:\n' +
      '• Métricas de productividad por semana\n' +
      '• Análisis de tendencias\n' +
      '• Gráficos de distribución\n' +
      '• Recomendaciones automáticas\n\n' +
      '⏱️ Puede tomar varios minutos...',
      ui.ButtonSet.YES_NO
    );
    
    if (respuesta === ui.Button.YES) {
      const opciones = {
        incluirEstadisticas: true,
        incluirGraficos: true,
        incluirRecomendaciones: true,
        incluirAnalisisTendencias: true
      };
      
      return await generarReporteSemanalCompleto(opciones);
    }
    
  } catch (error) {
    const errorId = ErrorManagerSemanal.registrarError(
      'Error generando reporte estadístico semanal',
      error,
      'REPORTE_ESTADISTICO',
      'HIGH'
    );
    
    ui.alert(
      'Error en Reporte Estadístico',
      `❌ No se pudo generar el reporte estadístico.\n\n` +
      `🔍 Error: ${error.message}\n` +
      `🆔 Error ID: ${errorId}`,
      ui.ButtonSet.OK
    );
  }
}

/**
 * ✅ Genera reporte rápido optimizado para vista ejecutiva
 */
async function generarReporteRapidoSemanal() {
  const ui = SpreadsheetApp.getUi();
  
  try {
    Logger.log('⚡ [SEMANAL] Iniciando reporte rápido...');
    
    const opciones = {
      soloResumen: true,
      incluirEstadisticas: false,
      incluirGraficos: false,
      formatoCompacto: true
    };
    
    return await generarReporteSemanalCompleto(opciones);
    
  } catch (error) {
    const errorId = ErrorManagerSemanal.registrarError(
      'Error generando reporte rápido semanal',
      error,
      'REPORTE_RAPIDO',
      'MEDIUM'
    );
    
    ui.alert(
      'Error en Reporte Rápido',
      `❌ No se pudo generar el reporte rápido.\n\n` +
      `🔍 Error: ${error.message}\n` +
      `🆔 Error ID: ${errorId}`,
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
    // ✅ Eliminar triggers existentes
    const triggers = ScriptApp.getProjectTriggers();
    triggers.forEach(trigger => {
      if (trigger.getHandlerFunction() === 'ejecutarReporteAutomaticoSemanal') {
        ScriptApp.deleteTrigger(trigger);
      }
    });
    
    // ✅ Crear nuevo trigger
    if (respuesta === ui.Button.YES) {
      // Semanal - cada lunes a las 8 AM
      ScriptApp.newTrigger('ejecutarReporteAutomaticoSemanal')
        .timeBased()
        .everyWeeks(1)
        .onWeekDay(ScriptApp.WeekDay.MONDAY)
        .atHour(8)
        .create();
      
      ui.alert(
        'Reporte Programado',
        '✅ Reporte semanal programado exitosamente!\n\n' +
        '📅 Se ejecutará cada lunes a las 8:00 AM\n' +
        '📊 Se generará automáticamente en esta hoja\n' +
        '📧 Recibirás notificaciones por email si hay errores',
        ui.ButtonSet.OK
      );
      
    } else {
      // Mensual - primer día del mes a las 8 AM
      ScriptApp.newTrigger('ejecutarReporteAutomaticoSemanal')
        .timeBased()
        .everyMonths(1)
        .onMonthDay(1)
        .atHour(8)
        .create();
      
      ui.alert(
        'Reporte Programado',
        '✅ Reporte mensual programado exitosamente!\n\n' +
        '📅 Se ejecutará el primer día de cada mes a las 8:00 AM\n' +
        '📊 Se generará automáticamente en esta hoja\n' +
        '📧 Recibirás notificaciones por email si hay errores',
        ui.ButtonSet.OK
      );
    }
    
    Logger.log('✅ [SEMANAL] Reporte automático programado exitosamente');
    
  } catch (error) {
    Logger.log(`❌ [SEMANAL] Error programando reporte automático: ${error.message}`);
    ui.alert(
      'Error de Programación',
      `❌ No se pudo programar el reporte automático.\n\n` +
      `🔍 Error: ${error.message}\n\n` +
      `💡 Intenta nuevamente o contacta al administrador.`,
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
      incluirEstadisticas: true,
      notificarPorEmail: true
    };
    
    const exito = await generarReporteSemanalCompleto(opciones);
    
    if (exito) {
      Logger.log('✅ [SEMANAL] Reporte automático generado exitosamente');
      
      // ✅ Opcional: Enviar email de notificación
      try {
        const config = obtenerConfigJiraSemanal();
        MailApp.sendEmail({
          to: config.email,
          subject: '📊 Reporte Semanal Jira - Generado Automáticamente',
          body: `Hola,\n\nTu reporte semanal de Jira ha sido generado automáticamente el ${new Date().toLocaleString()}.\n\nPuedes verlo en tu hoja de Google Sheets.\n\n¡Que tengas un buen día!\n\nSistema de Reportes Semanales Jira Pro`
        });
      } catch (emailError) {
        Logger.log(`⚠️ [SEMANAL] No se pudo enviar email de notificación: ${emailError.message}`);
      }
    }
    
  } catch (error) {
    const errorId = ErrorManagerSemanal.registrarError(
      'Error en reporte automático semanal',
      error,
      'REPORTE_AUTOMATICO',
      'CRITICAL'
    );
    
    Logger.log(`❌ [SEMANAL] Error en reporte automático: ${error.message} (Error ID: ${errorId})`);
    
    // ✅ Enviar email de error
    try {
      const config = obtenerConfigJiraSemanal();
      MailApp.sendEmail({
        to: config.email,
        subject: '❌ Error en Reporte Semanal Automático',
        body: `Hola,\n\nHubo un error generando tu reporte semanal automático el ${new Date().toLocaleString()}.\n\nError: ${error.message}\nError ID: ${errorId}\n\nPor favor, revisa la configuración y vuelve a intentar.\n\nSistema de Reportes Semanales Jira Pro`
      });
    } catch (emailError) {
      Logger.log(`⚠️ [SEMANAL] No se pudo enviar email de error: ${emailError.message}`);
    }
  }
}

/**
 * ✅ Cancela todos los reportes automáticos programados
 */
function cancelarReportesAutomaticos() {
  const ui = SpreadsheetApp.getUi();
  
  const confirmacion = ui.alert(
    'Cancelar Reportes Automáticos',
    '⚠️ ¿Estás seguro de que quieres cancelar todos los reportes automáticos?\n\n' +
    'Esta acción eliminará todas las programaciones actuales.',
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
        `✅ Se cancelaron ${eliminados} programaciones de reportes automáticos.\n\n` +
        'Los reportes ya no se generarán automáticamente.',
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
    
    let mensaje = '⚙️ CONFIGURACIÓN ACTUAL DEL SISTEMA SEMANAL\n\n';
    mensaje += `🌐 Dominio: ${config.dominio}.atlassian.net\n`;
    mensaje += `📧 Email: ${config.email}\n`;
    mensaje += `🔑 Token: ${'●'.repeat(12)}\n\n`;
    
    mensaje += '📊 CONFIGURACIÓN DE REPORTES:\n';
    mensaje += `📅 Etiquetas semanales: ${CONFIG_SEMANAL.etiquetasSemana.join(', ')}\n`;
    mensaje += `📁 Incluir subtareas: ${CONFIG_SEMANAL.incluirSubtareas ? 'Sí' : 'No'}\n`;
    mensaje += `📈 Incluir épicas: ${CONFIG_SEMANAL.incluirEpicas ? 'Sí' : 'No'}\n`;
    mensaje += `📝 Incluir historias: ${CONFIG_SEMANAL.incluirHistorias ? 'Sí' : 'No'}\n\n`;
    
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
      'Ve al menú "📊 Reportes Semanales" → "🔐 Configurar Credenciales"',
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
    
    let reporte = `🔧 DIAGNÓSTICO SISTEMA SEMANAL - ${new Date().toLocaleString()}\n\n`;
    
    // ✅ 1. Verificar configuración
    reporte += '1️⃣ CONFIGURACIÓN:\n';
    try {
      const config = obtenerConfigJiraSemanal();
      reporte += `   • Dominio: ✅ ${config.dominio}.atlassian.net\n`;
      reporte += `   • Email: ✅ ${config.email}\n`;
      reporte += `   • Token: ✅ Configurado\n`;
    } catch (error) {
      reporte += `   • Configuración: ❌ ${error.message}\n`;
    }
    reporte += '\n';
    
    // ✅ 2. Probar conectividad
    reporte += '2️⃣ CONECTIVIDAD:\n';
    try {
      const startTime = new Date().getTime();
      const testResult = probarConexionJiraSemanal();
      const endTime = new Date().getTime();
      reporte += `   • Conexión: ✅ Exitosa (${endTime - startTime}ms)\n`;
    } catch (error) {
      reporte += `   • Conexión: ❌ ${error.message}\n`;
    }
    reporte += '\n';
    
    // ✅ 3. Verificar caché
    reporte += '3️⃣ SISTEMA DE CACHÉ:\n';
    const statsCache = CacheManagerSemanal.obtenerEstadisticas();
    if (statsCache) {
      reporte += `   • Entradas válidas: ${statsCache.entradasValidas}\n`;
      reporte += `   • Entradas expiradas: ${statsCache.entradasExpiradas}\n`;
      reporte += `   • Tamaño: ${Math.round(statsCache.tamañoAproximado / 1024)} KB\n`;
    } else {
      reporte += `   • Cache: ❌ Error obteniendo estadísticas\n`;
    }
    reporte += '\n';
    
    // ✅ 4. Verificar triggers
    reporte += '4️⃣ REPORTES AUTOMÁTICOS:\n';
    const triggers = ScriptApp.getProjectTriggers().filter(t => 
      t.getHandlerFunction() === 'ejecutarReporteAutomaticoSemanal'
    );
    reporte += `   • Triggers activos: ${triggers.length}\n`;
    reporte += '\n';
    
    // ✅ 5. Verificar errores críticos
    reporte += '5️⃣ ERRORES CRÍTICOS:\n';
    const erroresCriticos = ErrorManagerSemanal.obtenerErroresCriticos();
    reporte += `   • Errores registrados: ${erroresCriticos.length}\n`;
    if (erroresCriticos.length > 0) {
      reporte += `   • Último error: ${erroresCriticos[erroresCriticos.length - 1].mensaje}\n`;
    }
    reporte += '\n';
    
    reporte += `📊 Sistema: ${SCRIPT_METADATA.nombre} v${SCRIPT_METADATA.version}\n`;
    reporte += `📅 Diagnóstico completado: ${new Date().toLocaleString()}`;
    
    ui.alert('Diagnóstico Completo del Sistema', reporte, ui.ButtonSet.OK);
    
  } catch (error) {
    Logger.log(`❌ [SEMANAL] Error en diagnóstico: ${error.message}`);
    ui.alert(
      'Error de Diagnóstico',
      `❌ Error ejecutando diagnóstico completo:\n${error.message}\n\n` +
      'Revisa los logs para más detalles.',
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
  mensaje += '3. 📊 Generar Reporte - Crea tu primer reporte semanal\n\n';
  
  mensaje += '🏷️ ETIQUETAS SEMANALES:\n';
  mensaje += 'El sistema busca issues con etiquetas:\n';
  mensaje += `• ${CONFIG_SEMANAL.etiquetasSemana.join('\n• ')}\n\n`;
  
  mensaje += '📊 TIPOS DE REPORTE:\n';
  mensaje += '• 📊 Completo: Detalle de todos los issues por semana\n';
  mensaje += '• 📈 Estadístico: Métricas avanzadas y análisis\n';
  mensaje += '• ⚡ Rápido: Vista ejecutiva condensada\n\n';
  
  mensaje += '🤖 AUTOMATIZACIÓN:\n';
  mensaje += '• Programa reportes semanales o mensuales\n';
  mensaje += '• Recibe notificaciones por email\n';
  mensaje += '• Cancelación flexible de programaciones\n\n';
  
  mensaje += '🔧 ADMINISTRACIÓN:\n';
  mensaje += '• Sistema de caché inteligente\n';
  mensaje += '• Manejo avanzado de errores\n';
  mensaje += '• Backup y restauración\n';
  mensaje += '• Diagnóstico completo\n\n';
  
  mensaje += '💡 CONSEJOS:\n';
  mensaje += '• Usa etiquetas SEMANA_1, SEMANA_2, etc. en Jira\n';
  mensaje += '• Configura estimaciones para métricas precisas\n';
  mensaje += '• Revisa diagnósticos regularmente\n';
  mensaje += '• Usa reportes automáticos para consistencia\n\n';
  
  mensaje += `📞 INFORMACIÓN TÉCNICA:\n`;
  mensaje += `• Versión: ${SCRIPT_METADATA.version}\n`;
  mensaje += `• Fecha: ${SCRIPT_METADATA.fecha}\n`;
  mensaje += `• Autor: ${SCRIPT_METADATA.autor}`;
  
  ui.alert('Ayuda Completa del Sistema', mensaje, ui.ButtonSet.OK);
}

/**
 * ✅ NUEVA: Genera reporte semanal por persona específica
 */
async function generarReportePorPersona() {
  const ui = SpreadsheetApp.getUi();
  
  try {
    Logger.log('👤 [PERSONA] Iniciando generación de reporte por persona...');
    
    // ✅ Verificar credenciales
    if (!verificarCredencialesJiraSemanal()) {
      ui.alert(
        'Configuración Requerida',
        '❌ Las credenciales no están configuradas.\n\n' +
        'Ve al menú "📊 Reportes Semanales" → "🔐 Configurar Credenciales"',
        ui.ButtonSet.OK
      );
      return;
    }
    
    // ✅ Mostrar progreso
    ui.showModalDialog(
      HtmlService.createHtmlOutput('<p>🔍 Obteniendo usuarios de Jira...</p>')
        .setWidth(300).setHeight(80),
      'Cargando'
    );
    
    // ✅ NUEVO: Obtener solo personas del equipo CCSOFT
    const equipoCCSOFT = await obtenerSoloEquipoCCSOFT();
    
    if (equipoCCSOFT.length === 0) {
      ui.alert(
        'Sin Personal del Equipo',
        '⚠️ No se encontraron personas del equipo CCSOFT en Jira.\n\n' +
        'Verifica que las personas estén asignadas a issues activos.',
        ui.ButtonSet.OK
      );
      return;
    }
    
    // ✅ NUEVO: Crear menú de selección solo con personas del equipo
    const opcionesEquipo = equipoCCSOFT.map((persona, index) => 
      `${index + 1}. ${persona.displayName} (${persona.emailAddress}) - ${persona.departamento}`
    ).join('\n');
    
    const respuesta = ui.prompt(
      'Seleccionar Persona del Equipo',
      `👥 Selecciona la persona del equipo CCSOFT:\n\n${opcionesEquipo}\n\nIngresa el número (1-${equipoCCSOFT.length}):`,
      ui.ButtonSet.OK_CANCEL
    );
    
    if (respuesta.getSelectedButton() !== ui.Button.OK) {
      return;
    }
    
    const numeroSeleccionado = parseInt(respuesta.getResponseText());
    
    if (isNaN(numeroSeleccionado) || numeroSeleccionado < 1 || numeroSeleccionado > equipoCCSOFT.length) {
      ui.alert(
        'Selección Inválida',
        '❌ Número de persona inválido. Operación cancelada.',
        ui.ButtonSet.OK
      );
      return;
    }
    
    const personaSeleccionada = equipoCCSOFT[numeroSeleccionado - 1];
    
    // ✅ NUEVO: Mostrar progreso con información del equipo
    ui.showModalDialog(
      HtmlService.createHtmlOutput(`<p>📊 Generando reporte para: ${personaSeleccionada.displayName}</p><p>🏢 Departamento: ${personaSeleccionada.departamento}</p>`)
        .setWidth(400).setHeight(100),
      'Generando Reporte'
    );
    
    // ✅ NUEVO: Generar reporte con persona específica del equipo
    const opciones = {
      usuarioEspecifico: personaSeleccionada.accountId,
      formatoPersonaEspecifica: true,
      nombreUsuario: personaSeleccionada.displayName,
      emailPersona: personaSeleccionada.emailAddress,
      departamentoPersona: personaSeleccionada.departamento,
      debug: true
    };
    
    const exito = await generarReporteSemanalCompleto(opciones);
    
    if (exito) {
      ui.alert(
        'Reporte Generado',
        `✅ Reporte generado exitosamente para:\n\n👤 ${personaSeleccionada.displayName}\n📧 ${personaSeleccionada.emailAddress}\n🏢 ${personaSeleccionada.departamento}\n\n📅 Generado: ${new Date().toLocaleString()}`,
        ui.ButtonSet.OK
      );
    }
    
  } catch (error) {
    Logger.log(`❌ [PERSONA] Error: ${error.message}`);
    ui.alert(
      'Error Generando Reporte',
      `❌ No se pudo generar el reporte por persona.\n\n${error.message}`,
      ui.ButtonSet.OK
    );
  }
}

/**
 * ✅ NUEVA: Muestra diálogo de configuración del reporte personalizado
 * @returns {Object|null} Configuración del reporte o null si se cancela
 */
function mostrarDialogoConfiguracionReporte() {
  const ui = SpreadsheetApp.getUi();
  
  try {
    // ✅ Obtener fechas por defecto (último mes)
    const hoy = new Date();
    const hace30Dias = new Date(hoy.getTime() - (30 * 24 * 60 * 60 * 1000));
    
    const fechaInicioDefault = `${String(hace30Dias.getDate()).padStart(2, '0')}/${String(hace30Dias.getMonth() + 1).padStart(2, '0')}/${hace30Dias.getFullYear()}`;
    const fechaFinDefault = `${String(hoy.getDate()).padStart(2, '0')}/${String(hoy.getMonth() + 1).padStart(2, '0')}/${hoy.getFullYear()}`;
    
    // ✅ Solicitar fecha de inicio
    const respuestaInicio = ui.prompt(
      'Configurar Reporte - Fecha de Inicio',
      `📅 Ingresa la fecha de inicio del reporte:\n\n` +
      `Formato: DD/MM/YYYY\n` +
      `Ejemplo: ${fechaInicioDefault}\n\n` +
      `Fecha de inicio:`,
      ui.ButtonSet.OK_CANCEL
    );
    
    if (respuestaInicio.getSelectedButton() !== ui.Button.OK) {
      return null;
    }
    
    // ✅ Solicitar fecha de fin
    const respuestaFin = ui.prompt(
      'Configurar Reporte - Fecha de Fin',
      `📅 Ingresa la fecha de fin del reporte:\n\n` +
      `Formato: DD/MM/YYYY\n` +
      `Ejemplo: ${fechaFinDefault}\n\n` +
      `Fecha de fin:`,
      ui.ButtonSet.OK_CANCEL
    );
    
    if (respuestaFin.getSelectedButton() !== ui.Button.OK) {
      return null;
    }
    
    // ✅ Solicitar tipo de reporte
    const respuestaTipo = ui.alert(
      'Configurar Reporte - Tipo de Reporte',
      `📊 ¿Cómo quieres organizar el reporte?\n\n` +
      `👤 Por persona: Una sección por cada persona\n` +
      `📋 Consolidado: Todas las personas en una tabla\n\n` +
      `¿Generar reporte por persona?`,
      ui.ButtonSet.YES_NO_CANCEL
    );
    
    if (respuestaTipo === ui.Button.CANCEL) {
      return null;
    }
    
    // ✅ Validar y parsear fechas
    const fechaInicio = parsearFecha(respuestaInicio.getResponseText().trim());
    const fechaFin = parsearFecha(respuestaFin.getResponseText().trim());
    
    if (!fechaInicio || !fechaFin) {
      ui.alert(
        'Error de Fecha',
        '❌ Formato de fecha inválido.\n\n' +
        'Usa el formato DD/MM/YYYY\n' +
        'Ejemplo: 15/01/2025',
        ui.ButtonSet.OK
      );
      return null;
    }
    
    // ✅ Validar rango de fechas
    if (fechaFin < fechaInicio) {
      ui.alert(
        'Error de Rango',
        '❌ La fecha de fin debe ser posterior a la fecha de inicio.',
        ui.ButtonSet.OK
      );
      return null;
    }
    
    // ✅ Validar rango máximo (6 meses)
    const diferenciaMeses = (fechaFin.getFullYear() - fechaInicio.getFullYear()) * 12 + 
                           (fechaFin.getMonth() - fechaInicio.getMonth());
    
    if (diferenciaMeses > 6) {
      ui.alert(
        'Rango Muy Amplio',
        '⚠️ El rango de fechas no puede ser mayor a 6 meses.\n\n' +
        'Por favor, reduce el rango de fechas.',
        ui.ButtonSet.OK
      );
      return null;
    }
    
    // ✅ Retornar configuración
    return {
      fechaInicio: fechaInicio,
      fechaFin: fechaFin,
      tipoReporte: respuestaTipo === ui.Button.YES ? 'persona' : 'consolidado',
      incluirEtiquetas: true,
      incluirTodosTipos: true
    };
    
  } catch (error) {
    Logger.log(`❌ Error en diálogo de configuración: ${error.message}`);
    ui.alert(
      'Error de Configuración',
      `❌ Error configurando el reporte: ${error.message}`,
      ui.ButtonSet.OK
    );
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
    const mes = parseInt(match[2]) - 1; // JavaScript meses son 0-indexados
    const año = parseInt(match[3]);
    
    const fecha = new Date(año, mes, dia);
    
    // Verificar que la fecha es válida
    if (fecha.getDate() !== dia || fecha.getMonth() !== mes || fecha.getFullYear() !== año) {
      return null;
    }
    
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
    
    // ✅ Verificar credenciales
    if (!verificarCredencialesJiraSemanal()) {
      ui.alert(
        'Configuración Requerida',
        '❌ Las credenciales no están configuradas.\n\n' +
        'Ve al menú "📊 Reportes Semanales" → "🔐 Configurar Credenciales"',
        ui.ButtonSet.OK
      );
      return;
    }
    
    // ✅ Mostrar diálogo de configuración
    const configuracion = mostrarDialogoConfiguracionReporte();
    
    if (!configuracion) {
      Logger.log('📅 [PERSONALIZADO] Reporte cancelado por el usuario');
      return;
    }
    
    // ✅ Mostrar progreso
    ui.showModalDialog(
      HtmlService.createHtmlOutput(`
        <p>📊 Generando reporte personalizado...</p>
        <p>📅 Periodo: ${formatearFechaParaMostrar(configuracion.fechaInicio)} - ${formatearFechaParaMostrar(configuracion.fechaFin)}</p>
        <p>🎯 Tipo: ${configuracion.tipoReporte === 'persona' ? 'Por persona' : 'Consolidado'}</p>
      `).setWidth(400).setHeight(120),
      'Generando Reporte'
    );
    
    // ✅ Generar opciones para el reporte
    const opciones = {
      fechaInicio: configuracion.fechaInicio,
      fechaFin: configuracion.fechaFin,
      tipoReporte: configuracion.tipoReporte,
      formatoPersonalizado: true,
      incluirColumnaPersona: true,
      debug: true
    };
    
    // ✅ Generar reporte
    const exito = await generarReporteSemanalCompleto(opciones);
    
    if (exito) {
      const diasDiferencia = Math.ceil((configuracion.fechaFin - configuracion.fechaInicio) / (1000 * 60 * 60 * 24));
      
      ui.alert(
        'Reporte Generado',
        `✅ Reporte personalizado generado exitosamente!\n\n` +
        `📅 Periodo: ${formatearFechaParaMostrar(configuracion.fechaInicio)} - ${formatearFechaParaMostrar(configuracion.fechaFin)}\n` +
        `📊 Rango: ${diasDiferencia} días\n` +
        `🎯 Tipo: ${configuracion.tipoReporte === 'persona' ? 'Por persona' : 'Consolidado'}\n` +
        `🕐 Generado: ${new Date().toLocaleString()}`,
        ui.ButtonSet.OK
      );
    }
    
  } catch (error) {
    Logger.log(`❌ [PERSONALIZADO] Error: ${error.message}`);
    ui.alert(
      'Error Generando Reporte',
      `❌ No se pudo generar el reporte personalizado.\n\n${error.message}`,
      ui.ButtonSet.OK
    );
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

// =====================================
// ✅ NUEVA: SELECTORES DE EQUIPO CCSOFT
// =====================================

/**
 * ✅ NUEVA: Mostrar selector de personas del equipo con información completa
 */
function mostrarSelectorPersonasEquipo() {
  const ui = SpreadsheetApp.getUi();
  
  let mensaje = '👥 EQUIPO CCSOFT - PERSONAS AUTORIZADAS\n\n';
  
  EQUIPO_CCSOFT.forEach((persona, index) => {
    if (persona.activo) {
      mensaje += `${index + 1}. ${persona.nombre}\n`;
      mensaje += `   📧 ${persona.email}\n`;
      mensaje += `   🏢 ${persona.departamento}\n\n`;
    }
  });
  
  mensaje += '🎯 OPCIONES DE SELECCIÓN:\n';
  mensaje += '• TODOS = Incluir todas las personas\n';
  mensaje += '• 1,3,5 = Incluir solo números específicos\n';
  mensaje += '• DESARROLLO = Filtrar solo por departamento\n';
  mensaje += '• QA = Filtrar solo por departamento\n';
  mensaje += '• INFRAESTRUCTURA = Filtrar solo por departamento\n';
  mensaje += '• ADMINISTRACION = Filtrar solo por departamento\n';
  mensaje += '• LIDERAZGO = Filtrar solo por departamento\n';
  
  const respuesta = ui.prompt(
    'Seleccionar Personas del Equipo CCSOFT',
    mensaje,
    ui.ButtonSet.OK_CANCEL
  );
  
  return respuesta;
}

/**
 * ✅ NUEVA: Filtrar personas por departamento específico
 * @param {string} departamento - Nombre del departamento
 * @returns {Array} Array de personas del departamento
 */
function filtrarEquipoPorDepartamento(departamento) {
  return EQUIPO_CCSOFT.filter(persona => 
    persona.activo && persona.departamento.toLowerCase() === departamento.toLowerCase()
  );
}

/**
 * ✅ NUEVA: Obtener estadísticas del equipo por departamento
 * @returns {Object} Estadísticas por departamento
 */
function obtenerEstadisticasEquipoPorDepartamento() {
  const estadisticas = {};
  
  EQUIPO_CCSOFT.forEach(persona => {
    if (persona.activo) {
      if (!estadisticas[persona.departamento]) {
        estadisticas[persona.departamento] = {
          count: 0,
          personas: []
        };
      }
      
      estadisticas[persona.departamento].count++;
      estadisticas[persona.departamento].personas.push(persona.nombreCorto);
    }
  });
  
  return estadisticas;
}

/**
 * ✅ NUEVA: Mostrar información del equipo CCSOFT
 */
function mostrarInformacionEquipoCCSOFT() {
  const ui = SpreadsheetApp.getUi();
  
  try {
    const estadisticas = obtenerEstadisticasEquipoPorDepartamento();
    const departamentos = obtenerDepartamentosEquipo();
    
    let mensaje = '👥 INFORMACIÓN DEL EQUIPO CCSOFT\n\n';
    
    mensaje += `📊 TOTAL DE PERSONAS: ${EQUIPO_CCSOFT.filter(p => p.activo).length}\n\n`;
    
    mensaje += '🏢 POR DEPARTAMENTO:\n';
    departamentos.forEach(depto => {
      const stats = estadisticas[depto];
      mensaje += `• ${depto}: ${stats.count} personas\n`;
      stats.personas.forEach(persona => {
        mensaje += `  - ${persona}\n`;
      });
      mensaje += '\n';
    });
    
    mensaje += '✅ BENEFICIOS DEL FILTRO:\n';
    mensaje += '• Solo personas reales del equipo\n';
    mensaje += '• Emails @ccsoft.ai completos\n';
    mensaje += '• Sin bots ni sistemas externos\n';
    mensaje += '• Mejor rendimiento de reportes\n';
    mensaje += '• Datos más precisos y útiles\n\n';
    
    mensaje += `📅 Información actualizada: ${new Date().toLocaleString()}`;
    
    ui.alert('Información del Equipo CCSOFT', mensaje, ui.ButtonSet.OK);
    
  } catch (error) {
    Logger.log(`❌ Error mostrando información del equipo: ${error.message}`);
    ui.alert(
      'Error',
      `❌ Error obteniendo información del equipo: ${error.message}`,
      ui.ButtonSet.OK
    );
  }
}

/**
 * ✅ NUEVA: Generar reporte por departamento específico
 */
async function generarReportePorDepartamento() {
  const ui = SpreadsheetApp.getUi();
  
  try {
    Logger.log('🏢 [DEPARTAMENTO] Iniciando reporte por departamento...');
    
    // ✅ Verificar credenciales
    if (!verificarCredencialesJiraSemanal()) {
      ui.alert(
        'Configuración Requerida',
        '❌ Las credenciales no están configuradas.\n\n' +
        'Ve al menú "📊 Reportes Semanales" → "🔐 Configurar Credenciales"',
        ui.ButtonSet.OK
      );
      return;
    }
    
    // ✅ Obtener departamentos disponibles
    const departamentos = obtenerDepartamentosEquipo();
    
    if (departamentos.length === 0) {
      ui.alert(
        'Sin Departamentos',
        '⚠️ No se encontraron departamentos en el equipo.',
        ui.ButtonSet.OK
      );
      return;
    }
    
    // ✅ Crear menú de selección de departamento
    const opcionesDepartamentos = departamentos.map((depto, index) => {
      const personas = filtrarEquipoPorDepartamento(depto);
      return `${index + 1}. ${depto} (${personas.length} personas)`;
    }).join('\n');
    
    const respuesta = ui.prompt(
      'Seleccionar Departamento',
      `🏢 Selecciona el departamento para el reporte:\n\n${opcionesDepartamentos}\n\nIngresa el número (1-${departamentos.length}):`,
      ui.ButtonSet.OK_CANCEL
    );
    
    if (respuesta.getSelectedButton() !== ui.Button.OK) {
      return;
    }
    
    const numeroSeleccionado = parseInt(respuesta.getResponseText());
    
    if (isNaN(numeroSeleccionado) || numeroSeleccionado < 1 || numeroSeleccionado > departamentos.length) {
      ui.alert(
        'Selección Inválida',
        '❌ Número de departamento inválido. Operación cancelada.',
        ui.ButtonSet.OK
      );
      return;
    }
    
    const departamentoSeleccionado = departamentos[numeroSeleccionado - 1];
    const personasDepartamento = filtrarEquipoPorDepartamento(departamentoSeleccionado);
    
    // ✅ Mostrar progreso
    ui.showModalDialog(
      HtmlService.createHtmlOutput(`
        <p>📊 Generando reporte para departamento: ${departamentoSeleccionado}</p>
        <p>👥 ${personasDepartamento.length} personas incluidas</p>
      `).setWidth(400).setHeight(100),
      'Generando Reporte por Departamento'
    );
    
    // ✅ Generar reporte con filtro por departamento
    const opciones = {
      departamentoEspecifico: departamentoSeleccionado,
      formatoDepartamento: true,
      incluirColumnaPersona: true,
      incluirEstadisticasDepartamento: true,
      debug: true
    };
    
    const exito = await generarReporteSemanalCompleto(opciones);
    
    if (exito) {
      ui.alert(
        'Reporte Generado',
        `✅ Reporte generado exitosamente para:\n\n🏢 Departamento: ${departamentoSeleccionado}\n👥 Personas: ${personasDepartamento.length}\n📅 Generado: ${new Date().toLocaleString()}`,
        ui.ButtonSet.OK
      );
    }
    
  } catch (error) {
    Logger.log(`❌ [DEPARTAMENTO] Error: ${error.message}`);
    ui.alert(
      'Error Generando Reporte',
      `❌ No se pudo generar el reporte por departamento.\n\n${error.message}`,
      ui.ButtonSet.OK
    );
  }
}
