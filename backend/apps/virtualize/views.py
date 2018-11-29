import re

from django.contrib.auth.decorators import login_required
from django.core.cache import cache
from django.core.files.storage import FileSystemStorage
from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import redirect
from django.shortcuts import render
from django.utils.cache import add_never_cache_headers
from django.views.decorators.csrf import csrf_exempt

from virtualize.display import set_html_color, set_html_layout
from virtualize.inference_segmentation import initiateCocoDetection, initiateTensorflowDetection
from virtualize.metaCustom import metaCustom, addElement
from virtualize.models import *
from virtualize.segmentation import run
# from virtualize.segmentationold import run
from virtualize.styleTransfer import propertyTransfer

coco_model_global = []
tensorflow_model_global = []


class NoCachingMiddleware(object):
    def process_response(self, response):
        add_never_cache_headers(response)
        return response


def goIndex(request):
    return render(request, 'login/login.html', )


def index(request):
    # print(user)
    currentUser = request.user
    print(currentUser)
    userId = getCollectionIDs('user', currentUser)
    print(userId)
    if request.method == 'POST':

        myfile = request.FILES['myfile']
        fs = FileSystemStorage()

        filename = fs.save(str(currentUser)+'/pages/'+myfile.name, myfile)
        name = filename[int(len(str(currentUser))+7):-4]

        if user(url=filename, user_id=userId, name=name):
            print('lets start segmenting ' + str(filename))
            run(filename, currentUser)
        else:
            print('lol error')

        return HttpResponseRedirect('/page2/')

    return render(request, 'virtualize/home.html')

