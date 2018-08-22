import numpy as np
from django.db import models
from mongoengine import *

from pymongo import MongoClient
from bson.objectid import ObjectId
from datetime import datetime
import pytz

''' MONGO ENGINE'''
'''
for i in User.objects:
    # print(*i, sep='\n')
    print(i['username'])
'''

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


client = MongoClient('localhost', 27017)  # maxPoolSize=50
db = client.MeduzaDb

'''SEGMENTATION DataModels'''
# Insert total number of elemeent



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

    def updateDatbaseByType(type,searchkey,replacement):
        print('THIS is my type ' + str(type))
        if (type == 'buttons' and searchkey == 'name'):
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
        elif (type == 'textArea' and searchkey == 'name'):
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
        elif (type == 'textBoxes' and searchkey == 'name'):
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
        elif (searchkey == 'location' or searchkey == 'name'):
            collection = db[str(type)]
            if search_new_element(id) != None:
                collection = db.newElements
                oldElement = collection.find_one({'class_id': id})[searchkey]

                collection.update({'class_id': id}, {
                    '$set':
                        {
                            searchkey: replacement
                        }
                })
            else:

                oldElement = collection.find_one({'seg_id': id})[searchkey]
                collection.update({'seg_id': id}, {
                    '$set':
                        {
                            searchkey: replacement
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

    else:
        print(element)
        elementType = 'Error: ' + str(element)

    oldEvent = ''
    newEvent = ''

    print('this type I am going to udpate: ' +str(type))
    if type == 'fontSize':
        event = {'fontSize': fontSize}
        oldEvent = {'fontSize': updateDatbaseByType(elementType, 'fontSize', fontSize)}
    elif type == 'fontColor':
        event = {'fontColor': fontcolor}
        oldEvent = {'fontColor': updateDatbaseByType(elementType, 'fontColor', fontcolor)}
    elif type == 'fontFamily':
        event = {'fontFamily': fontFamily}
        oldEvent = {'fontFamily': updateDatbaseByType(elementType, 'fontFamily', fontFamily)}
    elif type == 'location':
        event = {'location': location}
        oldEvent = {'location': updateDatbaseByType(elementType, 'location', location)}
    elif type == 'name':
        event = {'name': name}
        oldEvent = {'name': updateDatbaseByType(elementType, 'name', name)}

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

'''META-PROGRAMMING DataModels'''


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


def getUserPicture(username):
    try:
        return db['user'].find_one({'username':username})['profilePicture']
    except:
        print('')


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

