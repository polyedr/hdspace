(function () {
    'use strict';
    $('.deleteMember').on('click', function () {
        var url = $(this).data('url');
        var member = $(this).data('member-id');
        var team = $(this).data('team-id');
        var $member = $(this);
        $.ajax({
            url: url,
            method: 'POST',
            data: {
                csrfmiddlewaretoken: window.csrftoken,
                member: member,
                team: team,
            },
            success: function (response) {
                $member.closest('tr').remove();
                showNotifications("success", response.msg);
            },
        });
    });

    $('.activateMember').on('click', function () {
        var url = $(this).data('url');
        var member = $(this).data('member-id');
        var $member = $(this);
        $.ajax({
            url: url,
            method: 'POST',
            data: {
                csrfmiddlewaretoken: window.csrftoken,
                member: member,
            },
            success: function (response) {
                $member.remove();
                showNotifications("success", response.msg);
            },
        });
    });
})();