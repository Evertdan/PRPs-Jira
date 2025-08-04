# CLAUDE.md

Este archivo proporciona una guía completa a Claude Code cuando se trabaja con código Python en este repositorio.

## Filosofía de Desarrollo Principal

### KISS (Keep It Simple, Stupid - Mantenlo Simple, Estúpido)

La simplicidad debe ser un objetivo clave en el diseño. Elige soluciones sencillas sobre las complejas siempre que sea posible. Las soluciones simples son más fáciles de entender, mantener y depurar.

### YAGNI (You Aren't Gonna Need It - No lo vas a necesitar)

Evita construir funcionalidades por especulación. Implementa características solo cuando sean necesarias, no cuando anticipes que podrían ser útiles en el futuro.

### Principios de Diseño

- **Inversión de Dependencias**: Los módulos de alto nivel no deben depender de los de bajo nivel. Ambos deben depender de abstracciones.
- **Principio Abierto/Cerrado**: Las entidades de software deben estar abiertas a la extensión pero cerradas a la modificación.
- **Responsabilidad Única**: Cada función, clase y módulo debe tener un propósito claro.
- **Fallar Rápido**: Comprueba los posibles errores temprano y lanza excepciones inmediatamente cuando ocurran problemas.

## 🧱 Estructura del Código y Modularidad

### Límites de Archivos y Funciones

- **Nunca crees un archivo de más de 500 líneas de código**. Si te acercas a este límite, refactoriza dividiendo en módulos.
- **Las funciones deben tener menos de 50 líneas** con una única y clara responsabilidad.
- **Las clases deben tener menos de 100 líneas** y representar un único concepto o entidad.
- **Organiza el código en módulos claramente separados**, agrupados por característica o responsabilidad.
- **La longitud de la línea debe ser de máximo 100 caracteres** (regla de ruff en pyproject.toml).

### Arquitectura del Proyecto

Sigue una estricta arquitectura de "vertical slice" con las pruebas ubicadas junto al código que prueban:

```
src/proyecto/
    __init__.py
    main.py
    tests/
        test_main.py
    conftest.py

    # Módulos principales
    database/
        __init__.py
        connection.py
        models.py
        tests/
            test_connection.py
            test_models.py

    auth/
        __init__.py
        authentication.py
        authorization.py
        tests/
            test_authentication.py
            test_authorization.py

    # "Slices" de características
    features/
        user_management/
            __init__.py
            handlers.py
            validators.py
            tests/
                test_handlers.py
                test_validators.py

        payment_processing/
            __init__.py
            processor.py
            gateway.py
            tests/
                test_processor.py
                test_gateway.py
```

## 🛠️ Entorno de Desarrollo

### Gestión de Paquetes con UV

Este proyecto utiliza UV para una gestión de paquetes y entornos de Python ultrarrápida.

```bash
# Instalar UV (si no está ya instalado)
curl -LsSf https://astral.sh/uv/install.sh | sh

# Crear entorno virtual
uv venv

# Sincronizar dependencias
uv sync

# Añadir un paquete ***NUNCA ACTUALICES UNA DEPENDENCIA DIRECTAMENTE EN PYPROJECT.toml***
# SIEMPRE USA UV ADD
uv add requests

# Añadir una dependencia de desarrollo
uv add --dev pytest ruff mypy

# Eliminar un paquete
uv remove requests

# Ejecutar comandos en el entorno
uv run python script.py
uv run pytest
uv run ruff check .

# Instalar una versión específica de Python
uv python install 3.12
```

### Comandos de Desarrollo

```bash
# Ejecutar todas las pruebas
uv run pytest

# Ejecutar pruebas específicas con salida detallada
uv run pytest tests/test_module.py -v

# Ejecutar pruebas con cobertura
uv run pytest --cov=src --cov-report=html

# Formatear código
uv run ruff format .

# Comprobar el linting
uv run ruff check .

# Corregir problemas de linting automáticamente
uv run ruff check --fix .

# Comprobación de tipos
uv run mypy src/

# Ejecutar ganchos de pre-commit
uv run pre-commit run --all-files
```

## 📋 Estilo y Convenciones

### Guía de Estilo de Python

- **Seguir PEP8** con estas elecciones específicas:
  - Longitud de línea: 100 caracteres (establecido por Ruff en pyproject.toml)
  - Usar comillas dobles para las cadenas
  - Usar comas finales en estructuras multilínea
- **Siempre usar anotaciones de tipo (type hints)** para las firmas de funciones y atributos de clase.
- **Formatear con `ruff format`** (alternativa más rápida a Black).
- **Usar `pydantic` v2** para la validación de datos y la gestión de la configuración.

