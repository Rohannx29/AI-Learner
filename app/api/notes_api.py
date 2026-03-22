from fastapi import APIRouter, UploadFile, File, Depends
from app.auth.dependencies import get_current_user

from app.ai_engine.vector_db import store_chunks

import io

# Optional imports for file handling
from PyPDF2 import PdfReader
import docx

# OCR (optional but recommended)
from PIL import Image
import pytesseract


router = APIRouter()


# 🔹 Split text into chunks
def split_text(text, chunk_size=500):
    return [
        text[i:i + chunk_size]
        for i in range(0, len(text), chunk_size)
    ]


# 🔹 Extract text from PDF
def extract_pdf_text(file_bytes):
    try:
        pdf = PdfReader(io.BytesIO(file_bytes))
        text = ""

        for page in pdf.pages:
            extracted = page.extract_text()
            if extracted:
                text += extracted + "\n"

        return text.strip()

    except Exception as e:
        return ""


# 🔹 Extract text from DOCX
def extract_docx_text(file_bytes):
    try:
        doc = docx.Document(io.BytesIO(file_bytes))
        return "\n".join([para.text for para in doc.paragraphs])
    except:
        return ""


# 🔹 OCR fallback (for images / scanned PDFs)
def extract_text_with_ocr(file_bytes):
    try:
        image = Image.open(io.BytesIO(file_bytes))
        text = pytesseract.image_to_string(image)
        return text.strip()
    except:
        return ""


# 🔥 MAIN API
@router.post("/upload-notes")
async def upload_notes(
    file: UploadFile = File(...),
    user_id: int = Depends(get_current_user)
):

    try:

        file_bytes = await file.read()
        filename = file.filename.lower()

        text = ""

        # 🔹 Detect file type
        if filename.endswith(".pdf"):
            text = extract_pdf_text(file_bytes)

            # OCR fallback if empty
            if not text:
                text = extract_text_with_ocr(file_bytes)

        elif filename.endswith(".txt"):
            text = file_bytes.decode("utf-8", errors="ignore")

        elif filename.endswith(".docx"):
            text = extract_docx_text(file_bytes)

        else:
            # fallback try decode
            text = file_bytes.decode("utf-8", errors="ignore")

        # 🔴 If still no text
        if not text.strip():
            return {
                "error": "Could not extract text from file"
            }

        # 🔹 Chunking
        chunks = split_text(text)

        # 🔥 Store in ChromaDB
        store_chunks(user_id, chunks)

        return {
            "message": "Notes processed and indexed successfully",
            "chunks_created": len(chunks),
            "preview": text[:500]   # for debugging
        }

    except Exception as e:

        return {
            "error": str(e)
        }