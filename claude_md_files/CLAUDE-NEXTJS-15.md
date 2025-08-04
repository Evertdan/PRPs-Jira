# CLAUDE.md

Este archivo proporciona una guía completa a Claude Code cuando se trabaja con aplicaciones Next.js 15 con React 19 y TypeScript.

## Filosofía de Desarrollo Principal

### KISS (Keep It Simple, Stupid - Mantenlo Simple, Estúpido)
La simplicidad debe ser un objetivo clave en el diseño. Elige soluciones sencillas sobre las complejas siempre que sea posible. Las soluciones simples son más fáciles de entender, mantener y depurar.

### YAGNI (You Aren't Gonna Need It - No lo vas a necesitar)
Evita construir funcionalidades por especulación. Implementa características solo cuando sean necesarias, no cuando anticipes que podrían ser útiles en el futuro.

### Principios de Diseño
- **Inversión de Dependencias**: Los módulos de alto nivel no deben depender de los de bajo nivel. Ambos deben depender de abstracciones.
- **Principio Abierto/Cerrado**: Las entidades de software deben estar abiertas a la extensión pero cerradas a la modificación.
- **Arquitectura de "Vertical Slice"**: Organiza por características, no por capas.
- **Primero los Componentes**: Construye con componentes reutilizables y componibles con una única responsabilidad.
- **Fallar Rápido**: Valida las entradas temprano, lanza errores inmediatamente.

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

## 🧱 Estructura del Código y Modularidad

### Límites de Archivos y Componentes
- **Nunca crees un archivo de más de 500 líneas de código.** Si te acercas a este límite, refactoriza dividiendo en módulos o archivos auxiliares.
- **Los componentes deben tener menos de 200 líneas** para una mejor mantenibilidad.
- **Las funciones deben ser cortas y enfocadas, de menos de 50 líneas** y tener una única responsabilidad.
- **Organiza el código en módulos claramente separados**, agrupados por característica o responsabilidad.

## 🚀 Características Clave de Next.js 15 y React 19

### Características Principales de Next.js 15
- **Turbopack**: Empaquetador rápido para desarrollo (estable).
- **App Router**: Enrutador basado en el sistema de archivos con diseños y enrutamiento anidado.
- **Server Components**: Componentes de Servidor de React para el rendimiento.
- **Server Actions**: Funciones de servidor seguras en tipos.
- **Rutas Paralelas**: Renderizado concurrente de múltiples páginas.
- **Rutas de Interceptación**: Experiencias tipo modal.

### Características de React 19
- **Compilador de React**: Elimina la necesidad de `useMemo`, `useCallback` y `React.memo`.
- **Actions**: Maneja operaciones asíncronas con estados pendientes incorporados.
- **API `use()`**: Obtención de datos y consumo de contexto simplificados.
- **Metadatos del Documento**: Soporte nativo para etiquetas de SEO.
- **Suspense Mejorado**: Mejores estados de carga y límites de error.

### Integración con TypeScript (OBLIGATORIO)
- **DEBE usar `ReactElement` en lugar de `JSX.Element`** para los tipos de retorno.
- **DEBE importar tipos de 'react'** explícitamente.
- **NUNCA use el espacio de nombres `JSX.Element`** - use los tipos de React directamente.

```typescript
// ✅ CORRECTO: Tipado moderno de React 19
import { ReactElement } from 'react';

function MyComponent(): ReactElement {
  return <div>Contenido</div>;
}

// ❌ PROHIBIDO: Espacio de nombres JSX heredado
function MyComponent(): JSX.Element {  // No se puede encontrar el espacio de nombres 'JSX'
  return <div>Contenido</div>;
}
```

## 🏗️ Estructura del Proyecto (Arquitectura de "Vertical Slice")

```
src/
├── app/                   # App Router de Next.js
│   ├── (routes)/          # Grupos de rutas
│   ├── globals.css        # Estilos globales
│   ├── layout.tsx         # Diseño raíz
│   └── page.tsx           # Página de inicio
├── components/            # Componentes de UI compartidos
│   ├── ui/                # Componentes base (shadcn/ui)
│   └── common/            # Componentes compartidos específicos de la aplicación
├── features/              # Módulos basados en características (RECOMENDADO)
│   └── [feature]/
│       ├── __tests__/     # Pruebas co-ubicadas
│       ├── components/    # Componentes de la característica
│       ├── hooks/         # Hooks específicos de la característica
│       ├── api/           # Integración de API
│       ├── schemas/       # Esquemas de validación de Zod
│       ├── types/         # Tipos de TypeScript
│       └── index.ts       # API pública
├── lib/                   # Utilidades y configuraciones principales
│   ├── utils.ts           # Funciones de utilidad
│   ├── env.ts             # Validación del entorno
│   └── constants.ts       # Constantes de la aplicación
├── hooks/                 # Hooks personalizados compartidos
├── styles/                # Archivos de estilos
└── types/                 # Tipos de TypeScript compartidos
```

