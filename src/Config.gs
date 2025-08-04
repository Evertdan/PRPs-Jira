/**
 * Config.gs - Configuración y constantes para Jira-Sheets Sync
 * Siguiendo estándares CLAUDE.md para Google Apps Script + Atlassian
 */

// OBLIGATORIO: Versionado en cada deployment
const VERSION = '1.0.0';
const BUILD_DATE = '2025-01-04';

// Configuración específica de Jira
const JIRA_CONFIG = {
  PROJECTS: ['PROJ1', 'PROJ2'], // Se sobrescribe desde PropertiesService
  SYNC_INTERVAL: 15, // minutos entre sincronizaciones automáticas
  BATCH_SIZE: 50, // issues por lote para optimizar performance
  MAX_ISSUES: 10000, // límite total para prevenir sobrecarga
  RATE_LIMIT_DELAY: 100, // 100ms = máximo 10 req/seg (límite Jira)
  MAX_RETRY_ATTEMPTS: 3,
  TIMEOUT_MS: 30000 // 30 segundos timeout por request
};

// Configuración de Google Sheets
const SHEETS_CONFIG = {
  MAIN_SHEET: 'Jira Issues',
  LOG_SHEET: 'Sync Log',
  CONFIG_SHEET: 'Configuration',
  METRICS_SHEET: 'Metrics Dashboard'
};

// Schema de columnas en Sheets (orden fijo para performance)
const SHEET_COLUMNS = {
  A: 'Key',           // PROJ-123
  B: 'Summary',       // Título del issue
  C: 'Status',        // To Do, In Progress, Done
  D: 'Assignee',      // Email del asignado
  E: 'Priority',      // High, Medium, Low
  F: 'Issue Type',    // Story, Bug, Task
  G: 'Created',       // Fecha de creación
  H: 'Updated',       // Última actualización
  I: 'Reporter',      // Creador del issue
  J: 'Labels',        // Labels concatenados
  K: 'Sprint',        // Sprint actual
  L: 'Story Points',  // Estimación
  M: 'Components',    // Componentes del proyecto
  N: 'Description',   // Descripción (truncada a 500 chars)
  O: 'Jira URL',      // Link directo al issue
  P: 'Last Sync',     // Timestamp de última sincronización
  Q: 'Sync Status'    // OK, ERROR, PENDING
};

// Límites de Apps Script
const APPS_SCRIPT_LIMITS = {
  EXECUTION_TIME_MS: 6 * 60 * 1000, // 6 minutos máximo
  EXECUTION_BUFFER_MS: 5 * 60 * 1000, // 5 minutos con buffer
  URL_FETCH_DAILY: 20000,
  EMAIL_DAILY: 100,
  PROPERTIES_DAILY: 50000,
  SHEET_CELLS_MAX: 10000000 // 10M celdas por sheet
};

// Rate limiting y quotas
const RATE_LIMITS = {
  JIRA_REQUESTS_PER_SECOND: 10,
  MIN_REQUEST_INTERVAL_MS: 100,
  BATCH_DELAY_MS: 1000,
  EXPONENTIAL_BACKOFF_BASE: 2,
  MAX_BACKOFF_MS: 30000
};

/**
 * Obtiene la configuración completa desde PropertiesService
 * Siguiendo patrón obligatorio de CLAUDE.md para configuración segura
 * @returns {Object} Configuración completa validada
 * @throws {Error} Si faltan propiedades requeridas
 */
function obtenerConfiguracion() {
  const propiedades = PropertiesService.getScriptProperties();
  
  const config = {
    domain: propiedades.getProperty('ATLASSIAN_DOMAIN'),
    email: propiedades.getProperty('ATLASSIAN_EMAIL'),
    apiToken: propiedades.getProperty('ATLASSIAN_API_TOKEN'),
    projects: JSON.parse(propiedades.getProperty('JIRA_PROJECTS') || '[]'),
    sheetId: propiedades.getProperty('SHEET_ID'),
    environment: propiedades.getProperty('ENVIRONMENT') || 'development',
    alertEmail: propiedades.getProperty('ALERT_EMAIL')
  };
  
  // Validar que todas las propiedades críticas estén presentes
  const camposRequeridos = ['domain', 'email', 'apiToken', 'sheetId'];
  camposRequeridos.forEach(campo => {
    if (!config[campo]) {
      throw new Error(`Configuración faltante: ${campo}. Configurar en PropertiesService.`);
    }
  });
  
  // Validar formato domain
  if (!config.domain.includes('.atlassian.net')) {
    throw new Error('ATLASSIAN_DOMAIN debe tener formato: empresa.atlassian.net');
  }
  
  // Validar proyectos
  if (!Array.isArray(config.projects) || config.projects.length === 0) {
    throw new Error('JIRA_PROJECTS debe ser un array JSON con al menos un proyecto');
  }
  
  return config;
}

