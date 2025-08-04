# Validar PRP

## Archivo PRP: $ARGUMENTS

Validación previa de un PRP para asegurar que todo el contexto y las dependencias estén disponibles antes de la ejecución.

## Proceso de Validación

1.  **Analizar (Parse) el PRP**
    -   Leer el archivo PRP especificado.
    -   Extraer todas las referencias de archivos, URLs y dependencias.
    -   Analizar los elementos de la lista de verificación de validación.

2.  **Validación del Contexto**
    -   Verificar que todos los archivos referenciados existan.
    -   Validar que todas las URLs sean accesibles.
    -   Verificar que las dependencias del entorno estén disponibles.
    -   Comprobar las claves de API/credenciales requeridas.

3.  **Análisis de la Base de Código**
    -   Buscar patrones similares mencionados en el PRP.
    -   Validar que los ejemplos existentes estén actualizados.
    -   Verificar la consistencia arquitectónica.

4.  **Comprobación de Dependencias**
    -   Verificar que todas las bibliotecas requeridas estén instaladas.
    -   Comprobar la compatibilidad de versiones.
    -   Validar la conectividad con servicios externos.

5.  **Evaluación de Riesgos**
    -   Analizar los patrones de fallo mencionados en el PRP.
    -   Evaluar la complejidad y la puntuación de confianza.
    -   Identificar posibles cuellos de botella.

## Puertas de Validación

### Referencias de Archivos

```bash
# Verificar que todos los archivos referenciados existan
echo "Validando referencias de archivos..."
for archivo in $(grep -o 'file: [^[:space:]]*' "$PRP_FILE" | cut -d' ' -f2); do
    if [ ! -f "$archivo" ]; then
        echo "❌ Archivo faltante: $archivo"
        exit 1
    else
        echo "✅ Encontrado: $archivo"
    fi
done
```

### Accesibilidad de URLs

```bash
# Verificar que todas las URLs referenciadas sean accesibles
echo "Validando referencias de URLs..."
for url in $(grep -o 'url: [^[:space:]]*' "$PRP_FILE" | cut -d' ' -f2); do
    if curl -s --head "$url" > /dev/null; then
        echo "✅ Accesible: $url"
    else
        echo "⚠️  No se puede acceder a: $url"
    fi
done
```

### Dependencias del Entorno

```bash
# Comprobar la configuración del entorno
echo "Validando dependencias del entorno..."

# Comprobar dependencias de Python
if command -v python3 &> /dev/null; then
    echo "✅ Python3 disponible"

    # Comprobar importaciones específicas mencionadas en el PRP
    python3 -c "
import re
import sys
# Leer el archivo PRP y extraer las declaraciones de importación
with open('$PRP_FILE', 'r') as f:
    contenido = f.read()
# Encontrar declaraciones de importación en bloques de código
importaciones = re.findall(r'^(?:import|from)\s+([a-zA-Z_][a-zA-Z0-9_]*)', contenido, re.MULTILINE)
importaciones_unicas = set(importaciones)
importaciones_fallidas = []
for modulo in importaciones_unicas:
    try:
        __import__(modulo)
        print(f'✅ Módulo disponible: {modulo}')
    except ImportError:
        importaciones_fallidas.append(modulo)
        print(f'⚠️  Módulo faltante: {modulo}')
if importaciones_fallidas:
    print(f'❌ Módulos faltantes: {importaciones_fallidas}')
    sys.exit(1)
"
else
    echo "❌ Python3 no disponible"
    exit 1
fi
```

### Conectividad de API

```bash
# Comprobar la conectividad con APIs externas
echo "Validando conectividad de API..."

# Comprobar APIs comunes mencionadas en el PRP
if grep -q "api.openai.com" "$PRP_FILE"; then
    if [ -n "$OPENAI_API_KEY" ]; then
        echo "✅ Clave de API de OpenAI configurada"
    else
        echo "⚠️  Clave de API de OpenAI no establecida"
    fi
fi

if grep -q "api.anthropic.com" "$PRP_FILE"; then
    if [ -n "$ANTHROPIC_API_KEY" ]; then
        echo "✅ Clave de API de Anthropic configurada"
    else
        echo "⚠️  Clave de API de Anthropic no establecida"
    fi
fi

# Añadir más comprobaciones de API según sea necesario
```

## Informe de Validación

Genera un informe de validación completo con:

1.  **Puntuación de Completitud del Contexto** (0-100)
2.  **Preparación de Dependencias** (Listo/Problemas/Bloqueado)
3.  **Evaluación de Riesgos** (Bajo/Medio/Alto)
4.  **Acciones Recomendadas** (antes de la ejecución)

## Formato de Salida

```
🔍 Informe de Validación de PRP
========================
📁 Validación de Contexto: [PASA/FALLA]
- Archivos referenciados: X/X encontrados
- URLs accesibles: X/X responden
- Ejemplos actualizados: [SÍ/NO]
🔧 Dependencias: [LISTO/PROBLEMAS/BLOQUEADO]
- Módulos de Python: X/X disponibles
- Servicios externos: X/X accesibles
- Claves de API: X/X configuradas
⚠️  Evaluación de Riesgos: [BAJO/MEDIO/ALTO]
- Puntuación de complejidad: X/10
- Patrones de fallo: X identificados
- Estrategias de mitigación: X documentadas
📊 Puntuación de Preparación: XX/100
🎯 Acciones Recomendadas:
[ ] Instalar dependencias faltantes
[ ] Configurar claves de API faltantes
[ ] Actualizar ejemplos obsoletos
[ ] Revisar estrategias de mitigación de riesgos
Estado: [LISTO_PARA_EJECUTAR/NECESITA_ATENCIÓN/BLOQUEADO]
```

## Sugerencias de Auto-corrección

Cuando la validación falle, proporciona sugerencias accionables:

```bash
# Generar correcciones automáticas donde sea posible
if [ "$ESTADO" != "LISTO_PARA_EJECUTAR" ]; then
    echo "🔧 Sugerencias de auto-corrección:"
    echo "pip install modulo-faltante-1 modulo-faltante-2"
    echo "export CLAVE_API_FALTANTE=tu_clave_aqui"
    echo "git checkout HEAD -- ejemplo-obsoleto.py"
fi
```

## Integración con el Comando de Ejecución

El comando de validación debería ser llamado automáticamente por `execute-prp` antes de iniciar la implementación:

```bash
# En execute-prp.md, añade esto como paso 0:
echo "Ejecutando validación pre-ejecución..."
validate-prp "$PRP_FILE"
if [ $? -ne 0 ]; then
    echo "❌ La validación falló. Por favor, corrige los problemas antes de la ejecución."
    exit 1
fi
```