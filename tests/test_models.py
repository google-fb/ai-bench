import pytest

from ai_bench.models import calculator_model, constant_zero_model, get_model, list_models


def test_builtin_models_registered():
    names = list_models()
    assert {"calculator", "constant", "echo"}.issubset(set(names))


def test_get_unknown_model_raises():
    with pytest.raises(KeyError):
        get_model("does-not-exist")


@pytest.mark.parametrize(
    "prompt,expected",
    [
        ("What is 12 + 30?", "42"),
        ("What is 100 - 58?", "42"),
        ("What is 6 * 7?", "42"),
        ("What is 84 / 2?", "42"),
        ("What is 2 ^ 6?", "64"),
        ("What is (3 + 4) * 6?", "42"),
    ],
)
def test_calculator_solves_arithmetic(prompt, expected):
    assert calculator_model(prompt) == expected


def test_calculator_handles_no_expression():
    assert calculator_model("hello world") == ""


def test_calculator_is_safe_against_code_injection():
    # Must not execute arbitrary Python; only arithmetic is permitted.
    assert calculator_model("__import__('os').system('echo hi')") == ""


def test_constant_model_always_zero():
    assert constant_zero_model("anything") == "0"
