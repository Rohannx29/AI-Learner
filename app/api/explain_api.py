from fastapi import APIRouter

router = APIRouter()

@router.post("/explain")
def explain_topic(topic: str):
    
    explanation = f"This is a basic explanation placeholder for {topic}. AI generation will be added later."
    
    return {
        "topic": topic,
        "explanation": explanation
    }