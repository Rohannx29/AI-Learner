import streamlit as st

st.title("AI-Learner")

topic = st.text_input("Enter topic")

if st.button("Generate Explanation"):
    st.write("AI explanation will appear here.")