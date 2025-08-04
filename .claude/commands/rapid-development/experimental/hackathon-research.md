# Investigación Multi-Opción para Hackatón

Evalúa rápidamente múltiples enfoques de solución para desafíos de hackatón utilizando investigación paralela masiva (15 agentes concurrentes).

## Problema/Desafío: $ARGUMENTS

## Fase 1: Análisis del Problema y Generación de Opciones

### Desglose del Problema
Analiza el enunciado del desafío para:
- Requisitos y restricciones principales.
- Criterios de éxito y métricas de evaluación.
- Tiempo y recursos disponibles.
- Restricciones y preferencias técnicas.
- Usuarios objetivo y casos de uso.

### Generación de Enfoques de Solución

Genera 3 enfoques de solución distintos:

#### Opción A: Enfoque "Velocidad Primero" (Speed-First)
-   **Filosofía**: "Lanzar rápido, iterar después".
-   **Estrategia**: Aprovechar herramientas existentes, patrones probados, código personalizado mínimo.
-   **Objetivo**: Prototipo funcional en tiempo mínimo.
-   **Compromisos**: Puede sacrificar la innovación por la velocidad.

#### Opción B: Enfoque "Innovación Primero" (Innovation-First)
-   **Filosofía**: "Solución rompedora con un enfoque novedoso".
-   **Estrategia**: Tecnología de vanguardia, arquitectura única, resolución creativa de problemas.
-   **Objetivo**: Solución de alto impacto y diferenciada.
-   **Compromisos**: Mayor riesgo, tiempo de desarrollo potencialmente más largo.

#### Opción C: Enfoque Equilibrado (Balanced)
-   **Filosofía**: "Base sólida con innovación estratégica".
-   **Estrategia**: Base probada con mejoras modernas selectivas.
-   **Objetivo**: Solución fiable con ventajas competitivas.
-   **Compromisos**: Riesgo moderado, innovación moderada.

## Fase 2: Investigación Paralela Masiva (15 Agentes)

**CRÍTICO**: Ejecuta los 15 agentes de investigación simultáneamente utilizando múltiples llamadas a la herramienta Agente en una sola respuesta para una máxima eficiencia.

**ESTRUCTURA DE SALIDA**: Crea archivos separados para una revisión organizada de la investigación:
-   Salidas de agentes individuales: `PRPs/research/{opcion}-agent-{id}-{area}.md`
-   Análisis sintetizado de la opción: `PRPs/research/{opcion}-synthesized-output.md`
-   Recomendaciones finales: `PRPs/research/final-recommendations-analysis.md`

**IMPORTANTE**: Crea primero el directorio `PRPs/research/` si no existe.

### Matriz de Investigación: 5 Agentes × 3 Opciones

#### Agentes de Investigación de la Opción A (Velocidad Primero)

**Agente A1: Viabilidad Técnica (Velocidad Primero)**
```
Tarea: Análisis Técnico "Velocidad Primero"
Prompt: Analiza la viabilidad técnica para el enfoque "velocidad primero" de "$ARGUMENTS". Céntrate en:
- La pila tecnológica y los frameworks más rápidos posibles.
- Bibliotecas y herramientas existentes para aprovechar.
- Requisitos mínimos de desarrollo personalizado.
- Patrones y arquitecturas probadas.
- Opciones de despliegue y alojamiento rápidos.
- Estimación del tiempo hasta tener un prototipo funcional.

CRÍTICO: Guarda tu análisis completo directamente en: PRPs/research/speed-first-agent-a1-technical.md

Usa esta estructura de archivo:
# Agente A1: Viabilidad Técnica - Enfoque "Velocidad Primero"

## Foco de la Investigación
[Tu análisis del mandato de investigación de viabilidad técnica]

## Hallazgos Clave
[Hallazgos y recomendaciones detalladas de viabilidad técnica]

## Evaluación Cuantitativa
- Complejidad Técnica: [puntuación 1-10 con razonamiento]
- Confianza en la Implementación: [Alta/Media/Baja con justificación]
- Calificación de Velocidad: [puntuación 1-10 para la velocidad de desarrollo]
- Nivel de Riesgo: [puntuación 1-10 con los riesgos clave identificados]

## Pila Tecnológica Recomendada
[Recomendaciones tecnológicas específicas con versiones]

## Perspectivas Críticas
[Los descubrimientos técnicos más importantes que impactan la toma de decisiones]

## Recomendaciones de Implementación
[Guía técnica específica para la implementación "velocidad primero"]

## Estimaciones de Tiempo
[Estimaciones de cronograma detalladas para los hitos técnicos clave]

Tu tarea está COMPLETA cuando este archivo se guarde con una investigación técnica exhaustiva.
```

