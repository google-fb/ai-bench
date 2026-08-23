"""Benchmark runner: execute a model over a set of tasks and aggregate results."""

from __future__ import annotations

import time
from collections.abc import Iterable
from dataclasses import dataclass, field

from ai_bench.models import Model
from ai_bench.scoring import score
from ai_bench.tasks import Task


@dataclass
class TaskResult:
    task_id: str
    category: str
    prompt: str
    expected: str
    prediction: str
    score: float
    latency_ms: float

    @property
    def passed(self) -> bool:
        return self.score >= 1.0


@dataclass
class BenchmarkReport:
    model_name: str
    results: list[TaskResult] = field(default_factory=list)

    @property
    def total(self) -> int:
        return len(self.results)

    @property
    def passed(self) -> int:
        return sum(1 for r in self.results if r.passed)

    @property
    def accuracy(self) -> float:
        return (self.passed / self.total) if self.total else 0.0

    @property
    def avg_latency_ms(self) -> float:
        if not self.results:
            return 0.0
        return sum(r.latency_ms for r in self.results) / self.total

    def accuracy_by_category(self) -> dict[str, float]:
        totals: dict[str, int] = {}
        hits: dict[str, int] = {}
        for r in self.results:
            totals[r.category] = totals.get(r.category, 0) + 1
            hits[r.category] = hits.get(r.category, 0) + (1 if r.passed else 0)
        return {cat: hits[cat] / totals[cat] for cat in sorted(totals)}

    def to_dict(self) -> dict:
        return {
            "model": self.model_name,
            "summary": {
                "total": self.total,
                "passed": self.passed,
                "accuracy": round(self.accuracy, 4),
                "avg_latency_ms": round(self.avg_latency_ms, 4),
                "accuracy_by_category": {
                    k: round(v, 4) for k, v in self.accuracy_by_category().items()
                },
            },
            "results": [
                {
                    "task_id": r.task_id,
                    "category": r.category,
                    "expected": r.expected,
                    "prediction": r.prediction,
                    "score": r.score,
                    "latency_ms": round(r.latency_ms, 4),
                }
                for r in self.results
            ],
        }


def run_benchmark(model: Model, tasks: Iterable[Task], *, model_name: str = "model") -> BenchmarkReport:
    """Run ``model`` against ``tasks`` and return an aggregated report."""

    report = BenchmarkReport(model_name=model_name)
    for task in tasks:
        start = time.perf_counter()
        try:
            prediction = model(task.prompt)
        except Exception as exc:  # a failing model should not abort the run
            prediction = f"<error: {exc}>"
        latency_ms = (time.perf_counter() - start) * 1000.0
        report.results.append(
            TaskResult(
                task_id=task.id,
                category=task.category,
                prompt=task.prompt,
                expected=task.answer,
                prediction=prediction,
                score=score(prediction, task.answer),
                latency_ms=latency_ms,
            )
        )
    return report
