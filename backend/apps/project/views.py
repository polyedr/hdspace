import random
import string
import pytz
from datetime import datetime

from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required
from django.http import HttpResponse
from django.views.decorators.csrf import csrf_exempt
from django.core.mail import send_mail

from .models import *
from users.models import *
from chat.models import *
from virtualize.models import *
from login_mongo.models import *
from color_transfer.views import rewritePage


@login_required(login_url='/login')
@csrf_exempt
def projects(request):
    currentUser = str(request.user)
    userId = getCollectionIDs('user', currentUser)
    try:
        projectName = getLatestScreenshot(userId)['projectName']
    except:
        projectName = ''
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
                                    'dateCreated': date,
                                    'comment': [],
                                    'updated_date': date})
                db.tempPage.update({'userId': userId}, {'$set': {'projectName': project, 'screenshot_id': ''}})
                rewritePage(currentUser, None, None, None, None)
                return redirect('/projects/', code=302)
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
            db.tempPage.update({'userId': userId},
                               {'$set': {'projectName': project['projectName'], 'screenshot_id': screenshotid}})
            # rewritePage(currentUser, None, None, None, None)
            return redirect('/index/', code=302)

        elif 'deleteProject' in request.POST:
            projectId = request.POST['deleteProject']
            db.projects.update({'_id': ObjectId(projectId)}, {'$set': {'status': 'inactive'}})
            project = db.projects.find_one({'user_id': userId, 'status': 'pending'})
            print('project')
            print(project)
            try:
                if project['status'] != 'inactive':
                    latestProject = project['projectName']
                    screenid = project['screenshots'][0]
            except:
                latestProject = ''
                screenid = ''

            db.tempPage.update({'userId': userId}, {'$set': {'projectName': latestProject, 'screenshot_id': screenid}})
            return redirect('/projects/', code=302)

    chatuserHire = get_chat_user_from_hiring_table(userId)
    notifyPro = notification_project(userId)

    return render(request, 'customize/includes/projectSelector.html',
                  {
                      'projects': getProjects(userId),
                      'users': finaluserssqlite(request),
                      'finalMongoUsers': getMongoUserExceptCurrentUser(currentUser),
                      'guestalllists': guestlist(request),
                      'userName': currentUser,
                      'assignProjects': getAssignedProject(userId),
                      'notifyProject': notifyPro,
                      'assign': assignedProjectByYou(userId),
                      'hiringtable': getallHiringTable(),
                      'chatHireuserList': chatuserHire,
                      'currentProfilePic': getUserPicture(currentUser),
                      'activeProject': active_project(userId, projectName)
                  })


# Featch all user after select project
def userContacts(request):
    currentUser = str(request.user)
    userId = getCollectionIDs('user', currentUser)
    try:
        projectName = getLatestScreenshot(userId)['projectName']
    except:
        projectName = ''
    jsonUserss = []
    jsonHire = []
    thisty = ''
    currentuser = ''
    pname = ''
    if request.method == 'POST':
        pid = request.POST['selectProject']
        pname = request.POST['pname']
        userid = ""

        thisty = pid
        currentuser = request.user.username
        currentid = request.user.id
        cuser = getUserObj(currentuser)
        for cu in cuser:
            currentId = cu['_id']

        users = getAllUsers(currentuser)

        for us in users:
            try:
                jsonUserss.append({
                    'id': str(us['_id']),
                    'username': us['username'],
                    'firstName': us['firstName'],
                    'lastName': us['lastName'],
                    'email': us['email'],
                    'accountType': us['accountType'],
                    'profilePic': getUserPicture(us['username'])})
            except:
                continue

        hire = checkHireStatus(pid)
        for h in hire:
            try:
                jsonHire.append({
                    'id': str(h['_id']),
                    'projectid': h['projectid'],
                    'projectName': h['projectName'],
                    'hiredBy': h['hiredBy'],
                    'hiredByid': h['hiredByid'],
                    'hireduserid': h['hireduserid'],
                    'status': h['status'],
                    'accept_status': h['accept_status'],
                    'hire_date': h['hire_date']})
            except:
                continue

    chatuserHire = get_chat_user_from_hiring_table(userId)
    notifyPro = notification_project(userId)

    return render(request, 'customize/includes/userContacts.html',
                  {
                      'alluserInfo': jsonUserss,
                      'users': finaluserssqlite(request),
                      'finalMongoUsers': getMongoUserExceptCurrentUser(currentUser),
                      'guestalllists': guestlist(request),
                      'projectid': thisty,
                      'userName': currentuser,
                      'projectname': pname,
                      'hiredetails': jsonHire,
                      'projects': getProjects(userId),
                      'notifyProject': notifyPro,
                      'assignProjects': getAssignedProject(userId),
                      'chatHireuserList': chatuserHire,
                      'currentProfilePic': getUserPicture(currentuser),
                      'activeProject': active_project(userId, projectName)
                  })


