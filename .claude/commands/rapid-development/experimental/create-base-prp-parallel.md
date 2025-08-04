# Crear PRP BASE con Investigación Paralela

## Funcionalidad: $ARGUMENTS

Genera un PRP completo utilizando agentes de investigación paralelos para una máxima eficiencia y profundidad en la recopilación de contexto. Este comando aprovecha múltiples agentes de IA que trabajan simultáneamente para investigar diferentes aspectos de la funcionalidad, asegurando que se pase un contexto completo para permitir la autovalidación y el refinamiento iterativo.

## Fase de Investigación Paralela

**IMPORTANTE**: Ejecuta los siguientes 4 agentes de investigación simultáneamente utilizando múltiples llamadas a la herramienta Agente en una sola respuesta para maximizar la eficiencia de la investigación.

### Coordinación de Agentes de Investigación

Lanza estos agentes de forma concurrente - no esperes a que uno termine para empezar el siguiente:

#### Agente 1: Análisis de Patrones de la Base de Código
```
Tarea: Investigación de Contexto de la Base de Código
Prompt: Analiza la base de código en busca de patrones relevantes para "$ARGUMENTS". Investiga e identifica:
- Funcionalidades/patrones similares ya implementados en la base de código.
- Archivos que contengan ejemplos o patrones relevantes para referenciar.
- Convenciones existentes, patrones arquitectónicos y estilos de código a seguir.
- Patrones de prueba y enfoques de validación utilizados en funcionalidades similares.
- Puntos de integración y dependencias a considerar.
- Patrones de estructura y organización de archivos para replicar.

Céntrate solo en la exploración de la base de código - no escribas código. Usa las herramientas Glob, Grep y Read extensivamente. Devuelve un análisis completo de los patrones existentes con rutas de archivo específicas y ejemplos de código para referenciar en el PRP.
```

#### Agente 2: Investigación Técnica Externa
```
Tarea: Investigación Técnica Externa
Prompt: Investiga recursos técnicos externos para "$ARGUMENTS". Investiga:
- Documentación de bibliotecas y referencias de API (incluye URLs específicas).
- Ejemplos de implementación de GitHub, StackOverflow y blogs técnicos.
- Mejores prácticas y patrones arquitectónicos para funcionalidades similares.
- Errores comunes, problemas conocidos (gotchas) y soluciones.
- Consideraciones de rendimiento y técnicas de optimización.
- Consideraciones de seguridad y patrones de vulnerabilidad.

Céntrate puramente en la investigación - no escribas código. Usa la búsqueda web extensivamente. Devuelve una investigación técnica completa con URLs específicas, ejemplos de código y guía de implementación.
```

#### Agente 3: Estrategia de Pruebas y Validación
```
Tarea: Investigación de Estrategia de Pruebas
Prompt: Investiga enfoques de pruebas y validación para "$ARGUMENTS". Analiza:
- Patrones de prueba utilizados en la base de código actual.
- Estrategias y frameworks de pruebas unitarias.
- Enfoques de pruebas de integración.
- Puertas de validación y controles de calidad.
- Patrones de manejo de errores y casos borde.
- Consideraciones sobre pruebas de rendimiento.

Solo investigación - sin implementación de pruebas. Usa análisis de la base de código y búsqueda web. Devuelve una estrategia de pruebas detallada con patrones específicos a seguir y comandos de validación para incluir en el PRP.
```

#### Agente 4: Investigación de Documentación y Contexto
```
Tarea: Investigación de Contexto de Documentación
Prompt: Investiga recursos de documentación y contexto para "$ARGUMENTS". Recopila:
- Revisa `PRPs/ai_docs/` en busca de archivos de documentación relevantes.
- Ejemplos de configuración y patrones de instalación.
- Requisitos de entorno y dependencias.
- Problemas conocidos y soluciones documentadas.
- Documentación y ejemplos de funcionalidades relacionadas.
- Guías de usuario y notas de implementación.

Solo enfoque en investigación. Usa la herramienta Read para examinar el directorio `ai_docs`. Devuelve contexto de la documentación con referencias a archivos específicos y ejemplos de configuración para incluir en el PRP.
```

## Síntesis de la Investigación y Generación del PRP

Una vez que todos los agentes completen su investigación, sintetiza los hallazgos y genera un PRP completo utilizando la estructura de la plantilla base:

### Integración de la Plantilla PRP

Usando `PRPs/templates/prp_base.md` como base, integra los hallazgos de la investigación:

#### Integración de Contexto Crítico
De los agentes de investigación, incluye:
-   **Patrones de la Base de Código**: Rutas de archivo específicas y ejemplos de código del Agente 1.
-   **Documentación Técnica**: URLs y secciones específicas del Agente 2.
-   **Estrategias de Pruebas**: Enfoques y patrones de validación del Agente 3.
-   **Documentación del Proyecto**: `ai_docs` relevantes y configuración del Agente 4.

