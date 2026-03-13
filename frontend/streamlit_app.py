import streamlit as st
import requests

st.set_page_config(
    page_title="AI Learner",
    page_icon="🧠",
    layout="wide"
)

BACKEND = "http://127.0.0.1:8000"

# -----------------------------
# Sidebar Navigation
# -----------------------------

st.sidebar.title("AI Learner")

menu = st.sidebar.radio(
    "Navigation",
    ["AI Tutor", "Upload Notes", "Learning Roadmap"]
)

st.sidebar.markdown("---")

if st.sidebar.button("Clear Chat"):
    st.session_state.messages = []

# Initialize chat history
if "messages" not in st.session_state:
    st.session_state.messages = []

# -----------------------------
# AI Tutor Page
# -----------------------------

if menu == "AI Tutor":

    st.title("AI Tutor")

    # Display chat messages
    for msg in st.session_state.messages:

        if msg["role"] == "user":
            with st.chat_message("user"):
                st.markdown(msg["content"])

        else:
            with st.chat_message("assistant"):
                st.markdown(msg["content"])

    # Chat input
    user_input = st.chat_input("Ask anything...")

    if user_input:

        st.session_state.messages.append({
            "role": "user",
            "content": user_input
        })

        with st.chat_message("user"):
            st.markdown(user_input)

        with st.chat_message("assistant"):

            with st.spinner("Thinking..."):

                try:

                    response = requests.post(
                        f"{BACKEND}/ask-notes",
                        json={"question": user_input}
                    )

                    data = response.json()

                    ai_reply = data.get("answer", "No response generated.")

                except Exception as e:

                    ai_reply = f"Backend error: {str(e)}"

                st.markdown(ai_reply)

        st.session_state.messages.append({
            "role": "assistant",
            "content": ai_reply
        })

# -----------------------------
# Upload Notes Page
# -----------------------------

elif menu == "Upload Notes":

    st.title("Upload Notes")

    st.write("Upload documents so the AI can answer using your notes.")

    uploaded_file = st.file_uploader(
        "Upload notes",
        type=["pdf", "docx", "pptx", "txt", "png", "jpg", "jpeg"]
    )

    if uploaded_file:

        with st.spinner("Processing notes..."):

            try:

                response = requests.post(
                    f"{BACKEND}/upload-notes",
                    files={"file": uploaded_file}
                )

                data = response.json()

                if data.get("success"):

                    st.success("Notes uploaded successfully")

                    st.write("Chunks created:", data["chunks_created"])

                    st.subheader("Preview")

                    st.write(data["preview"])

                else:

                    st.error(data.get("error"))

            except Exception as e:

                st.error(f"Upload failed: {str(e)}")

# -----------------------------
# Learning Roadmap Page
# -----------------------------

elif menu == "Learning Roadmap":

    st.title("Learning Roadmap Generator")

    goal = st.text_input("What do you want to learn?")
    duration = st.text_input("Duration (example: 30 days, 8 weeks)")

    if st.button("Generate Roadmap"):

        with st.spinner("Generating roadmap..."):

            try:

                response = requests.post(
                    f"{BACKEND}/roadmap",
                    json={
                        "goal": goal,
                        "duration": duration
                    }
                )

                data = response.json()

                st.subheader("Generated Roadmap")

                st.markdown(data["roadmap"])

            except Exception as e:

                st.error(f"Backend error: {str(e)}")