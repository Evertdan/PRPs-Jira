
Revisión rápida de refactorización para código Python centrándose en:
- Límites de "vertical slice" (porciones verticales de la aplicación)
- Complejidad de funciones
- Seguridad de tipos con Pydantic v2
- Responsabilidad única

Escanear en busca de:
1. Funciones de más de 20 líneas que necesiten descomposición.
2. Archivos largos que necesiten descomposición.
3. Modelos Pydantic faltantes para Entrada/Salida (I/O).
4. Importaciones entre funcionalidades que violen los límites de "vertical slice".
5. Clases con múltiples responsabilidades.
6. Anotaciones de tipo (type hints) faltantes.

Arquitectura deseada:
- Límites de "vertical slice".
- Responsabilidad única.
- Seguridad de tipos con Pydantic v2.

Para cada problema encontrado, proporciona:
- Ubicación.
- Por qué es un problema.
- Solución específica con ejemplo de código.
- Lugar específico donde la solución debe ser implementada.
- Prioridad (alta/media/baja).

Céntrate en elementos accionables que puedan ser solucionados en menos de 1 hora cada uno.

Guarda un `plan_de_refactorizacion.md` en la carpeta `PRPs/ai_docs`, asegúrate de no sobrescribir ningún archivo existente.
