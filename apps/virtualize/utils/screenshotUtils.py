import pymongo
from bson import ObjectId
from django.db import connection

from apps.projects.models import ProjectScreen

client = pymongo.MongoClient('localhost', 27017)  # maxPoolSize=50
db = client.MeduzaDb
# TODO: Check, do we really need to use pymongo here
main_db_name = connection.settings_dict['NAME']
db_main = client[main_db_name]

def getScreenShotDetails(name, user):

    screen = None
    try:
        screen = db.screenshots.find_one({'pageName': str(name), 'user_id': user})
    except (AttributeError, pymongo.errors.OperationFailure) as e:
        print('Mongo Data Base Error ' + e)
    return screen


def getScreenName(screenshotId):
    collection = db.screenshots
    cursorList = collection.find({'_id': screenshotId})
    for cursor in cursorList:
        scname = cursor['screenName']
    return scname


def getScreenshotName(collection, userId, screenshotId):

    print('im userId: '+str(userId))
    print(collection)
    print(userId)
    print(screenshotId)
    collection = db[str(collection)]
    screenShotName = 'None at this point'
    if screenshotId != '' and screenshotId is not None:
        try:
            cursor = collection.find({'_id': ObjectId(str(screenshotId))})
        except AssertionError as error:
            print(error)
            print('Error screen Name')
        else:
            for doc in cursor:
                print('I am get screen NAme')
                print(doc)
                if str(userId) == str(doc['user_id']):
                    if str(doc['status']) != 'inactive':
                        screenShotName = (str(doc['image']))

    return screenShotName


def getLatestScreenshot(userId):

    item = None
    collecion = db.tempPage
    try:
        item = collecion.find_one({'userId': str(userId)})
    except (AttributeError, pymongo.errors.OperationFailure) as e:
        print('Mongo Data Base Error ' + e)
    return item


def getScreenObject(screen_id):

    screen_obj = None
    try:
        screen_obj = ProjectScreen.objects.get(details_id=str(screen_id))
    except:
        print('error')
    return screen_obj



def setScreenshot(userId, screenshot_id,projectName):
    collection = db.tempPage
    #If this user has at least one tempPage document
    if collection.find_one({'userId': userId}) != None:
        #update all documents belonging to this user with a new screenshot id
        collection.update({'userId': userId}, {
                    '$set':
                        {
                            'screenshot_id': screenshot_id
                        }
                })
    #Else, no tempPages documents belonging to this user
    else:
        #insert one
        collection.insert({
            'userId': userId,
            'projectName': projectName,
            'screenshot_id': screenshot_id,
            'screenHeight': '',
            'screenWidth': '',

        })


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


def getCurrentScreenName(id):
    try:
        return db.screenshots.find_one({'_id': ObjectId(str(id))})['screenName'].capitalize()
    except:
        return None


def delete_link(id):
    screenName = db.screenshots.find_one({'_id':ObjectId(id)})['screenName']
    sc = db.styles.find({'link': str(screenName)})
    for s in sc:
        db.styles.update({'_id':s['_id']},{
            '$set': {
                'link': ''
            }
        })


def delete_page(page, userId):
    db.screenshots.update({'_id': ObjectId(page)}, {'$set': {'status': 'inactive'}})
    currentProject = db.tempPage.find_one({'userId': str(userId)})
    project = db_main.projects_project.find_one({'user_id': ObjectId(userId), 'name': str(currentProject['projectName'])})
    db.docRecognition.remove({'screenshot_id': page})
    delete_link(page)
    update_screen = []
    for s in project['screenshots']:
        if str(s) != str(page):
            update_screen.append(s)
    db_main.projects_project.update({'_id': project['_id']}, {'$set': {'screenshots': update_screen}})
    db_main.projects_projectscreen.update({"project_id": project['id']},{'$set': {'status': 'inactive'}})


def getScreen_Name(screenshotName):
    sName = ''
    try:
        scName = db.screenshots.find_one({'pageName': screenshotName})
        sName = scName['screenName']
    except:
        print("nothing")
    return sName

