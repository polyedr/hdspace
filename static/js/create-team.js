(function () {
    'use strict';

    toggleErrors(['.validate_error'], false);
    var elem = document.querySelector('.js-switch');
    var switchery = new Switchery(elem, { color: '#1AB394' });

    $("#createTeam").on('click', function (e) {
        e.preventDefault();
        var formValid = validateForm([
            '#id_username',
            '#id_first_name',
            '#id_last_name',
            '#id_email',
            '#id_password',
            '#id_position',
            '#id_charge',
            '#id_time_log',
            '#id_avatar',
            '#id_logo',
        ]);
        if(!formValid){
         $('#createTeamForm').submit();
        }
    });

})();