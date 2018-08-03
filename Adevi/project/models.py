import pytz
import sqlite3
from mongoengine import *
from django.db import models
from pymongo import MongoClient
from datetime import datetime
from bson.objectid import ObjectId

#sqlite client 
conn_sqlite = sqlite3.connect('UserSessions.sqlite',check_same_thread=False)
cursor_sqlite = conn_sqlite.cursor()

client = MongoClient('localhost', 27017)
db = client.MeduzaDb

def getAllProjects(userid):
    return db.projects.find({});

def getAllProjectsComments(projectid,mod):
    jsonComment = []
    # try:
    getcomments = db.projectTask.find({"project_id": projectid,"group_id":str(mod)})
    print(getcomments)
    for gc in getcomments:
        print(gc)
        jsonComment.append({
            'id': str(gc['_id']),
            'project_id': gc['project_id'],
            'comment': gc['comment'],
            'title': gc['title'],
            'status': gc['status'],
            'created_at': gc['created_at'],
            'updated_date': gc['updated_date']
        })
    # except:
    print('No task')
    print(jsonComment)
    return jsonComment

def getAllProjectsSubTask(projectid,mod):
    jsonComment = []
    # try:
    getcomments = db.projectTask.find({"project_id": projectid,"group_id":str(mod)})
    print(getcomments)
    for gc in getcomments:
        print(gc)
        jsonComment.append({
            'id': str(gc['_id']),
            'project_id': gc['project_id'],
            'group': gc['group_id'],
            'comment': gc['comment'],
            'status': gc['status'],
            'created_at': gc['created_at'],
            'updated_date': gc['updated_date']
        })
    # except:
    print('No task')
    print(jsonComment)
    return jsonComment


def getAllProjectsCommentsUser(userId,projectName):
    jsonComment = []

    project = db.projects.find_one({'user_id':str(userId),'projectName':str(projectName)})
    print('New Commnet extration')
    print(project)
    try:

        getcomments = db.projectComment.find({"project_id": str(project['_id'])})

        for gc in getcomments:
            pending = getAllProjectsCommentsCount(str(project['_id']), gc['task_mode'])
            done = getDoneComments(str(project['_id']), gc['task_mode'])
            calculate = calculationPercentage(done, pending)
            jsonComment.append({
                'id': str(gc['_id']),
                'project_id': gc['project_id'],
                'comment': gc['comment'],
                'title': gc['title'],
                'status': gc['status'],
                'created_at': gc['created_at'],
                'updated_date': gc['updated_date'],
                'task_mode' : gc['task_mode'],
                'percentage': calculate
            })
    except:
        print('No projects')

    return jsonComment
def getAllpercentage(userId,projectName):
    project = db.projects.find_one({'user_id': str(userId), 'projectName': str(projectName)})
    total = 0
    number = 0
    try:

        getcomments = db.projectComment.find({"project_id": str(project['_id'])})

        for gc in getcomments:
            pending = getAllProjectsCommentsCount(str(project['_id']), gc['task_mode'])
            done = getDoneComments(str(project['_id']), gc['task_mode'])
            calculate = calculationPercentage(done, pending)
            total += calculate
            number +=1

    except:
        print('No projects')
    if number == 0:
        p = 0
    else:
        p = total/number

    return round(p)


def getAllProjectsSubTaskUser(userId,projectName):
    jsonComment = []

    project = db.projects.find_one({'user_id':str(userId),'projectName':str(projectName)})
    print('New Commnet extration')
    print(project)
    try:
        getcomments = db.projectTask.find({"project_id": str(project['_id'])})

        for gc in getcomments:
            jsonComment.append({
                'id': str(gc['_id']),
                'project_id': gc['project_id'],
                'comment': gc['comment'],
                'status': gc['status'],
                'created_at': gc['created_at'],
                'updated_date': gc['updated_date'],
                'task_mode' : gc['task_mode']
            })
    except:
        print('No projects')

    return jsonComment

def getAllProjectCount(projectid):
    return db.projectComment.find({"project_id": projectid})


def getAllProjectsCommentsCount(projectid,group):
    return db.projectTask.find({"project_id": projectid,'group_id':str(group)}).count();

def getPendingComments(projectid):
    return db.projectTask.find({"project_id": projectid, 'status': 'pending'}).count();

def getDoneComments(projectid,group):
    return db.projectTask.find({"project_id": projectid,'group_id':str(group), 'status': 'done'}).count();

def calculationPercentage(x, y):
    if y == 0:
        per = 0
    else:
        per = (x * 100) / y
    return round(per)

def singleProjectName(projectid):
    return db.projects.find_one({'_id': ObjectId(projectid)},{"projectName": 1})

def oppositeUserId(projectid):
    return db.hiringDetails.find_one({'projectid': projectid},{"hiredByid": 1, "hireduserid": 1})

# get assign project details, Param: userId (current login user id)
def getAssignedProject(userId):
    jsonAssignProject = []
    hire = db.hiringDetails.find({'hireduserid': userId})
    for ha in hire:
        jsonAssignProject.append({
                'id': str(ha['_id']),
                'projectid': ha['projectid'],
                'projectName': ha['projectName'],
                'hiredBy' : ha['hiredBy'],
                'hiredByid': ha['hiredByid'],
                'hireduserid': ha['hireduserid'],
                'status': ha['status'],
                'accept_status': ha['accept_status'],
                'hire_date': ha['hire_date']})
    print('Assigned Project')
    print(jsonAssignProject)

    return jsonAssignProject

def activeProject(userId,projectN):
    jsonProject = []
    project = db.projects.find_one({'user_id':str(userId), 'projectName':str(projectN)})
    print('Project')
    print(project)
    print('Active Project')
    p = getAllpercentage(userId, projectN)
    print(p)
    try:
        jsonProject.append({
            'id': str(project['_id']),
            'status': str(project['status']),
            'projectName': project['projectName'].capitalize(),
            'user_id': project['user_id'],
            'groupComments': project['groupCommentCode'],
            'dateCreated': (project['dateCreated']),
            'allPercentage': p
        })
    except:
        print('')
    print(jsonProject)

    return jsonProject

# get all project list for /projects page
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

                # screen = (' / '.join(repr(e) for e in screens))
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

# Notification for new project, if not accepted
def notifcationProject(userId):
    jsonNotificationProject = []
    hire = db.hiringDetails.find({'hireduserid': userId, 'accept_status': 'not_accepted'})
    for ha in hire:
        jsonNotificationProject.append({
                'id': str(ha['_id']),
                'projectid': ha['projectid'],
                'projectName': ha['projectName'],
                'hiredBy' : ha['hiredBy'],
                'hiredByid': ha['hiredByid'],
                'hireduserid': ha['hireduserid'],
                'status': ha['status'],
                'accept_status': ha['accept_status'],
                'hire_date': ha['hire_date']})

    return jsonNotificationProject