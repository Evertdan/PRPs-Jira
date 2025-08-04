# Analizar Historia de Usuario y Crear Plan de Implementación

Historia de Usuario: $ARGUMENTS

## Tarea: Crear un plan de implementación detallado para proyectos de backend y frontend separados, basado en la pila tecnológica detallada en la historia de usuario.

1.  **Analizar (Parse) la historia de usuario**:
    -   Extraer: Como [usuario], quiero [funcionalidad], para que [beneficio].
    -   Listar criterios de aceptación explícitos e implícitos.
    -   Identificar requisitos no funcionales (rendimiento, seguridad, UX).
    -   Definir métricas de éxito.

2.  **Planificar primero el contrato de la API** (acuerdo backend/frontend):
    ```yaml
    Endpoints:
      - GET /api/v1/{recursos} - Listar con paginación
      - GET /api/v1/{recursos}/{id} - Obtener un solo recurso
      - POST /api/v1/{recursos} - Crear nuevo
      - PUT /api/v1/{recursos}/{id} - Actualizar existente
      - DELETE /api/v1/{recursos}/{id} - Eliminar
   
    DTOs:
      Solicitud: {validaciones de campos}
      Respuesta: {tipos de campos}
      Error: {formato de error estándar}
    ```

3.  **Plan de implementación del Backend** (proyecto Java):
    ```
    Estructura de paquetes:
    com.empresa.funcionalidad/
    ├── controller/
    ├── service/
    ├── repository/
    ├── entity/
    ├── dto/
    ├── exception/
    └── mapper/
    ```
   
    Orden de implementación:
    1. Entidad con anotaciones JPA.
    2. Interfaz del Repositorio.
    3. DTOs con validación.
    4. Interfaz del Mapper.
    5. Servicio con lógica de negocio.
    6. Controlador con OpenAPI.
    7. Manejo de excepciones.
    8. Pruebas de integración.

4.  **Plan de implementación del Frontend** (proyecto React):
    ```
    src/features/{funcionalidad}/
    ├── api/          # Funciones del cliente de API
    ├── components/   # Componentes de UI
    ├── hooks/        # Hooks personalizados
    ├── schemas/      # Validación con Zod
    ├── types/        # Tipos de TypeScript
    ├── __tests__/    # Pruebas de componentes
    └── index.ts      # Exportaciones públicas
    ```
   
    Orden de implementación:
    1. Esquemas de Zod que coincidan con los DTOs del backend.
    2. Tipos de TypeScript.
    3. Funciones del cliente de API.
    4. Hooks personalizados con TanStack Query.
    5. Componentes de UI.
    6. Formularios con validación.
    7. Manejo de errores.
    8. Pruebas de componentes.

5.  **Plan de integración**:
    -   Configuración de CORS en el backend.
    -   Variables de entorno para la URL de la API.
    -   Manejo de respuestas de error.
    -   Estados de carga.
    -   Actualizaciones optimistas donde aplique.

6.  **Comandos de validación**:
    ```bash
    # Backend (en el proyecto Java)
    ./gradlew clean build test
   
    # Frontend (en el proyecto React)
    npm run type-check && npm run lint && npm run test:coverage
   
    # Integración (manual o e2e)
    - Iniciar backend: ./gradlew bootRun
    - Iniciar frontend: npm run dev
    - Probar el flujo de usuario completo
    ```

7.  **Mitigación de riesgos**:
    -   Comenzar con un acuerdo sobre el contrato de la API.
    -   Usar simulación (mocking) de la API en el frontend si el backend se retrasa.
    -   Implementar un endpoint de "health check".
    -   Añadir registro de solicitudes/respuestas.
    -   Planificar para escenarios de error.

Guarda este plan como: `PRPs/implementations/{funcionalidad}-plan.md`

Comparte este archivo entre los equipos de backend y frontend para la alineación.
