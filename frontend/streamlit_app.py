import streamlit as st
import requests

st.title("AI-Learner")

topic = st.text_input("Enter topic")

if st.button("Generate Explanation"):

    if topic.strip() == "":
        st.warning("Please enter a topic.")
    else:
        response = requests.post(
            "http://127.0.0.1:8000/explain",
            json={"topic": topic}
        )

        if response.status_code == 200:

            data = response.json()

            st.subheader("Explanation")
            st.write(data["explanation"])

        else:
            st.error("Backend Error")
            st.write(response.text)