@csrf_exempt
def main_request_core(request):
    currentUser = str(request.user)
    print('im user '+currentUser)
    userId = getCollectionIDs('user', currentUser)

    layoutIsBeingTransferd = layoutisTransferd(userId)
    colorIsBeingTransferd = colorisTransferd(userId)
    workflowBeingMagic = workflowRun(userId)
    suggestionImgC = ''

    print('check here:')
    print(request)
    print(request.GET)
    print(request.POST)
    html = ''
    css = ''
    try:
        projectName = getLatestScreenshot(userId)['projectName']
    except:
        projectName = ''

    try:
        allProjects = getAllProjects(userId, currentUser)
        html = allProjects[0]
        print("html")
        css = allProjects[1]
        screenshotId = getLatestScreenshot(userId)['screenshot_id']
        projectName = getLatestScreenshot(userId)['projectName']
        page = str(getScreenshotName('screenshots', userId, str(screenshotId))[int(len(str(currentUser))) + 7:])
        screenshotName = str(
            getScreenshotName('screenshots', userId, str(screenshotId))[int(len(str(currentUser))) + 7:-4])
        myfile = str(getScreenshotName('screenshots', userId, str(screenshotId)))
    except:
        print('this user does not have any screenshot yet.')
        screenshotId = ''
        screenshotName = 'None at this point'
        page = 'None at this point'
        myfile = None

    if screenshotName == '':
        screenshotId = ''
        screenshotName = 'None at this point'
        page = 'None at this point'
        myfile = None


    if request.GET:
        print('GET REQUEST!')
        print(request.GET)
        if str(request.GET['name']) == 'newWorkflowIndex':
            source = request.GET['source'][2:]
            target = request.GET['target']
            screenName = request.GET['screenname']
            print(source + ' : ' + target)
            screen = db.screenshots.find_one({'pageName': str(screenName), 'user_id': userId})
            myfile = str(screen['image'])
            screenshotId = str(screen['_id'])
            db.styles.update({'segmentation_id':str(source)}, {'$set': {'link': str(target)}})
        elif str(request.GET['name']) == 'deleteElement':
            deleteId = str(request.GET['id'])[2:]
            element = str(request.GET['element'])

            if search_new_element(deleteId) != None:
                elementType = 'newElements'
                print('NEWELEMENT DELETED')
                db[elementType].update({'class_id': deleteId}, {'$set': {'state': 'inactive'}})
                collection = db[elementType].find({'class_id': deleteId})
                for col in collection:
                    eventelement = col
                print(element)
                insertEvent(eventelement['screenshot_id'], eventelement['seg_id'], elementType, 'deletedElement',
                            'active', 'inactive')
            else:
                if element == 'P':
                    elementType = 'paragraphs'

                elif element == 'A':
                    elementType = 'hyperLinks'

                elif element == 'INPUT':
                    elementType = 'textBoxes'

                elif element == 'WID':
                    elementType = 'widgets'

                elif element == 'TEXTAREA':
                    elementType = 'textArea'

                elif element == 'BUTTON':
                    elementType = 'buttons'

                elif element == 'DIV':
                    elementType = 'frames'

                elif element == 'IMG':
                    elementType = 'icon'  # have this be either 'icon' or 'pictures' depending on which database your IMGs are stored

                else:
                    elementType = 'Error: ' + str(element)
                db[elementType].update({'seg_id': deleteId}, {'$set': {'state': 'inactive'}})
                collection = db[elementType].find({'seg_id': deleteId})
                for col in collection:
                    eventelement = col
                insertEvent(eventelement['screenshot_id'], eventelement['seg_id'], elementType, 'deletedElement',
                            'active', 'inactive')
        elif str(request.GET['name']) == 'elementList':
            state = request.GET
            date = datetime.now(pytz.timezone('Australia/Melbourne'))
            fontColor = state['fontColor']
            fontSize = state['fontSize']
            fontFamily = state['fontFamily']
            borderColor = state['borderColor']
            borderRadius = state['borderRadius']
            bgcolor = state['bgcolor']
            textAlign = state['textAlign']
            textIndent = state['textIndent']
            name = state['currentName']
            type = state['type']
            element = state['element']

            location = {'x0': state['x0'], 'y0': state['y0'], 'x1': state['x1'], 'y1': state['y1']}
            id = state['elemId'][2:]
            saveCurrent(str(date), id, location, fontColor, fontSize, fontFamily, borderColor,
                        borderRadius, bgcolor, textAlign, element, screenshotId, textIndent, type, name)
        elif str(request.GET['name']) == 'getPredictions':

            def getOneActive(type, id):
                return db[type].find_one({'seg_id': id, 'state': 'active'})

            def getOneActiveNewE(type, id):
                return db[type].find_one({'class_id': id, 'state': 'active'})

            def getOneChild(type, id):
                return db[type].find_one({'level': {'child': id}})

            def getOneActiveChild(type, id):
                return db[type].find_one({'level': {'child': id}, 'state': 'active'})

            element = request.GET
            id = element['id'][2:]
            image = []
            elementName = ''
            ocr = []
            children = []
            childs = []
            state = []

            collection = db['predictions']
            cursor = collection.find({'segmentation_id': id})
            for document in cursor:
                children.append(document['children'])

            if getOneActive('buttons', id) != None:
                elementName = 'button'
                if getOneActive('buttons', id)['level']['parent'] == []:
                    ocr = getOneActive('buttons', id)['name']
                else:
                    ocr = getOneChild('buttons', id)['name']
                image = getOneActive('buttons', id)['root']
                state = getOneActive('buttons', id)['locked']
            if getOneActive('frames', id) != None:
                elementName = 'div'
                ocr = []
                image = getOneActive('frames', id)['root']
                state = getOneActive('frames', id)['locked']
            if getOneActive('hyperLinks', id) != None:
                elementName = 'hyperlink'
                ocr = getOneActive('hyperLinks', id)['name']
                image = getOneActive('hyperLinks', id)['root']
                state = getOneActive('hyperLinks', id)['locked']
            if getOneActive('paragraphs', id) != None:
                elementName = 'paragraph'
                ocr = getOneActive('paragraphs', id)['name']
                image = getOneActive('paragraphs', id)['root']
                state = getOneActive('paragraphs', id)['locked']
            if getOneActive('pictures', id) != None:
                elementName = 'image'
                ocr = []
                image = getOneActive('pictures', id)['root']
                state = getOneActive('pictures', id)['locked']
            if getOneActive('icon', id) != None:
                elementName = 'Icon'
                ocr = []
                image = getOneActive('icon', id)['root']
                state = getOneActive('icon', id)['locked']
            if getOneActive('logo', id) != None:
                elementName = 'Logo'
                ocr = []
                image = getOneActive('logo', id)['root']
                state = getOneActive('logo', id)['locked']
            if getOneActive('textArea', id) != None:
                elementName = 'text-area'
                if getOneActive('textArea', id)['level']['parent'] == []:
                    ocr = getOneActive('textArea', id)['name']
                else:
                    ocr = getOneChild('textArea', id)['name']
                image = getOneActive('textArea', id)['root']
                state = getOneActive('textArea', id)['locked']
            if getOneActive('textBoxes', id) != None:
                elementName = 'text-input'
                if getOneActive('textBoxes', id)['level']['parent'] == []:
                    ocr = getOneActive('textBoxes', id)['name']
                else:
                    ocr = getOneChild('textBoxes', id)['name']
                image = getOneActive('textBoxes', id)['root']
                state = getOneActive('textBoxes', id)['locked']
            if getOneActiveNewE('newElements', id) != None:
                elementName = getOneActiveNewE('newElements', id)['type']
                if elementName == 'button' or elementName == 'paragraph' or elementName == 'textbox' or elementName =='textArea':
                    ocr = getOneActiveNewE('newElements', id)['name']
                else:
                    ocr = []
                image = []
                state = getOneActiveNewE('newElements', id)['locked']
            if getOneActive('widgets', id) != None:
                elementName = 'widgets'
                ocr = []
                image = getOneActive('widgets', id)['root']
                state = getOneActive('widgets', id)['locked']

            try:
                if (len(children[0]) > 0):
                    for index in range(len(children[0])):
                        collection = db['segmentation']
                        cursor = collection.find({'_id': ObjectId(str(children[0][index]))})
                        for document in cursor:
                            childs.append(document['elementRoot'])
            except:
                print('New element doesnt have children')
            import json
            return (HttpResponse(json.dumps([image, elementName, ocr, childs, state]), content_type="application/json"))
        elif str(request.GET['name']) == 'updateStyle':
            state = request.GET
            id = state['elemId'][2:]
            fontColor = state['fontColor']
            fontSize = state['fontSize']
            fontFamily = state['fontFamily']
            borderColor = state['borderColor']
            borderRadius = state['borderRadius']
            bgcolor = state['bgcolor']
            textAlign = state['textAlign']
            location = ''
            id = state['elemId'][2:]
            element = state['element']
            textIndent = state['textIndent']
            type = state['type']
            name = state['currentName']
            tzz = datetime.now(pytz.timezone('Australia/Melbourne'))
            saveCurrent(str(tzz), id, location, fontColor, fontSize, fontFamily, borderColor, borderRadius, bgcolor,
                        textAlign, element, screenshotId, textIndent, type, name)
        elif str(request.GET['name']) == 'lockElement':
            lockid = request.GET['id'][2:]
            element = str(request.GET['element'])

            def checkCurrentLock(type):
                collection = db[type].find({'seg_id': lockid})
                state = []
                for col in collection:
                    state = col
                return state

            if search_new_element(lockid) != None:
                elementType = 'newElements'
                collection = db['newElements'].find({'class_id': lockid})
                state = []
                for col in collection:
                    state = col

                oldState = state['locked']
                newState = not state['locked']

                db[elementType].update({'class_id': lockid}, {'$set': {'locked': newState}})
                collection = db[elementType].find({'class_id': lockid})
                for col in collection:
                    eventelement = col

                insertEvent(eventelement['screenshot_id'], eventelement['class_id'], elementType, 'locked', oldState,
                            newState)

            else:
                if element == 'P':
                    elementType = 'paragraphs'

                elif element == 'A':
                    elementType = 'hyperLinks'

                elif element == 'INPUT':
                    elementType = 'textBoxes'

                elif element == 'TEXTAREA':
                    elementType = 'textArea'

                elif element == 'BUTTON':
                    elementType = 'buttons'

                elif element == 'DIV':
                    elementType = 'frames'

                elif element == 'IMG':
                    elementType = 'pictures'

                elif element == 'widgets':
                    elementType = 'widgets'

                else:
                    elementType = 'Error: ' + str(element)

                oldState = checkCurrentLock(elementType)['locked']
                newState = not checkCurrentLock(elementType)['locked']

                db[elementType].update({'seg_id': lockid}, {'$set': {'locked': newState}})
                collection = db[elementType].find({'seg_id': lockid})
                for col in collection:
                    eventelement = col

                insertEvent(eventelement['screenshot_id'], eventelement['seg_id'], elementType, 'locked', oldState,
                            newState)
        elif str(request.GET['name']) == 'getLocked':

            def getOneActive(type, id):
                return db[type].find_one({'seg_id': id, 'state': 'active'})

            def getOneActiveNew(id):
                return db['newElements'].find_one({'class_id':id, 'state':'active'})

            ids = []
            state = []

            col = db['newElements'].find({'screenshot_id':screenshotId})
            for doc in col:
                ids.append(str(doc['class_id']))

            collection = db['segmentation'].find({'screenshot_id': screenshotId})
            for document in collection:
                ids.append(str(document['_id']))

            for id in ids:
                if getOneActive('buttons', id) != None:
                    state.append([id, getOneActive('buttons', id)['locked']])
                elif getOneActive('frames', id) != None:
                    state.append([id, getOneActive('frames', id)['locked']])
                elif getOneActive('hyperLinks', id) != None:
                    state.append([id, getOneActive('hyperLinks', id)['locked']])
                elif getOneActive('paragraphs', id) != None:
                    state.append([id, getOneActive('paragraphs', id)['locked']])
                elif getOneActive('pictures', id) != None:
                    state.append([id, getOneActive('pictures', id)['locked']])
                elif getOneActive('textArea', id) != None:
                    state.append([id, getOneActive('textArea', id)['locked']])
                elif getOneActive('textBoxes', id) != None:
                    state.append([id, getOneActive('textBoxes', id)['locked']])
                elif getOneActiveNew(id) != None:
                    state.append([id,getOneActiveNew(id)['locked']])
            import json
            return (HttpResponse(json.dumps(state), content_type="application/json"))
        elif str(request.GET['name']) == 'initialState':
            req = request.GET
            secHeight = float(req['heightSection'])
            secWidth = float(req['widthSection'])
            widthLayouts = float(100)
            heightLayouts = float(175)
            device = ''

            request.session['height'] = str(secHeight)
            request.session['width'] = str(secWidth)
            try:
                screenshotId = getLatestScreenshot(userId)['screenshot_id']
                device = db.screenshots.find_one({'_id':ObjectId(screenshotId)})['device_type']
            except:
                screenshotId = ''

            saveMetrix(secHeight, secWidth, widthLayouts, heightLayouts, userId, screenshotId, projectName,device)
            '''
            if updateFSize(secHeight, secHeight, screenshotId, myfile) == 'success':
                print('DONE updating')
                # rewritePage(currentUser, myfile, screenshotId, screenshotName)
                import json
                return HttpResponse(json.dumps('1'), content_type="application/json")

            else:
                print('ERROR updating fSize')
            '''

            return html_render('customize/page2.html',currentUser, page, projectName, request, screenshotName, userId,screenshotId, layoutIsBeingTransferd,colorIsBeingTransferd,workflowBeingMagic,html,css, 'none')
        elif str(request.GET['name']) == 'fullscreen':
            backgroundColor = db.backgrounds.find_one({'screenshot_id': screenshotId})['background']
            import json
            return (HttpResponse(json.dumps(backgroundColor), content_type="application/json"))
        elif str(request.GET['name']) == 'getProjectName':
            print('get the project name')
            projects = db.projects.find_one({'user_id': userId})
            if projects == None:
                print('epmty project')
            else:
                projects = projects['projectName']

            import json
            return (HttpResponse(json.dumps(projects), content_type="application/json"))
        elif str(request.GET['name']) == 'getPages':
            print('time to get some pages')
            pages = []
            screenshotId = list(db.screenshots.find({'user_id': userId}))
            size = int(len(screenshotId)-1)
            project = db.projects.find_one({'user_id':userId,'projectName':projectName})
            while size >= 0:
                for screenid in project['screenshots']:
                    if str(screenshotId[size]['_id']) == str(screenid):
                        if str(screenshotId[size]['status']) != 'inactive':
                            pages.append(str(screenshotId[size]['screenName']))
                size -= 1
            import json
            return (HttpResponse(json.dumps(pages), content_type="application/json"))
        elif str(request.GET['name']) == 'checkState':
            print('time to check this state:')
            print(request.GET['name'])
            state = str(request.GET['state'])
            result = db.tempPage.find_one({'userId': userId})[state]
            print(result)
            import json
            return (HttpResponse(json.dumps(result), content_type="application/json"))
        elif str(request.GET['name']) == 'sendElement':
            print('Sending elemeny')
            element = request.GET
            id = element['id']
        elif str(request.GET['name']) == 'checkWorkflowState':
            print('Time to check Workflow state:')
            print(request.GET['name'])
            Wstate = str(request.GET['state'])
            try:
                result = db.tempPage.find_one({'userId': userId})[Wstate]
                print('Workflow status result')
                print(result)
            except:
                result = False
            import json
            return (HttpResponse(json.dumps(result), content_type="application/json"))
        elif str(request.GET['name']) == 'checkDeviceType':
            try:
                print('Time to check Device Type:')
                print(request.GET['name'])
                dstat = str(request.GET['state'])
                result = db.tempPage.find_one({'userId': userId})[dstat]
                print('Device Type status result')
                print(result)
                import json
                return (HttpResponse(json.dumps(result), content_type="application/json"))
            except:
                print('error CheckDeviceType')
        elif str(request.GET['name']) == 'getMode':
            arrayAD = []
            try:
                print('Time to get text-angle and text-direction Gradient:')
                getScreenId = db.tempPage.find_one({'projectName': projectName})['screenshot_id']
                getBI = db.backgrounds.find_one({'screenshot_id': getScreenId})
                for AD in getBI:
                    getAngle = getBI['text-angle']
                    getDirection = getBI['text-direction']
                    arrayAD.append(getAngle)
                    arrayAD.append(getDirection)
                    import json
                    return (HttpResponse(json.dumps(arrayAD), content_type="application/json"))
            except:
                print(arrayAD)
            import json
            return (HttpResponse(json.dumps(arrayAD), content_type="application/json"))
        elif str(request.GET['name']) == 'getBackgroundImageGradient':
            print('Time to get background-image attribute Gradient:')
            print(request.GET['name'])
            getScreenId = db.tempPage.find_one({'userId': userId})['screenshot_id']
            getBI = db.backgrounds.find_one({'screenshot_id': getScreenId})['background']
            if getBI is None:
                getBI = db.backgrounds.find_one({'screenshot_id': getScreenId})['background']

            lengthgetBI = len(getBI)
            import json
            return (HttpResponse(json.dumps(getBI), content_type="application/json"))
        elif str(request.GET['name']) == 'getHandlerBGC':
            print('Time to get handler BGC Gradient:')
            print(request.GET['name'])
            getScreenId = db.tempPage.find_one({'userId': userId})['screenshot_id']
            getBI = db.backgrounds.find_one({'screenshot_id': getScreenId})['setLastHandlerColor']
            if getBI is None:
                getBI = db.backgrounds.find_one({'screenshot_id': getScreenId})['setLastHandlerColor']

            lengthgetBI = len(getBI)
            import json
            return (HttpResponse(json.dumps(getBI), content_type="application/json"))
        elif str(request.GET['name']) == 'getUserActivity':
            print('Get User Activity')
            print(request.GET['name'])
            getUserActivity = db.tempPage.find_one({'userId': userId})['current_device_page']
            import json
            return (HttpResponse(json.dumps(getUserActivity), content_type="application/json"))
        elif str(request.GET['name']) == 'projectsLibraryDB':
            print('Time to get all projects for Library')
            pages = []
            allProject = list(db.projects.find({'user_id': userId, 'status': 'pending'}))
            size = int(len(allProject))
            recproject = db.projects.find_one({'user_id': userId, 'status': 'pending'})
            while size > 0:
                for screenid in recproject['projectName']:
                    inte = size - 1
                    if inte >= 0:
                        projectsN = str(allProject[inte]['projectName'])
                        pages.append({
                            'text': projectsN.title(),
                            'children': []
                        })
                    size -= 1
            import json
            return (HttpResponse(json.dumps(pages), content_type="application/json"))
        elif str(request.GET['name']) == 'getImgLibAllProj':
            print('Time to get all projects img from Library')
            try:
                curProj = str(request.GET['curProj'])
                imgPages = []
                imgName = []
                imgType = []
                imgSize = []
                imgLM = []
                print(curProj.lower())
                allProjectL = list(db.saveImageLibrary.find({'userId': userId, 'projectName': curProj.lower()}))
                sizeL = int(len(allProjectL))
                recproject = db.saveImageLibrary.find_one({'userId': userId, 'projectName': curProj.lower()})
            except:
                print('Not Found')
                print('Project not selected')
                imgPages = []
                imgName = []
                imgType = []
                imgSize = []
                imgLM = []
                allProjectL = list(db.saveImageLibrary.find({'userId': userId, 'projectName': projectName.lower()}))
                sizeL = int(len(allProjectL))
                recproject = db.saveImageLibrary.find_one({'userId': userId, 'projectName': projectName.lower()})
            while sizeL > 0:
                print('while size img')
                print(sizeL)
                for pathDir in recproject['path']:
                    inte = sizeL - 1
                    if inte >= 0:
                        projectsN = str(allProjectL[inte]['path'])
                        fileN = str(allProjectL[inte]['originalFileName'])
                        fileTL = str(allProjectL[inte]['fileType'])
                        fileSL = str(allProjectL[inte]['fileSize'])
                        fileLML = str(allProjectL[inte]['fileLastModified'])
                        imgPages.append('/static/dirty_static/users/' + projectsN)
                        imgName.append(fileN)
                        imgType.append(fileTL)
                        imgSize.append(fileSL)
                        imgLM.append(fileLML)
                    sizeL -= 1
            import json
            return (HttpResponse(json.dumps([imgPages, imgName, imgType, imgSize, imgLM]), content_type="application/json"))
        elif str(request.GET['name']) == 'getLastSelectedProj':
            print('Time to get last selected Project from Library')
            arrayCurProj = []
            try:
                lastSelectedproject = db.lastActivityLibrary.find_one({'user': userId})['currentlySelectedProj']
                print('Project Selected')
                print(str(lastSelectedproject))
                arrayCurProj.append(str(lastSelectedproject))
            except:
                print('Not Found')

            import json
            return (HttpResponse(json.dumps(arrayCurProj), content_type="application/json"))
        elif str(request.GET['name']) == 'widgetMove':

            device_type = db.tempPage.find_one({'userId': userId})['current_device_page']
            if device_type == 'MobileApp':
                screenH = 628.33
                screenW = 333.33
            elif device_type == 'TabletApp':
                screenH = 693.48
                screenW = 528.98
            else:
                screenH = db.tempPage.find_one({'userId': userId})['screenHeight']
                screenW = db.tempPage.find_one({'userId': userId})['screenWidth']
            elm = request.GET['id'][2:]
            widget_type = request.GET['widget']
            id_ele = db[str(widget_type)].find_one({'seg_id': str(elm)})['_id']

            py_0 = request.GET['top']
            px_0 = request.GET['left']

            height = request.GET['height']
            width = request.GET['width']

            if px_0 != '' and py_0 != '':
                py = py_0.split('p')
                px_y0 = py[0]
                px = px_0.split('p')
                px_x0 = px[0]
                y0_f = float(px_y0)
                x0_f = float(px_x0)

                if height != '' and width != '':
                    ph = height.split('p')
                    px_h = ph[0]
                    height_ = float(px_h)
                    pw = width.split('p')
                    px_w = pw[0]
                    width_ = float(px_w)

                    h_f = (float(height_) * 100) / float(screenH)
                    w_f = (float(width_) * 100) / float(screenW)

                    x0 = (x0_f * 100) / float(screenW)
                    y0 = (y0_f * 100) / float(screenH)
                    x1 = x0 + w_f
                    y1 = y0 + h_f

                    loc = {'x0': float(x0), 'y0': float(y0), 'x1': float(x1), 'y1': float(y1)}

                    updateLocation(widget_type, id_ele, loc)
                elif height != '' and width == '':
                    ph = height.split('p')
                    px_h = ph[0]
                    height_ = float(px_h)
                    h_f = (float(height_) * 100) / float(screenH)

                    location = db[str(widget_type)].find_one({'seg_id': str(elm)})['location']
                    x0_0 = float(location['x0'])
                    x1_0 = float(location['x1'])

                    aux_x = x1_0 - x0_0

                    x0 = (x0_f * 100) / float(screenW)
                    y0 = (y0_f * 100) / float(screenH)
                    x1 = x0 + aux_x
                    y1 = y0 + h_f

                    loc = {'x0': float(x0), 'y0': float(y0), 'x1': float(x1), 'y1': float(y1)}
                    updateLocation(widget_type, id_ele, loc)
                elif height == '' and width != '':
                    pw = width.split('p')
                    px_w = pw[0]
                    width_ = float(px_w)

                    w_f = (float(width_) * 100) / float(screenW)

                    location = db[str(widget_type)].find_one({'seg_id': str(elm)})['location']
                    y0_0 = float(location['y0'])
                    y1_0 = float(location["y1"])

                    aux_y = y1_0 - y0_0

                    x0 = (x0_f * 100) / float(screenW)
                    y0 = (y0_f * 100) / float(screenH)
                    x1 = x0 + w_f
                    y1 = y0 + aux_y

                    loc = {'x0': float(x0), 'y0': float(y0), 'x1': float(x1), 'y1': float(y1)}

                    updateLocation(widget_type, id_ele, loc)
                else:
                    x0 = (x0_f * 100) / float(screenW)
                    y0 = (y0_f * 100) / float(screenH)

                    location = db[str(widget_type)].find_one({'seg_id': str(elm)})['location']
                    x0_0 = float(location['x0'])
                    y0_0 = float(location['y0'])
                    x1_0 = float(location['x1'])
                    y1_0 = float(location["y1"])

                    aux_x = x1_0 - x0_0
                    aux_y = y1_0 - y0_0

                    x1 = x0 + aux_x
                    y1 = y0 + aux_y

                    loc = {'x0': float(x0), 'y0': float(y0), 'x1': float(x1), 'y1': float(y1)}

                    updateLocation(widget_type, id_ele, loc)
            elif px_0 != '' and py_0 == '' and width != '':
                px = px_0.split('p')
                px_x0 = px[0]
                x0_f = float(px_x0)

                pw = width.split('p')
                px_w = pw[0]
                width_ = float(px_w)
                w_f = (float(width_) * 100) / float(screenW)

                location = db[str(widget_type)].find_one({'seg_id': str(elm)})['location']
                y0_0 = float(location['y0'])
                y1_0 = float(location['y1'])

                x0 = (x0_f * 100) / float(screenW)
                x1 = x0 + w_f
                y0 = y0_0
                y1 = y1_0

                loc = {'x0': float(x0), 'y0': float(y0), 'x1': float(x1), 'y1': float(y1)}
                updateLocation(widget_type, id_ele, loc)
            elif px_0 == '' and py_0 != '' and height != '':
                py = py_0.split('p')
                px_y0 = py[0]
                y0_f = float(px_y0)

                ph = height.split('p')
                px_h = ph[0]
                height_ = float(px_h)
                h_f = (float(height_) * 100) / float(screenH)

                location = db[str(widget_type)].find_one({'seg_id': str(elm)})['location']
                x0_0 = float(location['x0'])
                x1_0 = float(location['x1'])

                x0 = x0_0
                y0 = (y0_f * 100) / float(screenH)
                x1 = x1_0
                y1 = y0 + h_f

                loc = {'x0': float(x0), 'y0': float(y0), 'x1': float(x1), 'y1': float(y1)}
                updateLocation(widget_type, id_ele, loc)
            elif px_0 == '' and py_0 == '':
                if width != '' and height == '':
                    pw = width.split('p')
                    px_w = pw[0]
                    width_ = float(px_w)

                    w_f = (float(width_) * 100) / float(screenW)

                    location = db[str(widget_type)].find_one({'seg_id': str(elm)})['location']
                    x0_0 = float(location['x0'])
                    y0_0 = float(location['y0'])
                    y1_0 = float(location["y1"])

                    x0 = x0_0
                    y0 = y0_0
                    x1 = x0_0 + w_f
                    y1 = y1_0

                    loc = {'x0': float(x0), 'y0': float(y0), 'x1': float(x1), 'y1': float(y1)}
                    updateLocation(widget_type, id_ele, loc)
                elif width == '' and height != '':
                    ph = height.split('p')
                    px_h = ph[0]
                    height_ = float(px_h)
                    h_f = (float(height_) * 100) / float(screenH)

                    location = db[str(widget_type)].find_one({'seg_id': str(elm)})['location']
                    x0_0 = float(location['x0'])
                    y0_0 = float(location['y0'])
                    x1_0 = float(location["x1"])

                    x0 = x0_0
                    y0 = y0_0
                    x1 = x1_0
                    y1 = y0_0 + h_f

                    loc = {'x0': float(x0), 'y0': float(y0), 'x1': float(x1), 'y1': float(y1)}
                    updateLocation(widget_type, id_ele, loc)
                else:
                    print('Firts time moving widgets')
            else:
                print('Firts time moving widgets')
        elif str(request.GET['name']) == 'getScreenOfSuggestionsL1':
            print('Time to get SCREEN for the suggestionsL1')
            allScreens = list(db.screenshots.find({'user_id': userId}))
            screenIdFromScript = db.tempSuggestions.find_one({'user_id': userId})['Level_1']
            size = int(len(allScreens))
            arraySuggestL1 = []
            while size > 0:
                for screenid in screenIdFromScript:
                    inte = size - 1
                    if inte >= 0:
                        print(str(allScreens[inte]['screenName']))
                        suggestionImgC = str(allScreens[inte]['screenName'])
                        suggestionImgCID = str(allScreens[inte]['_id'])
                        arraySuggestL1.append([suggestionImgC, suggestionImgCID])
                    size -= 1

            import json
            return (HttpResponse(json.dumps(arraySuggestL1), content_type="application/json"))
        elif str(request.GET['name']) == 'getScreenOfSuggestionsL2':
            print('Time to get SCREEN for the suggestionsL2')
            screenIdFromScript = db.tempSuggestions.find_one({'user_id': userId})
            arraySuggestL2 = []
            for screenid in screenIdFromScript['Level_2']:
                getProjectIDUser = screenIdFromScript['project_id']
                getCorrectScreens = db.screenshots.find_one({'_id': ObjectId(str(screenid[1]))})
                suggestionImgName = getCorrectScreens['screenName']
                arraySuggestL2.append([suggestionImgName, screenid[1]])

            import json
            return (HttpResponse(json.dumps(arraySuggestL2), content_type="application/json"))
        elif str(request.GET['name']) == 'getScreenOfSuggestionsL3':
            print('Time to get SCREEN for the suggestionsL3')
            allScreens = list(db.screenshots.find({'user_id': userId}))
            #  An error may happen here by me
            screenIdFromScript = db.tempSuggestions.find_one({'user_id': userId})['Level_3']
            size = int(len(screenIdFromScript))
            arraySuggestL3 = []
            while size > 0:
                for screenid in screenIdFromScript:
                    print('for sizeL3')
                    print(size - 1)
                    inte = size - 1
                    if inte >= 0:
                        suggestionImgC = str(allScreens[inte]['screenName'])
                        suggestionImgCID = str(allScreens[inte]['_id'])
                        arraySuggestL3.append([suggestionImgC, suggestionImgCID])
                    size -= 1

            import json
            return (HttpResponse(json.dumps(arraySuggestL3), content_type="application/json"))
        elif str(request.GET['name']) == 'getScreenOfSuggestionsL4':
            print('Time to get SCREEN for the suggestionsL4')
            allScreens = list(db.screenshots.find({'user_id': userId}))
            screenIdFromScript = db.tempSuggestions.find_one({'user_id': userId})['Level_4']
            size = int(len(screenIdFromScript))
            arraySuggestL4 = []
            while size > 0:
                for screenid in screenIdFromScript:
                    inte = size - 1
                    if inte >= 0:
                        suggestionImgC = str(allScreens[inte]['screenName'])
                        suggestionImgCID = str(allScreens[inte]['_id'])
                        arraySuggestL4.append([suggestionImgC, suggestionImgCID])
                    size -= 1

            import json
            return (HttpResponse(json.dumps(arraySuggestL4), content_type="application/json"))

        elif str(request.GET['name']) == 'saveMove':
            state = request.GET
            fontColor = state['fontColor']
            fontSize = state['fontSize']
            fontFamily = state['fontFamily']
            borderColor = state['borderColor']
            borderRadius = state['borderRadius']
            bgcolor = state['bgcolor']
            textAlign = state['textAlign']
            location = {'x0': state['x0'], 'y0': state['y0'], 'x1': state['x1'], 'y1': state['y1']}
            id = state['elemId'][2:]
            element = state['element']
            textIndent = state['textIndent']
            type = state['type']
            tzz = datetime.now(pytz.timezone('Australia/Melbourne'))
            saveCurrent(str(tzz), id, location, fontColor, fontSize, fontFamily, borderColor, borderRadius, bgcolor,
                        textAlign, element, screenshotId, textIndent, type, '')
        else:
            print('Else GET')


    if request.POST:
        print('POST')
        print(request.POST)

        if 'createNewProject' in request.POST:
            print('create new project')
            print(request.POST)
            project = request.POST['newProjectName']
            if (project == '' or project == None):
                print('Project Name cant be empty')
            else:
                date = datetime.now(pytz.timezone('Australia/Melbourne'))
                db.projects.insert({'projectName': project,
                                    'user_id': userId,
                                    'screenshots': [],
                                    'status': 'pending',
                                    'dateCreated': str(date),
                                    'comment': [],
                                    'groupCommentCode': 0,
                                    'updated_date': str(date)})
                db.tempPage.update({'userId': userId}, {'$set': {'projectName': project, 'screenshot_id': ''}})
                db.storageLibrary.update({'user_Id': userId}, {'$set': {'text': 'Project: ' + project.title()}})
                rewritePage(currentUser, None, None, None, None)
                return redirect('/index/', code=302)
        elif 'selectScreenshot' in request.POST:
            print('selected a screenshot')
            print(request.POST)
            screenshot = db.screenshots.find_one({'_id': ObjectId((str(request.POST['selectScreenshot'])))})
            screenshot_id = str(screenshot['_id'])
            print(screenshot_id)
            screenName = str(screenshot['image'][int(len(str(currentUser))) + 7:-4])
            screenshotName = screenName
            screenshotId = screenshot_id

            predictions = getPredictionByScreenShotId(
                screenshot['_id'])  # check all seg id of existing screenShot to get predictions
            myfile = screenshot['image']
            print('predictions')
            print(len(predictions))
            print(predictions)
            print('Re run metaPrgramming')
            print('myfile: ' + myfile)

            setScreenshot(userId, screenshotId, projectName)
            metaCustom(currentUser, myfile, screenshot_id, 'load')

            rewritePage(currentUser, myfile, screenshot_id, screenshotName, 'load')
            return html_render('customize/page2.html', currentUser, page, projectName, request, screenshotName, userId,
                               screenshotId, layoutIsBeingTransferd, colorIsBeingTransferd,workflowBeingMagic, html, css,suggestionImgC)
        elif 'deletePage' in request.POST:
            print('delete a page')
            page = str(request.POST['deletePage'])
            db.screenshots.update({'_id': ObjectId(page)}, {'$set': {'status': 'inactive'}})
            currentProject = db.tempPage.find_one({'userId': str(userId)})
            project = db.projects.find_one({'user_id':str(userId), 'projectName': str(currentProject['projectName'])})
            db.docRecognition.remove({'screenshot_id': page})
            delete_link(page)
            update_screen = []
            for s in project['screenshots']:
                if str(s) != str(page):
                    update_screen.append(s)
            db.projects.update({'_id': project['_id']}, {'$set': {'screenshots': update_screen}})
            try:
                print('deleting not the last one')
                curs = db.screenshots.find({'user_id': userId})
                for doc in curs:
                    if doc['status']!= 'inactive':
                        newScreen = doc
                setScreenshot(userId, str(newScreen['_id']), projectName)
                screenshotId = str(newScreen['_id'])
                screenshotName = str(newScreen['pageName'])
                myfile = str(newScreen['image'])
                rewritePage(currentUser, myfile, screenshotId, newScreen['pageName'], 'load')
            except:
                print('deleted the last one!')
                screenshotId = ''
                screenshotName = 'None at this point'
                page = 'None at this point'
                cache.clear()
                NoCachingMiddleware()
            db.tempPage.update({'userId': userId}, {'$set': {'screenshot_id': screenshotId}})
        elif 'changeElement' in request.POST:
            print('Changing Element')

            id = str(request.POST['id'])[2:]
            type = str(request.POST['type'])

            def findTypeDb(type):
                element = []
                collection = db[type].find({'seg_id': id, 'state': 'active'})
                for col in collection:
                    element.append(col)
                return element

            def findChildDb(type):
                elementChild = []
                collection = db[type].find({'level': {'child': id}, 'state': 'active'})
                for col in collection:
                    elementChild.append(col)
                return elementChild

            def existInDb(type, id):
                exists = []
                collection = db[type].find({'seg_id': id})
                for col in collection:
                    exists.append(col)
                return exists

            curType = ''
            if len(findTypeDb('buttons')) > 0:
                element = findTypeDb('buttons')
                elementChild = findChildDb('buttons')
                curType = 'buttons'
            if len(findTypeDb('frames')) > 0:
                element = findTypeDb('frames')
                elementChild = findChildDb('frames')
                curType = 'frames'
            if len(findTypeDb('hyperLinks')) > 0:
                element = findTypeDb('hyperLinks')
                elementChild = findChildDb('hyperLinks')
                curType = 'hyperLinks'
            if len(findTypeDb('paragraphs')) > 0:
                element = findTypeDb('paragraphs')
                elementChild = findChildDb('paragraphs')
                curType = 'paragraphs'
            if len(findTypeDb('pictures')) > 0:
                element = findTypeDb('pictures')
                elementChild = findChildDb('pictures')
                curType = 'pictures'
            if len(findTypeDb('textArea')) > 0:
                element = findTypeDb('textArea')
                elementChild = findChildDb('textArea')
                curType = 'textArea'
            if len(findTypeDb('textBoxes')) > 0:
                element = findTypeDb('textBoxes')
                elementChild = findChildDb('textBoxes')
                curType = 'textBoxes'

            for elm in element:
                db[curType].update({'seg_id': elm['seg_id']}, {'$set': {'state': 'inactive'}})
                if len(existInDb(type, elm['seg_id'])) > 0:
                    db[type].update({'seg_id': elm['seg_id']}, {'$set': {
                        'level': elm['level'],
                        'seg_id': elm['seg_id'],
                        'type': elm['type'],
                        'name': elm['name'],
                        'location': elm['location'],
                        'root': elm['root'],
                        'screenshot_id': elm['screenshot_id'],
                        'state': 'active',
                        'locked': elm['locked'],
                        'timeStamp': elm['timeStamp'],
                        'timeZone': elm['timeZone']}
                    })
                else:
                    db[type].insert({
                        'level': elm['level'],
                        'seg_id': elm['seg_id'],
                        'type': elm['type'],
                        'name': elm['name'],
                        'location': elm['location'],
                        'root': elm['root'],
                        'screenshot_id': elm['screenshot_id'],
                        'state': 'active',
                        'locked': elm['locked'],
                        'timeStamp': elm['timeStamp'],
                        'timeZone': elm['timeZone']
                    })

            for child in elementChild:
                if type == 'textArea' or type == 'textBoxes' or type == 'buttons':
                    db[curType].update({'seg_id': child['seg_id']}, {'$set': {'state': 'inactive'}})
                    if len(existInDb(type, child['seg_id'])) > 0:
                        db[type].update({'seg_id': child['seg_id']}, {'$set': {
                            'level': child['level'],
                            'seg_id': child['seg_id'],
                            'type': child['type'],
                            'name': child['name'],
                            'location': child['location'],
                            'root': child['root'],
                            'screenshot_id': child['screenshot_id'],
                            'state': 'active',
                            'locked': child['locked'],
                            'timeStamp': child['timeStamp'],
                            'timeZone': child['timeZone']}
                        })
                    else:
                        db[type].insert({
                            'level': child['level'],
                            'seg_id': child['seg_id'],
                            'type': child['type'],
                            'name': child['name'],
                            'location': child['location'],
                            'root': child['root'],
                            'screenshot_id': child['screenshot_id'],
                            'state': 'active',
                            'locked': child['locked'],
                            'timeStamp': child['timeStamp'],
                            'timeZone': child['timeZone']
                        })
                else:
                    db[curType].update({'seg_id': child['seg_id']}, {'$set': {'state': 'inactive'}})

            insertEvent(element[0]['screenshot_id'], element[0]['seg_id'], curType, 'changedElement', curType, type)


            screenshotId = element[0]['screenshot_id']

            rewritePage(currentUser, myfile, screenshotId, screenshotName, 'load')
        elif 'pageName' in request.POST:
            pageName = request.POST['pageName']
            pageId = request.POST['pageId']
            update_page_name(pageName, pageId)

            print(str(screenshotId))
        elif 'saveLayout' in request.POST:
            save_layouts()
        elif 'updateScreenshotOrder' in request.POST:
            print('rearrange the screenshot order')
            order = request.POST['updateScreenshotOrder']
            import json
            result = json.loads(order)
            db.projects.update({'user_id': userId, 'projectName': projectName}, {'$set':{'screenshots':result}})
        elif 'changedStyle' in request.POST:
            print('Style Style Style Style')
            id = request.POST['changedStyle'][2:]
            element = request.POST['tagname']
            backgroundColor = request.POST['background-color']
            zIndex = request.POST['z-index']
            textIndent= request.POST['text-indent']
            borderColor = request.POST['bordercolor']
            borderRadius = request.POST['borderradius']
            textAlign = request.POST['text-align']
            fSize = request.POST['fontSize']
            barChartBar = request.POST['barChartBar']

            if barChartBar == '' or[]:
                barChartBar = '0'
            else:
                print('its gone to else')

            barChartBG = request.POST['barChartBG']

            # set maximum z-index
            if zIndex >= '998':
                zIndex = '998'

            db.styles.update({'segmentation_id': id}, {'$set': {'fontSize': fSize}})

            if search_new_element(id) != None:
                print('update the style of new element')
                style = 'newStyle'
                old = db[style].find_one({'element_id': id})
            else:
                print('update the style of generate element')
                style = 'styles'
                old = db[style].find_one({'segmentation_id': id})

            if element == 'P':
                # if search_new_element(deleteId) != None:
                elementType = 'paragraphs'
            elif element == 'A':
                elementType = 'hyperLinks'

            elif element == 'INPUT':
                elementType = 'textBoxes'

            elif element == 'TEXTAREA':
                elementType = 'textArea'

            elif element == 'BUTTON':
                elementType = 'buttons'

            elif element == 'DIV':
                elementType = 'frames'

            elif element == 'IMG':
                elementType = 'pictures'
            else:
                elementType = 'Error: ' + str(element)
                print(elementType)

            oldEvent = {'borderColor': old['borderColor'], 'borderRadius': old['borderRadius'], 'bgcolor': old['bgcolor'],
                             'textAlign': old['textAlign'], 'textIndent': old['textIndent'], 'zIndex': old['zIndex'],
                        'fontSize': old['fontSize']}
            newEvent = {'borderColor': borderColor, 'borderRadius': borderRadius, 'bgcolor': backgroundColor,
                        'textAlign': textAlign, 'textIndent': textIndent, 'zIndex': zIndex, 'fontSize': fSize
                        }

            insertEvent(screenshotId, id, elementType, 'changedStyle', oldEvent, newEvent)

            if style == 'newStyle':
                db[style].update({'element_id': id}, {'$set': {
                    'borderColor': borderColor, 'borderRadius': borderRadius,
                    'bgcolor': backgroundColor, 'textAlign': textAlign,
                    'textIndent': textIndent, 'zIndex': zIndex, 'barChartBar': barChartBar, 'barChartBG': barChartBG
                }})
            elif style == 'styles':
                db[style].update({'segmentation_id': id}, {'$set': {
                    'borderColor': borderColor, 'borderRadius': borderRadius,
                    'bgcolor': backgroundColor, 'textAlign': textAlign,
                    'textIndent': textIndent, 'zIndex': zIndex, 'barChartBar': barChartBar, 'barChartBG': barChartBG,
                    'fontSize': fSize
                }})

            viSize = db.styles.find_one({'segmentation_id': id})
            print("after change")
            print(viSize['fontSize'])
        elif 'colorsAD' in request.POST:
            import json
            print("request.POST in colorsAD")
            print(request.POST)
            # need Master screenshot colors
            masterscreenname = request.POST['mid']
            # need a list of screens to be changed
            obj = request.POST['screensTD']
            listscreen = json.loads(obj)
            color = request.POST['color']
            style = request.POST['style']
            if color == 'true' and style == 'False':
                status = 2
            elif color == 'False' and style == 'true':
                status = 1
            else:
                status = 3

            screens = propertyTransfer(userId,masterscreenname,listscreen,status)
            for s in screens:
                sc = db.screenshots.find_one({'_id':ObjectId(s)})
                name = sc['pageName']
                file = sc['image']
                if s != str(screenshotId):
                    metaCustom(currentUser, file, s, 'load')
            rewritePage(currentUser, myfile, screenshotId, screenshotName, 'load')

        elif 'profilePictureimg' in request.FILES:
            print('OMG NEW PICTURE #SELFIE')
            myfile = request.FILES['profilePictureimg']
            fs = FileSystemStorage()
            fs.delete(str(currentUser) + '/profilePictures/pic.jpg')
            filename = fs.save(
                str(currentUser) + '/profilePictures/pic.jpg',
                myfile)
            db['user'].update({'username': request.POST['profilePicture']}, {'$set': {'profilePicture': str(filename)}})
        elif 'newImage' in request.FILES:
            myfile = request.FILES['newImage']
            print('uuumyfile: ' + str(myfile))

            fs = FileSystemStorage()
            filename = fs.save(
                str(currentUser) + '/pages/' + screenshotName + '/images/' + myfile.name,
                myfile)
            print(filename)
            addElement(currentUser, filename, screenshotId, str(7))

            file = str(getScreenshotName('screenshots', userId, str(screenshotId)))

            rewritePage(currentUser, file, screenshotId, screenshotName, 'load')
        elif 'filename' in request.POST:
            scname = request.POST['filename']
            myfile = request.FILES['myfile']
            print('myfile path')
            print(myfile)
            fs = FileSystemStorage()
            print('image check!')
            import imghdr
            image_type = imghdr.what(myfile)
            if not image_type:
                msg = 'This file is not supported. Please upload only .JPG.'
                return render(request, 'customize/page2.html', {
                    'msg': msg,
                    'pageArray': fillPageArray(userId, projectName),
                    'projectName': projectName.capitalize(),
                    'screen': screenshotName,
                    'currentPage': getCurrentScreenName(screenshotId),
                    'colorTransfer': getColorTransferHtml(currentUser, screenshotName),
                    'screenHTML': getProjectPage(screenshotName, currentUser),
                    'userName': currentUser,
                    'currentProfilePic': getUserPicture(currentUser),
                    'colorTransferUploadIMG': str(currentUser) + '/pages/' + str(
                        screenshotName) + '/colorTransfer/styles/colorTransfer.jpg',
                    'layoutTransfer': getLayoutHtml(currentUser, screenshotName),
                    'colorPalette': getColorPalette(screenshotId),
                    'layoutIsBeingTransferd': layoutIsBeingTransferd,
                    'colorIsBeingTransferd': colorIsBeingTransferd,
                    'workflowBeingMagic': workflowBeingMagic,
                    'projects': getProjects(userId),
                    'projectsHTML': html,
                    'projectsCSS': css
                })
            else:
                print(image_type)

            projectName = getLatestScreenshot(userId)['projectName']
            print('Project name: ' + str(projectName))
            filename = fs.save(str(currentUser) + '/pages/' + projectName + '/' + myfile.name, myfile)
            print('filename:')
            print(str(filename))
            name = filename[int(len(str(currentUser)) + 7):-4]

            if user(url=filename, user_id=userId, name=name, scname=scname):
                print('lets start segmenting ' + str(filename))
                temp = db.tempPage.find_one({'userId': userId})
                if temp != None:
                    global tensorflow_model_global
                    tensorflow_model_ = tensorflow_model_global
                    if len(tensorflow_model_) == 0:
                        coco_model = initiateCocoDetection()
                        tensorflow_model = initiateTensorflowDetection()
                        global coco_model_global
                        coco_model_global = coco_model
                        tensorflow_model_global = tensorflow_model
                        db.tempPage.update({'userId': userId}, {'$set': {'maskRCNNstate': True}})
                    else:
                        coco_model = coco_model_global
                        tensorflow_model = tensorflow_model_global
                        print('some coco model shit ', coco_model)
                        print('some cnn model shit', tensorflow_model)
                run(filename, coco_model, tensorflow_model, currentUser, projectName)
                screenshotId = getLatestScreenshot(userId)['screenshot_id']

                screenshotsId = db.projects.find_one({'user_id': userId, 'projectName': projectName})['screenshots']

                screenshotsId.insert(0, screenshotId)

                db.projects.update({'user_id': userId, 'projectName': projectName},
                                   {'$set': {'screenshots': screenshotsId}})

                page = str(getScreenshotName('screenshots', userId, str(screenshotId))[
                           int(len(str(currentUser))) + 7:])
                screenshotName = str(getScreenshotName('screenshots', userId, str(screenshotId))[
                                     int(len(str(currentUser))) + 7:-4])
                myfile = str(getScreenshotName('screenshots', userId, str(screenshotId)))
                print('check here after lunch: ' + str(screenshotId) + str(page) + str(screenshotName))
                rewritePage(currentUser, myfile, screenshotId, screenshotName, 'save')
            else:
                print('lol error')
        elif 'resourceFilename' in request.POST:
            myfileLib = request.FILES['myResourcefile']
            selectedProject = request.POST['projectuploadResource']
            fileTypeL = request.POST['typeLIB']
            fileSizeL = request.POST['sizeLIB']
            fileLModifiedL = request.POST['lastModifiedLIB']
            print('myfile path library')
            print(myfileLib)
            print(selectedProject.lower())
            fs = FileSystemStorage()
            print('image check in Lib!')
            print('Project name: ' + str(selectedProject.lower()))
            filename = fs.save(str(currentUser) + '/library/' + selectedProject.lower() + '/' + myfileLib.name, myfileLib)
            print('filename:')
            print(str(filename))
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
        else:
                print('Checkpoint 2')
                if str(request.POST['name']) == 'search':
                    print('print Request Post')
                    print(request.POST)
                    data = {}
                    key = str(request.POST['key'])
                    data['scr'] = searchEnquiry(key.lower())[0]
                    data['wid'] = searchEnquiry(key.lower())[1]

                    import json
                    return HttpResponse(json.dumps(data), content_type="application/json")
                elif str(request.POST['name']) == 'addElement':
                    req = request.POST
                    action = req['value']
                    print('action: ' + str(action))
                    # number 8 in the following if condition is used only for the widget
                    if str(action) == '8':
                        myfile1 = str(req['path'])
                        myfile2 = myfile1
                        addElement(currentUser, myfile2, screenshotId, str(action))
                        rewritePage(currentUser, myfile, screenshotId, screenshotName, 'load')
                    else:
                        print(myfile)
                        addElement(currentUser, myfile, screenshotId, str(action))
                        rewritePage(currentUser, myfile, screenshotId, screenshotName, 'load')
                    return html_render('customize/page2.html', currentUser, page, projectName, request, screenshotName,
                                       userId, screenshotId, layoutIsBeingTransferd, colorIsBeingTransferd,
                                       workflowBeingMagic, html, css, suggestionImgC)
                elif str(request.POST['name']) == 'approve':
                    print('print Request Post')
                    print(request.POST)
                    item_requested = request.POST.getlist('item_ticked[]')
                elif str(request.POST['name']) == 'undo':
                    index = request.POST['index']
                    print('undo: '+ str(index))
                    event = undoEvent(screenshotId, index)

                    wholeEvent = event['oldEvent']
                    print('whole')
                    print(wholeEvent)
                    key = ''
                    for i in wholeEvent:
                        key = str(i)
                    print(event['oldEvent'][key])

                    if 'changedElement' in event['oldEvent']:
                        print('changed')
                        db[event['oldEvent']['changedElement']].update({'seg_id': event['seg_id']},
                                                                       {'$set': {
                                                                           'state': 'active'
                                                                       }})
                        db[event['newEvent']['changedElement']].update({'seg_id': event['seg_id']},
                                                                       {'$set': {
                                                                           'state': 'inactive'
                                                                       }})
                    elif 'deletedElement' in event['oldEvent']:
                        print('delete')
                        if event['collection'] == 'newElements':
                            db[event['collection']].update({'class_id': event['seg_id']},
                                                       {'$set': {
                                                           'state': event['oldEvent']['deletedElement']
                                                       }})
                        else:
                            db[event['collection']].update({'seg_id': event['seg_id']},
                                                           {'$set': {
                                                               'state': event['oldEvent']['deletedElement']
                                                           }})
                    elif 'changedStyle' in event['oldEvent']:
                        print('I am here look at me!')
                        db['styles'].update({'segmentation_id': event['seg_id']},
                                            {'$set':{
                                                'borderColor': event['oldEvent']['changedStyle']['borderColor'],
                                                'borderRadius': event['oldEvent']['changedStyle']['borderRadius'],
                                                'bgcolor': event['oldEvent']['changedStyle']['bgcolor'],
                                                'textAlign': event['oldEvent']['changedStyle']['textAlign'],
                                                'textIndent': event['oldEvent']['changedStyle']['textIndent'],
                                                'zIndex': event['oldEvent']['changedStyle']['zIndex']
                                            }})
                    elif 'background-color' in event['oldEvent']:
                        db['backgrounds'].update({'screenshot_id': event['screenshot_id']},
                                                 {'$set':{'background':event['oldEvent']['background']}})
                    elif 'fontSize' in event['oldEvent'] or 'fontFamily' in event['oldEvent'] or \
                                    'fontColor' in event['oldEvent'] or 'borderColor' in event['oldEvent'] or \
                                    'borderRadius' in event['oldEvent'] or 'bgcolor' in event['oldEvent'] or \
                                    'textAlign' in event['oldEvent'] or 'textIndent' in event['oldEvent']:
                        print('ELSE!!')
                        print(key)
                        print(str(event))
                        db['styles'].update({'segmentation_id': event['seg_id']},
                                            {'$set': {
                                                key: event['oldEvent'][key]
                                            }})
                    elif 'fontSize' not in event['oldEvent'] or 'fontFamily' not in event['oldEvent'] or \
                                    'fontColor' not in event['oldEvent'] or 'borderColor' not in event['oldEvent'] or \
                                    'borderRadius' not in event['oldEvent'] or 'bgcolor' not in event['oldEvent'] or \
                                    'textAlign' not in event['oldEvent'] or 'textIndent' not in event['oldEvent']:
                        print('not in')
                        db[event['collection']].update({'seg_id': event['seg_id']},
                                                       {'$set': {
                                                           key: event['oldEvent'][key]
                                                       }})
                    import json
                    return (HttpResponse(json.dumps([event['seg_id'],wholeEvent]), content_type="application/json"))
                elif 'updateBackground' == str(request.POST['name']):
                    print('Backgroud')
                    backgroundColor = request.POST['Color']
                    oldEvent = db.backgrounds.find_one({'screenshot_id': screenshotId})['background']
                    newEvent = (backgroundColor)
                    insertEvent(screenshotId, 'n.a.', 'backgrounds', 'background-color', oldEvent, newEvent,)

                    db['backgrounds'].update({'screenshot_id': screenshotId}, {'$set': {
                        'background': newEvent
                    }})
                elif 'updateBackgroundG' == str(request.POST['name']):
                    print('Backgroud')
                    backgroundColor = request.POST['Color']
                    oldEvent = db.backgrounds.find_one({'screenshot_id': screenshotId})['background']
                    newEvent = (backgroundColor)
                    # catch all instance of backgroung-image attribute
                    printSplitResult = newEvent.split(',')[0]
                    printAngle = newEvent.split('(')[0]
                    printDirection = printSplitResult.split('(')[1]
                    insertEvent(screenshotId, 'n.a.', 'backgrounds', 'background-color', oldEvent, newEvent,)
                    db['backgrounds'].update({'screenshot_id': screenshotId}, {'$set': {'background': newEvent,
                                                                                        'text-angle': printAngle,
                                                                                        'text-direction': printDirection
                    }})
                elif 'storeHandlerColor' == str(request.POST['name']):
                    print('Set Last Handler Color')
                    backgroundColor = request.POST['color']
                    print(backgroundColor)
                    db['backgrounds'].update({'screenshot_id': screenshotId}, {'$set': {'setLastHandlerColor': backgroundColor,
                                                                                        'background': backgroundColor}})
                elif str(request.POST['name']) == 'redo':
                    index = request.POST['index']
                    print('redo: '+ str(index))
                    event = redoEvent(screenshotId, index)
                    wholeEvent = event['newEvent']
                    print('whole')
                    print(wholeEvent)
                    key = ''
                    for i in wholeEvent:
                        key = str(i)
                    print(event['newEvent'][key])

                    if 'changedElement' in event['newEvent']:
                        print('changed')
                        db[event['newEvent']['changedElement']].update({'seg_id': event['seg_id']},
                                                                       {'$set': {
                                                                           'state': 'active'
                                                                       }})
                        db[event['oldEvent']['changedElement']].update({'seg_id': event['seg_id']},
                                                                       {'$set': {
                                                                           'state': 'inactive'
                                                                       }})
                    elif 'deletedElement' in event['newEvent']:
                        print('delete')
                        if event['collection'] == 'newElements':
                            db[event['collection']].update({'class_id': event['seg_id']},
                                                           {'$set': {
                                                               'state': event['newEvent']['deletedElement']
                                                           }})
                        else:
                            db[event['collection']].update({'seg_id': event['seg_id']},
                                                           {'$set': {
                                                               'state': event['newEvent']['deletedElement']
                                                           }})
                    elif 'changedStyle' in event['newEvent']:
                        db['styles'].update({'segmentation_id': event['seg_id']},
                                            {'$set':{
                                                'borderColor': event['newEvent']['changedStyle']['borderColor'],
                                                'borderRadius': event['newEvent']['changedStyle']['borderRadius'],
                                                'bgcolor': event['newEvent']['changedStyle']['bgcolor'],
                                                'textAlign': event['newEvent']['changedStyle']['textAlign'],
                                                'textIndent': event['newEvent']['changedStyle']['textIndent'],
                                                'zIndex': event['newEvent']['changedStyle']['zIndex']
                                            }})
                    elif 'background-color' in event['newEvent']:
                        db['backgrounds'].update({'screenshot_id': event['screenshot_id']},
                                                 {'$set':{'background':event['newEvent']['background']}})
                    elif 'fontSize' in event['newEvent'] or 'fontFamily' in event['newEvent'] or \
                                    'fontColor' in event['newEvent'] or 'borderColor' in event['newEvent'] or \
                                    'borderRadius' in event['newEvent'] or 'bgcolor' in event['newEvent'] or \
                                    'textAlign' in event['newEvent'] or 'textIndent' in event['newEvent']:
                        print('ELSE!!')
                        print(key)
                        print(str(event))
                        db['styles'].update({'segmentation_id': event['seg_id']},
                                            {'$set': {
                                                key: event['newEvent'][key]
                                            }})
                    elif 'fontSize' not in event['newEvent'] or 'fontFamily' not in event['newEvent'] or \
                                    'fontColor' not in event['newEvent'] or 'borderColor' not in event['newEvent'] or \
                                    'borderRadius' not in event['newEvent'] or 'bgcolor' not in event['newEvent'] or \
                                    'textAlign' not in event['newEvent'] or 'textIndent' not in event['newEvent']:
                        print('not in')
                        db[event['collection']].update({'seg_id': event['seg_id']},
                                                       {'$set': {
                                                           key: event['newEvent'][key]
                                                       }})

                    import json
                    return (HttpResponse(json.dumps([event['seg_id'],wholeEvent]), content_type="application/json"))
                elif str(request.POST['name']) == 'updateURL':
                    print('update the url')
                    print(request.POST)
                    srcid = request.POST['id']
                    srcid = str(srcid[2:])
                    link = str(request.POST['href'])
                    element = db.styles.find_one({'segmentation_id': srcid})
                    if element is not None:
                        db.styles.update({'segmentation_id': srcid}, {'$set': {'link': link}})
                    else:
                        date = datetime.now(pytz.timezone('Australia/Melbourne'))
                        db.styles.insert(
                            {
                                'segmentation_id': srcid,
                                'fontFamily': 'Helvetica, Arial, sans-serif',
                                'fontSize': '',
                                'fontColor': '',
                                'borderColor': 'transparent',
                                'background-gradient': '',
                                'borderRadius': '',
                                'bgcolor': '',
                                'boxShadow': '',
                                'textAlign': '',
                                'textIndent': 'center',
                                'textShadow': '',
                                'link': link,
                                'linkColor': '',
                                'animationType': '',
                                'zIndex': 'auto',
                                'timeStamp': str(date),
                                'timeZone': 'Australia/Melbourne'
                            }
                        )

                    # if element is linked from other than active screen
                    pro = db.projects.find_one({'projectName': projectName, 'user_id': str(userId)})
                    if pro != None:
                        screens = pro['screenshots']
                        for s in screens:
                            print('Testing screenshot id')
                            print(screenshotId)
                            print(s)
                            if s != screenshotId:
                                sc = db.screenshots.find_one({'_id': ObjectId(str(s))})
                                name = sc['pageName']
                                file = sc['image']
                                metaCustom(currentUser, file, s, 'load')
                    # reload the metacustom
                    rewritePage(currentUser, myfile, screenshotId, screenshotName, 'load')
                    return html_render('customize/page2.html', currentUser, page, projectName, request, screenshotName,
                                       userId, screenshotId, layoutIsBeingTransferd, colorIsBeingTransferd,
                                       workflowBeingMagic, html, css,suggestionImgC)
                elif str(request.POST['name']) == 'deleteURL':
                    print("delete URL")
                    print(request.POST)
                    src_id = request.POST['srcid']
                    target_sc = request.POST['target']
                    element = db.styles.find_one({'segmentation_id': src_id})
                    if element is not None:
                        db.styles.update({'segmentation_id': src_id}, {'$set': {'link': target_sc}})
                    else:
                        db.newStyle.update({'element_id': src_id}, {'$set': {'link': target_sc}})

                    # if element is linked from other than active screen
                    pro = db.projects.find_one({'projectName': projectName, 'user_id': str(userId)})
                    if pro != None:
                        screens = pro['screenshots']
                        for s in screens:
                            if s != screenshotId:
                                sc = db.screenshots.find_one({'_id': ObjectId(str(s))})
                                name = sc['pageName']
                                file = sc['image']
                                metaCustom(currentUser, file, s, 'load')
                    # reload the metacustom
                    rewritePage(currentUser, myfile, screenshotId, screenshotName, 'load')
                    return html_render('customize/page2.html', currentUser, page, projectName, request, screenshotName,
                                       userId, screenshotId, layoutIsBeingTransferd, colorIsBeingTransferd,
                                       workflowBeingMagic, html, css,suggestionImgC)
                elif str(request.POST['name']) == 'goToPage':
                    print('Go to Page')
                    name = request.POST['page']
                    print(name)
                    if name == '' or name is None:
                        print('name is empty')
                    else:
                        screenshotId = str(db.screenshots.find_one({'user_id': userId, 'pageName': name})['_id'])
                        setScreenshot(userId, screenshotId, projectName)

                    rewritePage(currentUser, myfile, screenshotId, screenshotName, 'load')
                elif str(request.POST['name']) == 'setProjectName':
                    print('set a project name')
                    project = request.POST['project']
                    date = datetime.now(pytz.timezone('Australia/Melbourne'))
                    db.projects.insert({'projectName': project,
                                        'user_id': userId,
                                        'screenshots': [],
                                        'status': 'pending',
                                        'dateCreated': str(date),
                                        'comment': [],
                                        'groupCommentCode': 0,
                                        'updated_date': str(date)
                                        })
                    projectName = project
                    db.tempPage.update({'userId': userId}, {'$set': {'projectName': projectName}})
                    allProject = list(db.projects.find())
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
                    print('ffffffffffffff')
                elif str(request.POST['name']) == 'widgetMove':

                    device_type = db.tempPage.find_one({'userId':userId})['current_device_page']
                    if device_type == 'MobileApp':
                        screenH = 628.33
                        screenW = 333.33
                    elif device_type == 'TabletApp':
                        screenH = 693.48
                        screenW = 528.98
                    else:
                        screenH = db.tempPage.find_one({'userId': userId})['screenHeight']
                        screenW = db.tempPage.find_one({'userId':userId})['screenWidth']
                    elm = request.POST['id'][2:]
                    widget_type = request.POST['widget']
                    collection = widget_type
                    print('Moving')
                    print(elm)
                    print(widget_type)
                    try:
                        id_ele = db[str(collection)].find_one({'seg_id':str(elm)})['_id']
                    except:
                        id_ele = db.newElements.find_one({'class_id':str(elm)})['_id']
                        collection = 'newElements'

                    py_0 = request.POST['top']
                    px_0 = request.POST['left']

                    height = request.POST['height']
                    width = request.POST['width']

                    if px_0 != '' and py_0 != '':
                        py = py_0.split('p')
                        px_y0 = py[0]
                        px = px_0.split('p')
                        px_x0 = px[0]
                        y0_f = float(px_y0)
                        x0_f = float(px_x0)

                        if height != '' and width != '':
                            ph = height.split('p')
                            px_h = ph[0]
                            height_ = float(px_h)
                            pw = width.split('p')
                            px_w = pw[0]
                            width_ = float(px_w)

                            h_f = (float(height_)*100)/float(screenH)
                            w_f = (float(width_)*100)/float(screenW)

                            x0 = (x0_f*100)/float(screenW)
                            y0 = (y0_f*100)/float(screenH)
                            x1 = x0 + w_f
                            y1 = y0 + h_f

                            loc = {'x0': float(x0), 'y0': float(y0), 'x1': float(x1), 'y1': float(y1)}

                            updateLocation(collection, id_ele, loc)
                        elif height != '' and width == '':
                            ph = height.split('p')
                            px_h = ph[0]
                            height_ = float(px_h)
                            h_f = (float(height_) * 100) / float(screenH)

                            location = db[str(widget_type)].find_one({'seg_id': str(elm)})['location']
                            x0_0 = float(location['x0'])
                            x1_0 = float(location['x1'])

                            aux_x = x1_0 - x0_0

                            x0 = (x0_f * 100) / float(screenW)
                            y0 = (y0_f * 100) / float(screenH)
                            x1 = x0 + aux_x
                            y1 = y0 + h_f

                            loc = {'x0': float(x0), 'y0': float(y0), 'x1': float(x1), 'y1': float(y1)}
                            updateLocation(collection, id_ele, loc)
                        elif height == '' and width != '':
                            pw = width.split('p')
                            px_w = pw[0]
                            width_ = float(px_w)

                            w_f = (float(width_) * 100) / float(screenW)

                            location = db[str(widget_type)].find_one({'seg_id': str(elm)})['location']
                            y0_0 = float(location['y0'])
                            y1_0 = float(location["y1"])

                            aux_y = y1_0 - y0_0

                            x0 = (x0_f * 100) / float(screenW)
                            y0 = (y0_f * 100) / float(screenH)
                            x1 = x0 + w_f
                            y1 = y0 + aux_y

                            loc = {'x0': float(x0), 'y0': float(y0), 'x1': float(x1), 'y1': float(y1)}

                            updateLocation(collection, id_ele, loc)
                        else:
                            x0 = (x0_f * 100) / float(screenW)
                            y0 = (y0_f * 100) / float(screenH)

                            location = db[str(widget_type)].find_one({'seg_id': str(elm)})['location']
                            x0_0 = float(location['x0'])
                            y0_0 = float(location['y0'])
                            x1_0 = float(location['x1'])
                            y1_0 = float(location["y1"])


                            aux_x = x1_0 - x0_0
                            aux_y = y1_0 - y0_0

                            x1 = x0 + aux_x
                            y1 = y0 + aux_y

                            loc = {'x0': float(x0), 'y0': float(y0), 'x1': float(x1), 'y1': float(y1)}

                            updateLocation(collection, id_ele, loc)
                    elif px_0 != '' and py_0 == '' and width != '':
                        px = px_0.split('p')
                        px_x0 = px[0]
                        x0_f = float(px_x0)

                        pw = width.split('p')
                        px_w = pw[0]
                        width_ = float(px_w)
                        w_f = (float(width_) * 100) / float(screenW)

                        location = db[str(widget_type)].find_one({'seg_id': str(elm)})['location']
                        y0_0 = float(location['y0'])
                        y1_0 = float(location['y1'])

                        x0 = (x0_f * 100) / float(screenW)
                        x1 = x0 + w_f
                        y0 = y0_0
                        y1 = y1_0

                        loc = {'x0': float(x0), 'y0': float(y0), 'x1': float(x1), 'y1': float(y1)}
                        updateLocation(collection, id_ele, loc)
                    elif px_0 == '' and py_0 != '' and height != '':
                        py = py_0.split('p')
                        px_y0 = py[0]
                        y0_f = float(px_y0)

                        ph = height.split('p')
                        px_h = ph[0]
                        height_ = float(px_h)
                        h_f = (float(height_) * 100) / float(screenH)

                        location = db[str(widget_type)].find_one({'seg_id': str(elm)})['location']
                        x0_0 = float(location['x0'])
                        x1_0 = float(location['x1'])

                        x0 = x0_0
                        y0 = (y0_f * 100) / float(screenH)
                        x1 = x1_0
                        y1 = y0 + h_f

                        loc = {'x0': float(x0), 'y0': float(y0), 'x1': float(x1), 'y1': float(y1)}
                        updateLocation(collection, id_ele, loc)
                    elif px_0 == '' and py_0 == '':
                        if width != '' and height == '':
                            pw = width.split('p')
                            px_w = pw[0]
                            width_ = float(px_w)

                            w_f = (float(width_) * 100) / float(screenW)

                            location = db[str(widget_type)].find_one({'seg_id': str(elm)})['location']
                            x0_0 = float(location['x0'])
                            y0_0 = float(location['y0'])
                            y1_0 = float(location["y1"])

                            x0 = x0_0
                            y0 = y0_0
                            x1 = x0_0 + w_f
                            y1 = y1_0

                            loc = {'x0': float(x0), 'y0': float(y0), 'x1': float(x1), 'y1': float(y1)}
                            updateLocation(collection, id_ele, loc)
                        elif width == '' and height != '':
                            ph = height.split('p')
                            px_h = ph[0]
                            height_ = float(px_h)
                            h_f = (float(height_) * 100) / float(screenH)

                            location = db[str(widget_type)].find_one({'seg_id': str(elm)})['location']
                            x0_0 = float(location['x0'])
                            y0_0 = float(location['y0'])
                            x1_0 = float(location["x1"])

                            x0 = x0_0
                            y0 = y0_0
                            x1 = x1_0
                            y1 = y0_0 + h_f

                            loc = {'x0': float(x0), 'y0': float(y0), 'x1': float(x1), 'y1': float(y1)}
                            updateLocation(collection, id_ele, loc)
                        else:
                            print('Firts time moving widgets')
                    else:
                        print('Firts time moving widgets')
                    rewritePage(currentUser, myfile, screenshotId, screenshotName, 'load')
                elif request.POST['name'] == "search":
                    data = {}
                    key = str(request.POST['key'])
                    data['scr'] = searchEnquiry(key.lower())[0]
                    data['wid'] = searchEnquiry(key.lower())[1]
                    import json
                    return HttpResponse(json.dumps(data), content_type="application/json")
                elif request.POST['name'] == "approve":
                    item_requested = request.POST.getlist('item_ticked[]')
                    print(item_requested)
                elif request.POST['name'] == "device_Page":
                    try:
                        print('EYYYYYYYYYYYY')
                        device_page = request.POST['device']
                        db.tempPage.update({'userId': userId}, {'$set': {'current_device_page': str(device_page)}})
                        db.screenshots.update({'_id': ObjectId(screenshotId)},{'$set': {'device_type': str(device_page)}})
                    except:
                        print('error device_Page')
            # except:
            #     print('method post')
            #     print(request.POST)
            #     print("request.FILES")
            #     print(request.FILES)
            #     db.tempPage.update({'userId': userId}, {'$set': {'colorRunning': True}})
            #     colorIsBeingTransferd = colorisTransferd(userId)
            #     redirect('/index/', code=302)
            #     c = threading.Thread(target=colorTransferThread,
            #                          args=(currentUser, page, request, screenshotId, screenshotName, userId))
            #     c.start()
                elif request.POST['name'] == "addAnimation":
                    print("add Animation")
                    srcid = request.POST['id']
                    targetSC = request.POST['href']
                    ani = request.POST['animation']
                    print(srcid)
                    print(targetSC)
                    print(ani)
                    elem = db.styles.find_one({"segmentation_id": srcid})
                    if elem != None:
                        db.styles.update({"segmentation_id": srcid}, {'$set': {'animationType': ani}})
                    else:
                        db.newStyle.update({"element_id": srcid}, {'$set': {'animationType': ani}})
        print('suggestionImgC')
        print(suggestionImgC)
        return html_render('customize/page2.html',currentUser, page, projectName, request, screenshotName, userId, screenshotId, layoutIsBeingTransferd, colorIsBeingTransferd,workflowBeingMagic,html,css, suggestionImgC)

    try:
        r = rewritePage(currentUser, myfile, screenshotId, screenshotName, 'load')
        print('cache is deleted')
        print(r)
    except:
        print('cache is not deleted')
    print('page: ')
    print(page)
    return html_render('customize/page2.html',currentUser, page, projectName, request, screenshotName, userId, screenshotId,layoutIsBeingTransferd,colorIsBeingTransferd,workflowBeingMagic,html,css, suggestionImgC)

