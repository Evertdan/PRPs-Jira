# PRP Base - Google Apps Script con APIs Atlassian

## Objetivo
[ESPECIFICAR_FUNCIONALIDAD] - Desarrollar [DESCRIPCION_BREVE] usando Google Apps Script integrado con APIs de Atlassian (Jira/Confluence).

## Por qué
- **Valor de Negocio**: [ESPECIFICAR_VALOR]
- **Impacto del Usuario**: [ESPECIFICAR_IMPACTO]  
- **Automatización**: Reducir trabajo manual entre Google Workspace y Atlassian
- **Integración**: Sincronizar datos entre plataformas de manera eficiente

## Qué
Sistema de integración entre Google Apps Script y Atlassian que permite [FUNCIONALIDAD_ESPECIFICA].

### Criterios de Éxito
- [ ] Autenticación exitosa con API de Atlassian
- [ ] [CRITERIO_FUNCIONAL_1]
- [ ] [CRITERIO_FUNCIONAL_2]
- [ ] Manejo de errores y reintentos implementado
- [ ] Logging completo para debugging
- [ ] Tests de integración funcionando

## Todo el Contexto Necesario

### Arquitectura de Google Apps Script
```javascript
// Estructura típica de proyecto Apps Script
function main() {
  // Punto de entrada principal
}

function onOpen() {
  // Configuración de menú personalizado
}

// Configuración en appsscript.json
{
  "timeZone": "America/Mexico_City",
  "dependencies": {
    "enabledAdvancedServices": []
  },
  "exceptionLogging": "STACKDRIVER",
  "runtimeVersion": "V8"
}
```

### Patrones de Integración Atlassian
```javascript
// Patrón de autenticación con API Token
const ATLASSIAN_CONFIG = {
  domain: 'tu-dominio.atlassian.net',
  email: 'tu-email@dominio.com',
  apiToken: PropertiesService.getScriptProperties().getProperty('ATLASSIAN_API_TOKEN'),
  cloudId: PropertiesService.getScriptProperties().getProperty('ATLASSIAN_CLOUD_ID')
};

// Headers estándar para Atlassian API
function getAtlassianHeaders() {
  const auth = Utilities.base64Encode(`${ATLASSIAN_CONFIG.email}:${ATLASSIAN_CONFIG.apiToken}`);
  return {
    'Authorization': `Basic ${auth}`,
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  };
}
```

### Documentación y Referencias Críticas

#### Google Apps Script
- url: https://developers.google.com/apps-script/reference
  why: Referencia completa de APIs de Apps Script
- url: https://developers.google.com/apps-script/guides/services/external
  why: Integración con APIs externas
- url: https://developers.google.com/apps-script/guides/triggers
  why: Automatización con triggers

#### Atlassian APIs
- url: https://developer.atlassian.com/cloud/jira/platform/rest/v3/
  why: Documentación completa de Jira REST API v3
- url: https://developer.atlassian.com/cloud/confluence/rest/v2/
  why: Documentación de Confluence REST API v2
- url: https://developer.atlassian.com/cloud/jira/platform/basic-auth-for-rest-apis/
  why: Autenticación básica para APIs REST

#### Herramientas del MCP Atlassian Disponibles
```javascript
// Herramientas disponibles en el contexto MCP
const AVAILABLE_ATLASSIAN_TOOLS = [
  'atlassianUserInfo',
  'getAccessibleAtlassianResources', 
  'getConfluenceSpaces',
  'getConfluencePage',
  'getPagesInConfluenceSpace',
  'createConfluencePage',
  'updateConfluencePage',
  'searchConfluenceUsingCql',
  'getJiraIssue',
  'createJiraIssue',
  'editJiraIssue',
  'searchJiraIssuesUsingJql',
  'addCommentToJiraIssue',
  'transitionJiraIssue',
  'getVisibleJiraProjects'
];
```

### Problemas Conocidos (Gotchas)

