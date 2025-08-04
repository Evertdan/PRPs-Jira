
Enumera y revisa cualquier archivo en el área de "staging", tanto los que están preparados ("staged") como los que no ("unstaged").
Asegúrate de mirar tanto los archivos nuevos como los modificados.

Revisa el `diff` de cada archivo para ver qué ha cambiado.

Informe de revisión anterior: $ARGUMENTS

Puede que se añada o no, ignora la revisión anterior si no se especifica.

## Áreas de Enfoque de la Revisión

1.  **Calidad del Código TypeScript**
    -   Uso de TypeScript estricto con tipos explícitos.
    -   No usar tipos `any` - usar `unknown` si el tipo es verdaderamente desconocido.
    -   Importaciones de tipos adecuadas con la sintaxis `import type { }`.
    -   Interfaces de props de componentes definidas.
    -   Uso de los tipos incorporados de Astro (HTMLAttributes, ComponentProps).
    -   Cumplimiento del modo estricto (strict mode) de TypeScript.

2.  **Patrones Específicos de Astro**
    -   Uso adecuado de las directivas de hidratación (`client:load`, `client:visible`, `client:idle`).
    -   Enfoque "estático primero" (static-first) con hidratación selectiva.
    -   Componentes de Astro para contenido estático, componentes de framework solo para interactividad.
    -   Uso adecuado de `Astro.props` e interfaces de componentes.
    -   Colecciones de contenido (content collections) con esquemas de Zod.
    -   Implementación de islas de servidor (server islands) donde sea apropiado.

3.  **Rendimiento y Optimización del Paquete (Bundle)**
    -   Sin JavaScript innecesario en el lado del cliente.
    -   Elección adecuada de la estrategia de hidratación.
    -   Optimización de imágenes con el componente `Image` de Astro.
    -   Consideraciones sobre el tamaño del paquete.
    -   Sin sobre-hidratación de contenido estático.

4.  **Seguridad y Validación**
    -   Validación de entradas con esquemas de Zod.
    -   Variables de entorno debidamente tipadas con `astro:env`.
    -   Implementación de la Política de Seguridad de Contenido (CSP).
    -   No tener secretos (secrets) hardcodeados en el código del lado del cliente.
    -   Validación de rutas de API con manejo de errores adecuado.

5.  **Gestión de Contenido**
    -   Colecciones de contenido configuradas correctamente.
    -   Esquemas de Zod para todos los tipos de contenido.
    -   Consultas de contenido con seguridad de tipos (type-safe).
    -   Renderizado y manejo de datos de contenido adecuados.

6.  **Gestión de Paquetes**
    -   Uso de `pnpm` (no `npm` o `yarn`).
    -   Gestión adecuada de dependencias.
    -   Sin dependencias no utilizadas.
    -   Dependencias de desarrollo vs. de ejecución correctas.

7.  **Estructura del Código y Arquitectura**
    -   Componentes de menos de 200 líneas (límite estricto de 500 líneas).
    -   Funciones de menos de 50 líneas con una única responsabilidad.
    -   Separación adecuada de conceptos (separation of concerns).
    -   Organización basada en funcionalidades.
    -   Principios de la arquitectura de islas (islands architecture) seguidos.

8.  **Pruebas y Aseguramiento de la Calidad**
    -   Configuración y pruebas con Vitest.
    -   Cobertura de pruebas mantenida por encima del 80%.
    -   Pruebas de componentes utilizando la API de Contenedor de Astro.
    -   Pruebas de integración de rutas de API.
    -   Simulación (mocking) adecuada de dependencias externas.

9.  **Compilación (Build) y Desarrollo**
    -   `astro check` pasa sin errores.
    -   Cumplimiento de ESLint sin advertencias.
    -   Formato de Prettier aplicado.
    -   La compilación de producción tiene éxito.
    -   Sin desajustes de hidratación.

10. **Documentación y Mantenimiento**
    -   Interfaces de componentes claras.
    -   Descripciones adecuadas de las props.
    -   Actualizaciones de `CLAUDE.md` para nuevos patrones/dependencias.
    -   Actualizaciones del README si es necesario.

## Resultado de la Revisión

Crea un informe de revisión conciso con:

```markdown
# Revisión de Código TypeScript/Astro #[número]

## Resumen
[Vistazo general de 2-3 frases centrado en los patrones específicos de Astro y la calidad de TypeScript]

## Problemas Encontrados

### 🔴 Crítico (Debe solucionarse)
- [Problema con archivo:línea y solución sugerida - centrarse en la seguridad de tipos, hidratación, seguridad]

### 🟡 Importante (Debería solucionarse)
- [Problema con archivo:línea y solución sugerida - centrarse en el rendimiento, patrones]

### 🟢 Menor (A considerar)
- [Sugerencias de mejora para optimización, mantenibilidad]

## Buenas Prácticas
- [Qué se hizo bien - destacar patrones adecuados de Astro, uso de TypeScript]

## Hallazgos Específicos de Astro
- [Evaluación de la estrategia de hidratación]
- [Impacto en el tamaño del paquete]
- [Uso de colecciones de contenido]
- [Optimizaciones de rendimiento]

## Calidad de TypeScript
- [Evaluación de la seguridad de tipos]
- [Cumplimiento del modo estricto]
- [Definiciones de interfaz]

## Cobertura de Pruebas
Actual: X% | Requerido: 80%
Pruebas faltantes: [lista con enfoque en pruebas de componentes y API]

## Validación de la Compilación
- [ ] `astro check` pasa
- [ ] `pnpm run lint` pasa
- [ ] `pnpm run build` tiene éxito
- [ ] `pnpm test` pasa con 80%+ de cobertura
```

Guardar informe en PRPs/code_reviews/review[#].md (revisar archivos existentes primero)
