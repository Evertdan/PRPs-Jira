// Contenido de 4_Analisis_Entregables.gs (sin cambios, ya que es lógica pura)
// Simplemente lo movemos a la librería para que sea reutilizable.
// =====================================
// ARCHIVO 4: ANÁLISIS DE ENTREGABLES
// =====================================

/**
 * ✅ FUNCIÓN PRINCIPAL: Evalúa los entregables y la evidencia de una tarea de Jira.
 * Esta función centraliza el análisis de diferentes fuentes de evidencia como adjuntos, comentarios, etc.
 * @param {Object} tarea - El objeto de la tarea de Jira obtenido de la API.
 * @returns {Object} Un objeto con el análisis completo de los entregables, incluyendo puntuación y resumen.
 */
function evaluarEntregablesYEvidencia(tarea) {
  Logger.log(`🔍 Analizando entregables para tarea: ${tarea.key}`);
  
  // Objeto para almacenar los resultados del análisis.
  const evidencias = {
    archivos: [],
    imagenes: [],
    enlaces: [],
    pullRequests: [],
    commits: [],
    comentarios: [],
    documentos: [],
    puntuacion: 0,
    detalles: []
  };

  try {
    // 1. ✅ Analiza los archivos adjuntos a la tarea.
    analizarArchivosAdjuntos(tarea, evidencias);
    
    // 2. ✅ Analiza los comentarios en busca de enlaces, PRs, commits, etc.
    analizarComentarios(tarea, evidencias);
    
    // 3. ✅ Analiza la descripción de la tarea en busca de enlaces.
    analizarDescripcion(tarea, evidencias);
    
    // 4. ✅ Analiza campos personalizados que puedan contener evidencia.
    analizarCamposPersonalizados(tarea, evidencias);
    
    // 5. ✅ Analiza los enlaces remotos (ej. Confluence, Bitbucket).
    analizarEnlacesRemotos(tarea, evidencias);
    
    // 6. ✅ Calcula la calidad general de la evidencia basada en la puntuación.
    const calidad = evaluarCalidadEntregables(evidencias);
    
    // 7. ✅ Genera un resumen textual de la evidencia encontrada.
    const resumen = generarResumenEntregables(evidencias);
    
    Logger.log(`✅ Análisis completado para ${tarea.key}: ${calidad.nivel} (${evidencias.puntuacion} puntos)`);
    
    // Devuelve un objeto completo con todos los datos del análisis.
    return {
      ...evidencias,
      calidad: calidad,
      resumen: resumen,
      metadata: {
        tareaKey: tarea.key,
        fechaAnalisis: new Date().toISOString(),
        totalElementos: evidencias.archivos.length + evidencias.comentarios.length + evidencias.enlaces.length
      }
    };
    
  } catch (error) {
    Logger.log(`❌ Error analizando entregables para ${tarea.key}: ${error.message}`);
    // En caso de error, devuelve un objeto de análisis vacío con el mensaje de error.
    return crearAnalisisVacio(tarea.key, error.message);
  }
}

/**
 * ✅ Analiza los archivos adjuntos de una tarea y actualiza el objeto de evidencias.
 * @param {Object} tarea - El objeto de la tarea de Jira.
 * @param {Object} evidencias - El objeto donde se acumulan los resultados del análisis.
 */
function analizarArchivosAdjuntos(tarea, evidencias) {
  if (!tarea.fields.attachment || !Array.isArray(tarea.fields.attachment)) {
    return;
  }
  
  Logger.log(`📎 Analizando ${tarea.fields.attachment.length} archivos adjuntos...`);
  
  tarea.fields.attachment.forEach(attachment => {
    const tipoArchivo = clasificarTipoArchivo(attachment.filename);
    const info = {
      tipo: 'adjunto',
      nombre: attachment.filename,
      url: attachment.content || attachment.url,
      tamaño: attachment.size || 0,
      tamañoHumano: formatearTamaño(attachment.size || 0),
      mimeType: attachment.mimeType || 'unknown',
      autor: attachment.author ? attachment.author.displayName : 'Desconocido',
      fecha: attachment.created,
      categoria: tipoArchivo.categoria,
      esImagen: tipoArchivo.esImagen
    };
    
    evidencias.archivos.push(info);
    
    // Asigna una puntuación mayor a las imágenes.
    if (tipoArchivo.esImagen) {
      evidencias.imagenes.push(info);
      evidencias.puntuacion += CONFIG_ENTREGABLES.PESOS.ARCHIVO_ADJUNTO + 1; // Bonus para imágenes
      evidencias.detalles.push(`📷 Imagen: ${attachment.filename}`);
    } else {
      evidencias.puntuacion += CONFIG_ENTREGABLES.PESOS.ARCHIVO_ADJUNTO;
      evidencias.detalles.push(`📎 Archivo: ${attachment.filename} (${tipoArchivo.categoria})`);
    }
  });
}

/**
 * ✅ Analiza los comentarios de una tarea en busca de evidencia como PRs, commits y enlaces.
 * @param {Object} tarea - El objeto de la tarea de Jira.
 * @param {Object} evidencias - El objeto donde se acumulan los resultados del análisis.
 */
