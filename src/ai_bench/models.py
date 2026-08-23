"""Model interface and a registry of offline reference models.

A "model" is any callable-like object that maps a prompt string to a predicted
answer string. The built-in models are deterministic and offline so the harness
can be exercised end to end without credentials or network access. Real,
API-backed models can be added with :func:`register_model`.
"""

from __future__ import annotations

import ast
import operator
import re
from collections.abc import Callable

# A model is just a function: prompt -> predicted answer.
Model = Callable[[str], str]

_REGISTRY: dict[str, Model] = {}


def register_model(name: str, model: Model) -> None:
    """Register a model under ``name`` (overwrites any existing entry)."""

    if not name:
        raise ValueError("model name must be non-empty")
    _REGISTRY[name] = model


def get_model(name: str) -> Model:
    try:
        return _REGISTRY[name]
    except KeyError:
        raise KeyError(
            f"unknown model {name!r}; available: {', '.join(list_models()) or '(none)'}"
        ) from None


def list_models() -> list[str]:
    return sorted(_REGISTRY)


# --- Built-in offline models -------------------------------------------------

_ALLOWED_BINOPS = {
    ast.Add: operator.add,
    ast.Sub: operator.sub,
    ast.Mult: operator.mul,
    ast.Div: operator.truediv,
    ast.FloorDiv: operator.floordiv,
    ast.Mod: operator.mod,
    ast.Pow: operator.pow,
}
_ALLOWED_UNARYOPS = {
    ast.UAdd: operator.pos,
    ast.USub: operator.neg,
}


def _safe_eval(node: ast.AST) -> float:
    """Evaluate a restricted arithmetic AST (numbers and + - * / // % ** only)."""

    if isinstance(node, ast.Expression):
        return _safe_eval(node.body)
    if isinstance(node, ast.Constant):
        if isinstance(node.value, (int, float)) and not isinstance(node.value, bool):
            return node.value
        raise ValueError("only numeric constants are allowed")
    if isinstance(node, ast.BinOp) and type(node.op) in _ALLOWED_BINOPS:
        return _ALLOWED_BINOPS[type(node.op)](_safe_eval(node.left), _safe_eval(node.right))
    if isinstance(node, ast.UnaryOp) and type(node.op) in _ALLOWED_UNARYOPS:
        return _ALLOWED_UNARYOPS[type(node.op)](_safe_eval(node.operand))
    raise ValueError("unsupported expression")


def _format_number(value: float) -> str:
    """Render a numeric result without a trailing ``.0`` for whole numbers."""

    if isinstance(value, float) and value.is_integer():
        return str(int(value))
    return str(value)


def calculator_model(prompt: str) -> str:
    """Solve arithmetic prompts by safely evaluating the expression.

    Extracts the arithmetic expression from a prompt such as
    ``"What is 12 + 30?"`` and evaluates it. Returns an empty string when no
    valid expression is found.
    """

    # Treat "^" as exponentiation, then keep only arithmetic characters so that
    # surrounding prose (e.g. "What is 12 + 30?") is discarded.
    normalized = prompt.replace("^", "**")
    expression = re.sub(r"[^0-9+\-*/%().\s]", "", normalized).strip()
    if not re.search(r"\d", expression):
        return ""
    try:
        tree = ast.parse(expression, mode="eval")
        return _format_number(_safe_eval(tree))
    except (SyntaxError, ValueError, ZeroDivisionError, TypeError):
        return ""


def constant_zero_model(prompt: str) -> str:
    """A trivial baseline that always predicts ``"0"``."""

    return "0"


def echo_model(prompt: str) -> str:
    """A trivial baseline that echoes the prompt back verbatim."""

    return prompt


def register_builtin_models() -> None:
    register_model("calculator", calculator_model)
    register_model("constant", constant_zero_model)
    register_model("echo", echo_model)


register_builtin_models()
