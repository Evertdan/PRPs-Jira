name: "Agente de Creación de PRP usando PydanticAI - Implementación Rica en Contexto"
description: |
  PRP completo para construir un agente automatizado de creación de PRP usando el framework PydanticAI,
  aprovechando capacidades de investigación paralela y patrones de la base de código existente para máxima eficiencia.

## Objetivo

Construir un agente de creación de PRP listo para producción usando PydanticAI que pueda generar automáticamente PRPs completos mediante:

- El análisis de los requisitos y el contexto del usuario.
- La realización de investigación paralela (análisis de la base de código, documentación externa, patrones de prueba).
- La generación de PRPs estructurados siguiendo plantillas establecidas.
- La validación de la calidad y completitud del resultado.
- La integración con la infraestructura existente de Claude Code.

**Estado Final**: Un agente de Python que toma una descripción de una funcionalidad como entrada y produce un archivo PRP completo y validado, listo para su implementación.

## Por qué

- **Eficiencia**: Reducir el tiempo de creación de PRP de horas manuales a minutos automatizados.
- **Consistencia**: Asegurar que todos los PRPs sigan patrones establecidos e incluyan el contexto necesario.
- **Calidad**: Aprovechar las capacidades de la IA para una investigación y validación exhaustivas.
- **Escalabilidad**: Permitir la creación rápida de prototipos y el desarrollo de funcionalidades en todos los equipos.
- **Integración**: Funcionar sin problemas con los flujos de trabajo y las puertas de validación existentes de Claude Code.

## Qué

### Funcionalidad Principal

- **Procesamiento de Entrada**: Analizar descripciones de funcionalidades en lenguaje natural para convertirlas en requisitos estructurados.
- **Investigación Paralela**: Analizar simultáneamente patrones de la base de código, documentación externa y estrategias de prueba.
- **Generación de PRP**: Crear PRPs completos usando plantillas establecidas y patrones descubiertos.
- **Validación de Calidad**: Puntuar y validar los PRPs generados contra métricas de calidad.
- **Gestión de Archivos**: Manejar la creación, organización y versionado de archivos PRP.

### Experiencia de Usuario

```bash
# Interfaz de línea de comandos
uv run python -m prp_agent "Crear un sistema de autenticación de usuarios con OAuth2 y tokens JWT"

# API de Python
from prp_agent import PRPCreationAgent
agent = PRPCreationAgent()
prp = await agent.create_prp("Descripción de la funcionalidad aquí")
```

### Criterios de Éxito

- [ ] Generar PRPs con una puntuación de calidad de 8+ en todas las métricas (Contexto, Claridad, Validación, Probabilidad de Éxito).
- [ ] Completar la generación de PRP en menos de 2 minutos.
- [ ] Tasa de éxito de implementación al primer intento del 90%+.
- [ ] Integración completa con las puertas de validación existentes.
- [ ] Soporte para modos interactivo y sin supervisión (headless).

## Todo el Contexto Necesario

### Documentación y Referencias

```yaml
# LECTURA OBLIGATORIA - Incluye esto en tu ventana de contexto
- url: https://ai.pydantic.dev/
  why: Documentación principal del framework PydanticAI y referencia de la API.

- url: https://ai.pydantic.dev/agents/
  why: Patrones de creación de agentes y mejores prácticas.

- url: https://ai.pydantic.dev/models/
  why: Configuración de proveedores de modelos y patrones de uso.

- url: https://ai.pydantic.dev/examples/
  why: Ejemplos de implementación y patrones del mundo real.

- url: https://github.com/pydantic/pydantic-ai
  why: Ejemplos de código fuente y seguimiento de problemas.

- url: https://ai.pydantic.dev/troubleshooting/
  why: Problemas comunes y soluciones para el despliegue en producción.

- file: /Users/rasmus/Projects/prp-spaces/dynamo-share/PRPs/templates/prp_base.md
  why: Estructura de plantilla de PRP establecida y patrones de validación.

- file: /Users/rasmus/Projects/prp-spaces/dynamo-share/PRPs/scripts/prp_runner.py
  why: Patrones de ejecución de PRP existentes e integración con Claude Code.

- file: /Users/rasmus/Projects/prp-spaces/dynamo-share/.claude/commands/create-base-prp-parallel.md
  why: Patrones de agentes de investigación paralela y estrategias de coordinación.

- file: /Users/rasmus/Projects/prp-spaces/dynamo-share/CLAUDE.md
  why: Convenciones del proyecto, patrones de arquitectura y estándares de desarrollo.

- docfile: /Users/rasmus/Projects/prp-spaces/dynamo-share/PRPs/ai_docs/build_with_claude_code.md
  why: Patrones de integración del SDK de Claude Code y operaciones asíncronas.

- docfile: /Users/rasmus/Projects/prp-spaces/dynamo-share/PRPs/ai_docs/cc_mcp.md
  why: Configuración del servidor MCP y patrones de extensión de herramientas.
```

