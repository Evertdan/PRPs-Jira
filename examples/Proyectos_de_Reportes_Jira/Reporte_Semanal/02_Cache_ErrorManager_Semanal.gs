// =====================================
// ARCHIVO 2: SISTEMA DE CACHÉ Y MANEJO DE ERRORES PARA REPORTES SEMANALES
// =====================================

/**
 * ✅ Clase para manejo del sistema de caché específico para reportes semanales
 */
class CacheManagerSemanal {
  /**
   * Genera una clave de caché específica para reportes semanales.
   * @param {string} prefix - Prefijo de la clave.
   * @param {string} key - Clave específica.
   * @returns {string} La clave completa.
   */
  static generarClave(prefix, key) {
    return `${prefix}${key}`;
  }
  
  /**
   * Almacena datos en el caché con TTL específico para reportes semanales.
   * @param {string} clave - La clave del caché.
   * @param {*} datos - Los datos a almacenar.
   * @param {number} ttlMinutos - Tiempo de vida en minutos.
   */
  static almacenar(clave, datos, ttlMinutos) {
    try {
      const expiraEn = new Date().getTime() + (ttlMinutos * 60 * 1000);
      const entrada = {
        datos: datos,
        timestamp: new Date().getTime(),
        expiraEn: expiraEn,
        tipo: 'reporte_semanal'
      };
      
      const propiedades = PropertiesService.getScriptProperties();
      propiedades.setProperty(clave, JSON.stringify(entrada));
      
      Logger.log(`💾 [SEMANAL] Datos almacenados en caché: ${clave} (expira en ${ttlMinutos}m)`);
      
      // Limpia entradas expiradas ocasionalmente
      if (Math.random() < 0.15) { // 15% de probabilidad para reportes semanales
        this.limpiarExpirados();
      }
      
    } catch (error) {
      Logger.log(`⚠️ Error almacenando en caché semanal: ${error.message}`);
    }
  }
  
  /**
   * Recupera datos del caché si no han expirado.
   * @param {string} clave - La clave del caché.
   * @returns {*} Los datos si están válidos, null si no existen o expiraron.
   */
  static recuperar(clave) {
    try {
      const propiedades = PropertiesService.getScriptProperties();
      const entradaString = propiedades.getProperty(clave);
      
      if (!entradaString) {
        return null;
      }
      
      const entrada = JSON.parse(entradaString);
      const ahora = new Date().getTime();
      
      if (ahora > entrada.expiraEn) {
        // La entrada ha expirado, la eliminamos
        propiedades.deleteProperty(clave);
        Logger.log(`⏰ [SEMANAL] Entrada de caché expirada y eliminada: ${clave}`);
        return null;
      }
      
      const edadMinutos = Math.round((ahora - entrada.timestamp) / (1000 * 60));
      Logger.log(`🔄 [SEMANAL] Datos recuperados del caché: ${clave} (edad: ${edadMinutos}m)`);
      
      return entrada.datos;
      
    } catch (error) {
      Logger.log(`⚠️ Error recuperando del caché semanal: ${error.message}`);
      return null;
    }
  }
  
  /**
   * Limpia todas las entradas expiradas del caché de reportes semanales.
   */
  static limpiarExpirados() {
    try {
      const propiedades = PropertiesService.getScriptProperties();
      const todasLasPropiedades = propiedades.getProperties();
      const ahora = new Date().getTime();
      let eliminadas = 0;
      
      Object.keys(todasLasPropiedades).forEach(clave => {
        if (clave.startsWith('CACHE_SEMANAL_')) {
          try {
            const entrada = JSON.parse(todasLasPropiedades[clave]);
            if (entrada.expiraEn && ahora > entrada.expiraEn) {
              propiedades.deleteProperty(clave);
              eliminadas++;
            }
          } catch (e) {
            // Si no se puede parsear, probablemente está corrupta, la eliminamos
            propiedades.deleteProperty(clave);
            eliminadas++;
          }
        }
      });
      
      if (eliminadas > 0) {
        Logger.log(`🧹 [SEMANAL] Limpieza de caché completada: ${eliminadas} entradas eliminadas`);
      }
      
    } catch (error) {
      Logger.log(`⚠️ Error limpiando caché semanal: ${error.message}`);
    }
  }
  
