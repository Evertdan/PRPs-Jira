# Contenedores de Desarrollo

> Aprende sobre el contenedor de desarrollo de Claude Code para equipos que necesitan entornos consistentes y seguros.

La configuración preconfigurada de [devcontainer](https://code.visualstudio.com/docs/devcontainers/containers) funciona sin problemas con la extensión Remote - Containers de VS Code y herramientas similares.

Las medidas de seguridad mejoradas del contenedor (aislamiento y reglas de firewall) te permiten ejecutar `claude --dangerously-skip-permissions` para omitir las solicitudes de permiso para una operación desatendida.
Hemos incluido una [implementación de referencia](https://github.com/anthropics/claude-code/tree/main/.devcontainer) que puedes personalizar para tus necesidades.

<Warning>
  Aunque el devcontainer proporciona protecciones sustanciales, ningún sistema es completamente inmune a todos los ataques.
  Cuando se ejecuta con `--dangerously-skip-permissions`, los devcontainers no evitan que un proyecto malicioso exfiltre cualquier cosa accesible en el devcontainer, incluidas las credenciales de Claude Code.
  Recomendamos usar devcontainers solo al desarrollar con repositorios de confianza.
  Mantén siempre buenas prácticas de seguridad y monitorea las actividades de Claude.
</Warning>

## Características clave

- **Node.js listo para producción**: Basado en Node.js 20 con dependencias de desarrollo esenciales.
- **Seguridad por diseño**: Firewall personalizado que restringe el acceso a la red solo a los servicios necesarios.
- **Herramientas amigables para el desarrollador**: Incluye git, ZSH con mejoras de productividad, fzf y más.
- **Integración perfecta con VS Code**: Extensiones preconfiguradas y ajustes optimizados.
- **Persistencia de la sesión**: Conserva el historial de comandos y las configuraciones entre reinicios del contenedor.
- **Funciona en todas partes**: Compatible con entornos de desarrollo de macOS, Windows y Linux.

## Cómo empezar en 4 pasos

1. Instala VS Code y la extensión Remote - Containers.
2. Clona el repositorio de [implementación de referencia de Claude Code](https://github.com/anthropics/claude-code/tree/main/.devcontainer).
3. Abre el repositorio en VS Code.
4. Cuando se te solicite, haz clic en "Reabrir en Contenedor" (o usa la Paleta de Comandos: Cmd+Shift+P → "Remote-Containers: Reopen in Container").

## Desglose de la configuración

La configuración del devcontainer consta de tres componentes principales:

- [**devcontainer.json**](https://github.com/anthropics/claude-code/blob/main/.devcontainer/devcontainer.json): Controla la configuración del contenedor, las extensiones y los montajes de volúmenes.
- [**Dockerfile**](https://github.com/anthropics/claude-code/blob/main/.devcontainer/Dockerfile): Define la imagen del contenedor y las herramientas instaladas.
- [**init-firewall.sh**](https://github.com/anthropics/claude-code/blob/main/.devcontainer/init-firewall.sh): Establece las reglas de seguridad de la red.

## Características de seguridad

El contenedor implementa un enfoque de seguridad de múltiples capas con su configuración de firewall:

- **Control de acceso preciso**: Restringe las conexiones salientes solo a dominios en la lista blanca (registro de npm, GitHub, API de Anthropic, etc.).
- **Conexiones salientes permitidas**: El firewall permite conexiones salientes de DNS y SSH.
- **Política de denegación por defecto**: Bloquea todo el resto del acceso a la red externa.
- **Verificación de inicio**: Valida las reglas del firewall cuando se inicializa el contenedor.
- **Aislamiento**: Crea un entorno de desarrollo seguro separado de tu sistema principal.

## Opciones de personalización

La configuración del devcontainer está diseñada para ser adaptable a tus necesidades:

- Añade o elimina extensiones de VS Code según tu flujo de trabajo.
- Modifica las asignaciones de recursos para diferentes entornos de hardware.
- Ajusta los permisos de acceso a la red.
- Personaliza las configuraciones de la shell y las herramientas de desarrollo.

## Casos de uso de ejemplo

### Trabajo seguro con clientes

Usa devcontainers para aislar diferentes proyectos de clientes, asegurando que el código y las credenciales nunca se mezclen entre entornos.

### Incorporación de equipos (Onboarding)

Los nuevos miembros del equipo pueden obtener un entorno de desarrollo completamente configurado en minutos, con todas las herramientas y ajustes necesarios preinstalados.

### Entornos de CI/CD consistentes

Refleja la configuración de tu devcontainer en los pipelines de CI/CD para asegurar que los entornos de desarrollo y producción coincidan.

## Recursos relacionados

- [Documentación de devcontainers de VS Code](https://code.visualstudio.com/docs/devcontainers/containers)
- [Mejores prácticas de seguridad de Claude Code](/en/docs/claude-code/security)
- [Configuración de proxy corporativo](/en/docs/claude-code/corporate-proxy)