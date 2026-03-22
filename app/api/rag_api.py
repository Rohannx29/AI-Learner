from fastapi import APIRouter, Depends
from pydantic import BaseModel
from typing import List

from app.ai_engine.rag_engine import answer_from_notes
from app.auth.dependencies import get_current_user

router = APIRouter()


class Message(BaseModel):
    role: str
    content: str


class QuestionRequest(BaseModel):
    question: str
    history: List[Message] = []


@router.post("/ask-notes")
def ask_notes(
    request: QuestionRequest,
    user_id: int = Depends(get_current_user)
):

    # 🔥 Convert history to text
    history_text = "\n".join([
        f"{msg.role}: {msg.content}" for msg in request.history
    ])

    full_prompt = f"""
Conversation History:
{history_text}

Current Question:
{request.question}
"""

    answer = answer_from_notes(user_id, full_prompt)

    return {
        "answer": answer
    }