## 🎯 Configuración de TypeScript (REQUISITOS ESTRICTOS)

### DEBE Seguir Estas Opciones del Compilador
```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["dom", "dom.iterable", "es6"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "noUncheckedIndexedAccess": true,
    "exactOptionalPropertyTypes": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noImplicitReturns": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "baseUrl": ".",
    "paths": { "@/*": ["./src/*"] }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

### Requisitos de Tipado OBLIGATORIOS
- **NUNCA uses el tipo `any`** - usa `unknown` si el tipo es verdaderamente desconocido.
- **DEBE tener tipos de retorno explícitos** para todas las funciones y componentes.
- **DEBE usar restricciones genéricas adecuadas** para componentes reutilizables.
- **DEBE usar la inferencia de tipos de los esquemas de Zod** usando `z.infer<typeof schema>`.
- **NUNCA use `@ts-ignore`** o `@ts-expect-error` - corrige el problema de tipo adecuadamente.

## 📦 Gestión de Paquetes y Dependencias

### Dependencias Esenciales de Next.js 15
```json
{
  "dependencies": {
    "next": "^15.0.0",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "typescript": "^5.0.0"
  },
  "devDependencies": {
    "@types/node": "^20",
    "@types/react": "^18",
    "@types/react-dom": "^18",
    "eslint": "^8",
    "eslint-config-next": "15.0.0",
    "prettier": "^3.0.0",
    "tailwindcss": "^3.4.0",
    "postcss": "^8.4.0",
    "autoprefixer": "^10.4.0"
  }
}
```

### Dependencias Adicionales Recomendadas
```bash
# UI y Estilos
npm install @radix-ui/react-* class-variance-authority clsx tailwind-merge

# Manejo de Formularios y Validación
npm install react-hook-form @hookform/resolvers zod

# Gestión de Estado (cuando sea necesario)
npm install @tanstack/react-query zustand

# Herramientas de Desarrollo
npm install -D @testing-library/react @testing-library/jest-dom vitest jsdom
```

## 🛡️ Validación de Datos con Zod (OBLIGATORIO PARA TODOS LOS DATOS EXTERNOS)

### DEBE Seguir Estas Reglas de Validación
- **DEBE validar TODOS los datos externos**: respuestas de API, entradas de formularios, parámetros de URL, variables de entorno.
- **DEBE usar tipos "brandeados" (branded types)**: para todos los IDs y valores específicos del dominio.
- **DEBE fallar rápido**: valida en los límites del sistema, lanza errores inmediatamente.
- **DEBE usar inferencia de tipos**: siempre deriva los tipos de TypeScript de los esquemas de Zod.

### Ejemplo de Esquema (PATRONES OBLIGATORIOS)
```typescript
import { z } from 'zod';

// DEBE usar tipos "brandeados" para TODOS los IDs
const UserIdSchema = z.string().uuid().brand<'UserId'>();
type UserId = z.infer<typeof UserIdSchema>;

// Validación del entorno (REQUERIDO)
export const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']),
  NEXT_PUBLIC_APP_URL: z.string().url(),
  DATABASE_URL: z.string().min(1),
  NEXTAUTH_SECRET: z.string().min(1),
  NEXTAUTH_URL: z.string().url(),
});

export const env = envSchema.parse(process.env);

// Validación de respuesta de API
export const apiResponseSchema = <T extends z.ZodTypeAny>(dataSchema: T) =>
  z.object({
    success: z.boolean(),
    data: dataSchema,
    error: z.string().optional(),
    timestamp: z.string().datetime(),
  });
```

### Validación de Formularios con React Hook Form
```typescript
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

const formSchema = z.object({
  email: z.string().email(),
  username: z.string().min(3).max(20),
});

type FormData = z.infer<typeof formSchema>;

