# CLAUDE.md

Este archivo proporciona una guía completa a Claude Code cuando se trabaja con aplicaciones Astro 5+ y la Arquitectura de Islas.

## Filosofía de Desarrollo Principal

### KISS (Keep It Simple, Stupid - Mantenlo Simple, Estúpido)

La simplicidad debe ser un objetivo clave en el diseño. Elige soluciones sencillas sobre las complejas siempre que sea posible. Las soluciones simples son más fáciles de entender, mantener y depurar.

### YAGNI (You Aren't Gonna Need It - No lo vas a necesitar)

Evita construir funcionalidades por especulación. Implementa características solo cuando sean necesarias, no cuando anticipes que podrían ser útiles en el futuro.

### Principios de Diseño

- **Arquitectura de Islas**: Envía un mínimo de JavaScript, hidrata solo lo que necesita interactividad.
- **Rendimiento por Defecto**: Primero estático con hidratación selectiva para un rendimiento óptimo.
- **Agnóstico al Framework**: Mezcla React, Vue, Svelte y otros frameworks en el mismo proyecto.
- **Impulsado por el Contenido**: Optimizado para sitios web con mucho contenido con gestión de contenido segura en tipos.
- **Cero JavaScript por Defecto**: Solo envía JavaScript cuando sea explícitamente necesario.

## 🤖 Directrices para el Asistente de IA

### Conciencia del Contexto

- Al implementar características, siempre revisa primero los patrones existentes.
- Prefiere la generación estática sobre el renderizado del lado del cliente cuando sea posible.
- Usa componentes específicos del framework solo cuando se requiera interactividad.
- Revisa si hay funcionalidades similares en diferentes integraciones de frameworks.
- Entiende cuándo usar componentes `.astro` vs componentes de framework.

### Errores Comunes a Evitar

- Sobre-hidratar componentes que podrían ser estáticos.
- Mezclar múltiples frameworks innecesariamente en un solo componente.
- Ignorar los beneficios de la hidratación parcial de Astro.
- Crear funcionalidades duplicadas en diferentes islas de frameworks.
- Sobrescribir integraciones existentes sin revisar alternativas.

### Patrones de Flujo de Trabajo

- Preferiblemente, crea pruebas ANTES de la implementación (TDD).
- Usa "pensar detenidamente" para las decisiones de estrategia de hidratación.
- Descompón componentes interactivos complejos en islas más pequeñas y enfocadas.
- Valida la elección del framework y los requisitos de hidratación antes de la implementación.

### Requisitos del Comando de Búsqueda

**CRÍTICO**: Siempre usa `rg` (ripgrep) en lugar de los comandos tradicionales `grep` y `find`:

```bash
# ❌ No uses grep
grep -r "patron" .

# ✅ Usa rg en su lugar
rg "patron"

# ❌ No uses find con name
find . -name "*.ts"

# ✅ Usa rg con filtrado de archivos
rg --files | rg "\.ts$"
# o
rg --files -g "*.ts"
```

**Reglas de Aplicación:**

```
(
    r"^grep\b(?!.*\|)", "Usa 'rg' (ripgrep) en lugar de 'grep' para un mejor rendimiento y características",
),
(
    r"^find\s+\S+\s+-name\b", "Usa 'rg --files | rg patron' o 'rg --files -g patron' en lugar de 'find -name' para un mejor rendimiento",
),
```

## 🧱 Estructura del Código y Modularidad

### Límites de Archivos y Componentes

- **Nunca crees un archivo de más de 500 líneas de código.** Si te acercas a este límite, refactoriza dividiendo en módulos o componentes auxiliares.
- **Los componentes de Astro deben tener menos de 200 líneas** para una mejor mantenibilidad.
- **Las funciones deben ser cortas y enfocadas, de menos de 50 líneas** y tener una única responsabilidad.
- **Organiza el código por característica y framework**, manteniendo juntos los componentes relacionados.

## 🚀 Características Clave de Astro 5+

### Capa de Contenido (Nuevo en Astro 5)

