---
name: parallel-prp-creation
description: Crea múltiples variaciones de PRP en paralelo para análisis comparativo y validación de la estrategia de implementación
arguments:
  - name: prp_name
    description: El nombre base para el PRP (ej., "autenticacion-de-usuario")
  - name: implementation_details
    description: Requisitos y contexto principales de la funcionalidad
  - name: number_of_parallel_prps
    description: Número de variaciones de PRP paralelas a crear (recomendado 2-5)
---

# Creación de PRP en Paralelo - Múltiples Estrategias de Implementación

Genera **ARGS** variaciones de PRP en paralelo para análisis comparativo y validación del enfoque de implementación. Este comando aprovecha múltiples agentes de IA que trabajan simultáneamente para crear diferentes estrategias de implementación para la misma funcionalidad, permitiendo la selección del enfoque óptimo.

## Resumen

Este flujo de trabajo crea **NUMBER_OF_PARALLEL_PRPs** variaciones de PRP independientes:

- Cada agente investiga la misma funcionalidad desde diferentes perspectivas arquitectónicas.
- Cada agente crea un PRP completo con enfoques de implementación distintos.
- Todos los agentes trabajan de forma concurrente para una máxima eficiencia.
- Los resultados permiten el análisis comparativo y la selección de la estrategia.

## Parámetros de Ejecución

PRP_NAME: $ARGUMENTS[0]
IMPLEMENTATION_DETAILS: $ARGUMENTS[1]
NUMBER_OF_PARALLEL_PRPs: $ARGUMENTS[2]

## Coordinación de Agentes en Paralelo

**CRÍTICO**: Ejecuta todos los agentes simultáneamente utilizando múltiples llamadas a la herramienta Tarea en una sola respuesta. No esperes a que un agente termine para empezar el siguiente.

## Estrategia de Asignación de Agentes

Cada agente aborda la misma funcionalidad con diferentes áreas de enfoque:

### Matriz de Especialización de Agentes

```yaml
Agente 1: Enfoque Optimizado para el Rendimiento
  Foco: Escalabilidad, caché, optimización
  Arquitectura: Patrones de alto rendimiento
  Validación: Pruebas de carga, métricas de rendimiento

Agente 2: Enfoque "Seguridad Primero"
  Foco: Seguridad, validación, autenticación
  Arquitectura: Patrones de defensa en profundidad
  Validación: Pruebas de seguridad, pruebas de penetración

Agente 3: Enfoque Centrado en la Mantenibilidad
  Foco: Código limpio, modularidad, pruebas
  Arquitectura: Principios SOLID, patrones de diseño
  Validación: Pruebas unitarias, calidad del código

Agente 4: Enfoque de Desarrollo Rápido
  Foco: Implementación rápida, complejidad mínima
  Arquitectura: Patrones simplificados, frameworks
  Validación: Pruebas de integración, funcionalidad

Agente 5: Enfoque de Grado Empresarial
  Foco: Robustez, monitoreo, observabilidad
  Arquitectura: Patrones empresariales, microservicios
  Validación: Pruebas de extremo a extremo, monitoreo
```

## Comandos de Ejecución en Paralelo

Ejecuta estos agentes de forma concurrente:

```
Usa la herramienta Tarea para ejecutar estos ${NUMBER_OF_PARALLEL_PRPs} agentes en PARALELO para la funcionalidad: ${PRP_NAME}

Detalles de Implementación: ${IMPLEMENTATION_DETAILS}
```

### Agente 1: Implementación Optimizada para el Rendimiento

```
Tarea: Creación de PRP Optimizado para el Rendimiento
Prompt: Crea un PRP completo para "${PRP_NAME}" con un enfoque en RENDIMIENTO Y ESCALABILIDAD.

Detalles de la Funcionalidad: ${IMPLEMENTATION_DETAILS}

Tu enfoque debe enfatizar:
- Patrones de arquitectura de alto rendimiento.
- Estrategias de caché y técnicas de optimización.
- Optimización de base de datos e indexación.
- Patrones async/await y concurrencia.
- Gestión de memoria y eficiencia de recursos.
- Consideraciones de balanceo de carga y escalado horizontal.

Fase de Investigación:
1. Analiza la base de código existente en busca de patrones de rendimiento.
2. Investiga bibliotecas y frameworks de alto rendimiento.
3. Identifica cuellos de botella y oportunidades de optimización.
4. Estudia las capas de caché y los patrones de acceso a datos.
5. Revisa el monitoreo de rendimiento y las métricas.

Creación del PRP:
- Usa PRPs/templates/prp_base.md como base.
- Enfoca el plan de implementación en patrones de rendimiento.
- Incluye puertas de validación de rendimiento específicas.
- Añade requisitos de pruebas de carga y benchmarking.
- Referencia ejemplos de código existentes de alto rendimiento.

Archivos de Salida:
1. Guarda el PRP como: PRPs/${PRP_NAME}-1.md
2. Guarda los resultados completos como: RESULTS_${PRP_NAME}-1.md

Incluye en los resultados:
- Análisis de rendimiento de la base de código actual.
- Oportunidades de optimización específicas identificadas.
- Resumen del enfoque de implementación.
- Estrategia de validación del rendimiento.
- Mejoras de rendimiento esperadas.

NO ejecutes ningún servidor, build o ejecutable. Céntrate solo en la investigación y la creación del PRP.
```

