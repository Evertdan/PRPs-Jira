#!/usr/bin/env -S uv run --script
"""Ejecuta un agente de codificación de IA contra un PRP.

Versión KISS - sin suposiciones específicas del repositorio.

Uso típico:
    uv run RUNNERS/claude_runner.py --prp test --interactive
    uv run RUNNERS/claude_runner.py --prp test --output-format json
    uv run RUNNERS/claude_runner.py --prp test --output-format stream-json

Argumentos:
    --prp-path       Ruta a un archivo markdown de PRP (sobrescribe --prp)
    --prp            Clave de la funcionalidad; se resuelve a PRPs/{funcionalidad}.md
    --model          Ejecutable de CLI para el LLM (por defecto: "claude") Solo Claude Code es compatible por ahora
    --interactive    Pasa directamente para ejecutar el modelo en modo de chat; de lo contrario, sin supervisión.
    --output-format  Formato de salida para el modo sin supervisión: text, json, stream-json (por defecto: text)
"""

from __future__ import annotations

import argparse
import json
import os
import subprocess
import sys
from pathlib import Path
from typing import Any, Dict, Iterator

ROOT = Path(__file__).resolve().parent.parent  # raíz del proyecto

META_HEADER = """Ingiere y comprende en detalle el Prompt de Requisito de Producto (PRP) a continuación.

    # GUÍA DE FLUJO DE TRABAJO:

    ## Fase de Planificación
    - Piensa detenidamente antes de codificar. Crea un plan completo que aborde todos los requisitos.
    - Desglosa las tareas complejas en pasos más pequeños y manejables.
    - Usa la herramienta TodoWrite para crear y seguir tu plan de implementación.
    - Identifica patrones de implementación del código existente para seguirlos.

    ## Fase de Implementación
    - Sigue las convenciones y patrones de código encontrados en los archivos existentes.
    - Implementa un componente a la vez y verifica que funcione correctamente.
    - Escribe código claro y mantenible con comentarios apropiados.
    - Considera el manejo de errores, los casos borde y los posibles problemas de seguridad.
    - Usa anotaciones de tipo (type hints) para garantizar la seguridad de tipos.

    ## Fase de Pruebas
    - Prueba cada componente a fondo a medida que lo construyes.
    - Usa las puertas de validación proporcionadas para verificar tu implementación.
    - Verifica que se hayan cumplido todos los requisitos.
    - Ejecuta las pruebas del proyecto cuando termines y emite "DONE" cuando pasen.

    ## Enfoque de Implementación de Ejemplo:
    1. Analiza los requisitos del PRP en detalle.
    2. Busca y comprende los patrones existentes en la base de código.
    3. Busca en la Web y recopila contexto y ejemplos adicionales.
    4. Crea un plan de implementación paso a paso con TodoWrite.
    5. Implementa primero la funcionalidad principal, luego las características adicionales.
    6. Prueba y valida cada componente.
    7. Asegúrate de que todas las puertas de validación pasen

    ***Cuando hayas terminado, mueve el PRP completado a la carpeta PRPs/completed***
    """


def build_prompt(prp_path: Path) -> str:
    return META_HEADER + prp_path.read_text()


def stream_json_output(process: subprocess.Popen) -> Iterator[Dict[str, Any]]:
    """Analiza la salida JSON en streaming línea por línea."""
    for line in process.stdout:
        line = line.strip()
        if line:
            try:
                yield json.loads(line)
            except json.JSONDecodeError as e:
                print(f"Advertencia: No se pudo analizar la línea JSON: {e}", file=sys.stderr)
                print(f"Contenido de la línea: {line}", file=sys.stderr)


def handle_json_output(output: str) -> Dict[str, Any]:
    """Analiza la salida JSON de Claude Code."""
    try:
        return json.loads(output)
    except json.JSONDecodeError as e:
        print(f"Error al analizar la salida JSON: {e}", file=sys.stderr)
        return {"error": "No se pudo analizar la salida JSON", "raw": output}


