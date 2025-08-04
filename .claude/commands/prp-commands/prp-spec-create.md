# Crear PRP de ESPECIFICACIÓN (Avanzado)

Genera un PRP completo impulsado por especificaciones con objetivos de transformación claros.

## Especificación: $ARGUMENTS

## Proceso de Análisis

1.  **Evaluación del Estado Actual**
    -   Mapear la implementación existente.
    -   Identificar puntos de dolor.
    -   Documentar la deuda técnica.
    -   Anotar los puntos de integración.

2.  **Investigación del Estado Deseado**
    -   Mejores prácticas para el estado objetivo.
    -   Ejemplos de implementación.
    -   Estrategias de migración.
    -   Evaluación de riesgos.
    -   Mapeo de dependencias.

3.  **Aclaración con el Usuario**
    -   Confirmar los objetivos de la transformación.
    -   Prioridad de los objetivos.
    -   Compromisos aceptables.

## Generación de PRP

Usando el formato de `/PRPs/templates/prp_spec.md`:

### Documentación de Estado

```yaml
estado_actual:
  archivos: [listar archivos afectados]
  comportamiento: [cómo funciona ahora]
  problemas: [problemas específicos]

estado_deseado:
  archivos: [estructura esperada]
  comportamiento: [funcionalidad objetivo]
  beneficios: [mejoras obtenidas]
```

### Objetivos Jerárquicos

1.  **Alto Nivel**: Objetivo general de la transformación.
2.  **Nivel Medio**: Hitos principales.
3.  **Bajo Nivel**: Tareas específicas con validación.

### Especificación de Tareas con palabras clave densas en información

#### Palabras clave densas en información:

-   MIRROR (ESPEJAR): Reflejar el estado del código existente para ser espejado en otro caso de uso.
-   COPY (COPIAR): Copiar el estado del código existente para ser copiado a otro caso de uso.
-   ADD (AÑADIR): Añadir nuevo código a la base de código.
-   MODIFY (MODIFICAR): Modificar código existente.
-   DELETE (ELIMINAR): Eliminar código existente.
-   RENAME (RENOMBRAR): Renombrar código existente.
-   MOVE (MOVER): Mover código existente.
-   REPLACE (REEMPLAZAR): Reemplazar código existente.
-   CREATE (CREAR): Crear nuevo código.

#### Ejemplo:

```yaml
nombre_de_la_tarea:
  accion: MODIFICAR/CREAR
  archivo: ruta/al/archivo
  cambios: |
    - Modificaciones específicas
    - Detalles de implementación
    - Con marcadores claros
  validacion:
    - comando: "comando de prueba"
    - esperar: "criterio de éxito"
```

### Estrategia de Implementación

-   Identificar dependencias.
-   Ordenar tareas por prioridad, orden de implementación y lógica de dependencias.
-   Incluir planes de retroceso (rollback).
-   Mejora progresiva.

## Puntos de Interacción con el Usuario

1.  **Validación de Objetivos**
    -   Revisar el desglose jerárquico.
    -   Confirmar prioridades.
    -   Identificar piezas faltantes.

2.  **Revisión de Riesgos**
    -   Documentar los riesgos identificados.
    -   Encontrar mitigaciones.
    -   Establecer criterios de "go/no-go" (seguir/no seguir).

## Requisitos de Contexto

-   Detalles de la implementación actual.
-   Ejemplos de la arquitectura objetivo.
-   Mejores prácticas de migración.
-   Estrategias de prueba.

## Resultado

Guardar como: `SPEC_PRP/PRPs/{nombre-de-la-especificacion}.md`

## Lista de Verificación de Calidad

-   [ ] Estado actual completamente documentado.
-   [ ] Estado deseado claramente definido.
-   [ ] Todos los objetivos son medibles.
-   [ ] Tareas ordenadas por dependencia.
-   [ ] Cada tarea tiene una validación que la IA puede ejecutar.
-   [ ] Riesgos identificados con mitigaciones.
-   [ ] Estrategia de retroceso (rollback) incluida.
-   [ ] Puntos de integración anotados.

Recuerda: Céntrate en el viaje de la transformación, no solo en el destino.