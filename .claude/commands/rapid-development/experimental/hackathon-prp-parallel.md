---
command: hackathon-prp-parallel
description: Genera y ejecuta una implementación de hackatón usando agentes paralelos masivos para máxima velocidad
arguments:
  - name: challenge
    description: El desafío del hackatón o la historia de usuario a implementar
---

# Flujo de Trabajo Paralelo de PRP para Hackatón - Edición de Máxima Velocidad

Ejecuta un flujo de trabajo paralelo masivo que aprovecha múltiples agentes de IA trabajando simultáneamente para entregar una solución completa en tiempo récord.

## Resumen

Este flujo de trabajo despliega más de 20 agentes paralelos:
- 5 agentes para la generación de especificaciones (diferentes perspectivas)
- 5 agentes para la creación del plan de prompts
- 5 agentes para la implementación del backend
- 5 agentes para la implementación del frontend
- 2 agentes para la integración y preparación de la demo

Todos los agentes trabajan de forma concurrente e informan los resultados para su síntesis.

## Paso 1: Generación de Especificaciones en Paralelo (5 minutos)

Despliega 5 agentes paralelos para analizar el desafío desde diferentes ángulos:

```
Usa la herramienta Tarea para ejecutar estos 5 agentes de investigación en PARALELO para el desafío: $ARGUMENTS

Tarea 1 - Agente de Arquitectura Técnica:
"Analiza {{challenge}} y crea una especificación de arquitectura técnica:
- Diseño del sistema y componentes
- Elecciones tecnológicas y justificación
- Patrones de diseño de API
- Diseño del esquema de la base de datos
- Consideraciones de rendimiento
- Arquitectura de seguridad
Guardar en: PRPs/specs/{{challenge|slugify}}-tech-spec.md"

Tarea 2 - Agente de Experiencia de Usuario:
"Analiza {{challenge}} desde la perspectiva de UX:
- Viajes y flujos de usuario
- Requisitos de componentes de UI
- Patrones de interacción
- Requisitos de accesibilidad
- UX para el manejo de errores
- Estados de carga y retroalimentación
Guardar en: PRPs/specs/{{challenge|slugify}}-ux-spec.md"

Tarea 3 - Agente de Lógica de Negocio:
"Define las reglas de negocio y la lógica para {{challenge}}:
- Reglas de negocio principales
- Requisitos de validación
- Casos borde y excepciones
- Reglas de integridad de datos
- Flujos de procesos de negocio
- Requisitos de integración
Guardar en: PRPs/specs/{{challenge|slugify}}-business-spec.md"

Tarea 4 - Agente de Estrategia de Pruebas:
"Crea una estrategia de pruebas completa:
- Escenarios y casos de prueba
- Requisitos de pruebas de rendimiento
- Casos de prueba de seguridad
- Enfoque de pruebas de integración
- Escenarios de prueba para la demo
- Objetivos de cobertura
Guardar en: PRPs/specs/{{challenge|slugify}}-test-spec.md"

Tarea 5 - Agente de Impacto de la Demo:
"Analiza para obtener el máximo impacto en la demo:
- Características clave a destacar
- Factores "wow" a implementar
- Métricas a mostrar
- Narrativa de la historia
- Planes de respaldo
- Asignaciones de tiempo
Guardar en: PRPs/specs/{{challenge|slugify}}-demo-spec.md"

Sintetiza todas las especificaciones en: PRPs/specs/{{challenge|slugify}}-unified-spec.md
```

## Paso 2: Generación de Plan de Prompts en Paralelo (5 minutos)

Mientras se generan las especificaciones, despliega 5 agentes más para crear planes de ejecución:

```
Usa la herramienta Tarea para ejecutar estos 5 agentes de planificación en PARALELO:

Tarea 6 - Agente de Plan de Backend:
"Crea prompts detallados para la implementación del backend:
- Prompts para la creación de entidades
- Prompts para la capa de servicio
- Prompts para los endpoints de la API
- Prompts de pruebas
- Prompts de integración
Incluye patrones de código y comandos exactos.
Guardar en: PRPs/plans/{{challenge|slugify}}-backend-plan.md"

Tarea 7 - Agente de Plan de Frontend:
"Crea prompts detallados para la implementación del frontend:
- Prompts para la creación de componentes
- Prompts para la gestión del estado
- Prompts para el manejo de formularios
- Prompts para la integración de la API
- Prompts de pruebas
Incluye patrones de código exactos.
Guardar en: PRPs/plans/{{challenge|slugify}}-frontend-plan.md"

Tarea 8 - Agente de Plan de Base de Datos:
"Crea prompts para la implementación de la base de datos:
- Creación del esquema
- Scripts de migración
- Datos de prueba (seed data)
- Índices y optimización
- Procedimientos de respaldo
Guardar en: PRPs/plans/{{challenge|slugify}}-database-plan.md"

Tarea 9 - Agente de Plan de DevOps:
"Crea prompts para el despliegue y la infraestructura:
- Configuración de Docker
- Configuración de CI/CD
- Variables de entorno
- Configuración de monitoreo
- Optimización del rendimiento
Guardar en: PRPs/plans/{{challenge|slugify}}-devops-plan.md"

Tarea 10 - Agente de Plan de Calidad:
"Crea prompts para el aseguramiento de la calidad:
- Configuración de linting
- Configuración de cobertura de pruebas
- Lista de verificación para la revisión de código
- Benchmarks de rendimiento
- Escaneos de seguridad
Guardar en: PRPs/plans/{{challenge|slugify}}-quality-plan.md"

Fusiona todos los planes en: PRPs/plans/{{challenge|slugify}}-master-plan.md
```

