# 👤 Mi Reporte Personal - Sistema Automático

## 📖 Descripción

Sistema independiente para generar tu reporte personal automáticamente basado en registros de trabajo (worklogs) de Jira. El sistema identifica automáticamente tu usuario usando tus credenciales y genera tu reporte individual sin necesidad de seleccionar usuarios.

## 🚀 Características

- ✅ **Reporte Automático**: Genera tu reporte personal automáticamente
- ✅ **Identificación Automática**: Usa tus credenciales para identificarte en el equipo CCSOFT
- ✅ **Basado en Worklog**: Utiliza los registros de tiempo reales de Jira
- ✅ **Sin Selección Manual**: No necesitas seleccionar usuario - es automático
- ✅ **Selección de Fechas**: Interfaz amigable con calendarios para elegir el período
- ✅ **Períodos Rápidos**: Botones para períodos comunes (7 días, 30 días, mes actual, etc.)
- ✅ **Organización por Semanas**: Herramienta para reorganizar reportes agrupados por etiquetas SEMANA_X
- ✅ **Cálculos Automáticos**: Suma automática de tiempos y estimaciones por semana (conversión de segundos a horas)
- ✅ **Configuración Segura**: Credenciales almacenadas de forma segura
- ✅ **Formato Profesional**: Reportes con formato corporativo y estadísticas personalizadas

## 📁 Estructura de Archivos

```
ReportePorPersona_Aislado/
├── 01_Configuracion.gs      # Configuración del sistema y equipo CCSOFT
├── 02_InterfazUsuario.gs    # Menús y función principal del reporte automático
├── 03_JiraAPI.gs           # API de Jira, consultas JQL e identificación de usuario
├── 04_GeneradorReportes.gs # Generación y formato de reportes personalizados
├── FechasDialog.html       # Interfaz para selección de fechas con calendarios
└── README.md              # Esta documentación
```

## 🛠️ Instalación

### 1. Crear Proyecto en Google Apps Script

