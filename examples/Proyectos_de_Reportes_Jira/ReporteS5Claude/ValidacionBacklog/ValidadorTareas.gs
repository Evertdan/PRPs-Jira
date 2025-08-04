// =====================================
// UTILIDADES - VALIDADOR DE TAREAS
// =====================================

/**
 * Clase principal para validación de tareas del backlog
 */
class ValidadorTareasBacklog {
  
  /**
   * Valida una tarea individual según todos los criterios
   * @param {Object} tarea - Tarea de Jira a validar
   * @returns {Object} Resultado completo de validación
   */
  static validarTarea(tarea) {
    const validacion = {
      tiempoEstimado: false,
      etiquetaSemana: false,
      fechaVencimiento: false,
      alineacionFecha: false,
      puntaje: 0,
      detalles: [],
      recomendaciones: [],
      semanaEtiqueta: null,
      valorTiempo: null,
      tipoTiempo: null
    };
    
    try {
      // 1. Validar tiempo estimado
      this._validarTiempoEstimado(tarea, validacion);
      
      // 2. Validar etiqueta de semana
      this._validarEtiquetaSemana(tarea, validacion);
      
      // 3. Validar fecha de vencimiento
      this._validarFechaVencimiento(tarea, validacion);
      
      // 4. Validar alineación fecha-etiqueta (solo si ambos existen)
      if (validacion.fechaVencimiento && validacion.etiquetaSemana) {
        this._validarAlineacionFecha(tarea, validacion);
      }
      
      // 5. Determinar estado general
      this._determinarEstadoGeneral(validacion);
      
      return validacion;
      
    } catch (error) {
      Logger.log(`❌ Error validando tarea ${tarea.key}: ${error.message}`);
      return this._crearValidacionError(tarea.key, error.message);
    }
  }
  
  /**
   * Valida el tiempo estimado (Story Points o Horas)
   */
  static _validarTiempoEstimado(tarea, validacion) {
    const config = CONFIG_VALIDACION_BACKLOG.CRITERIOS.tiempoEstimado;
    
    // Obtener Story Points
    const storyPoints = tarea.fields[config.storyPoints];
    
    // Obtener horas originales
    const horasOriginales = tarea.fields.timetracking?.originalEstimateSeconds;
    
    // Priorizar Story Points según configuración
    if (config.prioridadStoryPoints && storyPoints && storyPoints > 0) {
      validacion.tiempoEstimado = true;
      validacion.puntaje += CONFIG_VALIDACION_BACKLOG.PUNTAJES.tiempoEstimado;
      validacion.valorTiempo = storyPoints;
      validacion.tipoTiempo = 'Story Points';
      validacion.detalles.push(`${MENSAJES_SISTEMA.validaciones.tiempoEstimado.valido}: ${storyPoints} SP`);
      
    } else if (horasOriginales && horasOriginales > 0) {
      const horas = Math.round(horasOriginales / 3600 * 100) / 100; // Redondear a 2 decimales
      validacion.tiempoEstimado = true;
      validacion.puntaje += CONFIG_VALIDACION_BACKLOG.PUNTAJES.tiempoEstimado;
      validacion.valorTiempo = horas;
      validacion.tipoTiempo = 'Horas';
      validacion.detalles.push(`${MENSAJES_SISTEMA.validaciones.tiempoEstimado.valido}: ${horas}h`);
      
    } else {
      validacion.detalles.push(MENSAJES_SISTEMA.validaciones.tiempoEstimado.invalido);
      validacion.recomendaciones.push(MENSAJES_SISTEMA.validaciones.tiempoEstimado.recomendacion);
    }
  }
  
