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

    $('#connectTeamButton').on('click', function (e) {
        $('#connectTeam').modal();
    });

    $('#id_connect_team_name').on('keyup', function () {
        var url = $(this).data('url');
        var teamName = $(this).val();
        if(teamName) {
            $.ajax({
                url: url,
                method: 'POST',
                data: {
                    csrfmiddlewaretoken: window.csrftoken,
                    teamName: teamName,
                },
                success: function (response) {
                    $('.dropdown-menu').html('');
                    if (response.length) {
                        $('.team_match').hide();
                        $.each(response, function (index, value) {
                            var $html = '<li data-team-id=' + value.id + '><a href="#">' + value.team_name + '</a></li>';
                            $('.search_team .dropdown-menu').append($html);
                        });
                    }else{
                        $('.team_match').show();
                    }
                },
            });
        }else{
            $('.dropdown-menu').html('');
            $('.team_match').hide();
        }
    });

    $(document).on('click', '.dropdown-menu li', function () {
        var teamId = $(this).attr('data-team-id');
        var teamName = $(this).text();
        $('#id_connect_team_name').val(teamName);
        $('#team_profile').val(teamId);
    });

    $('#SaveTeamButton').on('click', function (e) {
        var teamId = $('#team_profile').val();
        var url = $(this).data('url');
        var position = $('#id_connect_position').val();
        var charge = $('#id_hourly_rate').val();
        var formValid = validateForm([
            '#id_connect_position',
            '#id_hourly_rate',
        ]);
        if(!teamId){
            $('.team_name_error').show();
        }else{
            $('.team_name_error').hide();
        }

        if(teamId && !formValid){
            $.ajax({
                url: url,
                method: 'POST',
                data: {
                    csrfmiddlewaretoken: window.csrftoken,
                    team_id: teamId,
                    connect_position: position,
                    hourly_rate: charge,
                },
                success: function (response) {
                    showNotifications("success", response.msg);
                    $('#connectTeam').modal('hide');
                },
                error: function (xhr, status, error) {
                    var response = jQuery.parseJSON(xhr.responseText)
                    showNotifications("error", response.msg);
                }
            });
        }
    });

})();