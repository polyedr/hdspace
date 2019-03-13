import pymongo
import re
import pytz
import substring

from bson.objectid import ObjectId
from datetime import datetime

from django.shortcuts import render
from django.urls import reverse

from apps.virtualize.display import set_html_layout, set_html_color
from apps.virtualize.utils.elementUtils import search_new_element, getStylesDb
from apps.virtualize.utils.screenshotUtils import getScreenName, getScreen_Name, getCurrentScreenName
from apps.virtualize.utils.widgetsUtils import fillWidget, fillGraphics
from apps.projects.forms import ProjectInvitationForm, AddTaskForm
from apps.projects.models import (
    Project, ProjectScreen, ScreenEvent, ScreenComment,
    ProjectMember, ProjectTask, ProjectActivity
)
from apps.accounts.models import Profile
from apps.threads.models import Thread, UserThread, Message
from apps.accounts.forms import SearchUserForm

client = pymongo.MongoClient('localhost', 27017)  # maxPoolSize=50
db = client.MeduzaDb
db_main = client.mainDB


# class Document(Document):
#     description = models.CharField(max_length=255, blank=True)
#     document = models.FileField(upload_to='documents/')
#     uploaded_at = models.DateTimeField(auto_now_add=True)


def user(url, user_id, name, scname):
    db.screenshots.insert({
        'user_id': str(user_id),
        'image': str(url),
        'status': 'pending',
        'pageName': str(name),
        'screenName': str(scname)
    })
    print(str(url) + ' has been saved')

    screen_id = db.screenshots.find_one({'user_id':str(user_id),'image': str(url), 'screenName': str(scname)})['_id']
    db.tempPage.update({'userId': str(user_id)},{'$set': {'screenshot_id': str(screen_id)}})

    return url


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

    results = []
    try:
        results = collection.find({collectionKey: searchwords})
    except pymongo.errors.OperationFailure as e:
        print('Mongo Data Base Error ' + e)
    return results


def findOne(collection, collectionKey, searchword):

    msg = 'failed to find: ' + searchword + '. '
    result = None
    if collectionKey == '_id' and searchword != '':
        try:
            result = collection.find_one({collectionKey: ObjectId(searchword)})
        except pymongo.errors.OperationFailure as e:
            print('Mongo Data Base Error ' + e)
    else:
        try:
            result = collection.find_one({collectionKey: searchword})
        except pymongo.errors.OperationFailure as e:
            print('Mongo Data Base Error ' + e)
    if result is not None:
        msg = 'find ' + searchword + ' with success. '
        print(msg)
    else:
        print(msg)
        return
    return result


def findTypeDb(type, ele_id):
    element = []
    collection = db[type].find({'seg_id': ele_id, 'state': 'active'})
    for col in collection:
        element.append(col)
    return element


def findChildDb(type, ele_id):
    elementChild = []
    collection = db[type].find({'level': {'child': ele_id}, 'state': 'active'})
    for col in collection:
        elementChild.append(col)
    return elementChild


def find_all_projects_user_status(user, status):

    result = []
    try:
        results = db_main.projects_project.find({'user_id': ObjectId(user), 'status': status})
    except pymongo.errors.OperationFailure as e:
        print('Mongo Data Base Error ' + e)
    return results


def find_one_project_user_status(userId, status):

    result = None
    try:
        results = db_main.projects_project.find_one({'user_id': ObjectId(userId), 'status': status})
    except pymongo.errors.OperationFailure as e:
        print('Mongo Data Base Error ' + e)
    return results


def find_all_image_library(userId, project_name):

    result = []
    try:
        results = db.saveImageLibrary.find({'user_id': userId, 'projectName': project_name})
    except pymongo.errors.OperationFailure as e:
        print('Mongo Data Base Error ' + e)
    return results


def find_one_image_library(userId, project_name):

    result = None
    try:
        results = db.saveImageLibrary.find_one({'user_id': userId, 'projectName': project_name})
    except pymongo.errors.OperationFailure as e:
        print('Mongo Data Base Error ' + e)
    return results


def getCollectionIDs(collection, username):
    if collection == 'accounts_user':
        collection = db_main[str(collection)]
    else:
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


