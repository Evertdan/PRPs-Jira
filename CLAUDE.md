# CLAUDE.md - Google Apps Script + Atlassian Integration

## Principios Fundamentales

### KISS (Keep It Simple, Stupid)
- Priorizar claridad sobre cleverness
- Usar patrones establecidos de Apps Script
- Evitar over-engineering en integraciones simples
- Mantener funciones pequeñas y enfocadas

### YAGNI (You Aren't Gonna Need It)
- No implementar funcionalidades "por si acaso"
- Enfocarse en casos de uso actuales y confirmados
- Evitar abstracciones prematuras
- Implementar solo lo necesario para el MVP

### DRY (Don't Repeat Yourself)
- Crear funciones utilitarias para lógica repetida
- Usar constantes para configuración
- Abstraer patrones comunes de API calls
- Reutilizar componentes entre diferentes integraciones

## Arquitectura del Proyecto

### Estructura de Archivos Estándar
```
Proyecto Apps Script/
├── Code.gs              # Punto de entrada principal, funciones públicas
├── Config.gs            # Configuración, constantes y setup
├── AtlassianApi.gs      # Wrapper para APIs de Atlassian
├── Utils.gs             # Utilidades comunes y helpers
├── Tests.gs             # Tests unitarios y de integración
├── MenuHandlers.gs      # Handlers para UI y menús (si aplica)
└── appsscript.json      # Configuración del proyecto
```

### Límites de Tamaño de Archivo
- **Máximo 500 líneas por archivo .gs**
- **Máximo 50 líneas por función**
- **Máximo 10 parámetros por función**
- Si se exceden estos límites, refactorizar en múltiples archivos/funciones

### Organización de Funciones
```javascript
// ✅ BIEN: Funciones específicas y enfocadas
function crearIssueJira(titulo, descripcion, tipoIssue) { }
function actualizarStatusIssue(issueKey, nuevoStatus) { }
function sincronizarPaginaConfluence(pageId, contenido) { }

// ❌ MAL: Funciones genéricas y sobrecargadas
function manejarAtlassian(tipo, accion, datos) { }
function procesarTodo(configuracion) { }
```

## Estándares de Codificación

### Convenciones de Nombres
```javascript
// Variables y funciones: camelCase
const apiToken = PropertiesService.getScriptProperties().getProperty('API_TOKEN');
function obtenerIssuesJira() { }

// Constantes: UPPER_SNAKE_CASE
const ATLASSIAN_BASE_URL = 'https://dominio.atlassian.net';
const MAX_RETRY_ATTEMPTS = 3;
const RATE_LIMIT_DELAY = 1000;

// Clases: PascalCase
class AtlassianApiWrapper { }
class JiraIssueManager { }

// Archivos: PascalCase.gs
// AtlassianApi.gs, JiraIntegration.gs, ConfluenceSync.gs
```

### Manejo de Errores Obligatorio
```javascript
// ✅ PATRÓN OBLIGATORIO: Try-catch con logging específico
function llamarApiAtlassian(endpoint, opciones = {}) {
  try {
    const respuesta = UrlFetchApp.fetch(endpoint, opciones);
    
    if (respuesta.getResponseCode() !== 200) {
      throw new Error(`API Error: ${respuesta.getResponseCode()} - ${respuesta.getContentText()}`);
    }
    
    return JSON.parse(respuesta.getContentText());
    
  } catch (error) {
    Logger.log(`Error en ${endpoint}: ${error.toString()}`);
    console.error(`API Call Failed: ${endpoint}`, error);
    
    // Re-throw con contexto adicional
    throw new Error(`Error calling Atlassian API: ${error.message}`);
  }
}

// ❌ MAL: Sin manejo de errores
function llamarApi(url) {
  const respuesta = UrlFetchApp.fetch(url);
  return JSON.parse(respuesta.getContentText()); // Puede fallar silenciosamente
}
```

