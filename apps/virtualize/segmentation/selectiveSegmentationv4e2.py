# -*- coding: utf-8 -*-
"""
Created on Thu Nov 16 13:23:59 2017

@author: ramitha
"""


import os
import os.path

########################  START SEGMENTATION, INCEPTION AND OCR ####################
import cv2
import numpy as np
from PIL import Image
from scipy import ndimage
from skimage.filters import scharr
from skimage.measure import label, regionprops
from skimage.morphology import skeletonize
from apps.virtualize.segmentation.OCR_Segmentation.Ocr_Segmentation import text_detection


class regionR:
    def __init__(self,bbox,coords,area):
        self.bbox = bbox
        self.coords = coords
        self.area = area
class element:
    def __init__(self, element_no, crop_img, threshold_img, fill_BW, threshold_val, area, width, height, bbox,
                 bbox_area, pix_coords, probability, parent_node, child_node, MSER, partialOverlapNode, elementRoot,
                 cnnResult,cnnScore,cnnLabel,segmentType):
        self.element_no = element_no
        self.crop_img = crop_img
        self.threshold_img = threshold_img
        self.fill_BW = fill_BW
        self.threshold_val = threshold_val
        self.area = area
        self.bbox = bbox
        self.bbox_area = bbox_area
        self.pix_coords = pix_coords
        self.probability = probability
        self.parent_node = parent_node
        self.child_node = child_node
        self.width = width
        self.height = height
        self.MSER = MSER
        self.partialOverlapNode = partialOverlapNode
        self.elementRoot = elementRoot
        self.cnnResult = cnnResult
        self.cnnScore = cnnScore
        self.cnnLabel= cnnLabel
        self.segmentType = segmentType


    def update_element(self, region_ele):
        bottom_left_y, bottom_left_x, top_right_y, top_right_x = region_ele.bbox
        self.width = top_right_x - bottom_left_x
        self.height = top_right_y - bottom_left_y
        self.bbox = region_ele.bbox
        self.area = region_ele.area
        self.bbox_area = self.width * self.height
        self.pix_coords = np.transpose(region_ele.coords)
        self.parent_node = []
        self.child_node = []
        self.partialOverlapNode = []
        return
    def coco_update_element(self, bbox):
        bottom_left_y, bottom_left_x, top_right_y, top_right_x = bbox
        self.width = top_right_x - bottom_left_x
        self.height = top_right_y - bottom_left_y
        self.bbox = bbox
        self.area = self.width * self.height
        self.bbox_area = self.width * self.height
        self.pix_coords = []
        self.parent_node = []
        self.child_node = []
        self.partialOverlapNode = []
        self.segmentType = 'COCO'
        return

    def update_Bigelement(self, region_bbox):
        bottom_left_y, bottom_left_x, top_right_y, top_right_x = region_bbox
        self.width = top_right_x - bottom_left_x
        self.height = top_right_y - bottom_left_y
        self.bbox = region_bbox
        self.area = self.width * self.height
        self.bbox_area = self.width * self.height
        self.pix_coords = []
        self.parent_node = []
        self.child_node = []
        self.partialOverlapNode = []
        return


def RegionValidation(region_vali, imgIn, lowRatio=0.002, highRatio=0.60, min_region_area=1000, min_region_width=10,
                     min_region_height=10):
    validation = False
    widthIn, heightIn = np.shape(imgIn)
    areaIn = widthIn * heightIn
    bottom_left_y, bottom_left_x, top_right_y, top_right_x = region_vali.bbox
    width = top_right_x - bottom_left_x
    height = top_right_y - bottom_left_y
    area = width * height
    ratio = area / areaIn
    # print('region area ratio', ratio)
    if (height > min_region_height) and (width > min_region_width) and (ratio < highRatio) and (ratio > lowRatio):
        validation = True
    return validation


def variable_threshold(img, min_pixel, norm_req=False):
    if norm_req:
        img_norm = img / img.max()
        img_uint = np.uint8(np.round(img_norm * 255))
    else:
        img_uint = img
    ret, thresh = cv2.threshold(img_uint, min_pixel, 1, cv2.THRESH_BINARY)
    skeleton = skeletonize(thresh)
    x, y = np.shape(skeleton)
    maskju = np.zeros((x + 2, y + 2), np.uint8)
    skel = np.uint8(thresh) * 255
    fill_img = cv2.floodFill(skel, maskju, (0, 0), 255);
    inv_fill = np.invert(fill_img[2])
    return thresh, inv_fill


def mag(val):
    return np.sqrt(val * val)


