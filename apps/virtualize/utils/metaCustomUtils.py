import numpy as np
import pymongo
from bson.objectid import ObjectId

client = pymongo.MongoClient('localhost', 27017)  # maxPoolSize=50
db = client.MeduzaDb


'''META-CUSTOM DataModels'''
def getPrediction(ids):
    collection = db['predictions']
    cursor = collection.find({})
    predictions = []
    for document in cursor:
        if str(document['segmentation_id']) in ids:
            if document['state'] == 'active':
                seg_id = document['segmentation_id']
                type = document['type']
                name = document['name']
                score = document['score']
                location = document['location']
                root = document['root']
                children = document['children']
                screenshotId = document['screenshot_id']
                predictions.append({'id': seg_id, 'type': type, 'name': name, 'location': location,'score':score, 'root': root,
                                    'children': children, 'screenshot_id':screenshotId})

    return predictions

def updatePredictions(classid, fontSize, fontColor, borderColor, borderRadius, bgcolor, textAlign,textIndent):
    collection = db['styles']
    collection.update({'segmentation_id': classid}, {'$set': {
        'fontSize': fontSize,
        'fontColor': fontColor,
        'borderColor': borderColor,
        'borderRadius': borderRadius,
        'bgcolor': bgcolor,
        'textAlign': textAlign,
        'textIndent': textIndent
    }})


def updateColor(classid, fontColor, borderColor, bgcolor):
    collection = db['styles']
    collection.update({'segmentation_id': classid}, {'$set': {
        'fontColor': fontColor,
        'borderColor': borderColor,
        'bgcolor': bgcolor,
    }})


def get_bstyles_barChart(elementId):

    collection = db['styles']
    cursor = collection.find({})
    bstyles = ''
    for document in cursor:
        if str(document['segmentation_id']) == elementId:
            bstyles = {'bgcolor': document['bgcolor'],
                       'barChartBG': document['barChartBG'],
                       'barChartBar': document['barChartBar'],
                       'bordercolor': document['borderColor'],
                       'borderRadius': document['borderRadius'],
                       'zIndex': document['zIndex']}
    return bstyles


def get_bstyles(elementId):

    collection = db['styles']
    cursor = collection.find({})
    bstyles = ''
    for document in cursor:
        if str(document['segmentation_id']) == elementId:
            bstyles = {'bgcolor': document['bgcolor'],
                       'bordercolor': document['borderColor'],
                       'borderRadius': document['borderRadius'],
                       'zIndex': document['zIndex']}
    return bstyles


def get_fstyles(elementId):
    collection = db['styles']
    cursor = collection.find({})
    fstyles = ''
    for document in cursor:
        if str(document['segmentation_id']) == elementId:
            fstyles = {'fontSize': document['fontSize'],
                       'fontColor': document['fontColor'],
                       'textAlign': document['textAlign'],
                       'textIndent': document['textIndent'],
                       'fontFamily': document['fontFamily'],
                       'link': document['link']}
    return fstyles


def getPredictionByScreenShotId(id):
    collectionseg = db['segmentation']
    cursorseg = collectionseg.find({})
    segmentationids = []
    for document in cursorseg:
        if str(document['screenshot_id']) == str(id):
            segmentationids.append(str(document['_id']))

    collection = db['predictions']
    cursor = collection.find({})
    predictions = []
    for document in cursor:
        if str(document['segmentation_id']) in segmentationids:
            if document['state'] == 'active':
                seg_id = document['segmentation_id']
                type = document['type']
                name = document['name']
                location = document['location']
                score = document['score']
                root = document['root']
                children = document['children']
                screenshotId = document['screenshot_id']
                predictions.append({'id': seg_id, 'type': type, 'name': name,'score':score, 'location': location, 'root': root,
                                    'children': children, 'screenshot_id': screenshotId})
    return predictions


