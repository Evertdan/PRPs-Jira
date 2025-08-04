# Acciones de GitHub de Claude Code

> Aprende a integrar Claude Code en tu flujo de trabajo de desarrollo con las Acciones de GitHub de Claude Code.

Las Acciones de GitHub de Claude Code llevan la automatización impulsada por IA a tu flujo de trabajo de GitHub. Con una simple mención de `@claude` en cualquier PR o issue, Claude puede analizar tu código, crear pull requests, implementar funcionalidades y corregir errores, todo mientras sigue los estándares de tu proyecto.

<Info>
  Las Acciones de GitHub de Claude Code están actualmente en beta. Las características y funcionalidades pueden evolucionar a medida que refinamos la experiencia.
</Info>

<Note>
  Las Acciones de GitHub de Claude Code se basan en el [SDK de Claude Code](/en/docs/claude-code/sdk), que permite la integración programática de Claude Code en tus aplicaciones. Puedes usar el SDK para construir flujos de trabajo de automatización personalizados más allá de las Acciones de GitHub.
</Note>

## ¿Por qué usar las Acciones de GitHub de Claude Code?

- **Creación instantánea de PR**: Describe lo que necesitas y Claude crea un PR completo con todos los cambios necesarios.
- **Implementación de código automatizada**: Convierte issues en código funcional con un solo comando.
- **Sigue tus estándares**: Claude respeta tus directrices de `CLAUDE.md` y los patrones de código existentes.
- **Configuración sencilla**: Empieza en minutos con nuestro instalador y clave de API.
- **Seguro por defecto**: Tu código permanece en los ejecutores (runners) de GitHub.

## ¿Qué puede hacer Claude?

Claude Code proporciona potentes Acciones de GitHub que transforman tu forma de trabajar con el código:

### Acción de Claude Code

Esta Acción de GitHub te permite ejecutar Claude Code dentro de tus flujos de trabajo de Acciones de GitHub. Puedes usar esto para construir cualquier flujo de trabajo personalizado sobre Claude Code.

