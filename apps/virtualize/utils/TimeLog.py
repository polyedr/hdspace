import virtualize.validate
from apps.virtualize.models import *

start = ""
end = ""
user = ""
datetimeformat = '%Y-%m-%d %H:%M:%S.%f'
action = ""
span = ""



def getUserName():
    return user


def getStart():
    return start


def getEnd():
    datetimeformat = '%Y-%m-%d %H:%M:%S.%f'
    end = datetime.now()
    return str(end)


def getSpan():
    return span


def setUserName(user2):
    global user
    user = user2


def setStart(user1):
    global start
    datetimeformat = '%Y-%m-%d %H:%M:%S.%f'
    start = str(datetime.now())
    setUserName(user1)

def setSpan(span1):
    global span
    span = span1


def calcSpanOfTime(request,action1):
    global user, action, end, span
    datetimeformat = '%Y-%m-%d %H:%M:%S.%f'
    end = getEnd()
    span = datetime.strptime(str(end), datetimeformat) - datetime.strptime(str(start), datetimeformat)
    user = getUserName()
    span = str(str(datetime.now().date()) + "  " + str(span))
    setSpan(span)
    virtualize.validate.setTime(start, end, span, request, user)