def getPredictionByScreenShotName(screenId):
    collectionseg = db['segmentation']
    cursorseg = collectionseg.find({})
    segmentationids = []
    for document in cursorseg:
        if str(document['screenshot_id']) == str(screenId):
            segmentationids.append(str(document['_id']))
    collection = db['predictions']
    cursor = collection.find({})
    predictions = []
    for document in cursor:
        if str(document['segmentation_id']) in segmentationids:
            if document['state'] == 'active':
                seg_id = document['segmentation_id']
                type = document['type']
                name = document['name']
                location = document['location']
                root = document['root']
                score = document['score']
                children = document['children']
                screenshotId = document['screenshot_id']
                predictions.append({'id': seg_id, 'type': type, 'name': name,'score':score, 'location': location, 'root': root,
                                    'children': children, 'screenshot_id': screenshotId})

    return predictions


def save_collection(collection, array, screenshot_id, date):
    for element in range(len(array)):
        for e in range(len(array[element])):
            if e == 0:
                collection.insert({
                    'level': {'parent': array[element]['child']['id']},
                    'seg_id': array[element]['parent']['id'],
                    'type': array[element]['parent']['type'],
                    'name': array[element]['parent']['name'],
                    'location': array[element]['parent']['location'],
                    'root': array[element]['parent']['root'],
                    'screenshot_id': screenshot_id,
                    'state': 'active',
                    'locked': False,
                    'timeStamp': str(date),
                    'timeZone': 'Australia/Melbourne'
                })
            if e == 1:
                collection.insert({
                    'level': {'child': array[element]['parent']['id']},
                    'seg_id': array[element]['child']['id'],
                    'type': array[element]['child']['type'],
                    'name': array[element]['child']['name'],
                    'location': array[element]['child']['location'],
                    'root': array[element]['child']['root'],
                    'screenshot_id': screenshot_id,
                    'state': 'active',
                    'locked': False,
                    'timeStamp': str(date),
                    'timeZone': 'Australia/Melbourne'
                })


def retrive_collection(screenshot_id):

    cursor = (db.events.find({'screenshot_id': screenshot_id}).sort([('timeStamp', -1)]).limit(1))
    action = ''
    event = ''
    for document in cursor:
        event = document['collection']

    collection = db[event+'_events']
    cursor = (collection.find({'screenshot_id': screenshot_id}).sort([('timeStamp', -1)]).limit(1))
    for document in cursor:
        action = document
    action = {'collection': event, 'event': action}
    return action


def save_text_collection(collection, array, screenshot_id,date):
    for element in range(len(array)):
        collection.insert({
            'level': {'parent': array[element]['children']},
            'seg_id': array[element]['id'],
            'type': array[element]['type'],
            'name': array[element]['name'],
            'location': array[element]['location'],
            'root': array[element]['root'],
            'screenshot_id': screenshot_id,
            'state': 'active',
            'locked': False,
            'timeStamp': str(date),
            'timeZone': 'Australia/Melbourne'
        })


# New elements Database
def save_new_elements(class_id,screenshot_id,type,name,location,date, path):
        db.newElements.insert({
            'class_id': class_id,
            'screenshot_id': screenshot_id,
            'type': type,
            'name': name,
            'location': location,
            'state': 'active',
            'locked': False,
            'root': path,
            'timeStamp': str(date),
            'timeZone': 'Australia/Melbourne'
        })


def save_new_style(element_id, fontSize, fontFamily, fontColor, borderColor,borderRadius,bgColor,textAlign,textIndent,link,zIndex):
    db.newStyle.insert({
        'element_id': element_id,
        'fontFamily': fontFamily,
        'fontSize': fontSize,
        'fontColor': fontColor,
        'borderColor': borderColor,
        'borderRadius': borderRadius,
        'bgcolor': bgColor,
        'textAlign': textAlign,
        'textIndent': textIndent,
        'link': link,
        'zIndex': zIndex
    })


