# CLAUDE.md

Este archivo proporciona una guía completa a Claude Code cuando se trabaja con aplicaciones Node.js 23.

## Filosofía de Desarrollo Principal

### KISS (Keep It Simple, Stupid - Mantenlo Simple, Estúpido)
La simplicidad debe ser un objetivo clave en el diseño. Elige soluciones sencillas sobre las complejas siempre que sea posible. Las soluciones simples son más fáciles de entender, mantener y depurar.

### YAGNI (You Aren't Gonna Need It - No lo vas a necesitar)
Evita construir funcionalidades por especulación. Implementa características solo cuando sean necesarias, no cuando anticipes que podrían ser útiles en el futuro.

### Principios de Diseño
- **Arquitectura Modular**: Construye con módulos pequeños y enfocados que hagan una cosa bien.
- **Callbacks con Error Primero**: Siempre maneja los errores como el primer parámetro en los callbacks.
- **Asíncrono por Defecto**: Usa async/await para todas las operaciones de E/S.
- **Fallar Rápido**: Valida las entradas temprano y lanza errores significativos inmediatamente.
- **Seguridad Primero**: Nunca confíes en la entrada del usuario, siempre valida y sanea.

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
find . -name "*.js"

# ✅ Usa rg con filtrado de archivos
rg --files | rg "\.js$"
# o
rg --files -g "*.js"
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

## 🚀 Características Clave de Node.js 23

### Soporte Nativo de TypeScript
Node.js 23.6+ ahora ejecuta archivos TypeScript de forma nativa sin configuración adicional:
```bash
# Ejecución directa sin transpilación
node index.ts

# No se necesita ts-node o tsx
```

### Características de Rendimiento
- **Hilos Virtuales**: Aprovecha los hilos virtuales al estilo de Java 21 para una mejor concurrencia.
- **HTTP/2 por Defecto**: Capacidades mejoradas de multiplexación y server push.
- **API Fetch Nativa**: `fetch()` incorporado sin dependencias externas.
- **Soporte de WebAssembly**: Integración mejorada de WASM para código crítico para el rendimiento.

### Mejoras de Seguridad
- **Modelo de Permisos**: Permisos granulares para el sistema de archivos, la red y los procesos hijos.
- **Seguro por Defecto**: Valores predeterminados más estrictos para criptografía y TLS.
- **CSP Incorporado**: Soporte de Política de Seguridad de Contenido a nivel de plataforma.

## 🏗️ Estructura del Proyecto (Diseño Dirigido por el Dominio)

```
raiz-del-proyecto/
├── src/
│   ├── domains/           # Dominios de negocio
│   │   └── [dominio]/
│   │       ├── __tests__/ # Pruebas específicas del dominio
│   │       ├── entities/  # Entidades del dominio
│   │       ├── services/  # Lógica de negocio
│   │       ├── repos/     # Acceso a datos
│   │       └── index.ts   # API pública del dominio
│   ├── infrastructure/    # Asuntos técnicos
│   │   ├── database/      # Conexiones a BD
│   │   ├── cache/         # Redis, etc.
│   │   ├── messaging/     # Colas, eventos
│   │   └── monitoring/    # Registros, métricas
│   ├── interfaces/        # Interfaces externas
│   │   ├── http/          # REST/GraphQL
│   │   ├── grpc/          # Servicios gRPC
│   │   └── cli/           # Comandos de CLI
│   └── shared/            # Asuntos transversales
│       ├── errors/        # Errores personalizados
│       ├── types/         # Tipos compartidos
│       └── utils/         # Ayudantes
├── tests/                 # Pruebas de integración
├── scripts/               # Scripts de compilación/despliegue
├── .env.example           # Plantilla de entorno
├── package.json
├── tsconfig.json          # Si se usa TypeScript
└── CLAUDE.md
```

## 📦 Mejores Prácticas de Gestión de Paquetes

### Dependencias
```json
{
  "engines": {
    "node": ">=23.0.0",
    "npm": ">=10.0.0"
  },
  "scripts": {
    "start": "node --env-file=.env src/index.js",
    "dev": "node --watch --env-file=.env src/index.js",
    "test": "node --test",
    "test:coverage": "node --test --experimental-test-coverage",
    "lint": "eslint src --max-warnings 0",
    "security": "npm audit --audit-level=moderate"
  }
}
```

### Dependencias Esenciales
```bash
# Dependencias de producción
npm install fastify          # Framework web de alto rendimiento
npm install @fastify/helmet  # Cabeceras de seguridad
npm install pino            # Registrador JSON rápido
npm install ajv             # Validación de esquemas JSON
npm install postgres        # Cliente de PostgreSQL
npm install ioredis         # Cliente de Redis

# Dependencias de desarrollo
npm install -D @types/node   # Definiciones de TypeScript
npm install -D eslint        # Linting
npm install -D prettier      # Formateo de código
npm install -D husky         # Ganchos de Git
npm install -D lint-staged   # Linting pre-commit
```

## 🎯 Configuración de TypeScript (Cuando se Usa)

