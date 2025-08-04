## /optimize-apps-script

Optimización de rendimiento para Apps Script + Atlassian.

### Argumentos: $OPTIMIZATION_TARGET

Optimiza el rendimiento de la integración Apps Script + Atlassian.

**OBJETIVO DE OPTIMIZACIÓN:** $OPTIMIZATION_TARGET

**ÁREAS DE OPTIMIZACIÓN:**

1. **Límites de Ejecución**
   ```javascript
   // Manejo de tiempo de ejecución de 6 minutos
   function batchProcessing(items) {
     const BATCH_SIZE = 10;
     const batches = chunk(items, BATCH_SIZE);
     
     batches.forEach((batch, index) => {
       if (index > 0) {
         // Usar triggers para continuar procesamiento
         ScriptApp.newTrigger('processBatch')
           .timeBased()
           .after(1000) // 1 segundo delay
           .create();
       }
       processBatch(batch);
     });
   }
   ```

2. **Rate Limiting Inteligente**
   ```javascript
   // Implementar exponential backoff adaptativo
   function smartRateLimit(apiCall, maxRetries = 5) {
     // Lógica de backoff inteligente
     // Tracking de rate limits por endpoint
     // Cache de respuestas cuando sea apropiado
   }
   ```

3. **Caching Estratégico**
   ```javascript
   // Cache de datos frecuentemente accedidos
   function cacheManager() {
     // PropertiesService para cache persistente
     // CacheService para cache temporal
     // Invalidación inteligente de cache
   }
   ```

4. **Batch Operations**
   - Agrupar operaciones similares
   - Minimizar llamadas a APIs
   - Usar bulk operations cuando esté disponible
   - Paralelizar cuando sea posible

**MÉTRICAS A OPTIMIZAR:**
- Tiempo de ejecución total
- Número de llamadas a API
- Uso de quotas
- Latencia de respuesta
- Confiabilidad de ejecución

Implementa las optimizaciones más relevantes para el objetivo especificado.