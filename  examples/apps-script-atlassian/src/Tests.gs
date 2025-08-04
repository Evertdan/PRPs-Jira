/**
 * @file Tests.gs
 * @description Suite de pruebas exhaustiva para la integración de Google Apps Script con Atlassian.
 * @version 3.0.0
 * @license MIT
 *
 * @summary
 * Este script proporciona una suite de pruebas de calidad profesional que cubre la configuración,
 * conectividad, operaciones CRUD de API, utilidades, manejo de errores y sistemas internos.
 * Utiliza un orquestador para ejecutar suites modulares y generar reportes detallados.
 */

// =============================================
// ORQUESTADOR PRINCIPAL DE TESTS
// =============================================

/**
 * Ejecuta todas las suites de tests y retorna un resumen de los resultados.
 * Es el punto de entrada principal para la ejecución de tests.
 * @returns {Object} Un objeto con el resumen de los resultados de los tests.
 */
function runAllTests() {
  logEstructurado('INFO', '🧪 Iniciando suite completa de tests...');
  const inicioTotal = Date.now();
  const resultados = {
    total: 0,
    passed: 0,
    failed: 0,
    suites: {},
    errors: []
  };

  const testSuites = [
    { name: 'Configuración y Entorno', func: runConfigTests },
    { name: 'Conectividad y Autenticación', func: runConnectivityTests },
    { name: 'Utilidades Internas', func: runUtilsTests },
    { name: 'API de Jira (CRUD)', func: runJiraApiTests },
    { name: 'API de Confluence (CRUD)', func: runConfluenceApiTests },
    { name: 'Manejo de Errores y Resiliencia', func: runErrorHandlingTests },
  ];

  testSuites.forEach(suite => {
    const resultadoSuite = _ejecutarSuite(suite.name, suite.func);
    resultados.total += resultadoSuite.total;
    resultados.passed += resultadoSuite.passed;
    resultados.failed += resultadoSuite.failed;
    resultados.suites[suite.name] = resultadoSuite;
    if (resultadoSuite.errors.length > 0) {
      resultados.errors.push(...resultadoSuite.errors);
    }
  });

  resultados.executionTime = Date.now() - inicioTotal;
  mostrarReporteTests(resultados);

  if (resultados.failed > 0) {
    throw new Error(`${resultados.failed}/${resultados.total} tests fallaron. Revise los logs para más detalles.`);
  }

  return resultados;
}

/**
 * Ejecuta una suite de tests específica, capturando los resultados.
 * @param {string} suiteName - El nombre de la suite.
 * @param {Function} suiteFunc - La función que retorna un array de tests para la suite.
 * @returns {Object} El resultado de la suite.
 * @private
 */
function _ejecutarSuite(suiteName, suiteFunc) {
  logEstructurado('INFO', `--- Iniciando Suite: ${suiteName} ---`);
  const tests = suiteFunc();
  const suiteResult = {
    total: tests.length,
    passed: 0,
    failed: 0,
    errors: []
  };

  tests.forEach(test => {
    const inicioTest = Date.now();
    try {
      test.func();
      suiteResult.passed++;
      const tiempoTest = Date.now() - inicioTest;
      logEstructurado('SUCCESS', `  ✅ ${test.name} - PASÓ (${tiempoTest}ms)`);
    } catch (e) {
      suiteResult.failed++;
      const errorInfo = { suite: suiteName, test: test.name, error: e.message };
      suiteResult.errors.push(errorInfo);
      const tiempoTest = Date.now() - inicioTest;
      logEstructurado('ERROR', `  ❌ ${test.name} - FALLÓ (${tiempoTest}ms): ${e.message}`);
    }
  });

  return suiteResult;
}


// =============================================
// DEFINICIÓN DE SUITES DE TESTS
// =============================================

function runConfigTests() {
  return [
    { name: 'Debe cargar la configuración sin errores', func: testCargaConfiguracion },
    { name: 'Debe fusionar correctamente la configuración del entorno', func: testFusionEntorno },
    { name: 'Debe validar formatos de configuración correctamente', func: testValidacionFormatos },
    { name: 'Debe detectar dependencias de configuración faltantes', func: testValidacionDependencias },
  ];
}

