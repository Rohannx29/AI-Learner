from fastapi import APIRouter, Depends
from pydantic import BaseModel

from app.ai_engine.llm_engine import generate_explanation
from app.auth.dependencies import get_current_user

router = APIRouter()


class TopicRequest(BaseModel):
    topic: str


@router.post("/explain")
def explain_topic(
    request: TopicRequest,
    user_id: int = Depends(get_current_user)
):
    explanation = generate_explanation(request.topic)
    return {"topic": request.topic, "explanation": explanation}