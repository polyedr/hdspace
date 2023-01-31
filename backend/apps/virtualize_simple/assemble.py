import itertools
import json
import os, sys

import copy
import lorem
import numpy as np
import math
import uuid
from statistics import median, median_low

from anytree import RenderTree
from anytree.exporter import DictExporter

from project.settings import (
    MEDIA_ROOT,
    MEDIA_URL,
    BASE_DIR,
)

if os.environ.get("ENV_NAME") == 'Staging':
    # This should be changed for the command line interface
    from project.settings import (
        model_forms,
        model_headers,
        model_footers,
    )

from sklearn.preprocessing import StandardScaler
from sklearn.datasets import make_blobs
from sklearn import cluster as clustermethod
import xml.etree.ElementTree as ET
import cv2
import pytesseract
from pytesseract import Output

from apps.utils.fset1 import (
    get_dominant_colour,
    isRectangleOverlap,
    Rectangle,
    ClusterClass,
    Partition,
    blocks_split,
    closest_node,
    find_or_create_dir,
    calculateDistance,
    SQUARES_OVERLAP_THRESHOLD_CONTOUR,
    contains_rectangle,
)

from google.cloud import vision

os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = os.path.abspath(
    BASE_DIR + "/gkeys/adevigcv-0300068cae79.json"
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

VIA_ANNOTATION_ASSEMBLING_FILE = "assembling_"


def clusters_printing(root_block, fname, input_image=[]):
    if len(input_image):
        image_allclusters = copy.deepcopy(input_image)
        image_cclusters = copy.deepcopy(input_image)
        image_firstclusters1 = copy.deepcopy(input_image)
        image_allcluelems = copy.deepcopy(input_image)

    # Go through all the first clusters obtained after the annotation
    if len(image_firstclusters1):
        # Print all the firstclusters
        for pre, fill, node in RenderTree(root_block):
            if node.types == "firstcluster":
                cv2.rectangle(
                    image_firstclusters1,
                    (node.x1, node.y1),
                    (node.x2, node.y2),
                    (20, 50, 107),
                    1,
                )

            # Put the class id as a label.
            label_element = str(node.element_assigned)
            # Keep in mind, that this label will be different for the specific block types
            # if (label_element == "list"):
            cv2.putText(
                image_firstclusters1,
                label_element,
                (node.x1, node.y2),
                cv2.FONT_HERSHEY_SIMPLEX,
                0.5,
                (36, 255, 12),
                2,
            )

        # Printing cclusters to file
        cv2.imwrite("firstclusters1_" + fname, image_firstclusters1)

    # Go through all the blocks obtained after the ternary algorithm
    if len(image_cclusters):
        # Print all the cclusters
        for pre, fill, node in RenderTree(root_block):
            if node.types == "ccluster":
                cv2.rectangle(
                    image_cclusters,
                    (node.x1, node.y1),
                    (node.x2, node.y2),
                    (20, 50, 107),
                    1,
                )
        # Printing cclusters to file
        cv2.imwrite("cclusters_" + fname, image_cclusters)

    # Go through all the blocks obtained after the ternary algorithm
    if len(image_allclusters):
        # Print all the clusters
        for pre, fill, node in RenderTree(root_block):
            if node.types == "ccluster":
                cv2.rectangle(
                    image_allclusters,
                    (node.x1, node.y1),
                    (node.x2, node.y2),
                    (20, 50, 107),
                    1,
                )

            if node.types == "dbcluster":
                cv2.rectangle(
                    image_allclusters,
                    (node.x1, node.y1),
                    (node.x2, node.y2),
                    (164, 24, 4),
                    1,
                )

            if node.types == "fcluster":
                cv2.rectangle(
                    image_allclusters,
                    (node.x1, node.y1),
                    (node.x2, node.y2),
                    (0, 0, 255),
                    1,
                )

        # Printing all clusters to file
        cv2.imwrite("allclusters_" + fname, image_allclusters)

    if len(image_allcluelems):
        # Go through all the blocks obtained after the ternary algorithm
        # Print all the clusters with elements
        for pre, fill, node in RenderTree(root_block):
            if node.types == "ccluster":
                cv2.rectangle(
                    image_allcluelems,
                    (node.x1, node.y1),
                    (node.x2, node.y2),
                    (20, 50, 107),
                    1,
                )

            if node.types == "dbcluster":
                cv2.rectangle(
                    image_allcluelems,
                    (node.x1, node.y1),
                    (node.x2, node.y2),
                    (164, 24, 4),
                    1,
                )

            if node.types == "fcluster":
                cv2.rectangle(
                    image_allcluelems,
                    (node.x1, node.y1),
                    (node.x2, node.y2),
                    (0, 0, 255),
                    1,
                )

            if node.types == "firstcluster":
                cv2.rectangle(
                    image_allcluelems,
                    (node.x1, node.y1),
                    (node.x2, node.y2),
                    (255, 0, 255),
                    1,
                )

            # Put the class id as a label.
            label_element = str(node.element_assigned)
            # Keep in mind, that this label will be different for the specific block types
            if label_element == "list":
                cv2.putText(
                    image_allcluelems,
                    label_element,
                    (node.x1, node.y2),
                    cv2.FONT_HERSHEY_SIMPLEX,
                    0.5,
                    (36, 255, 12),
                    2,
                )

        # Printing all clusters with elements to file
        cv2.imwrite("allclusters_with_elements_" + fname, image_allcluelems)

    return True


def ternary_assembling_run(
    min_x1, min_y1, max_x2, max_y2, root_firstcluster, image_opencv_input
):
    # Ternary assembling algorithm runs after the clusters pro function start
    # Define the root block
    root_block = ClusterClass(min_x1, min_y1, max_x2, max_y2)
    root_block.types = "ccluster"

    # Find horizontal and vertical intervals
    x_layout_intervals = []
    y_layout_intervals = []

    # for cluster in clusters:
    # An interval is a uniaxial projection of a rectangle
    for node in root_firstcluster.children:
        x_layout_intervals.append([node.x1, node.x2])
        y_layout_intervals.append([node.y1, node.y2])

    # Suppose we have a collection of intervals, we have to merge all overlapping intervals.
    ob1_x = Partition()
    ob1_x_merged = ob1_x.merge(x_layout_intervals)
    # print("ob1_x_merged", ob1_x_merged, type(ob1_x_merged), len(ob1_x_merged))
    #
    # print(y_layout_intervals)
    ob1_y = Partition()
    ob1_y_merged = ob1_y.merge(y_layout_intervals)
    # print("ob1_y_merged", ob1_y_merged, type(ob1_y_merged), len(ob1_y_merged))

    # Choose if the block horizontal vertical or final
    # horizontal
    if len(ob1_x_merged) >= len(ob1_y_merged):
        root_block.direction = 0

    # vertiical
    if len(ob1_x_merged) < len(ob1_y_merged):
        root_block.direction = 1

    # horizontal y length 1 case
    if len(ob1_x_merged) >= len(ob1_y_merged) and (len(ob1_y_merged) == 1):
        root_block.direction = 1

    # vertiical x length 1 case
    if len(ob1_x_merged) < len(ob1_y_merged) and (len(ob1_x_merged) == 1):
        root_block.direction = 0

    # final
    if (len(ob1_x_merged) == 1) and (len(ob1_y_merged) == 1):
        root_block.direction = 2

    # Prepare the copy of image as overlay before rectangles calculations
    overlay = image_opencv_input.copy()
    # Assign the children based on direction
    if root_block.direction == 0:
        for interval in ob1_y_merged:
            ccluster = ClusterClass(
                min_x1, interval[0], max_x2, interval[1], parent=root_block
            )
            ccluster.types = "ccluster"
            # cv2.rectangle(
            #     image_opencv_input,
            #     (min_x1, interval[0]),
            #     (max_x2, interval[1]),
            #     (70, 50, 135),
            #     -1,
            # )

    if root_block.direction == 1:
        for interval in ob1_x_merged:
            ccluster = ClusterClass(
                interval[0], min_y1, interval[1], max_y2, parent=root_block
            )
            ccluster.types = "ccluster"
            # cv2.rectangle(
            #     image_opencv_input,
            #     (interval[0], min_y1),
            #     (interval[1], max_y2),
            #     (20, 50, 107),
            #     -1,
            # )

    if root_block.direction == 2:
        for interval_x in ob1_x_merged:
            for interval_y in ob1_y_merged:
                ccluster = ClusterClass(
                    interval_x[0],
                    interval_y[0],
                    interval_x[1],
                    interval_y[1],
                    parent=root_block,
                )
                ccluster.types = "ccluster"

    # For the top level (children of the root_block) cclusters only
    # Go through all the top level cclusters obtained after the ternary algorithm
    # Check if there are largest possible non-element firstclusters, fclusters, dbclusters in
    # Attach them to these cclusters
    for node in root_block.children:
        for node1 in root_firstcluster.children:
            # Check if (node1 in node):
            r1_e = (node.x1, node.y1, node.x2, node.y2)
            r2_e = (node1.x1, node1.y1, node1.x2, node1.y2)
            # print("r1_e, r2_e", r1_e, r2_e, node1.element_assigned)
            if contains_rectangle(r1_e, r2_e):
                node1.parent = node

    # Go through all the blocks obtained after the ternary algorithm
    # Split each block
    for pre, fill, node in RenderTree(root_block):
        if node != root_block:
            if node.types in {"ccluster"}:
                blocks_split(node, image_opencv_input, overlay, root_firstcluster)
                # pass

    # It seems possible to split complex dbclusters and re-arrange their child nodes to descendants

    # Ternary assembling algorithm run after the clusters pro function end
    return root_block


def calculate_dbclusters(region_dataset, root_firstcluster):
    # Lists recognized after the manual container annotations are seemed to be filtered automatically
    # Clear the array of dbclusters pro-function start
    dbclusters = []
    # DBSCAN clustering start
    # #############################################################################
    # Create numpy centers array clusters-based start
    centers_array = []
    # DBclusters are calculated on fclusters and single leaves
    # Second order (add later), parents of the final nodes
    for pre, fill, node in RenderTree(root_firstcluster):
        if (node.types == "fcluster") or (node.is_leaf is True):
            # Find the center of cluster
            center_x = (node.x1 + node.x2) / 2
            center_y = (node.y1 + node.y2) / 2
            node.center = center_x, center_y
            centers_array.append(node.center)

    centers = np.array(centers_array)
    # print("centers=", centers)
    # Create numpy centers array clusters-based end

    # Compute DBSCAN for the artificial dataset with 750 samples with data centers
    X, labels_true = make_blobs(
        n_samples=750, centers=centers, cluster_std=0.4, random_state=0
    )

    # Concatenate centers and X next after the make_blobs function
    centers_closest_nodes = []
    for center in centers:
        # Find the closest element from X
        # Map the array of centers with array X
        centers_closest_nodes.append(closest_node(center, X))

    # Fit transform X
    X = StandardScaler().fit_transform(X)

    if region_dataset in ["footers", "webpages"]:
        db = clustermethod.DBSCAN(eps=0.4).fit(X)
        # print("db=", db, X, db.labels_, len(X), len(db.labels_))
        # input()

    if region_dataset == "headers":
        db = clustermethod.DBSCAN(eps=0.55).fit(X)

    core_samples_mask = np.zeros_like(db.labels_, dtype=bool)
    core_samples_mask[db.core_sample_indices_] = True
    labels = db.labels_

    # Number of dbclusters in labels, ignoring noise if present.
    n_clusters_ = len(set(labels)) - (1 if -1 in labels else 0)

    # DBSCAN.labels are included to fclusters and single leaves start
    for pre, fill, node in RenderTree(root_firstcluster):
        if (node.types == "fcluster") or (node.is_leaf is True):
            # Find the center of cluster
            center = node.center
            # DB clusters
            # cv2.rectangle(
            #     image_dbclusters,
            #     (int(center[0]), int(center[1])),
            #     (int(center[0]) + 10, int(center[1]) + 10),
            #     (0, 0, 255),
            #     1,
            # )

            for center_closest_node in centers_closest_nodes:
                # Closest node comparison
                if (center[0] == center_closest_node[1][0]) and (
                    center[1] == center_closest_node[1][1]
                ):
                    node.X = center_closest_node[2]
                    idx = node.idx = center_closest_node[0]
                    node.label = labels[idx]

    # cv2.imshow("dbc", image_dbclusters)
    # cv2.waitKey(0)
    # DBSCAN.labels are included to fclusters end

    # Create dbcluster as a class object
    # Assign children to dbclusters based on centers information
    for n_cluster in range(n_clusters_):
        # Collect all the elements related to some dbcluster to this array
        cluster_sources = []
        dbcluster = ClusterClass(x1=9999, y1=9999, x2=0, y2=0)
        # Set some flags to the dbcluster
        dbcluster.types = "dbcluster"
        dbcluster.processing = (
            "unsplitted"  # check if the ternary algorithm was applied
        )
        # Assign an unordered HTML list to the dbcluster
        dbcluster.element_assigned = "list"
        # Check the direction with some function
        # dbcluster.direction = ?
        # Check later if cluster contains one element only maybe
        # clusters-based solution start
        for pre, fill, node in RenderTree(root_firstcluster):
            if (node.types == "fcluster") or (
                (node.is_leaf is True) and (node.types != "dbcluster")
            ):
                # Why dbclusters are leaves now? This should be corrected
                # Cluster number label
                # print("label:", node.label)
                label = node.label
                if label == n_cluster:
                    cluster_sources.append(node)

        if len(cluster_sources) > 2:  # Filter out too small dbclusters
            for cluster_source in cluster_sources:
                # Construct the dbcluster object
                # Find min max x1 y1 x2 y2
                # dbcluster.elements.append(cluster_source)
                dbcluster.x1 = min(dbcluster.x1, cluster_source.x1)
                dbcluster.y1 = min(dbcluster.y1, cluster_source.y1)
                dbcluster.x2 = max(dbcluster.x2, cluster_source.x2)
                dbcluster.y2 = max(dbcluster.y2, cluster_source.y2)

            # clusters-based solution end
            dbclusters.append(dbcluster)

    # Filtering the dbclusters
    # If dbclusters are overlapped, remove one of them
    # Comparison over 2 elements in list with itertools
    for dbcluster, dbcluster1 in itertools.combinations(dbclusters, 2):
        rect = (dbcluster.x1, dbcluster.y1, dbcluster.x2, dbcluster.y2)
        rect1 = (dbcluster1.x1, dbcluster1.y1, dbcluster1.x2, dbcluster1.y2)
        if isRectangleOverlap(rect, rect1):
            dbclusters.remove(dbcluster1)

    # Remove dbclusters which are contradictive with firstclusters (overlap, contains probably)
    # Remove dbclusters which are contradictive with firstclusters (overlap) start
    dbclusters_removed_indices = set()
    for cluster in dbclusters:
        rectangle_dbcluster = (cluster.x1, cluster.y1, cluster.x2, cluster.y2)
        for pre, fill, node in RenderTree(root_firstcluster):
            rectangle_firstcluster = (node.x1, node.y1, node.x2, node.y2)
            if (node != root_firstcluster) and (not node.is_leaf):
                if isRectangleOverlap(rectangle_dbcluster, rectangle_firstcluster):
                    # print(len(dbclusters), rectangle_dbcluster)
                    dbclusters_removed_indices.add(dbclusters.index(cluster))

    # print( dbclusters_removed_indices)
    for item in sorted(dbclusters_removed_indices, reverse=True):
        del dbclusters[item]
    # Remove dbclusters which are contradictive with firstclusters (overlap) end

    # Place dbclusters to the tree of the root_firstcluster
    for cluster in dbclusters:
        parent_rectangle = root_firstcluster
        rectangle_dbcluster = (cluster.x1, cluster.y1, cluster.x2, cluster.y2)
        larger_rectangles = []
        smaller_rectangles = []
        for pre, fill, node in RenderTree(root_firstcluster):
            rectangle_firstcluster = (node.x1, node.y1, node.x2, node.y2)
            # Find the array of larger rectangles
            if node != root_firstcluster:
                if contains_rectangle(rectangle_firstcluster, rectangle_dbcluster):
                    larger_rectangles.append(node)

        # Find the closest larger rectangle (clr) (1)
        square_rectangle_min = (
            9999999
        )  # Choose a large initial number for the minimal square
        for rectangle in larger_rectangles:
            # First rectangle width and height
            width_rectangle = rectangle.x2 - rectangle.x1
            height_rectangle = rectangle.y2 - rectangle.y1
            square_rectangle = width_rectangle * height_rectangle
            if square_rectangle < square_rectangle_min:
                parent_rectangle = rectangle
                square_rectangle_min = square_rectangle
                print(square_rectangle)

        # Get all the children of the clr.
        # Find that children of the clr, which are in the dbcluster.
        # Now they are children of the dbcluster.
        clr_children = parent_rectangle.children
        # Find the array of smaller rectangles
        for clr_child in clr_children:
            rectangle_clr_child = (
                clr_child.x1,
                clr_child.y1,
                clr_child.x2,
                clr_child.y2,
            )
            if contains_rectangle(rectangle_dbcluster, rectangle_clr_child):
                smaller_rectangles.append(clr_child)

        # Now the dbcluster is a child of (1) and parent of (2)
        cluster.parent = parent_rectangle
        for child in smaller_rectangles:
            child.parent = cluster
            # Assign a list element to the children of the dbcluster
            child.element_assigned = "listItem"
    """
    if len(image_dbclusters):
        for dbcluster in dbclusters:
            # Display dbclusters
            cv2.rectangle(
                image_dbclusters,
                (dbcluster.x1, dbcluster.y1),
                (dbcluster.x2, dbcluster.y2),
                (164, 24, 4),
                1,
            )

        # Printing dbclusters to file
        cv2.imwrite("dbclusters_" + fname, image_dbclusters)
        # Clear the array of dbclusters pro-function end
    """

    return root_firstcluster


# Processing simple elements chains at the level of the firstclusters
def firstclusters_elements_chains_processing(root_firstcluster, fname):
    for pre, fill, node in RenderTree(root_firstcluster):
        # Processing text labels
        if (node.height == 1) and node.element_assigned in {
            "input",
            "select",
            "button",
            "image",
        }:
            # Process only one label, others will be ignored
            for child in node.children:
                if child.element_assigned in {"ocrtext"}:

                    node.placeholder = [child.x1, child.y1, child.x2, child.y2]
                    # Child Node Detach
                    child.parent = None

        # Processing a small images in the text
        if (node.height == 1) and node.element_assigned in {"label", "ocrtext"}:

            for child in node.children:
                if child.element_assigned in {"image"}:
                    node.element_assigned = "container"
                    # Add a processing of this novel container with OCR further

        # Processing a small images in the larger images
        if node.element_assigned in {"image"}:
            # Remove inner images
            for child in node.children:
                if child.element_assigned in {"image"}:

                    # Child Node Detach
                    child.parent = None

        # text -> text
        # Remove a small nested text nodes
        if node.element_assigned in {"label", "ocrtext"}:
            if node.parent.element_assigned in {"label", "ocrtext"}:
                node.parent = None

        # Processing lists
        # Making all the children nodes as listItems
        if node.element_assigned in {"list"}:
            for child in node.children:
                child.element_assigned = "listItem"

    return root_firstcluster


def calculate_fclusters(root_firstcluster):
    # find all the clusters based on cluster-making elements
    # (inputs, selects, buttons, free text blocks, maybe large images)
    # root_cluster = ClusterClass(min_x1, min_y1, max_x2, max_y2, elements=[])
    # clusters = []
    # Cluster: x1, y1, x2, y2, elements[], type(input or select), direction start
    #
    #
    # Vertical clusters input-like with text labels detection
    # The first position is input or select, and the second position is text

    # for idx, recognized_element in enumerate(fdict[fnamesize]["regions"]):
    for pre, fill, node in RenderTree(root_firstcluster):
        if node.element_assigned in {"input", "select", "button"}:
            # Assign the textContent values after grouping with text
            # Vertical group when input or select element has another text element
            # at the distance 0.5 from its width
            # Horizontal group when input or select or text are placed horizontally

            # Loop through all the firstclusters with assigned elements
            # Find all the close-by elements if one of them input (1) or select (4),
            # and second one is the text (3)
            # Horizontal overlap 75% of the element with minimal width
            # Vertical max +- 50% for input/select width,
            # middle of the text element should be within this interval

            # First rectangle coordinates
            x1 = node.x1
            y1 = node.y1
            x2 = node.x2
            y2 = node.y2

            # First rectangle width and height
            width_elem = x2 - x1
            height_elem = y2 - y1

            # for idx1, recognized_element1 in enumerate(fdict[fnamesize]["regions"]):
            for pre, fill, node1 in RenderTree(root_firstcluster):
                if node1.element_assigned in {"text", "ocrtext"}:
                    # Check if the elements were not assigned to the clusters before
                    # if (
                    #         (recognized_element1 not in clr.elements)
                    #         for clr in clusters
                    # ):
                    if node1.parent.types != "fcluster":

                        # Second rectangle coordinates
                        x11 = node1.x1
                        y11 = node1.y1
                        x21 = node1.x2
                        y21 = node1.y2

                        # Second rectangle width
                        width_elem1 = x21 - x11
                        height_elem1 = y21 - y11

                        # Borders of the overlapped area
                        left = max(x1, x11)
                        bottom = max(y1, y11)
                        right = min(x2, x21)
                        top = min(y2, y21)

                        # Size of the overlapped area
                        horizontal_overlap = right - left
                        vertical_overlap = top - bottom

                        # Check if the vertical distance between roi and roi1 is sufficient
                        # Middle of the input or select element
                        mid_input = (y1 + y2) / 2

                        # Middle of the text element
                        mid_text = (y11 + y21) / 2

                        border_bottom = y1 - (0.6 * height_elem)
                        border_top = y2 + (0.4 * height_elem)

                        # Check if the text and input elements are close to each other by vertical direction
                        if (border_bottom < mid_text < mid_input) or (
                            mid_input < mid_text < border_top
                        ):
                            # Assign the results to the vertical_group
                            # Check if the horizontal overlap between text label and input is sufficient
                            if (
                                horizontal_overlap
                                > VERICAL_GROUPS_HORIZONTAL_OVERLAP_THRESHOLD
                                * width_elem1
                            ):

                                # Add the initial element to the cluster
                                # Define some values to this novel cluster
                                cluster = ClusterClass(x1, y1, x2, y2)
                                cluster.types = "fcluster"
                                # Not sure that this assignment is important
                                cluster.parent = node.parent
                                # Fill the cluster
                                # cluster = ClusterClass(min(x1, x11), min(y1, y11), max(x2, x21),
                                # max(y2, y21), elements = [recognized_element, recognized_element1])

                                # Update the cluster with new parent-child relations
                                node.parent = cluster
                                node1.parent = cluster

                                # Set some flags for this vertical fcluster
                                # The cluster contains more than one element

                                # The cluster direction is vertical
                                cluster.direction = 0

                                cluster.x1 = min(cluster.x1, x11)
                                cluster.y1 = min(cluster.y1, y11)
                                cluster.x2 = max(cluster.x2, x21)
                                cluster.y2 = max(cluster.y2, y21)

                                # Find the center of cluster
                                # center_x = (cluster.x1 + cluster.x2) / 2
                                # center_y = (cluster.y1 + cluster.y2) / 2
                                # cluster.center = center_x, center_y

                                # Update the clusters list
                                # clusters.append(cluster)

            # if len(image_fclusters):
            # Display input-based fclusters
            # cv2.rectangle(
            #     image_fclusters,
            #     (cluster.x1, cluster.y1),
            #     (cluster.x2, cluster.y2),
            #     (0, 0, 255),
            #     1,
            # )
            # cv2.imshow(window_name1, image_opencv_input)
            # cv2.waitKey(0)

    # Cluster: x1, y1, x2, y2, elements[], type(input or select), direction end

    # Clusters checkboxes with text labels direction start
    #
    #
    # Horizontal clusters checkbox-like with text labels detection
    # The first position is a checkbox or radiobutton or even the small image,
    # and the second position is text
    # for idx, recognized_element in enumerate(fdict[filenamesize]["regions"]):
    for pre, fill, node in RenderTree(root_firstcluster):
        if node.element_assigned in {
            "input",
            "select",
            "button",
            "checkbox",
            "radiobutton",
            "image",
        }:
            # Horizontal group when checkbox or radiobutton element has another text element
            # at the distance 0.8 from its width

            # Loop through all the elements recognized
            # Find all the close-by elements if one of them is a checkbox or radiobutton,
            # and second one is the text (3)
            # Vertical overlap 75% of the element with minimal width
            # Horizontal min/max +- 80% for checkbox/radiobutton width,
            # start/end of the text element should be within this interval

            # First rectangle coordinates
            x1 = node.x1
            y1 = node.y1
            x2 = node.x2
            y2 = node.y2

            # First rectangle width and height
            width_elem = x2 - x1
            height_elem = y2 - y1

            for pre, fill, node1 in RenderTree(root_firstcluster):
                if node1.element_assigned in {"text", "ocrtext"}:
                    # Check if the elements were not assigned to the clusters before
                    if node1.parent.types != "fcluster":

                        # Second rectangle coordinates
                        x11 = node1.x1
                        y11 = node1.y1
                        x21 = node1.x2
                        y21 = node1.y2

                        # Second rectangle width
                        width_elem1 = x21 - x11
                        height_elem1 = y21 - y11

                        # Borders of the overlapped area
                        left = max(x1, x11)
                        bottom = max(y1, y11)
                        right = min(x2, x21)
                        top = min(y2, y21)

                        # Size of the overlapped area
                        horizontal_overlap = right - left
                        vertical_overlap = top - bottom

                        # Middle of the checkbox or radiobutton element
                        mid_checkbox = (x1 + x2) / 2

                        # Borders of the text element
                        left_text = x11
                        right_text = x21

                        border_left = x1 - (0.6 * height_elem)
                        border_right = x2 + (0.8 * height_elem)

                        # Check if the text and checkbox elements are close to each other
                        # by horizontal direction
                        if (border_left < right_text < mid_checkbox) or (
                            mid_checkbox < left_text < border_right
                        ):
                            # Assign the results to the horizontal group
                            # Check if the vertical overlap between text label and input is sufficient
                            if (
                                vertical_overlap
                                > HORIZONTAL_GROUPS_VERTICAL_OVERLAP_THRESHOLD
                                * height_elem1
                            ):
                                # Add the initial element to the cluster
                                # Define some values to this novzel cluster
                                cluster = ClusterClass(x1, y1, x2, y2)
                                cluster.types = "fcluster"
                                # Not sure that this assignment is important
                                cluster.parent = node.parent
                                # Fill the cluster
                                # cluster = ClusterClass(min(x1, x11), min(y1, y11), max(x2, x21),
                                # max(y2, y21), elements = [recognized_element, recognized_element1])

                                # Update the cluster with new parent-child relations
                                node.parent = cluster
                                node1.parent = cluster

                                # Set some flags for this horizontal fcluster
                                # The cluster contains more than one element
                                # The cluster direction is horizontal
                                cluster.direction = 1

                                cluster.x1 = min(cluster.x1, x11)
                                cluster.y1 = min(cluster.y1, y11)
                                cluster.x2 = max(cluster.x2, x21)
                                cluster.y2 = max(cluster.y2, y21)

                                # Find the center of cluster
                                center_x = (cluster.x1 + cluster.x2) / 2
                                center_y = (cluster.y1 + cluster.y2) / 2
                                cluster.center = center_x, center_y

                                # Update the clusters list
                                # clusters.append(cluster)

            # if len(image_fclusters):
            # Display checkbox-based fclusters
            # cv2.rectangle(
            #     image_fclusters,
            #     (cluster.x1, cluster.y1),
            #     (cluster.x2, cluster.y2),
            #     (144, 12, 2),
            #     1,
            # )
    # if len(image_fclusters):
    # Printing fclusters to file
    # cv2.imwrite("fclusters_" + fname, image_fclusters)
    # Clusters checkboxes with text labels direction end

    return root_firstcluster


# This function extracts rectangle from some fdict regions
def extract_rectangle_coordinates(rect):

    x1 = rect["shape_attributes"]["x"]
    y1 = rect["shape_attributes"]["y"]
    x2 = rect["shape_attributes"]["x"] + rect["shape_attributes"]["width"]
    y2 = rect["shape_attributes"]["y"] + rect["shape_attributes"]["height"]

    return (x1, y1, x2, y2)


# For some rectangle. Go through all the rectangles in (calculate this on the fly).
# Find rectangles without parents, they are level rectangles. Create firstclusters for them.
# Repeat the process (the function is recursive)
def recursive_firstclusters(rectangles, firstcluster):
    level_blocks = firstcluster.level_blocks
    # print(level_blocks)
    # input()
    for level_block in level_blocks:
        next_level_blocks = []
        for r1 in rectangles:
            # Check if r1 in level_block
            r1_e = extract_rectangle_coordinates(r1)
            level_block_e = extract_rectangle_coordinates(level_block)
            # print(r1_e, level_block_e)
            if (contains_rectangle(level_block_e, r1_e) is True) and (
                level_block_e != r1_e
            ):
                # print("contains_rectangle")
                is_parent = False
                is_final = True
                for r2 in rectangles:
                    # Check if r2 in level_block
                    r2_e = extract_rectangle_coordinates(r2)
                    # print(level_block_e, r2_e)
                    if (contains_rectangle(level_block_e, r2_e) is True) and (
                        level_block_e != r2_e
                    ):
                        # print("is_not_final")
                        # find rectangles without parents
                        # Check if r2 in r1
                        # if contains_rectangle(r2_e, r1_e) is False:
                        if (contains_rectangle(r1_e, r2_e) is True) and (r1_e != r2_e):
                            # print(level_block_e, r1_e, r2_e)
                            # print("is_parent")
                            is_parent = True
                            is_final = False

                        # Check if r1 is placed in r2
                        if (contains_rectangle(r2_e, r1_e) is True) and (r1_e != r2_e):
                            # print(level_block_e, r1_e, r2_e)

                            # Check if it is a parent for the level of interest
                            # Double false means that the block of interest is from the next level
                            # print("is_parent")
                            is_parent = False
                            is_final = False

                print(is_parent, is_final)
                # Extend the set of the next level blocks
                if is_parent is True:
                    # print("r1=", r1)
                    next_level_blocks.append(r1)
                    # print(*r1_e)
                    next_level_block_firstcluster = ClusterClass(*r1_e)
                    next_level_block_firstcluster.types = "firstcluster"
                    next_level_block_firstcluster.parent = firstcluster
                    next_level_block_firstcluster.element_assigned = r1[
                        "region_attributes"
                    ]["HTML element"]
                    next_level_block_firstcluster.level_blocks = next_level_blocks

                    (x1, y1, x2, y2) = r1_e
                    # cv2.rectangle(
                    #     image_firstclusters,
                    #     (x1, y1),
                    #     (x2, y2),
                    #     (20, 90, 255),
                    #     1,
                    # )
                    recursive_firstclusters(rectangles, next_level_block_firstcluster)
                elif is_final is True:
                    # print("r1=", r1)
                    print(*r1_e)
                    next_level_block_firstcluster = ClusterClass(*r1_e)
                    next_level_block_firstcluster.types = "firstcluster"
                    next_level_block_firstcluster.element_assigned = r1[
                        "region_attributes"
                    ]["HTML element"]
                    next_level_block_firstcluster.parent = firstcluster

                    (x1, y1, x2, y2) = r1_e
                #     cv2.rectangle(
                #         image_firstclusters,
                #         (x1, y1),
                #         (x2, y2),
                #         (100, 80, 155),
                #         1,
                #     )
                # print(x1, y1, x2, y2)
            # cv2.imshow("window_name1", image_firstclusters)
            # cv2.waitKey(0)

    return True


def calculate_firstclusters(fdict, fname, fnamesize, img_height, img_width):
    # img_height, img_width, img_channels = image_firstclusters.shape
    # print(image_firstclusters.shape)
    # Detect top level blocks
    top_level_blocks = []
    # top_level_block is a nested dictionary
    top_level_block = {}
    top_level_block["shape_attributes"] = {}
    top_level_block["shape_attributes"]["x"] = 0
    top_level_block["shape_attributes"]["y"] = 0
    top_level_block["shape_attributes"]["width"] = img_width
    top_level_block["shape_attributes"]["height"] = img_height

    top_level_blocks.append(top_level_block)

    # Create a set of rectangles
    rectangles = []
    for rect in fdict[fnamesize]["regions"]:
        # The commented if- statement is used for calculation of the menu
        # if (rect["region_attributes"]["HTML element"] in {"container", "list"}):
        # Now all the rectangles are processed. They should be prepared properly.
        rectangles.append(rect)

    # Create a top level firstcluster based on whole image size
    # This top block should not be displayed at the final output
    # Top levels blocks should be included for this data structure
    top_level_block_e = extract_rectangle_coordinates(top_level_block)
    root_firstcluster = ClusterClass(*top_level_block_e)
    root_firstcluster.types = "firstcluster"
    root_firstcluster.level_blocks = top_level_blocks

    # For some rectangle. Go through all the rectangles in. Find rectangles without parents, they are level rectangles.
    # Save sets of rectangles placed for each level rectangle. Repeat the process.

    recursive_firstclusters(rectangles, root_firstcluster)

    # Printing firstclusters to file
    # if len(image_firstclusters):
    #     imgpath = MEDIA_ROOT + "/uploads/" + "firstclusters_" + fname
    #     cv2.imwrite(imgpath, image_firstclusters)
    #     node.parameters["image"] = "firstclusters_" + fname

    return root_firstcluster


def print_clusters_length(root_firstcluster):
    for pre, fill, node in RenderTree(root_firstcluster):
        # Print clusters start
        print(node.types, node.element_assigned)
        # Print clusters end
        return True
    else:
        return False


def supplement_fdict_calc_printing(fdict, fnamesize, img_width, img_height):
    # Supplementary parameters calculation and printing of the fdict start
    # Detect the size of the visible elements region
    # detect the size of the visible elements
    # first do this based on annotated regions
    # go through all the regions
    # find xmin, xmax, ymin, ymax
    # compare this rectangle of visible elements with whole image
    # crop if the distance is more than 20px
    # extend borders if the distance is less than 20px
    # Cropping the image is essential for further OCR applying.
    min_x1 = img_width
    min_y1 = img_height
    max_x2 = 0
    max_y2 = 0

    for idx, region in enumerate(fdict[fnamesize]["regions"]):
        x1 = int(region["shape_attributes"]["x"])
        y1 = int(region["shape_attributes"]["y"])
        x2 = int(x1 + region["shape_attributes"]["width"])
        y2 = int(y1 + region["shape_attributes"]["height"])

        if min_x1 > x1:
            min_x1 = x1

        if min_y1 > y1:
            min_y1 = y1

        if max_x2 < x2:
            max_x2 = x2

        if max_y2 < y2:
            max_y2 = y2

    # Find the centers of the elements
    # for idx, region in enumerate(fdict[filenamesize]["regions"]):
    for idx, region in enumerate(fdict[fnamesize]["regions"]):
        x1 = int(region["shape_attributes"]["x"])
        y1 = int(region["shape_attributes"]["y"])
        x2 = int(x1 + region["shape_attributes"]["width"])
        y2 = int(y1 + region["shape_attributes"]["height"])

        # Extend shape_attributes with average values for centers
        x_average = int((x1 + x2) / 2)
        y_average = int((y1 + y2) / 2)
        region["shape_attributes"]["x_average"] = x_average
        region["shape_attributes"]["y_average"] = y_average

    # Supplementary parameters calculation and printing of the fdict end
    return min_x1, min_y1, max_x2, max_y2


def print_maskrcnn_output(
    region_dataset,
    image_maskrcnn_notext,
    fname,
    fnamesize,
    r,
    cnndict,
    element,
    image_maskrcnn,
):
    # Printing the pure Mask R CNN output without text blocks recognized
    for idx1, (rect1, class_id1) in enumerate(zip(r["rois"], r["class_ids"])):
        #  1,2,4,5,7 means elements except the text class and the radiobutton while merging forms
        if (
            ((region_dataset == "forms") and (class_id1 in {1, 2, 4, 5, 7}))
            or ((region_dataset == "footers") and (class_id1 in {2, 3, 4, 5}))
            or ((region_dataset == "headers") and (class_id1 in {2, 3, 4, 5, 6, 7, 8}))
        ):
            x3 = rect1[1]
            y3 = rect1[0]
            x4 = rect1[3]
            y4 = rect1[2]

            cv2.rectangle(image_maskrcnn_notext, (x3, y3), (x4, y4), (255, 100, 255), 1)
            # Put the class id as a label. Keep in mind, that this label will be different for the specific block types
            cv2.putText(
                image_maskrcnn_notext,
                str(class_id1),
                (x3, y4),
                cv2.FONT_HERSHEY_SIMPLEX,
                0.6,
                (36, 255, 12),
                2,
            )

    cv2.imwrite("maskrcnn_notext_" + fname, image_maskrcnn_notext)


def print_fdict_before(image_opencv_input, fname, fdict, fnamesize):
    print("fdict_before", fdict)
    image_fdict_before = copy.deepcopy(image_opencv_input)
    for idx, region in enumerate(fdict[fnamesize]["regions"]):
        x1 = int(region["shape_attributes"]["x"])
        y1 = int(region["shape_attributes"]["y"])
        x2 = int(x1 + region["shape_attributes"]["width"])
        y2 = int(y1 + region["shape_attributes"]["height"])

        if len(image_fdict_before):
            # Show VIA annotated regions on image
            cv2.rectangle(image_fdict_before, (x1, y1), (x2, y2), (255, 0, 0), 1)

    # Printing image_fdict_before to file
    if len(image_fdict_before):
        imgpath = MEDIA_ROOT + "/uploads/" + "fdict_before_" + fname
        cv2.imwrite(imgpath, image_fdict_before)


def print_clusters(
    clusters_name, image_opencv_input, root_firstcluster, SAVE_DIR, fname
):
    image_clusters = copy.deepcopy(image_opencv_input)
    for pre, fill, node in RenderTree(root_firstcluster):
        node.x1 = int(node.x1)
        node.x2 = int(node.x2)
        node.y1 = int(node.y1)
        node.y2 = int(node.y2)
        treestr = u"%s%s" % (pre, node.name)
        print(
            treestr.ljust(8),
            node.element_assigned,
            node.types,
            node.direction,
            (node.x1, node.y1),
            (node.x2, node.y2),
        )
        cv2.rectangle(
            image_clusters, (node.x1, node.y1), (node.x2, node.y2), (20, 50, 107), 1
        )
        label_element = str(node.element_assigned)
        # Keep in mind, that this label will be different for the specific block types
        cv2.putText(
            image_clusters,
            label_element,
            (node.x1, node.y2),
            cv2.FONT_HERSHEY_SIMPLEX,
            0.5,
            (36, 255, 12),
            2,
        )

    # Printing the image of the clusters to file
    if len(image_clusters):
        imgpath = SAVE_DIR + "/" + clusters_name + fname
        print(SAVE_DIR)
        print(imgpath)

        cv2.imwrite(imgpath, image_clusters)


def htmltree_initialize(fname, bcolour_container_value, img_width, img_height, imgpath, SAVE_DIR):
    root = ET.Element("html", version="5.0")
    # Передайте родительский узел, имя дочернего узла,
    # и любое количество дополнительных атрибутов
    html_head = ET.SubElement(root, "head")
    html_title = ET.SubElement(root, "title")
    html_title.text = "Title, " + fname
    html_body = ET.SubElement(root, "body")

    # Define the outer container parameters
    outer_div = ET.SubElement(html_body, "div")

    styles = {}
    parameters = {}
    # styles["background-color"] = "rgba(" + bcolour_container_value + ")"
    # Set the background image
    print("fname", fname)
    input_image_name = imgpath

    # Add this to view a processed image containing clusters with elements
    clustersel_image_name =  SAVE_DIR + "/allclusters_with_elements_" + fname

    styles["background"] = "url(" + input_image_name + ") no-repeat center"
    styles["background"] = "url(" + clustersel_image_name + ") no-repeat center"
    # The magic number 30 to solve presence of wide elements have been measured with px
    # styles["width"] = str(img_width + 30) + "px"
    # For the pixel perfect floating solutions
    styles["display"] = "inline-block"
    styles["min-width"] = str(img_width) + "px"
    styles["height"] = str(img_height) + "px"
    styles["border"] = "5px solid rgba(52, 74, 240, 0.9)"
    str_styles = "; ".join("{}:{}".format(key, val) for key, val in styles.items())
    outer_div.set("style", str_styles)
    return root, outer_div, styles, parameters


def calculate_margins(node):
    # Calculate margins for vertically stacked items start
    margin_bottom = 0
    margin_left = 0

    # Extract siblings
    siblings = node.siblings
    print(node.parent.direction, "direction")

    # A vertical case
    if node.parent.direction == 0:
        # Check if the node has the first order, the last order, or the node is internal, extract node.siblings
        # previous_sibling_y1 is calculated for a parent node, if the node has the first order
        # next_sibling_y2 is calculated for a parent node, if the node has the last order
        array_siblings_y1_min = 0
        try:
            array_siblings_y1 = min(siblings, key=lambda i: abs(i.y1 - node.y2))
            array_siblings_y1_min = min((array_siblings_y1.y1 - node.y2), (node.parent.y2 - node.y2))
        except Exception:
            pass
        """
        print(node.parent.direction, " direction ", len(siblings), " siblings")
        print("compare: ", node.y2, array_siblings_y1.y1)
        for sibling in siblings:
            print("y1, 2: ", sibling.y1, sibling.y2)

        print("margin:", array_siblings_y1_min)
        """
        # Filter out negative margins
        if array_siblings_y1_min > 0:
            margin_bottom = array_siblings_y1_min

    # A horizontal case
    if node.parent.direction == 1:
        array_siblings_x1 = min(siblings, key=lambda i: abs(node.x1 - i.x2))
        array_siblings_x1_min = min((node.x1 - array_siblings_x1.x2), (node.x1 - node.parent.x1))

        '''
        print(node.parent.direction, " direction ", len(siblings), " siblings")
        print("compare: ", node.x1, array_siblings_x1.x2)
        for sibling in siblings:
            print("x1, 2: ", sibling.x1, sibling.x2)

        print("margin:", array_siblings_x1_min)
        '''

        # Filter out positive margins
        if array_siblings_x1_min > 0:
            margin_left = array_siblings_x1_min

    # A final case
    if node.parent.direction == 2:
        array_siblings_y1_min = node.parent.y2 - node.y2
        array_siblings_x1_min = node.x1 - node.parent.x1

        # Filter out positive margins
        if array_siblings_x1_min > 0:
            margin_left = array_siblings_x1_min

        # Filter out positive margins
        if array_siblings_y1_min > 0:
            margin_bottom = array_siblings_y1_min

    return margin_bottom, margin_left
    # Calculate margins for vertically stacked items end


def extract_colour_palette(elem_image):
    # Extract a color palette start
    # Get the dominant colour for the element start
    try:
        domcolour_elem = get_dominant_colour(elem_image)[0]
        domcolour_elem.append(1)
        bcolour_elem_value = ",".join(str(int(x)) for x in domcolour_elem)
    # Get the dominant colour for the element end
    except Exception:
        bcolour_elem_value = "255,255,255,0"
    finally:
        pass

    # Get the font colour for the element start
    try:
        fcolour_elem = get_dominant_colour(elem_image)[1]
        fcolour_elem.append(1)
        fcolour_elem_value = ",".join(str(int(x)) for x in fcolour_elem)
    except Exception:
        fcolour_elem_value = "91,91,91,0"
    finally:
        pass
    # Get the font colour for the element end
    # Extract a color palette end

    return bcolour_elem_value, fcolour_elem_value


# A text detection with google cloud vision
def detect_text_gcv(path):
    """Detects text in the file."""
    client = vision.ImageAnnotatorClient()

    # with io.open(path, 'rb') as image_file:
    #     content = image_file.read()
    # image = types.Image(content=cv2.imencode('.jpg', img)[1].tostring())

    image = vision.Image(content=cv2.imencode(".jpg", path)[1].tostring())

    response = client.text_detection(image=image)
    texts = response.text_annotations

    if response.error.message:
        raise Exception(
            "{}\nFor more info on error messages, check: "
            "https://cloud.google.com/apis/design/errors".format(response.error.message)
        )
    if texts:
        return texts[0].description
    else:
        return ""


def ocr_recognition(elem_image, ocr_engine="tesseract"):
    font_size_value = 14
    alltext_width = 0
    alltext_height = 0
    leftmin = 0
    maxright = 0
    text_elem_ocr = ""

    # Detect the font-size with tesseract for some element start
    if ocr_engine == "tesseract":
        # Convert to the grey colour
        elem_image_gray = cv2.cvtColor(elem_image, cv2.COLOR_BGR2GRAY)
        elem_image_gray = cv2.resize(elem_image_gray, None, fx=4, fy=4)
        result = pytesseract.image_to_boxes(elem_image_gray)

        lines = result.strip().split("\n")
        font_size = []

        # Calculate the number of letters recognized in lines:
        length_lines = len(lines)
        if length_lines > 7:
            # Calculate the average x-size for the long lines
            for line in lines:
                chars = line.split(" ")
                try:
                    font_size.append(float(chars[4]) - float(chars[2]))
                except Exception:
                    pass

        # Calculate the average x-size for the short lines
        else:
            for line in lines:
                chars = line.split(" ")
                xsize_chars = {
                    "v",
                    "w",
                    "z",
                    "a",
                    "c",
                    "e",
                    "m",
                    "n",
                    "o",
                    "r",
                    "s",
                    "u",
                }
                if chars[0] in xsize_chars:
                    # print(chars[0])
                    try:
                        font_size.append(float(chars[4]) - float(chars[2]))
                    except Exception:
                        pass

        try:
            # Filter out errors of recognition with median_low.
            # Probably should switch to quantiles with next statistics Python versions
            font_size_value = median_low(font_size)[0] * 1.9 / 4.0
        except Exception:
            font_size_value = 14.0
        finally:
            pass

        font_size_value = int(font_size_value)

        # Read a string with tesseract
        text_elem_tesseract = pytesseract.image_to_string(
            elem_image_gray, config=config_tesseract
        )
        # Show tesseract results only when font is larger than 14
        if font_size_value < 14:
            text_elem_tesseract = ""

        text_elem_ocr = text_elem_tesseract
    # Detect the font-size with tesseract for some element end

    # Detect the font-size with tesseract for some element start, with lorem text
    if ocr_engine == "lorem":
        # Convert to the grey colour
        elem_image_gray = cv2.cvtColor(elem_image, cv2.COLOR_BGR2GRAY)
        elem_image_gray = cv2.resize(elem_image_gray, None, fx=4, fy=4)
        result = pytesseract.image_to_boxes(elem_image_gray)

        lines = result.strip().split("\n")
        font_size = []

        # Calculate the number of letters recognized in lines:
        length_lines = len(lines)
        if length_lines > 7:
            # Calculate the average x-size for the long lines
            for line in lines:
                chars = line.split(" ")
                try:
                    font_size.append(float(chars[4]) - float(chars[2]))
                except Exception:
                    pass

        # Calculate the average x-size for the short lines
        else:
            for line in lines:
                chars = line.split(" ")
                xsize_chars = {
                    "v",
                    "w",
                    "z",
                    "a",
                    "c",
                    "e",
                    "m",
                    "n",
                    "o",
                    "r",
                    "s",
                    "u",
                }
                if chars[0] in xsize_chars:
                    # print(chars[0])
                    try:
                        font_size.append(float(chars[4]) - float(chars[2]))
                    except Exception:
                        pass

        try:
            # Filter out errors of recognition with median_low.
            # Probably should switch to quantiles with next statistics Python versions
            font_size_value = median_low(font_size)[0] * 1.9 / 4.0
        except Exception:
            font_size_value = 14.0
        finally:
            pass

        font_size_value = int(font_size_value)

        # Read a string with tesseract
        text_elem_lorem = lorem.get_word(count=2)
        # Show tesseract results only when font is larger than 14
        # if font_size_value < 14:
        #     text_elem_tesseract = ""

        text_elem_ocr = text_elem_lorem
        # Detect the font-size with tesseract for some element end, with lorem text

    # Detect the font-size with tesseract for some element, with gcv text start
    if ocr_engine == "googlecloud":
        # Convert to the grey colour
        elem_image_gray = cv2.cvtColor(elem_image, cv2.COLOR_BGR2GRAY)
        elem_image_gray = cv2.resize(elem_image_gray, None, fx=4, fy=4)
        result = pytesseract.image_to_boxes(elem_image_gray)

        lines = result.strip().split("\n")
        font_size = []

        # Calculate the number of letters recognized in lines:
        length_lines = len(lines)
        if length_lines > 7:
            # Calculate the average x-size for the long lines
            for line in lines:
                chars = line.split(" ")
                try:
                    font_size.append(float(chars[4]) - float(chars[2]))
                except Exception:
                    pass

        # Calculate the average x-size for the short lines
        else:
            for line in lines:
                chars = line.split(" ")
                xsize_chars = {
                    "v",
                    "w",
                    "z",
                    "a",
                    "c",
                    "e",
                    "m",
                    "n",
                    "o",
                    "r",
                    "s",
                    "u",
                }
                if chars[0] in xsize_chars:
                    # print(chars[0])
                    try:
                        font_size.append(float(chars[4]) - float(chars[2]))
                    except Exception:
                        pass

        try:
            # Filter out errors of recognition with median_low.
            # Probably should switch to quantiles with next statistics Python versions
            font_size_value = median_low(font_size)[0] * 1.9 / 4.0
        except Exception:
            font_size_value = 14.0
        finally:
            pass

        font_size_value = int(font_size_value)

        # Read a string with gcv
        text_elem_gcv = detect_text_gcv(elem_image_gray)
        # Show tesseract results only when font is larger than 14
        # if font_size_value < 14:
        #     text_elem_tesseract = ""

        text_elem_ocr = text_elem_gcv
        # Detect the font-size with tesseract for some element, with gcv text end

    # Out of the choices. Getting the bounding box of the recognized words start
    d = pytesseract.image_to_data(elem_image_gray, output_type=Output.DICT)
    n_boxes = len(d['level'])
    # print("d", n_boxes, d)
    # input()
    if n_boxes > 1:
        for i in range(n_boxes):
            if (d['text'][i]):  # Choose only the text detected rows
                # Initialization from the first array object containing the text
                (left_min, top_min, width, height) = (d['left'][i], d['top'][i], d['width'][i], d['height'][i])
                max_right = left_min + width
                max_bottom = top_min + height

        for i in range(n_boxes):
            if (d['text'][i]):  # Choose only the text detected rows
                # print("i=", i)
                (x, y, w, h) = (d['left'][i], d['top'][i], d['width'][i], d['height'][i])
                right = x + w
                bottom = y + h

                if x < left_min:
                    left_min = x

                if y < top_min:
                    top_min = y

                if right > max_right:
                    max_right = right

                if bottom > max_bottom:
                    max_bottom = bottom

                # Detect width and height for the complete sentence or paragraph
                # 4 is the correction number, because the image was scaled before for this number
                alltext_width = int((max_right - left_min) / 4.0)
                # print("alltext_width=", alltext_width)
                alltext_height = int((max_bottom - top_min) / 4.0)
                # print("alltext_width=", alltext_width, "alltext_height=", alltext_height)
                leftmin = int((left_min) / 4.0)
                maxright = int((max_right) / 4.0)
                # cv2.rectangle(elem_image_gray, (x, y), (x + w, y + h), (0, 255, 0), 2)
                '''
                # print(left_min, top_min, max_right, max_bottom, d['text'][i])
                cv2.rectangle(elem_image_gray, (left_min, top_min), (max_right, max_bottom), (0, 255, 0), 2)
                cv2.imshow('img', elem_image_gray)
                cv2.waitKey(0)
                '''
    # Getting the bounding box of the recognized words end

    return font_size_value, text_elem_ocr, alltext_width, leftmin, maxright, alltext_height


# Create the elements for the elements_rootblock function
def process_children(node):
    if node.children:
        levelchildren = node.children
        # calculate margins for the group of the blocks

        # recursion
        for child in levelchildren:
            print(child.buoyancy, node.direction, child, node)
            process_children(child)

    else:
        print(node.buoyancy, node.direction, node, "the leave")
        # pass
        # calculate margins for the single block

    return True


# Detect elements for the root block function
def elements_rootblock(
    root_block,
    styles_on,
    region_dataset,
    img_width,
    img_height,
    outer_div,
    image_opencv_input,
    fname,
    o,
    serializing="virtualize_simple",
    node_width=0,
    node_height=0,
):

    image_original = copy.deepcopy(image_opencv_input)
    # A function elements creation, loop through the root_block
    # process_children(root_block)

    # A simple tree rendering should be changed to more complex solutions to calculate margins
    for pre, fill, node in RenderTree(root_block):
        node.styles = {}
        node.parameters = {}

        # Calculate values for the freecanvas displaying:
        node.parameters["freeCanvas"] = {}

        node.parameters["freeCanvas"]["zIndex"] = 0
        node.parameters["freeCanvas"]["width"] = node_width
        node.parameters["freeCanvas"]["height"] = node_height
        node.parameters["freeCanvas"]["left"] = int(node.x1)
        node.parameters["freeCanvas"]["top"] = int(node.y1)

        # Define the node dimensions start
        node_width = int(node.x2 - node.x1)
        node_height = int(node.y2 - node.y1)
        # Define the node dimensions end

        # Sometimes node_width and height are 0, should check this.
        if node_width:
            node.styles["width"] = str(node_width) + "px"
        if node_height:
            node.styles["height"] = str(node_height) + "px"

        # Choose the layout styling
        # From the {"float", "flexbox", "grid"}
        layout_styling = "float"

        if layout_styling == "float" and (node != root_block):
            # Define the direction of the container start
            # Horizontal
            if node.parent.direction == 1:
                node.styles["display"] = "inline-block"
                # node.styles["display"] = "block"
                # node.styles["float"] = "left"
                # node.styles["clear"] = "both"
                node.parent.styles["white-space"] = "nowrap"
                # print(node.parent.styles)
                # input()

            # Vertical
            elif node.parent.direction == 0:
                node.styles["display"] = "block"
            # Inseparable
            elif node.parent.direction == 2:
                node.styles["display"] = "block"
            # Other cases (the direction was not defined)
            else:
                node.styles["display"] = "block"
            # Define the direction of the container end

        elif layout_styling == "flexbox":
            # Define the direction of the container start
            # Horizontal
            if node.direction == 1:
                node.styles["display"] = "flex"
                if not styles_on:
                    node.styles["background"] = "aliceblue"
                if region_dataset in ["headers", "footers"]:
                    node.styles["justify-content"] = "space-between"
            # Vertical
            elif node.direction == 0:
                node.styles["display"] = "block"
                if not styles_on:
                    node.styles["background"] = "lavenderblush"
            # Inseparable
            elif node.direction == 2:
                node.styles["display"] = "flex"
                if (node.types == "ccluster") or (
                    region_dataset in ["headers", "webpages"]
                ):

                    if not styles_on:
                        node.styles["background"] = "lightblue"
                else:

                    if not styles_on:
                        node.styles["background"] = "lightgreen"
                    # Sometimes node_width and height are 0, should check this.
                    if node_width:
                        node.styles["width"] = str(node_width) + "px"
                    if node_height:
                        node.styles["height"] = str(node_height) + "px"
            # Define the direction of the container end

        if node == root_block:
            # print("img_width, img_height, node_width, node.x1, node.y1, node.x2, node.y2", img_width, img_height, node_width, node.x1, node.y1, node.x2, node.y2)
            # input()
            # margin_lr = int((img_width - node_width) / 2)
            # margin_tp = int((img_height - node_height) / 2)
            margin_l = int((node.x1))
            margin_r = int((img_width - node.x2))
            margin_t = int((node.y1))
            margin_b = int((img_height - node.y2))
            node.div = ET.SubElement(outer_div, "div")
            node.styles["outline"] = "1px solid lightgreen"
            # node.styles["margin"] = str(margin_tp) + "px " + str(margin_lr) + "px"
            # Two margins of four are redundant
            node.styles["margin-left"] = str(margin_l) + "px "
            # node.styles["margin-right"] = str(margin_r) + "px "
            node.styles["margin-top"] = str(margin_t) + "px "
            # node.styles["margin-bottom"] = str(margin_b) + "px "
            node.buoyancy = 0

            str_styles = "; ".join(
                "{}:{}".format(key, val) for key, val in node.styles.items()
            )
            node.div.set("style", str_styles)
            node.div.set("buoyancy", "0")
            # node.parameters["textContent"] = ""

        else:
            # Calculate margins for vertically and horizontally stacked items
            margin_bottom, margin_left = calculate_margins(node)
            print(node.element_assigned, node.types, margin_bottom, margin_left)
            # input()
            node.styles["margin-bottom"] = str(margin_bottom) + "px"
            node.styles["margin-left"] = str(margin_left) + "px"


            # str_styles = "; ".join(
            #     "{}:{}".format(key, val) for key, val in node.styles.items()
            # )

            # To display for the debug
            # node.styles_fordebug = str_styles

            # Buoyancy detection start
            # Horizontal
            if node.parent.direction == 1:
                node.buoyancy = int(node.x1)
            # Vertical
            elif node.parent.direction == 0:
                node.buoyancy = int(node.y1)
            # Other cases
            else:
                node.buoyancy = int(node.x1)
            # Buoyancy detection end

            node.parameters["textContent"] = ""

            if not node.element_assigned:
                node.element_assigned = "div"
                # node.div = ET.SubElement(node.parent.div, "div")
                # node.div.set("style", str_styles)
                # node.div.set("buoyancy", str(node.buoyancy))

        '''
        # Correct the struct_type based on the element_assigned value
        # The correction is actual for dbclusters
        # ul li detection
        if node.element_assigned:
            node.scenarioelement_kwargs["struct_type"] = node.element_assigned
            # print(node.element_assigned)
        '''

        if serializing in {"virtualize_simple", "assemble"}:
            # Define the element dimensions start
            # Rectangle width and height
            elem_width = node.x2 - node.x1
            elem_height = node.y2 - node.y1
            # Rectangle coordinates
            x1 = node.x1  # Left coordinate
            y1 = node.y1
            # Define the element dimensions end

            # Cropping to the border box start
            elem_image = image_original[y1: y1 + elem_height, x1: x1 + elem_width]
            elem_image_name = uuid.uuid4().hex + fname
            # Cropping to the border box end

            # Detect the font-size with tesseract for some elements
            font_size_value = 14.0
            text_width = 0
            text_leftc = 0
            text_rightc = 0
            if node.element_assigned in {
                "textinput",
                "input",
                "select",
                "text",
                "ocrtext",
                "textarea",
                "form_heading",
                "button",
                "li",
                "listItem",
            }:
                # Defiine a scenarioelement_inner dictionary
                scenarioelement_inner_kwargs = {}
                # A choice for ocr_engine is {"tesseract", "lorem", "googlecloud"}
                font_size_value, text_elem_ocr, text_width, text_leftc, text_rightc, alltext_height = ocr_recognition(
                    elem_image, ocr_engine="tesseract"
                )

            node.styles["text-transform"] = "none"
            node.styles["font-size"] = font_size_value

            bcolour_elem_value, fcolour_elem_value = extract_colour_palette(elem_image)

            if node.element_assigned in {"textinput", "input"}:
                node.styles["max-width"] = str(node_width) + "px"
                node.styles["min-height"] = str(node_height) + "px"

                # Text assignment
                if text_elem_ocr:
                    node.parameters["textContent"] = text_elem_ocr

                # Paddings calculations block
                if text_elem_ocr:
                    padding_top = padding_bottom = int((node_height - font_size_value) / 2.0)
                else:
                    padding_top = padding_bottom = 3 # A default value when the text is not at the input

                if (text_leftc - node.x1) > 0:
                    # padding = int(text_leftc - node.x1)
                    padding_left = int(text_leftc - node.x1)
                else:
                    padding_left = 3

                if (text_rightc - node.x2) > 0:
                    padding_right = int(text_rightc - node.x2)
                else:
                    padding_right = 3

                # padding_left = padding_right = padding
                node.styles["padding-top"] = str(padding_top) + "px"
                node.styles["padding-bottom"] = str(padding_bottom) + "px"
                node.styles["padding-left"] = str(padding_left) + "px"
                node.styles["padding-right"] = str(padding_right) + "px"

                node.styles["border-width"] = "1px"
                node.styles["border-color"] = "rgba(244, 244, 244, 1)"
                node.styles["background-color"] = "rgba(" + bcolour_elem_value + ")"

            elif node.element_assigned in {"checkbox"}:
                node.styles["width"] = str(min(node_width, node_height)) + "px"
                node.styles["height"] = str(min(node_width, node_height)) + "px"

            elif node.element_assigned in {"radiobutton"}:
                pass

            elif node.element_assigned == "select":
                node.styles["max-width"] = str(node_width) + "px"
                node.styles["height"] = str(node_height) + "px"

                # Paddings calculations block
                padding_top = padding_bottom = int((node_height - font_size_value) / 2.0)
                padding_left = padding_right = abs(int(text_leftc - node.x1))
                node.styles["padding-top"] = str(padding_top) + "px"
                node.styles["padding-bottom"] = str(padding_bottom) + "px"
                node.styles["padding-left"] = str(padding_left) + "px"
                node.styles["padding-right"] = str(padding_right) + "px"

            if node.element_assigned in {"text", "ocrtext"}:
                node.styles["min-width"] = str(node_width) + "px"
                node.styles["min-height"] = str(node_height) + "px"

                # Paddings calculations block
                if text_elem_ocr:
                    padding_top = padding_bottom = int((node_height - alltext_height) / 2.0)
                else:
                    padding_top = padding_bottom = 3 # A default value when the text is not at the input

                if text_leftc > 0:
                    padding_left = int(text_leftc)
                else:
                    padding_left = 3

                if (node.x2 - node.x1 - text_rightc) > 0:
                    padding_right = int(node.x2 - node.x1 - text_rightc)
                else:
                    padding_right = 3

                print("x1 x2 tlc trc", node.types, node.element_assigned, node.x1, node.x2, text_leftc, text_rightc)
                print("left right", node.types, node.element_assigned, (text_leftc - node.x1), (text_rightc - node.x2))
                # input()

                # padding_left = padding_right = padding
                node.styles["padding-top"] = str(padding_top) + "px"
                node.styles["padding-bottom"] = str(padding_bottom) + "px"
                node.styles["padding-left"] = str(padding_left) + "px"
                node.styles["padding-right"] = str(padding_right) + "px"

                node.styles["color"] = "rgba(" + fcolour_elem_value + ")"
                node.styles["box-sizing"] = "border-box"

                # Text assignment
                if text_elem_ocr:
                    node.parameters["textContent"] = text_elem_ocr
                else:
                    node.parameters["textContent"] = lorem.get_word(count=2)

            elif node.element_assigned in {"textarea"}:
                if text_elem_ocr:
                    node.parameters["placeholder"] = text_elem_ocr
                else:
                    node.parameters["placeholder"] = lorem.get_word(count=2)

            elif node.element_assigned in {"form_heading"}:
                pass

            elif node.element_assigned in {"form"}:
                pass

            elif node.element_assigned == "image":
                node.styles["max-width"] = "100%"
                node.styles["height"] = "auto"

                # Saving an image
                cv2.imwrite(elem_image_name, elem_image)
                # Setting path to the image source
                elem_image_sourcename = fname + "/" + elem_image_name

                node.parameters["imageURL"] = (
                    "https://" + o.netloc + MEDIA_URL + elem_image_sourcename
                )

            elif node.element_assigned == "button":
                node.styles["width"] = "auto"
                node.styles["min-width"] = str(node_width) + "px"
                # Paddings calculations block
                padding_top = padding_bottom = int((node_height - font_size_value) / 2.0 / 2.0) # Empyrical constants are placed after the first 2.0 value placed
                padding_left = padding_right = int((node_width - text_width) / 2.0 * 5.0 / 6.0)
                # print(node_height, node_width, text_width)
                # input()
                node.styles["padding-top"] = str(padding_top) + "px"
                node.styles["padding-bottom"] = str(padding_bottom) + "px"
                node.styles["padding-left"] = str(padding_left) + "px"
                node.styles["padding-right"] = str(padding_right) + "px"

                # styles["max-height"] = str(node_height) + "px"
                node.styles["color"] = "rgba(" + fcolour_elem_value + ")"

                # Text assignment
                if text_elem_ocr:
                    node.parameters["textContent"] = text_elem_ocr
                else:
                    node.parameters["textContent"] = lorem.get_word(count=1)

                if styles_on:
                    # Set the background colour for styles
                    node.styles["background-color"] = "rgba(" + bcolour_elem_value + ")"

            elif node.element_assigned in {"menu", "list"}:
                # Hide the bullets
                node.styles["list-style-type"] = "none"

            elif node.element_assigned in {"li", "listItem"}:
                # Text assignment
                if text_elem_ocr:
                    node.parameters["textContent"] = text_elem_ocr
                else:
                    node.parameters["textContent"] = lorem.get_word(count=1)

                # Paddings calculations block
                # Vertical direction
                if (node.parent.direction == 0):
                    padding_top = padding_bottom = 5
                    padding_left = padding_right = 10
                    node.styles["padding-top"] = str(padding_top) + "px"
                    node.styles["padding-bottom"] = str(padding_bottom) + "px"
                    node.styles["padding-left"] = str(padding_left) + "px"
                    node.styles["padding-right"] = str(padding_right) + "px"
                # Horizontal direction
                elif (node.parent.direction == 1):
                    padding_top = padding_bottom = 5
                    padding_left = padding_right = 5
                    node.styles["padding-top"] = str(padding_top) + "px"
                    node.styles["padding-bottom"] = str(padding_bottom) + "px"
                    node.styles["padding-left"] = str(padding_left) + "px"
                    node.styles["padding-right"] = str(padding_right) + "px"
                # Other cases
                else:
                    padding_top = padding_bottom = 5
                    padding_left = padding_right = 5
                    node.styles["padding-top"] = str(padding_top) + "px"
                    node.styles["padding-bottom"] = str(padding_bottom) + "px"
                    node.styles["padding-left"] = str(padding_left) + "px"
                    node.styles["padding-right"] = str(padding_right) + "px"

    # A simple tree rendering to assign kwargs
    for pre, fill, node in RenderTree(root_block):
        if (node.element_assigned):
            structural_type = node.element_assigned
        else:
            structural_type = "container"

        node.scenarioelement_kwargs = {
            "struct_type": structural_type,
            "parameters": node.parameters,
            "styles": node.styles,
            "buoyancy": node.buoyancy,
        }
        print(node.styles)


    # Should add a block of the ET element creation
    for pre, fill, node in RenderTree(root_block):
        # displaying various kinds of elements start
        if (node != root_block):
            element = node.div = ET.SubElement(node.parent.div, node.element_assigned)

            # Process the cases of the name differences. Adapt the tags.
            # The whole dataset of the elements is much larger
            if node.element_assigned in {"checkbox"}:
                element.tag = "input"
                element.set("type", "checkbox")
            elif node.element_assigned in {"radiobutton"}:
                element.tag = "input"
                element.set("type", "radio")
            elif node.element_assigned in {"text", "ocrtext"}:
                element.tag = "div"
            elif node.element_assigned in {"textarea"}:
                # Text assignment for the placeholder
                element.set("placeholder", node.parameters["placeholder"])
            elif node.element_assigned in {"form_heading"}:
                element.tag = "h3"
            elif node.element_assigned in {"image"}:
                # displaying various kinds of elements start
                element.tag = "img"
                # displaying various kinds of elements end
                element.set("src", node.parameters["imageURL"])

            # Text content assignment
            if node.parameters["textContent"]:
                element.text = node.parameters["textContent"]

            str_styles = "; ".join(
                "{}:{}".format(key, val) for key, val in node.styles.items()
            )
            element.set("style", str_styles)
            element.set("buoyancy", str(node.buoyancy))

    return True


def sortchildrenby(parent, attr):
    try:
        parent[:] = sorted(parent, key=lambda child: int(child.get(attr)))
        # print("sorted", parent[:])
        # input()

    except Exception:
        # print("exception_sorted", parent[:])
        pass

    return True


# Serializing: assemble, freecanvas
def pipeline_assemble(region_dataset, fdict, o, localparams, freecanvasimg_hw=(0, 0), serializing="assemble"):
    # Define styles variable switching on, this variable is placed at parameters with other serializers as a flag
    styles_on = 1

    # Create the recognized_elements array start
    """
    if imgpath:
        # These calculations should be moved to the previous serializer later
        # Maybe write this to the parameters
        fsize = str(os.path.getsize(imgpath))
        fnamesize = fname + fsize
    """

    if fdict:
        # Loading the fdict
        if(serializing in {"assemble"}):
            fdict = json.loads(fdict)
        if(serializing in {"freecanvas"}):
            fdict = fdict

        # Now the fnamesize is a given value
        # The solution is temporary based on unique data struct_type
        fnamesize = list(fdict)[0]
        # Removing the trailing characters of the string
        fname = fnamesize.rstrip("0123456789")

        # Define the image to be processed
        if(serializing in {"assemble"}):
            # Create the opencv recognition start
            # Read an image with OpenCV start
            imgpath = MEDIA_ROOT + "/uploads/" + fname
            image_opencv_input = cv2.imread(imgpath)
            # detect height and width of the image
            img_height, img_width, img_channels = image_opencv_input.shape
            # Read an image with OpenCV end
        if(serializing in {"freecanvas"}):
            # Define root canvas width and height, based on layout parameter
            # Other devices
            img_height, img_width = freecanvasimg_hw
            # This initialises an RGB-image that is just black (with two instances)
            image_opencv_input = np.zeros((img_height, img_width, 3), np.uint8)

        # Create a directory to save clusters for some image processed
        SAVE_DIR = os.path.join(MEDIA_ROOT, fname)
        find_or_create_dir(SAVE_DIR)

        os.chmod(SAVE_DIR, 0o755)
        os.chdir(SAVE_DIR)

        # Get(take the whole image) the dominant colour for the parent container
        # The default value is valid for the freecanvas
        bcolour_container_value = "255,255,255,0"
        if(serializing in {"assemble"}):
            domcolour_container = get_dominant_colour(image_opencv_input)[0]
            domcolour_container.append(1)
            bcolour_container_value = ",".join(str(int(x)) for x in domcolour_container)
        # Create the opencv recognition end

        # Assembling start
        # Supplementary parameters calculation and printing of the fdict function call
        min_x1, min_y1, max_x2, max_y2 = supplement_fdict_calc_printing(
            fdict, fnamesize, img_width, img_height
        )

        # Show the regions before the indices exclusion
        # Localhost only
        if localparams["page"] == 1:
            print_fdict_before(image_opencv_input, fname, fdict, fnamesize)
            # input()

        # The indices exclusion should be added to the firstclusters calculation maybe
        # calculate_excluded_indices(fdict, fnamesize)

        # A firstclusters detecting step
        # calculate_ocvclusters(fdict, fnamesize)
        root_firstcluster = calculate_firstclusters(
            fdict, fname, fnamesize, img_height, img_width
        )

        # Print firstclusters just after appearance. They should be equal to the regions.
        # Localhost only
        # image_firstclusters = copy.deepcopy(image_opencv_input)

        # Processing simple elements chains on the firstclusters
        root_firstcluster = firstclusters_elements_chains_processing(
            root_firstcluster, fname
        )

        '''
        image_firstclusters = copy.deepcopy(image_opencv_input)
        # Elements-based clusters printing
        for pre, fill, node in RenderTree(root_firstcluster):
            treestr = u"%s%s" % (pre, node.name)
            print(treestr.ljust(8), node.element_assigned,node.types, (node.x1, node.y1), (node.x2, node.y2))
            cv2.rectangle(image_firstclusters, (node.x1, node.y1), (node.x2, node.y2), (20, 50, 107), 1)
            label_element = str(node.element_assigned)
            # Keep in mind, that this label will be different for the specific block types
            # if (label_element == "list"):
            cv2.putText(
                image_firstclusters,
                label_element,
                (node.x1, node.y2),
                cv2.FONT_HERSHEY_SIMPLEX,
                0.5,
                (36, 255, 12),
                2,
            )

        # Printing firstclusters to file
        if len(image_firstclusters):
            imgpath = SAVE_DIR + "/firstclusters_" + fname
            print(SAVE_DIR)
            print(imgpath)

            cv2.imwrite(imgpath, image_firstclusters)
        '''

        # Calculate fclusters function calling
        root_firstcluster = calculate_fclusters(root_firstcluster)

        """
        # Elements-based clusters printing
        for pre, fill, node in RenderTree(root_firstcluster):
            treestr = u"%s%s" % (pre, node.name)
            print(treestr.ljust(8), node.element_assigned,node.types, (node.x1, node.y1), (node.x2, node.y2))
            cv2.rectangle(image_firstclusters, (node.x1, node.y1), (node.x2, node.y2), (20, 50, 107), 1)
        """

        # Call the fclusters printing
        # Localhost only
        if localparams["page"] == 1:
            print_clusters_length(root_firstcluster)

        # print(region_dataset)
        # input()
        if region_dataset in ["headers", "footers", "webpages"]:
            # Calculate dbclusters function calling
            # DBclusters are adding to firstclusters in an appropriate order
            root_firstcluster = calculate_dbclusters(region_dataset, root_firstcluster)

        # Print all the clusters after the dbclusters step
        # Localhost only
        if localparams["page"] == 1:
            clusters_name = "after_dbclusters_"
            print_clusters(
                clusters_name, image_opencv_input, root_firstcluster, SAVE_DIR, fname
            )

        # Do the containerization based on firstclusters and dbclusters, they should be both merged to clusters
        root_block = ternary_assembling_run(
            min_x1, min_y1, max_x2, max_y2, root_firstcluster, image_opencv_input
        )
        # Print all the clusters after the cclusters step
        # Localhost only
        if localparams["page"] == 1:
            clusters_name = "after_cclusters_"
            print_clusters(
                clusters_name, image_opencv_input, root_firstcluster, SAVE_DIR, fname
            )

            # Elements-based clusters printing
            for pre, fill, node in RenderTree(root_firstcluster):
                treestr = u"%s%s" % (pre, node.name)
                print(
                    treestr.ljust(8),
                    node.element_assigned,
                    node.types,
                    node.direction,
                    (node.x1, node.y1),
                    (node.x2, node.y2),
                )

        # HTML tree initialize function call
        root, outer_div, styles, parameters = htmltree_initialize(
            fname, bcolour_container_value, img_width, img_height, imgpath, SAVE_DIR
        )

        # Detect elements for the root block
        elements_rootblock(
            root_block,
            styles_on,
            region_dataset,
            img_width,
            img_height,
            outer_div,
            image_opencv_input,
            fname,
            o,
            serializing=serializing,
        )
        # print("outerdiv", outer_div)

        # Printing clusters function calling
        # Localhost only
        if localparams["page"] == 1:
            clusters_printing(root_block, fname, input_image=image_opencv_input)

        # Localhost only
        if localparams["page"] == 1:
            for pre, fill, node in RenderTree(root_firstcluster):
                if node.children:
                    pass

            # Generating HTML for printing
            root1 = root

            for elem in root1.iter():
                if len(list(elem)) > 1:

                    print('my no of child: %d'%len(list(elem)))
                    print(elem.attrib.items())
                    for child in elem:
                        print(child, child.attrib.items(), child.get("buoyancy"))

                    print(elem, "tag", elem.tag)
                    sortchildrenby(elem, "buoyancy")

            html = ET.tostring(root1, short_empty_elements=False).decode("utf-8")
            # print("html=", html)

            # Print html code
            with open(fname + ".html", "w") as html_file:
                print(html, file=html_file)

            # Print tree to file
            with open(
                VIA_ANNOTATION_ASSEMBLING_FILE + fname + ".txt", "w"
            ) as tree_file:
                for pre, fill, node in RenderTree(root_block):
                    # Process the tree to remove a node.div if exists to obtain JSON
                    try:
                        del node.div
                    except Exception:
                        pass
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
                        node.element_assigned,
                        node.styles,
                        "processing:",
                        node.processing,
                        "buoyancy:",
                        node.buoyancy,
                        file=tree_file,
                    )

            exporter = DictExporter()
            parameters = exporter.export(root_block)

    return parameters, styles, root_block
