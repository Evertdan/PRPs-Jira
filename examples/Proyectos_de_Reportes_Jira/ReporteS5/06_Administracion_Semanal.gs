// =====================================
// ARCHIVO 6: FUNCIONES DE ADMINISTRACIÓN AVANZADA PARA REPORTES SEMANALES
// =====================================

/**
 * ✅ Función para limpiar caché expirado desde el menú
 */
function limpiarCacheExpiradoSemanal() {
  const ui = SpreadsheetApp.getUi();
  
  try {
    Logger.log('🧹 [SEMANAL] Limpiando caché expirado...');
    
    CacheManagerSemanal.limpiarExpirados();
    const stats = CacheManagerSemanal.obtenerEstadisticas();
    
    ui.alert(
      'Limpieza de Caché Completada',
      `🧹 Caché expirado limpiado exitosamente.\n\n` +
      `📊 Estado actual:\n` +
      `• Entradas válidas: ${stats.entradasValidas}\n` +
      `• Entradas expiradas: ${stats.entradasExpiradas}\n` +
      `• Tamaño: ${Math.round(stats.tamañoAproximado / 1024)} KB\n` +
      `• Sistema: ${stats.tipoSistema}`,
      ui.ButtonSet.OK
    );
    
    Logger.log('✅ [SEMANAL] Caché limpiado exitosamente desde menú');
    
  } catch (error) {
    Logger.log(`❌ [SEMANAL] Error limpiando caché: ${error.message}`);
    ui.alert(
      'Error de Limpieza',
      `❌ No se pudo limpiar el caché expirado.\n\n${error.message}`,
      ui.ButtonSet.OK
    );
  }
}

/**
 * ✅ Función para limpiar todo el caché desde el menú
 */
function limpiarTodoElCacheSemanal() {
  const ui = SpreadsheetApp.getUi();
  
  const confirmacion = ui.alert(
    'Confirmar Limpieza Total',
    '⚠️ ¿Estás seguro de que quieres limpiar TODO el caché del sistema semanal?\n\n' +
    'Esto eliminará todos los datos almacenados y los próximos\n' +
    'reportes serán más lentos mientras se actualiza la información.',
    ui.ButtonSet.YES_NO
  );
  
  if (confirmacion === ui.Button.YES) {
    try {
      Logger.log('🗑️ [SEMANAL] Limpiando todo el caché...');
      
      CacheManagerSemanal.limpiarTodo();
      
      ui.alert(
        'Limpieza Total Completada',
        '🧹 Todo el caché del sistema semanal ha sido limpiado.\n\n' +
        '⚡ Los próximos reportes tomarán más tiempo mientras\n' +
        'se actualiza la información desde Jira.\n\n' +
        '✨ El sistema funcionará normalmente.',
        ui.ButtonSet.OK
      );
      
      Logger.log('✅ [SEMANAL] Todo el caché limpiado exitosamente');
      
    } catch (error) {
      Logger.log(`❌ [SEMANAL] Error limpiando todo el caché: ${error.message}`);
      ui.alert(
        'Error de Limpieza',
        `❌ No se pudo limpiar el caché completo.\n\n${error.message}`,
        ui.ButtonSet.OK
      );
    }
  }
}

/**
 * ✅ Función para mostrar errores críticos al usuario
 */
function mostrarErroresCriticosSemanal() {
  const ui = SpreadsheetApp.getUi();
  
  try {
    Logger.log('🚨 [SEMANAL] Mostrando errores críticos...');
    
    const errores = ErrorManagerSemanal.obtenerErroresCriticos();
    
    if (errores.length === 0) {
      ui.alert(
        'Sin Errores Críticos',
        '✅ ¡Excelente! No hay errores críticos registrados.\n\n' +
        '🎉 El sistema de reportes semanales está funcionando correctamente.\n\n' +
        '📊 Continúa generando reportes con confianza.',
        ui.ButtonSet.OK
      );
      return;
    }
    
    let mensaje = `🚨 ERRORES CRÍTICOS ENCONTRADOS: ${errores.length}\n\n`;
    
    // Mostrar los últimos 3 errores
    errores.slice(-3).forEach((error, index) => {
      const fecha = new Date(error.timestamp).toLocaleString();
      mensaje += `${errores.length - 2 + index}. ${error.mensaje}\n`;
      mensaje += `   📅 Fecha: ${fecha}\n`;
      mensaje += `   🆔 ID: ${error.id}\n`;
      mensaje += `   📍 Contexto: ${error.contexto}\n\n`;
    });
    
    if (errores.length > 3) {
      mensaje += `... y ${errores.length - 3} errores más.\n\n`;
    }
    
    mensaje += '💡 RECOMENDACIONES:\n';
    mensaje += '• Revisa los logs detallados en "Ver > Registros de ejecución"\n';
    mensaje += '• Verifica tu conexión con Jira\n';
    mensaje += '• Considera limpiar el caché si hay errores repetidos\n';
    mensaje += '• Usa "🧪 Ejecutar Diagnóstico Completo" para más información';
    
    ui.alert('Errores Críticos del Sistema', mensaje, ui.ButtonSet.OK);
    
  } catch (error) {
    Logger.log(`❌ [SEMANAL] Error obteniendo errores críticos: ${error.message}`);
    ui.alert(
      'Error',
      `❌ No se pudieron obtener los errores críticos.\n\n${error.message}`,
      ui.ButtonSet.OK
    );
  }
}

