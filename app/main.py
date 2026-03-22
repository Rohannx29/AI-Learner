from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api import auth_api
from app.api import explain_api
from app.api import notes_api
from app.api import rag_api
from app.api import roadmap_api
from app.api import tutor_api

from app.db.database import engine
from app.db.models import Base

Base.metadata.create_all(bind=engine)

app = FastAPI(title="AI Learner API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_api.router)
app.include_router(explain_api.router)
app.include_router(notes_api.router)
app.include_router(rag_api.router)
app.include_router(roadmap_api.router)
app.include_router(tutor_api.router)


@app.get("/")
def root():
    return {"message": "AI Learner Backend Running"}