import pymongo
from datetime import datetime



client = pymongo.MongoClient('localhost', 27017)  # maxPoolSize=50
db = client.MeduzaDb


def update_style_link(source, target):

    result = False
    try:
        db.styles.update({'segmentation_id': str(source)}, {'$set': {'link': str(target)}})
    except (AttributeError, pymongo.errors.OperationFailure) as e:
        print('Mongo Data Base Error ' + e)
    else:
        result = True
    return result


def update_element_lock(element_type, collectionKey, class_id, new_state):

    result = None
    try:
        db[element_type].update({collectionKey: class_id}, {'$set': {'locked': new_state}})
        result = db[element_type].find({collectionKey: class_id})
    except (AttributeError, pymongo.errors.OperationFailure) as e:
        print('Mongo Data Base Error ' + e)
    return result


def delete_element_from_collection(elementType, deleteId):

    collection = None
    try:
        db[elementType].update({'class_id': deleteId}, {'$set': {'state': 'inactive'}})
        collection = db[elementType].find({'class_id': deleteId})
    except (AttributeError, pymongo.errors.OperationFailure) as e:
        print('Mongo Data Base Error ' + e)
    return collection


def getOneActive(type, id):

    result = None
    try:
        result = db[type].find_one({'seg_id': id, 'state': 'active'})
    except (AttributeError, pymongo.errors.OperationFailure) as e:
        print('Mongo Data Base Error ' + e)
    return result


def getOneActiveNewE(type, id):

    result = None
    try:
        result = db[type].find_one({'class_id': id, 'state': 'active'})
    except (AttributeError, pymongo.errors.OperationFailure) as e:
        print('Mongo Data Base Error ' + e)
    return result


def getOneChild(type, id):

    result = None
    try:
        result = db[type].find_one({'level': {'child': id}})
    except (AttributeError, pymongo.errors.OperationFailure) as e:
        print('Mongo Data Base Error ' + e)
    return result


def getOneActiveChild(type, id):

    result = None
    try:
        result = db[type].find_one({'level': {'child': id}, 'state': 'active'})
    except (AttributeError, pymongo.errors.OperationFailure) as e:
        print('Mongo Data Base Error ' + e)
    return result


def checkCurrentLock(type_c, lockid):
    collection = db[type_c].find({'seg_id': lockid})
    state_lock = []
    for collect in collection:
        state_lock = collect
    return state_lock


def search_new_element(id):
    collection = db.newElements
    return collection.find_one({'class_id': id})



def undoEvent(screenshotId, index):

    collection = db.events
    cursor = collection.find({'screenshot_id': screenshotId}).sort([('timeStamp', -1)]).limit(1+int(index))
    for i in cursor:
        event = i
    return event


def redoEvent(screenshotId, index):

    collection = db.events
    cursor = collection.find({'screenshot_id': screenshotId}).sort([('timeStamp', -1)]).limit(int(index))
    for i in cursor:
        event = i
    return event


def insertEvent(screenid, segid, collection, type, old, new):
    date = datetime.now(pytz.timezone('Australia/Melbourne'))
    db['events'].insert({
        'screenshot_id': screenid,
        'seg_id': segid,
        'collection': collection,
        'oldEvent': {type: old},
        'newEvent': {type: new},
        'timeStamp': str(date),
        'timeZone': 'Australia/Melbourne'
    })


