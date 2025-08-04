// =====================================
// ARCHIVO 1: CONFIGURACIÓN SISTEMA REPORTES SEMANALES
// =====================================

/**
 * ✅ Metadatos del sistema mejorado
 */
const SCRIPT_METADATA = {
  nombre: 'Sistema de Reportes Semanales Jira Pro',
  version: '3.1.0',
  autor: 'Gemini Code Assistant - Refactorizado',
  fecha: '2025-07-30',
  descripcion: 'Sistema de reportes semanales basado en worklog, eliminando la dependencia de etiquetas manuales.',
  changelog: [
    'v3.1.0 - Refactorización completa a un sistema basado en worklog.',
    'v3.1.0 - Eliminadas las etiquetas SEMANA_X y toda la lógica asociada.',
    'v3.1.0 - JQL ahora se basa en worklogDate y worklogAuthor.',
    'v3.0.0 - Sistema completamente modularizado y con seguridad mejorada',
    'v3.0.0 - Credenciales seguras con PropertiesService',
    'v3.0.0 - Sistema de caché avanzado con TTL',
    'v3.0.0 - Manejo robusto de errores con reintentos',
    'v3.0.0 - Validación mejorada y prevención de inyecciones'
  ]
};

/**
 * ✅ Obtiene configuración segura de Jira desde PropertiesService
 */
function obtenerConfigJiraSemanal() {
  const propiedades = PropertiesService.getScriptProperties();
  const email = propiedades.getProperty('JIRA_EMAIL_SEMANAL');
  const apiToken = propiedades.getProperty('JIRA_API_TOKEN_SEMANAL');
  const dominio = 'ccsoft'; // Dominio fijo
  
  if (!email || !apiToken) {
    throw new Error(`
❌ CONFIGURACIÓN FALTANTE: El email o API token no están configurados.

🔧 SOLUCIÓN: Ejecuta la función 'configurarCredencialesJiraSemanal()' desde el menú.

📋 PASOS:
1. Ve al menú "📊 Reportes Semanales Jira Pro"
2. Selecciona "🔐 Configurar Credenciales"
3. Introduce tu email y API Token de Jira

🔒 SEGURIDAD: Las credenciales se almacenan de forma segura en PropertiesService.
    `);
  }
  
  return {
    dominio: dominio,
    email: email,
    apiToken: apiToken
  };
}

/**
 * ✅ ACTUALIZADO: Configuración específica para worklog y tipos reales de Jira
 */
