import importlib
from PIL import Image

_model = None


def _get_model():
    global _model

    if _model is not None:
        return _model

    try:
        pix2tex_cli = importlib.import_module("pix2tex.cli")
        _model = pix2tex_cli.LatexOCR()
    except (ImportError, ModuleNotFoundError):
        _model = False

    return _model


def extract_math_from_image(image_source) -> str:
    model = _get_model()

    if not model:
        return ""

    try:
        if isinstance(image_source, str):
            img = Image.open(image_source)
        elif isinstance(image_source, Image.Image):
            img = image_source
        else:
            return ""

        latex = model(img)
        return f"\nDetected Equation (LaTeX):\n{latex}\n"

    except Exception:
        return ""