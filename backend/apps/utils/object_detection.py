import os
import cv2
import pytesseract
from pytesseract import Output
import random
import numpy as np
import json


def get_rand_images(image_dir, image_count):
    """Get list of random images from image directory."""
    images = {}
    while len(images) < image_count:
        filename = random.choice(os.listdir(image_dir))
        if filename not in list(images.keys()):
            images[filename] = cv2.imread(os.path.join(image_dir, filename))
    return images


def get_blocks(img, method="adaptive"):
    """Find regions that might have text in them."""
    try:
        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    except Exception as ex:
        print(ex)
        return
    # Apply specific filter
    if method == "adaptive":
        th = cv2.adaptiveThreshold(
            gray, 255, cv2.ADAPTIVE_THRESH_MEAN_C, cv2.THRESH_BINARY_INV, 3, 2
        )
    elif method == "otsu":
        _, th = cv2.threshold(gray, 0, 255, cv2.THRESH_OTSU | cv2.THRESH_BINARY_INV)
    elif method == "gray":
        th = gray
    elif method == "res_less":
        th = cv2.resize(gray, None, fx=0.95, fy=0.95, interpolation=cv2.INTER_CUBIC)
    elif method == "res_more":
        th = cv2.resize(gray, None, fx=1.05, fy=1.05, interpolation=cv2.INTER_CUBIC)
    # Specify structure shape and kernel size
    rect_kernel = cv2.getStructuringElement(cv2.MORPH_RECT, (10, 7))
    # Appply dilation on the threshold image
    dilation = cv2.dilate(th, rect_kernel, iterations=2)
    _, contours, _ = cv2.findContours(
        dilation, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_NONE
    )
    return contours


def get_text_from_cropped(img, contours, text=False):
    """Cut image into regions and detect text separately."""
    # Create a copy of image
    im2 = img.copy()
    all_contours = []
    all_words = []
    for cnt in contours:
        x, y, w, h = cv2.boundingRect(cnt)
        # Crop the text block for giving input to OCR
        cropped = im2[y: y + h, x: x + w]
        text_contours = get_text_contours(cropped, text=text)
        text_contours.reverse()
        # If no text is recognised, crop the region a bit and try detection again
        if len(text_contours) < 1:
            h, w, _ = cropped.shape
            h -= 10
            w -= 10
            if h < 1 or w < 1:
                continue
            new_cropped = cropped[5: 5 + h, 5: 5 + w]
            text_contours = get_text_contours(
                new_cropped, size=(3, 3), iterations=5, text=text
            )
            # If cropping didn't help, come to terms and omit this region
            if len(text_contours) < 1:
                pass
                # print('text not recognised')
            else:
                if text:
                    for t in text_contours:
                        all_words.append(t)
                else:
                    for c in text_contours:
                        x1, y1, w1, h1 = cv2.boundingRect(c)
                        x1 = x1 + x + 5
                        y1 = y1 + y + 5
                        rect = (x1, y1, w1, h1)
                        all_contours.append(rect)

        else:
            if text:
                for t in text_contours:
                    all_words.append(t)
            else:
                for c in text_contours:
                    x1, y1, w1, h1 = cv2.boundingRect(c)
                    x1 = x1 + x
                    y1 = y1 + y
                    rect = (x1, y1, w1, h1)
                    all_contours.append(rect)
    if text:
        return all_words
    else:
        return all_contours


def get_text_contours(img, size=(3, 3), iterations=5, text=False):
    """Find text in the image."""
    hsv = cv2.cvtColor(img, cv2.COLOR_BGR2HSV)
    upper = np.array([230, 230, 230])
    mask = cv2.inRange(hsv, upper, upper)
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    thresh = cv2.adaptiveThreshold(
        gray, 255, cv2.ADAPTIVE_THRESH_MEAN_C, cv2.THRESH_BINARY_INV, 3, 2
    )
    d = pytesseract.image_to_data(thresh, lang="eng", output_type=Output.DICT)
    n_boxes = len(d["level"])
    words = []
    for i in range(n_boxes):
        box_text = d["text"][i].strip(" —|*vy")
        if len(box_text) < 1:
            continue
        if text:
            words.append(box_text)
        else:
            (x, y, w, h) = (d["left"][i], d["top"][i], d["width"][i], d["height"][i])
            if w == h:
                continue
            cv2.rectangle(mask, (x, y), (x + w, y + h), (255, 255, 255), 1)
    if text:
        # print(*words, sep='\t')
        return words
    # print('test mask with text blocks')
    # show(mask)
    rect_kernel = cv2.getStructuringElement(cv2.MORPH_RECT, size)
    dilation = cv2.dilate(mask, rect_kernel, iterations=iterations)

    _, contours, _ = cv2.findContours(
        dilation, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_NONE
    )
    text_contours = []
    for cnt in contours:
        x, y, w, h = cv2.boundingRect(cnt)
        text_contours.append(cnt)
    return text_contours


