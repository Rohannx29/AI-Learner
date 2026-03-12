from fastapi import FastAPI
from app.api import explain_api
from app.api import tutor_api
from app.api import roadmap_api
from app.api import notes_api

app = FastAPI(title="AI-Learner API")

app.include_router(explain_api.router)
app.include_router(tutor_api.router)
app.include_router(roadmap_api.router)
app.include_router(notes_api.router)

@app.get("/")
def read_root():
    return {"message": "Welcome to AI-Learner API"}