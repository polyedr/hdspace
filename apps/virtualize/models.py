import numpy as np
from django.db import models
from mongoengine import *
from pymongo import MongoClient
from bson.objectid import ObjectId
from datetime import datetime
import pytz
import substring


class UserRoles(models.Model):
    class Meta:
        managed = False
        permissions = (
            ("admin", "Can do all"),
            ("data_validator", "Can validate data"),
            ("basic_user", "Can upload screenshots"),
        )


class Screenshots(Document):
    image = StringField(required=True)
    status = StringField(required=True)
    user_id = StringField(required=False)
    pageName = StringField(required=True)
    screenName = StringField(required=True)


class Document(Document):
    description = models.CharField(max_length=255, blank=True)
    document = models.FileField(upload_to='documents/')
    uploaded_at = models.DateTimeField(auto_now_add=True)


def user(url, user_id, name, scname):
    user = Screenshots.objects.create(
        user_id=str(user_id),
        image=str(url),
        status='pending',
        pageName=str(name),
        screenName=str(scname)
    )
    user.save()
    print(str(url) + ' has been saved')

    return url


client = MongoClient('mongodb://mongo:mongo@db')  # maxPoolSize=50
db = client.MeduzaDb

'''SEGMENTATION DataModels'''
# Insert total number of elemeent


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
# status == 'Identified by OCR'


def save_inception(finalName, elementId):
    for index in range(len(finalName)):  # len(elementId)):
        db.inception.insert({
            'results': 'to be done with all CNNs',  # certainty[index],
            'elementName': {'name': str(finalName[index]['name']), 'highest': str(finalName[index]['highestResult'])},
            'segmentation_id': str(elementId[index])
        })


