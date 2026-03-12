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

router = APIRouter()

UPLOAD_DIR = "data/uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)


@router.post("/analyze-notes")
async def analyze_notes(file: UploadFile = File(...)):

    try:
        file_path = os.path.join(UPLOAD_DIR, file.filename)

        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

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
            return {"error": "Unsupported file type"}

        return {"extracted_text": text[:3000]}

    except Exception as e:
        return {"error": str(e)}