  /**
   * Valida la etiqueta de semana
   */
  static _validarEtiquetaSemana(tarea, validacion) {
    const config = CONFIG_VALIDACION_BACKLOG.CRITERIOS.etiquetasSemana;
    const etiquetas = tarea.fields.labels || [];
    
    // Buscar etiqueta de semana válida
    const etiquetaSemana = etiquetas.find(label => config.patron.test(label));
    
    if (etiquetaSemana) {
      validacion.etiquetaSemana = true;
      validacion.puntaje += CONFIG_VALIDACION_BACKLOG.PUNTAJES.etiquetaSemana;
      validacion.semanaEtiqueta = etiquetaSemana;
      validacion.detalles.push(`${MENSAJES_SISTEMA.validaciones.etiquetaSemana.valido}: ${etiquetaSemana}`);
    } else {
      validacion.detalles.push(MENSAJES_SISTEMA.validaciones.etiquetaSemana.invalido);
      validacion.recomendaciones.push(MENSAJES_SISTEMA.validaciones.etiquetaSemana.recomendacion);
      
      // Sugerir etiqueta basada en fecha si existe
      if (tarea.fields.duedate) {
        const sugerencia = this._sugerirEtiquetaSemana(tarea.fields.duedate);
        if (sugerencia) {
          validacion.recomendaciones.push(`Sugerencia: Usar ${sugerencia} basado en fecha vencimiento`);
        }
      }
    }
  }
  
  /**
   * Valida la fecha de vencimiento
   */
  static _validarFechaVencimiento(tarea, validacion) {
    const fechaVencimiento = tarea.fields.duedate;
    
    if (fechaVencimiento) {
      const fecha = new Date(fechaVencimiento);
      const hoy = new Date();
      hoy.setHours(0, 0, 0, 0); // Solo comparar fechas, no horas
      
      // Verificar que la fecha no sea del pasado
      if (fecha >= hoy) {
        validacion.fechaVencimiento = true;
        validacion.puntaje += CONFIG_VALIDACION_BACKLOG.PUNTAJES.fechaVencimiento;
        validacion.detalles.push(`${MENSAJES_SISTEMA.validaciones.fechaVencimiento.valido}: ${this._formatearFecha(fecha)}`);
      } else {
        validacion.detalles.push(`❌ Fecha de vencimiento en el pasado: ${this._formatearFecha(fecha)}`);
        validacion.recomendaciones.push('Actualizar fecha de vencimiento a fecha futura');
      }
    } else {
      validacion.detalles.push(MENSAJES_SISTEMA.validaciones.fechaVencimiento.invalido);
      validacion.recomendaciones.push(MENSAJES_SISTEMA.validaciones.fechaVencimiento.recomendacion);
    }
  }
  
  /**
   * Valida la alineación entre fecha y etiqueta de semana
   */
  static _validarAlineacionFecha(tarea, validacion) {
    const fechaVencimiento = new Date(tarea.fields.duedate);
    const etiquetaSemana = validacion.semanaEtiqueta;
    
    const alineacion = this._calcularAlineacionFecha(fechaVencimiento, etiquetaSemana);
    
    if (alineacion.valida) {
      validacion.alineacionFecha = true;
      validacion.puntaje += CONFIG_VALIDACION_BACKLOG.PUNTAJES.alineacionFecha;
      validacion.detalles.push(`${MENSAJES_SISTEMA.validaciones.alineacionFecha.valido} (${etiquetaSemana})`);
    } else {
      validacion.detalles.push(`${MENSAJES_SISTEMA.validaciones.alineacionFecha.invalido}: ${alineacion.mensaje}`);
      validacion.recomendaciones.push(alineacion.recomendacion);
    }
  }
  
  /**
   * Calcula si una fecha está alineada con la etiqueta de semana
   */
  static _calcularAlineacionFecha(fechaVencimiento, etiquetaSemana) {
    try {
      const numeroSemana = parseInt(etiquetaSemana.split('_')[1]);
      
      // Calcular inicio de la semana actual (lunes)
      const hoy = new Date();
      const inicioSemanaActual = new Date(hoy);
      const diasParaLunes = (hoy.getDay() + 6) % 7; // 0 = lunes
      inicioSemanaActual.setDate(hoy.getDate() - diasParaLunes);
      inicioSemanaActual.setHours(0, 0, 0, 0);
      
      // Calcular el rango de la semana correspondiente a la etiqueta
      const inicioSemanaEtiqueta = new Date(inicioSemanaActual);
      inicioSemanaEtiqueta.setDate(inicioSemanaActual.getDate() + ((numeroSemana - 1) * 7));
      
      const finSemanaEtiqueta = new Date(inicioSemanaEtiqueta);
      finSemanaEtiqueta.setDate(inicioSemanaEtiqueta.getDate() + 6);
      finSemanaEtiqueta.setHours(23, 59, 59, 999);
      
      // Verificar si la fecha está en el rango
      if (fechaVencimiento >= inicioSemanaEtiqueta && fechaVencimiento <= finSemanaEtiqueta) {
        return {
          valida: true,
          mensaje: `Fecha dentro del rango de ${etiquetaSemana}`,
          recomendacion: null
        };
      }
      
      // Determinar recomendación específica
      let recomendacion;
      if (fechaVencimiento < inicioSemanaEtiqueta) {
        const semanaSugerida = this._calcularSemanaParaFecha(fechaVencimiento);
        recomendacion = `Cambiar a ${semanaSugerida} o postergar fecha`;
      } else {
        const semanaSugerida = this._calcularSemanaParaFecha(fechaVencimiento);
        recomendacion = `Cambiar a ${semanaSugerida} o adelantar fecha`;
      }
      
      const diasDiferencia = Math.round((fechaVencimiento - inicioSemanaEtiqueta) / (1000 * 60 * 60 * 24));
      
      return {
        valida: false,
        mensaje: `Fecha fuera del rango de ${etiquetaSemana} (${diasDiferencia} días de diferencia)`,
        recomendacion: recomendacion
      };
      
    } catch (error) {
      Logger.log(`❌ Error calculando alineación: ${error.message}`);
      return {
        valida: false,
        mensaje: 'Error calculando alineación',
        recomendacion: 'Verificar manualmente fecha y etiqueta'
      };
    }
  }
  
