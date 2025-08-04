## /create-apps-script-prp

Crea un PRP especializado para Google Apps Script con integración Atlassian.

### Argumentos: $FEATURE_DESCRIPTION

Eres un experto en Google Apps Script y APIs de Atlassian. Tu tarea es crear un Product Requirements Prompt (PRP) completo para desarrollar una integración entre Google Apps Script y Atlassian (Jira/Confluence).

**INSTRUCCIONES CRÍTICAS:**
1. Usa la plantilla PRP base especializada en Apps Script + Atlassian
2. Incluye TODOS los contextos necesarios de las APIs de Atlassian
3. Especifica configuración de seguridad con PropertiesService
4. Incluye manejo de rate limiting y errores
5. Proporciona ejemplos de código específicos

**CONTEXTO A INCLUIR:**
- Documentación de Google Apps Script APIs
- Documentación de Atlassian REST APIs (Jira v3, Confluence v2)
- Herramientas MCP de Atlassian disponibles
- Patrones de autenticación y autorización
- Límites y consideraciones de Apps Script
- Ejemplos de integración similar

**ESTRUCTURA DEL PRP:**
1. **Objetivo**: Funcionalidad específica a implementar
2. **Por qué**: Valor de negocio y casos de uso
3. **Qué**: Descripción técnica detallada
4. **Contexto**: Toda la documentación y referencias necesarias
5. **Implementación**: Plan detallado con código de ejemplo
6. **Validación**: Tests y verificaciones ejecutables

**FEATURE A IMPLEMENTAR:** $FEATURE_DESCRIPTION

Genera el PRP completo siguiendo la plantilla base y asegurándote de incluir:
- Configuración segura de credenciales
- Manejo robusto de errores
- Rate limiting para APIs de Atlassian  
- Logging comprehensivo
- Tests de integración

