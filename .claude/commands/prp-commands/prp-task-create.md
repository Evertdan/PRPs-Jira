# Crear PRP de TAREA (Avanzado)

Genera una lista de tareas completa para cambios enfocados con validación.

## Tarea: $ARGUMENTS

## Proceso de Análisis

1.  **Definición del Alcance**
    -   Identificar todos los archivos afectados.
    -   Mapear dependencias.
    -   Verificar efectos secundarios.
    -   Anotar la cobertura de pruebas.

2.  **Investigación de Patrones**
    -   Encontrar cambios similares en el historial.
    -   Identificar convenciones a seguir.
    -   Buscar funciones de ayuda (helper functions).
    -   Revisar patrones de prueba.

3.  **Aclaración con el Usuario**
    -   Confirmar el alcance del cambio.
    -   Verificar los criterios de aceptación.
    -   Revisar consideraciones de despliegue.
    -   Identificar bloqueadores.

## Generación de PRP

**LEER**
Usando el formato de `TASK_PRP/PRPs/prp_task.md`:

### Sección de Contexto

```yaml
contexto:
  docs:
    - url: [documentación de la API]
      enfoque: [métodos específicos]

  patrones:
    - archivo: ejemplo/existente.py
      copiar: [patrón a seguir]

  problemas_conocidos:
    - problema: "La biblioteca requiere X"
      solucion: "Siempre hacer Y primero"
```

### Estructura de la Tarea

```
ACCIÓN ruta/al/archivo:
  - OPERACIÓN: [cambio específico]
  - VALIDAR: [comando de prueba]
  - SI_FALLA: [estrategia de depuración]
  - RETROCEDER: [enfoque para deshacer]
```

### Secuenciación de Tareas

1.  **Tareas de Configuración**: Prerrequisitos.
2.  **Cambios Principales**: Modificaciones centrales.
3.  **Integración**: Conectar componentes.
4.  **Validación**: Pruebas exhaustivas.
5.  **Limpieza**: Eliminar código temporal.

### Estrategia de Validación

-   Prueba unitaria después de cada cambio.
-   Prueba de integración después de grupos de cambios.
-   Verificación de rendimiento si es relevante.
-   Escaneo de seguridad para áreas sensibles.

## Puntos de Interacción con el Usuario

1.  **Revisión de Tareas**
    -   Confirmar el desglose de tareas.
    -   Validar la secuenciación.
    -   Verificar que esté completo.

2.  **Evaluación de Riesgos**
    -   Revisar los impactos potenciales.
    -   Confirmar el enfoque de retroceso (rollback).
    -   Establecer criterios de éxito.

## Elementos Críticos

-   Incluir patrones de depuración.
-   Añadir verificaciones de rendimiento.
-   Anotar preocupaciones de seguridad.
-   Documentar suposiciones.

## Resultado

Guardar como: `TASK_PRP/PRPs/{nombre-de-la-tarea}.md`

## Lista de Verificación de Calidad

-   [ ] Todos los cambios identificados.
-   [ ] Dependencias mapeadas.
-   [ ] Cada tarea tiene validación.
-   [ ] Pasos de retroceso (rollback) incluidos.
-   [ ] Estrategias de depuración proporcionadas.
-   [ ] Impacto en el rendimiento anotado.
-   [ ] Seguridad verificada.
-   [ ] No faltan casos borde.

Recuerda: Cambios pequeños y enfocados con validación inmediata.