# Plantilla initial.md - Google Apps Script + Atlassian

## Funcionalidad Principal
**[DESCRIBIR_FUNCIONALIDAD]** - Integración específica entre Google Apps Script y Atlassian que permita [ESPECIFICAR_OBJETIVO].

### Casos de Uso
- [CASO_DE_USO_1]
- [CASO_DE_USO_2]  
- [CASO_DE_USO_3]

### Usuarios Objetivo
- [TIPO_USUARIO_1]: [NECESIDAD_ESPECÍFICA]
- [TIPO_USUARIO_2]: [NECESIDAD_ESPECÍFICA]

## Herramientas y APIs Requeridas

### Google Apps Script Services
- [ ] **SpreadsheetApp**: Para integración con Google Sheets
- [ ] **DocumentApp**: Para integración con Google Docs
- [ ] **DriveApp**: Para manejo de archivos en Drive
- [ ] **GmailApp**: Para integración con Gmail
- [ ] **CalendarApp**: Para integración con Google Calendar
- [ ] **UrlFetchApp**: Para llamadas HTTP a APIs Atlassian
- [ ] **PropertiesService**: Para almacenamiento seguro de credenciales
- [ ] **LockService**: Para manejo de concurrencia
- [ ] **ScriptApp**: Para triggers y automatización

### APIs de Atlassian
- [ ] **Jira REST API v3**: [ESPECIFICAR_ENDPOINTS_NECESARIOS]
- [ ] **Confluence REST API v2**: [ESPECIFICAR_ENDPOINTS_NECESARIOS]
- [ ] **Atlassian Connect**: Si se requiere autenticación OAuth

### Herramientas MCP Atlassian Específicas
```javascript
// Herramientas disponibles para consulta y referencia
const HERRAMIENTAS_MCP_NECESARIAS = [
  'getJiraIssue',           // [SI/NO] - Para obtener información de issues
  'createJiraIssue',        // [SI/NO] - Para crear nuevos issues
  'searchJiraIssuesUsingJql', // [SI/NO] - Para búsquedas avanzadas
  'getConfluencePage',      // [SI/NO] - Para obtener páginas
  'createConfluencePage',   // [SI/NO] - Para crear contenido
  'updateConfluencePage',   // [SI/NO] - Para actualizar páginas
  'searchConfluenceUsingCql', // [SI/NO] - Para búsquedas en Confluence
  // ... más herramientas según necesidad
];
```

## Configuración y Dependencias

### Propiedades del Script (PropertiesService)
```javascript
// Configuración requerida en PropertiesService
const PROPIEDADES_REQUERIDAS = {
  'ATLASSIAN_DOMAIN': 'tu-dominio.atlassian.net',
  'ATLASSIAN_EMAIL': 'tu-email@dominio.com',
  'ATLASSIAN_API_TOKEN': 'tu-api-token-aquí',
  'ATLASSIAN_CLOUD_ID': 'cloud-id-si-se-requiere',
  '[OTRAS_PROPIEDADES]': 'valores-específicos'
};
```

### Configuración appsscript.json
```json
{
  "timeZone": "America/Mexico_City",
  "dependencies": {
    "enabledAdvancedServices": [
      {
        "userSymbol": "Sheets",
        "version": "v4",
        "serviceId": "sheets"
      },
      {
        "userSymbol": "Drive",
        "version": "v3", 
        "serviceId": "drive"
      }
    ]
  },
  "exceptionLogging": "STACKDRIVER",
  "runtimeVersion": "V8",
  "oauthScopes": [
    "https://www.googleapis.com/auth/spreadsheets",
    "https://www.googleapis.com/auth/drive",
    "https://www.googleapis.com/auth/script.external_request"
  ]
}
```

## Prompt del Sistema para Agentes

### Para el Agente Principal (Google Apps Script)
```
Eres un desarrollador experto en Google Apps Script con amplia experiencia en:
- Integración con APIs REST externas
- Manejo seguro de credenciales con PropertiesService
- Implementación de rate limiting y retry logic
- Optimización para límites de tiempo de ejecución de Apps Script
- Testing y debugging de integraciones

Tu enfoque debe ser:
1. Código limpio y mantenible
2. Manejo robusto de errores
3. Seguridad en el manejo de credenciales
4. Rendimiento optimizado para límites de Apps Script
5. Logging comprehensivo para debugging
```