### Árbol Actual de la Base de Código

```bash
.
├── CLAUDE.md                    # Convenciones y arquitectura del proyecto
├── PRPs/
│   ├── ai_docs/                 # Documentación del agente de IA
│   │   ├── build_with_claude_code.md
│   │   ├── cc_mcp.md
│   │   └── cc_overview.md
│   ├── templates/               # Plantillas de PRP
│   │   ├── prp_base.md
│   │   └── prp_planning_base.md
│   └── scripts/
│       └── prp_runner.py        # Script de ejecución de PRP existente
├── .claude/
│   └── commands/                # Comandos personalizados de Claude Code
│       ├── create-base-prp.md
│       └── create-base-prp-parallel.md
├── pyproject.toml               # Configuración del proyecto
└── uv.lock                      # Archivo de bloqueo de UV
```

### Árbol Deseado de la Base de Código

```bash
src/
├── prp_agent/
│   ├── __init__.py
│   ├── main.py                  # Punto de entrada de la CLI
│   ├── agent.py                 # Agente principal de PydanticAI
│   ├── tests/
│   │   ├── test_agent.py
│   │   ├── test_models.py
│   │   └── conftest.py
│   ├── models/
│   │   ├── __init__.py
│   │   ├── prp_models.py        # Modelos de Pydantic para la estructura de PRP
│   │   ├── request_models.py    # Modelos de validación de entrada
│   │   └── tests/
│   │       └── test_models.py
│   ├── features/
│   │   ├── research_coordinator/
│   │   │   ├── __init__.py
│   │   │   ├── coordinator.py   # Orquestación de la investigación paralela
│   │   │   └── tests/
│   │   │       └── test_coordinator.py
│   │   ├── prp_generator/
│   │   │   ├── __init__.py
│   │   │   ├── generator.py     # Generación de contenido de PRP
│   │   │   └── tests/
│   │   │       └── test_generator.py
│   │   └── quality_validator/
│   │       ├── __init__.py
│   │       ├── validator.py     # Puntuación de calidad y validación
│   │       └── tests/
│   │           └── test_validator.py
│   └── tools/
│       ├── __init__.py
│       ├── codebase_analyzer.py # Análisis de patrones de la base de código
│       ├── documentation_fetcher.py # Investigación de documentación externa
│       ├── file_manager.py      # Operaciones de archivo de PRP
│       └── tests/
│           └── test_tools.py
```

### Problemas Conocidos (Gotchas) y Peculiaridades de las Bibliotecas

```python
# CRÍTICO: PydanticAI requiere Python 3.9+
# CRÍTICO: Establecer ALLOW_MODEL_REQUESTS = False en las pruebas para evitar llamadas reales a la API.
# CRÍTICO: Usar TestModel() para pruebas rápidas sin llamadas a LLM.
# CRÍTICO: Se requieren funciones asíncronas para el método run().
# CRÍTICO: Las funciones de herramientas deben estar decoradas con @agent.tool.
# CRÍTICO: Conflictos del bucle de eventos en Jupyter - usar nest_asyncio.apply().
# CRÍTICO: Gestión de paquetes con UV - usar siempre 'uv run' para los comandos.
# CRÍTICO: Sintaxis de Pydantic v2 - usar Field() para la validación.
# CRÍTICO: Listas de permisos de herramientas de Claude Code - especificar las herramientas exactas necesarias.
# CRÍTICO: Las operaciones de archivo deben usar rutas absolutas.
# CRÍTICO: Las pruebas deben estar ubicadas junto al código (según CLAUDE.md).
# CRÍTICO: Funciones de máximo 50 líneas, archivos de máximo 500 líneas (según CLAUDE.md).
```

