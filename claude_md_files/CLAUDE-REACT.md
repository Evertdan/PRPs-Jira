# CLAUDE.md

Este archivo proporciona orientación a Claude Code cuando se trabaja con aplicaciones React 19.

## Filosofía de Desarrollo Principal

### KISS (Keep It Simple, Stupid - Mantenlo Simple, Estúpido)

La simplicidad debe ser un objetivo clave en el diseño. Elige soluciones sencillas sobre las complejas siempre que sea posible. Las soluciones simples son más fáciles de entender, mantener y depurar.

### YAGNI (You Aren't Gonna Need It - No lo vas a necesitar)

Evita construir funcionalidades por especulación. Implementa características solo cuando sean necesarias, no cuando anticipes que podrían ser útiles en el futuro.

### Arquitectura Basada en Componentes

Construye con componentes reutilizables y componibles. Cada componente debe tener una responsabilidad única y clara, y ser autocontenido con sus propios estilos, pruebas y lógica co-ubicados.

### Rendimiento por Defecto

Con el compilador de React 19, las optimizaciones manuales son en gran medida innecesarias. Céntrate en un código limpio y legible y deja que el compilador se encargue de las optimizaciones de rendimiento.

### Principios de Diseño (DEBEN SEGUIRSE)

- **Arquitectura de "Vertical Slice"**: DEBE organizarse por características, no por capas.
- **Composición sobre Herencia**: DEBE usar el modelo de composición de React.
- **Fallar Rápido**: DEBE validar las entradas temprano con Zod, lanzar errores inmediatamente.

## 🤖 Directrices para el Asistente de IA

### Conciencia del Contexto

- Al implementar características, siempre revisa primero los patrones existentes.
- Prefiere la composición sobre la herencia en todos los diseños.
- Usa utilidades existentes antes de crear nuevas.
- Revisa si hay funcionalidades similares en otros dominios/características.

### Errores Comunes a Evitar

- Crear funcionalidades duplicadas.
- Sobrescribir pruebas existentes.
- Modificar frameworks principales sin instrucción explícita.
- Añadir dependencias sin revisar alternativas existentes.

### Patrones de Flujo de Trabajo

- Preferiblemente, crea pruebas ANTES de la implementación (TDD).
- Usa "pensar detenidamente" para las decisiones de arquitectura.
- Descompón tareas complejas en unidades más pequeñas y comprobables.
- Valida la comprensión antes de la implementación.

### Requisitos del Comando de Búsqueda

**CRÍTICO**: Siempre usa `rg` (ripgrep) en lugar de los comandos tradicionales `grep` y `find`:

```bash
# ❌ No uses grep
grep -r "patron" .

# ✅ Usa rg en su lugar
rg "patron"

# ❌ No uses find con name
find . -name "*.tsx"

# ✅ Usa rg con filtrado de archivos
rg --files | rg "\.tsx$"
# o
rg --files -g "*.tsx"
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

## 🚀 Características Clave de React 19

### Optimizaciones Automáticas

- **Compilador de React**: Elimina la necesidad de `useMemo`, `useCallback` y `React.memo`.
- Deja que el compilador se encargue del rendimiento - escribe código limpio y legible.

### Características Principales

- **Server Components**: Úsalos para la obtención de datos y contenido estático.
- **Actions**: Maneja operaciones asíncronas con estados pendientes incorporados.
- **API `use()`**: Obtención de datos y consumo de contexto simplificados.
- **Metadatos del Documento**: Soporte nativo para etiquetas de SEO.
- **Suspense Mejorado**: Mejores estados de carga y límites de error.

### Integración con TypeScript en React 19 (OBLIGATORIO)

- **DEBE usar `ReactElement` en lugar de `JSX.Element`** para los tipos de retorno.
- **DEBE importar `ReactElement` de 'react'** explícitamente.
- **NUNCA use el espacio de nombres `JSX.Element`** - use los tipos de React directamente.

```typescript
// ✅ CORRECTO: Tipado moderno de React 19
import { ReactElement } from 'react';

function MyComponent(): ReactElement {
  return <div>Contenido</div>;
}

const renderHelper = (): ReactElement | null => {
  return condition ? <span>Ayudante</span> : null;
};

