/**
 * Módulo para generación de reportes en Google Sheets
 * Contiene toda la lógica para crear y formatear reportes de compromisos
 */

class ReportGenerator {
  
  constructor() {
    this.spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  }

  /**
   * Genera el reporte de compromisos en una hoja de cálculo
   * @param {Array} tareas - Array de issues de Jira
   * @param {string} colaboradorNombre - Nombre del colaborador
   */
  generarReporteCompromisos(tareas, colaboradorNombre) {
    try {
      Logger.log(`📊 Generando reporte para: ${colaboradorNombre}`);
      
      const sheet = this._obtenerOCrearHoja(colaboradorNombre);
      this._limpiarHoja(sheet);
      
      if (!tareas || tareas.length === 0) {
        this._manejarSinTareas(sheet, colaboradorNombre);
        return;
      }

      // Procesar datos de las tareas
      const tareasProcesadas = this._procesarTareas(tareas);
      const resumenEstadisticas = this._calcularEstadisticas(tareasProcesadas);
      
      // Generar contenido del reporte
      this._generarTituloReporte(sheet, colaboradorNombre);
      this._generarResumenEstadisticas(sheet, resumenEstadisticas);
      this._generarTablaTareas(sheet, tareasProcesadas);
      
      // Aplicar formato
      this._aplicarFormato(sheet);
      
      Logger.log(`✅ Reporte generado exitosamente con ${tareas.length} tareas`);
      
    } catch (error) {
      Logger.log(`❌ Error generando reporte: ${error.message}`);
      throw new Error(`Error al generar reporte: ${error.message}`);
    }
  }

  /**
   * Obtiene una hoja existente o crea una nueva
   * @private
   * @param {string} nombreHoja - Nombre de la hoja
   * @returns {Sheet} Hoja de cálculo
   */
  _obtenerOCrearHoja(nombreHoja) {
    return this.spreadsheet.getSheetByName(nombreHoja) || 
           this.spreadsheet.insertSheet(nombreHoja);
  }

  /**
   * Limpia el contenido y formato de la hoja
   * @private
   * @param {Sheet} sheet - Hoja a limpiar
   */
  _limpiarHoja(sheet) {
    sheet.clear();
    sheet.clearFormats();
  }

  /**
   * Maneja el caso cuando no hay tareas
   * @private
   * @param {Sheet} sheet - Hoja de cálculo
   * @param {string} colaboradorNombre - Nombre del colaborador
   */
  _manejarSinTareas(sheet, colaboradorNombre) {
    Logger.log("ℹ️ No se encontraron tareas.");
    sheet.appendRow([`Reporte de Compromisos para: ${colaboradorNombre}`]);
    sheet.appendRow(["No se encontraron tareas para el período seleccionado."]);
  }

  /**
   * Procesa las tareas para asignar compromisos a subtareas
   * @private
   * @param {Array} tareas - Array de issues de Jira
   * @returns {Array} Tareas procesadas
   */
  _procesarTareas(tareas) {
    // Crear mapa de compromisos de tareas principales
    const compromisosDePadres = new Map();
    
    tareas.forEach(issue => {
      const tipo = issue.fields.issuetype?.name;
      const compromiso = issue.fields[CONFIG_JIRA.customFields.compromiso];
      
      if (tipo !== "Sub-tarea" && tipo !== "QA" && compromiso) {
        compromisosDePadres.set(issue.key, compromiso);
      }
    });

    // Asignar compromisos a subtareas y QA
    tareas.forEach(issue => {
      const tipo = issue.fields.issuetype?.name;
      const parentKey = issue.fields.parent?.key;

      if ((tipo === "Sub-tarea" || tipo === "QA") && parentKey && compromisosDePadres.has(parentKey)) {
        issue.fields[CONFIG_JIRA.customFields.compromiso] = compromisosDePadres.get(parentKey);
      }
    });

    return tareas;
  }

