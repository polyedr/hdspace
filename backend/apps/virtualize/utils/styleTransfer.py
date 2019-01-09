from pymongo import MongoClient
from virtualize.utils.metaCustomUtils import get_collection



client = MongoClient('mongodb://mongo:mongo@db')  # maxPoolSize=50
db = client.MeduzaDb


def propertyTransfer(user,masterfile, screens_name,status):

    grid_1 = {}
    grid_2 = {}
    grid_3 = {}
    master_id = None

    master_id_collection = db.screenshots.find({'user_id':str(user)})
    for id in master_id_collection:
        aux_id = id['screenName']
        if aux_id.upper() == masterfile.upper():
            master_id = str(id['_id'])
    screens=[]
    for s in screens_name:
        s_id = str(db.screenshots.find_one({'user_id':str(user),'screenName': s})['_id'])
        screens.append(s_id)

    buttonArray = get_collection(db.buttons, master_id)
    textBoxArray = get_collection(db.textBoxes, master_id)
    textAreaArray = get_collection(db.textArea, master_id)
    hyperLinkArray = get_collection(db.hyperLinks, master_id)
    paragraphArray = get_collection(db.paragraphs, master_id)
    newElementsArray = get_collection(db.newElements, master_id)
    widgetArray = get_collection(db.widgets, master_id)
    calendarWidgetsArray = get_collection(db.calendarWidgets, master_id)
    barChartArray = get_collection(db.barChart, master_id)


    grid_1_buttons = []
    grid_1_textBox = []
    grid_1_textArea = []
    grid_1_hyper = []
    grid_1_para = []
    grid_1_new = []
    grid_2_buttons = []
    grid_2_textBox = []
    grid_2_textArea = []
    grid_2_hyper = []
    grid_2_para = []
    grid_2_new = []
    grid_3_buttons = []
    grid_3_textBox = []
    grid_3_textArea = []
    grid_3_hyper = []
    grid_3_para = []
    grid_3_new = []

    for b in buttonArray:
        location_grid = int((float(b['location']['y1']) - float(b['location']['y0']))/2 + float(b['location']['y0']))
        if location_grid <= 32 :
            grid_1_buttons.append(str(b['seg_id']))
        elif 33 <= location_grid < 65:
            grid_2_buttons.append(str(b['seg_id']))
        else:
            grid_3_buttons.append(str(b['seg_id']))

    for tb in textBoxArray:
        location_grid = int((float(tb['location']['y1']) - float(tb['location']['y0']))/2 + float(tb['location']['y0']))
        if location_grid <= 32 :
            grid_1_textBox.append(str(tb['seg_id']))
        elif 33 <= location_grid < 65:
            grid_2_textBox.append(str(tb['seg_id']))
        else:
            grid_3_textBox.append(str(tb['seg_id']))

    for ta in textAreaArray:
        location_grid = int((float(ta['location']['y1']) - float(ta['location']['y0']))/2 + float(ta['location']['y0']))
        if location_grid <= 32 :
            grid_1_textArea.append(str(ta['seg_id']))
        elif 33 <= location_grid < 65:
            grid_2_textArea.append(str(ta['seg_id']))
        else:
            grid_3_textArea.append(str(ta['seg_id']))

    for h in hyperLinkArray:
        location_grid = int((float(h['location']['y1']) - float(h['location']['y0']))/2 + float(h['location']['y0']))
        if location_grid <= 32 :
            grid_1_hyper.append(str(h['seg_id']))
        elif 33 <= location_grid < 65:
            grid_2_hyper.append(str(h['seg_id']))
        else:
            grid_3_hyper.append(str(h['seg_id']))

    for p in paragraphArray:
        location_grid = int((float(p['location']['y1']) - float(p['location']['y0'])) / 2 + float(p['location']['y0']))
        if location_grid <= 32:
            grid_1_para.append(str(p['seg_id']))
        elif 33 <= location_grid < 65:
            grid_2_para.append(str(p['seg_id']))
        else:
            grid_3_para.append(str(p['seg_id']))

    for n in newElementsArray:
        location_grid = int((float(n['location']['y1']) - float(n['location']['y0'])) / 2 + float(n['location']['y0']))
        if location_grid <= 32:
            if str(n['type']) == 'button':
                grid_1_buttons.append(str(n['class_id']))
            elif str(n['type']) == 'hyperlink':
                grid_1_hyper.append(str(n['class_id']))
            elif str(n['type']) == 'textArea':
                grid_1_textArea.append(str(n['class_id']))
            elif str(n['type']) == 'textbox':
                grid_1_textBox.append(str(n['class_id']))
            elif str(n['type']) == 'paragraph':
                grid_1_para.append(str(n['class_id']))
        elif 33 <= location_grid < 65:
            if str(n['type']) == 'button':
                grid_2_buttons.append(str(n['class_id']))
            elif str(n['type']) == 'hyperlink':
                grid_2_hyper.append(str(n['class_id']))
            elif str(n['type']) == 'textArea':
                grid_2_textArea.append(str(n['class_id']))
            elif str(n['type']) == 'textbox':
                grid_2_textBox.append(str(n['class_id']))
            elif str(n['type']) == 'paragraph':
                grid_2_para.append(str(n['class_id']))
        else:
            if str(n['type']) == 'button':
                grid_3_buttons.append(str(n['class_id']))
            elif str(n['type']) == 'hyperlink':
                grid_3_hyper.append(str(n['class_id']))
            elif str(n['type']) == 'textArea':
                grid_3_textArea.append(str(n['class_id']))
            elif str(n['type']) == 'textbox':
                grid_3_textBox.append(str(n['class_id']))
            elif str(n['type']) == 'paragraph':
                grid_3_para.append(str(n['class_id']))
    grid_1['buttons'] = grid_1_buttons
    grid_1['textbox'] = grid_1_textBox
    grid_1['textArea'] = grid_1_textArea
    grid_1['hyperlink'] = grid_1_hyper
    grid_1['paragraph'] = grid_1_para

    grid_2['buttons'] = grid_2_buttons
    grid_2['textbox'] = grid_2_textBox
    grid_2['textArea'] = grid_2_textArea
    grid_2['hyperlink'] = grid_2_hyper
    grid_2['paragraph'] = grid_2_para

    grid_3['buttons'] = grid_3_buttons
    grid_3['textbox'] = grid_3_textBox
    grid_3['textArea'] = grid_3_textArea
    grid_3['hyperlink'] = grid_3_hyper
    grid_3['paragraph'] = grid_3_para

    for src in screens:
        try:
             s =transfering(grid_1,grid_2,grid_3,master_id,src,status)
             print(s)
        except:
            print('Transfering style issue')

    return screens

