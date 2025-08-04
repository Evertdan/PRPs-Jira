// =====================================
// ARCHIVO 4: GENERADOR DE REPORTES OPTIMIZADO Y MODULARIZADO
// =====================================

// =====================================
// 🚀 MÓDULO PRINCIPAL: GENERADOR DE REPORTES
// =====================================

/**
 * ✅ OPTIMIZADO: Genera reporte semanal con agrupación por personas
 * @param {Object} opciones - Opciones de generación del reporte
 * @returns {boolean} true si se generó exitosamente
 */
async function generarReporteSemanalCompleto(opciones = {}) {
  const ui = SpreadsheetApp.getUi();
  
  try {
    Logger.log('🚀 [OPTIMIZADO] Iniciando generación de reporte...');
    
    // ✅ 1. VALIDACIONES PREVIAS
    const validacion = await ValidadorReportes.validarPrerequisitos();
    if (!validacion.esValido) {
      ui.alert('Error de Configuración', validacion.mensaje, ui.ButtonSet.OK);
      return false;
    }
    
    // ✅ 2. MOSTRAR PROGRESO
    const progressDialog = ProgressManager.mostrar('Generando reporte semanal...');
    
    // ✅ 3. OBTENER Y PROCESAR DATOS
    ProgressManager.actualizar(progressDialog, 'Obteniendo registros de trabajo de Jira...');
    
    const worklogs = await obtenerIssuesSemanalesDeJira(opciones);
    
    const datosValidados = ValidadorReportes.validarWorklogs(worklogs);
    if (!datosValidados.esValido) {
      ui.alert('Sin Datos', datosValidados.mensaje, ui.ButtonSet.OK);
      return false;
    }
    
    // ✅ 4. CLASIFICAR Y AGRUPAR DATOS
    ProgressManager.actualizar(progressDialog, 'Clasificando registros por persona...');
    const worklogsPorPersona = ClasificadorIssues.clasificarPorPersona(worklogs);
    
    // ✅ 5. GENERAR REPORTE
    ProgressManager.actualizar(progressDialog, 'Escribiendo reporte en hoja...');
    const exito = await GeneradorHoja.escribirReporte(worklogsPorPersona, opciones);
    
    ProgressManager.cerrar(progressDialog);
    
    // ✅ 6. MOSTRAR RESULTADO
    if (exito) {
      const estadisticas = CalculadorEstadisticas.calcular(worklogsPorPersona, worklogs);
      ui.alert(
        'Reporte Generado',
        `✅ Reporte generado exitosamente!\n\n${estadisticas.resumen}`,
        ui.ButtonSet.OK
      );
      return true;
    }
    
    throw new Error('La escritura del reporte falló');
    
  } catch (error) {
    ErrorManagerSemanal.registrarError(
      'Error generando reporte optimizado',
      error,
      'GENERADOR_OPTIMIZADO',
      'CRITICAL'
    );
    
    ui.alert(
      'Error en Reporte',
      `❌ Error: ${error.message}`,
      ui.ButtonSet.OK
    );
    return false;
  }
}

// =====================================
// 🔧 MÓDULO: VALIDADOR DE REPORTES
// =====================================

const ValidadorReportes = {
  /**
   * Valida todos los prerequisitos antes de generar el reporte
   */
  async validarPrerequisitos() {
    try {
      if (!verificarCredencialesJiraSemanal()) {
        return {
          esValido: false,
          mensaje: '❌ Las credenciales no están configuradas.\n\nVe al menú "📊 Reportes de Horas (Worklog)" → "🔐 Configurar Credenciales"'
        };
      }
      return { esValido: true };
    } catch (error) {
      return {
        esValido: false,
        mensaje: `❌ Error de validación: ${error.message}`
      };
    }
  },

  /**
   * Valida que los worklogs obtenidos sean válidos
   */
  validarWorklogs(worklogs) {
    if (!worklogs) {
      return {
        esValido: false,
        mensaje: '❌ No se pudieron obtener registros de trabajo de Jira'
      };
    }

    if (!Array.isArray(worklogs)) {
      return {
        esValido: false,
        mensaje: `❌ Datos inválidos recibidos: ${typeof worklogs}`
      };
    }

    if (worklogs.length === 0) {
      return {
        esValido: false,
        mensaje: '⚠️ No se encontraron registros de trabajo en el período seleccionado.'
      };
    }

    return { esValido: true };
  }
};

