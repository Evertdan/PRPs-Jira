/**
 * @file Config.gs
 * @description Módulo de configuración central y avanzado para la integración de Google Apps Script con Atlassian.
 * @version 3.0.0
 * @license MIT
 *
 * @summary
 * Este script es el núcleo de la configuración de la aplicación. Gestiona constantes, secretos,
 * configuraciones por entorno (development, staging, production) y proporciona utilidades
 * para una gestión segura y eficiente de las propiedades del proyecto. Implementa un sistema
 * de caché, validación robusta y un setup inicial guiado.
 */

// Caché estático para la configuración para optimizar el rendimiento.
let CONFIG_CACHE = null;

// =============================================
// CONFIGURACIÓN PRINCIPAL Y GESTIÓN DE CACHÉ
// =============================================

/**
 * Obtiene el objeto de configuración completo, fusionando secretos, configuraciones base
 * y ajustes de entorno. Utiliza un caché para evitar lecturas repetidas de PropertiesService.
 * @param {boolean} [forzarRecarga=false] - Si es true, ignora el caché y recarga la configuración.
 * @returns {Object} El objeto de configuración completo y validado.
 * @throws {Error} Si falta configuración crítica o esta es inválida.
 */
function obtenerConfiguracion(forzarRecarga = false) {
  // En la UI, siempre recargamos para reflejar cambios hechos por el usuario.
  if (typeof SpreadsheetApp !== 'undefined' || typeof DocumentApp !== 'undefined') {
    forzarRecarga = true;
  }
  
  if (CONFIG_CACHE && !forzarRecarga) {
    return CONFIG_CACHE;
  }

  logEstructurado('DEBUG', 'Recargando configuración desde PropertiesService...');

  const propiedades = PropertiesService.getScriptProperties();
  const entorno = propiedades.getProperty('ENVIRONMENT') || 'development';

  // Separación clara entre secretos y configuración
  const secrets = {
    atlassianApiToken: propiedades.getProperty('ATLASSIAN_API_TOKEN'),
  };

  const baseConfig = {
    atlassian: {
      domain: propiedades.getProperty('ATLASSIAN_DOMAIN'),
      email: propiedades.getProperty('ATLASSIAN_EMAIL'),
    },
    app: {
      environment: entorno,
      alertEmail: propiedades.getProperty('ALERT_EMAIL'),
      jiraSyncJql: propiedades.getProperty('JIRA_SYNC_JQL'),
      confluenceReportSpaceKey: propiedades.getProperty('CONFLUENCE_REPORT_SPACE_KEY'),
      confluenceReportParentId: propiedades.getProperty('CONFLUENCE_REPORT_PARENT_ID'),
    },
  };

  const environmentConfig = _obtenerConfiguracionEntorno(entorno);
  
  // Fusionar configuraciones en el orden correcto de precedencia.
  const finalConfig = {
    secrets: secrets,
    atlassian: baseConfig.atlassian,
    app: { ...baseConfig.app, ...environmentConfig.app },
    debug: environmentConfig.debug,
  };

  _validarConfiguracion(finalConfig);
  
  CONFIG_CACHE = Object.freeze(finalConfig); // Congelar el objeto para hacerlo inmutable.
  return CONFIG_CACHE;
}

/**
 * Define y retorna las configuraciones específicas para cada entorno.
 * @param {string} entorno - El entorno actual.
 * @returns {Object} La configuración para el entorno especificado.
 * @private
 */
function _obtenerConfiguracionEntorno(entorno) {
  const configuraciones = {
    development: {
      app: {
        logLevel: 'DEBUG',
        maxRetries: 2,
        batchSize: 5,
        enableMetrics: true,
        enableAlerts: false,
      },
      debug: {
        verboseLogging: true,
        skipValidation: false,
      },
    },
    staging: {
      app: {
        logLevel: 'INFO',
        maxRetries: 3,
        batchSize: 25,
        enableMetrics: true,
        enableAlerts: true,
      },
      debug: {
        verboseLogging: false,
        skipValidation: false,
      },
    },
    production: {
      app: {
        logLevel: 'WARN',
        maxRetries: 5,
        batchSize: 50,
        enableMetrics: true,
        enableAlerts: true,
      },
      debug: {
        verboseLogging: false,
        skipValidation: false,
      },
    },
  };
  return configuraciones[entorno] || configuraciones.development;
}