@csrf_exempt
def projects(request):
    currentUser = str(request.user)
    userId = getCollectionIDs('user', currentUser)
    print('Project POST')
    print(request.POST)

    if request.POST:
        if 'createProject' in request.POST:
            print('create new project')
            print(request.POST)
            project = request.POST['projectName']
            if (project == '' or project == None):
                print('Projectname cant be empty')
            else:
                date = datetime.now(pytz.timezone('Australia/Melbourne'))
                db.projects.insert({'projectName': project,
                                    'user_id': userId,
                                    'screenshots': [],
                                    'status': 'pending',
                                    'comment': [],
                                    'groupCommentCode': 0,
                                    'dateCreated': str(date)})
                db.tempPage.update({'userId': userId}, {'$set': {'projectName': project, 'screenshot_id': ''}})
                rewritePage(currentUser, None, None, None, None)
                return redirect('/index/', code=302)
        elif 'selectProject' in request.POST:
            print('select a project')
            print(request.POST)
            project = db.projects.find_one({'_id': ObjectId(str(request.POST['selectProject']))})
            try:
                screenshotid = project['screenshots'][0]
            except:
                screenshotid = ''

            try:
                if request.POST['screenshot'] != 'empty':
                    screenshotid = request.POST['screenshot']
            except:
                screenshotid = screenshotid
            print('screenshotid:')
            print(screenshotid)
            db.tempPage.update({'userId': userId},{'$set': {'projectName': project['projectName'], 'screenshot_id': screenshotid}})
            return redirect('/index/', code=302)
        elif 'selectCollaboratingProject' in request.POST:
            print('Collaborating Project')
            return redirect('/index/', code=302)

        elif 'deleteProject' in request.POST:
            projectId = request.POST['deleteProject']
            db.projects.update({'_id': ObjectId(projectId)}, {'$set': {'status': 'inactive'}})
            project = db.projects.find_one({'user_id': userId, 'status':'pending'})
            print('project')
            print(project)
            try:
                if project['status'] != 'inactive':
                    latestProject = project['projectName']
                    screenid = project['screenshots'][0]
            except:
                latestProject = ''
                screenid = ''

            db.tempPage.update({'userId': userId},{'$set':{'projectName':latestProject,'screenshot_id':screenid}})
            return redirect('/projects/', code=302)



    return render(request, 'customize/includes/projectSelector.html',
                  {
                      'projects': getProjects(userId),
                      'userName': currentUser,
                      'currentProfilePic': getUserPicture(currentUser)
                  })


