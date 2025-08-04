name: "Plantilla de PRP de Planificación - Generación de PRD con Diagramas"
description: |

## Propósito
Generar Documentos de Requisitos de Producto (PRDs) completos con diagramas visuales, convirtiendo ideas aproximadas en especificaciones detalladas listas para PRPs de implementación.

## Filosofía
1. **Investigar Primero**: Recopilar contexto antes de planificar.
2. **Pensamiento Visual**: Usar diagramas para clarificar conceptos.
3. **Validación Incorporada**: Incluir desafíos y casos borde.
4. **Listo para Implementar**: La salida alimenta directamente a otros PRPs.

---

## Concepto Inicial
$ARGUMENTS

## Proceso de Planificación

### Fase 1: Expansión de la Idea e Investigación

#### Recopilación de Contexto
```yaml
areas_de_investigacion:
  analisis_de_mercado:
    - competidores: [Investigar soluciones similares]
    - necesidades_del_usuario: [Identificar puntos de dolor]
    - tendencias: [Direcciones actuales de la industria]
  
  investigacion_tecnica:
    - soluciones_existentes: [Cómo otros resuelven esto]
    - bibliotecas: [Herramientas/frameworks disponibles]
    - patrones: [Enfoques de implementación comunes]
  
  contexto_interno:
    - sistema_actual: [Cómo funciona hoy]
    - restricciones: [Limitaciones técnicas/de negocio]
    - puntos_de_integracion: [Con qué debe funcionar]
```

#### Exploración Inicial
```
INVESTIGAR soluciones similares:
  - BUSQUEDA_WEB: "ejemplos de implementación de {concepto}"
  - BUSQUEDA_WEB: "mejores prácticas de {concepto}"
  - BUSQUEDA_WEB: "patrones de arquitectura de {concepto}"

ANALIZAR base de código existente:
  - ENCONTRAR: Funcionalidades similares ya implementadas
  - IDENTIFICAR: Patrones a seguir
  - ANOTAR: Restricciones técnicas
```

### Fase 2: Generación de la Estructura del PRD

#### 1. Resumen Ejecutivo
```markdown
## Declaración del Problema
[Articulación clara del problema que se está resolviendo]

## Resumen de la Solución
[Descripción de alto nivel de la solución propuesta]

## Métricas de Éxito
- Métrica 1: [Resultado medible]
- Métrica 2: [Resultado medible]
- KPI: [Indicador clave de rendimiento]
```

#### 2. Historias de Usuario y Escenarios
```markdown
## Flujo de Usuario Principal
\```mermaid
graph LR
    A[Acción del Usuario] --> B{Punto de Decisión}
    B -->|Ruta 1| C[Resultado 1]
    B -->|Ruta 2| D[Resultado 2]
    D --> E[Estado Final]
    C --> E
\```

## Historias de Usuario
1. **Como un [tipo de usuario]**, quiero [acción] para que [beneficio]
   - Criterios de Aceptación:
     - [ ] Criterio 1
     - [ ] Criterio 2
   - Casos Borde:
     - [Caso borde 1]
     - [Caso borde 2]
```

#### 3. Arquitectura del Sistema
```markdown
## Arquitectura de Alto Nivel
\```mermaid
graph TB
    subgraph "Frontend"
        UI[Interfaz de Usuario]
        Estado[Gestión de Estado]
    end
    
    subgraph "Backend"
        API[Capa de API]
        LN[Lógica de Negocio]
        BD[(Base de Datos)]
    end
    
    subgraph "Externo"
        EXT[Servicios Externos]
    end
    
    UI --> API
    API --> LN
    LN --> BD
    LN --> EXT
    Estado --> UI
\```

## Desglose de Componentes
- **Componentes del Frontend**:
  - [Componente 1]: [Propósito]
  - [Componente 2]: [Propósito]

- **Servicios del Backend**:
  - [Servicio 1]: [Propósito]
  - [Servicio 2]: [Propósito]

- **Modelos de Datos**:
  - [Modelo 1]: [Campos y relaciones]
  - [Modelo 2]: [Campos y relaciones]
```

#### 4. Especificaciones Técnicas
```markdown
## Diseño de la API
\```mermaid
sequenceDiagram
    participant U as Usuario
    participant F as Frontend
    participant A as API
    participant B as BaseDeDatos
    participant E as Servicio Externo
    
    U->>F: Inicia Acción
    F->>A: POST /api/endpoint
    A->>B: Consulta Datos
    B-->>A: Devuelve Datos
    A->>E: Llama a API Externa
    E-->>A: Respuesta
    A-->>F: Resultado Procesado
    F-->>U: Muestra Resultado
\```

## Endpoints
- **POST /api/[recurso]**
  - Solicitud: `{campo1: tipo, campo2: tipo}`
  - Respuesta: `{estado: string, datos: {...}}`
  - Errores: `400 Solicitud Incorrecta`, `401 No Autorizado`

## Flujo de Datos
\```mermaid
flowchart TD
    A[Datos de Entrada] --> B{Validación}
    B -->|Válido| C[Procesamiento]
    B -->|Inválido| D[Respuesta de Error]
    C --> E[Transformación]
    E --> F[Almacenamiento]
    F --> G[Devolver Éxito]
\```
```

