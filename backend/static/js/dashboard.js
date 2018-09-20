(function () {
    'use strict';
    toggleErrors(['.validate_error'], false);

    $('#modalButton').on('click', function (e) {
        e.preventDefault();
        var formValid = validateForm([
            '#id_name',
        ]);

        if (!formValid) {
            $('#modalForm').submit();
        }
    });

    $('#modalCloseButton').on('click', function () {
        toggleErrors(['.validate_error'], false);
    });

})();