### Estándares de Docstrings

Usa docstrings de estilo Google para todas las funciones, clases y módulos públicos:

```python
def calculate_discount(
    price: Decimal,
    discount_percent: float,
    min_amount: Decimal = Decimal("0.01")
) -> Decimal:
    """
    Calcula el precio con descuento de un producto.

    Args:
        price: Precio original del producto.
        discount_percent: Porcentaje de descuento (0-100).
        min_amount: Precio final mínimo permitido.

    Returns:
        Precio final después de aplicar el descuento.

    Raises:
        ValueError: Si discount_percent no está entre 0 y 100.
        ValueError: Si el precio final sería inferior a min_amount.

    Example:
        >>> calculate_discount(Decimal("100"), 20)
        Decimal('80.00')
    """
```

### Convenciones de Nomenclatura

- **Variables y funciones**: `snake_case`
- **Clases**: `PascalCase`
- **Constantes**: `UPPER_SNAKE_CASE`
- **Atributos/métodos privados**: `_guion_bajo_inicial`
- **Alias de tipo**: `PascalCase`
- **Valores de Enum**: `UPPER_SNAKE_CASE`

## 🧪 Estrategia de Pruebas

### Desarrollo Dirigido por Pruebas (TDD)

1. **Escribe la prueba primero** - Define el comportamiento esperado antes de la implementación.
2. **Observa cómo falla** - Asegúrate de que la prueba realmente prueba algo.
3. **Escribe el código mínimo** - Solo lo suficiente para que la prueba pase.
4. **Refactoriza** - Mejora el código manteniendo las pruebas en verde.
5. **Repite** - Una prueba a la vez.

### Mejores Prácticas de Pruebas

```python
# Siempre usa fixtures de pytest para la configuración
import pytest
from datetime import datetime

@pytest.fixture
def sample_user():
    """Proporciona un usuario de muestra para las pruebas."""
    return User(
        id=123,
        name="Usuario de Prueba",
        email="test@example.com",
        created_at=datetime.now()
    )

# Usa nombres de prueba descriptivos
def test_user_can_update_email_when_valid(sample_user):
    """Prueba que los usuarios pueden actualizar su correo electrónico con una entrada válida."""
    new_email = "newemail@example.com"
    sample_user.update_email(new_email)
    assert sample_user.email == new_email

# Prueba casos borde y condiciones de error
def test_user_update_email_fails_with_invalid_format(sample_user):
    """Prueba que los formatos de correo electrónico no válidos son rechazados."""
    with pytest.raises(ValidationError) as exc_info:
        sample_user.update_email("no-es-un-email")
    assert "Formato de correo electrónico no válido" in str(exc_info.value)
```

### Organización de las Pruebas

- Pruebas unitarias: Prueban funciones/métodos individuales de forma aislada.
- Pruebas de integración: Prueban las interacciones entre componentes.
- Pruebas de extremo a extremo: Prueban flujos de trabajo completos del usuario.
- Mantén los archivos de prueba junto al código que prueban.
- Usa `conftest.py` para fixtures compartidas.
- Apunta a una cobertura de código del 80%+, pero céntrate en las rutas críticas.

## 🚨 Manejo de Errores

### Mejores Prácticas de Excepciones

```python
# Crea excepciones personalizadas para tu dominio
class PaymentError(Exception):
    """Excepción base para errores relacionados con pagos."""
    pass

class InsufficientFundsError(PaymentError):
    """Lanzada cuando la cuenta no tiene fondos suficientes."""
    def __init__(self, required: Decimal, available: Decimal):
        self.required = required
        self.available = available
        super().__init__(
            f"Fondos insuficientes: se requieren {required}, disponibles {available}"
        )

# Usa un manejo de excepciones específico
try:
    process_payment(amount)
except InsufficientFundsError as e:
    logger.warning(f"Pago fallido: {e}")
    return PaymentResult(success=False, reason="fondos_insuficientes")
except PaymentError as e:
    logger.error(f"Error de pago: {e}")
    return PaymentResult(success=False, reason="error_de_pago")

# Usa gestores de contexto para la gestión de recursos
from contextlib import contextmanager

@contextmanager
def database_transaction():
    """Proporciona un ámbito transaccional para las operaciones de base de datos."""
    conn = get_connection()
    trans = conn.begin_transaction()
    try:
        yield conn
        trans.commit()
    except Exception:
        trans.rollback()
        raise
    finally:
        conn.close()
```

