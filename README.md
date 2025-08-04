# PRP (Prompts de Requisitos de Producto)

- Una colección de prompts que uso en mi trabajo diario.

## Video Explicativo

👉 https://www.youtube.com/watch?v=KVOZ9s1S9Gk&lc=UgzfwxvFjo6pKEyPo1R4AaABAg

### ☕ Apoya Este Trabajo

**¿Encontraste valor en estos recursos?**

👉 **Invítame a un café:** https://coff.ee/wirasm

Dediqué una cantidad considerable de tiempo a crear estos recursos y prompts. Si encuentras valor en este proyecto, por favor considera invitarme a un café para apoyar mi trabajo.

Eso me ayudará a mantener y mejorar los recursos disponibles de forma gratuita.

---

### 🎯 Transforma a Tu Equipo con Talleres de Ingeniería de IA

**¿Listo para pasar de demos de juguete a sistemas de IA listos para producción?**

👉 **Reserva un taller:** https://www.rasmuswiding.com/

✅ **Lo que obtendrás:**

-   Poner a tu equipo en el camino para convertirse en usuarios avanzados de IA.
-   Aprender la metodología PRP exacta utilizada por los mejores equipos de ingeniería.
-   Formación práctica con Claude Code, PRPs y bases de código reales.
-   Talleres de ingeniería de IA desde principiantes hasta avanzados para equipos e individuos.

💡 **Perfecto para:** Equipos de ingeniería, equipos de producto y desarrolladores que quieren una IA que realmente funcione en producción.

¡Hablemos!
Contáctame directamente en rasmus@widinglabs.com

# Recursos de Ingeniería de IA para Claude Code

Una biblioteca completa de assets e ingeniería de contexto para la Ingeniería de Agentes (Agentic Engineering), optimizada para Claude Code. Este repositorio proporciona la metodología de Prompt de Requisito de Producto (PRP), comandos preconfigurados y una extensa documentación para permitir el desarrollo asistido por IA que entrega código listo para producción en el primer intento.

## ¿Qué es un PRP?

Prompt de Requisito de Producto (PRP)

## En resumen

Un PRP es un PRD (Documento de Requisitos de Producto) + inteligencia curada de la base de código + agente/manual de ejecución—el paquete mínimo viable que una IA necesita para poder entregar de manera plausible código listo para producción en el primer intento.

El Prompt de Requisito de Producto (PRP) es una metodología de prompt estructurado establecida por primera vez en el verano de 2024, con la ingeniería de contexto en su núcleo. Un PRP suministra a un agente de codificación de IA todo lo que necesita para entregar una porción vertical de software funcional—ni más, ni menos.

### ¿Cómo se diferencia un PRP de un PRD tradicional?

Un PRD tradicional clarifica qué debe hacer el producto y por qué los clientes lo necesitan, pero evita deliberadamente cómo se construirá.

Un PRP mantiene las secciones de objetivo y justificación de un PRD, pero añade tres capas críticas para la IA:

### Contexto

Rutas y contenido de archivos precisos, versiones de bibliotecas y contexto de las mismas, ejemplos de fragmentos de código. Los LLMs generan código de mayor calidad cuando se les dan referencias directas en el prompt en lugar de descripciones amplias. Uso de un directorio `ai_docs/` para inyectar documentación de bibliotecas y otros documentos.

## Cómo Empezar

### Opción 1: Copiar Recursos a Tu Proyecto Existente

1.  **Copia los comandos de Claude** a tu proyecto:

    ```bash
    # Desde la raíz de tu proyecto
    cp -r /ruta/a/PRPs-agentic-eng/.claude/commands .claude/
    ```

2.  **Copia las plantillas de PRP y el ejecutor**:

    ```bash
    cp -r /ruta/a/PRPs-agentic-eng/PRPs/templates PRPs/
    cp -r /ruta/a/PRPs-agentic-eng/PRPs/scripts PRPs/
    cp /ruta/a/PRPs-agentic-eng/PRPs/README.md PRPs/
    ```

3.  **Copia la documentación de IA** (opcional pero recomendado):
    ```bash
    cp -r /ruta/a/PRPs-agentic-eng/PRPs/ai_docs PRPs/
    ```

### Opción 2: Clonar y Empezar un Nuevo Proyecto

1.  **Clona este repositorio**:

    ```bash
    git clone git@github.com:Evertdan/PRPs-Plantilla.git
    cd PRPs-Plantilla
    ```

