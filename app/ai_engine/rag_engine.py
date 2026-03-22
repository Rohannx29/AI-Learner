from app.ai_engine.vector_db import query_chunks
from app.ai_engine.llm_engine import generate_response


def answer_from_notes(user_id: int, question: str):

    # 🔥 Get relevant chunks
    chunks = query_chunks(user_id, question)

    context = "\n".join(chunks)

    prompt = f"""
You are an AI Tutor.

Use the following notes to answer:

{context}

Question:
{question}

Instructions:
- Answer clearly
- If numerical → use structured format:
  Given:
  Formula:
  Solution:
  Answer:

- If concept → explain simply
"""

    return generate_response(prompt)