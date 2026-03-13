from pix2text import Pix2Text

p2t = Pix2Text()


def extract_math_from_image(image_path):

    result = p2t.recognize(image_path)

    math_text = ""

    for block in result:
        math_text += block["text"] + "\n"

    return math_text