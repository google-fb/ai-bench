"""Command-line interface for ai-bench."""

from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path

from rich.console import Console

from ai_bench import __version__
from ai_bench.models import get_model, list_models
from ai_bench.report import render_report
from ai_bench.runner import run_benchmark
from ai_bench.tasks import load_tasks

_DEFAULT_TASKS = Path(__file__).resolve().parents[2] / "data" / "tasks" / "arithmetic.jsonl"


def _build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(
        prog="ai-bench",
        description="A tiny, offline harness for benchmarking models on tasks.",
    )
    parser.add_argument("--version", action="version", version=f"ai-bench {__version__}")
    sub = parser.add_subparsers(dest="command", required=True)

    run = sub.add_parser("run", help="Run a benchmark for a model over a task set.")
    run.add_argument("--model", default="calculator", help="Registered model name (default: calculator).")
    run.add_argument(
        "--tasks",
        default=str(_DEFAULT_TASKS),
        help="Path to a JSONL task file (default: bundled arithmetic set).",
    )
    run.add_argument("--output", help="Optional path to write the JSON report.")
    run.add_argument("--details", action="store_true", help="Show per-task detail table.")

    sub.add_parser("list-models", help="List registered models.")

    lt = sub.add_parser("list-tasks", help="List tasks in a task file.")
    lt.add_argument("--tasks", default=str(_DEFAULT_TASKS), help="Path to a JSONL task file.")

    return parser


def main(argv: list[str] | None = None) -> int:
    parser = _build_parser()
    args = parser.parse_args(argv)
    console = Console()

    if args.command == "list-models":
        for name in list_models():
            console.print(name)
        return 0

    if args.command == "list-tasks":
        tasks = load_tasks(args.tasks)
        for task in tasks:
            console.print(f"[cyan]{task.id}[/cyan] ([magenta]{task.category}[/magenta]): {task.prompt}")
        console.print(f"\n{len(tasks)} task(s).")
        return 0

    if args.command == "run":
        try:
            model = get_model(args.model)
        except KeyError as exc:
            console.print(f"[red]{exc}[/red]")
            return 2
        tasks = load_tasks(args.tasks)
        report = run_benchmark(model, tasks, model_name=args.model)
        render_report(report, console=console, show_details=args.details)

        if args.output:
            out_path = Path(args.output)
            out_path.parent.mkdir(parents=True, exist_ok=True)
            out_path.write_text(json.dumps(report.to_dict(), indent=2), encoding="utf-8")
            console.print(f"\nWrote JSON report to [green]{out_path}[/green]")
        return 0

    parser.error(f"unknown command: {args.command}")
    return 2  # unreachable, parser.error exits


if __name__ == "__main__":
    sys.exit(main())