### Agente 2: Implementación "Seguridad Primero"

```
Tarea: Creación de PRP "Seguridad Primero"
Prompt: Crea un PRP completo para "${PRP_NAME}" con un enfoque en SEGURIDAD Y PROTECCIÓN DE DATOS.

Detalles de la Funcionalidad: ${IMPLEMENTATION_DETAILS}

Tu enfoque debe enfatizar:
- Patrones de arquitectura de seguridad por diseño.
- Estrategias de autenticación y autorización.
- Validación y sanitización de entradas.
- Cifrado y protección de datos.
- Monitoreo y registro de seguridad.
- Evaluación y mitigación de vulnerabilidades.

Fase de Investigación:
1. Analiza los patrones de seguridad existentes en la base de código.
2. Investiga frameworks de seguridad y mejores prácticas.
3. Identifica posibles vectores de ataque y vulnerabilidades.
4. Estudia los mecanismos de autenticación y autorización.
5. Revisa los enfoques de pruebas y validación de seguridad.

Creación del PRP:
- Usa PRPs/templates/prp_base.md como base.
- Enfoca el plan de implementación en patrones de seguridad.
- Incluye puertas de validación de seguridad completas.
- Añade requisitos de pruebas de penetración y escaneo de seguridad.
- Referencia implementaciones de seguridad existentes.

Archivos de Salida:
1. Guarda el PRP como: PRPs/${PRP_NAME}-2.md
2. Guarda los resultados completos como: RESULTS_${PRP_NAME}-2.md

Incluye en los resultados:
- Análisis de seguridad de la implementación actual.
- Riesgos de seguridad identificados y mitigaciones.
- Resumen del enfoque de implementación.
- Estrategia de validación de seguridad.
- Consideraciones de cumplimiento.

NO ejecutes ningún servidor, build o ejecutable. Céntrate solo en la investigación y la creación del PRP.
```

### Agente 3: Implementación Centrada en la Mantenibilidad

```
Tarea: Creación de PRP Centrado en la Mantenibilidad
Prompt: Crea un PRP completo para "${PRP_NAME}" con un enfoque en CALIDAD DEL CÓDIGO Y MANTENIBILIDAD.

Detalles de la Funcionalidad: ${IMPLEMENTATION_DETAILS}

Tu enfoque debe enfatizar:
- Principios de código limpio y diseño SOLID.
- Estrategias de pruebas completas (unitarias, de integración, E2E).
- Arquitectura modular y separación de conceptos.
- Documentación y legibilidad del código.
- Refactorización y prevención de la deuda técnica.
- Seguridad de tipos y análisis estático.

Fase de Investigación:
1. Analiza los patrones de calidad de código existentes en la base de código.
2. Investiga frameworks de pruebas y herramientas de calidad.
3. Identifica áreas para mejorar la modularidad.
4. Estudia los estándares de documentación y comentarios.
5. Revisa las oportunidades y patrones de refactorización.

Creación del PRP:
- Usa PRPs/templates/prp_base.md como base.
- Enfoca el plan de implementación en patrones de código limpio.
- Incluye puertas de validación de pruebas completas.
- Añade métricas de calidad de código y análisis estático.
- Referencia ejemplos de código existentes bien estructurados.

Archivos de Salida:
1. Guarda el PRP como: PRPs/${PRP_NAME}-3.md
2. Guarda los resultados completos como: RESULTS_${PRP_NAME}-3.md

Incluye en los resultados:
- Análisis de la calidad del código de la base de código actual.
- Deuda técnica identificada y oportunidades de mejora.
- Resumen del enfoque de implementación.
- Estrategia de pruebas y validación de calidad.
- Métricas y objetivos de mantenibilidad.

NO ejecutes ningún servidor, build o ejecutable. Céntrate solo en la investigación y la creación del PRP.
```