## Plan de Implementación

### Modelos de Datos y Estructura

```python
# Modelos principales de Pydantic para seguridad de tipos y validación
from pydantic import BaseModel, Field, HttpUrl
from typing import List, Optional, Dict, Any
from enum import Enum

class ResearchType(str, Enum):
    CODEBASE = "codebase"
    EXTERNAL = "external"
    TESTING = "testing"
    DOCUMENTATION = "documentation"

class PRPRequest(BaseModel):
    """Validación de entrada para solicitudes de creación de PRP"""
    feature_description: str = Field(..., min_length=10, max_length=1000)
    context_requirements: List[str] = Field(default_factory=list)
    validation_level: str = Field(default="comprehensive", pattern="^(basic|standard|comprehensive)$")
    research_depth: str = Field(default="parallel", pattern="^(minimal|standard|parallel)$")
    output_format: str = Field(default="markdown", pattern="^(markdown|json|yaml)$")

class ResearchResult(BaseModel):
    """Hallazgos de investigación estructurados"""
    research_type: ResearchType
    findings: List[str]
    file_references: List[str] = Field(default_factory=list)
    url_references: List[HttpUrl] = Field(default_factory=list)
    patterns_discovered: List[str] = Field(default_factory=list)
    gotchas: List[str] = Field(default_factory=list)
    quality_score: int = Field(ge=1, le=10)

class PRPSection(BaseModel):
    """Estructura de sección individual de PRP"""
    title: str
    content: str
    validation_commands: List[str] = Field(default_factory=list)
    references: List[str] = Field(default_factory=list)

class PRPResult(BaseModel):
    """Estructura de salida completa de PRP"""
    title: str
    sections: List[PRPSection]
    quality_scores: Dict[str, int] = Field(default_factory=dict)
    validation_gates: List[str] = Field(default_factory=list)
    file_path: Optional[str] = None
    generated_at: str
    research_summary: List[ResearchResult] = Field(default_factory=list)

    def overall_quality_score(self) -> float:
        """Calcula la puntuación de calidad general"""
        if not self.quality_scores:
            return 0.0
        return sum(self.quality_scores.values()) / len(self.quality_scores)
```

### Lista de Tareas (en orden de finalización)

