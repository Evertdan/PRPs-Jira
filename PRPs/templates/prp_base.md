name: "Plantilla Base de PRP v3 - Enfocada en la Implementación con Estándares de Precisión"
description: |

---

## Objetivo

**Objetivo de la Funcionalidad**: [Estado final específico y medible de lo que se necesita construir]

**Entregable**: [Artefacto concreto - endpoint de API, clase de servicio, integración, etc.]

**Definición de Éxito**: [Cómo sabrás que esto está completo y funcionando]

## Persona de Usuario (si aplica)

**Usuario Objetivo**: [Tipo de usuario específico - desarrollador, usuario final, administrador, etc.]

**Caso de Uso**: [Escenario principal en el que se utilizará esta funcionalidad]

**Viaje del Usuario**: [Flujo paso a paso de cómo el usuario interactúa con esta funcionalidad]

**Puntos de Dolor Abordados**: [Frustraciones específicas del usuario que esta funcionalidad resuelve]

## Por qué

- [Valor de negocio e impacto para el usuario]
- [Integración con funcionalidades existentes]
- [Problemas que esto resuelve y para quién]

## Qué

[Comportamiento visible para el usuario y requisitos técnicos]

### Criterios de Éxito

- [ ] [Resultados medibles específicos]

## Todo el Contexto Necesario

### Verificación de Completitud del Contexto

_Antes de escribir este PRP, valida: "Si alguien no supiera nada sobre esta base de código, ¿tendría todo lo necesario para implementar esto con éxito?"_

### Documentación y Referencias

```yaml
# LECTURA OBLIGATORIA - Incluye esto en tu ventana de contexto
- url: [URL completa con ancla de sección]
  why: [Métodos/conceptos específicos necesarios para la implementación]
  critical: [Perspectivas clave que previenen errores comunes de implementación]

- file: [ruta/exacta/al/archivo/de/patron.py]
  why: [Patrón específico a seguir - estructura de clase, manejo de errores, etc.]
  pattern: [Breve descripción de qué patrón extraer]
  gotcha: [Restricciones o limitaciones conocidas a evitar]

- docfile: [PRPs/ai_docs/dominio_especifico.md]
  why: [Documentación personalizada para patrones complejos de bibliotecas/integración]
  section: [Sección específica si el documento es grande]
```

### Árbol Actual de la Base de Código (ejecuta `tree` en la raíz del proyecto) para obtener una visión general de la base de código

```bash

```

### Árbol Deseado de la Base de Código con archivos a añadir y responsabilidad del archivo

```bash

```

### Problemas Conocidos (Gotchas) de nuestra base de código y Peculiaridades de las Bibliotecas

```python
# CRÍTICO: [Nombre de la biblioteca] requiere [configuración específica]
# Ejemplo: FastAPI requiere funciones asíncronas para los endpoints
# Ejemplo: Este ORM no soporta inserciones por lotes de más de 1000 registros
```

## Plan de Implementación

### Modelos de datos y estructura

Crear los modelos de datos principales, aseguramos la seguridad de tipos y la consistencia.

```python
Ejemplos:
 - modelos de ORM
 - modelos de pydantic
 - esquemas de pydantic
 - validadores de pydantic

```

### Tareas de Implementación (ordenadas por dependencias)

