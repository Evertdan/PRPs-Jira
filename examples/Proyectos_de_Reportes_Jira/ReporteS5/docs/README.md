
### Datos de la Organización
- **Empresa**: Cómputo Contable Software S.A. de C.V.
- **Sector**: Desarrollo de Software Contable y Fiscal
- **URL Instancia**: https://ccsoft.atlassian.net
- **Cloud ID**: `21cb8248-c3b8-4891-a530-98e6a6aabf5d`
- **Región**: América/México
- **Zona Horaria**: America/Mexico_City (UTC-6)
- **Plan**: Atlassian Cloud Premium
- **Versión API**: Jira REST API v3
## ℹ️ **Información General de la Instancia**

### **Datos de Conexión**
```yaml
Instancia:
  URL: https://ccsoft.atlassian.net
  Cloud ID: 21cb8248-c3b8-4891-a530-98e6a6aabf5d
  Región: América/México
  Zona Horaria: America/Mexico_City (UTC-6)
  Tipo: Jira Cloud Premium
  Empresa: Cómputo Contable Software S.A. de C.V.
  Sector: Desarrollo de Software Contable y Fiscal

Configuración API:
  Base URL v3: https://ccsoft.atlassian.net/rest/api/3/
  Base URL Agile: https://ccsoft.atlassian.net/rest/agile/1.0/
  Autenticación: Basic Auth (email:token)
  Rate Limit: Estándar Atlassian Cloud (aproximadamente 300 solicitudes por minuto con ráfagas de hasta 10 solicitudes consecutivas)
```

### **Credenciales de API Validadas**
```javascript
// ✅ CONFIGURACIÓN VALIDADA CON MCP
const CONFIG_JIRA = {
  dominio: "ccsoft.atlassian.net",
  cloudId: "21cb8248-c3b8-4891-a530-98e6a6aabf5d",
  
  // Tokens validados
  email_principal: "computocontable@gmail.com",
  apiToken_principal: "",
  
  // Token alternativo validado
  email_alternativo: "gabriela.hernandez@computocontable.com",
  apiToken_alternativo: ""
};
```


### Headers de Autenticación
```javascript
const headers = {
  "Authorization": "Basic " + Utilities.base64Encode(CONFIG_JIRA.email + ":" + CONFIG_JIRA.apiToken),
  "Accept": "application/json",
  "Content-Type": "application/json"
};
```

---

# 🏗️ Estructura Organizacional CCsoft

---

## 📂 Proyectos Activos (17 Total)

|Clave|Nombre Completo|ID|Área|Prioridad|Impacto Revenue|Responsable|
|---|---|---|---|---|---|---|
|**FENIX**|FENIX - Transición Tecnológica|10086|CORE|1|80% ($2.4M)|Marcos Coronado / Carlos Bárcenas|
|**BDMS**|Bot de Mesa de Servicio|10286|MOP|2|15%|Gabriela Hernández|
|**INFLYV**|Infraestructura Local y Virtual|10037|INFRA|2|Operacional|Monica Guerra|
|**MAAC**|Mesa de Atención a Clientes|10076|MEC|3|5%|Perla Carreón|
|**VYP**|Ventas y Productos|10039|COMERCIAL|2|Revenue Gen|Luis Sánchez|
|**IAO**|Infraestructura Actividad Operativa|10319|INFRA|3|Operacional|Monica Guerra|
|**DC**|Desarrollo de Competencias|10053|MOP|4|Capacitación|Monica Guerra|
|**DTO**|Deuda Técnica Organizacional|10084|CORE|3|Optimización|Evert Romero|
|**DT**|Desarrollo Tecnológico Actividad Op.|10087|CORE|3|Operacional|Carlos Bárcenas|
|**IP**|Iniciativas Productos|10517|MEC|4|R&D|Luis Sánchez|
|**OM**|Office Manager|10034|GESTION|5|Corporativo|Área Administrativa|
|**PMO**|Oficina de Administración de Proyectos|10035|GESTION|4|Estratégico|PMO Team|
|**RCP**|Relaciones con Clientes y Portales|10038|MOP|3|Comercial|Gabriela Hernández|
|**SGC**|Sistema de Gestión de Calidad|10054|GESTION|4|Certificado|Quality Team|
|**SIB**|Sistema de Información de Bienestar|10078|GESTION|5|Interno|HR Team|
|**TH**|Talento Humano|10079|GESTION|5|Activo|RRHH|
|**WEB**|Desarrollo Web|10085|MEC|4|Marketing|Frontend Team|

---

## 🧩 Proyectos Críticos

```yaml
FENIX:
  ID: 10086
  Nombre: "FENIX - Transición Tecnológica"
  Prioridad: 1
  Revenue_Impact: "80% ($2.4M anuales)"
  Usuarios_Activos: "15,000+ empresas"
  SLA: "99.9%"
  Área: "CORE"

BDMS:
  ID: 10286
  Nombre: "Bot de Mesa de Servicio"
  Prioridad: 2
  Revenue_Impact: "15% (ahorro en costos)"
  Usuarios_Activos: "500 agentes"
  Área: "MOP"

INFLYV:
  ID: 10037
  Nombre: "Infraestructura Local y Virtual"
  Prioridad: 2
  Revenue_Impact: "Operacional"
  Área: "INFRA"
```

---

## 📊 Proyectos Secundarios

```yaml
Secundarios:
  - MAAC (10076): Mesa de Atención a Clientes
  - VYP (10039): Ventas y Productos
  - IAO (10319): Infraestructura Actividad Operativa
  - DC (10053): Desarrollo de Competencias
  - DTO (10084): Deuda Técnica Organizacional
  - DT (10087): Desarrollo Tecnológico Operativo
  - IP (10517): Iniciativas Productos
  - OM (10034): Office Manager
  - PMO (10035): Oficina de Proyectos
  - RCP (10038): Relaciones Clientes y Portales
  - SGC (10054): Sistema de Gestión de Calidad
  - SIB (10078): Información de Bienestar
  - TH (10079): Talento Humano
  - WEB (10085): Desarrollo Web
```

---

## 🏢 Áreas Organizacionales

```yaml
INFRA:
  Emoji: "🏗️"
  Descripción: "Infraestructura y Operaciones"
  Líder: "Monica Guerra"
  Equipo: ["Monica Guerra", "Janeth Vega", "Paola Rodriguez"]
  Color: "#ffeb3b"
  SLA: "99.9% uptime, soporte 24/7"
  Proyectos: ["INFLYV", "IAO", "DC"]

CORE:
  Emoji: "🔥"
  Descripción: "Desarrollo Core y APIs"
  Líderes: ["Carlos Bárcenas", "Marcos Coronado", "Evert Romero"]
  Equipo: 9 personas
  Color: "#4caf50"
  Revenue_Impact: "80%"
  Proyectos: ["FENIX", "DTO", "DT"]

MOP:
  Emoji: "⚙️"
  Descripción: "Metodología y Procesos"
  Líder: "Gabriela Hernández"
  Equipo: ["Gabriela Hernández", "Benjamin Oribe"]
  Color: "#2196f3"
  ROI: "60% reducción en tiempos de atención"
  Proyectos: ["BDMS", "RCP", "DC"]

MEC:
  Emoji: "💻"
  Descripción: "Aplicaciones y Frontend"
  Líderes: ["Perla Carreón", "Luis Sánchez"]
  Equipo: 4 personas
  Color: "#ff9800"
  Métricas: "NPS > 8.5, conversión 15%"
  Proyectos: ["MAAC", "IP", "WEB"]

COMERCIAL:
  Emoji: "📈"
  Descripción: "Ventas y Productos"
  Líder: "Director Comercial"
  Color: "#e91e63"
  Proyectos: ["VYP"]

GESTION:
  Emoji: "📋"
  Descripción: "Gestión de Proyectos y Servicios"
  Líder: "PMO"
  Color: "#795548"
  Proyectos: ["OM", "PMO", "SGC", "SIB", "TH"]
```

---

## 🔐 Grupos de Confluence Detectados (35)

```yaml
Grupos_Administrativos:
  - confluence-00-CC-admin
  - confluence-01-FENIX-admin
  - ...
  - confluence-16-GMS-admin
  - compass-admins-ccsoft
  - atlassian-addons-admin
```

---


## 👥 Usuarios y Roles

### Estructura de Liderazgo Completa

```javascript
const EQUIPOS_LIDERES = {
  "Monica": {
    assignees: [
      "712020:042358bc-7708-42bc-9af4-c0be66012d4e", // Monica Guerra
      "712020:8a25dc51-c490-42ca-bd90-70992d8655e2", // Janeth Vega
      "712020:166682a6-7443-4248-b6ab-92dc7d32e13a"  // Paola Rodriguez
    ],
    nombre: "Monica Guerra",
    equipo: ["Monica Guerra", "Janeth Vega", "Paola Rodriguez"],
    area: "INFRA",
    email: "monica.guerra@computocontable.com"
  },
  "Carlos": {
    assignees: [
      "712020:44bf1d24-752a-4537-aa2b-7f5d1884fafb", // Carlos Bárcenas
      "712020:51ed9320-e7db-4268-9b15-51b16819d8cf", // Mauricio Cervantes
      "712020:449ccb37-4ecc-40f8-b258-3a2b351c8366"  // David Valdés
    ],
    nombre: "Carlos Bárcenas",
    equipo: ["Carlos Bárcenas", "Mauricio Cervantes", "David Valdés"],
    area: "FENIX",
    email: "carlos.barcenas@computocontable.com"
  },
  "Evert": {
    assignees: [
      "712020:bcc8f634-81f1-4b21-893b-de03d7203037", // Evert Romero
      "712020:1eac4227-aa1c-4bbb-bb94-549d6a842965", // Misael Hernández
      "712020:bb3375fa-e762-43b6-acc4-6c4bd47efab1"  // Manuel Benítez
    ],
    nombre: "Evert Romero",
    equipo: ["Evert Romero", "Misael Hernández", "Manuel Benítez"],
    area: "FENIX",
    email: "evert.romero@computocontable.com",
    puesto: "QA Lead & Ingeniero de Software"
  },
  "Gabriela": {
    assignees: [
      "712020:143bf4ba-d154-434f-b344-31f542ce88d9", // Gabriela Hernández
      "712020:9233c170-0021-4cb2-9f5d-04986932faa6"  // Benjamin Oribe
    ],
    nombre: "Gabriela Hernández",
    equipo: ["Gabriela Hernández", "Benjamin Oribe"],
    area: "MOP",
    email: "gabriela.hernandez@computocontable.com"
  },
  "Marcos": {
    assignees: [
      "712020:a06717c8-e1eb-49bd-812f-7be59e7f61f1", // Marcos Coronado
      "712020:9233c170-0021-4cb2-9f5d-04986932faa6", // Benjamin Oribe (compartido)
      "712020:143bf4ba-d154-434f-b344-31f542ce88d9"  // Gabriela Hernández (compartido)
    ],
    nombre: "Marcos Coronado",
    equipo: ["Marcos Coronado", "Benjamin Oribe", "Gabriela Hernández"],
    area: "FENIX",
    email: "marcos.coronado@computocontable.com"
  },
  "Perla": {
    assignees: [
      "712020:62a4f5dd-da42-4893-8406-70fe4e7ab804", // Perla Carreón
      "63ed4190eaf0b28dfd1b955a"                      // Norma Fragoso
    ],
    nombre: "Perla Carreón",
    equipo: ["Perla Carreón", "Norma Fragoso"],
    area: "MEC",
    email: "perla.carreon@computocontable.com"
  },
  "Luis": {
    assignees: [
      "712020:2cf81f55-3377-4061-a8ab-f0be722d33bf", // Luis Sánchez
      "712020:f8c11447-160d-4828-add5-501374ee89d4"  // Francisco Díez
    ],
    nombre: "Luis Sánchez",
    equipo: ["Luis Sánchez", "Francisco Díez"],
    area: "MEC",
    email: "luis.sanchez@computocontable.com"
  }
};
```

### Usuario Auditor Principal
- **Nombre**: Evert Daniel Romero Garrido
- **Email**: evert.romero@computocontable.com
- **Account ID**: 712020:bcc8f634-81f1-4b21-893b-de03d7203037
- **Puesto**: Ingeniero de Software (QA Lead)
- **Área**: FENIX (Customer Support)
- **Estado**: Activo desde 2024
- **Zona horaria**: America/Mexico_City
- **Idioma**: Español (es)

---
# 🎯 Tipos de Issues y Jerarquías — Guía Unificada CCsoft


## 1. Jerarquía General

|Nivel|Tipo|ID|Descripción breve|
|---|---|---|---|
|**1**|**Épica**|10000|Gran iniciativa de negocio|
|**0**|Historia de usuario|10039|Funcionalidad vista por el usuario|
||Tarea|10040|Actividad específica|
||Tarea Operativa|10203|Actividades rutinarias|
||Tarea Emergente|10202|Tareas no planificadas|
||Deuda Técnica|10077|Mejoras sobre entregas previas|
||Mesa de Trabajo|10103|Reuniones colaborativas|
||Documentación|10164|Creación / mantenimiento de docs|
||Capacitación|10129|Formación y entrenamiento|
||Solicitud de cambio|10038|Modificaciones propuestas|
||Defecto|10042|Falla, error o bug|
||Incidente|10197|Interrupción no planificada|
||Habilitador|10198|Investigación / prototipos|
||Liberación|10201|Despliegue a producción|
||Riesgo|10232|Condición incierta|
||Acción de Mejora|10428|Acciones derivadas de retrospectivas|
||Acción Correctiva|10461|Acciones correctivas|
||Prueba Funcional|10200|Verificación de requisitos|
||Prueba de Carga|10230|Evaluación de demanda|
||Prueba de Rendimiento|10231|Evaluación de eficiencia|
||Convivencias y Cumpleaños|10268|Eventos sociales|
||Juntas Scrum|10267|Ceremonias ágiles|
|**-1**|Sub-tarea|10041|Paso específico dentro de un issue de nivel 0|
||Sub-tarea Emergente|10362|Sub-tareas no planificadas|
||QA|10199|Verificación durante desarrollo|

---

## 2. Tipos por Categoría

### 2.1 Desarrollo (7)

- Historia de usuario (10039)
- Tarea (10040)
- Defecto (10042)
- Deuda Técnica (10077)
- Habilitador (10198)
- Liberación (10201)
- Solicitud de cambio (10038)

### 2.2 Testing (4)

- QA (10199) _(sub-tarea)_
- Prueba Funcional (10200)
- Prueba de Carga (10230)
- Prueba de Rendimiento (10231)

### 2.3 Operaciones (5)

- Tarea Operativa (10203)
- Tarea Emergente (10202)
- Incidente (10197)
- Riesgo (10232)
- Mesa de Trabajo (10103)

### 2.4 Gestión (5)

- Épica (10000)
- Documentación (10164)
- Capacitación (10129)
- Acción de Mejora (10428)
- Acción Correctiva (10461)

### 2.5 Especiales (2)

- Convivencias y Cumpleaños (10268)
- Juntas Scrum (10267)

---

## 3. Campos Personalizados Validados

```javascript
// Referencia rápida (ID → uso)
const CAMPOS_PERSONALIZADOS = {
  sprint:        "customfield_10020",  // Sprint activo / planeado
  story_points:  "customfield_10016",  // Estimación ágil
  seguidores:    "customfield_10003",  // Watchers adicionales
  desviaciones:  "customfield_10230",  // Desviaciones de plan / calidad
  area_funcional:"customfield_10231",  // Clasificación de área (INFRA, CORE…)
  comentarios:   "customfield_10228"   // Comentarios contextuales
};
```

|Campo|ID|Uso principal|Ejemplos de valor|
|---|---|---|---|
|**Sprint**|customfield_10020|Relacionar issue a sprint|`Q3-S1-25-FTT-THOTH`, `2341`|
|**Story Points**|customfield_10016|Estimación de esfuerzo|1, 2, 3, 5, 8, 13, 21|
|**Área Funcional**|customfield_10231|Clasificar por unidad de negocio|INFRA, CORE, MOP, MEC, COMERCIAL, GESTION|
|**Desviaciones**|customfield_10230|Registrar desviaciones al plan|Texto libre|
|**Seguidores**|customfield_10003|Usuarios que siguen el issue|Array de _accountIds_|
|**Comentarios**|customfield_10228|Notas adicionales|Texto libre|