### Configuración Segura OBLIGATORIA
```javascript
// ✅ SIEMPRE usar PropertiesService para credenciales
function obtenerConfiguracion() {
  const propiedades = PropertiesService.getScriptProperties();
  const config = {
    domain: propiedades.getProperty('ATLASSIAN_DOMAIN'),
    email: propiedades.getProperty('ATLASSIAN_EMAIL'),
    apiToken: propiedades.getProperty('ATLASSIAN_API_TOKEN')
  };
  
  // Validar que todas las propiedades estén presentes
  Object.keys(config).forEach(key => {
    if (!config[key]) {
      throw new Error(`Configuración faltante: ${key}. Configurar en PropertiesService.`);
    }
  });
  
  return config;
}

// ❌ NUNCA hardcodear credenciales
const API_TOKEN = 'ATATT3xFfGF0T8yX...'; // PROHIBIDO
const DOMAIN = 'miempresa.atlassian.net'; // PROHIBIDO
```

## Patrones de Integración con Atlassian

### Rate Limiting Estándar
```javascript
// PATRÓN OBLIGATORIO: Exponential backoff con jitter
function realizarRequestConRateLimit(url, opciones, maxReintentos = 3) {
  for (let intento = 1; intento <= maxReintentos; intento++) {
    try {
      const respuesta = UrlFetchApp.fetch(url, {
        ...opciones,
        muteHttpExceptions: true
      });
      
      const codigoRespuesta = respuesta.getResponseCode();
      
      if (codigoRespuesta === 429) { // Rate limited
        const delayBase = 1000 * Math.pow(2, intento - 1); // Exponential backoff
        const jitter = Math.random() * 1000; // Random jitter
        const delayTotal = delayBase + jitter;
        
        Logger.log(`Rate limit detectado, esperando ${delayTotal}ms antes de reintento ${intento}`);
        Utilities.sleep(delayTotal);
        continue;
      }
      
      if (codigoRespuesta >= 200 && codigoRespuesta < 300) {
        return respuesta;
      }
      
      if (codigoRespuesta >= 400 && codigoRespuesta < 500) {
        // Error del cliente - no reintentar
        throw new Error(`Client Error ${codigoRespuesta}: ${respuesta.getContentText()}`);
      }
      
      if (codigoRespuesta >= 500 && intento < maxReintentos) {
        // Error del servidor - reintentar
        const delay = 1000 * intento;
        Logger.log(`Server Error ${codigoRespuesta}, reintentando en ${delay}ms`);
        Utilities.sleep(delay);
        continue;
      }
      
      throw new Error(`HTTP ${codigoRespuesta}: ${respuesta.getContentText()}`);
      
    } catch (error) {
      if (intento === maxReintentos) {
        throw error;
      }
      Logger.log(`Intento ${intento} falló: ${error.toString()}`);
    }
  }
}
```

### Autenticación Estándar
```javascript
// CLASE BASE OBLIGATORIA para APIs de Atlassian
class AtlassianApiBase {
  constructor() {
    const config = obtenerConfiguracion();
    this.domain = config.domain;
    this.email = config.email;
    this.apiToken = config.apiToken;
    this.baseUrl = `https://${this.domain}`;
  }
  
  getAuthHeaders() {
    const auth = Utilities.base64Encode(`${this.email}:${this.apiToken}`);
    return {
      'Authorization': `Basic ${auth}`,
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'User-Agent': 'GoogleAppsScript/1.0'
    };
  }
  
  makeRequest(endpoint, opciones = {}) {
    const url = `${this.baseUrl}${endpoint}`;
    const requestOptions = {
      method: 'GET',
      headers: this.getAuthHeaders(),
      ...opciones
    };
    
    return realizarRequestConRateLimit(url, requestOptions);
  }
}
```

## Manejo de Límites de Apps Script

### Tiempo de Ejecución (6 minutos máximo)
```javascript
// PATRÓN OBLIGATORIO: Procesamiento por lotes con triggers
function procesarGrandesVolumenes(items) {
  const TAMANO_LOTE = 10;
  const TIEMPO_LIMITE = 5 * 60 * 1000; // 5 minutos para buffer
  const tiempoInicio = Date.now();
  
  let procesados = 0;
  
  for (let i = 0; i < items.length; i += TAMANO_LOTE) {
    // Verificar tiempo restante
    if (Date.now() - tiempoInicio > TIEMPO_LIMITE) {
      // Programar continuación con trigger
      programarContinuacion(items.slice(i));
      break;
    }
    
    const lote = items.slice(i, i + TAMANO_LOTE);
    procesarLote(lote);
    procesados += lote.length;
    
    Logger.log(`Procesados ${procesados}/${items.length} items`);
  }
}

