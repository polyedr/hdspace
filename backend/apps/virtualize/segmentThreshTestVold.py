# -*- coding: utf-8 -*-
"""
Created on Wed Dec 13 14:54:13 2017

@author: ramitha
"""


def SegmentationMSERThresh(myFile, savePath=[]):
    from matplotlib import pyplot as plt
    import cv2
    import numpy as np
    from PIL import Image
    from skimage.filters import scharr
    from skimage.measure import label, regionprops
    from skimage.morphology import skeletonize
    from scipy import misc, ndimage

    ########################  START SEGMENTATION, INCEPTION AND OCR ####################

    #
    def RegionValidation(region_vali, imgIn, lowRatio=0.05, highRatio=0.60, min_region_area=1000, min_region_width=10,
                         min_region_height=10):
        validation = False
        widthIn, heightIn = np.shape(imgIn)
        areaIn = widthIn * heightIn
        bottom_left_y, bottom_left_x, top_right_y, top_right_x = region_vali.bbox
        width = top_right_x - bottom_left_x
        height = top_right_y - bottom_left_y
        area = width * height
        ratio = area / areaIn
        print('region area ratio', ratio)
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


    def CreateElementObjectfromRegion(region, imgIn, element_no, thresh_img, inv_fill_img, min_pix_val):
        element_obj = element(element_no, [], [], [], [], [], [], [], [], [], [], [], [], [], [], [])
        element_obj.update_element(region)
        bottom_left_y, bottom_left_x, top_right_y, top_right_x = region.bbox
        element_obj.threshold_img = thresh_img[bottom_left_y:top_right_y, bottom_left_x:top_right_x]
        element_obj.fill_BW = inv_fill_img[bottom_left_y:top_right_y, bottom_left_x:top_right_x]
        crop_region = (bottom_left_x, bottom_left_y, top_right_x, top_right_y)
        #        element_obj.crop_img = imgIn.crop(crop_region)
        element_obj.threshold_val = min_pix_val
        element_obj.MSER = False
        return element_obj


    def ValidationOverlapElement(ref_obj, comp_obj, tolerance):
        ref_bottom_left_y, ref_bottom_left_x, ref_top_right_y, ref_top_right_x = ref_obj.bbox
        comp_bottom_left_y, comp_bottom_left_x, comp_top_right_y, comp_top_right_x = comp_obj.bbox
        validation = False
        if (mag(comp_bottom_left_y - ref_bottom_left_y)) < tolerance and (
        mag(comp_bottom_left_x - ref_bottom_left_x)) < tolerance and (
        mag(comp_top_right_y - ref_top_right_y)) < tolerance and (mag(comp_top_right_x - ref_top_right_x)) < tolerance:
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
            print('len_val', len_val)
            count = 0
            threshold_val_set = []
            threshold_val_set.append(ref_obj.threshold_val)
            for ptr in np.arange(1, len_val, 1):
                print('ptr', ptr)
                comp_obj = ref_element_list[ptr]
                if ValidationOverlapElement(ref_obj, comp_obj, tolerance):
                    del next_ref_element_list[ptr - count]
                    count += 1
                    temp_val = comp_obj.threshold_val
                    threshold_val_set.append(temp_val)
                    if ref_obj.area < comp_obj.area:
                        ref_obj = comp_obj
            print('*** new ref_obj.element_no', ref_obj.element_no)
            print('threshold list', threshold_val_set)
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
            print('count', count)
            print('obj_bbox_area', obj_bbox_area)
            count += 1
        sort_list.sort(key=lambda tup: tup[1], reverse=reverse_srt)
        for ele_obj_srt in sort_list:
            count, obj_bbox_area = ele_obj_srt
            new_list.append(element_list[count])
            print('count', count)
            print('obj_bbox_area', obj_bbox_area)
        return new_list


    def DetectOverlapType(cur_obj, comp_obj, validate_mode=0):
        valOverlap = 0
        fullOverlap = False
        partialOverlap = False
        cur_bottom_left_y, cur_bottom_left_x, cur_top_right_y, cur_top_right_x = cur_obj.bbox
        comp_bottom_left_y, comp_bottom_left_x, comp_top_right_y, comp_top_right_x = comp_obj.bbox
        print('comp_bottom_left_y', comp_bottom_left_y)
        print('cur_bottom_left_y', cur_bottom_left_y)
        print('comp_top_right_y', comp_top_right_y)
        print('comp_top_right_x', comp_top_right_x)
        # check whether the element is with in the parent region or  partial overalap between the two elements
        bLeft_y = False
        bLeftx = False
        tRight_y = False
        tRight_x = False
        if (comp_bottom_left_x <= cur_top_right_x <= comp_top_right_x) and (
                comp_bottom_left_y <= cur_bottom_left_y <= comp_top_right_y):
            print('validation bLeft_y')
            bLeft_y = True
            fullOverlap = True
        else:
            fullOverlap = False
        if (comp_bottom_left_x <= cur_bottom_left_x <= comp_top_right_x) and (
                comp_bottom_left_y <= cur_bottom_left_y <= comp_top_right_y):
            print('validation bLeftx')
            bLeftx = True
            fullOverlap = True
        else:
            fullOverlap = False
        if (comp_bottom_left_x <= cur_top_right_x <= comp_top_right_x) and (
                comp_bottom_left_y <= cur_top_right_y <= comp_top_right_y):
            print('validation  tRight_y')
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
            print('validation fully non - overlap ')
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
                        comp_ele_obj.partialOverlapNode = comp_ele_partial_OverlapNode
                        cur_ele_obj_partial_OverlapNode = cur_ele_obj.partialOverlapNode
                        cur_ele_obj_partial_OverlapNode.append(int(comp_ele_obj.element_no))
                        cur_ele_obj.partialOverlapNode = cur_ele_obj_partial_OverlapNode
                        print('overlap element_no', cur_ele_obj.element_no, ', ', comp_ele_obj.element_no)
                    else:
                        if (DetectOverlapType(cur_ele_obj,
                                              comp_ele_obj) == 1) and Found == False and onlyPartialOverlap == False:
                            parent_node = cur_ele_obj.parent_node
                            child_list = comp_ele_obj.child_node
                            if parent_node == []:
                                child_list.append(cur_ele_obj.element_no)
                                cur_ele_obj.parent_node = comp_ele_obj.element_no
                                comp_ele_obj.child_node = child_list
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
        print('region area ratio', ratio)
        #     print(' min_region_height', width)
        #     print('min_region_width',height)
        if (height > min_region_height) and (width > min_region_width):
            if (0.01 > ratio > 0.0001):
                print('validation true')
                validation = True
        return validation


    def SearchElementNo(elementNo, elementList):
        countx = 0
        inx = None
        for eleSearch in elementList:
            if (int(eleSearch.element_no) == int(elementNo)):
                print('found element')
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


    def MultiThresholdGen(img_scharr, img, img_gray, start_pt, incr, start_element_no=0, tolerance=30, dilaIterations=2,
                          kernel=np.ones((3, 3), np.uint8)):
        element_list_n = []
        thresh_img_list_n = []
        inv_fill_img_list_n = []
        thresh_val_list = []
        element_no = start_element_no
        next_pt = start_pt
        iters = np.uint(start_pt / incr)
        for x in range(iters):
            thresh_val_list.append(next_pt)
            next_pt -= incr
        for thresh_val in thresh_val_list:
            thresh_img, inv_fill_img = variable_threshold(img_scharr, thresh_val, True)
            # kernel = np.ones((3,3),np.uint8)
            thresh_img_dilate = cv2.dilate(thresh_img, kernel, dilaIterations)
            thresh_img_list_n.append((thresh_img, thresh_val))
            inv_fill_img_list_n.append((inv_fill_img, thresh_val))
            for region in regionprops(label(thresh_img_dilate)):
                if RegionValidation(region, img_gray):
                    element_list_n.append(
                        CreateElementObjectfromRegion(region, img, element_no, thresh_img, inv_fill_img, thresh_val))
                    print('element_no', element_no)
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
                print('element_no', element_no)
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
                print('list_set_ref', list_set_ref)
                print('list_set_comp', list_set_comp)
                print('uq_comb_list', uq_comb_list)
                print('uq_comb_len', uq_comb_len)
                print('tot', tot)
                if (tot > uq_comb_len):
                    print('updated list')
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


    def MSERimgBboxGen(mserImg, img_gray, img, start_element_no, lowRatio=0.0001, highRatio=0.60, min_region_area=10,
                       min_region_width=10, min_region_height=10):
        element_list_n_MSER = []
        element_no = start_element_no
        height, width = np.shape(img_gray)
        mserimgRe = np.zeros((height, width), dtype=np.uint8)
        for region in regionprops(label(mserImg)):
            if RegionValidation(region, img_gray, lowRatio, highRatio, min_region_area, min_region_width,
                                min_region_height):
                elem = CreateElementObjectfromRegion(region, img, element_no, mserImg, mserImg, 1)
                element_list_n_MSER.append(elem)
                [min_y, min_x, max_y, max_x] = elem.bbox
                mserimgRe[min_y:max_y, min_x:max_x] = 1
                print('element_no', element_no)
                element_no += 1
        #    unique_element_list_nx =    RemoveOverlapElements(element_list_n_MSER,tolerance)
        sort_unique_element_list = SortListOnElementArea(element_list_n_MSER)
        return sort_unique_element_list, mserimgRe


    def BigElements(elementList):
        lenSortNodes_prev = [elemT for elemT in elementList]
        lenSortNodes_next = [elemT for elemT in elementList]
        prev_len = len(lenSortNodes_prev)
        next_len = prev_len
        count = 0
        while (prev_len - next_len) > 0 or count == 0:
            diff = prev_len - next_len
            print('diff', diff)
            print('next_len', next_len)
            print('prev_len', prev_len)
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
                    print('min_y', min_y)
                    print('min_x', min_x)
                    print('max_y', max_y)
                    print('max_x', max_x)
                    bigElements.append([min_y, min_x, max_y, max_x])
                    elementObjs.append(elementObjs_set)
            else:
                print('llala')
                min_y = []
                min_x = []
                max_y = []
                max_x = []
                count = 0
                elementObjs_set = []
                for elemNo in lenSortNodes_next:
                    print('ahahah')
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
                        print('min_y', min_y)
                        print('min_x', min_x)
                        print('max_y', max_y)
                        print('max_x', max_x)
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

    class element:
            def __init__(self, element_no, crop_img, threshold_img, fill_BW, threshold_val, area, width, height, bbox,
                         bbox_area, pix_coords, probability, parent_node, child_node, MSER, partialOverlapNode):
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

    img = Image.open(myFile)
    img_gray = cv2.cvtColor(np.asarray(img), cv2.COLOR_BGR2GRAY)
    img_scharr = scharr(img_gray)
    start_pt = 30
    incr = 5
    multThreshList = MultiThresholdGen(img_scharr, img, img_gray, start_pt, incr)
    # multThreshTreeList =  FindElementRelationship(multThreshList)
    multThreshRelateList = FindElementRelationship(multThreshList, True)
    element_no_next = len(multThreshRelateList)
    bigElements, clusterGroups_Elementno, elementObjs = BigElements(multThreshRelateList)
    #### check if big elmentts  are overlapping
    if len(bigElements) > 0:
        height, width = np.shape(img_gray)
        img_bigElements = np.zeros((height, width), dtype=np.uint8)
        img_bigZeros = np.zeros((height, width), dtype=np.uint8)
        for bigElement in bigElements:
            [min_y, min_x, max_y, max_x] = bigElement
            img_bigZeros[min_y:max_y, min_x:max_x] = 1
            img_bigElements = np.add(img_bigZeros, img_bigElements)

        ret, bigThresh = cv2.threshold(img_bigElements, 0, 1, cv2.THRESH_BINARY)
        fig11, ax11 = plt.subplots(figsize=(20, 20))
        plt.imshow(bigThresh, cmap='gray')
        plt.title('img_bigElements')
        bigElementObjects, img = MSERimgBboxGen(bigThresh, img_gray, img, element_no_next, 0.0001, 0.9)

        # find elements inside the bigelements

        keepBigelementNode = []
        newUpdatemultThreshList = []
        insideBigElementsList = []
        width, height = np.shape(img_gray)

        for bigElementObject in bigElementObjects:
            overall_ratio = np.divide(bigElementObject.bbox_area, (width * height))
            insideBigElementsSet = []
            updatemultThreshList = [elemT for elemT in multThreshList]
            for compElem in updatemultThreshList:
                if DetectOverlapType(compElem, bigElementObject) == 1:
                    insideBigElementsSet.append(compElem)
                else:
                    newUpdatemultThreshList.append(compElem)
            updatemultThreshList = newUpdatemultThreshList
            if overall_ratio < 0.4:
                keepBigelementNode.append(bigElementObject)
            insideBigElementsList.append(insideBigElementsSet)
        ######## element inspection

        imgheight, imgWidth = np.shape(img_gray)
        verfifedElements = []
        for insideBigElementsSet in insideBigElementsList:
            for elem in insideBigElementsSet:
                nonFillRatio, fillRatio, lenEqn, img_fillz = ElementInspection(elem, imgheight, imgWidth)
                if lenEqn < 19 and fillRatio > 4:
                    print('verified')
                    verfifedElements.append(elem)

        tree_list_bb = list(verfifedElements + updatemultThreshList + keepBigelementNode)
    else:
        tree_list_bb = multThreshList
    # height,width = np.shape(img_gray)
    # img_thresh = np.zeros((height,width),dtype = np.uint8)
    # img_tot = np.zeros((height,width),dtype = np.uint8)
    #
    # for elem_set in elementObjs:
    #    for elemno in elem_set:
    #        [min_y,min_x,max_y,max_x]=elemno.bbox
    #        img_thresh[min_y:max_y, min_x:max_x] = 1
    #        img_tot= np.add(img_thresh,img_tot)


    # fig10, ax10 = plt.subplots(figsize=(20, 20))
    # plt.imshow(otsu(img_tot),cmap='gray')
    # plt.title('img_tot')

    # bigElements_test = bigElements[1]
    # [min_y,min_x,max_y,max_x]= bigElements_test
    # img_bigElement = img_gray[min_y:max_y, min_x:max_x]
    #
    # fig11, ax11 = plt.subplots(figsize=(20, 20))
    # plt.imshow(img_bigElement,cmap='gray')
    # plt.title('img_bigElement')

    # img_scharr_big = scharr(img_bigElement)
    # start_pt = 30
    # incr =5
    #
    # multThreshListBig =  MultiThresholdGen(img_scharr_big,img_bigElement,img_bigElement,start_pt,incr)

    # snake = active_contour(gaussian(img_bigElement, 3),
    #                       ju, alpha=0.015, beta=10, gamma=0.001)
    #
    ################## work on big element  stuff for later #############
    # height,width = np.shape(img_bigElement)
    # img_zeros = np.zeros((height,width),dtype = np.uint8)
    # elem  = multThreshListBig[7]
    # ju=elem.pix_coords
    ##ju=ju.transpose()
    #
    # img_zeros[ju[0],ju[1]]=1
    ##skeleton = skeletonize(img_zeros)
    # im2, contours, hierarchy  = cv2.findContours(img_zeros.copy(), cv2.RETR_EXTERNAL,cv2.CHAIN_APPROX_SIMPLE)
    # cnt = contours[0]
    # approx = cv2.approxPolyDP(cnt,0.01*cv2.arcLength(cnt,True),True)
    # print('len approx', len(approx))
    ##approx = cv2.approxPolyDP(cnt,0.01*cv2.arcLength(cnt,True),True)
    # fig15, ax15 = plt.subplots(figsize=(7, 7))
    # ax15.imshow(img_zeros, cmap='gray')
    # masklol = np.zeros((height+2, width+2), np.uint8)
    ##fill_tv=cv2.floodFill(img_zeros, masklol, (0,0), 1)
    ##img_zerosab= np.zeros((height,width),dtype = np.uint8)
    ##img_zerosab[ju[0],ju[1]]=1
    # img_zerosab = ndimage.binary_fill_holes(img_zeros).astype(int)
    # ratio_lolz = np.sum(img_zerosab)/np.sum(img_zeros)
    # fig16, ax16 = plt.subplots(figsize=(7, 7))
    # ax16.imshow(img_zerosab)
    # print('ratio_lolz',ratio_lolz)
    ############### end big element stuff for later ###################

    # for  elem in multThreshListBig:


    # ju=ju.transpose()
    # ax15.plot(ju[:, 1], ju[:, 0], '--r', lw=3)
    # ax15.plot(snake[:, 1], snake[:, 0], '-b', lw=3)
    # ax15.set_xticks([]), ax15.set_yticks([])
    # ax15.axis([0, img.shape[1], img.shape[0], 0])

    # fig14, ax14 = plt.subplots(figsize=(20, 20))
    # colors = 'yellow', 'red', 'blue', 'brown', 'green'
    # plt.imshow(img_bigElement,cmap='gray')
    # plt.title('multThreshList')
    # x=0
    # for elementx in multThreshListBig:
    #    minr, minc, maxr, maxc = elementx.bbox
    #    area = elementx.bbox_area
    #    print('elementx.bbox_area',elementx.bbox_area)
    #    rectx = mpatches.Rectangle((minc, minr), maxc - minc, maxr - minr,
    #                                      fill=False, edgecolor=colors[x%5], linewidth=2)
    #    ax14.add_patch(rectx)
    #    x+=1

    ######## loaded already#######
    img = Image.open(myFile)
    mserStartElementno = len(multThreshList) + 10
    minx_area = 80
    mserGenList, mserImg = MSERGen(img_scharr, img, img_gray, minx_area)
    MSERimgListA, mserimgReA = MSERimgBboxGen(mserImg, img_gray, img, mserStartElementno)
    MSERimgList, mserimgReB = MSERimgBboxGen(mserimgReA, img_gray, img, mserStartElementno)
    tree_list_bb = tree_list_bb + MSERimgList
    ########################################
    multElemBboxList = []
    mserElemBboxList = []
    for elembb in tree_list_bb:
        multElemBboxList.append(elembb.bbox)
    for Melembb in MSERimgList:
        mserElemBboxList.append(Melembb.bbox)
    #    final_tree =  multElemBboxList +  mserElemBboxList
    finalObjList = list(multElemBboxList)
    count = 0
    if savePath != []:
        for elemT in finalObjList:
            file_name = savePath + '/croppedElementno' + str(count) + '.jpg'
            bottom_left_y, bottom_left_x, top_right_y, top_right_x = elemT
            crop_region = (bottom_left_x, bottom_left_y, top_right_x, top_right_y)
            cropImg = img.crop(crop_region)
            misc.imsave(file_name, cropImg)
            count += 1
    #            cropImgFile = elemT.crop_img
    #            cropImgFile.save(file_name,'jpg')
    return multElemBboxList, mserElemBboxList
