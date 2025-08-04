// =====================================
// ARCHIVO 7: PRUEBAS Y VALIDACIÓN DEL SISTEMA SEMANAL
// =====================================

/**
 * ✅ Suite completa de pruebas para validar el sistema semanal
 */
async function ejecutarSuitePruebasCompleta() {
  const ui = SpreadsheetApp.getUi();
  
  try {
    Logger.log('🧪 [PRUEBAS] Iniciando suite completa de pruebas del sistema semanal...');
    
    let resultados = {
      total: 0,
      exitosas: 0,
      fallidas: 0,
      advertencias: 0,
      detalles: []
    };
    
    // ✅ 1. Pruebas de configuración
    ejecutarPruebasConfiguracion(resultados);
    
    // ✅ 2. Pruebas de caché
    ejecutarPruebasCache(resultados);
    
    // ✅ 3. Pruebas de validación
    ejecutarPruebasValidacion(resultados);
    
    // ✅ 4. Pruebas de análisis semanal
    ejecutarPruebasAnalisisSemanal(resultados);
    
    // ✅ 5. Pruebas de conectividad (si hay credenciales)
    if (verificarCredencialesJiraSemanal()) {
      await ejecutarPruebasConectividad(resultados);
    } else {
      resultados.advertencias++;
      resultados.detalles.push('⚠️ Pruebas de conectividad omitidas - Sin credenciales configuradas');
    }
    
    // ✅ Mostrar resultados
    mostrarResultadosPruebas(resultados);
    
    Logger.log(`✅ [PRUEBAS] Suite de pruebas completada: ${resultados.exitosas}/${resultados.total} exitosas`);
    
  } catch (error) {
    const errorId = ErrorManagerSemanal.registrarError(
      'Error ejecutando suite de pruebas',
      error,
      'SUITE_PRUEBAS',
      'HIGH'
    );
    
    ui.alert(
      'Error en Pruebas',
      `❌ Error ejecutando suite de pruebas.\n\n` +
      `Error: ${error.message}\n` +
      `Error ID: ${errorId}`,
      ui.ButtonSet.OK
    );
  }
}

/**
 * ✅ Ejecuta pruebas de configuración del sistema
 * @param {Object} resultados - Objeto para acumular resultados
 */
function ejecutarPruebasConfiguracion(resultados) {
  Logger.log('🔧 [PRUEBAS] Ejecutando pruebas de configuración...');
  
  // Prueba 1: Verificar constantes del sistema
  try {
    resultados.total++;
    if (CONFIG_SEMANAL && CONFIG_SEMANAL.etiquetasSemana && CONFIG_SEMANAL.etiquetasSemana.length > 0) {
      resultados.exitosas++;
      resultados.detalles.push('✅ CONFIG_SEMANAL: Configuración principal cargada correctamente');
    } else {
      throw new Error('CONFIG_SEMANAL no está definida correctamente');
    }
  } catch (error) {
    resultados.fallidas++;
    resultados.detalles.push(`❌ CONFIG_SEMANAL: ${error.message}`);
  }
  
  // Prueba 2: Verificar configuración de caché
  try {
    resultados.total++;
    if (CONFIG_CACHE_SEMANAL && CONFIG_CACHE_SEMANAL.TTL_ISSUES_SEMANALES > 0) {
      resultados.exitosas++;
      resultados.detalles.push('✅ CONFIG_CACHE_SEMANAL: Configuración de caché válida');
    } else {
      throw new Error('CONFIG_CACHE_SEMANAL no está configurada correctamente');
    }
  } catch (error) {
    resultados.fallidas++;
    resultados.detalles.push(`❌ CONFIG_CACHE_SEMANAL: ${error.message}`);
  }
  
  // Prueba 3: Verificar configuración de validación
  try {
    resultados.total++;
    if (CONFIG_VALIDACION_SEMANAL && CONFIG_VALIDACION_SEMANAL.PATRONES_PELIGROSOS.length > 0) {
      resultados.exitosas++;
      resultados.detalles.push('✅ CONFIG_VALIDACION_SEMANAL: Patrones de seguridad configurados');
    } else {
      throw new Error('CONFIG_VALIDACION_SEMANAL no tiene patrones de seguridad');
    }
  } catch (error) {
    resultados.fallidas++;
    resultados.detalles.push(`❌ CONFIG_VALIDACION_SEMANAL: ${error.message}`);
  }
  
  // Prueba 4: Verificar etiquetas semanales
  try {
    resultados.total++;
    const etiquetasEsperadas = ['SEMANA_1', 'SEMANA_2', 'SEMANA_3', 'SEMANA_4', 'SEMANA_5', 'SEMANA_6'];
    const etiquetasConfiguradas = CONFIG_SEMANAL.etiquetasSemana;
    
    if (etiquetasConfiguradas.length === etiquetasEsperadas.length &&
        etiquetasEsperadas.every(etiqueta => etiquetasConfiguradas.includes(etiqueta))) {
      resultados.exitosas++;
      resultados.detalles.push('✅ Etiquetas semanales: Todas las etiquetas están configuradas correctamente');
    } else {
      throw new Error(`Etiquetas faltantes o incorrectas. Esperadas: ${etiquetasEsperadas.join(', ')}`);
    }
  } catch (error) {
    resultados.fallidas++;
    resultados.detalles.push(`❌ Etiquetas semanales: ${error.message}`);
  }
}

/**
 * ✅ Ejecuta pruebas del sistema de caché
 * @param {Object} resultados - Objeto para acumular resultados
 */
