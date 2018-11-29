(function () {
    'use strict';

    toggleErrors(['.validate_error'], false);

     $('#reset').on('click', function (e) {
         e.preventDefault();
         var formValid = validateForm(['#id_password1', '#id_password2']);

         var password_match = checkPassword(
             $('#id_password1').val(),
             $('#id_password2').val(),
         );

         if(!formValid && !password_match){
             $('#resetForm').submit();
         }
     })

})();