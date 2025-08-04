// =====================================
// ARCHIVO PRINCIPAL: Disparadores y Menú
// =====================================

/**
 * Se ejecuta cuando el usuario abre la hoja de cálculo.
 * Crea un menú personalizado en la interfaz de Google Sheets para acceder a las funciones del script.
 */
function onOpen() {
  const ui = SpreadsheetApp.getUi();
  ui.createMenu('📄 Reporte Simple de Proyectos')
    .addItem('📄 Generar Reporte Simple de Proyectos...', 'generarReporteSimpleDeProyectos')
    .addSeparator()
    .addItem('🔑 Configurar Credenciales de Jira', 'configurarCredenciales')
    .addToUi();
}