**Agente A2: Velocidad de Salida al Mercado (Velocidad Primero)**
```
Tarea: Estrategia de Desarrollo Rápido
Prompt: Investiga estrategias de desarrollo rápido para el enfoque "velocidad primero" de "$ARGUMENTS". Investiga:
- Definición del alcance del MVP y priorización de características.
- Metodologías de prototipado rápido.
- Oportunidades de integración sin código/bajo código.
- Componentes y plantillas pre-construidos.
- Estrategias de desarrollo paralelo.
- Atajos en las pruebas para el ritmo de un hackatón.

CRÍTICO: Guarda tu análisis completo directamente en: PRPs/research/speed-first-agent-a2-speed-to-market.md

Usa esta estructura de archivo:
# Agente A2: Velocidad de Salida al Mercado - Enfoque "Velocidad Primero"

## Foco de la Investigación
[Tu análisis del mandato de investigación de desarrollo rápido]

## Hallazgos Clave
[Hallazgos y estrategias detalladas de velocidad de salida al mercado]

## Evaluación Cuantitativa
- Puntuación de Velocidad de Desarrollo: [1-10 con razonamiento]
- Viabilidad del MVP: [Alta/Media/Baja con justificación]
- Tiempo hasta la Demo: [Estimaciones específicas en horas]
- Eficiencia Paralela: [puntuación 1-10 para la coordinación del equipo]

## Alcance y Priorización del MVP
[Desglose de características específicas con prioridades]

## Cronograma de Desarrollo
[Desglose hora por hora de las fases de desarrollo]

## Perspectivas Críticas
[Los descubrimientos de velocidad más importantes que impactan la toma de decisiones]

## Atajos de Implementación
[Técnicas y herramientas específicas de desarrollo rápido]

## Mitigación de Riesgos
[Riesgos del cronograma y estrategias de mitigación]

Tu tarea está COMPLETA cuando este archivo se guarde con una investigación exhaustiva sobre la velocidad de salida al mercado.
```

**Agente A3: Investigación de Mercado (Velocidad Primero)**
```
Tarea: Análisis de Mercado "Velocidad Primero"
Prompt: Investiga el panorama del mercado para el enfoque "velocidad primero" de "$ARGUMENTS". Investiga:
- Análisis competitivo de las soluciones existentes y su velocidad de salida al mercado.
- Demanda del mercado para un MVP rápido vs soluciones pulidas.
- Expectativas de los usuarios para las versiones iniciales del producto.
- Oportunidades de posicionamiento competitivo para soluciones de rápido movimiento.
- Ventajas del "timing" de mercado y de ser el primero en moverse.

CRÍTICO: Guarda tu análisis completo directamente en: PRPs/research/speed-first-agent-a3-market-research.md

Usa esta estructura de archivo:
# Agente A3: Investigación de Mercado - Enfoque "Velocidad Primero"

## Foco de la Investigación
[Tu análisis del mandato de investigación de mercado para el enfoque "velocidad primero"]

## Hallazgos Clave
[Análisis de mercado detallado y panorama competitivo]

## Evaluación Cuantitativa
- Puntuación de Oportunidad de Mercado: [1-10 con razonamiento]
- Ventaja Competitiva: [Alta/Media/Baja con justificación]
- Valor de la Velocidad de Salida al Mercado: [puntuación 1-10 para los beneficios del "timing"]
- Aceptación del Usuario: [puntuación 1-10 para la tolerancia al MVP]

## Análisis Competitivo
[Desglose de competidores específicos y oportunidades de posicionamiento]

## Estrategia de Posicionamiento de Mercado
[Posicionamiento recomendado para el enfoque "velocidad primero"]

## Perspectivas Críticas
[Los descubrimientos de mercado más importantes que impactan la toma de decisiones]

## Recomendaciones Estratégicas
[Estrategia de mercado específica para la implementación "velocidad primero"]

## Evaluación de Riesgos
[Riesgos de mercado y amenazas competitivas]

Tu tarea está COMPLETA cuando este archivo se guarde con una investigación de mercado exhaustiva.
```

**Agente A4: Investigación de Diseño (Velocidad Primero)**
```
Tarea: Análisis de Diseño "Velocidad Primero"
Prompt: Investiga el enfoque de diseño para la solución "velocidad primero" de "$ARGUMENTS". Investiga:
- Bibliotecas de componentes de UI y sistemas de diseño para un desarrollo rápido.
- Patrones de UX y diseños de interfaz probados para soluciones similares.
- Frameworks de dashboards y visualización de datos.
- Enfoques de diseño responsivo con mínimo esfuerzo.
- Estándares de accesibilidad que se puedan implementar rápidamente.

CRÍTICO: Guarda tu análisis completo directamente en: PRPs/research/speed-first-agent-a4-design-research.md

Usa esta estructura de archivo:
# Agente A4: Investigación de Diseño - Enfoque "Velocidad Primero"

## Foco de la Investigación
[Tu análisis del mandato de investigación de diseño para el enfoque "velocidad primero"]

## Hallazgos Clave
[Estrategia de diseño detallada y recomendaciones de UX]

## Evaluación Cuantitativa
- Puntuación de Complejidad del Diseño: [1-10 con razonamiento]
- Velocidad de Implementación: [Alta/Media/Baja con justificación]
- Calidad de la Biblioteca de Componentes: [puntuación 1-10 para los recursos disponibles]
- Puntuación de Experiencia de Usuario: [1-10 para la calidad de UX proyectada]

## Sistema de Diseño Recomendado
[Recomendaciones específicas de bibliotecas de UI y componentes]

## Patrones y Frameworks de UX
[Patrones probados y enfoques de diseño para aprovechar]

## Perspectivas Críticas
[Los descubrimientos de diseño más importantes que impactan la toma de decisiones]

## Estrategia de Implementación
[Enfoque de implementación de diseño específico para la velocidad]

## Accesibilidad y Responsividad
[Estándares de diseño mínimos viables e implementación rápida]

Tu tarea está COMPLETA cuando este archivo se guarde con una investigación de diseño exhaustiva.
```

