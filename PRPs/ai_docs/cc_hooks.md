# Hooks

> Personaliza y extiende el comportamiento de Claude Code registrando comandos de shell.

# Introducción

Los hooks de Claude Code son comandos de shell definidos por el usuario que se ejecutan en varios puntos del ciclo de vida de Claude Code. Los hooks proporcionan un control determinista sobre el comportamiento de Claude Code, asegurando que ciertas acciones siempre ocurran en lugar de depender de que el LLM elija ejecutarlas.

Casos de uso de ejemplo incluyen:

- **Notificaciones**: Personaliza cómo recibes notificaciones cuando Claude Code está esperando tu entrada o permiso para ejecutar algo.
- **Formateo automático**: Ejecuta `prettier` en archivos .ts, `gofmt` en archivos .go, etc., después de cada edición de archivo.
- **Registro (Logging)**: Rastrea y cuenta todos los comandos ejecutados para cumplimiento o depuración.
- **Retroalimentación (Feedback)**: Proporciona retroalimentación automatizada cuando Claude Code produce código que no sigue las convenciones de tu base de código.
- **Permisos personalizados**: Bloquea modificaciones a archivos de producción o directorios sensibles.

Al codificar estas reglas como hooks en lugar de instrucciones en un prompt, conviertes las sugerencias en código a nivel de aplicación que se ejecuta cada vez que se espera que lo haga.

