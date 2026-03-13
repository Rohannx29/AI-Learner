from pix2tex.cli import LatexOCR
from PIL import Image


model = LatexOCR()


def extract_math_from_image(image_path):

    try:

        img = Image.open(image_path)

        latex = model(img)

        return f"\nDetected Equation (LaTeX):\n{latex}\n"

    except Exception:

        return ""