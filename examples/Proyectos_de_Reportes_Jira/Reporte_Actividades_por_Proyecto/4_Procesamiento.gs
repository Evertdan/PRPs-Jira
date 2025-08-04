// =====================================
// ARCHIVO 22: PROCESAMIENTO DE DATOS DE ACTIVIDADES
// =====================================

/**
 * Procesa la lista de tareas de Jira para formatearlas según las columnas del reporte.
 * @param {Object[]} tareasJira - El array de tareas obtenido de la API.
 * @returns {Object[]} Un array de objetos listos para escribir en la hoja.
 */
function procesarDatosActividades(tareasJira) {
  return tareasJira.map(tarea => {
    const sprintInfo = obtenerNombreSprintActividades(tarea.fields[CONFIG_CAMPOS_ACTIVIDADES.sprint]);
    
    return {
      llave: tarea.key,
      id: tarea.id,
      resumen: tarea.fields.summary,
      asignado: tarea.fields.assignee ? tarea.fields.assignee.displayName : "Sin asignar",
      fechaLimite: tarea.fields.duedate ? Utilities.formatDate(new Date(tarea.fields.duedate), Session.getScriptTimeZone(), "yyyy-MM-dd") : "N/A",
      estado: tarea.fields.status.name,
      tiempoEstimado: tarea.fields.timetracking.originalEstimate || "N/A",
      sprint: sprintInfo,
      etiquetas: tarea.fields.labels.join(', ') || "Sin etiquetas"
    };
  });
}

/**
 * Obtiene el nombre del sprint desde el campo personalizado.
 * @param {Array} sprintField - El valor del campo personalizado de sprint.
 * @returns {string} El nombre del sprint o "N/A".
 */
function obtenerNombreSprintActividades(sprintField) {
  if (!sprintField || sprintField.length === 0) {
    return "N/A";
  }
  try {
    // El campo sprint es un array, el último suele ser el más relevante.
    const sprintInfoString = sprintField[sprintField.length - 1];
    const match = sprintInfoString.match(/name=([^,]+)/);
    return match ? match[1] : "N/A";
  } catch (e) {
    return "N/A";
  }
}