def saveCurrent(date, id, location, fontcolor, fontSize, fontFamily, borderColor,
                borderRadius, bgcolor, textAlign, element, screenId, textIndent, type, name):
    db = client.MeduzaDb

    event_text = {
        'screenshot_id': screenId,
        'segmentation_id': id,
        'location': location,

        'fontFamily': fontFamily,
        'fontSize': fontSize,
        'fontColor': fontcolor,
        'textAlign': textAlign,
        'timeStamp': str(date),
        'timeZone': 'Australia/Melbourne'
    }
    event_button = {
        'screenshot_id': screenId,
        'segmentation_id': id,
        'location': location,
        'fontFamily': fontFamily,
        'fontSize': fontSize,
        'fontColor': fontcolor,
        'textAlign': textAlign,
        'textIndent': textIndent,

        'borderColor': borderColor,
        'borderRadius': borderRadius,
        'bgcolor': bgcolor,

        'timeStamp': str(date),
        'timeZone': 'Australia/Melbourne'
    }
    event_frame = {
        'screenshot_id': screenId,
        'segmentation_id': id,
        'location': location,

        'borderColor': borderColor,
        'borderRadius': borderRadius,
        'bgcolor': bgcolor,

        'timeStamp': str(date),
        'timeZone': 'Australia/Melbourne'
    }

    def updateDatbaseByType(type,searchkey,replacement,font):
        print('THIS is my type ' + str(type))
        print('replacement: '+str(replacement))

        if type == 'buttons' and searchkey == 'name':
            print('changing the name of a button!')
            collection = db[str(type)]

            if collection.find_one({'seg_id': id})['level']['parent'] == []:
               print('parent is empty!')
               oldElement = collection.find_one({'seg_id': id})[searchkey]
               collection.update({'seg_id': id}, {'$set':{searchkey: replacement}})
            else:
               oldElement = collection.find_one({'seg_id': id})[searchkey]
               collection.update({'level': {'child': id}}, {
                   '$set':
                       {
                           searchkey: replacement
                       }
               })
        elif type == 'paragraphs' and searchkey == 'fontSize':
            collection = db['styles']

            if collection.find_one({'segmentation_id': id})[searchkey] == []:
                oldElement = collection.find_one({'segmentation_id': id})[searchkey]
                collection.update({'segmentation_id': id}, {'$set': {searchkey: replacement}})
            else:
                oldElement = collection.find_one({'segmentation_id': id})[searchkey]
                collection.update({'segmentation_id': id}, {'$set':
                        {
                            searchkey: replacement
                        }
                })
        elif type == 'paragraphs' and searchkey == 'name':
            collection = db['paragraphs']

            if collection.find_one({'seg_id': id})[searchkey] == []:
                oldElement = collection.find_one({'seg_id': id})[searchkey]
                collection.update({'seg_id': id}, {'$set': {searchkey: replacement}})
            else:
                oldElement = collection.find_one({'seg_id': id})[searchkey]
                collection.update({'seg_id': id}, {'$set':
                        {
                            searchkey: replacement
                        }
                })
        elif type == 'textArea' and searchkey == 'name':
            collection = db[str(type)]

            if collection.find_one({'seg_id': id})['level']['parent'] == []:
                oldElement = collection.find_one({'seg_id': id})[searchkey]
                collection.update({'seg_id': id}, {'$set':{searchkey: replacement}})
            else:
                oldElement = collection.find_one({'seg_id': id})[searchkey]
                collection.update({'level': {'child': id}}, {
                    '$set':
                        {
                            searchkey: replacement
                        }
                })
        elif type == 'textBoxes' and searchkey == 'name':
            collection = db[str(type)]

            if collection.find_one({'seg_id': id})['level']['parent'] == []:
                oldElement = collection.find_one({'seg_id': id})[searchkey]
                collection.update({'seg_id': id}, {'$set':{searchkey: replacement}})
            else:
                oldElement = collection.find_one({'seg_id': id})[searchkey]
                collection.update({'level': {'child': id}}, {
                    '$set':
                        {
                            searchkey: replacement
                        }
                })
        elif searchkey == 'location':  # or searchkey == 'name'
            collection = db[str(type)]
            if search_new_element(id) != None:
                collection = db.newElements
                oldElement = collection.find_one({'class_id': id})[searchkey]

                collection.update({'class_id': id}, {
                    '$set':
                        {
                            searchkey: replacement,
                            'fontSize': font
                        }
                })

            else:
                oldElement = collection.find_one({'seg_id': id})[searchkey]
                collection.update({'seg_id': id}, {
                    '$set':
                        {
                            searchkey: replacement,
                        }
                })
                print('after')
                collection2 = db.styles
                collection2.update({'segmentation_id': id}, {
                    '$set':
                        {
                            'fontSize': font
                        }
                })
        else:
            if search_new_element(id) != None:
                collection = db.newStyle
                oldElement = db.newStyle.find_one({'element_id': id})[searchkey]
                collection.update({'element_id': id},{
                    '$set':
                        {
                            searchkey: replacement
                        }
                })
            else:
                oldElement = db.styles.find_one({'segmentation_id': id})[searchkey]
                db.styles.update({'segmentation_id': id}, {
                    '$set':
                        {
                            searchkey: replacement
                         }
                })
        return oldElement

    if element == 'P':
        if search_new_element(id) != None:
            elementType = 'newElements'
        else:
            elementType = 'paragraphs'

    elif element == 'A':
        if search_new_element(id) != None:
            elementType = 'newElements'
        else:
            elementType = 'hyperLinks'

    elif element == 'INPUT':
        if search_new_element(id) != None:
            elementType = 'newElements'
        else:
            elementType = 'textBoxes'

    elif element == 'TEXTAREA':
        if search_new_element(id) != None:
            elementType = 'newElements'
        else:
            elementType = 'textArea'
    elif element == 'BUTTON':
        if search_new_element(id) != None:
            elementType = 'newElements'
        else:
            elementType = 'buttons'

    elif element == 'DIV':
        if search_new_element(id) != None:
            elementType = 'newElements'
        else:
            elementType = 'frames'

    elif element == 'IMG':
        if search_new_element(id) != None:
            elementType = 'newElements'
        else:
            elementType = 'pictures'
    elif element == 'widget':
        if search_new_element(id) != None:
            elementType = 'newElements'
        else:
            elementType = 'pictures'

    else:
        print(element)
        elementType = 'Error: ' + str(element)

    oldEvent = ''
    newEvent = ''

    print('this type I am going to udpate: ' +str(type))
    if type == 'fontSize':
        event = {'fontSize': fontSize}
        oldEvent = {'fontSize': updateDatbaseByType(elementType, 'fontSize', fontSize, fontSize)}
    elif type == 'fontColor':
        event = {'fontColor': fontcolor}
        oldEvent = {'fontColor': updateDatbaseByType(elementType, 'fontColor', fontcolor, fontSize)}
    elif type == 'fontFamily':
        event = {'fontFamily': fontFamily}
        oldEvent = {'fontFamily': updateDatbaseByType(elementType, 'fontFamily', fontFamily, fontSize)}
    elif type == 'location':
        event = {'location': location}
        oldEvent = {'location': updateDatbaseByType(elementType, 'location', location, fontSize)}
    elif type == 'name':
        event = {'name': name}
        oldEvent = {'name': updateDatbaseByType(elementType, 'name', name, fontSize)}

    db.events.insert({
        'screenshot_id': screenId,
        'seg_id': id,
        'collection': elementType,
        'oldEvent': oldEvent,
        'newEvent': event,
        'timeStamp': str(date),
        'timeZone': 'Australia/Melbourne'
    }, w=1)

