import pymongo
from apps.virtualize.utils.metaCustomUtils import *
from PIL import Image
from skimage import color, measure
from skimage import io
from datetime import datetime
import pytz


def metaProgramming(combination, myFile, state):
    client = pymongo.MongoClient('localhost', 27017)  # maxPoolSize=50
    db = client.MeduzaDb

    viewHeight = 294.859
    viewWidth = 904.812

    with Image.open('media/' + str(myFile)) as img:
        widthScreen, heightScreen = img.size
    print('width' + str(widthScreen))
    print('height of this ' + str(heightScreen))

    def checkTextInside(E, locations):
        txtWithin = []
        for i in range(len(E)):
            Ex0 = int(E[i]['location']['x0'] * widthScreen / 100)
            Ex1 = int(E[i]['location']['x1'] * widthScreen / 100)
            Ey0 = int(E[i]['location']['y0'] * heightScreen / 100)
            Ey1 = int(E[i]['location']['y1'] * heightScreen / 100)
            for iterate in range(len(locations)):
                E2x0 = int(locations[iterate]['location']['x0'] * widthScreen / 100)
                E2x1 = int(locations[iterate]['location']['x1'] * widthScreen / 100)
                E2y0 = int(locations[iterate]['location']['y0'] * heightScreen / 100)
                E2y1 = int(locations[iterate]['location']['y1'] * heightScreen / 100)
                if (E2x0 > Ex0) & (E2x1 < Ex1) & (E2y0 > Ey0) & (E2y1 < Ey1):
                    inside = 'true'
                    txtWithin.append(E[i])
                else:
                    inside = 'false'
        return txtWithin

    '# OPEN U.E LIST AND CHECK ELEMENT TO MAKE FINAL ARRAY OF ELEMENT USE IN META ALGO'
    if 1 == 1:
        # Take the UE list from DB and put it into buttonUE and textBoxUE
        buttonTxt = []
        textboxTxt = []
        collection = db['userEnable']
        cursor = collection.find({})
        for document in cursor:
            buttonTxt.append(document['button'])
            textboxTxt.append(document['textbox'])

        # check if an element is inside another
        def checkInside(E):
            localResults = []
            Ex0 = E['location']['x0'] * widthScreen / 100
            Ex1 = E['location']['x1'] * widthScreen / 100
            Ey0 = E['location']['y0'] * heightScreen / 100
            Ey1 = E['location']['y1'] * heightScreen / 100
            for E2 in combination:
                E2x0 = E2['location']['x0'] * widthScreen / 100
                E2x1 = E2['location']['x1'] * widthScreen / 100
                E2y0 = E2['location']['y0'] * heightScreen / 100
                E2y1 = E2['location']['y1'] * heightScreen / 100
                if (E['id'] != E2['id']) & (int(E2x0) >= int(Ex0)) & (int(E2x0) <= int(Ex1)) & \
                        (int(E2x1) <= int(Ex1)) & (int(E2x1) >= int(Ex0)) & (int(E2y0) >= int(Ey0)) \
                        & (int(E2y0) <= int(Ey1)) & (int(E2y1) <= int(Ey1)) & (int(E2y1) >= int(Ey0)):
                    localResults.append(E2)
            if len(localResults) > 0:
                finalResult = 'true'
            else:
                finalResult = 'false'
            return finalResult, localResults

        # check if an element is outside another
        def checkOutside(E):
            localResults = []
            Ex0 = E['location']['x0'] * widthScreen / 100
            Ex1 = E['location']['x1'] * widthScreen / 100
            Ey0 = E['location']['y0'] * heightScreen / 100
            Ey1 = E['location']['y1'] * heightScreen / 100
            for E2 in combination:
                E2x0 = E2['location']['x0'] * widthScreen / 100
                E2x1 = E2['location']['x1'] * widthScreen / 100
                E2y0 = E2['location']['y0'] * heightScreen / 100
                E2y1 = E2['location']['y1'] * heightScreen / 100
                if (E['id'] != E2['id']) & (int(Ex0) >= int(E2x0)) & (int(Ex0) <= int(E2x1)) & \
                        (int(Ex1) <= int(E2x1)) & (int(Ex1) >= int(E2x0)) & (int(Ey0) >= int(E2y0)) \
                        & (int(Ey0) <= int(E2y1)) & (int(Ey1) <= int(E2y1)) & (int(Ey1) >= int(E2y0)):
                    localResults.append('1')
            if len(localResults) > 0:
                finalResult = 'false'
            else:
                finalResult = 'true'
            return finalResult

        # check for legend textbox if there is a square next to it or not
        # if square textbox with legend
        def checkRightandBottom(E):
            localResults = []
            Ex1 = E['location']['x1'] * widthScreen / 100
            Ey1 = E['location']['y1'] * heightScreen / 100
            for E2 in combination:
                E2x0 = E2['location']['x0'] * widthScreen / 100
                E2y0 = E2['location']['y0'] * heightScreen / 100
                if (E['id'] != E2['id']) & (E2['type'] == "shapes"):
                    if (E2['name'] == "rectangle with round border parent") \
                            | (E2['name'] == "rectangle with round sides parent") \
                            | (E2['name'] == "rectangle parent"):
                        if ((int(E2x0) >= int(Ex1)) & (int(E2x0) <= int(Ex1) + 30)) \
                                | ((int(E2y0) >= int(Ey1)) & (int(E2y0) <= int(Ey1) + 30)):
                            localResults.append(E2)

            if len(localResults) > 0:
                finalResult = 'true'
            else:
                finalResult = 'false'
            return finalResult, localResults

        #  create the array which will be used in the Meta Algo
        ButtonArray = []
        textBoxArray = []
        textBoxLegendArray = []
        ElementInside = []
        hyperLinkArray = []
        paragraphArray = []
        '# just use to get the ackground color validation'
        ParentElementOCRL1 = []
        '# just to check the eventual boxes or frame'
        ParentElementL1 = []
        '# just to check the eventual boxes or frame'
        ParentElementL2 = []
        '# array of frame and boxes'
        frameArray = []
        '# LOGO'
        logoArray = []
        iconsArray=[]
        pictureArray = []
        textBoxArrayOut = []
        widgetArray = []
        calendarWidgetArray = []
        barChartArray = []
        '# get all results together and '

    # COMBINING ALGORITHM THAT TAKE THE COMBINATION ARRAY : (type, name, id, location)
    if 2 == 2:

        ignoreShapes = []

    # VALIDATION FOR WIDGETS ##
        auxWi= []
        wid = 0
        for E in combination:
            print('E1: ' + str(E))
            if E['name'] == 'widgets':
                wid += 1

            if checkOutside(E) == 'true':
                if E['name'] == 'widgets':
                    auxWi.append(E)
        if len(auxWi) < wid:
            for E in auxWi:
                print('Eliminar outsideTrue: ' + str(E))
                combination.remove(E)

        for E in combination:  # E is information of an element(type, name, id, location)
            print('E1: ' + str(E))
            if checkOutside(E) == 'true':
                print('E outsideTrue: ' + str(E))
                print('******pay attention where segmentIDs lop 2a*****', str(E))
                ParentElementOCRL1.append(E)
                print('Parent element'+str(ParentElementOCRL1))
                if E['type'] == 'ocr':
                    print('******pay attention where segmentIDs 2b *****',str(E))
                    buttonFound = False
                    if buttonTxt:
                        for label in buttonTxt[0]:
                            if E['name'].lower() == label:
                                hyperLinkArray.append(E)
                                print('******pay attention where segmentIDs hyperlink array*****', str(E))
                                buttonFound = True
                    if buttonFound == False:
                        paragraphArray.append(E)
                        print('******pay attention where segmentIDs paragraph array *****', str(E))

                if E['type'] == 'shapes' and E['name'] != 'widgets':
                    if checkInside(E)[0] == 'false':  # checkInside(E)[0] = true or false
                        if E['name'] == 'logo' :
                            logoArray.append(E)
                        elif E['name'] == 'icon':
                            iconsArray.append(E)
                        else:
                            pictureArray.append(E)
                    if checkInside(E)[0] == 'true':
                            print('E2: ' + str(E))
                            ParentElementL1.append(E)
                            for eInside in checkInside(E)[1]:  # checkInside(E)[1]=element info as(type, id, name, location)
                                print('Einside1: ' + str(eInside))
                                if eInside['type'] == 'ocr':
                                    # Assign as a button
                                    if buttonTxt:
                                        for label in buttonTxt[0]:
                                            if eInside['name'].lower() == label:
                                                if (int(E['location']['y1']) - int(eInside['location']['y1']) < 15) | \
                                                        (int(eInside['location']['y0']) - int(E['location']['y0']) < 15):
                                                        ButtonArray.append({'parent': E, 'child': eInside})
                                    # Assign as a textbox
                                    if textboxTxt:
                                        for label in textboxTxt[0]:
                                            if eInside['name'].lower() == label:
                                                if (int(E['location']['y1']) - int(eInside['location']['y1']) < 50) | \
                                                        (int(eInside['location']['y0']) - int(E['location']['y0']) < 50):
                                                    textBoxArray.append({'parent': E, 'child': eInside})
                                    # if @ make it userEnable
                                    '''
                                    if '@' in eInside['name']:
                                        if (int(E['location']['y1']) - int(eInside['location']['y1']) < 50) | \
                                                (int(eInside['location']['y0']) - int(E['location']['y0']) < 50):
                                            textBoxArray.append({'parent': E, 'child': eInside})
                                    '''
                                    # Assign remaining as Paragraph
                                    if textboxTxt:
                                        if eInside['name'].lower() not in textboxTxt[0]:
                                            if eInside['name'].lower() not in buttonTxt[0]:
                                                paragraphArray.append(eInside)

                                if eInside['type'] == 'shapes':

                                    if checkInside(eInside)[0] == 'true':
                                        ParentElementL2.append(eInside)
                                        for eInside2 in checkInside(eInside)[1]:
                                            print('Einside2: ' + str(eInside2))
                                            if eInside2['type'] == 'ocr':
                                                if buttonTxt:
                                                    for label in buttonTxt[0]:
                                                        if eInside2['name'].lower() == label:
                                                            if (int(eInside['location']['y1']) - int(
                                                                    eInside2['location']['y1']) < 50) | \
                                                                    (int(eInside2['location']['y0']) - int(
                                                                        eInside['location']['y0']) < 50):
                                                                ButtonArray.append({'parent': eInside, 'child': eInside2})
                                                if textboxTxt:
                                                    for label in textboxTxt[0]:
                                                        if eInside2['name'].lower() == label:
                                                            if (int(eInside['location']['y1']) - int(
                                                                    eInside2['location']['y1']) < 50) | \
                                                                    (int(eInside2['location']['y0']) - int(
                                                                        eInside['location']['y0']) < 50):
                                                                textBoxArray.append({'parent': eInside, 'child': eInside2})
                                                    '''
                                                        if ('@') in eInside2['name']:
                                                            if (int(eInside['location']['y1']) - int(
                                                                    eInside2['location']['y1']) < 50) | \
                                                                    (int(eInside2['location']['y0']) - int(
                                                                        eInside['location']['y0']) < 50):
                                                                textBoxArray.append({'parent': eInside, 'child': eInside2})
                                                    '''
                                                    if eInside2['name'].lower() not in textboxTxt[0]:
                                                        if eInside2['name'].lower() not in buttonTxt[0]:
                                                            paragraphArray.append(eInside2)

                                                    # if
                if E['name'] == 'widgets':
                    widgetArray.append(E)
            elif E['type'] == 'shapes':
                if E['name'] == 'widgets':
                    widgetArray.append(E)


                elif E not in ButtonArray and E not in textBoxArray and E not in textBoxLegendArray and E not in ElementInside \
                        and E not in hyperLinkArray and E not in paragraphArray and E not in ParentElementOCRL1 \
                        and E not in ParentElementL1 and E not in ParentElementL2 and E not in frameArray and E not in logoArray \
                        and E not in textBoxArrayOut and E not in widgetArray and E not in calendarWidgetArray and E not in barChartArray and E not in pictureArray \
                        and E not in iconsArray:
                    print('something')
                    # if location is not inside another element

                    # logoArray.append(E)  # pictures array
                    print('this element was outside')
                    print('E outsideFalse: ' + str(E))
                    for E2 in combination:
                        if (E2['id'] != E['id']):
                            if (E2['type'] == 'ocr'):
                                if (int(E2['location']['x0']) * widthScreen / 100 <= int(
                                        E['location']['x0']) * widthScreen / 100) and (
                                                    int(E['location']['x0']) * widthScreen / 100 <= int(
                                            E2['location']['x1']) * widthScreen / 100) and \
                                        (int(E2['location']['y0']) * heightScreen / 100 <= int(
                                            E['location']['y0']) * heightScreen / 100) and (
                                                    int(E['location']['y0']) * heightScreen / 100 <= int(
                                            E2['location']['y1']) * heightScreen / 100) and \
                                        (int(E2['location']['x0']) * widthScreen / 100 <= int(
                                            E['location']['x1']) * widthScreen / 100) and (
                                                    int(E['location']['x1']) * widthScreen / 100 <= int(
                                            E2['location']['x1']) * widthScreen / 100) and \
                                        (int(E2['location']['y0']) * heightScreen / 100 <= int(
                                            E['location']['y1']) * heightScreen / 100) and (
                                                    int(E['location']['y1']) * heightScreen / 100 <= int(
                                            E2['location']['y1']) * heightScreen / 100):
                                    print('INSIDE OTHER ELEMENT')
                                    print('Element: ' + str(E) + ' is inside of element: ' + str(E2))
                                    ignoreShapes.append(E)

                else:
                    print('Location in comibnation' + str(E))

        print('ignore all these shapes: ')
        print(str(ignoreShapes))
        print('==========')
        for E in combination:
            if E['type'] == 'shapes':
                if E not in ignoreShapes \
                        and E not in ButtonArray \
                        and E not in textBoxArray \
                        and E not in textBoxLegendArray \
                        and E not in ElementInside \
                        and E not in hyperLinkArray \
                        and E not in paragraphArray \
                        and E not in ParentElementOCRL1 \
                        and E not in ParentElementL1 \
                        and E not in ParentElementL2 \
                        and E not in frameArray \
                        and E not in logoArray \
                        and E not in iconsArray \
                        and E not in pictureArray \
                        and E not in textBoxArrayOut \
                        and E not in widgetArray \
                        and E not in barChartArray\
                        and E not in calendarWidgetArray:
                    print('append these ones: ' + str(E))
                    pictureArray.append(E)
                elif E in ignoreShapes:
                    print('ignore these ones: ' + str(E))
                    db.predictions.update({'segmentation_id': str(E['id'])}, {'$set': {'state': 'inactive'}})
                else:
                    print('ignore these ones: ' + str(E))
    # CHECKING IF FEW WORD IN BUTTON PUT AS ONE LABEL AND KEEP 1 BUTTON
    SizeButtonArray = len(ButtonArray)
    '''
    if SizeButtonArray > 0:
        b = 0
        while b < SizeButtonArray:
            b2 = 0
            if len(ButtonArray[b]) > 1:
                while b2 < len(ButtonArray):
                    if (ButtonArray[b]['parent']['id'] == ButtonArray[b2]['parent']['id']) & (b != b2):
                        name = str(ButtonArray[b]['child']) + ' ' + str(ButtonArray[b2]['child'])
                        ButtonArray[b]['child'] = name
                        ButtonArray.pop(b2)
                        SizeButtonArray = len(ButtonArray)
                    b2 = b2 + 1
            b = b + 1
    '''
    '#FIND EVENTUAL BOXES OR FRAME'

    for f in ParentElementL1:
        id = f['id']
        status = 'false'
        t = 0
        u = 0
        v = 0
        w = 0

        while t < len(ButtonArray):
            if len(ButtonArray[t]) == 2:
                if id == ButtonArray[t]['parent']['id']:
                    status = 'true'
            else:
                if id == ButtonArray[t]['id']:
                    status = 'true'
            t = t + 1

        while u < len(textBoxArray):
            if id == textBoxArray[u]['parent']['id']:
                status = 'true'
            u = u + 1

        while v < len(textBoxLegendArray):
            if id == textBoxLegendArray[v]['txtbox']['id']:
                status = 'true'
            v = v + 1

        if status == 'false':
            frameArray.append(f)
    for f in ParentElementL2:
        id = f['id']
        status = 'false'
        t = 0
        u = 0
        v = 0

        while t < len(ButtonArray):
            if len(ButtonArray[t]) == 2:
                if id == ButtonArray[t]['parent']['id']:
                    status = 'true'
            else:
                if id == ButtonArray[t]['id']:
                    status = 'true'
            t = t + 1

        while u < len(textBoxArray):
            if id == textBoxArray[u]['parent']['id']:
                status = 'true'
            u = u + 1

        while v < len(textBoxLegendArray):
            if id == textBoxLegendArray[v]['txtbox']['id']:
                status = 'true'
            v = v + 1
        if f in widgetArray:
            status = 'true'

        if status == 'false':
            frameArray.append(f)

    '# GO THROUGH ALL THE FINAL ARRAY AND REMOVE EVENTUAL COPY'
    if 'copy' == 'copy':
        a = 0
        sizea = len(ButtonArray)
        b = 0
        sizeb = len(textBoxArray)
        c = 0
        sizec = len(textBoxLegendArray)
        d = 0
        sized = len(hyperLinkArray)
        e = 0
        sizee = len(paragraphArray)
        f = 0
        sizef = len(frameArray)

        while a < sizea:
            a1 = 0
            while a1 < sizea:
                if a != a1:
                    if (len(ButtonArray[a]) == 2) & (len(ButtonArray[a1]) == 2):
                        if ButtonArray[a]['parent']['id'] == ButtonArray[a1]['parent']['id']:
                            ButtonArray.pop(a1)
                            sizea = sizea - 1
                            a1 = a1 - 1
                    if (len(ButtonArray[a]) == 2) & (len(ButtonArray[a1]) != 2):
                        if ButtonArray[a]['parent']['id'] == ButtonArray[a1]['id']:
                            ButtonArray.pop(a1)
                            sizea = sizea - 1
                            a1 = a1 - 1
                    if (len(ButtonArray[a]) != 2) & (len(ButtonArray[a1]) == 2):
                        if ButtonArray[a]['id'] == ButtonArray[a1]['parent']['id']:
                            ButtonArray.pop(a1)
                            sizea = sizea - 1
                            a1 = a1 - 1
                    if (len(ButtonArray[a]) != 2) & (len(ButtonArray[a1]) != 2):
                        if ButtonArray[a]['id'] == ButtonArray[a1]['id']:
                            ButtonArray.pop(a1)
                            sizea = sizea - 1
                            a1 = a1 - 1
                a1 = a1 + 1
            a = a + 1

        while b < sizeb:
            b1 = 0
            while b1 < sizeb:
                if b != b1:
                    if textBoxArray[b]['child']['id'] == textBoxArray[b1]['child']['id']:
                        textBoxArray.pop(b1)
                        sizeb = sizeb - 1
                        b1 = b1 - 1
                b1 = b1 + 1
            b = b + 1

        while c < sizec:
            c1 = 0
            while c1 < sizec:
                if c != c1:
                    if textBoxLegendArray[c]['legend']['id'] == textBoxLegendArray[c1]['legend']['id']:
                        textBoxLegendArray.pop(c1)
                        sizec = sizec - 1
                        c1 = c1 - 1
                c1 = c1 + 1
            c = c + 1

        while d < sized:
            d1 = 0
            while d1 < sized:
                if d != d1:
                    if hyperLinkArray[d]['id'] == hyperLinkArray[d1]['id']:
                        hyperLinkArray.pop(d1)
                        sized = sized - 1
                        d1 = d1 - 1
                d1 = d1 + 1
            d = d + 1

        while e < sizee:
            e1 = 0
            while e1 < sizee:
                if e != e1:
                    if paragraphArray[e]['id'] == paragraphArray[e1]['id']:
                        print('i was popped out:' + paragraphArray[e]['id'])
                        paragraphArray.pop(e1)
                        sizee = sizee - 1
                        e1 = e1 - 1
                e1 = e1 + 1
            e = e + 1

        while f < sizef:
            f1 = 0
            while f1 < sizef:
                if f != f1:
                    if frameArray[f]['id'] == frameArray[f1]['id']:
                        frameArray.pop(f1)
                        sizef = sizef - 1
                        f1 = f1 - 1
                f1 = f1 + 1
            f = f + 1

    '##################  STOP MAKING ARRAY OF OCR AND CNN FOR COMBINING ALGO ###################################'

    tBox = []
    tArea = []

    for t in textBoxArray:  # + textBoxLegendArray:
        tHeight = (int(t['parent']['location']['y1']) - int(
            t['parent']['location']['y0']))

        if float(int(tHeight)) <= 15:
            tBox.append(t)
        else:
            tArea.append(t)

    screenshot_id = combination[0]['screenshot_id']
    date = datetime.now(pytz.timezone('Australia/Melbourne'))
    print('see what happens' + str(ButtonArray))
    if state == 'save':
        save_collection(db.buttons, ButtonArray, screenshot_id, date)

        save_collection(db.textBoxes, tBox, screenshot_id, date)
        save_collection(db.textArea, tArea , screenshot_id, date)

        save_text_collection(db.paragraphs, paragraphArray, screenshot_id, date)

        save_text_collection(db.hyperLinks, hyperLinkArray, screenshot_id, date)

        save_text_collection(db.frames, frameArray, screenshot_id, date)

        save_text_collection(db.logo, logoArray, screenshot_id, date)

        save_text_collection(db.widgets, widgetArray, screenshot_id, date)

        save_text_collection(db.calendarWidgets, calendarWidgetArray, screenshot_id, date)

        save_text_collection(db.barChart, barChartArray, screenshot_id, date)

        save_text_collection(db.icon, iconsArray, screenshot_id, date)

        save_text_collection(db.pictures, pictureArray, screenshot_id, date)

    def colorBoW(croppedOcr):
        '#JVTWN'
        fontColor = "UNKNOWN"

        '#ILBNDY'
        r0 = io.imread(croppedOcr)
        r = color.rgb2gray(io.imread(croppedOcr))
        '#UC'
        contours = measure.find_contours(r, 0.8)
        for n, contour in enumerate(contours):
            if n == 0:
                a = 0
                b = 0
                c = 0
                while c < len(contour[:, 1]):
                    string = str(contour[:, 1][c])
                    if string[len(string) - 2:] != ".0":
                        c = c + 1
                    else:
                        a = contour[:, 1][c]
                        c = len(contour[:, 1]) + 1
                c1 = 0
                while c1 < len(contour[:, 0]):
                    string = str(contour[:, 0][c1])
                    if string[len(string) - 2:] != ".0":
                        c1 = c1 + 1
                    else:
                        b = contour[:, 0][c1]
                        c1 = len(contour[:, 0]) + 1
                try:
                    outside2 = r0[int(b) + 2, int(a)]
                    outside3 = r0[int(b) + 2, int(a) - 1]
                    outside4 = r0[int(b) + 2, int(a) + 1]

                    inside2 = r0[int(b) - 2, int(a)]
                    inside3 = r0[int(b) - 3, int(a)]
                    inside4 = r0[int(b) - 4, int(a)]
                    '#DFC'

                    print('croppedOCR: '+str(croppedOcr))
                    # print('R0: '+str(r0))
                    out2 = float(float(outside2[0]) * 0.299 + float(outside2[1]) * 0.587 + float(outside2[2]) * 0.114)
                    out3 = float(float(outside3[0]) * 0.299 + float(outside3[1]) * 0.587 + float(outside3[2]) * 0.114)
                    out4 = float(float(outside4[0]) * 0.299 + float(outside4[1]) * 0.587 + float(outside4[2]) * 0.114)

                    in2 = float(float(inside2[0]) * 0.299 + float(inside2[1]) * 0.587 + float(inside2[2]) * 0.114)
                    in3 = float(float(inside3[0]) * 0.299 + float(inside3[1]) * 0.587 + float(inside3[2]) * 0.114)
                    in4 = float(float(inside4[0]) * 0.299 + float(inside4[1]) * 0.587 + float(inside4[2]) * 0.114)

                    print('outside2: '+str(out2))
                    print('outside3: '+str(out3))
                    print('outside4: '+str(out4))
                    print('inside2: '+str(in2))
                    print('inside3: '+str(in3))
                    print('inside4: '+str(in4))

                    if ((out2 < 186) or (out3 < 186) or (out4 < 186)):
                        if ((in2 > 130) or (in3 > 130) or (in4 > 130)):
                            print('i am close to white')
                            fontColor = "(255, 255, 255)"
                        else:
                            fontColor = str('(' + str(inside2[0]) + ', ' + str(inside2[1]) + ', ' + str(inside2[2]) + ')')
                    elif ((out2 >= 186) or (out3 >= 186) or (out4 >= 186)):
                        if ((in2 < 130) or (in3 < 130) or (in4 < 130)):
                            print('i am close to black')
                            fontColor = "(50, 50, 50)"
                        else:
                            fontColor = str('(' + str(inside2[0]) + ', ' + str(inside2[1]) + ', ' + str(inside2[2]) + ')')

                except:
                    print('==========================contour=========================================')
                    print(croppedOcr)

        if fontColor == "UNKNOWN":
            fontColor = "(206, 205, 207)"
            print('fail', croppedOcr)

        return 'rgb' + fontColor

    if 7 == 7:

        if state == 'save':
            circleBorder = 0
            sidesParent = 0
            roundBorder = 0
            rectBorder = 0
            print('check over here: ')
            #txtBox, button,

            # circle parent
            # rectangle with round sides parent
            # rectangle with round border parent
            # rectangle parent

            circleBorder, rectBorder, roundBorder, sidesParent = checkNameArray(ButtonArray,circleBorder, rectBorder, roundBorder, sidesParent)
            circleBorder, rectBorder, roundBorder, sidesParent = checkNameArray(textBoxArray,circleBorder, rectBorder, roundBorder, sidesParent)
            circleBorder, rectBorder, roundBorder, sidesParent = checkNameArrayNoParent(frameArray,circleBorder, rectBorder, roundBorder, sidesParent)

            print(circleBorder)
            print(sidesParent)
            print(roundBorder)
            print(rectBorder)

            d = {'circleBorder': circleBorder, 'sidesParent': sidesParent, 'roundBorder': roundBorder,'rectBorder':rectBorder}
            result = max(d, key=d.get)
            print(result)

            if result == 'circleBorder':
                print('CIRCLE')
                for button in ButtonArray:
                    button['parent']['name'] = 'circle parent'
                for txtbox in textBoxArray:
                    txtbox['parent']['name'] = 'circle parent'
            elif result == 'sidesParent':
                print('RECT SIDES')
                for button in ButtonArray:
                    button['parent']['name'] = 'rectangle with round sides parent'
                for txtbox in textBoxArray:
                    txtbox['parent']['name'] = 'rectangle with round sides parent'
            elif result == 'roundBorder':
                print('RECT ROUND')
                for button in ButtonArray:
                    button['parent']['name'] = 'rectangle with round border parent'
                for txtbox in textBoxArray:
                    txtbox['parent']['name'] = 'rectangle with round border parent'
            elif result == 'rectBorder':
                print('RECT')
                for button in ButtonArray:
                    button['parent']['name'] = 'rectangle parent'
                for txtbox in textBoxArray:
                    txtbox['parent']['name'] = 'rectangle parent'

        print('after \n')
        print("button", ButtonArray)
        print("paragraph", paragraphArray)
        print("hyperLink", hyperLinkArray)
        print("txtBox", textBoxArray)
        print("txtBoxLegend", textBoxLegendArray)
        print("frame", frameArray)
        print("logo", logoArray)
        print("icon", iconsArray)
        print("image", pictureArray)

        print('this is my image root, dont change: ' + str(myFile))
        mainImage = io.imread('media/' + str(myFile))  # facebookLogin root

        transferColors = []

        '#CREATING FRAME OR BOXES'
        for f in frameArray:

            classid = f['id']
            width = str(int(f['location']['x1']) - int(f['location']['x0']))
            print('framecheck')
            print(f)
            height = str(int(f['location']['y1']) - int(f['location']['y0']))
            positionL = str(int(f['location']['x0']))
            positionT = str(int(f['location']['y0']))

            '# FRAME STYLE'
            if 'style' == 'style':
                print(int(f['location']['y1']))
                print(int(f['location']['y0']))
                print(int(f['location']['x0']))

                bgcolorarray = getBgColorArray(f, mainImage, heightScreen, widthScreen, 2, 15)
                colorarray = getColorBackgroundBody(ParentElementL1, heightScreen, mainImage, widthScreen)
                print(bgcolorarray)

                if checkColorWithBackground(colorarray, bgcolorarray, 10):
                    print('RGB is to close to background')
                    bgcolorarray = getBgColorArray(f, mainImage, heightScreen, widthScreen, 4, 30)
                    print(bgcolorarray)

                bgcolor = getRGBColor(bgcolorarray)

                bordercolorarray = getBorderColorArray(f, heightScreen, mainImage, widthScreen, 0)

                tries = 0
                while tries < 10:
                    if checkColorWithBackground(colorarray, bordercolorarray, 10):
                        print('RGB Border is to close to background')
                        bordercolorarray = getBorderColorArray(f, heightScreen, mainImage, widthScreen, tries)
                        tries += 1
                    else:
                        tries += 10

                bordercolor = getRGBColor(bordercolorarray)

                if checkBorderColorInrange(bgcolorarray, bordercolorarray, 50):
                    bordercolor = bgcolor

                if f['name'] == 'rectangle with round sides parent':
                    borderRadius = '40'
                elif f['name'] == 'rectangle with round border parent':
                    borderRadius = '10'
                elif f['name'] == 'rectangle parent':
                    borderRadius = '0'
                elif f['name'] == 'circle parent':
                    borderRadius = '100'
                else:
                    borderRadius = '0'

            if state == 'save':
                updatePredictions(classid, '', '', bordercolor, borderRadius, bgcolor, '', '')
            elif state == 'color':
                updateColor(classid, '', bordercolor, bgcolor)
            elif state == 'colorTransfer':
                transferColors.append(
                    {'classid': classid, 'fontColor': '', 'bordercolor': bordercolor, 'bgcolor': bgcolor})

        '#CREATING BUTTON'
        for button in ButtonArray:
            print('button child')
            print(button['child'])
            print(button)
            if len(ButtonArray) > 0:

                if len(button) == 2:
                    classid = str(button['parent']['id'])  # button['parent']['id']
                    width = str(int(button['parent']['location']['x1']) - int(
                        button['parent']['location']['x0']))
                    height = str(int(button['parent']['location']['y1']) - int(
                        button['parent']['location']['y0']))
                    positionL = str(int(button['parent']['location']['x0']))
                    positionT = str(int(button['parent']['location']['y0']))

                    label = str(button['child']['name'])
                    fSize = int(button['child']['location']['y1']) - int(button['child']['location']['y0'])
                    bboxWidth = float(width) * viewWidth / 100
                    charactesLen = len(str(button['child']['name']))
                    checker = float(bboxWidth) / int(charactesLen) / 0.44128
                    if fSize >= checker:
                        fSize = checker

                    '# BUTTON STYLE BG, Border..'
                    if 'style' == 'style':

                        bgcolorarray = getBgColorArray(button['parent'], mainImage, heightScreen, widthScreen, 2, 15)
                        colorarray = getColorBackgroundBody(ParentElementL1, heightScreen, mainImage, widthScreen)
                        print(bgcolorarray)

                        if checkColorWithBackground(colorarray, bgcolorarray, 10):
                            print('RGB is to close to background')
                            bgcolorarray = getBgColorArray(button['parent'], mainImage, heightScreen, widthScreen, 4,
                                                           30)
                            print(bgcolorarray)

                        bgcolor = getRGBColor(bgcolorarray)

                        bordercolorarray = getBorderColorArray(button['parent'], heightScreen, mainImage, widthScreen,
                                                               1)

                        tries = 0
                        while tries < 10:
                            if checkColorWithBackground(colorarray, bordercolorarray, 10):
                                print('RGB Border is to close to background')
                                bordercolorarray = getBorderColorArray(button['parent'], heightScreen, mainImage,
                                                                       widthScreen, tries)
                                tries += 1
                            else:
                                tries += 10

                        bordercolor = getRGBColor(bordercolorarray)

                        if checkBorderColorInrange(bgcolorarray, bordercolorarray, 50):
                            bordercolor = bgcolor

                        fontColor = colorBoW(button['child']['root'])

                        if button['parent']['name'] == 'rectangle with round sides parent':
                            borderRadius = '40'
                        elif button['parent']['name'] == 'rectangle with round border parent':
                            borderRadius = '10'
                        elif button['parent']['name'] == 'rectangle parent':
                            borderRadius = '0'
                        elif button['parent']['name'] == 'circle parent':
                            borderRadius = '100'
                        else:
                            borderRadius = '0'

                else:
                    label = button['name']
                    classid = 'test' + str(button['id'])  # button['id']
                    width = str(int(button['location']['x1']) - int(
                        button['location']['x0']))
                    height = str(int(button['location']['y1']) - int(
                        button['location']['y0']))
                    positionL = str(int(button['location']['x0']))
                    positionT = str(int(button['location']['y0']))
                    fSize = int(button['location']['y1']) - int(button['location']['y0'])

                    '# BUTTON STYLE BG, Border..'
                    if ('style' == 'style'):
                        bgcolorarray = getBgColorArray(button, mainImage, heightScreen, widthScreen, 2, 15)
                        colorarray = getColorBackgroundBody(ParentElementL1, heightScreen, mainImage, widthScreen)
                        print(bgcolorarray)

                        if (colorarray[0] - 10 <= bgcolorarray[0] <= colorarray[0] + 10) \
                                | (colorarray[1] - 10 <= bgcolorarray[1] <= colorarray[1] + 10) \
                                | (colorarray[2] - 10 <= bgcolorarray[2] <= colorarray[2] + 10):
                            print('RGB is to close to background')
                            bgcolorarray = getBgColorArray(button, mainImage, heightScreen, widthScreen, 4, 30)
                            print(bgcolorarray)

                        bgcolor = getRGBColor(bgcolorarray)

                        bordercolorarray = getBorderColorArray(button, heightScreen, mainImage, widthScreen, 0)

                        tries = 0
                        while tries < 10:
                            if checkColorWithBackground(colorarray, bordercolorarray, 10):
                                print('RGB Border is to close to background')
                                bordercolorarray = getBorderColorArray(button, heightScreen, mainImage, widthScreen,
                                                                       tries)
                                tries += 1
                            else:
                                tries += 10

                        bordercolor = getRGBColor(bordercolorarray)
                        if checkBorderColorInrange(bgcolorarray, bordercolorarray, 50):
                            bordercolor = bgcolor

                        fontColor = colorBoW(button['child']['root'])

                        if button['parent']['name'] == 'rectangle with round sides parent':
                            borderRadius = '40'
                        elif button['parent']['name'] == 'rectangle with round border parent':
                            borderRadius = '5'
                        elif button['parent']['name'] == 'rectangle parent':
                            borderRadius = '0'
                        elif button['parent']['name'] == 'circle parent':
                            borderRadius = '100'
                        else:
                            borderRadius = '0'

                print(button)
                print('font-size: ' + str(fSize))
                # fSize *= 100 / int(heightScreen)
                print('font-size percentage: ' + str(fSize))
                fontSize = fSize * viewHeight / 100
                print(str(fontSize))
                if state == 'save':
                    updatePredictions(classid, str(fontSize), fontColor, bordercolor, borderRadius, bgcolor, '', '')
                elif state == 'color':
                    updateColor(classid, fontColor, bordercolor, bgcolor)
                elif state == 'colorTransfer':
                    transferColors.append(
                        {'classid': classid, 'fontColor': fontColor, 'bordercolor': bordercolor, 'bgcolor': bgcolor})

        '#CREATING HYPERLINK'
        for h in hyperLinkArray:
            if len(hyperLinkArray) > 0:
                lNumber = getLineNumbers(str(h['id']))
                classid = str(h['id'])  # button['id']
                # width = str(int(h['location']['x1)]  - int(h['location']['x0)] )
                fSize = int(h['location']['y1']) - int(h['location']['y0'])
                fSize /= lNumber
                # print('font-size percentage: '+str(fSize)+' '+h['id'])
                fontSize = str(fSize * viewHeight / 100)
                width = float(int(h['location']['x1']) - int(h['location']['x0']))
                word = str(h['name'])

                if lNumber >= 1:
                    if word.islower():
                        textWidth = float((float(fontSize) * 0.4515) * float(len(str(h['name']))))
                    elif word.isupper():
                        textWidth = float((float(fontSize) * 0.6064) * float(len(str(h['name']))))
                    elif not word.islower() and not word.isupper():
                        textWidth = float((float(fontSize) * 0.5289) * float(len(str(h['name']))))

                    print(str(h['name']) + ' textWidth: ' + str(textWidth))
                    print('width: ' + str(width * viewWidth / 100))

                    bboxWidth = float(width) * viewWidth / 100
                    charactesLen = len(str(h['name']))
                    checker = float(bboxWidth) / int(charactesLen) / 0.44128
                    if float(fontSize) >= float(checker):
                        fontSize = checker

                    if lNumber == 1:
                        if (width * viewWidth / 100) / 4 * 3 >= textWidth:
                            textAlign = 'center'  # 'center'
                        else:
                            textAlign = 'unset'
                    else:
                        textAlign = 'unset'
                else:
                    textAlign = 'unset'

                positionL = str(int(h['location']['x0']))
                positionT = str(int(h['location']['y0']))
                text_string = str(h['name'])

                fontColor = colorBoW(str(h['root']))
                if state == 'save':
                    updatePredictions(classid, str(fontSize), fontColor, '', '', '', textAlign, '')
                elif state == 'color':
                    updateColor(classid, fontColor, '', '')
                elif state == 'colorTransfer':
                    transferColors.append(
                        {'classid': classid, 'fontColor': fontColor, 'bordercolor': '', 'bgcolor': ''})
        '#CREATING PARAGRAPH'
        for p in paragraphArray:

            if len(paragraphArray) > 0:

                lNumber = getLineNumbers(str(p['id']))
                classid = str(p['id'])  # button['id']
                width = float(int(p['location']['x1']) - int(p['location']['x0']))
                height = str(p['location']['y1'] - p['location']['y0'])
                print('width: ' + str(width * viewWidth / 100))
                fSize = int(p['location']['y1']) - int(p['location']['y0'])
                fSize /= lNumber
                fontSize = str(fSize * viewHeight / 100)
                charactesLen = len(str(p['name']))
                bboxWidth = float(width) * viewWidth / 100
                word = str(p['name'])

                if lNumber >= 1:
                    if word.islower():
                        textWidth = float((float(fontSize) * 0.44128) * float(len(str(p['name']))))
                        checker = float(bboxWidth) / int(charactesLen) / 0.44128
                    elif word.isupper():
                        textWidth = float((float(fontSize) * 0.6064) * float(len(str(p['name']))))
                        checker = float(bboxWidth) / int(charactesLen) / 0.6064
                    elif not word.islower() and not word.isupper():
                        textWidth = float((float(fontSize) * 0.5289) * float(len(str(p['name']))))
                        checker = float(bboxWidth) / int(charactesLen) / 0.5289

                    print(str(p['name']) + ' textWidth: ' + str(textWidth))

                    if lNumber == 1:
                        if (width * viewWidth / 100) / 4 * 3 >= textWidth:
                            textAlign = 'center'  # 'center'
                        else:
                            textAlign = 'unset'
                    else:
                        textAlign = 'unset'

                    if float(fontSize) >= float(checker):
                        fontSize = checker
                else:
                    textAlign = 'unset'

                positionL = str(int(p['location']['x0']))
                positionT = str(int(p['location']['y0']))
                text_string = str(p['name'])

                fontColor = colorBoW(str(p['root']))

                if state == 'save':
                    updatePredictions(classid, str(fontSize), fontColor, '', '', '', textAlign, '')
                elif state == 'color':
                    updateColor(classid, fontColor, '', '')
                elif state == 'colorTransfer':
                    transferColors.append(
                        {'classid': classid, 'fontColor': fontColor, 'bordercolor': '', 'bgcolor': ''})

        '#CREATING TEXTBOX'
        for t in tBox:

            if len(tBox) > 0:
                lNumber = getLineNumbers(str(t['child']['id']))

                classid = str(t['parent']['id'])  # button['id']
                fSize = int(t['child']['location']['y1']) - int(t['child']['location']['y0'])
                fSize /= lNumber
                fontSize = str(fSize * viewHeight / 100)
                width = str(int(t['parent']['location']['x1']) - int(
                    t['parent']['location']['x0']))
                height = str(int(t['parent']['location']['y1']) - int(
                    t['parent']['location']['y0']))
                positionL = str(int(t['parent']['location']['x0']))
                print('afterr')
                print(str(int(t['parent']['location']['y0'])))
                positionT = int(t['parent']['location']['y0'])
                name = str(t['child']['name'])
                placeholder = str(t['child']['name'])
                childOffset = t['child']['location']['x0'] - t['parent']['location']['x0']
                childOffset *= viewWidth / 100

                '# BUTTON STYLE BG, Border..'
                if 'style' == 'style':

                    bgcolorarray = getBgColorArray(t['parent'], mainImage, heightScreen, widthScreen, 2, 15)
                    colorarray = getColorBackgroundBody(ParentElementL1, heightScreen, mainImage, widthScreen)
                    print(bgcolorarray)

                    if (colorarray[0] - 10 <= bgcolorarray[0] <= colorarray[0] + 10) \
                            | (colorarray[1] - 10 <= bgcolorarray[1] <= colorarray[1] + 10) \
                            | (colorarray[2] - 10 <= bgcolorarray[2] <= colorarray[2] + 10):
                        print('RGB is to close to background')
                        bgcolorarray = getBgColorArray(t['parent'], mainImage, heightScreen, widthScreen, 4, 30)
                        print(bgcolorarray)

                    bgcolor = getRGBColor(bgcolorarray)

                    bordercolorarray = getBorderColorArray(t['parent'], heightScreen, mainImage, widthScreen, 1)
                    tries = 0
                    while tries < 10:
                        if checkColorWithBackground(colorarray, bordercolorarray, 10):
                            print('RGB Border is to close to background')
                            bordercolorarray = getBorderColorArray(t['parent'], heightScreen, mainImage, widthScreen,
                                                                   tries)
                            tries += 1
                        else:
                            tries += 10

                    bordercolor = getRGBColor(bordercolorarray)

                    if checkBorderColorInrange(bgcolorarray, bordercolorarray, 50):
                        bordercolor = bgcolor

                    if t['parent']['name'] == 'rectangle with round sides parent':
                        borderRadius = '40'
                    elif t['parent']['name'] == 'rectangle with round border parent':
                        borderRadius = '10'
                    elif t['parent']['name'] == 'rectangle parent':
                        borderRadius = '0'
                    elif t['parent']['name'] == 'circle parent':
                        borderRadius = '100'
                    else:
                        borderRadius = '0'
                print('we know: ' + str(height))
                print('elment: ' + name + ', bgcolor is: ' + bgcolor + ', bordercolor is: ' + bordercolor)
                textAlign = 'unset'

                fontColor = colorBoW(str(t['child']['root']))

                if state == 'save':
                    updatePredictions(classid, str(fontSize), fontColor, bordercolor, borderRadius, bgcolor, textAlign,
                                      childOffset)
                elif state == 'color':
                    updateColor(classid, fontColor, bordercolor, 'rgb(255,255,255)')
                elif state == 'colorTransfer':
                    transferColors.append(
                        {'classid': classid, 'fontColor': fontColor, 'bordercolor': bordercolor, 'bgcolor': 'white'})
        '#CREATING TEXTAREA'
        for t in tArea:

            if len(tArea) > 0:
                lNumber = getLineNumbers(str(t['child']['id']))

                classid = str(t['parent']['id'])  # button['id']
                fSize = int(t['child']['location']['y1']) - int(t['child']['location']['y0'])
                fSize /= lNumber
                fontSize = str(fSize * viewHeight / 100)
                width = str(int(t['parent']['location']['x1']) - int(
                    t['parent']['location']['x0']))
                height = str(int(t['parent']['location']['y1']) - int(
                    t['parent']['location']['y0']))
                positionL = str(int(t['parent']['location']['x0']))
                print('afterr')
                print(str(int(t['parent']['location']['y0'])))
                positionT = int(t['parent']['location']['y0'])
                name = str(t['child']['name'])
                placeholder = str(t['child']['name'])
                childOffset = t['child']['location']['x0'] - t['parent']['location']['x0']
                childOffset *= viewWidth / 100

                '# BUTTON STYLE BG, Border..'
                if 'style' == 'style':

                    bgcolorarray = getBgColorArray(t['parent'], mainImage, heightScreen, widthScreen, 2, 15)
                    colorarray = getColorBackgroundBody(ParentElementL1, heightScreen, mainImage, widthScreen)
                    print(bgcolorarray)

                    if (colorarray[0] - 10 <= bgcolorarray[0] <= colorarray[0] + 10) \
                            | (colorarray[1] - 10 <= bgcolorarray[1] <= colorarray[1] + 10) \
                            | (colorarray[2] - 10 <= bgcolorarray[2] <= colorarray[2] + 10):
                        print('RGB is to close to background')
                        bgcolorarray = getBgColorArray(t['parent'], mainImage, heightScreen, widthScreen, 4, 30)
                        print(bgcolorarray)

                    bgcolor = getRGBColor(bgcolorarray)

                    bordercolorarray = getBorderColorArray(t['parent'], heightScreen, mainImage, widthScreen, 1)
                    tries = 0
                    while tries < 10:
                        if checkColorWithBackground(colorarray, bordercolorarray, 10):
                            print('RGB Border is to close to background')
                            bordercolorarray = getBorderColorArray(t['parent'], heightScreen, mainImage, widthScreen,
                                                                   tries)
                            tries += 1
                        else:
                            tries += 10

                    bordercolor = getRGBColor(bordercolorarray)

                    if checkBorderColorInrange(bgcolorarray, bordercolorarray, 50):
                        bordercolor = bgcolor

                    if t['parent']['name'] == 'rectangle with round sides parent':
                        borderRadius = '40'
                    elif t['parent']['name'] == 'rectangle with round border parent':
                        borderRadius = '10'
                    elif t['parent']['name'] == 'rectangle parent':
                        borderRadius = '0'
                    elif t['parent']['name'] == 'circle parent':
                        borderRadius = '100'
                    else:
                        borderRadius = '0'

                fontSize = fSize * viewHeight / 100
                print('textareaa' + str(height))
                print('elment: ' + name + ', bgcolor is: ' + bgcolor + ', bordercolor is: ' + bordercolor)
                textAlign = 'unset'

                fontColor = colorBoW(str(t['child']['root']))

                if state == 'save':
                    updatePredictions(classid, str(fontSize), fontColor, bordercolor, borderRadius, bgcolor, textAlign,
                                      childOffset)
                elif state == 'color':
                    updateColor(classid, fontColor, bordercolor, 'white')
                elif state == 'colorTransfer':
                    transferColors.append(
                        {'classid': classid, 'fontColor': fontColor, 'bordercolor': bordercolor, 'bgcolor': 'white'})
        '#CREATING TEXTBOX WITH LEGEND'
        '''
        for tl in textBoxLegendArray:

            if len(textBoxLegendArray) > 0:

                legend = str(tl['legend']['name'])
                classidf = str(tl['legend']['id'])  # button['id']
                positionLf = str(int(int(tl['legend']['location']['x0']) ))
                print('afterrr')
                print('position t:' + str(tl['legend']['location']['y0']))
                positionTf = int(int(tl['legend']['location']['y0']))
                fSize = int(tl['legend']['location']['y1']) - int(tl['legend']['location']['y0'])
                # print('font-size percentage: '+str(fSize))

                fontSize = 95 # str(fSize * viewHeight / 100)

                widthtb = str(int(int(tl['txtbox']['location']['x1'])) - int(
                    int(tl['txtbox']['location']['x0']) ))
                heighttb = str(int(int(tl['txtbox']['location']['y1'])) - int(
                    int(tl['txtbox']['location']['y0'])))
                positionLtb = str(int(int(tl['txtbox']['location']['x0']) ))
                positionTtb = str(int(int(tl['txtbox']['location']['y0'])))
                classidtb = str(tl['txtbox']['id'])
                childOffset = 0

                '# TXTBOX STYLE BG, Border..'
                if 'style' == 'style':
                    bgcolorarray = getBgColorArray(tl['txtbox'], mainImage, heightScreen, widthScreen, 2, 15)
                    colorarray = getColorBackgroundBody(ParentElementL1, heightScreen, mainImage, widthScreen)
                    print(bgcolorarray)

                    if (colorarray[0] - 10 <= bgcolorarray[0] <= colorarray[0] + 10) \
                            | (colorarray[1] - 10 <= bgcolorarray[1] <= colorarray[1] + 10) \
                            | (colorarray[2] - 10 <= bgcolorarray[2] <= colorarray[2] + 10):
                        print('RGB is to close to background')
                        bgcolorarray = getBgColorArray(tl['txtbox'], mainImage, heightScreen, widthScreen, 4, 30)
                        print(bgcolorarray)

                    bgcolor = getRGBColor(bgcolorarray)

                    bordercolorarray = getBorderColorArray(tl['txtbox'], heightScreen, mainImage, widthScreen, 1)
                    tries = 0
                    while tries < 10:
                        if checkColorWithBackground(colorarray, bordercolorarray, 10):
                            print('RGB Border is to close to background')
                            bordercolorarray = getBorderColorArray(tl['txtbox'], heightScreen, mainImage, widthScreen, tries)
                            tries += 1
                        else:
                            tries += 10

                    bordercolor = getRGBColor(bordercolorarray)

                    if checkBorderColorInrange(bgcolorarray, bordercolorarray, 50):
                        bordercolor = bgcolor

                    if tl['txtbox']['name'] == 'rectangle with round sides parent':
                        borderRadius = '40'
                    elif tl['txtbox']['name'] == 'rectangle with round border parent':
                        borderRadius = '10'
                    elif tl['txtbox']['name'] == 'rectangle parent':
                        borderRadius = '0'
                    elif tl['txtbox']['name'] == 'circle parent':
                        borderRadius = '100'

                if str(heighttb) <= '15':
                    print('we know: ' + str(heighttb))

                    updatePredictions(classid, str(fontSize), fontColor, bordercolor, borderRadius, bgcolor, textAlign, childOffset)
                    create_text_box_legend(legend, classidf, positionLf, str(positionTf), str(fontSize),
                                           classidtb, widthtb, heighttb, borderRadius, str(positionLtb),
                                           str(positionTtb), bgcolor, str(childOffset), bordercolor)
                else:
                    fontSize = fSize * viewHeight / 100
                    print('this is textarea: ' + str(heighttb))

                    updatePredictions(classid, str(fontSize), fontColor, bordercolor, borderRadius, bgcolor, textAlign, childOffset)
                    create_text_area(legend, legend, classidf, widthtb, heighttb, positionLf, str(positionTf),
                                     str(childOffset),str(fontSize), bgcolor, borderRadius, bordercolor)
        '''
        if len(ParentElementL1) <= 0:
            l = 1
        else:
            l = len(ParentElementL1)
        try:
            print(ParentElementL1)
            parent = ParentElementL1[l - 1]['location']
            mainImage = io.imread('media/' + str(myFile))
            colorr = mainImage[int(int(parent['y0']) * heightScreen / 100 - 2)][
                int(int(parent['x0']) * widthScreen / 100 - 2)]
        except:
            colorr = [200,200,200]

        if state == 'save' or state == 'color':
            if db.backgrounds.find_one({'screenshot_id': screenshot_id}) != None:
                db.backgrounds.update({'screenshot_id': screenshot_id},
                                      {'$set':
                                          {
                                              'screenshot_id': screenshot_id,
                                              'background': 'linear-gradient(to top, rgb(' + str(colorr[0]) + ', '
                                                        + str(colorr[1]) + ', ' + str(colorr[2]) + ') 20%, rgb(' +
                                                        str(colorr[0]) + ', ' + str(colorr[1]) + ', ' + str(colorr[2]) + ') 75%)',
                                              'timeStamp': str(date),
                                              'timeZone': 'Australia/Melbourne',
                                              'text-angle': 'linear-gradient',
                                              'text-direction': 'to top'
                                          }
                                      })
            else:
                db.backgrounds.insert({
                    'screenshot_id': screenshot_id,
                    'background': 'linear-gradient(to top, rgb(' + str(colorr[0]) + ', ' + str(colorr[1]) + ', ' + str(
                        colorr[2]) + ') 20%, rgb(' + str(colorr[0]) + ', ' + str(colorr[1]) + ', ' + str(
                        colorr[2]) + ') 75%)',
                    'timeStamp': str(date),
                    'timeZone': 'Australia/Melbourne',
                    'text-angle': 'linear-gradient',
                    'text-direction': 'to top'
                })
        else:
            bgSectionColor = 'rgb(' + str(colorr[0]) + ', ' + str(colorr[1]) + ', ' + str(colorr[2]) + ')'
            return [bgSectionColor, transferColors]

    '############################################          END             ##########################################'


