// =====================================
// CONFIGURACIÓN - VALIDACIÓN DE BACKLOG CCsoft
// =====================================

/**
 * Metadatos del sistema de validación
 */
const METADATA_VALIDACION = {
  nombre: 'Sistema de Validación de Backlog y Sprint CCsoft',
  version: '1.1.0',
  autor: 'Claude Code Assistant - CCsoft Integration',
  fecha: '2025-07-31',
  descripcion: 'Sistema de validación de planeación para tareas de backlog y sprint activo basado en tiempo estimado, etiquetas de semana y fechas de vencimiento.',
  changelog: [
    'v1.1.0 - Inclusión de tareas del sprint activo (openSprints)',
    'v1.1.0 - JQL optimizada para backlog + sprint corriendo',
    'v1.1.0 - Sistema de detección automática de proyectos',
    'v1.0.0 - Sistema inicial de validación de backlog',
    'v1.0.0 - Integración completa con estructura organizacional CCsoft',
    'v1.0.0 - Validación híbrida: Story Points + Horas',
    'v1.0.0 - Sistema de etiquetas SEMANA_X validado',
    'v1.0.0 - Reportes multi-nivel en Google Sheets'
  ]
};

/**
 * Configuración principal del sistema de validación
 */
const CONFIG_VALIDACION_BACKLOG = {
  // Criterios de validación basados en respuestas integradas
  CRITERIOS: {
    tiempoEstimado: {
      storyPoints: "customfield_10016",
      horasOriginales: "timetracking.originalEstimateSeconds",
      minimo: 1,
      prioridadStoryPoints: true, // Preferir Story Points sobre horas
      convertirHorasAHoras: true  // Convertir segundos a horas
    },
    etiquetasSemana: {
      patron: /^SEMANA_[1-5]$/,
      validas: ["SEMANA_1", "SEMANA_2", "SEMANA_3", "SEMANA_4", "SEMANA_5"],
      requerida: true
    },
    fechaVencimiento: {
      requerida: true,
      minimoAdelanto: 0, // Permitir fechas desde hoy
      maximoAdelanto: 35, // Máximo 5 semanas (7*5=35 días)
      validarAlineacion: true
    },
    alineacionFechaEtiqueta: {
      toleranciaDias: 0, // Fecha debe estar exactamente en la semana
      advertenciaSiDesalineada: true
    }
  },
  
  // Configuración de período según análisis MCP
  PERIODO: {
    fechaBase: new Date('2025-07-31'), // Fecha detectada en datos MCP
    semanasAdelante: 5,
    semanasEnUso: 4, // Detectadas SEMANA_1 a SEMANA_4 actualmente
    incluirSprintActual: true,
    incluirSprintsAbiertos: true, // ✅ NUEVO: Incluir openSprints()
    excluirTareasPasadas: true
  },
  
  // Equipos y proyectos basados en estructura CCsoft
  EQUIPOS: {
    todos: true,
    proyectosPrioritarios: ["FENIX", "BDMS", "INFLYV", "MAAC", "VYP"],
    proyectosSecundarios: ["IAO", "DC", "DTO", "DT", "IP"],
    excluirProyectos: ["Papelera", "TRASH"]
  },
  
  // Configuración de puntajes
  PUNTAJES: {
    tiempoEstimado: 25,
    etiquetaSemana: 25, 
    fechaVencimiento: 25,
    alineacionFecha: 25,
    maxPuntaje: 100
  },
  
  // Umbrales de calidad
  UMBRALES: {
    excelente: 90,    // 90-100%
    bueno: 75,        // 75-89%
    aceptable: 50,    // 50-74%
    critico: 49       // <50%
  }
};

/**
 * Estructura organizacional CCsoft validada con MCP
 */
