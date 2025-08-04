/**
 * Módulo para manejo de interfaz de usuario y diálogos
 * Contiene todas las funciones relacionadas con la UI de Google Sheets
 */

class UIManager {
  
  constructor() {
    this.ui = SpreadsheetApp.getUi();
  }

  /**
   * Muestra el diálogo principal para selección de colaborador y período
   */
  mostrarDialogoPrincipal() {
    try {
      Logger.log("🎯 Iniciando reporte...");
      
      // Mostrar diálogo de carga
      this._mostrarDialogoCarga();

      // Obtener lista de colaboradores
      const usuariosActivos = obtenerListaColaboradores();

      if (usuariosActivos.length === 0) {
        this.ui.alert('Sin colaboradores', 'No se encontraron colaboradores activos.', this.ui.ButtonSet.OK);
        return;
      }

      // Crear y mostrar el diálogo HTML
      const html = this._crearDialogoSeleccion(usuariosActivos);
      this.ui.showModalDialog(html, '✅ Compromisos del Sprint');

    } catch (error) {
      Logger.log(`❌ Error en reporte: ${error.message}`);
      this.ui.alert('Error', `Error generando reporte: ${error.message}`, this.ui.ButtonSet.OK);
    }
  }

  /**
   * Muestra un diálogo de carga temporal
   * @private
   */
  _mostrarDialogoCarga() {
    const htmlCarga = HtmlService.createHtmlOutput('<p>🔍 Obteniendo lista de colaboradores...</p>')
      .setWidth(UI_CONFIG.loadingWidth)
      .setHeight(UI_CONFIG.loadingHeight);
    
    this.ui.showModalDialog(htmlCarga, 'Cargando datos...');
  }

  /**
   * Crea el diálogo HTML para selección de colaborador y período
   * @private
   * @param {Array} usuarios - Lista de usuarios disponibles
   * @returns {HtmlOutput} Diálogo HTML configurado
   */
  _crearDialogoSeleccion(usuarios) {
    const optionsUsuarios = this._generarOpcionesUsuarios(usuarios);
    const htmlContent = this._generarHTMLDialogo(optionsUsuarios);
    
    return HtmlService.createHtmlOutput(htmlContent)
      .setWidth(UI_CONFIG.dialogWidth)
      .setHeight(UI_CONFIG.dialogHeight);
  }

  /**
   * Genera las opciones HTML para el select de usuarios
   * @private
   * @param {Array} usuarios - Lista de usuarios
   * @returns {string} HTML de opciones
   */
  _generarOpcionesUsuarios(usuarios) {
    return usuarios.map(user => 
      `<option value="${user.accountId}" data-name="${user.displayName}">${user.displayName}</option>`
    ).join('');
  }

  /**
   * Genera el HTML completo del diálogo
   * @private
   * @param {string} optionsUsuarios - Opciones HTML de usuarios
   * @returns {string} HTML completo del diálogo
   */
  _generarHTMLDialogo(optionsUsuarios) {
    return `
      <style>
        body { 
          font-family: Arial, sans-serif; 
          margin: 15px; 
          background-color: #f8f9fa; 
        }
        .container { 
          max-width: 300px; 
          margin: 0 auto;
        }
        .form-group { 
          margin-bottom: 15px; 
        }
        label { 
          display: block; 
          margin-bottom: 5px; 
          font-weight: bold; 
          color: #495057; 
        }
        select, button { 
          width: 100%; 
          padding: 10px; 
          border-radius: 4px; 
          border: 1px solid #ced4da; 
          font-size: 14px; 
        }
        button { 
          background-color: #007bff; 
          color: white; 
          border: none; 
          cursor: pointer; 
          transition: background-color 0.2s; 
        }
        button:hover { 
          background-color: #0056b3; 
        }
        button:disabled {
          background-color: #cccccc;
          cursor: not-allowed;
        }
        #loader { 
          display: none; 
          text-align: center; 
          padding: 20px; 
        }
        .loading-spinner {
          border: 3px solid #f3f3f3;
          border-top: 3px solid #007bff;
          border-radius: 50%;
          width: 30px;
          height: 30px;
          animation: spin 1s linear infinite;
          margin: 10px auto;
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      </style>
      <div class="container">
        <div class="form-group">
          <label for="colaborador">Seleccionar Colaborador:</label>
          <select id="colaborador">
            ${optionsUsuarios}
          </select>
        </div>
        <div class="form-group">
          <label for="periodo">Seleccionar Período:</label>
          <select id="periodo">
            <option value="dia">Hoy</option>
            <option value="semanaAct">Semana actual</option>
            <option value="semanaAnt">Semana anterior</option>
            <option value="sprint">Sprint completo</option>
          </select>
        </div>
        <button id="btnGenerarReporte" onclick="ejecutarReporte()">
          🚀 Generar Reporte
        </button>
      </div>
      <div id="loader">
        <div class="loading-spinner"></div>
        <p>🔄 Generando reporte... Por favor, espera.</p>
      </div>
      <script>
        function ejecutarReporte() {
          const btn = document.getElementById('btnGenerarReporte');
          const loader = document.getElementById('loader');
          const container = document.querySelector('.container');

          // Deshabilitar botón y mostrar loader
          btn.disabled = true;
          container.style.display = 'none';
          loader.style.display = 'block';
          
          const colaborador = document.getElementById('colaborador').value;
          const periodo = document.getElementById('periodo').value;
          const colaboradorSelect = document.getElementById('colaborador');
          const colaboradorNombre = colaboradorSelect.options[colaboradorSelect.selectedIndex].getAttribute('data-name');
          
          google.script.run
            .withSuccessHandler(function(resultado) {
              google.script.host.close();
              alert('Reporte generado exitosamente. Tareas encontradas: ' + resultado.length);
              google.script.run.reporteCompromisos(resultado, colaboradorNombre);
            })
            .withFailureHandler(function(err) {
              // Rehabilitar botón y ocultar loader en caso de error
              btn.disabled = false;
              container.style.display = 'block';
              loader.style.display = 'none';
              alert('Error: ' + err);
            })
            .obtenerListaTareas(colaborador, periodo);
        }
      </script>
    `;
  }

  /**
   * Muestra un mensaje de alerta al usuario
   * @param {string} titulo - Título de la alerta
   * @param {string} mensaje - Mensaje de la alerta
   */
  mostrarAlerta(titulo, mensaje) {
    this.ui.alert(titulo, mensaje, this.ui.ButtonSet.OK);
  }

  /**
   * Muestra un mensaje de confirmación al usuario
   * @param {string} titulo - Título de la confirmación
   * @param {string} mensaje - Mensaje de la confirmación
   * @returns {boolean} True si el usuario confirma, false en caso contrario
   */
  mostrarConfirmacion(titulo, mensaje) {
    const response = this.ui.alert(titulo, mensaje, this.ui.ButtonSet.YES_NO);
    return response === this.ui.Button.YES;
  }
}

// Funciones globales para mantener compatibilidad
function mostrarDialogo() {
  const uiManager = new UIManager();
  uiManager.mostrarDialogoPrincipal();
}

function crearDialogo(usuarios) {
  const uiManager = new UIManager();
  return uiManager._crearDialogoSeleccion(usuarios);
}