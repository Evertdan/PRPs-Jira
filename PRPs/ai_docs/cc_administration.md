# Configurar Claude Code

> Instala, autentica y comienza a usar Claude Code en tu máquina de desarrollo.

## Requisitos del sistema

- **Sistemas Operativos**: macOS 10.15+, Ubuntu 20.04+/Debian 10+, o Windows 10+ (con WSL 1, WSL 2, o Git para Windows)
- **Hardware**: 4GB+ de RAM
- **Software**: [Node.js 18+](https://nodejs.org/en/download)
- **Red**: Se requiere conexión a internet para la autenticación y el procesamiento de la IA.
- **Shell**: Funciona mejor en Bash, Zsh o Fish.
- **Ubicación**: [Países admitidos por Anthropic](https://www.anthropic.com/supported-countries)

## Instalación estándar

Para instalar Claude Code, ejecuta el siguiente comando:

```sh
npm install -g @anthropic-ai/claude-code
```

<Warning>
  NO uses `sudo npm install -g` ya que esto puede llevar a problemas de permisos y riesgos de seguridad.
  Si encuentras errores de permisos, consulta [configurar Claude Code](/en/docs/claude-code/troubleshooting#linux-permission-issues) para ver las soluciones recomendadas.
</Warning>

<Note>
  Algunos usuarios pueden ser migrados automáticamente a un método de instalación mejorado.
  Ejecuta `claude doctor` después de la instalación para verificar tu tipo de instalación.
</Note>

Una vez que el proceso de instalación se complete, navega a tu proyecto e inicia Claude Code:

```bash
cd tu-increible-proyecto
claude
```

Claude Code ofrece las siguientes opciones de autenticación:

1. **Consola de Anthropic**: La opción por defecto. Conéctate a través de la Consola de Anthropic y completa el proceso de OAuth. Requiere facturación activa en [console.anthropic.com](https://console.anthropic.com).
2. **Aplicación de Claude (con plan Pro o Max)**: Suscríbete al [plan Pro o Max](https://www.anthropic.com/pricing) de Claude para una suscripción unificada que incluye tanto Claude Code como la interfaz web. Obtén más valor por el mismo precio mientras gestionas tu cuenta en un solo lugar. Inicia sesión con tu cuenta de Claude.ai. Durante el inicio, elige la opción que coincida con tu tipo de suscripción.
3. **Plataformas empresariales**: Configura Claude Code para usar [Amazon Bedrock o Google Vertex AI](/en/docs/claude-code/third-party-integrations) para despliegues empresariales con tu infraestructura en la nube existente.

<Note>
  Claude Code almacena tus credenciales de forma segura. Consulta [Gestión de Credenciales](/en/docs/claude-code/iam#credential-management) para más detalles.
</Note>

## Configuración en Windows

**Opción 1: Claude Code dentro de WSL**

- Se admiten tanto WSL 1 como WSL 2.

**Opción 2: Claude Code en Windows nativo con Git Bash**

- Requiere [Git para Windows](https://git-scm.com/downloads/win).
- Para instalaciones portátiles de Git, especifica la ruta a tu `bash.exe`:
  ```powershell
  $env:CLAUDE_CODE_GIT_BASH_PATH="C:\Program Files\Git\bin\bash.exe"
  ```

## Métodos de instalación alternativos

Claude Code ofrece múltiples métodos de instalación para adaptarse a diferentes entornos.

Si encuentras algún problema durante la instalación, consulta la [guía de solución de problemas](/en/docs/claude-code/troubleshooting#linux-permission-issues).

<Tip>
  Ejecuta `claude doctor` después de la instalación para verificar tu tipo de instalación y versión.
</Tip>

### Instalación global con npm

Método tradicional mostrado en los [pasos de instalación anteriores](#install-and-authenticate).

### Instalación de binario nativo (Beta)

Si tienes una instalación existente de Claude Code, usa `claude install` para iniciar la instalación del binario nativo.

Para una instalación nueva, ejecuta el siguiente comando:

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

El instalador nativo de Claude Code es compatible con macOS, Linux y Windows.

<Tip>
  Asegúrate de eliminar cualquier alias o enlace simbólico obsoleto.
  Una vez que la instalación esté completa, ejecuta `claude doctor` para verificar la instalación.
</Tip>

### Instalación local

- Después de la instalación global a través de npm, usa `claude migrate-installer` para moverla a local.
- Evita problemas de permisos de npm con el actualizador automático.
- Algunos usuarios pueden ser migrados automáticamente a este método.

## Ejecución en AWS o GCP

Por defecto, Claude Code utiliza la API de Anthropic.

Para detalles sobre cómo ejecutar Claude Code en AWS o GCP, consulta [integraciones de terceros](/en/docs/claude-code/third-party-integrations).

## Actualizar Claude Code

### Actualizaciones automáticas

Claude Code se mantiene actualizado automáticamente para asegurar que tengas las últimas características y correcciones de seguridad.

- **Verificaciones de actualización**: Se realizan al inicio y periódicamente mientras se ejecuta.
- **Proceso de actualización**: Descarga e instala automáticamente en segundo plano.
- **Notificaciones**: Verás una notificación cuando se instalen las actualizaciones.
- **Aplicación de actualizaciones**: Las actualizaciones surten efecto la próxima vez que inicies Claude Code.

**Desactivar actualizaciones automáticas:**

```bash
# A través de la configuración
claude config set autoUpdates false --global

# O a través de una variable de entorno
export DISABLE_AUTOUPDATER=1
```

### Actualizar manualmente

```bash
claude update
```