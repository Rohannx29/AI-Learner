import cv2
import pytesseract
import numpy as np
from PIL import Image
import pdfplumber
from pdf2image import convert_from_path
from docx import Document
from pptx import Presentation
from app.utils.math_ocr import extract_math_from_image

pytesseract.pytesseract.tesseract_cmd = r"C:\Program Files\Tesseract-OCR\tesseract.exe"
POPPLER_PATH = r"C:\poppler\Library\bin"


# ---------------------------
# Image preprocessing
# ---------------------------

def preprocess_image(image):

    img = np.array(image)

    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

    # noise reduction
    blur = cv2.GaussianBlur(gray, (5,5), 0)

    # adaptive threshold
    thresh = cv2.adaptiveThreshold(
        blur,
        255,
        cv2.ADAPTIVE_THRESH_GAUSSIAN_C,
        cv2.THRESH_BINARY,
        11,
        2
    )

    return thresh


# ---------------------------
# OCR Image Reader
# ---------------------------

def read_image(file_path):

    # normal OCR
    image_text = pytesseract.image_to_string(file_path)

    # math OCR
    math_text = extract_math_from_image(file_path)

    combined = image_text + "\n\nDetected Equations:\n" + math_text

    return combined


# ---------------------------
# PDF Reader
# ---------------------------

def read_pdf(file_path):

    text = ""

    with pdfplumber.open(file_path) as pdf:

        for page in pdf.pages:

            extracted = page.extract_text()

            if extracted:
                text += extracted + "\n"

    # If PDF has no text → OCR
    if text.strip() == "":

        images = convert_from_path(
            file_path,
            poppler_path=POPPLER_PATH
        )

        for img in images:

            processed = preprocess_image(img)

            ocr_text = pytesseract.image_to_string(processed)
            math_text = extract_math_from_image(img)

            text += ocr_text
            text += "\nDetected Equations:\n"
            text += math_text

    return text


# ---------------------------
# DOCX Reader
# ---------------------------

def read_docx(file_path):

    doc = Document(file_path)

    text = ""

    for para in doc.paragraphs:
        text += para.text + "\n"

    return text


# ---------------------------
# PPTX Reader
# ---------------------------

def read_pptx(file_path):

    prs = Presentation(file_path)

    text = ""

    for slide in prs.slides:

        for shape in slide.shapes:

            if hasattr(shape, "text"):
                text += shape.text + "\n"

    return text


# ---------------------------
# TXT Reader
# ---------------------------

def read_txt(file_path):

    with open(file_path, "r", encoding="utf-8") as f:
        return f.read()