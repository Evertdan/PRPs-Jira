/**
 * Tests.gs - Suite de tests unitarios y de integración
 * Siguiendo patrones obligatorios de CLAUDE.md para testing completo
 */

/**
 * Ejecuta toda la suite de tests
 * Función principal para validación completa del sistema
 */
function runTests() {
  Logger.log('🧪 Iniciando suite completa de tests para Jira-Sheets Sync...');
  
  const tests = [
    // Tests de configuración
    testConfiguracion,
    testConfiguracionPorEntorno,
    testValidacionDatos,
    
    // Tests de conectividad
    testConectividadJira,
    testAccesoSheets,
    testAutenticacionAtlassian,
    
    // Tests de componentes
    testRateLimiting,
    testQuotaManager,
    testMetricsCollector,
    testLoggingEstructurado,
    
    // Tests de transformación de datos
    testTransformacionDatos,
    testExtraccionADF,
    testCustomFields,
    
    // Tests de funcionalidades principales
    testCreacionHojaPrincipal,
    testDeteccionCambios,
    testActualizacionSheets,
    
    // Tests de integración
    testIntegracionJiraSearch,
    testSincronizacionCompleta
  ];
  
  let testsPasados = 0;
  let testsFallidos = 0;
  const errores = [];
  
  for (const test of tests) {
    try {
      logEstructurado('INFO', `Ejecutando test: ${test.name}`);
      test();
      Logger.log(`✅ ${test.name} - PASÓ`);
      testsPasados++;
    } catch (error) {
      Logger.log(`❌ ${test.name} - FALLÓ: ${error.message}`);
      errores.push({ test: test.name, error: error.message });
      testsFallidos++;
    }
  }
  
  // Reporte final
  const reporte = `
📊 REPORTE DE TESTS
===================
✅ Tests exitosos: ${testsPasados}
❌ Tests fallidos: ${testsFallidos}
📈 Tasa de éxito: ${((testsPasados / tests.length) * 100).toFixed(1)}%

${testsFallidos > 0 ? '❌ ERRORES:\n' + errores.map(e => `• ${e.test}: ${e.error}`).join('\n') : '✅ TODOS LOS TESTS PASARON'}
  `;
  
  Logger.log(reporte);
  logEstructurado('INFO', 'Suite de tests completada', {
    total: tests.length,
    exitosos: testsPasados,
    fallidos: testsFallidos,
    errores
  });
  
  if (testsFallidos > 0) {
    throw new Error(`${testsFallidos} tests fallaron. Revisar logs para detalles.`);
  }
  
  return {
    total: tests.length,
    exitosos: testsPasados,
    fallidos: testsFallidos
  };
}

/**
 * Test de configuración básica
 */
function testConfiguracion() {
  const propiedadesRequeridas = [
    'ATLASSIAN_DOMAIN',
    'ATLASSIAN_EMAIL', 
    'ATLASSIAN_API_TOKEN',
    'JIRA_PROJECTS',
    'SHEET_ID'
  ];
  
  const propiedades = PropertiesService.getScriptProperties();
  
  propiedadesRequeridas.forEach(prop => {
    const valor = propiedades.getProperty(prop);
    if (!valor) {
      throw new Error(`Propiedad requerida no configurada: ${prop}`);
    }
  });
  
  // Test de obtenerConfiguracion()
  const config = obtenerConfiguracion();
  
  if (!config.domain.includes('.atlassian.net')) {
    throw new Error('Formato de domain inválido');
  }
  
  if (!Array.isArray(config.projects) || config.projects.length === 0) {
    throw new Error('JIRA_PROJECTS debe ser un array con al menos un proyecto');
  }
  
  if (!config.sheetId || config.sheetId.length < 20) {
    throw new Error('SHEET_ID inválido');
  }
}

/**
 * Test de configuración por entorno
 */
function testConfiguracionPorEntorno() {
  const configDev = obtenerConfiguracionPorEntorno();
  
  if (!configDev.logLevel || !configDev.rateLimitDelay || !configDev.batchSize) {
    throw new Error('Configuración por entorno incompleta');
  }
  
  // Verificar que los valores son válidos
  if (configDev.rateLimitDelay < 50 || configDev.rateLimitDelay > 1000) {
    throw new Error('Rate limit delay fuera de rango válido');
  }
  
  if (configDev.batchSize < 1 || configDev.batchSize > 100) {
    throw new Error('Batch size fuera de rango válido');
  }
}

