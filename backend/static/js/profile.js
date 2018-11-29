(function () {
    'use strict';
    toggleErrors(['.validate_error'], false);

    $('#updateUser').on('click', function (e) {
        e.preventDefault();
        var formValid = validateForm([
            '#id_username',
            '#id_first_name',
            '#id_last_name',
            '#id_email',
            '#id_role',
        ]);

        if (!formValid) {
            $('#updateForm').submit();
        }
    });


    $('#changePassword').on('click', function (e) {
        e.preventDefault();
        var formValid = validateForm([
            '#id_old_password',
            '#id_password1',
            '#id_password2',
        ]);

        var password_match = checkPassword(
            $('#id_password1').val(),
            $('#id_password2').val(),
        );

        if (!formValid && !password_match) {
            $('#changeForm').submit();
        }
    });

    $('.change-avatar').on('click', function () {
        $('#id_image').trigger('click');
    });

    $('#id_image').change(function () {
        readURL(this);
    });

})();