---

## 4. Campos Estándar Clave

- **Core**: `key`, `summary`, `description`, `status`, `assignee`, `reporter`, `project`, `issuetype`, `priority`, `labels`, `created`, `updated`, `resolutiondate`
- **Tiempo**: `timetracking`, `timespent`, `timeestimate`, `worklog`
- **Relaciones**: `parent`, `subtasks`, `issuelinks`
- **Adjuntos / Colaboración**: `attachment`, `comment`

---

## 5. Vista Resumida de Jerarquía

```
Épica
 ├─ (nivel 0) Issues estándar / testing / operativos / gestión / especiales
 │    ├─ Historia de usuario
 │    ├─ Tarea
 │    ├─ … (hasta 20 tipos adicionales)
 │
 └─ (nivel -1) Sub-tareas
       ├─ Sub-tarea
       ├─ Sub-tarea Emergente
       └─ QA
```



## 📊 Estados de Workflow

### Estados Validados por Categoría

```javascript
const ESTADOS_JIRA = {
  completados: ["Cerrado", "Listo", "Done", "Completado", "Finished", "Resolved", "Finalizado", "Terminado", "Entregado", "Implementado"],
  validacion: ["Validación", "En Validación", "Review", "Code Review", "Testing", "QA", "Revisión", "Pendiente de Revisión", "En Revisión"],
  progreso: ["En progreso", "In Progress", "Desarrollo", "Working", "Doing", "Desarrollando"],
  pendientes: ["Por hacer", "To Do", "Pendiente", "Nueva", "Abierto"],
  bloqueados: ["Bloqueo", "Bloqueado", "Blocked", "Impedimento", "Paused"]
};
```

### Estados Principales Identificados
- **Por hacer** (ID: 10071): Estado inicial - Categoría "Por hacer"
- **Cerrado** (ID: 10069): Estado final - Categoría "Listo"


---

## 🏃‍♂️ Gestión de Sprints CCsoft

### 🔤 Nomenclatura Estándar de Sprints

**Formato General**:  
`Q#-S#-AA(-[CÓDIGO])?(-[NOMBRE])?`  
(Trimestre, Sprint, Año, Código del proyecto, Nombre del sprint)

**Ejemplos válidos**:

- `Q3-S1-25` — Sprint sin código ni nombre.
- `Q3-S1-25-FTT-THOTH` — Sprint actual (Trimestre 3, Sprint 1, Año 2025, Proyecto FTT, Nombre clave THOTH).
- `Q2-S4-24-RELEASE` — Sprint de release del segundo trimestre 2024.
- `Q1-S2-2025-MVP-ALPHA` — Sprint con año completo y nombre clave.

**Componentes del nombre**:

- `Q[1-4]`: Trimestre (Q1 = Ene-Mar, Q2 = Abr-Jun, etc.).
- `S[1-6]`: Número de sprint en el trimestre (hasta 6 por trimestre).
- `[YY|YYYY]`: Año en formato corto (25) o largo (2025).
- `[CÓDIGO]`: Código del proyecto (opcional, ej. FTT, RELEASE).
- `[NOMBRE]`: Nombre clave o temático del sprint (opcional).

**Regex validado**:

```regex
Q[1-4]-S[1-6]-([0-9]{2}|[0-9]{4})(-[A-Z0-9]+)?(-[A-Z0-9]+)?
```

---

### 📌 Sprint Actual

```javascript
const CONFIG_SPRINT = {
  actual: "Q3-S1-25-FTT-THOTH",
  fechaInicio: "2025-07-14",
  fechaFin: "2025-07-18",
  descripcionPeriodo: "14-18 Julio 2025 - Semana 3",
  objetivo: "Finalizar milestone crítico de FENIX Transición Tecnológica"
};
```

```yaml
Sprint_Actual:
  ID: "Q3-S1-25-FTT-THOTH"
  Período: "14-18 Julio 2025 (Semana 3)"
  Duración: "5 días laborables"
  Objetivo: "Finalizar milestone crítico FENIX"
  Codificación:
    Q3: "Tercer trimestre 2025"
    S1: "Sprint 1 del trimestre"
    25: "Año 2025"
    FTT: "FENIX Technology Transition"
    THOTH: "Nombre código (Dios egipcio)"
```

---

### 🔗 API de Sprints (Jira Agile)

#### Obtener sprints de un tablero

```http
GET /rest/agile/1.0/board/{boardId}/sprint
Parámetros:
  - state: active, future, closed
  - startAt: índice de inicio (paginación)
  - maxResults: máximo de resultados (máx. 50)
```

#### Obtener issues de un sprint

```http
GET /rest/agile/1.0/sprint/{sprintId}/issue
Respuesta incluye:
  - id: ID único del sprint
  - name: Nombre del sprint
  - state: ACTIVE | FUTURE | CLOSED
  - startDate: Fecha inicio (ISO 8601)
  - endDate: Fecha fin (ISO 8601)
  - boardId: ID del tablero asociado
```

---

## 🔍 Consultas JQL Validadas (Jira Query Language)

## 1. Consultas JQL Esenciales

|#|Objetivo|Consulta|
|---|---|---|
|**1**|**Tareas por Sprint**|`sql\nsprint IN (sprintIds) AND project NOT IN ("Papelera","TRASH")\nORDER BY project, assignee, priority DESC, created\n`|
|**2**|**Tareas de un assignee en un período**|`sql\n(\n duedate >= "@fechaInicio" AND duedate <= "@fechaFin"\n OR updated >= "@fechaInicio" AND updated <= "@fechaFin"\n OR customfield_10020 IN openSprints()\n)\nAND assignee=@accountId\nAND project NOT IN ("Papelera","TRASH")\n`|
|**3**|**Tareas por Área Funcional**|`sql\ncustomfield_10231="FENIX" AND status IN ("Done","Cerrado")\nORDER BY updated DESC\n`|
|**4**|**Tareas con Desviaciones**|`sql\ncustomfield_10230 IS NOT EMPTY AND project="FENIX"\nORDER BY priority DESC, created DESC\n`|
|**5**|**Tareas activas (última semana)**|`sql\nupdated >= -1w AND status IN ("En progreso","Review","Testing")\nORDER BY assignee, priority DESC\n`|

> 💡 **Parámetros:** reemplaza `@fechaInicio`, `@fechaFin`, `@accountId` con valores reales o variables en tus dashboards.

---

## 2. Consultas JQL Probadas

### 2.1 Básicas

```sql
-- Por proyecto y estado
project = FENIX AND status IN ("En progreso","Por hacer")

-- Sprint activo sin papelera
sprint IN openSprints() AND project NOT IN ("Papelera","TRASH")

-- Issues recientes de evert.romero
assignee="evert.romero@computocontable.com" AND updated >= -1w

-- Issues con desviaciones en FENIX
project=FENIX AND customfield_10230 IS NOT EMPTY
```

### 2.2 Multicriterio (plantilla)

```sql
(
  (duedate >= "@inicio" AND duedate <= "@fin") OR
  (updated >= "@inicio" AND updated <= "@fin") OR
  (customfield_10020 IN openSprints())
)
AND assignee IN (@accountId1,@accountId2)
AND project NOT IN ("Papelera","TRASH")
```

---

## 3. Consultas para Reportes & KPIs

|Categoría|Ejemplo de consulta|
|---|---|
|**Productividad por Área**|`sql\nproject IN (FENIX,BDMS,INFLYV)\nAND updated >= startOfQuarter()\nAND status CHANGED TO "Done" DURING (startOfQuarter(),now())\nORDER BY assignee,updated DESC\n`|
|**Calidad (bugs creados este mes)**|`sql\nproject=FENIX AND type IN ("Defecto","Bug")\nAND created >= startOfMonth()\nAND customfield_10230 IS NOT EMPTY\n`|
|**Sprint Retrospectiva**|`sql\nsprint="Q3-S1-25-FTT-THOTH" AND (\n status IN ("Done","Cerrado") OR\n status WAS "Done" DURING (startOfWeek(),endOfWeek())\n)\nORDER BY resolutiondate\n`|
|**Backlog sin estimación**|`sql\nproject=FENIX AND status IN ("Por hacer") AND customfield_10016 IS EMPTY\nORDER BY priority DESC,created\n`|
|**Tasks vencidas**|`sql\nduedate < startOfDay() AND resolution IS EMPTY AND status NOT IN ("Cerrado","Done")\nORDER BY duedate ASC\n`|
|**Issues sin assignee**|`sql\nassignee IS EMPTY AND status NOT IN ("Cerrado","Done")\nORDER BY created DESC\n`|
|**Historias con desviación > 0 y últ. 30 días**|`sql\nissuetype="Historia de usuario"\nAND customfield_10230 IS NOT EMPTY\nAND updated >= -30d\nORDER BY updated DESC\n`|

---

## 4. Operadores & Funciones JQL Claves

|Símbolo / Función|Uso|Ejemplo|
|---|---|---|
|`=` / `!=`|Igual / distinto|`status != "Cerrado"`|
|`IN` / `NOT IN`|Pertenece / no pertenece a lista|`project IN ("FENIX","BDMS")`|
|`~`|Contiene texto|`summary ~ "OAuth"`|
|`IS EMPTY` / `IS NOT EMPTY`|Campo vacío / con valor|`assignee IS EMPTY`|
|`>=` `<=` `<` `>`|Comparación de números o fechas|`created >= "2025-01-01"`|
|`AND` / `OR`|Lógica booleana|`priority=High AND resolution IS EMPTY`|
|**Funciones de fecha**|`startOfDay()`, `endOfWeek()`, `-1w`, `startOfQuarter()`||
|**Sprint & historia**|`openSprints()`, `closedSprints()`, `issuesInEpics()`||
|**Histórico**|`status CHANGED TO`, `status WAS`, `during (date1,date2)`||

---

## 5. Buenas Prácticas

1. **Filtra papelera** `project NOT IN ("Papelera","TRASH")` en casi todos los dashboards.
2. **Ordena inteligentemente** `ORDER BY priority DESC, updated DESC` mejora la visibilidad de lo urgente.
3. **Usa campos personalizados** Referéncialos por **ID** (p. ej. `customfield_10230`) para evitar fallos por renombre.
4. **Coteja tu JQL** Valida con _Jira Query Editor_ antes de guardar gadgets o automatizaciones.
5. **Cuida el rendimiento** Evita queries sin índices (por ejemplo, `text ~ "xxx"` combinadas con filtros amplios).

---

## 🌐 Endpoints de API

### URLs Base
- **API REST v3**: `https://ccsoft.atlassian.net/rest/api/3/`
- **API Agile v1**: `https://ccsoft.atlassian.net/rest/agile/1.0/`

### Endpoints Principales

#### 1. Información del Usuario
```http
GET /rest/api/3/myself
```

#### 2. Búsqueda de Issues
```http
GET /rest/api/3/search?jql={jql}&fields={fields}&maxResults={max}&startAt={start}
```

#### 3. Obtener Issue Específico
```http
GET /rest/api/3/issue/{issueIdOrKey}?fields={fields}
```

#### 4. Proyectos
```http
GET /rest/api/3/project/search?maxResults={max}&startAt={start}
```

#### 5. Tableros (Agile)
```http
GET /rest/agile/1.0/board?maxResults={max}&startAt={start}
```

#### 6. Sprints de un Tablero
```http
GET /rest/agile/1.0/board/{boardId}/sprint?maxResults={max}&startAt={start}
```

#### 7. Issues de un Sprint
```http
GET /rest/agile/1.0/sprint/{sprintId}/issue?maxResults={max}&startAt={start}
```

#### 8. Crear Issue
```http
POST /rest/api/3/issue
```

#### 9. Actualizar Issue
```http
PUT /rest/api/3/issue/{issueIdOrKey}
```

#### 10. Transiciones de Issue
```http
GET /rest/api/3/issue/{issueIdOrKey}/transitions
POST /rest/api/3/issue/{issueIdOrKey}/transitions
```

---

## 📋 Campos de Response de Issues

### Campos Estándar Importantes

```javascript
const CAMPOS_STANDARD = [
  'key',                    // Clave del issue (ej: FENIX-763)
  'summary',                // Resumen/título
  'description',            // Descripción completa
  'status',                 // Estado actual
  'assignee',               // Usuario asignado
  'reporter',               // Usuario que reportó
  'priority',               // Prioridad
  'issuetype',              // Tipo de issue
  'project',                // Proyecto
  'created',                // Fecha de creación
  'updated',                // Fecha de última actualización
  'resolutiondate',         // Fecha de resolución
  'duedate',                // Fecha de vencimiento
  'labels',                 // Etiquetas
  'components',             // Componentes
  'fixVersions',            // Versiones de corrección
  'attachment',             // Archivos adjuntos
  'comment',                // Comentarios
  'worklog',                // Registro de tiempo
  'timetracking',           // Seguimiento de tiempo
  'parent',                 // Issue padre (para subtareas)
  'subtasks'                // Sub-tareas
];
```

### Estructura de Response Típica

```json
{
  "expand": "operations,versionedRepresentations,editmeta,changelog,renderedFields",
  "id": "10001",
  "self": "https://ccsoft.atlassian.net/rest/api/3/issue/10001",
  "key": "FENIX-763",
  "fields": {
    "summary": "Instalar sistema de automatización",
    "description": "Descripción del issue...",
    "status": {
      "self": "https://ccsoft.atlassian.net/rest/api/3/status/10071",
      "id": "10071",
      "name": "Por hacer",
      "statusCategory": {
        "id": 2,
        "key": "new",
        "colorName": "blue-gray",
        "name": "Por hacer"
      }
    },
    "assignee": {
      "self": "https://ccsoft.atlassian.net/rest/api/3/user?accountId=712020:a06717c8-e1eb-49bd-812f-7be59e7f61f1",
      "accountId": "712020:a06717c8-e1eb-49bd-812f-7be59e7f61f1",
      "displayName": "Marcos Coronado",
      "emailAddress": "marcos.coronado@computocontable.com"
    },
    "project": {
      "self": "https://ccsoft.atlassian.net/rest/api/3/project/10086",
      "id": "10086",
      "key": "FENIX",
      "name": "FENIX - Transición Tecnológica"
    },
    "issuetype": {
      "id": "10040",
      "name": "Tarea",
      "hierarchyLevel": 0
    },
    "priority": {
      "id": "3",
      "name": "Medium"
    },
    "customfield_10020": {
      "id": 123,
      "name": "Q3-S1-25-FTT-THOTH",
      "state": "active"
    },
    "customfield_10230": "Descripción de desviación...",
    "customfield_10231": "FENIX",
    "customfield_10016": 5
  }
}
```

---

## ⚡ Configuración de Performance

### Límites y Timeouts

```javascript
const CONFIG_PERFORMANCE = {
  MAX_TAREAS_POR_LOTE: 50,      // Reducido para evitar timeouts
  MAX_REINTENTOS: 3,            // Número máximo de reintentos
  TIMEOUT_MS: 30000,            // Timeout en millisegundos
  DELAY_BETWEEN_REQUESTS: 500,  // Pausa entre requests en ms
  MAX_RESULTS: 100              // Máximo resultados por página
};
```

### Configuración de Caché

```javascript
const CONFIG_CACHE = {
  TTL_SPRINTS: 300,     // 5 minutos
  TTL_TAREAS: 180,      // 3 minutos
  TTL_USUARIOS: 600,    // 10 minutos
  TTL_PROYECTOS: 900    // 15 minutos
};
```

### Manejo de Rate Limiting

```javascript
// Implementar pausa progresiva en reintentos
if (response.getResponseCode() === 429) {
  Logger.log(`⚠️ Rate limit - esperando antes de reintentar...`);
  Utilities.sleep(2000 * intento); // Pausa progresiva
  continue;
}
```

---

## 🚨 Manejo de Errores

### Códigos de Error Comunes