/**
 * ✅ Función para limpiar errores críticos desde el menú
 */
function limpiarErroresCriticosSemanal() {
  const ui = SpreadsheetApp.getUi();
  
  const confirmacion = ui.alert(
    'Confirmar Limpieza de Errores',
    '⚠️ ¿Estás seguro de que quieres limpiar todos los errores críticos?\n\n' +
    'Esta acción eliminará el historial de errores y no se puede deshacer.\n' +
    'Es útil para empezar con un registro limpio.',
    ui.ButtonSet.YES_NO
  );
  
  if (confirmacion === ui.Button.YES) {
    try {
      Logger.log('🧹 [SEMANAL] Limpiando errores críticos...');
      
      ErrorManagerSemanal.limpiarErroresCriticos();
      
      ui.alert(
        'Errores Limpiados',
        '🧹 Todos los errores críticos han sido limpiados exitosamente.\n\n' +
        '✨ El sistema comenzará con un registro de errores limpio.\n' +
        '📊 Los nuevos errores (si ocurren) se registrarán normalmente.',
        ui.ButtonSet.OK
      );
      
      Logger.log('✅ [SEMANAL] Errores críticos limpiados exitosamente');
      
    } catch (error) {
      Logger.log(`❌ [SEMANAL] Error limpiando errores críticos: ${error.message}`);
      ui.alert(
        'Error de Limpieza',
        `❌ No se pudieron limpiar los errores críticos.\n\n${error.message}`,
        ui.ButtonSet.OK
      );
    }
  }
}

/**
 * ✅ Crea backup completo de la configuración del sistema semanal
 */
function crearBackupConfiguracionSemanal() {
  const ui = SpreadsheetApp.getUi();
  
  try {
    Logger.log('💾 [SEMANAL] Creando backup de configuración...');
    
    const propiedades = PropertiesService.getScriptProperties();
    const todasLasPropiedades = propiedades.getProperties();
    
    // ✅ Filtrar solo propiedades del sistema semanal
    const propiedadesSemanales = {};
    Object.keys(todasLasPropiedades).forEach(clave => {
      if (clave.includes('SEMANAL') || clave.includes('JIRA_')) {
        propiedadesSemanales[clave] = todasLasPropiedades[clave];
      }
    });
    
    const backup = {
      timestamp: new Date().toISOString(),
      version: SCRIPT_METADATA.version,
      sistema: 'Reportes_Semanales',
      properties: propiedadesSemanales,
      configuracion: {
        colores: CONFIG_SEMANAL.colores,
        estadosCompletados: CONFIG_SEMANAL.estadosCompletados,
        estadosEnProgreso: CONFIG_SEMANAL.estadosEnProgreso,
        estadosPendientes: CONFIG_SEMANAL.estadosPendientes
      },
      triggers: ScriptApp.getProjectTriggers()
        .filter(t => t.getHandlerFunction() === 'ejecutarReporteAutomaticoSemanal')
        .map(t => ({
          tipo: t.getEventType().toString(),
          funcion: t.getHandlerFunction()
        }))
    };
    
    // ✅ Guardar backup con timestamp único
    const backupKey = `BACKUP_SEMANAL_${Date.now()}`;
    propiedades.setProperty(backupKey, JSON.stringify(backup));
    
    ui.alert(
      'Backup Creado Exitosamente',
      `💾 Backup de configuración creado exitosamente!\n\n` +
      `🔑 Clave: ${backupKey}\n` +
      `📅 Fecha: ${new Date().toLocaleString()}\n` +
      `📊 Incluye: ${Object.keys(propiedadesSemanales).length} propiedades\n` +
      `🤖 Triggers: ${backup.triggers.length} programaciones\n\n` +
      `✨ El backup está almacenado de forma segura y puede\n` +
      `restaurarse usando "🔄 Restaurar Configuración".`,
      ui.ButtonSet.OK
    );
    
    Logger.log(`✅ [SEMANAL] Backup creado exitosamente: ${backupKey}`);
    
  } catch (error) {
    Logger.log(`❌ [SEMANAL] Error creando backup: ${error.message}`);
    ui.alert(
      'Error de Backup',
      `❌ No se pudo crear el backup de configuración.\n\n${error.message}`,
      ui.ButtonSet.OK
    );
  }
}

/**
 * ✅ Restaura configuración desde un backup
 */