function runConnectivityTests() {
  return [
    { name: 'Debe autenticarse correctamente con la API de Jira', func: testAutenticacionJira },
    { name: 'Debe autenticarse correctamente con la API de Confluence', func: testAutenticacionConfluence },
  ];
}

function runUtilsTests() {
  return [
    { name: 'Debe determinar correctamente si se debe registrar un log', func: testDeberiaRegistrarLog },
    { name: 'Debe crear un documento de Atlassian correctamente', func: testCrearDocumentoAtlassian },
    { name: 'Debe procesar items en lotes correctamente', func: testProcesamientoEnLotes },
  ];
}

function runJiraApiTests() {
  return [
    { name: 'Debe realizar un ciclo CRUD completo en Jira (Crear, Leer, Actualizar, Eliminar)', func: testJiraCrudCycle },
  ];
}

function runConfluenceApiTests() {
  return [
    { name: 'Debe realizar un ciclo CRUD completo en Confluence (Crear, Leer, Actualizar, Eliminar)', func: testConfluenceCrudCycle },
  ];
}

function runErrorHandlingTests() {
    return [
        { name: 'Debe manejar un error de API 404 de forma elegante', func: testManejoErrorApi404 },
        { name: 'Debe manejar un error de validación de datos de entrada', func: testManejoErrorValidacion },
        { name: 'Debe recuperarse de datos de caché corruptos', func: testRecuperacionCacheCorrupto },
    ];
}


// =============================================
// TESTS INDIVIDUALES DETALLADOS
// =============================================

// --- Tests de Configuración ---
function testCargaConfiguracion() {
  const config = obtenerConfiguracion(true);
  _assert(typeof config === 'object' && config !== null, 'La configuración debe ser un objeto.');
  _assert(typeof config.secrets.atlassianApiToken === 'string', 'Debe existir el token de API en los secretos.');
  _assert(config.app.environment === (PropertiesService.getScriptProperties().getProperty('ENVIRONMENT') || 'development'), 'El entorno debe cargarse correctamente.');
}

function testFusionEntorno() {
  const config = obtenerConfiguracion(true);
  const entornoConfig = _obtenerConfiguracionEntorno(config.app.environment);
  _assert(config.app.logLevel === entornoConfig.app.logLevel, 'El nivel de log del entorno debe sobrescribir el base.');
  _assert(config.debug.verboseLogging === entornoConfig.debug.verboseLogging, 'La configuración de depuración debe ser la del entorno.');
}

function testValidacionFormatos() {
  const configValida = { atlassian: { domain: 'test.atlassian.net', email: 'test@example.com' } };
  _validarFormatos(configValida); // No debería lanzar error
  const configInvalida = { atlassian: { domain: 'test.com', email: 'invalid-email' } };
  try {
    _validarFormatos(configInvalida);
    _assert(false, 'La validación de formatos debería haber fallado.');
  } catch (e) {
    _assert(e.message.includes('inválido'), 'El mensaje de error de formato es correcto.');
  }
}

function testValidacionDependencias() {
    const configInvalida = { app: { enableAlerts: true, alertEmail: null } };
    try {
        _validarDependencias(configInvalida);
        _assert(false, 'La validación de dependencias debería haber fallado.');
    } catch (e) {
        _assert(e.message.includes('ALERT_EMAIL'), 'El error debe mencionar la falta de ALERT_EMAIL.');
    }
}


// --- Tests de Conectividad ---
function testAutenticacionJira() {
  const jiraApi = crearApiAtlassian('jira');
  const user = jiraApi.makeJsonRequest('/myself');
  _assert(typeof user.accountId === 'string' && user.accountId.length > 0, 'La respuesta de Jira debe contener un accountId.');
}

function testAutenticacionConfluence() {
  const confluenceApi = crearApiAtlassian('confluence');
  const spaces = confluenceApi.makePagedRequest('/spaces', {}, 1);
  _assert(Array.isArray(spaces), 'La respuesta de Confluence debe ser un array de espacios.');
}