def checkNameArray(array, circleBorder, rectBorder, roundBorder, sidesParent):
    for elm in array:
        if elm['parent']['name'] == 'circle parent':
            circleBorder += 1
        elif elm['parent']['name'] == 'rectangle with round sides parent':
            sidesParent += 1
        elif elm['parent']['name'] == 'rectangle with round border parent':
            roundBorder += 1
        elif elm['parent']['name'] == 'rectangle parent':
            rectBorder += 1
    return circleBorder, rectBorder, roundBorder, sidesParent

def checkNameArrayNoParent(array, circleBorder, rectBorder, roundBorder, sidesParent):
    for elm in array:
        if elm['name'] == 'circle parent':
            circleBorder += 1
        elif elm['name'] == 'rectangle with round sides parent':
            sidesParent += 1
        elif elm['name'] == 'rectangle with round border parent':
            roundBorder += 1
        elif elm['name'] == 'rectangle parent':
            rectBorder += 1
    return circleBorder, rectBorder, roundBorder, sidesParent
#######################          Functions to be used multiple times!          #######################
####################### COLORRRRRRRR ####################################################

def getBorderColorArray(element, heightScreen, mainImage, widthScreen, offset):
    return mainImage[int(((int(element['location']['y1']) * heightScreen / 100 - int(
        element['location']['y0']) * heightScreen / 100) / 2) + int(
        element['location']['y0']) * heightScreen / 100)][
        int(int(element['location']['x0']) * widthScreen / 100 + offset)]


