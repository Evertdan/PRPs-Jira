# Revisión General de la Base de Código TypeScript/Astro

Realiza una revisión completa de toda la base de código TypeScript/Astro centrándose en la arquitectura, los patrones y las mejores prácticas.

Alcance de la revisión: $ARGUMENTS

Si no se proporciona un alcance específico, revisa toda la base de código.

## Proceso de Revisión

1.  **Análisis de la Base de Código**
    -   Analizar la estructura y arquitectura general del proyecto.
    -   Revisar la organización y modularidad de los componentes.
    -   Verificar la consistencia en toda la base de código.
    -   Identificar la deuda técnica y las oportunidades de mejora.

2.  **Consistencia de Patrones**
    -   Asegurar el uso consistente de los patrones de Astro.
    -   Validar el uso de TypeScript en todos los archivos.
    -   Verificar la consistencia de las convenciones de nomenclatura.
    -   Revisar los patrones de importación/exportación.

3.  **Evaluación del Rendimiento**
    -   Evaluar el tamaño del paquete (bundle) y la optimización.
    -   Revisar la implementación de la estrategia de hidratación.
    -   Verificar si hay JavaScript innecesario en el lado del cliente.
    -   Evaluar el uso de la optimización de imágenes.

## Áreas de Enfoque de la Revisión

### 1. **Arquitectura y Estructura**
    -   Implementación de la Arquitectura de Islas (Islands Architecture).
    -   Organización de componentes (estáticos vs interactivos).
    -   Estructura de las colecciones de contenido (content collections).
    -   Organización de las rutas de API.
    -   Separación adecuada de conceptos (separation of concerns).

### 2. **Calidad de TypeScript**
    -   Cumplimiento del modo estricto (strict mode) en todos los archivos.
    -   Seguridad de tipos y tipado explícito.
    -   Definiciones de interfaz y exportaciones.
    -   Uso adecuado de los tipos incorporados de Astro.
    -   Uso de genéricos y restricciones.

### 3. **Patrones Específicos de Astro**
    -   Patrones de uso de directivas de hidratación.
    -   Implementación del enfoque "estático primero" (static-first).
    -   Configuración de islas de servidor (server islands).
    -   Patrones de gestión de contenido.
    -   Consistencia en la integración de frameworks.

### 4. **Rendimiento y Optimización**
    -   Análisis y optimización del paquete (bundle).
    -   Implementación de la optimización de imágenes.
    -   División de código (code splitting) y carga diferida (lazy loading).
    -   Eliminación de JavaScript innecesario.
    -   Efectividad de la estrategia de hidratación.

### 5. **Seguridad y Validación**
    -   Gestión de variables de entorno.
    -   Implementación de la Política de Seguridad de Contenido (CSP).
    -   Patrones de validación de entradas.
    -   Medidas de seguridad de la API.
    -   Consistencia de los esquemas de Zod.

### 6. **Estándares de Calidad del Código**
    -   Límites de tamaño de los componentes (200 líneas para Astro, 500 líneas máximo).
    -   Complejidad y longitud de las funciones.
    -   Evaluación de la duplicación de código.
    -   Patrones de manejo de errores.
    -   Prácticas de registro (logging) y depuración.

### 7. **Cobertura de Pruebas**
    -   Configuración y uso de Vitest.
    -   Cobertura de pruebas de componentes.
    -   Pruebas de rutas de API.
    -   Calidad de las pruebas de integración.
    -   Patrones de uso de simulacros (mocks).

### 8. **Dependencias y Herramientas**
    -   Cumplimiento del uso de pnpm.
    -   Gestión de dependencias.
    -   Configuración de la compilación (build).
    -   Configuración de las herramientas de desarrollo.
    -   Configuraciones de integración.

### 9. **Documentación y Mantenimiento**
    -   Calidad de la documentación del código.
    -   Completitud del README.
    -   Documentación de las props de los componentes.
    -   Documentación de la API.
    -   Actualizaciones de CLAUDE.md.

### 10. **Cumplimiento de Estándares**
    -   Configuración y cumplimiento de ESLint.
    -   Consistencia del formato de Prettier.
    -   Adherencia al modo estricto de TypeScript.
    -   Cumplimiento del proceso de compilación.
    -   Efectividad del hook de pre-commit.

## Comandos de Análisis

Ejecuta estos comandos para recopilar datos completos:

```bash
# Análisis de la estructura del proyecto
tree -I 'node_modules|dist|.git' -L 3

# Análisis de TypeScript
npx tsc --noEmit --listFiles

# Análisis del paquete (bundle)
pnpm run build && du -sh dist/

# Métricas de calidad del código
rg --stats "client:" --type astro
rg --stats "export interface" --type ts
rg --stats "import type" --type ts

# Cobertura de pruebas
pnpm run test:coverage

# Análisis de dependencias
pnpm list --depth=0
pnpm audit
```

