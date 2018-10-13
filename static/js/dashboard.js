(function () {
    'use strict';
    toggleErrors(['.validate_error'], false);

    $('#modalCloseButton').on('click', function () {
        toggleErrors(['.validate_error'], false);
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

    $('.checkProject').change(function() {
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
        addRemoveProject(checked, project)
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
            },
        });
    });

    $('#CreateProjectButton').on('click', function (e) {

         var formValid = validateForm([
            '#id_name',
        ]);

        if (!formValid) {
            var url = $(this).data('url');
            var name = $('#id_name').val();
            $.ajax({
                url: url,
                method: 'POST',
                data: {
                    csrfmiddlewaretoken: window.csrftoken,
                    name: name
                },
                success: function (response) {
                    var $project = $('#new-projects').clone(true, true);
                    $project.find('tr td:nth-child(1) input').attr('value', response.pk);
                    $project.find('tr td:nth-child(3) a').text(response.name);
                    $project.find('tr td:nth-child(3) a').attr('href', response.project_url);
                    $project.find('tr td:nth-child(6) a').attr('data-project_id', response.pk);
                    $('#projectsList tbody').prepend('<tr>' + $project.find('tr').html() + '</tr>');
                    showNotifications("success", response.msg);
                    $('#myModal').modal('hide');
                },
                error: function (xhr, status, error) {
                    var response = jQuery.parseJSON(xhr.responseText);
                    showNotifications("error", response.msg);
                }
            });
        }
    });

})();