/**
 * Módulo para manejo de errores y logging mejorado
 * Proporciona funciones centralizadas para gestión de errores y logs
 */

class ErrorHandler {
  
  constructor() {
    this.ui = SpreadsheetApp.getUi();
  }

  /**
   * Registra un mensaje informativo
   * @param {string} mensaje - Mensaje a registrar
   * @param {Object} contexto - Contexto adicional opcional
   */
  logInfo(mensaje, contexto = null) {
    const timestamp = new Date().toISOString();
    const logMessage = `[INFO ${timestamp}] ${mensaje}`;
    
    if (contexto) {
      Logger.log(`${logMessage} | Contexto: ${JSON.stringify(contexto)}`);
    } else {
      Logger.log(logMessage);
    }
  }

  /**
   * Registra un mensaje de advertencia
   * @param {string} mensaje - Mensaje a registrar
   * @param {Object} contexto - Contexto adicional opcional
   */
  logWarning(mensaje, contexto = null) {
    const timestamp = new Date().toISOString();
    const logMessage = `[WARNING ${timestamp}] ⚠️ ${mensaje}`;
    
    if (contexto) {
      Logger.log(`${logMessage} | Contexto: ${JSON.stringify(contexto)}`);
    } else {
      Logger.log(logMessage);
    }
  }

  /**
   * Registra y maneja un error
   * @param {string} mensaje - Mensaje de error
   * @param {Error} error - Objeto de error
   * @param {Object} contexto - Contexto adicional opcional
   * @returns {Error} Error procesado para rethrow
   */
  logError(mensaje, error, contexto = null) {
    const timestamp = new Date().toISOString();
    const errorDetails = {
      message: error?.message || 'Error desconocido',
      stack: error?.stack || 'Stack no disponible',
      name: error?.name || 'Error'
    };
    
    let logMessage = `[ERROR ${timestamp}] ❌ ${mensaje}`;
    logMessage += ` | Error: ${errorDetails.message}`;
    
    if (contexto) {
      logMessage += ` | Contexto: ${JSON.stringify(contexto)}`;
    }
    
    Logger.log(logMessage);
    Logger.log(`Stack trace: ${errorDetails.stack}`);
    
    return new Error(`${mensaje}: ${errorDetails.message}`);
  }

  /**
   * Maneja errores de API de Jira específicamente
   * @param {Error} error - Error original
   * @param {string} operacion - Operación que falló
   * @param {Object} parametros - Parámetros de la operación
   * @returns {Error} Error procesado
   */
  handleJiraAPIError(error, operacion, parametros = {}) {
    const contexto = {
      operacion,
      parametros,
      timestamp: new Date().toISOString()
    };

    // Determinar tipo de error
    let mensajeUsuario = "Error en comunicación con Jira";
    
    if (error.message.includes("401")) {
      mensajeUsuario = "Error de autenticación. Verifica las credenciales de Jira";
    } else if (error.message.includes("403")) {
      mensajeUsuario = "Sin permisos para acceder a este recurso en Jira";
    } else if (error.message.includes("404")) {
      mensajeUsuario = "Recurso no encontrado en Jira";
    } else if (error.message.includes("timeout")) {
      mensajeUsuario = "Tiempo de espera agotado conectando con Jira";
    } else if (error.message.includes("network")) {
      mensajeUsuario = "Error de conexión de red";
    }

    return this.logError(`Error en operación Jira: ${operacion}`, error, contexto);
  }

  /**
   * Maneja errores de Google Sheets
   * @param {Error} error - Error original
   * @param {string} operacion - Operación que falló
   * @param {Object} parametros - Parámetros de la operación
   * @returns {Error} Error procesado
   */
  handleSheetsError(error, operacion, parametros = {}) {
    const contexto = {
      operacion,
      parametros,
      timestamp: new Date().toISOString()
    };

    let mensajeUsuario = "Error manipulando la hoja de cálculo";
    
    if (error.message.includes("Range")) {
      mensajeUsuario = "Error en el rango de celdas especificado";
    } else if (error.message.includes("Permission")) {
      mensajeUsuario = "Sin permisos para modificar la hoja de cálculo";
    }

    return this.logError(`Error en Google Sheets: ${operacion}`, error, contexto);
  }