def save_new_style_BarChart(element_id, fontSize, fontFamily, fontColor, borderColor,borderRadius,bgColor,textAlign,textIndent,link,zIndex):
    db.newStyle.insert({
        'element_id': element_id,
        'fontFamily': fontFamily,
        'fontSize': fontSize,
        'fontColor': fontColor,
        'borderColor': borderColor,
        'borderRadius': borderRadius,
        'bgcolor': bgColor,
        'textAlign': textAlign,
        'textIndent': textIndent,
        'link': link,
        'zIndex': zIndex,
        'barChartBar': "rgb(255,255,255)",
        'barChartBG': "rgb(0,0,0)",
        "data": "[{index: 0,value: 12},{index: 1,value: 12},{index: 2,value: 12}]"
    })


def getLineNumbers(seg_id):
    listOcr = db.ocr.find_one({'segmentation_id': seg_id})
    return int(listOcr['linenumber'])


def savePrediction(seg_id, type, name, location, root, children, screenshot_id,date):

    db.predictions.insert({
        'segmentation_id': seg_id,
        'type':  type,
        'name':  name,
        'score': 0,
        'location': location,
        'root': root,
        'state': 'active',
        'children': children,
        'screenshot_id': screenshot_id,
        'timeStamp': str(date),
        'timeZone': 'Australia/Melbourne'
    })

    db.styles.insert({
        'segmentation_id': seg_id,
        'fontFamily': 'Helvetica, Arial, sans-serif',
        'fontSize': '',
        'fontColor': '',
        'borderColor': 'transparent',
        'background-gradient': '',
        'borderRadius': '',
        'bgcolor': '',
        'boxShadow': '',
        'textAlign': '',
        'textIndent': 0,
        'textShadow': '',
        'link': '',
        'linkColor': '',
        'animationType': '',
        'zIndex': 'auto',
        'timeStamp': str(date),
        'timeZone': 'Australia/Melbourne'
    })


def getRoot(segId):
    collection = db['segmentation']
    cursor = collection.find_one({'_id': ObjectId(segId)})
    if str(segId) == str(cursor['_id']):
        return str(cursor['elementRoot'])
    else:
        return print('wrong id: ' + segId)


def get_new_bstyles(elementId):
    collection = db['newStyle']
    cursor = collection.find({})
    bstyles = ''
    for document in cursor:
        if str(document['element_id']) == elementId:
            bstyles = {'bgcolor': document['bgcolor'],
                       'borderColor': document['borderColor'],
                       'borderRadius': document['borderRadius'],
                       'zIndex': document['zIndex']}
    return bstyles


def get_new_barChart_styles(elementId):
    collection = db['newStyle']
    cursor = collection.find({})
    bstyles = ''
    for document in cursor:
        if str(document['element_id']) == elementId:
            bstyles = {'bgcolor': document['bgcolor'],
                       'borderColor': document['borderColor'],
                       'borderRadius': document['borderRadius'],
                       'zIndex': document['zIndex'],
                       'barChartBG':document['barChartBG'],
                       'barChartBar':document['barChartBar'],
                       'data':document['data']}
    return bstyles


def get_new_fstyles(elementId):
    collection = db['newStyle']
    cursor = collection.find({})
    fstyles = ''
    for document in cursor:
        if str(document['element_id']) == elementId:
            fstyles = {'fontSize': document['fontSize'],
                       'fontColor': document['fontColor'],
                       'textAlign': document['textAlign'],
                       'textIndent': document['textIndent'],
                       'fontFamily': document['fontFamily'],
                       'link': document['link']}
    return fstyles


def get_collection(collection, screenshotId):
    array = []
    cursor = collection.find({'screenshot_id': screenshotId})
    for document in cursor:
        if document['state'] == 'active':
            array.append(document)
        else:
            print('this element is inactive: ' + str(document))
    if collection == db.widgets:
        print('widgets are scalable for database changes')
        print(array)
        print(screenshotId)

    return array


