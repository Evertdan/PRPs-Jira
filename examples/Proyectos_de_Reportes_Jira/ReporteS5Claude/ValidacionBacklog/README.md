# 📊 Sistema de Validación de Backlog y Sprint CCsoft

## 🎯 Objetivo

Sistema modular de validación de planeación para **tareas de backlog y sprints activos** de Jira, diseñado específicamente para **Cómputo Contable Software S.A. de C.V.** (CCsoft). Valida que las tareas cumplan con los estándares de planeación organizacional.

### 🔄 **Incluye:**
- ✅ **Tareas del backlog** (con fechas de vencimiento futuras)
- ✅ **Tareas de sprints activos** (usando `openSprints()`)
- ✅ **Validación completa** de criterios de planeación

## 📋 Criterios de Validación

### 1. ⏱️ Tiempo Estimado (25 puntos)
- **Story Points** (`customfield_10016`) - **PRIORIDAD**
- **O Estimación en Horas** (`timetracking.originalEstimateSeconds`)
- **Mínimo:** 1 punto o 1 hora

### 2. 🏷️ Etiqueta de Semana (25 puntos)
- **Formato:** `SEMANA_X` (donde X = 1,2,3,4,5)
- **Representa:** Semana de finalización planificada
- **Patrón:** `/^SEMANA_[1-5]$/`

### 3. 📅 Fecha de Vencimiento (25 puntos)
- **Requerida** para todas las tareas
- **Debe ser futura** (no del pasado)
- **Período:** Dentro de 5 semanas de planeación

### 4. 🔄 Alineación Fecha-Etiqueta (25 puntos)
- **Validación:** Fecha debe caer dentro de la semana indicada
- **SEMANA_1:** Próximos 7 días
- **SEMANA_2:** Días 8-14, etc.

## 🏢 Estructura Organizacional CCsoft

### Áreas y Proyectos:
- **🔥 FENIX:** Desarrollo Core - CRÍTICO (80% revenue)
- **🏗️ INFRA:** Infraestructura - ALTA prioridad
- **🛠️ MOP:** Mesa de Operaciones - ALTA prioridad  
- **💻 MEC:** Mesa de Aplicaciones - Customer facing
- **📊 GESTION:** Gestión Organizacional - Soporte

### Proyectos Prioritarios:
`FENIX`, `BDMS`, `INFLYV`, `MAAC`, `VYP`

## 📊 Niveles de Calidad

| Nivel | Rango | Estado | Descripción |
|-------|-------|---------|-------------|
| 🟢 | 90-100% | Excelente | Todo válido + buenas prácticas |
| 🟡 | 75-89% | Bueno | Validaciones básicas + mejoras menores |
| 🟠 | 50-74% | Aceptable | Algunos problemas menores |
| 🔴 | <50% | Crítico | Requiere atención inmediata |

## 🗂️ Estructura del Sistema

```
ValidacionBacklog/
├── ConfiguracionValidacion.gs     # Configuración y constantes
├── ValidadorTareas.gs             # Lógica de validación
├── ValidacionBacklogMain.gs       # Función principal
├── EscrituraReportes.gs           # Escritura en Sheets
├── MenuValidacionBacklog.gs       # Menú e interfaz
└── README.md                      # Esta documentación
```

## 🚀 Instalación y Uso

### 1. Requisitos Previos
- Google Sheets con Apps Script habilitado
- Cuenta de Jira con permisos de lectura en proyectos CCsoft
- Email y API Token de Jira Cloud

### 2. Instalación
1. Copiar todos los archivos `.gs` a Google Apps Script (en la raíz del proyecto):
   - `ConfiguracionValidacion.gs`
   - `ValidadorTareas.gs` 
   - `ValidacionBacklogMain.gs`
   - `EscrituraReportes.gs`
   - `MenuValidacionBacklog.gs`

2. Refrescar la página para que aparezca el menú

### 3. Configuración Inicial
1. **🔐 Configurar Credenciales** - Introducir email y API Token de Jira
2. **🔍 Diagnóstico de Conexión** - Verificar conectividad
3. **🧪 Test de Validación** - Probar funcionamiento del sistema
4. **🎯 Generar Reporte de Validación** - Crear primer reporte

## 📋 Reportes Generados

### 1. 📊 Dashboard
- Resumen ejecutivo de validación
- Estado general de planeación
- Distribución por niveles de calidad
- Principales problemas detectados

### 2. 📋 Detalle de Tareas
- Lista completa de tareas con validación
- Estado individual por criterio
- Recomendaciones específicas
- Enlaces a Jira

### 3. 👥 Métricas por Equipos
- Análisis por área organizacional
- Comparativo entre equipos
- Distribución de carga de trabajo
- Identificación de cuellos de botella

### 4. 📅 Seguimiento Semanal
- Distribución temporal por `SEMANA_X`
- Alineación fecha-etiqueta
- Predicción de carga futura
- Recomendaciones de redistribución

