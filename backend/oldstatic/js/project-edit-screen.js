(function () {
    'use strict';

    const EDITMODE = 'edit';
    const PREVIEWMODE = 'preview';
    const COMMENTMODE = 'comment';

    var posX = 0;
    var posY = 0;
    var width = 0;
    var height = 0;
    var oldPosX = 0;
    var oldPosY = 0;
    var downFlag = false;
    var currentBlock;
    var screenEventId;
    var currentScreenId = $(".scr-img:first").data('screen-id');
    var mode = EDITMODE;
    var commentId;


    function setShareUrl(url) {
        if (url) {
            var shareFacebook = "https://www.facebook.com/sharer/sharer.php?u={url}";
            var shareTwitter = "https://twitter.com/home?status=" + projectName + "%20{url}";
            var shareLinkedin = "https://www.linkedin.com/shareArticle?mini=true&url={url}&title=" + projectName + "&summary=" + projectName + "&source={url}";
            shareFacebook = shareFacebook.replace(/{url}/g, url);
            shareTwitter = shareTwitter.replace(/{url}/g, url);
            shareLinkedin = shareLinkedin.replace(/{url}/g, url);
            $(".facebook-share").attr("href", shareFacebook);
            $(".linkedin-share").attr("href", shareLinkedin);
            $(".twitter-share").attr("href", shareTwitter);
        }
    }

    setShareUrl($("#shareLink").val());

    function guid() {
        return Math.random().toString(36).substr(2, 9);
    }

    function findPosition(oElement) {
        if (typeof (oElement.offsetParent) !== 'undefined') {
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
        if (move.clientX < posX) {
            posX = move.clientX;
            width = Math.abs(oldPosX - posX);
        }
        if (move.clientY < posY) {
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
        if (mode == EDITMODE) {
            getCoordinates();
        }
    });


    $('#image').mousemove(function (event) {
        if (mode == EDITMODE) {
            var move = {}
            var positions = getMovePositions();
            move.clientX = positions[0]
            move.clientY = positions[1]
            if (downFlag) {
                imageMoveHeightWidth(move)
            }
        }
    });

    $('#image').mouseup(function () {
        if (mode == EDITMODE) {
            $('#modalForm')[0].reset();
            $('#screenModal').modal();
            $('#currentArea').removeAttr('id');
            downFlag = false;
            $('#modalDeleteButton').hide();
            $('.project-screens img').removeClass('selected-img');
        }
    });

    function draggable() {
        if ($('#screenImage div').length) {
            $('#screenImage div').draggable(
                {
                    drag: function () {
                        var imgPos = findPosition(screenImg);
                        var offset = $(this).offset();
                        posX = offset.left - imgPos[0];
                        posY = offset.top - imgPos[1];
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
    }

    draggable();

    toggleErrors(['.validate_error'], false);

    $('#screenModal').on('hidden.bs.modal', function () {
        if (currentBlock) {
            $('div[uuid=' + currentBlock + ']').remove();
        }
    });

    function showHideInputs(link_to, link_screen = '') {
        if (link_to === 'external' || link_to == '') {
            $('.project-screens').hide();
            $('#id_event').hide();
            $('#id_href').show();
            $('#id_new_window').show();
        } else {
            $('.project-screens').show();
            $('#id_event').show();
            $('#id_href').hide();
            $('#id_new_window').hide();
            if (link_screen) {
                $(".project-screens img[data-screen-id=" + link_screen + "]").addClass('selected-img');
            }
        }
    }

    $('#id_link_to').change(function () {
        var link_to = $(this).val();
        showHideInputs(link_to);
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
            'data-screen_event_id': data.pk,
            'data-link_screen': data.link_screen,
            'data-preview': data.screen__project__preview,
            'data-project_id': data.screen__project__pk,
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
        $element.addClass('existed');
        if (link_to) {
            var url = $(this).data('url');

            if (link_to === 'external') {
                var validate_list = ['#id_link_to', '#id_href']
            } else {
                var validate_list = ['#id_link_to']
            }
            var formValid = validateForm(validate_list);
            if (!formValid) {
                var href = $('#id_href').val();
                var new_window = $('#id_new_window').is(':checked');
                var event = $('#id_event').val();
                var link_screen = $('#id_link_screen').val();
                $.ajax({
                    url: url,
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
                        data['screen__project__pk'] = response.project_id;
                        addElementData($element, data);
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

    var copyButton = document.getElementById('copyButton');
    if (copyButton) {
        var clipboard = new ClipboardJS(copyButton);
    }

    $('.share-button').on('click', function () {
        $('#shareScreen').modal();
    });

    $('#prototype').on('click', function () {
        $('.comment').hide();
        $('.existed').show();
        $('#commentModal').hide();
        $('.non_existed_comment').remove()
        $('.comment').css("opacity", "0");
        if (mode == EDITMODE) {
            $('.existed').css("opacity", "0");
            mode = PREVIEWMODE;
        } else {
            draggable();
            $('.existed').css("opacity", "1");
            mode = EDITMODE
        }
    });

    $('.comment').css("opacity", "0");
    $('#comment').on('click', function () {
        mode = COMMENTMODE;
        $('.comment').show();
        $('.existed').hide();
        $('.comment').css("opacity", "1");
        // $('#screenImage div').draggable( "disable" )
    })

    $('#image').on('click', function (event) {
        $('#commentModal').hide()
        $('#commentModal .comments-list').html('')
        $('.non_existed_comment').remove()
        if (mode == COMMENTMODE) {
            getCoordinates();
            var x = posX - 18;
            var y = posY - 18;
            var number = $('.screenContainer .comment').length + 1;
            $("<div class='comment non_existed_comment' data-x=" + posX + " data-y=" + posY + "  style='top:" + y + "px; left:" + x + "px'>" + number + "</div>")
                .insertAfter("#image");

            var popupX = posX + 18;
            var popupY = posY + 18;
            $('#commentModal').css({ display: "block", top: popupY + 'px', left: popupX + 'px' });
            commentId = '';
        }
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
        if (comment_id) {
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

                            $commentItem.find('.edit-comment').attr('data-comment-edit', value.id);
                            $commentItem.find('.delete-comment').attr('data-comment-delete', value.id);
                            $commentItem.find('.comment-content').attr('data-comment-edit', value.id);

                            $('#commentModal .comments-list').append($commentItem);
                        })
                    }
                }
            });
        }
        $('#commentModal').css({ display: "block", top: popupY + 'px', left: popupX + 'px' });
    });

    $(document).on('click', '.edit-comment', function () {
        $('.comment-content').prop('disabled', true);
        var comment_id = $(this).attr('data-comment-edit');
        var $prevInput = $("input[data-comment-edit=" + comment_id + "]");
        $prevInput.prop('disabled', function (i, v) { return !v; });
    });

    $(document).on('click', '.delete-comment', function () {
        var comment_id = $(this).attr('data-comment-delete');
        var url = '/delete-comment/';
        var $comment = $(this);
        if (comment_id) {
            $.ajax({
                url: url,
                method: 'POST',
                data: {
                    comment_id: comment_id,
                    csrfmiddlewaretoken: window.csrftoken
                },
                success: function (response) {
                    if (response.msg) {
                        $comment.closest('.comment-item').remove();
                    }
                }
            });
        }
    });

    $(document).on('keypress', '.comment-content', function (e) {
        var code = (e.keyCode ? e.keyCode : e.which);
        if (parseInt(code) === 13) {
            e.preventDefault();
            var comment = $(this).val();
            var $edit = $(this);
            var commentId = $(this).attr('data-comment-edit');
            var url = '/edit-comment/';
            if (comment) {
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
        if (comment) {
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

                        $commentItem.find('.edit-comment').attr('data-comment-edit', response.id);
                        $commentItem.find('.comment-content').attr('data-comment-edit', response.id);
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

    //  preview model code

    $(document).on('click', '#image', function () {
        if (mode == PREVIEWMODE) {
            $('.existed').css("opacity", "1");
            setTimeout(function () {
                $('.existed').css("opacity", "0");
            }, 300);
        }
    });

    $(document).on('click', '.existed', function () {
        if (mode == EDITMODE) {
            toggleErrors(['.validate_error'], false);
            $('#screenModal').modal();
            var link_to = $(this).data('link_to');
            $('#id_link_to').val(link_to);
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
            var link_screen = $(this).data('link_screen');
            showHideInputs(link_to, link_screen);
        }

        if (mode == PREVIEWMODE) {
            var link_to = $(this).data('link_to');
            if (link_to == 'external') {
                var new_window = $(this).data('new_window');
                var href = $(this).data('href');
                if (new_window == "True") {
                    window.open(href, '_blank');
                } else {
                    location.href = href;
                }
            } else {
                var preview = $(this).data('preview');
                var link_screen = $(this).data('link_screen');
                var projectId = $(this).data('project_id');
                var path = preview + '/' + link_screen + '/';
                var requestPath = '/screen-preview/' + path;
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
                            $('#shareLink').val(response.preview_absolute_url);
                            setShareUrl(response.preview_absolute_url);
                            $('#modalButton').attr('data-url', response.screen_save_url);
                        }
                    }
                });
            }
        }
    });

    $(document).on('click', '.edit_prototype', function () {
        currentScreenId = $(this).data('screen-id');
        var screenUrl = $(this).data('get-screen-url');
        $('#modalButton').attr('data-url', screenUrl);
        var src = $("img[screen-id=" + currentScreenId + "]").attr("src");
        $("#screenImage img").attr("src", src);
        mode = EDITMODE;
        var url = $(this).data("event_url");

        $.ajax({
            url: url,
            method: 'GET',
            success: function (response) {
                if (response) {
                    $('#screenImage .existed').remove();
                    $("#screenImage .comment").remove();
                    $('#screenImage img').attr('src', response.image);
                    $.each(response.screen_events, function (index, value) {
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

                    $.each(response.screen_comments, function (index, value) {
                        var $commentBox = $('#comment_content').clone(true, true);
                        $commentBox.css({
                            'top': value.y,
                            'left': value.x,
                        });
                        $commentBox.text(value.index);
                        $commentBox.removeAttr('id');
                        $commentBox.attr('data-comment-id', value.id);
                        $commentBox.attr('data-x', value.x);
                        $commentBox.attr('data-y', value.y);
                        $('#screenImage').prepend($commentBox);
                    })

                    $('#shareLink').val(response.preview_absolute_url);
                    setShareUrl(response.preview_absolute_url);
                }
            }
        });
    });

    $(document).on('click', '#sharePrototype', function () {
        var email = $('#email_share').val();
        var url = $(this).data('url');
        if (email) {
            $.ajax({
                url: url,
                method: 'POST',
                data: {
                    csrfmiddlewaretoken: window.csrftoken,
                    email: email,
                    screenId: currentScreenId,
                },
                success: function (response) {
                    showNotifications("success", response.msg);
                },
            });
        }
    });


})();