#### Mejora del Plan de Implementación
-   Comienza con pseudocódigo informado por los patrones existentes.
-   Referencia archivos y patrones reales descubiertos en la investigación.
-   Incluye estrategias de manejo de errores de implementaciones similares.
-   Enumera las tareas en orden de finalización según el análisis de la base de código.

#### Puertas de Validación Ricas en Contexto
```bash
# Sintaxis/Estilo (del análisis de la base de código)
uv run ruff check . --fix
uv run mypy .

# Pruebas Unitarias (siguiendo patrones existentes)
uv run pytest tests/ -v

# Pruebas de Integración (si aplica)
[comandos específicos encontrados en la base de código]
```

### Proceso de Generación de PRP

1.  **Ensamblaje de Contexto**: Combina todos los hallazgos de la investigación en un contexto completo.
2.  **Definición del Objetivo**: Estado final claro y específico basado en los conocimientos de la investigación.
3.  **Estrategia de Implementación**: Enfoque paso a paso utilizando los patrones descubiertos.
4.  **Marco de Validación**: Pruebas ejecutables y puertas de calidad.
5.  **Planificación de la Integración**: Puntos de conexión con los sistemas existentes.

### Secciones Requeridas del PRP

Genera un PRP completo que incluya:

```yaml
## Objetivo
[Resultado específico y medible basado en la investigación]

## Por qué
- Valor de negocio e impacto para el usuario.
- Integración con funcionalidades existentes (del análisis de la base de código).
- Problemas que esto resuelve y para quién.

## Qué
[Comportamiento visible para el usuario y requisitos técnicos]

## Todo el Contexto Necesario
### Documentación y Referencias
- url: [URLs específicas de la investigación externa]
- file: [Rutas de archivo específicas del análisis de la base de código]
- docfile: [Archivos relevantes de PRPs/ai_docs/]

### Contexto Actual de la Base de Código
[Estructura de árbol y archivos relevantes]

### Patrones de Implementación
[Patrones específicos a seguir del análisis de la base de código]

### Problemas Conocidos (Gotchas)
[Peculiaridades y advertencias de bibliotecas de la investigación]

## Plan de Implementación
### Modelos de Datos y Estructura
[Modelos con seguridad de tipos que siguen los patrones existentes]

### Lista de Tareas
[Tareas ordenadas según el análisis de dependencias]

### Pseudocódigo
[Enfoque de implementación con detalles críticos]

### Puntos de Integración
[Base de datos, configuración, rutas basadas en patrones existentes]

## Bucle de Validación
### Nivel 1: Sintaxis y Estilo
[Comandos específicos de esta base de código]

### Nivel 2: Pruebas Unitarias
[Patrones de prueba del análisis de la base de código]

### Nivel 3: Pruebas de Integración
[Enfoque de validación de extremo a extremo]

## Lista de Verificación de Validación Final
[Puertas de calidad completas]
```

## Garantía de Calidad

Antes de finalizar el PRP, asegúrate de:

### Calidad de la Investigación
- [ ] Los 4 agentes de investigación completaron con éxito.
- [ ] Patrones de la base de código analizados a fondo.
- [ ] Documentación externa referenciada correctamente.
- [ ] Estrategias de prueba alineadas con los patrones existentes.
- [ ] Contexto de la documentación completo.

### Calidad del PRP
- [ ] Todo el contexto necesario de la investigación incluido.
- [ ] Las puertas de validación son ejecutables y específicas.
- [ ] Referencia a patrones y convenciones existentes.
- [ ] Ruta de implementación clara con dependencias.
- [ ] Manejo de errores documentado con ejemplos.
- [ ] Puntos de integración claramente definidos.

### Completitud del Contexto
- [ ] Rutas de archivo y ejemplos específicos incluidos.
- [ ] URLs con secciones relevantes especificadas.
- [ ] Versiones de bibliotecas y dependencias anotadas.
- [ ] Ejemplos de configuración proporcionados.
- [ ] Problemas conocidos y soluciones documentadas.

## Resultado

Guarda el PRP completo como: `PRPs/{nombre-de-la-funcionalidad}-parallel.md`

## Métricas de Éxito

Califica el PRP en una escala de 1 a 10 para:
-   **Riqueza del Contexto**: Cuánto contexto relevante se incluye.
-   **Claridad de la Implementación**: Cuán clara es la ruta de implementación.
-   **Completitud de la Validación**: Cuán completa es la estrategia de pruebas.
-   **Probabilidad de Éxito en un Solo Intento**: Nivel de confianza para una implementación exitosa.

Objetivo: 8+ en todas las métricas a través de la profundidad de la investigación paralela.

## Eficiencia de Tiempo

Este enfoque paralelo reduce el tiempo de creación del PRP en:
-   **Investigación 4 veces más rápida**: Agentes paralelos vs secuenciales.
-   **Mejor contexto**: Múltiples perspectivas simultáneamente.
-   **Reducción de iteraciones**: Investigación inicial completa.
-   **Mayor tasa de éxito**: Preparación más exhaustiva.

Recuerda: El objetivo es el éxito de la implementación en un solo intento a través de una investigación paralela completa y la recopilación de contexto.
