(function () {
    'use strict';

    // messaging
    var last_pk = 0;
    var workflowScreenId = '';
    var screenStatus = '';
    var statusColor = {
        'on_hold': 'backgroundGreen',
        'in_progress': 'backgroundBlue',
        'review': 'backgroundRed',
        'approved': 'backgroundOrange',
    };

    toggleErrors(['.validate_error'], false);
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
            $eventBox.find('a:nth-child(1)').attr('data-screen-id', response.pk);
            $eventBox.find('a:nth-child(2)').attr('href', response.edit_screen_url);
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
    }, 3000);

    $('.screen-delete').on('click', function (e) {
        var url = $(this).data('href');
        var screenId = $(this).data('screen-id');
        $(this).parent('div').parent('div').remove();
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



    $('.workflow-list img').on('click', function () {
        $('#workflowModal').modal();
        var assignee = $(this).data('asignee-user-name');
        $('#assignedUser').text(assignee);
        workflowScreenId = $(this).data('screen-id');
        screenStatus = $(this).data('screen-status');
        for (var key in statusColor) {
            $('#statusChange').removeClass(statusColor[key])
        }
        $('#statusChange').addClass(statusColor[screenStatus])
    });

    $(document).on('click', '#collaboratordDropdown a', function () {
        var assignee = $(this).data('assigne');
        var assignee_name = $(this).text();
        $('#assignedUser').text(assignee_name);
        var url = $('#collaboratordDropdown').data('url');
        $.ajax({
            url: url,
            method: 'POST',
            data: {
                csrfmiddlewaretoken: window.csrftoken,
                assignee: assignee,
                screenId: workflowScreenId,
            },
            success: function (response) {
                showNotifications("success", response.msg);
                $('#collaboratordDropdown').removeClass('show');
                $(".workflow-list img[data-screen-id="+ workflowScreenId + "]" ).attr('data-asignee-user-name', assignee_name)
            },
        });
    });

    $(document).on('click', '#assignedUser', function () {
        $('#collaboratordDropdown').toggleClass("show");
        $('#statusDropdown').removeClass('show');
    });

    $(document).on('keyup', '#searchInput', function () {
        var input, filter, ul, li, a, i, div;
        input = document.getElementById("searchInput");
        filter = input.value.toUpperCase();
        div = document.getElementById("collaboratordDropdown");
        a = div.getElementsByTagName("a");
        for (i = 0; i < a.length; i++) {
            if (a[i].innerHTML.toUpperCase().indexOf(filter) > -1) {
                a[i].style.display = "";
            } else {
                a[i].style.display = "none";
            }
        }
    });

    $('#workflowModal').on('hidden.bs.modal', function () {
        $('#collaboratordDropdown').removeClass('show');
        $('#statusDropdown').removeClass('show');
    });

    $(document).on('click', '#statusChange', function () {
        $('#statusDropdown').toggleClass("show");
        $('#collaboratordDropdown').removeClass('show');
        $( "#statusDropdown li[data-status="+ screenStatus + "]" ).addClass("active-status");
    });

    $(document).on('click', '#statusDropdown li', function () {
        var status = $(this).data('status');
        var url = $('#statusDropdown').data('url');
        $(this).addClass("active-status");
        $('#statusChange').addClass(statusColor[status])
        $.ajax({
            url: url,
            method: 'POST',
            data: {
                csrfmiddlewaretoken: window.csrftoken,
                status: status,
                screenId: workflowScreenId,
            },
            success: function (response) {
                showNotifications("success", response.msg);
                $('#statusDropdown').toggleClass('show');
                $(".workflow-list img[data-screen-id="+ workflowScreenId + "]" ).attr('data-screen-status', status)
            },
        });
    });

})();
