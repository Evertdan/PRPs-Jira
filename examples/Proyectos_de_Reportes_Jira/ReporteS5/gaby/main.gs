/**
 * ARCHIVO PRINCIPAL - SISTEMA DE REPORTES JIRA
 * ==========================================
 * 
 * Este es el punto de entrada principal del sistema modularizado de reportes de Jira.
 * 
 * Módulos incluidos:
 * - config.gs: Configuración del sistema
 * - error-handler.gs: Manejo de errores y logging
 * - jira-api.gs: Funciones de API de Jira
 * - ui-manager.gs: Manejo de interfaz de usuario
 * - report-generator.gs: Generación de reportes
 * 
 * @author Sistema de Reportes Modularizado
 * @version 2.0
 */

// =====================================
// MENÚ PRINCIPAL
// =====================================

/**
 * Se ejecuta cuando el usuario abre la hoja de cálculo.
 * Crea un menú personalizado en la interfaz de Google Sheets.
 */
function onOpen() {
  try {
    // Intentar cargar credenciales almacenadas si el manejador está disponible
    try {
      if (typeof CredManager !== 'undefined' && CredManager.cargarCredenciales) {
        CredManager.cargarCredenciales();
      }
    } catch (credError) {
      Logger.log(`Advertencia cargando credenciales: ${credError.message}`);
    }
    
    const ui = SpreadsheetApp.getUi();
    ui.createMenu('📊 Indicadores')
      .addItem('📋 Tareas del Sprint', 'mostrarDialogo')
      .addSeparator()
      .addSubMenu(ui.createMenu('⚙️ Configuración')
        .addItem('🚀 Asistente de Configuración', 'ejecutarAsistenteConfiguracion')
        .addSeparator()
        .addItem('📧 Configurar Credenciales', 'configurarCredenciales')
        .addItem('📋 Seleccionar Proyecto', 'seleccionarProyecto')
        .addItem('👀 Ver Configuración', 'mostrarConfiguracion')
        .addItem('🗑️ Limpiar Credenciales', 'limpiarCredenciales'))
      .addSubMenu(ui.createMenu('🧪 Testing')
        .addItem('🔗 Test Conexión', 'testJiraConnection')
        .addItem('🔍 Diagnóstico Completo', 'diagnosticoCompleto')
        .addSeparator()
        .addItem('⚡ Prueba Rápida', 'pruebaRapidaCredenciales')
        .addItem('📋 Estado Credenciales', 'mostrarEstadoCredenciales')
        .addItem('🔄 Forzar Carga', 'forzarCargaCredenciales')
        .addSeparator()
        .addSubMenu(ui.createMenu('🐛 Debug Reportes')
          .addItem('🔍 Debug Completo', 'debugReportGeneration')
          .addItem('🧪 Debug Sistema', 'debugCompleto')
          .addItem('📋 Verificar Rápida', 'verificarRapida')
          .addItem('📄 Debug Tarea Individual', 'debugTareaIndividual')
          .addItem('🧪 Test Datos Simulados', 'testReporteConDatosSimulados')
          .addItem('🔄 Reporte Backup', 'reporteCompromisosBackup'))
        .addItem('📊 Ver Logs', 'mostrarLogs'))
      .addToUi();
    
    // Intentar hacer log si la función está disponible
    try {
      if (typeof logInfo !== 'undefined') {
        logInfo('Menú inicializado correctamente');
      } else {
        Logger.log('Menú inicializado correctamente');
      }
    } catch (logError) {
      Logger.log('Menú inicializado correctamente');
    }
    
    // Verificar credenciales después de un pequeño delay para asegurar que todo esté cargado
    Utilities.sleep(500);
    
    try {
      if (typeof CredManager !== 'undefined' && CredManager.credencialesConfiguradas) {
        if (!CredManager.credencialesConfiguradas()) {
          Utilities.sleep(1000); // Esperar un poco más para que se cargue la UI completa
          mostrarBienvenida();
        }
      }
    } catch (welcomeError) {
      Logger.log(`Advertencia mostrando bienvenida: ${welcomeError.message}`);
    }
    
  } catch (error) {
    Logger.log(`Error inicializando menú: ${error.message}`);
    // Crear menú básico en caso de error
    try {
      const ui = SpreadsheetApp.getUi();
      ui.createMenu('📊 Indicadores')
        .addItem('📋 Tareas del Sprint', 'mostrarDialogo')
        .addItem('⚙️ Configurar Credenciales', 'configurarCredenciales')
        .addItem('🔍 Diagnóstico', 'diagnosticoCompleto')
        .addToUi();
    } catch (fallbackError) {
      Logger.log(`Error creando menú básico: ${fallbackError.message}`);
    }
  }
}