```javascript
// CRÍTICO: Apps Script tiene límites de tiempo de ejecución
// Solución: Usar LockService para operaciones largas
const lock = LockService.getScriptLock();
try {
  lock.waitLock(30000); // 30 segundos timeout
  // Tu código aquí
} catch (e) {
  Logger.log('No se pudo obtener el lock: ' + e.toString());
} finally {
  lock.releaseLock();
}

// CRÍTICO: Rate limiting en APIs de Atlassian
// Solución: Implementar exponential backoff
function makeAtlassianRequest(url, options, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      const response = UrlFetchApp.fetch(url, options);
      if (response.getResponseCode() === 429) {
        const delay = Math.pow(2, i) * 1000; // Exponential backoff
        Utilities.sleep(delay);
        continue;
      }
      return response;
    } catch (error) {
      if (i === retries - 1) throw error;
      Utilities.sleep(1000 * (i + 1));
    }
  }
}

// CRÍTICO: Manejo de propiedades seguras
// Usar PropertiesService para credenciales, NUNCA hardcodear
const API_TOKEN = PropertiesService.getScriptProperties().getProperty('ATLASSIAN_API_TOKEN');
if (!API_TOKEN) {
  throw new Error('API Token no configurado. Usar PropertiesService.');
}
```

### Estructura de Código Esperada

```
Proyecto Apps Script/
├── Code.gs              # Archivo principal
├── Config.gs            # Configuración y constantes  
├── AtlassianApi.gs      # Wrapper para APIs Atlassian
├── Utils.gs             # Utilidades comunes
├── Tests.gs             # Tests unitarios
└── appsscript.json      # Configuración del proyecto
```

### Ejemplos de Integración

#### Ejemplo: Crear Issue en Jira desde Google Sheets
```javascript
function createJiraIssueFromSheet() {
  const sheet = SpreadsheetApp.getActiveSheet();
  const range = sheet.getActiveRange();
  const values = range.getValues();
  
  values.forEach(row => {
    const [summary, description, issueType] = row;
    
    const issueData = {
      fields: {
        project: { key: 'PROJ' },
        summary: summary,
        description: {
          type: "doc",
          version: 1,
          content: [{
            type: "paragraph",
            content: [{ type: "text", text: description }]
          }]
        },
        issuetype: { name: issueType }
      }
    };
    
    const response = makeAtlassianRequest(
      `https://${ATLASSIAN_CONFIG.domain}/rest/api/3/issue`,
      {
        method: 'POST',
        headers: getAtlassianHeaders(),
        payload: JSON.stringify(issueData)
      }
    );
    
    if (response.getResponseCode() === 201) {
      const issue = JSON.parse(response.getContentText());
      Logger.log(`Issue creado: ${issue.key}`);
    }
  });
}
```

#### Ejemplo: Sincronizar Confluence con Google Docs
```javascript
function syncConfluenceToGoogleDocs(pageId, docId) {
  // Obtener contenido de Confluence
  const confluenceResponse = makeAtlassianRequest(
    `https://${ATLASSIAN_CONFIG.domain}/wiki/rest/api/content/${pageId}?expand=body.view`,
    { headers: getAtlassianHeaders() }
  );
  
  const confluencePage = JSON.parse(confluenceResponse.getContentText());
  
  // Actualizar Google Doc
  const doc = DocumentApp.openById(docId);
  const body = doc.getBody();
  body.clear();
  
  // Convertir HTML a texto plano (simplificado)
  const plainText = confluencePage.body.view.value.replace(/<[^>]*>/g, '');
  body.appendParagraph(confluencePage.title).setHeading(DocumentApp.ParagraphHeading.HEADING1);
  body.appendParagraph(plainText);
  
  Logger.log(`Documento sincronizado: ${confluencePage.title}`);
}
```

## Plan de Implementación

### Fase 1: Configuración Base
```javascript
// 1. Configurar propiedades del script
function setupScriptProperties() {
  const properties = PropertiesService.getScriptProperties();
  properties.setProperties({
    'ATLASSIAN_DOMAIN': 'tu-dominio.atlassian.net',
    'ATLASSIAN_EMAIL': 'tu-email@dominio.com',
    'ATLASSIAN_API_TOKEN': 'tu-api-token-aquí',
    'ATLASSIAN_CLOUD_ID': 'tu-cloud-id'
  });
}

// 2. Crear clase base para API de Atlassian
class AtlassianAPI {
  constructor() {
    this.domain = PropertiesService.getScriptProperties().getProperty('ATLASSIAN_DOMAIN');
    this.email = PropertiesService.getScriptProperties().getProperty('ATLASSIAN_EMAIL');
    this.apiToken = PropertiesService.getScriptProperties().getProperty('ATLASSIAN_API_TOKEN');
  }
  