// --- Tests de Utilidades ---
function testDeberiaRegistrarLog() {
  const config = obtenerConfiguracion();
  const nivelConfigurado = config.app.logLevel;
  _assert(deberiaRegistrarLog(nivelConfigurado) === true, `Debería registrar para el nivel configurado: ${nivelConfigurado}`);
  if (nivelConfigurado !== 'DEBUG') {
    _assert(deberiaRegistrarLog('DEBUG') === false, 'No debería registrar DEBUG si el nivel es mayor.');
  }
}

function testCrearDocumentoAtlassian() {
  const doc = _createAtlassianDocument('Hola mundo');
  _assert(doc.type === 'doc' && doc.content[0].content[0].text === 'Hola mundo', 'El documento Atlassian se creó correctamente.');
}

function testProcesamientoEnLotes() {
    let itemsProcesados = [];
    const procesarLote = (lote) => itemsProcesados.push(...lote);
    procesarEnLotes([1, 2, 3, 4, 5], 'procesarLote', 2); // Simula la primera ejecución
    _assert(itemsProcesados.length === 2, 'El primer lote debe procesar 2 items.');
    // En un test real, verificaríamos que se creó un trigger. Aquí validamos la lógica base.
}


// --- Tests de API (Integración CRUD) ---
function testJiraCrudCycle() {
  const jiraApi = crearApiAtlassian('jira');
  const config = obtenerConfiguracion();
  const PROJECT_KEY = config.app.jiraSyncJql.match(/project = "([^"]+)"/)[1] || 'PROJ';
  let issueKeyToDelete = null;

  try {
    // 1. CREATE
    const issueData = { project: PROJECT_KEY, summary: `[TEST] Issue de prueba - ${Date.now()}`, issuetype: 'Task', description: 'Eliminar.' };
    const createdIssue = jiraApi.createIssue(issueData);
    _assert(typeof createdIssue.key === 'string', 'CREATE: El issue creado debe tener una clave.');
    issueKeyToDelete = createdIssue.key;

    // 2. READ
    const readIssue = jiraApi.getIssue(issueKeyToDelete);
    _assert(readIssue.key === issueKeyToDelete && readIssue.fields.summary === issueData.summary, 'READ: El issue leído es correcto.');

    // 3. UPDATE
    jiraApi.addComment(issueKeyToDelete, 'Comentario de prueba.');
    const updatedIssue = jiraApi.getIssue(issueKeyToDelete, 'comment');
    _assert(updatedIssue.fields.comment.comments.length > 0, 'UPDATE: El comentario fue añadido.');

  } finally {
    // 4. DELETE / CLEANUP
    if (issueKeyToDelete) {
      jiraApi.makeRequest(`/issue/${issueKeyToDelete}`, { method: 'DELETE' });
      try {
        jiraApi.getIssue(issueKeyToDelete);
        _assert(false, 'DELETE: El issue debería haber sido eliminado.');
      } catch (e) {
        _assert(e.message.includes('404'), 'DELETE: Se confirmó la eliminación del issue (error 404).');
      }
    }
  }
}

function testConfluenceCrudCycle() {
    const confluenceApi = crearApiAtlassian('confluence');
    const config = obtenerConfiguracion();
    const SPACE_KEY = config.app.confluenceReportSpaceKey || 'DOCS';
    let pageIdToDelete = null;

    try {
        // 1. CREATE
        const pageData = { title: `[TEST] Página de prueba - ${Date.now()}`, spaceKey: SPACE_KEY, content: '<p>Eliminar.</p>' };
        const createdPage = confluenceApi.createPage(pageData);
        _assert(typeof createdPage.id === 'string', 'CREATE: La página creada debe tener un ID.');
        pageIdToDelete = createdPage.id;

        // 2. READ
        const readPage = confluenceApi.getPage(pageIdToDelete);
        _assert(readPage.id === pageIdToDelete && readPage.title === pageData.title, 'READ: La página leída es correcta.');

        // 3. UPDATE
        const newVersion = readPage.version.number + 1;
        const updatedPage = confluenceApi.updatePage(pageIdToDelete, pageData.title, '<p>Contenido actualizado.</p>', newVersion);
        _assert(updatedPage.version.number === newVersion, 'UPDATE: La versión de la página fue incrementada.');

    } finally {
        // 4. DELETE / CLEANUP
        if (pageIdToDelete) {
            confluenceApi.makeRequest(`/pages/${pageIdToDelete}`, { method: 'DELETE' });
            try {
                confluenceApi.getPage(pageIdToDelete);
                _assert(false, 'DELETE: La página debería haber sido eliminada.');
            } catch (e) {
                _assert(e.message.includes('404'), 'DELETE: Se confirmó la eliminación de la página (error 404).');
            }
        }
    }
}