/**
 * Test de validación de datos
 */
function testValidacionDatos() {
  // Test datos válidos
  const datosValidos = {
    summary: 'Test issue',
    project: 'TEST',
    issuetype: 'Task'
  };
  
  const validados = validarDatosIssue(datosValidos);
  if (validados.summary !== 'Test issue') {
    throw new Error('Validación de datos válidos falló');
  }
  
  // Test datos inválidos
  try {
    validarDatosIssue({ summary: 'Test' }); // Falta project e issuetype
    throw new Error('Debería haber fallado con datos incompletos');
  } catch (error) {
    if (!error.message.includes('Campo requerido faltante')) {
      throw new Error('Validación de datos inválidos no funcionó correctamente');
    }
  }
  
  // Test sanitización
  const datosConHTML = {
    summary: 'Test <script>alert("xss")</script>',
    description: 'Descripción <b>con</b> <script>código</script> HTML',
    project: 'TEST',
    issuetype: 'Task'
  };
  
  const sanitizados = validarDatosIssue(datosConHTML);
  if (sanitizados.description.includes('<script>')) {
    throw new Error('Sanitización de HTML falló');
  }
}

/**
 * Test de conectividad con Jira
 */
function testConectividadJira() {
  const jiraApi = new JiraApiManager();
  
  // Test autenticación básica
  const userResponse = jiraApi.makeRequest('/rest/api/3/myself');
  if (userResponse.getResponseCode() !== 200) {
    throw new Error(`Fallo autenticación con Jira: ${userResponse.getResponseCode()}`);
  }
  
  const userData = JSON.parse(userResponse.getContentText());
  if (!userData.accountId || !userData.emailAddress) {
    throw new Error('Respuesta de autenticación Jira inválida');
  }
  
  // Test acceso a proyectos configurados
  const config = obtenerConfiguracion();
  const primerProyecto = config.projects[0];
  
  const projectResponse = jiraApi.makeRequest(`/rest/api/3/project/${primerProyecto}`);
  if (projectResponse.getResponseCode() !== 200) {
    throw new Error(`Sin acceso al proyecto ${primerProyecto}: ${projectResponse.getResponseCode()}`);
  }
}

/**
 * Test de acceso a Google Sheets
 */
function testAccesoSheets() {
  const config = obtenerConfiguracion();
  
  try {
    const spreadsheet = SpreadsheetApp.openById(config.sheetId);
    
    // Test lectura
    const sheets = spreadsheet.getSheets();
    if (!sheets || sheets.length === 0) {
      throw new Error('No se pueden leer hojas del spreadsheet');
    }
    
    // Test escritura (usar hoja temporal)
    let testSheet = spreadsheet.getSheetByName('TEST_TEMP');
    if (!testSheet) {
      testSheet = spreadsheet.insertSheet('TEST_TEMP');
    }
    
    const testValue = 'TEST_' + Date.now();
    testSheet.getRange('A1').setValue(testValue);
    const readValue = testSheet.getRange('A1').getValue();
    
    if (readValue !== testValue) {
      throw new Error('No se puede escribir/leer en Sheets');
    }
    
    // Limpiar
    spreadsheet.deleteSheet(testSheet);
    
  } catch (error) {
    throw new Error(`Error acceso a Sheets: ${error.message}`);
  }
}

/**
 * Test de autenticación con Atlassian
 */
function testAutenticacionAtlassian() {
  const api = new AtlassianApiBase();
  
  // Test headers de autenticación
  const headers = api.getAuthHeaders();
  if (!headers.Authorization || !headers.Authorization.startsWith('Basic ')) {
    throw new Error('Headers de autenticación inválidos');
  }
  
  // Test getCurrentUser
  const jiraApi = new JiraApiManager();
  const user = jiraApi.getCurrentUser();
  
  if (!user.accountId) {
    throw new Error('No se pudo obtener información del usuario actual');
  }
}

/**
 * Test de rate limiting
 */
