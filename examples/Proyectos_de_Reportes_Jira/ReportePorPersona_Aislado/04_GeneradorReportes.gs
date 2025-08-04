// =====================================
// GENERADOR DE REPORTES POR PERSONA
// =====================================

/**
 * ✅ Genera reporte completo por persona
 */
async function generarReporteSemanalCompleto(opciones = {}) {
  const ui = SpreadsheetApp.getUi();
  
  try {
    Logger.log('🚀 [REPORTE] Iniciando generación de reporte por persona...');
    
    // 1. VALIDACIONES PREVIAS
    if (!verificarCredencialesJiraSemanal()) {
      ui.alert('Error de Configuración', 'Las credenciales no están configuradas.', ui.ButtonSet.OK);
      return false;
    }
    
    // 2. MOSTRAR PROGRESO
    ui.showModalDialog(
      HtmlService.createHtmlOutput('<p>📊 Generando reporte por persona...</p><p>Por favor espera...</p>')
        .setWidth(400).setHeight(100),
      'Generando Reporte'
    );
    
    // 3. OBTENER Y PROCESAR DATOS
    Logger.log('📊 [REPORTE] Obteniendo registros de trabajo de Jira...');
    
    const worklogs = await obtenerIssuesSemanalesDeJira(opciones);
    
    if (!worklogs || !Array.isArray(worklogs) || worklogs.length === 0) {
      ui.alert('Sin Datos', '⚠️ No se encontraron registros de trabajo en el período seleccionado.', ui.ButtonSet.OK);
      return false;
    }
    
    // 4. CLASIFICAR Y AGRUPAR DATOS
    Logger.log('📋 [REPORTE] Clasificando registros por persona...');
    const worklogsPorPersona = ClasificadorIssues.clasificarPorPersona(worklogs);
    
    // 5. GENERAR REPORTE
    Logger.log('📝 [REPORTE] Escribiendo reporte en hoja...');
    const exito = await GeneradorHoja.escribirReporte(worklogsPorPersona, opciones);
    
    // 6. MOSTRAR RESULTADO
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
    Logger.log(`❌ [REPORTE] Error: ${error.message}`);
    ui.alert(
      'Error en Reporte',
      `❌ Error: ${error.message}`,
      ui.ButtonSet.OK
    );
    return false;
  }
}

// =====================================
// 📊 MÓDULO: CLASIFICADOR DE ISSUES
// =====================================

