# Crear Nueva Rama de Desarrollo

Este comando crea y se cambia a una nueva rama de Git para desarrollo, siguiendo las convenciones del equipo.

## Argumentos: $ARGUMENTS
(Tipo de rama y nombre descriptivo, ej: "feature mi-nueva-funcionalidad" o "bugfix error-de-login")

## Proceso de Creación de Rama

1.  **Validar Argumentos**
    -   Asegurarse de que se proporciona un tipo de rama (`feature`, `bugfix`, `chore`, etc.).
    -   Asegurarse de que se proporciona un nombre descriptivo.

2.  **Verificar Estado de Git**
    -   Comprobar que no haya cambios sin confirmar en la rama actual. Si los hay, pedir al usuario que los guarde (commit) o los descarte (stash).
    -   Hacer `git pull` en la rama principal (`main` o `develop`) para asegurarse de que está actualizada.

3.  **Construir Nombre de la Rama**
    -   Formato: `[tipo]/[nombre-descriptivo]`
    -   Ejemplo: `feature/añadir-autenticacion-oauth`
    -   Convertir el nombre a minúsculas y reemplazar espacios con guiones.

4.  **Crear y Cambiar de Rama**
    -   Ejecutar `git checkout -b [nombre-de-la-rama]` desde la rama principal.

5.  **Confirmación**
    -   Mostrar un mensaje de éxito confirmando que la nueva rama ha sido creada y que te has cambiado a ella.
    -   Ejemplo: `Éxito: Se ha creado la rama 'feature/mi-nueva-funcionalidad' y te has cambiado a ella.`

## Ejemplo de Uso
`/new-dev-branch feature mi nueva funcionalidad`