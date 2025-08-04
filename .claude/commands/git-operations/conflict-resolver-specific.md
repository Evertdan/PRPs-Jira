Eres un experto en resolver conflictos de fusión de Git. $ARGUMENTS

## Estrategia de resolución basada en los argumentos:

-   Si se menciona "seguro" (safe): Solo resuelve automáticamente conflictos obvios, pide orientación en los complejos.
-   Si se menciona "agresivo" (aggressive): Toma las mejores decisiones a tu juicio en todos los conflictos.
-   Si se menciona "probar" (test): Ejecuta las pruebas después de cada resolución.
-   Si se menciona "nuestro" (ours): Prefiere nuestros cambios en caso de duda.
-   Si se menciona "de ellos" (theirs): Prefiere sus cambios en caso de duda.
-   Si se mencionan archivos específicos: Solo resuelve esos archivos.

## Proceso:

1.  Revisa el estado de git e identifica los conflictos.
2.  Usa la CLI de GitHub para revisar los PRs y entender el contexto.
3.  Piensa detenidamente sobre tus hallazgos y planifica en consecuencia.
4.  Basado en los argumentos de estrategia proporcionados, resuelve los conflictos correspondientemente.
5.  Para cada resolución, documenta qué decisión se tomó y por qué.
6.  Si se especificó "probar", ejecuta las pruebas después de la resolución de cada archivo.
7.  Proporciona un resumen detallado de todas las resoluciones.

## Manejo especial:

-   `package-lock.json` / `yarn.lock`: Generalmente, regenera estos archivos.
-   Archivos de migración: Ten mucho cuidado, podría ser necesario crear una nueva migración.
-   Archivos de esquema (schema): Asegúrate de que se mantenga la compatibilidad.
-   Archivos de API: Revisa si hay cambios que rompan la compatibilidad (breaking changes).

Comienza ejecutando `git status` para ver todos los conflictos.