const ORGANIZACION_CCSOFT = {
  AREAS: {
    FENIX: {
      nombre: "FENIX - Desarrollo Core",
      emoji: "🔥",
      color: "#ffcdd2",
      prioridad: "CRÍTICA",
      impactoRevenue: "80%",
      proyectos: ["FENIX"]
    },
    INFRA: {
      nombre: "Infraestructura",
      emoji: "🏗️",
      color: "#e1bee7",
      prioridad: "ALTA",
      impactoRevenue: "Operacional",
      proyectos: ["INFLYV", "IAO"]
    },
    MOP: {
      nombre: "Mesa de Operaciones",
      emoji: "🛠️",
      color: "#c8e6c9",
      prioridad: "ALTA",
      impactoRevenue: "15%",
      proyectos: ["BDMS", "DC", "RCP"]
    },
    MEC: {
      nombre: "Mesa de Aplicaciones",
      emoji: "💻",
      color: "#bbdefb",
      prioridad: "ALTA",
      impactoRevenue: "Customer Facing",
      proyectos: ["MAAC", "VYP", "WEB"]
    },
    GESTION: {
      nombre: "Gestión Organizacional",
      emoji: "📊",
      color: "#fff3e0",
      prioridad: "MEDIA",
      impactoRevenue: "Soporte",
      proyectos: ["PMO", "OM", "SGC", "SIB", "TH"]
    }
  },
  
  // Mapeo de proyectos a áreas
  PROYECTOS: {
    "FENIX": { area: "FENIX", id: 10086, responsable: "Marcos Coronado / Carlos Bárcenas" },
    "BDMS": { area: "MOP", id: 10286, responsable: "Gabriela Hernández" },
    "INFLYV": { area: "INFRA", id: 10037, responsable: "Monica Guerra" },
    "MAAC": { area: "MEC", id: 10076, responsable: "Perla Carreón" },
    "VYP": { area: "MEC", id: 10039, responsable: "Luis Sánchez" },
    "IAO": { area: "INFRA", id: 10319, responsable: "Monica Guerra" },
    "DC": { area: "MOP", id: 10053, responsable: "Monica Guerra" },
    "DTO": { area: "FENIX", id: 10084, responsable: "Evert Romero" },
    "DT": { area: "FENIX", id: 10087, responsable: "Carlos Bárcenas" },
    "IP": { area: "MEC", id: 10517, responsable: "Luis Sánchez" }
  },
  
  // Usuarios activos identificados por MCP
  USUARIOS_ACTIVOS: {
    "Carlos Bárcenas": "712020:44bf1d24-752a-4537-aa2b-7f5d1884fafb",
    "Evert Romero": "712020:bcc8f634-81f1-4b21-893b-de03d7203037",
    "Misael Hernández": "712020:1eac4227-aa1c-4bbb-bb94-549d6a842965",
    "Manuel Benítez": "712020:bb3375fa-e762-43b6-acc4-6c4bd47efab1"
  }
};

/**
 * Configuración de conexión Jira para validación de backlog
 */
