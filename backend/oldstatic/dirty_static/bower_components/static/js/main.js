$(document).ready(function () {
    function readURL(input) {
        for(var i =0; i< input.files.length; i++){
            if (input.files[i]) {
                var reader = new FileReader();

                reader.onload = function (e) {
                    var img = $('<img id="preview">');
                    img.attr('src', e.target.result);
                    img.appendTo('#imgPreview');

                };
                reader.readAsDataURL(input.files[i]);
            }
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

 function readURL(input) {
        for(var i =0; i< input.files.length; i++){
            if (input.files[i]) {
                var reader = new FileReader();

                reader.onload = function (e) {
                    var img = $('<img id="preview2">');
                    img.attr('src', e.target.result);
                    img.appendTo('#imgPreview2');
                    console.log(img.attr('src'));
                };
                reader.readAsDataURL(input.files[i]);
            }
        }
        /*var dataa = $('#preview').attr('src');

                    $.post({
                         url:"/index/",
                         data: {'data': dataa,
                             csrfmiddlewaretoken: '{{ csrf_token }}'
                             }
                    });*/
    /*$.ajax({
        url: '/index/',
         method: 'POST',
         data: data,
         success: function (data) {
            // success callback
             // you can process data returned by function from views3.py
         }
    });*/
    }
    $('#imgUpload2').change(function(){
        readURL(this);

    });

    $(".red").click(function(){
        console.log('alo');
        //window.location.href='#'


    });

$(document).ready(function () {
    function readURL(input) {
        for(var i =0; i< input.files.length; i++){
            if (input.files[i]) {
                var reader = new FileReader();

                reader.onload = function (e) {
                    var img = $('<img id="preview3">');
                    img.attr('src', e.target.result);
                    img.appendTo('#imgPreview3');
                    console.log(img.attr('src'));
                    var dataa = img.attr('src');

                    $.ajax({
                        url: '/index/',
                        method: 'POST',
                        data: {'data': dataa},
                        success: function () {
                           if (dataa) {
                               alert("A user with this username already exists.");
                           }
                        }
                    });
                };
                reader.readAsDataURL(input.files[i]);
            }
        }
        /*var dataa = $('#preview').attr('src');

                    $.post({
                         url:"/index/",
                         data: {'data': dataa,
                             csrfmiddlewaretoken: '{{ csrf_token }}'
                             }
                    });*/
    /*$.ajax({
        url: '/index/',
         method: 'POST',
         data: data,
         success: function (data) {
            // success callback
             // you can process data returned by function from views3.py
         }
    });*/
    }
    $('#imgUpload3').change(function(){
        readURL(this);

    });

    $(".red").click(function(){
        console.log('alo');
        //window.location.href='#'


    });

});