### Estrategia de Registro (Logging)

```python
import logging
from functools import wraps

# Configurar registro estructurado
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)

logger = logging.getLogger(__name__)

# Registrar la entrada/salida de funciones para depuración
def log_execution(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        logger.debug(f"Entrando en {func.__name__}")
        try:
            result = func(*args, **kwargs)
            logger.debug(f"Saliendo de {func.__name__} con éxito")
            return result
        except Exception as e:
            logger.exception(f"Error en {func.__name__}: {e}")
            raise
    return wrapper
```

## 🔧 Gestión de la Configuración

### Variables de Entorno y Ajustes

```python
from pydantic_settings import BaseSettings
from functools import lru_cache

class Settings(BaseSettings):
    """Ajustes de la aplicación con validación."""
    app_name: str = "MiApp"
    debug: bool = False
    database_url: str
    redis_url: str = "redis://localhost:6379"
    api_key: str
    max_connections: int = 100

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"
        case_sensitive = False

@lru_cache()
def get_settings() -> Settings:
    """Obtiene una instancia de ajustes en caché."""
    return Settings()

# Uso
settings = get_settings()
```

## 🏗️ Modelos de Datos y Validación

### Ejemplo de Modelos Pydantic estrictos con pydantic v2

```python
from pydantic import BaseModel, Field, validator, EmailStr
from datetime import datetime
from typing import Optional, List
from decimal import Decimal

class ProductBase(BaseModel):
    """Modelo base de producto con campos comunes."""
    name: str = Field(..., min_length=1, max_length=255)
    description: Optional[str] = None
    price: Decimal = Field(..., gt=0, decimal_places=2)
    category: str
    tags: List[str] = []

    @validator('price')
    def validate_price(cls, v):
        if v > Decimal('1000000'):
            raise ValueError('El precio no puede exceder 1,000,000')
        return v

    class Config:
        json_encoders = {
            Decimal: str,
            datetime: lambda v: v.isoformat()
        }

class ProductCreate(ProductBase):
    """Modelo para crear nuevos productos."""
    pass

class ProductUpdate(BaseModel):
    """Modelo para actualizar productos - todos los campos son opcionales."""
    name: Optional[str] = Field(None, min_length=1, max_length=255)
    description: Optional[str] = None
    price: Optional[Decimal] = Field(None, gt=0, decimal_places=2)
    category: Optional[str] = None
    tags: Optional[List[str]] = None

class Product(ProductBase):
    """Modelo completo de producto con campos de la base de datos."""
    id: int
    created_at: datetime
    updated_at: datetime
    is_active: bool = True

    class Config:
        from_attributes = True  # Habilitar modo ORM
```

## 🔄 Flujo de Trabajo de Git

### Estrategia de Ramas

- `main` - Código listo para producción.
- `develop` - Rama de integración para características.
- `feature/*` - Nuevas características.
- `fix/*` - Correcciones de errores.
- `docs/*` - Actualizaciones de documentación.
- `refactor/*` - Refactorización de código.
- `test/*` - Adiciones o correcciones de pruebas.

### Formato de Mensaje de Commit

Nunca incluyas "claude code" o "escrito por claude code" en los mensajes de commit.

```
<tipo>(<ámbito>): <asunto>

<cuerpo>

<pie>
``
Tipos: feat, fix, docs, style, refactor, test, chore

Ejemplo:
```

feat(auth): añadir autenticación de dos factores

- Implementar generación y validación de TOTP.
- Añadir generación de código QR para aplicaciones de autenticación.
- Actualizar el modelo de usuario con campos para 2FA.

Cierra #123

````

## 🗄️ Estándares de Nomenclatura de Base de Datos

### Claves Primarias Específicas de la Entidad
Todas las tablas de la base de datos utilizan claves primarias específicas de la entidad para mayor claridad y consistencia:

```sql
-- ✅ ESTANDARIZADO: Claves primarias específicas de la entidad
sessions.session_id UUID PRIMARY KEY
leads.lead_id UUID PRIMARY KEY
messages.message_id UUID PRIMARY KEY
daily_metrics.daily_metric_id UUID PRIMARY KEY
agencies.agency_id UUID PRIMARY KEY
````

### Convenciones de Nomenclatura de Campos

```sql
-- Claves primarias: {entidad}_id
session_id, lead_id, message_id

-- Claves foráneas: {entidad_referenciada}_id
session_id REFERENCES sessions(session_id)
agency_id REFERENCES agencies(agency_id)

-- Marcas de tiempo: {accion}_at
created_at, updated_at, started_at, expires_at

