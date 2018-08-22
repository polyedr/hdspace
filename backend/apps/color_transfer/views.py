import json

from django.http import HttpResponse
from django.shortcuts import render
from django.core.files.storage import FileSystemStorage
from django.contrib.auth.decorators import login_required
from django.views.decorators.csrf import csrf_exempt
from django.shortcuts import redirect
from django.core.cache import cache
from django.utils.cache import add_never_cache_headers

from users.models import *
from chat.models import *
from project.models import *

coco_model_global = []
tensorflow_model_global = []


class NoCachingMiddleware(object):
    def process_response(self, request, response):
        add_never_cache_headers(response)
        return response


@login_required(login_url='/login')
@csrf_exempt
def color(request):
    currentUser = str(request.user)
    userId = getCollectionIDs('user', currentUser)

    layoutIsBeingTransferd = layoutisTransferd(userId)
    colorIsBeingTransferd = colorisTransferd(userId)
    workflowBeingMagic = workflowRun(userId)
    suggestionImgC = ''

    # activity = commentsActivity(request);

    html = ''
    css = ''
    try:
        projectName = getLatestScreenshot(userId)['projectName']
    except:
        projectName = ''

    try:
        allProjects = getAllProjects(userId, currentUser)
        html = allProjects[0]
        css = allProjects[1]
        screenshotId = getLatestScreenshot(userId)['screenshot_id']
        projectName = getLatestScreenshot(userId)['projectName']
        page = str(getScreenshotName('screenshots', userId, str(screenshotId))[int(len(str(currentUser))) + 7:])
        screenshotName = str(
            getScreenshotName('screenshots', userId, str(screenshotId))[int(len(str(currentUser))) + 7:-4])
        myfile = str(getScreenshotName('screenshots', userId, str(screenshotId)))
    except:
        screenshotId = ''
        screenshotName = 'None at this point'
        page = 'None at this point'
        # write_into_display_div(currentUser, None)
        myfile = None
    if screenshotName == '':
        screenshotId = ''
        screenshotName = 'None at this point'
        page = 'None at this point'
        # write_into_display_div(currentUser, None)
        myfile = None

    if request.GET:
        if str(request.GET['name']) == 'newWorkflowIndex':
            source = request.GET['source'][2:]
            target = request.GET['target']
            screenName = request.GET['screenname']
            screen = db.screenshots.find_one({'pageName': str(screenName), 'user_id': userId})
            myfile = str(screen['image'])
            screenshotId = str(screen['_id'])
            db.styles.update({'segmentation_id': str(source)}, {'$set': {'link': str(target)}})
        elif str(request.GET['name']) == 'getLocked':

            def getOneActive(type, id):
                return db[type].find_one({'seg_id': id, 'state': 'active'})

            def getOneActiveNew(id):
                return db['newElements'].find_one({'class_id': id, 'state': 'active'})

            ids = []
            state = []

            col = db['newElements'].find({'screenshot_id': screenshotId})
            for doc in col:
                ids.append(str(doc['class_id']))

            collection = db['segmentation'].find({'screenshot_id': screenshotId})
            for document in collection:
                ids.append(str(document['_id']))

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
                elif getOneActiveNew(id) is not None:
                    state.append([id, getOneActiveNew(id)['locked']])

            return HttpResponse(json.dumps(state), content_type="application/json")
        elif str(request.GET['name']) == 'initialState':
            req = request.GET
            secHeight = float(req['heightSection'])
            secWidth = float(req['widthSection'])

            request.session['height'] = str(secHeight)
            request.session['width'] = str(secWidth)
            try:
                screenshotId = getLatestScreenshot(userId)['screenshot_id']
                device = db.screenshots.find_one({'_id': ObjectId(screenshotId)})['device_type']

            except:
                screenshotId = ''

            return html_render('customize/page2.html', currentUser, page, projectName, request, screenshotName, userId,
                               screenshotId, layoutIsBeingTransferd, colorIsBeingTransferd, workflowBeingMagic, html,
                               css, 'none')
        elif str(request.GET['name']) == 'fullscreen':
            backgroundColor = db.backgrounds.find_one({'screenshot_id': screenshotId})['background']
            return HttpResponse(json.dumps(backgroundColor), content_type="application/json")
        elif str(request.GET['name']) == 'getProjectName':
            projects = db.projects.find_one({'user_id': userId})
            if projects is None:
                pass
            else:
                projects = projects['projectName']

            return HttpResponse(json.dumps(projects), content_type="application/json")
        elif str(request.GET['name']) == 'getPages':
            pages = []
            screenshotId = list(db.screenshots.find({'user_id': userId}))
            size = int(len(screenshotId) - 1)
            project = db.projects.find_one({'user_id': userId, 'projectName': projectName})
            while size >= 0:
                for screenid in project['screenshots']:
                    if str(screenshotId[size]['_id']) == str(screenid):
                        if str(screenshotId[size]['status']) != 'inactive':
                            pages.append(str(screenshotId[size]['screenName']))
                size -= 1
            return HttpResponse(json.dumps(pages), content_type="application/json")
        elif str(request.GET['name']) == 'checkState':
            state = str(request.GET['state'])
            result = db.tempPage.find_one({'userId': userId})[state]
            return HttpResponse(json.dumps(result), content_type="application/json")
        elif str(request.GET['name']) == 'checkDeviceType':
            try:
                dstat = str(request.GET['state'])
                result = db.tempPage.find_one({'userId': userId})[dstat]
                return HttpResponse(json.dumps(result), content_type="application/json")
            except: pass
        elif str(request.GET['name']) == 'getMode':
            arrayAD = []
            try:
                getScreenId = db.tempPage.find_one({'projectName': projectName})['screenshot_id']
                getBI = db.backgrounds.find_one({'screenshot_id': getScreenId})
                getAngle = getBI['text-angle']
                getDirection = getBI['text-direction']
                arrayAD.append({
                    'angle': getAngle,
                    'direction': getDirection
                })
            except: pass
            return HttpResponse(json.dumps(arrayAD), content_type="application/json")
        elif str(request.GET['name']) == 'getUserActivity':
            getUserActivity = db.tempPage.find_one({'userId': userId})['current_device_page']
            return HttpResponse(json.dumps(getUserActivity), content_type="application/json")
        elif str(request.GET['name']) == 'projectsLibraryDB':
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
            return HttpResponse(json.dumps(pages), content_type="application/json")
        elif str(request.GET['name']) == 'getImgLibAllProj':
            try:
                curProj = str(request.GET['curProj'])
                imgPages = []
                imgName = []
                imgType = []
                imgSize = []
                imgLM = []
                allProjectL = list(db.saveImageLibrary.find({'userId': userId, 'projectName': curProj.lower()}))
                sizeL = int(len(allProjectL))
                recproject = db.saveImageLibrary.find_one({'userId': userId, 'projectName': curProj.lower()})
            except:
                imgPages = []
                imgName = []
                imgType = []
                imgSize = []
                imgLM = []
                allProjectL = list(db.saveImageLibrary.find({'userId': userId, 'projectName': projectName.lower()}))
                sizeL = int(len(allProjectL))
                recproject = db.saveImageLibrary.find_one({'userId': userId, 'projectName': projectName.lower()})
            while sizeL > 0:
                for pathDir in recproject['path']:
                    inte = sizeL - 1
                    if inte >= 0:
                        projectsN = str(allProjectL[inte]['path'])
                        fileN = str(allProjectL[inte]['originalFileName'])
                        fileTL = str(allProjectL[inte]['fileType'])
                        fileSL = str(allProjectL[inte]['fileSize'])
                        fileLML = str(allProjectL[inte]['fileLastModified'])
                        imgPages.append('/static/users/' + projectsN)
                        imgName.append(fileN)
                        imgType.append(fileTL)
                        imgSize.append(fileSL)
                        imgLM.append(fileLML)
                    sizeL -= 1
            return (
                HttpResponse(json.dumps([imgPages, imgName, imgType, imgSize, imgLM]), content_type="application/json"))
        elif str(request.GET['name']) == 'getLastSelectedProj':
            arrayCurProj = []
            try:
                lastSelectedproject = db.lastActivityLibrary.find_one({'user': userId})['currentlySelectedProj']
                arrayCurProj.append(str(lastSelectedproject))
            except: pass
            return HttpResponse(json.dumps(arrayCurProj), content_type="application/json")


        else:
            rewritePage(currentUser, myfile, screenshotId, screenshotName, 'load')

    if request.POST:

        if 'createNewProject' in request.POST:
            project = request.POST['newProjectName']
            if project == '' or project is None:
                pass
            else:
                date = datetime.now(pytz.timezone('Australia/Melbourne'))
                db.projects.insert({'projectName': project,
                                    'user_id': userId,
                                    'screenshots': [],
                                    'status': 'pending',
                                    'comment': [],
                                    'groupCommentCode': 0,
                                    'dateCreated': str(date),
                                    'updated_date': str(date)})
                if db.tempPage.find_one({'userId': userId}) is not None:
                    db.tempPage.update({'userId': userId}, {'$set': {'projectName': project, 'screenshot_id': ''}})
                else:
                    db.tempPage.insert({
                        'userId': userId,
                        'projectName': project,
                        'screenshot_id': '',
                        'screenHeight': '',
                        'screenWidth': '',
                        'device_page': '',
                        'current_device_page': '',
                        'layoutsHeight': '',
                        'layoutsWidth': '',
                        'layoutRunning': False,
                        'colorRunning': False,
                        'maskRCNNstate': False,
                        'CNNstate': False
                    })
                db.storageLibrary.update({'user_Id': userId}, {'$set': {'text': 'Project: ' + project.title()}})
                rewritePage(currentUser, None, None, None, None)
                return redirect('/index/', code=302)

            rewritePage(currentUser, myfile, screenshotId, screenshotName, 'load')
            return html_render('customize/page2.html', currentUser, page, projectName, request, screenshotName, userId,
                               screenshotId, layoutIsBeingTransferd, colorIsBeingTransferd, workflowBeingMagic, html,
                               css, suggestionImgC)
        elif 'pageName' in request.POST:
            pageName = request.POST['pageName']
            pageId = request.POST['pageId']
            update_page_name(pageName, pageId)

        elif 'profilePictureimg' in request.FILES:
            myfile = request.FILES['profilePictureimg']
            fs = FileSystemStorage()
            fs.delete(str(currentUser) + '/profilePictures/pic.jpg')
            filename = fs.save(
                str(currentUser) + '/profilePictures/pic.jpg',
                myfile)
            db['user'].update({'username': request.POST['profilePicture']}, {'$set': {'profilePicture': str(filename)}})
        elif 'resourceFilename' in request.POST:
            myfileLib = request.FILES['myResourcefile']
            selectedProject = request.POST['projectuploadResource']
            fileTypeL = request.POST['typeLIB']
            fileSizeL = request.POST['sizeLIB']
            fileLModifiedL = request.POST['lastModifiedLIB']
            fs = FileSystemStorage()
            filename = fs.save(str(currentUser) + '/library/' + selectedProject.lower() + '/' + myfileLib.name,
                               myfileLib)
            db.saveImageLibrary.insert({
                'userId': userId,
                'projectName': selectedProject.lower(),
                'path': filename,
                'originalFileName': str(myfileLib)[:-4],
                'fileType': fileTypeL,
                'fileSize': fileSizeL,
                'fileLastModified': fileLModifiedL
            })
            db.lastActivityLibrary.update({'user': userId},
                                          {'$set': {'currentlySelectedProj': selectedProject.lower()}})
        else:
            # try:
            if str(request.POST['name']) == 'goToPage':
                name = request.POST['page']
                if name == '' or name is None:
                    pass
                else:
                    screenshotId = str(db.screenshots.find_one({'user_id': userId, 'pageName': name})['_id'])
                    setScreenshot(userId, screenshotId, projectName)

                rewritePage(currentUser, myfile, screenshotId, screenshotName, 'load')

            elif str(request.POST['name']) == 'setProjectName':
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

        return html_render('customize/page2.html', currentUser, page, projectName, request, screenshotName, userId,
                           screenshotId, layoutIsBeingTransferd, colorIsBeingTransferd, workflowBeingMagic, html, css,
                           suggestionImgC)

    try:
        r = rewritePage(currentUser, myfile, screenshotId, screenshotName, 'load')
        return html_render('customize/page2.html', currentUser, page, projectName, request, screenshotName, userId,
                           screenshotId, layoutIsBeingTransferd, colorIsBeingTransferd, workflowBeingMagic, html, css,
                           suggestionImgC)
    except: pass
    return html_render('customize/page2.html', currentUser, page, projectName, request, screenshotName, userId,
                       screenshotId, layoutIsBeingTransferd, colorIsBeingTransferd, workflowBeingMagic, html, css,
                       suggestionImgC)


