import json

from django.shortcuts import render
from django.http import HttpResponse
from django.http.response import JsonResponse
from django.core.files.storage import FileSystemStorage
from django.core.mail import send_mail

from .form import FileUploadForm
from .models import *
from login_mongo.models import *
from users.models import *
from virtualize.models import *


def send_invite_email(request):
    if request.method == 'GET':
        toemail = request.GET['email']

        res = send_mail("hello",
                        """We are AI Assistant for Designers <br> Register for Adevi account 
                        <a href='http://localhost:7000/register/'>here</a>.""",
                        "tech2@edwayapps.com", [toemail], fail_silently=False)

        return HttpResponse('%s' % res)


# function to open chatbox
def get_chat_box(request):
    if request.method == 'GET':
        chatWithUserId = request.GET['id']
        if len(chatWithUserId) == 24:
            chatWithUserObj = []
            loggedUserObj = getUserObj(str(request.user))
            getUserSqliteId(str(request.user))[0]
            # chatWithUserObj = getMongoUserObjById(chatWithUserId);
            UserData = db.user.find({'_id': ObjectId(chatWithUserId)})
            for dt in UserData:
                chatWithUserObj.append({
                    'id': str(dt['_id']),
                    'username': dt['username'],
                    'firstName': dt['firstName'],
                    'lastName': dt['lastName'],
                    'email': dt['email'],
                    'accountType': dt['accountType'],
                    'profile': getUserPicture(dt['username'])})

            mongoId = get_mongo_id(request)

            allMessages = get_all_messages(chatWithUserId, mongoId)
            # toImage = getUserPicture(str(chatWithUserObj[10]));
            toImage = db['user'].find_one({'_id': ObjectId(chatWithUserId)})['profilePicture']
            fromImage = getUserPicture(str(request.user))

            for each_new in allMessages:
                objectId = each_new['_id']
                db.messages.update({'_id': ObjectId(objectId)}, {'$set': {'status': "1"}})

            return render(request, 'customize/includes/chatBoxView.html',
                          {'from': loggedUserObj, 'fromImage': fromImage, 'to': chatWithUserObj, 'toImage': toImage,
                           'fromId': mongoId, 'allMessages': allMessages, 'type': 'register'})
        else:
            jsonCurrentid = []
            jsonGuest = []
            jsonMessage = []
            currentuser = request.user.username
            cuser = getUserObj(currentuser)
            for cu in cuser:
                jsonCurrentid.append({'id': str(cu['_id'])})

            abcurrentid = jsonCurrentid[0]
            chatWithGuest = db.guestHiring.find({'guest_id': chatWithUserId})
            for cg in chatWithGuest:
                jsonGuest.append({'id': str(cg['_id']), 'email': cg['email'], 'firstName': cg['firstName'],
                                  'lastName': cg['lastName'], 'user_type': cg['user_type'], 'owner_id': cg['owner_id'],
                                  'project_id': cg['project_id'], 'guest_id': cg['guest_id'],
                                  'hired_at': cg['hired_at']})

            allMessages = get_all_messages_guest(chatWithUserId, abcurrentid['id'])
            for am in allMessages:
                jsonMessage.append(
                    {'id': str(am['_id']), 'to': am['to'], 'message': am['message'], 'from_id': am['guest_id'],
                     'status': am['status'], 'created_at': am['created_at'], 'attached_files': am['attached_files'],
                     'file_type': am['file_type']})

            fromImage = getUserPicture(str(request.user))
            for each_new in allMessages:
                objectId = each_new['_id']
                db.messages.update({'_id': ObjectId(objectId)}, {'$set': {'status': "1"}})

            return render(request, 'customize/includes/chatBoxView.html',
                          {'fromImage': fromImage, 'to': jsonGuest, 'fromId': abcurrentid['id'],
                           'allMessages': jsonMessage, 'type': 'guest'})
    else:
        return render(request, 'customize/includes/chatBoxView.html')


