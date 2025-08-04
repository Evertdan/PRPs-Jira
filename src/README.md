# Sistema de Sincronización Jira ↔ Google Sheets

## Descripción
Sistema completo de sincronización bidireccional entre Jira y Google Sheets construido con Google Apps Script siguiendo las mejores prácticas de CLAUDE.md.

## Características Principales

### 🔄 Sincronización Bidireccional
- **Jira → Sheets**: Descarga automática de issues con toda la metadata
- **Sheets → Jira**: Actualización de status, asignación y prioridad desde Sheets
- **Tiempo Real**: Triggers automáticos cada 15 minutos (Jira→Sheets) y 5 minutos (Sheets→Jira)

### 🚀 Performance Optimizado
- **Rate Limiting**: Respeta límite de 10 req/seg de Jira Cloud
- **Batch Processing**: Procesa hasta 100 issues por lote
- **Timeout Management**: Maneja límite de 6 minutos de Apps Script con continuación automática
- **Quota Monitoring**: Monitoreo completo de quotas de Apps Script

### 📊 Monitoreo y Métricas
- **Health Checks**: Verificación automática diaria del sistema
- **Métricas Detalladas**: Performance, errores, uso de quotas
- **Alertas Email**: Notificaciones automáticas de errores críticos
- **Dashboard**: Métricas visuales en Google Sheets

### 🔒 Seguridad
- **Configuración Segura**: Credenciales almacenadas en PropertiesService
- **Validación de Datos**: Sanitización automática de HTML/XSS
- **Rate Limiting**: Protección contra abuso de APIs
- **Logging Estructurado**: Logs detallados para auditoría

## Estructura de Archivos

```
src/
├── Code.gs              # Funciones principales y punto de entrada
├── Config.gs            # Configuración, constantes y setup
├── AtlassianApi.gs      # Wrapper para APIs de Atlassian
├── Utils.gs             # Utilidades comunes y helpers
├── Triggers.gs          # Configuración de triggers automáticos
├── Tests.gs             # Suite completa de tests
├── appsscript.json      # Configuración del proyecto
└── README.md            # Esta documentación
```

## Configuración Inicial

### 1. Configurar Propiedades en Apps Script

```javascript
// Ejecutar en Apps Script Editor:
function configurarPropiedadesSeguras() {
  const properties = PropertiesService.getScriptProperties();
  properties.setProperties({
    'ATLASSIAN_DOMAIN': 'tu-empresa.atlassian.net',
    'ATLASSIAN_EMAIL': 'tu-email@empresa.com',
    'ATLASSIAN_API_TOKEN': 'ATATT3xFfGF0...', // Generar en: id.atlassian.com/manage-profile/security/api-tokens
    'JIRA_PROJECTS': '["PROJ1", "PROJ2"]', // JSON array de project keys
    'SHEET_ID': '1Abc-DeF_GhI...', // ID del Google Sheet
    'ENVIRONMENT': 'production',
    'ALERT_EMAIL': 'admin@empresa.com'
  });
}
```

### 2. Obtener API Token de Atlassian
1. Ir a: https://id.atlassian.com/manage-profile/security/api-tokens
2. Crear nuevo token
3. Copiar el token generado (ATATT3xFfGF0...)

### 3. Obtener ID de Google Sheet
1. Abrir Google Sheets
2. Crear nuevo spreadsheet o usar existente
3. Copiar ID de la URL: `https://docs.google.com/spreadsheets/d/{SHEET_ID}/edit`

### 4. Ejecutar Setup Inicial
```javascript
// En Apps Script Editor:
setupInicial()
```

## Uso

### Menú de Google Sheets
Una vez configurado, el menú "🔄 Jira Sync" estará disponible con las siguientes opciones:

- **🔽 Sincronizar Jira → Sheets**: Descarga issues de Jira
- **🔼 Sincronizar Sheets → Jira**: Aplica cambios desde Sheets a Jira
- **🔄 Sincronización Completa**: Ejecuta ambas sincronizaciones
- **⚙️ Configurar Sincronización**: Ver configuración actual
- **📊 Health Check**: Verificar estado del sistema
- **📈 Ver Métricas**: Dashboard de performance
- **🧪 Ejecutar Tests**: Suite completa de validaciones
- **🚀 Setup Inicial**: Configuración completa del sistema

### Sincronización Automática
El sistema se ejecuta automáticamente mediante triggers:
- **Cada 15 minutos**: Jira → Sheets
- **Cada 5 minutos**: Sheets → Jira  
- **Diario 9 AM**: Health check
- **Diario 2 AM**: Limpieza de logs
- **Lunes 8 AM**: Reporte semanal

### Edición Manual en Sheets
Puedes editar directamente en Google Sheets:
- **Status**: Cambiar estado del issue (automáticamente sincroniza transiciones en Jira)
- **Assignee**: Cambiar asignado (usar email address)
- **Priority**: Cambiar prioridad

Los cambios se detectan automáticamente y se sincronizan con Jira en máximo 5 minutos.

## Estructura de Google Sheets

