// =====================================
// INTERFAZ DE USUARIO PARA REPORTE POR PERSONA
// =====================================

/**
 * ✅ Se ejecuta cuando el usuario abre la hoja de cálculo
 */
function onOpen() {
  const ui = SpreadsheetApp.getUi();
  
  // Menú principal para reporte personal
  ui.createMenu('👤 Mi Reporte Personal')
    .addItem('🔐 Configurar Credenciales', 'configurarCredencialesJiraSemanal')
    .addItem('🧪 Probar Conexión', 'verificarConexionJiraSemanal')
    .addSeparator()
    .addItem('📊 Generar Mi Reporte', 'generarReportePorPersona')
    .addSeparator()
    .addItem('📖 Ayuda', 'mostrarAyuda')
    .addToUi();

  // Menú de herramientas para organizar reporte
  ui.createMenu('🛠️ Herramientas de Reporte')
    .addItem('📅 Organizar por Semanas', 'organizarReportePorSemanas')
    .addItem('🔄 Restaurar Formato Original', 'restaurarFormatoOriginal')
    .addToUi();
}

/**
 * ✅ Genera reporte automático del usuario actual con selección de fechas
 */
async function generarReportePorPersona() {
  const ui = SpreadsheetApp.getUi();
  
  try {
    Logger.log('👤 [PERSONA] Iniciando generación de reporte del usuario actual...');
    
    if (!verificarCredencialesJiraSemanal()) {
      ui.alert('Configuración Requerida', 'Las credenciales no están configuradas.', ui.ButtonSet.OK);
      return;
    }
    
    // Mostrar diálogo de selección de fechas
    const template = HtmlService.createTemplateFromFile('FechasDialog');
    const html = template.evaluate()
      .setWidth(480)
      .setHeight(550);
    
    ui.showModalDialog(html, 'Seleccionar Período del Reporte');
    
  } catch (error) {
    Logger.log(`❌ [PERSONA] Error: ${error.message}`);
    ui.alert('Error Generando Reporte', `No se pudo generar tu reporte personal.\n\n${error.message}`, ui.ButtonSet.OK);
  }
}

/**
 * ✅ Función llamada desde el diálogo de fechas para generar el reporte
 */
async function generarReporteConFechas(fechaInicioStr, fechaFinStr) {
  const ui = SpreadsheetApp.getUi();
  
  try {
    Logger.log(`📅 [FECHAS] Generando reporte del ${fechaInicioStr} al ${fechaFinStr}`);
    
    // Mostrar mensaje de progreso
    ui.showModalDialog(
      HtmlService.createHtmlOutput('<p>🔍 Identificando usuario y obteniendo datos...</p><p>Por favor espera...</p>')
        .setWidth(400).setHeight(100),
      'Generando Reporte'
    );
    
    // Obtener información del usuario actual
    const usuarioActual = await obtenerUsuarioActual();
    
    Logger.log(`📊 [PERSONA] Generando reporte para: ${usuarioActual.nombre} (${usuarioActual.email})`);
    
    // Convertir fechas string a objetos Date
    const fechaInicio = new Date(fechaInicioStr + 'T00:00:00');
    const fechaFin = new Date(fechaFinStr + 'T23:59:59');
    
    // Calcular días del período
    const diferenciaDias = Math.ceil((fechaFin - fechaInicio) / (1000 * 60 * 60 * 24));
    
    Logger.log(`📅 [FECHAS] Período: ${diferenciaDias} días (${fechaInicio.toLocaleDateString()} - ${fechaFin.toLocaleDateString()})`);
    
    // Generar el reporte con las fechas seleccionadas
    const opciones = { 
      accountId: usuarioActual.accountId,
      nombreUsuario: usuarioActual.nombre,
      emailUsuario: usuarioActual.email,
      areaUsuario: usuarioActual.area,
      fechaInicio: fechaInicio,
      fechaFin: fechaFin,
      periodoTexto: `${diferenciaDias} días (${fechaInicio.toLocaleDateString()} - ${fechaFin.toLocaleDateString()})`
    };
    
    await generarReporteSemanalCompleto(opciones);
    
    return { success: true };
    
  } catch (error) {
    Logger.log(`❌ [FECHAS] Error: ${error.message}`);
    throw new Error(error.message);
  }
}

/**
 * ✅ Verifica conexión con Jira y muestra resultado al usuario
 */