// ❌ PROHIBIDO: Espacio de nombres JSX heredado
function MyComponent(): JSX.Element {  // No se puede encontrar el espacio de nombres 'JSX'
  return <div>Contenido</div>;
}
```

### Ejemplo de Actions (CON DOCUMENTACIÓN OBLIGATORIA)

````typescript
/**
 * @fileoverview Formulario de contacto usando la API de Actions de React 19
 * @module features/contact/components/ContactForm
 */

import { useActionState, ReactElement } from 'react';

/**
 * Componente de formulario de contacto usando Actions de React 19.
 *
 * Aprovecha la API de Actions para la gestión automática del estado pendiente
 * y el manejo de errores. Los datos del formulario se validan con Zod antes del envío.
 *
 * @component
 * @example
 * ```tsx
 * <ContactForm onSuccess={() => router.push('/gracias')} />
 * ```
 */
function ContactForm(): ReactElement {
  /**
   * Manejador de la acción del formulario con gestión de estado incorporada.
   *
   * @param previousState - Estado anterior del formulario (no utilizado en esta implementación)
   * @param formData - Datos brutos del formulario del envío
   * @returns Promesa que se resuelve con un estado de éxito o error
   */
  const [state, submitAction, isPending] = useActionState(
    async (previousState: any, formData: FormData) => {
      // Extraer y validar los datos del formulario
      const result = contactSchema.safeParse({
        email: formData.get('email'),
        message: formData.get('message'),
      });

      if (!result.success) {
        return { error: result.error.flatten() };
      }

      // Procesar datos validados
      await sendEmail(result.data);
      return { success: true };
    },
    null
  );

  return (
    <form action={submitAction}>
      <button disabled={isPending}>
        {isPending ? 'Enviando...' : 'Enviar'}
      </button>
    </form>
  );
}
````

## 🏗️ Estructura del Proyecto (Arquitectura de "Vertical Slice")

```
src/
├── features/              # Módulos basados en características
│   └── [feature]/
│       ├── __tests__/     # Pruebas co-ubicadas (DEBEN estar documentadas)
│       ├── components/    # Componentes de la característica (DEBEN tener JSDoc)
│       ├── hooks/         # Hooks específicos de la característica (DEBEN tener JSDoc)
│       ├── api/           # Integración de API (DEBE documentar endpoints)
│       ├── schemas/       # Esquemas de validación de Zod (DEBE documentar reglas de validación)
│       ├── types/         # Tipos de TypeScript (DEBE documentar tipos complejos)
│       └── index.ts       # API pública (DEBE tener documentación @module)
├── shared/
│   ├── components/        # Componentes de UI compartidos (DEBEN tener documentación de props)
│   ├── hooks/            # Hooks personalizados compartidos (DEBEN tener ejemplos de uso)
│   ├── utils/            # Funciones de utilidad (DEBEN tener JSDoc con ejemplos)
│   └── types/            # Tipos de TypeScript compartidos
└── test/                 # Utilidades y configuración de pruebas
```

## 🎯 Configuración de TypeScript (REQUISITOS ESTRICTOS) Asume requisitos estrictos incluso si la configuración del proyecto es más laxa

### DEBE seguir Estas Opciones del Compilador

```json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "noUncheckedIndexedAccess": true,
    "exactOptionalPropertyTypes": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noImplicitReturns": true,
    "allowJs": false
  }
}
```

### Requisitos de Tipado OBLIGATORIOS

- **NUNCA uses el tipo `any`** - usa `unknown` si el tipo es verdaderamente desconocido.
- **DEBE tener tipos de retorno explícitos** para todas las funciones y componentes.
- **DEBE usar restricciones genéricas adecuadas** para componentes reutilizables.
- **DEBE usar la inferencia de tipos de los esquemas de Zod** usando `z.infer<typeof schema>`.
- **NUNCA use `@ts-ignore`** o `@ts-expect-error` - corrige el problema de tipo adecuadamente.

### Jerarquía de Seguridad de Tipos (ORDEN ESTRICTO)

1. **Tipos Específicos**: Siempre prefiere tipos específicos cuando sea posible.
2. **Restricciones Genéricas**: Usa restricciones genéricas para código reutilizable.
3. **Unknown**: Usa `unknown` para datos verdaderamente desconocidos que serán validados.
4. **Nunca `any`**: La única excepción es la fusión de declaraciones de bibliotecas (debe estar comentada).

### Estructura del Proyecto TypeScript (OBLIGATORIO)

- **Código de la Aplicación**: `tsconfig.app.json` - cubre el directorio `src/`.
- **Configuración de Node**: `tsconfig.node.json` - DEBE incluir `vite.config.ts`, `vitest.config.ts`.
- **Integración con ESLint**: DEBE hacer referencia a ambos en `parserOptions.project`.

### Seguridad de Tipos "Brandeados" (OBLIGATORIO)

- **DEBE usar `Schema.parse()` para convertir tipos simples a tipos "brandeados"**.
- **NUNCA asuma que los datos externos coinciden con los tipos "brandeados"**.
- **Siempre valide en los límites del sistema**.

```typescript
// ✅ CORRECTO: Convertir tipos simples a tipos "brandeados"
const cvId = CVIdSchema.parse(numericId);

