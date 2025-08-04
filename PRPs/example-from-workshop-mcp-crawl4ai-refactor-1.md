name: "Refactorización de MCP Crawl4AI RAG - Fase 1: Primero la Base"
description: |

## Propósito
Transformar la base de código monolítica de mcp-crawl4ai-rag en una arquitectura de "vertical slice" mantenible con una separación de conceptos adecuada, seguridad de tipos y pruebas exhaustivas.

## Principios Fundamentales
1. **Primero la Base**: Construir la estructura central antes de mover la funcionalidad.
2. **Seguridad de Tipos**: Usar modelos de Pydantic para toda la validación de datos.
3. **Probar sobre la Marcha**: Añadir pruebas de pytest para cada componente.
4. **Validación Progresiva**: Verificar cada fase antes de continuar.
5. **Cero Regresiones**: Toda la funcionalidad existente debe seguir funcionando.

---

## Objetivo
Refactorizar la base de código monolítica actual (`src/crawl4ai_mcp.py`: 1054 líneas, `src/utils.py`: 738 líneas) a una arquitectura de "vertical slice" bien estructurada con una separación de conceptos adecuada, seguridad de tipos completa y pruebas unitarias para todos los componentes.

## Por qué
- Los archivos actuales exceden el límite de 500 líneas (requisito de `CLAUDE.md`).
- La lógica de negocio está mezclada con las definiciones de herramientas de MCP.
- No hay seguridad de tipos ni validación de solicitud/respuesta.
- La falta de pruebas unitarias hace que los cambios sean arriesgados.
- Es difícil de mantener y extender la estructura actual.

## Qué
Transformar la base de código en una arquitectura de "vertical slice" donde:
- Cada herramienta es un envoltorio delgado que llama a métodos de servicio.
- Los servicios contienen toda la lógica de negocio.
- Los modelos proporcionan seguridad de tipos a través de Pydantic.
- Las pruebas residen junto al código que prueban.
- La configuración está centralizada y validada.

### Criterios de Éxito
- [ ] Todos los archivos por debajo de 500 líneas.
- [ ] Cobertura de tipos del 100% con modelos de Pydantic.
- [ ] Pruebas de Pytest para todos los componentes nuevos.
- [ ] Toda la funcionalidad existente funcionando.
- [ ] Gestión de paquetes con UV configurada correctamente.
- [ ] Linting con Ruff pasando sin errores.

## Todo el Contexto Necesario

### Documentación y Referencias
```yaml
# LECTURA OBLIGATORIA - Incluye esto en tu ventana de contexto
- file: PRPs/ai_docs/uv_practices.md
  why: Guía completa de gestión de paquetes con UV - lee las secciones sobre la configuración de pyproject.toml y la integración con pytest.
  
- file: PRPs/ai_docs/uv_tools.md
  why: Documentación de las herramientas de UV para ejecutar pruebas y linting.
  
- file: CLAUDE.md
  why: Estándares de codificación del proyecto - especialmente los límites de tamaño de archivo y los requisitos de prueba.
  
- url: https://docs.pydantic.dev/latest/concepts/models/
  why: Patrones de creación y validación de modelos de Pydantic v2.
  
- url: https://docs.pytest.org/en/stable/how-to/fixtures.html
  why: Patrones de fixtures de Pytest para la configuración de pruebas.
  
- docfile: PRPs/ai_docs/refactor_plan.md
  why: Requisitos completos de la refactorización y estructura objetivo.
```

### Árbol Actual de la Base de Código
```bash
mcp-crawl4ai-rag/
├── src/
│   ├── crawl4ai_mcp.py    # 1054 líneas - Servidor MCP + toda la lógica de las herramientas
│   └── utils.py           # 738 líneas - base de datos, embeddings, búsqueda
├── pyproject.toml         # Falta la configuración de pytest
├── crawled_pages.sql      # Esquema de la base de datos
├── Dockerfile
├── README.md
└── QUICKSTART.md
```