def getColorBackgroundBody(ParentElementL1, heightScreen, mainImage, widthScreen):
    parent = ParentElementL1[len(ParentElementL1) - 1]['location']
    color = mainImage[int(int(parent['y0']) * heightScreen / 100 - 2)][int(int(parent['x0']) * widthScreen / 100 - 2)]
    return color


def getRGBColor(colorarray):
    bgcolor = 'rgb(' + str(colorarray[0]) + ', ' + str(colorarray[1]) + ', ' + str(
        colorarray[2]) + ')'
    return bgcolor


def getBgColorArray(element, mainImage, heightScreen, widthScreen, offsetDivision, offset):
    bgcolorarray = mainImage[int(((int(element['location']['y1'] * heightScreen / 100) - int(
        element['location']['y0']) * heightScreen / 100) / offsetDivision) + int(
        element['location']['y0']) * heightScreen / 100)][
        int(int(element['location']['x0']) * widthScreen / 100 + offset)]
    return bgcolorarray


def checkBorderColorInrange(bgcolorarray, bordercolorarray, range):
    if (((bgcolorarray[0] < bordercolorarray[0] + range) & (bordercolorarray[0] > bordercolorarray[0])) | (
                (bgcolorarray[0] > bordercolorarray[0] - range) & (bordercolorarray[0] < bordercolorarray[0]))) \
            & (((bgcolorarray[1] < bordercolorarray[1] + range) & (bordercolorarray[1] > bordercolorarray[1])) | (
                        (bgcolorarray[1] > bordercolorarray[1] - range) & (bordercolorarray[1] < bordercolorarray[1]))) \
            & (((bgcolorarray[2] < bordercolorarray[2] + range) & (bordercolorarray[2] > bordercolorarray[2])) | (
                        (bgcolorarray[2] > bordercolorarray[2] - range) & (bordercolorarray[2] < bordercolorarray[2]))):
        return True
    else:
        return False


def checkColorWithBackground(colorarray, bgcolorarray, range):
    if (colorarray[0] - range <= bgcolorarray[0] <= colorarray[0] + range) \
            & (colorarray[1] - range <= bgcolorarray[1] <= colorarray[1] + range) \
            & (colorarray[2] - range <= bgcolorarray[2] <= colorarray[2] + range):
        return True
    elif (colorarray[0] - range <= bgcolorarray[0] <= colorarray[0] + range) \
            & (colorarray[1] - range <= bgcolorarray[1] <= colorarray[1] + range) \
            | (colorarray[2] - range <= bgcolorarray[2] <= colorarray[2] + range):
        return True
    elif (colorarray[0] - range <= bgcolorarray[0] <= colorarray[0] + range) \
            | (colorarray[1] - range <= bgcolorarray[1] <= colorarray[1] + range) \
                    & (colorarray[2] - range <= bgcolorarray[2] <= colorarray[2] + range):
        return True
    else:
        return False

