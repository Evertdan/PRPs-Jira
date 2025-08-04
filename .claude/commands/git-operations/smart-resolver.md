Realiza una resolución inteligente de conflictos de fusión con un profundo conocimiento de nuestra base de código.

## Análisis previo a la resolución:

1.  Entender lo que cada rama intentaba lograr:
    `git log --oneline origin/main..HEAD`
    `git log --oneline HEAD..origin/main`

2.  Revisar si hay issues o PRs relacionados:
    `git log --grep="fix" --grep="feat" --oneline -20`
    -   Usa la CLI de GitHub según sea necesario.

3.  Identificar el tipo de conflictos (funcionalidad vs funcionalidad, corrección vs refactorización, etc.).

4.  Piensa detenidamente sobre tus hallazgos y planifica en consecuencia.

## Estrategia de resolución:

### Para diferentes tipos de archivos:

**Conflictos en código fuente (.js, .ts, .py, etc.)**:
-   Entender la lógica de negocio de ambos cambios.
-   Fusionar ambas funcionalidades si son complementarias.
-   Si entran en conflicto, verificar cuál tiene mejor cobertura de pruebas.
-   Buscar archivos relacionados que puedan necesitar actualizaciones.

**Conflictos en archivos de prueba**:
-   Generalmente, fusionar ambos conjuntos de pruebas.
-   Asegurarse de que no haya nombres de prueba duplicados.
-   Actualizar las descripciones de las pruebas si es necesario.

**Archivos de configuración**:
-   `package.json`: Fusionar dependencias, scripts.
-   `.env.example`: Incluir todas las variables nuevas.
-   Configuraciones de CI/CD: Fusionar todos los trabajos (jobs) a menos que estén duplicados.

**Conflictos en documentación**:
-   Fusionar ambas actualizaciones de la documentación.
-   Asegurar la consistencia en la terminología.
-   Actualizar la tabla de contenidos si es necesario.

**Archivos de bloqueo (lock files) (package-lock.json, poetry.lock)**:
-   Eliminar y regenerar después de resolver `package.json`/`pyproject.toml`.

## Verificación posterior a la resolución:

1.  Ejecutar linters para revisar el estilo del código.
2.  Ejecutar verificadores de tipo (type checkers) si aplica.
3.  Ejecutar la suite de pruebas.
4.  Buscar conflictos semánticos (código que se fusiona pero rompe la funcionalidad).
5.  Verificar que no se haya dejado código de depuración.

## Pasos finales:

1.  Crear un resumen detallado de todas las resoluciones.
2.  Si alguna resolución es incierta, marcarla con comentarios `TODO`.
3.  Sugerir pruebas adicionales que puedan ser necesarias.
4.  Añadir al "staging" todos los archivos resueltos.

Comienza analizando la situación actual del conflicto con `git status` y entendiendo ambas ramas.