- **Gestión de Contenido Flexible**: Carga contenido de cualquier fuente (archivos, APIs, CMSs).
- **Contenido Seguro en Tipos**: Tipos de TypeScript automáticos para todas las colecciones de contenido.
- **Aumento de Rendimiento**: Compilaciones hasta 5 veces más rápidas para Markdown, 2x para MDX.
- **API Unificada**: Interfaz única para todas las fuentes de contenido.

```typescript
// content/config.ts
import { defineCollection, z } from "astro:content";

const blog = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    pubDate: z.date(),
    description: z.string(),
    author: z.string(),
    image: z
      .object({
        url: z.string(),
        alt: z.string(),
      })
      .optional(),
    tags: z.array(z.string()),
  }),
});

export const collections = { blog };
```

### Islas de Servidor (Nuevo en Astro 5)

- **Contenido Mixto Estático/Dinámico**: Combina contenido estático en caché con contenido dinámico personalizado.
- **Carga Independiente**: Cada isla se carga por separado para un rendimiento óptimo.
- **Caché Personalizado**: Establece cabeceras de caché personalizadas y contenido de respaldo por isla.

```astro
---
// components/PersonalizedContent.astro
export const prerender = false; // Isla de servidor
---

<div>
  <h2>¡Bienvenido de nuevo, {Astro.locals.user?.name}!</h2>
  <p>Tu contenido personalizado aquí...</p>
</div>
```

### Configuración del Entorno (astro:env)

- **Variables de Entorno Seguras en Tipos**: Validación y soporte de TypeScript.
- **Validación en Tiempo de Ejecución**: Validación automática en tiempo de compilación.
- **Separación Cliente/Servidor**: Distinción clara entre variables públicas y privadas.

```typescript
// env.d.ts
import { defineEnv, envField } from "astro:env/config";

export default defineEnv({
  server: {
    DATABASE_URL: envField.string({ context: "server", access: "secret" }),
    API_SECRET: envField.string({ context: "server", access: "secret" }),
  },
  client: {
    PUBLIC_API_URL: envField.string({ context: "client", access: "public" }),
    PUBLIC_SITE_NAME: envField.string({ context: "client", access: "public" }),
  },
});
```

## 🏗️ Estructura del Proyecto (Arquitectura de Islas)

```
src/
├── components/            # Componentes de Astro (.astro)
│   ├── ui/               # Componentes de UI estáticos
│   ├── islands/          # Componentes interactivos (específicos del framework)
│   └── layouts/          # Componentes de diseño
├── content/              # Colecciones de contenido
│   ├── config.ts         # Configuración del contenido
│   ├── blog/            # Publicaciones del blog (markdown/mdx)
│   └── docs/            # Documentación
├── pages/                # Enrutamiento basado en archivos (REQUERIDO)
│   ├── api/             # Rutas de API
│   ├── blog/            # Páginas del blog
│   └── [...slug].astro  # Rutas dinámicas
├── lib/                  # Funciones de utilidad y configuraciones
│   ├── utils.ts         # Funciones auxiliares
│   ├── constants.ts     # Constantes de la aplicación
│   └── schemas.ts       # Esquemas de validación de Zod
├── styles/              # Estilos globales
│   └── global.css       # Propiedades personalizadas de CSS y globales
├── assets/              # Activos procesados (imágenes, etc.)
└── env.d.ts            # Definiciones de entorno y tipos
```

## 🎯 Configuración de TypeScript (REQUISITOS ESTRICTOS)

### DEBE Seguir las Plantillas de TypeScript de Astro

```json
{
  "extends": "astro/tsconfigs/strict",
  "include": [".astro/types.d.ts", "**/*"],
  "exclude": ["dist"],
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"],
      "@/components/*": ["src/components/*"],
      "@/layouts/*": ["src/layouts/*"],
      "@/content/*": ["src/content/*"]
    },
    "verbatimModuleSyntax": true,
    "isolatedModules": true,
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "noUncheckedIndexedAccess": true,
    "exactOptionalPropertyTypes": true
  }
}
```

### Requisitos de Tipado OBLIGATORIOS

