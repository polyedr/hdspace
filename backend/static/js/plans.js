(function () {
    'use strict';
    $('.plans').on('click', function (e) {
        window.plan = $(this).data("url");
    });

    $('#confirmPlan').on('click', function (e) {
        location.href = window.plan;
    });

})();