**Agente A5: Investigación de Usuario (Velocidad Primero)**
```
Tarea: Investigación de Usuario "Velocidad Primero"
Prompt: Investiga las necesidades y el comportamiento del usuario para el enfoque "velocidad primero" de "$ARGUMENTS". Analiza:
- Personas de usuario principales y sus necesidades centrales.
- Viajes de usuario críticos que deben funcionar en el MVP.
- Puntos de dolor del usuario que el enfoque "velocidad primero" aborda.
- Expectativas del usuario y criterios de aceptación para las primeras versiones.
- Estrategias de recopilación de feedback e iteración para una mejora rápida.

CRÍTICO: Guarda tu análisis completo directamente en: PRPs/research/speed-first-agent-a5-user-research.md

Usa esta estructura de archivo:
# Agente A5: Investigación de Usuario - Enfoque "Velocidad Primero"

## Foco de la Investigación
[Tu análisis del mandato de investigación de usuario para el enfoque "velocidad primero"]

## Hallazgos Clave
[Perspectivas detalladas del usuario y análisis de personas]

## Evaluación Cuantitativa
- Alineación con la Necesidad del Usuario: [1-10 con razonamiento]
- Aceptación del MVP: [Alta/Media/Baja con justificación]
- Puntuación del Viaje Crítico: [1-10 para la calidad del flujo de usuario]
- Eficiencia del Bucle de Feedback: [1-10 para el potencial de iteración]

## Personas de Usuario Principales
[Personas de usuario específicas con necesidades y comportamientos centrales]

## Viajes de Usuario Críticos
[Flujos de usuario esenciales que deben funcionar en el MVP]

## Perspectivas Críticas
[Los descubrimientos de usuario más importantes que impactan la toma de decisiones]

## Estrategia de Validación del MVP
[Enfoque de pruebas de usuario y recopilación de feedback]

## Análisis de Puntos de Dolor
[Problemas del usuario y cómo el enfoque "velocidad primero" los aborda]

Tu tarea está COMPLETA cuando este archivo se guarde con una investigación de usuario exhaustiva.
```

#### Agentes de Investigación de la Opción B (Innovación Primero)

**Agente B1: Viabilidad Técnica (Innovación Primero)**
```
Tarea: Análisis Técnico "Innovación Primero"
Prompt: Analiza la viabilidad técnica para el enfoque "innovación primero" de "$ARGUMENTS". Céntrate en:
- Tecnologías y frameworks de vanguardia.
- Patrones y enfoques arquitectónicos novedosos.
- Herramientas experimentales y estándares emergentes.
- Oportunidades de diferenciación técnica únicas.
- Desafíos de implementación complejos.
- Compromisos entre innovación y tiempo de implementación.

CRÍTICO: Guarda tu análisis completo directamente en: PRPs/research/innovation-first-agent-b1-technical.md

Usa esta estructura de archivo:
# Agente B1: Viabilidad Técnica - Enfoque "Innovación Primero"

## Foco de la Investigación
[Tu análisis del mandato de investigación de viabilidad técnica para la innovación]

## Hallazgos Clave
[Oportunidades y desafíos técnicos detallados de la innovación]

## Evaluación Cuantitativa
- Puntuación de Innovación: [1-10 con razonamiento]
- Complejidad Técnica: [Alta/Media/Baja con justificación]
- Riesgo de Implementación: [puntuación 1-10 con factores de riesgo]
- Potencial de Diferenciación: [1-10 para la ventaja competitiva]

## Pila Tecnológica de Vanguardia
[Recomendaciones específicas de tecnología innovadora]

## Patrones de Arquitectura Novedosos
[Enfoques y paradigmas innovadores para explorar]

## Perspectivas Críticas
[Los descubrimientos de innovación más importantes que impactan la toma de decisiones]

## Estrategia de Implementación
[Enfoque para gestionar la complejidad de la innovación en el cronograma de un hackatón]

## Mitigación de Riesgos
[Estrategias para manejar los riesgos de la tecnología innovadora]

Tu tarea está COMPLETA cuando este archivo se guarde con una investigación técnica exhaustiva centrada en la innovación.
```

**Agente B2: Velocidad de Salida al Mercado (Innovación Primero)**
```
Tarea: Cronograma de Desarrollo de Innovación
Prompt: Investiga el cronograma de desarrollo para el enfoque "innovación primero" de "$ARGUMENTS". Investiga:
- Curva de aprendizaje para las nuevas tecnologías.
- Tiempo de experimentación y prueba de concepto.
- Desafíos de integración con enfoques novedosos.
- Brechas en la documentación y el soporte de la comunidad.
- Complejidad de la depuración y la resolución de problemas.

CRÍTICO: Guarda tu análisis completo directamente en: PRPs/research/innovation-first-agent-b2-speed-to-market.md

Usa esta estructura de archivo:
# Agente B2: Velocidad de Salida al Mercado - Enfoque "Innovación Primero"

## Foco de la Investigación
[Tu análisis de los desafíos y oportunidades del cronograma de innovación]

## Hallazgos Clave
[Análisis detallado del cronograma para el desarrollo innovador]

## Evaluación Cuantitativa
- Puntuación del Cronograma de Innovación: [1-10 con razonamiento]
- Impacto de la Curva de Aprendizaje: [Alto/Medio/Bajo con justificación]
- Tiempo de Experimentación: [Estimaciones específicas en horas]
- Disponibilidad de Soporte: [1-10 para la calidad de la comunidad/documentación]

## Fases de Desarrollo
[Fases específicas para la implementación de la innovación con estimaciones de tiempo]

## Plan de Aprendizaje y Experimentación
[Estrategia para gestionar la curva de aprendizaje de la innovación]

## Perspectivas Críticas
[Los descubrimientos de cronograma más importantes para el enfoque de innovación]

## Mitigación de Riesgos
[Riesgos del cronograma y estrategias de mitigación para la innovación]

Tu tarea está COMPLETA cuando este archivo se guarde con una investigación exhaustiva del cronograma de innovación.
```

