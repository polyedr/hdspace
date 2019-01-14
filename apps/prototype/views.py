import pymongo

from bson.objectid import ObjectId
from django.http import HttpResponse, HttpResponseRedirect

from apps.virtualize.models import setScreenshot, getScreenshotName, getCollectionIDs, getLatestScreenshot
from apps.virtualize.views import getProjectPageAndCss



client = pymongo.MongoClient('localhost', 27017)  # maxPoolSize=50
db = client.MeduzaDb
db_main = client.mainDB

def prototypePage(request):
    try:
        print('I am called to change the page')
        print(request.GET['link'])
        page = request.GET['link']
        currentUser = str(request.user)
        userId = getCollectionIDs('accounts_user', currentUser)
        screenshots = db.screenshots.find({'user_id': userId, 'pageName': page})

        projectName = getLatestScreenshot(userId)['projectName']
        project = db_main.projects_project.find_one({'name': projectName, 'user_id': ObjectId(userId)})['screenshots']
        print('check over here')
        for screen in screenshots:
            print(str(screen['_id']))
            if str(screen['_id']) in project:
                print('I am the correct one: ' + str(screen['_id']))
                screenshotId = str(screen['_id'])
                setScreenshot(userId, screenshotId, projectName)
                screenshotName = str(
                getScreenshotName('screenshots', userId, str(screenshotId))[int(len(str(currentUser))) + 7:-4])
        curProject = getProjectPageAndCss(screenshotName, currentUser, projectName)
        jsondata = []
        jsondata.append(curProject[0])
        jsondata.append(curProject[1])
        import json
        return HttpResponse(json.dumps(jsondata), content_type="application/json")
    except:
        return HttpResponseRedirect('/index')