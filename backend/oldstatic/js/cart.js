(function () {
    'use strict';

    $('.checkProject').on('click', function() {
        var project = $(this).data('project_id');
        var checked = false;
        $.ajax({
            url: window.cartUrL,
            method: 'POST',
            data: {
                csrfmiddlewaretoken: window.csrftoken,
                checked: checked,
                project: project
            },
            success: function (response) {
                location.reload();
            }
        });
    });

    $('#checkout').on('click', function() {
        var subscription = $(this).data('subscription');
        if(!subscription){
            $('#packageModal').modal('show');
            return false;
        }
    });

})();