# function for save chat in DB
def save_chat_message(request):
    if request.method == 'POST':
        toId = request.POST['to_id'].strip()
        if len(toId) == 24:
            messageContent = request.POST['content'].strip()
            loggedUserObj = getUserObj(str(request.user))
            getUserObjById(toId)
            fromId = getUserSqliteId(str(request.user))[0]
            mongoId = get_mongo_id(request)

            uploadedFilePath = upload_attachments(request)
            fileExt = uploadedFilePath[-4:]
            # save message to mongodB
            chatsave(toId, messageContent, mongoId, uploadedFilePath, fileExt)

            get_all_messages(toId, fromId)

            fromImage = getUserPicture(str(request.user))

            return render(request, 'customize/includes/fromMessage.html',
                          {'from': loggedUserObj, 'fromImage': fromImage, 'message': messageContent,
                           'uploaded_file_url': uploadedFilePath, 'fileExt': fileExt, 'type': 'register'})
        else:
            jsonCurrentid = []
            messageContent = request.POST['content'].strip()
            currentuser = request.user.username
            fromImage = getUserPicture(str(currentuser))
            cuser = getUserObj(currentuser)
            for cu in cuser:
                jsonCurrentid.append({'id': str(cu['_id'])})

            abcurrentid = jsonCurrentid[0]
            uploadedFilePath = upload_attachments(request)
            fileExt = uploadedFilePath[-4:]
            guestchatsave(toId, messageContent, abcurrentid['id'], uploadedFilePath, fileExt)

            get_all_messages_guest(toId, abcurrentid['id'])

            return render(request, 'customize/includes/fromMessage.html',
                          {'fromImage': fromImage, 'message': messageContent, 'uploaded_file_url': uploadedFilePath,
                           'fileExt': fileExt, 'type': 'guest'})

    else:
        return render(request, 'customize/includes/chatBoxView.html',
                      {'from': loggedUserObj, 'fromImage': fromImage, 'to': chatWithUserObj, 'toImage': toImage,
                       'fromId': fromId, 'allMessages': allMessages})


# function for save chat in DB for Guest user
def guestsavechatmessageg(request):
    if request.method == 'POST':
        toId = request.POST['to_id'].strip()
        fromId = request.POST['from_id'].strip()
        messageContent = request.POST['content'].strip()
        uploadedFilePath = upload_attachments(request)
        fileExt = uploadedFilePath[-4:]
        # save message to mongodB
        if uploadedFilePath:
            img_toId = request.POST['forimage'].strip()
            guestchatsave(fromId, messageContent, img_toId, uploadedFilePath, fileExt)
        else:
            guestchatsave(toId, messageContent, fromId, uploadedFilePath, fileExt)

        return render(request, 'customize/includes/fromMessageGuest.html',
                      {'message': messageContent, 'uploaded_file_url': uploadedFilePath, 'fileExt': fileExt})
    else:
        return render(request, 'customize/includes/chatBoxViewGuest.html',
                      {'from': loggedUserObj, 'fromImage': fromImage, 'to': chatWithUserObj, 'toImage': toImage,
                       'fromId': fromId, 'allMessages': allMessages})


# function to open chatbox for Guest user
def guestget_chat_box_g(request):
    if request.method == 'GET':
        chatWithUserId = request.GET['id']
        fromId = request.GET['guestid']

        imgp = db['user'].find_one({'_id': ObjectId(chatWithUserId)})['profilePicture']
        allMessages = get_all_messages_guest(chatWithUserId, fromId)
        for each_new in allMessages:
            objectId = each_new['_id']
            db.guestMessages.update({'_id': ObjectId(objectId)}, {'$set': {'status': "1"}})

        return render(request, 'customize/includes/chatBoxViewGuest.html',
                      {'fromImage': imgp, 'fromId': fromId, 'allMessages': allMessages, 'toowner': chatWithUserId})
    else:
        return render(request, 'customize/includes/chatBoxViewGuest.html')


def upload_attachments(request):
    if request.method == 'POST':
        uploaded_file_url = ""
        FileUploadForm(request.POST, request.FILES)
        if request.FILES.get('file_source', False):
            myfile = request.FILES['file_source']
            fs = FileSystemStorage()
            filename = fs.save(myfile.name, myfile)
            uploaded_file_url = fs.url(filename)

        return uploaded_file_url


def get_all_messages(toId, fromId):
    all_message = []
    messages = db.messages.find({
        '$or': [{
            'from_id': fromId, 'to': toId
        }, {
            'from_id': toId, 'to': fromId
        }]
    });
    for each_obj in messages:
        all_message.append(each_obj)

    return all_message


# get all message for Guest user
def get_all_messages_guest(toId, fromId):
    all_messageg = []
    messages = db.guestMessages.find({
        '$or': [{
            'guest_id': fromId, 'to': toId
        }, {
            'guest_id': toId, 'to': fromId
        }]
    })
    for each_obj in messages:
        all_messageg.append(each_obj)

    return all_messageg