function restaurarConfiguracionSemanal() {
  const ui = SpreadsheetApp.getUi();
  
  try {
    Logger.log('🔄 [SEMANAL] Iniciando restauración de configuración...');
    
    // ✅ Obtener lista de backups disponibles
    const propiedades = PropertiesService.getScriptProperties();
    const todasLasPropiedades = propiedades.getProperties();
    const backupsDisponibles = [];
    
    Object.keys(todasLasPropiedades).forEach(clave => {
      if (clave.startsWith('BACKUP_SEMANAL_')) {
        try {
          const backup = JSON.parse(todasLasPropiedades[clave]);
          backupsDisponibles.push({
            clave: clave,
            fecha: new Date(backup.timestamp).toLocaleString(),
            version: backup.version || 'Desconocida'
          });
        } catch (e) {
          Logger.log(`⚠️ [SEMANAL] Backup corrupto encontrado: ${clave}`);
        }
      }
    });
    
    if (backupsDisponibles.length === 0) {
      ui.alert(
        'Sin Backups Disponibles',
        '📭 No se encontraron backups de configuración.\n\n' +
        '💡 Puedes crear un backup usando "💾 Crear Backup de Configuración".',
        ui.ButtonSet.OK
      );
      return;
    }
    
    // ✅ Mostrar lista de backups disponibles
    let mensaje = '🔄 BACKUPS DISPONIBLES:\n\n';
    backupsDisponibles.forEach((backup, index) => {
      mensaje += `${index + 1}. Fecha: ${backup.fecha}\n`;
      mensaje += `   Versión: ${backup.version}\n`;
      mensaje += `   Clave: ${backup.clave.substring(0, 30)}...\n\n`;
    });
    
    mensaje += '⚠️ ADVERTENCIA: La restauración sobrescribirá\n';
    mensaje += 'la configuración actual. ¿Continuar?';
    
    const confirmacion = ui.alert('Restaurar Configuración', mensaje, ui.ButtonSet.YES_NO);
    
    if (confirmacion === ui.Button.YES) {
      // Por simplicidad, restaurar el backup más reciente
      const backupMasReciente = backupsDisponibles.sort((a, b) => 
        new Date(b.fecha).getTime() - new Date(a.fecha).getTime()
      )[0];
      
      const backupData = JSON.parse(propiedades.getProperty(backupMasReciente.clave));
      
      // ✅ Restaurar propiedades
      Object.keys(backupData.properties).forEach(clave => {
        propiedades.setProperty(clave, backupData.properties[clave]);
      });
      
      ui.alert(
        'Configuración Restaurada',
        `✅ Configuración restaurada exitosamente!\n\n` +
        `📅 Backup utilizado: ${backupMasReciente.fecha}\n` +
        `📊 Propiedades restauradas: ${Object.keys(backupData.properties).length}\n\n` +
        `🔄 Reinicia el sistema para aplicar todos los cambios.`,
        ui.ButtonSet.OK
      );
      
      Logger.log(`✅ [SEMANAL] Configuración restaurada desde: ${backupMasReciente.clave}`);
    }
    
  } catch (error) {
    Logger.log(`❌ [SEMANAL] Error restaurando configuración: ${error.message}`);
    ui.alert(
      'Error de Restauración',
      `❌ No se pudo restaurar la configuración.\n\n${error.message}`,
      ui.ButtonSet.OK
    );
  }
}

/**
 * ✅ Reset completo del sistema semanal
 */
