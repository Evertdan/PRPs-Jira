// =====================================
// MÓDULO DE GENERACIÓN DE PLANTILLAS
// =====================================

/**
 * Orquesta la generación de hojas de plantilla basadas en proyectos de Jira.
 */
function generarHojasPorProyecto() {
  const ui = SpreadsheetApp.getUi();
  try {
    const proyectos = LibreriaCoreJira.obtenerTodosLosProyectos();
    if (!proyectos || proyectos.length === 0) {
      throw new Error("No se encontraron proyectos accesibles.");
    }
    
    const proyectosSeleccionados = mostrarDialogoSeleccionProyectos(proyectos);
    if (!proyectosSeleccionados || proyectosSeleccionados.length === 0) {
      ui.alert("No se seleccionó ningún proyecto.");
      return;
    }

    let generadas = 0;
    proyectosSeleccionados.forEach(proyectoKey => {
      const proyecto = proyectos.find(p => p.key === proyectoKey);
      if (proyecto) {
        crearHojaProyecto(proyecto);
        generadas++;
      }
    });

    ui.alert('✅ Proceso completado', `Se han generado ${generadas} hojas de plantilla.`);

  } catch (e) {
    LibreriaCoreJira.registrarError(e, 'generarHojasPorProyecto');
  }
}

/**
 * Crea una hoja de cálculo personalizada y formateada para un proyecto específico.
 * @param {Object} proyecto - El objeto del proyecto de Jira.
 */
function crearHojaProyecto(proyecto) {
  const nombreHoja = `${proyecto.key}_Template`;
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = spreadsheet.getSheetByName(nombreHoja);
  if (sheet) {
    spreadsheet.deleteSheet(sheet);
  }
  sheet = spreadsheet.insertSheet(nombreHoja);

  const esquema = obtenerEsquemaCamposProyecto(proyecto.key);
  const campos = clasificarCampos(esquema, proyecto);
  const headers = campos.map(c => c.nombre);

  // Escribir información del proyecto y leyenda
  sheet.getRange('A1').setValue(`📁 PROYECTO: ${proyecto.key} - ${proyecto.name}`).setFontWeight('bold').setFontSize(16);
  sheet.getRange('A2').setValue(`👤 Líder: ${proyecto.lead?.displayName || 'No asignado'}`);
  sheet.getRange('A4').setValue('LEYENDA:').setFontWeight('bold');
  sheet.getRange('B4').setValue('🔴 Obligatorio').setBackground('#dc3545').setFontColor('#ffffff');
  sheet.getRange('C4').setValue('🔵 Opcional').setBackground('#4a90e2').setFontColor('#ffffff');

  // Escribir cabeceras
  const headerRange = sheet.getRange(5, 1, 1, headers.length);
  headerRange.setValues([headers]).setFontWeight('bold');

  // Aplicar formato a cabeceras
  campos.forEach((campo, i) => {
    const celda = sheet.getRange(5, i + 1);
    const color = campo.obligatorio ? '#dc3545' : '#4a90e2';
    celda.setBackground(color).setFontColor('#ffffff');
    celda.setNote(`Tipo: ${campo.tipo}
Ejemplo: ${campo.ejemplo}`);
  });

  sheet.autoResizeColumns(1, headers.length);
  sheet.setFrozenRows(5);
}


/**
 * Obtiene y procesa el esquema de campos para un proyecto.
 * @param {string} projectKey - La clave del proyecto.
 * @returns {Array} - Un array de objetos de campo procesados.
 */
function obtenerEsquemaCamposProyecto(projectKey) {
  const endpoint = `/rest/api/3/issue/createmeta`;
  const params = { projectKeys: projectKey, expand: 'projects.issuetypes.fields' };
  const data = LibreriaCoreJira.fetchJiraAPI(endpoint, params);
  
  if (!data || data.length === 0 || !data[0].projects || data[0].projects.length === 0) {
    throw new Error(`No se pudo obtener el esquema de campos para el proyecto ${projectKey}.`);
  }

  const campos = new Map();
  data[0].projects[0].issuetypes.forEach(issueType => {
    Object.values(issueType.fields).forEach(fieldInfo => {
      if (!campos.has(fieldInfo.fieldId)) {
        campos.set(fieldInfo.fieldId, {
          id: fieldInfo.fieldId,
          nombre: fieldInfo.name,
          tipo: fieldInfo.schema?.type || 'unknown',
          obligatorio: fieldInfo.required || false,
          valores: fieldInfo.allowedValues || null
        });
      }
    });
  });
  return Array.from(campos.values());
}

/**
 * Clasifica los campos en obligatorios y opcionales, añadiendo campos base.
 * @param {Array} esquemaCampos - El esquema de campos del proyecto.
 * @param {Object} proyecto - El objeto del proyecto.
 * @returns {Array} - Un array de campos clasificados y listos para la cabecera.
 */
function clasificarCampos(esquemaCampos, proyecto) {
  const camposBase = [
    { id: 'summary', nombre: 'Título/Resumen', tipo: 'string', obligatorio: true, ejemplo: 'Implementar nueva API' },
    { id: 'description', nombre: 'Descripción', tipo: 'string', obligatorio: false, ejemplo: 'Descripción detallada de la tarea.' },
    { id: 'issuetype', nombre: 'Tipo de Issue', tipo: 'issuetype', obligatorio: true, ejemplo: proyecto.issueTypes[0]?.name || 'Task' },
    { id: 'assignee', nombre: 'Asignado', tipo: 'user', obligatorio: false, ejemplo: 'usuario@dominio.com' },
    { id: 'priority', nombre: 'Prioridad', tipo: 'priority', obligatorio: false, ejemplo: 'Medium' },
    { id: 'labels', nombre: 'Etiquetas', tipo: 'array', obligatorio: false, ejemplo: 'backend, release-1' }
  ];

  const camposExistentes = new Set(camposBase.map(c => c.id));
  const todosLosCampos = [...camposBase];

  esquemaCampos.forEach(campo => {
    if (!camposExistentes.has(campo.id)) {
      todosLosCampos.push({
        ...campo,
        ejemplo: generarEjemploCampo(campo)
      });
      camposExistentes.add(campo.id);
    }
  });

  return todosLosCampos.sort((a, b) => b.obligatorio - a.obligatorio);
}

/**
 * Genera un texto de ejemplo para un campo de Jira.
 * @param {Object} campo - El objeto del campo.
 * @returns {string} - Un string con el ejemplo.
 */
function generarEjemploCampo(campo) {
  if (campo.valores && campo.valores.length > 0) return campo.valores[0].value || campo.valores[0].name;
  switch (campo.tipo) {
    case 'number': return '123';
    case 'date': return 'YYYY-MM-DD';
    case 'datetime': return 'YYYY-MM-DDTHH:MM:SS.sssZ';
    case 'user': return 'nombre.apellido';
    case 'array': return 'valor1, valor2';
    default: return 'Ejemplo de texto';
  }
}


/**
 * Clasifica los campos en obligatorios y opcionales.
 * @param {Array} esquemaCampos - El esquema de campos del proyecto.
 * @returns {Array} - Un array de campos clasificados y listos para la cabecera.
 */
function clasificarCampos(esquemaCampos) {
  // ... (Lógica de clasificación de campos, se mantiene igual)
  return []; // Placeholder
}