### Hoja "Jira Issues" (Principal)
| Columna | Campo | Descripción |
|---------|-------|-------------|
| A | Key | Clave del issue (PROJ-123) |
| B | Summary | Título/resumen |
| C | Status | Estado actual (editable) |
| D | Assignee | Email del asignado (editable) |
| E | Priority | Prioridad (editable) |
| F | Issue Type | Tipo de issue |
| G | Created | Fecha de creación |
| H | Updated | Última actualización |
| I | Reporter | Creador del issue |
| J | Labels | Labels del issue |
| K | Sprint | Sprint actual |
| L | Story Points | Estimación |
| M | Components | Componentes |
| N | Description | Descripción (truncada) |
| O | Jira URL | Link directo al issue |
| P | Last Sync | Última sincronización |
| Q | Sync Status | Estado de sync (OK/ERROR/PENDING) |

### Otras Hojas
- **Sync Log**: Logs de sincronización y errores
- **Configuration**: Configuración y estado del sistema
- **Metrics Dashboard**: Métricas visuales y performance

## Comandos de Desarrollo

### Testing
```javascript
runTests()              // Ejecutar todos los tests
testConfiguracion()     // Test configuración básica
testConectividadJira()  // Test conectividad con Jira
healthCheck()           // Verificación completa de salud
```

### Debugging y Monitoreo
```javascript
debugMode()             // Activar logging detallado
getMetrics()            // Obtener métricas actuales
limpiarLogs()           // Limpiar logs antiguos
mostrarHealthCheck()    // Mostrar estado en UI
```

### Mantenimiento
```javascript
limpiarLogsAntiguos()   // Limpiar logs automáticamente
resetearContadores()    // Resetear contadores de quota
configurarTriggers()    // Reconfigurar triggers automáticos
```

## Troubleshooting

### Problemas Comunes

#### Error: "Configuración faltante"
- Verificar que todas las propiedades estén configuradas en PropertiesService
- Ejecutar `testConfiguracion()` para diagnosticar

#### Error: "Autenticación falló"
- Verificar API Token de Atlassian
- Comprobar email y domain
- Ejecutar `testConectividadJira()`

#### Error: "Sin acceso al proyecto"
- Verificar permisos en Jira para los proyectos configurados
- Comprobar que los project keys son correctos

#### Error: "Rate limit detectado"
- Normal, el sistema maneja automáticamente con exponential backoff
- Revisar logs para frecuencia

#### Sincronización lenta
- Verificar número de issues en proyectos
- Considerar filtrar por fechas recientes
- Revisar métricas de performance

### Logs y Debugging
- **Logs de Apps Script**: Ver en Apps Script Editor > Executions
- **Logs en Sheets**: Hoja "Sync Log"
- **Health Check**: Menú "🔄 Jira Sync" > "📊 Health Check"
- **Métricas**: Menú "🔄 Jira Sync" > "📈 Ver Métricas"

### Límites y Consideraciones

#### Límites de Google Apps Script
- **Tiempo ejecución**: 6 minutos máximo (sistema maneja con continuación automática)
- **URL Fetch**: 20,000 requests/día (monitoreado automáticamente)
- **Email**: 100 emails/día
- **Sheets**: 10M celdas máximo por spreadsheet

#### Límites de Jira Cloud
- **Rate Limit**: 10 requests/segundo (respetado automáticamente)
- **Paginación**: Máximo 100 issues por request
- **Custom Fields**: Configuración específica por proyecto

#### Recomendaciones de Performance
- **Proyectos grandes**: Usar filtros por fecha para sincronización incremental
- **Muchos issues**: El sistema maneja automáticamente con batch processing
- **Rate limits**: Configurados conservadoramente, ajustar en Config.gs si necesario

## Arquitectura y Patrones

### Patrones Implementados (CLAUDE.md)
- ✅ **KISS**: Funciones pequeñas y enfocadas
- ✅ **YAGNI**: Solo funcionalidades confirmadas
- ✅ **DRY**: Utilidades reutilizables
- ✅ **Rate Limiting**: Exponential backoff con jitter
- ✅ **Error Handling**: Try-catch obligatorio con logging
- ✅ **Configuración Segura**: PropertiesService exclusivamente
- ✅ **Logging Estructurado**: Contexto completo para debugging
- ✅ **Métricas y Monitoreo**: QuotaManager y MetricsCollector
- ✅ **Testing Obligatorio**: Suite completa de tests

### Límites Respetados
- ✅ **Máximo 500 líneas por archivo**
- ✅ **Máximo 50 líneas por función**
- ✅ **Máximo 10 parámetros por función**
- ✅ **Sin credenciales hardcodeadas**
- ✅ **Manejo de concurrencia con LockService**

## Soporte y Mantenimiento

### Alertas Automáticas
El sistema envía alertas por email automáticamente para:
- Errores críticos en sincronización
- Health checks fallidos
- Uso alto de quotas (>90%)
- Reporte semanal de métricas

### Monitoreo Continuo
- **Health checks diarios** a las 9 AM
- **Limpieza automática** de logs a las 2 AM
- **Reporte semanal** los lunes a las 8 AM
- **Métricas en tiempo real** en dashboard de Sheets

### Escalación de Problemas
1. **Revisar logs** en hoja "Sync Log"
2. **Ejecutar health check** manual
3. **Verificar configuración** en hoja "Configuration"
4. **Ejecutar tests** con `runTests()`
5. **Contactar administrador** si persisten errores

---

**Versión**: 1.0.0  
**Fecha**: 2025-01-04  
**Arquitectura**: Google Apps Script + Atlassian APIs  
**Patrones**: CLAUDE.md compliant  
**Estado**: Listo para producción ✅