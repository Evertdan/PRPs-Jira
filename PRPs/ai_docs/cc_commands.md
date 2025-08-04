# Comandos de Barra Diagonal

> Controla el comportamiento de Claude durante una sesión interactiva con comandos de barra diagonal.

## Comandos de barra diagonal incorporados

| Comando | Propósito |
| :--- | :--- |
| `/add-dir` | Añadir directorios de trabajo adicionales |
| `/agents` | Gestionar subagentes de IA personalizados para tareas especializadas |
| `/bug` | Informar de errores (envía la conversación a Anthropic) |
| `/clear` | Limpiar el historial de la conversación |
| `/compact [instrucciones]` | Compactar la conversación con instrucciones de enfoque opcionales |
| `/config` | Ver/modificar la configuración |
| `/cost` | Mostrar estadísticas de uso de tokens |
| `/doctor` | Comprueba la salud de tu instalación de Claude Code |
| `/help` | Obtener ayuda sobre el uso |
| `/init` | Inicializar el proyecto con la guía CLAUDE.md |
| `/login` | Cambiar de cuenta de Anthropic |
| `/logout` | Cerrar sesión de tu cuenta de Anthropic |
| `/mcp` | Gestionar conexiones de servidor MCP y autenticación OAuth |
| `/memory` | Editar archivos de memoria CLAUDE.md |
| `/model` | Seleccionar o cambiar el modelo de IA |
| `/permissions` | Ver o actualizar [permisos](/en/docs/claude-code/iam#configuring-permissions) |
| `/pr_comments` | Ver comentarios de pull request |
| `/review` | Solicitar revisión de código |
| `/status` | Ver estados de la cuenta y del sistema |
| `/terminal-setup` | Instalar el atajo de teclado Shift+Enter para nuevas líneas (solo iTerm2 y VSCode) |
| `/vim` | Entrar en modo vim para alternar entre los modos de inserción y comando |

## Comandos de barra diagonal personalizados

Los comandos de barra diagonal personalizados te permiten definir prompts de uso frecuente como archivos Markdown que Claude Code puede ejecutar. Los comandos se organizan por ámbito (específicos del proyecto o personales) y admiten espacios de nombres a través de estructuras de directorios.

### Sintaxis

```
/<nombre-comando> [argumentos]
```

#### Parámetros

| Parámetro | Descripción |
| :--- | :--- |
| `<nombre-comando>` | Nombre derivado del nombre del archivo Markdown (sin la extensión `.md`) |
| `[argumentos]` | Argumentos opcionales pasados al comando |

### Tipos de comando

#### Comandos de proyecto

Comandos almacenados en tu repositorio y compartidos con tu equipo. Cuando se listan en `/help`, estos comandos muestran "(proyecto)" después de su descripción.

**Ubicación**: `.claude/commands/`

En el siguiente ejemplo, creamos el comando `/optimize`:

```bash
# Crear un comando de proyecto
mkdir -p .claude/commands
echo "Analiza este código en busca de problemas de rendimiento y sugiere optimizaciones:" > .claude/commands/optimize.md
```

#### Comandos personales

Comandos disponibles en todos tus proyectos. Cuando se listan en `/help`, estos comandos muestran "(usuario)" después de su descripción.

**Ubicación**: `~/.claude/commands/`

En el siguiente ejemplo, creamos el comando `/security-review`:

```bash
# Crear un comando personal
mkdir -p ~/.claude/commands
echo "Revisa este código en busca de vulnerabilidades de seguridad:" > ~/.claude/commands/security-review.md
```

### Características

#### Espacios de nombres (Namespacing)

Organiza los comandos en subdirectorios. Los subdirectorios determinan el nombre completo del comando. La descripción mostrará si el comando proviene del directorio del proyecto (`.claude/commands`) o del directorio a nivel de usuario (`~/.claude/commands`).

No se admiten conflictos entre comandos a nivel de usuario y de proyecto. Por lo demás, pueden coexistir múltiples comandos con el mismo nombre de archivo base.

Por ejemplo, un archivo en `.claude/commands/frontend/component.md` crea el comando `/frontend:component` con una descripción que muestra "(proyecto)".
Mientras tanto, un archivo en `~/.claude/commands/component.md` crea el comando `/component` con una descripción que muestra "(usuario)".

#### Argumentos

Pasa valores dinámicos a los comandos usando el marcador de posición `$ARGUMENTS`.

Por ejemplo:

```bash
# Definición del comando
echo 'Arregla el issue #$ARGUMENTS siguiendo nuestros estándares de codificación' > .claude/commands/fix-issue.md

# Uso
> /fix-issue 123
```

#### Ejecución de comandos Bash

Ejecuta comandos bash antes de que se ejecute el comando de barra diagonal usando el prefijo `!`. La salida se incluye en el contexto del comando. _Debes_ incluir `allowed-tools` con la herramienta `Bash`, pero puedes elegir los comandos bash específicos a permitir.

Por ejemplo:

```markdown
---
allowed-tools: Bash(git add:*), Bash(git status:*), Bash(git commit:*)
description: Crear un commit de git
---

## Contexto

- Estado actual de git: !`git status`
- Diferencia actual de git (cambios preparados y no preparados): !`git diff HEAD`
- Rama actual: !`git branch --show-current`
- Commits recientes: !`git log --oneline -10`

## Tu tarea

Basado en los cambios anteriores, crea un único commit de git.
```

#### Referencias de archivos

Incluye el contenido de los archivos en los comandos usando el prefijo `@` para [referenciar archivos](/en/docs/claude-code/common-workflows#reference-files-and-directories).

Por ejemplo:

```markdown
# Referenciar un archivo específico

Revisa la implementación en @src/utils/helpers.js

# Referenciar múltiples archivos

Compara @src/old-version.js con @src/new-version.js
```

#### Modo de pensamiento

Los comandos de barra diagonal pueden activar un pensamiento extendido al incluir [palabras clave de pensamiento extendido](/en/docs/claude-code/common-workflows#use-extended-thinking).

### Frontmatter

Los archivos de comando admiten frontmatter, útil para especificar metadatos sobre el comando:

\| Frontmatter | Propósito | Por defecto |
\| :--- | :--- | :--- |
\| `allowed-tools` | Lista de herramientas que el comando puede usar | Hereda de la conversación |
\| `argument-hint` | Los argumentos esperados para el comando de barra diagonal. Ejemplo: `argument-hint: add [tagId] | remove [tagId]                      | list`. Esta pista se muestra al usuario al autocompletar el comando de barra diagonal. | Ninguno |
\| `description` | Breve descripción del comando | Usa la primera línea del prompt |
\| `model` | `opus`, `sonnet`, `haiku`, o una cadena de modelo específica | Hereda de la conversación |

Por ejemplo:

```markdown
---
allowed-tools: Bash(git add:*), Bash(git status:*), Bash(git commit:*)
argument-hint: [mensaje]
description: Crear un commit de git
model: haiku
---

Un comando de ejemplo
```

## Comandos de barra diagonal de MCP

Los servidores MCP pueden exponer prompts como comandos de barra diagonal que se vuelven disponibles en Claude Code. Estos comandos se descubren dinámicamente desde los servidores MCP conectados.

### Formato del comando

Los comandos de MCP siguen el patrón:

```
/mcp__<nombre-servidor>__<nombre-prompt> [argumentos]
```

### Características

#### Descubrimiento dinámico

Los comandos de MCP están disponibles automáticamente cuando:

- Un servidor MCP está conectado y activo.
- El servidor expone prompts a través del protocolo MCP.
- Los prompts se recuperan con éxito durante la conexión.

#### Argumentos

Los prompts de MCP pueden aceptar argumentos definidos por el servidor:

```
# Sin argumentos
> /mcp__github__list_prs

# Con argumentos
> /mcp__github__pr_review 456
> /mcp__jira__create_issue "Título del bug" alta
```

#### Convenciones de nomenclatura

- Los nombres de servidores y prompts se normalizan.
- Los espacios y caracteres especiales se convierten en guiones bajos.
- Los nombres se convierten a minúsculas por consistencia.

### Gestión de conexiones MCP

Usa el comando `/mcp` para:

- Ver todos los servidores MCP configurados.
- Comprobar el estado de la conexión.
- Autenticarse con servidores habilitados para OAuth.
- Limpiar los tokens de autenticación.
- Ver las herramientas y prompts disponibles de cada servidor.

## Ver también

- [Modo interactivo](/en/docs/claude-code/interactive-mode) - Atajos, modos de entrada y características interactivas
- [Referencia de la CLI](/en/docs/claude-code/cli-reference) - Banderas y opciones de línea de comandos
- [Configuración](/en/docs/claude-code/settings) - Opciones de configuración
- [Gestión de la memoria](/en/docs/claude-code/memory) - Gestionando la memoria de Claude entre sesiones