def update_element_type(element, elementChild, curType):
    for elm in element:
        db[curType].update({'seg_id': elm['seg_id']}, {'$set': {'state': 'inactive'}})
        if len(existInDb(type, elm['seg_id'])) > 0:
            db[type].update({'seg_id': elm['seg_id']}, {'$set': {
                'level': elm['level'],
                'seg_id': elm['seg_id'],
                'type': elm['type'],
                'name': elm['name'],
                'location': elm['location'],
                'root': elm['root'],
                'screenshot_id': elm['screenshot_id'],
                'state': 'active',
                'locked': elm['locked'],
                'timeStamp': elm['timeStamp'],
                'timeZone': elm['timeZone']}
            })
        else:
            db[type].insert({
                'level': elm['level'],
                'seg_id': elm['seg_id'],
                'type': elm['type'],
                'name': elm['name'],
                'location': elm['location'],
                'root': elm['root'],
                'screenshot_id': elm['screenshot_id'],
                'state': 'active',
                'locked': elm['locked'],
                'timeStamp': elm['timeStamp'],
                'timeZone': elm['timeZone']
            })

    for child in elementChild:
        if type == 'textArea' or type == 'textBoxes' or type == 'buttons':
            db[curType].update({'seg_id': child['seg_id']}, {'$set': {'state': 'inactive'}})
            if len(existInDb(type, child['seg_id'])) > 0:
                db[type].update({'seg_id': child['seg_id']}, {'$set': {
                    'level': child['level'],
                    'seg_id': child['seg_id'],
                    'type': child['type'],
                    'name': child['name'],
                    'location': child['location'],
                    'root': child['root'],
                    'screenshot_id': child['screenshot_id'],
                    'state': 'active',
                    'locked': child['locked'],
                    'timeStamp': child['timeStamp'],
                    'timeZone': child['timeZone']}
                })
            else:
                db[type].insert({
                    'level': child['level'],
                    'seg_id': child['seg_id'],
                    'type': child['type'],
                    'name': child['name'],
                    'location': child['location'],
                    'root': child['root'],
                    'screenshot_id': child['screenshot_id'],
                    'state': 'active',
                    'locked': child['locked'],
                    'timeStamp': child['timeStamp'],
                    'timeZone': child['timeZone']
                })
        else:
            db[curType].update({'seg_id': child['seg_id']}, {'$set': {'state': 'inactive'}})

    return element


def existInDb(type, id):
    exists = []
    collection = db[type].find({'seg_id': id})
    for col in collection:
        exists.append(col)
    return exists


def undo_event_function(screenshotId, index):
    event = undoEvent(screenshotId, index)
    wholeEvent = event['oldEvent']
    key = ''
    for i in wholeEvent:
        key = str(i)
    if 'changedElement' in event['oldEvent']:
        print('changed')
        db[event['oldEvent']['changedElement']].update({'seg_id': event['seg_id']},
                                                       {'$set': {
                                                           'state': 'active'
                                                       }})
        db[event['newEvent']['changedElement']].update({'seg_id': event['seg_id']},
                                                       {'$set': {
                                                           'state': 'inactive'
                                                       }})
    elif 'deletedElement' in event['oldEvent']:
        print('delete')
        if event['collection'] == 'newElements':
            db[event['collection']].update({'class_id': event['seg_id']},
                                           {'$set': {
                                               'state': event['oldEvent']['deletedElement']
                                           }})
        else:
            db[event['collection']].update({'seg_id': event['seg_id']},
                                           {'$set': {
                                               'state': event['oldEvent']['deletedElement']
                                           }})
    elif 'changedStyle' in event['oldEvent']:
        print('changedStyle!')
        db['styles'].update({'segmentation_id': event['seg_id']},
                            {'$set': {
                                'borderColor': event['oldEvent']['changedStyle']['borderColor'],
                                'borderRadius': event['oldEvent']['changedStyle']['borderRadius'],
                                'bgcolor': event['oldEvent']['changedStyle']['bgcolor'],
                                'textAlign': event['oldEvent']['changedStyle']['textAlign'],
                                'textIndent': event['oldEvent']['changedStyle']['textIndent'],
                                'zIndex': event['oldEvent']['changedStyle']['zIndex']
                            }})
    elif 'background-color' in event['oldEvent']:
        db['backgrounds'].update({'screenshot_id': event['screenshot_id']},
                                 {'$set': {'background': event['oldEvent']['background']}})
    elif 'fontSize' in event['oldEvent'] or 'fontFamily' in event['oldEvent'] or \
                    'fontColor' in event['oldEvent'] or 'borderColor' in event['oldEvent'] or \
                    'borderRadius' in event['oldEvent'] or 'bgcolor' in event['oldEvent'] or \
                    'textAlign' in event['oldEvent'] or 'textIndent' in event['oldEvent']:
        db['styles'].update({'segmentation_id': event['seg_id']},
                            {'$set': {
                                key: event['oldEvent'][key]
                            }})
    elif 'fontSize' not in event['oldEvent'] or 'fontFamily' not in event['oldEvent'] or \
                    'fontColor' not in event['oldEvent'] or 'borderColor' not in event['oldEvent'] or \
                    'borderRadius' not in event['oldEvent'] or 'bgcolor' not in event['oldEvent'] or \
                    'textAlign' not in event['oldEvent'] or 'textIndent' not in event['oldEvent']:
        db[event['collection']].update({'seg_id': event['seg_id']},
                                       {'$set': {
                                           key: event['oldEvent'][key]
                                       }})
    return event, wholeEvent


