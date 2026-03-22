from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel

from app.db.database import get_db
from app.db.models import User
from app.auth.auth_utils import hash_password, verify_password, create_token

router = APIRouter()


class AuthRequest(BaseModel):
    email: str
    password: str


@router.post("/signup")
def signup(request: AuthRequest, db: Session = Depends(get_db)):

    try:

        existing = db.query(User).filter(User.email == request.email).first()

        if existing:
            raise HTTPException(
                status_code=400,
                detail="User already exists"
            )

        hashed_password = hash_password(request.password)

        user = User(
            email=request.email,
            password=hashed_password
        )

        db.add(user)
        db.commit()

        return {"message": "User created successfully"}

    except Exception as e:

        return {
            "error": str(e)
        }


@router.post("/login")
def login(request: AuthRequest, db: Session = Depends(get_db)):

    user = db.query(User).filter(User.email == request.email).first()

    if not user:
        raise HTTPException(
            status_code=400,
            detail="Invalid credentials"
        )

    if not verify_password(request.password, user.password):
        raise HTTPException(
            status_code=400,
            detail="Invalid credentials"
        )

    token = create_token(
        {"user_id": user.id}
    )

    return {
        "access_token": token,
        "token_type": "bearer"
    }