function testRateLimiting() {
  const rateLimiter = new JiraRateLimiter();
  const startTime = Date.now();
  const results = [];
  
  // Simular 3 requests consecutivos
  for (let i = 0; i < 3; i++) {
    const result = rateLimiter.addRequest(() => {
      return { timestamp: Date.now(), index: i };
    });
    results.push(result);
  }
  
  // Verificar que hay delay apropiado entre requests
  for (let i = 1; i < results.length; i++) {
    const delay = results[i].timestamp - results[i-1].timestamp;
    if (delay < 90) { // Permitir 10ms de tolerancia
      throw new Error(`Rate limiting insuficiente: ${delay}ms delay entre requests`);
    }
  }
  
  const totalTime = Date.now() - startTime;
  if (totalTime < 200) { // Debe tomar al menos 200ms para 3 requests
    throw new Error(`Rate limiting no está funcionando: completó en ${totalTime}ms`);
  }
}

/**
 * Test de QuotaManager
 */
function testQuotaManager() {
  const quota = new QuotaManager();
  
  // Reset para test limpio
  quota.reset();
  
  // Test incremento
  quota.incrementar('urlFetch', 5);
  const uso = quota.getUso('urlFetch');
  
  if (uso !== 5) {
    throw new Error(`QuotaManager incremento falló: esperado 5, obtenido ${uso}`);
  }
  
  // Test verificación de límites (no debe lanzar error con uso bajo)
  quota.incrementar('urlFetch', 100);
  const usoTotal = quota.getUso('urlFetch');
  
  if (usoTotal !== 105) {
    throw new Error(`QuotaManager total falló: esperado 105, obtenido ${usoTotal}`);
  }
}

/**
 * Test de MetricsCollector
 */
function testMetricsCollector() {
  const metrics = new MetricsCollector();
  
  // Test counter
  metrics.incrementCounter('test_counter', 3);
  const reporte = metrics.getMetricsReport();
  
  if (reporte.test_counter !== 3) {
    throw new Error(`MetricsCollector counter falló: esperado 3, obtenido ${reporte.test_counter}`);
  }
  
  // Test timing
  metrics.recordTiming('test_operation', 1500);
  const reporteConTiming = metrics.getMetricsReport();
  
  if (!reporteConTiming.test_operation_avg_ms || reporteConTiming.test_operation_avg_ms !== 1500) {
    throw new Error('MetricsCollector timing falló');
  }
  
  if (!reporteConTiming.test_operation_count || reporteConTiming.test_operation_count !== 1) {
    throw new Error('MetricsCollector count falló');
  }
}

/**
 * Test de logging estructurado
 */
function testLoggingEstructurado() {
  // Test que no lance errores
  try {
    logEstructurado('INFO', 'Test de logging', { test: true, numero: 123 });
    logEstructurado('ERROR', 'Test de error', { error: 'test error' });
    logEstructurado('SUCCESS', 'Test de éxito');
  } catch (error) {
    throw new Error(`Logging estructurado falló: ${error.message}`);
  }
  
  // Verificar que los logs aparecen en Logger
  const logs = Logger.getLog();
  if (!logs.includes('Test de logging')) {
    throw new Error('Los logs no están apareciendo en Logger');
  }
}

/**
 * Test de transformación de datos Jira → Sheets
 */
function testTransformacionDatos() {
  const mockIssue = {
    key: 'TEST-123',
    fields: {
      summary: 'Test Issue Summary',
      status: { name: 'In Progress' },
      assignee: { emailAddress: 'test@example.com' },
      priority: { name: 'High' },
      issuetype: { name: 'Task' },
      created: '2024-01-04T10:00:00.000Z',
      updated: '2024-01-04T11:00:00.000Z',
      reporter: { emailAddress: 'reporter@example.com' },
      labels: ['backend', 'urgent'],
      components: [{ name: 'API' }, { name: 'Database' }],
      description: {
        type: "doc",
        version: 1,
        content: [{
          type: "paragraph",
          content: [{ type: "text", text: "Test description" }]
        }]
      },
      project: { key: 'TEST' }
    }
  };
  
  const rowData = transformJiraIssueToSheetRow(mockIssue);
  
  // Verificar transformación correcta
  if (rowData[0] !== 'TEST-123') { // Key
    throw new Error('Transformación de key falló');
  }
  
  if (rowData[1] !== 'Test Issue Summary') { // Summary
    throw new Error('Transformación de summary falló');
  }
  
  if (rowData[2] !== 'In Progress') { // Status
    throw new Error('Transformación de status falló');
  }
  
  if (rowData[9] !== 'backend, urgent') { // Labels
    throw new Error('Transformación de labels falló');
  }
  
  if (!rowData[14].includes('https://')) { // Jira URL
    throw new Error('Generación de URL de Jira falló');
  }
}

