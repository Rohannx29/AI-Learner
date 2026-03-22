# DELETE entire file content and replace with:
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel, EmailStr

from app.db.database import get_db
from app.db.models import User
from app.auth.auth_utils import hash_password, verify_password, create_token

router = APIRouter()


class AuthRequest(BaseModel):
    email: str
    password: str


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