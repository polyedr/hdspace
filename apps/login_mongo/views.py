from django.shortcuts import render
from django.http import HttpResponseRedirect
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, logout
from django.contrib.auth import login as auth_login
from django.http import HttpResponse

from .form import LoginForm
from login_mongo.models import *
from users.models import *


def login(request):
    if request.method == 'POST':  # and form.is_valid():
        logErr = 'Wrong Credentials, please try again'
        username = request.POST['username']
        password = request.POST['password']

        try:
            user = authenticate(request, username=username, password=password)
            if user is not None:

                auth_login(request, user)
                return HttpResponseRedirect('/index/')
            else:
                return render(request, 'logIn/login.html', {
                    'logErr': logErr})
        except:
            logError = 'User does not exist in our records, please src.register with Adevi'
            return render(request, 'logIn/login.html', {
                'logErr': logError})
    return render(request, 'logIn/login.html', )


def register(request):
    if request.method == 'POST':
        username = request.POST['username']
        password = request.POST['password']
        confirmPassword = request.POST['confirmPassword']
        firstName = request.POST['firstName']
        lastName = request.POST['lastName']
        email = request.POST['email']
        confirmEmail = request.POST['confirmEmail']
        msg = 'e-mail confirmation has been sent to ' + str(email) + ', you may now login'

        if password != confirmPassword:
            msg = 'Password did not match, please try again'
            return render(request, 'logIn/register.html', {'msg': msg})
        elif email != confirmEmail:
            msg = 'Email adress did not match, please try again'
            return render(request, 'logIn/register.html', {'msg': msg})
        else:
            try:
                User.objects.get(username=username)
                print('I exists already')
                msg = 'Username already exist'
                return render(request, 'logIn/register.html', {'msg': msg})
            except:
                registration(username, password, firstName, lastName, email)
                user = User.objects.create_user(username, email, password)
                user.last_name = lastName
                user.save()

        return render(request, 'logIn/register.html', {'msg': msg})
    return render(request, 'logIn/register.html')


def logout_view(request):
    client = MongoClient('localhost', 27017)  # maxPoolSize=50
    db = client.MeduzaDb
    db.tempPage.update({'userId': userId}, {'$set': {'maskRCNNstate': False}})
    logout(request)


def guest(request):
    pname = request.GET.get('pname')
    oid = request.GET.get('oid')
    pid = request.GET.get('pid')
    gid = request.GET.get('gid')
    dictUsersG = []
    guestname = db.guestHiring.find({'owner_id': oid, 'guest_id': gid})

    for gn in guestname:
        dictguest = {"idG": str(gn['_id']), "emailG": gn['email'], "firstNameG": gn['firstName'], "name": pname,
                     "oid": oid, "pid": pid, "gid": gid}
    users = inthisalluser()
    for usr in users:
        dictUsersG.append({
            'id': str(usr['_id']),
            'username': usr['username'],
            'firstName': usr['firstName'],
            'lastName': usr['lastName'],
            'email': usr['email'],
            'profilePicture': usr['profilePicture'],
            'accountType': usr['accountType'],
            'date_joined': usr['date_joined']
        })

    return render(request, 'logIn/guest.html', {'guest': dictguest, 'allresult': dictUsersG})


def save_guest_name(request):
    if request.method == 'GET':
        firstname = request.GET['guestfname']
        lastname = request.GET['guestlname']
        ownerid = request.GET['ownerid']
        guestid = request.GET['guestid']
        db.guestHiring.update({'owner_id': ownerid, 'guest_id': guestid},
                              {'$set': {'firstName': firstname, 'lastName': lastname}})

        return HttpResponse('success')


def merge_two_dicts(x, y):
    z = x.copy()
    z.update(y)
    return z