function verificarConexionJiraSemanal() {
  const ui = SpreadsheetApp.getUi();
  
  try {
    Logger.log('🔍 [SEMANAL] Verificando conexión con Jira...');
    
    ui.showModalDialog(
      HtmlService.createHtmlOutput('<p>🔄 Verificando conexión con Jira...</p><p>Por favor espera...</p>')
        .setWidth(400).setHeight(100),
      'Verificando Conexión'
    );
    
    const resultado = probarConexionJiraSemanal();
    
    ui.alert(
      'Verificación de Conexión',
      resultado,
      ui.ButtonSet.OK
    );
    
  } catch (error) {
    Logger.log(`❌ [SEMANAL] Error verificando conexión: ${error.message}`);
    ui.alert(
      'Error de Conexión',
      `❌ No se pudo conectar con Jira.\n\n` +
      `🔍 Error: ${error.message}\n\n` +
      `💡 Soluciones:\n` +
      `• Verifica tus credenciales usando "🔐 Configurar Credenciales"\n` +
      `• Confirma que el dominio sea correcto\n` +
      `• Verifica tu conectividad a internet\n` +
      `• Asegúrate de que el API Token sea válido`,
      ui.ButtonSet.OK
    );
  }
}

/**
 * ✅ Muestra ayuda del sistema
 */
function mostrarAyuda() {
  const ui = SpreadsheetApp.getUi();
  
  let mensaje = `📖 AYUDA - ${SCRIPT_METADATA.nombre} v${SCRIPT_METADATA.version}\n\n`;
  
  mensaje += '🚀 GUÍA DE INICIO RÁPIDO:\n';
  mensaje += '1. 🔐 Configurar Credenciales - Configura tu API token personal\n';
  mensaje += '2. 🧪 Probar Conexión - Verifica que funcione correctamente\n';
  mensaje += '3. 📊 Generar Mi Reporte - Genera tu reporte personal automáticamente\n\n';
  
  mensaje += '⚙️ CÓMO FUNCIONA:\n';
  mensaje += 'El sistema identifica automáticamente tu usuario basado en las credenciales.\n';
  mensaje += 'Genera tu reporte personal usando los registros de trabajo (worklogs) de Jira.\n';
  mensaje += 'No necesitas seleccionar usuario - se genera automáticamente para ti.\n\n';
  
  mensaje += '📊 CARACTERÍSTICAS:\n';
  mensaje += '• Reporte automático basado en tus credenciales de Jira\n';
  mensaje += '• Identificación automática de tu usuario en el equipo CCSOFT\n';
  mensaje += '• Basado en registros de tiempo reales de Jira\n';
  mensaje += '• Formato detallado con 10 columnas de información\n';
  mensaje += '• Estadísticas personales de productividad\n\n';
  
  mensaje += '💡 CONSEJOS:\n';
  mensaje += '• Asegúrate de registrar tus horas de trabajo en Jira\n';
  mensaje += '• El reporte incluye los últimos 30 días por defecto\n';
  mensaje += '• Tu email debe estar registrado en el equipo CCSOFT\n\n';
  
  mensaje += `📞 INFORMACIÓN TÉCNICA:\n`;
  mensaje += `• Versión: ${SCRIPT_METADATA.version}\n`;
  mensaje += `• Fecha: ${SCRIPT_METADATA.fecha}\n`;
  mensaje += `• Autor: ${SCRIPT_METADATA.autor}`;
  
  ui.alert('Ayuda del Sistema', mensaje, ui.ButtonSet.OK);
}

/**
 * ✅ Organiza el reporte actual por semanas con sumas de tiempos
 */
function organizarReportePorSemanas() {
  const ui = SpreadsheetApp.getUi();
  
  try {
    Logger.log('📅 [SEMANAS] Iniciando organización por semanas...');
    
    const sheet = SpreadsheetApp.getActiveSheet();
    if (!sheet) {
      ui.alert('Error', 'No hay una hoja activa para procesar.', ui.ButtonSet.OK);
      return;
    }
    
    // Verificar si la hoja tiene datos
    const dataRange = sheet.getDataRange();
    if (dataRange.getNumRows() < 3) {
      ui.alert('Sin Datos', 'La hoja no tiene datos suficientes para procesar.', ui.ButtonSet.OK);
      return;
    }
    
    // Mostrar mensaje de progreso
    ui.showModalDialog(
      HtmlService.createHtmlOutput('<p>📅 Organizando reporte por semanas...</p><p>Por favor espera...</p>')
        .setWidth(400).setHeight(100),
      'Procesando Reporte'
    );
    
    // Buscar los datos del reporte (después de los encabezados)
    const datosReporte = extraerDatosReporte(sheet);
    
    if (datosReporte.length === 0) {
      ui.alert('Sin Datos', 'No se encontraron datos del reporte para procesar.', ui.ButtonSet.OK);
      return;
    }
    
    // Organizar por semanas
    const reportePorSemanas = organizarDatosPorSemanas(datosReporte);
    
    // Crear nueva hoja organizada
    const nuevaHoja = crearHojaOrganizadaPorSemanas(sheet.getParent(), reportePorSemanas);
    
    // Activar la nueva hoja
    sheet.getParent().setActiveSheet(nuevaHoja);
    
    ui.alert(
      'Reporte Organizado',
      `✅ El reporte ha sido organizado por semanas exitosamente!\n\n📊 Se creó la hoja: ${nuevaHoja.getName()}\n🔢 Semanas procesadas: ${Object.keys(reportePorSemanas).length}`,
      ui.ButtonSet.OK
    );
    
  } catch (error) {
    Logger.log(`❌ [SEMANAS] Error: ${error.message}`);
    ui.alert('Error', `No se pudo organizar el reporte por semanas.\n\n${error.message}`, ui.ButtonSet.OK);
  }
}