''' MONGO MODELS'''


def insert(collection, collectionKey, collectionValues):
    collection.insert({
        collectionKey: collectionValues
    })


def findAll(collection, collectionKey):
    results = collection.find({})
    # print(results.count())
    finalresults = []
    for i in range(results.count()):
        try:
            finalresults.append(results[i][collectionKey])
        except:
            print(collectionKey + ' is not in the number: ' + str(i) + ' collection. ')
    return finalresults


def findMultiple(collection, collectionKey, searchwords):
    results = collection.find({collectionKey: searchwords})
    return results


def findOne(collection, collectionKey, searchword):

    msg = 'failed to find: ' + searchword + '. '
    result = []
    if collection.find_one({collectionKey: searchword}) != None:
        msg = 'find ' + searchword + ' with success. '
        result = collection.find_one({collectionKey: searchword})
        print(msg)

    else:
        print(msg)
        return
    return result


def deleteOne(collection, collectionKey, searchword):
    msg = 'delete ' + searchword + ' failed.'
    if collection.find_one({collectionKey: searchword}) == None:
        msg = 'Cant delete ' + searchword + ', it is not in the database. '
    elif collection.find_one({collectionKey: searchword}) != None:
        collection.update({collectionKey: searchword}, {"$pull": {collectionKey: searchword}})
        msg = searchword + ' is deleted. '
    print(msg)


def deleteMany(collection, collectionKey, searchwords):
    for i in range(len(searchwords)):
        deleteOne(collection, collectionKey, searchwords[i])


def findOneUpdate(collection, collectionKey, searchword, replacement):
    msg = ''
    strl = None
    if collection.find_one({collectionKey: searchword}) != None:
        collection.update({collectionKey: searchword}, {'$set': {collectionKey + ".$": replacement}})
        msg += 'find ' + searchword + ' and update to ' + replacement + ' with succes. '
        if collection.find_one({collectionKey: searchword}) == None:
            msg += searchword + ' it is not in this database. '
    else:
        msg = 'failed to find ' + searchword + ' and update to ' + replacement + '. '
    print(msg)
    return strl


def updateOne(collection, collectionKey, searchword, collectionReplacement, replacement):
    msg = 'failed to update ' + collectionReplacement + ' to ' + replacement + '. '
    if (collectionKey == '_id'):
        if collection.find_one({collectionKey: ObjectId(searchword)}) != None:
            collection.update({collectionKey: ObjectId(searchword)}, {'$set': {collectionReplacement: replacement}})
            msg = collectionReplacement + ' updated to ' + replacement + ' with succes. '
    else:
        if collection.find_one({collectionKey: searchword}) != None:
            collection.update({collectionKey: searchword}, {'$set': {collectionReplacement: replacement}})
            msg = collectionReplacement + ' updated to ' + replacement + ' with succes. '
    print(msg)


def updateMultiple(collection, collectionKey, searchwords, replacements):
    for i in range(len(searchwords)):
        updateOne(collection, collectionKey, searchwords[i], replacements[i])


def updateLocation(collection,id,location):
    print('updating location')
    element = db[str(collection)].find_one({'_id':ObjectId(id)})
    if element != None:
        db[str(collection)].update({'_id':ObjectId(id)},{
            '$set':{
                'location':location
            }
        })


def getCollectionIDs(collection, username):
    collection = db[str(collection)]
    cursor = collection.find({})
    screenShotId = ''
    for document in cursor:
        try:
            if str(username) == str(document['username']):
                screenShotId = (str(document['_id']))
        except:

            screenShotId = (str(document['_id']))
            print('This is not the users collection')

    return screenShotId


def getScreenName(screenshotId):
    collection = db.screenshots
    cursorList = collection.find({'_id': screenshotId})
    for cursor in cursorList:
        scname = cursor['screenName']
    return scname


