"""Human-readable rendering of a :class:`~ai_bench.runner.BenchmarkReport`."""

from __future__ import annotations

from rich.console import Console
from rich.table import Table

from ai_bench.runner import BenchmarkReport


def render_report(
    report: BenchmarkReport,
    *,
    console: Console | None = None,
    show_details: bool = False,
) -> None:
    """Print a summary table (and optionally per-task detail) to the console."""

    console = console or Console()

    summary = Table(title=f"ai-bench results — model: {report.model_name}")
    summary.add_column("Metric", style="cyan", no_wrap=True)
    summary.add_column("Value", style="magenta")
    summary.add_row("Tasks", str(report.total))
    summary.add_row("Passed", str(report.passed))
    summary.add_row("Accuracy", f"{report.accuracy:.1%}")
    summary.add_row("Avg latency", f"{report.avg_latency_ms:.3f} ms")
    console.print(summary)

    by_cat = report.accuracy_by_category()
    if by_cat:
        cat_table = Table(title="Accuracy by category")
        cat_table.add_column("Category", style="cyan")
        cat_table.add_column("Accuracy", style="magenta")
        for category, accuracy in by_cat.items():
            cat_table.add_row(category, f"{accuracy:.1%}")
        console.print(cat_table)

    if show_details:
        detail = Table(title="Per-task detail")
        detail.add_column("Task", style="cyan")
        detail.add_column("Category")
        detail.add_column("Expected", style="green")
        detail.add_column("Prediction", style="yellow")
        detail.add_column("Result")
        for result in report.results:
            detail.add_row(
                result.task_id,
                result.category,
                result.expected,
                result.prediction,
                "[green]PASS[/green]" if result.passed else "[red]FAIL[/red]",
            )
        console.print(detail)