-- Booleanos: is_{estado}
is_connected, is_active, is_qualified

-- Contadores: {entidad}_count
message_count, lead_count, notification_count

-- Duraciones: {propiedad}_{unidad}
duration_seconds, timeout_minutes
```

### Derivación Automática del Patrón de Repositorio

El `BaseRepository` mejorado deriva automáticamente los nombres de las tablas y las claves primarias:

```python
# ✅ ESTANDARIZADO: Repositorios basados en convenciones
class LeadRepository(BaseRepository[Lead]):
    def __init__(self):
        super().__init__()  # Deriva automáticamente "leads" y "lead_id"

class SessionRepository(BaseRepository[AvatarSession]):
    def __init__(self):
        super().__init__()  # Deriva automáticamente "sessions" y "session_id"
```

**Beneficios**:

- ✅ Esquema autodocumentado.
- ✅ Relaciones de clave foránea claras.
- ✅ Elimina la necesidad de sobrescribir métodos del repositorio.
- ✅ Consistente con los patrones de nomenclatura de entidades.

### Alineación Modelo-Base de Datos

Los modelos reflejan exactamente los campos de la base de datos para eliminar la complejidad del mapeo de campos:

```python
# ✅ ESTANDARIZADO: Los modelos reflejan exactamente la base de datos
class Lead(BaseModel):
    lead_id: UUID = Field(default_factory=uuid4)  # Coincide con el campo de la base de datos
    session_id: UUID                               # Coincide con el campo de la base de datos
    agency_id: str                                 # Coincide con el campo de la base de datos
    created_at: datetime = Field(default_factory=lambda: datetime.now(UTC))

    model_config = ConfigDict(
        use_enum_values=True,
        populate_by_name=True,
        alias_generator=None  # Usar nombres de campo exactos
    )
```

### Estándares de Rutas de API

```python
# ✅ ESTANDARIZADO: RESTful con nomenclatura de parámetros consistente
router = APIRouter(prefix="/api/v1/leads", tags=["leads"])

@router.get("/{lead_id}")           # GET /api/v1/leads/{lead_id}
@router.put("/{lead_id}")           # PUT /api/v1/leads/{lead_id}
@router.delete("/{lead_id}")        # DELETE /api/v1/leads/{lead_id}

# Sub-recursos
@router.get("/{lead_id}/messages")  # GET /api/v1/leads/{lead_id}/messages
@router.get("/agency/{agency_id}")  # GET /api/v1/leads/agency/{agency_id}
```

Para los estándares de nomenclatura completos, consulta [NAMING_CONVENTIONS.md](./NAMING_CONVENTIONS.md).

## 📝 Estándares de Documentación

### Documentación del Código

- Cada módulo debe tener un docstring que explique su propósito.
- Las funciones públicas deben tener docstrings completos.
- La lógica compleja debe tener comentarios en línea con el prefijo `# Razón:`.
- Mantén `README.md` actualizado con instrucciones de configuración y ejemplos.
- Mantén `CHANGELOG.md` para el historial de versiones.

### Documentación de la API

```python
from fastapi import APIRouter, HTTPException, status
from typing import List

router = APIRouter(prefix="/products", tags=["products"])

@router.get(
    "/",
    response_model=List[Product],
    summary="Listar todos los productos",
    description="Recuperar una lista paginada de todos los productos activos"
)
async def list_products(
    skip: int = 0,
    limit: int = 100,
    category: Optional[str] = None
) -> List[Product]:
    """
    Recupera productos con filtrado opcional.

    - **skip**: Número de productos a omitir (para paginación).
    - **limit**: Número máximo de productos a devolver.
    - **category**: Filtrar por categoría de producto.
    """
    # Implementación aquí
```

## 🚀 Consideraciones de Rendimiento

### Directrices de Optimización

- Perfila antes de optimizar - usa `cProfile` o `py-spy`.
- Usa `lru_cache` para cálculos costosos.
- Prefiere generadores para grandes conjuntos de datos.
- Usa `asyncio` para operaciones ligadas a E/S.
- Considera `multiprocessing` para tareas ligadas a la CPU.
- Almacena en caché las consultas a la base de datos apropiadamente.

### Ejemplo de Optimización

```python
from functools import lru_cache
import asyncio
from typing import AsyncIterator

@lru_cache(maxsize=1000)
def expensive_calculation(n: int) -> int:
    """Almacena en caché los resultados de cálculos costosos."""
    # Cómputo complejo aquí
    return result

async def process_large_dataset() -> AsyncIterator[dict]:
    """Procesa un gran conjunto de datos sin cargarlo todo en memoria."""
    async with aiofiles.open('large_file.json', mode='r') as f:
        async for line in f:
            data = json.loads(line)
            # Procesa y cede cada elemento
            yield process_item(data)
```

