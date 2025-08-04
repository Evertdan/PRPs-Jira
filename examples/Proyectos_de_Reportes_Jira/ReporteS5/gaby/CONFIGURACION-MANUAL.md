# 🔧 CONFIGURACIÓN MANUAL - CCSOFT JIRA

## 🎯 **OPCIÓN RECOMENDADA: Asistente Automático**
**En lugar de seguir estos pasos manuales, usa:**
`📊 Indicadores > ⚙️ Configuración > 🚀 Asistente de Configuración`

---

## 📋 **SI PREFIERES CONFIGURACIÓN MANUAL:**

### **PASO 1: Obtener API Token**

1. **Abre:** https://id.atlassian.com/manage-profile/security/api-tokens
2. **Inicia sesión** con: `computocontable@gmail.com`
3. **Crea nuevo token:** "Google Sheets Reportes Jira"
4. **Copia el token completo** (empieza con ATATT3xF...)

### **PASO 2: Editar config.gs**

1. **Abre Google Apps Script** 
2. **Busca el archivo:** `config.gs`
3. **Localiza estas líneas:**

```javascript
const CONFIG_JIRA = {
  // Dominio fijo de la empresa
  dominio: "ccsoft.atlassian.net",
  
  // Credenciales por defecto (se pueden sobrescribir via interfaz)
  email: "", 
  apiToken: "",
  
  // Proyecto de referencia confirmado que existe en tu instancia
  projectKey: "FENIX",
```

4. **REEMPLAZA con tus datos:**

```javascript
const CONFIG_JIRA = {
  // Dominio fijo de la empresa
  dominio: "ccsoft.atlassian.net",
  
  // TUS CREDENCIALES REALES:
  email: "computocontable@gmail.com", 
  apiToken: "TU_TOKEN_COMPLETO_AQUI",
  
  // Proyecto confirmado que existe
  projectKey: "FENIX",
```

5. **Guarda** (Ctrl+S)

### **PASO 3: Verificar**

1. **Ve a Google Sheets**
2. **Menú:** `📊 Indicadores > 🧪 Testing > 🔗 Test Conexión`
3. **Debe mostrar:** `✅ Conexión exitosa! Colaboradores encontrados: [número]`

---

## 🚨 **SOLUCIÓN DE PROBLEMAS**

### **Error: "No se encontraron colaboradores"**
- **Causa:** Proyecto FENIX no accesible
- **Solución:** Cambia `projectKey` por: `"BDMS"`, `"DC"`, `"DT"`, o `"MAAC"`

### **Error: "API Token inválido"**
- **Causa:** Token incorrecto o incompleto
- **Solución:** 
  - Regenera el token en Atlassian
  - Verifica que copiaste TODO el token
  - Asegúrate que no tenga espacios

### **Error: "customfield_10104 no encontrado"**
- **Solución:** Ya está corregido (campo deshabilitado automáticamente)

---

## ✅ **CONFIGURACIÓN FINAL CORRECTA**

**Tu `config.gs` debe verse así:**

```javascript
const CONFIG_JIRA = {
  dominio: "ccsoft.atlassian.net",
  email: "computocontable@gmail.com", 
  apiToken: "ATATT3xFfGF0[resto-de-tu-token-muy-largo]",
  projectKey: "FENIX",
  maxResults: 4000,
  customFields: {
    compromiso: "customfield_10191",
    fechaHora: "" // Deshabilitado - no existe en tu instancia
  }
};
```

---

## 🎯 **¿NECESITAS AYUDA?**

**Usa estas herramientas del sistema:**
- `🔍 Diagnóstico Completo` - Identifica problemas específicos
- `👀 Ver Configuración` - Muestra estado actual
- `🚀 Asistente de Configuración` - Configuración guiada

**¡El asistente automático es MÁS FÁCIL y MÁS SEGURO!**