function programarContinuacion(itemsRestantes) {
  // Guardar estado en PropertiesService
  PropertiesService.getScriptProperties().setProperty(
    'ITEMS_PENDIENTES', 
    JSON.stringify(itemsRestantes)
  );
  
  // Crear trigger para continuar en 1 minuto
  ScriptApp.newTrigger('continuarProcesamiento')
    .timeBased()
    .after(60 * 1000)
    .create();
}
```

### Quotas y Límites Diarios
```javascript
// MONITOREO OBLIGATORIO de uso de recursos
class QuotaManager {
  constructor() {
    this.contadores = JSON.parse(
      PropertiesService.getScriptProperties().getProperty('QUOTA_COUNTERS') || '{}'
    );
  }
  
  incrementar(recurso) {
    const hoy = new Date().toDateString();
    if (!this.contadores[hoy]) {
      this.contadores[hoy] = {};
    }
    
    this.contadores[hoy][recurso] = (this.contadores[hoy][recurso] || 0) + 1;
    this.guardar();
    
    // Verificar límites
    const LIMITES = {
      'urlFetch': 20000,
      'email': 100,
      'properties': 50000
    };
    
    if (this.contadores[hoy][recurso] > LIMITES[recurso] * 0.9) {
      Logger.log(`⚠️ Advertencia: ${recurso} cerca del límite diario`);
    }
  }
  
  guardar() {
    PropertiesService.getScriptProperties().setProperty(
      'QUOTA_COUNTERS', 
      JSON.stringify(this.contadores)
    );
  }
}

// Usar en todas las operaciones críticas
const quotaManager = new QuotaManager();
quotaManager.incrementar('urlFetch');
```

## Logging y Debugging

### Logging Estándar
```javascript
// PATRÓN OBLIGATORIO: Logging estructurado
function logEstructurado(nivel, mensaje, contexto = {}) {
  const timestamp = new Date().toISOString();
  const logEntry = {
    timestamp,
    nivel,
    mensaje,
    contexto
  };
  
  // Google Apps Script Logger
  Logger.log(JSON.stringify(logEntry));
  
  // Console para debugging interactivo
  console.log(`[${nivel}] ${mensaje}`, contexto);
  
  // Para errores, también usar console.error
  if (nivel === 'ERROR') {
    console.error(mensaje, contexto);
  }
}

// Uso en funciones
function crearIssueJira(datosIssue) {
  logEstructurado('INFO', 'Iniciando creación de issue', { 
    proyecto: datosIssue.project,
    tipo: datosIssue.issueType 
  });
  
  try {
    const resultado = api.crearIssue(datosIssue);
    logEstructurado('SUCCESS', 'Issue creado exitosamente', { 
      issueKey: resultado.key 
    });
    return resultado;
  } catch (error) {
    logEstructurado('ERROR', 'Error creando issue', { 
      error: error.message,
      datosIssue 
    });
    throw error;
  }
}
```

## Testing Obligatorio

### Tests Unitarios
```javascript
// ARCHIVO: Tests.gs
// Cada función principal debe tener al menos un test