  /**
   * Limpia todo el caché de reportes semanales.
   */
  static limpiarTodo() {
    try {
      const propiedades = PropertiesService.getScriptProperties();
      const todasLasPropiedades = propiedades.getProperties();
      let eliminadas = 0;
      
      Object.keys(todasLasPropiedades).forEach(clave => {
        if (clave.startsWith('CACHE_SEMANAL_')) {
          propiedades.deleteProperty(clave);
          eliminadas++;
        }
      });
      
      Logger.log(`🧹 [SEMANAL] Caché completamente limpiado: ${eliminadas} entradas eliminadas`);
      
    } catch (error) {
      Logger.log(`⚠️ Error limpiando todo el caché semanal: ${error.message}`);
    }
  }
  
  /**
   * Obtiene estadísticas específicas del caché de reportes semanales.
   * @returns {Object} Estadísticas del caché.
   */
  static obtenerEstadisticas() {
    try {
      const propiedades = PropertiesService.getScriptProperties();
      const todasLasPropiedades = propiedades.getProperties();
      const ahora = new Date().getTime();
      
      const stats = {
        totalEntradas: 0,
        entradasValidas: 0,
        entradasExpiradas: 0,
        porTipo: {},
        tamañoAproximado: 0,
        tipoSistema: 'Reportes Semanales'
      };
      
      Object.keys(todasLasPropiedades).forEach(clave => {
        if (clave.startsWith('CACHE_SEMANAL_')) {
          stats.totalEntradas++;
          stats.tamañoAproximado += todasLasPropiedades[clave].length;
          
          try {
            const entrada = JSON.parse(todasLasPropiedades[clave]);
            const tipo = clave.split('_')[2] || 'DESCONOCIDO';
            
            if (!stats.porTipo[tipo]) {
              stats.porTipo[tipo] = { validas: 0, expiradas: 0 };
            }
            
            if (entrada.expiraEn && ahora > entrada.expiraEn) {
              stats.entradasExpiradas++;
              stats.porTipo[tipo].expiradas++;
            } else {
              stats.entradasValidas++;
              stats.porTipo[tipo].validas++;
            }
          } catch (e) {
            stats.entradasExpiradas++;
          }
        }
      });
      
      return stats;
      
    } catch (error) {
      Logger.log(`⚠️ Error obteniendo estadísticas de caché semanal: ${error.message}`);
      return null;
    }
  }
}

/**
 * ✅ Clase para manejo centralizado de errores en reportes semanales
 */
