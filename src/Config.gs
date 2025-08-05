/**
 * Config.gs - Configuración central del sistema Jira-Sheets unificado
 * Implementa patrones obligatorios de CLAUDE.md
 * Integra funcionalidades de reportes de sprints y análisis de entregables
 */

// OBLIGATORIO: Versionado en cada deployment
const VERSION = '2.0.1';
const BUILD_DATE = '2025-08-04';

// Configuración específica de Jira
const JIRA_CONFIG = {
  SYNC_INTERVAL: 15, // minutos entre sincronizaciones automáticas
  BATCH_SIZE:    50,    // issues por lote para optimizar performance
  MAX_ISSUES: 10000, // límite total para prevenir sobrecarga
};

// Configuración de Google Sheets
const SHEETS_CONFIG = {
  MAIN_SHEET: 'Jira Issues',
  LOG_SHEET: 'Sync Log',
  CONFIG_SHEET: 'Configuration',
  METRICS_SHEET: 'Metrics Dashboard',
  SPRINT_REPORTS_PREFIX: 'Sprint_',
  ERROR_LOG_SHEET: 'Error Logs'
};

// Schema de columnas en Sheets (orden fijo para performance)
const SHEET_COLUMNS = {
  A: 'Key', B: 'Summary', C: 'Status', D: 'Assignee', E: 'Priority',
  F: 'Issue Type', G: 'Created', H: 'Updated', I: 'Reporter', J: 'Labels',
  K: 'Sprint', L: 'Story Points', M: 'Components', N: 'Description',
  O: 'Jira URL', P: 'Last Sync', Q: 'Sync Status',
  // Columnas de Análisis de Entregables
  R: 'Deliverables Score', S: 'Quality Level', T: 'Deliverables Summary',
  U: 'Attachments', V: 'Comments'
};

// Límites de Apps Script
const APPS_SCRIPT_LIMITS = {
  EXECUTION_TIME_MS: 6 * 60 * 1000,
  EXECUTION_BUFFER_MS: 5 * 60 * 1000, // 5 minutos con buffer
  URL_FETCH_DAILY: 20000,
  EMAIL_DAILY: 100,
  PROPERTIES_DAILY: 50000,
  SHEET_CELLS_MAX: 10000000
};

// Rate limiting y quotas
const RATE_LIMITS = {
  MIN_REQUEST_INTERVAL_MS: 100, // 10 req/seg
  BATCH_DELAY_MS: 1000,
  EXPONENTIAL_BACKOFF_BASE: 2,
  MAX_BACKOFF_MS: 30000
};

/**
 * Obtiene la configuración completa desde PropertiesService.
 * Esta es la única función que se debe usar para leer la configuración.
 * @returns {Object} Configuración completa validada.
 * @throws {Error} Si faltan propiedades requeridas.
 */
function obtenerConfiguracion() {
  const propiedades = PropertiesService.getScriptProperties();
  
  const config = {
    domain: propiedades.getProperty('ATLASSIAN_DOMAIN'),
    email: propiedades.getProperty('ATLASSIAN_EMAIL'),
    apiToken: propiedades.getProperty('ATLASSIAN_API_TOKEN'),
    projects: JSON.parse(propiedades.getProperty('JIRA_PROJECTS') || '[]'),
    sheetId: propiedades.getProperty('SHEET_ID'),
    environment: propiedades.getProperty('ENVIRONMENT') || 'production',
    alertEmail: propiedades.getProperty('ALERT_EMAIL')
  };
  
  const camposRequeridos = ['domain', 'email', 'apiToken', 'sheetId', 'projects'];
  for (const campo of camposRequeridos) {
    if (!config[campo] || (Array.isArray(config[campo]) && config[campo].length === 0)) {
      throw new Error(`Configuración faltante o inválida: '${campo}'. Por favor, ejecute la configuración desde el menú: "Jira Sync" > "🏢 Configurar CC Soft"`);
    }
  }
  
  // Normalizar dominio
  config.domain = config.domain.replace(/https?:\]\/\//, '');
  if (!config.domain.includes('.atlassian.net')) {
    throw new Error('El formato de ATLASSIAN_DOMAIN es inválido. Debe ser "empresa.atlassian.net".');
  }
  
  return config;
}

