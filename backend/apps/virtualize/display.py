from bs4 import BeautifulSoup
import codecs


def write_into_display_div(username, screenshotName):

    def delete(fullPage):
        soup = BeautifulSoup(fullPage, "html5lib")
        htmlWrong = soup.find_all(attrs={"class": "classContainer"})
        if htmlWrong != None:
            for index in range(len(htmlWrong)):
                htmlWrong[index].replace_with("")
        return soup

    div = "container-inside-frame"

    if (screenshotName != None):
        pagehtml = codecs.open('./static/dirty_static/users/'+username+'/pages/'+screenshotName+'/testing.html', mode='r', encoding='UTF-8')
        html = pagehtml.read()
        pagehtml.close()
    elif (screenshotName == None):
        html = '<section id="classContainer-selector" class="classContainer" style="background-color:black; height:inherit;">\n' \
               '<br/>\n' \
               '<br/>\n' \
               '<h1 style="color: white; text-align:center;"><i class="fa fa-arrow-circle-o-left" aria-hidden="true" ' \
               'style="-ms-transform: rotate(45deg); /* IE 9 */' \
               '    -webkit-transform: rotate(45deg); /* Chrome, Safari, Opera */' \
               '    transform: rotate(45deg);"></i>  Please upload a screenshot first!</h1>\n' \
               '<p style="text-align:center; color: gray">Expand the "Uploads & My pages" tab and upload your very first screenshot!</p>\n' \
               '</section>\n'

    livre = codecs.open('./templates/customize/includes/deviceContainer.html', mode='r', encoding='UTF-8')
    lire = livre
    c = 0
    # section class="classContainer"

    lire = str(delete(lire))

    while c < len(lire):
        if lire[c:c + 22] == div:
            c2 = c + 22
            while c2 < len(lire):
                if lire[c2] == ">":
                    index = c2
                    ecrire = lire[0:index + 1] + html + lire[index + 1:]
                    pagehtml = codecs.open('./templates/customize/includes/deviceContainer.html', mode='w', encoding='UTF-8')
                    pagehtml.write(ecrire)
                    c2 = len(lire) + 1
                c2 = c2 + 1
        c = c + 1


    '''
    header = open('./templates/virtualize/header.html', 'r')
    head = header.read()

   # head = str(delete(head))
    c = 0
    while c < len(head):
        print(head[c:c+17])
        if head[c:c + 17] == "{% static 'users/":
            print('yes')

            c2 = c + 17
            while c2 < len(head):
                if head[c2] == "/":
                    print('done')
                    print(username)
                    index = c2
                    ecrire = head[0:index + 1] + str(username) + lire[index + 1:]
                    pagehtml = open('./templates/virtualize/header.html', 'w')
                    pagehtml.write(ecrire)
                    c2 = len(head) + 1
                c2 = c2 + 1
        c = c + 1
    '''

def write_into_layouts(username, screenshotName):

    def delete(fullPage):
        soup = BeautifulSoup(fullPage, "html5lib")
        htmlWrong = soup.find_all(attrs={"class": "classContainer"})
        if htmlWrong != None:
            for index in range(len(htmlWrong)):
                htmlWrong[index].replace_with("")
        return soup

    div = "container-inside-frame"

    if (screenshotName != None):
        pagehtml = codecs.open('./static/dirty_static/users/'+username+'/pages/'+screenshotName+'/testing.html', mode='r', encoding='UTF-8')
        html = pagehtml.read()
        pagehtml.close()
    elif (screenshotName == None):
        html = '<section id="classContainer-selector" class="classContainer" style="background-color:black; height:inherit;">\n' \
               '<br/>\n' \
               '<br/>\n' \
               '<h1 style="color: white; text-align:center;"><i class="fa fa-arrow-circle-o-left" aria-hidden="true" ' \
               'style="-ms-transform: rotate(45deg); /* IE 9 */' \
               '    -webkit-transform: rotate(45deg); /* Chrome, Safari, Opera */' \
               '    transform: rotate(45deg);"></i>  Please upload a screenshot first!</h1>\n' \
               '<p style="text-align:center; color: gray">Expand the "Uploads & My pages" tab and upload your very first screenshot!</p>\n' \
               '</section>\n'

    livre = codecs.open('./templates/customize/includes/deviceContainer.html', mode='r', encoding='UTF-8')
    lire = livre
    c = 0
    # section class="classContainer"

    lire = str(delete(lire))

    while c < len(lire):
        if lire[c:c + 22] == div:
            c2 = c + 22
            while c2 < len(lire):
                if lire[c2] == ">":
                    index = c2
                    ecrire = lire[0:index + 1] + html + lire[index + 1:]
                    pagehtml = codecs.open('./templates/customize/includes/deviceContainer.html', mode='w', encoding='UTF-8')
                    pagehtml.write(ecrire)
                    c2 = len(lire) + 1
                c2 = c2 + 1
        c = c + 1
    '''
    header = open('./templates/virtualize/header.html', 'r')
    head = header.read()

   # head = str(delete(head))
    c = 0
    while c < len(head):
        print(head[c:c+17])
        if head[c:c + 17] == "{% static 'users/":
            print('yes')

            c2 = c + 17
            while c2 < len(head):
                if head[c2] == "/":
                    print('done')
                    print(username)
                    index = c2
                    ecrire = head[0:index + 1] + str(username) + lire[index + 1:]
                    pagehtml = open('./templates/virtualize/header.html', 'w')
                    pagehtml.write(ecrire)
                    c2 = len(head) + 1
                c2 = c2 + 1
        c = c + 1
    '''