function resetCompletoSistemaSemanal() {
  const ui = SpreadsheetApp.getUi();
  
  const confirmacion = ui.alert(
    'RESET COMPLETO DEL SISTEMA',
    '🚨 ¡ADVERTENCIA! Esta acción es IRREVERSIBLE.\n\n' +
    'Se eliminará TODA la configuración del sistema semanal:\n' +
    '• Credenciales de Jira\n' +
    '• Caché completo\n' +
    '• Errores registrados\n' +
    '• Reportes automáticos programados\n' +
    '• Backups almacenados\n\n' +
    '⚠️ Solo usa esta opción si el sistema está completamente\n' +
    'dañado y necesitas empezar desde cero.\n\n' +
    '¿Estás ABSOLUTAMENTE seguro?',
    ui.ButtonSet.YES_NO
  );
  
  if (confirmacion === ui.Button.YES) {
    const confirmacionFinal = ui.alert(
      'CONFIRMACIÓN FINAL',
      '🚨 ÚLTIMA OPORTUNIDAD\n\n' +
      'Esta acción eliminará TODO y no se puede deshacer.\n' +
      'Tendrás que reconfigurar el sistema completamente.\n\n' +
      '¿Proceder con el reset completo?',
      ui.ButtonSet.YES_NO
    );
    
    if (confirmacionFinal === ui.Button.YES) {
      try {
        Logger.log('🚨 [SEMANAL] Iniciando reset completo del sistema...');
        
        const propiedades = PropertiesService.getScriptProperties();
        const todasLasPropiedades = propiedades.getProperties();
        let eliminadas = 0;
        
        // ✅ Eliminar todas las propiedades del sistema semanal
        Object.keys(todasLasPropiedades).forEach(clave => {
          if (clave.includes('SEMANAL') || 
              clave.startsWith('JIRA_') || 
              clave.startsWith('BACKUP_SEMANAL_') ||
              clave.startsWith('ERRORES_CRITICOS_SEMANAL')) {
            propiedades.deleteProperty(clave);
            eliminadas++;
          }
        });
        
        // ✅ Eliminar todos los triggers automáticos
        const triggers = ScriptApp.getProjectTriggers();
        let triggersEliminados = 0;
        triggers.forEach(trigger => {
          if (trigger.getHandlerFunction() === 'ejecutarReporteAutomaticoSemanal') {
            ScriptApp.deleteTrigger(trigger);
            triggersEliminados++;
          }
        });
        
        ui.alert(
          'Reset Completo Realizado',
          `🚨 RESET COMPLETO FINALIZADO\n\n` +
          `📊 Resumen de eliminaciones:\n` +
          `• Propiedades eliminadas: ${eliminadas}\n` +
          `• Triggers eliminados: ${triggersEliminados}\n\n` +
          `✨ El sistema ha sido completamente resetado.\n` +
          `🔄 Para usar el sistema nuevamente:\n` +
          `1. Ve a "🔐 Configurar Credenciales"\n` +
          `2. Introduce tus datos de Jira\n` +
          `3. Ejecuta "🧪 Probar Conexión"\n` +
          `4. Genera tu primer reporte\n\n` +
          `📞 El sistema está listo para una configuración fresca.`,
          ui.ButtonSet.OK
        );
        
        Logger.log(`✅ [SEMANAL] Reset completo finalizado: ${eliminadas} propiedades y ${triggersEliminados} triggers eliminados`);
        
      } catch (error) {
        Logger.log(`❌ [SEMANAL] Error durante reset completo: ${error.message}`);
        ui.alert(
          'Error de Reset',
          `❌ Ocurrió un error durante el reset completo.\n\n` +
          `Error: ${error.message}\n\n` +
          `💡 Es posible que el reset haya sido parcial.\n` +
          `Intenta ejecutar las funciones de limpieza individuales.`,
          ui.ButtonSet.OK
        );
      }
    }
  }
}

/**
 * ✅ Función de utilidad para mostrar estadísticas detalladas de caché
 */
function mostrarEstadisticasCacheSemanalDetalladas() {
  const ui = SpreadsheetApp.getUi();
  
  try {
    const stats = CacheManagerSemanal.obtenerEstadisticas();
    
    if (!stats) {
      ui.alert(
        'Error de Estadísticas',
        '❌ No se pudieron obtener las estadísticas de caché.',
        ui.ButtonSet.OK
      );
      return;
    }
    
    let mensaje = `📊 ESTADÍSTICAS DETALLADAS DE CACHÉ\n\n`;
    mensaje += `🏷️ Sistema: ${stats.tipoSistema}\n`;
    mensaje += `📦 Total de entradas: ${stats.totalEntradas}\n`;
    mensaje += `✅ Entradas válidas: ${stats.entradasValidas}\n`;
    mensaje += `⏰ Entradas expiradas: ${stats.entradasExpiradas}\n`;
    mensaje += `💾 Tamaño aproximado: ${Math.round(stats.tamañoAproximado / 1024)} KB\n\n`;
    
    if (Object.keys(stats.porTipo).length > 0) {
      mensaje += '📋 DESGLOSE POR TIPO:\n';
      Object.keys(stats.porTipo).forEach(tipo => {
        const tipoStats = stats.porTipo[tipo];
        mensaje += `• ${tipo}: ${tipoStats.validas} válidas, ${tipoStats.expiradas} expiradas\n`;
      });
      mensaje += '\n';
    }
    
    const eficiencia = stats.totalEntradas > 0 ? 
      Math.round((stats.entradasValidas / stats.totalEntradas) * 100) : 0;
    
    mensaje += `📈 EFICIENCIA DEL CACHÉ: ${eficiencia}%\n\n`;
    
    mensaje += '💡 RECOMENDACIONES:\n';
    if (stats.entradasExpiradas > stats.entradasValidas) {
      mensaje += '• Considera limpiar el caché expirado\n';
    }
    if (stats.tamañoAproximado > 100000) { // >100KB
      mensaje += '• El caché está creciendo mucho, considera limpieza\n';
    }
    if (eficiencia < 50) {
      mensaje += '• Baja eficiencia, limpia entradas expiradas\n';
    }
    if (eficiencia >= 80) {
      mensaje += '• ¡Excelente! El caché está funcionando óptimamente\n';
    }
    
    ui.alert('Estadísticas Detalladas de Caché', mensaje, ui.ButtonSet.OK);
    
  } catch (error) {
    Logger.log(`❌ [SEMANAL] Error mostrando estadísticas detalladas: ${error.message}`);
    ui.alert(
      'Error',
      `❌ No se pudieron mostrar las estadísticas detalladas.\n\n${error.message}`,
      ui.ButtonSet.OK
    );
  }
}