<Warning>
  Los hooks ejecutan comandos de shell con todos los permisos de tu usuario sin confirmación. Eres responsable de asegurar que tus hooks sean seguros. Anthropic no se hace responsable de ninguna pérdida de datos o daño al sistema resultante del uso de hooks. Revisa las [Consideraciones de Seguridad](#security-considerations).
</Warning>

## Inicio Rápido

En este inicio rápido, añadirás un hook que registra los comandos de shell que Claude Code ejecuta.

Prerrequisito del Inicio Rápido: Instala `jq` para el procesamiento de JSON en la línea de comandos.

### Paso 1: Abrir la configuración de hooks

Ejecuta el [comando de barra diagonal](/en/docs/claude-code/slash-commands) `/hooks` y selecciona el evento de hook `PreToolUse`.

Los hooks `PreToolUse` se ejecutan antes de las llamadas a herramientas y pueden bloquearlas mientras proporcionan retroalimentación a Claude sobre qué hacer de manera diferente.

### Paso 2: Añadir un matcher

Selecciona `+ Añadir nuevo matcher…` para ejecutar tu hook solo en las llamadas a la herramienta Bash.

Escribe `Bash` para el matcher.

### Paso 3: Añadir el hook

Selecciona `+ Añadir nuevo hook…` e introduce este comando:

```bash
jq -r '"\(.tool_input.command) - \(.tool_input.description // "Sin descripción")"' >> ~/.claude/bash-command-log.txt
```

### Paso 4: Guardar tu configuración

Para la ubicación de almacenamiento, selecciona `Configuración de usuario` ya que estás registrando en tu directorio de inicio. Este hook se aplicará a todos los proyectos, no solo a tu proyecto actual.

Luego presiona Esc hasta que regreses al REPL. ¡Tu hook ya está registrado!

### Paso 5: Verificar tu hook

Ejecuta `/hooks` de nuevo o revisa `~/.claude/settings.json` para ver tu configuración:

```json
"hooks": {
  "PreToolUse": [
    {
      "matcher": "Bash",
      "hooks": [
        {
          "type": "command",
          "command": "jq -r '\"\\\(.tool_input.command) - \\.\\(.tool_input.description // \"Sin descripción\")\"' >> ~/.claude/bash-command-log.txt"
        }
      ]
    }
  ]
}
```

## Configuración

Los hooks de Claude Code se configuran en tus
[archivos de configuración](/en/docs/claude-code/settings):

- `~/.claude/settings.json` - Configuración de usuario
- `.claude/settings.json` - Configuración de proyecto
- `.claude/settings.local.json` - Configuración local del proyecto (no se versiona)
- Configuración de políticas gestionadas por la empresa

### Estructura

Los hooks se organizan por matchers, donde cada matcher puede tener múltiples hooks:

```json
{
  "hooks": {
    "NombreDelEvento": [
      {
        "matcher": "PatronDeHerramienta",
        "hooks": [
          {
            "type": "command",
            "command": "tu-comando-aqui"
          }
        ]
      }
    ]
  }
}
```

- **matcher**: Patrón para coincidir con nombres de herramientas (solo aplicable para `PreToolUse` y
  `PostToolUse`)
  - Cadenas simples coinciden exactamente: `Write` coincide solo con la herramienta Write.
  - Admite regex: `Edit|Write` o `Notebook.*`
  - Si se omite o es una cadena vacía, los hooks se ejecutan para todos los eventos que coincidan.
- **hooks**: Array de comandos a ejecutar cuando el patrón coincide.
  - `type`: Actualmente solo se admite `"command"`.
  - `command`: El comando bash a ejecutar.
  - `timeout`: (Opcional) Cuánto tiempo debe ejecutarse un comando, en segundos, antes de
    cancelar todos los hooks en progreso.

## Eventos de Hook

### PreToolUse

Se ejecuta después de que Claude crea los parámetros de la herramienta y antes de procesar la llamada a la herramienta.

**Matchers comunes:**

- `Task` - Tareas de agente
- `Bash` - Comandos de shell
- `Glob` - Coincidencia de patrones de archivos
- `Grep` - Búsqueda de contenido
- `Read` - Lectura de archivos
- `Edit`, `MultiEdit` - Edición de archivos
- `Write` - Escritura de archivos
- `WebFetch`, `WebSearch` - Operaciones web

### PostToolUse

Se ejecuta inmediatamente después de que una herramienta se completa con éxito.

Reconoce los mismos valores de matcher que PreToolUse.

### Notification

Se ejecuta cuando Claude Code envía notificaciones.

### Stop

Se ejecuta cuando el agente principal de Claude Code ha terminado de responder.

### SubagentStop

Se ejecuta cuando un subagente de Claude Code (llamada a la herramienta Task) ha terminado de responder.

## Entrada del Hook

Los hooks reciben datos JSON a través de stdin que contienen información de la sesión y
datos específicos del evento:

```typescript
{
  // Campos comunes
  session_id: string
  transcript_path: string  // Ruta al JSON de la conversación

  // Campos específicos del evento
  ...
}
```

### Entrada de PreToolUse

El esquema exacto para `tool_input` depende de la herramienta.

```json
{
  "session_id": "abc123",
  "transcript_path": "~/.claude/projects/.../00893aaf-19fa-41d2-8238-13269b9b3ca0.jsonl",
  "tool_name": "Write",
  "tool_input": {
    "file_path": "/ruta/al/archivo.txt",
    "content": "contenido del archivo"
  }
}
```

### Entrada de PostToolUse

El esquema exacto para `tool_input` y `tool_response` depende de la herramienta.

```json
{
  "session_id": "abc123",
  "transcript_path": "~/.claude/projects/.../00893aaf-19fa-41d2-8238-13269b9b3ca0.jsonl",
  "tool_name": "Write",
  "tool_input": {
    "file_path": "/ruta/al/archivo.txt",
    "content": "contenido del archivo"
  },
  "tool_response": {
    "filePath": "/ruta/al/archivo.txt",
    "success": true
  }
}
```

### Entrada de Notification

```json
{
  "session_id": "abc123",
  "transcript_path": "~/.claude/projects/.../00893aaf-19fa-41d2-8238-13269b9b3ca0.jsonl",
  "message": "Tarea completada con éxito",
  "title": "Claude Code"
}
```

### Entrada de Stop y SubagentStop

`stop_hook_active` es verdadero cuando Claude Code ya está continuando como resultado de
un hook de detención. Verifica este valor o procesa la transcripción para evitar que Claude Code
se ejecute indefinidamente.

```json
{
  "session_id": "abc123",
  "transcript_path": "~/.claude/projects/.../00893aaf-19fa-41d2-8238-13269b9b3ca0.jsonl",
  "stop_hook_active": true
}
```

## Salida del Hook

Hay dos formas en que los hooks pueden devolver una salida a Claude Code. La salida
comunica si se debe bloquear y cualquier retroalimentación que deba mostrarse a Claude
y al usuario.

### Simple: Código de Salida

Los hooks comunican el estado a través de códigos de salida, stdout y stderr:

- **Código de salida 0**: Éxito. `stdout` se muestra al usuario en modo de transcripción
  (CTRL-R).
- **Código de salida 2**: Error de bloqueo. `stderr` se devuelve a Claude para que lo procese
  automáticamente. Consulta el comportamiento por evento de hook a continuación.
- **Otros códigos de salida**: Error no bloqueante. `stderr` se muestra al usuario y
  la ejecución continúa.

<Warning>
  Recordatorio: Claude Code no ve stdout si el código de salida es 0.
</Warning>

#### Comportamiento del Código de Salida 2

| Evento de Hook | Comportamiento                                                           |
| --- | --- |
| `PreToolUse` | Bloquea la llamada a la herramienta, muestra el error a Claude |
| `PostToolUse` | Muestra el error a Claude (la herramienta ya se ejecutó) |
| `Notification` | N/A, muestra stderr solo al usuario |
| `Stop` | Bloquea la detención, muestra el error a Claude |
| `SubagentStop` | Bloquea la detención, muestra el error al subagente de Claude |

### Avanzado: Salida JSON

Los hooks pueden devolver JSON estructurado en `stdout` para un control más sofisticado:

#### Campos JSON Comunes

Todos los tipos de hook pueden incluir estos campos opcionales:

```json
{
  "continue": true, // Si Claude debe continuar después de la ejecución del hook (por defecto: true)
  "stopReason": "string" // Mensaje que se muestra cuando continue es false
  "suppressOutput": true, // Ocultar stdout del modo de transcripción (por defecto: false)
}
```

Si `continue` es falso, Claude deja de procesar después de que se ejecutan los hooks.

- Para `PreToolUse`, esto es diferente de `"decision": "block"`, que solo
  bloquea una llamada a herramienta específica y proporciona retroalimentación automática a Claude.
- Para `PostToolUse`, esto es diferente de `"decision": "block"`, que
  proporciona retroalimentación automatizada a Claude.
- Para `Stop` y `SubagentStop`, esto tiene prioridad sobre cualquier
  salida `"decision": "block"`.
- En todos los casos, `"continue" = false` tiene prioridad sobre cualquier
  salida `"decision": "block"`.

`stopReason` acompaña a `continue` con una razón que se muestra al usuario, no a Claude.

#### Control de Decisión de `PreToolUse`

Los hooks `PreToolUse` pueden controlar si una llamada a herramienta procede.

- "approve" omite el sistema de permisos. `reason` se muestra al usuario pero
  no a Claude.
- "block" evita que la llamada a la herramienta se ejecute. `reason` se muestra a Claude.
- `undefined` conduce al flujo de permisos existente. `reason` se ignora.

```json
{
  "decision": "approve" | "block" | undefined,
  "reason": "Explicación de la decisión"
}
```

#### Control de Decisión de `PostToolUse`

Los hooks `PostToolUse` pueden controlar si una llamada a herramienta procede.

- "block" solicita automáticamente a Claude con `reason`.
- `undefined` no hace nada. `reason` se ignora.

```json
{
  "decision": "block" | undefined,
  "reason": "Explicación de la decisión"
}
```

#### Control de Decisión de `Stop`/`SubagentStop`

Los hooks `Stop` y `SubagentStop` pueden controlar si Claude debe continuar.

- "block" evita que Claude se detenga. Debes completar `reason` para que Claude
  sepa cómo proceder.
- `undefined` permite que Claude se detenga. `reason` se ignora.

```json
{
  "decision": "block" | undefined,
  "reason": "Debe proporcionarse cuando se impide que Claude se detenga"
}
```

#### Ejemplo de Salida JSON: Edición de Comandos Bash

```python
#!/usr/bin/env python3
import json
import re
import sys

# Define las reglas de validación como una lista de tuplas (patrón de regex, mensaje)
VALIDATION_RULES = [
    (
        r"\bgrep\b(?!.*\|)",
        "Usa 'rg' (ripgrep) en lugar de 'grep' para un mejor rendimiento y características",
    ),
    (
        r"\bfind\s+\S+\s+-name\b",
        "Usa 'rg --files | rg pattern' o 'rg --files -g pattern' en lugar de 'find -name' para un mejor rendimiento",
    ),
]


def validate_command(command: str) -> list[str]:
    issues = []
    for pattern, message in VALIDATION_RULES:
        if re.search(pattern, command):
            issues.append(message)
    return issues


try:
    input_data = json.load(sys.stdin)
except json.JSONDecodeError as e:
    print(f"Error: Entrada JSON inválida: {e}", file=sys.stderr)
    sys.exit(1)

tool_name = input_data.get("tool_name", "")
tool_input = input_data.get("tool_input", {})
command = tool_input.get("command", "")

if tool_name != "Bash" or not command:
    sys.exit(1)

# Validar el comando
issues = validate_command(command)

if issues:
    for message in issues:
        print(f"• {message}", file=sys.stderr)
    # El código de salida 2 bloquea la llamada a la herramienta y muestra stderr a Claude
    sys.exit(2)
```

## Trabajar con Herramientas MCP

Los hooks de Claude Code funcionan sin problemas con
las herramientas del [Protocolo de Contexto del Modelo (MCP)](/en/docs/claude-code/mcp). Cuando los servidores MCP
proporcionan herramientas, aparecen con un patrón de nomenclatura especial que puedes hacer coincidir en
tus hooks.

### Nomenclatura de Herramientas MCP

Las herramientas MCP siguen el patrón `mcp__<servidor>__<herramienta>`, por ejemplo:

- `mcp__memory__create_entities` - Herramienta de creación de entidades del servidor de memoria
- `mcp__filesystem__read_file` - Herramienta de lectura de archivos del servidor de sistema de archivos
- `mcp__github__search_repositories` - Herramienta de búsqueda del servidor de GitHub

### Configuración de Hooks para Herramientas MCP

Puedes apuntar a herramientas MCP específicas o a servidores MCP completos:

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "mcp__memory__.*",
        "hooks": [
          {
            "type": "command",
            "command": "echo 'Operación de memoria iniciada' >> ~/mcp-operations.log"
          }
        ]
      },
      {
        "matcher": "mcp__.*__write.*",
        "hooks": [
          {
            "type": "command",
            "command": "/home/user/scripts/validate-mcp-write.py"
          }
        ]
      }
    ]
  }
}
```

## Ejemplos

### Formateo de Código

Formatea automáticamente el código después de las modificaciones de archivos:

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Write|Edit|MultiEdit",
        "hooks": [
          {
            "type": "command",
            "command": "/home/user/scripts/format-code.sh"
          }
        ]
      }
    ]
  }
}
```