# import matplotlib
# from matplotlib import  pyplot as plt
# import matplotlib.patches as mpatches
# from PIL import Image
# matplotlib.use('TkAgg')
# myFile = '/Users/Victor/Desktop/Houses/facebooklogin.jpg'
# savePath = '/Users/Victor/Desktop/Houses/cropped'
# multList,MSERList = SegmentationMSERThresh(myFile,savePath)
# fullList = multList
# print('Numbers of list')
# print(len(multList))
# print(len(MSERList))
# img = Image.open(myFile)
# fig3, ax3 = plt.subplots(figsize=(20, 20))
# colors = 'yellow', 'red', 'blue', 'brown', 'green'
# plt.imshow(img)
# plt.title('tree_list_bb')
# x=0
# for elementx in fullList:
#     minr, minc, maxr, maxc = elementx
#     #area = elementx.bbox_area
#     #print('elementx.bbox_area',elementx.bbox_area)
#     rectx = mpatches.Rectangle((minc, minr), maxc - minc, maxr - minr,
#                                       fill=False, edgecolor=colors[x%5], linewidth=2)
#     ax3.add_patch(rectx)
#     x+=1
# plt.show()
    ################Mult thersh hold display@@@@@@@@@@@@@@@@@@@@@
    #
    #
#    fig5, ax5 = plt.subplots(figsize=(20, 20))
#    plt.imshow(img_gray,cmap='gray')
#    plt.title('img_gray')
#    fig20, ax20 = plt.subplots(figsize=(20, 20))
#    plt.imshow(bigElemImg,cmap='gray')
#    plt.title('bigElemImgX')


