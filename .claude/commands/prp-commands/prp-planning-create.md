# Crear PRP de PLANIFICACIÓN (Avanzado)

Transforma ideas aproximadas en PRDs (Documentos de Requisitos de Producto) completos con rica documentación visual.

## Idea: $ARGUMENTS

## Proceso de Descubrimiento

1.  **Expansión del Concepto**
    -   Desglosar la idea central.
    -   Definir criterios de éxito.
    -   Mapear a objetivos de negocio si se proporcionan.

2.  **Investigación de Mercado y Técnica**
    -   Realizar una búsqueda web profunda para lo siguiente:
        -   Análisis de mercado.
        -   Análisis de competidores.
        -   Estudio de viabilidad técnica.
        -   Ejemplos de mejores prácticas.
        -   Posibilidades de integración.

3.  **Investigación de Usuario y Aclaración**
    -   Preguntar al usuario por lo siguiente si no se proporciona:
        -   ¿Personas de usuario objetivo?
        -   ¿Puntos de dolor clave?
        -   ¿Métricas de éxito?
        -   ¿Restricciones/requisitos?

## Generación de PRD

Usando `/PRPs/templates/prp_planning_base.md`:

### Plan de Documentación Visual
```yaml
diagramas_necesarios:
  flujos_de_usuario:
    - Recorrido del camino feliz (Happy path)
    - Escenarios de error
    - Casos borde
  
  arquitectura:
    - Componentes del sistema
    - Flujo de datos
    - Puntos de integración
  
  secuencias:
    - Interacciones de API
    - Flujos de eventos
    - Cambios de estado
  
  modelos_de_datos:
    - Relaciones entre entidades
    - Diseño de esquema (schema)
    - Máquinas de estado
```

### Integración de la Investigación
-   **Análisis de Mercado**: Incluir hallazgos en el PRD.
-   **Opciones Técnicas**: Comparar enfoques.
-   **Evaluación de Riesgos**: Con estrategias de mitigación.
-   **Métricas de Éxito**: Específicas, medibles.

### Desarrollo de Historias de Usuario
```markdown
## Épica: [Funcionalidad de alto nivel]

### Historia 1: [Necesidad del usuario]
**Como un** [tipo de usuario]
**Quiero** [capacidad]
**Para que** [beneficio]

**Criterios de Aceptación:**
- [ ] Comportamiento específico
- [ ] Manejo de casos borde
- [ ] Requisito de rendimiento

**Notas Técnicas:**
- Enfoque de implementación
- Implicaciones de la API
- Requisitos de datos
```

### Estrategia de Implementación
-   Fases con dependencias (sin fechas).
-   Orden de prioridad.
-   MVP vs funcionalidades mejoradas.
-   Prerrequisitos técnicos.

## Puntos de Interacción con el Usuario

1.  **Validación de la Idea**
    -   Confirmar la comprensión.
    -   Aclarar ambigüedades.
    -   Establecer límites.

2.  **Revisión de la Investigación**
    -   Compartir hallazgos.
    -   Validar suposiciones.
    -   Ajustar la dirección.

3.  **Revisión del Borrador del PRD**
    -   Aprobación de la arquitectura.
    -   Reconocimiento de riesgos.
    -   Acuerdo sobre las métricas de éxito.

## Directrices para Diagramas
-   Usar Mermaid para todos los diagramas.
-   Incluir leyendas donde sea necesario.
-   Mostrar rutas de error.
-   Anotar flujos complejos.

## Estructura del Resultado
```markdown
1. Resumen Ejecutivo
2. Problema y Solución
3. Historias de Usuario (con diagramas)
4. Arquitectura Técnica (con diagramas)
5. Especificaciones de la API
6. Modelos de Datos
7. Fases de Implementación
8. Riesgos y Mitigaciones
9. Métricas de Éxito
10. Apéndices
```

Guardar como: `PRPs/{nombre-de-la-funcionalidad}-prd.md`

## Lista de Verificación de Calidad
- [ ] Problema claramente articulado.
- [ ] La solución aborda el problema.
- [ ] Todos los flujos de usuario están diagramados.
- [ ] Wireframes incluidos si es necesario.
- [ ] Arquitectura visualizada.
- [ ] APIs completamente especificadas con ejemplos.
- [ ] Modelos de datos incluidos.
- [ ] Dependencias identificadas.
- [ ] Riesgos identificados y mitigados.
- [ ] Métricas de éxito medibles.
- [ ] Fases de implementación lógicas.
- [ ] Listo para el PRP de implementación.

Recuerda: Unos buenos PRDs previenen la confusión en la implementación.
