import os
from urllib.parse import urlparse, parse_qs
from anytree import RenderTree
from apps.compat.recursive import RecursiveField
from project.settings import BASE_DIR, MEDIA_ROOT
from rest_framework import serializers
from apps.projects.models import ScenarioElement, ProjectScreen

from apps.utils.fset1 import ClusterClass
from apps.virtualize_simple.merge import pipeline_merge
from apps.virtualize_simple.assemble import pipeline_assemble

os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = os.path.abspath(
    BASE_DIR + "/gkeys/creativesmarthub-e941d155283d.json"
)

config_tesseract = "-l eng --oem 1 --psm 3"

# The constant to remove rectangle when overlaps more than 90% with larger rectangle
SQUARES_OVERLAP_THRESHOLD = 0.9

# The constant to calculate horizontal overlap during the vertical groups detection
# An empirical value derived from observations
VERICAL_GROUPS_HORIZONTAL_OVERLAP_THRESHOLD = 0.75

# The constant to calculate vertical overlap during the horizontal groups detection
# An empirical value derived from observations
HORIZONTAL_GROUPS_VERTICAL_OVERLAP_THRESHOLD = 0.25

VIA_ANNOTATION_ASSEMBLING_FILE = "elements_websites_assembling.txt"


# Create elements for the root block function serializer
def elements_rootblock_create(
    root_block, outer_div_node, o, serializing="virtualize_simple", palette=False, children=[]
):
    # Function elements creation, loop through the root_block
    if (serializing == "assemble"):
        # Display the region assembled. Hide this for the production.
        if (o.netloc != "adevi.io"):
            for pre, fill, node in RenderTree(root_block):
                if node == root_block:
                    # Create a new Scenario Element for the elements chain
                    node.scenarioelement = ScenarioElement.objects.create(
                        parent=outer_div_node, **node.scenarioelement_kwargs
                    )
                else:
                    node.scenarioelement = ScenarioElement.objects.create(
                        parent=node.parent.scenarioelement, **node.scenarioelement_kwargs
                    )

        if palette:
            # First, display all the non-text regions
            for pre, fill, node in RenderTree(root_block):
                if node.element_assigned in {"input", "select", "button", "image"}:
                    # Create a new Scenario Element for the elements chain
                    node.scenarioelement = ScenarioElement.objects.create(
                        parent=outer_div_node, **node.scenarioelement_kwargs
                    )
            # Second, display all the text regions
            for pre, fill, node in RenderTree(root_block):
                if node.element_assigned in {
                    "label",
                    "text",
                    "ocrtext",
                    "textarea",
                    "form_heading",
                    "li",
                    "listItem",
                }:
                    # Create a new Scenario Element for the elements chain
                    node.scenarioelement = ScenarioElement.objects.create(
                        parent=outer_div_node, **node.scenarioelement_kwargs
                    )
                    node.scenarioelement.buoyancy = 10000

    if (serializing == "freecanvas"):
        for pre, fill, node in RenderTree(root_block):
            if node == root_block:
                # Create a new Scenario Element for the elements chain
                node.scenarioelement = ScenarioElement.objects.create(
                    parent=outer_div_node, **node.scenarioelement_kwargs
                )
            else:
                node.scenarioelement = ScenarioElement.objects.create(
                    parent=node.parent.scenarioelement, **node.scenarioelement_kwargs
                )

        # Maybe write a new function for the freecanvas only
        """
        if (serializing == "freecanvas"):
            # Attach elements for some fcluster
            if node.types == "fcluster":
                # Arrange the fcluster children based on their coordinates
                if node.direction == 0:
                    array_elements = sorted(
                        node.elements, key=lambda i: i["shape_attributes"]["y"]
                    )
                elif node.direction == 1:
                    array_elements = sorted(
                        node.elements, key=lambda i: i["shape_attributes"]["x"]
                    )
                else:
                    array_elements = node.elements
                for elem in array_elements:
                    # Define the element dimensions start
                    elem_width = int(elem["shape_attributes"]["width"])
                    elem_height = int(elem["shape_attributes"]["height"])

                    x1 = int(elem["shape_attributes"]["x"])
                    y1 = int(elem["shape_attributes"]["y"])
                    # Define the element dimensions end

                    # Attach element to cluster
                    for child in children:
                        if (child.parameters):
                            if int(child.parameters["freeCanvas"]["width"]) == elem_width:
                                if int(child.parameters["freeCanvas"]["height"]) == elem_height:
                                    if int(child.parameters["freeCanvas"]["left"]) == x1:
                                        if int(child.parameters["freeCanvas"]["top"]) == y1:
                                            # print(child, child.struct_type, child.parent, child.parent_id)
                                            # input()
                                            child.move_to(node.scenarioelement)
        """

    return True


def calculate_excluded_indices(fdict, fnamesize):
    # Calculation of the excluded indices to remove overlapped elements
    # Second, calculate the non-text blocks overlap
    excluded_elements = []
    for rect1 in fdict[fnamesize]["regions"]:
        for rect2 in fdict[fnamesize]["regions"]:
            is_nonexcluded = (
                rect1["region_attributes"]["HTML element"] in {"menu", "container"}
            ) or (rect2["region_attributes"]["HTML element"] in {"menu", "container"})
            if (rect1 != rect2) and not is_nonexcluded:
                x1 = rect1["shape_attributes"]["x"]
                y1 = rect1["shape_attributes"]["y"]
                x2 = rect1["shape_attributes"]["x"] + rect1["shape_attributes"]["width"]
                y2 = (
                    rect1["shape_attributes"]["y"] + rect1["shape_attributes"]["height"]
                )
                x3 = rect2["shape_attributes"]["x"]
                y3 = rect2["shape_attributes"]["y"]
                x4 = rect2["shape_attributes"]["x"] + rect2["shape_attributes"]["width"]
                y4 = (
                    rect2["shape_attributes"]["y"] + rect2["shape_attributes"]["height"]
                )

                # Borders of the rectangles overlapped area
                # Define the overlapping area between the rectangles
                left = max(x1, x3)
                bottom = max(y1, y3)
                right = min(x2, x4)
                top = min(y2, y4)
                # Sizes of the rectangles overlapped area
                width = right - left
                height = top - bottom

                # The first rectangle square
                width1, height1 = x2 - x1, y2 - y1

                # The second rectangle square
                width2, height2 = x4 - x3, y4 - y3

                # Check if width, height of the overlapped area less or equal 0
                # I compare the two rectangles to detect if they overlap.
                if not (width <= 0 or height <= 0):
                    # If the square > 0, calculate the squares of the 3 rectangles
                    square = width * height
                    square1 = width1 * height1
                    square2 = width2 * height2
                    #
                    # print(square, square1, square2)
                    # input()

                    if (square > square1 * SQUARES_OVERLAP_THRESHOLD) or (
                        square > square2 * SQUARES_OVERLAP_THRESHOLD
                    ):
                        if square1 < square2:
                            excluded_elements.append(rect1)
                        else:
                            excluded_elements.append(rect2)
                    elif square > square1 * SQUARES_OVERLAP_THRESHOLD:
                        excluded_elements.append(rect2)
                    elif square > square2 * SQUARES_OVERLAP_THRESHOLD:
                        excluded_elements.append(rect1)

    # Remove some items using list comprehension
    fdict[fnamesize]["regions"] = [
        ele
        # for ele in fdict[filenamesize]["regions"]
        for ele in fdict[fnamesize]["regions"]
        if ele not in excluded_elements
    ]
    return True