### Árbol Deseado de la Base de Código con archivos a añadir y responsabilidad del archivo
```bash
mcp-crawl4ai-rag/
├── main.py                    # Punto de entrada (mínimo - solo ejecuta src.mcp_server)
├── pyproject.toml            # Actualizado con configuración de pytest y layout de src
├── src/
│   ├── __init__.py
│   ├── config.py             # Configuración de Pydantic y validación de entorno
│   ├── models.py             # Todos los modelos de Pydantic para solicitudes/respuestas
│   ├── mcp_server.py         # Configuración del servidor FastMCP y gestión del ciclo de vida
│   ├── conftest.py           # Fixtures de pytest compartidas
│   │
│   ├── services/             # Capa de lógica de negocio
│   │   ├── __init__.py
│   │   ├── crawling.py       # Toda la lógica de crawling (de crawl4ai_mcp.py)
│   │   ├── search.py         # Lógica de búsqueda/RAG (de utils.py)
│   │   ├── database.py       # Operaciones de base de datos (de utils.py)
│   │   ├── embeddings.py     # Operaciones de embedding (de utils.py)
│   │   └── tests/
│   │       ├── __init__.py
│   │       ├── test_crawling.py
│   │       ├── test_search.py
│   │       ├── test_database.py
│   │       └── test_embeddings.py
│   │
│   ├── tools/                # Definiciones de herramientas de MCP (envoltorios delgados)
│   │   ├── __init__.py
│   │   ├── crawl_single_page.py
│   │   ├── smart_crawl_url.py
│   │   ├── get_available_sources.py
│   │   ├── perform_rag_query.py
│   │   ├── search_code_examples.py
│   │   └── tests/
│   │       ├── __init__.py
│   │       ├── test_crawl_single_page.py
│   │       ├── test_smart_crawl_url.py
│   │       ├── test_get_available_sources.py
│   │       ├── test_perform_rag_query.py
│   │       └── test_search_code_examples.py
│   │
│   └── utils/                # Utilidades compartidas
│       ├── __init__.py
│       ├── text_processing.py  # Fragmentación y extracción de texto
│       ├── reranking.py        # Re-ranking con cross-encoder
│       └── tests/
│           ├── __init__.py
│           ├── test_text_processing.py
│           └── test_reranking.py
```

### Problemas Conocidos (Gotchas) de nuestra base de código y Peculiaridades de las Bibliotecas
```python
# CRÍTICO: FastMCP requiere funciones asíncronas para todas las herramientas.
# CRÍTICO: Se usa Pydantic v2 - usar model_dump() no dict().
# CRÍTICO: UV requiere una estructura de src/ para instalaciones editables.
# CRÍTICO: El cliente de Supabase es síncrono pero se usa en un contexto asíncrono.
# CRÍTICO: Las variables de entorno deben cargarse con override=True.
# CRÍTICO: La carga del modelo de cross-encoder puede fallar - necesita try/except.
# CRÍTICO: El crawler de Crawl4AI necesita una gestión adecuada de su ciclo de vida.
```

## Plan de Implementación

### Modelos de datos y estructura

Crear los modelos de datos principales para seguridad de tipos y consistencia:
```python
# Ejemplos de src/models.py:
from pydantic import BaseModel, HttpUrl, Field
from typing import Optional, List, Dict, Any
from enum import Enum

class CrawlType(str, Enum):
    SINGLE_PAGE = "single_page"
    SITEMAP = "sitemap"
    TXT_FILE = "txt_file"
    RECURSIVE = "recursive"

class CrawlRequest(BaseModel):
    url: HttpUrl
    max_depth: int = Field(default=3, ge=1, le=10)
    max_concurrent: int = Field(default=10, ge=1, le=50)
    chunk_size: int = Field(default=5000, ge=100, le=10000)

class CrawlResult(BaseModel):
    success: bool
    url: str
    crawl_type: CrawlType
    pages_crawled: int = 0
    chunks_stored: int = 0
    code_examples_stored: int = 0
    error: Optional[str] = None

class SearchRequest(BaseModel):
    query: str = Field(min_length=1, max_length=1000)
    source: Optional[str] = None
    num_results: int = Field(default=5, ge=1, le=20)
    semantic_threshold: float = Field(default=0.5, ge=0.0, le=1.0)

class RAGResponse(BaseModel):
    success: bool
    answer: str
    sources: List[Dict[str, Any]]
    error: Optional[str] = None
```

### Lista de tareas a completar para cumplir con el PRP en el orden en que deben completarse