def prototypePage(request):
    try:
        print('I am called to change the page')
        print(request.GET['link'])
        page = request.GET['link']
        currentUser = str(request.user)
        userId = getCollectionIDs('user', currentUser)
        screenshots = db.screenshots.find({'user_id': userId, 'pageName': page})

        projectName = getLatestScreenshot(userId)['projectName']
        project = db.projects.find_one({'projectName': projectName, 'user_id': userId})['screenshots']
        print('check over here')
        for screen in screenshots:
            print(str(screen['_id']))
            if str(screen['_id']) in project:
                print('I am the correct one: ' + str(screen['_id']))
                screenshotId = str(screen['_id'])
                setScreenshot(userId, screenshotId, projectName)
                screenshotName = str(
                getScreenshotName('screenshots', userId, str(screenshotId))[int(len(str(currentUser))) + 7:-4])
        curProject = getProjectPageAndCss(screenshotName, currentUser)
        jsondata = []
        jsondata.append(curProject[0])
        jsondata.append(curProject[1])
        import json
        return HttpResponse(json.dumps(jsondata), content_type="application/json")
    except:
        return HttpResponseRedirect('/index')


def forgotPassword (request):
    return render(request, 'virtualize/../templates/logIn/forgotPassword.html', )


## Additional funstions required


