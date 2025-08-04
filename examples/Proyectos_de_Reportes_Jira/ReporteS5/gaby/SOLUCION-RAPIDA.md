# 🚨 SOLUCIÓN RÁPIDA - Error de Credenciales

## ❌ **ERROR ESPECÍFICO:**
```
Error generando reporte: Error en operación Jira: obtener colaboradores: 
Errores de configuración:
- Email de Jira no configurado correctamente
- API Token de Jira no configurado correctamente
```

## ⚡ **SOLUCIÓN INMEDIATA (2 MINUTOS):**

### **OPCIÓN 1: Asistente Automático (RECOMENDADO)**
1. **En Google Sheets**, ve al menú: `📊 Indicadores`
2. **Haz clic en:** `⚙️ Configuración > 🚀 Asistente de Configuración`
3. **Sigue las instrucciones** paso a paso
4. **Solo necesitas:**
   - Tu email: `computocontable@gmail.com`
   - API Token (te ayuda a obtenerlo)

### **OPCIÓN 2: Configuración Manual Rápida**
1. **Obtén tu API Token:**
   - Ve a: https://id.atlassian.com/manage-profile/security/api-tokens
   - Crea token: "Google Sheets Reportes"
   - **Copia TODO el token** (es muy largo)

2. **Configura en el sistema:**
   - Menú: `📊 Indicadores > ⚙️ Configuración > 📧 Configurar Credenciales`
   - Email: `computocontable@gmail.com`
   - Token: Pega el token completo

### **OPCIÓN 3: Edición Directa (Para Desarrolladores)**
1. **En Google Apps Script**, edita `config.gs`
2. **Cambia estas líneas:**
```javascript
// ANTES:
email: "", 
apiToken: "",

// DESPUÉS:
email: "computocontable@gmail.com", 
apiToken: "TU_TOKEN_COMPLETO_AQUI",
```
3. **Guarda** (Ctrl+S)

## 🔍 **VERIFICAR QUE FUNCIONA:**

**Menú:** `📊 Indicadores > 🧪 Testing > 🔗 Test Conexión`

**Debe mostrar:** `✅ Conexión exitosa! Colaboradores encontrados: [número]`

## 🛠️ **HERRAMIENTAS DE DIAGNÓSTICO:**

Si sigues teniendo problemas:

- **⚡ Prueba Rápida** - Test básico de credenciales
- **📋 Estado Credenciales** - Ve qué está configurado
- **🔄 Forzar Carga** - Recarga las credenciales
- **🔍 Diagnóstico Completo** - Análisis detallado

## 🎯 **CAUSA COMÚN DEL ERROR:**

El sistema tiene dos lugares donde guardar credenciales:
1. **Archivo config.gs** (código)
2. **Almacén de credenciales** (datos del documento)

Si están vacías en ambos lugares, obtienes este error.

## ✅ **VERIFICACIÓN FINAL:**

Después de configurar, deberías poder:
1. ✅ Ver colaboradores en el diálogo
2. ✅ Seleccionar períodos (día, semana, sprint)
3. ✅ Generar reportes sin errores
4. ✅ Ver datos reales de tu instancia Jira

---

**⏱️ Tiempo estimado de solución: 2-5 minutos**
**🎯 El Asistente de Configuración es la forma más fácil y segura**