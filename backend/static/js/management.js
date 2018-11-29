(function () {
    'use strict';
    $('#tracking').on('click', function () {
        var status = $(this).attr('data-status')
        if(status == 'stoped'){
            var url = $(this).data('url');
        }else{
            var url = $(this).data('stop-url');
        }

        var taskId = $(this).data('task-id');
        var $track = $(this);
        $.ajax({
            url: url,
            method: 'POST',
            data: {
                csrfmiddlewaretoken: window.csrftoken,
                taskId: taskId,
            },
            success: function (response) {
                if(status == 'stoped') {
                    $track.attr('data-status', 'started');
                    $track.text('Stop');
                }else{
                    $track.attr('data-status', 'stoped');
                    $track.text('Start');
                }
                showNotifications("success", response.msg);
            },
        });
    });

})();