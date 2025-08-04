name: "Plantilla de PRP para TypeScript v3 - Enfocada en la Implementación con Estándares de Precisión"
description: |

---

## Objetivo

**Objetivo de la Funcionalidad**: [Estado final específico y medible de lo que se necesita construir]

**Entregable**: [Artefacto concreto - componente de React, ruta de API, integración, etc.]

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

- file: [ruta/exacta/al/archivo/de/patron.tsx]
  why: [Patrón específico a seguir - estructura de componente, uso de hooks, etc.]
  pattern: [Breve descripción de qué patrón extraer]
  gotcha: [Restricciones o limitaciones conocidas a evitar]

- docfile: [PRPs/ai_docs/typescript_specific.md]
  why: [Documentación personalizada para patrones complejos de TypeScript/Next.js]
  section: [Sección específica si el documento es grande]
```

### Árbol Actual de la Base de Código (ejecuta `tree` en la raíz del proyecto) para obtener una visión general de la base de código

```bash

```

### Árbol Deseado de la Base de Código con archivos a añadir y responsabilidad del archivo

```bash

```

### Problemas Conocidos (Gotchas) de nuestra base de código y Peculiaridades de las Bibliotecas

```typescript
// CRÍTICO: [Nombre de la biblioteca] requiere [configuración específica]
// Ejemplo: Next.js 15 App Router - Los manejadores de ruta deben exportar funciones con nombre.
// Ejemplo: La directiva 'use client' debe estar al principio del archivo, afecta a todo el árbol de componentes.
// Ejemplo: Los Componentes de Servidor no pueden usar APIs del navegador o manejadores de eventos.
// Ejemplo: Usamos el modo estricto de TypeScript y requerimos un tipado adecuado.
```

## Plan de Implementación

### Modelos de datos y estructura

Crear los modelos de datos principales, aseguramos la seguridad de tipos y la consistencia.

```typescript
Ejemplos:
 - esquemas de Zod para validación
 - interfaces/tipos de TypeScript
 - tipos de esquema de base de datos
 - tipos de respuesta de API
 - tipos de props de componentes

```

### Tareas de Implementación (ordenadas por dependencias)

```yaml
Tarea 1: CREAR lib/types/{dominio}.types.ts
  - IMPLEMENTAR: Interfaces y tipos de TypeScript para los modelos del dominio.
  - SEGUIR patrón: lib/types/existing.types.ts (estructura de interfaz, patrones de exportación).
  - NOMENCLATURA: PascalCase para interfaces, camelCase para propiedades.
  - UBICACIÓN: Definiciones de tipos en lib/types/.

Tarea 2: CREAR components/{dominio}/{NombreComponente}.tsx
  - IMPLEMENTAR: Componente de React con la interfaz de props de TypeScript adecuada.
  - SEGUIR patrón: components/existing/ExistingComponent.tsx (estructura de componente, tipado de props).
  - NOMENCLATURA: PascalCase para componentes, camelCase para props, kebab-case para clases CSS.
  - DEPENDENCIAS: Importar tipos de la Tarea 1.
  - UBICACIÓN: Capa de componentes en components/{dominio}/.

Tarea 3: CREAR app/api/{recurso}/route.ts
  - IMPLEMENTAR: Manejadores de ruta de la API de Next.js (GET, POST, etc.).
  - SEGUIR patrón: app/api/existing/route.ts (manejo de solicitud/respuesta, patrones de error).
  - NOMENCLATURA: Exportaciones con nombre (GET, POST, PUT, DELETE), tipado de TypeScript adecuado.
  - DEPENDENCIAS: Importar tipos y componentes de tareas anteriores.
  - UBICACIÓN: Rutas de API en app/api/{recurso}/.

Tarea 4: CREAR app/{funcionalidad}/page.tsx
  - IMPLEMENTAR: Componente de página de Next.js usando componentes del dominio.
  - SEGUIR patrón: app/existing-page/page.tsx (estructura de página, metadatos, límites de error).
  - NOMENCLATURA: Exportación por defecto, exportación de metadatos adecuada, props de página de TypeScript.
  - DEPENDENCIAS: Importar componentes de la Tarea 2, tipos de la Tarea 1.
  - UBICACIÓN: Rutas de página en app/{funcionalidad}/.

