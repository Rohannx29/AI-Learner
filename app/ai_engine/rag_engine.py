from rank_bm25 import BM25Okapi

from app.ai_engine.vector_db import query_chunks
from app.ai_engine.llm_engine import generate_response
from app.ai_engine.math_engine import try_sympy_solver
from app.ai_engine.math_prompts import NUMERICAL_PROMPT
from app.utils.math_detector import is_math_question


def _bm25_rerank(query: str, chunks: list[str], top_k: int = 3) -> list[str]:
    """
    Re-rank ChromaDB semantic results using BM25 keyword scoring.
    Activates the hybrid search logic from the dead vector_store.py.
    ChromaDB handles persistence + semantic recall.
    BM25 handles keyword precision on top of those results.
    """
    if not chunks:
        return []

    tokenized = [doc.split() for doc in chunks]
    bm25 = BM25Okapi(tokenized)
    scores = bm25.get_scores(query.split())

    ranked = sorted(zip(scores, chunks), key=lambda x: x[0], reverse=True)
    return [chunk for _, chunk in ranked[:top_k]]


def answer_from_notes(user_id: int, question: str) -> str:

    # Step 1 — Math question: try exact symbolic solve first
    if is_math_question(question):
        sympy_result = try_sympy_solver(question)
        if sympy_result:
            return sympy_result

    # Step 2 — Retrieve relevant chunks from ChromaDB
    raw_chunks = query_chunks(user_id, question, n_results=10)

    # Step 3 — Re-rank with BM25 for hybrid precision
    chunks = _bm25_rerank(question, raw_chunks, top_k=3)

    context = "\n\n".join(chunks) if chunks else "No relevant notes found."

    # Step 4 — Build prompt: structured math format or standard explanation
    if is_math_question(question):
        prompt = NUMERICAL_PROMPT.format(question=f"""
Use the following notes as reference:

{context}

Question:
{question}
""")
    else:
        prompt = f"""You are an AI Tutor.

Use the following notes to answer the question.

Notes:
{context}

Question:
{question}

Instructions:
- Answer clearly and concisely
- If the answer is not in the notes, say so honestly
- Do not make up information
"""

    return generate_response(prompt)