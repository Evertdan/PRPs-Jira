// =====================================
// MÓDULO DE CONFIGURACIÓN
// =====================================

/**
 * Muestra un diálogo para que el usuario configure sus credenciales de Jira.
 * Esta función ahora llama a una función genérica de la librería.
 */
function configurarCredenciales() {
  try {
    LibreriaCoreJira.configurarCredencialesDialogo(); 
  } catch (e) {
    LibreriaCoreJira.registrarError(e, 'configurarCredenciales');
  }
}
