import sqlite3

from mongoengine import *
from pymongo import MongoClient
from bson.objectid import ObjectId

# sqlite client
conn_sqlite = sqlite3.connect('UserSessions.sqlite', check_same_thread=False)
cursor_sqlite = conn_sqlite.cursor()

client = MongoClient('localhost', 27017)
db = client.MeduzaDb


def get_all_projects():
    return db.projects.find({})


def get_all_projects_comments(projectid, mod):
    jsonComment = []
    getcomments = db.projectTask.find({"project_id": projectid, "group_id": str(mod)})
    for gc in getcomments:
        jsonComment.append({
            'id': str(gc['_id']),
            'project_id': gc['project_id'],
            'comment': gc['comment'],
            'title': gc['title'],
            'status': gc['status'],
            'created_at': gc['created_at'],
            'updated_date': gc['updated_date']
        })
    return jsonComment


def get_all_projects_sub_task(projectid, mod):
    jsonComment = []
    getcomments = db.projectTask.find({"project_id": projectid, "group_id": str(mod)})
    for gc in getcomments:
        jsonComment.append({
            'id': str(gc['_id']),
            'project_id': gc['project_id'],
            'group': gc['group_id'],
            'comment': gc['comment'],
            'status': gc['status'],
            'created_at': gc['created_at'],
            'updated_date': gc['updated_date']
        })
    return jsonComment


def get_all_projects_comments_user(userId, projectName):
    jsonComment = []

    project = db.projects.find_one({'user_id': str(userId), 'projectName': str(projectName)})
    try:

        getcomments = db.projectComment.find({"project_id": str(project['_id'])})

        for gc in getcomments:
            pending = get_all_projects_comments_count(str(project['_id']), gc['task_mode'])
            done = get_done_comments(str(project['_id']), gc['task_mode'])
            calculate = calculation_percentage(done, pending)
            jsonComment.append({
                'id': str(gc['_id']),
                'project_id': gc['project_id'],
                'comment': gc['comment'],
                'title': gc['title'],
                'status': gc['status'],
                'created_at': gc['created_at'],
                'updated_date': gc['updated_date'],
                'task_mode': gc['task_mode'],
                'percentage': calculate
            })
    except:
        pass

    return jsonComment


def get_all_percentage(userId, projectName):
    project = db.projects.find_one({'user_id': str(userId), 'projectName': str(projectName)})
    total = 0
    number = 0
    try:

        getcomments = db.projectComment.find({"project_id": str(project['_id'])})

        for gc in getcomments:
            pending = get_all_projects_comments_count(str(project['_id']), gc['task_mode'])
            done = get_done_comments(str(project['_id']), gc['task_mode'])
            calculate = calculation_percentage(done, pending)
            total += calculate
            number += 1

    except:
        pass

    if number == 0:
        p = 0
    else:
        p = total / number

    return round(p)


def get_all_projects_sub_task_user(userId, projectName):
    jsonComment = []

    project = db.projects.find_one({'user_id': str(userId), 'projectName': str(projectName)})
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
                'task_mode': gc['task_mode']
            })
    except:
        pass

    return jsonComment


def get_all_project_count(projectid):
    return db.projectComment.find({"project_id": projectid})


def get_all_projects_comments_count(projectid, group):
    return db.projectTask.find({"project_id": projectid, 'group_id': str(group)}).count()


def get_pending_comments(projectid):
    return db.projectTask.find({"project_id": projectid, 'status': 'pending'}).count()


def get_done_comments(projectid, group):
    return db.projectTask.find({"project_id": projectid, 'group_id': str(group), 'status': 'done'}).count()


def calculation_percentage(x, y):
    if y == 0:
        per = 0
    else:
        per = (x * 100) / y
    return round(per)


def single_project_name(projectid):
    return db.projects.find_one({'_id': ObjectId(projectid)}, {"projectName": 1})


def opposite_user_id(projectid):
    return db.hiringDetails.find_one({'projectid': projectid}, {"hiredByid": 1, "hireduserid": 1})


# get assign project details, Param: userId (current login user id)
def getAssignedProject(userId):
    jsonAssignProject = []
    hire = db.hiringDetails.find({'hireduserid': userId})
    for ha in hire:
        jsonAssignProject.append({
            'id': str(ha['_id']),
            'projectid': ha['projectid'],
            'projectName': ha['projectName'],
            'hiredBy': ha['hiredBy'],
            'hiredByid': ha['hiredByid'],
            'hireduserid': ha['hireduserid'],
            'status': ha['status'],
            'accept_status': ha['accept_status'],
            'hire_date': ha['hire_date']})

    return jsonAssignProject


def active_project(userId, projectN):
    jsonProject = []
    project = db.projects.find_one({'user_id': str(userId), 'projectName': str(projectN)})
    p = get_all_percentage(userId, projectN)
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
        pass

    return jsonProject


# get all project list for /projects page
def get_projects(userId):
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


# Notification for new project, if not accepted
def notification_project(userId):
    jsonNotificationProject = []
    hire = db.hiringDetails.find({'hireduserid': userId, 'accept_status': 'not_accepted'})
    for ha in hire:
        jsonNotificationProject.append({
            'id': str(ha['_id']),
            'projectid': ha['projectid'],
            'projectName': ha['projectName'],
            'hiredBy': ha['hiredBy'],
            'hiredByid': ha['hiredByid'],
            'hireduserid': ha['hireduserid'],
            'status': ha['status'],
            'accept_status': ha['accept_status'],
            'hire_date': ha['hire_date']})

    return jsonNotificationProject
