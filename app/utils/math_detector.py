import re

MATH_KEYWORDS = [
    "solve",
    "calculate",
    "numerical",
    "derive",
    "prove",
    "find",
    "evaluate",
    "integrate",
    "differentiate"
]


def is_math_question(question: str):

    question = question.lower()

    for word in MATH_KEYWORDS:
        if word in question:
            return True

    # detect equations
    if re.search(r"[=+\-*/^]", question):
        return True

    return False