function runAllTests() {
  const tests = [
    testConfiguracion,
    testAutenticacionAtlassian,
    testCreacionIssue,
    testManejoErrores
  ];
  
  let testsPasados = 0;
  let testsFallidos = 0;
  
  tests.forEach(test => {
    try {
      test();
      Logger.log(`✅ ${test.name} - PASÓ`);
      testsPasados++;
    } catch (error) {
      Logger.log(`❌ ${test.name} - FALLÓ: ${error.message}`);
      testsFallidos++;
    }
  });
  
  Logger.log(`\nResultados: ${testsPasados} pasaron, ${testsFallidos} fallaron`);
}

function testConfiguracion() {
  const config = obtenerConfiguracion();
  
  if (!config.domain) {
    throw new Error('Domain no configurado');
  }
  if (!config.email) {
    throw new Error('Email no configurado');
  }
  if (!config.apiToken) {
    throw new Error('API Token no configurado');
  }
  
  // Test de formato
  if (!config.domain.includes('.atlassian.net')) {
    throw new Error('Formato de domain inválido');
  }
}

function testAutenticacionAtlassian() {
  const api = new AtlassianApiBase();
  const respuesta = api.makeRequest('/rest/api/3/myself');
  
  if (respuesta.getResponseCode() !== 200) {
    throw new Error('Autenticación falló');
  }
  
  const userData = JSON.parse(respuesta.getContentText());
  if (!userData.accountId) {
    throw new Error('Respuesta de autenticación inválida');
  }
}
```

### Tests de Integración
```javascript
function testIntegracionCompleta() {
  // Test end-to-end real pero con datos de prueba
  Logger.log('🧪 Iniciando test de integración completa...');
  
  try {
    // 1. Test de conectividad
    testConectividadAtlassian();
    
    // 2. Test de operaciones CRUD
    const issueKey = testCrearIssueCompleto();
    testActualizarIssue(issueKey);
    
    // 3. Test de manejo de errores
    testManejoErroresReales();
    
    Logger.log('✅ Test de integración completa exitoso');
  } catch (error) {
    Logger.log(`❌ Test de integración falló: ${error.message}`);
    throw error;
  }
}
```

## Comandos de Desarrollo

### Setup Inicial
```javascript
// Ejecutar una sola vez para configurar el proyecto
function setupInicial() {
  Logger.log('🚀 Configurando proyecto Apps Script + Atlassian...');
  
  // 1. Verificar propiedades
  verificarPropiedadesRequeridas();
  
  // 2. Test de conectividad
  testConectividadAtlassian();
  
  // 3. Crear triggers si es necesario
  configurarTriggers();
  
  // 4. Inicializar contadores de quota
  new QuotaManager();
  
  Logger.log('✅ Setup inicial completado');
}

function verificarPropiedadesRequeridas() {
  const propiedadesRequeridas = [
    'ATLASSIAN_DOMAIN',
    'ATLASSIAN_EMAIL', 
    'ATLASSIAN_API_TOKEN'
  ];
  
  const propiedades = PropertiesService.getScriptProperties();
  const faltantes = propiedadesRequeridas.filter(prop => 
    !propiedades.getProperty(prop)
  );
  
  if (faltantes.length > 0) {
    throw new Error(`Propiedades faltantes: ${faltantes.join(', ')}`);
  }
}
```

### Testing y Linting
```javascript
// Comando para ejecutar todos los tests
function runTests() {
  Logger.log('🧪 Ejecutando suite de tests...');
  runAllTests();
}

// Comando para debugging
function debugMode() {
  Logger.log('🐛 Modo debug activado');
  
  // Habilitar logging detallado
  PropertiesService.getScriptProperties().setProperty('DEBUG_MODE', 'true');
  
  // Ejecutar tests básicos
  testConfiguracion();
  testAutenticacionAtlassian();
  
  Logger.log('Debug mode ready - Logging detallado habilitado');
}
```

## Seguridad y Mejores Prácticas

### Validación de Datos de Entrada
```javascript
// OBLIGATORIO: Validar todos los datos de entrada
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