def customize(request):
    return render(request, 'customize/editPage.html')

def getAllProjects(userId, currentUser):
    print('getting all the projects for workflow')
    print(userId)
    var = []
    project = db.tempPage.find_one({'userId': userId})
    screenids = db.projects.find_one({'user_id': userId, 'projectName': project['projectName']})
    for id in screenids['screenshots']:
        print(id)
        screen = db.screenshots.find_one({'_id': ObjectId(str(id))})
        if screen['status'] != 'inactive':
            var.append([screen['image'][int(len(str(currentUser))) + 7:-4], screen['pageName'], screen['screenName']])
    print(var)
    html = []
    css = []


    import codecs
    for page in var:
        try:
            pagehtml = codecs.open('./static/dirty_static/users/' + currentUser + '/pages/' + page[0] + '/testing.html',
                                   mode='r', encoding='UTF-8')
            pagename = page[2]
            html.append([pagename, pagehtml.read()])
            pagehtml.close()
        except:
            html.append('')
        try:
            pagecss = codecs.open('./static/dirty_static/users/' + currentUser + '/pages/' + page[0] + '/css/testingCss.css',
                                  mode='r', encoding='UTF-8')
            css.append(pagecss.read())
            pagecss.close()
        except:
            css.append('')
    return html, css


def html_render(url, currentUser, page, projectName, request, screenshotName, userId,screenId, layoutIsBeingTransferd,colorIsBeingTransferd,workflowBeingMagic,html,css, ScreenSIDFDJANGO):
    return render(request, url,
                  {
                      'pageArray': fillPageArray(userId, projectName),
                      'screen': screenshotName,
                      'screenName': getScreen_Name(screenshotName),
                      'projectName': projectName.capitalize(),
                      'page': page,
                      'userName': currentUser,
                      'currentProfilePic': getUserPicture(currentUser),
                      'currentPage': getCurrentScreenName(screenId),
                      'colorTransfer': getColorTransferHtml(currentUser, screenshotName),
                      'screenHTML': getProjectPage(screenshotName, currentUser),
                      # 'screenHTMLpro': getProjectPagePro(screenshotName, currentUser),
                      # 'screenHTMLwork': getProjectPageWork(userId),
                      'screenHTMLsuggestions': getProjectPageSuggestions(ScreenSIDFDJANGO, currentUser),
                      'screenCSSpro': getProjectPageAndCss(screenshotName, currentUser),
                      'screenCSSwork': getProjectPageWorkCSS(userId, projectName, screenshotName),
                      'colorTransferUploadIMG': str(currentUser) + '/pages/' + str(screenshotName) + '/colorTransfer/styles/colorTransfer.jpg',
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
                      'aniStyles': getStylesDb()
                  }
                  )