```yaml
Tarea 1: Configurar la Estructura del Proyecto
CREAR src/prp_agent/__init__.py:
  - ESTABLECER la estructura del paquete
  - EXPORTAR las clases y funciones principales
  - SEGUIR el patrón de arquitectura de "vertical slice"

CREAR src/prp_agent/models/prp_models.py:
  - IMPLEMENTAR los modelos de Pydantic del plan anterior
  - INCLUIR validación de campos completa
  - REPLICAR los patrones de validación existentes de la base de código

CREAR src/prp_agent/models/tests/test_models.py:
  - SEGUIR los patrones de pytest de CLAUDE.md
  - PROBAR todos los escenarios de validación
  - ASEGURAR la verificación de la seguridad de tipos

Tarea 2: Implementación del Agente Principal
CREAR src/prp_agent/agent.py:
  - IMPLEMENTAR el agente de PydanticAI con herramientas
  - CONFIGURAR los proveedores de modelos (OpenAI, Anthropic)
  - PATRÓN: Usar salidas estructuradas con modelos de Pydantic
  - INCLUIR manejo de errores y registro adecuados

CREAR src/prp_agent/tools/codebase_analyzer.py:
  - IMPLEMENTAR funciones decoradas con @agent.tool
  - ANALIZAR patrones de archivos e implementaciones existentes
  - REPLICAR patrones de búsqueda de los .claude/commands/ existentes

CREAR src/prp_agent/tools/documentation_fetcher.py:
  - IMPLEMENTAR búsqueda web y análisis de documentación
  - INTEGRAR con los patrones de la herramienta WebFetch
  - MANEJAR la limitación de velocidad y los casos de error

Tarea 3: Coordinación de la Investigación Paralela
CREAR src/prp_agent/features/research_coordinator/coordinator.py:
  - IMPLEMENTAR el patrón de ejecución de agentes en paralelo
  - COORDINAR 4 agentes de investigación simultáneamente
  - PATRÓN: Seguir el enfoque de create-base-prp-parallel.md
  - MANEJAR fallos de agentes y resultados parciales

Tarea 4: Motor de Generación de PRP
CREAR src/prp_agent/features/prp_generator/generator.py:
  - IMPLEMENTAR la generación de contenido de PRP
  - USAR la plantilla prp_base.md como base
  - INTEGRAR los hallazgos de la investigación en una salida estructurada
  - ASEGURAR el cumplimiento y la calidad de la plantilla

Tarea 5: Sistema de Validación de Calidad
CREAR src/prp_agent/features/quality_validator/validator.py:
  - IMPLEMENTAR un sistema de puntuación de calidad de 4 métricas
  - VALIDAR la estructura y completitud del PRP
  - PUNTUAR: Riqueza del contexto, Claridad de la implementación, Completitud de la validación, Probabilidad de éxito
  - PROPORCIONAR retroalimentación accionable para mejoras

Tarea 6: Interfaz de CLI
CREAR src/prp_agent/main.py:
  - IMPLEMENTAR la interfaz de línea de comandos
  - SOPORTAR modos interactivo y sin supervisión
  - PATRÓN: Seguir la estructura de prp_runner.py
  - INCLUIR indicadores de progreso y salida en streaming

Tarea 7: Integración con Claude Code
MODIFICAR src/prp_agent/agent.py:
  - INTEGRAR con el SDK de Claude Code
  - SOPORTAR listas de permisos de herramientas
  - HABILITAR la integración con el servidor MCP si es necesario
  - ASEGURAR la compatibilidad con los flujos de trabajo existentes

Tarea 8: Pruebas y Validación
CREAR una suite de pruebas completa:
  - Pruebas UNITARIAS para todos los componentes
  - Pruebas de INTEGRACIÓN con generación real de PRP
  - Benchmarks de RENDIMIENTO
  - Validación de CALIDAD contra PRPs buenos conocidos
```

### Pseudocódigo para Componentes Principales

