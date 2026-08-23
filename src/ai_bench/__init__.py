"""ai-bench: a small, fully-offline harness for benchmarking models on tasks.

The package intentionally ships deterministic, offline "models" so the entire
benchmark can run end to end without network access or API keys. Real API-backed
models can be registered the same way (see ``ai_bench.models``).
"""

from ai_bench.models import Model, get_model, list_models, register_model
from ai_bench.runner import BenchmarkReport, TaskResult, run_benchmark
from ai_bench.scoring import score
from ai_bench.tasks import Task, load_tasks

__all__ = [
    "Task",
    "load_tasks",
    "Model",
    "get_model",
    "list_models",
    "register_model",
    "score",
    "BenchmarkReport",
    "TaskResult",
    "run_benchmark",
]

__version__ = "0.1.0"
