# Monitoreo

> Aprende a habilitar y configurar OpenTelemetry para Claude Code.

Claude Code admite métricas y eventos de OpenTelemetry (OTel) para monitoreo y observabilidad.

Todas las métricas son datos de series temporales exportados a través del protocolo de métricas estándar de OpenTelemetry, y los eventos se exportan a través del protocolo de registros/eventos de OpenTelemetry. Es responsabilidad del usuario asegurarse de que sus backends de métricas y registros estén configurados correctamente y que la granularidad de la agregación cumpla con sus requisitos de monitoreo.

<Note>
  El soporte de OpenTelemetry está actualmente en beta y los detalles están sujetos a cambios.
</Note>

## Inicio Rápido

Configura OpenTelemetry usando variables de entorno:

```bash
# 1. Habilitar telemetría
export CLAUDE_CODE_ENABLE_TELEMETRY=1

# 2. Elegir exportadores (ambos son opcionales - configura solo lo que necesites)
export OTEL_METRICS_EXPORTER=otlp       # Opciones: otlp, prometheus, console
export OTEL_LOGS_EXPORTER=otlp          # Opciones: otlp, console

# 3. Configurar el endpoint OTLP (para el exportador OTLP)
export OTEL_EXPORTER_OTLP_PROTOCOL=grpc
export OTEL_EXPORTER_OTLP_ENDPOINT=http://localhost:4317

# 4. Establecer autenticación (si es necesario)
export OTEL_EXPORTER_OTLP_HEADERS="Authorization=Bearer tu-token"

# 5. Para depuración: reducir los intervalos de exportación
export OTEL_METRIC_EXPORT_INTERVAL=10000  # 10 segundos (por defecto: 60000ms)
export OTEL_LOGS_EXPORT_INTERVAL=5000     # 5 segundos (por defecto: 5000ms)

# 6. Ejecutar Claude Code
claude
```

<Note>
  Los intervalos de exportación por defecto son de 60 segundos para las métricas y 5 segundos para los registros. Durante la configuración, es posible que desees usar intervalos más cortos para fines de depuración. Recuerda restablecerlos para el uso en producción.
</Note>