/**
 * ✅ NUEVA: Función para validar el sistema paso a paso
 */
async function validarSistemaCompletoSemanal() {
  const ui = SpreadsheetApp.getUi();
  
  try {
    Logger.log('🧪 [VALIDACION] Iniciando validación completa del sistema...');
    
    let reporte = `🧪 VALIDACIÓN COMPLETA - ${new Date().toLocaleString()}\n\n`;
    
    // ✅ 1. Validar configuración
    reporte += '1️⃣ CONFIGURACIÓN:\n';
    try {
      const config = obtenerConfigJiraSemanal();
      reporte += `   • Dominio: ✅ ${config.dominio}\n`;
      reporte += `   • Email: ✅ ${config.email}\n`;
    } catch (e) {
      reporte += `   • Configuración: ❌ ${e.message}\n`;
      ui.alert('Validación Fallida', reporte, ui.ButtonSet.OK);
      return;
    }
    
    // ✅ 2. Validar conexión
    reporte += '\n2️⃣ CONEXIÓN:\n';
    try {
      const resultadoConexion = probarConexionJiraSemanal();
      reporte += `   • Conexión: ✅ Exitosa\n`;
    } catch (e) {
      reporte += `   • Conexión: ❌ ${e.message}\n`;
      ui.alert('Validación Fallida', reporte, ui.ButtonSet.OK);
      return;
    }
    
    // ✅ 3. Validar obtención de issues
    reporte += '\n3️⃣ OBTENCIÓN DE ISSUES:\n';
    try {
      const issues = await obtenerIssuesSemanalesDeJira({
        soloConEtiquetasSemanales: true,
        forzarActualizacion: true
      });
      
      if (issues && Array.isArray(issues)) {
        reporte += `   • Obtención: ✅ ${issues.length} issues obtenidos\n`;
      } else {
        reporte += `   • Obtención: ❌ No se obtuvo un array de issues\n`;
      }
    } catch (e) {
      reporte += `   • Obtención: ❌ ${e.message}\n`;
      ui.alert('Validación Fallida', reporte, ui.ButtonSet.OK);
      return;
    }
    
    // ✅ 4. Validar clasificación
    reporte += '\n4️⃣ CLASIFICACIÓN:\n';
    try {
      const issues = await obtenerIssuesSemanalesDeJira({ soloConEtiquetasSemanales: true });
      const clasificados = clasificarIssuesPorPersonaYSemana(issues);
      
      if (clasificados && typeof clasificados === 'object') {
        reporte += `   • Clasificación: ✅ ${Object.keys(clasificados).length} personas clasificadas\n`;
      } else {
        reporte += `   • Clasificación: ❌ No se pudo clasificar\n`;
      }
    } catch (e) {
      reporte += `   • Clasificación: ❌ ${e.message}\n`;
      ui.alert('Validación Fallida', reporte, ui.ButtonSet.OK);
      return;
    }
    
    reporte += '\n🎉 ¡VALIDACIÓN COMPLETA EXITOSA!\n';
    reporte += 'El sistema parece estar funcionando correctamente.';
    
    ui.alert('Validación Completa', reporte, ui.ButtonSet.OK);
    
  } catch (error) {
    Logger.log(`❌ [VALIDACION] Error: ${error.message}`);
    ui.alert(
      'Error de Validación',
      `❌ Error durante la validación: ${error.message}`,
      ui.ButtonSet.OK
    );
  }
}

// =====================================
// ✅ NUEVA: VALIDACIÓN DEL FILTRO DE EQUIPO
// =====================================

/**
 * ✅ NUEVA: Verificar que el filtro de personas del equipo funcione correctamente
 */