# Assign project to anyone by you details, Param: userId (current login user id)
def assignedProjectByYou(userId):
    jsonAssignProjectBy = []
    hire = db.hiringDetails.find({'hiredByid': userId})
    for ha in hire:
        jsonAssignProjectBy.append({
            'id': str(ha['_id']),
            'projectid': ha['projectid'],
            'projectName': ha['projectName'],
            'hiredBy': ha['hiredBy'],
            'hiredByid': ha['hiredByid'],
            'hireduserid': ha['hireduserid'],
            'hiredusername': ha['hiredusername'],
            'status': ha['status'],
            'accept_status': ha['accept_status'],
            'hire_date': ha['hire_date']})

    return jsonAssignProjectBy


# get all hiring details table record
def getallHiringTable():
    jsonAllHiringTable = []
    hire = db.hiringDetails.find({})
    for ha in hire:
        jsonAllHiringTable.append({
            'id': str(ha['_id']),
            'projectid': ha['projectid'],
            'projectName': ha['projectName'],
            'hiredBy': ha['hiredBy'],
            'hiredByid': ha['hiredByid'],
            'hireduserid': ha['hireduserid'],
            'hiredusername': ha['hiredusername'],
            'status': ha['status'],
            'accept_status': ha['accept_status'],
            'hire_date': ha['hire_date']})

    return jsonAllHiringTable


def sendOutsideHireEmail(request):
    if request.method == 'GET':
        toemail = request.GET['email'];
        projectname = request.GET['projectname'];
        projectid = request.GET['projectid'];
        jsonUserobj = []
        loggedUserObj = getUserObj(str(request.user));
        random_id = ''.join([random.choice(string.ascii_letters + string.digits) for n in range(16)])
        for ob in loggedUserObj:
            jsonUserobj.append({'id': str(ob['_id']), 'username': ob['username']})

        date = datetime.now(pytz.timezone('Australia/Melbourne'))
        db.guestHiring.insert({'email': toemail,
                               'firstName': '',
                               'lastName': '',
                               'user_type': 'guest',
                               'owner_id': jsonUserobj[0]['id'],
                               'project_id': projectid,
                               'guest_id': random_id,
                               'hired_at': date})

        res = send_mail("Hello someone",
                        "You have got new project from Adevi. Please visit given link and go through the details. <a href='http://localhost:7000/guest/?email=" + toemail + "&pname=" + projectname + "&gid=" + random_id + "&oid=" +
                        jsonUserobj[0]['id'] + "'>here</a>.", "tech2@edwayapps.com", [toemail], fail_silently=False)
        return HttpResponse('%s' % res)


# Listing all project according to user AND also get all comment/task as well
def projectDetails(request):
    if request.method == 'GET':
        print('Project Details')
        print(request.GET)
        projectid = request.GET['projectId']
        mod = request.GET['mode']
        jsonProject = []
        jsonCount = []
        project = db.projects.find_one({'_id': ObjectId(str(projectid))})
        jsonProject.append({
            'id': str(project['_id']),
            'projectName': project['projectName'].capitalize(),
            'user_id': project['user_id'],
            'screenshots': project['screenshots'],
            'status': str(project['status']),
            'dateCreated': project['dateCreated'],
            'comment': mod,
            'updated_date': project['updated_date']
        })
        getcomments = getAllProjectCount(projectid)
        jsonCount.append({
            'count': getcomments.count()
        })
        jsonComment = getAllProjectsSubTask(projectid, mod)

        return render(request, 'customize/includes/toProject.html',
                      {'oneProjects': jsonProject, 'allcomments': jsonComment, 'taskCount': jsonCount})


# insert new comment and save in DB
def projectComments(request):
    if request.method == 'GET':
        if request.GET['name'] == 'subTask':
            print('Sub')
            print(request.GET)
            projectid = request.GET['projectId']
            mod = request.GET['mode']
            jsonPro = []
            project = singleProjectName(projectid)
            currentuser = request.user.username
            comment = request.GET['comment']
            opposite_id = oppositeUserId(projectid)
            mongoId = getMongoIdProject(request)
            title_n = db.projectComment.find_one({'task_mode': str(mod)})['title']
            if not mongoId:
                if mongoId == opposite_id['hiredByid']:
                    passid = opposite_id['hireduserid']
                elif mongoId == opposite_id['hireduserid']:
                    passid = opposite_id['hiredByid']
            else:
                passid = ""

            date = datetime.now(pytz.timezone('Australia/Melbourne'))
            db.projectTask.insert({'project_id': projectid,
                                   'group_id': str(mod),
                                   'projectName': project['projectName'],
                                   'title_group': title_n,
                                   'comment': comment,
                                   'status': 'pending',
                                   'action_by': mongoId,
                                   'other_user_id': passid,
                                   'createTaskUser': currentuser,
                                   'editTaskUser': '',
                                   'doneTaskUser': '',
                                   'action': 'added_new_task',
                                   'created_at': date,
                                   'updated_date': date})
        else:
            print('New Comment')
            print(request.GET)
            projectid = request.GET['projectId']
            mod = request.GET['mode']
            jsonPro = []
            project = singleProjectName(projectid)
            currentuser = request.user.username
            comment = request.GET['comment']
            title = request.GET['title']
            opposite_id = oppositeUserId(projectid)
            mongoId = getMongoIdProject(request)
            if not mongoId:
                if mongoId == opposite_id['hiredByid']:
                    passid = opposite_id['hireduserid']
                elif mongoId == opposite_id['hireduserid']:
                    passid = opposite_id['hiredByid']
            else:
                passid = ""

            date = datetime.now(pytz.timezone('Australia/Melbourne'))
            db.projectComment.insert({'project_id': projectid,
                                      'projectName': project['projectName'],
                                      'title': title,
                                      'comment': comment,
                                      'status': 'pending',
                                      'action_by': mongoId,
                                      'other_user_id': passid,
                                      'createTaskUser': currentuser,
                                      'editTaskUser': '',
                                      'doneTaskUser': '',
                                      'action': 'added_new_task',
                                      'created_at': date,
                                      'task_mode': mod,
                                      'updated_date': date})
            db.projects.update({'_id': ObjectId(projectid)}, {
                '$set':
                    {
                        'groupCommentCode': mod
                    }
            })

        return HttpResponse("success")