**Agente B3: Investigación de Mercado (Innovación Primero)**
```
Tarea: Análisis de Mercado "Innovación Primero"
Prompt: Investiga el panorama del mercado para el enfoque "innovación primero" de "$ARGUMENTS". Investiga:
- Apetito del mercado por soluciones innovadoras y de vanguardia.
- Oportunidades de diferenciación competitiva a través de la innovación.
- Segmentos de "early adopters" y evangelistas tecnológicos.
- Ventajas competitivas impulsadas por la innovación.
- "Timing" de mercado para la adopción de tecnología disruptiva.

CRÍTICO: Guarda tu análisis completo directamente en: PRPs/research/innovation-first-agent-b3-market-research.md

Usa esta estructura de archivo:
# Agente B3: Investigación de Mercado - Enfoque "Innovación Primero"

## Foco de la Investigación
[Tu análisis de las oportunidades de mercado y posicionamiento de la innovación]

## Hallazgos Clave
[Análisis de mercado detallado para soluciones innovadoras]

## Evaluación Cuantitativa
- Puntuación de Mercado de Innovación: [1-10 con razonamiento]
- Potencial de Diferenciación: [Alto/Medio/Bajo con justificación]
- Alcance de "Early Adopters": [1-10 para el tamaño del mercado objetivo]
- Ventaja Competitiva: [1-10 para el posicionamiento de la innovación]

## Estrategia de Posicionamiento de Mercado
[Posicionamiento específico para el enfoque "innovación primero"]

## Análisis de "Early Adopters"
[Segmentos objetivo y su apetito por la innovación]

## Perspectivas Críticas
[Los descubrimientos de mercado más importantes para el enfoque de innovación]

## Recomendaciones Estratégicas
[Estrategia de mercado para la implementación "innovación primero"]

Tu tarea está COMPLETA cuando este archivo se guarde con una investigación de mercado exhaustiva sobre la innovación.
```

**Agente B4: Investigación de Diseño (Innovación Primero)**
```
Tarea: Análisis de Diseño "Innovación Primero"
Prompt: Investiga el enfoque de diseño para la solución "innovación primero" de "$ARGUMENTS". Investiga:
- Patrones de UI/UX de vanguardia y tendencias de diseño emergentes.
- Paradigmas de interacción avanzados e innovaciones de interfaz.
- Sistemas de diseño experimentales y enfoques de componentes.
- Patrones de experiencia de usuario novedosos y flujos de trabajo innovadores.
- Innovaciones en accesibilidad y prácticas de vanguardia en diseño inclusivo.

CRÍTICO: Guarda tu análisis completo directamente en: PRPs/research/innovation-first-agent-b4-design-research.md

Usa esta estructura de archivo:
# Agente B4: Investigación de Diseño - Enfoque "Innovación Primero"

## Foco de la Investigación
[Tu análisis de las oportunidades y enfoques de diseño innovadores]

## Hallazgos Clave
[Estrategia de diseño detallada e innovadora y UX disruptiva]

## Evaluación Cuantitativa
- Puntuación de Diseño de Innovación: [1-10 con razonamiento]
- Complejidad de Implementación: [Alta/Media/Baja con justificación]
- Innovación en la Experiencia de Usuario: [1-10 para el potencial disruptivo]
- Innovación en Accesibilidad: [1-10 para el avance en diseño inclusivo]

## Sistemas de Diseño de Vanguardia
[Frameworks y enfoques de diseño específicos e innovadores]

## Paradigmas de Interacción Novedosos
[Patrones de UX disruptivos e innovaciones de interfaz]

## Perspectivas Críticas
[Los descubrimientos de diseño más importantes para el enfoque de innovación]

## Estrategia de Implementación
[Enfoque para implementar un diseño innovador en el cronograma de un hackatón]

Tu tarea está COMPLETA cuando este archivo se guarde con una investigación de diseño exhaustiva sobre la innovación.
```

**Agente B5: Investigación de Usuario (Innovación Primero)**
```
Tarea: Investigación de Usuario "Innovación Primero"
Prompt: Investiga las necesidades y el comportamiento del usuario para el enfoque "innovación primero" de "$ARGUMENTS". Analiza:
- Personas de usuario avanzado y características de "early adopters".
- Flujos de trabajo de usuario avanzados y casos de uso sofisticados.
- Apetito del usuario por aprender nuevas interfaces innovadoras.
- Expectativas del usuario para funcionalidades de vanguardia.
- Patrones de adopción de la innovación y estrategias de educación del usuario.

CRÍTICO: Guarda tu análisis completo directamente en: PRPs/research/innovation-first-agent-b5-user-research.md

Usa esta estructura de archivo:
# Agente B5: Investigación de Usuario - Enfoque "Innovación Primero"

## Foco de la Investigación
[Tu análisis de los usuarios avanzados y los patrones de adopción de la innovación]

## Hallazgos Clave
[Perspectivas detalladas del usuario para soluciones centradas en la innovación]

## Evaluación Cuantitativa
- Ajuste de Usuario a la Innovación: [1-10 con razonamiento]
- Aceptación de la Curva de Aprendizaje: [Alta/Media/Baja con justificación]
- Demanda de Funciones Avanzadas: [1-10 para la funcionalidad sofisticada]
- Potencial de Adopción Temprana: [1-10 para la aceptación de la innovación]

## Personas de Usuario Avanzado
[Personas de usuario avanzado específicas y sus características]

## Patrones de Adopción de la Innovación
[Cómo los usuarios adoptan y aprenden interfaces innovadoras]

## Perspectivas Críticas
[Los descubrimientos de usuario más importantes para el enfoque de innovación]

## Estrategia de Educación del Usuario
[Enfoque para incorporar a los usuarios a las características innovadoras]

Tu tarea está COMPLETA cuando este archivo se guarde con una investigación de usuario exhaustiva sobre la innovación.
```

