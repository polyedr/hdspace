/* header-validation.html script */
$( function() {
$( ".sortable" ).sortable();
} );



function load(){
    var
    $table = $('#datatables-example'),
    rows = $table.find('tr');

    rows.each(function (index, row) {
        var
            $row = $(row),
            id = $row.data('id')

        if (getCookie('index_id') == id) {
            var children = $table.find('tr[data-parent="' + id + '"]');
            children.show();
        }
    });
}

function setCookie(cname, cvalue) {
    document.cookie = cname + "=" + cvalue + ";";
}

function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i <ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}
function startTime(){
    var now = new Date();
    now.format("hh:mm");
    document.getElementById("Time").innerHTML = now.getTime();
}
/* */

    //paste this code under the head tag or in a separate js file.
   // Wait for window load
// $(window).load(function() {
//     // Animate loader off screen
//     $(".se-pre-con").fadeOut("slow");;
// });


$("#profile-pic").click(function(e) {
    $("#profile-pic-Upload").click();
});
function fasterPreview( uploader ) {
    if ( uploader.files && uploader.files[0] ){
          $('#profile-pic').attr('src',
             window.URL.createObjectURL(uploader.files[0]) );
    }
}
$("#profile-pic-Upload").change(function(){
    fasterPreview( this );
});



/* deviceContainer.html script */

var index = 0;
var timeStamp = '';
function changeElementEvent(data) {
    console.log('Undo/redo: '+index );
    var id = 'id'+String(data[0]);
    var preview = id + 'work';
    var event = data[1];
    console.log(data);

    var element = document.getElementById(id);
    var prevElement = document.getElementById(preview);

    if('location' in event){
        var parentWidth = document.getElementById('container-inside-frame').offsetWidth;
        var parentHeight = document.getElementById('container-inside-frame').offsetHeight;

        var prevParentWidth = document.getElementById('screenSelectorContent').offsetWidth;
        var prevParentHeight = document.getElementById('screenSelectorContent').offsetHeight;

        var location = event['location'];
        var x0 = location['x0'];
        var y0 = location['y0'];
        var x1 = location['x1'];
        var y1 = location['y1'];

        element.style.left = x0 / 100 * parentWidth;
        element.style.top = y0 / 100 * parentHeight;
        element.style.width = (x1 - x0) / 100 * parentWidth;
        element.style.height = (y1 - y0) / 100 * parentHeight;

        prevElement.style.left = (x0 / 100 * prevParentWidth)/5;
        prevElement.style.top = (y0 / 100 * prevParentHeight)/5;
        prevElement.style.width = ((x1 - x0) / 100 * prevParentWidth)/5;
        prevElement.style.height = ((y1 - y0) / 100 * prevParentHeight)/5;
    }
    else if('fontColor' in event){
        var fontcolor = event['fontColor'];
        element.style.color = fontcolor;
        prevElement.style.color = fontcolor;
    }
    else if('fontSize' in event){
        var fontSize = event['fontSize'];
        element.style.fontSize = fontSize;
        prevElement.style.fontSize = fontSize;
    }
    else if('fontFamily' in event){
        var fontFamily = event['fontFamily'];
        element.style.fontFamily = fontFamily;
        prevElement.style.fontFamily = fontFamily;
    }
    else if('changedStyle' in event){
        var styleEvent = event['changedStyle'];
        element.style.backgroundColor = styleEvent['bgcolor'];
        element.style.borderColor = styleEvent['borderColor'];
        element.style.borderRadius = styleEvent['borderRadius'] +'px';
        element.style.textAlign = styleEvent['textAlign'];
        element.style.textIndent = styleEvent['textIndent'];
        element.style.zIndex = styleEvent['zIndex'];

        prevElement.style.backgroundColor = styleEvent['bgcolor'];
        prevElement.style.borderColor = styleEvent['borderColor'];
        prevElement.style.borderRadius = styleEvent['borderRadius'] +'px';
        prevElement.style.textAlign = styleEvent['textAlign'];
        prevElement.style.textIndent = styleEvent['textIndent'];
        prevElement.style.zIndex = styleEvent['zIndex'];
    }
    else if('background-color' in event){
        var backgroundColor = event['background-color'];
        var backgroundElm = document.getElementById('classContainer-selector');
        var prevBackgroundElm = document.getElementById('classContainer-selectorWork');

        backgroundElm.style.backgroundColor = backgroundColor;
        prevBackgroundElm.style.backgroundColor = backgroundColor;
    }
    else if('locked' in event){
        console.log(id);
        if(event['locked']) {
            lockElement(id);
        }
        else{
            unLockElement(id);
        }
    }
    else if('name' in event){
        var name = event['name'];
        element.innerHTML = name;
        element.value = name;
        element.placeholder = name;

        prevElement.innerHTML = name;
        prevElement.value = name;
        prevElement.placeholder = name;
    }
    else if('deletedElement' in event){
        console.log('Bring back the element');
        console.log(element);
        console.log(prevElement);

        element.style.display = '';
        prevElement.style.display = '';
    }
}
function undo() {
    //var url = document.URL;
    //if (url == "http://localhost:8000/index/" || url == "http://127.0.0.1:8000/index/"
    //|| url == "http://127.0.0.1:8000/index/#") {

    $.ajax({
        type: 'POST',
        url: '/index/',
        data: {
            'name': 'undo',
            'index': index
        },
        success: function(data){
            changeElementEvent(data);


        }
    });

    index += 1;
}
function redo() {
    if (index <= 0){
        index = 0;
    }

    $.ajax({
        type: 'POST',
        url: '/index/',
        data: {
            'name': 'redo',
            'index': index
        },
        success: function(data){
            changeElementEvent(data);

        }
    });

    if (index <= 0){
        index = 0;
    }
    else {
        index -= 1;
    }
}

