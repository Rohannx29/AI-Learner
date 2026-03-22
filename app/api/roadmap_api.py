from fastapi import APIRouter, Depends
from pydantic import BaseModel

from app.ai_engine.roadmap_engine import generate_roadmap
from app.auth.dependencies import get_current_user

router = APIRouter()


class RoadmapRequest(BaseModel):
    topic: str
    duration: str = "4 weeks"


@router.post("/roadmap")
def roadmap(
    request: RoadmapRequest,
    user_id: int = Depends(get_current_user)
):
    roadmap_text = generate_roadmap(request.topic, request.duration)
    return {
        "topic": request.topic,
        "duration": request.duration,
        "roadmap": roadmap_text
    }