### Notificación

Personaliza la notificación que se envía cuando Claude Code solicita permiso o
cuando la entrada del prompt ha estado inactiva.

```json
{
  "hooks": {
    "Notification": [
      {
        "matcher": "",
        "hooks": [
          {
            "type": "command",
            "command": "python3 ~/my_custom_notifier.py"
          }
        ]
      }
    ]
  }
}
```

## Consideraciones de Seguridad

### Descargo de Responsabilidad

**ÚSALO BAJO TU PROPIO RIESGO**: Los hooks de Claude Code ejecutan comandos de shell arbitrarios en
tu sistema automáticamente. Al usar hooks, reconoces que:

- Eres el único responsable de los comandos que configuras.
- Los hooks pueden modificar, eliminar o acceder a cualquier archivo al que tu cuenta de usuario pueda acceder.
- Los hooks maliciosos o mal escritos pueden causar pérdida de datos o daños en el sistema.
- Anthropic no ofrece ninguna garantía y no asume ninguna responsabilidad por los daños
  resultantes del uso de hooks.
- Debes probar a fondo los hooks en un entorno seguro antes de su uso en producción.

Revisa y comprende siempre cualquier comando de hook antes de añadirlo a tu
configuración.

### Mejores Prácticas de Seguridad

Aquí hay algunas prácticas clave para escribir hooks más seguros:

1. **Valida y sanea las entradas** - Nunca confíes ciegamente en los datos de entrada.
2. **Siempre entrecomilla las variables de shell** - Usa `"$VAR"` no `$VAR`.
3. **Bloquea el recorrido de rutas (path traversal)** - Busca `..` en las rutas de los archivos.
4. **Usa rutas absolutas** - Especifica rutas completas para los scripts.
5. **Omite archivos sensibles** - Evita `.env`, `.git/`, claves, etc.

### Seguridad de la Configuración

Las ediciones directas a los hooks en los archivos de configuración no surten efecto inmediatamente. Claude
Code:

1. Captura una instantánea de los hooks al inicio.
2. Usa esta instantánea durante toda la sesión.
3. Advierte si los hooks se modifican externamente.
4. Requiere una revisión en el menú `/hooks` para que los cambios se apliquen.

Esto evita que las modificaciones maliciosas de los hooks afecten tu sesión actual.

## Detalles de Ejecución de Hooks

- **Timeout**: Límite de ejecución de 60 segundos por defecto, configurable por comando.
  - Si algún comando individual excede el tiempo de espera, todos los hooks en progreso se cancelan.
- **Paralelización**: Todos los hooks que coinciden se ejecutan en paralelo.
- **Entorno**: Se ejecuta en el directorio actual con el entorno de Claude Code.
- **Entrada**: JSON a través de stdin.
- **Salida**:
  - PreToolUse/PostToolUse/Stop: El progreso se muestra en la transcripción (Ctrl-R).
  - Notification: Se registra solo para depuración (`--debug`).

## Depuración

Para solucionar problemas con los hooks:

1. Comprueba si el menú `/hooks` muestra tu configuración.
2. Verifica que tus [archivos de configuración](/en/docs/claude-code/settings) sean JSON
   válidos.
3. Prueba los comandos manualmente.
4. Comprueba los códigos de salida.
5. Revisa las expectativas de formato de stdout y stderr.
6. Asegúrate de que las comillas estén escapadas correctamente.
7. Usa `claude --debug` para depurar tus hooks. La salida de un hook exitoso
   se ve así.

```
[DEBUG] Executing hooks for PostToolUse:Write
[DEBUG] Getting matching hook commands for PostToolUse with query: Write
[DEBUG] Found 1 hook matchers in settings
[DEBUG] Matched 1 hooks for query "Write"
[DEBUG] Found 1 hook commands to execute
[DEBUG] Executing hook command: <Tu comando> with timeout 60000ms
[DEBUG] Hook command completed with status 0: <Tu stdout>
```

Los mensajes de progreso aparecen en el modo de transcripción (Ctrl-R) mostrando:

- Qué hook se está ejecutando.
- El comando que se está ejecutando.
- El estado de éxito/fracaso.
- Mensajes de salida o error.