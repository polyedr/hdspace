(function () {
    'use strict';
    // toggleErrors(['.validate_error'], false);

    $('#modalCloseButton').on('click', function () {
        // toggleErrors(['.validate_error'], false);
    });

    function addRemoveProject(checked, project){
        $.ajax({
            url: window.cartUrL,
            method: 'POST',
            data: {
                csrfmiddlewaretoken: window.csrftoken,
                checked: checked,
                project: project,
            },
            success: function (response) {

            }
        });
    }

    $(document).on("change",".checkProject",function(e) {
        var project = $(this).val();
        var checked = false;
        if ($(this).is(':checked')) {
           checked = true;
        }
        addRemoveProject(checked, project);
    });

    $(document).on("click",".payProject",function(e) {
        var checked = true;
        var project = $(this).data('project_id');
        addRemoveProject(checked, project);
    });

    $(document).on("click",".delete_project",function(e) {
        var url = $(this).data('href');
        var projectId = $(this).data('project_id');
        $(this).closest('tr').remove();
        $.ajax({
            url: url,
            method: 'POST',
            data: {
                csrfmiddlewaretoken: window.csrftoken,
                projectId: projectId,
            },
            success: function (response) {
                showNotifications("success", response.msg);
                console.log(response.projects);
                if(!response.projects){
                    $('.shopping-cart').hide();
                }
            },
        });
    });

    $('#id_name').keypress(function(e){
        if(e.which == 13){
            e.preventDefault();
            $('#CreateProjectButton').click();
        }
    });

    $('#CreateProjectButton').on('click', function (e) {

         var formValid = validateForm([
            '#id_name',
        ]);

        if (!formValid) {
            var url = $(this).data('url');
            console.log('URL:', url);
            var name = $('#id_name').val();
            $.ajax({
                url: url,
                method: 'POST',
                data: {
                    csrfmiddlewaretoken: window.csrftoken,
                    name: name
                },
                success: function (response) {
                    showNotifications("success", response.msg);
                    location.href='/projects/';
                },
                error: function (xhr, status, error) {
                    var response = jQuery.parseJSON(xhr.responseText);
                    showNotifications("error", response.msg);
                }
            });
        }
    });

})();
