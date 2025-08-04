# 🚀 Plantilla PRP - Google Apps Script + Atlassian Integration

Una plantilla completa especializada en **Context Engineering** usando el **framework PRP (Product Requirements Prompt)** para desarrollar integraciones robustas entre **Google Apps Script** y **APIs de Atlassian** (Jira y Confluence).

## 📋 Tabla de Contenidos

- [Descripción](#descripción)
- [Características](#características)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Instalación y Setup](#instalación-y-setup)
- [Uso Rápido](#uso-rápido)
- [Comandos Claude Disponibles](#comandos-claude-disponibles)
- [Ejemplos de Implementación](#ejemplos-de-implementación)
- [Testing y Validación](#testing-y-validación)
- [Mejores Prácticas](#mejores-prácticas)
- [Troubleshooting](#troubleshooting)
- [Contribución](#contribución)

## 🎯 Descripción

Esta plantilla implementa la metodología **PRP (Product Requirements Prompt)** específicamente optimizada para crear integraciones entre Google Apps Script y Atlassian. Incluye:

- **Context Engineering** preconfigurado
- **APIs wrappers** para Jira y Confluence
- **Comandos Claude Code** especializados
- **Suite completa de tests**
- **Monitoreo y alertas** automáticas
- **Manejo robusto de errores** y rate limiting
- **Documentación** exhaustiva

### ¿Por qué usar Context Engineering?

> *"Context engineering es lo que separa resultados reales del vibe coding y prompt engineering básico"*

La metodología PRP proporciona:
- ✅ **Código listo para producción** en el primer intento
- ✅ **Contexto completo** para AI coding assistants
- ✅ **Validación automática** y testing integrado
- ✅ **Mejores prácticas** establecidas
- ✅ **Escalabilidad** y mantenibilidad

## ⭐ Características

### 🏗️ Context Engineering
- **PRP Framework** adaptado para Apps Script + Atlassian
- **Plantillas especializadas** con contexto preconfigurado
- **Comandos Claude** optimizados para el caso de uso
- **Documentación técnica** integrada

### 🔧 APIs y Integraciones
- **Wrapper completo** para Jira REST API v3
- **Wrapper completo** para Confluence REST API v2
- **Autenticación segura** con API tokens
- **Rate limiting inteligente** con exponential backoff
- **Manejo robusto de errores** y reintentos

### 🧪 Testing y Validación  
- **Suite completa de tests** unitarios e integración
- **Health checks** automáticos
- **Validación de configuración**
- **Tests de rendimiento**

### 📊 Monitoreo y Métricas
- **Colección automática** de métricas
- **Monitoreo de quotas** de Google Apps Script
- **Sistema de alertas** por email
- **Logs estructurados**

### 🛡️ Seguridad y Confiabilidad
- **Credenciales seguras** con PropertiesService
- **Sanitización de datos** de entrada
- **Concurrencia** con LockService
- **Backup automático** de configuración

## 📁 Estructura del Proyecto

```
apps-script-atlassian-integration/
├── .claude/
│   └── commands/                 # Comandos especializados Claude
│       ├── create-apps-script-prp.md
│       ├── execute-apps-script-prp.md
│       ├── test-apps-script-integration.md
│       ├── deploy-apps-script.md
│       ├── debug-apps-script.md
│       └── optimize-apps-script.md
├── PRPs/
│   ├── templates/
│   │   └── prp_apps_script_atlassian.md  # Plantilla PRP base
│   ├── initial.md                        # Template para initial.md
│   └── completed/                        # PRPs completados
├── src/                         # Código fuente Apps Script
│   ├── Code.gs                  # Punto de entrada principal
│   ├── Config.gs                # Configuración y constantes
│   ├── AtlassianApi.gs          # Wrappers APIs Atlassian
│   ├── Utils.gs                 # Utilidades comunes
│   ├── Tests.gs                 # Suite completa de tests
│   └── appsscript.json          # Configuración del proyecto
├── examples/                    # Ejemplos de implementación
│   ├── jira-sheets-sync/
│   ├── confluence-docs-sync/
│   └── automated-reporting/
├── docs/                        # Documentación
│   ├── setup-guide.md
│   ├── troubleshooting.md
│   └── api-reference.md
├── CLAUDE.md                    # Reglas para AI coding assistant
├── README.md                    # Este archivo
└── CHANGELOG.md                 # Historial de cambios
```

## 🚀 Instalación y Setup

### 1. Prerequisitos

- **Google Apps Script** project
- **Atlassian Cloud** account (Jira/Confluence)
- **API Token** de Atlassian
- **Claude Code** (opcional, recomendado)

### 2. Clonar Template

```bash
git clone https://github.com/tu-usuario/apps-script-atlassian-integration.git
cd apps-script-atlassian-integration
```

### 3. Configurar Apps Script

1. **Crear nuevo proyecto** en [Apps Script](https://script.google.com)
2. **Copiar archivos** de `src/` al editor
3. **Configurar appsscript.json** con los permisos necesarios
4. **Configurar propiedades** usando PropertiesService:

```javascript
// Ejecutar una sola vez para configurar
function configurarCredenciales() {
  PropertiesService.getScriptProperties().setProperties({
    'ATLASSIAN_DOMAIN': 'tu-dominio.atlassian.net',
    'ATLASSIAN_EMAIL': 'tu-email@dominio.com',
    'ATLASSIAN_API_TOKEN': 'ATATT3xFfGF0T8yX...',  // Tu API token
    'ENVIRONMENT': 'development',
    'ALERT_EMAIL': 'alertas@tu-dominio.com',
    'LOG_LEVEL': 'INFO'
  });
}
```

### 4. Validar Setup

```javascript
// Ejecutar para validar configuración
function validarSetup() {
  setupInicial();          // Configuración inicial
  runAllTests();           // Ejecutar todos los tests
  healthCheck();           // Verificar salud del sistema
  generarReporteCompleto(); // Generar reporte
}
```

## ⚡ Uso Rápido

### Con Claude Code (Recomendado)

1. **Copiar comandos** de `.claude/commands/` a tu proyecto
2. **Crear PRP** para tu funcionalidad específica:
   ```
   /create-apps-script-prp sincronizar issues de Jira con Google Sheets
   ```
3. **Ejecutar PRP** generado:
   ```
   /execute-apps-script-prp PRPs/mi-funcionalidad.md
   ```

### Sin Claude Code

1. **Editar `initial.md`** con tu funcionalidad específica
2. **Usar el template PRP** como base
3. **Implementar manualmente** siguiendo las guías

### Ejemplo Básico de Uso

```javascript
function ejemploBasico() {
  // Inicializar APIs
  const jiraApi = new JiraApi();
  const confluenceApi = new ConfluenceApi();
  
  // Crear issue en Jira
  const nuevoIssue = jiraApi.createIssue({
    summary: 'Nuevo issue desde Apps Script',
    description: 'Creado automáticamente',
    project: 'PROJ',
    issuetype: 'Task'
  });
  
  console.log(`Issue creado: ${nuevoIssue.key}`);
  
  // Crear página en Confluence
  const nuevaPagina = confluenceApi.createPage({
    title: 'Reporte Automatizado',
    spaceKey: 'SPACE',
    content: `<h1>Issue Creado</h1><p>Se creó el issue: ${nuevoIssue.key}</p>`
  });
  
  console.log(`Página creada: ${nuevaPagina.id}`);
}
```

## 🎯 Comandos Claude Disponibles

### Creación y Ejecución de PRPs
- `/create-apps-script-prp` - Genera PRP especializado
- `/execute-apps-script-prp` - Ejecuta PRP contra codebase
- `/test-apps-script-integration` - Suite de tests completa

### Development y Debugging
- `/debug-apps-script` - Workflow de debugging
- `/optimize-apps-script` - Optimización de rendimiento
- `/deploy-apps-script` - Guía de deployment

### Ejemplo de Uso de Comandos

```bash
# Crear PRP para sincronización Jira-Sheets
/create-apps-script-prp "Sincronizar automáticamente issues de Jira específicos con Google Sheets, actualizando estado y comentarios en tiempo real"

# Ejecutar el PRP generado
/execute-apps-script-prp PRPs/jira-sheets-sync.md

# Ejecutar tests de la implementación
/test-apps-script-integration jira-sheets-sync

# Optimizar rendimiento
/optimize-apps-script execution_time
```

## 💡 Ejemplos de Implementación

### 1. Sincronización Jira ↔ Google Sheets

```javascript
function sincronizarJiraSheets() {
  const jiraApi = new JiraApi();
  const sheet = SpreadsheetApp.getActiveSheet();
  
  // Obtener issues de Jira
  const issues = jiraApi.searchIssues('project = "PROJ" AND status != "Done"');
  
  // Actualizar Sheet
  const data = issues.issues.map(issue => [
    issue.key,
    issue.fields.summary,
    issue.fields.status.name,
    issue.fields.assignee ? issue.fields.assignee.displayName : 'Sin asignar'
  ]);
  
  sheet.getRange(2, 1, data.length, 4).setValues(data);
  
  logEstructurado('SUCCESS', `Sincronizados ${data.length} issues`);
}
```

### 2. Automatización de Reportes

```javascript
function generarReporteAutomatico() {
  const jiraApi = new JiraApi();
  const confluenceApi = new ConfluenceApi();
  
  // Obtener métricas de Jira
  const issuesResueltos = jiraApi.searchIssues('resolved >= -7d');
  const issuesCreados = jiraApi.searchIssues('created >= -7d');
  
  // Crear contenido del reporte
  const contenido = `
    <h1>Reporte Semanal</h1>
    <h2>Resumen</h2>
    <ul>
      <li>Issues resueltos: ${issuesResueltos.total}</li>
      <li>Issues creados: ${issuesCreados.total}</li>
    </ul>
    <p>Generado automáticamente el ${new Date().toLocaleDateString()}</p>
  `;
  
  // Publicar en Confluence
  confluenceApi.createPage({
    title: `Reporte Semanal - ${new Date().toLocaleDateString()}`,
    spaceKey: 'REPORTS',
    content: contenido
  });
}
```

### 3. Notificaciones Inteligentes

```javascript
function notificacionesInteligentes() {
  const jiraApi = new JiraApi();
  
  // Buscar issues críticos sin asignar
  const issuesCriticos = jiraApi.searchIssues(
    'priority = "Critical" AND assignee is EMPTY AND created >= -1d'
  );
  
  if (issuesCriticos.total > 0) {
    const mensaje = `⚠️ ${issuesCriticos.total} issues críticos sin asignar detectados`;
    
    // Enviar notificación
    enviarAlertaCritica('Issues Críticos Sin Asignar', mensaje);
    
    // Opcional: Crear issue de seguimiento
    jiraApi.createIssue({
      summary: 'Revisar issues críticos sin asignar',
      description: `Se detectaron ${issuesCriticos.total} issues críticos sin asignar`,
      project: 'MGMT',
      issuetype: 'Task',
      priority: 'High'
    });
  }
}
```

## 🧪 Testing y Validación

### Suite de Tests Incluida

```javascript
// Ejecutar todos los tests
runAllTests();

// Tests específicos
testConfiguracion();        // Validar configuración
testConectividadAtlassian(); // Test de conectividad
testJiraBasicOperations();   // Operaciones básicas Jira
testConfluenceBasicOperations(); // Operaciones básicas Confluence
testRendimiento();           // Tests de rendimiento
```

### Health Checks

```javascript
// Health check completo
const health = healthCheck();
console.log('System Status:', health.status);

// Verificar alertas
const alertas = verificarAlertas();
console.log('Alertas activas:', alertas.length);

// Generar reporte completo
const reporte = generarReporteCompleto();
```

### Monitoreo Continuo

```javascript
// Configurar trigger para monitoreo diario
function configurarMonitoreo() {
  ScriptApp.newTrigger('mantenimientoDiario')
    .timeBased()
    .everyDays(1)
    .atHour(9) // 9 AM
    .create();
}

// Función de mantenimiento automático
function mantenimientoDiario() {
  healthCheck();
  verificarAlertas();
  limpiarMetricasAntiguas();
  backupConfiguracion();
}
```

## 📈 Mejores Prácticas

### 1. Configuración Segura

```javascript
// ✅ SIEMPRE usar PropertiesService
const apiToken = PropertiesService.getScriptProperties().getProperty('ATLASSIAN_API_TOKEN');

// ❌ NUNCA hardcodear credenciales
const apiToken = 'ATATT3xFfGF0T8yX...'; // ¡NO HACER!
```

### 2. Manejo de Errores

```javascript
// ✅ Patrón recomendado
function operacionSegura() {
  try {
    const resultado = operacionRiesgosa();
    logEstructurado('SUCCESS', 'Operación exitosa', { resultado });
    return resultado;
  } catch (error) {
    logEstructurado('ERROR', 'Error en operación', { error: error.message });
    metrics.recordError('operacion_error');
    throw error; // Re-throw para manejo upstream
  }
}
```

### 3. Rate Limiting

```javascript
// ✅ Rate limiting automático incluido
function llamadaApi() {
  aplicarRateLimit('/rest/api/3/issue');
  return realizarRequestConRateLimit(url, options);
}
```

### 4. Procesamiento por Lotes

```javascript
// ✅ Para grandes volúmenes de datos
function procesarGranVolumen(items) {
  procesarEnLotes(items, (lote) => {
    lote.forEach(item => procesarItem(item));
  }, 10); // Lotes de 10 items
}
```

## 🔧 Troubleshooting

### Problemas Comunes

#### 1. Error de Autenticación
```
Error: Unauthorized (401)
```
**Solución:**
- Verificar API token en PropertiesService
- Confirmar email correcto
- Validar permisos en Atlassian

#### 2. Rate Limit Exceeded
```
Error: Too Many Requests (429)
```
**Solución:**
- El sistema maneja automáticamente con exponential backoff
- Reducir frecuencia de llamadas si persiste
- Verificar configuración de `rateLimitDelay`

#### 3. Timeout de Ejecución
```
Error: Script execution timeout
```
**Solución:**
- Usar procesamiento por lotes
- Implementar continuación con triggers
- Optimizar consultas y operaciones

### Debugging

```javascript
// Activar modo debug
activarModoDebug();

// Revisar logs detallados
console.log(Logger.getLog());

// Verificar configuración
const config = exportarConfiguracion();
console.log('Config:', config);
```

### Contacto y Soporte

- **Issues**: Crear issue en GitHub
- **Documentación**: Ver carpeta `docs/`
- **Ejemplos**: Revisar carpeta `examples/`

## 🤝 Contribución

### Cómo Contribuir

1. **Fork** el repositorio
2. **Crear branch** para tu feature: `git checkout -b feature/amazing-feature`
3. **Commit** cambios: `git commit -m 'Add amazing feature'`
4. **Push** al branch: `git push origin feature/amazing-feature`
5. **Crear Pull Request**

### Guidelines

- Seguir patrones establecidos en `CLAUDE.md`
- Incluir tests para nuevas funcionalidades
- Actualizar documentación según corresponda
- Usar logging estructurado
- Validar con `runAllTests()` antes de PR

### Roadmap

- [ ] **Templates adicionales** (Slack, Microsoft, etc.)
- [ ] **UI Components** para Google Workspace
- [ ] **Advanced Analytics** y reporting
- [ ] **Multi-tenant** support
- [ ] **GraphQL** integration
- [ ] **Workflow automation** templates

## 📄 Licencia

MIT License - ver [LICENSE](LICENSE) para detalles.

## 🙏 Reconocimientos

- **Rasmus Widing** por el PRP Framework
- **Anthropic** por Claude y las herramientas de AI coding
- **Atlassian** por las excelentes APIs
- **Google** por Apps Script platform

---

**¿Te resulta útil esta plantilla?** ⭐ Dale una estrella y compártela con tu equipo!

**¿Encontraste un problema?** 🐛 Crea un issue y lo resolveremos juntos.

**¿Quieres contribuir?** 🚀 Las PRs son bienvenidas!

---

> *"El objetivo es el éxito de la implementación en un solo paso a través de un contexto completo. ¡Feliz coding con context engineering!"*