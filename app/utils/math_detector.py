import re

MATH_KEYWORDS = [
    "solve",
    "calculate",
    "numerical",
    "derive",
    "prove",
    "evaluate",
    "integrate",
    "differentiate",
    "find",
    "distance",
    "velocity",
    "acceleration"
]


def is_math_question(question: str):

    q = question.lower()

    for word in MATH_KEYWORDS:
        if word in q:
            return True

    if re.search(r"[0-9]+\s*[+\-*/=]", q):
        return True

    if re.search(r"\d+\s*(m|kg|s|m/s|m/s²)", q):
        return True

    return False