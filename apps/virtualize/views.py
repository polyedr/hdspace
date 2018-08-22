from django.core.files.storage import FileSystemStorage
from django.shortcuts import render
from .models import *
from django.http import HttpResponseRedirect



#@login_required
def goIndex(request):
    return render(request, 'logIn/login.html', )


def index(request):
    # print(user)
    currentUser = request.user
    print(currentUser)
    userId = getCollectionIDs('user', currentUser)
    print(userId)
    if request.method == 'POST':

        myfile = request.FILES['myfile']
        fs = FileSystemStorage()

        filename = fs.save(str(currentUser)+'/pages/'+myfile.name, myfile)
        name = filename[int(len(str(currentUser))+7):-4]

        if user(url=filename, user_id=userId, name=name):
            print('lets start segmenting ' + str(filename))
            run(filename, currentUser)
        else:
            print('lol error')

        return HttpResponseRedirect('/page2/')

    return render(request, 'virtualize/home.html')



def forgotPassword (request):
    return render(request, 'virtualize/../templates/logIn/forgotPassword.html', )


def customize(request):
    return render(request, 'customize/editPage.html')