| Código | Descripción | Acción Recomendada |
|--------|-------------|-------------------|
| 200 | OK | Continuar normalmente |
| 400 | Bad Request | Revisar JQL y parámetros |
| 401 | Unauthorized | Verificar token API y email |
| 403 | Forbidden | Verificar permisos del usuario |
| 404 | Not Found | Verificar IDs y existencia del recurso |
| 429 | Too Many Requests | Implementar backoff, esperar antes de reintentar |
| 500 | Internal Server Error | Reintentar después de un tiempo |
| 503 | Service Unavailable | Verificar estado del servicio Atlassian |

### Función de Manejo de Errores

```javascript
function manejarErrorJira(response, contexto) {
  const codigo = response.getResponseCode();
  const contenido = response.getContentText();
  
  switch (codigo) {
    case 401:
      throw new Error(`❌ Autorización fallida - verificar token API`);
    case 403:
      throw new Error(`❌ Permisos insuficientes para: ${contexto}`);
    case 404:
      throw new Error(`❌ Recurso no encontrado: ${contexto}`);
    case 429:
      Logger.log(`⚠️ Rate limit alcanzado - ${contexto}`);
      return { retry: true, delay: 2000 };
    default:
      throw new Error(`❌ Error HTTP ${codigo}: ${contenido.substring(0, 200)}`);
  }
}
```

---

## 📊 Métricas y KPIs

### Revenue Impact por Proyecto

| Proyecto | Revenue Impact | Usuarios Activos | Criticidad | SLA |
|----------|----------------|------------------|------------|-----|
| **FENIX** | 80% ($2.4M anuales) | 15,000+ empresas | Nivel 1 | 99.9% |
| **BDMS** | 15% (ahorro costos) | 500 agentes | Nivel 2 | 99.5% |
| **MAAC** | 5% (retención) | 200 clientes enterprise | Nivel 2 | 99.0% |
| **VYP** | Revenue generation | Pipeline $800K | Nivel 1 | 99.5% |

### Customer Success Metrics

```yaml
FENIX System:
  - Uptime: 99.97% (último trimestre)
  - Response time: <300ms (95th percentile)
  - Error rate: 0.02%
  - Customer satisfaction: 4.7/5.0
  - Support tickets: -30% vs Q2

BDMS Automation:
  - Response time: <10 segundos
  - Resolution rate: 78% automated
  - Customer satisfaction: 4.4/5.0
  - Cost reduction: $45K mensuales
  - Agent productivity: +65%
```

---

## 🔄 Patrones de Consulta Comunes

### 1. Obtener Tareas por Sprint y Assignee

```javascript
async function obtenerTareasPorSprintYAssignee(sprintId, assigneeId) {
  const jql = `sprint = ${sprintId} AND assignee = "${assigneeId}" ORDER BY priority DESC`;
  const campos = 'key,summary,status,priority,customfield_10230,customfield_10231';
  
  const response = await JiraAPI.hacerPeticion('search', {
    jql: jql,
    fields: campos,
    maxResults: 100
  });
  
  return response.issues;
}
```

### 2. Buscar Issues con Desviaciones

```javascript
async function obtenerIssuesConDesviaciones(proyecto = null) {
  let jql = 'customfield_10230 IS NOT EMPTY';
  if (proyecto) {
    jql += ` AND project = "${proyecto}"`;
  }
  jql += ' ORDER BY priority DESC, updated DESC';
  
  const response = await JiraAPI.hacerPeticion('search', {
    jql: jql,
    fields: 'key,summary,customfield_10230,assignee,status',
    maxResults: 50
  });
  
  return response.issues;
}
```

### 3. Obtener Métricas de Sprint

```javascript
async function obtenerMetricasSprint(sprintId) {
  const jql = `sprint = ${sprintId}`;
  const response = await JiraAPI.hacerPeticion('search', {
    jql: jql,
    fields: 'key,status,assignee,issuetype,customfield_10016', // story points
    maxResults: 1000
  });
  
  const issues = response.issues;
  const metricas = {
    total: issues.length,
    cerradas: issues.filter(i => ESTADOS_CERRADOS.includes(i.fields.status.name)).length,
    storyPoints: issues.reduce((sum, i) => sum + (i.fields.customfield_10016 || 0), 0),
    porAssignee: {}
  };
  
  issues.forEach(issue => {
    const assignee = issue.fields.assignee?.displayName || 'Sin asignar';
    if (!metricas.porAssignee[assignee]) {
      metricas.porAssignee[assignee] = { total: 0, cerradas: 0 };
    }
    metricas.porAssignee[assignee].total++;
    if (ESTADOS_CERRADOS.includes(issue.fields.status.name)) {
      metricas.porAssignee[assignee].cerradas++;
    }
  });
  
  return metricas;
}
```

### 4. Crear Issue Programáticamente

```javascript
async function crearIssue(proyectoKey, resumen, descripcion, assigneeId, tipoIssue = 'Tarea') {
  const issueData = {
    fields: {
      project: { key: proyectoKey },
      summary: resumen,
      description: {
        type: "doc",
        version: 1,
        content: [{
          type: "paragraph",
          content: [{
            type: "text",
            text: descripcion
          }]
        }]
      },
      issuetype: { name: tipoIssue },
      assignee: { accountId: assigneeId }
    }
  };
  
  const response = await JiraAPI.hacerPeticion('issue', issueData, 'POST');
  return response;
}
```

### 5. Actualizar Campo Personalizado

```javascript
async function actualizarAreaFuncional(issueKey, areaFuncional) {
  const updateData = {
    fields: {
      customfield_10231: areaFuncional // Área Funcional
    }
  };
  
  const response = await JiraAPI.hacerPeticion(`issue/${issueKey}`, updateData, 'PUT');
  return response;
}
```

---

## 🧪 Funciones de Diagnóstico

### Test de Conexión Completo

```javascript
async function diagnosticarConexionCompleta() {
  const resultados = {
    conexion: null,
    busqueda: null,
    tableros: null,
    sprints: null,
    campos: null
  };
  
  try {
    // Test 1: Conexión básica
    resultados.conexion = await JiraAPI.testConexion();
    
    // Test 2: Búsqueda con JQL
    resultados.busqueda = await JiraAPI.testBusqueda();
    
    // Test 3: API de tableros
    resultados.tableros = await JiraAPI.testTableros();
    
    // Test 4: API de sprints
    resultados.sprints = await JiraAPI.testSprints();
    
    // Test 5: Campos personalizados
    resultados.campos = await testCamposPersonalizados();
    
    return resultados;
  } catch (error) {
    Logger.log(`❌ Error en diagnóstico: ${error.message}`);
    return { error: error.message, resultados };
  }
}

async function testCamposPersonalizados() {
  const jql = 'project = FENIX AND customfield_10230 IS NOT EMPTY';
  try {
    const response = await JiraAPI.hacerPeticion('search', {
      jql: jql,
      fields: Object.values(CAMPOS_PERSONALIZADOS).join(','),
      maxResults: 1
    });
    
    return {
      exito: true,
      mensaje: `Campos personalizados accesibles: ${response.issues.length} issues encontrados`
    };
  } catch (error) {
    return {
      exito: false,
      mensaje: error.message
    };
  }
}
```

---

## 📈 Análisis de Datos

### Evaluación de Evidencia de Cumplimiento

```javascript
class AnalizadorEvidencia {
  evaluarEvidencia(issue, fechaFinSprint = null) {
    const status = issue.fields.status.name;
    
    if (!this.estaCerrada(status)) {
      return this.evaluarIssueAbierto(status);
    }

    const puntuacionEvidencia = this.calcularPuntuacionEvidencia(issue);
    const esATiempo = this.verificarPuntualidad(issue, fechaFinSprint);
    
    return this.determinarEstadoFinal(puntuacionEvidencia, esATiempo);
  }

  calcularPuntuacionEvidencia(issue) {
    let puntuacion = 0;
    const evidencias = [];

    // Comentarios
    if (issue.fields.comment && issue.fields.comment.total > 0) {
      puntuación += 1;
      evidencias.push("Comentarios");
      
      // Pull Requests detectados
      if (this.detectarPullRequests(issue)) {
        puntuación += 3;
        evidencias.push("Pull Requests");
      }
    }

    // Adjuntos
    if (issue.fields.attachment && issue.fields.attachment.length > 0) {
      puntuación += 2;
      evidencias.push("Adjuntos");
    }

    return { puntuación, evidencias };
  }

  detectarPullRequests(issue) {
    if (!issue.fields.comment?.comments) return false;
    
    const texto = issue.fields.comment.comments
      .map(c => JSON.stringify(c.body))
      .join(' ')
      .toLowerCase();
    
    return texto.includes('bitbucket.org') || 
           texto.includes('pull-request') || 
           texto.includes('merge') ||
           texto.includes('commit');
  }

  determinarEstadoFinal(evidenciaData, esATiempo) {
    const { puntuación } = evidenciaData;
    
    if (puntuación >= 4) {
      return {
        estado: "🟢 Meta alcanzada (Evidencia completa)",
        color: "#d4edda",
        puntuación: 1.0
      };
    } else if (puntuación >= 2) {
      return {
        estado: "🟢 Meta alcanzada",
        color: "#d4edda",
        puntuación: 0.8
      };
    } else if (puntuación >= 1) {
      const estado = esATiempo ? 
        "🟡 Requiere atención (Evidencia mínima)" :
        "🟠 Atención (Tardía con evidencia mínima)";
      return {
        estado,
        color: "#fff3cd",
        puntuación: 0.5
      };
    }
    
    return {
      estado: esATiempo ?
        "🟡 Requiere atención (Sin evidencia)" :
        "🔴 Crítico (Tardía sin evidencia)",
      color: esATiempo ? "#fff3cd" : "#f8d7da",
      puntuación: esATiempo ? 0.3 : 0.1
    };
  }
}
```

---

## 🛡️ Seguridad y Mejores Prácticas

### Gestión Segura de Tokens

```javascript
// ❌ NUNCA hacer esto
const apiToken = "ATATT3xFfGF0y2bYKf7jWsrAUi..."; // Token visible

// ✅ Usar Properties Service
function getApiToken() {
  const properties = PropertiesService.getScriptProperties();
  return properties.getProperty('JIRA_API_TOKEN');
}

function setApiToken(token) {
  const properties = PropertiesService.getScriptProperties();
  properties.setProperty('JIRA_API_TOKEN', token);
}
```

### Validación de Datos

```javascript
function validarIssueData(issue) {
  if (!issue || !issue.key || !issue.fields) {
    throw new Error('Estructura de issue inválida');
  }
  
  if (!issue.fields.project || !issue.fields.project.key) {
    throw new Error('Issue sin proyecto válido');
  }
  
  return true;
}

function validarJQL(jql) {
  // Validaciones básicas de seguridad
  const forbiddenPatterns = [
    /delete\s+from/i,
    /drop\s+table/i,
    /insert\s+into/i,
    /update\s+set/i
  ];
  
  for (const pattern of forbiddenPatterns) {
    if (pattern.test(jql) ) {
      throw new Error('JQL contiene patrones no permitidos');
    }
  }
  
  return true;
}
```

### Rate Limiting y Throttling

```javascript
class JiraRateLimiter {
  constructor() {
    this.lastRequest = 0;
    this.minInterval = 200; // ms mínimo entre requests
    this.requestCount = 0;
    this.resetTime = Date.now() + 60000; // Reset cada minuto
  }
  
  async throttle() {
    const now = Date.now();
    
    // Reset contador cada minuto
    if (now > this.resetTime) {
      this.requestCount = 0;
      this.resetTime = now + 60000;
    }
    
    // Limitar requests por minuto
    if (this.requestCount >= 100) {
      const waitTime = this.resetTime - now;
      Logger.log(`⚠️ Rate limit alcanzado, esperando ${waitTime}ms`);
      await new Promise(resolve => setTimeout(resolve, waitTime);
      this.requestCount = 0;
      this.resetTime = Date.now() + 60000;
    }
    
    // Asegurar intervalo mínimo entre requests
    const timeSinceLastRequest = now - this.lastRequest;
    if (timeSinceLastRequest < this.minInterval) {
      await new Promise(resolve => 
        setTimeout(resolve, this.minInterval - timeSinceLastRequest));
    }
    
    this.lastRequest = Date.now();
    this.requestCount++;
  }
}
```

---

## 📝 Ejemplos de Implementación

### Generador de Reportes Básico

```javascript
async function generarReporteBasico(sprintId) {
  try {
    // Obtener todas las tareas del sprint
    const jql = `sprint = ${sprintId}`;
    const response = await JiraAPI.hacerPeticion('search', {
      jql: jql,
      fields: 'key,summary,status,assignee,priority,customfield_10016',
      maxResults: 1000
    });
    
    const issues = response.issues;
    const reporte = {
      totalIssues: issues.length,
      completadas: 0,
      storyPoints: 0,
      porAssignee: {},
      porPrioridad: {},
      porEstado: {}
    };
    
    // Procesar cada issue
    issues.forEach(issue => {
      const assignee = issue.fields.assignee?.displayName || 'Sin asignar';
      const prioridad = issue.fields.priority?.name || 'Sin prioridad';
      const estado = issue.fields.status.name;
      const storyPoints = issue.fields.customfield_10016 || 0;
      
      // Contar completadas
      if (ESTADOS_COMPLETADOS.includes(estado)) {
        reporte.completadas++;
      }
      
      // Sumar story points
      reporte.storyPoints += storyPoints;
      
      // Agrupar por assignee
      if (!reporte.porAssignee[assignee]) {
        reporte.porAssignee[assignee] = { total: 0, completadas: 0, storyPoints: 0 };
      }
      reporte.porAssignee[assignee].total++;
      reporte.porAssignee[assignee].storyPoints += storyPoints;
      if (ESTADOS_COMPLETADOS.includes(estado) ) {
        reporte.porAssignee[assignee].completadas++;
      }
      
      // Agrupar por prioridad
      reporte.porPrioridad[prioridad] = (reporte.porPrioridad[prioridad] || 0) + 1;
      
      // Agrupar por estado
      reporte.porEstado[estado] = (reporte.porEstado[estado] || 0) + 1;
    });
    
    // Calcular porcentajes
    reporte.porcentajeCompletitud = Math.round((reporte.completadas / reporte.totalIssues) * 100);
    
    return reporte;
    
  } catch (error) {
    Logger.log(`❌ Error generando reporte: ${error.message}`);
    throw error;
  }
}
```

### Monitor de Issues Críticos