// OBLIGATORIO: Rate limiting inteligente
function aplicarRateLimit(endpoint) {
  const ahora = Date.now();
  const ultimaLlamada = PropertiesService.getScriptProperties()
    .getProperty(`LAST_CALL_${endpoint}`) || '0';
  
  const tiempoTranscurrido = ahora - parseInt(ultimaLlamada);
  const delayMinimo = 100; // 100ms entre llamadas al mismo endpoint
  
  if (tiempoTranscurrido < delayMinimo) {
    const espera = delayMinimo - tiempoTranscurrido;
    Utilities.sleep(espera);
  }
  
  PropertiesService.getScriptProperties()
    .setProperty(`LAST_CALL_${endpoint}`, ahora.toString());
}
```

### Manejo de Concurrencia
```javascript
// OBLIGATORIO: Usar locks para operaciones críticas
function operacionCriticaConLock(operacion, parametros) {
  const lock = LockService.getScriptLock();
  const lockTimeout = 30000; // 30 segundos
  
  try {
    if (!lock.waitLock(lockTimeout)) {
      throw new Error('No se pudo obtener el lock - operación en curso');
    }
    
    logEstructurado('INFO', 'Lock obtenido, ejecutando operación crítica');
    return operacion(parametros);
    
  } catch (error) {
    logEstructurado('ERROR', 'Error en operación crítica', { 
      error: error.message,
      parametros 
    });
    throw error;
  } finally {
    lock.releaseLock();
    logEstructurado('INFO', 'Lock liberado');
  }
}

// Ejemplo de uso
function sincronizarDatos(datos) {
  return operacionCriticaConLock((datos) => {
    // Lógica de sincronización que no debe ejecutarse concurrentemente
    return procesarSincronizacion(datos);
  }, datos);
}
```

## Deployment y Distribución

### Versionado
```javascript
// OBLIGATORIO: Versionado en cada deployment
const VERSION = '1.2.3';
const BUILD_DATE = '2024-01-15';

function getVersion() {
  return {
    version: VERSION,
    buildDate: BUILD_DATE,
    environment: PropertiesService.getScriptProperties().getProperty('ENVIRONMENT') || 'development'
  };
}

// Logging de versión en cada ejecución principal
function main() {
  const versionInfo = getVersion();
  logEstructurado('INFO', 'Iniciando aplicación', versionInfo);
  
  // ... resto de la lógica
}
```

### Configuración por Entorno
```javascript
// PATRÓN OBLIGATORIO: Configuración específica por entorno
function obtenerConfiguracionPorEntorno() {
  const entorno = PropertiesService.getScriptProperties().getProperty('ENVIRONMENT') || 'development';
  
  const configuraciones = {
    development: {
      logLevel: 'DEBUG',
      rateLimitDelay: 500,
      maxRetries: 2,
      batchSize: 5
    },
    staging: {
      logLevel: 'INFO', 
      rateLimitDelay: 200,
      maxRetries: 3,
      batchSize: 10
    },
    production: {
      logLevel: 'WARN',
      rateLimitDelay: 100,
      maxRetries: 5,
      batchSize: 20
    }
  };
  
  return configuraciones[entorno] || configuraciones.development;
}
```

### Health Checks
```javascript
// OBLIGATORIO: Health check function
function healthCheck() {
  const checks = [];
  
  try {
    // 1. Verificar configuración
    obtenerConfiguracion();
    checks.push({ name: 'Configuración', status: 'OK' });
  } catch (error) {
    checks.push({ name: 'Configuración', status: 'ERROR', error: error.message });
  }
  
  try {
    // 2. Test conectividad Atlassian
    const api = new AtlassianApiBase();
    const respuesta = api.makeRequest('/rest/api/3/myself');
    checks.push({ 
      name: 'Conectividad Atlassian', 
      status: respuesta.getResponseCode() === 200 ? 'OK' : 'ERROR' 
    });
  } catch (error) {
    checks.push({ name: 'Conectividad Atlassian', status: 'ERROR', error: error.message });
  }
  
  try {
    // 3. Verificar quotas
    const quotaManager = new QuotaManager();
    // Lógica de verificación de quotas
    checks.push({ name: 'Quotas', status: 'OK' });
  } catch (error) {
    checks.push({ name: 'Quotas', status: 'ERROR', error: error.message });
  }
  
  const todosOK = checks.every(check => check.status === 'OK');
  
  logEstructurado('INFO', 'Health check completado', { 
    overall: todosOK ? 'HEALTHY' : 'UNHEALTHY',
    checks 
  });
  
  return {
    status: todosOK ? 'HEALTHY' : 'UNHEALTHY',
    timestamp: new Date().toISOString(),
    version: getVersion(),
    checks
  };
}
```

## Monitoreo y Alertas

### Métricas Básicas
```javascript
// CLASE OBLIGATORIA: Métricas y monitoreo
class MetricsCollector {
  constructor() {
    this.metrics = JSON.parse(
      PropertiesService.getScriptProperties().getProperty('METRICS') || '{}'
    );
  }
  
