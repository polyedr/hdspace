function cancel_overlay_modify(){

    console.log("cancel_overlay_modify()");

    pane.addEventListener("mousedown", onMouseDown);
    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseup", onUp);
    document.getElementById("cancel_move").style.visibility = "hidden";
    document.getElementById("icon-bar").style.visibility = defaultStatus;
    document.getElementById("test").innerHTML = "None selected";
    document.getElementById("title").removeEventListener("click", sidebar);
    document.getElementById("title").classList.remove("drag-resize");
} //created

function checkLocked() {
    $.when(ajaxGetLocked()).done(function(a1){
        for (var i =0; i<result.length; i++){
            var id ='id'+result[i][0];
            if (result[i][1] == true){

                var elmWidth = 33;
                var elmHeight = 24;
                var w = document.getElementById('classContainer-selector').offsetWidth;
                var h = document.getElementById('classContainer-selector').offsetHeight;

                var widthSection = document.getElementById('classContainer-selector').clientWidth;
                var heightSection = document.getElementById('classContainer-selector').clientHeight;

                //document.getElementById('predictions').style.display = 'none';
                var element = document.getElementById(id);
                element.removeAttribute('drag-resize');

                var top = element.offsetTop;
                var left = element.offsetLeft;
                var width = element.offsetWidth;

                var leftWidth = left + width;

                if ((leftWidth + elmWidth) >= w)
                    leftWidth =  w - elmWidth;

                if ((top + elmHeight) >= h)
                    top = h - elmHeight;

                if (top <= 0)
                    top = 0;

                if (leftWidth <= 0)
                    leftWidth = 0;

                top = (top) / heightSection * 100;
                leftWidth = (leftWidth) / widthSection * 100;

                var html =  '<button class="btn btn-default btn-sm" id="unlock_'+id+'" name="unLockAnElement" onclick="unLockElement(\''+id+'\')"' +
                        'style="background-color: #2f4050; position: absolute; top:'+top+'%; left:'+leftWidth+'%;">' +
                            '<span class="fa fa-unlock drag-color"></span>' +
                        '</button>';
                document.getElementById('test').innerHTML = 'None selected';
                document.getElementById('classContainer-selector').innerHTML += html;
            }
        }
    });
    function ajaxGetLocked(){
        return $.ajax({
                type : 'GET',
                url : 'index',
                name : 'getLocked',
                data : {'name':'getLocked'},
                success: function(data){
                    result = data;
                },
                error: function(jqXHR, status, err){
                    console.log(jqXHR.responseText);
                }
            });
    }
}
function checkLockedPro() {
    $.when(ajaxGetLockedPro()).done(function(a1){
        for (var i =0; i<result.length; i++){
            var id ='id'+result[i][0];
            if (result[i][1] === true){

                var elmWidth = 33;
                var elmHeight = 24;
                var w = document.getElementById('classContainer-selectorPro').offsetWidth;
                var h = document.getElementById('classContainer-selectorPro').offsetHeight;

                var widthSection = document.getElementById('classContainer-selectorPro').clientWidth;
                var heightSection = document.getElementById('classContainer-selectorPro').clientHeight;

                //document.getElementById('predictions').style.display = 'none';
                var element = document.getElementById(id);
                element.removeAttribute('drag-resize');

                var top = element.offsetTop;
                var left = element.offsetLeft;
                var width = element.offsetWidth;

                var leftWidth = left + width;

                if ((leftWidth + elmWidth) >= w)
                    leftWidth =  w - elmWidth;

                if ((top + elmHeight) >= h)
                    top = h - elmHeight;

                if (top <= 0)
                    top = 0;

                if (leftWidth <= 0)
                    leftWidth = 0;

                top = (top) / heightSection * 100;
                leftWidth = (leftWidth) / widthSection * 100;

                var html =  '<button class="btn btn-default btn-sm" id="unlock_'+id+'" name="unLockAnElement" onclick="unLockElement(\''+id+'\')"' +
                        'style="background-color: #2f4050; position: absolute; top:'+top+'%; left:'+leftWidth+'%;">' +
                            '<span class="fa fa-unlock drag-color"></span>' +
                        '</button>';
                document.getElementById('test').innerHTML = 'None selected';
                document.getElementById('classContainer-selectorPro').innerHTML += html;
            }
        }
    });
    function ajaxGetLockedPro(){
        return $.ajax({
                type : 'GET',
                url : 'index',
                name : 'getLocked',
                data : {'name':'getLocked'},
                success: function(data){
                    result = data;
                },
                error: function(jqXHR, status, err){
                    console.log(jqXHR.responseText);
                }
            });
    }
}
function changeElement(newElement) {

    window.onkeydown = function (event) {
    if (event.keyCode == 46){
        showPopUpDeleteElement();
    }
};
                var show = $('#test');

                function changeFontSize(clickedEl,fontSize) {
                    document.getElementById("fontsize").value = fontSize;
                }

                function changeColor(clickedEl,color) {
                    document.getElementById(clickedEl).style.color = color;
                }

                console.log(newElement.id);


                $("#favcolor").spectrum("set", getCurColor(newElement));
                // document.getElementById("favcolor").value = getCurColor(newElement);

                clickedEl = newElement.id;
                show.html(clickedEl);
                changeFontSize(clickedEl,getCurFontSize(newElement));
                changeColor(clickedEl,getCurColor(newElement));
                getPredictions(clickedEl);
            }

function load() {
    window.alert('Bhim!');
               $(".se-pre-con").show();
               $(".se-pre-con").fadeOut("slow");

   }

function changeElementt(newElement, type) {

    var show = $('#test');

    function changeFontSize(clickedEl) {
        var x = document.getElementById("fontsize").value;
        var screenWidthPercentage = (document.getElementById("classContainer-selector").offsetWidth)/100;
        var fontvw = (x / screenWidthPercentage) / 2;
        document.getElementById(clickedEl).style.fontSize = fontvw + "vw";
    }

    function changeColor(clickedEl) {
        var x = document.getElementById("favcolor").value;
        document.getElementById(clickedEl).style.color = x;
    }

    console.log(newElement);

    var clickedEl = newElement;
    show.html(clickedEl);
    changeFontSize(clickedEl);
    changeColor(clickedEl);
    getPredictions(clickedEl);
    updateStyle(clickedEl,type)
}
$( "#test1" ).click(function() {
window.alert('hi')
});