/**
 * Muestra el mensaje de bienvenida para nuevos usuarios
 */
function mostrarBienvenida() {
  try {
    const ui = SpreadsheetApp.getUi();
    const response = ui.alert(
      '👋 Bienvenido al Sistema de Reportes Jira',
      '¡Primera vez usando el sistema!\n\n' +
      '🚀 RECOMENDADO: Usa el "Asistente de Configuración"\n' +
      'Te guía paso a paso para configurar todo correctamente.\n\n' +
      '📧 Solo necesitas: tu email y API token de Jira\n' +
      '🏢 Preconfigurado para: ccsoft.atlassian.net\n\n' +
      '¿Ejecutar el asistente ahora?',
      ui.ButtonSet.YES_NO
    );
    
    if (response === ui.Button.YES) {
      ejecutarAsistenteConfiguracion();
    }
  } catch (error) {
    Logger.log(`Error mostrando bienvenida: ${error.message}`);
  }
}

/**
 * Función principal para mostrar el diálogo de generación de reportes
 * Utiliza el módulo UIManager para manejar la interfaz
 */
function mostrarDialogo() {
  try {
    // Verificar que los manejadores estén disponibles
    if (typeof ErrorManager === 'undefined') {
      Logger.log('ErrorManager no disponible, ejecutando directamente');
      ejecutarMostrarDialogo();
      return;
    }
    
    ErrorManager.executeWithErrorHandling(
      () => ejecutarMostrarDialogo(),
      'Mostrar diálogo principal'
    );
  } catch (error) {
    Logger.log(`Error en mostrarDialogo: ${error.message}`);
    ejecutarMostrarDialogo();
  }
}

/**
 * Lógica principal para mostrar el diálogo de reportes
 * @private
 */