  /**
   * Sugiere una etiqueta de semana basada en una fecha
   */
  static _sugerirEtiquetaSemana(fechaVencimiento) {
    try {
      const semana = this._calcularSemanaParaFecha(new Date(fechaVencimiento));
      return semana;
    } catch (error) {
      return null;
    }
  }
  
  /**
   * Calcula qué etiqueta de semana corresponde a una fecha dada
   */
  static _calcularSemanaParaFecha(fecha) {
    const hoy = new Date();
    const inicioSemanaActual = new Date(hoy);
    const diasParaLunes = (hoy.getDay() + 6) % 7;
    inicioSemanaActual.setDate(hoy.getDate() - diasParaLunes);
    inicioSemanaActual.setHours(0, 0, 0, 0);
    
    const diasDiferencia = Math.floor((fecha - inicioSemanaActual) / (1000 * 60 * 60 * 24));
    const numeroSemana = Math.floor(diasDiferencia / 7) + 1;
    
    if (numeroSemana >= 1 && numeroSemana <= 5) {
      return `SEMANA_${numeroSemana}`;
    }
    
    return null;
  }
  
  /**
   * Determina el estado general de la validación
   */
  static _determinarEstadoGeneral(validacion) {
    const umbrales = CONFIG_VALIDACION_BACKLOG.UMBRALES;
    
    if (validacion.puntaje >= umbrales.excelente) {
      validacion.estado = MENSAJES_SISTEMA.estados.excelente;
    } else if (validacion.puntaje >= umbrales.bueno) {
      validacion.estado = MENSAJES_SISTEMA.estados.bueno;
    } else if (validacion.puntaje >= umbrales.aceptable) {
      validacion.estado = MENSAJES_SISTEMA.estados.aceptable;
    } else {
      validacion.estado = MENSAJES_SISTEMA.estados.critico;
    }
  }
  
  /**
   * Crea una validación de error para casos de fallo
   */
  static _crearValidacionError(claveTask, mensajeError) {
    return {
      tiempoEstimado: false,
      etiquetaSemana: false,
      fechaVencimiento: false,
      alineacionFecha: false,
      puntaje: 0,
      detalles: [`❌ Error validando tarea: ${mensajeError}`],
      recomendaciones: ['Revisar configuración y datos de la tarea'],
      semanaEtiqueta: null,
      valorTiempo: null,
      tipoTiempo: null,
      estado: { emoji: '⚠️', texto: 'Error', color: '#ffcdd2' }
    };
  }
  
  /**
   * Formatea una fecha para mostrar
   */
  static _formatearFecha(fecha) {
    return Utilities.formatDate(fecha, Session.getScriptTimeZone(), "dd/MM/yyyy");
  }
}

/**
 * Clase para procesamiento en lote de tareas
 */
class ProcesadorLoteTareas {
  
