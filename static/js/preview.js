(function () {
    'use strict';

    window.onpopstate = function () {
        location.reload();
    };

    $('#image').on('click', function () {
        $('.existed').css("opacity", "1")
        setTimeout(function(){
            $('.existed').css("opacity", "0")
        },300);
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
    })

})();