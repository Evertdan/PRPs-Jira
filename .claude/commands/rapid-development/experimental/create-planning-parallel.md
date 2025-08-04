# Crear PRP de PLANIFICACIÓN (Investigación Paralela)

Transforma ideas aproximadas en PRDs (Documentos de Requisitos de Producto) completos utilizando agentes de investigación paralelos para una máxima eficiencia y profundidad.

## Idea: $ARGUMENTS

## Fase 1: Descubrimiento mediante Investigación Paralela

**IMPORTANTE**: Ejecuta los siguientes 4 agentes de investigación simultáneamente utilizando múltiples llamadas a la herramienta Agente en una sola respuesta para maximizar la eficiencia de la investigación.

### Coordinación de Agentes de Investigación

Lanza estos agentes de forma concurrente - no esperes a que uno termine para empezar el siguiente:

#### Agente 1: Inteligencia de Mercado
```
Tarea: Análisis de Investigación de Mercado
Prompt: Investiga el panorama del mercado para "$ARGUMENTS". Realiza un análisis profundo de:
- Panorama competitivo y posicionamiento.
- Tamaño del mercado, tendencias de crecimiento y oportunidades.
- Modelos de precios y estrategias de ingresos.
- Soluciones existentes y sus limitaciones.
- Brechas de mercado y necesidades no satisfechas.
- Audiencia objetivo y segmentos de usuarios.

Céntrate puramente en la investigación - no escribas ningún código. Usa la búsqueda web extensivamente. Devuelve un informe completo de análisis de mercado con puntos de datos y conocimientos específicos.
```

#### Agente 2: Viabilidad Técnica
```
Tarea: Investigación de Arquitectura Técnica
Prompt: Analiza la viabilidad técnica para "$ARGUMENTS". Investiga y evalúa:
- Pilas tecnológicas y frameworks recomendados.
- Patrones de arquitectura de sistemas y mejores prácticas.
- Posibilidades de integración con sistemas existentes.
- Consideraciones de escalabilidad y rendimiento.
- Desafíos técnicos y soluciones.
- Estimación del esfuerzo de desarrollo.

Solo enfoque en investigación - sin implementación de código. Usa la búsqueda web para las mejores prácticas actuales. Devuelve recomendaciones técnicas con análisis de pros y contras.
```

#### Agente 3: Investigación de Experiencia de Usuario (UX)
```
Tarea: Análisis de Patrones de UX
Prompt: Investiga patrones de experiencia de usuario para "$ARGUMENTS". Investiga:
- Mapeo del viaje del usuario y ejemplos de flujos.
- Puntos de dolor en las soluciones existentes.
- Mejores prácticas de UX y patrones de diseño.
- Estándares y requisitos de accesibilidad.
- Tendencias e innovaciones en la interfaz de usuario.
- Perspectivas de pruebas de usabilidad de productos similares.

Solo investigación - sin creación de diseño. Usa la búsqueda web para estudios de caso de UX. Devuelve un análisis de UX con recomendaciones accionables.
```

#### Agente 4: Mejores Prácticas y Cumplimiento
```
Tarea: Investigación de Estándares de la Industria
Prompt: Investiga las mejores prácticas de la industria para "$ARGUMENTS". Cubre:
- Estándares de seguridad y requisitos de cumplimiento.
- Regulaciones de privacidad y protección de datos.
- Benchmarks de rendimiento y KPIs.
- Metodologías de aseguramiento de la calidad.
- Prácticas de gestión de riesgos.
- Consideraciones legales y regulatorias.

Solo enfoque en investigación. Usa la búsqueda web para guías de cumplimiento. Devuelve una guía completa de mejores prácticas con estándares específicos.
```

## Fase 2: Síntesis y Análisis de la Investigación

Una vez que todos los agentes completen su investigación, sintetiza los hallazgos en:

### Evaluación de la Oportunidad de Mercado
-   Tamaño del mercado y potencial de crecimiento.
-   Visión general del panorama competitivo.
-   Segmentos de usuarios y personas objetivo.
-   Diferenciación de la propuesta de valor.

### Marco de Arquitectura Técnica
-   Pila tecnológica recomendada.
-   Enfoque de diseño del sistema.
-   Estrategia de integración.
-   Plan de escalabilidad.

### Plan de Experiencia de Usuario
-   Mapeo del viaje del usuario.
-   Patrones de interacción clave.
-   Requisitos de accesibilidad.
-   Recomendaciones de sistema de diseño.

### Preparación para la Implementación
-   Lista de verificación de seguridad y cumplimiento.
-   Evaluación de riesgos y mitigación.
-   Métricas de éxito y KPIs.
-   Puertas de calidad y validación.

## Fase 3: Validación con el Usuario y Recopilación de Requisitos