// =====================================
// 📊 MÓDULO: CLASIFICADOR DE ISSUES
// =====================================

const ClasificadorIssues = {
  /**
   * ✅ REFACTORIZADO: Clasifica los registros de trabajo por persona.
   */
  clasificarPorPersona(worklogs) {
    Logger.log(`📊 [CLASIFICADOR] Procesando ${worklogs.length} registros de trabajo...`);
    
    const resultado = {
      personas: {},
      estadisticas: {
        totalPersonas: 0,
        totalWorklogs: worklogs.length,
        totalHoras: 0
      }
    };

    worklogs.forEach(worklog => {
      const nombrePersona = worklog.worklogAuthor;

      if (!resultado.personas[nombrePersona]) {
        resultado.personas[nombrePersona] = {
          nombreCompleto: nombrePersona,
          worklogs: [],
          totales: {
            tiempoTrabajadoSegundos: 0,
            totalWorklogs: 0,
            proyectos: new Set()
          }
        };
      }

      const persona = resultado.personas[nombrePersona];
      persona.worklogs.push(worklog);
      persona.totales.tiempoTrabajadoSegundos += worklog.timeSpentSeconds;
      persona.totales.totalWorklogs++;
      persona.totales.proyectos.add(worklog.projectKey);
      resultado.estadisticas.totalHoras += worklog.timeSpentHours;
    });

    resultado.estadisticas.totalPersonas = Object.keys(resultado.personas).length;
    this._finalizarTotales(resultado.personas);

    Logger.log(`✅ [CLASIFICADOR] Procesados: ${resultado.estadisticas.totalPersonas} personas, ${resultado.estadisticas.totalWorklogs} worklogs`);
    return resultado.personas;
  },

  /**
   * Finaliza totales convirtiendo Sets a arrays
   */
  _finalizarTotales(personas) {
    Object.values(personas).forEach(persona => {
      persona.totales.proyectos = Array.from(persona.totales.proyectos);
    });
  }
};

// =====================================
// 📄 MÓDULO: GENERADOR DE HOJA
// =====================================

const GeneradorHoja = {
  /**
   * ✅ REFACTORIZADO: Escribir reporte de worklogs creando una nueva hoja
   */
  async escribirReporte(worklogsPorPersona, opciones = {}) {
    try {
      const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
      const nombreHoja = this._crearNombreHoja();
      const sheet = spreadsheet.insertSheet(nombreHoja);
      spreadsheet.setActiveSheet(sheet);
      
      const constructor = new ConstructorReporte(sheet);
      await constructor.construir(worklogsPorPersona, opciones);
      
      return true;
    } catch (error) {
      Logger.log(`❌ [GENERADOR-HOJA] Error: ${error.message}`);
      return false;
    }
  },

  /**
   * Crea un nombre de hoja único basado en la fecha y hora.
   */
  _crearNombreHoja() {
    const ahora = new Date();
    const timestamp = ahora.toISOString()
      .replace(/:/g, '-')
      .replace(/\..+/, '');
    return `Reporte_${timestamp}`;
  }
};

// =====================================
// 🏗️ CLASE: CONSTRUCTOR DE REPORTE
// =====================================

class ConstructorReporte {
  constructor(sheet) {
    this.sheet = sheet;
    this.filaActual = 1;
    this.batchOperations = [];
    this.formatOperations = [];
  }

  async construir(worklogsPorPersona, opciones) {
    const personasOrdenadas = Object.keys(worklogsPorPersona).sort();
    
    for (const nombrePersona of personasOrdenadas) {
      await this._procesarPersona(nombrePersona, worklogsPorPersona[nombrePersona]);
    }
    
    await this._aplicarOperacionesBatch();
    this._aplicarFormatoFinal();
  }

