from fastapi import APIRouter
from pydantic import BaseModel
from app.ai_engine.rag_engine import answer_from_notes

router = APIRouter()

class QuestionRequest(BaseModel):
    question: str


@router.post("/ask-notes")
def ask_notes(request: QuestionRequest):

    answer = answer_from_notes(request.question)

    return {"answer": answer}