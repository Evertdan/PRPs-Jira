# SDK de Claude Code

> Aprende a integrar Claude Code de forma programática en tus aplicaciones con el SDK de Claude Code.

El SDK de Claude Code permite ejecutar Claude Code como un subproceso, proporcionando una forma de construir asistentes de codificación y herramientas impulsadas por IA que aprovechan las capacidades de Claude.

El SDK está disponible para uso en línea de comandos, TypeScript y Python.

## Autenticación

El SDK de Claude Code admite múltiples métodos de autenticación:

### Clave de API de Anthropic

Para usar el SDK de Claude Code directamente con la API de Anthropic, recomendamos crear una clave de API dedicada:

1.  Crea una clave de API de Anthropic en la [Consola de Anthropic](https://console.anthropic.com/).
2.  Luego, establece la variable de entorno `ANTHROPIC_API_KEY`. Recomendamos almacenar esta clave de forma segura (p. ej., usando un [secreto](https://docs.github.com/en/actions/security-for-github-actions/security-guides/using-secrets-in-github-actions) de Github).

### Credenciales de API de terceros

El SDK también admite proveedores de API de terceros:

-   **Amazon Bedrock**: Establece la variable de entorno `CLAUDE_CODE_USE_BEDROCK=1` y configura las credenciales de AWS.
-   **Google Vertex AI**: Establece la variable de entorno `CLAUDE_CODE_USE_VERTEX=1` y configura las credenciales de Google Cloud.

Para obtener instrucciones de configuración detalladas para proveedores de terceros, consulta la documentación de [Amazon Bedrock](/en/docs/claude-code/amazon-bedrock) y [Google Vertex AI](/en/docs/claude-code/google-vertex-ai).

## Uso básico del SDK

El SDK de Claude Code te permite usar Claude Code en modo no interactivo desde tus aplicaciones.

### Línea de comandos

Aquí hay algunos ejemplos básicos para el SDK de línea de comandos:

```bash
# Ejecutar un solo prompt y salir (modo de impresión)
$ claude -p "Escribe una función para calcular los números de Fibonacci"

# Usando una tubería para proporcionar stdin
$ echo "Explica este código" | claude -p

# Salida en formato JSON con metadatos
$ claude -p "Genera una función de hola mundo" --output-format json

# Transmitir la salida JSON a medida que llega
$ claude -p "Construye un componente de React" --output-format stream-json
```

### TypeScript

El SDK de TypeScript está incluido en el paquete principal [`@anthropic-ai/claude-code`](https://www.npmjs.com/package/@anthropic-ai/claude-code) en NPM:

```ts
import { query, type SDKMessage } from "@anthropic-ai/claude-code";

const messages: SDKMessage[] = [];

for await (const message of query({
  prompt: "Escribe un haiku sobre foo.py",
  abortController: new AbortController(),
  options: {
    maxTurns: 3,
  },
})) {
  messages.push(message);
}

console.log(messages);
```

El SDK de TypeScript acepta todos los argumentos admitidos por el SDK de línea de comandos, así como:

| Argumento | Descripción | Valor por defecto |
| :--- | :--- | :--- |
| `abortController` | Controlador de aborto | `new AbortController()` |
| `cwd` | Directorio de trabajo actual | `process.cwd()` |
| `executable` | Qué tiempo de ejecución de JavaScript usar | `node` al ejecutar con Node.js, `bun` al ejecutar con Bun |
| `executableArgs` | Argumentos para pasar al ejecutable | `[]` |
| `pathToClaudeCodeExecutable` | Ruta al ejecutable de Claude Code | Ejecutable que se envía con `@anthropic-ai/claude-code` |

### Python

El SDK de Python está disponible como [`claude-code-sdk`](https://github.com/anthropics/claude-code-sdk-python) en PyPI:

```bash
pip install claude-code-sdk
```

**Prerrequisitos:**

-   Python 3.10+
-   Node.js
-   CLI de Claude Code: `npm install -g @anthropic-ai/claude-code`

Uso básico:

```python
import anyio
from claude_code_sdk import query, ClaudeCodeOptions, Message

async def main():
    messages: list[Message] = []

    async for message in query(
        prompt="Escribe un haiku sobre foo.py",
        options=ClaudeCodeOptions(max_turns=3)
    ):
        messages.append(message)

    print(messages)

anyio.run(main)
```

El SDK de Python acepta todos los argumentos admitidos por el SDK de línea de comandos a través de la clase `ClaudeCodeOptions`:

```python
from claude_code_sdk import query, ClaudeCodeOptions
from pathlib import Path

options = ClaudeCodeOptions(
    max_turns=3,
    system_prompt="Eres un asistente útil",
    cwd=Path("/ruta/a/proyecto"),  # Puede ser una cadena o un Path
    allowed_tools=["Read", "Write", "Bash"],
    permission_mode="acceptEdits"
)

async for message in query(prompt="Hola", options=options):
    print(message)
```

## Uso avanzado

La documentación a continuación utiliza el SDK de línea de comandos como ejemplo, pero también se puede usar con los SDK de TypeScript y Python.

### Conversaciones de múltiples turnos

Para conversaciones de múltiples turnos, puedes reanudar conversaciones o continuar desde la sesión más reciente:

```bash
# Continuar la conversación más reciente
$ claude --continue

# Continuar y proporcionar un nuevo prompt
$ claude --continue "Ahora refactoriza esto para un mejor rendimiento"

# Reanudar una conversación específica por ID de sesión
$ claude --resume 550e8400-e29b-41d4-a716-446655440000

# Reanudar en modo de impresión (no interactivo)
$ claude -p --resume 550e8400-e29b-41d4-a716-446655440000 "Actualiza las pruebas"

# Continuar en modo de impresión (no interactivo)
$ claude -p --continue "Añade manejo de errores"
```

### Prompts de sistema personalizados

Puedes proporcionar prompts de sistema personalizados para guiar el comportamiento de Claude:

```bash
# Sobrescribir el prompt del sistema (solo funciona con --print)
$ claude -p "Construye una API REST" --system-prompt "Eres un ingeniero de backend senior. Céntrate en la seguridad, el rendimiento y la mantenibilidad."

# Prompt del sistema con requisitos específicos
$ claude -p "Crea un esquema de base de datos" --system-prompt "Eres un arquitecto de bases de datos. Usa las mejores prácticas de PostgreSQL e incluye una indexación adecuada."
```

También puedes añadir instrucciones al prompt del sistema por defecto:

```bash
# Añadir al prompt del sistema (solo funciona con --print)
$ claude -p "Construye una API REST" --append-system-prompt "Después de escribir el código, asegúrate de revisarlo tú mismo."
```

### Configuración de MCP

El Protocolo de Contexto del Modelo (MCP) te permite extender Claude Code con herramientas y recursos adicionales de servidores externos. Usando la bandera `--mcp-config`, puedes cargar servidores MCP que proporcionan capacidades especializadas como acceso a bases de datos, integraciones de API o herramientas personalizadas.

Crea un archivo de configuración JSON con tus servidores MCP:

```json
{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-filesystem",
        "/ruta/a/archivos/permitidos"
      ]
    },
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_TOKEN": "tu-token-de-github"
      }
    }
  }
}
```

Luego úsalo con Claude Code:

```bash
# Cargar servidores MCP desde la configuración
$ claude -p "Lista todos los archivos en el proyecto" --mcp-config mcp-servers.json

# Importante: Las herramientas MCP deben permitirse explícitamente usando --allowedTools
# Las herramientas MCP siguen el formato: mcp__$nombreServidor__$nombreHerramienta
$ claude -p "Busca comentarios TODO" \
  --mcp-config mcp-servers.json \
  --allowedTools "mcp__filesystem__read_file,mcp__filesystem__list_directory"

# Usa una herramienta MCP para manejar las solicitudes de permiso en modo no interactivo
$ claude -p "Despliega la aplicación" \
  --mcp-config mcp-servers.json \
  --allowedTools "mcp__permissions__approve" \
  --permission-prompt-tool mcp__permissions__approve
```

<Note>
  Al usar herramientas MCP, debes permitirlas explícitamente usando la bandera `--allowedTools`. Los nombres de las herramientas MCP siguen el patrón `mcp__<nombreServidor>__<nombreHerramienta>` donde:

- `nombreServidor` es la clave de tu archivo de configuración MCP.
- `nombreHerramienta` es la herramienta específica proporcionada por ese servidor.

Esta medida de seguridad asegura que las herramientas MCP solo se usen cuando se permitan explícitamente.

Si especificas solo el nombre del servidor (es decir, `mcp__<nombreServidor>`), se permitirán todas las herramientas de ese servidor.

No se admiten patrones globales (glob) (p. ej., `mcp__go*`).
</Note>

### Herramienta de solicitud de permiso personalizada

Opcionalmente, usa `--permission-prompt-tool` para pasar una herramienta MCP que usaremos para verificar si el usuario otorga o no permisos al modelo para invocar una herramienta determinada. Cuando el modelo invoca una herramienta, sucede lo siguiente:

1.  Primero verificamos la configuración de permisos: todos los [archivos settings.json](/en/docs/claude-code/settings), así como `--allowedTools` y `--disallowedTools` pasados al SDK; si uno de estos permite o deniega la llamada a la herramienta, procedemos con la llamada a la herramienta.
2.  De lo contrario, invocamos la herramienta MCP que proporcionaste en `--permission-prompt-tool`.

A la herramienta MCP `--permission-prompt-tool` se le pasa el nombre de la herramienta y la entrada, y debe devolver una carga útil en formato de cadena JSON con el resultado. La carga útil debe ser una de las siguientes:

```ts
// la llamada a la herramienta está permitida
{
  "behavior": "allow",
  "updatedInput": {...}, // entrada actualizada, o simplemente devuelve la entrada original
}

// la llamada a la herramienta es denegada
{
  "behavior": "deny",
  "message": "..." // cadena legible por humanos que explica por qué se denegó el permiso
}
```

Por ejemplo, una implementación de herramienta de solicitud de permiso MCP en TypeScript podría verse así:

```ts
const server = new McpServer({
  name: "Servidor MCP de solicitud de permiso de prueba",
  version: "0.0.1",
});

server.tool(
  "approval_prompt",
  'Simula una verificación de permiso - aprueba si la entrada contiene "allow", de lo contrario deniega',
  {
    tool_name: z
      .string()
      .describe("El nombre de la herramienta que solicita permiso"),
    input: z.object({}).passthrough().describe("La entrada para la herramienta"),
    tool_use_id:
      z
        .string()
        .optional()
        .describe("El ID único de la solicitud de uso de la herramienta"),
  },
  async ({ tool_name, input }) => {
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(
            JSON.stringify(input).includes("allow")
              ? {
                  behavior: "allow",
                  updatedInput: input,
                }
              : {
                  behavior: "deny",
                  message: "Permiso denegado por la herramienta de prueba approval_prompt",
                },
          ),
        },
      ],
    };
  },
);
```

Para usar esta herramienta, añade tu servidor MCP (p. ej., con `--mcp-config`), luego invoca el SDK así:

```sh
claude -p "..." \
  --permission-prompt-tool mcp__test-server__approval_prompt \
  --mcp-config my-config.json
```

Notas de uso:

-   Usa `updatedInput` para decirle al modelo que la solicitud de permiso modificó su entrada; de lo contrario, establece `updatedInput` en la entrada original, como en el ejemplo anterior. Por ejemplo, si la herramienta muestra una diferencia de edición de archivo al usuario y le permite editar la diferencia manualmente, la herramienta de solicitud de permiso debe devolver esa edición actualizada.
-   La carga útil debe ser una cadena JSON.

## Opciones de CLI disponibles

El SDK aprovecha todas las opciones de CLI disponibles en Claude Code. Aquí están las clave para el uso del SDK:

| Bandera | Descripción | Ejemplo |
| :--- | :--- | :--- |
| `--print`, `-p` | Ejecutar en modo no interactivo | `claude -p "consulta"` |
| `--output-format` | Especificar formato de salida (`text`, `json`, `stream-json`) | `claude -p --output-format json` |
| `--resume`, `-r` | Reanudar una conversación por ID de sesión | `claude --resume abc123` |
| `--continue`, `-c` | Continuar la conversación más reciente | `claude --continue` |
| `--verbose` | Habilitar registro detallado | `claude --verbose` |
| `--max-turns` | Limitar los turnos agénticos en modo no interactivo | `claude --max-turns 3` |
| `--system-prompt` | Sobrescribir el prompt del sistema (solo con `--print`) | `claude --system-prompt "Instrucción personalizada"` |
| `--append-system-prompt` | Añadir al prompt del sistema (solo con `--print`) | `claude --append-system-prompt "Instrucción personalizada"` |
| `--allowedTools` | Lista de herramientas permitidas separadas por espacios, o <br /><br /> cadena de lista de herramientas permitidas separadas por comas | `claude --allowedTools mcp__slack mcp__filesystem`<br /><br />`claude --allowedTools "Bash(npm install),mcp__filesystem"` |
| `--disallowedTools` | Lista de herramientas denegadas separadas por espacios, o <br /><br /> cadena de lista de herramientas denegadas separadas por comas | `claude --disallowedTools mcp__splunk mcp__github`<br /><br />`claude --disallowedTools "Bash(git commit),mcp__github"` |
| `--mcp-config` | Cargar servidores MCP desde un archivo JSON | `claude --mcp-config servers.json` |
| `--permission-prompt-tool` | Herramienta MCP para manejar solicitudes de permiso (solo con `--print`) | `claude --permission-prompt-tool mcp__auth__prompt` |

Para una lista completa de opciones y características de la CLI, consulta la [referencia de la CLI](/en/docs/claude-code/cli-reference).

## Formatos de salida

El SDK admite múltiples formatos de salida:

### Salida de texto (por defecto)

Devuelve solo el texto de la respuesta:

```bash
$ claude -p "Explica el archivo src/components/Header.tsx"
# Salida: Este es un componente de React que muestra...
```

### Salida JSON

Devuelve datos estructurados que incluyen metadatos:

```bash
$ claude -p "¿Cómo funciona la capa de datos?" --output-format json
```

Formato de respuesta:

```json
{
  "type": "result",
  "subtype": "success",
  "total_cost_usd": 0.003,
  "is_error": false,
  "duration_ms": 1234,
  "duration_api_ms": 800,
  "num_turns": 6,
  "result": "El texto de la respuesta aquí...",
  "session_id": "abc123"
}
```

### Salida JSON en streaming

Transmite cada mensaje a medida que se recibe:

```bash
$ claude -p "Construye una aplicación" --output-format stream-json
```

Cada conversación comienza con un mensaje de sistema `init` inicial, seguido de una lista de mensajes de usuario y asistente, y finaliza con un mensaje de sistema `result` con estadísticas. Cada mensaje se emite como un objeto JSON separado.

## Esquema de mensajes

Los mensajes devueltos por la API JSON están estrictamente tipados según el siguiente esquema:

```ts
type SDKMessage =
  // Un mensaje del asistente
  | {
      type: "assistant";
      message: Message; // del SDK de Anthropic
      session_id: string;
    }

  // Un mensaje del usuario
  | {
      type: "user";
      message: MessageParam; // del SDK de Anthropic
      session_id: string;
    }

  // Emitido como el último mensaje
  | {
      type: "result";
      subtype: "success";
      duration_ms: float;
      duration_api_ms: float;
      is_error: boolean;
      num_turns: int;
      result: string;
      session_id: string;
      total_cost_usd: float;
    }

  // Emitido como el último mensaje, cuando hemos alcanzado el número máximo de turnos
  | {
      type: "result";
      subtype: "error_max_turns" | "error_during_execution";
      duration_ms: float;
      duration_api_ms: float;
      is_error: boolean;
      num_turns: int;
      session_id: string;
      total_cost_usd: float;
    }

  // Emitido como el primer mensaje al inicio de una conversación
  | {
      type: "system";
      subtype: "init";
      apiKeySource: string;
      cwd: string;
      session_id: string;
      tools: string[];
      mcp_servers: {
        name: string;
        status: string;
      }[];
      model: string;
      permissionMode: "default" | "acceptEdits" | "bypassPermissions" | "plan";
    };
```

Pronto publicaremos estos tipos en un formato compatible con JSONSchema. Usamos versionado semántico para el paquete principal de Claude Code para comunicar cambios importantes en este formato.

Los tipos `Message` y `MessageParam` están disponibles en los SDK de Anthropic. Por ejemplo, consulta los SDK de [TypeScript](https://github.com/anthropics/anthropic-sdk-typescript) y [Python](https://github.com/anthropics/anthropic-sdk-python/) de Anthropic.

## Formatos de entrada

El SDK admite múltiples formatos de entrada:

### Entrada de texto (por defecto)

El texto de entrada se puede proporcionar como un argumento:

```bash
$ claude -p "Explica este código"
```

O el texto de entrada se puede canalizar a través de stdin:

```bash
$ echo "Explica este código" | claude -p
```

### Entrada JSON en streaming

Un flujo de mensajes proporcionado a través de `stdin` donde cada mensaje representa un turno del usuario. Esto permite múltiples turnos de una conversación sin relanzar el binario `claude` y permite proporcionar orientación al modelo mientras procesa una solicitud.

Cada mensaje es un objeto JSON de 'Mensaje de usuario', siguiendo el mismo formato que el esquema de mensajes de salida. Los mensajes se formatean usando el formato [jsonl](https://jsonlines.org/) donde cada línea de entrada es un objeto JSON completo. La entrada JSON en streaming requiere `-p` y `--output-format stream-json`.

Actualmente, esto se limita a mensajes de usuario de solo texto.

```bash
$ echo '{"type":"user","message":{"role":"user","content":[{"type":"text","text":"Explica este código"}]}}' | claude -p --output-format=stream-json --input-format=stream-json --verbose
```

## Ejemplos

### Integración de script simple

```bash
#!/bin/bash

# Función simple para ejecutar Claude y verificar el código de salida
run_claude() {
    local prompt="$1"
    local output_format="${2:-text}"

    if claude -p "$prompt" --output-format "$output_format"; then
        echo "¡Éxito!"
    else
        echo "Error: Claude falló con el código de salida $?" >&2
        return 1
    fi
}

# Ejemplos de uso
run_claude "Escribe una función de Python para leer archivos CSV"
run_claude "Optimiza esta consulta de base de datos" "json"
```

### Procesamiento de archivos con Claude

```bash
# Procesar un archivo a través de Claude
$ cat mycode.py | claude -p "Revisa este código en busca de errores"

# Procesar múltiples archivos
$ for file in *.js; do
    echo "Procesando $file..."
    claude -p "Añade comentarios JSDoc a este archivo:" < "$file" > "${file}.documented"
done

# Usar Claude en una tubería
$ grep -l "TODO" *.py | while read file; do
    claude -p "Corrige todos los elementos TODO en este archivo" < "$file"
done
```

### Gestión de sesiones

```bash
# Iniciar una sesión y capturar el ID de la sesión
$ claude -p "Inicializa un nuevo proyecto" --output-format json | jq -r '.session_id' > session.txt

# Continuar con la misma sesión
$ claude -p --resume "$(cat session.txt)" "Añade pruebas unitarias"
```

## Mejores prácticas

1.  **Usa el formato de salida JSON** para el análisis programático de las respuestas:

    ```bash
    # Analizar la respuesta JSON con jq
    result=$(claude -p "Genera código" --output-format json)
    code=$(echo "$result" | jq -r '.result')
    cost=$(echo "$result" | jq -r '.cost_usd')
    ```

2.  **Maneja los errores con elegancia** - verifica los códigos de salida y stderr:

    ```bash
    if ! claude -p "$prompt" 2>error.log; then
        echo "Ocurrió un error:" >&2
        cat error.log >&2
        exit 1
    fi
    ```

3.  **Usa la gestión de sesiones** para mantener el contexto en conversaciones de múltiples turnos.

4.  **Considera los tiempos de espera** para operaciones de larga duración:

    ```bash
    timeout 300 claude -p "$complex_prompt" || echo "Tiempo de espera agotado después de 5 minutos"
    ```

5.  **Respeta los límites de velocidad** al realizar múltiples solicitudes añadiendo retrasos entre llamadas.

## Aplicaciones del mundo real

El SDK de Claude Code permite integraciones potentes con tu flujo de trabajo de desarrollo. Un ejemplo notable son las [Acciones de GitHub de Claude Code](/en/docs/claude-code/github-actions), que utilizan el SDK para proporcionar capacidades automatizadas de revisión de código, creación de PR y triaje de problemas directamente en tu flujo de trabajo de GitHub.

## Recursos relacionados

-   [Uso y controles de la CLI](/en/docs/claude-code/cli-reference) - Documentación completa de la CLI
-   [Integración con Acciones de GitHub](/en/docs/claude-code/github-actions) - Automatiza tu flujo de trabajo de GitHub con Claude
-   [Flujos de trabajo comunes](/en/docs/claude-code/common-workflows) - Guías paso a paso para casos de uso comunes