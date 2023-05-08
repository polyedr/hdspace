/*elementMenu.html script*/

function popupImageCropBox() {
    $('#imageCrop').popup({escape: false, blur: false, autoopen: true});
}

$(function() {
    $("#changeURL").submit(function(event) {
    event.preventDefault();
    var thisform = $(this);
    var posting = $.post( thisform.attr('action'), thisform.serialize() );
    var element = document.getElementById('test').innerHTML;
    document.getElementById(element).setAttribute("linkvalue", document.getElementById('hrefURL').value);
    console.log('Link: '+document.getElementById('hrefURL').value);
    posting.done(function(data) {
    });
    posting.fail(function(data) {console.log('failed')});
    });
});

/* screenshotSelector.html script */

/**
 * Sends a request to delete the screenshot matching a given id
 * @param id - the id (_id) of the screenshot to delete
 */
function delTrigger(id) {
    swal({
        title: 'Do you want to delete this Screenshot?',
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#dd6b55',
        cancelButtonColor: '#999',
        confirmButtonText: 'Yes!',
        cancelButtonText: 'No',
        closeOnConfirm: false
    },function (isConfirm) {
        //do this when confirm button is clicked
        if (isConfirm) {
            deletePage(id);
            swal.close();
        }
    });
}

$(document).ready(function () {
    var  screenCount = $('#datatables-example').find('h4').length;
    var tblwidth= 137.50*screenCount;
    document.getElementById('datatables-example').style= "width:" + tblwidth + "px; margin-bottom:0;";

    /* elementMenu.html script */

$("#editBarchartBarColoursINPUT").spectrum({
    preferredFormat: "rgb",
    showInitial: true,
    showInput: true,
    allowEmpty: true,
    move: function (color) {
        updateColor(color,'barChartBars');
    },
    hide: function (color) {
        updateColor(color,'barChartBars');
    }
});

$("#editBarchartBackgroundINPUT").spectrum({
    preferredFormat: "rgb",
    showInitial: true,
    showInput: true,
    allowEmpty: true,
    move: function (color) {
        updateColor(color,'barChartBG');
    },
    hide: function (color) {
        updateColor(color,'barChartBG');
    }
});

$("#editbackgroundcolorINPUT").spectrum({
    preferredFormat: "rgb",
    showInitial: true,
    showInput: true,
    allowEmpty: true,
    move: function (color) {
        updateColor(color,'backgroundElm');
    },
    hide: function (color) {
        updateColor(color,'backgroundElm');
    }
});
$("#editbordercolor").spectrum({
    allowEmpty: true,
    preferredFormat: "rgb",
    showInitial: true,
    showInput: true,
    move: function (color) {
        updateColor(color,'border');
    },
    hide: function (color) {
        updateColor(color,'border');
    }
});
$("#favcolor").spectrum({
    preferredFormat: "rgb",
    showInitial: true,
    showInput: true,
    move: function (color) {
        updateColor(color,'font');
    },
    hide: function (color) {
        updateColor(color,'font');
    }
});
});

 function deletePage(id) {
    $.ajax({
        type: 'POST',
        url: '/index/',
        name: 'deleteScreen',
        data: {
            'deleteScreen': id
        },
        success: function (data) {
            var result = data;
            console.log(result);
        },
        error: function (jqXHR, status, err) {
            console.log(jqXHR.responseText);
        }
    });
    // document.getElementById('loadingSubmitPage').style.display = '';
    $('#loadingSubmitPage').css("display","");
    location.reload();
}