#### 5. Estrategia de Implementación
```markdown
## Fases de Desarrollo
\```mermaid
graph LR
    A[Base] --> B[Funcionalidades Principales]
    B --> C[Integración]
    C --> D[Pruebas]
    D --> E[Despliegue]
    
    A -.- F[Esquema de BD<br/>Framework de API<br/>Autenticación]
    B -.- G[Lógica de Negocio<br/>Endpoints de API<br/>UI Básica]
    C -.- H[Servicios Externos<br/>Integración UI Completa<br/>Manejo de Errores]
    D -.- I[Pruebas Unitarias<br/>Pruebas de Integración<br/>Pruebas de Rendimiento]
    E -.- J[Documentación<br/>Monitoreo<br/>Lanzamiento]
\```

## Prioridad de Implementación
1. **Base**: Infraestructura y configuración principal.
2. **Funcionalidades MVP**: Funcionalidad mínima viable.
3. **Funcionalidades Mejoradas**: Capacidades adicionales.
4. **Pulido**: Mejoras de rendimiento y UX.
5. **Listo para Producción**: Pruebas completas y despliegue.
```

### Fase 3: Desafío y Validación

#### Análisis del "Abogado del Diablo"
```yaml
desafios:
  riesgos_tecnicos:
    - riesgo: "Rendimiento a escala"
      mitigacion: "Implementar capa de caché"
    
    - riesgo: "Fiabilidad de la API de terceros"
      mitigacion: "Construir mecanismos de respaldo"
  
  riesgos_de_negocio:
    - riesgo: "Adopción por parte del usuario"
      mitigacion: "Lanzamiento por fases con bucles de retroalimentación"
    
    - riesgo: "Ampliación del alcance (Scope creep)"
      mitigacion: "Definición estricta del MVP"
  
  casos_borde:
    - escenario: "Sin conectividad de red"
      manejo: "Modo offline con sincronización"
    
    - escenario: "Actualizaciones concurrentes"
      manejo: "Bloqueo optimista"
```

#### Criterios de Éxito
```markdown
## Definición de "Hecho" (Done)
- [ ] Todas las historias de usuario implementadas.
- [ ] Cobertura de pruebas > 80%.
- [ ] Benchmarks de rendimiento cumplidos.
- [ ] Revisión de seguridad pasada.
- [ ] Documentación completa.

## Resultados Medibles
- Métrica 1: [Valor objetivo]
- Métrica 2: [Valor objetivo]
- Satisfacción del usuario: [Puntuación objetivo]
```

### Fase 4: Validación y Salida

#### Lista de Verificación Pre-implementación
```
VALIDAR suposiciones:
  - Viabilidad técnica confirmada.
  - Disponibilidad de recursos verificada.
  - Dependencias identificadas.
  - Riesgos documentados con mitigaciones.

REVISAR con las partes interesadas:
  - Alineación de negocio confirmada.
  - Enfoque técnico aprobado.
  - Cronograma aceptable.
  - Métricas de éxito acordadas.
```

#### Formato de Salida
El PRD final debe estructurarse como:

1.  **Resumen Ejecutivo** (1 página)
2.  **Requisitos Detallados** (con diagramas)
3.  **Arquitectura Técnica** (con diagramas)
4.  **Plan de Implementación** (con cronograma)
5.  **Apéndices** (investigación, alternativas consideradas)

### Comandos de Validación

```bash
# Verificar la completitud del PRD
grep -E "(TODO|TBD|FIXME)" prd_generado.md

# Comprobar la sintaxis de los diagramas
mermaid-cli -i prd_generado.md -o diagramas_prd.pdf

# Validar la estructura
python validar_estructura_prd.py prd_generado.md
```

## Anti-Patrones a Evitar
- ❌ Requisitos vagos sin criterios de aceptación.
- ❌ Falta de casos borde y escenarios de error.
- ❌ Diagramas que no coinciden con el texto.
- ❌ Jerga técnica sin explicación.
- ❌ Cronogramas poco realistas.
- ❌ Sin métricas de éxito.

## Indicadores de Éxito
- ✅ Otro desarrollador podría implementar solo a partir de este PRD.
- ✅ Todas las partes interesadas entienden el plan.
- ✅ Los riesgos están identificados con mitigaciones.
- ✅ Camino claro desde el estado actual hasta el estado deseado.
- ✅ Los diagramas clarifican en lugar de confundir.

## Ejemplo de Uso de la Plantilla

Entrada: "Construir un sistema de notificaciones para nuestra aplicación"

La salida incluiría:
- Diagramas de flujo de usuario para diferentes tipos de notificaciones.
- Arquitectura del sistema mostrando patrones de pub/sub.
- Diagramas de secuencia para la entrega en tiempo real.
- Esquema de la base de datos para las preferencias de notificación.
- Especificaciones de la API para los endpoints de notificación.
- Fases y prioridades de implementación.
- Casos borde como usuarios offline, limitación de velocidad.
- Métricas de éxito como la tasa de entrega, la interacción del usuario.

El PRD resultante se convierte en la entrada `$ARGUMENTS` para PRPs de implementación como BASE_PRP o SPEC_PRP.