const CONFIG_SEMANAL = {
  // Información del sistema
  get jiraConfig() {
    return obtenerConfigJiraSemanal();
  },
  
  // ✅ ACTUALIZADO: Configuración para reportes basados en worklog
  proyectoDefecto: "", // Vacío para todos los proyectos
  basadoEnWorklog: true, // Indicador de que usa worklog
  
  // Configuración de fechas dinámicas mejorada
  get fechaInicioSprint() {
    return this.calcularFechaInicioMes();
  },
  
  get fechaFinSprint() {
    return this.calcularFechaFinMes();
  },
  
  // ✅ Estados reales basados en tu documento (SIN DUPLICADOS)
  estadosCompletados: ['Cerrado', 'Done', 'Resolved', 'Closed', 'Completado', 'Listo', 'Terminado'],
  estadosEnProgreso: ['In Progress', 'En Progreso', 'Development', 'Testing', 'Review'],
  estadosPendientes: ['To Do', 'Open', 'Pending', 'Backlog', 'New', 'Abierto', 'Pendiente', 'Por hacer'],
  
  // ✅ Tipos de issue reales de tu documento (actualizado)
  tiposIssueReales: [
    'Tarea',
    'Mesa de Trabajo', 
    'Tarea Operativa',
    'Tarea Emergente',
    'Juntas Scrum',
    'Convivencias y Cumpleaños',
    'Documentación',
    'Habilitador'
  ],
  
  // Configuración de filtros actualizados
  soloMisIssues: true, // true para ver solo issues del usuario actual
  incluirResueltos: true,
  incluirEnProgreso: true,
  incluirPendientes: true,
  incluirCerrados: true,
  
  // ✅ NUEVO: Configuración específica para worklog
  incluirSoloConWorklog: true, // Solo issues que tienen tiempo registrado
  diasParaReporte: 7, // Últimos 7 días por defecto
  
  // Configuración de formato y presentación
  formatoHoras: "decimal", // "decimal" o "hms" (horas:minutos:segundos)
  incluirGraficos: true,
  incluirEstadisticas: true,
  incluirAnalisisProductividad: true,
  
  // Configuración de colores corporativos mejorada
  colores: {
    headerPrincipal: "#1e3c72",
    headerSecundario: "#4a90e2",
    semanaActiva: "#28a745",
    semanaCompletada: "#17a2b8",
    semanaPendiente: "#6c757d",
    filaAlternada1: "#f8fcff",
    filaAlternada2: "#e8f2ff",
    totales: "#dc3545",
    exito: "#28a745",
    advertencia: "#ffc107",
    info: "#17a2b8",
    peligro: "#dc3545"
  },
  
  // ✅ IDs de campos personalizados (custom fields)
  camposPersonalizados: {
    storyPoints: 'customfield_10016', // Reemplazar con el ID correcto para Story Points
    sprint: 'customfield_10020'      // Reemplazar con el ID correcto para Sprint
  },
  
  // Métodos auxiliares para fechas
  calcularFechaInicioMes() {
    const hoy = new Date();
    return new Date(hoy.getFullYear(), hoy.getMonth(), 1);
  },
  
  calcularFechaFinMes() {
    const hoy = new Date();
    return new Date(hoy.getFullYear(), hoy.getMonth() + 1, 0);
  },
  
  // ✅ NUEVO: Método para calcular fechas de reporte basadas en worklog
  calcularFechasReporteWorklog(dias = 7) {
    const hoy = new Date();
    const fechaFin = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate());
    const fechaInicio = new Date(fechaFin.getTime() - (dias * 24 * 60 * 60 * 1000));
    
    return {
      fechaInicio: fechaInicio,
      fechaFin: fechaFin
    };
  }
};

/**
 * ✅ Configuración del sistema de caché optimizado para reportes semanales
 */
const CONFIG_CACHE_SEMANAL = {
  // Tiempo de vida del caché en minutos (optimizado para reportes semanales)
  TTL_ISSUES_SEMANALES: 15,    // Issues pueden cambiar frecuentemente
  TTL_PROYECTOS: 60,           // Proyectos son más estables
  TTL_USUARIOS: 120,           // Usuarios cambian poco
  TTL_METADATA: 30,            // Metadatos de issues
  
  // Prefijos para las claves del caché
  PREFIX_ISSUES: 'CACHE_SEMANAL_ISSUES_',
  PREFIX_PROYECTOS: 'CACHE_SEMANAL_PROYECTOS_',
  PREFIX_USUARIOS: 'CACHE_SEMANAL_USUARIOS_',
  PREFIX_METADATA: 'CACHE_SEMANAL_METADATA_'
};

/**
 * ✅ Configuración para validación y seguridad
 */
