import streamlit as st
import requests

st.title("Learning Roadmap Generator")

goal = st.text_input("What do you want to learn?")
duration = st.text_input("Duration (example: 30 days or 8 weeks)")

if st.button("Generate Roadmap"):

    response = requests.post(
        "http://127.0.0.1:8000/roadmap",
        json={
            "goal": goal,
            "duration": duration
        }
    )

    data = response.json()

    st.subheader("Generated Roadmap")
    st.write(data["roadmap"])