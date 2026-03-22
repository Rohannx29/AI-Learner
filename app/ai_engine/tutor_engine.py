from ollama import Client
from typing import List, Dict
from app.config import settings


def tutor_chat(question: str, history: List[Dict] = []) -> str:
    client = Client(host=settings.OLLAMA_HOST)
    messages = list(history)
    messages.append({"role": "user", "content": question})
    response = client.chat(model="llama3", messages=messages)
    return response["message"]["content"]