@login_required(login_url='/login')
@csrf_exempt
def projects(request):
    currentUser = str(request.user)
    userId = getCollectionIDs('user', currentUser)

    if request.POST:
        if 'createProject' in request.POST:
            project = request.POST['projectName']
            if project == '' or project is None:
                pass
            else:
                date = datetime.now(pytz.timezone('Australia/Melbourne'))
                db.projects.insert({'projectName': project,
                                    'user_id': userId,
                                    'screenshots': [],
                                    'status': 'pending',
                                    'comment': [],
                                    'groupCommentCode': 0,
                                    'dateCreated': str(date)})
                if db.tempPage.find_one({'userId': userId}) is not None:
                    db.tempPage.update({'userId': userId}, {'$set': {'projectName': project, 'screenshot_id': ''}})
                else:
                    db.tempPage.insert({
                        'userId': userId,
                        'projectName': project,
                        'screenshot_id': '',
                        'screenHeight': '',
                        'screenWidth': '',
                        'device_page': '',
                        'current_device_page': '',
                        'layoutsHeight': '',
                        'layoutsWidth': '',
                        'layoutRunning': False,
                        'colorRunning': False,
                        'maskRCNNstate': False,
                        'CNNstate': False
                    })
                rewritePage(currentUser, None, None, None, None)
                return redirect('/index/', code=302)
        elif 'selectProject' in request.POST:
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
            db.tempPage.update({'userId': userId},
                               {'$set': {'projectName': project['projectName'], 'screenshot_id': screenshotid}})

            return redirect('/index/', code=302)
        elif 'selectCollaboratingProject' in request.POST:
            return redirect('/index/', code=302)

        elif 'deleteProject' in request.POST:
            projectId = request.POST['deleteProject']
            db.projects.update({'_id': ObjectId(projectId)}, {'$set': {'status': 'inactive'}})
            project = db.projects.find_one({'user_id': userId, 'status': 'pending'})
            try:
                if project['status'] != 'inactive':
                    latestProject = project['projectName']
                    screenid = project['screenshots'][0]
            except:
                latestProject = ''
                screenid = ''

            db.tempPage.update({'userId': userId}, {'$set': {'projectName': latestProject, 'screenshot_id': screenid}})
            return redirect('/projects/', code=302)

    return render(request, 'customize/includes/projectSelector.html',
                  {
                      'projects': getProjects(userId),
                      'userName': currentUser,
                      'currentProfilePic': getUserPicture(currentUser)
                  })


