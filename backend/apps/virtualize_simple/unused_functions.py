import cv2


# How to use image preprocessing to improve the accuracy of Tesseract
# https://www.freecodecamp.org/news/getting-started-with-tesseract-part-ii-f7f9a0899b3f/
def apply_threshold(img, argument):
    switcher = {
        1: cv2.threshold(
            cv2.GaussianBlur(img, (9, 9), 0),
            0,
            255,
            cv2.THRESH_BINARY + cv2.THRESH_OTSU,
        )[1],
        2: cv2.threshold(
            cv2.GaussianBlur(img, (7, 7), 0),
            0,
            255,
            cv2.THRESH_BINARY + cv2.THRESH_OTSU,
        )[1],
        3: cv2.threshold(
            cv2.GaussianBlur(img, (5, 5), 0),
            0,
            255,
            cv2.THRESH_BINARY + cv2.THRESH_OTSU,
        )[1],
        18: cv2.adaptiveThreshold(
            cv2.medianBlur(img, 7),
            255,
            cv2.ADAPTIVE_THRESH_GAUSSIAN_C,
            cv2.THRESH_BINARY,
            31,
            2,
        ),
        19: cv2.adaptiveThreshold(
            cv2.medianBlur(img, 5),
            255,
            cv2.ADAPTIVE_THRESH_GAUSSIAN_C,
            cv2.THRESH_BINARY,
            31,
            2,
        ),
        20: cv2.adaptiveThreshold(
            cv2.medianBlur(img, 3),
            255,
            cv2.ADAPTIVE_THRESH_GAUSSIAN_C,
            cv2.THRESH_BINARY,
            31,
            2,
        ),
    }
    return switcher.get(argument, "Invalid method")


# Detect the alignment of the element
def detect_aligned_element(x1, width_elem, img_width):
    # Text-align: left, if the left interval is smaller than the right interval
    aligned_element = "left"
    if x1 + (width_elem / 2) > (img_width / 2):
        aligned_element = "right"

    # Middle if the middle point placed at the 20% middle width for the whole image
    if abs(x1 + (width_elem / 2) - (img_width / 2)) < img_width * 0.2:
        aligned_element = "center"

    return aligned_element


# Python program to check if two
# to get unique values from list
# using set
# function to get unique values
def unique(list1):
    # insert the list to the set
    list_set = set(list1)
    # convert the set to the list
    unique_list = list(list_set)
    return unique_list


#  Sorting XML in python etree
def sortchildrenby(parent, buoyancy):
    parent[:] = sorted(parent, key=lambda child: child.buoyancy)