/**
 * ✅ Extrae los datos del reporte de la hoja actual
 */
function extraerDatosReporte(sheet) {
  const datos = [];
  const dataRange = sheet.getDataRange();
  const values = dataRange.getValues();
  
  let encabezadoEncontrado = false;
  let indiceCabecera = -1;
  
  // Buscar la fila de encabezados
  for (let i = 0; i < values.length; i++) {
    const fila = values[i];
    if (fila[0] === 'Persona asignada' && fila[1] === 'Nombre del proyecto') {
      encabezadoEncontrado = true;
      indiceCabecera = i;
      break;
    }
  }
  
  if (!encabezadoEncontrado) {
    throw new Error('No se encontraron los encabezados del reporte en la hoja.');
  }
  
  // Extraer datos después del encabezado
  for (let i = indiceCabecera + 1; i < values.length; i++) {
    const fila = values[i];
    
    // Saltar filas vacías o de estadísticas
    if (!fila[0] || fila[0].toString().includes('ESTADÍSTICAS') || fila[0].toString().includes('Total')) {
      continue;
    }
    
    // Saltar filas que son encabezados repetidos
    if (fila[0] === 'Persona asignada') {
      continue;
    }
    
    // Procesar fila de datos
    datos.push({
      personaAsignada: fila[0] || '',
      nombreProyecto: fila[1] || '',
      claveIncidencia: fila[2] || '',
      tipoIncidencia: fila[3] || '',
      resumen: fila[4] || '',
      tiempoTrabajado: parseFloat(fila[5]) || 0,
      estimacionOriginal: parseFloat(fila[6]) || 0,
      fechaVencimiento: fila[7] || '',
      estado: fila[8] || '',
      etiquetas: fila[9] || ''
    });
  }
  
  Logger.log(`📊 [DATOS] Extraídos ${datos.length} registros del reporte`);
  return datos;
}

/**
 * ✅ Organiza los datos por semanas basándose en las etiquetas
 */
function organizarDatosPorSemanas(datos) {
  const semanas = {};
  
  datos.forEach(registro => {
    const etiquetas = registro.etiquetas.toString();
    
    // Buscar etiqueta SEMANA_X
    const matchSemana = etiquetas.match(/SEMANA_(\d+)/);
    const semana = matchSemana ? `SEMANA_${matchSemana[1]}` : 'SIN_SEMANA';
    
    if (!semanas[semana]) {
      semanas[semana] = {
        registros: [],
        tiempoTotalSegundos: 0,
        estimacionTotalSegundos: 0
      };
    }
    
    semanas[semana].registros.push(registro);
    semanas[semana].tiempoTotalSegundos += registro.tiempoTrabajado;
    semanas[semana].estimacionTotalSegundos += registro.estimacionOriginal;
  });
  
  // Convertir tiempos a horas
  Object.keys(semanas).forEach(semana => {
    semanas[semana].tiempoTotalHoras = Math.round((semanas[semana].tiempoTotalSegundos / 3600) * 100) / 100;
    semanas[semana].estimacionTotalHoras = Math.round((semanas[semana].estimacionTotalSegundos / 3600) * 100) / 100;
  });
  
  Logger.log(`📅 [SEMANAS] Organizados datos en ${Object.keys(semanas).length} semanas`);
  return semanas;
}

/**
 * ✅ Crea una nueva hoja con el reporte organizado por semanas
 */
