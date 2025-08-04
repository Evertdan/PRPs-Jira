// =====================================
// ARCHIVO 1: CONFIGURACIÓN Y CONSTANTES
// =====================================

/**
 * Obtiene la configuración de la API de Jira desde PropertiesService.
 * @returns {Object} Un objeto con el dominio, email y token de API.
 */
function obtenerConfigJira() {
  const userProperties = PropertiesService.getUserProperties();
  const email = userProperties.getProperty('JIRA_EMAIL');
  const apiToken = userProperties.getProperty('JIRA_API_TOKEN');

  if (!email || !apiToken) {
    throw new Error("Las credenciales de Jira no están configuradas. Por favor, ejecuta la función 'configurarCredenciales' desde el menú del proyecto principal.");
  }

  return {
    dominio: "ccsoft.atlassian.net",
    email: email,
    apiToken: apiToken
  };
}

// Constantes globales para la librería
const CONSTANTES = {
  CACHE_EXPIRATION_SECONDS: 3600, // 1 hora
  ESTADOS_JIRA: {
    COMPLETADO: ['Done', 'Listo', 'Cerrado', 'Completado'],
    EN_PROGRESO: ['In Progress', 'En progreso', 'Validación'],
    PENDIENTE: ['To Do', 'Por hacer']
  },
  COLORES_ESTADO: {
    "Por hacer": "#DEEBFF", "En progreso": "#FFF0B3", "To Do": "#DEEBFF",
    "In Progress": "#FFF0B3", "Done": "#E3FCEF", "Listo": "#E3FCEF",
    "Cerrado": "#EBECF0", "Validación": "#FEF2E0", "Completado": "#E3FCEF"
  }
};
