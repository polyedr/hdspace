(function () {
    'use strict';


    $("body").removeClass("gray-bg");
    hideShowErrors(['.validate_error', '.loading'], false);


    $('#login').on('click', function (e) {
        e.preventDefault();
        var url = $('form').attr('action');
        var username = $.trim($("input[name='username']").val());
        var password = $.trim($("input[name='password']").val());
        var csrf_token = $('meta[name="csrf-token"]').attr('content');
        if (!validateForm(["input[name='username']", "input[name='password']"])) {
            hideShowErrors(['.loading']);
            $.ajax({
                url: url,
                method: 'POST',
                data: {
                    username: username,
                    password: password,
                    csrfmiddlewaretoken: csrf_token
                },
                success: function (response) {
                    location.reload()
                },
                error: function (response) {
                    $("input[name='password']").next().show().text(response.responseJSON.msg);
                    hideShowErrors(['.loading'], false);
                }
            });
        }
    });

})();