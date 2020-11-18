# read the Via annotation file
# select the first file
# detect the size of the whole image
# detect the size of the visible elements
# add extra borders if necessary
# find all the clusters based on cluster-making elements (inputs, selects, buttons,
# free text blocks, maybe large images)

import math
import os
import cv2
import uuid
from statistics import median
from anytree import RenderTree, NodeMixin
from pytesseract import pytesseract
from scipy.spatial import distance
from sklearn.cluster import KMeans
from collections import Counter

# The constant to remove rectangle when overlaps more than 90% with larger rectangle
SQUARES_OVERLAP_THRESHOLD = 0.8

# The constant to remove text rectangle when overlaps more than 5% with larger rectangle
SQUARES_OVERLAP_THRESHOLD_TEXT = 0.05

# The constant to calculate horizontal overlap during the vertical groups detection
# Forms
VERICAL_GROUPS_HORIZONTAL_OVERLAP_THRESHOLD = 0.75

# The constant to calculate vertical overlap during the horizontal groups detection
# Forms
HORIZONTAL_GROUPS_VERTICAL_OVERLAP_THRESHOLD = 0.25

SCRIPT_DIR = os.getcwd()
HTML_DIR = os.path.join(SCRIPT_DIR, "layout_data")

config_tesseract = "-l eng --oem 1 --psm 3"


def recognize_with_tesseract(roi_our):
    text = ""
    font_size_value = 12.0
    # Convert to the grey colour
    roi_our = cv2.cvtColor(roi_our, cv2.COLOR_BGR2GRAY)

    # Detect the font-size with tesseract for some element
    result = pytesseract.image_to_boxes(roi_our)

    lines = result.strip().split("\n")
    font_size = []

    for line in lines:
        chars = line.split(" ")
        try:
            font_size.append(float(chars[4]) - float(chars[2]))
        except Exception:
            font_size.append(12.0)  # Default font-size value is 12px
    font_size_value = int(median(font_size) * 1.7)

    # Read the string with tesseract
    text = pytesseract.image_to_string(roi_our, config=config_tesseract)

    return text, font_size_value


# Calculate distance between two points
def calculateDistance(x1, y1, x2, y2):
    dist = math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2)
    return dist


def contains_rectangle(r1, r2):
    # Calculation for the case of rois
    return r1[1] < r2[1] < r2[3] < r1[3] and r1[0] < r2[0] < r2[2] < r1[2]


def get_dominant_colour(image, k=4, image_processing_size=None):
    """
    takes an image as input
    returns the dominant color of the image as a list

    dominant color is found by running k means on the
    pixels & returning the centroid of the largest cluster

    processing time is sped up by working with a smaller image;
    this resizing can be done with the image_processing_size param
    which takes a tuple of image dims as input

    get_dominant_colour(my_image, k=4, image_processing_size = (25, 25))
    [56.2423442, 34.0834233, 70.1234123]
    """
    # resize image if new dims provided
    if image_processing_size is not None:
        image = cv2.resize(image, image_processing_size, interpolation=cv2.INTER_AREA)

    # reshape the image to be a list of pixels
    image = image.reshape((image.shape[0] * image.shape[1], 3))

    # cluster and assign labels to the pixels
    clt = KMeans(n_clusters=k)
    labels = clt.fit_predict(image)

    # count labels to find most popular
    label_counts = Counter(labels)

    # subset out most popular centroid
    dominant_colour = clt.cluster_centers_[label_counts.most_common(1)[0][0]]

    dcolour = list(dominant_colour)
    dcolour.reverse()

    return dcolour