def get_collection_layouts(screenshot_id, id, index):
    location = ''

    prediction_layouts_cursor = db.layoutsTemplates.find({'screenshot_id': str(screenshot_id)})
    document = prediction_layouts_cursor[index - 1]
    print('check this for me!')
    for doc in document['layouts_template']:
        if str(doc) == id:
            print('I am the same: ' +str(id))
            print(document['layouts_template'])
            print(document['layouts_template'][id])
            location = document['layouts_template'][id]


    return location


def get_collection_layout(collection, screenshotId):
    array = []
    cursor = collection.find({'screenshot_id': screenshotId})

    for document in cursor:

        array.append(document)

    return array


def update_font_size(collection, seg_id, searchkey, replacement):

    if searchkey == 'fontSize':

        collection.update({'segmentation_id': seg_id}, {
            '$set':
                {
                    searchkey: replacement
                }
        })
    else:
        db.styles.update({'segmentation_id': seg_id}, {
            '$set':
                {
                    searchkey: replacement
                }
        })
    print('collection: styles \n with seg_id: '+str(seg_id)+'\n with key: '+str(searchkey)+'\n has been updated to: '+str(replacement))


def checkLocation(posL, posT, width, height, screenshotId):

    collection_buttons = db.buttons.find({'screenshot_id': screenshotId})
    collection_frames = db.frames.find({'screenshot_id': screenshotId})
    collection_hyperlinks = db.hyperLinks.find({'screenshot_id': screenshotId})
    collection_paragraphs = db.paragraphs.find({'screenshot_id': screenshotId})
    collection_pictures = db.pictures.find({'screenshot_id': screenshotId})
    collection_textBoxes = db.textBoxes.find({'screenshot_id': screenshotId})
    collection_textArea = db.textArea.find({'screenshot_id': screenshotId})
    collection_newElements = db.newElements.find({'screenshot_id': screenshotId})

    if (check(collection_buttons,posL, posT, width, height) == 0) and \
        (check(collection_frames,posL, posT, width, height) == 0) and \
        (check(collection_hyperlinks,posL, posT, width, height) == 0) and \
        (check(collection_paragraphs,posL, posT, width, height) == 0) and \
        (check(collection_pictures,posL, posT, width, height) == 0) and \
        (check(collection_textBoxes,posL, posT, width, height) == 0) and \
        (check(collection_textArea,posL, posT, width, height) == 0) and \
        (check(collection_newElements,posL, posT, width, height) == 0):
        return 0
    else:
        return 1


def check(collection, posL, posT, width, height):
    for col in collection:
        if(posL <= float(col['location']['x0']) <= (posL+width)) and \
        (posL <= float(col['location']['x1']) <= (posL+width)) and \
        (posT <= float(col['location']['y0']) <= (posT+height)) and \
        (posT <= float(col['location']['y1']) <= (posT+height)):
            print('col:')
            print(col)
            return 1
    return 0


def checkPics(screenshotId):
    array = []
    cursor = db.segmentation.find({'screenshot_id': screenshotId})
    cursorImg = db.pictures.find({'screenshot_id': screenshotId})
    cursorLogo = db.logo.find({'screenshot_id': screenshotId})
    cursorIncon = db.icon.find({'screenshot_id': screenshotId})


    for doc in cursorImg:

        img = db.segmentation.find_one({'_id':ObjectId(doc['seg_id'])})

        if doc['state'] == 'active' and doc['locked'] == False:
            if(img != None):
                array.append({
                    'name': doc['name'],
                    'location': img['elementLocationPercentage'],
                    'root': img['elementRoot']
                })
            else:
                print('img empty!')
    for doc in cursorLogo:

        img = db.segmentation.find_one({'_id':ObjectId(doc['seg_id'])})

        if doc['state'] == 'active' and doc['locked'] == False:
            if(img != None):
                array.append({
                    'name': doc['name'],
                    'location': img['elementLocationPercentage'],
                    'root': img['elementRoot']
                })
            else:
                print('img empty!')

    for doc in cursorIncon:

        img = db.segmentation.find_one({'_id':ObjectId(doc['seg_id'])})

        if doc['state'] == 'active' and doc['locked'] == False:
            if(img != None):
                array.append({
                    'name': doc['name'],
                    'location': img['elementLocationPercentage'],
                    'root': img['elementRoot']
                })
            else:
                print('img empty!')
    return array


