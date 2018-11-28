from pymongo import MongoClient
import datetime

client = MongoClient('mongodb://mongo:mongo@db')  # maxPoolSize=50
db = client.MeduzaDb


def registration(user):

    db.user.insert({
        'username': user.username,
        'password': 'shit_code',
        'firstName': user.first_name,
        'lastName': user.last_name,
        'email': user.email,
        'profilePicture': 'none',
        'accountType': 'basic',
        'date_joined': datetime.datetime.now()
    })
    getIdUser = db.user.find_one({'username': user.username})['_id']
    db.lastActivityLibrary.insert({'user': str(getIdUser), 'currentlySelectedProj': ''})
