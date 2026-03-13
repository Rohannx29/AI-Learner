from pix2text import Pix2Text

p2t = Pix2Text()


def extract_math_from_image(image_path):

    try:

        result = p2t.recognize(image_path)

        text_blocks = []

        for block in result:

            # handle dictionary format
            if isinstance(block, dict) and "text" in block:
                text_blocks.append(block["text"])

            # handle plain string format
            elif isinstance(block, str):
                text_blocks.append(block)

        return "\n".join(text_blocks)

    except Exception:

        return ""