/* library.html script */

function checkExpansion(){
    alert("checckexpansion");
}
$('body').click(function(){
 var jstreej = $('.jstree-leaf').find('i');
 jstreej.removeClass('fa-angle-right');
// $('.imageHolder').removeClass('selectedHolder');
});


function closeLibrary(){
$('#libraryModal').modal('hide');
location.replace('http://127.0.0.1:8000/index/');
}
$(".resourceUploadContainer").on('shown.bs.collapse', function(){
$('#uploadResourcebtn').removeClass('col-xs-9').addClass('col-xs-12');
$('#uploadResourceDisplay').css("display","none");

});
$(".resourceUploadContainer").on('hidden.bs.collapse', function(){
$('#uploadResourcebtn').removeClass('col-xs-9').addClass('col-xs-12');
$('#uploadResourceDisplay').css("display","none");
});

//change  title Image library  according to  click
$('#buildTree').on("click.jstree", function (e) {
var targetClick = e.target.innerText;
passToAjax(targetClick);
});

function passToAjax(getSelectedProj){
$('#imageLibraryProject').text(getSelectedProj);
$.ajax({
    type: 'GET',
    url: '/index/',
    name: 'getImgLibAllProj',
    data: {
        'name' : 'getImgLibAllProj',
        'curProj': getSelectedProj
    },
    success: function(data){
        createImgContainer(data[0], data[1], data[2], data[3], data[4]);
        console.log('paths');
        console.log(data);
    },
    error: function(jqXHR, status, err){
        console.log(jqXHR.responseText);
    }
});
}

function uploadImageToLib(){
         swal({
    title: "Enter Image Name",
    type: "input",
    showCancelButton: false,
    closeOnConfirm: false,
    inputPlaceholder: "Enter text here"
}, function (inputValue) {
    if (inputValue === false) {
       // document.getElementById('preview1').src = '';
        return false;
    }
    if (inputValue === "") {
        swal.showInputError("You need to write something!");
        return false;
    }

    else {
        swal.close();
        $('#uploadResourcebtn').removeClass('col-xs-9').addClass('col-xs-12');
        alert($('.previewImage').attr('src'));
        addImageToImagaContainer();
        $('#uploadResourceDisplay').css("display","none");

    }
});


}
$(document).on('click', function (event) {
    if (!$(event.target).closest('.imageHolder').length) {
        // ... clicked on the 'body', but not inside of imageHolder
        $('.imageHolder').removeClass('selectedHolder');
    }
});
//select individual image
function itemcontainerClick(el) {
    $('.imageHolder').removeClass('selectedHolder');
    $( "#selectAllChecbox" ).prop( "checked", false );
    $(el).addClass('selectedHolder');

}


$(document).on('click', '.imageHolder', function(e) {
    if(e.shiftKey) {
         //Shift-Click
        $(this).addClass('selectedHolder');
        return ;
    }

    itemcontainerClick(this);
    console.log(e.classname);
});