/* wrapperHeader.html script */

 function popupAddElement(){
    //Top navbar; change style
    // $("#changeZ-index").attr('style', 'z-index : 10000000');
    //Popup id="suggestionBox" HTML. It will autoopen. On escape key or blur the popup will close.
    $('#suggestionBox').popup({escape: true, blur: true, autoopen: true});
    $('#searchSuggestionResultT').removeClass('hidden');
 }

 function popupSuggestionBox() {
    var getValue, noZero = 0;
    //Top navbar; change tyle
    // $("#changeZ-index").attr('style', 'z-index : 10000000');
    //Popup this html when this function is triggered
    $('#suggestionBox').popup({escape: false, blur: false, autoopen: true});
    $('#searchSuggestionResultT').removeClass('hidden');
    // Gets the string entered into the search box
    getValue = document.getElementById('top-search').value;
    console.log("value attr = " + getValue);
    //When nothing is in the search box; Hide all popup content
    if (getValue.length === noZero){
        $('#suggestionBox').popup('hide');
        intervalLoopSBClear();
        $("#changeZ-index").attr('style', 'z-index : 1;margin:0;');
        $('#searchSuggestionResultT').addClass('hidden');
        $('#widgetsHidderT').attr('style', 'visibility: hidden;height: auto;');
        $('#screensHidderT').attr('style', 'visibility: hidden;height: auto;');
        $('#approveButtonT').attr('style', 'padding: 0;padding-top: 10px;visibility: hidden;');
        document.getElementById('top-search').onblur = function () {
            var blurEl = this;
            blurEl.blur();
        };
    }
    else {
        intervalLoopSB();
        console.log('searching_widgets value');
        console.log(getValue);
        searching_widgetsT(getValue);
    }
    if($('.checkIconDeselect').css('visibility') === 'hidden'){
        $('#approveButtonT').attr('style', 'padding: 0;padding-top: 10px;visibility: hidden;');
    }
    else{
        $('#approveButtonT').attr('style', 'padding: 0;padding-top: 10px;visibility: visible;');
    }
}
function intervalLoopSB(){
    var internal, timesRun = 0, noOfTimes;
    console.log('interval function SB');
    internal = setInterval(function(){
        timesRun += 1;
        noOfTimes = 50;
        $('#suggestionBox_background').attr('style', 'opacity: 0.95;visibility: visible;background-color: rgb(0, 0, 0);position: fixed;top: 0px;right: 0px;bottom: 0px;left: 0px;z-index: 100000;');
        $('#suggestionBox_wrapper').attr('style', 'opacity: 1; visibility: visible; position: fixed; overflow: auto; z-index: 100001; width: 100%; height: 100%; top: 0px; left: 0px; text-align: center;');
        $('#TopSearch_Box').attr('style', 'width: 653px;height: 245px;background-color: #f3f3f4;\n' +
            '                border-top-style: none;top: 52px;\n' +
            '                left: 220px;\n' +
            '                position: fixed;padding: 0;');
        console.log('interval timer SB');
        document.getElementById('top-search').onblur = function () {
            var blurEl = this;
            blurEl.focus();
        };
        if(timesRun === noOfTimes){
            clearInterval(internal);
            console.log('interval function else SB')
        }
    },1);
}
function intervalLoopSBClear(){
    var internal, timesRun = 0, noOfTimes;
    console.log('interval function SB Clear');
    internal = setInterval(function(){
        timesRun += 1;
        noOfTimes = 10;
        $('#suggestionBox_background').attr('style', 'opacity: 0.95;visibility: hidden;background-color: rgb(0, 0, 0);position: fixed;top: 0px;right: 0px;bottom: 0px;left: 0px;z-index: 100000;');
        $('#suggestionBox_wrapper').attr('style', 'opacity: 1; visibility: hidden; position: fixed; overflow: auto; z-index: 100001; width: 100%; height: 100%; top: 0px; left: 0px; text-align: center;');
        $('#TopSearch_Box').attr('style', 'width: 653px;height: 245px;background-color: #f3f3f4;\n' +
            '                border-top-style: none;top: 52px;\n' +
            '                left: 220px;\n' +
            '                position: fixed;padding: 0;visibility:hidden;');
        console.log('interval timer SB Clear');
        if(timesRun === noOfTimes){
            clearInterval(internal);
            console.log('interval function else SB Clear')
        }
    },1);
}

// Open close right sidebar
function toggleSideMenuOn(){
    $('#right-sidebar').addClass('sidebar-open');
    $('#toggle-sideMenu').attr('onclick', 'toggleSideMenuOff()');
    setTimeout(function () {
        $('#toggle-sideMenu').attr('id', 'toggle-sideMenu-off');
    }, 100);
}

function toggleSideMenuOff(){
    console.log('this is clicked');
    $('#right-sidebar').removeClass('sidebar-open');
    $('#toggle-sideMenu-off').attr('onclick', 'toggleSideMenuOn()');
    setTimeout(function(){
        $('#toggle-sideMenu-off').attr('id', 'toggle-sideMenu');
    },100);
}

