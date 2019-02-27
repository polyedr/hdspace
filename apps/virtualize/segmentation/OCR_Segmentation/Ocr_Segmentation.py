import argparse
import os
import time

import cv2
from nms import nms
import numpy as np

from apps.virtualize.segmentation.OCR_Segmentation import utils
from apps.virtualize.segmentation.OCR_Segmentation.decode import decode
from apps.virtualize.segmentation.OCR_Segmentation.draw import drawPolygons, drawBoxes


def text_detection(image, model, min_confidence, width, height):
    # load the input image and grab the image dimensions
    image = cv2.imread(image)
    orig = image.copy()
    (origHeight, origWidth) = image.shape[:2]

    # set the new width and height and then determine the ratio in change
    # for both the width and height
    (newW, newH) = (width, height)
    ratioWidth = origWidth / float(newW)
    ratioHeight = origHeight / float(newH)

    # resize the image and grab the new image dimensions
    image = cv2.resize(image, (newW, newH))
    (imageHeight, imageWidth) = image.shape[:2]

    # define the two output layer names for the EAST detector model that
    # we are interested -- the first is the output probabilities and the
    # second can be used to derive the bounding box coordinates of text
    layerNames = [
        "feature_fusion/Conv_7/Sigmoid",
        "feature_fusion/concat_3"]

    # load the pre-trained EAST text detector
    print("[INFO] loading EAST text detector...")
    net = cv2.dnn.readNetFromTensorflow(model)

    # construct a blob from the image and then perform a forward pass of
    # the model to obtain the two output layer sets
    blob = cv2.dnn.blobFromImage(image, 1.0, (imageWidth, imageHeight), (123.68, 116.78, 103.94), swapRB=True, crop=False)

    start = time.time()
    net.setInput(blob)
    (scores, geometry) = net.forward(layerNames)
    end = time.time()

    # show timing information on text prediction
    print("[INFO] text detection took {:.6f} seconds".format(end - start))


    # NMS on the the unrotated rects
    confidenceThreshold = min_confidence
    nmsThreshold = 0.4

    # decode the blob info
    (rects, confidences, baggage) = decode(scores, geometry, confidenceThreshold)

    offsets = []
    thetas = []
    for b in baggage:
        offsets.append(b['offset'])
        thetas.append(b['angle'])

    ##########################################################

    functions = [nms.felzenszwalb.nms] #, nms.fast.nms, nms.malisiewicz.nms]

    print("[INFO] Running nms.boxes . . .")
    regions = ''

    for i, function in enumerate(functions):

        start = time.time()
        indicies = nms.boxes(rects, confidences, nms_function=function, confidence_threshold=confidenceThreshold,
                                 nsm_threshold=nmsThreshold)
        end = time.time()

        indicies = np.array(indicies).reshape(-1)

        drawrects = np.array(rects)[indicies]

        name = function.__module__.split('.')[-1].title()
        print("[INFO] {} NMS took {:.6f} seconds and found {} boxes".format(name, end - start, len(drawrects)))
        # regions = drawrects

        drawOn = orig.copy()
        regions = drawBoxes(drawOn, drawrects, ratioWidth, ratioHeight, (0, 255, 0), 2)

        # title = "nms.boxes {}".format(name)
        # cv2.imshow(title,drawOn)
        # cv2.moveWindow(title, 150+i*300, 150)
    print(regions)
    print('regions before')

    return regions
    # cv2.waitKey(100000)