```json
{
  "compilerOptions": {
    "target": "ES2023",
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "lib": ["ES2023"],
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "allowJs": false
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist", "tests"]
}
```

## 🛡️ Validación de Entradas con AJV

### Validación Basada en Esquemas (OBLIGATORIO)
```javascript
import Ajv from 'ajv';
import addFormats from 'ajv-formats';

const ajv = new Ajv({ allErrors: true });
addFormats(ajv);

// Define esquemas para todas las entradas externas
const userSchema = {
  type: 'object',
  properties: {
    id: { type: 'string', format: 'uuid' },
    email: { type: 'string', format: 'email' },
    username: {
      type: 'string',
      minLength: 3,
      maxLength: 20,
      pattern: '^[a-zA-Z0-9_]+$'
    },
    age: { type: 'integer', minimum: 18, maximum: 100 }
  },
  required: ['email', 'username'],
  additionalProperties: false
};

// Compila y usa los validadores
const validateUser = ajv.compile(userSchema);

export function validateUserInput(data) {
  if (!validateUser(data)) {
    throw new ValidationError('Datos de usuario inválidos', validateUser.errors);
  }
  return data;
}
```

## 🧪 Estrategia de Pruebas (Ejecutor de Pruebas Nativo de Node.js)

### Organización de las Pruebas
```javascript
// src/domains/user/__tests__/user.service.test.js
import { describe, it, before, after, mock } from 'node:test';
import assert from 'node:assert/strict';

describe('UserService', () => {
  let userService;
  let mockRepo;

  before(async () => {
    mockRepo = {
      findById: mock.fn(() => Promise.resolve({ id: '123', name: 'Prueba' }))
    };
    userService = new UserService(mockRepo);
  });

  it('debería devolver un usuario por id', async () => {
    const user = await userService.getById('123');

    assert.equal(user.id, '123');
    assert.equal(mockRepo.findById.mock.calls.length, 1);
  });
});
```

### Requisitos de Cobertura
- Cobertura de sentencias mínima del 80%
- Cobertura de ramas mínima del 80%
- Rutas críticas: cobertura del 90%+
- Todas las APIs públicas deben tener pruebas

## 🚀 Mejores Prácticas de Rendimiento

### Protección del Bucle de Eventos
```javascript
// Evita el bloqueo con el análisis de JSON grandes
import { Worker } from 'node:worker_threads';

export async function parseHugeJSON(jsonString) {
  return new Promise((resolve, reject) => {
    const worker = new Worker('./json-parser-worker.js');
    worker.postMessage(jsonString);
    worker.on('message', resolve);
    worker.on('error', reject);
  });
}

// Usa setImmediate para bucles intensivos en CPU
async function processLargeArray(items) {
  const results = [];

  for (let i = 0; i < items.length; i++) {
    if (i % 1000 === 0) {
      await new Promise(resolve => setImmediate(resolve));
    }
    results.push(await processItem(items[i]));
  }

  return results;
}
```

### Gestión de Memoria
```javascript
// Monitorea el uso de memoria
const used = process.memoryUsage();
console.log({
  rss: `${Math.round(used.rss / 1024 / 1024 * 100) / 100} MB`,
  heapTotal: `${Math.round(used.heapTotal / 1024 / 1024 * 100) / 100} MB`,
  heapUsed: `${Math.round(used.heapUsed / 1024 / 1024 * 100) / 100} MB`,
  external: `${Math.round(used.external / 1024 / 1024 * 100) / 100} MB`
});

// Establece el tamaño máximo del heap en package.json
"scripts": {
  "start": "node --max-old-space-size=4096 src/index.js"
}
```

## 🔐 Requisitos de Seguridad

### Variables de Entorno
```javascript
// Usa el soporte nativo de --env-file
// node --env-file=.env src/index.js

// Valida todas las variables de entorno al inicio
const requiredEnvVars = [
  'NODE_ENV',
  'PORT',
  'DATABASE_URL',
  'JWT_SECRET',
  'REDIS_URL'
];

for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    throw new Error(`Falta la variable de entorno requerida: ${envVar}`);
  }
}

// Acceso al entorno seguro en tipos
export const config = {
  nodeEnv: process.env.NODE_ENV,
  port: parseInt(process.env.PORT, 10),
  database: {
    url: process.env.DATABASE_URL,
    maxConnections: parseInt(process.env.DB_MAX_CONNECTIONS || '10', 10)
  },
  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRES_IN || '1h'
  }
};
```

### Cabeceras de Seguridad (Fastify + Helmet)
```javascript
import fastify from 'fastify';
import helmet from '@fastify/helmet';

const app = fastify({ logger: true });

app.register(helmet, {
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"]
    },
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  }
});
```

## 📊 Registro y Monitoreo

