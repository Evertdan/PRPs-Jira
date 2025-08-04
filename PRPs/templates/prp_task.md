---
Destinado a tareas de Jira/GitHub u otros sistemas de gestión de tareas para desglosar y planificar la implementación.
---

# Plantilla de Tarea v2 - Densa en Información con Bucles de Validación

> Tareas concisas y ejecutables con contexto incrustado y comandos de validación

## Formato

```
[ACCIÓN] ruta/al/archivo:
  - [OPERACIÓN]: [DETALLES]
  - VALIDAR: [COMANDO]
  - SI_FALLA: [PISTA_DE_DEPURACIÓN]
```

## Palabras clave de acciones a usar al crear tareas para descripciones concisas y significativas

- **LEER**: Entender patrones existentes.
- **CREAR**: Nuevo archivo con contenido específico.
- **ACTUALIZAR**: Modificar archivo existente.
- **ELIMINAR**: Quitar archivo/código.
- **ENCONTRAR**: Buscar patrones.
- **PROBAR**: Verificar comportamiento.
- **CORREGIR**: Depurar y reparar.

## Sección de Contexto Crítico

```yaml
# Incluir esto ANTES de las tareas cuando el contexto es crucial
contexto:
  docs:
    - url: [documentación de la API]
      enfoque: [método/sección específica]

  patrones:
    - archivo: ejemplo/existente.py
      copiar: [nombre del patrón]

  problemas_conocidos:
    - problema: "La biblioteca X requiere Y"
      solucion: "Siempre hacer Z primero"
```

## Ejemplos de Tareas con Validación

### Tareas de Configuración

```
LEER src/config/settings.py:
  - ENTENDER: Estructura de configuración actual.
  - ENCONTRAR: Patrón de configuración de modelos.
  - NOTA: La configuración usa pydantic BaseSettings.

LEER tests/test_models.py:
  - ENTENDER: Patrón de prueba para modelos.
  - ENCONTRAR: Enfoque de configuración de fixtures.
  - NOTA: Usa pytest-asyncio para pruebas asíncronas.
```

### Tareas de Implementación

````
ACTUALIZAR ruta/al/archivo:
  - ENCONTRAR: MODEL_REGISTRY = {
  - AÑADIR: "nuevo-modelo": NuevaClaseModelo,
  - VALIDAR: python -c "from ruta/al/archivo import MODEL_REGISTRY; assert 'nuevo-modelo' in MODEL_REGISTRY"
  - SI_FALLA: Revisar la declaración de importación para NuevaClaseModelo.

CREAR ruta/al/archivo:
  - COPIAR_PATRÓN: ruta/a/otro/archivo
  - IMPLEMENTAR:
   - [Descripción detallada de lo que necesita ser implementado basado en la inteligencia de la base de código]
  - VALIDAR: uv run pytest ruta/al/archivo -v

ACTUALIZAR ruta/al/archivo:
  - ENCONTRAR: app.include_router(
  - AÑADIR_DESPUÉS:
    ```python
    from .endpoints import nuevo_router_modelo
    app.include_router(nuevo_router_modelo, prefix="/api/v1")
    ```
  - VALIDAR: uv run pytest ruta/al/archivo -v
````

## Puntos de Control de Validación

```
PUNTO_DE_CONTROL sintaxis:
  - EJECUTAR: ruff check && mypy .
  - CORREGIR: Cualquier problema reportado.
  - CONTINUAR: Solo cuando esté limpio.

PUNTO_DE_CONTROL pruebas:
  - EJECUTAR: uv run pytest ruta/al/archivo -v
  - REQUERIR: Todas pasando.
  - DEPURAR: uv run pytest -vvs ruta/al/archivo/prueba_fallida.py
  - CONTINUAR: Solo cuando todo esté en verde.

PUNTO_DE_CONTROL integración:
  - INICIAR: docker-compose up -d
  - EJECUTAR: ./scripts/integration_test.sh
  - ESPERAR: "Todas las pruebas pasaron"
  - LIMPIAR: docker-compose down
```

## Patrones de Depuración

```
DEPURAR error_de_importacion:
  - REVISAR: El archivo existe en la ruta.
  - REVISAR: __init__.py en todos los directorios padres.
  - INTENTAR: python -c "import ruta/al/archivo"
  - CORREGIR: Añadir a PYTHONPATH o corregir la importación.

DEPURAR fallo_de_prueba:
  - EJECUTAR: uv run pytest -vvs ruta/a/la/prueba.py::nombre_de_la_prueba
  - AÑADIR: print(f"Debug: {variable}")
  - IDENTIFICAR: Problema de aserción vs implementación.
  - CORREGIR: Actualizar la prueba o corregir el código.

DEPURAR error_de_api:
  - REVISAR: El servidor está corriendo (ps aux | grep uvicorn).
  - PROBAR: curl http://localhost:8000/health
  - LEER: Registros del servidor para ver el stack trace.
  - CORREGIR: Basado en el error específico.
```

## Ejemplos de Tareas Comunes

### Añadir Nueva Funcionalidad

```
1. LEER funcionalidad similar existente.
2. CREAR nuevo archivo de funcionalidad (COPIAR patrón).
3. ACTUALIZAR registro/router para incluirla.
4. CREAR pruebas para la funcionalidad.
5. PROBAR que todas las pruebas pasen.
6. CORREGIR cualquier problema de linting/tipado.
7. PROBAR que la integración funcione.
```

### Corregir un Bug

```
1. CREAR una prueba que falle y reproduzca el bug.
2. PROBAR para confirmar que la prueba falla.
3. LEER el código relevante para entender.
4. ACTUALIZAR el código con la corrección.
5. PROBAR para confirmar que la prueba ahora pasa.
6. PROBAR que no se hayan roto otras pruebas.
7. ACTUALIZAR el changelog.
```

### Refactorizar Código

```
1. PROBAR que las pruebas actuales pasen (línea base).
2. CREAR nueva estructura (no eliminar la antigua todavía).
3. ACTUALIZAR un uso a la nueva estructura.
4. PROBAR que todavía pase.
5. ACTUALIZAR los usos restantes incrementalmente.
6. ELIMINAR la estructura antigua.
7. PROBAR que la suite completa de pruebas pase.
```

## Consejos para Tareas Efectivas

- Usa VALIDAR después de cada cambio.
- Incluye pistas de SI_FALLA para problemas comunes.
- Referencia números de línea o patrones específicos.
- Mantén los comandos de validación simples y rápidos.
- Encadena tareas relacionadas con dependencias claras.
- Siempre incluye pasos de retroceso/deshacer para cambios arriesgados.