Tarea 5: CREAR hooks/use{AccionDominio}.ts
  - IMPLEMENTAR: Hooks personalizados de React para la gestión del estado y llamadas a la API.
  - SEGUIR patrón: hooks/useExisting.ts (estructura de hook, genéricos de TypeScript, manejo de errores).
  - NOMENCLATURA: use{NombreAccion} con tipos de retorno de TypeScript adecuados.
  - DEPENDENCIAS: Importar tipos de la Tarea 1, endpoints de API de la Tarea 3.
  - UBICACIÓN: Hooks personalizados en hooks/.

Tarea 6: CREAR __tests__/{componente}.test.tsx
  - IMPLEMENTAR: Pruebas de Jest/Testing Library para componentes y hooks.
  - SEGUIR patrón: __tests__/existing.test.tsx (estructura de prueba, patrones de simulación).
  - NOMENCLATURA: Bloques `describe`, convenciones de nomenclatura de pruebas, tipado de pruebas de TypeScript.
  - COBERTURA: Todos los componentes y hooks con casos de prueba positivos y negativos.
  - UBICACIÓN: Pruebas junto al código que prueban.
```

### Patrones de Implementación y Detalles Clave

```typescript
// Muestra patrones críticos y problemas conocidos - sé conciso, céntrate en detalles no obvios

// Ejemplo: Patrón de componente
interface {Dominio}Props {
  // PATRÓN: Interfaces estrictas de TypeScript (seguir lib/types/existing.types.ts)
  data: {Dominio}Data;
  onAction?: (id: string) => void;
}

export function {Dominio}Component({ data, onAction }: {Dominio}Props) {
  // PATRÓN: Patrones de componente Cliente/Servidor (revisar componentes existentes)
  // GOTCHA: Se necesita 'use client' para manejadores de eventos, useState, useEffect
  // CRÍTICO: Componentes de Servidor para la obtención de datos, Componentes de Cliente para la interactividad

  return (
    // PATRÓN: Enfoque de estilo consistente (ver components/ui/)
    <div className="existing-class-pattern">
      {/* Seguir los patrones de composición de componentes existentes */}
    </div>
  );
}

// Ejemplo: Patrón de ruta de API
export async function GET(request: Request): Promise<Response> {
  // PATRÓN: Validación de solicitud y manejo de errores (ver app/api/existing/route.ts)
  // GOTCHA: [Restricción específica de TypeScript o requisito de Next.js]
  // RETORNAR: Objeto Response con tipado de TypeScript adecuado
}

// Ejemplo: Patrón de hook personalizado
export function use{AccionDominio}(): {Dominio}ActionResult {
  // PATRÓN: Estructura de hook con genéricos de TypeScript (ver hooks/useExisting.ts)
  // GOTCHA: [Reglas de los hooks de React y requisitos de tipado de TypeScript]
}
```

### Puntos de Integración

```yaml
BASE DE DATOS:
  - migración: "Añadir tabla 'feature_data' con los índices adecuados"
  - cliente: "@/lib/database/client"
  - patrón: "createClient() para componentes de cliente, createServerClient() para componentes de servidor"

CONFIGURACIÓN:
  - añadir a: .env.local
  - patrón: "NEXT_PUBLIC_* para variables de entorno del lado del cliente"
  - patrón: "FEATURE_TIMEOUT = process.env.FEATURE_TIMEOUT || '30000'"

RUTAS:
  - estructura de archivos: app/nombre-funcionalidad/page.tsx
  - rutas de api: app/api/nombre-funcionalidad/route.ts
  - middleware: middleware.ts (a nivel raíz)
```

## Bucle de Validación

### Nivel 1: Sintaxis y Estilo (Retroalimentación Inmediata)

```bash
# Ejecutar después de la creación de cada archivo - corregir antes de continuar
npm run lint                    # Verificaciones de ESLint con reglas de TypeScript
npx tsc --noEmit               # Verificación de tipos de TypeScript (sin salida de JS)
npm run format                 # Formateo con Prettier

# Validación a nivel de proyecto
npm run lint:fix               # Auto-corregir problemas de linting
npm run type-check             # Validación completa de TypeScript

# Esperado: Cero errores. Si existen errores, LEER la salida y corregir antes de continuar.
```

### Nivel 2: Pruebas Unitarias (Validación de Componentes)

```bash
# Probar cada componente/hook a medida que se crea
npm test -- __tests__/{dominio}.test.tsx
npm test -- __tests__/use{Hook}.test.ts

# Suite de pruebas completa para las áreas afectadas
npm test -- components/{dominio}/
npm test -- hooks/

# Validación de cobertura (si está disponible)
npm test -- --coverage --watchAll=false