#### Agentes de Investigación de la Opción C (Equilibrado)

**Agente C1: Viabilidad Técnica (Equilibrado)**
```
Tarea: Análisis Técnico Equilibrado
Prompt: Analiza la viabilidad técnica para el enfoque equilibrado de "$ARGUMENTS". Céntrate en:
- Tecnologías maduras con mejoras modernas.
- Arquitecturas probadas con mejoras estratégicas.
- Adopción selectiva de herramientas emergentes.
- Equilibrio entre estabilidad e innovación.
- Complejidad de implementación práctica.
- Decisiones técnicas que tomen lo mejor de ambos mundos.

CRÍTICO: Guarda tu análisis completo directamente en: PRPs/research/balanced-agent-c1-technical.md

Usa esta estructura de archivo:
# Agente C1: Viabilidad Técnica - Enfoque Equilibrado

## Foco de la Investigación
[Tu análisis de la viabilidad técnica equilibrada y las decisiones estratégicas]

## Hallazgos Clave
[Estrategia técnica equilibrada detallada que combina estabilidad e innovación]

## Evaluación Cuantitativa
- Puntuación de Equilibrio Técnico: [1-10 con razonamiento]
- Estabilidad de la Implementación: [Alta/Media/Baja con justificación]
- Integración de la Innovación: [1-10 para el potencial de mejora estratégica]
- Gestión de la Complejidad: [1-10 para una complejidad manejable]

## Pila Tecnológica Equilibrada
[Recomendaciones tecnológicas específicas que equilibran lo probado y lo moderno]

## Áreas de Mejora Estratégica
[Áreas específicas para la innovación selectiva sobre una base estable]

## Perspectivas Críticas
[Los descubrimientos más importantes del enfoque equilibrado]

## Estrategia de Implementación
[Enfoque para una implementación técnica equilibrada]

Tu tarea está COMPLETA cuando este archivo se guarde con una investigación técnica equilibrada exhaustiva.
```

**Agente C2: Velocidad de Salida al Mercado (Equilibrado)**
```
Tarea: Estrategia de Desarrollo Equilibrada
Prompt: Investiga la estrategia de desarrollo para el enfoque equilibrado de "$ARGUMENTS". Investiga:
- Desarrollo por fases con victorias rápidas.
- Cronograma estratégico de adopción de tecnología.
- Priorización de la funcionalidad principal.
- Capas de innovación sobre una base estable.
- Oportunidades de desarrollo paralelo.

CRÍTICO: Guarda tu análisis completo directamente en: PRPs/research/balanced-agent-c2-speed-to-market.md

Usa esta estructura de archivo:
# Agente C2: Velocidad de Salida al Mercado - Enfoque Equilibrado

## Foco de la Investigación
[Tu análisis de la estrategia de desarrollo equilibrada y el enfoque por fases]

## Hallazgos Clave
[Cronograma de desarrollo equilibrado detallado y estrategia de hitos]

## Evaluación Cuantitativa
- Puntuación de Equilibrio de Desarrollo: [1-10 con razonamiento]
- Eficiencia de la Entrega por Fases: [Alta/Media/Baja con justificación]
- Potencial de Victoria Rápida: [1-10 para la entrega de valor temprana]
- Cronograma Estratégico: [1-10 para una progresión equilibrada]

## Plan de Desarrollo por Fases
[Fases específicas que equilibran velocidad y calidad]

## Adopción Estratégica de Tecnología
[Cronograma para introducir innovaciones sobre una base estable]

## Perspectivas Críticas
[Los descubrimientos de desarrollo equilibrado más importantes]

## Estrategia de Implementación
[Enfoque para la ejecución equilibrada de la velocidad de salida al mercado]

Tu tarea está COMPLETA cuando este archivo se guarde con una investigación de desarrollo equilibrada exhaustiva.
```

**Agente C3: Investigación de Mercado (Equilibrado)**
```
Tarea: Análisis de Mercado Equilibrado
Prompt: Investiga el panorama del mercado para el enfoque equilibrado de "$ARGUMENTS". Investiga:
- Segmentos de mercado que valoran tanto la innovación como la fiabilidad.
- Posicionamiento competitivo entre los que se mueven rápido y los innovadores.
- Preferencias de los clientes por soluciones probadas vs. de vanguardia.
- "Timing" de mercado para lanzamientos de características equilibradas.
- Ventajas competitivas sostenibles a través de la innovación estratégica.

CRÍTICO: Guarda tu análisis completo directamente en: PRPs/research/balanced-agent-c3-market-research.md

Usa esta estructura de archivo:
# Agente C3: Investigación de Mercado - Enfoque Equilibrado

## Foco de la Investigación
[Tu análisis del posicionamiento de mercado equilibrado y las oportunidades del mercado medio]

## Hallazgos Clave
[Análisis de mercado detallado para soluciones equilibradas]

## Evaluación Cuantitativa
- Puntuación de Equilibrio de Mercado: [1-10 con razonamiento]
- Posicionamiento Competitivo: [Alto/Medio/Bajo con justificación]
- Ajuste a la Preferencia del Cliente: [1-10 para el atractivo de la solución equilibrada]
- Ventaja Sostenible: [1-10 para la posición competitiva a largo plazo]

## Estrategia de Posicionamiento de Mercado
[Posicionamiento específico para el enfoque equilibrado]

## Análisis del Segmento de Clientes
[Segmentos objetivo que valoran el equilibrio entre innovación y fiabilidad]

## Perspectivas Críticas
[Los descubrimientos de mercado equilibrado más importantes]

## Recomendaciones Estratégicas
[Estrategia de mercado para una implementación equilibrada]

Tu tarea está COMPLETA cuando este archivo se guarde con una investigación de mercado equilibrada exhaustiva.
```