### Para el Agente de Atlassian (MCP)
```
Eres un especialista en APIs de Atlassian con conocimiento profundo de:
- Jira REST API v3 y sus endpoints
- Confluence REST API v2 y funcionalidades
- Autenticación y autorización en Atlassian Cloud
- Mejores prácticas de integración
- Limitaciones y consideraciones de rate limiting

Debes proporcionar:
1. Información precisa sobre endpoints y parámetros
2. Ejemplos de payloads y respuestas
3. Orientación sobre autenticación
4. Advertencias sobre límites y restricciones
```

## Ejemplos y Referencias

### Proyectos Similares
- **[PROYECTO_REFERENCIA_1]**: [DESCRIPCIÓN_Y_RELEVANCIA]
- **[PROYECTO_REFERENCIA_2]**: [DESCRIPCIÓN_Y_RELEVANCIA]

### Patrones de Código Esperados
```javascript
// Patrón de autenticación estándar
class AtlassianAPI {
  constructor() {
    this.domain = PropertiesService.getScriptProperties().getProperty('ATLASSIAN_DOMAIN');
    this.email = PropertiesService.getScriptProperties().getProperty('ATLASSIAN_EMAIL');
    this.apiToken = PropertiesService.getScriptProperties().getProperty('ATLASSIAN_API_TOKEN');
    
    if (!this.domain || !this.email || !this.apiToken) {
      throw new Error('Configuración de Atlassian incompleta');
    }
  }
  
  getAuthHeaders() {
    const auth = Utilities.base64Encode(`${this.email}:${this.apiToken}`);
    return {
      'Authorization': `Basic ${auth}`,
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    };
  }
}

// Patrón de manejo de errores con retry
function makeAtlassianRequest(url, options = {}, maxRetries = 3) {
  const baseDelay = 1000; // 1 segundo
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const response = UrlFetchApp.fetch(url, {
        ...options,
        muteHttpExceptions: true
      });
      
      const responseCode = response.getResponseCode();
      
      // Rate limiting - esperar y reintentar
      if (responseCode === 429) {
        const delay = baseDelay * Math.pow(2, attempt - 1);
        Logger.log(`Rate limit alcanzado, esperando ${delay}ms...`);
        Utilities.sleep(delay);
        continue;
      }
      
      // Errores de servidor - reintentar
      if (responseCode >= 500 && attempt < maxRetries) {
        const delay = baseDelay * attempt;
        Logger.log(`Error de servidor (${responseCode}), reintentando en ${delay}ms...`);
        Utilities.sleep(delay);
        continue;
      }
      
      // Errores de cliente - no reintentar
      if (responseCode >= 400 && responseCode < 500) {
        throw new Error(`Error de cliente: ${responseCode} - ${response.getContentText()}`);
      }
      
      return response;
      
    } catch (error) {
      Logger.log(`Intento ${attempt} falló: ${error.toString()}`);
      
      if (attempt === maxRetries) {
        throw error;
      }
      
      const delay = baseDelay * attempt;
      Utilities.sleep(delay);
    }
  }
}
```

## Documentación Requerida

### Google Apps Script
- url: https://developers.google.com/apps-script/reference
  why: Referencia completa de APIs y servicios disponibles
- url: https://developers.google.com/apps-script/guides/services/external
  why: Mejores prácticas para integración con APIs externas
- url: https://developers.google.com/apps-script/guides/triggers
  why: Automatización y programación de tareas
- url: https://developers.google.com/apps-script/guides/properties
  why: Almacenamiento seguro de configuración y credenciales

### Atlassian APIs
- url: https://developer.atlassian.com/cloud/jira/platform/rest/v3/
  why: Documentación completa de Jira REST API v3
- url: https://developer.atlassian.com/cloud/confluence/rest/v2/
  why: Documentación completa de Confluence REST API v2
- url: https://developer.atlassian.com/cloud/jira/platform/basic-auth-for-rest-apis/
  why: Guía de autenticación para APIs REST
- url: https://developer.atlassian.com/cloud/jira/platform/rate-limiting/
  why: Información sobre límites de velocidad y mejores prácticas

### Herramientas MCP Atlassian
- Las herramientas MCP disponibles en el contexto actual
- Ejemplos de uso de cada herramienta relevante
- Documentación de parámetros y respuestas esperadas

## Consideraciones Especiales

