/**
 * Funciones de prueba rápida para verificar configuración
 * Estas funciones ayudan a diagnosticar problemas de configuración
 */

/**
 * Prueba rápida de credenciales sin interfaz compleja
 */
function pruebaRapidaCredenciales() {
  try {
    Logger.log("🧪 Iniciando prueba rápida de credenciales...");
    
    // Cargar credenciales
    if (typeof CredManager !== 'undefined') {
      CredManager.cargarCredenciales();
    }
    
    Logger.log(`📧 Email: ${CONFIG_JIRA.email || 'VACÍO'}`);
    Logger.log(`🔑 Token: ${CONFIG_JIRA.apiToken ? 'PRESENTE (' + CONFIG_JIRA.apiToken.length + ' chars)' : 'VACÍO'}`);
    Logger.log(`🏢 Dominio: ${CONFIG_JIRA.dominio}`);
    Logger.log(`📂 Proyecto: ${CONFIG_JIRA.projectKey}`);
    
    if (!CONFIG_JIRA.email || !CONFIG_JIRA.apiToken) {
      Logger.log("❌ Credenciales incompletas - no se puede probar conexión");
      return false;
    }
    
    // Probar conexión básica
    const testUrl = `https://${CONFIG_JIRA.dominio}/rest/api/3/myself`;
    const auth = "Basic " + Utilities.base64Encode(CONFIG_JIRA.email + ":" + CONFIG_JIRA.apiToken);
    
    Logger.log(`🔗 Probando URL: ${testUrl}`);
    
    const response = UrlFetchApp.fetch(testUrl, {
      method: "GET",
      headers: {
        "Authorization": auth,
        "Accept": "application/json"
      },
      muteHttpExceptions: true
    });
    
    const statusCode = response.getResponseCode();
    const responseText = response.getContentText();
    
    Logger.log(`📡 Código de respuesta: ${statusCode}`);
    Logger.log(`📄 Respuesta: ${responseText.substring(0, 200)}...`);
    
    if (statusCode === 200) {
      const userData = JSON.parse(responseText);
      Logger.log(`✅ Autenticación exitosa para: ${userData.displayName} (${userData.emailAddress})`);
      return true;
    } else {
      Logger.log(`❌ Error de autenticación: ${statusCode}`);
      return false;
    }
    
  } catch (error) {
    Logger.log(`❌ Error en prueba: ${error.message}`);
    return false;
  }
}

/**
 * Muestra el estado actual de las credenciales en los logs
 */
function mostrarEstadoCredenciales() {
  Logger.log("=== ESTADO DE CREDENCIALES ===");
  
  // Estado en CONFIG_JIRA
  Logger.log("📁 CONFIG_JIRA:");
  Logger.log(`  📧 Email: ${CONFIG_JIRA.email || '❌ VACÍO'}`);
  Logger.log(`  🔑 Token: ${CONFIG_JIRA.apiToken ? '✅ PRESENTE' : '❌ VACÍO'}`);
  Logger.log(`  🏢 Dominio: ${CONFIG_JIRA.dominio}`);
  Logger.log(`  📂 Proyecto: ${CONFIG_JIRA.projectKey || '❌ VACÍO'}`);
  
  // Estado en almacén de credenciales
  if (typeof CredManager !== 'undefined') {
    Logger.log("💾 ALMACÉN DE CREDENCIALES:");
    Logger.log(`  📧 Email: ${CredManager.getEmail() || '❌ VACÍO'}`);
    Logger.log(`  🔑 Token: ${CredManager.getApiToken() ? '✅ PRESENTE' : '❌ VACÍO'}`);
    Logger.log(`  📂 Proyecto: ${CredManager.getProjectKey() || '❌ VACÍO'}`);
    Logger.log(`  ✔️ Configuradas: ${CredManager.credencialesConfiguradas()}`);
  } else {
    Logger.log("💾 ALMACÉN DE CREDENCIALES: ❌ NO DISPONIBLE");
  }
}

/**
 * Fuerza la carga de credenciales desde el almacén
 */
function forzarCargaCredenciales() {
  try {
    Logger.log("🔄 Forzando carga de credenciales...");
    
    if (typeof CredManager === 'undefined') {
      Logger.log("❌ CredManager no disponible");
      return false;
    }
    
    // Cargar credenciales
    CredManager.cargarCredenciales();
    
    Logger.log("✅ Credenciales cargadas:");
    Logger.log(`  📧 Email: ${CONFIG_JIRA.email}`);
    Logger.log(`  🔑 Token: ${CONFIG_JIRA.apiToken ? 'PRESENTE' : 'VACÍO'}`);
    Logger.log(`  📂 Proyecto: ${CONFIG_JIRA.projectKey}`);
    
    return true;
    
  } catch (error) {
    Logger.log(`❌ Error cargando credenciales: ${error.message}`);
    return false;
  }
}

/**
 * Configuración rápida de credenciales vía script (para debugging)
 * SOLO PARA PRUEBAS - NO USAR EN PRODUCCIÓN
 */
function configuracionRapidaDebug(email, apiToken) {
  Logger.log("🚨 CONFIGURACIÓN RÁPIDA DE DEBUG");
  Logger.log(`📧 Email: ${email}`);
  Logger.log(`🔑 Token: ${apiToken ? apiToken.substring(0, 10) + '...' : 'VACÍO'}`);
  
  if (!email || !apiToken) {
    Logger.log("❌ Parámetros incompletos");
    return false;
  }
  
  try {
    // Guardar en almacén
    if (typeof CredManager !== 'undefined') {
      CredManager.setEmail(email);
      CredManager.setApiToken(apiToken);
      CredManager.setProjectKey('FENIX');
    }
    
    // Actualizar config global
    CONFIG_JIRA.email = email;
    CONFIG_JIRA.apiToken = apiToken;
    CONFIG_JIRA.projectKey = 'FENIX';
    
    Logger.log("✅ Credenciales configuradas");
    
    // Probar inmediatamente
    return pruebaRapidaCredenciales();
    
  } catch (error) {
    Logger.log(`❌ Error configurando: ${error.message}`);
    return false;
  }
}