### Preguntas Críticas para el Usuario
Antes de generar el PRD final, pide al usuario que aclare:

1.  **Alcance y Restricciones**
    -   ¿Cuál es el cronograma objetivo?
    -   ¿Restricciones de presupuesto o recursos?
    -   ¿Funcionalidades imprescindibles vs. deseables?

2.  **Definición de Éxito**
    -   ¿Métricas de éxito primarias?
    -   ¿Objetivos de adopción por parte del usuario?
    -   ¿Objetivos de negocio?

3.  **Contexto Técnico**
    -   ¿Sistemas existentes con los que integrarse?
    -   ¿Preferencias o restricciones tecnológicas?
    -   ¿Experiencia y capacidades del equipo?

4.  **Contexto del Usuario**
    -   ¿Personas de usuario primarias?
    -   ¿Prioridades de casos de uso?
    -   ¿Puntos de dolor actuales del usuario?

## Fase 4: Generación del PRD

Usando la investigación sintetizada y la entrada del usuario, crea un PRD completo siguiendo esta estructura:

### Plantilla de Salida del PRD
```markdown
# Documento de Requisitos de Producto: [Nombre de la Funcionalidad]

## 1. Resumen Ejecutivo
- Declaración del problema.
- Solución propuesta.
- Criterios de éxito.
- Requisitos de recursos.

## 2. Análisis de Mercado
[Insertar hallazgos del Agente de Inteligencia de Mercado]
- Oportunidad de mercado.
- Panorama competitivo.
- Segmentos de usuarios.

## 3. Diseño de Experiencia de Usuario
[Insertar hallazgos del Agente de Investigación de UX]
- Personas y viajes del usuario.
- Flujos de usuario clave (con diagramas de Mermaid).
- Wireframes y maquetas necesarias.

## 4. Arquitectura Técnica
[Insertar hallazgos del Agente de Viabilidad Técnica]
- Arquitectura del sistema (con diagramas de Mermaid).
- Pila tecnológica.
- Puntos de integración.
- Consideraciones de escalabilidad.

## 5. Seguridad y Cumplimiento
[Insertar hallazgos del Agente de Mejores Prácticas]
- Requisitos de seguridad.
- Estándares de cumplimiento.
- Evaluación de riesgos.

## 6. Plan de Implementación
- Fases de desarrollo.
- Dependencias y prerrequisitos.
- Estimaciones de cronograma.
- Asignación de recursos.

## 7. Métricas de Éxito
- Indicadores Clave de Rendimiento (KPIs).
- Criterios de aceptación.
- Estrategia de pruebas.

## 8. Evaluación de Riesgos
- Riesgos técnicos y mitigación.
- Riesgos de mercado y contingencias.
- Riesgos de recursos y alternativas.
```

### Diagramas Requeridos (usando Mermaid)
Genera estos diagramas en el PRD:

1.  **Diagrama de Flujo de Usuario**
    ```mermaid
    flowchart TD
        A[Entrada del Usuario] --> B{Punto de Decisión}
        B -->|Sí| C[Ruta de Éxito]
        B -->|No| D[Ruta Alternativa]
    ```

2.  **Diagrama de Arquitectura del Sistema**
    ```mermaid
    graph TB
        Frontend --> API
        API --> BaseDeDatos
        API --> ServicioExterno
    ```

3.  **Cronograma de Implementación**
    ```mermaid
    gantt
        title Fases de Implementación
        section Fase 1
        Investigación y Diseño: 2024-01-01, 2s
        section Fase 2
        Desarrollo Principal: 2s
    ```

## Fase 5: Guardar y Entregar

Guarda el PRD completado como: `PRPs/{nombre-de-funcionalidad-sanitizado}-prd.md`

### Lista de Verificación de Calidad
Antes de marcar como completado, verifica:
- [ ] Las 4 áreas de investigación cubiertas de manera exhaustiva.
- [ ] Preguntas de validación del usuario respondidas.
- [ ] Arquitectura técnica claramente definida.
- [ ] Flujos de usuario diagramados con Mermaid.
- [ ] Fases de implementación delineadas.
- [ ] Métricas de éxito definidas.
- [ ] Requisitos de seguridad documentados.
- [ ] Listo para la creación del PRP de implementación.

### Próximos Pasos
1.  Revisar el PRD con las partes interesadas.
2.  Crear el PRP de implementación usando el comando `/prp`.
3.  Comenzar la planificación del desarrollo y la creación de sprints.

---

**Recuerda**: Este comando aprovecha agentes de investigación paralelos para crear PRDs completos 4 veces más rápido que la investigación secuencial. La calidad depende de la coordinación exhaustiva de los agentes y la síntesis de los hallazgos.
