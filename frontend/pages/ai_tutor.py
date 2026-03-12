import streamlit as st
import requests

st.title("AI Tutor")

if "messages" not in st.session_state:
    st.session_state.messages = []

user_input = st.chat_input("Ask a question")

if user_input:

    st.session_state.messages.append({"role": "user", "content": user_input})

    response = requests.post(
        "http://127.0.0.1:8000/tutor",
        json={"question": user_input}
    )

    data = response.json()

    ai_reply = data["answer"]

    st.session_state.messages.append({"role": "assistant", "content": ai_reply})


for msg in st.session_state.messages:

    if msg["role"] == "user":
        st.chat_message("user").write(msg["content"])

    else:
        st.chat_message("assistant").write(msg["content"])