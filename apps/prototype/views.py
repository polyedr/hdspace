import pymongo

from django.http import HttpResponse, HttpResponseRedirect

from virtualize.models import setScreenshot, getScreenshotName, getCollectionIDs, getLatestScreenshot
from virtualize.views import getProjectPageAndCss



client = pymongo.MongoClient('localhost', 27017)  # maxPoolSize=50
db = client.MeduzaDb

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