### Registro Estructurado con Pino
```javascript
import pino from 'pino';

const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  transport: process.env.NODE_ENV === 'development' 
    ? { target: 'pino-pretty' }
    : undefined,
  serializers: {
    req: pino.stdSerializers.req,
    res: pino.stdSerializers.res,
    err: pino.stdSerializers.err
  },
  redact: ['password', 'token', 'authorization']
});

// Usa loggers hijos para el contexto
export function createLogger(context) {
  return logger.child(context);
}

// Ejemplo de uso
const userLogger = createLogger({ module: 'UserService' });
userLogger.info({ userId: '123' }, 'Usuario creado con éxito');
```

## 🔄 Manejo de Errores

### Clases de Error Personalizadas
```javascript
export class AppError extends Error {
  constructor(message, statusCode = 500, code = 'INTERNAL_ERROR') {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class ValidationError extends AppError {
  constructor(message, errors = []) {
    super(message, 400, 'VALIDATION_ERROR');
    this.errors = errors;
  }
}

export class NotFoundError extends AppError {
  constructor(resource) {
    super(`${resource} no encontrado`, 404, 'NOT_FOUND');
  }
}
```

### Manejador de Errores Global
```javascript
// Manejador de errores de Fastify
app.setErrorHandler((error, request, reply) => {
  const logger = request.log;
  
  if (error.isOperational) {
    logger.warn({ err: error }, 'Error operacional');
    reply.status(error.statusCode).send({
      error: {
        code: error.code,
        message: error.message,
        ...(error.errors && { details: error.errors })
      }
    });
  } else {
    logger.error({ err: error }, 'Error inesperado');
    reply.status(500).send({
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Ocurrió un error inesperado'
      }
    });
  }
});

// Manejador de excepciones no capturadas
process.on('uncaughtException', (error) => {
  logger.fatal({ err: error }, 'Excepción no capturada');
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  logger.fatal({ err: reason, promise }, 'Rechazo no manejado');
  process.exit(1);
});
```

## 🐳 Configuración de Docker

### Dockerfile
```dockerfile
FROM node:23-alpine AS base

# Instala dumb-init para el manejo adecuado de señales
RUN apk add --no-cache dumb-init

WORKDIR /app

# Copia los archivos de paquete
COPY package*.json ./

# Imagen de producción
FROM base AS production

# Instala solo las dependencias de producción
RUN npm ci --only=production && npm cache clean --force

# Copia el código de la aplicación
COPY . .

# Crea un usuario no root
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

# Cambia el propietario
RUN chown -R nodejs:nodejs /app

USER nodejs

EXPOSE 3000

# Usa dumb-init para manejar las señales correctamente
ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "--env-file=.env", "src/index.js"]
```

## ⚠️ Directrices Críticas

1. **NUNCA bloquees el bucle de eventos** - Usa hilos de trabajo para tareas intensivas en CPU.
2. **SIEMPRE valida las entradas** - Usa esquemas AJV para todos los datos externos.
3. **NUNCA almacenes secretos en el código** - Usa variables de entorno.
4. **SIEMPRE maneja los errores** - Sin fallos silenciosos.
5. **MÍNIMO 80% de cobertura de pruebas** - Usa el ejecutor de pruebas nativo de Node.js.
6. **SIEMPRE usa registro estructurado** - Pino con serializadores adecuados.
7. **NUNCA uses E/S síncrona** - Siempre usa async/await.
8. **SIEMPRE establece límites de memoria** - Configura --max-old-space-size.
9. **NUNCA confíes en la entrada del usuario** - Sanea y valida todo.
10. **SIEMPRE usa cabeceras de seguridad** - Helmet con una CSP adecuada.
11. **MONITOREA el rendimiento** - Rastrea el retraso del bucle de eventos y el uso de memoria.
12. **USA características nativas** - Prefiere los módulos incorporados sobre las dependencias externas.

## 📋 Lista de Verificación Pre-commit

- [ ] Todas las pruebas pasan con más del 80% de cobertura.
- [ ] Sin advertencias o errores de ESLint.
- [ ] Auditoría de seguridad pasada (npm audit).
- [ ] Variables de entorno documentadas.
- [ ] Manejo de errores implementado.
- [ ] Esquemas de validación de entradas definidos.
- [ ] Registro añadido para rutas críticas.
- [ ] Impacto en el rendimiento evaluado.
- [ ] Fugas de memoria comprobadas.
- [ ] Documentación actualizada.

## 🔧 Comandos Útiles

```bash
# Desarrollo
npm run dev                          # Ejecutar con recarga automática
npm test -- --watch                  # Ejecutar pruebas en modo de observación
npm run test:coverage                # Generar informe de cobertura

# Depuración
node --inspect src/index.js          # Habilitar Chrome DevTools
node --trace-warnings src/index.js   # Rastrear rechazos de promesas
node --prof src/index.js             # Perfilado de CPU

# Producción
node --env-file=.env src/index.js    # Ejecutar con archivo de entorno
pm2 start ecosystem.config.js        # Ejecutar con PM2

# Monitoreo
node --trace-event-categories=node.perf src/index.js  # Trazado de rendimiento
```

---

*Mantén esta guía actualizada a medida que los patrones evolucionen. Rendimiento y seguridad sobre la conveniencia, siempre.*
*Última actualización: Junio de 2025*