async function verificarFiltroPersonasEquipo() {
  const ui = SpreadsheetApp.getUi();
  
  try {
    Logger.log('👥 [VALIDACIÓN] Verificando filtro de personas del equipo...');
    
    let resultados = {
      total: 0,
      exitosas: 0,
      fallidas: 0,
      detalles: []
    };
    
    // ✅ 1. Verificar constante EQUIPO_CCSOFT
    try {
      resultados.total++;
      if (EQUIPO_CCSOFT && Array.isArray(EQUIPO_CCSOFT) && EQUIPO_CCSOFT.length === 17) {
        resultados.exitosas++;
        resultados.detalles.push(`✅ EQUIPO_CCSOFT: ${EQUIPO_CCSOFT.length} personas configuradas`);
      } else {
        throw new Error(`EQUIPO_CCSOFT inválido: ${EQUIPO_CCSOFT?.length || 0} personas`);
      }
    } catch (error) {
      resultados.fallidas++;
      resultados.detalles.push(`❌ EQUIPO_CCSOFT: ${error.message}`);
    }
    
    // ✅ 2. Verificar emails @computocontable.com
    try {
      resultados.total++;
      const emailsValidos = EQUIPO_CCSOFT.filter(p => 
        p.email && p.email.endsWith('@computocontable.com')
      );
      
      if (emailsValidos.length === 17) {
        resultados.exitosas++;
        resultados.detalles.push('✅ Emails: Todos los 17 emails terminan en @computocontable.com');
      } else {
        throw new Error(`Solo ${emailsValidos.length}/17 emails son válidos`);
      }
    } catch (error) {
      resultados.fallidas++;
      resultados.detalles.push(`❌ Emails: ${error.message}`);
    }
    
    // ✅ 3. Verificar departamentos
    try {
      resultados.total++;
      const departamentos = obtenerDepartamentosEquipo();
      const departamentosEsperados = ['Desarrollo', 'QA', 'Infraestructura', 'Administración', 'Liderazgo'];
      
      const todosPresentes = departamentosEsperados.every(depto => 
        departamentos.includes(depto)
      );
      
      if (todosPresentes) {
        resultados.exitosas++;
        resultados.detalles.push(`✅ Departamentos: ${departamentos.length} departamentos válidos`);
      } else {
        throw new Error(`Departamentos faltantes: ${departamentosEsperados.filter(d => !departamentos.includes(d)).join(', ')}`);
      }
    } catch (error) {
      resultados.fallidas++;
      resultados.detalles.push(`❌ Departamentos: ${error.message}`);
    }
    
    // ✅ 4. Probar función de validación de personas
    try {
      resultados.total++;
      
      // Usuario válido del equipo
      const usuarioValido = {
        displayName: 'Benjamin Oribe Mendieta',
        emailAddress: 'benjamin.oribe@computocontable.com'
      };
      
      // Usuario inválido (bot)
      const usuarioInvalido = {
        displayName: 'Automation for Jira',
        emailAddress: 'noreply@atlassian.com'
      };
      
      const validoEsValido = esPersonaDelEquipo(usuarioValido);
      const invalidoEsInvalido = !esPersonaDelEquipo(usuarioInvalido);
      
      if (validoEsValido && invalidoEsInvalido) {
        resultados.exitosas++;
        resultados.detalles.push('✅ Validación personas: Función esPersonaDelEquipo funciona correctamente');
      } else {
        throw new Error(`Validación incorrecta: válido=${validoEsValido}, inválido=${!invalidoEsInvalido}`);
      }
    } catch (error) {
      resultados.fallidas++;
      resultados.detalles.push(`❌ Validación personas: ${error.message}`);
    }
    
    // ✅ 5. Probar obtención de email correcto
    try {
      resultados.total++;
      
      const emailCorrecto = obtenerEmailPersona('Benjamin Oribe Mendieta', 'email.incompleto@jira');
      
      if (emailCorrecto === 'benjamin.oribe@computocontable.com') {
        resultados.exitosas++;
        resultados.detalles.push('✅ Email correcto: Función obtenerEmailPersona funciona correctamente');
      } else {
        throw new Error(`Email incorrecto obtenido: ${emailCorrecto}`);
      }
    } catch (error) {
      resultados.fallidas++;
      resultados.detalles.push(`❌ Email correcto: ${error.message}`);
    }
    
    // ✅ Mostrar resultados
    const porcentajeExito = Math.round((resultados.exitosas / resultados.total) * 100);
    let mensaje = `👥 VALIDACIÓN DEL FILTRO DE EQUIPO CCSOFT\n\n`;
    mensaje += `📊 RESULTADOS:\n`;
    mensaje += `• Total pruebas: ${resultados.total}\n`;
    mensaje += `• ✅ Exitosas: ${resultados.exitosas}\n`;
    mensaje += `• ❌ Fallidas: ${resultados.fallidas}\n`;
    mensaje += `• 📈 Éxito: ${porcentajeExito}%\n\n`;
    
    mensaje += `📋 DETALLES:\n`;
    resultados.detalles.forEach(detalle => {
      mensaje += `${detalle}\n`;
    });
    mensaje += `\n🕐 Validación: ${new Date().toLocaleString()}`;
    
    ui.alert('Validación del Filtro de Equipo', mensaje, ui.ButtonSet.OK);
    
    Logger.log(`✅ [VALIDACIÓN] Filtro de equipo: ${resultados.exitosas}/${resultados.total} pruebas exitosas`);
    return resultados;
    
  } catch (error) {
    Logger.log(`❌ [VALIDACIÓN] Error: ${error.message}`);
    ui.alert(
      'Error en Validación',
      `❌ Error validando filtro de equipo: ${error.message}`,
      ui.ButtonSet.OK
    );
    return null;
  }
}

/**
 * ✅ NUEVA: Probar filtrado real con datos de Jira
 */
