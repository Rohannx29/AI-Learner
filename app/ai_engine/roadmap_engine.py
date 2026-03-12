import ollama

def generate_roadmap(goal: str, duration: str):

    prompt = f"""
Create a structured learning roadmap.

Goal: {goal}
Duration: {duration}

Provide a clear weekly roadmap with topics and small learning objectives.
"""

    response = ollama.chat(
        model="llama3",
        messages=[{"role": "user", "content": prompt}]
    )

    return response["message"]["content"]