function ejecutarMostrarDialogo() {
  try {
    // Cargar credenciales y verificar configuración
    if (typeof CredManager !== 'undefined' && CredManager.cargarCredenciales) {
      CredManager.cargarCredenciales();
    }
    
    // Verificar si las credenciales están configuradas
    const credencialesOK = (typeof CredManager !== 'undefined' && CredManager.credencialesConfiguradas) 
      ? CredManager.credencialesConfiguradas() 
      : (CONFIG_JIRA.email && CONFIG_JIRA.apiToken);
    
    if (!credencialesOK) {
      const ui = SpreadsheetApp.getUi();
      
      // Verificar qué credenciales faltan específicamente
      let emailOK = false;
      let tokenOK = false;
      
      if (typeof CredManager !== 'undefined') {
        emailOK = CredManager.getEmail() !== '';
        tokenOK = CredManager.getApiToken() !== '';
      }
      
      let mensaje = '⚙️ CREDENCIALES DE JIRA REQUERIDAS\n\n';
      
      if (!emailOK && !tokenOK) {
        mensaje += '❌ Email y API Token no configurados\n\n';
        mensaje += '🚀 RECOMENDADO: Usar "Asistente de Configuración"\n';
        mensaje += 'Te guía paso a paso para configurar todo.\n\n';
        mensaje += '¿Ejecutar el asistente ahora?';
      } else if (!emailOK) {
        mensaje += '❌ Email no configurado\n';
        mensaje += `🔑 Token: ✅ Configurado\n\n`;
        mensaje += '¿Configurar email faltante?';
      } else if (!tokenOK) {
        mensaje += `📧 Email: ✅ Configurado\n`;
        mensaje += '❌ API Token no configurado\n\n';
        mensaje += '¿Configurar token faltante?';
      }
      
      const response = ui.alert('Configuración Incompleta', mensaje, ui.ButtonSet.YES_NO);
      
      if (response === ui.Button.YES) {
        // Usar asistente si no hay nada configurado, sino usar configurador simple
        if (!emailOK && !tokenOK) {
          if (ejecutarAsistenteConfiguracion()) {
            iniciarGeneracionReporte();
          }
        } else {
          if (configurarCredenciales()) {
            iniciarGeneracionReporte();
          }
        }
      }
      return;
    }
    
    // Verificar que tengamos un proyecto configurado
    if (!CONFIG_JIRA.projectKey) {
      const ui = SpreadsheetApp.getUi();
      const response = ui.alert(
        '📂 Proyecto Requerido',
        'Necesitas seleccionar un proyecto de Jira para obtener colaboradores.\n\n¿Deseas seleccionar uno ahora?',
        ui.ButtonSet.YES_NO
      );
      
      if (response === ui.Button.YES) {
        seleccionarProyecto();
        // Después de seleccionar, proceder si ahora tenemos proyecto
        if (CONFIG_JIRA.projectKey) {
          iniciarGeneracionReporte();
        }
      }
      return;
    }
    
    // Todo configurado, mostrar diálogo
    iniciarGeneracionReporte();
    
  } catch (error) {
    Logger.log(`Error ejecutando mostrar diálogo: ${error.message}`);
    const ui = SpreadsheetApp.getUi();
    ui.alert('Error', `Error: ${error.message}\n\nIntenta usar "🔍 Diagnóstico Completo" para identificar el problema.`, ui.ButtonSet.OK);
  }
}

/**
 * Inicia el proceso de generación de reporte
 * @private
 */
function iniciarGeneracionReporte() {
  try {
    if (typeof UIManager !== 'undefined') {
      const uiManager = new UIManager();
      uiManager.mostrarDialogoPrincipal();
    } else {
      // Fallback si UIManager no está disponible
      const ui = SpreadsheetApp.getUi();
      ui.alert('Sistema no Listo', 'El sistema aún se está cargando. Intenta nuevamente en unos momentos.', ui.ButtonSet.OK);
    }
  } catch (error) {
    Logger.log(`Error iniciando generación de reporte: ${error.message}`);
    const ui = SpreadsheetApp.getUi();
    ui.alert('Error', `Error iniciando reporte: ${error.message}`, ui.ButtonSet.OK);
  }
}

// =====================================
// FUNCIONES DE UTILIDAD Y CONFIGURACIÓN
// =====================================

/**
 * Muestra la configuración del sistema
 */
function mostrarConfiguracion() {
  // Cargar credenciales actuales
  CredManager.cargarCredenciales();
  
  const ui = SpreadsheetApp.getUi();
  
  const email = CredManager.getEmail();
  const token = CredManager.getApiToken();
  const project = CredManager.getProjectKey();
  
  const mensaje = `📋 Configuración Actual:\n\n` +
    `🏢 Dominio: ${CONFIG_JIRA.dominio}\n` +
    `📧 Email: ${email || '❌ No configurado'}\n` +
    `🔑 API Token: ${token ? `✅ Configurado (${token.substring(0, 8)}...)` : '❌ No configurado'}\n` +
    `📂 Proyecto: ${project || '❌ No configurado'}\n\n` +
    `Estado: ${CredManager.credencialesConfiguradas() ? '✅ Listo para usar' : '❌ Requiere configuración'}\n\n` +
    `Para cambiar, usa el menú "⚙️ Configuración"`;
  
  ui.alert('👀 Configuración del Sistema', mensaje, ui.ButtonSet.OK);
}

/**
 * Muestra los logs del sistema
 */