### Agente 4: Implementación de Desarrollo Rápido

```
Tarea: Creación de PRP de Desarrollo Rápido
Prompt: Crea un PRP completo para "${PRP_NAME}" con un enfoque en la VELOCIDAD DE IMPLEMENTACIÓN.

Detalles de la Funcionalidad: ${IMPLEMENTATION_DETAILS}

Tu enfoque debe enfatizar:
- Patrones de implementación mínima viable.
- Utilización de frameworks y generación de código.
- Arquitectura simplificada y complejidad reducida.
- Victorias rápidas y desarrollo iterativo.
- Aprovechamiento de bibliotecas y componentes existentes.
- Bucles de retroalimentación y validación rápidos.

Fase de Investigación:
1. Analiza la base de código existente en busca de componentes reutilizables.
2. Investiga frameworks y herramientas de desarrollo rápido.
3. Identifica oportunidades para la reutilización y simplificación del código.
4. Estudia patrones existentes que puedan adaptarse rápidamente.
5. Revisa las pruebas de integración para una validación rápida.

Creación del PRP:
- Usa PRPs/templates/prp_base.md como base.
- Enfoca el plan de implementación en patrones de entrega rápida.
- Incluye puertas de validación simplificadas para una retroalimentación rápida.
- Añade pruebas de integración para la funcionalidad principal.
- Referencia componentes existentes que puedan ser aprovechados.

Archivos de Salida:
1. Guarda el PRP como: PRPs/${PRP_NAME}-4.md
2. Guarda los resultados completos como: RESULTS_${PRP_NAME}-4.md

Incluye en los resultados:
- Análisis de componentes reutilizables en la base de código.
- Atajos y oportunidades de simplificación identificados.
- Resumen del enfoque de implementación.
- Estrategia de validación rápida.
- Estimaciones de tiempo e hitos de entrega.

NO ejecutes ningún servidor, build o ejecutable. Céntrate solo en la investigación y la creación del PRP.
```

### Agente 5: Implementación de Grado Empresarial

```
Tarea: Creación de PRP de Grado Empresarial
Prompt: Crea un PRP completo para "${PRP_NAME}" con un enfoque en la ROBUSTEZ EMPRESARIAL.

Detalles de la Funcionalidad: ${IMPLEMENTATION_DETAILS}

Tu enfoque debe enfatizar:
- Patrones de arquitectura empresarial y escalabilidad.
- Monitoreo y observabilidad completos.
- Patrones de manejo de errores y resiliencia.
- Gestión de la configuración y despliegue.
- Documentación y procedimientos operativos.
- Requisitos de cumplimiento y auditoría.

Fase de Investigación:
1. Analiza los patrones empresariales existentes en la base de código.
2. Investiga frameworks empresariales y herramientas de monitoreo.
3. Identifica los requisitos para el despliegue en producción.
4. Estudia los mecanismos de manejo de errores y recuperación.
5. Revisa los procedimientos operativos y de mantenimiento.

Creación del PRP:
- Usa PRPs/templates/prp_base.md como base.
- Enfoca el plan de implementación en patrones empresariales.
- Incluye puertas de validación operativas completas.
- Añade requisitos de monitoreo, registro y alertas.
- Referencia implementaciones de grado empresarial existentes.

Archivos de Salida:
1. Guarda el PRP como: PRPs/${PRP_NAME}-5.md
2. Guarda los resultados completos como: RESULTS_${PRP_NAME}-5.md

Incluye en los resultados:
- Análisis de la preparación empresarial de la base de código actual.
- Requisitos operativos y de monitoreo identificados.
- Resumen del enfoque de implementación.
- Estrategia de validación en producción.
- Procedimientos operativos y documentación.

NO ejecutes ningún servidor, build o ejecutable. Céntrate solo en la investigación y la creación del PRP.
```

## Reglas de Ejecución de Agentes

### Directrices de Investigación

Cada agente debe, de forma independiente:

1.  **Análisis de la Base de Código**
    -   Usar las herramientas Glob, Grep y Read extensivamente.
    -   Identificar patrones y ejemplos de código existentes relevantes.
    -   Analizar la estructura del proyecto y las decisiones arquitectónicas.
    -   Encontrar implementaciones similares para referenciar.

2.  **Investigación Externa**
    -   Usar WebSearch para la documentación de frameworks.
    -   Investigar mejores prácticas y patrones de implementación.
    -   Encontrar ejemplos y casos de estudio relevantes.
    -   Identificar posibles bibliotecas y herramientas.