def updateChildLocation(item,savePath, screenshotId, combinationId, amountOfKids, width, height):

    from PIL import Image
    img = Image.open(item['root'])
    print(item)
    from virtualize.utils.textboxSep import elementTextboxExtraction
    testCropImgList, foundLinesY = elementTextboxExtraction(img, amountOfKids)
    print(amountOfKids)
    print('check me!')
    print(str(testCropImgList))
    print(str(foundLinesY))

    for i in range(len(foundLinesY)):
        for j in range(len(foundLinesY)):
            if i != j:
                if foundLinesY[i] == foundLinesY[j]:
                    print('I AM THE SAME')
                    return combinationId

    import os
    try:
        for dash in range(len(testCropImgList)):
            root = '_' + str(item['id']) + '_' + str(dash) + '.jpg'
            testCropImgList[dash].save(os.path.join(savePath, root))

            if dash == 0:
                YBottom = float(item['location'][1][3:])
                YTop = float(item['location'][1][3:])+foundLinesY[0]

            elif dash == len(testCropImgList)-1:
                YBottom =float(item['location'][1][3:]) + foundLinesY[dash-1]
                YTop = float(item['location'][3][3:])

            else:
                YBottom = float(item['location'][1][3:])+foundLinesY[dash-1]
                YTop = float(item['location'][1][3:])+foundLinesY[dash]


            print('extraY:')
            print(YBottom)
            print(YTop)
            locationPixels = ['x0'+str(float(item['location'][0][3:])),
                'y0' + str(float(YBottom)),
                'x1' + str(float(item['location'][2][3:])),
                'y1' + str(float(YTop))]
            x0 = float(item['location'][0][3:]) * 100 / width
            y0 = (float(YBottom)) * 100 / height
            x1 = float(item['location'][2][3:]) * 100 / width
            y1 = (float(YTop)) * 100 / height

            location = {'x0': float(x0), 'y0': float(y0), 'x1': float(x1), 'y1': float(y1)}
            date = datetime.now(pytz.timezone('Australia/Melbourne'))

            db.segmentation.insert({
                'screenshot_id': screenshotId,
                'totalElements': str('TEMP:'+item['id']),
                'elementLocationPixels': locationPixels,
                'elementLocationPercentage': location,
                'elementSizePercentage': location,
                'elementRoot': savePath+'/'+root,
                'elementIndex': 'ElementChild ' + str(dash),
                'screenshotIndex': 0,
                'status': 'identified'
            })
            newId = db.segmentation.find_one({'totalElements': 'TEMP:' + str(item['id'])})['_id']
            print('NEW ID: '+str(newId))
            db.segmentation.update({'totalElements': str('TEMP:' + item['id'])}, {'$set': {'totalElements': amountOfKids}})
            savePrediction(str(newId), str(item['type']), str(item['name']),location , savePath+'/'+root, [], screenshotId, date)


            # db.predictions.update({'segmentation_id': 'TEMP:'+str(item['id'])},{'$set':{'segmentation_id':str(newId)}})
            # db.styles.update({'segmentation_id': 'TEMP:'+str(item['id'])},{'$set':{'segmentation_id':str(newId)}})
            #disable old
            combinationId.append(str(newId))

        print(combinationId)
        combinationId.remove(str(item['id']))
        print(combinationId)

        db.predictions.update({'segmentation_id': item['id']},{'$set':{'state':'inactive'}})
    except:
        print('cant do this now')

    print(foundLinesY)
    print(testCropImgList)
    print(combinationId)

    return combinationId


