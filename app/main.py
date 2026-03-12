from fastapi import FastAPI
from app.api import explain_api, tutor_api, roadmap_api, notes_api

app = FastAPI(title="AI-Learner API")

app.include_router(explain_api.router)
app.include_router(tutor_api.router)
app.include_router(roadmap_api.router)
app.include_router(notes_api.router)


@app.get("/")
def read_root():
    return {"message": "AI Learner Backend Running"}