  async _procesarPersona(nombrePersona, datosPersona) {
    this._agregarHeaderPersona(nombrePersona);
    this._agregarHeadersTabla();

    const filasWorklogs = datosPersona.worklogs.map(worklog => {
      return this._crearFilaWorklog(worklog);
    });

    if (filasWorklogs.length > 0) {
      this.batchOperations.push({
        tipo: 'setValues',
        rango: [this.filaActual, 1, filasWorklogs.length, 10], // Aumentado a 10 columnas
        valores: filasWorklogs
      });
      
      this._agregarFormatoAlternadoFilas(filasWorklogs.length);
      this.filaActual += filasWorklogs.length;
    }

    this._agregarTotalPersona(nombrePersona, datosPersona.totales.tiempoTrabajadoSegundos);
    this._agregarEspacioEntrePersonas();
  }

  _crearFilaWorklog(worklog) {
    return [
      worklog.worklogAuthor,
      worklog.projectName,
      worklog.issueKey,
      worklog.issueType,
      worklog.issueSummary,
      worklog.timeSpentHours,
      worklog.estimacionOriginal / 3600, // Convertir a horas
      worklog.fechaVencimiento ? worklog.fechaVencimiento.toLocaleDateString() : 'N/A',
      worklog.issueStatus,
      worklog.etiquetas.join(', ')
    ];
  }

  _agregarHeaderPersona(nombrePersona) {
    this.batchOperations.push({
      tipo: 'merge',
      rango: [this.filaActual, 1, 1, 10] // Aumentado a 10 columnas
    });
    
    this.batchOperations.push({
      tipo: 'setValue',
      rango: [this.filaActual, 1],
      valor: `📊 ${nombrePersona}`
    });
    
    this.formatOperations.push({
      tipo: 'headerPersona',
      fila: this.filaActual
    });
    
    this.filaActual++;
  }

  _agregarHeadersTabla() {
    const headers = [
      'Persona asignada', 'Nombre del proyecto', 'Clave de incidencia',
      'Tipo de Incidencia', 'Resumen', 'Tiempo Trabajado',
      'Estimación original', 'Fecha de vencimiento', 'Estado', 'Etiquetas'
    ];
    
    this.batchOperations.push({
      tipo: 'setValues',
      rango: [this.filaActual, 1, 1, 10], // Aumentado a 10 columnas
      valores: [headers]
    });
    
    this.formatOperations.push({
      tipo: 'headerTabla',
      fila: this.filaActual
    });
    
    this.filaActual++;
  }

  _agregarTotalPersona(nombrePersona, totalTrabajadoSegundos) {
    const horasTrabajadas = Math.round((totalTrabajadoSegundos / 3600) * 100) / 100;
    
    const filaTotalPersona = [
      '', '', '', '', '',
      horasTrabajadas,
      '', '', '', ''
    ];
    
    this.batchOperations.push({
      tipo: 'setValues',
      rango: [this.filaActual, 1, 1, 10], // Aumentado a 10 columnas
      valores: [filaTotalPersona]
    });
    
    this.batchOperations.push({
      tipo: 'setValue',
      rango: [this.filaActual, 1],
      valor: `TOTAL ${nombrePersona}:`
    });
    
    this.batchOperations.push({
      tipo: 'setValue',
      rango: [this.filaActual, 6],
      valor: horasTrabajadas + 'h'
    });
    
    this.formatOperations.push({
      tipo: 'totalPersona',
      fila: this.filaActual
    });
    
    this.filaActual++;
  }

  _agregarEspacioEntrePersonas() {
    this.filaActual += 2;
  }

  _agregarFormatoAlternadoFilas(cantidadFilas) {
    for (let i = 0; i < cantidadFilas; i++) {
      this.formatOperations.push({
        tipo: 'filaAlternada',
        fila: this.filaActual - cantidadFilas + i,
        esAlternada: i % 2 === 0
      });
    }
  }

  async _aplicarOperacionesBatch() {
    for (const operacion of this.batchOperations) {
      try {
        switch (operacion.tipo) {
          case 'setValues':
            this.sheet.getRange(...operacion.rango).setValues(operacion.valores);
            break;
          case 'setValue':
            this.sheet.getRange(...operacion.rango).setValue(operacion.valor);
            break;
          case 'merge':
            this.sheet.getRange(...operacion.rango).merge();
            break;
        }
      } catch (error) {
        Logger.log(`⚠️ Error en operación batch: ${error.message}`);
      }
    }
  }

