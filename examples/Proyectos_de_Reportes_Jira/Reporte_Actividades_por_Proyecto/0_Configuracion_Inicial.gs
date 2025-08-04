// =====================================
// ARCHIVO 0: CONFIGURACIÓN INICIAL (EJECUTAR PRIMERO)
// =====================================

/**
 * Muestra un diálogo al usuario para configurar las credenciales de Jira de forma segura.
 * Estas credenciales se guardan en PropertiesService, NO en el código.
 */
function configurarCredenciales() {
  const ui = SpreadsheetApp.getUi();
  const email = ui.prompt('Configuración de Jira', 'Ingresa tu email de Jira:', ui.ButtonSet.OK_CANCEL);
  if (email.getSelectedButton() !== ui.Button.OK || !email.getResponseText()) {
    ui.alert('Configuración cancelada.');
    return;
  }

  const apiToken = ui.prompt('Configuración de Jira', 'Ingresa tu Token de API de Jira (lo puedes generar en https://id.atlassian.com/manage-profile/security/api-tokens):', ui.ButtonSet.OK_CANCEL);
  if (apiToken.getSelectedButton() !== ui.Button.OK || !apiToken.getResponseText()) {
    ui.alert('Configuración cancelada.');
    return;
  }

  // Guardar las credenciales de forma segura en las propiedades del usuario.
  const userProperties = PropertiesService.getUserProperties();
  userProperties.setProperty('JIRA_EMAIL', email.getResponseText());
  userProperties.setProperty('JIRA_API_TOKEN', apiToken.getResponseText());
  
  ui.alert('✅ Credenciales de Jira guardadas exitosamente.');
}