## Paso 3: Fase de Implementación en Paralelo (20 minutos)

Despliega una implementación paralela masiva en el backend y el frontend:

### Agentes de Implementación de Backend (ejecutar simultáneamente):

```
Usa la herramienta Tarea para ejecutar estos 5 agentes de backend en PARALELO:

Tarea 11 - Agente de Entidades y Repositorios:
"En el proyecto de backend:
1. Crea todas las entidades JPA a partir de la especificación
2. Añade anotaciones de Lombok
3. Crea las interfaces de los repositorios
4. Añade consultas personalizadas
5. Escribe pruebas para las entidades
Sigue los patrones de las entidades existentes.
Informa el estado de finalización."

Tarea 12 - Agente de la Capa de Servicio:
"En el proyecto de backend:
1. Crea las interfaces de los servicios
2. Implementa la lógica de negocio
3. Añade la gestión de transacciones
4. Implementa el manejo de errores
5. Escribe pruebas de servicio completas
Usa el enfoque TDD - ¡pruebas primero!
Informa el estado de finalización."

Tarea 13 - Agente de la API REST:
"En el proyecto de backend:
1. Crea los controladores REST
2. Añade documentación de OpenAPI
3. Implementa todos los endpoints
4. Añade validación de solicitudes
5. Escribe pruebas de integración
Asegura los códigos de estado HTTP adecuados.
Informa el estado de finalización."

Tarea 14 - Agente de Seguridad y Autenticación:
"En el proyecto de backend:
1. Añade la configuración de seguridad
2. Implementa la autenticación
3. Añade reglas de autorización
4. Asegura los endpoints
5. Escribe pruebas de seguridad
Sigue las mejores prácticas de Spring Security.
Informa el estado de finalización."

Tarea 15 - Agente de Integración de Backend:
"En el proyecto de backend:
1. Conecta todos los componentes
2. Añade manejadores de excepciones
3. Configura CORS
4. Añade logging
5. Ejecuta todas las pruebas del backend
Asegúrate de que todo se integre correctamente.
Informa el estado de finalización y los resultados de las pruebas."
```

### Agentes de Implementación de Frontend (ejecutar simultáneamente):

```
Usa la herramienta Tarea para ejecutar estos 5 agentes de frontend en PARALELO:

Tarea 16 - Agente del Árbol de Componentes:
"En el proyecto de frontend:
1. Crea la estructura de carpetas de la funcionalidad
2. Construye todos los componentes de React
3. Añade las interfaces de TypeScript
4. Implementa los estados de los componentes
5. Escribe pruebas para los componentes
Sigue la arquitectura de "vertical slice".
Informa el estado de finalización."

Tarea 17 - Agente de Gestión de Estado:
"En el proyecto de frontend:
1. Configura TanStack Query
2. Crea las funciones del cliente de API
3. Añade los hooks de consulta
4. Implementa las mutaciones
5. Escribe pruebas para los hooks
Usa Zod para la validación.
Informa el estado de finalización."

Tarea 18 - Agente de Formularios y Validación:
"En el proyecto de frontend:
1. Crea todos los formularios con React Hook Form
2. Añade los esquemas de Zod
3. Implementa la validación
4. Añade el manejo de errores
5. Escribe pruebas para los formularios
Asegura el cumplimiento de la accesibilidad.
Informa el estado de finalización."

Tarea 19 - Agente de Pulido de UI:
"En el proyecto de frontend:
1. Añade estados de carga
2. Implementa "error boundaries"
3. Añade animaciones/transiciones
4. Asegura un diseño responsivo
5. Añade optimizaciones de rendimiento
Haz que se vea profesional.
Informa el estado de finalización."

Tarea 20 - Agente de Integración de Frontend:
"En el proyecto de frontend:
1. Conecta todos los componentes
2. Conecta las llamadas a la API
3. Prueba los flujos de usuario completos
4. Añade el manejo de errores
5. Ejecuta todas las pruebas del frontend
Asegura una experiencia de usuario fluida.
Informa el estado de finalización y los resultados de las pruebas."
```

## Paso 4: Integración del Sistema (5 minutos)

Despliega agentes de integración para conectar todo:

```
Usa la herramienta Tarea para ejecutar estos 2 agentes en PARALELO:

Tarea 21 - Agente de Integración Full Stack:
"Conecta el frontend al backend:
1. Actualiza los endpoints de la API en el frontend
2. Prueba todas las operaciones CRUD
3. Verifica el manejo de errores
4. Comprueba el flujo de autenticación
5. Prueba los casos borde
6. Mide los tiempos de respuesta
Ejecuta ambos servicios y valida la integración.
Informa cualquier problema encontrado."

Tarea 22 - Agente de Preparación de la Demo:
"Prepara para la demo:
1. Crea un guion para la demo con tiempos
2. Configura datos para la demo
3. Crea un panel de métricas
4. Prepara escenarios de respaldo
5. Prueba el flujo completo de la demo
6. Genera puntos para la presentación
Guarda los materiales de la demo en PRPs/demos/{{challenge|slugify}}/
Informa la preparación de la demo."
```

## Paso 5: Aseguramiento de Calidad en Paralelo (5 minutos)

Ejecuta la validación final en todos los componentes:

```
Usa la herramienta Tarea para ejecutar estos 3 agentes en PARALELO:

Tarea 23 - Agente de QA de Backend:
"Ejecuta una validación completa del backend:
1. ./gradlew test - todas las pruebas
2. ./gradlew jacocoTestReport - cobertura
3. ./gradlew spotlessCheck - formato
4. ./gradlew sonarqube - calidad del código
5. Pruebas de rendimiento
Informa todas las métricas y cualquier fallo."

Tarea 24 - Agente de QA de Frontend:
"Ejecuta una validación completa del frontend:
1. npm test -- --coverage
2. npm run lint
3. npm run type-check
4. npm run build
5. Auditoría de Lighthouse
Informa todas las métricas y cualquier fallo."

Tarea 25 - Agente de QA de Integración:
"Ejecuta pruebas de extremo a extremo:
1. Pruebas completas del viaje del usuario
2. Pruebas de contrato de API
3. Benchmarks de rendimiento
4. Escaneo de seguridad
5. Auditoría de accesibilidad
Informa métricas de calidad completas."
```

## Monitoreo de la Ejecución

Crea un panel en tiempo real que muestre:

```
## Estado de la Ejecución Paralela

### Generación de Especificaciones (Tareas 1-5)
- [ ] Arquitectura Técnica: [estado]
- [ ] Experiencia de Usuario: [estado]
- [ ] Lógica de Negocio: [estado]
- [ ] Estrategia de Pruebas: [estado]
- [ ] Impacto de la Demo: [estado]

### Fase de Planificación (Tareas 6-10)
- [ ] Plan de Backend: [estado]
- [ ] Plan de Frontend: [estado]
- [ ] Plan de Base de Datos: [estado]
- [ ] Plan de DevOps: [estado]
- [ ] Plan de Calidad: [estado]

### Implementación de Backend (Tareas 11-15)
- [ ] Entidades: [estado]
- [ ] Servicios: [estado]
- [ ] API REST: [estado]
- [ ] Seguridad: [estado]
- [ ] Integración: [estado]

### Implementación de Frontend (Tareas 16-20)
- [ ] Componentes: [estado]
- [ ] Gestión de Estado: [estado]
- [ ] Formularios: [estado]
- [ ] Pulido de UI: [estado]
- [ ] Integración: [estado]

### Fase Final (Tareas 21-25)
- [ ] Integración Full Stack: [estado]
- [ ] Preparación de la Demo: [estado]
- [ ] QA de Backend: [estado]
- [ ] QA de Frontend: [estado]
- [ ] QA de Integración: [estado]

### Métricas
- Agentes Totales: 25
- Grupos de Ejecución Paralela: 5
- Tiempo Estimado: 40 minutos
- Líneas de Código Generadas: [contador]
- Cobertura de Pruebas: [porcentaje]
- Tiempo de Respuesta: [ms]
```

## Protocolo de Coordinación

1.  **Puertas de Fase**: Cada fase debe completarse antes de la siguiente.
2.  **Manejo de Fallos**: Si un agente falla, reasignar a otro.
3.  **Puntos de Síntesis**: Después de cada fase, sintetizar los resultados.
4.  **Seguimiento del Progreso**: Actualizar el panel en tiempo real.
5.  **Límites de Tiempo (Time Boxing)**: Cada agente tiene límites de tiempo estrictos.

## Protocolos de Emergencia

Si se está retrasando el cronograma:
1.  Reducir el número de agentes por fase.
2.  Omitir agentes no críticos (DevOps, algunos de QA).
3.  Centrarse solo en la funcionalidad principal.
4.  Usar datos simulados (mock data) en lugar de la implementación completa.
5.  Priorizar las características críticas para la demo.

## Métricas de Éxito

Muestra el poder de la ejecución paralela:
- 25 agentes de IA trabajando simultáneamente
- Implementación completa en 40 minutos
- Más del 80% de cobertura de pruebas
- Tiempos de respuesta por debajo de 100ms
- Documentación completa generada
- Código listo para producción

## Comando de Ejecución

```bash
# Iniciar la ejecución paralela
/hackathon hackathon-prp-parallel "{{challenge}}"

# Monitorear el progreso
/hackathon show-parallel-status

# Obtener las métricas finales
/hackathon generate-metrics-report
```

¡Este enfoque paralelo demuestra el verdadero poder del desarrollo asistido por IA, mostrando cómo múltiples agentes de IA pueden colaborar para entregar soluciones de calidad empresarial a una velocidad sin precedentes!