**Agente C4: Investigación de Diseño (Equilibrado)**
```
Tarea: Análisis de Diseño Equilibrado
Prompt: Investiga el enfoque de diseño para la solución equilibrada de "$ARGUMENTS". Investiga:
- Sistemas de diseño probados con mejoras modernas.
- Patrones de interfaz de usuario que equilibran la familiaridad con la innovación.
- Estrategias de mejora progresiva para sistemas de diseño.
- Estándares de accesibilidad con características avanzadas estratégicas.
- Vías de escalabilidad y evolución del diseño.

CRÍTICO: Guarda tu análisis completo directamente en: PRPs/research/balanced-agent-c4-design-research.md

Usa esta estructura de archivo:
# Agente C4: Investigación de Diseño - Enfoque Equilibrado

## Foco de la Investigación
[Tu análisis de la estrategia de diseño equilibrada y la mejora progresiva]

## Hallazgos Clave
[Estrategia de diseño equilibrada detallada que combina patrones probados con innovación estratégica]

## Evaluación Cuantitativa
- Puntuación de Equilibrio de Diseño: [1-10 con razonamiento]
- Mejora Progresiva: [Alta/Media/Baja con justificación]
- Familiaridad del Usuario: [1-10 para el reconocimiento de patrones y la facilidad]
- Integración de la Innovación: [1-10 para el avance estratégico del diseño]

## Sistema de Diseño Equilibrado
[Recomendaciones de diseño específicas que equilibran lo familiar y lo innovador]

## Estrategia de Mejora Progresiva
[Enfoque para evolucionar el diseño de lo probado a lo innovador]

## Perspectivas Críticas
[Los descubrimientos de diseño equilibrado más importantes]

## Estrategia de Implementación
[Enfoque para una implementación de diseño equilibrada]

Tu tarea está COMPLETA cuando este archivo se guarde con una investigación de diseño equilibrada exhaustiva.
```

**Agente C5: Investigación de Usuario (Equilibrado)**
```
Tarea: Investigación de Usuario Equilibrada
Prompt: Investiga las necesidades y el comportamiento del usuario para el enfoque equilibrado de "$ARGUMENTS". Analiza:
- Personas de usuario "mainstream" con diferentes niveles de comodidad técnica.
- Viajes de usuario principales con características avanzadas opcionales.
- Preferencias del usuario por patrones familiares vs. nuevas capacidades.
- Estrategias de adopción para la introducción gradual de características.
- Bucles de feedback del usuario para la mejora iterativa.

CRÍTICO: Guarda tu análisis completo directamente en: PRPs/research/balanced-agent-c5-user-research.md

Usa esta estructura de archivo:
# Agente C5: Investigación de Usuario - Enfoque Equilibrado

## Foco de la Investigación
[Tu análisis de los usuarios "mainstream" y la adopción de características equilibradas]

## Hallazgos Clave
[Perspectivas detalladas del usuario para soluciones equilibradas que atraen a una amplia audiencia]

## Evaluación Cuantitativa
- Puntuación de Equilibrio de Usuario: [1-10 con razonamiento]
- Atractivo "Mainstream": [Alto/Medio/Bajo con justificación]
- Comodidad en la Adopción de Características: [1-10 para la aceptación de mejoras graduales]
- Potencial de Crecimiento: [1-10 para la oportunidad de expansión de la base de usuarios]

## Personas de Usuario "Mainstream"
[Personas específicas con diferentes niveles de comodidad y necesidades]

## Estrategia de Viaje de Usuario Equilibrada
[Viajes principales con características avanzadas opcionales]

## Perspectivas Críticas
[Los descubrimientos de usuario equilibrado más importantes]

## Estrategia de Adopción
[Enfoque para la introducción gradual de características y la educación del usuario]

Tu tarea está COMPLETA cuando este archivo se guarde con una investigación de usuario equilibrada exhaustiva.
```

## Fase 3: Validación y Síntesis de Archivos

### Validar Creación de Archivos de Agentes
Después de que los 15 agentes completen, verifica que todos los archivos esperados existan:
```bash
# Validar archivos "Velocidad Primero" (deberían ser 5)
ls PRPs/research/speed-first-agent-*.md | wc -l

# Validar archivos "Innovación Primero" (deberían ser 5)
ls PRPs/research/innovation-first-agent-*.md | wc -l

# Validar archivos "Equilibrado" (deberían ser 5)
ls PRPs/research/balanced-agent-*.md | wc -l

# El total debería ser 15 archivos
ls PRPs/research/*-agent-*.md | wc -l
```

Si falta algún archivo, identifica qué agentes fallaron y pueden necesitar una re-ejecución.

### Crear Archivos de Análisis Sintetizado

Después de confirmar que los 15 archivos de agentes existen, crea un análisis completo de las opciones leyendo los archivos de los agentes:

#### Síntesis de la Opción "Velocidad Primero"
Crea el archivo: `PRPs/research/speed-first-synthesized-output.md`
```markdown
# Enfoque "Velocidad Primero" - Análisis Completo

## Resumen de la Investigación de los Agentes
- **Viabilidad Técnica** (Agente A1): [Resumen del archivo + puntuación de confianza 1-10]
- **Velocidad de Salida al Mercado** (Agente A2): [Resumen del archivo + evaluación del cronograma]
- **Investigación de Mercado** (Agente A3): [Resumen del archivo + posicionamiento en el mercado]
- **Investigación de Diseño** (Agente A4): [Resumen del archivo + estrategia de diseño]
- **Investigación de Usuario** (Agente A5): [Resumen del archivo + perspectivas del usuario]

## Puntuación Cuantitativa
- Velocidad de Desarrollo: [Puntuación 1-10] × 35% = [Puntuación Ponderada]
- Viabilidad Técnica: [Puntuación 1-10] × 25% = [Puntuación Ponderada]
- Innovación/Impacto: [Puntuación 1-10] × 20% = [Puntuación Ponderada]
- Posicionamiento en el Mercado: [Puntuación 1-10] × 15% = [Puntuación Ponderada]
- Ajuste al Usuario: [Puntuación 1-10] × 5% = [Puntuación Ponderada]
- **Puntuación Total**: [Suma de las puntuaciones ponderadas]

## Fortalezas y Debilidades
**Fortalezas:**
- [Ventajas clave de toda la investigación de los agentes]
- [Diferenciadores competitivos]
- [Ventajas de equipo y recursos]

**Debilidades:**
- [Limitaciones críticas identificadas]
- [Factores de riesgo de todos los agentes]
- [Desafíos de recursos o capacidades]

## Confianza en la Implementación
- Confianza general: [Alta/Media/Baja]
- Factores clave de éxito: [De todas las entradas de los agentes]
- Puntos potenciales de fallo: [Evaluación de riesgos combinada]

## Estrategia de Implementación
[Enfoque de alto nivel basado en los hallazgos de los 5 agentes]
```

#### Síntesis de la Opción "Innovación Primero"
Crea el archivo: `PRPs/research/innovation-first-synthesized-output.md`
[Misma estructura que arriba, centrado en el enfoque de innovación]

#### Síntesis de la Opción "Equilibrado"
Crea el archivo: `PRPs/research/balanced-synthesized-output.md`
[Misma estructura que arriba, centrado en el enfoque equilibrado]

## Fase 4: Análisis Comparativo Final y Recomendaciones

### Crear Archivo de Recomendaciones Finales

Después de que todos los archivos de síntesis de opciones estén completos, crea el análisis final completo:

Crea el archivo: `PRPs/research/final-recommendations-analysis.md`
```markdown
# Recomendaciones Finales de la Investigación para el Hackatón

## Resumen Ejecutivo
**Ganador**: [Nombre de la opción ganadora]
**Justificación Clave**: [Resumen de 2-3 frases de por qué ganó esta opción]
**Confianza en la Implementación**: [Alta/Media/Baja]

## Re-enunciado del Problema
[Breve re-enunciado del desafío original y las restricciones]

## Matriz de Comparación de Opciones
| Criterio | Velocidad Primero | Innovación Primero | Equilibrado | Peso |
|---|---|---|---|---|
| Velocidad de Desarrollo | [puntuación] | [puntuación] | [puntuación] | 35% |
| Viabilidad Técnica | [puntuación] | [puntuación] | [puntuación] | 25% |
| Innovación/Impacto | [puntuación] | [puntuación] | [puntuación] | 20% |
| Posicionamiento en el Mercado | [puntuación] | [puntuación] | [puntuación] | 15% |
| Ajuste al Usuario | [puntuación] | [puntuación] | [puntuación] | 5% |
| **Puntuación Total** | **[X.X]** | **[X.X]** | **[X.X]** | 100% |

## Análisis Detallado de las Opciones

### Enfoque "Velocidad Primero"
**Referencia**: [Enlace a speed-first-synthesized-output.md]
**Puntuación General**: [X.X/10]
**Fortalezas Clave**: [Las 3 principales de la síntesis]
**Debilidades Clave**: [Las 3 principales de la síntesis]
**Mejor para**: [Condiciones donde esta opción sería óptima]

### Enfoque "Innovación Primero"
**Referencia**: [Enlace a innovation-first-synthesized-output.md]
**Puntuación General**: [X.X/10]
**Fortalezas Clave**: [Las 3 principales de la síntesis]
**Debilidades Clave**: [Las 3 principales de la síntesis]
**Mejor para**: [Condiciones donde esta opción sería óptima]

### Enfoque Equilibrado
**Referencia**: [Enlace a balanced-synthesized-output.md]
**Puntuación General**: [X.X/10]
**Fortalezas Clave**: [Las 3 principales de la síntesis]
**Debilidades Clave**: [Las 3 principales de la síntesis]
**Mejor para**: [Condiciones donde esta opción sería óptima]

## Selección del Ganador y Justificación

### Recomendación Principal: [Opción Ganadora]
**Puntuación**: [X.X/10]
**Nivel de Confianza**: [Alto/Medio/Bajo]

**Por qué ganó esta opción**:
1. [Razón principal basada en la puntuación]
2. [Razón secundaria basada en el ajuste al equipo/contexto]
3. [Razón terciaria basada en el riesgo/oportunidad]

**Factores Críticos de Éxito**:
- [Factor 1 de la investigación de la opción ganadora]
- [Factor 2 de la investigación de la opción ganadora]
- [Factor 3 de la investigación de la opción ganadora]

### Segundo Lugar: [Opción en Segundo Lugar]
**Puntuación**: [X.X/10]
**Criterios de Cambio**: [Condiciones que harían preferible esta opción]

### Plan de Contingencia: [Opción en Tercer Lugar]
**Activador**: [Condiciones que requieren recurrir a esta opción]
**Cronograma**: [Cuándo se debe tomar la decisión de cambiar]

## Hoja de Ruta de Implementación para el Ganador

[Incluir el plan de implementación detallado del archivo de síntesis de la opción ganadora]

### Cronograma Hora por Hora
[Cronograma específico basado en la investigación de la opción ganadora]

### Arquitectura Técnica
[Decisiones de arquitectura basadas en la investigación técnica de la opción ganadora]

### Estrategia de Coordinación del Equipo
[Enfoque de equipo basado en la investigación de mercado/usuario de la opción ganadora]

## Evaluación de Riesgos y Mitigación

### Riesgos de Alta Prioridad
**Riesgo 1**: [Del análisis de la opción ganadora]
- **Probabilidad**: [Alta/Media/Baja]
- **Impacto**: [Alto/Medio/Bajo]
- **Mitigación**: [Estrategia de la investigación]
- **Señales de Alerta Temprana**: [Indicadores a observar]

**Riesgo 2**: [Continuar el patrón]

### Puntos de Control de Decisión
- **Hora 6**: [Criterios de "go/no-go" para continuar con el ganador]
- **Hora 12**: [Evaluación de pivote - cambiar al segundo lugar si es necesario]
- **Hora 18**: [Decisiones de recorte de características para asegurar la finalización]
- **Hora 22**: [Evaluación de la preparación para la demo]

## Métricas de Éxito y Validación

### Criterios de Éxito de la Demo
- [Funcionalidad específica que debe funcionar]
- [Benchmarks de rendimiento a alcanzar]
- [Estándares de experiencia de usuario a cumplir]

### Alineación con los Criterios de Evaluación
- [Cómo el ganador se alinea con los criterios de evaluación del hackatón]
- [Ventajas competitivas para la presentación]
- [Historia de innovación para los jueces]

## Referencias de Archivos
- Investigación "Velocidad Primero": [Listar todos los archivos de los agentes]
- Investigación "Innovación Primero": [Listar todos los archivos de los agentes]
- Investigación "Equilibrado": [Listar todos los archivos de los agentes]
- Archivos de Síntesis: [Listar todos los archivos de síntesis]
```