function crearHojaOrganizadaPorSemanas(spreadsheet, reportePorSemanas) {
  const fecha = new Date().toISOString().slice(0, 10);
  const nombreHoja = `Reporte_Semanal_${fecha}`;
  
  // Crear nueva hoja
  const nuevaHoja = spreadsheet.insertSheet(nombreHoja);
  
  let filaActual = 1;
  
  // Encabezado principal
  nuevaHoja.getRange(filaActual, 1, 1, 10)
    .merge()
    .setValue('📅 REPORTE ORGANIZADO POR SEMANAS')
    .setFontSize(18)
    .setFontWeight('bold')
    .setBackground('#1e3c72')
    .setFontColor('white')
    .setHorizontalAlignment('center');
  
  filaActual += 2;
  
  // Ordenar semanas numéricamente
  const semanasOrdenadas = Object.keys(reportePorSemanas).sort((a, b) => {
    if (a === 'SIN_SEMANA') return 1;
    if (b === 'SIN_SEMANA') return -1;
    
    const numA = parseInt(a.replace('SEMANA_', ''));
    const numB = parseInt(b.replace('SEMANA_', ''));
    return numA - numB;
  });
  
  semanasOrdenadas.forEach(semana => {
    const datosSemana = reportePorSemanas[semana];
    
    // Encabezado de semana con totales
    nuevaHoja.getRange(filaActual, 1, 1, 10)
      .merge()
      .setValue(`📅 ${semana} - Tiempo: ${datosSemana.tiempoTotalHoras}h | Estimación: ${datosSemana.estimacionTotalHoras}h | Registros: ${datosSemana.registros.length}`)
      .setFontSize(14)
      .setFontWeight('bold')
      .setBackground('#4CAF50')
      .setFontColor('white')
      .setHorizontalAlignment('left');
    
    filaActual++;
    
    // Encabezados de tabla
    const headers = [
      'Persona asignada', 'Nombre del proyecto', 'Clave de incidencia',
      'Tipo de Incidencia', 'Resumen', 'Tiempo Trabajado', 'Estimación original',
      'Fecha de vencimiento', 'Estado', 'Etiquetas'
    ];
    
    nuevaHoja.getRange(filaActual, 1, 1, headers.length)
      .setValues([headers])
      .setFontWeight('bold')
      .setBackground('#e8f2ff')
      .setFontColor('black');
    
    filaActual++;
    
    // Datos de la semana
    datosSemana.registros.forEach((registro, index) => {
      const fila = [
        registro.personaAsignada,
        registro.nombreProyecto,
        registro.claveIncidencia,
        registro.tipoIncidencia,
        registro.resumen,
        registro.tiempoTrabajado,
        registro.estimacionOriginal,
        registro.fechaVencimiento,
        registro.estado,
        registro.etiquetas
      ];
      
      const range = nuevaHoja.getRange(filaActual, 1, 1, fila.length);
      range.setValues([fila]);
      
      if (index % 2 === 1) {
        range.setBackground('#f8fcff');
      }
      
      filaActual++;
    });
    
    // Fila de totales de semana
    const filaTotales = [
      '', '', '', '', '',
      datosSemana.tiempoTotalHoras,
      datosSemana.estimacionTotalHoras,
      '', '', ''
    ];
    
    nuevaHoja.getRange(filaActual, 1, 1, filaTotales.length)
      .setValues([filaTotales])
      .setFontWeight('bold')
      .setBackground('#ffeb3b')
      .setFontColor('black');
    
    filaActual += 2; // Espacio entre semanas
  });
  
  // Aplicar formato a la hoja
  aplicarFormatoHojaSemanal(nuevaHoja);
  
  return nuevaHoja;
}

/**
 * ✅ Aplica formato a la hoja organizada por semanas
 */
function aplicarFormatoHojaSemanal(sheet) {
  // Ajustar ancho de columnas
  const anchos = [200, 250, 120, 150, 400, 120, 120, 150, 100, 120];
  anchos.forEach((ancho, index) => {
    sheet.setColumnWidth(index + 1, ancho);
  });
  
  // Formato general
  const rangeCompleto = sheet.getDataRange();
  if (rangeCompleto && rangeCompleto.getNumRows() > 0) {
    rangeCompleto.setFontFamily('Arial')
                 .setFontSize(10)
                 .setVerticalAlignment('middle');
  }
}

/**
 * ✅ Restaura el formato original del reporte (función placeholder)
 */
function restaurarFormatoOriginal() {
  const ui = SpreadsheetApp.getUi();
  
  ui.alert(
    'Restaurar Formato',
    '💡 Para restaurar el formato original, simplemente genera un nuevo reporte usando "📊 Generar Mi Reporte".\n\nEsto creará una nueva hoja con el formato estándar.',
    ui.ButtonSet.OK
  );
}