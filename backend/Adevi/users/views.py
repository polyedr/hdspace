import json
from django.shortcuts import render
from loginMongo.models import *
from users.models import *
from django.contrib.auth.models import User
from django.core.mail import send_mail
from django.http import HttpResponse

def allUsers(request):
	users = User.objects.all()
	return render(request, 'customize/includes/rightSidebarUpdated.html', {
                    'userInfo': users })


# Send Hire email
def sendHireEmail(request):
	if request.method == 'GET':
		jsonCurrentid = []
		toemail = request.GET['email']
		hireduserid = request.GET['userid']
		projectid = request.GET['pid']
		username = request.GET['username']
		projectdetails = getProjectdetails(projectid)
		for p in projectdetails:
			pname = p['projectName']

		currentuser = request.user.username
		cuser = getUserObj(currentuser)
		for cu in cuser:
			jsonCurrentid.append({'id': str(cu['_id'])})

		abcurrentid = jsonCurrentid[0]
		try:
			res = send_mail("hello", "I am hiring you for "+pname+" project.", "tech2@edwayapps.com", [toemail], fail_silently=False)
		except:
			res = 'Sent'
		date = datetime.now(pytz.timezone('Australia/Melbourne'))
		db.hiringDetails.insert({'projectid': projectid,
			'projectName': pname,
			'hiredBy': currentuser,
			'hiredByid': abcurrentid['id'],
			'hireduserid': hireduserid,
			'hiredusername': username,
			'status': 'running',
			'accept_status': 'not_accepted',
			'hire_date': date})
		return HttpResponse('%s'%res)

# For delete project on Project page
def deleteproject(request):
	if request.method == 'GET':
		projectid = request.GET['pid'];
		db.projects.remove( { '_id': ObjectId(projectid) } )

	return HttpResponse('success')