import ollama

from app.ai_engine.vector_store import hybrid_search
from app.utils.math_detector import is_math_question
from app.ai_engine.math_prompts import NUMERICAL_PROMPT
from app.ai_engine.math_engine import try_sympy_solver


def answer_from_notes(question):

    # -----------------------------------
    # First try SymPy solver
    # -----------------------------------

    if is_math_question(question):

        sympy_result = try_sympy_solver(question)

        if sympy_result:
            return sympy_result

    # -----------------------------------
    # Hybrid RAG retrieval
    # -----------------------------------

    try:

        relevant_chunks = hybrid_search(question)

        context = "\n\n".join(relevant_chunks)

    except:

        context = ""

    # -----------------------------------
    # LLM Prompt
    # -----------------------------------

    if is_math_question(question):

        prompt = NUMERICAL_PROMPT.format(question=question)

        if context:
            prompt += f"\n\nRelevant Notes:\n{context}"

    else:

        prompt = f"""
Use the following notes if relevant.

Notes:
{context}

Question:
{question}
"""

    response = ollama.chat(
        model="llama3",
        messages=[
            {"role": "user", "content": prompt}
        ]
    )

    return response["message"]["content"]