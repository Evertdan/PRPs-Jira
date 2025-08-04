/**
 * @file Utils.gs
 * @description Módulo de utilidades avanzadas para la integración de Google Apps Script con Atlassian.
 * @version 3.0.0
 * @license MIT
 *
 * @summary
 * Este script es el motor funcional del proyecto. Proporciona sistemas completos para logging,
 * resiliencia de red con reintentos, validación de datos, recolección de métricas, gestión de
 * cuotas y otras utilidades esenciales.
 */

// =============================================
// LOGGING ESTRUCTURADO
// =============================================

/**
 * Sistema de logging estructurado con niveles y contexto.
 * @param {'DEBUG'|'INFO'|'WARN'|'ERROR'|'CRITICAL'} nivel - El nivel del log.
 * @param {string} mensaje - El mensaje principal del log.
 * @param {Object} [contexto={}] - Un objeto con datos de contexto adicionales.
 */
function logEstructurado(nivel, mensaje, contexto = {}) {
  if (!deberiaRegistrarLog(nivel)) return;

  const logEntry = {
    timestamp: new Date().toISOString(),
    level: nivel,
    message: mensaje,
    context: contexto,
    version: VERSION,
    environment: obtenerConfiguracion().app.environment,
  };

  Logger.log(JSON.stringify(logEntry));

  if (nivel === 'CRITICAL' && obtenerConfiguracion().app.enableAlerts) {
    try {
      enviarAlertaCritica('Error Crítico Detectado', `${mensaje}\n\nContexto: ${JSON.stringify(contexto, null, 2)}`);
    } catch (alertError) {
      Logger.log(JSON.stringify({ level: 'ERROR', message: 'Fallo al enviar alerta crítica', error: alertError.message }));
    }
  }
}


// =============================================
// RATE LIMITING Y CONTROL DE FLUJO
// =============================================

/**
 * Realiza una solicitud HTTP con una lógica de reintentos robusta y exponential backoff.
 * @param {string} url - La URL a la que se hará la solicitud.
 * @param {GoogleAppsScript.URL_Fetch.URLFetchRequestOptions} opciones - Las opciones para UrlFetchApp.
 * @returns {GoogleAppsScript.URL_Fetch.HTTPResponse} La respuesta de la solicitud.
 */
function realizarRequestConRateLimit(url, opciones) {
  const config = obtenerConfiguracion();
  const maxReintentos = config.app.maxRetries;
  new QuotaManager().incrementar('urlFetch');

  for (let intento = 0; intento <= maxReintentos; intento++) {
    try {
      const respuesta = UrlFetchApp.fetch(url, opciones);
      const codigoRespuesta = respuesta.getResponseCode();

      if (codigoRespuesta >= 200 && codigoRespuesta < 300) return respuesta;
      if (codigoRespuesta >= 400 && codigoRespuesta < 500 && codigoRespuesta !== 429) {
        throw new Error(`Error de Cliente ${codigoRespuesta}: ${respuesta.getContentText()}`);
      }
      if (codigoRespuesta === 429 || codigoRespuesta >= 500) {
        throw new Error(`Error Reintentable ${codigoRespuesta}`);
      }
      throw new Error(`HTTP ${codigoRespuesta}: ${respuesta.getContentText()}`);

    } catch (error) {
      logEstructurado('WARN', `Request falló en intento ${intento + 1}/${maxReintentos + 1}`, { url, error: error.message });
      if (intento === maxReintentos) throw new Error(`El request a ${url} falló después de ${maxReintentos + 1} intentos: ${error.message}`);
      
      const delayBase = 500 * Math.pow(2, intento);
      const jitter = Math.random() * 500;
      const delayTotal = delayBase + jitter;
      
      logEstructurado('DEBUG', `Aplicando backoff y esperando ${Math.round(delayTotal)}ms`);
      Utilities.sleep(delayTotal);
    }
  }
}


// =============================================
// VALIDACIÓN Y SANITIZACIÓN DE DATOS
// =============================================

