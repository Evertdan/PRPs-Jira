# Subagentes

> Crea y utiliza subagentes de IA especializados en Claude Code para flujos de trabajo específicos de tareas y una mejor gestión del contexto.

Los subagentes personalizados en Claude Code son asistentes de IA especializados que pueden ser invocados para manejar tipos específicos de tareas. Permiten una resolución de problemas más eficiente al proporcionar configuraciones específicas para cada tarea con prompts de sistema personalizados, herramientas y una ventana de contexto separada.

## ¿Qué son los subagentes?

Los subagentes son personalidades de IA preconfiguradas a las que Claude Code puede delegar tareas. Cada subagente:

- Tiene un propósito y un área de especialización específicos.
- Utiliza su propia ventana de contexto, separada de la conversación principal.
- Puede configurarse con herramientas específicas que tiene permitido usar.
- Incluye un prompt de sistema personalizado que guía su comportamiento.

Cuando Claude Code encuentra una tarea que coincide con la especialización de un subagente, puede delegar esa tarea al subagente especializado, que trabaja de forma independiente y devuelve los resultados.

## Beneficios clave

<CardGroup cols={2}>
  <Card title="Preservación del contexto" icon="layer-group">
    Cada subagente opera en su propio contexto, evitando la contaminación de la conversación principal y manteniéndola enfocada en objetivos de alto nivel.
  </Card>

  <Card title="Experiencia especializada" icon="brain">
    Los subagentes pueden ser afinados con instrucciones detalladas para dominios específicos, lo que conduce a tasas de éxito más altas en las tareas designadas.
  </Card>

  <Card title="Reutilización" icon="rotate">
    Una vez creados, los subagentes pueden ser utilizados en diferentes proyectos y compartidos con tu equipo para flujos de trabajo consistentes.
  </Card>

  <Card title="Permisos flexibles" icon="shield-check">
    Cada subagente puede tener diferentes niveles de acceso a las herramientas, lo que te permite limitar herramientas potentes a tipos de subagentes específicos.
  </Card>
</CardGroup>

## Inicio rápido

Para crear tu primer subagente:

<Steps>
  <Step title="Abre la interfaz de subagentes">
    Ejecuta el siguiente comando:

    ```
    /agents
    ```

  </Step>

  <Step title="Selecciona 'Crear Nuevo Agente'">
    Elige si quieres crear un subagente a nivel de proyecto o de usuario.
  </Step>

  <Step title="Define el subagente">
    * **Recomendado**: Genera primero con Claude y luego personalízalo para hacerlo tuyo.
    * Describe tu subagente en detalle y cuándo debe ser utilizado.
    * Selecciona las herramientas a las que quieres dar acceso (o déjalo en blanco para heredar todas las herramientas).
    * La interfaz muestra todas las herramientas disponibles, facilitando la selección.
    * Si estás generando con Claude, también puedes editar el prompt del sistema en tu propio editor presionando `e`.
  </Step>

  <Step title="Guarda y utiliza">
    ¡Tu subagente ya está disponible! Claude lo usará automáticamente cuando sea apropiado, o puedes invocarlo explícitamente:

    ```
    > Usa el subagente revisor-de-código para revisar mis cambios recientes
    ```

  </Step>
</Steps>

## Configuración de subagentes

### Ubicaciones de los archivos

Los subagentes se almacenan como archivos Markdown con frontmatter YAML en dos ubicaciones posibles:

| Tipo | Ubicación | Ámbito | Prioridad |
| :--- | :--- | :--- | :--- |
| **Subagentes de proyecto** | `.claude/agents/` | Disponible en el proyecto actual | Máxima |
| **Subagentes de usuario** | `~/.claude/agents/` | Disponible en todos los proyectos | Menor |

Cuando los nombres de los subagentes entran en conflicto, los subagentes a nivel de proyecto tienen prioridad sobre los subagentes a nivel de usuario.

### Formato de archivo

Cada subagente se define en un archivo Markdown con esta estructura:

```markdown
---
name: tu-nombre-de-subagente
description: Descripción de cuándo debe ser invocado este subagente
tools: herramienta1, herramienta2, herramienta3 # Opcional - hereda todas las herramientas si se omite
---

El prompt de sistema de tu subagente va aquí. Puede tener múltiples párrafos
y debe definir claramente el rol, las capacidades y el enfoque del subagente
para resolver problemas.

Incluye instrucciones específicas, mejores prácticas y cualquier restricción
que el subagente deba seguir.
```

#### Campos de configuración