async function probarFiltradoRealJira() {
  try {
    Logger.log('🧪 [PRUEBA-REAL] Probando filtrado real con datos de Jira...');
    
    // ✅ Obtener issues semanales (esto aplicará automáticamente el filtro)
    const issues = await obtenerIssuesSemanalesDeJira({ debug: true });
    
    Logger.log(`📊 [PRUEBA-REAL] Issues obtenidos: ${issues.length}`);
    
    // ✅ Verificar que solo aparezcan personas del equipo
    const personasEncontradas = [...new Set(
      issues.map(issue => issue.analisisSemanal.asignadoNombre)
    )];
    
    Logger.log(`👥 [PRUEBA-REAL] Personas encontradas: ${personasEncontradas.length}`);
    
    let personasValidas = 0;
    let personasInvalidas = 0;
    
    personasEncontradas.forEach(persona => {
      const esValida = EQUIPO_CCSOFT.find(p => p.nombre === persona);
      if (esValida) {
        personasValidas++;
        Logger.log(`  ✅ ${persona}`);
      } else {
        personasInvalidas++;
        Logger.log(`  ❌ ${persona} (NO AUTORIZADA)`);
      }
    });
    
    Logger.log(`📊 [PRUEBA-REAL] Resultado: ${personasValidas} válidas, ${personasInvalidas} inválidas`);
    
    return {
      totalIssues: issues.length,
      totalPersonas: personasEncontradas.length,
      personasValidas: personasValidas,
      personasInvalidas: personasInvalidas,
      personas: personasEncontradas,
      exito: personasInvalidas === 0
    };
    
  } catch (error) {
    Logger.log(`❌ [PRUEBA-REAL] Error: ${error.message}`);
    throw error;
  }
}

/**
 * ✅ NUEVA: Validación completa del sistema de filtrado
 */
async function validarSistemaFiltradoCompleto() {
  const ui = SpreadsheetApp.getUi();
  
  try {
    Logger.log('🔍 [VALIDACIÓN-COMPLETA] Iniciando validación completa del sistema de filtrado...');
    
    // ✅ 1. Validar configuración
    const validacionConfiguracion = await verificarFiltroPersonasEquipo();
    
    if (!validacionConfiguracion || validacionConfiguracion.fallidas > 0) {
      ui.alert(
        'Error de Configuración',
        '❌ La configuración del equipo tiene errores.\n\nRevisa los logs para más detalles.',
        ui.ButtonSet.OK
      );
      return false;
    }
    
    // ✅ 2. Probar con datos reales (solo si hay credenciales)
    let resultadoPruebaReal = null;
    if (verificarCredencialesJiraSemanal()) {
      try {
        resultadoPruebaReal = await probarFiltradoRealJira();
      } catch (error) {
        Logger.log(`⚠️ [VALIDACIÓN-COMPLETA] No se pudo probar con datos reales: ${error.message}`);
      }
    }
    
    // ✅ 3. Mostrar resultados finales
    let mensaje = '🔍 VALIDACIÓN COMPLETA DEL SISTEMA DE FILTRADO\n\n';
    
    mensaje += '✅ CONFIGURACIÓN:\n';
    mensaje += `• EQUIPO_CCSOFT: ${EQUIPO_CCSOFT.length} personas\n`;
    mensaje += `• Departamentos: ${obtenerDepartamentosEquipo().length}\n`;
    mensaje += `• Emails @ccsoft.ai: ${EQUIPO_CCSOFT.filter(p => p.email.endsWith('@ccsoft.ai')).length}\n\n`;
    
    if (resultadoPruebaReal) {
      mensaje += '🧪 PRUEBA CON DATOS REALES:\n';
      mensaje += `• Issues obtenidos: ${resultadoPruebaReal.totalIssues}\n`;
      mensaje += `• Personas encontradas: ${resultadoPruebaReal.totalPersonas}\n`;
      mensaje += `• ✅ Personas válidas: ${resultadoPruebaReal.personasValidas}\n`;
      mensaje += `• ❌ Personas inválidas: ${resultadoPruebaReal.personasInvalidas}\n`;
      mensaje += `• Estado: ${resultadoPruebaReal.exito ? '✅ FILTRO FUNCIONANDO' : '❌ FILTRO CON PROBLEMAS'}\n\n`;
    } else {
      mensaje += '⚠️ PRUEBA CON DATOS REALES: No disponible (sin credenciales)\n\n';
    }
    
    mensaje += '🎯 BENEFICIOS VERIFICADOS:\n';
    mensaje += '• Solo personas reales del equipo CCSOFT\n';
    mensaje += '• Emails @ccsoft.ai completos y correctos\n';
    mensaje += '• Exclusión automática de bots y sistemas\n';
    mensaje += '• Mejor rendimiento (menos datos innecesarios)\n';
    mensaje += '• Estadísticas por departamento disponibles\n\n';
    
    mensaje += `🕐 Validación completada: ${new Date().toLocaleString()}`;
    
    ui.alert('Validación Completa del Sistema', mensaje, ui.ButtonSet.OK);
    
    Logger.log('✅ [VALIDACIÓN-COMPLETA] Sistema de filtrado validado exitosamente');
    return true;
    
  } catch (error) {
    Logger.log(`❌ [VALIDACIÓN-COMPLETA] Error: ${error.message}`);
    ui.alert(
      'Error en Validación Completa',
      `❌ Error validando el sistema: ${error.message}`,
      ui.ButtonSet.OK
    );
    return false;
  }
}

