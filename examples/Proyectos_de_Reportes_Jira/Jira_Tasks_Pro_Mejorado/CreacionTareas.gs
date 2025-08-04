// =====================================
// MÓDULO DE CREACIÓN DE TAREAS
// =====================================

/**
 * Inicia el proceso de creación masiva de tareas de forma asíncrona.
 */
function iniciarCreacionMasiva() {
  const ui = SpreadsheetApp.getUi();
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  const sheetName = sheet.getName();

  if (!sheetName.includes('_Template')) {
    ui.alert('Error', 'Esta función solo se puede ejecutar en una hoja de plantilla (ej. PROJ_Template).', ui.ButtonSet.OK);
    return;
  }

  // Guardar el estado para el trigger
  const properties = PropertiesService.getUserProperties();
  properties.setProperty('CREACION_MASIVA_SHEET', sheetName);
  properties.setProperty('CREACION_MASIVA_FILA', '6'); // Empezar en la fila 6 (después de headers)

  // Crear el trigger para que se ejecute en unos segundos
  ScriptApp.newTrigger('procesarLoteDeTareas')
    .timeBased()
    .after(1000) // 1 segundo
    .create();

  ui.alert('Proceso Iniciado', 'La creación de tareas ha comenzado en segundo plano. Recibirás una notificación por correo al finalizar.', ui.ButtonSet.OK);
}

/**
 * Procesa un lote de tareas. Esta función es ejecutada por un trigger.
 */
function procesarLoteDeTareas() {
  const properties = PropertiesService.getUserProperties();
  const sheetName = properties.getProperty('CREACION_MASIVA_SHEET');
  let filaActual = parseInt(properties.getProperty('CREACION_MASIVA_FILA'));

  if (!sheetName) return; // Proceso ya terminado

  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName);
  const projectKey = sheetName.replace('_Template', '');
  const headers = sheet.getRange('A5:Z5').getValues()[0];
  const loteSize = 5; // Procesar 5 tareas por ejecución para evitar timeouts

  let tareasProcesadas = 0;
  
  for (let i = 0; i < loteSize; i++) {
    const fila = sheet.getRange(filaActual + i, 1, 1, headers.length).getValues()[0];
    if (fila.every(cell => cell === '')) { // Si llegamos al final de las tareas
      finalizarProceso(sheetName);
      return;
    }

    try {
      const payload = procesarFilaParaJira(fila, headers, projectKey);
      const response = LibreriaCoreJira.fetchJiraAPI('/rest/api/3/issue', {}, 'POST', payload);
      sheet.getRange(filaActual + i, headers.length + 1).setValue(response.key).setBackground('#d4edda');
    } catch (e) {
      LibreriaCoreJira.registrarError(e, `crearTareasMasivas (Fila ${filaActual + i})`);
      sheet.getRange(filaActual + i, headers.length + 1).setValue('ERROR').setBackground('#f8d7da');
    }
    tareasProcesadas++;
  }

  // Actualizar la fila para la siguiente ejecución
  properties.setProperty('CREACION_MASIVA_FILA', (filaActual + tareasProcesadas).toString());

  // Crear el siguiente trigger si aún quedan tareas
  ScriptApp.newTrigger('procesarLoteDeTareas').timeBased().after(10000).create(); // 10 segundos de espera
}

/**
 * Finaliza el proceso de creación masiva y notifica al usuario.
 */
function finalizarProceso(sheetName) {
  const properties = PropertiesService.getUserProperties();
  properties.deleteProperty('CREACION_MASIVA_SHEET');
  properties.deleteProperty('CREACION_MASIVA_FILA');

  // Eliminar todos los triggers para no dejar basura
  ScriptApp.getProjectTriggers().forEach(trigger => {
    if (trigger.getHandlerFunction() === 'procesarLoteDeTareas') {
      ScriptApp.deleteTrigger(trigger);
    }
  });

  const email = Session.getActiveUser().getEmail();
  MailApp.sendEmail(email, 'Jira Tasks Pro - Proceso Finalizado', `La creación masiva de tareas desde la hoja "${sheetName}" ha finalizado.`);
}

/**
 * Procesa una fila de la hoja para convertirla en un payload de Jira.
 * @param {Array} fila - La fila de datos de la hoja.
 * @param {Array} headers - Las cabeceras de la hoja.
 * @param {string} projectKey - La clave del proyecto de Jira.
 * @returns {Object} - El payload listo para enviar a la API de Jira.
 */
function procesarFilaParaJira(fila, headers, projectKey) {
  const fields = {};
  const headerMap = {
    'Título/Resumen': 'summary',
    'Descripción': 'description',
    'Tipo de Issue': 'issuetype',
    'Asignado': 'assignee',
    'Prioridad': 'priority',
    'Etiquetas': 'labels'
  };

  headers.forEach((header, i) => {
    const valor = fila[i];
    if (valor) {
      const campoJira = headerMap[header] || header; // Usar mapeo o el nombre directo
      
      // Lógica de transformación de datos
      switch (campoJira) {
        case 'issuetype':
          fields[campoJira] = { name: valor };
          break;
        case 'assignee':
          // Aquí se debería buscar el accountId del usuario, pero se simplifica por ahora
          fields[campoJira] = { name: valor }; 
          break;
        case 'priority':
          fields[campoJira] = { name: valor };
          break;
        case 'labels':
          fields[campoJira] = valor.toString().split(',').map(l => l.trim());
          break;
        default:
          fields[campoJira] = valor;
      }
    }
  });

  if (!fields.summary) {
    throw new Error('El campo "Título/Resumen" es obligatorio.');
  }

  return {
    fields: {
      project: { key: projectKey },
      ...fields
    }
  };
}