def getStylesDb():
    print("getStyles")
    sty = []
    cursorSty = db.styles.find({})

    try:
        for s in cursorSty:
            try:
                sty.append({
                    'seg_id': s['segmentation_id'],
                    'aniTy': s['animationType'],
                    'linkColor': s['linkColor'],
                    'link': s['link']
                })
            except:
                continue
    except:
        print("nothing")
    return sty


def getScreen_Name(screenshotName):
    sName = ''
    try:
        scName = db.screenshots.find_one({'pageName': screenshotName})
        sName = scName['screenName']
    except:
        print("nothing")
    return sName


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


def getProjectPage(screenshotName, currentUser):
    print('retrieve the correct html for page2')
    try:
        import codecs
        pagehtml = codecs.open('./static/dirty_static/users/' + currentUser+'/pages/' + screenshotName + '/testing.html', mode='r', encoding='UTF-8')
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
        pagehtml = codecs.open('./static/dirty_static/users/' + currentUser +'/pages/' + getPathFS + '/testingSuggestions.html', mode='r', encoding='UTF-8')
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
    user = db.user.find_one({'username': currentUser})
    userId1 = user['_id']
    try:
        sc_id = db.screenshots.find_one({'pageName': screenshotName})
        project1 = db.tempPage.find_one({'screenshot_id': str(sc_id['_id'])})
        scree_id = db.projects.find_one({'user_id': str(userId1), 'projectName': str(project1['projectName'])})
        arSc = scree_id['screenshots']
        for id1 in arSc:
            screen = db.screenshots.find_one({'_id': ObjectId(str(id1))})
            if str(screen['status']) != 'inactive':
                var1.append([screen['image'][int(len(str(currentUser))) + 7:-4], screen['pageName'], screen['screenName']])

        import codecs
        for page in var1:
            pagehtml1 = codecs.open('./static/dirty_static/users/' + currentUser + '/pages/' + page[0] + '/testingPro.html',
                                mode='r', encoding='UTF-8')
            screenName = page[2]
            html.append([screenName, pagehtml1.read()])
            pagehtml1.close()

    except:
        html = ''
    return html


