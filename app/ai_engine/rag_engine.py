import ollama

from app.ai_engine.vector_store import search
from app.utils.math_detector import is_math_question
from app.ai_engine.math_prompts import NUMERICAL_PROMPT


def answer_from_notes(question):

    try:
        relevant_chunks = search(question)

        context = "\n\n".join(relevant_chunks)

    except:
        context = ""

    # Detect math problems
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
        messages=[{"role": "user", "content": prompt}]
    )

    return response["message"]["content"]