from fastapi import APIRouter, UploadFile, File, Depends

from app.utils.document_reader import (
    read_pdf,
    read_docx,
    read_pptx,
    read_txt,
    read_image
)

from app.ai_engine.vector_store import build_index
from app.auth.dependencies import get_current_user

import os

router = APIRouter()

UPLOAD_DIR = "data/uploads"

os.makedirs(UPLOAD_DIR, exist_ok=True)


@router.post("/upload-notes")
async def upload_notes(
    file: UploadFile = File(...),
    user_id: int = Depends(get_current_user)
):

    file_path = os.path.join(UPLOAD_DIR, file.filename)

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

    build_index(chunks)

    return {
        "message": "Notes uploaded successfully",
        "user_id": user_id,
        "chunks_created": len(chunks)
    }