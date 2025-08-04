// =====================================
// MÓDULO DE DIAGNÓSTICOS
// =====================================

/**
 * Ejecuta una serie de pruebas para verificar la conexión y configuración con Jira.
 * Utiliza la librería central para las llamadas a la API.
 */
function ejecutarDiagnosticoCompleto() {
  const ui = SpreadsheetApp.getUi();
  let reporte = '🔍 DIAGNÓSTICO COMPLETO DEL SISTEMA\n\n';
  try {
    // 1. Prueba de conectividad y autenticación
    reporte += '🌐 CONECTIVIDAD:\n';
    const userInfo = LibreriaCoreJira.fetchJiraAPI('/rest/api/3/myself');
    reporte += `✅ Conexión exitosa.\n👤 Usuario: ${userInfo.displayName}\n\n`;

    // 2. Verificación de acceso a proyectos
    reporte += '📚 RECURSOS:\n';
    const proyectos = LibreriaCoreJira.obtenerTodosLosProyectos();
    reporte += `✅ Proyectos accesibles: ${proyectos.length}\n\n`;

    // 3. Estado del cache
    reporte += '💾 CACHE:\n';
    const cache = CacheService.getScriptCache();
    const cacheKeys = ['JIRA_TODOS_LOS_PROYECTOS', 'JIRA_TODOS_LOS_SPRINTS'];
    let cacheCount = 0;
    cacheKeys.forEach(key => {
      if (cache.get(key)) cacheCount++;
    });
    reporte += `✅ Elementos cacheados: ${cacheCount}/${cacheKeys.length}\n\n`;

    ui.alert('Diagnóstico Completo', reporte, ui.ButtonSet.OK);

  } catch (e) {
    reporte += `❌ ERROR CRÍTICO: ${e.message}\n\nPor favor, verifica tus credenciales y permisos.`;
    ui.alert('Error en Diagnóstico', reporte, ui.ButtonSet.OK);
    LibreriaCoreJira.registrarError(e, 'ejecutarDiagnosticoCompleto');
  }
}

/**
 * Limpia la caché del script para forzar la recarga de datos frescos.
 */
function limpiarCache() {
  const ui = SpreadsheetApp.getUi();
  try {
    CacheService.getScriptCache().removeAll(['JIRA_TODOS_LOS_PROYECTOS', 'JIRA_TODOS_LOS_SPRINTS']);
    ui.alert('✅ Cache Limpiado', 'El cache del sistema ha sido limpiado exitosamente.', ui.ButtonSet.OK);
  } catch (e) {
    LibreriaCoreJira.registrarError(e, 'limpiarCache');
  }
}