function analizarComentarios(tarea, evidencias) {
  if (!tarea.fields.comment || !tarea.fields.comment.comments) {
    return;
  }
  
  Logger.log(`💬 Analizando ${tarea.fields.comment.comments.length} comentarios...`);
  
  tarea.fields.comment.comments.forEach(comentario => {
    const textoComentario = JSON.stringify(comentario.body || '').toLowerCase();
    const textoOriginal = comentario.body || '';
    
    const infoComentario = {
      id: comentario.id,
      autor: comentario.author ? comentario.author.displayName : 'Desconocido',
      fecha: comentario.created,
      contenido: textoOriginal.substring(0, 200), // Primeros 200 caracteres
      longitud: textoOriginal.length
    };
    
    evidencias.comentarios.push(infoComentario);
    
    // Detecta Pull Requests por palabras clave y URLs.
    if (textoComentario.includes('bitbucket.org') || 
        textoComentario.includes('pull-request') ||
        textoComentario.includes('merge') ||
        textoComentario.includes('/pull/')) {
      evidencias.pullRequests.push({
        ...infoComentario,
        tipo: 'pull_request'
      });
      evidencias.puntuacion += CONFIG_ENTREGABLES.PESOS.PULL_REQUEST;
      evidencias.detalles.push(`🔀 Pull Request detectado en comentario`);
    }
    
    // Detecta Commits por palabras clave y URLs.
    if (textoComentario.includes('commit') ||
        textoComentario.includes('repository') ||
        textoComentario.includes('github.com') ||
        textoComentario.includes('gitlab.com')) {
      evidencias.commits.push({
        ...infoComentario,
        tipo: 'commit'
      });
      evidencias.puntuacion += CONFIG_ENTREGABLES.PESOS.COMMIT;
      evidencias.detalles.push(`📝 Commit/Repository detectado en comentario`);
    }
    
    // Extrae enlaces externos usando una expresión regular.
    const urlRegex = /(https?:\/\/[^\s\)]+)/g;
    const enlaces = textoOriginal.match(urlRegex);
    if (enlaces && enlaces.length > 0) {
      enlaces.forEach(url => {
        evidencias.enlaces.push({
          url: url.replace(/[.,;)]+$/, ''), // Limpia la puntuación al final de la URL.
          contexto: textoOriginal.substring(0, 100),
          autor: infoComentario.autor,
          fecha: infoComentario.fecha,
          fuente: 'comentario'
        });
        evidencias.puntuacion += CONFIG_ENTREGABLES.PESOS.ENLACE_EXTERNO;
        evidencias.detalles.push(`🔗 Enlace: ${url.substring(0, 50)}...`);
      });
    }
    
    // Otorga una bonificación por comentarios detallados.
    if (textoOriginal.length > 100) {
      evidencias.puntuacion += CONFIG_ENTREGABLES.PESOS.COMENTARIO_DETALLADO;
      evidencias.detalles.push(`📝 Comentario detallado (${textoOriginal.length} chars)`);
    }
  });
}

/**
 * ✅ Analiza la descripción de la tarea en busca de enlaces.
 * @param {Object} tarea - El objeto de la tarea de Jira.
 * @param {Object} evidencias - El objeto donde se acumulan los resultados del análisis.
 */
function analizarDescripcion(tarea, evidencias) {
  if (!tarea.fields.description) {
    return;
  }
  
  const descripcion = tarea.fields.description;
  Logger.log(`📄 Analizando descripción (${descripcion.length} caracteres)...`);
  
  // Extrae enlaces de la descripción.
  const urlRegex = /(https?:\/\/[^\s\)]+)/g;
  const enlaces = descripcion.match(urlRegex);
  
  if (enlaces && enlaces.length > 0) {
    enlaces.forEach(url => {
      evidencias.enlaces.push({
        url: url.replace(/[.,;)]+$/, ''),
        contexto: 'Descripción de la tarea',
        fuente: 'descripcion'
      });
      evidencias.puntuacion += CONFIG_ENTREGABLES.PESOS.ENLACE_EXTERNO;
      evidencias.detalles.push(`🔗 Enlace en descripción: ${url.substring(0, 50)}...`);
    });
  }
  
  // Otorga una bonificación por descripciones detalladas.
  if (descripcion.length > 200) {
    evidencias.puntuacion += CONFIG_ENTREGABLES.PESOS.COMENTARIO_DETALLADO;
    evidencias.detalles.push(`📝 Descripción detallada (${descripcion.length} chars)`);
  }
}

/**
 * ✅ Analiza campos personalizados específicos en busca de texto que pueda ser evidencia.
 * @param {Object} tarea - El objeto de la tarea de Jira.
 * @param {Object} evidencias - El objeto donde se acumulan los resultados del análisis.
 */
