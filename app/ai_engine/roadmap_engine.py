from ollama import Client
from app.config import settings


def generate_roadmap(topic: str, duration: str) -> str:
    prompt = f"""Create a structured learning roadmap.

Topic: {topic}
Duration: {duration}

Provide a clear weekly roadmap with topics and small learning objectives.
"""
    client = Client(host=settings.OLLAMA_HOST)
    response = client.chat(
        model="llama3",
        messages=[{"role": "user", "content": prompt}]
    )
    return response["message"]["content"]