  /**
   * Calcula estadísticas del reporte
   * @private
   * @param {Array} tareas - Tareas procesadas
   * @returns {Object} Objeto con estadísticas calculadas
   */
  _calcularEstadisticas(tareas) {
    const estadisticas = {
      porProyecto: {},
      globales: {
        total: 0,
        cerradas: 0,
        validacion: 0,
        otras: 0,
        compromisos: { total: 0, cerrado: 0, validacion: 0, otros: 0 },
        emergentes: { total: 0, cerrado: 0, validacion: 0, otros: 0 },
        adicionales: { total: 0, cerrado: 0, validacion: 0, otros: 0 }
      }
    };

    tareas.forEach(issue => {
      const projectKey = issue.key.split('-')[0];
      const status = issue.fields.status?.name;
      const compromiso = this._extraerValorCompromiso(issue.fields[CONFIG_JIRA.customFields.compromiso]);

      // Inicializar proyecto si no existe
      if (!estadisticas.porProyecto[projectKey]) {
        estadisticas.porProyecto[projectKey] = {
          total: 0, cerradas: 0, validacion: 0, otras: 0,
          compromisos: { total: 0, cerrado: 0, validacion: 0, otros: 0 },
          emergentes: { total: 0, cerrado: 0, validacion: 0, otros: 0 },
          adicionales: { total: 0, cerrado: 0, validacion: 0, otros: 0 }
        };
      }

      // Determinar tipo de compromiso
      const tipoCompromiso = this._determinarTipoCompromiso(compromiso);
      
      // Actualizar contadores
      this._actualizarContadores(estadisticas, projectKey, status, tipoCompromiso);
    });

    return estadisticas;
  }

  /**
   * Extrae el valor del campo compromiso
   * @private
   * @param {Object|Array} compromiso - Campo compromiso de Jira
   * @returns {string} Valor del compromiso
   */
  _extraerValorCompromiso(compromiso) {
    if (!compromiso) return "";
    
    if (Array.isArray(compromiso)) {
      return compromiso.map(item => item.value).join(", ");
    }
    
    return compromiso.value || "";
  }

  /**
   * Determina el tipo de compromiso
   * @private
   * @param {string} compromiso - Valor del compromiso
   * @returns {string} Tipo de compromiso
   */
  _determinarTipoCompromiso(compromiso) {
    if (compromiso === VALORES_COMPROMISO.comprometido) return "compromisos";
    if (compromiso === VALORES_COMPROMISO.emergente) return "emergentes";
    if (compromiso === VALORES_COMPROMISO.adicional) return "adicionales";
    return "otros";
  }

  /**
   * Actualiza los contadores de estadísticas
   * @private
   * @param {Object} estadisticas - Objeto de estadísticas
   * @param {string} projectKey - Clave del proyecto
   * @param {string} status - Estado de la tarea
   * @param {string} tipoCompromiso - Tipo de compromiso
   */
  _actualizarContadores(estadisticas, projectKey, status, tipoCompromiso) {
    const proyecto = estadisticas.porProyecto[projectKey];
    const globales = estadisticas.globales;

    // Actualizar totales
    proyecto.total++;
    globales.total++;
    proyecto[tipoCompromiso].total++;
    globales[tipoCompromiso].total++;

    // Actualizar por estado
    if (status === FILTROS_JQL.estadoCerrado) {
      proyecto.cerradas++;
      globales.cerradas++;
      proyecto[tipoCompromiso].cerrado++;
      globales[tipoCompromiso].cerrado++;
    } else if (status === FILTROS_JQL.estadoValidacion) {
      proyecto.validacion++;
      globales.validacion++;
      proyecto[tipoCompromiso].validacion++;
      globales[tipoCompromiso].validacion++;
    } else {
      proyecto.otras++;
      globales.otras++;
      proyecto[tipoCompromiso].otros++;
      globales[tipoCompromiso].otros++;
    }
  }

