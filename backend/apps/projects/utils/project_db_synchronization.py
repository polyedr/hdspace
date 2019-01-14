import pymongo

from apps.virtualize.views import rewritePage

client = pymongo.MongoClient('localhost', 27017)  # maxPoolSize=50
db = client.MeduzaDb
db_main = client.mainDB


def create_project_data_db(project, secundary_id, current_user):
    user_id = db_main.accounts_user.find_one({'username': str(current_user)})['_id']
    db_main.projects_project.update({'user_id': user_id, 'name': project}, {
        '$set': {
                        'screenshots': []
        }
    })
    if db.tempPage.find_one({'userId': str(user_id)}) is not None:
        db.tempPage.update({'userId': str(user_id)}, {'$set': {'projectName': project, 'screenshot_id': ''}})
    else:
        db.tempPage.insert({
            'userId': str(user_id),
            'projectName': project,
            'screenshot_id': '',
            'screenHeight': 0.0,
            'screenWidth': 0.0,
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


def delete_project_data_db(project_id, current_user):
    user_id = db_main.accounts_user.find_one({'username': str(current_user)})['_id']
    db_main.projects_project.update({'id': project_id}, {'$set': {'status': 'inactive'}})
    project = db_main.projects_project.find_one({'user_id': user_id, 'status': 'pending'})
    print(project)
    if project is not None:
        if project['status'] != 'inactive':
            latestProject = project['name']
            if len(project['screenshots']) != 0:
                screenid = project['screenshots'][0]
            else:
                screenid = ''
        else:
            latestProject = ''
    else:
        screenid = ''
        latestProject = ''

    db.tempPage.update({'userId': str(user_id)}, {'$set': {'projectName': latestProject, 'screenshot_id': screenid}})


def select_project(current_user, project_id):
    print('Select Project')
    print(current_user)
    print(project_id)
    user_id = str(db_main.accounts_user.find_one({'username': str(current_user)})['_id'])
    project = db_main.projects_project.find_one({'id': int(project_id)})
    print(len(project['screenshots']))
    print(project['screenshots'])
    if len(project['screenshots']) == 0:
        screenshotid = ''
    else:
        screenshotid = project['screenshots'][0]

    db.tempPage.update({'userId': str(user_id)}, {'$set': {'projectName': project['name'],
                                                      'screenshot_id': screenshotid}})
