/**
 * Crea una hoja personalizada para un proyecto específico
 */
function crearHojaProyecto(proyecto, nombreHoja) {
  try {
    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    
    // Eliminar hoja existente si existe
    let sheet = spreadsheet.getSheetByName(nombreHoja);
    if (sheet) {
      spreadsheet.deleteSheet(sheet);
    }
    
    // Crear nueva hoja
    sheet = spreadsheet.insertSheet(nombreHoja);
    
    // Obtener esquema de campos para el proyecto
    const esquemaCampos = obtenerEsquemaCamposProyecto(proyecto.key);
    
    // Definir campos obligatorios y opcionales
    const { camposObligatorios, camposOpcionales } = clasificarCampos(esquemaCampos, proyecto);
    
    // Crear headers combinados
    const todosLosCampos = [...camposObligatorios, ...camposOpcionales];
    const headers = todosLosCampos.map(campo => campo.nombre);
    
    // Escribir headers
    const headerRange = sheet.getRange(1, 1, 1, headers.length);
    headerRange.setValues([headers]);
    headerRange.setFontWeight('bold');
    headerRange.setFontColor('#ffffff');
    headerRange.setHorizontalAlignment('center');
    headerRange.setVerticalAlignment('middle');
    
    // Aplicar colores por tipo de campo
    for (let i = 0; i < todosLosCampos.length; i++) {
      const campo = todosLosCampos[i];
      const celda = sheet.getRange(1, i + 1);
      
      if (campo.obligatorio) {
        // Campos obligatorios en ROJO
        celda.setBackground('#dc3545'); // Rojo Bootstrap
        celda.setNote(`❗ CAMPO OBLIGATORIO\n\n${campo.descripcion}\n\nTipo: ${campo.tipo}\nEjemplo: ${campo.ejemplo}`);
      } else {
        // Campos opcionales en AZUL
        celda.setBackground('#4a90e2'); // Azul corporativo
        celda.setNote(`ℹ️ Campo Opcional\n\n${campo.descripcion}\n\nTipo: ${campo.tipo}\nEjemplo: ${campo.ejemplo}`);
      }
    }
    
    // Agregar información del proyecto en las primeras filas
    sheet.insertRows(1, 4);
    
    // Información del proyecto
    sheet.getRange(1, 1).setValue(`📁 PROYECTO: ${proyecto.key} - ${proyecto.name}`)
      .setFontWeight('bold').setFontSize(16).setBackground('#1e3c72').setFontColor('#ffffff');
    
    sheet.getRange(2, 1).setValue(`👤 Líder: ${proyecto.lead}`)
      .setBackground('#e8f2ff').setFontWeight('bold');
    sheet.getRange(2, 3).setValue(`🎯 Tipo: ${proyecto.projectTypeKey}`)
      .setBackground('#e8f2ff').setFontWeight('bold');
    
    sheet.getRange(3, 1).setValue(`📋 Issue Types: ${proyecto.issueTypes.map(it => it.name).join(', ')}`)
      .setBackground('#f8fcff').setWrap(true);
    
    // Leyenda de colores
    sheet.getRange(4, 1).setValue('LEYENDA:')
      .setFontWeight('bold').setBackground('#f0f0f0');
    sheet.getRange(4, 2).setValue('🔴 Obligatorio')
      .setBackground('#dc3545').setFontColor('#ffffff').setFontWeight('bold');
    sheet.getRange(4, 3).setValue('🔵 Opcional')
      .setBackground('#4a90e2').setFontColor('#ffffff').setFontWeight('bold');
    
    // Ajustar el rango de headers (ahora en fila 5)
    const headerRangeAjustado = sheet.getRange(5, 1, 1, headers.length);
    headerRangeAjustado.setValues([headers]);
    headerRangeAjustado.setFontWeight('bold');
    headerRangeAjustado.setFontColor('#ffffff');
    headerRangeAjustado.setHorizontalAlignment('center');
    headerRangeAjustado.setVerticalAlignment('middle');
    
    // Aplicar colores a headers ajustados
    for (let i = 0; i < todosLosCampos.length; i++) {
      const campo = todosLosCampos[i];
      const celda = sheet.getRange(5, i + 1);
      
      if (campo.obligatorio) {
        celda.setBackground('#dc3545');
        celda.setNote(`❗ CAMPO OBLIGATORIO\n\n${campo.descripcion}\n\nTipo: ${campo.tipo}\nEjemplo: ${campo.ejemplo}`);
      } else {
        celda.setBackground('#4a90e2');
        celda.setNote(`ℹ️ Campo Opcional\n\n${campo.descripcion}\n\nTipo: ${campo.tipo}\nEjemplo: ${campo.ejemplo}`);
      }
    }
    
    // Agregar algunas filas de ejemplo con validación
    const filasEjemplo = generarFilasEjemplo(todosLosCampos, proyecto);
    if (filasEjemplo.length > 0) {
      const dataRange = sheet.getRange(6, 1, filasEjemplo.length, headers.length);
      dataRange.setValues(filasEjemplo);
      
      // Aplicar formato alternado
      for (let i = 0; i < filasEjemplo.length; i++) {
        const rowRange = sheet.getRange(i + 6, 1, 1, headers.length);
        if (i % 2 === 0) {
          rowRange.setBackground('#f8fcff'); // Azul muy claro
        } else {
          rowRange.setBackground('#ffffff'); // Blanco
        }
      }
    }
    
    // Configurar validación de datos para campos específicos
    configurarValidacionCampos(sheet, todosLosCampos, 6);
    
    // Autoajustar columnas
    sheet.autoResizeColumns(1, headers.length);
    
    // Agregar bordes
    const rangeTotal = sheet.getRange(1, 1, Math.max(10, filasEjemplo.length + 6), headers.length);
    rangeTotal.setBorder(true, true, true, true, true, true, '#4a90e2', SpreadsheetApp.BorderStyle.SOLID);
    
    // Proteger filas de información (1-4)
    const protectedRange = sheet.getRange(1, 1, 4, headers.length);
    const protection = protectedRange.protect();
    protection.setDescription('Información del proyecto - No editable');
    protection.setWarningOnly(true);
    
    return {
      hoja: nombreHoja,
      camposObligatorios: camposObligatorios.length,
      camposOpcionales: camposOpcionales.length,
      totalCampos: todosLosCampos.length
    };
    
  } catch (error) {
    console.error('Error creando hoja de proyecto:', error);
    throw error;
  }
}

/**
 * Obtiene el esquema de campos para un proyecto específico
 */
function obtenerEsquemaCamposProyecto(projectKey) {
  return obtenerConCache(`esquema_${projectKey}`, () => {
    try {
      // Obtener esquema de creación de issues para el proyecto
      const response = UrlFetchApp.fetch(
        `https://api.atlassian.com/ex/jira/${CONFIG.CLOUD_ID}/rest/api/3/issue/createmeta?projectKeys=${projectKey}&expand=projects.issuetypes.fields`,
        {
          method: 'GET',
          headers: {
            'Authorization': 'Basic ' + Utilities.base64Encode(`${CONFIG.ATLASSIAN_EMAIL}:${CONFIG.ATLASSIAN_API_TOKEN}`),
            'Accept': 'application/json'
          }
        }
      );
      
      if (response.getResponseCode() !== 200) {
        throw new Error(`Error ${response.getResponseCode()}: ${response.getContentText()}`);
      }
      
      const data = JSON.parse(response.getContentText());
      
      if (!data.projects || data.projects.length === 0) {
        throw new Error('No se encontró información del proyecto');
      }
      
      const proyecto = data.projects[0];
      const campos = new Map();
      
      // Recopilar campos únicos de todos los tipos de issue
      proyecto.issuetypes.forEach(issueType => {
        Object.entries(issueType.fields).forEach(([fieldId, fieldInfo]) => {
          if (!campos.has(fieldId)) {
            campos.set(fieldId, {
              id: fieldId,
              nombre: fieldInfo.name,
              descripcion: fieldInfo.description || 'Sin descripción',
              tipo: fieldInfo.schema?.type || 'unknown',
              obligatorio: fieldInfo.required || false,
              operaciones: fieldInfo.operations || [],
              valores: fieldInfo.allowedValues || null
            });
          }
        });
      });
      
      return Array.from(campos.values());
      
    } catch (error) {
      console.error('Error obteniendo esquema de campos:', error);
      throw error;
    }
  });
}

/**
 * Clasifica campos en obligatorios y opcionales
 */
function clasificarCampos(esquemaCampos, proyecto) {
  const camposObligatorios = [];
  const camposOpcionales = [];
  
  // Campos base que siempre incluir
  const camposBase = [
    {
      id: 'summary',
      nombre: 'Título/Resumen',
      descripcion: 'Título descriptivo de la tarea',
      tipo: 'string',
      obligatorio: true,
      ejemplo: 'MT para validación de firma HMAC'
    },
    {
      id: 'description',
      nombre: 'Descripción',
      descripcion: 'Descripción detallada de la tarea',
      tipo: 'string',
      obligatorio: true,
      ejemplo: 'Implementar validación de firma X-Missive-Signature'
    },
    {
      id: 'issuetype',
      nombre: 'Tipo de Issue',
      descripcion: 'Tipo de tarea (Tarea, Bug, Historia, etc.)',
      tipo: 'issuetype',
      obligatorio: true,
      ejemplo: 'Tarea'
    },
    {
      id: 'priority',
      nombre: 'Prioridad',
      descripcion: 'Nivel de prioridad de la tarea',
      tipo: 'priority',
      obligatorio: false,
      ejemplo: 'Alta'
    },
    {
      id: 'assignee',
      nombre: 'Asignado',
      descripcion: 'Usuario responsable de la tarea',
      tipo: 'user',
      obligatorio: false,
      ejemplo: 'evert.romero@computocontable.com'
    },
    {
      id: 'labels',
      nombre: 'Etiquetas',
      descripcion: 'Etiquetas para categorizar la tarea',
      tipo: 'array',
      obligatorio: false,
      ejemplo: 'SEMANA_4, BACKEND'
    },
    {
      id: 'duedate',
      nombre: 'Fecha Límite',
      descripcion: 'Fecha límite para completar la tarea',
      tipo: 'date',
      obligatorio: false,
      ejemplo: '2025-08-23'
    }
  ];
  
  // Agregar campos base
  camposBase.forEach(campo => {
    if (campo.obligatorio) {
      camposObligatorios.push(campo);
    } else {
      camposOpcionales.push(campo);
    }
  });
  
  // Agregar campos específicos del proyecto
  esquemaCampos.forEach(campo => {
    // Filtrar campos que ya están en camposBase
    if (!camposBase.some(base => base.id === campo.id)) {
      const campoPersonalizado = {
        id: campo.id,
        nombre: campo.nombre,
        descripcion: campo.descripcion,
        tipo: campo.tipo,
        obligatorio: campo.obligatorio,
        ejemplo: generarEjemploCampo(campo)
      };
      
      if (campo.obligatorio) {
        camposObligatorios.push(campoPersonalizado);
      } else {
        camposOpcionales.push(campoPersonalizado);
      }
    }
  });
  
  return { camposObligatorios, camposOpcionales };
}

/**
 * Genera ejemplo para un campo específico
 */
function generarEjemploCampo(campo) {
  switch (campo.tipo) {
    case 'string':
      return campo.nombre.includes('email') ? 'usuario@computocontable.com' : 'Texto de ejemplo';
    case 'number':
      return '123';
    case 'date':
      return '2025-08-23';
    case 'datetime':
      return '2025-08-23T10:30:00.000Z';
    case 'user':
      return 'evert.romero@computocontable.com';
    case 'array':
      return 'valor1, valor2';
    case 'option':
      return campo.valores && campo.valores.length > 0 ? campo.valores[0].value : 'opción';
    case 'timetracking':
      return '2h 30m';
    default:
      return 'Ejemplo';
  }
}

/**
 * Genera filas de ejemplo para la hoja
 */
