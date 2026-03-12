import streamlit as st
import requests

st.title("Notes Analyzer")

uploaded_file = st.file_uploader(
    "Upload notes",
    type=["pdf", "docx", "pptx", "txt", "png", "jpg", "jpeg"]
)

if uploaded_file:

    with st.spinner("Processing document..."):

        response = requests.post(
            "http://127.0.0.1:8000/analyze-notes",
            files={"file": uploaded_file}
        )

        if response.status_code == 200:

            try:
                data = response.json()

                if "error" in data:
                    st.error(data["error"])
                else:
                    st.subheader("Extracted Text")
                    st.write(data["extracted_text"])

            except Exception:
                st.error("Invalid JSON returned from backend")
                st.write(response.text)

        else:
            st.error("Backend Error")
            st.write(response.text)