// ❌ PROHIBIDO: Asumir el tipo sin validación
const cvId: CVId = numericId; // Aserción de tipo sin validación
```

### Cumplimiento de `exactOptionalPropertyTypes` (OBLIGATORIO)

- **DEBE manejar `undefined` vs `null` adecuadamente** en las interfaces de API.
- **DEBE usar "spreads" condicionales** en lugar de pasar `undefined` a props opcionales.
- **DEBE convertir `undefined` a `null`** para los tipos de cuerpo de API.

```typescript
// ✅ CORRECTO: Manejar exactOptionalPropertyTypes adecuadamente
const apiCall = async (data?: string) => {
  return fetch('/api', {
    method: 'POST',
    body: data ? JSON.stringify({ data }) : null,  // null, no undefined
  });
};

// "Spreading" de props condicional para propiedades opcionales
<Input
  label="Correo electrónico"
  error={errors.email?.message}
  {...(showHelper ? { helperText: "Introduce un correo válido" } : {})}
/>

// ❌ PROHIBIDO: Pasar undefined a propiedades opcionales
<Input
  label="Correo electrónico"
  error={errors.email?.message}
  helperText={showHelper ? "Introduce un correo válido" : undefined}  // undefined no permitido
/>
```

## ⚡ Características Potentes de React 19

### Patrones de UI Instantáneos

- Usa límites de `Suspense` para TODAS las operaciones asíncronas.
- Aprovecha los `Server Components` para la obtención de datos.
- Usa la nueva API de `Actions` para el manejo de formularios.
- Deja que el Compilador de React se encargue de la optimización.

### Plantillas de Componentes

````typescript
// Componente rápido con todos los estados
export function FeatureComponent(): ReactElement {
  const { data, isLoading, error } = useQuery({
    queryKey: ['feature'],
    queryFn: fetchFeature
  });

  if (isLoading) return <Skeleton />;
  if (error) return <ErrorBoundary error={error} />;
  if (!data) return <EmptyState />;

  return <FeatureContent data={data} />;
}
````

## 🛡️ Validación de Datos con Zod (OBLIGATORIO PARA TODOS LOS DATOS EXTERNOS)

### DEBE Seguir Estas Reglas de Validación
- **DEBE validar TODOS los datos externos**: respuestas de API, entradas de formularios, parámetros de URL, variables de entorno.
- **DEBE usar tipos "brandeados" (branded types)**: para todos los IDs y valores específicos del dominio.
- **DEBE fallar rápido**: valida en los límites del sistema, lanza errores inmediatamente.
- **DEBE usar inferencia de tipos**: siempre deriva los tipos de TypeScript de los esquemas de Zod.
- **NUNCA confíe en datos externos** sin validación.
- **DEBE validar antes de usar** cualquier dato de fuera de la aplicación.

### Ejemplo de Esquema (PATRONES OBLIGATORIOS)
```typescript
import { z } from 'zod';

// DEBE usar tipos "brandeados" para TODOS los IDs
const UserIdSchema = z.string().uuid().brand<'UserId'>();
type UserId = z.infer<typeof UserIdSchema>;

// DEBE incluir validación para TODOS los campos
export const userSchema = z.object({
  id: UserIdSchema,
  email: z.string().email(),
  username: z.string()
    .min(3)
    .max(20)
    .regex(/^[a-zA-Z0-9_]+$/),
  age: z.number().min(18).max(100),
  role: z.enum(['admin', 'user', 'guest']),
  metadata: z.object({
    lastLogin: z.string().datetime(),
    preferences: z.record(z.unknown()).optional(),
  }),
});

export type User = z.infer<typeof userSchema>;

// DEBE validar TODAS las respuestas de la API
export const apiResponseSchema = <T extends z.ZodTypeAny>(dataSchema: T) =>
  z.object({
    success: z.boolean(),
    data: dataSchema,
    error: z.string().optional(),
    timestamp: z.string().datetime(),
  });
````

### Validación de Formularios con React Hook Form