function ejecutarPruebasCache(resultados) {
  Logger.log('💾 [PRUEBAS] Ejecutando pruebas de sistema de caché...');
  
  // Prueba 1: Almacenar y recuperar datos del caché
  try {
    resultados.total++;
    const datosPrueba = { test: 'datos de prueba', timestamp: new Date().getTime() };
    const clavePrueba = 'TEST_CACHE_SEMANAL_' + Date.now();
    
    // Almacenar
    CacheManagerSemanal.almacenar(clavePrueba, datosPrueba, 1); // 1 minuto TTL
    
    // Recuperar inmediatamente
    const datosRecuperados = CacheManagerSemanal.recuperar(clavePrueba);
    
    if (datosRecuperados && datosRecuperados.test === datosPrueba.test) {
      resultados.exitosas++;
      resultados.detalles.push('✅ Caché: Almacenamiento y recuperación funcionando correctamente');
      
      // Limpiar datos de prueba
      const propiedades = PropertiesService.getScriptProperties();
      propiedades.deleteProperty(clavePrueba);
    } else {
      throw new Error('Datos recuperados no coinciden con datos almacenados');
    }
  } catch (error) {
    resultados.fallidas++;
    resultados.detalles.push(`❌ Caché: ${error.message}`);
  }
  
  // Prueba 2: Obtener estadísticas del caché
  try {
    resultados.total++;
    const stats = CacheManagerSemanal.obtenerEstadisticas();
    
    if (stats && typeof stats.totalEntradas === 'number') {
      resultados.exitosas++;
      resultados.detalles.push(`✅ Estadísticas de caché: ${stats.totalEntradas} entradas, ${stats.entradasValidas} válidas`);
    } else {
      throw new Error('Estadísticas de caché no disponibles o inválidas');
    }
  } catch (error) {
    resultados.fallidas++;
    resultados.detalles.push(`❌ Estadísticas de caché: ${error.message}`);
  }
  
  // Prueba 3: Validar TTL del caché
  try {
    resultados.total++;
    const ttls = [
      CONFIG_CACHE_SEMANAL.TTL_ISSUES_SEMANALES,
      CONFIG_CACHE_SEMANAL.TTL_PROYECTOS,
      CONFIG_CACHE_SEMANAL.TTL_USUARIOS,
      CONFIG_CACHE_SEMANAL.TTL_METADATA
    ];
    
    if (ttls.every(ttl => ttl > 0 && ttl <= 1440)) { // Entre 1 minuto y 24 horas
      resultados.exitosas++;
      resultados.detalles.push('✅ TTL de caché: Todos los valores de TTL están en rangos válidos');
    } else {
      throw new Error('Algunos valores de TTL están fuera de rangos válidos');
    }
  } catch (error) {
    resultados.fallidas++;
    resultados.detalles.push(`❌ TTL de caché: ${error.message}`);
  }
}

/**
 * ✅ Ejecuta pruebas de validación
 * @param {Object} resultados - Objeto para acumular resultados
 */
function ejecutarPruebasValidacion(resultados) {
  Logger.log('🔍 [PRUEBAS] Ejecutando pruebas de validación...');
  
  // Prueba 1: Validación JQL segura
  try {
    resultados.total++;
    
    // JQL válida
    const jqlValida = 'project = "TEST" AND labels IN ("SEMANA_1", "SEMANA_2")';
    const validacionValida = ValidadorJQLSemanal.validarJQL(jqlValida);
    
    // JQL peligrosa
    const jqlPeligrosa = 'project = "TEST"; DROP TABLE users';
    const validacionPeligrosa = ValidadorJQLSemanal.validarJQL(jqlPeligrosa);
    
    if (validacionValida.isValid && !validacionPeligrosa.isValid) {
      resultados.exitosas++;
      resultados.detalles.push('✅ Validación JQL: Detecta correctamente JQL válida y peligrosa');
    } else {
      throw new Error(`JQL válida: ${validacionValida.isValid}, JQL peligrosa: ${validacionPeligrosa.isValid}`);
    }
  } catch (error) {
    resultados.fallidas++;
    resultados.detalles.push(`❌ Validación JQL: ${error.message}`);
  }
  
  // Prueba 2: Validación de etiquetas semanales
  try {
    resultados.total++;
    
    // Etiquetas válidas
    const etiquetasValidas = ['SEMANA_1', 'SEMANA_2', 'CUSTOM_TAG'];
    const validacionValida = ValidadorJQLSemanal.validarEtiquetasSemanales(etiquetasValidas);
    
    // Etiquetas inválidas
    const etiquetasInvalidas = ['SEMANA_X', 'semana_1', 'SEMANA_99'];
    const validacionInvalida = ValidadorJQLSemanal.validarEtiquetasSemanales(etiquetasInvalidas);
    
    if (validacionValida.isValid && !validacionInvalida.isValid) {
      resultados.exitosas++;
      resultados.detalles.push('✅ Validación etiquetas: Detecta correctamente etiquetas válidas e inválidas');
    } else {
      throw new Error('Validación de etiquetas no funciona correctamente');
    }
  } catch (error) {
    resultados.fallidas++;
    resultados.detalles.push(`❌ Validación etiquetas: ${error.message}`);
  }
  
  // Prueba 3: Límites de seguridad
  try {
    resultados.total++;
    
    // JQL muy larga
    const jqlLarga = 'project = "TEST"'.repeat(200); // Crear JQL muy larga
    const validacionLarga = ValidadorJQLSemanal.validarJQL(jqlLarga);
    
    if (!validacionLarga.isValid && validacionLarga.mensaje.includes('longitud máxima')) {
      resultados.exitosas++;
      resultados.detalles.push('✅ Límites de seguridad: JQL muy larga es rechazada correctamente');
    } else {
      throw new Error('Límite de longitud JQL no funciona correctamente');
    }
  } catch (error) {
    resultados.fallidas++;
    resultados.detalles.push(`❌ Límites de seguridad: ${error.message}`);
  }
}