  incrementCounter(metrica, valor = 1) {
    const hoy = new Date().toDateString();
    if (!this.metrics[hoy]) {
      this.metrics[hoy] = {};
    }
    
    this.metrics[hoy][metrica] = (this.metrics[hoy][metrica] || 0) + valor;
    this.guardar();
  }
  
  recordTiming(operacion, tiempoMs) {
    const metrica = `${operacion}_duration_ms`;
    this.incrementCounter(`${operacion}_count`);
    
    // Guardar también tiempo promedio
    const promedioKey = `${operacion}_avg_ms`;
    const count = this.metrics[new Date().toDateString()][`${operacion}_count`] || 1;
    const promedioAnterior = this.metrics[new Date().toDateString()][promedioKey] || 0;
    
    const nuevoPromedio = ((promedioAnterior * (count - 1)) + tiempoMs) / count;
    this.metrics[new Date().toDateString()][promedioKey] = Math.round(nuevoPromedio);
    
    this.guardar();
  }
  
  recordError(tipoError, contexto = {}) {
    this.incrementCounter('errors_total');
    this.incrementCounter(`error_${tipoError}`);
    
    logEstructurado('ERROR', `Error registrado: ${tipoError}`, contexto);
  }
  
  guardar() {
    PropertiesService.getScriptProperties().setProperty('METRICS', JSON.stringify(this.metrics));
  }
  
  getMetricsReport() {
    const hoy = new Date().toDateString();
    return this.metrics[hoy] || {};
  }
}

// Uso en funciones principales
function funcionConMetricas() {
  const metrics = new MetricsCollector();
  const inicio = Date.now();
  
  try {
    // Lógica de la función
    const resultado = ejecutarLogica();
    
    metrics.recordTiming('funcion_principal', Date.now() - inicio);
    metrics.incrementCounter('funcion_principal_success');
    
    return resultado;
  } catch (error) {
    metrics.recordError('funcion_principal_error', { error: error.message });
    throw error;
  }
}
```

### Alertas Automáticas
```javascript
// SISTEMA DE ALERTAS: Notificar cuando algo va mal
function verificarAlertas() {
  const metrics = new MetricsCollector();
  const reporteHoy = metrics.getMetricsReport();
  
  const alertas = [];
  
  // Alerta por muchos errores
  if (reporteHoy.errors_total > 10) {
    alertas.push({
      tipo: 'HIGH_ERROR_RATE',
      mensaje: `${reporteHoy.errors_total} errores detectados hoy`,
      severidad: 'HIGH'
    });
  }
  
  // Alerta por tiempo de respuesta alto
  if (reporteHoy.api_call_avg_ms > 5000) {
    alertas.push({
      tipo: 'SLOW_RESPONSE',
      mensaje: `Tiempo de respuesta promedio: ${reporteHoy.api_call_avg_ms}ms`,
      severidad: 'MEDIUM'  
    });
  }
  
  // Alerta por quota alta
  const quotaManager = new QuotaManager();
  const contadoresHoy = quotaManager.contadores[new Date().toDateString()] || {};
  if (contadoresHoy.urlFetch > 18000) { // 90% del límite
    alertas.push({
      tipo: 'QUOTA_WARNING',
      mensaje: `Uso de UrlFetch: ${contadoresHoy.urlFetch}/20000`,
      severidad: 'MEDIUM'
    });
  }
  
  if (alertas.length > 0) {
    enviarAlertas(alertas);
  }
}

