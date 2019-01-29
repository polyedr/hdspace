$(document).ready(function () {
    function readURL(input) {
        $('#preview1').remove();
        if (input.files[0]) {
            var reader = new FileReader();

            reader.onload = function (e) {
                var img = $('<img id="preview1" class="w3-display-middle">');
                img.attr('src', e.target.result);
                img.appendTo('#imgPreview');
                document.getElementById('imgPreview').style = 'margin-left:0%;margin-top:0%';
                document.getElementById('preview1').style = 'max-width:90%; max-height:90%; z-index: 0';
            };
            reader.readAsDataURL(input.files[0]);
        }
    }
    $('#imgUpload').change(function(){
        readURL(this);
    });
    $("#option-upload").hide();
    $(".red").click(function(){
        console.log('alo');
        //window.location.href='#'
    });

});

$(document).ready(function () {
    function readURL(input) {
        $('#preview2').remove();
            if (input.files[0]) {
                var reader = new FileReader();
                reader.onload = function (e) {
                    var img = $('<img id="preview2" class="w3-display-middle">');
                    img.attr('src', e.target.result);
                    img.appendTo('#color-imgPreview');
                    $('#color-imgHide').remove();
                    document.getElementById('color-imgPreview').style = 'margin-left:0%; margin-top:0%';
                    document.getElementById('preview2').style = 'max-width:90%; max-height:90%; z-index:0';
                };
                reader.readAsDataURL(input.files[0]);
            }


    }
    $('#styleImg').change(function(){
        readURL(this);
    });
    $("#option-upload").hide();
    $(".red").click(function(){
        console.log('alo');
        //window.location.href='#'
    });

        /**
     * The code responsible for resizing and scrolling.
     *  - Currently only implemented on the LAPTOP Device and on the South-East corner of screen.
     *  - How to:
     *      - On the laptop device, hover, over the south-east corner (You should see the cursor change to a resize one)
     *      - click and drag to resize the background of the device. (You should notice it change in size)
     *      - Increasing the size of the background beyond the borders of the screen will automatically enable scrolling.
     *      - You can test this by clicking the screen and trying to scroll (you should be able to horizontally and
     *        vertically scroll)
     *      - Resizing is currently only triggered on south-east corner, so If you wish to resize again you
     *        must do so from the same corner. Not the corner of the background.
     */
    // South-east selector listener; for resizing the device background
    document.getElementById("se-rezise-background").addEventListener("mousedown", function(e){

        deviceBackgroundElement = document.getElementById("classContainer-selector");
        deviceBackgroundStyle = window.getComputedStyle(deviceBackgroundElement);

        //get starting width and height
        var startBackgroundHeight = parseFloat(deviceBackgroundStyle.getPropertyValue('height'));
        var startBackgroundWidth = parseFloat(deviceBackgroundStyle.getPropertyValue('width'));
        //get starting cursor co-ordinates
        var startX = e.pageX;
        var startY = e.pageY;

        resizeDeviceBackground = function (e){
            //Calculate the difference between starting and current cursor position (Offset).
            var offsetX = e.pageX - startX;
            var offsetY = e.pageY - startY;

            //Increment this offset with the original width and height
            var newWidth = (startBackgroundWidth + offsetX);
            var newHeight = (startBackgroundHeight + offsetY);

            //Resize the element
            deviceBackgroundElement.style.width = newWidth;
            deviceBackgroundElement.style.height = newHeight;
        };
        //Resize the device background in increments
        document.addEventListener("mousemove", resizeDeviceBackground);

        document.addEventListener("mouseup", function (){
            document.removeEventListener("mousemove",resizeDeviceBackground);
        });
    });

    // screenshotId (html_render variable) is not accessible through deviceContainer.html
    // so this data attribute cannot be set. This is a workaround
    $.ajax({
       type: 'GET',
       url: '/index/',
       data: {
           'name': 'getScreenshotId'
       },
        success: function(screenshotId){
           $("#retrieveCurrentPage").attr("data-screenshotid",screenshotId);
           highlightScreenOnDevice(screenshotId);
        }
    });

    // This listener is for editing PROJECT names
    $('.editProjectName').blur(function() {
        //innerHTML of that element (for updating the name)
        var newName = $(this).text().trim();
        //the previous name of this element (for finding the correct document in database)
        var lastName = $(this).attr("data-lastName").trim();
        if(newName){
            $.ajax({
                type: 'POST',
                url: '/index/',
                context: this,
                data: {
                    'newName': newName,
                    'lastName': lastName,
                    'name': 'modifyProject'
                },
                //update all other html containing this project name
                success: function () {
                    updateNavbarProjectName(newName, lastName);
                    $(this).text(newName);
                },
                //revert when request fails
                error: function (jqxhr, textStatus, error) {
                    $(this).text(lastName);
                    console.log("Update Error (Project Name) - Reverting element to last name")
                    console.log("Request Failed: " + textStatus + ", " + error);
                }
            });
        }
        else {//Revert when null
            $(this).text(lastName);
        }
});

    //The listener for editing screen names on the SCREEN SELECTOR
    $(".editScreenName").blur(function () {
        //innerHTML of this element (for updating the name)
        var newName = $(this).text().trim();
        //the previous name of this element (for finding the correct document in database)
        var lastName = $(this).attr("data-lastName").trim();
        // The screenshot id of the screen name edited
        var screenshotId = $(this).attr("data-screenshotid");

        if(newName){
            $.ajax({
                type: 'POST',
                url: '/index/',
                context: this,
                data: {
                    'newName': newName,
                    'screenshotId': screenshotId,
                    'name': 'modifyScreen'
                },
                //update all html matching this screen name
                success: function () {
                    updateDeviceScreenName(screenshotId, newName);
                    $(this).text(newName);
                },
                //revert when request fails
                error: function (jqxhr,textStatus,error) {
                    $(this).text(lastName);
                    console.log("Update Error (Screen Name): Reverting name to last name");
                    console.log("Request Failed: " + textStatus + " - " + error);
                }
            });
        }
        else{ //Revert when null
            $(this).text(lastName);
        }
    });

    //listener for editing screen names on the DEVICE CONTAINER
    $("#retrieveCurrentPage").blur(function () {
        //innerHTML of this element (for updating the name)
        var newName = $(this).text().trim();
        //the previous name of this element (for finding the correct document in database)
        var lastName = $(this).attr("data-lastName").trim();
        // The screenshot id of the screen in the device
        var screenshotId = $(this).attr("data-screenshotid");

        if(newName){
            $.ajax({
                type: 'POST',
                url: '/index/',
                context: this,
                data: {
                    'newName': newName,
                    'screenshotId': screenshotId,
                    'name': 'modifyScreen'
                },
                //update all html matching this screen name
                success: function () {
                    updateScreenSelectorName(newName,screenshotId);
                    $(this).text(newName);
                },
                //revert when request fails
                error: function (jqxhr,textStatus,error) {
                    $(this).text(lastName);
                    console.log("Update Error (Screen Name): Reverting name to last name");
                    console.log("Request Failed: " + textStatus + " - " + error);
                }
            });
        }
        else{ //Revert when null
            $(this).text(lastName);
        }
    });
});

    /**
     * This highlights the screen on the screen selector that is currently being displayed on the device
     */
    function highlightScreenOnDevice(screenshotId){

        //The screenshot id of the screen displayed on the device
        var screenIdDisplayed = screenshotId;
        var screenElement = getScreenElementOnScreenSelector(screenIdDisplayed);
        var screenElementChildToHighlight = screenElement.find(".tab-pane.active.imageOutliner");
        screenElementChildToHighlight.addClass("highlight");
    }

    /**
     * This returns the screen on the screen selector that matches the given screenshot id
     * @param screenshotId - The screenshot Id of the screen to get from the selector
     * @returns jQuery Object
     */
    function getScreenElementOnScreenSelector(screenshotId){

            var screenElement;
            //get the screens (table-data) from the screen selector (table row)
            var screenList = $("#screenSelectorContent td");

            //For each screen in the screenlist
            screenList.each(function (){
                //get its screenshot id
                var thisScreenNameElement = $(this).find('abbr');
                var thisScreenshotId = thisScreenNameElement.attr("data-screenshotid");
                if(thisScreenshotId){
                    //Get this screen if it's screenshot id matches the one we're looking for
                    if(thisScreenshotId.localeCompare(screenshotId, undefined, { sensitivity: 'accent' }) === 0){
                        screenElement = $(this);
                        return false; //breaks out of .each()
                    }
                }
            });

        return screenElement;
    }

    /**
     * Updates the screen name on the device container only if the screen name edited by the user
     * is being displayed on the device
     * @param editedScreenNameId - The screenshot id of the screen name edited by the user
     */
    function updateDeviceScreenName(editedScreenNameId, newName){
        var editedScreenNameIsEqualTo = compareScreenshotId(editedScreenNameId);
        //The screenshot id of the screen displayed on the device
        var screenDisplayedOnDevice = $("#retrieveCurrentPage").attr("data-screenshotid");

        //If the edited screen name matches the screen displayed on the device
        if(editedScreenNameIsEqualTo(screenDisplayedOnDevice)){
            $("#retrieveCurrentPage").text(newName);
        }
    }

    /**
     * Compares two screenshot id's for equality.
     * @param screenShotIdOne - screenshot id of a given screenshot
     * @returns Boolean
     */
    function compareScreenshotId(screenShotIdOne){
        return function(screenShotIdTwo){
            //case insensitive comparison
            return screenShotIdOne.localeCompare(screenShotIdTwo, undefined, { sensitivity: 'accent' }) === 0;
        };
    }