```yaml
Tarea 1: CREAR src/models/{dominio}_models.py
  - IMPLEMENTAR: Modelos de Pydantic {ModeloEspecifico}Request, {ModeloEspecifico}Response
  - SEGUIR patrón: src/models/existing_model.py (enfoque de validación de campos)
  - NOMENCLATURA: CamelCase para clases, snake_case para campos
  - UBICACIÓN: Archivo de modelo específico del dominio en src/models/

Tarea 2: CREAR src/services/{dominio}_service.py
  - IMPLEMENTAR: Clase {Dominio}Service con métodos asíncronos
  - SEGUIR patrón: src/services/database_service.py (estructura de servicio, manejo de errores)
  - NOMENCLATURA: Clase {Dominio}Service, métodos async def create_*, get_*, update_*, delete_*
  - DEPENDENCIAS: Importar modelos de la Tarea 1
  - UBICACIÓN: Capa de servicio en src/services/

Tarea 3: CREAR src/tools/{accion}_{recurso}.py
  - IMPLEMENTAR: Envoltorio de herramienta MCP que llama a métodos de servicio
  - SEGUIR patrón: src/tools/existing_tool.py (estructura de herramienta FastMCP)
  - NOMENCLATURA: Nombre de archivo en snake_case, nombre de función de herramienta descriptivo
  - DEPENDENCIAS: Importar servicio de la Tarea 2
  - UBICACIÓN: Capa de herramientas en src/tools/

Tarea 4: MODIFICAR src/main.py o src/server.py
  - INTEGRAR: Registrar nueva herramienta con el servidor MCP
  - ENCONTRAR patrón: registros de herramientas existentes
  - AÑADIR: Importar y registrar nueva herramienta siguiendo el patrón existente
  - PRESERVAR: Registros de herramientas y configuración del servidor existentes

Tarea 5: CREAR src/services/tests/test_{dominio}_service.py
  - IMPLEMENTAR: Pruebas unitarias para todos los métodos de servicio (camino feliz, casos borde, manejo de errores)
  - SEGUIR patrón: src/services/tests/test_existing_service.py (uso de fixtures, patrones de aserción)
  - NOMENCLATURA: Nomenclatura de funciones test_{metodo}_{escenario}
  - COBERTURA: Todos los métodos públicos con casos de prueba positivos y negativos
  - UBICACIÓN: Pruebas junto al código que prueban

Tarea 6: CREAR src/tools/tests/test_{accion}_{recurso}.py
  - IMPLEMENTAR: Pruebas unitarias para la funcionalidad de la herramienta MCP
  - SEGUIR patrón: src/tools/tests/test_existing_tool.py (enfoque de prueba de herramientas MCP)
  - SIMULAR: Dependencias de servicios externos
  - COBERTURA: Validación de entrada de la herramienta, respuestas de éxito, manejo de errores
  - UBICACIÓN: Pruebas de herramientas en src/tools/tests/
```

### Patrones de Implementación y Detalles Clave

```python
# Muestra patrones críticos y problemas conocidos - sé conciso, céntrate en detalles no obvios

# Ejemplo: Patrón de método de servicio
async def {operacion_dominio}(self, request: {Dominio}Request) -> {Dominio}Response:
    # PATRÓN: Validación de entrada primero (seguir src/services/existing_service.py)
    validated = self.validate_request(request)

    # GOTCHA: [Restricción o requisito específico de la biblioteca]
    # PATRÓN: Enfoque de manejo de errores (referenciar patrón de servicio existente)
    # CRÍTICO: [Requisito o detalle de configuración no obvio]

    return {Dominio}Response(status="success", data=result)

# Ejemplo: Patrón de herramienta MCP
@app.tool()
async def {nombre_herramienta}({parametros}) -> str:
    # PATRÓN: Validación de la herramienta y delegación al servicio (ver src/tools/existing_tool.py)
    # RETORNAR: Cadena JSON con formato de respuesta estandarizado
```

### Puntos de Integración

```yaml
BASE DE DATOS:
  - migración: "Añadir columna 'feature_enabled' a la tabla de usuarios"
  - índice: "CREATE INDEX idx_feature_lookup ON users(feature_id)"

CONFIGURACIÓN:
  - añadir a: config/settings.py
  - patrón: "FEATURE_TIMEOUT = int(os.getenv('FEATURE_TIMEOUT', '30'))"

RUTAS:
  - añadir a: src/api/routes.py
  - patrón: "router.include_router(feature_router, prefix='/feature')"
```

## Bucle de Validación

### Nivel 1: Sintaxis y Estilo (Retroalimentación Inmediata)

```bash
# Ejecutar después de la creación de cada archivo - corregir antes de continuar
ruff check src/{nuevos_archivos} --fix     # Auto-formatear y corregir problemas de linting
mypy src/{nuevos_archivos}                 # Verificación de tipos con archivos específicos
ruff format src/{nuevos_archivos}          # Asegurar un formato consistente

# Validación a nivel de proyecto
ruff check src/ --fix
mypy src/
ruff format src/

# Esperado: Cero errores. Si existen errores, LEER la salida y corregir antes de continuar.
```

### Nivel 2: Pruebas Unitarias (Validación de Componentes)

```bash
# Probar cada componente a medida que se crea
uv run pytest src/services/tests/test_{dominio}_service.py -v
uv run pytest src/tools/tests/test_{accion}_{recurso}.py -v

# Suite de pruebas completa para las áreas afectadas
uv run pytest src/services/tests/ -v
uv run pytest src/tools/tests/ -v

# Validación de cobertura (si hay herramientas de cobertura disponibles)
uv run pytest src/ --cov=src --cov-report=term-missing

# Esperado: Todas las pruebas pasan. Si fallan, depurar la causa raíz y corregir la implementación.
```