[Ver repositorio →](https://github.com/anthropics/claude-code-action)

### Acción de Claude Code (Base)

La base para construir flujos de trabajo de GitHub personalizados con Claude. Este marco extensible te da acceso completo a las capacidades de Claude para crear automatización a medida.

[Ver repositorio →](https://github.com/anthropics/claude-code-base-action)

## Configuración

## Configuración rápida

La forma más fácil de configurar esta acción es a través de Claude Code en el terminal. Simplemente abre claude y ejecuta `/install-github-app`.

Este comando te guiará a través de la configuración de la aplicación de GitHub y los secretos requeridos.

<Note>
  * Debes ser administrador del repositorio para instalar la aplicación de GitHub y añadir secretos.
  * Este método de inicio rápido solo está disponible para usuarios directos de la API de Anthropic. Si estás usando AWS Bedrock o Google Vertex AI, consulta la sección [Uso con AWS Bedrock y Google Vertex AI](#using-with-aws-bedrock-%26-google-vertex-ai).
</Note>

## Configuración manual

Si el comando `/install-github-app` falla o prefieres la configuración manual, sigue estas instrucciones de configuración manual:

1. **Instala la aplicación de GitHub de Claude** en tu repositorio: [https://github.com/apps/claude](https://github.com/apps/claude)
2. **Añade ANTHROPIC_API_KEY** a los secretos de tu repositorio ([Aprende a usar secretos en las Acciones de GitHub](https://docs.github.com/en/actions/security-guides/using-secrets-in-github-actions))
3. **Copia el archivo de flujo de trabajo** de [examples/claude.yml](https://github.com/anthropics/claude-code-action/blob/main/examples/claude.yml) en el directorio `.github/workflows/` de tu repositorio.

<Tip>
  Después de completar la configuración rápida o manual, ¡prueba la acción etiquetando a `@claude` en un comentario de un issue o PR!
</Tip>

## Casos de uso de ejemplo

Las Acciones de GitHub de Claude Code pueden ayudarte con una variedad de tareas. Para ver ejemplos funcionales completos, consulta el [directorio de ejemplos](https://github.com/anthropics/claude-code-action/tree/main/examples).

### Convertir issues en PRs

En un comentario de un issue:

```
@claude implementa esta funcionalidad basada en la descripción del issue
```

Claude analizará el issue, escribirá el código y creará un PR para su revisión.

### Obtener ayuda con la implementación

En un comentario de un PR:

```
@claude ¿cómo debería implementar la autenticación de usuario para este endpoint?
```

Claude analizará tu código y te proporcionará una guía de implementación específica.

### Corregir errores rápidamente

En un issue:

```yaml
@claude corrige el TypeError en el componente del panel de usuario
```

Claude localizará el error, implementará una solución y creará un PR.

## Mejores prácticas

### Configuración de CLAUDE.md

Crea un archivo `CLAUDE.md` en la raíz de tu repositorio para definir directrices de estilo de código, criterios de revisión, reglas específicas del proyecto y patrones preferidos. Este archivo guía la comprensión de Claude sobre los estándares de tu proyecto.

### Consideraciones de seguridad

<Warning>
  ¡Nunca hagas commit de claves de API directamente en tu repositorio!
</Warning>

Usa siempre los Secretos de GitHub para las claves de API:

- Añade tu clave de API como un secreto del repositorio llamado `ANTHROPIC_API_KEY`.
- Haz referencia a ella en los flujos de trabajo: `anthropic_api_key: ${{ secrets.ANTHROPIC_API_KEY }}`.
- Limita los permisos de las acciones solo a lo necesario.
- Revisa las sugerencias de Claude antes de fusionar.

Usa siempre los Secretos de GitHub (p. ej., `${{ secrets.ANTHROPIC_API_KEY }}`) en lugar de codificar las claves de API directamente en tus archivos de flujo de trabajo.

### Optimización del rendimiento

Usa plantillas de issues para proporcionar contexto, mantén tu `CLAUDE.md` conciso y enfocado, y configura tiempos de espera apropiados para tus flujos de trabajo.

### Costos de CI

Al usar las Acciones de GitHub de Claude Code, ten en cuenta los costos asociados:

**Costos de las Acciones de GitHub:**

- Claude Code se ejecuta en ejecutores (runners) alojados en GitHub, que consumen tus minutos de Acciones de GitHub.
- Consulta la [documentación de facturación de GitHub](https://docs.github.com/en/billing/managing-billing-for-your-products/managing-billing-for-github-actions/about-billing-for-github-actions) para precios detallados y límites de minutos.

**Costos de la API:**

- Cada interacción de Claude consume tokens de API según la longitud de los prompts y las respuestas.
- El uso de tokens varía según la complejidad de la tarea y el tamaño de la base de código.
- Consulta la [página de precios de Claude](https://www.anthropic.com/api) para las tarifas actuales de los tokens.

**Consejos para la optimización de costos:**

- Usa comandos `@claude` específicos para reducir las llamadas innecesarias a la API.
- Configura límites `max_turns` apropiados para evitar iteraciones excesivas.
- Establece `timeout_minutes` razonables para evitar flujos de trabajo descontrolados.
- Considera usar los controles de concurrencia de GitHub para limitar las ejecuciones paralelas.

## Ejemplos de configuración

Para configuraciones de flujo de trabajo listas para usar para diferentes casos de uso, incluyendo:

- Configuración básica de flujo de trabajo para comentarios de issues y PRs.
- Revisiones de código automatizadas en pull requests.
- Implementaciones personalizadas para necesidades específicas.

Visita el [directorio de ejemplos](https://github.com/anthropics/claude-code-action/tree/main/examples) en el repositorio de la Acción de Claude Code.

<Tip>
  El repositorio de ejemplos incluye flujos de trabajo completos y probados que puedes copiar directamente en tu directorio `.github/workflows/`.
</Tip>

## Uso con AWS Bedrock y Google Vertex AI

Para entornos empresariales, puedes usar las Acciones de GitHub de Claude Code con tu propia infraestructura en la nube. Este enfoque te da control sobre la residencia de los datos y la facturación, manteniendo la misma funcionalidad.

### Prerrequisitos

Antes de configurar las Acciones de GitHub de Claude Code con proveedores en la nube, necesitas:

#### Para Google Cloud Vertex AI:

1. Un Proyecto de Google Cloud con Vertex AI habilitado.
2. Federación de Identidad de Carga de Trabajo configurada para las Acciones de GitHub.
3. Una cuenta de servicio con los permisos requeridos.
4. Una Aplicación de GitHub (recomendado) o usar el GITHUB_TOKEN por defecto.

#### Para AWS Bedrock:

1. Una cuenta de AWS con Amazon Bedrock habilitado.
2. Proveedor de Identidad OIDC de GitHub configurado en AWS.
3. Un rol de IAM con permisos de Bedrock.
4. Una Aplicación de GitHub (recomendado) o usar el GITHUB_TOKEN por defecto.

<Steps>
  <Step title="Crear una Aplicación de GitHub personalizada (Recomendado para Proveedores 3P)">
    Para un mejor control y seguridad al usar proveedores 3P como Vertex AI o Bedrock, recomendamos crear tu propia Aplicación de GitHub:

    1. Ve a [https://github.com/settings/apps/new](https://github.com/settings/apps/new)
    2. Rellena la información básica:
       * **Nombre de la Aplicación de GitHub**: Elige un nombre único (p. ej., "Asistente Claude de TuOrg")
       * **URL de la página de inicio**: El sitio web de tu organización o la URL del repositorio.
    3. Configura los ajustes de la aplicación:
       * **Webhooks**: Desmarca "Activo" (no es necesario para esta integración).
    4. Establece los permisos requeridos:
       * **Permisos del repositorio**:
         * Contenidos: Lectura y Escritura
         * Issues: Lectura y Escritura
         * Pull requests: Lectura y Escritura
    5. Haz clic en "Crear Aplicación de GitHub".
    6. Después de la creación, haz clic en "Generar una clave privada" y guarda el archivo `.pem` descargado.
    7. Anota tu ID de Aplicación desde la página de configuración de la aplicación.
    8. Instala la aplicación en tu repositorio:
       * Desde la página de configuración de tu aplicación, haz clic en "Instalar Aplicación" en la barra lateral izquierda.
       * Selecciona tu cuenta u organización.
       * Elige "Solo repositorios seleccionados" y selecciona el repositorio específico.
       * Haz clic en "Instalar".
    9. Añade la clave privada como un secreto a tu repositorio:
       * Ve a la Configuración de tu repositorio → Secretos y variables → Acciones.
       * Crea un nuevo secreto llamado `APP_PRIVATE_KEY` con el contenido del archivo `.pem`.
    10. Añade el ID de la Aplicación como un secreto:

    * Crea un nuevo secreto llamado `APP_ID` con el ID de tu Aplicación de GitHub.

    <Note>
      Esta aplicación se usará con la acción [actions/create-github-app-token](https://github.com/actions/create-github-app-token) para generar tokens de autenticación en tus flujos de trabajo.
    </Note>

    **Alternativa para la API de Anthropic o si no quieres configurar tu propia aplicación de Github**: Usa la aplicación oficial de Anthropic:

    1. Instala desde: [https://github.com/apps/claude](https://github.com/apps/claude)
    2. No se necesita configuración adicional para la autenticación.

  </Step>

  <Step title="Configurar la autenticación del proveedor en la nube">
    Elige tu proveedor en la nube y configura una autenticación segura:

    <AccordionGroup>
      <Accordion title="AWS Bedrock">
        **Configura AWS para permitir que las Acciones de GitHub se autentiquen de forma segura sin almacenar credenciales.**

        > **Nota de Seguridad**: Usa configuraciones específicas del repositorio y concede solo los permisos mínimos requeridos.

        **Configuración Requerida**:

        1. **Habilitar Amazon Bedrock**:
           * Solicita acceso a los modelos de Claude en Amazon Bedrock.
           * Para modelos multirregionales, solicita acceso en todas las regiones requeridas.

        2. **Configurar el Proveedor de Identidad OIDC de GitHub**:
           * URL del proveedor: `https://token.actions.githubusercontent.com`
           * Audiencia: `sts.amazonaws.com`

        3. **Crear un Rol de IAM para las Acciones de GitHub**:
           * Tipo de entidad de confianza: Identidad web
           * Proveedor de identidad: `token.actions.githubusercontent.com`
           * Permisos: política `AmazonBedrockFullAccess`
           * Configura la política de confianza para tu repositorio específico.

        **Valores Requeridos**:

        Después de la configuración, necesitarás:

        * **AWS\_ROLE\_TO\_ASSUME**: El ARN del rol de IAM que creaste.

        <Tip>
          OIDC es más seguro que usar claves de acceso estáticas de AWS porque las credenciales son temporales y se rotan automáticamente.
        </Tip>

        Consulta la [documentación de AWS](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles_providers_create_oidc.html) para instrucciones detalladas de configuración de OIDC.
      </Accordion>

      <Accordion title="Google Vertex AI">
        **Configura Google Cloud para permitir que las Acciones de GitHub se autentiquen de forma segura sin almacenar credenciales.**

        > **Nota de Seguridad**: Usa configuraciones específicas del repositorio y concede solo los permisos mínimos requeridos.

        **Configuración Requerida**:

        1. **Habilitar APIs** en tu proyecto de Google Cloud:
           * API de Credenciales de IAM
           * API del Servicio de Tokens de Seguridad (STS)
           * API de Vertex AI

        2. **Crear recursos de Federación de Identidad de Carga de Trabajo**:
           * Crea un Grupo de Identidades de Carga de Trabajo.
           * Añade un proveedor OIDC de GitHub con:
             * Emisor: `https://token.actions.githubusercontent.com`
             * Mapeos de atributos para el repositorio y el propietario.
             * **Recomendación de seguridad**: Usa condiciones de atributos específicas del repositorio.

        3. **Crear una Cuenta de Servicio**:
           * Concede solo el rol de `Usuario de Vertex AI`.
           * **Recomendación de seguridad**: Crea una cuenta de servicio dedicada por repositorio.

        4. **Configurar enlaces de IAM**:
           * Permite que el Grupo de Identidades de Carga de Trabajo suplante a la cuenta de servicio.
           * **Recomendación de seguridad**: Usa conjuntos de principales específicos del repositorio.

        **Valores Requeridos**:

        Después de la configuración, necesitarás:

        * **GCP\_WORKLOAD\_IDENTITY\_PROVIDER**: El nombre completo del recurso del proveedor.
        * **GCP\_SERVICE\_ACCOUNT**: El correo electrónico de la cuenta de servicio.

        <Tip>
          La Federación de Identidad de Carga de Trabajo elimina la necesidad de claves de cuenta de servicio descargables, mejorando la seguridad.
        </Tip>

        Para instrucciones de configuración detalladas, consulta la [documentación de la Federación de Identidad de Carga de Trabajo de Google Cloud](https://cloud.google.com/iam/docs/workload-identity-federation).
      </Accordion>
    </AccordionGroup>

  </Step>

  <Step title="Añadir Secretos Requeridos">
    Añade los siguientes secretos a tu repositorio (Configuración → Secretos y variables → Acciones):

    #### Para la API de Anthropic (Directa):

    1. **Para la Autenticación de la API**:
       * `ANTHROPIC_API_KEY`: Tu clave de API de Anthropic de [console.anthropic.com](https://console.anthropic.com)

    2. **Para la Aplicación de GitHub (si usas tu propia aplicación)**:
       * `APP_ID`: El ID de tu Aplicación de GitHub.
       * `APP_PRIVATE_KEY`: El contenido de la clave privada (.pem).

    #### Para Google Cloud Vertex AI

    1. **Para la Autenticación de GCP**:
       * `GCP_WORKLOAD_IDENTITY_PROVIDER`
       * `GCP_SERVICE_ACCOUNT`

    2. **Para la Aplicación de GitHub (si usas tu propia aplicación)**:
       * `APP_ID`: El ID de tu Aplicación de GitHub.
       * `APP_PRIVATE_KEY`: El contenido de la clave privada (.pem).

    #### Para AWS Bedrock

    1. **Para la Autenticación de AWS**:
       * `AWS_ROLE_TO_ASSUME`

    2. **Para la Aplicación de GitHub (si usas tu propia aplicación)**:
       * `APP_ID`: El ID de tu Aplicación de GitHub.
       * `APP_PRIVATE_KEY`: El contenido de la clave privada (.pem).

  </Step>

  <Step title="Crear archivos de flujo de trabajo">
    Crea archivos de flujo de trabajo de Acciones de GitHub que se integren con tu proveedor en la nube. Los ejemplos a continuación muestran configuraciones completas tanto para AWS Bedrock como para Google Vertex AI:

    <AccordionGroup>
      <Accordion title="Flujo de trabajo de AWS Bedrock">
        **Prerrequisitos:**

        * Acceso a AWS Bedrock habilitado con permisos para el modelo de Claude.
        * GitHub configurado como un proveedor de identidad OIDC en AWS.
        * Rol de IAM con permisos de Bedrock que confía en las Acciones de GitHub.

        **Secretos de GitHub requeridos:**

        | Nombre del Secreto | Descripción |
        | --- | --- |
        | `AWS_ROLE_TO_ASSUME` | ARN del rol de IAM para el acceso a Bedrock |
        | `APP_ID` | El ID de tu Aplicación de GitHub (de la configuración de la aplicación) |
        | `APP_PRIVATE_KEY` | La clave privada que generaste para tu Aplicación de GitHub |

        ```yaml
        name: Acción de PR de Claude

        permissions:
          contents: write
          pull-requests: write
          issues: write
          id-token: write

        on:
          issue_comment:
            types: [created]
          pull_request_review_comment:
            types: [created]
          issues:
            types: [opened, assigned]

        jobs:
          claude-pr:
            if: |
              (github.event_name == 'issue_comment' && contains(github.event.comment.body, '@claude')) ||
              (github.event_name == 'pull_request_review_comment' && contains(github.event.comment.body, '@claude')) ||
              (github.event_name == 'issues' && contains(github.event.issue.body, '@claude'))
            runs-on: ubuntu-latest
            env:
              AWS_REGION: us-west-2
            steps:
              - name: Checkout del repositorio
                uses: actions/checkout@v4

              - name: Generar token de la Aplicación de GitHub
                id: app-token
                uses: actions/create-github-app-token@v2
                with:
                  app-id: ${{ secrets.APP_ID }}
                  private-key: ${{ secrets.APP_PRIVATE_KEY }}

              - name: Configurar Credenciales de AWS (OIDC)
                uses: aws-actions/configure-aws-credentials@v4
                with:
                  role-to-assume: ${{ secrets.AWS_ROLE_TO_ASSUME }}
                  aws-region: us-west-2

              - uses: ./.github/actions/claude-pr-action
                with:
                  trigger_phrase: "@claude"
                  timeout_minutes: "60"
                  github_token: ${{ steps.app-token.outputs.token }}
                  use_bedrock: "true"
                  model: "us.anthropic.claude-3-7-sonnet-20250219-v1:0"
        ```

        <Tip>
          El formato del ID del modelo para Bedrock incluye el prefijo de la región (p. ej., `us.anthropic.claude...`) y el sufijo de la versión.
        </Tip>
      </Accordion>

      <Accordion title="Flujo de trabajo de Google Vertex AI">
        **Prerrequisitos:**

        * API de Vertex AI habilitada en tu proyecto de GCP.
        * Federación de Identidad de Carga de Trabajo configurada para GitHub.
        * Cuenta de servicio con permisos de Vertex AI.

        **Secretos de GitHub requeridos:**

        | Nombre del Secreto | Descripción |
        | --- | --- |
        | `GCP_WORKLOAD_IDENTITY_PROVIDER` | Nombre del recurso del proveedor de identidad de carga de trabajo |
        | `GCP_SERVICE_ACCOUNT` | Correo electrónico de la cuenta de servicio con acceso a Vertex AI |
        | `APP_ID` | El ID de tu Aplicación de GitHub (de la configuración de la aplicación) |
        | `APP_PRIVATE_KEY` | La clave privada que generaste para tu Aplicación de GitHub |

        ```yaml
        name: Acción de PR de Claude

        permissions:
          contents: write
          pull-requests: write
          issues: write
          id-token: write

        on:
          issue_comment:
            types: [created]
          pull_request_review_comment:
            types: [created]
          issues:
            types: [opened, assigned]

        jobs:
          claude-pr:
            if: |
              (github.event_name == 'issue_comment' && contains(github.event.comment.body, '@claude')) ||
              (github.event_name == 'pull_request_review_comment' && contains(github.event.comment.body, '@claude')) ||
              (github.event_name == 'issues' && contains(github.event.issue.body, '@claude'))
            runs-on: ubuntu-latest
            steps:
              - name: Checkout del repositorio
                uses: actions/checkout@v4

              - name: Generar token de la Aplicación de GitHub
                id: app-token
                uses: actions/create-github-app-token@v2
                with:
                  app-id: ${{ secrets.APP_ID }}
                  private-key: ${{ secrets.APP_PRIVATE_KEY }}

              - name: Autenticar en Google Cloud
                id: auth
                uses: google-github-actions/auth@v2
                with:
                  workload_identity_provider: ${{ secrets.GCP_WORKLOAD_IDENTITY_PROVIDER }}
                  service_account: ${{ secrets.GCP_SERVICE_ACCOUNT }}

              - uses: ./.github/actions/claude-pr-action
                with:
                  trigger_phrase: "@claude"
                  timeout_minutes: "60"
                  github_token: ${{ steps.app-token.outputs.token }}
                  use_vertex: "true"
                  model: "claude-3-7-sonnet@20250219"
                env:
                  ANTHROPIC_VERTEX_PROJECT_ID: ${{ steps.auth.outputs.project_id }}
                  CLOUD_ML_REGION: us-east5
                  VERTEX_REGION_CLAUDE_3_7_SONNET: us-east5
        ```

        <Tip>
          El ID del proyecto se recupera automáticamente del paso de autenticación de Google Cloud, por lo que no necesitas codificarlo.
        </Tip>
      </Accordion>
    </AccordionGroup>

  </Step>
</Steps>

## Solución de problemas

### Claude no responde a los comandos @claude

Verifica que la Aplicación de GitHub esté instalada correctamente, comprueba que los flujos de trabajo estén habilitados, asegúrate de que la clave de API esté configurada en los secretos del repositorio y confirma que el comentario contenga `@claude` (no `/claude`).

### CI no se ejecuta en los commits de Claude

Asegúrate de que estás usando la Aplicación de GitHub o una aplicación personalizada (no el usuario de Acciones), comprueba que los activadores del flujo de trabajo incluyan los eventos necesarios y verifica que los permisos de la aplicación incluyan los activadores de CI.

### Errores de autenticación

Confirma que la clave de API sea válida y tenga suficientes permisos. Para Bedrock/Vertex, comprueba la configuración de las credenciales y asegúrate de que los secretos estén nombrados correctamente en los flujos de trabajo.

## Configuración avanzada

### Parámetros de la acción

La Acción de Claude Code admite estos parámetros clave:

| Parámetro | Descripción | Requerido |
| --- | --- | --- |
| `prompt` | El prompt a enviar a Claude | Sí\* |
| `prompt_file` | Ruta al archivo que contiene el prompt | Sí\* |
| `anthropic_api_key` | Clave de API de Anthropic | Sí\*\* |
| `max_turns` | Máximo de turnos de conversación | No |
| `timeout_minutes` | Tiempo de espera de ejecución | No |

\*Se requiere `prompt` o `prompt_file`.
\*\*Requerido para la API directa de Anthropic, no para Bedrock/Vertex.

### Métodos de integración alternativos

Aunque el comando `/install-github-app` es el enfoque recomendado, también puedes:

- **Aplicación de GitHub personalizada**: Para organizaciones que necesitan nombres de usuario de marca o flujos de autenticación personalizados. Crea tu propia Aplicación de GitHub con los permisos requeridos (contenidos, issues, pull requests) y usa la acción `actions/create-github-app-token` para generar tokens en tus flujos de trabajo.
- **Acciones de GitHub manuales**: Configuración directa del flujo de trabajo para una máxima flexibilidad.
- **Configuración de MCP**: Carga dinámica de servidores del Protocolo de Contexto del Modelo.

Consulta el [repositorio de la Acción de Claude Code](https://github.com/anthropics/claude-code-action) para una documentación detallada.

### Personalización del comportamiento de Claude

Puedes configurar el comportamiento de Claude de dos maneras:

1. **CLAUDE.md**: Define estándares de codificación, criterios de revisión y reglas específicas del proyecto en un archivo `CLAUDE.md` en la raíz de tu repositorio. Claude seguirá estas directrices al crear PRs y responder a las solicitudes. Consulta nuestra [documentación de Memoria](/en/docs/claude-code/memory) para más detalles.
2. **Prompts personalizados**: Usa el parámetro `prompt` en el archivo de flujo de trabajo para proporcionar instrucciones específicas del flujo de trabajo. Esto te permite personalizar el comportamiento de Claude para diferentes flujos de trabajo o tareas.

Claude seguirá estas directrices al crear PRs y responder a las solicitudes.