  /**
   * Procesa múltiples tareas y genera estadísticas
   * @param {Array} tareas - Array de tareas de Jira
   * @returns {Object} Resultados completos del procesamiento
   */
  static procesarLoteTareas(tareas) {
    const resultados = {
      tareas: [],
      resumen: this._inicializarResumen(tareas.length),
      porEquipo: {},
      porSemana: {},
      porProyecto: {},
      estadisticas: this._inicializarEstadisticas()
    };
    
    // Procesar cada tarea
    tareas.forEach(tarea => {
      try {
        const validacion = ValidadorTareasBacklog.validarTarea(tarea);
        
        // Agregar información contextual
        const tareaConValidacion = {
          ...tarea,
          validacion: validacion,
          area: this._determinarAreaTarea(tarea.fields.project.key),
          responsable: this._obtenerResponsable(tarea),
          projectName: tarea.fields.project.name,
          issueTypeName: tarea.fields.issuetype.name
        };
        
        resultados.tareas.push(tareaConValidacion);
        
        // Actualizar contadores y agrupaciones
        this._actualizarContadores(resultados.resumen, validacion);
        this._agruparPorEquipo(resultados.porEquipo, tareaConValidacion);
        this._agruparPorSemana(resultados.porSemana, tareaConValidacion);
        this._agruparPorProyecto(resultados.porProyecto, tareaConValidacion);
        this._actualizarEstadisticas(resultados.estadisticas, tareaConValidacion);
        
      } catch (error) {
        Logger.log(`❌ Error procesando tarea ${tarea.key}: ${error.message}`);
      }
    });
    
    // Calcular porcentajes finales
    this._calcularPorcentajesFinales(resultados);
    
    return resultados;
  }
  
  /**
   * Inicializa el resumen de resultados
   */
  static _inicializarResumen(totalTareas) {
    return {
      total: totalTareas,
      validasCompletas: 0,
      sinTiempoEstimado: 0,
      sinEtiquetaSemana: 0,
      sinFechaVencimiento: 0,
      fechaDesalineada: 0,
      fechaGeneracion: new Date()
    };
  }
  
  /**
   * Inicializa estadísticas adicionales
   */
  static _inicializarEstadisticas() {
    return {
      distribucionPuntajes: { excelente: 0, bueno: 0, aceptable: 0, critico: 0 },
      tiposEstimacion: { storyPoints: 0, horas: 0, sinEstimacion: 0 },
      distribucionSemanal: {},
      promedioCompletitud: 0
    };
  }
  
  /**
   * Determina el área de una tarea según su proyecto
   */
  static _determinarAreaTarea(projectKey) {
    const proyectoInfo = ORGANIZACION_CCSOFT.PROYECTOS[projectKey];
    return proyectoInfo ? proyectoInfo.area : "OTROS";
  }
  
  /**
   * Obtiene el responsable de una tarea
   */
  static _obtenerResponsable(tarea) {
    if (tarea.fields.assignee) {
      return tarea.fields.assignee.displayName;
    }
    return 'Sin asignar';
  }
  
  /**
   * Actualiza contadores del resumen
   */
  static _actualizarContadores(resumen, validacion) {
    if (validacion.puntaje === CONFIG_VALIDACION_BACKLOG.PUNTAJES.maxPuntaje) {
      resumen.validasCompletas++;
    }
    if (!validacion.tiempoEstimado) resumen.sinTiempoEstimado++;
    if (!validacion.etiquetaSemana) resumen.sinEtiquetaSemana++;
    if (!validacion.fechaVencimiento) resumen.sinFechaVencimiento++;
    if (validacion.fechaVencimiento && !validacion.alineacionFecha) resumen.fechaDesalineada++;
  }
  
  /**
   * Agrupa tareas por equipo/área
   */
  static _agruparPorEquipo(porEquipo, tarea) {
    const area = tarea.area;
    
    if (!porEquipo[area]) {
      porEquipo[area] = {
        total: 0,
        validasCompletas: 0,
        sinTiempoEstimado: 0,
        sinEtiquetaSemana: 0,
        sinFechaVencimiento: 0,
        tareas: [],
        proyectos: new Set()
      };
    }
    
    porEquipo[area].total++;
    porEquipo[area].tareas.push(tarea);
    porEquipo[area].proyectos.add(tarea.fields.project.key);
    
    if (tarea.validacion.puntaje === CONFIG_VALIDACION_BACKLOG.PUNTAJES.maxPuntaje) {
      porEquipo[area].validasCompletas++;
    }
    if (!tarea.validacion.tiempoEstimado) porEquipo[area].sinTiempoEstimado++;
    if (!tarea.validacion.etiquetaSemana) porEquipo[area].sinEtiquetaSemana++;
    if (!tarea.validacion.fechaVencimiento) porEquipo[area].sinFechaVencimiento++;
  }
  