Para ver todas las opciones de configuración, consulta la [especificación de OpenTelemetry](https://github.com/open-telemetry/opentelemetry-specification/blob/main/specification/protocol/exporter.md#configuration-options).

## Configuración del Administrador

Los administradores pueden configurar los ajustes de OpenTelemetry para todos los usuarios a través del archivo de configuración gestionado. Esto permite un control centralizado de los ajustes de telemetría en toda una organización. Consulta la [precedencia de la configuración](/en/docs/claude-code/settings#settings-precedence) para obtener más información sobre cómo se aplican los ajustes.

El archivo de configuración gestionado se encuentra en:

- macOS: `/Library/Application Support/ClaudeCode/managed-settings.json`
- Linux y WSL: `/etc/claude-code/managed-settings.json`
- Windows: `C:\ProgramData\ClaudeCode\managed-settings.json`

Ejemplo de configuración en el archivo de configuración gestionado:

```json
{
  "env": {
    "CLAUDE_CODE_ENABLE_TELEMETRY": "1",
    "OTEL_METRICS_EXPORTER": "otlp",
    "OTEL_LOGS_EXPORTER": "otlp",
    "OTEL_EXPORTER_OTLP_PROTOCOL": "grpc",
    "OTEL_EXPORTER_OTLP_ENDPOINT": "http://collector.empresa.com:4317",
    "OTEL_EXPORTER_OTLP_HEADERS": "Authorization=Bearer token-empresa"
  }
}
```

<Note>
  Los ajustes gestionados se pueden distribuir a través de MDM (Gestión de Dispositivos Móviles) u otras soluciones de gestión de dispositivos. Las variables de entorno definidas en el archivo de configuración gestionado tienen alta precedencia y no pueden ser anuladas por los usuarios.
</Note>

## Detalles de Configuración

### Variables de Configuración Comunes

| Variable de Entorno | Descripción | Valores de Ejemplo |
| --- | --- | --- |
| `CLAUDE_CODE_ENABLE_TELEMETRY` | Habilita la recopilación de telemetría (requerido) | `1` |
| `OTEL_METRICS_EXPORTER` | Tipo(s) de exportador de métricas (separados por comas) | `console`, `otlp`, `prometheus` |
| `OTEL_LOGS_EXPORTER` | Tipo(s) de exportador de registros/eventos (separados por comas) | `console`, `otlp` |
| `OTEL_EXPORTER_OTLP_PROTOCOL` | Protocolo para el exportador OTLP (todas las señales) | `grpc`, `http/json`, `http/protobuf` |
| `OTEL_EXPORTER_OTLP_ENDPOINT` | Endpoint del colector OTLP (todas las señales) | `http://localhost:4317` |
| `OTEL_EXPORTER_OTLP_METRICS_PROTOCOL` | Protocolo para métricas (anula el general) | `grpc`, `http/json`, `http/protobuf` |
| `OTEL_EXPORTER_OTLP_METRICS_ENDPOINT` | Endpoint de métricas OTLP (anula el general) | `http://localhost:4318/v1/metrics` |
| `OTEL_EXPORTER_OTLP_LOGS_PROTOCOL` | Protocolo para registros (anula el general) | `grpc`, `http/json`, `http/protobuf` |
| `OTEL_EXPORTER_OTLP_LOGS_ENDPOINT` | Endpoint de registros OTLP (anula el general) | `http://localhost:4318/v1/logs` |
| `OTEL_EXPORTER_OTLP_HEADERS` | Cabeceras de autenticación para OTLP | `Authorization=Bearer token` |
| `OTEL_EXPORTER_OTLP_METRICS_CLIENT_KEY` | Clave de cliente para autenticación mTLS | Ruta al archivo de clave de cliente |
| `OTEL_EXPORTER_OTLP_METRICS_CLIENT_CERTIFICATE` | Certificado de cliente para autenticación mTLS | Ruta al archivo de certificado de cliente |
| `OTEL_METRIC_EXPORT_INTERVAL` | Intervalo de exportación en milisegundos (por defecto: 60000) | `5000`, `60000` |
| `OTEL_LOGS_EXPORT_INTERVAL` | Intervalo de exportación de registros en milisegundos (por defecto: 5000) | `1000`, `10000` |
| `OTEL_LOG_USER_PROMPTS` | Habilitar el registro del contenido de los prompts del usuario (por defecto: deshabilitado) | `1` para habilitar |

### Control de Cardinalidad de Métricas

Las siguientes variables de entorno controlan qué atributos se incluyen en las métricas para gestionar la cardinalidad:

| Variable de Entorno | Descripción | Valor por Defecto | Ejemplo para Deshabilitar |
| --- | --- | --- | --- |
| `OTEL_METRICS_INCLUDE_SESSION_ID` | Incluir el atributo session.id en las métricas | `true` | `false` |
| `OTEL_METRICS_INCLUDE_VERSION` | Incluir el atributo app.version en las métricas | `false` | `true` |
| `OTEL_METRICS_INCLUDE_ACCOUNT_UUID` | Incluir el atributo user.account_uuid en las métricas | `true` | `false` |

Estas variables ayudan a controlar la cardinalidad de las métricas, lo que afecta los requisitos de almacenamiento y el rendimiento de las consultas en tu backend de métricas. Una menor cardinalidad generalmente significa un mejor rendimiento y menores costos de almacenamiento, pero datos menos granulares para el análisis.

### Cabeceras Dinámicas

Para entornos empresariales que requieren autenticación dinámica, puedes configurar un script para generar cabeceras dinámicamente:

#### Configuración de Ajustes

Añade a tu `.claude/settings.json`:

```json
{
  "otelHeadersHelper": "/bin/generate_opentelemetry_headers.sh"
}
```

#### Requisitos del Script

El script debe devolver un JSON válido con pares clave-valor de tipo cadena que representen las cabeceras HTTP:

```bash
#!/bin/bash
# Ejemplo: Múltiples cabeceras
echo "{\"Authorization\": \"Bearer $(get-token.sh)\"", \"X-API-Key\": \"$(get-api-key.sh)\"}"
```

#### Limitaciones Importantes

**Las cabeceras se obtienen solo al inicio, no durante la ejecución.** Esto se debe a limitaciones de la arquitectura del exportador de OpenTelemetry.

Para escenarios que requieren una actualización frecuente de tokens, usa un Colector de OpenTelemetry como un proxy que pueda actualizar sus propias cabeceras.

### Soporte para Organizaciones con Múltiples Equipos

Las organizaciones con múltiples equipos o departamentos pueden añadir atributos personalizados para distinguir entre diferentes grupos usando la variable de entorno `OTEL_RESOURCE_ATTRIBUTES`:

```bash
# Añadir atributos personalizados para la identificación de equipos
export OTEL_RESOURCE_ATTRIBUTES="departamento=ingenieria,equipo.id=plataforma,centro_de_costo=ing-123"
```

Estos atributos personalizados se incluirán en todas las métricas y eventos, permitiéndote:

- Filtrar métricas por equipo o departamento.
- Rastrear costos por centro de costo.
- Crear paneles de control específicos para cada equipo.
- Configurar alertas para equipos específicos.

### Configuraciones de Ejemplo

```bash
# Depuración en la consola (intervalos de 1 segundo)
export CLAUDE_CODE_ENABLE_TELEMETRY=1
export OTEL_METRICS_EXPORTER=console
export OTEL_METRIC_EXPORT_INTERVAL=1000

# OTLP/gRPC
export CLAUDE_CODE_ENABLE_TELEMETRY=1
export OTEL_METRICS_EXPORTER=otlp
export OTEL_EXPORTER_OTLP_PROTOCOL=grpc
export OTEL_EXPORTER_OTLP_ENDPOINT=http://localhost:4317

# Prometheus
export CLAUDE_CODE_ENABLE_TELEMETRY=1
export OTEL_METRICS_EXPORTER=prometheus

# Múltiples exportadores
export CLAUDE_CODE_ENABLE_TELEMETRY=1
export OTEL_METRICS_EXPORTER=console,otlp
export OTEL_EXPORTER_OTLP_PROTOCOL=http/json

# Diferentes endpoints/backends para métricas y registros
export CLAUDE_CODE_ENABLE_TELEMETRY=1
export OTEL_METRICS_EXPORTER=otlp
export OTEL_LOGS_EXPORTER=otlp
export OTEL_EXPORTER_OTLP_METRICS_PROTOCOL=http/protobuf
export OTEL_EXPORTER_OTLP_METRICS_ENDPOINT=http://metrics.empresa.com:4318
export OTEL_EXPORTER_OTLP_LOGS_PROTOCOL=grpc
export OTEL_EXPORTER_OTLP_LOGS_ENDPOINT=http://logs.empresa.com:4317

# Solo métricas (sin eventos/registros)
export CLAUDE_CODE_ENABLE_TELEMETRY=1
export OTEL_METRICS_EXPORTER=otlp
export OTEL_EXPORTER_OTLP_PROTOCOL=grpc
export OTEL_EXPORTER_OTLP_ENDPOINT=http://localhost:4317

# Solo eventos/registros (sin métricas)
export CLAUDE_CODE_ENABLE_TELEMETRY=1
export OTEL_LOGS_EXPORTER=otlp
export OTEL_EXPORTER_OTLP_PROTOCOL=grpc
export OTEL_EXPORTER_OTLP_ENDPOINT=http://localhost:4317
```

## Métricas y Eventos Disponibles

### Atributos Estándar

Todas las métricas y eventos comparten estos atributos estándar:

| Atributo | Descripción | Controlado Por |
| --- | --- | --- |
| `session.id` | Identificador único de sesión | `OTEL_METRICS_INCLUDE_SESSION_ID` (por defecto: true) |
| `app.version` | Versión actual de Claude Code | `OTEL_METRICS_INCLUDE_VERSION` (por defecto: false) |
| `organization.id` | UUID de la organización (cuando está autenticado) | Siempre incluido cuando está disponible |
| `user.account_uuid` | UUID de la cuenta (cuando está autenticado) | `OTEL_METRICS_INCLUDE_ACCOUNT_UUID` (por defecto: true) |
| `terminal.type` | Tipo de terminal (p. ej., `iTerm.app`, `vscode`, `cursor`, `tmux`) | Siempre incluido cuando se detecta |

### Métricas

Claude Code exporta las siguientes métricas:

| Nombre de la Métrica | Descripción | Unidad |
| --- | --- | --- |
| `claude_code.session.count` | Contador de sesiones de CLI iniciadas | count |
| `claude_code.lines_of_code.count` | Contador de líneas de código modificadas | count |
| `claude_code.pull_request.count` | Número de pull requests creados | count |
| `claude_code.commit.count` | Número de commits de git creados | count |
| `claude_code.cost.usage` | Costo de la sesión de Claude Code | USD |
| `claude_code.token.usage` | Número de tokens utilizados | tokens |
| `claude_code.code_edit_tool.decision` | Contador de decisiones de permiso de la herramienta de edición de código | count |
| `claude_code.active_time.total` | Tiempo activo total en segundos | s |

### Detalles de las Métricas

#### Contador de Sesiones

Se incrementa al inicio de cada sesión.

**Atributos**:

- Todos los [atributos estándar](#standard-attributes)

#### Contador de Líneas de Código

Se incrementa cuando se añade o elimina código.

**Atributos**:

- Todos los [atributos estándar](#standard-attributes)
- `type`: (`"added"`, `"removed"`)

#### Contador de Pull Requests

Se incrementa al crear pull requests a través de Claude Code.

**Atributos**:

- Todos los [atributos estándar](#standard-attributes)

#### Contador de Commits

Se incrementa al crear commits de git a través de Claude Code.

**Atributos**:

- Todos los [atributos estándar](#standard-attributes)

#### Contador de Costos

Se incrementa después de cada solicitud a la API.

**Atributos**:

- Todos los [atributos estándar](#standard-attributes)
- `model`: Identificador del modelo (p. ej., "claude-3-5-sonnet-20241022")

#### Contador de Tokens

Se incrementa después de cada solicitud a la API.

**Atributos**:

- Todos los [atributos estándar](#standard-attributes)
- `type`: (`"input"`, `"output"`, `"cacheRead"`, `"cacheCreation"`)
- `model`: Identificador del modelo (p. ej., "claude-3-5-sonnet-20241022")

#### Contador de Decisiones de la Herramienta de Edición de Código

Se incrementa cuando el usuario acepta o rechaza el uso de las herramientas Edit, MultiEdit, Write o NotebookEdit.

**Atributos**:

- Todos los [atributos estándar](#standard-attributes)
- `tool`: Nombre de la herramienta (`"Edit"`, `"MultiEdit"`, `"Write"`, `"NotebookEdit"`)
- `decision`: Decisión del usuario (`"accept"`, `"reject"`)
- `language`: Lenguaje de programación del archivo editado (p. ej., `"TypeScript"`, `"Python"`, `"JavaScript"`, `"Markdown"`). Devuelve `"unknown"` para extensiones de archivo no reconocidas.

#### Contador de Tiempo Activo

Rastrea el tiempo real dedicado a usar activamente Claude Code (no el tiempo de inactividad). Esta métrica se incrementa durante las interacciones del usuario, como escribir prompts o recibir respuestas.

**Atributos**:

- Todos los [atributos estándar](#standard-attributes)

### Eventos

Claude Code exporta los siguientes eventos a través de registros/eventos de OpenTelemetry (cuando `OTEL_LOGS_EXPORTER` está configurado):

#### Evento de Prompt del Usuario

Se registra cuando un usuario envía un prompt.

**Nombre del Evento**: `claude_code.user_prompt`

**Atributos**:

- Todos los [atributos estándar](#standard-attributes)
- `event.name`: `"user_prompt"`
- `event.timestamp`: Marca de tiempo ISO 8601
- `prompt_length`: Longitud del prompt
- `prompt`: Contenido del prompt (redactado por defecto, habilitar con `OTEL_LOG_USER_PROMPTS=1`)

#### Evento de Resultado de Herramienta

Se registra cuando una herramienta completa su ejecución.

**Nombre del Evento**: `claude_code.tool_result`

**Atributos**:

- Todos los [atributos estándar](#standard-attributes)
- `event.name`: `"tool_result"`
- `event.timestamp`: Marca de tiempo ISO 8601
- `tool_name`: Nombre de la herramienta
- `success`: `"true"` o `"false"`
- `duration_ms`: Tiempo de ejecución en milisegundos
- `error`: Mensaje de error (si falló)
- `decision`: `"accept"` o `"reject"`
- `source`: Fuente de la decisión - `"config"`, `"user_permanent"`, `"user_temporary"`, `"user_abort"`, o `"user_reject"`
- `tool_parameters`: Cadena JSON que contiene parámetros específicos de la herramienta (cuando está disponible)
  - Para la herramienta Bash: incluye `bash_command`, `full_command`, `timeout`, `description`, `sandbox`

#### Evento de Solicitud a la API

Se registra para cada solicitud a la API de Claude.

**Nombre del Evento**: `claude_code.api_request`

**Atributos**:

- Todos los [atributos estándar](#standard-attributes)
- `event.name`: `"api_request"`
- `event.timestamp`: Marca de tiempo ISO 8601
- `model`: Modelo utilizado (p. ej., "claude-3-5-sonnet-20241022")
- `cost_usd`: Costo estimado en USD
- `duration_ms`: Duración de la solicitud en milisegundos
- `input_tokens`: Número de tokens de entrada
- `output_tokens`: Número de tokens de salida
- `cache_read_tokens`: Número de tokens leídos de la caché
- `cache_creation_tokens`: Número de tokens utilizados para la creación de la caché

#### Evento de Error de la API

Se registra cuando una solicitud a la API de Claude falla.

**Nombre del Evento**: `claude_code.api_error`

**Atributos**:

- Todos los [atributos estándar](#standard-attributes)
- `event.name`: `"api_error"`
- `event.timestamp`: Marca de tiempo ISO 8601
- `model`: Modelo utilizado (p. ej., "claude-3-5-sonnet-20241022")
- `error`: Mensaje de error
- `status_code`: Código de estado HTTP (si aplica)
- `duration_ms`: Duración de la solicitud en milisegundos
- `attempt`: Número de intento (para solicitudes reintentadas)

#### Evento de Decisión de Herramienta

Se registra cuando se toma una decisión de permiso de herramienta (aceptar/rechazar).

**Nombre del Evento**: `claude_code.tool_decision`

**Atributos**:

- Todos los [atributos estándar](#standard-attributes)
- `event.name`: `"tool_decision"`
- `event.timestamp`: Marca de tiempo ISO 8601
- `tool_name`: Nombre de la herramienta (p. ej., "Read", "Edit", "MultiEdit", "Write", "NotebookEdit", etc.)
- `decision`: `"accept"` o `"reject"`
- `source`: Fuente de la decisión - `"config"`, `"user_permanent"`, `"user_temporary"`, `"user_abort"`, o `"user_reject"`

## Interpretación de los Datos de Métricas y Eventos

Las métricas exportadas por Claude Code proporcionan información valiosa sobre los patrones de uso y la productividad. Aquí hay algunas visualizaciones y análisis comunes que puedes crear:

### Monitoreo de Uso

| Métrica | Oportunidad de Análisis |
| --- | --- |
| `claude_code.token.usage` | Desglosar por `type` (entrada/salida), usuario, equipo o modelo |
| `claude_code.session.count` | Rastrear la adopción y el compromiso a lo largo del tiempo |
| `claude_code.lines_of_code.count` | Medir la productividad rastreando las adiciones/eliminaciones de código |
| `claude_code.commit.count` & `claude_code.pull_request.count` | Entender el impacto en los flujos de trabajo de desarrollo |

### Monitoreo de Costos

La métrica `claude_code.cost.usage` ayuda a:

- Rastrear las tendencias de uso entre equipos o individuos.
- Identificar sesiones de alto uso para optimización.

<Note>
  Las métricas de costos son aproximaciones. Para datos de facturación oficiales, consulta a tu proveedor de API (Consola de Anthropic, AWS Bedrock o Google Cloud Vertex).
</Note>

### Alertas y Segmentación

Alertas comunes a considerar:

- Picos de costos
- Consumo inusual de tokens
- Alto volumen de sesiones de usuarios específicos

Todas las métricas se pueden segmentar por `user.account_uuid`, `organization.id`, `session.id`, `model` y `app.version`.

### Análisis de Eventos

Los datos de eventos proporcionan información detallada sobre las interacciones de Claude Code:

**Patrones de Uso de Herramientas**: Analiza los eventos de resultados de herramientas para identificar:

- Herramientas más utilizadas
- Tasas de éxito de las herramientas
- Tiempos promedio de ejecución de las herramientas
- Patrones de error por tipo de herramienta

**Monitoreo de Rendimiento**: Rastrea las duraciones de las solicitudes a la API y los tiempos de ejecución de las herramientas para identificar cuellos de botella de rendimiento.

## Consideraciones del Backend

Tu elección de backends de métricas y registros determinará los tipos de análisis que puedes realizar:

### Para Métricas:

- **Bases de datos de series temporales (p. ej., Prometheus)**: Cálculos de tasas, métricas agregadas.
- **Almacenes columnares (p. ej., ClickHouse)**: Consultas complejas, análisis de usuarios únicos.
- **Plataformas de observabilidad completas (p. ej., Honeycomb, Datadog)**: Consultas avanzadas, visualización, alertas.

### Para Eventos/Registros:

- **Sistemas de agregación de registros (p. ej., Elasticsearch, Loki)**: Búsqueda de texto completo, análisis de registros.
- **Almacenes columnares (p. ej., ClickHouse)**: Análisis de eventos estructurados.
- **Plataformas de observabilidad completas (p. ej., Honeycomb, Datadog)**: Correlación entre métricas y eventos.

Para organizaciones que requieren métricas de Usuarios Activos Diarios/Semanales/Mensuales (DAU/WAU/MAU), considera backends que admitan consultas eficientes de valores únicos.

## Información del Servicio

Todas las métricas y eventos se exportan con los siguientes atributos de recurso:

- `service.name`: `claude-code`
- `service.version`: Versión actual de Claude Code
- `os.type`: Tipo de sistema operativo (p. ej., `linux`, `darwin`, `windows`)
- `os.version`: Cadena de versión del sistema operativo
- `host.arch`: Arquitectura del host (p. ej., `amd64`, `arm64`)
- `wsl.version`: Número de versión de WSL (solo presente cuando se ejecuta en el Subsistema de Windows para Linux)
- Nombre del Medidor: `com.anthropic.claude_code`

## Recursos para la Medición del ROI

Para una guía completa sobre cómo medir el retorno de la inversión de Claude Code, incluyendo la configuración de la telemetría, el análisis de costos, las métricas de productividad y los informes automatizados, consulta la [Guía de Medición del ROI de Claude Code](https://github.com/anthropics/claude-code-monitoring-guide). Este repositorio proporciona configuraciones de Docker Compose listas para usar, configuraciones de Prometheus y OpenTelemetry, y plantillas para generar informes de productividad integrados con herramientas como Linear.

## Consideraciones de Seguridad/Privacidad

- La telemetría es opcional y requiere una configuración explícita.
- La información sensible como claves de API o contenido de archivos nunca se incluye en las métricas o eventos.
- El contenido de los prompts del usuario se redacta por defecto - solo se registra la longitud del prompt. Para habilitar el registro de prompts del usuario, establece `OTEL_LOG_USER_PROMPTS=1`