// =============================================
// VALIDACIÓN DE CONFIGURACIÓN
// =============================================

/**
 * Orquesta la validación completa del objeto de configuración.
 * @param {Object} config - El objeto de configuración a validar.
 * @private
 */
function _validarConfiguracion(config) {
  if (config.debug.skipValidation) {
    logEstructurado('WARN', 'Saltando validación de configuración debido a la bandera SKIP_VALIDATION.');
    return;
  }
  _validarCamposRequeridos(config);
  _validarFormatos(config);
  _validarRangos(config);
  _validarDependencias(config);
}

function _validarCamposRequeridos(config) {
  const camposRequeridos = {
    'atlassian.domain': config.atlassian.domain,
    'atlassian.email': config.atlassian.email,
    'secrets.atlassianApiToken': config.secrets.atlassianApiToken,
  };
  for (const [key, value] of Object.entries(camposRequeridos)) {
    if (!value || String(value).trim() === '') {
      throw new Error(`Configuración crítica faltante: '${key}'. Ejecute el setup o configure la propiedad manualmente.`);
    }
  }
}

function _validarFormatos(config) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!/^[a-zA-Z0-9-]+\.atlassian\.net$/.test(config.atlassian.domain)) {
    throw new Error(`Formato de 'ATLASSIAN_DOMAIN' inválido. Debe ser 'sudominio.atlassian.net'.`);
  }
  if (!emailRegex.test(config.atlassian.email)) {
    throw new Error(`Formato de 'ATLASSIAN_EMAIL' inválido.`);
  }
  if (config.app.alertEmail && !emailRegex.test(config.app.alertEmail)) {
    throw new Error(`Formato de 'ALERT_EMAIL' inválido.`);
  }
}

function _validarRangos(config) {
  if (config.app.maxRetries < 0 || config.app.maxRetries > 10) throw new Error(`'maxRetries' debe estar entre 0 y 10.`);
  if (config.app.batchSize < 1 || config.app.batchSize > 100) throw new Error(`'batchSize' debe estar entre 1 y 100.`);
}

function _validarDependencias(config) {
  if (config.app.enableAlerts && !config.app.alertEmail) {
    throw new Error("Las alertas están habilitadas ('ENABLE_ALERTS' = true) pero no se ha configurado un 'ALERT_EMAIL'.");
  }
}


// =============================================
// SETUP Y GESTIÓN DE PROPIEDADES
// =============================================

/**
 * Ejecuta la configuración inicial del proyecto.
 * Establece propiedades por defecto y guía al usuario para configurar los secretos.
 */
function setupInicial() {
  logEstructurado('INFO', '🚀 Iniciando setup del proyecto...');
  try {
    _configurarPropiedadesPorDefecto();
    _verificarConfiguracionCritica();
    _crearHojaDeConfiguracion();
    logEstructurado('SUCCESS', '✅ Setup inicial completado. Revise la hoja "Configuración del Proyecto" y los logs para los siguientes pasos.');
    mostrarMensaje('Setup Completado', 'El setup inicial ha finalizado. Por favor, revise la nueva hoja de "Configuración del Proyecto" para continuar.');
  } catch (error) {
    logEstructurado('ERROR', `❌ Error en setup inicial: ${error.message}`);
    throw error;
  }
}

