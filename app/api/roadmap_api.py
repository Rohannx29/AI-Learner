from fastapi import APIRouter
from pydantic import BaseModel
from app.ai_engine.roadmap_engine import generate_roadmap

router = APIRouter()

class RoadmapRequest(BaseModel):
    goal: str
    duration: str


@router.post("/roadmap")
def roadmap(request: RoadmapRequest):

    roadmap_text = generate_roadmap(request.goal, request.duration)

    return {
        "goal": request.goal,
        "duration": request.duration,
        "roadmap": roadmap_text
    }