3.  **Documentación de Contexto**
    -   Leer `PRPs/ai_docs/` para la documentación específica del proyecto.
    -   Analizar archivos de configuración y patrones de instalación.
    -   Identificar requisitos de entorno y dependencias.
    -   Documentar convenciones y estándares existentes.

### Requisitos de Creación de PRP

Cada agente debe crear un PRP completo que incluya:

```yaml
## Objetivo
[Objetivo de implementación específico con énfasis en el área de enfoque]

## Por qué
- Valor de negocio alineado con el enfoque elegido.
- Consideraciones de integración para la estrategia seleccionada.
- Compromisos y beneficios del enfoque seleccionado.

## Qué
[Requisitos de la funcionalidad adaptados a la estrategia de implementación]

## Todo el Contexto Necesario
### Documentación y Referencias
- url: [Documentación del framework específica para el enfoque]
- file: [Ejemplos de código existentes relevantes]
- docfile: [Documentación del proyecto de ai_docs/]

### Patrones de Implementación
[Patrones específicos para el enfoque elegido]

### Problemas Conocidos (Gotchas)
[Desafíos y soluciones específicos del enfoque]

## Plan de Implementación
### Modelos de Datos y Estructura
[Modelos optimizados para el enfoque elegido]

### Lista de Tareas
[Tareas ordenadas específicas para la estrategia de implementación]

### Pseudocódigo
[Enfoque de implementación con detalles específicos de la estrategia]

### Puntos de Integración
[Estrategia de integración para el enfoque elegido]

## Bucle de Validación
### Nivel 1: Sintaxis y Estilo
[Comandos de validación estándar]

### Nivel 2: Pruebas Unitarias
[Estrategia de pruebas alineada con el enfoque]

### Nivel 3: Pruebas de Integración
[Validación específica para la estrategia de implementación]

## Lista de Verificación de Validación Final
[Puertas de calidad completas para el enfoque elegido]
```

### Documentación de Resultados

Cada agente debe crear un archivo de resultados completo que contenga:

```markdown
# Resultados de Implementación de ${PRP_NAME} - Agente ${N}

## Resumen del Enfoque

**Foco**: [Rendimiento/Seguridad/Mantenibilidad/Rápido/Empresarial]
**Estrategia**: [Breve descripción de la estrategia de implementación elegida]

## Hallazgos de la Investigación

### Análisis de la Base de Código

- Patrones existentes identificados: [lista con rutas de archivo]
- Componentes reutilizables encontrados: [lista con descripciones]
- Perspectivas arquitectónicas: [hallazgos clave]

### Investigación Externa

- Frameworks/bibliotecas recomendados: [lista con justificaciones]
- Mejores prácticas identificadas: [perspectivas clave]
- Ejemplos de implementación encontrados: [fuentes relevantes]

### Revisión de la Documentación

- Restricciones específicas del proyecto: [del análisis de ai_docs]
- Requisitos de configuración: [necesidades de configuración del entorno]
- Consideraciones de integración: [compatibilidad con sistemas existentes]

## Estrategia de Implementación

### Enfoque Principal

[Explicación detallada de la estrategia de implementación]

### Diferenciadores Clave

[Qué hace que este enfoque sea único en comparación con las alternativas]

### Compromisos

**Ventajas**: [beneficios de este enfoque]
**Desventajas**: [limitaciones y desafíos]
**Complejidad**: [evaluación de la complejidad de la implementación]

## Estrategia de Validación

### Enfoque de Pruebas

[Estrategia de pruebas específica para esta implementación]

### Puertas de Calidad

[Puntos de control de validación y criterios de éxito]

### Métricas de Éxito

[Cómo medir el éxito de la implementación]

## Recomendaciones

### Prioridad de Implementación

[Orden de implementación recomendado y dependencias]

### Mitigación de Riesgos

[Riesgos identificados y estrategias de mitigación]

### Próximos Pasos

[Acciones inmediatas requeridas para proceder]

## Análisis Comparativo

### Fortalezas vs Otros Enfoques

[Por qué elegir este enfoque sobre las alternativas]

### Casos de Uso Ideales

[Cuándo este enfoque es más adecuado]

### Expectativas de Rendimiento

[Resultados y benchmarks esperados]
```

## Protocolo de Coordinación

### Gestión de la Ejecución

1.  **Lanzamiento Paralelo**: Todos los agentes comienzan simultáneamente.
2.  **Operación Independiente**: Sin comunicación entre agentes.
3.  **Base Consistente**: Todos usan la misma plantilla `prp_base.md`.
4.  **Foco Único**: Cada agente mantiene un enfoque estratégico distinto.
5.  **Salida Completa**: Cada uno produce tanto el archivo PRP como el de resultados.

