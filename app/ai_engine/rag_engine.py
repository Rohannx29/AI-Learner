import ollama
from app.ai_engine.vector_store import search


def answer_from_notes(question):

    try:

        relevant_chunks = search(question)

        context = "\n\n".join(relevant_chunks)

        prompt = f"""
Use the following notes to answer the question.

Notes:
{context}

Question:
{question}
"""

    except:
        prompt = question

    response = ollama.chat(
        model="llama3",
        messages=[{"role": "user", "content": prompt}]
    )

    return response["message"]["content"]