```typescript
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

function UserForm(): JSX.Element {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<User>({
    resolver: zodResolver(userSchema),
    mode: 'onBlur',
  });

  const onSubmit = async (data: User): Promise<void> => {
    // Manejar datos validados
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {/* Campos del formulario */}
    </form>
  );
}
```

## 🧪 Estrategia de Pruebas (REQUISITOS OBLIGATORIOS)

### DEBE Cumplir Estos Estándares de Pruebas

- **MÍNIMO 80% de cobertura de código** - SIN EXCEPCIONES
- **DEBE co-ubicar las pruebas** con los componentes en carpetas `__tests__`.
- **DEBE usar React Testing Library** para todas las pruebas de componentes.
- **DEBE probar el comportamiento del usuario**, no los detalles de implementación.
- **DEBE simular (mock) las dependencias externas** apropiadamente.
- **NUNCA omita las pruebas** para nuevas características o correcciones de errores.

### Puertas de Calidad de SonarQube (DEBEN PASAR TODAS)

- **Complejidad Cognitiva**: MÁXIMO 15 por función.
- **Complejidad Ciclomática**: MÁXIMO 10 por función.
- **Líneas Duplicadas**: MÁXIMO 3%.
- **Ratio de Deuda Técnica**: MÁXIMO 5%.
- **TOLERANCIA CERO** para problemas críticos/bloqueadores.
- **TODO el código nuevo** debe tener más del 80% de cobertura.

### Ejemplo de Prueba (CON DOCUMENTACIÓN OBLIGATORIA)

```typescript
/**
 * @fileoverview Pruebas para el componente UserProfile
 * @module features/user/__tests__/UserProfile.test
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen, userEvent } from '@testing-library/react';

/**
 * Suite de pruebas para el componente UserProfile.
 *
 * Prueba las interacciones del usuario, la gestión del estado y el manejo de errores.
 * Simula las dependencias externas para asegurar pruebas unitarias aisladas.
 */
describe('UserProfile', () => {
  /**
   * Prueba que el nombre de usuario se actualiza correctamente al enviar el formulario.
   *
   * Verifica:
   * - El formulario se renderiza con los campos de entrada correctos.
   * - El usuario puede escribir en el campo de nombre.
   * - El botón de envío activa la actualización con los datos correctos.
   */
  it('debería actualizar el nombre de usuario al enviar el formulario', async () => {
    // Arrange: Configurar el evento de usuario y el manejador simulado
    const user = userEvent.setup();
    const onUpdate = vi.fn();

    // Act: Renderizar el componente e interactuar con el formulario
    render(<UserProfile onUpdate={onUpdate} />);

    const input = screen.getByLabelText(/nombre/i);
    await user.type(input, 'John Doe');
    await user.click(screen.getByRole('button', { name: /guardar/i }));

    // Assert: Verificar que el manejador fue llamado con los datos correctos
    expect(onUpdate).toHaveBeenCalledWith(
      expect.objectContaining({ name: 'John Doe' })
    );
  });
});
```

## 🧪 Excepciones de Pruebas (ALCANCE LIMITADO)

### Reglas de Archivos de Prueba OBLIGATORIAS

- **DEBE usar `unknown` en lugar de `any`** en las declaraciones de interfaz de Vitest.
- **DEBE deshabilitar las advertencias de actualización de React** en las utilidades de prueba con comentarios explícitos.
- **DEBE incluir archivos de configuración de pruebas** en los proyectos de TypeScript apropiados.
- **DEBE usar `globalThis` en lugar de `global`** para compatibilidad multiplataforma.

### Patrones de Archivos de Prueba Aceptables

```typescript
// ✅ ACEPTABLE: Fusión de declaraciones de interfaz de biblioteca
declare module "vitest" {
  interface Assertion {
    toCustomMatcher(): void; // retorno void, no genérico T
  }
  interface AsymmetricMatchersContaining {
    toCustomMatcher(): unknown; // unknown, no any
  }
}

// ✅ ACEPTABLE: Utilidad de prueba con desactivación de actualización de React
// eslint-disable-next-line react-refresh/only-export-components
export * from "@testing-library/react";

// ✅ ACEPTABLE: Acceso a objeto global multiplataforma
globalThis.fetch = vi.fn(); // No global.fetch

// ✅ ACEPTABLE: Variables de entorno de Vite en pruebas
Object.defineProperty(import.meta, "env", {
  value: { MODE: "test", DEV: false },
  writable: true,
});
```

### Requisitos de Configuración de Pruebas

