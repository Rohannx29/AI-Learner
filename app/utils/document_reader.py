import pdfplumber
import pytesseract
from pdf2image import convert_from_path
from docx import Document
from pptx import Presentation
from PIL import Image

pytesseract.pytesseract.tesseract_cmd = r"C:\Program Files\Tesseract-OCR\tesseract.exe"

def read_pdf(file_path):

    text = ""

    with pdfplumber.open(file_path) as pdf:
        for page in pdf.pages:
            text += page.extract_text() or ""

    # If text is empty → likely scanned PDF
    if text.strip() == "":
        images = convert_from_path(file_path)

        for img in images:
            text += pytesseract.image_to_string(img)

    return text


def read_docx(file_path):

    doc = Document(file_path)

    text = ""

    for para in doc.paragraphs:
        text += para.text + "\n"

    return text


def read_pptx(file_path):

    prs = Presentation(file_path)

    text = ""

    for slide in prs.slides:
        for shape in slide.shapes:
            if hasattr(shape, "text"):
                text += shape.text + "\n"

    return text


def read_txt(file_path):

    with open(file_path, "r", encoding="utf-8") as f:
        return f.read()


def read_image(file_path):

    img = Image.open(file_path)

    return pytesseract.image_to_string(img)