def getProjectPageAndCss(screenshotName, currentUser):
    print('retrieve the correct html and css for page2')
    try:
        import codecs
        pagehtml = codecs.open('./static/dirty_static/users/' + currentUser+'/pages/'+ screenshotName + '/testing.html', mode='r', encoding='UTF-8')
        html = pagehtml.read()
        pagehtml.close()
        pagecss = codecs.open('./static/dirty_static/users/' + currentUser+'/pages/'+ screenshotName + '/css/testingCss.css', mode='r', encoding='UTF-8')
        css = pagecss.read()
        pagecss.close()
    except:
        html = ''
        css = ''
    return css


def getProjects(userId):
    print('getting the projects for this user!')
    jsonProjects = []
    projects = db.projects.find({'user_id': userId})
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
                'projectName': project['projectName'].capitalize(),
                'user_id': project['user_id'],
                'screenshotsamount': length,
                'screenshots': screen,
                'dateCreated': (project['dateCreated'])
            })

    return jsonProjects


def rewritePage(currentUser, myfile, screenshotId, screenshotName, state):
    print('Rewriting PAge')
    print('user: ' + str(currentUser) + '\n myfile: ' + str(myfile) + '\n id: ' + str(screenshotId) + '\n name: ' + str(
        screenshotName))
    if myfile!= None:
        metaCustom(currentUser, myfile, screenshotId, state)
        print('Inside Meta Rewriting PAge')
    return "rewrited"