def calculate_ocvclusters(fdict, fnamesize):
    # Calculation of the excluded indices to remove overlapped elements pro function for a some ocvclusters level start
    # Second, calculate the non-text blocks overlap
    excluded_elements = []
    for rect1 in fdict[fnamesize]["regions"]:
        for rect2 in fdict[fnamesize]["regions"]:
            if rect1 != rect2:
                x1 = rect1["shape_attributes"]["x"]
                y1 = rect1["shape_attributes"]["y"]
                x2 = rect1["shape_attributes"]["x"] + rect1["shape_attributes"]["width"]
                y2 = (
                    rect1["shape_attributes"]["y"] + rect1["shape_attributes"]["height"]
                )
                x3 = rect2["shape_attributes"]["x"]
                y3 = rect2["shape_attributes"]["y"]
                x4 = rect2["shape_attributes"]["x"] + rect2["shape_attributes"]["width"]
                y4 = (
                    rect2["shape_attributes"]["y"] + rect2["shape_attributes"]["height"]
                )

                # Borders of the rectangles overlapped area
                # Define the overlapping area between the rectangles
                left = max(x1, x3)
                bottom = max(y1, y3)
                right = min(x2, x4)
                top = min(y2, y4)
                # Sizes of the rectangles overlapped area
                width = right - left
                height = top - bottom

                # The first rectangle square
                width1, height1 = x2 - x1, y2 - y1

                # The second rectangle square
                width2, height2 = x4 - x3, y4 - y3

                # Check if width, height of the overlapped area less or equal 0
                # I compare the two rectangles to detect if they overlap.
                if not (width <= 0 or height <= 0):
                    # If the square > 0, calculate the squares of the 3 rectangles
                    square = width * height
                    square1 = width1 * height1
                    square2 = width2 * height2

                    min_square = min(square1, square2)
                    min_square_dim = min(height, width)

                    # change two borders for the min_square (rect1) to separate the item
                    # Should correct this later, to find proper borders
                    if square > min_square * 0.75:
                        if square1 < square2:
                            x1 = x1 + width
                            y1 = y1 + height
                        else:
                            x3 = x3 + width
                            y3 = y3 + height

                    # change one border for the min_square to separate the item
                    # Should correct this later. To do this, find, which borders are under intersection
                    elif square < min_square * 0.25:
                        if square1 < square2:
                            if height < width:
                                x1 = x1 + min_square_dim
                            else:
                                y1 = y1 + min_square_dim
                        else:
                            if height < width:
                                x3 = x3 + min_square_dim
                            else:
                                y3 = y3 + min_square_dim

                    # Remove overlapped items
                    elif square * 0.25 < min_square < square * 0.75:

                        if square1 < square2:
                            excluded_elements.append(rect1)
                        else:
                            excluded_elements.append(rect2)

                    else:
                        pass

    # Remove some items using list comprehension
    fdict[fnamesize]["regions"] = [
        ele
        # for ele in fdict[filenamesize]["regions"]
        for ele in fdict[fnamesize]["regions"]
        if ele not in excluded_elements
    ]

    # Create a set of independent ocvclusters
    for rect in fdict[fnamesize]["regions"]:
        x1 = rect["shape_attributes"]["x"]
        y1 = rect["shape_attributes"]["y"]
        x2 = rect["shape_attributes"]["x"] + rect["shape_attributes"]["width"]
        y2 = rect["shape_attributes"]["y"] + rect["shape_attributes"]["height"]
        ocvcluster = ClusterClass(x1, y1, x2, y2)
        # Set some flags for this novel ocvcluster
        ocvcluster.types = "ocvcluster"
        # Check a cluster definition

    return True


class ProjectScreenSerializer(serializers.ModelSerializer):
    screen_data_json = serializers.JSONField()

    class Meta:
        model = ProjectScreen
        ref_name = "RecognizeProject"

        fields = (
            "status",
            "project",
            "name",
            "buoyancy",
            "id",
            "image",
            "screen_data_text",
            "screen_data_json",
            "screenscenario",
        )
        extra_kwargs = {"screenscenario": {"read_only": True}}

    def create(self, validated_data):
        # Extract an appropriate block_type flag value to recognize block as header, footer, form or webpage
        region_dataset = "webpages"  # Region dataset has a default value
        if validated_data.get("screen_data_json"):
            region_dataset = validated_data["screen_data_json"]["block_type"]

        # Display the region_dataset value
        # print(region_dataset) #####console
        #
        # fname = ""
        # imgpath = ""

        print(validated_data, MEDIA_ROOT)
        # Create the opencv recognition start
        if validated_data.get("image"):
            image_recognize = validated_data.pop("image")
            node = ProjectScreen.objects.create(image=image_recognize, **validated_data)
            fname = str(image_recognize)
            imgpath = MEDIA_ROOT + "/uploads/" + fname
        else:
            node = ProjectScreen.objects.create(**validated_data)
        # node.save()
        # Calculate a chain of functions for merging
        # if imgpath:
        sdj = pipeline_merge(imgpath, region_dataset, fname)

        node.screen_data_json = sdj

        return node