$(document).ready(function () {
    var  screenCount = $('#datatables-example').find('h4').length;
    var tblwidth= 137.50*screenCount;
    document.getElementById('datatables-example').style= "width:" + tblwidth + "px; margin-bottom:0;";

    // color changer for  lblue list
        $("#dropdown-lblue").on("shown.bs.dropdown", function(event){
            $("#cmt-lblue").css("color", "#337ab7");
        });
        $("#dropdown-lblue").on("hidden.bs.dropdown", function(event){
            $("#cmt-lblue").css("color", "#c1c1c1");
        });
        //color change for oragne list
        $("#dropdown-orange").on("shown.bs.dropdown", function(event){
            $("#cmt-orange").css("color", "#fea840");
        });
         $("#dropdown-orange").on("hidden.bs.dropdown", function(event){
            $("#cmt-orange").css("color", "#c1c1c1");
        });
        //color change for blue  list
         $("#dropdown-blue").on("shown.bs.dropdown", function(event){
            $("#cmt-blue").css("color", "blue ");
        });
         $("#dropdown-blue").on("hidden.bs.dropdown", function(event){
            $("#cmt-blue").css("color", "#c1c1c1");
        });
         //color change for purple  list
         $("#dropdown-purple").on("shown.bs.dropdown", function(event){
            $("#cmt-purple").css("color", "purple ");
        });
         $("#dropdown-purple").on("hidden.bs.dropdown", function(event){
            $("#cmt-purple").css("color", "#c1c1c1");
        });
        // color changer for  green list
        $("#dropdown-green").on("shown.bs.dropdown", function(event){
            $("#cmt-green").css("color", "#18a689");
        });
        $("#dropdown-green").on("hidden.bs.dropdown", function(event){
            $("#cmt-green").css("color", "#c1c1c1");
        });
        //color change for red  list
         $("#dropdown-red").on("shown.bs.dropdown", function(event){
            $("#cmt-red").css("color", "rgb(221, 107, 85)");
        });
         $("#dropdown-red").on("hidden.bs.dropdown", function(event){
            $("#cmt-red").css("color", "#c1c1c1");
        });

});


/* workflowindex. html script */



/* pagesMenu.html script */

 //This function is for displaying current background color from device container current Screen in Color Selector
window.onload = function(){
    $.ajax({
        type: 'GET',
        url: '/index/',
        name: 'getBackgroundImageGradient',
        data: {
            'name': 'getBackgroundImageGradient'
        },
        success: function(data){
            console.log('data gradient');
            console.log(data);
            console.log(data.length);
            if (data.length > 16){
                $(".grp-preview").attr("style", "background:" + data);
            } else {
                $(".grp-preview").attr("style", "background: linear-gradient(to right, " + data + " 20%, " + data + " 75%);");
            }

            $("#gradientColorpicker").spectrum("set", data);
        },
        error: function(jqXHR, status, err){
            console.log(jqXHR.responseText);
        }
    });
}