  /**
   * Agrupa tareas por semana
   */
  static _agruparPorSemana(porSemana, tarea) {
    const semana = tarea.validacion.semanaEtiqueta || 'Sin_Etiqueta';
    
    if (!porSemana[semana]) {
      porSemana[semana] = {
        total: 0,
        validasCompletas: 0,
        proyectos: [],
        responsables: [],
        tareas: []
      };
    }
    
    porSemana[semana].total++;
    porSemana[semana].tareas.push(tarea);
    porSemana[semana].proyectos.push(tarea.fields.project.key);
    porSemana[semana].responsables.push(tarea.responsable);
    
    if (tarea.validacion.puntaje === CONFIG_VALIDACION_BACKLOG.PUNTAJES.maxPuntaje) {
      porSemana[semana].validasCompletas++;
    }
  }
  
  /**
   * Agrupa tareas por proyecto
   */
  static _agruparPorProyecto(porProyecto, tarea) {
    const proyecto = tarea.fields.project.key;
    
    if (!porProyecto[proyecto]) {
      porProyecto[proyecto] = {
        total: 0,
        validasCompletas: 0,
        tareas: [],
        area: tarea.area
      };
    }
    
    porProyecto[proyecto].total++;
    porProyecto[proyecto].tareas.push(tarea);
    
    if (tarea.validacion.puntaje === CONFIG_VALIDACION_BACKLOG.PUNTAJES.maxPuntaje) {
      porProyecto[proyecto].validasCompletas++;
    }
  }
  
  /**
   * Actualiza estadísticas adicionales
   */
  static _actualizarEstadisticas(estadisticas, tarea) {
    const validacion = tarea.validacion;
    
    // Distribución por puntajes
    if (validacion.puntaje >= CONFIG_VALIDACION_BACKLOG.UMBRALES.excelente) {
      estadisticas.distribucionPuntajes.excelente++;
    } else if (validacion.puntaje >= CONFIG_VALIDACION_BACKLOG.UMBRALES.bueno) {
      estadisticas.distribucionPuntajes.bueno++;
    } else if (validacion.puntaje >= CONFIG_VALIDACION_BACKLOG.UMBRALES.aceptable) {
      estadisticas.distribucionPuntajes.aceptable++;
    } else {
      estadisticas.distribucionPuntajes.critico++;
    }
    
    // Tipos de estimación
    if (validacion.tipoTiempo === 'Story Points') {
      estadisticas.tiposEstimacion.storyPoints++;
    } else if (validacion.tipoTiempo === 'Horas') {
      estadisticas.tiposEstimacion.horas++;
    } else {
      estadisticas.tiposEstimacion.sinEstimacion++;
    }
    
    // Distribución semanal
    const semana = validacion.semanaEtiqueta || 'Sin_Etiqueta';
    estadisticas.distribucionSemanal[semana] = (estadisticas.distribucionSemanal[semana] || 0) + 1;
  }
  
  /**
   * Calcula porcentajes finales
   */
  static _calcularPorcentajesFinales(resultados) {
    const resumen = resultados.resumen;
    
    if (resumen.total === 0) return;
    
    resumen.porcentajeValidas = Math.round((resumen.validasCompletas / resumen.total) * 100);
    resumen.porcentajeSinTiempo = Math.round((resumen.sinTiempoEstimado / resumen.total) * 100);
    resumen.porcentajeSinEtiqueta = Math.round((resumen.sinEtiquetaSemana / resumen.total) * 100);
    resumen.porcentajeSinFecha = Math.round((resumen.sinFechaVencimiento / resumen.total) * 100);
    resumen.porcentajeDesalineada = Math.round((resumen.fechaDesalineada / resumen.total) * 100);
    
    // Promedio de completitud
    const sumaCompletitud = resultados.tareas.reduce((suma, tarea) => suma + tarea.validacion.puntaje, 0);
    resultados.estadisticas.promedioCompletitud = Math.round(sumaCompletitud / resumen.total);
  }
}

Logger.log('✅ ValidadorTareasBacklog y ProcesadorLoteTareas cargados');