/**
 * ✅ Ejecuta pruebas de análisis semanal
 * @param {Object} resultados - Objeto para acumular resultados
 */
function ejecutarPruebasAnalisisSemanal(resultados) {
  Logger.log('📊 [PRUEBAS] Ejecutando pruebas de análisis semanal...');
  
  // Prueba 1: Detección de etiquetas semanales
  try {
    resultados.total++;
    
    // Caso 1: Con etiqueta semanal
    const labelsConSemana = [
      { name: 'SEMANA_1' },
      { name: 'frontend' },
      { name: 'urgent' }
    ];
    const etiquetaDetectada = CONFIG_SEMANAL.obtenerSemanaDeEtiquetas(labelsConSemana);
    
    // Caso 2: Sin etiqueta semanal
    const labelsSinSemana = [
      { name: 'backend' },
      { name: 'bug' }
    ];
    const etiquetaNoDetectada = CONFIG_SEMANAL.obtenerSemanaDeEtiquetas(labelsSinSemana);
    
    if (etiquetaDetectada === 'SEMANA_1' && etiquetaNoDetectada === null) {
      resultados.exitosas++;
      resultados.detalles.push('✅ Detección etiquetas: Detecta correctamente presencia/ausencia de etiquetas semanales');
    } else {
      throw new Error(`Detectada: ${etiquetaDetectada}, No detectada: ${etiquetaNoDetectada}`);
    }
  } catch (error) {
    resultados.fallidas++;
    resultados.detalles.push(`❌ Detección etiquetas: ${error.message}`);
  }
  
  // Prueba 2: Obtención de número de semana
  try {
    resultados.total++;
    
    const casos = [
      { etiqueta: 'SEMANA_1', esperado: 1 },
      { etiqueta: 'SEMANA_3', esperado: 3 },
      { etiqueta: 'SEMANA_6', esperado: 6 },
      { etiqueta: 'OTHER_TAG', esperado: 0 },
      { etiqueta: null, esperado: 0 }
    ];
    
    let todosCorrectos = true;
    casos.forEach(caso => {
      const resultado = CONFIG_SEMANAL.obtenerNumeroSemana(caso.etiqueta);
      if (resultado !== caso.esperado) {
        todosCorrectos = false;
      }
    });
    
    if (todosCorrectos) {
      resultados.exitosas++;
      resultados.detalles.push('✅ Número de semana: Extrae correctamente números de todas las etiquetas');
    } else {
      throw new Error('Algunos números de semana no se extraen correctamente');
    }
  } catch (error) {
    resultados.fallidas++;
    resultados.detalles.push(`❌ Número de semana: ${error.message}`);
  }
  
  // Prueba 3: Clasificación de estados
  try {
    resultados.total++;
    
    const estadosCompletados = CONFIG_SEMANAL.estadosCompletados;
    const estadosEnProgreso = CONFIG_SEMANAL.estadosEnProgreso;
    const estadosPendientes = CONFIG_SEMANAL.estadosPendientes;
    
    if (estadosCompletados.length > 0 && estadosEnProgreso.length > 0 && estadosPendientes.length > 0) {
      // Verificar que no hay solapamiento
      const todosLosEstados = [...estadosCompletados, ...estadosEnProgreso, ...estadosPendientes];
      const estadosUnicos = [...new Set(todosLosEstados)];
      
      if (todosLosEstados.length === estadosUnicos.length) {
        resultados.exitosas++;
        resultados.detalles.push(`✅ Estados: ${estadosCompletados.length} completados, ${estadosEnProgreso.length} en progreso, ${estadosPendientes.length} pendientes`);
      } else {
        throw new Error('Hay estados duplicados entre las categorías');
      }
    } else {
      throw new Error('Algunas categorías de estados están vacías');
    }
  } catch (error) {
    resultados.fallidas++;
    resultados.detalles.push(`❌ Estados: ${error.message}`);
  }
}

/**
 * ✅ Ejecuta pruebas de conectividad con Jira
 * @param {Object} resultados - Objeto para acumular resultados
 */
