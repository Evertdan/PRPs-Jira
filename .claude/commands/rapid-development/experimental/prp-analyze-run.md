# Analizar Resultados de PRP

## Archivo PRP: $ARGUMENTS

Análisis posterior a la ejecución de una implementación de PRP para capturar lecciones aprendidas, métricas de éxito y mejoras en la plantilla.

## Proceso de Análisis

1.  **Recopilación de Métricas de Ejecución**
    -   Medir el uso de tokens real vs. estimado.
    -   Rastrear el tiempo de implementación y las iteraciones.
    -   Documentar los fallos de las pruebas y sus correcciones.
    -   Analizar las métricas de calidad del código.

2.  **Análisis de Patrones de Éxito**
    -   Identificar qué funcionó bien.
    -   Extraer patrones reutilizables.
    -   Documentar elementos de contexto efectivos.
    -   Capturar estrategias de validación exitosas.

3.  **Aprendizaje de Patrones de Fallo**
    -   Documentar los problemas encontrados.
    -   Analizar las causas raíz.
    -   Crear estrategias de prevención.
    -   Actualizar la base de datos de problemas conocidos (gotchas).

4.  **Recomendaciones de Mejora de la Plantilla**
    -   Identificar lagunas de contexto.
    -   Sugerir mejoras en la validación.
    -   Recomendar actualizaciones de la documentación.
    -   Proponer nuevos anti-patrones.

5.  **Actualizaciones de la Base de Conocimiento**
    -   Añadir nuevos patrones de fallo a la base de datos.
    -   Actualizar las métricas de éxito.
    -   Mejorar la detección de funcionalidades similares.
    -   Mejorar la puntuación de confianza.

## Marco de Análisis

### Recopilación de Métricas

```bash
# Recopilar métricas de implementación
echo "Recopilando métricas de ejecución..."

# Obtener estadísticas de git
COMMITS_DURANTE_IMPL=$(git rev-list --count HEAD --since="2 hours ago")
ARCHIVOS_CAMBIADOS=$(git diff --name-only HEAD~$COMMITS_DURANTE_IMPL HEAD | wc -l)
LINEAS_AÑADIDAS=$(git diff --shortstat HEAD~$COMMITS_DURANTE_IMPL HEAD | grep -o '[0-9]* insertion' | grep -o '[0-9]*' || echo 0)
LINEAS_ELIMINADAS=$(git diff --shortstat HEAD~$COMMITS_DURANTE_IMPL HEAD | grep -o '[0-9]* deletion' | grep -o '[0-9]*' || echo 0)

# Obtener resultados de las pruebas
RESULTADOS_PRUEBAS=$(pytest tests/ --tb=no -q 2>&1 | tail -n 1)
PRUEBAS_PASADAS=$(echo "$RESULTADOS_PRUEBAS" | grep -o '[0-9]* passed' | grep -o '[0-9]*' || echo 0)
PRUEBAS_FALLIDAS=$(echo "$RESULTADOS_PRUEBAS" | grep -o '[0-9]* failed' | grep -o '[0-9]*' || echo 0)

# Obtener métricas de calidad del código
PROBLEMAS_RUFF=$(ruff check . 2>&1 | grep -c "error\|warning" || echo 0)
ERRORES_MYPY=$(mypy . 2>&1 | grep -c "error:" || echo 0)

echo "📊 Métricas de Implementación:"
echo "- Commits: $COMMITS_DURANTE_IMPL"
echo "- Archivos cambiados: $ARCHIVOS_CAMBIADOS"
echo "- Líneas añadidas: $LINEAS_AÑADIDAS"
echo "- Líneas eliminadas: $LINEAS_ELIMINADAS"
echo "- Pruebas pasadas: $PRUEBAS_PASADAS"
echo "- Pruebas fallidas: $PRUEBAS_FALLIDAS"
echo "- Problemas de Ruff: $PROBLEMAS_RUFF"
echo "- Errores de MyPy: $ERRORES_MYPY"
```

### Análisis de la Efectividad del Contexto