### Garantía de Calidad

Cada agente debe asegurar:

- [ ] Investigación completa en la base de código, fuentes externas y documentación.
- [ ] El PRP sigue la estructura de la plantilla base exactamente.
- [ ] La estrategia de implementación está claramente diferenciada.
- [ ] Las puertas de validación son ejecutables y específicas.
- [ ] El archivo de resultados proporciona un análisis completo.
- [ ] No hay intentos de ejecución de código o arranque de servidores.

### Gestión del Tiempo

-   **Fase de Investigación**: 10-15 minutos por agente.
-   **Creación del PRP**: 15-20 minutos por agente.
-   **Documentación de Resultados**: 5-10 minutos por agente.
-   **Tiempo Total en Paralelo**: 30-45 minutos (todos los agentes concurrentes).

## Salidas Esperadas

Al finalizar, tendrás:

```
PRPs/
├── ${PRP_NAME}-1.md    # Enfoque optimizado para el rendimiento
├── ${PRP_NAME}-2.md    # Enfoque "seguridad primero"
├── ${PRP_NAME}-3.md    # Enfoque centrado en la mantenibilidad
├── ${PRP_NAME}-4.md    # Enfoque de desarrollo rápido
├── ${PRP_NAME}-5.md    # Enfoque de grado empresarial

Directorio Raíz/
├── RESULTS_${PRP_NAME}-1.md    # Análisis del enfoque de rendimiento
├── RESULTS_${PRP_NAME}-2.md    # Análisis del enfoque de seguridad
├── RESULTS_${PRP_NAME}-3.md    # Análisis del enfoque de mantenibilidad
├── RESULTS_${PRP_NAME}-4.md    # Análisis del enfoque de desarrollo rápido
├── RESULTS_${PRP_NAME}-5.md    # Análisis del enfoque empresarial
```

## Marco de Análisis Comparativo

Después de que todos los agentes completen, sintetiza los resultados comparando:

### Complejidad de la Implementación

- Estimaciones de líneas de código.
- Proyecciones de tiempo de desarrollo.
- Requisitos de dependencia.
- Complejidad de la configuración.

### Características de Rendimiento

- Tiempos de respuesta esperados.
- Utilización de recursos.
- Limitaciones de escalabilidad.
- Potencial de optimización.

### Carga de Mantenimiento

- Métricas de complejidad del código.
- Requisitos de pruebas.
- Necesidades de documentación.
- Sostenibilidad a largo plazo.

### Evaluación de Riesgos

- Riesgos técnicos.
- Vulnerabilidades de seguridad.
- Cuellos de botella de rendimiento.
- Desafíos de integración.

## Criterios de Selección

Elige el enfoque óptimo basado en:

1.  **Requisitos del Proyecto**: Coincidir el enfoque con las necesidades reales.
2.  **Capacidades del Equipo**: Alinear con la experiencia y los recursos del equipo.
3.  **Restricciones de Tiempo**: Equilibrar la calidad con la velocidad de entrega.
4.  **Objetivos de Mantenimiento**: Considerar la sostenibilidad a largo plazo.
5.  **Necesidades de Rendimiento**: Coincidir el nivel de optimización con los requisitos.

## Métricas de Éxito

Evalúa el éxito de la creación de PRP en paralelo mediante:

-   **Completitud de la Cobertura**: Todos los enfoques investigados a fondo.
-   **Diferenciación Estratégica**: Cada PRP ofrece una estrategia de implementación única.
-   **Riqueza del Contexto**: Investigación exhaustiva de la base de código y externa.
-   **Claridad de la Validación**: Puertas de calidad ejecutables y específicas.
-   **Soporte a la Decisión**: Compromisos claros que permiten una selección informada.

## Protocolos de Emergencia

Si los agentes encuentran problemas:

1.  **Bloqueos en la Investigación**: Pasar a ejemplos similares disponibles.
2.  **Limitaciones de Contexto**: Centrarse en los patrones existentes más relevantes.
3.  **Restricciones de Tiempo**: Priorizar la implementación principal sobre los casos borde.
4.  **Conflictos de Recursos**: Asegurar que los agentes trabajen de forma independiente.
5.  **Problemas de Calidad**: Mantener los estándares mínimos de completitud del PRP.

Este enfoque paralelo maximiza la probabilidad de identificar la estrategia de implementación óptima al explorar múltiples enfoques arquitectónicos simultáneamente, permitiendo una selección basada en datos del mejor enfoque para tus requisitos específicos.