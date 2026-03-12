import streamlit as st
import requests

st.title("Notes Analyzer")

uploaded_file = st.file_uploader(
    "Upload notes",
    type=["pdf", "docx", "pptx", "txt", "png", "jpg"]
)

if uploaded_file:

    files = {"file": uploaded_file.getvalue()}

    response = requests.post(
        "http://127.0.0.1:8000/analyze-notes",
        files={"file": uploaded_file}
    )

    data = response.json()

    st.subheader("Extracted Text")
    st.write(data["extracted_text"])