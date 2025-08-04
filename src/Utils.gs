/**
 * Utils.gs - Utilidades comunes y helpers
 * Implementa patrones obligatorios de CLAUDE.md: logging, métricas, manejo de quotas
 */

/**
 * Logging estructurado obligatorio según CLAUDE.md
 * @param {string} nivel - Nivel del log: DEBUG, INFO, WARN, ERROR, SUCCESS
 * @param {string} mensaje - Mensaje descriptivo
 * @param {Object} contexto - Contexto adicional para debugging
 */
function logEstructurado(nivel, mensaje, contexto = {}) {
  const timestamp = new Date().toISOString();
  const logEntry = {
    timestamp,
    nivel,
    mensaje,
    contexto,
    version: VERSION
  };
  
  // Google Apps Script Logger
  Logger.log(JSON.stringify(logEntry));
  
  // Console para debugging interactivo
  console.log(`[${nivel}] ${mensaje}`, contexto);
  
  // Para errores, también usar console.error
  if (nivel === 'ERROR') {
    console.error(mensaje, contexto);
  }
  
  // Registrar en hoja de logs si está disponible
  try {
    registrarEnSheetLogs(nivel, mensaje, contexto);
  } catch (error) {
    // No fallar si no se puede escribir en sheet
    console.warn('No se pudo escribir en sheet de logs:', error.message);
  }
}

/**
 * Registra eventos en la hoja de logs
 * @param {string} nivel - Nivel del evento
 * @param {string} mensaje - Mensaje del evento
 * @param {Object} contexto - Contexto adicional
 */
function registrarEnSheetLogs(nivel, mensaje, contexto) {
  try {
    const config = obtenerConfiguracion();
    const spreadsheet = SpreadsheetApp.openById(config.sheetId);
    let logSheet = spreadsheet.getSheetByName(SHEETS_CONFIG.LOG_SHEET);
    
    if (!logSheet) {
      logSheet = spreadsheet.insertSheet(SHEETS_CONFIG.LOG_SHEET);
      logSheet.getRange(1, 1, 1, 4).setValues([['Timestamp', 'Level', 'Message', 'Context']]);
    }
    
    // Limitar logs a últimas 1000 entradas
    if (logSheet.getLastRow() > 1000) {
      logSheet.deleteRows(2, 100); // Eliminar las 100 más antiguas
    }
    
    const rowData = [
      new Date(),
      nivel,
      mensaje,
      JSON.stringify(contexto)
    ];
    
    logSheet.appendRow(rowData);
  } catch (error) {
    // No fallar por errores de logging
    console.warn('Error registrando en sheet logs:', error.message);
  }
}

/**
 * Registrar evento de sincronización específico
 * @param {string} mensaje - Mensaje del evento
 * @param {string} status - Estado: SUCCESS, ERROR, WARNING
 * @param {Object} detalles - Detalles adicionales
 */
function registrarEventoSync(mensaje, status = 'INFO', detalles = {}) {
  const evento = {
    tipo: 'SYNC_EVENT',
    status,
    detalles,
    timestamp: new Date().toISOString()
  };
  
  logEstructurado('INFO', `[SYNC] ${mensaje}`, evento);
}

/**
 * Clase obligatoria para monitoreo de uso de recursos
 * Siguiendo patrón de CLAUDE.md
 */
class QuotaManager {
  constructor() {
    this.contadores = JSON.parse(
      PropertiesService.getScriptProperties().getProperty('QUOTA_COUNTERS') || '{}'
    );
    this.inicializarContadoresDelDia();
  }
  
  /**
   * Inicializa contadores para el día actual
   */
  inicializarContadoresDelDia() {
    const hoy = new Date().toDateString();
    if (!this.contadores[hoy]) {
      this.contadores[hoy] = {};
    }
  }
  
