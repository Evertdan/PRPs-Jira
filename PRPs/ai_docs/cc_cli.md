# Referencia de la CLI

> Referencia completa para la interfaz de línea de comandos de Claude Code, incluyendo comandos y banderas.

## Comandos de la CLI

| Comando                            | Descripción                                    | Ejemplo                                                            |
| :--------------------------------- | :--------------------------------------------- | :----------------------------------------------------------------- |
| `claude`                           | Iniciar REPL interactivo                         | `claude`                                                           |
| `claude "consulta"`                   | Iniciar REPL con un prompt inicial                 | `claude "explica este proyecto"`                                    |
| `claude -p "consulta"`                   | Consultar a través del SDK, luego salir                       | `claude -p "explica esta función"`                                | |
| `cat archivo | claude -p "consulta"`    | Procesar contenido de una tubería (pipe)                          | `cat logs.txt | claude -p "explica"`                              |
| `claude -c`                        | Continuar la conversación más reciente                       | `claude -c`                                                        |
| `claude -c -p "consulta"`             | Continuar a través del SDK                               | `claude -c -p "Verifica errores de tipo"`                             |
| `claude -r "<id-sesion>" "consulta"` | Reanudar sesión por ID                           | `claude -r "abc123" "Termina este PR"`                              |
| `claude update`                    | Actualizar a la última versión                       | `claude update`                                                    |
| `claude mcp`                       | Configurar servidores del Protocolo de Contexto del Modelo (MCP) | Consulta la [documentación de MCP de Claude Code](/en/docs/claude-code/mcp). |

## Banderas de la CLI

Personaliza el comportamiento de Claude Code con estas banderas de línea de comandos:

| Bandera                             | Descripción                                                                                                                                              | Ejemplo                                                     |
| :--------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------- | :---------------------------------------------------------- |
| `--add-dir`                      | Añadir directorios de trabajo adicionales para que Claude acceda (valida que cada ruta exista como un directorio)                                                      | `claude --add-dir ../apps ../lib`                           |
| `--allowedTools`                 | Una lista de herramientas que deben permitirse sin pedir permiso al usuario, además de los [archivos settings.json](/en/docs/claude-code/settings)    | `"Bash(git log:*)" "Bash(git diff:*)" "Read"`               |
| `--disallowedTools`              | Una lista de herramientas que deben denegarse sin pedir permiso al usuario, además de los [archivos settings.json](/en/docs/claude-code/settings) | `"Bash(git log:*)" "Bash(git diff:*)" "Edit"`               |
| `--print`, `-p`                  | Imprimir respuesta sin modo interactivo (consulta la [documentación del SDK](/en/docs/claude-code/sdk) para detalles de uso programático)                               | `claude -p "consulta"`                                         |
| `--output-format`                | Especificar el formato de salida para el modo de impresión (opciones: `text`, `json`, `stream-json`)                                                                            | `claude -p "consulta" --output-format json`                    |
| `--input-format`                 | Especificar el formato de entrada para el modo de impresión (opciones: `text`, `stream-json`)                                                                                     | `claude -p --output-format json --input-format stream-json` |
| `--verbose`                      | Habilitar registro detallado, muestra la salida completa turno por turno (útil para depurar en modos de impresión e interactivo)                                       | `claude --verbose`                                          |
| `--max-turns`                    | Limitar el número de turnos agénticos en modo no interactivo                                                                                                | `claude -p --max-turns 3 "consulta"`                           |
| `--model`                        | Establece el modelo para la sesión actual con un alias para el último modelo (`sonnet` u `opus`) o el nombre completo de un modelo                                    | `claude --model claude-sonnet-4-20250514`                   |
| `--permission-mode`              | Iniciar en un [modo de permiso](iam#permission-modes) especificado                                                                                             | `claude --permission-mode plan`                             |
| `--permission-prompt-tool`       | Especificar una herramienta MCP para manejar las solicitudes de permiso en modo no interactivo                                                                                 | `claude -p --permission-prompt-tool mcp_auth_tool "consulta"`  |
| `--resume`                       | Reanudar una sesión específica por ID, o eligiendo en modo interactivo                                                                                      | `claude --resume abc123 "consulta"`                              |
| `--continue`                     | Cargar la conversación más reciente en el directorio actual                                                                                               | `claude --continue`                                         |
| `--dangerously-skip-permissions` | Omitir las solicitudes de permiso (usar con precaución)                                                                                                               | `claude --dangerously-skip-permissions`                     |

<Tip>
  La bandera `--output-format json` es particularmente útil para scripting y
  automatización, permitiéndote analizar las respuestas de Claude de forma programática.
</Tip>

Para información detallada sobre el modo de impresión (`-p`), incluyendo formatos de salida,
streaming, registro detallado y uso programático, consulta la
[documentación del SDK](/en/docs/claude-code/sdk).

## Ver también

- [Modo interactivo](/en/docs/claude-code/interactive-mode) - Atajos, modos de entrada y características interactivas
- [Comandos de barra diagonal](/en/docs/claude-code/slash-commands) - Comandos de sesión interactiva
- [Guía de inicio rápido](/en/docs/claude-code/quickstart) - Empezando con Claude Code
- [Flujos de trabajo comunes](/en/docs/claude-code/common-workflows) - Flujos de trabajo y patrones avanzados
- [Configuración](/en/docs/claude-code/settings) - Opciones de configuración
- [Documentación del SDK](/en/docs/claude-code/sdk) - Uso programático e integraciones

# Modo interactivo

> Referencia completa de atajos de teclado, modos de entrada y características interactivas en las sesiones de Claude Code.

## Atajos de teclado

### Controles generales

| Atajo | Descripción | Contexto |
| :--- | :--- | :--- |
| `Ctrl+C` | Cancelar entrada o generación actual | Interrupción estándar |
| `Ctrl+D` | Salir de la sesión de Claude Code | Señal de EOF |
| `Ctrl+L` | Limpiar la pantalla del terminal | Mantiene el historial de la conversación |
| `Flechas Arriba/Abajo` | Navegar por el historial de comandos | Recordar entradas anteriores |
| `Esc` + `Esc` | Editar mensaje anterior | Doble escape para modificar |

### Entrada multilínea

| Método | Atajo | Contexto |
| :--- | :--- | :--- |
| Escape rápido | `\` + `Enter` | Funciona en todos los terminales |
| Por defecto en macOS | `Opción+Enter` | Por defecto en macOS |
| Configuración del terminal | `Shift+Enter` | Después de `/terminal-setup` |
| Modo de pegado | Pegar directamente | Para bloques de código, registros |

### Comandos rápidos

| Atajo | Descripción | Notas |
| :--- | :--- | :--- |
| `#` al inicio | Atajo de memoria - añadir a CLAUDE.md | Pide seleccionar un archivo |
| `/` al inicio | Comando de barra diagonal | Ver [comandos de barra diagonal](/en/docs/claude-code/slash-commands) |

## Modo Vim

Habilita la edición estilo vim con el comando `/vim` o configúralo permanentemente a través de `/config`.

### Cambio de modo

| Comando | Acción | Desde el modo |
| :--- | :--- | :--- |
| `Esc` | Entrar en modo NORMAL | INSERTAR |
| `i` | Insertar antes del cursor | NORMAL |
| `I` | Insertar al principio de la línea | NORMAL |
| `a` | Insertar después del cursor | NORMAL |
| `A` | Insertar al final de la línea | NORMAL |
| `o` | Abrir línea debajo | NORMAL |
| `O` | Abrir línea arriba | NORMAL |

### Navegación (modo NORMAL)

| Comando | Acción |
| :--- | :--- |
| `h`/`j`/`k`/`l` | Mover izquierda/abajo/arriba/derecha |
| `w` | Siguiente palabra |
| `e` | Fin de palabra |
| `b` | Palabra anterior |
| `0` | Principio de línea |
| `$` | Fin de línea |
| `^` | Primer carácter no en blanco |
| `gg` | Principio de la entrada |
| `G` | Fin de la entrada |

### Edición (modo NORMAL)

| Comando | Acción |
| :--- | :--- |
| `x` | Eliminar carácter |
| `dd` | Eliminar línea |
| `D` | Eliminar hasta el final de la línea |
| `dw`/`de`/`db` | Eliminar palabra/hasta el final/hacia atrás |
| `cc` | Cambiar línea |
| `C` | Cambiar hasta el final de la línea |
| `cw`/`ce`/`cb` | Cambiar palabra/hasta el final/hacia atrás |
| `.` | Repetir último cambio |

<Tip>
  Configura tu comportamiento preferido para el salto de línea en la configuración de tu terminal. Ejecuta `/terminal-setup` para instalar el atajo Shift+Enter para los terminales de iTerm2 y VS Code.
</Tip>

## Historial de comandos

Claude Code mantiene un historial de comandos para la sesión actual:

- El historial se almacena por directorio de trabajo.
- Se borra con el comando `/clear`.
- Usa las flechas Arriba/Abajo para navegar (ver atajos de teclado arriba).
- **Ctrl+R**: Búsqueda inversa a través del historial (si es compatible con el terminal).
- **Nota**: La expansión del historial (`!`) está deshabilitada por defecto.

## Ver también

- [Comandos de barra diagonal](/en/docs/claude-code/slash-commands) - Comandos de sesión interactiva
- [Referencia de la CLI](/en/docs/claude-code/cli-reference) - Banderas y opciones de línea de comandos
- [Configuración](/en/docs/claude-code/settings) - Opciones de configuración
- [Gestión de la memoria](/en/docs/claude-code/memory) - Gestionando los archivos CLAUDE.md