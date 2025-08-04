# Definir Contrato de API Entre Backend y Frontend

Funcionalidad: $ARGUMENTS

## Tarea: Crear una especificación detallada del contrato de API para la coordinación entre backend y frontend

1.  **Definir endpoints RESTful**:

    ```yaml
    URL Base: /api/v1/{funcionalidad}

    Endpoints:
    - GET /api/v1/{funcionalidades}
      Parámetros de consulta: page, size, sort, filter
      Respuesta: Page<{Funcionalidad}Response>

    - GET /api/v1/{funcionalidades}/{id}
      Parámetro de ruta: id (Long)
      Respuesta: {Funcionalidad}Response

    - POST /api/v1/{funcionalidades}
      Cuerpo: {Funcionalidad}Request
      Respuesta: {Funcionalidad}Response (201 Created)

    - PUT /api/v1/{funcionalidades}/{id}
      Parámetro de ruta: id (Long)
      Cuerpo: {Funcionalidad}Request
      Respuesta: {Funcionalidad}Response

    - DELETE /api/v1/{funcionalidades}/{id}
      Parámetro de ruta: id (Long)
      Respuesta: 204 No Content
    ```

2.  **Definir DTOs (Data Transfer Objects) de solicitud/respuesta**:

    ```typescript
    // DTO de Solicitud (para POST/PUT)
    interface {Funcionalidad}Request {
      nombre: string;        // min: 2, max: 100
      descripcion?: string; // max: 1000
      // Añadir campos específicos del dominio
    }

    // DTO de Respuesta (para GET)
    interface {Funcionalidad}Response {
      id: number;
      nombre: string;
      descripcion?: string;
      createdAt: string;   // ISO 8601
      updatedAt: string;   // ISO 8601
      // Añadir campos calculados
    }

    // Envoltorio de respuesta de página
    interface Page<T> {
      content: T[];
      totalElements: number;
      totalPages: number;
      size: number;
      number: number;
    }
    ```

3.  **Definir respuestas de error**:

    ```json
    {
      "timestamp": "2024-01-20T10:30:00Z",
      "status": 400,
      "error": "Bad Request",
      "message": "Falló la validación",
      "path": "/api/v1/{funcionalidades}",
      "errors": [
        {
          "field": "nombre",
          "message": "El nombre es obligatorio"
        }
      ]
    }
    ```

4.  **Definir reglas de validación**:
    -   Backend: Anotaciones de Bean Validation.
    -   Frontend: Esquemas de Zod correspondientes.

    ```
    nombre: obligatorio, 2-100 caracteres
    descripcion: opcional, max 1000 caracteres
    email: formato de email válido
    fecha: formato ISO 8601
    ```

5.  **Definir códigos de estado**:
    -   200: OK (GET, PUT)
    -   201: Created (POST)
    -   204: No Content (DELETE)
    -   400: Bad Request (validación)
    -   404: Not Found
    -   409: Conflict (duplicado)
    -   500: Internal Server Error

6.  **Requisitos de integración**:
    -   CORS: Permitir el origen del frontend.
    -   Content-Type: application/json
    -   Autenticación: Bearer token (si es necesario).
    -   Paginación: Formato de Spring Pageable.
    -   Ordenación: campo,direccion (ej., "nombre,asc").

7.  **Notas de implementación para el Backend**:

    ```java
    // Los campos de la entidad coinciden con el DTO de respuesta
    // Usar MapStruct para el mapeo de DTOs
    // Convenciones de nomenclatura de métodos del repositorio
    // Validación en la capa de servicio
    ```

8.  **Notas de implementación para el Frontend**:
    ```typescript
    // Los esquemas de Zod coinciden con las reglas de validación
    // Cliente de API con configuración base
    // Hooks de TanStack Query
    // Utilidades de manejo de errores
    ```

Guarda este contrato como: `PRPs/contracts/{funcionalidad}-api-contract.md`

Comparte este archivo entre los equipos de backend y frontend para la alineación.