  /**
   * Genera el título del reporte
   * @private
   * @param {Sheet} sheet - Hoja de cálculo
   * @param {string} colaboradorNombre - Nombre del colaborador
   */
  _generarTituloReporte(sheet, colaboradorNombre) {
    const fechaActual = new Date().toLocaleDateString('es-ES');
    const titulo = `Reporte de Compromisos para: ${colaboradorNombre} - ${fechaActual}`;
    
    sheet.appendRow([titulo]);
    const filaTitulo = sheet.getLastRow();
    
    sheet.getRange(filaTitulo, 1, 1, 10).mergeAcross();
    sheet.getRange(filaTitulo, 1)
      .setFontWeight("bold")
      .setFontSize(16)
      .setHorizontalAlignment("center")
      .setBackground("#4285f4")
      .setFontColor("white");
    
    sheet.appendRow([" "]); // Fila en blanco
  }

  /**
   * Genera el resumen de estadísticas
   * @private
   * @param {Sheet} sheet - Hoja de cálculo
   * @param {Object} estadisticas - Estadísticas calculadas
   */
  _generarResumenEstadisticas(sheet, estadisticas) {
    sheet.appendRow(["📈 RESUMEN GENERAL"]);
    sheet.getRange(sheet.getLastRow(), 1).setFontWeight("bold").setFontSize(14);
    
    const globales = estadisticas.globales;
    
    // Resumen por tipo de compromiso
    sheet.appendRow([
      "Tipo de Compromiso", "Total", "Cerradas", "En Validación", "Otras", 
      "% Completado", "% En Validación", "% Pendientes"
    ]);
    
    this._agregarFilaEstadistica(sheet, "🎯 Comprometidas", globales.compromisos);
    this._agregarFilaEstadistica(sheet, "🚨 Emergentes", globales.emergentes);
    this._agregarFilaEstadistica(sheet, "➕ Adicionales", globales.adicionales);
    this._agregarFilaEstadistica(sheet, "📊 TOTAL GENERAL", globales);
    
    sheet.appendRow([" "]); // Fila en blanco
  }

  /**
   * Agrega una fila de estadística al reporte
   * @private
   * @param {Sheet} sheet - Hoja de cálculo
   * @param {string} etiqueta - Etiqueta de la estadística
   * @param {Object} datos - Datos de la estadística
   */
  _agregarFilaEstadistica(sheet, etiqueta, datos) {
    const porcentajeCerrado = datos.total > 0 ? ((datos.cerrado / datos.total) * 100).toFixed(1) : "0.0";
    const porcentajeValidacion = datos.total > 0 ? ((datos.validacion / datos.total) * 100).toFixed(1) : "0.0";
    const porcentajePendiente = datos.total > 0 ? ((datos.otros / datos.total) * 100).toFixed(1) : "0.0";
    
    sheet.appendRow([
      etiqueta,
      datos.total,
      datos.cerrado || datos.cerradas,
      datos.validacion,
      datos.otros || datos.otras,
      `${porcentajeCerrado}%`,
      `${porcentajeValidacion}%`,
      `${porcentajePendiente}%`
    ]);
  }

  /**
   * Genera la tabla de tareas detallada
   * @private
   * @param {Sheet} sheet - Hoja de cálculo
   * @param {Array} tareas - Tareas procesadas
   */
  _generarTablaTareas(sheet, tareas) {
    sheet.appendRow(["📋 DETALLE DE TAREAS"]);
    sheet.getRange(sheet.getLastRow(), 1).setFontWeight("bold").setFontSize(14);
    
    // Encabezados de la tabla
    const headers = [
      "Proyecto", "Clave", "Resumen", "Tipo", "Compromiso", 
      "Principal", "Estado", "Fecha Vencimiento", "Fecha y Hora", "Tiempo Registrado"
    ];
    sheet.appendRow(headers);

    // Datos de las tareas
    tareas.forEach(issue => {
      const projectKey = issue.key.split('-')[0];
      
      // Solo obtener fecha/hora si el campo está configurado
      let fechaHora = "";
      if (CONFIG_JIRA.customFields.fechaHora && CONFIG_JIRA.customFields.fechaHora.trim() !== "") {
        fechaHora = issue.fields[CONFIG_JIRA.customFields.fechaHora] || "";
      }
      
      const compromiso = this._extraerValorCompromiso(issue.fields[CONFIG_JIRA.customFields.compromiso]);
      
      sheet.appendRow([
        projectKey,
        issue.key,
        issue.fields.summary,
        issue.fields.issuetype?.name || "",
        compromiso,
        issue.fields.parent?.key || "",
        issue.fields.status?.name,
        issue.fields.duedate || "",
        fechaHora,
        this._formatearTiempoRegistrado(issue.fields.timespent)
      ]);
    });
  }