def getProjectPageWork(userId):
    print('retrieve the Pro correct html for page2 in workflow container')
    html = []
    currentUser = db.user.find_one({'_id': ObjectId(userId)})['username']

    try:
        print('projectName')
        temp = db.tempPage.find_one({'userId': userId})
        currentProject = db.projects.find_one({'user_id': userId, 'projectName': str(temp['projectName'])})
        project_screen = currentProject['screenshots']
        screenshots = db.screenshots.find({'user_id': str(userId)})
        for screen in screenshots:
            if str(screen['_id']) in project_screen:
                screenshotName = screen['pageName']
                screenName = screen['screenName']
                elId = str(screen['_id'])
                import codecs
                pagehtml2 = codecs.open('./static/dirty_static/users/' + currentUser+'/pages/' + screenshotName + '/testingWork.html', mode='r', encoding='UTF-8')
                html.append([screenName, pagehtml2.read(), elId])
                pagehtml2.close()
    except:
        html.append('')

    return html


def getProjectPageWorkCSS(userId,projectName, currentScreen):
    print('retrieve the Pro correct html for page2 in workflow container')
    print(projectName)
    css = []
    path = []

    try:
        project = db.projects.find_one({'user_id': userId, 'projectName': projectName})
        pName = str(project['_id'])
        p = pName.split('/')
        screenshots = db.screenshots.find({'user_id': userId})
        currentUser = db.user.find_one({'_id': ObjectId(userId)})['username']

        for screen in screenshots:
            if screen['status'] != 'inactive':
                screenshotName = screen['pageName']
                screenName = screen['screenName']

                if screenshotName.split('/')[0] == projectName:
                    import codecs
                    try:
                        if screenshotName.split('/')[1] != currentScreen.split('/')[1]:
                            path.append(currentUser + '/pages/' + screenshotName +
                                        '/css/testingCss.css')
                        pagecss = codecs.open('./static/dirty_static/users/' + currentUser + '/pages/' + screenshotName + '/css/testingCss.css',
                                            mode='r', encoding='UTF-8')
                        css.append(pagecss.read())
                        pagecss.close()
                    except:
                        continue
    except:
        css.append('')

    return path


def getSuggestion(userId, projectName):
    print('Iside Suggestions')
    currentProject = db.projects.find_one({'projectName':str(projectName),'user_id':str(userId)})
    s1 = []
    s2 = []
    s3 = []
    s4 = []
    suggestions = []
    if currentProject != None:
        project_id = str(currentProject['_id'])
        suggest = db.tempSuggestions.find_one({'project_id':project_id})
        if suggest !=None:
            data_1 = suggest['Level_1']
            data_2 = suggest['Level_2']
            data_3 = suggest['Level_3']
            data_4 = suggest['Level_4']
            for d1 in data_1:
                label = db.suggestionsTable.find_one({'code':str(d1),'Level':'level_1'})
                s1.append([d1,label['description']])
            for d2 in data_2:
                label = db.suggestionsTable.find_one({'code':str(d2[0]),'Level':'level_2'})
                s2.append([d2,label['description']])
            for d3 in data_3:
                label = db.suggestionsTable.find_one({'code':str(d3),'Level':'level_3'})
                s3.append([d3,label['description']])
            for d4 in data_4:
                label = db.suggestionsTable.find_one({'code':str(d4[0]),'Level':'level_4'})
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
    project = db.projects.find_one({'user_id': userId, 'projectName': projectName})
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


def fillWidget():
    wid = []
    try:
        coll_wid = db.saveWidgets.find()
        for i in coll_wid:
            temp = i['type']
            if temp == 'Widget':
                wid.append({
                    'id': str(i['_id']),
                    'widgetName': str(i['widgetName']),
                    'widgetLocation': str(i['widgetLocation']),
                    'widgetDescription': str(i['widgetDescription']),
                    'widgetCategory': str(i['widgetCategory']),
                    'device': str(i['device']),
                    'type': str(i['type'])
                })
    except:
        print("No widget")
        wid = []

    return wid


def delete_link(id):
    screenName = db.screenshots.find_one({'_id':ObjectId(id)})['screenName']
    sc = db.styles.find({'link': str(screenName)})
    for s in sc:
        db.styles.update({'_id':s['_id']},{
            '$set': {
                'link': ''
            }
        })


def fillGraphics():
    gid = []
    try:
        coll_wid = db.saveWidgets.find()
        for i in coll_wid:
            temp = i['type']
            if temp == 'Graphics':
                gid.append({
                    'id': str(i['_id']),
                    'widgetName': str(i['widgetName']),
                    'widgetLocation': str(i['widgetLocation']),
                    'widgetDescription': str(i['widgetDescription']),
                    'widgetCategory': str(i['widgetCategory']),
                    'device': str(i['device']),
                    'type': str(i['type'])
                })
    except:
        print("No widget")
        gid = []

    return gid


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