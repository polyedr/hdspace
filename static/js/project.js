(function () {
    'use strict';

    // messaging
    var last_pk = 0;


    var posX = 0;
    var posY = 0;
    var width = 0;
    var height = 0;
    var oldPosX = 0;
    var oldPosY = 0;
    var downFlag = false;
    var currentBlock;
    var screenEventId;


    var saveUrl = $('#modalButton').data('url');

    function guid() {
        return Math.random().toString(36).substr(2, 9);
    }

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
        downFlag = true;
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
        posX = oldPosX = posX - imgPos[0];
        posY = oldPosY = posY - imgPos[1];
    }

    function getMovePositions(e) {
        var move = [];
        var imgPos;
        var moveX = 0;
        var moveY = 0;
        imgPos = findPosition(screenImg);
        if (!e) {
            e = window.event;
        }
        if (e.pageX || e.pageY) {
            moveX = e.pageX;
            moveY = e.pageY;
        }
        else if (e.clientX || e.clientY) {
            moveX = e.clientX + document.body.scrollLeft
                + document.documentElement.scrollLeft;
            moveY = e.clientY + document.body.scrollTop
                + document.documentElement.scrollTop;
        }
        move[0] = moveX - imgPos[0];
        move[1] = moveY - imgPos[1];
        return move;

    }

    function imageMoveHeightWidth(move) {
        var select = document.getElementById('currentArea');
        width = Math.abs(move.clientX - posX);
        height = Math.abs(move.clientY - posY);
        if(move.clientX < posX){
            posX = move.clientX;
            width = Math.abs(oldPosX - posX);
        }
        if(move.clientY < posY){
            posY = move.clientY;
            height = Math.abs(oldPosY - posY);
        }
        if (select) {
            select.style.top = posY + 'px';
            select.style.left = posX + 'px';
            select.style.width = width + 'px';
            select.style.height = height + 'px';
        } else {
            var iDiv = document.createElement('div');
            iDiv.style.top = posY + 'px';
            iDiv.style.left = posX + 'px';
            iDiv.style.width = width + 'px';
            iDiv.style.height = height + 'px';
            iDiv.style.border = '1px solid #2A9FD8';
            iDiv.style.position = 'absolute';
            iDiv.style.background = 'rgba(0,173,255,.54)';
            iDiv.style.backgroundImage = 'url(' + window.hotspot + ')';
            iDiv.style.backgroundPosition = '100% 100%';
            iDiv.style.backgroundRepeat = 'no-repeat';
            iDiv.setAttribute('id', 'currentArea');
            currentBlock = guid();
            iDiv.setAttribute('uuid', currentBlock);
            document.getElementById('screenImage').appendChild(iDiv);
            var clone = $('#adjacent-content').html();
            iDiv.insertAdjacentHTML('afterBegin', clone);
        }
    }

    var screenImg = document.getElementById('image');
    $('#modalDeleteButton').hide();
    $('#image').mousedown(function () {
        getCoordinates();
    });


    $('#image').mousemove(function (event) {
        var move = {}
        var positions = getMovePositions();
        move.clientX = positions[0]
        move.clientY = positions[1]
        if (downFlag) {
            imageMoveHeightWidth(move)
        }
    });

    $('#image').mouseup(function () {
        $('#modalForm')[0].reset();
        $('#screenModal').modal();
        $('#currentArea').removeAttr('id');
        downFlag = false;
        $('#modalDeleteButton').hide();
    });

    function draggable() {
        $('#screenImage div').draggable(
            {
                drag: function () {
                    var imgPos = findPosition(screenImg);
                    var offset = $(this).offset();
                    posX = offset.left-imgPos[0];
                    posY = offset.top-imgPos[1];
                },
                stop: function (event, ui) {
                    var url = $(this).data('update_event_position');
                    $.ajax({
                        url: url,
                        method: 'POST',
                        data: {
                            csrfmiddlewaretoken: window.csrftoken,
                            x: posX,
                            y: posY,
                        },
                        success: function (response) {

                        }
                    });
                }
            });
    }

    draggable();


    $(document).on('click', '.existed', function () {
        toggleErrors(['.validate_error'], false);
        $('#screenModal').modal();
        $('#id_link_to').val($(this).data('link_to'));
        $('#id_href').val($(this).data('href'));
        var new_window = $(this).data('new_window');
        var checked = new_window === 'True' || new_window === true;
        $('#id_new_window').prop('checked', checked);
        screenEventId = $(this).data('screen_event_id');
        $('#modalDeleteButton').show();
        posX = $(this).data('x');
        posY = $(this).data('y');
        width = $(this).data('width');
        height = $(this).data('height');
    });

    toggleErrors(['.validate_error'], false);

    $('#screenModal').on('hidden.bs.modal', function () {
        $('.project-screens img').removeClass('selected-img');
        if (currentBlock) {
            $('div[uuid=' + currentBlock + ']').remove();
        }
    });

    $('#id_link_to').change(function () {
        var link_to = $(this).val();
        if (link_to === 'external') {
            $('.project-screens').hide();
            $('#id_event').hide();
            $('#id_href').show();
             $('#id_new_window').show();
        } else {
            $('.project-screens').show();
            $('#id_event').show();
            $('#id_href').hide();
            $('#id_new_window').hide();
        }
    });

    $('.project-img').on('click', function () {
        $('#id_link_screen').val($(this).data('screen-id'));
        $('.project-img').removeClass('selected-img');
        $(this).addClass('selected-img');
    });

    $('#modalDeleteButton').on('click', function (e) {
        var $deleted_event = $('div[data-screen_event_id=' + screenEventId + ']');
        var url = $deleted_event.data('delete_url');
        $.ajax({
            url: url,
            method: 'POST',
            data: {
                csrfmiddlewaretoken: window.csrftoken,
                screenEventId: screenEventId
            },
            success: function (response) {
                if (response) {
                    $('#screenModal').modal('hide');
                    $deleted_event.remove();
                }
            }
        });
    });

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
            'data-delete_url': data.delete_url,
            'data-update_event_position': data.update_url,
            'data-screen_event_id': data.pk
        });

        return $element
    }

    $('#modalButton').on('click', function (e) {
        e.preventDefault();
        var link_to = $('#id_link_to').val();
        var $element;
        if (screenEventId) {
            $element = $('div[data-screen_event_id=' + screenEventId + ']');
        } else {
            $element = $('div[uuid=' + currentBlock + ']');
        }
        if (link_to) {
            if(link_to === 'external'){
                var validate_list = ['#id_link_to', '#id_href']
            }else {
                var validate_list = ['#id_link_to']
            }
            var formValid = validateForm(validate_list);
            if (!formValid) {
                var href = $('#id_href').val();
                var new_window = $('#id_new_window').is(':checked');
                var event = $('#id_event').val();
                var link_screen = $('#id_link_screen').val();
                $.ajax({
                    url: saveUrl,
                    method: 'POST',
                    data: {
                        csrfmiddlewaretoken: window.csrftoken,
                        link_to: link_to,
                        href: href,
                        x: posX,
                        y: posY,
                        width: width,
                        height: height,
                        new_window: new_window,
                        event: event,
                        link_screen: link_screen,
                        screenEventId: screenEventId,
                    },
                    success: function (response) {
                        var response_data = jQuery.parseJSON(response['screen_event']);
                        var data = response_data[0].fields;
                        data['pk'] = response_data[0].pk;
                        data['delete_url'] = response.delete_url;
                        data['update_url'] = response.update_url;
                        addElementData($element, data);
                        $element.addClass('existed');
                        currentBlock = '';
                        $('#screenModal').modal('hide');
                        draggable();
                    }
                });
            }
        } else {
            $('#id_link_to').next('p').show();
        }
    });

    $('.screen-img').on('click', function () {
        var url = $(this).data('event_url');
        var src = $(this).attr('src');
        var previewUrl = $(this).data('preview_url');
        saveUrl = $(this).data('screen-save-url');
        $('#previewBtn').attr('href', previewUrl);
        $('#screenImage .existed').remove();
        $.ajax({
            url: url,
            method: 'GET',
            success: function (response) {
                if (response) {
                    $('#modalButton').attr('data-url', response.save_url)
                    $('#screenImage img').attr('src', src);
                    $.each(response['screen_events'], function (index, value) {
                        var $eventBox = $('#adjacent-content').clone(true, true);
                        $eventBox = addElementData($eventBox, value);
                        $eventBox.css({
                            'top': value.y,
                            'left': value.x,
                            'width': value.width,
                            'height': value.height,
                        });
                        $eventBox.addClass('existed')
                        $eventBox.removeAttr('id');
                        $('#screenImage').append($eventBox);
                        draggable();
                    })
                }
            }
        });
    });
    
     $(".js-upload-photos").click(function () {
        $("#fileupload").click();
     });

     $("#fileupload").fileupload({
        dataType: 'json',
        sequentialUploads: true,
        start: function (e) {
            $(".progress").removeClass("hide");
        },
        stop: function (e) {
            $(".progress").addClass("hide");
        },
        progressall: function (e, data) {
          var progress = parseInt(data.loaded / data.total * 100, 10);
          var strProgress = progress + "%";
          $(".progress-bar").css({"width": strProgress});
          $(".progress-bar").text(strProgress);
        },
        done: function (e, data) {
          var response = data.result;
          if (response.is_valid) {
            var $eventBox = $('#screen-image-content').clone(true, true);
            $eventBox.removeAttr('id');
            $eventBox.removeClass('hide');
            $eventBox.find('img').attr('src', response.url);
            $eventBox.find('img').attr('data-preview_url', response.preview_url);
            $eventBox.find('img').attr('data-screen-save-url', response.save_url);
            $eventBox.find('img').attr('data-event_url', response.event_url);
            $eventBox.find('a').attr('data-screen-id', response.pk);
            $(".image-list-body").append($eventBox);
            $(".progress").addClass("hide");
            showNotifications("success", response.msg);
          } else{
              showNotifications("error", response.msg);
          }
        }
     });

    $('#addTaskButton').on('click', function (e) {
        e.preventDefault();
        var url = $(this).data('url');
        var projectId = $(this).data('project_id');
        var title = $('#id_title').val();
        var description = $('#id_description').val();
        var owner = $('#id_owner').val();

        $.ajax({
            url: url,
            method: 'POST',
            data: {
                csrfmiddlewaretoken: window.csrftoken,
                title: title,
                description: description,
                owner: owner,
                projectId: projectId,
            },
            success: function (response) {
                var $activityItem = $('#projectActivityItem').clone(true, true);
                $activityItem.removeClass('hide');
                $activityItem.find('h4').text(response.title);
                $activityItem.find('span').text(response.description);
                $activityItem.find('div span').text(moment(response.created).format('ll'));
                $('.sidebar-list').append($activityItem);
                $('#addTaskModal').modal('hide');
                showNotifications("success", response.msg);
            },
            error: function (xhr, status, error) {
                var response = jQuery.parseJSON(xhr.responseText);
                showNotifications("error", response.msg);
            }
        });
    });

     $('.deleteMember').on('click', function () {
        var member_id = $(this).data('member_id');
        var url = $(this).data('member_url');
        $.ajax({
            url: url,
            method: 'POST',
            data: {
                csrfmiddlewaretoken: window.csrftoken,
                memberId: member_id,
            },
            success: function (response) {
                $('#chatMembers').modal('hide');
            }
        });
     });

     function getThreadMessages(status) {
        var user_id = $('.chat-discussion').attr("data-id");
        var messagesUrl = $('.chat-discussion').attr("data-path");
        $.ajax({
            url: messagesUrl,
            method: 'GET',
            data: {
                status: status,
                last_pk: last_pk,
            },
            dataType: 'json',
            success: function (response) {
                if (response["messages"]) {
                    $.each(response["messages"], function (index, value) {
                        last_pk = value.pk;
                        var $msgForm = $('#msg_form').clone(true, true);
                        $msgForm.find('.message-avatar').attr('src', value.avatar);
                        var message_date = moment(value.sent_at).format('MMM Do, h:mm a');
                        $msgForm.find('.message-date').text(message_date);
                        $msgForm.find('.message-content').text(value.content);
                        $msgForm.removeClass("hide");
                        if(!value.online){
                            $msgForm.find('.message-avatar-wrap').removeClass("online");
                            $msgForm.find('.message-avatar-wrap').addClass("offline");
                        }
                        if(parseInt(user_id) !== parseInt(value.sender_id)) {
                            $msgForm.removeClass("left");
                            $msgForm.addClass("right");
                        }else{
                            $msgForm.removeClass("right");
                            $msgForm.addClass("left");
                        }
                        $msgForm.find('.message-author').text( value.username);
                        $(".chat-discussion").append($msgForm);
                    });
                    $('.chat-discussion').scrollTop($('.chat-discussion')[0].scrollHeight);
                }
            }
        });
    }

    function sendMessage(){
        var message = $(".write_msg").val();
        var chatUrl = $('.chat-discussion').attr('data-chat');
        var username = $('.chat-discussion').data('username');
        if (message) {
            $.ajax({
                url: chatUrl,
                method: 'POST',
                data: {
                    message: message,
                    csrfmiddlewaretoken: window.csrftoken
                },
                success: function (response) {
                    if (response.status) {
                        var $msgForm = $('#msg_form').clone();
                        $msgForm.removeClass("hide");
                        $msgForm.removeClass("right");
                        $msgForm.addClass("left");
                        var message_date = moment(response.sent_at).format('MMM Do, h:mm a');
                        $msgForm.find('.message-date').text(message_date);
                        $msgForm.find('.message-content').text(message);
                        $msgForm.find('.message-author').text(username);
                        $msgForm.find('.message-avatar').attr('src', response.avatar);
                        $(".chat-discussion").append($msgForm);
                        $(".write_msg").val('');
                        $('.chat-discussion').scrollTop($('.chat-discussion')[0].scrollHeight);
                    }
                }
            });
        }
    }

    $(".write_msg").keypress(function (e) {
        var code = (e.keyCode ? e.keyCode : e.which);
        if (parseInt(code) === 13) {
            e.preventDefault();
            sendMessage();
        }
    });

    getThreadMessages();

    setInterval(function () {
        getThreadMessages(true);
    }, 300000);

    $('.screen-delete').on('click', function (e) {
        var url = $(this).data('href');
        var screenId = $(this).data('screen-id');
        $(this).parent('div').remove();
        $.ajax({
            url: url,
            method: 'POST',
            data: {
                csrfmiddlewaretoken: window.csrftoken,
                screenId: screenId,
            },
            success: function (response) {
                showNotifications("success", response.msg);
            },
        });
    });

    $('#inviteUser').on('click', function (e) {
        e.preventDefault();
        var name = $('#id_name').val();
        var email = $('#id_email').val();
        var url = $(this).data('url');

        var formValid = validateForm([
             '#id_name',
             '#id_email',
         ]);
        if(!formValid) {
            $.ajax({
                url: url,
                method: 'POST',
                data: {
                    csrfmiddlewaretoken: window.csrftoken,
                    name: name,
                    email: email,
                },
                success: function (response) {
                    showNotifications("success", response.msg);
                    $('#inviteUserForm')[0].reset();
                },
                error: function (xhr, status, error) {
                    var response = jQuery.parseJSON(xhr.responseText)
                    showNotifications("error", response.msg);
                }
            });
        }
    })
})();
