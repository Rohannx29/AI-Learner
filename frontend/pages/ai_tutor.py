import streamlit as st
import requests

st.set_page_config(page_title="AI Learner Tutor", layout="wide")

st.title("AI Learner Tutor")

BACKEND_URL = "http://127.0.0.1:8000"

# -------------------------
# Upload Notes Section
# -------------------------

st.subheader("Upload Notes (optional)")

uploaded_file = st.file_uploader(
    "Upload notes to help the AI answer from your material",
    type=["pdf", "docx", "pptx", "txt", "png", "jpg", "jpeg"]
)

if uploaded_file:

    with st.spinner("Processing notes..."):

        try:

            response = requests.post(
                f"{BACKEND_URL}/upload-notes",
                files={"file": uploaded_file}
            )

            data = response.json()

            if data.get("success"):

                st.success("Notes indexed successfully")

                st.write("Chunks created:", data["chunks_created"])

                st.subheader("Preview of Extracted Text")

                st.write(data["preview"])

            else:

                st.error(data.get("error"))

        except Exception as e:

            st.error(f"Upload failed: {str(e)}")


st.divider()

# -------------------------
# Chat Interface
# -------------------------

st.subheader("AI Tutor")

if "messages" not in st.session_state:
    st.session_state.messages = []

# Display chat history
for msg in st.session_state.messages:

    if msg["role"] == "user":
        with st.chat_message("user"):
            st.markdown(msg["content"])

    else:
        with st.chat_message("assistant"):
            st.markdown(msg["content"])


user_input = st.chat_input("Ask anything...")

if user_input:

    # add user message
    st.session_state.messages.append(
        {"role": "user", "content": user_input}
    )

    with st.chat_message("user"):
        st.markdown(user_input)

    with st.chat_message("assistant"):

        with st.spinner("Thinking..."):

            try:

                response = requests.post(
                    f"{BACKEND_URL}/ask-notes",
                    json={"question": user_input}
                )

                data = response.json()

                ai_reply = data.get("answer", "No response generated.")

            except Exception as e:

                ai_reply = f"Error contacting backend: {str(e)}"

            st.markdown(ai_reply)

    # save assistant response
    st.session_state.messages.append(
        {"role": "assistant", "content": ai_reply}
    )