function mostrarLogs() {
  const ui = SpreadsheetApp.getUi();
  ui.alert('📊 Logs', 'Los logs se encuentran en Ver > Registros de ejecución', ui.ButtonSet.OK);
}

// =====================================
// FUNCIONES DE INTEGRACIÓN
// =====================================

// Las funciones obtenerListaColaboradores, obtenerListaTareas y reporteCompromisos
// ahora están implementadas en sus respectivos módulos y se mantienen como
// funciones globales para compatibilidad con el sistema existente.

// =====================================
// INFORMACIÓN DEL SISTEMA
// =====================================

/**
 * Retorna información sobre la versión y módulos del sistema
 */
function getSystemInfo() {
  return {
    version: '2.0',
    modules: [
      'config.gs - Configuración del sistema',
      'error-handler.gs - Manejo de errores y logging',
      'jira-api.gs - API de Jira',
      'ui-manager.gs - Interfaz de usuario', 
      'report-generator.gs - Generación de reportes'
    ],
    author: 'Sistema Modularizado de Reportes Jira'
  };
}

// =====================================
// FUNCIONES DE TESTING
// =====================================

/**
 * Función de testing para verificar conectividad con Jira
 */
function testJiraConnection() {
  try {
    // Cargar credenciales primero
    if (typeof CredManager !== 'undefined' && CredManager.cargarCredenciales) {
      CredManager.cargarCredenciales();
    }
    
    const ejecutarTest = () => {
      const jiraAPI = new JiraAPI();
      const colaboradores = jiraAPI.obtenerListaColaboradores();
      
      const ui = SpreadsheetApp.getUi();
      ui.alert(
        'Test de Conexión', 
        `✅ Conexión exitosa!\n\nColaboradores encontrados: ${colaboradores.length}`,
        ui.ButtonSet.OK
      );
    };
    
    if (typeof ErrorManager !== 'undefined' && ErrorManager.executeWithErrorHandling) {
      ErrorManager.executeWithErrorHandling(ejecutarTest, 'Test de conexión Jira');
    } else {
      ejecutarTest();
    }
  } catch (error) {
    Logger.log(`Error en test de conexión: ${error.message}`);
    const ui = SpreadsheetApp.getUi();
    ui.alert('Error en Test', `Error: ${error.message}`, ui.ButtonSet.OK);
  }
}

/**
 * Función de diagnóstico detallado para identificar problemas de configuración
 */