def getScreenshotName(collection, userId, screenshotId):

    print('im userId: '+str(userId))
    collection = db[str(collection)]
    cursor = collection.find({'_id': ObjectId(str(screenshotId))})
    screenShotName = ''
    for document in cursor:
        if str(userId) == str(document['user_id']):
            if str(document['status']) != 'inactive':
                screenShotName = (str(document['image']))

    return screenShotName


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


def getLineNumbers(seg_id):
    listOcr = findOne(db.ocr, 'segmentation_id', seg_id)
    return int(listOcr['linenumber'])


def getRoot(segId):
    collection = db['segmentation']
    cursor = collection.find_one({'_id': ObjectId(segId)})
    if str(segId) == str(cursor['_id']):
        return str(cursor['elementRoot'])


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



def search_new_element(id):
    collection = db.newElements
    return collection.find_one({'class_id': id})


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


def undoEvent(screenshotId, index):

    collection = db.events
    cursor = collection.find({'screenshot_id': screenshotId}).sort([('timeStamp', -1)]).limit(1+int(index))
    for i in cursor:
        event = i
    return event


def redoEvent(screenshotId, index):

    collection = db.events
    cursor = collection.find({'screenshot_id': screenshotId}).sort([('timeStamp', -1)]).limit(int(index))
    for i in cursor:
        event = i
    return event


def getLatestScreenshot(userId):
    collecion = db.tempPage
    return collecion.find_one({'userId': userId})


def setScreenshot(userId, screenshot_id,projectName):
    collection = db.tempPage

    if collection.find_one({'userId': userId}) != None:
        collection.update({'userId': userId}, {
                    '$set':
                        {
                            'screenshot_id': screenshot_id
                        }
                })
    else:
        collection.insert({
            'userId': userId,
            'projectName': projectName,
            'screenshot_id': screenshot_id,
            'screenHeight': '',
            'screenWidth': '',

        })


def save_layouts():
    collection_screen = db.screenshots
    collection_buttons = db.buttons
    collection_frames = db.frames
    collection_hyperlinks = db.hyperLinks
    collection_para = db.paragraphs
    collection_pictures = db.pictures
    collection_textBox = db.textBoxes
    collection_textArea = db.textArea
    collection_newElements = db.newElements
    date = datetime.now(pytz.timezone('Australia/Melbourne'))
    screen_cursor = collection_screen.find({})
    for i in screen_cursor:
        total_buttons = 0
        total_frames = 0
        total_hyperlinks = 0
        total_para = 0
        total_pictures = 0
        total_textBoxes = 0
        total_textAreas = 0
        total_elements = 0
        screenshot_id = i['_id']
        page_name = i['pageName']
        # Buttons Counter
        buttons_cursor = collection_buttons.find({'screenshot_id': str(screenshot_id)})
        new_buttons_cursor = collection_newElements.find({'screenshot_id': str(screenshot_id), 'type': 'button'})
        total_buttons = total_buttons + buttons_cursor.count() + new_buttons_cursor.count()
        # Frames Counter
        frames_cursor = collection_frames.find({'screenshot_id': str(screenshot_id)})
        new_frames_cursor = collection_newElements.find({'screenshot_id': str(screenshot_id), 'type': 'frame'})
        total_frames = total_frames + frames_cursor.count() + new_frames_cursor.count()
        # Hyperlinks Counter
        hyperlinks_cursor = collection_hyperlinks.find({'screenshot_id': str(screenshot_id)})
        new_hyperlinks_cursor = collection_newElements.find(
            {'screenshot_id': str(screenshot_id), 'type': 'hyperlink'})
        total_hyperlinks = total_hyperlinks + hyperlinks_cursor.count() + new_hyperlinks_cursor.count()
        # Paragraphs Counter
        para_cursor = collection_para.find({'screenshot_id': str(screenshot_id)})
        new_para_cursor = collection_newElements.find({'screenshot_id': str(screenshot_id), 'type': 'paragraph'})
        total_para = total_para + para_cursor.count() + new_para_cursor.count()
        # Pictures Counter
        pictures_cursor = collection_pictures.find({'screenshot_id': str(screenshot_id)})
        new_pictures_cursor = collection_newElements.find({'screenshot_id': str(screenshot_id), 'type': 'image'})
        total_pictures = total_pictures + pictures_cursor.count() + new_pictures_cursor.count()
        # TextBoxes Counter
        textBox_cursor = collection_textBox.find({'screenshot_id': str(screenshot_id)})
        new_textBox_cursor = collection_newElements.find({'screenshot_id': str(screenshot_id), 'type': 'textbox'})
        total_textBoxes = total_textBoxes + textBox_cursor.count() + new_textBox_cursor.count()
        # TextAreas Counter
        textAreas_cursor = collection_textArea.find({'screenshot_id': str(screenshot_id)})
        new_textAreas_cursor = collection_newElements.find(
            {'screenshot_id': str(screenshot_id), 'type': 'textArea'})
        total_textAreas = total_textAreas + textAreas_cursor.count() + new_textAreas_cursor.count()
        total_elements = total_buttons + total_frames + total_hyperlinks + total_para + total_pictures + \
                         total_textBoxes + total_textAreas
        db.layouts.insert({
            'screenshot_id': str(screenshot_id),
            'category': 'Unknow',
            'page_name': page_name,
            'total_Elements': total_elements,
            'buttons': total_buttons,
            'frames': total_frames,
            'hyperlinks': total_hyperlinks,
            'paragraphs': total_para,
            'pictures': total_pictures,
            'textBoxes': total_textBoxes,
            'textAreas': total_textAreas,
            'timeStamp': str(date),
            'timeZone': 'Australia/Melbourne'
        })


