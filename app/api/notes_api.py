from fastapi import APIRouter, UploadFile, File, Depends
from app.auth.dependencies import get_current_user
from app.ai_engine.vector_db import store_chunks

import io
from PyPDF2 import PdfReader
import docx
from PIL import Image
import pytesseract

router = APIRouter()


def split_text(text, chunk_size=500):
    return [text[i:i + chunk_size] for i in range(0, len(text), chunk_size)]


def extract_pdf_text(file_bytes):
    try:
        pdf = PdfReader(io.BytesIO(file_bytes))
        text = ""
        for page in pdf.pages:
            extracted = page.extract_text()
            if extracted:
                text += extracted + "\n"
        return text.strip()
    except Exception:
        return ""


def extract_docx_text(file_bytes):
    try:
        doc = docx.Document(io.BytesIO(file_bytes))
        return "\n".join([para.text for para in doc.paragraphs])
    except Exception:
        return ""


def extract_text_with_ocr(file_bytes):
    try:
        image = Image.open(io.BytesIO(file_bytes))
        text = pytesseract.image_to_string(image)
        return text.strip()
    except Exception:
        return ""


@router.post("/upload-notes")
async def upload_notes(
    file: UploadFile = File(...),
    user_id: int = Depends(get_current_user)
):
    try:
        file_bytes = await file.read()
        filename = file.filename.lower()
        text = ""

        if filename.endswith(".pdf"):
            text = extract_pdf_text(file_bytes)
            if not text:
                text = extract_text_with_ocr(file_bytes)
        elif filename.endswith(".txt"):
            text = file_bytes.decode("utf-8", errors="ignore")
        elif filename.endswith(".docx"):
            text = extract_docx_text(file_bytes)
        else:
            text = file_bytes.decode("utf-8", errors="ignore")

        if not text.strip():
            return {"error": "Could not extract text from file"}

        chunks = split_text(text)

        # filename passed so each upload gets unique chunk IDs
        store_chunks(user_id, chunks, filename=file.filename)

        return {
            "message": "Notes processed and indexed successfully",
            "chunks_created": len(chunks)
        }

    except Exception as e:
        return {"error": str(e)}