# Esperado: Todas las pruebas pasan. Si fallan, depurar la causa raíz y corregir la implementación.
```

### Nivel 3: Pruebas de Integración (Validación del Sistema)

```bash
# Validación del servidor de desarrollo
npm run dev & 
sleep 5  # Dar tiempo para el arranque de Next.js

# Validación de la carga de la página
curl -I http://localhost:3000/{pagina-funcionalidad}
# Esperado: Respuesta 200 OK

# Validación del endpoint de la API
curl -X POST http://localhost:3000/api/{recurso} \
  -H "Content-Type: application/json" \
  -d '{"test": "data"}' \
  | jq .  # Imprimir en formato legible la respuesta JSON

# Validación del build de producción
npm run build
# Esperado: Build exitoso sin errores o advertencias de TypeScript

# Validación del renderizado de componentes (si es SSR/SSG)
curl http://localhost:3000/{pagina} | grep -q "contenido-esperado"

# Esperado: Todas las integraciones funcionando, respuestas adecuadas, sin errores de hidratación
```

### Nivel 4: Validación Creativa y Específica del Dominio

```bash
# Validación Específica de TypeScript/Next.js:

# Rendimiento del build de producción
npm run build && npm run analyze  # Analizador de bundle si está disponible

# Validación de la seguridad de tipos
npx tsc --noEmit --strict        # Verificación estricta de TypeScript

# Verificaciones específicas de Next.js
npm run lint:next                # Reglas de linting de Next.js si están disponibles

# Ejemplos de Validación del Servidor MCP:
# Playwright MCP (para pruebas E2E)
playwright-mcp --test-user-flows --browser chromium

# Performance MCP (para auditorías de Lighthouse)
lighthouse-mcp --url http://localhost:3000 --audit performance

# Accessibility MCP (para pruebas de accesibilidad)
axe-mcp --scan http://localhost:3000/{paginas}

# Validación Personalizada de TypeScript/React
# Pruebas de integración de React Testing Library
# Pruebas de regresión visual de Storybook (si están disponibles)
# Cumplimiento del modo estricto de TypeScript

# Esperado: Todas las validaciones creativas pasan, se cumplen los estándares de rendimiento/accesibilidad
```

## Lista de Verificación de Validación Final

### Validación Técnica

- [ ] Los 4 niveles de validación se completaron con éxito.
- [ ] Todas las pruebas pasan: `npm test`
- [ ] Sin errores de linting: `npm run lint`
- [ ] Sin errores de tipo: `npx tsc --noEmit`
- [ ] Sin problemas de formato: `npm run format --check`
- [ ] El build de producción tiene éxito: `npm run build`

### Validación de la Funcionalidad

- [ ] Todos los criterios de éxito de la sección "Qué" se cumplieron.
- [ ] Las pruebas manuales fueron exitosas: [comandos específicos del Nivel 3]
- [ ] Los casos de error se manejan con elegancia con tipos de error de TypeScript adecuados.
- [ ] Los puntos de integración funcionan como se especificó.
- [ ] Los requisitos de la persona de usuario se satisfacen (si aplica).

### Validación de la Calidad del Código

- [ ] Sigue los patrones y convenciones de nomenclatura existentes de TypeScript/React.
- [ ] La ubicación de los archivos coincide con la estructura deseada del árbol de la base de código.
- [ ] Se evitaron los anti-patrones (verificar contra la sección de Anti-Patrones).
- [ ] Las dependencias se gestionan correctamente con los tipados de TypeScript correctos.
- [ ] Los cambios de configuración se integraron correctamente.

### Específico de TypeScript/Next.js

- [ ] Interfaces y tipos de TypeScript adecuados definidos.
- [ ] Los patrones de componente Servidor/Cliente se siguieron correctamente.
- [ ] Las directivas 'use client' se usaron apropiadamente.
- [ ] Las rutas de API siguen los patrones del App Router de Next.js.
- [ ] Sin desajustes de hidratación entre el renderizado del servidor/cliente.

### Documentación y Despliegue

- [ ] El código es autodocumentado con tipos de TypeScript claros.
- [ ] Las interfaces de las props están debidamente documentadas.
- [ ] Las variables de entorno se documentan si se añaden nuevas.

---

## Anti-Patrones a Evitar

- ❌ No crear nuevos patrones cuando los existentes funcionan.
- ❌ No saltarse la validación porque "debería funcionar".
- ❌ No ignorar las pruebas que fallan - arréglalas.
- ❌ No usar 'use client' innecesariamente - aprovecha los Componentes de Servidor.
- ❌ No codificar valores fijos que deberían estar en la configuración.
- ❌ No capturar todas las excepciones - sé específico.