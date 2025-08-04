# Ejecutar PRP BASE

## Archivo PRP: $ARGUMENTS

## Misión: Éxito en la Implementación en un Solo Intento

Los PRPs permiten obtener código funcional al primer intento a través de:

-   **Completitud del Contexto**: Todo lo necesario, nada adivinado.
-   **Validación Progresiva**: Puertas de 4 niveles que detectan errores temprano.
-   **Consistencia de Patrones**: Seguir los enfoques existentes en la base de código.
-   Leer `PRPs/README.md` para entender los conceptos de PRP.

**Tu Objetivo**: Transformar el PRP en código funcional que pase todas las puertas de validación.

## Proceso de Ejecución

1.  **Cargar PRP**
    -   Leer el archivo PRP especificado por completo.
    -   Absorber todo el contexto, patrones, requisitos y recopilar inteligencia de la base de código.
    -   Usar las referencias de documentación y patrones de archivo proporcionados, consumir la documentación correcta antes de la tarea/todo apropiado.
    -   Confiar en el contexto y la guía del PRP - está diseñado para el éxito en un solo intento.
    -   Si es necesario, realizar exploración e investigación adicional de la base de código según sea necesario.

2.  **ULTRAPENSAR y Planificar**
    -   Crear un plan de implementación completo siguiendo el orden de tareas del PRP.
    -   Desglosar en "todos" (tareas pendientes) claros usando la herramienta TodoWrite.
    -   Usar subagentes para trabajo en paralelo cuando sea beneficioso (siempre crear prompts inspirados en el prp para los subagentes cuando se usen).
    -   Seguir los patrones referenciados en el PRP.
    -   Usar rutas de archivo, nombres de clase y firmas de métodos específicos del contexto del PRP.
    -   Nunca adivinar - siempre verificar por ti mismo los patrones y ejemplos de la base de código referenciados en el PRP.

3.  **Ejecutar Implementación**
    -   Seguir la secuencia de Tareas de Implementación del PRP, añadir más detalles según sea necesario, especialmente al usar subagentes.
    -   Usar los patrones y ejemplos referenciados en el PRP.
    -   Crear archivos en las ubicaciones especificadas por el árbol de la base de código deseado.
    -   Aplicar las convenciones de nomenclatura de las especificaciones de la tarea y de `CLAUDE.md`.

4.  **Validación Progresiva**

    **Ejecutar el sistema de validación por niveles del PRP:**
    -   **Nivel 1**: Ejecutar los comandos de validación de sintaxis y estilo del PRP.
    -   **Nivel 2**: Ejecutar la validación de pruebas unitarias del PRP.
    -   **Nivel 3**: Ejecutar los comandos de pruebas de integración del PRP.
    -   **Nivel 4**: Ejecutar la validación especificada del PRP.

    **Cada nivel debe pasarse antes de proceder al siguiente.**

5.  **Verificación de Finalización**
    -   Revisar la Lista de Verificación de Validación Final en el PRP.
    -   Verificar que se cumplan todos los Criterios de Éxito de la sección "Qué".
    -   Confirmar que se evitaron todos los Anti-Patrones.
    -   La implementación está lista y funcionando.

**Protocolo de Fallo**: Cuando la validación falle, usa los patrones y problemas conocidos (gotchas) del PRP para solucionar los problemas, luego vuelve a ejecutar la validación hasta que pase.