function enviarAlertas(alertas) {
  const emailDestino = PropertiesService.getScriptProperties().getProperty('ALERT_EMAIL');
  if (!emailDestino) {
    Logger.log('⚠️ Email de alertas no configurado');
    return;
  }
  
  const asunto = `🚨 Alertas Apps Script - ${alertas.length} alertas`;
  const cuerpo = alertas.map(alerta => 
    `[${alerta.severidad}] ${alerta.tipo}: ${alerta.mensaje}`
  ).join('\n');
  
  try {
    GmailApp.sendEmail(emailDestino, asunto, cuerpo);
    logEstructurado('INFO', 'Alertas enviadas', { alertas });
  } catch (error) {
    logEstructurado('ERROR', 'Error enviando alertas', { error: error.message });
  }
}
```

## Documentación Obligatoria

### JSDoc para Funciones Públicas
```javascript
/**
 * Crea un nuevo issue en Jira con los datos proporcionados
 * @param {Object} datosIssue - Datos del issue a crear
 * @param {string} datosIssue.summary - Título/resumen del issue
 * @param {string} datosIssue.description - Descripción detallada
 * @param {string} datosIssue.project - Clave del proyecto (ej: 'PROJ')
 * @param {string} datosIssue.issuetype - Tipo de issue (ej: 'Task', 'Bug')
 * @param {string} [datosIssue.priority] - Prioridad opcional
 * @returns {Object} Objeto con información del issue creado incluyendo key
 * @throws {Error} Si faltan datos requeridos o falla la creación
 * 
 * @example
 * const nuevoIssue = crearIssueJira({
 *   summary: 'Implementar nueva funcionalidad',
 *   description: 'Descripción detallada...',
 *   project: 'PROJ',
 *   issuetype: 'Task'
 * });
 * console.log(`Issue creado: ${nuevoIssue.key}`);
 */
function crearIssueJira(datosIssue) {
  // Implementación...
}
```

### README Obligatorio
Cada proyecto debe incluir documentación completa:

```markdown
# Proyecto Apps Script + Atlassian

## Descripción
[Descripción del proyecto y su propósito]

## Configuración Inicial
1. Abrir Apps Script Editor
2. Configurar propiedades en PropertiesService:
   - ATLASSIAN_DOMAIN
   - ATLASSIAN_EMAIL  
   - ATLASSIAN_API_TOKEN
3. Ejecutar setupInicial()
4. Ejecutar runTests() para validar

## Uso
[Ejemplos de uso de las funciones principales]

## Troubleshooting
[Problemas comunes y soluciones]

## Límites y Consideraciones
[Documentar límites conocidos y workarounds]
```

---

## Comandos de Desarrollo Frecuentes

```javascript
// Comandos que deben estar disponibles en todo proyecto

// Setup y configuración
function setupInicial() { /* Configuración inicial completa */ }
function verificarConfiguracion() { /* Validar todas las propiedades */ }

// Testing
function runTests() { /* Ejecutar todos los tests */ }
function testConectividad() { /* Test básico de conectividad */ }

// Debugging y monitoreo  
function healthCheck() { /* Verificación de salud del sistema */ }
function getMetrics() { /* Obtener métricas actuales */ }
function debugMode() { /* Activar modo debug */ }

// Mantenimiento
function limpiarLogs() { /* Limpiar logs antiguos */ }
function resetearContadores() { /* Resetear contadores de quota */ }
function exportarConfiguracion() { /* Backup de configuración */ }
```

---

**Recordatorio**: Estas reglas son OBLIGATORIAS para todos los proyectos de Apps Script + Atlassian. No son sugerencias - son requisitos mínimos para asegurar calidad, seguridad y mantenibilidad del código.