| Campo | Requerido | Descripción |
| :--- | :--- | :--- |
| `name` | Sí | Identificador único usando letras minúsculas y guiones. |
| `description` | Sí | Descripción en lenguaje natural del propósito del subagente. |
| `tools` | No | Lista de herramientas específicas separadas por comas. Si se omite, hereda todas las herramientas del hilo principal. |

### Herramientas disponibles

A los subagentes se les puede conceder acceso a cualquiera de las herramientas internas de Claude Code. Consulta la [documentación de herramientas](/en/docs/claude-code/settings#tools-available-to-claude) para una lista completa de las herramientas disponibles.

<Tip>
  **Recomendado:** Usa el comando `/agents` para modificar el acceso a las herramientas - proporciona una interfaz interactiva que lista todas las herramientas disponibles, incluyendo cualquier herramienta de servidor MCP conectada, facilitando la selección de las que necesitas.
</Tip>

Tienes dos opciones para configurar las herramientas:

- **Omitir el campo `tools`** para heredar todas las herramientas del hilo principal (por defecto), incluyendo las herramientas MCP.
- **Especificar herramientas individuales** como una lista separada por comas para un control más granular (se puede editar manualmente o a través de `/agents`).

**Herramientas MCP**: Los subagentes pueden acceder a las herramientas MCP desde los servidores MCP configurados. Cuando se omite el campo `tools`, los subagentes heredan todas las herramientas MCP disponibles para el hilo principal.

## Gestionando subagentes

### Usando el comando /agents (Recomendado)

El comando `/agents` proporciona una interfaz completa para la gestión de subagentes:

```
/agents
```

Esto abre un menú interactivo donde puedes:

- Ver todos los subagentes disponibles (incorporados, de usuario y de proyecto).
- Crear nuevos subagentes con una configuración guiada.
- Editar subagentes personalizados existentes, incluyendo su acceso a herramientas.
- Eliminar subagentes personalizados.
- Ver qué subagentes están activos cuando existen duplicados.
- **Gestionar fácilmente los permisos de las herramientas** con una lista completa de las herramientas disponibles.

### Gestión directa de archivos

También puedes gestionar los subagentes trabajando directamente con sus archivos:

```bash
# Crear un subagente de proyecto
mkdir -p .claude/agents
echo '---
name: ejecutor-de-pruebas
description: Usar proactivamente para ejecutar pruebas y corregir fallos
---

Eres un experto en automatización de pruebas. Cuando veas cambios en el código, ejecuta proactivamente las pruebas apropiadas. Si las pruebas fallan, analiza los fallos y corrígelos preservando la intención original de la prueba.' > .claude/agents/test-runner.md

# Crear un subagente de usuario
mkdir -p ~/.claude/agents
# ... crear archivo de subagente
```

## Usando subagentes eficazmente

### Delegación automática

Claude Code delega tareas proactivamente basándose en:

- La descripción de la tarea en tu solicitud.
- El campo `description` en las configuraciones de los subagentes.
- El contexto actual y las herramientas disponibles.

<Tip>
  Para fomentar un uso más proactivo de los subagentes, incluye frases como "USAR PROACTIVAMENTE" o "DEBE SER USADO" en tu campo `description`.
</Tip>

### Invocación explícita

Solicita un subagente específico mencionándolo en tu comando:

```
> Usa el subagente ejecutor-de-pruebas para corregir las pruebas que fallan
> Haz que el subagente revisor-de-código revise mis cambios recientes
> Pide al subagente depurador que investigue este error
```

## Subagentes de ejemplo

### Revisor de código

```markdown
---
name: revisor-de-código
description: Especialista experto en revisión de código. Revisa proactivamente el código en busca de calidad, seguridad y mantenibilidad. Usar inmediatamente después de escribir o modificar código.
tools: Read, Grep, Glob, Bash
---

Eres un revisor de código senior que asegura altos estándares de calidad y seguridad del código.

Cuando seas invocado:

1. Ejecuta `git diff` para ver los cambios recientes.
2. Céntrate en los archivos modificados.
3. Comienza la revisión inmediatamente.

Lista de verificación de la revisión:

- El código es simple y legible.
- Las funciones y variables tienen nombres adecuados.
- No hay código duplicado.
- Manejo de errores adecuado.
- No hay secretos o claves de API expuestas.
- Implementación de la validación de entradas.
- Buena cobertura de pruebas.
- Se han considerado los aspectos de rendimiento.

Proporciona retroalimentación organizada por prioridad:

- Problemas críticos (deben corregirse).
- Advertencias (deberían corregirse).
- Sugerencias (considerar mejorar).

Incluye ejemplos específicos de cómo solucionar los problemas.
```

### Depurador

```markdown
---
name: depurador
description: Especialista en depuración de errores, fallos de pruebas y comportamiento inesperado. Usar proactivamente al encontrar cualquier problema.
tools: Read, Edit, Bash, Grep, Glob
---

Eres un depurador experto especializado en el análisis de la causa raíz.

Cuando seas invocado:

1. Captura el mensaje de error y el stack trace.
2. Identifica los pasos para reproducir el error.
3. Aísla la ubicación del fallo.
4. Implementa una solución mínima.
5. Verifica que la solución funcione.

Proceso de depuración:

- Analiza los mensajes de error y los registros.
- Revisa los cambios recientes en el código.
- Formula y prueba hipótesis.
- Añade registros de depuración estratégicos.
- Inspecciona los estados de las variables.

Para cada problema, proporciona:

- Explicación de la causa raíz.
- Evidencia que respalde el diagnóstico.
- Solución de código específica.
- Enfoque de prueba.
- Recomendaciones de prevención.

Céntrate en solucionar el problema subyacente, no solo los síntomas.
```

### Científico de datos

```markdown
---
name: cientifico-de-datos
description: Experto en análisis de datos para consultas SQL, operaciones de BigQuery y obtención de información de datos. Usar proactivamente para tareas de análisis de datos y consultas.
tools: Bash, Read, Write
---

Eres un científico de datos especializado en análisis con SQL y BigQuery.

Cuando seas invocado:

1. Entiende el requisito de análisis de datos.
2. Escribe consultas SQL eficientes.
3. Usa las herramientas de línea de comandos de BigQuery (bq) cuando sea apropiado.
4. Analiza y resume los resultados.
5. Presenta los hallazgos de forma clara.

Prácticas clave:

- Escribe consultas SQL optimizadas con los filtros adecuados.
- Usa las agregaciones y uniones apropiadas.
- Incluye comentarios que expliquen la lógica compleja.
- Formatea los resultados para facilitar la lectura.
- Proporciona recomendaciones basadas en datos.

Para cada análisis:

- Explica el enfoque de la consulta.
- Documenta cualquier suposición.
- Destaca los hallazgos clave.
- Sugiere los siguientes pasos basados en los datos.

Asegúrate siempre de que las consultas sean eficientes y rentables.
```

## Mejores prácticas

- **Comienza con agentes generados por Claude**: Recomendamos encarecidamente generar tu subagente inicial con Claude y luego iterar sobre él para hacerlo tuyo. Este enfoque te da los mejores resultados: una base sólida que puedes personalizar según tus necesidades específicas.

- **Diseña subagentes enfocados**: Crea subagentes con responsabilidades únicas y claras en lugar de intentar que un subagente lo haga todo. Esto mejora el rendimiento y hace que los subagentes sean más predecibles.

- **Escribe prompts detallados**: Incluye instrucciones específicas, ejemplos y restricciones en tus prompts de sistema. Cuanta más orientación proporciones, mejor se desempeñará el subagente.

- **Limita el acceso a las herramientas**: Concede solo las herramientas que sean necesarias para el propósito del subagente. Esto mejora la seguridad y ayuda al subagente a centrarse en acciones relevantes.

- **Control de versiones**: Registra los subagentes del proyecto en el control de versiones para que tu equipo pueda beneficiarse de ellos y mejorarlos de forma colaborativa.

## Uso avanzado

### Encadenamiento de subagentes

Para flujos de trabajo complejos, puedes encadenar múltiples subagentes:

```
> Primero usa el subagente analizador-de-código para encontrar problemas de rendimiento, luego usa el subagente optimizador para solucionarlos
```

### Selección dinámica de subagentes

Claude Code selecciona subagentes de forma inteligente basándose en el contexto. Haz que tus campos `description` sean específicos y orientados a la acción para obtener los mejores resultados.

## Consideraciones de rendimiento

- **Eficiencia del contexto**: Los agentes ayudan a preservar el contexto principal, permitiendo sesiones generales más largas.
- **Latencia**: Los subagentes comienzan desde cero cada vez que son invocados y pueden añadir latencia mientras recopilan el contexto que necesitan para hacer su trabajo eficazmente.

## Documentación relacionada

- [Comandos de barra diagonal](/en/docs/claude-code/slash-commands) - Aprende sobre otros comandos incorporados.
- [Configuración](/en/docs/claude-code/settings) - Configura el comportamiento de Claude Code.
- [Hooks](/en/docs/claude-code/hooks) - Automatiza flujos de trabajo con manejadores de eventos.