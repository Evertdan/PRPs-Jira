/**
 * Configuración del sistema de reportes de Jira
 * Este archivo contiene todas las configuraciones y constantes del sistema
 */

const CONFIG_JIRA = {
  // Dominio fijo de la empresa
  dominio: "ccsoft.atlassian.net",
  
  // Credenciales por defecto (se pueden sobrescribir via interfaz)
  email: "computocontable@gmail.com", 
  apiToken: "",
  
  // Proyecto de referencia confirmado que existe en tu instancia
  projectKey: "FENIX",
  
  // Configuración de consultas
  maxResults: 4000,
  
  // Campos personalizados de Jira (ajustados para tu instancia)
  customFields: {
    compromiso: "customfield_10191",
    fechaHora: "" // Campo deshabilitado - no existe en tu instancia
  }
};

const FILTROS_JQL = {
  // Tipos de issues a excluir
  tiposExcluidos: ["Convivencias y Cumpleaños", "Juntas Scrum"],
  
  // Palabras clave a excluir en el resumen
  palabrasExcluidas: ["pomodoro", "telegram", "kick", "descansos", "interrupciones"],
  
  // Estados de validación
  estadoValidacion: "Validación",
  estadoCerrado: "Cerrado"
};

const VALORES_COMPROMISO = {
  comprometido: "Comprometido",
  emergente: "Tarea Emergente",
  adicional: "Adicional"
};

const UI_CONFIG = {
  // Configuración de ventanas
  dialogWidth: 400,
  dialogHeight: 300,
  loadingWidth: 400,
  loadingHeight: 100,
  
  // Configuración de hojas
  columnWidthResumen: 400,
  
  // Colores para formato
  headerBackground: "#cfe2f3"
};