### Limitaciones de Google Apps Script
```javascript
// CRÍTICO: Límite de tiempo de ejecución de 6 minutos
// Solución: Implementar procesamiento por lotes con triggers
function procesarEnLotes(items, tamañoLote = 10) {
  const lotes = [];
  for (let i = 0; i < items.length; i += tamañoLote) {
    lotes.push(items.slice(i, i + tamañoLote));
  }
  
  lotes.forEach((lote, indice) => {
    if (indice === 0) {
      // Procesar primer lote inmediatamente
      procesarLote(lote);
    } else {
      // Programar procesamiento de lotes siguientes
      ScriptApp.newTrigger('procesarLoteSiguiente')
        .timeBased()
        .after(indice * 1000) // Delay progresivo
        .create();
    }
  });
}

// CRÍTICO: Límites de quotas diarias
// Monitorear uso de UrlFetchApp y otros servicios
const LIMITES_DIARIOS = {
  urlFetch: 20000, // requests por día
  email: 100,      // emails por día
  triggers: 20     // triggers por script
};
```

### Seguridad y Mejores Prácticas
```javascript
// CRÍTICO: Nunca hardcodear credenciales
// ❌ MAL
const API_TOKEN = 'ATATT3xFfGF0...'; // NUNCA hacer esto

// ✅ BIEN
const API_TOKEN = PropertiesService.getScriptProperties().getProperty('ATLASSIAN_API_TOKEN');
if (!API_TOKEN) {
  throw new Error('Token de API no configurado. Usar PropertiesService.');
}

// CRÍTICO: Validar y sanitizar datos de entrada
function validarDatosEntrada(datos) {
  if (!datos || typeof datos !== 'object') {
    throw new Error('Datos inválidos proporcionados');
  }
  
  // Sanitizar strings para prevenir inyección
  Object.keys(datos).forEach(key => {
    if (typeof datos[key] === 'string') {
      datos[key] = datos[key].replace(/[<>]/g, ''); // Básico sanitizado
    }
  });
  
  return datos;
}
```

### Manejo de Concurrencia
```javascript
// CRÍTICO: Usar LockService para operaciones críticas
function operacionCritica() {
  const lock = LockService.getScriptLock();
  
  try {
    lock.waitLock(30000); // 30 segundos timeout
    
    // Lógica crítica aquí
    Logger.log('Ejecutando operación crítica...');
    
  } catch (e) {
    Logger.log('No se pudo obtener el lock: ' + e.toString());
    throw new Error('Operación en curso, intente más tarde');
  } finally {
    lock.releaseLock();
  }
}
```

## Flujo de Trabajo de Desarrollo

### 1. Configuración Inicial
- [ ] Crear nuevo proyecto de Apps Script
- [ ] Configurar appsscript.json con permisos necesarios
- [ ] Establecer propiedades con PropertiesService
- [ ] Crear estructura básica de archivos

### 2. Desarrollo
- [ ] Implementar clase base para API de Atlassian
- [ ] Crear funciones principales de integración
- [ ] Implementar manejo de errores y logging
- [ ] Desarrollar tests de validación

### 3. Testing
- [ ] Tests unitarios para cada función
- [ ] Tests de integración con APIs reales
- [ ] Tests de manejo de errores y edge cases
- [ ] Validación de límites y performance

### 4. Deployment
- [ ] Configurar triggers si es necesario
- [ ] Documentar proceso de configuración
- [ ] Crear guía de troubleshooting
- [ ] Establecer monitoreo y alertas

## Criterios de Aceptación

### Funcionales
- [ ] [CRITERIO_FUNCIONAL_1]
- [ ] [CRITERIO_FUNCIONAL_2]
- [ ] [CRITERIO_FUNCIONAL_3]
- [ ] Manejo robusto de errores implementado
- [ ] Rate limiting respetado correctamente
- [ ] Logging comprehensivo funcionando

### No Funcionales
- [ ] Tiempo de respuesta < [ESPECIFICAR_TIEMPO]
- [ ] Disponibilidad > 99% en condiciones normales
- [ ] Seguridad: Credenciales nunca expuestas
- [ ] Mantenibilidad: Código bien documentado
- [ ] Escalabilidad: Manejo de volúmenes esperados

### Técnicos
- [ ] Código pasa linting sin errores
- [ ] Todos los tests unitarios pasan
- [ ] Tests de integración exitosos
- [ ] Documentación completa y actualizada
- [ ] Configuración de deployment documentada

---

**Notas Adicionales:**
- Reemplazar todos los valores entre [CORCHETES] con información específica
- Ajustar herramientas MCP según necesidades reales
- Personalizar configuraciones según el entorno objetivo
- Incluir consideraciones específicas del dominio de negocio