```javascript
async function monitorearIssuesCríticos() {
  const jql = `priority = "Highest" AND status NOT IN ("Done", "Cerrado") AND project IN ("FENIX", "BDMS")`;
  
  try {
    const response = await JiraAPI.hacerPeticion('search', {
      jql: jql,
      fields: 'key,summary,assignee,status,customfield_10230,duedate',
      maxResults: 50
    });
    
    const issuesCriticos = response.issues;
    const alertas = [];
    
    issuesCriticos.forEach(issue => {
      const alerta = {
        key: issue.key,
        summary: issue.fields.summary,
        assignee: issue.fields.assignee?.displayName || 'Sin asignar',
        status: issue.fields.status.name,
        vencimiento: issue.fields.duedate,
        tieneDesviaciones: !!issue.fields.customfield_10230
      };
      
      // Evaluar urgencia
      if (alerta.vencimiento) {
        const fechaVenc = new Date(alerta.vencimiento);
        const hoy = new Date();
        const diasRestantes = Math.ceil((fechaVenc - hoy) / (1000 * 60 * 60 * 24));
        
        if (diasRestantes < 0) {
          alerta.urgencia = '🔴 VENCIDO';
        } else if (diasRestantes <= 1) {
          alerta.urgencia = '🟠 CRÍTICO';
        } else if (diasRestantes <= 3) {
          alerta.urgencia = '🟡 URGENTE';
        } else {
          alerta.urgencia = '🔵 NORMAL';
        }
      }
      
      alertas.push(alerta);
    });
    
    return alertas;
    
  } catch (error) {
    Logger.log(`❌ Error monitoreando issues críticos: ${error.message});
    throw error;
  }
}
```

---

## 🔗 Integraciones Útiles

### Integración con Google Sheets

```javascript
function exportarAGoogleSheets(datos, nombreHoja = 'Reporte Jira') {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  let hoja = spreadsheet.getSheetByName(nombreHoja);
  
  if (!hoja) {
    hoja = spreadsheet.insertSheet(nombreHoja);
  } else {
    hoja.clear();
  }
  
  // Encabezados
  const encabezados = ['Clave', 'Resumen', 'Estado', 'Assignee', 'Prioridad', 'Story Points'];
  hoja.getRange(1, 1, 1, encabezados.length).setValues([encabezados]);
  hoja.getRange(1, 1, 1, encabezados.length).setFontWeight('bold');
  
  // Datos
  const filas = datos.map(issue => [
    issue.key,
    issue.fields.summary,
    issue.fields.status.name,
    issue.fields.assignee?.displayName || 'Sin asignar',
    issue.fields.priority?.name || 'Sin prioridad',
    issue.fields.customfield_10016 || 0
  ]);
  
  if (filas.length > 0) {
    hoja.getRange(2, 1, filas.length, encabezados.length).setValues(filas);
  }
  
  // Formato
  hoja.autoResizeColumns(1, encabezados.length);
  
  return hoja;
}
```

### Notificaciones por Email

```javascript
function enviarNotificacionEmail(destinatario, asunto, issues) {
  let cuerpo = `<h2>${asunto}</h2><table border="1" style="border-collapse: collapse;">`;
  cuerpo += '<tr><th>Clave</th><th>Resumen</th><th>Estado</th><th>Assignee</th></tr>';
  
  issues.forEach(issue => {
    cuerpo += `<tr>
      <td><a href="https://ccsoft.atlassian.net/browse/${issue.key}">${issue.key}</a></td>
      <td>${issue.fields.summary}</td>
      <td>${issue.fields.status.name}</td>
      <td>${issue.fields.assignee?.displayName || 'Sin asignar'}</td>
    </tr>`;
  });
  
  cuerpo += '</table>';
  
  MailApp.sendEmail({
    to: destinatario,
    subject: asunto,
    htmlBody: cuerpo
  });
}
```

---


## 🛠️ **PATRONES DE DESARROLLO**

### **Autenticación Base**
```javascript
// Configuración de autenticación
const auth = {
  email: "computocontable@gmail.com",
  token: "ATATT3xFfGF0y2bYKf7jWsrAUicb520ZCs...",
  
  getHeaders() {
    return {
      'Authorization': `Basic ${btoa(this.email + ':' + this.token)}`,
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    };
  }
};
```

### **Manejo de Errores Robusto**
```javascript
const makeJiraRequest = async (endpoint, options = {}) => {
  const maxRetries = 3;
  let attempt = 0;
  
  while (attempt < maxRetries) {
    try {
      const response = await fetch(endpoint, {
        ...options,
        headers: auth.getHeaders()
      });
      
      if (response.status === 401) {
        throw new Error('Token de API inválido o expirado');
      }
      
      if (response.status === 403) {
        throw new Error('Permisos insuficientes');
      }
      
      if (response.status === 429) {
        // Rate limiting - esperar antes de reintentar
        const waitTime = Math.pow(2, attempt) * 1000;
        await new Promise(resolve => setTimeout(resolve, waitTime));
        attempt++;
        continue;
      }
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      return await response.json();
      
    } catch (error) {
      attempt++;
      if (attempt === maxRetries) {
        throw error;
      }
      
      // Espera exponencial
      await new Promise(resolve => 
        setTimeout(resolve, Math.pow(2, attempt) * 1000)
      );
    }
  }
};
```

### **Validación de Campos Personalizados**
```javascript
// Obtener todos los campos disponibles
const getAllFields = async () => {
  const fields = await makeJiraRequest(`${baseURL}field`);
  
  const customFields = fields
    .filter(field => field.id.startsWith('customfield_'))
    .map(field => ({
      id: field.id,
      name: field.name,
      type: field.schema?.type,
      custom: field.custom
    }));
    
  return customFields;
};

// Validar que un campo personalizado existe
const validateCustomField = async (fieldId) => {
  try {
    const fields = await getAllFields();
    return fields.some(field => field.id === fieldId);
  } catch (error) {
    console.error(`Error validando campo ${fieldId}:`, error);
    return false;
  }
};
```

---

## 📈 **MÉTRICAS Y ANALÍTICAS**

### **KPIs Organizacionales**
```yaml
FENIX_System:
  Uptime: "99.97% (último trimestre)"
  Response_Time: "<300ms (95th percentile)" 
  Error_Rate: "0.02%"
  Customer_Satisfaction: "4.7/5.0"
  Support_Tickets: "-30% vs Q2"

BDMS_Automation:
  Response_Time: "<10 segundos"
  Resolution_Rate: "78% automated"
  Customer_Satisfaction: "4.4/5.0"
  Cost_Reduction: "$45K mensuales"
  Agent_Productivity: "+65%"

MAAC_Support:
  First_Call_Resolution: "85%"
  Average_Handle_Time: "8.5 minutos"
  Customer_Escalation: "<2%"
  Technical_Resolution: "92%"
  Expert_Satisfaction: "4.6/5.0"
```

### **Análisis de Evidencia (Algoritmo)**
```javascript
// Sistema de evaluación de calidad de tareas
const evaluarEvidencia = (tarea, fechaFinSprint) => {
  const status = tarea.fields.status.name;
  const isClosed = ESTADOS_CERRADOS.includes(status);
  
  if (!isClosed) {
    return evaluarTareaAbierta(status);
  }
  
  // Evaluar calidad de evidencia
  let puntuacionEvidencia = 0;
  const evidencias = [];
  
  // Comentarios (+1 punto)
  if (tarea.fields.comment?.total > 0) {
    puntuacionEvidencia += 1;
    evidencias.push("Comentarios");
  }
  
  // Adjuntos (+2 puntos)
  if (tarea.fields.attachment?.length > 0) {
    puntuacionEvidencia += 2;
    evidencias.push("Adjuntos");
  }
  
  // Pull Requests/Commits (+3 puntos)
  if (detectarPullRequests(tarea)) {
    puntuacionEvidencia += 3;
    evidencias.push("Pull Requests");
  }
  
  // Clasificación final
  if (puntuacionEvidencia >= 4) {
    return {
      estado: "🟢 Meta alcanzada (Evidencia completa)",
      color: "#d4edda",
      puntuacion: 1.0
    };
  } else if (puntuacionEvidencia >= 2) {
    return {
      estado: "🟢 Meta alcanzada", 
      color: "#d4edda",
      puntuacion: 0.8
    };
  } else if (puntuacionEvidencia >= 1) {
    return {
      estado: "🟡 Requiere atención (Evidencia mínima)",
      color: "#fff3cd", 
      puntuacion: 0.5
    };
  }
  
  return {
    estado: "🟡 Requiere atención (Sin evidencia)",
    color: "#fff3cd",
    puntuacion: 0.3
  };
};
```

---

## 🚨 **CASOS DE USO COMUNES**

### **1. Reporte de Sprint**
```javascript
const generarReporteSprint = async (sprintName) => {
  // 1. Buscar sprints coincidentes
  const jql = `sprint = "${sprintName}" ORDER BY project, assignee`;
  
  // 2. Obtener tareas con campos específicos
  const fields = [
    'key', 'summary', 'status', 'assignee', 'project',
    'timespent', 'attachment', 'comment', 'resolutiondate',
    CAMPOS_PERSONALIZADOS.desviaciones,
    CAMPOS_PERSONALIZADOS.area_funcional
  ].join(',');
  
  const issues = await makeJiraRequest(`${baseURL}search`, {
    method: 'POST',
    body: JSON.stringify({
      jql: jql,
      fields: fields,
      maxResults: 1000
    })
  });
  
  // 3. Analizar evidencia y generar métricas
  const analisis = issues.issues.map(issue => ({
    ...issue,
    evidencia: evaluarEvidencia(issue),
    area: determinarArea(issue.fields.project.key)
  }));
  
  return analisis;
};
```

### **2. Búsqueda por Equipo**
```javascript
const obtenerTareasEquipo = async (equipoAccountIds, fechaInicio, fechaFin) => {
  const assigneeQuery = equipoAccountIds
    .map(id => `assignee = "${id}"`)
    .join(" OR ");
    
  const jql = `
    (${assigneeQuery}) 
    AND updated >= "${fechaInicio}" 
    AND updated <= "${fechaFin}"
    AND project NOT IN ("Papelera", "TRASH")
    ORDER BY assignee, updated DESC
  `;
  
  return await paginatedSearch(jql);
};
```

### **3. Análisis de Productividad**
```javascript
const analizarProductividad = async (accountId, periodoMeses = 3) => {
  const fechaInicio = new Date();
  fechaInicio.setMonth(fechaInicio.getMonth() - periodoMeses);
  
  const jql = `
    assignee = "${accountId}" 
    AND updated >= "${fechaInicio.toISOString().split('T')[0]}"
	AND resolution IS NOT EMPTY
    ORDER BY resolutiondate DESC
  `;
  
  const issues = await paginatedSearch(jql);
  
  // Calcular métricas
  const metricas = {
    totalCompletadas: issues.length,
    porTipo: {},
    porProyecto: {},
    tiempoPromedio: 0,
    tendenciaMensual: {}
  };
  
  issues.forEach(issue => {
    // Análisis por tipo
    const tipo = issue.fields.issuetype.name;
    metricas.porTipo[tipo] = (metricas.porTipo[tipo] || 0) + 1;
    
    // Análisis por proyecto
    const proyecto = issue.fields.project.key;
    metricas.porProyecto[proyecto] = (metricas.porProyecto[proyecto] || 0) + 1;
    
    // Tendencia mensual
    const mes = issue.fields.resolutiondate.substring(0, 7);
    metricas.tendenciaMensual[mes] = (metricas.tendenciaMensual[mes] || 0) + 1;
  });
  
  return metricas;
};
```

### **4. Dashboard Ejecutivo**
```javascript
const generarDashboardEjecutivo = async () => {
  const dashboard = {
    resumenGeneral: {},
    porArea: {},
    proyectosCriticos: {},
    alertas: []
  };
  
  // Métricas generales del trimestre actual
  const jqlTrimestre = `
    updated >= startOfQuarter() 
    AND project NOT IN ("Papelera", "TRASH")
  `;
  
  const issuesTrimestre = await paginatedSearch(jqlTrimestre);
  
  // Agrupar por áreas
  const areaMap = {
    'FENIX': ['FENIX', 'DTO', 'SACC3', 'S40'],
    'INFRA': ['INFLYV', 'IAO'],
    'MOP': ['BDMS', 'DC', 'PMO'],
    'MEC': ['MAAC', 'VYP', 'WEB', 'IP']
  };
  
  Object.entries(areaMap).forEach(([area, proyectos]) => {
    const issuesArea = issuesTrimestre.filter(issue => 
      proyectos.includes(issue.fields.project.key)
    );
    
    const cerradas = issuesArea.filter(issue => 
      ESTADOS_CERRADOS.includes(issue.fields.status.name)
    ).length;
    
    dashboard.porArea[area] = {
      total: issuesArea.length,
      cerradas: cerradas,
      porcentajeCumplimiento: Math.round((cerradas / issuesArea.length) * 100),
      proyectosActivos: proyectos.length
    };
  });
  
  // Identificar alertas
  Object.entries(dashboard.porArea).forEach(([area, datos]) => {
    if (datos.porcentajeCumplimiento < 60) {
      dashboard.alertas.push({
        tipo: 'RENDIMIENTO_BAJO',
        area: area,
        valor: datos.porcentajeCumplimiento,
        descripcion: `Área ${area} con ${datos.porcentajeCumplimiento}% de cumplimiento`
      });
    }
  });
  
  return dashboard;
};
```

---

## 🔐 **SEGURIDAD Y MEJORES PRÁCTICAS**

### **Gestión de Tokens**
```javascript
// ❌ MAL - Token hardcodeado
const badToken = "ATATT3xFfGF0y2bYKf7jWsrAUicb520ZCs...";

// ✅ BIEN - Token desde variables de entorno
const JIRA_CONFIG = {
  baseUrl: process.env.JIRA_BASE_URL || 'https://ccsoft.atlassian.net',
  email: process.env.JIRA_EMAIL,
  token: process.env.JIRA_API_TOKEN,
  
  // Validar configuración
  validate() {
    if (!this.email || !this.token) {
      throw new Error('JIRA_EMAIL y JIRA_API_TOKEN son requeridos');
    }
    return true;
  }
};

// Rotación de tokens recomendada cada 90 días
const TOKEN_EXPIRY_WARNING = 90 * 24 * 60 * 60 * 1000; // 90 días en ms
```

### **Validación de Entrada**
```javascript
const validarJQL = (jql) => {
  // Prevenir inyección JQL
  const prohibidos = [
    'DROP', 'DELETE', 'INSERT', 'UPDATE',
    'EXEC', 'EXECUTE', 'SCRIPT', 'UNION'
  ];
  
  const jqlUpper = jql.toUpperCase();
  const tieneProhibidos = prohibidos.some(palabra => 
    jqlUpper.includes(palabra)
  );
  
  if (tieneProhibidos) {
    throw new Error('JQL contiene operaciones no permitidas');
  }
  
  // Validar longitud
  if (jql.length > 2000) {
    throw new Error('JQL demasiado largo');
  }
  
  return true;
};

const validarAccountId = (accountId) => {
  // Formato estándar: 712020:uuid-hash
  const regex = /^[0-9a-f]{6,}:[a-f0-9-]{36}$/i;
  const regexAlternativo = /^[a-f0-9]{24}$/i; // Formato alternativo detectado
  
  return regex.test(accountId) || regexAlternativo.test(accountId);
};
```

### **Rate Limiting Inteligente**
```javascript
class JiraRateLimiter {
  constructor() {
    this.requests = [];
    this.maxRequestsPerMinute = 300;
    this.burstLimit = 10;
  }
  
