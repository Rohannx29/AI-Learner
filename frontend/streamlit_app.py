import streamlit as st
import requests

# ---------------------------------
# Page Configuration
# ---------------------------------

st.set_page_config(
    page_title="AI Learner",
    page_icon="🧠",
    layout="wide"
)

BACKEND = "http://127.0.0.1:8000"

# ---------------------------------
# Load Custom CSS
# ---------------------------------

def load_css():
    with open("frontend/styles/custom.css") as f:
        st.markdown(
            f"<style>{f.read()}</style>",
            unsafe_allow_html=True
        )

load_css()

# ---------------------------------
# Sidebar
# ---------------------------------

st.sidebar.title("🧠 AI Learner")

menu = st.sidebar.radio(
    "Navigation",
    [
        "AI Tutor",
        "Upload Notes",
        "Learning Roadmap"
    ]
)

st.sidebar.markdown("---")

if st.sidebar.button("Clear Chat"):
    st.session_state.messages = []

# ---------------------------------
# Chat History Initialization
# ---------------------------------

if "messages" not in st.session_state:
    st.session_state.messages = []

# ---------------------------------
# AI Tutor Page
# ---------------------------------

if menu == "AI Tutor":

    st.title("AI Tutor")
    st.caption("AI-powered learning assistant with OCR, RAG, and mathematical reasoning.")

    # Display previous chat messages
    for msg in st.session_state.messages:

        if msg["role"] == "user":
            with st.chat_message("user", avatar="🧑"):
                st.markdown(msg["content"])

        else:
            with st.chat_message("assistant", avatar="🤖"):
                st.markdown(msg["content"])

    # Chat input
    user_input = st.chat_input("Ask anything...")

    if user_input:

        st.session_state.messages.append({
            "role": "user",
            "content": user_input
        })

        with st.chat_message("user", avatar="🧑"):
            st.markdown(user_input)

        with st.chat_message("assistant", avatar="🤖"):

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


# ---------------------------------
# Upload Notes Page
# ---------------------------------

elif menu == "Upload Notes":

    st.title("Upload Notes")
    st.caption("Upload documents so the AI can answer using your notes.")

    st.info("Supported formats: PDF, DOCX, PPTX, TXT, PNG, JPG")

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

                    st.subheader("Preview of Extracted Text")

                    st.write(data["preview"])

                else:

                    st.error(data.get("error"))

            except Exception as e:

                st.error(f"Upload failed: {str(e)}")


# ---------------------------------
# Learning Roadmap Page
# ---------------------------------

elif menu == "Learning Roadmap":

    st.title("Learning Roadmap Generator")
    st.caption("Generate a structured learning roadmap using AI.")

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