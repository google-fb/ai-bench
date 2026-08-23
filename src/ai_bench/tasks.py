"""Task definitions and loading.

A task is a single benchmark item: a prompt with a known reference answer and a
category used for per-category aggregation.
"""

from __future__ import annotations

import json
from dataclasses import dataclass
from pathlib import Path


@dataclass(frozen=True)
class Task:
    """A single benchmark item."""

    id: str
    category: str
    prompt: str
    answer: str

    @classmethod
    def from_dict(cls, raw: dict, *, source: str = "<dict>") -> Task:
        missing = [k for k in ("id", "category", "prompt", "answer") if k not in raw]
        if missing:
            raise ValueError(f"task in {source} is missing field(s): {', '.join(missing)}")
        return cls(
            id=str(raw["id"]),
            category=str(raw["category"]),
            prompt=str(raw["prompt"]),
            answer=str(raw["answer"]),
        )


def load_tasks(path: str | Path) -> list[Task]:
    """Load tasks from a JSONL file (one JSON object per non-empty line)."""

    path = Path(path)
    if not path.exists():
        raise FileNotFoundError(f"task file not found: {path}")

    tasks: list[Task] = []
    seen_ids: set[str] = set()
    with path.open("r", encoding="utf-8") as handle:
        for lineno, line in enumerate(handle, start=1):
            line = line.strip()
            if not line or line.startswith("#"):
                continue
            try:
                raw = json.loads(line)
            except json.JSONDecodeError as exc:
                raise ValueError(f"{path}:{lineno}: invalid JSON: {exc}") from exc
            task = Task.from_dict(raw, source=f"{path}:{lineno}")
            if task.id in seen_ids:
                raise ValueError(f"{path}:{lineno}: duplicate task id {task.id!r}")
            seen_ids.add(task.id)
            tasks.append(task)

    if not tasks:
        raise ValueError(f"no tasks found in {path}")
    return tasks
