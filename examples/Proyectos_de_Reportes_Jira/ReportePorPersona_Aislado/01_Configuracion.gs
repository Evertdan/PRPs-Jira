// =====================================
// CONFIGURACIÓN PARA REPORTE POR PERSONA AISLADO
// =====================================

/**
 * ✅ Metadatos del sistema
 */
const SCRIPT_METADATA = {
  nombre: 'Reporte por Persona - Versión Aislada',
  version: '1.0.0',
  autor: 'Claude Code Assistant',
  fecha: '2025-08-01',
  descripcion: 'Sistema aislado para generar reportes por persona basado en worklog de Jira'
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
1. Ve al menú "👤 Reporte por Persona"
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
 * ✅ Configuración específica para worklog
 */
const CONFIG_SEMANAL = {
  // Información del sistema
  get jiraConfig() {
    return obtenerConfigJiraSemanal();
  },
  
  // Configuración para reportes basados en worklog
  proyectoDefecto: "", // Vacío para todos los proyectos
  basadoEnWorklog: true,
  
  // Configuración de fechas dinámicas
  get fechaInicioSprint() {
    return this.calcularFechaInicioMes();
  },
  
  get fechaFinSprint() {
    return this.calcularFechaFinMes();
  },
  
  // Estados reales basados en Jira
  estadosCompletados: ['Cerrado', 'Done', 'Resolved', 'Closed', 'Completado', 'Listo', 'Terminado'],
  estadosEnProgreso: ['In Progress', 'En Progreso', 'Development', 'Testing', 'Review'],
  estadosPendientes: ['To Do', 'Open', 'Pending', 'Backlog', 'New', 'Abierto', 'Pendiente', 'Por hacer'],
  
  // Tipos de issue reales
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
  
  // Configuración de filtros
  soloMisIssues: true,
  incluirResueltos: true,
  incluirEnProgreso: true,
  incluirPendientes: true,
  incluirCerrados: true,
  incluirSoloConWorklog: true,
  diasParaReporte: 7,
  
  // Configuración de formato
  formatoHoras: "decimal",
  incluirGraficos: true,
  incluirEstadisticas: true,
  incluirAnalisisProductividad: true,
  
  // Configuración de colores corporativos
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
  
  // IDs de campos personalizados
  camposPersonalizados: {
    storyPoints: 'customfield_10016',
    sprint: 'customfield_10020'
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
  
  // Método para calcular fechas de reporte basadas en worklog
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
 * ✅ EQUIPO CCSOFT - Lista autorizada de personas
 */
const EQUIPO_CCSOFT = [
    // INFRA
    { nombre: "Monica Guerra", email: "monica.guerra@computocontable.com", accountId: "712020:042358bc-7708-42bc-9af4-c0be66012d4e", area: "INFRA", activo: true, rol: "Analista" },
    { nombre: "Janeth Vega", email: "janeth.vega@computocontable.com", accountId: "712020:8a25dc51-c490-42ca-bd90-70992d8655e2", area: "INFRA", activo: true, rol: "Analista" },
    { nombre: "Paola Rodriguez", email: "paola.rodriguez@computocontable.com", accountId: "712020:166682a6-7443-4248-b6ab-92dc7d32e13a", area: "INFRA", activo: true, rol: "Analista" },
    // FENIX
    { nombre: "Carlos Bárcenas", email: "carlos.barcenas@computocontable.com", accountId: "712020:44bf1d24-752a-4537-aa2b-7f5d1884fafb", area: "FENIX", activo: true, rol: "Desarrollador" },
    { nombre: "Mauricio Cervantes", email: "mauricio.cervantes@computocontable.com", accountId: "712020:51ed9320-e7db-4268-9b15-51b16819d8cf", area: "FENIX", activo: true, rol: "Desarrollador" },
    { nombre: "David Valdés", email: "david.valdes@computocontable.com", accountId: "712020:449ccb37-4ecc-40f8-b258-3a2b351c8366", area: "FENIX", activo: true, rol: "Desarrollador" },
    { nombre: "Evert Romero", email: "evert.romero@computocontable.com", accountId: "712020:bcc8f634-81f1-4b21-893b-de03d7203037", area: "FENIX", activo: true, rol: "Desarrollador" },
    { nombre: "Misael Hernández", email: "misael.hernandez@computocontable.com", accountId: "712020:1eac4227-aa1c-4bbb-bb94-549d6a842965", area: "FENIX", activo: true, rol: "Desarrollador" }
];

/**
 * ✅ Verifica si las credenciales están configuradas
 */
function verificarCredencialesJiraSemanal() {
  try {
    const config = obtenerConfigJiraSemanal();
    return !!(config.dominio && config.email && config.apiToken);
  } catch (error) {
    return false;
  }
}

/**
 * ✅ Configurar credenciales de forma segura
 */
function configurarCredencialesJiraSemanal() {
  const ui = SpreadsheetApp.getUi();
  
  try {
    Logger.log('🔐 [CONFIGURACION] Iniciando configuración de credenciales...');
    
    const respuestaEmail = ui.prompt(
      'Configurar Jira - Email',
      '📧 Introduce tu email de Jira (ejemplo: tu.email@computocontable.com):',
      ui.ButtonSet.OK_CANCEL
    );
    
    if (respuestaEmail.getSelectedButton() !== ui.Button.OK) {
      ui.alert('Configuración cancelada');
      return;
    }
    
    const respuestaToken = ui.prompt(
      'Configurar Jira - API Token',
      '🔑 Introduce tu API Token de Jira:\n\n' +
      '💡 Para obtener tu token:\n' +
      '1. Ve a https://id.atlassian.com/manage-profile/security/api-tokens\n' +
      '2. Haz clic en "Create API token"\n' +
      '3. Copia el token generado',
      ui.ButtonSet.OK_CANCEL
    );
    
    if (respuestaToken.getSelectedButton() !== ui.Button.OK) {
      ui.alert('Configuración cancelada');
      return;
    }
    
    const email = respuestaEmail.getResponseText().trim();
    const apiToken = respuestaToken.getResponseText().trim();
    
    if (!email || !apiToken) {
      throw new Error('Email y API Token son requeridos');
    }
    
    if (!email.includes('@')) {
      throw new Error('Email inválido');
    }
    
    const propiedades = PropertiesService.getScriptProperties();
    propiedades.setProperties({
      'JIRA_EMAIL_SEMANAL': email,
      'JIRA_API_TOKEN_SEMANAL': apiToken
    });
    
    ui.alert(
      'Credenciales Configuradas',
      '✅ Las credenciales se han guardado exitosamente!\n\n' +
      '🧪 Ahora puedes usar "🧪 Probar Conexión" para verificar que funcionen.',
      ui.ButtonSet.OK
    );
    
    Logger.log('✅ [CONFIGURACION] Credenciales configuradas exitosamente');
    
  } catch (error) {
    Logger.log(`❌ [CONFIGURACION] Error: ${error.message}`);
    ui.alert(
      'Error de Configuración',
      `❌ Error configurando las credenciales:\n\n${error.message}`,
      ui.ButtonSet.OK
    );
  }
}

/**
 * ✅ Obtener personas activas del equipo
 */
function obtenerEquipoActivo(departamento = null) {
  let personas = EQUIPO_CCSOFT.filter(p => p.activo);
  
  if (departamento) {
    personas = personas.filter(p => p.area === departamento);
  }
  
  return personas.sort((a, b) => a.nombre.localeCompare(b.nombre));
}

/**
 * ✅ Obtener áreas disponibles
 */
function obtenerAreasEquipo() {
  const areas = [...new Set(
    EQUIPO_CCSOFT
      .filter(p => p.activo)
      .map(p => p.area)
  )];
  
  return areas.sort();
}