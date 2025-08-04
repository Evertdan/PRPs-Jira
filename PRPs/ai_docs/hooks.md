# Primeros pasos con los hooks de Claude Code

> Aprende a personalizar y extended el comportamiento de Claude Code registrando comandos de shell.

Los hooks de Claude Code son comandos de shell definidos por el usuario que se ejecutan en varios puntos del ciclo de vida de Claude Code. Los hooks proporcionan un control determinista sobre el comportamiento de Claude Code, asegurando que ciertas acciones siempre ocurran en lugar de depender de que el LLM elija ejecutarlas.

<Tip>
  Para la documentación de referencia sobre los hooks, consulta [Referencia de Hooks](/en/docs/claude-code/hooks).
</Tip>

Casos de uso de ejemplo para los hooks incluyen:

- **Notificaciones**: Personaliza cómo recibes notificaciones cuando Claude Code está esperando tu entrada o permiso para ejecutar algo.
- **Formateo automático**: Ejecuta `prettier` en archivos .ts, `gofmt` en archivos .go, etc., después de cada edición de archivo.
- **Registro (Logging)**: Rastrea y cuenta todos los comandos ejecutados para cumplimiento o depuración.
- **Retroalimentación (Feedback)**: Proporciona retroalimentación automatizada cuando Claude Code produce código que no sigue las convenciones de tu base de código.
- **Permisos personalizados**: Bloquea modificaciones a archivos de producción o directorios sensibles.

Al codificar estas reglas como hooks en lugar de instrucciones en un prompt, conviertes las sugerencias en código a nivel de aplicación que se ejecuta cada vez que se espera que lo haga.

<Warning>
  Debes considerar las implicaciones de seguridad de los hooks a medida que los añades, porque los hooks se ejecutan automáticamente durante el bucle del agente con las credenciales de tu entorno actual.
  Por ejemplo, el código de hooks malicioso puede exfiltrar tus datos. Revisa siempre la implementación de tus hooks antes de registrarlos.

Para conocer las mejores prácticas de seguridad completas, consulta [Consideraciones de Seguridad](/en/docs/claude-code/hooks#security-considerations) en la documentación de referencia de los hooks.
</Warning>

## Resumen de Eventos de Hook

Claude Code proporciona varios eventos de hook que se ejecutan en diferentes puntos del flujo de trabajo:

- **PreToolUse**: Se ejecuta antes de las llamadas a herramientas (puede bloquearlas).
- **PostToolUse**: Se ejecuta después de que las llamadas a herramientas se completan.
- **Notification**: Se ejecuta cuando Claude Code envía notificaciones.
- **Stop**: Se ejecuta cuando Claude Code termina de responder.
- **Subagent Stop**: Se ejecuta cuando las tareas del subagente se completan.

Cada evento recibe datos diferentes y puede controlar el comportamiento de Claude de diferentes maneras.

## Inicio Rápido

En este inicio rápido, añadirás un hook que registra los comandos de shell que Claude Code ejecuta.

### Prerrequisitos

Instala `jq` para el procesamiento de JSON en la línea de comandos.

### Paso 1: Abrir la configuración de hooks

Ejecuta el [comando de barra diagonal](/en/docs/claude-code/slash-commands) `/hooks` y selecciona el evento de hook `PreToolUse`.

Los hooks `PreToolUse` se ejecutan antes de las llamadas a herramientas y pueden bloquearlas mientras proporcionan retroalimentación a Claude sobre qué hacer de manera diferente.

### Paso 2: Añadir un matcher

Selecciona `+ Añadir nuevo matcher…` para ejecutar tu hook solo en las llamadas a la herramienta Bash.

Escribe `Bash` para el matcher.

<Note>Puedes usar `*` para que coincida con todas las herramientas.</Note>

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
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Bash",
        "hooks": [
          {
            "type": "command",
            "command": "jq -r '\"\\\(.tool_input.command) - \\(.tool_input.description // \"Sin descripción\")\"' >> ~/.claude/bash-command-log.txt"
          }
        ]
      }
    ]
  }
}
```

### Paso 6: Probar tu hook

Pídele a Claude que ejecute un comando simple como `ls` y revisa tu archivo de registro:

```bash
cat ~/.claude/bash-command-log.txt
```

Deberías ver entradas como:

```
ls - Lista archivos y directorios
```

## Más Ejemplos

<Note>
  Para una implementación de ejemplo completa, consulta el [ejemplo de validador de comandos bash](https://github.com/anthropics/claude-code/blob/main/examples/hooks/bash_command_validator_example.py) en nuestra base de código pública.
</Note>

### Hook de Formateo de Código

Formatea automáticamente los archivos TypeScript después de editarlos:

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Edit|MultiEdit|Write",
        "hooks": [
          {
            "type": "command",
            "command": "jq -r '.tool_input.file_path' | { read file_path; if echo \"$file_path\" | grep -q '\.ts$'; then npx prettier --write \"$file_path\"; fi; }"
          }
        ]
      }
    ]
  }
}
```

### Hook de Notificación Personalizada

Recibe notificaciones de escritorio cuando Claude necesite tu entrada:

```json
{
  "hooks": {
    "Notification": [
      {
        "matcher": "",
        "hooks": [
          {
            "type": "command",
            "command": "notify-send 'Claude Code' 'Esperando tu entrada'"
          }
        ]
      }
    ]
  }
}
```

### Hook de Protección de Archivos

Bloquea las ediciones a archivos sensibles:

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Edit|MultiEdit|Write",
        "hooks": [
          {
            "type": "command",
            "command": "python3 -c \"import json, sys; data=json.load(sys.stdin); path=data.get('tool_input',{}).get('file_path',''); sys.exit(2 if any(p in path for p in ['.env', 'package-lock.json', '.git/']) else 0)\""
          }
        ]
      }
    ]
  }
}
```

## Aprende más

- Para la documentación de referencia sobre los hooks, consulta [Referencia de Hooks](/en/docs/claude-code/hooks).
- Para conocer las mejores prácticas de seguridad completas y las directrices de seguridad, consulta [Consideraciones de Seguridad](/en/docs/claude-code/hooks#security-considerations) en la documentación de referencia de los hooks.
- Para los pasos de solución de problemas y técnicas de depuración, consulta [Depuración](/en/docs/claude-code/hooks#debugging) en la documentación de referencia de los hooks.