# Solución de problemas

> Descubre soluciones a problemas comunes con la instalación y el uso de Claude Code.

## Problemas comunes de instalación

### Problemas de instalación en Windows: errores en WSL

Puedes encontrar los siguientes problemas en WSL:

**Problemas de detección de SO/plataforma**: Si recibes un error durante la instalación, es posible que WSL esté usando el `npm` de Windows. Intenta:

- Ejecutar `npm config set os linux` antes de la instalación.
- Instalar con `npm install -g @anthropic-ai/claude-code --force --no-os-check` (NO uses `sudo`).

**Errores de "Node not found"**: Si ves `exec: node: not found` al ejecutar `claude`, es posible que tu entorno WSL esté usando una instalación de Node.js de Windows. Puedes confirmarlo con `which npm` y `which node`, que deberían apuntar a rutas de Linux que comiencen con `/usr/` en lugar de `/mnt/c/`. Para solucionarlo, intenta instalar Node a través del gestor de paquetes de tu distribución de Linux o a través de [`nvm`](https://github.com/nvm-sh/nvm).

### Problemas de instalación en Linux y Mac: errores de permisos o "command not found"

Al instalar Claude Code con npm, los problemas de `PATH` pueden impedir el acceso a `claude`.
También puedes encontrar errores de permisos si tu prefijo global de npm no es escribible por el usuario (p. ej., `/usr` o `/usr/local`).

#### Solución recomendada: Instalación nativa de Claude Code

Claude Code tiene una instalación nativa que no depende de npm o Node.js.

<Note>
  El instalador nativo de Claude Code está actualmente en beta.
</Note>

Usa el siguiente comando para ejecutar el instalador nativo.

**macOS, Linux, WSL:**

```bash
# Instalar versión estable (por defecto)
curl -fsSL https://claude.ai/install.sh | bash

# Instalar última versión
curl -fsSL https://claude.ai/install.sh | bash -s latest

# Instalar número de versión específico
curl -fsSL https://claude.ai/install.sh | bash -s 1.0.58
```

**Windows PowerShell:**

```powershell
# Instalar versión estable (por defecto)
irm https://claude.ai/install.ps1 | iex

# Instalar última versión
& ([scriptblock]::Create((irm https://claude.ai/install.ps1))) latest

# Instalar número de versión específico
& ([scriptblock]::Create((irm https://claude.ai/install.ps1))) 1.0.58

```

Este comando instala la compilación apropiada de Claude Code para tu sistema operativo y arquitectura y añade un enlace simbólico a la instalación en `~/.local/bin/claude`.

<Tip>
  Asegúrate de que el directorio de instalación esté en tu `PATH` del sistema.
</Tip>

#### Solución alternativa: Migrar a una instalación local

Alternativamente, si Claude Code se ejecuta, puedes migrar a una instalación local:

```bash
claude migrate-installer
```

Esto mueve Claude Code a `~/.claude/local/` y configura un alias en la configuración de tu shell. No se requiere `sudo` para futuras actualizaciones.

Después de la migración, reinicia tu shell y luego verifica tu instalación:

En macOS/Linux/WSL:

```bash
which claude  # Debería mostrar un alias a ~/.claude/local/claude
```

En Windows:

```powershell
where claude  # Debería mostrar la ruta al ejecutable de claude
```

Verificar instalación:

```bash
claude doctor # Comprobar la salud de la instalación
```

## Permisos y autenticación

### Solicitudes de permiso repetidas

Si te encuentras aprobando repetidamente los mismos comandos, puedes permitir que herramientas específicas
se ejecuten sin aprobación usando el comando `/permissions`. Consulta la [documentación de Permisos](/en/docs/claude-code/iam#configuring-permissions).

### Problemas de autenticación

Si tienes problemas de autenticación:

1. Ejecuta `/logout` para cerrar sesión por completo.
2. Cierra Claude Code.
3. Reinicia con `claude` y completa el proceso de autenticación de nuevo.

Si los problemas persisten, intenta:

```bash
rm -rf ~/.config/claude-code/auth.json
claude
```

Esto elimina tu información de autenticación almacenada y fuerza un inicio de sesión limpio.

## Rendimiento y estabilidad

### Alto uso de CPU o memoria

Claude Code está diseñado para funcionar con la mayoría de los entornos de desarrollo, pero puede consumir recursos significativos al procesar grandes bases de código. Si tienes problemas de rendimiento:

1. Usa `/compact` regularmente para reducir el tamaño del contexto.
2. Cierra y reinicia Claude Code entre tareas importantes.
3. Considera añadir grandes directorios de compilación a tu archivo `.gitignore`.

### El comando se cuelga o se congela

Si Claude Code parece no responder:

1. Presiona Ctrl+C para intentar cancelar la operación actual.
2. Si no responde, es posible que necesites cerrar el terminal y reiniciar.

### La tecla ESC no funciona en los terminales de JetBrains (IntelliJ, PyCharm, etc.)

Si estás usando Claude Code en los terminales de JetBrains y la tecla ESC no interrumpe al agente como se esperaba, es probable que se deba a un conflicto de atajos de teclado con los atajos predeterminados de JetBrains.

Para solucionar este problema:

1. Ve a `Settings` → `Tools` → `Terminal`.
2. Haz clic en el hipervínculo "Configure terminal keybindings" junto a "Override IDE Shortcuts".
3. Dentro de los atajos de teclado del terminal, desplázate hacia abajo hasta "Switch focus to Editor" y elimina ese atajo.

Esto permitirá que la tecla ESC funcione correctamente para cancelar las operaciones de Claude Code en lugar de ser capturada por la acción "Switch focus to Editor" de PyCharm.

## Obtener más ayuda

Si tienes problemas que no se cubren aquí:

1. Usa el comando `/bug` dentro de Claude Code para informar de problemas directamente a Anthropic.
2. Consulta el [repositorio de GitHub](https://github.com/anthropics/claude-code) para ver problemas conocidos.
3. Ejecuta `/doctor` para comprobar la salud de tu instalación de Claude Code.
4. Pregúntale directamente a Claude sobre sus capacidades y características - Claude tiene acceso incorporado a su documentación.