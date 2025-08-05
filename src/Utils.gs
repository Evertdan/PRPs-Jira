/**
 * Utils.gs - Utilidades y funciones helper del sistema unificado
 */

/**
 * Logging estructurado obligatorio.
 * @param {string} nivel - Nivel del log: DEBUG, INFO, WARN, ERROR, SUCCESS.
 * @param {string} mensaje - Mensaje descriptivo.
 * @param {Object} contexto - Contexto adicional para debugging.
 */
function logEstructurado(nivel, mensaje, contexto = {}) {
  const timestamp = new Date().toISOString();
  const logEntry = { timestamp, nivel, mensaje, contexto, version: getVersion().version };
  
  Logger.log(JSON.stringify(logEntry));
  
  // Registrar en hoja de logs si es posible
  try {
    const config = obtenerConfiguracion();
    const logSheet = SpreadsheetApp.openById(config.sheetId).getSheetByName(SHEETS_CONFIG.LOG_SHEET);
    if (logSheet) {
      if (logSheet.getLastRow() > 2000) { // Limitar logs
        logSheet.deleteRows(2, 1000);
      }
      logSheet.appendRow([new Date(), nivel, mensaje, JSON.stringify(contexto)]);
    }
  } catch (e) {
    // No fallar si el logging a la hoja falla
    console.warn("No se pudo escribir en la hoja de logs: " + e.message);
  }
}

/**
 * Registra un error de forma centralizada. No muestra alertas de UI.
 * @param {Error} error - El objeto del error capturado.
 * @param {string} nombreFuncion - El nombre de la función donde ocurrió el error.
 */
function registrarError(error, nombreFuncion) {
  const errorMessage = error.message || 'Error desconocido';
  const stack = error.stack || '(Sin stack trace)';
  
  logEstructurado('ERROR', `Error en ${nombreFuncion}`, {
    mensaje: errorMessage,
    stack: stack,
    usuario: Session.getActiveUser().getEmail()
  });

  try {
    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    const sheetName = SHEETS_CONFIG.ERROR_LOG_SHEET;
    let sheet = spreadsheet.getSheetByName(sheetName);
    
    if (!sheet) {
      sheet = spreadsheet.insertSheet(sheetName);
      sheet.getRange('A1:E1').setValues([
        ['Timestamp', 'Usuario', 'Función', 'Mensaje de Error', 'Stack Trace']
      ]).setFontWeight('bold');
      sheet.setColumnWidth(4, 300);
      sheet.setColumnWidth(5, 400);
    }

    sheet.appendRow([
      new Date(),
      Session.getActiveUser().getEmail(),
      nombreFuncion,
      errorMessage,
      stack
    ]);
  } catch (e) {
    logEstructurado('CRITICAL', `Fallo en el registro de errores a la hoja: ${e.message}`, {
      errorOriginal: errorMessage,
      funcionOriginal: nombreFuncion
    });
  }
}

/**
 * Clase para monitoreo de uso de recursos (quotas).
 */
class QuotaManager {
  constructor() {
    this.contadores = this.cargar('QUOTA_COUNTERS');
    this.inicializarContadoresDelDia();
  }
  
  cargar(key) {
    try {
      return JSON.parse(PropertiesService.getScriptProperties().getProperty(key) || '{}');
    } catch (e) {
      return {};
    }
  }

  inicializarContadoresDelDia() {
    const hoy = new Date().toDateString();
    if (!this.contadores[hoy]) this.contadores[hoy] = {};
  }

  incrementar(recurso, valor = 1) {
    const hoy = new Date().toDateString();
    this.contadores[hoy][recurso] = (this.contadores[hoy][recurso] || 0) + valor;
    this.guardar();
  }

  getUso(recurso) {
    const hoy = new Date().toDateString();
    return this.contadores[hoy][recurso] || 0;
  }

  guardar() {
    // Limpiar datos antiguos (más de 7 días)
    const haceUnaSemana = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    for (const fecha in this.contadores) {
      if (new Date(fecha) < haceUnaSemana) {
        delete this.contadores[fecha];
      }
    }
    PropertiesService.getScriptProperties().setProperty('QUOTA_COUNTERS', JSON.stringify(this.contadores));
  }
  
  reset() {
    this.contadores = {};
    this.guardar();
  }
}