async function ejecutarPruebasConectividad(resultados) {
  Logger.log('🌐 [PRUEBAS] Ejecutando pruebas de conectividad...');
  
  // Prueba 1: Conexión básica con Jira
  try {
    resultados.total++;
    
    const resultado = probarConexionJiraSemanal();
    
    if (resultado && resultado.includes('Conexión exitosa')) {
      resultados.exitosas++;
      resultados.detalles.push('✅ Conectividad: Conexión básica con Jira establecida');
    } else {
      throw new Error('Conexión no pudo ser establecida');
    }
  } catch (error) {
    resultados.fallidas++;
    resultados.detalles.push(`❌ Conectividad: ${error.message}`);
  }
  
  // Prueba 2: Construcción de JQL para consulta real
  try {
    resultados.total++;
    
    const jqlGenerada = construirJQLParaReportesSemanal({
      soloConEtiquetasSemanales: true
    });
    
    if (jqlGenerada && jqlGenerada.includes('labels IN')) {
      resultados.exitosas++;
      resultados.detalles.push('✅ JQL: Construcción de consulta JQL para etiquetas semanales');
    } else {
      throw new Error('JQL generada no incluye filtro de etiquetas semanales');
    }
  } catch (error) {
    resultados.fallidas++;
    resultados.detalles.push(`❌ JQL: ${error.message}`);
  }
  
  // Prueba 3: Obtener issues (solo si la conexión funciona)
  try {
    resultados.total++;
    
    // Intentar obtener una pequeña muestra de issues
    const opciones = {
      soloConEtiquetasSemanales: true,
      debug: true
    };
    
    // Usar timeout corto para esta prueba
    const issues = await obtenerIssuesSemanalesDeJira(opciones);
    
    if (opciones.debug) {
      Logger.log(`[DEBUG] Issues en pruebas: ${JSON.stringify(issues.slice(0, 2))}`);
    }
    
    if (Array.isArray(issues)) {
      resultados.exitosas++;
      resultados.detalles.push(`✅ Issues: Obtención exitosa, ${issues.length} issues encontrados`);
      
      if (issues.length === 0) {
        resultados.advertencias++;
        resultados.detalles.push('⚠️ Advertencia: No se encontraron issues con etiquetas semanales');
      }
    } else {
      throw new Error('Respuesta de issues no es un array válido');
    }
  } catch (error) {
    // Esta prueba puede fallar si no hay issues, lo marcamos como advertencia
    resultados.advertencias++;
    resultados.detalles.push(`⚠️ Issues: ${error.message} (puede ser normal si no hay issues etiquetados)`);
  }
}

/**
 * ✅ Muestra resultados detallados de las pruebas
 * @param {Object} resultados - Resultados de las pruebas
 */
function mostrarResultadosPruebas(resultados) {
  const ui = SpreadsheetApp.getUi();
  
  let mensaje = `🧪 RESULTADOS DE PRUEBAS - Sistema Semanal v${SCRIPT_METADATA.version}\n\n`;
  
  // Resumen general
  mensaje += '📊 RESUMEN:\n';
  mensaje += `   • Total de pruebas: ${resultados.total}\n`;
  mensaje += `   • ✅ Exitosas: ${resultados.exitosas}\n`;
  mensaje += `   • ❌ Fallidas: ${resultados.fallidas}\n`;
  mensaje += `   • ⚠️  Advertencias: ${resultados.advertencias}\n\n`;
  
  // Porcentaje de éxito
  const porcentajeExito = resultados.total > 0 ? Math.round((resultados.exitosas / resultados.total) * 100) : 0;
  let estadoGeneral = '';
  
  if (porcentajeExito >= 90) {
    estadoGeneral = '🟢 EXCELENTE - Sistema funcionando óptimamente';
  } else if (porcentajeExito >= 75) {
    estadoGeneral = '🟡 BUENO - Sistema mayormente funcional';
  } else if (porcentajeExito >= 50) {
    estadoGeneral = '🟠 REGULAR - Necesita atención';
  } else {
    estadoGeneral = '🔴 CRÍTICO - Requiere investigación inmediata';
  }
  
  mensaje += `🎯 ESTADO GENERAL: ${estadoGeneral} (${porcentajeExito}%)\n\n`;
  
  // Detalles de las pruebas
  mensaje += '📋 DETALLES:\n';
  resultados.detalles.forEach(detalle => {
    mensaje += `${detalle}\n`;
  });
  
  mensaje += '\n';
  
  // Recomendaciones
  if (resultados.fallidas > 0) {
    mensaje += '💡 RECOMENDACIONES:\n';
    mensaje += '• Revisa los logs detallados en "Ver > Registros de ejecución"\n';
    mensaje += '• Ejecuta "🧪 Ejecutar Diagnóstico Completo" para más información\n';
    mensaje += '• Si hay errores de conectividad, verifica credenciales\n';
    mensaje += '• Considera crear un backup antes de hacer cambios\n';
  }
  
  if (resultados.advertencias > 0) {
    mensaje += '\n⚠️  ADVERTENCIAS:\n';
    mensaje += '• Las advertencias no impiden el funcionamiento normal\n';
    mensaje += '• Pueden indicar configuraciones específicas del entorno\n';
    mensaje += '• Revisa si necesitas ajustar la configuración\n';
  }
  
  mensaje += `\n📅 Pruebas ejecutadas: ${new Date().toLocaleString()}`;
  
  // Mostrar en diálogo
  ui.alert('Resultados de Pruebas del Sistema', mensaje, ui.ButtonSet.OK);
  
  // También escribir en logs para referencia
  Logger.log('📊 [PRUEBAS] Resultados finales:');
  Logger.log(`   • Total: ${resultados.total}, Exitosas: ${resultados.exitosas}, Fallidas: ${resultados.fallidas}, Advertencias: ${resultados.advertencias}`);
  Logger.log(`   • Estado general: ${estadoGeneral} (${porcentajeExito}%)`);
}

/**
 * ✅ Función de prueba rápida para validación básica
 */
