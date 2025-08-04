// =====================================
// ARCHIVO PRINCIPAL: Disparadores y Menú
// =====================================

/**
 * Se ejecuta cuando el usuario abre la hoja de cálculo.
 * Crea un menú personalizado en la interfaz de Google Sheets para acceder a las funciones del script.
 */
function onOpen() {
  const ui = SpreadsheetApp.getUi();
  ui.createMenu('📊 Reporte de Sprints')
    .addItem('🎯 Generar Reporte por Periodo (Sprint)...', 'mostrarDialogoGrupos')
    .addSeparator()
    .addItem('🔑 Configurar Credenciales de Jira', 'configurarCredenciales')
    .addSeparator()
    .addItem('🧪 Test Análisis de Entregables', 'testAnalisisEntregables')
    .addItem('🧪 Test Ordenamiento de Sprints', 'testSprintOrdering')
    .addToUi();
}