### Nivel 3: Pruebas de Integración (Validación del Sistema)

```bash
# Validación del arranque del servicio
uv run python main.py &
sleep 3  # Dar tiempo para el arranque

# Validación del chequeo de salud
curl -f http://localhost:8000/health || echo "El chequeo de salud del servicio falló"

# Pruebas del endpoint específico de la funcionalidad
curl -X POST http://localhost:8000/{tu_endpoint} \
  -H "Content-Type: application/json" \
  -d '{"test": "data"}' \
  | jq .  # Imprimir en formato legible la respuesta JSON

# Validación del servidor MCP (si se basa en MCP)
# Probar la funcionalidad de la herramienta MCP
echo '{"method": "tools/call", "params": {"name": "{nombre_herramienta}", "arguments": {}}}' | \
  uv run python -m src.main

# Validación de la base de datos (si hay integración con base de datos)
# Verificar el esquema de la base de datos, conexiones, migraciones
psql $DATABASE_URL -c "SELECT 1;" || echo "La conexión a la base de datos falló"

# Esperado: Todas las integraciones funcionando, respuestas adecuadas, sin errores de conexión
```

### Nivel 4: Validación Creativa y Específica del Dominio

```bash
# Ejemplos de Validación del Servidor MCP:

# Playwright MCP (para interfaces web)
playwright-mcp --url http://localhost:8000 --test-user-journey

# Docker MCP (para servicios en contenedores)
docker-mcp --build --test --cleanup

# Database MCP (para operaciones de datos)
database-mcp --validate-schema --test-queries --check-performance

# Validación de Lógica de Negocio Personalizada
# [Añadir comandos de validación específicos del dominio aquí]

# Pruebas de Rendimiento (si hay requisitos de rendimiento)
ab -n 100 -c 10 http://localhost:8000/{endpoint}

# Escaneo de Seguridad (si hay requisitos de seguridad)
bandit -r src/

# Pruebas de Carga (si hay requisitos de escalabilidad)
# wrk -t12 -c400 -d30s http://localhost:8000/{endpoint}

# Validación de la Documentación de la API (si hay endpoints de API)
# swagger-codegen validate -i openapi.json

# Esperado: Todas las validaciones creativas pasan, el rendimiento cumple con los requisitos
```

## Lista de Verificación de Validación Final

### Validación Técnica

- [ ] Los 4 niveles de validación se completaron con éxito.
- [ ] Todas las pruebas pasan: `uv run pytest src/ -v`
- [ ] Sin errores de linting: `uv run ruff check src/`
- [ ] Sin errores de tipo: `uv run mypy src/`
- [ ] Sin problemas de formato: `uv run ruff format src/ --check`

### Validación de la Funcionalidad

- [ ] Todos los criterios de éxito de la sección "Qué" se cumplieron.
- [ ] Las pruebas manuales fueron exitosas: [comandos específicos del Nivel 3]
- [ ] Los casos de error se manejan con elegancia con mensajes de error adecuados.
- [ ] Los puntos de integración funcionan como se especificó.
- [ ] Los requisitos de la persona de usuario se satisfacen (si aplica).

### Validación de la Calidad del Código

- [ ] Sigue los patrones y convenciones de nomenclatura existentes en la base de código.
- [ ] La ubicación de los archivos coincide con la estructura deseada del árbol de la base de código.
- [ ] Se evitaron los anti-patrones (verificar contra la sección de Anti-Patrones).
- [ ] Las dependencias se gestionan e importan correctamente.
- [ ] Los cambios de configuración se integraron correctamente.

### Documentación y Despliegue

- [ ] El código es autodocumentado con nombres de variables/funciones claros.
- [ ] Los registros son informativos pero no verbosos.
- [ ] Las variables de entorno se documentan si se añaden nuevas.

---

## Anti-Patrones a Evitar

- ❌ No crear nuevos patrones cuando los existentes funcionan.
- ❌ No saltarse la validación porque "debería funcionar".
- ❌ No ignorar las pruebas que fallan - arréglalas.
- ❌ No usar funciones síncronas en un contexto asíncrono.
- ❌ No codificar valores fijos que deberían estar en la configuración.
- ❌ No capturar todas las excepciones - sé específico.