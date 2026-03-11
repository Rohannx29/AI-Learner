from fastapi import FastAPI
from app.api import explain_api

app = FastAPI(title="AI-Learner API")

app.include_router(explain_api.router)

@app.get("/")
def read_root():
    return {"message": "Welcome to AI-Learner API"}