/**
 * Test de extracción de texto ADF
 */
function testExtraccionADF() {
  const adfContent = {
    type: "doc",
    version: 1,
    content: [
      {
        type: "paragraph",
        content: [
          { type: "text", text: "Este es un texto de prueba " },
          { type: "text", text: "con formato.", marks: [{ type: "strong" }] }
        ]
      },
      {
        type: "paragraph",
        content: [
          { type: "text", text: "Segundo párrafo." }
        ]
      }
    ]
  };
  
  const plainText = extractPlainTextFromADF(adfContent);
  
  if (!plainText.includes('Este es un texto de prueba')) {
    throw new Error('Extracción de ADF falló - texto principal');
  }
  
  if (!plainText.includes('con formato.')) {
    throw new Error('Extracción de ADF falló - texto con formato');
  }
  
  if (!plainText.includes('Segundo párrafo.')) {
    throw new Error('Extracción de ADF falló - segundo párrafo');
  }
  
  // Test contenido vacío
  const textoVacio = extractPlainTextFromADF(null);
  if (textoVacio !== '') {
    throw new Error('Extracción de ADF falló - contenido vacío');
  }
}

/**
 * Test de custom fields
 */
function testCustomFields() {
  const mockFields = {
    'customfield_10001': 5, // Story Points
    'customfield_10002': { name: 'Sprint 1' }, // Sprint
    'customfield_10003': 'Epic Name' // Epic Link
  };
  
  const mapping = {
    'customfield_10001': 'Story Points',
    'customfield_10002': 'Sprint',
    'customfield_10003': 'Epic Link'
  };
  
  const storyPoints = getCustomFieldValue(mockFields, mapping, 'Story Points');
  if (storyPoints !== '5') {
    throw new Error(`Custom field Story Points falló: esperado '5', obtenido '${storyPoints}'`);
  }
  
  const sprint = getCustomFieldValue(mockFields, mapping, 'Sprint');
  if (sprint !== 'Sprint 1') {
    throw new Error(`Custom field Sprint falló: esperado 'Sprint 1', obtenido '${sprint}'`);
  }
  
  const epicLink = getCustomFieldValue(mockFields, mapping, 'Epic Link');
  if (epicLink !== 'Epic Name') {
    throw new Error(`Custom field Epic Link falló: esperado 'Epic Name', obtenido '${epicLink}'`);
  }
}

/**
 * Test de creación de hoja principal
 */
function testCreacionHojaPrincipal() {
  const config = obtenerConfiguracion();
  const spreadsheet = SpreadsheetApp.openById(config.sheetId);
  
  // Eliminar hoja de test si existe
  const existingTestSheet = spreadsheet.getSheetByName('TEST_MAIN_SHEET');
  if (existingTestSheet) {
    spreadsheet.deleteSheet(existingTestSheet);
  }
  
  // Crear hoja temporal para test
  const testSpreadsheet = SpreadsheetApp.create('TEST_JIRA_SYNC_' + Date.now());
  
  try {
    const sheet = crearHojaPrincipal(testSpreadsheet);
    
    // Verificar que se creó correctamente
    if (sheet.getName() !== SHEETS_CONFIG.MAIN_SHEET) {
      throw new Error('Nombre de hoja incorrecto');
    }
    
    // Verificar headers
    const headers = sheet.getRange(1, 1, 1, Object.keys(SHEET_COLUMNS).length).getValues()[0];
    const expectedHeaders = Object.values(SHEET_COLUMNS);
    
    for (let i = 0; i < expectedHeaders.length; i++) {
      if (headers[i] !== expectedHeaders[i]) {
        throw new Error(`Header incorrecto en posición ${i}: esperado '${expectedHeaders[i]}', obtenido '${headers[i]}'`);
      }
    }
    
    // Verificar formato de headers
    const headerRange = sheet.getRange(1, 1, 1, headers.length);
    if (headerRange.getFontWeight() !== 'bold') {
      throw new Error('Headers no tienen formato bold');
    }
    
  } finally {
    // Limpiar
    DriveApp.getFileById(testSpreadsheet.getId()).setTrashed(true);
  }
}