# Clustering for large containers and small clusters
class ClusterClass(NodeMixin):
    # Flex 0 vertical, 1 horizontal, 2 unseparable, -1 undefined
    direction = -1
    # Clusters types, containers, dbclusters, forms
    # types = "ccluster", "dbcluster", "fcluster", "undefined"
    types = "undefined"
    is_elements_only = False  # check if contains elements only, actual for fclusters
    is_final = False  # check if should not be splitted further
    # processing = "splitted", "unsplitted"  # check if the ternary algorithm was applied
    processing = "unsplitted"  # check if the ternary algorithm was applied
    is_solid = (
        True
    )  # if clusters contain one element only. Based on flusters making algorithm

    elements = []

    def __init__(self, x1, y1, x2, y2, parent=None, children=None, elements=None):
        self.name = uuid.uuid4().hex
        self.x1 = x1
        self.y1 = y1
        self.x2 = x2
        self.y2 = y2
        self.parent = parent
        if children:
            self.children = children
        if elements:
            self.elements = elements

    def __repr__(self):
        return {
            "name": self.name,
            "x1": self.x1,
            "y1": self.y1,
            "x2": self.x2,
            "y2": self.y2,
            "direction": self.direction,
            "elements": self.elements,
        }

    def __str__(self):
        return self.name


# Class-based solution to merge intervals
# https://www.tutorialspoint.com/merge-intervals-in-python
# A tool to merge all overlapping intervals
class Partition(object):
    def merge(self, intervals):
        """
      :type intervals: List[Interval]
      :rtype: List[Interval]
      """
        if len(intervals) == 0:
            return []
        self.quicksort(intervals, 0, len(intervals) - 1)
        # for i in intervals:
        # print(i.start, i.end)
        stack = []
        stack.append(intervals[0])
        for i in range(1, len(intervals)):
            last_element = stack[len(stack) - 1]
            if last_element[1] >= intervals[i][0]:
                last_element[1] = max(intervals[i][1], last_element[1])
                stack.pop(len(stack) - 1)
                stack.append(last_element)
            else:
                stack.append(intervals[i])
        return stack

    def partition(self, array, start, end):
        pivot_index = start
        for i in range(start, end):
            if array[i][0] <= array[end][0]:
                array[i], array[pivot_index] = array[pivot_index], array[i]
                pivot_index += 1
        array[end], array[pivot_index] = array[pivot_index], array[end]
        return pivot_index

    def quicksort(self, array, start, end):
        if start < end:
            partition_index = self.partition(array, start, end)
            self.quicksort(array, start, partition_index - 1)
            self.quicksort(array, partition_index + 1, end)