var selectedWidget, selectedGraphics;
     function popupWidgetSelector(){
         $(document).ready(function (){
             $('#Widgetselectorbox').attr('style', 'display: " "');
             $('#WidgetSelectorBox').popup({ escape: false, blur: false, autoopen: true });
             $('#GraphicsSelectorBox').popup('hide');
         });
     }
     function cancelWidgetPopUp(){
         $('#WidgetSelectorBox').popup('hide');
         $('.checkIconDeselectWidget').attr('style', 'top:0;position:absolute;visibility:hidden');
         $('.checkIconSelectedWidget').attr('style', 'position: absolute;width: 20px;height: 20px;z-index: 10000;left: 50%;top: 50%;transform: translate(240%,-50%);background-color: #b5b4b4;border-radius: 50%;cursor:pointer;visibility:visible');
         $('.imageWidget').attr('style', 'max-height: 136px; max-width: 100px; margin: 0;opacity:1;border: 1px solid #c1c1c159;width: 100%;height: auto;');
         $('#optionToAddWidget').addClass('hidden');
         $('.currentlyChecked').removeClass('hidden currentlyChecked');
     }
     function addWidgets(data) {
         var name ='';
         var value ='';

         name = data[0].name;
         value = '8';
         console.log({value, name});
        // var replaceWidPath, getWidName;
        // replaceWidPath = selectedWidget.replace('/static/dirty_static/widgets/', '');
        // getWidName = replaceWidPath.replace('.jpg', '');
        // console.log("selectedWidget");
        // console.log(selectedWidget);
        // console.log(getWidName);
        addNewElementAjax(value, name);
        // $('#suggestionBox').popup({escape: true, blur: true, autoopen: true});
        $('#suggestionBox').popup('hide');
     }
     // Graphics popup
     function popupGraphicsSelector(){
         $(document).ready(function (){
             $('#GraphicsSelectorBox').attr('style', 'display: " "');
             $('#GraphicsSelectorBox').popup({ opacity: 0.95, transition: 'all 0.3s', escape: false, blur: false, autoopen: true });
             $('#WidgetSelectorBox').popup('hide');
         });
     }
     function cancelGraphicsPopUp(){
         $('#GraphicsSelectorBox').popup('hide');
         $('.checkIconDeselectGraphics').attr('style', 'top:0;position:absolute;visibility:hidden');
         $('.checkIconSelectedGraphics').attr('style', 'position: absolute;width: 20px;height: 20px;z-index: 10000;left: 50%;top: 50%;transform: translate(240%,-50%);background-color: #b5b4b4;border-radius: 50%;cursor:pointer;visibility:visible');
         $('.imageGraphics').attr('style', 'max-height: 136px; max-width: 100px; margin: 0;opacity:1;border: 1px solid #c1c1c159;width: 100%;height: auto;');
         $('#optionToAddGraphics').addClass('hidden');
         $('.currentlyChecked').removeClass('hidden currentlyChecked');
     }
     function addGraphics(value){
         console.log("addGraphics");
         console.log(selectedGraphics);
         console.log(value);
     }

    $('.checkIconSelectedWidget').on('click', function (e) {
        var target,findAllStatOfCheck,findAllStatOfUncheck,findAllImage,identifyCurrentScreen,identifyImageOutlined,checkedInnerHTML;
        var imgOutlineCheck,i;
        target = $(e.target);
        console.log("target start");
        console.log(target);
         $('td').removeClass('currentlyChecked');
         $('.imageWidget').removeClass('currentlySelected');
        setTimeout(function() {
             target.parents('td').eq(1).addClass('currentlyChecked');
             target.closest('td').find('.checkIconSelectedWidget').attr('style', 'top:0;position:absolute;visibility:hidden');
             target.closest('td').find('img').attr('style', 'max-height: 136px; max-width: 100px; margin: 0;opacity:0.5;border: 2px solid blue;width: 100%;height: auto;');
             target.closest('td').find('.checkIconDeselectWidget').attr('style', 'position: absolute;width: 20px;height: 20px;z-index: 10000;left: 50%;top: 50%;transform: translate(240%,-50%);background-color: #b5b4b400;border-radius: 50%;cursor:pointer;visibility:visible');
            $('#optionToAddWidget').removeClass('hidden');
        },10);

// Toggle between the screen
findAllStatOfCheck = $('#datatables-example-widget').find('.checkIconDeselectWidget');
findAllStatOfUncheck = $('#datatables-example-widget').find('.checkIconSelectedWidget');
findAllImage = $('#datatables-example-widget').find('.imageWidget');
console.log('I am checking if already screen is checked @ master');
for(i = 0;i < findAllStatOfCheck.length;i++) {
    console.log('Displaying all found checked screen');
    identifyCurrentScreen = findAllStatOfCheck[i].getAttribute('style');
    identifyImageOutlined = findAllImage[i].getAttribute('style');
    checkedInnerHTML = 'position: absolute;width: 20px;height: 20px;z-index: 10000;left: 50%;top: 50%;transform: translate(240%,-50%);background-color: #b5b4b400;border-radius: 50%;cursor:pointer;visibility:visible';
    if (identifyCurrentScreen === checkedInnerHTML){
        console.log('There is a checked master screen already, Change CSS');
        findAllStatOfCheck[i].setAttribute('style', 'top:0;position:absolute;visibility:hidden');
        findAllStatOfUncheck[i].setAttribute('style', 'position: absolute;width: 20px;height: 20px;z-index: 10000;left: 50%;top: 50%;transform: translate(240%,-50%);background-color: #b5b4b4;border-radius: 50%;cursor:pointer;visibility:visible');
        imgOutlineCheck = 'max-height: 136px; max-width: 100px; margin: 0;opacity:0.5;border: 2px solid blue;width: 100%;height: auto;';
        if (identifyImageOutlined === imgOutlineCheck){
            findAllImage[i].setAttribute('style', 'max-height: 136px; max-width: 100px; margin: 0;opacity:1;border: 1px solid #c1c1c159;width: 100%;height: auto;');
        }
    }
}

    console.log("target widget end");
    selectedWidget = target.closest('td').find('img').attr('src');
    console.log(selectedWidget);
});
$('.checkIconDeselectWidget').on('click', function (e) {
    var target;
    target = $(e.target);
    target.parents('td').eq(1).removeClass('currentlyChecked');
    target.closest('td').find('.checkIconDeselectWidget').attr('style', 'top:0;position:absolute;visibility:hidden');
    target.closest('td').find('img').attr('style', 'max-height: 136px; max-width: 100px; margin: 0;opacity:1;border: 1px solid #c1c1c159;width: 100%;height: auto;');
    target.closest('td').find('.checkIconSelectedWidget').attr('style', 'position: absolute;width: 20px;height: 20px;z-index: 10000;left: 50%;top: 50%;transform: translate(240%,-50%);background-color: #b5b4b4;border-radius: 50%;cursor:pointer;visibility:visible');
    $('#optionToAddWidget').addClass('hidden');
});