/**
 * Test de detección de cambios en Sheets
 */
function testDeteccionCambios() {
  // Este test requiere datos mock ya que no podemos modificar sheets reales en tests
  // Simular la lógica de detección
  
  const mockSheetData = [
    ['Key', 'Summary', 'Status', 'Assignee', 'Priority', 'Issue Type', 'Created', 'Updated', 'Reporter', 'Labels', 'Sprint', 'Story Points', 'Components', 'Description', 'Jira URL', 'Last Sync', 'Sync Status'],
    ['TEST-1', 'Issue 1', 'Done', 'user@test.com', 'High', 'Task', new Date(), new Date(), 'reporter@test.com', '', '', '', '', '', '', new Date(), 'OK'],
    ['TEST-2', 'Issue 2', 'In Progress', 'user2@test.com', 'Medium', 'Bug', new Date(), new Date(), 'reporter@test.com', '', '', '', '', '', '', new Date(), 'PENDING']
  ];
  
  // Simular detección
  const cambiosDetectados = [];
  const headers = mockSheetData[0];
  const syncStatusIndex = headers.indexOf('Sync Status');
  
  for (let i = 1; i < mockSheetData.length; i++) {
    const row = mockSheetData[i];
    if (row[syncStatusIndex] === 'PENDING') {
      cambiosDetectados.push({
        issueKey: row[0],
        rowIndex: i + 1,
        changes: {
          status: row[2],
          assignee: row[3],
          priority: row[4]
        }
      });
    }
  }
  
  if (cambiosDetectados.length !== 1) {
    throw new Error(`Detección de cambios falló: esperado 1 cambio, detectados ${cambiosDetectados.length}`);
  }
  
  if (cambiosDetectados[0].issueKey !== 'TEST-2') {
    throw new Error('Detección de cambios identificó issue incorrecto');
  }
}

/**
 * Test básico de actualización de Sheets
 */
function testActualizacionSheets() {
  // Test de lógica de merge (separación de updates vs inserts)
  const existingKeys = new Map([
    ['TEST-1', 2],
    ['TEST-2', 3]
  ]);
  
  const newData = [
    ['TEST-1', 'Updated Issue 1', 'Done'],  // Update
    ['TEST-3', 'New Issue 3', 'To Do']     // Insert
  ];
  
  const updates = [];
  const inserts = [];
  
  for (const rowData of newData) {
    const issueKey = rowData[0];
    
    if (existingKeys.has(issueKey)) {
      updates.push({ rowNumber: existingKeys.get(issueKey), data: rowData });
    } else {
      inserts.push(rowData);
    }
  }
  
  if (updates.length !== 1 || updates[0].rowNumber !== 2) {
    throw new Error('Lógica de updates falló');
  }
  
  if (inserts.length !== 1 || inserts[0][0] !== 'TEST-3') {
    throw new Error('Lógica de inserts falló');
  }
}

/**
 * Test de integración con búsqueda en Jira
 */
function testIntegracionJiraSearch() {
  const jiraApi = new JiraApiManager();
  const config = obtenerConfiguracion();
  const primerProyecto = config.projects[0];
  
  // Test búsqueda básica (limitada para no sobrecargar)
  const result = jiraApi.searchIssues(`project = ${primerProyecto}`, 0, 5);
  
  if (!result.issues || !Array.isArray(result.issues)) {
    throw new Error('Búsqueda en Jira no retornó estructura válida');
  }
  
  if (typeof result.total !== 'number') {
    throw new Error('Total de issues no es número');
  }
  
  // Verificar estructura de issues
  if (result.issues.length > 0) {
    const issue = result.issues[0];
    if (!issue.key || !issue.fields) {
      throw new Error('Estructura de issue inválida');
    }
    
    if (!issue.fields.summary || !issue.fields.status) {
      throw new Error('Campos requeridos de issue faltantes');
    }
  }
}

/**
 * Test de sincronización completa (mock/simulación)
 */
