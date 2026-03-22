from app.ai_engine.vector_db import query_chunks
from app.ai_engine.llm_engine import generate_response


def answer_from_notes(user_id, question):
    chunks = query_chunks(user_id, question)

    context = "\n\n".join(chunks[:3])  # limit context

    prompt = f"""
Use the notes to answer:

{context}

Question:
{question}

If numerical:
Given:
Formula:
Solution:
Answer:
"""

    return generate_response(prompt)