import pymongo
from datetime import datetime
import pytz

from virtualize.views import rewritePage

client = pymongo.MongoClient('localhost', 27017)  # maxPoolSize=50
db = client.MeduzaDb
db_main = client.mainDB


def create_project_data_db(project, secundary_id, current_user):
    user_id = str(db_main.auth_user.find_one({'username':str(current_user)})['_id'])
    date = datetime.now(pytz.timezone('Australia/Melbourne'))
    db.projects.insert({'projectName': project,
                        'user_id': user_id,
                        'secundary_id': secundary_id,
                        'screenshots': [],
                        'status': 'pending',
                        'dateCreated': str(date)})
    if db.tempPage.find_one({'userId': user_id}) is not None:
        db.tempPage.update({'userId': user_id}, {'$set': {'projectName': project, 'screenshot_id': ''}})
    else:
        db.tempPage.insert({
            'userId': user_id,
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
    rewritePage(current_user, None, None, None, None)


def delete_project_data_db(project_secundary_id, current_user):
    user_id = str(db_main.auth_user.find_one({'username': str(current_user)})['_id'])
    db.projects.update({'secundary_id': project_secundary_id}, {'$set': {'status': 'inactive'}})
    project = db.projects.find_one({'user_id': user_id, 'status': 'pending'})
    try:
        if project['status'] != 'inactive':
            latestProject = project['projectName']
            screenid = project['screenshots'][0]
    except:
        latestProject = ''
        screenid = ''
    db.tempPage.update({'userId': user_id}, {'$set': {'projectName': latestProject, 'screenshot_id': screenid}})


def select_project(current_user, secundary_id):
    user_id = str(db_main.auth_user.find_one({'username': str(current_user)})['_id'])
    project = db.projects.find_one({'secundary_id': int(secundary_id)})
    if len(project['screenshots']) == 0:
        screenshotid = ''
    else:
        screenshotid = project['screenshots'][0]

    db.tempPage.update({'userId': user_id}, {'$set': {'projectName': project['projectName'],
                                                      'screenshot_id': screenshotid}})
