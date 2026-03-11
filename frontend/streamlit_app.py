import streamlit as st
import requests

st.title("AI-Learner")

topic = st.text_input("Enter topic")

if st.button("Generate Explanation"):

    response = requests.post(
        "http://127.0.0.1:8000/explain",
        params={"topic": topic}
    )

    data = response.json()

    st.subheader("Explanation")
    st.write(data["explanation"])