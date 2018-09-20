(function () {
    'use strict';

    toggleErrors(['.validate_error'], false);

    $('#forgot').on('click', function (e) {
        e.preventDefault();
        toggleErrors(['.back_error'], false);
        var formValid = validateForm(['#id_email']);

        if (!formValid) {
            $('#forgotForm').submit();
        }
    });

})();