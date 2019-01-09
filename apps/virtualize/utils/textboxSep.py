# -*- coding: utf-8 -*-
"""
Created on Tue Nov 14 14:38:34 2017

@author: ramitha
"""
########################  START SEGMENTATION, INCEPTION AND OCR ####################

def elementTextboxExtraction(imgObj,noOftextboxes=2,minLineLengthx = 100,maxLineGap = 5,widthTolerance = 0.7,gradTolerance = 0.01,separateLineTolerance = 0.2):
    import cv2
    import numpy as np
    from skimage.morphology import skeletonize
    img_gray = cv2.cvtColor(np.asarray(imgObj), cv2.COLOR_BGR2GRAY)
    height,width = np.shape(img_gray)
    edges = cv2.Canny(img_gray ,20,20,apertureSize = 3)
    kernel = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (3,3))  # to manipulate the orientation of dilution , large x means horizonatally dilating  more, large y means vertically dilating more
    dilated = cv2.dilate(edges, kernel, iterations=2)
    ret,thresh = cv2.threshold(dilated,1,1,cv2.THRESH_BINARY)
    skeletonizeImg = skeletonize(thresh)
    skeletonizeX= np.uint8(skeletonizeImg)*255
    lines = cv2.HoughLinesP(skeletonizeX,1,np.pi/180,5,minLineLengthx,maxLineGap)
    textBoxHeight = np.divide(height,noOftextboxes)
    textBoxSeparatorY = np.zeros((noOftextboxes-1),dtype=np.uint)
    val = 0
    ptx=0
    for x in range(noOftextboxes-1):
        val = val + textBoxHeight
        textBoxSeparatorY[ptx] = val
        ptx+=1
        print('val',val)
    validateLines=[]   
    for line in lines:
        [[x1,y1,x2,y2]] = line
        print('x1,y1,x2,y2',x1,y1,x2,y2)
        linelen = np.sqrt((y2-y1)**2 + (x2-x1)**2)
        print('linelen',linelen)
        if (x2-x1)> 0 and linelen> np.multiply(widthTolerance,width):
            gradient = np.divide((y2-y1),(x2-x1))
            if np.absolute(gradient) < gradTolerance:
                validateLines.append(line)
                print('validated x1,y1,x2,y2',x1,y1,x2,y2)
#                cv2.line(img_hough,(x1,y1),(x2,y2),(0,255,0),5) 
    
    realLines = np.zeros((len(validateLines)),dtype=np.uint)
    ptr = 0
    for vaLine in validateLines:
        [[x1,y1,x2,y2]] = vaLine
        if np.absolute(y2-y1)>0:
             
             realLines[ptr]= int(np.round(np.divide((y2+y1),2)))
             print('lolz',int(np.round(np.divide((y2+y1),2))))
        else:
             realLines[ptr]=y2
             print('norm',y2)
        ptr+=1    
    
    textBoxSeparatorMat = np.repeat(textBoxSeparatorY, len(realLines), axis=0)
    textBoxSeparatorMat = np.transpose(textBoxSeparatorMat.reshape(noOftextboxes-1,len(realLines)))
    #
    realLinesMat = np.repeat(realLines,noOftextboxes-1 , axis=0)
    realLinesMat = realLinesMat.reshape(len(realLines),noOftextboxes-1)
    #
    diff = np.absolute(np.subtract(textBoxSeparatorMat,realLinesMat, dtype= int))
    foundLine= []
    for x in range(noOftextboxes-1):
        try:
            lined = np.argmin(diff[:,x])
        #    foundLine.append(validateLines[lined])
            [[x1,y1,x2,y2]]= validateLines[lined]
            foundLine.append(y2)
        except:
            print('Element is to big.')
    cropImgList= []
    sortFoundline = foundLine
    if len(foundLine)>1:
        sortFoundline = np.sort(foundLine)
    top_left_height = 0
    for lineY in sortFoundline:
        crop_region = [0,top_left_height,width,lineY]
        top_left_height = lineY 
        cropImgList.append(imgObj.crop(crop_region))
        
    crop_region = (0,top_left_height,width,height)
    cropImgList.append(imgObj.crop(crop_region))
    return (cropImgList,foundLine)