- **NUNCA uses el tipo `any`** - usa `unknown` si el tipo es verdaderamente desconocido.
- **DEBE usar importaciones de tipo explícitas** con la sintaxis `import type { }`.
- **DEBE definir interfaces de props** para todos los componentes de Astro.
- **DEBE usar los tipos incorporados de Astro** como `HTMLAttributes`, `ComponentProps`.
- **DEBE validar el contenido con esquemas de Zod** en las colecciones de contenido.

### Tipado de Props de Componentes (OBLIGATORIO)

```typescript
// Props de componente de Astro
export interface Props {
  title: string;
  description?: string;
  image?: {
    src: string;
    alt: string;
  };
  class?: string;
}

const { title, description, image, class: className } = Astro.props;
```

## 📦 Gestión de Paquetes y Dependencias

### DEBE Usar pnpm (OBLIGATORIO)

**CRÍTICO**: Siempre usa pnpm para proyectos de Astro para un mejor rendimiento y gestión de dependencias.

```bash
# Instalar pnpm globalmente
npm install -g pnpm
# o
curl -fsSL https://get.pnpm.io/install.sh | sh

# Configuración del proyecto
pnpm create astro@latest
pnpm install
pnpm dev
```

### Dependencias Esenciales de Astro 5

```json
{
  "dependencies": {
    "astro": "^5.0.0",
    "@astrojs/check": "^0.9.0",
    "@astrojs/ts-plugin": "^1.10.0",
    "typescript": "^5.6.0"
  },
  "devDependencies": {
    "@astrojs/tailwind": "^5.1.0",
    "tailwindcss": "^3.4.0",
    "prettier": "^3.3.0",
    "prettier-plugin-astro": "^0.14.0"
  }
}
```

### Integraciones de Frameworks (Añadir según sea necesario)

```bash
# Integración con React
pnpm astro add react
# o
npx astro add react

# Integración con Vue
pnpm astro add vue

# Integración con Svelte
pnpm astro add svelte

# Integración con Preact
pnpm astro add preact

# Integración con SolidJS
pnpm astro add solid

# Múltiples frameworks (enfoque agnóstico al framework)
pnpm astro add react vue svelte
```

### Integraciones Esenciales

```bash
# Estilos y UI
pnpm astro add tailwind
pnpm astro add mdx

# Rendimiento y SEO
pnpm astro add sitemap
pnpm astro add compress

# Contenido y CMS
pnpm astro add @astrojs/content
pnpm astro add @astrojs/rss

# Instalación manual de paquetes cuando sea necesario
pnpm add nombre-paquete
pnpm add -D paquete-desarrollo
```

## 🛡️ Validación de Datos con Zod (OBLIGATORIO PARA EL CONTENIDO)

### Colecciones de Contenido (Patrón REQUERIDO)

```typescript
// src/content/config.ts
import { defineCollection, z } from "astro:content";

const blogSchema = z.object({
  title: z.string(),
  description: z.string(),
  pubDate: z.coerce.date(),
  updatedDate: z.coerce.date().optional(),
  heroImage: z.string().optional(),
  tags: z.array(z.string()).default([]),
  draft: z.boolean().default(false),
  author: z.object({
    name: z.string(),
    email: z.string().email().optional(),
    image: z.string().optional(),
  }),
});

const docsSchema = z.object({
  title: z.string(),
  description: z.string(),
  sidebar: z
    .object({
      order: z.number(),
      label: z.string().optional(),
    })
    .optional(),
});

export const collections = {
  blog: defineCollection({
    type: "content",
    schema: blogSchema,
  }),
  docs: defineCollection({
    type: "content",
    schema: docsSchema,
  }),
};

export type BlogPost = z.infer<typeof blogSchema>;
export type DocsPage = z.infer<typeof docsSchema>;
```

### Validación de Rutas de API

```typescript
// src/pages/api/newsletter.ts
import type { APIRoute } from "astro";
import { z } from "zod";

const subscribeSchema = z.object({
  email: z.string().email(),
  name: z.string().min(2).max(50),
});

export const POST: APIRoute = async ({ request }) => {
  try {
    const data = await request.json();
    const validatedData = subscribeSchema.parse(data);

    // Procesar suscripción
    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(
        JSON.stringify({
          error: "Validation failed",
          details: error.errors,
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        },
      );
    }

    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};
```