```python
# Analizar qué elementos del contexto fueron más valiosos
def analizar_efectividad_contexto(archivo_prp):
    """Analiza qué partes del PRP fueron más efectivas."""

    # Leer el archivo PRP
    with open(archivo_prp, 'r') as f:
        contenido_prp = f.read()

    # Extraer elementos del contexto
    elementos_contexto = {
        'urls_documentacion': re.findall(r'url: (https?://[^
]+)', contenido_prp),
        'referencias_archivos': re.findall(r'file: ([^
]+)', contenido_prp),
        'problemas_conocidos': re.findall(r'# CRITICAL: ([^
]+)', contenido_prp),
        'patrones': re.findall(r'# PATTERN: ([^
]+)', contenido_prp),
        'ejemplos': re.findall(r'examples/([^
]+)', contenido_prp)
    }

    # Analizar el historial de git para ver qué archivos fueron realmente referenciados
    archivos_git = subprocess.check_output(['git', 'log', '--name-only', '--pretty=format:', '--since=2 hours ago']).decode().strip().split('\n')

    # Calcular puntuaciones de efectividad
    puntuaciones_efectividad = {}
    for categoria, elementos in elementos_contexto.items():
        if elementos:
            contador_referenciados = sum(1 for elemento in elementos if any(elemento in archivo_git for archivo_git in archivos_git))
            puntuaciones_efectividad[categoria] = contador_referenciados / len(elementos) * 100
        else:
            puntuaciones_efectividad[categoria] = 0

    return puntuaciones_efectividad
```

### Detección de Patrones de Fallo

```python
# Extraer patrones de fallo de la implementación
def extraer_patrones_fallo():
    """Extrae nuevos patrones de fallo de la implementación."""

    patrones = []

    # Revisar los mensajes de commit de git en busca de indicadores de fallo
    mensajes_commit = subprocess.check_output(['git', 'log', '--oneline', '--since=2 hours ago']).decode().strip().split('\n')

    indicadores_fallo = ['fix', 'error', 'bug', 'issue', 'problem', 'typo', 'mistake']

    for mensaje in mensajes_commit:
        if any(indicador in mensaje.lower() for indicador in indicadores_fallo):
            # Extraer el tipo de fallo
            if 'async' in mensaje.lower():
                patrones.append({
                    'tipo': 'problema_contexto_async',
                    'descripcion': mensaje,
                    'frecuencia': 'alta',
                    'solucion': 'Usar siempre async/await de forma consistente'
                })
            elif 'import' in mensaje.lower():
                patrones.append({
                    'tipo': 'error_importacion',
                    'descripcion': mensaje,
                    'frecuencia': 'media',
                    'solucion': 'Verificar todas las importaciones antes de la implementación'
                })
            elif 'type' in mensaje.lower():
                patrones.append({
                    'tipo': 'error_tipo',
                    'descripcion': mensaje,
                    'frecuencia': 'media',
                    'solucion': 'Ejecutar la validación de mypy antes de proceder'
                })

    return patrones
```

### Identificación de Patrones de Éxito

```python
# Identificar patrones exitosos de la implementación
def identificar_patrones_exito():
    """Identifica patrones que llevaron a una implementación exitosa."""

    patrones_exito = []

    # Verificar ejecuciones de pruebas limpias
    salida_pruebas = subprocess.check_output(['pytest', 'tests/', '--tb=no', '-q']).decode()
    if 'passed' in salida_pruebas and 'failed' not in salida_pruebas:
        patrones_exito.append({
            'patron': 'pruebas_exhaustivas',
            'descripcion': 'Todas las pruebas pasaron en la implementación',
            'recomendacion_reutilizacion': 'Incluir una cobertura de pruebas similar en futuros PRPs'
        })

    # Verificar la calidad del código limpio
    salida_ruff = subprocess.check_output(['ruff', 'check', '.', '--quiet']).decode()
    if not salida_ruff.strip():
        patrones_exito.append({
            'patron': 'estilo_codigo_limpio',
            'descripcion': 'No se detectaron problemas de estilo',
            'recomendacion_reutilizacion': 'Mantener patrones de estilo consistentes'
        })

    # Verificar el manejo adecuado de errores
    archivos_python = subprocess.check_output(['find', '.', '-name', '*.py', '-not', '-path', './venv*']).decode().strip().split('\n')

    contador_manejo_errores = 0
    for archivo in archivos_python:
        if archivo.strip():
            with open(archivo, 'r') as f:
                contenido = f.read()
                if 'try:' in contenido and 'except' in contenido:
                    contador_manejo_errores += 1

    if contador_manejo_errores > 0:
        patrones_exito.append({
            'patron': 'manejo_errores_adecuado',
            'descripcion': f'Manejo de errores implementado en {contador_manejo_errores} archivos',
            'recomendacion_reutilizacion': 'Continuar incluyendo patrones de manejo de errores en los PRPs'
        })

    return patrones_exito
```