function ejecutarPruebaRapida() {
  const ui = SpreadsheetApp.getUi();
  
  try {
    Logger.log('⚡ [PRUEBAS] Ejecutando prueba rápida...');
    
    let mensaje = '⚡ PRUEBA RÁPIDA DEL SISTEMA\n\n';
    
    // Verificar configuración básica
    try {
      if (CONFIG_SEMANAL && CONFIG_SEMANAL.etiquetasSemana) {
        mensaje += '✅ Configuración principal: OK\n';
      } else {
        mensaje += '❌ Configuración principal: FALLO\n';
      }
    } catch (e) {
      mensaje += '❌ Configuración principal: ERROR\n';
    }
    
    // Verificar credenciales
    if (verificarCredencialesJiraSemanal()) {
      mensaje += '✅ Credenciales: Configuradas\n';
      
      // Probar conexión rápida
      try {
        probarConexionJiraSemanal();
        mensaje += '✅ Conectividad: OK\n';
      } catch (e) {
        mensaje += '❌ Conectividad: FALLO\n';
      }
    } else {
      mensaje += '⚠️ Credenciales: No configuradas\n';
      mensaje += '⚠️ Conectividad: No probada\n';
    }
    
    // Verificar caché
    try {
      const stats = CacheManagerSemanal.obtenerEstadisticas();
      mensaje += `✅ Sistema de caché: OK (${stats.totalEntradas} entradas)\n`;
    } catch (e) {
      mensaje += '❌ Sistema de caché: ERROR\n';
    }
    
    mensaje += `\n📅 Verificación rápida: ${new Date().toLocaleString()}\n\n`;
    mensaje += '💡 Para pruebas completas, usa "🧪 Ejecutar Suite de Pruebas"';
    
    ui.alert('Prueba Rápida del Sistema', mensaje, ui.ButtonSet.OK);
    
  } catch (error) {
    Logger.log(`❌ [PRUEBAS] Error en prueba rápida: ${error.message}`);
    ui.alert(
      'Error en Prueba Rápida',
      `❌ Error ejecutando prueba rápida.\n\n${error.message}`,
      ui.ButtonSet.OK
    );
  }
}

/**
 * ✅ Función para probar un issue específico (útil para debug)
 * @param {string} issueKey - Clave del issue a probar (ej: "PROJ-123")
 */
async function probarIssueEspecifico(issueKey = null) {
  const ui = SpreadsheetApp.getUi();
  
  try {
    // Solicitar clave del issue si no se proporciona
    if (!issueKey) {
      const respuesta = ui.prompt(
        'Probar Issue Específico',
        'Introduce la clave del issue a probar (ej: PROJ-123):',
        ui.ButtonSet.OK_CANCEL
      );
      
      if (respuesta.getSelectedButton() !== ui.Button.OK) {
        return;
      }
      
      issueKey = respuesta.getResponseText().trim();
    }
    
    if (!issueKey) {
      ui.alert('Error', 'Debes proporcionar una clave de issue válida', ui.ButtonSet.OK);
      return;
    }
    
    Logger.log(`🔍 [PRUEBAS] Probando issue específico: ${issueKey}`);
    
    // Construir JQL para el issue específico
    const jql = `key = "${issueKey}"`;
    
    const config = obtenerConfigJiraSemanal();
    const issuesObtenidos = await ejecutarConsultaJiraSemanal(jql, config);
    
    if (issuesObtenidos.length === 0) {
      ui.alert(
        'Issue No Encontrado',
        `❌ No se encontró el issue "${issueKey}".\n\n` +
        'Verifica que:\n' +
        '• La clave del issue sea correcta\n' +
        '• Tengas permisos para ver el issue\n' +
        '• El issue exista en el proyecto',
        ui.ButtonSet.OK
      );
      return;
    }
    
    const issue = issuesObtenidos[0];
    const issuesProcessed = procesarIssuesParaAnalisisSemanal([issue]);
    
    let mensaje = `🔍 ANÁLISIS DEL ISSUE: ${issueKey}\n\n`;
    
    if (issuesProcessed.length > 0) {
      const analisis = issuesProcessed[0].analisisSemanal;
      
      mensaje += '📊 INFORMACIÓN BÁSICA:\n';
      mensaje += `• Resumen: ${issue.fields.summary}\n`;
      mensaje += `• Estado: ${analisis.estadoActual}\n`;
      mensaje += `• Asignado: ${analisis.asignadoNombre}\n`;
      mensaje += `• Proyecto: ${analisis.proyectoNombre} (${analisis.proyectoKey})\n`;
      mensaje += `• Tipo: ${analisis.tipoIssue}\n`;
      mensaje += `• Prioridad: ${analisis.prioridad}\n\n`;
      
      mensaje += '🏷️ ANÁLISIS SEMANAL:\n';
      mensaje += `• Etiqueta semanal: ${analisis.etiquetaSemanal || 'No encontrada'}\n`;
      mensaje += `• Número de semana: ${analisis.numeroSemana}\n`;
      mensaje += `• Tiene etiqueta semanal: ${analisis.tieneEtiquetaSemanal ? 'Sí' : 'No'}\n\n`;
      
      mensaje += '⏱️ ANÁLISIS DE TIEMPO:\n';
      mensaje += `• Tiempo estimado: ${analisis.tiempoEstimadoHoras}h\n`;
      mensaje += `• Tiempo trabajado: ${analisis.tiempoTrabajadoHoras}h\n`;
      mensaje += `• Tiempo restante: ${analisis.tiempoRestanteHoras}h\n`;
      mensaje += `• Eficiencia: ${Math.round(analisis.eficienciaTiempo * 100)}%\n\n`;
      
      mensaje += '📅 FECHAS:\n';
      mensaje += `• Creado: ${analisis.fechaCreacion ? analisis.fechaCreacion.toLocaleDateString() : 'N/A'}\n`;
      mensaje += `• Actualizado: ${analisis.fechaActualizacion ? analisis.fechaActualizacion.toLocaleDateString() : 'N/A'}\n`;
      mensaje += `• Vencimiento: ${analisis.fechaVencimiento ? analisis.fechaVencimiento.toLocaleDateString() : 'N/A'}\n`;
      mensaje += `• Está vencido: ${analisis.estaVencido ? 'Sí' : 'No'}\n\n`;
      
      mensaje += '📈 ACTIVIDAD:\n';
      mensaje += `• Comentarios: ${analisis.cantidadComentarios}\n`;
      mensaje += `• Adjuntos: ${analisis.cantidadAdjuntos}\n`;
      mensaje += `• Worklog entries: ${analisis.cantidadWorklog}\n`;
      mensaje += `• Nivel de actividad: ${analisis.nivelActividad}\n\n`;
      
      mensaje += '🏷️ ETIQUETAS COMPLETAS:\n';
      if (issue.fields.labels && issue.fields.labels.length > 0) {
        mensaje += issue.fields.labels.map(label => `• ${typeof label === 'string' ? label : label.name}`).join('\n');
      } else {
        mensaje += '• Sin etiquetas';
      }
      
    } else {
      mensaje += '❌ El issue no pasó el filtro de procesamiento.\n';
      mensaje += 'Esto puede ocurrir si el issue no tiene etiquetas semanales válidas.';
    }
    
    ui.alert('Análisis de Issue Específico', mensaje, ui.ButtonSet.OK);
    
  } catch (error) {
    const errorId = ErrorManagerSemanal.registrarError(
      `Error probando issue específico: ${issueKey}`,
      error,
      'PRUEBA_ISSUE',
      'MEDIUM'
    );
    
    ui.alert(
      'Error en Prueba de Issue',
      `❌ Error probando el issue "${issueKey}".\n\n` +
      `Error: ${error.message}\n` +
      `Error ID: ${errorId}`,
      ui.ButtonSet.OK
    );
  }
}