```yaml
Tarea 1 - Configurar UV y pytest:
NO MODIFICAR pyproject.toml:
  - AÑADIR pytest y pytest-asyncio ejecutando `uv add pytest pytest-asyncio`
  - AÑADIR la sección [tool.pytest.ini_options]
  - ASEGURAR la configuración del layout de src/
  - AÑADIR el grupo de dependencias de desarrollo

Tarea 2 - Crear la estructura base:
CREAR src/__init__.py:
  - Archivo vacío para convertir src en un paquete
CREAR main.py:
  - Punto de entrada MÍNIMO que importa y ejecuta src.mcp_server
CREAR src/conftest.py:
  - Fixtures de pytest compartidas para todas las pruebas

Tarea 3 - Crear el módulo de configuración:
CREAR src/config.py:
  - MOVER todas las llamadas a os.getenv() de los archivos existentes
  - USAR pydantic_settings.BaseSettings
  - VALIDAR todos los valores de configuración
  - PATRÓN de: PRPs/ai_docs/refactor_plan.md líneas 249-274

Tarea 4 - Crear el módulo de modelos:
CREAR src/models.py:
  - CONVERTIR la clase de datos Crawl4AIContext a un modelo de Pydantic
  - AÑADIR todos los modelos de solicitud/respuesta mostrados arriba
  - ASEGURAR que todos los campos tengan la validación adecuada

Tarea 5 - Crear el módulo del servidor MCP:
CREAR src/mcp_server.py:
  - MOVER la inicialización de FastMCP desde crawl4ai_mcp.py
  - MOVER la función crawl4ai_lifespan
  - IMPORTAR herramientas del paquete de herramientas (dará error hasta la Fase 3)
  - SIN lógica de negocio - solo configuración del servidor

Tarea 6 - Crear la estructura de servicios:
CREAR src/services/__init__.py:
  - Archivo vacío
CREAR src/services/database.py:
  - MOVER get_supabase_client de utils.py
  - MOVER add_documents_to_supabase de utils.py
  - MOVER update_source_info de utils.py
  - MOVER add_code_examples_to_supabase de utils.py
CREAR src/services/tests/test_database.py:
  - Pruebas unitarias para las operaciones de la base de datos

Tarea 7 - Crear el servicio de embeddings:
CREAR src/services/embeddings.py:
  - MOVER create_embedding de utils.py
  - MOVER create_embeddings_batch de utils.py
  - MOVER generate_contextual_embedding de utils.py
  - MOVER process_chunk_with_context de utils.py
CREAR src/services/tests/test_embeddings.py:
  - Pruebas unitarias para las operaciones de embedding

Tarea 8 - Crear el servicio de búsqueda:
CREAR src/services/search.py:
  - MOVER search_documents de utils.py
  - MOVER search_code_examples de utils.py
  - INTEGRAR con re-ranking si está habilitado
CREAR src/services/tests/test_search.py:
  - Pruebas unitarias para las operaciones de búsqueda

Tarea 9 - Crear el servicio de crawling:
CREAR src/services/crawling.py:
  - MOVER toda la lógica de crawling desde crawl4ai_mcp.py
  - MOVER las funciones is_sitemap, is_txt, parse_sitemap
  - MOVER crawl_batch, crawl_recursive_internal_links
  - MOVER extract_code_blocks, generate_code_example_summary de utils.py
CREAR src/services/tests/test_crawling.py:
  - Pruebas unitarias para las operaciones de crawling

Tarea 10 - Crear utilidades:
CREAR src/utils/__init__.py:
  - Archivo vacío
CREAR src/utils/text_processing.py:
  - MOVER smart_chunk_markdown de crawl4ai_mcp.py
  - MOVER extract_section_info de crawl4ai_mcp.py
CREAR src/utils/reranking.py:
  - MOVER rerank_results de crawl4ai_mcp.py
CREAR src/utils/tests/:
  - Pruebas unitarias para las utilidades

Tarea 11 - Crear herramientas (Fase 3):
CREAR la estructura de src/tools/:
  - Un archivo por herramienta
  - Cada herramienta es un envoltorio delgado que llama a los servicios
  - Incluir pruebas para cada herramienta

Tarea 12 - Limpieza final:
ACTUALIZAR las importaciones en toda la base de código
ELIMINAR src/crawl4ai_mcp.py
ELIMINAR src/utils.py
EJECUTAR la suite de pruebas completa
```

### Pseudocódigo por tarea según sea necesario