'''
class ScenarioElementSerializer(serializers.ModelSerializer):
    parameters = serializers.JSONField()
    styles = serializers.JSONField()
    children = RecursiveField(required=False, allow_null=True, many=True)
    container = serializers.PrimaryKeyRelatedField(source="node.id", read_only=True)
    parent_id = serializers.IntegerField()

    class Meta:
        model = ScenarioElement
        fields = (
            "id",
            "container",
            "name",
            "children",
            "parent_id",
            "struct_type",
            "func_type",
            "direction",
            "buoyancy",
            "image",
            "parameters",
            "styles",
        )

        extra_kwargs = {
            "struct_type": {"read_only": True},
            "func_type": {"read_only": True},
        }

    def create(self, validated_data):
        root_element_data = {
            "struct_type": "container",
            "func_type": "undefined",
            "parameters": {},
            "styles": {},
        }

        # Pre-Root element assignment
        element_root_pre = ScenarioElement.objects.get(id=validated_data["parent_id"])

        # Extract an appropriate flag value to recognize block as header, footer, form or layout
        # Region dataset has some starting value
        region_dataset = "webpages"
        styles_on = 0

        try:
            if validated_data.get("parameters"):
                region_dataset = validated_data["parameters"]["block_type"]
                styles_on = int(validated_data["parameters"]["styles_on"])
        except Exception:
            pass
        # print(region_dataset)

        fdict = (
            {}
        )  # Output dictionary to write annotation, maskrcnn-opencv with AND predicate
        fordict = (
            {}
        )  # Output dictionary to write annotation, maskrcnn-opencv with OR predicate
        cnndict = (
            {}
        )  # Output dictionary to write annotation, maskrcnn only. Maybe better start extending with that.

        # Create the root element mptt start
        # print(validated_data)
        # input()
        # print(root_element_data)
        fname = ""
        imgpath = ""
        if validated_data.get("image"):
            serializer_node = ScenarioElement.objects.create(
                parent=element_root_pre,
                image=validated_data["image"],
                **root_element_data
            )
            fname = str(validated_data["image"])
            imgpath = MEDIA_ROOT + "/uploads/" + fname
        else:
            serializer_node = ScenarioElement.objects.create(
                parent=element_root_pre, **root_element_data
            )
        # Create the root element mptt end

        # Create the opencv recognition start
        image_dict = {}
        result_regions = {}

        text = False
        watch = True

        print(imgpath)
        print(cv2.imread(imgpath))

        # Read an image with OpenCV start
        image_opencv_input = cv2.imread(imgpath)
        image_original = copy.deepcopy(image_opencv_input)
        image_maskrcnn_notext = copy.deepcopy(image_opencv_input)
        image_maskrcnn = copy.deepcopy(image_opencv_input)
        image_maskrcnn_or = copy.deepcopy(image_opencv_input)
        # image_maskrcnn_and = copy.deepcopy(image_opencv_input)
        image_fclusters = copy.deepcopy(image_opencv_input)
        image_dbclusters = copy.deepcopy(image_opencv_input)
        image_via = copy.deepcopy(image_opencv_input)
        # detect height and width of the image
        img_height, img_width, img_channels = image_opencv_input.shape
        # print("width:  ", img_width)
        # print("height: ", img_height)
        # print("channel:", img_channels)
        # Read an image with OpenCV end

        # Detect the font-size with tesseract for the whole image start
        whole_img = cv2.cvtColor(image_opencv_input, cv2.COLOR_BGR2GRAY)
        result = pytesseract.image_to_boxes(whole_img)
        lines = result.strip().split("\n")
        font_size = []

        for line in lines:
            chars = line.split(" ")
            try:
                font_size.append(float(chars[4]) - float(chars[2]))
            except Exception:
                font_size.append(12.0)  # Default font-size value is 12px
        font_size_img = int(median(font_size) * 1.7)  # Font-size value of the image
        # Detect the font-size with tesseract for the whole image end

        # Get(take the whole image) the dominant colour for the parent container
        bcolour_container_value = "255,255,255,0"
        domcolour_container = get_dominant_colour(image_opencv_input)[0]
        domcolour_container.append(1)
        bcolour_container_value = ",".join(str(int(x)) for x in domcolour_container)

        # Detect text contours and rectangles on image start
        text_contours = []
        rect_contours = []
        # Detect text regions
        text_contours = run_text_detection(image_opencv_input, text=False)

        # text_contours1 = run_text_detection(image_opencv_input, text=True)
        #
        # print(text_contours1)
        # print("length", len(text_contours), len(text_contours1))
        #
        # input()
        # Detect rect regions
        rect_contours = get_rect_contours(image_opencv_input)

        for text_contour in text_contours:
            # Remove untypically wide text blocks
            width2 = text_contour[3]
            if width2 > (font_size_img * 3):
                text_contours.remove(text_contour)

        # Remove close-by text blocks
        # text contour
        # (161, 80, 243, 24)
        # x, y, width, height
        # x, y, x1, y1
        merged_contours = []
        excluded_contours = set()
        for idx, text_contour in enumerate(text_contours):
            x, y, w, h = text_contour
            for idx1, text_contour1 in enumerate(text_contours):
                x1, y1, w1, h1 = text_contour1
                if idx != idx1:
                    # Intervals should be close to each other not more than for 3px
                    text_contour_x = x
                    text_contour_x1 = x + w
                    text_contour_y = y
                    text_contour_y1 = y + h

                    text_contour1_x = x1
                    text_contour1_x1 = x1 + w1
                    text_contour1_y = y1
                    text_contour1_y1 = y1 + h1

                    # Borders of the overlapped area
                    bottom = max(y, y1)
                    top = min(y + h, y1 + h1)

                    # Length of the overlapped area
                    vertical_overlap = top - bottom

                    if (
                        vertical_overlap
                        > HORIZONTAL_GROUPS_VERTICAL_OVERLAP_THRESHOLD * min(h, h1)
                    ):
                        if (text_contour_x1 + 3 > text_contour1_x) and (
                            text_contour_x < text_contour1_x
                        ):
                            # Merge these intervals
                            tcont_y = min(
                                text_contour_y,
                                text_contour1_y,
                                text_contour_y1,
                                text_contour1_y1,
                            )
                            tcont_y1 = max(
                                text_contour_y,
                                text_contour1_y,
                                text_contour_y1,
                                text_contour1_y1,
                            )
                            tcont_x = min(
                                text_contour_x,
                                text_contour1_x,
                                text_contour_x1,
                                text_contour1_x1,
                            )
                            tcont_x1 = max(
                                text_contour_x,
                                text_contour1_x,
                                text_contour_x1,
                                text_contour1_x1,
                            )

                            tcont_width = tcont_x1 - tcont_x
                            tcont_height = tcont_y1 - tcont_y
                            tcont = (tcont_x, tcont_y, tcont_width, tcont_height)
                            # Add new interval to list
                            merged_contours.append(tcont)

                            # Remove source intervals from list
                            excluded_contours.add(idx)
                            excluded_contours.add(idx1)

        # Remove set of indices from list
        text_contours = [
            i for j, i in enumerate(text_contours) if j not in excluded_contours
        ]
        # Add merged contours to list
        text_contours.extend(merged_contours)

        for rect_contour in rect_contours:
            # Remove untypically large rect blocks
            width2 = rect_contour[2]
            height2 = rect_contour[3]
            if (width2 * height2) > (img_height * img_width) * 0.75:
                rect_contours.remove(rect_contour)

        # Save all detected regions into dictionary
        result = {"text": text_contours, "rect": rect_contours}
        # Detect text contours and rectangles on image end

        window_name1 = "image_opencv"

        # Create the opencv recognition end

        #
        #
        # Here is the divergency point between images and footers

        # Create the recognized_elements array start
        if imgpath:
            # Loading the image and converting to the numpy array
            img = load_img(imgpath)
            img = img_to_array(img)

            # Detect a size of the file uploaded
            fsize = str(os.path.getsize(imgpath))

            # Write a merged string with fname and size
            fnamesize = fname + fsize

            # Prepare a dictionary (AND- based) to store recognized shapes
            fdict[fnamesize] = {
                "filename": fname,
                "size": fsize,
                "regions": [],
                "file_attributes": {},
            }

            # Prepare a dictionary (OR- based) to store recognized shapes
            fordict[fnamesize] = {
                "filename": fname,
                "size": fsize,
                "regions": [],
                "file_attributes": {},
            }

            # Prepare a dictionary (CNN) to store recognized shapes
            cnndict[fnamesize] = {
                "filename": fname,
                "size": fsize,
                "regions": [],
                "file_attributes": {},
            }

            # Create a directory to save HTML for some image processed
            # CURRENT_DIR = os.getcwd()
            SAVE_DIR = os.path.join(MEDIA_ROOT, fname)
            find_or_create_dir(SAVE_DIR)

            os.chmod(SAVE_DIR, 0o755)
            os.chdir(SAVE_DIR)

            # Detect elements for the case of "forms", "headers", "footers"
            if region_dataset in {"forms", "headers", "footers"}:
                # Detect elements with Mask R CNN model start
                if region_dataset == "forms":
                    results = model_forms.detect([img], verbose=1)

                if region_dataset == "headers":
                    results = model_headers.detect([img], verbose=1)

                if region_dataset == "footers":
                    results = model_footers.detect([img], verbose=1)

                # Results of the Mask R CNN recognition
                r = results[0]
                # Detect elements with Mask R CNN model end

                # Printing text contours preparations (AND) start
                for text_contour in text_contours:
                    x, y, w, h = text_contour
                    # location = i.location  # y, x
                    # size = i.size  # width, height
                    element = "ocrtext"

                    # Fill the attributes dictionary
                    attributes_dict = {
                        "shape_attributes": {
                            "name": "rect",
                            "x": int(x),
                            "y": int(y),
                            "width": int(w),
                            "height": int(h),
                        },
                        "region_attributes": {"HTML element": element},
                    }
                    # Filter out small text contours with height > width
                    # Here is the filtering of the text blocks.
                    # The small text contours with height > width were often a junk contours,
                    # especially not for the whole webpages, but for some smaller blocks (forms, headers, footers).
                    # Probably a better filtering strategy will be found later here
                    if w > h:
                        fdict[fnamesize]["regions"].append(attributes_dict)
                    cv2.rectangle(
                        image_opencv_input, (x, y), (x + w, y + h), (255, 0, 0), 1
                    )

                # Printing text contours preparations (AND) end

                # Printing rect contours with concatenation preparations start
                for rect_contour in rect_contours:
                    x1, y1, w, h = rect_contour
                    x2 = w + x1
                    y2 = h + y1

                    cv2.rectangle(
                        image_opencv_input, (x1, y1), (x1 + w, y1 + h), (255, 0, 255), 1
                    )
                    # cv2.imshow(window_name1, image_opencv_input)
                    # cv2.waitKey(0)

                    centers_distance_min = 10000

                    class_id_recognized = 7  # Image
                    for idx1, (rect1, class_id1) in enumerate(
                        zip(r["rois"], r["class_ids"])
                    ):
                        #  1,2,4,5,7 means elements except the text class and the radiobutton while merging forms
                        if (
                            (
                                (region_dataset == "forms")
                                and (class_id1 in {1, 2, 4, 5, 7})
                            )
                            or (
                                (region_dataset == "footers")
                                and (class_id1 in {2, 3, 4, 5})
                            )
                            or (
                                (region_dataset == "headers")
                                and (class_id1 in {2, 3, 4, 5, 6, 7, 8})
                            )
                        ):
                            x3 = rect1[1]
                            y3 = rect1[0]
                            x4 = rect1[3]
                            y4 = rect1[2]

                            # cv2.rectangle(image_opencv_input, (x3, y3), (x4, y4), (255, 100, 255), 1)

                            # Borders of the rectangles overlapped area
                            # Define the overlapping area between the rectangles
                            left = max(x1, x3)
                            bottom = max(y1, y3)
                            right = min(x2, x4)
                            top = min(y2, y4)
                            # Sizes of the rectangles overlapped area
                            width = right - left
                            height = top - bottom

                            # The first rectangle square
                            width1, height1 = x2 - x1, y2 - y1

                            # The second rectangle square
                            width2, height2 = x4 - x3, y4 - y3

                            # Calculate distance between rect_contour and idx1 with two dimensions
                            # Find the pair with smallest distance
                            # Save this pair for further processing
                            center_x12 = (x1 + x2) / 2
                            center_y12 = (y1 + y2) / 2
                            center_x34 = (x3 + x4) / 2
                            center_y34 = (y3 + y4) / 2
                            # print(calculateDistance(center_x12, center_y12, center_x34, center_y34))
                            centers_distance = calculateDistance(
                                center_x12, center_y12, center_x34, center_y34
                            )

                            # Check if width, height of the overlapped area less or equal 0
                            # I compare the two rectangles to detect if they overlap.
                            if not (width <= 0 or height <= 0):
                                # If the square > 0, calculate the squares of the 3 rectangles
                                square = width * height
                                square1 = width1 * height1
                                square2 = width2 * height2
                                if (
                                    square > square1 * SQUARES_OVERLAP_THRESHOLD_CONTOUR
                                ) or (
                                    square > square2 * SQUARES_OVERLAP_THRESHOLD_CONTOUR
                                ):
                                    if centers_distance < centers_distance_min:
                                        centers_distance_min = centers_distance
                                        # idx1_selected = idx1
                                        # Assign the class id value to the rect_contour
                                        class_id_recognized = class_id1
                                        # print("idx1_select", idx1)

                    # cv2.destroyAllWindows()

                    cv2.imwrite("opencv_contours_" + fname, image_opencv_input)

                    # forms:
                    # write the class value based on class id start
                    if region_dataset == "forms":
                        # Input
                        if class_id_recognized == 1:
                            element = "input"
                        # Button
                        if class_id_recognized == 2:
                            element = "button"
                        # Text
                        if class_id_recognized == 3:
                            element = "text"
                        # Select
                        if class_id_recognized == 4:
                            element = "select"
                        # Checkbox
                        if class_id_recognized == 5:
                            element = "checkbox"
                        # Radiobutton
                        if class_id_recognized == 6:
                            element = "radiobutton"
                        # Image
                        if class_id_recognized == 7:
                            element = "image"

                    # write the class value based on class id end

                    # headers:
                    # write the class value based on class id start
                    if region_dataset == "headers":
                        # Text
                        if class_id_recognized == 1:
                            element = "text"
                        # Image
                        if class_id_recognized == 2:
                            element = "image"
                        # Button
                        if class_id_recognized == 3:
                            element = "button"
                        # Menu
                        if class_id_recognized == 4:
                            element = "menu"
                        # Li
                        if class_id_recognized == 5:
                            element = "li"
                        # Input
                        if class_id_recognized == 6:
                            element = "input"
                        # Select
                        if class_id_recognized == 7:
                            element = "select"
                        # Form
                        if class_id_recognized == 8:
                            element = "form"

                    # write the class value based on class id end

                    # footers:
                    # write the class value based on class id start
                    if region_dataset == "footers":
                        # Text
                        if class_id_recognized == 1:
                            element = "text"
                        # Image
                        if class_id_recognized == 2:
                            element = "image"
                        # Button
                        if class_id_recognized == 3:
                            element = "button"
                        # Select
                        if class_id_recognized == 4:
                            element = "select"
                        # Input
                        if class_id_recognized == 5:
                            element = "input"
                    # write the class value based on class id end

                    # Fill the attributes dictionary
                    attributes_dict = {
                        "shape_attributes": {
                            "name": "rect",
                            "x": int(x1),
                            "y": int(y1),
                            "width": int(w),
                            "height": int(h),
                        },
                        "region_attributes": {"HTML element": element},
                    }
                    fdict[fnamesize]["regions"].append(attributes_dict)
                # Printing rect contours with concatenation preparations end

                # Printing text contours preparations (OR) start
                for text_contour in text_contours:
                    x, y, w, h = text_contour
                    element = "ocrtext"

                    # Fill the attributes dictionary
                    attributes_dict = {
                        "shape_attributes": {
                            "name": "rect",
                            "x": int(x),
                            "y": int(y),
                            "width": int(w),
                            "height": int(h),
                        },
                        "region_attributes": {"HTML element": element},
                    }
                    # Filter out small text contours with height > width
                    # Here is the filtering of the text blocks.
                    # The small text contours with height > width were often a junk contours,
                    # especially not for the whole webpages, but for some smaller blocks (forms, headers, footers).
                    # Probably a better filtering strategy will be found later here
                    if w > h:
                        fordict[fnamesize]["regions"].append(attributes_dict)
                    cv2.rectangle(
                        image_maskrcnn_or, (x, y), (x + w, y + h), (255, 0, 0), 1
                    )
                # Printing text contours preparations (OR) end

                # Printing rect contours with OR concatenation preparations start
                for rect_contour in rect_contours:
                    x1, y1, w, h = rect_contour
                    x2 = w + x1
                    y2 = h + y1

                    cv2.rectangle(
                        image_maskrcnn_or, (x1, y1), (x1 + w, y1 + h), (255, 0, 255), 1
                    )

                    centers_distance_min = 10000

                    class_id_recognized = 7  # Image
                    for idx1, (rect1, class_id1) in enumerate(
                        zip(r["rois"], r["class_ids"])
                    ):
                        #  1,2,4,5,7 means elements except the text class and the radiobutton while merging forms
                        if (
                            (
                                (region_dataset == "forms")
                                and (class_id1 in {1, 2, 4, 5, 7})
                            )
                            or (
                                (region_dataset == "footers")
                                and (class_id1 in {2, 3, 4, 5})
                            )
                            or (
                                (region_dataset == "headers")
                                and (class_id1 in {2, 3, 4, 5, 6, 7, 8})
                            )
                        ):
                            x3 = rect1[1]
                            y3 = rect1[0]
                            x4 = rect1[3]
                            y4 = rect1[2]

                            # cv2.rectangle(image_opencv_input, (x3, y3), (x4, y4), (255, 100, 255), 1)

                            # Borders of the rectangles overlapped area
                            # Define the overlapping area between the rectangles
                            left = max(x1, x3)
                            bottom = max(y1, y3)
                            right = min(x2, x4)
                            top = min(y2, y4)
                            # Sizes of the rectangles overlapped area
                            width = right - left
                            height = top - bottom

                            # The first rectangle square
                            width1, height1 = x2 - x1, y2 - y1

                            # The second rectangle square
                            width2, height2 = x4 - x3, y4 - y3

                            # Calculate distance between rect_contour and idx1 with two dimensions
                            # Find the pair with smallest distance
                            # Save this pair for further processing
                            center_x12 = (x1 + x2) / 2
                            center_y12 = (y1 + y2) / 2
                            center_x34 = (x3 + x4) / 2
                            center_y34 = (y3 + y4) / 2
                            # print(calculateDistance(center_x12, center_y12, center_x34, center_y34))
                            centers_distance = calculateDistance(
                                center_x12, center_y12, center_x34, center_y34
                            )

                            # Check if width, height of the overlapped area less or equal 0
                            # I compare the two rectangles to detect if they overlap.
                            if not (width <= 0 or height <= 0):
                                # If the square > 0, calculate the squares of the 3 rectangles
                                square = width * height
                                square1 = width1 * height1
                                square2 = width2 * height2
                                if (
                                    square > square1 * SQUARES_OVERLAP_THRESHOLD_CONTOUR
                                ) or (
                                    square > square2 * SQUARES_OVERLAP_THRESHOLD_CONTOUR
                                ):
                                    if centers_distance < centers_distance_min:
                                        centers_distance_min = centers_distance
                                        # idx1_selected = idx1
                                        # Assign the class id value to the rect_contour
                                        class_id_recognized = class_id1
                                        # print("idx1_select", idx1)

                    # cv2.destroyAllWindows()

                    cv2.imwrite("opencv_contours_or_" + fname, image_maskrcnn_or)

                    element = write_elem_value(region_dataset, class_id_recognized)

                    # Fill the attributes dictionary
                    attributes_dict = {
                        "shape_attributes": {
                            "name": "rect",
                            "x": int(x1),
                            "y": int(y1),
                            "width": int(w),
                            "height": int(h),
                        },
                        "region_attributes": {"HTML element": element},
                    }
                    fordict[fnamesize]["regions"].append(attributes_dict)
                # Printing rect contours with OR concatenation preparations end

                # Printing contours with mask r cnn only start
                for idx1, (rect1, class_id1) in enumerate(
                    zip(r["rois"], r["class_ids"])
                ):
                    x3 = rect1[1]
                    y3 = rect1[0]
                    x4 = rect1[3]
                    y4 = rect1[2]

                    # The second rectangle square
                    width, height = x4 - x3, y4 - y3

                    element = write_elem_value(region_dataset, class_id1)

                    # Fill the attributes dictionary
                    attributes_dict = {
                        "shape_attributes": {
                            "name": "rect",
                            "x": int(x3),
                            "y": int(y3),
                            "width": int(width),
                            "height": int(height),
                        },
                        "region_attributes": {"HTML element": element},
                    }
                    cnndict[fnamesize]["regions"].append(attributes_dict)
                # Printing contours with mask r cnn only end

            # Detect elements for the case of "webpages"
            if region_dataset in {"webpages"}:
                # Print all the contours to the file
                # Format the file Via-like
                # result = {"text": text_contours, "rect": rect_contours}
                # Printing text contours preparations start
                for text_contour in text_contours:
                    x, y, w, h = text_contour
                    # location = i.location  # y, x
                    # size = i.size  # width, height
                    element = "ocrtext"

                    # Fill the attributes dictionary
                    attributes_dict = {
                        "shape_attributes": {
                            "name": "rect",
                            "x": int(x),
                            "y": int(y),
                            "width": int(w),
                            "height": int(h),
                        },
                        "region_attributes": {"HTML element": element},
                    }
                    fdict[fnamesize]["regions"].append(attributes_dict)
                # Printing text contours preparations end

                # Printing rect contours preparations start
                for rect_contour in rect_contours:
                    x, y, w, h = rect_contour
                    # location = i.location  # y, x
                    # size = i.size  # width, height
                    element = "div"

                    # Fill the attributes dictionary
                    attributes_dict = {
                        "shape_attributes": {
                            "name": "rect",
                            "x": int(x),
                            "y": int(y),
                            "width": int(w),
                            "height": int(h),
                        },
                        "region_attributes": {"HTML element": element},
                    }
                    fdict[fnamesize]["regions"].append(attributes_dict)
                    # Printing rect contours preparations end

        if region_dataset not in {"webpages"}:
            # Printing the Mask R CNN output function call
            # Try to fill cnndict (second time)
            print_maskrcnn_output(
                region_dataset,
                image_maskrcnn_notext,
                fname,
                fnamesize,
                r,
                cnndict,
                element,
                image_maskrcnn,
            )

        # fdict obtained
        # file_dict = fdict
        # print("fdict: ", fdict)
        # print("fordict: ", fordict)

        # this asignment used for headers testing purposes
        # fdict = cnndict
        # cnndict = fordict
        # print("fdict: ", fdict)

        # Assembling start
        # Supplementary parameters calculation and printing of the fdict function call
        min_x1, min_y1, max_x2, max_y2 = supplement_fdict_calc_printing(
            fdict, fname, fnamesize, img_width, img_height, image_via=image_via
        )

        # Supplementary parameters calculation and printing of the cnndict function call
        min_cnnx1, min_cnny1, max_cnnx2, max_cnny2 = supplement_fdict_calc_printing(
            cnndict, fname, fnamesize, img_width, img_height
        )

        # This should be replaced to create nested structure. Clusters obtained from text blocks
        # and from rect blocks should save this information
        if region_dataset in {"webpages"}:
            # Calculate the excluded indices to remove overlapped elements function calling
            calculate_excluded_indices(fdict, fnamesize)

        # Create ocvclusters
        # Creating a nested structure.
        # Clusters obtained from text blocks and from rect blocks should save this information
        if region_dataset in {"webpages"}:
            # Calculate ocvclusters function calling
            calculate_ocvclusters(fdict, fnamesize)

        # Calculate fclusters function calling
        root_firstcluster = calculate_fclusters(fdict)

        # Calculate fclusters cnn function calling
        clusters_cnn = calculate_fclusters(cnndict)

        if region_dataset in ["headers", "footers", "webpages"]:
            # Calculate dbclusters function calling
            root_firstcluster = calculate_dbclusters(region_dataset, root_firstcluster)
            # Calculate dbclusters cnn function calling.
            root_firstcluster_cnn = calculate_dbclusters(region_dataset, clusters_cnn)

        """
        try:
            # Replace clusters for dbclusters if possible
            fclusters = copy.copy(clusters)
            clusters = dbclusters
        except Exception:
            pass
        finally:
            pass
        """

        try:
            # Replace clusters cnn for dbclusters cnn if possible
            fclusters_cnn = copy.copy(clusters_cnn)
            clusters_cnn = root_firstcluster_cnn
        except Exception:
            pass
        finally:
            pass

        # Ternary assembling algorithm function calling
        root_block = ternary_assembling_run(
            min_x1,
            min_y1,
            max_x2,
            max_y2,
            root_firstcluster,
            image_opencv_input,
            window_name1,
        )

        # Ternary assembling algorithm cnn function calling
        # Should remove image_opencv_input here to display info properly
        root_block_cnn = ternary_assembling_run(
            min_cnnx1,
            min_cnny1,
            max_cnnx2,
            max_cnny2,
            clusters_cnn,
            image_opencv_input,
            window_name1,
            fclusters_cnn,
        )

        # Printing clusters function calling
        clusters_printing(root_block, fname, input_image=[])

        # HTML tree initialize function call
        root, outer_div, styles, parameters = htmltree_initialize(
            fname, bcolour_container_value, img_width
        )

        # Serializer only
        # Define the export node start
        outer_div_node = ScenarioElement.objects.create(
            parent=serializer_node,
            struct_type="container",
            parameters=parameters,
            styles=styles,
            buoyancy=0,
        )
        # Define the export node end

        # Obtaining the absolute path for the parameters directly. Should change this later.
        o = urlparse(self.context["request"].build_absolute_uri())
        # Detect elements for the root block
        elements_rootblock(
            root_block,
            styles_on,
            region_dataset,
            img_width,
            img_height,
            outer_div,
            image_original,
            fname,
            o,
            serializing="virtualize_simple",
        )
        # Serializer only
        elements_rootblock_create(
            root_block, outer_div_node, o, serializing="virtualize_simple"
        )

        # Detect elements for the root block double cnn
        elements_rootblock(
            root_block_cnn,
            styles_on,
            region_dataset,
            img_width,
            img_height,
            outer_div,
            image_original,
            fname,
            o,
            serializing="virtualize_simple",
        )
        # Serializer only cnn
        elements_rootblock_create(
            root_block_cnn, outer_div_node, o, serializing="virtualize_simple"
        )

        """
        # Detect elements for the root block triple
        elements_rootblock(root_block, styles_on, region_dataset, img_width, img_height, outer_div,
                           image_original, fname, o, serializing="virtualize_simple")
        # Serializer only
        elements_rootblock_create(root_block, outer_div_node, o, serializing="virtualize_simple")
        """

        # Generating HTML for printing
        html = ET.tostring(root, short_empty_elements=False).decode("utf-8")
        # print("html=", html)

        # Print html code
        with open(fname + ".html", "w") as html_file:
            print(html, file=html_file)

        # Print tree to file
        with open(VIA_ANNOTATION_ASSEMBLING_FILE + fname + ".txt", "w") as tree_file:
            for pre, fill, node in RenderTree(root_block):
                treestr = u"%s%s" % (pre, node.name)
                print(
                    treestr.ljust(8),
                    node.x1,
                    node.y1,
                    node.x2,
                    node.y2,
                    "direction:",
                    node.direction,
                    node.types,
                    "num_elements:",
                    len(node.elements),
                    "num_children:",
                    len(node.children),
                    "processing:",
                    node.processing,
                    file=tree_file,
                )

        # Archive all the files for a zip directory
        shutil.make_archive(SAVE_DIR, "zip", SAVE_DIR)
        zip_archive_name = fname + ".zip"

        # serializer_node.parameters["html"] = html
        # Obtaining the absolute path for the parameters directly. Should change this later.
        o = urlparse(self.context["request"].build_absolute_uri())
        serializer_node.parameters["archive"] = (
            "https://" + o.netloc + MEDIA_URL + zip_archive_name
        )

        return serializer_node
'''


