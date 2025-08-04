# Resumen de Claude Code

> Aprende sobre Claude Code, la herramienta de codificación agéntica de Anthropic que vive en tu terminal y te ayuda a convertir ideas en código más rápido que nunca.

## Empieza en 30 segundos

Requisitos previos: [Node.js 18 o más reciente](https://nodejs.org/en/download/)

```bash
# Instala Claude Code
npm install -g @anthropic-ai/claude-code

# Navega a tu proyecto
cd tu-increible-proyecto

# Empieza a codificar con Claude
claude
```

¡Eso es todo! Estás listo para empezar a codificar con Claude. [Continuar con el Inicio Rápido (5 mins) →](/en/docs/claude-code/quickstart)

(¿Tienes necesidades de configuración específicas o encontraste problemas? Consulta la [configuración avanzada](/en/docs/claude-code/setup) o la [solución de problemas](/en/docs/claude-code/troubleshooting).)

## Lo que Claude Code hace por ti

- **Construye funcionalidades a partir de descripciones**: Dile a Claude lo que quieres construir en lenguaje natural. Hará un plan, escribirá el código y se asegurará de que funcione.
- **Depura y corrige problemas**: Describe un error o pega un mensaje de error. Claude Code analizará tu base de código, identificará el problema e implementará una solución.
- **Navega por cualquier base de código**: Pregunta cualquier cosa sobre la base de código de tu equipo y obtén una respuesta bien pensada. Claude Code mantiene conocimiento de toda la estructura de tu proyecto, puede encontrar información actualizada de la web y, con [MCP](/en/docs/claude-code/mcp), puede obtener datos de fuentes externas como Google Drive, Figma y Slack.
- **Automatiza tareas tediosas**: Corrige problemas de linting quisquillosos, resuelve conflictos de fusión y escribe notas de lanzamiento. Haz todo esto con un solo comando desde tus máquinas de desarrollo, o automáticamente en CI.

## Por qué los desarrolladores aman Claude Code

- **Funciona en tu terminal**: No es otra ventana de chat. No es otro IDE. Claude Code te encuentra donde ya trabajas, con las herramientas que ya amas.
- **Toma acción**: Claude Code puede editar archivos directamente, ejecutar comandos y crear commits. ¿Necesitas más? [MCP](/en/docs/claude-code/mcp) permite a Claude leer tus documentos de diseño en Google Drive, actualizar tus tickets en Jira o usar _tus_ herramientas de desarrollo personalizadas.
- **Filosofía Unix**: Claude Code es componible y programable. `tail -f app.log | claude -p "Avísame por Slack si aparecen anomalías en este flujo de registro"` _funciona_. Tu CI puede ejecutar `claude -p "Si hay nuevas cadenas de texto, tradúcelas al francés y crea un PR para que @lang-fr-team lo revise"`.
- **Listo para la empresa**: Usa la API de Anthropic, o alójalo en AWS o GCP. La [seguridad](/en/docs/claude-code/security), [privacidad](/en/docs/claude-code/data-usage) y [cumplimiento](https://trust.anthropic.com/) de grado empresarial están incorporados.

## Próximos pasos

<CardGroup>
  <Card title="Inicio Rápido" icon="rocket" href="/en/docs/claude-code/quickstart">
    Ve a Claude Code en acción con ejemplos prácticos
  </Card>

  <Card title="Flujos de trabajo comunes" icon="graduation-cap" href="/en/docs/claude-code/common-workflows">
    Guías paso a paso para flujos de trabajo comunes
  </Card>

  <Card title="Solución de problemas" icon="wrench" href="/en/docs/claude-code/troubleshooting">
    Soluciones para problemas comunes con Claude Code
  </Card>

  <Card title="Configuración del IDE" icon="laptop" href="/en/docs/claude-code/ide-integrations">
    Añade Claude Code a tu IDE
  </Card>
</CardGroup>

## Recursos adicionales

<CardGroup>
  <Card title="Alojar en AWS o GCP" icon="cloud" href="/en/docs/claude-code/third-party-integrations">
    Configura Claude Code con Amazon Bedrock o Google Vertex AI
  </Card>

  <Card title="Configuración" icon="gear" href="/en/docs/claude-code/settings">
    Personaliza Claude Code para tu flujo de trabajo
  </Card>

  <Card title="Comandos" icon="terminal" href="/en/docs/claude-code/cli-reference">
    Aprende sobre los comandos y controles de la CLI
  </Card>

  <Card title="Implementación de referencia" icon="code" href="https://github.com/anthropics/claude-code/tree/main/.devcontainer">
    Clona nuestra implementación de referencia del contenedor de desarrollo
  </Card>

  <Card title="Seguridad" icon="shield" href="/en/docs/claude-code/security">
    Descubre las salvaguardas y mejores prácticas de Claude Code para un uso seguro
  </Card>

  <Card title="Privacidad y uso de datos" icon="lock" href="/en/docs/claude-code/data-usage">
    Entiende cómo Claude Code maneja tus datos
  </Card>
</CardGroup>

# Inicio Rápido

# Inicio Rápido

> ¡Bienvenido a Claude Code!

Esta guía de inicio rápido te permitirá usar la asistencia de codificación impulsada por IA en solo unos minutos. Al final, entenderás cómo usar Claude Code para tareas de desarrollo comunes.

## Antes de empezar

Asegúrate de tener:

- Un terminal o símbolo del sistema abierto
- Un proyecto de código con el que trabajar

## Paso 1: Instala Claude Code

### Instalación con NPM

Si tienes [Node.js 18 o más reciente instalado](https://nodejs.org/en/download/):

```sh
npm install -g @anthropic-ai/claude-code
```

### Instalación Nativa

<Tip>
  Alternativamente, prueba nuestra nueva instalación nativa, ahora en beta.
</Tip>

**macOS, Linux, WSL:**

```bash
curl -fsSL claude.ai/install.sh | bash
```

**Windows PowerShell:**

```powershell
irm https://claude.ai/install.ps1 | iex
```

## Paso 2: Inicia tu primera sesión

Abre tu terminal en cualquier directorio de proyecto e inicia Claude Code:

```bash
cd /ruta/a/tu/proyecto
claude
```

Verás el prompt de Claude Code dentro de una nueva sesión interactiva:

```
✻ ¡Bienvenido a Claude Code!

...

> Prueba "crea una utilidad logging.py que..."
```

<Tip>
  Tus credenciales se almacenan de forma segura en tu sistema. Aprende más en [Gestión de Credenciales](/en/docs/claude-code/iam#credential-management).
</Tip>

## Paso 3: Haz tu primera pregunta

Empecemos por entender tu base de código. Prueba uno de estos comandos:

```
> ¿qué hace este proyecto?
```

Claude analizará tus archivos y te proporcionará un resumen. También puedes hacer preguntas más específicas:

```
> ¿qué tecnologías usa este proyecto?
```

```
> ¿dónde está el punto de entrada principal?
```

```
> explica la estructura de carpetas
```

También puedes preguntarle a Claude sobre sus propias capacidades:

```
> ¿qué puede hacer Claude Code?
```

```
> ¿cómo uso los comandos de barra diagonal en Claude Code?
```

```
> ¿puede Claude Code trabajar con Docker?
```

<Note>
  Claude Code lee tus archivos según sea necesario - no tienes que añadir contexto manualmente. Claude también tiene acceso a su propia documentación y puede responder preguntas sobre sus características y capacidades.
</Note>

## Paso 4: Haz tu primer cambio en el código

Ahora hagamos que Claude Code haga algo de codificación real. Prueba una tarea simple:

```
> añade una función de hola mundo al archivo principal
```

Claude Code hará lo siguiente:

1. Encontrar el archivo apropiado
2. Mostrarte los cambios propuestos
3. Pedir tu aprobación
4. Realizar la edición

<Note>
  Claude Code siempre pide permiso antes de modificar archivos. Puedes aprobar cambios individuales o habilitar el modo "Aceptar todo" para una sesión.
</Note>

## Paso 5: Usa Git con Claude Code

Claude Code hace que las operaciones de Git sean conversacionales:

```
> ¿qué archivos he cambiado?
```

```
> haz commit de mis cambios con un mensaje descriptivo
```

También puedes pedir operaciones de Git más complejas:

```
> crea una nueva rama llamada feature/quickstart
```

```
> muéstrame los últimos 5 commits
```

```
> ayúdame a resolver conflictos de fusión
```

## Paso 6: Corrige un error o añade una funcionalidad

Claude es competente en la depuración y la implementación de funcionalidades.

Describe lo que quieres en lenguaje natural:

```
> añade validación de entrada al formulario de registro de usuarios
```

O corrige problemas existentes:

```
> hay un error donde los usuarios pueden enviar formularios vacíos - arréglalo
```

Claude Code hará lo siguiente:

- Localizar el código relevante
- Entender el contexto
- Implementar una solución
- Ejecutar pruebas si están disponibles

## Paso 7: Prueba otros flujos de trabajo comunes

Hay varias formas de trabajar con Claude:

**Refactorizar código**

```
> refactoriza el módulo de autenticación para usar async/await en lugar de callbacks
```

**Escribir pruebas**

```
> escribe pruebas unitarias para las funciones de la calculadora
```

**Actualizar documentación**

```
> actualiza el README con instrucciones de instalación
```

**Revisión de código**

```
> revisa mis cambios y sugiere mejoras
```

<Tip>
  **Recuerda**: Claude Code es tu programador de pares de IA. Háblale como lo harías con un colega servicial - describe lo que quieres lograr, y te ayudará a conseguirlo.
</Tip>

## Comandos esenciales

Aquí están los comandos más importantes para el uso diario:

| Comando | Qué hace | Ejemplo |
| --- | --- | --- |
| `claude` | Iniciar modo interactivo | `claude` |
| `claude "tarea"` | Ejecutar una tarea única | `claude "arregla el error de compilación"` |
| `claude -p "consulta"` | Ejecutar una consulta única, luego salir | `claude -p "explica esta función"` |
| `claude -c` | Continuar la conversación más reciente | `claude -c` |
| `claude -r` | Reanudar una conversación anterior | `claude -r` |
| `claude commit` | Crear un commit de Git | `claude commit` |
| `/clear` | Limpiar el historial de la conversación | `> /clear` |
| `/help` | Mostrar comandos disponibles | `> /help` |
| `exit` o Ctrl+C | Salir de Claude Code | `> exit` |

Consulta la [referencia de la CLI](/en/docs/claude-code/cli-reference) para una lista completa de comandos.

## Consejos profesionales para principiantes

<AccordionGroup>
  <Accordion title="Sé específico con tus solicitudes">
    En lugar de: "arregla el error"

    Prueba: "arregla el error de inicio de sesión donde los usuarios ven una pantalla en blanco después de introducir credenciales incorrectas"

  </Accordion>

  <Accordion title="Usa instrucciones paso a paso">
    Desglosa las tareas complejas en pasos:

    ```
    > 1. crea una nueva tabla de base de datos para los perfiles de usuario
    ```

    ```
    > 2. crea un endpoint de API para obtener y actualizar los perfiles de usuario
    ```

    ```
    > 3. construye una página web que permita a los usuarios ver y editar su información
    ```

  </Accordion>

  <Accordion title="Deja que Claude explore primero">
    Antes de hacer cambios, deja que Claude entienda tu código:

    ```
    > analiza el esquema de la base de datos
    ```

    ```
    > construye un panel que muestre los productos que son devueltos con más frecuencia por nuestros clientes del Reino Unido
    ```

  </Accordion>

  <Accordion title="Ahorra tiempo con atajos">
    * Usa Tab para completar comandos
    * Presiona ↑ para el historial de comandos
    * Escribe `/` para ver todos los comandos de barra diagonal
  </Accordion>
</AccordionGroup>

## ¿Qué sigue?

Ahora que has aprendido lo básico, explora características más avanzadas:

<CardGroup cols={3}>
  <Card title="Flujos de trabajo comunes" icon="graduation-cap" href="/en/docs/claude-code/common-workflows">
    Guías paso a paso para tareas comunes
  </Card>

  <Card title="Referencia de la CLI" icon="terminal" href="/en/docs/claude-code/cli-reference">
    Domina todos los comandos y opciones
  </Card>

  <Card title="Configuración" icon="gear" href="/en/docs/claude-code/settings">
    Personaliza Claude Code para tu flujo de trabajo
  </Card>
</CardGroup>

## Obtener ayuda

- **En Claude Code**: Escribe `/help` o pregunta "cómo hago para..."
- **Documentación**: ¡Estás aquí! Explora otras guías
- **Comunidad**: Únete a nuestro [Discord](https://www.anthropic.com/discord) para consejos y soporte