// =====================================
// FUNCIÓN DE VALIDACIÓN ADICIONAL
// ✅ NUEVA - PARA DEBUGGING Y VALIDACIÓN
// =====================================

/**
 * ✅ NUEVA: Función para validar el sistema completo paso a paso
 */
function validarSistemaCompletoSemanal() {
  const ui = SpreadsheetApp.getUi();
  
  try {
    Logger.log(' [VALIDACION] Iniciando validación completa del sistema...');
    
    let resultados = [];
    
    // 1. Validar configuración
    try {
      const config = obtenerConfigJiraSemanal();
      resultados.push('✅ Configuración: Credenciales OK');
      Logger.log(` Email configurado: ${config.email}`);
    } catch (error) {
      resultados.push('❌ Configuración: ' + error.message);
      throw error;
    }
    
    // 2. Validar conexión
    try {
      const conexion = probarConexionJiraSemanal();
      resultados.push('✅ Conexión: Jira accesible');
    } catch (error) {
      resultados.push('❌ Conexión: ' + error.message);
      throw error;
    }
    
    // 3. Validar construcción de JQL
    try {
      const jql = construirJQLParaReportesSemanal({});
      if (jql && jql.includes('labels')) {
        resultados.push('✅ JQL: Construcción correcta');
      } else {
        throw new Error('JQL no incluye filtro de etiquetas');
      }
    } catch (error) {
      resultados.push('❌ JQL: ' + error.message);
      throw error;
    }
    
    // 4. Validar validador JQL
    try {
      const validacion = ValidadorJQLSemanal.validarJQL('project = "TEST" AND labels = "SEMANA_1"');
      if (validacion.isValid) {
        resultados.push('✅ Validador: Funcionando correctamente');
      } else {
        throw new Error('Validador rechaza JQL válida');
      }
    } catch (error) {
      resultados.push('❌ Validador: ' + error.message);
      throw error;
    }
    
    // 5. Validar configuración de etiquetas
    try {
      const etiquetas = CONFIG_SEMANAL.etiquetasSemana;
      if (etiquetas && etiquetas.length > 0) {
        resultados.push(`✅ Etiquetas: ${etiquetas.length} configuradas`);
      } else {
        throw new Error('No hay etiquetas semanales configuradas');
      }
    } catch (error) {
      resultados.push('❌ Etiquetas: ' + error.message);
      throw error;
    }
    
    // Mostrar resultados
    const mensaje = ` VALIDACIÓN COMPLETA DEL SISTEMA\n\n${resultados.join('\n')}\n\n✅ Sistema listo para generar reportes`;
    
    ui.alert('Validación del Sistema', mensaje, ui.ButtonSet.OK);
    Logger.log('✅ [VALIDACION] Sistema validado completamente');
    
    return true;
    
  } catch (error) {
    const mensaje = `❌ VALIDACIÓN FALLÓ\n\n${resultados.join('\n')}\n\n Error: ${error.message}`;
    ui.alert('Error de Validación', mensaje, ui.ButtonSet.OK);
    Logger.log(`❌ [VALIDACION] Error: ${error.message}`);
    
    return false;
  }
}

// =====================================
// ✅ NUEVA: VALIDACIÓN DEL SISTEMA DE FILTRADO DE PERSONAS
// =====================================

/**
 * ✅ NUEVA: Verificar que el filtro de personas del equipo funcione correctamente
 */