def saveMetrix(secHeight, secWidth, widthLayouts, heightLayouts, userId, screenshotId, projectName,device):

    if db.tempPage.find_one({'userId': userId}) != None and db.tempPage.find_one({}) != None:
        db.tempPage.update({'userId': userId}, {'$set':
            {'screenHeight': secHeight, 'screenWidth': secWidth,'device_page': device}
        })
    else:
        db.tempPage.insert({
            'userId': userId,
            'projectName': projectName,
            'screenshot_id': screenshotId,
            'screenHeight': secHeight,
            'screenWidth': secWidth,
            'device_page': device,
            'current_device_page': device,
            'layoutsHeight': heightLayouts,
            'layoutsWidth': widthLayouts,
            'layoutRunning': False,
            'colorRunning': False,
            'maskRCNNstate':False,
            'CNNstate':False
        })


def getMetrix(userId, val):
    return db.tempPage.find_one({'userId': userId})[str(val)]


# UPDATE Page Name
def update_page_name( pageName, screenshotId):
    collections = db.screenshots

    if collections.find_one({'_id': ObjectId(str(screenshotId))}) != None:
        collections.update({'_id': ObjectId(str(screenshotId))}, {
            '$set':
                {
                'pageName': str(pageName)
                }
        })
    else:
        print('something went wrong')
    print(str(screenshotId))


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


def getCurrentScreenName(id):
    try:
        return db.screenshots.find_one({'_id': ObjectId(str(id))})['screenName'].capitalize()
    except:
        return None


def insertEvent(screenid, segid, collection, type, old, new):
    date = datetime.now(pytz.timezone('Australia/Melbourne'))
    db['events'].insert({
        'screenshot_id': screenid,
        'seg_id': segid,
        'collection': collection,
        'oldEvent': {type: old},
        'newEvent': {type: new},
        'timeStamp': str(date),
        'timeZone': 'Australia/Melbourne'
    })

