import ollama

def generate_explanation(topic: str):

    prompt = f"""
Explain the topic clearly for students.

Topic: {topic}

Provide:
1. Simple explanation
2. Key concepts
3. Short summary
"""

    response = ollama.chat(
        model="llama3",
        messages=[
            {"role": "user", "content": prompt}
        ]
    )

    return response["message"]["content"]
