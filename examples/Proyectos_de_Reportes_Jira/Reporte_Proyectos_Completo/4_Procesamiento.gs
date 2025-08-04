// =====================================
// ARCHIVO 12: PROCESAMIENTO DE DATOS DE PROYECTOS
// =====================================

/**
 * Itera sobre cada proyecto para obtener y estructurar sus épicas y tareas.
 * @param {Object[]} proyectos - La lista de todos los proyectos de Jira.
 * @returns {Object[]} La lista de proyectos con un nuevo atributo 'epicas' que contiene las tareas.
 */
function procesarProyectosConEpicasYTareas(proyectos) {
  return proyectos.map(proyecto => {
    Logger.log(`Procesando proyecto: ${proyecto.key}`);
    
    // 1. Obtener todas las incidencias del proyecto.
    const incidencias = obtenerIncidenciasDeProyecto(proyecto.key);
    
    // 2. Estructurar las incidencias en épicas y tareas.
    const estructura = organizarEpicasYTareas(incidencias);
    
    // 3. Obtener los tipos de incidencia del proyecto.
    const tiposDeIncidencia = obtenerNombresTiposDeIncidencia(proyecto.issueTypeHierarchy ? proyecto.issueTypeHierarchy.issueTypes : []);

    return {
      id: proyecto.id,
      clave: proyecto.key,
      nombre: proyecto.name,
      tipoProyecto: proyecto.projectTypeKey,
      estilo: proyecto.style,
      tiposDeIncidencia: tiposDeIncidencia.join(', '),
      epicas: estructura.epicas,
      tareasSinEpica: estructura.tareasSinEpica
    };
  });
}

/**
 * Organiza una lista plana de incidencias en una estructura jerárquica de épicas y tareas.
 * @param {Object[]} incidencias - La lista de incidencias de un proyecto.
 * @returns {Object} Un objeto con una lista de 'epicas' (con sus tareas anidadas) y una lista de 'tareasSinEpica'.
 */
function organizarEpicasYTareas(incidencias) {
  const epicasMap = new Map();
  const epicas = [];
  const tareasSinEpica = [];

  incidencias.forEach(incidencia => {
    // Si la incidencia es una Épica, la añadimos al mapa y a la lista.
    if (incidencia.fields.issuetype.name === 'Epic') {
      const epica = {
        clave: incidencia.key,
        titulo: incidencia.fields.summary,
        tareas: []
      };
      epicasMap.set(incidencia.key, epica);
      epicas.push(epica);
    }
  });

  incidencias.forEach(incidencia => {
    // Si no es una Épica, es una tarea que debe ser asignada a una.
    if (incidencia.fields.issuetype.name !== 'Epic') {
      const tarea = {
        clave: incidencia.key,
        titulo: incidencia.fields.summary,
        estado: incidencia.fields.status.name,
        responsable: incidencia.fields.assignee ? incidencia.fields.assignee.displayName : "Sin asignar",
        tiempoEstimado: incidencia.fields.timetracking.originalEstimate || "N/A",
        etiquetas: incidencia.fields.labels.join(', ') || "Sin etiquetas"
      };
      
      const epicLink = incidencia.fields[CONFIG_CAMPOS_JIRA.epicLink];
      if (epicLink && epicasMap.has(epicLink)) {
        epicasMap.get(epicLink).tareas.push(tarea);
      } else {
        tareasSinEpica.push(tarea);
      }
    }
  });

  return { epicas, tareasSinEpica };
}

/**
 * Extrae los nombres de los tipos de incidencia de la jerarquía de un proyecto.
 * @param {Object[]} issueTypes - El array de tipos de incidencia del objeto del proyecto.
 * @returns {string[]} Una lista de nombres de los tipos de incidencia.
 */
function obtenerNombresTiposDeIncidencia(issueTypes) {
    if (!issueTypes || issueTypes.length === 0) {
        return ["N/A"];
    }
    // Esta es una simplificación. La API puede devolver una estructura más compleja.
    // Por ahora, asumimos que podemos mapear directamente los nombres.
    return issueTypes.map(it => it.name || 'Tipo desconocido');
}
