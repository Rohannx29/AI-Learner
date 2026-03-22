from PIL import Image


# Lazy singleton — model only loads the first time OCR is actually called
_model = None


def _get_model():
    """
    Load LatexOCR on first use only.
    pix2tex requires torch — treated as optional.
    If not installed the function silently returns empty string.
    """
    global _model

    if _model is not None:
        return _model

    try:
        from pix2tex.cli import LatexOCR
        _model = LatexOCR()
    except ImportError:
        _model = False  # Mark as unavailable so we don't retry every call

    return _model


def extract_math_from_image(image_source) -> str:
    """
    Extract LaTeX from an image.
    Accepts either a file path (str) or a PIL Image object.
    Returns empty string if pix2tex is not installed or extraction fails.
    """
    model = _get_model()

    if not model:
        return ""

    try:
        # Bug fixed: callers pass both file paths and PIL Image objects
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