  /**
   * Incrementa contador de un recurso específico
   * @param {string} recurso - Tipo de recurso (urlFetch, email, properties)
   * @param {number} valor - Valor a incrementar (default: 1)
   */
  incrementar(recurso, valor = 1) {
    const hoy = new Date().toDateString();
    
    this.contadores[hoy][recurso] = (this.contadores[hoy][recurso] || 0) + valor;
    this.guardar();
    
    // Verificar límites y alertar si está cerca
    this.verificarLimites(recurso);
  }
  
  /**
   * Verifica si un recurso está cerca de su límite diario
   * @param {string} recurso - Recurso a verificar
   */
  verificarLimites(recurso) {
    const hoy = new Date().toDateString();
    const uso = this.contadores[hoy][recurso] || 0;
    
    const LIMITES = {
      'urlFetch': APPS_SCRIPT_LIMITS.URL_FETCH_DAILY,
      'email': APPS_SCRIPT_LIMITS.EMAIL_DAILY,
      'properties': APPS_SCRIPT_LIMITS.PROPERTIES_DAILY
    };
    
    const limite = LIMITES[recurso];
    if (!limite) return;
    
    const porcentajeUso = (uso / limite) * 100;
    
    if (porcentajeUso > 90) {
      logEstructurado('ERROR', `🚨 Quota crítica: ${recurso}`, {
        uso,
        limite,
        porcentaje: porcentajeUso.toFixed(1)
      });
    } else if (porcentajeUso > 75) {
      logEstructurado('WARN', `⚠️ Quota alta: ${recurso}`, {
        uso,
        limite,
        porcentaje: porcentajeUso.toFixed(1)
      });
    }
  }
  
  /**
   * Obtiene el uso actual de un recurso
   * @param {string} recurso - Recurso a consultar
   * @returns {number} Uso actual del día
   */
  getUso(recurso) {
    const hoy = new Date().toDateString();
    return this.contadores[hoy][recurso] || 0;
  }
  
  /**
   * Guarda contadores en PropertiesService
   */
  guardar() {
    try {
      // Limpiar datos antiguos (más de 7 días)
      const hoy = new Date();
      const haceUnaSemana = new Date(hoy.getTime() - 7 * 24 * 60 * 60 * 1000);
      
      Object.keys(this.contadores).forEach(fecha => {
        if (new Date(fecha) < haceUnaSemana) {
          delete this.contadores[fecha];
        }
      });
      
      PropertiesService.getScriptProperties().setProperty(
        'QUOTA_COUNTERS',
        JSON.stringify(this.contadores)
      );
      
      this.incrementar('properties'); // Contar esta operación
    } catch (error) {
      logEstructurado('ERROR', 'Error guardando contadores de quota', { error: error.message });
    }
  }
  
  /**
   * Resetea contadores (para testing o mantenimiento)
   */
  reset() {
    this.contadores = {};
    this.guardar();
    logEstructurado('INFO', 'Contadores de quota reseteados');
  }
}

/**
 * Clase obligatoria para métricas y monitoreo
 * Siguiendo patrón de CLAUDE.md
 */
class MetricsCollector {
  constructor() {
    this.metrics = JSON.parse(
      PropertiesService.getScriptProperties().getProperty('METRICS') || '{}'
    );
    this.inicializarMetricasDelDia();
  }
  
  /**
   * Inicializa métricas para el día actual
   */
  inicializarMetricasDelDia() {
    const hoy = new Date().toDateString();
    if (!this.metrics[hoy]) {
      this.metrics[hoy] = {};
    }
  }
  
  /**
   * Incrementa un contador de métrica
   * @param {string} metrica - Nombre de la métrica
   * @param {number} valor - Valor a incrementar (default: 1)
   */
  incrementCounter(metrica, valor = 1) {
    const hoy = new Date().toDateString();
    this.metrics[hoy][metrica] = (this.metrics[hoy][metrica] || 0) + valor;
    this.guardar();
  }
  