function updateStyle(newElement,type){

        var fcolor = document.getElementById('favcolor').value;
        var fontSize = getCurFontSize(document.getElementById(newElement));
        var fFamily = getCurFamily(document.getElementById(newElement));
        var bordercolor = getStyleElement(document.getElementById(newElement),'border-Color');
        var borderRadius = getStyleElement(document.getElementById(newElement),'border-Radius');
        var bgcolor = getStyleElement(document.getElementById(newElement),'background-Color');
        var textAlign = getStyleElement(document.getElementById(newElement),'text-Align');
        var element = document.getElementById(newElement).tagName;
        var textIndent = getStyleElement(document.getElementById(newElement),'text-indent');
        var curname = document.getElementById(newElement).innerHTML;

        if (curname == ''){
            curname = document.getElementById(newElement).placeholder;
        }
        $.ajax({
            type:'GET',
            url: '/index/',
            data: {
                'elemId': newElement,
                'fontColor':fcolor,
                'fontSize':fontSize,
                'fontFamily':fFamily,
                'borderColor':bordercolor,
                'borderRadius':borderRadius,
                'bgcolor':bgcolor,
                'textAlign':textAlign,
                'name': 'updateStyle',
                'currentName': curname,
                'element':element,
                'textIndent':textIndent,
                'type': type
            }
        });
}

function changeFont(newElement,font){
    document.getElementById(newElement).style.fontFamily = font;
    updateStyle(newElement,'fontFamily');
}

function showPopUpDeleteElement() {
    $('#slideelem').popup('show');
}

function showPopUpDeleteWidget() {

    console.log("showPopUpDeleteWidget()");

    $('#slidewidg').popup('show');
}

function deleteElement(newElement){

    if (newElement == 'None selected'){
        console.log('Please select an element first!');
    }
    else {
        var element = document.getElementById(newElement).tagName;
        document.getElementById('test').innerHTML = 'None selected';
        disableTable();
        console.log(document.getElementById('test').innerHTML);
        document.getElementById(newElement).remove();
        document.getElementById('drag-resizeId').blur(true);
        r = $.ajax({
            type: 'GET',
            url: 'index',
            name: 'deleteElement',
            data: {'name': 'deleteElement', 'id': newElement, 'element': element}
        });
        $('#slideelem').popup('hide');
    }
}

function deleteWidget(newElement){

    console.log("deleteWidget(newElement)");

    if (newElement == 'None selected'){
    }
    else {
        var element = "WID";
        document.getElementById('test').innerHTML = 'None selected';
        disableTable();
        document.getElementById(newElement).remove();
        document.getElementById('drag-resizeId').blur(true);
        r = $.ajax({
            type: 'GET',
            url: 'index',
            name: 'deleteElement',
            data: {'name': 'deleteElement', 'id': newElement, 'element': element}
        });
        $('#slidewidg').popup('hide');
    }
} //created

function unLockElement(newElement){
    var id = newElement;
    console.log('I am unlocked: '+id);
    document.getElementById('unlock_'+id).remove();
    var tagName = document.getElementById(newElement).tagName;
    var att = document.createAttribute('drag-resize');
    document.getElementById(id).setAttributeNode(att);
    $.ajax({
        url: '/index/',
        type : 'GET',
        data: {'name': 'lockElement',
                'id': newElement,
                'element': tagName}
        });
}

function lockElement(newElement) {
    if (newElement == 'None selected') {
        console.log('select something first');
    }
    else {

        var elmWidth = 33;
        var elmHeight = 24;
        var w = document.getElementById('classContainer-selector').offsetWidth;
        var h = document.getElementById('classContainer-selector').offsetHeight;

        var widthSection = document.getElementById('classContainer-selector').clientWidth;
        var heightSection = document.getElementById('classContainer-selector').clientHeight;

        var element = document.getElementById(newElement);
        var tagName = element.tagName;
        element.removeAttribute('drag-resize');

        var top = element.offsetTop;
        var left = element.offsetLeft;
        var width = element.offsetWidth;

        var leftWidth = left + width;

        if ((leftWidth + elmWidth) >= w)
            leftWidth =  w - elmWidth;

        if ((top + elmHeight) >= h)
            top = h - elmHeight

        if (top <= 0)
            top = 0;

        if (leftWidth <= 0)
            leftWidth = 0;

        top = (top) / heightSection * 100;
        leftWidth = (leftWidth) / widthSection * 100;

        html = '<button class="btn btn-default btn-sm" id="unlock_' + newElement + '" name="unLockAnElement" onclick="unLockElement(\'' + newElement + '\')"' +
            'style="background-color:#2F4050;position: absolute; top:' + top + '%; left:' + leftWidth + '%;">' +
            '<span class="fa fa-unlock drag-color"></span>' +
            '</button>';

        document.getElementById('test').innerHTML = 'None selected';
        disableTable();
        document.getElementById('classContainer-selector').innerHTML += html;
        document.getElementById('drag-resizeId').blur(true);

        $.ajax({
            url: '/index/',
            type: 'GET',
            data: {
                'name': 'lockElement',
                'id': newElement,
                'element': tagName
            }
        });

    }
}

function changeText(newElement) {
    if (newElement == 'None selected') {
        console.log('select something first');
    }
    else {
        catchIt(newElement);
    }
    function catchIt(newElement) {

        document.getElementById('drag-resizeId').editText = true;
        var obj = document.getElementById(newElement);
        while (obj.nodeType != 1) {//Find the tag or element node of event source
            obj = obj.parentNode;
        }
        var element = document.getElementById(newElement),
        style = window.getComputedStyle(element),
        textAlign = style.getPropertyValue('text-align');

        if (obj.nodeName == 'IMG') return;
        if (obj.nodeName == 'DIV') return;
        var style = obj.style;//Get initial style
        var posi = $(obj).position();//Get position of object
        var width = $(obj).width();
        var height = $(obj).height();
        var fontsize = style.fontSize;
        //Get the current inner HTML
        if (obj.nodeName == 'INPUT' || obj.nodeName == 'TEXTAREA') {
            var x = obj.placeholder;
        }
        else {
            var x = obj.innerHTML;
        }
        var y = document.createElement('TEXTAREA');
        var z = obj.parentNode;
        z.insertBefore(y, obj);//Insert the text area before current object
        $(y).css('position', 'absolute');
        $(y).css('top', posi.top + 'px');
        $(y).css('left', posi.left + 'px');
        $(y).css('width', width + 'px');
        $(y).css('height', height + 'px');
        $(y).css('resize', 'none');
        $(y).css('fontSize', fontsize);
        $(y).css('textAlign', textAlign);
        $(y).css('z-index', '1000');
        console.log(obj.style);
        obj.style.display = "none";//hide the current object
        y.value = x;
        y.focus();
        document.addEventListener("keydown", function (event) {
            if (event.keyCode == 13) {
                $(y).blur();
            }
        });
        $(y).blur(function () {
            saveEdit(obj, y);
            document.getElementById('drag-resizeId').editText = false;
        });
    }
    function saveEdit(obj,textArea) {
        var z = textArea.parentNode;
        var style = window.getComputedStyle(textArea),
        textAlign = style.getPropertyValue('text-align');
        console.log(textAlign);
        $(obj).css('textAlign', textAlign);
        obj.style.display = "block";

        if (obj.nodeName == 'INPUT' || obj.nodeName == 'TEXTAREA') {
            obj.placeholder = textArea.value;
        }
        else {
            obj.innerHTML = textArea.value;
        }

        z.removeChild(textArea);
        updateStyle(newElement, 'name');
    }
}