/**
 * Obtiene configuración específica por entorno
 * Patrón obligatorio de CLAUDE.md para diferentes ambientes
 * @returns {Object} Configuración optimizada por entorno
 */
function obtenerConfiguracionPorEntorno() {
  const entorno = PropertiesService.getScriptProperties().getProperty('ENVIRONMENT') || 'development';
  
  const configuraciones = {
    development: {
      logLevel: 'DEBUG',
      rateLimitDelay: 500, // Más conservador en dev
      maxRetries: 2,
      batchSize: 10, // Lotes pequeños para testing
      syncInterval: 30 // 30 min en dev
    },
    staging: {
      logLevel: 'INFO',
      rateLimitDelay: 200,
      maxRetries: 3,
      batchSize: 25,
      syncInterval: 20 // 20 min en staging
    },
    production: {
      logLevel: 'WARN',
      rateLimitDelay: 100,
      maxRetries: 5,
      batchSize: 50, // Lotes grandes para efficiency
      syncInterval: 15 // 15 min en producción
    }
  };
  
  return configuraciones[entorno] || configuraciones.development;
}

/**
 * Obtiene información de versión del sistema
 * @returns {Object} Información de versión y build
 */
function getVersion() {
  return {
    version: VERSION,
    buildDate: BUILD_DATE,
    environment: PropertiesService.getScriptProperties().getProperty('ENVIRONMENT') || 'development'
  };
}

/**
 * Configuración inicial - EJECUTAR UNA SOLA VEZ
 * Setup de propiedades seguras siguiendo CLAUDE.md
 */
function configurarPropiedadesSeguras() {
  const properties = PropertiesService.getScriptProperties();
  
  // ⚠️ REEMPLAZAR CON VALORES REALES
  const defaultProperties = {
    'ATLASSIAN_DOMAIN': 'tu-empresa.atlassian.net',
    'ATLASSIAN_EMAIL': 'tu-email@empresa.com',
    'ATLASSIAN_API_TOKEN': 'ATATT3xFfGF0...', // Generar en: id.atlassian.com/manage-profile/security/api-tokens
    'JIRA_PROJECTS': '["PROJ1", "PROJ2"]', // JSON array de project keys
    'SHEET_ID': '1Abc-DeF_GhI...', // ID del Google Sheet
    'ENVIRONMENT': 'development',
    'ALERT_EMAIL': 'admin@empresa.com'
  };
  
  // Solo establecer propiedades que no existen
  Object.keys(defaultProperties).forEach(key => {
    if (!properties.getProperty(key)) {
      properties.setProperty(key, defaultProperties[key]);
    }
  });
  
  logEstructurado('SUCCESS', 'Propiedades configuradas', {
    mensaje: 'IMPORTANTE: Actualizar con valores reales antes de usar en producción'
  });
}

/**
 * Mapeo de custom fields por proyecto
 * Configuración específica para campos personalizados de Jira
 * @param {string} projectKey - Clave del proyecto
 * @returns {Object} Mapeo de custom fields
 */
function getCustomFieldsMapping(projectKey) {
  const mappings = {
    'PROJ1': {
      'customfield_10001': 'Story Points',
      'customfield_10002': 'Sprint',
      'customfield_10003': 'Epic Link'
    },
    'PROJ2': {
      'customfield_10004': 'Business Value',
      'customfield_10005': 'Team',
      'customfield_10006': 'Customer Impact'
    }
  };
  
  return mappings[projectKey] || {};
}

/**
 * Validación de datos de entrada para issues
 * Patrón obligatorio de CLAUDE.md para validación
 * @param {Object} datos - Datos del issue a validar
 * @returns {Object} Datos validados y sanitizados
 * @throws {Error} Si faltan campos requeridos
 */
function validarDatosIssue(datos) {
  const camposRequeridos = ['summary', 'project', 'issuetype'];
  
  camposRequeridos.forEach(campo => {
    if (!datos[campo]) {
      throw new Error(`Campo requerido faltante: ${campo}`);
    }
  });
  
  // Sanitizar strings
  if (datos.summary) {
    datos.summary = datos.summary.toString().trim().substring(0, 255);
  }
  
  if (datos.description) {
    // Remover HTML básico para prevenir XSS
    datos.description = datos.description.toString()
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/<[^>]*>/g, '')
      .trim()
      .substring(0, 32767); // Límite de Jira para descripción
  }
  
  return datos;
}

/**
 * Configuración de validación de datos para Google Sheets
 * @returns {Object} Reglas de validación por columna
 */
function getValidationRules() {
  return {
    Status: ['To Do', 'In Progress', 'Code Review', 'Testing', 'Done'],
    Priority: ['Highest', 'High', 'Medium', 'Low', 'Lowest'],
    'Issue Type': ['Epic', 'Story', 'Task', 'Bug', 'Subtask']
  };
}