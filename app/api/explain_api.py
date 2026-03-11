from fastapi import APIRouter
from pydantic import BaseModel
from app.ai_engine.llm_engine import generate_explanation

router = APIRouter()

class TopicRequest(BaseModel):
    topic: str


@router.post("/explain")
def explain_topic(request: TopicRequest):

    explanation = generate_explanation(request.topic)

    return {
        "topic": request.topic,
        "explanation": explanation
    }