def dbcluster_split(block, clusters):
    # Ternary assembling algorithm built with annotation only
    # Clusters here are fclusters
    # Show the dbcluster block
    # print("block, clusters", block)
    # for cluster in clusters:
    #     print(cluster.types)
    #
    # input()

    x_layout_intervals = []
    y_layout_intervals = []

    # Array of clusters placed in block
    clusters_in = []

    # Go through regions placed in the block
    for cluster in clusters:
        if block.x1 <= cluster.x1 <= block.x2:
            if block.x1 <= cluster.x2 <= block.x2:
                if block.y1 <= cluster.y1 <= block.y2:
                    if block.y1 <= cluster.y2 <= block.y2:
                        # Append layouts intervals for the block
                        x_layout_intervals.append([cluster.x1, cluster.x2])
                        y_layout_intervals.append([cluster.y1, cluster.y2])
                        clusters_in.append(cluster)

    # Merge all overlapping intervals
    # print(x_layout_intervals)
    ob1_x = Partition()
    ob1_x_merged = ob1_x.merge(x_layout_intervals)
    # print("block", "ob1_x_merged", ob1_x_merged, type(ob1_x_merged))

    # print(y_layout_intervals)
    ob1_y = Partition()
    ob1_y_merged = ob1_y.merge(y_layout_intervals)
    # print("block", ob1_y_merged)

    # Choose if the block horizontal vertical or final
    # vertiical
    if len(ob1_x_merged) >= len(ob1_y_merged):
        block.direction = 0

    # horizontal
    if len(ob1_x_merged) < len(ob1_y_merged):
        block.direction = 1

    # horizontal y length 1 case
    if len(ob1_x_merged) >= len(ob1_y_merged) and (len(ob1_y_merged) == 1):
        block.direction = 1
        block.is_final = True

    # vertiical x length 1 case
    if len(ob1_x_merged) < len(ob1_y_merged) and (len(ob1_x_merged) == 1):
        block.direction = 0
        block.is_final = True

    # final
    # Fclusters directions are detected incorrectly here
    # They should be skipped, but for that case they crash the process
    # They should be improved during a postprocessing
    if (len(ob1_x_merged) == 1) and (len(ob1_y_merged) == 1):
        block.direction = 2
        block.is_final = True

    if not block.is_final:
        bcls = block.children  # Block clusters, here are fclusters
        # Assign the children based on direction
        if block.direction == 0:
            for interval in ob1_y_merged:
                dbcluster = ClusterClass(
                    block.x1, interval[0], block.x2, interval[1], parent=block
                )
                dbcluster.types = "dbcluster"
                dbcluster.processing = "splitted"

                # Remove fclusters children from block to novel dbclusters
                for bcl in bcls:
                    if dbcluster.x1 <= bcl.x1 <= dbcluster.x2:
                        if dbcluster.x1 <= bcl.x2 <= dbcluster.x2:
                            if dbcluster.y1 <= bcl.y1 <= dbcluster.y2:
                                if dbcluster.y1 <= bcl.y2 <= dbcluster.y2:
                                    bcl.parent = dbcluster

        if block.direction == 1:
            for interval in ob1_x_merged:
                dbcluster = ClusterClass(
                    interval[0], block.y1, interval[1], block.y2, parent=block
                )
                dbcluster.types = "dbcluster"
                dbcluster.processing = "splitted"

                # Remove fclusters children from block to novel dbclusters
                for bcl in bcls:
                    if dbcluster.x1 <= bcl.x1 <= dbcluster.x2:
                        if dbcluster.x1 <= bcl.x2 <= dbcluster.x2:
                            if dbcluster.y1 <= bcl.y1 <= dbcluster.y2:
                                if dbcluster.y1 <= bcl.y2 <= dbcluster.y2:
                                    bcl.parent = dbcluster

        # This block may contain dbclusters
        if block.direction == 2:
            pass
            # for cluster in clusters_in:
            #     if(cluster not in block.ancestors):
            #         if (cluster != block):
            #             print(cluster.name, block.name)
            #             cluster.parent = block
            # for interval_x in ob1_x_merged:
            #     for interval_y in ob1_y_merged:
            #         # ClusterClass(
            #         #     interval_x[0],
            #         #     interval_y[0],
            #         #     interval_x[1],
            #         #     interval_y[1],
            #         #     parent=root_block,
            #         # )
            #         cv2.rectangle(
            #             image_opencv_input,
            #             (interval_x[0], interval_y[0]),
            #             (interval_x[1], interval_y[1]),
            #             (20, 150, 107),
            #             -1,
            #         )

    # Go through all the blocks obtained from the current one
    for pre, fill, node in RenderTree(block):
        # print("children", node)
        if node != block and node.types in {"dbcluster"}:
            if node.direction != 2 and not block.is_final:
                # Split each block
                dbcluster_split(node, clusters)


