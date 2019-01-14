import pymongo

from bson.objectid import ObjectId

client = pymongo.MongoClient('localhost', 27017)  # maxPoolSize=50
db = client.MeduzaDb


def updateLocation(collection,id,location):
    print('updating location')
    element = db[str(collection)].find_one({'_id':ObjectId(id)})
    if element is not None:
        db[str(collection)].update({'_id':ObjectId(id)},{
            '$set':{
                'location':location
            }
        })


def move_widget(elm, widget_type, px_0, py_0,screenH, screenW, height, width):
    id_ele = db[str(widget_type)].find_one({'seg_id': str(elm)})['_id']
    if px_0 != '' and py_0 != '':
        py = py_0.split('p')
        px_y0 = py[0]
        px = px_0.split('p')
        px_x0 = px[0]
        y0_f = float(px_y0)
        x0_f = float(px_x0)

        if height != '' and width != '':
            ph = height.split('p')
            px_h = ph[0]
            height_ = float(px_h)
            pw = width.split('p')
            px_w = pw[0]
            width_ = float(px_w)

            h_f = (float(height_) * 100) / float(screenH)
            w_f = (float(width_) * 100) / float(screenW)

            x0 = (x0_f * 100) / float(screenW)
            y0 = (y0_f * 100) / float(screenH)
            x1 = x0 + w_f
            y1 = y0 + h_f

            loc = {'x0': float(x0), 'y0': float(y0), 'x1': float(x1), 'y1': float(y1)}

            updateLocation(widget_type, id_ele, loc)
        elif height != '' and width == '':
            ph = height.split('p')
            px_h = ph[0]
            height_ = float(px_h)
            h_f = (float(height_) * 100) / float(screenH)

            location = db[str(widget_type)].find_one({'seg_id': str(elm)})['location']
            x0_0 = float(location['x0'])
            x1_0 = float(location['x1'])

            aux_x = x1_0 - x0_0

            x0 = (x0_f * 100) / float(screenW)
            y0 = (y0_f * 100) / float(screenH)
            x1 = x0 + aux_x
            y1 = y0 + h_f

            loc = {'x0': float(x0), 'y0': float(y0), 'x1': float(x1), 'y1': float(y1)}
            updateLocation(widget_type, id_ele, loc)
        elif height == '' and width != '':
            pw = width.split('p')
            px_w = pw[0]
            width_ = float(px_w)

            w_f = (float(width_) * 100) / float(screenW)

            location = db[str(widget_type)].find_one({'seg_id': str(elm)})['location']
            y0_0 = float(location['y0'])
            y1_0 = float(location["y1"])

            aux_y = y1_0 - y0_0

            x0 = (x0_f * 100) / float(screenW)
            y0 = (y0_f * 100) / float(screenH)
            x1 = x0 + w_f
            y1 = y0 + aux_y

            loc = {'x0': float(x0), 'y0': float(y0), 'x1': float(x1), 'y1': float(y1)}

            updateLocation(widget_type, id_ele, loc)
        else:
            x0 = (x0_f * 100) / float(screenW)
            y0 = (y0_f * 100) / float(screenH)

            location = db[str(widget_type)].find_one({'seg_id': str(elm)})['location']
            x0_0 = float(location['x0'])
            y0_0 = float(location['y0'])
            x1_0 = float(location['x1'])
            y1_0 = float(location["y1"])

            aux_x = x1_0 - x0_0
            aux_y = y1_0 - y0_0

            x1 = x0 + aux_x
            y1 = y0 + aux_y

            loc = {'x0': float(x0), 'y0': float(y0), 'x1': float(x1), 'y1': float(y1)}

            updateLocation(widget_type, id_ele, loc)
    elif px_0 != '' and py_0 == '' and width != '':
        px = px_0.split('p')
        px_x0 = px[0]
        x0_f = float(px_x0)

        pw = width.split('p')
        px_w = pw[0]
        width_ = float(px_w)
        w_f = (float(width_) * 100) / float(screenW)

        location = db[str(widget_type)].find_one({'seg_id': str(elm)})['location']
        y0_0 = float(location['y0'])
        y1_0 = float(location['y1'])

        x0 = (x0_f * 100) / float(screenW)
        x1 = x0 + w_f
        y0 = y0_0
        y1 = y1_0

        loc = {'x0': float(x0), 'y0': float(y0), 'x1': float(x1), 'y1': float(y1)}
        updateLocation(widget_type, id_ele, loc)
    elif px_0 == '' and py_0 != '' and height != '':
        py = py_0.split('p')
        px_y0 = py[0]
        y0_f = float(px_y0)

        ph = height.split('p')
        px_h = ph[0]
        height_ = float(px_h)
        h_f = (float(height_) * 100) / float(screenH)

        location = db[str(widget_type)].find_one({'seg_id': str(elm)})['location']
        x0_0 = float(location['x0'])
        x1_0 = float(location['x1'])

        x0 = x0_0
        y0 = (y0_f * 100) / float(screenH)
        x1 = x1_0
        y1 = y0 + h_f

        loc = {'x0': float(x0), 'y0': float(y0), 'x1': float(x1), 'y1': float(y1)}
        updateLocation(widget_type, id_ele, loc)
    elif px_0 == '' and py_0 == '':
        if width != '' and height == '':
            pw = width.split('p')
            px_w = pw[0]
            width_ = float(px_w)

            w_f = (float(width_) * 100) / float(screenW)

            location = db[str(widget_type)].find_one({'seg_id': str(elm)})['location']
            x0_0 = float(location['x0'])
            y0_0 = float(location['y0'])
            y1_0 = float(location["y1"])

            x0 = x0_0
            y0 = y0_0
            x1 = x0_0 + w_f
            y1 = y1_0

            loc = {'x0': float(x0), 'y0': float(y0), 'x1': float(x1), 'y1': float(y1)}
            updateLocation(widget_type, id_ele, loc)
        elif width == '' and height != '':
            ph = height.split('p')
            px_h = ph[0]
            height_ = float(px_h)
            h_f = (float(height_) * 100) / float(screenH)

            location = db[str(widget_type)].find_one({'seg_id': str(elm)})['location']
            x0_0 = float(location['x0'])
            y0_0 = float(location['y0'])
            x1_0 = float(location["x1"])

            x0 = x0_0
            y0 = y0_0
            x1 = x1_0
            y1 = y0_0 + h_f

            loc = {'x0': float(x0), 'y0': float(y0), 'x1': float(x1), 'y1': float(y1)}
            updateLocation(widget_type, id_ele, loc)
        else:
            print('Firts time moving widgets')
    else:
        print('Firts time moving widgets')


def fillWidget():
    wid = []
    try:
        coll_wid = db.saveWidgets.find()
        for i in coll_wid:
            temp = i['type']
            if temp == 'Widget':
                wid.append({
                    'id': str(i['_id']),
                    'widgetName': str(i['widgetName']),
                    'widgetLocation': str(i['widgetLocation']),
                    'widgetDescription': str(i['widgetDescription']),
                    'widgetCategory': str(i['widgetCategory']),
                    'device': str(i['device']),
                    'type': str(i['type'])
                })
    except:
        print("No widget")
        wid = []

    return wid


def fillGraphics():
    gid = []
    try:
        coll_wid = db.saveWidgets.find()
        for i in coll_wid:
            temp = i['type']
            if temp == 'Graphics':
                gid.append({
                    'id': str(i['_id']),
                    'widgetName': str(i['widgetName']),
                    'widgetLocation': str(i['widgetLocation']),
                    'widgetDescription': str(i['widgetDescription']),
                    'widgetCategory': str(i['widgetCategory']),
                    'device': str(i['device']),
                    'type': str(i['type'])
                })
    except:
        print("No widget")
        gid = []

    return gid
