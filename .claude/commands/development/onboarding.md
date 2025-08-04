# Bienvenida al Proyecto

Este comando te guiará a través de la configuración inicial y el contexto de este proyecto.

## Proceso de Onboarding

1.  **Introducción al Proyecto**
    -   Leer y resumir el archivo `README.md` para dar una visión general de alto nivel.
    -   Leer y resumir el archivo `CLAUDE.md` para explicar las convenciones de codificación y arquitectura específicas de este proyecto.

2.  **Configuración del Entorno**
    -   Verificar las herramientas necesarias (ej. `uv`, `git`, `docker`).
    -   Guiar a través de la instalación de dependencias:
        ```bash
        # Crear entorno virtual
        uv venv
        # Activar el entorno (instrucción para el usuario)
        echo "Por favor, ejecuta: source .venv/bin/activate"
        # Instalar dependencias
        uv sync
        ```

3.  **Comandos Clave**
    -   Mostrar una lista de los comandos de desarrollo más importantes definidos en `CLAUDE.md`.
    -   Explicar cómo ejecutar las pruebas: `uv run pytest`
    -   Explicar cómo ejecutar el linter: `ruff check . --fix`

4.  **Estructura del Proyecto**
    -   Explicar la organización de las carpetas clave:
        -   `.claude/commands/`: Dónde viven los comandos de Claude.
        -   `PRPs/`: Dónde se gestionan los Prompts de Requisitos de Producto.
        -   `src/`: Dónde reside el código fuente principal (si aplica).
        -   `tests/`: Dónde se encuentran las pruebas.

5.  **Siguientes Pasos**
    -   Sugerir una primera tarea, como:
        -   Ejecutar `/prime-core` para obtener un contexto profundo.
        -   Elegir una tarea "good first issue" del backlog.
        -   Crear un PRP de prueba con `/prp-base-create`.

## Resultado
Proporcionar una guía paso a paso interactiva en el chat.
