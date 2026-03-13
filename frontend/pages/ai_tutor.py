import streamlit as st
import requests

st.title("AI Learner Tutor")

# --------------------
# Upload Notes Section
# --------------------

st.subheader("Upload Notes (optional)")

uploaded_file = st.file_uploader(
    "Upload notes",
    type=["pdf", "docx", "pptx", "txt", "png", "jpg", "jpeg"]
)

if uploaded_file:

    with st.spinner("Processing notes..."):

        response = requests.post(
            "http://127.0.0.1:8000/upload-notes",
            files={"file": uploaded_file}
        )

        data = response.json()

        if data.get("success"):

            st.success("Notes uploaded successfully")
            st.write("Chunks created:", data["chunks_created"])
            st.write(data["preview"])

        else:

            st.error(data.get("error"))


# --------------------
# AI Tutor Chat
# --------------------

st.subheader("AI Tutor")

if "messages" not in st.session_state:
    st.session_state.messages = []

user_input = st.chat_input("Ask anything...")

if user_input:

    st.session_state.messages.append({"role": "user", "content": user_input})

    response = requests.post(
        "http://127.0.0.1:8000/ask-notes",
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