#    fig27, ax27 = plt.subplots(figsize=(20, 20))
#    colors = 'yellow', 'red', 'blue', 'brown', 'green'
#    plt.imshow(img_gray,cmap='gray')
#    plt.title('newElementListLopObj')
#    x=0
#    for elementx in  newElementListLopObj:
#        minr, minc, maxr, maxc = elementx.bbox
#        area = elementx.bbox_area
#        print('elementx.bbox_area',elementx.bbox_area)
#        rectx = mpatches.Rectangle((minc, minr), maxc - minc, maxr - minr,
#                                          fill=False, edgecolor=colors[x%5], linewidth=2)
#        ax27.add_patch(rectx)
#        x+=1
#
#    fig26, ax26 = plt.subplots(figsize=(20, 20))
#    colors = 'yellow', 'red', 'blue', 'brown', 'green'
#    plt.imshow(img_gray,cmap='gray')
#    plt.title('ElementListLopObj')
#    x=0
#    for elementx in  ElementListLopObj:
#        minr, minc, maxr, maxc = elementx.bbox
#        area = elementx.bbox_area
#        print('elementx.bbox_area',elementx.bbox_area)
#        rectx = mpatches.Rectangle((minc, minr), maxc - minc, maxr - minr,
#                                          fill=False, edgecolor=colors[x%5], linewidth=2)
#        ax26.add_patch(rectx)
#        x+=1
#
#    fig23, ax23 = plt.subplots(figsize=(20, 20))
#    colors = 'yellow', 'red', 'blue', 'brown', 'green'
#    plt.imshow(img_gray,cmap='gray')
#    plt.title('updatemultThreshList')
#    x=0
#    for elementx in  updatemultThreshList:
#        minr, minc, maxr, maxc = elementx.bbox
#        area = elementx.bbox_area
#        print('elementx.bbox_area',elementx.bbox_area)
#        rectx = mpatches.Rectangle((minc, minr), maxc - minc, maxr - minr,
#                                          fill=False, edgecolor=colors[x%5], linewidth=2)
#        ax23.add_patch(rectx)
#        x+=1
#
#    fig22, ax22 = plt.subplots(figsize=(20, 20))
#    colors = 'yellow', 'red', 'blue', 'brown', 'green'
#    plt.imshow(img_gray,cmap='gray')
#    plt.title('verfifedElementsOverlap')
#    x=0
#    for elementx in  verfifedElementsOverlap:
#        minr, minc, maxr, maxc = elementx.bbox
#        area = elementx.bbox_area
#        print('elementx.bbox_area',elementx.bbox_area)
#        rectx = mpatches.Rectangle((minc, minr), maxc - minc, maxr - minr,
#                                          fill=False, edgecolor=colors[x%5], linewidth=2)
#        ax22.add_patch(rectx)
#        x+=1
#

