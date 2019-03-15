from apps.virtualize.models import *
from PIL import Image
from skimage import io, color, measure
import re
from skimage import io
from datetime import datetime, date
from apps.virtualize.utils.metaCustomUtils import *
from apps.virtualize.utils.screenshotUtils import getLatestScreenshot

client = pymongo.MongoClient('localhost', 27017)  # maxPoolSize=50
db = client.MeduzaDb


def metaCustom(currentUser, myFile, screenshot_id, state):

    with Image.open('media/' + str(myFile)) as img:
        widthScreen, heightScreen = img.size

    ButtonArray = get_collection(db.buttons, screenshot_id)
    textBoxArray = get_collection(db.textBoxes, screenshot_id)
    textAreaArray = get_collection(db.textArea, screenshot_id)
    hyperLinkArray = get_collection(db.hyperLinks, screenshot_id)
    paragraphArray = get_collection(db.paragraphs, screenshot_id)
    frameArray = get_collection(db.frames, screenshot_id)
    pictureArray = get_collection(db.pictures, screenshot_id)
    newElementsArray = get_collection(db.newElements, screenshot_id)
    widgetArray = get_collection(db.widgets, screenshot_id)
    calendarWidgetsArray = get_collection(db.calendarWidgets, screenshot_id)
    barChartArray = get_collection(db.barChart, screenshot_id)
    iconArray = get_collection(db.icon, screenshot_id)
    logoArray = get_collection(db.logo, screenshot_id)

    '#####################################   DEF of META ALGO  #####################################################'

    '# CREATION OF HTML AND CSS PAGE'
    '# FUNCTION TO OPEN, CREATE, SAVE AND CLOSE FILES'
    if 'Html & Css' == 'Html & Css':
        # pagehtml is used for deviceContainer
        # pagehtml1 is used for prototpe mode
        # pagehtml2 is used for workflow mode
        # pagehtml3 is used for suggestions for the screen
        def create_page_Html_and_Css_and_js(path, titleHtml, titleCssJS):
            print('this is my user')
            print(str(currentUser))
            croppedFileName = str(myFile[int(len(str(currentUser))) + 7:-4])
            import os
            try:
                os.stat('static/users/' + str(currentUser) + '/' + croppedFileName + '/')
            except:
                os.makedirs('static/users/' + str(currentUser) + '/' + croppedFileName + '/')
            # Root Project HTML Page
            pagehtml = open(
                'static/users/' + str(currentUser) + '/' + croppedFileName + '/' + titleHtml + '.html',
                mode='w', encoding='UTF-8')
            pagehtml.write(
                '<section id="classContainer-selector" class="classContainer' + screenshot_id + '" style="height:100%;">')

            # Root Project html for?
            pagehtml1 = open(
                'static/users/' + str(currentUser) + '/' + croppedFileName + '/' + titleHtml + 'Pro.html',
                mode='w', encoding='UTF-8')
            pagehtml1.write(
                '<section id="classContainer-selectorPro" class="classContainer' + screenshot_id + ' dafuk " style="height:100%;">')
            # Root Project html for?
            pagehtml2 = open(
                'static/users/' + str(currentUser) + '/' + croppedFileName + '/' + titleHtml + 'Work.html',
                mode='w', encoding='UTF-8')
            pagehtml2.write(
                '<section id="classContainer-selectorWork" class="classContainer' + screenshot_id + '" style="height:100%;">')
            # Root Project html for?
            pagehtml3 = open(
                'static/users/' + str(currentUser) + '/' + croppedFileName + '/' + titleHtml + 'Suggestions.html',
                mode='w', encoding='UTF-8')
            pagehtml3.write(
                '<section class="classContainer' + screenshot_id + '" style="height:100%;">')
            # root css page
            try:
                os.stat('static/users/' + str(currentUser) + '/' + croppedFileName + '/' + 'css/')
            except:
                os.mkdir('static/users/' + str(currentUser) + '/' + croppedFileName + '/' + 'css/')
            pagecss = open(
                'static/users/' + str(currentUser) + '/' + croppedFileName + '/' + 'css/' + titleCssJS + '.css',
                'w')
            return pagehtml, pagecss, pagehtml1, pagehtml2, pagehtml3

        def close_page_html_and_css_end():
            pagehtml.write('</body>')
            pagehtml.close()
            pagecss.close()

        def close_page_html_end():
            pagehtml.write('</section>')
            pagehtml.close()
            pagehtml1.write('</section>')
            pagehtml1.close()
            pagehtml2.write('</section>')
            pagehtml2.close()
            pagehtml3.write('</section>')
            pagehtml3.close()

        def close_page_html():
            pagehtml.close()
            pagehtml1.close()
            pagehtml2.close()
            pagehtml3.close()

        def close_page_css():
            pagecss.close()

            # BASIC ELEMENTS FOR DEMO

            # CREATION OF BUTTON AND TEXTBOX

        def create_button(label, classid, width, height, borderRadius, positionL, positionT, bgcolor, borderColor,
                          fontColor, fontSize, fontFamily, link, zIndex):

            if link != '':

                pagehtml.write(
                    '<button drag-resize type="button" linkvalue= "' + link + '" class="class' +
                    classid + ' main" id="id' + classid + '">' + label + '</button>\n')
                pagehtml1.write(
                    '<button type="button" linkvalue= "' + link + '" class="class' +
                    classid + ' main" id="id' + classid + 'pro">' + label + '</button>\n')
                pagehtml2.write(
                    '<button type="button" linkvalue= "' + link + '" class="class' +
                    classid + ' main" id="id' + classid + 'work" style="font-size: '+str(float(fontSize)/float(5))
                    +'vw;">' + label + '</button>\n')
                pagehtml3.write(
                    '<button type="button" linkvalue= "' + link + '" class="class' +
                    classid + ' main" id="id' + classid + 'suggestions">' + label + '</button>\n')
                pagecss.write(
                    '.class' + classid + '{height:' + height + '%; width:' + width + '%; border-radius: ' +
                    borderRadius + 'px;\
                            border: 1px solid ' + borderColor + '; background-color: ' + bgcolor + '; font-size: '
                    + fontSize + 'vw; color: ' + fontColor + ';\
                            position:absolute; left:' + positionL + '%; top:' + positionT +
                    '%; font-family: ' + fontFamily + '; z-index:' + zIndex + ';}' + ' ' + '#id' + classid + '{}\n')
                # pageJs.write('<script type="text/javascript">\n document.getElementById("' +
                #     classid + '").onclick = function () {\n' +
                #     'location.href = ' + link + ';''\n};\n''</script>')

            else:


                pagehtml.write(
                    '<button drag-resize type="button" class="class' + classid + ' main" id="id' + classid + '">' + label + '</button>\n')
                pagehtml1.write(
                    '<button drag-resize type="button" class="class' + classid + ' main" id="id' + classid + 'pro">' + label + '</button>\n')
                pagehtml2.write(
                    '<button drag-resize type="button" class="class' + classid + ' main" id="id' + classid +
                    'work" style="font-size: '+str(float(fontSize)/float(5))+'vw;">' + label + '</button>\n')
                pagehtml3.write(
                    '<button drag-resize type="button" class="class' + classid + ' main" id="id' + classid + 'suggestions">' + label + '</button>\n')
                pagecss.write('.class' + classid + '{height:' + height + '%; width:' + width + '%; border-radius: ' +
                              borderRadius + 'px; border: 1px solid ' + borderColor + '; background-color: ' +
                              bgcolor + '; font-size: ' + fontSize + 'vw; color: ' + fontColor +
                              ';position:absolute; left:' + positionL + '%; top:' + positionT + '%; font-family: ' +
                              fontFamily + '; z-index:' + zIndex + '}' + ' ' + '#id' + classid + '{}\n')
        def create_new_button(label, classid, width, height, borderRadius, positionL, positionT, bgcolor, borderColor,
                          fontColor, fontSize, fontFamily, link, zIndex, virtual):

            if link != '':

                pagehtml.write(
                    '<button drag-resize type="button" linkvalue= "' + link + '" class="class' +
                    classid + ' ' + virtual + ' main" id="id' + classid + '">' + label + '</button>\n')
                pagehtml1.write(
                    '<button type="button" linkvalue= "' + link + '" class="class' +
                    classid + ' ' + virtual + ' main" id="id' + classid + 'pro">' + label + '</button>\n')
                pagehtml2.write(
                    '<button type="button" linkvalue= "' + link + '" class="class' +
                    classid + ' ' + virtual + ' main" id="id' + classid + 'work" style="font-size: '+str(float(fontSize)/float(5))+'vw;">' + label + '</button>\n')
                pagehtml3.write(
                    '<button type="button" linkvalue= "' + link + '" class="class' +
                    classid + ' ' + virtual + ' main" id="id' + classid + 'suggestions">' + label + '</button>\n')
                pagecss.write(
                    '.class' + classid + '{height:' + height + '%; width:' + width + '%; border-radius: ' + borderRadius + 'px;\
                            border: 1px solid ' + borderColor + '; background-color: ' + bgcolor + '; font-size: ' + fontSize + 'vw; color: ' + fontColor + ';\
                            position:absolute; left:' + positionL + '%; top:' + positionT +
                    '%; font-family: ' + fontFamily + '; z-index:' + zIndex + ';}' + ' ' + '#id' + classid + '{}\n')

            else:

                pagehtml.write(
                    '<button drag-resize type="button" class="class' + classid + ' ' + virtual + ' main" id="id' + classid + '">' + label + '</button>\n')
                pagehtml1.write(
                    '<button drag-resize type="button" class="class' + classid + ' ' + virtual + ' main" id="id' + classid + 'pro">' + label + '</button>\n')
                pagehtml2.write(
                    '<button drag-resize type="button" class="class' + classid + ' ' + virtual + ' main" id="id' + classid +
                    'work" style="font-size: '+str(float(fontSize)/float(5))+'vw;">' + label + '</button>\n')
                pagehtml3.write(
                    '<button drag-resize type="button" class="class' + classid + ' ' + virtual + ' main" id="id' + classid + 'suggestions">' + label + '</button>\n')
                pagecss.write('.class' + classid + '{height:' + height + '%; width:' + width + '%; border-radius: ' +
                              borderRadius + 'px; border: 1px solid ' + borderColor + '; background-color: ' +
                              bgcolor + '; font-size: ' + fontSize + 'vw; color: ' + fontColor +
                              ';position:absolute; left:' + positionL + '%; top:' + positionT + '%; font-family: ' +
                              fontFamily + '; z-index:' + zIndex + '}' + ' ' + '#id' + classid + '{}\n')


        def create_button_load(label, classid, width, height, borderRadius, positionL, positionT, bgcolor, borderColor,
                                  fontColor, fontSize, fontFamily, link, zIndex):

                    if link != '':

                        pagehtml.write(
                            # '<button drag-resize type="button" onclick= "window.location.href=\''+link+'\'" class="class' +
                            '<button drag-resize type="button" linkvalue= "' + link + '" class="class' +
                            classid + ' main" id="id' + classid + '">' + label + '</button>\n')
                        pagehtml1.write(
                            # '<button drag-resize type="button" onclick= "window.location.href=\''+link+'\'" class="class' +
                            '<button type="button" linkvalue= "' + link + '" class="class' +
                            classid + ' main" id="id' + classid + 'pro">' + label + '</button>\n')
                        pagehtml2.write(
                            # '<button drag-resize type="button" onclick= "window.location.href=\''+link+'\'" class="class' +
                            '<button type="button" linkvalue= "' + link + '" class="class' +
                            classid + ' main" id="id' + classid + 'work" style="font-size: '+str(float(fontSize)/float(5))+'px;">' + label + '</button>\n')
                        pagehtml3.write(
                            # '<button drag-resize type="button" onclick= "window.location.href=\''+link+'\'" class="class' +
                            '<button type="button" linkvalue= "' + link + '" class="class' +
                            classid + ' main" id="id' + classid + 'suggestions">' + label + '</button>\n')
                        pagecss.write(
                            '.class' + classid + '{height:' + height + '%; width:' + width + '%; border-radius: ' + borderRadius + 'px;\
                                    border: 1px solid ' + borderColor + '; background-color: ' + bgcolor + '; font-size: ' + fontSize + 'px; color: ' + fontColor + ';\
                                    position:absolute; left:' + positionL + '%; top:' + positionT +
                            '%; font-family: ' + fontFamily + '; z-index:' + zIndex + ';}' + ' ' + '#id' + classid + '{}\n')
                        # pageJs.write('<script type="text/javascript">\n document.getElementById("' +
                        #     classid + '").onclick = function () {\n' +
                        #     'location.href = ' + link + ';''\n};\n''</script>')

                    else:
                        pagehtml.write(
                            '<button drag-resize type="button" class="class' + classid + ' main" id="id' + classid + '">' + label + '</button>\n')
                        pagehtml1.write(
                            '<button drag-resize type="button" class="class' + classid + ' main" id="id' + classid + 'pro">' + label + '</button>\n')
                        pagehtml2.write(
                            '<button drag-resize type="button" class="class' + classid + ' main" id="id' + classid +
                            'work" style="font-size: '+str(float(fontSize)/float(5))+'px;">' + label + '</button>\n')
                        pagehtml3.write(
                            '<button drag-resize type="button" class="class' + classid + ' main" id="id' + classid + 'suggestions">' + label + '</button>\n')
                    pagecss.write('.class' + classid + '{height:' + height + '%; width:' + width + '%; border-radius: ' +
                                  borderRadius + 'px; border: 1px solid ' + borderColor + '; background-color: ' +
                                  bgcolor + '; font-size: ' + fontSize + 'px; color: ' + fontColor +
                                  ';position:absolute; left:' + positionL + '%; top:' + positionT + '%; font-family: ' +
                                  fontFamily + '; z-index:' + zIndex + '}' + ' ' + '#id' + classid + '{}\n' +
                                  '#id' + str(classid) + ':hover{'
                                  + 'background-color: rgba(100, 100, 100, 0.3);'
                                  + 'border-width: 1px;border-style: dashed;'
                                  + 'border-color: black;}')

        def create_Button_label_icon_inside(label, classid_b, width_b, height_b, positionL_b, positionT_b, \
                                            src_icon, classid_i, width_i, height_i, positionL_i, positionT_i):
            pagehtml.write('<button type="button" class="class' + classid_b + ' main" id="id' + classid_b + '">\n\
                    <img src="' + src_icon + '" class="class' + classid_i + '" id="id' + classid_i + '">' + label + '\n\
                    </button>\n')
            pagehtml1.write('<button type="button" class="class' + classid_b + ' main" id="id' + classid_b + '">\n\
                                <img src="' + src_icon + '" class="class' + classid_i + '" id="id' + classid_i + 'pro">' + label + '\n\
                                </button>\n')
            pagehtml2.write('<button type="button" class="class' + classid_b + ' main" id="id' + classid_b + '">\n\
                                            <img src="' + src_icon + '" class="class' + classid_i + '" id="id' + classid_i + 'work">' + label + '\n\
                                            </button>\n')
            pagehtml3.write('<button type="button" class="class' + classid_b + ' main" id="id' + classid_b + '">\n\
                                            <img src="' + src_icon + '" class="class' + classid_i + '" id="id' + classid_i + 'suggestions">' + label + '\n\
                                            </button>\n')
            pagecss.write(
                '.class' + classid_b + '{height:' + height_b + '%; width:' + width_b + '%; position:absolute; left:' + positionL_b + '%;top:' + positionT_b + '%}' + ' ' + '#id' + classid_b + '{}\n\
                                 .class' + classid_i + '{height:' + height_i + '%; width:' + width_i + '%; position:absolute; left:' + positionL_i + '%;top:' + positionT_i + '%} #id' + classid_i + '{}\n')

        def create_Button_icon_inside(classid_b, width_b, height_b, positionL_b, positionT_b, \
                                      src_icon, classid_i, width_i, height_i, positionL_i, positionT_i):
            pagehtml.write(
                '<button type="button" class="draggable resize-drag class' + classid_b + ' main" id="id' + classid_b + '">\n\
                    <img src="' + src_icon + '" class="class' + classid_i + '" id="id' + classid_i + '">' + label + '\n\
                    </button>\n')
            pagehtml1.write(
                '<button type="button" class="draggable resize-drag class' + classid_b + ' main" id="id' + classid_b + '">\n\
                                <img src="' + src_icon + '" class="class' + classid_i + '" id="id' + classid_i + 'pro">' + label + '\n\
                                </button>\n')
            pagehtml2.write(
                '<button type="button" class="draggable resize-drag class' + classid_b + ' main" id="id' + classid_b + '">\n\
                                            <img src="' + src_icon + '" class="class' + classid_i + '" id="id' + classid_i + 'work">' + label + '\n\
                                            </button>\n')
            pagehtml3.write(
                '<button type="button" class="draggable resize-drag class' + classid_b + ' main" id="id' + classid_b + '">\n\
                                            <img src="' + src_icon + '" class="class' + classid_i + '" id="id' + classid_i + 'suggestions">' + label + '\n\
                                            </button>\n')
            pagecss.write(
                '.class' + classid_b + '{height:' + height_b + '%; width:' + width_b + '%;position:absolute; left:' + positionL_b + '%;top:' + positionT_b + '%}' + ' ' + '#id' + classid_b + '{}\n\
                                 .class' + classid_i + '{height:' + height_i + '%; width:' + width_i + '%;position:absolute; left:' + positionL_i + '%;top:' + positionT_i + '%} #id' + classid_i + '{}\n')

        def create_text_box_placeholder_load(placeholder, name, width, height, classid, borderRadius, positionL, positionT,
                                        bgcolor, childOffset, fontSize, fontFamily, fontColor, textAlign, bordercolor,
                                        zIndex):
            pagehtml.write(
                '<input drag-resize type="text" name="' + name + '" class="class' + classid + ' main" id="id' + classid + '" \n\
                        placeholder="' + placeholder + '"></input>\n')
            pagehtml1.write(
                '<input drag-resize type="text" name="' + name + '" class="class' + classid + ' main" id="id' + classid + 'pro" \n\
                                    placeholder="' + placeholder + '"></input>\n')

            pagehtml2.write(
                '<input drag-resize type="text" name="' + name + '" class="class' + classid + ' main" id="id' + classid + 'work" \n\
                                                placeholder="' + placeholder + '" style="font-size: '+str(float(fontSize)/float(5))+'px;"></input>\n')
            pagehtml3.write(
                '<input drag-resize type="text" name="' + name + '" class="class' + classid + ' main" id="id' + classid + 'suggestions" \n\
                                                placeholder="' + placeholder + '"></input>\n')
            pagecss.write(
                '.class' + classid + '{height:' + height + '%;  text-indent: ' + childOffset + 'px; width:' + width + '%; border-radius: ' + borderRadius + 'px;\n\
                        border: 0px; position:absolute; left:' + positionL + '%; top:' + positionT + '%; font-size: ' + fontSize + 'px; color: ' + fontColor + ';text-align:' + textAlign + ';background-color: ' + bgcolor +
                '; font-family: ' + fontFamily + '; border: 1px solid; border-color:' + bordercolor + '; z-index: ' + zIndex + '}' + ' ' + '#id' + classid + '{}\n'+
                    '#id' + str(classid) + ':hover{'
                    + 'border-width: 1px;border-style: dashed;'
                    + 'border-color: rgba(24, 166, 137, 1);}')

        def create_text_box_placeholder_save(placeholder, name, width, height, classid, borderRadius, positionL, positionT,
                                               bgcolor, childOffset, fontSize, fontFamily, fontColor, textAlign, bordercolor,
                                               zIndex):
                   pagehtml.write(
                       '<input drag-resize type="text" name="' + name + '" class="class' + classid + ' main" id="id' + classid + '" \n\
                               placeholder="' + placeholder + '"></input>\n')
                   pagehtml1.write(
                       '<input drag-resize type="text" name="' + name + '" class="class' + classid + ' main" id="id' + classid + 'pro" \n\
                                           placeholder="' + placeholder + '"></input>\n')

                   pagehtml2.write(
                       '<input drag-resize type="text" name="' + name + '" class="class' + classid + ' main" id="id' + classid + 'work" \n\
                                                       placeholder="' + placeholder + '" style="font-size: '+str(float(fontSize)/float(5))+'vw;"></input>\n')
                   pagehtml3.write(
                       '<input drag-resize type="text" name="' + name + '" class="class' + classid + ' main" id="id' + classid + 'suggestions" \n\
                                                       placeholder="' + placeholder + '"></input>\n')
                   pagecss.write(
                       '.class' + classid + '{height:' + height + '%;  text-indent: ' + childOffset + 'px; width:' + width + '%; border-radius: ' + borderRadius + 'px;\n\
                               border: 0px; position:absolute; left:' + positionL + '%; top:' + positionT + '%; font-size: ' + fontSize + 'vw; color: ' + fontColor + ';text-align:' + textAlign + ';background-color: ' + bgcolor +
                       '; font-family: ' + fontFamily + '; border: 1px solid; border-color:' + bordercolor + '; z-index: ' + zIndex + '}' + ' ' + '#id' + classid + '{}\n')

        def create_text_box_placeholder_legend(legend, placeholder, name, classid, width, height, borderRadius,
                                               positionL,
                                               positionT, bgcolor):
            pagehtml.write(
                legend + ' : <input type="text" name="' + name + '" class="draggable resize-drag class' + classid + ' main" id="id' + classid + '" \
                        placeholder="' + placeholder + '"></input>\n')
            pagehtml1.write(
                legend + ' : <input type="text" name="' + name + '" class="draggable resize-drag class' + classid + ' main" id="id' + classid + 'pro" \
                                   placeholder="' + placeholder + '"></input>\n')
            pagehtml2.write(
                legend + ' : <input type="text" name="' + name + '" class="draggable resize-drag class' + classid + ' main" id="id' + classid + 'work" \
                                               placeholder="' + placeholder + '"></input>\n')
            pagehtml3.write(
                legend + ' : <input type="text" name="' + name + '" class="draggable resize-drag class' + classid + ' main" id="id' + classid + 'suggestions" \
                                               placeholder="' + placeholder + '"></input>\n')
            pagecss.write(
                '.class' + classid + '{height:' + height + '%; width:' + width + '%; border-radius: ' + borderRadius + 'px;\
                         border: 0px; position:absolute; left:' + positionL + '%; top:' + positionT + '%; \
                         background-color: ' + bgcolor + ';}' + ' ' + '#id' + classid + '{}\n')

        def create_text_box_legend(legend, classidf, positionLf, positionTf, fontSize, classidtb, width, height,
                                   borderRadius, positionL, positionT, bgcolor, childOffset, borderColor):
            pagehtml.write(
                '<p drag-resize class="class' + classidf + ' main" id="id' + classidf + '" style="margin:0">' + legend + '</p>\n\
                        <input drag-resize type="text" name="bla" class="class' + classidtb + '" id="id' + classidtb + '"></input>\n')
            pagehtml1.write(
                '<p drag-resize class="class' + classidf + ' main" id="id' + classidf + '" style="margin:0">' + legend + '</p>\n\
                                    <input drag-resize type="text" name="bla" class="class' + classidtb + '" id="id' + classidtb + 'pro"></input>\n')
            pagehtml2.write(
                '<p drag-resize class="class' + classidf + ' main" id="id' + classidf + '" style="margin:0">' + legend + '</p>\n\
                                                <input drag-resize type="text" name="bla" class="class' + classidtb + '" id="id' + classidtb + 'work"></input>\n')
            pagehtml3.write(
                '<p drag-resize class="class' + classidf + ' main" id="id' + classidf + '" style="margin:0">' + legend + '</p>\n\
                                                <input drag-resize type="text" name="bla" class="class' + classidtb + '" id="id' + classidtb + 'suggestions"></input>\n')
            pagecss.write(
                '.class' + classidf + '{position: absolute; left:' + positionLf + '%; top:' + positionTf + '%; font-size: ' + fontSize + '%;} #id' + classidf + '{} \n\
                        .class' + classidtb + '{height:' + height + '%; text-indent: ' + childOffset + 'px; width:' + width + '%;position:absolute; border-radius: ' + borderRadius + 'px; border: 1px solid ' + borderColor + '; \
                        left:' + positionL + '%; top:' + positionT + '%; background-color: ' + bgcolor + ';}' + ' ' + '#id' + classidtb + '{}\n')

        def create_text_area(place_holder, name, classid, width, height, positionL, positionT, childOffset, fontSize,
                             bgcolor, borderRadius, borderColor, fontFamily, zIndex, fontColor):
            pagehtml.write(
                '<textarea drag-resize  name="' + name + '" class="class' + classid + ' main" id="id' + classid + '" placeholder="' + place_holder + '"></textarea>\n')
            pagehtml1.write(
                '<textarea drag-resize  name="' + name + '" class="class' + classid + ' main" id="id' + classid + 'pro" placeholder="' + place_holder + '"></textarea>\n')
            pagehtml2.write(
                '<textarea drag-resize  name="' + name + '" class="class' + classid + ' main" id="id' + classid +
                'work" placeholder="' + place_holder + '" style="font-size: '+str(float(fontSize)/float(5))+'vw;";"></textarea>\n')
            pagehtml3.write(
                '<textarea drag-resize  name="' + name + '" class="class' + classid + ' main" id="id' + classid + 'suggestions" placeholder="' + place_holder + '"></textarea>\n')
            pagecss.write(
                '.class' + classid + '{resize: none; height:' + height + '%; text-indent: ' + childOffset + 'px ; width:' + width + '%;position:absolute; left:' + positionL + '%; \
                border-radius: ' + borderRadius + 'px; border: 1px solid ' + borderColor + '; top:' + positionT + '%; \
                font-size: ' + fontSize + 'vw; font-family: ' + fontFamily + '; color: ' + fontColor + '; background-color: ' + bgcolor + '; z-index: ' + zIndex + '}' + ' ' + '#id' + classid + '{}\n')


        def create_new_text_area(place_holder, name, classid, width, height, positionL, positionT, childOffset, fontSize,
                             bgcolor, borderRadius, borderColor, fontFamily, zIndex, fontColor, virtual):
            pagehtml.write(
                '<textarea drag-resize  name="' + name + '" class="class' + classid + ' ' + virtual + ' main" id="id' + classid + '" placeholder="' + place_holder + '"></textarea>\n')
            pagehtml1.write(
                '<textarea drag-resize  name="' + name + '" class="class' + classid + ' ' + virtual + ' main" id="id' + classid + 'pro" placeholder="' + place_holder + '"></textarea>\n')
            pagehtml2.write(
                '<textarea drag-resize  name="' + name + '" class="class' + classid + ' ' + virtual + ' main" id="id' + classid +
                'work" placeholder="' + place_holder + '" style="font-size: '+str(float(fontSize)/float(5))+'vw;";"></textarea>\n')
            pagehtml3.write(
                '<textarea drag-resize  name="' + name + '" class="class' + classid + ' ' + virtual + ' main" id="id' + classid + 'suggestions" placeholder="' + place_holder + '"></textarea>\n')
            pagecss.write(
                '.class' + classid + '{resize: none; height:' + height + '%; text-indent: ' + childOffset + 'px ; width:' + width + '%;position:absolute; left:' + positionL + '%; \
                border-radius: ' + borderRadius + 'px; border: 1px solid ' + borderColor + '; top:' + positionT + '%; \
                font-size: ' + fontSize + 'vw; font-family: ' + fontFamily + '; color: ' + fontColor + '; background-color: ' + bgcolor + '; z-index: ' + zIndex + '}' + ' ' + '#id' + classid + '{}\n')

        # CREATION OF IMAGE

        def create_image(icon_path, classid, width, height, positionL, positionT, borderColor, borderRadius, link,
                         zIndex):
            if link != '':
                pagehtml.write(
                    '<img drag-resize linkvalue= "' + link + '" src="/' + icon_path + '" class="class' + classid + ' main" id="id' + classid + '"/>\n')
                pagehtml1.write(
                    '<img drag-resize linkvalue= "' + link + '" src="/' + icon_path + '" class="class' + classid + ' main" id="id' + classid + 'pro"/>\n')
                pagehtml2.write(
                    '<img drag-resize linkvalue= "' + link + '" src="/' + icon_path + '" class="class' + classid + ' main" id="id' + classid + 'work"/>\n')
                pagehtml3.write(
                    '<img drag-resize linkvalue= "' + link + '" src="/' + icon_path + '" class="class' + classid + ' main" id="id' + classid + 'suggestions"/>\n')
                pagecss.write(
                    '.class' + classid + '{height: auto; width: auto; max-height:' + height + '%; max-width:' + width + '%;position:absolute; \
                    left:' + positionL + '%; top:' + positionT + '%; border-radius: ' + borderRadius + 'px; \
                    border: 1px solid ' + borderColor + '; z-index: ' + zIndex + '}' + ' ' + '#id' + classid + '{}\n'+
                    '#id' + str(classid) + ':hover{'
                    + 'border-width: 1px;border-style: dashed;'
                    + 'border-color: rgba(24, 166, 137, 1);}')

            else:
                pagehtml.write(
                    '<img drag-resize src="/' + icon_path + '" class="class' + classid + ' main" id="id' + classid + '"/>\n')
                pagehtml1.write(
                    '<img drag-resize src="/' + icon_path + '" class="class' + classid + ' main" id="id' + classid + 'pro"/>\n')
                pagehtml2.write(
                    '<img drag-resize src="/' + icon_path + '" class="class' + classid + ' main" id="id' + classid + 'work"/>\n')
                pagehtml3.write(
                    '<img drag-resize src="/' + icon_path + '" class="class' + classid + ' main" id="id' + classid + 'suggestions"/>\n')
                pagecss.write(
                    '.class' + classid + '{height: auto; width: auto; max-height:' + height + '%; max-width:' + width + '%;position:absolute; \
                    left:' + positionL + '%; top:' + positionT + '%; border-radius: ' + borderRadius + 'px; \
                    border: 1px solid ' + borderColor + '; z-index: ' + zIndex + '}' + ' ' + '#id' + classid + '{}\n'+
                    '#id' + str(classid) + ':hover{'
                    + 'border-width: 1px;border-style: dashed;'
                    + 'border-color: rgba(24, 166, 137, 1);}')

        def create_new_image(icon_path, classid, width, height, positionL, positionT, borderColor, borderRadius, link,
                         zIndex, virtual):
            if link != '':
                pagehtml.write(
                    '<img drag-resize linkvalue= "' + link + '" src="/' + icon_path + '" class="class' + classid + ' ' + virtual + ' main" id="id' + classid + '"/>\n')
                pagehtml1.write(
                    '<img drag-resize linkvalue= "' + link + '" src="/' + icon_path + '" class="class' + classid + ' ' + virtual + ' main" id="id' + classid + 'pro"/>\n')
                pagehtml2.write(
                    '<img drag-resize linkvalue= "' + link + '" src="/' + icon_path + '" class="class' + classid + ' ' + virtual + ' main" id="id' + classid + 'work"/>\n')
                pagehtml3.write(
                    '<img drag-resize linkvalue= "' + link + '" src="/' + icon_path + '" class="class' + classid + ' ' + virtual + ' main" id="id' + classid + 'suggestions"/>\n')
                pagecss.write(
                    '.class' + classid + '{height: auto; width: auto; max-height:' + height + '%; max-width:' + width + '%;position:absolute; \
                    left:' + positionL + '%; top:' + positionT + '%; border-radius: ' + borderRadius + 'px; \
                    border: 1px solid ' + borderColor + '; z-index: ' + zIndex + '}' + ' ' + '#id' + classid + '{}\n')

            else:
                pagehtml.write(
                    '<img drag-resize src="/' + icon_path + '" class="class' + classid + ' ' + virtual + ' main" id="id' + classid + '"/>\n')
                pagehtml1.write(
                    '<img drag-resize src="/' + icon_path + '" class="class' + classid + ' ' + virtual + ' main" id="id' + classid + 'pro"/>\n')
                pagehtml2.write(
                    '<img drag-resize src="/' + icon_path + '" class="class' + classid + ' ' + virtual + ' main" id="id' + classid + 'work"/>\n')
                pagehtml3.write(
                    '<img drag-resize src="/' + icon_path + '" class="class' + classid + ' ' + virtual + ' main" id="id' + classid + 'suggestions"/>\n')
                pagecss.write(
                    '.class' + classid + '{height: auto; width: auto; max-height:' + height + '%; max-width:' + width + '%;position:absolute; \
                    left:' + positionL + '%; top:' + positionT + '%; border-radius: ' + borderRadius + 'px; \
                    border: 1px solid ' + borderColor + '; z-index: ' + zIndex + '}' + ' ' + '#id' + classid + '{}\n')

        def create_icon(icon_path, classid, width, height, positionL, positionT, borderColor, borderRadius, link,
                         zIndex):
            if link != '':
                pagehtml.write(
                    '<img drag-resize linkvalue= "' + link + '" src="/' + icon_path + '" class="class' + classid + ' main recon-icon" id="id' + classid + '"/>\n')
                pagehtml1.write(
                    '<img drag-resize linkvalue= "' + link + '" src="/' + icon_path + '" class="class' + classid + ' main recon-icon" id="id' + classid + 'pro"/>\n')
                pagehtml2.write(
                    '<img drag-resize linkvalue= "' + link + '" src="/' + icon_path + '" class="class' + classid + ' main recon-icon" id="id' + classid + 'work"/>\n')
                pagehtml3.write(
                    '<img drag-resize linkvalue= "' + link + '" src="/' + icon_path + '" class="class' + classid + ' main recon-icon" id="id' + classid + 'suggestions"/>\n')
                pagecss.write(
                    '.class' + classid + '{height: auto; width: auto; max-height:' + height + '%; max-width:' + width + '%;position:absolute; \
                    left:' + positionL + '%; top:' + positionT + '%; border-radius: ' + borderRadius + 'px; \
                    border: 1px solid ' + borderColor + '; z-index: ' + zIndex + '}' + ' ' + '#id' + classid + '{}\n'+
                    '#id' + str(classid) + ':hover{'
                    + 'border-width: 1px;border-style: dashed;'
                    + 'border-color: rgba(24, 166, 137, 1);}')

            else:
                pagehtml.write(
                    '<img drag-resize src="/' + icon_path + '" class="class' + classid + ' main recon-icon" id="id' + classid + '"/>\n')
                pagehtml1.write(
                    '<img drag-resize src="/' + icon_path + '" class="class' + classid + ' main recon-icon" id="id' + classid + 'pro"/>\n')
                pagehtml2.write(
                    '<img drag-resize src="/' + icon_path + '" class="class' + classid + ' main recon-icon" id="id' + classid + 'work"/>\n')
                pagehtml3.write(
                    '<img drag-resize src="/' + icon_path + '" class="class' + classid + ' main recon-icon" id="id' + classid + 'suggestions"/>\n')
                pagecss.write(
                    '.class' + classid + '{height: auto; width: auto; max-height:' + height + '%; max-width:' + width + '%;position:absolute; \
                    left:' + positionL + '%; top:' + positionT + '%; border-radius: ' + borderRadius + 'px; \
                    border: 1px solid ' + borderColor + '; z-index: ' + zIndex + '}' + ' ' + '#id' + classid + '{}\n'+
                    '#id' + str(classid) + ':hover{'
                    + 'border-width: 1px;border-style: dashed;'
                    + 'border-color: rgba(24, 166, 137, 1);}')

        def create_image_active(location, icon_path, classid, width, height, positionL, positionT):
            pagehtml.write(
                '<img src="' + icon_path + '" onClick="' + location + '" class="draggable resize-drag class' + classid + '" id="id' + classid + '"/>\n')
            pagehtml1.write(
                '<img src="' + icon_path + '" onClick="' + location + '" class="draggable resize-drag class' + classid + '" id="id' + classid + 'pro"/>\n')
            pagehtml2.write(
                '<img src="' + icon_path + '" onClick="' + location + '" class="draggable resize-drag class' + classid + '" id="id' + classid + 'work"/>\n')
            pagehtml3.write(
                '<img src="' + icon_path + '" onClick="' + location + '" class="draggable resize-drag class' + classid + '" id="id' + classid + 'suggestions"/>\n')
            pagecss.write(
                '.class' + classid + '{height:' + height + '%; width:' + width + '%;position:absolute; left:' + positionL + '%; top:' + positionT + '%}' + ' ' + '#id' + classid + '{}\n')

            # CREATION OF PARAGRAPH AND TITLE

        def create_paragraph(classid, text_string, positionL, positionT, fontSize, fontColor, width, textAlign, height,
                             fontFamily, link, zIndex, textIndent):

            if link != '':

                pagehtml.write(
                    '<p drag-resize linkvalue= "' + link + '" class="class' + classid + ' main" id="id' + classid + '">' + text_string + '</p>\n')
                pagehtml1.write(
                    '<p drag-resize linkvalue= "' + link + '" class="class' + classid + ' main" id="id' + classid + 'pro">' + text_string + '</p>\n')
                pagehtml2.write(
                    '<p drag-resize linkvalue= "' + link + '" class="class' + classid + ' main" id="id' + classid +
                    'work" style="font-size: '+str(float(fontSize)/float(5))+'vw;">' + text_string + '</p>\n')
                pagehtml3.write(
                    '<p drag-resize linkvalue= "' + link + '" class="class' + classid + ' main" id="id' + classid + 'suggestions">' + text_string + '</p>\n')
                pagecss.write(
                    '.class' + classid + '{position:absolute; text-align: ' + textAlign + '; left:' + positionL + '%; top:' + positionT + '%;\
                              width:' + width + '%; height: ' + height + '%; margin : 0px; font-size: ' + fontSize + 'vw; \
                              color: ' + fontColor + '; font-family: ' + fontFamily + '; z-index: ' + zIndex + '}' + ' ' + '#id' + classid + '{}\n')
            else:
                pagehtml.write(
                    '<p drag-resize class="class' + classid + ' main" id="id' + classid + '">' + text_string + '</p>\n')
                pagehtml1.write(
                    '<p drag-resize class="class' + classid + ' main" id="id' + classid + 'pro">' + text_string + '</p>\n')
                pagehtml2.write(
                    '<p drag-resize class="class' + classid + ' main" id="id' + classid +
                    'work" style="font-size: '+str(float(fontSize)/float(5))+'vw;">' + text_string + '</p>\n')
                pagehtml3.write(
                    '<p drag-resize class="class' + classid + ' main" id="id' + classid + 'suggestions">' + text_string + '</p>\n')
                pagecss.write(
                    '.class' + classid + '{position:absolute; text-align: ' + textAlign + '; left:' + positionL + '%; top:' + positionT + '%;\
                                         width:' + width + '%; height: ' + height + '%; margin : 0px; font-size: ' + fontSize + 'vw; \
                                         color: ' + fontColor + '; font-family: ' + fontFamily + '; z-index: ' + zIndex + '}' + ' ' + '#id' + classid + '{}\n')

        def create_new_paragraph(classid, text_string, positionL, positionT, fontSize, fontColor, width, textAlign, height,
                             fontFamily, link, zIndex, virtual):

            if link != '':

                pagehtml.write(
                    '<p drag-resize linkvalue= "' + link + '" class="class' + classid + ' ' + virtual + ' main" id="id' + classid + '">' + text_string + '</p>\n')
                pagehtml1.write(
                    '<p drag-resize linkvalue= "' + link + '" class="class' + classid + ' ' + virtual + ' main" id="id' + classid + 'pro">' + text_string + '</p>\n')
                pagehtml2.write(
                    '<p drag-resize linkvalue= "' + link + '" class="class' + classid + ' ' + virtual + ' main" id="id' + classid +
                    'work" style="font-size: '+str(float(fontSize)/float(5))+'vw;">' + text_string + '</p>\n')
                pagehtml3.write(
                    '<p drag-resize linkvalue= "' + link + '" class="class' + classid + ' ' + virtual + ' main" id="id' + classid + 'suggestions">' + text_string + '</p>\n')
                pagecss.write(
                    '.class' + classid + '{position:absolute; text-align: ' + textAlign + '; left:' + positionL + '%; top:' + positionT + '%;\
                              width:' + width + '%; height: ' + height + '%; margin : 0px; font-size: ' + fontSize + 'vw; \
                              color: ' + fontColor + '; font-family: ' + fontFamily + '; z-index: ' + zIndex + '}' + ' ' + '#id' + classid + '{}\n')
            else:
                pagehtml.write(
                    '<p drag-resize class="class' + classid + ' ' + virtual + ' main" id="id' + classid + '">' + text_string + '</p>\n')
                pagehtml1.write(
                    '<p drag-resize class="class' + classid + ' ' + virtual + ' main" id="id' + classid + 'pro">' + text_string + '</p>\n')
                pagehtml2.write(
                    '<p drag-resize class="class' + classid + ' ' + virtual + ' main" id="id' + classid +
                    'work" style="font-size: '+str(float(fontSize)/float(5))+'vw;">' + text_string + '</p>\n')
                pagehtml3.write(
                    '<p drag-resize class="class' + classid + ' ' + virtual + ' main" id="id' + classid + 'suggestions">' + text_string + '</p>\n')
                pagecss.write(
                    '.class' + classid + '{position:absolute; text-align: ' + textAlign + '; left:' + positionL + '%; top:' + positionT + '%;\
                                         width:' + width + '%; height: ' + height + '%; margin : 0px; font-size: ' + fontSize + 'vw; \
                                         color: ' + fontColor + '; font-family: ' + fontFamily + '; z-index: ' + zIndex + '}' + ' ' + '#id' + classid + '{}\n')

        def create_paragraph_load(classid, text_string, positionL, positionT, fontSize, fontColor, width, textAlign,
                             height, fontFamily, link, zIndex, textIndent):

            if link != '':

                pagehtml.write(
                    '<p drag-resize linkvalue= "' + link + '" class="class' + classid + ' main" id="id' + classid + '">' + text_string + '</p>\n')
                pagehtml1.write(
                    '<p drag-resize linkvalue= "' + link + '" class="class' + classid + ' main" id="id' + classid + 'pro">' + text_string + '</p>\n')
                pagehtml2.write(
                    '<p drag-resize linkvalue= "' + link + '" class="class' + classid + ' main" id="id' + classid +
                    'work" style="font-size: ' + str(float(fontSize)/float(5))+ 'px;">' + text_string + '</p>\n')
                pagehtml3.write(
                    '<p drag-resize linkvalue= "' + link + '" class="class' + classid + ' main" id="id' + classid + 'suggestions">' + text_string + '</p>\n')
                pagecss.write(
                    '.class' + classid + '{position:absolute; text-align: ' + textAlign + '; left:' + positionL + '%; top:' + positionT + '%;\
                              width:' + width + '%; height: ' + str(float(height)+float(1)) + '%; margin : 0px; font-size: ' + fontSize + 'px; \
                              color: ' + fontColor +'; text-indent:'+textIndent+ '; font-family: ' + fontFamily + '; z-index: ' + zIndex + '}' + ' ' + '#id' + classid + '{}\n'+
                    '#id' + str(classid) + ':hover{'
                    + 'border-width: 1px;border-style: dashed;'
                    + 'border-color: rgba(24, 166, 137, 1);}')
            else:
                pagehtml.write(
                    '<p drag-resize class="class' + classid + ' main" id="id' + classid + '">' + text_string + '</p>\n')
                pagehtml1.write(
                    '<p drag-resize class="class' + classid + ' main" id="id' + classid + 'pro">' + text_string + '</p>\n')
                pagehtml2.write(
                    '<p drag-resize class="class' + classid + ' main" id="id' + classid +
                    'work" style="font-size: ' + str(float(fontSize)/float(5))+ 'px;">' + text_string + '</p>\n')
                pagehtml3.write(
                    '<p drag-resize class="class' + classid + ' main" id="id' + classid + 'suggestions">' + text_string + '</p>\n')
                pagecss.write(
                    '.class' + classid + '{position:absolute; text-align: ' + textAlign + '; text-indent:'+textIndent+
                    '; left:' + positionL + '%; top:' + positionT + '%; width:' + width + '%; height: ' + str(float(height)+float(1)) +
                    '%; margin : 0px; font-size: ' + fontSize + 'px; color: ' + fontColor + '; font-family: ' + fontFamily +
                    '; z-index: ' + zIndex + '}' + ' ' + '#id' + classid + '{}\n' +
                    '#id' + str(classid) + ':hover{'
                    + 'border-width: 1px;border-style: dashed;'
                    + 'border-color: rgba(24, 166, 137, 1);}')

        def create_hyperLink_load(classid, text_string, positionL, positionT, fontSize, fontColor, width, textAlign,
                                  fontFamily, link, zIndex):
            if link != '':

                # pagehtml.write('<a drag-resize href='+link+' class=" class' + classid + '" id="id' + classid + '">\n\
                pagehtml.write(
                    '<a drag-resize linkvalue= "' + link + '" class=" class' + classid + '" id="id' + classid + '">\n\
                ' + text_string + '</a>\n')
                pagehtml1.write(
                    '<a drag-resize linkvalue= "' + link + '" class=" class' + classid + '" id="id' + classid + 'pro">\n\
                                ' + text_string + '</a>\n')
                pagehtml2.write(
                    '<a drag-resize linkvalue= "' + link + '" class=" class' + classid + '" id="id' + classid +
                    'work" style="font-size: ' + str(float(fontSize) / float(5)) + 'px;">\n\
                                                ' + text_string + '</a>\n')
                pagehtml3.write(
                    '<a drag-resize linkvalue= "' + link + '" class=" class' + classid + '" id="id' + classid + 'suggestions">\n\
                                                ' + text_string + '</a>\n')
                pagecss.write(
                    '.class' + str(
                        classid) + '{position:absolute; text-align: ' + textAlign + '; left:' + positionL + '%; width:' + width + '%; top:' + positionT + '%;\
                             margin: 0px; font-size: ' + fontSize + 'px;color: ' + fontColor + '; \
                             font-family: ' + fontFamily + '; z-index: ' + zIndex + ';}' + ' ' + '#id' + str(
                        classid) + '{}\n\
                            .class' + str(classid) + ':hover {color: ' + fontColor + '}')
            else:
                pagehtml.write('<a drag-resize class=" class' + classid + '" id="id' + classid + '">\n\
                                ' + text_string + '</a>\n')
                pagehtml1.write('<a drag-resize class=" class' + classid + '" id="id' + classid + 'pro">\n\
                                                ' + text_string + '</a>\n')
                pagehtml2.write('<a drag-resize class=" class' + classid + '" id="id' + classid +
                                'work" style="font-size: ' + str(float(fontSize) / float(5)) + 'px;">\n\
                                                                ' + text_string + '</a>\n')
                pagehtml3.write('<a drag-resize class=" class' + classid + '" id="id' + classid + 'suggestions">\n\
                                                                ' + text_string + '</a>\n')
                pagecss.write(
                    '.class' + str(
                        classid) + '{position:absolute; text-align: ' + textAlign + '; left:' + positionL + '%; width:' + width + '%; top:' + positionT + '%;\
                                             margin: 0px; font-size: ' + fontSize + 'px;color: ' + fontColor + '; \
                                             font-family: ' + fontFamily + '; z-index: ' + zIndex + '}' + ' ' + '#id' + str(
                        classid) + '{} \n\
                                            .class' + str(classid) + ':hover {color:white }')

        def create_hyperLink(classid, text_string, positionL, positionT, fontSize, fontColor, width, textAlign,
                                 fontFamily, link, zIndex):
            if link != '':

                # pagehtml.write('<a drag-resize href='+link+' class=" class' + classid + '" id="id' + classid + '">\n\
                pagehtml.write(
                    '<a drag-resize linkvalue= "' + link + '" class=" class' + classid + '" id="id' + classid + '">\n\
                ' + text_string + '</a>\n')
                pagehtml1.write(
                    '<a drag-resize linkvalue= "' + link + '" class=" class' + classid + '" id="id' + classid + 'pro">\n\
                                ' + text_string + '</a>\n')
                pagehtml2.write(
                    '<a drag-resize linkvalue= "' + link + '" class=" class' + classid + '" id="id' + classid +
                    'work" style="font-size: ' + str(float(fontSize) / float(5)) + 'vw;">\n\
                                                ' + text_string + '</a>\n')
                pagehtml3.write(
                    '<a drag-resize linkvalue= "' + link + '" class=" class' + classid + '" id="id' + classid + 'suggestions">\n\
                                                ' + text_string + '</a>\n')
                pagecss.write(
                    '.class' + str(
                        classid) + '{position:absolute; text-align: ' + textAlign + '; left:' + positionL + '%; width:' + width + '%; top:' + positionT + '%;\
                             margin: 0px; font-size: ' + fontSize + 'vw;color: ' + fontColor + '; \
                             font-family: ' + fontFamily + '; z-index: ' + zIndex + ';}' + ' ' + '#id' + str(
                        classid) + '{}\n\
                            .class' + str(classid) + ':hover {color: ' + fontColor + '}')
            else:
                pagehtml.write('<a drag-resize class=" class' + classid + '" id="id' + classid + '">\n\
                                ' + text_string + '</a>\n')
                pagehtml1.write('<a drag-resize class=" class' + classid + '" id="id' + classid + 'pro">\n\
                                                ' + text_string + '</a>\n')
                pagehtml2.write('<a drag-resize class=" class' + classid + '" id="id' + classid +
                                'work" style="font-size: ' + str(float(fontSize) / float(5)) + 'vw;">\n\
                                                                ' + text_string + '</a>\n')
                pagehtml3.write('<a drag-resize class=" class' + classid + '" id="id' + classid + 'suggestions">\n\
                                                                ' + text_string + '</a>\n')
                pagecss.write(
                    '.class' + str(
                        classid) + '{position:absolute; text-align: ' + textAlign + '; left:' + positionL + '%; width:' + width + '%; top:' + positionT + '%;\
                                             margin: 0px; font-size: ' + fontSize + 'vw;color: ' + fontColor + '; \
                                             font-family: ' + fontFamily + '; z-index: ' + zIndex + '}' + ' ' + '#id' + str(
                        classid) + '{} \n\
                                            .class' + str(classid) + ':hover {color:white }')

        def create_new_hyperLink(classid, text_string, positionL, positionT, fontSize, fontColor, width, textAlign,
                                 fontFamily, link, zIndex, virtual):
            if link != '':

                pagehtml.write(
                    '<a drag-resize linkvalue= "' + link + '" class=" class' + classid + ' ' + virtual + '" id="id' + classid + '">\n\
                ' + text_string + '</a>\n')
                pagehtml1.write(
                    '<a drag-resize linkvalue= "' + link + '" class=" class' + classid + ' ' + virtual + '" id="id' + classid + 'pro">\n\
                                ' + text_string + '</a>\n')
                pagehtml2.write(
                    '<a drag-resize linkvalue= "' + link + '" class=" class' + classid + ' ' + virtual + '" id="id' + classid +
                    'work" style="font-size: ' + str(float(fontSize) / float(5)) + 'vw;">\n\
                                                ' + text_string + '</a>\n')
                pagehtml3.write(
                    '<a drag-resize linkvalue= "' + link + '" class=" class' + classid + ' ' + virtual + '" id="id' + classid + 'suggestions">\n\
                                                ' + text_string + '</a>\n')
                pagecss.write(
                    '.class' + str(
                        classid) + '{position:absolute; text-align: ' + textAlign + '; left:' + positionL + '%; width:' + width + '%; top:' + positionT + '%;\
                             margin: 0px; font-size: ' + fontSize + 'vw;color: ' + fontColor + '; \
                             font-family: ' + fontFamily + '; z-index: ' + zIndex + ';}' + ' ' + '#id' + str(
                        classid) + '{}\n\
                            .class' + str(classid) + ':hover {color: ' + fontColor + '}')
            else:
                pagehtml.write('<a drag-resize class=" class' + classid + ' ' + virtual + '" id="id' + classid + '">\n\
                                ' + text_string + '</a>\n')
                pagehtml1.write('<a drag-resize class=" class' + classid + ' ' + virtual + '" id="id' + classid + 'pro">\n\
                                                ' + text_string + '</a>\n')
                pagehtml2.write('<a drag-resize class=" class' + classid + ' ' + virtual + '" id="id' + classid +
                                'work" style="font-size: ' + str(float(fontSize) / float(5)) + 'vw;">\n\
                                                                ' + text_string + '</a>\n')
                pagehtml3.write('<a drag-resize class=" class' + classid + ' ' + virtual + '" id="id' + classid + 'suggestions">\n\
                                                                ' + text_string + '</a>\n')
                pagecss.write(
                    '.class' + str(
                        classid) + '{position:absolute; text-align: ' + textAlign + '; left:' + positionL + '%; width:' + width + '%; top:' + positionT + '%;\
                                             margin: 0px; font-size: ' + fontSize + 'vw;color: ' + fontColor + '; \
                                             font-family: ' + fontFamily + '; z-index: ' + zIndex + '}' + ' ' + '#id' + str(
                        classid) + '{} \n\
                                            .class' + str(classid) + ':hover {color:white }')

        def create_div(classid, width, height, positionL, positionT, borderRadius, borderColor, bgcolor,
                       zIndex):
            pagehtml.write('<div drag-resize class="class' + classid + '" id="id' + classid + '"></div>\n')
            pagehtml1.write('<div drag-resize class="class' + classid + '" id="id' + classid + 'pro"></div>\n')
            pagehtml2.write('<div drag-resize class="class' + classid + '" id="id' + classid + 'work"></div>\n')
            pagehtml3.write(
                '<div drag-resize class="class' + classid + '" id="id' + classid + 'suggestions"></div>\n')
            pagecss.write('.class' + classid + '{position: absolute; left: ' + positionL + '%;\
                    top: ' + positionT + '%; width: ' + width + '%; height: ' + height + '%; \
                    background-color:' + bgcolor + '; border: 1px solid ' + borderColor + '; \
                    border-radius: ' + borderRadius + 'px; z-index: ' + zIndex + ';}' + ' ' + '#id' + classid + '{}\n'+
                    '#id' + str(classid) + ':hover{'
                    + 'border-width: 1px;border-style: dashed;'
                    + 'border-color: rgba(24, 166, 137, 1);}')

        def create_new_div(classid, width, height, positionL, positionT, borderRadius, borderColor, bgcolor,
                       zIndex, virtual):
            pagehtml.write(
                '<div drag-resize class="class' + classid + ' ' + virtual + '" id="id' + classid + '"></div>\n')
            pagehtml1.write(
                '<div drag-resize class="class' + classid + ' ' + virtual + '" id="id' + classid + 'pro"></div>\n')
            pagehtml2.write(
                '<div drag-resize class="class' + classid + ' ' + virtual + '" id="id' + classid + 'work"></div>\n')
            pagehtml3.write(
                '<div drag-resize class="class' + classid + '" id="id' + classid + 'suggestions"></div>\n')
            pagecss.write('.class' + classid + '{position: absolute; left: ' + positionL + '%;\
                       top: ' + positionT + '%; width: ' + width + '%; height: ' + height + '%; \
                       background-color:' + bgcolor + '; border: 1px solid ' + borderColor + '; \
                       border-radius: ' + borderRadius + 'px; z-index: ' + zIndex + ';}' + ' ' + '#id' + classid + '{}\n')

        # New CREATION OF WIDGETS

        # def create_googleMap(icon_path, classid, width, height, positionL, positionT, link):
        #     print("inside create google map")
        #     pagehtml.write(
        #         '<link href="resizable_chart.css" rel="stylesheet">\n\
        #         <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">\n\
        #         <script src="https://d3js.org/d3.v4.min.js"></script>\n\
        #         <div id="id' + classid +'" class="class' + classid + ' main">\n\
        #                    <button id="cancel_edit" onmousedown="cancel_editDelayed()"><i class="fa fa-times"></i></button>\n\
        #                    <button id="unlock" onmousedown="unlockDelayed()"><i class="fa fa-unlock"></i></button>\n\
        #                    <div id="title">\n\
        #                        <div id= "icon-bar" class="icon-bar">\n\
        #                            <button id="delete" onmousedown="del()"><i class="fa fa-trash"></i></button>\n\
        #                            <button id="lock" onmousedown="lock()"><i class="fa fa-lock"></i></button>\n\
        #                            <button id="edit" class="maps" onmousedown="edit()"><i class="fa fa-pencil"></i></button>\n\
        #                        </div>\n\
        #                    </div>\n\
        #                    <div id="selected" style="height: 100%;width: 100%;">\n\
        #                        <div id="temp_inner"></div>\n\
        #                    </div>\n\
        #                </div>\n\
        #                <script>\n\
        #                var minWidth = 60;\n\
        #                var minHeight = 40;\n\
        #                var MARGINS = 4;\n\
        #                var clicked = null;\n\
        #                var onRightEdge, onBottomEdge, onLeftEdge, onTopEdge;\n\
        #                var rightScreenEdge, bottomScreenEdge;\n\
        #                var b, x, y;\n\
        #                var redraw = false;\n\
        #                var pane = document.getElementById("id' + classid + '");\n\
        #            pane.addEventListener("mousedown", onMouseDown);\n\
        #            document.addEventListener("mousemove", onMove);\n\
        #            document.addEventListener("mouseup", onUp);\n\
        #            function onMouseDown(e) {\n\
        #                onDown(e);\n\
        #                e.preventDefault();\n\
        #            }\n\
        #            function onDown(e) {\n\
        #                calc(e);\n\
        #                var isResizing = onRightEdge || onBottomEdge || onTopEdge || onLeftEdge;\n\
        #                clicked = {\n\
        #                    x: x,\n\
        #                    y: y,\n\
        #                    cx: e.clientX,\n\
        #                    cy: e.clientY,\n\
        #                    w: b.width,\n\
        #                    h: b.height,\n\
        #                    isResizing: isResizing,\n\
        #                    isMoving: !isResizing && canMove(),\n\
        #                    onTopEdge: onTopEdge,\n\
        #                    onLeftEdge: onLeftEdge,\n\
        #                    onRightEdge: onRightEdge,\n\
        #                    onBottomEdge: onBottomEdge\n\
        #                };\n\
        #            }\n\
        #            function canMove() {\n\
        #                return x > 0 && x < b.width && y > 0 && y < b.height;\n\
        #            }\n\
        #            function calc(e) {\n\
        #                b = pane.getBoundingClientRect();\n\
        #                x = e.clientX - b.left;\n\
        #                y = e.clientY - b.top;\n\
        #                onTopEdge = y < MARGINS;\n\
        #                onLeftEdge = x < MARGINS;\n\
        #                onRightEdge = x >= b.width - MARGINS;\n\
        #                onBottomEdge = y >= b.height - MARGINS;\n\
        #                rightScreenEdge = window.innerWidth - MARGINS;\n\
        #                bottomScreenEdge = window.innerHeight - MARGINS;\n\
        #            }\n\
        #            var e;\n\
        #            function onMove(ee) {\n\
        #                animate();\n\
        #                calc(ee);\n\
        #                e = ee;\n\
        #                redraw = true;\n\
        #            }\n\
        #            function animate() {\n\
        #                var screen = document.getElementById("container-inside-frame").getBoundingClientRect();\n\
        #                requestAnimationFrame(animate);\n\
        #                if (!redraw) return;\n\
        #                redraw = false;\n\
        #                if (clicked && clicked.isResizing) {\n\
        #                    if (clicked.onRightEdge) pane.style.width = Math.max(x, minWidth) + "px";\n\
        #                    if (clicked.onBottomEdge) pane.style.height = Math.max(y, minHeight) + "px";\n\
        #                    if (clicked.onLeftEdge) {\n\
        #                        var currentWidth = Math.max(clicked.cx - e.clientX  + clicked.w, minWidth);\n\
        #                        if (currentWidth > minWidth) {\n\
        #                            pane.style.width = currentWidth + "px";\n\
        #                            pane.style.left = e.clientX - screen.left + "px";\n\
        #                        }\n\
        #                    }\n\
        #                    if (clicked.onTopEdge) {\n\
        #                        var currentHeight = Math.max(clicked.cy - e.clientY  + clicked.h, minHeight);\n\
        #                        if (currentHeight > minHeight) {\n\
        #                            pane.style.height = currentHeight + "px";\n\
        #                            pane.style.top = e.clientY - screen.top + "px";\n\
        #                            console.log("Clicked Top Edge");\n\
        #                        }\n\
        #                    }\n\
        #                    return;\n\
        #                }\n\
        #                if (clicked && clicked.isMoving) {\n\
        #                    pane.style.top = (e.clientY - screen.top - clicked.y) + "px";\n\
        #                    pane.style.left = (e.clientX - screen.left - clicked.x) + "px";\n\
        #                     var top = pane.style.top\n\
        #                     var left = pane.style.left\n\
        #                     var height = pane.style.height\n\
        #                     var width = pane.style.width\n\
        #                     widMove(top,left,height,width);\n\
        #                    return;\n\
        #                }\n\
        #                if (onRightEdge && onBottomEdge || onLeftEdge && onTopEdge) {\n\
        #                    pane.style.cursor = "nwse-resize";\n\
        #                } else if (onRightEdge && onTopEdge || onBottomEdge && onLeftEdge) {\n\
        #                    pane.style.cursor = "nesw-resize";\n\
        #                } else if (onRightEdge || onLeftEdge) {\n\
        #                    pane.style.cursor = "ew-resize";\n\
        #                } else if (onBottomEdge || onTopEdge) {\n\
        #                    pane.style.cursor = "ns-resize";\n\
        #                } else if (canMove()) {\n\
        #                    pane.style.cursor = "move";\n\
        #                } else {\n\
        #                    pane.style.cursor = "default";\n\
        #                }\n\
        #            }\n\
        #            animate();\n\
        #            function onUp(e) {\n\
        #                calc(e);\n\
        #                clicked = null;\n\
        #                console.log("Location");\n\
        #                console.log(pane.style.top);\n\
        #                console.log(pane.style.left);\n\
        #                console.log(pane.style.height);\n\
        #                console.log(pane.style.width);\n\
        #            }\n\
        #            function myMap() {\n\
        #                var mapOptions = {\n\
        #                    center: new google.maps.LatLng(51.5, -0.12),\n\
        #                    zoom: 10,\n\
        #                    mapTypeId: google.maps.MapTypeId.HYBRID\n\
        #                }\n\
        #                var map = new google.maps.Map(document.getElementById("temp_inner"),mapOptions);\n\
        #            }\n\
        #            var backup_pane;\n\
        #            var element = document.getElementById("edit");\n\
        #            function edit(){\n\
        #                pane.removeEventListener("mousedown", onMouseDown);\n\
        #                document.removeEventListener("mousemove", onMove);\n\
        #                document.removeEventListener("mouseup", onUp);\n\
        #                document.getElementById("title").style.visibility = "hidden";\n\
        #                document.getElementById("cancel_edit").style.visibility = "visible";\n\
        #                document.getElementById("selected").style.borderWidth = "1px";\n\
        #                document.getElementById("selected").style.borderStyle = "dashed";\n\
        #                document.getElementById("selected").style.borderRadius = "6px";\n\
        #                document.getElementById("icon-bar").style.visibility = "hidden";\n\
        #                sending();\n\
        #            }\n\
        #            var cancel_edit_delayed;\n\
        #            function cancel_editDelayed() {\n\
        #                cancel_edit_delayed = setTimeout(cancel_edit, 100);\n\
        #            }\n\
        #            function cancel_edit(){\n\
        #                pane.addEventListener("mousedown", onMouseDown);\n\
        #                document.addEventListener("mousemove", onMove);\n\
        #                document.addEventListener("mouseup", onUp);\n\
        #                document.getElementById("title").style.visibility = "visible";\n\
        #                document.getElementById("cancel_edit").style.visibility = "hidden";\n\
        #                document.getElementById("selected").style.borderWidth = "0px";\n\
        #                document.getElementById("icon-bar").style.visibility = defaultStatus;\n\
        #            }\n\
        #            var unlock_delayed;\n\
        #            function unlockDelayed() {\n\
        #                unlock_delayed = setTimeout(unlock, 100);\n\
        #            }\n\
        #            function lock(){\n\
        #                pane.removeEventListener("mousedown", onMouseDown);\n\
        #                document.removeEventListener("mousemove", onMove);\n\
        #                document.removeEventListener("mouseup", onUp);\n\
        #                document.getElementById("title").style.backgroundColor = "transparent";\n\
        #                document.getElementById("unlock").style.visibility = "visible";\n\
        #                document.getElementById("icon-bar").style.visibility = "hidden";\n\
        #            }\n\
        #            function unlock(){\n\
        #                pane.addEventListener("mousedown", onMouseDown);\n\
        #                document.addEventListener("mousemove", onMove);\n\
        #                document.addEventListener("mouseup", onUp);\n\
        #                document.getElementById("title").style.backgroundColor = defaultStatus;\n\
        #                document.getElementById("title").style.borderStyle = defaultStatus;\n\
        #                document.getElementById("icon-bar").style.visibility = defaultStatus;\n\
        #                document.getElementById("unlock").style.visibility = "hidden";\n\
        #            }\n\
        #            function sending() {\n\
        #                $.ajax({\n\
        #                     type: "GET",\n\
        #                     url: "index",\n\
        #                     name: "getPredictions",\n\
        #                     data: {"name": "getPredictions",\n\
        #                     "id": "id'+ classid+'",\n\
        #                     }\n\
        #                });\n\
        #            }\n\
        #            function widMove(t,l,h,w) {\n\
        #                 $.ajax({\n\
        #                      type: "GET",\n\
        #                      url: "index",\n\
        #                      name: "widgetMove",\n\
        #                      data: {"name": "widgetMove",\n\
        #                      "id": "id' + classid + '",\n\
        #                      "widget":"widgets",\n\
        #                      "top": t,\n\
        #                      "left": l,\n\
        #                      "height": h,\n\
        #                      "width": w,\n\
        #                      }\n\
        #                 });\n\
        #             }\n\
        #            </script>\n\
        #            <script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyB6d8kHSyB_BemEfCxrc45nvq62zseaGYQ&callback=myMap"> </script>')
        #     pagehtml1.write(
        #         '<link href="resizable_chart.css" rel="stylesheet">\n\
        #         <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">\n\
        #         <script src="https://d3js.org/d3.v4.min.js"></script>\n\
        #         <div id="id' + classid + 'pro" class="class' + classid + ' main">\n\
        #                                <button id="cancel_edit" onmousedown="cancel_editDelayed()"><i class="fa fa-times"></i></button>\n\
        #                                <button id="unlock" onmousedown="unlockDelayed()"><i class="fa fa-unlock"></i></button>\n\
        #                                <div id="title">\n\
        #                                    <div id= "icon-bar" class="icon-bar">\n\
        #                                        <button id="delete" onmousedown="del()"><i class="fa fa-trash"></i></button>\n\
        #                                        <button id="lock" onmousedown="lock()"><i class="fa fa-lock"></i></button>\n\
        #                                        <button id="edit" class="maps" onmousedown="edit()"><i class="fa fa-pencil"></i></button>\n\
        #                                    </div>\n\
        #                                </div>\n\
        #                                <div id="selected" style="height: 100%;width: 100%;">\n\
        #                                    <div id="temp_inner"></div>\n\
        #                                </div>\n\
        #                            </div>\n\
        #                            <script>\n\
        #                            var minWidth = 60;\n\
        #                            var minHeight = 40;\n\
        #                            var MARGINS = 4;\n\
        #                            var clicked = null;\n\
        #                            var onRightEdge, onBottomEdge, onLeftEdge, onTopEdge;\n\
        #                            var rightScreenEdge, bottomScreenEdge;\n\
        #                            var b, x, y;\n\
        #                            var redraw = false;\n\
        #                            var pane = document.getElementById("id' + classid + '");\n\
        #                        pane.addEventListener("mousedown", onMouseDown);\n\
        #                        document.addEventListener("mousemove", onMove);\n\
        #                        document.addEventListener("mouseup", onUp);\n\
        #                        function onMouseDown(e) {\n\
        #                            onDown(e);\n\
        #                            e.preventDefault();\n\
        #                        }\n\
        #                        function onDown(e) {\n\
        #                            calc(e);\n\
        #                            var isResizing = onRightEdge || onBottomEdge || onTopEdge || onLeftEdge;\n\
        #                            clicked = {\n\
        #                                x: x,\n\
        #                                y: y,\n\
        #                                cx: e.clientX,\n\
        #                                cy: e.clientY,\n\
        #                                w: b.width,\n\
        #                                h: b.height,\n\
        #                                isResizing: isResizing,\n\
        #                                isMoving: !isResizing && canMove(),\n\
        #                                onTopEdge: onTopEdge,\n\
        #                                onLeftEdge: onLeftEdge,\n\
        #                                onRightEdge: onRightEdge,\n\
        #                                onBottomEdge: onBottomEdge\n\
        #                            };\n\
        #                        }\n\
        #                        function canMove() {\n\
        #                            return x > 0 && x < b.width && y > 0 && y < b.height;\n\
        #                        }\n\
        #                        function calc(e) {\n\
        #                            b = pane.getBoundingClientRect();\n\
        #                            x = e.clientX - b.left;\n\
        #                            y = e.clientY - b.top;\n\
        #                            onTopEdge = y < MARGINS;\n\
        #                            onLeftEdge = x < MARGINS;\n\
        #                            onRightEdge = x >= b.width - MARGINS;\n\
        #                            onBottomEdge = y >= b.height - MARGINS;\n\
        #                            rightScreenEdge = window.innerWidth - MARGINS;\n\
        #                            bottomScreenEdge = window.innerHeight - MARGINS;\n\
        #                        }\n\
        #                        var e;\n\
        #                        function onMove(ee) {\n\
        #                            animate();\n\
        #                            calc(ee);\n\
        #                            e = ee;\n\
        #                            redraw = true;\n\
        #                        }\n\
        #                        function animate() {\n\
        #                            var screen = document.getElementById("container-inside-frame").getBoundingClientRect();\n\
        #                            requestAnimationFrame(animate);\n\
        #                            if (!redraw) return;\n\
        #                            redraw = false;\n\
        #                            if (clicked && clicked.isResizing) {\n\
        #                                if (clicked.onRightEdge) pane.style.width = Math.max(x, minWidth) + "px";\n\
        #                                if (clicked.onBottomEdge) pane.style.height = Math.max(y, minHeight) + "px";\n\
        #                                if (clicked.onLeftEdge) {\n\
        #                                    var currentWidth = Math.max(clicked.cx - e.clientX  + clicked.w, minWidth);\n\
        #                                    if (currentWidth > minWidth) {\n\
        #                                        pane.style.width = currentWidth + "px";\n\
        #                                        pane.style.left = e.clientX - screen.left + "px";\n\
        #                                    }\n\
        #                                }\n\
        #                                if (clicked.onTopEdge) {\n\
        #                                    var currentHeight = Math.max(clicked.cy - e.clientY  + clicked.h, minHeight);\n\
        #                                    if (currentHeight > minHeight) {\n\
        #                                        pane.style.height = currentHeight + "px";\n\
        #                                        pane.style.top = e.clientY - screen.top + "px";\n\
        #                                    }\n\
        #                                }\n\
        #                                return;\n\
        #                            }\n\
        #                            if (clicked && clicked.isMoving) {\n\
        #                                pane.style.top = (e.clientY - screen.top - clicked.y) + "px";\n\
        #                                pane.style.left = (e.clientX - screen.left - clicked.x) + "px";\n\
        #                                return;\n\
        #                            }\n\
        #                            if (onRightEdge && onBottomEdge || onLeftEdge && onTopEdge) {\n\
        #                                pane.style.cursor = "nwse-resize";\n\
        #                            } else if (onRightEdge && onTopEdge || onBottomEdge && onLeftEdge) {\n\
        #                                pane.style.cursor = "nesw-resize";\n\
        #                            } else if (onRightEdge || onLeftEdge) {\n\
        #                                pane.style.cursor = "ew-resize";\n\
        #                            } else if (onBottomEdge || onTopEdge) {\n\
        #                                pane.style.cursor = "ns-resize";\n\
        #                            } else if (canMove()) {\n\
        #                                pane.style.cursor = "move";\n\
        #                            } else {\n\
        #                                pane.style.cursor = "default";\n\
        #                            }\n\
        #                        }\n\
        #                        animate();\n\
        #                        function onUp(e) {\n\
        #                            calc(e);\n\
        #                            clicked = null;\n\
        #                            console.log("Location");\n\
        #                            console.log(pane.style.top);\n\
        #                            console.log(pane.style.left);\n\
        #                            console.log(pane.style.height);\n\
        #                            console.log(pane.style.width);\n\
        #                            var top = pane.style.top\n\
        #                            var left = pane.style.left\n\
        #                            var height = pane.style.height\n\
        #                            var width = pane.style.width\n\
        #                            widMove(top,left,height,width);\n\
        #                        }\n\
        #                        function myMap() {\n\
        #                            var mapOptions = {\n\
        #                                center: new google.maps.LatLng(51.5, -0.12),\n\
        #                                zoom: 10,\n\
        #                                mapTypeId: google.maps.MapTypeId.HYBRID\n\
        #                            }\n\
        #                            var map = new google.maps.Map(document.getElementById("temp_inner"),mapOptions);\n\
        #                        }\n\
        #                        var backup_pane;\n\
        #                        var element = document.getElementById("edit");\n\
        #                        function edit(){\n\
        #                            pane.removeEventListener("mousedown", onMouseDown);\n\
        #                            document.removeEventListener("mousemove", onMove);\n\
        #                            document.removeEventListener("mouseup", onUp);\n\
        #                            document.getElementById("title").style.visibility = "hidden";\n\
        #                            document.getElementById("cancel_edit").style.visibility = "visible";\n\
        #                            document.getElementById("selected").style.borderWidth = "1px";\n\
        #                            document.getElementById("selected").style.borderStyle = "dashed";\n\
        #                            document.getElementById("selected").style.borderRadius = "6px";\n\
        #                            document.getElementById("icon-bar").style.visibility = "hidden";\n\
        #                            sending()\n\
        #                        }\n\
        #                        var cancel_edit_delayed;\n\
        #                        function cancel_editDelayed() {\n\
        #                            cancel_edit_delayed = setTimeout(cancel_edit, 100);\n\
        #                        }\n\
        #                        function cancel_edit(){\n\
        #                            pane.addEventListener("mousedown", onMouseDown);\n\
        #                            document.addEventListener("mousemove", onMove);\n\
        #                            document.addEventListener("mouseup", onUp);\n\
        #                            document.getElementById("title").style.visibility = "visible";\n\
        #                            document.getElementById("cancel_edit").style.visibility = "hidden";\n\
        #                            document.getElementById("selected").style.borderWidth = "0px";\n\
        #                            document.getElementById("icon-bar").style.visibility = defaultStatus;\n\
        #                        }\n\
        #                        var unlock_delayed;\n\
        #                        function unlockDelayed() {\n\
        #                            unlock_delayed = setTimeout(unlock, 100);\n\
        #                        }\n\
        #                        function lock(){\n\
        #                            pane.removeEventListener("mousedown", onMouseDown);\n\
        #                            document.removeEventListener("mousemove", onMove);\n\
        #                            document.removeEventListener("mouseup", onUp);\n\
        #                            document.getElementById("title").style.backgroundColor = "transparent";\n\
        #                            document.getElementById("unlock").style.visibility = "visible";\n\
        #                            document.getElementById("icon-bar").style.visibility = "hidden";\n\
        #                        }\n\
        #                        function unlock(){\n\
        #                            pane.addEventListener("mousedown", onMouseDown);\n\
        #                            document.addEventListener("mousemove", onMove);\n\
        #                            document.addEventListener("mouseup", onUp);\n\
        #                            document.getElementById("title").style.backgroundColor = defaultStatus;\n\
        #                            document.getElementById("title").style.borderStyle = defaultStatus;\n\
        #                            document.getElementById("icon-bar").style.visibility = defaultStatus;\n\
        #                            document.getElementById("unlock").style.visibility = "hidden";\n\
        #                        }\n\
        #                        function sending() {\n\
        #                            $.ajax({\n\
        #                                 type: "GET",\n\
        #                                 url: "index",\n\
        #                                 name: "getPredictions",\n\
        #                                 data: {"name": "getPredictions",\n\
        #                                 "id": "id' + classid + '",\n\
        #                                 }\n\
        #                            });\n\
        #                        }\n\
        #                        function widMove(t,l,h,w) {\n\
        #                             $.ajax({\n\
        #                                  type: "GET",\n\
        #                                  url: "index",\n\
        #                                  name: "widgetMove",\n\
        #                                  data: {"name": "widgetMove",\n\
        #                                  "id": "id' + classid + '",\n\
        #                                  "widget":"widgets",\n\
        #                                  "top": t,\n\
        #                                  "left": l,\n\
        #                                  "height": h,\n\
        #                                  "width": w,\n\
        #                                  }\n\
        #                             });\n\
        #                         }\n\
        #                        </script>\n\
        #                        <script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyB6d8kHSyB_BemEfCxrc45nvq62zseaGYQ&callback=myMap"> </script>')
        #
        #     pagecss.write(
        #         '#id' + classid + '{'
        #         + 'position: absolute;'
        #         + 'height:' + height + '%;'
        #         + 'width:' + width + '%;'
        #         + 'left:' + positionL + '%;'
        #         + 'top:' + positionT + '%;'
        #         + 'margin: 0;'
        #         + 'padding: 0;'
        #         + 'background: transparent;'
        #         + 'z-index: 10;'
        #         + '}' +
        #
        #         '#id' + classid + 'pro{'
        #         + 'position: absolute;'
        #         + 'height:' + height + '%;'
        #         + 'width:' + width + '%;'
        #         + 'left:' + positionL + '%;'
        #         + 'top:' + positionT + '%;'
        #         + 'margin: 0;'
        #         + 'padding: 0;'
        #         + 'background: transparent;'
        #         + 'z-index: 10;'
        #         + '}' +
        #
        #         'body {'
        #         + 'overflow: auto;'
        #         + '}' +
        #
        #         '#title {'
        #         + 'position: absolute;'
        #         + 'font-family: monospace;'
        #         + 'font-size: 24px;'
        #         + 'text-align: center;'
        #         + 'height: 100%;'
        #         + 'width: 100%;'
        #         + 'position: absolute;'
        #         + 'visibility: visible;'
        #         + 'border-radius: 6px;'
        #         + 'z-index: 10;'
        #         + '}' +
        #
        #         '#cancel_edit {'
        #         + 'position:absolute;'
        #         + 'height: 30px;'
        #         + 'width: 30px;'
        #         + 'background-color: grey;'
        #         + 'right: -4px;'
        #         + 'top: -4px;'
        #         + 'visibility: hidden;'
        #         + 'z-index: 15;'
        #         + '}' +
        #
        #         '#unlock {'
        #         + 'position:absolute;'
        #         + 'height: 30px;'
        #         + 'width: 30px;'
        #         + 'background-color: grey;'
        #         + 'right: -4px;'
        #         + 'top: -4px;'
        #         + 'visibility: hidden;'
        #         + 'z-index: 15;'
        #         + '}' +
        #
        #         '#title:hover .icon-bar{'
        #         + 'visibility:visible;'
        #         + '}' +
        #
        #         '#title:hover{'
        #         + 'background-color: rgba(100, 100, 100, 0.3);'
        #         + 'border-width: 1px;'
        #         + 'border-style: dashed;'
        #         + 'border-color: black;'
        #         + '}' +
        #
        #         '.icon-bar button:hover{'
        #         + 'background-color:#000;'
        #         + '}' +
        #
        #         '.icon-bar{'
        #         + 'width: 50%;'
        #         + 'height: 34px;'
        #         + 'transform: translate(50%);'
        #         + 'background-color: #555;'
        #         + 'overflow: auto;'
        #         + 'visibility: hidden;'
        #         + '}' +
        #
        #         '.icon-bar button{'
        #         + 'float: left;'
        #         + 'width: 33.33%;'
        #         + 'text-align: center;'
        #         + 'padding: 12px 0;'
        #         + 'color:white;'
        #         + 'font-size:10px;'
        #         + 'background-color:grey;'
        #         + 'border:none;'
        #         + 'outline:none;'
        #         + 'cursor:pointer;'
        #         + '}' +
        #
        #         '#temp_inner {'
        #         + 'height:calc(100% - 20px);'
        #         + 'width:calc(100% - 20px);'
        #         + 'margin-bottom: 10px;'
        #         + 'margin-top: 10px;'
        #         + 'margin-left: 10px;'
        #         + 'margin-right: 10px;'
        #         + '}')
        if 'widgets' == 'widgets':
            def create_googleMap(icon_path, classid, width, height, positionL, positionT, link, z_Index, bordercolor, leftWidth):
                pagehtml.write(
                    '<link href="resizable_chart.css" rel="stylesheet">\n\
                    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">\n\
                    <script src="https://d3js.org/d3.v4.min.js"></script>\n\
                    <div drag-resize id = "widget' + classid + '" name = "widget" style="background-color: rgb(34, 59, 115); position: absolute; height:'+height+'%; width:'+width+'%; left:'+positionL+'%; top:'+positionT+'%;">\n\
                    <div id="selected" style="height: 100%;width: 100%;">\n\
                           <div id="widget_container" ></div>\n\
                       </div>\n\
                       <div id ="overlay'+classid+'" class="overlay"></div>\n\
                   </div>\n\
                   <button id="unlock_' + classid + '" class="btn btn-default btn-sm hidden" style=" position: absolute; top:'+positionT+'%; background-color: #2F4050;z-index:2; left:'+leftWidth+'%;" name="unLockAnElement" onclick="unLockWidget(\'' + classid + '\');" >\n\
                   <span class="fa fa-unlock drag-color" > </span>\n\
                   </button>\n\
                   <button id="activate_' + classid + '" class="btn btn-default btn-sm hidden" style=" position: absolute; top:'+positionT+'%; background-color: #2F4050;z-index:2; left:'+leftWidth+'%;" name="unLockAnElement" onclick="deactivateWidget(\'' + classid + '\');" >\n\
                   <span class="fa fa-times drag-color" > </span>\n\
                   </button>\n\
                   <script>\n\
                       var minWidth = 60;\n\
                       var minHeight = 40;\n\
                       var MARGINS = 4;\n\
                       var clicked = null;\n\
                       var onRightEdge, onBottomEdge, onLeftEdge, onTopEdge;\n\
                       var rightScreenEdge, bottomScreenEdge;\n\
                       var b, x, y;\n\
                       var redraw = false;\n\
                       function onMouseDown(e) {\n\
                           onDown(e);\n\
                           e.preventDefault();\n\
                       }\n\
                       function myMap() {\n\
                           var mapOptions = {\n\
                               center: new google.maps.LatLng(51.5, -0.12),\n\
                               zoom: 10,\n\
                               mapTypeId: google.maps.MapTypeId.HYBRID\n\
                           }\n\
                           var map = new google.maps.Map(document.getElementById("widget_container"),mapOptions);\n\
                       }\n\
                       function sending() {\n\
                           $.ajax({\n\
                                type: "GET",\n\
                                url: "index",\n\
                                name: "getPredictions",\n\
                                data: {"name": "getPredictions",\n\
                                "id": "id' + classid + '",\n\
                                }\n\
                           });\n\
                       }\n\
                   </script>\n\
               <script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyB6d8kHSyB_BemEfCxrc45nvq62zseaGYQ&callback=myMap"> </script>')
                pagecss.write(
                    '#widget' + classid + '{'
                    + 'height:100%;'
                    + 'width:100%;'
                    + 'position: absolute;'
                    + 'margin: 0;'
                    + 'padding: 0;'
                    + 'background: transparent;'
                    + 'z-index: ' + z_Index + ';'
                    + '}' +

                    '#widget' + classid + 'pro{'
                    + 'height:' + height + '%;'
                    + 'width:80%;'
                    + 'left:' + positionL + '%;'
                    + 'top:' + positionT + '%;'
                    + 'margin: 0;'
                    + 'padding: 0;'
                    + 'background: transparent;'
                    + 'z-index: 1;'
                    + '}' +

                    '#widget' + classid + ':hover {'
                    + 'background-color: rgba(100, 100, 100, 0.3);'
                    + 'border-width: 1px;border-style: dashed;'
                    + 'border-color: rgba(24, 166, 137, 1)'
                    + ';}' +

                    '#overlay'+classid+'" {'
                    + 'position:absolute;'
                    + 'top:0;'
                    + 'height: 100%;'
                    + 'width: 100%;'
                    + 'z-index: -1;'
                    + '}' +

                    '#widget' + classid + ':hover #overlay'+classid+'"{'
                    +'background-color: rgb(0,0,0,0.53);'
                    +'z-index: 1;'
                    +'}'+

                    '#widget_container {'
                    + 'height:calc(100% - 4px);'
                    + 'width:calc(100% - 4px);'
                    + 'margin-bottom: 2px;'
                    + 'margin-top: 2px;'
                    + 'margin-left: 2px;'
                    + 'margin-right: 2px;'
                    + '}')

            def create_calendar(icon_path, classid, width, height, positionL, positionT, link):
                pagehtml.write(
                    '<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">\n\
                    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css">\n\
                    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js"></script>\n\
                    <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js"></script>\n\
                    <script src="/jquery-3.3.1.min.js"></script>\n\
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">\n\
                    <link href="/static/dirty_static/css_1/bootstrap.min.css" rel="stylesheet">\n\
                    <link href="/static/dirty_static/css_1/plugins/fullcalendar/fullcalendar.css" rel="stylesheet">\n\
                    <link href="/static/dirty_static/css_1/plugins/fullcalendar/fullcalendar.print.css" rel="stylesheet" media="print">\n\
                    <link href="/static/dirty_static/css_1/animate.css" rel="stylesheet">\n\
                    <link href="/static/dirty_static/css_1/style.css" rel="stylesheet">\n\
                    <div id="id' + classid + '">\n\
                        <button id="cancel_edit" onmousedown="cancel_editDelayed()"><i class="fa fa-times"></i></button>\n\
                        <button id="unlock" onmousedown="unlockDelayed()"><i class="fa fa-unlock"></i></button>\n\
                        <div id="title">\n\
                            <div id= "icon-bar" class="icon-bar">\n\
                                <button id="delete" onmousedown="del()"><i class="fa fa-trash"></i></button>\n\
                                <button id="lock" onmousedown="lock()"><i class="fa fa-lock"></i></button>\n\
                                <button id="edit" onmousedown="edit()"><i class="fa fa-pencil"></i></button>\n\
                            </div>\n\
                        </div>\n\
                        <div id="selected" style="height: 100%;width: 100%; overflow: auto;">\n\
                            <div id="temp_inner">\n\
                                <div id="calendar" style="height:inherit;  z-index: 20"></div>\n\
                            </div>\n\
                        </div>\n\
                    </div>\n\
                    <script src="/static/dirty_static/js_1/plugins/fullcalendar/moment.min.js"></script>\n\
                    <script src="/static/dirty_static/js_1/jquery-3.1.1.min.js"></script>\n\
                    <script src="/static/dirty_static/js_1/bootstrap.min.js"></script>\n\
                    <script src="/static/dirty_static/js_1/plugins/metisMenu/jquery.metisMenu.js"></script>\n\
                    <script src="/static/dirty_static/js_1/plugins/slimscroll/jquery.slimscroll.min.js"></script>\n\
                    <script src="/static/dirty_static/js_1/inspinia.js"></script>\n\
                    <script src="/static/dirty_static/js_1/plugins/pace/pace.min.js"></script>\n\
                    <script src="/static/dirty_static/js_1/plugins/jquery-ui/jquery-ui.min.js"></script>\n\
                    <script src="/static/dirty_static/js_1/plugins/iCheck/icheck.min.js"></script>\n\
                    <script src="/static/dirty_static/js_1/plugins/fullcalendar/fullcalendar.js"></script>\n\
                    <script>\n\
                        $(document).ready(function() {\n\
                            var date = new Date();\n\
                            var d = date.getDate();\n\
                            var m = date.getMonth();\n\
                            var y = date.getFullYear();\n\
                            $("#calendar").fullCalendar({\n\
                                header: {\n\
                                    left: "prev,next today",\n\
                                    center: "title",\n\
                                    right: "month,agendaWeek,agendaDay"\n\
                                },\n\
                            });\n\
                            var displayRow = $("#temp-scroller").find(".fc-row");\n\
                            displayRow.attr("style", "height:16.67%");\n\
                            $(":button").click(function() {\n\
                                var displayRow = $("#temp-scroller").find(".fc-row");\n\
                                displayRow.attr("style", "height:16.67%");\n\
                            });\n\
                        });\n\
                        var minWidth = 1;\n\
                        var minHeight = 1;\n\
                        var MARGINS = 4;\n\
                        var clicked = null;\n\
                        var onRightEdge, onBottomEdge, onLeftEdge, onTopEdge;\n\
                        var rightScreenEdge, bottomScreenEdge;\n\
                        var b, x, y;\n\
                        var redraw = false;\n\
                        var pane = document.getElementById("id' + classid + '");\n\
                        pane.addEventListener("mousedown", onMouseDown);\n\
                        document.addEventListener("mousemove", onMove);\n\
                        function onMouseDown(e) {\n\
                            onDown(e);\n\
                            e.preventDefault();\n\
                        }\n\
                        function onDown(e) {\n\
                            calc(e);\n\
                            var isResizing = onRightEdge || onBottomEdge || onTopEdge || onLeftEdge;\n\
                            clicked = {\n\
                                x: x,\n\
                                y: y,\n\
                                cx: e.clientX,\n\
                                cy: e.clientY,\n\
                                w: b.width,\n\
                                h: b.height,\n\
                                isResizing: isResizing,\n\
                                isMoving: !isResizing && canMove(),\n\
                                onTopEdge: onTopEdge,\n\
                                onLeftEdge: onLeftEdge,\n\
                                onRightEdge: onRightEdge,\n\
                                onBottomEdge: onBottomEdge\n\
                            };\n\
                        }\n\
                        function canMove() {\n\
                            return x > 0 && x < b.width && y > 0 && y < b.height;\n\
                        }\n\
                        function calc(e) {\n\
                            b = pane.getBoundingClientRect();\n\
                            x = e.clientX - b.left;\n\
                            y = e.clientY - b.top;\n\
                            onTopEdge = y < MARGINS;\n\
                            onLeftEdge = x < MARGINS;\n\
                            onRightEdge = x >= b.width - MARGINS;\n\
                            onBottomEdge = y >= b.height - MARGINS;\n\
                            rightScreenEdge = window.innerWidth - MARGINS;\n\
                            bottomScreenEdge = window.innerHeight - MARGINS;\n\
                        }\n\
                        var e;\n\
                        function onMove(ee) {\n\
                            animate();\n\
                            calc(ee);\n\
                            e = ee;\n\
                            redraw = true;\n\
                        }\n\
                        function animate() {\n\
                            var screen = document.getElementById("container-inside-frame").getBoundingClientRect();\n\
                            requestAnimationFrame(animate);\n\
                            if (!redraw) return;\n\
                            redraw = false;\n\
                            if (clicked && clicked.isResizing) {\n\
                                if (clicked.onRightEdge) pane.style.width = Math.max(x, minWidth) + "px";\n\
                                if (clicked.onBottomEdge) pane.style.height = Math.max(y, minHeight) + "px";\n\
                                if (clicked.onLeftEdge) {\n\
                                    var currentWidth = Math.max(clicked.cx - e.clientX  + clicked.w, minWidth);\n\
                                    if (currentWidth > minWidth) {\n\
                                        pane.style.width = currentWidth + "px";\n\
                                        pane.style.left = e.clientX - screen.left + "px";\n\
                                    }\n\
                                }\n\
                                if (clicked.onTopEdge) {\n\
                                    var currentHeight = Math.max(clicked.cy - e.clientY  + clicked.h, minHeight);\n\
                                    if (currentHeight > minHeight) {\n\
                                        pane.style.height = currentHeight + "px";\n\
                                        pane.style.top = e.clientY - screen.top + "px";\n\
                                    }\n\
                                }\n\
                                return;\n\
                            }\n\
                            if (clicked && clicked.isMoving) {\n\
                                pane.style.top = (e.clientY - screen.top - clicked.y) + "px";\n\
                                pane.style.left = (e.clientX - screen.left - clicked.x) + "px";\n\
                                return;\n\
                            }\n\
                            if (onRightEdge && onBottomEdge || onLeftEdge && onTopEdge) {\n\
                                pane.style.cursor = "nwse-resize";\n\
                            } else if (onRightEdge && onTopEdge || onBottomEdge && onLeftEdge) {\n\
                                pane.style.cursor = "nesw-resize";\n\
                            } else if (onRightEdge || onLeftEdge) {\n\
                                pane.style.cursor = "ew-resize";\n\
                            } else if (onBottomEdge || onTopEdge) {\n\
                                pane.style.cursor = "ns-resize";\n\
                            } else if (canMove()) {\n\
                                pane.style.cursor = "move";\n\
                            } else {\n\
                                pane.style.cursor = "default";\n\
                            }\n\
                        }\n\
                        animate();\n\
                        function onUp(e) {\n\
                            calc(e);\n\
                            clicked = null;\n\
                        }\n\
                        var backup_pane;\n\
                        function edit(){\n\
                            pane.removeEventListener("mousedown", onMouseDown);\n\
                            document.removeEventListener("mousemove", onMove);\n\
                            document.removeEventListener("mouseup", onUp);\n\
                            document.getElementById("title").style.visibility = "hidden";\n\
                            document.getElementById("cancel_edit").style.visibility = "visible";\n\
                            document.getElementById("selected").style.borderWidth = "1px";\n\
                            document.getElementById("selected").style.borderStyle = "dashed";\n\
                            document.getElementById("selected").style.borderRadius = "6px";\n\
                            document.getElementById("icon-bar").style.visibility = "hidden";\n\
                        }\n\
                        var cancel_edit_delayed;\n\
                        function cancel_editDelayed() {\n\
                            cancel_edit_delayed = setTimeout(cancel_edit, 100);\n\
                        }\n\
                        function cancel_edit(){\n\
                            pane.addEventListener("mousedown", onMouseDown);\n\
                            document.addEventListener("mousemove", onMove);\n\
                            document.addEventListener("mouseup", onUp);\n\
                            document.getElementById("title").style.visibility = "visible";\n\
                            document.getElementById("cancel_edit").style.visibility = "hidden";\n\
                            document.getElementById("selected").style.borderWidth = "0px";\n\
                            document.getElementById("icon-bar").style.visibility = defaultStatus;\n\
                        }\n\
                        var unlock_delayed;\n\
                        function unlockDelayed() {\n\
                            unlock_delayed = setTimeout(unlock, 100);\n\
                        }\n\
                        function lock(){\n\
                            pane.removeEventListener("mousedown", onMouseDown);\n\
                            document.removeEventListener("mousemove", onMove);\n\
                            document.removeEventListener("mouseup", onUp);\n\
                            document.getElementById("title").style.backgroundColor = "transparent";\n\
                            document.getElementById("unlock").style.visibility = "visible";\n\
                            document.getElementById("icon-bar").style.visibility = "hidden";\n\
                        }\n\
                        function unlock(){\n\
                            pane.addEventListener("mousedown", onMouseDown);\n\
                            document.addEventListener("mousemove", onMove);\n\
                            document.addEventListener("mouseup", onUp);\n\
                            document.getElementById("title").style.backgroundColor = defaultStatus;\n\
                            document.getElementById("title").style.borderStyle = defaultStatus;\n\
                            document.getElementById("icon-bar").style.visibility = defaultStatus;\n\
                            document.getElementById("unlock").style.visibility = "hidden";\n\
                        }\n\
                    </script>')

                pagecss.write(
                    '#id' + classid + '{'
                    + 'position: absolute;'
                    + 'min-width: 493px;'
                    + 'min-height: 236px;'
                    + 'height:' + height + '%;'
                    + 'width:' + width + '%;'
                    + 'left:' + positionL + '%;'
                    + 'top:' + positionT + '%;'
                    + 'margin: 0;'
                    + 'padding: 0;'
                    + 'background: black;'
                    + 'z-index: 10;'
                    + 'border-radius: 6px;'
                    + '}' +


                    '#title {'
                    + 'position: absolute;'
                    + 'font-family: monospace;'
                    + 'font-size: 24px;'
                    + 'text-align: center;'
                    + 'height: 100%;'
                    + 'width: 100%;'
                    + 'position: absolute;'
                    + 'visibility: visible;'
                    + 'border-radius: 6px;'
                    + 'z-index: 10;'
                    + '}' +

                    '#cancel_edit {'
                    + 'position:absolute;'
                    + 'height: 30px;'
                    + 'width: 30px;'
                    + 'background-color: grey;'
                    + 'right: -4px;'
                    + 'top: -4px;'
                    + 'visibility: hidden;'
                    + 'z-index: 15;'
                    + '}' +

                    '#unlock {'
                    + 'position:absolute;'
                    + 'height: 30px;'
                    + 'width: 30px;'
                    + 'background-color: grey;'
                    + 'right: -4px;'
                    + 'top: -4px;'
                    + 'visibility: hidden;'
                    + 'z-index: 15;'
                    + '}' +

                    '#title:hover .icon-bar{'
                    + 'visibility:visible;'
                    + '}' +

                    '#title:hover{'
                    + 'background-color: rgba(100, 100, 100, 0.3);'
                    + 'border-width: 1px;'
                    + 'border-style: dashed;'
                    + 'border-color: black;'
                    + '}' +

                    '.icon-bar button:hover{'
                    + 'background-color:#000;'
                    + '}' +

                    '.icon-bar{'
                    + 'width: 50%;'
                    + 'height: 34px;'
                    + 'transform: translate(50%);'
                    + 'background-color: #555;'
                    + 'overflow: auto;'
                    + 'visibility: hidden;'
                    + '}' +

                    '.icon-bar button{'
                    + 'float: left;'
                    + 'width: 33.33%;'
                    + 'text-align: center;'
                    + 'padding: 12px 0;'
                    + 'color:white;'
                    + 'font-size:10px;'
                    + 'background-color:grey;'
                    + 'border:none;'
                    + 'outline:none;'
                    + 'cursor:pointer;'
                    + '}' +

                    '#temp_inner {'
                    + 'height:calc(100% - 20px);'
                    + 'width:calc(100% - 20px);'
                    + 'margin-bottom: 10px;'
                    + 'margin-top: 10px;'
                    + 'margin-left: 10px;'
                    + 'margin-right: 10px;'
                    + '}')
            ## New barchart from Yen
            def create_barChart3(icon_path, classid, width, height, positionL, positionT, link):
                pagehtml.write(
                    '<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">\n\
                    <script src="https://d3js.org/d3.v4.min.js"></script>\n\
                    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css">\n\
                    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js"></script>\n\
                    <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js"></script>\n\
                    <script src="jquery-3.3.1.min.js"></script>\n\
                    <div id="id' + classid +'" class="class' + classid + ' main">\n\
                        <button id= "cancel_edit" onmousedown="cancel_editDelayed()"><i class="fa fa-times"></i></button>\n\
                        <button id= "unlock" onmousedown= "unlockDelayed()"><i class ="fa fa-unlock"></i></button>\n\
                        <div id="title">\n\
                            <div id= "icon-bar" class="icon-bar">\n\
                                <button id="delete" onmousedown="del()"><i class="fa fa-trash"></i></button>\n\
                                <button id="lock" onmousedown="lock()"><i class="fa fa-lock"></i></button>\n\
                                <button id="edit" onmousedown="edit()"><i class="fa fa-pencil"></i></button>\n\
                            </div>\n\
                        </div>\n\
                        <div id="selected" style="height: 100%;width: 100%;">\n\
                            <div id="temp_inner"></div>\n\
                        </div>\n\
                    </div>\n\
                    <script src="https://d3js.org/d3.v4.min.js"></script>\n\
                    <script>\n\
                        var minWidth = 5;\n\
                        var minHeight = 5;\n\
                        var MARGINS = 10;\n\
                        var clicked = null;\n\
                        var onRightEdge, onBottomEdge, onLeftEdge, onTopEdge;\n\
                        var rightScreenEdge, bottomScreenEdge;\n\
                        var b, x, y;\n\
                        var redraw = false;\n\
                        var pane = document.getElementById("id' + classid + '");\n\
                        pane.addEventListener("mousedown", onMouseDown);\n\
                        document.addEventListener("mousemove", onMove);\n\
                        document.addEventListener("mouseup", onUp);\n\
                        function onMouseDown(e) {\n\
                            onDown(e);\n\
                            e.preventDefault();\n\
                        }\n\
                        function onDown(e) {\n\
                            calc(e);\n\
                            var isResizing = onRightEdge || onBottomEdge || onTopEdge || onLeftEdge;\n\
                            clicked = {\n\
                                x: x,\n\
                                y: y,\n\
                                cx: e.clientX,\n\
                                cy: e.clientY,\n\
                                t: b.top,\n\
                                l: b.left,\n\
                                w: b.width,\n\
                                h: b.height,\n\
                                isResizing: isResizing,\n\
                                isMoving: !isResizing && canMove(),\n\
                                onTopEdge: onTopEdge,\n\
                                onLeftEdge: onLeftEdge,\n\
                                onRightEdge: onRightEdge,\n\
                                onBottomEdge: onBottomEdge\n\
                            };\n\
                        }\n\
                        function canMove() {\n\
                            return x > 0 && x < b.width && y > 0 && y < b.height;\n\
                        }\n\
                        function calc(e) {\n\
                            b = pane.getBoundingClientRect();\n\
                            x = e.clientX - b.left;\n\
                            y = e.clientY - b.top;\n\
                            onTopEdge = y < MARGINS;\n\
                            onLeftEdge = x < MARGINS;\n\
                            onRightEdge = x >= b.width - MARGINS;\n\
                            onBottomEdge = y >= b.height - MARGINS;\n\
                            rightScreenEdge = window.innerWidth - MARGINS;\n\
                            bottomScreenEdge = window.innerHeight - MARGINS;\n\
                        }\n\
                        var e;\n\
                        function onMove(ee) {\n\
                            animate();\n\
                            resize();\n\
                            calc(ee);\n\
                            e = ee;\n\
                            redraw = true;\n\
                        }\n\
                        function animate() {\n\
                            var screen = document.getElementById("container-inside-frame").getBoundingClientRect();\n\
                            requestAnimationFrame(animate);\n\
                            if (!redraw) return;\n\
                            redraw = false;\n\
                            if (clicked && clicked.isResizing) {\n\
                                if (clicked.onRightEdge) pane.style.width = Math.max(x, minWidth) + "px";\n\
                                if (clicked.onBottomEdge) pane.style.height = Math.max(y, minHeight) + "px";\n\
                                if (clicked.onLeftEdge) {\n\
                                    var currentWidth = Math.max(clicked.cx - e.clientX + clicked.w, minWidth);\n\
                                    if (currentWidth > minWidth) {\n\
                                        pane.style.width = currentWidth + "px";\n\
                                        pane.style.left = e.clientX - screen.left + "px";\n\
                                    }\n\
                                }\n\
                                if (clicked.onTopEdge) {\n\
                                    var currentHeight = Math.max(clicked.cy - e.clientY + clicked.h, minHeight);\n\
                                    if (currentHeight > minHeight) {\n\
                                        pane.style.height = currentHeight + "px";\n\
                                        pane.style.top = e.clientY - screen.top + "px";\n\
                                    }\n\
                                }\n\
                                return;\n\
                            }\n\
                            if (clicked && clicked.isMoving) {\n\
                                console.log(screen.top);\n\
                                pane.style.top = (e.clientY - screen.top - clicked.y) + "px";\n\
                                pane.style.left = (e.clientX - screen.left - clicked.x) + "px";\n\
                                return;\n\
                            }\n\
                            if (onRightEdge && onBottomEdge || onLeftEdge && onTopEdge) {\n\
                                pane.style.cursor = "nwse-resize";\n\
                            } else if (onRightEdge && onTopEdge || onBottomEdge && onLeftEdge) {\n\
                                pane.style.cursor = "nesw-resize";\n\
                            } else if (onRightEdge || onLeftEdge) {\n\
                                pane.style.cursor = "ew-resize";\n\
                            } else if (onBottomEdge || onTopEdge) {\n\
                                pane.style.cursor = "ns-resize";\n\
                            } else if (canMove()) {\n\
                                pane.style.cursor = "move";\n\
                            } else {\n\
                                pane.style.cursor = "default";\n\
                            }\n\
                        }\n\
                        animate();\n\
                        var data = [{index: 0, value: 3},\n\
                                    {index: 1, value: 5},\n\
                                    {index: 2, value: 12},\n\
                                    {index: 3, value: 8},\n\
                                    {index: 4, value: 20},\n\
                                    {index: 5, value: 7},\n\
                                    {index: 6, value: 2},\n\
                                    {index: 7, value: 15},\n\
                                    {index: 8, value: 14},\n\
                                    {index: 9, value: 12},\n\
                                    {index: 10, value: 9},\n\
                                    {index: 11, value: 5},\n\
                                    {index: 12, value: 7}\n\
                                   ];\n\
                        function onUp(e) {\n\
                            calc(e);\n\
                            clicked = null;\n\
                        }\n\
                        function resize(){\n\
                            var div = document.getElementById("temp_inner");\n\
                            while(div.firstChild){\n\
                                div.removeChild(div.firstChild);\n\
                            }\n\
                            refresh(data);\n\
                        }\n\
                        function refresh(data) {\n\
                            var chartDiv = document.getElementById("temp_inner");\n\
                            var widthY = chartDiv.clientWidth,\n\
                                heightY = chartDiv.clientHeight;\n\
                            var fontSize = Math.min(widthY * 0.05, heightY * 0.05);\n\
                            delim = 4;\n\
                            var scaleY = d3.scaleLinear()\n\
                                .domain([0, 21]) \n\
                                .rangeRound([heightY, 0]);\n\
                            var x = d3.scaleLinear()\n\
                                .domain([0, data.length])\n\
                                .rangeRound([0, widthY]);\n\
                            var svgY = d3.select("#temp_inner")\n\
                                .append("svg")\n\
                                .attr("width", widthY)\n\
                                .attr("height", heightY)\n\
                                .append("g");\n\
                            svgY\n\
                                .append("rect")\n\
                                .attr("x", 0)\n\
                                .attr("y", 0)\n\
                                .style("stroke", "black")\n\
                                .style("fill", "lightyellow")\n\
                                .attr("width", widthY)\n\
                                .attr("height", heightY);\n\
                            var brushY = d3.brushY()\n\
                                .extent(function(d, i) {\n\
                                    return [[x(i) + delim / 2, 0],\n\
                                        [x(i) + x(1) - delim / 2, heightY]];})\n\
                                .on("brush", brushmoveY)\n\
                                .on("end", brushendY);\n\
                            var svgbrushY = svgY\n\
                                .selectAll(".brush")\n\
                                .data(data)\n\
                                .enter()\n\
                                .append("g")\n\
                                .attr("class", "brush")\n\
                                .append("g")\n\
                                .call(brushY)\n\
                                .call(brushY.move, function(d){return [d.value, 0].map(scaleY);});\n\
                        svgbrushY\n\
                            .append("text")\n\
                            .attr("y", function(d){return scaleY(d.value) + 25;})\n\
                            .attr("x", function(d, i){return x(i) + x(0.5);})\n\
                            .attr("dx", "-.60em")\n\
                            .attr("dy", -5)\n\
                            .style("fill", "black")\n\
                            .style("font-size", fontSize)\n\
                            .text(function(d){return d3.format(".2")(d.value);});\n\
                        function brushendY(){\n\
                            if (!d3.event.sourceEvent) return;\n\
                            if (d3.event.sourceEvent.type === "brush") return;\n\
                            if (!d3.event.selection) {\n\
                                svgbrushY\n\
                                    .call(brushY.move, function (d){\n\
                                        return [d.value, 0].map(scaleY);})\n\
                            };\n\
                        }\n\
                        function brushmoveY() {\n\
                            if (!d3.event.sourceEvent) return;\n\
                            if (d3.event.sourceEvent.type === "brush") return;\n\
                            if (!d3.event.selection) return;\n\
                            var d0 = d3.event.selection.map(scaleY.invert);\n\
                            var d = d3.select(this).select(".selection");\n\
                            d.datum().value = d0[0];\n\
                            update();\n\
                        }\n\
                        function update(){\n\
                            svgbrushY\n\
                                .call(brushY.move, function(d){return [d.value, 0].map(scaleY);})\n\
                                .selectAll("text")\n\
                                .attr("y", function(d){return scaleY(d.value) + 25;})\n\
                                .text(function(d){return d3.format(".2")(d.value);});\n\
                        }\n\
                    }\n\
                        var backup_pane;\n\
                        function edit(){\n\
                            pane.removeEventListener("mousedown", onMouseDown);\n\
                            document.removeEventListener("mousemove", onMove);\n\
                            document.removeEventListener("mouseup", onUp);\n\
                            document.getElementById("title").style.visibility = "hidden";\n\
                            document.getElementById("cancel_edit").style.visibility = "visible";\n\
                            document.getElementById("selected").style.borderWidth = "1px";\n\
                            document.getElementById("selected").style.borderStyle = "dashed";\n\
                            document.getElementById("selected").style.borderRadius = "6px";\n\
                            document.getElementById("icon-bar").style.visibility = "hidden";\n\
                        }\n\
                        var cancel_edit_delayed;\n\
                        function cancel_editDelayed() {\n\
                            cancel_edit_delayed = setTimeout(cancel_edit, 100);\n\
                        }\n\
                        function cancel_edit(){\n\
                            pane.addEventListener("mousedown", onMouseDown);\n\
                            document.addEventListener("mousemove", onMove);\n\
                            document.addEventListener("mouseup", onUp);\n\
                            document.getElementById("title").style.visibility = "visible";\n\
                            document.getElementById("cancel_edit").style.visibility = "hidden";\n\
                            document.getElementById("selected").style.borderWidth = "0px";\n\
                            document.getElementById("icon-bar").style.visibility = defaultStatus;\n\
                        }\n\
                        var unlock_delayed;\n\
                        function unlockDelayed() {\n\
                            unlock_delayed = setTimeout(unlock, 100);\n\
                        }\n\
                        function lock(){\n\
                            pane.removeEventListener("mousedown", onMouseDown);\n\
                            document.removeEventListener("mousemove", onMove);\n\
                            document.removeEventListener("mouseup", onUp);\n\
                            document.getElementById("title").style.backgroundColor = "transparent";\n\
                            document.getElementById("unlock").style.visibility = "visible";\n\
                            document.getElementById("icon-bar").style.visibility = "hidden";\n\
                        }\n\
                        function unlock(){\n\
                            pane.addEventListener("mousedown", onMouseDown);\n\
                            document.addEventListener("mousemove", onMove);\n\
                            document.addEventListener("mouseup", onUp);\n\
                            document.getElementById("title").style.backgroundColor = defaultStatus;\n\
                            document.getElementById("title").style.borderStyle = defaultStatus;\n\
                            document.getElementById("icon-bar").style.visibility = defaultStatus;\n\
                            document.getElementById("unlock").style.visibility = "hidden";\n\
                        }\n\
                </script>')

                pagecss.write(
                    '#id' + classid + '{'
                    + 'position: absolute;'
                    + 'height:' + height + '%;'
                    + 'width:' + width + '%;'
                    + 'left:' + positionL + '%;'
                    + 'top:' + positionT + '%;'
                    + 'margin: 0;'
                    + 'padding: 0;'
                    + 'z-index: 10;'
                    + 'background: transparent;'
                    + '}' +

                    '#title {'
                    + 'position: absolute;'
                    + 'font-family: monospace;'
                    + 'font-size: 24px;'
                    + 'text-align: center;'
                    + 'height: 100%;'
                    + 'width: 100%;'
                    + 'position: absolute;'
                    + 'visibility: visible;'
                    + 'border-radius: 6px;'
                    + '}' +

                    '#cancel_edit {'
                    + 'position:absolute;'
                    + 'height: 30px;'
                    + 'width: 30px;'
                    + 'background-color: grey;'
                    + 'right: -4px;'
                    + 'top: -4px;'
                    + 'visibility: hidden;'
                    + 'z-index: 15;'
                    + '}' +

                    '#unlock {'
                    + 'position:absolute;'
                    + 'height: 30px;'
                    + 'width: 30px;'
                    + 'background-color: grey;'
                    + 'right: -4px;'
                    + 'top: -4px;'
                    + 'visibility: hidden;'
                    + 'z-index: 15;'
                    + '}' +

                    '#title:hover .icon-bar{'
                    + 'visibility:visible;'
                    + '}' +

                    '#title:hover{'
                    + 'background-color: rgba(100, 100, 100, 0.3);'
                    + 'border-width: 1px;'
                    + 'border-style: dashed;'
                    + 'border-color: black;'
                    + '}' +

                    '.icon-bar button:hover{'
                    + 'background-color:#000;'
                    + '}' +

                    '.icon-bar{'
                    + 'width: 50%;'
                    + 'height: 34px;'
                    + 'transform: translate(50%);'
                    + 'background-color: #555;'
                    + 'overflow: auto;'
                    + 'visibility: hidden;'
                    + '}' +

                    '.icon-bar button{'
                    + 'float: left;'
                    + 'width: 33.33%;'
                    + 'text-align: center;'
                    + 'padding: 12px 0;'
                    + 'color:white;'
                    + 'font-size:10px;'
                    + 'background-color:grey;'
                    + 'border:none;'
                    + 'outline:none;'
                    + 'cursor:pointer;'
                    + '}' +

                    '#temp_inner {'
                    + 'height:calc(100% - 20px);'
                    + 'width:calc(100% - 20px);'
                    + 'margin-bottom: 10px;'
                    + 'margin-top: 10px;'
                    + 'margin-left: 10px;'
                    + 'margin-right: 10px;'
                    + '}'
                )
            def create_pieChart(icon_path, classid, width, height, positionL, positionT, link):
                pagehtml.write(
                    '<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">\n\
                    <div id="id' + classid + '">\n\
                        <button id="cancel_edit" onmousedown="cancel_editDelayed()"><i class="fa fa-times"></i></button>\n\
                        <button id="unlock" onmousedown="unlockDelayed()"><i class="fa fa-unlock"></i></button>\n\
                        <div id="title">\n\
                            <div id= "icon-bar" class="icon-bar">\n\
                                <button id="delete" onmousedown="del()"><i class="fa fa-trash"></i></button>\n\
                                <button id="lock" onmousedown="lock()"><i class="fa fa-lock"></i></button>\n\
                                <button id="edit" onmousedown="edit()"><i class="fa fa-pencil"></i></button>\n\
                            </div>\n\
                        </div>\n\
                        <div id="selected" style="height: 100%;width: 100%;">\n\
                            <div id="temp_inner"></div>\n\
                            <button class="randomize" style="position: absolute; top: 10; left: 10;">randomize</button>\n\
                        </div>\n\
                    </div>\n\
                    <script src="http://d3js.org/d3.v3.min.js"></script>\n\
                    <script>\n\
                        var minWidth = 5;\n\
                        var minHeight = 5;\n\
                        var MARGINS = 4;\n\
                        var clicked = null;\n\
                        var onRightEdge, onBottomEdge, onLeftEdge, onTopEdge;\n\
                        var rightScreenEdge, bottomScreenEdge;\n\
                        var b, x, y;\n\
                        var redraw = false;\n\
                        var pane = document.getElementById("id' + classid + '");\n\
                        pane.addEventListener("mousedown", onMouseDown);\n\
                        document.addEventListener("mousemove", onMove);\n\
                        document.addEventListener("mouseup", onUp);\n\
                        function onMouseDown(e) {\n\
                            onDown(e);\n\
                            e.preventDefault();\n\
                        }\n\
                        function onDown(e) {\n\
                            calc(e);\n\
                            var isResizing = onRightEdge || onBottomEdge || onTopEdge || onLeftEdge;\n\
                            clicked = {\n\
                                x: x,\n\
                                y: y,\n\
                                cx: e.clientX,\n\
                                cy: e.clientY,\n\
                                w: b.width,\n\
                                h: b.height,\n\
                                isResizing: isResizing,\n\
                                isMoving: !isResizing && canMove(),\n\
                                onTopEdge: onTopEdge,\n\
                                onLeftEdge: onLeftEdge,\n\
                                onRightEdge: onRightEdge,\n\
                                onBottomEdge: onBottomEdge\n\
                            };\n\
                        }\n\
                        function canMove() {\n\
                            return x > 0 && x < b.width && y > 0 && y < b.height;\n\
                        }\n\
                        function calc(e) {\n\
                            b = pane.getBoundingClientRect();\n\
                            x = e.clientX - b.left;\n\
                            y = e.clientY - b.top;\n\
                            onTopEdge = y < MARGINS;\n\
                            onLeftEdge = x < MARGINS;\n\
                            onRightEdge = x >= b.width - MARGINS;\n\
                            onBottomEdge = y >= b.height - MARGINS;\n\
                            rightScreenEdge = window.innerWidth - MARGINS;\n\
                            bottomScreenEdge = window.innerHeight - MARGINS;\n\
                        }\n\
                        var e;\n\
                        function onMove(ee) {\n\
                            animate();\n\
                            resize();\n\
                            calc(ee);\n\
                            e = ee;\n\
                            redraw = true;\n\
                        }\n\
                        function animate() {\n\
                            var screen = document.getElementById("container-inside-frame").getBoundingClientRect();\n\
                            requestAnimationFrame(animate);\n\
                            if (!redraw) return;\n\
                            redraw = false;\n\
                            if (clicked && clicked.isResizing) {\n\
                                if (clicked.onRightEdge) pane.style.width = Math.max(x, minWidth) + "px";\n\
                                if (clicked.onBottomEdge) pane.style.height = Math.max(y, minHeight) + "px";\n\
                                if (clicked.onLeftEdge) {\n\
                                    var currentWidth = Math.max(clicked.cx - e.clientX  + clicked.w, minWidth);\n\
                                    if (currentWidth > minWidth) {\n\
                                        pane.style.width = currentWidth + "px";\n\
                                        pane.style.left = e.clientX - screen.left + "px";\n\
                                    }\n\
                                }\n\
                                if (clicked.onTopEdge) {\n\
                                    var currentHeight = Math.max(clicked.cy - e.clientY  + clicked.h, minHeight);\n\
                                    if (currentHeight > minHeight) {\n\
                                        pane.style.height = currentHeight + "px";\n\
                                        pane.style.top = e.clientY - screen.top + "px";\n\
                                    }\n\
                                }\n\
                                return;\n\
                            }\n\
                            if (clicked && clicked.isMoving) {\n\
                                pane.style.top = (e.clientY - screen.top - clicked.y) + "px";\n\
                                pane.style.left = (e.clientX - screen.left - clicked.x) + "px";\n\
                                return;\n\
                            }\n\
                            if (onRightEdge && onBottomEdge || onLeftEdge && onTopEdge) {\n\
                                pane.style.cursor = "nwse-resize";\n\
                            } else if (onRightEdge && onTopEdge || onBottomEdge && onLeftEdge) {\n\
                                pane.style.cursor = "nesw-resize";\n\
                            } else if (onRightEdge || onLeftEdge) {\n\
                                pane.style.cursor = "ew-resize";\n\
                            } else if (onBottomEdge || onTopEdge) {\n\
                                pane.style.cursor = "ns-resize";\n\
                            } else if (canMove()) {\n\
                                pane.style.cursor = "move";\n\
                            } else {\n\
                                pane.style.cursor = "default";\n\
                            }\n\
                        }\n\
                        animate();\n\
                        function onUp(e) {\n\
                            calc(e);\n\
                            clicked = null;\n\
                        }\n\
                        var current_value = 1;\n\
                        function resize(){\n\
                            if (clicked && clicked.isResizing) {\n\
                                var elem_resize = document.getElementById("temp_inner");\n\
                                while(elem_resize.firstChild){\n\
                                    elem_resize.removeChild(elem_resize.firstChild);\n\
                                }\n\
                                refresh();\n\
                            }\n\
                        }\n\
                        function refresh(){\n\
                            var chartDiv = document.getElementById("temp_inner");\n\
                            var width = chartDiv.clientWidth,\n\
                                height = chartDiv.clientHeight;\n\
                            var svg = d3.select("#temp_inner")\n\
                                .append("svg")\n\
                                .append("g")\n\
                            svg.append("g")\n\
                                .attr("class", "slices");\n\
                            svg.append("g")\n\
                                .attr("class", "labels");\n\
                            svg.append("g")\n\
                                .attr("class", "lines");\n\
                            var radius = Math.min(width, height) / 2;\n\
                            var pie = d3.layout.pie()\n\
                                .sort(null)\n\
                                .value(function(d) {\n\
                                    return d.value;\n\
                                });\n\
                            var arc = d3.svg.arc()\n\
                                .outerRadius(radius * 0.8)\n\
                                .innerRadius(radius * 0.4);\n\
                            var outerArc = d3.svg.arc()\n\
                                .innerRadius(radius * 0.9)\n\
                                .outerRadius(radius * 0.9);\n\
                            svg.attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");\n\
                            var key = function(d){ return d.data.label; };\n\
                            var color = d3.scale.ordinal()\n\
                                .domain(["Lorem ipsum", "dolor sit", "amet", "consectetur", "adipisicing", "elit", "sed", "do", "eiusmod", "tempor", "incididunt"])\n\
                                .range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);\n\
                            function randomData (){\n\
                                var labels = color.domain();\n\
                                return labels.map(function(label){\n\
                                    current_value = Math.random();\n\
                                    return { label: label, value: current_value }\n\
                                });\n\
                            }\n\
                            function data (){\n\
                                var labels = color.domain();\n\
                                return labels.map(function(label){\n\
                                    return { label: label, value: current_value}\n\
                                });\n\
                            }\n\
                            change(data());\n\
                            d3.select(".randomize")\n\
                                .on("click", function(){\n\
                                    change(randomData());\n\
                                });\n\
                            function change(data) {\n\
                                var slice = svg.select(".slices").selectAll("path.slice")\n\
                                    .data(pie(data), key);\n\
                                slice.enter()\n\
                                    .insert("path")\n\
                                    .style("fill", function(d) { return color(d.data.label); })\n\
                                    .attr("class", "slice");\n\
                                slice\n\
                                    .transition().duration(300)\n\
                                    .attrTween("d", function(d) {\n\
                                        this._current = this._current || d;\n\
                                        var interpolate = d3.interpolate(this._current, d);\n\
                                        this._current = interpolate(0);\n\
                                        return function(t) {\n\
                                            return arc(interpolate(t));\n\
                                        };\n\
                                    })\n\
                                slice.exit()\n\
                                    .remove();\n\
                                var text = svg.select(".labels").selectAll("text")\n\
                                    .data(pie(data), key);\n\
                                var fontSize = Math.min(width*0.05, height*0.05);\n\
                                text.enter()\n\
                                    .append("text")\n\
                                    .attr("dy", ".35em")\n\
                                    .attr("font-size", fontSize)\n\
                                    .text(function(d) {\n\
                                        return d.data.label;\n\
                                    });\n\
                                function midAngle(d){\n\
                                    return d.startAngle + (d.endAngle - d.startAngle)/2;\n\
                                }\n\
                                text.transition().duration(300)\n\
                                    .attrTween("transform", function(d) {\n\
                                        this._current = this._current || d;\n\
                                        var interpolate = d3.interpolate(this._current, d);\n\
                                        this._current = interpolate(0);\n\
                                        return function(t) {\n\
                                            var d2 = interpolate(t);\n\
                                            var pos = outerArc.centroid(d2);\n\
                                            pos[0] = radius * (midAngle(d2) < Math.PI ? 1 : -1);\n\
                                            return "translate("+ pos +")";\n\
                                        };\n\
                                    })\n\
                                    .styleTween("text-anchor", function(d){\n\
                                        this._current = this._current || d;\n\
                                        var interpolate = d3.interpolate(this._current, d);\n\
                                        this._current = interpolate(0);\n\
                                        return function(t) {\n\
                                            var d2 = interpolate(t);\n\
                                            return midAngle(d2) < Math.PI ? "start":"end";\n\
                                        };\n\
                                    });\n\
                                text.exit()\n\
                                    .remove();\n\
                                var polyline = svg.select(".lines").selectAll("polyline")\n\
                                    .data(pie(data), key);\n\
                                polyline.enter()\n\
                                    .append("polyline");\n\
                                polyline.transition().duration(300)\n\
                                    .attrTween("points", function(d){\n\
                                        this._current = this._current || d;\n\
                                        var interpolate = d3.interpolate(this._current, d);\n\
                                        this._current = interpolate(0);\n\
                                        return function(t) {\n\
                                            var d2 = interpolate(t);\n\
                                            var pos = outerArc.centroid(d2);\n\
                                            pos[0] = radius * 0.95 * (midAngle(d2) < Math.PI ? 1 : -1);\n\
                                            return [arc.centroid(d2), outerArc.centroid(d2), pos];\n\
                                        };\n\
                                    });\n\
                                polyline.exit()\n\
                                    .remove();\n\
                            };\n\
                        }\n\
                        refresh();\n\
                        var backup_pane;\n\
                        function edit(){\n\
                            pane.removeEventListener("mousedown", onMouseDown);\n\
                            document.removeEventListener("mousemove", onMove);\n\
                            document.removeEventListener("mouseup", onUp);\n\
                            document.getElementById("title").style.visibility = "hidden";\n\
                            document.getElementById("cancel_edit").style.visibility = "visible";\n\
                            document.getElementById("selected").style.borderWidth = "1px";\n\
                            document.getElementById("selected").style.borderStyle = "dashed";\n\
                            document.getElementById("selected").style.borderRadius = "6px";\n\
                            document.getElementById("icon-bar").style.visibility = "hidden";\n\
                        }\n\
                        var cancel_edit_delayed;\n\
                        function cancel_editDelayed() {\n\
                            cancel_edit_delayed = setTimeout(cancel_edit, 100);\n\
                        }\n\
                        function cancel_edit(){\n\
                            pane.addEventListener("mousedown", onMouseDown);\n\
                            document.addEventListener("mousemove", onMove);\n\
                            document.addEventListener("mouseup", onUp);\n\
                            document.getElementById("title").style.visibility = "visible";\n\
                            document.getElementById("cancel_edit").style.visibility = "hidden";\n\
                            document.getElementById("selected").style.borderWidth = "0px";\n\
                            document.getElementById("icon-bar").style.visibility = defaultStatus;\n\
                        }\n\
                        var unlock_delayed;\n\
                        function unlockDelayed() {\n\
                            unlock_delayed = setTimeout(unlock, 100);\n\
                        }\n\
                        function lock(){\n\
                            pane.removeEventListener("mousedown", onMouseDown);\n\
                            document.removeEventListener("mousemove", onMove);\n\
                            document.removeEventListener("mouseup", onUp);\n\
                            document.getElementById("title").style.backgroundColor = "transparent";\n\
                            document.getElementById("unlock").style.visibility = "visible";\n\
                            document.getElementById("icon-bar").style.visibility = "hidden";\n\
                        }\n\
                        function unlock(){\n\
                            pane.addEventListener("mousedown", onMouseDown);\n\
                            document.addEventListener("mousemove", onMove);\n\
                            document.addEventListener("mouseup", onUp);\n\
                            document.getElementById("title").style.backgroundColor = defaultStatus;\n\
                            document.getElementById("title").style.borderStyle = defaultStatus;\n\
                            document.getElementById("icon-bar").style.visibility = defaultStatus;\n\
                            document.getElementById("unlock").style.visibility = "hidden";\n\
                        }\n\
                    </script>')

                pagecss.write(
                    '#id' + classid + '{'
                    + 'position: absolute;'
                    + 'height:' + height + '%;'
                    + 'width:' + width + '%;'
                    + 'left:' + positionL + '%;'
                    + 'top:' + positionT + '%;'
                    + 'margin: 0;'
                    + 'padding: 0;'
                    + 'background: transparent;'
                    + 'z-index: 10;'
                    + '}' +

                    'body {'
                    + 'overflow: auto;'
                    + '}' +

                    '#title {'
                    + 'position: absolute;'
                    + 'font-family: monospace;'
                    + 'font-size: 24px;'
                    + 'text-align: center;'
                    + 'height: 100%;'
                    + 'width: 100%;'
                    + 'position: absolute;'
                    + 'visibility: visible;'
                    + 'border-radius: 6px;'
                    + 'z-index: 10;'
                    + '}' +

                    '#cancel_edit {'
                    + 'position:absolute;'
                    + 'height: 30px;'
                    + 'width: 30px;'
                    + 'background-color: grey;'
                    + 'right: -10px;'
                    + 'top: -10px;'
                    + 'visibility: hidden;'
                    + 'z-index: 15;'
                    + '}' +

                    '#unlock {'
                    + 'position:absolute;'
                    + 'height: 30px;'
                    + 'width: 30px;'
                    + 'background-color: grey;'
                    + 'right: -10px;'
                    + 'top: -10px;'
                    + 'visibility: hidden;'
                    + 'z-index: 15;'
                    + '}' +

                    '#title:hover .icon-bar{'
                    + 'visibility:visible;'
                    + '}' +

                    '#title:hover{'
                    + 'background-color: rgba(100, 100, 100, 0.3);'
                    + 'border-width: 1px;'
                    + 'border-style: dashed;'
                    + 'border-color: black;'
                    + '}' +

                    '.icon-bar button:hover{'
                    + 'background-color:#000;'
                    + '}' +

                    '.active{'
                    + 'background-color: #4CAF50 !important;'
                    + '}' +

                    '.icon-bar{'
                    + 'width: 50%;'
                    + 'height: 34px;'
                    + 'transform: translate(50%);'
                    + 'background-color: #555;'
                    + 'overflow: auto;'
                    + 'visibility: hidden;'
                    + '}' +

                    '.icon-bar button{'
                    + 'float: left;'
                    + 'width: 33.33%;'
                    + 'text-align: center;'
                    + 'padding: 12px 0;'
                    + 'color:white;'
                    + 'font-size:10px;'
                    + 'background-color:grey;'
                    + 'border:none;'
                    + 'outline:none;'
                    + 'cursor:pointer;'
                    + '}' +

                    '#temp_inner {'
                    + 'height:calc(100% - 20px);'
                    + 'width:calc(100% - 20px);'
                    + 'margin-bottom: 10px;'
                    + 'margin-top: 10px;'
                    + 'margin-left: 10px;'
                    + 'margin-right: 10px;'
                    + '}' +


                    'svg {'
                    + 'width: 100%;'
                    + 'height: 100%;'
                    + '}' +

                    'path.slice{'
                    + 'stroke-width:2px;'
                    + '}' +

                    'polyline{'
                    + 'opacity: .3;'
                    + 'stroke: black;'
                    + 'stroke-width: 2px;'
                    + 'fill: none;'
                    + '}')

            def create_C3_barChart(icon_path, classid, width, height, positionL, positionT, link, z_Index, bordercolor, barChartBG, barChartBar, data):
                pagehtml.write(
                   '<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">\n\
                    <script rel="import" href="../../js/modify.js"></script>\n\
                    <div drag-resize id = "widget' + classid + '" name = "widget" style="background-color: rgb(34, 59, 115); position: absolute; height:'+height+'%; width:'+width+'%; left:'+positionL+'%; top:'+positionT+'%;">\n\
                    <div id="selected" style="height: 100%;width: 100%;">\n\
                           <div id="chart' + classid + '" ></div>\n\
                       </div>\n\
                       <div id ="overlay'+classid+'" class="overlay"></div>\n\
                    </div>\n\
                   <button id="unlock_' + classid + '" class="btn btn-default btn-sm hidden" style=" position: absolute; top:'+positionT+'%; background-color: #2F4050;z-index:2; left:'+leftWidth+'%;" name="unLockAnElement" onclick="unLockWidget(\'' + classid + '\');" >\n\
                   <span class="fa fa-unlock drag-color" > </span>\n\
                   </button>\n\
                   <button id="activate_' + classid + '" class="btn btn-default btn-sm hidden" style=" position: absolute; top:'+positionT+'%; background-color: #2F4050;z-index:2; left:'+leftWidth+'%;" name="unLockAnElement" onclick="deactivateWidget(\'' + classid + '\');" >\n\
                   <span class="fa fa-times drag-color" > </span>\n\
                   </button>\n\
                    <script src="/static/dirty_static/js/plugins/d3/d3.min.js"></script>\n\
                    <script src="/static/dirty_static/js/plugins/c3/c3.min.js"></script>\n\
                    <link href="/static/dirty_static/js/plugins/c3/c3.css" rel="stylesheet" type="text/css">\n\
                    <script>\n\
                        var screenWidthPercentage = $("#classContainer-selector").width();\n\
                        var screenHeightPercentage = $("#classContainer-selector").height();\n\
                        console.log("Screen with");\n\
                        var wi = (('+width+' * screenWidthPercentage) / 100)-15;\n\
                        var he = ((' + height + ' * screenHeightPercentage)/ 100)-15;\n\
                        var h = Math.round(he);\n\
                        var w = Math.round(wi);\n\
                        var chart = c3.generate({\n\
                        bindto: "#chart' + classid + '",\n\
                        size: {\n\
                        width: w,\n\
                        height: h\n\
                        },\n\
                        data: {\n\
                        columns: [\n\
                        ["data1", 30, 200, 100, 150],\n\
                        ["data2", 20, 10, 15, 25],\n\
                        ["data3", 10, 55, 90, 5]\n\
                        ]\n\
                        }\n\
                        });\n\
                    </script>')

                pagecss.write(
                    '#widget' + classid + '{'
                    + 'height:100%;'
                    + 'width:100%;'
                    + 'position: absolute;'
                    + 'margin: 0;'
                    + 'padding: 0;'
                    + 'background: transparent;'
                    + 'z-index: ' + z_Index + ';'
                    + '}' +

                    '#widget' + classid + 'pro{'
                    + 'height:' + height + '%;'
                    + 'width:80%;'
                    + 'left:' + positionL + '%;'
                    + 'top:' + positionT + '%;'
                    + 'margin: 0;'
                    + 'padding: 0;'
                    + 'background: transparent;'
                    + 'z-index: 1;'
                    + '}' +

                    '#widget' + classid + ':hover {'
                    + 'background-color: rgba(100, 100, 100, 0.3);'
                    + 'border-width: 1px;border-style: dashed;'
                    + 'border-color: rgba(24, 166, 137, 1)'
                    + ';}' +

                    '#widget' + classid + ':hover #overlay{'
                    + 'background-color: rgb(0,0,0,0.53);'
                    + 'z-index: 1;'
                    + '}' +

                    '#temp_inner {'
                    + 'height:calc(100% - 2px);'
                    + 'width:calc(100% - 2px);'
                    + 'margin-bottom: 1px;'
                    + 'margin-top: 1px;'
                    + 'margin-left: 1px;'
                    + 'margin-right: 1px;'
                    + '}'
                )

            def create_C3_barChart_2(icon_path, classid, width, height, positionL, positionT, link, z_Index, bordercolor, barChartBG, barChartBar, data):
                pagehtml.write(
                   '<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">\n\
                    <script rel="import" href="../../js/modify.js"></script>\n\
                    <div drag-resize id="id' + classid + '"class="class' + classid + ' main widget">\n\
                        <div id="chart' + classid + '" style="height:'+height+'%;width:'+width+'%;">\n\
                        </div>\n\
                    </div>\n\
                    <script src="/static/dirty_static/js/plugins/d3/d3.min.js"></script>\n\
                    <script src="/static/dirty_static/js/plugins/c3/c3.min.js"></script>\n\
                    <link href="/static/dirty_static/js/plugins/c3/c3.css" rel="stylesheet" type="text/css">\n\
                    <script>\n\
                        var screenWidthPercentage = $("#classContainer-selector").width();\n\
                        var screenHeightPercentage = $("#classContainer-selector").height();\n\
                        console.log("Screen with");\n\
                        var wi = (('+width+' * screenWidthPercentage) / 100)-15;\n\
                        var he = ((' + height + ' * screenHeightPercentage)/ 100)-15;\n\
                        var h = Math.round(he);\n\
                        var w = Math.round(wi);\n\
                        var chart = c3.generate({\n\
                        bindto: "#chart' + classid + '",\n\
                        size: {\n\
                        width: w,\n\
                        height: h\n\
                        },\n\
                        data: {\n\
                        columns: [\n\
                        ["data1", 30, 200, 100, 150],\n\
                        ["data2", 20, 10, 15, 25],\n\
                        ["data3", 10, 55, 90, 5]\n\
                        ],\n\
                        type: "bar"\n\
                        },\n\
                        bar: {\n\
                            width: {\n\
                                ratio: 0.5\n\
                            }\n\
                        }\n\
                        });\n\
                    </script>')

                pagecss.write(
                    '#id' + classid + '{'
                    + 'position: absolute;'
                    + 'height:' + height + '%;'
                    + 'width:' + width + '%;'
                    + 'left:' + positionL + '%;'
                    + 'top:' + positionT + '%;'
                    + 'margin: 0;'
                    + 'padding: 0;'
                    + 'z-index: ' + z_Index + ';'
                    + 'background: transparent;'
                    + '}' +

                    '#title {'
                    + 'position: absolute;'
                    + 'font-family: monospace;'
                    + 'font-size: 24px;'
                    + 'text-align: center;'
                    + 'height: 100%;'
                    + 'width: 100%;'
                    + 'position: absolute;'
                    + 'visibility: visible;'
                    + '}' +

                    '#cancel_edit {'
                    + 'position:absolute;'
                    + 'height: 30px;'
                    + 'width: 30px;'
                    + 'background-color: grey;'
                    + 'right: -10px;'
                    + 'top: -10px;'
                    + 'visibility: hidden;'
                    + 'z-index: 2;'
                    + '}' +

                    '#cancel_move {'
                    + 'position:absolute;'
                    + 'height: 30px;'
                    + 'width: 30px;'
                    + 'background-color: grey;'
                    + 'right: -10px;'
                    + 'top: -10px;'
                    + 'visibility: hidden;'
                    + 'z-index: 2;'
                    + '}' +

                    '#unlock {'
                    + 'position:absolute;'
                    + 'height: 30px;'
                    + 'width: 30px;'
                    + 'background-color: grey;'
                    + 'right: -10px;'
                    + 'top: -10px;'
                    + 'visibility: hidden;'
                    + 'z-index: 2;'
                    + '}' +

                    '#title:hover .icon-bar{'
                    + 'visibility:visible;'
                    + '}' +

                    '#title:hover{'
                    + 'background-color: rgba(100, 100, 100, 0.3);'
                    + 'border-width: 1px;'
                    + 'border-style: dashed;'
                    + 'border-color: black;'
                    + '}' +

                    '.icon-bar button:hover{'
                    + 'background-color:#000;'
                    + '}' +

                    '.icon-bar{'
                    + 'width: 50%;'
                    + 'height: 34px;'
                    + 'transform: translate(50%);'
                    + 'background-color: #555;'
                    + 'overflow: auto;'
                    + 'visibility: hidden;'
                    + '}' +

                    '.icon-bar button{'
                    + 'float: left;'
                    + 'width: 25%;'
                    + 'text-align: center;'
                    + 'padding: 12px 0;'
                    + 'color:white;'
                    + 'font-size:10px;'
                    + 'background-color:grey;'
                    + 'border:none;'
                    + 'outline:none;'
                    + 'cursor:pointer;'
                    + '}' +

                    '#temp_inner {'
                    + 'height:calc(100% - 2px);'
                    + 'width:calc(100% - 2px);'
                    + 'margin-bottom: 1px;'
                    + 'margin-top: 1px;'
                    + 'margin-left: 1px;'
                    + 'margin-right: 1px;'
                    + '}'
                )

            def create_C3_pieChart_1(icon_path, classid, width, height, positionL, positionT, link,z_Index):
                pagehtml.write(
                   '<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">\n\
                    <script rel="import" href="../../js/modify.js"></script>\n\
                    <div drag-resize id="id' + classid + '"class="class' + classid + ' main widget">\n\
                        <div id="chart' + classid + '" style="height:'+height+'%;width:'+width+'%;">\n\
                        </div>\n\
                    </div>\n\
                    <script src="/static/dirty_static/js/plugins/d3/d3.min.js"></script>\n\
                    <script src="/static/dirty_static/js/plugins/c3/c3.min.js"></script>\n\
                    <link href="/static/dirty_static/js/plugins/c3/c3.css" rel="stylesheet" type="text/css">\n\
                    <script>\n\
                        var screenWidthPercentage = $("#classContainer-selector").width();\n\
                        var screenHeightPercentage = $("#classContainer-selector").height();\n\
                        console.log("Screen with");\n\
                        var wi = (('+width+' * screenWidthPercentage) / 100)-15;\n\
                        var he = ((' + height + ' * screenHeightPercentage)/ 100)-15;\n\
                        var h = Math.round(he);\n\
                        var w = Math.round(wi);\n\
                        var chart = c3.generate({\n\
                        bindto: "#chart' + classid + '",\n\
                        size: {\n\
                        width: w,\n\
                        height: h\n\
                        },\n\
                        data: {\n\
                            columns: [\n\
                                ["setosa", 0.2, 0.2, 0.2, 0.2, 0.2, 0.4, 0.3, 0.2, 0.2, 0.1, 0.2, 0.2, 0.1, 0.1, 0.2, 0.4, 0.4, 0.3, 0.3, 0.3, 0.2, 0.4, 0.2, 0.5, 0.2, 0.2, 0.4, 0.2, 0.2, 0.2, 0.2, 0.4, 0.1, 0.2, 0.2, 0.2, 0.2, 0.1, 0.2, 0.2, 0.3, 0.3, 0.2, 0.6, 0.4, 0.3, 0.2, 0.2, 0.2, 0.2],\n\
                                ["versicolor", 1.4, 1.5, 1.5, 1.3, 1.5, 1.3, 1.6, 1.0, 1.3, 1.4, 1.0, 1.5, 1.0, 1.4, 1.3, 1.4, 1.5, 1.0, 1.5, 1.1, 1.8, 1.3, 1.5, 1.2, 1.3, 1.4, 1.4, 1.7, 1.5, 1.0, 1.1, 1.0, 1.2, 1.6, 1.5, 1.6, 1.5, 1.3, 1.3, 1.3, 1.2, 1.4, 1.2, 1.0, 1.3, 1.2, 1.3, 1.3, 1.1, 1.3],\n\
                                ["virginica", 2.5, 1.9, 2.1, 1.8, 2.2, 2.1, 1.7, 1.8, 1.8, 2.5, 2.0, 1.9, 2.1, 2.0, 2.4, 2.3, 1.8, 2.2, 2.3, 1.5, 2.3, 2.0, 2.0, 1.8, 2.1, 1.8, 1.8, 1.8, 2.1, 1.6, 1.9, 2.0, 2.2, 1.5, 1.4, 2.3, 2.4, 1.8, 1.8, 2.1, 2.4, 2.3, 1.9, 2.3, 2.5, 2.3, 1.9, 2.0, 2.3, 1.8],\n\
                            ],\n\
                            type : "pie",\n\
                            onclick: function (d, i) { console.log("onclick", d, i); },\n\
                            onmouseover: function (d, i) { console.log("onmouseover", d, i); },\n\
                            onmouseout: function (d, i) { console.log("onmouseout", d, i); }\n\
                        }\n\
                        });\n\
                    </script>')

                pagecss.write(
                    '#id' + classid + '{'
                    + 'position: absolute;'
                    + 'height:' + height + '%;'
                    + 'width:' + width + '%;'
                    + 'left:' + positionL + '%;'
                    + 'top:' + positionT + '%;'
                    + 'margin: 0;'
                    + 'padding: 0;'
                    + 'z-index: ' + z_Index + ';'
                    + 'background: transparent;'
                    + '}' +

                    '#title {'
                    + 'position: absolute;'
                    + 'font-family: monospace;'
                    + 'font-size: 24px;'
                    + 'text-align: center;'
                    + 'height: 100%;'
                    + 'width: 100%;'
                    + 'position: absolute;'
                    + 'visibility: visible;'
                    + '}' +

                    '#cancel_edit {'
                    + 'position:absolute;'
                    + 'height: 30px;'
                    + 'width: 30px;'
                    + 'background-color: grey;'
                    + 'right: -10px;'
                    + 'top: -10px;'
                    + 'visibility: hidden;'
                    + 'z-index: 2;'
                    + '}' +

                    '#cancel_move {'
                    + 'position:absolute;'
                    + 'height: 30px;'
                    + 'width: 30px;'
                    + 'background-color: grey;'
                    + 'right: -10px;'
                    + 'top: -10px;'
                    + 'visibility: hidden;'
                    + 'z-index: 2;'
                    + '}' +

                    '#unlock {'
                    + 'position:absolute;'
                    + 'height: 30px;'
                    + 'width: 30px;'
                    + 'background-color: grey;'
                    + 'right: -10px;'
                    + 'top: -10px;'
                    + 'visibility: hidden;'
                    + 'z-index: 2;'
                    + '}' +

                    '#title:hover .icon-bar{'
                    + 'visibility:visible;'
                    + '}' +

                    '#title:hover{'
                    + 'background-color: rgba(100, 100, 100, 0.3);'
                    + 'border-width: 1px;'
                    + 'border-style: dashed;'
                    + 'border-color: black;'
                    + '}' +

                    '.icon-bar button:hover{'
                    + 'background-color:#000;'
                    + '}' +

                    '.icon-bar{'
                    + 'width: 50%;'
                    + 'height: 34px;'
                    + 'transform: translate(50%);'
                    + 'background-color: #555;'
                    + 'overflow: auto;'
                    + 'visibility: hidden;'
                    + '}' +

                    '.icon-bar button{'
                    + 'float: left;'
                    + 'width: 25%;'
                    + 'text-align: center;'
                    + 'padding: 12px 0;'
                    + 'color:white;'
                    + 'font-size:10px;'
                    + 'background-color:grey;'
                    + 'border:none;'
                    + 'outline:none;'
                    + 'cursor:pointer;'
                    + '}' +

                    '#temp_inner {'
                    + 'height:calc(100% - 2px);'
                    + 'width:calc(100% - 2px);'
                    + 'margin-bottom: 1px;'
                    + 'margin-top: 1px;'
                    + 'margin-left: 1px;'
                    + 'margin-right: 1px;'
                    + '}'
                )

            def create_C3_pieChart_4(icon_path, classid, width, height, positionL, positionT, link,z_Index):
                pagehtml.write(
                   '<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">\n\
                    <script rel="import" href="../../js/modify.js"></script>\n\
                    <div drag-resize id="id' + classid + '"class="class' + classid + ' main widget">\n\
                        <div id="chart' + classid + '" style="height:'+height+'%;width:'+width+'%;">\n\
                        </div>\n\
                    </div>\n\
                    <script src="/static/dirty_static/js/plugins/d3/d3.min.js"></script>\n\
                    <script src="/static/dirty_static/js/plugins/c3/c3.min.js"></script>\n\
                    <link href="/static/dirty_static/js/plugins/c3/c3.css" rel="stylesheet" type="text/css">\n\
                    <script>\n\
                        var screenWidthPercentage = $("#classContainer-selector").width();\n\
                        var screenHeightPercentage = $("#classContainer-selector").height();\n\
                        console.log("Screen with");\n\
                        var wi = (('+width+' * screenWidthPercentage) / 100)-15;\n\
                        var he = ((' + height + ' * screenHeightPercentage)/ 100)-15;\n\
                        var h = Math.round(he);\n\
                        var w = Math.round(wi);\n\
                        var chart = c3.generate({\n\
                        bindto: "#chart' + classid + '",\n\
                        size: {\n\
                        width: w,\n\
                        height: h\n\
                        },\n\
                        data: {\n\
                            columns: [\n\
                                ["setosa", 0.2, 0.2, 0.2, 0.2, 0.2, 0.4, 0.3, 0.2, 0.2, 0.1, 0.2, 0.2, 0.1, 0.1, 0.2, 0.4, 0.4, 0.3, 0.3, 0.3, 0.2, 0.4, 0.2, 0.5, 0.2, 0.2, 0.4, 0.2, 0.2, 0.2, 0.2, 0.4, 0.1, 0.2, 0.2, 0.2, 0.2, 0.1, 0.2, 0.2, 0.3, 0.3, 0.2, 0.6, 0.4, 0.3, 0.2, 0.2, 0.2, 0.2],\n\
                                ["versicolor", 1.4, 1.5, 1.5, 1.3, 1.5, 1.3, 1.6, 1.0, 1.3, 1.4, 1.0, 1.5, 1.0, 1.4, 1.3, 1.4, 1.5, 1.0, 1.5, 1.1, 1.8, 1.3, 1.5, 1.2, 1.3, 1.4, 1.4, 1.7, 1.5, 1.0, 1.1, 1.0, 1.2, 1.6, 1.5, 1.6, 1.5, 1.3, 1.3, 1.3, 1.2, 1.4, 1.2, 1.0, 1.3, 1.2, 1.3, 1.3, 1.1, 1.3],\n\
                                ["virginica", 2.5, 1.9, 2.1, 1.8, 2.2, 2.1, 1.7, 1.8, 1.8, 2.5, 2.0, 1.9, 2.1, 2.0, 2.4, 2.3, 1.8, 2.2, 2.3, 1.5, 2.3, 2.0, 2.0, 1.8, 2.1, 1.8, 1.8, 1.8, 2.1, 1.6, 1.9, 2.0, 2.2, 1.5, 1.4, 2.3, 2.4, 1.8, 1.8, 2.1, 2.4, 2.3, 1.9, 2.3, 2.5, 2.3, 1.9, 2.0, 2.3, 1.8],\n\
                            ],\n\
                            type : "donut",\n\
                            onclick: function (d, i) { console.log("onclick", d, i); },\n\
                            onmouseover: function (d, i) { console.log("onmouseover", d, i); },\n\
                            onmouseout: function (d, i) { console.log("onmouseout", d, i); }\n\
                        },\n\
                        donut: {\n\
                            title: "Iris"\n\
                         }\n\
                        });\n\
                    </script>')

                pagecss.write(
                    '#id' + classid + '{'
                    + 'position: absolute;'
                    + 'height:' + height + '%;'
                    + 'width:' + width + '%;'
                    + 'left:' + positionL + '%;'
                    + 'top:' + positionT + '%;'
                    + 'margin: 0;'
                    + 'padding: 0;'
                    + 'z-index: ' + z_Index + ';'
                    + 'background: transparent;'
                    + '}' +

                    '#title {'
                    + 'position: absolute;'
                    + 'font-family: monospace;'
                    + 'font-size: 24px;'
                    + 'text-align: center;'
                    + 'height: 100%;'
                    + 'width: 100%;'
                    + 'position: absolute;'
                    + 'visibility: visible;'
                    + '}' +

                    '#cancel_edit {'
                    + 'position:absolute;'
                    + 'height: 30px;'
                    + 'width: 30px;'
                    + 'background-color: grey;'
                    + 'right: -10px;'
                    + 'top: -10px;'
                    + 'visibility: hidden;'
                    + 'z-index: 2;'
                    + '}' +

                    '#cancel_move {'
                    + 'position:absolute;'
                    + 'height: 30px;'
                    + 'width: 30px;'
                    + 'background-color: grey;'
                    + 'right: -10px;'
                    + 'top: -10px;'
                    + 'visibility: hidden;'
                    + 'z-index: 2;'
                    + '}' +

                    '#unlock {'
                    + 'position:absolute;'
                    + 'height: 30px;'
                    + 'width: 30px;'
                    + 'background-color: grey;'
                    + 'right: -10px;'
                    + 'top: -10px;'
                    + 'visibility: hidden;'
                    + 'z-index: 2;'
                    + '}' +

                    '#title:hover .icon-bar{'
                    + 'visibility:visible;'
                    + '}' +

                    '#title:hover{'
                    + 'background-color: rgba(100, 100, 100, 0.3);'
                    + 'border-width: 1px;'
                    + 'border-style: dashed;'
                    + 'border-color: black;'
                    + '}' +

                    '.icon-bar button:hover{'
                    + 'background-color:#000;'
                    + '}' +

                    '.icon-bar{'
                    + 'width: 50%;'
                    + 'height: 34px;'
                    + 'transform: translate(50%);'
                    + 'background-color: #555;'
                    + 'overflow: auto;'
                    + 'visibility: hidden;'
                    + '}' +

                    '.icon-bar button{'
                    + 'float: left;'
                    + 'width: 25%;'
                    + 'text-align: center;'
                    + 'padding: 12px 0;'
                    + 'color:white;'
                    + 'font-size:10px;'
                    + 'background-color:grey;'
                    + 'border:none;'
                    + 'outline:none;'
                    + 'cursor:pointer;'
                    + '}' +

                    '#temp_inner {'
                    + 'height:calc(100% - 2px);'
                    + 'width:calc(100% - 2px);'
                    + 'margin-bottom: 1px;'
                    + 'margin-top: 1px;'
                    + 'margin-left: 1px;'
                    + 'margin-right: 1px;'
                    + '}'
                )

            #### OLD WIDGETS

            def create_calendarPro2(icon_path, classid, width, height, positionL, positionT, link):
                pagehtml.write(
                    '<div drag resize  class="class' + str(classid) + '" id="id' + classid + '">\n\
                    <script src ="//cdnjs.cloudflare.com/ajax/libs/moment.js/2.5.1/moment.min.js"></script>\n\
                    <script>\n\
                    !function() {\n\
                        var today = moment();\n\
                        function Calendar(selector, events){\n\
                            this.el = document.querySelector(selector);\n\
                            this.events = events;\n\
                            this.current = moment().date(1);\n\
                            this.draw();\n\
                            var current = document.querySelector(\'.today\');\n\
                            if (current) {\n\
                                var self = this;\n\
                                window.setTimeout(function() {\n\
                                  self.openDay(current);\n\
                                }, 500);\n\
                            };\n\
                        };\n\
                        Calendar.prototype.draw = function(){\n\
                            this.drawHeader();\n\
                            this.drawMonth();\n\
                            this.drawLegend();\n\
                        };\n\
                        Calendar.prototype.drawHeader = function(){\n\
                            var self = this;\n\
                            if (!this.header) {\n\
                               this.header = createElement(".class' + classid + '", \'header\');\n\
                               this.header.className = \'header\';\n\
                               this.title = createElement(\'h1\');\n\
                               var right = createElement(".class' + classid + '", \'right\');\n\
                               right.addEventListener(\'click\', function() {self.nextMonth();});\n\
                               var left = createElement(".class' + classid + '", \'left\');\n\
                               left.addEventListener(\'click\', function() {self.prevMonth();});\n\
                               this.header.appendChild(this.title);\n\
                               this.header.appendChild(right);\n\
                               this.header.appendChild(left);\n\
                               this.el.appendChild(this.header);\n\
                            };\n\
                            this.title.innerHTML = this.current.format(\'MMMM YYYY\');\n\
                        };\n\
                        Calendar.prototype.drawMonth = function(){\n\
                            var self = this;\n\
                            this.events.forEach(function(ev){\n\
                                ev.date = self.current.clone().date(Math.random() * (29 - 1) + 1);\n\
                            });\n\
                            if (this.month) {\n\
                              this.oldMonth = this.month;\n\
                              this.oldMonth.className = \'month out\' + (self.next ? \'next\': \'prev\');\n\
                              this.oldMonth.addEventListener(\'webkitAnimationEnd\', function(){\n\
                                self.oldMonth.parentNode.removeChild(self.oldMonth);\n\
                                self.month = createElement(".class' + classid + '", \'month\');\n\
                                self.backFill();\n\
                                self.currentMonth();\n\
                                self.fowardFill();\n\
                                self.el.appendChild(self.month);\n\
                                window.setTimeout(function(){\n\
                                   self.month.className = \'month in \' + (self.next ? \'next\': \'prev\');\n\
                                }, 16);\n\
                              });\n\
                            }else{\n\
                              this.month = createElement(".class' + classid + '", \'month\');\n\
                              this.el.appendChild(this.month);\n\
                              this.backFill();\n\
                              this.currentMonth();\n\
                              this.fowardFill();\n\
                              this.month.className = \'month new\';\n\
                            };\n\
                        };\n\
                        Calendar.prototype.backFill = function() {\n\
                            var clone = this.current.clone();\n\
                            var dayOfWeek = clone.day();\n\
                            if (!dayOfWeek) {return;};\n\
                            clone.subtract(\'days\', dayOfWeek + 1);\n\
                            for (var i = dayOfWeek; i > 0; i--) {\n\
                              this.drawDay(clone.add(\'days\', 1));\n\
                            }\n\
                        }\n\
                        Calendar.prototype.fowardFill = function() {\n\
                            var clone = this.current.clone().add(\'months\', 1).subtract(\'days\', 1);\n\
                            var dayOfWeek = clone.day();\n\
                            if (dayOfWeek === 6) {return;};\n\
                            for (var i = dayOfWeek; i < 6; i++) {\n\
                              this.drawDay(clone.add(\'days\', 1));\n\
                            };\n\
                        };\n\
                        Calendar.prototype.currentMonth = function() {\n\
                            var clone = this.current.clone();\n\
                            while (clone.month() === this.current.month()) {\n\
                                this.drawDay(clone);\n\
                                clone.add(\'days\', 1);\n\
                            };\n\
                        };\n\
                        Calendar.prototype.getWeek = function(day) {\n\
                            if (!this.week || day.day() === 0) {\n\
                               this.week = createElement("div", \'week\');\n\
                               this.month.appendChild(this.week);\n\
                            };\n\
                        };\n\
                        Calendar.prototype.drawDay = function(day) {\n\
                            var self = this;\n\
                            this.getWeek(day);\n\
                            var outer = createElement(".class' + classid + '", this.getDayClass(day));\n\
                            outer.addEventListener(\'click\', function(){\n\
                                  self.openDay(this);\n\
                            });\n\
                            var name = createElement(".class' + classid + '", \'day-name\', day.format(\'ddd\'));\n\
                            var number = createElement(".class' + classid + '", \'day-number\', day.format(\'DD\'));\n\
                            var events = createElement(".class' + classid + '", \'day-events\');\n\
                            this.drawEvents(day, events);\n\
                            outer.appendChild(name);\n\
                            outer.appendChild(number);\n\
                            outer.appendChild(events);\n\
                            this.week.appendChild(outer);\n\
                        };\n\
                        Calendar.prototype.drawEvents = function(day, element) {\n\
                            if (day.month() === this.current.month()) {\n\
                               var todaysEvents = this.events.reduce(function(memo, ev){\n\
                                  if (ev.date.isSame(day, \'day\')){\n\
                                        memo.push(ev);\n\
                                  };\n\
                                  return memo;\n\
                               },[]);\n\
                               todaysEvents.forEach(function(ev){\n\
                                  var evSpan = createElement(\'span\', ev.color);\n\
                                  element.appendChild(evSpan);\n\
                               });\n\
                            };\n\
                        };\n\
                        Calendar.prototype.getDayClass = function(day) {\n\
                            classes = [\'day\'];\n\
                            if (day.month() !== this.current.month()) {\n\
                                classes.push(\'other\');\n\
                            } else if (today.isSame(day, \'day\')) {\n\
                                 classes.push(\'today\');\n\
                            }\n\
                            return classes.join(' ');\n\
                        }\n\
                        Calendar.prototype.openDay = function(el) {\n\
                            var details, arrow;\n\
                            var dayNumber = +el.querySelectorAll(\'.day-number\')[0].innerText || +el.querySelectorAll(\'.day-number\')[0].textContent;\n\
                            var day = this.current.clone().date(dayNumber);\n\
                            var currentOpened = document.querySelector(\'.details\');\n\
                            if (currentOpened && currentOpened.parentNode === el.parentNode) {\n\
                                details = currentOpened;\n\
                                arrow = document.querySelector(\'.arrow\');\n\
                            }else {\n\
                                 if (currentOpened) {\n\
                                   currentOpened.addEventListener(\'webkitAnimationEnd\', function() {\n\
                                     currentOpened.parentNode.removeChild(currentOpened);\n\
                                   });\n\
                                   currentOpened.addEventListener(\'oanimationend\', function() {\n\
                                     currentOpened.parentNode.removeChild(currentOpened);\n\
                                   });\n\
                                   currentOpened.addEventListener(\'msAnimationEnd\', function() {\n\
                                     currentOpened.parentNode.removeChild(currentOpened);\n\
                                   });\n\
                                   currentOpened.addEventListener(\'animationend\', function() {\n\
                                     currentOpened.parentNode.removeChild(currentOpened);\n\
                                   });\n\
                                   currentOpened.className = \'details out\';\n\
                                 };\n\
                                 details = createElement(".class' + classid + '", \'details in\');\n\
                                 var arrow = createElement(".class' + classid + '", \'arrow\');\n\
                                 details.appendChild(arrow);\n\
                                 el.parentNode.appendChild(details);\n\
                            };\n\
                            var todaysEvents = this.events.reduce(function(memo, ev) {\n\
                                 if (ev.date.isSame(day, \'day\')) {\n\
                                     memo.push(ev);\n\
                                 }\n\
                                 return memo;\n\
                            }, []);\n\
                            this.renderEvents(todaysEvents, details);\n\
                            arrow.style.left = el.offsetLeft - el.parentNode.offsetLeft + 27 + \'px\';\n\
                        };\n\
                        Calendar.prototype.renderEvents = function(events, ele) {\n\
                            var currentWrapper = ele.querySelector(\'.events\');\n\
                            var wrapper = createElement("div", \'events in\' + (currentWrapper ? \' new\': \'\'));\n\
                            events.forEach(function(ev){\n\
                                var div = createElement(".class' + classid + '", \'event\');\n\
                                var square = createElement(".class' + classid + '", \'event-category \' + ev.color);\n\
                                var span = createElement(\'span\', \'\', ev.eventName);\n\
                                div.appendChild(square);\n\
                                div.appendChild(span);\n\
                                wrapper.appendChild(div);\n\
                            });\n\
                            if (!events.length) {\n\
                               var div = createElement(".class' + classid + '", \'event empty\');\n\
                               var span = createElement(\'span\', \'\', \'No Events\');\n\
                               div.appendChild(span);\n\
                               wrapper.appendChild(div);\n\
                            };\n\
                            if (currentWrapper) {\n\
                               currentWrapper.className = \'events out\';\n\
                               currentWrapper.addEventListener(\'webkitAnimationEnd\', function() {\n\
                                 currentWrapper.parentNode.removeChild(currentWrapper);\n\
                                 ele.appendChild(wrapper);\n\
                               });\n\
                               currentWrapper.addEventListener(\'oanimationend\', function() {\n\
                                 currentWrapper.parentNode.removeChild(currentWrapper);\n\
                                 ele.appendChild(wrapper);\n\
                               });\n\
                               currentWrapper.addEventListener(\'msAnimationEnd\', function() {\n\
                                 currentWrapper.parentNode.removeChild(currentWrapper);\n\
                                 ele.appendChild(wrapper);\n\
                               });\n\
                               currentWrapper.addEventListener(\'animationend\', function() {\n\
                                 currentWrapper.parentNode.removeChild(currentWrapper);\n\
                                 ele.appendChild(wrapper);\n\
                               });\n\
                            } else {\n\
                                 ele.appendChild(wrapper);\n\
                            };\n\
                        };\n\
                        Calendar.prototype.drawLegend = function(){\n\
                            var legend = createElement(".class' + classid + '", \'legend\');\n\
                            var calendars = this.events.map(function(e){\n\
                                return e.calendar + \'|\' + e.color;\n\
                            }).reduce(function(memo, e){\n\
                                if (memo.indexOf(e) === -1) {\n\
                                    memo.push(e);\n\
                                };\n\
                                return memo;\n\
                            },[]).forEach(function(e){\n\
                                var parts = e.split(\'|\');\n\
                                var entry = createElement(\'span\', \'entry \' + parts[1], parts[0]);\n\
                                legend.appendChild(entry);\n\
                            });\n\
                            this.el.appendChild(legend);\n\
                        };\n\
                        Calendar.prototype.nextMonth = function() {\n\
                            this.current.add(\'months\', 1);\n\
                            this.next = true;\n\
                            this.draw();\n\
                        };\n\
                        Calendar.prototype.prevMonth = function(){\n\
                            this.current.subtract(\'months\', 1);\n\
                            this.next = false;\n\
                            this.draw();\n\
                        };\n\
                        window.Calendar = Calendar;\n\
                        function createElement(tagName, className, innerText){\n\
                            var ele = document.createElement("tagName");\n\
                            if (className) {\n\
                                ele.className = className;\n\
                            };\n\
                            if (innerText) {\n\
                                ele.innderText = ele.textContent = innerText;\n\
                            };\n\
                            return ele;\n\
                        }\n\
                    }();\n\
                    !function() {\n\
                        var data = [\n\
                            {eventName: "Lunch Meeting w/ Mark", calendar: "Work", color: "orange"},\n\
                            {eventName: "Interview - Jr. Web Developer", calendar: "Work", color: "orange"},\n\
                            {eventName: "Demo New App to the Board", calendar: "Work", color: "orange"},\n\
                            {eventName: "Dinner w/ Marketing", calendar: "Work", color: "orange"},\n\
                            {eventName: "Game vs Portalnd", calendar: "Sports", color: "blue"},\n\
                            {eventName: "Game vs Houston", calendar: "Sports", color: "blue"},\n\
                            {eventName: "Game vs Denver", calendar: "Sports", color: "blue"},\n\
                            {eventName: "Game vs San Degio", calendar: "Sports", color:"blue"},\n\
                            {eventName: "School Play", calendar: "Kids", color: "yellow"},\n\
                            {eventName: "Parent/Teacher Conference", calendar: "Kids", color: "yellow"},\n\
                            {eventName: "Pick up from Soccer Practice", calendar: "Kids", color: "yellow"},\n\
                            {eventName: "Ice Cream Night", calendar: "Kids", color: "yellow"},\n\
                            {eventName: "Free Tamale Night", calendar: "Other", color: "green"},\n\
                            {eventName: "Bowling Team", calendar: "Other", color: "green"},\n\
                            {eventName: "Teach Kids to Code", calendar: "Other", color: "green"},\n\
                            {eventName: "Startup Weekend", calendar: "Other", color: "green"}];\n\
                        function addDate(ev){};\n\
                        var calendar = new Calendar(".class' + classid + '", data);\n\
                        var chartDiv = document.getElementById("id' + classid + '");\n\
                        var widthX = chartDiv.clientWidth;\n\
                        var heightX = chartDiv.clientHeight;\n\
                        calendar.Calendar("option", "width","chartDiv.clientWidth");\n\
                        calendar.Calendar("option", "height","chartDiv.clientHeight");\n\
                    }();\n\
                    </script>\n\
                </div>')
                pagehtml1.write(
                    '<div drag resize  class="class' + str(classid) + '" id="id' + classid + 'pro">\n\
                                <script src ="//cdnjs.cloudflare.com/ajax/libs/moment.js/2.5.1/moment.min.js"></script>\n\
                                <script>\n\
                                !function() {\n\
                                    var today = moment();\n\
                                    function Calendar(selector, events){\n\
                                        this.el = document.querySelector(selector);\n\
                                        this.events = events;\n\
                                        this.current = moment().date(1);\n\
                                        this.draw();\n\
                                        var current = document.querySelector(\'.today\');\n\
                                        if (current) {\n\
                                            var self = this;\n\
                                            window.setTimeout(function() {\n\
                                              self.openDay(current);\n\
                                            }, 500);\n\
                                        };\n\
                                    };\n\
                                    Calendar.prototype.draw = function(){\n\
                                        this.drawHeader();\n\
                                        this.drawMonth();\n\
                                        this.drawLegend();\n\
                                    };\n\
                                    Calendar.prototype.drawHeader = function(){\n\
                                        var self = this;\n\
                                        if (!this.header) {\n\
                                           this.header = createElement(".class' + classid + '", \'header\');\n\
                                           this.header.className = \'header\';\n\
                                           this.title = createElement(\'h1\');\n\
                                           var right = createElement(".class' + classid + '", \'right\');\n\
                                           right.addEventListener(\'click\', function() {self.nextMonth();});\n\
                                           var left = createElement(".class' + classid + '", \'left\');\n\
                                           left.addEventListener(\'click\', function() {self.prevMonth();});\n\
                                           this.header.appendChild(this.title);\n\
                                           this.header.appendChild(right);\n\
                                           this.header.appendChild(left);\n\
                                           this.el.appendChild(this.header);\n\
                                        };\n\
                                        this.title.innerHTML = this.current.format(\'MMMM YYYY\');\n\
                                    };\n\
                                    Calendar.prototype.drawMonth = function(){\n\
                                        var self = this;\n\
                                        this.events.forEach(function(ev){\n\
                                            ev.date = self.current.clone().date(Math.random() * (29 - 1) + 1);\n\
                                        });\n\
                                        if (this.month) {\n\
                                          this.oldMonth = this.month;\n\
                                          this.oldMonth.className = \'month out\' + (self.next ? \'next\': \'prev\');\n\
                                          this.oldMonth.addEventListener(\'webkitAnimationEnd\', function(){\n\
                                            self.oldMonth.parentNode.removeChild(self.oldMonth);\n\
                                            self.month = createElement(".class' + classid + '", \'month\');\n\
                                            self.backFill();\n\
                                            self.currentMonth();\n\
                                            self.fowardFill();\n\
                                            self.el.appendChild(self.month);\n\
                                            window.setTimeout(function(){\n\
                                               self.month.className = \'month in \' + (self.next ? \'next\': \'prev\');\n\
                                            }, 16);\n\
                                          });\n\
                                        }else{\n\
                                          this.month = createElement(".class' + classid + '", \'month\');\n\
                                          this.el.appendChild(this.month);\n\
                                          this.backFill();\n\
                                          this.currentMonth();\n\
                                          this.fowardFill();\n\
                                          this.month.className = \'month new\';\n\
                                        };\n\
                                    };\n\
                                    Calendar.prototype.backFill = function() {\n\
                                        var clone = this.current.clone();\n\
                                        var dayOfWeek = clone.day();\n\
                                        if (!dayOfWeek) {return;};\n\
                                        clone.subtract(\'days\', dayOfWeek + 1);\n\
                                        for (var i = dayOfWeek; i > 0; i--) {\n\
                                          this.drawDay(clone.add(\'days\', 1));\n\
                                        }\n\
                                    }\n\
                                    Calendar.prototype.fowardFill = function() {\n\
                                        var clone = this.current.clone().add(\'months\', 1).subtract(\'days\', 1);\n\
                                        var dayOfWeek = clone.day();\n\
                                        if (dayOfWeek === 6) {return;};\n\
                                        for (var i = dayOfWeek; i < 6; i++) {\n\
                                          this.drawDay(clone.add(\'days\', 1));\n\
                                        };\n\
                                    };\n\
                                    Calendar.prototype.currentMonth = function() {\n\
                                        var clone = this.current.clone();\n\
                                        while (clone.month() === this.current.month()) {\n\
                                            this.drawDay(clone);\n\
                                            clone.add(\'days\', 1);\n\
                                        };\n\
                                    };\n\
                                    Calendar.prototype.getWeek = function(day) {\n\
                                        if (!this.week || day.day() === 0) {\n\
                                           this.week = createElement("div", \'week\');\n\
                                           this.month.appendChild(this.week);\n\
                                        };\n\
                                    };\n\
                                    Calendar.prototype.drawDay = function(day) {\n\
                                        var self = this;\n\
                                        this.getWeek(day);\n\
                                        var outer = createElement(".class' + classid + '", this.getDayClass(day));\n\
                                        outer.addEventListener(\'click\', function(){\n\
                                              self.openDay(this);\n\
                                        });\n\
                                        var name = createElement(".class' + classid + '", \'day-name\', day.format(\'ddd\'));\n\
                                        var number = createElement(".class' + classid + '", \'day-number\', day.format(\'DD\'));\n\
                                        var events = createElement(".class' + classid + '", \'day-events\');\n\
                                        this.drawEvents(day, events);\n\
                                        outer.appendChild(name);\n\
                                        outer.appendChild(number);\n\
                                        outer.appendChild(events);\n\
                                        this.week.appendChild(outer);\n\
                                    };\n\
                                    Calendar.prototype.drawEvents = function(day, element) {\n\
                                        if (day.month() === this.current.month()) {\n\
                                           var todaysEvents = this.events.reduce(function(memo, ev){\n\
                                              if (ev.date.isSame(day, \'day\')){\n\
                                                    memo.push(ev);\n\
                                              };\n\
                                              return memo;\n\
                                           },[]);\n\
                                           todaysEvents.forEach(function(ev){\n\
                                              var evSpan = createElement(\'span\', ev.color);\n\
                                              element.appendChild(evSpan);\n\
                                           });\n\
                                        };\n\
                                    };\n\
                                    Calendar.prototype.getDayClass = function(day) {\n\
                                        classes = [\'day\'];\n\
                                        if (day.month() !== this.current.month()) {\n\
                                            classes.push(\'other\');\n\
                                        } else if (today.isSame(day, \'day\')) {\n\
                                             classes.push(\'today\');\n\
                                        }\n\
                                        return classes.join(' ');\n\
                                    }\n\
                                    Calendar.prototype.openDay = function(el) {\n\
                                        var details, arrow;\n\
                                        var dayNumber = +el.querySelectorAll(\'.day-number\')[0].innerText || +el.querySelectorAll(\'.day-number\')[0].textContent;\n\
                                        var day = this.current.clone().date(dayNumber);\n\
                                        var currentOpened = document.querySelector(\'.details\');\n\
                                        if (currentOpened && currentOpened.parentNode === el.parentNode) {\n\
                                            details = currentOpened;\n\
                                            arrow = document.querySelector(\'.arrow\');\n\
                                        }else {\n\
                                             if (currentOpened) {\n\
                                               currentOpened.addEventListener(\'webkitAnimationEnd\', function() {\n\
                                                 currentOpened.parentNode.removeChild(currentOpened);\n\
                                               });\n\
                                               currentOpened.addEventListener(\'oanimationend\', function() {\n\
                                                 currentOpened.parentNode.removeChild(currentOpened);\n\
                                               });\n\
                                               currentOpened.addEventListener(\'msAnimationEnd\', function() {\n\
                                                 currentOpened.parentNode.removeChild(currentOpened);\n\
                                               });\n\
                                               currentOpened.addEventListener(\'animationend\', function() {\n\
                                                 currentOpened.parentNode.removeChild(currentOpened);\n\
                                               });\n\
                                               currentOpened.className = \'details out\';\n\
                                             };\n\
                                             details = createElement(".class' + classid + '", \'details in\');\n\
                                             var arrow = createElement(".class' + classid + '", \'arrow\');\n\
                                             details.appendChild(arrow);\n\
                                             el.parentNode.appendChild(details);\n\
                                        };\n\
                                        var todaysEvents = this.events.reduce(function(memo, ev) {\n\
                                             if (ev.date.isSame(day, \'day\')) {\n\
                                                 memo.push(ev);\n\
                                             }\n\
                                             return memo;\n\
                                        }, []);\n\
                                        this.renderEvents(todaysEvents, details);\n\
                                        arrow.style.left = el.offsetLeft - el.parentNode.offsetLeft + 27 + \'px\';\n\
                                    };\n\
                                    Calendar.prototype.renderEvents = function(events, ele) {\n\
                                        var currentWrapper = ele.querySelector(\'.events\');\n\
                                        var wrapper = createElement("div", \'events in\' + (currentWrapper ? \' new\': \'\'));\n\
                                        events.forEach(function(ev){\n\
                                            var div = createElement(".class' + classid + '", \'event\');\n\
                                            var square = createElement(".class' + classid + '", \'event-category \' + ev.color);\n\
                                            var span = createElement(\'span\', \'\', ev.eventName);\n\
                                            div.appendChild(square);\n\
                                            div.appendChild(span);\n\
                                            wrapper.appendChild(div);\n\
                                        });\n\
                                        if (!events.length) {\n\
                                           var div = createElement(".class' + classid + '", \'event empty\');\n\
                                           var span = createElement(\'span\', \'\', \'No Events\');\n\
                                           div.appendChild(span);\n\
                                           wrapper.appendChild(div);\n\
                                        };\n\
                                        if (currentWrapper) {\n\
                                           currentWrapper.className = \'events out\';\n\
                                           currentWrapper.addEventListener(\'webkitAnimationEnd\', function() {\n\
                                             currentWrapper.parentNode.removeChild(currentWrapper);\n\
                                             ele.appendChild(wrapper);\n\
                                           });\n\
                                           currentWrapper.addEventListener(\'oanimationend\', function() {\n\
                                             currentWrapper.parentNode.removeChild(currentWrapper);\n\
                                             ele.appendChild(wrapper);\n\
                                           });\n\
                                           currentWrapper.addEventListener(\'msAnimationEnd\', function() {\n\
                                             currentWrapper.parentNode.removeChild(currentWrapper);\n\
                                             ele.appendChild(wrapper);\n\
                                           });\n\
                                           currentWrapper.addEventListener(\'animationend\', function() {\n\
                                             currentWrapper.parentNode.removeChild(currentWrapper);\n\
                                             ele.appendChild(wrapper);\n\
                                           });\n\
                                        } else {\n\
                                             ele.appendChild(wrapper);\n\
                                        };\n\
                                    };\n\
                                    Calendar.prototype.drawLegend = function(){\n\
                                        var legend = createElement(".class' + classid + '", \'legend\');\n\
                                        var calendars = this.events.map(function(e){\n\
                                            return e.calendar + \'|\' + e.color;\n\
                                        }).reduce(function(memo, e){\n\
                                            if (memo.indexOf(e) === -1) {\n\
                                                memo.push(e);\n\
                                            };\n\
                                            return memo;\n\
                                        },[]).forEach(function(e){\n\
                                            var parts = e.split(\'|\');\n\
                                            var entry = createElement(\'span\', \'entry \' + parts[1], parts[0]);\n\
                                            legend.appendChild(entry);\n\
                                        });\n\
                                        this.el.appendChild(legend);\n\
                                    };\n\
                                    Calendar.prototype.nextMonth = function() {\n\
                                        this.current.add(\'months\', 1);\n\
                                        this.next = true;\n\
                                        this.draw();\n\
                                    };\n\
                                    Calendar.prototype.prevMonth = function(){\n\
                                        this.current.subtract(\'months\', 1);\n\
                                        this.next = false;\n\
                                        this.draw();\n\
                                    };\n\
                                    window.Calendar = Calendar;\n\
                                    function createElement(tagName, className, innerText){\n\
                                        var ele = document.createElement("tagName");\n\
                                        if (className) {\n\
                                            ele.className = className;\n\
                                        };\n\
                                        if (innerText) {\n\
                                            ele.innderText = ele.textContent = innerText;\n\
                                        };\n\
                                        return ele;\n\
                                    }\n\
                                }();\n\
                                !function() {\n\
                                    var data = [\n\
                                        {eventName: "Lunch Meeting w/ Mark", calendar: "Work", color: "orange"},\n\
                                        {eventName: "Interview - Jr. Web Developer", calendar: "Work", color: "orange"},\n\
                                        {eventName: "Demo New App to the Board", calendar: "Work", color: "orange"},\n\
                                        {eventName: "Dinner w/ Marketing", calendar: "Work", color: "orange"},\n\
                                        {eventName: "Game vs Portalnd", calendar: "Sports", color: "blue"},\n\
                                        {eventName: "Game vs Houston", calendar: "Sports", color: "blue"},\n\
                                        {eventName: "Game vs Denver", calendar: "Sports", color: "blue"},\n\
                                        {eventName: "Game vs San Degio", calendar: "Sports", color:"blue"},\n\
                                        {eventName: "School Play", calendar: "Kids", color: "yellow"},\n\
                                        {eventName: "Parent/Teacher Conference", calendar: "Kids", color: "yellow"},\n\
                                        {eventName: "Pick up from Soccer Practice", calendar: "Kids", color: "yellow"},\n\
                                        {eventName: "Ice Cream Night", calendar: "Kids", color: "yellow"},\n\
                                        {eventName: "Free Tamale Night", calendar: "Other", color: "green"},\n\
                                        {eventName: "Bowling Team", calendar: "Other", color: "green"},\n\
                                        {eventName: "Teach Kids to Code", calendar: "Other", color: "green"},\n\
                                        {eventName: "Startup Weekend", calendar: "Other", color: "green"}];\n\
                                    function addDate(ev){};\n\
                                    var calendar = new Calendar(".class' + classid + '", data);\n\
                                    var chartDiv = document.getElementById("id' + classid + '");\n\
                                    var widthX = chartDiv.clientWidth;\n\
                                    var heightX = chartDiv.clientHeight;\n\
                                    calendar.Calendar("option", "width","chartDiv.clientWidth");\n\
                                    calendar.Calendar("option", "height","chartDiv.clientHeight");\n\
                                }();\n\
                                </script>\n\
                            </div>')
                pagehtml2.write(
                    '<div drag resize  class="class' + str(classid) + '" id="id' + classid + 'work">\n\
                                            <script src ="//cdnjs.cloudflare.com/ajax/libs/moment.js/2.5.1/moment.min.js"></script>\n\
                                            <script>\n\
                                            !function() {\n\
                                                var today = moment();\n\
                                                function Calendar(selector, events){\n\
                                                    this.el = document.querySelector(selector);\n\
                                                    this.events = events;\n\
                                                    this.current = moment().date(1);\n\
                                                    this.draw();\n\
                                                    var current = document.querySelector(\'.today\');\n\
                                                    if (current) {\n\
                                                        var self = this;\n\
                                                        window.setTimeout(function() {\n\
                                                          self.openDay(current);\n\
                                                        }, 500);\n\
                                                    };\n\
                                                };\n\
                                                Calendar.prototype.draw = function(){\n\
                                                    this.drawHeader();\n\
                                                    this.drawMonth();\n\
                                                    this.drawLegend();\n\
                                                };\n\
                                                Calendar.prototype.drawHeader = function(){\n\
                                                    var self = this;\n\
                                                    if (!this.header) {\n\
                                                       this.header = createElement(".class' + classid + '", \'header\');\n\
                                                       this.header.className = \'header\';\n\
                                                       this.title = createElement(\'h1\');\n\
                                                       var right = createElement(".class' + classid + '", \'right\');\n\
                                                       right.addEventListener(\'click\', function() {self.nextMonth();});\n\
                                                       var left = createElement(".class' + classid + '", \'left\');\n\
                                                       left.addEventListener(\'click\', function() {self.prevMonth();});\n\
                                                       this.header.appendChild(this.title);\n\
                                                       this.header.appendChild(right);\n\
                                                       this.header.appendChild(left);\n\
                                                       this.el.appendChild(this.header);\n\
                                                    };\n\
                                                    this.title.innerHTML = this.current.format(\'MMMM YYYY\');\n\
                                                };\n\
                                                Calendar.prototype.drawMonth = function(){\n\
                                                    var self = this;\n\
                                                    this.events.forEach(function(ev){\n\
                                                        ev.date = self.current.clone().date(Math.random() * (29 - 1) + 1);\n\
                                                    });\n\
                                                    if (this.month) {\n\
                                                      this.oldMonth = this.month;\n\
                                                      this.oldMonth.className = \'month out\' + (self.next ? \'next\': \'prev\');\n\
                                                      this.oldMonth.addEventListener(\'webkitAnimationEnd\', function(){\n\
                                                        self.oldMonth.parentNode.removeChild(self.oldMonth);\n\
                                                        self.month = createElement(".class' + classid + '", \'month\');\n\
                                                        self.backFill();\n\
                                                        self.currentMonth();\n\
                                                        self.fowardFill();\n\
                                                        self.el.appendChild(self.month);\n\
                                                        window.setTimeout(function(){\n\
                                                           self.month.className = \'month in \' + (self.next ? \'next\': \'prev\');\n\
                                                        }, 16);\n\
                                                      });\n\
                                                    }else{\n\
                                                      this.month = createElement(".class' + classid + '", \'month\');\n\
                                                      this.el.appendChild(this.month);\n\
                                                      this.backFill();\n\
                                                      this.currentMonth();\n\
                                                      this.fowardFill();\n\
                                                      this.month.className = \'month new\';\n\
                                                    };\n\
                                                };\n\
                                                Calendar.prototype.backFill = function() {\n\
                                                    var clone = this.current.clone();\n\
                                                    var dayOfWeek = clone.day();\n\
                                                    if (!dayOfWeek) {return;};\n\
                                                    clone.subtract(\'days\', dayOfWeek + 1);\n\
                                                    for (var i = dayOfWeek; i > 0; i--) {\n\
                                                      this.drawDay(clone.add(\'days\', 1));\n\
                                                    }\n\
                                                }\n\
                                                Calendar.prototype.fowardFill = function() {\n\
                                                    var clone = this.current.clone().add(\'months\', 1).subtract(\'days\', 1);\n\
                                                    var dayOfWeek = clone.day();\n\
                                                    if (dayOfWeek === 6) {return;};\n\
                                                    for (var i = dayOfWeek; i < 6; i++) {\n\
                                                      this.drawDay(clone.add(\'days\', 1));\n\
                                                    };\n\
                                                };\n\
                                                Calendar.prototype.currentMonth = function() {\n\
                                                    var clone = this.current.clone();\n\
                                                    while (clone.month() === this.current.month()) {\n\
                                                        this.drawDay(clone);\n\
                                                        clone.add(\'days\', 1);\n\
                                                    };\n\
                                                };\n\
                                                Calendar.prototype.getWeek = function(day) {\n\
                                                    if (!this.week || day.day() === 0) {\n\
                                                       this.week = createElement("div", \'week\');\n\
                                                       this.month.appendChild(this.week);\n\
                                                    };\n\
                                                };\n\
                                                Calendar.prototype.drawDay = function(day) {\n\
                                                    var self = this;\n\
                                                    this.getWeek(day);\n\
                                                    var outer = createElement(".class' + classid + '", this.getDayClass(day));\n\
                                                    outer.addEventListener(\'click\', function(){\n\
                                                          self.openDay(this);\n\
                                                    });\n\
                                                    var name = createElement(".class' + classid + '", \'day-name\', day.format(\'ddd\'));\n\
                                                    var number = createElement(".class' + classid + '", \'day-number\', day.format(\'DD\'));\n\
                                                    var events = createElement(".class' + classid + '", \'day-events\');\n\
                                                    this.drawEvents(day, events);\n\
                                                    outer.appendChild(name);\n\
                                                    outer.appendChild(number);\n\
                                                    outer.appendChild(events);\n\
                                                    this.week.appendChild(outer);\n\
                                                };\n\
                                                Calendar.prototype.drawEvents = function(day, element) {\n\
                                                    if (day.month() === this.current.month()) {\n\
                                                       var todaysEvents = this.events.reduce(function(memo, ev){\n\
                                                          if (ev.date.isSame(day, \'day\')){\n\
                                                                memo.push(ev);\n\
                                                          };\n\
                                                          return memo;\n\
                                                       },[]);\n\
                                                       todaysEvents.forEach(function(ev){\n\
                                                          var evSpan = createElement(\'span\', ev.color);\n\
                                                          element.appendChild(evSpan);\n\
                                                       });\n\
                                                    };\n\
                                                };\n\
                                                Calendar.prototype.getDayClass = function(day) {\n\
                                                    classes = [\'day\'];\n\
                                                    if (day.month() !== this.current.month()) {\n\
                                                        classes.push(\'other\');\n\
                                                    } else if (today.isSame(day, \'day\')) {\n\
                                                         classes.push(\'today\');\n\
                                                    }\n\
                                                    return classes.join(' ');\n\
                                                }\n\
                                                Calendar.prototype.openDay = function(el) {\n\
                                                    var details, arrow;\n\
                                                    var dayNumber = +el.querySelectorAll(\'.day-number\')[0].innerText || +el.querySelectorAll(\'.day-number\')[0].textContent;\n\
                                                    var day = this.current.clone().date(dayNumber);\n\
                                                    var currentOpened = document.querySelector(\'.details\');\n\
                                                    if (currentOpened && currentOpened.parentNode === el.parentNode) {\n\
                                                        details = currentOpened;\n\
                                                        arrow = document.querySelector(\'.arrow\');\n\
                                                    }else {\n\
                                                         if (currentOpened) {\n\
                                                           currentOpened.addEventListener(\'webkitAnimationEnd\', function() {\n\
                                                             currentOpened.parentNode.removeChild(currentOpened);\n\
                                                           });\n\
                                                           currentOpened.addEventListener(\'oanimationend\', function() {\n\
                                                             currentOpened.parentNode.removeChild(currentOpened);\n\
                                                           });\n\
                                                           currentOpened.addEventListener(\'msAnimationEnd\', function() {\n\
                                                             currentOpened.parentNode.removeChild(currentOpened);\n\
                                                           });\n\
                                                           currentOpened.addEventListener(\'animationend\', function() {\n\
                                                             currentOpened.parentNode.removeChild(currentOpened);\n\
                                                           });\n\
                                                           currentOpened.className = \'details out\';\n\
                                                         };\n\
                                                         details = createElement(".class' + classid + '", \'details in\');\n\
                                                         var arrow = createElement(".class' + classid + '", \'arrow\');\n\
                                                         details.appendChild(arrow);\n\
                                                         el.parentNode.appendChild(details);\n\
                                                    };\n\
                                                    var todaysEvents = this.events.reduce(function(memo, ev) {\n\
                                                         if (ev.date.isSame(day, \'day\')) {\n\
                                                             memo.push(ev);\n\
                                                         }\n\
                                                         return memo;\n\
                                                    }, []);\n\
                                                    this.renderEvents(todaysEvents, details);\n\
                                                    arrow.style.left = el.offsetLeft - el.parentNode.offsetLeft + 27 + \'px\';\n\
                                                };\n\
                                                Calendar.prototype.renderEvents = function(events, ele) {\n\
                                                    var currentWrapper = ele.querySelector(\'.events\');\n\
                                                    var wrapper = createElement("div", \'events in\' + (currentWrapper ? \' new\': \'\'));\n\
                                                    events.forEach(function(ev){\n\
                                                        var div = createElement(".class' + classid + '", \'event\');\n\
                                                        var square = createElement(".class' + classid + '", \'event-category \' + ev.color);\n\
                                                        var span = createElement(\'span\', \'\', ev.eventName);\n\
                                                        div.appendChild(square);\n\
                                                        div.appendChild(span);\n\
                                                        wrapper.appendChild(div);\n\
                                                    });\n\
                                                    if (!events.length) {\n\
                                                       var div = createElement(".class' + classid + '", \'event empty\');\n\
                                                       var span = createElement(\'span\', \'\', \'No Events\');\n\
                                                       div.appendChild(span);\n\
                                                       wrapper.appendChild(div);\n\
                                                    };\n\
                                                    if (currentWrapper) {\n\
                                                       currentWrapper.className = \'events out\';\n\
                                                       currentWrapper.addEventListener(\'webkitAnimationEnd\', function() {\n\
                                                         currentWrapper.parentNode.removeChild(currentWrapper);\n\
                                                         ele.appendChild(wrapper);\n\
                                                       });\n\
                                                       currentWrapper.addEventListener(\'oanimationend\', function() {\n\
                                                         currentWrapper.parentNode.removeChild(currentWrapper);\n\
                                                         ele.appendChild(wrapper);\n\
                                                       });\n\
                                                       currentWrapper.addEventListener(\'msAnimationEnd\', function() {\n\
                                                         currentWrapper.parentNode.removeChild(currentWrapper);\n\
                                                         ele.appendChild(wrapper);\n\
                                                       });\n\
                                                       currentWrapper.addEventListener(\'animationend\', function() {\n\
                                                         currentWrapper.parentNode.removeChild(currentWrapper);\n\
                                                         ele.appendChild(wrapper);\n\
                                                       });\n\
                                                    } else {\n\
                                                         ele.appendChild(wrapper);\n\
                                                    };\n\
                                                };\n\
                                                Calendar.prototype.drawLegend = function(){\n\
                                                    var legend = createElement(".class' + classid + '", \'legend\');\n\
                                                    var calendars = this.events.map(function(e){\n\
                                                        return e.calendar + \'|\' + e.color;\n\
                                                    }).reduce(function(memo, e){\n\
                                                        if (memo.indexOf(e) === -1) {\n\
                                                            memo.push(e);\n\
                                                        };\n\
                                                        return memo;\n\
                                                    },[]).forEach(function(e){\n\
                                                        var parts = e.split(\'|\');\n\
                                                        var entry = createElement(\'span\', \'entry \' + parts[1], parts[0]);\n\
                                                        legend.appendChild(entry);\n\
                                                    });\n\
                                                    this.el.appendChild(legend);\n\
                                                };\n\
                                                Calendar.prototype.nextMonth = function() {\n\
                                                    this.current.add(\'months\', 1);\n\
                                                    this.next = true;\n\
                                                    this.draw();\n\
                                                };\n\
                                                Calendar.prototype.prevMonth = function(){\n\
                                                    this.current.subtract(\'months\', 1);\n\
                                                    this.next = false;\n\
                                                    this.draw();\n\
                                                };\n\
                                                window.Calendar = Calendar;\n\
                                                function createElement(tagName, className, innerText){\n\
                                                    var ele = document.createElement("tagName");\n\
                                                    if (className) {\n\
                                                        ele.className = className;\n\
                                                    };\n\
                                                    if (innerText) {\n\
                                                        ele.innderText = ele.textContent = innerText;\n\
                                                    };\n\
                                                    return ele;\n\
                                                }\n\
                                            }();\n\
                                            !function() {\n\
                                                var data = [\n\
                                                    {eventName: "Lunch Meeting w/ Mark", calendar: "Work", color: "orange"},\n\
                                                    {eventName: "Interview - Jr. Web Developer", calendar: "Work", color: "orange"},\n\
                                                    {eventName: "Demo New App to the Board", calendar: "Work", color: "orange"},\n\
                                                    {eventName: "Dinner w/ Marketing", calendar: "Work", color: "orange"},\n\
                                                    {eventName: "Game vs Portalnd", calendar: "Sports", color: "blue"},\n\
                                                    {eventName: "Game vs Houston", calendar: "Sports", color: "blue"},\n\
                                                    {eventName: "Game vs Denver", calendar: "Sports", color: "blue"},\n\
                                                    {eventName: "Game vs San Degio", calendar: "Sports", color:"blue"},\n\
                                                    {eventName: "School Play", calendar: "Kids", color: "yellow"},\n\
                                                    {eventName: "Parent/Teacher Conference", calendar: "Kids", color: "yellow"},\n\
                                                    {eventName: "Pick up from Soccer Practice", calendar: "Kids", color: "yellow"},\n\
                                                    {eventName: "Ice Cream Night", calendar: "Kids", color: "yellow"},\n\
                                                    {eventName: "Free Tamale Night", calendar: "Other", color: "green"},\n\
                                                    {eventName: "Bowling Team", calendar: "Other", color: "green"},\n\
                                                    {eventName: "Teach Kids to Code", calendar: "Other", color: "green"},\n\
                                                    {eventName: "Startup Weekend", calendar: "Other", color: "green"}];\n\
                                                function addDate(ev){};\n\
                                                var calendar = new Calendar(".class' + classid + '", data);\n\
                                                var chartDiv = document.getElementById("id' + classid + '");\n\
                                                var widthX = chartDiv.clientWidth;\n\
                                                var heightX = chartDiv.clientHeight;\n\
                                                calendar.Calendar("option", "width","chartDiv.clientWidth");\n\
                                                calendar.Calendar("option", "height","chartDiv.clientHeight");\n\
                                            }();\n\
                                            </script>\n\
                                        </div>')
                pagehtml3.write(
                    '<div drag resize  class="class' + str(classid) + '" id="id' + classid + 'suggestions">\n\
                                            <script src ="//cdnjs.cloudflare.com/ajax/libs/moment.js/2.5.1/moment.min.js"></script>\n\
                                            <script>\n\
                                            !function() {\n\
                                                var today = moment();\n\
                                                function Calendar(selector, events){\n\
                                                    this.el = document.querySelector(selector);\n\
                                                    this.events = events;\n\
                                                    this.current = moment().date(1);\n\
                                                    this.draw();\n\
                                                    var current = document.querySelector(\'.today\');\n\
                                                    if (current) {\n\
                                                        var self = this;\n\
                                                        window.setTimeout(function() {\n\
                                                          self.openDay(current);\n\
                                                        }, 500);\n\
                                                    };\n\
                                                };\n\
                                                Calendar.prototype.draw = function(){\n\
                                                    this.drawHeader();\n\
                                                    this.drawMonth();\n\
                                                    this.drawLegend();\n\
                                                };\n\
                                                Calendar.prototype.drawHeader = function(){\n\
                                                    var self = this;\n\
                                                    if (!this.header) {\n\
                                                       this.header = createElement(".class' + classid + '", \'header\');\n\
                                                       this.header.className = \'header\';\n\
                                                       this.title = createElement(\'h1\');\n\
                                                       var right = createElement(".class' + classid + '", \'right\');\n\
                                                       right.addEventListener(\'click\', function() {self.nextMonth();});\n\
                                                       var left = createElement(".class' + classid + '", \'left\');\n\
                                                       left.addEventListener(\'click\', function() {self.prevMonth();});\n\
                                                       this.header.appendChild(this.title);\n\
                                                       this.header.appendChild(right);\n\
                                                       this.header.appendChild(left);\n\
                                                       this.el.appendChild(this.header);\n\
                                                    };\n\
                                                    this.title.innerHTML = this.current.format(\'MMMM YYYY\');\n\
                                                };\n\
                                                Calendar.prototype.drawMonth = function(){\n\
                                                    var self = this;\n\
                                                    this.events.forEach(function(ev){\n\
                                                        ev.date = self.current.clone().date(Math.random() * (29 - 1) + 1);\n\
                                                    });\n\
                                                    if (this.month) {\n\
                                                      this.oldMonth = this.month;\n\
                                                      this.oldMonth.className = \'month out\' + (self.next ? \'next\': \'prev\');\n\
                                                      this.oldMonth.addEventListener(\'webkitAnimationEnd\', function(){\n\
                                                        self.oldMonth.parentNode.removeChild(self.oldMonth);\n\
                                                        self.month = createElement(".class' + classid + '", \'month\');\n\
                                                        self.backFill();\n\
                                                        self.currentMonth();\n\
                                                        self.fowardFill();\n\
                                                        self.el.appendChild(self.month);\n\
                                                        window.setTimeout(function(){\n\
                                                           self.month.className = \'month in \' + (self.next ? \'next\': \'prev\');\n\
                                                        }, 16);\n\
                                                      });\n\
                                                    }else{\n\
                                                      this.month = createElement(".class' + classid + '", \'month\');\n\
                                                      this.el.appendChild(this.month);\n\
                                                      this.backFill();\n\
                                                      this.currentMonth();\n\
                                                      this.fowardFill();\n\
                                                      this.month.className = \'month new\';\n\
                                                    };\n\
                                                };\n\
                                                Calendar.prototype.backFill = function() {\n\
                                                    var clone = this.current.clone();\n\
                                                    var dayOfWeek = clone.day();\n\
                                                    if (!dayOfWeek) {return;};\n\
                                                    clone.subtract(\'days\', dayOfWeek + 1);\n\
                                                    for (var i = dayOfWeek; i > 0; i--) {\n\
                                                      this.drawDay(clone.add(\'days\', 1));\n\
                                                    }\n\
                                                }\n\
                                                Calendar.prototype.fowardFill = function() {\n\
                                                    var clone = this.current.clone().add(\'months\', 1).subtract(\'days\', 1);\n\
                                                    var dayOfWeek = clone.day();\n\
                                                    if (dayOfWeek === 6) {return;};\n\
                                                    for (var i = dayOfWeek; i < 6; i++) {\n\
                                                      this.drawDay(clone.add(\'days\', 1));\n\
                                                    };\n\
                                                };\n\
                                                Calendar.prototype.currentMonth = function() {\n\
                                                    var clone = this.current.clone();\n\
                                                    while (clone.month() === this.current.month()) {\n\
                                                        this.drawDay(clone);\n\
                                                        clone.add(\'days\', 1);\n\
                                                    };\n\
                                                };\n\
                                                Calendar.prototype.getWeek = function(day) {\n\
                                                    if (!this.week || day.day() === 0) {\n\
                                                       this.week = createElement("div", \'week\');\n\
                                                       this.month.appendChild(this.week);\n\
                                                    };\n\
                                                };\n\
                                                Calendar.prototype.drawDay = function(day) {\n\
                                                    var self = this;\n\
                                                    this.getWeek(day);\n\
                                                    var outer = createElement(".class' + classid + '", this.getDayClass(day));\n\
                                                    outer.addEventListener(\'click\', function(){\n\
                                                          self.openDay(this);\n\
                                                    });\n\
                                                    var name = createElement(".class' + classid + '", \'day-name\', day.format(\'ddd\'));\n\
                                                    var number = createElement(".class' + classid + '", \'day-number\', day.format(\'DD\'));\n\
                                                    var events = createElement(".class' + classid + '", \'day-events\');\n\
                                                    this.drawEvents(day, events);\n\
                                                    outer.appendChild(name);\n\
                                                    outer.appendChild(number);\n\
                                                    outer.appendChild(events);\n\
                                                    this.week.appendChild(outer);\n\
                                                };\n\
                                                Calendar.prototype.drawEvents = function(day, element) {\n\
                                                    if (day.month() === this.current.month()) {\n\
                                                       var todaysEvents = this.events.reduce(function(memo, ev){\n\
                                                          if (ev.date.isSame(day, \'day\')){\n\
                                                                memo.push(ev);\n\
                                                          };\n\
                                                          return memo;\n\
                                                       },[]);\n\
                                                       todaysEvents.forEach(function(ev){\n\
                                                          var evSpan = createElement(\'span\', ev.color);\n\
                                                          element.appendChild(evSpan);\n\
                                                       });\n\
                                                    };\n\
                                                };\n\
                                                Calendar.prototype.getDayClass = function(day) {\n\
                                                    classes = [\'day\'];\n\
                                                    if (day.month() !== this.current.month()) {\n\
                                                        classes.push(\'other\');\n\
                                                    } else if (today.isSame(day, \'day\')) {\n\
                                                         classes.push(\'today\');\n\
                                                    }\n\
                                                    return classes.join(' ');\n\
                                                }\n\
                                                Calendar.prototype.openDay = function(el) {\n\
                                                    var details, arrow;\n\
                                                    var dayNumber = +el.querySelectorAll(\'.day-number\')[0].innerText || +el.querySelectorAll(\'.day-number\')[0].textContent;\n\
                                                    var day = this.current.clone().date(dayNumber);\n\
                                                    var currentOpened = document.querySelector(\'.details\');\n\
                                                    if (currentOpened && currentOpened.parentNode === el.parentNode) {\n\
                                                        details = currentOpened;\n\
                                                        arrow = document.querySelector(\'.arrow\');\n\
                                                    }else {\n\
                                                         if (currentOpened) {\n\
                                                           currentOpened.addEventListener(\'webkitAnimationEnd\', function() {\n\
                                                             currentOpened.parentNode.removeChild(currentOpened);\n\
                                                           });\n\
                                                           currentOpened.addEventListener(\'oanimationend\', function() {\n\
                                                             currentOpened.parentNode.removeChild(currentOpened);\n\
                                                           });\n\
                                                           currentOpened.addEventListener(\'msAnimationEnd\', function() {\n\
                                                             currentOpened.parentNode.removeChild(currentOpened);\n\
                                                           });\n\
                                                           currentOpened.addEventListener(\'animationend\', function() {\n\
                                                             currentOpened.parentNode.removeChild(currentOpened);\n\
                                                           });\n\
                                                           currentOpened.className = \'details out\';\n\
                                                         };\n\
                                                         details = createElement(".class' + classid + '", \'details in\');\n\
                                                         var arrow = createElement(".class' + classid + '", \'arrow\');\n\
                                                         details.appendChild(arrow);\n\
                                                         el.parentNode.appendChild(details);\n\
                                                    };\n\
                                                    var todaysEvents = this.events.reduce(function(memo, ev) {\n\
                                                         if (ev.date.isSame(day, \'day\')) {\n\
                                                             memo.push(ev);\n\
                                                         }\n\
                                                         return memo;\n\
                                                    }, []);\n\
                                                    this.renderEvents(todaysEvents, details);\n\
                                                    arrow.style.left = el.offsetLeft - el.parentNode.offsetLeft + 27 + \'px\';\n\
                                                };\n\
                                                Calendar.prototype.renderEvents = function(events, ele) {\n\
                                                    var currentWrapper = ele.querySelector(\'.events\');\n\
                                                    var wrapper = createElement("div", \'events in\' + (currentWrapper ? \' new\': \'\'));\n\
                                                    events.forEach(function(ev){\n\
                                                        var div = createElement(".class' + classid + '", \'event\');\n\
                                                        var square = createElement(".class' + classid + '", \'event-category \' + ev.color);\n\
                                                        var span = createElement(\'span\', \'\', ev.eventName);\n\
                                                        div.appendChild(square);\n\
                                                        div.appendChild(span);\n\
                                                        wrapper.appendChild(div);\n\
                                                    });\n\
                                                    if (!events.length) {\n\
                                                       var div = createElement(".class' + classid + '", \'event empty\');\n\
                                                       var span = createElement(\'span\', \'\', \'No Events\');\n\
                                                       div.appendChild(span);\n\
                                                       wrapper.appendChild(div);\n\
                                                    };\n\
                                                    if (currentWrapper) {\n\
                                                       currentWrapper.className = \'events out\';\n\
                                                       currentWrapper.addEventListener(\'webkitAnimationEnd\', function() {\n\
                                                         currentWrapper.parentNode.removeChild(currentWrapper);\n\
                                                         ele.appendChild(wrapper);\n\
                                                       });\n\
                                                       currentWrapper.addEventListener(\'oanimationend\', function() {\n\
                                                         currentWrapper.parentNode.removeChild(currentWrapper);\n\
                                                         ele.appendChild(wrapper);\n\
                                                       });\n\
                                                       currentWrapper.addEventListener(\'msAnimationEnd\', function() {\n\
                                                         currentWrapper.parentNode.removeChild(currentWrapper);\n\
                                                         ele.appendChild(wrapper);\n\
                                                       });\n\
                                                       currentWrapper.addEventListener(\'animationend\', function() {\n\
                                                         currentWrapper.parentNode.removeChild(currentWrapper);\n\
                                                         ele.appendChild(wrapper);\n\
                                                       });\n\
                                                    } else {\n\
                                                         ele.appendChild(wrapper);\n\
                                                    };\n\
                                                };\n\
                                                Calendar.prototype.drawLegend = function(){\n\
                                                    var legend = createElement(".class' + classid + '", \'legend\');\n\
                                                    var calendars = this.events.map(function(e){\n\
                                                        return e.calendar + \'|\' + e.color;\n\
                                                    }).reduce(function(memo, e){\n\
                                                        if (memo.indexOf(e) === -1) {\n\
                                                            memo.push(e);\n\
                                                        };\n\
                                                        return memo;\n\
                                                    },[]).forEach(function(e){\n\
                                                        var parts = e.split(\'|\');\n\
                                                        var entry = createElement(\'span\', \'entry \' + parts[1], parts[0]);\n\
                                                        legend.appendChild(entry);\n\
                                                    });\n\
                                                    this.el.appendChild(legend);\n\
                                                };\n\
                                                Calendar.prototype.nextMonth = function() {\n\
                                                    this.current.add(\'months\', 1);\n\
                                                    this.next = true;\n\
                                                    this.draw();\n\
                                                };\n\
                                                Calendar.prototype.prevMonth = function(){\n\
                                                    this.current.subtract(\'months\', 1);\n\
                                                    this.next = false;\n\
                                                    this.draw();\n\
                                                };\n\
                                                window.Calendar = Calendar;\n\
                                                function createElement(tagName, className, innerText){\n\
                                                    var ele = document.createElement("tagName");\n\
                                                    if (className) {\n\
                                                        ele.className = className;\n\
                                                    };\n\
                                                    if (innerText) {\n\
                                                        ele.innderText = ele.textContent = innerText;\n\
                                                    };\n\
                                                    return ele;\n\
                                                }\n\
                                            }();\n\
                                            !function() {\n\
                                                var data = [\n\
                                                    {eventName: "Lunch Meeting w/ Mark", calendar: "Work", color: "orange"},\n\
                                                    {eventName: "Interview - Jr. Web Developer", calendar: "Work", color: "orange"},\n\
                                                    {eventName: "Demo New App to the Board", calendar: "Work", color: "orange"},\n\
                                                    {eventName: "Dinner w/ Marketing", calendar: "Work", color: "orange"},\n\
                                                    {eventName: "Game vs Portalnd", calendar: "Sports", color: "blue"},\n\
                                                    {eventName: "Game vs Houston", calendar: "Sports", color: "blue"},\n\
                                                    {eventName: "Game vs Denver", calendar: "Sports", color: "blue"},\n\
                                                    {eventName: "Game vs San Degio", calendar: "Sports", color:"blue"},\n\
                                                    {eventName: "School Play", calendar: "Kids", color: "yellow"},\n\
                                                    {eventName: "Parent/Teacher Conference", calendar: "Kids", color: "yellow"},\n\
                                                    {eventName: "Pick up from Soccer Practice", calendar: "Kids", color: "yellow"},\n\
                                                    {eventName: "Ice Cream Night", calendar: "Kids", color: "yellow"},\n\
                                                    {eventName: "Free Tamale Night", calendar: "Other", color: "green"},\n\
                                                    {eventName: "Bowling Team", calendar: "Other", color: "green"},\n\
                                                    {eventName: "Teach Kids to Code", calendar: "Other", color: "green"},\n\
                                                    {eventName: "Startup Weekend", calendar: "Other", color: "green"}];\n\
                                                function addDate(ev){};\n\
                                                var calendar = new Calendar(".class' + classid + '", data);\n\
                                                var chartDiv = document.getElementById("id' + classid + '");\n\
                                                var widthX = chartDiv.clientWidth;\n\
                                                var heightX = chartDiv.clientHeight;\n\
                                                calendar.Calendar("option", "width","chartDiv.clientWidth");\n\
                                                calendar.Calendar("option", "height","chartDiv.clientHeight");\n\
                                            }();\n\
                                            </script>\n\
                                        </div>')
                pagecss.write(
                    '.class' + classid + '{height:' + height + '%; width:' + width + '%; max-height:' + height + '%; max-width:' + width + '%;position:absolute; left:' + positionL + '%; top:' + positionT + '%}' + ' ' + '#id' + classid + '}\n\
                    #calendar {-webkit-transform: translate3d(0, 0, 0);,-moz-transform: translate3d(0, 0, 0);transform: translate3d(0, 0, 0);overflow: hidden;}\n\
                    .header {background: rgba(66, 66, 66, 1);text-align: center;position:relative;z-index: 100;}\n\
                    .header h1 {margin: 0;  padding: 0;  font-size: 10px;  line-height: 50px;  font-weight: 100;  letter-spacing: 1px;}\n\
                    .left, .right {  position: absolute;  width: 0px;  height: 0px;  border-style: solid;  top: 50%;  margin-top: -7.5px;  cursor: pointer;}\n\
                    .left {  border-width: 7.5px 10px 7.5px 0;  border-color: transparent rgba(160, 159, 160, 1) transparent transparent;  left: 20px;}\n\
                    .right {  border-width: 7.5px 0 7.5px 10px;  border-color: transparent transparent transparent rgba(160, 159, 160, 1);  right: 20px;}\n\
                    .month { opacity: 0;}\n\
                    .month.new {-webkit-animation: fadeIn 1s ease-out;  opacity: 1;}\n\
                    .month.in.next {  -webkit-animation: moveFromTopFadeMonth .4s ease-out;  -moz-animation: moveFromTopFadeMonth .4s ease-out;  animation: moveFromTopFadeMonth .4s ease-out;  opacity: 1;}\n\
                    .month.out.next {  -webkit-animation: moveToTopFadeMonth .4s ease-in;  -moz-animation: moveToTopFadeMonth .4s ease-in;  animation: moveToTopFadeMonth .4s ease-in;  opacity: 1;}\n\
                    .month.in.prev { -webkit-animation: moveFromBottomFadeMonth .4s ease-out;  -moz-animation: moveFromBottomFadeMonth .4s ease-out;  animation: moveFromBottomFadeMonth .4s ease-out;  opacity: 1;}\n\
                    .month.out.prev {-webkit-animation: moveToBottomFadeMonth .4s ease-in;  -moz-animation: moveToBottomFadeMonth .4s ease-in;  animation: moveToBottomFadeMonth .4s ease-in;  opacity: 1;}\n\
                    .week { background: #4A4A4A;}\n\
                    .day { display: inline-block;  text-align: center;  vertical-align: top;  cursor: pointer;  background: #4A4A4A;  position: relative;  z-index: 100;}\n\
                    .day.other { color: rgba(255, 255, 255, .3);}\n\
                    .day.today { color: rgba(156, 202, 235, 1);}\n\
                    .day-name {  font-size: 9px;  text-transform: uppercase;  margin-bottom: 5px;  color: rgba(255, 255, 255, .5);  letter-spacing: .7px;}\n\
                    .day-number {  font-size: 24px;  letter-spacing: 1.5px;}\n\
                    .day .day-events {  list-style: none;  margin-top: 3px;  text-align: center;  height: 12px;  line-height: 6px;  overflow: hidden;}\n\
                    .day .day-events span {  vertical-align: top;  display: inline-block;  padding: 0;  margin: 0;  width: 5px;  height: 5px;  line-height: 5px;  margin: 0 1px;}\n\
                    .blue { background: rgba(156, 202, 235, 1); }\n\
                    .orange { background: rgba(247, 167, 0, 1); }\n\
                    .green { background: rgba(153, 198, 109, 1); }\n\
                    .yellow { background: rgba(249, 233, 0, 1); }\n\
                    .details {  position: relative;  width: 420px;  height: 75px;  background: rgba(164, 164, 164, 1);  margin-top: 5px;  border-radius: 4px;}\n\
                    .details.in {  -webkit-animation: moveFromTopFade .5s ease both;  -moz-animation: moveFromTopFade .5s ease both;  animation: moveFromTopFade .5s ease both;}\n\
                    .details.out {  -webkit-animation: moveToTopFade .5s ease both;  -moz-animation: moveToTopFade .5s ease both;  animation: moveToTopFade .5s ease both;}\n\
                    .arrow {  position: absolute;  top: -5px;  left: 50%;  margin-left: -2px;  width: 0px;  height: 0px;  border-style: solid;  border-width: 0 5px 5px 5px;  border-color: transparent transparent rgba(164, 164, 164, 1) transparent;  transition: all 0.7s ease;}\n\
                    .events {  height: 75px;  padding: 7px 0;  overflow-y: auto;  overflow-x: hidden;}\n\
                    .events.in {  -webkit-animation: fadeIn .3s ease both;  -moz-animation: fadeIn .3s ease both;  animation: fadeIn .3s ease both;}\n\
                    .events.in {  -webkit-animation-delay: .3s;  -moz-animation-delay: .3s;  animation-delay: .3s;}\n\
                    .details.out .events {  -webkit-animation: fadeOutShrink .4s ease both;  -moz-animation: fadeOutShink .4s ease both;  animation: fadeOutShink .4s ease both;}\n\
                    .events.out {  -webkit-animation: fadeOut .3s ease both;  -moz-animation: fadeOut .3s ease both;  animation: fadeOut .3s ease both;}\n\
                    .event {  font-size: 16px;  line-height: 22px;  letter-spacing: .5px;  padding: 2px 16px;  vertical-align: top;}\n\
                    .event.empty {  color: #eee;}\n\
                    .event-category {  height: 10px;  width: 10px;  display: inline-block;  margin: 6px 0 0;  vertical-align: top;}\n\
                    .event span {  display: inline-block;  padding: 0 0 0 7px;}\n\
                    .legend {  position: absolute;  bottom: 0;  width: 100%;  height: 30px;  background: rgba(60, 60, 60, 1);  line-height: 30px;}\n\
                    .entry {  position: relative;  padding: 0 0 0 25px;  font-size: 13px;  display: inline-block;  line-height: 30px;  background: transparent;}\n\
                    .entry:after {  position: absolute;  content: '';  height: 5px;  width: 5px;  top: 12px;  left: 14px;}\n\
                    .entry.blue:after { background: rgba(156, 202, 235, 1); }\n\
                    .entry.orange:after { background: rgba(247, 167, 0, 1); }\n\
                    .entry.green:after { background: rgba(153, 198, 109, 1); }\n\
                    .entry.yellow:after { background: rgba(249, 233, 0, 1); }\n\
                    @-webkit-keyframes moveFromTopFade {from { opacity: .3; height:0px; margin-top:0px; -webkit-transform: translateY(-100%); }}\n\
                    @-moz-keyframes moveFromTopFade {  from { height:0px; margin-top:0px; -moz-transform: translateY(-100%); }}\n\
                    @keyframes moveFromTopFade {  from { height:0px; margin-top:0px; transform: translateY(-100%); }}\n\
                    @-webkit-keyframes moveToTopFade {  to { opacity: .3; height:0px; margin-top:0px; opacity: 0.3; -webkit-transform: translateY(-100%); }}\n\
                    @-moz-keyframes moveToTopFade {  to { height:0px; -moz-transform: translateY(-100%); }}\n\
                    @keyframes moveToTopFade {  to { height:0px; transform: translateY(-100%); }}\n\
                    @-webkit-keyframes moveToTopFadeMonth {  to { opacity: 0; -webkit-transform: translateY(-30%) scale(.95); }}\n\
                    @-moz-keyframes moveToTopFadeMonth {  to { opacity: 0; -moz-transform: translateY(-30%); }}\n\
                    @keyframes moveToTopFadeMonth {  to { opacity: 0; -moz-transform: translateY(-30%); }}\n\
                    @-webkit-keyframes moveFromTopFadeMonth {  from { opacity: 0; -webkit-transform: translateY(30%) scale(.95); }}\n\
                    @-moz-keyframes moveFromTopFadeMonth {  from { opacity: 0; -moz-transform: translateY(30%); }}\n\
                    @keyframes moveFromTopFadeMonth {  from { opacity: 0; -moz-transform: translateY(30%); }}\n\
                    @-webkit-keyframes moveToBottomFadeMonth {  to { opacity: 0; -webkit-transform: translateY(30%) scale(.95); }}\n\
                    @-moz-keyframes moveToBottomFadeMonth {  to { opacity: 0; -webkit-transform: translateY(30%); }}\n\
                    @keyframes moveToBottomFadeMonth {  to { opacity: 0; -webkit-transform: translateY(30%); }}\n\
                    @-webkit-keyframes moveFromBottomFadeMonth {  from { opacity: 0; -webkit-transform: translateY(-30%) scale(.95); }}\n\
                    @-moz-keyframes moveFromBottomFadeMonth { from { opacity: 0; -webkit-transform: translateY(-30%); }}\n\
                    @keyframes moveFromBottomFadeMonth {  from { opacity: 0; -webkit-transform: translateY(-30%); }}\n\
                    @-webkit-keyframes fadeIn  {  from { opacity: 0; }}\n\
                    @-moz-keyframes fadeIn  {  from { opacity: 0; }}\n\
                    @keyframes fadeIn  {  from { opacity: 0; }}\n\
                    @-webkit-keyframes fadeOut  {  to { opacity: 0; }}\n\
                    @-moz-keyframes fadeOut  {  to { opacity: 0; }}\n\
                    @keyframes fadeOut  {  to { opacity: 0; }}\n\
                    @-webkit-keyframes fadeOutShink  {  to { opacity: 0; padding: 0px; height: 0px; }}\n\
                    @-moz-keyframes fadeOutShink  {  to { opacity: 0; padding: 0px; height: 0px; }}\n\
                    @keyframes fadeOutShink  {  to { opacity: 0; padding: 0px; height: 0px; }}\n\
                ')
            def create_barChart_old(icon_path, classid, width, height, positionL, positionT, link):
                width_bar = (float(width) * 646) / 100
                height_bar = ((float(height) * 419) / 100) - 10
                #  width_bar = widthScreen
                #  height_bar = heightScreen
                pagehtml.write(
                    '<div drag-resize class="class' + classid + '" id="id' + classid + '">\n\
                        <svg drag-resize width="' + str(width_bar) + '" height="' + str(height_bar) + '" preserveAspectRatio="xMidYMid meet"></svg>\n\
                        <script src="https://d3js.org/d3.v4.min.js"></script>\n\
                        <script>\n\
                        var svg = d3.select("svg"),\n\
                            margin = {top: 20, right: 20, bottom: 30, left: 40},\n\
                            width = +svg.attr("width") - margin.left - margin.right,\n\
                            height = +svg.attr("height") - margin.top - margin.bottom;\n\
                        var x = d3.scaleBand().rangeRound([0, width]).padding(0.1),\n\
                            y = d3.scaleLinear().rangeRound([height, 0]);\n\
                        var g = svg.append("g")\n\
                            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");\n\
                        d3.csv("/static/dirty_static/media/data.csv", function(d) {\n\
                            d.frequency = +d.frequency;\n\
                            return d;\n\
                        }, function(error, data){\n\
                            if (error) throw error;\n\
                            x.domain(data.map(function(d) { return d.letter; }));\n\
                            y.domain([0, d3.max(data, function(d) {return d.frequency;})]);\n\
                            g.append("g")\n\
                            .attr("class", "axis axis--x")\n\
                            .attr("transform", "translate(0," + height + ")")\n\
                            .call(d3.axisBottom(x));\n\
                            g.append("g")\n\
                            .attr("class", "axis axis--y")\n\
                            .call(d3.axisLeft(y).ticks(5, "%"))\n\
                            .append("text")\n\
                            .attr("transform", "rotate(-90)")\n\
                            .attr("y", 6)\n\
                            .attr("dy", "0.71em")\n\
                            .attr("text-anchor", "end")\n\
                            .text("Frequency");\n\
                            g.selectAll(".bar")\n\
                            .data(data)\n\
                            .enter().append("rect")\n\
                            .attr("class", "bar")\n\
                            .attr("x", function(d){return x(d.letter);})\n\
                            .attr("y", function(d){return y(d.frequency);})\n\
                            .attr("width", x.bandwidth())\n\
                            .attr("height", function(d){return height - y(d.frequency);});\n\
                        });\n\
                        var drag_handler = d3.drag()\n\
                            .on("drag", function(d){\n\
                                d3.select(this)\n\
                                    .attr("cx", d.x = d3.event.x  )\n\
                                    .attr("cy", d.y = d3.event.y  );\n\
                        });\n\
                        drag_handler(svg);\n\
                    </script>\n\
                      </div>')
                pagecss.write(
                    '.class' + classid + '{height:' + height + '%; width:' + width + '%; max-height:' + height + '%; max-width:' + width + '%;position:absolute; left:' + positionL + '%; top:' + positionT + '%}' + ' ' + '#id' + classid + '{}\n\
                        .bar { fill: #4bff00; display:unset!important;}\n\
                        .bar:hover {\n\
                        fill: red;}\n\
                        ')
                pagehtml1.write(
                    '<div drag-resize class="class' + classid + '" id="id' + classid + 'pro">\n\
                        <svg drag-resize width="' + str(width_bar) + '" height="' + str(height_bar) + '" preserveAspectRatio="xMidYMid meet"></svg>\n\
                        <script src="https://d3js.org/d3.v4.min.js"></script>\n\
                    ')
                pagehtml2.write(
                    '<div drag-resize class="class' + classid + '" id="id' + classid + 'work">\n\
                                    <svg drag-resize width="' + str(width_bar) + '" height="' + str(height_bar) + '" preserveAspectRatio="xMidYMid meet"></svg>\n\
                                    <script src="https://d3js.org/d3.v4.min.js"></script>\n\
                                ')
                pagehtml3.write(
                    '<div drag-resize class="class' + classid + '" id="id' + classid + 'suggestions">\n\
                                    <svg drag-resize width="' + str(width_bar) + '" height="' + str(height_bar) + '" preserveAspectRatio="xMidYMid meet"></svg>\n\
                                    <script src="https://d3js.org/d3.v4.min.js"></script>\n\
                                ')
            def create_pieChart_old(icon_path, classid, width, height, positionL, positionT, link):
                width_bar = (float(width) * 645) / 100
                height_bar = (float(height) * 418) / 100
                pagehtml.write(
                    '<div drag-resize class="class' + classid + '" id="id' + classid + '">\n\
                            <button>randomize</button>\n\
                                <script src="http://d3js.org/d3.v3.min.js"></script>\n\
                                <script>\n\
                                var svg = d3.select(".class' + classid + '")\n\
                                    .append("svg")\n\
                                    .append("g")\n\
                                svg.append("g")\n\
                                    .attr("class", "slices");\n\
                                svg.append("g")\n\
                                    .attr("class", "labels");\n\
                                svg.append("g")\n\
                                    .attr("class", "lines");\n\
                                var width =' + str(width_bar) + ',\n\
                                    height = ' + str(height_bar) + ',\n\
                                    radius = Math.min(width, height) / 2;\n\
                                var pie = d3.layout.pie()\n\
                                    .sort(null)\n\
                                    .value(function(d) {\n\
                                    return d.value;\n\
                                    });\n\
                                var arc = d3.svg.arc()\n\
                                    .outerRadius(radius * 0.8)\n\
                                    .innerRadius(radius * 0.4);\n\
                                var outerArc = d3.svg.arc()\n\
                                    .innerRadius(radius * 0.9)\n\
                                    .outerRadius(radius * 0.9);\n\
                                svg.attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");\n\
                                var key = function(d){ return d.data.label; };\n\
                                var color = d3.scale.ordinal()\n\
                                    .domain(["Lorem ipsum", "dolor sit", "amet", "consectetur", "adipisicing", "elit", "sed", "do", "eiusmod", "tempor", "incididunt"])\n\
                                    .range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);\n\
                                function randomData (){\n\
                                    var labels = color.domain();\n\
                                    return labels.map(function(label){\n\
                                        return { label: label, value: Math.random() }\n\
                                    });\n\
                                }\n\
                                change(randomData());\n\
                                d3.select(".randomize")\n\
                                    .on("click", function(){\n\
                                    change(randomData());\n\
                                    });\n\
                                function change(data) {\n\
                                var slice = svg.select(".slices").selectAll("path.slice")\n\
                                    .data(pie(data), key);\n\
                                slice.enter()\n\
                                    .insert("path")\n\
                                    .style("fill", function(d) { return color(d.data.label); })\n\
                                    .attr("class", "slice");\n\
                                slice\n\
                                    .transition().duration(1000)\n\
                                    .attrTween("d", function(d) {\n\
                                        this._current = this._current || d;\n\
                                        var interpolate = d3.interpolate(this._current, d);\n\
                                        this._current = interpolate(0);\n\
                                        return function(t) {\n\
                                        return arc(interpolate(t));\n\
                                        };\n\
                                    })\n\
                                slice.exit()\n\
                                    .remove();\n\
                                var text = svg.select(".labels").selectAll("text")\n\
                                    .data(pie(data), key);\n\
                                text.enter()\n\
                                    .append("text")\n\
                                    .attr("dy", ".35em")\n\
                                    .text(function(d) {\n\
                                    return d.data.label;\n\
                                    });\n\
                                function midAngle(d){\n\
                                return d.startAngle + (d.endAngle - d.startAngle)/2;\n\
                                }\n\
                                text.transition().duration(1000)\n\
                                    .attrTween("transform", function(d) {\n\
                                        this._current = this._current || d;\n\
                                        var interpolate = d3.interpolate(this._current, d);\n\
                                        this._current = interpolate(0);\n\
                                        return function(t) {\n\
                                            var d2 = interpolate(t);\n\
                                            var pos = outerArc.centroid(d2);\n\
                                            pos[0] = radius * (midAngle(d2) < Math.PI ? 1 : -1);\n\
                                            return "translate("+ pos +")";\n\
                                        };\n\
                                    })\n\
                                    .styleTween("text-anchor", function(d){\n\
                                        this._current = this._current || d;\n\
                                        var interpolate = d3.interpolate(this._current, d);\n\
                                        this._current = interpolate(0);\n\
                                        return function(t) {\n\
                                            var d2 = interpolate(t);\n\
                                            return midAngle(d2) < Math.PI ? "start":"end";\n\
                                        };\n\
                                    });\n\
                                text.exit()\n\
                                    .remove();\n\
                                var polyline = svg.select(".lines").selectAll("polyline")\n\
                                    .data(pie(data), key);\n\
                                polyline.enter()\n\
                                    .append("polyline");\n\
                                polyline.transition().duration(1000)\n\
                                    .attrTween("points", function(d){\n\
                                        this._current = this._current || d;\n\
                                        var interpolate = d3.interpolate(this._current, d);\n\
                                        this._current = interpolate(0);\n\
                                        return function(t) {\n\
                                            var d2 = interpolate(t);\n\
                                            var pos = outerArc.centroid(d2);\n\
                                            pos[0] = radius * 0.95 * (midAngle(d2) < Math.PI ? 1 : -1);\n\
                                            return [arc.centroid(d2), outerArc.centroid(d2), pos];\n\
                                        };\n\
                                    });\n\
                                polyline.exit()\n\
                                    .remove();\n\
                                };\n\
                                </script>\n\
                            </div>')
                pagehtml1.write(
                    '<div drag-resize class="class' + classid + '" id="id' + classid + 'pro">\n\
                                        <button>randomize</button>\n\
                                            <script src="http://d3js.org/d3.v3.min.js"></script>\n\
                                            <script>\n\
                                            var svg = d3.select(".class' + classid + '")\n\
                                                .append("svg")\n\
                                                .append("g")\n\
                                            svg.append("g")\n\
                                                .attr("class", "slices");\n\
                                            svg.append("g")\n\
                                                .attr("class", "labels");\n\
                                            svg.append("g")\n\
                                                .attr("class", "lines");\n\
                                            var width =' + str(width_bar) + ',\n\
                                                height = ' + str(height_bar) + ',\n\
                                                radius = Math.min(width, height) / 2;\n\
                                            var pie = d3.layout.pie()\n\
                                                .sort(null)\n\
                                                .value(function(d) {\n\
                                                return d.value;\n\
                                                });\n\
                                            var arc = d3.svg.arc()\n\
                                                .outerRadius(radius * 0.8)\n\
                                                .innerRadius(radius * 0.4);\n\
                                            var outerArc = d3.svg.arc()\n\
                                                .innerRadius(radius * 0.9)\n\
                                                .outerRadius(radius * 0.9);\n\
                                            svg.attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");\n\
                                            var key = function(d){ return d.data.label; };\n\
                                            var color = d3.scale.ordinal()\n\
                                                .domain(["Lorem ipsum", "dolor sit", "amet", "consectetur", "adipisicing", "elit", "sed", "do", "eiusmod", "tempor", "incididunt"])\n\
                                                .range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);\n\
                                            function randomData (){\n\
                                                var labels = color.domain();\n\
                                                return labels.map(function(label){\n\
                                                    return { label: label, value: Math.random() }\n\
                                                });\n\
                                            }\n\
                                            change(randomData());\n\
                                            d3.select(".randomize")\n\
                                                .on("click", function(){\n\
                                                change(randomData());\n\
                                                });\n\
                                            function change(data) {\n\
                                            var slice = svg.select(".slices").selectAll("path.slice")\n\
                                                .data(pie(data), key);\n\
                                            slice.enter()\n\
                                                .insert("path")\n\
                                                .style("fill", function(d) { return color(d.data.label); })\n\
                                                .attr("class", "slice");\n\
                                            slice\n\
                                                .transition().duration(1000)\n\
                                                .attrTween("d", function(d) {\n\
                                                    this._current = this._current || d;\n\
                                                    var interpolate = d3.interpolate(this._current, d);\n\
                                                    this._current = interpolate(0);\n\
                                                    return function(t) {\n\
                                                    return arc(interpolate(t));\n\
                                                    };\n\
                                                })\n\
                                            slice.exit()\n\
                                                .remove();\n\
                                            var text = svg.select(".labels").selectAll("text")\n\
                                                .data(pie(data), key);\n\
                                            text.enter()\n\
                                                .append("text")\n\
                                                .attr("dy", ".35em")\n\
                                                .text(function(d) {\n\
                                                return d.data.label;\n\
                                                });\n\
                                            function midAngle(d){\n\
                                            return d.startAngle + (d.endAngle - d.startAngle)/2;\n\
                                            }\n\
                                            text.transition().duration(1000)\n\
                                                .attrTween("transform", function(d) {\n\
                                                    this._current = this._current || d;\n\
                                                    var interpolate = d3.interpolate(this._current, d);\n\
                                                    this._current = interpolate(0);\n\
                                                    return function(t) {\n\
                                                        var d2 = interpolate(t);\n\
                                                        var pos = outerArc.centroid(d2);\n\
                                                        pos[0] = radius * (midAngle(d2) < Math.PI ? 1 : -1);\n\
                                                        return "translate("+ pos +")";\n\
                                                    };\n\
                                                })\n\
                                                .styleTween("text-anchor", function(d){\n\
                                                    this._current = this._current || d;\n\
                                                    var interpolate = d3.interpolate(this._current, d);\n\
                                                    this._current = interpolate(0);\n\
                                                    return function(t) {\n\
                                                        var d2 = interpolate(t);\n\
                                                        return midAngle(d2) < Math.PI ? "start":"end";\n\
                                                    };\n\
                                                });\n\
                                            text.exit()\n\
                                                .remove();\n\
                                            var polyline = svg.select(".lines").selectAll("polyline")\n\
                                                .data(pie(data), key);\n\
                                            polyline.enter()\n\
                                                .append("polyline");\n\
                                            polyline.transition().duration(1000)\n\
                                                .attrTween("points", function(d){\n\
                                                    this._current = this._current || d;\n\
                                                    var interpolate = d3.interpolate(this._current, d);\n\
                                                    this._current = interpolate(0);\n\
                                                    return function(t) {\n\
                                                        var d2 = interpolate(t);\n\
                                                        var pos = outerArc.centroid(d2);\n\
                                                        pos[0] = radius * 0.95 * (midAngle(d2) < Math.PI ? 1 : -1);\n\
                                                        return [arc.centroid(d2), outerArc.centroid(d2), pos];\n\
                                                    };\n\
                                                });\n\
                                            polyline.exit()\n\
                                                .remove();\n\
                                            };\n\
                                            </script>\n\
                                        </div>')
                pagehtml2.write(
                    '<div drag-resize class="class' + classid + '" id="id' + classid + 'work">\n\
                                        <button>randomize</button>\n\
                                            <script src="http://d3js.org/d3.v3.min.js"></script>\n\
                                            <script>\n\
                                            var svg = d3.select(".class' + classid + '")\n\
                                                .append("svg")\n\
                                                .append("g")\n\
                                            svg.append("g")\n\
                                                .attr("class", "slices");\n\
                                            svg.append("g")\n\
                                                .attr("class", "labels");\n\
                                            svg.append("g")\n\
                                                .attr("class", "lines");\n\
                                            var width =' + str(width_bar) + ',\n\
                                                height = ' + str(height_bar) + ',\n\
                                                radius = Math.min(width, height) / 2;\n\
                                            var pie = d3.layout.pie()\n\
                                                .sort(null)\n\
                                                .value(function(d) {\n\
                                                return d.value;\n\
                                                });\n\
                                            var arc = d3.svg.arc()\n\
                                                .outerRadius(radius * 0.8)\n\
                                                .innerRadius(radius * 0.4);\n\
                                            var outerArc = d3.svg.arc()\n\
                                                .innerRadius(radius * 0.9)\n\
                                                .outerRadius(radius * 0.9);\n\
                                            svg.attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");\n\
                                            var key = function(d){ return d.data.label; };\n\
                                            var color = d3.scale.ordinal()\n\
                                                .domain(["Lorem ipsum", "dolor sit", "amet", "consectetur", "adipisicing", "elit", "sed", "do", "eiusmod", "tempor", "incididunt"])\n\
                                                .range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);\n\
                                            function randomData (){\n\
                                                var labels = color.domain();\n\
                                                return labels.map(function(label){\n\
                                                    return { label: label, value: Math.random() }\n\
                                                });\n\
                                            }\n\
                                            change(randomData());\n\
                                            d3.select(".randomize")\n\
                                                .on("click", function(){\n\
                                                change(randomData());\n\
                                                });\n\
                                            function change(data) {\n\
                                            var slice = svg.select(".slices").selectAll("path.slice")\n\
                                                .data(pie(data), key);\n\
                                            slice.enter()\n\
                                                .insert("path")\n\
                                                .style("fill", function(d) { return color(d.data.label); })\n\
                                                .attr("class", "slice");\n\
                                            slice\n\
                                                .transition().duration(1000)\n\
                                                .attrTween("d", function(d) {\n\
                                                    this._current = this._current || d;\n\
                                                    var interpolate = d3.interpolate(this._current, d);\n\
                                                    this._current = interpolate(0);\n\
                                                    return function(t) {\n\
                                                    return arc(interpolate(t));\n\
                                                    };\n\
                                                })\n\
                                            slice.exit()\n\
                                                .remove();\n\
                                            var text = svg.select(".labels").selectAll("text")\n\
                                                .data(pie(data), key);\n\
                                            text.enter()\n\
                                                .append("text")\n\
                                                .attr("dy", ".35em")\n\
                                                .text(function(d) {\n\
                                                return d.data.label;\n\
                                                });\n\
                                            function midAngle(d){\n\
                                            return d.startAngle + (d.endAngle - d.startAngle)/2;\n\
                                            }\n\
                                            text.transition().duration(1000)\n\
                                                .attrTween("transform", function(d) {\n\
                                                    this._current = this._current || d;\n\
                                                    var interpolate = d3.interpolate(this._current, d);\n\
                                                    this._current = interpolate(0);\n\
                                                    return function(t) {\n\
                                                        var d2 = interpolate(t);\n\
                                                        var pos = outerArc.centroid(d2);\n\
                                                        pos[0] = radius * (midAngle(d2) < Math.PI ? 1 : -1);\n\
                                                        return "translate("+ pos +")";\n\
                                                    };\n\
                                                })\n\
                                                .styleTween("text-anchor", function(d){\n\
                                                    this._current = this._current || d;\n\
                                                    var interpolate = d3.interpolate(this._current, d);\n\
                                                    this._current = interpolate(0);\n\
                                                    return function(t) {\n\
                                                        var d2 = interpolate(t);\n\
                                                        return midAngle(d2) < Math.PI ? "start":"end";\n\
                                                    };\n\
                                                });\n\
                                            text.exit()\n\
                                                .remove();\n\
                                            var polyline = svg.select(".lines").selectAll("polyline")\n\
                                                .data(pie(data), key);\n\
                                            polyline.enter()\n\
                                                .append("polyline");\n\
                                            polyline.transition().duration(1000)\n\
                                                .attrTween("points", function(d){\n\
                                                    this._current = this._current || d;\n\
                                                    var interpolate = d3.interpolate(this._current, d);\n\
                                                    this._current = interpolate(0);\n\
                                                    return function(t) {\n\
                                                        var d2 = interpolate(t);\n\
                                                        var pos = outerArc.centroid(d2);\n\
                                                        pos[0] = radius * 0.95 * (midAngle(d2) < Math.PI ? 1 : -1);\n\
                                                        return [arc.centroid(d2), outerArc.centroid(d2), pos];\n\
                                                    };\n\
                                                });\n\
                                            polyline.exit()\n\
                                                .remove();\n\
                                            };\n\
                                            </script>\n\
                                        </div>')
                pagehtml3.write(
                    '<div drag-resize class="class' + classid + '" id="id' + classid + 'suggestions">\n\
                                        <button>randomize</button>\n\
                                            <script src="http://d3js.org/d3.v3.min.js"></script>\n\
                                            <script>\n\
                                            var svg = d3.select(".class' + classid + '")\n\
                                                .append("svg")\n\
                                                .append("g")\n\
                                            svg.append("g")\n\
                                                .attr("class", "slices");\n\
                                            svg.append("g")\n\
                                                .attr("class", "labels");\n\
                                            svg.append("g")\n\
                                                .attr("class", "lines");\n\
                                            var width =' + str(width_bar) + ',\n\
                                                height = ' + str(height_bar) + ',\n\
                                                radius = Math.min(width, height) / 2;\n\
                                            var pie = d3.layout.pie()\n\
                                                .sort(null)\n\
                                                .value(function(d) {\n\
                                                return d.value;\n\
                                                });\n\
                                            var arc = d3.svg.arc()\n\
                                                .outerRadius(radius * 0.8)\n\
                                                .innerRadius(radius * 0.4);\n\
                                            var outerArc = d3.svg.arc()\n\
                                                .innerRadius(radius * 0.9)\n\
                                                .outerRadius(radius * 0.9);\n\
                                            svg.attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");\n\
                                            var key = function(d){ return d.data.label; };\n\
                                            var color = d3.scale.ordinal()\n\
                                                .domain(["Lorem ipsum", "dolor sit", "amet", "consectetur", "adipisicing", "elit", "sed", "do", "eiusmod", "tempor", "incididunt"])\n\
                                                .range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);\n\
                                            function randomData (){\n\
                                                var labels = color.domain();\n\
                                                return labels.map(function(label){\n\
                                                    return { label: label, value: Math.random() }\n\
                                                });\n\
                                            }\n\
                                            change(randomData());\n\
                                            d3.select(".randomize")\n\
                                                .on("click", function(){\n\
                                                change(randomData());\n\
                                                });\n\
                                            function change(data) {\n\
                                            var slice = svg.select(".slices").selectAll("path.slice")\n\
                                                .data(pie(data), key);\n\
                                            slice.enter()\n\
                                                .insert("path")\n\
                                                .style("fill", function(d) { return color(d.data.label); })\n\
                                                .attr("class", "slice");\n\
                                            slice\n\
                                                .transition().duration(1000)\n\
                                                .attrTween("d", function(d) {\n\
                                                    this._current = this._current || d;\n\
                                                    var interpolate = d3.interpolate(this._current, d);\n\
                                                    this._current = interpolate(0);\n\
                                                    return function(t) {\n\
                                                    return arc(interpolate(t));\n\
                                                    };\n\
                                                })\n\
                                            slice.exit()\n\
                                                .remove();\n\
                                            var text = svg.select(".labels").selectAll("text")\n\
                                                .data(pie(data), key);\n\
                                            text.enter()\n\
                                                .append("text")\n\
                                                .attr("dy", ".35em")\n\
                                                .text(function(d) {\n\
                                                return d.data.label;\n\
                                                });\n\
                                            function midAngle(d){\n\
                                            return d.startAngle + (d.endAngle - d.startAngle)/2;\n\
                                            }\n\
                                            text.transition().duration(1000)\n\
                                                .attrTween("transform", function(d) {\n\
                                                    this._current = this._current || d;\n\
                                                    var interpolate = d3.interpolate(this._current, d);\n\
                                                    this._current = interpolate(0);\n\
                                                    return function(t) {\n\
                                                        var d2 = interpolate(t);\n\
                                                        var pos = outerArc.centroid(d2);\n\
                                                        pos[0] = radius * (midAngle(d2) < Math.PI ? 1 : -1);\n\
                                                        return "translate("+ pos +")";\n\
                                                    };\n\
                                                })\n\
                                                .styleTween("text-anchor", function(d){\n\
                                                    this._current = this._current || d;\n\
                                                    var interpolate = d3.interpolate(this._current, d);\n\
                                                    this._current = interpolate(0);\n\
                                                    return function(t) {\n\
                                                        var d2 = interpolate(t);\n\
                                                        return midAngle(d2) < Math.PI ? "start":"end";\n\
                                                    };\n\
                                                });\n\
                                            text.exit()\n\
                                                .remove();\n\
                                            var polyline = svg.select(".lines").selectAll("polyline")\n\
                                                .data(pie(data), key);\n\
                                            polyline.enter()\n\
                                                .append("polyline");\n\
                                            polyline.transition().duration(1000)\n\
                                                .attrTween("points", function(d){\n\
                                                    this._current = this._current || d;\n\
                                                    var interpolate = d3.interpolate(this._current, d);\n\
                                                    this._current = interpolate(0);\n\
                                                    return function(t) {\n\
                                                        var d2 = interpolate(t);\n\
                                                        var pos = outerArc.centroid(d2);\n\
                                                        pos[0] = radius * 0.95 * (midAngle(d2) < Math.PI ? 1 : -1);\n\
                                                        return [arc.centroid(d2), outerArc.centroid(d2), pos];\n\
                                                    };\n\
                                                });\n\
                                            polyline.exit()\n\
                                                .remove();\n\
                                            };\n\
                                            </script>\n\
                                        </div>')
                pagecss.write(
                    '.class' + classid + '{height:' + height + '%; width:' + width + '%; max-height:' + height + '%; max-width:' + width + '%;position:absolute; left:' + positionL + '%; top:' + positionT + '%}' + ' ' + '#id' + classid + '{}\n\
                                svg {width: 100%;height: 100%;}\n\
                                path.slice{stroke-width:2px;}\n\
                                polyline{opacity: .3; stroke: black; stroke-width: 2px; fill: none;}\n\
                                    ')

            def create_barChart2_old(icon_path, classid, width, height, positionL, positionT, link):

                pagehtml.write(
                    '<div  drag-resize class="class' + classid + '" id="id' + classid + '" style="cursor:move">\n\
                   <button>resize</button>\n\
                    <script src="https://d3js.org/d3.v4.min.js"></script>\n\
                    <script>\n\
                    var chartDiv = document.getElementById("id' + classid + '");\n\
                    var widthY = chartDiv.clientWidth;\n\
                    var heightY = chartDiv.clientHeight;\n\
                    var margin = {top: 20, right: 20, bottom: 30, left: 40};\n\
                    var data = [{index: 0, value: 3},\n\
                        {index: 1, value: 5},\n\
                        {index: 2, value: 12},\n\
                        {index: 3, value: 8},\n\
                        {index: 4, value: 20},\n\
                        {index: 5, value: 7},\n\
                        {index: 6, value: 2},\n\
                        {index: 7, value: 15}];\n\
                    var delim = 4;\n\
                    var scaleY = d3.scaleLinear()\n\
                        .domain([0, 21])\n\
                        .rangeRound([heightY, 0]);\n\
                    var x = d3.scaleLinear()\n\
                        .domain([0, data.length])\n\
                        .rangeRound([0, widthY]);\n\
                    var svgY = d3.select(".class' + classid + '")\n\
                        .append("svg")\n\
                         .attr("width", widthY)\n\
                         .attr("height", heightY)\n\
                         .attr("class","draggable")\n\
                         .style("cursor", "move")\n\
                         .style("onmousedown","selectElement(evt)")\n\
                        .append(\'g\')\n\
                         .attr("class","draggable")\n\
                         .style("cursor","move");\n\
                    svgY\n\
                      .append(\'rect\')\n\
                        .attr(\'x\', 0)\n\
                        .attr(\'y\', 0)\n\
                        .attr(\'width\', widthY)\n\
                        .attr(\'height\', heightY)\n\
                        .attr("class","draggable")\n\
                        .style("fill","blue")\n\
                        .style("cursor", "move");\n\
                    var brushY = d3.brushY()\n\
                        .extent(function(d, i){\n\
                            return [[x(i) + delim / 2, 0],\n\
                                   [x(i) + x(1) - delim / 2, heightY]];})\n\
                        .on("brush", brushmoveY)\n\
                        .on("end", brushendY);\n\
                    var svgbrushY = svgY\n\
                        .selectAll(\'.brush\')\n\
                         .data(data)\n\
                        .enter()\n\
                         .append(\'g\')\n\
                          .attr(\'class\',\'brush\')\n\
                         .append(\'g\')\n\
                          .call(brushY)\n\
                          .call(brushY.move, function(d){return [d.value, 0].map(scaleY);})\n\
                    svgbrushY\n\
                       .append(\'text\')\n\
                        .attr(\'y\', function(d){return scaleY(d.value) + 25;})\n\
                        .attr(\'x\', function(d, i){return x(i) + x(0.5);})\n\
                        .attr(\'dx\', \'-.60em\')\n\
                        .attr(\'dy\', -5)\n\
                        .text(function(d){return d3.format(\'.2\')(d.value);});\n\
                    function brushendY(){\n\
                        if (!d3.event.sourceEvent) return;\n\
                        if (d3.event.sourceEvent.type === "brush") return;\n\
                        if (!d3.event.selection) {\n\
                            svgbrushY.call(brushY.move, function (d){return [d.value, 0].map(scaleY);})};};\n\
                    function brushmoveY(){\n\
                        if (!d3.event.sourceEvent) return;\n\
                        if (d3.event.sourceEvent.type === "brush") return;\n\
                        if (!d3.event.selection) return;\n\
                        var d0 = d3.event.selection.map(scaleY.invert);\n\
                        var d = d3.select(this).select(\'.selection\');\n\
                        d.datum().value = d0[0];\n\
                        update();};\n\
                    function update(){\n\
                        svgbrushY\n\
                         .call(brushY.move, function(d){return [d.value, 0].map(scaleY);})\n\
                         .selectAll(\'text\')\n\
                          .attr(\'y\', function(d){return scaleY(d.value) + 25;})\n\
                          .text(function(d){return d3.format(\'.2\')(d.value);});};\n\
                    function selectElement(evt) {\n\
                         selectedElement = evt.target;\n\
                         currentX = evt.clientX;\n\
                         currentY = evt.clientY;};\n\
                    svgY.selectAll("text,rect")\n\
                    .on("mouseenter", function(){svgY.selectAll("rect").style("cursor", "move").attr("class","draggable");});\n\
                    </script>\n\
                </div>')
                pagehtml1.write(
                    '<div  drag-resize class="class' + classid + '" id="id' + classid + 'pro" style="cursor:move">\n\
                               <button>resize</button>\n\
                                <script src="https://d3js.org/d3.v4.min.js"></script>\n\
                                <script>\n\
                                var chartDiv = document.getElementById("id' + classid + '");\n\
                                var widthY = chartDiv.clientWidth;\n\
                                var heightY = chartDiv.clientHeight;\n\
                                var margin = {top: 20, right: 20, bottom: 30, left: 40};\n\
                                var data = [{index: 0, value: 3},\n\
                                    {index: 1, value: 5},\n\
                                    {index: 2, value: 12},\n\
                                    {index: 3, value: 8},\n\
                                    {index: 4, value: 20},\n\
                                    {index: 5, value: 7},\n\
                                    {index: 6, value: 2},\n\
                                    {index: 7, value: 15}];\n\
                                var delim = 4;\n\
                                var scaleY = d3.scaleLinear()\n\
                                    .domain([0, 21])\n\
                                    .rangeRound([heightY, 0]);\n\
                                var x = d3.scaleLinear()\n\
                                    .domain([0, data.length])\n\
                                    .rangeRound([0, widthY]);\n\
                                var svgY = d3.select(".class' + classid + '")\n\
                                    .append("svg")\n\
                                     .attr("width", widthY)\n\
                                     .attr("height", heightY)\n\
                                     .attr("class","draggable")\n\
                                     .style("cursor", "move")\n\
                                     .style("onmousedown","selectElement(evt)")\n\
                                    .append(\'g\')\n\
                                     .attr("class","draggable")\n\
                                     .style("cursor","move");\n\
                                svgY\n\
                                  .append(\'rect\')\n\
                                    .attr(\'x\', 0)\n\
                                    .attr(\'y\', 0)\n\
                                    .attr(\'width\', widthY)\n\
                                    .attr(\'height\', heightY)\n\
                                    .attr("class","draggable")\n\
                                    .style("fill","blue")\n\
                                    .style("cursor", "move");\n\
                                var brushY = d3.brushY()\n\
                                    .extent(function(d, i){\n\
                                        return [[x(i) + delim / 2, 0],\n\
                                               [x(i) + x(1) - delim / 2, heightY]];})\n\
                                    .on("brush", brushmoveY)\n\
                                    .on("end", brushendY);\n\
                                var svgbrushY = svgY\n\
                                    .selectAll(\'.brush\')\n\
                                     .data(data)\n\
                                    .enter()\n\
                                     .append(\'g\')\n\
                                      .attr(\'class\',\'brush\')\n\
                                     .append(\'g\')\n\
                                      .call(brushY)\n\
                                      .call(brushY.move, function(d){return [d.value, 0].map(scaleY);})\n\
                                svgbrushY\n\
                                   .append(\'text\')\n\
                                    .attr(\'y\', function(d){return scaleY(d.value) + 25;})\n\
                                    .attr(\'x\', function(d, i){return x(i) + x(0.5);})\n\
                                    .attr(\'dx\', \'-.60em\')\n\
                                    .attr(\'dy\', -5)\n\
                                    .text(function(d){return d3.format(\'.2\')(d.value);});\n\
                                function brushendY(){\n\
                                    if (!d3.event.sourceEvent) return;\n\
                                    if (d3.event.sourceEvent.type === "brush") return;\n\
                                    if (!d3.event.selection) {\n\
                                        svgbrushY.call(brushY.move, function (d){return [d.value, 0].map(scaleY);})};};\n\
                                function brushmoveY(){\n\
                                    if (!d3.event.sourceEvent) return;\n\
                                    if (d3.event.sourceEvent.type === "brush") return;\n\
                                    if (!d3.event.selection) return;\n\
                                    var d0 = d3.event.selection.map(scaleY.invert);\n\
                                    var d = d3.select(this).select(\'.selection\');\n\
                                    d.datum().value = d0[0];\n\
                                    update();};\n\
                                function update(){\n\
                                    svgbrushY\n\
                                     .call(brushY.move, function(d){return [d.value, 0].map(scaleY);})\n\
                                     .selectAll(\'text\')\n\
                                      .attr(\'y\', function(d){return scaleY(d.value) + 25;})\n\
                                      .text(function(d){return d3.format(\'.2\')(d.value);});};\n\
                                function selectElement(evt) {\n\
                                     selectedElement = evt.target;\n\
                                     currentX = evt.clientX;\n\
                                     currentY = evt.clientY;};\n\
                                svgY.selectAll("text,rect")\n\
                                .on("mouseenter", function(){svgY.selectAll("rect").style("cursor", "move").attr("class","draggable");});\n\
                                </script>\n\
                            </div>')
                pagehtml2.write(
                    '<div  drag-resize class="class' + classid + '" id="id' + classid + 'work" style="cursor:move">\n\
                               <button>resize</button>\n\
                                <script src="https://d3js.org/d3.v4.min.js"></script>\n\
                                <script>\n\
                                var chartDiv = document.getElementById("id' + classid + '");\n\
                                var widthY = chartDiv.clientWidth;\n\
                                var heightY = chartDiv.clientHeight;\n\
                                var margin = {top: 20, right: 20, bottom: 30, left: 40};\n\
                                var data = [{index: 0, value: 3},\n\
                                    {index: 1, value: 5},\n\
                                    {index: 2, value: 12},\n\
                                    {index: 3, value: 8},\n\
                                    {index: 4, value: 20},\n\
                                    {index: 5, value: 7},\n\
                                    {index: 6, value: 2},\n\
                                    {index: 7, value: 15}];\n\
                                var delim = 4;\n\
                                var scaleY = d3.scaleLinear()\n\
                                    .domain([0, 21])\n\
                                    .rangeRound([heightY, 0]);\n\
                                var x = d3.scaleLinear()\n\
                                    .domain([0, data.length])\n\
                                    .rangeRound([0, widthY]);\n\
                                var svgY = d3.select(".class' + classid + '")\n\
                                    .append("svg")\n\
                                     .attr("width", widthY)\n\
                                     .attr("height", heightY)\n\
                                     .attr("class","draggable")\n\
                                     .style("cursor", "move")\n\
                                     .style("onmousedown","selectElement(evt)")\n\
                                    .append(\'g\')\n\
                                     .attr("class","draggable")\n\
                                     .style("cursor","move");\n\
                                svgY\n\
                                  .append(\'rect\')\n\
                                    .attr(\'x\', 0)\n\
                                    .attr(\'y\', 0)\n\
                                    .attr(\'width\', widthY)\n\
                                    .attr(\'height\', heightY)\n\
                                    .attr("class","draggable")\n\
                                    .style("fill","blue")\n\
                                    .style("cursor", "move");\n\
                                var brushY = d3.brushY()\n\
                                    .extent(function(d, i){\n\
                                        return [[x(i) + delim / 2, 0],\n\
                                               [x(i) + x(1) - delim / 2, heightY]];})\n\
                                    .on("brush", brushmoveY)\n\
                                    .on("end", brushendY);\n\
                                var svgbrushY = svgY\n\
                                    .selectAll(\'.brush\')\n\
                                     .data(data)\n\
                                    .enter()\n\
                                     .append(\'g\')\n\
                                      .attr(\'class\',\'brush\')\n\
                                     .append(\'g\')\n\
                                      .call(brushY)\n\
                                      .call(brushY.move, function(d){return [d.value, 0].map(scaleY);})\n\
                                svgbrushY\n\
                                   .append(\'text\')\n\
                                    .attr(\'y\', function(d){return scaleY(d.value) + 25;})\n\
                                    .attr(\'x\', function(d, i){return x(i) + x(0.5);})\n\
                                    .attr(\'dx\', \'-.60em\')\n\
                                    .attr(\'dy\', -5)\n\
                                    .text(function(d){return d3.format(\'.2\')(d.value);});\n\
                                function brushendY(){\n\
                                    if (!d3.event.sourceEvent) return;\n\
                                    if (d3.event.sourceEvent.type === "brush") return;\n\
                                    if (!d3.event.selection) {\n\
                                        svgbrushY.call(brushY.move, function (d){return [d.value, 0].map(scaleY);})};};\n\
                                function brushmoveY(){\n\
                                    if (!d3.event.sourceEvent) return;\n\
                                    if (d3.event.sourceEvent.type === "brush") return;\n\
                                    if (!d3.event.selection) return;\n\
                                    var d0 = d3.event.selection.map(scaleY.invert);\n\
                                    var d = d3.select(this).select(\'.selection\');\n\
                                    d.datum().value = d0[0];\n\
                                    update();};\n\
                                function update(){\n\
                                    svgbrushY\n\
                                     .call(brushY.move, function(d){return [d.value, 0].map(scaleY);})\n\
                                     .selectAll(\'text\')\n\
                                      .attr(\'y\', function(d){return scaleY(d.value) + 25;})\n\
                                      .text(function(d){return d3.format(\'.2\')(d.value);});};\n\
                                function selectElement(evt) {\n\
                                     selectedElement = evt.target;\n\
                                     currentX = evt.clientX;\n\
                                     currentY = evt.clientY;};\n\
                                svgY.selectAll("text,rect")\n\
                                .on("mouseenter", function(){svgY.selectAll("rect").style("cursor", "move").attr("class","draggable");});\n\
                                </script>\n\
                            </div>')
                pagehtml3.write(
                    '<div  drag-resize class="class' + classid + '" id="id' + classid + 'suggestions" style="cursor:move">\n\
                               <button>resize</button>\n\
                                <script src="https://d3js.org/d3.v4.min.js"></script>\n\
                                <script>\n\
                                var chartDiv = document.getElementById("id' + classid + '");\n\
                                var widthY = chartDiv.clientWidth;\n\
                                var heightY = chartDiv.clientHeight;\n\
                                var margin = {top: 20, right: 20, bottom: 30, left: 40};\n\
                                var data = [{index: 0, value: 3},\n\
                                    {index: 1, value: 5},\n\
                                    {index: 2, value: 12},\n\
                                    {index: 3, value: 8},\n\
                                    {index: 4, value: 20},\n\
                                    {index: 5, value: 7},\n\
                                    {index: 6, value: 2},\n\
                                    {index: 7, value: 15}];\n\
                                var delim = 4;\n\
                                var scaleY = d3.scaleLinear()\n\
                                    .domain([0, 21])\n\
                                    .rangeRound([heightY, 0]);\n\
                                var x = d3.scaleLinear()\n\
                                    .domain([0, data.length])\n\
                                    .rangeRound([0, widthY]);\n\
                                var svgY = d3.select(".class' + classid + '")\n\
                                    .append("svg")\n\
                                     .attr("width", widthY)\n\
                                     .attr("height", heightY)\n\
                                     .attr("class","draggable")\n\
                                     .style("cursor", "move")\n\
                                     .style("onmousedown","selectElement(evt)")\n\
                                    .append(\'g\')\n\
                                     .attr("class","draggable")\n\
                                     .style("cursor","move");\n\
                                svgY\n\
                                  .append(\'rect\')\n\
                                    .attr(\'x\', 0)\n\
                                    .attr(\'y\', 0)\n\
                                    .attr(\'width\', widthY)\n\
                                    .attr(\'height\', heightY)\n\
                                    .attr("class","draggable")\n\
                                    .style("fill","blue")\n\
                                    .style("cursor", "move");\n\
                                var brushY = d3.brushY()\n\
                                    .extent(function(d, i){\n\
                                        return [[x(i) + delim / 2, 0],\n\
                                               [x(i) + x(1) - delim / 2, heightY]];})\n\
                                    .on("brush", brushmoveY)\n\
                                    .on("end", brushendY);\n\
                                var svgbrushY = svgY\n\
                                    .selectAll(\'.brush\')\n\
                                     .data(data)\n\
                                    .enter()\n\
                                     .append(\'g\')\n\
                                      .attr(\'class\',\'brush\')\n\
                                     .append(\'g\')\n\
                                      .call(brushY)\n\
                                      .call(brushY.move, function(d){return [d.value, 0].map(scaleY);})\n\
                                svgbrushY\n\
                                   .append(\'text\')\n\
                                    .attr(\'y\', function(d){return scaleY(d.value) + 25;})\n\
                                    .attr(\'x\', function(d, i){return x(i) + x(0.5);})\n\
                                    .attr(\'dx\', \'-.60em\')\n\
                                    .attr(\'dy\', -5)\n\
                                    .text(function(d){return d3.format(\'.2\')(d.value);});\n\
                                function brushendY(){\n\
                                    if (!d3.event.sourceEvent) return;\n\
                                    if (d3.event.sourceEvent.type === "brush") return;\n\
                                    if (!d3.event.selection) {\n\
                                        svgbrushY.call(brushY.move, function (d){return [d.value, 0].map(scaleY);})};};\n\
                                function brushmoveY(){\n\
                                    if (!d3.event.sourceEvent) return;\n\
                                    if (d3.event.sourceEvent.type === "brush") return;\n\
                                    if (!d3.event.selection) return;\n\
                                    var d0 = d3.event.selection.map(scaleY.invert);\n\
                                    var d = d3.select(this).select(\'.selection\');\n\
                                    d.datum().value = d0[0];\n\
                                    update();};\n\
                                function update(){\n\
                                    svgbrushY\n\
                                     .call(brushY.move, function(d){return [d.value, 0].map(scaleY);})\n\
                                     .selectAll(\'text\')\n\
                                      .attr(\'y\', function(d){return scaleY(d.value) + 25;})\n\
                                      .text(function(d){return d3.format(\'.2\')(d.value);});};\n\
                                function selectElement(evt) {\n\
                                     selectedElement = evt.target;\n\
                                     currentX = evt.clientX;\n\
                                     currentY = evt.clientY;};\n\
                                svgY.selectAll("text,rect")\n\
                                .on("mouseenter", function(){svgY.selectAll("rect").style("cursor", "move").attr("class","draggable");});\n\
                                </script>\n\
                            </div>')
                pagecss.write(
                    '.class' + classid + '{height:' + height + '%; width:' + width + '%; max-height:' + height + '%; max-width:' + width + '%;position:absolute; left:' + positionL + '%; top:' + positionT + '%}' + ' ' + '#id' + classid + '{}\n\
                    .rect{ fill: #4bff00; display:unset!important;}\n\
                    .rect:hover {\n\
                    fill: red;}\n\
                    .class' + classid + ':hover {}\n\
                    .class' + classid + ':hover button {visibility: visible;}\n\
                     ')

            def create_pieChart2_old(icon_path, classid, width, height, positionL, positionT, link):

                pagehtml.write(
                    '<div drag-resize class="class' + classid + '" id="id' + classid + '">\n\
                                 <button>Randomise</button>\n\
                                    <script src="http://d3js.org/d3.v3.min.js"></script>\n\
                                    <script>\n\
                                    var svg = d3.select(".class' + classid + '")\n\
                                        .append("svg")\n\
                                        .append("g")\n\
                                    svg.append("g")\n\
                                        .attr("class", "slices");\n\
                                    svg.append("g")\n\
                                        .attr("class", "labels");\n\
                                    svg.append("g")\n\
                                        .attr("class", "lines");\n\
                                    var chartDiv = document.getElementById("id' + classid + '"),\n\
                                        width= chartDiv.clientWidth,\n\
                                        height= chartDiv.clientHeight,\n\
                                        radius = Math.min(width, height) / 2;\n\
                                    var pie = d3.layout.pie()\n\
                                        .sort(null)\n\
                                        .value(function(d) {\n\
                                        return d.value;\n\
                                        });\n\
                                    var arc = d3.svg.arc()\n\
                                        .outerRadius(radius * 0.8)\n\
                                        .innerRadius(radius * 0.4);\n\
                                    var outerArc = d3.svg.arc()\n\
                                        .innerRadius(radius * 0.9)\n\
                                        .outerRadius(radius * 0.9);\n\
                                    svg.attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");\n\
                                    var key = function(d){ return d.data.label; };\n\
                                    var color = d3.scale.ordinal()\n\
                                        .domain(["Lorem ipsum", "dolor sit", "amet", "consectetur", "adipisicing", "elit", "sed", "do", "eiusmod", "tempor", "incididunt"])\n\
                                        .range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);\n\
                                    function randomData (){\n\
                                        var labels = color.domain();\n\
                                        return labels.map(function(label){\n\
                                            return { label: label, value: Math.random() }\n\
                                        });\n\
                                    }\n\
                                    change(randomData());\n\
                                    d3.select(".randomize")\n\
                                        .on("click", function(){\n\
                                        change(randomData());\n\
                                        });\n\
                                    function change(data) {\n\
                                    var slice = svg.select(".slices").selectAll("path.slice")\n\
                                        .data(pie(data), key);\n\
                                    slice.enter()\n\
                                        .insert("path")\n\
                                        .style("fill", function(d) { return color(d.data.label); })\n\
                                        .attr("class", "slice");\n\
                                    slice\n\
                                        .transition().duration(1000)\n\
                                        .attrTween("d", function(d) {\n\
                                            this._current = this._current || d;\n\
                                            var interpolate = d3.interpolate(this._current, d);\n\
                                            this._current = interpolate(0);\n\
                                            return function(t) {\n\
                                            return arc(interpolate(t));\n\
                                            };\n\
                                        })\n\
                                    slice.exit()\n\
                                        .remove();\n\
                                    var text = svg.select(".labels").selectAll("text")\n\
                                        .data(pie(data), key);\n\
                                    text.enter()\n\
                                        .append("text")\n\
                                        .attr("dy", ".35em")\n\
                                        .text(function(d) {\n\
                                        return d.data.label;\n\
                                        });\n\
                                    function midAngle(d){\n\
                                    return d.startAngle + (d.endAngle - d.startAngle)/2;\n\
                                    }\n\
                                    text.transition().duration(1000)\n\
                                        .attrTween("transform", function(d) {\n\
                                            this._current = this._current || d;\n\
                                            var interpolate = d3.interpolate(this._current, d);\n\
                                            this._current = interpolate(0);\n\
                                            return function(t) {\n\
                                                var d2 = interpolate(t);\n\
                                                var pos = outerArc.centroid(d2);\n\
                                                pos[0] = radius * (midAngle(d2) < Math.PI ? 1 : -1);\n\
                                                return "translate("+ pos +")";\n\
                                            };\n\
                                        })\n\
                                        .styleTween("text-anchor", function(d){\n\
                                            this._current = this._current || d;\n\
                                            var interpolate = d3.interpolate(this._current, d);\n\
                                            this._current = interpolate(0);\n\
                                            return function(t) {\n\
                                                var d2 = interpolate(t);\n\
                                                return midAngle(d2) < Math.PI ? "start":"end";\n\
                                            };\n\
                                        });\n\
                                    text.exit()\n\
                                        .remove();\n\
                                    var polyline = svg.select(".lines").selectAll("polyline")\n\
                                        .data(pie(data), key);\n\
                                    polyline.enter()\n\
                                        .append("polyline");\n\
                                    polyline.transition().duration(1000)\n\
                                        .attrTween("points", function(d){\n\
                                            this._current = this._current || d;\n\
                                            var interpolate = d3.interpolate(this._current, d);\n\
                                            this._current = interpolate(0);\n\
                                            return function(t) {\n\
                                                var d2 = interpolate(t);\n\
                                                var pos = outerArc.centroid(d2);\n\
                                                pos[0] = radius * 0.95 * (midAngle(d2) < Math.PI ? 1 : -1);\n\
                                                return [arc.centroid(d2), outerArc.centroid(d2), pos];\n\
                                            };\n\
                                        });\n\
                                    polyline.exit()\n\
                                        .remove();\n\
                                    };\n\
                                    </script>\n\
                                 </div>')
                pagehtml1.write(
                    '<div drag-resize class="class' + classid + '" id="id' + classid + 'pro">\n\
                                             <button>Randomise</button>\n\
                                                <script src="http://d3js.org/d3.v3.min.js"></script>\n\
                                                <script>\n\
                                                var svg = d3.select(".class' + classid + '")\n\
                                                    .append("svg")\n\
                                                    .append("g")\n\
                                                svg.append("g")\n\
                                                    .attr("class", "slices");\n\
                                                svg.append("g")\n\
                                                    .attr("class", "labels");\n\
                                                svg.append("g")\n\
                                                    .attr("class", "lines");\n\
                                                var chartDiv = document.getElementById("id' + classid + '"),\n\
                                                    width= chartDiv.clientWidth,\n\
                                                    height= chartDiv.clientHeight,\n\
                                                    radius = Math.min(width, height) / 2;\n\
                                                var pie = d3.layout.pie()\n\
                                                    .sort(null)\n\
                                                    .value(function(d) {\n\
                                                    return d.value;\n\
                                                    });\n\
                                                var arc = d3.svg.arc()\n\
                                                    .outerRadius(radius * 0.8)\n\
                                                    .innerRadius(radius * 0.4);\n\
                                                var outerArc = d3.svg.arc()\n\
                                                    .innerRadius(radius * 0.9)\n\
                                                    .outerRadius(radius * 0.9);\n\
                                                svg.attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");\n\
                                                var key = function(d){ return d.data.label; };\n\
                                                var color = d3.scale.ordinal()\n\
                                                    .domain(["Lorem ipsum", "dolor sit", "amet", "consectetur", "adipisicing", "elit", "sed", "do", "eiusmod", "tempor", "incididunt"])\n\
                                                    .range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);\n\
                                                function randomData (){\n\
                                                    var labels = color.domain();\n\
                                                    return labels.map(function(label){\n\
                                                        return { label: label, value: Math.random() }\n\
                                                    });\n\
                                                }\n\
                                                change(randomData());\n\
                                                d3.select(".randomize")\n\
                                                    .on("click", function(){\n\
                                                    change(randomData());\n\
                                                    });\n\
                                                function change(data) {\n\
                                                var slice = svg.select(".slices").selectAll("path.slice")\n\
                                                    .data(pie(data), key);\n\
                                                slice.enter()\n\
                                                    .insert("path")\n\
                                                    .style("fill", function(d) { return color(d.data.label); })\n\
                                                    .attr("class", "slice");\n\
                                                slice\n\
                                                    .transition().duration(1000)\n\
                                                    .attrTween("d", function(d) {\n\
                                                        this._current = this._current || d;\n\
                                                        var interpolate = d3.interpolate(this._current, d);\n\
                                                        this._current = interpolate(0);\n\
                                                        return function(t) {\n\
                                                        return arc(interpolate(t));\n\
                                                        };\n\
                                                    })\n\
                                                slice.exit()\n\
                                                    .remove();\n\
                                                var text = svg.select(".labels").selectAll("text")\n\
                                                    .data(pie(data), key);\n\
                                                text.enter()\n\
                                                    .append("text")\n\
                                                    .attr("dy", ".35em")\n\
                                                    .text(function(d) {\n\
                                                    return d.data.label;\n\
                                                    });\n\
                                                function midAngle(d){\n\
                                                return d.startAngle + (d.endAngle - d.startAngle)/2;\n\
                                                }\n\
                                                text.transition().duration(1000)\n\
                                                    .attrTween("transform", function(d) {\n\
                                                        this._current = this._current || d;\n\
                                                        var interpolate = d3.interpolate(this._current, d);\n\
                                                        this._current = interpolate(0);\n\
                                                        return function(t) {\n\
                                                            var d2 = interpolate(t);\n\
                                                            var pos = outerArc.centroid(d2);\n\
                                                            pos[0] = radius * (midAngle(d2) < Math.PI ? 1 : -1);\n\
                                                            return "translate("+ pos +")";\n\
                                                        };\n\
                                                    })\n\
                                                    .styleTween("text-anchor", function(d){\n\
                                                        this._current = this._current || d;\n\
                                                        var interpolate = d3.interpolate(this._current, d);\n\
                                                        this._current = interpolate(0);\n\
                                                        return function(t) {\n\
                                                            var d2 = interpolate(t);\n\
                                                            return midAngle(d2) < Math.PI ? "start":"end";\n\
                                                        };\n\
                                                    });\n\
                                                text.exit()\n\
                                                    .remove();\n\
                                                var polyline = svg.select(".lines").selectAll("polyline")\n\
                                                    .data(pie(data), key);\n\
                                                polyline.enter()\n\
                                                    .append("polyline");\n\
                                                polyline.transition().duration(1000)\n\
                                                    .attrTween("points", function(d){\n\
                                                        this._current = this._current || d;\n\
                                                        var interpolate = d3.interpolate(this._current, d);\n\
                                                        this._current = interpolate(0);\n\
                                                        return function(t) {\n\
                                                            var d2 = interpolate(t);\n\
                                                            var pos = outerArc.centroid(d2);\n\
                                                            pos[0] = radius * 0.95 * (midAngle(d2) < Math.PI ? 1 : -1);\n\
                                                            return [arc.centroid(d2), outerArc.centroid(d2), pos];\n\
                                                        };\n\
                                                    });\n\
                                                polyline.exit()\n\
                                                    .remove();\n\
                                                };\n\
                                                </script>\n\
                                             </div>')
                pagehtml2.write(
                    '<div drag-resize class="class' + classid + '" id="id' + classid + 'work">\n\
                                             <button>Randomise</button>\n\
                                                <script src="http://d3js.org/d3.v3.min.js"></script>\n\
                                                <script>\n\
                                                var svg = d3.select(".class' + classid + '")\n\
                                                    .append("svg")\n\
                                                    .append("g")\n\
                                                svg.append("g")\n\
                                                    .attr("class", "slices");\n\
                                                svg.append("g")\n\
                                                    .attr("class", "labels");\n\
                                                svg.append("g")\n\
                                                    .attr("class", "lines");\n\
                                                var chartDiv = document.getElementById("id' + classid + '"),\n\
                                                    width= chartDiv.clientWidth,\n\
                                                    height= chartDiv.clientHeight,\n\
                                                    radius = Math.min(width, height) / 2;\n\
                                                var pie = d3.layout.pie()\n\
                                                    .sort(null)\n\
                                                    .value(function(d) {\n\
                                                    return d.value;\n\
                                                    });\n\
                                                var arc = d3.svg.arc()\n\
                                                    .outerRadius(radius * 0.8)\n\
                                                    .innerRadius(radius * 0.4);\n\
                                                var outerArc = d3.svg.arc()\n\
                                                    .innerRadius(radius * 0.9)\n\
                                                    .outerRadius(radius * 0.9);\n\
                                                svg.attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");\n\
                                                var key = function(d){ return d.data.label; };\n\
                                                var color = d3.scale.ordinal()\n\
                                                    .domain(["Lorem ipsum", "dolor sit", "amet", "consectetur", "adipisicing", "elit", "sed", "do", "eiusmod", "tempor", "incididunt"])\n\
                                                    .range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);\n\
                                                function randomData (){\n\
                                                    var labels = color.domain();\n\
                                                    return labels.map(function(label){\n\
                                                        return { label: label, value: Math.random() }\n\
                                                    });\n\
                                                }\n\
                                                change(randomData());\n\
                                                d3.select(".randomize")\n\
                                                    .on("click", function(){\n\
                                                    change(randomData());\n\
                                                    });\n\
                                                function change(data) {\n\
                                                var slice = svg.select(".slices").selectAll("path.slice")\n\
                                                    .data(pie(data), key);\n\
                                                slice.enter()\n\
                                                    .insert("path")\n\
                                                    .style("fill", function(d) { return color(d.data.label); })\n\
                                                    .attr("class", "slice");\n\
                                                slice\n\
                                                    .transition().duration(1000)\n\
                                                    .attrTween("d", function(d) {\n\
                                                        this._current = this._current || d;\n\
                                                        var interpolate = d3.interpolate(this._current, d);\n\
                                                        this._current = interpolate(0);\n\
                                                        return function(t) {\n\
                                                        return arc(interpolate(t));\n\
                                                        };\n\
                                                    })\n\
                                                slice.exit()\n\
                                                    .remove();\n\
                                                var text = svg.select(".labels").selectAll("text")\n\
                                                    .data(pie(data), key);\n\
                                                text.enter()\n\
                                                    .append("text")\n\
                                                    .attr("dy", ".35em")\n\
                                                    .text(function(d) {\n\
                                                    return d.data.label;\n\
                                                    });\n\
                                                function midAngle(d){\n\
                                                return d.startAngle + (d.endAngle - d.startAngle)/2;\n\
                                                }\n\
                                                text.transition().duration(1000)\n\
                                                    .attrTween("transform", function(d) {\n\
                                                        this._current = this._current || d;\n\
                                                        var interpolate = d3.interpolate(this._current, d);\n\
                                                        this._current = interpolate(0);\n\
                                                        return function(t) {\n\
                                                            var d2 = interpolate(t);\n\
                                                            var pos = outerArc.centroid(d2);\n\
                                                            pos[0] = radius * (midAngle(d2) < Math.PI ? 1 : -1);\n\
                                                            return "translate("+ pos +")";\n\
                                                        };\n\
                                                    })\n\
                                                    .styleTween("text-anchor", function(d){\n\
                                                        this._current = this._current || d;\n\
                                                        var interpolate = d3.interpolate(this._current, d);\n\
                                                        this._current = interpolate(0);\n\
                                                        return function(t) {\n\
                                                            var d2 = interpolate(t);\n\
                                                            return midAngle(d2) < Math.PI ? "start":"end";\n\
                                                        };\n\
                                                    });\n\
                                                text.exit()\n\
                                                    .remove();\n\
                                                var polyline = svg.select(".lines").selectAll("polyline")\n\
                                                    .data(pie(data), key);\n\
                                                polyline.enter()\n\
                                                    .append("polyline");\n\
                                                polyline.transition().duration(1000)\n\
                                                    .attrTween("points", function(d){\n\
                                                        this._current = this._current || d;\n\
                                                        var interpolate = d3.interpolate(this._current, d);\n\
                                                        this._current = interpolate(0);\n\
                                                        return function(t) {\n\
                                                            var d2 = interpolate(t);\n\
                                                            var pos = outerArc.centroid(d2);\n\
                                                            pos[0] = radius * 0.95 * (midAngle(d2) < Math.PI ? 1 : -1);\n\
                                                            return [arc.centroid(d2), outerArc.centroid(d2), pos];\n\
                                                        };\n\
                                                    });\n\
                                                polyline.exit()\n\
                                                    .remove();\n\
                                                };\n\
                                                </script>\n\
                                             </div>')
                pagehtml3.write(
                    '<div drag-resize class="class' + classid + '" id="id' + classid + 'suggestions">\n\
                                             <button>Randomise</button>\n\
                                                <script src="http://d3js.org/d3.v3.min.js"></script>\n\
                                                <script>\n\
                                                var svg = d3.select(".class' + classid + '")\n\
                                                    .append("svg")\n\
                                                    .append("g")\n\
                                                svg.append("g")\n\
                                                    .attr("class", "slices");\n\
                                                svg.append("g")\n\
                                                    .attr("class", "labels");\n\
                                                svg.append("g")\n\
                                                    .attr("class", "lines");\n\
                                                var chartDiv = document.getElementById("id' + classid + '"),\n\
                                                    width= chartDiv.clientWidth,\n\
                                                    height= chartDiv.clientHeight,\n\
                                                    radius = Math.min(width, height) / 2;\n\
                                                var pie = d3.layout.pie()\n\
                                                    .sort(null)\n\
                                                    .value(function(d) {\n\
                                                    return d.value;\n\
                                                    });\n\
                                                var arc = d3.svg.arc()\n\
                                                    .outerRadius(radius * 0.8)\n\
                                                    .innerRadius(radius * 0.4);\n\
                                                var outerArc = d3.svg.arc()\n\
                                                    .innerRadius(radius * 0.9)\n\
                                                    .outerRadius(radius * 0.9);\n\
                                                svg.attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");\n\
                                                var key = function(d){ return d.data.label; };\n\
                                                var color = d3.scale.ordinal()\n\
                                                    .domain(["Lorem ipsum", "dolor sit", "amet", "consectetur", "adipisicing", "elit", "sed", "do", "eiusmod", "tempor", "incididunt"])\n\
                                                    .range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);\n\
                                                function randomData (){\n\
                                                    var labels = color.domain();\n\
                                                    return labels.map(function(label){\n\
                                                        return { label: label, value: Math.random() }\n\
                                                    });\n\
                                                }\n\
                                                change(randomData());\n\
                                                d3.select(".randomize")\n\
                                                    .on("click", function(){\n\
                                                    change(randomData());\n\
                                                    });\n\
                                                function change(data) {\n\
                                                var slice = svg.select(".slices").selectAll("path.slice")\n\
                                                    .data(pie(data), key);\n\
                                                slice.enter()\n\
                                                    .insert("path")\n\
                                                    .style("fill", function(d) { return color(d.data.label); })\n\
                                                    .attr("class", "slice");\n\
                                                slice\n\
                                                    .transition().duration(1000)\n\
                                                    .attrTween("d", function(d) {\n\
                                                        this._current = this._current || d;\n\
                                                        var interpolate = d3.interpolate(this._current, d);\n\
                                                        this._current = interpolate(0);\n\
                                                        return function(t) {\n\
                                                        return arc(interpolate(t));\n\
                                                        };\n\
                                                    })\n\
                                                slice.exit()\n\
                                                    .remove();\n\
                                                var text = svg.select(".labels").selectAll("text")\n\
                                                    .data(pie(data), key);\n\
                                                text.enter()\n\
                                                    .append("text")\n\
                                                    .attr("dy", ".35em")\n\
                                                    .text(function(d) {\n\
                                                    return d.data.label;\n\
                                                    });\n\
                                                function midAngle(d){\n\
                                                return d.startAngle + (d.endAngle - d.startAngle)/2;\n\
                                                }\n\
                                                text.transition().duration(1000)\n\
                                                    .attrTween("transform", function(d) {\n\
                                                        this._current = this._current || d;\n\
                                                        var interpolate = d3.interpolate(this._current, d);\n\
                                                        this._current = interpolate(0);\n\
                                                        return function(t) {\n\
                                                            var d2 = interpolate(t);\n\
                                                            var pos = outerArc.centroid(d2);\n\
                                                            pos[0] = radius * (midAngle(d2) < Math.PI ? 1 : -1);\n\
                                                            return "translate("+ pos +")";\n\
                                                        };\n\
                                                    })\n\
                                                    .styleTween("text-anchor", function(d){\n\
                                                        this._current = this._current || d;\n\
                                                        var interpolate = d3.interpolate(this._current, d);\n\
                                                        this._current = interpolate(0);\n\
                                                        return function(t) {\n\
                                                            var d2 = interpolate(t);\n\
                                                            return midAngle(d2) < Math.PI ? "start":"end";\n\
                                                        };\n\
                                                    });\n\
                                                text.exit()\n\
                                                    .remove();\n\
                                                var polyline = svg.select(".lines").selectAll("polyline")\n\
                                                    .data(pie(data), key);\n\
                                                polyline.enter()\n\
                                                    .append("polyline");\n\
                                                polyline.transition().duration(1000)\n\
                                                    .attrTween("points", function(d){\n\
                                                        this._current = this._current || d;\n\
                                                        var interpolate = d3.interpolate(this._current, d);\n\
                                                        this._current = interpolate(0);\n\
                                                        return function(t) {\n\
                                                            var d2 = interpolate(t);\n\
                                                            var pos = outerArc.centroid(d2);\n\
                                                            pos[0] = radius * 0.95 * (midAngle(d2) < Math.PI ? 1 : -1);\n\
                                                            return [arc.centroid(d2), outerArc.centroid(d2), pos];\n\
                                                        };\n\
                                                    });\n\
                                                polyline.exit()\n\
                                                    .remove();\n\
                                                };\n\
                                                </script>\n\
                                             </div>')
                pagecss.write(
                    '.class' + classid + '{height:' + height + '%; width:' + width + '%; max-height:' + height + '%; max-width:' + width + '%;position:absolute; left:' + positionL + '%; top:' + positionT + '%}' + ' ' + '#id' + classid + '{}\n\
                                    svg {width: 100%;height: 100%;}\n\
                                    path.slice{stroke-width:2px;}\n\
                                    polyline{opacity: .3; stroke: black; stroke-width: 2px; fill: none;}\n\
                                        ')

            def create_calendar_old(icon_path, classid, width, height, positionL, positionT, link):
                # pagehtml.write(
                # '< div id = "classContainer-selector"class ="class' + str(classid) + '"">\n\
                # < time id = "msg" > < / time >\n\
                # <script> function test() {\n\
                # document.getElementById("msg").innerHTML = Date();}\n\
                # </script>')

                pagehtml.write(
                    '<div id="classContainer-selector" class="class' + str(classid) + '"">')

                pagehtml.write(
                    '<div class="calendar-month-name">')
                pagehtml1.write(
                    '<div id="classContainer-selectorPro" class="class' + str(classid) + '"">')

                pagehtml1.write(
                    '<div class="calendar-month-name">')
                pagehtml2.write(
                    '<div id="classContainer-selectorWork" class="class' + str(classid) + '"">')

                pagehtml2.write(
                    '<div class="calendar-month-name">')

                pagehtml3.write(
                    '<div id="classContainer-selectorSuggestions" class="class' + str(classid) + '"">')

                pagehtml3.write(
                    '<div class="calendar-month-name">')

                currentdate = datetime.today()
                currentYear = currentdate.year
                currentMonth = currentdate.month
                daysShort = ["S", "M", "T", "W", "T", "F", "S"]
                monthNames = [
                    "January",
                    "February",
                    "March",
                    "April",
                    "May",
                    "June",
                    "July",
                    "August",
                    "September",
                    "October",
                    "November",
                    "December"
                ]
                monthDays = [
                    31,
                    28,
                    31,
                    30,
                    31,
                    30,
                    31,
                    31,
                    30,
                    31,
                    30,
                    31
                ]
                day = currentdate.day
                numDays = monthDays[currentMonth - 1]
                currentWeekday = currentdate.weekday()
                monthName = monthNames[currentMonth - 1]

                pagehtml.write(
                    '<span class="month-name">\n\
                    <b>' + str(monthName) + ' </b>' + str(currentYear) + '</span>\n\
                            </div>')

                pagehtml.write(
                    '<div class="calendar-month">\n\
                        <table class="calendar">\n\
                            <thead class="calendar-header">\n\
                                <tr class="calendar-row">')
                pagehtml1.write(
                    '<span class="month-name">\n\
                    <b>' + str(monthName) + ' </b>' + str(currentYear) + '</span>\n\
                                        </div>')

                pagehtml1.write(
                    '<div class="calendar-month">\n\
                        <table class="calendar">\n\
                            <thead class="calendar-header">\n\
                                <tr class="calendar-row">')

                pagehtml2.write(
                    '<span class="month-name">\n\
                    <b>' + str(monthName) + ' </b>' + str(currentYear) + '</span>\n\
                            </div>')

                pagehtml2.write(
                    '<div class="calendar-month">\n\
                        <table class="calendar">\n\
                            <thead class="calendar-header">\n\
                                <tr class="calendar-row">')
                pagehtml3.write(
                    '<span class="month-name">\n\
                    <b>' + str(monthName) + ' </b>' + str(currentYear) + '</span>\n\
                                        </div>')

                pagehtml3.write(
                    '<div class="calendar-month">\n\
                        <table class="calendar">\n\
                            <thead class="calendar-header">\n\
                                <tr class="calendar-row">')

                for i in range(0, len(daysShort)):
                    pagehtml.write(
                        '<th>' + str(daysShort[i]) + '</th>')
                for i in range(0, len(daysShort)):
                    pagehtml1.write(
                        '<th>' + str(daysShort[i]) + '</th>')

                for i in range(0, len(daysShort)):
                    pagehtml2.write(
                        '<th>' + str(daysShort[i]) + '</th>')
                for i in range(0, len(daysShort)):
                    pagehtml3.write(
                        '<th>' + str(daysShort[i]) + '</th>')

                pagehtml.write(
                    '</tr>\n\
                    </thead>')

                pagehtml.write(
                    '<tbody class="calendar-body">')
                pagehtml1.write(
                    '</tr>\n\
                    </thead>')

                pagehtml1.write(
                    '<tbody class="calendar-body">')

                pagehtml2.write(
                    '</tr>\n\
                    </thead>')

                pagehtml2.write(
                    '<tbody class="calendar-body">')
                pagehtml3.write(
                    '</tr>\n\
                    </thead>')

                pagehtml3.write(
                    '<tbody class="calendar-body">')

                d = 1
                while d <= numDays:
                    print(str(d))
                    pagehtml.write(
                        '<tr>')
                    pagehtml1.write(
                        '<tr>')
                    pagehtml2.write(
                        '<tr>')
                    pagehtml3.write(
                        '<tr>')
                    for i in range(0, 7):
                        de = date(int(str(currentYear)), int(str(currentMonth)), d)
                        if (int(de.weekday()) == i):
                            pagehtml.write(
                                '<td>' + str(d) + '</td>')
                            pagehtml1.write(
                                '<td>' + str(d) + '</td>')
                            pagehtml2.write(
                                '<td>' + str(d) + '</td>')
                            pagehtml3.write(
                                '<td>' + str(d) + '</td>')
                            d += 1
                        else:
                            pagehtml.write(
                                '<td>''</td>')
                            pagehtml1.write(
                                '<td>''</td>')
                            pagehtml2.write(
                                '<td>''</td>')
                            pagehtml3.write(
                                '<td>''</td>')
                        if d > numDays:
                            break
                pagehtml.write(
                    '</tr>')
                pagehtml1.write(
                    '</tr>')

                pagehtml2.write(
                    '</tr>')
                pagehtml3.write(
                    '</tr>')

                pagehtml.write(
                    '</tbody>\n\
                    </table>\n\
                        </div>\n\
                        </div>')
                pagehtml1.write(
                    '</tbody>\n\
                    </table>\n\
                        </div>\n\
                        </div>')
                pagehtml2.write(
                    '</tbody>\n\
                    </table>\n\
                        </div>\n\
                        </div>')
                pagehtml3.write(
                    '</tbody>\n\
                    </table>\n\
                        </div>\n\
                        </div>')
                pagecss.write(
                    '.class' + classid + '{height:' + height + '%; width:' + width + '%; max-height:' + height + '%; max-width:' + width + '%;position:absolute; left:' + positionL + '%; top:' + positionT + '%}' + ' ' + '#id' + classid + '}\n\
                    .calendar {border: 1px solid #000;}\n\
                    .calendar-head th {padding: 3px 5px; border-bottom: 1px solid #000;text-align: center;}\n\
                    .calendar-body td {padding: 3px 5px; text-align: center;}\n\
                    .container {padding: 10px; border: 1px solid;}\n\
                    .cf:before,.cf:after {content: " ";display: table;}\n\
                    .cf:after {clear: both;}')

            def create_selection(classid, text_string, positionL, positionT, fontSize, fontColor, width, textAlign):
                pagehtml.write(
                    '<select drag-resize class="class' + classid + '" id="id' + classid + '"> \n <option value="' + text_string + '">' + text_string + '</option>\n </select>\n')
                pagehtml1.write(
                    '<select drag-resize class="class' + classid + '" id="id' + classid + 'pro"> \n <option value="' + text_string + '">' + text_string + '</option>\n </select>\n')
                pagehtml2.write(
                    '<select drag-resize class="class' + classid + '" id="id' + classid + 'work"> \n <option value="' + text_string + '">' + text_string + '</option>\n </select>\n')
                pagehtml3.write(
                    '<select drag-resize class="class' + classid + '" id="id' + classid + 'suggestions"> \n <option value="' + text_string + '">' + text_string + '</option>\n </select>\n')
                pagecss.write(
                    '.class' + classid + '{position:absolute; text-align: ' + textAlign + '; left:' + positionL + '%; top:' + positionT + '%;\
                              width:' + width + '%; margin : 0px; font-size: ' + fontSize + 'px;color: ' + fontColor + '}' + ' ' + '#id' + classid + '{}\n')

            def create_title(h_type, classid, text_string, positionL, positionT):
                pagehtml.write(
                    '<' + h_type + ' class="draggable resize-drag' + classid + '" id="id' + classid + '">' + text_string + '</' + h_type + '>\n')
                pagehtml1.write(
                    '<' + h_type + ' class="draggable resize-drag' + classid + '" id="id' + classid + 'pro">' + text_string + '</' + h_type + '>\n')
                pagehtml2.write(
                    '<' + h_type + ' class="draggable resize-drag' + classid + '" id="id' + classid + 'work">' + text_string + '</' + h_type + '>\n')
                pagehtml3.write(
                    '<' + h_type + ' class="draggable resize-drag' + classid + '" id="id' + classid + 'suggestions">' + text_string + '</' + h_type + '>\n')
                pagecss.write(
                    '.class' + classid + '{position:absolute; left:' + positionL + '%; top:' + positionT + '%}' + ' ' + '#id' + classid + '{}\n')

            def create_section(classid, width, height, positionL, positionT, backgroundImage, backgroundColor, color):
                pagehtml.write(
                    '<section class="draggable resize-drag class' + classid + '" id="id' + classid + '"></section>\n')
                pagehtml1.write(
                    '<section class="draggable resize-drag class' + classid + '" id="id' + classid + 'pro"></section>\n')
                pagehtml2.write(
                    '<section class="draggable resize-drag class' + classid + '" id="id' + classid + 'work"></section>\n')
                pagehtml3.write(
                    '<section class="draggable resize-drag class' + classid + '" id="id' + classid + 'suggestions"></section>\n')
                pagecss.write(
                    '.class' + classid + '{position:absolute; left: ' + positionL + '%; top: ' + positionT + '%;\
                            width:' + width + '%; height:' + height + '%;background-color:' + backgroundColor +
                    '; background-image:url("' + backgroundImage + '"); color:' + color + '}' + ' ' + '#id' + classid + '{}\n')

            def create_open_section(classid, width, height, positionL, positionT, backgroundImage, backgroundColor, color):
                pagehtml.write('<section class="draggable resize-drag class' + classid + '" id="id' + classid + '">\n')
                pagehtml1.write('<section class="draggable resize-drag class' + classid + '" id="id' + classid + 'pro">\n')
                pagehtml2.write('<section class="draggable resize-drag class' + classid + '" id="id' + classid + 'work">\n')
                pagehtml3.write('<section class="draggable resize-drag class' + classid + '" id="id' + classid + 'suggestions">\n')
                pagecss.write(
                    '.class' + classid + '{position:absolute;left:' + positionL + '%;top:' + positionT + '%;\
                            width:' + width + '%; height:' + height + '%;background-color:' + backgroundColor + ';\
                            background-image:url("' + backgroundImage + '"); color:' + color + '}' + ' ' + '#id' + classid + '{}\n')

            def create_close_section():
                pagehtml.write('</section>\n')
                pagehtml1.write('</section>\n')
                pagehtml2.write('</section>\n')
                pagehtml3.write('</section>\n')

            def create_open_div(classid):
                pagehtml.write('<div class="draggable resize-drag class' + classid + '" id="id' + classid + '">\n')
                pagehtml1.write('<div class="draggable resize-drag class' + classid + '" id="id' + classid + 'pro">\n')
                pagehtml2.write('<div class="draggable resize-drag class' + classid + '" id="id' + classid + 'work">\n')
                pagehtml3.write('<div class="draggable resize-drag class' + classid + '" id="id' + classid + 'suggestions">\n')
                pagecss.write('.class' + classid + '{}' + ' ' + '#id' + classid + '{}\n')

            def create_close_div():
                pagehtml.write('</div>\n')
                pagehtml1.write('</div>\n')
                pagehtml2.write('</div>\n')
                pagehtml3.write('</div>\n')

            def write_into_display_div():
                div = "container-inside-frame"
                pagehtml = open('./templates/testing.html', 'r')
                pagehtml1 = open('./templates/testingPro.html', 'r')
                pagehtml2 = open('./templates/testingWork.html', 'r')
                pagehtml3 = open('./templates/testingSuggestions.html', 'r')
                html = pagehtml.read()
                pagehtml.close()
                livre = open('../templates/customize/page2.html', 'r')
                lire = livre.read()
                index = 0
                c = 0
                while c < len(lire):
                    if lire[c:c + 22] == div:
                        c2 = c + 22
                        while c2 < len(lire):
                            if lire[c2] == ">":
                                index = c2
                                ecrire = lire[0:index + 1] + html + lire[index + 1:]
                                pagehtml = open('../templates/customize/page2.html', 'w')
                                pagehtml.write(ecrire)
                                c2 = len(lire) + 1
                            c2 = c2 + 1
                    c = c + 1

                return pagehtml

                # CREATION OF HEADER MENU WITH WHATEVER NUMBER OF HEADINGS

            def create_menu_text(headingsString, side, color, backgroundColor, width, height, positionL, positionT):
                def sentence_to_wordlist(raw):
                    clean = re.sub("[^a-zA-Z0-9]", " ", raw)
                    words = clean.split()
                    return words

                headings = []
                headings = sentence_to_wordlist(headingsString)
                pagehtml.write('<header><ul class="ul_menutop">\n')
                pagehtml1.write('<header><ul class="ul_menutop">\n')
                pagehtml2.write('<header><ul class="ul_menutop">\n')
                pagehtml3.write('<header><ul class="ul_menutop">\n')
                for heading in headings:
                    pagehtml.write(
                        '<li class="li_menutop"><a class="a_menutop" href="#' + heading + '">' + heading + '</a></li>\n')
                    pagehtml1.write(
                        '<li class="li_menutop"><a class="a_menutop" href="#' + heading + '">' + heading + '</a></li>\n')
                    pagehtml2.write(
                        '<li class="li_menutop"><a class="a_menutop" href="#' + heading + '">' + heading + '</a></li>\n')
                    pagehtml3.write(
                        '<li class="li_menutop"><a class="a_menutop" href="#' + heading + '">' + heading + '</a></li>\n')
                pagehtml.write('</ul></header>\n')
                pagehtml1.write('</ul></header>\n')
                pagehtml2.write('</ul></header>\n')
                pagehtml3.write('</ul></header>\n')
                pagecss.write('.ul_menutop{list-style-type: none;\
                        margin: 0;\
                        padding: 0;\
                        overflow: hidden;}\
                        .li_menutop{float:' + side + '}\
                        .li_menutop a {display: inline-block;\
                        color: ' + color + ';\
                        text-align: center;\
                        padding: 14px 16px;\
                        text-decoration: none;}\
                        header{background-color:' + backgroundColor + '; position:absolute; width:' + width + '%;\
                        height:' + height + '%;left:' + positionL + '%;top:' + positionT + '%;}\n')

                # CREATE FORM WITH WHATEVER NUMBER OF BUTTON AND TEXTBOX

            def create_form(nbrTxtB, nbrButton, strTxtB, strButton, actionpage, method_, classfidf):
                def create_button_form(value, width, height, classid, positionL, positionT):
                    pagehtml.write(
                        '<input type="submit" value="' + value + '" class="draggable resize-drag class' + classid + '" id="id' + classid + '"></input>\n')
                    pagehtml1.write(
                        '<input type="submit" value="' + value + '" class="draggable resize-drag class' + classid + '" id="id' + classid + 'pro"></input>\n')
                    pagehtml2.write(
                        '<input type="submit" value="' + value + '" class="draggable resize-drag class' + classid + '" id="id' + classid + 'work"></input>\n')
                    pagehtml3.write(
                        '<input type="submit" value="' + value + '" class="draggable resize-drag class' + classid + '" id="id' + classid + 'suggestions"></input>\n')
                    pagecss.write(
                        '.class' + classid + '{height:' + height + '%; width:' + width + '%;position:absolute;\
                                 left:' + positionL + '%; top:' + positionT + '%;}' + ' ' + '#id' + classid + '{}\n')

                def create_text_box_placeholder_form(placeholder, name, width, height, classid, positionL, positionT):
                    pagehtml.write(
                        '<input type="text" name="' + name + '" class="draggable resize-drag class' + classid + '" id="id' + classid + '" placeholder="' + placeholder + '"></input>\n')
                    pagehtml1.write(
                        '<input type="text" name="' + name + '" class="draggable resize-drag class' + classid + '" id="id' + classid + 'pro" placeholder="' + placeholder + '"></input>\n')
                    pagehtml2.write(
                        '<input type="text" name="' + name + '" class="draggable resize-drag class' + classid + '" id="id' + classid + 'work" placeholder="' + placeholder + '"></input>\n')
                    pagehtml3.write(
                        '<input type="text" name="' + name + '" class="draggable resize-drag class' + classid + '" id="id' + classid + 'suggestions" placeholder="' + placeholder + '"></input>\n')
                    pagecss.write(
                        '.class' + classid + '{height:' + height + '%; width:' + width + '%;position:absolute;\
                                 left:' + positionL + '%; top:' + positionT + '%;}' + ' ' + '#id' + classid + '{}\n')

                '''
                def sentence_to_wordlist(raw):
                    clean = re.sub("[^a-zA-Z0-9]", " ", raw)
                    words = clean.split()
                    return words
    
                txtBInfo = sentence_to_wordlist(strTxtB)
                BInfo = sentence_to_wordlist(strButton)
                txtb = 0
                txtB = []
                txtBInfoIndex = 0
                while txtb < int(nbrTxtB):
                    placeholder = txtBInfo[txtBInfoIndex + 0]
                    name = txtBInfo[txtBInfoIndex + 1]
                    width = txtBInfo[txtBInfoIndex + 2]
                    height = txtBInfo[txtBInfoIndex + 3]
                    classidtb = txtBInfo[txtBInfoIndex + 4]
                    positionL = txtBInfo[txtBInfoIndex + 5]
                    positionT = txtBInfo[txtBInfoIndex + 6]
                    txtBInfoIndex = txtBInfoIndex + 7
                    TextBox = [placeholder, name, width, height, classidtb, positionL,
                               positionT]  # before was class and id check
                    txtB.append(TextBox)
                    txtb = txtb + 1
                b = 0
                B = []
                BInfoIndex = 0
                while b < int(nbrButton):
                    value = BInfo[BInfoIndex + 0]
                    width = BInfo[BInfoIndex + 1]
                    height = BInfo[BInfoIndex + 2]
                    classidb = BInfo[BInfoIndex + 3]
                    positionL = BInfo[BInfoIndex + 4]
                    positionT = BInfo[BInfoIndex + 5]
                    BInfoIndex = BInfoIndex + 6
                    Button = [value, width, height, classidb, positionL, positionT]  # before was class and id check
                    B.append(Button)
                    b = b + 1
    
                pagehtml.write('<form action="/' + actionpage + '" method="' + method_ + '">')
                pagecss.write('.' + classfidf + '{} #' + classfidf + '{}')
                for txtbox in txtB:
                    print('this is the size of txtbox: ' + str(txtbox[2]))
                    if str(txtbox[2]) >= '70':
                        create_text_area(txtbox[0], txtbox[1], txtbox[4], txtbox[2], txtbox[3], txtbox[5], txtbox[6])
                    else:
                        create_text_box_placeholder_form(txtbox[0], txtbox[1], txtbox[2], txtbox[3], txtbox[4], txtbox[5],
                                                         txtbox[6])
                for button in B:
                    create_button_form(button[0], button[1], button[2], button[3], button[4], button[5])
                pagehtml.write('</form>')
                '''
                # STYLE

            def set_background_image(class_, img):
                if (class_ == 'body') | (class_ == 'div') | (class_ == 'section') | (class_ == 'p') | (class_ == 'span') | (
                        class_ == 'em') | (class_ == 'footer'):
                    pagecss.write(class_ + '{background-image: url(./' + img + ');background-size:cover;}\n')
                else:
                    pagecss.write('.' + class_ + '{background-image: url(./' + img + ');background-size:cover;}\n')

            def set_background_color(class_, color):
                if (class_ == 'body') | (class_ == 'div') | (class_ == 'section') | (class_ == 'p') | (class_ == 'span') \
                        | (class_ == 'em') | (class_ == 'footer'):
                    pagecss.write(class_ + '{ background-color:' + color + ';height: inherit;}\n')
                else:
                    pagecss.write('.' + class_ + '{background-color:' + color + '; height: inherit;}\n')

            def colorBoW(croppedOcr):
                '#JVTWN'
                fontColor = "UNKNOWN"
                outside2 = []
                outside3 = []
                outside4 = []
                inside2 = []
                inside3 = []
                inside4 = []
                '#ILBNDY'
                r0 = io.imread(croppedOcr)
                r = color.rgb2gray(io.imread(croppedOcr))
                '#UC'
                contours = measure.find_contours(r, 0.8)
                for n, contour in enumerate(contours):
                    if n == 0:
                        a = 0
                        b = 0
                        c = 0
                        while c < len(contour[:, 1]):
                            string = str(contour[:, 1][c])
                            if string[len(string) - 2:] != ".0":
                                c = c + 1
                            else:
                                a = contour[:, 1][c]
                                c = len(contour[:, 1]) + 1
                        c1 = 0
                        while c1 < len(contour[:, 0]):
                            string = str(contour[:, 0][c1])
                            if string[len(string) - 2:] != ".0":
                                c1 = c1 + 1
                            else:
                                b = contour[:, 0][c1]
                                c1 = len(contour[:, 0]) + 1
                        try:
                            outside2 = r0[int(b) + 2, int(a)]
                            outside3 = r0[int(b) + 2, int(a) - 1]
                            outside4 = r0[int(b) + 2, int(a) + 1]
                            print('1', outside4[0])
                            print('2', outside4[1])
                            print('3', outside4[2])
                            inside2 = r0[int(b) - 2, int(a)]
                            inside3 = r0[int(b) - 3, int(a)]
                            inside4 = r0[int(b) - 4, int(a)]

                            '#DFC'
                            if ((outside2[0] >= 200) | (outside2[1] >= 200) | (outside2[2] >= 200)) \
                                    & ((outside3[0] >= 200) | (outside3[1] >= 200) | (outside3[2] >= 200)) \
                                    & ((outside4[0] >= 200) | (outside4[1] >= 200) | (outside4[2] >= 200)):
                                fontColor = "black"
                            else:
                                fontColor = "white"
                        except:
                            print('==========================contour=========================================')
                            print(croppedOcr)

                if fontColor == "UNKNOWN":
                    fontColor = "white"
                    print('fail', croppedOcr)

                return fontColor

    '# RUN THE METAALGORITHM FOR EACH TYPE OF ELEMENT'
    if 'Write Page' == 'Write Page':

        path = '../../'
        titleHtml = 'testing'
        titleCss = 'testingCss'
        pages_creation = create_page_Html_and_Css_and_js(path, titleHtml, titleCss)

        pagehtml = pages_creation[0]
        pagecss = pages_creation[1]
        pagehtml1 = pages_creation[2]
        pagehtml2 = pages_creation[3]
        pagehtml3 = pages_creation[4]

        userId = getCollectionIDs('accounts_user', currentUser)
        screenwidthOnePercent = float(getLatestScreenshot(userId)['screenWidth']) / 100

        print('after \n')
        print("button", ButtonArray)
        print("paragraph", paragraphArray)
        print("hyperLink", hyperLinkArray)
        print("txtBox", textBoxArray)
        #        print("txtBoxLegend", textBoxLegendArray)
        print("frame", frameArray)
        print("logo", logoArray)

        print('this is my image root, dont change: ' + str(myFile))
        mainImage = io.imread('media/' + str(myFile))  # facebookLogin root

        '#CREATING ADDITIONAL NEW ELEMENT '
        print('new element: ' + str(newElementsArray))

        for e in newElementsArray:
            if len(newElementsArray) > 0:

                elementType = e['type']
                if elementType == 'button':

                    label = e['name']
                    classid = e['class_id']
                    width = str(float(e['location']['x1']) - float(e['location']['x0']))
                    height = str(float(e['location']['y1']) - float(e['location']['y0']))
                    positionL = str(float(e['location']['x0']))
                    positionT = str(float(e['location']['y0']))

                    fStyles = get_new_fstyles(classid)

                    fontSize = fStyles['fontSize']
                    print('fontSize::: ')
                    print(fontSize)
                    try:
                        fontVw = float((float(fontSize) / screenwidthOnePercent) / 2)
                    except:
                        fontVw = 1
                    fontColor = fStyles['fontColor']
                    textAlign = fStyles['textAlign']
                    fontFamily = fStyles['fontFamily']

                    styles = get_new_bstyles(classid)
                    bgcolor = styles['bgcolor']
                    bordercolor = styles['borderColor']
                    borderRadius = styles['borderRadius']
                    zIndex = str(styles['zIndex'])

                    create_new_button(label, str(classid), width, height, borderRadius, positionL, positionT, bgcolor,
                                  bordercolor,
                                  fontColor, str(fontVw), str(fontFamily), '', zIndex, 'notVirtual')

                elif elementType == 'frame':

                    label = e['name']
                    classid = e['class_id']
                    width = str(float(e['location']['x1']) - float(e['location']['x0']))
                    height = str(float(e['location']['y1']) - float(e['location']['y0']))
                    positionL = str(float(e['location']['x0']))
                    positionT = str(float(e['location']['y0']))

                    fStyles = get_new_fstyles(classid)

                    fontSize = fStyles['fontSize']
                    fontColor = fStyles['fontColor']
                    textAlign = fStyles['textAlign']
                    fontFamily = fStyles['fontFamily']

                    styles = get_new_bstyles(classid)
                    bgcolor = styles['bgcolor']
                    bordercolor = styles['borderColor']
                    borderRadius = styles['borderRadius']

                    zIndex = str(styles['zIndex'])

                    create_new_div(classid, width, height, positionL, positionT, borderRadius, bordercolor, bgcolor, zIndex, 'notVirtual')

                elif elementType == 'hyperlink':

                    label = e['name']
                    classid = e['class_id']
                    width = str(float(e['location']['x1']) - float(e['location']['x0']))
                    height = str(float(e['location']['y1']) - float(e['location']['y0']))
                    positionL = str(float(e['location']['x0']))
                    positionT = str(float(e['location']['y0']))
                    text_string = str(e['name'])

                    fStyles = get_new_fstyles(classid)

                    fontSize = fStyles['fontSize']
                    try:
                        fontVw = float((float(fontSize) / screenwidthOnePercent) / 2)
                    except:
                        fontVw = 1
                    fontColor = fStyles['fontColor']
                    textAlign = fStyles['textAlign']
                    fontFamily = fStyles['fontFamily']

                    styles = get_new_bstyles(classid)
                    bgcolor = styles['bgcolor']
                    bordercolor = styles['borderColor']
                    borderRadius = styles['borderRadius']
                    zIndex = str(styles['zIndex'])

                    create_new_hyperLink(str(classid), str(text_string),
                                     positionL, positionT, str(fontVw), fontColor, width, textAlign, fontFamily, '',
                                     zIndex, 'notVirtual')

                elif elementType == 'paragraph':

                    label = e['name']
                    classid = e['class_id']
                    width = str(float(e['location']['x1']) - float(e['location']['x0']))
                    height = str(float(e['location']['y1']) - float(e['location']['y0']))
                    positionL = str(float(e['location']['x0']))
                    positionT = str(float(e['location']['y0']))
                    text_string = str(e['name'])

                    fStyles = get_new_fstyles(classid)

                    fontSize = fStyles['fontSize']
                    try:
                        fontVw = float((float(fontSize) / screenwidthOnePercent) / 2)
                    except:
                        fontVw = 1
                    fontColor = fStyles['fontColor']
                    textAlign = fStyles['textAlign']
                    fontFamily = fStyles['fontFamily']

                    styles = get_new_bstyles(classid)
                    bgcolor = styles['bgcolor']
                    bordercolor = styles['borderColor']
                    borderRadius = styles['borderRadius']
                    link = ''
                    zIndex = str(styles['zIndex'])

                    create_new_paragraph(classid, text_string, positionL, positionT, str(fontVw), fontColor, width,
                                     textAlign, height, fontFamily, link, zIndex, 'notVirtual')

                elif elementType == 'textbox':

                    label = e['name']
                    classid = e['class_id']
                    width = str(float(e['location']['x1']) - float(e['location']['x0']))
                    height = str(float(e['location']['y1']) - float(e['location']['y0']))
                    positionL = str(float(e['location']['x0']))
                    positionT = str(float(e['location']['y0']))
                    placeholder = e['name']
                    # Check

                    fStyles = get_new_fstyles(classid)
                    childOffset = fStyles['textIndent']
                    fontSize = fStyles['fontSize']
                    try:
                        fontVw = float((float(fontSize) / screenwidthOnePercent) / 2)
                    except:
                        fontVw = 1
                    fontColor = fStyles['fontColor']
                    textAlign = fStyles['textAlign']
                    fontFamily = fStyles['fontFamily']

                    styles = get_new_bstyles(classid)
                    bgcolor = styles['bgcolor']
                    bordercolor = styles['borderColor']
                    borderRadius = styles['borderRadius']
                    zIndex = str(styles['zIndex'])

                    create_text_box_placeholder_load(placeholder, label, width, height, classid, borderRadius, positionL,
                                                positionT, bgcolor, childOffset, str(fontSize), fontFamily, fontColor,
                                                textAlign, bordercolor, zIndex)

                elif elementType == 'textArea':

                    label = e['name']
                    classid = e['class_id']
                    width = str(float(e['location']['x1']) - float(e['location']['x0']))
                    height = str(float(e['location']['y1']) - float(e['location']['y0']))
                    positionL = str(float(e['location']['x0']))
                    positionT = str(float(e['location']['y0']))
                    placeholder = str(e['name'])
                    # Check
                    fStyles = get_new_fstyles(classid)
                    childOffset = fStyles['textIndent']
                    fontSize = fStyles['fontSize']
                    try:
                        fontVw = float((float(fontSize) / screenwidthOnePercent) / 2)
                    except:
                        fontVw = 1
                    fontColor = fStyles['fontColor']
                    textAlign = fStyles['textAlign']
                    fontFamily = fStyles['fontFamily']

                    styles = get_new_bstyles(classid)
                    bgcolor = styles['bgcolor']
                    bordercolor = styles['borderColor']
                    borderRadius = styles['borderRadius']
                    zIndex = str(styles['zIndex'])

                    create_new_text_area(placeholder, label, classid, width, height, positionL, positionT,
                                     childOffset, str(fontVw), bgcolor, borderRadius, bordercolor, fontFamily, zIndex,
                                     fontColor, 'notVirtual')

                elif elementType == 'image':

                    icon_path = 'media/' + str(e['root'])
                    classid = e['class_id']
                    width = str(float(e['location']['x1']) - float(e['location']['x0']))
                    height = str(float(e['location']['y1']) - float(e['location']['y0']))
                    positionL = str(float(e['location']['x0']))
                    positionT = str(float(e['location']['y0']))

                    link = ''
                    styles = get_new_bstyles(classid)
                    zIndex = str(styles['zIndex'])
                    bordercolor = styles['borderColor']
                    borderRadius = styles['borderRadius']

                    create_new_image(icon_path, classid, width, height, positionL, positionT, bordercolor, borderRadius,
                                 link, zIndex, 'notVirtual')

                elif elementType == 'map-2':
                    print("map-2")
                    print(e['root'])
                    icon_path = 'media/' + str(e['root'])
                    print('MALL')
                    print(icon_path)
                    classid = e['class_id']
                    width = str(float(e['location']['x1']) - float(e['location']['x0']))
                    height = str((float(e['location']['y1']) - float(e['location']['y0'])))

                    positionL = str(float(e['location']['x0']))
                    positionT = str(float(e['location']['y0']))

                    link = ''
                    styles = get_new_bstyles(classid)
                    zIndex = str(styles['zIndex'])
                    bordercolor = styles['borderColor']
                    borderRadius = styles['borderRadius']
                    leftWidth= str(float(width)+float(positionL))
                    print(icon_path, classid, width, height, positionL, positionT, link, zIndex,bordercolor)
                    print('icon_path, classid, width, height, positionL, positionT, link, zIndex,bordercolor')
                    print(leftWidth)

                    create_googleMap(icon_path, classid, width, height, positionL, positionT, link, zIndex,bordercolor,leftWidth)
                # elif elementType == 'map-3':
                #     print("map-3")
                #     icon_path = 'static/users/' + str(e['root'])
                #     classid = e['class_id']
                #     width = str(float(e['location']['x1']) - float(e['location']['x0']))
                #     height = str(float(e['location']['y1']) - float(e['location']['y0']))
                #     positionL = str(float(e['location']['x0']))
                #     positionT = str(float(e['location']['y0']))
                #
                #     link = ''
                #     styles = get_new_bstyles(classid)
                #     zIndex = str(styles['zIndex'])
                #     bordercolor = styles['borderColor']
                #     borderRadius = styles['borderRadius']
                #     create_googleMap(icon_path, classid, width, height, positionL, positionT, link, zIndex)
                # elif elementType == 'map-4':
                #     print("map-4")
                #     icon_path = 'static/users/' + str(e['root'])
                #     classid = e['class_id']
                #     width = str(float(e['location']['x1']) - float(e['location']['x0']))
                #     height = str(float(e['location']['y1']) - float(e['location']['y0']))
                #     positionL = str(float(e['location']['x0']))
                #     positionT = str(float(e['location']['y0']))
                #
                #     link = ''
                #     styles = get_new_bstyles(classid)
                #     zIndex = str(styles['zIndex'])
                #     bordercolor = styles['borderColor']
                #     borderRadius = styles['borderRadius']
                #     create_googleMap(icon_path, classid, width, height, positionL, positionT, link, zIndex)
                # elif elementType == 'map-5':
                #     print("map-4")
                #     icon_path = 'static/users/' + str(e['root'])
                #     classid = e['class_id']
                #     width = str(float(e['location']['x1']) - float(e['location']['x0']))
                #     height = str(float(e['location']['y1']) - float(e['location']['y0']))
                #     positionL = str(float(e['location']['x0']))
                #     positionT = str(float(e['location']['y0']))
                #
                #     link = ''
                #     styles = get_new_bstyles(classid)
                #     zIndex = str(styles['zIndex'])
                #     bordercolor = styles['borderColor']
                #     borderRadius = styles['borderRadius']
                #     create_googleMap(icon_path, classid, width, height, positionL, positionT, link, zIndex)

                elif elementType == 'bar-2':
                    print("bar-2")
                    icon_path = 'media/' + str(e['root'])
                    classid = e['class_id']
                    print(classid)
                    width = str(float(e['location']['x1']) - float(e['location']['x0']))
                    height = str(float(e['location']['y1']) - float(e['location']['y0']))
                    positionL = str(float(e['location']['x0']))
                    positionT = str(float(e['location']['y0']))

                    link = ''
                    styles = get_new_barChart_styles(classid)
                    zIndex = str(styles['zIndex'])
                    bordercolor = styles['borderColor']
                    borderRadius = styles['borderRadius']
                    barChartBG = styles['barChartBG']
                    barChartBar = styles['barChartBar']
                    data = styles['data']
                    create_C3_barChart(icon_path, classid, width, height, positionL, positionT, link, zIndex, bordercolor,barChartBG, barChartBar, data)
                elif elementType == 'bar-3':
                    print("bar-3")
                    icon_path = 'media/' + str(e['root'])
                    classid = e['class_id']
                    width = str(float(e['location']['x1']) - float(e['location']['x0']))
                    height = str(float(e['location']['y1']) - float(e['location']['y0']))
                    positionL = str(float(e['location']['x0']))
                    positionT = str(float(e['location']['y0']))

                    link = ''
                    styles = get_new_barChart_styles(classid)
                    zIndex = str(styles['zIndex'])
                    bordercolor = styles['borderColor']
                    borderRadius = styles['borderRadius']
                    barChartBG = styles['barChartBG']
                    barChartBar = styles['barChartBar']
                    data = styles['data']
                    create_C3_barChart_2(icon_path, classid, width, height, positionL, positionT, link, zIndex, bordercolor,
                                    barChartBG, barChartBar, data)

                elif elementType == 'calendar-1':
                    icon_path = 'media/' + str(e['root'])
                    classid = e['class_id']
                    width = str(float(e['location']['x1']) - float(e['location']['x0']))
                    height = str(float(e['location']['y1']) - float(e['location']['y0']))
                    positionL = str(float(e['location']['x0']))
                    positionT = str(float(e['location']['y0']))

                    link = ''
                    styles = get_new_bstyles(classid)
                    zIndex = str(styles['zIndex'])
                    bordercolor = styles['borderColor']
                    borderRadius = styles['borderRadius']
                    create_calendarPro2(icon_path, classid, width, height, positionL, positionT, link)
                elif elementType == 'calendar-2':
                    icon_path = 'media/' + str(e['root'])
                    classid = e['class_id']
                    width = str(float(e['location']['x1']) - float(e['location']['x0']))
                    height = str(float(e['location']['y1']) - float(e['location']['y0']))
                    positionL = str(float(e['location']['x0']))
                    positionT = str(float(e['location']['y0']))

                    link = ''
                    styles = get_new_bstyles(classid)
                    zIndex = str(styles['zIndex'])
                    bordercolor = styles['borderColor']
                    borderRadius = styles['borderRadius']
                    create_calendarPro2(icon_path, classid, width, height, positionL, positionT, link)

                elif elementType == 'pie-1':
                    icon_path = 'media/' + str(e['root'])
                    classid = e['class_id']
                    width = str(float(e['location']['x1']) - float(e['location']['x0']))
                    height = str(float(e['location']['y1']) - float(e['location']['y0']))
                    positionL = str(float(e['location']['x0']))
                    positionT = str(float(e['location']['y0']))

                    link = ''
                    styles = get_new_bstyles(classid)
                    zIndex = str(styles['zIndex'])
                    bordercolor = styles['borderColor']
                    borderRadius = styles['borderRadius']
                    create_C3_pieChart_1(icon_path, classid, width, height, positionL, positionT, link,zIndex)
                elif elementType == 'pie-4':
                    icon_path = 'media/' + str(e['root'])
                    classid = e['class_id']
                    width = str(float(e['location']['x1']) - float(e['location']['x0']))
                    height = str(float(e['location']['y1']) - float(e['location']['y0']))
                    positionL = str(float(e['location']['x0']))
                    positionT = str(float(e['location']['y0']))

                    link = ''
                    styles = get_new_bstyles(classid)
                    zIndex = str(styles['zIndex'])
                    bordercolor = styles['borderColor']
                    borderRadius = styles['borderRadius']
                    create_C3_pieChart_4(icon_path, classid, width, height, positionL, positionT, link, zIndex)

        '#CREATING FRAME OR BOXES'
        for f in frameArray:
            classid = f['seg_id']
            width = str(float(f['location']['x1']) - float(f['location']['x0']))
            height = str(float(f['location']['y1']) - float(f['location']['y0']))
            positionL = str(float(f['location']['x0']))
            positionT = str(float(f['location']['y0']))
            print('framecheck')
            print(f)
            '# FRAME STYLE'

            styles = get_bstyles(classid)
            bgcolor = styles['bgcolor']
            bordercolor = styles['bordercolor']
            borderRadius = styles['borderRadius']
            zIndex = str(styles['zIndex'])
            '''
            if checkBorderColorInrange(bgcolorarray, bordercolorarray, 50):
                bordercolor = bgcolor

            if f['name'] == 'rectangle with round sides parent':
                borderRadius = '40'
            elif f['name'] == 'rectangle with round border parent':
                borderRadius = '10'
            elif f['name'] == 'rectangle parent':
                borderRadius = '0'
            elif f['name'] == 'circle parent':
                borderRadius = '100'
            '''

            create_div(classid, width, height, positionL, positionT, borderRadius, bordercolor, bgcolor, zIndex)

        '#CREATING BUTTON'
        print('Button: ' + str(ButtonArray))
        for button in ButtonArray:
            print('these are my buttons!:')
            print(button)
            print('button child')
            print(button['level'])
            if len(ButtonArray) > 0:
                if 'parent' in button['level']:
                    if button['level']['parent'] == [] or 'child' in button['level'] or button['level'] == []:
                        print('parent is empty!')
                        label = str(button['name'])
                    else:
                        label = str(button['name'])

                    # Get parent info
                    classid = str(button['seg_id'])
                    width = str(float(button['location']['x1']) - float(
                        button['location']['x0']))
                    height = str(float(button['location']['y1']) - float(
                        button['location']['y0']))
                    positionL = str(float(button['location']['x0']))
                    positionT = str(float(button['location']['y0']))

                    for button2 in ButtonArray:
                        if str(button['level']['parent']) == str(button2['seg_id']):
                            if 'child' in button2['level']:
                                if str(button2['level']['child']) == str(button['seg_id']):
                                    label = str(button2['name'])

                                # Get child info
                                screenW = float(getMetrix(userId, 'screenWidth'))
                                print('screenW')
                                print(screenW)
                                if (screenW == 0.0):
                                    screenW = 646.0
                                fSize = float(button2['location']['y1']) - float(button2['location']['y0'])
                                # # fSize *= float(heightScreen)/100
                                fSize *= screenW / 100
                                charactesLen = len(str(button2['name']))
                                childWidth = str(float(button2['location']['x1']) - float(
                                    button2['location']['x0']))
                                bboxWidth = float(childWidth) * screenW / 100

                                lNumber = 1

                                # Calculate size
                                if lNumber >= 1:
                                    newSize = ''
                                    if label.islower():
                                        textWidth = float((float(fSize) * 0.44128) * float(charactesLen))
                                        checker = float(bboxWidth) / int(charactesLen) / 0.44128
                                        newSize = float((float(checker) * 0.44128) * float(charactesLen))
                                    elif label.isupper():
                                        textWidth = float((float(fSize) * 0.6064) * float(charactesLen))
                                        checker = float(bboxWidth) / int(charactesLen) / 0.6064
                                        newSize = float((float(checker) * 0.6064) * float(charactesLen))

                                    elif not label.islower() and not label.isupper():
                                        textWidth = float((float(fSize) * 0.5289) * float(charactesLen))
                                        checker = float(bboxWidth) / int(charactesLen) / 0.5289
                                        newSize = float((float(checker) * 0.5289) * float(charactesLen))

                                if textWidth >= newSize:
                                    print('True')
                                    print(newSize)
                                    print(fSize)
                                    fSize = checker

                                print('BUTTON: \n font size: ' + str(fSize) + '\n segId:' + str(
                                    classid) + '\n name:' + str(label) +
                                      '\n checker:' + str(checker) + '\n' + str(textWidth) + '\n height: ' + str(
                                    height))
                                if state == 'save':
                                    update_font_size(db.styles, classid, 'fontSize', str(fSize))

                            else:
                                label = str(button['name'])

                    fStyles = get_fstyles(classid)

                    fontSize = fStyles['fontSize']
                    try:
                        fontVw = float((float(fontSize) / screenwidthOnePercent) / 2)
                    except:
                        fontVw = 1
                    fontColor = fStyles['fontColor']
                    textAlign = fStyles['textAlign']
                    fontFamily = fStyles['fontFamily']

                    styles = get_bstyles(classid)
                    bgcolor = styles['bgcolor']
                    bordercolor = styles['bordercolor']
                    borderRadius = styles['borderRadius']
                    link = str(fStyles['link'])
                    print("link")
                    print(fStyles)
                    zIndex = str(styles['zIndex'])
                    if state == 'save':
                        create_button(label, classid, width, height, borderRadius, positionL, positionT,
                                      bgcolor, bordercolor, fontColor, str(fontVw), fontFamily, link, zIndex)
                    if state == 'load':
                        create_button_load(label, classid, width, height, borderRadius, positionL, positionT,
                                                      bgcolor, bordercolor, fontColor, str((fontSize)), fontFamily, link, zIndex)

        '#CREATING HYPERLINK'
        print('hyperlink: ' + str(hyperLinkArray))

        for h in hyperLinkArray:
            if len(hyperLinkArray) > 0:

                classid = str(h['seg_id'])  # button['id']
                try:
                    lNumber = getLineNumbers(str(h['seg_id']))
                except:
                    lNumber = 1

                text_string = str(h['name'])
                width = float(float(h['location']['x1']) - float(h['location']['x0']))
                positionL = str(float(h['location']['x0']))
                positionT = str(float(h['location']['y0']))

                fSize = float(h['location']['y1']) - float(h['location']['y0'])
                screenHH = float(getMetrix(userId, 'screenHeight'))
                if screenHH == 0.0:
                    screenHH = 420
                fSize *= screenHH / 100
                charactesLen = len(str(h['name']))
                childWidth = str(float(h['location']['x1']) - float(
                    h['location']['x0']))
                bboxWidth = float(childWidth) * screenHH / 100
                if lNumber >= 1:
                    newSize = ''
                    if text_string.islower():
                        textWidth = float((float(fSize) * 0.44128) * float(charactesLen))
                        checker = float(bboxWidth) / int(charactesLen) / 0.44128
                        newSize = float((float(checker) * 0.44128) * float(charactesLen))
                    elif text_string.isupper():
                        textWidth = float((float(fSize) * 0.6064) * float(charactesLen))
                        checker = float(bboxWidth) / int(charactesLen) / 0.6064
                        newSize = float((float(checker) * 0.6064) * float(charactesLen))

                    elif not text_string.islower() and not text_string.isupper():
                        textWidth = float((float(fSize) * 0.5289) * float(charactesLen))
                        checker = float(bboxWidth) / int(charactesLen) / 0.5289
                        newSize = float((float(checker) * 0.5289) * float(charactesLen))

                if textWidth >= newSize:
                    print('true')
                    fSize = checker
                if state == 'save':
                    update_font_size(db.styles, classid, 'fontSize', str(fSize))

                fStyles = get_fstyles(classid)
                fontSize = fStyles['fontSize']
                try:
                    fontVw = float((float(fontSize) / screenwidthOnePercent) / 2)
                except:
                    fontVw = 1
                fontColor = fStyles['fontColor']
                textAlign = fStyles['textAlign']
                fontFamily = fStyles['fontFamily']
                link = fStyles['link']

                styles = get_bstyles(classid)
                zIndex = str(styles['zIndex'])
                if state == 'load':
                    create_hyperLink_load(str(classid), str(text_string),
                                 positionL, positionT, str(float(fontSize)),
                                 fontColor, str(width), str(textAlign), fontFamily, link, zIndex)
                if state == 'save':
                    create_hyperLink(str(classid), str(text_string),
                                                     positionL, positionT, str(fontVw),
                                                     fontColor, str(width), str(textAlign), fontFamily, link, zIndex)

        '#CREATING PARAGRAPH'
        print('paragraph: ' + str(paragraphArray))

        for p in paragraphArray:

            if len(paragraphArray) > 0:

                try:
                    lNumber = getLineNumbers(str(p['seg_id']))
                except:
                    lNumber = 1

                classid = str(p['seg_id'])  # button['id']
                width = float(float(p['location']['x1']) - float(p['location']['x0']))
                height = str(float(p['location']['y1']) - float(p['location']['y0']))
                # bboxWidth = float(width) * viewWidth / 100
                positionL = str(float(p['location']['x0']))
                positionT = str(float(p['location']['y0']))

                # text_string = pytz.unicode(str(p['name']), errors='replace')
                text_string = str(p['name'])

                text_string = str(text_string.encode('utf-8', errors='ignore').decode('utf-8'))

                print('look here!!!!')
                print(text_string)

                fSize = float(p['location']['y1']) - float(p['location']['y0'])
                screenH = float(getMetrix(userId, 'screenHeight'))
                if(screenH == 0.0):
                    screenH = 420
                fSize *= screenH / 100
                charactesLen = len(text_string)
                screenW = float(getMetrix(userId, 'screenWidth'))
                if screenW == 0.0:
                    screenW = 646.0
                bboxWidth = float(width) * screenW / 100
                if lNumber >= 1:
                    newSize = ''
                    if text_string.islower():
                        textWidth = float((float(fSize) * 0.44128) * float(charactesLen))
                        checker = float(bboxWidth) / int(charactesLen) / 0.44128
                        newSize = float((float(checker) * 0.44128) * float(charactesLen))
                    elif text_string.isupper():
                        textWidth = float((float(fSize) * 0.6064) * float(charactesLen))
                        checker = float(bboxWidth) / int(charactesLen) / 0.6064
                        newSize = float((float(checker) * 0.6064) * float(charactesLen))

                    elif not text_string.islower() and not text_string.isupper():
                        textWidth = float((float(fSize) * 0.5289) * float(charactesLen))
                        checker = float(bboxWidth) / int(charactesLen) / 0.5289
                        newSize = float((float(checker) * 0.5289) * float(charactesLen))

                ''''###### to be confirmed #####'''
                if textWidth >= newSize:
                    print('TrueP')
                    print(textWidth)
                    print(newSize)
                    print(fSize)
                    print(checker)
                    fSize = checker
                if state == 'save':
                    update_font_size(db.styles, classid, 'fontSize', str(fSize))

                fStyles = get_fstyles(classid)
                fontSize = fStyles['fontSize']
                print('PFontSize')
                print(float(fontSize))

                try:
                    fontVw = float((float(fontSize) / float(screenwidthOnePercent)) / 2)
                except:
                    fontVw = 1
                fontColor = fStyles['fontColor']
                textAlign = fStyles['textAlign']
                fontFamily = fStyles['fontFamily']
                link = fStyles['link']
                styles = get_bstyles(classid)
                zIndex = str(styles['zIndex'])
                textIndent = str(fStyles['textIndent'])

                if state == 'load':
                    create_paragraph_load(classid, text_string, positionL, positionT, str(fontSize), fontColor,
                                          str(width), textAlign, height, fontFamily, link, zIndex, textIndent)
                else:
                    create_paragraph(classid, text_string, positionL, positionT, str(fontVw), fontColor,
                                          str(width), textAlign, height, fontFamily, link, zIndex, textIndent)

        '#CREATING TEXTBOX'
        print('textbox: ' + str(textBoxArray))

        for t in textBoxArray:
            print('TextboxArray: ' + str(textBoxArray))
            if len(textBoxArray) > 0:

                if 'parent' in t['level']:
                    if t['level']['parent'] == [] or 'child' in t['level'] or t['level'] == []:
                        print('parent is empty!')
                        name = str(t['name'])
                        placeholder = str(t['name'])
                    else:
                        name = str(t['name'])
                        placeholder = str(t['name'])

                    # Get parent info
                    classid = str(t['seg_id'])
                    width = str(float(t['location']['x1']) - float(
                        t['location']['x0']))
                    height = str(float(t['location']['y1']) - float(
                        t['location']['y0']))
                    positionL = str(float(t['location']['x0']))
                    positionT = str(float(t['location']['y0']))

                    for t2 in textBoxArray:
                        if str(t['level']['parent']) == str(t2['seg_id']):
                            if 'child' in t2['level']:

                                name = str(t2['name'])
                                placeholder = str(t2['name'])
                                fSize = float(t2['location']['y1']) - float(t2['location']['y0'])
                                # fSize *= float(heightScreen)/100
                                fSize *= float(getMetrix(userId, 'screenHeight') / 100)
                                charactesLen = len(str(t2['name']))
                                childWidth = str(float(t2['location']['x1']) - float(
                                    t2['location']['x0']))
                                screenW = float(getMetrix(userId, 'screenWidth'))
                                if screenW == 0.0:
                                    screenW = 627
                                bboxWidth = float(childWidth) * screenW / 100

                                lNumber = 1

                                # Calculate size
                                if lNumber >= 1:
                                    newSize = ''
                                    if placeholder.islower():
                                        textWidth = float((float(fSize) * 0.44128) * float(charactesLen))
                                        checker = float(bboxWidth) / int(charactesLen) / 0.44128
                                        newSize = float((float(checker) * 0.44128) * float(charactesLen))
                                    elif placeholder.isupper():
                                        textWidth = float((float(fSize) * 0.6064) * float(charactesLen))
                                        checker = float(bboxWidth) / int(charactesLen) / 0.6064
                                        newSize = float((float(checker) * 0.6064) * float(charactesLen))

                                    elif not placeholder.islower() and not placeholder.isupper():
                                        textWidth = float((float(fSize) * 0.5289) * float(charactesLen))
                                        checker = float(bboxWidth) / int(charactesLen) / 0.5289
                                        newSize = float((float(checker) * 0.5289) * float(charactesLen))

                                ''''###### to be confirmed #####'''
                                if textWidth >= newSize:
                                    print('true')
                                    fSize = checker
                                if state == 'save':
                                    update_font_size(db.styles, classid, 'fontSize', str(fSize))

                                if str(t2['level']['child']) == str(t['seg_id']):
                                    name = str(t2['name'])
                                    placeholder = str(t2['name'])
                            else:
                                name = str(t['name'])
                                placeholder = str(t['name'])

                    styles = get_bstyles(classid)
                    bgcolor = styles['bgcolor']
                    bordercolor = styles['bordercolor']
                    borderRadius = styles['borderRadius']
                    zIndex = str(styles['zIndex'])

                    fStyles = get_fstyles(classid)

                    fontSize = fStyles['fontSize']
                    try:
                        fontVw = float((float(fontSize) / screenwidthOnePercent) / 2)
                    except:
                        fontVw = 1
                    fontColor = fStyles['fontColor']
                    textAlign = fStyles['textAlign']
                    childOffset = fStyles['textIndent']
                    fontFamily = fStyles['fontFamily']

                    '# BUTTON STYLE BG, Border..'
                    if state == 'load':
                        print('we know: ' + str(height))
                        # print('elment: ' + name + ', bgcolor is: ' + bgcolor + ', bordercolor is: ' + bordercolor)
                        create_text_box_placeholder_load(placeholder, name, width, height, classid, borderRadius, positionL,
                                                    str(positionT), bgcolor, str(childOffset), str(fontSize), fontFamily,
                                                    str(fontColor), str(textAlign), str(bordercolor), zIndex)
                    else:
                        create_text_box_placeholder_save(placeholder, name, width, height, classid, borderRadius, positionL,
                                                    str(positionT), bgcolor, str(childOffset), str(fontVw), fontFamily,
                                                    str(fontColor), str(textAlign), str(bordercolor), zIndex)
        '#CREATING TEXTAREA'
        print('textbox: ' + str(textAreaArray))

        for t in textAreaArray:
            print('TextboxArray: ' + str(textAreaArray))
            if len(textAreaArray) > 0:

                if 'parent' in t['level']:
                    if t['level']['parent'] == [] or 'child' in t['level'] or t['level'] == []:
                        print('parent is empty!')
                        name = str(t['name'])
                        placeholder = str(t['name'])
                    else:
                        name = str(t['name'])
                        placeholder = str(t['name'])

                    # Get parent info
                    classid = str(t['seg_id'])
                    width = str(float(t['location']['x1']) - float(
                        t['location']['x0']))
                    height = str(float(t['location']['y1']) - float(
                        t['location']['y0']))
                    positionL = str(float(t['location']['x0']))
                    positionT = str(float(t['location']['y0']))

                    for t2 in textAreaArray:
                        if str(t['level']['parent']) == str(t2['seg_id']):
                            if 'child' in t2['level']:

                                name = str(t2['name'])
                                placeholder = str(t2['name'])
                                fSize = float(t2['location']['y1']) - float(t2['location']['y0'])
                                # fSize *= float(heightScreen)/100
                                fSize *= float(getMetrix(userId, 'screenHeight') / 100)
                                charactesLen = len(str(t2['name']))
                                childWidth = str(float(t2['location']['x1']) - float(
                                    t2['location']['x0']))
                                screenW = float(getMetrix(userId, 'screenWidth'))
                                if screenW == 0.0:
                                    screenW = 646.0
                                bboxWidth = float(childWidth) * screenW / 100

                                lNumber = 1

                                # Calculate size
                                if lNumber >= 1:
                                    newSize = ''
                                    if placeholder.islower():
                                        textWidth = float((float(fSize) * 0.44128) * float(charactesLen))
                                        checker = float(bboxWidth) / int(charactesLen) / 0.44128
                                        newSize = float((float(checker) * 0.44128) * float(charactesLen))
                                    elif placeholder.isupper():
                                        textWidth = float((float(fSize) * 0.6064) * float(charactesLen))
                                        checker = float(bboxWidth) / int(charactesLen) / 0.6064
                                        newSize = float((float(checker) * 0.6064) * float(charactesLen))

                                    elif not placeholder.islower() and not placeholder.isupper():
                                        textWidth = float((float(fSize) * 0.5289) * float(charactesLen))
                                        checker = float(bboxWidth) / int(charactesLen) / 0.5289
                                        newSize = float((float(checker) * 0.5289) * float(charactesLen))

                                ''''###### to be confirmed #####'''
                                if textWidth >= newSize:
                                    print('true')
                                    fSize = checker
                                if state == 'save':
                                    update_font_size(db.styles, classid, 'fontSize', str(fSize))
                                if str(t2['level']['child']) == str(t['seg_id']):
                                    name = str(t2['name'])
                                    placeholder = str(t2['name'])
                            else:
                                name = str(t['name'])
                                placeholder = str(t['name'])

                    styles = get_bstyles(classid)
                    bgcolor = styles['bgcolor']
                    bordercolor = styles['bordercolor']
                    borderRadius = styles['borderRadius']
                    zIndex = str(styles['zIndex'])

                    fStyles = get_fstyles(classid)

                    fontSize = fStyles['fontSize']
                    try:
                        fontVw = float((float(fontSize) / screenwidthOnePercent) / 2)
                    except:
                        fontVw = 1
                    fontColor = fStyles['fontColor']
                    textAlign = fStyles['textAlign']
                    childOffset = fStyles['textIndent']
                    fontFamily = fStyles['fontFamily']

                    '# BUTTON STYLE BG, Border..'
                    if 'style' == 'style':
                        create_text_area(placeholder, name, classid, width, height, positionL, str(positionT),
                                         str(childOffset), str(fontVw), bgcolor, borderRadius, bordercolor, fontFamily,
                                         zIndex, fontColor)

        '#CREATING LOGO'
        print('logo: ' + str(logoArray))
        for l in logoArray:

            path = ''
            collection = db['segmentation']
            cursor = collection.find({})
            for document in cursor:
                if str(document['_id']) == str(l['seg_id']):
                    path = document['elementRoot']
            icon_path = path
            classid = l['seg_id']
            width = str(
                float(l['location']['x1']) - float(l['location']['x0']))
            height = str(
                float(l['location']['y1']) - float(l['location']['y0']))
            positionL = str(float(l['location']['x0']))
            positionT = str(float(l['location']['y0']))

            fStyles = get_fstyles(classid)
            link = fStyles['link']

            styles = get_bstyles(classid)
            zIndex = str(styles['zIndex'])
            bordercolor = styles['bordercolor']
            borderRadius = styles['borderRadius']

            create_image(icon_path, classid, width, height, positionL, positionT, bordercolor, borderRadius, link,
                         zIndex)

        '#CREATING Icons'
        print('logo: ' + str(iconArray))
        for l in iconArray:

            path = ''
            collection = db['segmentation']
            cursor = collection.find({})
            for document in cursor:
                if str(document['_id']) == str(l['seg_id']):
                    path = document['elementRoot']
            icon_path = path
            classid = l['seg_id']
            width = str(
                float(l['location']['x1']) - float(l['location']['x0']))
            height = str(
                float(l['location']['y1']) - float(l['location']['y0']))
            positionL = str(float(l['location']['x0']))
            positionT = str(float(l['location']['y0']))

            fStyles = get_fstyles(classid)
            link = fStyles['link']

            styles = get_bstyles(classid)
            zIndex = str(styles['zIndex'])
            bordercolor = styles['bordercolor']
            borderRadius = styles['borderRadius']

            create_icon(icon_path, classid, width, height, positionL, positionT, bordercolor, borderRadius, link,
                         zIndex)

        '#CREATING Picture'
        print('logo: ' + str(pictureArray))
        for l in pictureArray:

            path = ''
            collection = db['segmentation']
            cursor = collection.find({})
            for document in cursor:
                if str(document['_id']) == str(l['seg_id']):
                    path = document['elementRoot']
            icon_path = path
            classid = l['seg_id']
            width = str(
                float(l['location']['x1']) - float(l['location']['x0']))
            height = str(
                float(l['location']['y1']) - float(l['location']['y0']))
            positionL = str(float(l['location']['x0']))
            positionT = str(float(l['location']['y0']))

            fStyles = get_fstyles(classid)
            link = fStyles['link']

            styles = get_bstyles(classid)
            zIndex = str(styles['zIndex'])
            bordercolor = styles['bordercolor']
            borderRadius = styles['borderRadius']

            create_image(icon_path, classid, width, height, positionL, positionT, bordercolor, borderRadius, link,
                         zIndex)

        '#CREATING widgets'
        print('widget: ' + str(widgetArray))
        for l in widgetArray:

            path = ''
            collection = db['segmentation']
            cursor = collection.find({})
            for document in cursor:
                if str(document['_id']) == str(l['seg_id']):
                    path = document['elementRoot']
            icon_path = path
            classid = l['seg_id']
            width = str(
                float(l['location']['x1']) - float(l['location']['x0']))
            height = str(
                float(l['location']['y1']) - float(l['location']['y0']))
            positionL = str(float(l['location']['x0']))
            positionT = str(float(l['location']['y0']))

            fStyles = get_fstyles(classid)
            link = fStyles['link']

            styles = get_bstyles(classid)
            zIndex = str(styles['zIndex'])
            bordercolor = styles['bordercolor']
            borderRadius = styles['borderRadius']
            leftWidth =float(positionL)+float(width)

            link = ''
            create_googleMap(icon_path, classid, width, height, positionL, positionT, link, zIndex,bordercolor, leftWidth)

        '#CREATING calendar'
        for l in calendarWidgetsArray:

            path = ''
            collection = db['segmentation']
            cursor = collection.find({})
            for document in cursor:
                if str(document['_id']) == str(l['seg_id']):
                    path = document['elementRoot']
            icon_path = path
            classid = l['seg_id']
            width = str(
                float(l['location']['x1']) - float(l['location']['x0']))
            height = str(
                float(l['location']['y1']) - float(l['location']['y0']))
            positionL = str(float(l['location']['x0']))
            positionT = str(float(l['location']['y0']))

            fStyles = get_fstyles(classid)
            link = fStyles['link']

            styles = get_bstyles(classid)
            zIndex = str(styles['zIndex'])
            bordercolor = styles['bordercolor']
            borderRadius = styles['borderRadius']

            link = ''
            create_calendar(icon_path, classid, width, height, positionL, positionT, link)

        for l in barChartArray:

            path = ''
            collection = db['segmentation']
            cursor = collection.find({})
            for document in cursor:
                if str(document['_id']) == str(l['seg_id']):
                    path = document['elementRoot']
            icon_path = path
            classid = l['seg_id']
            width = str(
                float(l['location']['x1']) - float(l['location']['x0']))
            height = str(
                float(l['location']['y1']) - float(l['location']['y0']))
            positionL = str(float(l['location']['x0']))
            positionT = str(float(l['location']['y0']))

            fStyles = get_fstyles(classid)
            link = fStyles['link']

            styles = get_bstyles(classid)
            zIndex = str(styles['zIndex'])
            bordercolor = styles['bordercolor']
            borderRadius = styles['borderRadius']

            link = ''
            create_barChart3(icon_path, classid, width, height, positionL, positionT, link)

        '#setting background color'

        if 1 == 1:
            collection = db.backgrounds.find({'screenshot_id': screenshot_id})
            for document in collection:
                pagecss.write('.' + 'classContainer' + screenshot_id + '{background:' + str(
                    document['background']) + '; height: inherit; }\n')

        close_page_html_end()
        close_page_css()

    '############################################          END             ##########################################'


def duplicateElement( screenshot_id, valuelist):
    # get current date and data from array posted
    date = datetime.now(pytz.timezone('Australia/Melbourne'))
    elementcontent = valuelist[0].strip()
    elementtag = str(valuelist[2]).lower()

    #convert html tag to element type
    if elementtag == "p":
        elementtag = str("paragraph")
    elif elementtag == "input":
        elementtag = str("textbox")
    elif elementtag == "a":
        elementtag = "hyperlink"
    elif elementtag == "img":
        elementtag = "image"



    # check element type and run the function with each type
    if elementtag == "button":

        mydb = pymongo.MongoClient("mongodb://localhost:27017/")["MeduzaDb"]
        db_newStyle = mydb["newStyle"]
        db_newElement = mydb["newElements"]
        db_element_position = db_newElement.find_one({"class_id": valuelist[1]})
        document = db_newStyle.find_one({"element_id": valuelist[1]})
        if document == None:
            document = db.styles.find_one({"element_id": valuelist[1]})
        backGroundColor_new = document['bgcolor']
        fontSize_new = document['fontSize']
        fontColor_new = document['fontColor']
        textAlign_new = document['textAlign']
        fontFamily_new = document['fontFamily']
        bordercolor_new = document['borderColor']
        borderradius_new = document['borderRadius']


        locations_location = db['paragraphs'].find_one({'seg_id': valuelist[1]})
        location_sets = locations_location['location']
        print(location_sets)
        location_values = []
        location_values.append(location_sets['x0'])
        location_values.append(location_sets['y0'])
        location_values.append(location_sets['x1'])
        location_values.append(location_sets['y1'])
        print("location_values = ")
        print(location_values)


        label = db_element_position['name']
        classid = str(ObjectId())
        type = "button"
        zindex = 2
        location = {'x0': location_values[0], 'y0': location_values[1], 'x1': location_values[2],
                        'y1': location_values[3]}
        save_new_elements(classid, screenshot_id, type, label, location, date, '')
        collection = db['newElements']
        col = collection.find().sort([('timeStamp', -1)]).limit(1)
        element_id = ''
        for item in col:
            element_id = str(item['class_id'])

        save_new_style(element_id, str(fontSize_new), fontFamily_new, fontColor_new, bordercolor_new, borderradius_new, backGroundColor_new,
                           textAlign_new, 'unset', '', zindex)

    elif elementtag == "frame":

        mydb = pymongo.MongoClient("mongodb://localhost:27017/")["MeduzaDb"]
        db_newStyle = mydb["newStyle"]
        db_newElement = mydb["newElements"]
        db_element_position = db_newElement.find_one({"class_id": valuelist[1]})
        document = db_newStyle.find_one({"element_id": valuelist[1]})
        if document == None:
            document = db.styles.find_one({"element_id": valuelist[1]})
        backGroundColor_new = document['bgcolor']
        fontSize_new = document['fontSize']
        fontColor_new = document['fontColor']
        textAlign_new = document['textAlign']
        fontFamily_new = document['fontFamily']
        bordercolor_new = document['borderColor']
        borderradius_new = document['borderRadius']

        locations_location = db['paragraphs'].find_one({'seg_id': valuelist[1]})
        location_sets = locations_location['location']
        print(location_sets)
        location_values = []
        location_values.append(location_sets['x0'])
        location_values.append(location_sets['y0'])
        location_values.append(location_sets['x1'])
        location_values.append(location_sets['y1'])


        classid = str(ObjectId())

        type = "frame"
        label = ''



        location = {'x0': location_values[0], 'y0': location_values[1], 'x1': location_values[2],
                    'y1': location_values[3]}

        save_new_elements(classid, screenshot_id, type, label, location, date, '')
        collection = db['newElements']
        col = collection.find().sort([('timeStamp', -1)]).limit(1)
        element_id = ''
        for item in col:
            element_id = str(item['class_id'])
        save_new_style(element_id, fontSize_new, fontFamily_new, fontColor_new, bordercolor_new, borderradius_new, backGroundColor_new, textAlign_new,
                       'unset', '', 'auto')

    elif elementtag == "hyperlink":
        h = db['hyperLinks'].find_one({'screenshot_id': str(screenshot_id), 'status': 'active'})

        mydb = pymongo.MongoClient("mongodb://localhost:27017/")["MeduzaDb"]
        db_style = mydb["styles"]
        db_newStyle = mydb["newStyle"]
        db_newElement = mydb["newElements"]
        document = db_newStyle.find_one({"element_id": valuelist[1]})
        if document == None:
            document = db_style.find_one({"segmentation_id": valuelist[1]})
        backGroundColor_new = document['bgcolor']
        fontSize_new = document['fontSize']
        fontColor_new = document['fontColor']
        textAlign_new = document['textAlign']
        fontFamily_new = document['fontFamily']
        bordercolor_new = document['borderColor']
        borderradius_new = document['borderRadius']
        print("fontSize" + fontSize_new)

        locations_location = db['hyperLinks'].find_one({'seg_id': valuelist[1]})
        location_sets = locations_location['location']
        print(location_sets)
        location_values = []
        location_values.append(location_sets['x0'])
        location_values.append(location_sets['y0'])
        location_values.append(location_sets['x1'])
        location_values.append(location_sets['y1'])
        print("location_values = ")
        print(location_values)

        classid = str(ObjectId())
        text_string = elementcontent
        type = "hyperlink"

        zIndex = 2
        location = {'x0': location_values[0], 'y0': location_values[1], 'x1': location_values[2],
                        'y1': location_values[3]}

        save_new_elements(classid, screenshot_id, type, text_string, location, date, '')
        collection = db['newElements']
        col = collection.find().sort([('timeStamp', -1)]).limit(1)
        element_id = ''
        for item in col:
            element_id = str(item['class_id'])

        save_new_style(element_id, fontSize_new, fontFamily_new, fontColor_new, bordercolor_new, borderradius_new, backGroundColor_new, textAlign_new,
                       'unset', '', zIndex)

    elif elementtag == "paragraph":
        p = db['paragraphs'].find_one({'screebshot_id': str(screenshot_id), 'state': 'active'})

        locations_location = db['paragraphs'].find_one({'seg_id': valuelist[1]})
        location_sets = locations_location['location']
        print(location_sets)
        location_values = []
        location_values.append(location_sets['x0'])
        location_values.append(location_sets['y0'])
        location_values.append(location_sets['x1'])
        location_values.append(location_sets['y1'])

        mydb = pymongo.MongoClient("mongodb://localhost:27017/")["MeduzaDb"]
        db_style = mydb["styles"]
        db_newStyle = mydb["newStyle"]
        db_newElement = mydb["newElements"]
        document = db_newStyle.find_one({"element_id": valuelist[1]})
        if document == None:
            document = db_style.find_one({"segmentation_id": valuelist[1]})
        backGroundColor_new = document['bgcolor']
        fontSize_new = document['fontSize']
        fontColor_new = document['fontColor']
        textAlign_new = document['textAlign']
        fontFamily_new = document['fontFamily']
        bordercolor_new = document['borderColor']
        borderradius_new = document['borderRadius']

        locations_location = db['paragraphs'].find_one({'seg_id': valuelist[1]})
        location_sets = locations_location['location']
        print(location_sets)
        location_values = []
        location_values.append(location_sets['x0'])
        location_values.append(location_sets['y0'])
        location_values.append(location_sets['x1'])
        location_values.append(location_sets['y1'])


        classid = str(ObjectId())
        width = 20
        height = 10
        type = "paragraph"
        positionL = 40
        positionT = 45
        text_string = elementcontent

        occupied = 1
        zIndex = 2
        location = {'x0': location_values[0], 'y0': location_values[1], 'x1': location_values[2],
                        'y1': location_values[3]}

        save_new_elements(classid, screenshot_id, type, text_string, location, date, '')
        collection = db['newElements']
        col = collection.find().sort([('timeStamp', -1)]).limit(1)
        element_id = ''
        for item in col:
            element_id = str(item['class_id'])

        save_new_style(element_id, fontSize_new, fontFamily_new, fontColor_new, bordercolor_new, borderradius_new, backGroundColor_new, textAlign_new,
                       'unset', '', zIndex)

    elif elementtag == "textbox":

        t = db['textBoxes'].find_one({'seg_id': str(screenshot_id), 'status': 'active'})

        locations_location = db['textBoxes'].find_one({'seg_id': valuelist[1]})
        location_sets = locations_location['location']


        parent_element = db['textBoxes'].find_one({'seg_id':valuelist[1]})['level']['parent']
        print("parent element "+ parent_element)
        placeholder_new = db['textBoxes'].find_one({'seg_id':parent_element})['name']


        print(location_sets)
        location_values = []
        location_values.append(location_sets['x0'])
        location_values.append(location_sets['y0'])
        location_values.append(location_sets['x1'])
        location_values.append(location_sets['y1'])
        print("location_values = ")
        print(location_values )


        mydb = pymongo.MongoClient("mongodb://localhost:27017/")["MeduzaDb"]
        db_style = mydb["styles"]
        db_newStyle = mydb["newStyle"]
        db_newElement = mydb["newElements"]
        document = db_newStyle.find_one({"element_id": valuelist[1]})
        if document == None:
            document = db_style.find_one({"segmentation_id": valuelist[1]})

        backGroundColor_new = document['bgcolor']
        fontSize_new = document['fontSize']
        fontColor_new = document['fontColor']
        textAlign_new = document['textAlign']
        fontFamily_new = document['fontFamily']
        borderradius_new = document['borderRadius']
        bordercolor_new = document['borderColor']
        textIndent_new = document['textIndent']
        textIndent_new = str(textIndent_new)


        classid = str(ObjectId())
        type = "textbox"
        zIndex = 2
        location = {'x0': location_values[0], 'y0': location_values[1], 'x1': location_values[2],
                        'y1': location_values[3]}

        save_new_elements(classid, screenshot_id, type, placeholder_new, location, date, '')
        collection = db['newElements']
        col = collection.find().sort([('timeStamp', -1)]).limit(1)
        element_id = ''
        for item in col:
            element_id = str(item['class_id'])
        save_new_style(element_id, fontSize_new, fontFamily_new, fontColor_new, bordercolor_new, borderradius_new, backGroundColor_new, textAlign_new,
                       textIndent_new, '', zIndex)

    elif elementtag == "textarea":
        t = db['textBoxes'].find_one({'sedmentation_id': str(screenshot_id), 'status': 'active'})
        classid = str(ObjectId())
        name = 'New Text Area'
        width = float(t['location']['x1']) - float(t['location']['x0'])
        height = float(t['location']['y1']) - float(t['location']['y0'])
        positionL = 50 - width / 2
        positionT = 50 - height / 2
        type = "textArea"

        mydb = pymongo.MongoClient("mongodb://localhost:27017/")["MeduzaDb"]
        db_style = mydb["styles"]
        db_newStyle = mydb["newStyle"]
        db_newElement = mydb["newElements"]
        document = db_newStyle.find_one({"element_id": valuelist[1]})
        if document == None:
            document = db_style.find_one({"segmentation_id": valuelist[1]})

        backGroundColor_new = document['bgcolor']
        fontSize_new = document['fontSize']
        fontColor_new = document['fontColor']
        textAlign_new = document['textAlign']
        fontFamily_new = document['fontFamily']
        borderradius_new = document['borderRadius']
        bordercolor_new = document['borderColor']
        textIndent_new = document['textIndent']
        textIndent_new = str(textIndent_new)

        occupied = 1
        zIndex = 2

        location = {'x0': positionL, 'y0': positionT, 'x1': float(positionL) + float(width),
                        'y1': float(positionT) + float(height)}

        save_new_elements(classid, screenshot_id, type, name, location, date, '')
        collection = db['newElements']
        col = collection.find().sort([('timeStamp', -1)]).limit(1)
        element_id = ''
        for item in col:
            element_id = str(item['class_id'])

        save_new_style(element_id, fontSize_new, fontFamily_new, fontColor_new, bordercolor_new, borderradius_new, backGroundColor_new, textAlign_new,
                       textIndent_new, '', zIndex)

    elif elementtag == "image":

        locations_location = db['pictures'].find_one({'seg_id': valuelist[1]})
        if locations_location == None:
            locations_location = db['icon'].find_one({'seg_id': valuelist[1]})
        location_sets = locations_location['location']
        print(location_sets)
        location_values = []
        location_values.append(location_sets['x0'])
        location_values.append(location_sets['y0'])
        location_values.append(location_sets['x1'])
        location_values.append(location_sets['y1'])

        classid = str(ObjectId())
        type = "image"
        location = {'x0': location_values[0], 'y0': location_values[1], 'x1': location_values[2],
                    'y1': location_values[3]}
        path = locations_location["root"]
        name = locations_location["name"]
        path = path[6:]
        print("icon path "+ path)
        print("name = " + name)
        save_new_elements(classid, screenshot_id, type, name, location, date, path)
        collection = db['newElements']
        col = collection.find().sort([('timeStamp', -1)]).limit(1)
        element_id = ''
        for item in col:
            print('look over here: ' + str(item))
            element_id = str(item['class_id'])

        mydb = pymongo.MongoClient("mongodb://localhost:27017/")["MeduzaDb"]
        db_style = mydb["styles"]
        db_newStyle = mydb["newStyle"]
        document = db_newStyle.find_one({"element_id": valuelist[1]})
        if document == None:
            document = db_style.find_one({"segmentation_id": valuelist[1]})

        backGroundColor_new = document['bgcolor']
        fontSize_new = document['fontSize']
        fontColor_new = document['fontColor']
        textAlign_new = document['textAlign']
        fontFamily_new = document['fontFamily']
        borderradius_new = document['borderRadius']
        bordercolor_new = document['borderColor']
        textIndent_new = document['textIndent']
        textIndent_new = str(textIndent_new)
        zIndex = document['zIndex']

        save_new_style(element_id, fontSize_new, fontFamily_new, fontColor_new, bordercolor_new, borderradius_new, backGroundColor_new, textAlign_new,
                       textIndent_new, '', zIndex)


def addElement(currentUser, filename, screenshot_id, action):
    # ADD NEW ELEMENT
    date = datetime.now(pytz.timezone('Australia/Melbourne'))
    # Add Button
    if action == '1':
        print('meta running with action: ' + action)

        bu = db['buttons'].find_one({'screenshot_id': str(screenshot_id), 'state':'active'})
        print(bu)
        if bu == None:
            label = 'button'
            classid = str(ObjectId())
            width = 25
            height = 10
            positionL = 25
            positionT = 25
            type = "button"

            # Style
            fontSize = 15
            textAlign = 'unset'
            fontColor = 'black'
            fontFamily = 'Helvetica'
            bgcolor = 'white'
            bordercolor = 'black'
            borderRadius = '10'
            occupied = 1
            zindex = 2
            # while occupied == 1:
            #     print('posL: ' + str(positionL) + ', posT: ' + str(positionT))
            #     if checkLocation(positionL, positionT, width, height, screenshot_id) == 1:
            #         positionL += 1
            #         positionT += 1
            #         print('i am wrong!!')
            #     else:
            #         occupied = 5

            location = {'x0': positionL, 'y0': positionT, 'x1': float(positionL) + float(width),
                        'y1': float(positionT) + float(height)}

            save_new_elements(classid, screenshot_id, type, label, location, date, '')
            collection = db['newElements']
            col = collection.find().sort([('timeStamp', -1)]).limit(1)
            element_id = ''
            for item in col:
                print('look over here: ' + str(item))
                element_id = str(item['class_id'])
        else:
            seg_id = bu['seg_id']
            bu_style = db.styles.find_one({'segmentation_id':seg_id})

            label = 'New Button'
            classid = str(ObjectId())
            width = float(bu['location']['x1']) - float(bu['location']['x0'])
            height = float(bu['location']['y1']) - float(bu['location']['y0'])
            positionL = 50 - width/2
            positionT = 50 - height/2
            type = "button"
            zindex = 2

            # Style
            fontSize = bu_style['fontSize']
            textAlign = bu_style['textAlign']
            fontColor = bu_style['fontColor']
            fontFamily = bu_style['fontFamily']
            bgcolor = bu_style['bgcolor']
            bordercolor = bu_style['borderColor']
            borderRadius = bu_style['borderRadius']
            occupied = 1
            # while occupied == 1:
            #     print('posL: ' + str(positionL) + ', posT: ' + str(positionT))
            #     if checkLocation(positionL, positionT, width, height, screenshot_id) == 1:
            #         positionL += 1
            #         positionT += 1
            #         print('i am wrong!!')
            #     else:
            #         occupied = 5

            location = {'x0': positionL, 'y0': positionT, 'x1': float(positionL) + float(width),
                        'y1': float(positionT) + float(height)}

            save_new_elements(classid, screenshot_id, type, label, location, date, '')
            collection = db['newElements']
            col = collection.find().sort([('timeStamp', -1)]).limit(1)
            element_id = ''
            for item in col:
                print('look over here: ' + str(item))
                element_id = str(item['class_id'])


        save_new_style(element_id, str(fontSize), fontFamily, fontColor, bordercolor, borderRadius, bgcolor, textAlign,
                       'unset', '', zindex)

    # Add Frame
    elif action == '2':
        print('meta running with action: ' + action)

        classid = str(ObjectId())
        width = 80
        height = 20
        positionL = 15
        positionT = 10
        print('framecheck')
        type = "frame"
        label = ''

        # Style
        fontSize = ''
        fontFamily = ''
        fontColor = ''
        textAlign = ''
        bgcolor = 'rgb(124, 124, 124)'
        bordercolor = 'black'
        borderRadius = '0'
        occupied = 1
        # while occupied == 1:
        #     print('posL: ' + str(positionL) + ', posT: ' + str(positionT))
        #     if checkLocation(positionL, positionT, width, height, screenshot_id) == 1:
        #         positionL += 1
        #         positionT += 1
        #         print('i am wrong!!')
        #     else:
        #         occupied = 5

        location = {'x0': positionL, 'y0': positionT, 'x1': float(positionL) + float(width),
                    'y1': float(positionT) + float(height)}

        save_new_elements(classid, screenshot_id, type, label, location, date, '')
        collection = db['newElements']
        col = collection.find().sort([('timeStamp', -1)]).limit(1)
        element_id = ''
        for item in col:
            print('look over here: ' + str(item))
            element_id = str(item['class_id'])
        save_new_style(element_id, fontSize, fontFamily, fontColor, bordercolor, borderRadius, bgcolor, textAlign,
                       'unset', '', 'auto')

    # Add Hyperlink
    elif action == '3':

        h = db['hyperLinks'].find_one({'screenshot_id':str(screenshot_id),'status':'active'})

        print('meta running with action: ' + action)
        if h == None:
            classid = str(ObjectId())
            text_string = 'Hyperlink'
            type = "hyperlink"
            width = 10
            positionL = 45
            positionT = 48
            height = 5

            # Style
            fontSize = '15'
            fontColor = 'blue'
            textAlign = 'center'
            fontFamily = 'Helvetica'
            bordercolor = ''
            borderRadius = ''
            bgcolor = ''
            zIndex = 2
            occupied = 1
            while occupied == 1:
                print('posL: ' + str(positionL) + ', posT: ' + str(positionT))
                if checkLocation(positionL, positionT, width, height, screenshot_id) == 1:
                    positionL += 1
                    positionT += 1
                    print('i am wrong!!')
                else:
                    occupied = 5

            location = {'x0': positionL, 'y0': positionT, 'x1': float(positionL) + float(width),
                        'y1': float(positionT) + float(height)}

            save_new_elements(classid, screenshot_id, type, text_string, location, date, '')
            collection = db['newElements']
            col = collection.find().sort([('timeStamp', -1)]).limit(1)
            element_id = ''
            for item in col:
                print('look over here: ' + str(item))
                element_id = str(item['class_id'])
        else:
            h_style = db['styles'].find_one({'segmentation_id':h['seg_id']})
            classid = str(ObjectId())
            text_string = 'New hyperlink'
            type = "hyperlink"
            width = float(h['location']['x1']) - float(h['location']['x0'])
            height = float(h['location']['y1']) - float(h['location']['y0'])
            positionL = 50 - width/2
            positionT = 50 - height/2


            # Style
            fontSize = h_style['fontSize']
            fontColor = h_style['fontColor']
            textAlign = h_style['textAlign']
            fontFamily = h_style['fontfamily']
            bordercolor = ''
            borderRadius = ''
            bgcolor = ''
            zIndex = 2
            occupied = 1
            location = {'x0': positionL, 'y0': positionT, 'x1': float(positionL) + float(width),
                        'y1': float(positionT) + float(height)}

            save_new_elements(classid, screenshot_id, type, text_string, location, date, '')
            collection = db['newElements']
            col = collection.find().sort([('timeStamp', -1)]).limit(1)
            element_id = ''
            for item in col:
                print('look over here: ' + str(item))
                element_id = str(item['class_id'])

        save_new_style(element_id, fontSize, fontFamily, fontColor, bordercolor, borderRadius, bgcolor, textAlign,
                       'unset', '', zIndex)

    # Add Paragraph
    elif action == '4':

        p = db['paragraphs'].find_one({'screebshot_id':str(screenshot_id),'state':'active'})
        print('meta running with action: ' + action)

        if p == None:
            classid = str(ObjectId())
            width = 20
            height = 10
            type = "paragraph"
            charactesLen = len(str('New Paragraph'))
            positionL = 40
            positionT = 45

            text_string = 'New Paragraph'

            # Style
            fontSize = '15'
            fontColor = 'white'
            textAlign = 'center'
            fontFamily = 'Helvetica'
            bordercolor = ''
            borderRadius = ''
            bgcolor = ''
            occupied = 1
            zIndex = 2

            location = {'x0': positionL, 'y0': positionT, 'x1': float(positionL) + float(width),
                        'y1': float(positionT) + float(height)}

            save_new_elements(classid, screenshot_id, type, text_string, location, date, '')
            collection = db['newElements']
            col = collection.find().sort([('timeStamp', -1)]).limit(1)
            element_id = ''
            for item in col:
                print('look over here: ' + str(item))
                element_id = str(item['class_id'])

        else:
            p_style = db['styles'].find_one({'sedmentation_id':str(p['seg_id'])})
            classid = str(ObjectId())
            width = 20
            height = 10
            type = "paragraph"
            charactesLen = len(str('New Paragraph'))
            positionL = 40
            positionT = 45

            text_string = 'New Paragraph'

            # Style
            fontSize = p_style['fontSize']
            fontColor = p_style['fontColor']
            textAlign = p_style['textAlign']
            fontFamily = p_style['fontFamily']
            bordercolor = ''
            borderRadius = ''
            bgcolor = ''
            occupied = 1
            zIndex = 2

            location = {'x0': positionL, 'y0': positionT, 'x1': float(positionL) + float(width),
                        'y1': float(positionT) + float(height)}

            save_new_elements(classid, screenshot_id, type, text_string, location, date, '')
            collection = db['newElements']
            col = collection.find().sort([('timeStamp', -1)]).limit(1)
            element_id = ''
            for item in col:
                print('look over here: ' + str(item))
                element_id = str(item['class_id'])


        save_new_style(element_id, fontSize, fontFamily, fontColor, bordercolor, borderRadius, bgcolor, textAlign,
                       'unset', '', zIndex)

    # Add TexBox
    elif action == '5':
        print('meta running with action: ' + action)

        t = db['textBoxes'].find_one({'sedmentation_id':str(screenshot_id),'status':'active'})

        if t == None:
            classid = str(ObjectId())
            name = 'TextBox'
            width = 10
            height = 5
            positionL = 45
            positionT = 48
            type = "textbox"
            placeholder = ''

            # Style
            bgcolor = 'white'
            bordercolor = 'red'
            borderRadius = '10'
            fontSize = '15'
            fontColor = 'black'
            textAlign = 'unset'
            childOffset = '10'
            fontFamily = 'Helvetica'
            textIndent = 'unset'
            occupied = 1
            zIndex = 2

            location = {'x0': positionL, 'y0': positionT, 'x1': float(positionL) + float(width),
                        'y1': float(positionT) + float(height)}

            save_new_elements(classid, screenshot_id, type, name, location, date, '')
            collection = db['newElements']
            col = collection.find().sort([('timeStamp', -1)]).limit(1)
            element_id = ''
            for item in col:
                print('look over here: ' + str(item))
                element_id = str(item['class_id'])
        else:
            t_style = db['styles'].find_one({'sedmentation_id': str(t['seg_id'])})
            classid = str(ObjectId())
            name = 'TextBox'
            width = float(t['location']['x1']) - float(t['location']['x0'])
            height = float(t['location']['y1']) - float(t['location']['y0'])
            positionL = 50 - width/2
            positionT = 50 - height/2
            type = "textbox"
            placeholder = ''

            # Style
            bgcolor = t_style['bgcolor']
            bordercolor = t_style['borderColor']
            borderRadius = t_style['boderRadius']
            fontSize = t_style['fontSize']
            fontColor = t_style['fontColor']
            textAlign = t_style['textAlign']
            childOffset = '10'
            fontFamily = t_style['fontFamily']
            textIndent = t_style['textIndent']
            occupied = 1
            zIndex = 2

            location = {'x0': positionL, 'y0': positionT, 'x1': float(positionL) + float(width),
                        'y1': float(positionT) + float(height)}

            save_new_elements(classid, screenshot_id, type, name, location, date, '')
            collection = db['newElements']
            col = collection.find().sort([('timeStamp', -1)]).limit(1)
            element_id = ''
            for item in col:
                print('look over here: ' + str(item))
                element_id = str(item['class_id'])


        save_new_style(element_id, fontSize, fontFamily, fontColor, bordercolor, borderRadius, bgcolor, textAlign,
                       textIndent, '', zIndex)

    # Add TextArea
    elif action == '6':
        print('meta running with action: ' + action)
        t = db['textBoxes'].find_one({'sedmentation_id': str(screenshot_id), 'status': 'active'})

        if t == None:
            classid = str(ObjectId())
            name = 'New Text Area'
            width = 10
            height = 5
            positionL = 45
            positionT = 48
            type = "textArea"
            placeholder = ''

            # Style
            bgcolor = 'white'
            bordercolor = 'red'
            borderRadius = '10'
            fontSize = '15'
            fontColor = 'black'
            textAlign = 'unset'
            childOffset = '10'
            fontFamily = 'Helvetica'
            textIndent = 'unset'
            occupied = 1
            zIndex = 2

            location = {'x0': positionL, 'y0': positionT, 'x1': float(positionL) + float(width),
                        'y1': float(positionT) + float(height)}

            save_new_elements(classid, screenshot_id, type, name, location, date, '')
            collection = db['newElements']
            col = collection.find().sort([('timeStamp', -1)]).limit(1)
            element_id = ''
            for item in col:
                print('look over here: ' + str(item))
                element_id = str(item['class_id'])
        else:
            t_style = db['styles'].find_one({'sedmentation_id': str(t['seg_id'])})
            classid = str(ObjectId())
            name = 'New Text Area'
            width = float(t['location']['x1']) - float(t['location']['x0'])
            height = float(t['location']['y1']) - float(t['location']['y0'])
            positionL = 50 - width / 2
            positionT = 50 - height / 2
            type = "textArea"
            placeholder = ''

            # Style
            bgcolor = t_style['bgcolor']
            bordercolor = t_style['borderColor']
            borderRadius = t_style['boderRadius']
            fontSize = t_style['fontSize']
            fontColor = t_style['fontColor']
            textAlign = t_style['textAlign']
            childOffset = '10'
            fontFamily = t_style['fontFamily']
            textIndent = t_style['textIndent']
            occupied = 1
            zIndex = 2

            location = {'x0': positionL, 'y0': positionT, 'x1': float(positionL) + float(width),
                        'y1': float(positionT) + float(height)}

            save_new_elements(classid, screenshot_id, type, name, location, date, '')
            collection = db['newElements']
            col = collection.find().sort([('timeStamp', -1)]).limit(1)
            element_id = ''
            for item in col:
                print('look over here: ' + str(item))
                element_id = str(item['class_id'])

        save_new_style(element_id, fontSize, fontFamily, fontColor, bordercolor, borderRadius, bgcolor, textAlign,
                       textIndent, '', zIndex)
    # Add img
    elif action == '7':
        print('meta running with action: ' + action)

        icon_path = str(filename)
        classid = str(ObjectId())
        type = "image"
        width = 20
        height = 10
        positionL = 40
        positionT = 45
        name = 'New Element'
        location = {'x0': positionL, 'y0': positionT, 'x1': float(positionL) + float(width),
                    'y1': float(positionT) + float(height)}

        save_new_elements(classid, screenshot_id, type, name, location, date, icon_path)
        collection = db['newElements']
        col = collection.find().sort([('timeStamp', -1)]).limit(1)
        element_id = ''
        bordercolor = 'unset'
        borderRadius = '0'
        for item in col:
            print('look over here: ' + str(item))
            element_id = str(item['class_id'])

        save_new_style(element_id, '', '', '', bordercolor, borderRadius, '', '', '', '', '2')

    # Add Widget
    elif action == '8':
        print('meta running with action: ' + action)

        widgetName = filename
        icon_name = str(widgetName)
        ty_cond = icon_name[:-2]
        typ = icon_name
        icon_path = '/media/widgets/' + icon_name
        print(icon_name)
        print(icon_path)
        print(ty_cond)
        print(typ)

        classid = str(ObjectId())
        width = 35
        height = 35
        positionL = 40
        positionT = 45
        name = 'New Element'
        location = {'x0': positionL, 'y0': positionT, 'x1': float(positionL) + float(width),
                    'y1': float(positionT) + float(height)}
        # map Widget
        if ty_cond == 'map':
            type1 = typ
            save_new_elements(classid, screenshot_id, type1, name, location, date, icon_path)
        # calendar widget
        elif ty_cond == 'calendar':
            type1 = typ
            save_new_elements(classid, screenshot_id, type1, name, location, date, icon_path)
        # bar chart Graphics
        elif ty_cond == 'bar':
            type1 = typ
            save_new_elements(classid, screenshot_id, type1, name, location, date, icon_path)
        # pie chart Graphics
        elif ty_cond == 'pie':
            type1 = typ
            save_new_elements(classid, screenshot_id, type1, name, location, date, icon_path)

        collection = db['newElements']
        col = collection.find().sort([('timeStamp', -1)]).limit(1)
        element_id = ''
        bordercolor = 'unset'
        borderRadius = '0'
        for item in col:
            print('look over here: ' + str(item))
            element_id = str(item['class_id'])
        if ty_cond == 'bar':
            save_new_style_BarChart(element_id, '', '', '', bordercolor, borderRadius, '', '', '', '', '2')
        else:
            save_new_style(element_id, '', '', '', bordercolor, borderRadius, '', '', '', '', '2')


def metaColorTransfer(currentUser, myFile, screenshot_id, folder, index, colors):
    print('BEGGINING META-LAYOUTS')

    ButtonArray = get_collection(db.buttons, screenshot_id)
    textBoxArray = get_collection(db.textBoxes, screenshot_id)
    textAreaArray = get_collection(db.textArea, screenshot_id)
    hyperLinkArray = get_collection(db.hyperLinks, screenshot_id)
    paragraphArray = get_collection(db.paragraphs, screenshot_id)
    frameArray = get_collection(db.frames, screenshot_id)
    logoArray = get_collection(db.logo, screenshot_id)
    iconArray = get_collection(db.icon, screenshot_id)
    pictureArray = get_collection(db.pictures, screenshot_id)


    newElementsArray = get_collection(db.newElements, screenshot_id)
    widgetArray = get_collection(db.widgets, screenshot_id)

    '#####################################   DEF of META ALGO  #####################################################'

    '# CREATION OF HTML AND CSS PAGE'
    '# FUNCTION TO OPEN, CREATE, SAVE AND CLOSE FILES'
    if 6 == 6:

        def create_page_Html_and_Css_and_js(path, titleHtml, titleCssJS):

            croppedFileName = str(myFile[int(len(str(currentUser))) + 7:-4])
            import os
            if (folder == '/layouts/'):
                try:
                    os.stat('static/users/' + str(currentUser) + '/' + croppedFileName + folder)

                except:
                    os.mkdir('static/users/' + str(currentUser) + '/' + croppedFileName + folder)
                pagehtml = open(
                    'static/users/' + str(currentUser) + '/' + croppedFileName + folder + titleHtml + '.html',
                    mode='w', encoding='UTF-8')
                pagehtml.write('<section class="layouts">')

                try:
                    os.stat('static/users/' + str(currentUser) + '/' + croppedFileName + folder + 'css/')
                except:
                    os.mkdir('static/users/' + str(currentUser) + '/' + croppedFileName + folder + 'css/')
                pagecss = open(
                    'static/users/' + str(
                        currentUser) + '/' + croppedFileName + folder + 'css/' + titleCssJS + '.css',
                    'w')  # root css page
            else:
                try:
                    os.stat('static/users/' + str(currentUser) + '/' + croppedFileName + '/')

                except:
                    os.mkdir('static/users/' + str(currentUser) + '/' + croppedFileName + '/')
                pagehtml = open(
                    'static/users/' + str(currentUser) + '/' + croppedFileName + '/' + titleHtml + '.html',
                    mode='w', encoding='UTF-8')
                pagehtml.write('<section class="colorTransfer" style="background-color:' + colors[0] + '">')

                try:
                    os.stat('static/users/' + str(currentUser) + '/' + croppedFileName + '/' + 'css/')
                except:
                    os.mkdir('static/users/' + str(currentUser) + '/' + croppedFileName + '/' + 'css/')
                pagecss = open(
                    'static/users/' + str(
                        currentUser) + '/' + croppedFileName + '/' + 'css/' + titleCssJS + '.css',
                    'w')  # root css page
            ###

            # try:
            #     os.stat('./templates/js')
            # except:
            #     os.mkdir('./templates/js')
            # pagejs = open('./templates/js/' + 'test' + '.js', 'w')
            #
            # pagejs.write('interact(".resize-drag").draggable({" \
            #                                             "onmove: window.dragMoveListener}).resizable({" \
            #                                             "preserveAspectRatio: true," \
            #                                             "edges: { left: true, right: true, bottom: true, top: true }})" \
            #                                             ".on("resizemove", function (event) {" \
            #                                                             "var target = event.target, x = (" \
            #                                                             "parseFloat(target.getAttribute(" \
            #                                                             ""data-x")) || 0), y = (parseFloat(target.getAttribute(" \
            #                                                                     ""data-y")) || 0); target.style.width  = event.rect.width + "px"; target.style.height = event.rect.height + "px"; x += event.deltaRect.left; y += event.deltaRect.top; target.style.webkitTransform = target.style.transform = "translate(" + x + "px," + y + "px)"; target.setAttribute("data-x", x); target.setAttribute("data-y", y);});')
            # pagejs.write(
            #     'interact(".draggable").draggable({ inertia: true, autoScroll: true, onmove: dragMoveListener, onend: function (event) { var textEl = event.target.querySelector("p"); textEl && (textEl.textContent = "moved a distance of "+ (Math.sqrt(event.dx* event.dx + event.dy*  event.dy)|0) + "px");}}); function dragMoveListener (event) { var target = event.target, x = (parseFloat(target.getAttribute("data-x")) || 0) + event.dx, y = (parseFloat(target.getAttribute("data-y")) || 0) + event.dy; target.style.webkitTransform = target.style.transform = "translate(" + x + "px, " + y + "px)"; target.setAttribute("data-x", x); target.setAttribute("data-y", y);}')
            # ###
            return pagehtml, pagecss

        def close_page_html_and_css_end():
            pagehtml.write('</body>')
            pagehtml.close()
            pagecss.close()

        def close_page_html_end():
            pagehtml.write('</section>')
            pagehtml.close()

        def close_page_html():
            pagehtml.close()

        def close_page_css():
            pagecss.close()

            # BASIC ELEMENTS FOR DEMO

            # CREATION OF BUTTON AND TEXTBOX

        def create_button(label, classid, width, height, borderRadius, positionL, positionT, bgcolor, borderColor,
                          fontColor, fontSize, fontFamily, link):

            pagehtml.write(
                '<button type="button" class="class' + classid + '" id="id' + classid + '">' + label + '</button>\n')
            pagecss.write(
                '.class' + classid + '{height:' + height + '%; width:' + width + '%; border-radius: ' + borderRadius + 'px;\
                        border: 1px solid ' + borderColor + '; background-color: ' + bgcolor + '; font-size: ' + fontSize + 'px; color: ' + fontColor + ';\
                        position:absolute; left:' + positionL + '%; top:' + positionT + '%; \
                        font-family: ' + fontFamily + ';}' + ' ' + '#id' + classid + '{}\n')

        def create_Button_label_icon_inside(label, classid_b, width_b, height_b, positionL_b, positionT_b, \
                                            src_icon, classid_i, width_i, height_i, positionL_i, positionT_i):
            pagehtml.write('<button type="button" class="class' + classid_b + '" id="id' + classid_b + '">\n\
                    <img src="' + src_icon + '" class="class' + classid_i + '" id="id' + classid_i + '">' + label + '\n\
                    </button>\n')
            pagecss.write(
                '.class' + classid_b + '{height:' + height_b + '%; width:' + width_b + '%; position:absolute; left:' + positionL_b + '%;top:' + positionT_b + '%}' + ' ' + '#id' + classid_b + '{}\n\
                                 .class' + classid_i + '{height:' + height_i + '%; width:' + width_i + '%; position:absolute; left:' + positionL_i + '%;top:' + positionT_i + '%} #id' + classid_i + '{}\n')

        def create_Button_icon_inside(classid_b, width_b, height_b, positionL_b, positionT_b, \
                                      src_icon, classid_i, width_i, height_i, positionL_i, positionT_i):
            pagehtml.write(
                '<button type="button" class="draggable resize-drag class' + classid_b + '" id="id' + classid_b + '">\n\
                    <img src="' + src_icon + '" class="class' + classid_i + '" id="id' + classid_i + '">' + label + '\n\
                    </button>\n')
            pagecss.write(
                '.class' + classid_b + '{height:' + height_b + '%; width:' + width_b + '%;position:absolute; left:' + positionL_b + '%;top:' + positionT_b + '%}' + ' ' + '#id' + classid_b + '{}\n\
                                 .class' + classid_i + '{height:' + height_i + '%; width:' + width_i + '%;position:absolute; left:' + positionL_i + '%;top:' + positionT_i + '%} #id' + classid_i + '{}\n')

        def create_text_box_placeholder(placeholder, name, width, height, classid, borderRadius, positionL, positionT,
                                        bgcolor, childOffset, fontSize, fontFamily, fontColor, textAlign, bordercolor):
            pagehtml.write(
                '<input type="text" name="' + name + '" class="class' + classid + '" id="id' + classid + '" \n\
                        placeholder="' + placeholder + '"></input>\n')
            pagecss.write(
                '.class' + classid + '{height:' + height + '%;  text-indent: ' + childOffset + 'px; width:' + width + '%; border-radius: ' + borderRadius + 'px;\n\
                        border: 0px; position:absolute; left:' + positionL + '%; top:' + positionT +
                '%; font-size: ' + fontSize + 'px; color: ' + fontColor + ';text-align:' + textAlign + ';background-color: ' + bgcolor +
                '; font-family: ' + fontFamily + '; border-color:' + bordercolor + '; }' + ' ' + '#id' + classid + '{}\n')

        def create_text_box_placeholder_legend(legend, placeholder, name, classid, width, height, borderRadius,
                                               positionL,
                                               positionT, bgcolor):
            pagehtml.write(
                legend + ' : <input type="text" name="' + name + '" class="draggable resize-drag class' + classid + '" id="id' + classid + '" \
                        placeholder="' + placeholder + '"></input>\n')
            pagecss.write(
                '.class' + classid + '{height:' + height + '%; width:' + width + '%; border-radius: ' + borderRadius + 'px;\
                         border: 0px; position:absolute; left:' + positionL + '%; top:' + positionT + '%; \
                         background-color: ' + bgcolor + '}' + ' ' + '#id' + classid + '{}\n')

        def create_text_box_legend(legend, classidf, positionLf, positionTf, fontSize, classidtb, width, height,
                                   borderRadius, positionL, positionT, bgcolor, childOffset, borderColor):
            pagehtml.write(
                '<p drag-resize class="class' + classidf + '" id="id' + classidf + '" style="margin:0">' + legend + '</p>\n\
                        <input drag-resize type="text" name="bla" class="class' + classidtb + '" id="id' + classidtb + '"></input>\n')
            pagecss.write(
                '.class' + classidf + '{position: absolute; left:' + positionLf + '%; top:' + positionTf + '%; font-size: ' + fontSize + '%;} #id' + classidf + '{} \n\
                        .class' + classidtb + '{height:' + height + '%; text-indent: ' + childOffset + 'px; width:' + width + '%;position:absolute; border-radius: ' + borderRadius + 'px; border: 1px solid ' + borderColor + '; \
                        left:' + positionL + '%; top:' + positionT + '%; background-color: ' + bgcolor + '}' + ' ' + '#id' + classidtb + '{}\n')

        def create_text_area(place_holder, name, classid, width, height, positionL, positionT, childOffset, fontSize,
                             bgcolor, borderRadius, borderColor, fontFamily, fontColor):

            if childOffset == 'unset':
                pagehtml.write(
                    '<textarea name="' + name + '" class="class' + classid + '" id="id' + classid + '" placeholder="' + place_holder + '"></textarea>\n')
                pagecss.write(
                    '.class' + classid + '{resize: none; height:' + height + '%; text-indent: ' + childOffset + '; width:' + width + '%;position:absolute; left:' + positionL + '%; \
                                border-radius: ' + borderRadius + 'px; border: 1px solid ' + borderColor + '; top:' + positionT + '%; \
                                font-size: ' + fontSize + 'px; font-family: ' + fontFamily + '; color: ' + fontColor + '; background-color: ' + bgcolor + ';}' + ' ' + '#id' + classid + '{}\n')
            else:

                pagehtml.write(
                    '<textarea name="' + name + '" class="class' + classid + '" id="id' + classid + '" placeholder="' + place_holder + '"></textarea>\n')
                pagecss.write(
                    '.class' + classid + '{resize: none; height:' + height + '%; text-indent: ' + childOffset + 'px ; width:' + width + '%;position:absolute; left:' + positionL + '%; \
                    border-radius: ' + borderRadius + 'px; border: 1px solid ' + borderColor + '; top:' + positionT + '%; \
                    font-size: ' + fontSize + 'px; font-family: ' + fontFamily + '; background-color: ' + bgcolor + ';}' + ' ' + '#id' + classid + '{}\n')

            # CREATION OF IMAGE

        def create_image(icon_path, classid, width, height, positionL, positionT, link):

            pagehtml.write(
                '<img src="/' + icon_path + '" class="class' + classid + '" id="id' + classid + '"/>\n')
            pagecss.write(
                '.class' + classid + '{height: auto; width: auto; max-height:' + height + '%; max-width:' + width + '%;position:absolute; left:' + positionL + '%; top:' + positionT + '%}' + ' ' + '#id' + classid + '{}\n')


        def create_icon(icon_path, classid, width, height, positionL, positionT, link):

            pagehtml.write(
                '<img src="/' + icon_path + '" class="class' + classid + ' recon-icon" id="id' + classid + '"/>\n')
            pagecss.write(
                '.class' + classid + '{height: auto; width: auto; max-height:' + height + '%; max-width:' + width + '%;position:absolute; left:' + positionL + '%; top:' + positionT + '%}' + ' ' + '#id' + classid + '{}\n')

        def create_image_active(location, icon_path, classid, width, height, positionL, positionT):
            pagehtml.write(
                '<img src="' + icon_path + '" onClick="' + location + '" class="draggable resize-drag class' + classid + '" id="id' + classid + '"/>\n')
            pagecss.write(
                '.class' + classid + '{height:' + height + '%; width:' + width + '%;position:absolute; left:' + positionL + '%; top:' + positionT + '%}' + ' ' + '#id' + classid + '{}\n')

        # CREATION OF WIDGETS

        def create_widget(icon_path, classid, width, height, positionL, positionT, link):
            print('Creating Widgetsssssss')
            pagehtml.write(
                '<div class="class' + classid + '" id="id' + classid + '"></div>\n' +
                '<script>function myMap() {' +
                'var mapProp= {' +
                'center:new google.maps.LatLng(51.508742,-0.120850),' +
                'zoom:5,' +
                '};' +
                'var map=new google.maps.Map(document.getElementById("googleMap"),mapProp);' +
                '}' +
                '</script>' +
                '< script' +
                'src = "https://maps.googleapis.com/maps/api/js?key=YOUR_KEY&callback=myMap" > < / script >')
            pagecss.write(
                '.class' + classid + '{height: auto; width: auto; max-height:' + height + '%; max-width:' + width + '%;position:absolute; left:' + positionL + '%; top:' + positionT + '%}' + ' ' + '#id' + classid + '{}\n')

            # CREATION OF PARAGRAPH AND TITLE

        def create_googleMap(icon_path, classid, width, height, positionL, positionT, link, zIndex):
            pagehtml.write(
                '<link href="resizable_chart.css" rel="stylesheet">\n\
                <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">\n\
                <script src="https://d3js.org/d3.v4.min.js"></script>\n\
                <div drag-resize id="id' + classid + '" class="class' + classid + ' main">\n\
                           <button id="cancel_edit" onmousedown="cancel_editDelayed()"><i class="fa fa-times"></i></button>\n\
                           <button id="unlock" onmousedown="unlockDelayed()"><i class="fa fa-unlock"></i></button>\n\
                           <div id="title">\n\
                               <div id= "icon-bar" class="icon-bar">\n\
                                   <button id="delete" onmousedown="del()"><i class="fa fa-trash"></i></button>\n\
                                   <button id="lock" onmousedown="lock()"><i class="fa fa-lock"></i></button>\n\
                                   <button id="edit" onmousedown="edit()"><i class="fa fa-pencil"></i></button>\n\
                               </div>\n\
                           </div>\n\
                           <div id="selected" style="height: 100%;width: 100%;">\n\
                               <div id="temp_inner"></div>\n\
                           </div>\n\
                       </div>\n\
                       <script>\n\
                       var minWidth = 60;\n\
                       var minHeight = 40;\n\
                       var MARGINS = 4;\n\
                       var clicked = null;\n\
                       var onRightEdge, onBottomEdge, onLeftEdge, onTopEdge;\n\
                       var rightScreenEdge, bottomScreenEdge;\n\
                       var b, x, y;\n\
                       var redraw = false;\n\
                       var pane = document.getElementById("id' + classid + '");\n\
                   pane.addEventListener("mousedown", onMouseDown);\n\
                   document.addEventListener("mousemove", onMove);\n\
                   function onMouseDown(e) {\n\
                       onDown(e);\n\
                       e.preventDefault();\n\
                   }\n\
                   function onDown(e) {\n\
                       calc(e);\n\
                       var isResizing = onRightEdge || onBottomEdge || onTopEdge || onLeftEdge;\n\
                       clicked = {\n\
                           x: x,\n\
                           y: y,\n\
                           cx: e.clientX,\n\
                           cy: e.clientY,\n\
                           w: b.width,\n\
                           h: b.height,\n\
                           isResizing: isResizing,\n\
                           isMoving: !isResizing && canMove(),\n\
                           onTopEdge: onTopEdge,\n\
                           onLeftEdge: onLeftEdge,\n\
                           onRightEdge: onRightEdge,\n\
                           onBottomEdge: onBottomEdge\n\
                       };\n\
                   }\n\
                   function canMove() {\n\
                       return x > 0 && x < b.width && y > 0 && y < b.height;\n\
                   }\n\
                   function calc(e) {\n\
                       b = pane.getBoundingClientRect();\n\
                       x = e.clientX - b.left;\n\
                       y = e.clientY - b.top;\n\
                       onTopEdge = y < MARGINS;\n\
                       onLeftEdge = x < MARGINS;\n\
                       onRightEdge = x >= b.width - MARGINS;\n\
                       onBottomEdge = y >= b.height - MARGINS;\n\
                       rightScreenEdge = window.innerWidth - MARGINS;\n\
                       bottomScreenEdge = window.innerHeight - MARGINS;\n\
                   }\n\
                   var e;\n\
                   function onMove(ee) {\n\
                       animate();\n\
                       calc(ee);\n\
                       e = ee;\n\
                       redraw = true;\n\
                   }\n\
                   function animate() {\n\
                       var screen = document.getElementById("container-inside-frame").getBoundingClientRect();\n\
                       requestAnimationFrame(animate);\n\
                       if (!redraw) return;\n\
                       redraw = false;\n\
                       if (clicked && clicked.isResizing) {\n\
                           if (clicked.onRightEdge) pane.style.width = Math.max(x, minWidth) + "px";\n\
                           if (clicked.onBottomEdge) pane.style.height = Math.max(y, minHeight) + "px";\n\
                           if (clicked.onLeftEdge) {\n\
                               var currentWidth = Math.max(clicked.cx - e.clientX  + clicked.w, minWidth);\n\
                               if (currentWidth > minWidth) {\n\
                                   pane.style.width = currentWidth + "px";\n\
                                   pane.style.left = e.clientX - screen.left + "px";\n\
                               }\n\
                           }\n\
                           if (clicked.onTopEdge) {\n\
                               var currentHeight = Math.max(clicked.cy - e.clientY  + clicked.h, minHeight);\n\
                               if (currentHeight > minHeight) {\n\
                                   pane.style.height = currentHeight + "px";\n\
                                   pane.style.top = e.clientY - screen.top + "px";\n\
                               }\n\
                           }\n\
                           return;\n\
                       }\n\
                       if (clicked && clicked.isMoving) {\n\
                           pane.style.top = (e.clientY - screen.top - clicked.y) + "px";\n\
                           pane.style.left = (e.clientX - screen.left - clicked.x) + "px";\n\
                           return;\n\
                       }\n\
                       if (onRightEdge && onBottomEdge || onLeftEdge && onTopEdge) {\n\
                           pane.style.cursor = "nwse-resize";\n\
                       } else if (onRightEdge && onTopEdge || onBottomEdge && onLeftEdge) {\n\
                           pane.style.cursor = "nesw-resize";\n\
                       } else if (onRightEdge || onLeftEdge) {\n\
                           pane.style.cursor = "ew-resize";\n\
                       } else if (onBottomEdge || onTopEdge) {\n\
                           pane.style.cursor = "ns-resize";\n\
                       } else if (canMove()) {\n\
                           pane.style.cursor = "move";\n\
                       } else {\n\
                           pane.style.cursor = "default";\n\
                       }\n\
                   }\n\
                   animate();\n\
                   function myMap() {\n\
                       var mapOptions = {\n\
                           center: new google.maps.LatLng(51.5, -0.12),\n\
                           zoom: 10,\n\
                           mapTypeId: google.maps.MapTypeId.HYBRID\n\
                       }\n\
                       var map = new google.maps.Map(document.getElementById("temp_inner"),mapOptions);\n\
                   }\n\
                   var backup_pane;\n\
                   function edit(){\n\
                       pane.removeEventListener("mousedown", onMouseDown);\n\
                       document.removeEventListener("mousemove", onMove);\n\
                       document.removeEventListener("mouseup", onUp);\n\
                       document.getElementById("title").style.visibility = "hidden";\n\
                       document.getElementById("cancel_edit").style.visibility = "visible";\n\
                       document.getElementById("selected").style.borderWidth = "1px";\n\
                       document.getElementById("selected").style.borderStyle = "dashed";\n\
                       document.getElementById("selected").style.borderRadius = "6px";\n\
                       document.getElementById("icon-bar").style.visibility = "hidden";\n\
                   }\n\
                   var cancel_edit_delayed;\n\
                   function cancel_editDelayed() {\n\
                       cancel_edit_delayed = setTimeout(cancel_edit, 100);\n\
                   }\n\
                   function cancel_edit(){\n\
                       pane.addEventListener("mousedown", onMouseDown);\n\
                       document.addEventListener("mousemove", onMove);\n\
                       document.getElementById("title").style.visibility = "visible";\n\
                       document.getElementById("cancel_edit").style.visibility = "hidden";\n\
                       document.getElementById("selected").style.borderWidth = "0px";\n\
                       document.getElementById("icon-bar").style.visibility = defaultStatus;\n\
                   }\n\
                   var unlock_delayed;\n\
                   function unlockDelayed() {\n\
                       unlock_delayed = setTimeout(unlock, 100);\n\
                   }\n\
                   function lock(){\n\
                       pane.removeEventListener("mousedown", onMouseDown);\n\
                       document.removeEventListener("mousemove", onMove);\n\
                       document.removeEventListener("mouseup", onUp);\n\
                       document.getElementById("title").style.backgroundColor = "transparent";\n\
                       document.getElementById("unlock").style.visibility = "visible";\n\
                       document.getElementById("icon-bar").style.visibility = "hidden";\n\
                   }\n\
                   function unlock(){\n\
                       pane.addEventListener("mousedown", onMouseDown);\n\
                       document.addEventListener("mousemove", onMove);\n\
                       document.getElementById("title").style.backgroundColor = defaultStatus;\n\
                       document.getElementById("title").style.borderStyle = defaultStatus;\n\
                       document.getElementById("icon-bar").style.visibility = defaultStatus;\n\
                       document.getElementById("unlock").style.visibility = "hidden";\n\
                   }\n\
                   </script>\n\
                   <script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyB6d8kHSyB_BemEfCxrc45nvq62zseaGY&callback=myMap"> </script>')

            pagecss.write(
                '#id' + classid + '{'
                + 'position: absolute;'
                + 'height:' + height + '%;'
                + 'width:' + width + '%;'
                + 'left:' + positionL + '%;'
                + 'top:' + positionT + '%;'
                + 'margin: 0;'
                + 'padding: 0;'
                + 'background: transparent;'
                + 'z-index: 10;'
                + '}' +

                'body {'
                + 'overflow: auto;'
                + '}' +

                '#title {'
                + 'position: absolute;'
                + 'font-family: monospace;'
                + 'font-size: 24px;'
                + 'text-align: center;'
                + 'height: 100%;'
                + 'width: 100%;'
                + 'position: absolute;'
                + 'visibility: visible;'
                + 'border-radius: 6px;'
                + 'z-index: 10;'
                + '}' +

                '#cancel_edit {'
                + 'position:absolute;'
                + 'height: 30px;'
                + 'width: 30px;'
                + 'background-color: grey;'
                + 'right: -4px;'
                + 'top: -4px;'
                + 'visibility: hidden;'
                + 'z-index: 15;'
                + '}' +

                '#unlock {'
                + 'position:absolute;'
                + 'height: 30px;'
                + 'width: 30px;'
                + 'background-color: grey;'
                + 'right: -4px;'
                + 'top: -4px;'
                + 'visibility: hidden;'
                + 'z-index: 15;'
                + '}' +

                '#title:hover .icon-bar{'
                + 'visibility:visible;'
                + '}' +

                '#title:hover{'
                + 'background-color: rgba(100, 100, 100, 0.3);'
                + 'border-width: 1px;'
                + 'border-style: dashed;'
                + 'border-color: black;'
                + '}' +

                '.icon-bar button:hover{'
                + 'background-color:#000;'
                + '}' +

                '.active{'
                + 'background-color: #4CAF50 !important;'
                + '}' +

                '.icon-bar{'
                + 'width: 50%;'
                + 'height: 34px;'
                + 'transform: translate(50%);'
                + 'background-color: #555;'
                + 'overflow: auto;'
                + 'visibility: hidden;'
                + '}' +

                '.icon-bar button{'
                + 'float: left;'
                + 'width: 33.33%;'
                + 'text-align: center;'
                + 'padding: 12px 0;'
                + 'color:white;'
                + 'font-size:10px;'
                + 'background-color:grey;'
                + 'border:none;'
                + 'outline:none;'
                + 'cursor:pointer;'
                + '}' +

                '#temp_inner {'
                + 'height:calc(100% - 20px);'
                + 'width:calc(100% - 20px);'
                + 'margin-bottom: 10px;'
                + 'margin-top: 10px;'
                + 'margin-left: 10px;'
                + 'margin-right: 10px;'
                + '}')

        def create_paragraph(classid, text_string, positionL, positionT, fontSize, fontColor, width, textAlign, height,
                             fontFamily, link):

            pagehtml.write(
                '<p  class="class' + classid + '" id="id' + classid + '">' + text_string + '</p>\n')
            pagecss.write(
                '.class' + classid + '{position:absolute; text-align: ' + textAlign + '; left:' + positionL + '%; top:' + positionT + '%;\
                                     width:' + width + '%; height: ' + height + '%; margin : 0px; font-size: ' + fontSize + 'px; \
                                     color: ' + fontColor + '; font-family: ' + fontFamily + '; white-space: normal;}' + ' ' + '#id' + classid + '{}\n')

        def create_selection(classid, text_string, positionL, positionT, fontSize, fontColor, width, textAlign):
            pagehtml.write(
                '<select drag-resize class="class' + classid + '" id="id' + classid + '"> \n <option value="' + text_string + '">' + text_string + '</option>\n </select>\n')
            pagecss.write(
                '.class' + classid + '{position:absolute; text-align: ' + textAlign + '; left:' + positionL + '%; top:' + positionT + '%;\
                          width:' + width + '%; margin : 0px; font-size: ' + fontSize + 'px;color: ' + fontColor + '}' + ' ' + '#id' + classid + '{}\n')

        def create_hyperLink(classid, text_string, positionL, positionT, fontSize, fontColor, width, textAlign,
                             fontFamily, link):

            pagehtml.write('<a class=" class' + classid + '" id="id' + classid + '">\n\
                            ' + text_string + '</a>\n')
            pagecss.write(
                '.class' + str(
                    classid) + '{position:absolute; text-align: ' + textAlign + '; left:' + positionL + '%; width:' + width + '%; top:' + positionT + '%;\
                                         margin: 0px; font-size: ' + fontSize + 'px;color: ' + fontColor + '; \
                                         font-family: ' + fontFamily + ';}' + ' ' + '#id' + str(classid) + '{} \
                                        .class' + str(classid) + ' > a{ color : inherit} \n \
                                        .class' + str(classid) + ':hover {color: ' + fontColor + '}')

        def create_title(h_type, classid, text_string, positionL, positionT):
            pagehtml.write(
                '<' + h_type + ' class="draggable resize-drag' + classid + '" id="id' + classid + '">' + text_string + '</' + h_type + '>\n')
            pagecss.write(
                '.class' + classid + '{position:absolute; left:' + positionL + '%; top:' + positionT + '%}' + ' ' + '#id' + classid + '{}\n')

        def create_section(classid, width, height, positionL, positionT, backgroundImage, backgroundColor, color):
            pagehtml.write(
                '<section class="draggable resize-drag class' + classid + '" id="id' + classid + '"></section>\n')
            pagecss.write(
                '.class' + classid + '{position:absolute; left: ' + positionL + '%; top: ' + positionT + '%;\
                        width:' + width + '%; height:' + height + '%;background-color:' + backgroundColor + ';\
                        background-image:url("' + backgroundImage + '"); color:' + color + '}' + ' ' + '#id' + classid + '{}\n')

        def create_open_section(classid, width, height, positionL, positionT, backgroundImage, backgroundColor, color):
            pagehtml.write('<section class="draggable resize-drag class' + classid + '" id="id' + classid + '">\n')
            pagecss.write(
                '.class' + classid + '{position:absolute;left:' + positionL + '%;top:' + positionT + '%;\
                        width:' + width + '%; height:' + height + '%;background-color:' + backgroundColor + ';\
                        background-image:url("' + backgroundImage + '"); color:' + color + '}' + ' ' + '#id' + classid + '{}\n')

        def create_close_section():
            pagehtml.write('</section>\n')

        def create_div(classid, width, height, positionL, positionT, borderRadius, borderColor, bgcolor):
            pagehtml.write('<div class="class' + classid + '" id="id' + classid + '"></div>\n')
            pagecss.write('.class' + classid + '{position: absolute; left: ' + positionL + '%;\
                    top: ' + positionT + '%; width: ' + width + '%; height: ' + height + '%; \
                    background-color:' + bgcolor + '; border: 1px solid ' + borderColor + '; border-radius: ' + borderRadius + 'px}' + ' ' + '#id' + classid + '{}\n'+
                    '#id' + str(classid) + ':hover{'
                    + 'border-width: 1px;border-style: dashed;'
                    + 'border-color: rgba(24, 166, 137, 1);}')

        def create_open_div(classid):
            pagehtml.write('<div class="draggable resize-drag class' + classid + '" id="id' + classid + '">\n')
            pagecss.write('.class' + classid + '{}' + ' ' + '#id' + classid + '{}\n')

        def create_close_div():
            pagehtml.write('</div>\n')

        def write_into_display_div():
            div = "container-inside-frame"
            pagehtml = open('./templates/testing.html', 'r')
            html = pagehtml.read()
            pagehtml.close()
            livre = open('../templates/customize/page2.html', 'r')
            lire = livre.read()
            index = 0
            c = 0
            while c < len(lire):
                if lire[c:c + 22] == div:
                    c2 = c + 22
                    while c2 < len(lire):
                        if lire[c2] == ">":
                            index = c2
                            ecrire = lire[0:index + 1] + html + lire[index + 1:]
                            pagehtml = open('../templates/customize/page2.html', 'w')
                            pagehtml.write(ecrire)
                            c2 = len(lire) + 1
                        c2 = c2 + 1
                c = c + 1

            return pagehtml

            # CREATION OF HEADER MENU WITH WHATEVER NUMBER OF HEADINGS

        def create_menu_text(headingsString, side, color, backgroundColor, width, height, positionL, positionT):
            def sentence_to_wordlist(raw):
                clean = re.sub("[^a-zA-Z0-9]", " ", raw)
                words = clean.split()
                return words

            headings = []
            headings = sentence_to_wordlist(headingsString)
            pagehtml.write('<header><ul class="ul_menutop">\n')
            for heading in headings:
                pagehtml.write(
                    '<li class="li_menutop"><a class="a_menutop" href="#' + heading + '">' + heading + '</a></li>\n')
            pagehtml.write('</ul></header>\n')
            pagecss.write('.ul_menutop{list-style-type: none;\
                    margin: 0;\
                    padding: 0;\
                    overflow: hidden;}\
                    .li_menutop{float:' + side + '}\
                    .li_menutop a {display: inline-block;\
                    color: ' + color + ';\
                    text-align: center;\
                    padding: 14px 16px;\
                    text-decoration: none;}\
                    header{background-color:' + backgroundColor + ';position:absolute; width:' + width + '%;\
                    height:' + height + '%;left:' + positionL + '%;top:' + positionT + '%;}\n')

            # CREATE FORM WITH WHATEVER NUMBER OF BUTTON AND TEXTBOX

        def create_form(nbrTxtB, nbrButton, strTxtB, strButton, actionpage, method_, classfidf):
            def create_button_form(value, width, height, classid, positionL, positionT):
                pagehtml.write(
                    '<input type="submit" value="' + value + '" class="draggable resize-drag class' + classid + '" id="id' + classid + '"></input>\n')
                pagecss.write(
                    '.class' + classid + '{height:' + height + '%; width:' + width + '%;position:absolute;\
                             left:' + positionL + '%; top:' + positionT + '%;}' + ' ' + '#id' + classid + '{}\n')

            def create_text_box_placeholder_form(placeholder, name, width, height, classid, positionL, positionT):
                pagehtml.write(
                    '<input type="text" name="' + name + '" class="draggable resize-drag class' + classid + '" id="id' + classid + '" placeholder="' + placeholder + '"></input>\n')
                pagecss.write(
                    '.class' + classid + '{height:' + height + '%; width:' + width + '%;position:absolute;\
                             left:' + positionL + '%; top:' + positionT + '%;}' + ' ' + '#id' + classid + '{}\n')

            '''
            def sentence_to_wordlist(raw):
                clean = re.sub("[^a-zA-Z0-9]", " ", raw)
                words = clean.split()
                return words

            txtBInfo = sentence_to_wordlist(strTxtB)
            BInfo = sentence_to_wordlist(strButton)
            txtb = 0
            txtB = []
            txtBInfoIndex = 0
            while txtb < int(nbrTxtB):
                placeholder = txtBInfo[txtBInfoIndex + 0]
                name = txtBInfo[txtBInfoIndex + 1]
                width = txtBInfo[txtBInfoIndex + 2]
                height = txtBInfo[txtBInfoIndex + 3]
                classidtb = txtBInfo[txtBInfoIndex + 4]
                positionL = txtBInfo[txtBInfoIndex + 5]
                positionT = txtBInfo[txtBInfoIndex + 6]
                txtBInfoIndex = txtBInfoIndex + 7
                TextBox = [placeholder, name, width, height, classidtb, positionL,
                           positionT]  # before was class and id check
                txtB.append(TextBox)
                txtb = txtb + 1
            b = 0
            B = []
            BInfoIndex = 0
            while b < int(nbrButton):
                value = BInfo[BInfoIndex + 0]
                width = BInfo[BInfoIndex + 1]
                height = BInfo[BInfoIndex + 2]
                classidb = BInfo[BInfoIndex + 3]
                positionL = BInfo[BInfoIndex + 4]
                positionT = BInfo[BInfoIndex + 5]
                BInfoIndex = BInfoIndex + 6
                Button = [value, width, height, classidb, positionL, positionT]  # before was class and id check
                B.append(Button)
                b = b + 1

            pagehtml.write('<form action="/' + actionpage + '" method="' + method_ + '">')
            pagecss.write('.' + classfidf + '{} #' + classfidf + '{}')
            for txtbox in txtB:
                print('this is the size of txtbox: ' + str(txtbox[2]))
                if str(txtbox[2]) >= '70':
                    create_text_area(txtbox[0], txtbox[1], txtbox[4], txtbox[2], txtbox[3], txtbox[5], txtbox[6])
                else:
                    create_text_box_placeholder_form(txtbox[0], txtbox[1], txtbox[2], txtbox[3], txtbox[4], txtbox[5],
                                                     txtbox[6])
            for button in B:
                create_button_form(button[0], button[1], button[2], button[3], button[4], button[5])
            pagehtml.write('</form>')
            '''
            # STYLE

        def set_background_image(class_, img):
            if (class_ == 'body') | (class_ == 'div') | (class_ == 'section') | (class_ == 'p') | (class_ == 'span') | (
                    class_ == 'em') | (class_ == 'footer'):
                pagecss.write(class_ + '{background-image: url(./' + img + ');background-size:cover;}\n')
            else:
                pagecss.write('.' + class_ + '{background-image: url(./' + img + ');background-size:cover;}\n')

        def set_background_color(class_, color):
            if (class_ == 'body') | (class_ == 'div') | (class_ == 'section') | (class_ == 'p') | (class_ == 'span') \
                    | (class_ == 'em') | (class_ == 'footer'):
                pagecss.write(class_ + '{ background-color:' + color + ';height: inherit;}\n')
            else:
                pagecss.write('.' + class_ + '{background-color:' + color + '; height: inherit;}\n')

        def colorBoW(croppedOcr):
            '#JVTWN'
            fontColor = "UNKNOWN"
            outside2 = []
            outside3 = []
            outside4 = []
            inside2 = []
            inside3 = []
            inside4 = []
            '#ILBNDY'
            r0 = io.imread(croppedOcr)
            r = color.rgb2gray(io.imread(croppedOcr))
            '#UC'
            contours = measure.find_contours(r, 0.8)
            for n, contour in enumerate(contours):
                if n == 0:
                    a = 0
                    b = 0
                    c = 0
                    while c < len(contour[:, 1]):
                        string = str(contour[:, 1][c])
                        if string[len(string) - 2:] != ".0":
                            c = c + 1
                        else:
                            a = contour[:, 1][c]
                            c = len(contour[:, 1]) + 1
                    c1 = 0
                    while c1 < len(contour[:, 0]):
                        string = str(contour[:, 0][c1])
                        if string[len(string) - 2:] != ".0":
                            c1 = c1 + 1
                        else:
                            b = contour[:, 0][c1]
                            c1 = len(contour[:, 0]) + 1
                    try:
                        outside2 = r0[int(b) + 2, int(a)]
                        outside3 = r0[int(b) + 2, int(a) - 1]
                        outside4 = r0[int(b) + 2, int(a) + 1]
                        print('1', outside4[0])
                        print('2', outside4[1])
                        print('3', outside4[2])
                        inside2 = r0[int(b) - 2, int(a)]
                        inside3 = r0[int(b) - 3, int(a)]
                        inside4 = r0[int(b) - 4, int(a)]

                        '#DFC'
                        if ((outside2[0] >= 200) | (outside2[1] >= 200) | (outside2[2] >= 200)) \
                                & ((outside3[0] >= 200) | (outside3[1] >= 200) | (outside3[2] >= 200)) \
                                & ((outside4[0] >= 200) | (outside4[1] >= 200) | (outside4[2] >= 200)):
                            fontColor = "black"
                        else:
                            fontColor = "white"
                    except:
                        print('==========================contour=========================================')
                        print(croppedOcr)

            if fontColor == "UNKNOWN":
                fontColor = "white"
                print('fail', croppedOcr)

            return fontColor

    '# RUN THE METAALGORITHM FOR EACH TYPE OF ELEMENT'
    if 7 == 7:
        print('try index here:')
        print(index)
        path = '../../'
        titleHtml = 'testing'
        titleCss = 'testingCss'
        pages_creation = create_page_Html_and_Css_and_js(path, titleHtml, titleCss)

        userId = getCollectionIDs('accounts_user', currentUser)
        pagehtml = pages_creation[0]
        pagecss = pages_creation[1]

        print('after \n')
        print("button", ButtonArray)
        print("paragraph", paragraphArray)
        print("hyperLink", hyperLinkArray)
        print("txtBox", textBoxArray)
        #        print("txtBoxLegend", textBoxLegendArray)
        print("frame", frameArray)
        print("logo", logoArray)

        '#CREATING ADDITIONAL NEW ELEMENT '
        print('new element: ' + str(newElementsArray))

        for e in newElementsArray:

            if len(newElementsArray) > 0:

                elementType = e['type']
                print("generate element type is " + elementType)
                if elementType == 'button':

                    label = e['name']
                    classid = e['class_id'][index:]
                    width = str(float(e['location']['x1']) - float(e['location']['x0']))
                    height = str(float(e['location']['y1']) - float(e['location']['y0']))
                    positionL = str(float(e['location']['x0']))
                    positionT = str(float(e['location']['y0']))

                    fSize = float(height)
                    fSize *= float(getMetrix(userId, 'layoutsHeight')) / 100

                    charactesLen = len(str(label))
                    newSize = ''
                    if label.islower():
                        textWidth = float((float(fSize) * 0.44128) * float(charactesLen))
                        checker = float(width) / int(charactesLen) / 0.44128
                        newSize = float((float(checker) * 0.44128) * float(charactesLen))
                    elif label.isupper():
                        textWidth = float((float(fSize) * 0.6064) * float(charactesLen))
                        checker = float(width) / int(charactesLen) / 0.6064
                        newSize = float((float(checker) * 0.6064) * float(charactesLen))

                    elif not label.islower() and not label.isupper():
                        textWidth = float((float(fSize) * 0.5289) * float(charactesLen))
                        checker = float(width) / int(charactesLen) / 0.5289
                        newSize = float((float(checker) * 0.5289) * float(charactesLen))

                    if textWidth >= newSize:
                        print('true')
                        fSize = checker

                    fontSize = str(fSize)

                    fStyles = get_new_fstyles(e['class_id'])

                    fontColor = fStyles['fontColor']
                    textAlign = fStyles['textAlign']
                    fontFamily = fStyles['fontFamily']

                    styles = get_new_bstyles(e['class_id'])
                    bgcolor = styles['bgcolor']
                    bordercolor = styles['borderColor']
                    borderRadius = styles['borderRadius']

                    create_button(label, str(classid), width, height, borderRadius, positionL, positionT, bgcolor,
                                  bordercolor,
                                  fontColor, str(fontSize), str(fontFamily), '')

                elif elementType == 'frame':

                    label = e['name']
                    classid = str(e['class_id'][index:])
                    width = str(float(e['location']['x1']) - float(e['location']['x0']))
                    height = str(float(e['location']['y1']) - float(e['location']['y0']))
                    positionL = str(float(e['location']['x0']))
                    positionT = str(float(e['location']['y0']))

                    fStyles = get_new_fstyles(e['class_id'])

                    fontSize = fStyles['fontSize']
                    fontColor = fStyles['fontColor']
                    textAlign = fStyles['textAlign']
                    fontFamily = fStyles['fontFamily']

                    styles = get_new_bstyles(e['class_id'])
                    bgcolor = styles['bgcolor']
                    bordercolor = styles['borderColor']
                    borderRadius = styles['borderRadius']

                    create_div(classid, width, height, positionL, positionT, borderRadius, bordercolor, bgcolor)

                elif elementType == 'hyperlink':

                    label = e['name']
                    classid = e['class_id'][index:]
                    width = str(float(e['location']['x1']) - float(e['location']['x0']))
                    height = str(float(e['location']['y1']) - float(e['location']['y0']))
                    positionL = str(float(e['location']['x0']))
                    positionT = str(float(e['location']['y0']))
                    text_string = str(e['name'])

                    fStyles = get_new_fstyles(e['class_id'])
                    fSize = float(height)
                    fSize *= float(getMetrix(userId, 'layoutsHeight')) / 100

                    charactesLen = len(str(label))
                    newSize = ''
                    if label.islower():
                        textWidth = float((float(fSize) * 0.44128) * float(charactesLen))
                        checker = float(width) / int(charactesLen) / 0.44128
                        newSize = float((float(checker) * 0.44128) * float(charactesLen))
                    elif label.isupper():
                        textWidth = float((float(fSize) * 0.6064) * float(charactesLen))
                        checker = float(width) / int(charactesLen) / 0.6064
                        newSize = float((float(checker) * 0.6064) * float(charactesLen))

                    elif not label.islower() and not label.isupper():
                        textWidth = float((float(fSize) * 0.5289) * float(charactesLen))
                        checker = float(width) / int(charactesLen) / 0.5289
                        newSize = float((float(checker) * 0.5289) * float(charactesLen))

                    if textWidth >= newSize:
                        print('true')
                        fSize = checker

                    fontSize = fSize
                    fontColor = fStyles['fontColor']
                    textAlign = fStyles['textAlign']
                    fontFamily = fStyles['fontFamily']

                    styles = get_new_bstyles(e['class_id'])
                    bgcolor = styles['bgcolor']
                    bordercolor = styles['borderColor']
                    borderRadius = styles['borderRadius']
                    # if state =='load':
                    create_hyperLink(str(classid), str(text_string), positionL,
                                    positionT, str(fontSize), fontColor, width, textAlign, fontFamily, '')

                elif elementType == 'paragraph':

                    label = e['name']
                    classid = e['class_id'][index:]
                    width = str(float(e['location']['x1']) - float(e['location']['x0']))
                    height = str(float(e['location']['y1']) - float(e['location']['y0']))
                    positionL = str(float(e['location']['x0']))
                    positionT = str(float(e['location']['y0']))
                    text_string = str(e['name'])

                    fStyles = get_new_fstyles(e['class_id'])
                    fSize = float(height)
                    fSize *= float(getMetrix(userId, 'layoutsHeight')) / 100

                    charactesLen = len(str(label))
                    newSize = ''
                    if label.islower():
                        textWidth = float((float(fSize) * 0.44128) * float(charactesLen))
                        checker = float(width) / int(charactesLen) / 0.44128
                        newSize = float((float(checker) * 0.44128) * float(charactesLen))
                    elif label.isupper():
                        textWidth = float((float(fSize) * 0.6064) * float(charactesLen))
                        checker = float(width) / int(charactesLen) / 0.6064
                        newSize = float((float(checker) * 0.6064) * float(charactesLen))

                    elif not label.islower() and not label.isupper():
                        textWidth = float((float(fSize) * 0.5289) * float(charactesLen))
                        checker = float(width) / int(charactesLen) / 0.5289
                        newSize = float((float(checker) * 0.5289) * float(charactesLen))

                    if textWidth >= newSize:
                        print('true')
                        fSize = checker

                    fontSize = str(fSize)
                    fontColor = fStyles['fontColor']
                    textAlign = fStyles['textAlign']
                    fontFamily = fStyles['fontFamily']

                    styles = get_new_bstyles(e['class_id'])
                    bgcolor = styles['bgcolor']
                    bordercolor = styles['borderColor']
                    borderRadius = styles['borderRadius']
                    link = ''

                    create_paragraph(classid, text_string, positionL, positionT, fontSize, fontColor, width,
                                     textAlign, height, fontFamily, link)

                elif elementType == 'textbox':

                    label = e['name']
                    classid = e['class_id'][index:]
                    width = str(float(e['location']['x1']) - float(e['location']['x0']))
                    height = str(float(e['location']['y1']) - float(e['location']['y0']))
                    positionL = str(float(e['location']['x0']))
                    positionT = str(float(e['location']['y0']))
                    placeholder = e['name']
                    # Check

                    fStyles = get_new_fstyles(e['class_id'])
                    childOffset = fStyles['textIndent']
                    fSize = float(height)
                    fSize *= float(getMetrix(userId, 'layoutsHeight')) / 100

                    charactesLen = len(str(label))
                    newSize = ''
                    if label.islower():
                        textWidth = float((float(fSize) * 0.44128) * float(charactesLen))
                        checker = float(width) / int(charactesLen) / 0.44128
                        newSize = float((float(checker) * 0.44128) * float(charactesLen))
                    elif label.isupper():
                        textWidth = float((float(fSize) * 0.6064) * float(charactesLen))
                        checker = float(width) / int(charactesLen) / 0.6064
                        newSize = float((float(checker) * 0.6064) * float(charactesLen))

                    elif not label.islower() and not label.isupper():
                        textWidth = float((float(fSize) * 0.5289) * float(charactesLen))
                        checker = float(width) / int(charactesLen) / 0.5289
                        newSize = float((float(checker) * 0.5289) * float(charactesLen))

                    if textWidth >= newSize:
                        print('true')
                        fSize = checker

                    fontSize = str(fSize)
                    fontColor = fStyles['fontColor']
                    textAlign = fStyles['textAlign']
                    fontFamily = fStyles['fontFamily']

                    styles = get_new_bstyles(e['class_id'])
                    bgcolor = styles['bgcolor']
                    bordercolor = styles['borderColor']
                    borderRadius = styles['borderRadius']

                    create_text_box_placeholder(placeholder, label, width, height, classid, borderRadius, positionL,
                                                positionT, bgcolor, childOffset, fontSize, fontFamily, fontColor,
                                                textAlign, bordercolor)

                elif elementType == 'textArea':

                    label = e['name']
                    classid = e['class_id'][index:]
                    width = str(float(e['location']['x1']) - float(e['location']['x0']))
                    height = str(float(e['location']['y1']) - float(e['location']['y0']))
                    positionL = str(float(e['location']['x0']))
                    positionT = str(float(e['location']['y0']))
                    placeholder = str(e['name'])
                    # Check
                    fStyles = get_new_fstyles(e['class_id'])
                    childOffset = fStyles['textIndent']
                    fSize = float(height)
                    fSize *= float(getMetrix(userId, 'layoutsHeight')) / 100

                    charactesLen = len(str(label))
                    newSize = ''
                    if label.islower():
                        textWidth = float((float(fSize) * 0.44128) * float(charactesLen))
                        checker = float(width) / int(charactesLen) / 0.44128
                        newSize = float((float(checker) * 0.44128) * float(charactesLen))
                    elif label.isupper():
                        textWidth = float((float(fSize) * 0.6064) * float(charactesLen))
                        checker = float(width) / int(charactesLen) / 0.6064
                        newSize = float((float(checker) * 0.6064) * float(charactesLen))

                    elif not label.islower() and not label.isupper():
                        textWidth = float((float(fSize) * 0.5289) * float(charactesLen))
                        checker = float(width) / int(charactesLen) / 0.5289
                        newSize = float((float(checker) * 0.5289) * float(charactesLen))

                    if textWidth >= newSize:
                        print('true')
                        fSize = checker

                    fontSize = str(fSize)
                    fontColor = fStyles['fontColor']
                    textAlign = fStyles['textAlign']
                    fontFamily = fStyles['fontFamily']

                    styles = get_new_bstyles(e['class_id'])
                    bgcolor = styles['bgcolor']
                    bordercolor = styles['borderColor']
                    borderRadius = styles['borderRadius']

                    create_text_area(placeholder, label, classid, width, height, positionL, positionT,
                                     childOffset, fontSize, bgcolor, borderRadius, bordercolor, fontFamily, fontColor)

                elif elementType == 'image':

                    icon_path = str(e['root'])
                    print("icon_path"+icon_path)
                    classid = e['class_id'][index:]
                    width = str(float(e['location']['x1']) - float(e['location']['x0']))
                    height = str(float(e['location']['y1']) - float(e['location']['y0']))
                    positionL = str(float(e['location']['x0']))
                    positionT = str(float(e['location']['y0']))
                    link = ''
                    create_image(icon_path, classid, width, height, positionL, positionT, link)

                elif elementType == 'icon':

                    icon_path = str(e['root'])
                    print("icon_path"+icon_path)
                    classid = e['class_id'][index:]
                    width = str(float(e['location']['x1']) - float(e['location']['x0']))
                    height = str(float(e['location']['y1']) - float(e['location']['y0']))
                    positionL = str(float(e['location']['x0']))
                    positionT = str(float(e['location']['y0']))
                    link = ''
                    create_icon(icon_path, classid, width, height, positionL, positionT, link)





        '#CREATING FRAME OR BOXES'
        for f in frameArray:

            classid = str(f['seg_id'][index:])
            width = str(float(f['location']['x1']) - float(f['location']['x0']))
            height = str(float(f['location']['y1']) - float(f['location']['y0']))
            positionL = str(float(f['location']['x0']))
            positionT = str(float(f['location']['y0']))
            print('framecheck')
            print(f)
            '# FRAME STYLE'

            styles = get_bstyles(str(f['seg_id']))

            if folder == '/colorTransfer/':
                for color in colors[1]:
                    if color['classid'] == str(f['seg_id']):
                        bgcolor = color['bgcolor']
                        bordercolor = color['bordercolor']
                        fontColor = color['fontColor']

                borderRadius = styles['borderRadius']
                create_div(classid, width, height, positionL, positionT, borderRadius, bordercolor, bgcolor)

            else:
                fontColor = fStyles['fontColor']
                bgcolor = styles['bgcolor']
                bordercolor = styles['bordercolor']

                borderRadius = styles['borderRadius']
                create_div(classid, width, height, positionL, positionT, borderRadius, bordercolor, bgcolor)

        '#CREATING BUTTON'
        print('Button: ' + str(ButtonArray))
        for button in ButtonArray:

            if len(ButtonArray) > 0:
                if 'parent' in button['level']:
                    if button['level']['parent'] == [] or 'child' in button['level'] or button['level'] == []:
                        print('parent is empty!')
                        label = str(button['name'])
                    else:
                        label = str(button['name'])

                    # Get parent info
                    classid = str(button['seg_id'][index:])
                    width = str(float(button['location']['x1']) - float(
                        button['location']['x0']))
                    height = str(float(button['location']['y1']) - float(
                        button['location']['y0']))
                    positionL = str(float(button['location']['x0']))
                    positionT = str(float(button['location']['y0']))

                    for button2 in ButtonArray:
                        if str(button['level']['parent']) == str(button2['seg_id']):
                            if 'child' in button2['level']:
                                if str(button2['level']['child']) == str(button['seg_id']):
                                    label = str(button2['name'])

                                # Get child info
                                fSize = float(button2['location']['y1']) - float(button2['location']['y0'])
                                fSize *= float(getMetrix(userId, 'layoutsHeight')) / 100
                                charactesLen = len(str(button2['name']))
                                childWidth = str(float(button2['location']['x1']) - float(
                                    button2['location']['x0']))
                                bboxWidth = float(childWidth) * float(getMetrix(userId, 'layoutsWidth')) / 100

                                lNumber = 1

                                # Calculate size
                                if lNumber >= 1:
                                    newSize = ''
                                    if label.islower():
                                        textWidth = float((float(fSize) * 0.44128) * float(charactesLen))
                                        checker = float(bboxWidth) / int(charactesLen) / 0.44128
                                        newSize = float((float(checker) * 0.44128) * float(charactesLen))
                                    elif label.isupper():
                                        textWidth = float((float(fSize) * 0.6064) * float(charactesLen))
                                        checker = float(bboxWidth) / int(charactesLen) / 0.6064
                                        newSize = float((float(checker) * 0.6064) * float(charactesLen))

                                    elif not label.islower() and not label.isupper():
                                        textWidth = float((float(fSize) * 0.5289) * float(charactesLen))
                                        checker = float(bboxWidth) / int(charactesLen) / 0.5289
                                        newSize = float((float(checker) * 0.5289) * float(charactesLen))

                                if textWidth >= newSize:
                                    print('True')
                                    print(newSize)
                                    print(fSize)
                                    fSize = checker

                    fStyles = get_fstyles(str(button['seg_id']))
                    styles = get_bstyles(str(button['seg_id']))

                    fontSize = str(fSize)
                    textAlign = fStyles['textAlign']
                    fontFamily = fStyles['fontFamily']

                    borderRadius = styles['borderRadius']

                    if folder == '/colorTransfer/':
                        for color in colors[1]:
                            if color['classid'] == str(button['seg_id']):
                                bgcolor = color['bgcolor']
                                bordercolor = color['bordercolor']
                                fontColor = color['fontColor']
                    else:
                        fontColor = fStyles['fontColor']
                        bgcolor = styles['bgcolor']
                        bordercolor = styles['bordercolor']

                    link = str(fStyles['link'])

                    create_button(label, classid, width, height, borderRadius, positionL, positionT,
                                  bgcolor, bordercolor, fontColor, str(fontSize), fontFamily, link)

        '#CREATING HYPERLINK'
        print('hyperlink: ' + str(hyperLinkArray))

        for h in hyperLinkArray:
            if len(hyperLinkArray) > 0:

                classid = str(h['seg_id'][index:])  # button['id']
                try:
                    lNumber = getLineNumbers(str(h['seg_id']))
                except:
                    lNumber = 1

                text_string = str(h['name'])
                width = float(float(h['location']['x1']) - float(h['location']['x0']))
                positionL = str(float(h['location']['x0']))
                positionT = str(float(h['location']['y0']))

                fSize = float(h['location']['y1']) - float(h['location']['y0'])
                fSize *= float(getMetrix(userId, 'layoutsHeight')) / 100
                charactesLen = len(str(h['name']))
                childWidth = str(float(h['location']['x1']) - float(
                    h['location']['x0']))
                bboxWidth = float(childWidth) * getMetrix(userId, 'layoutsWidth') / 100
                if lNumber >= 1:
                    newSize = ''
                    if text_string.islower():
                        textWidth = float((float(fSize) * 0.44128) * float(charactesLen))
                        checker = float(bboxWidth) / int(charactesLen) / 0.44128
                        newSize = float((float(checker) * 0.44128) * float(charactesLen))
                    elif text_string.isupper():
                        textWidth = float((float(fSize) * 0.6064) * float(charactesLen))
                        checker = float(bboxWidth) / int(charactesLen) / 0.6064
                        newSize = float((float(checker) * 0.6064) * float(charactesLen))

                    elif not text_string.islower() and not text_string.isupper():
                        textWidth = float((float(fSize) * 0.5289) * float(charactesLen))
                        checker = float(bboxWidth) / int(charactesLen) / 0.5289
                        newSize = float((float(checker) * 0.5289) * float(charactesLen))

                if textWidth >= newSize:
                    print('true')
                    fSize = checker

                fStyles = get_fstyles(str(h['seg_id']))
                fontSize = fSize
                fontColor = fStyles['fontColor']
                textAlign = fStyles['textAlign']
                fontFamily = fStyles['fontFamily']
                link = ''

                if folder == '/colorTransfer/':
                    for color in colors[1]:
                        if color['classid'] == str(h['seg_id']):
                            fontColor = color['fontColor']
                else:
                    fontColor = fStyles['fontColor']

                create_hyperLink(str(classid), str(text_string),
                                 positionL, positionT, str(fontSize),
                                 fontColor, str(width), str(textAlign), fontFamily, link)

        '#CREATING PARAGRAPH'
        print('paragraph: ' + str(paragraphArray))

        for p in paragraphArray:

            if len(paragraphArray) > 0:

                try:
                    lNumber = getLineNumbers(str(p['seg_id']))
                except:
                    lNumber = 1

                classid = str(p['seg_id'][index:])  # button['id']
                width = float(float(p['location']['x1']) - float(p['location']['x0']))
                height = str(float(p['location']['y1']) - float(p['location']['y0']))
                # bboxWidth = float(width) * viewWidth / 100
                positionL = str(float(p['location']['x0']))
                positionT = str(float(p['location']['y0']))

                # text_string = pytz.unicode(str(p['name']), errors='replace')
                text_string = str(p['name'])

                text_string = str(text_string.encode('utf-8', errors='ignore').decode('utf-8'))

                # fSize = float(p['location']['y1']) - float(p['location']['y0'])
                # fSize *= float(getMetrix(userId, 'layoutsHeight')) / 100
                # charactesLen = len(text_string)
                #
                # bboxWidth = float(width) * float(getMetrix(userId, 'layoutsWidth')) / 100
                # if lNumber >= 1:
                #     newSize = ''
                #     if text_string.islower():
                #         textWidth = float((float(fSize) * 0.44128) * float(charactesLen))
                #         checker = float(bboxWidth) / int(charactesLen) / 0.44128
                #         newSize = float((float(checker) * 0.44128) * float(charactesLen))
                #     elif text_string.isupper():
                #         textWidth = float((float(fSize) * 0.6064) * float(charactesLen))
                #         checker = float(bboxWidth) / int(charactesLen) / 0.6064
                #         newSize = float((float(checker) * 0.6064) * float(charactesLen))
                #
                #     elif not text_string.islower() and not text_string.isupper():
                #         textWidth = float((float(fSize) * 0.5289) * float(charactesLen))
                #         checker = float(bboxWidth) / int(charactesLen) / 0.5289
                #         newSize = float((float(checker) * 0.5289) * float(charactesLen))
                #
                # if textWidth >= newSize:
                #     fSize = checker

                fStyles = get_fstyles(str(p['seg_id']))
                fontColor = fStyles['fontColor']
                textAlign = fStyles['textAlign']
                fontFamily = fStyles['fontFamily']
                link = ''

                fSize = fStyles['fontSize']
                screenW = float(getMetrix(userId, 'screenWidth'))
                layoutW = float(getMetrix(userId, 'layoutsWidth'))
                if screenW == 0.0 or layoutW == 0.0:
                    screenW = 627
                    layoutW = 100
                fontSize = float(fSize) / float(
                    screenW / layoutW)

                textAlign = fStyles['textAlign']
                fontFamily = fStyles['fontFamily']

                styles = get_bstyles(str(p['seg_id']))
                borderRadius = styles['borderRadius']

                if folder == '/colorTransfer/':
                    for color in colors[1]:
                        if color['classid'] == str(p['seg_id']):
                            fontColor = color['fontColor']
                else:
                    fontColor = fStyles['fontColor']

                create_paragraph(classid, text_string, positionL, positionT, str(fontSize), fontColor, str(width),
                                 textAlign, height, fontFamily, link)

        '#CREATING TEXTBOX'
        print('textbox: ' + str(textBoxArray))

        for t in textBoxArray:
            print('TextboxArray: ' + str(textBoxArray))
            if len(textBoxArray) > 0:

                if 'parent' in t['level']:
                    if t['level']['parent'] == [] or 'child' in t['level'] or t['level'] == []:
                        print('parent is empty!')
                        name = str(t['name'])
                        placeholder = str(t['name'])
                    else:
                        name = str(t['name'])
                        placeholder = str(t['name'])

                    # Get parent info
                    classid = str(t['seg_id'][index:])
                    width = str(float(t['location']['x1']) - float(
                        t['location']['x0']))
                    height = str(float(t['location']['y1']) - float(
                        t['location']['y0']))
                    positionL = str(float(t['location']['x0']))
                    positionT = str(float(t['location']['y0']))

                    for t2 in textBoxArray:
                        if str(t['level']['parent']) == str(t2['seg_id']):
                            if 'child' in t2['level']:

                                name = str(t2['name'])
                                placeholder = str(t2['name'])
                                fSize = float(t2['location']['y1']) - float(t2['location']['y0'])
                                # fSize *= float(heightScreen)/100
                                fSize *= float(getMetrix(userId, 'screenHeight') / 100)
                                charactesLen = len(str(t2['name']))
                                childWidth = str(float(t2['location']['x1']) - float(
                                    t2['location']['x0']))
                                bboxWidth = float(childWidth) * float(getMetrix(userId, 'screenWidth') / 100)

                                lNumber = 1

                                # Calculate size
                                if lNumber >= 1:
                                    newSize = ''
                                    if placeholder.islower():
                                        textWidth = float((float(fSize) * 0.44128) * float(charactesLen))
                                        checker = float(bboxWidth) / int(charactesLen) / 0.44128
                                        newSize = float((float(checker) * 0.44128) * float(charactesLen))
                                    elif placeholder.isupper():
                                        textWidth = float((float(fSize) * 0.6064) * float(charactesLen))
                                        checker = float(bboxWidth) / int(charactesLen) / 0.6064
                                        newSize = float((float(checker) * 0.6064) * float(charactesLen))

                                    elif not placeholder.islower() and not placeholder.isupper():
                                        textWidth = float((float(fSize) * 0.5289) * float(charactesLen))
                                        checker = float(bboxWidth) / int(charactesLen) / 0.5289
                                        newSize = float((float(checker) * 0.5289) * float(charactesLen))

                                if textWidth >= newSize:
                                    print('true')
                                    fSize = checker

                                if str(t2['level']['child']) == str(t['seg_id']):
                                    name = str(t2['name'])
                                    placeholder = str(t2['name'])
                            else:
                                name = str(t['name'])
                                placeholder = str(t['name'])

                    styles = get_bstyles(str(t['seg_id']))
                    borderRadius = styles['borderRadius']

                    fStyles = get_fstyles(str(t['seg_id']))

                    fontSize = fSize
                    textAlign = fStyles['textAlign']
                    childOffset = 'unset'
                    fontFamily = fStyles['fontFamily']

                    if folder == '/colorTransfer/':
                        for color in colors[1]:
                            if color['classid'] == str(t['seg_id']):
                                bgcolor = color['bgcolor']
                                bordercolor = color['bordercolor']
                                fontColor = color['fontColor']
                    else:
                        fontColor = fStyles['fontColor']
                        bgcolor = styles['bgcolor']
                        bordercolor = styles['bordercolor']

                    '# BUTTON STYLE BG, Border..'
                    if 'style' == 'style':
                        print('we know: ' + str(height))
                        # print('elment: ' + name + ', bgcolor is: ' + bgcolor + ', bordercolor is: ' + bordercolor)
                        create_text_box_placeholder(placeholder, name, width, height, classid, borderRadius, positionL,
                                                    str(positionT), bgcolor, str(childOffset), str(fontSize),
                                                    fontFamily,
                                                    str(fontColor), str(textAlign), str(bordercolor))

        '#CREATING TEXTAREA'
        print('textbox: ' + str(textAreaArray))

        for t in textAreaArray:
            print('TextboxArray: ' + str(textAreaArray))
            if len(textAreaArray) > 0:

                if 'parent' in t['level']:
                    if t['level']['parent'] == [] or 'child' in t['level'] or t['level'] == []:
                        print('parent is empty!')
                        name = str(t['name'])
                        placeholder = str(t['name'])
                    else:
                        name = str(t['name'])
                        placeholder = str(t['name'])

                    # Get parent info
                    classid = str(t['seg_id'][index:])
                    width = str(float(t['location']['x1']) - float(
                        t['location']['x0']))
                    height = str(float(t['location']['y1']) - float(
                        t['location']['y0']))
                    positionL = str(float(t['location']['x0']))
                    positionT = str(float(t['location']['y0']))

                    for t2 in textAreaArray:
                        if str(t['level']['parent']) == str(t2['seg_id']):
                            if 'child' in t2['level']:

                                name = str(t2['name'])
                                placeholder = str(t2['name'])
                                fSize = float(t2['location']['y1']) - float(t2['location']['y0'])
                                # fSize *= float(heightScreen)/100
                                fSize *= float(getMetrix(userId, 'screenHeight') / 100)
                                charactesLen = len(str(t2['name']))
                                childWidth = str(float(t2['location']['x1']) - float(
                                    t2['location']['x0']))
                                bboxWidth = float(childWidth) * float(getMetrix(userId, 'screenWidth') / 100)

                                lNumber = 1

                                # Calculate size
                                if lNumber >= 1:
                                    newSize = ''
                                    if placeholder.islower():
                                        textWidth = float((float(fSize) * 0.44128) * float(charactesLen))
                                        checker = float(bboxWidth) / int(charactesLen) / 0.44128
                                        newSize = float((float(checker) * 0.44128) * float(charactesLen))
                                    elif placeholder.isupper():
                                        textWidth = float((float(fSize) * 0.6064) * float(charactesLen))
                                        checker = float(bboxWidth) / int(charactesLen) / 0.6064
                                        newSize = float((float(checker) * 0.6064) * float(charactesLen))

                                    elif not placeholder.islower() and not placeholder.isupper():
                                        textWidth = float((float(fSize) * 0.5289) * float(charactesLen))
                                        checker = float(bboxWidth) / int(charactesLen) / 0.5289
                                        newSize = float((float(checker) * 0.5289) * float(charactesLen))

                                ''''###### to be confirmed #####'''
                                if textWidth >= newSize:
                                    print('true')
                                    fSize = checker
                                if str(t2['level']['child']) == str(t['seg_id']):
                                    name = str(t2['name'])
                                    placeholder = str(t2['name'])
                            else:
                                name = str(t['name'])
                                placeholder = str(t['name'])

                    styles = get_bstyles(str(t['seg_id']))
                    borderRadius = styles['borderRadius']

                    fStyles = get_fstyles(str(t['seg_id']))

                    fontSize = fSize
                    textAlign = fStyles['textAlign']
                    childOffset = fStyles['textIndent']
                    fontFamily = fStyles['fontFamily']

                    if folder == '/colorTransfer/':
                        for color in colors[1]:
                            if color['classid'] == str(t['seg_id']):
                                bgcolor = color['bgcolor']
                                bordercolor = color['bordercolor']
                                fontColor = color['fontColor']
                    else:
                        fontColor = fStyles['fontColor']
                        bgcolor = styles['bgcolor']
                        bordercolor = styles['bordercolor']

                    '# BUTTON STYLE BG, Border..'
                    if 'style' == 'style':
                        create_text_area(placeholder, name, classid, width, height, positionL, str(positionT),
                                         str(childOffset), str(fontSize), bgcolor, borderRadius, bordercolor,
                                         fontFamily, fontColor)

        '#CREATING LOGO'
        print('logo: ' + str(logoArray))
        for l in logoArray:

            path = ''
            collection = db['segmentation']
            cursor = collection.find({})
            for document in cursor:
                if str(document['_id']) == str(l['seg_id']):
                    path = document['elementRoot']

            if folder == '/colorTransfer/':
                croppedFileName = str(myFile[int(len(str(currentUser))) + 7:-4])
                print('test croppedfilename: ')
                print(path)
                print(croppedFileName)
                imgName = path.split('/')
                icon_path = 'media/' + currentUser + '/' + croppedFileName + '/' + imgName[
                    len(imgName) - 1]
                print(icon_path)
            else:
                icon_path = path
            classid = l['seg_id'][index:]
            width = str(
                float(l['location']['x1']) - float(l['location']['x0']))
            height = str(
                float(l['location']['y1']) - float(l['location']['y0']))
            positionL = str(float(l['location']['x0']))
            positionT = str(float(l['location']['y0']))

            link = ''
            create_image(icon_path, classid, width, height, positionL, positionT, link)

        '#CREATING ICONS'
        print('logo: ' + str(iconArray))
        for l in iconArray:

            path = ''
            collection = db['segmentation']
            cursor = collection.find({})
            for document in cursor:
                if str(document['_id']) == str(l['seg_id']):
                    path = document['elementRoot']

            if folder == '/colorTransfer/':
                croppedFileName = str(myFile[int(len(str(currentUser))) + 7:-4])
                print('test croppedfilename: ')
                print(path)
                print(croppedFileName)
                imgName = path.split('/')
                icon_path = 'media/' + currentUser + '/' + croppedFileName + '/' + imgName[
                    len(imgName) - 1]
                print(icon_path)
            else:
                icon_path = path
            classid = l['seg_id'][index:]
            width = str(
                float(l['location']['x1']) - float(l['location']['x0']))
            height = str(
                float(l['location']['y1']) - float(l['location']['y0']))
            positionL = str(float(l['location']['x0']))
            positionT = str(float(l['location']['y0']))

            link = ''
            create_image(icon_path, classid, width, height, positionL, positionT, link)

        '#CREATING Picture'
        print('logo: ' + str(pictureArray))
        for l in pictureArray:

            path = ''
            collection = db['segmentation']
            cursor = collection.find({})
            for document in cursor:
                if str(document['_id']) == str(l['seg_id']):
                    path = document['elementRoot']

            if folder == '/colorTransfer/':
                croppedFileName = str(myFile[int(len(str(currentUser))) + 7:-4])
                print('test croppedfilename: ')
                print(path)
                print(croppedFileName)
                imgName = path.split('/')
                icon_path = 'media/' + currentUser + '/' + croppedFileName + '/' + imgName[
                    len(imgName) - 1]
                print(icon_path)
            else:
                icon_path = path
            classid = l['seg_id'][index:]
            width = str(
                float(l['location']['x1']) - float(l['location']['x0']))
            height = str(
                float(l['location']['y1']) - float(l['location']['y0']))
            positionL = str(float(l['location']['x0']))
            positionT = str(float(l['location']['y0']))

            link = ''
            create_image(icon_path, classid, width, height, positionL, positionT, link)

        '#CREATING widgets'
        print('widget: ' + str(widgetArray))
        for l in widgetArray:

            path = ''
            collection = db['segmentation']
            cursor = collection.find({})
            for document in cursor:
                if str(document['_id']) == str(l['seg_id']):
                    path = document['elementRoot']

            if folder == '/colorTransfer/':
                croppedFileName = str(myFile[int(len(str(currentUser))) + 7:-4])
                print('test croppedfilename: ')
                print(path)
                print(croppedFileName)
                imgName = path.split('/')
                icon_path = 'media/' + currentUser + '/' + croppedFileName + '/' + imgName[
                    len(imgName) - 1]
                print(icon_path)
            else:
                icon_path = path
            classid = l['seg_id'][index:]
            width = str(
                float(l['location']['x1']) - float(l['location']['x0']))
            height = str(
                float(l['location']['y1']) - float(l['location']['y0']))
            positionL = str(float(l['location']['x0']))
            positionT = str(float(l['location']['y0']))

            link = ''
            create_googleMap(icon_path, classid, width, height, positionL, positionT, link)

        '#setting background color'

        if 1 == 1:
            collection = db.backgrounds.find({'screenshot_id': screenshot_id})
            for document in collection:
                pagecss.write('.' + 'colorTransfer' + '{background:' + str(
                    document['background']) + '; height: inherit; }\n')

        close_page_html_end()
        close_page_css()

    '############################################          END             ##########################################'
    print('END META')


# def metaLayouts(currentUser, myFile, screenshot_id, folder, index, state):
#     print('BEGGINING META-LAYOUTS')
#
#     ButtonArray = get_collection(db.buttons, screenshot_id)
#     textBoxArray = get_collection(db.textBoxes, screenshot_id)
#     textAreaArray = get_collection(db.textArea, screenshot_id)
#     hyperLinkArray = get_collection(db.hyperLinks, screenshot_id)
#     paragraphArray = get_collection(db.paragraphs, screenshot_id)
#     frameArray = get_collection(db.frames, screenshot_id)
#     logoArray = get_collection(db.logo, screenshot_id)
#     iconArray = get_collection(db.icon, screenshot_id)
#     pictureArray = get_collection(db.pictures, screenshot_id)
#     newElementsArray = get_collection(db.newElements, screenshot_id)
#
#     prediction_layouts_cursor = db.layoutsTemplates.find({'screenshot_id': str(screenshot_id)})
#     document = prediction_layouts_cursor[index - 1]
#
#     '#####################################   DEF of META ALGO  #####################################################'
#
#     '# CREATION OF HTML AND CSS PAGE'
#     '# FUNCTION TO OPEN, CREATE, SAVE AND CLOSE FILES'
#     if 6 == 6:
#
#         def create_page_Html_and_Css_and_js(path, titleHtml, titleCssJS):
#
#             croppedFileName = str(myFile[int(len(str(currentUser))) + 7:-4])
#             import os
#             if (folder == '/layouts/'):
#                 try:
#                     os.stat('static/users/' + str(currentUser) + '/pages/' + croppedFileName + folder)
#
#                 except:
#                     os.mkdir('static/users/' + str(currentUser) + '/pages/' + croppedFileName + folder)
#                 pagehtml = open(
#                     'static/users/' + str(currentUser) + '/pages/' + croppedFileName + folder + titleHtml + '.html',
#                     mode='w', encoding='UTF-8')
#                 pagehtml.write('<section class="classContainer">')
#
#                 try:
#                     os.stat('static/users/' + str(currentUser) + '/pages/' + croppedFileName + folder + 'css/')
#                 except:
#                     os.mkdir('static/users/' + str(currentUser) + '/pages/' + croppedFileName + folder + 'css/')
#                 pagecss = open(
#                     'static/users/' + str(
#                         currentUser) + '/pages/' + croppedFileName + folder + 'css/' + titleCssJS + '.css',
#                     'w')  # root css page
#             else:
#                 try:
#                     os.stat('static/users/' + str(currentUser) + '/pages/' + croppedFileName + '/')
#
#                 except:
#                     os.mkdir('static/users/' + str(currentUser) + '/pages/' + croppedFileName + '/')
#                 pagehtml = open(
#                     'static/users/' + str(currentUser) + '/pages/' + croppedFileName + '/' + titleHtml + '.html',
#                     mode='w', encoding='UTF-8')
#                 pagehtml.write('<section class="classContainer">')
#
#                 try:
#                     os.stat('static/users/' + str(currentUser) + '/pages/' + croppedFileName + '/' + 'css/')
#                 except:
#                     os.mkdir('static/users/' + str(currentUser) + '/pages/' + croppedFileName + '/' + 'css/')
#                 pagecss = open(
#                     'static/users/' + str(
#                         currentUser) + '/pages/' + croppedFileName + '/' + 'css/' + titleCssJS + '.css',
#                     'w')  # root css page
#             ###
#
#             # try:
#             #     os.stat('./templates/js')
#             # except:
#             #     os.mkdir('./templates/js')
#             # pagejs = open('./templates/js/' + 'test' + '.js', 'w')
#             #
#             # pagejs.write('interact(".resize-drag").draggable({" \
#             #                                             "onmove: window.dragMoveListener}).resizable({" \
#             #                                             "preserveAspectRatio: true," \
#             #                                             "edges: { left: true, right: true, bottom: true, top: true }})" \
#             #                                             ".on("resizemove", function (event) {" \
#             #                                                             "var target = event.target, x = (" \
#             #                                                             "parseFloat(target.getAttribute(" \
#             #                                                             ""data-x")) || 0), y = (parseFloat(target.getAttribute(" \
#             #                                                                     ""data-y")) || 0); target.style.width  = event.rect.width + "px"; target.style.height = event.rect.height + "px"; x += event.deltaRect.left; y += event.deltaRect.top; target.style.webkitTransform = target.style.transform = "translate(" + x + "px," + y + "px)"; target.setAttribute("data-x", x); target.setAttribute("data-y", y);});')
#             # pagejs.write(
#             #     'interact(".draggable").draggable({ inertia: true, autoScroll: true, onmove: dragMoveListener, onend: function (event) { var textEl = event.target.querySelector("p"); textEl && (textEl.textContent = "moved a distance of "+ (Math.sqrt(event.dx* event.dx + event.dy*  event.dy)|0) + "px");}}); function dragMoveListener (event) { var target = event.target, x = (parseFloat(target.getAttribute("data-x")) || 0) + event.dx, y = (parseFloat(target.getAttribute("data-y")) || 0) + event.dy; target.style.webkitTransform = target.style.transform = "translate(" + x + "px, " + y + "px)"; target.setAttribute("data-x", x); target.setAttribute("data-y", y);}')
#             # ###
#             return pagehtml, pagecss
#
#         def close_page_html_and_css_end():
#             pagehtml.write('</body>')
#             pagehtml.close()
#             pagecss.close()
#
#         def close_page_html_end():
#             pagehtml.write('</section>')
#             pagehtml.close()
#
#         def close_page_html():
#             pagehtml.close()
#
#         def close_page_css():
#             pagecss.close()
#
#             # BASIC ELEMENTS FOR DEMO
#
#             # CREATION OF BUTTON AND TEXTBOX
#
#         def create_button(label, classid, width, height, borderRadius, positionL, positionT, bgcolor, borderColor,
#                           fontColor, fontSize, fontFamily, link):
#
#             pagehtml.write(
#                 '<button type="button" class="class' + classid + '" id="id' + classid + '">' + label + '</button>\n')
#             pagecss.write(
#                 '.class' + classid + '{height:' + height + '%; width:' + width + '%; border-radius: ' + borderRadius + 'px;\
#                         border: 1px solid ' + borderColor + '; background-color: ' + bgcolor + '; font-size: ' + fontSize + 'px; color: ' + fontColor + ';\
#                         position:absolute; left:' + positionL + '%; top:' + positionT + '%; \
#                         font-family: ' + fontFamily + ';}' + ' ' + '#id' + classid + '{}\n')
#
#         def create_Button_label_icon_inside(label, classid_b, width_b, height_b, positionL_b, positionT_b, \
#                                             src_icon, classid_i, width_i, height_i, positionL_i, positionT_i):
#             pagehtml.write('<button type="button" class="class' + classid_b + '" id="id' + classid_b + '">\n\
#                     <img src="' + src_icon + '" class="class' + classid_i + '" id="id' + classid_i + '">' + label + '\n\
#                     </button>\n')
#             pagecss.write(
#                 '.class' + classid_b + '{height:' + height_b + '%; width:' + width_b + '%; position:absolute; left:' + positionL_b + '%;top:' + positionT_b + '%}' + ' ' + '#id' + classid_b + '{}\n\
#                                  .class' + classid_i + '{height:' + height_i + '%; width:' + width_i + '%; position:absolute; left:' + positionL_i + '%;top:' + positionT_i + '%} #id' + classid_i + '{}\n')
#
#         def create_Button_icon_inside(classid_b, width_b, height_b, positionL_b, positionT_b, \
#                                       src_icon, classid_i, width_i, height_i, positionL_i, positionT_i):
#             pagehtml.write(
#                 '<button type="button" class="draggable resize-drag class' + classid_b + '" id="id' + classid_b + '">\n\
#                     <img src="' + src_icon + '" class="class' + classid_i + '" id="id' + classid_i + '">' + label + '\n\
#                     </button>\n')
#             pagecss.write(
#                 '.class' + classid_b + '{height:' + height_b + '%; width:' + width_b + '%;position:absolute; left:' + positionL_b + '%;top:' + positionT_b + '%}' + ' ' + '#id' + classid_b + '{}\n\
#                                  .class' + classid_i + '{height:' + height_i + '%; width:' + width_i + '%;position:absolute; left:' + positionL_i + '%;top:' + positionT_i + '%} #id' + classid_i + '{}\n')
#
#         def create_text_box_placeholder(placeholder, name, width, height, classid, borderRadius, positionL, positionT,
#                                         bgcolor, childOffset, fontSize, fontFamily, fontColor, textAlign, bordercolor):
#             pagehtml.write(
#                 '<input type="text" name="' + name + '" class="class' + classid + '" id="id' + classid + '" \n\
#                         placeholder="' + placeholder + '"></input>\n')
#             pagecss.write(
#                 '.class' + classid + '{height:' + height + '%;  text-indent: ' + childOffset + 'px; width:' + width + '%; border-radius: ' + borderRadius + 'px;\n\
#                         border: 0px; position:absolute; left:' + positionL + '%; top:' + positionT + '%; font-size: ' + fontSize + 'px; color: ' + fontColor + ';text-align:' + textAlign + ';background-color: ' + bgcolor + '\
#                         font-family: ' + str(fontFamily) + '; border-color:' + str(
#                     bordercolor) + '; }' + ' ' + '#id' + str(classid) + '{}\n')
#
#         def create_text_box_placeholder_legend(legend, placeholder, name, classid, width, height, borderRadius,
#                                                positionL,
#                                                positionT, bgcolor):
#             pagehtml.write(
#                 legend + ' : <input type="text" name="' + name + '" class="draggable resize-drag class' + classid + '" id="id' + classid + '" \
#                         placeholder="' + placeholder + '"></input>\n')
#             pagecss.write(
#                 '.class' + classid + '{height:' + height + '%; width:' + width + '%; border-radius: ' + borderRadius + 'px;\
#                          border: 0px; position:absolute; left:' + positionL + '%; top:' + positionT + '%; \
#                          background-color: ' + bgcolor + '}' + ' ' + '#id' + classid + '{}\n')
#
#         def create_text_box_legend(legend, classidf, positionLf, positionTf, fontSize, classidtb, width, height,
#                                    borderRadius, positionL, positionT, bgcolor, childOffset, borderColor):
#             pagehtml.write(
#                 '<p drag-resize class="class' + classidf + '" id="id' + classidf + '" style="margin:0">' + legend + '</p>\n\
#                         <input drag-resize type="text" name="bla" class="class' + classidtb + '" id="id' + classidtb + '"></input>\n')
#             pagecss.write(
#                 '.class' + classidf + '{position: absolute; left:' + positionLf + '%; top:' + positionTf + '%; font-size: ' + fontSize + '%;} #id' + classidf + '{} \n\
#                         .class' + classidtb + '{height:' + height + '%; text-indent: ' + childOffset + 'px; width:' + width + '%;position:absolute; border-radius: ' + borderRadius + 'px; border: 1px solid ' + borderColor + '; \
#                         left:' + positionL + '%; top:' + positionT + '%; background-color: ' + bgcolor + '}' + ' ' + '#id' + classidtb + '{}\n')
#
#         def create_text_area(place_holder, name, classid, width, height, positionL, positionT, childOffset, fontSize,
#                              bgcolor, borderRadius, borderColor, fontFamily):
#             pagehtml.write(
#                 '<textarea name="' + name + '" class="class' + classid + '" id="id' + classid + '" placeholder="' + place_holder + '"></textarea>\n')
#             pagecss.write(
#                 '.class' + classid + '{resize: none; height:' + height + '%; text-indent: ' + childOffset + 'px ; width:' + width + '%;position:absolute; left:' + positionL + '%; \
#                 border-radius: ' + borderRadius + 'px; border: 1px solid ' + borderColor + '; top:' + positionT + '%; \
#                 font-size: ' + fontSize + 'px; font-family: ' + fontFamily + '; background-color: ' + bgcolor + '}' + ' ' + '#id' + classid + '{}\n')
#
#             # CREATION OF IMAGE
#
#         def create_image(icon_path, classid, width, height, positionL, positionT, link):
#
#             pagehtml.write(
#                 '<img src="/' + icon_path + '" class="class' + classid + '" id="id' + classid + '"/>\n')
#             pagecss.write(
#                 '.class' + classid + '{height:' + height + '%; width:' + width + '%;position:absolute; left:' + positionL + '%; top:' + positionT + '%}' + ' ' + '#id' + classid + '{}\n')
#
#         def create_image_active(location, icon_path, classid, width, height, positionL, positionT):
#             pagehtml.write(
#                 '<img src="' + icon_path + '" onClick="' + location + '" class="draggable resize-drag class' + classid + '" id="id' + classid + '"/>\n')
#             pagecss.write(
#                 '.class' + classid + '{height:' + height + '%; width:' + width + '%;position:absolute; left:' + positionL + '%; top:' + positionT + '%}' + ' ' + '#id' + classid + '{}\n')
#
#             # CREATION OF PARAGRAPH AND TITLE
#
#         def create_paragraph(classid, text_string, positionL, positionT, fontSize, fontColor, width, textAlign, height,
#                              fontFamily, link):
#
#             pagehtml.write(
#                 '<p  class="class' + classid + '" id="id' + classid + '">' + text_string + '</p>\n')
#             pagecss.write(
#                 '.class' + classid + '{position:absolute; text-align: ' + textAlign + '; left:' + positionL + '%; top:' + positionT + '%;\
#                                      width:' + width + '%; height: ' + height + '%; margin : 0px; font-size: ' + fontSize + 'px; \
#                                      color: ' + fontColor + '; font-family: ' + fontFamily + ';}' + ' ' + '#id' + classid + '{}\n')
#
#         def create_selection(classid, text_string, positionL, positionT, fontSize, fontColor, width, textAlign):
#             pagehtml.write(
#                 '<select drag-resize class="class' + classid + '" id="id' + classid + '"> \n <option value="' + text_string + '">' + text_string + '</option>\n </select>\n')
#             pagecss.write(
#                 '.class' + classid + '{position:absolute; text-align: ' + textAlign + '; left:' + positionL + '%; top:' + positionT + '%;\
#                           width:' + width + '%; margin : 0px; font-size: ' + fontSize + 'px;color: ' + fontColor + '}' + ' ' + '#id' + classid + '{}\n')
#
#         def create_hyperLink(classid, text_string, positionL, positionT, fontSize, fontColor, width, textAlign,
#                              fontFamily, link):
#
#             pagehtml.write('<a class=" class' + classid + '" id="id' + classid + '">\n\
#                             ' + text_string + '</a>\n')
#             pagecss.write(
#                 '.class' + str(
#                     classid) + '{position:absolute; text-align: ' + textAlign + '; left:' + positionL + '%; width:' + width + '%; top:' + positionT + '%;\
#                                          margin: 0px; font-size: ' + fontSize + 'px;color: ' + fontColor + '; \
#                                          font-family: ' + fontFamily + ';}' + ' ' + '#id' + str(classid) + '{} \
#                                         .class' + str(classid) + ' > a{ color : inherit} \n \
#                                         .class' + str(classid) + ':hover {color: ' + fontColor + '}')
#
#         def create_title(h_type, classid, text_string, positionL, positionT):
#             pagehtml.write(
#                 '<' + h_type + ' class="draggable resize-drag' + classid + '" id="id' + classid + '">' + text_string + '</' + h_type + '>\n')
#             pagecss.write(
#                 '.class' + classid + '{position:absolute; left:' + positionL + '%; top:' + positionT + '%}' + ' ' + '#id' + classid + '{}\n')
#
#         def create_section(classid, width, height, positionL, positionT, backgroundImage, backgroundColor, color):
#             pagehtml.write(
#                 '<section class="draggable resize-drag class' + classid + '" id="id' + classid + '"></section>\n')
#             pagecss.write(
#                 '.class' + classid + '{position:absolute; left: ' + positionL + '%; top: ' + positionT + '%;\
#                         width:' + width + '%; height:' + height + '%;background-color:' + backgroundColor + ';\
#                         background-image:url("' + backgroundImage + '"); color:' + color + '}' + ' ' + '#id' + classid + '{}\n')
#
#         def create_open_section(classid, width, height, positionL, positionT, backgroundImage, backgroundColor, color):
#             pagehtml.write('<section class="draggable resize-drag class' + classid + '" id="id' + classid + '">\n')
#             pagecss.write(
#                 '.class' + classid + '{position:absolute;left:' + positionL + '%;top:' + positionT + '%;\
#                         width:' + width + '%; height:' + height + '%;background-color:' + backgroundColor + ';\
#                         background-image:url("' + backgroundImage + '"); color:' + color + '}' + ' ' + '#id' + classid + '{}\n')
#
#         def create_close_section():
#             pagehtml.write('</section>\n')
#
#         def create_div(classid, width, height, positionL, positionT, borderRadius, borderColor, bgcolor):
#             pagehtml.write('<div class="class' + classid + '" id="id' + classid + '"></div>\n')
#             pagecss.write('.class' + classid + '{position: absolute; left: ' + positionL + '%;\
#                     top: ' + positionT + '%; width: ' + width + '%; height: ' + height + '%; \
#                     background-color:' + bgcolor + '; border: 1px solid ' + borderColor + '; border-radius: ' + borderRadius + 'px}' + ' ' + '#id' + classid + '{}\n '+
#                     '#id' + str(classid) + ':hover{'
#                     + 'border-width: 1px;border-style: dashed;'
#                     + 'border-color: rgba(24, 166, 137, 1);}')
#
#         def create_open_div(classid):
#             pagehtml.write('<div class="draggable resize-drag class' + classid + '" id="id' + classid + '">\n')
#             pagecss.write('.class' + classid + '{}' + ' ' + '#id' + classid + '{}\n')
#
#         def create_close_div():
#             pagehtml.write('</div>\n')
#
#         def write_into_display_div():
#             div = "container-inside-frame"
#             pagehtml = open('./templates/testing.html', 'r')
#             html = pagehtml.read()
#             pagehtml.close()
#             livre = open('../templates/customize/page2.html', 'r')
#             lire = livre.read()
#             index = 0
#             c = 0
#             while c < len(lire):
#                 if lire[c:c + 22] == div:
#                     c2 = c + 22
#                     while c2 < len(lire):
#                         if lire[c2] == ">":
#                             index = c2
#                             ecrire = lire[0:index + 1] + html + lire[index + 1:]
#                             pagehtml = open('../templates/customize/page2.html', 'w')
#                             pagehtml.write(ecrire)
#                             c2 = len(lire) + 1
#                         c2 = c2 + 1
#                 c = c + 1
#
#             return pagehtml
#
#             # CREATION OF HEADER MENU WITH WHATEVER NUMBER OF HEADINGS
#
#         def create_menu_text(headingsString, side, color, backgroundColor, width, height, positionL, positionT):
#             def sentence_to_wordlist(raw):
#                 clean = re.sub("[^a-zA-Z0-9]", " ", raw)
#                 words = clean.split()
#                 return words
#
#             headings = []
#             headings = sentence_to_wordlist(headingsString)
#             pagehtml.write('<header><ul class="ul_menutop">\n')
#             for heading in headings:
#                 pagehtml.write(
#                     '<li class="li_menutop"><a class="a_menutop" href="#' + heading + '">' + heading + '</a></li>\n')
#             pagehtml.write('</ul></header>\n')
#             pagecss.write('.ul_menutop{list-style-type: none;\
#                     margin: 0;\
#                     padding: 0;\
#                     overflow: hidden;}\
#                     .li_menutop{float:' + side + '}\
#                     .li_menutop a {display: inline-block;\
#                     color: ' + color + ';\
#                     text-align: center;\
#                     padding: 14px 16px;\
#                     text-decoration: none;}\
#                     header{background-color:' + backgroundColor + ';position:absolute; width:' + width + '%;\
#                     height:' + height + '%;left:' + positionL + '%;top:' + positionT + '%;}\n')
#
#             # CREATE FORM WITH WHATEVER NUMBER OF BUTTON AND TEXTBOX
#
#         def create_form(nbrTxtB, nbrButton, strTxtB, strButton, actionpage, method_, classfidf):
#             def create_button_form(value, width, height, classid, positionL, positionT):
#                 pagehtml.write(
#                     '<input type="submit" value="' + value + '" class="draggable resize-drag class' + classid + '" id="id' + classid + '"></input>\n')
#                 pagecss.write(
#                     '.class' + classid + '{height:' + height + '%; width:' + width + '%;position:absolute;\
#                              left:' + positionL + '%; top:' + positionT + '%;}' + ' ' + '#id' + classid + '{}\n')
#
#             def create_text_box_placeholder_form(placeholder, name, width, height, classid, positionL, positionT):
#                 pagehtml.write(
#                     '<input type="text" name="' + name + '" class="draggable resize-drag class' + classid + '" id="id' + classid + '" placeholder="' + placeholder + '"></input>\n')
#                 pagecss.write(
#                     '.class' + classid + '{height:' + height + '%; width:' + width + '%;position:absolute;\
#                              left:' + positionL + '%; top:' + positionT + '%;}' + ' ' + '#id' + classid + '{}\n')
#
#             '''
#             def sentence_to_wordlist(raw):
#                 clean = re.sub("[^a-zA-Z0-9]", " ", raw)
#                 words = clean.split()
#                 return words
#
#             txtBInfo = sentence_to_wordlist(strTxtB)
#             BInfo = sentence_to_wordlist(strButton)
#             txtb = 0
#             txtB = []
#             txtBInfoIndex = 0
#             while txtb < int(nbrTxtB):
#                 placeholder = txtBInfo[txtBInfoIndex + 0]
#                 name = txtBInfo[txtBInfoIndex + 1]
#                 width = txtBInfo[txtBInfoIndex + 2]
#                 height = txtBInfo[txtBInfoIndex + 3]
#                 classidtb = txtBInfo[txtBInfoIndex + 4]
#                 positionL = txtBInfo[txtBInfoIndex + 5]
#                 positionT = txtBInfo[txtBInfoIndex + 6]
#                 txtBInfoIndex = txtBInfoIndex + 7
#                 TextBox = [placeholder, name, width, height, classidtb, positionL,
#                            positionT]  # before was class and id check
#                 txtB.append(TextBox)
#                 txtb = txtb + 1
#             b = 0
#             B = []
#             BInfoIndex = 0
#             while b < int(nbrButton):
#                 value = BInfo[BInfoIndex + 0]
#                 width = BInfo[BInfoIndex + 1]
#                 height = BInfo[BInfoIndex + 2]
#                 classidb = BInfo[BInfoIndex + 3]
#                 positionL = BInfo[BInfoIndex + 4]
#                 positionT = BInfo[BInfoIndex + 5]
#                 BInfoIndex = BInfoIndex + 6
#                 Button = [value, width, height, classidb, positionL, positionT]  # before was class and id check
#                 B.append(Button)
#                 b = b + 1
#
#             pagehtml.write('<form action="/' + actionpage + '" method="' + method_ + '">')
#             pagecss.write('.' + classfidf + '{} #' + classfidf + '{}')
#             for txtbox in txtB:
#                 print('this is the size of txtbox: ' + str(txtbox[2]))
#                 if str(txtbox[2]) >= '70':
#                     create_text_area(txtbox[0], txtbox[1], txtbox[4], txtbox[2], txtbox[3], txtbox[5], txtbox[6])
#                 else:
#                     create_text_box_placeholder_form(txtbox[0], txtbox[1], txtbox[2], txtbox[3], txtbox[4], txtbox[5],
#                                                      txtbox[6])
#             for button in B:
#                 create_button_form(button[0], button[1], button[2], button[3], button[4], button[5])
#             pagehtml.write('</form>')
#             '''
#             # STYLE
#
#         def set_background_image(class_, img):
#             if (class_ == 'body') | (class_ == 'div') | (class_ == 'section') | (class_ == 'p') | (class_ == 'span') | (
#                     class_ == 'em') | (class_ == 'footer'):
#                 pagecss.write(class_ + '{background-image: url(./' + img + ');background-size:cover;}\n')
#             else:
#                 pagecss.write('.' + class_ + '{background-image: url(./' + img + ');background-size:cover;}\n')
#
#         def set_background_color(class_, color):
#             if (class_ == 'body') | (class_ == 'div') | (class_ == 'section') | (class_ == 'p') | (class_ == 'span') \
#                     | (class_ == 'em') | (class_ == 'footer'):
#                 pagecss.write(class_ + '{ background-color:' + color + ';height: inherit;}\n')
#             else:
#                 pagecss.write('.' + class_ + '{background-color:' + color + '; height: inherit;}\n')
#
#         def colorBoW(croppedOcr):
#             '#JVTWN'
#             fontColor = "UNKNOWN"
#             outside2 = []
#             outside3 = []
#             outside4 = []
#             inside2 = []
#             inside3 = []
#             inside4 = []
#             '#ILBNDY'
#             r0 = io.imread(croppedOcr)
#             r = color.rgb2gray(io.imread(croppedOcr))
#             '#UC'
#             contours = measure.find_contours(r, 0.8)
#             for n, contour in enumerate(contours):
#                 if n == 0:
#                     a = 0
#                     b = 0
#                     c = 0
#                     while c < len(contour[:, 1]):
#                         string = str(contour[:, 1][c])
#                         if string[len(string) - 2:] != ".0":
#                             c = c + 1
#                         else:
#                             a = contour[:, 1][c]
#                             c = len(contour[:, 1]) + 1
#                     c1 = 0
#                     while c1 < len(contour[:, 0]):
#                         string = str(contour[:, 0][c1])
#                         if string[len(string) - 2:] != ".0":
#                             c1 = c1 + 1
#                         else:
#                             b = contour[:, 0][c1]
#                             c1 = len(contour[:, 0]) + 1
#                     try:
#                         outside2 = r0[int(b) + 2, int(a)]
#                         outside3 = r0[int(b) + 2, int(a) - 1]
#                         outside4 = r0[int(b) + 2, int(a) + 1]
#                         print('1', outside4[0])
#                         print('2', outside4[1])
#                         print('3', outside4[2])
#                         inside2 = r0[int(b) - 2, int(a)]
#                         inside3 = r0[int(b) - 3, int(a)]
#                         inside4 = r0[int(b) - 4, int(a)]
#
#                         '#DFC'
#                         if ((outside2[0] >= 200) | (outside2[1] >= 200) | (outside2[2] >= 200)) \
#                                 & ((outside3[0] >= 200) | (outside3[1] >= 200) | (outside3[2] >= 200)) \
#                                 & ((outside4[0] >= 200) | (outside4[1] >= 200) | (outside4[2] >= 200)):
#                             fontColor = "black"
#                         else:
#                             fontColor = "white"
#                     except:
#                         print('==========================contour=========================================')
#                         print(croppedOcr)
#
#             if fontColor == "UNKNOWN":
#                 fontColor = "white"
#                 print('fail', croppedOcr)
#
#             return fontColor
#
#     def insideFrame(screenshotId, element):
#
#         inside = False
#         x0_element = float(element['location']['x0'])
#         x1_element = float(element['location']['x1'])
#         y0_element = float(element['location']['y0'])
#         y1_element = float(element['location']['y1'])
#
#         cursor_frame = db.frames.find({'screenshot_id': str(screenshotId)})
#
#         for document in cursor_frame:
#             if x0_element >= float(document['location']['x0']) and x1_element <= float(document['location']['x1']):
#                 if y0_element >= float(document['location']['y0']) and y1_element <= float(document['location']['y1']):
#                     inside = True
#
#         return inside
#
#     def space_element(elementId):
#         elements = list(document['layouts_template'])
#         space_x = 0
#         space_y = 0
#
#         x = float(list(document['layouts_template'][str(elementId)])[0])
#         y = float(list(document['layouts_template'][str(elementId)])[1])
#
#         print('YYYYYY ' + str(elements))
#
#         for e1 in elements:
#             if str(e1) != str(elementId):
#                 x0_1 = float(list(document['layouts_template'][str(e1)])[0])
#                 y0_1 = float(list(document['layouts_template'][str(e1)])[1])
#                 space_x_re = abs(x - x0_1)
#                 space_y_re = abs(y - y0_1)
#                 if space_x_re > space_x:
#                     space_x = space_x_re
#                 if space_y_re > space_y:
#                     space_y = space_y_re
#
#         return abs(space_x - space_y)
#
#     def validationLayaout(screenshotId):
#
#         elements = list(document['layouts_template'])
#         issues_element = []
#
#         print('YYYYYY ' + str(elements))
#
#         for e1 in elements:
#             x0_1 = list(document['layouts_template'][str(e1)])[0]
#             y0_1 = list(document['layouts_template'][str(e1)])[1]
#             for e2 in elements:
#                 if e2 != e1:
#                     x0_2 = list(document['layouts_template'][str(e2)])[0]
#                     y0_2 = list(document['layouts_template'][str(e2)])[1]
#                     if int(y0_1) == int(y0_2):
#                         if {e1, e2} is not issues_element and {e2, e1} is not issues_element:
#                             issues_element.append({e1, e2})
#                             # if int(x0_1 <= x0_2):
#
#         return issues_element
#
#     def find_element(element):
#
#         if db.buttons.find({'_id': str(element)}).count() > 0:
#             e = db.buttons.find({'_id': str(element)})
#         elif db.paragraphs.find({'_id': str(element)}).count() > 0:
#             e = db.paragraphs.find({'_id': str(element)})
#         elif db.textBoxes.find({'_id': str(element)}).count() > 0:
#             e = db.textBoxes.find({'_id': str(element)})
#         elif db.hyperLinks.find({'_id': str(element)}).count() > 0:
#             e = db.hyperLinks.find({'_id': str(element)})
#         elif db.pictures.find({'_id': str(element)}).count() > 0:
#             e = db.pictures.find({'_id': str(element)})
#         return e
#
#     def checkTextInside():
#
#         elements = list(document['layouts_template'])
#         loop = 0
#         ok = False
#         v = 0
#         while v <= 3:
#             for i in range(len(elements)):
#                 x0 = int(document['layouts_template'][str(elements[i])][0])
#                 x0_origin = float(document['layouts_template'][str(elements[i])][4])
#                 y0_origin = float(document['layouts_template'][str(elements[i])][5])
#                 y0 = int(document['layouts_template'][str(elements[i])][1])
#                 aux_Ex1 = float(document['layouts_template'][str(elements[i])][2])
#                 aux_Ey1 = (float(document['layouts_template'][str(elements[i])][3]))
#                 Ex0 = float(aux_Ex1) - 2 * ((float(x0) * 10) - ((float(aux_Ey1) - float(y0_origin)) / 2))
#                 if float(Ex0) < 10:
#                     Ex0 = 10
#
#                 if float(Ex0) > 90:
#                     Ex0 = 90
#                 Ey0 = float(aux_Ey1) - 2 * ((float(y0) * 10) - ((float(aux_Ex1) - float(x0_origin)) / 2))
#                 if float(Ey0) < 10:
#                     Ey0 = 10
#
#                 if float(Ey0) > 90:
#                     Ey0 = 90
#
#                 Ey1 = Ey0 + (aux_Ey1 - y0_origin)
#                 Ex1 = Ex0 + (aux_Ex1 - x0_origin)
#                 for j in range(len(elements)):
#
#                     if (elements[i] != elements[j]):
#
#                         ok = False
#                         x0_2 = int(document['layouts_template'][str(elements[j])][0])
#                         x0_origin_2 = float(document['layouts_template'][str(elements[j])][4])
#                         y0_origin_2 = float(document['layouts_template'][str(elements[j])][5])
#                         y0_2 = int(document['layouts_template'][str(elements[j])][1])
#                         aux_E2x1 = float(document['layouts_template'][str(elements[j])][2])
#                         aux_E2y1 = float(document['layouts_template'][str(elements[j])][3])
#
#                         E2x0 = float(aux_E2x1) - 2 * ((float(x0_2) * 10) - ((float(aux_E2y1) - float(y0_origin_2)) / 2))
#                         if float(E2x0) < 10:
#                             E2x0 = 10
#
#                         if float(E2x0) > 90:
#                             E2x0 = 90
#                         E2y0 = float(aux_E2y1) - 2 * ((float(y0_2) * 10) - ((float(aux_E2x1) - float(x0_origin_2)) / 2))
#                         if float(E2y0) < 10:
#                             E2y0 = 10
#
#                         if float(E2y0) > 90:
#                             E2y0 = 90
#
#                         E2y1 = E2y0 + (aux_E2y1 - y0_origin_2)
#                         E2x1 = E2x0 + (aux_E2x1 - x0_origin_2)
#                         # Inside
#
#                         while ok == False and loop <= 75:
#
#                             if loop <= 25:
#                                 bottom = (Ey0 <= E2y1 <= Ey1)
#                                 top = (Ey0 <= E2y0 <= Ey1)
#                                 left = (Ex0 <= E2x0 <= Ex1)
#                                 right = (Ex0 <= E2x1 <= Ex1)
#                                 print('check the values')
#                                 print('element1 ' + str(elements[i]) + ' element2 ' + str(elements[j]))
#                                 print('Y0 ' + str(Ey0) + ' Y1 ' + str(Ey1) + ' X0 ' + str(Ex0) + ' X1 ' + str(Ex1))
#                                 print(
#                                     '2Y0 ' + str(E2y0) + ' 2Y1 ' + str(E2y1) + ' 2X0 ' + str(E2x0) + ' 2X1 ' + str(
#                                         E2x1))
#
#                                 if top & left & right & bottom:
#                                     print('all inside')
#                                     print('element1 ' + str(elements[i]) + ' element2 ' + str(elements[j]))
#                                     print('Y0 ' + str(Ey0) + ' Y1 ' + str(Ey1) + ' X0 ' + str(Ex0) + ' X1 ' + str(Ex1))
#                                     print(
#                                         '2Y0 ' + str(E2y0) + ' 2Y1 ' + str(E2y1) + ' 2X0 ' + str(E2x0) + ' 2X1 ' + str(
#                                             E2x1))
#                                     print(str(loop))
#                                     over_load_inside_validation(elements[i], elements[j])
#                                     loop += 1
#                                 elif bottom & left & right:
#                                     print('bottom left right')
#                                     print('element1 ' + str(elements[i]) + ' element2 ' + str(elements[j]))
#                                     print('Y0 ' + str(Ey0) + ' Y1 ' + str(Ey1) + ' X0 ' + str(Ex0) + ' X1 ' + str(Ex1))
#                                     print(
#                                         '2Y0 ' + str(E2y0) + ' 2Y1 ' + str(E2y1) + ' 2X0 ' + str(E2x0) + ' 2X1 ' + str(
#                                             E2x1))
#                                     print(str(loop))
#                                     over_load_inside_validation(elements[i], elements[j])
#                                     loop += 1
#                                 elif top & bottom & left:
#                                     print('top bottom left')
#                                     over_load_inside_validation(elements[i], elements[j])
#                                     print(str(loop))
#                                     loop += 1
#                                 elif top & left & right:
#                                     print('top left right')
#                                     print('element1 ' + str(elements[i]) + ' element2 ' + str(elements[j]))
#                                     print('Y0 ' + str(Ey0) + ' Y1 ' + str(Ey1) + ' X0 ' + str(Ex0) + ' X1 ' + str(Ex1))
#                                     print(
#                                         '2Y0 ' + str(E2y0) + ' 2Y1 ' + str(E2y1) + ' 2X0 ' + str(E2x0) + ' 2X1 ' + str(
#                                             E2x1))
#                                     print(str(loop))
#                                     over_load_inside_validation(elements[i], elements[j])
#                                     loop += 1
#                                 elif top & bottom & right:
#                                     print('top bottom right')
#                                     print('element1 ' + str(elements[j]) + ' element2 ' + str(elements[i]))
#                                     print('Y0 ' + str(Ey0) + ' Y1 ' + str(Ey1) + ' X0 ' + str(Ex0) + ' X1 ' + str(Ex1))
#                                     print(
#                                         '2Y0 ' + str(E2y0) + ' 2Y1 ' + str(E2y1) + ' 2X0 ' + str(E2x0) + ' 2X1 ' + str(
#                                             E2x1))
#                                     print(str(loop))
#                                     over_load_inside_validation(elements[i], elements[j])
#                                     loop += 1
#                                 elif bottom & right:
#                                     print('bottom right')
#                                     print('element1 ' + str(elements[j]) + ' element2 ' + str(elements[i]))
#                                     print('Y0 ' + str(Ey0) + ' Y1 ' + str(Ey1) + ' X0 ' + str(Ex0) + ' X1 ' + str(Ex1))
#                                     print(
#                                         '2Y0 ' + str(E2y0) + ' 2Y1 ' + str(E2y1) + ' 2X0 ' + str(E2x0) + ' 2X1 ' + str(
#                                             E2x1))
#                                     print(str(loop))
#                                     over_load_inside_validation(elements[i], elements[j])
#                                     loop += 1
#                                 elif bottom & left:
#                                     print('bottom left')
#                                     print('element1 ' + str(elements[j]) + ' element2 ' + str(elements[i]))
#                                     print('Y0 ' + str(Ey0) + ' Y1 ' + str(Ey1) + ' X0 ' + str(Ex0) + ' X1 ' + str(Ex1))
#                                     print(
#                                         '2Y0 ' + str(E2y0) + ' 2Y1 ' + str(E2y1) + ' 2X0 ' + str(E2x0) + ' 2X1 ' + str(
#                                             E2x1))
#                                     print(str(loop))
#                                     over_load_inside_validation(elements[i], elements[j])
#                                     loop += 1
#                                 elif top & left:
#                                     print('top left')
#                                     print('element1 ' + str(elements[j]) + ' element2 ' + str(elements[i]))
#                                     print('Y0 ' + str(Ey0) + ' Y1 ' + str(Ey1) + ' X0 ' + str(Ex0) + ' X1 ' + str(Ex1))
#                                     print(
#                                         '2Y0 ' + str(E2y0) + ' 2Y1 ' + str(E2y1) + ' 2X0 ' + str(E2x0) + ' 2X1 ' + str(
#                                             E2x1))
#                                     print(str(loop))
#                                     over_load_inside_validation(elements[i], elements[j])
#                                     loop += 1
#                                 elif top & right:
#                                     print('top right')
#                                     print('element1 ' + str(elements[j]) + ' element2 ' + str(elements[i]))
#                                     print('Y0 ' + str(Ey0) + ' Y1 ' + str(Ey1) + ' X0 ' + str(Ex0) + ' X1 ' + str(Ex1))
#                                     print(
#                                         '2Y0 ' + str(E2y0) + ' 2Y1 ' + str(E2y1) + ' 2X0 ' + str(E2x0) + ' 2X1 ' + str(
#                                             E2x1))
#                                     print(str(loop))
#                                     over_load_inside_validation(elements[i], elements[j])
#                                     loop += 1
#
#                                 elif top & bottom:
#                                     print('top botton')
#                                     print('element1 ' + str(elements[j]) + ' element2 ' + str(elements[i]))
#                                     print('Y0 ' + str(Ey0) + ' Y1 ' + str(Ey1) + ' X0 ' + str(Ex0) + ' X1 ' + str(Ex1))
#                                     print(
#                                         '2Y0 ' + str(E2y0) + ' 2Y1 ' + str(E2y1) + ' 2X0 ' + str(E2x0) + ' 2X1 ' + str(
#                                             E2x1))
#                                     print(str(loop))
#                                     over_load_inside_validation(elements[i], elements[j])
#                                     loop += 1
#
#                                 else:
#
#                                     ok = True
#
#                             elif 25 < loop <= 50:
#                                 bottom = (Ey0 <= E2y1 <= Ey1)
#                                 top = (Ey0 <= E2y0 <= Ey1)
#                                 left = (Ex0 <= E2x0 <= Ex1)
#                                 right = (Ex0 <= E2x1 <= Ex1)
#                                 print('element1 ' + str(elements[i]) + ' element2 ' + str(elements[j]))
#                                 print('Y0 ' + str(Ey0) + ' Y1 ' + str(Ey1) + ' X0 ' + str(Ex0) + ' X1 ' + str(Ex1))
#                                 print(
#                                     '2Y0 ' + str(E2y0) + ' 2Y1 ' + str(E2y1) + ' 2X0 ' + str(E2x0) + ' 2X1 ' + str(
#                                         E2x1))
#
#                                 if top & left & right & bottom:
#                                     print('all inside')
#                                     print('element1 ' + str(elements[i]) + ' element2 ' + str(elements[j]))
#                                     print('Y0 ' + str(Ey0) + ' Y1 ' + str(Ey1) + ' X0 ' + str(Ex0) + ' X1 ' + str(Ex1))
#                                     print(
#                                         '2Y0 ' + str(E2y0) + ' 2Y1 ' + str(E2y1) + ' 2X0 ' + str(E2x0) + ' 2X1 ' + str(
#                                             E2x1))
#                                     print(str(loop))
#                                     over_load_inside_validation(elements[j], elements[i])
#                                     loop += 1
#
#                                 elif bottom & left & right:
#                                     print('bottom left right')
#                                     print('element1 ' + str(elements[i]) + ' element2 ' + str(elements[j]))
#                                     print('Y0 ' + str(Ey0) + ' Y1 ' + str(Ey1) + ' X0 ' + str(Ex0) + ' X1 ' + str(Ex1))
#                                     print(
#                                         '2Y0 ' + str(E2y0) + ' 2Y1 ' + str(E2y1) + ' 2X0 ' + str(E2x0) + ' 2X1 ' + str(
#                                             E2x1))
#                                     print(str(loop))
#                                     over_load_inside_validation(elements[j], elements[i])
#                                     loop += 1
#                                 elif top & bottom & left:
#                                     print('top bottom left')
#                                     over_load_inside_validation(elements[j], elements[i])
#                                     print(str(loop))
#                                     loop += 1
#                                 elif top & left & right:
#                                     print('top left right')
#                                     print('element1 ' + str(elements[j]) + ' element2 ' + str(elements[i]))
#                                     print('Y0 ' + str(Ey0) + ' Y1 ' + str(Ey1) + ' X0 ' + str(Ex0) + ' X1 ' + str(Ex1))
#                                     print(
#                                         '2Y0 ' + str(E2y0) + ' 2Y1 ' + str(E2y1) + ' 2X0 ' + str(E2x0) + ' 2X1 ' + str(
#                                             E2x1))
#                                     print(str(loop))
#                                     over_load_inside_validation(elements[j], elements[i])
#                                     loop += 1
#                                 elif top & bottom & right:
#                                     print('top bottom right')
#                                     print('element1 ' + str(elements[j]) + ' element2 ' + str(elements[i]))
#                                     print('Y0 ' + str(Ey0) + ' Y1 ' + str(Ey1) + ' X0 ' + str(Ex0) + ' X1 ' + str(Ex1))
#                                     print(
#                                         '2Y0 ' + str(E2y0) + ' 2Y1 ' + str(E2y1) + ' 2X0 ' + str(E2x0) + ' 2X1 ' + str(
#                                             E2x1))
#                                     print(str(loop))
#                                     over_load_inside_validation(elements[j], elements[i])
#                                     loop += 1
#                                 elif bottom & right:
#                                     print('bottom right')
#                                     print('element1 ' + str(elements[j]) + ' element2 ' + str(elements[i]))
#                                     print('Y0 ' + str(Ey0) + ' Y1 ' + str(Ey1) + ' X0 ' + str(Ex0) + ' X1 ' + str(Ex1))
#                                     print(
#                                         '2Y0 ' + str(E2y0) + ' 2Y1 ' + str(E2y1) + ' 2X0 ' + str(E2x0) + ' 2X1 ' + str(
#                                             E2x1))
#                                     print(str(loop))
#                                     over_load_inside_validation(elements[j], elements[i])
#                                     loop += 1
#                                 elif bottom & left:
#                                     print('bottom left')
#                                     print('element1 ' + str(elements[j]) + ' element2 ' + str(elements[i]))
#                                     print('Y0 ' + str(Ey0) + ' Y1 ' + str(Ey1) + ' X0 ' + str(Ex0) + ' X1 ' + str(Ex1))
#                                     print(
#                                         '2Y0 ' + str(E2y0) + ' 2Y1 ' + str(E2y1) + ' 2X0 ' + str(E2x0) + ' 2X1 ' + str(
#                                             E2x1))
#                                     print(str(loop))
#                                     over_load_inside_validation(elements[j], elements[i])
#                                     loop += 1
#                                 elif top & left:
#                                     print('top left')
#                                     print('element1 ' + str(elements[j]) + ' element2 ' + str(elements[i]))
#                                     print('Y0 ' + str(Ey0) + ' Y1 ' + str(Ey1) + ' X0 ' + str(Ex0) + ' X1 ' + str(Ex1))
#                                     print(
#                                         '2Y0 ' + str(E2y0) + ' 2Y1 ' + str(E2y1) + ' 2X0 ' + str(E2x0) + ' 2X1 ' + str(
#                                             E2x1))
#                                     print(str(loop))
#                                     over_load_inside_validation(elements[j], elements[i])
#                                     loop += 1
#                                 elif top & right:
#                                     print('top right')
#                                     print('element1 ' + str(elements[j]) + ' element2 ' + str(elements[i]))
#                                     print('Y0 ' + str(Ey0) + ' Y1 ' + str(Ey1) + ' X0 ' + str(Ex0) + ' X1 ' + str(Ex1))
#                                     print(
#                                         '2Y0 ' + str(E2y0) + ' 2Y1 ' + str(E2y1) + ' 2X0 ' + str(E2x0) + ' 2X1 ' + str(
#                                             E2x1))
#                                     print(str(loop))
#                                     over_load_inside_validation(elements[j], elements[i])
#                                     loop += 1
#
#                                 elif top & bottom:
#                                     print('top botton')
#                                     print('element1 ' + str(elements[j]) + ' element2 ' + str(elements[i]))
#                                     print('Y0 ' + str(Ey0) + ' Y1 ' + str(Ey1) + ' X0 ' + str(Ex0) + ' X1 ' + str(Ex1))
#                                     print(
#                                         '2Y0 ' + str(E2y0) + ' 2Y1 ' + str(E2y1) + ' 2X0 ' + str(E2x0) + ' 2X1 ' + str(
#                                             E2x1))
#                                     print(str(loop))
#                                     over_load_inside_validation(elements[j], elements[i])
#                                     loop += 1
#
#                                 else:
#                                     ok = True
#
#
#                             else:
#
#                                 if loop > 50:
#                                     bottom = (Ey0 <= E2y1 <= Ey1)
#                                     top = (Ey0 <= E2y0 <= Ey1)
#                                     left = (Ex0 <= E2x0 <= Ex1)
#                                     right = (Ex0 <= E2x1 <= Ex1)
#
#                                 if top & left & right & bottom:
#                                     print('all inside')
#                                     print('element1 ' + str(elements[i]) + ' element2 ' + str(elements[j]))
#                                     print('Y0 ' + str(Ey0) + ' Y1 ' + str(Ey1) + ' X0 ' + str(Ex0) + ' X1 ' + str(Ex1))
#                                     print(
#                                         '2Y0 ' + str(E2y0) + ' 2Y1 ' + str(E2y1) + ' 2X0 ' + str(E2x0) + ' 2X1 ' + str(
#                                             E2x1))
#                                     print(str(loop))
#                                     over_lap_extreme_validation(elements[i], elements[j])
#                                     loop += 1
#                                 elif bottom & left & right:
#                                     print('bottom left right')
#                                     print('element1 ' + str(elements[i]) + ' element2 ' + str(elements[j]))
#                                     print('Y0 ' + str(Ey0) + ' Y1 ' + str(Ey1) + ' X0 ' + str(Ex0) + ' X1 ' + str(Ex1))
#                                     print(
#                                         '2Y0 ' + str(E2y0) + ' 2Y1 ' + str(E2y1) + ' 2X0 ' + str(E2x0) + ' 2X1 ' + str(
#                                             E2x1))
#                                     print(str(loop))
#
#                                     over_lap_extreme_validation(elements[i], elements[j])
#                                     loop += 1
#                                 elif top & bottom & left:
#                                     print('top bottom left')
#                                     print('element1 ' + str(elements[j]) + ' element2 ' + str(elements[i]))
#                                     print('Y0 ' + str(Ey0) + ' Y1 ' + str(Ey1) + ' X0 ' + str(Ex0) + ' X1 ' + str(Ex1))
#                                     print(
#                                         '2Y0 ' + str(E2y0) + ' 2Y1 ' + str(E2y1) + ' 2X0 ' + str(E2x0) + ' 2X1 ' + str(
#                                             E2x1))
#                                     print(str(loop))
#                                     over_lap_extreme_validation(elements[i], elements[j])
#                                     loop += 1
#                                 elif top & left & right:
#                                     print('top left right')
#                                     print('element1 ' + str(elements[i]) + ' element2 ' + str(elements[j]))
#                                     print('Y0 ' + str(Ey0) + ' Y1 ' + str(Ey1) + ' X0 ' + str(Ex0) + ' X1 ' + str(Ex1))
#                                     print(
#                                         '2Y0 ' + str(E2y0) + ' 2Y1 ' + str(E2y1) + ' 2X0 ' + str(E2x0) + ' 2X1 ' + str(
#                                             E2x1))
#                                     print(str(loop))
#                                     over_lap_extreme_validation(elements[i], elements[j])
#                                     loop += 1
#                                 elif top & bottom & right:
#                                     print('top bottom right')
#                                     print('Bottom ' + str(Ey0) + ' <= ' + str(E2y1) + ' <= ' + str(Ey1))
#                                     print('Top ' + str(Ey0) + ' <= ' + str(E2y0) + ' <= ' + str(Ey1))
#                                     print('Left ' + str(Ex0) + ' <= ' + str(E2x0) + ' <= ' + str(Ex1))
#                                     print('Rigth ' + str(Ex0) + ' <= ' + str(E2x1) + ' <= ' + str(Ex1))
#                                     print('element1 ' + str(elements[i]) + ' element2 ' + str(elements[j]))
#
#                                     over_lap_extreme_validation(elements[i], elements[j])
#                                     loop += 1
#                                 elif bottom & right:
#                                     print('bottom right')
#                                     print('element1 ' + str(elements[j]) + ' element2 ' + str(elements[i]))
#                                     print('Y0 ' + str(Ey0) + ' Y1 ' + str(Ey1) + ' X0 ' + str(Ex0) + ' X1 ' + str(Ex1))
#                                     print(
#                                         '2Y0 ' + str(E2y0) + ' 2Y1 ' + str(E2y1) + ' 2X0 ' + str(E2x0) + ' 2X1 ' + str(
#                                             E2x1))
#                                     print(str(loop))
#                                     over_lap_extreme_validation(elements[i], elements[j])
#                                     loop += 1
#                                 elif bottom & left:
#                                     print('bottom left')
#                                     print('element1 ' + str(elements[j]) + ' element2 ' + str(elements[i]))
#                                     print('Y0 ' + str(Ey0) + ' Y1 ' + str(Ey1) + ' X0 ' + str(Ex0) + ' X1 ' + str(Ex1))
#                                     print(
#                                         '2Y0 ' + str(E2y0) + ' 2Y1 ' + str(E2y1) + ' 2X0 ' + str(E2x0) + ' 2X1 ' + str(
#                                             E2x1))
#                                     print(str(loop))
#                                     over_lap_extreme_validation(elements[i], elements[j])
#                                     loop += 1
#                                 elif top & left:
#                                     print('top left')
#                                     print('element1 ' + str(elements[j]) + ' element2 ' + str(elements[i]))
#                                     print('Y0 ' + str(Ey0) + ' Y1 ' + str(Ey1) + ' X0 ' + str(Ex0) + ' X1 ' + str(Ex1))
#                                     print(
#                                         '2Y0 ' + str(E2y0) + ' 2Y1 ' + str(E2y1) + ' 2X0 ' + str(E2x0) + ' 2X1 ' + str(
#                                             E2x1))
#                                     print(str(loop))
#                                     over_lap_extreme_validation(elements[i], elements[j])
#                                     loop += 1
#                                 elif top & right:
#                                     print('top right')
#                                     print('element1 ' + str(elements[j]) + ' element2 ' + str(elements[i]))
#                                     print('Y0 ' + str(Ey0) + ' Y1 ' + str(Ey1) + ' X0 ' + str(Ex0) + ' X1 ' + str(Ex1))
#                                     print(
#                                         '2Y0 ' + str(E2y0) + ' 2Y1 ' + str(E2y1) + ' 2X0 ' + str(E2x0) + ' 2X1 ' + str(
#                                             E2x1))
#                                     print(str(loop))
#                                     over_lap_extreme_validation(elements[i], elements[j])
#                                     loop += 1
#
#                                 elif top & bottom:
#                                     print('top botton')
#                                     print('element1 ' + str(elements[j]) + ' element2 ' + str(elements[i]))
#                                     print('Y0 ' + str(Ey0) + ' Y1 ' + str(Ey1) + ' X0 ' + str(Ex0) + ' X1 ' + str(Ex1))
#                                     print(
#                                         '2Y0 ' + str(E2y0) + ' 2Y1 ' + str(E2y1) + ' 2X0 ' + str(E2x0) + ' 2X1 ' + str(
#                                             E2x1))
#                                     print(str(loop))
#                                     over_lap_extreme_validation(elements[i], elements[j])
#                                     loop += 1
#
#                                 else:
#                                     ok = True
#
#             v += 1
#
#         print("okokok: " + str(ok))
#
#     def over_load_inside_validation(ext_ele, inside_ele):
#         layouts = {}
#         top = 100
#         botton = 100
#         elements = list(document['layouts_template'])
#         x0 = int(document['layouts_template'][str(ext_ele)][0])
#         x0_origin = float(document['layouts_template'][str(ext_ele)][4])
#         y0_origin = float(document['layouts_template'][str(ext_ele)][5])
#         y0 = int(document['layouts_template'][str(ext_ele)][1])
#         aux_Ex1 = float(document['layouts_template'][str(ext_ele)][2])
#         aux_Ey1 = (float(document['layouts_template'][str(ext_ele)][3]))
#         Ex0 = float(aux_Ex1) - 2 * ((float(x0) * 10) - ((float(aux_Ey1) - float(y0_origin)) / 2))
#         if float(Ex0) < 10:
#             Ex0 = 10
#
#         if float(Ex0) > 90:
#             Ex0 = 90
#         Ey0 = float(aux_Ey1) - 2 * ((float(y0) * 10) - ((float(aux_Ex1) - float(x0_origin)) / 2))
#         if float(Ey0) < 10:
#             Ey0 = 10
#
#         if float(Ey0) > 90:
#             Ey0 = 90
#
#         Ey1 = Ey0 + (aux_Ey1 - y0_origin)
#         Ex1 = Ex0 + (aux_Ex1 - x0_origin)
#
#         x0_in = int(document['layouts_template'][str(inside_ele)][0])
#         x0_origin_in = float(document['layouts_template'][str(inside_ele)][4])
#         y0_origin_in = float(document['layouts_template'][str(inside_ele)][5])
#         y0_in = int(document['layouts_template'][str(inside_ele)][1])
#         aux_Ex1_in = float(document['layouts_template'][str(inside_ele)][2])
#         aux_Ey1_in = (float(document['layouts_template'][str(inside_ele)][3]))
#
#         Ex0_in = float(aux_Ex1_in) - 2 * ((float(x0_in) * 10) - ((float(aux_Ey1_in) - float(y0_origin_in)) / 2))
#         if float(Ex0_in) < 10:
#             Ex0_in = 10
#         if float(Ex0_in) > 90:
#             Ex0_in = 90
#         Ey0_in = float(aux_Ey1_in) - 2 * ((float(y0_in) * 10) - ((float(aux_Ex1_in) - float(x0_origin_in)) / 2))
#         if float(Ey0_in) < 10:
#             Ey0_in = 10
#         if float(Ey0_in) > 90:
#             Ey0_in = 90
#
#         Ey1_in = Ey0_in + (aux_Ey1_in - y0_origin_in)
#         Ex1_in = Ex0_in + (aux_Ex1_in - x0_origin_in)
#
#         for i in elements:
#             if (str(i) != str(ext_ele)) & (str(i) != str(inside_ele)):
#                 x0_2 = int(document['layouts_template'][str(i)][0])
#                 x0_origin_2 = float(document['layouts_template'][str(i)][4])
#                 y0_origin_2 = float(document['layouts_template'][str(i)][5])
#                 y0_2 = int(document['layouts_template'][str(i)][1])
#                 aux_E2x1 = float(document['layouts_template'][str(i)][2])
#                 aux_E2y1 = float(document['layouts_template'][str(i)][3])
#
#                 E2x0 = float(aux_E2x1) - 2 * ((float(x0_2) * 10) - ((float(aux_E2y1) - float(y0_origin_2)) / 2))
#                 if float(E2x0) < 10:
#                     E2x0 = 10
#
#                 if float(E2x0) > 90:
#                     E2x0 = 90
#                 E2y0 = float(aux_E2y1) - 2 * ((float(y0_2) * 10) - ((float(aux_E2x1) - float(x0_origin_2)) / 2))
#                 if float(E2y0) < 10:
#                     E2y0 = 10
#
#                 if float(E2y0) > 90:
#                     E2y0 = 90
#
#                 E2y1 = E2y0 + (aux_E2y1 - y0_origin_2)
#                 E2x1 = E2x0 + (aux_E2x1 - x0_origin_2)
#
#                 if Ey0 > E2y1:
#                     aux_top = Ey0 - E2y1
#                     if aux_top < top:
#                         top = aux_top
#                 if E2y0 > Ey1:
#                     aux_botton = E2y0 - Ey1
#                     if aux_botton < botton:
#                         botton = aux_botton
#                         ## Check Rigth abd Left--------------------------
#                         #                if E2x0 > Ex1:
#                         #                    aux_rigth = E2x0 - Ex1
#                         #                    if aux_rigth < rigth:
#                         #                        rigth = aux_rigth
#                         #                if Ex0 > E2x1:
#                         #                    aux_left = Ex0 - E2x1
#                         #                    if aux_left < left:
#                         #                        left = aux_left
#                 if Ey0 < top:
#                     top = Ey0
#                     #                if (100 - Ex1) < rigth:
#                     #                    rigth = 100 - Ex1
#                     #                if (Ex0 < left):
#                     #                    left = Ex0
#                 if (100 - Ey1) < botton:
#                     botton = 100 - Ey1
#
#         if (top >= botton):
#
#             h = (aux_Ey1_in - y0_origin_in) + top / (aux_Ey1_in - y0_origin_in)
#             print('Movement: ' + str(h))
#             aux_movement_y0 = int(round((float(((Ex1_in - Ex0_in) / 2) + (((Ey0 - (Ey1_in - h)) / 2))) / 10), 0))
#             if aux_movement_y0 == y0_in:
#                 movement_y0 = aux_movement_y0 - 1
#             else:
#                 movement_y0 = aux_movement_y0
#             print('Y0_old: ' + str(y0_in) + " Y0_new: " + str(movement_y0))
#             movement_y1 = aux_Ey1_in
#             movement_x0 = int(x0_in)
#             movement_x1 = aux_Ex1_in
#
#
#         else:
#
#             h = (aux_Ey1_in - y0_origin_in) + botton / (aux_Ey1_in - y0_origin_in)
#             print('Movement: ' + str(h))
#
#             aux_movement_y0 = int(round((float(((Ex1_in - Ex0_in) / 2) + ((((Ey1 + h) - Ey1) / 2))) / 10), 0))
#             if aux_movement_y0 == y0_in:
#                 movement_y0 = aux_movement_y0 + 1
#             else:
#                 movement_y0 = aux_movement_y0
#             print('Y0_old: ' + str(y0_in) + " Y0_new: " + str(movement_y0))
#             movement_y1 = aux_Ey1_in
#             movement_x0 = int(x0_in)
#             movement_x1 = aux_Ex1_in
#             #        elif (rigth > top) & (rigth > botton) & (rigth > left):
#             #            movement_y0 = int(y0_in)
#             #            movement_y1 = Ey1_in
#             #            movement_x0 = int(Ex1)
#             #            movement_x1 = Ey1_in + rigth
#             #            print('Heyyyy2')
#             #        elif (left > rigth) & (left > botton) & (left > top):
#             #            movement_y0 = int(y0_in)
#             #            movement_y1 = Ey1_in
#             #            movement_x0 = int(round(((Ex0 + left + (Ex1_in - x0_origin_in / 2))/10),0))
#             #            movement_x1 = Ex0
#             #            print('Heyyyyyyy3')
#         for i in elements:
#             if str(i) != str(inside_ele):
#                 layouts[str(i)] = (
#                     (str(document['layouts_template'][str(i)][0])), str(document['layouts_template'][str(i)][1]),
#                     str(document['layouts_template'][str(i)][2]), str(document['layouts_template'][str(i)][3]),
#                     str(document['layouts_template'][str(i)][4]), str(document['layouts_template'][str(i)][5]))
#             else:
#                 layouts[str(inside_ele)] = (
#                     str(movement_x0), str(movement_y0), str(movement_x1), str(movement_y1), str(x0_origin_in),
#                     str(y0_origin_in))
#         update_layouts(document['_id'], layouts)
#
#     def over_lap_extreme_validation(ext_ele, inside_ele):
#         layouts = {}
#         top = 0
#         botton = 0
#         element_top = ext_ele
#         element_bottom = inside_ele
#         element_top_in = ext_ele
#         element_bottom_in = inside_ele
#         elements = list(document['layouts_template'])
#
#         for i in elements:
#             top_in = 9
#             botton_in = 9
#             y0_1 = int(document['layouts_template'][str(i)][1])
#             for j in elements:
#                 if j > i:
#                     if str(i) != str(j):
#                         y0_2 = int(document['layouts_template'][str(j)][1])
#                         aux = y0_1 - y0_2
#                         if aux >= 0:
#                             if aux < top_in:
#                                 top_in = aux
#                                 element_top_in = i
#                             if aux < botton_in:
#                                 botton_in = aux
#                                 element_bottom_in = j
#
#                         else:
#                             if abs(aux) < botton_in:
#                                 botton_in = abs(aux)
#                                 element_bottom_in = i
#                             if abs(aux) < top_in:
#                                 top_in = abs(aux)
#                                 element_top_in = j
#
#             if top_in > top:
#                 top = top_in
#                 element_top = element_top_in
#             if botton_in > botton:
#                 botton = botton_in
#                 element_bottom = element_bottom_in
#
#         print('top: ' + str(top) + ' botton: ' + str(botton))
#         if (top > botton):
#             print('Subiendo ' + str(inside_ele) + 'on top ' + str(element_top))
#             x0_origin = float(document['layouts_template'][str(inside_ele)][4])
#             y0_origin = float(document['layouts_template'][str(inside_ele)][5])
#             movement_y0 = int(document['layouts_template'][str(element_top)][1]) - 1
#             print('Old: ' + str(int(document['layouts_template'][str(element_top)][1])) + ' New: ' + str(movement_y0))
#             movement_y1 = float(document['layouts_template'][str(inside_ele)][3])
#             movement_x0 = int(document['layouts_template'][str(inside_ele)][0])
#             movement_x1 = float(document['layouts_template'][str(inside_ele)][2])
#         else:
#             print('Bajando ' + str(inside_ele))
#             x0_origin = float(document['layouts_template'][str(inside_ele)][4])
#             y0_origin = float(document['layouts_template'][str(inside_ele)][5])
#             movement_y0 = int(document['layouts_template'][str(element_bottom)][1]) + 1
#             movement_y1 = float(document['layouts_template'][str(inside_ele)][3])
#             movement_x0 = int(document['layouts_template'][str(inside_ele)][0])
#             movement_x1 = float(document['layouts_template'][str(inside_ele)][2])
#
#         for i in elements:
#             if str(i) != str(inside_ele):
#                 layouts[str(i)] = (
#                     (str(document['layouts_template'][str(i)][0])), str(document['layouts_template'][str(i)][1]),
#                     str(document['layouts_template'][str(i)][2]), str(document['layouts_template'][str(i)][3]),
#                     str(document['layouts_template'][str(i)][4]), str(document['layouts_template'][str(i)][5]))
#             else:
#                 layouts[str(inside_ele)] = (
#                     str(movement_x0), str(movement_y0), str(movement_x1), str(movement_y1), str(x0_origin),
#                     str(y0_origin))
#
#         update_layouts(document['_id'], layouts)
#
#     def normalization_size_text_boxes():
#
#         width_s = 90
#         height_s = 90
#         width_b = 0
#         height_b = 0
#         for t in textBoxArray:
#             print('TextboxArray: ' + str(textBoxArray))
#
#             # location = get_collection_layouts(screenshot_id,str(t['_id']),index)
#             if len(textBoxArray) > 0:
#
#                 var1 = list(t['level'].keys())[0]
#                 if var1 == 'parent' and str(t['state']) == 'active':
#                     var = list(document['layouts_template'][str(t['_id'])])
#                     x = var[0]
#                     y = var[1]
#
#                 if 'parent' in t['level']:
#                     if t['level']['parent'] == [] or 'child' in t['level'] or t['level'] == []:
#                         print('parent is empty!')
#                         name = str(t['name'])
#                         placeholder = str(t['name'])
#                     else:
#                         name = str(t['name'])
#                         placeholder = str(t['name'])
#
#                     # Get parent info
#
#                     x0 = float(var[2]) - 2 * (
#                             (float(var[4]) * 10) - ((float(var[3]) - float(var[5])) / 2))
#                     print('xxxx4444: ' + str(x0))
#                     if float(x0) < 10:
#                         x0 = 10
#
#                     if float(x0) > 90:
#                         x0 = 90
#
#                     y0 = float(var[3]) - 2 * ((float(y) * 10) - ((float(var[2]) - float(var[4])) / 2))
#                     if float(y0) < 10:
#                         y0 = 10
#
#                     if float(y0) > 85:
#                         y0 = 85
#
#                     width = float((float(var[2]) - float(var[4])))
#                     height = float((float(var[3]) - float(var[5])))
#
#                     if float(x0) + width > 90:
#                         width = 95 - float(x0)
#
#                     if width_s > width:
#                         width_s = width
#                     if height_s > height:
#                         height_s = height
#                     if width_b < width:
#                         width_b = width
#                     if height_b < height:
#                         height_b = height
#
#                     d = random.randint(0, 1)
#                     if d == 0:
#                         return width_s, height_s
#                     elif d == 1:
#                         return width_s, height_s
#
#     def normalization_aling_text_button():
#
#         left = 100
#         rigth = 0
#
#         for t in textBoxArray:
#             print('TextboxArray: ' + str(textBoxArray))
#
#             # location = get_collection_layouts(screenshot_id,str(t['_id']),index)
#             if len(textBoxArray) > 0:
#
#                 var1 = list(t['level'].keys())[0]
#                 if var1 == 'parent' and str(t['state']) == 'active':
#                     var = list(document['layouts_template'][str(t['_id'])])
#                     x = var[0]
#                     y = var[1]
#
#                 if 'parent' in t['level']:
#                     if t['level']['parent'] == [] or 'child' in t['level'] or t['level'] == []:
#                         print('parent is empty!')
#                         name = str(t['name'])
#                         placeholder = str(t['name'])
#                     else:
#                         name = str(t['name'])
#                         placeholder = str(t['name'])
#
#                     # Get parent info
#
#                     x0 = float(var[2]) - 2 * (
#                             (float(var[4]) * 10) - ((float(var[3]) - float(var[5])) / 2))
#                     print('xxxx4444: ' + str(x0))
#                     if float(x0) < 10:
#                         x0 = 10
#
#                     if float(x0) > 90:
#                         x0 = 90
#
#                     y0 = float(var[3]) - 2 * ((float(y) * 10) - ((float(var[2]) - float(var[4])) / 2))
#
#                     if float(y0) < 10:
#                         y0 = 10
#
#                     if float(y0) > 85:
#                         y0 = 85
#
#                     if left > x0:
#                         left = x0
#                     if rigth < x0:
#                         rigth = x0
#                     d = random.randint(0, 1)
#                     if d == 0:
#                         return left
#                     else:
#                         return rigth
#
#     '# RUN THE METAALGORITHM FOR EACH TYPE OF ELEMENT'
#     if 7 == 7:
#         if state == 'generate':
#             checkTextInside()
#         print('try index here:')
#         print(index)
#         path = '../../'
#         if state == 'generate':
#             titleHtml = 'testing' + str(index)
#             titleCss = 'testingCss' + str(index)
#             pages_creation = create_page_Html_and_Css_and_js(path, titleHtml, titleCss)
#
#             pagehtml = pages_creation[0]
#             pagecss = pages_creation[1]
#
#         userId = getCollectionIDs('user', currentUser)
#         print('after \n')
#         print("button", ButtonArray)
#         print("paragraph", paragraphArray)
#         print("hyperLink", hyperLinkArray)
#         print("txtBox", textBoxArray)
#         #        print("txtBoxLegend", textBoxLegendArray)
#         print("frame", frameArray)
#         print("logo", logoArray)
#
#         '#CREATING ADDITIONAL NEW ELEMENT '
#         print('new element: ' + str(newElementsArray))
#
#         # for e in newElementsArray:
#         #     if len(newElementsArray) > 0:
#         #
#         #         elementType = e['type']
#         #         if elementType == 'button':
#         #
#         #             label = e['name']
#         #             classid = e['class_id'][index:]+str('L')
#         #             width = str(float(e['location']['x1']) - float(e['location']['x0']))
#         #             height = str(float(e['location']['y1']) - float(e['location']['y0']))
#         #             positionL = str(float(e['location']['x0']))
#         #             positionT = str(float(e['location']['y0']))
#         #
#         #             fStyles = get_new_fstyles(classid)
#         #
#         #             fontSize = fStyles['fontSize']
#         #             fontColor = fStyles['fontColor']
#         #             textAlign = fStyles['textAlign']
#         #             fontFamily = fStyles['fontFamily']
#         #
#         #             styles = get_new_bstyles(classid)
#         #             bgcolor = styles['bgcolor']
#         #             bordercolor = styles['borderColor']
#         #             borderRadius = styles['borderRadius']
#         #
#         #             if state == 'generate':
#         #                 create_button(label, str(classid), width, height, borderRadius, positionL, positionT, bgcolor,
#         #                               bordercolor,
#         #                               fontColor, str(fontSize), str(fontFamily), '')
#         #             elif state == 'change':
#         #                 updateLayout('newElements',e['class_id'], e['location'])
#         #
#         #         elif elementType == 'frame':
#         #
#         #             label = e['name']
#         #             classid = str(e['class_id'][index:])+str('L')
#         #             width = str(float(e['location']['x1']) - float(e['location']['x0']))
#         #             height = str(float(e['location']['y1']) - float(e['location']['y0']))
#         #             positionL = str(float(e['location']['x0']))
#         #             positionT = str(float(e['location']['y0']))
#         #
#         #             fStyles = get_new_fstyles(classid)
#         #
#         #             fontSize = fStyles['fontSize']
#         #             fontColor = fStyles['fontColor']
#         #             textAlign = fStyles['textAlign']
#         #             fontFamily = fStyles['fontFamily']
#         #
#         #             styles = get_new_bstyles(classid)
#         #             bgcolor = styles['bgcolor']
#         #             bordercolor = styles['borderColor']
#         #             borderRadius = styles['borderRadius']
#         #
#         #             if state == 'generate':
#         #                 create_div(classid, width, height, positionL, positionT, borderRadius, bordercolor, bgcolor)
#         #             elif state == 'change':
#         #                 updateLayout('newElements',e['class_id'], e['location'])
#         #
#         #         elif elementType == 'hyperlink':
#         #
#         #             label = e['name']
#         #             classid = e['class_id'][index:]+str('L')
#         #             width = str(float(e['location']['x1']) - float(e['location']['x0']))
#         #             height = str(float(e['location']['y1']) - float(e['location']['y0']))
#         #             positionL = str(float(e['location']['x0']))
#         #             positionT = str(float(e['location']['y0']))
#         #             text_string = str(e['name'])
#         #
#         #             fStyles = get_new_fstyles(classid)
#         #
#         #             fontSize = fStyles['fontSize']
#         #             fontColor = fStyles['fontColor']
#         #             textAlign = fStyles['textAlign']
#         #             fontFamily = fStyles['fontFamily']
#         #
#         #             styles = get_new_bstyles(classid)
#         #             bgcolor = styles['bgcolor']
#         #             bordercolor = styles['borderColor']
#         #             borderRadius = styles['borderRadius']
#         #
#         #             if state == 'generate':
#         #                 create_hyperLink(str(classid), str(text_string),
#         #                              positionL, positionT, str(fontSize), fontColor, width, textAlign, fontFamily, '')
#         #             elif state == 'change':
#         #                 updateLayout('newElements',e['class_id'], e['location'])
#         #
#         #         elif elementType == 'paragraph':
#         #
#         #             label = e['name']
#         #             classid = e['class_id'][index:]+str('L')
#         #             width = str(float(e['location']['x1']) - float(e['location']['x0']))
#         #             height = str(float(e['location']['y1']) - float(e['location']['y0']))
#         #             positionL = str(float(e['location']['x0']))
#         #             positionT = str(float(e['location']['y0']))
#         #             text_string = str(e['name'])
#         #
#         #             fStyles = get_new_fstyles(classid)
#         #
#         #             fontSize = fStyles['fontSize']
#         #             fontColor = fStyles['fontColor']
#         #             textAlign = fStyles['textAlign']
#         #             fontFamily = fStyles['fontFamily']
#         #
#         #             styles = get_new_bstyles(classid)
#         #             bgcolor = styles['bgcolor']
#         #             bordercolor = styles['borderColor']
#         #             borderRadius = styles['borderRadius']
#         #             link = ''
#         #
#         #             if state == 'generate':
#         #                 create_paragraph(classid, text_string, positionL, positionT, fontSize, fontColor, width,
#         #                              textAlign, height, fontFamily, link)
#         #             elif state == 'change':
#         #                 updateLayout('newElements',e['class_id'], e['location'])
#         #
#         #         elif elementType == 'textbox':
#         #
#         #             label = e['name']
#         #             classid = e['class_id'][index:]+str('L')
#         #             width = str(float(e['location']['x1']) - float(e['location']['x0']))
#         #             height = str(float(e['location']['y1']) - float(e['location']['y0']))
#         #             positionL = str(float(e['location']['x0']))
#         #             positionT = str(float(e['location']['y0']))
#         #             placeholder = e['name']
#         #             # Check
#         #
#         #             fStyles = get_new_fstyles(classid)
#         #             childOffset = fStyles['textIndent']
#         #             fontSize = fStyles['fontSize']
#         #             fontColor = fStyles['fontColor']
#         #             textAlign = fStyles['textAlign']
#         #             fontFamily = fStyles['fontFamily']
#         #
#         #             styles = get_new_bstyles(classid)
#         #             bgcolor = styles['bgcolor']
#         #             bordercolor = styles['borderColor']
#         #             borderRadius = styles['borderRadius']
#         #
#         #             if state == 'generate':
#         #                 create_text_box_placeholder(placeholder, label, width, height, classid, borderRadius, positionL,
#         #                                             positionT, bgcolor, childOffset, fontSize, fontFamily, fontColor,
#         #                                         textAlign, bordercolor)
#         #             elif state == 'change':
#         #                 updateLayout('newElements',e['class_id'], e['location'])
#         #
#         #         elif elementType == 'textArea':
#         #
#         #             label = e['name']
#         #             classid = e['class_id'][index:]+str('L')
#         #             width = str(float(e['location']['x1']) - float(e['location']['x0']))
#         #             height = str(float(e['location']['y1']) - float(e['location']['y0']))
#         #             positionL = str(float(e['location']['x0']))
#         #             positionT = str(float(e['location']['y0']))
#         #             placeholder = str(e['name'])
#         #             # Check
#         #             fStyles = get_new_fstyles(classid)
#         #             childOffset = fStyles['textIndent']
#         #             fontSize = fStyles['fontSize']
#         #             fontColor = fStyles['fontColor']
#         #             textAlign = fStyles['textAlign']
#         #             fontFamily = fStyles['fontFamily']
#         #
#         #             styles = get_new_bstyles(classid)
#         #             bgcolor = styles['bgcolor']
#         #             bordercolor = styles['borderColor']
#         #             borderRadius = styles['borderRadius']
#         #
#         #             if state == 'generate':
#         #                 create_text_area(placeholder, label, classid, width, height, positionL, positionT,
#         #                                  childOffset, fontSize, bgcolor, borderRadius, bordercolor, fontFamily)
#         #             elif state == 'change':
#         #                 updateLayout('newElements',e['class_id'], e['location'])
#         #
#         #         elif elementType == 'image':
#         #
#         #             icon_path = 'static/users/' + str(e['root'])
#         #             classid = e['class_id'][index:]+str('L')
#         #             width = str(float(e['location']['x1']) - float(e['location']['x0']))
#         #             height = str(float(e['location']['y1']) - float(e['location']['y0']))
#         #             positionL = str(float(e['location']['x0']))
#         #             positionT = str(float(e['location']['y0']))
#         #             link = ''
#         #             if state == 'generate':
#         #                 create_image(icon_path, classid, width, height, positionL, positionT, link)
#         #             elif state == 'change':
#         #                 updateLayout('newElements',e['class_id'], e['location'])
#
#         '#CREATING FRAME OR BOXES'
#         for f in frameArray:
#
#             classid = str(f['seg_id'][index:]) + str('L')
#             width = str(float(f['location']['x1']) - float(f['location']['x0']))
#             height = str(float(f['location']['y1']) - float(f['location']['y0']))
#             positionL = str(float(f['location']['x0']))
#             positionT = str(float(f['location']['y0']))
#             print('framecheck')
#             print(f)
#             '# FRAME STYLE'
#
#             styles = get_bstyles(str(f['seg_id']))
#             bgcolor = styles['bgcolor']
#             bordercolor = styles['bordercolor']
#             borderRadius = styles['borderRadius']
#             link = ''
#
#             if state == 'generate':
#                 create_div(classid, width, height, positionL, positionT, borderRadius, bordercolor, bgcolor)
#             # elif state == 'change':
#             #     updateLayout('paragraphs',str(p['seg_id']), {'x0': positionL, 'y0': positionT, 'x1': float(positionL) + float(width), 'y1': float(positionT) + float(height)})
#
#         '#CREATING BUTTON'
#         px = normalization_aling_text_button()
#         w, h = normalization_size_text_boxes()
#         print('THIS Button: ' + str(ButtonArray))
#         for button in ButtonArray:
#             # location = get_collection_layouts(screenshot_id,str(button['_id']),index)
#             if len(ButtonArray) > 0:
#                 var1 = list(button['level'].keys())[0]
#                 if var1 == 'parent' and str(button['state']) == 'active':
#                     var = list(document['layouts_template'][str(button['_id'])])
#                     x = var[0]
#                     y = var[1]
#
#                 if 'parent' in button['level']:
#                     if button['level']['parent'] == [] or 'child' in button['level'] or button['level'] == []:
#                         print('parent is empty!')
#                         label = str(button['name'])
#                     else:
#                         label = str(button['name'])
#
#                     x0 = float(var[2]) - 2 * (
#                             (float(var[4]) * 10) - ((float(var[3]) - float(var[5])) / 2))
#                     if float(x0) < 10:
#                         x0 = 10
#
#                     if float(x0) > 90:
#                         x0 = 90
#
#                     y0 = float(var[3]) - 2 * ((float(y) * 10) - ((float(var[2]) - float(var[4])) / 2))
#                     if float(y0) < 10:
#                         y0 = 10
#
#                     if float(y0) > 85:
#                         y0 = 85
#
#                     classid = str(button['seg_id'][index:]) + str('L')
#                     d = random.randint(0, 1)
#                     if d == 1:
#                         width = str(w)
#                         height = str(h)
#                     else:
#
#                         width = str(float((float(var[2]) - float(var[4]))))
#
#                         height = str(float((float(var[3]) - float(var[5]))))
#
#                     print('Aquiiii: ' + str(width))
#
#                     positionL = str(float(px))
#                     positionT = str(float(y0))
#
#                     for button2 in ButtonArray:
#                         if str(button['level']['parent']) == str(button2['seg_id']):
#                             if 'child' in button2['level']:
#                                 if str(button2['level']['child']) == str(button['seg_id']):
#                                     label = str(button2['name'])
#
#                                 # Get child info
#                                 fSize = float(button2['location']['y1']) - float(button2['location']['y0'])
#                                 charactesLen = len(str(button2['name']))
#                                 childWidth = str(float(button2['location']['x1']) - float(
#                                     button2['location']['x0']))
#                                 if state == 'generate':
#                                     fSize *= float(getMetrix(userId, 'layoutsHeight')) / 100
#                                     bboxWidth = float(childWidth) * float(
#                                         getMetrix(userId, 'layoutsWidth')) / 100
#                                 elif state == 'change':
#                                     screenH = float(getMetrix(userId, 'screenHeight'))
#                                     screenW = float(getMetrix(userId, 'screenWidth'))
#                                     if screenH == 0.0 or screenW == 0.0:
#                                         screenH = 420
#                                         screenW = 627
#                                     fSize *= screenH / 100
#                                     bboxWidth = float(childWidth) * screenW / 100
#
#                                 lNumber = 1
#
#                                 # Calculate size
#                                 if lNumber >= 1:
#                                     newSize = ''
#                                     if label.islower():
#                                         textWidth = float((float(fSize) * 0.44128) * float(charactesLen))
#                                         checker = float(bboxWidth) / int(charactesLen) / 0.44128
#                                         newSize = float((float(checker) * 0.44128) * float(charactesLen))
#                                     elif label.isupper():
#                                         textWidth = float((float(fSize) * 0.6064) * float(charactesLen))
#                                         checker = float(bboxWidth) / int(charactesLen) / 0.6064
#                                         newSize = float((float(checker) * 0.6064) * float(charactesLen))
#
#                                     elif not label.islower() and not label.isupper():
#                                         textWidth = float((float(fSize) * 0.5289) * float(charactesLen))
#                                         checker = float(bboxWidth) / int(charactesLen) / 0.5289
#                                         newSize = float((float(checker) * 0.5289) * float(charactesLen))
#
#                                 if textWidth >= newSize:
#                                     print('True')
#                                     print(newSize)
#                                     print(fSize)
#                                     fSize = checker
#
#                     fStyles = get_fstyles(str(button['seg_id']))
#                     fontSize = fSize
#                     fontColor = fStyles['fontColor']
#                     textAlign = fStyles['textAlign']
#                     fontFamily = fStyles['fontFamily']
#
#                     styles = get_bstyles(str(button['seg_id']))
#                     bgcolor = styles['bgcolor']
#                     bordercolor = styles['bordercolor']
#                     borderRadius = styles['borderRadius']
#                     link = str(fStyles['link'])
#
#                     if state == 'generate':
#                         create_button(label, classid, width, height, borderRadius, positionL, positionT,
#                                       bgcolor, bordercolor, fontColor, str(fontSize), fontFamily, link)
#                     elif state == 'change':
#                         updateLayout('buttons', str(button['seg_id']),
#                                      {'x0': positionL, 'y0': positionT, 'x1': float(positionL) + float(width),
#                                       'y1': float(positionT) + float(height)})
#
#         '#CREATING HYPERLINK'
#         print('hyperlink: ' + str(hyperLinkArray))
#
#         for h in hyperLinkArray:
#             if len(hyperLinkArray) > 0:
#
#                 classid = str(h['seg_id'][index:]) + str('L')  # button['id']
#                 try:
#                     lNumber = getLineNumbers(str(h['seg_id']))
#                 except:
#                     lNumber = 1
#
#                 text_string = str(h['name'])
#                 width = float(float(h['location']['x1']) - float(h['location']['x0']))
#                 positionL = str(float(h['location']['x0']))
#                 positionT = str(float(h['location']['y0']))
#
#                 fSize = float(h['location']['y1']) - float(h['location']['y0'])
#                 charactesLen = len(str(h['name']))
#                 childWidth = str(float(h['location']['x1']) - float(
#                     h['location']['x0']))
#                 if state == 'generate':
#                     fSize *= float(getMetrix(userId, 'layoutsHeight')) / 100
#                     bboxWidth = float(childWidth) * getMetrix(userId, 'layoutsWidth') / 100
#                 elif state == 'change':
#                     screenH = float(getMetrix(userId, 'screenHeight'))
#                     screenW = float(getMetrix(userId, 'screenWidth'))
#                     if screenH == 0.0 or screenW == 0.0:
#                         screenH = 420
#                         screenW = 627
#                     fSize *= screenH / 100
#                     bboxWidth = float(childWidth) * screenW / 100
#
#                 if lNumber >= 1:
#                     newSize = ''
#                     if text_string.islower():
#                         textWidth = float((float(fSize) * 0.44128) * float(charactesLen))
#                         checker = float(bboxWidth) / int(charactesLen) / 0.44128
#                         newSize = float((float(checker) * 0.44128) * float(charactesLen))
#                     elif text_string.isupper():
#                         textWidth = float((float(fSize) * 0.6064) * float(charactesLen))
#                         checker = float(bboxWidth) / int(charactesLen) / 0.6064
#                         newSize = float((float(checker) * 0.6064) * float(charactesLen))
#
#                     elif not text_string.islower() and not text_string.isupper():
#                         textWidth = float((float(fSize) * 0.5289) * float(charactesLen))
#                         checker = float(bboxWidth) / int(charactesLen) / 0.5289
#                         newSize = float((float(checker) * 0.5289) * float(charactesLen))
#
#                 if textWidth >= newSize:
#                     print('true')
#                     fSize = checker
#
#                 fStyles = get_fstyles(str(h['seg_id']))
#                 fontSize = fSize
#                 fontColor = fStyles['fontColor']
#                 textAlign = fStyles['textAlign']
#                 fontFamily = fStyles['fontFamily']
#                 link = ''
#
#                 if state == 'generate':
#                     create_hyperLink(str(classid), str(text_string),
#                                      positionL, positionT, str(fontSize),
#                                      fontColor, str(width), str(textAlign), fontFamily, link)
#
#                 # elif state == 'change':
#                 # updateLayout('hyperLinks',str(h['seg_id']),{'x0': positionL, 'y0': positionT, 'x1': width, 'y1': float(float(h['location']['y1']) - float(h['location']['y0']))})
#
#         '#CREATING PARAGRAPH'
#         print('paragraph: ' + str(paragraphArray))
#
#         for p in paragraphArray:
#
#             if len(paragraphArray) > 0:
#
#                 d = random.randint(0, 1)
#                 if d == 1:
#                     variable = 1
#                 else:
#
#                     variable = random.uniform(1, 3)
#
#                 try:
#                     lNumber = getLineNumbers(str(p['seg_id']))
#                 except:
#                     lNumber = 1
#
#                 if not insideFrame(screenshot_id, p):
#
#                     var1 = list(p['level'].keys())[0]
#                     if var1 == 'parent' and str(p['state']) == 'active':
#                         var = list(document['layouts_template'][str(p['_id'])])
#                         x = var[0]
#                         y = var[1]
#
#                         print('posicion x L: ' + str(x))
#                         print('posicion y T: ' + str(y))
#
#                     # x0 = float(x) * 10 - float((float(p['location']['x1']) - float(p['location']['x0'])) / 2)
#                     #                    x0 = float(p['location']['x1']) - 2 * (
#                     #                    (float(p['location']['x0']) * 10) - ((float(p['location']['y1']) - float(p['location']['y0'])) / 2))
#                     x0 = float(var[2]) - 2 * (
#                             (float(var[4]) * 10) - ((float(var[3]) - float(var[5])) / 2))
#                     if float(x0) < 10:
#                         x0 = 10
#                     elif float(x0) > 90:
#                         x0 = 90
#
#                     #                    y0 = float(p['location']['y1']) - 2 * (
#                     #                        (float(y) * 10) - ((float(p['location']['x1']) - float(p['location']['x0'])) / 2))
#                     y0 = float(var[3]) - 2 * ((float(y) * 10) - ((float(var[2]) - float(var[4])) / 2))
#                     if float(y0) < 10:
#                         y0 = 10
#                     elif float(y0) > 85:
#                         y0 = 85
#
#                     classid = str(p['seg_id'][index:]) + str('L')  # button['id']
#                     width = str(float((float(var[2]) - float(var[4]))))
#
#                     height = str(float((float(var[3]) - float(var[5]))))
#
#                     positionL = str(float(x0))
#                     positionT = str(float(y0))
#
#                     print('posicion p L: ' + str(positionL))
#                     print('posicion p T: ' + str(positionT))
#
#                     # text_string = pytz.unicode(str(p['name']), errors='replace')
#                     text_string = str(p['name'])
#
#                     text_string = str(text_string.encode('utf-8', errors='ignore').decode('utf-8'))
#
#                     fSize = float((float(var[3]) - float(var[5])))
#                     if state == 'generate':
#                         fSize *= float(getMetrix(userId, 'layoutsHeight')) / 100
#                         bboxWidth = float(width) * float(getMetrix(userId, 'layoutsWidth')) / 100
#                     elif state == 'change':
#                         screenH = float(getMetrix(userId, 'screenHeight'))
#                         if screenH == 0.0:
#                             screenH = 420.0
#                         fSize *= screenH / 100
#                         screenW = float(getMetrix(userId, 'screenWidth'))
#                         if screenW == 0.0:
#                             screenW = 646.0
#                         bboxWidth = float(width) * screenW / 100
#                         charactesLen = len(text_string)
#
#                     if lNumber >= 1:
#                         newSize = ''
#                         if text_string.islower():
#                             textWidth = float((float(fSize) * 0.44128) * float(charactesLen))
#                             checker = float(bboxWidth) / int(charactesLen) / 0.44128
#                             newSize = float((float(checker) * 0.44128) * float(charactesLen))
#                         elif text_string.isupper():
#                             textWidth = float((float(fSize) * 0.6064) * float(charactesLen))
#                             checker = float(bboxWidth) / int(charactesLen) / 0.6064
#                             newSize = float((float(checker) * 0.6064) * float(charactesLen))
#
#                         elif not text_string.islower() and not text_string.isupper():
#                             textWidth = float((float(fSize) * 0.5289) * float(charactesLen))
#                             checker = float(bboxWidth) / int(charactesLen) / 0.5289
#                             newSize = float((float(checker) * 0.5289) * float(charactesLen))
#
#                     if textWidth >= newSize:
#                         fSize = checker
#
#                     fStyles = get_fstyles(str(p['seg_id']))
#                     fontSize = fSize
#                     fontColor = fStyles['fontColor']
#                     textAlign = fStyles['textAlign']
#                     fontFamily = fStyles['fontFamily']
#                     link = ''
#
#                 else:
#                     classid = str(p['seg_id'][1:]) + str('L')  # button['id']
#                     width = float(float(p['location']['x1']) - float(p['location']['x0']))
#                     height = str(float(p['location']['y1']) - float(p['location']['y0']))
#                     # bboxWidth = float(width) * viewWidth / 100
#                     positionL = str(float(p['location']['x0']))
#                     positionT = str(float(p['location']['y0']))
#
#                     # text_string = pytz.unicode(str(p['name']), errors='replace')
#                     text_string = str(p['name'])
#                     print('RRR' + str(text_string))
#
#                     fSize = float(p['location']['y1']) - float(p['location']['y0'])
#                     if state == 'generate':
#                         fSize *= float(getMetrix(userId, 'layoutsHeight')) / 100
#                     elif state == 'change':
#                         screenH = float(getMetrix(userId, 'screenHeight'))
#                         if screenH == 0.0:
#                             screenH = 420
#                         fSize *= screenH / 100
#                     charactesLen = len(text_string)
#                     screenW = float(getMetrix(userId, 'layoutsWidth'))
#                     if screenW == 0.0:
#                         screenW = 646.0
#                     bboxWidth = float(width) * screenW / 100
#                     if lNumber >= 1:
#                         newSize = ''
#                         if text_string.islower():
#                             textWidth = float((float(fSize) * 0.44128) * float(charactesLen))
#                             checker = float(bboxWidth) / int(charactesLen) / 0.44128
#                             newSize = float((float(checker) * 0.44128) * float(charactesLen))
#                         elif text_string.isupper():
#                             textWidth = float((float(fSize) * 0.6064) * float(charactesLen))
#                             checker = float(bboxWidth) / int(charactesLen) / 0.6064
#                             newSize = float((float(checker) * 0.6064) * float(charactesLen))
#
#                         elif not text_string.islower() and not text_string.isupper():
#                             textWidth = float((float(fSize) * 0.5289) * float(charactesLen))
#                             checker = float(bboxWidth) / int(charactesLen) / 0.5289
#                             newSize = float((float(checker) * 0.5289) * float(charactesLen))
#
#                     if textWidth >= newSize:
#                         fSize = checker
#
#                     fStyles = get_fstyles(str(p['seg_id']))
#                     fontSize = fSize
#                     fontColor = fStyles['fontColor']
#                     textAlign = fStyles['textAlign']
#                     fontFamily = fStyles['fontFamily']
#                     link = fStyles['link']
#
#                 if state == 'generate':
#                     create_paragraph(classid, text_string, positionL, positionT, str(fontSize), fontColor, str(width),
#                                      textAlign, height, fontFamily, link)
#                 elif state == 'change':
#                     updateLayout('paragraphs', str(p['seg_id']),
#                                  {'x0': positionL, 'y0': positionT, 'x1': float(positionL) + float(width),
#                                   'y1': float(positionT) + float(height)})
#
#         '#CREATING TEXTBOX'
#         print('textbox: ' + str(textBoxArray))
#         w, h = normalization_size_text_boxes()
#         px = normalization_aling_text_button()
#
#         for t in textBoxArray:
#             print('TextboxArray: ' + str(textBoxArray))
#             if len(textBoxArray) > 0:
#
#                 var1 = list(t['level'].keys())[0]
#                 if var1 == 'parent' and str(t['state']) == 'active':
#                     var = list(document['layouts_template'][str(t['_id'])])
#                     x = var[0]
#                     y = var[1]
#
#                 if 'parent' in t['level']:
#                     if t['level']['parent'] == [] or 'child' in t['level'] or t['level'] == []:
#                         print('parent is empty!')
#                         name = str(t['name'])
#                         placeholder = str(t['name'])
#                     else:
#                         name = str(t['name'])
#                         placeholder = str(t['name'])
#
#                     # Get parent info
#
#                     # x0 = float(x) * 10 - float((float(t['location']['x1']) - float(t['location']['x0'])) / 2)
#                     x0 = float(var[2]) - 2 * (
#                             (float(var[4]) * 10) - ((float(var[3]) - float(var[5])) / 2))
#                     if float(x0) < 10:
#                         x0 = 10
#                     elif float(x0) > 90:
#                         x0 = 90
#
#                         # y0 = float(p['location']['y1']) - 2 * (
#                         #                        (float(y) * 10) - ((float(p['location']['x1']) - float(p['location']['x0'])) / 2))
#                     y0 = float(var[3]) - 2 * ((float(y) * 10) - ((float(var[2]) - float(var[4])) / 2))
#                     if float(y0) < 10:
#                         y0 = 10
#                     elif float(y0) > 85:
#                         y0 = 85
#
#                     classid = str(t['seg_id'][index:]) + str('L')
#                     #                    if float(x0) == 0.0:
#                     #                        width = str(float(
#                     #                            float((float(t['location']['x1']) - float(t['location']['x0'])))))
#                     #                    else:
#                     #                        width = str(float(
#                     #                            float((float(t['location']['x1']) - float(t['location']['x0']))))-float(x0))
#                     #                    height = str(
#                     #                        float((float(t['location']['y1']) - float(t['location']['y0']))))
#                     width = str(w)
#                     height = str(h)
#
#                     print('wwwwww: ' + str(width))
#                     print('hhhhhh: ' + str(height))
#
#                     #                    if float(width) >= float(100):
#                     #                        width = str(90)
#
#                     #                    if float(height) >= 100:
#                     #                        height = str(90)
#
#                     #                    if float(width) <= 0:
#                     #                        width = str(10)
#                     #
#                     #                    if float(height) <= 0:
#                     #                        height = str(10)
#                     positionL = str(float(px))
#                     positionT = str(float(y0))
#
#                     print('wwwwww222: ' + str(width))
#                     print('hhhhhh222: ' + str(height))
#
#                     for t2 in textBoxArray:
#                         if str(t['level']['parent']) == str(t2['seg_id']):
#                             if 'child' in t2['level']:
#
#                                 name = str(t2['name'])
#                                 placeholder = str(t2['name'])
#                                 fSize = float(t2['location']['y1']) - float(t2['location']['y0'])
#                                 charactesLen = len(str(t2['name']))
#                                 childWidth = str(float(t2['location']['x1']) - float(
#                                     t2['location']['x0']))
#
#                                 if state == 'generate':
#                                     fSize *= float(getMetrix(userId, 'layoutsHeight')) / 100
#                                     bboxWidth = float(childWidth) * float(
#                                         getMetrix(userId, 'layoutsWidth') / 100)
#                                 elif state == 'change':
#                                     screenH = float(getMetrix(userId, 'screenHeight'))
#                                     screenW = float(getMetrix(userId, 'screenWidth'))
#                                     if screenH == 0.0 or screenW == 0.0:
#                                         screenH = 420.0
#                                         screenW = 646.0
#                                     fSize *= screenH / 100
#                                     bboxWidth = float(childWidth) * screenW / 100
#
#                                 lNumber = 1
#
#                                 # Calculate size
#                                 if lNumber >= 1:
#                                     newSize = ''
#                                     if placeholder.islower():
#                                         textWidth = float((float(fSize) * 0.44128) * float(charactesLen))
#                                         checker = float(bboxWidth) / int(charactesLen) / 0.44128
#                                         newSize = float((float(checker) * 0.44128) * float(charactesLen))
#                                     elif placeholder.isupper():
#                                         textWidth = float((float(fSize) * 0.6064) * float(charactesLen))
#                                         checker = float(bboxWidth) / int(charactesLen) / 0.6064
#                                         newSize = float((float(checker) * 0.6064) * float(charactesLen))
#
#                                     elif not placeholder.islower() and not placeholder.isupper():
#                                         textWidth = float((float(fSize) * 0.5289) * float(charactesLen))
#                                         checker = float(bboxWidth) / int(charactesLen) / 0.5289
#                                         newSize = float((float(checker) * 0.5289) * float(charactesLen))
#
#                                 if textWidth >= newSize:
#                                     print('true')
#                                     fSize = checker
#
#                                 if str(t2['level']['child']) == str(t['seg_id']):
#                                     name = str(t2['name'])
#                                     placeholder = str(t2['name'])
#                             else:
#                                 name = str(t['name'])
#                                 placeholder = str(t['name'])
#
#                     styles = get_bstyles(str(t['seg_id']))
#                     bgcolor = styles['bgcolor']
#                     bordercolor = styles['bordercolor']
#                     borderRadius = styles['borderRadius']
#
#                     fStyles = get_fstyles(str(t['seg_id']))
#
#                     fontSize = str(fSize)
#                     fontColor = fStyles['fontColor']
#                     textAlign = 0
#                     childOffset = fStyles['textIndent']
#                     fontFamily = fStyles['fontFamily']
#
#                     '# BUTTON STYLE BG, Border..'
#                     if 'style' == 'style':
#                         print('we know: ' + str(height))
#
#                         if state == 'generate':
#                             create_text_box_placeholder(placeholder, name, width, height, str(classid), borderRadius,
#                                                         positionL,
#                                                         str(positionT), str(bgcolor), str(childOffset), str(fontSize),
#                                                         str(fontFamily),
#                                                         str(fontColor), str(textAlign), str(bordercolor))
#
#                         elif state == 'change':
#                             updateLayout('textBoxes', str(t['seg_id']),
#                                          {'x0': positionL, 'y0': positionT, 'x1': float(positionL) + float(width),
#                                           'y1': float(positionT) + float(height)})
#
#         '#CREATING TEXTAREA'
#         print('textbox: ' + str(textAreaArray))
#
#         for t in textAreaArray:
#             print('TextboxArray: ' + str(textAreaArray))
#             if len(textAreaArray) > 0:
#
#                 if 'parent' in t['level']:
#                     if t['level']['parent'] == [] or 'child' in t['level'] or t['level'] == []:
#                         print('parent is empty!')
#                         name = str(t['name'])
#                         placeholder = str(t['name'])
#                     else:
#                         name = str(t['name'])
#                         placeholder = str(t['name'])
#
#                     # Get parent info
#                     classid = str(t['seg_id'][index:]) + str('L')
#                     width = str(float(t['location']['x1']) - float(x0))
#                     height = str(float(t['location']['y1']) - float(y0))
#                     positionL = str(float(t['location']['x0']))
#                     positionT = str(float(t['location']['y0']))
#
#                     for t2 in textAreaArray:
#                         if str(t['level']['parent']) == str(t2['seg_id']):
#                             if 'child' in t2['level']:
#
#                                 name = str(t2['name'])
#                                 placeholder = str(t2['name'])
#                                 fSize = float(t2['location']['y1']) - float(y0)
#                                 charactesLen = len(str(t2['name']))
#                                 childWidth = str(float(t2['location']['x1']) - float(
#                                     t2['location']['x0']))
#
#                                 if state == 'generate':
#                                     fSize *= float(getMetrix(userId, 'layoutsHeight')) / 100
#                                     bboxWidth = float(childWidth) * float(
#                                         getMetrix(userId, 'layoutsHeight') / 100)
#                                 elif state == 'change':
#                                     screenH = float(getMetrix(userId, 'screenHeight'))
#                                     screenW = float(getMetrix(userId, 'screenWidth'))
#                                     if screenH == 0.0 or screenW == 0.0:
#                                         screenH = 420.0
#                                         screenW = 646.0
#                                     fSize *= screenH / 100
#                                     bboxWidth = float(childWidth) * screenW / 100
#
#                                 lNumber = 1
#
#                                 # Calculate size
#                                 if lNumber >= 1:
#                                     newSize = ''
#                                     if placeholder.islower():
#                                         textWidth = float((float(fSize) * 0.44128) * float(charactesLen))
#                                         checker = float(bboxWidth) / int(charactesLen) / 0.44128
#                                         newSize = float((float(checker) * 0.44128) * float(charactesLen))
#                                     elif placeholder.isupper():
#                                         textWidth = float((float(fSize) * 0.6064) * float(charactesLen))
#                                         checker = float(bboxWidth) / int(charactesLen) / 0.6064
#                                         newSize = float((float(checker) * 0.6064) * float(charactesLen))
#
#                                     elif not placeholder.islower() and not placeholder.isupper():
#                                         textWidth = float((float(fSize) * 0.5289) * float(charactesLen))
#                                         checker = float(bboxWidth) / int(charactesLen) / 0.5289
#                                         newSize = float((float(checker) * 0.5289) * float(charactesLen))
#
#                                 ''''###### to be confirmed #####'''
#                                 if textWidth >= newSize:
#                                     print('true')
#                                     fSize = checker
#                                 if str(t2['level']['child']) == str(t['seg_id']):
#                                     name = str(t2['name'])
#                                     placeholder = str(t2['name'])
#                             else:
#                                 name = str(t['name'])
#                                 placeholder = str(t['name'])
#
#                     styles = get_bstyles(classid)
#                     bgcolor = styles['bgcolor']
#                     bordercolor = styles['bordercolor']
#                     borderRadius = styles['borderRadius']
#
#                     fStyles = get_fstyles(str(t['seg_id']))
#
#                     fontSize = fSize
#                     fontColor = fStyles['fontColor']
#                     textAlign = fStyles['textAlign']
#                     childOffset = fStyles['textIndent']
#                     fontFamily = fStyles['fontFamily']
#
#                     '# BUTTON STYLE BG, Border..'
#                     if 'style' == 'style':
#                         if state == 'generate':
#                             create_text_area(placeholder, name, classid, width, height, positionL, str(positionT),
#                                              str(childOffset), str(fontSize), bgcolor, borderRadius, bordercolor,
#                                              fontFamily)
#
#                         elif state == 'change':
#                             updateLayout('textArea', str(t['seg_id']),
#                                          {'x0': positionL, 'y0': positionT, 'x1': float(positionL) + float(width),
#                                           'y1': float(positionT) + float(height)})
#
#         '#CREATING LOGO'
#         print('logo: ' + str(logoArray))
#         for l in logoArray:
#
#             if len(logoArray) > 0:
#
#                 if not insideFrame(screenshot_id, l):
#                     print('id: ' + str(l['_id']))
#                     var1 = list(l['level'].keys())[0]
#
#                     if var1 == 'parent' and str(l['state']) == 'active':
#                         var = list(document['layouts_template'][str(l['_id'])])
#                         x = var[0]
#                         y = var[1]
#
#                     # x0 = float(x) * 10 - float((float(l['location']['x1']) - float(l['location']['x0'])) / 2)
#                     x0 = float(l['location']['x1']) - 2 * (
#                             (float(l['location']['x0']) * 10) - (
#                                 (float(l['location']['y1']) - float(l['location']['y0'])) / 2))
#                     if float(x0) < 0:
#                         x0 = 0
#
#                     y0 = float(l['location']['y1']) - 2 * (
#                             (float(y) * 10) - ((float(l['location']['x1']) - float(l['location']['x0'])) / 2))
#                     if float(y0) < 0:
#                         y0 = 0
#
#                     path = ''
#                     collection = db['segmentation']
#                     cursor = collection.find({})
#                     for document2 in cursor:
#                         if str(document2['_id']) == str(l['seg_id']):
#                             path = document2['elementRoot']
#                     icon_path = path
#                     classid = l['seg_id'][index:] + str('L')
#                     width = str(
#                         float(l['location']['x1']) - float(l['location']['x0']))
#                     height = str(
#                         float(l['location']['y1']) - float(l['location']['y0']))
#                     #                    width = str(float(
#                     #                        float((float(l['location']['x1']) - float(l['location']['x0']))) - float(x0)))
#                     #                    height = str(
#                     #                        float((float(l['location']['y1']) - float(l['location']['y0']))) - float(y0))
#                     positionL = str(float(x0))
#                     positionT = str(float(y0))
#
#                     link = ''
#
#                 else:
#                     path = ''
#                     collection = db['segmentation']
#                     cursor = collection.find({})
#                     for document2 in cursor:
#                         if str(document2['_id']) == str(l['seg_id']):
#                             path = document2['elementRoot']
#                     icon_path = path
#                     classid = l['seg_id'][index:] + str('L')
#                     width = str(
#                         float(l['location']['x1']) - float(l['location']['x0']))
#                     height = str(
#                         float(l['location']['y1']) - float(l['location']['y0']))
#                     positionL = str(float(l['location']['x0']))
#                     positionT = str(float(l['location']['y0']))
#
#                     link = ''
#
#                 if state == 'generate':
#                     create_image(icon_path, classid, width, height, positionL, positionT, link)
#
#                     print('logo: ' + str(logoArray))
#                     for l in logoArray:
#
#                         if len(logoArray) > 0:
#
#                             if not insideFrame(screenshot_id, l):
#                                 print('id: ' + str(l['_id']))
#                                 var1 = list(l['level'].keys())[0]
#
#                                 if var1 == 'parent' and str(l['state']) == 'active':
#                                     var = list(document['layouts_template'][str(l['_id'])])
#                                     x = var[0]
#                                     y = var[1]
#
#                                 # x0 = float(x) * 10 - float((float(l['location']['x1']) - float(l['location']['x0'])) / 2)
#                                 x0 = float(l['location']['x1']) - 2 * (
#                                     (float(l['location']['x0']) * 10) - (
#                                         (float(l['location']['y1']) - float(l['location']['y0'])) / 2))
#                                 if float(x0) < 0:
#                                     x0 = 0
#
#                                 y0 = float(l['location']['y1']) - 2 * (
#                                     (float(y) * 10) - ((float(l['location']['x1']) - float(l['location']['x0'])) / 2))
#                                 if float(y0) < 0:
#                                     y0 = 0
#
#                                 path = ''
#                                 collection = db['segmentation']
#                                 cursor = collection.find({})
#                                 for document2 in cursor:
#                                     if str(document2['_id']) == str(l['seg_id']):
#                                         path = document2['elementRoot']
#                                 icon_path = path
#                                 classid = l['seg_id'][index:] + str('L')
#                                 width = str(
#                                     float(l['location']['x1']) - float(l['location']['x0']))
#                                 height = str(
#                                     float(l['location']['y1']) - float(l['location']['y0']))
#                                 #                    width = str(float(
#                                 #                        float((float(l['location']['x1']) - float(l['location']['x0']))) - float(x0)))
#                                 #                    height = str(
#                                 #                        float((float(l['location']['y1']) - float(l['location']['y0']))) - float(y0))
#                                 positionL = str(float(x0))
#                                 positionT = str(float(y0))
#
#                                 link = ''
#
#                             else:
#                                 path = ''
#                                 collection = db['segmentation']
#                                 cursor = collection.find({})
#                                 for document2 in cursor:
#                                     if str(document2['_id']) == str(l['seg_id']):
#                                         path = document2['elementRoot']
#                                 icon_path = path
#                                 classid = l['seg_id'][index:] + str('L')
#                                 width = str(
#                                     float(l['location']['x1']) - float(l['location']['x0']))
#                                 height = str(
#                                     float(l['location']['y1']) - float(l['location']['y0']))
#                                 positionL = str(float(l['location']['x0']))
#                                 positionT = str(float(l['location']['y0']))
#
#                                 link = ''
#
#                             if state == 'generate':
#                                 create_image(icon_path, classid, width, height, positionL, positionT, link)
#
#
#                 # elif state == 'change':
#                 # updateLayout('paragraphs',str(p['seg_id']), {'x0': positionL, 'y0': positionT, 'x1': float(positionL) + float(width), 'y1': float(positionT) + float(height)})
#         print('logo: ' + str(logoArray))
#         for l in pictureArray:
#
#             if len(pictureArray) > 0:
#
#                 if not insideFrame(screenshot_id, l):
#                     print('id: ' + str(l['_id']))
#                     var1 = list(l['level'].keys())[0]
#
#                     if var1 == 'parent' and str(l['state']) == 'active':
#                         var = list(document['layouts_template'][str(l['_id'])])
#                         x = var[0]
#                         y = var[1]
#
#                     # x0 = float(x) * 10 - float((float(l['location']['x1']) - float(l['location']['x0'])) / 2)
#                     x0 = float(l['location']['x1']) - 2 * (
#                         (float(l['location']['x0']) * 10) - (
#                             (float(l['location']['y1']) - float(l['location']['y0'])) / 2))
#                     if float(x0) < 0:
#                         x0 = 0
#
#                     y0 = float(l['location']['y1']) - 2 * (
#                         (float(y) * 10) - ((float(l['location']['x1']) - float(l['location']['x0'])) / 2))
#                     if float(y0) < 0:
#                         y0 = 0
#
#                     path = ''
#                     collection = db['segmentation']
#                     cursor = collection.find({})
#                     for document2 in cursor:
#                         if str(document2['_id']) == str(l['seg_id']):
#                             path = document2['elementRoot']
#                     icon_path = path
#                     classid = l['seg_id'][index:] + str('L')
#                     width = str(
#                         float(l['location']['x1']) - float(l['location']['x0']))
#                     height = str(
#                         float(l['location']['y1']) - float(l['location']['y0']))
#                     #                    width = str(float(
#                     #                        float((float(l['location']['x1']) - float(l['location']['x0']))) - float(x0)))
#                     #                    height = str(
#                     #                        float((float(l['location']['y1']) - float(l['location']['y0']))) - float(y0))
#                     positionL = str(float(x0))
#                     positionT = str(float(y0))
#
#                     link = ''
#
#                 else:
#                     path = ''
#                     collection = db['segmentation']
#                     cursor = collection.find({})
#                     for document2 in cursor:
#                         if str(document2['_id']) == str(l['seg_id']):
#                             path = document2['elementRoot']
#                     icon_path = path
#                     classid = l['seg_id'][index:] + str('L')
#                     width = str(
#                         float(l['location']['x1']) - float(l['location']['x0']))
#                     height = str(
#                         float(l['location']['y1']) - float(l['location']['y0']))
#                     positionL = str(float(l['location']['x0']))
#                     positionT = str(float(l['location']['y0']))
#
#                     link = ''
#
#                 if state == 'generate':
#                     create_image(icon_path, classid, width, height, positionL, positionT, link)
#         print('logo: ' + str(logoArray))
#         for l in iconArray:
#
#             if len(iconArray) > 0:
#
#                 if not insideFrame(screenshot_id, l):
#                     print('id: ' + str(l['_id']))
#                     var1 = list(l['level'].keys())[0]
#
#                     if var1 == 'parent' and str(l['state']) == 'active':
#                         var = list(document['layouts_template'][str(l['_id'])])
#                         x = var[0]
#                         y = var[1]
#
#                     # x0 = float(x) * 10 - float((float(l['location']['x1']) - float(l['location']['x0'])) / 2)
#                     x0 = float(l['location']['x1']) - 2 * (
#                         (float(l['location']['x0']) * 10) - (
#                             (float(l['location']['y1']) - float(l['location']['y0'])) / 2))
#                     if float(x0) < 0:
#                         x0 = 0
#
#                     y0 = float(l['location']['y1']) - 2 * (
#                         (float(y) * 10) - ((float(l['location']['x1']) - float(l['location']['x0'])) / 2))
#                     if float(y0) < 0:
#                         y0 = 0
#
#                     path = ''
#                     collection = db['segmentation']
#                     cursor = collection.find({})
#                     for document2 in cursor:
#                         if str(document2['_id']) == str(l['seg_id']):
#                             path = document2['elementRoot']
#                     icon_path = path
#                     classid = l['seg_id'][index:] + str('L')
#                     width = str(
#                         float(l['location']['x1']) - float(l['location']['x0']))
#                     height = str(
#                         float(l['location']['y1']) - float(l['location']['y0']))
#                     #                    width = str(float(
#                     #                        float((float(l['location']['x1']) - float(l['location']['x0']))) - float(x0)))
#                     #                    height = str(
#                     #                        float((float(l['location']['y1']) - float(l['location']['y0']))) - float(y0))
#                     positionL = str(float(x0))
#                     positionT = str(float(y0))
#
#                     link = ''
#
#                 else:
#                     path = ''
#                     collection = db['segmentation']
#                     cursor = collection.find({})
#                     for document2 in cursor:
#                         if str(document2['_id']) == str(l['seg_id']):
#                             path = document2['elementRoot']
#                     icon_path = path
#                     classid = l['seg_id'][index:] + str('L')
#                     width = str(
#                         float(l['location']['x1']) - float(l['location']['x0']))
#                     height = str(
#                         float(l['location']['y1']) - float(l['location']['y0']))
#                     positionL = str(float(l['location']['x0']))
#                     positionT = str(float(l['location']['y0']))
#
#                     link = ''
#
#                 if state == 'generate':
#                     create_image(icon_path, classid, width, height, positionL, positionT, link)
#         '#setting background color'
#
#         if state == 'generate':
#             if 1 == 1:
#                 collection = db.backgrounds.find({'screenshot_id': screenshot_id})
#                 for document in collection:
#                     pagecss.write('.' + 'classContainer' + '{background:' + str(
#                         document['background']) + '; height: inherit; }\n')
#
#             close_page_html_end()
#             close_page_css()
#
#     '############################################          END             ##########################################'
#     print('END META')