```json
// tsconfig.node.json DEBE incluir TODOS los archivos de configuración de Node.js
{
  "include": ["vite.config.ts", "vitest.config.ts", "eslint.config.js"]
}

// eslint.config.js DEBE hacer referencia a TODOS los proyectos de TypeScript
{
  "parserOptions": {
    "project": ["./tsconfig.app.json", "./tsconfig.node.json"]
  }
}

// vite-env.d.ts DEBE incluir los globales de vitest
/// <reference types="vite/client" />
/// <reference types="vitest/globals" />
```

## 💅 Estilo y Calidad del Código

### Pila de Linting (OBLIGATORIA)

- **ESLint 9.x** con plugin de TypeScript.
- **Prettier 3.x** para el formato.
- **eslint-plugin-sonarjs** para la calidad del código.
- La validación pre-commit debe pasar antes de cualquier commit.

### Integración de ESLint con TypeScript (OBLIGATORIA)

- **Referencias de Proyecto**: DEBE incluir TODOS los archivos .ts/.tsx en `parserOptions.project`.
- **Archivos de Configuración**: Los archivos de configuración de Node.js (`vite.config.ts`, `vitest.config.ts`) pertenecen a `tsconfig.node.json`.
- **Cero Advertencias**: `--max-warnings 0` es OBLIGATORIO - sin excepciones.
- **Cobertura Completa**: Cada archivo de TypeScript DEBE ser analizable por ESLint.

### DEBE Seguir Estas Reglas

```javascript
{
  "rules": {
    "@typescript-eslint/no-explicit-any": "error",
    "@typescript-eslint/explicit-function-return-type": "error",
    "no-console": ["error", { "allow": ["warn", "error"] }],
    "react/function-component-definition": ["error", {
      "namedComponents": "arrow-function"
    }],
    "sonarjs/cognitive-complexity": ["error", 15],
    "sonarjs/no-duplicate-string": ["error", 3]
  }
}
```

## 🎨 Directrices de Componentes (REQUISITOS ESTRICTOS)

### Documentación JSDoc OBLIGATORIA

**DEBE documentar TODAS las funciones, clases y lógica compleja exportadas siguiendo los estándares de JSDoc de Google**

````typescript
/**
 * Calcula el precio con descuento de un producto.
 *
 * Este método aplica un descuento porcentual al precio original,
 * asegurando que el precio final no sea inferior al umbral mínimo.
 *
 * @param originalPrice - El precio original del producto en céntimos (debe ser positivo).
 * @param discountPercent - El porcentaje de descuento (0-100).
 * @param minPrice - El precio mínimo permitido después del descuento en céntimos.
 * @returns El precio con descuento calculado en céntimos.
 * @throws {ValidationError} Si algún parámetro es inválido.
 *
 * @example
 * ```typescript
 * const discountedPrice = calculateDiscount(10000, 25, 1000);
 * console.log(discountedPrice); // 7500
 * ```
 */
export function calculateDiscount(
  originalPrice: number,
  discountPercent: number,
  minPrice: number,
): number {
  // Validar entradas
  if (originalPrice <= 0) {
    throw new ValidationError("El precio original debe ser positivo");
  }

  // Calcular descuento
  const discountAmount = originalPrice * (discountPercent / 100);
  const discountedPrice = originalPrice - discountAmount;

  // Asegurar que el precio no baje del mínimo
  return Math.max(discountedPrice, minPrice);
}
````

### Documentación de Componentes OBLIGATORIA

````typescript
/**
 * Componente de botón con múltiples variantes y tamaños.
 *
 * Proporciona un botón reutilizable con un estilo y comportamiento consistentes
 * en toda la aplicación. Admite navegación por teclado y lectores de pantalla.
 *
 * @component
 * @example
 * ```tsx
 * <Button
 *   variant="primary"
 *   size="medium"
 *   onClick={handleSubmit}
 * >
 *   Enviar Formulario
 * </Button>
 * ```
 */
interface ButtonProps {
  /** Variante de estilo visual del botón */
  variant: "primary" | "secondary";

  /** Tamaño del botón @default 'medium' */
  size?: "small" | "medium" | "large";

  /** Manejador de clic para el botón */
  onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;

  /** Contenido a renderizar dentro del botón */
  children: React.ReactNode;

  /** Si el botón está deshabilitado @default false */
  disabled?: boolean;
}

const Button: React.FC<ButtonProps> = (
  {
    /* props */
  },
) => {
  // Implementación
};
````

