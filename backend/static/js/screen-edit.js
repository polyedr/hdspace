(function () {
    'use strict';

    const EDITMODE = 'edit';
    const PREVIEWMODE = 'preview';

    var posX = 0;
    var posY = 0;
    var width = 0;
    var height = 0;
    var oldPosX = 0;
    var oldPosY = 0;
    var downFlag = false;
    var currentBlock;
    var screenEventId;
    var mode = EDITMODE;


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
        if(mode == EDITMODE) {
            getCoordinates();
        }
    });


    $('#image').mousemove(function (event) {
        if(mode == EDITMODE) {
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
        if(mode == EDITMODE) {
            $('#modalForm')[0].reset();
            $('#screenModal').modal();
            $('#currentArea').removeAttr('id');
            downFlag = false;
            $('#modalDeleteButton').hide();
            $('.project-screens img').removeClass('selected-img');
        }
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

    toggleErrors(['.validate_error'], false);

    $('#screenModal').on('hidden.bs.modal', function () {
        if (currentBlock) {
            $('div[uuid=' + currentBlock + ']').remove();
        }
    });

    function showHideInputs(link_to, link_screen=''){
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
            $(".project-screens img[data-screen-id="+ link_screen + "]" ).addClass('selected-img')
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
        if (link_to) {
            var url = $(this).data('url');

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

    var copyButton = document.getElementById('copyButton');
    if (copyButton) {
        var clipboard = new ClipboardJS(copyButton);
    }

    $('.share-button').on('click', function () {
       $('#shareScreen').modal();
    });

    $('#bottomPanel button').on('click', function () {
        var dataMode = $(this).data('mode');
        if(dataMode) {
            mode = dataMode;
            if(mode == PREVIEWMODE){
                $('#screenImage div').draggable("disable");
                $('.existed').css("opacity", "0");
            }else {
                draggable();
                $('.existed').css("opacity", "1");
            }
        }
        $('#bottomPanel button').removeClass('active');
        $(this).addClass('active');
    });

    //  preview model code

    $(document).on('click', '#image', function () {
        if(mode == PREVIEWMODE) {
            $('.existed').css("opacity", "1");
            setTimeout(function () {
                $('.existed').css("opacity", "0");
            }, 300);
        }
    });

    $(document).on('click', '.existed', function () {
        if(mode == EDITMODE) {
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

        if(mode == PREVIEWMODE) {
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
                mode=PREVIEWMODE;
                var preview = $(this).data('preview');
                var link_screen = $(this).data('link_screen');
                var projectId = $(this).data('project_id');
                var path = preview + '/' + link_screen + '/';
                var changePath = '/edit-screen/' + projectId + '/' + link_screen + '/';
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
                            window.history.pushState(null, null, changePath);
                        }
                    }
                });
            }
        }
    });

    window.onpopstate = function () {
        if(mode == PREVIEWMODE) {
            var url = window.location.pathname;
            var res = url.split("/");
            var projectId = res[2];
            var screenId = res[3];
            var path = projectId + '/' + screenId + '/';
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
                    }
                }
            });
        }
    };
})();