```python
# Implementación del Agente Principal
async def create_prp_agent() -> Agent:
    """Crea y configura el agente de PydanticAI"""

    # PATRÓN: Seguir los patrones de configuración de modelos existentes, usar un prompting adecuado, seguir las plantillas de /commands y prp para ejemplos reales
    agent = Agent(
        model='openai:gpt-4o-mini',  # Modelo por defecto
        output_type=PRPResult,       # Salida estructurada con Pydantic
        instructions="""
        Eres un agente de creación de PRP. Genera PRPs completos mediante:
        1. El análisis exhaustivo de los requisitos del usuario.
        2. La realización de investigación paralela en múltiples dimensiones.
        3. La creación de planes de implementación estructurados y accionables.
        4. La garantía de la validación de calidad y completitud.
        """,
        tools=[
            codebase_analyzer_tool,
            documentation_fetcher_tool,
            file_manager_tool,
            quality_validator_tool
        ]
    )

    return agent

# Coordinación de la Investigación Paralela
async def coordinate_research(request: PRPRequest) -> List[ResearchResult]:
    """Coordina los agentes de investigación en paralelo"""

    # CRÍTICO: Lanzar todos los agentes simultáneamente para mayor eficiencia
    research_tasks = [
        analyze_codebase_patterns(request.feature_description),
        fetch_external_documentation(request.feature_description),
        analyze_testing_strategies(request.feature_description),
        gather_project_documentation(request.feature_description)
    ]

    # PATRÓN: Usar asyncio.gather para la ejecución en paralelo
    results = await asyncio.gather(*research_tasks, return_exceptions=True)

    # GOTCHA: Manejar los fallos parciales con elegancia
    validated_results = []
    for result in results:
        if isinstance(result, Exception):
            logger.warning(f"La tarea de investigación falló: {result}")
            continue
        validated_results.append(result)

    return validated_results

# Generación de PRP con Validación de Calidad
async def generate_prp(request: PRPRequest, research: List[ResearchResult]) -> PRPResult:
    """Genera un PRP completo con validación de calidad"""

    # PATRÓN: Usar prompts estructurados con contexto de investigación
    context = synthesize_research_context(research)

    # CRÍTICO: Usar la estructura de la plantilla existente
    template = load_prp_template("prp_base.md")

    # Generar secciones iterativamente con validación
    sections = []
    for section_name in template.sections:
        section = await generate_section(
            section_name=section_name,
            context=context,
            request=request
        )

        # VALIDACIÓN: Comprobar la calidad de la sección antes de continuar
        quality_score = validate_section_quality(section)
        if quality_score < 7:
            # PATRÓN: Refinamiento iterativo
            section = await refine_section(section, quality_score)

        sections.append(section)

    # FINAL: Validación de calidad completa
    prp_result = PRPResult(
        title=f"PRP: {request.feature_description}",
        sections=sections,
        research_summary=research,
        generated_at=datetime.now().isoformat()
    )

    # PUERTAS DE CALIDAD: Puntuar todas las dimensiones
    prp_result.quality_scores = {
        "context_richness": score_context_richness(prp_result),
        "implementation_clarity": score_implementation_clarity(prp_result),
        "validation_completeness": score_validation_completeness(prp_result),
        "success_probability": score_success_probability(prp_result)
    }

    return prp_result

# Ejemplos de Integración de Herramientas
@agent.tool
async def analyze_codebase_patterns(feature_description: str) -> ResearchResult:
    """Analiza la base de código en busca de patrones relevantes"""

    # PATRÓN: Usar herramientas de búsqueda existentes
    relevant_files = await search_codebase_patterns(feature_description)
    patterns = await extract_implementation_patterns(relevant_files)

    return ResearchResult(
        research_type=ResearchType.CODEBASE,
        findings=patterns,
        file_references=relevant_files,
        quality_score=calculate_research_quality(patterns)
    )

@agent.tool
async def fetch_external_documentation(feature_description: str) -> ResearchResult:
    """Obtiene y analiza documentación externa"""

    # PATRÓN: Usar patrones de la herramienta WebFetch
    search_results = await web_search(f"documentación de {feature_description}")
    documentation = await fetch_documentation_urls(search_results)

    return ResearchResult(
        research_type=ResearchType.EXTERNAL,
        findings=documentation,
        url_references=search_results,
        quality_score=calculate_documentation_quality(documentation)
    )
```

### Puntos de Integración

```yaml
BASE DE DATOS:
  - tabla: "prp_generations"
  - campos: "id, request_data, result_data, quality_scores, created_at"
  - índice: "CREATE INDEX idx_prp_quality ON prp_generations(quality_scores)"

CONFIGURACIÓN:
  - añadir a: src/prp_agent/config.py
  - patrón: "OPENAI_API_KEY = os.getenv('OPENAI_API_KEY')"
  - patrón: "ANTHROPIC_API_KEY = os.getenv('ANTHROPIC_API_KEY')"
  - patrón: "PRP_OUTPUT_DIR = Path(os.getenv('PRP_OUTPUT_DIR', 'PRPs/generated'))"

CLAUDE_CODE:
  - integración: SDK de Claude Code para acceso a herramientas
  - patrón: "from claude_code import Client"
  - herramientas: "Agent,WebFetch,Read,Write,Glob,Grep,Bash"
  - lista de permisos: Herramientas específicas para el flujo de trabajo de generación de PRP

CLI:
  - añadir a: pyproject.toml
  - patrón: "[project.scripts]"
  - patrón: "prp-agent = 'prp_agent.main:main'"

SERVIDOR_MCP:
  - opcional: Crear un servidor MCP para la integración de herramientas externas
  - patrón: Seguir cc_mcp.md para la configuración del servidor
  - herramientas: Herramientas personalizadas para operaciones especializadas de PRP
```