# For edit comment and update in DB
def editComment(request):
    if request.method == 'GET':
        commentid = request.GET['commentid']
        comment = request.GET['comment']
        mongoId = getMongoIdProject(request)
        currentuser = request.user.username
        date = datetime.now(pytz.timezone('Australia/Melbourne'))
        db.projectTask.update({'_id': ObjectId(commentid)}, {
            '$set': {'comment': comment, 'action_by': mongoId, 'editTaskUser': currentuser, 'action': 'edit_task',
                     'updated_date': date}})

        return HttpResponse("success")


# For update the task in done or pending
def completeProject(request):
    if request.method == 'GET':
        print('Comment Complete')
        print(request)
        commentid = request.GET['commentid']
        status = request.GET['status']
        dictJ = []
        mongoId = getMongoIdProject(request)
        currentuser = request.user.username
        date = datetime.now(pytz.timezone('Australia/Melbourne'))
        if status == 'pending':
            db.projectTask.update({'_id': ObjectId(commentid)}, {'$set': {'status': 'pending', 'updated_date': date}})
        elif status == 'done':
            db.projectTask.update({'_id': ObjectId(commentid)}, {
                '$set': {'status': 'done', 'action_by': mongoId, 'doneTaskUser': currentuser, 'action': 'done_task',
                         'updated_date': date}})

        return HttpResponse(status)


# Calculate complete project percentage
def getPercentage(request):
    if request.method == 'GET':
        print('Inside Precentage')
        print(request)
        projectId = request.GET['projectId']
        group = request.GET['groupId']
        pending = getAllProjectsCommentsCount(projectId, group)
        done = getDoneComments(projectId, group)
        calculate = calculationPercentage(done, pending)

        return HttpResponse(calculate)


# Update after accept project
def acceptedProject(request):
    if request.method == 'GET':
        hireid = request.GET['hireid']
        db.hiringDetails.update({'_id': ObjectId(hireid)}, {'$set': {'accept_status': 'accepted'}})

        return HttpResponse("suucess")


# Update after decline project
def declinedProject(request):
    if request.method == 'GET':
        hireid = request.GET['hireid']
        db.hiringDetails.remove({'_id': ObjectId(hireid)})

        return HttpResponse("suucess")


# get all hiring details table record
def commentsActivity(request):
    print('Comment Activity')
    print(request)
    if request.method == 'GET':
        jsonToday = []
        jsonYesterday = []
        mongoId = getMongoIdforProject(request)
        projectId = getActiveProjectId(request)

        activity = db.projectTask.find({
            '$or': [{
                'action_by': mongoId,
                'project_id': projectId
            }, {
                'other_user_id': mongoId,
                'project_id': projectId
            }]
        }).sort([("updated_date", -1)])

        for act in activity:
            jsonToday.append(act)

        # return HttpResponse(jsonToday)
        return render(request, 'customize/includes/toActivity.html', {'allactivity': jsonToday})


def getMongoIdProject(request):
    jsonCurrentid = []
    currentuser = request.user.username
    fromImage = getUserPicture(currentuser);
    cuser = getUserObj(currentuser)
    for cu in cuser:
        jsonCurrentid.append({'id': str(cu['_id'])})

    abcurrentid = jsonCurrentid[0]

    return abcurrentid['id']


def getMongoIdforProject(request):
    jsonCurrentid = []
    currentuser = request.user.username
    cuser = getUserObj(currentuser)
    for cu in cuser:
        jsonCurrentid.append({'id': str(cu['_id'])})

    abcurrentid = jsonCurrentid[0]
    return abcurrentid['id']


def getActiveProjectId(request):
    currentUser = request.user
    userId = getCollectionIDs('user', currentUser)
    try:
        projectName = getLatestScreenshot(userId)['projectName']
    except:
        projectName = ''
    if projectName != '':
        id = db.projects.find_one({'projectName': str(projectName)})
    return str(id['_id'])