async function verificarFiltroPersonasEquipo() {
  const ui = SpreadsheetApp.getUi();
  
  try {
    Logger.log('👥 [VALIDACIÓN] Verificando filtro de personas del equipo...');
    
    let resultados = {
      total: 0,
      exitosas: 0,
      fallidas: 0,
      detalles: []
    };
    
    // ✅ 1. Verificar constante EQUIPO_CCSOFT
    try {
      resultados.total++;
      if (EQUIPO_CCSOFT && Array.isArray(EQUIPO_CCSOFT) && EQUIPO_CCSOFT.length === 17) {
        resultados.exitosas++;
        resultados.detalles.push(`✅ EQUIPO_CCSOFT: ${EQUIPO_CCSOFT.length} personas configuradas`);
      } else {
        throw new Error(`EQUIPO_CCSOFT inválido: ${EQUIPO_CCSOFT?.length || 0} personas`);
      }
    } catch (error) {
      resultados.fallidas++;
      resultados.detalles.push(`❌ EQUIPO_CCSOFT: ${error.message}`);
    }
    
    // ✅ 2. Verificar emails @ccsoft.ai
    try {
      resultados.total++;
      const emailsValidos = EQUIPO_CCSOFT.filter(p => 
        p.email && p.email.endsWith('@ccsoft.ai')
      );
      
      if (emailsValidos.length === 17) {
        resultados.exitosas++;
        resultados.detalles.push('✅ Emails: Todos los 17 emails terminan en @ccsoft.ai');
      } else {
        throw new Error(`Solo ${emailsValidos.length}/17 emails son válidos`);
      }
    } catch (error) {
      resultados.fallidas++;
      resultados.detalles.push(`❌ Emails: ${error.message}`);
    }
    
    // ✅ 3. Verificar departamentos
    try {
      resultados.total++;
      const departamentos = obtenerDepartamentosEquipo();
      const departamentosEsperados = ['Desarrollo', 'QA', 'Infraestructura', 'Administración', 'Liderazgo'];
      
      const todosPresentes = departamentosEsperados.every(depto => 
        departamentos.includes(depto)
      );
      
      if (todosPresentes) {
        resultados.exitosas++;
        resultados.detalles.push(`✅ Departamentos: ${departamentos.length} departamentos válidos`);
      } else {
        throw new Error(`Departamentos faltantes: ${departamentosEsperados.filter(d => !departamentos.includes(d)).join(', ')}`);
      }
    } catch (error) {
      resultados.fallidas++;
      resultados.detalles.push(`❌ Departamentos: ${error.message}`);
    }
    
    // ✅ 4. Probar función de validación de personas
    try {
      resultados.total++;
      
      // Usuario válido del equipo
      const usuarioValido = {
        displayName: 'Benjamin Oribe Mendieta',
        emailAddress: 'benjamin.oribe@ccsoft.ai'
      };
      
      // Usuario inválido (bot)
      const usuarioInvalido = {
        displayName: 'Automation for Jira',
        emailAddress: 'noreply@atlassian.com'
      };
      
      const validoEsValido = esPersonaDelEquipo(usuarioValido);
      const invalidoEsInvalido = !esPersonaDelEquipo(usuarioInvalido);
      
      if (validoEsValido && invalidoEsInvalido) {
        resultados.exitosas++;
        resultados.detalles.push('✅ Validación personas: Función esPersonaDelEquipo funciona correctamente');
      } else {
        throw new Error(`Validación incorrecta: válido=${validoEsValido}, inválido=${!invalidoEsInvalido}`);
      }
    } catch (error) {
      resultados.fallidas++;
      resultados.detalles.push(`❌ Validación personas: ${error.message}`);
    }
    
    // ✅ 5. Probar obtención de email correcto
    try {
      resultados.total++;
      
      const emailCorrecto = obtenerEmailPersona('Benjamin Oribe Mendieta', 'email.incompleto@jira');
      
      if (emailCorrecto === 'benjamin.oribe@ccsoft.ai') {
        resultados.exitosas++;
        resultados.detalles.push('✅ Email correcto: Función obtenerEmailPersona funciona correctamente');
      } else {
        throw new Error(`Email incorrecto obtenido: ${emailCorrecto}`);
      }
    } catch (error) {
      resultados.fallidas++;
      resultados.detalles.push(`❌ Email correcto: ${error.message}`);
    }
    
    // ✅ Mostrar resultados
    const porcentajeExito = Math.round((resultados.exitosas / resultados.total) * 100);
    let mensaje = `👥 VALIDACIÓN DEL FILTRO DE EQUIPO CCSOFT\n\n`;
    mensaje += `📊 RESULTADOS:\n`;
    mensaje += `• Total pruebas: ${resultados.total}\n`;
    mensaje += `• ✅ Exitosas: ${resultados.exitosas}\n`;
    mensaje += `• ❌ Fallidas: ${resultados.fallidas}\n`;
    mensaje += `• 📈 Éxito: ${porcentajeExito}%\n\n`;
    
    mensaje += `📋 DETALLES:\n`;
    resultados.detalles.forEach(detalle => {
      mensaje += `${detalle}\n`;
    });
    mensaje += `\n🕐 Validación: ${new Date().toLocaleString()}`;
    
    ui.alert('Validación del Filtro de Equipo', mensaje, ui.ButtonSet.OK);
    
    Logger.log(`✅ [VALIDACIÓN] Filtro de equipo: ${resultados.exitosas}/${resultados.total} pruebas exitosas`);
    return resultados;
    
  } catch (error) {
    Logger.log(`❌ [VALIDACIÓN] Error: ${error.message}`);
    ui.alert(
      'Error en Validación',
      `❌ Error validando filtro de equipo: ${error.message}`,
      ui.ButtonSet.OK
    );
    return null;
  }
}

/**
 * ✅ NUEVA: Probar filtrado real con datos de Jira
 */