function generarFilasEjemplo(campos, proyecto) {
  const ejemplos = [];
  
  // Generar 3 filas de ejemplo
  for (let i = 1; i <= 3; i++) {
    const fila = campos.map(campo => {
      switch (campo.id) {
        /**
 * Muestra usuarios del proyecto
 */
function mostrarUsuariosProyecto() {
  const ui = SpreadsheetApp.getUi();
  
  try {
    if (!CONFIG.ATLASSIAN_EMAIL || !CONFIG.ATLASSIAN_API_TOKEN) {
      ui.alert('❌ Configuración Requerida', 'Configura tus credenciales primero.', ui.ButtonSet.OK);
      return;
    }
    
    let mensaje = '👥 USUARIOS CONFIGURADOS\n\n';
    
    // Mostrar mapeo actual
    Object.entries(CONFIG.USER_MAPPING).forEach(([email, accountId]) => {
      mensaje += `📧 ${email}\n`;
      mensaje += `🆔 ${accountId}\n\n`;
    });
    
    mensaje += '💡 CONSEJOS:\n';
    mensaje += '• Para agregar más usuarios, edita USER_MAPPING en el código\n';
    mensaje += '• Los Account IDs se obtienen desde la API de Jira\n';
    mensaje += '• Usa el diagnóstico completo para verificar usuarios';
    
    ui.alert('Usuarios del Proyecto', mensaje, ui.ButtonSet.OK);
    
  } catch (error) {
    ui.alert('❌ Error', `Error mostrando usuarios: ${error.message}`, ui.ButtonSet.OK);
  }
}

/**
 * Muestra permisos detallados
 */
function mostrarPermisos() {
  const ui = SpreadsheetApp.getUi();
  
  try {
    if (!CONFIG.ATLASSIAN_EMAIL || !CONFIG.ATLASSIAN_API_TOKEN) {
      ui.alert('❌ Configuración Requerida', 'Configura tus credenciales primero.', ui.ButtonSet.OK);
      return;
    }
    
    const permisos = verificarPermisos();
    
    let mensaje = '🔐 PERMISOS EN JIRA\n\n';
    mensaje += `📁 Proyecto: ${CONFIG.PROJECT_KEY}\n\n`;
    
    mensaje += '✅ PERMISOS BÁSICOS:\n';
    mensaje += `📝 Crear issues: ${permisos.canCreate ? '✅ Sí' : '❌ No'}\n`;
    mensaje += `✏️ Editar issues: ${permisos.canEdit ? '✅ Sí' : '❌ No'}\n`;
    mensaje += `👥 Asignar issues: ${permisos.canAssign ? '✅ Sí' : '❌ No'}\n`;
    mensaje += `💬 Añadir comentarios: ${permisos.canComment ? '✅ Sí' : '❌ No'}\n\n`;
    
    if (!permisos.canCreate) {
      mensaje += '⚠️ ADVERTENCIA:\n';
      mensaje += 'No tienes permisos para crear issues.\n';
      mensaje += 'Contacta al administrador de Jira.\n\n';
    }
    
    mensaje += '💡 NOTAS:\n';
    mensaje += '• Los permisos pueden variar según el tipo de issue\n';
    mensaje += '• Algunos permisos requieren rol específico en el proyecto';
    
    ui.alert('Permisos de Usuario', mensaje, ui.ButtonSet.OK);
    
  } catch (error) {
    ui.alert('❌ Error', `Error verificando permisos: ${error.message}`, ui.ButtonSet.OK);
  }
}

/**
 * Sincroniza estado de tareas con Jira
 */
function sincronizarConJira() {
  const ui = SpreadsheetApp.getUi();
  
  try {
    if (!CONFIG.ATLASSIAN_EMAIL || !CONFIG.ATLASSIAN_API_TOKEN) {
      ui.alert('❌ Configuración Requerida', 'Configura tus credenciales primero.', ui.ButtonSet.OK);
      return;
    }
    
    const confirmacion = ui.alert(
      '🔄 Sincronizar con Jira',
      '¿Deseas sincronizar el estado de las tareas en la hoja con Jira?\n\nEsto actualizará información como estado, asignado, etc.',
      ui.ButtonSet.YES_NO
    );
    
    if (confirmacion !== ui.Button.YES) {
      return;
    }
    
    // Obtener datos de la hoja
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(CONFIG.SHEET_NAME);
    if (!sheet) {
      ui.alert('❌ Error', `No se encontró la hoja "${CONFIG.SHEET_NAME}"`, ui.ButtonSet.OK);
      return;
    }
    
    const range = sheet.getDataRange();
    const values = range.getValues();
    
    if (values.length < 2) {
      ui.alert('❌ Error', 'La hoja no contiene datos para sincronizar', ui.ButtonSet.OK);
      return;
    }
    
    let sincronizadas = 0;
    let errores = 0;
    
    // Procesar cada fila (omitir header)
    for (let i = 1; i < values.length; i++) {
      const fila = values[i];
      const titulo = fila[0];
      
      try {
        // Buscar tarea en Jira por título
        const busqueda = buscarTareasPorTitulo(titulo);
        
        if (busqueda.length > 0) {
          const tarea = busqueda[0];
          
          // Actualizar información en la hoja
          sheet.getRange(i + 1, values[0].length + 1).setValue(tarea.key); // Agregar clave si no existe
          sheet.getRange(i + 1, values[0].length + 2).setValue(tarea.status); // Estado actual
          
          sincronizadas++;
        }
        
      } catch (error) {
        console.error(`Error sincronizando fila ${i + 1}:`, error);
        errores++;
      }
    }
    
    ui.alert('✅ Sincronización Completa', 
             `🔄 Tareas sincronizadas: ${sincronizadas}\n❌ Errores: ${errores}`, 
             ui.ButtonSet.OK);
    
  } catch (error) {
    ui.alert('❌ Error', `Error en sincronización: ${error.message}`, ui.ButtonSet.OK);
  }
}

/**
 * Busca tareas en Jira por título
 */
function buscarTareasPorTitulo(titulo) {
  try {
    const jql = `project = ${CONFIG.PROJECT_KEY} AND summary ~ "${titulo.replace(/"/g, '\\"')}"`;
    
    const response = UrlFetchApp.fetch(
      `https://api.atlassian.com/ex/jira/${CONFIG.CLOUD_ID}/rest/api/3/search?jql=${encodeURIComponent(jql)}&maxResults=5`,
      {
        method: 'GET',
        headers: {
          'Authorization': 'Basic ' + Utilities.base64Encode(`${CONFIG.ATLASSIAN_EMAIL}:${CONFIG.ATLASSIAN_API_TOKEN}`),
          'Accept': 'application/json'
        }
      }
    );
    
    if (response.getResponseCode() !== 200) {
      return [];
    }
    
    const data = JSON.parse(response.getContentText());
    return data.issues.map(issue => ({
      key: issue.key,
      summary: issue.fields.summary,
      status: issue.fields.status.name,
      assignee: issue.fields.assignee?.displayName || 'Sin asignar'
    }));
    
  } catch (error) {
    console.error('Error buscando tareas:', error);
    return [];
  }
}

/**
 * Muestra estadísticas de uso
 */
function mostrarEstadisticasUso() {
  const ui = SpreadsheetApp.getUi();
  
  try {
    // Obtener estadísticas del cache y propiedades
    const properties = PropertiesService.getScriptProperties();
    const cache = CacheService.getScriptCache();
    
    let mensaje = '📈 ESTADÍSTICAS DE USO\n\n';
    
    // Información de configuración
    mensaje += '⚙️ CONFIGURACIÓN:\n';
    mensaje += `📧 Email configurado: ${CONFIG.ATLASSIAN_EMAIL ? '✅' : '❌'}\n`;
    mensaje += `🔑 Token configurado: ${CONFIG.ATLASSIAN_API_TOKEN ? '✅' : '❌'}\n\n`;
    
    // Estado del cache
    mensaje += '💾 CACHE:\n';
    const cacheKeys = ['user_info', 'cloud_ids', 'custom_fields', 'projects'];
    let elementosCacheados = 0;
    
    cacheKeys.forEach(key => {
      const cached = cache.get(key);
      if (cached) elementosCacheados++;
      mensaje += `• ${key}: ${cached ? '✅ Activo' : '❌ Vacío'}\n`;
    });
    
    mensaje += `\n📊 Eficiencia del cache: ${Math.round((elementosCacheados / cacheKeys.length) * 100)}%\n\n`;
    
    // Información de la hoja
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(CONFIG.SHEET_NAME);
    if (sheet) {
      const range = sheet.getDataRange();
      mensaje += '📋 HOJA DE DATOS:\n';
      mensaje += `📄 Nombre: ${CONFIG.SHEET_NAME}\n`;
      mensaje += `📊 Filas totales: ${range.getNumRows()}\n`;
      mensaje += `📋 Tareas pendientes: ${Math.max(0, range.getNumRows() - 1)}\n`;
      mensaje += `📅 Última modificación: ${Utilities.formatDate(sheet.getLastUpdated(), Session.getScriptTimeZone(), 'dd/MM/yyyy HH:mm')}\n\n`;
    }
    
    // Consejos de optimización
    mensaje += '💡 CONSEJOS DE OPTIMIZACIÓN:\n';
    if (elementosCacheados < cacheKeys.length) {
      mensaje += '• Ejecuta un diagnóstico completo para llenar el cache\n';
    }
    if (sheet && sheet.getDataRange().getNumRows() > 100) {
      mensaje += '• Considera dividir tareas grandes en lotes más pequeños\n';
    }
    mensaje += '• Limpia el cache semanalmente para mejor rendimiento\n';
    mensaje += '• Usa la sincronización para mantener datos actualizados';
    
    ui.alert('Estadísticas de Uso', mensaje, ui.ButtonSet.OK);
    
  } catch (error) {
    ui.alert('❌ Error', `Error obteniendo estadísticas: ${error.message}`, ui.ButtonSet.OK);
  }
}

/**
 * Centro de ayuda con documentación
 */
function mostrarCentroAyuda() {
  const ui = SpreadsheetApp.getUi();
  
  let mensaje = '🆘 CENTRO DE AYUDA - JIRA TASKS PRO\n\n';
  
  mensaje += '🚀 INICIO RÁPIDO:\n';
  mensaje += '1. Configura credenciales (⚙️ → 🔐 Configurar Credenciales)\n';
  mensaje += '2. Ejecuta diagnóstico (⚙️ → 🔍 Diagnóstico Completo)\n';
  mensaje += '3. Crea hoja ejemplo (📋 → 📄 Crear Hoja de Ejemplo)\n';
  mensaje += '4. Crea tareas (📋 → 🚀 Crear Tareas Masivas)\n\n';
  
  mensaje += '❓ PROBLEMAS COMUNES:\n\n';
  mensaje += '🔐 "Error de autenticación":\n';
  mensaje += '• Verifica email y API token\n';
  mensaje += '• Genera nuevo token en Atlassian\n';
  mensaje += '• Ejecuta prueba de configuración\n\n';
  
  mensaje += '🚫 "Sin permisos para crear":\n';
  mensaje += '• Contacta administrador de Jira\n';
  mensaje += '• Verifica rol en proyecto BDMS\n';
  mensaje += '• Usa diagnóstico de permisos\n\n';
  
  mensaje += '⏱️ "Proceso muy lento":\n';
  mensaje += '• Limpia cache del sistema\n';
  mensaje += '• Reduce número de tareas por lote\n';
  mensaje += '• Verifica conexión a internet\n\n';
  
  mensaje += '📊 "Error en formato de datos":\n';
  mensaje += '• Usa hoja de ejemplo como plantilla\n';
  mensaje += '• Verifica formatos de fecha y estimación\n';
  mensaje += '• Ejecuta validación antes de crear\n\n';
  
  mensaje += '🔗 RECURSOS:\n';
  mensaje += '• API Token: https://id.atlassian.com/manage-profile/security/api-tokens\n';
  mensaje += '• Documentación Jira: https://developer.atlassian.com/cloud/jira/\n';
  mensaje += '• Soporte: Contacta al equipo de infraestructura\n\n';
  
  mensaje += '⚡ CARACTERÍSTICAS AVANZADAS:\n';
  mensaje += '• Cache inteligente para mejor rendimiento\n';
  mensaje += '• Validación automática de datos\n';
  mensaje += '• Sincronización bidireccional con Jira\n';
  mensaje += '• Reportes detallados de ejecución\n';
  mensaje += '• Diagnósticos completos del sistema';
  
  ui.alert('Centro de Ayuda', mensaje, ui.ButtonSet.OK);
}

// ================================
// GENERACIÓN DE HOJAS POR PROYECTO
// ================================

/**
 * Genera hojas personalizadas para cada proyecto disponible
 */
function generarHojasPorProyecto() {
  const ui = SpreadsheetApp.getUi();
  
  try {
    if (!CONFIG.ATLASSIAN_EMAIL || !CONFIG.ATLASSIAN_API_TOKEN) {
      ui.alert('❌ Configuración Requerida', 'Por favor configura tus credenciales primero.', ui.ButtonSet.OK);
      return;
    }
    
    console.log('🏗️ Iniciando generación de hojas por proyecto...');
    
    // Obtener proyectos disponibles
    const proyectos = obtenerProyectosDetallados();
    
    if (proyectos.length === 0) {
      ui.alert('❌ Sin Proyectos', 'No se encontraron proyectos accesibles.', ui.ButtonSet.OK);
      return;
    }
    
    // Mostrar diálogo de selección
    const proyectosSeleccionados = mostrarDialogoSeleccionProyectos(proyectos);
    
    if (!proyectosSeleccionados || proyectosSeleccionados.length === 0) {
      return;
    }
    
    const confirmacion = ui.alert(
      '🏗️ Confirmar Generación',
      `Se crearán ${proyectosSeleccionados.length} hojas nuevas.\n\n¿Deseas continuar?`,
      ui.ButtonSet.YES_NO
    );
    
    if (confirmacion !== ui.Button.YES) {
      return;
    }
    
    // Generar hojas para cada proyecto seleccionado
    const resultados = [];
    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    
    for (const proyecto of proyectosSeleccionados) {
      try {
        console.log(`📋 Generando hoja para proyecto: ${proyecto.key}`);
        
        const nombreHoja = `${proyecto.key}_Template`;
        const hojaGenerada = crearHojaProyecto(proyecto, nombreHoja);
        
        resultados.push({
          proyecto: proyecto.key,
          nombre: proyecto.name,
          hoja: nombreHoja,
          estado: 'Creada',
          camposObligatorios: hojaGenerada.camposObligatorios,
          camposOpcionales: hojaGenerada.camposOpcionales
        });
        
      } catch (error) {
        console.error(`Error creando hoja para ${proyecto.key}:`, error);
        resultados.push({
          proyecto: proyecto.key,
          nombre: proyecto.name,
          hoja: `${proyecto.key}_Template`,
          estado: 'Error',
          error: error.message
        });
      }
    }
    
    // Mostrar resumen
    mostrarResumenGeneracionHojas(resultados);
    
  } catch (error) {
    console.error('Error en generarHojasPorProyecto:', error);
    ui.alert('❌ Error', `Error generando hojas: ${error.message}`, ui.ButtonSet.OK);
  }
}

/**
 * Obtiene proyectos con información detallada
 */
function obtenerProyectosDetallados() {
  return obtenerConCache('proyectos_detallados', () => {
    try {
      const response = UrlFetchApp.fetch(
        `https://api.atlassian.com/ex/jira/${CONFIG.CLOUD_ID}/rest/api/3/project/search?expand=description,lead,issueTypes`,
        {
          method: 'GET',
          headers: {
            'Authorization': 'Basic ' + Utilities.base64Encode(`${CONFIG.ATLASSIAN_EMAIL}:${CONFIG.ATLASSIAN_API_TOKEN}`),
            'Accept': 'application/json'
          }
        }
      );
      
      if (response.getResponseCode() !== 200) {
        throw new Error(`Error ${response.getResponseCode()}: ${response.getContentText()}`);
      }
      
      const data = JSON.parse(response.getContentText());
      return data.values.map(proyecto => ({
        key: proyecto.key,
        name: proyecto.name,
        description: proyecto.description || 'Sin descripción',
        projectTypeKey: proyecto.projectTypeKey,
        lead: proyecto.lead?.displayName || 'Sin líder',
        issueTypes: proyecto.issueTypes || []
      }));
      
    } catch (error) {
      console.error('Error obteniendo proyectos detallados:', error);
      throw error;
    }
  });
}

/**
 * Muestra diálogo para seleccionar proyectos
 */
function mostrarDialogoSeleccionProyectos(proyectos) {
  const ui = SpreadsheetApp.getUi();
  
  try {
    // Crear HTML para selección múltiple
    const htmlTemplate = HtmlService.createTemplate(`
      <!DOCTYPE html>
      <html>
        <head>
          <base target="_top">
          <style>
            body {
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
              margin: 0;
              padding: 20px;
              background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
              min-height: 100vh;
            }
            .container {
              background: white;
              padding: 25px;
              border-radius: 12px;
              box-shadow: 0 8px 32px rgba(30, 60, 114, 0.3);
              max-width: 600px;
              margin: 0 auto;
            }
            .header {
              text-align: center;
              margin-bottom: 25px;
              color: #1e3c72;
            }
            .project-list {
              max-height: 400px;
              overflow-y: auto;
              border: 1px solid #e1ecf4;
              border-radius: 8px;
              padding: 15px;
              background: #f8fcff;
            }
            .project-item {
              display: flex;
              align-items: center;
              padding: 12px;
              margin-bottom: 10px;
              background: white;
              border-radius: 8px;
              border: 1px solid #e1ecf4;
              transition: all 0.3s ease;
            }
            .project-item:hover {
              border-color: #4a90e2;
              box-shadow: 0 2px 8px rgba(74, 144, 226, 0.1);
            }
            .project-checkbox {
              margin-right: 12px;
              transform: scale(1.2);
            }
            .project-info {
              flex: 1;
            }
            .project-key {
              font-weight: bold;
              color: #1e3c72;
              font-size: 16px;
            }
            .project-name {
              color: #666;
              font-size: 14px;
              margin-top: 2px;
            }
            .project-meta {
              font-size: 12px;
              color: #999;
              margin-top: 4px;
            }
            .button-group {
              text-align: center;
              margin-top: 25px;
              padding-top: 20px;
              border-top: 1px solid #e8f2ff;
            }
            button {
              padding: 12px 24px;
              border: none;
              border-radius: 8px;
              font-weight: 600;
              cursor: pointer;
              margin: 0 8px;
              transition: all 0.3s ease;
            }
            .primary-btn {
              background: linear-gradient(135deg, #4a90e2 0%, #357abd 100%);
              color: white;
            }
            .secondary-btn {
              background: #f8f9fa;
              color: #6c757d;
              border: 1px solid #dee2e6;
            }
            .select-all-btn {
              background: linear-gradient(135deg, #28a745 0%, #20963b 100%);
              color: white;
              margin-bottom: 15px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h2>🏗️ Seleccionar Proyectos</h2>
              <p>Elige los proyectos para los cuales generar hojas personalizadas</p>
            </div>
            
            <button type="button" class="select-all-btn" onclick="toggleSelectAll()">
              📋 Seleccionar Todos
            </button>
            
            <div class="project-list">
              <% proyectos.forEach(function(proyecto, index) { %>
                <div class="project-item">
                  <input type="checkbox" class="project-checkbox" id="proyecto_<%= index %>" 
                         value="<%= proyecto.key %>" data-name="<%= proyecto.name %>">
                  <div class="project-info">
                    <div class="project-key"><%= proyecto.key %></div>
                    <div class="project-name"><%= proyecto.name %></div>
                    <div class="project-meta">
                      👤 <strong>Líder:</strong> <%= proyecto.lead %> | 
                      🎯 <strong>Tipo:</strong> <%= proyecto.projectTypeKey %> |
                      📋 <strong>Issue Types:</strong> <%= proyecto.issueTypes.length %>
                    </div>
                  </div>
                </div>
              <% }); %>
            </div>
            
            <div class="button-group">
              <button type="button" class="secondary-btn" onclick="google.script.host.close()">
                ❌ Cancelar
              </button>
              <button type="button" class="primary-btn" onclick="generarHojas()">
                🏗️ Generar Hojas
              </button>
            </div>
          </div>
          
          <script>
            let selectAllState = false;
            
            function toggleSelectAll() {
              const checkboxes = document.querySelectorAll('.project-checkbox');
              selectAllState = !selectAllState;
              
              checkboxes.forEach(checkbox => {
                checkbox.checked = selectAllState;
              });
              
              const btn = event.target;
              btn.textContent = selectAllState ? '📋 Deseleccionar Todos' : '📋 Seleccionar Todos';
            }
            
            function generarHojas() {
              const checkboxes = document.querySelectorAll('.project-checkbox:checked');
              
              if (checkboxes.length === 0) {
                alert('⚠️ Por favor selecciona al menos un proyecto');
                return;
              }
              
              const proyectosSeleccionados = Array.from(checkboxes).map(cb => ({
                key: cb.value,
                name: cb.dataset.name
              }));
              
              const btn = event.target;
              btn.disabled = true;
              btn.innerHTML = '⏳ Generando...';
              
              google.script.run
                .withSuccessHandler(onSuccess)
                .withFailureHandler(onError)
                .procesarSeleccionProyectos(proyectosSeleccionados);
            }
            
            function onSuccess() {
              google.script.host.close();
            }
            
            function onError(error) {
              alert('❌ Error: ' + error.message);
              const btn = document.querySelector('.primary-btn');
              btn.disabled = false;
              btn.innerHTML = '🏗️ Generar Hojas';
            }
          </script>
        </body>
      </html>
    `);
    
    htmlTemplate.proyectos = proyectos;
    
    const html = htmlTemplate.evaluate()
      .setWidth(650)
      .setHeight(550);
    
    ui.showModalDialog(html, '🏗️ Seleccionar Proyectos');
    
    // Esperar hasta que se complete la selección
    return null; // La selección se maneja en procesarSeleccionProyectos
    
  } catch (error) {
    console.error('Error mostrando diálogo de selección:', error);
    throw error;
  }
}

/**
 * Procesa la selección de proyectos del diálogo HTML
 */
function procesarSeleccionProyectos(proyectosSeleccionados) {
  try {
    // Obtener detalles completos de los proyectos seleccionados
    const proyectosCompletos = obtenerProyectosDetallados();
    const proyectosFiltrados = proyectosCompletos.filter(p => 
      proyectosSeleccionados.some(sel => sel.key === p.key)
    );
    
    // Generar hojas para cada proyecto
    const resultados = [];
    
    for (const proyecto of proyectosFiltrados) {
      try {
        console.log(`📋 Generando hoja para proyecto: ${proyecto.key}`);
        
        const nombreHoja = `${proyecto.key}_Template`;
        const hojaGenerada = crearHojaProyecto(proyecto, nombreHoja);
        
        resultados.push({
          proyecto: proyecto.key,
          nombre: proyecto.name,
          hoja: nombreHoja,
          estado: 'Creada',
          camposObligatorios: hojaGenerada.camposObligatorios,
          camposOpcionales: hojaGenerada.camposOpcionales
        });
        
      } catch (error) {
        console.error(`Error creando hoja para ${proyecto.key}:`, error);
        resultados.push({
          proyecto: proyecto.key,
          nombre: proyecto.name,
          hoja: `${proyecto.key}_Template`,
          estado: 'Error',
          error: error.message
        });
      }
    }
    
    // Mostrar resumen
    mostrarResumenGeneracionHojas(resultados);
    return true;
    
  } catch (error) {
    console.error('Error procesando selección:', error);
    throw error;
  }
}
  const ui = SpreadsheetApp.getUi();
  
  let mensaje = '🎯 JIRA TASKS PRO v2.0\n\n';
  mensaje += '📋 DESCRIPCIÓN:\n';
  mensaje += 'Herramienta avanzada para crear y gestionar tareas de Jira\n';
  mensaje += 'directamente desde Google Sheets con características\n';
  mensaje += 'profesionales y optimización inteligente.\n\n';
  
  mensaje += '✨ CARACTERÍSTICAS PRINCIPALES:\n';
  mensaje += '• 🔐 Gestión segura de credenciales\n';
  mensaje += '• 🚀 Creación masiva de tareas\n';
  mensaje += '• ➕ Formulario individual elegante\n';
  mensaje += '• 💾 Sistema de cache inteligente\n';
  mensaje += '• 🔍 Diagnósticos completos\n';
  mensaje += '• 📊 Reportes detallados\n';
  mensaje += '• 🔄 Sincronización bidireccional\n';
  mensaje += '• ⚡ Validación automática\n';
  mensaje += '• 🎨 Interfaz moderna y profesional\n\n';
  
  mensaje += '👥 EQUIPO DE DESARROLLO:\n';
  mensaje += '• Diseño: Equipo de Infraestructura\n';
  mensaje += '• Desarrollo: Claude AI + Google Apps Script\n';
  mensaje += '• Proyecto: Bot de Mesa de Servicio (BDMS)\n\n';
  
  mensaje += '🏢 ORGANIZACIÓN:\n';
  mensaje += '• Empresa: Cómputo Contable\n';
  mensaje += '• Dominio: ccsoft.atlassian.net\n';
  mensaje += '• Proyecto: BDMS (Bot de Mesa de Servicio)\n\n';
  
  mensaje += '📅 VERSIÓN:\n';
  mensaje += '• Fecha: Julio 2025\n';
  mensaje += '• Build: 2.0.0\n';
  mensaje += '• Compatibilidad: Jira Cloud API v3\n';
  mensaje += '• Plataforma: Google Apps Script\n\n';
  
  mensaje += '💡 SOPORTE:\n';
  mensaje += '• Para problemas técnicos, usa el Centro de Ayuda\n';
  mensaje += '• Para nuevas características, contacta a Infraestructura\n';
  mensaje += '• Documentación completa en el menú de Herramientas';
  
  ui.alert('Acerca de Jira Tasks Pro', mensaje, ui.ButtonSet.OK);
}

// ================================
// FUNCIONES ADICIONALES DEL MENÚ
// ================================

/**
 * Muestra información detallada de Cloud IDs
 */
function mostrarCloudIds() {
  const ui = SpreadsheetApp.getUi();
  
  try {
    if (!CONFIG.ATLASSIAN_EMAIL || !CONFIG.ATLASSIAN_API_TOKEN) {
      ui.alert('❌ Configuración Requerida', 'Configura tus credenciales primero.', ui.ButtonSet.OK);
      return;
    }
    
    const cloudIds = obtenerCloudId();
    
    let mensaje = '🌐 RECURSOS ATLASSIAN ACCESIBLES\n\n';
    
    cloudIds.forEach((resource, index) => {
      mensaje += `${index + 1}. ${resource.name}\n`;
      mensaje += `   🆔 ID: ${resource.id}\n`;
      mensaje += `   🔗 URL: ${resource.url}\n`;
      mensaje += `   📦 Productos: ${resource.scopes.join(', ')}\n\n`;
    });
    
    if (cloudIds.length === 0) {
      mensaje += 'No se encontraron recursos accesibles.';
    }
    
    ui.alert('Cloud IDs Disponibles', mensaje, ui.ButtonSet.OK);
    
  } catch (error) {
    ui.alert('❌ Error', `Error obteniendo Cloud IDs: ${error.message}`, ui.ButtonSet.OK);
  }
}

/**
 * Muestra campos personalizados de forma organizada
 */
function mostrarCamposPersonalizados() {
  const ui = SpreadsheetApp.getUi();
  
  try {
    if (!CONFIG.ATLASSIAN_EMAIL || !CONFIG.ATLASSIAN_API_TOKEN) {
      ui.alert('❌ Configuración Requerida', 'Configura tus credenciales primero.', ui.ButtonSet.OK);
      return;
    }
    
    const campos = obtenerCamposPersonalizados();
    
    let mensaje = '📝 CAMPOS PERSONALIZADOS DE JIRA\n\n';
    mensaje += `Total encontrados: ${campos.length}\n\n`;
    
    // Agrupar por tipo
    const tiposCampos = {};
    campos.forEach(campo => {
      const tipo = campo.schema?.type || 'unknown';
      if (!tiposCampos[tipo]) {
        tiposCampos[tipo] = [];
      }
      tiposCampos[tipo].push(campo);
    });
    
    Object.keys(tiposCampos).forEach(tipo => {
      mensaje += `📂 ${tipo.toUpperCase()} (${tiposCampos[tipo].length}):\n`;
      
      tiposCampos[tipo].slice(0, 5).forEach(campo => {
        mensaje += `  • ${campo.name} (${campo.id})\n`;
      });
      
      if (tiposCampos[tipo].length > 5) {
        mensaje += `    ... y ${tiposCampos[tipo].length - 5} más\n`;
      }
      mensaje += '\n';
    });
    
    // Mostrar campos configurados en el sistema
    mensaje += '⚙️ CAMPOS CONFIGURADOS EN EL SISTEMA:\n';
    Object.entries(CONFIG.CUSTOM_FIELDS).forEach(([key, value]) => {
      const campo = campos.find(c => c.id === value);
      mensaje += `• ${key}: ${campo ? campo.name : 'No encontrado'} (${value})\n`;
    });
    
    ui.alert('Campos Personalizados', mensaje, ui.ButtonSet.OK);
    
  } catch (error) {
    ui.alert('❌ Error', `Error obteniendo campos: ${error.message}`, ui.ButtonSet.OK);
  }
}

/**
 * Muestra usuarios del proyecto
 */
function mostrarUsuariosProyecto() {
  const ui = SpreadsheetApp.getUi();
  
  try {
    if (!CONFIG.ATLASSIAN_EMAIL || !CONFIG.ATLASSIAN_API_TOKEN) {
      ui.alert('❌ Configuración Requerida', 'Configura tus credenciales primero.', ui.ButtonSet.OK);
      return;
    }
    
    let mensaje = '👥 USUARIOS CONFIGURADOS\n\n';
    
    // Mostrar mapeo actual
    Object.entries(CONFIG.USER_MAPPING).forEach(([email, accountId]) => {
      mensaje += `📧 ${email}\n`;
      mensaje += `🆔 ${accountId}\n\n`;
    });
    
    mensaje += '💡 CONSEJOS:\n';
    mensaje += '• Para// ================================
// SISTEMA DE CACHE Y OPTIMIZACIÓN
// ================================

/**
 * Obtiene datos con cache inteligente
 */
function obtenerConCache(cacheKey, fetchFunction, duration = CONFIG.CACHE_DURATION) {
  const cache = CacheService.getScriptCache();
  
  try {
    // Intentar obtener del cache
    const cached = cache.get(cacheKey);
    if (cached) {
      console.log(`📦 Usando cache para: ${cacheKey}`);
      return JSON.parse(cached);
    }
    
    // Si no está en cache, obtener datos frescos
    console.log(`🔄 Obteniendo datos frescos para: ${cacheKey}`);
    const data = fetchFunction();
    
    // Guardar en cache
    cache.put(cacheKey, JSON.stringify(data), duration);
    return data;
    
  }/**
 * Google Apps Script para crear tareas de Jira desde Google Sheets
 * Configuración necesaria:
 * 1. Obtener API token de Atlassian desde: https://id.atlassian.com/manage-profile/security/api-tokens
 * 2. Configurar las constantes de configuración abajo
 * 3. La hoja debe tener las columnas según el formato especificado
 */

// ================================
// CONFIGURACIÓN AVANZADA - SE OBTIENE DE PROPIEDADES DEL SCRIPT
// ================================
const CONFIG = {
  // URL de tu instancia de Atlassian (fijo)
  ATLASSIAN_DOMAIN: 'https://ccsoft.atlassian.net',
  
  // Email y token se obtienen de las propiedades del script
  get ATLASSIAN_EMAIL() {
    return PropertiesService.getScriptProperties().getProperty('ATLASSIAN_EMAIL') || '';
  },
  
  get ATLASSIAN_API_TOKEN() {
    return PropertiesService.getScriptProperties().getProperty('ATLASSIAN_API_TOKEN') || '';
  },
  
  // Configuración del cache para optimización
  get CACHE_DURATION() {
    return 300; // 5 minutos en segundos
  },
  
  // Cloud ID de tu instancia (se puede obtener con getCloudId())
  CLOUD_ID: '21cb8248-c3b8-4891-a530-98e6a6aabf5d',
  
  // Clave del proyecto en Jira
  PROJECT_KEY: 'BDMS',
  
  // Epic padre por defecto
  PARENT_EPIC: 'MOP-1736',
  
  // Nombre de la hoja donde están los datos
  SHEET_NAME: 'Tareas Jira',
  
  // Mapeo de usuarios (email -> account ID)
  USER_MAPPING: {
    'evert.romero@computocontable.com': '712020:bcc8f634-81f1-4b21-893b-de03d7203037',
    'marcos.coronado@computocontable.com': '712020:a06717c8-e1eb-49bd-812f-7be59e7f61f1'
  },
  
  // Mapeo de prioridades
  PRIORITY_MAPPING: {
    'Baja': '4',
    'Media': '3', 
    'Alta': '2',
    'Crítica': '1'
  },
  
  // IDs de campos personalizados (obtener con getCustomFields())
  CUSTOM_FIELDS: {
    REVIEWER: 'customfield_10003',
    COMMITMENT: 'customfield_10191', 
    DONE_DEFINITION: 'customfield_10228',
    AREA: 'customfield_10231'
  },
  
  // Valores de campos personalizados
  FIELD_VALUES: {
    COMMITMENT_COMMITTED: '10310',
    AREA_INFRASTRUCTURE: '10352'
  }
};

// ================================
// FUNCIONES DE CONFIGURACIÓN MEJORADAS
// ================================

/**
 * Muestra diálogo avanzado para configurar email y API token
 */
function configurarCredenciales() {
  const ui = SpreadsheetApp.getUi();
  
  try {
    // Obtener valores actuales
    const emailActual = CONFIG.ATLASSIAN_EMAIL;
    const tokenActual = CONFIG.ATLASSIAN_API_TOKEN ? '●●●●●●●●●●●●' : '';
    
    // Crear diálogo HTML personalizado para mejor UX
    const htmlTemplate = HtmlService.createTemplate(`
      <!DOCTYPE html>
      <html>
        <head>
          <base target="_top">
          <style>
            body {
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
              margin: 0;
              padding: 20px;
              background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
              min-height: 100vh;
            }
            .container {
              background: white;
              padding: 30px;
              border-radius: 12px;
              box-shadow: 0 8px 32px rgba(30, 60, 114, 0.3);
              max-width: 480px;
              margin: 0 auto;
            }
            .header {
              text-align: center;
              margin-bottom: 25px;
              color: #1e3c72;
            }
            .current-config {
              background: #f8fcff;
              padding: 15px;
              border-radius: 8px;
              margin-bottom: 20px;
              border-left: 4px solid #4a90e2;
            }
            .form-group {
              margin-bottom: 20px;
            }
            label {
              display: block;
              margin-bottom: 8px;
              font-weight: 600;
              color: #2c3e50;
            }
            input {
              width: 100%;
              padding: 12px;
              border: 2px solid #e1ecf4;
              border-radius: 8px;
              font-size: 14px;
              box-sizing: border-box;
              transition: all 0.3s ease;
            }
            input:focus {
              outline: none;
              border-color: #4a90e2;
              box-shadow: 0 0 0 3px rgba(74, 144, 226, 0.1);
            }
            .help-text {
              font-size: 12px;
              color: #666;
              margin-top: 5px;
            }
            .button-group {
              text-align: center;
              margin-top: 25px;
            }
            button {
              padding: 12px 24px;
              border: none;
              border-radius: 8px;
              font-weight: 600;
              cursor: pointer;
              margin: 0 8px;
              transition: all 0.3s ease;
            }
            .primary-btn {
              background: linear-gradient(135deg, #4a90e2 0%, #357abd 100%);
              color: white;
            }
            .secondary-btn {
              background: #f8f9fa;
              color: #6c757d;
              border: 1px solid #dee2e6;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h2>🔐 Configuración de Credenciales</h2>
              <p>Configura tu acceso a Jira de forma segura</p>
            </div>
            
            <div class="current-config">
              <h4>📊 Configuración Actual</h4>
              <p><strong>Email:</strong> ${emailActual || 'No configurado'}</p>
              <p><strong>Token:</strong> ${tokenActual || 'No configurado'}</p>
            </div>
            
            <div class="form-group">
              <label for="email">📧 Email de Atlassian</label>
              <input type="email" id="email" placeholder="tu-email@computocontable.com" value="${emailActual}">
              <div class="help-text">Usa el mismo email con el que accedes a Jira</div>
            </div>
            
            <div class="form-group">
              <label for="token">🔑 API Token</label>
              <input type="password" id="token" placeholder="Pega aquí tu API Token">
              <div class="help-text">
                <a href="https://id.atlassian.com/manage-profile/security/api-tokens" target="_blank">
                  🔗 Crear nuevo API Token aquí
                </a>
              </div>
            </div>
            
            <div class="button-group">
              <button type="button" class="secondary-btn" onclick="google.script.host.close()">
                ❌ Cancelar
              </button>
              <button type="button" class="primary-btn" onclick="guardarCredenciales()">
                💾 Guardar y Probar
              </button>
            </div>
          </div>
          
          <script>
            function guardarCredenciales() {
              const email = document.getElementById('email').value.trim();
              const token = document.getElementById('token').value.trim();
              
              if (!email || !email.includes('@')) {
                alert('⚠️ Por favor ingresa un email válido');
                return;
              }
              
              if (!token) {
                alert('⚠️ Por favor ingresa tu API Token');
                return;
              }
              
              const btn = event.target;
              btn.disabled = true;
              btn.innerHTML = '⏳ Guardando y probando...';
              
              google.script.run
                .withSuccessHandler(onSuccess)
                .withFailureHandler(onError)
                .guardarYProbarCredenciales(email, token);
            }
            
            function onSuccess(result) {
              alert('✅ Credenciales guardadas y probadas exitosamente!\\n\\n' + result);
              google.script.host.close();
            }
            
            function onError(error) {
              alert('❌ Error: ' + error.message);
              const btn = document.querySelector('.primary-btn');
              btn.disabled = false;
              btn.innerHTML = '💾 Guardar y Probar';
            }
          </script>
        </body>
      </html>
    `);
    
    const html = htmlTemplate.evaluate()
      .setWidth(520)
      .setHeight(480);
    
    ui.showModalDialog(html, '🔐 Configurar Credenciales');
    
  } catch (error) {
    console.error('Error en configurarCredenciales:', error);
    ui.alert('Error', `No se pudo mostrar el diálogo: ${error.message}`, ui.ButtonSet.OK);
  }
}

/**
 * Guarda y prueba las credenciales automáticamente
 */
function guardarYProbarCredenciales(email, token) {
  try {
    // Guardar credenciales temporalmente para la prueba
    const properties = PropertiesService.getScriptProperties();
    const backupEmail = properties.getProperty('ATLASSIAN_EMAIL');
    const backupToken = properties.getProperty('ATLASSIAN_API_TOKEN');
    
    // Establecer nuevas credenciales
    properties.setProperties({
      'ATLASSIAN_EMAIL': email,
      'ATLASSIAN_API_TOKEN': token
    });
    
    // Probar conexión
    try {
      const testResult = probarConexionCompleta();
      return `🎉 Configuración exitosa!\n\n${testResult}`;
    } catch (testError) {
      // Restaurar credenciales anteriores si la prueba falla
      if (backupEmail && backupToken) {
        properties.setProperties({
          'ATLASSIAN_EMAIL': backupEmail,
          'ATLASSIAN_API_TOKEN': backupToken
        });
      } else {
        properties.deleteProperty('ATLASSIAN_EMAIL');
        properties.deleteProperty('ATLASSIAN_API_TOKEN');
      }
      throw new Error(`Las credenciales no son válidas: ${testError.message}`);
    }
    
  } catch (error) {
    console.error('Error guardando credenciales:', error);
    throw new Error(`No se pudieron guardar las credenciales: ${error.message}`);
  }
}

/**
 * Prueba de conexión completa con múltiples verificaciones
 */
function probarConexionCompleta() {
  if (!CONFIG.ATLASSIAN_EMAIL || !CONFIG.ATLASSIAN_API_TOKEN) {
    throw new Error('Credenciales no configuradas');
  }
  
  let resultado = '';
  
  try {
    // 1. Probar autenticación básica
    console.log('🔍 Probando autenticación básica...');
    const userInfo = obtenerInfoUsuario();
    resultado += `✅ Autenticación exitosa\n`;
    resultado += `👤 Usuario: ${userInfo.displayName}\n`;
    resultado += `📧 Email: ${userInfo.emailAddress}\n\n`;
    
    // 2. Probar acceso a recursos
    console.log('🔍 Probando acceso a recursos...');
    const cloudIds = obtenerCloudId();
    resultado += `✅ Acceso a recursos: ${cloudIds.length} disponibles\n\n`;
    
    // 3. Probar acceso al proyecto
    console.log('🔍 Probando acceso al proyecto...');
    const proyectos = obtenerProyectosAccesibles();
    const proyectoBDMS = proyectos.find(p => p.key === CONFIG.PROJECT_KEY);
    if (proyectoBDMS) {
      resultado += `✅ Proyecto BDMS encontrado\n`;
      resultado += `📁 Nombre: ${proyectoBDMS.name}\n\n`;
    } else {
      resultado += `⚠️ Proyecto BDMS no encontrado en proyectos accesibles\n\n`;
    }
    
    // 4. Probar campos personalizados
    console.log('🔍 Probando campos personalizados...');
    const campos = obtenerCamposPersonalizados();
    const camposRequeridos = Object.values(CONFIG.CUSTOM_FIELDS);
    const camposEncontrados = campos.filter(c => camposRequeridos.includes(c.id));
    resultado += `✅ Campos personalizados: ${camposEncontrados.length}/${camposRequeridos.length} encontrados\n\n`;
    
    // 5. Verificar permisos de creación
    console.log('🔍 Verificando permisos...');
    const permisos = verificarPermisos();
    resultado += `✅ Permisos verificados\n`;
    resultado += `📝 Crear issues: ${permisos.canCreate ? 'Sí' : 'No'}\n`;
    resultado += `✏️ Editar issues: ${permisos.canEdit ? 'Sí' : 'No'}\n`;
    
    return resultado;
    
  } catch (error) {
    console.error('Error en prueba de conexión:', error);
    throw new Error(`Fallo en la prueba de conexión: ${error.message}`);
  }
}

/**
 * Obtiene información del usuario actual
 */
function obtenerInfoUsuario() {
  try {
    const response = UrlFetchApp.fetch(
      'https://api.atlassian.com/me',
      {
        method: 'GET',
        headers: {
          'Authorization': 'Basic ' + Utilities.base64Encode(`${CONFIG.ATLASSIAN_EMAIL}:${CONFIG.ATLASSIAN_API_TOKEN}`),
          'Accept': 'application/json'
        }
      }
    );
    
    if (response.getResponseCode() !== 200) {
      throw new Error(`Error ${response.getResponseCode()}: ${response.getContentText()}`);
    }
    
    return JSON.parse(response.getContentText());
  } catch (error) {
    throw new Error(`No se pudo obtener información del usuario: ${error.message}`);
  }
}

/**
 * Obtiene proyectos accesibles
 */
function obtenerProyectosAccesibles() {
  try {
    const response = UrlFetchApp.fetch(
      `https://api.atlassian.com/ex/jira/${CONFIG.CLOUD_ID}/rest/api/3/project/search`,
      {
        method: 'GET',
        headers: {
          'Authorization': 'Basic ' + Utilities.base64Encode(`${CONFIG.ATLASSIAN_EMAIL}:${CONFIG.ATLASSIAN_API_TOKEN}`),
          'Accept': 'application/json'
        }
      }
    );
    
    if (response.getResponseCode() !== 200) {
      throw new Error(`Error ${response.getResponseCode()}: ${response.getContentText()}`);
    }
    
    const data = JSON.parse(response.getContentText());
    return data.values || [];
  } catch (error) {
    throw new Error(`No se pudieron obtener los proyectos: ${error.message}`);
  }
}

/**
 * Verifica permisos del usuario en el proyecto
 */
function verificarPermisos() {
  try {
    const response = UrlFetchApp.fetch(
      `https://api.atlassian.com/ex/jira/${CONFIG.CLOUD_ID}/rest/api/3/mypermissions?projects=${CONFIG.PROJECT_KEY}`,
      {
        method: 'GET',
        headers: {
          'Authorization': 'Basic ' + Utilities.base64Encode(`${CONFIG.ATLASSIAN_EMAIL}:${CONFIG.ATLASSIAN_API_TOKEN}`),
          'Accept': 'application/json'
        }
      }
    );
    
    if (response.getResponseCode() !== 200) {
      return { canCreate: false, canEdit: false };
    }
    
    const permissions = JSON.parse(response.getContentText()).permissions || {};
    
    return {
      canCreate: permissions['CREATE_ISSUES']?.havePermission || false,
      canEdit: permissions['EDIT_ISSUES']?.havePermission || false,
      canAssign: permissions['ASSIGN_ISSUES']?.havePermission || false,
      canComment: permissions['ADD_COMMENTS']?.havePermission || false
    };
  } catch (error) {
    console.warn('No se pudieron verificar permisos:', error);
    return { canCreate: false, canEdit: false };
  }
}

/**
 * Muestra la configuración actual con diagnósticos avanzados
 */
function verConfiguracion() {
  const ui = SpreadsheetApp.getUi();
  
  try {
    const email = CONFIG.ATLASSIAN_EMAIL;
    const token = CONFIG.ATLASSIAN_API_TOKEN;
    
    let mensaje = '⚙️ CONFIGURACIÓN DETALLADA\n\n';
    mensaje += `🌐 Dominio: ${CONFIG.ATLASSIAN_DOMAIN}\n`;
    mensaje += `📧 Email: ${email || 'No configurado'}\n`;
    mensaje += `🔑 Token: ${token ? '●●●●●●●●●●●●' : 'No configurado'}\n`;
    mensaje += `📁 Proyecto: ${CONFIG.PROJECT_KEY}\n`;
    mensaje += `📋 Epic Padre: ${CONFIG.PARENT_EPIC}\n`;
    mensaje += `🗂️ Hoja: ${CONFIG.SHEET_NAME}\n\n`;
    
    // Diagnósticos adicionales
    if (email && token) {
      mensaje += '🔍 DIAGNÓSTICOS:\n';
      
      try {
        // Verificar cache
        const cache = CacheService.getScriptCache();
        const cacheKeys = ['user_info', 'cloud_ids', 'custom_fields'];
        let cacheStatus = '';
        cacheKeys.forEach(key => {
          const cached = cache.get(key);
          cacheStatus += `• ${key}: ${cached ? '✅ Cacheado' : '❌ No cacheado'}\n`;
        });
        mensaje += cacheStatus + '\n';
        
        // Info rápida del usuario
        const userInfo = obtenerInfoUsuario();
        mensaje += `👤 Usuario: ${userInfo.displayName}\n`;
        mensaje += `🆔 Account ID: ${userInfo.account_id}\n`;
        mensaje += `⏰ Última conexión exitosa: ${new Date().toLocaleString()}\n\n`;
        
        mensaje += '✅ Todas las configuraciones están correctas.';
      } catch (error) {
        mensaje += `❌ Error en diagnósticos: ${error.message}`;
      }
    } else {
      mensaje += '⚠️ Faltan credenciales. Configúralas desde el menú.';
    }
    
    ui.alert('Configuración Detallada', mensaje, ui.ButtonSet.OK);
    
  } catch (error) {
    console.error('Error verificando configuración:', error);
    ui.alert('Error', `Error verificando configuración: ${error.message}`, ui.ButtonSet.OK);
  }
}

/**
 * Ejecuta diagnóstico completo del sistema
 */
function ejecutarDiagnosticoCompleto() {
  const ui = SpreadsheetApp.getUi();
  
  if (!CONFIG.ATLASSIAN_EMAIL || !CONFIG.ATLASSIAN_API_TOKEN) {
    ui.alert('❌ Configuración Requerida', 'Por favor configura tus credenciales primero.', ui.ButtonSet.OK);
    return;
  }
  
  try {
    console.log('🔍 Iniciando diagnóstico completo...');
    
    let reporte = '🔍 DIAGNÓSTICO COMPLETO DEL SISTEMA\n';
    reporte += `📅 Fecha: ${new Date().toLocaleString()}\n\n`;
    
    // 1. Prueba de conectividad
    reporte += '🌐 CONECTIVIDAD:\n';
    try {
      const startTime = new Date().getTime();
      const userInfo = obtenerInfoUsuario();
      const endTime = new Date().getTime();
      reporte += `✅ Conexión exitosa (${endTime - startTime}ms)\n`;
      reporte += `👤 Usuario: ${userInfo.displayName}\n\n`;
    } catch (error) {
      reporte += `❌ Error de conexión: ${error.message}\n\n`;
    }
    
    // 2. Verificación de recursos
    reporte += '📚 RECURSOS:\n';
    try {
      const cloudIds = obtenerCloudId();
      reporte += `✅ Cloud IDs: ${cloudIds.length} disponibles\n`;
      
      const proyectos = obtenerProyectosAccesibles();
      reporte += `✅ Proyectos: ${proyectos.length} accesibles\n`;
      
      const campos = obtenerCamposPersonalizados();
      reporte += `✅ Campos personalizados: ${campos.length} encontrados\n\n`;
    } catch (error) {
      reporte += `❌ Error accediendo recursos: ${error.message}\n\n`;
    }
    
    // 3. Verificación de permisos
    reporte += '🔐 PERMISOS:\n';
    try {
      const permisos = verificarPermisos();
      reporte += `📝 Crear issues: ${permisos.canCreate ? '✅' : '❌'}\n`;
      reporte += `✏️ Editar issues: ${permisos.canEdit ? '✅' : '❌'}\n`;
      reporte += `👥 Asignar issues: ${permisos.canAssign ? '✅' : '❌'}\n`;
      reporte += `💬 Añadir comentarios: ${permisos.canComment ? '✅' : '❌'}\n\n`;
    } catch (error) {
      reporte += `❌ Error verificando permisos: ${error.message}\n\n`;
    }
    
    // 4. Verificación de hoja
    reporte += '📊 HOJA DE CÁLCULO:\n';
    try {
      const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(CONFIG.SHEET_NAME);
      if (sheet) {
        const range = sheet.getDataRange();
        reporte += `✅ Hoja encontrada: ${CONFIG.SHEET_NAME}\n`;
        reporte += `📋 Filas de datos: ${Math.max(0, range.getNumRows() - 1)}\n`;
        reporte += `📄 Columnas: ${range.getNumColumns()}\n\n`;
      } else {
        reporte += `⚠️ Hoja '${CONFIG.SHEET_NAME}' no existe\n\n`;
      }
    } catch (error) {
      reporte += `❌ Error verificando hoja: ${error.message}\n\n`;
    }
    
    // 5. Estado del cache
    reporte += '💾 CACHE:\n';
    try {
      const cache = CacheService.getScriptCache();
      const cacheKeys = ['user_info', 'cloud_ids', 'custom_fields', 'projects'];
      let cacheCount = 0;
      cacheKeys.forEach(key => {
        if (cache.get(key)) cacheCount++;
      });
      reporte += `✅ Elementos cacheados: ${cacheCount}/${cacheKeys.length}\n\n`;
    } catch (error) {
      reporte += `❌ Error verificando cache: ${error.message}\n\n`;
    }
    
    // 6. Recomendaciones
    reporte += '💡 RECOMENDACIONES:\n';
    reporte += '• Ejecuta este diagnóstico semanalmente\n';
    reporte += '• Limpia el cache si experimentas lentitud\n';
    reporte += '• Verifica permisos si falla la creación de tareas\n';
    reporte += '• Mantén actualizado tu API token\n';
    
    console.log(reporte);
    ui.alert('Diagnóstico Completo', reporte, ui.ButtonSet.OK);
    
  } catch (error) {
    console.error('Error en diagnóstico:', error);
    ui.alert('Error de Diagnóstico', `Error ejecutando diagnóstico: ${error.message}`, ui.ButtonSet.OK);
  }
}

/**
 * Limpia el cache del sistema
 */
function limpiarCache() {
  const ui = SpreadsheetApp.getUi();
  
  const response = ui.alert(
    '🗑️ Limpiar Cache', 
    '¿Deseas limpiar el cache del sistema? Esto puede mejorar el rendimiento si experimentas problemas.',
    ui.ButtonSet.YES_NO
  );
  
  if (response === ui.Button.YES) {
    try {
      CacheService.getScriptCache().removeAll(['user_info', 'cloud_ids', 'custom_fields', 'projects', 'permissions']);
      ui.alert('✅ Cache Limpiado', 'El cache se limpió exitosamente. Las próximas operaciones pueden ser más lentas mientras se recarga.', ui.ButtonSet.OK);
    } catch (error) {
      ui.alert('❌ Error', `No se pudo limpiar el cache: ${error.message}`, ui.ButtonSet.OK);
    }
  }
}

/**
 * Limpia la configuración guardada
 */
function limpiarConfiguracion() {
  const ui = SpreadsheetApp.getUi();
  
  const response = ui.alert(
    '🗑️ Limpiar Configuración', 
    '¿Estás seguro de que quieres eliminar las credenciales guardadas?',
    ui.ButtonSet.YES_NO
  );
  
  if (response === ui.Button.YES) {
    PropertiesService.getScriptProperties().deleteProperty('ATLASSIAN_EMAIL');
    PropertiesService.getScriptProperties().deleteProperty('ATLASSIAN_API_TOKEN');
    ui.alert('✅ Limpieza Completa', 'Se eliminaron las credenciales guardadas.', ui.ButtonSet.OK);
  }
}

// ================================
// FUNCIÓN PARA AGREGAR TAREA INDIVIDUAL
// ================================

/**
 * Diálogo para agregar una tarea individual
 */
function agregarTareaIndividual() {
  const ui = SpreadsheetApp.getUi();
  
  // Verificar configuración
  if (!CONFIG.ATLASSIAN_EMAIL || !CONFIG.ATLASSIAN_API_TOKEN) {
    ui.alert('❌ Configuración Requerida', 'Por favor configura tus credenciales desde el menú primero.', ui.ButtonSet.OK);
    return;
  }
  
  try {
    // Crear HTML para el formulario
    const htmlTemplate = HtmlService.createTemplate(`
      <!DOCTYPE html>
      <html>
        <head>
          <base target="_top">
          <style>
            body {
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
              margin: 0;
              padding: 20px;
              background: linear-gradient(135deg, #1e3c72 0%, #2a5298 50%, #4a90e2 100%);
              min-height: 100vh;
            }
            .container {
              background: white;
              padding: 25px;
              border-radius: 12px;
              box-shadow: 0 8px 32px rgba(30, 60, 114, 0.3);
              max-width: 520px;
              margin: 0 auto;
              border: 1px solid rgba(74, 144, 226, 0.2);
            }
            .header {
              text-align: center;
              margin-bottom: 25px;
              padding-bottom: 15px;
              border-bottom: 2px solid #e8f2ff;
            }
            .header h2 {
              color: #1e3c72;
              margin: 0;
              font-size: 24px;
              font-weight: 600;
            }
            .header .subtitle {
              color: #4a90e2;
              font-size: 14px;
              margin-top: 5px;
            }
            .form-group {
              margin-bottom: 18px;
            }
            label {
              display: block;
              margin-bottom: 6px;
              font-weight: 600;
              color: #2c3e50;
              font-size: 14px;
            }
            input, select, textarea {
              width: 100%;
              padding: 12px;
              border: 2px solid #e1ecf4;
              border-radius: 8px;
              font-size: 14px;
              box-sizing: border-box;
              transition: all 0.3s ease;
              font-family: inherit;
            }
            input:focus, select:focus, textarea:focus {
              outline: none;
              border-color: #4a90e2;
              box-shadow: 0 0 0 3px rgba(74, 144, 226, 0.1);
              background-color: #f8fcff;
            }
            textarea {
              height: 85px;
              resize: vertical;
              line-height: 1.4;
            }
            .button-group {
              text-align: center;
              margin-top: 25px;
              padding-top: 20px;
              border-top: 1px solid #e8f2ff;
            }
            button {
              border: none;
              padding: 12px 24px;
              border-radius: 8px;
              cursor: pointer;
              margin: 0 8px;
              font-size: 14px;
              font-weight: 600;
              transition: all 0.3s ease;
              min-width: 100px;
            }
            .primary-btn {
              background: linear-gradient(135deg, #4a90e2 0%, #357abd 100%);
              color: white;
              box-shadow: 0 4px 12px rgba(74, 144, 226, 0.3);
            }
            .primary-btn:hover {
              background: linear-gradient(135deg, #357abd 0%, #2968a3 100%);
              transform: translateY(-1px);
              box-shadow: 0 6px 16px rgba(74, 144, 226, 0.4);
            }
            .cancel-btn {
              background: linear-gradient(135deg, #95a5a6 0%, #7f8c8d 100%);
              color: white;
            }
            .cancel-btn:hover {
              background: linear-gradient(135deg, #7f8c8d 0%, #6c7b7d 100%);
              transform: translateY(-1px);
            }
            .required {
              color: #e74c3c;
              font-weight: bold;
            }
            .form-row {
              display: flex;
              gap: 15px;
            }
            .form-row .form-group {
              flex: 1;
            }
            .priority-high { border-left: 4px solid #e67e22; }
            .priority-medium { border-left: 4px solid #f1c40f; }
            .priority-low { border-left: 4px solid #2ecc71; }
            .priority-critical { border-left: 4px solid #e74c3c; }
            
            /* Estilos para campos específicos */
            #prioridad {
              background: linear-gradient(to right, #f8fcff, white);
            }
            #prioridad option[value="Alta"] { background-color: #fff2e6; }
            #prioridad option[value="Media"] { background-color: #fffbef; }
            #prioridad option[value="Baja"] { background-color: #f0fff4; }
            #prioridad option[value="Crítica"] { background-color: #ffebee; }
            
            .info-badge {
              background: linear-gradient(135deg, #e8f2ff 0%, #d6e9ff 100%);
              color: #2c5aa0;
              padding: 8px 12px;
              border-radius: 6px;
              font-size: 12px;
              margin-bottom: 15px;
              border-left: 3px solid #4a90e2;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h2>🎯 Nueva Tarea para Jira</h2>
              <div class="subtitle">Proyecto: Bot de Mesa de Servicio (BDMS)</div>
            </div>
            
            <div class="info-badge">
              💡 Los campos marcados con * son obligatorios
            </div>
            
            <div class="form-group">
              <label for="titulo">📝 Título de la Tarea <span class="required">*</span></label>
              <input type="text" id="titulo" required placeholder="Ej: MT para validación de firma HMAC" maxlength="200">
            </div>
            
            <div class="form-group">
              <label for="descripcion">📄 Descripción <span class="required">*</span></label>
              <textarea id="descripcion" required placeholder="Descripción detallada de la tarea, incluyendo contexto técnico y objetivos..."></textarea>
            </div>
            
            <div class="form-row">
              <div class="form-group">
                <label for="etiqueta">🏷️ Etiqueta</label>
                <input type="text" id="etiqueta" placeholder="SEMANA_4" maxlength="50">
              </div>
              <div class="form-group">
                <label for="estimacion">⏱️ Estimación</label>
                <input type="text" id="estimacion" placeholder="2h" title="Ejemplos: 2h, 1h 30m, 3d" maxlength="20">
              </div>
            </div>
            
            <div class="form-row">
              <div class="form-group">
                <label for="fechaLimite">📅 Fecha Límite</label>
                <input type="date" id="fechaLimite">
              </div>
              <div class="form-group">
                <label for="prioridad">⚡ Prioridad</label>
                <select id="prioridad">
                  <option value="Media">📊 Media</option>
                  <option value="Alta">🔥 Alta</option>
                  <option value="Baja">📉 Baja</option>
                  <option value="Crítica">🚨 Crítica</option>
                </select>
              </div>
            </div>
            
            <div class="form-row">
              <div class="form-group">
                <label for="asignado">👤 Asignado a</label>
                <select id="asignado">
                  <option value="">Sin asignar</option>
                  <option value="evert.romero@computocontable.com">👨‍💻 Evert Daniel Romero Garrido</option>
                  <option value="marcos.coronado@computocontable.com">👨‍💻 Marcos Ernesto Coronado Barcenas</option>
                </select>
              </div>
              <div class="form-group">
                <label for="reviewer">👁️ Reviewer</label>
                <select id="reviewer">
                  <option value="">Sin reviewer</option>
                  <option value="evert.romero@computocontable.com">👨‍💻 Evert Daniel Romero Garrido</option>
                  <option value="marcos.coronado@computocontable.com">👨‍💻 Marcos Ernesto Coronado Barcenas</option>
                </select>
              </div>
            </div>
            
            <div class="form-group">
              <label for="criterios">✅ Criterios de Aceptación</label>
              <textarea id="criterios" placeholder="• Condición 1 que debe cumplirse&#10;• Condición 2 para considerar terminada la tarea&#10;• Evidencias o documentación requerida"></textarea>
            </div>
            
            <div class="button-group">
              <button type="button" class="cancel-btn" onclick="google.script.host.close()">
                ❌ Cancelar
              </button>
              <button type="button" class="primary-btn" onclick="crearTarea()">
                🚀 Crear Tarea
              </button>
            </div>
          </div>
          
          <script>
            function crearTarea() {
              const tarea = {
                titulo: document.getElementById('titulo').value.trim(),
                descripcion: document.getElementById('descripcion').value.trim(),
                etiqueta: document.getElementById('etiqueta').value.trim(),
                estimacion: document.getElementById('estimacion').value.trim(),
                fechaLimite: document.getElementById('fechaLimite').value,
                prioridad: document.getElementById('prioridad').value,
                asignado: document.getElementById('asignado').value,
                reviewer: document.getElementById('reviewer').value,
                criterios: document.getElementById('criterios').value.trim()
              };
              
              if (!tarea.titulo || !tarea.descripcion) {
                alert('⚠️ Por favor completa los campos obligatorios:\\n\\n• Título de la tarea\\n• Descripción');
                return;
              }
              
              // Deshabilitar botón mientras se procesa
              const btn = event.target;
              btn.disabled = true;
              btn.innerHTML = '⏳ Creando...';
              btn.style.background = 'linear-gradient(135deg, #95a5a6 0%, #7f8c8d 100%)';
              
              google.script.run
                .withSuccessHandler(onSuccess)
                .withFailureHandler(onError)
                .procesarTareaIndividual(tarea);
            }
            
            function onSuccess(result) {
              alert('🎉 ¡Tarea creada exitosamente!\\n\\n' + 
                    '🎫 Clave: ' + result.key + '\\n' +
                    '🔗 URL: ' + result.url + '\\n\\n' +
                    'La tarea ya está disponible en Jira.');
              google.script.host.close();
            }
            
            function onError(error) {
              alert('❌ Error al crear la tarea:\\n\\n' + error.message + '\\n\\nPor favor verifica tu configuración e intenta nuevamente.');
              
              // Rehabilitar botón
              const btn = document.querySelector('.primary-btn');
              btn.disabled = false;
              btn.innerHTML = '🚀 Crear Tarea';
              btn.style.background = 'linear-gradient(135deg, #4a90e2 0%, #357abd 100%)';
            }
            
            // Validación en tiempo real
            document.getElementById('titulo').addEventListener('input', function() {
              if (this.value.length > 150) {
                this.style.borderColor = '#f39c12';
              } else {
                this.style.borderColor = '#e1ecf4';
              }
            });
            
            // Auto-generar etiqueta basada en fecha
            window.onload = function() {
              const now = new Date();
              const weekNum = Math.ceil(((now - new Date(now.getFullYear(), 0, 1)) / 86400000 + new Date(now.getFullYear(), 0, 1).getDay() + 1) / 7);
              if (!document.getElementById('etiqueta').value) {
                document.getElementById('etiqueta').value = 'SEMANA_' + weekNum;
              }
            };
          </script>
        </body>
      </html>
    `);
    
    const html = htmlTemplate.evaluate()
      .setWidth(580)
      .setHeight(720);
    
    ui.showModalDialog(html, '🎯 Nueva Tarea Jira');
    
  } catch (error) {
    console.error('Error mostrando formulario:', error);
    ui.alert('❌ Error', `No se pudo mostrar el formulario: ${error.message}`, ui.ButtonSet.OK);
  }
}

/**
 * Procesa la tarea individual desde el formulario HTML
 */
function procesarTareaIndividual(datosFormulario) {
  try {
    // Convertir datos del formulario al formato esperado
    const tarea = {
      titulo: datosFormulario.titulo,
      tipo: 'Tarea',
      proyecto: 'Bot de Mesa de Servicio (BDMS)',
      etiqueta: datosFormulario.etiqueta || `SEMANA_${new Date().getWeek()}`,
      area: 'Infraestructura',
      asignado: datosFormulario.asignado,
      reviewer: datosFormulario.reviewer,
      creado: new Date(),
      equipo: 'Infraestructura',
      descripcion: datosFormulario.descripcion,
      estimacion: datosFormulario.estimacion,
      fechaLimite: datosFormulario.fechaLimite ? new Date(datosFormulario.fechaLimite) : null,
      prioridad: datosFormulario.prioridad,
      compromiso: 'Comprometido',
      criteriosAceptacion: datosFormulario.criterios
    };
    
    // Crear la tarea en Jira
    const resultado = crearTareaJira(tarea);
    
    return {
      key: resultado.key,
      url: `${CONFIG.ATLASSIAN_DOMAIN}/browse/${resultado.key}`,
      success: true
    };
    
  } catch (error) {
    console.error('Error procesando tarea individual:', error);
    throw new Error(`Error al crear la tarea: ${error.message}`);
  }
}

// Helper para obtener número de semana
Date.prototype.getWeek = function() {
  const onejan = new Date(this.getFullYear(), 0, 1);
  return Math.ceil((((this - onejan) / 86400000) + onejan.getDay() + 1) / 7);
};

// ================================
// FUNCIONES PRINCIPALES (ACTUALIZADAS)
// ================================

// ================================
// SISTEMA DE CACHE Y OPTIMIZACIÓN
// ================================

/**
 * Obtiene datos con cache inteligente
 */
function obtenerConCache(cacheKey, fetchFunction, duration = CONFIG.CACHE_DURATION) {
  const cache = CacheService.getScriptCache();
  
  try {
    // Intentar obtener del cache
    const cached = cache.get(cacheKey);
    if (cached) {
      console.log(`📦 Usando cache para: ${cacheKey}`);
      return JSON.parse(cached);
    }
    
    // Si no está en cache, obtener datos frescos
    console.log(`🔄 Obteniendo datos frescos para: ${cacheKey}`);
    const data = fetchFunction();
    
    // Guardar en cache
    cache.put(cacheKey, JSON.stringify(data), duration);
    return data;
    
  } catch (error) {
    console.warn(`⚠️ Error en cache para ${cacheKey}:`, error);
    // Si falla el cache, intentar obtener datos directamente
    return fetchFunction();
  }
}

/**
 * Validador avanzado de datos de entrada
 */
function validarDatosTarea(tarea) {
  const errores = [];
  
  // Validaciones obligatorias
  if (!tarea.titulo || tarea.titulo.trim().length === 0) {
    errores.push('El título es obligatorio');
  } else if (tarea.titulo.length > 255) {
    errores.push('El título no puede exceder 255 caracteres');
  }
  
  if (!tarea.descripcion || tarea.descripcion.trim().length === 0) {
    errores.push('La descripción es obligatoria');
  } else if (tarea.descripcion.length > 32767) {
    errores.push('La descripción es demasiado larga');
  }
  
  // Validaciones de formato
  if (tarea.asignado && !CONFIG.USER_MAPPING[tarea.asignado]) {
    errores.push(`Usuario asignado no válido: ${tarea.asignado}`);
  }
  
  if (tarea.reviewer && !CONFIG.USER_MAPPING[tarea.reviewer]) {
    errores.push(`Reviewer no válido: ${tarea.reviewer}`);
  }
  
  if (tarea.prioridad && !CONFIG.PRIORITY_MAPPING[tarea.prioridad]) {
    errores.push(`Prioridad no válida: ${tarea.prioridad}`);
  }
  
  // Validación de fecha
  if (tarea.fechaLimite) {
    const fecha = new Date(tarea.fechaLimite);
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    
    if (fecha < hoy) {
      errores.push('La fecha límite no puede ser en el pasado');
    }
  }
  
  // Validación de estimación
  if (tarea.estimacion) {
    const estimacionRegex = /^(\d+[wdhm]\s*)+$/i;
    if (!estimacionRegex.test(tarea.estimacion.replace(/\s/g, ''))) {
      errores.push('Formato de estimación inválido (ej: 2h, 1d, 3h 30m)');
    }
  }
  
  return errores;
}

// ================================
// FUNCIONES MEJORADAS DE CREACIÓN DE TAREAS
// ================================

/**
 * Función principal mejorada que lee la hoja y crea las tareas
 */
function crearTareasDesdeHoja() {
  const ui = SpreadsheetApp.getUi();
  
  // Verificar configuración primero
  if (!CONFIG.ATLASSIAN_EMAIL || !CONFIG.ATLASSIAN_API_TOKEN) {
    ui.alert('❌ Configuración Requerida', 'Por favor configura tus credenciales desde el menú antes de continuar.', ui.ButtonSet.OK);
    return;
  }
  
  try {
    console.log('🚀 Iniciando creación masiva de tareas...');
    
    // Mostrar diálogo de confirmación con resumen
    const datos = obtenerDatosHoja();
    if (!datos || datos.length === 0) {
      throw new Error('No se encontraron datos en la hoja');
    }
    
    const confirmacion = ui.alert(
      '🎯 Confirmar Creación Masiva',
      `Se encontraron ${datos.length} tareas para crear.\n\n¿Deseas continuar?`,
      ui.ButtonSet.YES_NO
    );
    
    if (confirmacion !== ui.Button.YES) {
      return;
    }
    
    console.log(`📊 Procesando ${datos.length} tareas...`);
    
    // Validar todas las tareas primero
    const erroresValidacion = [];
    datos.forEach((tarea, index) => {
      const errores = validarDatosTarea(tarea);
      if (errores.length > 0) {
        erroresValidacion.push({
          fila: index + 2,
          titulo: tarea.titulo,
          errores: errores
        });
      }
    });
    
    if (erroresValidacion.length > 0) {
      let mensajeError = '❌ ERRORES DE VALIDACIÓN:\n\n';
      erroresValidacion.forEach(error => {
        mensajeError += `Fila ${error.fila}: ${error.titulo}\n`;
        error.errores.forEach(err => mensajeError += `  • ${err}\n`);
        mensajeError += '\n';
      });
      
      ui.alert('Errores de Validación', mensajeError, ui.ButtonSet.OK);
      return;
    }
    
    // Mostrar barra de progreso simulada
    const toast = SpreadsheetApp.getActiveSpreadsheet();
    toast.toast('⏳ Iniciando creación de tareas...', 'Progreso', 3);
    
    // Procesar cada fila
    const resultados = [];
    const startTime = new Date().getTime();
    
    for (let i = 0; i < datos.length; i++) {
      const fila = datos[i];
      const numeroFila = i + 2;
      const progreso = Math.round(((i + 1) / datos.length) * 100);
      
      try {
        toast.toast(`⏳ Procesando ${i + 1}/${datos.length} (${progreso}%): ${fila.titulo.substring(0, 50)}...`, 'Creando Tareas', 2);
        console.log(`⏳ Procesando fila ${numeroFila}: ${fila.titulo}`);
        
        const tarea = crearTareaJira(fila);
        resultados.push({
          fila: numeroFila,
          titulo: fila.titulo,
          key: tarea.key,
          estado: 'Creada',
          url: `${CONFIG.ATLASSIAN_DOMAIN}/browse/${tarea.key}`,
          tiempo: new Date().getTime() - startTime
        });
        
        console.log(`✅ Tarea creada: ${tarea.key}`);
        
        // Pausa inteligente para evitar rate limiting
        const pausaBase = 800;
        const pausaVariable = Math.random() * 400; // 0-400ms adicionales
        Utilities.sleep(pausaBase + pausaVariable);
        
      } catch (error) {
        console.error(`❌ Error en fila ${numeroFila}:`, error);
        resultados.push({
          fila: numeroFila,
          titulo: fila.titulo,
          key: 'ERROR',
          estado: 'Error',
          error: error.message,
          tiempo: new Date().getTime() - startTime
        });
        
        // Pausa más larga en caso de error
        Utilities.sleep(1500);
      }
    }
    
    const tiempoTotal = Math.round((new Date().getTime() - startTime) / 1000);
    toast.toast(`✅ Proceso completado en ${tiempoTotal}s`, 'Finalizado', 5);
    
    // Mostrar resumen mejorado
    mostrarResumenMejorado(resultados, tiempoTotal);
    
    // Opcional: Generar reporte en nueva hoja
    if (resultados.length > 5) {
      const respuesta = ui.alert(
        '📊 Generar Reporte',
        '¿Deseas generar un reporte detallado en una nueva hoja?',
        ui.ButtonSet.YES_NO
      );
      
      if (respuesta === ui.Button.YES) {
        generarReporteResultados(resultados, tiempoTotal);
      }
    }
    
    return resultados;
    
  } catch (error) {
    console.error('💥 Error general:', error);
    ui.alert('Error Crítico', `Error procesando las tareas: ${error.message}`, ui.ButtonSet.OK);
    throw error;
  }
}

/**
 * Obtiene los datos de la hoja de cálculo
 */
function obtenerDatosHoja() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(CONFIG.SHEET_NAME);
  if (!sheet) {
    throw new Error(`No se encontró la hoja "${CONFIG.SHEET_NAME}"`);
  }
  
  // Obtener todos los datos
  const range = sheet.getDataRange();
  const values = range.getValues();
  
  if (values.length < 2) {
    throw new Error('La hoja debe tener al menos una fila de datos además del header');
  }
  
  // Headers esperados (primera fila)
  const headers = values[0];
  const datos = [];
  
  // Procesar cada fila de datos
  for (let i = 1; i < values.length; i++) {
    const fila = values[i];
    
    // Saltar filas vacías
    if (!fila[0] || fila[0].toString().trim() === '') {
      continue;
    }
    
    const tarea = {
      titulo: fila[0]?.toString().trim() || '',
      tipo: fila[1]?.toString().trim() || 'Tarea',
      proyecto: fila[2]?.toString().trim() || '',
      etiqueta: fila[3]?.toString().trim() || '',
      area: fila[4]?.toString().trim() || '',
      asignado: fila[5]?.toString().trim() || '',
      reviewer: fila[6]?.toString().trim() || '',
      creado: fila[7] || new Date(),
      equipo: fila[8]?.toString().trim() || '',
      descripcion: fila[9]?.toString().trim() || '',
      estimacion: fila[10]?.toString().trim() || '',
      fechaLimite: fila[11] || null,
      prioridad: fila[12]?.toString().trim() || 'Media',
      compromiso: fila[13]?.toString().trim() || 'Comprometido',
      criteriosAceptacion: fila[14]?.toString().trim() || ''
    };
    
    datos.push(tarea);
  }
  
  return datos;
}

/**
 * Crea una tarea individual en Jira
 */
function crearTareaJira(tarea) {
  // Verificar configuración
  if (!CONFIG.ATLASSIAN_EMAIL || !CONFIG.ATLASSIAN_API_TOKEN) {
    throw new Error('Configuración incompleta. Por favor configura email y API token.');
  }
  
  // Preparar payload para la API
  const payload = {
    fields: {
      project: { key: CONFIG.PROJECT_KEY },
      summary: tarea.titulo,
      description: tarea.descripcion,
      issuetype: { name: tarea.tipo || 'Tarea' },
      priority: { id: CONFIG.PRIORITY_MAPPING[tarea.prioridad] || '3' },
      labels: tarea.etiqueta ? [tarea.etiqueta] : [],
      parent: { key: CONFIG.PARENT_EPIC }
    }
  };
  
  // Agregar asignado si existe
  if (tarea.asignado && CONFIG.USER_MAPPING[tarea.asignado]) {
    payload.fields.assignee = { accountId: CONFIG.USER_MAPPING[tarea.asignado] };
  }
  
  // Agregar fecha límite si existe
  if (tarea.fechaLimite) {
    const fecha = new Date(tarea.fechaLimite);
    payload.fields.duedate = Utilities.formatDate(fecha, Session.getScriptTimeZone(), 'yyyy-MM-dd');
  }
  
  // Agregar estimación si existe
  if (tarea.estimacion) {
    payload.fields.timetracking = {
      originalEstimate: tarea.estimacion
    };
  }
  
  // Agregar campos personalizados
  if (tarea.reviewer && CONFIG.USER_MAPPING[tarea.reviewer]) {
    payload.fields[CONFIG.CUSTOM_FIELDS.REVIEWER] = [
      { accountId: CONFIG.USER_MAPPING[tarea.reviewer] }
    ];
  }
  
  if (tarea.compromiso === 'Comprometido') {
    payload.fields[CONFIG.CUSTOM_FIELDS.COMMITMENT] = { 
      id: CONFIG.FIELD_VALUES.COMMITMENT_COMMITTED 
    };
  }
  
  if (tarea.criteriosAceptacion) {
    payload.fields[CONFIG.CUSTOM_FIELDS.DONE_DEFINITION] = tarea.criteriosAceptacion;
  }
  
  if (tarea.area === 'Infraestructura') {
    payload.fields[CONFIG.CUSTOM_FIELDS.AREA] = [
      { id: CONFIG.FIELD_VALUES.AREA_INFRASTRUCTURE }
    ];
  }
  
  // Hacer la llamada a la API
  const response = UrlFetchApp.fetch(
    `https://api.atlassian.com/ex/jira/${CONFIG.CLOUD_ID}/rest/api/3/issue`,
    {
      method: 'POST',
      headers: {
        'Authorization': 'Basic ' + Utilities.base64Encode(`${CONFIG.ATLASSIAN_EMAIL}:${CONFIG.ATLASSIAN_API_TOKEN}`),
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      payload: JSON.stringify(payload)
    }
  );
  
  if (response.getResponseCode() !== 201) {
    const errorText = response.getContentText();
    throw new Error(`Error ${response.getResponseCode()}: ${errorText}`);
  }
  
  return JSON.parse(response.getContentText());
}

/**
 * Resumen mejorado con estadísticas detalladas
 */
function mostrarResumenMejorado(resultados, tiempoTotal) {
  const ui = SpreadsheetApp.getUi();
  const exitosas = resultados.filter(r => r.estado === 'Creada').length;
  const fallidas = resultados.filter(r => r.estado === 'Error').length;
  const promedio = tiempoTotal > 0 ? Math.round(tiempoTotal / resultados.length * 100) / 100 : 0;
  
  let mensaje = `🎯 RESUMEN DETALLADO DE CREACIÓN\n\n`;
  mensaje += `📊 ESTADÍSTICAS:\n`;
  mensaje += `✅ Tareas creadas exitosamente: ${exitosas}\n`;
  mensaje += `❌ Tareas con errores: ${fallidas}\n`;
  mensaje += `⏱️ Tiempo total: ${tiempoTotal}s\n`;
  mensaje += `📈 Promedio por tarea: ${promedio}s\n`;
  mensaje += `🎯 Tasa de éxito: ${Math.round((exitosas / resultados.length) * 100)}%\n\n`;
  
  if (exitosas > 0) {
    mensaje += `✅ TAREAS CREADAS EXITOSAMENTE:\n`;
    const exitosasOrdenadas = resultados
      .filter(r => r.estado === 'Creada')
      .sort((a, b) => a.fila - b.fila);
    
    exitosasOrdenadas.slice(0, 5).forEach(r => {
      mensaje += `• ${r.key}: ${r.titulo.substring(0, 50)}${r.titulo.length > 50 ? '...' : ''}\n`;
    });
    
    if (exitosasOrdenadas.length > 5) {
      mensaje += `  ... y ${exitosasOrdenadas.length - 5} más\n`;
    }
    mensaje += '\n';
  }
  
  if (fallidas > 0) {
    mensaje += `❌ ERRORES ENCONTRADOS:\n`;
    const fallidasOrdenadas = resultados
      .filter(r => r.estado === 'Error')
      .sort((a, b) => a.fila - b.fila);
    
    fallidasOrdenadas.slice(0, 3).forEach(r => {
      mensaje += `• Fila ${r.fila}: ${r.error.substring(0, 80)}${r.error.length > 80 ? '...' : ''}\n`;
    });
    
    if (fallidasOrdenadas.length > 3) {
      mensaje += `  ... y ${fallidasOrdenadas.length - 3} errores más\n`;
    }
    mensaje += '\n';
  }
  
  // Consejos basados en los resultados
  mensaje += `💡 CONSEJOS:\n`;
  if (fallidas > 0) {
    mensaje += `• Revisa los errores y corrige las filas problemáticas\n`;
    mensaje += `• Verifica permisos si hay errores de autorización\n`;
  }
  if (promedio > 3) {
    mensaje += `• El proceso fue lento, considera limpiar el cache\n`;
  }
  if (exitosas === resultados.length) {
    mensaje += `• ¡Perfecto! Todas las tareas se crearon exitosamente\n`;
  }
  
  console.log(mensaje);
  ui.alert('Resumen de Creación', mensaje, ui.ButtonSet.OK);
}

/**
 * Genera reporte detallado en nueva hoja
 */
function generarReporteResultados(resultados, tiempoTotal) {
  try {
    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    const timestamp = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'yyyy-MM-dd_HH-mm');
    const nombreHoja = `Reporte_Jira_${timestamp}`;
    
    // Crear nueva hoja
    const reporteSheet = spreadsheet.insertSheet(nombreHoja);
    
    // Headers del reporte
    const headers = [
      'Fila Original', 'Estado', 'Clave Jira', 'Título', 'URL', 'Error', 'Tiempo (s)'
    ];
    
    // Datos del reporte
    const datosReporte = resultados.map(r => [
      r.fila,
      r.estado,
      r.key || '',
      r.titulo,
      r.url || '',
      r.error || '',
      r.tiempo ? Math.round(r.tiempo / 1000 * 100) / 100 : ''
    ]);
    
    // Escribir headers
    const headerRange = reporteSheet.getRange(1, 1, 1, headers.length);
    headerRange.setValues([headers]);
    headerRange.setFontWeight('bold');
    headerRange.setBackground('#1e3c72');
    headerRange.setFontColor('#ffffff');
    
    // Escribir datos
    if (datosReporte.length > 0) {
      const dataRange = reporteSheet.getRange(2, 1, datosReporte.length, headers.length);
      dataRange.setValues(datosReporte);
      
      // Colorear filas según estado
      for (let i = 0; i < datosReporte.length; i++) {
        const rowRange = reporteSheet.getRange(i + 2, 1, 1, headers.length);
        if (datosReporte[i][1] === 'Creada') {
          rowRange.setBackground('#e8f5e8'); // Verde claro
        } else {
          rowRange.setBackground('#ffe8e8'); // Rojo claro
        }
      }
    }
    
    // Agregar resumen en la parte superior
    reporteSheet.insertRows(1, 3);
    reporteSheet.getRange(1, 1).setValue('RESUMEN DE EJECUCIÓN').setFontWeight('bold').setFontSize(14);
    reporteSheet.getRange(2, 1).setValue(`Fecha: ${new Date().toLocaleString()}`);
    reporteSheet.getRange(2, 3).setValue(`Tiempo total: ${tiempoTotal}s`);
    reporteSheet.getRange(2, 5).setValue(`Éxito: ${resultados.filter(r => r.estado === 'Creada').length}/${resultados.length}`);
    
    // Autoajustar columnas
    reporteSheet.autoResizeColumns(1, headers.length);
    
    // Mostrar confirmación
    const ui = SpreadsheetApp.getUi();
    ui.alert('✅ Reporte Generado', `Se creó el reporte detallado en la hoja: ${nombreHoja}`, ui.ButtonSet.OK);
    
    return nombreHoja;
    
  } catch (error) {
    console.error('Error generando reporte:', error);
    const ui = SpreadsheetApp.getUi();
    ui.alert('❌ Error', `No se pudo generar el reporte: ${error.message}`, ui.ButtonSet.OK);
  }
}

// ================================
// FUNCIONES DE UTILIDAD MEJORADAS
// ================================

/**
 * Obtiene el Cloud ID con cache
 */
function obtenerCloudId() {
  return obtenerConCache('cloud_ids', () => {
    try {
      const response = UrlFetchApp.fetch(
        'https://api.atlassian.com/oauth/token/accessible-resources',
        {
          method: 'GET',
          headers: {
            'Authorization': 'Basic ' + Utilities.base64Encode(`${CONFIG.ATLASSIAN_EMAIL}:${CONFIG.ATLASSIAN_API_TOKEN}`),
            'Accept': 'application/json'
          }
        }
      );
      
      if (response.getResponseCode() !== 200) {
        throw new Error(`Error ${response.getResponseCode()}: ${response.getContentText()}`);
      }
      
      const resources = JSON.parse(response.getContentText());
      console.log('Cloud IDs obtenidos:', resources.length);
      return resources;
    } catch (error) {
      console.error('Error obteniendo Cloud ID:', error);
      throw error;
    }
  });
}

/**
 * Obtiene información sobre campos personalizados con cache
 */
function obtenerCamposPersonalizados() {
  return obtenerConCache('custom_fields', () => {
    try {
      const response = UrlFetchApp.fetch(
        `https://api.atlassian.com/ex/jira/${CONFIG.CLOUD_ID}/rest/api/3/field`,
        {
          method: 'GET',
          headers: {
            'Authorization': 'Basic ' + Utilities.base64Encode(`${CONFIG.ATLASSIAN_EMAIL}:${CONFIG.ATLASSIAN_API_TOKEN}`),
            'Accept': 'application/json'
          }
        }
      );
      
      if (response.getResponseCode() !== 200) {
        throw new Error(`Error ${response.getResponseCode()}: ${response.getContentText()}`);
      }
      
      const fields = JSON.parse(response.getContentText());
      const customFields = fields.filter(f => f.id.startsWith('customfield_'));
      
      console.log('Campos personalizados obtenidos:', customFields.length);
      return customFields;
    } catch (error) {
      console.error('Error obteniendo campos personalizados:', error);
      throw error;
    }
  });
}

// ================================
// FUNCIONES AUXILIARES
// ================================

/**
 * Obtiene el Cloud ID de tu instancia de Atlassian
 */
function obtenerCloudId() {
  try {
    const response = UrlFetchApp.fetch(
      'https://api.atlassian.com/oauth/token/accessible-resources',
      {
        method: 'GET',
        headers: {
          'Authorization': 'Basic ' + Utilities.base64Encode(`${CONFIG.ATLASSIAN_EMAIL}:${CONFIG.ATLASSIAN_API_TOKEN}`),
          'Accept': 'application/json'
        }
      }
    );
    
    const resources = JSON.parse(response.getContentText());
    console.log('Cloud IDs disponibles:', resources);
    return resources;
  } catch (error) {
    console.error('Error obteniendo Cloud ID:', error);
    throw error;
  }
}

/**
 * Obtiene información sobre campos personalizados
 */
function obtenerCamposPersonalizados() {
  try {
    const response = UrlFetchApp.fetch(
      `https://api.atlassian.com/ex/jira/${CONFIG.CLOUD_ID}/rest/api/3/field`,
      {
        method: 'GET',
        headers: {
          'Authorization': 'Basic ' + Utilities.base64Encode(`${CONFIG.ATLASSIAN_EMAIL}:${CONFIG.ATLASSIAN_API_TOKEN}`),
          'Accept': 'application/json'
        }
      }
    );
    
    const fields = JSON.parse(response.getContentText());
    const customFields = fields.filter(f => f.id.startsWith('customfield_'));
    
    console.log('Campos personalizados:', customFields.map(f => ({
      id: f.id,
      name: f.name,
      type: f.schema?.type
    })));
    
    return customFields;
  } catch (error) {
    console.error('Error obteniendo campos personalizados:', error);
    throw error;
  }
}

/**
 * Función de prueba para validar configuración
 */
function probarConfiguracion() {
  const ui = SpreadsheetApp.getUi();
  
  try {
    console.log('🔧 Probando configuración...');
    
    // Verificar credenciales
    if (!CONFIG.ATLASSIAN_EMAIL || !CONFIG.ATLASSIAN_API_TOKEN) {
      ui.alert('❌ Configuración Incompleta', 'Por favor configura tus credenciales desde el menú primero.', ui.ButtonSet.OK);
      return;
    }
    
    // Probar conexión
    const cloudIds = obtenerCloudId();
    console.log('✅ Conexión exitosa');
    
    // Probar obtención de campos
    const campos = obtenerCamposPersonalizados();
    console.log('✅ Campos obtenidos');
    
    // Verificar hoja
    const datos = obtenerDatosHoja();
    console.log(`✅ Hoja encontrada con ${datos.length} tareas`);
    
    ui.alert('Configuración', '✅ Configuración válida. Puedes ejecutar las funciones de Jira.', ui.ButtonSet.OK);
    
  } catch (error) {
    console.error('❌ Error en configuración:', error);
    ui.alert('Error de Configuración', `❌ ${error.message}`, ui.ButtonSet.OK);
  }
} encontrada con ${datos.length} tareas`);
    
    Browser.msgBox('Configuración', '✅ Configuración válida. Puedes ejecutar crearTareasDesdeHoja()', Browser.Buttons.OK);
    
  } catch (error) {
    console.error('❌ Error en configuración:', error);
    Browser.msgBox('Error de Configuración', `❌ ${error.message}`, Browser.Buttons.OK);
  }
}

/**
 * Crea una hoja de ejemplo con la estructura correcta
 */
function crearHojaEjemplo() {
  const ui = SpreadsheetApp.getUi();
  
  try {
    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = spreadsheet.getSheetByName(CONFIG.SHEET_NAME);
    
    // Si la hoja ya existe, preguntamos si la queremos sobrescribir
    if (sheet) {
      const respuesta = ui.alert(
        'Hoja Existente', 
        `La hoja "${CONFIG.SHEET_NAME}" ya existe. ¿Deseas sobrescribirla?`, 
        ui.ButtonSet.YES_NO
      );
      
      if (respuesta === ui.Button.YES) {
        spreadsheet.deleteSheet(sheet);
      } else {
        return;
      }
    }
    
    // Crear nueva hoja
    sheet = spreadsheet.insertSheet(CONFIG.SHEET_NAME);
    
    // Headers
    const headers = [
      'Título', 'Tipo', 'Proyecto', 'Etiqueta', 'Área', 'Asignado', 'Reviewer', 
      'Creado', 'Equipo', 'Descripción', 'Estimación', 'Fecha Límite', 
      'Prioridad', 'Compromiso', 'Criterios de Aceptación'
    ];
    
    // Datos de ejemplo
    const ejemplos = [
      [
        'S4:: MT para validación de firma HMAC de Webhook Missive',
        'Tarea',
        'Bot de Mesa de Servicio (BDMS)',
        'SEMANA_4',
        'Infraestructura',
        'evert.romero@computocontable.com',
        'marcos.coronado@computocontable.com',
        new Date('2025-07-29'),
        'Infraestructura',
        'Migración técnica (MT) para implementar lógica de validación de la firma X-Missive-Signature',
        '2h',
        new Date('2025-08-23'),
        'Alta',
        'Comprometido',
        'Validación implementada, prueba unitaria documentada'
      ],
      [
        'CMS :::: MT para conexión entre Webhook y Kelly_API',
        'Tarea',
        'Bot de Mesa de Servicio (BDMS)',
        'SEMANA_5',
        'Infraestructura',
        'evert.romero@computocontable.com',
        'marcos.coronado@computocontable.com',
        new Date('2025-07-29'),
        'Infraestructura',
        'MT para programar la conexión entre el endpoint del webhook de Missive y el servicio Kelly_API para el procesamiento del contenido entrante',
        '1h 30m',
        new Date('2025-08-05'),
        'Alta',
        'Comprometido',
        'Conexión verificada, datos enviados correctamente, prueba de integración'
      ]
    ];
    
    // Formatear con colores corporativos
    const headerRange = sheet.getRange(1, 1, 1, headers.length);
    headerRange.setValues([headers]);
    headerRange.setFontWeight('bold');
    headerRange.setBackground('#1e3c72');
    headerRange.setFontColor('#ffffff');
    headerRange.setHorizontalAlignment('center');
    
    // Escribir ejemplos con colores alternados
    const dataRange = sheet.getRange(2, 1, ejemplos.length, headers.length);
    dataRange.setValues(ejemplos);
    
    // Aplicar colores alternados (estilo similar a tu hoja)
    for (let i = 0; i < ejemplos.length; i++) {
      const rowRange = sheet.getRange(i + 2, 1, 1, headers.length);
      if (i % 2 === 0) {
        rowRange.setBackground('#e8f2ff');  // Azul claro
      } else {
        rowRange.setBackground('#f8fcff');  // Azul muy claro
      }
      
      // Colorear columnas específicas
      sheet.getRange(i + 2, 4, 1, 1).setBackground('#d6e9ff'); // Etiqueta
      sheet.getRange(i + 2, 12, 1, 1).setBackground('#fff2e6'); // Prioridad
      sheet.getRange(i + 2, 13, 1, 1).setBackground('#e6f7ff'); // Compromiso
    }
    
    // Autoajustar columnas
    sheet.autoResizeColumns(1, headers.length);
    
    // Agregar bordes
    const allDataRange = sheet.getRange(1, 1, ejemplos.length + 1, headers.length);
    allDataRange.setBorder(true, true, true, true, true, true, '#4a90e2', SpreadsheetApp.BorderStyle.SOLID);
    
    ui.alert('Hoja Creada', `✅ Se creó la hoja "${CONFIG.SHEET_NAME}" con ejemplos`, ui.ButtonSet.OK);
    
  } catch (error) {
    console.error('Error creando hoja de ejemplo:', error);
    ui.alert('Error', `Error creando hoja: ${error.message}`, ui.ButtonSet.OK);
  }
}

// ================================
// MENÚ PERSONALIZADO
// ================================

/**
 * Crea un menú personalizado en Google Sheets
 */
function onOpen() {
  const ui = SpreadsheetApp.getUi();
  
  // Crear el menú principal
  const menu = ui.createMenu('🎯 Jira Tasks');
  
  // Submenu de configuración
  const configMenu = ui.createMenu('⚙️ Configuración')
    .addItem('📧 Configurar Credenciales', 'configurarCredenciales')
    .addItem('👀 Ver Configuración', 'verConfiguracion')
    .addItem('🔧 Probar Configuración', 'probarConfiguracion')
    .addSeparator()
    .addItem('🗑️ Limpiar Configuración', 'limpiarConfiguracion');
  
  // Submenu de tareas
  const tareasMenu = ui.createMenu('📋 Tareas')
    .addItem('📄 Crear Hoja de Ejemplo', 'crearHojaEjemplo')
    .addItem('➕ Agregar Tarea Individual', 'agregarTareaIndividual')
    .addItem('🚀 Crear Tareas desde Hoja', 'crearTareasDesdeHoja');
  
  // Submenu de herramientas
  const herramientasMenu = ui.createMenu('🔍 Herramientas')
    .addItem('🌐 Ver Cloud IDs', 'obtenerCloudId')
    .addItem('📝 Ver Campos Personalizados', 'obtenerCamposPersonalizados');
  
  // Agregar todos los submenus al menu principal
  menu
    .addSubMenu(configMenu)
    .addSubMenu(tareasMenu)
    .addSubMenu(herramientasMenu)
    .addToUi();
}