# def CreateElementObjectfromRegion(region, imgIn, element_no, thresh_img, inv_fill_img, min_pix_val):
#     element_obj = element(element_no, [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [],[],[])
#     element_obj.update_element(region)
#     bottom_left_y, bottom_left_x, top_right_y, top_right_x = region.bbox
#     element_obj.threshold_img = thresh_img[bottom_left_y:top_right_y, bottom_left_x:top_right_x]
#     element_obj.fill_BW = inv_fill_img[bottom_left_y:top_right_y, bottom_left_x:top_right_x]
#     crop_region = (bottom_left_x, bottom_left_y, top_right_x, top_right_y)
#     #        element_obj.crop_img = imgIn.crop(crop_region)
#     element_obj.threshold_val = min_pix_val
#     element_obj.MSER = False
#     return element_obj
def CreateElementObjectfromRegion(region,imgIn, element_no, thresh_img, inv_fill_img, min_pix_val,croppedElemRootFolder, type, count):
    element_obj = element(element_no, [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [],[],[],[])
    element_obj.update_element(region)
    bottom_left_y, bottom_left_x, top_right_y, top_right_x = region.bbox
    # element_obj.threshold_img = thresh_img[bottom_left_y:top_right_y, bottom_left_x:top_right_x]
    # element_obj.fill_BW = inv_fill_img[bottom_left_y:top_right_y, bottom_left_x:top_right_x]
    crop_region = (bottom_left_x, bottom_left_y, top_right_x, top_right_y)
    #        element_obj.crop_img = imgIn.crop(crop_region)
    element_obj.threshold_val = min_pix_val
    element_obj.MSER = False
    coord_array = np.transpose(region.coords)
    # print('coord_array', np.shape(coord_array))
    img_mat  = np.asarray(imgIn)
    maskImg = np.zeros_like(img_mat[:, :, 0])
    ax, pixels = np.shape(coord_array)
    for pixno in range(pixels):
        # changed for the array structure
        x = coord_array[0, pixno]
        y = coord_array[1, pixno]
        # print('x coord',x,'y coord',y)
        maskImg[int(x), int(y)] = 1
    masked_pixels = np.ones_like(imgIn, dtype=np.float32)
    print('mask_img', np.shape(masked_pixels))
    for x in range(3):
        masked_pixels[:, :, x] = np.multiply(masked_pixels[:, :, x], maskImg[:, :])
    element_obj.binarymask = masked_pixels
    # minr, minc, maxr, maxc
    croppedImage = imgIn.crop(
        (int(bottom_left_x) - 1, int(bottom_left_y) - 1, int(top_right_x) + 2, int(top_right_y) + 2))
    if type == 'big':
        croppedName = "cropped_BIG " + str(count) + '__' + str(element_no) + ".jpg"
        croppedFilepathName = os.path.join(croppedElemRootFolder, str(croppedName))
        croppedImage.save(croppedFilepathName)
        element_obj.elementRoot = croppedFilepathName
    elif type == 'tresh':
        croppedName = "cropped_TRESH" + str(count) + '__' + str(element_no) + ".jpg"
        croppedFilepathName = os.path.join(croppedElemRootFolder, str(croppedName))
        croppedImage.save(croppedFilepathName)
        element_obj.elementRoot = croppedFilepathName
    else:
        croppedName = "cropped_OTHER" + str(count) + '__' + str(element_no) + ".jpg"
        croppedFilepathName = os.path.join(croppedElemRootFolder, str(croppedName))
        croppedImage.save(croppedFilepathName)
        element_obj.elementRoot = croppedFilepathName
    print('elementR.elementRoot', element_obj.elementRoot)
    return element_obj

def ValidationOverlapElement(ref_obj, comp_obj, tolerance):
    ref_bottom_left_y, ref_bottom_left_x, ref_top_right_y, ref_top_right_x = ref_obj.bbox
    comp_bottom_left_y, comp_bottom_left_x, comp_top_right_y, comp_top_right_x = comp_obj.bbox
    validation = False
    if (mag(comp_bottom_left_y - ref_bottom_left_y)) < tolerance and (
            mag(comp_bottom_left_x - ref_bottom_left_x)) < tolerance and (
            mag(comp_top_right_y - ref_top_right_y)) < tolerance and (
    mag(comp_top_right_x - ref_top_right_x)) < tolerance:
        validation = True
    return validation


def RemoveOverlapElements(element_list, tolerance):
    new_element_list_full = [elem for elem in element_list]
    ref_element_list = [elem for elem in element_list]
    next_ref_element_list = [elem for elem in element_list]
    unique_element_list_n = []
    while len(ref_element_list) > 1:
        ref_obj = ref_element_list[0]
        ptr = 0
        len_val = len(ref_element_list)
        # print('len_val', len_val)
        count = 0
        threshold_val_set = []
        threshold_val_set.append(ref_obj.threshold_val)
        for ptr in np.arange(1, len_val, 1):
            # print('ptr',ptr)
            comp_obj = ref_element_list[ptr]
            if ValidationOverlapElement(ref_obj, comp_obj, tolerance):
                del next_ref_element_list[ptr - count]
                count += 1
                temp_val = comp_obj.threshold_val
                threshold_val_set.append(temp_val)
                if ref_obj.area < comp_obj.area:
                    ref_obj = comp_obj
                    # print('*** new ref_obj.element_no',ref_obj.element_no)
        # print('threshold list',threshold_val_set)
        ref_obj.threshold_val = threshold_val_set
        unique_element_list_n.append(ref_obj)
        del next_ref_element_list[0]
        ref_element_list = [elem for elem in next_ref_element_list]
    if len(ref_element_list) == 1:
        unique_element_list_n.append(ref_element_list[0])
    return unique_element_list_n


def SortListOnElementArea(element_list, reverse_srt=False):
    sort_list = []
    new_list = []
    count = 0
    for ele_obj in element_list:
        obj_bbox_area = ele_obj.bbox_area
        sort_list.append((count, obj_bbox_area))
        # print('count',count)
        # print('obj_bbox_area',obj_bbox_area)
        count += 1
    sort_list.sort(key=lambda tup: tup[1], reverse=reverse_srt)
    for ele_obj_srt in sort_list:
        count, obj_bbox_area = ele_obj_srt
        new_list.append(element_list[count])
        # print('count',count)
        # print('obj_bbox_area',obj_bbox_area)
    return new_list


def DetectOverlapType(cur_obj, comp_obj, validate_mode=0):
    valOverlap = 0
    fullOverlap = False
    partialOverlap = False
    cur_bottom_left_y, cur_bottom_left_x, cur_top_right_y, cur_top_right_x = cur_obj.bbox
    comp_bottom_left_y, comp_bottom_left_x, comp_top_right_y, comp_top_right_x = comp_obj.bbox
    # print('comp_bottom_left_y',comp_bottom_left_y)
    # print('cur_bottom_left_y',cur_bottom_left_y)
    # print('comp_top_right_y',comp_top_right_y)
    # print('comp_top_right_x',comp_top_right_x)
    # check whether the element is with in the parent region or  partial overalap between the two elements
    bLeft_y = False
    bLeftx = False
    tRight_y = False
    tRight_x = False
    if (comp_bottom_left_x <= cur_top_right_x <= comp_top_right_x) and (
            comp_bottom_left_y <= cur_bottom_left_y <= comp_top_right_y):
        # print('validation bLeft_y')
        bLeft_y = True
        fullOverlap = True
    else:
        fullOverlap = False
    if (comp_bottom_left_x <= cur_bottom_left_x <= comp_top_right_x) and (
            comp_bottom_left_y <= cur_bottom_left_y <= comp_top_right_y):
        # print('validation bLeftx')
        bLeftx = True
        fullOverlap = True
    else:
        fullOverlap = False
    if (comp_bottom_left_x <= cur_top_right_x <= comp_top_right_x) and (
            comp_bottom_left_y <= cur_top_right_y <= comp_top_right_y):
        # print('validation  tRight_y')
        tRight_y = True
        fullOverlap = True
    else:
        fullOverlap = False
    if (comp_bottom_left_x <= cur_bottom_left_x <= comp_top_right_x) and (
            comp_bottom_left_y <= cur_top_right_y <= comp_top_right_y):
        tRight_x = True
        fullOverlap = True
    else:
        fullOverlap = False
    if (bLeft_y == True) and (bLeftx == True) and (tRight_y == True) and (tRight_x == True):
        # print('validation fully non - overlap ')
        valOverlap = 1
    else:
        if (bLeft_y == True) or (bLeftx == True) or (tRight_y == True) or (tRight_x == True):
            partialOverlap = True
            valOverlap = 2
    return valOverlap


def FindElementRelationship(element_list, onlyPartialOverlap=False):
    child_node_list = []
    parent_nodes = []
    element_set_n = [elem for elem in element_list]
    update_element_set_n = [elem for elem in element_list]
    for cur_ele_ptr in range(len(element_set_n)):
        cur_ele_obj = element_set_n[cur_ele_ptr]
        Found = False
        for comp_ele_ptr in range(len(element_set_n)):
            if comp_ele_ptr != cur_ele_ptr:
                comp_ele_obj = element_set_n[comp_ele_ptr]
                if (DetectOverlapType(cur_ele_obj, comp_ele_obj) == 2) and Found == False:
                    comp_ele_partial_OverlapNode = comp_ele_obj.partialOverlapNode
                    comp_ele_partial_OverlapNode.append(int(cur_ele_obj.element_no))
                    comp_ele_obj.partialOverlapNode = np.array(np.unique(comp_ele_partial_OverlapNode)).tolist()
                    cur_ele_obj_partial_OverlapNode = cur_ele_obj.partialOverlapNode
                    cur_ele_obj_partial_OverlapNode.append(int(comp_ele_obj.element_no))
                    cur_ele_obj.partialOverlapNode = np.array(np.unique(cur_ele_obj_partial_OverlapNode)).tolist()
                    # print('overlap element_no', cur_ele_obj.element_no, ', ',comp_ele_obj.element_no)
                else:
                    if (DetectOverlapType(cur_ele_obj,
                                          comp_ele_obj) == 1) and Found == False and onlyPartialOverlap == False:
                        parent_node = cur_ele_obj.parent_node
                        child_list = comp_ele_obj.child_node
                        if parent_node == []:
                            print('child', cur_ele_obj.element_no)
                            print('parent', comp_ele_obj.element_no)
                            child_list.append(cur_ele_obj.element_no)
                            cur_ele_obj.parent_node = comp_ele_obj.element_no
                            comp_ele_obj.child_node = np.array(np.unique(child_list)).tolist()
                            parent_nodes.append((comp_ele_obj.element_no, comp_ele_ptr))
                            child_node_list.append((cur_ele_obj.element_no, cur_ele_ptr))
                            Found = True
                            break
                        else:
                            print('child element no', cur_ele_obj.element_no)
                            print('already has a parent')
        if Found == True:
            update_element_set_n[comp_ele_ptr] = comp_ele_obj
            update_element_set_n[cur_ele_ptr] = cur_ele_obj
    return update_element_set_n


def MSERRegionValidation(region, imgIn, min_region_area=10, min_region_width=10, min_region_height=10):
    validation = False
    widthIn, heightIn = np.shape(imgIn)
    areaIn = widthIn * heightIn
    top_left = np.min(region, axis=0)
    bottom_right = np.max(region, axis=0)
    height = bottom_right[0] - top_left[0]
    width = bottom_right[1] - top_left[1]
    area = mag(width * height)
    ratio = area / areaIn
    # print('region area ratio', ratio)
    #     print(' min_region_height', width)
    #     print('min_region_width',height)
    if (height > min_region_height) and (width > min_region_width):
        if (0.01 > ratio > 0.0001):
            #        print('validation true')
            validation = True
    return validation


def SearchElementNo(elementNo, elementList):
    countx = 0
    inx = None
    for eleSearch in elementList:
        if (int(eleSearch.element_no) == int(elementNo)):
            #          print('found element')
            inx = countx
            break
        countx += 1
    return inx


def CreateElementObjectfromMSERRegion(region, imgIn, element_no):
    element_obj = element(element_no, [], [], [], [], [], [], [], [], [], [], [], [], [], [], [])
    #    bottom_left_y, bottom_left_x, top_right_y, top_right_x
    top_left = np.min(region, axis=0)
    bottom_right = np.max(region, axis=0)
    height = bottom_right[0] - top_left[0]
    width = bottom_right[1] - top_left[1]
    if width < 0 or height < 0:
        print('negative dimensions')
    element_obj.bbox = top_left[1], top_left[0], bottom_right[1], bottom_right[0]
    element_obj.threshold_img = []
    element_obj.fill_BW = []
    crop_region = (top_left[0], top_left[1], bottom_right[0], bottom_right[1])
    element_obj.crop_img = imgIn.crop(crop_region)
    element_obj.threshold_val = []
    element_obj.MSER = True
    element_obj.pix_coords = region
    element_obj.bbox_area = mag(height * width)
    return element_obj


def MultiThresholdGen(croppedElemRootFolder,img_scharr, img, img_gray, start_pt, incr, start_element_no=0, tolerance=30, dilaIterations=2,
                      kernel=np.ones((3, 3), np.uint8)):
    element_list_n = []
    thresh_img_list_n = []
    inv_fill_img_list_n = []
    thresh_val_list = []
    element_no = start_element_no
    next_pt = start_pt
    iters = 2  # np.uint(start_pt / incr)
    for x in range(iters):
        if x == 0:
            thresh_val_list.append(5)
        else:
            thresh_val_list.append(30)
        #next_pt -= incr
    for thresh_val in thresh_val_list:
        thresh_img, inv_fill_img = variable_threshold(img_scharr, thresh_val, True)
        # kernel = np.ones((3,3),np.uint8)
        thresh_img_dilate = cv2.dilate(thresh_img, kernel, dilaIterations)
        thresh_img_list_n.append((thresh_img, thresh_val))
        inv_fill_img_list_n.append((inv_fill_img, thresh_val))
        for region in regionprops(label(thresh_img_dilate)):
            if RegionValidation(region, img_gray):
                element_list_n.append(
                    CreateElementObjectfromRegion(region, img, element_no, thresh_img, inv_fill_img, thresh_val,croppedElemRootFolder, 'tresh', thresh_val))
                #         print('element_no', element_no)
                element_no += 1
    # tolerance = 30
    unique_element_list_nx = RemoveOverlapElements(element_list_n, tolerance)
    sort_unique_element_list = SortListOnElementArea(unique_element_list_nx)
    return sort_unique_element_list


def MSERGen(img_scharr, img, img_gray, min_area, start_element_no=0, tolerance=5, dilaIterations=2,
            kernel=np.ones((3, 3), np.uint8)):
    element_no = start_element_no
    element_list_n_MSER = []
    img_sch_norm = img_scharr / img_scharr.max()
    img_sch_uint = np.uint8(np.round(img_sch_norm * 255))
    # kernel = np.ones((3,3),np.uint8)
    thresh_img_dilate = cv2.dilate(img_sch_uint, kernel, dilaIterations)
    mser = cv2.MSER_create(_min_area=min_area)
    regions, mat = mser.detectRegions(thresh_img_dilate)
    height, width = np.shape(img_gray)
    img_ref = np.zeros((height, width), dtype=np.uint8)
    img_ele = np.zeros((height, width), dtype=np.uint8)
    for region in regions:
        if MSERRegionValidation(region, img_gray) == True:
            elem = CreateElementObjectfromMSERRegion(region, img, element_no)
            element_list_n_MSER.append(elem)
            [min_y, min_x, max_y, max_x] = elem.bbox
            img_ele[min_y:max_y, min_x:max_x] = 1
            img_ref = np.add(img_ele, img_ref)
            #    print('element_no', element_no)
            element_no += 1
    unique_element_list_nx = RemoveOverlapElements(element_list_n_MSER, tolerance)
    sort_unique_element_list = SortListOnElementArea(unique_element_list_nx)
    return sort_unique_element_list, img_ref


def GroupConnectedElements(elementListTree, inputList=True):
    overlapClusterList = []
    overlapNodes = []
    overlapNodeSize = []
    for elemX in elementListTree:
        node_list_unique = []
        if inputList == True:
            if (elemX.partialOverlapNode != []):
                # remove element  duplicates in the list
                node_list = elemX.partialOverlapNode
                node_list.append(int(elemX.element_no))
                node_list_unique = list(np.unique(node_list))

                overlapNodeSize.append(len(node_list_unique))
                overlapNodes.append((np.sort(node_list_unique)).tolist())
        else:
            node_list_unique = list(np.unique(elemX))
            overlapNodeSize.append(len(node_list_unique))
            overlapNodes.append((np.sort(node_list_unique)).tolist())
            #            node_list_unique = np.unique(elemX)
        print('node len', len(node_list_unique))
        print('node set', node_list_unique)

    noOfOverlaps = np.unique(overlapNodeSize)
    if len(noOfOverlaps) == 1:
        lenSortNodes = list(np.unique(overlapNodes, axis=0))
    else:
        lenSortNodes = list(np.unique(overlapNodes))
        # find clusters using similar overlapping elements
    lenSortNodes_ref = [elemT for elemT in lenSortNodes]
    lenSortNodes_update = [elemY for elemY in lenSortNodes]
    clusterNodeSize = []
    for list_set_ref in lenSortNodes_ref:
        len_set_ref = len(list_set_ref)
        ptr = 0
        for list_set_comp in lenSortNodes_update:
            len_set_comp = len(list_set_comp)
            uq_comb_list = np.unique(list(list(list_set_ref) + list(list_set_comp)))
            uq_comb_len = len(uq_comb_list)
            tot = len_set_comp + len_set_ref
            # print('list_set_ref',list_set_ref)
            # print('list_set_comp',list_set_comp)
            # print('uq_comb_list',uq_comb_list)
            # print('uq_comb_len',uq_comb_len)
            # print('tot',tot)
            if (tot > uq_comb_len):
                #   print('updated list')
                lenSortNodes_update[ptr] = list(np.sort(uq_comb_list))
                clusterNodeSize.append(len(lenSortNodes_update[ptr]))
            ptr += 1
    noOfClustersSetsSize = np.unique(clusterNodeSize)
    if len(noOfClustersSetsSize) == 1:
        overlapClusterList = list(np.unique(lenSortNodes_update, axis=0))
    else:
        overlapClusterList = list(np.unique(lenSortNodes_update))

    return overlapClusterList


def compVal(refVal, compVal, minComp=True):
    newVal = refVal
    if refVal > compVal and minComp == True:
        newVal = compVal
    if refVal < compVal and minComp == False:
        newVal = compVal
    return newVal




def BigElements(elementList):
    lenSortNodes_prev = [elemT for elemT in elementList]
    lenSortNodes_next = [elemT for elemT in elementList]
    prev_len = len(lenSortNodes_prev)
    next_len = prev_len
    count = 0
    while (prev_len - next_len) > 0 or count == 0:
        diff = prev_len - next_len
        # print('diff', diff)
        # print('next_len',next_len)
        # print('prev_len',prev_len)
        prev_len = next_len
        lenSortNodes_prev = lenSortNodes_next
        if count == 0:
            lenSortNodes_next = GroupConnectedElements(lenSortNodes_prev, True)
        else:
            lenSortNodes_next = GroupConnectedElements(lenSortNodes_prev, False)
        next_len = len(lenSortNodes_next)
        count += 1

    clusterGroups = [elem for elem in lenSortNodes_next if len(elem) > 1]
    if len(clusterGroups) == 0 and len(lenSortNodes_next) > 0:
        print('viols')
        clusterGroups = []
        clusterGroups.append(lenSortNodes_next)

    bigElements = []
    elementObjs = []
    # convert each cluster in to a big element
    if clusterGroups != []:
        if len(clusterGroups) > 0:
            for cluster in clusterGroups:
                min_y = []
                min_x = []
                max_y = []
                min_x = []
                count = 0
                elementObjs_set = []
                for elemNo in cluster:
                    ptr = SearchElementNo(elemNo, elementList)
                    elem = elementList[ptr]
                    elementObjs_set.append(elem)
                    ymin = []
                    xmin = []
                    ymax = []
                    xmax = []
                    if count == 0:
                        [min_y, min_x, max_y, max_x] = elem.bbox
                    else:
                        [ymin, xmin, ymax, xmax] = elem.bbox
                        min_y = compVal(min_y, ymin, True)
                        min_x = compVal(min_x, xmin, True)
                        max_y = compVal(max_y, ymax, False)
                        max_x = compVal(max_x, xmax, False)
                    count += 1
                    # print('min_y',min_y)
                # print('min_x',min_x)
                # print('max_y',max_y)
                # print('max_x',max_x)
                bigElements.append([min_y, min_x, max_y, max_x])
                elementObjs.append(elementObjs_set)
        else:
            # print('llala')
            min_y = []
            min_x = []
            max_y = []
            max_x = []
            count = 0
            elementObjs_set = []
            for elemNo in lenSortNodes_next:
                # print('ahahah')
                ptr = SearchElementNo(int(elemNo), elementList)
                elem = elementList[ptr]
                elementObjs_set.append(elem)
                ymin = []
                xmin = []
                ymax = []
                xmax = []
                if count == 0:
                    [min_y, min_x, max_y, max_x] = elem.bbox
                else:
                    [ymin, xmin, ymax, xmax] = elem.bbox
                    min_y = compVal(min_y, ymin, True)
                    min_x = compVal(min_x, xmin, True)
                    max_y = compVal(max_y, ymax, False)
                    max_x = compVal(max_x, xmax, False)
                # print('min_y',min_y)
                # print('min_x',min_x)
                # print('max_y',max_y)
                # print('max_x',max_x)
                count += 1
            bigElements.append([min_y, min_x, max_y, max_x])
            elementObjs.append(elementObjs_set)
    else:
        print('no overalpping elements')
    return bigElements, clusterGroups, elementObjs


def ElementInspection(elem, imgHeight, imgWidth):
    img_zeros = np.zeros((imgHeight, imgWidth), dtype=np.uint8)
    pixelCords = elem.pix_coords
    img_zeros[pixelCords[0], pixelCords[1]] = 1
    im2, contours, hierarchy = cv2.findContours(img_zeros.copy(), cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    cnt = contours[0]
    approx = cv2.approxPolyDP(cnt, 0.01 * cv2.arcLength(cnt, True), True)
    img_fill = ndimage.binary_fill_holes(img_zeros).astype(int)
    fillRatio = np.sum(img_fill) / np.sum(img_zeros)
    diff = np.sum(img_fill - img_zeros)
    nonFillRatio = np.divide(diff, (imgHeight * imgWidth))
    lenEqn = len(approx)
    return nonFillRatio, fillRatio, lenEqn, img_fill

#### CNN inception##########


def clusterInspection(elementCluster, scoreThresh=0.75, minAvgVal=0.6):
        scoreList = []
        labeList = []
        elementList = []
        elemcnt = 0
        label_list = ['rectangle', 'barchart', 'calendar', 'icon', 'logo', 'maps', 'piechart']
        score_array = np.zeros((len(label_list)))
        for elemGy in elementCluster:
            print('big_elementList', elemGy.parent_node)
            print('cnn score', elemGy.cnnScore)
            print('cnn label', elemGy.cnnLabel)
            scoreList.append(elemGy.cnnScore)
            labeList.append(elemGy.cnnLabel)
            elementList.append(elemGy.element_no)
            if elemGy.cnnScore > scoreThresh:
                label_cnt = 0
                for label in label_list:
                    if elemGy.cnnLabel == label:
                        score_array[label_cnt] += 1
                    label_cnt += 1
            elemcnt += 1
        avgScoreArray = np.divide(score_array, elemcnt)
        highestLabel = label_list[np.argmax(avgScoreArray)]
        newGroupElemList = []
        unVerifiedElemList = []
        print('Maxmium avgerage error' , np.max(avgScoreArray))
        if np.max(avgScoreArray) > minAvgVal:
            print('highest Label', highestLabel)
            for elemTA in elementCluster:
                if elemTA.cnnLabel == highestLabel and elemGy.cnnScore > scoreThresh:
                    newGroupElemList.append(elemTA)
                else:
                    unVerifiedElemList.append(elemTA)
                    print('found some problemss #####44444444############')
        else:
            unVerifiedElemList = [elemT for elemT in elementCluster]
        return newGroupElemList, unVerifiedElemList
def groupClusterInspection(bigelementObjsY,scoreThresh = 0.75,minAvgVal=0.6):
    groupClusterList =[]
    unverifiedList = []
    for bigelementListA in bigelementObjsY:
         groupCluster,unverified = clusterInspection(bigelementListA,scoreThresh,minAvgVal)
         groupClusterList.append(groupCluster)
         unverifiedList.append(unverified)
    return groupClusterList,unverifiedList
def createBigElem(bigelementObjs,list_len_multhresh_relate,img,croppedElemRootFolder):
    comb_big_elem_list = []
    count_ele=1
    for  bigelementListLp in bigelementObjs:
        xArr = np.asarray([])
        yArr = np.asarray([])
        for elemListH in bigelementListLp:
            coord_arr = elemListH.pix_coords
            yArr = coord_arr[1,:]
            xArr = coord_arr[0,:]
            print('bigelems _X ',np.max(xArr))
            print('bigelems _Y',np.max(yArr))
            xArr = np.concatenate((xArr, coord_arr[0,:]), axis=0)
            yArr = np.concatenate((yArr, coord_arr[1,:]), axis=0)
            print('len yArr', len(yArr))
            print('len xArr', len(xArr))
        xMin = np.min(xArr)
        xMax = np.max(xArr)
        yMin = np.min(yArr)
        yMax = np.max(yArr)
        # new_element_no = len(multThreshRelateList) + count_ele
        new_element_no = list_len_multhresh_relate + count_ele
        bbox = xMin,yMin,xMax,yMax
        print('********* big bbox ************',xMin,yMin,xMax,yMax)
        # pix_mat = np.zeros((2,))
        pix_coords = np.ndarray((len(xArr),2))
        pix_coords[:,0] = xArr
        pix_coords[:,1] = yArr
        area  = (xMax - xMin)* (yMax - yMin)
        print('shape pix_coords', np.shape(pix_coords))
        regionTemp=regionR(bbox,pix_coords,area)
        elemObj_new = CreateElementObjectfromRegion(regionTemp,img,new_element_no, [] ,[], 0,croppedElemRootFolder, 'big', '1')
        comb_big_elem_list.append(elemObj_new)
        count_ele+=1
    return comb_big_elem_list
def generateDeleteIndexArray(deleteList,refdeleteList):
    deleteIndex = []
    for elemList in refdeleteList:
        for elem in elemList:
            deleteIndex.append(SearchElementNo(elem.element_no, deleteList))
    updatedList = []
    print('deleteIndex',deleteIndex)
    x=0
    for elemP in deleteList:
        found = False
        for idx in deleteIndex:
            if  x == idx:
                found= True
                print('element no deleted', elemP.element_no)
        x+=1
        if found == False:
            updatedList.append(elemP)
    return updatedList
def nonOverlapElem(InputList,width,height):
    nonOverlapUnverified = []
    del_nonOverlapUnverified  =[]
    tot_nonOverlapUnverified = []
    for elemH  in InputList:
        areaRatio = (elemH.bbox_area) / (width*height)
        if elemH.cnnScore < 0.6:
            nonOverlapUnverified.append(elemH)
            print('elemH.parent_node bla lolzzzzzz')
            if elemH.parent_node!=[]:
                print('something is null haha', elemH.parent_node)
                print('label CNN', elemH.cnnLabel)
                print('label CNN', elemH.cnnScore)
                del_nonOverlapUnverified.append(elemH)
            else:
                tot_nonOverlapUnverified.append(elemH)
        else:
            tot_nonOverlapUnverified.append(elemH)
    return tot_nonOverlapUnverified


def segmentationFirstLayer(myFile_name, inputImgPath, tensorflow_model_v):
    from apps.virtualize.segmentation.inference_segmentation import cocoTextDetection_model,tensorflowClassDetection_model
    from copy import deepcopy
    with Image.open(inputImgPath) as img:
        width, height = img.size
    print('width' + str(width))
    print('height' + str(height))

    img = Image.open(inputImgPath)
    # croppedElemRootFolder = "C:/Users/ramitha/Desktop/Adevi/Images/folderSegImg/" + str(myFile) + str(
    #     np.random.randint(1, 50, size=1)[0]) + "/"
    print('myfilename')
    print(myFile_name)
    croppedElemRootFolder = myFile_name
    print(croppedElemRootFolder)
    if not os.path.exists(croppedElemRootFolder):
        os.makedirs(croppedElemRootFolder)
    img_gray = cv2.cvtColor(np.asarray(img), cv2.COLOR_BGR2GRAY)
    img_scharr = scharr(img_gray)
    start_pt = 30
    incr = 5
    multThreshList = MultiThresholdGen(croppedElemRootFolder,img_scharr, img, img_gray, start_pt, incr)
    multThreshRelateList = FindElementRelationship(multThreshList,False)
    # cnnUpdatedElem, elemCNNList = runCNN(multThreshRelateList)
    cnnUpdatedElem, elemCNNList = tensorflowClassDetection_model(multThreshRelateList, tensorflow_model_v)
    bigElements, clusterGroups_Elementno, bigelementObjs = BigElements(cnnUpdatedElem)
    print('big element list', len(bigelementObjs))
    if len(bigelementObjs)>0:
        groupClusterList,unverifiedList = groupClusterInspection(bigelementObjs)
        comb_big_elem_list = createBigElem(bigelementObjs,len(multThreshRelateList),img,croppedElemRootFolder)
        print(' ******* unverified list *******',len(unverifiedList))
        print('&&&& group cluster $$$$$', len(groupClusterList))
        refdeleteList = list(unverifiedList) + list(groupClusterList)
        updatedList = generateDeleteIndexArray(multThreshList,refdeleteList)
        # check for non overlapping elements
        nonOverlapUnverified  = nonOverlapElem(updatedList,width,height)
        first_process = list(nonOverlapUnverified) + list(comb_big_elem_list)
    else:
        first_process = nonOverlapElem(cnnUpdatedElem, width, height)
    # coco text detection
    listElemNo = []
    for elemP in first_process:
        listElemNo.append(elemP.element_no)
    maxElem = np.max(np.asarray(listElemNo))
    maxElem+=1
    # cocoBbox = cocoTextDetection(img)
    # cocoBbox = cocoTextDetection_model(img,coco_model_v)
    # cocoBbox = cocoTextDetection_model(inputImgPath)
    cocoBbox = text_detection(inputImgPath,'apps/virtualize/segmentation/OCR_Segmentation/frozen_east_text_detection.pb', 0.1, 960, 960)

    next_Elem = maxElem
    cocoList = []
    for bbox in cocoBbox:
        element_obj = element(next_Elem, [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [])
        element_obj.coco_update_element(bbox)
        cocoList.append(element_obj)
        next_Elem +=1
     # end coco detection
    clear_new_first_process = []
    for elemhy in first_process:
        newElemhy = deepcopy(elemhy)
        newElemhy.parent_node =[]
        newElemhy.child_node = []
        newElemhy.partialOverlapNode =[]
        clear_new_first_process.append(newElemhy)
    new_first_process = cocoList + clear_new_first_process
    multThreshRelateList_coco_update = FindElementRelationship(new_first_process,False)
    coco_bigElements, coco_clusterGroups_Elementno, coco_bigelementObjs = BigElements(multThreshRelateList_coco_update)
    updatedList_nonBigs = generateDeleteIndexArray(multThreshRelateList_coco_update,coco_bigelementObjs)
    updated_cocoList = []
    next_Elem=100
    for bbox in coco_bigElements:
        element_obj = element(next_Elem, [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [])
        element_obj.coco_update_element(bbox)
        updated_cocoList.append(element_obj)
        next_Elem +=1
    coco_final_combo = updated_cocoList + updatedList_nonBigs
    Overlap_coco_nonBigs = []
    updated_cocoList_modify = []
    coco_elem_no = 0
    coco_elem_no_list = []
    coco_elem_bbx_list = []
    Overlap_coco_nonBigs_elem_no = []
    for coco_elem in updated_cocoList:
        coco_area = 0
        CminX, CminY, CmaxX, CmaxY = coco_elem.bbox
        coco_area = (CmaxX - CminX) * (CmaxY - CminY)
        non_coco_elem_no = 0
        for non_coco_elem in updatedList_nonBigs:
            keep_condition = False
            non_coco_area = 0
            minX, minY, maxX, maxY = non_coco_elem.bbox
            non_coco_area = (maxX - minX) * (maxY - minY)
            if coco_area > non_coco_area:
                Overlap_coco_nonBigs.append(non_coco_elem)
                if DetectOverlapType(coco_elem, non_coco_elem) == 1 or DetectOverlapType(non_coco_elem, coco_elem) == 1:
                    Overlap_coco_nonBigs_elem_no.append(non_coco_elem_no)
                    Overlap_coco_nonBigs.append(non_coco_elem)
                    keep_condition = True
                    print('overlap between coco and  non-coco')
                    print('&&&&&&&&&DetectOverlapType(coco_elem,non_coco_elem)',
                          DetectOverlapType(coco_elem, non_coco_elem))
                    print('&&&&&&&&&DetectOverlapType(non_coco_elem,coco_elem)',
                          DetectOverlapType(non_coco_elem, coco_elem))
                if DetectOverlapType(coco_elem, non_coco_elem) == 2 or DetectOverlapType(non_coco_elem, coco_elem) == 2:
                    print('partial overlap between coco and  non-coco')
                    try:
                        mod_minY = np.min(CminY, minY)
                        mod_maxY = np.max(CmaxY, maxY)
                        mod_minX = np.min(CminX, minX)
                        mod_maxX = np.max(CmaxX, maxX)
                    except:
                        mod_minY = CminY
                        if CminY>minY:
                            mod_minY = minY
                        mod_maxY = maxY
                        if CmaxY>maxY:
                            mod_maxY = CmaxY
                        mod_minX = CminX
                        if CminX>minX:
                            mod_minX = minX
                        mod_maxX = maxX
                        if CmaxX > maxX:
                            mod_maxX = CmaxX
                    bbox = mod_minX, mod_minY, mod_maxX, mod_maxY
                    coco_elem_bbx_list.append(bbox)
                    coco_elem_no_list.append(coco_elem_no)
            non_coco_elem_no += 1
        coco_elem_no += 1
    new_updated_cocoList = [elemT for elemT in updated_cocoList]
    y_count = 0
    for elem_no in coco_elem_no_list:
        elemT = new_updated_cocoList[elem_no]
        elemT.bbox = coco_elem_bbx_list[y_count]
        new_updated_cocoList[elem_no] = elemT
        y_count += 1
    list_Overlap_coco_nonBigs = []
    list_Overlap_coco_nonBigs.append(Overlap_coco_nonBigs)

    # finalForm_updatedList_nonBigs = generateDeleteIndexArray(updatedList_nonBigs,list_Overlap_coco_nonBigs)
    print('*********************delete elemno list from the overlap-coco-nonBis', Overlap_coco_nonBigs_elem_no)
    finalForm_updatedList_nonBigs = []
    unique_Overlap_coco_nonBigs_elem_no = list(np.unique(Overlap_coco_nonBigs_elem_no))
    elemR = 0
    for elemT in updatedList_nonBigs:
        foundL = False
        for elem_idx in unique_Overlap_coco_nonBigs_elem_no:
            if elem_idx == elemR:
                foundL = True
        if foundL == False:
            finalForm_updatedList_nonBigs.append(elemT)
        elemR += 1

    finalForm_coco_final_combo = new_updated_cocoList + finalForm_updatedList_nonBigs

    elemCnt = 0
    coco_text_idx = []
    coco_final_combo_bbx = []
    for elem in finalForm_coco_final_combo:
        found_txt = 0
        try:
                if elem.segmentType == 'COCO':
                    found_txt = 1
                    print('elem with some coco ',elemCnt)
        except:
                found_txt = 0
        # remove task bar icons and noise
        minX, minY, maxX, maxY = elem.bbox
        if height > width:
            imgHeightRatio = height * 0.1
        else:
            imgHeightRatio = height * 0.05
        if maxX > imgHeightRatio:
            # if  (maxX-minX)<imgHeightRatio:
            coco_text_idx.append(found_txt)
            coco_final_combo_bbx.append(elem.bbox)
        elemCnt += 1
    return coco_final_combo_bbx
