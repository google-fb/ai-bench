from pathlib import Path

from ai_bench.models import calculator_model, constant_zero_model
from ai_bench.runner import run_benchmark
from ai_bench.tasks import Task, load_tasks

_TASKS_FILE = Path(__file__).resolve().parents[1] / "data" / "tasks" / "arithmetic.jsonl"


def _sample_tasks():
    return [
        Task(id="a", category="addition", prompt="What is 1 + 1?", answer="2"),
        Task(id="b", category="addition", prompt="What is 2 + 2?", answer="4"),
    ]


def test_calculator_scores_perfectly_on_sample():
    report = run_benchmark(calculator_model, _sample_tasks(), model_name="calculator")
    assert report.total == 2
    assert report.passed == 2
    assert report.accuracy == 1.0


def test_constant_model_mostly_fails():
    report = run_benchmark(constant_zero_model, _sample_tasks(), model_name="constant")
    assert report.passed == 0
    assert report.accuracy == 0.0


def test_report_to_dict_structure():
    report = run_benchmark(calculator_model, _sample_tasks(), model_name="calculator")
    payload = report.to_dict()
    assert payload["model"] == "calculator"
    assert payload["summary"]["total"] == 2
    assert "accuracy_by_category" in payload["summary"]
    assert len(payload["results"]) == 2


def test_bundled_dataset_loads_and_runs():
    tasks = load_tasks(_TASKS_FILE)
    assert len(tasks) == 10
    report = run_benchmark(calculator_model, tasks, model_name="calculator")
    # The calculator should solve every bundled arithmetic task.
    assert report.accuracy == 1.0
