import sympy as sp
import re


def try_sympy_solver(question: str):

    try:

        # remove text noise
        expr = question.lower()

        expr = expr.replace("solve", "")
        expr = expr.replace("calculate", "")
        expr = expr.replace("evaluate", "")
        expr = expr.replace("what is", "")
        expr = expr.replace("=", "-(") + ")"

        # extract equation
        match = re.findall(r"[0-9x+\-*/^(). ]+", expr)

        if not match:
            return None

        equation = match[0]

        x = sp.symbols("x")

        eq = sp.sympify(equation)

        solution = sp.solve(eq, x)

        if solution:

            return f"""
Given:
Equation → {equation}

To Find:
Value of x

Solution:
Solve the equation using symbolic algebra.

Answer:
x = {solution}
"""

        return None

    except Exception:

        return None