function validarDatosIssue(datos) {
  if (!datos || typeof datos !== 'object') throw new Error('Los datos del issue deben ser un objeto.');
  const camposRequeridos = ['summary', 'project', 'issuetype'];
  for (const campo of camposRequeridos) {
    if (!datos[campo] || typeof datos[campo] !== 'string' || datos[campo].trim() === '') {
      throw new Error(`Campo requerido faltante o vacío: '${campo}'.`);
    }
  }
  const datosSaneados = { ...datos };
  datosSaneados.summary = datosSaneados.summary.trim().substring(0, 255);
  if (datosSaneados.description) {
    datosSaneados.description = String(datosSaneados.description).replace(/<[^>]*>?/gm, '');
  }
  return datosSaneados;
}

function validarDatosPaginaConfluence(datos) {
    if (!datos || typeof datos !== 'object') throw new Error('Los datos de la página deben ser un objeto.');
    const camposRequeridos = ['title', 'spaceKey', 'content'];
    for (const campo of camposRequeridos) {
        if (!datos[campo] || typeof datos[campo] !== 'string' || datos[campo].trim() === '') {
            throw new Error(`Campo requerido faltante o vacío: '${campo}'.`);
        }
    }
    const datosSaneados = { ...datos };
    datosSaneados.title = datosSaneados.title.trim();
    // La sanitización del contenido de Confluence (HTML) es compleja y debe hacerse con cuidado.
    // Aquí se asume que el contenido ya es seguro o está en un formato válido.
    return datosSaneados;
}


// =============================================
// SISTEMAS INTERNOS (MÉTRICAS Y CUOTAS)
// =============================================

class MetricsCollector {
  constructor() {
    this.propKey = 'METRICS_DATA';
    this.metrics = this._load();
  }
  _load() {
    try {
      const data = PropertiesService.getScriptProperties().getProperty(this.propKey);
      return data ? JSON.parse(data) : {};
    } catch (e) {
      logEstructurado('ERROR', 'Métricas corruptas, reiniciando contador.', { error: e.message });
      return {};
    }
  }
  _save() {
    PropertiesService.getScriptProperties().setProperty(this.propKey, JSON.stringify(this.metrics));
  }
  incrementCounter(key, value = 1) {
    this.metrics[key] = (this.metrics[key] || 0) + value;
    this._save();
  }
  recordTiming(key, duration) {
    const countKey = `${key}_count`;
    const totalKey = `${key}_total_ms`;
    this.metrics[countKey] = (this.metrics[countKey] || 0) + 1;
    this.metrics[totalKey] = (this.metrics[totalKey] || 0) + duration;
    this._save();
  }
  getMetricsReport() {
    const report = {};
    for (const key in this.metrics) {
      if (key.endsWith('_total_ms')) {
        const baseKey = key.replace('_total_ms', '');
        const count = this.metrics[`${baseKey}_count`] || 1;
        report[`${baseKey}_avg_ms`] = Math.round(this.metrics[key] / count);
      } else {
        report[key] = this.metrics[key];
      }
    }
    return report;
  }
  limpiarMetricasAntiguas() { /* Lógica para limpiar si se almacenan por fecha */ }
}

class QuotaManager {
    constructor() {
        this.propKey = 'QUOTA_USAGE';
        this.quotas = { urlFetch: 20000, email: 1500 }; // Cuotas diarias de Google
        this.usage = this._load();
    }
    _load() {
        const today = new Date().toISOString().split('T')[0];
        try {
            const data = PropertiesService.getScriptProperties().getProperty(this.propKey);
            const parsed = data ? JSON.parse(data) : {};
            return parsed.date === today ? parsed.usage : { date: today };
        } catch (e) {
            return { date: today };
        }
    }
    _save() {
        PropertiesService.getScriptProperties().setProperty(this.propKey, JSON.stringify({ date: this.usage.date, usage: this.usage }));
    }
    incrementar(recurso, cantidad = 1) {
        this.usage[recurso] = (this.usage[recurso] || 0) + cantidad;
        this._save();
    }
    esSafeProceder(recurso, cantidad = 1) {
        const usoActual = this.usage[recurso] || 0;
        const limite = this.quotas[recurso];
        return limite ? (usoActual + cantidad) <= limite : true;
    }
}