const ClasificadorIssues = {
  /**
   * Clasifica los registros de trabajo por persona
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
      const accountId = worklog.worklogAuthorAccountId;
      const nombre = worklog.worklogAuthor;
      
      if (!resultado.personas[accountId]) {
        resultado.personas[accountId] = {
          nombre: nombre,
          accountId: accountId,
          totalHoras: 0,
          totalRegistros: 0,
          proyectos: {},
          worklogs: []
        };
      }
      
      const persona = resultado.personas[accountId];
      persona.totalHoras += worklog.timeSpentHours;
      persona.totalRegistros++;
      persona.worklogs.push(worklog);
      
      // Agrupar por proyecto
      const proyectoKey = worklog.projectKey;
      if (!persona.proyectos[proyectoKey]) {
        persona.proyectos[proyectoKey] = {
          nombre: worklog.projectName,
          totalHoras: 0,
          issues: {}
        };
      }
      
      persona.proyectos[proyectoKey].totalHoras += worklog.timeSpentHoras;
      
      // Agrupar por issue
      const issueKey = worklog.issueKey;
      if (!persona.proyectos[proyectoKey].issues[issueKey]) {
        persona.proyectos[proyectoKey].issues[issueKey] = {
          resumen: worklog.issueSummary,
          tipo: worklog.issueType,
          estado: worklog.issueStatus,
          totalHoras: 0,
          registros: []
        };
      }
      
      persona.proyectos[proyectoKey].issues[issueKey].totalHoras += worklog.timeSpentHours;
      persona.proyectos[proyectoKey].issues[issueKey].registros.push(worklog);
    });
    
    // Actualizar estadísticas
    resultado.estadisticas.totalPersonas = Object.keys(resultado.personas).length;
    resultado.estadisticas.totalHoras = Object.values(resultado.personas)
      .reduce((sum, persona) => sum + persona.totalHoras, 0);
    
    Logger.log(`✅ [CLASIFICADOR] ${resultado.estadisticas.totalPersonas} personas procesadas`);
    
    return resultado;
  }
};

// =====================================
// 📝 MÓDULO: GENERADOR DE HOJA
// =====================================

const GeneradorHoja = {
  /**
   * Escribe el reporte en la hoja de cálculo
   */
  async escribirReporte(worklogsPorPersona, opciones = {}) {
    try {
      const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
      
      // Crear nombre personalizado para la hoja
      let nombreHoja = `Mi_Reporte_${new Date().toISOString().slice(0, 10)}`;
      if (opciones.nombreUsuario) {
        const nombreCorto = opciones.nombreUsuario.split(' ')[0]; // Primer nombre
        let sufijo = new Date().toISOString().slice(0, 10);
        
        // Si tenemos fechas específicas, incluirlas en el nombre
        if (opciones.fechaInicio && opciones.fechaFin) {
          const inicioStr = opciones.fechaInicio.toISOString().slice(5, 10).replace('-', '_');
          const finStr = opciones.fechaFin.toISOString().slice(5, 10).replace('-', '_');
          sufijo = `${inicioStr}_al_${finStr}`;
        }
        
        nombreHoja = `${nombreCorto}_${sufijo}`;
      }
      
      // Crear nueva hoja o limpiar existente
      let sheet;
      try {
        sheet = spreadsheet.getSheetByName(nombreHoja);
        if (sheet) {
          sheet.clear();
        } else {
          sheet = spreadsheet.insertSheet(nombreHoja);
        }
      } catch (e) {
        sheet = spreadsheet.insertSheet(nombreHoja);
      }
      
      spreadsheet.setActiveSheet(sheet);
      
      const escritor = new EscritorHoja(sheet);
      
      // Escribir encabezado principal
      escritor.escribirEncabezadoPrincipal(opciones);
      
      // Escribir datos por persona
      const personas = Object.values(worklogsPorPersona.personas);
      
      if (opciones.accountId) {
        // Filtrar solo la persona seleccionada
        const personaSeleccionada = personas.find(p => p.accountId === opciones.accountId);
        if (personaSeleccionada) {
          escritor.escribirDatosPersona(personaSeleccionada);
        }
      } else {
        // Escribir todas las personas
        personas.forEach(persona => {
          escritor.escribirDatosPersona(persona);
        });
      }
      
      // Escribir estadísticas finales
      escritor.escribirEstadisticasFinales(worklogsPorPersona.estadisticas);
      
      // Aplicar formato
      escritor.aplicarFormatoFinal();
      
      Logger.log('✅ [GENERADOR] Reporte escrito exitosamente');
      return true;
      
    } catch (error) {
      Logger.log(`❌ [GENERADOR] Error escribiendo reporte: ${error.message}`);
      return false;
    }
  }
};

// =====================================
// ✍️ CLASE: ESCRITOR DE HOJA
// =====================================

class EscritorHoja {
  constructor(sheet) {
    this.sheet = sheet;
    this.filaActual = 1;
    this.formatOperations = [];
  }

  escribirEncabezadoPrincipal(opciones) {
    const fechaActual = new Date().toLocaleDateString();
    let titulo = 'REPORTE PERSONAL DE ACTIVIDADES';
    
    // Si tenemos información del usuario, personalizar el título
    if (opciones.nombreUsuario) {
      titulo = `REPORTE PERSONAL - ${opciones.nombreUsuario.toUpperCase()}`;
    }
    
    this.sheet.getRange(this.filaActual, 1, 1, 10)
      .merge()
      .setValue(`📊 ${titulo}`)
      .setFontSize(18)
      .setFontWeight('bold')
      .setBackground('#1e3c72')
      .setFontColor('white')
      .setHorizontalAlignment('center');
    
    this.sheet.setRowHeight(this.filaActual, 40);
    this.filaActual++;
    
    // Agregar información del período si está disponible
    if (opciones.periodoTexto) {
      this.sheet.getRange(this.filaActual, 1, 1, 10)
        .merge()
        .setValue(`📅 Período: ${opciones.periodoTexto} | Generado: ${fechaActual}`)
        .setFontSize(12)
        .setFontWeight('bold')
        .setBackground('#4a90e2')
        .setFontColor('white')
        .setHorizontalAlignment('center');
      
      this.sheet.setRowHeight(this.filaActual, 25);
      this.filaActual++;
    }
    
    this.filaActual++;
  }

