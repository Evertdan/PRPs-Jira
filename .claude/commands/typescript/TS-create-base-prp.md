# Crear PRP BASE

## Funcionalidad: $ARGUMENTS

Genera un PRP completo para la implementación de funcionalidades en TypeScript/JavaScript con una investigación profunda y exhaustiva. Asegúrate de que se pase un contexto rico a la IA a través del PRP para permitir el éxito de la implementación en un solo intento mediante la autovalidación y el refinamiento iterativo.

El agente de IA solo recibe el contexto que estás añadiendo al PRP y sus propios datos de entrenamiento. Asume que el agente de IA tiene acceso a la base de código y el mismo corte de conocimiento que tú, por lo que es importante que los hallazgos de tu investigación se incluyan o referencien en el PRP. El Agente tiene capacidades de búsqueda web, así que pasa URLs a la documentación y ejemplos.

## Proceso de Investigación

> Durante el proceso de investigación, crea tareas claras y genera tantos agentes y subagentes como sea necesario usando las herramientas por lotes (batch tools). Cuanto más profunda sea la investigación que hagamos aquí, mejor será el PRP. Optimizamos por la probabilidad de éxito y no por la velocidad.

1.  **Análisis Profundo de la Base de Código**
    -   Crea "todos" (tareas pendientes) claros y genera subagentes para buscar en la base de código características/patrones similares. Piensa detenidamente y planifica tu enfoque.
    -   Identifica todos los archivos necesarios para referenciar en el PRP.
    -   Anota todas las convenciones existentes a seguir (patrones de TypeScript, patrones de React, etc.).
    -   Revisa los patrones de prueba existentes para el enfoque de validación (Jest, Vitest, Cypress, etc.).
    -   Usa las herramientas por lotes para generar subagentes que busquen en la base de código características/patrones similares.

2.  **Investigación Externa a Escala**
    -   Crea "todos" claros y genera subagentes con instrucciones para hacer una investigación profunda de características/patrones similares en línea e incluye URLs a documentación y ejemplos.
    -   Documentación de bibliotecas (incluye URLs específicas para bibliotecas de TypeScript/JavaScript).
    -   Para piezas críticas de documentación, añade un archivo `.md` a `PRPs/ai_docs` y referéncialo en el PRP con un razonamiento e instrucciones claras.
    -   Ejemplos de implementación (GitHub/StackOverflow/blogs con enfoque en TypeScript).
    -   Mejores prácticas y errores comunes encontrados durante la investigación.
    -   Usa las herramientas por lotes para generar subagentes que busquen características/patrones similares en línea e incluye URLs a documentación y ejemplos.

3.  **Aclaración con el Usuario**
    -   Pide aclaraciones si las necesitas.

## Generación de PRP

Usando `PRPs/templates/prp_base_typescript.md` como plantilla:

### Contexto Crítico Mínimo a Incluir y Pasar al Agente de IA como parte del PRP

-   **Documentación**: URLs con secciones específicas.
-   **Ejemplos de Código**: Fragmentos reales de la base de código.
-   **Problemas Conocidos (Gotchas)**: Peculiaridades de bibliotecas, problemas de versión, problemas conocidos de TypeScript.
-   **Patrones**: Enfoques existentes a seguir.
-   **Mejores Prácticas**: Errores comunes encontrados durante la investigación.

### Plan de Implementación

-   Comienza con pseudocódigo que muestre el enfoque.
-   Referencia archivos reales para los patrones.
-   Incluye una estrategia de manejo de errores.
-   Enumera las tareas a completar para cumplir con el PRP en el orden en que deben completarse, usa el patrón en el PRP con palabras clave densas en información.

### Puertas de Validación (Deben ser Ejecutables por el agente de IA)

```bash
# Verificación de tipos
npm run typecheck

# Linting y formateo
npm run lint

# Pruebas Unitarias
npm test

# Validación del build
npm run build

# Pruebas de integración (si aplica)
npm run test:integration
```

Cuantas más puertas de validación, mejor, pero asegúrate de que sean ejecutables por el agente de IA.
Incluye pruebas, validación del build, linting y cualquier otra puerta de validación relevante. Sé creativo con las puertas de validación.

**_ CRÍTICO: DESPUÉS DE QUE TERMINES DE INVESTIGAR Y EXPLORAR LA BASE DE CÓDIGO, ANTES DE EMPEZAR A ESCRIBIR EL PRP _**

**_ ULTRAPIENSA SOBRE EL PRP Y PLANIFICA TU ENFOQUE EN "TODOS" DETALLADOS, LUEGO EMPIEZA A ESCRIBIR EL PRP _**

## Resultado

Guardar como: `PRPs/{nombre-de-la-funcionalidad}.md`

## Lista de Verificación de Calidad

- [ ] Todo el contexto necesario incluido.
- [ ] Las puertas de validación son ejecutables por la IA.
- [ ] Referencia a patrones existentes.
- [ ] Ruta de implementación clara.
- [ ] Manejo de errores documentado.

Califica el PRP en una escala de 1 a 10 (nivel de confianza para tener éxito en la implementación en un solo intento usando Claude Code).

Recuerda: El objetivo es el éxito de la implementación en un solo intento a través de un contexto completo.