// sort based on  name
function sortImageByNameAsc() {
     var $divs = $("div.item-containter");
     var alphabeticallyOrderedDivs = $divs.sort(function (a, b) {
        return $(a).find('.imgName p').text() > $(b).find('.imgName p').text();
    });
    $("#imgSortContainter").html(alphabeticallyOrderedDivs);
}

    //sort by type
 function sortImageByType() {
     var $divs = $("div.item-containter");
     var alphabeticallyOrderedDivs = $divs.sort(function (a, b) {
        return $(a).find('.imgType p').text() > $(b).find(".imgType p").text();
    });
    $("#imgSortContainter").html(alphabeticallyOrderedDivs);
}

      //sort by size
 function sortImageBySize() {
     var $divs = $("div.item-containter");
     var numericallyOrderedDivs = $divs.sort(function (a, b) {
        return $(a).find('.imgType span').text() > $(b).find(".imgType span").text();
    });
    $("#imgSortContainter").html(numericallyOrderedDivs);
}


     //sort by date
 function sortImageByDate() {
     var $divs = $("div.item-containter");
     var alphabeticallyOrderedDivs = $divs.sort(function (a, b) {
        return $(a).find('.imgModified p').text() > $(b).find(".imgModified p").text();
    });
    $("#imgSortContainter").html(alphabeticallyOrderedDivs);
}



$('#rad-name').on('click', function () {
    sortImageByNameAsc();
});
 $('#rad-type').on('click', function () {
    sortImageByType();
});
  $('#rad-size').on('click', function () {
    sortImageBySize();
});
$('#rad-modified').on('click', function () {
    sortImageByDate();
});
 // display Images as list
function displayAsList() {
    $('.item-containter').addClass('col-xs-12');
    $('.item-containter').addClass('listViewLib');
    $('.item-containter').css('border-bottom','1px solid #495e71');
    $('.imageWrapper-lib').addClass('col-xs-12');
    $('.imageHolder').addClass('col-xs-2');
    $('.imageDetail').removeClass('col-xs-12');
    $('.imageDetail').addClass('col-xs-10');
    $('.imgType').removeClass('hidden');
    $('.imgSize').removeClass('hidden');
    $('.imgModified').removeClass('hidden');
    $('.img-span-name').removeClass('hidden');
}
    // display images as thumb
function displayAsThumb() {
    $('.item-containter').removeClass('col-xs-12');
    $('.item-containter').removeClass('listViewLib');
    $('.item-containter').css('border-bottom','0px solid #e7eaec');
    $('.imageWrapper-lib').removeClass('col-xs-12');
    $('.imageHolder').removeClass('col-xs-2');
    $('.imageDetail').removeClass('col-xs-10');
    $('.imageDetail').addClass('col-xs-12');
    $('.imgType').addClass('hidden');
    $('.imgSize').addClass('hidden');
    $('.imgModified').addClass('hidden');
    $('.img-span-name').addClass('hidden');
}
$('#view1').on('click', function () {
 displayAsList();
});

  $('#view2').on('click', function () {
    displayAsThumb();
});

function deleteImage(e){
    swal({
        title: 'Do you want to delete this Image?',
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#dd6b55',
        cancelButtonColor: '#999',
        confirmButtonText: 'Yes!',
        cancelButtonText: 'No',
        closeOnConfirm: true
    },function (isConfirm) {
        if (isConfirm) {

            console.log(e);
           $(e).closest('.item-containter') .remove();

        }

    });
}
function deleteMultipleImages() {
 var holders=   $('#imgSortContainter').find('.selectedHolder');
 for( var i=0;i<holders.length;i++){
      $(holders[i]).closest('.item-containter') .remove();

 }
 //alert(holders.length);
}
    $('#selectAllChecbox').on('change',function() {
        if(this.checked) {

        $('.imageHolder').addClass('selectedHolder');

        }
        else{
        $('.imageHolder').removeClass('selectedHolder');

        }

    });

/* prediction.html script */

$("#popupWidgetsBox").click(function(){
    $("#widgetsBox").addClass("open");
    $("#chartsBox").removeClass("open");
});

$("#closeWidgetsBox").click(function(){
    $("#widgetsBox").removeClass("open");
});

$("#popupChartsBox").click(function(){
    $("#chartsBox").addClass("open");
    $("#widgetsBox").removeClass("open");
});

$("#closeChartsBox").click(function(){
    $("#chartsBox").removeClass("open");
});

/* rightSidebar.html script */

/* rightSidebarUpdated.html script */


/* styleTransfer.html script */

$('#buttonUpST').click(function() {
  event.preventDefault();
  $('#sortableSlidesST').animate({
    scrollTop: "-=200px"
  }, "normal");
});

 $('#buttonDownST').click(function() {
  event.preventDefault();
  $('#sortableSlidesST').animate({
    scrollTop: "+=200px"
  }, "normal");
});

/* upload.html script*/
/* uploadSelector.html script */
/* userContact.html script */


