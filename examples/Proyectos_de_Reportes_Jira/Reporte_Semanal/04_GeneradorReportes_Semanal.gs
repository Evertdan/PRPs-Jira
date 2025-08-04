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
    ProgressManager.actualizar(progressDialog, 'Obteniendo issues de Jira...');
    const issues = await obtenerIssuesSemanalesDeJira(opciones);
    
    const datosValidados = ValidadorReportes.validarIssues(issues);
    if (!datosValidados.esValido) {
      ui.alert('Sin Datos', datosValidados.mensaje, ui.ButtonSet.OK);
      return false;
    }
    
    // ✅ 4. CLASIFICAR Y AGRUPAR DATOS
    ProgressManager.actualizar(progressDialog, 'Clasificando issues por personas...');
    const issuesPorPersona = ClasificadorIssues.clasificarPorPersonaYSemana(issues);
    
    // ✅ 5. GENERAR REPORTE
    ProgressManager.actualizar(progressDialog, 'Escribiendo reporte en hoja...');
    const exito = await GeneradorHoja.escribirReporte(issuesPorPersona, opciones);
    
    ProgressManager.cerrar(progressDialog);
    
    // ✅ 6. MOSTRAR RESULTADO
    if (exito) {
      const estadisticas = CalculadorEstadisticas.calcular(issuesPorPersona, issues);
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
          mensaje: '❌ Las credenciales no están configuradas.\n\nVe al menú "📊 Reportes Semanales" → "🔐 Configurar Credenciales"'
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
   * Valida que los issues obtenidos sean válidos
   */
  validarIssues(issues) {
    if (!issues) {
      return {
        esValido: false,
        mensaje: '❌ No se pudieron obtener issues de Jira'
      };
    }

    if (!Array.isArray(issues)) {
      return {
        esValido: false,
        mensaje: `❌ Datos inválidos recibidos: ${typeof issues}`
      };
    }

    if (issues.length === 0) {
      return {
        esValido: false,
        mensaje: '⚠️ No se encontraron issues con etiquetas semanales.\n\nAsegúrate de que tus issues tengan etiquetas como:\n• SEMANA_1\n• SEMANA_2\n• SEMANA_3\n• etc.'
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
   * ✅ OPTIMIZADO: Clasifica issues por persona y semana en una sola pasada
   */
  clasificarPorPersonaYSemana(issues) {
    Logger.log(`📊 [CLASIFICADOR] Procesando ${issues.length} issues...`);
    
    const resultado = {
      personas: {},
      estadisticas: {
        totalPersonas: 0,
        totalSemanas: new Set(),
        issuesConEtiqueta: 0,
        issuesSinEtiqueta: 0
      }
    };

    // ✅ Procesar todos los issues en una sola iteración
    issues.forEach(issue => {
      const datosIssue = this._extraerDatosIssue(issue);
      
      if (!datosIssue.etiquetaSemanal) {
        resultado.estadisticas.issuesSinEtiqueta++;
        return;
      }

      resultado.estadisticas.issuesConEtiqueta++;
      resultado.estadisticas.totalSemanas.add(datosIssue.etiquetaSemanal);

      // ✅ Crear estructura de persona si no existe
      this._inicializarPersona(resultado.personas, datosIssue.nombrePersona);
      
      // ✅ Crear estructura de semana si no existe
      this._inicializarSemana(resultado.personas[datosIssue.nombrePersona], datosIssue.etiquetaSemanal);

      // ✅ Agregar issue y actualizar totales
      this._agregarIssueYActualizarTotales(resultado.personas[datosIssue.nombrePersona], datosIssue);
    });

    // ✅ Finalizar procesamiento
    resultado.estadisticas.totalPersonas = Object.keys(resultado.personas).length;
    this._finalizarTotales(resultado.personas);

    Logger.log(`✅ [CLASIFICADOR] Procesados: ${resultado.estadisticas.totalPersonas} personas, ${resultado.estadisticas.totalSemanas.size} semanas`);
    return resultado.personas;
  },

  /**
   * Extrae datos necesarios del issue de forma optimizada
   */
  _extraerDatosIssue(issue) {
    const analisis = issue.analisisSemanal;
    return {
      nombrePersona: analisis?.asignadoNombre || 'Sin asignar',
      etiquetaSemanal: this._obtenerPrimeraEtiquetaSemanal(issue),
      tiempoTrabajadoSegundos: issue.fields.timetracking?.timeSpentSeconds || 0,
      tiempoEstimadoSegundos: issue.fields.timetracking?.originalEstimateSeconds || 0,
      esCompletado: analisis?.esCompletado || false,
      esEnProgreso: analisis?.esEnProgreso || false,
      esPendiente: analisis?.esPendiente || false,
      proyectoKey: analisis?.proyectoKey || 'Desconocido',
      issue: issue
    };
  },

  /**
   * Obtiene la primera etiqueta semanal (optimizado)
   */
  _obtenerPrimeraEtiquetaSemanal(issue) {
    if (!issue.fields.labels?.length) return null;
    
    // ✅ Buscar y retornar la primera etiqueta SEMANA_X encontrada
    for (const label of issue.fields.labels) {
      const labelName = typeof label === 'string' ? label : label.name || '';
      if (/^SEMANA_[1-6]$/.test(labelName)) {
        return labelName;
      }
    }
    return null;
  },

  /**
   * Inicializa estructura de persona (lazy initialization)
   */
  _inicializarPersona(personas, nombrePersona) {
    if (!personas[nombrePersona]) {
      personas[nombrePersona] = {
        nombreCompleto: nombrePersona,
        semanas: {},
        totales: {
          tiempoTrabajadoSegundos: 0,
          tiempoEstimadoSegundos: 0,
          totalIssues: 0,
          semanasActivas: new Set(),
          proyectos: new Set()
        }
      };
    }
  },

  /**
   * Inicializa estructura de semana (lazy initialization)
   */
  _inicializarSemana(persona, etiquetaSemana) {
    if (!persona.semanas[etiquetaSemana]) {
      persona.semanas[etiquetaSemana] = {
        etiqueta: etiquetaSemana,
        issues: [],
        totales: {
          tiempoTrabajadoSegundos: 0,
          tiempoEstimadoSegundos: 0,
          totalIssues: 0,
          completados: 0,
          enProgreso: 0,
          pendientes: 0
        }
      };
    }
  },

  /**
   * Agrega issue y actualiza totales en una operación
   */
  _agregarIssueYActualizarTotales(persona, datosIssue) {
    const semana = persona.semanas[datosIssue.etiquetaSemanal];
    
    // ✅ Agregar issue
    semana.issues.push(datosIssue.issue);
    
    // ✅ Actualizar totales de semana
    semana.totales.tiempoTrabajadoSegundos += datosIssue.tiempoTrabajadoSegundos;
    semana.totales.tiempoEstimadoSegundos += datosIssue.tiempoEstimadoSegundos;
    semana.totales.totalIssues++;
    
    if (datosIssue.esCompletado) semana.totales.completados++;
    if (datosIssue.esEnProgreso) semana.totales.enProgreso++;
    if (datosIssue.esPendiente) semana.totales.pendientes++;
    
    // ✅ Actualizar totales de persona
    persona.totales.tiempoTrabajadoSegundos += datosIssue.tiempoTrabajadoSegundos;
    persona.totales.tiempoEstimadoSegundos += datosIssue.tiempoEstimadoSegundos;
    persona.totales.totalIssues++;
    persona.totales.semanasActivas.add(datosIssue.etiquetaSemanal);
    persona.totales.proyectos.add(datosIssue.proyectoKey);
  },

  /**
   * Finaliza totales convirtiendo Sets a arrays
   */
  _finalizarTotales(personas) {
    Object.values(personas).forEach(persona => {
      persona.totales.semanasActivas = Array.from(persona.totales.semanasActivas);
      persona.totales.proyectos = Array.from(persona.totales.proyectos);
    });
  }
};

// =====================================
// 📄 MÓDULO: GENERADOR DE HOJA
// =====================================

const GeneradorHoja = {
  /**
   * ✅ OPTIMIZADO: Escribir reporte usando batch operations
   */
  async escribirReporte(issuesPorPersona, opciones = {}) {
    try {
      const sheet = SpreadsheetApp.getActiveSheet();
      sheet.clear();
      
      const constructor = new ConstructorReporte(sheet);
      await constructor.construir(issuesPorPersona, opciones);
      
      return true;
    } catch (error) {
      Logger.log(`❌ [GENERADOR-HOJA] Error: ${error.message}`);
      return false;
    }
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

  async construir(issuesPorPersona, opciones) {
    // ✅ Procesar cada persona de forma optimizada
    const personasOrdenadas = Object.keys(issuesPorPersona).sort();
    
    for (const nombrePersona of personasOrdenadas) {
      await this._procesarPersona(nombrePersona, issuesPorPersona[nombrePersona]);
    }
    
    // ✅ Aplicar todas las operaciones en batch
    await this._aplicarOperacionesBatch();
    
    // ✅ Aplicar formato final
    this._aplicarFormatoFinal();
  }

  async _procesarPersona(nombrePersona, datosPersona) {
    // ✅ Header de persona
    this._agregarHeaderPersona(nombrePersona);
    
    // ✅ Procesar semanas ordenadas
    const semanasOrdenadas = this._ordenarSemanasNumericamente(Object.keys(datosPersona.semanas));
    
    let totalPersonaTrabajado = 0;
    let totalPersonaEstimado = 0;
    
    for (const etiquetaSemana of semanasOrdenadas) {
      const datosSemana = datosPersona.semanas[etiquetaSemana];
      const totalesSemana = await this._procesarSemana(nombrePersona, etiquetaSemana, datosSemana);
      
      totalPersonaTrabajado += totalesSemana.trabajado;
      totalPersonaEstimado += totalesSemana.estimado;
    }
    
    // ✅ Total de persona
    this._agregarTotalPersona(nombrePersona, totalPersonaTrabajado, totalPersonaEstimado);
    this._agregarEspacioEntrePersonas();
  }

  async _procesarSemana(nombrePersona, etiquetaSemana, datosSemana) {
    // ✅ Header de semana
    this._agregarHeaderSemana(etiquetaSemana);
    
    // ✅ Headers de tabla
    this._agregarHeadersTabla();
    
    // ✅ Procesar issues de la semana
    const totalesSemana = this._procesarIssuesSemana(nombrePersona, datosSemana.issues);
    
    // ✅ Total de semana
    this._agregarTotalSemana(etiquetaSemana, totalesSemana.trabajado, totalesSemana.estimado);
    
    return totalesSemana;
  }

  _procesarIssuesSemana(nombrePersona, issues) {
    let totalTrabajado = 0;
    let totalEstimado = 0;
    
    const filasIssues = issues.map(issue => {
      const tiempoTrabajado = issue.fields.timetracking?.timeSpentSeconds || 0;
      const tiempoEstimado = issue.fields.timetracking?.originalEstimateSeconds || 0;
      
      totalTrabajado += tiempoTrabajado;
      totalEstimado += tiempoEstimado;
      
      return this._crearFilaIssue(nombrePersona, issue, tiempoTrabajado, tiempoEstimado);
    });
    
    // ✅ Agregar filas a batch operations
    if (filasIssues.length > 0) {
      this.batchOperations.push({
        tipo: 'setValues',
        rango: [this.filaActual, 1, filasIssues.length, 10],
        valores: filasIssues
      });
      
      this._agregarFormatoAlternadoFilas(filasIssues.length);
      this.filaActual += filasIssues.length;
    }
    
    return {
      trabajado: totalTrabajado,
      estimado: totalEstimado
    };
  }

  _crearFilaIssue(nombrePersona, issue, tiempoTrabajado, tiempoEstimado) {
    const analisis = issue.analisisSemanal;
    
    // ✅ Formatear fecha de vencimiento
    let fechaVencimiento = '';
    if (analisis?.fechaVencimiento) {
      const fecha = analisis.fechaVencimiento;
      fechaVencimiento = `${fecha.getDate().toString().padStart(2, '0')}/${(fecha.getMonth() + 1).toString().padStart(2, '0')}/${fecha.getFullYear()} 0:00`;
    }
    
    // ✅ Obtener primera etiqueta semanal
    const etiquetaSemanal = ClasificadorIssues._obtenerPrimeraEtiquetaSemanal(issue) || 'Sin etiqueta';
    
    return [
      nombrePersona,
      analisis?.proyectoNombre || 'Sin proyecto',
      issue.key || 'Sin clave',
      analisis?.tipoIssue || 'Sin tipo',
      issue.fields.summary || 'Sin resumen',
      tiempoTrabajado,
      tiempoEstimado,
      fechaVencimiento,
      analisis?.estadoActual || 'Sin estado',
      etiquetaSemanal
    ];
  }

  _agregarHeaderPersona(nombrePersona) {
    this.batchOperations.push({
      tipo: 'merge',
      rango: [this.filaActual, 1, 1, 10]
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

  _agregarHeaderSemana(etiquetaSemana) {
    this.batchOperations.push({
      tipo: 'merge',
      rango: [this.filaActual, 1, 1, 10]
    });
    
    this.batchOperations.push({
      tipo: 'setValue',
      rango: [this.filaActual, 1],
      valor: etiquetaSemana
    });
    
    this.formatOperations.push({
      tipo: 'headerSemana',
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
      rango: [this.filaActual, 1, 1, 10],
      valores: [headers]
    });
    
    this.formatOperations.push({
      tipo: 'headerTabla',
      fila: this.filaActual
    });
    
    this.filaActual++;
  }

  _agregarTotalSemana(etiquetaSemana, totalTrabajado, totalEstimado) {
    const horasTrabajadas = Math.round((totalTrabajado / 3600) * 100) / 100;
    const horasEstimadas = Math.round((totalEstimado / 3600) * 100) / 100;
    
    const filaTotalSemana = [
      '', '', '', '', '',
      horasTrabajadas,
      horasEstimadas,
      '', '', ''
    ];
    
    this.batchOperations.push({
      tipo: 'setValues',
      rango: [this.filaActual, 1, 1, 10],
      valores: [filaTotalSemana]
    });
    
    this.batchOperations.push({
      tipo: 'setValue',
      rango: [this.filaActual, 1],
      valor: `TOTAL ${etiquetaSemana}:`
    });
    
    this.batchOperations.push({
      tipo: 'setValue',
      rango: [this.filaActual, 6],
      valor: horasTrabajadas + 'h'
    });
    
    this.batchOperations.push({
      tipo: 'setValue',
      rango: [this.filaActual, 7],
      valor: horasEstimadas + 'h'
    });
    
    this.formatOperations.push({
      tipo: 'totalSemana',
      fila: this.filaActual
    });
    
    this.filaActual++;
    this.filaActual++; // Espacio entre semanas
  }

  _agregarTotalPersona(nombrePersona, totalTrabajado, totalEstimado) {
    const horasTrabajadas = Math.round((totalTrabajado / 3600) * 100) / 100;
    const horasEstimadas = Math.round((totalEstimado / 3600) * 100) / 100;
    
    const filaTotalPersona = [
      '', '', '', '', '',
      horasTrabajadas,
      horasEstimadas,
      '', '', ''
    ];
    
    this.batchOperations.push({
      tipo: 'setValues',
      rango: [this.filaActual, 1, 1, 10],
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
    
    this.batchOperations.push({
      tipo: 'setValue',
      rango: [this.filaActual, 7],
      valor: horasEstimadas + 'h'
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

  _ordenarSemanasNumericamente(semanas) {
    return semanas.sort((a, b) => {
      const numA = parseInt(a.replace('SEMANA_', '')) || 0;
      const numB = parseInt(b.replace('SEMANA_', '')) || 0;
      return numA - numB;
    });
  }

  async _aplicarOperacionesBatch() {
    // ✅ Aplicar operaciones de datos en lotes
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
      // ✅ Ajustar ancho de columnas
      FormateadorHoja.ajustarAnchoColumnas(this.sheet);
      
      // ✅ Aplicar formatos específicos
      for (const formato of this.formatOperations) {
        FormateadorHoja.aplicarFormato(this.sheet, formato);
      }
      
      // ✅ Formato general
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
    const anchos = [200, 200, 120, 150, 350, 120, 130, 140, 100, 100];
    anchos.forEach((ancho, index) => {
      sheet.setColumnWidth(index + 1, ancho);
    });
  },

  aplicarFormato(sheet, formato) {
    try {
      const range = sheet.getRange(formato.fila, 1, 1, 10);
      
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
          
        case 'headerSemana':
          range.setFontSize(12)
               .setFontWeight('bold')
               .setBackground('#4a90e2')
               .setFontColor('white')
               .setHorizontalAlignment('left')
               .setVerticalAlignment('middle');
          sheet.setRowHeight(formato.fila, 25);
          break;
          
        case 'headerTabla':
          range.setFontWeight('bold')
               .setBackground('#e8f2ff')
               .setFontColor('black')
               .setBorder(true, true, true, true, true, true, '#000000', SpreadsheetApp.BorderStyle.SOLID);
          break;
          
        case 'totalSemana':
          range.setFontWeight('bold')
               .setBackground('#ffeb3b')
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
  calcular(issuesPorPersona, issues) {
    const totalSemanas = new Set();
    Object.values(issuesPorPersona).forEach(persona => {
      Object.keys(persona.semanas).forEach(semana => totalSemanas.add(semana));
    });

    return {
      resumen: `👥 Total de personas: ${Object.keys(issuesPorPersona).length}\n📊 Total de issues: ${issues.length}\n📅 Semanas encontradas: ${totalSemanas.size}\n🕐 Generado: ${new Date().toLocaleString()}`
    };
  },

  /**
   * ✅ NUEVA: Calcular estadísticas por departamento
   * @param {Object} issuesPorPersona - Issues agrupados por persona
   * @param {Array} issues - Issues originales
   * @returns {Object} Estadísticas por departamento
   */
  calcularPorDepartamento(issuesPorPersona, issues) {
    const estadisticasDepartamento = {};
    
    Object.entries(issuesPorPersona).forEach(([nombrePersona, datosPersona]) => {
      // ✅ Obtener información de la persona del equipo
      const personaEquipo = obtenerPersonaEquipo(nombrePersona);
      const departamento = personaEquipo?.departamento || 'Sin departamento';
      
      if (!estadisticasDepartamento[departamento]) {
        estadisticasDepartamento[departamento] = {
          personas: 0,
          issues: 0,
          tiempoTrabajadoTotal: 0,
          tiempoEstimadoTotal: 0,
          semanasActivas: new Set(),
          proyectos: new Set(),
          nombresPersonas: []
        };
      }
      
      const stats = estadisticasDepartamento[departamento];
      stats.personas++;
      stats.issues += datosPersona.totales.totalIssues;
      stats.tiempoTrabajadoTotal += datosPersona.totales.tiempoTrabajadoSegundos;
      stats.tiempoEstimadoTotal += datosPersona.totales.tiempoEstimadoSegundos;
      stats.nombresPersonas.push(nombrePersona);
      
      // ✅ Agregar semanas y proyectos
      datosPersona.totales.semanasActivas.forEach(semana => 
        stats.semanasActivas.add(semana)
      );
      datosPersona.totales.proyectos.forEach(proyecto => 
        stats.proyectos.add(proyecto)
      );
    });
    
    // ✅ Convertir Sets a arrays y calcular horas
    Object.values(estadisticasDepartamento).forEach(stats => {
      stats.semanasActivas = Array.from(stats.semanasActivas);
      stats.proyectos = Array.from(stats.proyectos);
      stats.tiempoTrabajadoHoras = Math.round((stats.tiempoTrabajadoTotal / 3600) * 100) / 100;
      stats.tiempoEstimadoHoras = Math.round((stats.tiempoEstimadoTotal / 3600) * 100) / 100;
      stats.eficiencia = stats.tiempoEstimadoTotal > 0 ? 
        Math.round((stats.tiempoTrabajadoTotal / stats.tiempoEstimadoTotal) * 100) / 100 : 0;
    });
    
    return estadisticasDepartamento;
  },

  /**
   * ✅ NUEVA: Generar resumen de estadísticas por departamento
   * @param {Object} estadisticasDepartamento - Estadísticas calculadas
   * @returns {string} Resumen formateado
   */
  generarResumenDepartamentos(estadisticasDepartamento) {
    let resumen = '🏢 ESTADÍSTICAS POR DEPARTAMENTO:\n\n';
    
    const departamentosOrdenados = Object.keys(estadisticasDepartamento)
      .sort((a, b) => estadisticasDepartamento[b].personas - estadisticasDepartamento[a].personas);
    
    departamentosOrdenados.forEach(departamento => {
      const stats = estadisticasDepartamento[departamento];
      resumen += `📊 ${departamento}:\n`;
      resumen += `   👥 Personas: ${stats.personas}\n`;
      resumen += `   📋 Issues: ${stats.issues}\n`;
      resumen += `   ⏱️ Tiempo trabajado: ${stats.tiempoTrabajadoHoras}h\n`;
      resumen += `   📈 Eficiencia: ${Math.round(stats.eficiencia * 100)}%\n`;
      resumen += `   📅 Semanas activas: ${stats.semanasActivas.length}\n\n`;
    });
    
    const totalPersonas = Object.values(estadisticasDepartamento)
      .reduce((sum, stats) => sum + stats.personas, 0);
    const totalIssues = Object.values(estadisticasDepartamento)
      .reduce((sum, stats) => sum + stats.issues, 0);
    
    resumen += `📊 TOTALES: ${totalPersonas} personas, ${totalIssues} issues\n`;
    resumen += `🕐 Generado: ${new Date().toLocaleString()}`;
    
    return resumen;
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
    // En Google Apps Script no se puede actualizar el diálogo dinámicamente
    // Solo registramos el progreso en logs
    Logger.log(`📝 [PROGRESO] ${mensaje}`);
  },

  cerrar(dialog) {
    // El diálogo se cierra automáticamente al finalizar la función
    Logger.log('✅ [PROGRESO] Completado');
  }
};

// =====================================
// 🔄 COMPATIBILIDAD: FUNCIONES LEGACY
// =====================================

/**
 * ✅ COMPATIBILIDAD: Mantener función original para reportes legacy
 */
function clasificarIssuesPorSemana(issues) {
  const issuesPorPersona = ClasificadorIssues.clasificarPorPersonaYSemana(issues);
  const issuesPorSemana = {};
  
  // Convertir estructura persona->semana a semana->issues
  Object.values(issuesPorPersona).forEach(persona => {
    Object.entries(persona.semanas).forEach(([etiquetaSemana, datosSemana]) => {
      if (!issuesPorSemana[etiquetaSemana]) {
        issuesPorSemana[etiquetaSemana] = {
          issues: [],
          estadisticas: {
            total: 0,
            completados: 0,
            enProgreso: 0,
            pendientes: 0,
            vencidos: 0,
            conStoryPoints: 0,
            tiempoEstimadoTotal: 0,
            tiempoTrabajadoTotal: 0,
            proyectos: new Set(),
            asignados: new Set()
          }
        };
      }
      
      issuesPorSemana[etiquetaSemana].issues.push(...datosSemana.issues);
      const stats = issuesPorSemana[etiquetaSemana].estadisticas;
      stats.total += datosSemana.totales.totalIssues;
      stats.completados += datosSemana.totales.completados;
      stats.enProgreso += datosSemana.totales.enProgreso;
      stats.pendientes += datosSemana.totales.pendientes;
      stats.tiempoEstimadoTotal += datosSemana.totales.tiempoEstimadoSegundos / 3600;
      stats.tiempoTrabajadoTotal += datosSemana.totales.tiempoTrabajadoSegundos / 3600;
    });
  });
  
  return issuesPorSemana;
}

/**
 * ✅ COMPATIBILIDAD: Función específica para obtener primera etiqueta semanal
 */
function obtenerPrimeraEtiquetaSemanal(issue) {
  return ClasificadorIssues._obtenerPrimeraEtiquetaSemanal(issue);
}