def hex_to_rgb(value):
    value = value.lstrip('#')
    lv = len(value)
    return 'rgb'+str(tuple(int(value[i:i + lv // 3], 16) for i in range(0, lv, lv // 3)))+''


def getUserPicture(username):
    try:
        return db['user'].find_one({'username':username})['profilePicture']
    except:
        print('')

def updateChildLocation(item,savePath, screenshotId, combinationId, amountOfKids, width, height):

    from PIL import Image
    img = Image.open(item['root'])
    print(item)
    from virtualize.textboxSep import elementTextboxExtraction
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

def updateChildPredictions(Array):
    print('lets update those sons of a bitches')

    print(Array)

    index = 1

    for item in Array:
        if 'parent' in item:
            if len(item['parent']['children']) > 1:
                print('now the fun begins')
                parentId = item['parent']['id']
                childId = item['child']['id']
                print(item['parent']['location']['y1'])
                item['parent']['location']['y1'] = (item['parent']['location']['y1']/len(item['parent']['children']))*index
                print(item['parent']['location']['y1'])
    print(Array)


    return Array
    # return {'x0': float(x0), 'y0': float(y0), 'x1': float(x1), 'y1': float(y1)}


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


def getColorPalette(screenId):
    colors = []
    try:
        segCollection = db.segmentation.find({'screenshot_id': screenId})
        seg_ids = []
        for ide in segCollection:
            seg_ids.append(str(ide['_id']))
        for ide in range(len(seg_ids)):
            color = db.styles.find_one({'segmentation_id': seg_ids[ide]})
            if color == '' or color == None:
                print('color is empty')
            else:
                print('else after replaced Color')
                bgcolor = color['bgcolor']
                border = color['borderColor']
                font = color['fontColor']
                print(border)
                print(bgcolor)
                print(font)
                if bgcolor == '' or bgcolor == 'transparent' or bgcolor == 'rgba(0, 0, 0, 0)':
                    print('bgcolor is empty')
                else:
                    if any(bgcolor in s for s in colors):
                        print('already in here')
                    else:
                        print('bgcolor')
                        print(bgcolor)
                        colors.append(bgcolor)

                if border == ''or border == 'transparent' or border == 'rgba(0, 0, 0, 0)':
                    print('border is empty')
                else:
                    if any(border in s for s in colors):
                        print('already in here')
                    else:
                        print('border')
                        print(border)
                        colors.append(border)

                if font == ''or font == 'transparent' or font == 'rgba(0, 0, 0, 0)':
                    print('font is empty')
                else:
                    if any(font in s for s in colors):
                        print('already in here')
                    else:
                        print('font')
                        print(font)
                        colors.append(font)
        background = db.backgrounds.find_one({'screenshot_id': screenId})['background']
        rgbToCatch = str(background).replace('-webkit-radial-gradient', '') \
            .replace('linear-gradient', '') \
            .replace('left center', '') \
            .replace('right center', '') \
            .replace('top center', '') \
            .replace('bottom center', '') \
            .replace('center center', '') \
            .replace('to center', '') \
            .replace('to left', '') \
            .replace('to right', '') \
            .replace('to top', '') \
            .replace('(, ', '') \
            .replace('%, ', ' ') \
            .replace('.', '') \
            .replace('%)', '')
        print('rgbToCatch')
        print(background)
        print(rgbToCatch)
        splitByRGB = rgbToCatch.split('rgb')
        print('splitByRGB')
        print(len(splitByRGB))
        size = len(splitByRGB) - 1
        while size > 0:
            assignRgbToCatch = substring.substringByChar(str(rgbToCatch), startChar="r", endChar=")")
            print('rgbToCatch1')
            print(assignRgbToCatch)
            colors.append(assignRgbToCatch)
            rgbToCatch = str(rgbToCatch).replace(assignRgbToCatch, '')
            print('replacedColor')
            print(rgbToCatch)
            size -= 1
    except:
        print('first time here')
        print(colors)
    # colorFinal = []
    # for color in colors:
    #     temp = color.replace('rgb(', '')
    #     temp2 = temp.replace(')', '')
    #     temp3 = temp2.split(",")
    #     empty = []
    #     for i in temp3:
    #         empty.append(int(i))
    #     colorFinal.append(empty)
    # colorFinal.sort(key=lambda rgb: colorsys.rgb_to_hls(*rgb))
    colors.sort()
    return colors


def layoutisTransferd(userid):
    try:
        state = db.tempPage.find_one({'userId': userid})['layoutRunning']
    except:
        state = False
    return state


def colorisTransferd(userid):
    try:
        state = db.tempPage.find_one({'userId': userid})['colorRunning']
    except:
        state = False
    return state


def workflowRun(userid):
    try:
        state = db.tempPage.find_one({'userId': userid})['workflowRunning']
    except:
        state = False
    return state


def updateLayout(colleciton, id, location):
    print('updating this collection: ' + str(colleciton) + ', with id: '+str(id)+' with these positions: ' + str(location))

    if colleciton == 'newElements':
        print('updating new elements')
        db[colleciton].update({'class_id': id},{'$set':{'location':{
            'x0':float(location['x0']),'y0':float(location['y0']),'x1':float(location['x1']),'y1':float(location['y1'])
        }}})
    else:
        print('updating generated elements')
        db[colleciton].update({'seg_id': id},{'$set':{'location':{
            'x0':float(location['x0']),'y0':float(location['y0']),'x1':float(location['x1']),'y1':float(location['y1'])
        }}})