#    fig8, ax8 = plt.subplots(figsize=(20, 20))
#    colors = 'yellow', 'red', 'blue', 'brown', 'green'
#    plt.imshow(img_gray,cmap='gray')
#    plt.title('multThreshRelateList')
#    x=0
#    for elementx in  multThreshRelateList:
#        minr, minc, maxr, maxc = elementx.bbox
#        area = elementx.bbox_area
#        print('elementx.bbox_area',elementx.bbox_area)
#        rectx = mpatches.Rectangle((minc, minr), maxc - minc, maxr - minr,
#                                          fill=False, edgecolor=colors[x%5], linewidth=2)
#        ax8.add_patch(rectx)
#        x+=1
#
#
#    fig12, ax12 = plt.subplots(figsize=(20, 20))
#    colors = 'yellow', 'red', 'blue', 'brown', 'green'
#    plt.imshow(img_gray,cmap='gray')
#    plt.title('filtBigElementobjsComb')
#    x=0
#    for elementx in  filtBigElementobjsComb:
#        minr, minc, maxr, maxc = elementx.bbox
#        area = elementx.bbox_area
#        print('elementx.bbox_area',elementx.bbox_area)
#        rectx = mpatches.Rectangle((minc, minr), maxc - minc, maxr - minr,
#                                          fill=False, edgecolor=colors[x%5], linewidth=2)
#        ax12.add_patch(rectx)
#        x+=1
#
#    fig14, ax14 = plt.subplots(figsize=(20, 20))
#    colors = 'yellow', 'red', 'blue', 'brown', 'green'
#    plt.imshow(img_gray,cmap='gray')
#    plt.title('verfifedElements')
#    x=0
#    for elementx in  verfifedElements:
#        minr, minc, maxr, maxc = elementx.bbox
#        area = elementx.bbox_area
#        print('elementx.bbox_area',elementx.bbox_area)
#        rectx = mpatches.Rectangle((minc, minr), maxc - minc, maxr - minr,
#                                          fill=False, edgecolor=colors[x%5], linewidth=2)
#        ax14.add_patch(rectx)
#        x+=1
#    fig15, ax15 = plt.subplots(figsize=(20, 20))
#    colors = 'yellow', 'red', 'blue', 'brown', 'green'
#    plt.imshow(img_gray,cmap='gray')
#    plt.title('nonverfifedElements')
#    x=0
#    for elementx in  nonverfifedElements:
#        minr, minc, maxr, maxc = elementx.bbox
#        area = elementx.bbox_area
#        print('elementx.bbox_area',elementx.bbox_area)
#        rectx = mpatches.Rectangle((minc, minr), maxc - minc, maxr - minr,
#                                          fill=False, edgecolor=colors[x%5], linewidth=2)
#        ax15.add_patch(rectx)
#        x+=1
#
#    fig21, ax21 = plt.subplots(figsize=(20, 20))
#    colors = 'yellow', 'red', 'blue', 'brown', 'green'
#    plt.imshow(img_gray,cmap='gray')
#    plt.title('unconnectElementobjs')
#    x=0
#    for elementx in  unconnectElementobjs:
#        minr, minc, maxr, maxc = elementx.bbox
#        area = elementx.bbox_area
#        print('elementx.bbox_area',elementx.bbox_area)
#        rectx = mpatches.Rectangle((minc, minr), maxc - minc, maxr - minr,
#                                          fill=False, edgecolor=colors[x%5], linewidth=2)
#        ax21.add_patch(rectx)
#        x+=1
#    fig22, ax22 = plt.subplots(figsize=(20, 20))
#    colors = 'yellow', 'red', 'blue', 'brown', 'green'
#    plt.imshow(img_gray,cmap='gray')
#    plt.title('nonverfifedElementsOvelap')
#    x=0
#    #ch = [nonverfifedElementsOvelap[5]]
#    for elementx in  nonverfifedElementsOverlap:
#        minr, minc, maxr, maxc = elementx.bbox
#        area = elementx.bbox_area
#        print('elementx.bbox_area',elementx.bbox_area)
#        rectx = mpatches.Rectangle((minc, minr), maxc - minc, maxr - minr,
#                                          fill=False, edgecolor=colors[x%5], linewidth=2)
#        ax22.add_patch(rectx)
#        x+=1
######################## mult thresh end @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@

