$(window).on('load', function() {
    //device size
    if (document.getElementById('classContainer-selector') == null){
        var widthSection = 0;
        var heightSection = 0;
    }else {
        console.log(document.getElementById('classContainer-selector'))
        var widthSection = document.getElementById('classContainer-selector').clientWidth;
        var heightSection = document.getElementById('classContainer-selector').clientHeight;
    }

    //Layouts sizes

    //var widthLayouts = document.getElementById('slide1').clientWidth;
    //var heightLayouts = document.getElementById('slide1').clientHeight;


    console.log('sectionHeight: ' + heightSection);
    console.log('sectionWidth ' + widthSection);
    $.ajax({
        type: "GET",
        url: '/index/',
        data: {
            'name': 'initialState',
            'widthSection': widthSection,
            'heightSection': heightSection
//            'widthLayouts': widthLayouts,
//            'heightLayouts': heightLayouts
        },
        dataType: 'json'
    });

});


    // upload image to storage library
    var reader, img, imgUploadSrc, imgName, imgType, imgSize, imgModified, date_format_str, d, currentProjSelected;
    $(document).ready(function () {
        $('#uploadResourcebtn').removeClass('col-xs-9').addClass('col-xs-12');
        $('#uploadResourceDisplay').css("display", "none");
        function readURL(input) {
            $('.previewImage').remove();
            if (input.files[0]) {
                reader = new FileReader();
                reader.onload = function (e) {
                    img = $('<img id="imgResource" class="w3-display-middle previewImage">');
                    imgUploadSrc = e.target.result;
                    imgName=input.files[0].name;
                    imgType=input.files[0].type;
                    imgSize=input.files[0].size;
                    imgModified=input.files[0].lastModifiedDate;
                    // var dateFormat = require('dateformat');
                    d = new Date();
                    d = new Date(imgModified - 3000000);
                    date_format_str = d.getFullYear().toString()+"-"+((d.getMonth()+1).toString().length==2?(d.getMonth()+1).toString():"0"+(d.getMonth()+1).toString())+"-"+(d.getDate().toString().length==2?d.getDate().toString():"0"+d.getDate().toString());
                    // alert(date_format_str);
                    //  alert(imgName+'/'+imgType+'/'+imgSize+'/'+imgModified);
                    console.log(imgName+" / "+imgType);
                    img.attr('src', imgUploadSrc);
                    img.appendTo('#imgPreviewResource');
                    currentProjSelected = $('#imageLibraryProject').html();
                    addImageToImagaContainer(imgUploadSrc, imgName, imgType, imgSize, imgModified, currentProjSelected);
                    document.getElementById('imgPreviewResource').style = 'margin-left:0%;margin-top:0%';
                    document.getElementById('imgResource').style = 'max-width:90%; max-height:90%; z-index: 0';
                    $('#uploadResourceDisplay').css("display", "inline-block");
                    $('#uploadResourcebtn').removeClass('col-xs-12').addClass('col-xs-9');
                };
                reader.readAsDataURL(input.files[0]);
            }
        }
        $("#uploadResourceFile").click(function(){
            $(this).val("");
        });
        $('#uploadResourceFile').change(function () {
         readURL(this);
        });
    });

    function addImageToImagaContainer(src, fileName, fileType, fileSize, fileModified, curProj) {
        console.log(fileName);
        $('#projectuploadnameResource').attr('value', curProj);
        document.getElementById('fileTypeLIB').value = fileType;
        document.getElementById('fileSixeLIB').value = fileSize;
        document.getElementById('fileLastMLIB').value = fileModified;
        document.getElementById('uploadImgResource').submit();
        createImgContainerUpload(src, fileName, fileType, fileSize, fileModified);
    }

    function createImgContainerUpload(pathFromUpload, fileName, fileType, fileSize, fileModified){
        var htmlThumbView, htmlListview, eleThum, eleList;
        console.log('src');
        console.log(pathFromUpload);
        htmlThumbView = '\
            <div class="item-containter"   >\
            <div class="imageWrapper-lib">\
            <div class="imageHolder">\
            <img src="" width="100%" height="100%">\
            <div class="centered">\
            <i  class="fa fa-check  " style="font-size:146%; z-index: 50;left: 40%;float:left;"></i>\
            </div>\
            <div class="optionImage" onclick="deleteImage(this)">\
            <i  class="fa fa-trash w3-display-bottomright  " style="font-size:130%; z-index: 50;float:left;"></i>\
            </div>\
            </div>\
            <div class="imageDetail col-xs-12">\
            <div class="imgName">\
            <p><span class="img-span-name hidden">Name:</span>A image name</p>\
            </div>\
            <div class="imgType hidden">\
            <p><span>Type:</span>B image Type</p>\
            </div>\
            <div class="imgSize hidden">\
            <p><span>Size:</span>B image Size</p>\
            </div>\
            <div class="imgModified hidden">\
            <p><span class=""><i class="fa fa-calendar"></i>:</span>B image modified</p>\
            </div>\
            </div>\
            </div>\
            </div>\
            \
            ';
        htmlListview = '\
            <div class="item-containter col-xs-12"   >\
            <div class="imageWrapper-lib col-xs-12">\
            <div class="imageHolder col-xs-2">\
            <img src="" width="100%" height="100%">\
            <div class="centered">\
            <i  class="fa fa-check  " style="font-size:146%; z-index: 50;left: 40%;float:left;"></i>\
            </div>\
            <div class="optionImage" onclick="deleteImage(this)">\
            <i  class="fa fa-trash w3-display-bottomright  " style="font-size:130%; z-index: 50;float:left;"></i>\
            </div>\
            </div>\
            <div class="imageDetail col-xs-10">\
            <div class="imgName">\
            <p><span class="img-span-name ">Name:</span>B image name</p>\
            </div>\
            <div class="imgType ">\
            <p><span>Type:</span>B image Type</p>\
            </div>\
            <div class="imgSize ">\
            <p><span>Size:</span>B image Size</p>\
            </div>\
            <div class="imgModified ">\
            <p><span class=""><i class="fa fa-calendar"></i>:</span>B image modified</p>\
            </div>\
            </div>\
            </div>\
            </div>\
            \
            ';
        //add item in thumview mode
        if ($('#rad-thumbView').is(':checked')) {
            eleThum = $.parseHTML(htmlThumbView);
            $(eleThum).find('img').attr('src', pathFromUpload);
            $(eleThum).find('.imgName p').html(fileName);
            $(eleThum).find('.imgType p').html(fileType);
            $(eleThum).find('.imgSize p').html((fileSize / 1024).toFixed(2) + "KB");
            $(eleThum).find('.imgModified p').html(fileModified);
            $('#imgSortContainter').append(eleThum);
        }
        //add item in listview mode
        if ($('#rad-listView').is(':checked')) {
            eleList = $.parseHTML(htmlListview);
            $(eleList).find('img').attr('src', pathFromUpload);
            $(eleList).find('.imgName p').html(fileName);
            $(eleList).find('.imgType p').html(fileType);
            $(eleList).find('.imgSize p').html((fileSize / 1024).toFixed(2) + "KB");
            $(eleList).find('.imgModified p').html(fileModified);
            $('#imgSortContainter').append(eleList);
        }
    }

    function createImgContainer(pathFromAjax, name, type, size, lastModified){
        var htmlThumbView, htmlListview, i, arrayLength, eleThum, eleList;
        $('#imgSortContainter').empty();
        console.log('src');
        console.log(pathFromAjax);
        arrayLength = pathFromAjax.length;
        for(i=0;i<arrayLength;i++) {
            console.log('src');
            console.log(pathFromAjax[0] + ' and ' + pathFromAjax[1]);
            htmlThumbView = '\
                <div class="item-containter"   >\
                <div class="imageWrapper-lib">\
                <div class="imageHolder">\
                <img src="" width="100%" height="100%">\
                <div class="centered">\
                <i  class="fa fa-check  " style="font-size:146%; z-index: 50;left: 40%;float:left;"></i>\
                </div>\
                <div class="optionImage" onclick="deleteImage(this)">\
                <i  class="fa fa-trash w3-display-bottomright  " style="font-size:130%; z-index: 50;float:left;"></i>\
                </div>\
                </div>\
                <div class="imageDetail col-xs-12">\
                <div class="imgName" style="max-height: 20px;overflow: hidden">\
                <p><span class="img-span-name hidden">Name:</span>A image name</p>\
                </div>\
                <div class="imgType hidden">\
                <p><span>Type:</span>B image Type</p>\
                </div>\
                <div class="imgSize hidden">\
                <p><span>Size:</span>B image Size</p>\
                </div>\
                <div class="imgModified hidden">\
                <p><span class=""><i class="fa fa-calendar"></i>:</span>B image modified</p>\
                </div>\
                </div>\
                </div>\
                </div>\
                \
                ';
            htmlListview = '\
                <div class="item-containter col-xs-12" style="border-bottom: 1px solid #495e71;">\
                <div class="imageWrapper-lib col-xs-12">\
                <div class="imageHolder col-xs-2">\
                <img src="" width="100%" height="100%">\
                <div class="centered">\
                <i  class="fa fa-check  " style="font-size:146%; z-index: 50;left: 40%;float:left;"></i>\
                </div>\
                <div class="optionImage" onclick="deleteImage(this)">\
                <i  class="fa fa-trash w3-display-bottomright  " style="font-size:130%; z-index: 50;float:left;"></i>\
                </div>\
                </div>\
                <div class="imageDetail col-xs-10">\
                <div class="imgName" style="max-height: 20px;overflow: hidden">\
                <p><span class="img-span-name ">Name:</span>B image name</p>\
                </div>\
                <div class="imgType ">\
                <p><span>Type:</span>B image Type</p>\
                </div>\
                <div class="imgSize ">\
                <p><span>Size:</span>B image Size</p>\
                </div>\
                <div class="imgModified ">\
                <p><span class=""><i class="fa fa-calendar"></i>:</span>B image modified</p>\
                </div>\
                </div>\
                </div>\
                </div>\
                \
                ';
            //add item in thumview mode
            if ($('#rad-thumbView').is(':checked')) {
                eleThum = $.parseHTML(htmlThumbView);
                console.log(pathFromAjax[i]);
                $(eleThum).find('img').attr('src', pathFromAjax[i]);
                $(eleThum).find('.imgName p').html(name[i]);
                $(eleThum).find('.imgType p').html(type[i]);
                $(eleThum).find('.imgSize p').html((size[i] / 1024).toFixed(2) + "KB");
                $(eleThum).find('.imgModified p').html(lastModified[i]);
                $('#imgSortContainter').append(eleThum);
            }
            //add item in listview mode
            if ($('#rad-listView').is(':checked')) {
                eleList = $.parseHTML(htmlListview);
                $(eleList).find('img').attr('src', pathFromAjax[i]);
                $(eleList).find('.imgName p').html(name[i]);
                $(eleList).find('.imgType p').html(type[i]);
                $(eleList).find('.imgSize p').html((size[i] / 1024).toFixed(2) + "KB");
                $(eleList).find('.imgModified p').html(lastModified[i]);
                $('#imgSortContainter').append(eleList);
            }
        }
    }

    $(window).bind("load", function() {
        var location = window.location.href;
        console.log(location);
        console.log('directoryPath');
        if(location === 'http://127.0.0.1:8000/index/#uploaded'){
            libraryMS();
            checkLastAcitivityLib();
        }
        else if(location === 'http://127.0.0.1:8000/index/#prototype'){
            prototypeActivater();
        }
    });

    function checkLastAcitivityLib(){
        $.ajax({
            type: 'GET',
            url: '/index/',
            name: 'getLastSelectedProj',
            data: {
                'name' : 'getLastSelectedProj'
            },
            success: function(data){
                appendSelection(data);
                console.log('paths');
                console.log(data);
            },
            error: function(jqXHR, status, err){
                console.log(jqXHR.responseText);
            }
        });
    }

    function appendSelection(arrayCurProj){
        var ul, li, a, i, ele, filter;
        setTimeout(function(){
            console.log('appendSelection');
            filter = arrayCurProj[0];
            ele = document.getElementsByClassName("jstree-container-ul");
            ul = ele[0];
            li = ul.getElementsByTagName("li");
            console.log(filter);
            for (i = 0; i < li.length; i++) {
                a = li[i].getElementsByTagName("a")[0];
                console.log('a.innerHTML.toUpperCase()');
                console.log(a);
                a.classList.remove("jstree-clicked");
                if (a.innerHTML.toUpperCase().indexOf(filter.toUpperCase()) > -1) {
                    console.log('inside If');
                    a.classList.add("jstree-clicked");
                    passToAjax(filter);
                }
            }
            $('#resource').addClass('collapse in');
        },5000);
        console.log('outside for loop');
    }