### Resumen Final de la Estructura de Archivos
```
PRPs/research/
├── Investigación de Agentes Individuales (15 archivos):
│   ├── speed-first-agent-a1-technical.md
│   ├── speed-first-agent-a2-speed-to-market.md
│   ├── ... (13 archivos de agentes más)
├── Síntesis de Opciones (3 archivos):
│   ├── speed-first-synthesized-output.md
│   ├── innovation-first-synthesized-output.md
│   └── balanced-synthesized-output.md
└── Análisis Final (1 archivo):
    └── final-recommendations-analysis.md
```

### Marco de Puntuación (Optimizado para Hackatón)

#### Criterios de Puntuación Ponderada
```yaml
Velocidad de Desarrollo: 35%      # Crítico para el cronograma del hackatón
Viabilidad Técnica: 25%  # Debe ser alcanzable
Innovación/Impacto: 20%      # Ventaja competitiva
Posicionamiento en el Mercado: 15%     # Ventaja estratégica y diferenciación
Ajuste al Usuario: 5%               # Alineación con la necesidad del usuario y potencial de adopción
```

## Fase 5: Puertas de Calidad y Preparación para la Ejecución

### Lista de Verificación de la Completitud de la Investigación
Antes de proceder a la implementación:
- [ ] Los 15 archivos de agentes individuales creados y guardados.
- [ ] Los 3 archivos de síntesis de opciones completados.
- [ ] Archivo de análisis de recomendaciones finales creado.
- [ ] Ganador claro identificado con justificación cuantitativa.
- [ ] Hoja de ruta de implementación detallada y accionable.

### Validación de la Estructura de Archivos
Verifica que todos los archivos se creen en la estructura correcta:
```
PRPs/research/
├── speed-first-agent-a1-technical.md
├── speed-first-agent-a2-speed-to-market.md
├── speed-first-agent-a3-market-research.md
├── speed-first-agent-a4-design-research.md
├── speed-first-agent-a5-user-research.md
├── innovation-first-agent-b1-technical.md
├── innovation-first-agent-b2-speed-to-market.md
├── innovation-first-agent-b3-market-research.md
├── innovation-first-agent-b4-design-research.md
├── innovation-first-agent-b5-user-research.md
├── balanced-agent-c1-technical.md
├── balanced-agent-c2-speed-to-market.md
├── balanced-agent-c3-market-research.md
├── balanced-agent-c4-design-research.md
├── balanced-agent-c5-user-research.md
├── speed-first-synthesized-output.md
├── innovation-first-synthesized-output.md
├── balanced-synthesized-output.md
└── final-recommendations-analysis.md
```

### Entrega para la Implementación
El archivo de recomendaciones finales debe contener:
- [ ] Ganador claro con hoja de ruta de implementación.
- [ ] Cronograma de desarrollo hora por hora.
- [ ] Especificaciones de la arquitectura técnica.
- [ ] Estrategias de mitigación de riesgos.
- [ ] Puntos de control de decisión y criterios de pivote.
- [ ] Métricas de éxito y criterios de la demo.

### Criterios de Éxito de la Ejecución
- [ ] **19 Archivos Totales Creados**: 15 de investigación de agentes individuales + 3 de síntesis + 1 de recomendaciones finales.
- [ ] **Decisión Cuantitativa**: Ganador seleccionado basado en puntuación ponderada, no en intuición.
- [ ] **Listo para Implementar**: Hoja de ruta detallada con cronograma hora por hora y tareas específicas.
- [ ] **Consciente del Riesgo**: Planes de contingencia y puntos de control de decisión definidos.
- [ ] **Equipo Alineado**: Roles, responsabilidades y estrategia de coordinación claros.

---

**Recuerda**: Este sistema mejorado proporciona una visibilidad granular de cada componente de la investigación, manteniendo al mismo tiempo un análisis completo y recomendaciones accionables. El enfoque de archivos estructurados permite la revisión independiente de la calidad de la investigación y facilita la toma de decisiones del equipo a través de un análisis transparente y basado en datos.