## 🛡️ Mejores Prácticas de Seguridad

### Directrices de Seguridad

- Nunca registres secretos - usa variables de entorno.
- Valida todas las entradas del usuario con Pydantic.
- Usa consultas parametrizadas para las operaciones de base de datos.
- Implementa limitación de velocidad para las APIs.
- Mantén las dependencias actualizadas con `uv`.
- Usa HTTPS para todas las comunicaciones externas.
- Implementa una autenticación y autorización adecuadas.

### Ejemplo de Implementación de Seguridad

```python
from passlib.context import CryptContext
import secrets

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def hash_password(password: str) -> str:
    """Hashea la contraseña usando bcrypt."""
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verifica una contraseña contra su hash."""
    return pwd_context.verify(plain_password, hashed_password)

def generate_secure_token(length: int = 32) -> str:
    """Genera un token aleatorio criptográficamente seguro."""
    return secrets.token_urlsafe(length)
```

## 🔍 Herramientas de Depuración

### Comandos de Depuración

```bash
# Depuración interactiva con ipdb
uv add --dev ipdb
# Añadir punto de interrupción: import ipdb; ipdb.set_trace()

# Perfilado de memoria
uv add --dev memory-profiler
uv run python -m memory_profiler script.py

# Perfilado de línea
uv add --dev line-profiler
# Añadir decorador @profile a las funciones

# Depurar con traceback enriquecido
uv add --dev rich
# En el código: from rich.traceback import install; install()
```

## 📊 Monitoreo y Observabilidad

### Registro Estructurado

```python
import structlog

logger = structlog.get_logger()

# Registrar con contexto
logger.info(
    "pago_procesado",
    user_id=user.id,
    amount=amount,
    currency="USD",
    processing_time=processing_time
)
```

## 📚 Recursos Útiles

### Herramientas Esenciales

- Documentación de UV: https://github.com/astral-sh/uv
- Ruff: https://github.com/astral-sh/ruff
- Pytest: https://docs.pytest.org/
- Pydantic: https://docs.pydantic.dev/
- FastAPI: https://fastapi.tiangolo.com/

### Mejores Prácticas de Python

- PEP 8: https://pep8.org/
- PEP 484 (Anotaciones de Tipo): https://www.python.org/dev/peps/pep-0484/
- La Guía del Autoestopista para Python: https://docs.python-guide.org/

## ⚠️ Notas Importantes

- **NUNCA ASUMAS O ADIVINES** - En caso de duda, pide una aclaración.
- **Siempre verifica las rutas de archivos y los nombres de los módulos** antes de usarlos.
- **Mantén CLAUDE.md actualizado** al añadir nuevos patrones o dependencias.
- **Prueba tu código** - Ninguna característica está completa sin pruebas.
- **Documenta tus decisiones** - Los futuros desarrolladores (incluyéndote a ti mismo) te lo agradecerán.

## 🔍 Requisitos del Comando de Búsqueda

**CRÍTICO**: Siempre usa `rg` (ripgrep) en lugar de los comandos tradicionales `grep` y `find`:

```bash
# ❌ No uses grep
grep -r "patron" .

# ✅ Usa rg en su lugar
rg "patron"

# ❌ No uses find con name
find . -name "*.py"

# ✅ Usa rg con filtrado de archivos
rg --files | rg "\.py$"
# o
rg --files -g "*.py"
```

**Reglas de Aplicación:**

```
(
    r"^grep\b(?!.*\|)",
    "Usa 'rg' (ripgrep) en lugar de 'grep' para un mejor rendimiento y características",
),
(
    r"^find\s+\S+\s+-name\b",
    "Usa 'rg --files | rg patron' o 'rg --files -g patron' en lugar de 'find -name' para un mejor rendimiento",
),
```

## 🚀 Resumen del Flujo de Trabajo de GitHub Flow

main (protegido) ←── PR ←── feature/tu-caracteristica
↓ ↑
desplegar desarrollo

### Flujo de Trabajo Diario:

1. git checkout main && git pull origin main
2. git checkout -b feature/nueva-caracteristica
3. Realizar cambios + pruebas
4. git push origin feature/nueva-caracteristica
5. Crear PR → Revisar → Fusionar a main

---

_Este documento es una guía viva. Actualízala a medida que el proyecto evolucione y surjan nuevos patrones._