# Preparar Contexto Principal (Prime Core)

Este comando carga el contexto esencial del proyecto en la memoria de Claude para asegurar que todas las interacciones futuras estén alineadas con la arquitectura, estilo y objetivos del proyecto.

## Proceso de Preparación

1.  **Cargar Documentación Fundamental**
    -   Leer el archivo `README.md` para entender el propósito general del proyecto.
    -   Leer el archivo `CLAUDE.md` para asimilar las directrices de codificación, arquitectura, patrones y anti-patrones.

2.  **Analizar la Estructura del Proyecto**
    -   Ejecutar `ls -R` o una herramienta similar para obtener un mapa completo de la estructura de archivos y directorios.
    -   Identificar las carpetas clave (`.claude`, `PRPs`, `src`, `tests`, etc.).

3.  **Revisar Dependencias**
    -   Leer `pyproject.toml` (o `requirements.txt`, `package.json`, etc.) para entender las bibliotecas y frameworks utilizados.
    -   Prestar especial atención a las versiones para evitar problemas de compatibilidad.

4.  **Cargar Documentación de IA Curada**
    -   Leer todos los archivos del directorio `PRPs/ai_docs/`. Estos documentos contienen información vital y curada para el desarrollo asistido por IA en este proyecto.

5.  **Revisar Comandos Personalizados**
    -   Listar los comandos disponibles en `.claude/commands/` para entender las herramientas y flujos de trabajo automatizados disponibles.

## Argumentos: $ARGUMENTS
(Opcional: se puede especificar una sección o archivo particular para enfocar la preparación, ej: "tests" o "PRPs/templates/prp_base.md")

## Resultado
Después de ejecutar este comando, Claude debe tener un conocimiento profundo y práctico del proyecto. El resultado final es un mensaje de confirmación.

**Mensaje de Confirmación:**
"✅ Contexto principal cargado. Estoy listo para colaborar en el proyecto, siguiendo las directrices de `CLAUDE.md` y la estructura del repositorio."
