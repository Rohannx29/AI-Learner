from fastapi import APIRouter, Depends
from pydantic import BaseModel
from typing import List

from app.auth.dependencies import get_current_user
from app.ai_engine.rag_engine import answer_from_notes

router = APIRouter()


class Message(BaseModel):
    role: str
    content: str


class QuestionRequest(BaseModel):
    question: str
    history: List[Message] = []


@router.post("/ask-notes")
def ask_notes(req: QuestionRequest, user_id=Depends(get_current_user)):
    history_text = "\n".join(
        [f"{m.role}: {m.content}" for m in req.history]
    )

    full_query = f"{history_text}\n\n{req.question}"

    answer = answer_from_notes(user_id, full_query)

    return {"answer": answer}