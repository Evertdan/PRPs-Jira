# Depuración y Análisis de Causa Raíz (RCA)

Este comando te guía a través de un proceso estructurado de depuración para identificar la causa raíz de un problema.

## Argumentos: $ARGUMENTS
(Descripción del problema, error, o comportamiento inesperado)

## Proceso de Depuración

1.  **Entender el Problema**
    -   ¿Cuál es el comportamiento esperado?
    -   ¿Cuál es el comportamiento real?
    -   ¿Cuándo empezó a ocurrir?
    -   ¿Se puede reproducir de forma consistente?

2.  **Recopilar Contexto**
    -   Revisar logs relevantes.
    -   Inspeccionar el código relacionado con la funcionalidad.
    -   Comprobar cambios recientes en el código (`git log -p`).
    -   Analizar la configuración del entorno.

3.  **Formular Hipótesis**
    -   Basado en el contexto, ¿cuál podría ser la causa probable?
    -   Ejemplo: "La base de datos podría no estar conectada" o "Un cambio reciente en el modelo de datos está causando un error de serialización".

4.  **Probar Hipótesis (Bucle de Validación)**
    -   Diseñar un experimento para confirmar o refutar la hipótesis.
    -   **Ejecutar Pruebas**: `uv run pytest tests/test_feature.py`
    -   **Ejecutar Linters**: `ruff check . && mypy .`
    -   **Prueba de Integración**: Usar `curl` o una herramienta similar para probar el endpoint afectado.
    -   **Añadir Logging**: Añadir sentencias de log para rastrear el flujo de ejecución.
    -   **Depurador Interactivo**: Usar `pdb` o el depurador de tu IDE.

5.  **Identificar Causa Raíz**
    -   Una vez que una hipótesis es confirmada, documentar la causa raíz.

6.  **Proponer una Solución**
    -   Describir el cambio de código necesario para arreglar el problema.
    -   Especificar los archivos a modificar.

## Resultado

Genera un informe de depuración en `PRPs/debugging/debug_report_[timestamp].md` con:

```markdown
# Informe de Depuración: [Breve Descripción del Problema]

## Problema
- **Comportamiento Esperado**: ...
- **Comportamiento Real**: ...

## Análisis y Contexto
- **Logs Relevantes**: ...
- **Código Afectado**: ...
- **Cambios Recientes**: ...

## Causa Raíz Identificada
[Explicación detallada de la causa raíz]

## Solución Propuesta
[Descripción de los cambios de código necesarios]
```