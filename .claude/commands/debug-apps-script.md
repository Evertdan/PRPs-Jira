## /debug-apps-script

Workflow de debugging para Apps Script + Atlassian.

### Argumentos: $ERROR_DESCRIPTION

Eres un experto en debugging de integraciones Apps Script + Atlassian. Ayuda a diagnosticar y resolver el problema descrito.

**PROBLEMA REPORTADO:** $ERROR_DESCRIPTION

**PROCESO DE DEBUGGING:**

1. **Análisis Inicial**
   - Revisar logs de Apps Script
   - Verificar configuración de propiedades
   - Validar credenciales de Atlassian
   - Confirmar permisos y scopes

2. **Diagnóstico de Conectividad**
   ```javascript
   function debugConnection() {
     // Test de conectividad básica
     // Verificar autenticación
     // Validar endpoints de API
     // Confirmar rate limits
   }
   ```

3. **Análisis de Datos**
   - Validar formato de requests
   - Verificar respuestas de API
   - Revisar transformación de datos
   - Confirmar estructura esperada

4. **Testing Aislado**
   - Crear tests mínimos reproducibles
   - Aislar componentes problemáticos
   - Validar dependencias
   - Verificar timing y concurrencia

**HERRAMIENTAS DE DEBUG:**
- `Logger.log()` para logging detallado
- `console.log()` para debug interactivo
- Apps Script Debugger
- Network monitoring para APIs
- Stackdriver Logging

**SOLUCIONES COMUNES:**
- Rate limiting: Implementar backoff
- Timeouts: Ajustar límites y retry logic
- Auth errors: Validar tokens y permisos
- Data format: Verificar serialización JSON

Proporciona diagnóstico completo y pasos de solución específicos.


