from fastapi import APIRouter, Depends
from pydantic import BaseModel

from app.ai_engine.rag_engine import answer_from_notes
from app.auth.dependencies import get_current_user

router = APIRouter()


class QuestionRequest(BaseModel):
    question: str


@router.post("/ask-notes")
def ask_notes(request: QuestionRequest, user_id: int = Depends(get_current_user)):

    answer = answer_from_notes(request.question)

    return {
        "user_id": user_id,
        "answer": answer
    }