/**
 * Clase para métricas y monitoreo.
 */
class MetricsCollector {
  constructor() {
    this.metrics = this.cargar('METRICS');
    this.inicializarMetricasDelDia();
  }
  
  cargar(key) {
    try {
      return JSON.parse(PropertiesService.getScriptProperties().getProperty(key) || '{}');
    } catch (e) {
      return {};
    }
  }

  inicializarMetricasDelDia() {
    const hoy = new Date().toDateString();
    if (!this.metrics[hoy]) this.metrics[hoy] = {};
  }

  incrementCounter(metrica, valor = 1) {
    const hoy = new Date().toDateString();
    this.metrics[hoy][metrica] = (this.metrics[hoy][metrica] || 0) + valor;
    this.guardar();
  }

  recordTiming(operacion, tiempoMs) {
    const hoy = new Date().toDateString();
    const countKey = `${operacion}_count`;
    const avgKey = `${operacion}_avg_ms`;
    
    const count = (this.metrics[hoy][countKey] || 0) + 1;
    const prevAvg = this.metrics[hoy][avgKey] || 0;
    
    this.metrics[hoy][countKey] = count;
    this.metrics[hoy][avgKey] = Math.round(((prevAvg * (count - 1)) + tiempoMs) / count);
    
    this.guardar();
  }
  
  recordError(tipoError, contexto = {}) {
    this.incrementCounter('errors_total');
    this.incrementCounter(`error_${tipoError}`);
    logEstructurado('ERROR', `Métrica de error registrada: ${tipoError}`, contexto);
  }

  getMetricsReport() {
    const hoy = new Date().toDateString();
    return this.metrics[hoy] || {};
  }

  guardar() {
    const haceUnaSemana = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    for (const fecha in this.metrics) {
      if (new Date(fecha) < haceUnaSemana) {
        delete this.metrics[fecha];
      }
    }
    PropertiesService.getScriptProperties().setProperty('METRICS', JSON.stringify(this.metrics));
  }
  
  reset() {
    this.metrics = {};
    this.guardar();
  }
}

/**
 * Extrae texto plano de contenido ADF (Atlassian Document Format).
 * @param {Object} adfContent - Contenido en formato ADF.
 * @returns {string} Texto plano extraído.
 */
function extractPlainTextFromADF(adfContent) {
  if (!adfContent || !adfContent.content) return '';
  let plainText = '';
  
  function traverse(node) {
    if (node.type === 'text') plainText += node.text;
    if (node.content) node.content.forEach(traverse);
    if (node.type === 'paragraph' || node.type === 'hardBreak') plainText += '\n';
  }
  
  try {
    adfContent.content.forEach(traverse);
    return plainText.trim().substring(0, 1000); // Limitar a 1000 caracteres
  } catch (error) {
    logEstructurado('WARN', 'Error extrayendo texto de ADF', { error: error.message });
    return '[Error en descripción]';
  }
}

/**
 * Transforma un issue de Jira a una fila de Google Sheets.
 * @param {Object} issue - Objeto del issue de Jira.
 * @returns {Array} Array de valores para la fila.
 */
function transformJiraIssueToSheetRow(issue) {
  const config = obtenerConfiguracion();
  const analisis = evaluarEntregablesYEvidencia(issue);

  return [
    issue.key,
    issue.fields.summary || '',
    issue.fields.status?.name || '',
    issue.fields.assignee?.emailAddress || '',
    issue.fields.priority?.name || 'Medium',
    issue.fields.issuetype?.name || '',
    issue.fields.created ? new Date(issue.fields.created) : '',
    issue.fields.updated ? new Date(issue.fields.updated) : '',
    issue.fields.reporter?.emailAddress || '',
    (issue.fields.labels || []).join(', '),
    (issue.fields.customfield_10020 || []).map(s => s.name).join(', '), // Sprint
    issue.fields.customfield_10016 || '', // Story Points
    (issue.fields.components || []).map(c => c.name).join(', '),
    extractPlainTextFromADF(issue.fields.description),
    `https://${config.domain}/browse/${issue.key}`,
    new Date(),
    'OK',
    analisis.puntuacion,
    `${analisis.calidad.emoji} ${analisis.calidad.texto}`,
    analisis.resumen,
    analisis.archivos.length,
    analisis.comentarios.length
  ];
}

