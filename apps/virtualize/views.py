from django.core.cache import cache
from django.core.files.storage import FileSystemStorage
from django.http import HttpResponse
from django.shortcuts import redirect
from django.shortcuts import render
from django.utils.cache import add_never_cache_headers
from django.views.decorators.csrf import csrf_exempt

from apps.virtualize.models import *
from apps.virtualize.segmentation.segmentation import run
from apps.virtualize.segmentation.inference_segmentation import initiateCocoDetection, initiateTensorflowDetection
from apps.virtualize.segmentation.metaCustom import metaCustom, addElement, duplicateElement
from apps.virtualize.utils.elementUtils import *
from apps.virtualize.utils.screenshotUtils import *
from apps.virtualize.utils.styleTransfer import propertyTransfer
from apps.virtualize.utils.widgetsUtils import move_widget

coco_model_global = []
tensorflow_model_global = []


class NoCachingMiddleware(object):

    def process_response(self, response):

        add_never_cache_headers(response)
        return response


@csrf_exempt
def main_request_core(request):
    currentUser = str(request.user)
    userId = getCollectionIDs('accounts_user', currentUser)
    layoutIsBeingTransferd = layoutisTransferd(userId)
    colorIsBeingTransferd = colorisTransferd(userId)
    workflowBeingMagic = workflowRun(userId)
    suggestionImgC = ''
    last_screen_details = getLatestScreenshot(userId)
    if last_screen_details is not None:
        projectName = last_screen_details['projectName']
        screenshotId = last_screen_details['screenshot_id']
    else:
        projectName = ''
        screenshotId = ''
    allProjects = getAllProjects(userId, currentUser)
    html = allProjects[0]
    css = allProjects[1]
    screenshotName = str(getScreenshotName('screenshots', userId, str(screenshotId))[int(len(str(currentUser))) + 7:-4])

    if screenshotName == '' or screenshotName == 'None at this point':
        screenshotId = ''
        screenshotName = 'None at this point'
        page = 'None at this point'
        myfile = None
        print('this user does not have any screenshot yet.')
    else:
        myfile = str(getScreenshotName('screenshots', userId, str(screenshotId)))
        page = str(getScreenshotName('screenshots', userId, str(screenshotId))[int(len(str(currentUser))) + 7:])

    if request.GET:
        print('GET REQUEST!')
        print(request.GET)

        if str(request.GET['name']) == 'initialState':
            print('We are running initialState GET')
            req = request.GET
            secHeight = float(req['heightSection'])
            secWidth = float(req['widthSection'])
            widthLayouts = float(100)
            heightLayouts = float(175)
            request.session['height'] = str(secHeight)
            request.session['width'] = str(secWidth)
            screenshotId = getLatestScreenshot(userId)['screenshot_id']
            device_collection = findOne(db.screenshots, '_id', screenshotId)
            if device_collection is not None:
                device = device_collection['device_type']
            else:
                device = ''
            saveMetrix(secHeight, secWidth, widthLayouts, heightLayouts, userId, screenshotId, projectName, device)
            return html_render('customize/page2.html', currentUser, page, projectName, request, screenshotName,
                               userId, screenshotId, layoutIsBeingTransferd, colorIsBeingTransferd, workflowBeingMagic,
                               html, css, 'none')

        if str(request.GET['name']) == 'displayElements':
            action = str(request.GET['action'])
            print('Action: ')
            print(action)

            addElement(currentUser, myfile, screenshotId, action)
            date = datetime.now(pytz.timezone('Australia/Melbourne'))

            if action == '1':
                print('meta running with action: ' + action)

                bu = db['buttons'].find_one({'screenshot_id': str(screenshot_id), 'state': 'active'})
                print(bu)
                if bu == None:
                    label = 'button'
                    classid = str(ObjectId())
                    width = 25
                    height = 10
                    positionL = 25
                    positionT = 25
                    type = "button"

                    # Style
                    fontSize = 15
                    textAlign = 'unset'
                    fontColor = 'black'
                    fontFamily = 'Helvetica'
                    bgcolor = 'white'
                    bordercolor = 'black'
                    borderRadius = '10'
                    zindex = 2

                    location = {'x0': positionL, 'y0': positionT, 'x1': float(positionL) + float(width),
                                'y1': float(positionT) + float(height)}

                    save_new_elements(classid, screenshot_id, type, label, location, date, '')
                    collection = db['newElements']
                    col = collection.find().sort([('timeStamp', -1)]).limit(1)
                    element_id = ''
                    for item in col:
                        print('look over here: ' + str(item))
                        element_id = str(item['class_id'])
                else:
                    seg_id = bu['seg_id']
                    bu_style = db.styles.find_one({'segmentation_id': seg_id})

                    label = 'New Button'
                    classid = str(ObjectId())
                    width = float(bu['location']['x1']) - float(bu['location']['x0'])
                    height = float(bu['location']['y1']) - float(bu['location']['y0'])
                    positionL = 50 - width / 2
                    positionT = 50 - height / 2
                    type = "button"
                    zindex = 2

                    # Style
                    fontSize = bu_style['fontSize']
                    textAlign = bu_style['textAlign']
                    fontColor = bu_style['fontColor']
                    fontFamily = bu_style['fontFamily']
                    bgcolor = bu_style['bgcolor']
                    bordercolor = bu_style['borderColor']
                    borderRadius = bu_style['borderRadius']
                    occupied = 1
                    # while occupied == 1:
                    #     print('posL: ' + str(positionL) + ', posT: ' + str(positionT))
                    #     if checkLocation(positionL, positionT, width, height, screenshot_id) == 1:
                    #         positionL += 1
                    #         positionT += 1
                    #         print('i am wrong!!')
                    #     else:
                    #         occupied = 5

                    location = {'x0': positionL, 'y0': positionT, 'x1': float(positionL) + float(width),
                                'y1': float(positionT) + float(height)}

                    save_new_elements(classid, screenshot_id, type, label, location, date, '')
                    collection = db['newElements']
                    col = collection.find().sort([('timeStamp', -1)]).limit(1)
                    element_id = ''
                    for item in col:
                        print('look over here: ' + str(item))
                        element_id = str(item['class_id'])

                save_new_style(element_id, str(fontSize), fontFamily, fontColor, bordercolor, borderRadius, bgcolor,
                               textAlign,
                               'unset', '', zindex)

            import json

            return HttpResponse(json.dumps(action), content_type="application/json")

        elif str(request.GET['name']) == 'deleteElement':
            print('We are running deleteElement GET')
            deleteId = str(request.GET['id'])[2:]
            element = str(request.GET['element'])

            if search_new_element(deleteId) is not None:
                elementType = 'newElements'
                collection = delete_element_from_collection(elementType, deleteId)
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
                    # have this be either 'icon' or 'pictures' depending on which database your IMGs are stored
                    elementType = 'icon'

                else:
                    elementType = 'Error: ' + str(element)
                collection = delete_element_from_collection(elementType, deleteId)
                for col in collection:
                    eventelement = col
                insertEvent(eventelement['screenshot_id'], eventelement['seg_id'], elementType, 'deletedElement',
                            'active', 'inactive')

        elif str(request.GET['name']) == 'elementList':
            print('We are running elementList GET')
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
            print('We are running getPredictions GET')

            element = request.GET
            id = element['id'][2:]
            print('IDDDD')
            print(id)
            image = []
            elementName = ''
            ocr = []
            children = []
            childs = []
            state = []

            cursor = findMultiple(db.predictions, 'segmentation_id', str(id))
            for document in cursor:
                children.append(document['children'])

            active_button = getOneActive('buttons', id)
            active_frame = getOneActive('frames', id)
            active_hyperlink = getOneActive('hyperLinks', id)
            active_paragraph = getOneActive('paragraphs', id)
            active_picture = getOneActive('pictures', id)
            active_icon = getOneActive('icon', id)
            active_logo = getOneActive('logo', id)
            active_text_area = getOneActive('textArea', id)
            active_text_box = getOneActive('textBoxes', id)
            active_new_element = getOneActiveNewE('newElements', id)
            active_widget = getOneActive('widgets', id)

            if active_button is not None:
                elementName = 'button'
                if active_button['level']['parent'] == []:
                    ocr = active_button['name']
                else:
                    ocr = getOneChild('buttons', id)['name']
                image = active_button['root']
                state = active_button['locked']
            if active_frame is not None:
                elementName = 'div'
                ocr = []
                image = active_frame['root']
                state = active_frame['locked']
            if active_hyperlink is not None:
                elementName = 'hyperlink'
                ocr = active_hyperlink['name']
                image = active_hyperlink['root']
                state = active_hyperlink['locked']
            if active_paragraph is not None:
                elementName = 'paragraph'
                ocr = active_paragraph['name']
                image = active_paragraph['root']
                state = active_paragraph['locked']
            if active_picture is not None:
                elementName = 'image'
                ocr = []
                image = active_picture['root']
                state = active_picture['locked']
            if active_icon is not None:
                elementName = 'Icon'
                ocr = []
                image = active_icon['root']
                state = active_icon['locked']
            if active_logo is not None:
                elementName = 'Logo'
                ocr = []
                image = active_logo['root']
                state = active_logo['locked']
            if active_text_area is not None:
                elementName = 'text-area'
                if active_text_area['level']['parent'] == []:
                    ocr = active_text_area['name']
                else:
                    ocr = getOneChild('textArea', id)['name']
                image = active_text_area['root']
                state = active_text_area['locked']
            if active_text_box is not None:
                elementName = 'text-input'
                if active_text_box['level']['parent'] == []:
                    ocr = active_text_box['name']
                else:
                    ocr = getOneChild('textBoxes', id)['name']
                image = active_text_box['root']
                state = active_text_box['locked']
            if active_new_element is not None:
                elementName = active_new_element['type']
                if elementName == 'button' or elementName == 'paragraph' or elementName == 'textbox' \
                        or elementName == 'textArea':
                    ocr = active_new_element['name']
                else:
                    ocr = []
                image = []
                state = active_new_element['locked']
            if active_widget is not None:
                elementName = 'widgets'
                ocr = []
                image = active_widget['root']
                state = active_widget['locked']

            if len(children[0]) > 0:
                for index in range(len(children[0])):
                    cursor = findMultiple(db.segmentation, '_id', ObjectId(str(children[0][index])))
                    if len(cursor) > 0:
                        for doc in cursor:
                            childs.append(doc['elementRoot'])
                        else:
                            print('New element doesnt have children')
            import json
            return HttpResponse(json.dumps([image, elementName, ocr, childs, state]), content_type="application/json")

        elif str(request.GET['name']) == 'updateStyle':
            print('We are running updateStyle GET')
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
            print('We are running lockElement')
            lockid = request.GET['id'][2:]
            element = str(request.GET['element'])

            if search_new_element(lockid) is not None:
                elementType = 'newElements'
                collection = findMultiple(db.newElements, 'class_id', lockid)
                state = []
                for col in collection:
                    state = col

                oldState = state['locked']
                newState = not state['locked']
                collection = update_element_lock(elementType, 'class_id', lockid, newState)
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

                oldState = checkCurrentLock(elementType, lockid)['locked']
                newState = not checkCurrentLock(elementType)['locked']
                collection = update_element_lock(elementType, 'seg_id', lockid, newState)
                for col in collection:
                    eventelement = col

                insertEvent(eventelement['screenshot_id'], eventelement['seg_id'], elementType, 'locked', oldState,
                            newState)

        elif str(request.GET['name']) == 'getLocked':
            print('We are running getLocked GET')
            ids = []
            state = []
            col = findMultiple(db.newElements, 'screenshot_id', screenshotId)
            for doc in col:
                ids.append(str(doc['class_id']))

            collection = findMultiple(db.segmentation, 'screenshot_id', screenshotId)
            for doc in collection:
                ids.append(str(doc['_id']))

            for id in ids:
                if getOneActive('buttons', id) is not None:
                    state.append([id, getOneActive('buttons', id)['locked']])
                elif getOneActive('frames', id) is not None:
                    state.append([id, getOneActive('frames', id)['locked']])
                elif getOneActive('hyperLinks', id) is not None:
                    state.append([id, getOneActive('hyperLinks', id)['locked']])
                elif getOneActive('paragraphs', id) is not None:
                    state.append([id, getOneActive('paragraphs', id)['locked']])
                elif getOneActive('pictures', id) is not None:
                    state.append([id, getOneActive('pictures', id)['locked']])
                elif getOneActive('textArea', id) is not None:
                    state.append([id, getOneActive('textArea', id)['locked']])
                elif getOneActive('textBoxes', id) is not None:
                    state.append([id, getOneActive('textBoxes', id)['locked']])
                elif getOneActiveNewE('newElements', id) is not None:
                    state.append([id, getOneActiveNewE('newElements', id)['locked']])
            import json
            return HttpResponse(json.dumps(state), content_type="application/json")

        elif str(request.GET['name']) == 'newWorkflowIndex':
            print('we are running newWorkflowIndex GET')
            source = request.GET['source'][2:]
            target = request.GET['target']
            screenName = request.GET['screenname']
            screen = getScreenShotDetails(str(screenName), userId)
            myfile = str(screen['image'])
            screenshotId = str(screen['_id'])
            update_style_link(str(source), str(target))

        elif str(request.GET['name']) == 'fullscreen':
            print('We are running fullscreen GET')
            backgroundColor = findOne(db.backgrounds, 'screenshot_id', screenshotId)['background']
            import json
            return HttpResponse(json.dumps(backgroundColor), content_type="application/json")

        elif str(request.GET['name']) == 'getPages':
            print('We are running getPages GET')
            pages = []
            screenshotId = list(findMultiple(db.screenshots, 'user_id', str(userId)))
            size = int(len(screenshotId) - 1)
            project = get_project_two_search_keys(userId, projectName)
            while size >= 0:
                for screenid in project['screenshots']:
                    if str(screenshotId[size]['_id']) == str(screenid):
                        if str(screenshotId[size]['status']) != 'inactive':
                            pages.append(str(screenshotId[size]['screenName']))
                size -= 1
            print('PagesV')
            print(pages)
            import json
            return HttpResponse(json.dumps(pages), content_type="application/json")

        elif str(request.GET['name']) == 'checkState':
            print('We are running checkState GET')
            state = str(request.GET['state'])
            result = findOne(db.tempPage, 'userId', userId)[state]
            import json
            return HttpResponse(json.dumps(result), content_type="application/json")

        elif str(request.GET['name']) == 'sendElement':
            print('We are running sendElement GET')
            element = request.GET
            id = element['id']

        elif str(request.GET['name']) == 'checkWorkflowState':
            print('We are running checkWorkflowState GET')
            print(request.GET['name'])
            Wstate = str(request.GET['state'])
            result = findOne(db.tempPage, 'userId', str(userId))[Wstate]
            if result is None:
                result = False
            import json
            return HttpResponse(json.dumps(result), content_type="application/json")

        elif str(request.GET['name']) == 'checkDeviceType':
            print('We are running checkDeviceType GET')
            dstat = str(request.GET['state'])
            result_collection = findOne(db.tempPage, 'userId', userId)
            if result_collection is None:
                print('error CheckDeviceType')
            else:
                result = result_collection[dstat]
                import json
                return HttpResponse(json.dumps(result), content_type="application/json")

        elif str(request.GET['name']) == 'getMode':
            print('We are running getMode GET')
            arrayAD = []
            getScreenId = findOne(db.tempPage, 'projectName', projectName)['screenshot_id']
            getBI = findOne(db.backgrounds, 'screenshot_id', getScreenId)
            if getBI is None:
                print(arrayAD)
            else:
                for AD in getBI:
                    getAngle = getBI['text-angle']
                    getDirection = getBI['text-direction']
                    arrayAD.append(getAngle)
                    arrayAD.append(getDirection)
            import json
            return HttpResponse(json.dumps(arrayAD), content_type="application/json")

        elif str(request.GET['name']) == 'getBackgroundImageGradient':
            print('We are running getBackgroundImageGradient GET')
            getScreenId_collection = findOne(db.tempPage, 'userId', userId)
            if getScreenId_collection is not None:
                getScreenId = getScreenId_collection['screenshot_id']
            else:
                getScreenId = ''
            getBI_collection = findOne(db.backgrounds, 'screenshot_id', getScreenId)
            if getBI_collection is not None:
                getBI = getBI_collection['background']
            else:
                getBI = None
            import json
            return HttpResponse(json.dumps(getBI), content_type="application/json")

        elif str(request.GET['name']) == 'getHandlerBGC':
            print('We are running getHandlerBGC GET')
            getScreenId = findOne(db.temPage, 'userId', userId)['screenshot_id']
            getBI = findOne(db.backgrounds, 'screenshot_id', getScreenId)['setLastHandlerColor']
            import json
            return HttpResponse(json.dumps(getBI), content_type="application/json")

        elif str(request.GET['name']) == 'getUserActivity':
            print('We are running getUserActivity GET')
            getUserActivity = findOne(db.tempPage, 'userId', userId)['current_device_page']
            import json
            return HttpResponse(json.dumps(getUserActivity), content_type="application/json")

        elif str(request.GET['name']) == 'projectsLibraryDB':
            print('We are running projectsLibraryDB GET')
            pages = []
            allProject = find_all_projects_user_status(userId, 'pending')
            size = int(len(allProject))
            recproject = find_one_project_user_status(userId, 'pending')
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
            return HttpResponse(json.dumps(pages), content_type="application/json")

        elif str(request.GET['name']) == 'getImgLibAllProj':
            print('We are running getImgLibAllProj GET')
            curProj = str(request.GET['curProj'])
            imgPages = []
            imgName = []
            imgType = []
            imgSize = []
            imgLM = []
            allProjectL = find_all_image_library(userId, curProj.lower())
            recproject = find_one_image_library(userId, curProj.lower())

            if allProjectL is []:
                find_all_image_library(userId, projectName.lower())
            if recproject is None:
                recproject = find_one_image_library(userId, projectName.lower())
            sizeL = int(len(allProjectL))

            while sizeL > 0:
                for pathDir in recproject['path']:
                    inte = sizeL - 1
                    if inte >= 0:
                        projectsN = str(allProjectL[inte]['path'])
                        fileN = str(allProjectL[inte]['originalFileName'])
                        fileTL = str(allProjectL[inte]['fileType'])
                        fileSL = str(allProjectL[inte]['fileSize'])
                        fileLML = str(allProjectL[inte]['fileLastModified'])
                        imgPages.append('/media/users/' + projectsN)
                        imgName.append(fileN)
                        imgType.append(fileTL)
                        imgSize.append(fileSL)
                        imgLM.append(fileLML)
                    sizeL -= 1
            import json
            return (HttpResponse(json.dumps([imgPages, imgName, imgType, imgSize, imgLM]),
                                 content_type="application/json"))

        elif str(request.GET['name']) == 'getLastSelectedProj':
            print('We are running getLastSelectedProj GET')
            arrayCurProj = []
            lastSelectedproject = findOne(db.lastActivityLibrary, 'user', userId)['currentlySelectedProj']
            if lastSelectedproject is None:
                print('Project not found')
            else:
                arrayCurProj.append(str(lastSelectedproject))
            import json
            return HttpResponse(json.dumps(arrayCurProj), content_type="application/json")

        elif str(request.GET['name']) == 'widgetMove':
            print('We are running widgetMove GET')
            device_type = findOne(db.tempPage, 'userId', userId)['current_device_page']
            if device_type == 'MobileApp':
                screenH = 628.33
                screenW = 333.33
            elif device_type == 'TabletApp':
                screenH = 693.48
                screenW = 528.98
            else:
                screenH = findOne(db.tempPage, 'userId', userId)['screenHeight']
                screenW = findOne(db.tempPage, 'userId', userId)['screenWidth']
            elm = request.GET['id'][2:]
            widget_type = request.GET['widget']
            py_0 = request.GET['top']
            px_0 = request.GET['left']
            height = request.GET['height']
            width = request.GET['width']
            move_widget(elm, widget_type, px_0, py_0, screenH, screenW, height, width)

        elif str(request.GET['name']) == 'getScreenOfSuggestionsL1':
            print('We are running getScreenOfSuggestionsL1 GET')
            all_screens = list(findMultiple(db.screenshots, 'user_id', userId))
            screenIdFromScript = findOne(db.tempSuggestions, 'user_id', userId)['Level_1']
            size = int(len(all_screens))
            arraySuggestL1 = []
            while size > 0:
                for screenid in screenIdFromScript:
                    inte = size - 1
                    if inte >= 0:
                        suggestionImgC = str(all_screens[inte]['screenName'])
                        suggestionImgCID = str(all_screens[inte]['_id'])
                        arraySuggestL1.append([suggestionImgC, suggestionImgCID])
                    size -= 1

            import json
            return HttpResponse(json.dumps(arraySuggestL1), content_type="application/json")

        elif str(request.GET['name']) == 'getScreenOfSuggestionsL2':
            print('We are running getScreenOfSuggestionsL2 GET')
            screenIdFromScript = findOne(db.tempSuggestions, 'user_id', userId)
            arraySuggestL2 = []
            for screenid in screenIdFromScript['Level_2']:
                getProjectIDUser = screenIdFromScript['project_id']
                getCorrectScreens = db.screenshots.find_one({'_id': ObjectId(str(screenid[1]))})
                suggestionImgName = getCorrectScreens['screenName']
                arraySuggestL2.append([suggestionImgName, screenid[1]])

            import json
            return HttpResponse(json.dumps(arraySuggestL2), content_type="application/json")

        elif str(request.GET['name']) == 'getScreenOfSuggestionsL3':
            print('We are running getScreenOfSuggestionsL3 GET')
            all_screens = list(findMultiple(db.screenshots, 'user_id', userId))
            screenIdFromScript = findOne(db.tempSuggestions, 'user_id', userId)['Level_3']
            size = int(len(all_screens))
            arraySuggestL3 = []
            while size > 0:
                for screenid in screenIdFromScript:
                    inte = size - 1
                    if inte >= 0:
                        suggestionImgC = str(all_screens[inte]['screenName'])
                        suggestionImgCID = str(all_screens[inte]['_id'])
                        arraySuggestL3.append([suggestionImgC, suggestionImgCID])
                    size -= 1

            import json
            return HttpResponse(json.dumps(arraySuggestL3), content_type="application/json")

        elif str(request.GET['name']) == 'getScreenOfSuggestionsL4':
            print('We are running getScreenOfSuggestionsL4 GET')
            all_screens = list(findMultiple(db.screenshots, 'user_id', userId))
            screenIdFromScript = findOne(db.tempSuggestions, 'user_id', userId)['Level_4']
            size = int(len(all_screens))
            arraySuggestL4 = []
            while size > 0:
                for screenid in screenIdFromScript:
                    inte = size - 1
                    if inte >= 0:
                        suggestionImgC = str(all_screens[inte]['screenName'])
                        suggestionImgCID = str(all_screens[inte]['_id'])
                        arraySuggestL4.append([suggestionImgC, suggestionImgCID])
                    size -= 1

            import json
            return HttpResponse(json.dumps(arraySuggestL4), content_type="application/json")

        elif str(request.GET['name']) == 'getWidgetPaths':
            widgetPaths = get_widget_paths()
            import json
            return HttpResponse(json.dumps(widgetPaths), content_type="application/json")

        elif str(request.GET['name']) == 'getChartPaths':
            chartPaths = get_chart_paths()
            import json
            return HttpResponse(json.dumps(chartPaths), content_type="application/json")

        elif str(request.GET['name']) == 'getButtonsStyling':
            all_button_styling = get_all_button_frame_textbox_styles('buttons', 'button', projectName, userId)
            import json
            return HttpResponse(json.dumps(all_button_styling), content_type="application/json")

        elif str(request.GET['name']) == 'getFrameStyling':
            all_frame_styling = get_all_button_frame_textbox_styles('frames', 'frame', projectName, userId)
            import json
            return HttpResponse(json.dumps(all_frame_styling), content_type="application/json")

        elif str(request.GET['name']) == 'getTextboxStyling':
            all_textbox_styling = get_all_button_frame_textbox_styles('textBoxes', 'textbox', projectName, userId)
            import json
            return HttpResponse(json.dumps(all_textbox_styling), content_type="application/json")

        elif str(request.GET['name']) == 'getParagraphStyling':
            all_paragraph_styling = get_all_paragraph_hyperlink_styles('paragraphs', 'paragraph', projectName, userId)
            import json
            return HttpResponse(json.dumps(all_paragraph_styling), content_type="application/json")

        elif str(request.GET['name']) == 'getTextAreaStyling':
            all_textArea_styling = get_all_paragraph_hyperlink_styles('textArea', 'text-area', projectName, userId)
            import json
            return HttpResponse(json.dumps(all_textArea_styling), content_type="application/json")

        elif str(request.GET['name']) == 'getHyperlinkStyling':
            all_hyperlink_styling = get_all_paragraph_hyperlink_styles('hyperLinks', 'hyperlink', projectName, userId)
            import json
            return HttpResponse(json.dumps(all_hyperlink_styling), content_type="application/json")



        elif str(request.GET['name']) == 'saveMove':
            print('We are running saveMove GET')
            state = request.GET
            fontColor = state['fgetButtonsStylingontColor']
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
        elif str(request.GET['name']) == 'getScreenshotId':
            import json
            return HttpResponse(json.dumps(screenshotId), content_type="application/json")
        else:
            print('Else GET')

    if request.POST:
        print('POST')
        print(request.POST)

        if 'createNewProject' in request.POST:
            print('We are running createNewProject POST')
            project = request.POST['newProjectName']
            if project == '' or project is None:
                print('Project Name cant be empty')
            else:
                date = datetime.now(pytz.timezone('Australia/Melbourne'))
                insert_project(project, userId, str(date))
                rewritePage(currentUser, None, None, None, None)
                return redirect('/index/', code=302)

        elif 'selectScreenshot' in request.POST:
            print('We are running selectScreenshot POST')
            screenshot = findOne(db.screenshots, '_id', str(request.POST['selectScreenshot']))
            screenshot_id = str(screenshot['_id'])
            screenName = str(screenshot['image'][int(len(str(currentUser))) + 7:-4])
            screenshotName = screenName
            screenshotId = screenshot_id
            myfile = screenshot['image']
            setScreenshot(userId, screenshotId, projectName)
            metaCustom(currentUser, myfile, screenshot_id, 'load')
            rewritePage(currentUser, myfile, screenshot_id, screenshotName, 'load')
            return html_render('customize/page2.html', currentUser, page, projectName, request, screenshotName, userId,
                               screenshotId, layoutIsBeingTransferd, colorIsBeingTransferd, workflowBeingMagic, html,
                               css, suggestionImgC)

        elif 'deletePage' in request.POST:
            print('We are running deletePage POST')
            page_id = str(request.POST['deletePage'])
            delete_page(page_id, userId)
            #curs - list of screenshots belonging to this user
            curs = findMultiple(db.screenshots, 'user_id', userId)
            #If there are no screenshots belonging to this user
            if curs is not []:
                for screen in curs:
                    if screen['status'] != 'inactive':
                        newScreen = screen
                #This updates or inserts a tempPage document.
                #TODO: Review this code. Why is this updating when the page is requested to be deleted?
                setScreenshot(userId, str(newScreen['_id']), projectName)
                screenshotId = str(newScreen['_id'])
                screenshotName = str(newScreen['pageName'])
                myfile = str(newScreen['image'])
                rewritePage(currentUser, myfile, screenshotId, newScreen['pageName'], 'load')
            else:
                print('deleted the last one!')
                screenshotId = ''
                screenshotName = 'None at this point'
                page_id = 'None at this point'
                cache.clear()
                NoCachingMiddleware()
            #TODO: Review this code: This update is already done within the setScreenshot() call above.
            db.tempPage.update({'userId': userId}, {'$set': {'screenshot_id': screenshotId}})

        elif 'changeElement' in request.POST:
            print('We are running changeElement POST')
            id = str(request.POST['id'])[2:]
            type = str(request.POST['type'])

            button = findTypeDb('buttons', id)
            frame = findTypeDb('frames', id)
            hyperlink = findTypeDb('hyperLinks', id)
            paragraph = findTypeDb('paragraphs', id)
            picture = findTypeDb('pictures', id)
            text_area = findTypeDb('textArea', id)
            text_box = findTypeDb('textBoxes', id)

            curType = ''
            if len(button) > 0:
                element = button
                elementChild = findChildDb('buttons', id)
                curType = 'buttons'
            if len(frame) > 0:
                element = frame
                elementChild = findChildDb('frames', id)
                curType = 'frames'
            if len(hyperlink) > 0:
                element = hyperlink
                elementChild = findChildDb('hyperLinks', id)
                curType = 'hyperLinks'
            if len(paragraph) > 0:
                element = paragraph
                elementChild = findChildDb('paragraphs', id)
                curType = 'paragraphs'
            if len(picture) > 0:
                element = picture
                elementChild = findChildDb('pictures', id)
                curType = 'pictures'
            if len(text_area) > 0:
                element = text_area
                elementChild = findChildDb('textArea', id)
                curType = 'textArea'
            if len(text_box) > 0:
                element = text_box
                elementChild = findChildDb('textBoxes', id)
                curType = 'textBoxes'

            element = update_element_type(element, elementChild, curType)
            insertEvent(element[0]['screenshot_id'], element[0]['seg_id'], curType, 'changedElement', curType, type)
            screenshotId = element[0]['screenshot_id']
            rewritePage(currentUser, myfile, screenshotId, screenshotName, 'load')

        elif 'pageName' in request.POST:
            print('We are running pageName POST')
            pageName = request.POST['pageName']
            pageId = request.POST['pageId']
            update_page_name(pageName, pageId)

        elif 'saveLayout' in request.POST:
            print('We are running saveLayout POST')
            save_layouts()

        elif 'updateScreenshotOrder' in request.POST:
            print('We are running updateScreenshotOrder POST')
            order = request.POST['updateScreenshotOrder']
            import json
            result = json.loads(order)
            db_main.projects_project.update({'user_id': ObjectId(userId), 'name': projectName},
                                            {'$set': {'screenshots': result}})

        elif 'changedStyle' in request.POST:
            print('We are running changedStyle POST')
            id = request.POST['changedStyle'][2:]
            element = request.POST['tagname']
            backgroundColor = request.POST['background-color']
            zIndex = request.POST['z-index']
            textIndent = request.POST['text-indent']
            borderColor = request.POST['bordercolor']
            borderRadius = request.POST['borderradius']
            textAlign = request.POST['text-align']
            fSize = request.POST['fontSize']
            barChartBar = request.POST['barChartBar']

            if barChartBar == '' or []:
                barChartBar = '0'
            else:
                print('its gone to else')

            barChartBG = request.POST['barChartBG']

            # set maximum z-index
            if zIndex >= '998':
                zIndex = '998'
            db.styles.update({'segmentation_id': id}, {'$set': {'fontSize': fSize}})

            if search_new_element(id) is not None:
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

            oldEvent = {'borderColor': old['borderColor'], 'borderRadius': old['borderRadius'],
                        'bgcolor': old['bgcolor'],
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

        elif 'colorsAD' in request.POST:
            import json
            print('We are running colorsAD POST')
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

            screens = propertyTransfer(userId, masterscreenname, listscreen, status)
            for s in screens:
                sc = findOne(db.screenshots, '_id', s)
                file = sc['image']
                if s != str(screenshotId):
                    metaCustom(currentUser, file, s, 'load')
            rewritePage(currentUser, myfile, screenshotId, screenshotName, 'load')

        elif 'profilePictureimg' in request.FILES:
            print('We are running profilePictureimg POST')
            myfile = request.FILES['profilePictureimg']
            fs = FileSystemStorage()
            fs.delete(str(currentUser) + '/profilePictures/pic.jpg')
            filename = fs.save(
                str(currentUser) + '/profilePictures/pic.jpg',
                myfile)
            db['user'].update({'username': request.POST['profilePicture']}, {'$set': {'profilePicture': str(filename)}})

        elif 'newImage' in request.FILES:
            print('We are running newImage POST')
            myfile = request.FILES['newImage']
            fs = FileSystemStorage()
            filename = fs.save(
                str(currentUser) + '/pages/' + screenshotName + '/images/' + myfile.name,
                myfile)
            addElement(currentUser, filename, screenshotId, str(7))
            file = str(getScreenshotName('screenshots', userId, str(screenshotId)))
            rewritePage(currentUser, file, screenshotId, screenshotName, 'load')

        elif 'filename' in request.POST:
            print('We are running filename POST')
            scname = request.POST['filename']
            myfile = request.FILES['myfile']
            fs = FileSystemStorage()
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
                    'screenHTML': getProjectPage(screenshotName, currentUser, projectName),
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
            filename = fs.save('users/' + str(currentUser) + '/pages/' + projectName + '/' + myfile.name, myfile)
            name = filename[int(len(str(currentUser)) + 7):-4]

            if user(url=filename, user_id=userId, name=name, scname=scname):
                print('lets start segmenting ' + str(filename))
                temp = db.tempPage.find_one({'userId': userId})
                if temp is not None:
                    global tensorflow_model_global
                    tensorflow_model_ = tensorflow_model_global
                    if len(tensorflow_model_) == 0:
                #         coco_model = initiateCocoDetection()
                        tensorflow_model = initiateTensorflowDetection()
                #         global coco_model_global
                #         coco_model_global = coco_model
                        tensorflow_model_global = tensorflow_model
                        db.tempPage.update({'userId': userId}, {'$set': {'maskRCNNstate': True}})
                    else:
                        # coco_model = coco_model_global
                        tensorflow_model = tensorflow_model_global
                        # print('some coco model shit ', coco_model)
                        print('some cnn model shit', tensorflow_model)
                run(filename, 'a', tensorflow_model, currentUser, projectName)
                screenshotId = getLatestScreenshot(str(userId))['screenshot_id']

                screenshotsId = db_main.projects_project.find_one({'user_id': ObjectId(userId),
                                                                   'name': projectName})['screenshots']

                screenshotsId.insert(0, screenshotId)

                db_main.projects_project.update({'user_id': ObjectId(userId), 'name': projectName},
                                   {'$set': {'screenshots': screenshotsId}})

                page = str(getScreenshotName('screenshots', userId, str(screenshotId))[
                           int(len(str(currentUser))) + 7:])
                screenshotName = str(getScreenshotName('screenshots', userId, str(screenshotId))[
                                     int(len(str(currentUser))) + 7:-4])
                myfile = str(getScreenshotName('screenshots', userId, str(screenshotId)))
                rewritePage(currentUser, myfile, screenshotId, screenshotName, 'save')
            else:
                print('lol error')

        elif 'resourceFilename' in request.POST:
            print('We are running resourceFilename POST')
            myfileLib = request.FILES['myResourcefile']
            selectedProject = request.POST['projectuploadResource']
            fileTypeL = request.POST['typeLIB']
            fileSizeL = request.POST['sizeLIB']
            fileLModifiedL = request.POST['lastModifiedLIB']
            fs = FileSystemStorage()
            filename = fs.save(str(currentUser) + '/library/' + selectedProject.lower() + '/'
                               + myfileLib.name, myfileLib)
            save_image_library(userId, selectedProject, filename, myfileLib, fileTypeL, fileSizeL, fileLModifiedL)
        else:
            print('Checkpoint POST 2')
            if str(request.POST['name']) == 'search':
                print('We are running search POST')
                data = {}
                key = str(request.POST['key'])
                data['scr'] = searchEnquiry(key.lower())[0]
                data['wid'] = searchEnquiry(key.lower())[1]
                import json
                return HttpResponse(json.dumps(data), content_type="application/json")
            elif str(request.POST['name']) == 'duplicateElement':
                print('We are running duplicateElment POST')
                req = request.POST
                elementContenttag = str(req['elementhtmltag'])
                elementContent = str(req['elementContent'])
                elementID = str(req['elementID'])
                elementID_cut = elementID[2:]
                print('elementtag = '+ elementContenttag)
                print(elementID_cut)
                valuelist = [elementContent]
                valuelist.append(elementID_cut)
                valuelist.append(elementContenttag)
                print(valuelist)
                duplicateElement( screenshotId, valuelist)
                rewritePage(currentUser, myfile, screenshotId, screenshotName, 'load')
                print("duplicated")
            elif str(request.POST['name']) == 'addElement':
                print('We are running addElement POST')
                req = request.POST
                action = req['value']
                # number 8 in the following if condition is used only for the widget
                if str(action) == '8':
                    myfile1 = str(req['path'])
                    myfile2 = myfile1
                    addElement(currentUser, myfile2, screenshotId, str(action))
                    rewritePage(currentUser, myfile, screenshotId, screenshotName, 'load')
                else:
                    addElement(currentUser, myfile, screenshotId, str(action))
                    rewritePage(currentUser, myfile, screenshotId, screenshotName, 'load')
                return html_render('customize/page2.html', currentUser, page, projectName, request, screenshotName,
                                   userId, screenshotId, layoutIsBeingTransferd, colorIsBeingTransferd,
                                   workflowBeingMagic, html, css, suggestionImgC)

            elif str(request.POST['name']) == 'approve':
                print('We are running approve POST')
                item_requested = request.POST.getlist('item_ticked[]')

            elif str(request.POST['name']) == 'undo':
                print('We are running undo POST')
                index = request.POST['index']
                event, wholeEvent = undo_event_function(screenshotId, index)
                import json
                return HttpResponse(json.dumps([event['seg_id'], wholeEvent]), content_type="application/json")

            elif 'updateBackground' == str(request.POST['name']):
                print('We are running updateBackground POST')
                backgroundColor = request.POST['Color']
                oldEvent = findOne(db.backgrounds, 'screenshot_id', screenshotId)['background']
                newEvent = backgroundColor
                insertEvent(screenshotId, 'n.a.', 'backgrounds', 'background-color', oldEvent, newEvent, )
                db['backgrounds'].update({'screenshot_id': screenshotId}, {'$set': {
                    'background': newEvent
                }})

            elif 'updateBackgroundG' == str(request.POST['name']):
                print('We are running updateBackgroundG POST')
                backgroundColor = request.POST['Color']
                oldEvent = findOne(db.backgrounds, 'screenshot_id', screenshotId)['background']
                newEvent = backgroundColor
                # catch all instance of backgroung-image attribute
                printSplitResult = newEvent.split(',')[0]
                printAngle = newEvent.split('(')[0]
                printDirection = printSplitResult.split('(')[1]
                insertEvent(screenshotId, 'n.a.', 'backgrounds', 'background-color', oldEvent, newEvent, )
                db['backgrounds'].update({'screenshot_id': screenshotId}, {'$set': {'background': newEvent,
                                                                                    'text-angle': printAngle,
                                                                                    'text-direction': printDirection
                                                                                    }})

            elif 'storeHandlerColor' == str(request.POST['name']):
                print('We are running storeHandlerColor POST')
                backgroundColor = request.POST['color']
                db['backgrounds'].update({'screenshot_id': screenshotId}, {'$set':
                                                                               {'setLastHandlerColor': backgroundColor,
                                                                                'background': backgroundColor
                                                                                }})

            elif str(request.POST['name']) == 'redo':
                print('We are running redo POST')
                index = request.POST['index']
                event, wholeEvent = redo_event_function(screenshotId, index)
                import json
                return HttpResponse(json.dumps([event['seg_id'], wholeEvent]), content_type="application/json")

            elif str(request.POST['name']) == 'updateURL':
                print('We are running updateURL POST')
                srcid = request.POST['id']
                srcid = str(srcid[2:])
                link = str(request.POST['href'])
                element = findOne(db.styles, 'segmentation_id', srcid)
                if element is not None:
                    db.styles.update({'segmentation_id': srcid}, {'$set': {'link': link}})
                else:
                    date = datetime.now(pytz.timezone('Australia/Melbourne'))
                    insert_link_style(srcid, link, date)
                # if element is linked from other than active screen
                pro = db_main.projects_project.find_one({'name': projectName, 'user_id': ObjectId(userId)})
                if pro is not None:
                    screens = pro['screenshots']
                    for s in screens:
                        if s != screenshotId:
                            sc = findOne(db.screenshots, '_id', str(s))
                            file = sc['image']
                            metaCustom(currentUser, file, s, 'load')
                # reload the metacustom
                rewritePage(currentUser, myfile, screenshotId, screenshotName, 'load')
                return html_render('customize/page2.html', currentUser, page, projectName, request, screenshotName,
                                   userId, screenshotId, layoutIsBeingTransferd, colorIsBeingTransferd,
                                   workflowBeingMagic, html, css, suggestionImgC)

            elif str(request.POST['name']) == 'deleteURL':
                print('We are running deleteURL POST')
                src_id = request.POST['srcid']
                target_sc = request.POST['target']
                element = findOne(db.styles, 'segmentation_id', src_id)
                if element is not None:
                    db.styles.update({'segmentation_id': src_id}, {'$set': {'link': target_sc}})
                else:
                    db.newStyle.update({'element_id': src_id}, {'$set': {'link': target_sc}})

                # if element is linked from other than active screen
                pro = db_main.projects_project.find_one({'name': projectName, 'user_id': ObjectId(userId)})
                if pro is not None:
                    screens = pro['screenshots']
                    for s in screens:
                        if s != screenshotId:
                            sc = db.screenshots.find_one({'_id': ObjectId(str(s))})
                            file = sc['image']
                            metaCustom(currentUser, file, s, 'load')
                # reload the metacustom
                rewritePage(currentUser, myfile, screenshotId, screenshotName, 'load')
                return html_render('customize/page2.html', currentUser, page, projectName, request, screenshotName,
                                   userId, screenshotId, layoutIsBeingTransferd, colorIsBeingTransferd,
                                   workflowBeingMagic, html, css, suggestionImgC)

            elif str(request.POST['name']) == 'goToPage':
                print('We are running goToPage POST')
                name = request.POST['page']
                if name == '' or name is None:
                    print('name is empty')
                else:
                    screenshotId = str(db.screenshots.find_one({'user_id': userId, 'pageName': name})['_id'])
                    setScreenshot(userId, screenshotId, projectName)
                rewritePage(currentUser, myfile, screenshotId, screenshotName, 'load')

            elif str(request.POST['name']) == 'setProjectName':
                print('We are running setProjectName POST')
                project = request.POST['project']
                date = datetime.now(pytz.timezone('Australia/Melbourne'))
                insert_project(project, userId, date)

            elif str(request.POST['name']) == 'widgetMove':
                print('We are running widgetMove POST')
                device_type = findOne(db.tempPage, 'userId', userId)['current_device_page']
                if device_type == 'MobileApp':
                    screenH = 628.33
                    screenW = 333.33
                elif device_type == 'TabletApp':
                    screenH = 693.48
                    screenW = 528.98
                else:
                    screenH = findOne(db.tempPage, 'userId', userId)['screenHeight']
                    screenW = findOne(db.tempPage, 'userId', userId)['screenWidth']
                elm = request.GET['id'][2:]
                widget_type = request.GET['widget']
                py_0 = request.GET['top']
                px_0 = request.GET['left']
                height = request.GET['height']
                width = request.GET['width']
                move_widget(elm, widget_type, px_0, py_0, screenH, screenW, height, width)
                rewritePage(currentUser, myfile, screenshotId, screenshotName, 'load')

            elif request.POST['name'] == "device_Page":
                print('We are running device_Page POST')
                device_page = request.POST['device']
                db.tempPage.update({'userId': userId}, {'$set': {'current_device_page': str(device_page)}})
                if screenshotId != '':
                    db.screenshots.update({'_id': ObjectId(screenshotId)}, {'$set': {'device_type': str(device_page)}})

            elif request.POST['name'] == "addAnimation":
                print('We are running addAnimation POST')
                srcid = request.POST['id']
                ani = request.POST['animation']
                elem = db.styles.find_one({"segmentation_id": srcid})
                if elem is not None:
                    db.styles.update({"segmentation_id": srcid}, {'$set': {'animationType': ani}})
                else:
                    db.newStyle.update({"element_id": srcid}, {'$set': {'animationType': ani}})
            elif str(request.POST['name']) == "modifyProject":
                lastName = request.POST['lastName']
                newName = request.POST['newName']
                #Update this project name
                db_main.projects_project.update({"user_id": ObjectId(userId), "name": lastName}, {"$set": {"name": newName}})
                db.tempPage.update({"userId": userId, "projectName": lastName}, {"$set": {"projectName": newName}})
            elif str(request.POST['name']) == "modifyScreen":
                newName = request.POST['newName']
                screenshotId = request.POST['screenshotId']
                db.screenshots.update({"_id": ObjectId(screenshotId)}, {"$set": {"screenName": newName}})

        return html_render('customize/page2.html', currentUser, page, projectName, request, screenshotName, userId,
                           screenshotId, layoutIsBeingTransferd, colorIsBeingTransferd, workflowBeingMagic, html, css,
                           suggestionImgC)
    try:
        rewritePage(currentUser, myfile, screenshotId, screenshotName, 'load')
    except:
        print('Something wrong')

    return html_render('customize/page2.html', currentUser, page, projectName, request, screenshotName, userId,
                       screenshotId, layoutIsBeingTransferd, colorIsBeingTransferd, workflowBeingMagic, html, css,
                       suggestionImgC)

@csrf_exempt
def projects(request):
    currentUser = str(request.user)
    userId = getCollectionIDs('accounts_user', currentUser)
    print('Project POST')
    print(request.POST)

    if request.POST:
        if 'createProject' in request.POST:
            print('create new project')
            project = request.POST['projectName']
            if (project == '' or project == None):
                print('Projectname cant be empty')
            else:
                date = datetime.now(pytz.timezone('Australia/Melbourne'))
                db_main.projects_project.insert({'name': project,
                                    'user_id': ObjectId(userId),
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
            project = db_main.projects.find_one({'_id': ObjectId(str(request.POST['selectProject']))})
            try:
                screenshotid = project['screenshots'][0]
            except:
                screenshotid = ''

            try:
                if request.POST['screenshot'] != 'empty':
                    screenshotid = request.POST['screenshot']
            except:
                screenshotid = screenshotid

            db.tempPage.update({'userId': userId},{'$set': {'projectName': project['projectName'],
                                                            'screenshot_id': screenshotid}})
            return redirect('/index/', code=302)
        elif 'selectCollaboratingProject' in request.POST:
            print('Collaborating Project')
            return redirect('/index/', code=302)

        elif 'deleteProject' in request.POST:
            projectId = request.POST['deleteProject']
            db_main.projects_project.update({'_id': ObjectId(projectId)}, {'$set': {'status': 'inactive'}})
            project = db_main.projects_project.find_one({'user_id': userId, 'status':'pending'})
            try:
                if project['status'] != 'inactive':
                    latestProject = project['projectName']
                    screenid = project['screenshots'][0]
            except:
                latestProject = ''
                screenid = ''

            db.tempPage.update({'userId': userId},{'$set':{'projectName': latestProject,'screenshot_id': screenid}})
            return redirect('/projects/', code=302)



    return render(request, 'customize/includes/projectSelector.html',
                  {
                      'projects': getProjects(userId),
                      'userName': currentUser,
                      'currentProfilePic': getUserPicture(currentUser)
                  })


def rewritePage(currentUser, myfile, screenshotId, screenshotName, state):
    print('Rewriting Page')
    print('user: ' + str(currentUser) + '\n myfile: ' + str(myfile) + '\n id: ' + str(screenshotId)
          + '\n name: ' + str(screenshotName))
    if myfile is not None:
        metaCustom(currentUser, myfile, screenshotId, state)
        print('Inside Meta Rewriting PAge')
    return "rewrited"

# Returns a list of all existing styles for an element in the current project.
# Background:
#   Elements identified during segmentation are stored in their own collection.
#   Elements created by the user are stored in the newElements collection.
#
#   Therefore, two pieces of information are needed to get all styling for a given element.
#       a) collection name - To get the styling of the element created during segmentation
#       b) type of element - To get the styling of the element created by the user
#
# Params:
#   element_type (String) - The element type in the newElements colllection to get styling for
#   collection_name (String) - The collection name of the element to get styling for
# Return:
#   A list of dictionaries, where each dict contains styling for one element.
def get_all_button_frame_textbox_styles(collection_name, element_type, current_project_name, current_user_id):
    currentProject = get_project(current_project_name, current_user_id)
    projectsScreenshotsList = currentProject['screenshots']

    shapeSegmentationIdList = get_project_shapes_segmentation_id(projectsScreenshotsList, collection_name)
    elementClassIdList = get_element_class_id(projectsScreenshotsList, element_type)

    # The styling of the element identified during segmenetation (set of str objects)
    shape_styles_set = get_styles(shapeSegmentationIdList)
    # The styling of the element created by the user (set of str objects)
    element_styles_set = get_new_styles(elementClassIdList)

    # All styling from segmentation and user (set of str objects); Union to remove potential duplicates
    all_styles_set = shape_styles_set.union(element_styles_set)

    import json
    all_styles = []
    # for each element in set, convert str objects back to JSON and insert into list
    # Since sets are not JSON serializable
    for style in all_styles_set:
        all_styles.append(json.loads(style))

    return all_styles


def get_all_paragraph_hyperlink_styles(collection_name, element_type, current_project_name, current_user_id):
    currentProject = get_project(current_project_name, current_user_id)
    projectsScreenshotsList = currentProject['screenshots']

    ocrSegmentationIdList = get_project_ocr_segmentation_id(projectsScreenshotsList, collection_name)
    elementClassIdList = get_element_class_id(projectsScreenshotsList, element_type)

    # The styling of the element identified during segmenetation (set of str objects)
    ocr_styles_set = get_styles(ocrSegmentationIdList)
    # The styling of the element created by the user (set of str objects)
    element_styles_set = get_new_styles(elementClassIdList)

    # All styling from segmentation and user (set of str objects); Union to remove potential duplicates
    all_styles_set = ocr_styles_set.union(element_styles_set)

    import json
    all_styles = []
    # for each element in set, convert str objects back to JSON and insert into list
    # Since sets are not JSON serializable
    for style in all_styles_set:
        all_styles.append(json.loads(style))

    return all_styles





