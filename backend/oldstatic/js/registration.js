(function () {
    'use strict';
    $('body').removeClass('gray-bg');
    toggleErrors(['.validate_error'], false);

     $('#signUp').on('click', function (e) {
         e.preventDefault();
         var formValid = validateForm([
             '#id_username',
             '#id_first_name',
             '#id_last_name',
             '#id_email',
             '#id_password1',
         ]);

         var password_match = checkPassword(
             $('#id_password1').val(),
             $('#id_password2').val(),
         );

         if(!formValid && !password_match){
             $('#signUpForm').submit();
         }
     })

})();