/**
 * Ejecuta una operación crítica con lock para prevenir ejecuciones concurrentes.
 * @param {Function} operacion - La función a ejecutar.
 * @returns {*} El resultado de la operación.
 */
function operacionCriticaConLock(operacion) {
  const lock = LockService.getScriptLock();
  if (!lock.tryLock(30000)) { // Intentar obtener lock por 30s
    throw new Error('No se pudo obtener el lock. Otra sincronización puede estar en curso.');
  }
  
  try {
    return operacion();
  } finally {
    lock.releaseLock();
  }
}

/**
 * Limpia logs antiguos de la hoja de cálculo.
 */
function limpiarLogsAntiguos() {
  try {
    const config = obtenerConfiguracion();
    const logSheet = SpreadsheetApp.openById(config.sheetId).getSheetByName(SHEETS_CONFIG.LOG_SHEET);
    
    if (logSheet && logSheet.getLastRow() > 1000) {
      logSheet.deleteRows(2, logSheet.getLastRow() - 1000);
      logEstructurado('INFO', 'Logs antiguos limpiados.');
    }
  } catch (error) {
    registrarError(error, 'limpiarLogsAntiguos');
  }
}

// ========================================
// ANÁLISIS DE ENTREGABLES
// ========================================

function evaluarEntregablesYEvidencia(tarea) {
  try {
    // Logging detallado para debug
    const f = tarea.fields;
    logEstructurado('DEBUG', `Analizando ${tarea.key}`, {
      attachment: f.attachment ? f.attachment.length : 0,
      comments: f.comment ? f.comment.comments.length : 0,
      remotelinks: f.remotelinks ? f.remotelinks.length : 0,
      description: f.description ? 'Presente' : 'No Presente',
      customfield_10230: f.customfield_10230 ? 'Presente' : 'No Presente',
      customfield_10231: f.customfield_10231 ? 'Presente' : 'No Presente'
    });

    const evidencias = {
      archivos: [], imagenes: [], enlaces: [], pullRequests: [], commits: [],
      comentarios: [], documentos: [], puntuacion: 0, detalles: []
    };
    if (tarea.fields.attachment) analizarArchivosAdjuntos(tarea.fields.attachment, evidencias);
    if (tarea.fields.comment?.comments) analizarComentarios(tarea.fields.comment.comments, evidencias);
    if (tarea.fields.description) analizarDescripcion(extractPlainTextFromADF(tarea.fields.description), evidencias);
    analizarCamposPersonalizados(tarea.fields, evidencias);
    if (tarea.fields.remotelinks) analizarEnlacesRemotos(tarea.fields.remotelinks, evidencias);

    const calidad = evaluarCalidadEntregables(evidencias.puntuacion);
    const resumen = generarResumenEntregables(evidencias);
    
    return { ...evidencias, calidad, resumen };
  } catch (error) {
    logEstructurado('ERROR', `Error analizando entregables para ${tarea.key}`, { error: error.message });
    return { ...evidencias, calidad: CONFIG_ENTREGABLES.NIVELES.SIN_EVIDENCIA, resumen: 'Error en análisis' };
  }
}

function analizarArchivosAdjuntos(attachments, evidencias) {
  attachments.forEach(attachment => {
    const esImagen = (attachment.mimeType || '').startsWith('image/');
    evidencias.archivos.push({ nombre: attachment.filename, esImagen });
    if (esImagen) evidencias.imagenes.push({ nombre: attachment.filename });
    
    evidencias.puntuacion += esImagen ? CONFIG_ENTREGABLES.PESOS.IMAGEN_ADJUNTO : CONFIG_ENTREGABLES.PESOS.ARCHIVO_ADJUNTO;
    evidencias.detalles.push(`${esImagen ? '📷' : '📎'} Archivo: ${attachment.filename}`);
  });
}

function analizarComentarios(comments, evidencias) {
  comments.forEach(comentario => {
    const texto = extractPlainTextFromADF(comentario.body);
    evidencias.comentarios.push({ autor: comentario.author?.displayName, longitud: texto.length });
    
    if (texto.length > 100) {
      evidencias.puntuacion += CONFIG_ENTREGABLES.PESOS.COMENTARIO_DETALLADO;
      evidencias.detalles.push(`📝 Comentario detallado (${texto.length} chars)`);
    }
    analizarTextoParaEnlaces(texto, evidencias);
  });
}