class ScenarioElementAssemblingSerializer(serializers.ModelSerializer):
    parameters = serializers.JSONField()
    styles = serializers.JSONField()
    children = RecursiveField(required=False, allow_null=True, many=True)
    container = serializers.PrimaryKeyRelatedField(source="node.id", read_only=True)
    parent_id = serializers.IntegerField()
    dbclusters_on = serializers.IntegerField(required=False)
    styles_on = serializers.IntegerField(required=False)

    class Meta:
        model = ScenarioElement
        fields = (
            "id",
            "container",
            "name",
            "children",
            "parent_id",
            "dbclusters_on",
            "styles_on",
            "struct_type",
            "func_type",
            "direction",
            "buoyancy",
            "image",
            "parameters",
            "styles",
        )

        extra_kwargs = {
            "struct_type": {"read_only": True},
            "func_type": {"read_only": True},
            "dbclusters_on": {"write_only": True},
            "styles_on": {"write_only": True},
        }

    def create(self, validated_data):
        root_element_data = {
            "struct_type": "container",
            "func_type": "undefined",
            "parameters": {},
            "styles": {},
        }

        # Pre-Root element assignment
        # Serializer only
        element_root_pre = ScenarioElement.objects.get(id=validated_data["parent_id"])

        # dbclusters calculation is optional
        dbclusters_on = 1  # Calculate dbclusters
        try:
            dbclusters_on = validated_data["dbclusters_on"]
        except Exception:
            pass

        # Define styles variable switching on,
        # this variable is plased at parameters with other serializers as a flag
        # styles calculation is optional
        styles_on = 1  # Calculate styles
        try:
            styles_on = validated_data["styles_on"]
        except Exception:
            pass

        # Read the region annotation from parameters
        # Serializer only
        fdict = None
        if validated_data.get("parameters"):
            try:
                fdict = validated_data["parameters"]["annotation"]
            except Exception:
                pass

        # Extract an appropriate flag value to recognize block as header, footer, form or layout
        # Region dataset has some starting value
        region_dataset = "webpages"
        if validated_data.get("parameters"):
            region_dataset = validated_data["parameters"]["block_type"]

        # Create the root element mptt start
        # Without image
        serializer_node = ScenarioElement.objects.create(
            parent=element_root_pre, **root_element_data
        )
        # Create the root element mptt end

        # Obtaining the absolute path for the parameters directly. Should change this later.
        o = urlparse(self.context["request"].build_absolute_uri())
        # Set the local parameters to be changed from localhost to staging
        localparams = parse_qs(o.query)
        # print(localparams)
        localparams["page"] = 0
        if o.netloc == "127.0.0.1:8000":
            localparams["page"] = 1
            # localparams['page'] = 2

        # Calculate a chain of functions to assemble
        parameters, styles, root_block = pipeline_assemble(
            region_dataset, fdict, o, dbclusters_on, styles_on, localparams, serializing="assemble"
        )

        # Define the export node
        # Serializer only
        outer_div_node = ScenarioElement.objects.create(
            parent=serializer_node,
            struct_type="container",
            parameters=parameters,
            styles=styles,
            buoyancy=0,
        )

        # HTML elements and components creation
        # Serializer only
        elements_rootblock_create(root_block, outer_div_node, o, serializing="assemble")

        return serializer_node


