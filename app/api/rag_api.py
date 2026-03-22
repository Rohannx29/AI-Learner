# DELETE entire file and replace with:
from fastapi import APIRouter, Depends, HTTPException
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
    try:
        history_text = "\n".join(
            f"{msg.role}: {msg.content}" for msg in request.history
        )
        full_prompt = f"Conversation History:\n{history_text}\n\nCurrent Question:\n{request.question}"

        answer = answer_from_notes(user_id, full_prompt)
        return {"answer": answer}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))