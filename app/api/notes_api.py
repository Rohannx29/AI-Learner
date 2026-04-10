from fastapi import APIRouter, UploadFile, File, Depends, HTTPException
from app.auth.dependencies import get_current_user
from app.ai_engine.vector_db import store_chunks
from app.utils.text_chunker import chunk_text
from app.config import settings

import io
from PyPDF2 import PdfReader
from pdf2image import convert_from_bytes
import docx
from PIL import Image
import pytesseract

if settings.TESSERACT_PATH:
    pytesseract.pytesseract.tesseract_cmd = settings.TESSERACT_PATH

router = APIRouter()


def extract_pdf_text(file_bytes: bytes) -> str:
    """Extract text from a text-based PDF."""
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


def extract_pdf_ocr(file_bytes: bytes) -> str:
    """
    OCR fallback for image-based / scanned PDFs.
    Converts each page to an image first, then runs Tesseract.
    PIL cannot open PDFs directly — this was the root cause of the bug.
    """
    try:
        kwargs = {}
        if settings.POPPLER_PATH:
            kwargs["poppler_path"] = settings.POPPLER_PATH

        images = convert_from_bytes(file_bytes, **kwargs)
        text = ""
        for img in images:
            page_text = pytesseract.image_to_string(img)
            if page_text:
                text += page_text + "\n"
        return text.strip()
    except Exception as e:
        return ""


def extract_docx_text(file_bytes: bytes) -> str:
    try:
        doc = docx.Document(io.BytesIO(file_bytes))
        return "\n".join([para.text for para in doc.paragraphs])
    except Exception:
        return ""


def extract_image_ocr(file_bytes: bytes) -> str:
    """OCR for actual image files (jpg, png, etc.)"""
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
            # Step 1: try fast text extraction
            text = extract_pdf_text(file_bytes)

            # Step 2: scanned PDF — convert pages to images then OCR
            if not text:
                text = extract_pdf_ocr(file_bytes)

        elif filename.endswith(".txt"):
            text = file_bytes.decode("utf-8", errors="ignore")

        elif filename.endswith(".docx"):
            text = extract_docx_text(file_bytes)

        elif filename.endswith((".jpg", ".jpeg", ".png", ".webp")):
            text = extract_image_ocr(file_bytes)

        else:
            text = file_bytes.decode("utf-8", errors="ignore")

        if not text.strip():
            raise HTTPException(
                status_code=422,
                detail="Could not extract text from file. "
                       "For scanned PDFs ensure Tesseract and Poppler are installed."
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