  getHeaders() {
    const auth = Utilities.base64Encode(`${this.email}:${this.apiToken}`);
    return {
      'Authorization': `Basic ${auth}`,
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    };
  }
}
```

### Fase 2: Implementación de Funcionalidades
[ESPECIFICAR_IMPLEMENTACION_DETALLADA]

### Fase 3: Testing y Validación
```javascript
// Tests de integración
function testAtlassianConnection() {
  try {
    const api = new AtlassianAPI();
    const response = api.makeRequest('/rest/api/3/myself');
    Logger.log('Conexión exitosa:', response);
    return true;
  } catch (error) {
    Logger.log('Error de conexión:', error);
    return false;
  }
}
```

## Bucle de Validación

### Nivel 1: Sintaxis y Configuración
```javascript
// Verificar configuración
function validateConfiguration() {
  const requiredProps = ['ATLASSIAN_DOMAIN', 'ATLASSIAN_EMAIL', 'ATLASSIAN_API_TOKEN'];
  const properties = PropertiesService.getScriptProperties();
  
  requiredProps.forEach(prop => {
    if (!properties.getProperty(prop)) {
      throw new Error(`Propiedad requerida no configurada: ${prop}`);
    }
  });
  
  Logger.log('✅ Configuración válida');
}
```

### Nivel 2: Tests de Integración  
```javascript
// Test de conexión con Atlassian
function testAtlassianEndpoints() {
  const tests = [
    { name: 'User Info', endpoint: '/rest/api/3/myself' },
    { name: 'Projects', endpoint: '/rest/api/3/project' },
    { name: 'Confluence Spaces', endpoint: '/wiki/rest/api/space' }
  ];
  
  tests.forEach(test => {
    try {
      const response = makeAtlassianRequest(`https://${ATLASSIAN_CONFIG.domain}${test.endpoint}`, {
        headers: getAtlassianHeaders()
      });
      
      if (response.getResponseCode() === 200) {
        Logger.log(`✅ ${test.name}: OK`);
      } else {
        Logger.log(`❌ ${test.name}: ${response.getResponseCode()}`);
      }
    } catch (error) {
      Logger.log(`❌ ${test.name}: ${error.toString()}`);
    }
  });
}
```

### Nivel 3: Tests Funcionales
```javascript
// Test específico de la funcionalidad implementada
function testMainFunctionality() {
  // [IMPLEMENTAR_TESTS_ESPECIFICOS]
  Logger.log('✅ Tests funcionales completados');
}
```

## Stack Tecnológico

### Core
- **Google Apps Script**: Runtime V8, ES6+
- **Atlassian REST APIs**: v3 (Jira), v2 (Confluence)
- **Autenticación**: Basic Auth con API Tokens

### Servicios de Apps Script
- `UrlFetchApp`: Para llamadas HTTP
- `PropertiesService`: Para configuración segura  
- `SpreadsheetApp`: Para integración con Sheets
- `DocumentApp`: Para integración con Docs
- `LockService`: Para concurrencia
- `Utilities`: Para encoding/sleep

### Patrones de Diseño
- **Singleton**: Para configuración
- **Factory**: Para crear objetos API
- **Retry Pattern**: Para manejo de errores
- **Rate Limiting**: Para respetar límites de API

## Configuración de Seguridad

```javascript
// Configuración segura de propiedades
function secureSetup() {
  // NUNCA exponer credenciales en el código
  const properties = PropertiesService.getScriptProperties();
  
  // Validar que las propiedades estén configuradas
  const requiredProps = [
    'ATLASSIAN_DOMAIN',
    'ATLASSIAN_EMAIL', 
    'ATLASSIAN_API_TOKEN',
    'ATLASSIAN_CLOUD_ID'
  ];
  
  const missingProps = requiredProps.filter(prop => 
    !properties.getProperty(prop)
  );
  
  if (missingProps.length > 0) {
    throw new Error(`Propiedades faltantes: ${missingProps.join(', ')}`);
  }
}
```

---

**Puntuación de Confianza**: 8.5/10

**Razones para la puntuación**:
- ✅ Documentación completa de APIs
- ✅ Patrones establecidos de integración
- ✅ Ejemplos prácticos incluidos
- ✅ Manejo de errores y seguridad
- ⚠️ Dependiente de configuración correcta de tokens
- ⚠️ Limitaciones de tiempo de ejecución de Apps Script

**Para llegar a 10/10 necesitaríamos**:
- Ejemplos más específicos de la funcionalidad exacta
- Tests automatizados más robustos  
- Documentación de deployment/distribución
- Manejo avanzado de concurrencia y estado