def run_model(
    prompt: str,
    model: str = "claude",
    interactive: bool = False,
    output_format: str = "text",
) -> None:
    if interactive:
        # Modo de chat: alimenta el prompt a través de STDIN, sin la bandera -p para que el usuario pueda continuar la sesión.
        cmd = [
            model,
            "--allowedTools",
            "Edit,Bash,Write,MultiEdit,NotebookEdit,WebFetch,Agent,LS,Grep,Read,NotebookRead,TodoRead,TodoWrite,WebSearch",
        ]
        subprocess.run(cmd, input=prompt.encode(), check=True)
    else:
        # Sin supervisión: pasa el prompt a través de -p para el modo no interactivo
        cmd = [
            model,
            "-p",  # Esta es la bandera --print para el modo no interactivo
            prompt,
            "--allowedTools",
            "Edit,Bash,Write,MultiEdit,NotebookEdit,WebFetch,Agent,LS,Grep,Read,NotebookRead,TodoRead,TodoWrite,WebSearch",
            # "--max-turns",
            # "30",  # Límite de seguridad para el modo sin supervisión, descomentar si es necesario
            "--output-format",
            output_format,
        ]

        if output_format == "stream-json":
            # Manejar la salida JSON en streaming
            process = subprocess.Popen(
                cmd,
                stdout=subprocess.PIPE,
                stderr=subprocess.PIPE,
                text=True,
                bufsize=1,  # Búfer de línea
            )

            try:
                for message in stream_json_output(process):
                    # Procesar cada mensaje a medida que llega
                    if (
                        message.get("type") == "system"
                        and message.get("subtype") == "init"
                    ):
                        print(
                            f"Sesión iniciada: {message.get('session_id')}",
                            file=sys.stderr,
                        )
                    elif message.get("type") == "assistant":
                        print(
                            f"Asistente: {message.get('message', {}).get('content', '')[:100]}...",
                            file=sys.stderr,
                        )
                    elif message.get("type") == "result":
                        print(f"\nResultado final:", file=sys.stderr)
                        print(
                            f"  Éxito: {message.get('subtype') == 'success'}",
                            file=sys.stderr,
                        )
                        print(
                            f"  Costo: ${message.get('cost_usd', 0):.4f}",
                            file=sys.stderr,
                        )
                        print(
                            f"  Duración: {message.get('duration_ms', 0)}ms",
                            file=sys.stderr,
                        )
                        print(
                            f"  Turnos: {message.get('num_turns', 0)}", file=sys.stderr
                        )
                        if message.get("result"):
                            print(
                                f"\nTexto del resultado:\n{message.get('result')}",
                                file=sys.stderr,
                            )

                    # Imprimir el mensaje completo para el procesamiento posterior
                    print(json.dumps(message))

                # Esperar a que el proceso termine
                process.wait()
                if process.returncode != 0:
                    stderr = process.stderr.read()
                    print(
                        f"Claude Code falló con el código de salida {process.returncode}",
                        file=sys.stderr,
                    )
                    print(f"Error: {stderr}", file=sys.stderr)
                    sys.exit(process.returncode)

            except KeyboardInterrupt:
                process.terminate()
                print("\nInterrumpido por el usuario", file=sys.stderr)
                sys.exit(1)

        elif output_format == "json":
            # Manejar la salida JSON completa
            result = subprocess.run(cmd, capture_output=True, text=True)
            if result.returncode != 0:
                print(
                    f"Claude Code falló con el código de salida {result.returncode}",
                    file=sys.stderr,
                )
                print(f"Error: {result.stderr}", file=sys.stderr)
                sys.exit(result.returncode)

            # Analizar e imprimir el JSON de forma legible
            json_data = handle_json_output(result.stdout)
            print(json.dumps(json_data, indent=2))

            # Imprimir un resumen en stderr para la visibilidad del usuario
            if isinstance(json_data, dict):
                if json_data.get("type") == "result":
                    print(f"\nResumen:", file=sys.stderr)
                    print(
                        f"  Éxito: {not json_data.get('is_error', False)}",
                        file=sys.stderr,
                    )
                    print(
                        f"  Costo: ${json_data.get('cost_usd', 0):.4f}", file=sys.stderr
                    )
                    print(
                        f"  Duración: {json_data.get('duration_ms', 0)}ms",
                        file=sys.stderr,
                    )
                    print(
                        f"  Sesión: {json_data.get('session_id', 'unknown')}",
                        file=sys.stderr,
                    )

        else:
            # Salida de texto por defecto
            subprocess.run(cmd, check=True)


def main() -> None:
    parser = argparse.ArgumentParser(description="Ejecuta un PRP con un agente LLM.")
    parser.add_argument(
        "--prp-path", help="Ruta relativa al archivo PRP, ej: PRPs/funcionalidad.md"
    )
    parser.add_argument(
        "--prp", help="El nombre de archivo del PRP sin la extensión .md, ej: funcionalidad"
    )
    parser.add_argument(
        "--interactive", action="store_true", help="Lanza una sesión de chat interactiva"
    )
    parser.add_argument("--model", default="claude", help="Nombre del ejecutable de la CLI del modelo")
    parser.add_argument(
        "--output-format",
        choices=["text", "json", "stream-json"],
        default="text",
        help="Formato de salida para el modo sin supervisión (por defecto: text)",
    )
    args = parser.parse_args()

    if not args.prp_path and not args.prp:
        sys.exit("Debes proporcionar --prp o --prp-path")

    prp_path = Path(args.prp_path) if args.prp_path else ROOT / f"PRPs/{args.prp}.md"
    if not prp_path.exists():
        sys.exit(f"PRP no encontrado: {prp_path}")

    os.chdir(ROOT)  # asegurar que las rutas relativas coincidan con las expectativas del PRP
    prompt = build_prompt(prp_path)
    run_model(
        prompt,
        model=args.model,
        interactive=args.interactive,
        output_format=args.output_format,
    )


if __name__ == "__main__":
    main()