# Sistema de Reportes Jira - Versión Modularizada 2.0

## Descripción
Sistema modularizado para generar reportes de compromisos de sprint desde Jira hacia Google Sheets, con configuración de credenciales integrada, manejo mejorado de errores y una arquitectura más mantenible.

## 🚀 Inicio Rápido

### ¡Configuración en 2 minutos!

1. **Abre Google Sheets** con el sistema instalado
2. **La primera vez** aparecerá un mensaje de bienvenida
3. **Haz clic "Sí"** para configurar tus credenciales
4. **Ingresa tu email de Jira** (el mismo que usas para acceder)
5. **Obtén tu API Token**:
   - Ve a: https://id.atlassian.com/manage-profile/security/api-tokens
   - Crea un nuevo token
   - Cópialo y pégalo
6. **¡Listo!** El sistema detectará automáticamente los proyectos disponibles

## Estructura de Archivos

### Archivos Principales
- **`main.gs`** - Punto de entrada principal, menús y configuración inicial
- **`credentials-manager.gs`** - **NUEVO** - Manejo seguro de credenciales
- **`config.gs`** - Configuración del sistema (dominio fijo: ccsoft.atlassian.net)
- **`error-handler.gs`** - Manejo centralizado de errores y logging
- **`jira-api.gs`** - Funciones para interactuar con la API de Jira
- **`ui-manager.gs`** - Manejo de interfaz de usuario y diálogos
- **`report-generator.gs`** - Lógica de generación y formateo de reportes

### Archivos de Referencia
- **`config-example.gs`** - Ejemplo de configuración manual
- **`code.gs`** - Archivo original (mantener para referencia)

El sistema ahora maneja la configuración automáticamente através de la interfaz gráfica:

### 🔧 Opciones de Configuración

**Menú "⚙️ Configuración":**
- **📧 Configurar Credenciales** - Configurar email y API token
- **📋 Seleccionar Proyecto** - Elegir proyecto de una lista  
- **👀 Ver Configuración** - Ver estado actual
- **🗑️ Limpiar Credenciales** - Eliminar credenciales almacenadas

### 🔑 Obtener API Token
1. Ve a: https://id.atlassian.com/manage-profile/security/api-tokens
2. Haz clic en "Create API token"
3. Dale un nombre descriptivo (ej: "Google Sheets Reportes")
4. Copia el token generado
5. Pégalo cuando el sistema te lo solicite

### 🏢 Dominio Fijo
El dominio está preconfigurado como: **ccsoft.atlassian.net**
(No necesitas cambiarlo)

## Funcionalidades

### Menú Principal
- **📋 Tareas del Sprint** - Genera reportes de compromisos
- **⚙️ Configuración** - Ver configuración actual
- **🧪 Test Conexión** - Probar conectividad con Jira
- **📊 Ver Logs** - Acceder a logs del sistema

### Tipos de Reportes
- **Hoy** - Tareas con fecha de vencimiento o fecha/hora de hoy
- **Semana actual** - Tareas de la semana en curso
- **Semana anterior** - Tareas de la semana pasada
- **Sprint completo** - Todas las tareas del sprint activo

### Categorización de Tareas
- **🎯 Comprometidas** - Tareas marcadas como "Comprometido"
- **🚨 Emergentes** - Tareas marcadas como "Tarea Emergente"
- **➕ Adicionales** - Tareas marcadas como "Adicional"

## Mejoras en la Versión 2.0

### Arquitectura
- ✅ **Modularización completa** - Código organizado en módulos especializados
- ✅ **Separación de responsabilidades** - Cada módulo tiene una función específica
- ✅ **Configuración centralizada** - Fácil mantenimiento de configuraciones

### Manejo de Errores
- ✅ **Logging estructurado** - Logs con timestamp y contexto
- ✅ **Manejo de errores tipificado** - Diferentes tipos de errores para Jira y Sheets
- ✅ **Retry automático** - Reintentos automáticos para operaciones fallidas
- ✅ **Validación de parámetros** - Validación automática de parámetros requeridos

### Interfaz de Usuario
- ✅ **UI mejorada** - Diálogos más atractivos con loading spinner
- ✅ **Menú expandido** - Funciones adicionales de testing y configuración
- ✅ **Mensajes informativos** - Feedback claro al usuario

### Reportes
- ✅ **Formato mejorado** - Mejor presentación visual de los reportes
- ✅ **Estadísticas detalladas** - Resúmenes por tipo de compromiso
- ✅ **Manejo de tiempo** - Formateo mejorado del tiempo registrado

## Testing y Debugging

### Test de Conexión
Usa **🧪 Test Conexión** en el menú para verificar:
- Conectividad con Jira
- Credenciales correctas
- Disponibilidad de colaboradores

### Test de Configuración
La función `testConfiguration()` verifica:
- Dominio de Jira configurado
- Email configurado
- API Token configurado

### Logs
- Accede a los logs via **Ver > Registros de ejecución** en Google Apps Script
- Los logs incluyen timestamp y contexto detallado

## Solución de Problemas

### Error de Autenticación
- Verifica que el email y API token sean correctos
- Asegúrate de que el dominio tenga el formato correcto

### Error 403 (Sin Permisos)
- Verifica que tengas permisos para el proyecto especificado
- Confirma que puedes acceder a los issues en Jira

### Error 404 (No Encontrado)
- Verifica que el proyecto especificado exista
- Confirma que los campos personalizados existan

### No se Encuentran Colaboradores
- Verifica que el `projectKey` en la configuración sea correcto
- Confirma que hay usuarios asignables en ese proyecto

## Mantenimiento

### Actualizar Configuración
1. Edita `config.gs`
2. Guarda los cambios
3. Usa **🧪 Test Conexión** para verificar

### Agregar Nuevos Campos
1. Actualiza `CONFIG_JIRA.customFields` en `config.gs`
2. Modifica `_obtenerCamposSolicitud()` en `jira-api.gs`
3. Actualiza `_generarTablaTareas()` en `report-generator.gs`

### Personalizar Filtros
Edita `FILTROS_JQL` en `config.gs` para:
- Excluir tipos de issues adicionales
- Filtrar palabras clave en resúmenes
- Cambiar estados de validación

## Migración desde Versión Original

1. **Backup** - Respalda tu archivo `code.gs` original
2. **Configuración** - Actualiza `config.gs` con tus credenciales
3. **Testing** - Ejecuta tests de conexión y configuración
4. **Validación** - Genera un reporte de prueba y compara resultados

## Soporte

Para reportar problemas o solicitar mejoras:
1. Revisa los logs en **Ver > Registros de ejecución**
2. Ejecuta las funciones de testing
3. Documenta el error específico y los pasos para reproducirlo