function _configurarPropiedadesPorDefecto() {
  const propiedades = PropertiesService.getScriptProperties();
  const defaultProps = {
    'ENVIRONMENT': 'development',
    'LOG_LEVEL': 'INFO',
    'ENABLE_METRICS': 'true',
    'ENABLE_ALERTS': 'false',
    'ATLASSIAN_DOMAIN': '',
    'ATLASSIAN_EMAIL': '',
    'ATLASSIAN_API_TOKEN': '',
    'ALERT_EMAIL': '',
    'JIRA_SYNC_JQL': 'project = "PROJ" AND status != "Done"',
    'CONFLUENCE_REPORT_SPACE_KEY': 'DOCS',
    'CONFLUENCE_REPORT_PARENT_ID': '',
  };
  let configuradas = 0;
  for (const key in defaultProps) {
    if (propiedades.getProperty(key) === null) {
      propiedades.setProperty(key, defaultProps[key]);
      configuradas++;
    }
  }
  if (configuradas > 0) logEstructurado('DEBUG', `📝 ${configuradas} propiedades configuradas con valores por defecto.`);
}

function _verificarConfiguracionCritica() {
  const propiedades = PropertiesService.getScriptProperties();
  const propiedadesCriticas = ['ATLASSIAN_DOMAIN', 'ATLASSIAN_EMAIL', 'ATLASSIAN_API_TOKEN'];
  const faltantes = propiedadesCriticas.filter(prop => !propiedades.getProperty(prop));
  if (faltantes.length > 0) {
    const mensaje = `⚠️ ACCIÓN REQUERIDA: Configure manualmente las siguientes propiedades críticas en 'Archivo -> Propiedades del proyecto -> Propiedades del script' o usando la hoja de configuración:\n- ${faltantes.join('\n- ')}`;
    logEstructurado('WARN', mensaje);
  } else {
    logEstructurado('INFO', '✅ Todas las credenciales críticas de Atlassian están configuradas.');
  }
}

function _crearHojaDeConfiguracion() {
  if (typeof SpreadsheetApp === 'undefined') return;
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName('Configuración del Proyecto');
  if (sheet) {
    logEstructurado('INFO', 'La hoja de configuración ya existe.');
    return;
  }
  sheet = ss.insertSheet('Configuración del Proyecto');
  sheet.getRange('A1:C1').setValues([['Propiedad', 'Valor Actual', 'Descripción']]).setFontWeight('bold').setBackground('#f0f0f0');
  const propiedades = PropertiesService.getScriptProperties().getProperties();
  const data = Object.entries(propiedades).map(([key, value]) => [key, value, '']);
  sheet.getRange(2, 1, data.length, data[0].length).setValues(data);
  sheet.autoResizeColumns(1, 3);
  logEstructurado('SUCCESS', 'Hoja "Configuración del Proyecto" creada. Úsela para gestionar las propiedades y luego cárguelas.');
}


// =============================================
// FUNCIONES DE UTILIDAD DE CONFIGURACIÓN
// =============================================

/**
 * Comprueba si el entorno actual es 'production'.
 * @returns {boolean} True si el entorno es producción.
 */
function esModoProduccion() {
  return obtenerConfiguracion().app.environment === 'production';
}

/**
 * Determina si se debe registrar un log basado en el nivel de log configurado.
 * @param {string} nivel - El nivel del mensaje a registrar (ej. 'DEBUG', 'INFO').
 * @returns {boolean} True si el mensaje debe ser registrado.
 */
function deberiaRegistrarLog(nivel) {
  const niveles = { DEBUG: 0, INFO: 1, WARN: 2, ERROR: 3 };
  const nivelConfigurado = obtenerConfiguracion().app.logLevel.toUpperCase();
  return niveles[nivel] >= (niveles[nivelConfigurado] || niveles.INFO);
}

/**
 * Exporta la configuración actual (sin secretos) para ser mostrada en la UI.
 * @returns {Object} Un objeto seguro para mostrar en el frontend.
 */
function exportarConfiguracion() {
  const config = obtenerConfiguracion();
  return {
    version: getVersion(),
    environment: config.app.environment,
    settings: {
      atlassianDomain: config.atlassian.domain,
      atlassianEmail: config.atlassian.email,
      logLevel: config.app.logLevel,
      metricsEnabled: config.app.enableMetrics,
      alertsEnabled: config.app.enableAlerts,
    },
  };
}
