from pymongo import MongoClient
client = MongoClient('localhost', 27017)  # maxPoolSize=50
db = client.mainDB

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

#newcnnModel1Test4Bar()
#cnnModelFirst()