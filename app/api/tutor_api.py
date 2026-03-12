from fastapi import APIRouter
from pydantic import BaseModel
from app.ai_engine.tutor_engine import tutor_chat

router = APIRouter()

class QuestionRequest(BaseModel):
    question: str


@router.post("/tutor")
def ask_tutor(request: QuestionRequest):

    answer = tutor_chat(request.question)

    return {
        "question": request.question,
        "answer": answer
    }