## Actualizaciones de la Base de Conocimiento

### Base de Datos de Patrones de Fallo

```yaml
# PRPs/knowledge_base/failure_patterns.yaml
patrones_fallo:
  - id: "mezcla_contexto_async"
    descripcion: "Mezclar contextos de código síncrono y asíncrono"
    frecuencia: "alta"
    señales_deteccion:
      - "RuntimeError: cannot be called from a running event loop"
      - "SyncError in async context"
    prevencion:
      - "Usar siempre async/await de forma consistente"
      - "Usar asyncio.run() para llamadas asíncronas de alto nivel"
    bibliotecas_relacionadas: ["asyncio", "aiohttp", "fastapi"]

  - id: "cambios_rompedores_pydantic_v2"
    descripcion: "Cambios de sintaxis de Pydantic v2"
    frecuencia: "media"
    señales_deteccion:
      - "ValidationError: Field required"
      - "AttributeError: 'Field' object has no attribute"
    prevencion:
      - "Usar Field() en lugar de ... para campos opcionales"
      - "Actualizar a la sintaxis v2 para los validadores"
    bibliotecas_relacionadas: ["pydantic", "fastapi"]

  - id: "variable_entorno_faltante"
    descripcion: "Variables de entorno faltantes"
    frecuencia: "media"
    señales_deteccion:
      - "KeyError: 'API_KEY'"
      - "None type has no attribute"
    prevencion:
      - "Revisar siempre la completitud de .env.example"
      - "Usar valores por defecto en la configuración"
    bibliotecas_relacionadas: ["python-dotenv", "pydantic-settings"]
```

### Base de Datos de Métricas de Éxito

```yaml
# PRPs/knowledge_base/success_metrics.yaml
metricas_exito:
  - tipo_funcionalidad: "integracion_api"
    uso_promedio_tokens: 2500
    tiempo_promedio_implementacion: 35
    tasa_exito: 85
    patrones_comunes:
      - "uso de cliente http asíncrono"
      - "manejo adecuado de errores"
      - "implementación de limitación de velocidad"

  - tipo_funcionalidad: "operaciones_bd"
    uso_promedio_tokens: 1800
    tiempo_promedio_implementacion: 25
    tasa_exito: 92
    patrones_comunes:
      - "sesiones asíncronas de sqlalchemy"
      - "manejo adecuado de migraciones"
      - "agrupación de conexiones"

  - tipo_funcionalidad: "aplicaciones_cli"
    uso_promedio_tokens: 1200
    tiempo_promedio_implementacion: 20
    tasa_exito: 95
    patrones_comunes:
      - "uso de click o typer"
      - "análisis adecuado de argumentos"
      - "salida coloreada"
```

## Generación de Informe de Análisis

