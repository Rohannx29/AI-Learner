import ollama

# Store conversation history
conversation_history = []

def tutor_chat(question: str):

    # Add user question to history
    conversation_history.append({
        "role": "user",
        "content": question
    })

    # Send full conversation to model
    response = ollama.chat(
        model="llama3",
        messages=conversation_history
    )

    ai_message = response["message"]["content"]

    # Save AI reply
    conversation_history.append({
        "role": "assistant",
        "content": ai_message
    })

    return ai_message