## 🧪 Estrategia de Pruebas (VITEST RECOMENDADO)

### DEBE Cumplir Estos Estándares de Pruebas

- **MÍNIMO 80% de cobertura de código** - SIN EXCEPCIONES
- **DEBE usar Vitest** para pruebas unitarias y de componentes (compatible con Jest, nativo de Vite)
- **DEBE usar la API de Contenedor de Astro** para las pruebas de componentes
- **DEBE probar las islas por separado** de los componentes estáticos
- **DEBE simular (mock) las dependencias externas** apropiadamente

### Configuración de Vitest (OBLIGATORIA)

```typescript
// vitest.config.ts
import { defineConfig } from "vitest/config";
import { getViteConfig } from "astro/config";

export default defineConfig(
  getViteConfig({
    test: {
      environment: "happy-dom", // o 'jsdom'
      coverage: {
        reporter: ["text", "json", "html"],
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
  }),
);
```

### Pruebas de Componentes con la API de Contenedor

```typescript
// src/components/__tests__/Card.test.ts
import { experimental_AstroContainer as AstroContainer } from "astro/container";
import { expect, test } from "vitest";
import Card from "../Card.astro";

test("El componente Card se renderiza correctamente", async () => {
  const container = await AstroContainer.create();
  const result = await container.renderToString(Card, {
    props: {
      title: "Título de Prueba",
      description: "Descripción de prueba",
    },
  });

  expect(result).toContain("Título de Prueba");
  expect(result).toContain("Descripción de prueba");
});

test("El componente Card maneja props faltantes con gracia", async () => {
  const container = await AstroContainer.create();
  const result = await container.renderToString(Card, {
    props: { title: "Título de Prueba" },
  });

  expect(result).toContain("Título de Prueba");
  expect(result).not.toContain("undefined");
});
```

### Pruebas de Integración para Rutas de API

```typescript
// src/pages/api/__tests__/newsletter.test.ts
import { expect, test } from "vitest";

test("POST /api/newsletter valida el correo electrónico", async () => {
  const response = await fetch("/api/newsletter", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: "correo-invalido", name: "Prueba" }),
  });

  expect(response.status).toBe(400);
  const data = await response.json();
  expect(data.error).toBe("Validation failed");
});
```

## 🎨 Directrices de Componentes (ESPECÍFICAS DE ASTRO)

### Estructura de Componente de Astro (OBLIGATORIA)

```astro
---
// src/components/BlogCard.astro
export interface Props {
  title: string;
  description: string;
  pubDate: Date;
  image?: {
    src: string;
    alt: string;
  };
  tags?: string[];
  href: string;
}

const {
  title,
  description,
  pubDate,
  image,
  tags = [],
  href
} = Astro.props;

// Lógica del lado del servidor aquí
const formattedDate = pubDate.toLocaleDateString('es-ES', {
  year: 'numeric',
  month: 'long',
  day: 'numeric'
});
---

<article class="blog-card">
  {image && (
    <img
      src={image.src}
      alt={image.alt}
      loading="lazy"
      decoding="async"
    />
  )}

  <div class="content">
    <h3>
      <a href={href}>{title}</a>
    </h3>
    <p>{description}</p>

    <div class="meta">
      <time datetime={pubDate.toISOString()}>
        {formattedDate}
      </time>

      {tags.length > 0 && (
        <ul class="tags">
          {tags.map((tag) => (
            <li class="tag">{tag}</li>
          ))}
        </ul>
      )}
    </div>
  </div>
</article>

<style>
  .blog-card {
    /* Estilos con ámbito de componente */
    border: 1px solid var(--color-border);
    border-radius: 8px;
    overflow: hidden;
    transition: transform 0.2s ease;
  }

  .blog-card:hover {
    transform: translateY(-2px);
  }

  .content {
    padding: 1rem;
  }

  .tags {
    display: flex;
    gap: 0.5rem;
    list-style: none;
    margin: 0;
    padding: 0;
  }

  .tag {
    background: var(--color-accent);
    color: var(--color-accent-text);
    padding: 0.25rem 0.5rem;
    border-radius: 4px;
    font-size: 0.875rem;
  }
</style>
```