def set_html_color(file, index, value):

    div = "colorTransfer"+str(index)
    pagehtml = codecs.open('./static/dirty_static/users/' + file +'/testing.html', mode='r', encoding='UTF-8')
    html = pagehtml.read()
    pagehtml.close()

    result = '\n<li class="cTransfer" id="'+div+'" onclick="submitFormColor(\''+value+'\')"'\
             +'style="width:100%; height:-webkit-fill-available; margin-bottom:5%; position:relative; margin-left:0px;">'\
             + html\
             + '</li>\n'
    return result

def write_into_colortransfer(newHtml):

    def delete(fullPage):
        soup = BeautifulSoup(fullPage, "html5lib")
        htmlWrong = soup.find_all(attrs={"class": "colortransfersection"})
        if htmlWrong != None:
            for index in range(len(htmlWrong)):
                htmlWrong[index].replace_with("")
        return soup

    div = "colorTransfersortable"

    livre = codecs.open('./templates/customize/includes/colorTransfer.html', mode='r', encoding='UTF-8')
    lire = livre
    c = 0
    # section class="classContainer"

    lire = str(delete(lire))

    while c < len(lire):
        if lire[c:c + 21] == div:
            c2 = c + 21
            while c2 < len(lire):
                if lire[c2] == ">":
                    index = c2
                    ecrire = lire[0:index + 1] + newHtml + lire[index + 1:]
                    pagehtml = codecs.open('./templates/customize/includes/colorTransfer.html', mode='w', encoding='UTF-8')
                    pagehtml.write(ecrire)
                    c2 = len(lire) + 1
                c2 = c2 + 1
        c = c + 1
    print(newHtml)
    '''
    header = open('./templates/virtualize/header.html', 'r')
    head = header.read()

   # head = str(delete(head))
    c = 0
    while c < len(head):
        print(head[c:c+17])
        if head[c:c + 17] == "{% static 'users/":
            print('yes')

            c2 = c + 17
            while c2 < len(head):
                if head[c2] == "/":
                    print('done')
                    print(username)
                    index = c2
                    ecrire = head[0:index + 1] + str(username) + lire[index + 1:]
                    pagehtml = open('./templates/virtualize/header.html', 'w')
                    pagehtml.write(ecrire)
                    c2 = len(head) + 1
                c2 = c2 + 1
        c = c + 1
    '''

def set_html_layout(file, index, value):
    div = "layoutTransfer" + str(index)
    pagehtml = codecs.open('./static/dirty_static/users/' + file[:-4] + '/layouts/testing'+str(index)+'.html', mode='r', encoding='UTF-8')
    html = pagehtml.read()
    pagehtml.close()

    result = '\n<li class="lTransfer" id="' + div + '" onclick="submitFormLayout(\'' + str(value) + '\')"' \
                 + 'style="width:100%; height:-webkit-fill-available; margin-bottom:5%; position:relative; margin-left:0px;">' \
                 + html \
                 + '</li>\n'
    return result