```python
# Tarea 1 - uv add pytest pytest-asyncio

uv add pytest pytest-asyncio

# Tarea 2 - uv add ruff mypy ipython

uv add ruff mypy ipython

# Tarea 2.5 - modificar pyproject.toml

modificar pyproject.toml

[tool.pytest.ini_options]
testpaths = ["src"]
pythonpath = ["src"]
asyncio_mode = "auto"
addopts = "-v --tb=short"

# Tarea 3 - estructura de config.py
from pydantic_settings import BaseSettings
from typing import Optional
from pathlib import Path

class Settings(BaseSettings):
    # Servidor MCP
    host: str = "0.0.0.0"
    port: int = 8051
    
    # OpenAI - REQUERIDO
    openai_api_key: str
    model_choice: str = "gpt-4o-mini"
    
    # Supabase - REQUERIDO
    supabase_url: str
    supabase_service_key: str
    
    # Banderas de funcionalidad
    use_contextual_embeddings: bool = False
    use_hybrid_search: bool = False
    use_reranking: bool = False
    
    class Config:
        env_file = Path(__file__).parent.parent / ".env"
        extra = "ignore"

# Tarea 6 - ejemplo de patrón de servicio
# src/services/database.py
from typing import List, Dict, Any
from supabase import Client
from src.config import Settings
from src.models import Document, CodeExample

class DatabaseService:
    def __init__(self, client: Client, settings: Settings):
        self.client = client
        self.settings = settings
    
    async def add_documents(self, documents: List[Document]) -> Dict[str, Any]:
        # PATRÓN: Validar la entrada con Pydantic primero
        # PATRÓN: Usar patrones de reintento existentes
        # PATRÓN: Devolver una respuesta estructurada
        pass

# Tarea 11 - patrón de envoltorio de herramienta
# src/tools/crawl_single_page.py
from src.mcp_server import mcp
from src.services.crawling import CrawlingService
from src.models import CrawlRequest, CrawlResult
from mcp.server.fastmcp import Context

@mcp.tool()
async def crawl_single_page(ctx: Context, url: str) -> str:
    """Rastrea una sola página web y almacena su contenido."""
    # PATRÓN: La herramienta es solo un envoltorio delgado
    service = CrawlingService(ctx.crawler, ctx.supabase_client)
    request = CrawlRequest(url=url)
    result: CrawlResult = await service.crawl_single_page(request)
    return result.model_dump_json(indent=2)
```

### Puntos de Integración
```yaml
BASE DE DATOS:
  - No se necesitan cambios en el esquema
  - El `crawled_pages.sql` existente sigue siendo válido
  
CONFIGURACIÓN:
  - mover a: src/config.py
  - patrón: Usar BaseSettings con validación
  - cargar .env desde la raíz del proyecto
  
IMPORTACIONES:
  - Actualizar todas las importaciones para usar la nueva estructura
  - main.py importa desde src.mcp_server
  - los servicios importan desde src.models y src.config
```

## Bucle de Validación

### Nivel 1: Sintaxis y Estilo
```bash
# Después de la creación de cada archivo, ejecutar:
uv run ruff check src/nuevo_archivo.py --fix
uv run mypy src/nuevo_archivo.py

# Esperado: Sin errores. Si hay errores, LEER y corregir.
```

### Nivel 2: Pruebas Unitarias para cada componente
```python
# Ejemplo: src/services/tests/test_database.py
import pytest
from unittest.mock import Mock, AsyncMock
from src.services.database import DatabaseService
from src.models import Document

@pytest.fixture
def mock_supabase_client():
    """Cliente de Supabase simulado para pruebas."""
    client = Mock()
    client.table = Mock(return_value=Mock(
        insert=Mock(return_value=Mock(execute=AsyncMock()))
    ))
    return client

@pytest.fixture
def database_service(mock_supabase_client, test_settings):
    """Crea DatabaseService con dependencias simuladas."""
    return DatabaseService(mock_supabase_client, test_settings)

async def test_add_documents_success(database_service):
    """Prueba la adición exitosa de documentos."""
    docs = [Document(content="test", url="http://example.com")]
    result = await database_service.add_documents(docs)
    assert result["success"] is True

async def test_add_documents_empty_list(database_service):
    """Prueba el manejo de una lista de documentos vacía."""
    result = await database_service.add_documents([])
    assert result["success"] is True
    assert result["count"] == 0
```

```bash
# Ejecutar pruebas después de crear cada servicio:
uv run pytest src/services/tests/test_database.py -v
# Si falla: Leer el error, corregir el código, volver a ejecutar
```

### Nivel 3: Prueba de Integración
```bash
# Después de completar la Fase 5:
# Iniciar el servicio refactorizado
uv run python main.py
```

Asegurarse de que se ejecute.

## Lista de Verificación de Validación Final
- [ ] UV configurado correctamente: `uv sync` funciona.
- [ ] Todas las pruebas pasan: `uv run pytest src/ -v`.
- [ ] Sin errores de linting: `uv run ruff check src/`.
- [ ] Sin errores de tipo: `uv run mypy src/`.
- [ ] Todos los archivos por debajo de 500 líneas.
- [ ] Cada componente tiene pruebas.
- [ ] Funcionalidad original preservada.
- [ ] Se puede ejecutar con: `uv run python main.py`.

---

## Anti-Patrones a Evitar
- ❌ No mover código sin entender las dependencias.
- ❌ No crear importaciones circulares entre módulos.
- ❌ No poner lógica de negocio en los archivos de herramientas.
- ❌ No saltarse la escritura de pruebas "para ahorrar tiempo".
- ❌ No usar llamadas síncronas de Supabase en funciones asíncronas sin el manejo adecuado.
- ❌ No olvidar validar todas las entradas con modelos de Pydantic.