
function hideShowErrors(elements, show=true){

    for (var i=0; i < elements.length; i++){
         if(show) {
             $(elements[i]).show();
             continue;
         }
         $(elements[i]).hide();
    }
}

function validateForm(elements){
    var error = false;
    for (var i=0; i < elements.length; i++){
         if(!$(elements[i]).val()) {
             $(elements[i]).next().show();
             var error = true;
             continue;
         }
         $(elements[i]).next().hide();
    }
    return error
}

 function checkPassword(password1, password2){
    var error = false
    if(password1 !== password2){
        error = true;
        $('#id_password2').next().show().text('The two password fields didn\'t match.');
    } else if (!password1) {
        $('#id_password2').next().show();
    } else{
        $('#id_password2').next().hide();
    }
    return error
}