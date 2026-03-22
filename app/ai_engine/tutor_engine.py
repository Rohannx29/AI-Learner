import ollama
from typing import List, Dict


def tutor_chat(question: str, history: List[Dict] = []) -> str:
    """
    history is passed in per-request from the API layer.
    No global state — each call is fully isolated.
    """
    messages = list(history)  # copy, never mutate caller's list
    messages.append({"role": "user", "content": question})

    response = ollama.chat(model="llama3", messages=messages)
    return response["message"]["content"]