def transfering(zone_1,zone_2,zone_3,master,source,status):

    grid_1 = zone_1
    grid_2 = zone_2
    grid_3 = zone_3
    screenshot_id = str(source)
    master_id = master

    masterButtonArray = get_collection(db.buttons, master_id)
    masterTextBoxArray = get_collection(db.textBoxes, master_id)
    masterTextAreaArray = get_collection(db.textArea, master_id)
    masterHyperLinkArray = get_collection(db.hyperLinks, master_id)
    masterParagraphArray = get_collection(db.paragraphs, master_id)
    masterNewElementsArray = get_collection(db.newElements, master_id)
    print("new elements array")
    print(masterNewElementsArray)

    buttonArray = get_collection(db.buttons, screenshot_id)
    textBoxArray = get_collection(db.textBoxes, screenshot_id)
    textAreaArray = get_collection(db.textArea, screenshot_id)
    hyperLinkArray = get_collection(db.hyperLinks, screenshot_id)
    paragraphArray = get_collection(db.paragraphs, screenshot_id)
    frameArray = get_collection(db.frames, screenshot_id)
    logoArray = get_collection(db.pictures, screenshot_id)
    newElementsArray = get_collection(db.newElements, screenshot_id)

    for b in buttonArray:
        location_grid = int((float(b['location']['y1']) - float(b['location']['y0']))/2 + float(b['location']['y0']))
        if location_grid <= 32:
            id = ''
            buttons_1 = grid_1['buttons']
            buttons_2 = grid_2['buttons']
            buttons_3 = grid_3['buttons']
            if len(buttons_1) > 0:
                id = buttons_1[0]
            elif len(buttons_2) > 0:
                id = buttons_2[0]
            elif len(buttons_3) > 0:
                id = buttons_3[0]
            if id != '':
                if status == 1:
                    updateElementStyle(id,b['seg_id'])
                elif status == 2:
                    updateElementColor(id,b['seg_id'])
                else:
                    updateElementStyle(id, b['seg_id'])
                    updateElementColor(id, b['seg_id'])

        elif 33 <= location_grid <= 65:
            id = ''
            buttons_1 = grid_1['buttons']
            buttons_2 = grid_2['buttons']
            buttons_3 = grid_3['buttons']
            if len(buttons_2) > 0:
                id = buttons_2[0]
            elif len(buttons_3) > 0:
                id = buttons_3[0]
            elif len(buttons_1) > 0:
                id = buttons_1[0]
            if id != '':
                if status == 1:
                    updateElementStyle(id,b['seg_id'])
                elif status == 2:
                    updateElementColor(id,b['seg_id'])
                else:
                    updateElementStyle(id, b['seg_id'])
                    updateElementColor(id, b['seg_id'])
        else:
            id = ''
            buttons_1 = grid_1['buttons']
            buttons_2 = grid_2['buttons']
            buttons_3 = grid_3['buttons']
            if len(buttons_3) > 0:
                id = buttons_3[0]
            elif len(buttons_2) > 0:
                id = buttons_2[0]
            elif len(buttons_1) > 0:
                id = buttons_1[0]
            if id != '':
                if status == 1:
                    updateElementStyle(id,b['seg_id'])
                elif status == 2:
                    updateElementColor(id,b['seg_id'])
                else:
                    updateElementStyle(id, b['seg_id'])
                    updateElementColor(id, b['seg_id'])

    for b in hyperLinkArray:
        location_grid = int((float(b['location']['y1']) - float(b['location']['y0']))/2 + float(b['location']['y0']))
        if location_grid <= 32:
            id = ''
            hyperlink_1 = grid_1['hyperlink']
            hyperlink_2 = grid_2['hyperlink']
            hyperlink_3 = grid_3['hyperlink']
            if len(hyperlink_1) > 0:
                id = hyperlink_1[0]
            elif len(hyperlink_2) > 0:
                id = hyperlink_2[0]
            elif len(hyperlink_3) > 0:
                id = hyperlink_3[0]
            if id != '':
                if status == 1:
                    updateElementStyle(id,b['seg_id'])
                elif status == 2:
                    updateElementColor(id,b['seg_id'])
                else:
                    updateElementStyle(id, b['seg_id'])
                    updateElementColor(id, b['seg_id'])
        elif 33 <= location_grid <= 65:
            id = ''
            hyperlink_1 = grid_1['hyperlink']
            hyperlink_2 = grid_2['hyperlink']
            hyperlink_3 = grid_3['hyperlink']
            if len(hyperlink_2) > 0:
                id = hyperlink_2[0]
            elif len(hyperlink_3) > 0:
                id = hyperlink_3[0]
            elif len(hyperlink_1) > 0:
                id = hyperlink_1[0]

            if id != '':
                if status == 1:
                    updateElementStyle(id,b['seg_id'])
                elif status == 2:
                    updateElementColor(id,b['seg_id'])
                else:
                    updateElementStyle(id, b['seg_id'])
                    updateElementColor(id, b['seg_id'])
        else:
            id = ''
            hyperlink_1 = grid_1['hyperlink']
            hyperlink_2 = grid_2['hyperlink']
            hyperlink_3 = grid_3['hyperlink']
            if len(hyperlink_3) > 0:
                id = hyperlink_3[0]
            elif len(hyperlink_2) > 0:
                id = hyperlink_2[0]
            elif len(hyperlink_1) > 0:
                id = hyperlink_1[0]

            if id != '':
                if status == 1:
                    updateElementStyle(id,b['seg_id'])
                elif status == 2:
                    updateElementColor(id,b['seg_id'])
                else:
                    updateElementStyle(id, b['seg_id'])
                    updateElementColor(id, b['seg_id'])

    for b in textBoxArray:
        location_grid = int((float(b['location']['y1']) - float(b['location']['y0']))/2 + float(b['location']['y0']))
        if location_grid <= 32:
            id = ''
            textbox_1 = grid_1['textbox']
            textbox_2 = grid_2['textbox']
            textbox_3 = grid_3['textbox']
            if len(textbox_1) > 0:
                id = textbox_1[0]
            elif len(textbox_2) > 0:
                id = textbox_2[0]
            elif len(textbox_3) > 0:
                id = textbox_3[0]

            if id != '':
                if status == 1:
                    updateElementStyle(id,b['seg_id'])
                elif status == 2:
                    updateElementColor(id,b['seg_id'])
                else:
                    updateElementStyle(id, b['seg_id'])
                    updateElementColor(id, b['seg_id'])
        elif 33 <= location_grid <= 65:
            id = ''
            textbox_1 = grid_1['textbox']
            textbox_2 = grid_2['textbox']
            textbox_3 = grid_3['textbox']
            if len(textbox_2) > 0:
                id = textbox_2[0]
            elif len(textbox_3) > 0:
                id = textbox_3[0]
            elif len(textbox_1) > 0:
                id = textbox_1[0]

            if id != '':
                if status == 1:
                    updateElementStyle(id,b['seg_id'])
                elif status == 2:
                    updateElementColor(id,b['seg_id'])
                else:
                    updateElementStyle(id, b['seg_id'])
                    updateElementColor(id, b['seg_id'])
        else:
            id = ''
            textbox_1 = grid_1['textbox']
            textbox_2 = grid_2['textbox']
            textbox_3 = grid_3['textbox']
            if len(textbox_3) > 0:
                id = textbox_3[0]
            elif len(textbox_2) > 0:
                id = textbox_2[0]
            elif len(textbox_1) > 0:
                id = textbox_1[0]

            if id != '':
                if status == 1:
                    updateElementStyle(id,b['seg_id'])
                elif status == 2:
                    updateElementColor(id,b['seg_id'])
                else:
                    updateElementStyle(id, b['seg_id'])
                    updateElementColor(id, b['seg_id'])

    for b in textAreaArray:
        location_grid = int((float(b['location']['y1']) - float(b['location']['y0']))/2 + float(b['location']['y0']))
        if location_grid <= 32:
            id = ''
            textArea_1 = grid_1['textArea']
            textArea_2 = grid_2['textArea']
            textArea_3 = grid_3['textArea']
            if len(textArea_1) > 0:
                id = textArea_1[0]
            elif len(textArea_2) > 0:
                id = textArea_2[0]
            elif len(textArea_3) > 0:
                id = textArea_3[0]

            if id != '':
                if status == 1:
                    updateElementStyle(id,b['seg_id'])
                elif status == 2:
                    updateElementColor(id,b['seg_id'])
                else:
                    updateElementStyle(id, b['seg_id'])
                    updateElementColor(id, b['seg_id'])
        elif 33 <= location_grid <= 65:
            id = ''
            textArea_1 = grid_1['textArea']
            textArea_2 = grid_2['textArea']
            textArea_3 = grid_3['textArea']
            if len(textArea_2) > 0:
                id = textArea_2[0]
            elif len(textArea_3) > 0:
                id = textArea_3[0]
            elif len(textArea_1) > 0:
                id = textArea_1[0]

            if id != '':
                if status == 1:
                    updateElementStyle(id,b['seg_id'])
                elif status == 2:
                    updateElementColor(id,b['seg_id'])
                else:
                    updateElementStyle(id, b['seg_id'])
                    updateElementColor(id, b['seg_id'])
        else:
            id = ''
            textArea_1 = grid_1['textArea']
            textArea_2 = grid_2['textArea']
            textArea_3 = grid_3['textArea']
            if len(textArea_3) > 0:
                id = textArea_3[0]
            elif len(textArea_2) > 0:
                id = textArea_2[0]
            elif len(textArea_1) > 0:
                id = textArea_1[0]

            if id != '':
                if status == 1:
                    updateElementStyle(id,b['seg_id'])
                elif status == 2:
                    updateElementColor(id,b['seg_id'])
                else:
                    updateElementStyle(id, b['seg_id'])
                    updateElementColor(id, b['seg_id'])

    for b in paragraphArray:
        location_grid = int((float(b['location']['y1']) - float(b['location']['y0']))/2 + float(b['location']['y0']))
        if location_grid <= 32:
            id = ''
            paragraph_1 = grid_1['paragraph']
            paragraph_2 = grid_2['paragraph']
            paragraph_3 = grid_3['paragraph']
            if len(paragraph_1) > 0:
                id = paragraph_1[0]
            elif len(paragraph_2) > 0:
                id = paragraph_2[0]
            elif len(paragraph_3) > 0:
                id = paragraph_3[0]

            if id != '':
                if status == 1:
                    updateElementStyle(id,b['seg_id'])
                elif status == 2:
                    updateElementColor(id,b['seg_id'])
                else:
                    updateElementStyle(id, b['seg_id'])
                    updateElementColor(id, b['seg_id'])
        elif 33 <= location_grid <= 65:
            id = ''
            paragraph_1 = grid_1['paragraph']
            paragraph_2 = grid_2['paragraph']
            paragraph_3 = grid_3['paragraph']
            if len(paragraph_2) > 0:
                id = paragraph_2[0]
            elif len(paragraph_3) > 0:
                id = paragraph_3[0]
            elif len(paragraph_1) > 0:
                id = paragraph_1[0]

            if id != '':
                if status == 1:
                    updateElementStyle(id,b['seg_id'])
                elif status == 2:
                    updateElementColor(id,b['seg_id'])
                else:
                    updateElementStyle(id, b['seg_id'])
                    updateElementColor(id, b['seg_id'])
        else:
            id = ''
            paragraph_1 = grid_1['paragraph']
            paragraph_2 = grid_2['paragraph']
            paragraph_3 = grid_3['paragraph']
            if len(paragraph_3) > 0:
                id = paragraph_3[0]
            elif len(paragraph_2) > 0:
                id = paragraph_2[0]
            elif len(paragraph_1) > 0:
                id = paragraph_1[0]

            if id != '':
                if status == 1:
                    updateElementStyle(id,b['seg_id'])
                elif status == 2:
                    updateElementColor(id,b['seg_id'])
                else:
                    updateElementStyle(id, b['seg_id'])
                    updateElementColor(id, b['seg_id'])
    for b in newElementsArray:
        location_grid = int((float(b['location']['y1']) - float(b['location']['y0']))/2 + float(b['location']['y0']))
        element_type = b['type']
        database = ''
        if element_type == 'button':
            grid_1_element = grid_1['buttons']
            grid_2_element = grid_2['buttons']
            grid_3_element = grid_3['buttons']

        elif element_type == 'hyperlink':
            grid_1_element = grid_1['hyperlink']
            grid_2_element = grid_2['hyperlink']
            grid_3_element = grid_3['hyperlink']

        elif element_type == 'paragraph':
            grid_1_element = grid_1['paragraph']
            grid_2_element = grid_2['paragraph']
            grid_3_element = grid_3['paragraph']

        elif element_type == "textbox":
            grid_1_element = grid_1['textbox']
            grid_2_element = grid_2['textbox']
            grid_3_element = grid_3['textbox']

        elif element_type == "textArea":
            grid_1_element = grid_1['textArea']
            grid_2_element = grid_2['textArea']
            grid_3_element = grid_3['textArea']

        else:
            print( 'No element')
        if location_grid <= 32:
            id = ''
            element_1 = grid_1_element
            element_2 = grid_2_element
            element_3 = grid_3_element
            if len(element_1) > 0:
                id = element_1[0]
            elif len(element_2) > 0:
                id = element_2[0]
            elif len(element_3) > 0:
                id = element_3[0]

            if id != '':
                if status == 1:
                    updateElementStyle(id, b['class_id'])
                elif status == 2:
                    updateElementColor(id, b['class_id'])
                else:
                    updateElementStyle(id, b['class_id'])
                    updateElementColor(id, b['class_id'])
        elif 33 <= location_grid <= 65:
            id = ''
            element_1 = grid_1_element
            element_2 = grid_2_element
            element_3 = grid_3_element
            if len(element_1) > 0:
                id = element_1[0]
            elif len(element_2) > 0:
                id = element_2[0]
            elif len(element_3) > 0:
                id = element_3[0]

            if id != '':
                if status == 1:
                    updateElementStyle(id,b['class_id'])
                elif status == 2:
                    updateElementColor(id,b['class_id'])
                else:
                    updateElementStyle(id, b['class_id'])
                    updateElementColor(id, b['class_id'])
        else:
            id = ''
            element_1 = grid_1_element
            element_2 = grid_2_element
            element_3 = grid_3_element
            if len(element_1) > 0:
                id = element_1[0]
            elif len(element_2) > 0:
                id = element_2[0]
            elif len(element_3) > 0:
                id = element_3[0]

            if id != '':
                if status == 1:
                    updateElementStyle(id,b['class_id'])
                elif status == 2:
                    updateElementColor(id,b['class_id'])
                else:
                    updateElementStyle(id, b['class_id'])
                    updateElementColor(id, b['class_id'])

    if status != 1:
        updateBackgroundColor(master_id,screenshot_id)


    return 'succesfuly transfer'