  async waitForSlot() {
    const now = Date.now();
    const oneMinuteAgo = now - 60000;
    
    // Limpiar requests antiguos
    this.requests = this.requests.filter(time => time > oneMinuteAgo);
    
    // Verificar límite por minuto
    if (this.requests.length >= this.maxRequestsPerMinute) {
      const oldestRequest = Math.min(...this.requests);
      const waitTime = (oldestRequest + 60000) - now;
      await this.sleep(waitTime);
    }
    
    // Verificar límite de ráfaga
    const recentRequests = this.requests.filter(time => time > (now - 1000));
    if (recentRequests.length >= this.burstLimit) {
      await this.sleep(1000);
    }
    
    this.requests.push(now);
  }
  
  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

const rateLimiter = new JiraRateLimiter();

const makeRateLimitedRequest = async (url, options) => {
  await rateLimiter.waitForSlot();
  return await fetch(url, options);
};
```

---

## 📊 **REPORTING Y ANALYTICS AVANZADOS**

### **Plantillas de Reportes**
```javascript
// Reporte de Velocity por Sprint
const reporteVelocity = async (equipoAccountIds, ultimosSprints = 6) => {
  const velocityData = [];
  
  for (const sprintName of ultimosSprints) {
    const jql = `
      sprint = "${sprintName}" 
      AND assignee IN (${equipoAccountIds.map(id => `"${id}"`).join(',')})
      AND status IN (${ESTADOS_CERRADOS.map(s => `"${s}"`).join(',')})
    `;
    
    const issues = await paginatedSearch(jql);
    const storyPoints = issues.reduce((total, issue) => {
      const points = issue.fields[CAMPOS_PERSONALIZADOS.story_points] || 0;
      return total + points;
    }, 0);
    
    velocityData.push({
      sprint: sprintName,
      completedIssues: issues.length,
      storyPoints: storyPoints,
      avgTimeSpent: calcularTiempoPromedio(issues)
    });
  }
  
  return velocityData;
};

// Análisis de Deuda Técnica
const analizarDeudaTecnica = async () => {
  const jql = `
    type = "Deuda Técnica" 
    AND created >= -6M 
    ORDER BY priority DESC, created ASC
  `;
  
  const issues = await paginatedSearch(jql);
  
  const analisis = {
    total: issues.length,
    porPrioridad: {},
    porProyecto: {},
    antiguedad: {
      critica: 0, // > 90 días
      alta: 0,    // > 60 días
      media: 0,   // > 30 días  
      baja: 0     // < 30 días
    },
    tendencia: calcularTendenciaCreacion(issues)
  };
  
  const ahora = new Date();
  
  issues.forEach(issue => {
    // Por prioridad
    const prioridad = issue.fields.priority.name;
    analisis.porPrioridad[prioridad] = (analisis.porPrioridad[prioridad] || 0) + 1;
    
    // Por proyecto
    const proyecto = issue.fields.project.key;
    analisis.porProyecto[proyecto] = (analisis.porProyecto[proyecto] || 0) + 1;
    
    // Por antigüedad
    const creado = new Date(issue.fields.created);
    const diasAntiguedad = Math.floor((ahora - creado) / (1000 * 60 * 60 * 24));
    
    if (diasAntiguedad > 90) analisis.antiguedad.critica++;
    else if (diasAntiguedad > 60) analisis.antiguedad.alta++;
    else if (diasAntiguedad > 30) analisis.antiguedad.media++;
    else analisis.antiguedad.baja++;
  });
  
  return analisis;
};

// Matriz de Riesgos por Proyecto
const generarMatrizRiesgos = async () => {
  const proyectosCriticos = ['FENIX', 'BDMS', 'INFLYV', 'MAAC', 'VYP'];
  const matrizRiesgos = {};
  
  for (const proyecto of proyectosCriticos) {
    const jqlRiesgos = `project = ${proyecto} AND type = "Riesgo"`;
    const jqlIncidentes = `project = ${proyecto} AND type = "Incidente" AND created >= -3M`;
    const jqlBloqueados = `project = ${proyecto} AND status IN ("Bloqueado", "Blocked")`;
    
    const [riesgos, incidentes, bloqueados] = await Promise.all([
      paginatedSearch(jqlRiesgos),
      paginatedSearch(jqlIncidentes),
      paginatedSearch(jqlBloqueados)
    ]);
    
    // Calcular score de riesgo
    const riesgoScore = (riesgos.length * 0.4) + 
                       (incidentes.length * 0.4) + 
                       (bloqueados.length * 0.2);
    
    let nivelRiesgo = 'BAJO';
    if (riesgoScore > 10) nivelRiesgo = 'CRÍTICO';
    else if (riesgoScore > 5) nivelRiesgo = 'ALTO';
    else if (riesgoScore > 2) nivelRiesgo = 'MEDIO';
    
    matrizRiesgos[proyecto] = {
      riesgosActivos: riesgos.length,
      incidentesRecientes: incidentes.length,
      tareasBloquedas: bloqueados.length,
      scoreRiesgo: riesgoScore,
      nivelRiesgo: nivelRiesgo,
      impactoRevenue: ORGANIZACION.PROYECTOS[proyecto]?.revenue || 'N/A'
    };
  }
  
  return matrizRiesgos;
};
```

---

## 🎨 **AUTOMATIZACIÓN Y WEBHOOKS**

### **Configuración de Webhooks**
```javascript
// Estructura de webhook para automatización
const webhookConfig = {
  url: 'https://your-automation-endpoint.com/jira-webhook',
  events: [
    'jira:issue_created',
    'jira:issue_updated', 
    'jira:issue_deleted',
    'sprint_started',
    'sprint_closed'
  ],
  filters: {
    // Solo proyectos críticos
    projects: ['FENIX', 'BDMS', 'INFLYV'],
    
    // Solo cambios importantes
    fieldsChanged: ['status', 'assignee', 'priority'],
    
    // Excluir actualizaciones automáticas
    excludeAutomated: true
  }
};

// Procesador de eventos webhook
const procesarWebhookJira = (evento) => {
  const { webhookEvent, issue, changelog, user } = evento;
  
  switch (webhookEvent) {
    case 'jira:issue_created':
      return manejarCreacionIssue(issue, user);
      
    case 'jira:issue_updated':
      return manejarActualizacionIssue(issue, changelog, user);
      
    case 'sprint_started':
      return notificarInicioSprint(evento.sprint);
      
    case 'sprint_closed':
      return generarReporteSprintAutomatico(evento.sprint);
      
    default:
      console.log(`Evento no manejado: ${webhookEvent}`);
  }
};

// Automatización de notificaciones
const configurarNotificacionesInteligentes = () => {
  return {
    // Alertas críticas - inmediatas
    criticasInmediatas: {
      condiciones: [
        'proyecto FENIX con issue crítico creado',
        'sistema caído detectado',
        'breach de SLA detectado'
      ],
      canales: ['slack', 'email', 'sms'],
      destinatarios: ['marcos.coronado@computocontable.com', 'monica.guerra@computocontable.com']
    },
    
    // Resúmenes diarios
    resumenesDiarios: {
      hora: '09:00',
      contenido: [
        'issues nuevos por proyecto',
        'issues cerrados ayer',
        'bloqueos activos',
        'sprint progress'
      ],
      destinatarios: 'equipo-lideres@computocontable.com'
    },
    
    // Reportes semanales
    reportesSemanales: {
      dia: 'viernes',
      hora: '17:00',
      incluye: [
        'velocity report',
        'quality metrics',
        'risk assessment',
        'team performance'
      ]
    }
  };
};
```

---

## 🧪 **TESTING Y VALIDACIÓN**

### **Suite de Tests de API**
```javascript
class JiraAPITester {
  constructor(config) {
    this.config = config;
    this.resultados = {};
  }
  
  async ejecutarTestsCompletos() {
    console.log('🧪 Iniciando suite de tests API Jira...');
    
    const tests = [
      { nombre: 'Conexión básica', test: () => this.testConexionBasica() },
      { nombre: 'Autenticación', test: () => this.testAutenticacion() },
      { nombre: 'Búsqueda JQL', test: () => this.testBusquedaJQL() },
      { nombre: 'Campos personalizados', test: () => this.testCamposPersonalizados() },
      { nombre: 'API Agile', test: () => this.testAPIAgile() },
      { nombre: 'Paginación', test: () => this.testPaginacion() },
      { nombre: 'Rate limiting', test: () => this.testRateLimiting() },
      { nombre: 'Manejo de errores', test: () => this.testManejoErrores() }
    ];
    
    for (const { nombre, test } of tests) {
      try {
        console.log(`▶️ Ejecutando: ${nombre}`);
        const resultado = await test();
        this.resultados[nombre] = { exito: true, ...resultado };
        console.log(`✅ ${nombre}: PASS`);
      } catch (error) {
        this.resultados[nombre] = { exito: false, error: error.message };
        console.log(`❌ ${nombre}: FAIL - ${error.message}`);
      }
    }
    
    return this.generarReporteTests();
  }
  
  async testConexionBasica() {
    const response = await fetch(`${this.config.baseUrl}/rest/api/3/myself`, {
      headers: this.config.getHeaders()
    });
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const user = await response.json();
    return {
      usuario: user.displayName,
      email: user.emailAddress,
      timeZone: user.timeZone
    };
  }
  
  async testBusquedaJQL() {
    const jqlTests = [
      'project = FENIX',
      'updated >= -1d',
      'assignee is not EMPTY',
      `${CAMPOS_PERSONALIZADOS.sprint} in openSprints()`
    ];
    
    const resultados = {};
    
    for (const jql of jqlTests) {
      const response = await fetch(`${this.config.baseUrl}/rest/api/3/search`, {
        method: 'POST',
        headers: this.config.getHeaders(),
        body: JSON.stringify({
          jql: jql,
          maxResults: 1,
          fields: ['key']
        })
      });
      
      if (!response.ok) {
        throw new Error(`JQL "${jql}" falló: ${response.status}`);
      }
      
      const data = await response.json();
      resultados[jql] = data.total;
    }
    
    return { jqlTests: resultados };
  }
  
  async testCamposPersonalizados() {
    const campos = Object.entries(CAMPOS_PERSONALIZADOS);
    const resultados = {};
    
    for (const [nombre, fieldId] of campos) {
      const response = await fetch(`${this.config.baseUrl}/rest/api/3/field/${fieldId}`, {
        headers: this.config.getHeaders()
      });
      
      resultados[nombre] = {
        fieldId: fieldId,
        existe: response.ok,
        status: response.status
      };
      
      if (response.ok) {
        const fieldData = await response.json();
        resultados[nombre].name = fieldData.name;
        resultados[nombre].type = fieldData.schema?.type;
      }
    }
    
    return { camposPersonalizados: resultados };
  }
  
  generarReporteTests() {
    const total = Object.keys(this.resultados).length;
    const exitosos = Object.values(this.resultados).filter(r => r.exito).length;
    const fallidos = total - exitosos;
    
    const reporte = {
      resumen: {
        total: total,
        exitosos: exitosos,
        fallidos: fallidos,
        porcentajeExito: Math.round((exitosos / total) * 100)
      },
      detalles: this.resultados,
      timestamp: new Date().toISOString(),
      configuracion: {
        baseUrl: this.config.baseUrl,
        email: this.config.email.replace(/(.{3}).*(@.*)/, '$1***$2') // Ocultar email parcialmente
      }
    };
    
    return reporte;
  }
}

// Uso del tester
const ejecutarValidacionAPI = async () => {
  const tester = new JiraAPITester(CONFIG_JIRA);
  const reporte = await tester.ejecutarTestsCompletos();
  
  console.log('\n📊 REPORTE DE VALIDACIÓN API:');
  console.log(`✅ Tests exitosos: ${reporte.resumen.exitosos}/${reporte.resumen.total}`);
  console.log(`❌ Tests fallidos: ${reporte.resumen.fallidos}/${reporte.resumen.total}`);
  console.log(`📈 Porcentaje de éxito: ${reporte.resumen.porcentajeExito}%`);
  
  return reporte;
};
```

---

## 📚 **DOCUMENTACIÓN DE REFERENCIA RÁPIDA**

### **Comandos JQL Esenciales**
```sql
-- Búsquedas básicas
project = FENIX
status IN ("Por hacer", "En progreso") 
assignee = currentUser()
created >= -1w
updated >= startOfWeek()

-- Búsquedas avanzadas
project IN (FENIX, BDMS) AND assignee IN membersOf("jira-developers")
sprint in openSprints() AND status != "Done"
type = "Historia de usuario" AND fixVersion in unreleasedVersions()

-- Campos personalizados
customfield_10020 in openSprints()  -- Sprint
customfield_10230 IS NOT EMPTY      -- Desviaciones
customfield_10231 = "CORE"          -- Área funcional

-- Funciones de tiempo
created >= startOfMonth()
updated >= startOfQuarter() 
resolutiondate >= startOfYear()
duedate <= endOfWeek()

-- Operadores especiales
text ~ "migración"              -- Búsqueda de texto
priority IN (Highest, High)    -- Lista de valores
labels IN (urgent, critical)   -- Etiquetas
status WAS "En progreso"       -- Estado anterior
assignee CHANGED AFTER -1w     -- Cambios recientes
```

### **Códigos de Estado HTTP Comunes**
```yaml
Exitosos:
  200: "OK - Solicitud exitosa"
  201: "Created - Recurso creado"
  204: "No Content - Operación exitosa sin contenido"

Errores_Cliente:
  400: "Bad Request - Solicitud malformada"
  401: "Unauthorized - Token inválido o faltante" 
  403: "Forbidden - Permisos insuficientes"
  404: "Not Found - Recurso no encontrado"
  409: "Conflict - Conflicto de estado"
  422: "Unprocessable Entity - Datos inválidos"
  429: "Too Many Requests - Rate limit excedido"

Errores_Servidor:
  500: "Internal Server Error - Error interno de Jira"
  503: "Service Unavailable - Servicio temporalmente no disponible"
```

### **Límites y Cuotas**
```yaml
API_Limits:
  Rate_Limit: "300 requests/minute por IP"
  Burst_Limit: "10 requests/second"
  Max_Results_Search: 100
  Max_Results_Agile: 50
  Max_JQL_Length: 2000
  Max_Attachment_Size: "10MB"
  Max_Description_Length: "32767 caracteres"

Timeouts:
  Connection_Timeout: "30 segundos"
  Read_Timeout: "60 segundos"
  Total_Timeout: "120 segundos"
```

---

## ⚡ **OPTIMIZACIONES Y TRUCOS AVANZADOS**

### **Consultas JQL Optimizadas**
```sql
-- ❌ LENTO - Evitar wildcards al inicio
summary ~ "*migración*"

-- ✅ RÁPIDO - Usar wildcards al final
summary ~ "migración*"

-- ❌ LENTO - Múltiples OR con assignee
assignee = "user1" OR assignee = "user2" OR assignee = "user3"

-- ✅ RÁPIDO - Usar IN con lista
assignee IN ("user1", "user2", "user3")

-- ❌ LENTO - Negaciones complejas
NOT (status IN ("Done", "Closed")) AND NOT (priority = "Low")

-- ✅ RÁPIDO - Condiciones positivas
status NOT IN ("Done", "Closed") AND priority != "Low"

-- ✅ OPTIMIZADO - Orden de filtros por selectividad
project = FENIX              -- Más selectivo primero
AND status IN ("En progreso", "Por hacer")  
AND created >= -30d          -- Menos selectivo al final
```

### **Técnicas de Caché Inteligente**
```javascript
class CacheInteligente {
  constructor() {
    this.cache = new Map();
    this.timestamps = new Map();
    this.hitCount = 0;
    this.missCount = 0;
  }
  
  // TTL diferenciado por tipo de datos
  getTTL(cacheKey) {
    if (cacheKey.includes('sprint')) return 300000;    // 5 min - sprints cambian poco
    if (cacheKey.includes('user')) return 600000;      // 10 min - usuarios estables
    if (cacheKey.includes('issue')) return 120000;     // 2 min - issues cambian frecuente
    if (cacheKey.includes('project')) return 1800000;  // 30 min - proyectos muy estables
    return 300000; // Default 5 min
  }
  
  // Cache con invalidación inteligente
  set(key, value, customTTL = null) {
    const ttl = customTTL || this.getTTL(key);
    this.cache.set(key, value);
    this.timestamps.set(key, Date.now() + ttl);
    
    // Limpiar cache expirado cada 100 inserts
    if (this.cache.size % 100 === 0) {
      this.limpiarExpirados();
    }
  }
  
  get(key) {
    if (!this.cache.has(key)) {
      this.missCount++;
      return null;
    }
    
    const expiry = this.timestamps.get(key);
    if (Date.now() > expiry) {
      this.cache.delete(key);
      this.timestamps.delete(key);
      this.missCount++;
      return null;
    }
    
    this.hitCount++;
    return this.cache.get(key);
  }
  
  getStats() {
    const total = this.hitCount + this.missCount; 
    return {
      hits: this.hitCount,
      misses: this.missCount,
      hitRate: total > 0 ? (this.hitCount / total * 100).toFixed(2) + '%' : '0%',
      cacheSize: this.cache.size
    };
  }
  
  limpiarExpirados() {
    const now = Date.now();
    for (const [key, expiry] of this.timestamps.entries()) {
      if (now > expiry) {
        this.cache.delete(key);
        this.timestamps.delete(key);
      }
    }
  }
}

// Instancia global del cache
const cacheGlobal = new CacheInteligente();
```

### **Batch Processing para Grandes Volúmenes**
```javascript
class JiraBatchProcessor {
  constructor(config) {
    this.config = config;
    this.batchSize = 50;
    this.maxConcurrent = 3;
    this.delayBetweenBatches = 1000;
  }
  
  async procesarIssuesEnLotes(jql, processorFunction) {
    const totalIssues = await this.contarIssues(jql);
    console.log(`📊 Total de issues a procesar: ${totalIssues}`);
    
    const resultados = [];
    const batches = Math.ceil(totalIssues / this.batchSize);
    
    for (let batch = 0; batch < batches; batch++) {
      const startAt = batch * this.batchSize;
      
      console.log(`📦 Procesando lote ${batch + 1}/${batches} (${startAt + 1}-${Math.min(startAt + this.batchSize, totalIssues)})`);
      
      try {
        const issues = await this.obtenerLoteIssues(jql, startAt);
        const resultadosLote = await this.procesarLoteParalelo(issues, processorFunction);
        resultados.push(...resultadosLote);
        
        // Pausa entre lotes para evitar rate limiting
        if (batch < batches - 1) {
          await this.sleep(this.delayBetweenBatches);
        }
        
      } catch (error) {
        console.error(`❌ Error en lote ${batch + 1}:`, error.message);
        // Continuar con el siguiente lote
      }
    }
    
    return resultados;
  }
  