const CONFIG_VALIDACION_SEMANAL = {
  // Patrones de seguridad para validar JQL
  PATRONES_PELIGROSOS: [
    /';.*(?:DROP|DELETE|UPDATE|INSERT|CREATE|ALTER)/i,
    /(?:UNION|SELECT).*FROM/i,
    /<script[^>]*>/i,
    /javascript:/i,
    /eval\(/i,
    /exec\(/i
  ],
  
  // Límites de seguridad
  MAX_ISSUES_POR_CONSULTA: 2000,
  MAX_CARACTERES_JQL: 3000,
  TIMEOUT_API_MS: 30000
};

/**
 * ✅ Función para configurar credenciales de forma segura
 */
function configurarCredencialesJiraSemanal() {
  const ui = SpreadsheetApp.getUi();
  
  try {
    // Verificar credenciales actuales
    const propiedades = PropertiesService.getScriptProperties();
    const emailActual = propiedades.getProperty('JIRA_EMAIL_SEMANAL');
    
    // Solicitar email
    const emailResult = ui.prompt(
      'Configuración Jira - Email',
      `Email actual: ${emailActual || 'No configurado'}\n\n` +
      'Introduce tu email de Jira:',
      ui.ButtonSet.OK_CANCEL
    );
    
    if (emailResult.getSelectedButton() !== ui.Button.OK) {
      ui.alert('Configuración cancelada');
      return;
    }
    
    // Solicitar API token
    const tokenResult = ui.prompt(
      'Configuración Jira - API Token',
      'Introduce tu API Token de Jira:\n\n' +
      '💡 Genéralo en: https://id.atlassian.com/manage-profile/security/api-tokens\n' +
      '🔒 Se almacenará de forma segura en PropertiesService',
      ui.ButtonSet.OK_CANCEL
    );
    
    if (tokenResult.getSelectedButton() !== ui.Button.OK) {
      ui.alert('Configuración cancelada');
      return;
    }
    
    // Validar y guardar credenciales
    const nuevoEmail = emailResult.getResponseText().trim();
    const nuevoToken = tokenResult.getResponseText().trim();
    
    if (!nuevoEmail || !nuevoToken) {
      ui.alert('Error', 'Todos los campos son obligatorios', ui.ButtonSet.OK);
      return;
    }
    
    // Guardar credenciales de forma segura
    propiedades.setProperties({
      'JIRA_DOMINIO_SEMANAL': 'ccsoft', // Dominio fijo
      'JIRA_EMAIL_SEMANAL': nuevoEmail,
      'JIRA_API_TOKEN_SEMANAL': nuevoToken
    });
    
    ui.alert(
      'Configuración Completada',
      '✅ Las credenciales han sido configuradas de forma segura.\n\n' +
      '🔒 Están almacenadas en PropertiesService y no son visibles en el código.\n\n' +
      '✨ Ahora puedes generar reportes semanales.',
      ui.ButtonSet.OK
    );
    
    Logger.log('✅ Credenciales de Jira Semanal configuradas exitosamente');
    
  } catch (error) {
    Logger.log(`❌ Error configurando credenciales: ${error.message}`);
    ui.alert('Error', `No se pudieron configurar las credenciales: ${error.message}`, ui.ButtonSet.OK);
  }
}

/**
 * ✅ Función para verificar configuración
 */
function verificarCredencialesJiraSemanal() {
  try {
    const config = obtenerConfigJiraSemanal();
    Logger.log('✅ Credenciales de Jira Semanal configuradas correctamente');
    Logger.log(`📧 Email: ${config.email}`);
    Logger.log(`🌐 Dominio: ${config.dominio}`);
    Logger.log(`🔑 API Token: ${'*'.repeat(20)}...`);
    return true;
  } catch (error) {
    Logger.log(`❌ Error verificando credenciales: ${error.message}`);
    return false;
  }
}

// =====================================
// NUEVA FUNCIÓN: Configurar el sistema para worklog
// =====================================

/**
 * ✅ NUEVA: Configura el sistema para usar worklog en lugar de etiquetas
 */
function configurarSistemaParaWorklog() {
  const ui = SpreadsheetApp.getUi();
  
  try {
    const respuesta = ui.alert(
      'Configurar Sistema para Worklog',
      '🔄 ¿Quieres configurar el sistema para funcionar con worklog?\n\n' +
      '✅ NUEVA configuración:\n' +
      '• Basado en tiempo registrado (worklog)\n' +
      '• Usuario actual (assignee = currentUser())\n' +
      '• Fechas de trabajo real\n' +
      '• Sin necesidad de etiquetas SEMANA_X\n\n' +
      '❌ CONFIGURACIÓN anterior:\n' +
      '• Basado en etiquetas semanales\n' +
      '• Tipos de issue específicos\n\n' +
      '¿Proceder?',
      ui.ButtonSet.YES_NO
    );
    
    if (respuesta === ui.Button.YES) {
      // Actualizar configuración en PropertiesService
      const propiedades = PropertiesService.getScriptProperties();
      propiedades.setProperties({
        'SISTEMA_BASADO_EN_WORKLOG': 'true',
        'FECHA_CONFIGURACION_WORKLOG': new Date().toISOString()
      });
      
      ui.alert(
        'Sistema Configurado',
        '✅ Sistema configurado para funcionar con worklog.\n\n' +
        '🎯 Ahora el sistema:\n' +
        '• Obtiene issues del usuario actual\n' +
        '• Filtra por fechas de worklog\n' +
        '• Calcula semanas automáticamente\n' +
        '• No requiere etiquetas manuales\n\n' +
        '🚀 Puedes generar reportes inmediatamente.',
        ui.ButtonSet.OK
      );
      
      Logger.log('✅ [CONFIG] Sistema configurado para worklog exitosamente');
      return true;
    }
    
    return false;
    
  } catch (error) {
    Logger.log(`❌ [CONFIG] Error configurando sistema: ${error.message}`);
    ui.alert(
      'Error de Configuración',
      `❌ No se pudo configurar el sistema para worklog.\n\n${error.message}`,
      ui.ButtonSet.OK
    );
    return false;
  }
}

/**
 * ✅ NUEVA: Verifica si el sistema está configurado para worklog
 */
function esSistemaBasadoEnWorklog() {
  try {
    const propiedades = PropertiesService.getScriptProperties();
    return propiedades.getProperty('SISTEMA_BASADO_EN_WORKLOG') === 'true';
  } catch (error) {
    Logger.log(`⚠️ Error verificando configuración worklog: ${error.message}`);
    return false;
  }
}

// =====================================
// ✅ NUEVA: CONFIGURACIÓN DEL EQUIPO CCSOFT
// =====================================

/**
 * ✅ CONFIGURACIÓN COMPLETA DEL EQUIPO CCSOFT (17 PERSONAS)
 * Lista autorizada de personas que pueden aparecer en los reportes
 */
const EQUIPO_CCSOFT = [
    // INFRA
    { nombre: "Monica Guerra", email: "monica.guerra@computocontable.com", accountId: "712020:042358bc-7708-42bc-9af4-c0be66012d4e", area: "INFRA", activo: true },
    { nombre: "Janeth Vega", email: "janeth.vega@computocontable.com", accountId: "712020:8a25dc51-c490-42ca-bd90-70992d8655e2", area: "INFRA", activo: true },
    { nombre: "Paola Rodriguez", email: "paola.rodriguez@computocontable.com", accountId: "712020:166682a6-7443-4248-b6ab-92dc7d32e13a", area: "INFRA", activo: true },
    // FENIX
    { nombre: "Carlos Bárcenas", email: "carlos.barcenas@computocontable.com", accountId: "712020:44bf1d24-752a-4537-aa2b-7f5d1884fafb", area: "FENIX", activo: true },
    { nombre: "Mauricio Cervantes", email: "mauricio.cervantes@computocontable.com", accountId: "712020:51ed9320-e7db-4268-9b15-51b16819d8cf", area: "FENIX", activo: true },
    { nombre: "David Valdés", email: "david.valdes@computocontable.com", accountId: "712020:449ccb37-4ecc-40f8-b258-3a2b351c8366", area: "FENIX", activo: true },
    { nombre: "Evert Romero", email: "evert.romero@computocontable.com", accountId: "712020:bcc8f634-81f1-4b21-893b-de03d7203037", area: "FENIX", activo: true },
    { nombre: "Misael Hernández", email: "misael.hernandez@computocontable.com", accountId: "712020:1eac4227-aa1c-4bbb-bb94-549d6a842965", area: "FENIX", activo: true },
    { nombre: "Manuel Benítez", email: "manuel.benitez@computocontable.com", accountId: "712020:bb3375fa-e762-43b6-acc4-6c4bd47efab1", area: "FENIX", activo: true },
    { nombre: "Marcos Coronado", email: "marcos.coronado@computocontable.com", accountId: "712020:a06717c8-e1eb-49bd-812f-7be59e7f61f1", area: "FENIX", activo: true },
    // MOP
    { nombre: "Gabriela Hernández", email: "gabriela.hernandez@computocontable.com", accountId: "712020:143bf4ba-d154-434f-b344-31f542ce88d9", area: "MOP", activo: true },
    { nombre: "Benjamin Oribe", email: "benjamin.oribe@computocontable.com", accountId: "712020:9233c170-0021-4cb2-9f5d-04986932faa6", area: "MOP", activo: true },
    // MEC
    { nombre: "Perla Carreón", email: "perla.carreon@computocontable.com", accountId: "712020:62a4f5dd-da42-4893-8406-70fe4e7ab804", area: "MEC", activo: true },
    { nombre: "Norma Fragoso", email: "norma.fragoso@computocontable.com", accountId: "63ed4190eaf0b28dfd1b955a", area: "MEC", activo: true },
    // MKT
    { nombre: "Luis Sánchez", email: "luis.sanchez@computocontable.com", accountId: "712020:2cf81f55-3377-4061-a8ab-f0be722d33bf", area: "MKT", activo: true },
    { nombre: "Francisco Díez", email: "francisco.diez@computocontable.com", accountId: "712020:f8c11447-160d-4828-add5-501374ee89d4", area: "MKT", activo: true }
];

/**
 * ✅ PATRONES DE EXCLUSIÓN AUTOMÁTICA
 * Usuarios que deben ser excluidos completamente de los reportes
 */
const PATRONES_EXCLUSION = [
  // Bots y sistemas
  '[TEMPLATE]', 'ASCII art generator', 'Atlas for Jira', 'Atlassian Assist',
  'Automation for Jira', 'Chat Notifications', 'System',
  
  // Herramientas de desarrollo
  'Code Documentation Writer', 'Code Observer', 'draw.io Diagrams',
  
  // Conectores y integraciones
  'Bitbucket for Compass', 'Confluence Analytics', 'Connectors for Jira',
  'Microsoft Teams for Confluence', 'Microsoft Teams for Jira',
  'Jira Outlook', 'Jira Service Management Widget', 'Jira Spreadsheets',
  
  // Servicios externos
  'Slack', 'Trello', 'Statuspage for Jira', 'Opsgenie',
  
  // Herramientas de análisis
  'Customer Insights', 'Dashboard Insights', 'Issue Organizer',
  'Cosmos - Social Intranet', 'Proforma Migrator',
  
  // Usuarios de prueba
  'Example Customer', 'atlassian-demo.invalid',
  
  // Entidades corporativas generales
  'Computo Contable Soft'
];

/**
 * ✅ NUEVA: Obtener información completa de una persona del equipo
 * @param {string} criterio - Nombre, email o nombreCorto de la persona
 * @returns {Object|null} Información completa de la persona o null si no existe
 */
function obtenerPersonaEquipo(criterio) {
  if (!criterio) return null;
  
  const criterioProcesado = criterio.trim();
  
  return EQUIPO_CCSOFT.find(persona => 
    persona.activo && (
      persona.nombre === criterioProcesado ||
      persona.email === criterioProcesado ||
      persona.nombreCorto === criterioProcesado
    )
  ) || null;
}

/**
 * ✅ NUEVA: Obtener todas las personas activas del equipo
 * @param {string} departamento - Filtrar por departamento (opcional)
 * @returns {Array} Lista de personas activas
 */
function obtenerEquipoActivo(departamento = null) {
  let personas = EQUIPO_CCSOFT.filter(p => p.activo);
  
  if (departamento) {
    personas = personas.filter(p => p.departamento === departamento);
  }
  
  return personas.sort((a, b) => a.nombre.localeCompare(b.nombre));
}

/**
 * ✅ NUEVA: Obtener departamentos disponibles
 * @returns {Array} Lista de departamentos únicos
 */
function obtenerAreasEquipo() {
  const areas = [...new Set(
    EQUIPO_CCSOFT
      .filter(p => p.activo)
      .map(p => p.area)
  )];
  
  return areas.sort();
}

/**
 * ✅ NUEVA: Formatear nombre con email para mostrar
 * @param {string} nombre - Nombre de la persona
 * @param {string} email - Email (opcional, se buscará en el equipo)
 * @returns {string} Formato: "Nombre (email@ccsoft.ai)"
 */
function formatearNombrePersonaConEmail(nombre, email = null) {
  const persona = obtenerPersonaEquipo(nombre);
  
  if (persona) {
    return `${persona.nombre} (${persona.email})`;
  }
  
  return `${nombre} (${email || 'Sin email'})`;
}
