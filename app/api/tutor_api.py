from fastapi import APIRouter, Depends
from pydantic import BaseModel
from typing import List

from app.ai_engine.tutor_engine import tutor_chat
from app.auth.dependencies import get_current_user

router = APIRouter()


class Message(BaseModel):
    role: str
    content: str


class TutorRequest(BaseModel):
    question: str
    history: List[Message] = []


@router.post("/tutor")
def ask_tutor(
    request: TutorRequest,
    user_id: int = Depends(get_current_user)
):
    history_dicts = [{"role": m.role, "content": m.content} for m in request.history]
    answer = tutor_chat(request.question, history=history_dicts)
    return {"question": request.question, "answer": answer}