## Bucle de Validación

### Nivel 1: Sintaxis y Estilo

```bash
# Ejecutar estos PRIMERO - corregir cualquier error antes de continuar
uv run ruff check src/prp_agent/ --fix
uv run ruff format src/prp_agent/
uv run mypy src/prp_agent/

# Esperado: Sin errores. Si hay errores, LEER el error y corregir.
```

### Nivel 2: Pruebas Unitarias

```python
# CREAR una suite de pruebas completa siguiendo los patrones de pytest
def test_prp_request_validation():
    """Prueba la validación de entrada para las solicitudes de PRP"""
    # Solicitud válida
    request = PRPRequest(
        feature_description="Crear sistema de autenticación de usuarios",
        validation_level="comprehensive"
    )
    assert request.feature_description == "Crear sistema de autenticación de usuarios"

    # Solicitud inválida - demasiado corta
    with pytest.raises(ValidationError):
        PRPRequest(feature_description="")

async def test_parallel_research_coordination():
    """Prueba la coordinación de agentes de investigación en paralelo"""
    request = PRPRequest(feature_description="Funcionalidad de prueba")

    with Agent.override(model=TestModel()):
        results = await coordinate_research(request)

        assert len(results) == 4  # Todos los tipos de investigación
        assert all(isinstance(r, ResearchResult) for r in results)
        assert all(r.quality_score >= 1 for r in results)

async def test_prp_generation_quality():
    """Prueba que la generación de PRP cumpla con los estándares de calidad"""
    request = PRPRequest(feature_description="Sistema de autenticación de usuarios")
    research = [create_mock_research_result()]

    with Agent.override(model=TestModel()):
        prp = await generate_prp(request, research)

        assert prp.overall_quality_score() >= 8.0
        assert len(prp.sections) >= 5  # Mínimo de secciones
        assert "Objetivo" in [s.title for s in prp.sections]
        assert "Plan de Implementación" in [s.title for s in prp.sections]

def test_quality_validation_metrics():
    """Prueba la puntuación de validación de calidad"""
    prp = create_mock_prp_result()

    context_score = score_context_richness(prp)
    clarity_score = score_implementation_clarity(prp)
    validation_score = score_validation_completeness(prp)
    success_score = score_success_probability(prp)

    assert all(1 <= score <= 10 for score in [context_score, clarity_score, validation_score, success_score])
```

```bash
# Ejecutar e iterar hasta que pase:
uv run pytest src/prp_agent/tests/ -v --cov=prp_agent
# Si falla: Leer el error, entender la causa raíz, corregir el código, volver a ejecutar
```

### Nivel 3: Pruebas de Integración

```bash
# Probar la interfaz de CLI
uv run python -m prp_agent "Crear una API REST simple con FastAPI"

# Salida esperada: Archivo PRP completo generado
# Ubicación: PRPs/generated/crear-una-api-rest-simple-con-fastapi.md
# Calidad: Puntuación general >= 8.0

# Probar con diferentes modelos, usar las claves reales en el archivo .env y probar solicitudes reales
OPENAI_API_KEY="clave-de-prueba" uv run python -m prp_agent "Autenticación de usuarios" --model="openai:gpt-4o-mini"
ANTHROPIC_API_KEY="clave-de-prueba" uv run python -m prp_agent "Autenticación de usuarios" --model="anthropic:claude-3-haiku-20240307"

# Probar el manejo de errores
uv run python -m prp_agent ""  # Debería fallar con un error de validación
uv run python -m prp_agent "x" * 2000  # Debería fallar con validación de longitud
```

### Nivel 4: Validación de Calidad