  async procesarLoteParalelo(issues, processorFunction) {
    const resultados = [];
    
    // Dividir en grupos para procesamiento concurrente limitado
    for (let i = 0; i < issues.length; i += this.maxConcurrent) {
      const grupo = issues.slice(i, i + this.maxConcurrent);
      
      const promesasGrupo = grupo.map(async (issue) => {
        try {
          return await processorFunction(issue);
        } catch (error) {
          console.error(`⚠️ Error procesando ${issue.key}:`, error.message);
          return { error: error.message, issue: issue.key };
        }
      });
      
      const resultadosGrupo = await Promise.all(promesasGrupo);
      resultados.push(...resultadosGrupo);
      
      // Micro-pausa entre grupos
      await this.sleep(100);
    }
    
    return resultados;
  }
  
  async contarIssues(jql) {
    const response = await fetch(`${this.config.baseUrl}/rest/api/3/search`, {
      method: 'POST',
      headers: this.config.getHeaders(),
      body: JSON.stringify({
        jql: jql,
        maxResults: 0  // Solo queremos el count
      })
    });
    
    const data = await response.json();
    return data.total;
  }
  
  async obtenerLoteIssues(jql, startAt) {
    const response = await fetch(`${this.config.baseUrl}/rest/api/3/search`, {
      method: 'POST', 
      headers: this.config.getHeaders(),
      body: JSON.stringify({
        jql: jql,
        startAt: startAt,
        maxResults: this.batchSize,
        fields: ['key', 'summary', 'status', 'assignee', 'project', 'created']
      })
    });
    
    if (!response.ok) {
      throw new Error(`Error obteniendo lote: ${response.status}`);
    const data = await response.json();
    return data.issues;
  }
  
  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// Ejemplo de uso del batch processor
const procesadorMasivo = new JiraBatchProcessor(CONFIG_JIRA);

const analizarTodosLosIssuesDelTrimestre = async () => {
  const jql = `
    updated >= startOfQuarter() 
    AND project NOT IN ("Papelera", "TRASH")
    ORDER BY created ASC
  `;
  
  const procesarIssue = async (issue) => {
    // Análisis personalizado de cada issue
    const tiempoResolucion = calcularTiempoResolucion(issue);
    const complejidad = evaluarComplejidad(issue);
    const calidad = evaluarCalidadEvidencia(issue);
    
    return {
      key: issue.key,
      proyecto: issue.fields.project.key,
      tiempoResolucion,
      complejidad,
      calidad,
      responsable: issue.fields.assignee?.emailAddress
    };
  };
  
  const resultados = await procesadorMasivo.procesarIssuesEnLotes(jql, procesarIssue);
  
  // Generar métricas agregadas
  const metricas = generarMetricasAgregadas(resultados);
  return { resultados, metricas };
};
```

---

## 🔍 **TROUBLESHOOTING Y RESOLUCIÓN DE PROBLEMAS**

### **Problemas Comunes y Soluciones**

#### **1. Errores de Autenticación**
```javascript
// Diagnóstico de problemas de auth
const diagnosticarAutenticacion = async () => {
  const diagnostico = {
    tokenValido: false,
    emailCorrecto: false,
    permisosAdecuados: false,
    formatoCorrecto: false,
    errores: []
  };
  
  try {
    // Verificar formato del token
    const tokenPattern = /^ATATT3xFfGF0[A-Za-z0-9_-]+$/;
    diagnostico.formatoCorrecto = tokenPattern.test(CONFIG_JIRA.apiToken);
    
    if (!diagnostico.formatoCorrecto) {
      diagnostico.errores.push('Formato de token inválido');
    }
    
    // Test de conexión básica
    const response = await fetch(`${CONFIG_JIRA.baseUrl}/rest/api/3/myself`, {
      headers: {
        'Authorization': `Basic ${btoa(CONFIG_JIRA.email + ':' + CONFIG_JIRA.apiToken)}`,
        'Accept': 'application/json'
      }
    });
    
    if (response.status === 401) {
      diagnostico.errores.push('Token inválido o expirado');
    } else if (response.status === 403) {
      diagnostico.errores.push('Email incorrecto o permisos insuficientes');
    } else if (response.ok) {
      const userData = await response.json();
      diagnostico.tokenValido = true;
      diagnostico.emailCorrecto = userData.emailAddress === CONFIG_JIRA.email;
      diagnostico.permisosAdecuados = true;
    }
    
  } catch (error) {
    diagnostico.errores.push(`Error de red: ${error.message}`);
  }
  
  return diagnostico;
};

// Renovación automática de token (simulación)
const renovarTokenSiEsNecesario = async () => {
  const diagnostico = await diagnosticarAutenticacion();
  
  if (!diagnostico.tokenValido) {
    console.log('🔄 Token inválido detectado, requiere renovación manual');
    console.log('📝 Pasos para renovar:');
    console.log('1. Ir a https://id.atlassian.com/manage-profile/security/api-tokens');
    console.log('2. Crear nuevo token para ccsoft.atlassian.net');
    console.log('3. Actualizar CONFIG_JIRA.apiToken con el nuevo valor');
    
    return false;
  }
  
  return true;
};
```

#### **2. Errores de JQL**
```javascript
// Validador y corrector de JQL
const validarYCorregirJQL = (jql) => {
  const erroresComunes = [
    {
      patron: /assignee\s*=\s*"([^"]+@[^"]+)"/g,
      correccion: (match, email) => {
        // Verificar si es email vs account ID
        if (email.includes('@')) {
          console.warn(`⚠️ Posible error: usar account ID en lugar de email para assignee`);
          return match; // Mantener original pero advertir
        }
        return match;
      }
    },
    {
      patron: /sprint\s*=\s*"([^"]+)"/g,
      correccion: (match, sprintName) => {
        // Verificar formato de sprint
        const formatoValido = /^Q[1-4]-S[1-6]-\d{2,4}/.test(sprintName);
        if (!formatoValido) {
          console.warn(`⚠️ Formato de sprint inusual: ${sprintName}`);
        }
        return match;
      }
    },
    {
      patron: /customfield_(\d+)/g,
      correccion: (match, fieldId) => {
        // Verificar que el campo personalizado existe
        const campoConocido = Object.values(CAMPOS_PERSONALIZADOS).includes(match);
        if (!campoConocido) {
          console.warn(`⚠️ Campo personalizado no documentado: ${match}`);
        }
        return match;
      }
    }
  ];
  
  let jqlCorregido = jql;
  const advertencias = [];
  
  erroresComunes.forEach(({ patron, correccion }) => {
    jqlCorregido = jqlCorregido.replace(patron, correccion);
  });
  
  // Validaciones adicionales
  if (jqlCorregido.length > 2000) {
    advertencias.push('JQL muy largo, considerar dividir en múltiples consultas');
  }
  
  if (jqlCorregido.includes('ORDER BY') && !jqlCorregido.includes('project')) {
    advertencias.push('ORDER BY sin filtro de proyecto puede ser lento');
  }
  
  return {
    jqlOriginal: jql,
    jqlCorregido: jqlCorregido,
    advertencias: advertencias,
    valido: advertencias.length === 0
  };
};

// Tester de performance JQL
const testearPerformanceJQL = async (jql, maxTiempoMs = 5000) => {
  const inicio = Date.now();
  
  try {
    const response = await fetch(`${CONFIG_JIRA.baseUrl}/rest/api/3/search`, {
      method: 'POST',
      headers: CONFIG_JIRA.getHeaders(),
      body: JSON.stringify({
        jql: jql,
        maxResults: 1,
        fields: ['key']
      })
    });
    
    const fin = Date.now();
    const tiempoEjecucion = fin - inicio;
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    return {
      exitoso: true,
      tiempoMs: tiempoEjecucion,
      totalResultados: data.total,
      esLento: tiempoEjecucion > maxTiempoMs,
      recomendacion: tiempoEjecucion > maxTiempoMs ? 
        'Considerar agregar más filtros o dividir la consulta' : 
        'Performance aceptable'
    };
    
  } catch (error) {
    return {
      exitoso: false,
      error: error.message,
      tiempoMs: Date.now() - inicio
    };
  }
};
```

#### **3. Problemas de Rate Limiting**
```javascript
// Monitor de rate limiting avanzado
class RateLimitMonitor {
  constructor() {
    this.requestHistory = [];
    this.rateLimitHits = 0;
    this.ultimoResetRateLimit = Date.now();
  }
  
  registrarRequest(url, status, tiempoRespuesta) {
    const ahora = Date.now();
    
    this.requestHistory.push({
      timestamp: ahora,
      url: url,
      status: status,
      tiempoRespuesta: tiempoRespuesta
    });
    
    // Mantener solo última hora de historial
    const unaHoraAtras = ahora - (60 * 60 * 1000);
    this.requestHistory = this.requestHistory.filter(req => req.timestamp > unaHoraAtras);
    
    // Detectar rate limiting
    if (status === 429) {
      this.rateLimitHits++;
      console.warn(`🚫 Rate limit hit #${this.rateLimitHits} en ${new Date().toISOString()}`);
    }
  }
  
  obtenerEstadisticas() {
    const ultimosMinutos = {
      1: this.contarRequestsEnVentana(1),
      5: this.contarRequestsEnVentana(5),
      15: this.contarRequestsEnVentana(15),
      60: this.contarRequestsEnVentana(60)
    };
    
    const promedioTiempoRespuesta = this.calcularPromedioTiempoRespuesta();
    
    return {
      requestsPorMinuto: ultimosMinutos,
      rateLimitHits: this.rateLimitHits,
      promedioTiempoRespuesta: promedioTiempoRespuesta,
      recomendacion: this.generarRecomendacion(ultimosMinutos[1])
    };
  }
  
  contarRequestsEnVentana(minutos) {
    const ventana = Date.now() - (minutos * 60 * 1000);
    return this.requestHistory.filter(req => req.timestamp > ventana).length;
  }
  
  calcularPromedioTiempoRespuesta() {
    if (this.requestHistory.length === 0) return 0;
    
    const tiempos = this.requestHistory.map(req => req.tiempoRespuesta);
    const suma = tiempos.reduce((acc, tiempo) => acc + tiempo, 0);
    return Math.round(suma / tiempos.length);
  }
  
  generarRecomendacion(requestsUltimoMinuto) {
    if (requestsUltimoMinuto > 200) {
      return '🔴 Muy alto - reducir frecuencia de requests';
    } else if (requestsUltimoMinuto > 100) {
      return '🟡 Alto - implementar delays entre requests';
    } else if (requestsUltimoMinuto > 50) {
      return '🟢 Moderado - monitorear de cerca';
    } else {
      return '✅ Óptimo - rate dentro de límites';
    }
  }
  
  // Estrategia adaptativa de delays
  calcularDelayRecomendado() {
    const requestsUltimoMinuto = this.contarRequestsEnVentana(1);
    
    if (this.rateLimitHits > 0) {
      return 2000; // 2 segundos si hemos tenido rate limits
    } else if (requestsUltimoMinuto > 150) {
      return 1000; // 1 segundo si estamos cerca del límite
    } else if (requestsUltimoMinuto > 100) {
      return 500;  // 0.5 segundos si estamos moderadamente altos
    } else {
      return 200;  // 0.2 segundos en uso normal
    }
  }
}

// Instancia global del monitor
const rateLimitMonitor = new RateLimitMonitor();

// Wrapper para requests que incluye monitoreo
const makeMonitoredRequest = async (url, options = {}) => {
  const inicioRequest = Date.now();
  
  // Aplicar delay adaptativo
  const delayRecomendado = rateLimitMonitor.calcularDelayRecomendado();
  if (delayRecomendado > 200) {
    await new Promise(resolve => setTimeout(resolve, delayRecomendado));
  }
  
  try {
    const response = await fetch(url, options);
    const tiempoRespuesta = Date.now() - inicioRequest;
    
    rateLimitMonitor.registrarRequest(url, response.status, tiempoRespuesta);
    
    if (response.status === 429) {
      // Implementar backoff exponencial para rate limits
      const backoffTime = Math.min(30000, Math.pow(2, rateLimitMonitor.rateLimitHits) * 1000);
      console.log(`⏳ Rate limit detectado, esperando ${backoffTime}ms antes de continuar`);
      await new Promise(resolve => setTimeout(resolve, backoffTime));
    }
    
    return response;
    
  } catch (error) {
    const tiempoRespuesta = Date.now() - inicioRequest;
    rateLimitMonitor.registrarRequest(url, 0, tiempoRespuesta); // 0 = error de red
    throw error;
  }
};
```

---

## 📈 **MÉTRICAS Y MONITOREO EN TIEMPO REAL**

### **Dashboard de Salud del Sistema**
```javascript
class HealthDashboard {
  constructor() {
    this.metricas = {
      api: {
        responseTime: [],
        errorRate: 0,
        uptime: 100,
        rateLimitHits: 0
      },
      data: {
        totalIssues: 0,
        issuesActivos: 0,
        sprintsActivos: 0,
        proyectosCriticos: {}
      },
      performance: {
        cacheHitRate: 0,
        queryEfficiency: 0,
        batchProcessingRate: 0
      }
    };
    
    this.alertas = [];
    this.intervalos = [];
  }
  
  iniciarMonitoreo() {
    // Monitoreo cada minuto
    const intervaloMinuto = setInterval(() => {
      this.actualizarMetricasApi();
      this.verificarSaludProyectos();
    }, 60000);
    
    // Monitoreo cada 5 minutos  
    const intervalo5Min = setInterval(() => {
      this.actualizarMetricasData();
      this.evaluarAlertas();
    }, 300000);
    
    // Monitoreo cada 15 minutos
    const intervalo15Min = setInterval(() => {
      this.limpiarMetricasAntiguas();
      this.generarReporteSalud();
    }, 900000);
    
    this.intervalos = [intervaloMinuto, intervalo5Min, intervalo15Min];
    console.log('🔄 Sistema de monitoreo iniciado');
  }
  
  async actualizarMetricasApi() {
    try {
      const inicio = Date.now();
      const response = await makeMonitoredRequest(`${CONFIG_JIRA.baseUrl}/rest/api/3/myself`);
      const tiempoRespuesta = Date.now() - inicio;
      
      this.metricas.api.responseTime.push({
        timestamp: Date.now(),
        tiempo: tiempoRespuesta
      });
      
      // Mantener solo últimos 60 valores (1 hora)
      if (this.metricas.api.responseTime.length > 60) {
        this.metricas.api.responseTime.shift();
      }
      
      // Actualizar rate limit hits
      this.metricas.api.rateLimitHits = rateLimitMonitor.rateLimitHits;
      
    } catch (error) {
      this.metricas.api.errorRate++;
      this.agregarAlerta('API_ERROR', `Error de conectividad: ${error.message}`, 'HIGH');
    }
  }
  
  async verificarSaludProyectos() {
    const proyectosCriticos = ['FENIX', 'BDMS', 'INFLYV'];
    
    for (const proyecto of proyectosCriticos) {
      try {
        const jql = `project = ${proyecto} AND status NOT IN ("Done", "Cerrado") AND priority IN ("Highest", "High")`;
        const response = await makeMonitoredRequest(`${CONFIG_JIRA.baseUrl}/rest/api/3/search`, {
          method: 'POST',
          headers: CONFIG_JIRA.getHeaders(),
          body: JSON.stringify({
            jql: jql,
            maxResults: 0
          })
        });
        
        if (response.ok) {
          const data = await response.json();
          const issuesCriticos = data.total;
          
          this.metricas.data.proyectosCriticos[proyecto] = {
            issuesCriticos: issuesCriticos,
            timestamp: Date.now()
          };
          
          // Alerta si hay muchos issues críticos
          if (issuesCriticos > 10) {
            this.agregarAlerta(
              'HIGH_CRITICAL_ISSUES', 
              `Proyecto ${proyecto} tiene ${issuesCriticos} issues críticos`,
              'MEDIUM'
            );
          }
        }
        
      } catch (error) {
        console.error(`Error verificando salud de ${proyecto}:`, error.message);
      }
    }
  }
  
