from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api import auth_api
from app.api import explain_api
from app.api import notes_api
from app.api import rag_api
from app.api import roadmap_api

from app.db.database import engine
from app.db.models import Base

# Create DB tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="AI Learner API")

# -----------------------------
# CORS FIX
# -----------------------------

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # allow all for now
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# -----------------------------
# Routes
# -----------------------------

app.include_router(auth_api.router)
app.include_router(explain_api.router)
app.include_router(notes_api.router)
app.include_router(rag_api.router)
app.include_router(roadmap_api.router)


@app.get("/")
def root():
    return {"message": "AI Learner Backend Running"}