class ErrorManagerSemanal {
  /**
   * ✅ VALIDADO: Maneja errores de API de Jira con reintentos automáticos específicos para reportes semanales.
   * @param {Function} operacion - La función a ejecutar.
   * @param {string} descripcion - Descripción de la operación.
   * @param {number} maxReintentos - Número máximo de reintentos.
   * @returns {Promise<*>} El resultado de la operación.
   */
  static async ejecutarConReintentos(operacion, descripcion, maxReintentos = 2) {
    let ultimoError;
    
    for (let intento = 1; intento <= maxReintentos; intento++) {
      try {
        Logger.log(` [SEMANAL] ${descripcion} - Intento ${intento}/${maxReintentos}`);
        
        // ✅ VALIDACIÓN: Verificar que operación sea una función
        if (typeof operacion !== 'function') {
          throw new Error('La operación debe ser una función');
        }
        
        const resultado = await operacion();
        
        // ✅ VALIDACIÓN MEJORADA: Verificar que el resultado sea válido
        if (resultado === undefined || resultado === null) {
          throw new Error('La operación retornó un resultado nulo o indefinido');
        }
        
        // ✅ VALIDACIÓN ESPECÍFICA: Para arrays (issues), verificar que sea array válido
        if (descripcion.includes('issues') || descripcion.includes('Issues')) {
          if (!Array.isArray(resultado)) {
            throw new Error(`Se esperaba un array para operación de issues, pero se recibió: ${typeof resultado}`);
          }
          Logger.log(` [SEMANAL] Operación de issues exitosa: ${resultado.length} elementos`);
        }
        
        if (intento > 1) {
          Logger.log(`✅ [SEMANAL] ${descripcion} exitosa tras ${intento} intentos`);
        }
        
        return resultado;
        
      } catch (error) {
        ultimoError = error;
        const esperaMs = Math.pow(2, intento) * 1500; // Backoff exponencial más largo para reportes semanales
        
        Logger.log(`❌ [SEMANAL] ${descripcion} falló en intento ${intento}: ${error.message}`);
        
        if (intento < maxReintentos) {
          Logger.log(`⏳ Esperando ${esperaMs}ms antes del siguiente intento...`);
          Utilities.sleep(esperaMs);
        }
      }
    }
    
    // Si llegamos aquí, todos los intentos fallaron
    const errorId = this.registrarError(
      `Operación '${descripcion}' falló tras ${maxReintentos} intentos`,
      ultimoError,
      'API_JIRA_SEMANAL',
      'HIGH'
    );
    
    throw new Error(`❌ [SEMANAL] ${descripcion} falló definitivamente. Error ID: ${errorId}. Último error: ${ultimoError.message}`);
  }

  /**
   * ✅ VALIDADO: Registra un error específico de reportes semanales con contexto y severidad.
   */
  static registrarError(mensaje, error, contexto = 'Reportes_Semanales', severidad = 'MEDIUM') {
    const timestamp = new Date().toISOString();
    const errorId = Utilities.getUuid().substring(0, 8);
    
    const errorInfo = {
      id: errorId,
      timestamp: timestamp,
      mensaje: mensaje,
      error: error ? error.toString() : 'No disponible',
      stack: error ? error.stack : 'No disponible',
      contexto: contexto,
      severidad: severidad,
      sistema: 'Reportes_Semanales'
    };
    
    // Log detallado para debugging
    Logger.log(` [SEMANAL] [${severidad}] Error ${errorId} en ${contexto}:`);
    Logger.log(` Mensaje: ${mensaje}`);
    Logger.log(` Error: ${errorInfo.error}`);
    
    // Almacena en PropertiesService para errores críticos
    if (severidad === 'CRITICAL') {
      try {
        const propiedades = PropertiesService.getScriptProperties();
        const erroresCriticos = JSON.parse(propiedades.getProperty('ERRORES_CRITICOS_SEMANAL') || '[]');
        erroresCriticos.push(errorInfo);
        
        // Mantiene solo los últimos 5 errores críticos para reportes semanales
        if (erroresCriticos.length > 5) {
          erroresCriticos.shift();
        }
        
        propiedades.setProperty('ERRORES_CRITICOS_SEMANAL', JSON.stringify(erroresCriticos));
      } catch (e) {
        Logger.log(`⚠️ No se pudo almacenar error crítico semanal: ${e.message}`);
      }
    }
    
    return errorId;
  }

  /**
   * ✅ VALIDADO: Obtiene los errores críticos específicos de reportes semanales.
   */
  static obtenerErroresCriticos() {
    try {
      const propiedades = PropertiesService.getScriptProperties();
      return JSON.parse(propiedades.getProperty('ERRORES_CRITICOS_SEMANAL') || '[]');
    } catch (error) {
      Logger.log(`⚠️ Error obteniendo errores críticos semanales: ${error.message}`);
      return [];
    }
  }

  /**
   * ✅ VALIDADO: Limpia los errores críticos de reportes semanales.
   */
  static limpiarErroresCriticos() {
    try {
      const propiedades = PropertiesService.getScriptProperties();
      propiedades.deleteProperty('ERRORES_CRITICOS_SEMANAL');
      Logger.log(' [SEMANAL] Errores críticos limpiados exitosamente');
    } catch (error) {
      Logger.log(`⚠️ Error limpiando errores críticos semanales: ${error.message}`);
    }
  }
}