2.  **Crea la estructura de tu proyecto**:

    ```bash
    # Ejemplo para un proyecto en Python
    mkdir -p src/tests
    touch src/__init__.py
    touch pyproject.toml
    touch CLAUDE.md
    ```

3.  **Inicializa con UV** (para proyectos en Python):
    ```bash
    uv venv
    uv sync
    ```

## Usando los Comandos de Claude

El directorio `.claude/commands/` contiene 12 comandos preconfigurados que aparecen como comandos de barra diagonal (`/`) en Claude Code.

### Comandos Disponibles

1.  **Creación y Ejecución de PRP**:
    -   `/create-base-prp` - Genera PRPs completos con investigación.
    -   `/execute-base-prp` - Ejecuta PRPs contra la base de código.
    -   `/planning-create` - Crea documentos de planificación con diagramas.
    -   `/spec-create-adv` - Creación avanzada de especificaciones.
    -   `/spec-execute` - Ejecuta especificaciones.

2.  **Revisión y Refactorización de Código**:
    -   `/review-general` - Revisión general de código.
    -   `/review-staged-unstaged` - Revisa cambios de git.
    -   `/refactor-simple` - Tareas simples de refactorización.

3.  **Git y GitHub**:
    -   `/create-pr` - Crea pull requests.

4.  **Utilidades**:
    -   `/prime-core` - Prepara a Claude con el contexto del proyecto.
    -   `/onboarding` - Proceso de incorporación para nuevos miembros del equipo.
    -   `/debug` - Flujo de trabajo de depuración.

### Cómo Usar los Comandos

1.  **En Claude Code**, escribe `/` para ver los comandos disponibles.
2.  **Selecciona un comando** y proporciona los argumentos cuando se te solicite.
3.  **Ejemplo de uso**:
    ```
    /create-base-prp sistema de autenticación de usuarios con OAuth2
    ```

## Usando PRPs

### Creando un PRP

1.  **Usa la plantilla** como punto de partida:

    ```bash
    cp PRPs/templates/prp_base.md PRPs/mi-funcionalidad.md
    ```

2.  **Rellena las secciones**:
    -   Objetivo: Qué se necesita construir.
    -   Por qué: Valor de negocio e impacto para el usuario.
    -   Contexto: Documentación, ejemplos de código, problemas conocidos.
    -   Plan de Implementación: Tareas y pseudocódigo.
    -   Bucle de Validación: Pruebas ejecutables.

3.  **O usa Claude para generar uno**:
    ```
    /create-base-prp implementar autenticación de usuarios con tokens JWT
    ```

### Ejecutando un PRP

1.  **Usando el script ejecutor**:

    ```bash
    # Modo interactivo (recomendado para desarrollo)
    uv run PRPs/scripts/prp_runner.py --prp mi-funcionalidad --interactive

    # Modo sin supervisión (para CI/CD)
    uv run PRPs/scripts/prp_runner.py --prp mi-funcionalidad --output-format json

    # JSON en streaming (para monitoreo en tiempo real)
    uv run PRPs/scripts/prp_runner.py --prp mi-funcionalidad --output-format stream-json
    ```

2.  **Usando los comandos de Claude**:
    ```
    /execute-base-prp PRPs/mi-funcionalidad.md
    ```

### Mejores Prácticas para PRPs

1.  **El Contexto es Rey**: Incluye TODA la documentación, ejemplos y advertencias necesarias.
2.  **Bucles de Validación**: Proporciona pruebas/linting ejecutables que la IA pueda correr y corregir.
3.  **Denso en Información**: Usa palabras clave y patrones de la base de código.
4.  **Éxito Progresivo**: Empieza simple, valida y luego mejora.

### Estructura de Ejemplo de un PRP

