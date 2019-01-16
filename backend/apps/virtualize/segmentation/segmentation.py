from apps.virtualize.models import *
from apps.virtualize.segmentation import selectiveSegmentationv4e2
from apps.virtualize.utils.metaCustomUtils import *
from apps.virtualize.utils.screenshotUtils import setScreenshot


def run(myFile, coco_model, tensorflow_model, CurrentUser, projectName):

    import matplotlib.pyplot as plt
    import numpy as np
    from PIL import Image
    from skimage.filters import threshold_otsu, scharr
    from skimage.segmentation import clear_border
    from skimage.morphology import closing, square
    from skimage import io, color
    import os
    from scipy import ndimage
    from virtualize.utils.metaCustomUtils import save_segmentation, save_ocr, save_inception, childinrange
    from virtualize.segmentation.metaprogramming import metaProgramming

    ########################  START SEGMENTATION, INCEPTION AND OCR ####################

    client = pymongo.MongoClient('localhost', 27017)  # maxPoolSize=50
    db = client.MeduzaDb
    # db.add_user('meduzaUser1', 'Test123', roles=[{'role': 'readWrite', 'db': 'testdb'}])
    img_raw = Image.open('media/' + str(myFile))
    width, height = img_raw.size
    new_width = int(width * 1.02)
    new_height = int(height * 1.02)
    img = Image.new('RGB', (new_width, new_height), (255, 255, 255))
    img.paste(img_raw, ((new_width - width) // 2, (new_height - height) // 2))
    img.save('media/' + str(myFile))
    with Image.open('media/' + str(myFile)) as img:
        width, height = img.size
    print('width' + str(width))
    print('height' + str(height))

    # RUN SEGMENTATION
    if 1 == 1:
        print('this is myFile: ' + str(myFile))

        screenShotId = []
        imagesRoot = []
        # Get images uploaded from the database ## To be transferred to DataModels file
        if 1.1 == 1.1:
            # screenShotSize = []
            collection = db['screenshots']
            cursor = collection.find({})
            for document in cursor:
                if str(document['image']) == str(myFile):
                    screenShotId.append(str(document['_id']))
                    #    screenShotSize.append(document['size'])
                    imagesRoot.append(document['image'])
                else:
                    print('this user has already procesed the following: ' + str(document['image']))
            # print(*document, sep='\n')  # prints all object names
        print('Reading the following images' + str(imagesRoot))

        if float(width) >= float(height):
            device = 'WebApp'
        else:
            device = 'MobileApp'
        if db.screenshots.find_one({'image': str(myFile)}) != None:
            db.screenshots.update({'image':str(myFile)},{'$set':
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
        # Run segmentation on all images
        for screen in range(len(imagesRoot)):  # imagesRoot)):

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
            #label_image = label(cleared)
            #image_label_overlay = label2rgb(label_image, image=image)

            # fig, ax = plt.subplots(figsize=(20, 12))
            # ax.imshow(image_label_overlay)

            minX = []
            maxX = []
            minY = []
            maxY = []
            # Get the bbox of each element
            elementName = str(myFile[:len(myFile) - 4])
            savePath = "media/" + str(elementName) + "/cropped_elements"

            '''Ram's Code'''
            inputImgPath = 'media/' + str(imagesRoot[screen])
            multList, coco_text_idx = selectiveSegmentationv4e2.segmentationFirstLayer(str(savePath), inputImgPath, coco_model, tensorflow_model, myFile)
            # multList, mserList = segmentThreshTestVold.SegmentationMSERThresh('static/users/' + str(imagesRoot[screen]), [])
            regionList = list( multList)
            print('Numbers of list')
            print(len(multList))
            print(len(coco_text_idx))
            print("Victor Region Number")
            print(len(regionList))
            for region in regionList:

                # for region in regionprops(label_image):
                # take regions with large enough areas
                minr, minc, maxr, maxc = region
                print('Regionnnn')
                print(region)
                area = (minr - minc) * (maxr - maxc)
                if 3 > 0:
                    # draw rectangle around segmented elements
                    # minr, minc, maxr, maxc = region.bbox

                    #rect = mpatches.Rectangle((minc, minr), maxc - minc, maxr - minr,
                                              #fill=False, edgecolor='green', linewidth=1)
                    '''Ram's Code'''
                    #ax.add_patch(rect)
                    percentageY = np.round((maxr-minr) * 0.01)
                    percentageX = np.round((maxc-minc) * 0.01)
                    # minY.append(int(minr-percentageY))
                    # maxY.append(int(maxr+percentageY))
                    # minX.append(int(minc-percentageX))
                    # maxX.append(int(maxc+percentageX))

                    minY.append(minr)
                    maxY.append(maxr)
                    minX.append(minc)
                    maxX.append(maxc)

            numberOfElements.append(len(minX))
            nbrOfElements = len(minX)
            # location = [minY[0], maxY[0], minX[0], maxX[0]]

            img = Image.open('media/' + str(imagesRoot[screen]))  # imagesRoot[screen])  #

            elementName = str(myFile[:len(myFile)-4])  ################################## specify on Django
            croppedName = str(myFile[int(len(str(CurrentUser)))+7:-4]) + ".jpg"
            croppedName = str(croppedName[int(len(str(projectName)))+7:])

            # specify in savePath the location where you want to save the cropped elements
            savePath = "media/"+str(elementName)+"/cropped_elements"
            croppedLocation.append(savePath)

            positioning = []
            index = []
            positioningPercentage = []
            sizePercentage = []
            # loop for cropping all elements, saving them and establish the location of each
            print('Region Number22222')
            print(nbrOfElements)
            for iterator in range(nbrOfElements):
                # crop elements
                croppedImage = img.crop((minX[iterator]-1, minY[iterator]-1, maxX[iterator]+2, maxY[iterator]+2))  # -5

                if not os.path.exists(savePath):
                    os.makedirs(savePath)
                print('Saving'+ str(iterator))
                print(savePath)
                print(str(croppedName))
                croppedImage.save(os.path.join(savePath, str(iterator) + ' ' + str(croppedName)))

                positioning.append(['x0:' + str(minX[iterator]), 'y0:' + str(minY[iterator]),
                                    'x1:' + str(maxX[iterator]), 'y1:' + str(maxY[iterator])])
                # get size and size of each element in percentage
                minXSize = (minX[iterator]) * 100 / width
                maxXSize = (maxX[iterator]) * 100 / width
                xSize = maxXSize - minXSize  # width of screenshot
                minYSize = (minY[iterator]) * 100 / height
                maxYSize = (maxY[iterator]) * 100 / height
                ySize = maxYSize - minYSize  # height of screenshot

                print(str(xSize * ySize))
                if (xSize * ySize) >= 120:
                    print(savePath)
                    print(iterator)
                    print(croppedName)
                    croppedFullLocation.append(savePath + '/' + str(iterator) + ' ' + str(croppedName))


                # print(str(iterator)+" "+str(positioning))
                positioningPercentage.append({'x0': minXSize, 'y0': minYSize,
                                              'x1': maxXSize, 'y1': maxYSize})
                sizePercentage.append({'horizontal': xSize, 'vertical': ySize})
                index.append(iterator)
                elementReference = ['Element ' + str(index[0])]
                # % of all elements
                # print('element# '+str(iterator) + ' horizontal: ' + str(xSize), 'vertical: ' + str(ySize))
                # print(positioningPercentage[0])

            elementPositioning.append(positioning)
            elementPositioningPercentage.append(positioningPercentage)
            elementSize.append(sizePercentage)
            elementCount.append(index)
            screenShotIndex.append(screen)

        print('Start First Cnn')
        print(len(croppedFullLocation))
        print(croppedFullLocation)
        recognize = run_recognition([], croppedFullLocation, [], [], [], 'cnnFirstModels')
        cnn_level_1 = []
        # for i in range(len(croppedFullLocation)):
            # aux0 = recognize[0]['results']
            # aux1 = aux0[i]['score']
            # aux2 = aux0[i]['name']
            # cnn_level_1.append([croppedFullLocation[i],aux2,aux1])

        print('Finish First Cnn')


        save_segmentation(screenShotId, numberOfElements, elementPositioning, elementPositioningPercentage,
                          elementSize, croppedLocation, elementCount, screenShotIndex, croppedName,cnn_level_1)


    # RUN OCR ON CROPPED ELEMENTS
    if 2 == 2:
        try:
            import Image
        except ImportError:
            from PIL import Image
        import pytesseract

        ## Uncomment this line is you are using Windows

        # pytesseract.pytesseract.tesseract_cmd = 'C:\\Program Files (x86)\\Tesseract-OCR\\tesseract'

        print('Segmentation running')
        elementRoot = []
        elementId = []
        # Get cropped elements from the database ## To be transferred to DataModels file
        if 2.1 == 2.1:
            print('this is Screensot_id' + str(screenShotId))
            collection = db['segmentation']
            cursor = collection.find({})
            for document in cursor:
                if screenShotId[0] == document['screenshot_id']:
                    elementRoot.append((document['elementRoot']))
                    elementId.append((document['_id']))
        print('Number of elements to be processed: '+str(len(elementId)))

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
                    print('empty2: ' + str(elementRoot[element]))

                    newImg = ndimage.percentile_filter(croppedWithSpace, percentile=82, size=3) * [-1, -1, -1]
                    im2 = Image.fromarray(np.uint8(newImg * 255))
                    plt.imshow(newImg)
                    # plt.imsave(savePath + str(screenShot) + '.' + str(couple) + '.1' + '.jpg', newImg)
                    ocr3 = pytesseract.image_to_string(im2, lang='eng')  # .open(
                    # savePath + str(screenShot) + '.' + str(couple) + '.jpg'), lang='eng')
                    # pair = (arrayIconlabel[couple][0], str(ocr))  # txtLabelCorrected)

                    # Append all newly recognised elements to the ocrText variable
                    if str(ocr3) == '' or str(ocr3) == ' ' or str(ocr3) == '\n' or str(ocr3) == '  ' or\
                                    str(ocr3) == "" or str(ocr3) == [] or len(ocr3) == 0:
                        print('the following was not identified by ocr: ' + str(elementRoot[element]))

                    else:
                        print('not empty3: ' + str(elementRoot[element]))

                        print(str(ocr3))
                        print(len(ocr3))
                        ocrText.append({'root': str(elementRoot[element]),
                                        'id': str(elementId[element]),
                                        'name': str(ocr3),
                                        'linenumber': (ocr.count('\n')) + 1
                                        })

                else:
                    print('ocr22')
                    print(str(ocr2))
                    ocrText.append({'root': str(elementRoot[element]),
                                    'id': str(elementId[element]),
                                    'name': str(ocr2),
                                    'linenumber': (ocr.count('\n')) + 1})

            # Append all recognised elements to the ocrText variable
            else:
                print('ocrr')
                print(str(ocr))
                ocrText.append({'root': str(elementRoot[element]),
                                'id': str(elementId[element]),
                                'name': str(ocr),
                                'linenumber': (ocr.count('\n')) + 1})
        print('ocr running: '+str(len(ocrText))+' elements')

        save_ocr(ocrText)

    # RUN INCEPTION ON CROPPED ELEMENTS

    if 3 == 3:
        elementId = []
        elementRoot = []
        segmentationLocation = []
        screenshotIndex = []
        status = []
        elementIndex = []
        # get data needed for inception ## To be transferred to DataModels file
        if 3.1 == 3.1:
            collection = db['segmentation']
            cursor = collection.find({})
            for document in cursor:
                if screenShotId[0] == document['screenshot_id']:
                    elementId.append((document['_id']))
                    elementRoot.append(document['elementRoot'])
                    segmentationLocation.append((document['elementLocationPixels']))
                    status.append((document['status']))
                    #   print(*document, sep='\n')# prints all object names
                    screenshotIndex.append(document['screenshot_id'])
                    elementIndex.append(document['elementIndex'])

        # make a loop to go one screen shot at a time
        screenshotId = []
        screenshotId.append(screenshotIndex[0])
        print('screenshotindex: ' + str(screenshotIndex))
        print(screenshotId)
        # Get screen_shot_id without duplication
        for loopAll in range(len(screenshotIndex)):

            current = screenshotIndex[loopAll]
            # compare = screenshotIndex[loopAll+1]
            for secondLoop in range(len(screenshotIndex)):
                if screenshotIndex[secondLoop] != current:
                    if len(screenshotId) > 0:
                        count = 0
                        for thirdLoop in range(len(screenshotId)):
                            if screenshotId[thirdLoop] != screenshotIndex[secondLoop]:
                                count = count + 1
                        if count == len(screenshotId):
                            screenshotId.append(screenshotIndex[secondLoop])
                            # print(screenshotIndex[secondLoop])
        print(screenshotIndex)

        recognized = run_recognition(elementId, elementRoot, segmentationLocation, screenshotIndex, status,'cnnModels')
        print(recognized[0])

        elementName = []
        for result in range(len(recognized[0]['results'])):
            elementLoc = []
            for i in range(len(recognized[0]['results'][result])):
                elementLoc.append(recognized[0]['results'][result][i]['score'])
            elementName.append(elementLoc)
        print(elementName)

        # no need...for result in range(len(recognized)):
        #    elementLoc = []
        #    for i in range(len(recognized[result])):
        #        elementLoc.append(recognized[result]['results'][i]['score'])
        #    elementName.append(elementLoc)
        #print(elementName)
        finalName = []
        for n in range(len(elementName)):
            for i in range(len(recognized[0]['results'][n])):
                res = max(elementName[n])
                if res == recognized[0]['results'][n][i]['score']:
                    finalName.append({'highestResult': recognized[0]['results'][n][i]['score'],
                                      'name': recognized[0]['results'][n][i]['name']})
        print('Inception: '+str(len(finalName)))
        # print('final: ' + str(finalName))
        # print(finalName[0])
        save_inception(finalName, elementId)

    '#################################  STOP SEGMENTATION, INCEPTION AND OCR ########################################'

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
            onlyId = []
            for document in cursor:
                if screenShotId[0] == str(document['screenshot_id']):
                    elementLocation.append({
                        'location': (document['elementLocationPixels']), 'segId': str((document['_id']))})
                    segId.append({
                        'id': str((document['_id'])), 'location': (document['elementLocationPixels'])})
                    onlyId.append(str(document['_id']))

            '''''''''''''''Continue here, segId in document['segmentation_id'] use str? or make another loop '''''
            elementName = []
            for index in range(len(segId)):
                collection = db['ocr']
                cursor = collection.find({})
                print('lenght of seg id is: '+ str(len(segId)))
                for document in cursor:
                    if str(segId[index]['id']) == str(document['segmentation_id']):
                        print(index)
                        print('hi these are true: ' + document['segmentation_id'])
                        elementName.append({
                            'name': (document['name']), 'segId': (document['segmentation_id']), 'type': 'text'})
            print('element Name:' + str(elementName))

            elementCNN = []
            for index in range(len(segId)):
                collection = db['inception']
                cursor = collection.find({})
                for document in cursor:
                    if str(segId[index]['id']) == str(document['segmentation_id']):
                        elementCNN.append({
                            'results': (document['elementName']['name']),
                            'segId': (document['segmentation_id']),
                            'type': 'shape'})

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
                    if elementLocation[loop]['segId'] == elementCNN[loop2]['segId']:
                        cnnShapes.append({'location': elementLocation[loop]['location'],
                                          'name': elementCNN[loop2]['results'],
                                          'type': 'shapes',
                                          'id': elementCNN[loop2]['segId']})

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
                        onlyOcr2.append({'type': 'ocr', 'id': onlyOcr[t]['id'],\
                                         'name': elementName[t1]['name'], 'location': onlyOcr[t]['location']})
                    t1 = t1 + 1
                t = t + 1

        if 3.4 == 3.4:  # Put the word not taken as one of the same line together
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
                                # print(str(sentence[element]['name']))
                                # print('on right')
                                sentence[text]['name'] = sentence[text]['name'] + ' ' + sentence[element]['name']
                                # print('new value: ' + str(sentence[text]['name']))
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
                        onlyOcr2[o] = {'type': onlyOcr2[o]['type'], 'name': onlyOcr2[o]['name'],'id': onlyOcr2[o]['id'
                        ], 'location': onlyOcr2[o]['location'], 'root': u['root']}
                o = o + 1

        for i in range(len(onlyOcr2)):
            onlyOcr2 = checkDistachedSentence(onlyOcr2)
    cnnResults = []

    for i in range(len(cnnShapes2)):
        segmentedId = cnnShapes2[i]['id']
        root = getRoot(cnnShapes2[i]['id'])
        location = cnnShapes2[i]['location']
        type = cnnShapes2[i]['type']
        name = cnnShapes2[i]['name']
        cnnResults.append({'type': type, 'name': name, 'id': segmentedId, 'location': location, 'root': root})

    combination = cnnResults + onlyOcr2
    combinationId = []
    childrenTextBox = []
    for h in range(len(combination)):
        for g in range(len(combination)):
            if(str(combination[h]['id'])!=str(combination[g]['id'])):
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
        if db.predictions.find_one({'segmentation_id': combination[k]['id']}) == None:
            seg_id = combination[k]['id']
            type = combination[k]['type']
            name = combination[k]['name']
            x0 = float(combination[k]['location'][0][3:]) * 100 / width
            y0 = float(combination[k]['location'][1][3:]) * 100 / height
            x1 = float(combination[k]['location'][2][3:]) * 100 / width
            y1 = float(combination[k]['location'][3][3:]) * 100 / height
            print('x0: ' + str(combination[k]['location'][0][3:])+' / ' + str(x0))
            print('x1: ' + str(combination[k]['location'][2][3:])+' / ' + str(x1))
            print('y0: ' + str(combination[k]['location'][1][3:])+' / ' + str(y0))
            print('y1: ' + str(combination[k]['location'][3][3:])+' / ' + str(y1))
            location = {'x0': float(x0), 'y0': float(y0), 'x1': float(x1), 'y1': float(y1)}
            root = combination[k]['root']

            childs = checkKids(children,seg_id)
            textBoxKids = checkKids(childrenTextBox,seg_id)

            combinationId.append(combination[k]['id'])

            if (len(textBoxKids)>1):
                if type == 'shapes':
                    if childinrange(textBoxKids) == False:
                        combinationId = updateChildLocation(combination[k],savePath, screenshotId[0], combinationId, len(textBoxKids), width, height)

            date = datetime.now(pytz.timezone('Australia/Melbourne'))

            savePrediction(seg_id, type, name, location, root, childs, screenshotId[0], date)

    # predictions ('id': 'type': 'name': 'location': 'root': )

    print(combinationId)

    predictions = getPrediction(combinationId)  # check all seg id of existing screenShot to get predictions
    print('predictions')
    print(len(predictions))
    print(predictions)

    userId = getCollectionIDs('accounts_user', CurrentUser)
    setScreenshot(userId, screenshotId[0], projectName)

    metaProgramming(predictions, myFile, 'save')


        # INCEPTION DIFFERENT MODELS RUNNING FUNCTIONS
def run_recognition(elementId, elementRoot, segmentationLocation, screenshotIndex, status,cnn):
    import tensorflow as tf

    def inception(elementRoot, cnn):
                image_data = []
                for i in range(len(elementRoot)):

                    image = elementRoot[i]
                    # Read in the image_data
                    image_data.append(tf.gfile.FastGFile(image, 'rb').read())

                # Loads label file, strips off carriage return
                label_lines = [line.rstrip() for line
                               in tf.gfile.GFile(cnn['label'])]

                # Unpersists graph from file
                with tf.gfile.FastGFile(cnn['graph'], 'rb') as f:
                    graph_def = tf.GraphDef()
                    graph_def.ParseFromString(f.read())
                    _ = tf.import_graph_def(graph_def, name='')

                with tf.Session() as sess:
                    certainty = []
                    name = []
                    # Feed the image_data as input to the graph and get first prediction
                    softmax_tensor = sess.graph.get_tensor_by_name('final_result:0')
                    # loop all the image data agains the graph model
                    for images in range(len(image_data)):
                        predictions = sess.run(softmax_tensor, {'DecodeJpeg/contents:0': image_data[images]})
                        # Sort to show labels of first prediction in order of confidence
                        top_k = predictions[0].argsort()[-len(predictions[0]):][::-1]
                        # print('prediction: '+str(predictions))
                        # print('top_k: '+str(top_k))

                        clusters = []
                        nameLoc = []
                        for node_id in top_k:
                            human_string = label_lines[node_id]
                            score = predictions[0][node_id]
                            clusters.append('%s (certainty = %.5f)' % (human_string, score))
                            nameLoc.append({'cluster': '%s (certainty = %.5f)' % (human_string, score),
                                            'score': score,
                                            'name': human_string})
                            print('Element ' + str(images), '%s (score = %.5f)' % (human_string, score))
                        certainty.append(clusters)
                        name.append(nameLoc)
                # reset the graph for next use
                tf.reset_default_graph()
                return name

            #widgetsCnn = []
    shapesCnn = []
    # data loaded from cnnModels
    db_cnn = client.mainDB
    if 3.1 == 3.1:
                collection = db_cnn[str(cnn)]
                cursor = collection.find({})
                for document in cursor:
                    # elementId.append((document['_id']))
                    shapesCnn.append({'name': 'shapes', 'data': document['shapes']})
                    # widgetsCnn.append({'name': 'widgets', 'data': document['widgets']})
    cnnRoutes = shapesCnn #+ widgetsCnn
    elementNames = []
    for iterator in range(len(cnnRoutes)):  # number of CNNs to be used
                # if status[iterator] != 'Identified by OCR':
                cnn = cnnRoutes[iterator]['data']
                name = inception(elementRoot, cnn)
                print(len(name))
                elementNames.append({'cnn': cnnRoutes[iterator]['name'], 'results': name})

                # else:
                #  print('Element ' + str(count) + ' ' + 'already recognised by OCR ' + str(elementRoot[iterator]))
    return elementNames

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