function UserForm(): ReactElement {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    mode: 'onBlur',
  });

  const onSubmit = async (data: FormData): Promise<void> => {
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

### Configuración de Pruebas (Vitest + React Testing Library)
```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    coverage: {
      reporter: ['text', 'json', 'html'],
      threshold: {
        global: {
          branches: 80,
          functions: 80,
          lines: 80,
          statements: 80,
        },
      },
    },
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
});
```

### Ejemplo de Prueba (CON DOCUMENTACIÓN OBLIGATORIA)
```typescript
/**
 * @fileoverview Pruebas para el componente UserProfile
 * @module components/__tests__/UserProfile.test
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen, userEvent } from '@testing-library/react';
import { UserProfile } from '../UserProfile';

/**
 * Suite de pruebas para el componente UserProfile.
 * 
 * Prueba las interacciones del usuario, la gestión del estado y el manejo de errores.
 * Simula las dependencias externas para asegurar pruebas unitarias aisladas.
 */
describe('UserProfile', () => {
  /**
   * Prueba que el nombre de usuario se actualiza correctamente al enviar el formulario.
   */
  it('debería actualizar el nombre de usuario al enviar el formulario', async () => {
    const user = userEvent.setup();
    const onUpdate = vi.fn();
    
    render(<UserProfile onUpdate={onUpdate} />);
    
    const input = screen.getByLabelText(/nombre/i);
    await user.type(input, 'John Doe');
    await user.click(screen.getByRole('button', { name: /guardar/i }));
    
    expect(onUpdate).toHaveBeenCalledWith(
      expect.objectContaining({ name: 'John Doe' })
    );
  });
});
```

## 🎨 Directrices de Componentes (REQUISITOS ESTRICTOS)

### Documentación de Componentes OBLIGATORIA

```typescript
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
  variant: 'primary' | 'secondary';
  
  /** Tamaño del botón @default 'medium' */
  size?: 'small' | 'medium' | 'large';
  
  /** Manejador de clic para el botón */
  onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
  
  /** Contenido a renderizar dentro del botón */
  children: React.ReactNode;
  
  /** Si el botón está deshabilitado @default false */
  disabled?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant, size = 'medium', onClick, children, disabled = false }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(buttonVariants({ variant, size }))}
        onClick={onClick}
        disabled={disabled}
      >
        {children}
      </button>
    );
  }
);
Button.displayName = 'Button';
```

### Patrón de Componentes Shadcn/UI (RECOMENDADO)
```typescript
"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground shadow hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
        outline: "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
```

## 🔄 Gestión de Estado (JERARQUÍA ESTRICTA)

### DEBE Seguir Esta Jerarquía de Estado
1. **Estado Local**: `useState` SOLO para estado específico del componente.
2. **Contexto**: para estado entre componentes dentro de una sola característica.
3. **Estado de la URL**: DEBE usar parámetros de búsqueda para estado compartible.
4. **Estado del Servidor**: DEBE usar TanStack Query para TODOS los datos de la API.
5. **Estado Global**: Zustand SOLO cuando sea verdaderamente necesario en toda la aplicación.

### Patrón de Estado del Servidor (TanStack Query)
```typescript
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

function useUser(id: UserId) {
  return useQuery({
    queryKey: ['user', id],
    queryFn: async () => {
      const response = await fetch(`/api/users/${id}`);
      
      if (!response.ok) {
        throw new ApiError('No se pudo obtener el usuario', response.status);
      }
      
      const data = await response.json();
      return userSchema.parse(data);
    },
    staleTime: 5 * 60 * 1000, // 5 minutos
    retry: 3,
  });
}

function useUpdateUser() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (userData: UpdateUserData) => {
      const response = await fetch('/api/users', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });
      
      if (!response.ok) {
        throw new ApiError('No se pudo actualizar el usuario', response.status);
      }
      
      return response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['user'] });
    },
  });
}
```

## 🔐 Requisitos de Seguridad (OBLIGATORIO)

### Validación de Entradas (DEBE IMPLEMENTARSE TODO)
- **DEBE sanear TODAS las entradas del usuario** con Zod antes de procesarlas.
- **DEBE validar las subidas de archivos**: tipo, tamaño y contenido.
- **DEBE prevenir XSS** con un escapado adecuado.
- **DEBE implementar protección CSRF** para los formularios.
- **NUNCA use dangerouslySetInnerHTML** sin sanitización.

### Variables de Entorno (DEBEN VALIDARSE)
```typescript
// lib/env.ts
import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']),
  NEXT_PUBLIC_APP_URL: z.string().url(),
  DATABASE_URL: z.string().min(1),
  NEXTAUTH_SECRET: z.string().min(32),
  NEXTAUTH_URL: z.string().url(),
});

export const env = envSchema.parse(process.env);
```

## 🚀 Directrices de Rendimiento

### Optimizaciones de Next.js 15
- **Usar Server Components** por defecto para la obtención de datos.
- **Client Components** solo cuando sea necesario (interactividad).
- **Importaciones dinámicas** para componentes de cliente grandes.
- **Optimización de imágenes** con `next/image`.
- **Optimización de fuentes** con `next/font`.

### Optimización del Paquete (Bundle)
```typescript
// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    turbo: {
      // Configuración de Turbopack
    },
  },
  images: {
    formats: ['image/webp', 'image/avif'],
  },
  // Analizador de bundle
  webpack: (config, { dev, isServer }) => {
    if (!dev && !isServer) {
      config.optimization.splitChunks.chunks = 'all';
    }
    return config;
  },
};

module.exports = nextConfig;
```

## 💅 Estilo y Calidad del Código

### Configuración de ESLint (OBLIGATORIA)
```javascript
// eslint.config.js
import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    rules: {
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/explicit-function-return-type": "error",
      "no-console": ["error", { "allow": ["warn", "error"] }],
      "react/function-component-definition": ["error", {
        "namedComponents": "arrow-function"
      }],
    },
  },
];

export default eslintConfig;
```

## 📋 Comandos de Desarrollo

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint --max-warnings 0",
    "lint:fix": "next lint --fix",
    "test": "vitest",
    "test:watch": "vitest --watch",
    "test:coverage": "vitest --coverage",
    "test:ui": "vitest --ui",
    "type-check": "tsc --noEmit",
    "format": "prettier --write \"src/**/*.{ts,tsx,js,jsx,json,css,md}\"",
    "format:check": "prettier --check \"src/**/*.{ts,tsx,js,jsx,json,css,md}\"",
    "validate": "npm run type-check && npm run lint && npm run test:coverage"
  }
}
```

## ⚠️ DIRECTRICES CRÍTICAS (DEBEN SEGUIRSE TODAS)

1. **APLICAR TypeScript estricto** - CERO compromisos en la seguridad de tipos.
2. **VALIDAR todo con Zod** - Todos los datos externos deben ser validados.
3. **MÍNIMO 80% de cobertura de pruebas** - SIN EXCEPCIONES.
4. **DEBE co-ubicar los archivos relacionados** - Las pruebas DEBEN estar en carpetas `__tests__`.
5. **MÁXIMO 500 líneas por archivo** - Dividir si es más grande.
6. **MÁXIMO 200 líneas por componente** - Refactorizar si es más grande.
7. **DEBE manejar TODOS los estados** - Carga, error, vacío y éxito.
8. **DEBE usar commits semánticos** - feat:, fix:, docs:, refactor:, test:.
9. **DEBE escribir JSDoc completo** - TODAS las exportaciones deben estar documentadas.
10. **NUNCA use el tipo `any`** - Usa un tipado adecuado o `unknown`.
11. **DEBE pasar TODAS las comprobaciones automatizadas** - Antes de CUALQUIER fusión.

## 📋 Lista de Verificación Pre-commit (DEBEN COMPLETARSE TODAS)

- [ ] TypeScript compila con CERO errores (`npm run type-check`).
- [ ] Pruebas escritas y pasando con más del 80% de cobertura (`npm run test:coverage`).
- [ ] ESLint pasa con CERO advertencias (`npm run lint`).
- [ ] Formato de Prettier aplicado (`npm run format`).
- [ ] Todos los componentes tienen documentación JSDoc completa.
- [ ] Los esquemas de Zod validan TODOS los datos externos.
- [ ] TODOS los estados manejados (carga, error, vacío, éxito).
- [ ] Límites de error implementados para las características.
- [ ] Requisitos de accesibilidad cumplidos (etiquetas ARIA, navegación por teclado).
- [ ] No hay sentencias `console.log` en el código de producción.
- [ ] Variables de entorno validadas con Zod.
- [ ] Archivos de componentes de menos de 200 líneas.
- [ ] No hay "prop drilling" más allá de 2 niveles.
- [ ] Componentes de Servidor/Cliente usados apropiadamente.

### Prácticas PROHIBIDAS
- **NUNCA use el tipo `any`** (excepto para la fusión de declaraciones de bibliotecas con comentarios).
- **NUNCA omita las pruebas** para nuevas funcionalidades.
- **NUNCA ignore los errores de TypeScript** con `@ts-ignore`.
- **NUNCA confíe en datos externos** sin validación de Zod.
- **NUNCA use `JSX.Element`** - use `ReactElement` en su lugar.
- **NUNCA almacene datos sensibles** en localStorage o en el estado del cliente.
- **NUNCA use dangerouslySetInnerHTML** sin sanitización.
- **NUNCA exceda los límites de tamaño de archivo/componente**.
- **NUNCA haga "prop drilling"** más allá de 2 niveles - use contexto o gestión de estado.
- **NUNCA haga commit** sin pasar todas las comprobaciones de calidad.

---

*Esta guía está optimizada para Next.js 15 con React 19. Mantenla actualizada a medida que los frameworks evolucionen.*
*Enfócate en la seguridad de tipos, el rendimiento y la mantenibilidad en todas las decisiones de desarrollo.*
*Última actualización: Enero de 2025*