def show_image(image, name, sec=None, destroy=False):
    """Display image."""
    cv2.imshow(name, image)
    if not sec:
        cv2.waitKey()
    else:
        if sec > 0:
            cv2.waitKey(int(sec * 1000))
    if destroy:
        cv2.destroyWindow(name)
    pass


def get_unused(groups):
    """Get blocks that are not stored in any group."""
    unused = []
    for group in groups.values():
        if len(group) < 2:
            unused.append(group[0])
    return unused


def group_blocks(rects, rows=True):
    """Group regions into groups of columns or rows."""
    groups = {}
    checked = []
    for rect in rects:
        x, y, w, h = rect
        if len(groups) == 0:
            if rows:
                groups[y] = []
                groups[y].append(rect)
            else:
                groups[x] = []
                groups[x].append(rect)
            checked.append(rect)
            continue
        if rect not in checked:
            for group in groups.keys():
                if rows:
                    dif = abs(group - y)
                else:
                    dif = abs(group - x)
                if dif < 4:
                    groups[group].append(rect)
                    checked.append(rect)
                    break
            if rect not in checked:
                if rows:
                    groups[y] = []
                    groups[y].append(rect)
                else:
                    groups[x] = []
                    groups[x].append(rect)
                checked.append(rect)
    unused = get_unused(groups)
    # groups = {key: value for key, value in groups.items() if len(value) > 1}
    return groups, unused


