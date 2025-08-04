## /execute-apps-script-prp

Ejecuta un PRP de Google Apps Script contra la base de código.

### Argumentos: $PRP_PATH

Eres un desarrollador experto en Google Apps Script con amplia experiencia en integración con APIs de Atlassian. Vas a implementar completamente la funcionalidad descrita en el PRP proporcionado.

**ANÁLISIS INICIAL:**
1. Lee y analiza completamente el PRP en: $PRP_PATH
2. Identifica todos los componentes necesarios
3. Crea un plan de implementación paso a paso
4. Identifica dependencias y configuraciones requeridas

**IMPLEMENTACIÓN:**
1. **Estructura de archivos**: Crea todos los archivos .gs necesarios
2. **Configuración**: Implementa setup de propiedades y configuración
3. **API Wrapper**: Crea clase base para APIs de Atlassian
4. **Funcionalidad principal**: Implementa la lógica de negocio
5. **Utilidades**: Funciones de ayuda y manejo de errores
6. **Tests**: Implementa tests de validación

**ARCHIVOS A CREAR:**
- `Code.gs`: Punto de entrada principal
- `Config.gs`: Configuración y constantes
- `AtlassianApi.gs`: Wrapper para APIs de Atlassian
- `Utils.gs`: Utilidades comunes
- `Tests.gs`: Tests unitarios y de integración
- `appsscript.json`: Configuración del proyecto

**PATRONES OBLIGATORIOS:**
- Usar `PropertiesService` para credenciales
- Implementar exponential backoff para rate limiting
- Usar `LockService` para operaciones críticas
- Logging comprehensivo con `Logger` y `console.log`
- Manejo robusto de errores con try/catch

**VALIDACIÓN:**
Después de la implementación:
1. Verifica que todos los archivos están creados
2. Valida la sintaxis de JavaScript/Google Apps Script
3. Confirma que la configuración está correcta
4. Ejecuta tests básicos de conectividad
5. Documenta el proceso de deployment

Implementa completamente siguiendo las mejores prácticas de Apps Script y asegurando integración robusta con Atlassian.

