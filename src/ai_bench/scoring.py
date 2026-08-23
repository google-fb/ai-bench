"""Scoring utilities for comparing predictions against reference answers."""

from __future__ import annotations

import re


def _normalize(text: str) -> str:
    """Lowercase, trim, and collapse internal whitespace for robust matching."""

    return re.sub(r"\s+", " ", text.strip().lower())


def score(prediction: str, answer: str) -> float:
    """Return ``1.0`` for an exact (normalized) match, else ``0.0``.

    Numeric answers are compared by value so that ``"42"`` and ``"42.0"`` match.
    """

    pred_norm = _normalize(prediction)
    ans_norm = _normalize(answer)
    if pred_norm == ans_norm:
        return 1.0

    try:
        if float(pred_norm) == float(ans_norm):
            return 1.0
    except ValueError:
        pass
    return 0.0
