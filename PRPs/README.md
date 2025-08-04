# Concepto de Prompt de Requisito de Producto (PRP)

"Especificar en exceso qué construir mientras se sub-especifica el contexto y cómo construirlo, es la razón por la cual tantos intentos de codificación impulsados por IA se estancan en el 80%. Un Prompt de Requisito de Producto (PRP) soluciona eso al fusionar el alcance disciplinado de un Documento de Requisitos de Producto (PRD) clásico con la mentalidad de "el contexto es el rey" de la ingeniería de prompts moderna."

## ¿Qué es un PRP?

Prompt de Requisito de Producto (PRP)
Un PRP es un prompt estructurado que suministra a un agente de codificación de IA todo lo que necesita para entregar una porción vertical de software funcional, ni más, ni menos.

### ¿Cómo se diferencia de un PRD?

Un PRD tradicional clarifica qué debe hacer el producto y por qué los clientes lo necesitan, pero evita deliberadamente cómo se construirá.

Un PRP mantiene las secciones de objetivo y justificación de un PRD, pero añade tres capas críticas para la IA:

### Contexto

-   Rutas y contenido de archivos precisos, versiones de bibliotecas y contexto de las mismas, ejemplos de fragmentos de código. Los LLMs generan código de mayor calidad cuando se les dan referencias directas en el prompt en lugar de descripciones amplias. Uso de un directorio `ai_docs/` para inyectar documentación de bibliotecas y otros documentos.

### Detalles y Estrategia de Implementación

-   A diferencia de un PRD tradicional, un PRP establece explícitamente cómo se construirá el producto. Esto incluye el uso de endpoints de API, ejecutores de pruebas o patrones de agentes (ReAct, Planificar y Ejecutar) a utilizar. Uso de anotaciones de tipo (typehints), dependencias, patrones arquitectónicos y otras herramientas para asegurar que el código se construya correctamente.

### Puertas de Validación

-   Verificaciones deterministas como `pytest`, `ruff` o verificaciones de tipos estáticos "desplazan hacia la izquierda" los controles de calidad, detectando defectos temprano, lo cual es más barato que rehacer el trabajo tarde.
    Ejemplo: Cada nueva función debe ser probada individualmente. Puerta de validación = todas las pruebas pasan.

### ¿Por qué existe la capa de PRP?

-   La carpeta `PRPs` se utiliza para preparar y enviar PRPs al codificador agéntico.

## Por qué el contexto no es negociable

Las salidas de los modelos de lenguaje grandes están limitadas por su ventana de contexto; un contexto irrelevante o faltante literalmente exprime los tokens útiles.

El mantra de la industria "Basura Entra → Basura Sale" se aplica doblemente a la ingeniería de prompts y especialmente en la ingeniería agéntica: una entrada descuidada produce un código frágil.

## En resumen

Un PRP es un PRD + inteligencia curada de la base de código + agente/manual de ejecución—el paquete mínimo viable que una IA necesita para poder entregar de manera plausible código listo para producción en el primer intento.

El PRP puede ser pequeño y centrarse en una sola tarea, o grande y cubrir múltiples tareas.
El verdadero poder del PRP reside en la capacidad de encadenar tareas en un PRP para construir, autovalidar y entregar funcionalidades complejas.