  /**
   * Registra tiempo de ejecución de una operación
   * @param {string} operacion - Nombre de la operación
   * @param {number} tiempoMs - Tiempo en milisegundos
   */
  recordTiming(operacion, tiempoMs) {
    const hoy = new Date().toDateString();
    
    this.incrementCounter(`${operacion}_count`);
    
    // Calcular tiempo promedio
    const promedioKey = `${operacion}_avg_ms`;
    const count = this.metrics[hoy][`${operacion}_count`] || 1;
    const promedioAnterior = this.metrics[hoy][promedioKey] || 0;
    
    const nuevoPromedio = ((promedioAnterior * (count - 1)) + tiempoMs) / count;
    this.metrics[hoy][promedioKey] = Math.round(nuevoPromedio);
    
    // Registrar también el máximo
    const maxKey = `${operacion}_max_ms`;
    this.metrics[hoy][maxKey] = Math.max(this.metrics[hoy][maxKey] || 0, tiempoMs);
    
    this.guardar();
  }
  
  /**
   * Registra un error con contexto
   * @param {string} tipoError - Tipo de error
   * @param {Object} contexto - Contexto del error
   */
  recordError(tipoError, contexto = {}) {
    this.incrementCounter('errors_total');
    this.incrementCounter(`error_${tipoError}`);
    
    logEstructurado('ERROR', `Error registrado: ${tipoError}`, contexto);
  }
  
  /**
   * Obtiene reporte de métricas del día actual
   * @returns {Object} Métricas del día
   */
  getMetricsReport() {
    const hoy = new Date().toDateString();
    return this.metrics[hoy] || {};
  }
  
  /**
   * Guarda métricas en PropertiesService
   */
  guardar() {
    try {
      // Limpiar métricas antiguas (más de 7 días)
      const hoy = new Date();
      const haceUnaSemana = new Date(hoy.getTime() - 7 * 24 * 60 * 60 * 1000);
      
      Object.keys(this.metrics).forEach(fecha => {
        if (new Date(fecha) < haceUnaSemana) {
          delete this.metrics[fecha];
        }
      });
      
      PropertiesService.getScriptProperties().setProperty('METRICS', JSON.stringify(this.metrics));
    } catch (error) {
      logEstructurado('ERROR', 'Error guardando métricas', { error: error.message });
    }
  }
}

/**
 * Extrae texto plano de contenido ADF (Atlassian Document Format)
 * @param {Object} adfContent - Contenido en formato ADF
 * @returns {string} Texto plano extraído
 */
function extractPlainTextFromADF(adfContent) {
  if (!adfContent || !adfContent.content) return '';
  
  let plainText = '';
  
  /**
   * Función recursiva para traversar el árbol ADF
   * @param {Object} node - Nodo del árbol ADF
   */
  function traverse(node) {
    if (node.type === 'text') {
      plainText += node.text;
    } else if (node.type === 'hardBreak') {
      plainText += '\n';
    } else if (node.content) {
      node.content.forEach(traverse);
    }
    
    // Agregar salto de línea después de párrafos
    if (node.type === 'paragraph') {
      plainText += '\n';
    }
  }
  
  try {
    adfContent.content.forEach(traverse);
    return plainText.trim().substring(0, 500); // Limitar a 500 caracteres
  } catch (error) {
    logEstructurado('WARN', 'Error extrayendo texto de ADF', { error: error.message });
    return '[Error extrayendo descripción]';
  }
}

/**
 * Obtiene valor de custom field usando el mapeo del proyecto
 * @param {Object} fields - Campos del issue de Jira
 * @param {Object} customFieldsMapping - Mapeo de custom fields
 * @param {string} fieldName - Nombre del campo a buscar
 * @returns {string} Valor del campo o cadena vacía
 */