/**
 * Obtiene información de versión del sistema.
 * @returns {Object} Información de versión y build.
 */
function getVersion() {
  return {
    version: VERSION,
    buildDate: BUILD_DATE,
    environment: PropertiesService.getScriptProperties().getProperty('ENVIRONMENT') || 'production'
  };
}

/**
 * Configura las credenciales y propiedades del sistema.
 * Este es el método principal y recomendado para la configuración inicial.
 */
function configurarCredencialesCCSoft() {
  const ui = SpreadsheetApp.getUi();
  try {
    const properties = PropertiesService.getScriptProperties();
    const sheetId = SpreadsheetApp.getActiveSpreadsheet().getId();

    const ccSoftProperties = {
      'ATLASSIAN_DOMAIN': 'ccsoft.atlassian.net',
      'ATLASSIAN_EMAIL': 'computocontable@gmail.com',
      'ATLASSIAN_API_TOKEN': '',
      'JIRA_PROJECTS': '["CCSOFT"]',
      'SHEET_ID': sheetId,
      'ENVIRONMENT': 'production',
      'ALERT_EMAIL': 'computocontable@gmail.com'
    };

    properties.setProperties(ccSoftProperties, false);
    
    logEstructurado('SUCCESS', '✅ Credenciales CC Soft configuradas correctamente.', {
      domain: ccSoftProperties.ATLASSIAN_DOMAIN,
      sheetId: sheetId.substring(0, 10) + '...'
    });

    testConectividadAtlassian();
    logEstructurado('SUCCESS', '🟢 Conectividad verificada exitosamente.');
    
    ui.alert('✅ Configuración Exitosa', 
      'Credenciales de CC Soft configuradas y verificadas:\n\n' + 
      '✓ Dominio: ' + ccSoftProperties.ATLASSIAN_DOMAIN + '\n' + 
      '✓ Email: ' + ccSoftProperties.ATLASSIAN_EMAIL + '\n' + 
      '✓ Proyectos: ' + ccSoftProperties.JIRA_PROJECTS + '\n' + 
      '✓ Sheet ID: Detectado automáticamente\n\n' + 
      'El sistema está listo para usar.',
      ui.ButtonSet.OK
    );
    
  } catch (error) {
    logEstructurado('ERROR', '🔴 Error en la configuración o conectividad', { error: error.message });
    ui.alert('⚠️ Error de Configuración', 
      'Ocurrió un error:\n\n' + error.message + '\n\n' +
      'Verifica que:\n' + 
      '• El token de API sea válido y no haya expirado.\n' + 
      '• Tengas permisos en el dominio Jira de CC Soft.',
      ui.ButtonSet.OK
    );
  }
}

/**
 * Mapeo de custom fields por proyecto.
 * @param {string} projectKey - Clave del proyecto.
 * @returns {Object} Mapeo de custom fields.
 */
function getCustomFieldsMapping(projectKey) {
  const mappings = {
    'CCSOFT': {
      'customfield_10016': 'Story Points',
      'customfield_10020': 'Sprint',
      'customfield_10003': 'Epic Link',
      'customfield_10230': 'Comentarios Adicionales',
      'customfield_10231': 'Desviaciones'
    }
  };
  return mappings[projectKey] || {};
}

/**
 * Validación de datos de entrada para issues.
 * @param {Object} datos - Datos del issue a validar.
 * @returns {Object} Datos validados y sanitizados.
 * @throws {Error} Si faltan campos requeridos.
 */
function validarDatosIssue(datos) {
  const camposRequeridos = ['summary', 'project', 'issuetype'];
  for (const campo of camposRequeridos) {
    if (!datos[campo]) throw new Error(`Campo requerido faltante: ${campo}`);
  }

  if (datos.summary) {
    datos.summary = datos.summary.toString().trim().substring(0, 255);
  }
  
  if (datos.description) {
    datos.description = datos.description.toString()
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/<[^>]*>/g, '')
      .trim()
      .substring(0, 32767);
  }
  
  return datos;
}

/**
 * Configuración de validación de datos para Google Sheets.
 * @returns {Object} Reglas de validación por columna.
 */