function analizarDescripcion(descripcion, evidencias) {
  if (descripcion.length > 200) {
    evidencias.puntuacion += CONFIG_ENTREGABLES.PESOS.COMENTARIO_DETALLADO;
    evidencias.detalles.push(`📝 Descripción detallada (${descripcion.length} chars)`);
  }
  analizarTextoParaEnlaces(descripcion, evidencias);
}

function analizarTextoParaEnlaces(texto, evidencias) {
  const prRegex = /(bitbucket\.org|github\.com|gitlab\.com).*(pull-request|merge-request|\/pull\/)/gi;
  const commitRegex = /(bitbucket\.org|github\.com|gitlab\.com).*(commit|\/commits\/)/gi;
  const urlRegex = /https?:\/\/[^\s]+/g;

  (texto.match(prRegex) || []).forEach(() => {
    evidencias.pullRequests.push({});
    evidencias.puntuacion += CONFIG_ENTREGABLES.PESOS.PULL_REQUEST;
    evidencias.detalles.push('🔀 Pull Request');
  });

  (texto.match(commitRegex) || []).forEach(() => {
    evidencias.commits.push({});
    evidencias.puntuacion += CONFIG_ENTREGABLES.PESOS.COMMIT;
    evidencias.detalles.push('📝 Commit');
  });

  (texto.match(urlRegex) || []).forEach(url => {
    if (!prRegex.test(url) && !commitRegex.test(url)) {
      evidencias.enlaces.push({ url });
      evidencias.puntuacion += CONFIG_ENTREGABLES.PESOS.ENLACE_EXTERNO;
      evidencias.detalles.push(`🔗 Enlace: ${url.substring(0, 40)}...`);
    }
  });
}

function analizarCamposPersonalizados(fields, evidencias) {
  if (fields[CAMPOS_ENTREGABLES.comentarios]?.length > 10) {
    evidencias.puntuacion += CONFIG_ENTREGABLES.PESOS.CAMPO_PERSONALIZADO;
    evidencias.detalles.push('📋 Campo de comentarios con contenido');
  }
  if (fields[CAMPOS_ENTREGABLES.desviaciones]?.length > 10) {
    evidencias.puntuacion += CONFIG_ENTREGABLES.PESOS.CAMPO_PERSONALIZADO;
    evidencias.detalles.push('⚠️ Campo de desviaciones con contenido');
  }
}

function analizarEnlacesRemotos(remoteLinks, evidencias) {
  remoteLinks.forEach(link => {
    evidencias.enlaces.push({ url: link.object?.url, titulo: link.object?.title });
    evidencias.puntuacion += CONFIG_ENTREGABLES.PESOS.ENLACE_EXTERNO;
    evidencias.detalles.push(`🔗 Enlace remoto: ${link.object?.title}`);
  });
}

function evaluarCalidadEntregables(puntuacion) {
  const niveles = CONFIG_ENTREGABLES.NIVELES;
  if (puntuacion >= niveles.EXCELENTE.min) return niveles.EXCELENTE;
  if (puntuacion >= niveles.BUENO.min) return niveles.BUENO;
  if (puntuacion >= niveles.BASICO.min) return niveles.BASICO;
  if (puntuacion >= niveles.INSUFICIENTE.min) return niveles.INSUFICIENTE;
  return niveles.SIN_EVIDENCIA;
}

function generarResumenEntregables(evidencias) {
  const resumen = [];
  if (evidencias.archivos.length) resumen.push(`${evidencias.archivos.length} archivos (${evidencias.imagenes.length} imág.)`);
  if (evidencias.pullRequests.length) resumen.push(`${evidencias.pullRequests.length} PRs`);
  if (evidencias.commits.length) resumen.push(`${evidencias.commits.length} commits`);
  if (evidencias.enlaces.length) resumen.push(`${evidencias.enlaces.length} enlaces`);
  if (evidencias.comentarios.length) resumen.push(`${evidencias.comentarios.length} coment.`);
  return resumen.join(', ') || 'Sin entregables';
}