function analizarCamposPersonalizados(tarea, evidencias) {
  // Analiza el campo personalizado de comentarios.
  if (tarea.fields[CAMPOS_ENTREGABLES.comentarios]) {
    const comentariosExtra = tarea.fields[CAMPOS_ENTREGABLES.comentarios];
    if (comentariosExtra && comentariosExtra.length > 0) {
      evidencias.documentos.push({
        tipo: 'campo_personalizado',
        contenido: comentariosExtra.substring(0, 200),
        campo: 'comentarios',
        longitud: comentariosExtra.length
      });
      evidencias.puntuacion += CONFIG_ENTREGABLES.PESOS.CAMPO_PERSONALIZADO;
      evidencias.detalles.push(`📋 Campo comentarios personalizado`);
    }
  }
  
  // Analiza el campo personalizado de desviaciones.
  if (tarea.fields[CAMPOS_ENTREGABLES.desviaciones]) {
    const desviaciones = tarea.fields[CAMPOS_ENTREGABLES.desviaciones];
    if (desviaciones && desviaciones.length > 0) {
      evidencias.documentos.push({
        tipo: 'desviaciones',
        contenido: desviaciones.substring(0, 200),
        campo: 'desviaciones',
        longitud: desviaciones.length
      });
      evidencias.puntuacion += CONFIG_ENTREGABLES.PESOS.CAMPO_PERSONALIZADO;
      evidencias.detalles.push(`⚠️ Campo desviaciones con contenido`);
    }
  }
}

/**
 * ✅ Analiza los enlaces remotos (remotelinks) de una tarea.
 * @param {Object} tarea - El objeto de la tarea de Jira.
 * @param {Object} evidencias - El objeto donde se acumulan los resultados del análisis.
 */
function analizarEnlacesRemotos(tarea, evidencias) {
  if (tarea.fields.remotelinks && Array.isArray(tarea.fields.remotelinks)) {
    tarea.fields.remotelinks.forEach(link => {
      evidencias.enlaces.push({
        url: link.object ? link.object.url : 'URL no disponible',
        titulo: link.object ? link.object.title : 'Sin título',
        fuente: 'remote_link'
      });
      evidencias.puntuacion += CONFIG_ENTREGABLES.PESOS.ENLACE_EXTERNO;
      evidencias.detalles.push(`🔗 Enlace remoto: ${link.object ? link.object.title : 'Sin título'}`);
    });
  }
}

/**
 * ✅ Evalúa la calidad de los entregables basándose en la puntuación total acumulada.
 * @param {Object} evidencias - El objeto de evidencias con la puntuación.
 * @returns {Object} El nivel de calidad correspondiente de la configuración.
 */
function evaluarCalidadEntregables(evidencias) {
  const puntuacion = evidencias.puntuacion;
  
  for (const [nivel, config] of Object.entries(CONFIG_ENTREGABLES.NIVELES)) {
    if (puntuacion >= config.min) {
      return {
        nivel: nivel,
        texto: config.texto,
        color: config.color,
        emoji: config.emoji,
        puntuacion: puntuacion
      };
    }
  }
  
  return CONFIG_ENTREGABLES.NIVELES.SIN_EVIDENCIA;
}

/**
 * ✅ Genera un resumen textual de la evidencia encontrada.
 * @param {Object} evidencias - El objeto de evidencias.
 * @returns {string} Una cadena de texto con el resumen.
 */
function generarResumenEntregables(evidencias) {
  const elementos = [];
  
  if (evidencias.archivos.length > 0) {
    const imagenes = evidencias.imagenes.length;
    if (imagenes > 0) {
      elementos.push(`${evidencias.archivos.length} archivo(s) (${imagenes} imagen/es)`);
    } else {
      elementos.push(`${evidencias.archivos.length} archivo(s)`);
    }
  }
  
  if (evidencias.pullRequests.length > 0) {
    elementos.push(`${evidencias.pullRequests.length} PR(s)`);
  }
  
  if (evidencias.commits.length > 0) {
    elementos.push(`${evidencias.commits.length} commit(s)`);
  }
  
  if (evidencias.enlaces.length > 0) {
    elementos.push(`${evidencias.enlaces.length} enlace(s)`);
  }
  
  if (evidencias.comentarios.length > 0) {
    elementos.push(`${evidencias.comentarios.length} comentario(s)`);
  }
  
  return elementos.length > 0 ? elementos.join(', ') : 'Sin entregables';
}

/**
 * ✅ Crea un objeto de análisis vacío para ser usado en caso de error.
 * @param {string} tareaKey - La clave de la tarea.
 * @param {string} error - El mensaje de error.
 * @returns {Object} Un objeto de análisis vacío.
 */
function crearAnalisisVacio(tareaKey, error) {
  return {
    archivos: [],
    imagenes: [],
    enlaces: [],
    pullRequests: [],
    commits: [],
    comentarios: [],
    documentos: [],
    puntuacion: 0,
    detalles: [`Error: ${error}`],
    calidad: CONFIG_ENTREGABLES.NIVELES.SIN_EVIDENCIA,
    resumen: 'Error en análisis',
    metadata: {
      tareaKey: tareaKey,
      fechaAnalisis: new Date().toISOString(),
      error: error
    }
  };
}
