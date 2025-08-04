// =====================================
// ARCHIVO 8: FUNCIONES DE PRUEBA Y DIAGNÓSTICO
// =====================================

/**
* ✅ Función de prueba para verificar el correcto funcionamiento del análisis de entregables.
* Simula una tarea con diversa evidencia y muestra el resultado del análisis.
*/
function testAnalisisEntregables() {
 Logger.log("🧪 Iniciando test de análisis de entregables...");
 
 try {
   // Crea un objeto de tarea simulado con datos de prueba.
   const tareaSimulada = {
     key: "TEST-123",
     fields: {
       summary: "Tarea de prueba para análisis de entregables",
       status: { name: "Done" },
       project: { name: "Proyecto Test" },
       
       // Simula archivos adjuntos.
       attachment: [
         {
           filename: "screenshot.png",
           size: 1024000,
           mimeType: "image/png",
           author: { displayName: "Test User" },
           created: "2025-07-22T10:00:00.000Z",
           content: "https://test.com/file1"
         },
         {
           filename: "document.pdf",
           size: 2048000,
           mimeType: "application/pdf",
           author: { displayName: "Test User" },
           created: "2025-07-22T11:00:00.000Z",
           content: "https://test.com/file2"
         }
       ],
       
       // Simula comentarios.
       comment: {
         total: 2,
         comments: [
           {
             id: "1",
             author: { displayName: "Test User" },
             body: "Adjunto el pull request: https://bitbucket.org/test/pull/123",
             created: "2025-07-22T12:00:00.000Z"
           },
           {
             id: "2",
             author: { displayName: "Test User 2" },
             body: "Commit realizado: https://github.com/test/commit/abc123",
             created: "2025-07-22T13:00:00.000Z"
           }
         ]
       },
       
       // Simula una descripción con enlaces.
       description: "Esta tarea incluye un enlace importante: https://documentation.test.com/guide",
       
       // Simula campos personalizados.
       [CAMPOS_ENTREGABLES.comentarios]: "Información adicional en campo personalizado",
       [CAMPOS_ENTREGABLES.desviaciones]: "Desviación documentada en el proceso"
     }
   };
   
   // Ejecuta la función de análisis con la tarea simulada.
   const resultado = evaluarEntregablesYEvidencia(tareaSimulada);
   
   // Registra los resultados en el log.
   Logger.log("✅ Resultados del test:");
   Logger.log(`📊 Puntuación total: ${resultado.puntuacion}`);
   Logger.log(`🎯 Nivel de calidad: ${resultado.calidad.nivel}`);
   Logger.log(`📎 Archivos encontrados: ${resultado.archivos.length}`);
   Logger.log(`📷 Imágenes encontradas: ${resultado.imagenes.length}`);
   Logger.log(`🔗 Enlaces encontrados: ${resultado.enlaces.length}`);
   Logger.log(`🔀 Pull Requests encontrados: ${resultado.pullRequests.length}`);
   Logger.log(`📝 Commits encontrados: ${resultado.commits.length}`);
   Logger.log(`💬 Comentarios analizados: ${resultado.comentarios.length}`);
   Logger.log(`📋 Resumen: ${resultado.resumen}`);
   
   // Muestra un resumen de los resultados al usuario.
   const ui = SpreadsheetApp.getUi();
   ui.alert(
     '🧪 Test de Análisis de Entregables',
     `✅ Test completado exitosamente!\n\n` +
     `📊 Puntuación: ${resultado.puntuacion} puntos\n` +
     `🎯 Calidad: ${resultado.calidad.emoji} ${resultado.calidad.texto}\n` +
     `📎 Archivos: ${resultado.archivos.length} (${resultado.imagenes.length} imágenes)\n` +
     `🔗 Enlaces: ${resultado.enlaces.length}\n` +
     `🔀 Pull Requests: ${resultado.pullRequests.length}\n` +
     `📝 Commits: ${resultado.commits.length}\n\n` +
     `📋 Resumen: ${resultado.resumen}\n\n` +
     `Revisa los logs para más detalles.`,
     ui.ButtonSet.OK
   );
   
 } catch (error) {
   Logger.log(`❌ Error en test: ${error.message}`);
   SpreadsheetApp.getUi().alert('Error en Test', `Error: ${error.message}`, SpreadsheetApp.getUi().ButtonSet.OK);
 }
}

/**
* ✅ Función de prueba para verificar el correcto ordenamiento de los sprints.
*/
function testSprintOrdering() {
 const testSprints = [
   "Q4-S2-24", "Q4-S1-24", "Q3-S3-24", "Q3-S2-24", "Q3-S1-25",
   "Q3-S1-24", "Q2-S3-25", "Q2-S3-24", "Q2-S2-25", "Q2-S2-24",
   "Q2-S1-25", "Q2-S1-24", "Q1-S3-25", "Q1-S2-25", "Q1-S2-24",
   "Q1-S1-25", "Q1-S1-24"
 ];
 
 const ordenados = testSprints.sort((a, b) => compareSprintKeys(a, b));
 
 Logger.log("🧪 Test de ordenamiento:");
 ordenados.forEach((sprint, index) => {
   const parts = parseSprintKey(sprint);
   Logger.log(`  ${index + 1}. ${sprint} (${parts.year}-Q${parts.quarter}-S${parts.sprint})`);
 });
 
 const ui = SpreadsheetApp.getUi();
 ui.alert(
   '🧪 Test de Ordenamiento', 
   `✅ Sprints ordenados correctamente.\n\nPrimero: ${ordenados[0]}\nÚltimo: ${ordenados[ordenados.length-1]}\n\nRevisa los logs para detalles completos.`,
   ui.ButtonSet.OK
 );
}