### Estándares de Comentarios de Código OBLIGATORIOS

```typescript
// DEBE usar estos patrones de comentarios:

// 1. Cabeceras de archivo (REQUERIDO para todos los archivos)
/**
 * @fileoverview Servicio de autenticación de usuarios que maneja el inicio de sesión, cierre de sesión y gestión de sesiones.
 * @module features/auth/services/authService
 */

// 2. Lógica compleja (REQUERIDO cuando la complejidad cognitiva > 5)
/**
 * Valida los permisos del usuario contra los roles requeridos.
 *
 * Usa un sistema de roles jerárquico donde admin > editor > viewer.
 * Las comprobaciones se realizan mediante operaciones a nivel de bits para el rendimiento.
 */
function checkPermissions(userRole: Role, requiredRole: Role): boolean {
  // El administrador puede acceder a todo
  if (userRole === Role.Admin) return true;

  // Comprobar permisos jerárquicos
  return (userRole & requiredRole) === requiredRole;
}

// 3. TODOs (DEBE incluir el número de issue)
// TODO(#123): Implementar la limitación de velocidad para los intentos de inicio de sesión

// 4. Explicaciones en línea (REQUERIDO para código no obvio)
// Usar retroceso exponencial con fluctuación (jitter) para evitar la estampida (thundering herd)
const delay = Math.min(
  1000 * Math.pow(2, retryCount) + Math.random() * 1000,
  30000,
);
```

### Reglas de JSDoc OBLIGATORIAS

- **DEBE documentar TODAS las funciones exportadas** con JSDoc completo.
- **DEBE incluir `@param`** para cada parámetro con descripción.
- **DEBE incluir `@returns`** con descripción (a menos que sea void).
- **DEBE incluir `@throws`** para cualquier error lanzado.
- **DEBE incluir `@example`** para funciones complejas.
- **DEBE usar `@deprecated`** con una ruta de migración al depreciar.
- **DEBE documentar las props de los componentes** con descripciones.
- **DEBE añadir un `@fileoverview` a nivel de archivo** para cada módulo.
- **NUNCA use comentarios de una sola línea** para la documentación (`//` es solo para explicaciones en línea).

### Requisitos de TypeScript OBLIGATORIOS

```typescript
// ✅ REQUERIDO: Tipos explícitos, props claras
interface ButtonProps {
  variant: "primary" | "secondary";
  size?: "small" | "medium" | "large";
  onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
  children: React.ReactNode;
  disabled?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  variant,
  size = "medium",
  onClick,
  children,
  disabled = false,
}) => {
  // Implementación
};

// ❌ PROHIBIDO: Tipos implícitos, tipado laxo
const Button = ({ variant, onClick, children }: any) => {
  // Implementación
};
```

### Integración de Componentes (REQUISITOS ESTRICTOS)

- **DEBE verificar los nombres reales de las props** antes de usar los componentes.
- **DEBE usar los tipos de parámetros de callback exactos** de las interfaces de los componentes.
- **NUNCA asuma que los nombres de las props coinciden con las expectativas semánticas**.
- **DEBE importar los tipos adecuados** para los parámetros de callback.

```typescript
// ✅ CORRECTO: Verificar la interfaz del componente y usar los nombres de prop exactos
import { EducationList } from './EducationList';
import { EducationSummary } from './schemas';

<EducationList
  cvId={cvId}
  onSelectEducation={(education: EducationSummary) => handleEdit(education.id)}
  onCreateEducation={() => handleCreate()}
  showCreateButton={showActions}  // No showAddButton
  showActions={showActions}
/>

// ❌ PROHIBIDO: Asumir nombres de prop sin verificación
<EducationList
  cvId={cvId}
  onEditEducation={(education) => handleEdit(education.id)}  // Nombre de prop incorrecto
  onAddEducation={() => handleCreate()}  // Nombre de prop incorrecto
  showAddButton={showActions}  // Nombre de prop incorrecto
/>
```

### DEBE Seguir las Mejores Prácticas de Componentes

- **MÁXIMO 200 líneas** por archivo de componente.
- **DEBE seguir el principio de responsabilidad única**.
- **DEBE validar las props** con Zod al aceptar datos externos.
- **DEBE implementar límites de error** para todos los módulos de características.
- **DEBE manejar TODOS los estados**: carga, error, vacío y éxito.
- **NUNCA devuelva `null`** sin un manejo explícito del estado vacío.
- **DEBE incluir etiquetas ARIA** para la accesibilidad.