function diagnosticoCompleto() {
  const ui = SpreadsheetApp.getUi();
  
  try {
    Logger.log("🔍 Iniciando diagnóstico completo...");
    
    // 1. Verificar configuración básica
    const configIssues = [];
    
    if (!CONFIG_JIRA.dominio || CONFIG_JIRA.dominio === 'tu-dominio.atlassian.net') {
      configIssues.push('❌ Dominio no configurado');
    } else {
      Logger.log(`✅ Dominio configurado: ${CONFIG_JIRA.dominio}`);
    }
    
    if (!CONFIG_JIRA.email || CONFIG_JIRA.email === 'tu-email@empresa.com') {
      configIssues.push('❌ Email no configurado');
    } else {
      Logger.log(`✅ Email configurado: ${CONFIG_JIRA.email}`);
    }
    
    if (!CONFIG_JIRA.apiToken || CONFIG_JIRA.apiToken === 'tu-api-token-aqui') {
      configIssues.push('❌ API Token no configurado');
    } else {
      Logger.log(`✅ API Token configurado (${CONFIG_JIRA.apiToken.substring(0, 8)}...)`);
    }
    
    if (configIssues.length > 0) {
      ui.alert(
        'Diagnóstico - Configuración',
        `Problemas de configuración encontrados:\n\n${configIssues.join('\n')}\n\nEdita config.gs para corregir.`,
        ui.ButtonSet.OK
      );
      return;
    }
    
    // 2. Test de autenticación básica
    Logger.log("🔐 Probando autenticación básica...");
    const jiraAPI = new JiraAPI();
    const testUrl = `https://${CONFIG_JIRA.dominio}/rest/api/3/myself`;
    
    const response = UrlFetchApp.fetch(testUrl, {
      method: "GET",
      headers: {
        "Authorization": jiraAPI.auth,
        "Accept": "application/json"
      },
      muteHttpExceptions: true
    });
    
    const statusCode = response.getResponseCode();
    const responseText = response.getContentText();
    
    Logger.log(`📡 Respuesta de autenticación: ${statusCode}`);
    Logger.log(`📄 Contenido: ${responseText.substring(0, 200)}...`);
    
    if (statusCode === 200) {
      const userData = JSON.parse(responseText);
      Logger.log(`✅ Autenticación exitosa para: ${userData.displayName}`);
      
      // 3. Probar obtener lista de proyectos accesibles
      const projectsUrl = `https://${CONFIG_JIRA.dominio}/rest/api/3/project`;
      const projectsResponse = UrlFetchApp.fetch(projectsUrl, {
        method: "GET",
        headers: {
          "Authorization": jiraAPI.auth,
          "Accept": "application/json"
        },
        muteHttpExceptions: true
      });
      
      if (projectsResponse.getResponseCode() === 200) {
        const projects = JSON.parse(projectsResponse.getContentText());
        const projectKeys = projects.map(p => p.key).slice(0, 10); // Primeros 10
        
        Logger.log(`📋 Proyectos accesibles: ${projectKeys.join(', ')}`);
        
        ui.alert(
          'Diagnóstico Completo',
          `✅ Autenticación exitosa!\n\n` +
          `Usuario: ${userData.displayName}\n` +
          `Proyectos accesibles (primeros 10): ${projectKeys.join(', ')}\n\n` +
          `Proyecto configurado: ${CONFIG_JIRA.projectKey}\n` +
          `${projectKeys.includes(CONFIG_JIRA.projectKey) ? '✅ El proyecto configurado existe' : '❌ El proyecto configurado NO se encuentra en tu lista'}`,
          ui.ButtonSet.OK
        );
      } else {
        ui.alert(
          'Diagnóstico',
          `✅ Autenticación exitosa, pero no se pudieron obtener proyectos.\n\nCódigo: ${projectsResponse.getResponseCode()}`,
          ui.ButtonSet.OK
        );
      }
      
    } else {
      ui.alert(
        'Diagnóstico - Error de Autenticación',
        `❌ Fallo de autenticación (${statusCode})\n\nRevisa tu email y API token en config.gs\n\nDetalle: ${responseText.substring(0, 200)}`,
        ui.ButtonSet.OK
      );
    }
    
  } catch (error) {
    Logger.log(`❌ Error en diagnóstico: ${error.message}`);
    ui.alert(
      'Error en Diagnóstico',
      `Error: ${error.message}`,
      ui.ButtonSet.OK
    );
  }
}

/**
 * Función de testing para verificar configuración
 */
function testConfiguration() {
  const issues = [];
  
  if (!CONFIG_JIRA.dominio || CONFIG_JIRA.dominio === 'tu-dominio.atlassian.net') {
    issues.push('⚠️ Dominio de Jira no configurado');
  }
  
  if (!CONFIG_JIRA.email || CONFIG_JIRA.email === 'tu-email@empresa.com') {
    issues.push('⚠️ Email no configurado');
  }
  
  if (!CONFIG_JIRA.apiToken || CONFIG_JIRA.apiToken === 'tu-api-token-aqui') {
    issues.push('⚠️ API Token no configurado');
  }
  
  const ui = SpreadsheetApp.getUi();
  
  if (issues.length === 0) {
    ui.alert('Test de Configuración', '✅ Configuración correcta!', ui.ButtonSet.OK);
  } else {
    ui.alert(
      'Test de Configuración', 
      `❌ Problemas encontrados:\n\n${issues.join('\n')}\n\nEdita el archivo config.gs para corregir.`,
      ui.ButtonSet.OK
    );
  }
}