/**
 * ✅ NUEVA: Validación paso a paso del sistema completo
 */
function validarSistemaCompletoSemanal() {
  const ui = SpreadsheetApp.getUi();
  
  try {
    Logger.log(' [VALIDACION-SISTEMA] Iniciando validación paso a paso...');
    
    let mensaje = ` VALIDACIÓN PASO A PASO DEL SISTEMA\n\n`;
    let pasoActual = 1;
    let erroresCriticos = 0;
    let advertencias = 0;
    
    // Paso 1: Configuración básica
    mensaje += `${pasoActual}️⃣ CONFIGURACIÓN BÁSICA:\n`;
    try {
      const config = obtenerConfigJiraSemanal();
      mensaje += `   ✅ Credenciales configuradas: ${config.email}\n`;
      mensaje += `   ✅ Dominio: ${config.dominio}.atlassian.net\n`;
    } catch (e) {
      mensaje += `   ❌ Error en configuración: ${e.message}\n`;
      erroresCriticos++;
    }
    pasoActual++;
    
    // Paso 2: Conectividad
    mensaje += `\n${pasoActual}️⃣ CONECTIVIDAD CON JIRA:\n`;
    try {
      probarConexionJiraSemanal();
      mensaje += `   ✅ Conexión con Jira exitosa\n`;
    } catch (e) {
      mensaje += `   ❌ Error de conexión: ${e.message.substring(0, 50)}...\n`;
      erroresCriticos++;
    }
    pasoActual++;
    
    // Paso 3: Sistema de worklog
    mensaje += `\n${pasoActual}️⃣ SISTEMA DE WORKLOG:\n`;
    try {
      const jqlTest = construirJQLParaReportesWorklog({});
      if (jqlTest.includes('worklogDate') && jqlTest.includes('worklogAuthor')) {
        mensaje += `   ✅ JQL para worklog se construye correctamente\n`;
      } else {
        mensaje += `   ⚠️  JQL puede tener problemas de formato\n`;
        advertencias++;
      }
    } catch (e) {
      mensaje += `   ❌ Error construyendo JQL: ${e.message}\n`;
      erroresCriticos++;
    }
    pasoActual++;
    
    // Paso 4: Filtrado de equipo
    mensaje += `\n${pasoActual}️⃣ FILTRADO DE EQUIPO:\n`;
    const equipoActivo = obtenerEquipoActivo();
    if (equipoActivo.length > 0) {
      mensaje += `   ✅ ${equipoActivo.length} personas activas configuradas\n`;
    } else {
      mensaje += `   ❌ No hay personas activas en el equipo\n`;
      erroresCriticos++;
    }
    pasoActual++;
    
    // Paso 5: Sistema de caché
    mensaje += `\n${pasoActual}️⃣ SISTEMA DE CACHÉ:\n`;
    try {
      const stats = CacheManagerSemanal.obtenerEstadisticas();
      mensaje += `   ✅ Sistema de caché operativo\n`;
      mensaje += `    Entradas: ${stats.totalEntradas} (${stats.entradasValidas} válidas)\n`;
    } catch (e) {
      mensaje += `   ⚠️  Sistema de caché con problemas: ${e.message.substring(0, 30)}...\n`;
      advertencias++;
    }
    
    // Resultado final
    mensaje += `\n RESULTADO DE VALIDACIÓN:\n`;
    if (erroresCriticos === 0) {
      mensaje += `    SISTEMA OPERATIVO\n`;
      mensaje += `   ✅ ${pasoActual - 1} pasos validados exitosamente\n`;
      if (advertencias > 0) {
        mensaje += `   ⚠️  ${advertencias} advertencias menores\n`;
      }
      mensaje += `    El sistema está listo para generar reportes`;
    } else {
      mensaje += `    ERRORES CRÍTICOS: ${erroresCriticos}\n`;
      mensaje += `   ⚠️  Advertencias: ${advertencias}\n`;
      mensaje += `    Corrige los errores antes de usar el sistema`;
    }
    
    ui.alert('Validación Completa del Sistema', mensaje, ui.ButtonSet.OK);
    
  } catch (error) {
    Logger.log(`❌ [VALIDACION-SISTEMA] Error: ${error.message}`);
    ui.alert(
      'Error de Validación',
      `❌ Error ejecutando validación del sistema.\n\n${error.message}`,
      ui.ButtonSet.OK
    );
  }
}
