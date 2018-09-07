(function () {
    'use strict';

    hideShowErrors(['.validate_error'], false);

     $('#forgot').on('click', function (e) {
         e.preventDefault();
         var formValid = validateForm(['#id_email'])

         if(!formValid){
             $('#forgotForm').submit();
         }
     })

})();