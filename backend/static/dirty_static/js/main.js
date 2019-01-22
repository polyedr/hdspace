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
                    setNavbarProjectName(newName, lastName);
                    $(this).text(newName);
                },
                //revert name if request fails
                error: function (jqxhr, textStatus, error) {
                    $(this).text(lastName);
                    console.log("Update Error (Project Name) - Reverting element to last name")
                    console.log("Request Failed: " + textStatus + ", " + error);
                }
            });
        }
        else {//Deny new name when its null
            $(this).text(lastName);//revert
        }
});

    //The listener for editing SCREEN names on selector
    $(".editScreenName").blur(function () {
        //innerHTML of this element (for updating the name)
        var newName = $(this).text().trim();
        //the previous name of this element (for finding the correct document in database)
        var lastName = $(this).attr("data-lastName").trim();

        console.log("New Name = "+ newName);
        console.log("Last name = "+ lastName);

        if(newName){
            $.ajax({
                type: 'POST',
                url: '/index/',
                context: this,
                data: {
                    'newName': newName,
                    'lastName': lastName,
                    'name': 'modifyScreen'
                },
                //update all html matching this screen name
                success: function () {
                    $("#retrieveCurrentPage").html(newName);
                    $(this).text(newName);
                },
                //revert this screen name if request fails
                error: function (jqxhr,textStatus,error) {
                    $(this).text(lastName);
                    console.log("Update Error (Screen Name): Reverting name to last name");
                    console.log("Request Failed: " + textStatus + " - " + error);
                }
            });
        }
        else{ //Deny new name its null
            $(this).text(lastName);
        }
    });

    //listener for Device Screen Name editor
    $("#retrieveCurrentPage").blur(function () {
        //innerHTML of this element (for updating the name)
        var newName = $(this).text().trim();
        //the previous name of this element (for finding the correct document in database)
        var lastName = $(this).attr("data-lastName").trim();
        console.log("New Name = "+ newName);
        console.log("Last name = "+ lastName);


        if(newName){
            $.ajax({
                type: 'POST',
                url: '/index/',
                context: this,
                data: {
                    'newName': newName,
                    'lastName': lastName,
                    'name': 'modifyScreen'
                },
                //update all html matching this screen name
                success: function () {
                    setScreenSelectorName(newName,lastName);
                    $(this).text(newName);
                },
                //revert this screen name if request fails
                error: function (jqxhr,textStatus,error) {
                    $(this).text(lastName);
                    console.log("Update Error (Screen Name): Reverting name to last name");
                    console.log("Request Failed: " + textStatus + " - " + error);
                }
            });
        }
        else{ //Deny new name its null
            $(this).text(lastName);//revert
        }
    });
});

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