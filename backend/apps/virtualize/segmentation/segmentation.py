from apps.virtualize.models import *
from apps.virtualize.segmentation import selectiveSegmentationv4e2
from apps.virtualize.utils.metaCustomUtils import *
from apps.virtualize.utils.screenshotUtils import setScreenshot
from apps.virtualize.segmentation.Inception import inception
from skimage.measure import label, regionprops
from apps.virtualize.segmentation.OCR_Segmentation.Ocr_Segmentation import text_detection


def run(myFile, tensorflow_model, CurrentUser, projectName):

    import numpy as np
    from PIL import Image
    from skimage.filters import threshold_otsu, scharr
    from skimage.segmentation import clear_border
    from skimage.morphology import closing, square
    from skimage import io, color
    import os
    from scipy import ndimage
    from apps.virtualize.utils.metaCustomUtils import save_segmentation, save_ocr, save_inception, childinrange
    from apps.virtualize.segmentation.metaprogramming import metaProgramming

    client = pymongo.MongoClient('localhost', 27017)  # maxPoolSize=50
    db = client.MeduzaDb

    img_raw = Image.open('media/' + str(myFile))
    width, height = img_raw.size
    print('width 1: ' + str(width))
    print('height 1: ' + str(height))
    new_width = int(width * 1.02)
    new_height = int(height * 1.02)
    img = Image.new('RGB', (new_width, new_height), (255, 255, 255))
    img.paste(img_raw, ((new_width - width) // 2, (new_height - height) // 2))
    img.save('media/' + str(myFile))
    with Image.open('media/' + str(myFile)) as img:
        width, height = img.size
    print('width' + str(width))
    print('height' + str(height))

    if 1 == 1:
        imagesRoot = []
        # Get image id and path
        if 1.1 == 1.1:
            collection = findMultiple(db.screenshots, 'image', str(myFile))
            for doc in collection:
                screenId = str(doc['_id'])
                imagesRoot.append(doc['image'])
        screenshotId = screenId
        # identify and set device type
        if 1.2 == 1.2:

            if float(width) >= float(height):
                device = 'WebApp'
            else:
                device = 'MobileApp'
            if db.screenshots.find_one({'image': str(myFile)}) != None:
                db.screenshots.update({'image': str(myFile)}, {
                    '$set':
                    {
                        'device_type': str(device),
                        'original_device_type':str(device)
                    }
                })

        numberOfElements = []
        elementPositioning = []
        elementPositioningPercentage = []
        elementSize = []
        elementCount = []
        croppedLocation = []
        croppedFullLocation=[]
        screenShotIndex = []
        elementName = []

        # RUN SEGMENTATION
        for screen in range(len(imagesRoot)):
            inputImgPath = 'media/' + str(imagesRoot[screen])
            positioning = []  # x an y per cropped element
            index = []
            positioningPercentage = []
            sizePercentage = []
            elementName = str(myFile[:len(myFile) - 4])
            croppedName = str(myFile[int(len(str(CurrentUser))) + 7:-4]) + ".jpg"
            croppedName = str(croppedName[int(len(str(projectName))) + 7:])
            page = Image.open('media/' + str(imagesRoot[screen]))

            # specify in savePath the location where you want to save the cropped elements
            savePath = "media/" + str(elementName) + "/cropped_elements"

        if 0 == 0:
            # Change the original into a 2D array of gray mapping
            image = color.rgb2gray(io.imread('media/' + str(imagesRoot[screen])))

            # apply threshold
            thresh = threshold_otsu(image)
            scharr = scharr(image)
            # bw = closing(image > thresh, square(11))
            # bw = closing((image < thresh) & (image <= scharr * 10), square(10))
            bw = closing((image <= scharr * 30) | (image <= scharr * 20) | (image <= scharr * 10) |
                  (image <= scharr * 5), square(8))

            # remove artifacts connected to image border
            cleared = clear_border(bw)

            # label image regions
            label_image = label(cleared)
            #image_label_overlay = label2rgb(label_image, image=image)

            minX = []
            maxX = []
            minY = []
            maxY = []
            # Get the bbox of each element
            for region in regionprops(label_image):
                if region.area >= 50:
                    # draw rectangle around segmented elements
                    minr, minc, maxr, maxc = region.bbox

                    minY.append(minr)
                    maxY.append(maxr)
                    minX.append(minc)
                    maxX.append(maxc)

            numberOfElements.append(len(minX))
            nbrOfElements = len(minX)
            croppedLocation.append(savePath)

            # loop for cropping all elements, saving them and establish the location of each
            for iterator in range(nbrOfElements):
                # crop elements
                croppedImage = page.crop((minX[iterator], minY[iterator], maxX[iterator], maxY[iterator]))  # -5
                # save all cropped elements as jpg
                if not os.path.exists(savePath):
                    os.makedirs(savePath)
                croppedImage.save(os.path.join(savePath, str(iterator) + ' ' + str(croppedName)))

                positioning.append(['x0:' + str(minX[iterator]), 'y0:' + str(minY[iterator]),
                                    'x1:' + str(maxX[iterator]), 'y1:' + str(maxY[iterator])])
                # get size and size of each element in percentage
                minXSize = float((minX[iterator]) * 100 / width)
                maxXSize = float((maxX[iterator]) * 100 / width)
                xSize = float(maxXSize - minXSize)  # width of screenshot
                minYSize = float((minY[iterator]) * 100 / height)
                maxYSize = float((maxY[iterator]) * 100 / height)
                ySize = float(maxYSize - minYSize)  # height of screenshot

                if (xSize * ySize) >= 120:  # check the element is not too small
                    croppedFullLocation.append(savePath + '/' + str(iterator) + ' ' + str(croppedName))

                positioningPercentage.append({'x0': minXSize, 'y0': minYSize,
                                              'x1': maxXSize, 'y1': maxYSize})
                sizePercentage.append({'horizontal': xSize, 'vertical': ySize})
                index.append(iterator)

            elementPositioning.append(positioning)
            elementPositioningPercentage.append(positioningPercentage)
            elementSize.append(sizePercentage)
            elementCount.append(index)
            screenShotIndex.append(screen)

        if 0 == 1:
            multList = selectiveSegmentationv4e2.segmentationFirstLayer(
                str("media/"+str(elementName)+"/cropped_elements"), inputImgPath, tensorflow_model)
            regionList = list(multList)

            minX = []
            maxX = []
            minY = []
            maxY = []
            for region in regionList:
                minr, minc, maxr, maxc = region

                percentageY = np.round((maxr - minr) * 0.01)
                percentageX = np.round((maxc - minc) * 0.01)

                minY.append(minr)
                maxY.append(maxr)
                minX.append(minc)
                maxX.append(maxc)

            numberOfElements.append(len(minX))
            totalElements = len(minX)
            croppedLocation.append(savePath)

            for element in range(totalElements):
                # crop elements
                croppedImage = page.crop(
                    (minX[element] - 2, minY[element] - 2, maxX[element] + 2, maxY[element] + 2))  # -5
                # save all cropped elements as jpg
                if not os.path.exists(savePath):
                    os.makedirs(savePath)
                croppedImage.save(os.path.join(savePath, str(element) + ' ' + str(croppedName)))

                positioning.append(['x0:' + str(minX[element]), 'y0:' + str(minY[element]),
                                    'x1:' + str(maxX[element]), 'y1:' + str(maxY[element])])
                # get size and size of each element in percentage
                minXSize = float((minX[element]) * 100 / width)
                maxXSize = float((maxX[element]) * 100 / width)
                xSize = float(maxXSize - minXSize)  # width of screenshot
                minYSize = float((minY[element]) * 100 / height)
                maxYSize = float((maxY[element]) * 100 / height)
                ySize = float(maxYSize - minYSize)  # height of screenshot

                if (xSize * ySize) >= 120:  # check the element is not too small
                    croppedFullLocation.append(savePath + '/' + str(element) + ' ' + str(croppedName))

                positioningPercentage.append({'x0': minXSize, 'y0': minYSize,
                                              'x1': maxXSize, 'y1': maxYSize})
                sizePercentage.append({'horizontal': xSize, 'vertical': ySize})
                index.append(element)
            elementPositioning.append(positioning)
            elementPositioningPercentage.append(positioningPercentage)
            elementSize.append(sizePercentage)
            elementCount.append(index)
            screenShotIndex.append(screen)

        save_segmentation(screenshotId, numberOfElements, elementPositioning, elementPositioningPercentage,
                          elementSize, croppedLocation, elementCount, screenShotIndex, croppedName)

    # RUN OCR ON CROPPED ELEMENTS
    if 2 == 2:
        try:
            import Image
        except ImportError:
            from PIL import Image
        import pytesseract

        # Uncomment this line is you are using Windows

        # pytesseract.pytesseract.tesseract_cmd = 'C:\\Program Files (x86)\\Tesseract-OCR\\tesseract'

        elementRoot = []
        elementId = []
        # Get cropped elements from the database ## To be recognized by OCR
        collection = findMultiple(db.segmentation, 'screenshot_id', str(screenshotId))
        for doc in collection:
            elementRoot.append(str(doc['elementRoot']))
            elementId.append(str(doc['_id']))

        # a = text_detection(inputImgPath,
        #                       'apps/virtualize/segmentation/OCR_Segmentation/frozen_east_text_detection.pb', 0.5, 960,
        #                       960)

        # Use TESSERACT to recognise text
        ocrText = []
        for element in range(len(elementId)):
            ocr = pytesseract.image_to_string(Image.open(elementRoot[element]), lang='eng')
            # Add white padding if an element is not recognised
            if ocr == '':
                croppedWithoutSpace = io.imread(str(elementRoot[element]))
                widthLocal = croppedWithoutSpace.shape[0]
                heightLocal = croppedWithoutSpace.shape[1]
                whiteImage = np.zeros((widthLocal + 4, heightLocal + 4, 3))
                whiteImage.fill(255)
                whiteImage = whiteImage * [255, 255, 255]
                croppedWithSpace = whiteImage
                croppedWithSpace[2:2 + widthLocal, 2:2 + heightLocal] = croppedWithoutSpace
                croppedWithSpace[2:2 + widthLocal, 2:2 + heightLocal] = croppedWithSpace[2:2 + widthLocal, 2:2 + heightLocal] * [-1, -1, -1]
                im = Image.fromarray(np.uint8(croppedWithSpace * 255))
                ocr2 = pytesseract.image_to_string(im, lang='eng')
                # Add filter if an element is not recognised

                if ocr2 == '':
                    # ii.save(os.path.join('./imagestest.jpg'))
                    newImg = ndimage.percentile_filter(croppedWithSpace, percentile=82, size=3) * [-1, -1, -1]
                    im2 = Image.fromarray(np.uint8(newImg * 255))
                    ocr3 = pytesseract.image_to_string(im2, lang='eng')

                    # Append all newly recognised elements to the ocrText variable
                    if str(ocr3) == '' or str(ocr3) == ' ' or str(ocr3) == '\n' or str(ocr3) == '  ' or\
                                    str(ocr3) == "" or str(ocr3) == [] or len(ocr3) == 0:
                        print('the following was not identified by ocr: ' + str(elementRoot[element]))

                    else:

                        ocrText.append({'root': str(elementRoot[element]),
                                        'id': str(elementId[element]),
                                        'name': str(ocr3),
                                        'linenumber': (ocr.count('\n')) + 1
                                        })

                else:
                    ocrText.append({'root': str(elementRoot[element]),
                                    'id': str(elementId[element]),
                                    'name': str(ocr2),
                                    'linenumber': (ocr.count('\n')) + 1})

            # Append all recognised elements to the ocrText variable
            else:
                ocrText.append({'root': str(elementRoot[element]),
                                'id': str(elementId[element]),
                                'name': str(ocr),
                                'linenumber': (ocr.count('\n')) + 1})
        save_ocr(ocrText)

    # RUN INCEPTION ON CROPPED ELEMENTS

    if 3 == 3:

        # Run CNN
        recognized = inception(elementRoot)[0]
        elementName = []
        for result in range(len(recognized['results'])):
            elementLoc = []
            for i in range(len(recognized['results'][result])):
                elementLoc.append(recognized['results'][result][i]['score'])
            elementName.append(elementLoc)
        # get name and highest score to be saved
        finalName = []
        for n in range(len(elementName)):
            # results per element
            for i in range(len(recognized['results'][n])):
                res = max(elementName[n])
                if res == recognized['results'][n][i]['score']:
                    if recognized['results'][n][i]['name'] == 'togglebutton':
                        switch1 = ''
                        img1 = ''
                        score = recognized['results'][n][i]['score']
                        for count in range(len(recognized['results'][n])):
                            if recognized['results'][n][count]['name']=='imagebutton':
                                img1 = recognized['results'][n][count]['score']
                            else:
                                img1 = 0
                        for count in range(len(recognized['results'][n])):
                            if recognized['results'][n][count]['name']=='switch':
                                switch1 = recognized['results'][n][count]['score']
                            else:
                                switch1 = 0
                        buttonScore = score + float(switch1) + float(img1)

                        finalName.append({'highestResult': buttonScore,
                                          'name': 'button'})
                    elif recognized['results'][n][i]['name'] == 'imagebutton':
                        score = recognized['results'][n][i]['score']
                        switch1 = ''
                        toggle1 = ''

                        for count in range(len(recognized['results'][n])):
                            if recognized['results'][n][count]['name'] == 'togglebutton':
                                toggle1 = recognized['results'][n][count]['score']
                            else:
                                toggle1 = 0

                        for count in range(len(recognized['results'][n])):
                            if recognized['results'][n][count]['name'] == 'switch':
                                switch1= recognized['results'][n][count]['score']
                            else:
                                switch1 = 0
                        buttonScore = float(score) + float(switch1) + float(toggle1)
                        finalName.append({'highestResult': buttonScore,
                                          'name': 'button'})
                    elif recognized['results'][n][i]['name'] == 'switch':
                        img1 = ''
                        toggle1 = ''
                        score = recognized['results'][n][i]['score']
                        for count in range(len(recognized['results'][n])):
                            if recognized['results'][n][count]['name'] == 'togglebutton':
                                toggle1 = recognized['results'][n][count]['score']
                            else:
                                toggle1 = 0
                        for count in range(len(recognized['results'][n])):
                            if recognized['results'][n][count]['name'] == 'imagebutton':
                                img1 = recognized['results'][n][count]['score']
                            else:
                                img1 = 0
                        buttonScore = score + float(img1) + float(toggle1)
                        finalName.append({'highestResult': buttonScore,
                                          'name': 'button'})
                    else:
                        finalName.append({'highestResult': recognized['results'][n][i]['score'],
                                          'name': recognized['results'][n][i]['name']})
        save_inception(finalName, elementId)

    '######################## START MAKING ARRAY OF OCR AND CNN FOR COMBINING ALGO ##################################'

    def checkTextInside(E, locations):
        txtWithin = []
        for i in range(len(E)):
            Ex0 = int(E[i]['location'][0][3:])
            Ex1 = int(E[i]['location'][2][3:])
            Ey0 = int(E[i]['location'][1][3:])
            Ey1 = int(E[i]['location'][3][3:])
            for iterate in range(len(locations)):
                E2x0 = int(locations[iterate]['location'][0][3:])
                E2x1 = int(locations[iterate]['location'][2][3:])
                E2y0 = int(locations[iterate]['location'][1][3:])
                E2y1 = int(locations[iterate]['location'][3][3:])
                if (E2x0 > Ex0) & (E2x1 < Ex1) & (E2y0 > Ey0) & (E2y1 < Ey1):
                        inside = 'true'
                        txtWithin.append(E[i])
                else:
                    inside = 'false'
        return txtWithin

    '#GET THE INFORMATION INTO ARRAY COMBINATION'
    if 4 == 4:
        # GET INFORMATION FROM DB ABOUT SEGMENTATION, CNN, OCR :
        # create : elementLocation, segId, onlyId -- elementName -- elementCNN
        if(3.0 == 3.0):
            client = pymongo.MongoClient('localhost', 27017)  # maxPoolSize=50
            db = client.MeduzaDb

            collection = db['segmentation']
            cursor = collection.find({})
            elementLocation = []
            segId = []
            for document in cursor:
                if screenshotId == str(document['screenshot_id']):
                    elementLocation.append({
                        'location': (document['elementLocationPixels']), 'segId': str((document['_id']))})
                    segId.append({
                        'id': str((document['_id'])), 'location': (document['elementLocationPixels'])})

            elementName = []
            for index in range(len(segId)):
                collection = db['ocr']
                cursor = collection.find({})
                for document in cursor:
                    if str(segId[index]['id']) == str(document['segmentation_id']):
                        elementName.append({
                            'name': (document['name']), 'segId': (document['segmentation_id']), 'type': 'text'})
            elementCNN = []
            for index in range(len(segId)):
                collection = db['inception']
                cursor = collection.find({})
                for document in cursor:
                    if str(segId[index]['id']) == str(document['segmentation_id']):
                        elementCNN.append({
                            'results': (document['elementName']['name']),
                            'segId': (document['segmentation_id']),
                            'type': 'cnn',
                            'score': (document['elementName']['highest'])
                        })

        # compare elementName and segId to get an array with only OCR element
        ocrTxt = []
        for id in segId:
            for getId in range(len(elementName)):
                if id['id'] == elementName[getId]['segId']:
                    ocrTxt.append({'id': elementName[getId]['segId'], 'location': id['location']})

        # Check OCR element that have other OCR element inside and return the parent
        txtWithin = checkTextInside(ocrTxt, ocrTxt)
        # Use txtWithin to get rid of the parent that are not actual text Element
        if 3.1 == 3.1:

            onlyOcr = ocrTxt
            t = 0
            size = len(onlyOcr)
            while t < size :
                t1 = 0
                while t1 < len(txtWithin):
                    if onlyOcr[t] == txtWithin[t1]:
                        onlyOcr.pop(t)
                        size = size - 1
                        t = t - 1
                    t1 = t1 + 1
                t = t + 1
        # creation of cnnShape the array of CNN element but ocr element still here too
        # change cnnShapes into cnnShapes2 which the same without the ocr element
        if 3.2 == 3.2:

            cnnShapes = []
            for loop in range(len(elementLocation)):
                for loop2 in range(len(elementCNN)):
                    if elementLocation[loop]['segId'] == elementCNN[loop2]['segId']:  # CHECK 100% OCR
                        cnnShapes.append({'location': elementLocation[loop]['location'],
                                          'name': elementCNN[loop2]['results'],
                                          'type': 'cnn',
                                          'id': elementCNN[loop2]['segId'],
                                          'score': elementCNN[loop2]['score']
                                          })

            cnnShapes2 = cnnShapes
            size = len(cnnShapes2)
            t = 0
            while t < size:
                t1 = 0
                while t1 < len(onlyOcr):
                    if cnnShapes2[t]['id'] == onlyOcr[t1]['id']:
                        cnnShapes2.pop(t)
                        size = size - 1
                        t = t - 1
                    t1 = t1 + 1
                t = t + 1
        # Change onlyOcr (id, location) into onlyOcr2 (type, id, name, location)
        if 3.3 == 3.3:
            onlyOcr2 = []
            t = 0
            while t < len(onlyOcr):
                t1 = 0
                while t1 < len(elementName):
                    if onlyOcr[t]['id'] == elementName[t1]['segId']:
                        onlyOcr2.append({'type': 'ocr', 'id': onlyOcr[t]['id'], 'name': elementName[t1]['name'],
                                         'location': onlyOcr[t]['location'],
                                         'score': 80
                                         })
                    t1 = t1 + 1
                t = t + 1

        if 3.4 == 3.4:  # Put the word not taken as one of the same line together
            sontxt = []
            def distachedSentence(Array):
                sentence = Array
                size = len(sentence)
                text = 0
                while text < size - 1:
                    Ex0 = int(sentence[text]['location'][0][3:])
                    Ex1 = int(sentence[text]['location'][2][3:])
                    Ey0 = int(sentence[text]['location'][1][3:])
                    Ey1 = int(sentence[text]['location'][3][3:])
                    Eheight = Ey1 - Ey0
                    # print('name of inline paragraph')
                    # print(sentence[text]['name'])
                    element = 0
                    secondSize = len(sentence)
                    while element < secondSize - 1:
                        E2y0 = int(sentence[element]['location'][1][3:])
                        E2x1 = int(sentence[element]['location'][2][3:])
                        E2x0 = int(sentence[element]['location'][0][3:])

                        if (E2y0 - 10) <= Ey0 <= (E2y0 + 10):
                            # check on right for ocr elements
                            if (int(sentence[element]['location'][0][3:]) - 15) <= Ex1 <= (
                                    int(sentence[element]['location'][0][3:]) + 15):

                                sentence[text]['name'] = sentence[text]['name'] + ' ' + sentence[element]['name']

                                sentence[text]['location'][2] = sentence[element]['location'][2]
                                #  check and get the highest elements size
                                if sentence[text]['location'][3][3:] <= sentence[element]['location'][3][3:]:
                                    sentence[text]['location'][3] = sentence[element]['location'][3]

                                if sentence[text]['location'][1][3:] >= sentence[element]['location'][1][3:]:
                                    sentence[text]['location'][1] = sentence[element]['location'][1]

                                sontxt.append([sentence[text]['id'], sentence[element]['id']])
                                sentence.pop(element)
                                size -= 1
                                secondSize -= 1
                            # check on left for ocr elements
                            if (int(sentence[element]['location'][2][3:]) - 15) <= Ex0 <= (
                                    int(sentence[element]['location'][2][3:]) + 15):
                                # print(str(sentence[element]['name']))
                                # print('on left')
                                sentence[text]['name'] = sentence[element]['name'] + ' ' + sentence[text]['name']
                                # print('new value: ' + str(sentence[text]['name']))
                                sentence[text]['location'][0] = sentence[element]['location'][0]
                                if sentence[text]['location'][3][3:] <= sentence[element]['location'][3][3:]:
                                    sentence[text]['location'][3] = sentence[element]['location'][3]

                                if sentence[text]['location'][1][3:] >= sentence[element]['location'][1][3:]:
                                    sentence[text]['location'][1] = sentence[element]['location'][1]

                                sontxt.append([sentence[text]['id'], sentence[element]['id']])
                                sentence.pop(element)
                                size -= 1
                                secondSize -= 1
                        element += 1
                    text += 1
                return sentence

            children = []

            def checkDistachedSentence(Array):
                sentence = Array
                size = len(sentence)
                text = 0
                while text < size - 1:
                    Ex0 = int(sentence[text]['location'][0][3:])
                    Ex1 = int(sentence[text]['location'][2][3:])
                    Ey0 = int(sentence[text]['location'][1][3:])
                    Ey1 = int(sentence[text]['location'][3][3:])
                    Eheight = Ey1 - Ey0
                    # print('name of inline paragraph')
                    # print(sentence[text]['name'])
                    element = 0
                    secondSize = len(sentence)
                    while element < secondSize - 1:
                        E2y0 = int(sentence[element]['location'][1][3:])
                        E2x1 = int(sentence[element]['location'][2][3:])
                        E2x0 = int(sentence[element]['location'][0][3:])

                        if (E2y0 - 10) <= Ey0 <= (E2y0 + 10):
                            # check on right for ocr elements
                            if (int(sentence[element]['location'][0][3:]) - 15) <= Ex1 <= (
                                        int(sentence[element]['location'][0][3:]) + 15):

                                sentence[text]['name'] = sentence[text]['name'] + ' ' + sentence[element]['name']

                                sentence[text]['location'][2] = sentence[element]['location'][2]
                                #  check and get the highest elements size
                                if sentence[text]['location'][3][3:] <= sentence[element]['location'][3][3:]:
                                    sentence[text]['location'][3] = sentence[element]['location'][3]

                                if sentence[text]['location'][1][3:] >= sentence[element]['location'][1][3:]:
                                    sentence[text]['location'][1] = sentence[element]['location'][1]

                                children.append([sentence[text]['id'], sentence[element]['id']])
                                sentence.pop(element)
                                size -= 1
                                secondSize -= 1
                            # check on left for ocr elements
                            if (int(sentence[element]['location'][2][3:]) - 15) <= Ex0 <= (
                                        int(sentence[element]['location'][2][3:]) + 15):
                                # print(str(sentence[element]['name']))
                                # print('on left')
                                sentence[text]['name'] = sentence[element]['name'] + ' ' + sentence[text]['name']
                                # print('new value: ' + str(sentence[text]['name']))
                                sentence[text]['location'][0] = sentence[element]['location'][0]
                                if sentence[text]['location'][3][3:] <= sentence[element]['location'][3][3:]:
                                    sentence[text]['location'][3] = sentence[element]['location'][3]

                                if sentence[text]['location'][1][3:] >= sentence[element]['location'][1][3:]:
                                    sentence[text]['location'][1] = sentence[element]['location'][1]

                                children.append([sentence[text]['id'], sentence[element]['id']])
                                sentence.pop(element)
                                size -= 1
                                secondSize -= 1
                        element += 1
                    text +=1
                return sentence

        if 3.5 == 3.5:
            o = 0
            while o < len(onlyOcr2):
                for u in ocrText:
                    if onlyOcr2[o]['id'] == u['id']:
                        onlyOcr2[o] = {'type': onlyOcr2[o]['type'], 'name': onlyOcr2[o]['name'],
                                       'id': onlyOcr2[o]['id'], 'location': onlyOcr2[o]['location'],
                                       'root': u['root'], 'score': onlyOcr2[o]['score']
                                       }
                o = o + 1

        for i in range(len(onlyOcr2)):
            onlyOcr2 = checkDistachedSentence(onlyOcr2)  # create paragraph 100% paragraphs

    # cnnResults to be in the same format as onlyocr
    cnnResults = []

    for i in range(len(cnnShapes2)):
        segmentedId = cnnShapes2[i]['id']
        root = getRoot(cnnShapes2[i]['id'])
        location = cnnShapes2[i]['location']
        type = cnnShapes2[i]['type']
        name = cnnShapes2[i]['name']
        score = cnnShapes2[i]['score']
        cnnResults.append({'type': type, 'name': name, 'id': segmentedId, 'location': location,
                           'root': root, 'score': score})

    combination = cnnResults + onlyOcr2
    combinationId = []
    childrenTextBox = []
    for h in range(len(combination)):
        for g in range(len(combination)):
            if str(combination[h]['id']) != str(combination[g]['id']):

                x0 = float(combination[h]['location'][0][3:])
                y0 = float(combination[h]['location'][1][3:])
                x1 = float(combination[h]['location'][2][3:])
                y1 = float(combination[h]['location'][3][3:])
                x02 = float(combination[g]['location'][0][3:])
                y02 = float(combination[g]['location'][1][3:])
                x12 = float(combination[g]['location'][2][3:])
                y12 = float(combination[g]['location'][3][3:])

                if x0 > x02:
                    if y0 > y02:
                        if x1 < x12:
                            if y1 < y12:
                                childrenTextBox.append([str(combination[g]['id']), str(combination[h]['id'])])

    for k in range(len(combination)):

        seg_id = combination[k]['id']
        type = combination[k]['type']
        name = combination[k]['name']
        score = combination[k]['score']

        x0 = float(combination[k]['location'][0][3:]) * 100 / width
        y0 = float(combination[k]['location'][1][3:]) * 100 / height
        x1 = float(combination[k]['location'][2][3:]) * 100 / width
        y1 = float(combination[k]['location'][3][3:]) * 100 / height
        location = {'x0': float(x0), 'y0': float(y0), 'x1': float(x1), 'y1': float(y1)}
        root = combination[k]['root']
        children = children + sontxt
        childs = checkKids(children,seg_id)
        textBoxKids = checkKids(childrenTextBox,seg_id)

        combinationId.append(combination[k]['id'])

        # if len(textBoxKids) > 1:
        #     if type == 'cnn':
        #         if childinrange(textBoxKids) == False:
        #             combinationId = updateChildLocation(combination[k],savePath, screenshotId, combinationId, len(textBoxKids), width, height)

        date = datetime.now(pytz.timezone('Australia/Melbourne'))

        savePrediction(seg_id, type, name, location, root, childs, screenshotId, date, score)

    # predictions ('id': 'type': 'name': 'location': 'root': )

    predictions = getPrediction(combinationId)  # check all seg id of existing screenShot to get predictions
    print('predictions')
    print(len(predictions))
    print(predictions)

    userId = getCollectionIDs('accounts_user', CurrentUser)
    # NO NEED OF LINE BELOW FOR NEW SYSTEM
    setScreenshot(userId, screenshotId, projectName)

    metaProgramming(predictions, myFile, 'save')


def update_segmentation_db(screenshotId):
    collect = db.segmentation.find({'screenshot_id': screenshotId})
    for c in collect:
        x0_ = str(c['elementLocationPixels'][0])
        y0_ = str(c['elementLocationPixels'][1])
        x1_ = str(c['elementLocationPixels'][2])
        y1_ = str(c['elementLocationPixels'][3])


        aux0 = x0_.split(':')
        auy0 = y0_.split(':')
        aux1 = x1_.split(':')
        auy1 = y1_.split(':')
        x0 = int(aux0[1])
        y0 = int(auy0[1])
        x1 = int(aux1[1])
        y1 = int(auy1[1])

        print("Smalllllll")
        a = (x1 - x0)
        b = (y1 - y0)
        print(a)
        print(b)

        if (x1 - x0) < 15 or (y1 - y0) < 15:
            db.segmentation.delete_one({'_id': c['_id']})
            print('deleting')

    return 1