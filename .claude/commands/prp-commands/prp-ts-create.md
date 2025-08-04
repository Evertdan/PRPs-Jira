# Crear PRP de TypeScript

## Funcionalidad: $ARGUMENTS

## Misión de Creación de PRP

Crear un PRP de TypeScript completo que permita el **éxito de la implementación en un solo intento** a través de la investigación sistemática y la curación de contexto.

**Comprensión Crítica**: El agente de IA que ejecuta solo recibe:

-   Comienza por leer y entender los conceptos de PRP en `PRPs/README.md`.
-   El contenido del PRP que tú creas.
-   Su conocimiento de datos de entrenamiento.
-   Acceso a los archivos de la base de código (pero necesita orientación sobre cuáles).

**Por lo tanto**: Tu investigación y curación de contexto determinan directamente el éxito de la implementación. Un contexto incompleto = fallo en la implementación.

## Proceso de Investigación

> Durante el proceso de investigación, crea tareas claras y genera tantos agentes y subagentes como sea necesario usando las herramientas por lotes (batch tools). Cuanto más profunda sea la investigación que hagamos aquí, mejor será el PRP. Optimizamos por la probabilidad de éxito y no por la velocidad.

1.  **Análisis Profundo de la Base de Código de TypeScript/React**
    -   Crea "todos" (tareas pendientes) claros y genera subagentes para buscar en la base de código características/patrones similares. Piensa detenidamente y planifica tu enfoque.
    -   Identifica todos los archivos de TypeScript necesarios para referenciar en el PRP.
    -   Anota todas las convenciones existentes de TypeScript/React a seguir.
    -   Revisa los patrones de componentes, patrones de hooks y patrones de rutas de API existentes.
    -   Analiza las definiciones de interfaces de TypeScript y los patrones de uso de tipos.
    -   Revisa los patrones de prueba existentes para componentes de React y el enfoque de validación de código de TypeScript.
    -   Usa las herramientas por lotes para generar subagentes que busquen en la base de código características/patrones similares.

2.  **Investigación Externa de TypeScript/React a Escala**
    -   Crea "todos" claros y genera subagentes con instrucciones para hacer una investigación profunda de características/patrones similares en línea e incluye URLs a documentación y ejemplos.
    -   Documentación de TypeScript (incluye URLs específicas con compatibilidad de versiones).
    -   Documentación de React/Next.js (incluye URLs específicas para App Router, Server Components, etc.).
    -   Para piezas críticas de documentación, añade un archivo `.md` a `PRPs/ai_docs` y referéncialo en el PRP con un razonamiento e instrucciones claras.
    -   Ejemplos de implementación (GitHub/StackOverflow/blogs) específicos para TypeScript/React/Next.js.
    -   Mejores prácticas y errores comunes encontrados durante la investigación (problemas de compilación de TypeScript, hidratación de React, problemas conocidos de Next.js).
    -   Usa las herramientas por lotes para generar subagentes que busquen características/patrones similares en línea e incluye URLs a documentación y ejemplos.

3.  **Aclaración con el Usuario**
    -   Pide aclaraciones si las necesitas.

## Proceso de Generación de PRP

### Paso 1: Elegir Plantilla

Usa `PRPs/templates/prp_base_typescript.md` como tu estructura de plantilla - contiene todas las secciones y el formato necesarios específicos para el desarrollo con TypeScript/React.

### Paso 2: Validación de la Completitud del Contexto

Antes de escribir, aplica la **Prueba de "Sin Conocimiento Previo"** de la plantilla:
_"Si alguien no supiera nada sobre esta base de código de TypeScript/React, ¿tendría todo lo necesario para implementar esto con éxito?"_

### Paso 3: Integración de la Investigación

Transforma los hallazgos de tu investigación en las secciones de la plantilla:

**Sección de Objetivo**: Usa la investigación para definir un Objetivo de Funcionalidad específico y medible, y un Entregable concreto (componente, ruta de API, integración, etc.).
**Sección de Contexto**: Rellena la estructura YAML con los hallazgos de tu investigación - URLs específicas de TypeScript/React, patrones de archivos, problemas conocidos.
**Tareas de Implementación**: Crea tareas ordenadas por dependencia usando palabras clave densas en información del análisis de la base de código de TypeScript/React.
**Puertas de Validación**: Usa comandos de validación específicos de TypeScript/React que hayas verificado que funcionan en esta base de código.

### Paso 4: Estándares de Densidad de Información de TypeScript/React

Asegúrate de que cada referencia sea **específica y accionable** para el desarrollo con TypeScript:

-   Las URLs incluyen anclas de sección, no solo nombres de dominio (documentación de React, manual de TypeScript, documentación de Next.js).
-   Las referencias a archivos incluyen patrones específicos de TypeScript a seguir (interfaces, props de componentes, patrones de hooks).
-   Las especificaciones de tareas incluyen convenciones de nomenclatura y ubicación exactas de TypeScript (Componentes en PascalCase, props en camelCase, etc.).
-   Los comandos de validación son específicos de TypeScript/React y ejecutables (tsc, eslint con reglas de TypeScript, React Testing Library).

### Paso 5: ULTRAPENSAR Antes de Escribir

Después de completar la investigación, crea un plan de escritura de PRP completo usando la herramienta TodoWrite:

-   Planifica cómo estructurar cada sección de la plantilla con los hallazgos de tu investigación de TypeScript/React.
-   Identifica lagunas que necesiten investigación adicional de TypeScript/React.
-   Crea un enfoque sistemático para rellenar la plantilla con contexto de TypeScript accionable.
-   Considera las dependencias de compilación de TypeScript y las jerarquías de componentes de React.

## Resultado

Guardar como: `PRPs/{nombre-de-la-funcionalidad}.md`

## Puertas de Calidad del PRP de TypeScript

### Verificación de Completitud del Contexto

-   [ ] Pasa la prueba de "Sin Conocimiento Previo" de la plantilla de TypeScript.
-   [ ] Todas las referencias YAML son específicas y accesibles (documentación de TypeScript/React, ejemplos de componentes).
-   [ ] Las tareas de implementación incluyen una guía exacta de nomenclatura y ubicación de TypeScript.
-   [ ] Los comandos de validación son específicos de TypeScript/React y se ha verificado que funcionan.
-   [ ] Las definiciones de interfaces de TypeScript y los tipos de props de los componentes están especificados.

### Cumplimiento de la Estructura de la Plantilla

-   [ ] Todas las secciones requeridas de la plantilla de TypeScript están completas.
-   [ ] La sección de Objetivo tiene un Objetivo de Funcionalidad, Entregable y Definición de Éxito específicos.
-   [ ] Las Tareas de Implementación siguen un orden de dependencia de TypeScript (tipos → componentes → páginas → pruebas).
-   [ ] La Lista de Verificación de Validación Final incluye validación específica de TypeScript/React.

### Estándares de Densidad de Información de TypeScript/React

-   [ ] No hay referencias genéricas - todas son específicas de patrones de TypeScript/React.
-   [ ] Los patrones de archivo incluyen ejemplos específicos de TypeScript a seguir (interfaces, componentes, hooks).
-   [ ] Las URLs incluyen anclas de sección para una guía exacta de TypeScript/React.
-   [ ] Las especificaciones de tareas usan palabras clave densas en información de la base de código de TypeScript/React.
-   [ ] Los patrones de componentes especifican el uso de Componentes de Servidor vs Cliente.
-   [ ] Las definiciones de tipos son completas y siguen los patrones existentes.

## Métricas de Éxito

**Puntuación de Confianza**: Califica de 1 a 10 la probabilidad de éxito de la implementación de TypeScript en un solo intento.

**Estándar de Calidad**: Se requiere un mínimo de 8/10 antes de la aprobación del PRP.

**Validación**: El PRP completado debe permitir a un agente de IA no familiarizado con la base de código de TypeScript/React implementar la funcionalidad con éxito usando solo el contenido del PRP y el acceso a la base de código, con total seguridad de tipos y siguiendo las mejores prácticas de React.