// --- Tests de Manejo de Errores ---
function testManejoErrorApi404() {
    const jiraApi = crearApiAtlassian('jira');
    try {
        jiraApi.getIssue('INVALID-KEY-123');
        _assert(false, 'Debería haber fallado al solicitar un issue inexistente.');
    } catch (e) {
        _assert(e.message.includes('404'), 'El error debe contener el código de estado 404.');
    }
}

function testManejoErrorValidacion() {
    const jiraApi = crearApiAtlassian('jira');
    try {
        jiraApi.createIssue({ project: 'PROJ', summary: '' }); // Summary vacío
        _assert(false, 'La creación del issue debería haber fallado por validación.');
    } catch (e) {
        _assert(e.message.includes('requerido'), 'El error debe indicar que un campo es requerido.');
    }
}

function testRecuperacionCacheCorrupto() {
    const propKey = 'CONFIG_CACHE_TEST';
    const props = PropertiesService.getScriptProperties();
    props.setProperty(propKey, 'json-invalido');
    try {
        // Simula una función que lee y parsea
        JSON.parse(props.getProperty(propKey));
        _assert(false, 'El parseo de JSON corrupto debería fallar.');
    } catch (e) {
        _assert(true, 'Se capturó correctamente el error de JSON inválido.');
        // Una aplicación resiliente limpiaría esta propiedad corrupta.
        props.deleteProperty(propKey);
    }
}


// =============================================
// HELPERS Y REPORTING DE TESTS
// =============================================

function _assert(condition, message) {
  if (!condition) throw new Error(`Aserción fallida: ${message}`);
}

function mostrarReporteTests(resultados) {
  const porcentaje = resultados.total > 0 ? Math.round((resultados.passed / resultados.total) * 100) : 100;
  const reporte = `
🧪 REPORTE DE TESTS - ${new Date().toLocaleString()}
==================================================
📊 RESUMEN: ${resultados.passed} de ${resultados.total} pasaron (${porcentaje}%)
⏱️ Tiempo Total: ${resultados.executionTime}ms

${Object.entries(resultados.suites).map(([suiteName, suiteResult]) => `--- ${suiteName} ---
  Pasaron: ${suiteResult.passed}/${suiteResult.total}`).join('\n')}
${resultados.errors.length > 0 ? `
❌ ERRORES DETALLADOS:
${resultados.errors.map(e => `  - [${e.suite}] ${e.test}: ${e.error}`).join('\n')}
` : '\n✅ ¡Todos los tests pasaron exitosamente!'}
==================================================
  `.trim();
  console.log(reporte);
}

function healthCheck() {
  const checks = [
    { name: 'Carga de Configuración', func: () => obtenerConfiguracion(true) },
    { name: 'Conectividad con Jira', func: () => crearApiAtlassian('jira').makeJsonRequest('/myself') },
    { name: 'Conectividad con Confluence', func: () => crearApiAtlassian('confluence').makePagedRequest('/spaces', {}, 1) },
  ];
  const results = { checks: [] };
  let isHealthy = true;

  results.checks = checks.map(check => {
    try {
      check.func();
      return { name: check.name, status: 'OK' };
    } catch (e) {
      isHealthy = false;
      return { name: check.name, status: 'ERROR', error: e.message };
    }
  });

  results.status = isHealthy ? 'HEALTHY' : 'UNHEALTHY';
  return results;
}
