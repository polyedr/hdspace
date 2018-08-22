import sqlite3

from workFlowAI.mainAI import createSuggestiondDB
from pymongo import MongoClient


client = MongoClient('localhost', 27017)  # maxPoolSize=50
db = client.MeduzaDb
buttonKeywords = ['login', 'log', 'log ', 'in', 'log in', 'forgot password?', 'forgot password', 'forgot your password',
                  'forgot your password?', 'src.register',
                  'forgot your password',
                  'create an account', 'log out',
                  'submit', 'send',
                  'sign up', 'sign', 'sign in', 'save'
                                                'share', 'recommend',
                  'publish', 'create',
                  'remove', 'add',
                  'refresh', 'autorenew',
                  'menu', 'home',
                  'next', 'previous',
                  'prev', 'pause',
                  'play', 'stop',
                  'ok', 'accept',
                  'debug', 'call',
                  'youtube',
                  'twitter', 'pinterest',
                  'linkedin', 'angelco',
                  'angellist', 'vk', '?', 'sign up for facebook',
                  'connect with facebook', "n connect with facebook", "connect with fac'ebook",
                  "connect with fac‘ebook",
                  'src.register with google', 'src.register with wechat',
                  'src.register with vkontakte', 'subm',
                  'scan app icon', 'read app name', 'check app price', 'check app screeenshots',
                  'check app screenshot', 'scan app review stats', 'scan app reviews stats',
                  'play app preview video (if any)', 'play app preview', 'video', 'video (if any)',
                  'check app price', 'download', 'download app', 'cancel']
textboxKeywords = ['search', 'mail', 'email', '***', 'email or password',
                   'username', 'password', 'dassword', 'username or email',
                   'first name', 'last name', 'address', 'postal code', 'postcode',
                   'region', 'city',
                   'country', 'text',
                   'message', 'write your message,',
                   'email or phone', 'phone number',
                   'retype password', 'name', 'subject']


def drop_database():
    print('Collections are deleted!')


def user_enable():
    db.userEnable.insert({
        'button': buttonKeywords,
        'textbox': textboxKeywords,
    })
    print('userEnable inserted')


def find_user_enable(searchwords):
    msg = 'find succes'
    result = []
    col = db.userEnable.find(
        {'button': searchwords}
    )
    for doc in col:
        result.append(doc['button'])
        print(doc['button'])
        print(1)
    return result


user_enable()