  /**
   * Formatea el tiempo registrado en formato legible
   * @private
   * @param {number} timeSpent - Tiempo en segundos
   * @returns {string} Tiempo formateado
   */
  _formatearTiempoRegistrado(timeSpent) {
    if (!timeSpent) return "";
    
    const horas = Math.floor(timeSpent / 3600);
    const minutos = Math.floor((timeSpent % 3600) / 60);
    
    if (horas > 0) {
      return `${horas}h ${minutos}m`;
    }
    return `${minutos}m`;
  }

  /**
   * Aplica formato general al reporte
   * @private
   * @param {Sheet} sheet - Hoja de cálculo
   */
  _aplicarFormato(sheet) {
    const totalRows = sheet.getLastRow();
    const totalCols = sheet.getLastColumn();
    
    if (totalRows === 0 || totalCols === 0) return;
    
    const dataRange = sheet.getRange(1, 1, totalRows, totalCols);
    
    // Formato general
    dataRange.setFontFamily("Arial");
    dataRange.setVerticalAlignment("middle");
    dataRange.setWrapStrategy(SpreadsheetApp.WrapStrategy.WRAP);
    
    // Auto-redimensionar columnas
    sheet.autoResizeColumns(1, totalCols);
    
    // Ajustar ancho de columna de resumen
    if (totalCols >= 3) {
      sheet.setColumnWidth(3, UI_CONFIG.columnWidthResumen);
    }
    
    // Aplicar formato a encabezados
    this._aplicarFormatoEncabezados(sheet);
  }

  /**
   * Aplica formato específico a los encabezados
   * @private
   * @param {Sheet} sheet - Hoja de cálculo
   */
  _aplicarFormatoEncabezados(sheet) {
    try {
      // Encontrar y formatear encabezados de resumen
      const resumenHeaderRange = this._encontrarRangoEncabezado(sheet, "Tipo de Compromiso");
      if (resumenHeaderRange) {
        resumenHeaderRange.setFontWeight("bold")
          .setBackground(UI_CONFIG.headerBackground)
          .setHorizontalAlignment("center");
      }
      
      // Encontrar y formatear encabezados de tareas
      const tareasHeaderRange = this._encontrarRangoEncabezado(sheet, "Proyecto");
      if (tareasHeaderRange) {
        tareasHeaderRange.setFontWeight("bold")
          .setBackground(UI_CONFIG.headerBackground)
          .setHorizontalAlignment("center");
      }
    } catch (error) {
      Logger.log(`⚠️ Error aplicando formato a encabezados: ${error.message}`);
    }
  }

  /**
   * Encuentra el rango de un encabezado específico
   * @private
   * @param {Sheet} sheet - Hoja de cálculo
   * @param {string} textoEncabezado - Texto a buscar
   * @returns {Range|null} Rango encontrado o null
   */
  _encontrarRangoEncabezado(sheet, textoEncabezado) {
    try {
      const finder = sheet.getRange("A:A").createTextFinder(textoEncabezado);
      const celda = finder.findNext();
      
      if (celda) {
        const fila = celda.getRow();
        const numColumnas = sheet.getLastColumn();
        return sheet.getRange(fila, 1, 1, numColumnas);
      }
    } catch (error) {
      Logger.log(`⚠️ Error buscando encabezado "${textoEncabezado}": ${error.message}`);
    }
    
    return null;
  }
}

