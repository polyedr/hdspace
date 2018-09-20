function toggleErrors(elements, show) {

    if (typeof show === 'undefined') {
        show = true;
    }

    for (var i = 0; i < elements.length; i++) {
        if (show) {
            $(elements[i]).show();
            continue;
        }
        $(elements[i]).hide();
    }
}

function validateForm(elements) {
    var error = false;
    for (var i = 0; i < elements.length; i++) {
        if (!$(elements[i]).val()) {
            $(elements[i]).next().show();
            error = true;
            continue;
        }
        $(elements[i]).next().hide();
    }
    return error
}

function checkPassword(password1, password2) {
    var error = false;
    if (password1 !== password2) {
        error = true;
        $('#id_password2').next().show().text('The two password fields didn\'t match.');
    } else if (!password1) {
        $('#id_password2').next().show();
    } else {
        $('#id_password2').next().hide();
    }
    return error
}

// show site notifications

toastr.options = {
    closeButton: true,
    debug: true,
    progressBar: true,
    preventDuplicates: true,
    positionClass: 'toast-top-right',
    onclick: null
};

function showNotifications(type, message) {
    switch (type) {
        case 'success':
            toastr.success(message);
            break;
        case 'info':
            toastr.info(message);
            break;
        case 'error':
            toastr.error(message);
            break;
        default:
            break;
    }
}

function readURL(input) {

    if (input.files && input.files[0]) {
        var reader = new FileReader();

        reader.onload = function (e) {
            $('.client-avatar').attr('src', e.target.result);
        };

        reader.readAsDataURL(input.files[0]);
    }
}
