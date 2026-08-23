from ai_bench.scoring import score


def test_exact_match():
    assert score("42", "42") == 1.0


def test_numeric_equivalence():
    assert score("42.0", "42") == 1.0


def test_whitespace_and_case_insensitive():
    assert score("  Hello   World ", "hello world") == 1.0


def test_mismatch():
    assert score("41", "42") == 0.0