function getCustomFieldValue(fields, customFieldsMapping, fieldName) {
  // Buscar el ID del custom field
  const customFieldId = Object.keys(customFieldsMapping).find(
    id => customFieldsMapping[id] === fieldName
  );
  
  if (!customFieldId || !fields[customFieldId]) {
    return '';
  }
  
  const fieldValue = fields[customFieldId];
  
  // Manejar diferentes tipos de custom fields
  if (typeof fieldValue === 'string' || typeof fieldValue === 'number') {
    return fieldValue.toString();
  }
  
  if (fieldValue && fieldValue.name) {
    return fieldValue.name; // Para campos de tipo option
  }
  
  if (fieldValue && fieldValue.displayName) {
    return fieldValue.displayName; // Para campos de usuario
  }
  
  if (Array.isArray(fieldValue)) {
    return fieldValue.map(item => item.name || item.displayName || item.toString()).join(', ');
  }
  
  return fieldValue ? fieldValue.toString() : '';
}

/**
 * Transforma un issue de Jira a fila de Google Sheets
 * @param {Object} issue - Issue de Jira
 * @returns {Array} Array de valores para la fila de Sheets
 */
function transformJiraIssueToSheetRow(issue) {
  const customFields = getCustomFieldsMapping(issue.fields.project.key);
  const config = obtenerConfiguracion();
  
  return [
    issue.key,                                               // A: Key
    issue.fields.summary || '',                              // B: Summary
    issue.fields.status?.name || '',                         // C: Status
    issue.fields.assignee?.emailAddress || '',               // D: Assignee
    issue.fields.priority?.name || 'Medium',                 // E: Priority
    issue.fields.issuetype?.name || '',                      // F: Issue Type
    issue.fields.created ? new Date(issue.fields.created) : '', // G: Created
    issue.fields.updated ? new Date(issue.fields.updated) : '', // H: Updated
    issue.fields.reporter?.emailAddress || '',               // I: Reporter
    (issue.fields.labels || []).join(', '),                 // J: Labels
    getCustomFieldValue(issue.fields, customFields, 'Sprint'), // K: Sprint
    getCustomFieldValue(issue.fields, customFields, 'Story Points'), // L: Story Points
    (issue.fields.components || []).map(c => c.name).join(', '), // M: Components
    extractPlainTextFromADF(issue.fields.description),       // N: Description
    `https://${config.domain}/browse/${issue.key}`,          // O: Jira URL
    new Date(),                                              // P: Last Sync
    'OK'                                                     // Q: Sync Status
  ];
}

/**
 * Operación crítica con lock para prevenir ejecuciones concurrentes
 * Patrón obligatorio de CLAUDE.md
 * @param {Function} operacion - Función a ejecutar
 * @param {*} parametros - Parámetros para la función
 * @returns {*} Resultado de la operación
 */
function operacionCriticaConLock(operacion, parametros) {
  const lock = LockService.getScriptLock();
  const lockTimeout = 30000; // 30 segundos
  
  try {
    if (!lock.waitLock(lockTimeout)) {
      throw new Error('No se pudo obtener el lock - otra sincronización en curso');
    }
    
    logEstructurado('INFO', 'Lock obtenido, ejecutando operación crítica');
    return operacion(parametros);
    
  } catch (error) {
    logEstructurado('ERROR', 'Error en operación crítica', { 
      error: error.message,
      parametros: typeof parametros === 'object' ? JSON.stringify(parametros).substring(0, 200) : parametros
    });
    throw error;
  } finally {
    lock.releaseLock();
    logEstructurado('INFO', 'Lock liberado');
  }
}

/**
 * Procesa elementos en lotes respetando límites de tiempo de Apps Script
 * Patrón obligatorio de CLAUDE.md
 * @param {Array} items - Items a procesar
 * @param {Function} procesarLote - Función para procesar cada lote
 * @param {number} tamanioLote - Tamaño del lote (default: 50)
 */