// =============================================
// UTILIDADES GENERALES
// =============================================

function dividirEnLotes(items, tamanoLote) {
  const lotes = [];
  for (let i = 0; i < items.length; i += tamanoLote) lotes.push(items.slice(i, i + tamanoLote));
  return lotes;
}

function formatearTiempo(ms) {
  if (ms < 1000) return `${ms}ms`;
  if (ms < 60000) return `${(ms / 1000).toFixed(1)}s`;
  const minutes = Math.floor(ms / 60000);
  const seconds = ((ms % 60000) / 1000).toFixed(0);
  return `${minutes}m ${seconds}s`;
}

function generarIdUnico() {
  return `${Date.now().toString(36)}-${Math.random().toString(36).substr(2, 9)}`;
}


// =============================================
// MANTENIMIENTO Y ALERTAS
// =============================================

function enviarAlertaCritica(asunto, cuerpo) {
  const config = obtenerConfiguracion();
  if (!config.app.enableAlerts || !config.app.alertEmail) return;

  // Evitar spam: no enviar más de una alerta crítica cada 10 minutos.
  const lastAlertKey = 'LAST_CRITICAL_ALERT_TS';
  const ahora = Date.now();
  const ultimaAlerta = Number(PropertiesService.getScriptProperties().getProperty(lastAlertKey) || 0);
  if (ahora - ultimaAlerta < 10 * 60 * 1000) {
      logEstructurado('WARN', 'Se suprimió una alerta crítica para evitar spam.');
      return;
  }
  
  const emailSubject = `[ALERTA CRÍTICA - ${config.app.environment}] ${asunto}`;
  const emailBody = `Se ha detectado un error crítico en la integración de Apps Script con Atlassian.\n\n` +
                    `Entorno: ${config.app.environment}\n` +
                    `Timestamp: ${new Date().toISOString()}\n\n` +
                    `--- DETALLES ---\n${cuerpo}`;

  MailApp.sendEmail(config.app.alertEmail, emailSubject, emailBody);
  PropertiesService.getScriptProperties().setProperty(lastAlertKey, String(ahora));
  logEstructurado('INFO', `Alerta crítica enviada a ${config.app.alertEmail}`);
}

function limpiarTriggersAntiguosPorNombre(functionName) {
  const triggers = ScriptApp.getProjectTriggers();
  let eliminados = 0;
  triggers.forEach(trigger => {
    if (trigger.getHandlerFunction() === functionName) {
      ScriptApp.deleteTrigger(trigger);
      eliminados++;
    }
  });
  if (eliminados > 0) logEstructurado('DEBUG', `${eliminados} triggers antiguos para '${functionName}' han sido eliminados.`);
}

function limpiarPropiedadesAntiguas(prefix, ttlSeconds) {
    const props = PropertiesService.getScriptProperties();
    const allProps = props.getProperties();
    const ahora = Date.now();
    let eliminadas = 0;

    for (const key in allProps) {
        if (key.startsWith(prefix)) {
            // Asume que el valor puede ser un timestamp o un objeto JSON con timestamp
            let timestamp = 0;
            try {
                const value = JSON.parse(allProps[key]);
                timestamp = value.timestamp || 0;
            } catch (e) {
                timestamp = Number(allProps[key]) || 0;
            }

            if (timestamp > 0 && (ahora - timestamp) / 1000 > ttlSeconds) {
                props.deleteProperty(key);
                eliminadas++;
            }
        }
    }
    if (eliminadas > 0) logEstructurado('DEBUG', `${eliminadas} propiedades antiguas con prefijo '${prefix}' eliminadas.`);
}
