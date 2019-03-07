from PIL import Image

from django.utils.six import BytesIO


def create_image(size: tuple=(100, 100), image_mode: str="RGB", image_format: str="PNG"):
    """
    Generate a test image
    """
    data = BytesIO()
    Image.new(image_mode, size).save(data, image_format)
    data.seek(0)
    return data