function getValidationRules() {
  return {
    Status: ['To Do', 'In Progress', 'Done', 'Blocked', 'In Review'],
    Priority: ['Highest', 'High', 'Medium', 'Low', 'Lowest'],
    'Issue Type': ['Story', 'Task', 'Bug', 'Epic', 'Sub-task']
  };
}

// ========================================
// CONFIGURACIÓN DE ANÁLISIS DE ENTREGABLES
// ========================================

const CONFIG_ENTREGABLES = {
  PESOS: {
    ARCHIVO_ADJUNTO: 5, IMAGEN_ADJUNTO: 7, PULL_REQUEST: 15, COMMIT: 10,
    ENLACE_EXTERNO: 3, COMENTARIO_DETALLADO: 2, CAMPO_PERSONALIZADO: 4, WORKLOG_ENTRY: 3
  },
  NIVELES: {
    EXCELENTE: { min: 25, texto: 'Excelente', color: '#E3FCEF', emoji: '🟢' },
    BUENO: { min: 15, texto: 'Bueno', color: '#FFF0B3', emoji: '🟡' },
    BASICO: { min: 8, texto: 'Básico', color: '#FEF2E0', emoji: '🟠' },
    INSUFICIENTE: { min: 3, texto: 'Insuficiente', color: '#FFEBE6', emoji: '🔴' },
    SIN_EVIDENCIA: { min: 0, texto: 'Sin Evidencia', color: '#EBECF0', emoji: '⚪' }
  }
};

const CAMPOS_ENTREGABLES = {
  comentarios: 'customfield_10230',
  desviaciones: 'customfield_10231',
  storyPoints: 'customfield_10016',
  epic: 'customfield_10003',
  sprint: 'customfield_10020'
};

// ========================================
// CONFIGURACIÓN DE CACHE
// ========================================

const CACHE_CONFIG = {
  PROJECTS: 'JIRA_PROJECTS_CACHE',
  SPRINTS: 'JIRA_SPRINTS_CACHE',
  DEFAULT_EXPIRATION: 3600 // 1 hora en segundos
};

// ========================================
// SETUP Y TESTS DE CONFIGURACIÓN
// ========================================

/**
 * Setup inicial completo del sistema.
 */
function setupInicial() {
  const ui = SpreadsheetApp.getUi();
  logEstructurado('INFO', '🚀 Iniciando setup inicial del sistema...');
  
  try {
    // 1. Configurar y verificar credenciales
    configurarCredencialesCCSoft();
    
    // 2. Crear estructura de hojas
    crearEstructuraCompletaSheets();
    
    // 3. Configurar triggers
    configurarTriggers();
    
    // 4. Inicializar monitoreo
    new QuotaManager().reset();
    new MetricsCollector().reset();
    
    logEstructurado('SUCCESS', '✅ Setup inicial completado.');
    ui.alert('🎉 Setup Completado', 'El sistema ha sido configurado exitosamente y está listo para usar.', ui.ButtonSet.OK);
    
  } catch (error) {
    logEstructurado('ERROR', '❌ Error en setup inicial', { error: error.message });
    ui.alert('❌ Error en Setup', 'Ocurrió un error: ' + error.message, ui.ButtonSet.OK);
    throw error;
  }
}

/**
 * Test básico de conectividad con Atlassian.
 */
function testConectividadAtlassian() {
  try {
    const config = obtenerConfiguracion();
    const options = {
      method: 'GET',
      headers: { 
        "Authorization": "Basic " + Utilities.base64Encode(config.email + ":" + config.apiToken),
        "Content-Type": "application/json"
      },
      muteHttpExceptions: true
    };

    const url = `https://${config.domain}/rest/api/3/myself`;
    const response = UrlFetchApp.fetch(url, options);
    
    if (response.getResponseCode() !== 200) {
      throw new Error(`Fallo de conectividad: HTTP ${response.getResponseCode()}. Verifique el token de API y los permisos.`);
    }
    
    const userData = JSON.parse(response.getContentText());
    logEstructurado('SUCCESS', 'Conectividad Atlassian verificada', { user: userData.displayName });
    return true;
    
  } catch (error) {
    logEstructurado('ERROR', 'Error de conectividad Atlassian', { error: error.message });
    throw new Error(`Test de conectividad falló: ${error.message}`);
  }
}