$('.checkIconSelectedGraphics').on('click', function (e) {
    var target,i,findAllStatOfCheck,findAllStatOfUncheck,findAllGraphics,identifyCurrentGraphics,identifyGraphicsOutlined,gidOutlineCheck;
    var checkedInnerHTML;
    target = $(e.target);
    console.log("target");
    console.log(target);
     $('td').removeClass('currentlyChecked');
    setTimeout(function() {
         target.parents('td').eq(1).addClass('currentlyChecked');
         target.closest('td').find('.checkIconSelectedGraphics').attr('style', 'top:0;position:absolute;visibility:hidden');
         target.closest('td').find('img').attr('style', 'max-height: 136px; max-width: 100px; margin: 0;opacity:0.5;border: 2px solid blue;width: 100%;height: auto;');
         target.closest('td').find('.checkIconDeselectGraphics').attr('style', 'position: absolute;width: 20px;height: 20px;z-index: 10000;left: 50%;top: 50%;transform: translate(240%,-50%);background-color: #b5b4b400;border-radius: 50%;cursor:pointer;visibility:visible');
        $('#optionToAddGraphics').removeClass('hidden');
    },50);
     // Toggle between the screen
    findAllStatOfCheck = $('#datatables-example-graphics').find('.checkIconDeselectGraphics');
    findAllStatOfUncheck = $('#datatables-example-graphics').find('.checkIconSelectedGraphics');
    findAllGraphics = $('#datatables-example-graphics').find('.imageGraphics');
    console.log("length");
    console.log(findAllStatOfCheck.length);
    for(i = 0;i < findAllStatOfCheck.length;i++) {
        identifyCurrentGraphics = findAllStatOfCheck[i].getAttribute('style');
        identifyGraphicsOutlined = findAllGraphics[i].getAttribute('style');
        checkedInnerHTML = 'position: absolute;width: 20px;height: 20px;z-index: 10000;left: 50%;top: 50%;transform: translate(240%,-50%);background-color: #b5b4b400;border-radius: 50%;cursor:pointer;visibility:visible';
        if(identifyCurrentGraphics === checkedInnerHTML){
            findAllStatOfCheck[i].setAttribute('style', 'top:0;position:absolute;visibility:hidden');
            findAllStatOfUncheck[i].setAttribute('style', 'position: absolute;width: 20px;height: 20px;z-index: 10000;left: 50%;top: 50%;transform: translate(240%,-50%);background-color: #b5b4b4;border-radius: 50%;cursor:pointer;visibility:visible');
            gidOutlineCheck = 'max-height: 136px; max-width: 100px; margin: 0;opacity:0.5;border: 2px solid blue;width: 100%;height: auto;';
            if (identifyGraphicsOutlined === gidOutlineCheck){
                findAllGraphics[i].setAttribute('style', 'max-height: 136px; max-width: 100px; margin: 0;opacity:1;border: 1px solid #c1c1c159;width: 100%;height: auto;');
            }
        }
    }

    console.log("target graphics end");
    selectedGraphics = target.closest('td').find('img').attr('src');
    console.log(selectedGraphics);
    });
    $('.checkIconDeselectGraphics').on('click', function (e) {
        var target;
        target = $(e.target);
        target.parents('td').eq(1).removeClass('currentlyChecked');
        target.closest('td').find('.checkIconDeselectGraphics').attr('style', 'top:0;position:absolute;visibility:hidden');
        target.closest('td').find('img').attr('style', 'max-height: 136px; max-width: 100px; margin: 0;opacity:1;border: 1px solid #c1c1c159;width: 100%;height: auto;');
        target.closest('td').find('.checkIconSelectedGraphics').attr('style', 'position: absolute;width: 20px;height: 20px;z-index: 10000;left: 50%;top: 50%;transform: translate(240%,-50%);background-color: #b5b4b4;border-radius: 50%;cursor:pointer;visibility:visible');
        $('#optionToAddGraphics').addClass('hidden');
    });

$('.share-button').on('click', function () {
       $('#shareScreen').modal();
    });

/* navbarHome.html script */