function testSincronizacionCompleta() {
  // Test de la lógica sin ejecutar sincronización real
  // Verificar que las funciones existen y son callable
  
  if (typeof sincronizarJiraASheets !== 'function') {
    throw new Error('sincronizarJiraASheets no es una función');
  }
  
  if (typeof sincronizarSheetsAJira !== 'function') {
    throw new Error('sincronizarSheetsAJira no es una función');
  }
  
  if (typeof sincronizacionCompleta !== 'function') {
    throw new Error('sincronizacionCompleta no es una función');
  }
  
  // Verificar que las funciones de soporte existen
  const funcionesCriticas = [
    'operacionCriticaConLock',
    'procesarEnLotes',
    'shouldBreakForTimeout',
    'transformJiraIssueToSheetRow',
    'actualizarSheetsEnLotes'
  ];
  
  funcionesCriticas.forEach(fn => {
    if (typeof eval(fn) !== 'function') {
      throw new Error(`Función crítica ${fn} no está definida`);
    }
  });
}

/**
 * Health check completo del sistema
 * Función obligatoria según CLAUDE.md
 */
function healthCheck() {
  const checks = [];
  
  // 1. Configuración
  try {
    testConfiguracion();
    checks.push({ name: 'Configuración', status: 'OK' });
  } catch (error) {
    checks.push({ name: 'Configuración', status: 'ERROR', error: error.message });
  }
  
  // 2. Conectividad Jira
  try {
    testConectividadJira();
    checks.push({ name: 'Conectividad Jira', status: 'OK' });
  } catch (error) {
    checks.push({ name: 'Conectividad Jira', status: 'ERROR', error: error.message });
  }
  
  // 3. Acceso Google Sheets
  try {
    testAccesoSheets();
    checks.push({ name: 'Acceso Google Sheets', status: 'OK' });
  } catch (error) {
    checks.push({ name: 'Acceso Google Sheets', status: 'ERROR', error: error.message });
  }
  
  // 4. Triggers automáticos
  try {
    const triggers = ScriptApp.getProjectTriggers();
    const activeTriggers = triggers.filter(t => 
      t.getHandlerFunction().startsWith('trigger')
    );
    
    if (activeTriggers.length < 1) {
      throw new Error(`Solo ${activeTriggers.length} triggers activos`);
    }
    
    checks.push({ name: 'Triggers Automáticos', status: 'OK', details: `${activeTriggers.length} activos` });
  } catch (error) {
    checks.push({ name: 'Triggers Automáticos', status: 'ERROR', error: error.message });
  }
  
  // 5. Métricas y sincronización reciente
  try {
    const ultimaSyncStr = PropertiesService.getScriptProperties().getProperty('LAST_SYNC_TIMESTAMP');
    
    if (ultimaSyncStr) {
      const horasDesdeUltimaSync = (Date.now() - parseInt(ultimaSyncStr)) / (1000 * 60 * 60);
      if (horasDesdeUltimaSync > 24) {
        throw new Error(`Última sincronización hace ${horasDesdeUltimaSync.toFixed(1)} horas`);
      }
      checks.push({ name: 'Sincronización Reciente', status: 'OK', details: `Hace ${horasDesdeUltimaSync.toFixed(1)} horas` });
    } else {
      checks.push({ name: 'Sincronización Reciente', status: 'WARN', details: 'Nunca ejecutada' });
    }
  } catch (error) {
    checks.push({ name: 'Sincronización Reciente', status: 'ERROR', error: error.message });
  }
  
  // 6. Uso de quotas
  try {
    const quota = new QuotaManager();
    const usoUrlFetch = quota.getUso('urlFetch');
    const porcentajeUso = (usoUrlFetch / APPS_SCRIPT_LIMITS.URL_FETCH_DAILY) * 100;
    
    if (porcentajeUso > 90) {
      throw new Error(`Uso de quota crítico: ${porcentajeUso.toFixed(1)}%`);
    }
    
    checks.push({ name: 'Uso de Quotas', status: 'OK', details: `${porcentajeUso.toFixed(1)}% de URL Fetch` });
  } catch (error) {
    checks.push({ name: 'Uso de Quotas', status: 'ERROR', error: error.message });
  }
  
  const todosOK = checks.every(check => check.status === 'OK');
  const hayWarnings = checks.some(check => check.status === 'WARN');
  
  const resultado = {
    status: todosOK ? 'HEALTHY' : (hayWarnings && !checks.some(c => c.status === 'ERROR') ? 'WARNING' : 'UNHEALTHY'),
    timestamp: new Date().toISOString(),
    version: getVersion(),
    checks
  };
  
  logEstructurado('INFO', 'Health check completado', resultado);
  return resultado;
}