  /**
   * Muestra un error al usuario de manera amigable
   * @param {string} titulo - Título del error
   * @param {Error} error - Error a mostrar
   * @param {boolean} mostrarDetalles - Si mostrar detalles técnicos
   */
  showUserError(titulo, error, mostrarDetalles = false) {
    let mensaje = error.message;
    
    if (mostrarDetalles && error.stack) {
      mensaje += `\n\nDetalles técnicos:\n${error.stack}`;
    }

    this.ui.alert(titulo, mensaje, this.ui.ButtonSet.OK);
  }

  /**
   * Ejecuta una función con manejo de errores automático
   * @param {Function} func - Función a ejecutar
   * @param {string} operacion - Nombre de la operación
   * @param {Object} contexto - Contexto adicional
   * @returns {*} Resultado de la función o null si hay error
   */
  executeWithErrorHandling(func, operacion, contexto = {}) {
    try {
      this.logInfo(`Iniciando operación: ${operacion}`, contexto);
      const resultado = func();
      this.logInfo(`Operación completada exitosamente: ${operacion}`);
      return resultado;
    } catch (error) {
      const processedError = this.logError(`Error en operación: ${operacion}`, error, contexto);
      this.showUserError(`Error en ${operacion}`, processedError);
      return null;
    }
  }

  /**
   * Ejecuta una función async con manejo de errores automático
   * @param {Function} func - Función async a ejecutar
   * @param {string} operacion - Nombre de la operación
   * @param {Object} contexto - Contexto adicional
   * @returns {Promise<*>} Resultado de la función o null si hay error
   */
  async executeAsyncWithErrorHandling(func, operacion, contexto = {}) {
    try {
      this.logInfo(`Iniciando operación async: ${operacion}`, contexto);
      const resultado = await func();
      this.logInfo(`Operación async completada exitosamente: ${operacion}`);
      return resultado;
    } catch (error) {
      const processedError = this.logError(`Error en operación async: ${operacion}`, error, contexto);
      this.showUserError(`Error en ${operacion}`, processedError);
      return null;
    }
  }

  /**
   * Valida parámetros requeridos
   * @param {Object} parametros - Objeto con parámetros
   * @param {Array} requeridos - Array con nombres de parámetros requeridos
   * @throws {Error} Si falta algún parámetro requerido
   */
  validateRequiredParams(parametros, requeridos) {
    const faltantes = requeridos.filter(param => 
      parametros[param] === undefined || 
      parametros[param] === null || 
      parametros[param] === ''
    );

    if (faltantes.length > 0) {
      const error = new Error(`Parámetros requeridos faltantes: ${faltantes.join(', ')}`);
      throw this.logError('Validación de parámetros falló', error, { parametros, requeridos });
    }
  }

  /**
   * Crea un retry wrapper para operaciones que pueden fallar temporalmente
   * @param {Function} func - Función a ejecutar
   * @param {number} maxIntentos - Número máximo de intentos
   * @param {number} delayMs - Delay entre intentos en millisegundos
   * @returns {*} Resultado de la función
   */
  executeWithRetry(func, maxIntentos = 3, delayMs = 1000) {
    let ultimoError;
    
    for (let intento = 1; intento <= maxIntentos; intento++) {
      try {
        this.logInfo(`Intento ${intento}/${maxIntentos}`);
        return func();
      } catch (error) {
        ultimoError = error;
        this.logWarning(`Intento ${intento} falló: ${error.message}`);
        
        if (intento < maxIntentos) {
          Utilities.sleep(delayMs);
        }
      }
    }
    
    throw this.logError(`Operación falló después de ${maxIntentos} intentos`, ultimoError);
  }
}

// Instancia global del manejador de errores
const ErrorManager = new ErrorHandler();

// Funciones de conveniencia globales
function logInfo(mensaje, contexto) {
  ErrorManager.logInfo(mensaje, contexto);
}

function logWarning(mensaje, contexto) {
  ErrorManager.logWarning(mensaje, contexto);
}

function logError(mensaje, error, contexto) {
  return ErrorManager.logError(mensaje, error, contexto);
}