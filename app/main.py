from fastapi import FastAPI

app = FastAPI(title="AI-Learner API")

@app.get("/")
def read_root():
    return {"message": "Welcome to AI-Learner API"}