from fastapi import APIRouter, UploadFile, File, Depends
import os

from app.utils.document_reader import (
    read_pdf,
    read_docx,
    read_pptx,
    read_txt,
    read_image
)

from app.ai_engine.vector_store import build_index
from app.auth.dependencies import get_current_user

router = APIRouter()

UPLOAD_DIR = "data/uploads"


@router.post("/upload-notes")
async def upload_notes(
    file: UploadFile = File(...),
    user_id: int = Depends(get_current_user)
):

    # 🔥 Create user-specific folder
    user_dir = os.path.join(UPLOAD_DIR, f"user_{user_id}")
    os.makedirs(user_dir, exist_ok=True)

    file_path = os.path.join(user_dir, file.filename)

    with open(file_path, "wb") as f:
        f.write(await file.read())

    # Extract text
    if file.filename.endswith(".pdf"):
        text = read_pdf(file_path)
    elif file.filename.endswith(".docx"):
        text = read_docx(file_path)
    elif file.filename.endswith(".pptx"):
        text = read_pptx(file_path)
    elif file.filename.endswith(".txt"):
        text = read_txt(file_path)
    else:
        text = read_image(file_path)

    chunks = [text[i:i+500] for i in range(0, len(text), 500)]

    # 🔥 Build index PER USER
    build_index(user_id, chunks)

    return {
        "message": "Notes uploaded successfully",
        "user_id": user_id,
        "chunks_created": len(chunks)
    }