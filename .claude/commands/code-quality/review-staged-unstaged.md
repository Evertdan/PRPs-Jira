Enumera y revisa cualquier archivo en el área de "staging", tanto los que están preparados ("staged") como los que no ("unstaged").
Asegúrate de mirar tanto los archivos nuevos como los modificados.

Revisa el `diff` de cada archivo para ver qué ha cambiado.

Informe de revisión anterior: $ARGUMENTS

Puede que se añada o no, ignora la revisión anterior si no se especifica.

## Áreas de Enfoque de la Revisión

1.  **Calidad del Código**
    -   Anotaciones de tipo (type hints) en todas las funciones y clases.
    -   Modelos de Pydantic v2 para la validación de datos.
    -   No usar sentencias `print()` (usar logging).
    -   Manejo adecuado de errores.
    -   Seguir el estándar PEP 8.
    -   Docstrings siguiendo el estilo de docstrings de Python de Google.

2.  **Patrones de Pydantic v2**
    -   Usar `ConfigDict` en lugar de `class Config`.
    -   Usar `field_validator` en lugar de `@validator`.
    -   Usar `model_dump()` en lugar de `dict()`.
    -   Uso adecuado de tipos `Annotated`.

3.  **Seguridad**
    -   Validación de entradas en todos los endpoints.
    -   Sin vulnerabilidades de inyección SQL.
    -   Contraseñas debidamente hasheadas.
    -   No tener secretos (secrets) hardcodeados.

4.  **Estructura**
    -   Las pruebas unitarias están ubicadas junto al código que prueban en carpetas `tests/`.
    -   Cada funcionalidad es autocontenida con sus propios modelos, servicios y herramientas.
    -   Los componentes compartidos son solo aquellos utilizados por múltiples funcionalidades.
    -   Mejoras futuras (como múltiples proveedores de IA) irían en `src/shared/ai_providers/` cuando se implementen.
    -   Las pruebas de integración permanecen en el nivel raíz en `tests/integration/`.

5.  **Linting**
    -   `ruff check --fix`
    -   `mypy`

6.  **Pruebas (Testing)**
    -   El código nuevo tiene pruebas.
    -   Casos borde cubiertos.
    -   Simulación (mocking) de dependencias externas.

7.  **Rendimiento**
    -   Sin consultas N+1.
    -   Algoritmos eficientes.
    -   Uso adecuado de `async`.

8.  **Documentación**
    -   `README` claro con instrucciones de configuración.
    -   `CLAUDE.md` está actualizado con cualquier nueva utilidad, dependencia, etc., importante para futuras instancias de Claude Code.

## Resultado de la Revisión

Crea un informe de revisión conciso con:

```markdown
# Revisión de Código #[número]

## Resumen
[Vistazo general de 2-3 frases]

## Problemas Encontrados

### 🔴 Crítico (Debe solucionarse)
- [Problema con archivo:línea y solución sugerida]

### 🟡 Importante (Debería solucionarse)
- [Problema con archivo:línea y solución sugerida]

### 🟢 Menor (A considerar)
- [Sugerencias de mejora]

## Buenas Prácticas
- [Qué se hizo bien]

## Cobertura de Pruebas
Actual: X% | Requerido: 80%
Pruebas faltantes: [lista]
Guardar informe en PRPs/revisiones_de_codigo/revision[#].md (revisar archivos existentes primero)
```