```markdown
## Objetivo

Implementar autenticación de usuarios con tokens JWT.

## Por qué

-   Habilitar sesiones de usuario seguras.
-   Soportar autenticación de API.
-   Reemplazar la autenticación básica con un estándar de la industria.

## Qué

Sistema de autenticación basado en JWT con inicio de sesión, cierre de sesión y actualización de token.

### Criterios de Éxito

-   [ ] Los usuarios pueden iniciar sesión con email/contraseña.
-   [ ] Los tokens JWT expiran después de 24 horas.
-   [ ] Los tokens de actualización funcionan correctamente.
-   [ ] Todos los endpoints están debidamente asegurados.

## Todo el Contexto Necesario

### Documentación y Referencias

-   url: https://jwt.io/introduction/
    why: Estructura y mejores prácticas de JWT.

-   file: src/auth/basic_auth.py
    why: Patrón de autenticación actual a reemplazar.

-   doc: https://fastapi.tiangolo.com/tutorial/security/oauth2-jwt/
    section: OAuth2 con Contraseña y JWT.

### Problemas Conocidos (Gotchas)

# CRÍTICO: Usar el algoritmo RS256 para producción.

# CRÍTICO: Almacenar los tokens de actualización en cookies httpOnly.

# CRÍTICO: Implementar una lista negra de tokens para el cierre de sesión.

## Plan de Implementación

[... plan de implementación detallado ...]

## Bucle de Validación

### Nivel 1: Sintaxis y Estilo

ruff check src/ --fix
mypy src/

### Nivel 2: Pruebas Unitarias

uv run pytest tests/test_auth.py -v

### Nivel 3: Prueba de Integración

curl -X POST http://localhost:8000/auth/login \
 -H "Content-Type: application/json" \
 -d '{"email": "test@example.com", "password": "testpass"}'
```

## Recomendaciones de Estructura de Proyecto

```
tu-proyecto/
|-- .claude/
|   |-- commands/          # Comandos de Claude Code
|   `-- settings.json      # Permisos de herramientas
|-- PRPs/
|   |-- templates/         # Plantillas de PRP
|   |-- scrips/           # Ejecutor de PRP
|   |-- ai_docs/          # Documentación de bibliotecas
|   |-- completed/        # PRPs finalizados
|   `-- *.md              # PRPs activos
|-- CLAUDE.md             # Directrices específicas del proyecto
|-- src/                  # Tu código fuente
`-- tests/                # Tus pruebas
```

## Configurando CLAUDE.md

Crea un archivo `CLAUDE.md` en la raíz de tu proyecto con:

1.  **Principios Fundamentales**: KISS, YAGNI, etc.
2.  **Estructura del Código**: Límites de tamaño de archivo, longitud de funciones.
3.  **Arquitectura**: Cómo está organizado tu proyecto.
4.  **Pruebas**: Patrones y requisitos de prueba.
5.  **Convenciones de Estilo**: Directrices específicas del lenguaje.
6.  **Comandos de Desarrollo**: Cómo ejecutar pruebas, linting, etc.

Consulta el `CLAUDE.md` de ejemplo en este repositorio para una plantilla completa.

## Uso Avanzado

### Ejecutando Múltiples Sesiones de Claude

Usa Git worktrees para desarrollo en paralelo:

```bash
git worktree add -b feature-auth ../project-auth
git worktree add -b feature-api ../project-api

# Ejecuta Claude en cada worktree
cd ../project-auth && claude
cd ../project-api && claude
```

### Integración con CI/CD

Usa el ejecutor de PRP en modo sin supervisión:

```yaml
# Ejemplo de GitHub Actions
- name: Ejecutar PRP
  run: |
    uv run PRPs/scripts/prp_runner.py \
      --prp implementar-funcionalidad \
      --output-format json > resultado.json
```

### Comandos Personalizados

Crea tus propios comandos en `.claude/commands/`:

```markdown
# .claude/commands/mi-comando.md

# Mi Comando Personalizado

Hacer algo específico para mi proyecto.

## Argumentos: $ARGUMENTS

[La implementación de tu comando]
```

## Recursos Incluidos

### Documentación (PRPs/ai_docs/)

-   `cc_base.md` - Documentación principal de Claude Code.
-   `cc_actions_sdk.md` - Integración con GitHub Actions y SDK.
-   `cc_best_practices.md` - Guía de mejores prácticas.
-   `cc_settings.md` - Configuración y seguridad.
-   `cc_tutorials.md` - Tutoriales paso a paso.

### Plantillas (PRPs/templates/)

-   `prp_base.md` - Plantilla completa de PRP con validación.
-   `prp_spec.md` - Plantilla de especificación.
-   `prp_planning_base.md` - Plantilla de planificación con diagramas.

### PRP de Ejemplo

-   `example-from-workshop-mcp-crawl4ai-refactor-1.md` - Ejemplo de refactorización del mundo real.

## Licencia

Licencia MIT

## Soporte

Dediqué una cantidad considerable de tiempo a crear estos recursos y prompts. Si encuentras valor en este proyecto, por favor considera invitarme a un café para apoyar mi trabajo.

👉 **Invítame a un café:** https://coff.ee/wirasm

---

Recuerda: El objetivo es el éxito de la implementación en un solo paso a través de un contexto completo. ¡Feliz codificación con Claude Code!