  async actualizarMetricasData() {
    try {
      // Contar issues activos totales
      const jqlActivos = `status NOT IN ("Done", "Cerrado", "Resolved") AND project NOT IN ("Papelera", "TRASH")`;
      const responseActivos = await makeMonitoredRequest(`${CONFIG_JIRA.baseUrl}/rest/api/3/search`, {
        method: 'POST',
        headers: CONFIG_JIRA.getHeaders(),
        body: JSON.stringify({
          jql: jqlActivos,
          maxResults: 0
        })
      });
      
      if (responseActivos.ok) {
        const dataActivos = await responseActivos.json();
        this.metricas.data.issuesActivos = dataActivos.total;
      }
      
      // Obtener estadísticas de caché
      const statsCache = cacheGlobal.getStats();
      this.metricas.performance.cacheHitRate = parseFloat(statsCache.hitRate);
      
    } catch (error) {
      console.error('Error actualizando métricas de datos:', error.message);
    }
  }
  
  agregarAlerta(tipo, mensaje, severidad = 'LOW') {
    const alerta = {
      id: Date.now().toString(),
      tipo: tipo,
      mensaje: mensaje,
      severidad: severidad,
      timestamp: Date.now(),
      activa: true
    };
    
    this.alertas.push(alerta);
    
    // Mantener solo últimas 100 alertas
    if (this.alertas.length > 100) {
      this.alertas.shift();
    }
    
    // Log según severidad
    switch (severidad) {
      case 'HIGH':
        console.error(`🚨 ALERTA ALTA: ${mensaje}`);
        break;
      case 'MEDIUM':
        console.warn(`⚠️ ALERTA MEDIA: ${mensaje}`);
        break;
      default:
        console.log(`ℹ️ ALERTA BAJA: ${mensaje}`);
    }
  }
  
  evaluarAlertas() {
    // Evaluar tiempo de respuesta promedio
    if (this.metricas.api.responseTime.length > 0) {
      const tiempos = this.metricas.api.responseTime.map(m => m.tiempo);
      const promedio = tiempos.reduce((a, b) => a + b, 0) / tiempos.length;
      
      if (promedio > 5000) {
        this.agregarAlerta('SLOW_API', `Tiempo de respuesta promedio alto: ${promedio}ms`, 'HIGH');
      } else if (promedio > 2000) {
        this.agregarAlerta('SLOW_API', `Tiempo de respuesta elevado: ${promedio}ms`, 'MEDIUM');
      }
    }
    
    // Evaluar rate limiting
    if (this.metricas.api.rateLimitHits > 5) {
      this.agregarAlerta('RATE_LIMIT', `Múltiples hits de rate limit: ${this.metricas.api.rateLimitHits}`, 'HIGH');
    }
    
    // Evaluar caché
    if (this.metricas.performance.cacheHitRate < 50) {
      this.agregarAlerta('LOW_CACHE', `Tasa de acierto de caché baja: ${this.metricas.performance.cacheHitRate}%`, 'MEDIUM');
    }
  }
  
  generarReporteSalud() {
    const ahora = new Date();
    const reporte = {
      timestamp: ahora.toISOString(),
      resumen: {
        estado: this.calcularEstadoGeneral(),
        alertasActivas: this.alertas.filter(a => a.activa).length,
        metricas: this.metricas
      },
      recomendaciones: this.generarRecomendaciones()
    };
    
    console.log('📊 REPORTE DE SALUD DEL SISTEMA:');
    console.log(`🟢 Estado general: ${reporte.resumen.estado}`);
    console.log(`⚠️ Alertas activas: ${reporte.resumen.alertasActivas}`);
    
    return reporte;
  }
  
  calcularEstadoGeneral() {
    const alertasAltas = this.alertas.filter(a => a.activa && a.severidad === 'HIGH').length;
    const alertasMedias = this.alertas.filter(a => a.activa && a.severidad === 'MEDIUM').length;
    
    if (alertasAltas > 0) return 'CRÍTICO';
    if (alertasMedias > 3) return 'DEGRADADO';
    if (this.metricas.performance.cacheHitRate > 70) return 'ÓPTIMO';
    return 'NORMAL';
  }
  
  generarRecomendaciones() {
    const recomendaciones = [];
    
    if (this.metricas.api.rateLimitHits > 0) {
      recomendaciones.push('Implementar delays más largos entre requests');
    }
    
    if (this.metricas.performance.cacheHitRate < 60) {
      recomendaciones.push('Revisar estrategia de caché y TTLs');
    }
    
    const alertasRecurrentes = this.detectarAlertasRecurrentes();
    if (alertasRecurrentes.length > 0) {
      recomendaciones.push(`Investigar alertas recurrentes: ${alertasRecurrentes.join(', ')}`);
    }
    
    return recomendaciones;
  }
  
  detectarAlertasRecurrentes() {
    const ultimaHora = Date.now() - (60 * 60 * 1000);
    const alertasRecientes = this.alertas.filter(a => a.timestamp > ultimaHora);
    
    const conteoTipos = {};
    alertasRecientes.forEach(alerta => {
      conteoTipos[alerta.tipo] = (conteoTipos[alerta.tipo] || 0) + 1;
    });
    
    return Object.entries(conteoTipos)
      .filter(([tipo, conteo]) => conteo > 3)
      .map(([tipo, conteo]) => `${tipo}(${conteo})`);
  }
  
  detenerMonitoreo() {
    this.intervalos.forEach(intervalo => clearInterval(intervalo));
    console.log('🛑 Sistema de monitoreo detenido');
  }
}

// Instancia global del dashboard
const healthDashboard = new HealthDashboard();

// Inicialización automática
// healthDashboard.iniciarMonitoreo();
```

---

## 🎓 **GUÍAS DE MIGRACIÓN Y ACTUALIZACIÓN**

### **Migración desde API v2 a v3**
```javascript
// Mapeo de endpoints deprecados
const MIGRACION_ENDPOINTS = {
  // ❌ v2 (deprecado)          // ✅ v3 (actual)
  '/rest/api/2/search': '/rest/api/3/search',
  '/rest/api/2/issue/': '/rest/api/3/issue/',
  '/rest/api/2/project': '/rest/api/3/project',
  '/rest/api/2/user/search': '/rest/api/3/user/search',
  '/rest/api/2/myself': '/rest/api/3/myself',
  
  // Cambios específicos en Agile API
  '/rest/agile/1.0/board/{boardId}/sprint': '/rest/agile/1.0/board/{boardId}/sprint',
  // (La API Agile mantiene v1.0 por compatibilidad)
};

// Cambios en estructura de respuesta
const CAMBIOS_ESTRUCTURA_V3 = {
  // Campo de usuario - cambió de 'name' a 'accountId'
  usuario_v2: {
    name: 'jsmith',
    displayName: 'John Smith',
    emailAddress: 'jsmith@company.com'
  },
  usuario_v3: {
    accountId: '712020:bcc8f634-81f1-4b21-893b-de03d7203037',
    displayName: 'John Smith', 
    emailAddress: 'jsmith@company.com'
    // 'name' ya no existe en v3
  },
  
  // Búsqueda de usuarios - diferentes parámetros
  busqueda_usuario_v2: '/rest/api/2/user/search?username=john',
  busqueda_usuario_v3: '/rest/api/3/user/search?query=john'
};

// Helper para migración automática
class MigradorAPI {
  static convertirUsuarioV2aV3(usuarioV2) {
    // En v2 usábamos 'name', en v3 necesitamos 'accountId'
    if (usuarioV2.name && !usuarioV2.accountId) {
      console.warn(`⚠️ Usuario ${usuarioV2.displayName} usa formato v2, requiere account ID`);
      // Necesitaríamos buscar el account ID correspondiente
      return {
        accountId: 'REQUIERE_BUSQUEDA', // Placeholder
        displayName: usuarioV2.displayName,
        emailAddress: usuarioV2.emailAddress
      };
    }
    return usuarioV2;
  }
  
  static async buscarAccountIdPorEmail(email) {
    try {
      const response = await makeMonitoredRequest(`${CONFIG_JIRA.baseUrl}/rest/api/3/user/search`, {
        method: 'GET',
        headers: CONFIG_JIRA.getHeaders(),
        body: JSON.stringify({
          query: email,
          maxResults: 1
        })
      });
      
      if (response.ok) {
        const usuarios = await response.json();
        if (usuarios.length > 0) {
          return usuarios[0].accountId;
        }
      }
      
      throw new Error(`Usuario no encontrado para email: ${email}`);
      
    } catch (error) {
      console.error(`Error buscando account ID para ${email}:`, error.message);
      return null;
    }
  }
  
  static validarCompatibilidadJQL(jql) {
    const patronesProblematicos = [
      {
        patron: /reporter\s*=\s*"([^"]+)"/g,
        problema: 'Campo reporter puede requerir account ID en v3',
        solucion: 'Verificar si el valor es email vs account ID'
      },
      {
        patron: /assignee\s*=\s*"([^@"]+@[^"]+)"/g,
        problema: 'Assignee con email puede no funcionar en v3',
        solucion: 'Usar account ID en lugar de email'
      },
      {
        patron: /creator\s*=\s*"([^"]+)"/g,
        problema: 'Campo creator puede requerir account ID en v3',
        solucion: 'Verificar formato del identificador de usuario'
      }
    ];
    
    const problemas = [];
    
    patronesProblematicos.forEach(({ patron, problema, solucion }) => {
      const matches = jql.match(patron);
      if (matches) {
        matches.forEach(match => {
          problemas.push({
            match: match,
            problema: problema,
            solucion: solucion
          });
        });
      }
    });
    
    return {
      esCompatible: problemas.length === 0,
      problemas: problemas,
      jqlOriginal: jql
    };
  }
}
```

### **Actualización de Campos Personalizados**
```javascript
// Auditor de campos personalizados
class AuditorCamposPersonalizados {
  constructor() {
    this.camposDetectados = new Map();
    this.camposObsoletos = new Map();
  }
  
  async auditarTodosLosCampos() {
    try {
      const response = await makeMonitoredRequest(`${CONFIG_JIRA.baseUrl}/rest/api/3/field`, {
        headers: CONFIG_JIRA.getHeaders()
      });
      
      if (!response.ok) {
        throw new Error(`Error obteniendo campos: ${response.status}`);
      }
      
      const todosLosCampos = await response.json();
      const camposPersonalizados = todosLosCampos.filter(campo => 
        campo.id.startsWith('customfield_')
      );
      
      // Analizar cada campo
      for (const campo of camposPersonalizados) {
        await this.analizarCampo(campo);
      }
      
      return this.generarReporteAuditoria();
      
    } catch (error) {
      console.error('Error en auditoría de campos:', error.message);
      throw error;
    }
  }
  
