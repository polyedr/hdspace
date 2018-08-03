import numpy as np
import pytz
import sqlite3
from mongoengine import *
from virtualize.models import *
from chat.models import *
from django.db import models
from pymongo import MongoClient
from bson.objectid import ObjectId
from datetime import datetime

from django.contrib.auth.models import User
from django.contrib.sessions.models import Session
from django.utils import timezone

# sqlite client
conn_sqlite = sqlite3.connect('UserSessions.sqlite', check_same_thread=False)
cursor_sqlite = conn_sqlite.cursor()

# mongo client
conn_mongo = MongoClient('localhost', 27017)  # maxPoolSize=50
cursor_mongo = conn_mongo.MeduzaDb


def getUserObj(username):
    return cursor_mongo.user.find({'username': username})


def getUserObjById(id):
    userObj = []
    # userData = cursor_sqlite.execute('SELECT * FROM auth_user WHERE id='+id)
    userData = cursor_sqlite.execute('''SELECT * FROM auth_user WHERE id=?''', (id,))
    for data in userData:
        for each_record in data:
            userObj.append(each_record)

    return userObj;


def getUserSqliteId(username_):
    userData = cursor_sqlite.execute('''SELECT id FROM auth_user WHERE username=?''', (username_,))
    for data in userData:
        return data;


def getAllSqliteUsers(username_):
    allSqlUserObj = []
    userData = cursor_sqlite.execute('''SELECT * FROM auth_user WHERE username!=?''', (username_,))
    for data in userData:
        allSqlUserObj.append(data)

    return allSqlUserObj;


def getMongoUserExceptCurrentUser(username_):
    allMOngoUserObj = []
    UserData = db.user.find({'username': {'$ne': username_}})
    for dt in UserData:
        try:
            allMOngoUserObj.append({
                'id': str(dt['_id']),
                'username': dt['username'],
                'firstName': dt['firstName'],
                'lastName': dt['lastName'],
                'email': dt['email'],
                'accountType': dt['accountType'],
                'profile': getUserPicture(dt['username'])})
        except:
            continue

    return allMOngoUserObj;


def get_current_users():
    active_sessions = Session.objects.filter(expire_date__gte=timezone.now())
    user_id_list = []
    for session in active_sessions:
        data = session.get_decoded()
        user_id_list.append(data.get('_auth_user_id', None))
    # Query all logged in users based on id list
    return User.objects.filter(id__in=user_id_list)


# get all user except currentuser
def getAllUsers(currentuser):
    return cursor_mongo.user.find({'username': {'$ne': currentuser}})


# get all user
def inthisalluser():
    return cursor_mongo.user.find({})


# get project details
def getProjectdetails(projectid):
    return cursor_mongo.projects.find({'_id': ObjectId(projectid)})


# get hire details
def checkHireStatus(projectid):
    return cursor_mongo.hiringDetails.find({'projectid': projectid})


def finaluserssqlite(request):
    currentUser = str(request.user)
    loggedUserSqlId = int(getUserSqliteId(currentUser)[0])
    us = getAllSqliteUsers(currentUser);
    semiFinalUsersList = [];
    for x in us:
        temp = []
        for each_inner in x:
            temp.append(each_inner)
        semiFinalUsersList.append(temp)

    finalUsers = [];
    for user in semiFinalUsersList:
        try:
            temp_ = []
            temp_.append(user[0])
            temp_.append(user[1])
            temp_.append(user[2])
            temp_.append(user[3])
            temp_.append(user[4])
            temp_.append(user[5])
            temp_.append(user[6])
            temp_.append(user[7])
            temp_.append(user[8])
            temp_.append(user[9])
            temp_.append(user[10])
            temp_.append(getUserPicture(user[10]))
            temp_.append(getMessageCount(int(user[0]), loggedUserSqlId))
            finalUsers.append(temp_);
        except:
            continue

    return finalUsers


# get all guest list
def guestlist(request):
    jsonCurrentid = []
    currentuser = request.user.username
    cuser = getUserObj(currentuser)
    for cu in cuser:
        jsonCurrentid.append({'id': str(cu['_id'])})

    abcurrentid = jsonCurrentid[0]
    jsonguestList = []
    glist = db.guestHiring.find({'owner_id': abcurrentid['id']})
    for glst in glist:
        jsonguestList.append({
            'id': str(glst['_id']),
            'email': glst['email'],
            'firstName': glst['firstName'],
            'lastName': glst['lastName'],
            'user_type': glst['user_type'],
            'owner_id': glst['owner_id'],
            'project_id': glst['project_id'],
            'guest_id': glst['guest_id'],
            'hired_at': glst['hired_at']})

    return jsonguestList