### Integración de Componentes de Framework

```astro
---
// src/components/InteractiveCounter.astro
export interface Props {
  initialCount?: number;
  maxCount?: number;
}

const { initialCount = 0, maxCount = 100 } = Astro.props;
---

<!-- Envoltorio estático con isla de framework -->
<div class="counter-wrapper">
  <h3>Contador Interactivo</h3>

  <!-- Isla de React con directiva de hidratación -->
  <Counter
    client:load
    initialCount={initialCount}
    maxCount={maxCount}
  />
</div>

<style>
  .counter-wrapper {
    border: 2px solid var(--color-primary);
    padding: 1rem;
    border-radius: 8px;
  }
</style>
```

### Directivas de Hidratación (COMPRENSIÓN CRÍTICA)

```astro
<!-- Cargar inmediatamente -->
<Component client:load />

<!-- Cargar cuando el componente se vuelve visible -->
<Component client:visible />

<!-- Cargar cuando el navegador está inactivo -->
<Component client:idle />

<!-- Cargar al coincidir con una media query -->
<Component client:media="(max-width: 768px)" />

<!-- Renderizar solo en el cliente (sin SSR) -->
<Component client:only="react" />
```

## 🔄 Patrones de Gestión de Contenido

### Uso de Colecciones de Contenido

```astro
---
// src/pages/blog/[...slug].astro
import { type CollectionEntry, getCollection } from 'astro:content';
import BlogLayout from '../../layouts/BlogLayout.astro';

export async function getStaticPaths() {
  const posts = await getCollection('blog');
  return posts.map((post) => ({
    params: { slug: post.slug },
    props: post,
  }));
}

type Props = CollectionEntry<'blog'>;

const post = Astro.props;
const { Content } = await post.render();
---

<BlogLayout
  title={post.data.title}
  description={post.data.description}
  pubDate={post.data.pubDate}
  heroImage={post.data.heroImage}
>
  <Content />
</BlogLayout>
```

### Carga de Contenido Dinámico

```typescript
// src/lib/content.ts
import { getCollection, type CollectionEntry } from "astro:content";

export async function getBlogPosts(): Promise<CollectionEntry<"blog">[]> {
  const posts = await getCollection("blog");

  return posts
    .filter((post) => !post.data.draft)
    .sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());
}

export async function getPostsByTag(
  tag: string,
): Promise<CollectionEntry<"blog">[]> {
  const posts = await getBlogPosts();
  return posts.filter((post) => post.data.tags.includes(tag));
}

export async function getFeaturedPosts(): Promise<CollectionEntry<"blog">[]> {
  const posts = await getBlogPosts();
  return posts.filter((post) => post.data.featured).slice(0, 3);
}
```

## 🚀 Optimización del Rendimiento (ESPECÍFICA DE ASTRO)

### Optimización de Imágenes (OBLIGATORIA)

```astro
---
import { Image } from 'astro:assets';
import heroImage from '../assets/hero.jpg';
---

<!-- Imágenes optimizadas con Astro -->
<Image
  src={heroImage}
  alt="Descripción de la imagen de héroe"
  width={800}
  height={400}
  format="webp"
  quality={80}
  loading="eager"
/>

<!-- Imágenes responsivas -->
<Image
  src={heroImage}
  alt="Héroe responsivo"
  widths={[400, 800, 1200]}
  sizes="(max-width: 400px) 400px, (max-width: 800px) 800px, 1200px"
  format="webp"
/>
```

### Optimización del Paquete (Bundle)

```typescript
// astro.config.mjs
import { defineConfig } from "astro/config";

export default defineConfig({
  build: {
    inlineStylesheets: "auto",
    splitting: true,
  },
  vite: {
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            "react-vendor": ["react", "react-dom"],
            "vue-vendor": ["vue"],
            utils: ["./src/lib/utils.ts"],
          },
        },
      },
    },
  },
  experimental: {
    contentIntellisense: true,
  },
});
```

### Islas de Servidor para el Rendimiento