def get_project_two_search_keys(user_id, project_name):

    result = None
    try:
        result = db_main.projects_project.find_one({'user_id': ObjectId(user_id), 'name': project_name})
    except (AttributeError, pymongo.errors.OperationFailure) as e:
        print('Mongo Data Base Error ' + e)
    return result


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
    print('Im saveMetrix')

    if db.tempPage.find_one({'userId': str(userId)}) is not None and db.tempPage.find_one({}) is not None:
        db.tempPage.update({'userId': str(userId)}, {'$set':
            {'screenHeight': secHeight, 'screenWidth': secWidth,'device_page': device}
        })
    else:
        print('Im saveMetrix else')
        db.tempPage.insert({
            'userId': str(userId),
            'projectName': projectName,
            'screenshot_id': screenshotId,
            'screenHeight': float(secHeight),
            'screenWidth': float(secWidth),
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


def getUserPicture(username):
    try:
        return db['user'].find_one({'username':username})['profilePicture']
    except:
        print('')


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
        state = db.tempPage.find_one({'userId': str(userid)})['workflowRunning']
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


def insert_project(project, user_id, date):
    db_main.projects_project.insert({'name': project,
                        'user_id': ObjectId(user_id),
                        'screenshots': [],
                        'status': 'pending'
                                     })
    db.tempPage.update({'userId': user_id}, {'$set': {'projectName': project, 'screenshot_id': ''}})
    db.storageLibrary.update({'user_Id': user_id}, {'$set': {'text': 'Project: ' + project.title()}})


def save_image_library(userId, selectedProject, filename, myfileLib, fileTypeL, fileSizeL, fileLModifiedL):
    db.saveImageLibrary.insert({
        'userId': userId,
        'projectName': selectedProject.lower(),
        'path': filename,
        'originalFileName': str(myfileLib)[:-4],
        'fileType': fileTypeL,
        'fileSize': fileSizeL,
        'fileLastModified': fileLModifiedL
    })
    db.lastActivityLibrary.update({'user': userId}, {'$set': {'currentlySelectedProj': selectedProject.lower()}})


def insert_project(project, userId, date):
    db_main.projects_project.insert({'name': project,
                        'user_id': ObjectId(userId),
                        'screenshots': [],
                        'status': 'pending'
                        })
    projectName = project
    db.tempPage.update({'userId': userId}, {'$set': {'projectName': projectName}})
    allProject = list(db_main.projects_project.find())
    size = int(len(allProject))
    db.storageLibrary.insert(
        {
            'id': size + 1,
            'user_id': userId,
            'text': 'Project: ' + projectName.title(),
            'children': [{
                'id': '',
                'text': ''
            }]
        }
    )


def getAllProjects(userId, currentUser):
    print('getting all the projects for workflow')
    var = []
    project = db.tempPage.find_one({'userId': userId})
    try:
        project_name = project['projectName']
    except:
        print('error getting projects')
    if project is not None and project['projectName'] != '':
        screenids = db_main.projects_project.find_one({'user_id': ObjectId(userId), 'name': project['projectName']})
        for id in screenids['screenshots']:
            if str(id) != '':
                screen = db.screenshots.find_one({'_id': ObjectId(str(id))})
                if screen['status'] != 'inactive':
                    var.append([screen['image'][int(len(str(currentUser))) + 7:-4], screen['pageName'], screen['screenName']])
    html = []
    css = []
    import codecs
    for page in var:
        try:
            pagehtml = codecs.open('./static/users/' + currentUser + '/' + page[0] + '/testing.html',
                                   mode='r', encoding='UTF-8')
            pagename = page[2]
            html.append([pagename, pagehtml.read()])
            pagehtml.close()
        except:
            html.append('')
        try:
            pagecss = codecs.open('./static/users/' + currentUser + '/' + page[0]
                                  + '/css/testingCss.css', mode='r', encoding='UTF-8')
            css.append(pagecss.read())
            pagecss.close()
        except:
            css.append('')
    return html, css


def getColorTransferHtml(currentUser, screenshotName):
    files = [currentUser + '/pages/' + screenshotName + '/colorTransfer/linear.png',
             currentUser + '/pages/' + screenshotName + '/colorTransfer/lum.png',
             currentUser + '/pages/' + screenshotName + '/colorTransfer/lum2.png',
             currentUser + '/pages/' + screenshotName + '/colorTransfer/matchStyle.png',
             currentUser + '/pages/' + screenshotName + '/colorTransfer/outmatch.png']
    newHtml = ''
    try:
        for i in range(len(files)):
            newHtml += str(set_html_color(str(files[i][:-4]), i, str(files[i])))
    except:
        print('this screen is just made')

    return newHtml


def getLayoutHtml(currentUser, screenshotName):
    files = [currentUser + '/pages/' + screenshotName + '.png',
             currentUser + '/pages/' + screenshotName + '.png',
             currentUser + '/pages/' + screenshotName + '.png',
             currentUser + '/pages/' + screenshotName + '.png',
             currentUser + '/pages/' + screenshotName + '.png',
             currentUser + '/pages/' + screenshotName + '.png']
    newHtml = ''
    try:
        for i in range(len(files)):
            newHtml += str(set_html_layout(str(files[i]), i+1, i+1))
    except:
        print('this screen is just made LAYOUTS')

    return newHtml


def getProjectPage(screenshotName, currentUser, project_name):
    print('retrieve the correct html for page2')
    try:
        import codecs
        pagehtml = codecs.open('./static/users/' + currentUser + '/' + screenshotName
                               + '/testing.html', mode='r', encoding='UTF-8')
        html = pagehtml.read()
        pagehtml.close()
    except:
        html = ''
    return html


def getProjectPageSuggestions(screenshotSID, currentUser):
    print('retrieve the correct html for suggestions dropdown menu')
    try:
        getPathFS = db.screenshots.find_one({'_id': screenshotSID})['pageName']
        import codecs
        pagehtml = codecs.open('./static/users/' + currentUser +'/pages/' + getPathFS
                               + '/testingSuggestions.html', mode='r', encoding='UTF-8')
        htmlSugg = pagehtml.read()
        pagehtml.close()
    except:
        htmlSugg = ''
    return htmlSugg


def getRSuggestions(screenshotSID):
    print('retrieve the correct html for suggestions dropdown menu')
    try:
        getPathFS = db.screenshots.find_one({'_id': screenshotSID})['pageName']
    except:
        getPathFS = ''
    return getPathFS


def getProjectPagePro(screenshotName, currentUser):
    print('retrieve the Pro correct html for page2')
    var1 = []
    html = []
    user = db_main.accounts_user.find_one({'username': currentUser})
    userId1 = user['_id']
    try:
        sc_id = db.screenshots.find_one({'pageName': screenshotName})
        project1 = db.tempPage.find_one({'screenshot_id': str(sc_id['_id'])})
        project_name = project1['projectName']
        scree_id = db_main.projects_project.find_one({'user_id': ObjectId(userId1), 'name': str(project1['projectName'])})
        arSc = scree_id['screenshots']
        for id1 in arSc:
            screen = db.screenshots.find_one({'_id': ObjectId(str(id1))})
            if str(screen['status']) != 'inactive':
                var1.append([screen['image'][int(len(str(currentUser))) + 7:-4], screen['pageName'],
                             screen['screenName']])

        import codecs
        for page in var1:
            pagehtml1 = codecs.open('./static/users/' + currentUser + '/' + page[0]
                                    + '/testingPro.html',mode='r', encoding='UTF-8')
            screenName = page[2]
            html.append([screenName, pagehtml1.read()])
            pagehtml1.close()

    except:
        html = ''
    return html


def get_project_page_pro_by_project(screens, current_user_id):
    print('retrieve the Pro correct html for page2')
    var1 = []
    html = []
    user = db_main.accounts_user.find_one({'_id': current_user_id})
    # userId1 = user['_id']
    try:
        # sc_id = db.screenshots.find_one({'pageName': screenshotName})
        # project1 = db.tempPage.find_one({'screenshot_id': str(sc_id['_id'])})
        # project_name = project1['projectName']
        # scree_id = db_main.projects_project.find_one({'user_id': ObjectId(userId1), 'name': str(project1['projectName'])})
        # arSc = scree_id['screenshots']
        for id1 in screens:
            screen = db.screenshots.find_one({'_id': ObjectId(str(id1))})
            if str(screen['status']) != 'inactive':
                var1.append([screen['image'][int(len(str(user['username']))) + 7:-4], screen['pageName'],
                             screen['screenName']])

        import codecs
        for page in var1:
            pagehtml1 = codecs.open('./static/users/' + user['username'] + '/' + page[0]
                                    + '/testingPro.html',mode='r', encoding='UTF-8')
            screenName = page[2]
            html.append([screenName, pagehtml1.read()])
            pagehtml1.close()

    except:
        html = ''
    print('HTML')
    print(html)
    return html


def getProjectPageAndCss(screenshotName, currentUser):
    print('retrieve the correct html and css for page2')
    try:
        import codecs
        pagehtml = codecs.open('./static/users/' + currentUser + '/' + screenshotName
                               + '/testing.html', mode='r', encoding='UTF-8')
        html = pagehtml.read()
        pagehtml.close()
        pagecss = codecs.open('./static/users/' + currentUser + '/' + screenshotName
                              + '/css/testingCss.css', mode='r', encoding='UTF-8')
        css = pagecss.read()
        pagecss.close()
    except:
        html = ''
        css = ''
    return css

def get_project_page_css_pro_by_project(screen_name, user):
    user_name = db_main.accounts_user.find_one({'_id':ObjectId(user)})['username']
    css = getProjectPageAndCss(screen_name, user_name)
    return css



def getProjects(userId):
    print('getting the projects for this user!')
    jsonProjects = []
    projects = db_main.projects_project.find({'user_id': ObjectId(userId)})
    for project in projects:
        screens = []
        screen = 'There are no pages for this project.'
        length = 0
        for screenid in project['screenshots']:
            if db.screenshots.find_one({'_id': ObjectId(screenid)})['status'] != 'inactive':
                curScreen = db.screenshots.find_one({'_id': ObjectId(screenid)})
                screens.append([
                    str(curScreen['_id']),
                    str(curScreen['pageName']),
                    str(curScreen['image'])
                ])

                screen = screens
                length = len(screens)
        if project['status'] != 'inactive':
            jsonProjects.append({
                'id': str(project['_id']),
                'status' : str(project['status']),
                'projectName': project['name'],
                'user_id': project['user_id'],
                'screenshotsamount': length,
                'screenshots': screen
            })

    return jsonProjects


def getProjectPageWork(userId):
    print('retrieve the Pro correct html for page2 in workflow container')
    html = []
    currentUser = db_main.accounts_user.find_one({'_id': ObjectId(userId)})['username']

    try:
        print('projectName')
        temp = db.tempPage.find_one({'userId': str(userId)})
        project_name = temp['projectName']
        currentProject = db_main.projects_project.find_one({'user_id': ObjectId(userId), 'name': str(project_name)})
        project_screen = currentProject['screenshots']
        screenshots = db.screenshots.find({'user_id': str(userId)})
        for screen in screenshots:
            if str(screen['_id']) in project_screen:
                screenshotName = screen['pageName']
                screenName = screen['screenName']
                elId = str(screen['_id'])
                import codecs
                pagehtml2 = codecs.open('./static/users/' + currentUser + '/' + screenshotName
                                        + '/testingWork.html', mode='r', encoding='UTF-8')
                html.append([screenName, pagehtml2.read(), elId])
                pagehtml2.close()
    except:
        html.append('')

    print(html)

    return html


def getProjectPageWorkCSS(userId,projectName, currentScreen):
    print('retrieve the Pro correct css for page2 in workflow container')
    css = []
    path = []

    try:
        project = db_main.projects_project.find_one({'user_id': ObjectId(userId), 'name': projectName})
        pName = str(project['_id'])
        p = pName.split('/')
        screenshots = db.screenshots.find({'user_id': userId})
        currentUser = db_main.accounts_user.find_one({'_id': ObjectId(userId)})['username']

        for screen in screenshots:
            if screen['status'] != 'inactive':
                screenshotName = screen['pageName']
                screenName = screen['screenName']
                if screenshotName.split('/')[1] == projectName:
                    import codecs
                    try:
                        if screenshotName.split('/')[2] != currentScreen.split('/')[2]:
                            path.append(currentUser + '/' + screenshotName +
                                        '/css/testingCss.css')
                        pagecss = codecs.open('./static/users/'
                                              + currentUser + '/' + screenshotName
                                              + '/css/testingCss.css',
                                            mode='r', encoding='UTF-8')
                        css.append(pagecss.read())
                        pagecss.close()
                    except:
                        continue
    except:
        css.append('')
    return path
# Returns a list of all widget paths
def get_widget_paths():
    cursor = db.saveWidgets.find({})
    paths = []
    names = []
    for document in cursor:
        if 'Widget' == str(document['type']):
            paths.append(str(document['widgetLocation']))
            names.append(str(document['widgetName']))
    data = [{'paths': paths, 'names': names}]
    return data


def get_chart_paths():
    cursor = db.saveWidgets.find({})
    paths = []
    for document in cursor:
        if 'Graphic' == str(document['type']):
            paths.append(str(document['widgetLocation']))
    return paths



def getSuggestion(userId, projectName):
    print('Iside Suggestions')
    currentProject = db_main.projects_project.find_one({'name':str(projectName),
                                           'user_id':ObjectId(userId)})
    s1 = []
    s2 = []
    s3 = []
    s4 = []
    suggestions = []
    if currentProject is not None:
        project_id = str(currentProject['_id'])
        suggest = db.tempSuggestions.find_one({'project_id':project_id})
        if suggest is not None:
            data_1 = suggest['Level_1']
            data_2 = suggest['Level_2']
            data_3 = suggest['Level_3']
            data_4 = suggest['Level_4']
            for d1 in data_1:
                label = db.suggestionsTable.find_one({'code':str(d1),
                                                      'Level': 'level_1'})
                s1.append([d1,label['description']])
            for d2 in data_2:
                label = db.suggestionsTable.find_one({'code':str(d2[0]),
                                                      'Level': 'level_2'})
                s2.append([d2,label['description']])
            for d3 in data_3:
                label = db.suggestionsTable.find_one({'code':str(d3),
                                                      'Level': 'level_3'})
                s3.append([d3,label['description']])
            for d4 in data_4:
                label = db.suggestionsTable.find_one({'code':str(d4[0]),
                                                      'Level': 'level_4'})
                s4.append([d4,label['description']])

        else:
            print('There are not suggestions')

    else:
        print("There are some issues with the project")

    suggestions.append(s1)
    suggestions.append(s2)
    suggestions.append(s3)
    suggestions.append(s4)
    return suggestions


def fillPageArray(userId, projectName):
    pageArray = []
    project = db_main.projects_project.find_one({'user_id': ObjectId(userId),
                                    'name': projectName})
    print('filling up the page!')
    try:
        for screenid in project['screenshots']:
            screen = db.screenshots.find_one({'_id': ObjectId(str(screenid))})
            if str(screen['status']) != 'inactive':
               pageArray.append(
                   {'id': str(screen['_id']),
                    'image': screen['image'],
                    'status': screen['status'],
                    'user_id': screen['user_id'],
                    'image_name': str(screen['pageName']),
                    'screenName': getScreenName(screen['_id'])
                    }
                )
    except:
        print('Nonething yet')

    return pageArray


def searchEnquiry(key):

    reg = re.compile(key)

    screens = db.saveScreens.find({'screenName': reg})  # returns a dictionary
    screens_desc = db.saveScreens.find({'screenDescription': reg})

    widgets = db.saveWidgets.find({'widgetName': reg})  # returns a dictionary
    widgets_desc = db.saveWidgets.find({'widgetDescription': reg})

    search_results = [[], []]

    temp_snsd = set()
    temp_wnwd = set()

    for doc in screens:
        temp_snsd.add(str(doc['screenName']))

    for doc in screens_desc:
        temp_snsd.add(str(doc['screenName']))

    search_results[0].extend(list(temp_snsd))

    for doc in widgets:
        temp_wnwd.add(str(doc['widgetName']))

    for doc in widgets_desc:
        temp_wnwd.add(str(doc['widgetName']))

    search_results[1].extend(list(temp_wnwd))

    return search_results


def html_render(url, currentUser, page, projectName, request, screenshotName, userId,screenId, layoutIsBeingTransferd,
                colorIsBeingTransferd, workflowBeingMagic, html, css, ScreenSIDFDJANGO, screen_obj):

    project_id = get_project_id(projectName, userId)

    return render(request, url,
                  {
                      'pageArray': fillPageArray(userId, projectName),
                      'screen': screenshotName,
                      'screenName': getScreen_Name(screenshotName),
                      'projectName': projectName,
                      'page': page,
                      'userName': currentUser,
                      'currentProfilePic': getUserPicture(currentUser),
                      'currentPage': getCurrentScreenName(screenId),
                      'colorTransfer': getColorTransferHtml(currentUser, screenshotName),
                      'screenHTML': getProjectPage(screenshotName, currentUser, projectName),
                      'screenHTMLpro': getProjectPagePro(screenshotName, currentUser),
                      'screenHTMLwork': getProjectPageWork(userId),
                      'screenHTMLsuggestions': getProjectPageSuggestions(ScreenSIDFDJANGO, currentUser),
                      'screenCSSpro': getProjectPageAndCss(screenshotName, currentUser),
                      'screenCSSwork': getProjectPageWorkCSS(userId, projectName, screenshotName),
                      'colorTransferUploadIMG': str(currentUser) + '/pages/' + str(screenshotName)
                                                + '/colorTransfer/styles/colorTransfer.jpg',
                      'layoutTransfer': getLayoutHtml(currentUser, screenshotName),
                      'colorPalette': getColorPalette(screenId),
                      'layoutIsBeingTransferd': layoutIsBeingTransferd,
                      'colorIsBeingTransferd': colorIsBeingTransferd,
                      'workflowBeingMagic': workflowBeingMagic,
                      'suggestionsL1': getSuggestion(userId,projectName)[0],
                      'suggestionsL2': getSuggestion(userId,projectName)[1],
                      'suggestionsL3': getSuggestion(userId,projectName)[2],
                      'suggestionsL4': getSuggestion(userId,projectName)[3],
                      'projects': getProjects(userId),
                      'projectsHTML': html,
                      'projectsCSS': css,
                      'AllWidget': fillWidget(),
                      'AllGraphics': fillGraphics(),
                      'aniStyles': getStylesDb(),
                      'assignProjects': getProjects(userId),
                      # Testing right-sidebar
                      # ---------------------
                      "project": Project.objects.get(pk=project_id),
                      'project_id': project_id,
                      'invite_form': ProjectInvitationForm(),
                      "add_task_form": AddTaskForm(project_id),
                      "user_roles": [role[0] for role in Profile.USER_ROLE],
                      "project_members": ProjectMember.objects.filter(project=Project.objects.get(pk=project_id)),
                      "tasks": ProjectTask.objects.filter(project=Project.objects.get(pk=project_id)),
                      "project_member_user": ProjectMember.objects.get(user=request.user, project=project_id),
                      "thread": Thread.ordered(Thread.inbox(ProjectMember.objects.get(user=ObjectId(userId), project=project_id), project_id))[0],
                      "projects": Project.objects.filter(user=request.user),
                      "search_user_form": SearchUserForm(),
                      "activities": ProjectActivity.objects.filter(project=project_id).order_by('-created'),
                      "project_name": projectName,
                      # Testing share prototype
                      # ---------------------
                      'screen_obj': screen_obj

                  }
                  )

def save_new_elements(class_id, screenshot_id, type, name, location, date, path):
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

def get_project_id(project, user_id):
    if user_id == '' or user_id is None or project == '':
        return None
    else:
        return db_main.projects_project.find_one({'user_id':ObjectId(user_id), 'name': project})['id']


def get_project(project, user_id):
    if user_id == '' or user_id is None or project == '':
        return None
    else:
        p = db_main.projects_project.find_one({'user_id': ObjectId(user_id), 'name': project})
        return p


def get_user_pk(user_id):
    if user_id == '' or user_id is None :
        return None
    else:
        return db_main.accounts_user.find_one({'_id': user_id})['_id']

def get_user_pk(userId):
    return db_main.accounts_user.find_one({'_id': userId})['_id']

# Returns a list of segmentation ids of all the shapes in this project; identified during segmentation

def get_project_shapes_segmentation_id(project_screenshots_id_list, collection_name):
    segmentation_id_list = []
    collection = db[collection_name]
    if project_screenshots_id_list is not None:
        #For all screenshots in the project
        for screenshot_id in project_screenshots_id_list:
            #find all the shapes that belong to this screenshot
            screenshots_shapes = collection.find({"type": "shapes","screenshot_id": screenshot_id})
            if screenshots_shapes is not None:
                #and add their seg_id to the list.
                for shape in screenshots_shapes:
                    segmentation_id_list.append(shape['seg_id'])

    return segmentation_id_list

# Returns a list of segmentation ids of all the ocr in this project; identified during segmentation

def get_project_ocr_segmentation_id(project_screenshots_id_list, collection_name):
    segmentation_id_list = []
    collection = db[collection_name]
    if project_screenshots_id_list is not None:
        #For all screenshots in the project
        for screenshot_id in project_screenshots_id_list:
            #find all the ocr that belong to this screenshot
            screenshots_shapes = collection.find({"type": "ocr","screenshot_id": screenshot_id})
            if screenshots_shapes is not None:
                #and add their seg_id to the list.
                for shape in screenshots_shapes:
                    segmentation_id_list.append(shape['seg_id'])

    return segmentation_id_list


def get_element_class_id(project_screenshots_id_list,element_type):
    class_id_list = []
    if project_screenshots_id_list is not None:
        #For all screenshots in the project
        for screenshot_id in project_screenshots_id_list:
            #find all the elenments (of type : "element_type") that belong to this screenshot
            screenshots_elements = db.newElements.find({"type": element_type, "screenshot_id": screenshot_id})
            if screenshots_elements is not None:
                #and add their class_id to the list
                for element in screenshots_elements:
                    class_id_list.append(element['class_id'])

    return class_id_list


def get_styles(segmentationIdList):
    import json
    styles_set = set()
    if segmentationIdList is not None:
        for segmentationId in segmentationIdList:
            this_style = db.styles.find_one({"segmentation_id": segmentationId})

            if this_style is not None:
                #Must be same as get_new_styles() functions, new_style dictionary.
                new_style = {
                    "font-family": this_style['fontFamily'],
                    "font-size": this_style['fontSize'],
                    "color": this_style['fontColor'],
                    "border-color": this_style['borderColor'],
                    "border-radius": this_style['borderRadius'],
                    "background-color": this_style['bgcolor'],
                    "text-align": this_style['textAlign'],
                    "text-indent": this_style['textIndent'],
                }

                #Convert dictionary to str object and add to set
                styles_set.add(json.dumps(new_style))

    return styles_set

def get_new_styles(classIdList):
    import json
    styles_set = set()
    if classIdList is not None:
        for classId in classIdList:
            this_style = db.newStyle.find_one({"element_id": classId})

            # Must be same as get_styles(), new_style dictionary.
            # For set comparison of string elements. It will remove duplicates only if elements are the same string
            # so if the key: values are not the same it will not remove duplicates.
            new_style = {
                "font-family": this_style['fontFamily'],
                "font-size": this_style['fontSize'],
                "color": this_style['fontColor'],
                "border-color": this_style['borderColor'],
                "border-radius": this_style['borderRadius'],
                "background-color": this_style['bgcolor'],
                "text-align": this_style['textAlign'],
                "text-indent": this_style['textIndent'],
            }
            # Add new style to set prevents duplicate stylings within collection (no duplicate styling)
            # Convert dictionary to str object and add to set
            styles_set.add(json.dumps(new_style))

    return styles_set

