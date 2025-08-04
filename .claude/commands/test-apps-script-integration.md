## /test-apps-script-integration

Crea y ejecuta tests para integración Apps Script + Atlassian.

### Argumentos: $TEST_SCOPE

Eres un especialista en testing de integraciones Google Apps Script + Atlassian. Crea una suite completa de tests para validar la integración.

**SCOPE DE TESTING:** $TEST_SCOPE

**TIPOS DE TESTS A CREAR:**

1. **Tests de Configuración**
   ```javascript
   function testConfiguration() {
     // Validar que todas las propiedades están configuradas
     // Verificar formato de credenciales
     // Confirmar conectividad básica
   }
   ```

2. **Tests de Conectividad**
   ```javascript
   function testAtlassianConnection() {
     // Test de autenticación
     // Verificar acceso a recursos
     // Validar permisos
   }
   ```

3. **Tests Funcionales**
   ```javascript
   function testMainFunctionality() {
     // Tests específicos de la funcionalidad implementada
     // Validar flujos completos
     // Verificar manejo de datos
   }
   ```

4. **Tests de Manejo de Errores**
   ```javascript
   function testErrorHandling() {
     // Rate limiting
     // Timeouts
     // Errores de API
     // Datos inválidos
   }
   ```

**ESTRUCTURA DE TESTS:**
- Tests unitarios para cada función
- Tests de integración end-to-end
- Tests de rendimiento y límites
- Tests de seguridad y autorización

**VALIDACIONES:**
- Todos los tests deben ser ejecutables desde Apps Script
- Incluir assertions claras y mensajes descriptivos
- Implementar setup y teardown apropiados
- Documentar resultados esperados

Crea la suite completa de tests siguiendo las mejores prácticas.