// Función global para mantener compatibilidad - VERSIÓN VALIDADA Y CORREGIDA
function reporteCompromisos(tareas, colaboradorNombre) {
  try {
    Logger.log(`📊 INICIANDO REPORTE VALIDADO`);
    Logger.log(`👤 Colaborador: ${colaboradorNombre}`);
    Logger.log(`📋 Tareas recibidas: ${tareas ? tareas.length : 'null/undefined'}`);
    
    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    
    // Obtener o crear hoja
    let sheet = spreadsheet.getSheetByName(colaboradorNombre);
    if (!sheet) {
      Logger.log(`➕ Creando nueva hoja: ${colaboradorNombre}`);
      sheet = spreadsheet.insertSheet(colaboradorNombre);
    } else {
      Logger.log(`📋 Usando hoja existente: ${colaboradorNombre}`);
    }
    
    // Limpiar hoja
    sheet.clear();
    sheet.clearFormats();
    Logger.log("🧹 Hoja limpiada");
    
    // Título del reporte
    const fechaActual = new Date().toLocaleDateString('es-ES');
    const titulo = `Reporte de Compromisos para: ${colaboradorNombre} - ${fechaActual}`;
    Logger.log(`📝 Escribiendo título: ${titulo}`);
    
    sheet.appendRow([titulo]);
    
    // Aplicar formato al título
    const titleRange = sheet.getRange(1, 1, 1, 10);
    titleRange.mergeAcross();
    titleRange.setFontWeight("bold");
    titleRange.setFontSize(16);
    titleRange.setHorizontalAlignment("center");
    titleRange.setBackground("#4285f4");
    titleRange.setFontColor("white");
    
    sheet.appendRow([" "]); // Fila en blanco
    
    if (!tareas || tareas.length === 0) {
      Logger.log("📝 Escribiendo mensaje de sin tareas");
      sheet.appendRow(["No se encontraron tareas para el período seleccionado."]);
      sheet.appendRow([`Consulta realizada: ${fechaActual}`]);
      return;
    }
    
    // Procesar datos y estadísticas
    Logger.log("📊 Calculando estadísticas");
    
    let totalTareas = tareas.length;
    let comprometidas = 0;
    let emergentes = 0;
    let adicionales = 0;
    let cerradas = 0;
    let validacion = 0;
    
    tareas.forEach(issue => {
      // Procesar estado
      const status = issue.fields.status?.name;
      if (status === "Cerrado") cerradas++;
      else if (status === "Validación") validacion++;
      
      // Procesar compromiso - ESTRUCTURA VALIDADA
      const compromiso = issue.fields[CONFIG_JIRA.customFields.compromiso];
      if (compromiso && compromiso.value) {
        switch (compromiso.value) {
          case "Comprometido":
            comprometidas++;
            break;
          case "Tarea Emergente":
            emergentes++;
            break;
          case "Adicional":
            adicionales++;
            break;
        }
      }
    });
    
    // Tabla de resumen
    Logger.log("📊 Generando tabla de resumen");
    sheet.appendRow(["📈 RESUMEN GENERAL"]);
    sheet.getRange(sheet.getLastRow(), 1).setFontWeight("bold").setFontSize(14);
    sheet.appendRow([" "]);
    
    sheet.appendRow(["Tipo de Compromiso", "Cantidad", "Porcentaje"]);
    const headerRange = sheet.getRange(sheet.getLastRow(), 1, 1, 3);
    headerRange.setFontWeight("bold").setBackground("#cfe2f3");
    
    sheet.appendRow(["🎯 Comprometidas", comprometidas, totalTareas > 0 ? `${((comprometidas/totalTareas)*100).toFixed(1)}%` : "0%"]);
    sheet.appendRow(["🚨 Emergentes", emergentes, totalTareas > 0 ? `${((emergentes/totalTareas)*100).toFixed(1)}%` : "0%"]);
    sheet.appendRow(["➕ Adicionales", adicionales, totalTareas > 0 ? `${((adicionales/totalTareas)*100).toFixed(1)}%` : "0%"]);
    sheet.appendRow(["📊 TOTAL", totalTareas, "100%"]);
    
    sheet.appendRow([" "]);
    sheet.appendRow(["Estado", "Cantidad"]);
    const statusHeaderRange = sheet.getRange(sheet.getLastRow(), 1, 1, 2);
    statusHeaderRange.setFontWeight("bold").setBackground("#cfe2f3");
    
    sheet.appendRow(["✅ Cerradas", cerradas]);
    sheet.appendRow(["🔍 En Validación", validacion]);
    sheet.appendRow(["⏳ Otras", totalTareas - cerradas - validacion]);
    
    sheet.appendRow([" "]);
    
    // Tabla de tareas detallada
    Logger.log("📋 Generando tabla de tareas");
    sheet.appendRow(["📋 DETALLE DE TAREAS"]);
    sheet.getRange(sheet.getLastRow(), 1).setFontWeight("bold").setFontSize(14);
    
    // Encabezados de la tabla - CAMPOS VALIDADOS
    const headers = ["Clave", "Resumen", "Tipo", "Estado", "Compromiso", "Asignado"];
    sheet.appendRow(headers);
    const detailHeaderRange = sheet.getRange(sheet.getLastRow(), 1, 1, headers.length);
    detailHeaderRange.setFontWeight("bold").setBackground("#cfe2f3");
    
    // Datos de las tareas - ESTRUCTURA VALIDADA
    tareas.forEach((issue, index) => {
      try {
        Logger.log(`📝 Procesando tarea ${index + 1}: ${issue.key}`);
        
        // Extraer compromiso de forma segura
        let compromisoValor = "";
        const compromiso = issue.fields[CONFIG_JIRA.customFields.compromiso];
        if (compromiso && compromiso.value) {
          compromisoValor = compromiso.value;
        }
        
        // Extraer asignado de forma segura  
        let asignado = "";
        if (issue.fields.assignee && issue.fields.assignee.displayName) {
          asignado = issue.fields.assignee.displayName;
        }
        
        sheet.appendRow([
          issue.key || "Sin clave",
          issue.fields.summary || "Sin resumen",
          issue.fields.issuetype?.name || "Sin tipo",
          issue.fields.status?.name || "Sin estado",
          compromisoValor,
          asignado
        ]);
        
      } catch (taskError) {
        Logger.log(`❌ Error procesando tarea ${index}: ${taskError.message}`);
        sheet.appendRow([
          `ERROR-${index}`,
          "Error procesando tarea",
          "Error",
          "Error",
          taskError.message,
          ""
        ]);
      }
    });
    
    // Aplicar formato final
    Logger.log("🎨 Aplicando formato final");
    
    // Auto-redimensionar columnas
    sheet.autoResizeColumns(1, headers.length);
    
    // Ajustar ancho de columna de resumen para que sea más legible
    sheet.setColumnWidth(2, 400);
    
    // Aplicar formato de bordes a toda la tabla
    const lastRow = sheet.getLastRow();
    if (lastRow > 0) {
      const dataRange = sheet.getRange(1, 1, lastRow, headers.length);
      dataRange.setBorder(true, true, true, true, true, true);
    }
    
    Logger.log("✅ REPORTE COMPLETADO EXITOSAMENTE");
    Logger.log(`📊 Estadísticas: ${comprometidas} comprometidas, ${emergentes} emergentes, ${adicionales} adicionales`);
    
  } catch (error) {
    Logger.log(`❌ ERROR CRÍTICO en reporteCompromisos: ${error.message}`);
    Logger.log(`Stack: ${error.stack}`);
    
    // Escribir error en la hoja para debugging
    try {
      const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
      let sheet = spreadsheet.getSheetByName("ERROR_DEBUG");
      if (!sheet) {
        sheet = spreadsheet.insertSheet("ERROR_DEBUG");
      }
      
      sheet.appendRow([
        new Date().toISOString(),
        "Error en reporteCompromisos",
        error.message,
        error.stack,
        `Colaborador: ${colaboradorNombre}`,
        `Tareas: ${tareas ? tareas.length : 'null'}`
      ]);
    } catch (logError) {
      Logger.log(`❌ No se pudo escribir log de error: ${logError.message}`);
    }
  }
}