```python
# Generar informe de análisis completo
def generar_informe_analisis(archivo_prp):
    """Genera un informe de análisis completo."""

    informe = {
        'archivo_prp': archivo_prp,
        'timestamp': datetime.now().isoformat(),
        'metricas': recopilar_metricas(),
        'efectividad_contexto': analizar_efectividad_contexto(archivo_prp),
        'patrones_fallo': extraer_patrones_fallo(),
        'patrones_exito': identificar_patrones_exito(),
        'recomendaciones': generar_recomendaciones(),
        'validacion_confianza': validar_puntuacion_confianza(archivo_prp)
    }

    # Guardar en la base de conocimiento
    guardar_en_base_conocimiento(informe)

    # Generar informe legible por humanos
    return formatear_informe_analisis(informe)

def recopilar_metricas():
    """Recopila las métricas de implementación."""
    # Estadísticas de Git
    commits = obtener_contador_commits_desde_hace_horas(2)
    archivos_cambiados = obtener_archivos_cambiados_en_commits(commits)
    estadisticas_lineas = obtener_estadisticas_cambio_lineas(commits)

    # Resultados de las pruebas
    resultados_pruebas = ejecutar_suite_pruebas()

    # Calidad del código
    metricas_calidad = obtener_metricas_calidad_codigo()

    return {
        'commits': commits,
        'archivos_cambiados': archivos_cambiados,
        'lineas_añadidas': estadisticas_lineas['añadidas'],
        'lineas_eliminadas': estadisticas_lineas['eliminadas'],
        'pruebas_pasadas': resultados_pruebas['pasadas'],
        'pruebas_fallidas': resultados_pruebas['fallidas'],
        'problemas_ruff': metricas_calidad['problemas_ruff'],
        'errores_mypy': metricas_calidad['errores_mypy'],
        'tiempo_implementacion_minutos': calcular_tiempo_implementacion()
    }

def generar_recomendaciones():
    """Genera recomendaciones para futuros PRPs."""
    recomendaciones = []

    # Analizar la implementación actual en busca de oportunidades de mejora
    metricas = recopilar_metricas()

    if metricas['pruebas_fallidas'] > 0:
        recomendaciones.append({
            'tipo': 'pruebas',
            'prioridad': 'alta',
            'sugerencia': 'Añadir casos de prueba más completos a la plantilla de PRP',
            'justificacion': f"Hubo {metricas['pruebas_fallidas']} fallos en las pruebas durante la implementación"
        })

    if metricas['problemas_ruff'] > 5:
        recomendaciones.append({
            'tipo': 'calidad_codigo',
            'prioridad': 'media',
            'sugerencia': 'Incluir una verificación de estilo más estricta en el bucle de validación',
            'justificacion': f"Se encontraron {metricas['problemas_ruff']} problemas de estilo"
        })

    if metricas['tiempo_implementacion_minutos'] > 60:
        recomendaciones.append({
            'tipo': 'complejidad',
            'prioridad': 'media',
            'sugerencia': 'Desglosar las funcionalidades complejas en PRPs más pequeños',
            'justificacion': f"La implementación tardó {metricas['tiempo_implementacion_minutos']} minutos"
        })

    return recomendaciones

def validar_puntuacion_confianza(archivo_prp):
    """Valida si la puntuación de confianza original era precisa."""
    # Extraer la puntuación de confianza original del PRP
    with open(archivo_prp, 'r') as f:
        contenido = f.read()

    coincidencia_confianza = re.search(r'Puntuación de Confianza: (\d+)/10', contenido)
    confianza_original = int(coincidencia_confianza.group(1)) if coincidencia_confianza else None

    # Calcular indicadores de éxito reales
    metricas = recopilar_metricas()

    # Puntuación basada en resultados reales
    puntuacion_real = 10

    if metricas['pruebas_fallidas'] > 0:
        puntuacion_real -= 2
    if metricas['errores_mypy'] > 0:
        puntuacion_real -= 1
    if metricas['problemas_ruff'] > 10:
        puntuacion_real -= 1
    if metricas['tiempo_implementacion_minutos'] > 90:
        puntuacion_real -= 2
    if metricas['commits'] > 10:  # Demasiadas iteraciones
        puntuacion_real -= 1

    return {
        'confianza_original': confianza_original,
        'puntuacion_real': max(puntuacion_real, 1),
        'precision': abs(confianza_original - puntuacion_real) <= 2 if confianza_original else None
    }
```

## Formato de Salida del Informe

```yaml
📊 Informe de Análisis de PRP
======================

🎯 Resumen de la Implementación:
- Archivo PRP: {archivo_prp}
- Fecha de Ejecución: {timestamp}
- Éxito General: [ÉXITO/PARCIAL/FALLIDO]

📈 Métricas:
- Commits durante la implementación: {commits}
- Archivos cambiados: {archivos_cambiados}
- Líneas añadidas/eliminadas: {lineas_añadidas}/{lineas_eliminadas}
- Tiempo de implementación: {tiempo_implementacion_minutos} minutos
- Pruebas: {pruebas_pasadas} pasadas, {pruebas_fallidas} fallidas
- Calidad del código: {problemas_ruff} problemas de estilo, {errores_mypy} errores de tipo

🎯 Efectividad del Contexto:
- URLs de documentación: {porcentaje_efectividad}% referenciadas
- Referencias de archivos: {porcentaje_efectividad}% usadas
- Ejemplos: {porcentaje_efectividad}% seguidos
- Problemas conocidos: {porcentaje_efectividad}% previnieron problemas

🔍 Patrones Descubiertos:
Patrones de Éxito:
{for patron in patrones_exito}
  ✅ {patron.descripcion}
     → Reutilización: {patron.recomendacion_reutilizacion}

Patrones de Fallo:
{for patron in patrones_fallo}
  ❌ {patron.descripcion}
     → Prevención: {patron.solucion}

🎯 Validación de la Puntuación de Confianza:
- Estimación original: {confianza_original}/10
- Rendimiento real: {puntuacion_real}/10
- Precisión de la predicción: {precision ? "Buena" : "Necesita mejorar"}

💡 Recomendaciones para Futuros PRPs:
{for rec in recomendaciones}
  [{rec.prioridad}] {rec.sugerencia}
  Razón: {rec.justificacion}

📚 Actualizaciones de la Base de Conocimiento:
- Nuevos patrones de fallo: {contador_nuevos_patrones_fallo}
- Métricas de éxito actualizadas: {contador_metricas_actualizadas}
- Mejoras en la plantilla: {contador_mejoras_plantilla}
```