  escribirDatosPersona(persona) {
    // Encabezado de persona
    this.sheet.getRange(this.filaActual, 1, 1, 10)
      .merge()
      .setValue(`👤 ${persona.nombre} - Total: ${persona.totalHoras.toFixed(2)}h (${persona.totalRegistros} registros)`)
      .setFontSize(14)
      .setFontWeight('bold')
      .setBackground('#4a90e2')
      .setFontColor('white')
      .setHorizontalAlignment('left');
    
    this.sheet.setRowHeight(this.filaActual, 30);
    this.filaActual++;
    
    // Encabezados de tabla actualizados
    const headers = [
      'Persona asignada',
      'Nombre del proyecto', 
      'Clave de incidencia',
      'Tipo de Incidencia',
      'Resumen',
      'Tiempo Trabajado',
      'Estimación original',
      'Fecha de vencimiento',
      'Estado',
      'Etiquetas'
    ];
    
    this.sheet.getRange(this.filaActual, 1, 1, headers.length)
      .setValues([headers])
      .setFontWeight('bold')
      .setBackground('#e8f2ff')
      .setFontColor('black');
    
    this.filaActual++;
    
    // Datos de registros con las nuevas columnas
    let filaAlternada = false;
    Object.values(persona.proyectos).forEach(proyecto => {
      Object.values(proyecto.issues).forEach(issue => {
        issue.registros.forEach(registro => {
          const fila = [
            registro.worklogAuthor,                                    // Persona asignada
            registro.projectName,                                      // Nombre del proyecto
            registro.issueKey,                                         // Clave de incidencia
            registro.issueType,                                        // Tipo de Incidencia
            registro.issueSummary,                                     // Resumen
            registro.timeSpentSeconds,                                 // Tiempo Trabajado (en segundos)
            registro.estimacionOriginal || '',                         // Estimación original
            registro.fechaVencimiento ? 
              this.formatearFechaVencimiento(registro.fechaVencimiento) : '', // Fecha de vencimiento
            registro.issueStatus,                                      // Estado
            registro.etiquetas ? registro.etiquetas.join(', ') : ''   // Etiquetas
          ];
          
          const range = this.sheet.getRange(this.filaActual, 1, 1, fila.length);
          range.setValues([fila]);
          
          if (filaAlternada) {
            range.setBackground('#f8fcff');
          }
          
          filaAlternada = !filaAlternada;
          this.filaActual++;
        });
      });
    });
    
    this.filaActual++;
  }
  
  formatearFechaVencimiento(fecha) {
    if (!fecha) return '';
    const day = String(fecha.getDate()).padStart(2, '0');
    const month = String(fecha.getMonth() + 1).padStart(2, '0');
    const year = fecha.getFullYear();
    return `${day}/${month}/${year} 00:00`;
  }

  escribirEstadisticasFinales(estadisticas) {
    this.filaActual++;
    
    // Encabezado de estadísticas finales
    this.sheet.getRange(this.filaActual, 1, 1, 10)
      .merge()
      .setValue('📊 ESTADÍSTICAS FINALES')
      .setFontSize(14)
      .setFontWeight('bold')
      .setBackground('#28a745')
      .setFontColor('white')
      .setHorizontalAlignment('center');
    
    this.filaActual++;
    
    const stats = [
      ['Total de Personas:', estadisticas.totalPersonas],
      ['Total de Registros:', estadisticas.totalWorklogs],
      ['Total de Horas:', `${estadisticas.totalHoras.toFixed(2)}h`],
      ['Generado:', new Date().toLocaleString()]
    ];
    
    stats.forEach(stat => {
      this.sheet.getRange(this.filaActual, 1, 1, 2)
        .setValues([stat])
        .setFontWeight('bold')
        .setBackground('#f8fcff');
      this.filaActual++;
    });
  }

  aplicarFormatoFinal() {
    try {
      // Ajustar ancho de columnas para las 10 columnas nuevas
      const anchos = [
        200,  // Persona asignada
        250,  // Nombre del proyecto
        120,  // Clave de incidencia
        150,  // Tipo de Incidencia
        400,  // Resumen
        120,  // Tiempo Trabajado
        120,  // Estimación original
        150,  // Fecha de vencimiento
        100,  // Estado
        120   // Etiquetas
      ];
      
      anchos.forEach((ancho, index) => {
        this.sheet.setColumnWidth(index + 1, ancho);
      });
      
      // Formato general
      const rangeCompleto = this.sheet.getDataRange();
      if (rangeCompleto && rangeCompleto.getNumRows() > 0) {
        rangeCompleto.setFontFamily('Arial')
                     .setFontSize(10)
                     .setVerticalAlignment('middle');
      }
      
    } catch (error) {
      Logger.log(`⚠️ Error aplicando formato: ${error.message}`);
    }
  }
}

// =====================================
// 📈 MÓDULO: CALCULADOR DE ESTADÍSTICAS
// =====================================

const CalculadorEstadisticas = {
  calcular(worklogsPorPersona, worklogs) {
    const totalHoras = worklogs.reduce((sum, worklog) => sum + worklog.timeSpentHours, 0);
    return {
      resumen: `👥 Total de personas: ${Object.keys(worklogsPorPersona.personas).length}\n📊 Total de registros: ${worklogs.length}\n⏱️ Total de horas: ${totalHoras.toFixed(2)}h\n🕐 Generado: ${new Date().toLocaleString()}`
    };
  }
};