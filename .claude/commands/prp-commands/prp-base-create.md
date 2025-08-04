# Crear PRP BASE

## Funcionalidad: $ARGUMENTS

## Misión de Creación de PRP

Crear un PRP completo que permita el **éxito de la implementación en un solo intento** a través de la investigación sistemática y la curación de contexto.

**Comprensión Crítica**: El agente de IA que ejecuta solo recibe:

-   Comienza por leer y entender los conceptos de PRP en `PRPs/README.md`.
-   El contenido del PRP que tú creas.
-   Su conocimiento de datos de entrenamiento.
-   Acceso a los archivos de la base de código (pero necesita orientación sobre cuáles).

**Por lo tanto**: Tu investigación y curación de contexto determinan directamente el éxito de la implementación. Un contexto incompleto = fallo en la implementación.

## Proceso de Investigación

> Durante el proceso de investigación, crea tareas claras y genera tantos agentes y subagentes como sea necesario usando las herramientas por lotes (batch tools). Cuanto más profunda sea la investigación que hagamos aquí, mejor será el PRP. Optimizamos por la probabilidad de éxito y no por la velocidad.

1.  **Análisis Profundo de la Base de Código**
    -   Crea "todos" (tareas pendientes) claros y genera subagentes para buscar en la base de código características/patrones similares. Piensa detenidamente y planifica tu enfoque.
    -   Identifica todos los archivos necesarios para referenciar en el PRP.
    -   Anota todas las convenciones existentes a seguir.
    -   Revisa los patrones de prueba existentes para el enfoque de validación.
    -   Usa las herramientas por lotes para generar subagentes que busquen en la base de código características/patrones similares.

2.  **Investigación Externa a Escala**
    -   Crea "todos" claros y genera subagentes con instrucciones para hacer una investigación profunda de características/patrones similares en línea e incluye URLs a documentación y ejemplos.
    -   Documentación de bibliotecas (incluye URLs específicas).
    -   Para piezas críticas de documentación, añade un archivo `.md` a `PRPs/ai_docs` y referéncialo en el PRP con un razonamiento e instrucciones claras.
    -   Ejemplos de implementación (GitHub/StackOverflow/blogs).
    -   Mejores prácticas y errores comunes encontrados durante la investigación.
    -   Usa las herramientas por lotes para generar subagentes que busquen características/patrones similares en línea e incluye URLs a documentación y ejemplos.

3.  **Aclaración con el Usuario**
    -   Pide aclaraciones si las necesitas.

## Proceso de Generación de PRP

### Paso 1: Elegir Plantilla

Usa `PRPs/templates/prp_base.md` como tu estructura de plantilla - contiene todas las secciones y el formato necesarios.

### Paso 2: Validación de la Completitud del Contexto

Antes de escribir, aplica la **Prueba de "Sin Conocimiento Previo"** de la plantilla:
_"Si alguien no supiera nada sobre esta base de código, ¿tendría todo lo necesario para implementar esto con éxito?"_

### Paso 3: Integración de la Investigación

Transforma los hallazgos de tu investigación en las secciones de la plantilla:

**Sección de Objetivo**: Usa la investigación para definir un Objetivo de Funcionalidad específico y medible, y un Entregable concreto.
**Sección de Contexto**: Rellena la estructura YAML con los hallazgos de tu investigación - URLs específicas, patrones de archivos, problemas conocidos.
**Tareas de Implementación**: Crea tareas ordenadas por dependencia usando palabras clave densas en información del análisis de la base de código.
**Puertas de Validación**: Usa comandos de validación específicos del proyecto que hayas verificado que funcionan en esta base de código.

### Paso 4: Estándares de Densidad de Información

Asegúrate de que cada referencia sea **específica y accionable**:

-   Las URLs incluyen anclas de sección, no solo nombres de dominio.
-   Las referencias a archivos incluyen patrones específicos a seguir, no menciones genéricas.
-   Las especificaciones de tareas incluyen convenciones de nomenclatura y ubicación exactas.
-   Los comandos de validación son específicos del proyecto y ejecutables.

### Paso 5: ULTRAPENSAR Antes de Escribir

Después de completar la investigación, crea un plan de escritura de PRP completo usando la herramienta TodoWrite:

-   Planifica cómo estructurar cada sección de la plantilla con los hallazgos de tu investigación.
-   Identifica lagunas que necesiten investigación adicional.
-   Crea un enfoque sistemático para rellenar la plantilla con contexto accionable.

## Resultado

Guardar como: `PRPs/{nombre-de-la-funcionalidad}.md`

## Puertas de Calidad del PRP

### Verificación de Completitud del Contexto

-   [ ] Pasa la prueba de "Sin Conocimiento Previo" de la plantilla.
-   [ ] Todas las referencias YAML son específicas y accesibles.
-   [ ] Las tareas de implementación incluyen una guía exacta de nomenclatura y ubicación.
-   [ ] Los comandos de validación son específicos del proyecto y se ha verificado que funcionan.

### Cumplimiento de la Estructura de la Plantilla

-   [ ] Todas las secciones requeridas de la plantilla están completas.
-   [ ] La sección de Objetivo tiene un Objetivo de Funcionalidad, Entregable y Definición de Éxito específicos.
-   [ ] Las Tareas de Implementación siguen un orden de dependencia.
-   [ ] La Lista de Verificación de Validación Final es completa.

### Estándares de Densidad de Información

-   [ ] No hay referencias genéricas - todas son específicas y accionables.
-   [ ] Los patrones de archivo apuntan a ejemplos específicos a seguir.
-   [ ] Las URLs incluyen anclas de sección para una guía exacta.
-   [ ] Las especificaciones de tareas usan palabras clave densas en información de la base de código.

## Métricas de Éxito

**Puntuación de Confianza**: Califica de 1 a 10 la probabilidad de éxito de la implementación en un solo intento.

**Validación**: El PRP completado debe permitir a un agente de IA no familiarizado con la base de código implementar la funcionalidad con éxito usando solo el contenido del PRP y el acceso a la base de código.