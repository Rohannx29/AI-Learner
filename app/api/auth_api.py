from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from jose import jwt
from passlib.context import CryptContext

router = APIRouter()

SECRET_KEY = "supersecretkey"
ALGORITHM = "HS256"

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# simple in-memory users
fake_db = {}


class AuthRequest(BaseModel):
    email: str
    password: str


def hash_password(password):
    return pwd_context.hash(password[:72])


def verify_password(password, hashed):
    return pwd_context.verify(password[:72], hashed)


@router.post("/signup")
def signup(req: AuthRequest):
    if req.email in fake_db:
        raise HTTPException(status_code=400, detail="User exists")

    fake_db[req.email] = hash_password(req.password)

    return {"message": "User created"}


@router.post("/login")
def login(req: AuthRequest):
    if req.email not in fake_db:
        raise HTTPException(status_code=400, detail="Invalid credentials")

    if not verify_password(req.password, fake_db[req.email]):
        raise HTTPException(status_code=400, detail="Invalid credentials")

    token = jwt.encode({"user_id": req.email}, SECRET_KEY, algorithm=ALGORITHM)

    return {"access_token": token}