```astro
---
// src/components/DynamicContent.astro
export const prerender = false; // Marcar como isla de servidor

// Esto se ejecuta en el servidor para cada solicitud
const userPreferences = await getUserPreferences(Astro.locals.userId);
const recommendations = await getRecommendations(userPreferences);
---

<section class="dynamic-content">
  <h2>Recomendado para ti</h2>
  <div class="recommendations">
    {recommendations.map((item) => (
      <div class="recommendation-card">
        <h3>{item.title}</h3>
        <p>{item.description}</p>
      </div>
    ))}
  </div>
</section>

<style>
  .dynamic-content {
    /* Estilos para el contenido dinámico */
  }
</style>
```

## 🔐 Requisitos de Seguridad (OBLIGATORIOS)

### Variables de Entorno (DEBEN VALIDARSE)

```typescript
// src/env.d.ts
import { envField, defineEnv } from "astro:env/config";

export default defineEnv({
  server: {
    DATABASE_URL: envField.string({
      context: "server",
      access: "secret",
      min: 1,
    }),
    API_SECRET_KEY: envField.string({
      context: "server",
      access: "secret",
      min: 32,
    }),
  },
  client: {
    PUBLIC_SITE_URL: envField.string({
      context: "client",
      access: "public",
    }),
    PUBLIC_ANALYTICS_ID: envField.string({
      context: "client",
      access: "public",
    }),
  },
});
```

### Política de Seguridad de Contenido (CSP)

```astro
---
// src/layouts/BaseLayout.astro
export interface Props {
  title: string;
  description: string;
}

const { title, description } = Astro.props;
---

<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="description" content={description} />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta http-equiv="Content-Security-Policy"
        content="default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline';" />
  <title>{title}</title>
</head>
<body>
  <slot />
</body>
</html>
```

## 💅 Estilo y Calidad del Código

### Configuración de Astro (OBLIGATORIA)

```typescript
// astro.config.mjs
import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import react from "@astrojs/react";
import vue from "@astrojs/vue";

export default defineConfig({
  integrations: [tailwind(), react(), vue()],
  markdown: {
    shikiConfig: {
      theme: "github-dark",
      wrap: true,
    },
  },
  build: {
    format: "directory",
  },
  experimental: {
    contentIntellisense: true,
  },
});
```

### Configuración de Prettier

```json
{
  "plugins": ["prettier-plugin-astro"],
  "overrides": [
    {
      "files": "*.astro",
      "options": {
        "parser": "astro"
      }
    }
  ],
  "astroAllowShorthand": false
}
```

## 📋 Comandos de Desarrollo

### Scripts de pnpm (OBLIGATORIOS)

```json
{
  "scripts": {
    "dev": "astro dev",
    "start": "astro dev",
    "build": "astro check && astro build",
    "preview": "astro preview",
    "check": "astro check",
    "sync": "astro sync",
    "test": "vitest",
    "test:coverage": "vitest --coverage",
    "lint": "eslint . --ext .js,.ts,.astro --max-warnings 0",
    "format": "prettier --write \"src/**/*.{astro,js,ts,md,json}\"",
    "format:check": "prettier --check \"src/**/*.{astro,js,ts,md,json}\"",
    "validate": "pnpm run check && pnpm run lint && pnpm run test:coverage"
  }
}
```

### Referencia de Comandos de pnpm

```bash
# Desarrollo
pnpm dev              # Iniciar servidor de desarrollo
pnpm build            # Compilar para producción
pnpm preview          # Previsualizar compilación de producción

# Calidad del Código
pnpm run check        # Validación de TypeScript y Astro
pnpm run lint         # ESLint con cero advertencias
pnpm run format       # Formatear código con Prettier
pnpm run validate     # Ejecutar todas las comprobaciones de calidad

# Pruebas
pnpm test             # Ejecutar pruebas
pnpm run test:coverage # Ejecutar pruebas con cobertura

# Gestión de Paquetes
pnpm install          # Instalar dependencias
pnpm add paquete      # Añadir dependencia de ejecución
pnpm add -D paquete   # Añadir dependencia de desarrollo
pnpm update           # Actualizar dependencias
pnpm audit            # Auditoría de seguridad
pnpm list             # Listar paquetes instalados
pnpm outdated         # Comprobar paquetes desactualizados
```

