claude
\*\* Crea una lista de tareas exhaustiva en `PRPs/checklist.md` para el PRP $ARGUMENTS

Asimila la información y luego profundiza en nuestra base de código y PRP existentes. Cuando termines ->

ULTRAPIENSA sobre la tarea del PRP y crea el plan adhiriéndote a `claude.md`, y extrae y refina tareas detalladas siguiendo este principio:

### Lista de tareas a completar para cumplir con el PRP, en el orden en que deben completarse, usando palabras clave densas en información.

- Ejemplos de palabras clave densas en información:
  ADD (AÑADIR), CREATE (CREAR), MODIFY (MODIFICAR), MIRROR (ESPEJAR), FIND (ENCONTRAR), EXECUTE (EJECUTAR), KEEP (MANTENER), PRESERVE (PRESERVAR), etc.

Marca las tareas terminadas con: STATUS [DONE], si no está hecha, déjalo vacío.

```yaml
Tarea 1:
STATUS [ ]
MODIFY src/existing_module.py:
  - FIND patrón: "class OldImplementation"
  - INJECT después de la línea que contiene "def __init__"
  - PRESERVE las firmas de los métodos existentes

STATUS [ ]
CREATE src/new_feature.py:
  - MIRROR patrón de: src/similar_feature.py
  - MODIFY el nombre de la clase y la lógica principal
  - KEEP el patrón de manejo de errores idéntico

...(...)

Tarea N:
...

```

Cada tarea debe tener cobertura de pruebas unitarias, haz que las pruebas pasen en cada tarea.