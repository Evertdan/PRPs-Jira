// =====================================
// CONFIGURACIÓN CENTRAL DEL SISTEMA
// Archivo: Config.gs
// Versión: 7.1 - Estructura mejorada y documentada
// =====================================

// --- 1. CONFIGURACIÓN DE CONEXIÓN JIRA ---
// Define los detalles para autenticarse con la API de Jira.
// IMPORTANTE: El apiToken es sensible. Considera usar PropertiesService para mayor seguridad.
const CONFIG_JIRA = {
  dominio: "ccsoft.atlassian.net", // Reemplaza con tu dominio de Jira (sin https://)
  email: "computocontable@gmail.com", // Email del usuario con acceso a la API
  apiToken: "ATATT3xFfGF0y2bYKf7jWsrAUicb520ZCsdsf4oxXrYpAXlrfLATiyVNNYL4ZqVSNHLhEvJesQJrRZMFqhPKm9wVKLRqAQzv8Oa3E_iL9fOlSRPr3PMQDHoDa8USN5Vt-6wF1oZO5h2081wRHNuGWBTTWz_J0-sKC3Hf5kV4cnBe_ruuR7gLXEM=CC8D533A" // Token de API generado en Jira
};

// --- 2. MAPEADO DE CAMPOS DE JIRA ---
// Asocia nombres legibles a los IDs de los campos nativos y personalizados de Jira.
// Para obtener el ID de un campo personalizado, ve a la configuración de Jira.
const CAMPOS_ENTREGABLES = {
  // --- Campos Nativos de Jira ---
  attachment: "attachment",         // Archivos adjuntos
  comment: "comment",               // Comentarios
  description: "description",       // Descripción de la tarea
  worklog: "worklog",               // Registros de trabajo
  issuelinks: "issuelinks",         // Enlaces a otras tareas de Jira
  remotelinks: "remotelinks",       // Enlaces a páginas externas (Confluence, etc.)

  // --- Campos Personalizados (IDs específicos de tu instancia de Jira) ---
  sprint: "customfield_10020",          // Campo que contiene la información del Sprint
  story_points: "customfield_10016",      // Estimación de Story Points
  desviaciones: "customfield_10230",      // Campo para documentar desviaciones
  area_funcional: "customfield_10231",  // Campo para el área funcional
  comentarios: "customfield_10228", // Campo de texto largo para comentarios extra
  seguidores: "customfield_10003"       // Campo para seguidores o watchers
};

// --- 3. CONFIGURACIÓN DE ANÁLISIS DE ENTREGABLES ---
// Define los pesos y umbrales para calificar la calidad de la evidencia.
const CONFIG_ENTREGABLES = {
  // Puntuaciones asignadas a cada tipo de evidencia encontrada.
  PESOS: {
    PULL_REQUEST: 4,        // Peso muy alto para PRs (la evidencia más fuerte)
    ARCHIVO_ADJUNTO: 3,     // Peso alto para archivos subidos
    COMMIT: 2,              // Peso medio para commits
    ENLACE_EXTERNO: 1,      // Peso bajo para enlaces genéricos
    COMENTARIO_DETALLADO: 1, // Peso bajo para comentarios sustanciales
    CAMPO_PERSONALIZADO: 1,  // Peso bajo por rellenar campos de texto importantes
    IMAGEN_ADJUNTA: 1       // Bonificación adicional si el adjunto es una imagen
  },
  
  // Niveles de calidad basados en la puntuación total acumulada.
  NIVELES: {
    // El orden es de mayor a menor. La evaluación se detiene en el primer nivel que cumple.
    EVIDENCIA_COMPLETA: { min: 6, color: "#d4edda", emoji: "🟢", texto: "Evidencia Completa" },
    EVIDENCIA_BUENA:    { min: 4, color: "#e2f0d9", emoji: "🟢", texto: "Evidencia Buena" },
    EVIDENCIA_BASICA:   { min: 2, color: "#fff3cd", emoji: "🟡", texto: "Evidencia Básica" },
    EVIDENCIA_MINIMA:   { min: 1, color: "#fff9e6", emoji: "🟡", texto: "Evidencia Mínima" },
    SIN_EVIDENCIA:      { min: 0, color: "#f8d7da", emoji: "🔴", texto: "Sin Evidencia" }
  },
  
  // Clasificación de archivos por extensión para un análisis más detallado.
  TIPOS_ARCHIVOS: {
    IMAGENES: ['.png', '.jpg', '.jpeg', '.gif', '.bmp', '.webp', '.svg'],
    DOCUMENTOS: ['.pdf', '.doc', '.docx', '.txt', '.md', '.rtf', '.csv'],
    CODIGO: ['.js', '.py', '.java', '.php', '.html', '.css', '.sql', '.json', '.xml'],
    COMPRIMIDOS: ['.zip', '.rar', '.7z', '.tar', '.gz'],
    PRESENTACIONES: ['.pptx', '.key'],
    HOJAS_CALCULO: ['.xlsx', '.xls']
    // Los archivos no encontrados aquí se clasificarán como 'OTROS'.
  }
};

// --- 4. CONFIGURACIÓN DE FORMATO DEL REPORTE ---
// Define los estilos visuales para la hoja de cálculo generada.
const CONFIG_FORMATO = {
  // Colores de fondo para las celdas de estado de la tarea.
  COLORES_ESTADOS: {
    "Por hacer": "#DEEBFF", 
    "En progreso": "#FFF0B3", 
    "To Do": "#DEEBFF",
    "In Progress": "#FFF0B3", 
    "Done": "#E3FCEF", 
    "Listo": "#E3FCEF",
    "Cerrado": "#EBECF0", 
    "Validación": "#FEF2E0", 
    "Completado": "#E3FCEF"
  },
  
  // Anchos de columna (en píxeles) para un reporte legible.
  ANCHOS_COLUMNAS: {
    CLAVE: 80,
    TAREAS: 350,
    RESPONSABLE: 120,
    ESTADO: 100,
    ARCHIVOS: 100,
    ENLACES: 100,
    EVIDENCIA: 150
  }
};


// --- VERIFICACIÓN DE CARGA ---
// Este log confirma que el archivo de configuración se ha cargado en el entorno.
// Es el primer archivo que debe cargarse.
try {
  if (typeof Logger !== 'undefined') {
    Logger.log("✅ Config.gs cargado - Configuración del sistema disponible.");
  }
} catch (e) {
  // No hacer nada si Logger no está disponible (entornos no estándar)