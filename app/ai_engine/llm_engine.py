import requests
from app.config import settings


def generate_response(prompt: str) -> str:
    try:
        response = requests.post(
            f"{settings.OLLAMA_HOST}/api/generate",
            json={
                "model": "llama3",
                "prompt": prompt,
                "stream": False
            },
            timeout=60
        )
        response.raise_for_status()
        return response.json().get("response", "")
    except requests.exceptions.ConnectionError:
        return "Error: Could not connect to Ollama. Make sure it is running."
    except requests.exceptions.Timeout:
        return "Error: Request to Ollama timed out."
    except Exception as e:
        return f"Error: {str(e)}"


# Bug fixed: explain_api imported this function but it didn't exist.
# It was named generate_response — adding the alias so explain_api
# doesn't need to change its import.
def generate_explanation(topic: str) -> str:
    prompt = f"""Explain the following topic in a structured learning format.

Topic: {topic}

Provide:
1. Simple Explanation
2. Important Concepts
3. Example (if applicable)
4. Short Summary
"""
    return generate_response(prompt)