def get_new_message(request):
    allNewMessages = []
    if request.method == 'GET':
        onlyforcheck = request.GET['id']
        if len(onlyforcheck) == 2:
            fromId = int(request.GET['id'])
            fromUserObj = getUserObjById(request.GET['id'])
            fromImage = getUserPicture(str(fromUserObj[10]))
            toId = getUserSqliteId(str(request.user))[0]

            messages = db.messages.find({'from_id': fromId, 'to': toId, 'status': '0'})

            if messages.count():
                for each_new in messages:
                    objectId = each_new['_id']
                    db.messages.update({'_id': ObjectId(objectId)}, {'$set': {'status': "1"}})
                    allNewMessages.append(each_new)

            return render(request, 'customize/includes/toMessage.html',
                          {'allMessages': allNewMessages, 'fromImage': fromImage, 'fromName': fromUserObj[10]})
        else:
            fromId = request.GET['id']
            jsonCurrentid = []
            currentuser = request.user.username
            fromImage = getUserPicture(currentuser)
            cuser = getUserObj(currentuser)
            for cu in cuser:
                jsonCurrentid.append({'id': str(cu['_id'])})

            abcurrentid = jsonCurrentid[0]
            messages = db.guestMessages.find({'guest_id': fromId, 'to': abcurrentid['id'], 'status': '0'})

            if messages.count():
                for each_new in messages:
                    objectId = each_new['_id']
                    db.guestMessages.update({'_id': ObjectId(objectId)}, {'$set': {'status': "1"}})
                    allNewMessages.append(each_new)

            return render(request, 'customize/includes/toMessage.html',
                          {'allMessages': allNewMessages, 'fromImage': fromImage})


def update_message_status():
    return "success"


def get_mongo_id(request):
    jsonCurrentid = []
    currentuser = request.user.username
    getUserPicture(currentuser)
    cuser = getUserObj(currentuser)
    for cu in cuser:
        jsonCurrentid.append({'id': str(cu['_id'])})

    abcurrentid = jsonCurrentid[0]

    return abcurrentid['id']


def get_new_messages_live(request):
    alluserCount = []
    allmsgCount = []
    allguestmsgCount = []
    finalCount = []
    if request.method == 'GET':
        # loggedinId = getUserSqliteId(str(request.user))[0];
        # allusers = getAllSqliteUsers(str(request.user));
        allmongousers = getMongoUserExceptCurrentUser(str(request.user))
        my_dict1 = {}
        my_dict2 = {}
        my_dict3 = {}
        queryset = get_current_users()
        totalonline = queryset.count()
        my_dict3['total'] = {"tot": str(totalonline)}
        onlineresults = queryset.values_list('username', 'id')
        dicresult = dict(onlineresults)
        my_dict1['online'] = dicresult
        mongoId = get_mongo_id(request)
        for each_id in allmongousers:
            msgCount = getMessageCount(each_id['id'], mongoId)
            alluserCount.append(each_id['id'])
            allmsgCount.append(msgCount)

        dictA = zip(alluserCount, allmsgCount)
        for e_dictA in dictA:
            finalCount.append(e_dictA)

        my_dict2['count'] = dict(finalCount)
        dictM = merge_three_dicts(my_dict1, my_dict2, my_dict3)
        allguest = db.guestHiring.find({})
        for allg in allguest:
            msgCountG = getGuestMessageCount(allg['guest_id'], mongoId)
            allguestmsgCount.append({allg['guest_id']: msgCountG})

        dictM.update({'countguest': allguestmsgCount})

        return JsonResponse(json.dumps(dictM), safe=False)


# for guest message count
def guest_new_messages_live_g(request):
    if request.method == 'GET':
        guestid = request.GET['guestid']
        ownerid = request.GET['ownerid']
        msgCountG = getGuestMessageCount(ownerid, guestid)
        dictM = {'countguest': {ownerid: msgCountG}}

        return JsonResponse(json.dumps(dictM), safe=False)


def get_mongo_id_for(request):
    jsonCurrentid = []
    currentuser = request.user.username
    getUserPicture(currentuser)
    cuser = getUserObj(currentuser)
    for cu in cuser:
        jsonCurrentid.append({'id': str(cu['_id'])})

    abcurrentid = jsonCurrentid[0]

    return abcurrentid['id']