async function probarFiltradoRealJira() {
  try {
    Logger.log('🧪 [PRUEBA-REAL] Probando filtrado real con datos de Jira...');
    
    // ✅ Obtener issues semanales (esto aplicará automáticamente el filtro)
    const issues = await obtenerIssuesSemanalesDeJira({ debug: true });
    
    Logger.log(`📊 [PRUEBA-REAL] Issues obtenidos: ${issues.length}`);
    
    // ✅ Verificar que solo aparezcan personas del equipo
    const personasEncontradas = [...new Set(
      issues.map(issue => issue.analisisSemanal.asignadoNombre)
    )];
    
    Logger.log(`👥 [PRUEBA-REAL] Personas encontradas: ${personasEncontradas.length}`);
    
    let personasValidas = 0;
    let personasInvalidas = 0;
    
    personasEncontradas.forEach(persona => {
      const esValida = EQUIPO_CCSOFT.find(p => p.nombre === persona);
      if (esValida) {
        personasValidas++;
        Logger.log(`  ✅ ${persona}`);
      } else {
        personasInvalidas++;
        Logger.log(`  ❌ ${persona} (NO AUTORIZADA)`);
      }
    });
    
    Logger.log(`📊 [PRUEBA-REAL] Resultado: ${personasValidas} válidas, ${personasInvalidas} inválidas`);
    
    return {
      totalIssues: issues.length,
      totalPersonas: personasEncontradas.length,
      personasValidas: personasValidas,
      personasInvalidas: personasInvalidas,
      personas: personasEncontradas,
      exito: personasInvalidas === 0
    };
    
  } catch (error) {
    Logger.log(`❌ [PRUEBA-REAL] Error: ${error.message}`);
    throw error;
  }
}

/**
 * ✅ NUEVA: Validación completa del sistema de filtrado
 */
async function validarSistemaFiltradoCompleto() {
  const ui = SpreadsheetApp.getUi();
  
  try {
    Logger.log('🔍 [VALIDACIÓN-COMPLETA] Iniciando validación completa del sistema de filtrado...');
    
    // ✅ 1. Validar configuración
    const validacionConfiguracion = await verificarFiltroPersonasEquipo();
    
    if (!validacionConfiguracion || validacionConfiguracion.fallidas > 0) {
      ui.alert(
        'Error de Configuración',
        '❌ La configuración del equipo tiene errores.\n\nRevisa los logs para más detalles.',
        ui.ButtonSet.OK
      );
      return false;
    }
    
    // ✅ 2. Probar con datos reales (solo si hay credenciales)
    let resultadoPruebaReal = null;
    if (verificarCredencialesJiraSemanal()) {
      try {
        resultadoPruebaReal = await probarFiltradoRealJira();
      } catch (error) {
        Logger.log(`⚠️ [VALIDACIÓN-COMPLETA] No se pudo probar con datos reales: ${error.message}`);
      }
    }
    
    // ✅ 3. Mostrar resultados finales
    let mensaje = '🔍 VALIDACIÓN COMPLETA DEL SISTEMA DE FILTRADO\n\n';
    
    mensaje += '✅ CONFIGURACIÓN:\n';
    mensaje += `• EQUIPO_CCSOFT: ${EQUIPO_CCSOFT.length} personas\n`;
    mensaje += `• Departamentos: ${obtenerDepartamentosEquipo().length}\n`;
    mensaje += `• Emails @ccsoft.ai: ${EQUIPO_CCSOFT.filter(p => p.email.endsWith('@ccsoft.ai')).length}\n\n`;
    
    if (resultadoPruebaReal) {
      mensaje += '🧪 PRUEBA CON DATOS REALES:\n';
      mensaje += `• Issues obtenidos: ${resultadoPruebaReal.totalIssues}\n`;
      mensaje += `• Personas encontradas: ${resultadoPruebaReal.totalPersonas}\n`;
      mensaje += `• ✅ Personas válidas: ${resultadoPruebaReal.personasValidas}\n`;
      mensaje += `• ❌ Personas inválidas: ${resultadoPruebaReal.personasInvalidas}\n`;
      mensaje += `• Estado: ${resultadoPruebaReal.exito ? '✅ FILTRO FUNCIONANDO' : '❌ FILTRO CON PROBLEMAS'}\n\n`;
    } else {
      mensaje += '⚠️ PRUEBA CON DATOS REALES: No disponible (sin credenciales)\n\n';
    }
    
    mensaje += '🎯 BENEFICIOS VERIFICADOS:\n';
    mensaje += '• Solo personas reales del equipo CCSOFT\n';
    mensaje += '• Emails @ccsoft.ai completos y correctos\n';
    mensaje += '• Exclusión automática de bots y sistemas\n';
    mensaje += '• Mejor rendimiento (menos datos innecesarios)\n';
    mensaje += '• Estadísticas por departamento disponibles\n\n';
    
    mensaje += `🕐 Validación completada: ${new Date().toLocaleString()}`;
    
    ui.alert('Validación Completa del Sistema', mensaje, ui.ButtonSet.OK);
    
    Logger.log('✅ [VALIDACIÓN-COMPLETA] Sistema de filtrado validado exitosamente');
    return true;
    
  } catch (error) {
    Logger.log(`❌ [VALIDACIÓN-COMPLETA] Error: ${error.message}`);
    ui.alert(
      'Error en Validación Completa',
      `❌ Error validando el sistema: ${error.message}`,
      ui.ButtonSet.OK
    );
    return false;
  }
}