function obtenerConfigJiraValidacion() {
  const propiedades = PropertiesService.getScriptProperties();
  const email = propiedades.getProperty('JIRA_EMAIL_VALIDACION') || propiedades.getProperty('JIRA_EMAIL_SEMANAL');
  const apiToken = propiedades.getProperty('JIRA_API_TOKEN_VALIDACION') || propiedades.getProperty('JIRA_API_TOKEN_SEMANAL');
  const dominio = 'ccsoft'; // Dominio fijo
  
  if (!email || !apiToken) {
    throw new Error(`
❌ CONFIGURACIÓN FALTANTE: El email o API token no están configurados.

🔧 SOLUCIÓN: Ejecuta la función 'configurarCredencialesValidacion()' desde el menú.

📋 PASOS:
1. Ve al menú "📊 Validación Backlog CCsoft"
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
 * Configura las credenciales de Jira para validación de backlog
 */
function configurarCredencialesValidacion() {
  const ui = SpreadsheetApp.getUi();
  
  try {
    // Solicitar email
    const emailResponse = ui.prompt(
      '🔐 Configuración de Credenciales Jira',
      'Introduce tu email de Jira (ej: usuario@computocontable.com):',
      ui.ButtonSet.OK_CANCEL
    );
    
    if (emailResponse.getSelectedButton() !== ui.Button.OK) {
      ui.alert('⚠️ Configuración Cancelada', 'La configuración de credenciales fue cancelada.', ui.ButtonSet.OK);
      return;
    }
    
    const email = emailResponse.getResponseText().trim();
    if (!email || !email.includes('@')) {
      throw new Error('Email inválido. Debe contener @ y ser un email válido.');
    }
    
    // Solicitar API Token
    const tokenResponse = ui.prompt(
      '🔐 Configuración de API Token',
      'Introduce tu API Token de Jira:\n\n' +
      '💡 Para obtener tu token:\n' +
      '1. Ve a https://id.atlassian.com/manage-profile/security/api-tokens\n' +
      '2. Crea un nuevo token\n' +
      '3. Copia y pega aquí\n\n' +
      'API Token:',
      ui.ButtonSet.OK_CANCEL
    );
    
    if (tokenResponse.getSelectedButton() !== ui.Button.OK) {
      ui.alert('⚠️ Configuración Cancelada', 'La configuración de credenciales fue cancelada.', ui.ButtonSet.OK);
      return;
    }
    
    const apiToken = tokenResponse.getResponseText().trim();
    if (!apiToken || apiToken.length < 20) {
      throw new Error('API Token inválido. Debe tener al menos 20 caracteres.');
    }
    
    // Validar credenciales con test de conexión
    ui.alert('🔍 Validando Credenciales', 'Probando conexión con Jira...', ui.ButtonSet.OK);
    
    const testUrl = `https://ccsoft.atlassian.net/rest/api/3/myself`;
    const opciones = {
      method: 'GET',
      headers: {
        'Authorization': `Basic ${Utilities.base64Encode(email + ':' + apiToken)}`,
        'Accept': 'application/json'
      },
      muteHttpExceptions: true
    };
    
    const respuesta = UrlFetchApp.fetch(testUrl, opciones);
    
    if (respuesta.getResponseCode() !== 200) {
      throw new Error(`Credenciales inválidas. Error ${respuesta.getResponseCode()}: ${respuesta.getContentText()}`);
    }
    
    const usuario = JSON.parse(respuesta.getContentText());
    
    // Guardar credenciales
    const propiedades = PropertiesService.getScriptProperties();
    propiedades.setProperties({
      'JIRA_EMAIL_VALIDACION': email,
      'JIRA_API_TOKEN_VALIDACION': apiToken
    });
    
    ui.alert(
      '✅ Credenciales Configuradas',
      `🎉 Configuración exitosa!\n\n` +
      `👤 Usuario: ${usuario.displayName}\n` +
      `📧 Email: ${usuario.emailAddress}\n` +
      `🏢 Dominio: ccsoft.atlassian.net\n\n` +
      `🔒 Las credenciales se han guardado de forma segura.\n` +
      `✅ Sistema listo para generar reportes de validación.`,
      ui.ButtonSet.OK
    );
    
    Logger.log(`✅ Credenciales configuradas para usuario: ${usuario.displayName}`);
    
  } catch (error) {
    Logger.log(`❌ Error configurando credenciales: ${error.message}`);
    ui.alert(
      '❌ Error de Configuración',
      `Error configurando credenciales:\n\n${error.message}\n\n` +
      `💡 Verificar:\n` +
      `• Email válido de Jira\n` +
      `• API Token correcto y no expirado\n` +
      `• Permisos en Jira Cloud\n` +
      `• Conexión a internet`,
      ui.ButtonSet.OK
    );
  }
}

/**
 * Configuración de estructura de hojas para reportes
 */
const CONFIG_HOJAS_REPORTE = {
  prefijo: "ValidacionBacklog",
  timestamp: true,
  hojas: {
    dashboard: {
      nombre: "Dashboard",
      descripcion: "Resumen ejecutivo de validación",
      orden: 1
    },
    detalle: {
      nombre: "Detalle_Tareas",
      descripcion: "Lista completa de tareas con validación",
      orden: 2
    },
    metricas: {
      nombre: "Metricas_Equipos", 
      descripcion: "Análisis por área y equipo",
      orden: 3
    },
    seguimiento: {
      nombre: "Seguimiento_Semanal",
      descripcion: "Distribución temporal por semanas",
      orden: 4
    }
  }
};

/**
 * Configuración de caché para validación
 */
const CONFIG_CACHE_VALIDACION = {
  prefijo: "VALIDACION_BACKLOG",
  ttl: {
    tareas: 300, // 5 minutos
    validacion: 600, // 10 minutos
    reportes: 900 // 15 minutos
  },
  limpiarAnterior: true
};

/**
 * JQL Templates para diferentes tipos de consulta
 */
const JQL_TEMPLATES = {
  backlogBasico: `
    project IN ({proyectos}) 
    AND status NOT IN (Done,Closed,Resolved,Listo,Cerrado,Completado)
    AND duedate >= "{fechaInicio}"
    AND duedate <= "{fechaFin}"
    ORDER BY duedate ASC, project ASC, assignee ASC
  `,
  
  conEtiquetasSemana: `
    project IN ({proyectos}) 
    AND status NOT IN (Done,Closed,Resolved,Listo,Cerrado,Completado)
    AND labels IN (SEMANA_1,SEMANA_2,SEMANA_3,SEMANA_4,SEMANA_5)
    ORDER BY labels ASC, duedate ASC
  `,
  
  sinValidacion: `
    project IN ({proyectos})
    AND status NOT IN (Done,Closed,Resolved,Listo,Cerrado,Completado)
    AND (
      customfield_10016 IS EMPTY 
      OR labels NOT IN (SEMANA_1,SEMANA_2,SEMANA_3,SEMANA_4,SEMANA_5)
      OR duedate IS EMPTY
    )
    ORDER BY priority DESC, created DESC
  `
};

/**
 * Campos requeridos para validación
 */
const CAMPOS_JIRA_VALIDACION = [
  'key', 'summary', 'status', 'assignee', 'duedate', 'project', 'issuetype',
  'labels', 'priority', 'created', 'updated', 'description',
  'customfield_10016', // Story Points
  'timetracking', // Estimación en horas
  'customfield_10020', // Sprint
  'customfield_10231', // Área Funcional
  'customfield_10230'  // Desviaciones
];

/**
 * Mensajes y textos del sistema
 */
const MENSAJES_SISTEMA = {
  titulo: '📊 Sistema de Validación de Backlog CCsoft',
  
  estados: {
    excelente: { emoji: '🟢', texto: 'Excelente', color: '#d4edda' },
    bueno: { emoji: '🟡', texto: 'Bueno', color: '#fff3cd' },
    aceptable: { emoji: '🟠', texto: 'Aceptable', color: '#ffeaa7' },
    critico: { emoji: '🔴', texto: 'Crítico', color: '#ffcdd2' }
  },
  
  validaciones: {
    tiempoEstimado: {
      valido: '✅ Tiempo estimado configurado',
      invalido: '❌ Sin tiempo estimado',
      recomendacion: 'Agregar Story Points o estimación en horas'
    },
    etiquetaSemana: {
      valido: '✅ Etiqueta de semana válida',
      invalido: '❌ Sin etiqueta de semana válida',
      recomendacion: 'Agregar etiqueta SEMANA_X (1-5)'
    },
    fechaVencimiento: {
      valido: '✅ Fecha de vencimiento establecida',
      invalido: '❌ Sin fecha de vencimiento',
      recomendacion: 'Establecer fecha de vencimiento'
    },
    alineacionFecha: {
      valido: '✅ Fecha alineada con etiqueta',
      invalido: '❌ Fecha no alineada con etiqueta',
      recomendacion: 'Alinear fecha con semana planificada'
    }
  }
};

/**
 * Configuración de formato para Google Sheets
 */
const CONFIG_FORMATO_SHEETS = {
  colores: {
    header: '#1565c0',
    headerText: 'white',
    alternateRow: '#f8f9fa',
    border: '#e0e0e0'
  },
  
  fuentes: {
    titulo: { size: 18, weight: 'bold' },
    subtitulo: { size: 14, weight: 'bold' },
    header: { size: 11, weight: 'bold' },
    normal: { size: 10, weight: 'normal' }
  },
  
  anchos: {
    clave: 80,
    resumen: 300,
    proyecto: 80,
    responsable: 120,
    fecha: 100,
    etiqueta: 100,
    estado: 120,
    puntaje: 80,
    recomendaciones: 250
  }
};

Logger.log(`✅ Configuración de Validación de Backlog v${METADATA_VALIDACION.version} cargada`);
Logger.log(`📊 Proyectos prioritarios: ${CONFIG_VALIDACION_BACKLOG.EQUIPOS.proyectosPrioritarios.join(', ')}`);
Logger.log(`🎯 Criterios de validación: Tiempo estimado, Etiquetas semana, Fechas alineadas`);