1. Ve a [Google Apps Script](https://script.google.com/)
2. Crea un nuevo proyecto
3. Renombra el proyecto a "Reporte por Persona Aislado"

### 2. Configurar Archivos

1. **Eliminar** el archivo `Code.gs` por defecto
2. **Crear** los siguientes archivos copiando el contenido:
   - `01_Configuracion.gs`
   - `02_InterfazUsuario.gs`
   - `03_JiraAPI.gs`
   - `04_GeneradorReportes.gs`
   - `FechasDialog.html`

### 3. Vincular con Google Sheets

1. Abre una nueva hoja de cálculo en Google Sheets
2. Ve a **Extensiones** → **Apps Script**
3. Pega el código en el editor de Apps Script
4. Guarda el proyecto

## ⚙️ Configuración

### 1. Configurar Credenciales de Jira

1. Abre la hoja de cálculo
2. Ve al menú **👤 Reporte por Persona** → **🔐 Configurar Credenciales**
3. Ingresa tu email de Jira
4. Ingresa tu API Token de Jira

#### Obtener API Token de Jira:
1. Ve a [Atlassian Account Settings](https://id.atlassian.com/manage-profile/security/api-tokens)
2. Haz clic en **"Create API token"**
3. Copia el token generado

### 2. Probar Conexión

1. Ve al menú **👤 Reporte por Persona** → **🧪 Probar Conexión**
2. Verifica que la conexión sea exitosa

## 📊 Uso del Sistema

### Generar Tu Reporte Personal

1. Ve al menú **👤 Mi Reporte Personal** → **📊 Generar Mi Reporte**
2. Se abrirá un diálogo amigable para seleccionar el período del reporte:
   - **Períodos Rápidos**: Haz clic en botones como "Últimos 30 días", "Este mes", etc.
   - **Fechas Personalizadas**: Usa los calendarios desplegables para seleccionar fechas específicas
3. Haz clic en **📊 Generar Mi Reporte**
4. El sistema identificará automáticamente tu usuario y generará tu reporte personal
5. Se creará una nueva hoja con tu reporte individual personalizado

### 📅 Características del Selector de Fechas

- **Calendarios Intuitivos**: Interfaz con calendarios desplegables nativos del navegador
- **Períodos Rápidos**: Botones para seleccionar períodos comunes:
  - Últimos 7, 15 o 30 días
  - Este mes o mes anterior
- **Validación Automática**: Verifica que las fechas sean válidas y el período no sea mayor a un año
- **Vista Previa**: Muestra el número de días del período seleccionado

### 📅 Organización por Semanas

Después de generar un reporte, puedes organizarlo por semanas usando:

1. Ve al menú **🛠️ Herramientas de Reporte** → **📅 Organizar por Semanas**
2. El sistema analizará las etiquetas "SEMANA_X" en tu reporte
3. Creará una nueva hoja organizada por semanas con:
   - **Agrupación por Semanas**: Todos los registros organizados por SEMANA_1, SEMANA_2, etc.
   - **Sumas Automáticas**: Tiempo total y estimación total por semana en horas
   - **Orden Cronológico**: Semanas ordenadas numéricamente
   - **Totales Visibles**: Resumen de horas por semana en el encabezado de cada grupo

### 🔢 Características de los Cálculos

- **Conversión Automática**: Los segundos se convierten automáticamente a horas (división entre 3600)
- **Redondeo Inteligente**: Resultados redondeados a 2 decimales para mayor legibilidad
- **Suma por Semana**: Totales de "Tiempo Trabajado" y "Estimación Original" por cada semana
- **Conteo de Registros**: Número de actividades por semana

### Contenido del Reporte

El reporte incluye las siguientes columnas detalladas:

| Columna | Descripción |
|---------|-------------|
| **Persona asignada** | Nombre completo de la persona |
| **Nombre del proyecto** | Nombre del proyecto en Jira |
| **Clave de incidencia** | Clave única del issue (ej: IAO-672) |
| **Tipo de Incidencia** | Tipo de issue (Tarea, Mesa de Trabajo, etc.) |
| **Resumen** | Descripción detallada del issue |
| **Tiempo Trabajado** | Tiempo invertido en segundos |
| **Estimación original** | Estimación inicial del issue en segundos |
| **Fecha de vencimiento** | Fecha límite del issue (formato DD/MM/YYYY) |
| **Estado** | Estado actual del issue (Cerrado, En Progreso, etc.) |
| **Etiquetas** | Etiquetas asociadas al issue |

Además incluye:
- **Estadísticas finales**: Totales de personas, registros y horas
- **Formato profesional**: Colores corporativos y estructura clara

## 👥 Equipo CCSOFT

El sistema está configurado para trabajar con el equipo CCSOFT, incluyendo:

### Área INFRA
- Monica Guerra
- Janeth Vega  
- Paola Rodriguez

### Área FENIX
- Carlos Bárcenas
- Mauricio Cervantes
- David Valdés
- Evert Romero
- Misael Hernández

## 🔧 Personalización

### Modificar Período de Reporte

Por defecto, el sistema obtiene registros de los últimos 30 días. Para modificar:

1. Edita la función `construirJQLParaReportesWorklog` en `03_JiraAPI.gs`
2. Cambia el valor en la línea:
   ```javascript
   const fechaInicio = opciones.fechaInicio || new Date(new Date().setDate(new Date().getDate() - 30));
   ```

### Agregar Nuevas Personas

1. Edita el array `EQUIPO_CCSOFT` en `01_Configuracion.gs`
2. Agrega la nueva persona con el formato:
   ```javascript
   { 
     nombre: "Nombre Completo", 
     email: "email@computocontable.com", 
     accountId: "account-id-de-jira", 
     area: "AREA", 
     activo: true, 
     rol: "Rol" 
   }
   ```

### Personalizar Colores

Modifica la sección `colores` en `CONFIG_SEMANAL` dentro de `01_Configuracion.gs`.

## 🚨 Solución de Problemas

### Error de Credenciales
- Verifica que el email sea correcto
- Regenera el API Token en Atlassian
- Asegúrate de tener permisos en Jira

### No Se Muestran Datos
- Verifica que las personas tengan registros de trabajo en Jira
- Confirma que los Account IDs sean correctos
- Revisa el período de fechas del reporte

### Error de Permisos
- Asegúrate de tener permisos para ver los proyectos en Jira
- Verifica que el API Token tenga los permisos necesarios

## 📝 Notas Técnicas

- **Dominio Fijo**: El sistema está configurado para `ccsoft.atlassian.net`
- **Seguridad**: Las credenciales se almacenan usando `PropertiesService`
- **Límites**: Máximo 2000 issues por consulta para evitar timeouts
- **Cache**: No implementado en esta versión simplificada

## 🔄 Actualizaciones

Para mantener el sistema actualizado:

1. **Equipo**: Actualiza `EQUIPO_CCSOFT` cuando haya cambios de personal
2. **Campos**: Ajusta `camposPersonalizados` si cambian los IDs en Jira
3. **Tipos**: Modifica `tiposIssueReales` según los tipos de issue de tu instancia

## 📞 Soporte

Para problemas o mejoras:

1. Revisa los logs en Apps Script (Ver → Registros)
2. Usa la función **📖 Ayuda** en el menú
3. Verifica la configuración paso a paso

---

**Versión**: 1.0.0  
**Fecha**: 2025-08-01  
**Autor**: Claude Code Assistant