```bash
# Generar un PRP de prueba y validarlo
uv run python -m prp_agent "Crear un panel de usuario con gráficos" --output-dir="test_output"

# Validar la estructura del PRP generado
uv run python -c "
from prp_agent.features.quality_validator import validate_prp_file
result = validate_prp_file('test_output/crear-un-panel-de-usuario-con-graficos.md')
print(f'Puntuación de Calidad: {result.overall_quality_score():.1f}/10')
assert result.overall_quality_score() >= 8.0
"

# Probar la probabilidad de éxito de la implementación
uv run python -c "
from prp_agent.features.quality_validator import predict_implementation_success
prp_content = open('test_output/crear-un-panel-de-usuario-con-graficos.md').read()
probability = predict_implementation_success(prp_content)
print(f'Probabilidad de Éxito de la Implementación: {probability:.1f}%')
assert probability >= 80.0
"
```

## Lista de Verificación de Validación Final

- [ ] Todas las pruebas pasan: `uv run pytest src/prp_agent/tests/ -v --cov=prp_agent`
- [ ] Sin errores de linting: `uv run ruff check src/prp_agent/`
- [ ] Sin errores de tipo: `uv run mypy src/prp_agent/`
- [ ] La interfaz de CLI funciona: `uv run python -m prp_agent "Funcionalidad de prueba"`
- [ ] Los PRPs generados tienen una puntuación >= 8.0 en todas las métricas de calidad.
- [ ] La integración con el SDK de Claude Code es exitosa.
- [ ] Benchmark de rendimiento: generación de PRP < 2 minutos.
- [ ] Los casos de error se manejan con elegancia y con mensajes informativos.
- [ ] La documentación se genera y está completa.
- [ ] La integración con el servidor MCP (si se implementa) funciona correctamente.
- [ ] Cobertura de pruebas >= 90%.
- [ ] El uso de memoria es estable (sin fugas durante el uso prolongado).
- [ ] Se verifica el soporte para múltiples proveedores de modelos.

---

## Puntuación de Métricas de Éxito

### Riqueza del Contexto (1-10)

- **8-10**: Hallazgos de investigación completos, referencias de archivos específicas, documentación externa.
- **6-7**: Buena cobertura de investigación, algunas áreas de contexto faltantes.
- **4-5**: Investigación básica, contexto limitado.
- **1-3**: Investigación mínima, contexto insuficiente.

### Claridad de la Implementación (1-10)

- **8-10**: Implementación paso a paso clara, pseudocódigo específico, puntos de integración.
- **6-7**: Buena guía de implementación, algo de ambigüedad.
- **4-5**: Esquema de implementación básico, faltan detalles.
- **1-3**: Ruta de implementación poco clara, lagunas significativas.

### Completitud de la Validación (1-10)

- **8-10**: Puertas de validación completas, comandos ejecutables, controles de calidad.
- **6-7**: Buena cobertura de validación, algunas pruebas faltantes.
- **4-5**: Validación básica, pruebas limitadas.
- **1-3**: Validación mínima, puertas de calidad insuficientes.

### Probabilidad de Éxito en un Solo Intento (1-10)

- **8-10**: Alta confianza en una implementación exitosa sin iteraciones.
- **6-7**: Buena probabilidad, puede necesitar ajustes menores.
- **4-5**: Probabilidad moderada, se esperan algunas iteraciones.
- **1-3**: Baja probabilidad, es probable que se necesiten iteraciones significativas.

**Objetivo**: 8+ en todas las métricas a través de una investigación y validación paralelas exhaustivas.

## Beneficios de Eficiencia de Tiempo

Este enfoque basado en PydanticAI proporciona:

- **Creación de PRP 10 veces más rápida**: Investigación y escritura automatizadas vs. manuales.
- **Investigación paralela**: 4 veces más rápida que la investigación secuencial.
- **Consistencia de calidad**: Validación estandarizada en todos los PRPs.
- **Reducción de iteraciones**: Un contexto inicial completo reduce los ciclos de implementación.
- **Automatización escalable**: Manejar múltiples solicitudes de PRP simultáneamente.

**ROI Esperado**: Más de 40 horas ahorradas por semana para equipos de desarrollo activos.