## ⚠️ DIRECTRICES CRÍTICAS (DEBEN SEGUIRSE TODAS)

1. **DEBE usar pnpm** - Nunca usar npm o yarn para la gestión de paquetes.
2. **APLICAR el modo estricto de TypeScript** - Usar la plantilla `astro/tsconfigs/strict`.
3. **VALIDAR todo el contenido con Zod** - Las colecciones de contenido DEBEN tener esquemas.
4. **MÍNIMO 80% de cobertura de pruebas** - Usar Vitest con la API de Contenedor.
5. **DEBE entender la estrategia de hidratación** - Usar las directivas de cliente apropiadas.
6. **MÁXIMO 500 líneas por archivo** - Dividir componentes grandes.
7. **DEBE usar importaciones semánticas** - `import type` para importaciones de solo tipo.
8. **DEBE optimizar las imágenes** - Usar el componente `Image` de Astro.
9. **DEBE validar las variables de entorno** - Usar `astro:env` para la seguridad de tipos.
10. **NUNCA sobre-hidratar** - Por defecto estático, hidratar solo cuando sea necesario.
11. **DEBE usar componentes de framework con moderación** - Preferir componentes de Astro para contenido estático.
12. **DEBE pasar `astro check`** - Se requieren cero errores de TypeScript.

## 📋 Lista de Verificación Pre-commit (DEBEN COMPLETARSE TODAS)

- [ ] `astro check` pasa con CERO errores.
- [ ] Las colecciones de contenido tienen esquemas de Zod adecuados.
- [ ] Los componentes usan las directivas de hidratación apropiadas.
- [ ] Las imágenes están optimizadas con el componente `Image` de Astro.
- [ ] Pruebas escritas con más del 80% de cobertura usando Vitest.
- [ ] Las variables de entorno están debidamente tipadas con `astro:env`.
- [ ] No hay componentes de framework innecesarios (el contenido estático usa `.astro`).
- [ ] Cumplimiento del modo estricto de TypeScript.
- [ ] Formato de Prettier aplicado a todos los archivos `.astro`.
- [ ] Todas las rutas de API tienen una validación de Zod adecuada.
- [ ] Los tipos de contenido se exportan y usan correctamente.
- [ ] No hay JavaScript del lado del cliente para contenido estático.
- [ ] Se mantiene el presupuesto de rendimiento (revisar el tamaño del paquete).
- [ ] Los metadatos de SEO están configurados correctamente.

### Prácticas PROHIBIDAS

- **NUNCA usar npm o yarn** - DEBE usar pnpm para toda la gestión de paquetes.
- **NUNCA usar `client:load` sin justificación** - preferir `client:visible` o `client:idle`.
- **NUNCA omitir la validación de contenido** - todo el contenido DEBE tener esquemas de Zod.
- **NUNCA ignorar el impacto de la hidratación** - entender el tamaño del paquete de JavaScript.
- **NUNCA usar componentes de framework para contenido estático** - usar archivos `.astro`.
- **NUNCA omitir la verificación de TypeScript** - `astro check` debe pasar.
- **NUNCA almacenar secretos en el código del lado del cliente** - usar el contexto del servidor de `astro:env`.
- **NUNCA ignorar la optimización de imágenes** - siempre usar el componente `Image` de Astro.
- **NUNCA mezclar responsabilidades** - separar el contenido estático de las islas interactivas.
- **NUNCA usar el tipo `any`** - aprovechar la seguridad de tipos incorporada de Astro.
- **NUNCA ignorar las advertencias de compilación** - abordar todos los problemas de compilación y TypeScript.
- **NUNCA usar `npx` para comandos regulares** - usar equivalentes de `pnpm` cuando estén disponibles.

---

_Esta guía está optimizada para Astro 5+ con Arquitectura de Islas y rendimiento web moderno._
_Enfócate en un mínimo de JavaScript, hidratación óptima y gestión de contenido segura en tipos._
_Última actualización: Enero de 2025_