def getAllProjects(userId, currentUser):
    var = []
    # screens = db.screenshots.find({'user_id':userId})
    project = db.tempPage.find_one({'userId': userId})
    screenids = db.projects.find_one({'user_id': userId, 'projectName': project['projectName']})
    for id in screenids['screenshots']:
        screen = db.screenshots.find_one({'_id': ObjectId(str(id))})
        if screen['status'] != 'inactive':
            var.append([screen['image'][int(len(str(currentUser))) + 7:-4], screen['pageName'], screen['screenName']])
    html = []
    css = []

    import codecs
    for page in var:
        try:
            pagehtml = codecs.open('./static/users/' + currentUser + '/pages/' + page[0] + '/testing.html',
                                   mode='r', encoding='UTF-8')
            pagename = page[2]
            html.append([pagename, pagehtml.read()])
            pagehtml.close()
        except:
            html.append('')
        try:
            css.append(pagecss.read())
            pagecss.close()
        except:
            css.append('')
    return html, css


def html_render(url, currentUser, page, projectName, request, screenshotName, userId, screenId, layoutIsBeingTransferd,
                colorIsBeingTransferd, workflowBeingMagic, html, css, ScreenSIDFDJANGO):
    return render(request, url,
                  {
                      'pageArray': fillPageArray(userId, projectName),
                      'projectName': projectName.capitalize(),
                      'page': page,
                      'userName': currentUser,
                      'currentProfilePic': getUserPicture(currentUser),
                      'projects': getProjects(userId),
                      'projectsHTML': html,
                      'projectsCSS': css,
                      'aniStyles': getStylesDb(),
                      'assignProjects': getAssignedProject(userId),
                      'notifyProject': notification_project(userId),
                      'chatHireuserList': get_chat_user_from_hiring_table(userId),
                      'guestalllists': guestlist(request),
                      'finalMongoUsers': getMongoUserExceptCurrentUser(currentUser),
                      'users': finaluserssqlite(request),
                      'activeProject': active_project(userId, projectName),
                      'proComments': get_all_projects_comments_user(userId, projectName)
                  })


def getStylesDb():
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
    except: pass
    return sty


def getScreen_Name(screenshotName):
    sName = ''
    try:
        scName = db.screenshots.find_one({'pageName': screenshotName})
        sName = scName['screenName']
    except: pass

    return sName


def getProjects(userId):
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

                # screen = (' / '.join(repr(e) for e in screens))
                screen = screens
                length = len(screens)
        if project['status'] != 'inactive':
            jsonProjects.append({
                'id': str(project['_id']),
                'status': str(project['status']),
                'projectName': project['projectName'].capitalize(),
                'user_id': project['user_id'],
                'screenshotsamount': length,
                'screenshots': screen,
                'dateCreated': (project['dateCreated'])
            })

    return jsonProjects


def rewritePage(currentUser, myfile, screenshotId, screenshotName, state):
    if myfile is None:
        # write_into_display_div(currentUser, screenshotName)
        cache.clear()
    NoCachingMiddleware()

    return "rewrited"


def fillPageArray(userId, projectName):
    pageArray = []
    # screenshotId = list(db.screenshots.find({'user_id': userId}))
    # size = int(len(screenshotId)-1)
    project = db.projects.find_one({'user_id': userId, 'projectName': projectName})
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
    except: pass

    return pageArray
