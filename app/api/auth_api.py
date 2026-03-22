from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.orm import Session
from pydantic import BaseModel, field_validator
from slowapi import Limiter
from slowapi.util import get_remote_address

from app.db.database import get_db
from app.db.models import User
from app.auth.auth_utils import hash_password, verify_password, create_token

router = APIRouter()
limiter = Limiter(key_func=get_remote_address)

PASSWORD_MIN_LENGTH = 8


class AuthRequest(BaseModel):
    email: str
    password: str

    @field_validator("email")
    @classmethod
    def validate_email(cls, v: str) -> str:
        v = v.strip().lower()
        if not v:
            raise ValueError("Email is required")
        parts = v.split("@")
        if len(parts) != 2 or "." not in parts[1]:
            raise ValueError("Enter a valid email address")
        return v

    @field_validator("password")
    @classmethod
    def validate_password(cls, v: str) -> str:
        if not v:
            raise ValueError("Password is required")
        if len(v) < PASSWORD_MIN_LENGTH:
            raise ValueError(
                f"Password must be at least {PASSWORD_MIN_LENGTH} characters"
            )
        return v


@router.post("/signup", status_code=201)
@limiter.limit("10/minute")
def signup(request: Request, body: AuthRequest, db: Session = Depends(get_db)):
    existing = db.query(User).filter(User.email == body.email).first()

    if existing:
        raise HTTPException(status_code=409, detail="Email already registered")

    user = User(
        email=body.email,
        password=hash_password(body.password)
    )
    db.add(user)
    db.commit()

    return {"message": "Account created successfully"}


@router.post("/login")
@limiter.limit("10/minute")
def login(request: Request, body: AuthRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == body.email).first()

    if not user or not verify_password(body.password, user.password):
        raise HTTPException(status_code=401, detail="Invalid email or password")

    token = create_token({"user_id": user.id})

    return {"access_token": token, "token_type": "bearer"}