## Integración con la Base de Conocimiento

### Actualizar Base de Datos de Patrones de Fallo

```bash
# Actualizar la base de datos de patrones de fallo
echo "Actualizando la base de datos de patrones de fallo..."

# Añadir nuevos patrones a PRPs/knowledge_base/failure_patterns.yaml
python3 -c "
import yaml
import sys
from datetime import datetime

# Cargar patrones existentes
try:
    with open('PRPs/knowledge_base/failure_patterns.yaml', 'r') as f:
        db = yaml.safe_load(f) or {'patrones_fallo': []}
except FileNotFoundError:
    db = {'patrones_fallo': []}

# Añadir nuevos patrones del análisis
nuevos_patrones = extraer_patrones_fallo()
for patron in nuevos_patrones:
    # Comprobar si el patrón ya existe
    existente = next((p for p in db['patrones_fallo'] if p.get('id') == patron['tipo']), None)

    if existente:
        # Actualizar la frecuencia si se vuelve a ver el patrón
        existente['ultima_vez_visto'] = datetime.now().isoformat()
        existente['frecuencia'] = 'alta' if existente.get('frecuencia') == 'media' else existente.get('frecuencia', 'media')
    else:
        # Añadir nuevo patrón
        db['patrones_fallo'].append({
            'id': patron['tipo'],
            'descripcion': patron['descripcion'],
            'frecuencia': patron['frecuencia'],
            'solucion': patron['solucion'],
            'primera_vez_visto': datetime.now().isoformat(),
            'ultima_vez_visto': datetime.now().isoformat()
        })

# Guardar la base de datos actualizada
with open('PRPs/knowledge_base/failure_patterns.yaml', 'w') as f:
    yaml.dump(db, f, default_flow_style=False, allow_unicode=True)

print(f'Base de datos de patrones de fallo actualizada con {len(nuevos_patrones)} nuevos patrones')
"
```

### Actualizar Métricas de Éxito

```bash
# Actualizar las métricas de éxito para este tipo de funcionalidad
echo "Actualizando las métricas de éxito..."

python3 -c "
import yaml
from datetime import datetime

# Determinar el tipo de funcionalidad a partir del contenido del PRP
tipo_funcionalidad = determinar_tipo_funcionalidad('$PRP_FILE')
metricas = recopilar_metricas()

# Cargar métricas existentes
try:
    with open('PRPs/knowledge_base/success_metrics.yaml', 'r') as f:
        db = yaml.safe_load(f) or {'metricas_exito': []}
except FileNotFoundError:
    db = {'metricas_exito': []}

# Encontrar o crear una entrada para este tipo de funcionalidad
existente = next((m for m in db['metricas_exito'] if m.get('tipo_funcionalidad') == tipo_funcionalidad), None)

if existente:
    # Actualizar promedios móviles
    existente['implementaciones'] = existente.get('implementaciones', 0) + 1
    existente['uso_promedio_tokens'] = actualizar_promedio_movil(
        existente['uso_promedio_tokens'],
        metricas['tokens_estimados'],
        existente['implementaciones']
    )
    existente['tiempo_promedio_implementacion'] = actualizar_promedio_movil(
        existente['tiempo_promedio_implementacion'],
        metricas['tiempo_implementacion_minutos'],
        existente['implementaciones']
    )
    # Actualizar tasa de éxito basada en los resultados de las pruebas
    exito = 1 if metricas['pruebas_fallidas'] == 0 else 0
    existente['tasa_exito'] = actualizar_promedio_movil(
        existente['tasa_exito'],
        exito * 100,
        existente['implementaciones']
    )
else:
    # Crear nueva entrada
    tasa_exito = 100 if metricas['pruebas_fallidas'] == 0 else 0
    db['metricas_exito'].append({
        'tipo_funcionalidad': tipo_funcionalidad,
        'implementaciones': 1,
        'uso_promedio_tokens': metricas.get('tokens_estimados', 0),
        'tiempo_promedio_implementacion': metricas['tiempo_implementacion_minutos'],
        'tasa_exito': tasa_exito,
        'ultima_actualizacion': datetime.now().isoformat()
    })

# Guardar métricas actualizadas
with open('PRPs/knowledge_base/success_metrics.yaml', 'w') as f:
    yaml.dump(db, f, default_flow_style=False, allow_unicode=True)
"
```