def show_region_center(img, rects, color=(0, 0, 255), radius=2):
    """Add region centers to image."""
    for rect in rects:
        x, y, w, h = rect
        cv2.circle(img, (x + w // 2, y + h // 2), radius, color, -1)
    return img


def show_region_left(img, rects, color=(0, 0, 255), radius=2):
    """Add region left points to image."""
    for rect in rects:
        x, y, w, h = rect
        cv2.circle(img, (x, y + h // 2), radius, color, -1)
    return img


def show_region_right(img, rects, color=(0, 0, 255), radius=2):
    """Add region right points to image."""
    for rect in rects:
        x, y, w, h = rect
        cv2.circle(img, (x + w, y + h // 2), radius, color, -1)
    return img


def show_rects(img, rects, color=(0, 255, 0), thickness=1, text=False):
    """Add rectangles to image."""
    for index, rect in enumerate(rects):
        x, y, w, h = rect
        cv2.rectangle(img, (x, y), (x + w, y + h), color, thickness)
        if text:
            # r = random.randint(0, 200)
            # g = random.randint(0, 200)
            # b = random.randint(0, 200)
            # color = (r, g, b)
            cv2.putText(
                img,
                text,
                (x + 3, y + 10),
                cv2.FONT_HERSHEY_SIMPLEX,
                0.4,
                (255, 255, 255),
                1,
            )
    return img


def run_text_detection(img, text=False, method="adaptive"):
    """Initial method for text recognition."""
    contours = get_blocks(img, method=method)
    if not contours:
        print("troubles working with image")
    else:
        all_contours = get_text_from_cropped(img, contours, text=text)
        return all_contours


def get_contours(annotation, img_dir, text=False):
    """Starting method for specific annotation."""
    filename = annotation["filename"].strip(".\\")
    print("filename:\t{}".format(filename))
    PATH = os.path.join(os.getcwd(), img_dir)
    img = cv2.imread(os.path.join(PATH, filename))
    contours = run_text_detection(img, text=text)
    # result = show_rects(img, contours, color=(0,0,255))
    if contours:
        print("regions: {}".format(len(contours)))
    else:
        return
    # show(result)
    return contours


def apply_contours(v, contours):
    """Add new contours to annotations."""
    for c in contours:
        x, y, w, h = c
        # print('{}\t{}\t{}\t{}'.format(x, y, w, h))
        attributes_dict = {
            "shape_attributes": {
                "name": "rect",
                "x": x,
                "y": y,
                "width": w,
                "height": h,
            },
            "region_attributes": {"HTML element": "text"},
        }
        v["regions"].append(attributes_dict)
    return v


def add_border(im, size=10, draw_line=False, margin=1, color=None):
    """Add border around the image."""
    if im is None:
        print("got nothing")
        return im
    row, col = im.shape[:2]
    if color is None:
        b, g, r = im[row - margin][col - margin]
        color = []
        color.append(int(b))
        color.append(int(g))
        color.append(int(r))
    bordersize = size
    border = cv2.copyMakeBorder(
        im,
        top=bordersize,
        bottom=bordersize,
        left=bordersize,
        right=bordersize,
        borderType=cv2.BORDER_CONSTANT,
        value=color,
    )
    if draw_line:
        cv2.rectangle(
            border,
            (bordersize, bordersize),
            (col + bordersize, row + bordersize),
            (0, 0, 0),
            thickness=1,
        )
    return border


def get_rect_contours(src):
    """Detect rectangular regions."""
    wide_image = add_border(src)
    if wide_image is not None:
        gray = cv2.cvtColor(wide_image.copy(), cv2.COLOR_BGR2GRAY)
    else:
        gray = cv2.cvtColor(src.copy(), cv2.COLOR_BGR2GRAY)
    th = cv2.adaptiveThreshold(
        gray, 255, cv2.ADAPTIVE_THRESH_MEAN_C, cv2.THRESH_BINARY_INV, 3, 2
    )
    rects = []
    _, contours, _ = cv2.findContours(th, cv2.RETR_TREE, cv2.CHAIN_APPROX_SIMPLE)
    for cnt in contours:
        # Check if the contour is a rectangle
        approx = cv2.approxPolyDP(cnt, 0.02 * cv2.arcLength(cnt, True), True)
        if len(approx) == 4:
            x, y, w, h = cv2.boundingRect(cnt)
            x -= 10
            y -= 10
            if x < 0:
                w += x
                x = 0
            if y < 0:
                h += y
                y = 0
            if w > 10 and h > 10 and (x, y, w, h) not in rects:
                rects.append((x, y, w, h))
    return rects


def get_circles(filepath, filename=None, count=None):
    """Detect circular regions.
    The method is raw for now.

    """
    print(filepath)
    images = {}
    if filename:
        images[filename] = cv2.imread(os.path.join(filepath, filename))
    else:
        images = get_rand_images(filepath, count)
    for name, image in images.items():
        src = add_border(image)
        try:
            gray = cv2.cvtColor(src.copy(), cv2.COLOR_BGR2GRAY)
        except Exception as ex:
            print("{}\t{}".format(name, ex))
            continue
        output = src.copy()
        th = cv2.adaptiveThreshold(
            gray, 255, cv2.ADAPTIVE_THRESH_MEAN_C, cv2.THRESH_BINARY_INV, 3, 2
        )
        # # Detect circles in the image
        # circles = cv2.HoughCircles(gray, cv2.HOUGH_GRADIENT, 0.2, 1)
        # Apply Hough transform on the blurred image.
        circles = cv2.HoughCircles(
            th,
            cv2.HOUGH_GRADIENT,
            1,
            20,
            param1=50,
            param2=30,
            minRadius=1,
            maxRadius=20,
        )
        if circles is not None:
            # convert the (x, y) coordinates and radius of the circles to integers
            circles = np.round(circles[0, :]).astype("int")
            # loop over the (x, y) coordinates and radius of the circles
            for (x, y, r) in circles:
                # draw the circle in the output image, then draw a rectangle
                # corresponding to the center of the circle
                cv2.circle(output, (x, y), r, (0, 0, 255), 2)
                # cv2.rectangle(output, (x - r, y - r), (x + r, y + r), (76, 0, 153), 2)
            # show the output image
            cv2.imshow(
                filename, np.hstack([src, cv2.cvtColor(th, cv2.COLOR_GRAY2RGB), output])
            )
            cv2.imwrite(
                os.path.join(filepath, "detected", "1905_{}".format(name)), output
            )
            cv2.waitKey(1000)
        else:
            print("nothing found\t{}".format(name))


def point_inside_rect(point, rect):
    """Check if a point is inside a rectangle."""
    point_x, point_y = point
    x, y, w, h = rect
    if point_x >= x and point_x <= x + w and point_y >= y and point_y <= y + h:
        return True
    return False


def intersect(rect1, rect2):
    """Check if 2 rectangles intersect."""
    x1, y1, w1, h1 = rect1
    points = [(x1, y1), (x1, y1 + h1), (x1 + w1, y1), (x1 + w1, y1 + h1)]
    for point in points:
        if point_inside_rect(point, rect2):
            return True
    return False


def merge_blocks(rects):
    """Merge regions that intersect."""
    new_rects = []
    checked = []
    for rect in rects:
        if rect in checked:
            continue
        others = [r for r in rects if r != rect]
        for other in others:
            if intersect(rect, other):
                print("rects intersect\t{}\t{}".format(rect, other))
                x1, y1, w1, h1 = rect
                x2, y2, w2, h2 = other
                new_x = min(x1, x2)
                new_y = min(y1, y2)
                new_w = max(x1 + w1, x2 + w2) - new_x
                new_h = max(y1 + h1, y2 + h2) - new_y
                new_rect = (new_x, new_y, new_w, new_h)
                new_rects.append(new_rect)
                if other not in checked:
                    checked.append(other)
                if rect not in checked:
                    checked.append(rect)
    for rect in rects:
        if rect not in checked:
            new_rects.append(rect)
    return new_rects


def get_group_boundary(rects):
    """Get coordinates for regions boundary."""
    if not rects or len(rects) == 0:
        return None
    left, top, width, height = rects[0]
    right = left + width
    bottom = top + height
    for rect in rects[1:]:
        x, y, w, h = rect
        if x < left:
            left = x
        if x + w > right:
            right = x + w
        if y < top:
            top = y
        if y + h > bottom:
            bottom = y + h
    return int(left), int(top), int(right - left), int(bottom - top)


def get_vert_lines(columns):
    """Find coordinates of the lines between columns."""
    lines = []
    _, columns = sort_contours(columns, rects=True)
    x, y, w, h = columns[0]
    top = y
    bottom = top + h
    for col in columns:
        x, y, w, h = col
        if y < top:
            top = y
        if y + h > bottom:
            bottom = y + h
    x, y, w, h = columns[0]
    left_x = x - 10
    if left_x < 0:
        left_x = 0
    left_line = (left_x, top, 1, bottom - top)
    lines.append(left_line)
    for index in range(len(columns)):
        x, y, w, h = columns[index]
        if index < len(columns) - 1:
            next_x, next_y, next_w, next_h = columns[index + 1]
            line_x = next_x - 5
            new_line = (line_x, top, 1, bottom - top)
            lines.append(new_line)
        else:
            new_line = (x + w - 1, top, 1, bottom - top)
            lines.append(new_line)
    return left_x, lines


def get_hor_lines(rows, left_x):
    """Find coordinates of the lines between rows."""
    lines = []
    _, rows = sort_contours(rows, method="top-to-bottom", rects=True)
    x, y, w, h = rows[0]
    left = left_x
    right = x + w
    for row in rows:
        x, y, w, h = row
        if x < left:
            left = x
        if x + w > right:
            right = x + w
    x, y, w, h = rows[0]
    top_line = (left, y, right - left, 1)
    lines.append(top_line)
    for index in range(len(rows)):
        x, y, w, h = rows[index]
        if index < len(rows) - 1:
            next_x, next_y, next_w, next_h = rows[index + 1]
            line_y = next_y - 5
            new_line = (left, line_y, right - left, 1)
            lines.append(new_line)
        else:
            new_line = (left, y + h - 1, right - left, 1)
            lines.append(new_line)
    return lines


def get_invisible_grid(image):
    """Get table grid using text detestion algorithm."""
    img = image.copy()
    text_rects = run_text_detection(img)
    # merge text regions that intersect
    text_rects = merge_blocks(text_rects)
    # visual data for detected text regions
    text_result = show_rects(img.copy(), text_rects)
    text_result = show_region_left(text_result, text_rects, radius=4)
    text_result = show_region_center(text_result, text_rects, color=(0, 0, 0), radius=4)
    text_result = show_region_right(
        text_result, text_rects, color=(255, 0, 0), radius=4
    )
    # group text block into rows and columns aligned left
    rows, unused_rows = group_blocks(text_rects, rows=True)
    columns, unused_cols = group_blocks(text_rects, rows=False)
    # remove single item rows and columns
    # that contain regions being unused in both rows and columns
    to_remove = []
    for row in unused_rows:
        if row in unused_cols and row not in to_remove:
            print("rect is unused in both lists\t{}".format(row))
            to_remove.append(row)
    for rect in to_remove:
        rows = {key: value for key, value in rows.items() if rect not in value}
        columns = {key: value for key, value in columns.items() if rect not in value}
    if len(rows) == 0 or len(columns) == 0:
        print("could not find rows or cols, returning from method")
        return None, None
    # get row and column boudaries
    col_rects = []
    row_rects = []
    for row in rows.values():
        group_boundary = get_group_boundary(row)
        row_rects.append(group_boundary)
    for col in columns.values():
        group_boundary = get_group_boundary(col)
        col_rects.append(group_boundary)

    # detect column alignment and merge columns if needed
    checked = []
    merged = []
    column_data = {}
    for col in col_rects:
        if col in checked:
            continue
        this_x, this_y, this_w, this_h = col
        other_rects = [rect for rect in col_rects if rect != col]
        for rect in other_rects:
            x, y, w, h = rect
            # check for center alignment
            if rect not in checked:
                if abs((this_x + this_w // 2) - (x + w // 2)) < 4:
                    # print('ready to merge groups, align center')
                    checked.append(rect)
                    checked.append(col)
                    new_x = min([this_x, x])
                    new_y = min([this_y, y])
                    new_w = max([this_w + this_x, w + x]) - new_x
                    new_h = max([this_h + this_y, h + y]) - new_y
                    merged_group = (new_x, new_y, new_w, new_h)
                    if merged_group in merged:
                        continue
                    merged.append(merged_group)
                    if merged_group not in list(column_data.keys()):
                        column_data[merged_group] = "center"
                # check for right alignment
                elif abs((this_x + this_w) - (x + w)) < 5:
                    # print('ready to merge groups, align right')
                    new_x = min([this_x, x])
                    new_y = min([this_y, y])
                    new_w = max([this_w + this_x, w + x]) - new_x
                    new_h = max([this_h + this_y, h + y]) - new_y
                    merged_group = (new_x, new_y, new_w, new_h)
                    if merged_group in merged:
                        continue
                    merged.append(merged_group)
                    checked.append(rect)
                    checked.append(col)
                    if merged_group not in list(column_data.keys()):
                        column_data[merged_group] = "right"
    # all the rest columns should stay left aligned
    for col in col_rects:
        if col not in checked and col not in list(column_data.keys()):
            column_data[col] = "left"
    # sort columns left-to-right
    _, col_keys = sort_contours(list(column_data.keys()), rects=True)
    column_data = {key: column_data[key] for key in col_keys}

    # show columns and their alignment
    img_w_cols = image.copy()
    r = 0
    g = 0
    b = 0
    for rect, align in column_data.items():
        img_w_cols = show_rects(img_w_cols, [rect], (b, g, r), thickness=-1, text=align)
    # show_image(img_w_cols, 'columns', sec=10)

    # get and show boundaries between columns and rows
    left_x, vert_lines = get_vert_lines(list(column_data.keys()))
    hor_lines = get_hor_lines(row_rects, left_x)
    white_image = np.zeros([image.shape[0], image.shape[1], 3], dtype=np.uint8)
    white_image.fill(255)
    total_grid = show_rects(white_image, vert_lines, color=(0, 0, 0), thickness=1)
    total_grid = show_rects(total_grid, hor_lines, color=(0, 0, 0), thickness=1)

    # show and return results
    text_result = show_rects(text_result, row_rects, color=(255, 0, 0))
    text_result = show_rects(text_result, list(column_data.keys()), color=(0, 0, 255))
    # show_image(total_grid, 'total', destroy=True)
    # text_result = show_rects(text_result, hor_lines + vert_lines, thickness=2)
    # show_image(text_result, 'text regions', sec=20, destroy=True)
    # show_image(total_grid, 'total grid', sec=5, destroy=True)
    # total_grid = cv2.UMat(total_grid)
    total_grid = cv2.cvtColor(total_grid, cv2.COLOR_BGR2GRAY)
    col_alignment = list(column_data.values())
    # print(col_alignment)
    return total_grid, col_alignment


def get_visible_grid(image):
    wide = image.copy()
    # wide = add_border(image, size=5, draw_line=True)
    img = wide.copy()
    print(img.shape)
    img = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    thresh_gauss = cv2.adaptiveThreshold(
        img, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, cv2.THRESH_BINARY, 11, 5
    )
    thresh_gauss = 255 - thresh_gauss
    # Detect vertical and horisontal lines
    # kernel_len = 10
    ver_kernel_len = np.array(img).shape[0] // 20
    hor_kernel_len = np.array(img).shape[1] // 20
    # Defining a vertical kernel to detect all vertical lines of image
    ver_kernel = cv2.getStructuringElement(cv2.MORPH_RECT, (1, ver_kernel_len))
    # Defining a horizontal kernel to detect all horizontal lines of image
    hor_kernel = cv2.getStructuringElement(cv2.MORPH_RECT, (hor_kernel_len, 1))
    # A kernel of 2x2
    kernel = cv2.getStructuringElement(cv2.MORPH_RECT, (2, 2))
    one_kernel = cv2.getStructuringElement(cv2.MORPH_RECT, (1, 1))

    # Use vertical kernel to detect and save the vertical lines in a jpg
    image_1 = cv2.erode(thresh_gauss, ver_kernel, iterations=5)
    vertical_lines = cv2.dilate(image_1, ver_kernel, iterations=5)
    # Use horizontal kernel to detect and save the horizontal lines in a jpg
    image_2 = cv2.erode(thresh_gauss, hor_kernel, iterations=5)
    horizontal_lines = cv2.dilate(image_2, hor_kernel, iterations=5)
    # show_image(np.hstack([image_1, image_2]), 'vertical lines - horisontal lines', sec=3)

    # Combine horizontal and vertical lines in a new third image, with both having same weight.
    img_vh = cv2.addWeighted(vertical_lines, 0.5, horizontal_lines, 0.5, 0.0)
    # Eroding and thesholding the image
    thresh, img_vh = cv2.threshold(
        img_vh, 128, 255, cv2.THRESH_BINARY | cv2.THRESH_OTSU
    )
    img_vh = cv2.dilate(img_vh, one_kernel, iterations=10)
    img_vh = cv2.erode(~img_vh, kernel, iterations=1)
    return img_vh


def sort_contours(cnts, method="left-to-right", rects=False):
    # initialize the reverse flag and sort index
    reverse = False
    i = 0
    # handle if we need to sort in reverse
    if method == "right-to-left" or method == "bottom-to-top":
        reverse = True
    # handle if we are sorting against the y-coordinate rather than
    # the x-coordinate of the bounding box
    if method == "top-to-bottom" or method == "bottom-to-top":
        i = 1
    # construct the list of bounding boxes and sort them from top to
    # bottom
    if not rects:
        boundingBoxes = [cv2.boundingRect(c) for c in cnts]
    else:
        boundingBoxes = cnts
    (cnts, boundingBoxes) = zip(
        *sorted(zip(cnts, boundingBoxes), key=lambda b: b[1][i], reverse=reverse)
    )
    # return the list of sorted contours and bounding boxes
    return (cnts, boundingBoxes)


def main(image_count, watch=False, save=False, filename=None, text=False):
    """Main function to object recognition.
    watch=True if you want to see detected object contours on top of images.
    save=True if you want to save recognised object coordinates.
    text=True if you want to get detected text instead of contours.

    """
    ROOT_DIR = os.path.abspath("../../")
    IMAGE_DIR = os.path.join(ROOT_DIR, "datasets/login_forms_19k-43k")
    RESULT_DIR = os.path.join(IMAGE_DIR, "detected")
    if not os.path.exists(RESULT_DIR):
        os.mkdir(RESULT_DIR)

    image_dict = {}
    result_regions = {}

    # Get list of random images in IMAGE_DIR
    if not filename:
        image_dict = get_rand_images(IMAGE_DIR, image_count)
    else:
        image_dict[filename] = cv2.imread(os.path.join(IMAGE_DIR, filename))
    for name, img in image_dict.items():
        text_contours = []
        rect_contours = []
        print(name)
        # Detect text regions
        text_contours = run_text_detection(img, text=text)
        # Detect rect regions
        rect_contours = get_rect_contours(img)
        # Save all detected regions into dictionary
        result = {"text": text_contours, "rect": rect_contours}
        result_regions[name] = result

    # Show or/and save results
    for name, contours in result_regions.items():
        print("WORDS\t{}".format(name))
        print(*contours["text"], sep="\n")
        if watch:
            result_image = show_rects(
                image_dict[name], contours["text"], color=(0, 0, 255)
            )
            result_image = show_rects(result_image, contours["rect"], color=(255, 0, 0))
            cv2.imshow(name, result_image)
            cv2.waitKey(0)
            cv2.destroyWindow(name)
    # Save results as json
    if save:
        save_dir = os.path.join(RESULT_DIR, "detected_regions.json")
        with open(save_dir, "w") as json_file:
            json.dump(result_regions, json_file)
        print(save_dir)
