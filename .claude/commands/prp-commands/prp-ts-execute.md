# Ejecutar PRP de TypeScript

## Archivo PRP: $ARGUMENTS

## Misión: Éxito en la Implementación de TypeScript en un Solo Intento

Los PRPs permiten obtener código TypeScript/React funcional al primer intento a través de:

-   **Completitud del Contexto**: Todo lo necesario, nada adivinado.
-   **Validación Progresiva**: Puertas de 4 niveles que detectan errores temprano.
-   **Consistencia de Patrones**: Seguir los enfoques existentes en la base de código de TypeScript/React.
-   **Seguridad de Tipos**: Aprovechar la detección de errores en tiempo de compilación de TypeScript.
-   Leer `PRPs/README.md` para entender los conceptos de PRP.

**Tu Objetivo**: Transformar el PRP en código TypeScript funcional que pase todas las puertas de validación y mantenga la seguridad de tipos.

## Proceso de Ejecución

1.  **Cargar PRP**
    -   Leer el archivo PRP de TypeScript especificado por completo.
    -   Absorber todo el contexto, patrones, requisitos y recopilar inteligencia de la base de código.
    -   Usar las referencias de documentación y patrones de archivo proporcionados, consumir la documentación correcta antes de la tarea/todo apropiado.
    -   Confiar en el contexto y la guía del PRP - está diseñado para el éxito en un solo intento.
    -   Si es necesario, realizar exploración e investigación adicional de la base de código según sea necesario.
    -   Prestar especial atención a las interfaces de TypeScript, patrones de componentes y la estructura del App Router de Next.js.

2.  **ULTRAPENSAR y Planificar**
    -   Crear un plan de implementación completo siguiendo el orden de tareas del PRP.
    -   Desglosar en "todos" (tareas pendientes) claros usando la herramienta TodoWrite.
    -   Usar subagentes para trabajo en paralelo cuando sea beneficioso (siempre crear prompts inspirados en el prp para los subagentes cuando se usen).
    -   Seguir los patrones de TypeScript/React referenciados en el PRP.
    -   Usar rutas de archivo, nombres de interfaz, nombres de componentes y definiciones de tipos específicos del contexto del PRP.
    -   Nunca adivinar - siempre verificar por ti mismo los patrones y ejemplos de la base de código referenciados en el PRP.
    -   Considerar las dependencias de compilación de TypeScript (tipos antes de componentes, componentes antes de páginas).

3.  **Ejecutar Implementación**
    -   Seguir la secuencia de Tareas de Implementación del PRP, añadir más detalles según sea necesario, especialmente al usar subagentes.
    -   Usar los patrones y ejemplos de TypeScript/React referenciados en el PRP.
    -   Crear archivos en las ubicaciones especificadas por el árbol de la base de código deseado.
    -   Aplicar las convenciones de nomenclatura de TypeScript de las especificaciones de la tarea y de `CLAUDE.md`.
    -   Asegurar un tipado de TypeScript adecuado en todo momento (interfaces, props, tipos de retorno).
    -   Seguir los patrones del App Router de Next.js para el enrutamiento basado en archivos.

4.  **Validación Progresiva**

    **Ejecutar el sistema de validación de 4 niveles del PRP de TypeScript:**
    -   **Nivel 1**: Ejecutar los comandos de validación de sintaxis y estilo de TypeScript del PRP (ESLint, tsc, Prettier).
    -   **Nivel 2**: Ejecutar la validación de pruebas unitarias de componentes y hooks del PRP.
    -   **Nivel 3**: Ejecutar los comandos de pruebas de integración de Next.js del PRP (servidor de desarrollo, rutas de API, build de producción).
    -   **Nivel 4**: Ejecutar la validación específica de TypeScript/React del PRP (E2E, rendimiento, accesibilidad).

    **Cada nivel debe pasarse antes de proceder al siguiente.**

5.  **Verificación de Finalización**
    -   Revisar la Lista de Verificación de Validación Final en el PRP.
    -   Verificar que se cumplan todos los Criterios de Éxito de la sección "Qué".
    -   Confirmar que se evitaron todos los Anti-Patrones (especialmente los específicos de TypeScript/React).
    -   Verificar que la compilación de TypeScript sea exitosa y sin errores.
    -   Asegurar la separación adecuada de componentes de Servidor/Cliente si se usa Next.js.
    -   La implementación está lista y funcionando con total seguridad de tipos.

**Protocolo de Fallo**: Cuando la validación falle, usa los patrones y problemas conocidos (gotchas) de TypeScript/React del PRP para solucionar los problemas, luego vuelve a ejecutar la validación hasta que pase. Presta especial atención a:
-   Errores de compilación de TypeScript y discrepancias de tipos.
-   Problemas de hidratación de React entre el servidor y el cliente.
-   Requisitos específicos del App Router de Next.js.
-   Violaciones de la interfaz de props de los componentes.