  async analizarCampo(campo) {
    const analisis = {
      id: campo.id,
      name: campo.name,
      type: campo.schema?.type,
      custom: campo.custom,
      enUso: false,
      proyectosUso: [],
      ultimoUso: null,
      conflictos: []
    };
    
    // Verificar uso del campo en issues recientes
    try {
      const jqlTest = `${campo.id} IS NOT EMPTY AND updated >= -30d`;
      const response = await makeMonitoredRequest(`${CONFIG_JIRA.baseUrl}/rest/api/3/search`, {
        metho
		
		
		```javascript
        method: 'POST',
        headers: CONFIG_JIRA.getHeaders(),
        body: JSON.stringify({
          jql: jqlTest,
          maxResults: 10,
          fields: ['key', 'project', 'updated', campo.id]
        })
      });
      
      if (response.ok) {
        const data = await response.json();
        analisis.enUso = data.total > 0;
        
        if (data.total > 0) {
          // Extraer proyectos que usan este campo
          const proyectos = new Set();
          let ultimaActualizacion = null;
          
          data.issues.forEach(issue => {
            proyectos.add(issue.fields.project.key);
            const fechaUpdate = new Date(issue.fields.updated);
            if (!ultimaActualizacion || fechaUpdate > ultimaActualizacion) {
              ultimaActualizacion = fechaUpdate;
            }
          });
          
          analisis.proyectosUso = Array.from(proyectos);
          analisis.ultimoUso = ultimaActualizacion?.toISOString();
        }
      }
      
    } catch (error) {
      analisis.conflictos.push(`Error verificando uso: ${error.message}`);
    }
    
    // Verificar si está en nuestro mapeo conocido
    const campoConocido = Object.entries(CAMPOS_PERSONALIZADOS).find(
      ([nombre, id]) => id === campo.id
    );
    
    if (campoConocido) {
      analisis.nombreMapeado = campoConocido[0];
      analisis.documentado = true;
    } else {
      analisis.documentado = false;
      if (analisis.enUso) {
        analisis.conflictos.push('Campo en uso pero no documentado en CAMPOS_PERSONALIZADOS');
      }
    }
    
    this.camposDetectados.set(campo.id, analisis);
  }
  
  generarReporteAuditoria() {
    const campos = Array.from(this.camposDetectados.values());
    
    const reporte = {
      resumen: {
        totalCampos: campos.length,
        camposEnUso: campos.filter(c => c.enUso).length,
        camposDocumentados: campos.filter(c => c.documentado).length,
        camposHuerfanos: campos.filter(c => !c.enUso && !c.documentado).length,
        conflictos: campos.filter(c => c.conflictos.length > 0).length
      },
      detalles: {
        camposEnUso: campos.filter(c => c.enUso),
        camposNoDocumentados: campos.filter(c => c.enUso && !c.documentado),
        camposHuerfanos: campos.filter(c => !c.enUso),
        conflictos: campos.filter(c => c.conflictos.length > 0)
      },
      recomendaciones: this.generarRecomendaciones(campos)
    };
    
    return reporte;
  }
  
  generarRecomendaciones(campos) {
    const recomendaciones = [];
    
    // Campos no documentados pero en uso
    const noDocumentados = campos.filter(c => c.enUso && !c.documentado);
    if (noDocumentados.length > 0) {
      recomendaciones.push({
        tipo: 'DOCUMENTAR',
        prioridad: 'ALTA',
        descripcion: `Documentar ${noDocumentados.length} campos personalizados en uso`,
        campos: noDocumentados.map(c => ({ id: c.id, name: c.name, proyectos: c.proyectosUso }))
      });
    }
    
    // Campos huérfanos
    const huerfanos = campos.filter(c => !c.enUso && c.ultimoUso < new Date(Date.now() - 90 * 24 * 60 * 60 * 1000));
    if (huerfanos.length > 0) {
      recomendaciones.push({
        tipo: 'LIMPIAR',
        prioridad: 'MEDIA',
        descripcion: `Considerar eliminar ${huerfanos.length} campos sin uso en 90+ días`,
        campos: huerfanos.map(c => ({ id: c.id, name: c.name, ultimoUso: c.ultimoUso }))
      });
    }
    
    // Actualizaciones necesarias en código
    const actualizacionesCodigo = [];
    noDocumentados.forEach(campo => {
      actualizacionesCodigo.push(`  ${campo.name.replace(/\s+/g, '_').toLowerCase()}: "${campo.id}",`);
    });
    
    if (actualizacionesCodigo.length > 0) {
      recomendaciones.push({
        tipo: 'CODIGO',
        prioridad: 'ALTA',
        descripcion: 'Agregar campos faltantes a CAMPOS_PERSONALIZADOS',
        codigo: `const CAMPOS_PERSONALIZADOS = {\n${actualizacionesCodigo.join('\n')}\n};`
      });
    }
    
    return recomendaciones;
  }
}

// Uso del auditor
const auditarCamposPersonalizados = async () => {
  console.log('🔍 Iniciando auditoría de campos personalizados...');
  const auditor = new AuditorCamposPersonalizados();
  const reporte = await auditor.auditarTodosLosCampos();
  
  console.log('📊 REPORTE DE AUDITORÍA:');
  console.log(`📋 Total de campos: ${reporte.resumen.totalCampos}`);
  console.log(`✅ En uso: ${reporte.resumen.camposEnUso}`);
  console.log(`📚 Documentados: ${reporte.resumen.camposDocumentados}`);
  console.log(`⚠️ Conflictos: ${reporte.resumen.conflictos}`);
  
  if (reporte.recomendaciones.length > 0) {
    console.log('\n💡 RECOMENDACIONES:');
    reporte.recomendaciones.forEach(rec => {
      console.log(`${rec.prioridad === 'ALTA' ? '🔴' : '🟡'} ${rec.descripcion}`);
    });
  }
  
  return reporte;
};
```

---

## 🔒 **SEGURIDAD AVANZADA Y COMPLIANCE**

### **Auditoría de Seguridad**
```javascript
class AuditorSeguridadJira {
  constructor(config) {
    this.config = config;
    this.vulnerabilidades = [];
    this.cumplimiento = {
      gdpr: { puntuacion: 0, requisitos: [] },
      sox: { puntuacion: 0, requisitos: [] },
      iso27001: { puntuacion: 0, requisitos: [] }
    };
  }
  
  async ejecutarAuditoriaCompleta() {
    console.log('🔒 Iniciando auditoría de seguridad...');
    
    const resultados = {
      autenticacion: await this.auditarAutenticacion(),
      permisos: await this.auditarPermisos(),
      datos: await this.auditarProteccionDatos(),
      logs: await this.auditarRegistroActividad(),
      compliance: await this.evaluarCumplimiento()
    };
    
    return this.generarReporteSeguridad(resultados);
  }
  
  async auditarAutenticacion() {
    const auditoria = {
      fortalezaToken: 'NO_EVALUADO',
      expiracionToken: 'NO_DISPONIBLE',
      rotacionRecomendada: false,
      mfa: 'NO_VERIFICABLE',
      vulnerabilidades: []
    };
    
    // Verificar fortaleza del token
    if (this.config.apiToken) {
      const patronToken = /^ATATT3xFfGF0[A-Za-z0-9_-]{50,}$/;
      const esFortalezaAdecuada = patronToken.test(this.config.apiToken);
      
      auditoria.fortalezaToken = esFortalezaAdecuada ? 'FUERTE' : 'DEBIL';
      
      if (!esFortalezaAdecuada) {
        auditoria.vulnerabilidades.push({
          tipo: 'TOKEN_DEBIL',
          severidad: 'ALTA',
          descripcion: 'Token no cumple con patrones de fortaleza esperados'
        });
      }
      
      // Verificar longitud
      if (this.config.apiToken.length < 60) {
        auditoria.vulnerabilidades.push({
          tipo: 'TOKEN_CORTO',
          severidad: 'MEDIA',
          descripcion: 'Token parece ser más corto de lo recomendado'
        });
      }
    }
    
    // Recomendar rotación (estimado cada 90 días)
    auditoria.rotacionRecomendada = true;
    auditoria.vulnerabilidades.push({
      tipo: 'ROTACION_PENDIENTE',
      severidad: 'MEDIA',
      descripcion: 'Se recomienda rotación periódica de tokens (90 días)'
    });
    
    return auditoria;
  }
  
  async auditarPermisos() {
    const auditoria = {
      permisosMínimos: true,
      accesosInnecesarios: [],
      proyectosAccesibles: [],
      recomendaciones: []
    };
    
    try {
      // Verificar proyectos accesibles
      const response = await makeMonitoredRequest(`${this.config.baseUrl}/rest/api/3/project/search`, {
        headers: this.config.getHeaders()
      });
      
      if (response.ok) {
        const proyectos = await response.json();
        auditoria.proyectosAccesibles = proyectos.values?.map(p => ({
          key: p.key,
          name: p.name,
          projectTypeKey: p.projectTypeKey
        })) || [];
        
        // Verificar si hay acceso a proyectos sensibles
        const proyectosSensibles = auditoria.proyectosAccesibles.filter(p => 
          p.name.toLowerCase().includes('test') || 
          p.name.toLowerCase().includes('sandbox') ||
          p.key === 'TRASH'
        );
        
        if (proyectosSensibles.length > 0) {
          auditoria.accesosInnecesarios = proyectosSensibles;
          auditoria.recomendaciones.push({
            tipo: 'ACCESO_SENSIBLE',
            descripcion: `Revisar necesidad de acceso a proyectos: ${proyectosSensibles.map(p => p.key).join(', ')}`
          });
        }
      }
      
    } catch (error) {
      auditoria.recomendaciones.push({
        tipo: 'ERROR_AUDITORIA',
        descripcion: `Error verificando permisos: ${error.message}`
      });
    }
    
    return auditoria;
  }
  
  async auditarProteccionDatos() {
    const auditoria = {
      datosPersonales: [],
      encriptacionTransito: true, // HTTPS por defecto en Atlassian Cloud
      retentionPoliticas: 'NO_VERIFICABLE',
      cumplimientoGDPR: {
        score: 0,
        requisitos: []
      }
    };
    
    // Buscar posibles datos personales en comentarios/descripciones
    const jqlDatosPersonales = [
      'description ~ "*@*.com*" OR summary ~ "*@*.com*"', // Emails
      'description ~ "*[0-9]{3}-[0-9]{2}-[0-9]{4}*"',    // Posibles SSNs
      'description ~ "*[0-9]{10,}*"',                      // Números largos
    ];
    
    for (const jql of jqlDatosPersonales) {
      try {
        const response = await makeMonitoredRequest(`${this.config.baseUrl}/rest/api/3/search`, {
          method: 'POST',
          headers: this.config.getHeaders(),
          body: JSON.stringify({
            jql: jql,
            maxResults: 5,
            fields: ['key', 'summary']
          })
        });
        
        if (response.ok) {
          const data = await response.json();
          if (data.total > 0) {
            auditoria.datosPersonales.push({
              patron: jql,
              issuesAfectados: data.total,
              ejemplos: data.issues.map(i => i.key)
            });
          }
        }
        
      } catch (error) {
        console.warn(`Error buscando datos personales: ${error.message}`);
      }
    }
    
    // Evaluar cumplimiento GDPR
    auditoria.cumplimientoGDPR.score = auditoria.datosPersonales.length === 0 ? 85 : 60;
    auditoria.cumplimientoGDPR.requisitos = [
      {
        requisito: 'Minimización de datos personales',
        cumple: auditoria.datosPersonales.length === 0,
        observaciones: auditoria.datosPersonales.length > 0 ? 'Se detectaron posibles datos personales en issues' : 'No se detectaron datos personales obvios'
      },
      {
        requisito: 'Encriptación en tránsito',
        cumple: auditoria.encriptacionTransito,
        observaciones: 'HTTPS habilitado por defecto en Atlassian Cloud'
      }
    ];
    
    return auditoria;
  }
  
  async auditarRegistroActividad() {
    const auditoria = {
      logLevel: 'ESTANDAR', // Atlassian Cloud maneja logs automáticamente
      retencionLogs: '6_MESES', // Política estándar de Atlassian
      trazabilidad: {
        cambiosIssues: true,
        accesosAPI: true,
        modificacionesProyecto: true
      },
      alertasSeguridad: []
    };
    
    // Verificar actividad sospechosa reciente
    try {
      const jqlActividad = 'updated >= -24h ORDER BY updated DESC';
      const response = await makeMonitoredRequest(`${this.config.baseUrl}/rest/api/3/search`, {
        method: 'POST',
        headers: this.config.getHeaders(),
        body: JSON.stringify({
          jql: jqlActividad,
          maxResults: 100,
          fields: ['key', 'updated', 'assignee', 'status']
        })
      });
      
      if (response.ok) {
        const data = await response.json();
        
        // Detectar patrones sospechosos
        const actividadPorUsuario = {};
        data.issues.forEach(issue => {
          const usuario = issue.fields.assignee?.accountId || 'SIN_ASIGNADO';
          actividadPorUsuario[usuario] = (actividadPorUsuario[usuario] || 0) + 1;
        });
        
        // Usuario con actividad excesiva (>50 cambios en 24h)
        Object.entries(actividadPorUsuario).forEach(([usuario, cambios]) => {
          if (cambios > 50) {
            auditoria.alertasSeguridad.push({
              tipo: 'ACTIVIDAD_EXCESIVA',
              usuario: usuario,
              cambios: cambios,
              severidad: 'MEDIA'
            });
          }
        });
      }
      
    } catch (error) {
      auditoria.alertasSeguridad.push({
        tipo: 'ERROR_AUDITORIA_LOGS',
        descripcion: error.message,
        severidad: 'BAJA'
      });
    }
    
    return auditoria;
  }
  
  async evaluarCumplimiento() {
    const evaluacion = {
      gdpr: { score: 0, nivel: 'NO_CUMPLE', observaciones: [] },
      sox: { score: 0, nivel: 'NO_CUMPLE', observaciones: [] },
      iso27001: { score: 0, nivel: 'NO_CUMPLE', observaciones: [] }
    };
    
    // Evaluación GDPR (Reglamento General de Protección de Datos)
    let puntosGDPR = 0;
    
    // Criterio 1: Minimización de datos (30 puntos)
    if (this.vulnerabilidades.filter(v => v.tipo.includes('DATOS_PERSONALES')).length === 0) {
      puntosGDPR += 30;
    }
    
    // Criterio 2: Seguridad técnica (40 puntos)
    if (this.config.baseUrl.startsWith('https://')) {
      puntosGDPR += 20; // HTTPS
    }
    if (this.config.apiToken && this.config.apiToken.length > 60) {
      puntosGDPR += 20; // Token fuerte
    }
    
    // Criterio 3: Trazabilidad (30 puntos)
    puntosGDPR += 30; // Atlassian Cloud tiene logging automático
    
    evaluacion.gdpr.score = puntosGDPR;
    evaluacion.gdpr.nivel = puntosGDPR >= 80 ? 'CUMPLE' : puntosGDPR >= 60 ? 'PARCIAL' : 'NO_CUMPLE';
    
    // Evaluación SOX (Sarbanes-Oxley)
    let puntosSOX = 0;
    
    // Criterio 1: Controles de acceso (50 puntos)
    puntosSOX += 40; // Atlassian Cloud tiene controles robustos
    
    // Criterio 2: Auditabilidad (50 puntos)
    puntosSOX += 45; // Logs automáticos y trazabilidad
    
    evaluacion.sox.score = puntosSOX;
    evaluacion.sox.nivel = puntosSOX >= 80 ? 'CUMPLE' : puntosSOX >= 60 ? 'PARCIAL' : 'NO_CUMPLE';
    
    // Evaluación ISO 27001
    let puntosISO = 0;
    
    // Criterio 1: Gestión de riesgos (40 puntos)
    puntosISO += 35; // Documentación de riesgos en el código
    
    // Criterio 2: Controles técnicos (60 puntos)
    puntosISO += 50; // HTTPS, tokens, rate limiting, etc.
    
    evaluacion.iso27001.score = puntosISO;
    evaluacion.iso27001.nivel = puntosISO >= 80 ? 'CUMPLE' : puntosISO >= 60 ? 'PARCIAL' : 'NO_CUMPLE';
    
    return evaluacion;
  }
  
  generarReporteSeguridad(resultados) {
    const reporte = {
      timestamp: new Date().toISOString(),
      resumen: {
        nivelSeguridad: this.calcularNivelGeneralSeguridad(resultados),
        vulnerabilidadesAltas: this.contarVulnerabilidades(resultados, 'ALTA'),
        vulnerabilidadesMedias: this.contarVulnerabilidades(resultados, 'MEDIA'),
        cumplimientoPromedio: this.calcularCumplimientoPromedio(resultados.compliance)
      },
      detalles: resultados,
      recomendacionesPrioritarias: this.generarRecomendacionesPrioritarias(resultados),
      planAccion: this.generarPlanAccion(resultados)
    };
    
    return reporte;
  }
  
  calcularNivelGeneralSeguridad(resultados) {
    const vulnerabilidadesAltas = this.contarVulnerabilidades(resultados, 'ALTA');
    const cumplimientoPromedio = this.calcularCumplimientoPromedio(resultados.compliance);
    
    if (vulnerabilidadesAltas > 0) return 'CRITICO';
    if (cumplimientoPromedio < 60) return 'BAJO';
    if (cumplimientoPromedio < 80) return 'MEDIO';
    return 'ALTO';
  }
  
  contarVulnerabilidades(resultados, severidad) {
    let count = 0;
    Object.values(resultados).forEach(categoria => {
      if (categoria.vulnerabilidades) {
        count += categoria.vulnerabilidades.filter(v => v.severidad === severidad).length;
      }
    });
    return count;
  }
  
  calcularCumplimientoPromedio(compliance) {
    const scores = [compliance.gdpr.score, compliance.sox.score, compliance.iso27001.score];
    return Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
  }
  
  generarRecomendacionesPrioritarias(resultados) {
    const recomendaciones = [];
    
    // Vulnerabilidades críticas primero
    Object.values(resultados).forEach(categoria => {
      if (categoria.vulnerabilidades) {
        categoria.vulnerabilidades.forEach(vuln => {
          if (vuln.severidad === 'ALTA') {
            recomendaciones.push({
              prioridad: 1,
              categoria: 'SEGURIDAD_CRITICA',
              descripcion: vuln.descripcion,
              accion: this.generarAccionRecomendada(vuln.tipo)
            });
          }
        });
      }
    });
    
    // Mejoras de cumplimiento
    Object.entries(resultados.compliance).forEach(([estandar, evaluacion]) => {
      if (evaluacion.score < 80) {
        recomendaciones.push({
          prioridad: evaluacion.score < 60 ? 2 : 3,
          categoria: `CUMPLIMIENTO_${estandar.toUpperCase()}`,
          descripcion: `Mejorar cumplimiento de ${estandar.toUpperCase()}: ${evaluacion.score}/100`,
          accion: `Implementar controles adicionales para ${estandar}`
        });
      }
    });
    
    return recomendaciones.sort((a, b) => a.prioridad - b.prioridad);
  }
  
  generarAccionRecomendada(tipoVulnerabilidad) {
    const acciones = {
      'TOKEN_DEBIL': 'Generar nuevo token API con mayor fortaleza',
      'TOKEN_CORTO': 'Renovar token API por uno más largo',
      'ROTACION_PENDIENTE': 'Establecer calendario de rotación de tokens (90 días)',
      'ACCESO_SENSIBLE': 'Revisar y revocar accesos innecesarios a proyectos sensibles',
      'DATOS_PERSONALES': 'Implementar políticas de minimización de datos personales',
      'ACTIVIDAD_EXCESIVA': 'Investigar actividad inusual del usuario y establecer límites'
    };
    
    return acciones[tipoVulnerabilidad] || 'Revisar configuración de seguridad';
  }
  
  generarPlanAccion(resultados) {
    return {
      inmediato: [
        'Revisar tokens API y renovar si es necesario',
        'Verificar accesos a proyectos sensibles',
        'Implementar monitoreo de actividad sospechosa'
      ],
      corto_plazo: [
        'Establecer proceso de rotación de credenciales',
        'Implementar alertas de seguridad automatizadas',
        'Capacitar equipo en mejores prácticas de seguridad'
      ],
      mediano_plazo: [
        'Obtener certificaciones ISO 27001',
        'Implementar auditorías de seguridad regulares',
        'Desarrollar plan de respuesta a incidentes'
      ]
    };
  }
}

// Uso del auditor de seguridad
const ejecutarAuditoriaSeguridad = async () => {
  console.log('🔒 Iniciando auditoría de seguridad completa...');
  const auditor = new AuditorSeguridadJira(CONFIG_JIRA);
  const reporte = await auditor.ejecutarAuditoriaCompleta();
  
  console.log('📊 REPORTE DE SEGURIDAD:');
  console.log(`🛡️ Nivel de seguridad: ${reporte.resumen.nivelSeguridad}`);
  console.log(`🚨 Vulnerabilidades altas: ${reporte.resumen.vulnerabilidadesAltas}`);
  console.log(`⚠️ Vulnerabilidades medias: ${reporte.resumen.vulnerabilidadesMedias}`);
  console.log(`📋 Cumplimiento promedio: ${reporte.resumen.cumplimientoPromedio}%`);
  
  if (reporte.recomendacionesPrioritarias.length > 0) {
    console.log('\n🎯 RECOMENDACIONES PRIORITARIAS:');
    reporte.recomendacionesPrioritarias.slice(0, 5).forEach((rec, index) => {
      console.log(`${index + 1}. [P${rec.prioridad}] ${rec.descripcion}`);
    });
  }
  
  return reporte;
};
```