## ⚙️ Funciones Principales

### `generarReporteValidacionBacklog()`
Función principal que genera el reporte completo de validación.

### `ValidadorTareasBacklog.validarTarea(tarea)`
Valida una tarea individual según todos los criterios.

### `ProcesadorLoteTareas.procesarLoteTareas(tareas)`
Procesa múltiples tareas y genera estadísticas agregadas.

## 🔧 Configuración Avanzada

### Personalización de Criterios
```javascript
CONFIG_VALIDACION_BACKLOG.CRITERIOS = {
  tiempoEstimado: {
    storyPoints: "customfield_10016",
    horasOriginales: "timetracking.originalEstimateSeconds",
    minimo: 1,
    prioridadStoryPoints: true
  },
  // ... más configuraciones
};
```

### Umbrales de Calidad
```javascript
UMBRALES: {
  excelente: 90,    // 90-100%
  bueno: 75,        // 75-89%
  aceptable: 50,    // 50-74%
  critico: 49       // <50%
}
```

## 🛠️ Menú de Funciones

### Funciones Principales:
| Función | Descripción |
|---------|-------------|
| 🎯 Generar Reporte de Validación | Reporte completo con todos los análisis |
| 📋 Solo Tareas Sin Validar | Reporte enfocado en tareas problemáticas |
| 📅 Solo Distribución Semanal | Análisis temporal por semanas |
| 👥 Solo Métricas por Equipo | Análisis por áreas organizacionales |

### Funciones de Configuración:
| Función | Descripción |
|---------|-------------|
| 🔐 Configurar Credenciales | Configurar email y API Token de Jira |
| 🔍 Diagnóstico de Conexión | Verificar conectividad con Jira |
| 🧪 Test de Validación | Probar funcionamiento del sistema |
| 📋 Ayuda del Sistema | Documentación completa del sistema |

## 📊 Métricas Clave

### Por Tarea:
- **Puntaje de validación** (0-100%)
- **Estado de completitud** (Excelente/Bueno/Aceptable/Crítico)
- **Recomendaciones específicas**

### Por Equipo:
- **% de cumplimiento** de validación
- **Distribución de problemas** por tipo
- **Carga de trabajo** por área

### Organizacional:
- **Promedio de completitud** general
- **Tendencias temporales** por semana
- **Identificación de patrones** problemáticos

## 🔍 Solución de Problemas

### Errores Comunes:

1. **"Configuración de credenciales incompleta"**
   - Ejecutar **🔐 Configurar Credenciales** desde el menú
   - Introducir email y API Token válidos
   - Verificar PropertiesService

2. **"Error de conexión: 401"**
   - Token API expirado
   - Permisos insuficientes en Jira

3. **"No se encontraron tareas"**
   - Verificar JQL y proyectos configurados
   - Comprobar fechas de vencimiento

### Diagnóstico:
1. **🔍 Diagnóstico de Conexión** - Verificar conectividad
2. **🧪 Test de Validación** - Probar funcionamiento
3. **🔄 Refrescar Configuración** - Recargar configuración

## 📈 Integración con Sistema Existente

Este sistema puede integrarse con el **Sistema de Reportes Semanales Jira Pro** existente:

- **Puede reutilizar credenciales** del sistema semanal (fallback automático)
- **Configuración independiente** de credenciales disponible
- **Comparte configuración** de proyectos CCsoft
- **Mantiene consistencia** en estructura organizacional
- **Extiende funcionalidad** sin duplicar código

## 🎯 Casos de Uso

### 1. **Revisión Semanal de Planeación**
Ejecutar reporte completo cada lunes para validar planeación de la semana.

### 2. **Preparación de Sprint Planning** 
Usar "Solo Tareas Sin Validar" antes de planning meetings.

### 3. **Análisis de Carga de Trabajo**
Usar "Métricas por Equipo" para balancear carga entre áreas.

### 4. **Seguimiento de Mejoras**
Usar reportes históricos para medir mejoras en calidad de planeación.

## 🚀 Próximas Versiones

### v1.1.0 (Planeado):
- ⚙️ Configuración de criterios personalizados
- 📊 Gráficos y visualizaciones avanzadas
- 📧 Alertas automáticas por email
- 🔄 Sincronización automática programada

### v1.2.0 (Planeado):
- 📈 Análisis de tendencias históricas
- 🎯 Predicción de problemas de planeación
- 📋 Templates de mejores prácticas
- 🔗 Integración con otras herramientas CCsoft

---

## 📞 Soporte

**Desarrollado para:** Cómputo Contable Software S.A. de C.V.  
**Versión:** 1.0.0  
**Fecha:** 2025-07-31  
**Autor:** Claude Code Assistant - CCsoft Integration  

Para soporte técnico o mejoras, contacte al equipo de desarrollo interno de CCsoft.

---

**🎯 ¡Sistema listo para mejorar la calidad de planeación del backlog CCsoft!**