/**
 * ✅ Validador específico para consultas JQL de reportes semanales
 */
class ValidadorJQLSemanal {
  /**
   * Valida que una consulta JQL sea segura para reportes semanales.
   * @param {string} jql - La consulta JQL a validar.
   * @returns {Object} Resultado de la validación con isValid y mensaje.
   */
  static validarJQL(jql) {
    if (!jql || typeof jql !== 'string') {
      return {
        isValid: false,
        mensaje: 'JQL debe ser una cadena de texto no vacía'
      };
    }
    
    // Usar patrones de validación específicos para reportes semanales
    for (const patron of CONFIG_VALIDACION_SEMANAL.PATRONES_PELIGROSOS) {
      if (patron.test(jql)) {
        return {
          isValid: false,
          mensaje: 'JQL contiene patrones potencialmente peligrosos'
        };
      }
    }
    
    // Validar longitud específica para reportes semanales
    if (jql.length > CONFIG_VALIDACION_SEMANAL.MAX_CARACTERES_JQL) {
      return {
        isValid: false,
        mensaje: `JQL excede la longitud máxima permitida (${CONFIG_VALIDACION_SEMANAL.MAX_CARACTERES_JQL} caracteres)`
      };
    }
    
    return {
      isValid: true,
      mensaje: 'JQL válida para reportes semanales'
    };
  }
  
  /**
   * Valida que las etiquetas semanales sean correctas.
   * @param {Array} etiquetas - Array de etiquetas a validar.
   * @returns {Object} Resultado de la validación.
   */
  static validarEtiquetasSemanales(etiquetas) {
    if (!etiquetas || !Array.isArray(etiquetas)) {
      return {
        isValid: true,
        mensaje: 'Sin etiquetas para validar'
      };
    }
    
    const etiquetasInvalidas = [];
    const etiquetasSemanales = etiquetas.filter(etiqueta => {
      const nombre = typeof etiqueta === 'string' ? etiqueta : etiqueta.name || '';
      if (nombre.startsWith('SEMANA_')) {
        if (!CONFIG_VALIDACION_SEMANAL.PATRON_ETIQUETA_VALIDA.test(nombre)) {
          etiquetasInvalidas.push(nombre);
          return false;
        }
        return true;
      }
      return false;
    });
    
    if (etiquetasInvalidas.length > 0) {
      return {
        isValid: false,
        mensaje: `Etiquetas semanales inválidas encontradas: ${etiquetasInvalidas.join(', ')}`
      };
    }
    
    return {
      isValid: true,
      mensaje: `${etiquetasSemanales.length} etiquetas semanales válidas encontradas`
    };
  }
}

/**
 * ✅ Función de utilidad para mostrar estadísticas de caché semanal
 */
function mostrarEstadisticasCacheSemanal() {
  const stats = CacheManagerSemanal.obtenerEstadisticas();
  if (!stats) {
    Logger.log('❌ No se pudieron obtener las estadísticas de caché semanal');
    return;
  }
  
  Logger.log('📊 === ESTADÍSTICAS DE CACHÉ SEMANAL ===');
  Logger.log(`📦 Total de entradas: ${stats.totalEntradas}`);
  Logger.log(`✅ Entradas válidas: ${stats.entradasValidas}`);
  Logger.log(`⏰ Entradas expiradas: ${stats.entradasExpiradas}`);
  Logger.log(`💾 Tamaño aproximado: ${Math.round(stats.tamañoAproximado / 1024)} KB`);
  Logger.log(`🏷️ Sistema: ${stats.tipoSistema}`);
  
  if (Object.keys(stats.porTipo).length > 0) {
    Logger.log('📋 Por tipo:');
    Object.keys(stats.porTipo).forEach(tipo => {
      const tipoStats = stats.porTipo[tipo];
      Logger.log(`  ${tipo}: ${tipoStats.validas} válidas, ${tipoStats.expiradas} expiradas`);
    });
  }
}