  _aplicarFormatoFinal() {
    try {
      FormateadorHoja.ajustarAnchoColumnas(this.sheet);
      for (const formato of this.formatOperations) {
        FormateadorHoja.aplicarFormato(this.sheet, formato);
      }
      FormateadorHoja.aplicarFormatoGeneral(this.sheet);
    } catch (error) {
      Logger.log(`⚠️ Error aplicando formato: ${error.message}`);
    }
  }
}

// =====================================
// 🎨 MÓDULO: FORMATEADOR DE HOJA
// =====================================

const FormateadorHoja = {
  ajustarAnchoColumnas(sheet) {
    const anchos = [200, 200, 120, 150, 350, 120, 130, 100];
    anchos.forEach((ancho, index) => {
      sheet.setColumnWidth(index + 1, ancho);
    });
  },

  aplicarFormato(sheet, formato) {
    try {
      const range = sheet.getRange(formato.fila, 1, 1, 8);
      
      switch (formato.tipo) {
        case 'headerPersona':
          range.setFontSize(16)
               .setFontWeight('bold')
               .setBackground('#1e3c72')
               .setFontColor('white')
               .setHorizontalAlignment('center')
               .setVerticalAlignment('middle');
          sheet.setRowHeight(formato.fila, 35);
          break;
          
        case 'headerTabla':
          range.setFontWeight('bold')
               .setBackground('#e8f2ff')
               .setFontColor('black')
               .setBorder(true, true, true, true, true, true, '#000000', SpreadsheetApp.BorderStyle.SOLID);
          break;
          
        case 'totalPersona':
          range.setFontWeight('bold')
               .setBackground('#dc3545')
               .setFontColor('white')
               .setBorder(true, true, true, true, true, true, '#000000', SpreadsheetApp.BorderStyle.SOLID);
          break;
          
        case 'filaAlternada':
          if (formato.esAlternada) {
            range.setBackground('#f8fcff');
          }
          range.setBorder(true, true, true, true, true, true, '#cccccc', SpreadsheetApp.BorderStyle.SOLID);
          break;
      }
    } catch (error) {
      Logger.log(`⚠️ Error aplicando formato ${formato.tipo}: ${error.message}`);
    }
  },

  aplicarFormatoGeneral(sheet) {
    try {
      const rangeCompleto = sheet.getDataRange();
      if (rangeCompleto && rangeCompleto.getNumRows() > 0) {
        rangeCompleto.setFontFamily('Arial')
                     .setFontSize(10)
                     .setVerticalAlignment('middle')
                     .setHorizontalAlignment('left');
      }
    } catch (error) {
      Logger.log(`⚠️ Error aplicando formato general: ${error.message}`);
    }
  }
};

// =====================================
// 📈 MÓDULO: CALCULADOR DE ESTADÍSTICAS
// =====================================

const CalculadorEstadisticas = {
  calcular(worklogsPorPersona, worklogs) {
    const totalHoras = worklogs.reduce((sum, worklog) => sum + worklog.timeSpentHours, 0);
    return {
      resumen: `👥 Total de personas: ${Object.keys(worklogsPorPersona).length}\n📊 Total de registros: ${worklogs.length}\n⏱️ Total de horas: ${totalHoras.toFixed(2)}h\n🕐 Generado: ${new Date().toLocaleString()}`
    };
  }
};

// =====================================
// 🔄 MÓDULO: MANAGER DE PROGRESO
// =====================================

const ProgressManager = {
  mostrar(mensaje) {
    try {
      const ui = SpreadsheetApp.getUi();
      return ui.showModalDialog(
        HtmlService.createHtmlOutput(`<p>${mensaje}</p>`)
          .setWidth(400).setHeight(100),
        'Generando Reporte'
      );
    } catch (error) {
      Logger.log(`⚠️ Error mostrando progreso: ${error.message}`);
      return null;
    }
  },

  actualizar(dialog, mensaje) {
    Logger.log(`📝 [PROGRESO] ${mensaje}`);
  },

  cerrar(dialog) {
    Logger.log('✅ [PROGRESO] Completado');
  }
};