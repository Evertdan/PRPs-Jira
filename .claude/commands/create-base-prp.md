# Create Base PRP for Apps Script + Atlassian

Genera un PRP (Prompt de Requisito de Producto) completo para integración con Google Apps Script y APIs de Atlassian siguiendo las mejores prácticas establecidas en CLAUDE.md.

## Argumentos: $ARGUMENTS

Voy a crear un PRP completo para: **$ARGUMENTS**

Primero, investigaré el contexto actual del proyecto y luego generaré un PRP estructurado que incluya:

1. **Objetivo claro** - Qué funcionalidad específica implementar
2. **Justificación** - Por qué es necesaria esta funcionalidad  
3. **Contexto técnico completo** - Patrones Apps Script, límites, APIs Atlassian
4. **Plan de implementación detallado** - Siguiendo arquitectura estándar
5. **Bucle de validación ejecutable** - Tests y verificaciones

## Investigación del Contexto

Primero voy a revisar la estructura actual del proyecto para entender:
- Archivos existentes de Apps Script
- Configuración actual de Atlassian APIs
- Patrones ya implementados
- Tests y utilities disponibles

## Generación del PRP

Basándome en la plantilla `PRPs/templates/prp_apps_script_atlassian.md` y siguiendo las directrices de `CLAUDE.md`, crearé un PRP que incluya:

### Contexto Específico para Apps Script + Atlassian:
- Rate limiting con exponential backoff + jitter
- Manejo de quotas de Apps Script (20K UrlFetch/día)
- Autenticación segura con PropertiesService
- Manejo de límite de 6 minutos con triggers
- Logging estructurado obligatorio
- Métricas y health checks

### Patrones Obligatorios:
- Clase `AtlassianApiBase` para autenticación
- Función `realizarRequestConRateLimit` para todas las llamadas
- Validación de datos con `validarDatos*`
- Tests unitarios y de integración
- Manejo de concurrencia con LockService

### Estructura de Archivos:
```
├── Code.gs              # Funciones públicas principales
├── Config.gs            # Configuración y constantes
├── AtlassianApi.gs      # Wrapper APIs Atlassian
├── Utils.gs             # Utilidades comunes
├── Tests.gs             # Suite de tests
```

Una vez generado el PRP, lo guardaré en `PRPs/` con un nombre descriptivo y te mostraré el contenido completo para tu revisión.

¿Procedo con la creación del PRP para: **$ARGUMENTS**?