## Sugerencias de Mejora de Plantilla

```python
# Generar mejoras específicas para la plantilla
def sugerir_mejoras_plantilla():
    """Sugiere mejoras específicas para las plantillas de PRP."""

    mejoras = []

    # Analizar qué contexto faltaba
    contexto_faltante = analizar_contexto_faltante()
    for contexto in contexto_faltante:
        mejoras.append({
            'seccion': 'Contexto',
            'mejora': f'Añadir validación de {contexto["tipo"]} a la plantilla',
            'justificacion': f'La falta de {contexto["descripcion"]} causó un retraso en la implementación'
        })

    # Analizar lagunas de validación
    lagunas_validacion = analizar_lagunas_validacion()
    for laguna in lagunas_validacion:
        mejoras.append({
            'seccion': 'Validación',
            'mejora': f'Añadir paso de validación de {laguna["tipo"]}',
            'justificacion': f'Habría detectado {laguna["problema"]} antes'
        })

    # Analizar lagunas de documentación
    lagunas_doc = analizar_lagunas_documentacion()
    for laguna in lagunas_doc:
        mejoras.append({
            'seccion': 'Documentación',
            'mejora': f'Incluir documentación de {laguna["tipo"]}',
            'justificacion': f'Tuve que investigar sobre {laguna["tema"]} durante la implementación'
        })

    return mejoras

# Generar automáticamente una plantilla mejorada
def generar_plantilla_mejorada():
    """Genera una plantilla mejorada basada en las lecciones aprendidas."""

    plantilla_base = cargar_plantilla('PRPs/templates/prp_base.md')
    mejoras = sugerir_mejoras_plantilla()

    # Aplicar mejoras a la plantilla
    plantilla_mejorada = aplicar_mejoras(plantilla_base, mejoras)

    # Guardar como plantilla versionada
    timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
    guardar_plantilla(f'PRPs/templates/prp_base_v{timestamp}.md', plantilla_mejorada)

    return plantilla_mejorada
```

## Mecanismo de Auto-actualización

```bash
# Auto-actualizar las plantillas de PRP basadas en el análisis
echo "Comprobando actualizaciones de la plantilla..."

CONTADOR_ANALISIS=$(find PRPs/analysis_reports/ -name "*.yaml" | wc -l)
VERSION_PLANTILLA=$(ls PRPs/templates/prp_base_v*.md 2>/dev/null | tail -n1 | grep -o 'v[0-9_]*' || echo "v1")

# Si tenemos 5+ análisis desde la última actualización de la plantilla, generar nueva versión
if [ "$CONTADOR_ANALISIS" -ge 5 ]; then
    echo "Generando plantilla mejorada basada en análisis recientes..."
    python3 -c "
from analysis_utils import generate_improved_template
improved_template = generate_improved_template()
print('Plantilla mejorada generada con los últimos aprendizajes')
"
fi
```

## Integración con el Comando de Ejecución

Actualizar el comando `execute-prp` para ejecutar automáticamente el análisis después de la finalización:

```bash
# Añadir al final de execute-prp.md
echo "Ejecutando análisis post-ejecución..."
analyze-prp-results "$PRP_FILE"

echo "✅ Implementación completa con análisis"
echo "📊 Revisa PRPs/analysis_reports/ para un análisis detallado"
echo "💡 Las mejoras de la plantilla se aplicarán a futuros PRPs"
```

## Bucle de Mejora Continua

Este sistema de análisis crea un bucle de mejora continua:

1.  **Ejecutar PRP** → Implementar funcionalidad
2.  **Analizar Resultados** → Extraer patrones y métricas
3.  **Actualizar Base de Conocimiento** → Almacenar aprendizajes
4.  **Mejorar Plantillas** → Aplicar aprendizajes a futuros PRPs
5.  **Mejor Contexto** → Tasas de éxito más altas

El sistema aprende de cada implementación, haciendo que los futuros PRPs sean más efectivos y reduciendo las tasas de fallo con el tiempo.