def redo_event_function(screenshotId, index):
    event = redoEvent(screenshotId, index)
    wholeEvent = event['newEvent']
    key = ''
    for i in wholeEvent:
        key = str(i)

    if 'changedElement' in event['newEvent']:
        print('changed')
        db[event['newEvent']['changedElement']].update({'seg_id': event['seg_id']},
                                                       {'$set': {
                                                           'state': 'active'
                                                       }})
        db[event['oldEvent']['changedElement']].update({'seg_id': event['seg_id']},
                                                       {'$set': {
                                                           'state': 'inactive'
                                                       }})
    elif 'deletedElement' in event['newEvent']:
        print('delete')
        if event['collection'] == 'newElements':
            db[event['collection']].update({'class_id': event['seg_id']},
                                           {'$set': {
                                               'state': event['newEvent']['deletedElement']
                                           }})
        else:
            db[event['collection']].update({'seg_id': event['seg_id']},
                                           {'$set': {
                                               'state': event['newEvent']['deletedElement']
                                           }})
    elif 'changedStyle' in event['newEvent']:
        db['styles'].update({'segmentation_id': event['seg_id']},
                            {'$set': {
                                'borderColor': event['newEvent']['changedStyle']['borderColor'],
                                'borderRadius': event['newEvent']['changedStyle']['borderRadius'],
                                'bgcolor': event['newEvent']['changedStyle']['bgcolor'],
                                'textAlign': event['newEvent']['changedStyle']['textAlign'],
                                'textIndent': event['newEvent']['changedStyle']['textIndent'],
                                'zIndex': event['newEvent']['changedStyle']['zIndex']
                            }})
    elif 'background-color' in event['newEvent']:
        db['backgrounds'].update({'screenshot_id': event['screenshot_id']},
                                 {'$set': {'background': event['newEvent']['background']}})
    elif 'fontSize' in event['newEvent'] or 'fontFamily' in event['newEvent'] or \
                    'fontColor' in event['newEvent'] or 'borderColor' in event['newEvent'] or \
                    'borderRadius' in event['newEvent'] or 'bgcolor' in event['newEvent'] or \
                    'textAlign' in event['newEvent'] or 'textIndent' in event['newEvent']:
        db['styles'].update({'segmentation_id': event['seg_id']},
                            {'$set': {
                                key: event['newEvent'][key]
                            }})
    elif 'fontSize' not in event['newEvent'] or 'fontFamily' not in event['newEvent'] or \
                    'fontColor' not in event['newEvent'] or 'borderColor' not in event['newEvent'] or \
                    'borderRadius' not in event['newEvent'] or 'bgcolor' not in event['newEvent'] or \
                    'textAlign' not in event['newEvent'] or 'textIndent' not in event['newEvent']:
        db[event['collection']].update({'seg_id': event['seg_id']},
                                       {'$set': {
                                           key: event['newEvent'][key]
                                       }})

    return event, wholeEvent


def insert_link_style(srcid, link, date):
    db.styles.insert(
        {
            'segmentation_id': srcid,
            'fontFamily': 'Helvetica, Arial, sans-serif',
            'fontSize': '',
            'fontColor': '',
            'borderColor': 'transparent',
            'background-gradient': '',
            'borderRadius': '',
            'bgcolor': '',
            'boxShadow': '',
            'textAlign': '',
            'textIndent': 'center',
            'textShadow': '',
            'link': link,
            'linkColor': '',
            'animationType': '',
            'zIndex': 'auto',
            'timeStamp': str(date),
            'timeZone': 'Australia/Melbourne'
        }
    )


def getStylesDb():
    print("getStyles")
    sty = []
    cursorSty = db.styles.find({})

    try:
        for s in cursorSty:
            try:
                sty.append({
                    'seg_id': s['segmentation_id'],
                    'aniTy': s['animationType'],
                    'linkColor': s['linkColor'],
                    'link': s['link']
                })
            except:
                continue
    except:
        print("nothing")
    return sty