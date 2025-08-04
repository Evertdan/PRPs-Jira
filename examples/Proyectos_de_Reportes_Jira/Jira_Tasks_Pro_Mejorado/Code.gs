// =====================================
// ARCHIVO PRINCIPAL: MENÚ Y DISPARADORES
// =====================================

/**
 * Se ejecuta cuando el usuario abre la hoja de cálculo.
 * Crea el menú personalizado en la interfaz de Google Sheets.
 */
function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('Jira Tasks Pro 🚀')
    .addsubmenu(SpreadsheetApp.getUi().createMenu('📋 Tareas')
      .addItem('➕ Agregar Tarea Individual', 'agregarTareaIndividual')
      .addItem('🚀 Iniciar Creación Masiva', 'iniciarCreacionMasiva'))
    .addsubmenu(SpreadsheetApp.getUi().createMenu('📄 Plantillas')
      .addItem('🏗️ Generar Hojas por Proyecto', 'generarHojasPorProyecto'))
    .addSeparator()
    .addsubmenu(SpreadsheetApp.getUi().createMenu('⚙️ Herramientas')
      .addItem('🔐 Configurar Credenciales', 'configurarCredenciales')
      .addItem('🔍 Diagnóstico Completo', 'ejecutarDiagnosticoCompleto')
      .addItem('🗑️ Limpiar Cache del Sistema', 'limpiarCache'))
    .addSeparator()
    .addItem('🆘 Centro de Ayuda', 'mostrarCentroAyuda')
    .addToUi();
}