## 🔄 Gestión de Estado (JERARQUÍA ESTRICTA)

### DEBE Seguir Esta Jerarquía de Estado

1. **Estado Local**: `useState` SOLO para estado específico del componente.
2. **Contexto**: para estado entre componentes dentro de una sola característica.
3. **Estado del Servidor**: DEBE usar TanStack Query para TODOS los datos de la API.
4. **Estado Global**: Zustand SOLO cuando sea verdaderamente necesario en toda la aplicación.
5. **Estado de la URL**: DEBE usar parámetros de búsqueda para estado compartible.

### Patrón de Estado del Servidor OBLIGATORIO

````typescript
/**
 * @fileoverview Hook de obtención de datos de usuario con caché
 * @module features/user/hooks/useUser
 */

import { useQuery, useMutation } from "@tanstack/react-query";

/**
 * Hook personalizado para obtener y gestionar los datos del usuario.
 *
 * Implementa caché, re-obtención automática y actualizaciones optimistas.
 * Todas las respuestas de la API se validan con esquemas de Zod antes de su uso.
 *
 * @param id - El identificador único del usuario a obtener.
 * @returns Objeto de consulta con los datos del usuario, estados de carga y error.
 *
 * @example
 * ```tsx
 * const { data: user, isLoading, error } = useUser('123');
 *
 * if (isLoading) return <Spinner />;
 * if (error) return <ErrorMessage error={error} />;
 * return <UserProfile user={user} />;
 * ```
 */
function useUser(id: UserId) {
  return useQuery({
    queryKey: ["user", id],
    queryFn: async () => {
      const response = await fetch(`/api/users/${id}`);

      // Manejar errores HTTP
      if (!response.ok) {
        throw new ApiError("No se pudo obtener el usuario", response.status);
      }

      const data = await response.json();

      // DEBE validar con Zod - esto no es negociable
      return userSchema.parse(data);
    },
    staleTime: 5 * 60 * 1000, // Considerar los datos frescos durante 5 minutos
    retry: 3, // Reintentar las solicitudes fallidas 3 veces
  });
}
````

## 🔐 Requisitos de Seguridad (OBLIGATORIO)

### Validación de Entradas (DEBE IMPLEMENTARSE TODO)

- **DEBE sanear TODAS las entradas del usuario** con Zod antes de procesarlas.
- **DEBE validar las subidas de archivos**: tipo, tamaño y contenido.
- **DEBE prevenir XSS** con un escapado adecuado.
- **DEBE implementar cabeceras CSP** en producción.
- **NUNCA use dangerouslySetInnerHTML** sin sanitización.

### Seguridad de la API

- **DEBE validar TODAS las respuestas de la API** con esquemas de Zod.
- **DEBE manejar los errores con elegancia** sin exponer detalles internos.
- **NUNCA registre datos sensibles** (contraseñas, tokens, PII).

## 🚀 Directrices de Rendimiento

### Optimizaciones de React 19

- **Confía en el compilador** - evita la memoización manual.
- **Usa `Suspense`** para los límites de obtención de datos.
- **Implementa la división de código** a nivel de ruta.
- **Carga diferida (lazy load)** de componentes pesados.

### Optimización del Paquete (Bundle) (CON DOCUMENTACIÓN)

```typescript
/**
 * @fileoverview Configuración de Vite para compilaciones de producción optimizadas
 * @module vite.config
 */

// vite.config.ts
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        /**
         * Estrategia de fragmentación manual para un rendimiento de carga óptimo.
         * Separa las bibliotecas de proveedores del código de la aplicación para maximizar
         * la eficacia del almacenamiento en caché del navegador.
         */
        manualChunks: {
          // Bibliotecas principales de React - rara vez cambian
          "react-vendor": ["react", "react-dom"],
          // Bibliotecas de obtención de datos - frecuencia de cambio moderada
          "query-vendor": ["@tanstack/react-query"],
          // Bibliotecas de manejo de formularios - frecuencia de cambio moderada
          "form-vendor": ["react-hook-form", "zod"],
        },
      },
    },
  },
});
```

## ⚠️ DIRECTRICES CRÍTICAS (DEBEN SEGUIRSE TODAS)