function getCurFontSize(el) {
    var style = window.getComputedStyle(el, null);
    var fontSize = parseFloat(style.getPropertyValue('font-size'));
    return fontSize;
}

function getCurColor(el) {
    var style = window.getComputedStyle(el, null);
    var color = style.getPropertyValue('color');
    return rgb2hex(color);
}

function getStyleElement(el, styleElement) {
    var style = window.getComputedStyle(el, null);
    var value = style.getPropertyValue(styleElement);
    return value
}

function getCurFamily(el) {
    var style = window.getComputedStyle(el, null);
    var fFamily = style.getPropertyValue('font-family');
    return fFamily;
}

function rgb2hex(rgb){
    rgb = rgb.match(/^rgba?[\s+]?\([\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?/i);
    return (rgb && rgb.length === 4) ? "#" +
      ("0" + parseInt(rgb[1],10).toString(16)).slice(-2) +
      ("0" + parseInt(rgb[2],10).toString(16)).slice(-2) +
      ("0" + parseInt(rgb[3],10).toString(16)).slice(-2) : '';
}
function toggleShowPredictions(id) {

    if (id != 'None selected') {
        if ($("#predictions").is(":visible")) {
            document.getElementById('predictions').style.display = 'none';
            document.getElementById('predictions').innerHTML = '';
        }
        else {
            document.getElementById('predictions').style.display = 'block';
            getPredictions(id);
        }
    }
}

function changeToImage(){
    var id = document.getElementById('test').innerHTML;
}

function changeToElement(){
    var id = document.getElementById('test').innerHTML;
}

function changeToOcr(){
    var id = document.getElementById('test').innerHTML;
}

function changeToElement(){
    var id = document.getElementById('test').innerHTML;
    html ='<form method="POST" name="changeElement" enctype="multipart/form-data">'+
            '<input type="hidden"name="name" value="changeElement"> '+
            '<input type="hidden"name="id" value="'+ id +'"> '+
            '<input type="radio" name="type" value="buttons"> Button<br/>'+
            '<input type="radio" name="type" value="frames"> Div<br/>'+
            '<input type="radio" name="type" value="hyperLinks"> Hyperlink<br/>'+
            '<input type="radio" name="type" value="paragraphs"> Paragraph<br/>'+
            '<input type="radio" name="type" value="pictures"> Image<br/>'+
            '<input type="radio" name="type" value="textArea"> Text-Area<br/>'+
            '<input type="radio" name="type" value="textBoxes"> Text-Input<br/>'+
            '<button name="changeElement" type="submit">Change</button>'+
        '</form>';
    document.getElementById('changeTheElement').innerHTML = html
}

function getPredictions(id){
    $.when(ajaxGetPredictions()).done(function(a1){
        childhtml = ''
        for (var i =0; i<result[3].length; i++){
            childhtml += ' <img src="/'+result[3][i]+'" class="project-people" style="width:25%;text-align: left;" /> '
        }
        console.log(childhtml);
        console.log(result);
        if (result[1] != ''){
            // var x = document.getElementById('drag-resizeId').$.checkPredicition.style;
            // x.display = '';
            //document.getElementById('buttonPredictionId').style.display = '';
            // var html = '<table class="table">' +
            //     '<tr>' +
            //     '<th>Element</th>' +
            //     '<th>Images</th>' +
            //     '<th>OCR Text</th>' +
            //     '<th>Other Element</th>' +
            //     '</tr>' +
            //     '<tr>' +
            //     '<td id="elementTypeId" onclick="changeToElement()">' + result[1] + '</td>' +
            //     '<td onclick="changeToImage()"> ' </td>' +
            //     '<td onclick="changeToOcr()">' + result[2] + '</td>' +
            //     '<td id="changeTheElement"><button onclick="changeToElement()">Change the element</button></td>' +
            //     '</tr>' +
            //     '</table>'
            //class="project-people" style="width:25%;text-align: left;"

            document.getElementById('ocrID').innerHTML = result[2];
            document.getElementById('imgID').innerHTML = '<img src="/' + result[0] + '" class="project-people" style="width:auto; max-width: 100%; max-height:100px; text-align: left;" /> ' + childhtml
            document.getElementById('elementID').innerHTML = result[1];
            document.getElementById('changeElementId').value = document.getElementById('test').innerHTML;

        }
        else {
            document.getElementById('databaseProjects').style.display = 'none';
            document.getElementById('predictionMenuBarGray').style.display = '';
            html = '';
            document.getElementById('changeElementId').value = '';
        }
        //document.getElementById('predictions').innerHTML = html;
    });
    function ajaxGetPredictions(){
        return $.ajax({
                type : 'GET',
                url : 'index',
                name : 'getPredictions',
                data : {'name':'getPredictions','id': id},
                success: function(data){
                    result = data
                },
                error: function(jqXHR, status, err){
                    console.log(jqXHR.responseText);
                }
            })
    }
}

function getAllElements(idName){
    // elementList = document.getElementsByClassName(className);
    // console.log('length of elementlist: ' + elementList.length)
    // for (i =0; i < elementList.length; i++) {
    //     console.log('This is element: '+ elementList[i])
    // }
    var elementList = document.getElementById(idName).querySelectorAll("img,input,p,button");
    console.log('length of elementlist: ' + elementList.length);


    for (index = 0; index < elementList.length; index++) {
        // console.log('This is element: ' + elementList[index].id)
        var elm = document.getElementById(elementList[index].id);
        var style = window.getComputedStyle(elm, null);

        var elementWidth = style.getPropertyValue('width');
        var elementHeight = style.getPropertyValue('height');
        var elementLeft = style.getPropertyValue('left');
        var elementTop = style.getPropertyValue('top');


        var parentWidth = document.getElementById('container-inside-frame').offsetWidth;
        var parentHeight = document.getElementById('container-inside-frame').offsetHeight;
        var elemId = elm.id;

        var width = elementWidth.substring(0, elementWidth.length - 2);
        var height = elementHeight.substring(0, elementHeight.length - 2);

        var percentileWidth = (width * 100 / parentWidth);
        var percentileHeight = (height * 100 / parentHeight);

        var left = elementLeft.substring(0, elementLeft.length - 2);
        var top = elementTop.substring(0, elementTop.length - 2);

        var x0 = left * 100 / parentWidth;
        var y0 = top * 100 / parentHeight;
        var x1 = (parseInt(left) + parseInt(width)) * 100 / parentWidth;
        var y1 = (parseInt(top) + parseInt(height)) * 100 / parentHeight;

        var color = getCurColor(document.getElementById(elemId));
        var fontSize = getCurFontSize(document.getElementById(elemId));
        var fFamily = getCurFamily(document.getElementById(elemId));

        // console.log(x0, x1, y0, y1, percentileWidth, percentileHeight, color, fontSize, fFamily, elemId.substring(2))
        $.ajax({
        url: '/index/',
        data: {'x1': x1,
            'x0': x0,
            'y1': y1,
            'y0': y0,
            'height': percentileHeight,
            'elemId': elemId,
            'width': percentileWidth,
            'color': color,
            'fontSize': fontSize,
            'fontFamily': fFamily,
            'name': 'elementList'}
        });

    }
}

function updatePageName(newElement) {
    if (newElement == 'None selected') {
        console.log('select something first');
    }
    else {
        catchItPage(newElement);
    }
    function catchItPage(newElement) {
        var obj = document.getElementById(newElement);
        while (obj.nodeType != 1) {//Find the tag or element node of event source
            obj = obj.parentNode;
        }

        if (obj.nodeName == 'IMG') return;
        // if (obj.nodeName == 'DIV') return;

        var element = document.getElementById(newElement),
        style = window.getComputedStyle(element);

        // var style = obj.style;//Get initial style
        var posi = $(obj).position();//Get position of object
        var width = $(obj).width();
        var height = $(obj).height();
        var fontsize = style.fontSize;
        var fontFamily = style.fontFamily;
        var fontWeight = style.fontWeight;

        //Get the current inner HTML
        if (obj.nodeName == 'INPUT' || obj.nodeName == 'TEXTAREA') {
            var x = obj.placeholder;
        }
        else {
            var x = obj.innerHTML;
        }
        var y = document.createElement('INPUT');
        var z = obj.parentNode;
        z.insertBefore(y, obj);//Insert the text area before current object
        y.style = style;

        $(y).css('position', 'absolute');
        $(y).css('top', posi['top'] + 'px');
        $(y).css('left', posileft + 'px');
        $(y).css('width', width + 'px');
        $(y).css('height', height + 'px');
        $(y).css('resize', 'none');
        $(y).css('fontSize', fontsize);
        $(y).css('fontFamily', fontFamily);
        $(y).css('fontWeight', fontWeight);

        console.log(obj.style);
        // obj.style.display = "none";//hide the current object
        y.value = x;
        y.focus();
        document.addEventListener("keydown", function (event) {
            if (event.keyCode == 13) {
                $(y).blur();
            }
        });

        $(y).blur(function () {
            saveEditPage(obj, y);
        });
    }
    function saveEditPage(obj,textArea) {
        var z = textArea.parentNode;
        obj.style.display = "block";

        if (obj.nodeName == 'INPUT' || obj.nodeName == 'TEXTAREA') {
            obj.placeholder = textArea.value;
        }
        else {
            obj.innerHTML = textArea.value;
        }

        z.removeChild(textArea);
        $.ajax({
                type : 'POST',
                url : 'index',
                name : 'pageName',
                data : {
                    'pageName': obj.innerHTML,
                    'pageId': newElement
                   },
                success: function(data){
                    result = data
                },
                error: function(jqXHR, status, err){
                    console.log(jqXHR.responseText);
                }
            })
    }
}

function deleteProject(id){
    swal({
        title: 'Do you want to delete this Project?',
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#dd6b55',
        cancelButtonColor: '#999',
        confirmButtonText: 'Yes!',
        cancelButtonText: 'No',
        closeOnConfirm: false
    },function (isConfirm) {
        if (isConfirm) {
        $.ajax({
            type: 'POST',
            url: '/projects/',
            name: 'deleteProject',
            data: {
                'deleteProject': id
            }
        });
        window.location.reload();
    }

    });
}

$(function () {
  $('[data-toggle="tooltip"]').tooltip()
})

function submitForm(){
    $('#submitID').trigger('click');
    loadScreen();
}

function submitFormColor(id){
    document.getElementById('submitFieldColor').value = id;
    document.getElementById('colorTransferSelect').submit();
    loadScreen();
}
function submitFormLayout(id){
    document.getElementById('submitFieldLayout').value = id;
    document.getElementById('layoutTransferSelect').submit();
    loadScreen();
}

function saveMovedScreenshot(){
    var delayInMilliseconds = 100; //1 second

    setTimeout(function() {
        console.log('Save the moved screenshot')
        var divTable = document.getElementById("datatables-example");
        var h4s = divTable.getElementsByTagName("h4");
        var ids = [];
        for(var h = 0; h < h4s.length; h++ ) {
            ids.push(h4s[h].id);
        }
        var json_string = JSON.stringify(ids);
        $.ajax({
            type: 'POST',
            url: '/index/',
            name: 'updateScreenshotOrder',
            data: {
                'updateScreenshotOrder': json_string
            }
        });
    }, delayInMilliseconds);

}

function changeElementTools(state){
    var element = document.getElementById(document.getElementById('test').innerHTML);
    console.log(element);
    switch (state){

//____________________________________________________________________________________________________________________//

        case 'barChartBG':
            document.getElementById("temp_inner").style.background = document.getElementById('editBarchartBackgroundINPUT').value;
            saveCurrentStyles();
            break;

        case 'barChartBar':
            document.getElementById("temp_inner").style.color = document.getElementById('editBarchartBarColoursINPUT').value;
            saveCurrentStyles();
            break;

//____________________________________________________________________________________________________________________//

        case 'background':
            element.style.backgroundColor = document.getElementById('editbackgroundcolor').value;
            saveCurrentStyles();
            break;
        case 'zindex':
            element.style.zIndex = document.getElementById('editzindex').value;
            saveCurrentStyles();
            break;
        case 'bordercolor':
            element.style.border = 'solid 1px';
            element.style.borderColor = document.getElementById('editbordercolor').value;
            saveCurrentStyles();
            break;
        case 'borderradius':
            element.style.borderRadius = document.getElementById('editborderradius').value + 'px';
            saveCurrentStyles();
            break;
        case 'textindent':
            element.style.textIndent = document.getElementById('edittextindent').value;
            saveCurrentStyles();
            break;
        case 'radio1':
            element.style.textAlign = 'left';
            saveCurrentStyles();
            break;
        case 'radio2':
            element.style.textAlign = 'center';
            saveCurrentStyles();
            break;
        case 'radio3':
            element.style.textAlign = 'right';
            saveCurrentStyles();
            break;
    }

}

function removeColor(state){
    console.log(state);
    var id = document.getElementById('test').innerHTML;
    var element = document.getElementById(id);

    if (state == 'backgroundcolor'){
        element.style.backgroundColor = 'transparent';
    }
    if (state == 'bordercolor'){
        element.style.borderColor = 'transparent';
    }

}

function updateBack(){
    var backgroundElm = document.getElementById('backgroundColorChange');
    var color = backgroundElm.value;
    console.log(color);
    document.getElementById('classContainer-selector').style.backgroundColor = color;
    $.ajax({
        type: 'POST',
        url: '/index/',
        name: 'updateBackground',
        data: {
            'name': 'updateBackgroundColor',
            'updateBackgroundColor': color
        }
    });
}

function changeBackground(){
    var backgroundElm = document.getElementById('backgroundColorChange');
    var color = backgroundElm.value;
    console.log('color');
    console.log(color);
    document.getElementById('classContainer-selector').style.backgroundColor = color;
    $.ajax({
        type: 'POST',
        url: '/index/',
        name: 'updateBackground',
        data: {
            'name': 'updateBackground',
            'Color': color
        }
    });
}

function changeBackgroundGradient(colorGradient){
    console.log('colorGradient');
    console.log(colorGradient);
    $.ajax({
        type: 'POST',
        url: '/index/',
        name: 'updateBackgroundG',
        data: {
            'name': 'updateBackgroundG',
            'Color': colorGradient
        }
    });
}

function loadCurBackground(){
    var element = document.getElementById('classContainer-selector');
    var style = window.getComputedStyle(element);

    $("#backgroundColorChange").spectrum("set", rgb2hex(style.getPropertyValue('background-color')));
    // document.getElementById('backgroundColorChange').value = rgb2hex(style.getPropertyValue('background-color'));
}
function setTools(elm) {
    console.log(9999999999);
    console.log(elm);
    if (elm.tagName == 'P' || elm.tagName == 'A') {

//____________________________________________________________________________________________________________________//

        document.getElementById('editBarChartBarColours').style.display = 'none';
        document.getElementById('editBarChartBackground').style.display = 'none';

//____________________________________________________________________________________________________________________//

        document.getElementById('editbackgroundcolor').style.display = 'none';
        document.getElementById('editbordercolor').style.display = 'none';
//        document.getElementById('removeeditbackgroundcolor').style.display = 'none';
        document.getElementById('borderColorMenu').style.display = 'none';
        document.getElementById('editborderradius').style.display = 'none';
        document.getElementById('textEditTools').style.display = '';
        document.getElementById('fontStyleMenu').style.display = '';
        document.getElementById('textAlignId').style.display = 'inline';
    }
    else if (elm.tagName == 'IMG') {

//____________________________________________________________________________________________________________________//

        document.getElementById('editBarChartBarColours').style.display = 'none';
        document.getElementById('editBarChartBackground').style.display = 'none';

//____________________________________________________________________________________________________________________//

        document.getElementById('editbackgroundcolor').style.display = 'none';
        document.getElementById('editbordercolor').style.display = '';
//        document.getElementById('removeeditbackgroundcolor').style.display = 'none';
        document.getElementById('borderColorMenu').style.display = '';
        document.getElementById('editborderradius').style.display = '';
        document.getElementById('textEditTools').style.display = 'none';
        document.getElementById('fontStyleMenu').style.display = 'none';
        document.getElementById('textAlignId').style.display = 'none';
    }
    else if (elm.tagName == 'DIV') {
        if( document.getElementById(elm.id).className == "class" + document.getElementById(elm.id).id.substring(2) + " main widget" ){

//____________________________________________________________________________________________________________________//

            document.getElementById('editBarChartBarColours').style.display = '';
            document.getElementById('editBarChartBackground').style.display = '';

//____________________________________________________________________________________________________________________//

            document.getElementById('editbackgroundcolor').style.display = 'none';
            document.getElementById('editbordercolor').style.display = 'none';
            document.getElementById('borderColorMenu').style.display = 'none';
            document.getElementById('editborderradius').style.display = 'none';
            document.getElementById('textEditTools').style.display = 'none';
            document.getElementById('fontStyleMenu').style.display = 'none';
            document.getElementById('textAlignId').style.display = 'none';
        }else{

//____________________________________________________________________________________________________________________//

            document.getElementById('editBarChartBarColours').style.display = 'none';
            document.getElementById('editBarChartBackground').style.display = 'none';

//____________________________________________________________________________________________________________________//

            document.getElementById('editbackgroundcolor').style.display = 'none';
            document.getElementById('editbordercolor').style.display = 'none';
            document.getElementById('borderColorMenu').style.display = 'none';
            document.getElementById('editborderradius').style.display = 'none';
            document.getElementById('textEditTools').style.display = 'none';
            document.getElementById('fontStyleMenu').style.display = 'none';
            document.getElementById('textAlignId').style.display = 'none';
        }
    }
    else {

//____________________________________________________________________________________________________________________//

        document.getElementById('editBarChartBarColours').style.display = 'none';
        document.getElementById('editBarChartBackground').style.display = 'none';

//____________________________________________________________________________________________________________________//

        document.getElementById('editbackgroundcolor').style.display = '';
        document.getElementById('editbordercolor').style.display = '';
//        document.getElementById('removeeditbackgroundcolor').style.display = '';
        document.getElementById('borderColorMenu').style.display = '';
        document.getElementById('editborderradius').style.display = '';
        document.getElementById('textEditTools').style.display = '';
        document.getElementById('fontStyleMenu').style.display = '';
        document.getElementById('textAlignId').style.display = 'inline';
    }

    if((elm.tagName == 'IMG')||(elm.tagName == 'A')||(elm.tagName == 'P')||(elm.tagName == 'BUTTON')) {
       document.getElementById('changeLink').style.display = '';
    }
    else{
        document.getElementById('changeLink').style.display = 'none';
    }
}
function showAllTools(){

    console.log("showAllTools()");

//____________________________________________________________________________________________________________________//

    document.getElementById('editBarChartBarColours').style.display = '';
    document.getElementById('editBarChartBackground').style.display = '';

//____________________________________________________________________________________________________________________//

    document.getElementById('editbackgroundcolor').style.display = '';
    document.getElementById('editbordercolor').style.display = '';
//    document.getElementById('removeeditbackgroundcolor').style.display = '';
    document.getElementById('borderColorMenu').style.display = '';
    document.getElementById('editborderradius').style.display = '';
    document.getElementById('textEditTools').style.display = '';
    document.getElementById('fontStyleMenu').style.display = '';
    document.getElementById('changeLink').style.display = '';
    enableTable();
}

function getCurrentEditing(){
    var id = document.getElementById('test').innerHTML;
    var element = document.getElementById(id);
    console.log(element);
    var elm = window.getComputedStyle(element, null);
    setTools(element);

    document.getElementById('idForURL').value = document.getElementById('test').innerHTML;
    var backgroundcolor = elm.getPropertyValue('background-color');
    if (backgroundcolor == 'rgba(0, 0, 0, 0)' || backgroundcolor == 'transparent' || backgroundcolor == 'rgba(0,0,0,0)'){
         $("#editbackgroundcolorINPUT").spectrum("set", '');
    }
    else {
        $("#editbackgroundcolorINPUT").spectrum("set", rgb2hex(backgroundcolor));
    }

//____________________________________________________________________________________________________________________//

    // var barBGColor = document.getElementById("temp_inner").style.background;
    //
    // if (barBGColor == 'rgba(0, 0, 0, 0)' || barBGColor == 'transparent' || barBGColor == 'rgba(0,0,0,0)'){
    //     $("#editBarchartBackgroundINPUT").spectrum("set", '');
    // }
    // else {
    //     $("#editBarchartBackgroundINPUT").spectrum("set", rgb2hex(barBGColor));
    // }
    //
    // var barBarColor = document.getElementsByClassName("selection")[0].getAttribute("fill");
    //
    // if (barBarColor == 'rgba(0, 0, 0, 0)' || barBarColor == 'transparent' || barBarColor == 'rgba(0,0,0,0)' || barBarColor == '#777'){
    //     $("#editBarchartBarColoursINPUT").spectrum("set", '');
    // }
    // else {
    //     $("#editBarchartBarColoursINPUT").spectrum("set", barBarColor);
    // }

//____________________________________________________________________________________________________________________//

    if (elm.getPropertyValue('z-index')!='auto') {
            document.getElementById('editzindex').value = elm.getPropertyValue('z-index');
        }

    document.getElementById('edittextindent').value = parseFloat(elm.getPropertyValue('text-indent'),10);
    var bordercolor = elm.getPropertyValue('border-color');
    if (bordercolor == 'rgba(0, 0, 0, 0)' || bordercolor == 'transparent' || bordercolor == 'rgba(0,0,0,0)'){
        $("#editbordercolor").spectrum("set", '');
    }
    else{
        $("#editbordercolor").spectrum("set", rgb2hex(bordercolor));
    }
    // document.getElementById('editbordercolor').value = rgb2hex(elm.getPropertyValue('border-color'));

    document.getElementById('editborderradius').value = parseInt(elm.getPropertyValue('border-radius'),10);

    switch (elm.getPropertyValue('text-align')){
            case 'left':
                document.getElementById('editradio1').checked = true;
                break;
            case 'center':
                document.getElementById('editradio2').checked = true;
                break;
            case 'right':
                document.getElementById('editradio3').checked = true;
                break;
            default:
                document.getElementById('editradio1').checked = true;
        }
    var selectHTML = document.getElementById('optionList');
          console.log(selectHTML);

    if (element.getAttribute('linkvalue') == '' || element.getAttribute('linkvalue') == 'undefined') {
        document.getElementById('idForURL').value = '';
    }
    else{
        try {document.getElementById('idForURL').value = element.getAttribute('linkvalue');
        }
        catch(err) {
            document.getElementById('idForURL').value = '';
        }

    }

    $.when(ajaxGetPages()).done(function(a1) {
        var html = '<li>';
        console.log(pagesResult);
        for (i = 0; i < pagesResult.length; i++) {
            html += "<a onclick='changeUrl(\""+pagesResult[i]+"\")' value=\""+pagesResult[i]+"\">"+pagesResult[i]+"</a>";
            console.log(pagesResult[i]);
        }
        html = html +'</li>';
        selectHTML.innerHTML = html;
    });
    function ajaxGetPages(){
        return $.ajax({
            type : 'GET',
            url : 'index',
            name : 'getPages',
            data : {'name':'getPages'},
            success: function(data){
                pagesResult = data
            },
            error: function(jqXHR, status, err){
                console.log(jqXHR.responseText);
            }
        })
    }
}

function saveCurrentStyles (){
    var values = '';
    var element = document.getElementById(document.getElementById('test').innerHTML);
    var elm = window.getComputedStyle(element);
    var fonSize = document.getElementById("fontsize").value;
    console.log("fonSize");
    console.log(fonSize);
    switch (elm.getPropertyValue('text-align')){
        case 'left':
            values = 'left';
            break;
        case 'center':
            values = 'center';
            break;
        case 'right':
            values = 'right';
            break;
        default:values = 'left';
    }
    console.log(element.id);

    $.ajax({
        type : 'POST',
        url : '/index/',
        name : 'changedStyle',
        data : {'changedStyle': element.id,
                'tagname': element.tagName,
                'background-color': elm.backgroundColor,
                'z-index': document.getElementById('editzindex').value,
                'text-indent': document.getElementById('edittextindent').value,
                'bordercolor': elm.borderColor,
                'borderradius': document.getElementById('editborderradius').value,
                'text-align':values,
                'fontSize': fonSize,

//____________________________________________________________________________________________________________________//

                'barChartBar': document.getElementById('editBarchartBarColoursINPUT').value,
                'barChartBG': document.getElementById('editBarchartBackgroundINPUT').value

//____________________________________________________________________________________________________________________//

        },
        success: function(data){
            result = data;
        },
        error: function(jqXHR, status, err){

        }
    });
};
function goToPageUrl() {
    var id = document.getElementById('test').innerHTML;
    console.log(id);
    var page = document.getElementById(id).getAttribute('linkvalue');
    console.log(page);

    if(!page) {
        e.preventDefault();
        return false;
    }

    if (page.includes("http://")){
        window.location.href = page;
        return false;
    }

    if (page.includes("www.")){
        window.location.href = 'http://'+ page;
        return false;
    }

    console.log('done');
    document.getElementById('pageId').value = page;
};
function changeUrl (url) {
    //var url = document.getElementById('optionList').value;
    document.getElementById('hrefURL').value = url;
    document.getElementById('idForURL').value = document.getElementById('test').innerHTML;
    var id = document.getElementById('test').innerHTML;

    $.ajax({
        type : 'POST',
        url : 'index',
        name : 'updateURL',
        data : {'name':'updateURL',
        'id':id,
        'href': url},
        success: function(data){
            console.log('url updated')
        }
        })
}

function disableTable(){
    $("#editbackgroundcolor").spectrum("hide");
    $("#editbordercolor").spectrum("hide");
    $("#favcolor").spectrum("hide");
    $("#backgroundColorChange").spectrum("hide");

//____________________________________________________________________________________________________________________//

    $("#editBarChartBarColours").spectrum("hide");
    $("#editBarChartBackground").spectrum("hide");
    document.getElementById('editBarChartBarColours').style.display = 'none';
    document.getElementById('editBarChartBackground').style.display = 'none';

//____________________________________________________________________________________________________________________//

    document.getElementById('databaseProjects').style.display = 'none';
    document.getElementById('fontStyleMenu').style.display = 'none';
    document.getElementById('borderColorMenu').style.display = 'none';
    document.getElementById('replaceMenu').style.display = 'none';
    document.getElementById('backgroundTableMenu').style.display = 'none';
    document.getElementById('changeLink').style.display = 'none';
    document.getElementById('saveButton').style.display = 'none';
    document.getElementById('predictionMenuBarGray').style.display = '';
    document.getElementById('elementMenuBarGray').style.display = '';
}

function enableTable() {

    console.log("enableTable()");

//____________________________________________________________________________________________________________________//

    document.getElementById('editBarChartBarColours').style.display = '';
    document.getElementById('editBarChartBackground').style.display = '';

//____________________________________________________________________________________________________________________//

    document.getElementById('databaseProjects').style.display = '';
    document.getElementById('fontStyleMenu').style.display = '';
    document.getElementById('borderColorMenu').style.display = '';
    document.getElementById('replaceMenu').style.display = '';
    document.getElementById('backgroundTableMenu').style.display = '';
    document.getElementById('changeLink').style.display = '';
    document.getElementById('saveButton').style.display = '';
    document.getElementById('predictionMenuBarGray').style.display = 'none';
    document.getElementById('elementMenuBarGray').style.display = 'none';
}
function emptyUpload() {

    // $('#my_popup').popup('show');
    // var x;
    // x = document.getElementById("newscreenname").value;
    // var result = document.getElementById('projectName').innerHTML;
    // if (result === null || result == '') {
    //     console.log('please upload a project');
    // }
    // else
    //     var project = result;
    //     var screen = x;
    //
    //     setTimeout(function() { $("#newscreenname").focus(); }, 100);
    //     document.getElementById('newscreenname').focus();
    //     if (project === null || screen === null) {
    //         return false;
    //     }
    //     else {
    //         if (x == "" || x === null) {
    //             return false;
    //         }
    //         else {
    //             console.log(project, screen);
    //             document.getElementById('filename').innerHTML = screen;
    //             document.getElementById('filename').value = screen;
    //             document.getElementById('uploadNewScreenshotForm').submit();
    //             loadScreen();
    //             $('#my_popup').popup('hide');
    //             var popup = document.getElementById('my_popup_wrapper');
    //             popup.classList.remove('popup_wrapper_visible');
    //             popup.style.visibility = 'hidden';
    //             popup.style.display = 'none';
    //             document.getElementById('my_popup_background').style.opacity = '0';
    //             loadScreen();
    //         }
    //     }
    // loadScreen();
}
function loadScreen() {
    document.getElementById('loadingSubmitPage').style.display = '';
}

function focusInput(id){
    setTimeout(function() { $("#"+id).focus(); }, 100);
    document.getElementById(id).focus();
}

function updateColor(color,state) {
    var hexColor, id, getAllClassContainer, cl, changeColor, getStyle, getAllClassContainerW, i, w, getAllClassContainerP;
    console.log('to Check Uodate color eyeyeyey');
    console.log(color);
    if(color) {
        hexColor = color;
    }
    id = document.getElementById('test').innerHTML;
    console.log('display id');
    console.log(id);
    switch(state){

//____________________________________________________________________________________________________________________//

        case 'barChartBars':
            var bars = document.getElementsByClassName("selection");
            for (var i = 0; i < bars.length; i++) {
                bars[i].setAttribute("fill", hexColor);
            }
            break;

        case 'barChartBG':
            document.getElementById("temp_inner").style.background = hexColor;
            console.log(document.getElementById("barChartBG").style.fill);
            break;

//____________________________________________________________________________________________________________________//

        case 'backgroundElm':
            document.getElementById(id).style.backgroundColor = hexColor;
            document.getElementById(id+'pro').style.backgroundColor = hexColor;
            document.getElementById(id+'work').style.backgroundColor = hexColor;
            break;
        case 'border':
            document.getElementById(id).style.borderColor = hexColor;
            document.getElementById(id+'pro').style.borderColor = hexColor;
            document.getElementById(id+'work').style.borderColor = hexColor;
            break;
        case 'font':
            document.getElementById(id).style.color = hexColor;
            document.getElementById(id+'pro').style.color = hexColor;
            document.getElementById(id+'work').style.color = hexColor;
            break;
        case 'background':
            console.log('to Check Uodate color 11');
            getAllClassContainer = $('#classContainer-selector');
            cl = getAllClassContainer[0].getAttribute('class');
            for (i=0; i<getAllClassContainer.length;i++){
                console.log('display all container');
                console.log(getAllClassContainer);
                console.log('change background color');
                changeColor = getAllClassContainer[i].setAttribute('style', 'background:' + hexColor);
                console.log(changeColor);
                console.log('get style');
                getStyle = getAllClassContainer[i].getAttribute('style');
                console.log(getStyle);
            }
            getAllClassContainerW = document.getElementsByClassName(cl);
            console.log(' MAricona  display all Work container');
            console.log(getAllClassContainerW);

            for (i=0; i<getAllClassContainerW.length;i++){
                w = getAllClassContainerW[i].getAttribute('class');
                if(cl === w)  {
                    console.log('display all container');
                    console.log(getAllClassContainerW);
                    console.log('change background color');
                    changeColor = getAllClassContainerW[i].setAttribute('style', 'background:' + hexColor);
                    console.log(changeColor);
                    console.log('get style');
                    getStyle = getAllClassContainerW[i].getAttribute('style');
                    console.log(getStyle);
                }

            }
            getAllClassContainerP = $('#classContainer-selectorPro');
            for (i=0; i<getAllClassContainerP.length;i++){
                w = getAllClassContainerW[i].getAttribute('class');
                if(cl === w) {
                    console.log('display all Pro-container');
                    console.log(getAllClassContainerP);
                    console.log('change background color');
                    changeColor = getAllClassContainerP[i].setAttribute('style', 'background:' + hexColor);
                    console.log(changeColor);
                    console.log('get style');
                    getStyle = getAllClassContainerP[i].getAttribute('style');
                    console.log(getStyle);
                }
            }
            console.log('to Check Uodate color 22');
            // updatebackground(hexColor);
            break;
    }
}

function updateColorGradient(color,state) {
    var hexColor, id, getAllClassContainer, cl, changeColor, getStyle, getAllClassContainerW, i, w, getAllClassContainerP;
    console.log('Check Color Gradient');
    console.log(color);
    if(color) {
        hexColor = color;
    }
    id = document.getElementById('test').innerHTML;
    console.log('display id in Gradient');
    console.log(id);
    switch(state){
        case 'backgroundElm':
            document.getElementById(id).style.backgroundColor = hexColor;
            document.getElementById(id+'pro').style.backgroundColor = hexColor;
            document.getElementById(id+'work').style.backgroundColor = hexColor;
            break;
        case 'border':
            document.getElementById(id).style.borderColor = hexColor;
            document.getElementById(id+'pro').style.borderColor = hexColor;
            document.getElementById(id+'work').style.borderColor = hexColor;
            break;
        case 'font':
            document.getElementById(id).style.color = hexColor;
            document.getElementById(id+'pro').style.color = hexColor;
            document.getElementById(id+'work').style.color = hexColor;
            break;
        case 'background':
            console.log('Case Background executed');
            getAllClassContainer = $('#classContainer-selector');
            cl = getAllClassContainer[0].getAttribute('class');
            for (i=0; i<getAllClassContainer.length;i++){
                console.log('Collect all Gradient Container');
                console.log(getAllClassContainer);
                console.log('Change color of Gradient Container');
                changeColor = getAllClassContainer[i].setAttribute('style', 'background:' + hexColor);
                console.log(changeColor);
                console.log('Get Style of Gradient Container');
                getStyle = getAllClassContainer[i].getAttribute('style');
                console.log(getStyle);
            }
            getAllClassContainerW = document.getElementsByClassName(cl);
            console.log('Display all Work container');
            console.log(getAllClassContainerW);
            for (i=0; i<getAllClassContainerW.length;i++){
                w = getAllClassContainerW[i].getAttribute('class');
                if(cl === w)  {
                    console.log('display all container');
                    console.log(getAllClassContainerW);
                    console.log('change background color');
                    changeColor = getAllClassContainerW[i].setAttribute('style', 'background:' + hexColor);
                    console.log(changeColor);
                    console.log('get style');
                    getStyle = getAllClassContainerW[i].getAttribute('style');
                    console.log(getStyle);
                }

            }
            getAllClassContainerP = $('#classContainer-selectorPro');
            for (i=0; i<getAllClassContainerP.length;i++){
                w = getAllClassContainerW[i].getAttribute('class');
                if(cl === w) {
                    console.log('display all Pro-container');
                    console.log(getAllClassContainerP);
                    console.log('change background color');
                    changeColor = getAllClassContainerP[i].setAttribute('style', 'background:' + hexColor);
                    console.log(changeColor);
                    console.log('get style');
                    getStyle = getAllClassContainerP[i].getAttribute('style');
                    console.log(getStyle);
                }
            }
            console.log('to Check Uodate color 22');
            // updatebackground(hexColor);
            break;
    }
}

function updatebackground(color){
     $.ajax({
         type: 'POST',
         url: '/index/',
         name: 'update',
         data: {
            'name': 'updateBackgroundColor',
            'Color': color
         }
     });
}


function getAllScreen(){
    return $.ajax({
        type : 'GET',
        url : 'index',
        name : 'getPages',
        data : {'name':'getPages'},
        success: function(data){
            pagesResult = data
        },
        error: function(jqXHR, status, err){
            console.log(jqXHR.responseText);
        }
    })
}

function widgetsCall(elm) {
    if (elm.tagName == 'BUTTON') {
        console.log('this is a button');
        console.log(elm.className);
        if (elm.className == 'maps') {
            console.log('this is a maps');
            setTimeout(function(){
                $('#backgroundTableMenu').attr('style', '');
                document.getElementById('elementMenuBarGray').attr('style', 'width: 100%; height: 5%; position: relative; z-index: 1; left: 0px; top: 0px; visibility: hidden;');
                document.getElementById('editbackgroundcolor').attr('style', 'padding-right: 0px; padding-bottom: 5px; border-right: 1px solid rgb(234, 236, 238); min-width: 86px; padding-left: 0px; text-align: center; visibility: visible;');
                // document.getElementById('editbordercolor').attr('style', 'padding-right: 0px; padding-bottom: 5px; border-right: 1px solid rgb(234, 236, 238); min-width: 86px; padding-left: 0px; text-align: center; visibility: visible;');
                document.getElementById('editbordercolor').style.visibility = 'visible';
                document.getElementById('borderColorMenu').style.visibility = 'visible';
                document.getElementById('editborderradius').style.visibility = 'visible';
                document.getElementById('textEditTools').style.visibility = 'visible';
                document.getElementById('fontStyleMenu').style.visibility = 'visible';
                document.getElementById('textAlignId').style.visibility = 'visible';
            },100);
        }
    }
}