def updateElementStyle(masterStyle_id,source_id):

    master_style = db.styles.find_one({'segmentation_id':masterStyle_id})
    if master_style == None:
        master_style = db.newStyle.find_one({'element_id':masterStyle_id})

    target_style = db.styles.find_one({'segmentation_id':source_id})

    if target_style != None:
        db.styles.update({'segmentation_id': source_id}, {
            '$set':
                {
                    'fontFamily': master_style['fontFamily'],
                    'borderRadius':master_style['borderRadius'],
                    'textAlign':master_style['textAlign'],
                    'textIndent':master_style['textIndent']
                }
        })
    else:
        db.newStyle.update({'element_id': source_id},{
            '$set':
                {
                    'fontFamily': master_style['fontFamily'],
                    'borderRadius': master_style['borderRadius'],
                    'textAlign': master_style['textAlign'],
                    'textIndent': master_style['textIndent']
                }
        })
    return 1

def updateElementColor(masterStyle_id,source_id):
    master_style = db.styles.find_one({'segmentation_id': masterStyle_id})
    if master_style == None:
        master_style = db.newStyle.find_one({'element_id': masterStyle_id})

    target_style = db.styles.find_one({'segmentation_id': source_id})

    if target_style != None:
        db.styles.update({'segmentation_id': source_id}, {
            '$set':
                {
                    'fontColor': master_style['fontColor'],
                    'borderColor': master_style['borderColor'],
                    'bgcolor': master_style['bgcolor']
                }
        })
    else:
        db.newStyle.update({'element_id': source_id}, {
            '$set':
                {
                    'fontColor': master_style['fontColor'],
                    'borderColor': master_style['borderColor'],
                    'bgcolor': master_style['bgcolor']
                }
        })
    return 1

def updateBackgroundColor(master_id,screenshot_id):

    masterColor = db.backgrounds.find_one({'screenshot_id':master_id})
    if db.backgrounds.find_one({'screenshot_id':screenshot_id}) != None:

        db.backgrounds.update({'screenshot_id': screenshot_id}, {
            '$set':
                {
                    'background': masterColor['background']
                }
        })