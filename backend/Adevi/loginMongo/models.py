from pymongo import MongoClient
import datetime

from django.contrib.auth.models import Group
client = MongoClient('localhost', 27017)
db = client.MeduzaDb


def User():
    collection = db['user']
    cursor = collection.find({})
    username = []
    password = []
    for document in cursor:
        username.append(document['username'])
        password.append(document['password'])
        print(*document, sep='\n')
    return username, password


def registration(username, password, firstName, lastName, email):

    db.user.insert({
        'username': username,
        'password': password,
        'firstName': firstName,
        'lastName': lastName,
        'email': email,
        'profilePicture': 'none',
        'accountType': 'basic',
        'date_joined': datetime.datetime.now()
    })
    getIdUser = db.user.find_one({'username': username})['_id']
    db.lastActivityLibrary.insert({'user': str(getIdUser), 'currentlySelectedProj': ''})


