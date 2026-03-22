from fastapi import APIRouter, UploadFile, File, Depends, HTTPException
from app.auth.dependencies import get_current_user
from app.ai_engine.vector_db import store_chunks
from app.utils.text_chunker import chunk_text

import io
from PyPDF2 import PdfReader
import docx
from PIL import Image
import pytesseract

router = APIRouter()


def extract_pdf_text(file_bytes: bytes) -> str:
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


def extract_docx_text(file_bytes: bytes) -> str:
    try:
        doc = docx.Document(io.BytesIO(file_bytes))
        return "\n".join([para.text for para in doc.paragraphs])
    except Exception:
        return ""


def extract_text_with_ocr(file_bytes: bytes) -> str:
    try:
        image = Image.open(io.BytesIO(file_bytes))
        return pytesseract.image_to_string(image).strip()
    except Exception:
        return ""


@router.post("/upload-notes", status_code=200)
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
            raise HTTPException(
                status_code=422,
                detail="Could not extract text from file"
            )

        chunks = chunk_text(text)
        store_chunks(user_id, chunks, filename=file.filename)

        return {
            "message": "Notes processed and indexed successfully",
            "chunks_created": len(chunks)
        }

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))