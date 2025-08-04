# Configuración de Claude Code

> Configura Claude Code con ajustes globales y a nivel de proyecto, y variables de entorno.

Claude Code ofrece una variedad de ajustes para configurar su comportamiento y satisfacer tus necesidades. Puedes configurar Claude Code ejecutando el comando `/config` cuando usas el REPL interactivo.

## Archivos de configuración

El archivo `settings.json` es nuestro mecanismo oficial para configurar Claude
Code a través de ajustes jerárquicos:

- **Ajustes de usuario** se definen en `~/.claude/settings.json` y se aplican a todos
  los proyectos.
- **Ajustes de proyecto** se guardan en el directorio de tu proyecto:
  - `.claude/settings.json` para ajustes que se registran en el control de versiones y se comparten con tu equipo.
  - `.claude/settings.local.json` para ajustes que no se registran, útil para preferencias personales y experimentación. Claude Code configurará git para ignorar `.claude/settings.local.json` cuando se cree.
- Para despliegues empresariales de Claude Code, también admitimos **ajustes de políticas gestionadas por la empresa**. Estos tienen prioridad sobre los ajustes de usuario y de proyecto. Los administradores de sistemas pueden desplegar políticas en:
  - macOS: `/Library/Application Support/ClaudeCode/managed-settings.json`
  - Linux y WSL: `/etc/claude-code/managed-settings.json`
  - Windows: `C:\ProgramData\ClaudeCode\managed-settings.json`

```JSON Ejemplo de settings.json
{
  "permissions": {
    "allow": [
      "Bash(npm run lint)",
      "Bash(npm run test:*)",
      "Read(~/.zshrc)"
    ],
    "deny": [
      "Bash(curl:*)"
    ]
  },
  "env": {
    "CLAUDE_CODE_ENABLE_TELEMETRY": "1",
    "OTEL_METRICS_EXPORTER": "otlp"
  }
}
```

### Ajustes disponibles

`settings.json` admite varias opciones:

| Clave | Descripción | Ejemplo |
| :--- | :--- | :--- |
| `apiKeyHelper` | Script personalizado, a ejecutar en `/bin/sh`, para generar un valor de autenticación. Este valor se enviará como cabeceras `X-Api-Key` y `Authorization: Bearer` para las solicitudes del modelo. | `/bin/generate_temp_api_key.sh` |
| `cleanupPeriodDays` | Cuánto tiempo retener localmente las transcripciones de chat (por defecto: 30 días). | `20` |
| `env` | Variables de entorno que se aplicarán a cada sesión. | `{"FOO": "bar"}` |
| `includeCoAuthoredBy` | Si se debe incluir la línea `co-authored-by Claude` en los commits de git y pull requests (por defecto: `true`). | `false` |
| `permissions` | Consulta la tabla a continuación para la estructura de los permisos. | |
| `hooks` | Configura comandos personalizados para ejecutar antes o después de las ejecuciones de herramientas. Consulta la [documentación de hooks](hooks). | `{"PreToolUse": {"Bash": "echo 'Ejecutando comando...'"}}` |
| `model` | Sobrescribe el modelo por defecto a usar para Claude Code. | `"claude-3-5-sonnet-20241022"` |
| `forceLoginMethod` | Usa `claudeai` para restringir el inicio de sesión a cuentas de Claude.ai, `console` para restringir el inicio de sesión a cuentas de la Consola de Anthropic (facturación por uso de API). | `claudeai` |
| `enableAllProjectMcpServers` | Aprobar automáticamente todos los servidores MCP definidos en los archivos `.mcp.json` del proyecto. | `true` |
| `enabledMcpjsonServers` | Lista de servidores MCP específicos de los archivos `.mcp.json` para aprobar. | `["memory", "github"]` |
| `disabledMcpjsonServers` | Lista de servidores MCP específicos de los archivos `.mcp.json` para rechazar. | `["filesystem"]` |
| `awsAuthRefresh` | Script personalizado que modifica el directorio `.aws` (consulta la [configuración avanzada de credenciales](/en/docs/claude-code/amazon-bedrock#advanced-credential-configuration)). | `aws sso login --profile myprofile` |
| `awsCredentialExport` | Script personalizado que devuelve JSON con credenciales de AWS (consulta la [configuración avanzada de credenciales](/en/docs/claude-code/amazon-bedrock#advanced-credential-configuration)). | `/bin/generate_aws_grant.sh` |

### Ajustes de permisos

| Claves | Descripción | Ejemplo |
| :--- | :--- | :--- |
| `allow` | Array de [reglas de permiso](/en/docs/claude-code/iam#configuring-permissions) para permitir el uso de herramientas. | `[ "Bash(git diff:*)" ]` |
| `deny` | Array de [reglas de permiso](/en/docs/claude-code/iam#configuring-permissions) para denegar el uso de herramientas. | `[ "WebFetch", "Bash(curl:*)" ]` |
| `additionalDirectories` | [Directorios de trabajo](/en/docs/claude-code/iam#working-directories) adicionales a los que Claude tiene acceso. | `[ "../docs/" ]` |
| `defaultMode` | [Modo de permiso](/en/docs/claude-code/iam#permission-modes) por defecto al abrir Claude Code. | `"acceptEdits"` |
| `disableBypassPermissionsMode` | Establece en `"disable"` para evitar que se active el modo `bypassPermissions`. Consulta los [ajustes de políticas gestionadas](iam#enterprise-managed-policy-settings). | `"disable"` |

### Precedencia de los ajustes

Los ajustes se aplican en orden de precedencia:

1. Políticas empresariales (consulta la [documentación de IAM](/en/docs/claude-code/iam#enterprise-managed-policy-settings))
2. Argumentos de la línea de comandos
3. Ajustes locales del proyecto
4. Ajustes compartidos del proyecto
5. Ajustes de usuario

## Configuración de subagentes

Claude Code admite subagentes de IA personalizados que se pueden configurar tanto a nivel de usuario como de proyecto. Estos subagentes se almacenan como archivos Markdown con frontmatter YAML:

- **Subagentes de usuario**: `~/.claude/agents/` - Disponibles en todos tus proyectos.
- **Subagentes de proyecto**: `.claude/agents/` - Específicos de tu proyecto y se pueden compartir con tu equipo.

Los archivos de subagentes definen asistentes de IA especializados con prompts personalizados y permisos de herramientas. Aprende más sobre cómo crear y usar subagentes en la [documentación de subagentes](/en/docs/claude-code/sub-agents).

## Variables de entorno

Claude Code admite las siguientes variables de entorno para controlar su comportamiento:

<Note>
  Todas las variables de entorno también se pueden configurar en [`settings.json`](#available-settings). Esto es útil como una forma de establecer automáticamente variables de entorno para cada sesión, o para implementar un conjunto de variables de entorno para todo tu equipo u organización.
</Note>

| Variable | Propósito |
| :--- | :--- |
| `ANTHROPIC_API_KEY` | Clave de API enviada como cabecera `X-Api-Key`, típicamente para el SDK de Claude (para uso interactivo, ejecuta `/login`). |
| `ANTHROPIC_AUTH_TOKEN` | Valor personalizado para la cabecera `Authorization` (el valor que establezcas aquí tendrá el prefijo `Bearer `). |
| `ANTHROPIC_CUSTOM_HEADERS` | Cabeceras personalizadas que quieres añadir a la solicitud (en formato `Nombre: Valor`). |
| `ANTHROPIC_MODEL` | Nombre del modelo personalizado a usar (consulta la [Configuración del Modelo](/en/docs/claude-code/bedrock-vertex-proxies#model-configuration)). |
| `ANTHROPIC_SMALL_FAST_MODEL` | Nombre del [modelo de clase Haiku para tareas en segundo plano](/en/docs/claude-code/costs). |
| `ANTHROPIC_SMALL_FAST_MODEL_AWS_REGION` | Sobrescribe la región de AWS para el modelo pequeño/rápido cuando se usa Bedrock. |
| `AWS_BEARER_TOKEN_BEDROCK` | Clave de API de Bedrock para autenticación (consulta las [claves de API de Bedrock](https://aws.amazon.com/blogs/machine-learning/accelerate-ai-development-with-amazon-bedrock-api-keys/)). |
| `BASH_DEFAULT_TIMEOUT_MS` | Tiempo de espera por defecto para comandos bash de larga duración. |
| `BASH_MAX_TIMEOUT_MS` | Tiempo de espera máximo que el modelo puede establecer para comandos bash de larga duración. |
| `BASH_MAX_OUTPUT_LENGTH` | Número máximo de caracteres en las salidas de bash antes de que se trunquen por el medio. |
| `CLAUDE_BASH_MAINTAIN_PROJECT_WORKING_DIR` | Volver al directorio de trabajo original después de cada comando Bash. |
| `CLAUDE_CODE_API_KEY_HELPER_TTL_MS` | Intervalo en milisegundos en el que se deben actualizar las credenciales (cuando se usa `apiKeyHelper`). |
| `CLAUDE_CODE_IDE_SKIP_AUTO_INSTALL` | Omitir la autoinstalación de extensiones de IDE. |
| `CLAUDE_CODE_MAX_OUTPUT_TOKENS` | Establecer el número máximo de tokens de salida para la mayoría de las solicitudes. |
| `CLAUDE_CODE_USE_BEDROCK` | Usar [Bedrock](/en/docs/claude-code/amazon-bedrock). |
| `CLAUDE_CODE_USE_VERTEX` | Usar [Vertex](/en/docs/claude-code/google-vertex-ai). |
| `CLAUDE_CODE_SKIP_BEDROCK_AUTH` | Omitir la autenticación de AWS para Bedrock (p. ej., cuando se usa un gateway de LLM). |
| `CLAUDE_CODE_SKIP_VERTEX_AUTH` | Omitir la autenticación de Google para Vertex (p. ej., cuando se usa un gateway de LLM). |
| `CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC` | Equivalente a establecer `DISABLE_AUTOUPDATER`, `DISABLE_BUG_COMMAND`, `DISABLE_ERROR_REPORTING` y `DISABLE_TELEMETRY`. |
| `CLAUDE_CODE_DISABLE_TERMINAL_TITLE` | Establece en `1` para deshabilitar las actualizaciones automáticas del título del terminal basadas en el contexto de la conversación. |
| `DISABLE_AUTOUPDATER` | Establece en `1` para deshabilitar las actualizaciones automáticas. Esto tiene prioridad sobre el ajuste de configuración `autoUpdates`. |
| `DISABLE_BUG_COMMAND` | Establece en `1` para deshabilitar el comando `/bug`. |
| `DISABLE_COST_WARNINGS` | Establece en `1` para deshabilitar los mensajes de advertencia de costos. |
| `DISABLE_ERROR_REPORTING` | Establece en `1` para optar por no participar en el informe de errores de Sentry. |
| `DISABLE_NON_ESSENTIAL_MODEL_CALLS` | Establece en `1` para deshabilitar las llamadas al modelo para rutas no críticas como el texto de ambientación. |
| `DISABLE_TELEMETRY` | Establece en `1` para optar por no participar en la telemetría de Statsig (ten en cuenta que los eventos de Statsig no incluyen datos del usuario como código, rutas de archivos o comandos bash). |
| `HTTP_PROXY` | Especificar el servidor proxy HTTP para las conexiones de red. |
| `HTTPS_PROXY` | Especificar el servidor proxy HTTPS para las conexiones de red. |
| `MAX_THINKING_TOKENS` | Forzar un presupuesto de pensamiento para el modelo. |
| `MCP_TIMEOUT` | Tiempo de espera en milisegundos para el inicio del servidor MCP. |
| `MCP_TOOL_TIMEOUT` | Tiempo de espera en milisegundos para la ejecución de la herramienta MCP. |
| `MAX_MCP_OUTPUT_TOKENS` | Número máximo de tokens permitidos en las respuestas de la herramienta MCP (por defecto: 25000). |
| `VERTEX_REGION_CLAUDE_3_5_HAIKU` | Sobrescribe la región para Claude 3.5 Haiku cuando se usa Vertex AI. |
| `VERTEX_REGION_CLAUDE_3_5_SONNET` | Sobrescribe la región para Claude 3.5 Sonnet cuando se usa Vertex AI. |
| `VERTEX_REGION_CLAUDE_3_7_SONNET` | Sobrescribe la región para Claude 3.7 Sonnet cuando se usa Vertex AI. |
| `VERTEX_REGION_CLAUDE_4_0_OPUS` | Sobrescribe la región para Claude 4.0 Opus cuando se usa Vertex AI. |
| `VERTEX_REGION_CLAUDE_4_0_SONNET` | Sobrescribe la región para Claude 4.0 Sonnet cuando se usa Vertex AI. |

## Opciones de configuración

Para gestionar tus configuraciones, usa los siguientes comandos:

- Listar ajustes: `claude config list`
- Ver un ajuste: `claude config get <clave>`
- Cambiar un ajuste: `claude config set <clave> <valor>`
- Añadir a un ajuste (para listas): `claude config add <clave> <valor>`
- Eliminar de un ajuste (para listas): `claude config remove <clave> <valor>`

Por defecto, `config` cambia la configuración de tu proyecto. Para gestionar tu configuración global, usa la bandera `--global` (o `-g`).

### Configuración global

Para establecer una configuración global, usa `claude config set -g <clave> <valor>`:

| Clave | Descripción | Ejemplo |
| :--- | :--- | :--- |
| `autoUpdates` | Si se habilitan las actualizaciones automáticas (por defecto: `true`). Cuando está habilitado, Claude Code descarga e instala automáticamente las actualizaciones en segundo plano. Las actualizaciones se aplican la próxima vez que reinicies Claude Code. | `false` |
| `preferredNotifChannel` | Dónde quieres recibir las notificaciones (por defecto: `iterm2`). | `iterm2`, `iterm2_with_bell`, `terminal_bell`, o `notifications_disabled` |
| `theme` | Tema de color. | `dark`, `light`, `light-daltonized`, o `dark-daltonized` |
| `verbose` | Si se muestran las salidas completas de bash y comandos (por defecto: `false`). | `true` |

## Herramientas disponibles para Claude

Claude Code tiene acceso a un conjunto de herramientas potentes que le ayudan a entender y modificar tu base de código:

| Herramienta | Descripción | Permiso Requerido |
| :--- | :--- | :--- |
| **Bash** | Ejecuta comandos de shell en tu entorno. | Sí |
| **Edit** | Realiza ediciones específicas en archivos concretos. | Sí |
| **Glob** | Encuentra archivos basados en la coincidencia de patrones. | No |
| **Grep** | Busca patrones en el contenido de los archivos. | No |
| **LS** | Lista archivos y directorios. | No |
| **MultiEdit** | Realiza múltiples ediciones en un solo archivo de forma atómica. | Sí |
| **NotebookEdit** | Modifica celdas de cuadernos de Jupyter. | Sí |
| **NotebookRead** | Lee y muestra el contenido de cuadernos de Jupyter. | No |
| **Read** | Lee el contenido de los archivos. | No |
| **Task** | Ejecuta un subagente para manejar tareas complejas de varios pasos. | No |
| **TodoWrite** | Crea y gestiona listas de tareas estructuradas. | No |
| **WebFetch** | Obtiene contenido de una URL especificada. | Sí |
| **WebSearch** | Realiza búsquedas web con filtrado de dominios. | Sí |
| **Write** | Crea o sobrescribe archivos. | Sí |

Las reglas de permiso se pueden configurar usando `/allowed-tools` o en los [ajustes de permisos](/en/docs/claude-code/settings#available-settings).

### Ampliación de herramientas con hooks

Puedes ejecutar comandos personalizados antes o después de que se ejecute cualquier herramienta usando los
[hooks de Claude Code](/en/docs/claude-code/hooks-guide).

Por ejemplo, podrías ejecutar automáticamente un formateador de Python después de que Claude
modifique archivos de Python, o evitar modificaciones en los archivos de configuración de producción
bloqueando las operaciones de escritura en ciertas rutas.

## Ver también

- [Gestión de Identidad y Acceso](/en/docs/claude-code/iam#configuring-permissions) - Aprende sobre el sistema de permisos de Claude Code.
- [IAM y control de acceso](/en/docs/claude-code/iam#enterprise-managed-policy-settings) - Gestión de políticas empresariales.
- [Solución de problemas](/en/docs/claude-code/troubleshooting#auto-updater-issues) - Soluciones para problemas de configuración comunes.

# Añadir Claude Code a tu IDE

> Aprende a añadir Claude Code a tu IDE favorito.

Claude Code funciona genial con cualquier Entorno de Desarrollo Integrado (IDE) que tenga un terminal. Simplemente ejecuta `claude`, y estarás listo para empezar.

Además, Claude Code proporciona integraciones dedicadas para los IDEs más populares, que ofrecen características como la visualización interactiva de diferencias (diff), el uso compartido del contexto de selección y más. Estas integraciones existen actualmente para:

- **Visual Studio Code** (incluyendo forks populares como Cursor, Windsurf y VSCodium)
- **IDEs de JetBrains** (incluyendo IntelliJ, PyCharm, Android Studio, WebStorm, PhpStorm y GoLand)

## Características

- **Lanzamiento rápido**: Usa `Cmd+Esc` (Mac) o `Ctrl+Esc` (Windows/Linux) para abrir
  Claude Code directamente desde tu editor, o haz clic en el botón de Claude Code en la
  interfaz de usuario.
- **Visualización de diferencias (diff)**: Los cambios en el código se pueden mostrar directamente en el visor de diferencias del IDE
  en lugar del terminal. Puedes configurar esto en `/config`.
- **Contexto de selección**: La selección/pestaña actual en el IDE se comparte automáticamente
  con Claude Code.
- **Atajos para referencias de archivos**: Usa `Cmd+Opción+K` (Mac) o `Alt+Ctrl+K`
  (Linux/Windows) para insertar referencias de archivos (p. ej., @Archivo#L1-99).
- **Uso compartido de diagnósticos**: Los errores de diagnóstico (lint, sintaxis, etc.) del IDE
  se comparten automáticamente con Claude mientras trabajas.

## Instalación

<Tabs>
  <Tab title="VS Code+">
    Para instalar Claude Code en VS Code y forks populares como Cursor, Windsurf y VSCodium:

    1. Abre VS Code.
    2. Abre el terminal integrado.
    3. Ejecuta `claude` - la extensión se autoinstalará.

  </Tab>

  <Tab title="JetBrains">
    Para instalar Claude Code en IDEs de JetBrains como IntelliJ, PyCharm, Android Studio, WebStorm, PhpStorm y GoLand, busca e instala el [plugin de Claude Code](https://docs.anthropic.com/s/claude-code-jetbrains) desde el marketplace y reinicia tu IDE.

    <Note>
      El plugin también puede autoinstalarse cuando ejecutas `claude` en el terminal integrado. El IDE debe reiniciarse por completo para que surta efecto.
    </Note>

    <Warning>
      **Limitaciones del Desarrollo Remoto**: Cuando uses el Desarrollo Remoto de JetBrains, debes instalar el plugin en el host remoto a través de `Settings > Plugin (Host)`.
    </Warning>

  </Tab>
</Tabs>

## Uso

### Desde tu IDE

Ejecuta `claude` desde el terminal integrado de tu IDE, y todas las características estarán activas.

### Desde terminales externos

Usa el comando `/ide` en cualquier terminal externo para conectar Claude Code a tu IDE y activar todas las características.

Si quieres que Claude tenga acceso a los mismos archivos que tu IDE, inicia Claude Code desde el mismo directorio que la raíz de tu proyecto de IDE.

## Configuración

Las integraciones de IDE funcionan con el sistema de configuración de Claude Code:

1. Ejecuta `claude`.
2. Introduce el comando `/config`.
3. Ajusta tus preferencias. Establecer la herramienta de diferencias (diff) en `auto` habilitará la detección automática del IDE.

## Solución de problemas

### La extensión de VS Code no se instala

- Asegúrate de que estás ejecutando Claude Code desde el terminal integrado de VS Code.
- Asegúrate de que la CLI correspondiente a tu IDE esté instalada:
  - Para VS Code: el comando `code` debe estar disponible.
  - Para Cursor: el comando `cursor` debe estar disponible.
  - Para Windsurf: el comando `windsurf` debe estar disponible.
  - Para VSCodium: el comando `codium` debe estar disponible.
  - Si no está instalado, usa `Cmd+Shift+P` (Mac) o `Ctrl+Shift+P` (Windows/Linux)
    y busca "Shell Command: Install 'code' command in PATH" (o el
    equivalente para tu IDE).
- Comprueba que VS Code tenga permiso para instalar extensiones.

### El plugin de JetBrains no funciona

- Asegúrate de que estás ejecutando Claude Code desde el directorio raíz del proyecto.
- Comprueba que el plugin de JetBrains esté habilitado en la configuración del IDE.
- Reinicia el IDE por completo. Es posible que necesites hacerlo varias veces.
- Para el Desarrollo Remoto de JetBrains, asegúrate de que el plugin de Claude Code esté
  instalado en el host remoto y no localmente en el cliente.

Para obtener ayuda adicional, consulta nuestra
[guía de solución de problemas](/en/docs/claude-code/troubleshooting).

# Gestionar la memoria de Claude

> Aprende a gestionar la memoria de Claude Code entre sesiones con diferentes ubicaciones de memoria y mejores prácticas.

Claude Code puede recordar tus preferencias entre sesiones, como las directrices de estilo y los comandos comunes en tu flujo de trabajo.

## Determinar el tipo de memoria

Claude Code ofrece tres ubicaciones de memoria, cada una con un propósito diferente:

| Tipo de Memoria | Ubicación | Propósito | Ejemplos de Casos de Uso |
| --- | --- | --- | --- |
| **Memoria de proyecto** | `./CLAUDE.md` | Instrucciones compartidas por el equipo para el proyecto | Arquitectura del proyecto, estándares de codificación, flujos de trabajo comunes |
| **Memoria de usuario** | `~/.claude/CLAUDE.md` | Preferencias personales para todos los proyectos | Preferencias de estilo de código, atajos de herramientas personales |
| **Memoria de proyecto (local)** | `./CLAUDE.local.md` | Preferencias personales específicas del proyecto | _(Obsoleto, ver abajo)_ Tus URLs de sandbox, datos de prueba preferidos |

Todos los archivos de memoria se cargan automáticamente en el contexto de Claude Code al iniciarse.

## Importaciones de CLAUDE.md

Los archivos CLAUDE.md pueden importar archivos adicionales usando la sintaxis `@ruta/al/archivo`. El siguiente ejemplo importa 3 archivos:

```
Consulta @README para una visión general del proyecto y @package.json para los comandos npm disponibles para este proyecto.

# Instrucciones Adicionales
- flujo de trabajo de git @docs/git-instructions.md
```

Se permiten tanto rutas relativas como absolutas. En particular, importar archivos en el directorio de inicio del usuario es una forma conveniente para que los miembros de tu equipo proporcionen instrucciones individuales que no se registran en el repositorio. Anteriormente, CLAUDE.local.md cumplía un propósito similar, pero ahora está obsoleto en favor de las importaciones, ya que funcionan mejor en múltiples árboles de trabajo de git.

```
# Preferencias Individuales
- @~/.claude/my-project-instructions.md
```

Para evitar posibles colisiones, las importaciones no se evalúan dentro de los `code spans` y bloques de código de markdown.

```
Este `code span` no se tratará como una importación: `@anthropic-ai/claude-code`
```

Los archivos importados pueden importar recursivamente archivos adicionales, con una profundidad máxima de 5 saltos. Puedes ver qué archivos de memoria se cargan ejecutando el comando `/memory`.

## Cómo Claude busca las memorias

Claude Code lee las memorias de forma recursiva: comenzando en el `cwd`, Claude Code recurre hacia arriba hasta (pero sin incluir) el directorio raíz _/_ y lee cualquier archivo CLAUDE.md o CLAUDE.local.md que encuentre. Esto es especialmente conveniente cuando se trabaja en repositorios grandes donde ejecutas Claude Code en _foo/bar/_, y tienes memorias tanto en _foo/CLAUDE.md_ como en _foo/bar/CLAUDE.md_.

Claude también descubrirá CLAUDE.md anidados en subárboles bajo tu directorio de trabajo actual. En lugar de cargarlos al inicio, solo se incluyen cuando Claude lee archivos en esos subárboles.

## Añade memorias rápidamente con el atajo `#`

La forma más rápida de añadir una memoria es comenzar tu entrada con el carácter `#`:

```
# Usar siempre nombres de variables descriptivos
```

Se te pedirá que selecciones en qué archivo de memoria guardarlo.

## Edita memorias directamente con `/memory`

Usa el comando de barra diagonal `/memory` durante una sesión para abrir cualquier archivo de memoria en tu editor de sistema para adiciones u organización más extensas.

## Configurar la memoria del proyecto

Supongamos que quieres configurar un archivo CLAUDE.md para almacenar información importante del proyecto, convenciones y comandos de uso frecuente.

Inicia un CLAUDE.md para tu base de código con el siguiente comando:

```
> /init
```

<Tip>
  Consejos:

- Incluye comandos de uso frecuente (compilar, probar, lint) para evitar búsquedas repetidas.
- Documenta las preferencias de estilo de código y las convenciones de nomenclatura.
- Añade patrones arquitectónicos importantes específicos de tu proyecto.
- Las memorias de CLAUDE.md se pueden usar tanto para instrucciones compartidas con tu equipo como para tus preferencias individuales.
  </Tip>

## Mejores prácticas de memoria

- **Sé específico**: "Usar indentación de 2 espacios" es mejor que "Formatear el código correctamente".
- **Usa la estructura para organizar**: Formatea cada memoria individual como un punto de viñeta y agrupa las memorias relacionadas bajo encabezados de markdown descriptivos.
- **Revisa periódicamente**: Actualiza las memorias a medida que tu proyecto evoluciona para asegurar que Claude siempre esté usando la información y el contexto más actualizados.