1. **APLICAR TypeScript estricto** - CERO compromisos en la seguridad de tipos.
2. **VALIDAR todo con Zod** - Tanto como sea posible.
3. **MÍNIMO 80% de cobertura de pruebas** - SIN EXCEPCIONES.
4. **DEBE pasar TODAS las puertas de calidad de SonarQube** - No fusionar sin pasar.
5. **DEBE co-ubicar los archivos relacionados** - Las pruebas DEBEN estar en carpetas `__tests__`.
6. **MÁXIMO 200 líneas por componente** - Dividir si es más grande.
7. **MÁXIMA complejidad cognitiva de 15** - Refactorizar si es mayor.
8. **DEBE manejar TODOS los estados** - Carga, error, vacío y éxito.
9. **DEBE usar commits semánticos** - feat:, fix:, docs:, refactor:, test:.
10. **DEBE escribir JSDoc completo** - TODAS las exportaciones deben estar documentadas.
11. **DEBE pasar TODAS las comprobaciones automatizadas** - Antes de CUALQUIER fusión.

## 📦 Scripts de npm

```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "test": "vitest",
    "test:coverage": "vitest --coverage",
    "lint": "eslint . --ext ts,tsx --max-warnings 0",
    "format": "prettier --write \"src/**/*.{ts,tsx}\"",
    "type-check": "tsc --noEmit",
    "validate": "npm run type-check && npm run lint && npm run test:coverage"
  }
}
```

## 📋 Lista de Verificación Pre-commit (DEBEN COMPLETARSE TODAS)

- [ ] TypeScript compila con CERO errores.
- [ ] Los esquemas de Zod validan TODOS los datos externos.
- [ ] Pruebas escritas y pasando (MÍNIMO 80% de cobertura).
- [ ] ESLint pasa con CERO advertencias.
- [ ] La puerta de calidad de SonarQube PASÓ.
- [ ] TODOS los estados manejados (carga, error, vacío, éxito).
- [ ] Requisitos de accesibilidad cumplidos (etiquetas ARIA, navegación por teclado).
- [ ] CERO sentencias `console.log`.
- [ ] TODAS las funciones tienen documentación JSDoc completa.
- [ ] Las props de los componentes están completamente documentadas.
- [ ] La lógica compleja tiene comentarios explicativos.
- [ ] `@fileoverview` a nivel de archivo está presente.
- [ ] Los TODOs incluyen números de issue.
- [ ] Archivos de componentes de menos de 200 líneas.
- [ ] Complejidad cognitiva por debajo de 15 para todas las funciones.

### Prácticas PROHIBIDAS

- **NUNCA use el tipo `any`** (excepto para la fusión de declaraciones de bibliotecas con comentarios).
- **NUNCA omita las pruebas**.
- **NUNCA ignore los errores de TypeScript**.
- **NUNCA confíe en datos externos sin validación**.
- **NUNCA exceda los límites de complejidad**.
- **NUNCA omita la documentación**.
- **NUNCA use código no documentado**.
- **NUNCA use `JSX.Element`** - use `ReactElement` en su lugar.
- **NUNCA pase `undefined` a props opcionales** - use "spreads" condicionales.
- **NUNCA asuma los nombres de las props de los componentes** - verifique las interfaces primero.
- **NUNCA use `global`** - use `globalThis` para compatibilidad multiplataforma.
- **NUNCA omita los archivos de configuración de los proyectos de TypeScript** - incluya TODOS los archivos .ts.

---

## 📝 Actualizaciones Recientes

### Junio de 2025 - Actualización de Cumplimiento Estricto de TypeScript

Se añadió una guía completa basada en la solución de problemas del mundo real de más de 54 errores de TypeScript/ESLint:

- **Integración del Framework de Pruebas**: Globales de Vitest, excepciones de actualización de React, compatibilidad multiplataforma.
- **Patrones de TypeScript de React 19**: Migración de `JSX.Element` a `ReactElement`, patrones de importación modernos.
- **`exactOptionalPropertyTypes`**: Manejo de `undefined` vs `null`, "spreads" condicionales, tipos de cuerpo de API.
- **Seguridad de Tipos "Brandeados"**: Patrones de `Schema.parse()`, validación en los límites del sistema.
- **Integración de Componentes**: Verificación de nombres de props, precisión del tipo de callback, consistencia de la interfaz.
- **Configuración del Proyecto**: Referencias completas de proyectos de TypeScript, requisitos de cobertura de ESLint.

Estas adiciones aseguran cero errores de TypeScript y una alineación completa de IDE/CLI en modo estricto.

---

_Esta guía es un documento vivo. Actualízala a medida que surjan nuevos patrones y evolucionen las herramientas._
_Enfócate en la calidad sobre la velocidad, la mantenibilidad sobre la astucia._
_Última actualización: Diciembre de 2024_