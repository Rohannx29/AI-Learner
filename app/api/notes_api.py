from fastapi import APIRouter, UploadFile, File
import shutil
import os

from app.utils.document_reader import (
    read_pdf,
    read_docx,
    read_pptx,
    read_txt,
    read_image
)

from app.utils.text_chunker import chunk_text
from app.ai_engine.vector_store import build_index

router = APIRouter()

UPLOAD_DIR = "data/uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)


@router.post("/upload-notes")
async def upload_notes(file: UploadFile = File(...)):

    try:

        file_path = os.path.join(UPLOAD_DIR, file.filename)

        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        # detect file type
        if file.filename.endswith(".pdf"):
            text = read_pdf(file_path)

        elif file.filename.endswith(".docx"):
            text = read_docx(file_path)

        elif file.filename.endswith(".pptx"):
            text = read_pptx(file_path)

        elif file.filename.endswith(".txt"):
            text = read_txt(file_path)

        elif file.filename.endswith((".png", ".jpg", ".jpeg")):
            text = read_image(file_path)

        else:
            return {"success": False, "error": "Unsupported file type"}

        if text.strip() == "":
            return {"success": False, "error": "No text extracted"}

        chunks = chunk_text(text)

        build_index(chunks)

        return {
            "success": True,
            "message": "Notes uploaded and indexed successfully",
            "chunks_created": len(chunks),
            "preview": text[:500]
        }

    except Exception as e:

        return {
            "success": False,
            "error": str(e)
        }