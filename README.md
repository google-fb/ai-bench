# ai-bench

A tiny, **fully-offline** harness for benchmarking models on tasks. It runs a
model over a set of tasks with known answers, scores the predictions, and
reports overall and per-category accuracy plus latency.

The bundled models are deterministic and require **no API keys or network
access**, so the whole benchmark runs end to end out of the box. Real,
API-backed models can be added the same way (see `src/ai_bench/models.py`).

## Requirements

- Python 3.10+
- pip

## Install

```bash
python3 -m venv .venv
source .venv/bin/activate
python3 -m pip install --upgrade pip
python3 -m pip install -e ".[dev]"   # runtime + dev (pytest, ruff)
```

For runtime only: `python3 -m pip install -e .` (or `pip install -r requirements.txt`).

## Usage

```bash
# List the built-in offline models
ai-bench list-models

# List the bundled arithmetic tasks
ai-bench list-tasks

# Run the calculator model over the bundled tasks (writes a JSON report)
ai-bench run --model calculator --details --output results.json

# Run a trivial baseline for comparison
ai-bench run --model constant
```

You can also invoke the module directly: `python3 -m ai_bench run ...`.

### Task format

Tasks live in JSONL files (one JSON object per line). Lines starting with `#`
are ignored. Each task has:

```json
{"id": "add-1", "category": "addition", "prompt": "What is 12 + 30?", "answer": "42"}
```

Point `--tasks` at your own JSONL file to benchmark a different task set.

## Development

```bash
pytest            # run the test suite
ruff check .      # lint
```

## Layout

```
src/ai_bench/       # package: tasks, models, scoring, runner, report, CLI
data/tasks/         # bundled sample task sets (JSONL)
tests/              # pytest suite
```

## License

MIT — see [LICENSE](LICENSE).