def blocks_split(block, window_name1, image_opencv_input, overlay, clusters):
    # Ternary assembling algorithm builded with annotation only
    # Show the block
    # print("block", block)

    x_layout_intervals = []
    y_layout_intervals = []

    # Array of clusters placed in block
    clusters_in = []

    # Go through regions placed in the block
    for cluster in clusters:
        if block.x1 <= cluster.x1 <= block.x2:
            if block.x1 <= cluster.x2 <= block.x2:
                if block.y1 <= cluster.y1 <= block.y2:
                    if block.y1 <= cluster.y2 <= block.y2:
                        # Append layouts intervals for the block
                        x_layout_intervals.append([cluster.x1, cluster.x2])
                        y_layout_intervals.append([cluster.y1, cluster.y2])
                        clusters_in.append(cluster)

    # print(x_layout_intervals)
    ob1_x = Partition()
    ob1_x_merged = ob1_x.merge(x_layout_intervals)
    # print("block", "ob1_x_merged", ob1_x_merged, type(ob1_x_merged))

    # print(y_layout_intervals)
    ob1_y = Partition()
    ob1_y_merged = ob1_y.merge(y_layout_intervals)
    # print("block", ob1_y_merged)

    # Choose if the block horizontal vertical or final
    # vertiical
    if len(ob1_x_merged) >= len(ob1_y_merged):
        block.direction = 0

    # horizontal
    if len(ob1_x_merged) < len(ob1_y_merged):
        block.direction = 1

    # horizontal y length 1 case
    if len(ob1_x_merged) >= len(ob1_y_merged) and (len(ob1_y_merged) == 1):
        block.direction = 1

    # vertiical x length 1 case
    if len(ob1_x_merged) < len(ob1_y_merged) and (len(ob1_x_merged) == 1):
        block.direction = 0

    # final
    # Fclusters directions are detected incorrectly here
    # They should be skipped, but for that case they crash the process
    # They should be improved during a postprocessing
    if (len(ob1_x_merged) == 1) and (len(ob1_y_merged) == 1):
        block.direction = 2

    # Assign the children based on direction
    if block.direction == 0:
        for interval in ob1_y_merged:
            ccluster = ClusterClass(
                block.x1, interval[0], block.x2, interval[1], parent=block
            )
            ccluster.types = "ccluster"
            # cv2.rectangle(
            #     image_opencv_input,
            #     (block.x1, interval[0]),
            #     (block.x2, interval[1]),
            #     (120, 140, 97),
            #     -1,
            # )

    if block.direction == 1:
        for interval in ob1_x_merged:
            ccluster = ClusterClass(
                interval[0], block.y1, interval[1], block.y2, parent=block
            )
            ccluster.types = "ccluster"
            # cv2.rectangle(
            #     image_opencv_input,
            #     (interval[0], block.y1),
            #     (interval[1], block.y2),
            #     (120, 150, 97),
            #     -1,
            # )

    # This block may contain dbclusters
    if block.direction == 2:
        for cluster in clusters_in:
            if cluster not in block.ancestors:
                if cluster != block:
                    # print(cluster.name, block.name)
                    cluster.parent = block
        for interval_x in ob1_x_merged:
            for interval_y in ob1_y_merged:
                pass
                # ClusterClass(
                #     interval_x[0],
                #     interval_y[0],
                #     interval_x[1],
                #     interval_y[1],
                #     parent=root_block,
                # )
                # cv2.rectangle(
                #     image_opencv_input,
                #     (interval_x[0], interval_y[0]),
                #     (interval_x[1], interval_y[1]),
                #     (20, 150, 107),
                #     -1,
                # )

    # print("direction", block.direction)

    # Go through all the blocks obtained from the current one
    for pre, fill, node in RenderTree(block):
        # print("children", node)
        if node != block and node.types in {"ccluster"}:
            if node.direction != 2:
                # Split each block
                blocks_split(node, window_name1, image_opencv_input, overlay, clusters)
            # if node.direction == 2:
            #     for cluster in clusters_in:
            #         cluster.parent = node


# Finding the closest point to a list of points
# https://codereview.stackexchange.com/questions/28207/finding-the-closest-point-to-a-list-of-points
def closest_node(node, nodes):
    closest_index = distance.cdist([node], nodes).argmin()
    return (closest_index, node, nodes[closest_index])


def find_or_create_dir(directory, show=False):
    """Find or (if not found) create a specific dir."""
    parent_dir = os.path.abspath(os.path.join(directory, ".."))
    this_dir = directory.split("/")[-1]
    if this_dir not in os.listdir(parent_dir):
        # print("no such dir, create one")
        try:
            os.mkdir(directory)
        except Exception as ex:
            pass
            # print("could not create dir, because\t{}".format(ex))
    if show:
        pass
        # print(directory)
    return directory