## Resultado de la Revisión

Crea un informe de revisión completo:

```markdown
# Revisión de la Base de Código TypeScript/Astro #[número]

## Resumen Ejecutivo
[Visión general de alto nivel de la salud de la base de código, la calidad de la arquitectura y los hallazgos clave]

## Evaluación de la Arquitectura

### 🏗️ Calidad de la Estructura: [Calificación A-F]
- [Evaluación general de la arquitectura]
- [Evaluación de la organización de los componentes]
- [Implementación de la Arquitectura de Islas]

### 📊 Métricas
- Componentes Totales: X (.astro: Y, Framework: Z)
- Tamaño del Paquete: X MB (JS: Y MB, CSS: Z MB)
- Cobertura de Pruebas: X% (Objetivo: 80%)
- Cumplimiento de TypeScript: X% modo estricto

## Hallazgos Críticos

### 🔴 Problemas de Arquitectura (Debe solucionarse)
- [Problemas estructurales que requieren atención inmediata]
- [Cuellos de botella de rendimiento]
- [Vulnerabilidades de seguridad]

### 🟡 Inconsistencias de Patrones (Debería solucionarse)
- [Implementaciones inconsistentes]
- [Patrones subóptimos]
- [Elementos de deuda técnica]

### 🟢 Oportunidades de Optimización (A considerar)
- [Mejoras de rendimiento]
- [Mejoras en la calidad del código]
- [Mejoras de mantenibilidad]

## Evaluación de Calidad

### Calidad de TypeScript: [Calificación A-F]
- Cumplimiento de la seguridad de tipos
- Definiciones de interfaz
- Adherencia al modo estricto
- Patrones de uso de genéricos

### Patrones de Astro: [Calificación A-F]
- Implementación de la estrategia de hidratación
- Enfoque "estático primero"
- Gestión de contenido
- Integración de frameworks

### Puntuación de Rendimiento: [Calificación A-F]
- Optimización del paquete
- Optimización de imágenes
- Eficiencia de la hidratación
- Rendimiento de la carga

## Análisis Detallado

### Análisis de Componentes
- [Distribución del tamaño de los componentes]
- [Patrones de hidratación utilizados]
- [Desglose del uso de frameworks]
- [Evaluación de la reutilización]

### Revisión de Seguridad
- [Uso de variables de entorno]
- [Patrones de validación de entradas]
- [Medidas de seguridad de la API]
- [Política de Seguridad de Contenido]

### Calidad de las Pruebas
- [Distribución de la cobertura]
- [Evaluación de la calidad de las pruebas]
- [Áreas sin pruebas]
- [Patrones de uso de simulacros]

## Recomendaciones

### Acciones Inmediatas (Próximo Sprint)
1. [Correcciones prioritarias con referencias a archivos específicos]
2. [Mejoras críticas de rendimiento]
3. [Mejoras de seguridad]

### Mejoras a Mediano Plazo (Próximo Mes)
1. [Mejoras de arquitectura]
2. [Mejoras en la calidad del código]
3. [Mejoras en las pruebas]

### Estrategia a Largo Plazo (Próximo Trimestre)
1. [Evolución de la arquitectura]
2. [Estrategia de optimización del rendimiento]
3. [Mejoras de mantenimiento]

## Buenas Prácticas Observadas
- [Destacar implementaciones excelentes]
- [Patrones que vale la pena replicar]
- [Ejemplos de código de calidad]

## Lista de Verificación de Cumplimiento
- [ ] `astro check` pasa en todo el proyecto
- [ ] `pnpm run lint` cero advertencias
- [ ] `pnpm run build` tiene éxito
- [ ] `pnpm test` 80%+ de cobertura
- [ ] Todos los componentes por debajo de los límites de tamaño
- [ ] No hay tipos `any` en la base de código
- [ ] Directivas de hidratación adecuadas
- [ ] Variables de entorno tipadas
- [ ] Colecciones de contenido con esquemas
- [ ] Cabeceras de seguridad implementadas

## Panel de Métricas
```
Puntuación de Calidad del Código: X/100
├── Calidad de TypeScript: X/25
├── Patrones de Astro: X/25
├── Rendimiento: X/25
└── Pruebas: X/25

Deuda Técnica: X horas estimadas
Tamaño del Paquete: X MB (Objetivo: <2MB)
Tiempo de Compilación: X segundos
Cobertura de Pruebas: X% (Objetivo: 80%)
```

## Próxima Revisión
Frecuencia de revisión recomendada: [Mensual/Trimestral]
Áreas de enfoque para la próxima revisión: [Áreas específicas a monitorear]
```

Guardar informe en PRPs/code_reviews/general_review_[YYYY-MM-DD].md
