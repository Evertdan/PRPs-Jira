# Execute Base PRP for Apps Script + Atlassian

Ejecuta un PRP existente contra la base de código de Google Apps Script + Atlassian, implementando la funcionalidad siguiendo todos los patrones y mejores prácticas establecidas.

## Argumentos: $ARGUMENTS

Voy a ejecutar el PRP: **$ARGUMENTS**

## Proceso de Ejecución

### 1. Análisis del PRP
- Leer y analizar el PRP especificado
- Validar que incluya todos los elementos requeridos
- Identificar dependencias y contexto necesario

### 2. Preparación del Entorno
- Verificar estructura de archivos existente
- Revisar configuración actual en `CLAUDE.md`
- Identificar patrones ya implementados

### 3. Implementación Paso a Paso
Siguiendo la arquitectura estándar de Apps Script:

#### Config.gs - Configuración y Constantes
- Agregar constantes específicas para la funcionalidad
- Configurar rate limits y timeouts
- Definir endpoints de Atlassian necesarios

#### AtlassianApi.gs - Wrapper de APIs
- Implementar métodos específicos usando `AtlassianApiBase`
- Aplicar patrones de rate limiting obligatorios
- Manejo de errores con logging estructurado

#### Utils.gs - Utilidades Comunes
- Funciones de validación de datos
- Helpers para procesamiento
- Utilidades de transformación

#### Code.gs - Funciones Principales
- Funciones públicas como punto de entrada
- Orquestación de la lógica principal
- Aplicación de QuotaManager y MetricsCollector

#### Tests.gs - Suite de Pruebas
- Tests unitarios para cada función
- Tests de integración con APIs reales
- Health checks y validaciones

### 4. Validación Automática
Ejecutaré automáticamente el bucle de validación definido en el PRP:

#### Nivel 1: Sintaxis y Estructura
- Validar límites de archivo (500 líneas max)
- Verificar límites de función (50 líneas max)
- Revisar convenciones de nombres

#### Nivel 2: Configuración y Seguridad
- Verificar uso correcto de PropertiesService
- Validar patrones de autenticación
- Comprobar manejo de errores obligatorio

#### Nivel 3: Funcionalidad
- Ejecutar tests unitarios
- Probar conectividad con Atlassian
- Verificar rate limiting y manejo de quotas

#### Nivel 4: Integración
- Tests end-to-end con datos reales
- Verificar métricas y logging
- Confirmar health checks

### 5. Resultado Final
- Código listo para producción
- Suite de tests completa
- Documentación actualizada
- Métricas y monitoreo configurado

¿Procedo con la ejecución del PRP: **$ARGUMENTS**?