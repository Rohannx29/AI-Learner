# DELETE entire file and replace with:
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
from slowapi.middleware import SlowAPIMiddleware

from app.api import auth_api
from app.api import explain_api
from app.api import notes_api
from app.api import rag_api
from app.api import roadmap_api
from app.api import tutor_api

from app.db.database import engine
from app.db.models import Base
from app.config import settings

Base.metadata.create_all(bind=engine)

# Rate limiter — keyed by IP address
limiter = Limiter(key_func=get_remote_address, default_limits=["60/minute"])

app = FastAPI(title="AI Learner API")

# Attach limiter to app state so routers can access it
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)
app.add_middleware(SlowAPIMiddleware)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
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