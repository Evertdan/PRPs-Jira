// =====================================
// ARCHIVO 17: PROCESAMIENTO DE DATOS DE PROYECTOS SIMPLES
// =====================================

/**
 * Procesa la lista de proyectos para extraer solo los campos necesarios para el reporte simple.
 * @param {Object[]} proyectos - La lista de todos los proyectos de Jira.
 * @returns {Object[]} Una lista de objetos, cada uno representando una fila del reporte.
 */
function procesarDatosDeProyectosSimples(proyectos) {
  return proyectos.map(proyecto => {
    const estado = construirEstadoProyecto(proyecto);
    const avatarId = extraerAvatarId(proyecto.avatarUrls);
    const tiposDeIncidencia = (proyecto.issueTypes || []).map(it => it.name).join(', ') || 'N/A';

    return {
      id: proyecto.id,
      clave: proyecto.key,
      nombre: proyecto.name,
      tipoProyecto: proyecto.projectTypeKey,
      estilo: proyecto.style,
      estado: estado,
      avatarId: avatarId,
      tiposDeIncidencia: tiposDeIncidencia
    };
  });
}

/**
 * Construye una cadena de texto para el estado del proyecto.
 * @param {Object} proyecto - El objeto del proyecto de Jira.
 * @returns {string} El estado construido.
 */
function construirEstadoProyecto(proyecto) {
  let estado = [];
  if (proyecto.archived) {
    estado.push("Archivado");
  } else {
    estado.push("Activo");
  }
  if (proyecto.isPrivate) {
    estado.push("privado");
  } else {
    estado.push("(no privado)");
  }
  return estado.join(' ');
}

/**
 * Extrae el ID del avatar de las URLs proporcionadas.
 * @param {Object} avatarUrls - El objeto con las URLs de los avatares.
 * @returns {string} El ID del avatar o 'N/A'.
 */
function extraerAvatarId(avatarUrls) {
  if (!avatarUrls || !avatarUrls['48x48']) {
    return 'N/A';
  }
  try {
    // Ejemplo de URL: https://.../rest/api/3/universal_avatar/view/type/project/avatar/10416
    const url = avatarUrls['48x48'];
    const parts = url.split('/');
    const avatarId = parts[parts.length - 1].split('?')[0]; // Toma la última parte de la ruta
    return /\d+/.test(avatarId) ? avatarId : 'N/A';
  } catch (e) {
    return 'N/A';
  }
}
