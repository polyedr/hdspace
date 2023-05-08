(function () {
    'use strict';

    var posX = 0;
    var posY = 0;
    var currentScreenId = $("#image").data('screen-id');
    var commentId;

    window.onpopstate = function () {
        location.reload();
    };


    $('#image').on('click', function () {
        $('.existed').css("opacity", "1");
        setTimeout(function(){
            $('.existed').css("opacity", "0");
        },300);
    });

    var screenImg = document.getElementById('image');
    function findPosition(oElement) {
        if (typeof(oElement.offsetParent) !== 'undefined') {
            for (var posX = 0, posY = 0; oElement; oElement = oElement.offsetParent) {
                posX += oElement.offsetLeft;
                posY += oElement.offsetTop;
            }
            return [posX, posY];
        }
        else {
            return [oElement.x, oElement.y];
        }
    }

    function getCoordinates(e) {
        posX = 0;
        posY = 0;
        var imgPos = findPosition(screenImg);
        if (!e) {
            e = window.event;
        }
        if (e.pageX || e.pageY) {
            posX = e.pageX;
            posY = e.pageY;
        }
        else if (e.clientX || e.clientY) {
            posX = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
            posY = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
        }
        posX = posX - imgPos[0];
        posY = posY - imgPos[1];
    }

    function addElementData($element, data) {
        $element.attr({
            'data-href': data.href,
            'data-x': data.x,
            'data-y': data.y,
            'data-width': data.width,
            'data-height': data.height,
            'data-event': data.event,
            'data-link_to': data.link_to,
            'data-new_window': data.new_window,
            'data-screen_event_id': data.pk,
            'data-link_screen': data.link_screen,
            'data-preview': data.screen__project__preview,
        });

        return $element
    }

    $('.existed').on('click', function(){
        var link_to = $(this).data('link_to');
        if(link_to == 'external'){
            var new_window = $(this).data('new_window');
            var href = $(this).data('href');
            if(new_window == "True"){
                 window.open(href,'_blank');
            } else{
                location.href = href;
            }
        } else{
            var preview = $(this).data('preview');
            var link_screen = $(this).data('link_screen');
            var path = preview + '/' + link_screen + '/';
            var changePath = '/preview/' + path;
            var requestPath= '/screen-preview/' + path;
            $.ajax({
                url: requestPath,
                method: 'GET',
                success: function (response) {
                    if (response) {
                        $('#screenImage .existed').remove();
                        $('#screenImage img').attr('src', response.image);
                        $.each(response.events, function (index, value) {
                            var $eventBox = $('#adjacent-content').clone(true, true);
                            $eventBox = addElementData($eventBox, value);
                            $eventBox.css({
                                'top': value.y,
                                'left': value.x,
                                'width': value.width,
                                'height': value.height,
                            });
                            $eventBox.removeAttr('id');
                            $('#screenImage').append($eventBox);
                        })
                        window.history.pushState(null, null, changePath);
                    }
                }
            });
        }
    });


    //comments

    $('#comment').on('click', function () {
        $('#screenImage div').draggable( "disable" )
        $('.comment').show();
        $('.existed').hide();
    })

     $('#image').on('click', function (event) {
        $('#commentModal').hide()
        $('#commentModal .comments-list').html('')
        $('.non_existed_comment').remove()
        getCoordinates();
        var x = posX-18;
        var y = posY-18;
        var number = $('.comment').length + 1;
        $( "<div class='comment non_existed_comment' data-x=" + posX +  " data-y=" + posY + "  style='top:"+ y + "px; left:" + x + "px'>" + number + "</div>" )
            .insertAfter( "#image" );

        var popupX = posX + 18;
        var popupY = posY + 18;
        $('#commentModal').css({display:"block", top:popupY + 'px', left: popupX + 'px'});
        commentId = '';
    });
    $("#commentModal").hide();
     $(document).on('click', '.comment', function () {
         commentId = '';
         $('#commentModal').hide()
         $('.comments-list').html('')
         $('.non_existed_comment').remove()

         var x = parseInt($(this).attr('data-x'));
         var y = parseInt($(this).attr('data-y'));
         var popupX = x + 39;
         var popupY = y + 39;
         var comment_id = $(this).attr('data-comment-id');
         if(comment_id){
            commentId = comment_id;
            var requestPath = '/screen-comments/' + currentScreenId + '/' + comment_id;
            $.ajax({
                url: requestPath,
                method: 'GET',
                success: function (response) {
                    if (response) {
                        $.each(response.screen_comments, function (index, value) {
                            var $commentItem = $('#comment-item').clone(true, true)
                            $commentItem.removeAttr('id');
                            $commentItem.find('img').attr('src', value.image);
                            $commentItem.find('input').val(value.comment);
                            $commentItem.find('strong').text(value.user);
                            $commentItem.find('small').text('(' + moment(value.created).format('ll') + ')');

                            $commentItem.find('.edit-comment').attr('data-comment-edit',  value.id);
                            $commentItem.find('.comment-content').attr('data-comment-edit',  value.id);

                            $('#commentModal .comments-list').append($commentItem);
                        })
                    }
                }
            });
         }
         $('#commentModal').css({display:"block", top:popupY + 'px', left: popupX + 'px'});
     });

     $(document).on('click', '.edit-comment', function () {
        $('.comment-content').prop('disabled', true);
        var comment_id = $(this).attr('data-comment-edit');
        var $prevInput = $("input[data-comment-edit=" + comment_id + "]");
        $prevInput.prop('disabled', function(i, v) { return !v; });
    });

     $(document).on('keypress', '.comment-content', function (e) {
        var code = (e.keyCode ? e.keyCode : e.which);
        if (parseInt(code) === 13) {
            e.preventDefault();
            var comment = $(this).val();
            var $edit = $(this);
            var commentId = $(this).attr('data-comment-edit');
            var url = '/edit-comment/';
            if(comment) {
                $.ajax({
                    url: url,
                    method: 'POST',
                    data: {
                        comment_id: commentId,
                        comment: comment,
                        csrfmiddlewaretoken: window.csrftoken
                    },
                    success: function (response) {
                        if (response.msg) {
                            $edit.val(comment);
                            $edit.prop('disabled', true);
                            $('#commentModal').hide();
                        }
                    }
                });
            }
        }
    });

     $(document).on('click', '#send_comment', function () {
         var comment = $('#comment_text').val();
         if(comment){
             var requestPath = '/new-comment/'
             $.ajax({
                url: requestPath,
                method: 'POST',
                data: {
                    csrfmiddlewaretoken: window.csrftoken,
                    comment: comment,
                    commen_id: commentId,
                    x: posX,
                    y: posY,
                    screen_id: currentScreenId
                },
                success: function (response) {
                    if (response) {
                        var $commentItem = $('#comment-item').clone(true, true)
                        $commentItem.removeAttr('id');
                        $commentItem.find('img').attr('src', response.image);
                        $commentItem.find('input').val(response.comment);
                        $commentItem.find('strong').text(response.user);
                        $commentItem.find('small').text('(' + moment(response.created).format('ll') + ')');

                        $commentItem.find('.edit-comment').attr('data-comment-edit',  response.id);
                        $commentItem.find('.comment-content').attr('data-comment-edit',  response.id);
                        $('#commentModal .comments-list').append($commentItem);
                        $('#commentModal').hide();
                        commentId = '';
                        $('#comment_text').val('');
                        $('.non_existed_comment').attr('data-comment-id', response.comment_id)
                        $('.comment').removeClass('non_existed_comment');
                    }
                }
            });
         }
     })


})();