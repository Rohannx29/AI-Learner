# DELETE entire file and replace with:
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel, EmailStr, field_validator

from app.db.database import get_db
from app.db.models import User
from app.auth.auth_utils import hash_password, verify_password, create_token

router = APIRouter()

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
        # Basic structure check — @ present, domain has a dot
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
def signup(request: AuthRequest, db: Session = Depends(get_db)):
    existing = db.query(User).filter(User.email == request.email).first()

    if existing:
        raise HTTPException(status_code=409, detail="Email already registered")

    user = User(
        email=request.email,
        password=hash_password(request.password)
    )
    db.add(user)
    db.commit()

    return {"message": "Account created successfully"}


@router.post("/login")
def login(request: AuthRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == request.email).first()

    if not user or not verify_password(request.password, user.password):
        raise HTTPException(status_code=401, detail="Invalid email or password")

    token = create_token({"user_id": user.id})

    return {"access_token": token, "token_type": "bearer"}