function procesarEnLotes(items, procesarLote, tamanioLote = 50) {
  const TIEMPO_LIMITE = APPS_SCRIPT_LIMITS.EXECUTION_BUFFER_MS;
  const tiempoInicio = Date.now();
  
  let procesados = 0;
  
  for (let i = 0; i < items.length; i += tamanioLote) {
    // Verificar tiempo restante
    if (Date.now() - tiempoInicio > TIEMPO_LIMITE) {
      logEstructurado('WARN', 'Interrumpiendo procesamiento por límite de tiempo', {
        procesados,
        total: items.length,
        tiempoTranscurrido: Date.now() - tiempoInicio
      });
      
      // Programar continuación
      programarContinuacion(items.slice(i), procesarLote, tamanioLote);
      break;
    }
    
    const lote = items.slice(i, i + tamanioLote);
    procesarLote(lote);
    procesados += lote.length;
    
    logEstructurado('INFO', `Procesados ${procesados}/${items.length} items`);
  }
  
  return procesados;
}

/**
 * Programa continuación de procesamiento con trigger
 * @param {Array} itemsRestantes - Items pendientes de procesar
 * @param {Function} procesarLote - Función de procesamiento
 * @param {number} tamanioLote - Tamaño del lote
 */
function programarContinuacion(itemsRestantes, procesarLote, tamanioLote) {
  // Guardar estado en PropertiesService
  const estado = {
    items: itemsRestantes,
    processor: procesarLote.name,
    batchSize: tamanioLote,
    timestamp: Date.now()
  };
  
  PropertiesService.getScriptProperties().setProperty(
    'PROCESSING_STATE',
    JSON.stringify(estado)
  );
  
  // Crear trigger para continuar en 1 minuto
  ScriptApp.newTrigger('continuarProcesamiento')
    .timeBased()
    .after(60 * 1000)
    .create();
  
  logEstructurado('INFO', 'Continuación programada', {
    itemsRestantes: itemsRestantes.length,
    trigger: 'continuarProcesamiento'
  });
}

/**
 * Función para continuar procesamiento interrumpido
 */
function continuarProcesamiento() {
  try {
    const estadoStr = PropertiesService.getScriptProperties().getProperty('PROCESSING_STATE');
    if (!estadoStr) {
      logEstructurado('WARN', 'No hay estado de procesamiento para continuar');
      return;
    }
    
    const estado = JSON.parse(estadoStr);
    logEstructurado('INFO', 'Continuando procesamiento', {
      items: estado.items.length,
      processor: estado.processor
    });
    
    // Continuar procesamiento según el tipo
    switch (estado.processor) {
      case 'procesarSincronizacionJira':
        procesarEnLotes(estado.items, procesarLoteIssues, estado.batchSize);
        break;
      default:
        logEstructurado('ERROR', 'Tipo de procesamiento desconocido', { processor: estado.processor });
    }
    
    // Limpiar estado
    PropertiesService.getScriptProperties().deleteProperty('PROCESSING_STATE');
    
  } catch (error) {
    logEstructurado('ERROR', 'Error continuando procesamiento', { error: error.message });
  }
}

/**
 * Utilidad para formatear fechas para JQL
 * @param {Date} fecha - Fecha a formatear
 * @returns {string} Fecha en formato JQL
 */
function formatDateForJQL(fecha) {
  if (!fecha) return null;
  
  // Formato: "2024-01-04"
  return fecha.toISOString().split('T')[0];
}

/**
 * Utilidad para limpiar logs antiguos
 */
function limpiarLogsAntiguos() {
  try {
    const config = obtenerConfiguracion();
    const spreadsheet = SpreadsheetApp.openById(config.sheetId);
    const logSheet = spreadsheet.getSheetByName(SHEETS_CONFIG.LOG_SHEET);
    
    if (!logSheet) return;
    
    const ultimaFila = logSheet.getLastRow();
    if (ultimaFila > 1000) {
      // Mantener solo los últimos 500 logs
      logSheet.deleteRows(2, ultimaFila - 500);
      logEstructurado('INFO', `Logs limpiados: eliminadas ${ultimaFila - 500} entradas antiguas`);
    }
  } catch (error) {
    logEstructurado('ERROR', 'Error limpiando logs', { error: error.message });
  }
}