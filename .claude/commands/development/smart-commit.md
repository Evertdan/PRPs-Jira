# Commit Inteligente

Este comando crea un mensaje de commit siguiendo la especificación de Commits Convencionales, basado en los archivos en el área de "staging".

## Proceso de Commit

1.  **Analizar Cambios en Staging**
    -   Ejecutar `git diff --staged` para obtener un resumen de todos los cambios preparados para el commit.
    -   Identificar los archivos modificados, añadidos o eliminados.

2.  **Determinar el Tipo de Commit**
    -   Basado en los cambios, clasificar el commit:
        -   `feat`: Una nueva funcionalidad.
        -   `fix`: Una corrección de bug.
        -   `docs`: Cambios en la documentación.
        -   `style`: Cambios que no afectan el significado del código (espacios, formato, etc.).
        -   `refactor`: Un cambio en el código que no corrige un bug ni añade una funcionalidad.
        -   `test`: Añadir pruebas faltantes o corregir pruebas existentes.
        -   `chore`: Cambios en el proceso de build o herramientas auxiliares.
        -   `perf`: Un cambio de código que mejora el rendimiento.
        -   `ci`: Cambios en los archivos y scripts de configuración de CI.

3.  **Determinar el Alcance (Scope)**
    -   Identificar el componente o parte del proyecto afectado (ej. `auth`, `api`, `prp-runner`, `docs`). Es opcional.

4.  **Escribir el Mensaje del Commit**
    -   **Asunto**: `tipo(alcance): descripción concisa en imperativo y minúsculas`
        -   Ejemplo: `feat(auth): añadir soporte para tokens JWT`
        -   Ejemplo: `fix(parser): corregir error al manejar saltos de línea`
    -   **Cuerpo (Opcional)**:
        -   Explicar el "qué" y el "porqué" del cambio, no el "cómo".
        -   Mencionar cualquier "BREAKING CHANGE" (cambio que rompe la compatibilidad).
        -   Referenciar issues de GitHub (`Closes #123`).
    -   **Pie (Opcional)**:
        -   `BREAKING CHANGE: ...`
        -   `Reviewed-by: ...`

5.  **Crear el Commit**
    -   Presentar el mensaje de commit propuesto para aprobación.
    -   Si se aprueba, ejecutar `git commit -m "mensaje completo"`.
    -   Si no se aprueba, permitir al usuario editar el mensaje.

## Argumentos: $ARGUMENTS
(Opcional: el usuario puede proporcionar un mensaje o tipo específico para guiar la generación).

## Ejemplo de Uso
`/smart-commit`
(Claude analiza los cambios y propone un mensaje de commit completo)