class ScenarioElementFreecanvasSerializer(serializers.ModelSerializer):
    parameters = serializers.JSONField()
    styles = serializers.JSONField()
    children = RecursiveField(required=False, allow_null=True, many=True)
    container = serializers.PrimaryKeyRelatedField(source="node.id", read_only=True)
    parent_id = serializers.IntegerField()

    class Meta:
        model = ScenarioElement
        fields = (
            "id",
            "container",
            "name",
            "children",
            "parent_id",
            "struct_type",
            "func_type",
            "direction",
            "buoyancy",
            "image",
            "parameters",
            "styles",
        )

        extra_kwargs = {
            "struct_type": {"read_only": True},
            "func_type": {"read_only": True},
        }

    def create(self, validated_data):
        root_element_data = {
            "struct_type": "container",
            "func_type": "undefined",
            "parameters": {},
            "styles": {},
        }
        # Nested elements should be detected at the free canvas later

        # Pre-Root element assignment
        element_root_pre = ScenarioElement.objects.get(id=validated_data["parent_id"])

        # Extract an appropriate flag value to recognize block as header, footer, form or layout
        # Region dataset has some starting value
        region_dataset = "forms"

        # Create the root element mptt for the containers generated start
        serializer_node = ScenarioElement.objects.create(
            parent=element_root_pre, **root_element_data
        )
        # Create the root element mptt for the containers generated end

        # Read the region annotation from parameters
        fdict = {}

        fname = element_root_pre.name + '.png'
        fsize = "0"
        fnamesize = fname + fsize

        fdict[fnamesize] = {
            "filename": fname,
            "size": fsize,
            "regions": [],
            "file_attributes": {},
        }

        # Freecanvas images sizes syntax
        # Define root canvas width and height, based on layout parameter
        # Mobile devices
        if element_root_pre.parameters["layouts"] == "mobile":
            freecanvasimg_hw = 320, 736

        # Tablet devices
        elif element_root_pre.parameters["layouts"] == "tablet":
            freecanvasimg_hw = 768, 1024

        # Desktop devices
        elif element_root_pre.parameters["layouts"] == "desktop":
            freecanvasimg_hw = 800, 1280

        # Other devices
        else:
            freecanvasimg_hw = 800, 1280

        # Go through all the input elements
        # Construct fdict.
        # Top level children should be extracted first. Later this should be improved to process nested components.
        # print(element_root_pre)
        # print(element_root_pre.name)
        children = element_root_pre.get_children()
        for child in children:
            if child.parameters:
                print(child, child.parameters)
                print(
                    child, child.parameters["layouts"], child.parameters["freeCanvas"]
                )
                # Fill the attributes dictionary
                attributes_dict = {
                    "shape_attributes": {
                        "name": "rect",
                        "x": child.parameters["freeCanvas"]["left"],
                        "y": child.parameters["freeCanvas"]["top"],
                        "width": child.parameters["freeCanvas"]["width"],
                        "height": child.parameters["freeCanvas"]["height"],
                    },
                    "region_attributes": {"HTML element": child.struct_type},
                }

                fdict[fnamesize]["regions"].append(attributes_dict)

        # Obtaining the absolute path for the parameters directly. Should change this later.
        o = urlparse(self.context["request"].build_absolute_uri())
        # Set the local parameters to be changed from localhost to staging
        localparams = parse_qs(o.query)
        # print(localparams)
        localparams["page"] = 0
        if o.netloc == "127.0.0.1:8000":
            localparams["page"] = 1
            # localparams['page'] = 2

        if fdict:
            '''
            # Assembling for the freecanvas from the previous version start
            # Show text contours on image start
            window_name1 = "image_opencv_text"
            # Supplementary parameters calculation and printing of the fdict function call
            min_x1, min_y1, max_x2, max_y2 = supplement_fdict_calc_printing(
                fdict, fnamesize, img_width, img_height
            )

            # Calculate the excluded indices to remove overlapped elements function calling
            calculate_excluded_indices(fdict, fnamesize)

            # Calculate fclusters function calling
            clusters = calculate_fclusters(fdict, fnamesize, fname)

            if region_dataset in ["headers", "footers", "webpages"]:
                # Calculate dbclusters function calling
                dbclusters = calculate_dbclusters(region_dataset, clusters, fname)

            try:
                # Replace clusters for dbclusters if possible
                fclusters = copy.copy(clusters)
                clusters = dbclusters
            except Exception:
                pass
            finally:
                pass

            root_block = ternary_assembling_run(
                min_x1,
                min_y1,
                max_x2,
                max_y2,
                clusters,
                image_opencv_input,
                window_name1,
                fclusters,
            )

            # Create a directory to save HTML for some image processed
            SAVE_DIR = os.path.join(MEDIA_ROOT, fname)
            find_or_create_dir(SAVE_DIR)
            os.chdir(SAVE_DIR)

            # Define bcolour_container_value for the free canvas
            bcolour_container_value = "255,255,255,0"
            # HTML tree initialize function call
            root, outer_div, styles, parameters = htmltree_initialize(
                fname, bcolour_container_value, img_width
            )

            # Detect elements for the root block
            elements_rootblock(
                root_block,
                styles_on,
                region_dataset,
                img_width,
                img_height,
                outer_div,
                image_original,
                fname,
                o,
                serializing="freecanvas",
            )
            # Assembling for the freecanvas from the previous version end
            '''

            # Calculate a chain of functions to assemble
            parameters, styles, root_block = pipeline_assemble(
                region_dataset, fdict, o, localparams, freecanvasimg_hw=freecanvasimg_hw, serializing="freecanvas"
            )

            # Define the export node
            outer_div_node = ScenarioElement.objects.create(
                parent=serializer_node,
                struct_type="container",
                parameters=parameters,
                styles=styles,
                buoyancy=0,
            )

            # Serializer only
            elements_rootblock_create(
                root_block, outer_div_node, o, serializing="freecanvas", children=children
            )
        return serializer_node
