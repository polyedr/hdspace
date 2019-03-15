from pymongo import MongoClient
client = MongoClient('localhost', 27017)  # maxPoolSize=50
db = client.mainDB
widgetDb = client.MeduzaDb

def newcnnModel1Test4Bar():
    db.cnnModels.insert({
        'shapes': {'label': "apps/virtualize/tf/newShapesTest4BarC/retrained_labels.txt",
                   'graph': "apps/virtualize/tf/newShapesTest4BarC/retrained_graph.pb"},
       })
    print('cnnModel1 inserted')

def cnnModelFirst():
    db.cnnFirstModels.insert({
        'shapes': {'label': "apps/virtualize/tf/firstRecognition/retrained_labels.txt",
                        'graph': "apps/virtualize/tf/firstRecognition/retrained_graph.pb"},
       })
    print('cnnModelTest inserted')

# newcnnModel1Test4Bar()
# cnnModelFirst()

def saveWidgets(name,location,desc,cate,dev,ty):
    widgetDb.saveWidgets.insert({
                'widgetName': str(name),
                'widgetLocation': str(location),
                'widgetDescription': str(desc),
                'widgetCategory': str(cate),
                'device': str(dev),
                'type': str(ty)
                })
    print(str(ty) + ' was inserted successfully')

name = ['pie-4',
        'pie-5',
        'piechart-1',
        'bar-2',
        'bar-3',

        'map-2',
        'map-4',
        'map-5',
        'map-3',

        'bar-2',
        'bar-3',

        'calendar-1',
        'calendar-2',
        'calendar-3',
        'calendar-4'
        ]
location = ['media/graphics/pie-4.jpg',
            'media/graphics/pie-5.jpg',
            'media/graphics/piechart-1.jpg',
            'media/graphics/bar-2.jpg',
            'media/graphics/bar-3.jpg',

            'media/widgets/map-2.jpg',
            'media/widgets/map-4.jpg',
            'media/widgets/map-5.jpg',
            'media/widgets/map-3.jpg',

            'media/graphics/bar-2.jpg',
            'media/graphics/bar-3.jpg',

            'media/widgets/calendar-1.jpg',
            'media/widgets/calendar-2.jpg',
            'media/widgets/calendar-3.jpg',
            'media/widgets/calendar-4.jpg'
            ]
desc = ['is a circular statistical graphic which is divided into slices to illustrate numerical proportion',
        'is a circular statistical graphic which is divided into slices to illustrate numerical proportion',
        'is a circular statistical graphic which is divided into slices to illustrate numerical proportion',
        'A bar chart or bar graph is a chart or graph that presents categorical data with rectangular bars with heights or lengths proportional to the values that they represent. The bars can be plotted vertically or horizontally. A vertical bar chart is sometimes called a line graph',
        'A bar chart or bar graph is a chart or graph that presents categorical data with rectangular bars with heights or lengths proportional to the values that they represent.The bars can be plotted vertically or horizontally.A vertical bar chart is sometimes called a line graph',

        'Offline maps to search, get directions and use navigation without an internet connection Street View and indoor imagery for restaurants, shops, museums and more. Indoor maps to quickly find your way inside big places like airports, malls and stadiums' ,
        'Offline maps to search, get directions and use navigation without an internet connection Street View and indoor imagery for restaurants, shops, museums and more. Indoor maps to quickly find your way inside big places like airports, malls and stadiums',
        'Offline maps to search, get directions and use navigation without an internet connection Street View and indoor imagery for restaurants, shops, museums and more. Indoor maps to quickly find your way inside big places like airports, malls and stadiums',
        'Offline maps to search, get directions and use navigation without an internet connection Street View and indoor imagery for restaurants, shops, museums and more. Indoor maps to quickly find your way inside big places like airports, malls and stadiums',

        'A bar chart or bar graph is a chart or graph that presents categorical data with rectangular bars with heights or lengths proportional to the values that they represent. The bars can be plotted vertically or horizontally. A vertical bar chart is sometimes called a line graph',
        'A bar chart or bar graph is a chart or graph that presents categorical data with rectangular bars with heights or lengths proportional to the values that they represent.The bars can be plotted vertically or horizontally.A vertical bar chart is sometimes called a line graph',

        'A simple calendar with optional CalDAV synchronization. You can easily create recurring events and setup reminders, it can also display week numbers',
        'A simple calendar with optional CalDAV synchronization.You can easily create recurring events and setup reminders, it can also display week numbers',
        'A simple calendar with optional CalDAV synchronization. You can easily create recurring events and setup reminders, it can also display week numbers',
        'A simple calendar with optional CalDAV synchronization. You can easily create recurring events and setup reminders, it can also display week numbers'
        ]
cat = ['General',
       'General',
       'General',
       'General',
       'General',

       'Travel & Local',
       'Travel & Local',
       'Travel & Local',
       'Travel & Local',

       'General',
       'General',

       'Productivity',
       'Productivity',
       'Productivity',
       'Productivity'
       ]
dev=['General',
     'General',
     'General',
     'General',
     'General',

     'app',
     'app',
     'web',
     'General',

     'General',
     'General',

     'General',
     'General',
     'General',
     'General'
     ]
type = ['Graphic',
        'Graphic',
        'Graphic',
        'Graphic',
        'Graphic',

        'Widget',
        'Widget',
        'Widget',
        'Widget',

        'Graphic',
        'Graphic',

        'Widget',
        'Widget',
        'Widget',
        'Widget'

        ]
widgets=[]

for i in range(len(name)):
    widgets.append({'name': name[i], 'location': location[i],
                      'desc': desc[i], 'cat': cat[i],
                      'dev': dev[i], 'type': type[i]
                      })
#  Uncomment the lines below to save widgets to the database

# for widget in widgets:
#     saveWidgets(widget['name'], widget['location'], widget['desc'], widget['cat'], widget['dev'], widget['type'])
# print(str(len(widgets)) + ' objects have been created')