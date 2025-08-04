# Protocolo de Contexto del Modelo (MCP)

> Aprende a configurar MCP con Claude Code.

El Protocolo de Contexto del Modelo (MCP) es un protocolo abierto que permite a los LLMs acceder a herramientas y fuentes de datos externas. Para más detalles sobre MCP, consulta la [documentación de MCP](https://modelcontextprotocol.io/introduction).

<Warning>
  Usa servidores MCP de terceros bajo tu propio riesgo. Asegúrate de confiar en los
  servidores MCP, y ten especial cuidado al usar servidores MCP que se comunican con
  internet, ya que estos pueden exponerte a riesgos de inyección de prompts.
</Warning>

## Configurar servidores MCP

<Steps>
  <Step title="Añadir un Servidor MCP stdio">
    ```bash
    # Sintaxis básica
    claude mcp add <nombre> <comando> [args...]

    # Ejemplo: Añadiendo un servidor local
    claude mcp add mi-servidor -e API_KEY=123 -- /ruta/al/servidor arg1 arg2
    # Esto crea: comando="/ruta/al/servidor", args=["arg1", "arg2"]
    ```

  </Step>

  <Step title="Añadir un Servidor MCP SSE">
    ```bash
    # Sintaxis básica
    claude mcp add --transport sse <nombre> <url>

    # Ejemplo: Añadiendo un servidor SSE
    claude mcp add --transport sse servidor-sse https://ejemplo.com/endpoint-sse

    # Ejemplo: Añadiendo un servidor SSE con cabeceras personalizadas
    claude mcp add --transport sse servidor-api https://api.ejemplo.com/mcp --header "X-API-Key: tu-clave"
    ```

  </Step>

  <Step title="Añadir un Servidor MCP HTTP">
    ```bash
    # Sintaxis básica
    claude mcp add --transport http <nombre> <url>

    # Ejemplo: Añadiendo un servidor HTTP streamable
    claude mcp add --transport http servidor-http https://ejemplo.com/mcp

    # Ejemplo: Añadiendo un servidor HTTP con cabecera de autenticación
    claude mcp add --transport http servidor-seguro https://api.ejemplo.com/mcp --header "Authorization: Bearer tu-token"
    ```

  </Step>

  <Step title="Gestionar tus servidores MCP">
    ```bash
    # Listar todos los servidores configurados
    claude mcp list

    # Obtener detalles de un servidor específico
    claude mcp get mi-servidor

    # Eliminar un servidor
    claude mcp remove mi-servidor
    ```

  </Step>
</Steps>

<Tip>
  Consejos:

- Usa la bandera `-s` o `--scope` para especificar dónde se almacena la configuración:
  - `local` (por defecto): Disponible solo para ti en el proyecto actual (se llamaba `project` en versiones anteriores).
  - `project`: Compartido con todos en el proyecto a través del archivo `.mcp.json`.
  - `user`: Disponible para ti en todos los proyectos (se llamaba `global` en versiones anteriores).
- Establece variables de entorno con las banderas `-e` o `--env` (p. ej., `-e CLAVE=valor`).
- Configura el tiempo de espera de inicio del servidor MCP usando la variable de entorno MCP_TIMEOUT (p. ej., `MCP_TIMEOUT=10000 claude` establece un tiempo de espera de 10 segundos).
- Comprueba el estado del servidor MCP en cualquier momento usando el comando `/mcp` dentro de Claude Code.
- MCP sigue una arquitectura cliente-servidor donde Claude Code (el cliente) puede conectarse a múltiples servidores especializados.
- Claude Code admite servidores SSE (Server-Sent Events) y HTTP streamable para comunicación en tiempo real.
- Usa `/mcp` para autenticarte con servidores remotos que requieren autenticación OAuth 2.0.
  </Tip>

<Warning>
  **Usuarios de Windows**: En Windows nativo (no WSL), los servidores MCP locales que usan `npx` requieren el envoltorio `cmd /c` para asegurar una ejecución correcta.

```bash
# Esto crea el comando="cmd" que Windows puede ejecutar
claude mcp add mi-servidor -- cmd /c npx -y @algun/paquete
```

Sin el envoltorio `cmd /c`, encontrarás errores de "Conexión cerrada" porque Windows no puede ejecutar `npx` directamente.
</Warning>

## Entendiendo los ámbitos de los servidores MCP

Los servidores MCP pueden configurarse en tres niveles de ámbito diferentes, cada uno con propósitos distintos para gestionar la accesibilidad y el uso compartido de los servidores. Entender estos ámbitos te ayuda a determinar la mejor manera de configurar los servidores para tus necesidades específicas.

### Jerarquía y precedencia de ámbitos

Las configuraciones de los servidores MCP siguen una clara jerarquía de precedencia. Cuando existen servidores con el mismo nombre en múltiples ámbitos, el sistema resuelve los conflictos priorizando primero los servidores de ámbito local, seguidos por los de ámbito de proyecto y, finalmente, los de ámbito de usuario. Este diseño asegura que las configuraciones personales puedan anular las compartidas cuando sea necesario.

### Ámbito local

Los servidores de ámbito local representan el nivel de configuración por defecto y se almacenan en la configuración de usuario específica de tu proyecto. Estos servidores permanecen privados para ti y solo son accesibles cuando trabajas dentro del directorio del proyecto actual. Este ámbito es ideal para servidores de desarrollo personales, configuraciones experimentales o servidores que contienen credenciales sensibles que no deben compartirse.

```bash
# Añadir un servidor de ámbito local (por defecto)
claude mcp add mi-servidor-privado /ruta/al/servidor

# Especificar explícitamente el ámbito local
claude mcp add mi-servidor-privado -s local /ruta/al/servidor
```

### Ámbito de proyecto

Los servidores de ámbito de proyecto permiten la colaboración en equipo al almacenar las configuraciones en un archivo `.mcp.json` en el directorio raíz de tu proyecto. Este archivo está diseñado para ser versionado, asegurando que todos los miembros del equipo tengan acceso a las mismas herramientas y servicios MCP. Cuando añades un servidor de ámbito de proyecto, Claude Code crea o actualiza automáticamente este archivo con la estructura de configuración apropiada.

```bash
# Añadir un servidor de ámbito de proyecto
claude mcp add servidor-compartido -s project /ruta/al/servidor
```

El archivo `.mcp.json` resultante sigue un formato estandarizado:

```json
{
  "mcpServers": {
    "servidor-compartido": {
      "command": "/ruta/al/servidor",
      "args": [],
      "env": {}
    }
  }
}
```

Por razones de seguridad, Claude Code solicita aprobación antes de usar servidores de ámbito de proyecto de los archivos `.mcp.json`. Si necesitas restablecer estas elecciones de aprobación, usa el comando `claude mcp reset-project-choices`.

### Ámbito de usuario

Los servidores de ámbito de usuario proporcionan accesibilidad entre proyectos, haciéndolos disponibles en todos los proyectos de tu máquina mientras permanecen privados para tu cuenta de usuario. Este ámbito funciona bien para servidores de utilidad personal, herramientas de desarrollo o servicios que usas frecuentemente en diferentes proyectos.

```bash
# Añadir un servidor de usuario
claude mcp add mi-servidor-de-usuario -s user /ruta/al/servidor
```

### Eligiendo el ámbito correcto

Selecciona tu ámbito basándote en:

- **Ámbito local**: Servidores personales, configuraciones experimentales o credenciales sensibles específicas de un proyecto.
- **Ámbito de proyecto**: Servidores compartidos por el equipo, herramientas específicas del proyecto o servicios requeridos para la colaboración.
- **Ámbito de usuario**: Utilidades personales necesarias en múltiples proyectos, herramientas de desarrollo o servicios de uso frecuente.

### Expansión de variables de entorno en `.mcp.json`

Claude Code admite la expansión de variables de entorno en los archivos `.mcp.json`, permitiendo a los equipos compartir configuraciones manteniendo la flexibilidad para rutas específicas de la máquina y valores sensibles como las claves de API.

**Sintaxis admitida:**

- `${VAR}` - Se expande al valor de la variable de entorno `VAR`.
- `${VAR:-default}` - Se expande a `VAR` si está definida, de lo contrario usa `default`.

**Ubicaciones de expansión:**
Las variables de entorno pueden expandirse en:

- `command` - La ruta del ejecutable del servidor.
- `args` - Argumentos de la línea de comandos.
- `env` - Variables de entorno pasadas al servidor.
- `url` - Para tipos de servidor SSE/HTTP.
- `headers` - Para la autenticación de servidores SSE/HTTP.

**Ejemplo con expansión de variables:**

```json
{
  "mcpServers": {
    "servidor-api": {
      "type": "sse",
      "url": "${API_BASE_URL:-https://api.ejemplo.com}/mcp",
      "headers": {
        "Authorization": "Bearer ${API_KEY}"
      }
    }
  }
}
```

Si una variable de entorno requerida no está definida y no tiene un valor por defecto, Claude Code fallará al analizar la configuración.

## Autenticarse con servidores MCP remotos

Muchos servidores MCP remotos requieren autenticación. Claude Code admite el flujo de autenticación OAuth 2.0 para una conexión segura a estos servidores.

<Steps>
  <Step title="Añadir un servidor remoto que requiere autenticación">
    ```bash
    # Añadir un servidor SSE o HTTP que requiere OAuth
    claude mcp add --transport sse servidor-github https://api.github.com/mcp
    ```
  </Step>

  <Step title="Autenticarse usando el comando /mcp">
    Dentro de Claude Code, usa el comando `/mcp` para gestionar la autenticación:

    ```
    > /mcp
    ```

    Esto abre un menú interactivo donde puedes:

    * Ver el estado de la conexión de todos los servidores.
    * Autenticarte con servidores que requieren OAuth.
    * Limpiar la autenticación existente.
    * Ver las capacidades del servidor.

  </Step>

  <Step title="Completar el flujo de OAuth">
    Cuando seleccionas "Autenticar" para un servidor:

    1. Tu navegador se abre automáticamente en el proveedor de OAuth.
    2. Completa la autenticación en tu navegador.
    3. Claude Code recibe y almacena de forma segura el token de acceso.
    4. La conexión del servidor se activa.

  </Step>
</Steps>

<Tip>
  Consejos:

- Los tokens de autenticación se almacenan de forma segura y se actualizan automáticamente.
- Usa "Limpiar autenticación" en el menú `/mcp` para revocar el acceso.
- Si tu navegador no se abre automáticamente, copia la URL proporcionada.
- La autenticación OAuth funciona con los transportes SSE y HTTP.
  </Tip>

## Conectarse a un servidor MCP de Postgres

Supongamos que quieres dar a Claude acceso de solo lectura a una base de datos PostgreSQL para consultar e inspeccionar el esquema.

<Steps>
  <Step title="Añadir el servidor MCP de Postgres">
    ```bash
    claude mcp add servidor-postgres /ruta/al/servidor-mcp-postgres --connection-string "postgresql://usuario:contraseña@localhost:5432/mibd"
    ```
  </Step>

  <Step title="Consultar tu base de datos con Claude">
    ```
    > describe el esquema de nuestra tabla de usuarios
    ```

    ```
    > ¿cuáles son los pedidos más recientes en el sistema?
    ```

    ```
    > muéstrame la relación entre clientes y facturas
    ```

  </Step>
</Steps>

<Tip>
  Consejos:

- El servidor MCP de Postgres proporciona acceso de solo lectura por seguridad.
- Claude puede ayudarte a explorar la estructura de la base de datos y ejecutar consultas analíticas.
- Puedes usar esto para entender rápidamente los esquemas de bases de datos en proyectos desconocidos.
- Asegúrate de que tu cadena de conexión use las credenciales apropiadas con los permisos mínimos requeridos.
  </Tip>

## Añadir servidores MCP desde una configuración JSON

Supongamos que tienes una configuración JSON para un único servidor MCP que quieres añadir a Claude Code.

<Steps>
  <Step title="Añadir un servidor MCP desde JSON">
    ```bash
    # Sintaxis básica
    claude mcp add-json <nombre> '<json>'

    # Ejemplo: Añadiendo un servidor stdio con configuración JSON
    claude mcp add-json api-tiempo '{"type":"stdio","command":"/ruta/a/weather-cli","args":["--api-key","abc123"],"env":{"CACHE_DIR":"/tmp"}}'
    ```

  </Step>

  <Step title="Verificar que el servidor fue añadido">
    ```bash
    claude mcp get api-tiempo
    ```
  </Step>
</Steps>

<Tip>
  Consejos:

- Asegúrate de que el JSON esté correctamente escapado en tu shell.
- El JSON debe cumplir con el esquema de configuración del servidor MCP.
- Puedes usar `-s global` para añadir el servidor a tu configuración global en lugar de la específica del proyecto.
  </Tip>

## Importar servidores MCP desde Claude Desktop

Supongamos que ya has configurado servidores MCP en Claude Desktop y quieres usar los mismos servidores en Claude Code sin reconfigurarlos manualmente.

<Steps>
  <Step title="Importar servidores desde Claude Desktop">
    ```bash
    # Sintaxis básica
    claude mcp add-from-claude-desktop
    ```
  </Step>

  <Step title="Seleccionar qué servidores importar">
    Después de ejecutar el comando, verás un diálogo interactivo que te permite seleccionar qué servidores quieres importar.
  </Step>

  <Step title="Verificar que los servidores fueron importados">
    ```bash
    claude mcp list
    ```
  </Step>
</Steps>

<Tip>
  Consejos:

- Esta característica solo funciona en macOS y Windows Subsystem for Linux (WSL).
- Lee el archivo de configuración de Claude Desktop desde su ubicación estándar en esas plataformas.
- Usa la bandera `-s global` para añadir servidores a tu configuración global.
- Los servidores importados tendrán los mismos nombres que en Claude Desktop.
- Si ya existen servidores con los mismos nombres, obtendrán un sufijo numérico (p. ej., `servidor_1`).
  </Tip>

## Usar Claude Code como un servidor MCP

Supongamos que quieres usar Claude Code como un servidor MCP al que otras aplicaciones puedan conectarse, proporcionándoles las herramientas y capacidades de Claude.

<Steps>
  <Step title="Iniciar Claude como un servidor MCP">
    ```bash
    # Sintaxis básica
    claude mcp serve
    ```
  </Step>

  <Step title="Conectarse desde otra aplicación">
    Puedes conectarte al servidor MCP de Claude Code desde cualquier cliente MCP, como Claude Desktop. Si estás usando Claude Desktop, puedes añadir el servidor MCP de Claude Code usando esta configuración:

    ```json
    {
      "command": "claude",
      "args": ["mcp", "serve"],
      "env": {}
    }
    ```

  </Step>
</Steps>

<Tip>
  Consejos:

- El servidor proporciona acceso a las herramientas de Claude como Ver, Editar, LS, etc.
- En Claude Desktop, intenta pedirle a Claude que lea archivos en un directorio, haga ediciones y más.
- Ten en cuenta que este servidor MCP simplemente expone las herramientas de Claude Code a tu cliente MCP, por lo que tu propio cliente es responsable de implementar la confirmación del usuario para las llamadas a herramientas individuales.
  </Tip>

## Usar recursos MCP

Los servidores MCP pueden exponer recursos a los que puedes hacer referencia usando menciones @, de forma similar a como haces referencia a los archivos.

### Referenciar recursos MCP

<Steps>
  <Step title="Listar recursos disponibles">
    Escribe `@` en tu prompt para ver los recursos disponibles de todos los servidores MCP conectados. Los recursos aparecen junto a los archivos en el menú de autocompletar.
  </Step>

  <Step title="Referenciar un recurso específico">
    Usa el formato `@servidor:protocolo://recurso/ruta` para referenciar un recurso:

    ```
    > ¿Puedes analizar @github:issue://123 y sugerir una solución?
    ```

    ```
    > Por favor, revisa la documentación de la API en @docs:file://api/authentication
    ```

  </Step>

  <Step title="Múltiples referencias de recursos">
    Puedes referenciar múltiples recursos en un solo prompt:

    ```
    > Compara @postgres:schema://users con @docs:file://database/user-model
    ```

  </Step>
</Steps>

<Tip>
  Consejos:

- Los recursos se obtienen automáticamente y se incluyen como adjuntos cuando se referencian.
- Las rutas de los recursos se pueden buscar de forma difusa en el autocompletado de menciones @.
- Claude Code proporciona automáticamente herramientas para listar y leer recursos MCP cuando los servidores las admiten.
- Los recursos pueden contener cualquier tipo de contenido que el servidor MCP proporcione (texto, JSON, datos estructurados, etc.).
  </Tip>

## Usar prompts de MCP como comandos de barra diagonal

Los servidores MCP pueden exponer prompts que se convierten en comandos de barra diagonal disponibles en Claude Code.

### Ejecutar prompts de MCP

<Steps>
  <Step title="Descubrir prompts disponibles">
    Escribe `/` para ver todos los comandos disponibles, incluidos los de los servidores MCP. Los prompts de MCP aparecen con el formato `/mcp__nombreservidor__nombreprompt`.
  </Step>

  <Step title="Ejecutar un prompt sin argumentos">
    ```
    > /mcp__github__list_prs
    ```
  </Step>

  <Step title="Ejecutar un prompt con argumentos">
    Muchos prompts aceptan argumentos. Pásalos separados por espacios después del comando:

    ```
    > /mcp__github__pr_review 456
    ```

    ```
    > /mcp__jira__create_issue "Error en el flujo de inicio de sesión" alta
    ```

  </Step>
</Steps>

<Tip>
  Consejos:

- Los prompts de MCP se descubren dinámicamente desde los servidores conectados.
- Los argumentos se analizan en función de los parámetros definidos por el prompt.
- Los resultados del prompt se inyectan directamente en la conversación.
- Los nombres de los servidores y los prompts se normalizan (los espacios se convierten en guiones bajos).
  </Tip>