def childinrange(childs):
    #childs gives an array of id and check every child when going through
    collection = []
    for kid in childs:
        collection.append(db.segmentation.find_one({'_id': ObjectId(str(kid))}))
    print(collection)
    range = 5
    for i in collection:
        for j in collection:
            if str(i['_id'])!=str(j['_id']) :
                if np.absolute(i['elementLocationPercentage']['y0'] - j['elementLocationPercentage']['y0']) < range and np.absolute(i['elementLocationPercentage']['y0'] - j['elementLocationPercentage']['y0']) < range:
                    if np.absolute(i['elementLocationPercentage']['y1'] - j['elementLocationPercentage']['y1']) < range and np.absolute(i['elementLocationPercentage']['y1'] - j['elementLocationPercentage']['y1']) < range:
                        print('TRUEEEEEE')
                        print(i)
                        print(j)
                        return True
    print('FALSEEEEE')
    return False


def checkKids(children,seg_id):
    childs = []
    for child in range(len(children)):
        print(child)
        if children[child][0] == seg_id:
            print(children[child])
            childs.append(children[child][1])
            for kids in range(len(children)):
                print(kids)
                if children[kids][0] == children[child][1]:
                    childs.append(children[kids][1])
    return childs


def save_inception(finalName, elementId):
    for index in range(len(finalName)):  # len(elementId)):
        db.inception.insert({
            'results': 'to be done with all CNNs',  # certainty[index],
            'elementName': {'name': str(finalName[index]['name']), 'highest': str(finalName[index]['highestResult'])},
            'segmentation_id': str(elementId[index])
        })


def save_segmentation(screenShotId, numberOfElements, elementPositioning, elementPositioningPercentage,
                      elementSize, croppedLocation, elementCount, screenShotIndex, croppedName,results_1):

    for screenShot in range(1):  # len(screenShotId)):

        for element in range(numberOfElements[screenShot]):
            active = ''
            print(elementPositioning[screenShot][element])
            c = elementPositioning[screenShot][element]
            s = elementSize[screenShot][element]
            print('SSSSSSSSSSSSSSSS')
            print(element)
            x0_ = str(c[0])
            y0_ = str(c[1])
            x1_ = str(c[2])
            y1_ = str(c[3])
            aux0 = x0_.split(':')
            auy0 = y0_.split(':')
            aux1 = x1_.split(':')
            auy1 = y1_.split(':')
            x0 = int(aux0[1])
            y0 = int(auy0[1])
            x1 = int(aux1[1])
            y1 = int(auy1[1])
            h = int(s['horizontal'])
            v = int(s['vertical'])

            print("Smalllllll")
            a = (x1 - x0)
            b = (y1 - y0)
            print(a)
            print(b)
            if a > 30 or b > 30:
                if v > 90 and h > 90:
                    print('Full screen')
                    active = 'no'
                else:
                    active = 'yes'
            else:
                active = 'no'
                print('Deleting')
            for r in range(len(results_1)):
                current_root = croppedLocation[screenShot] + "/" + str(element) + ' ' + str(croppedName)

            db.segmentation.insert({
                'screenshot_id': screenShotId[screenShot],
                'totalElements': numberOfElements[screenShot],
                'elementLocationPixels': elementPositioning[screenShot][element],
                'elementLocationPercentage': elementPositioningPercentage[screenShot][element],
                'elementSizePercentage': elementSize[screenShot][element],
                'elementRoot': croppedLocation[screenShot] + "/" + str(element) + ' ' + str(croppedName),
                'elementIndex': 'Element ' + str(elementCount[screenShot][element]),
                'screenshotIndex': screenShotIndex[screenShot],
                'status': 'identified',
                'active': active,
                'result_cnn_1': 'unknown'
            })


def save_ocr(ocrText):

    for loop in range(len(ocrText)):
        if str(ocrText[loop]['name']) != '':

            db.ocr.insert({
                'name': str(ocrText[loop]['name']),
                'root': str(ocrText[loop]['root']),
                'segmentation_id': str(ocrText[loop]['id']),
                'linenumber': str(ocrText[loop]['linenumber'])
            })