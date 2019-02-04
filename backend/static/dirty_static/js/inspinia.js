/*
 *
 *   INSPINIA - Responsive Admin Theme
 *   version 2.7.1
 *
 */
$(".text-muted").click(function(){
        $("#123").addClass("open");
    });



$(document).ready(function () {


    // Add body-small class if window less than 768px
    if ($(this).width() < 1200) {
        $('body').addClass('body-small');
    } else {
        $('body').removeClass('body-small');
    }

    // MetisMenu
    $('#side-menu').metisMenu();

    // Collapse ibox function
    $('.collapse-link').on('click', function () {
        var ibox = $(this).closest('div.ibox');
        var button = $(this).find('i');
        var content = ibox.children('.ibox-content');
        content.slideToggle(200);
        button.toggleClass('fa-chevron-up').toggleClass('fa-chevron-down');
        ibox.toggleClass('').toggleClass('border-bottom');
        setTimeout(function () {
            ibox.resize();
            ibox.find('[id^=map-]').resize();
        }, 50);
    });

    // Close ibox function
    $('.close-link').on('click', function () {
        var content = $(this).closest('div.ibox');
        content.remove();
    });

    // copy Div to expand and collapse
    function copyDiv() {
        var firstDivContent = document.getElementById('classContainer-selector');
        var secondDivContent = document.getElementById('fullscreen');
        secondDivContent.innerHTML = firstDivContent.innerHTML;
    }
    //Expand screen functionality
    $("#expand-fullscreen-link").click (function () {
        console.log('hi');
        console.log($(this)[0].children[0].className);
        $.when(ajaxGetFullScreen()).done(function (result) {
            copyDiv()
            console.log('see the result!')
            console.log(result)
            $('#li-compress').removeClass("active");
            $('html,body,#wrapper').scrollTop(0);
            $("#compress-fullscreen-link").removeClass("hide-content");
            $("#classContainer-selector").addClass("hide-content");
            $("#fullscreen").removeClass("hide-content");
            $("#wrapper").css("overflow-y", "hidden");
            $("#fullscreen").css("background-color", result)
        });
        function ajaxGetFullScreen() {
            return $.ajax({
                type: 'GET',
                url: 'page2',
                name: 'fullscreen',
                data: {'name': 'fullscreen'},
                success: function (data) {
                    result = data;
                },
                error: function (jqXHR, status, err) {
                    console.log(jqXHR.responseText);
                }
            });
        }
    });
    $("#compress-fullscreen-link").click (function () {
        $("#compress-fullscreen-link").addClass("hide-content");
        $("#fullscreen").addClass("hide-content");
        $("#classContainer-selector").removeClass("hide-content");
        $("#wrapper").css("overflow-y","unset");
        $('#li-compress').removeClass("active");

    });

    // $(".fa-compress").click (function () {
    //      $("#color-remove-fa-download-on-check").addClass("hide-content");
    //      $("#classContainer-selector").removeClass("hide-content");
    //      copyDiv();
    //      var button = $(this) ; //.find('i');
    //      button.toggleClass('fa-expand').toggleClass('fa-compress');
    // });




    // // Fullscreen ibox function
    // $('#fullscreen-link').on('click', function () {
    //     var ibox = $(this).closest('div.ibox');
    //     var button = $(this).find('i');
    //     $('body').toggleClass('fullscreen-ibox-mode');
    //     button.toggleClass('fa-expand').toggleClass('fa-compress');
    //     ibox.toggleClass('fullscreen');
    //     setTimeout(function () {
    //         $(window).trigger('resize');
    //     }, 100);
    // });

    // Close menu in canvas mode
    $('.close-canvas-menu').on('click', function () {
        $("body").toggleClass("mini-navbar");
        document.getElementById('navbar-header-adevi').style = 'height:95px;text-align:center;';
        document.getElementById('project-plus').style = 'background:transparent;border:none;margin-right: 9px;margin-left: 9px;margin-top: 14px;margin-bottom: 5px;position:absolute;display:none;';
        document.getElementById('project-link').style = 'display:inline-block;width:81%;';
        SmoothlyMenu();
    });

    // Run menu of canvas
    $('body.canvas-menu .sidebar-collapse').slimScroll({
        height: '100%',
        railOpacity: 0.9
    });

    // Open close right sidebar
    $('.right-sidebar-toggle').on('click', function () {
        $('#right-sidebar').toggleClass('sidebar-open');
        document.getElementById('right-sidebar').style = 'width:22%';
        document.getElementById('mid-sidebar').style.display = '';
        document.getElementById('full-sidebar').style.display = 'none';
        document.getElementById('mini-sidebar').style.display = 'none';
    });

    // Initialize slimscroll for right sidebar
    $('.sidebar-container').slimScroll({
        height: '100%',
        railOpacity: 0.4,
        wheelStep: 10
    });

    // Open close small chat
    $('.open-small-chat').on('click', function () {
        $(this).children().toggleClass('fa-comments').toggleClass('fa-remove');
        $('.small-chat-box').toggleClass('active');
    });

    // Initialize slimscroll for small chat
    $('.small-chat-box .content').slimScroll({
        height: '234px',
        railOpacity: 0.4
    });

    // Append config box / Only for demo purpose
    // Uncomment on server mode to enable XHR calls
    //$.get("skin-config.html", function (data) {
    //    if (!$('body').hasClass('no-skin-config'))
    //        $('body').append(data);
    //});

    // Minimalize menu
    $('#minimiserNav').on('click', function (event) {
        event.preventDefault();
        $("body").toggleClass("mini-navbar");
        document.getElementById('navbar-header-adevi').style = 'height:95px;text-align:center;';
        if ($('body').hasClass('mini-navbar')) {
            document.getElementById('project-plus').style.display = 'none';
            document.getElementById('navbar-header-adevi').style = 'height:95px;text-align:center;';
            // document.getElementById('allProjects1').style.visibility = 'visible';
        } else if (!$('body').hasClass('mini-navbar')) {
            document.getElementById('project-plus').style.display = '';
            document.getElementById('navbar-header-adevi').style = 'height: 156px; text-align: center;';
            // document.getElementById('allProjects1').style = 'visibility:visible; min-width:140px';
        } else {
            document.getElementById('project-plus').style = 'background:transparent;border:none;margin-right: 9px;margin-left: 9px;margin-top: 14px;margin-bottom: 5px;position:absolute;';
            document.getElementById('navbar-header-adevi').style = 'height:156px;text-align:center;';
            // document.getElementById('allProjects1').style = 'visibility:visible; min-width:140px';
        }
        // document.getElementById('project-link').style = 'display:inline-block;width:81%;';
        SmoothlyMenu();
    });

    // Minimalize menu for Validation
     $('#minimiserNavValidation').on('click', function (event) {
        event.preventDefault();
        $("body").toggleClass("mini-navbar");
        document.getElementById('navbar-header-adevi').style = 'height:95px;text-align:center;';
        SmoothlyMenu();
        document.getElementById('project-plus').style = 'background:transparent;border:none;margin-right:17px;margin-top:15px;position:absolute;display:none;';
        document.getElementById('project-link').style = 'display:inline-block;width:100%;';
    });



    // Tooltips demo
    $('.tooltip-demo').tooltip({
        selector: "[data-toggle=tooltip]",
        container: "body"
    });


    // Full height of sidebar
    function fix_height() {
        var heightWithoutNavbar = $("body > #wrapper").height() - 61;
        $(".sidebar-panel").css("min-height", heightWithoutNavbar + "px");

        var navbarheight = $('nav.navbar-default').height();
        var wrapperHeight = $('#page-wrapper').height();

        if (navbarheight > wrapperHeight) {
            $('#page-wrapper').css("min-height", navbarheight + "px");
        }

        if (navbarheight < wrapperHeight) {
            $('#page-wrapper').css("min-height", $(window).height() + "px");
        }

        if ($('body').hasClass('fixed-nav')) {
            if (navbarheight > wrapperHeight) {
                $('#page-wrapper').css("min-height", navbarheight + "px");
            } else {
                $('#page-wrapper').css("min-height", $(window).height() - 60 + "px");
            }
        }

    }

    fix_height();

    // Fixed Sidebar
    $(window).bind("load", function () {
        if ($("body").hasClass('fixed-sidebar')) {
            $('.sidebar-collapse').slimScroll({
                height: '100%',
                railOpacity: 0.9
            });
        }
    });

    // Move right sidebar top after scroll
    $(window).scroll(function () {
        if ($(window).scrollTop() > 0 && !$('body').hasClass('fixed-nav')) {
            $('#right-sidebar').addClass('sidebar-top');
        } else {
            $('#right-sidebar').removeClass('sidebar-top');
        }
    });

    $(window).bind("load resize scroll", function () {
        if (!$("body").hasClass('body-small')) {
            fix_height();
        }
    });

    $("[data-toggle=popover]")
        .popover();

    // Add slimscroll to element
    $('.full-height-scroll').slimscroll({
        height: '100%'
    })
});


// Minimalize menu when screen is less than 768px
$(window).bind("resize", function () {
    if ($(this).width() < 1130 && $(this).width() > 767) {
        $('body').addClass('body-small mini-navbar')
    } else {
        $('body').removeClass('body-small mini-navbar')
    };

    if ($(this).width() < 767) {
        $('body').addClass('body-small');
    } else {
        $('body').removeClass('body-small')
    };

    if ($(this).width() < 1300) {
        $('#layoutTitle').text('Layout');
        $('#colorTitle').text('Color');
    } else {
        $('#layoutTitle').text('Layout Variations');
        $('#colorTitle').text('Color Transfer');
    };

    if ($('body').hasClass('mini-navbar')) {
        document.getElementById('project-plus').style.display = 'none';
    } else {
        // document.getElementById('project-plus').style = 'background:transparent;border:none;margin-right: 9px;margin-left: 9px;margin-top: 14px;margin-bottom: 5px;position:absolute;';
    };
});

// Local Storage functions
// Set proper body class and plugins based on user configuration
$(document).ready(function () {
    if (localStorageSupport()) {

        var collapse = localStorage.getItem("collapse_menu");
        var fixedsidebar = localStorage.getItem("fixedsidebar");
        var fixednavbar = localStorage.getItem("fixednavbar");
        var boxedlayout = localStorage.getItem("boxedlayout");
        var fixedfooter = localStorage.getItem("fixedfooter");

        var body = $('body');

        if (fixedsidebar == 'on') {
            body.addClass('fixed-sidebar');
            $('.sidebar-collapse').slimScroll({
                height: '100%',
                railOpacity: 0.9
            });
        }

        if (collapse == 'on') {
            if (body.hasClass('fixed-sidebar')) {
                if (!body.hasClass('body-small')) {
                    body.addClass('mini-navbar');
                    document.getElementById('navbar-header-adevi').style = 'height:95px;text-align:center;';
                    // document.getElementById('project-plus').style = 'background:transparent;border:none;margin-right: 9px;margin-left: 9px;margin-top: 14px;margin-bottom: 5px;position:absolute;display:none;';
                    document.getElementById('project-link').style = 'display:inline-block;width:81%;';
                }
            } else {
                if (!body.hasClass('body-small')) {
                    body.addClass('mini-navbar');
                    document.getElementById('navbar-header-adevi').style = 'height:95px;text-align:center;';
                    // document.getElementById('project-plus').style = 'background:transparent;border:none;margin-right: 9px;margin-left: 9px;margin-top: 14px;margin-bottom: 5px;position:absolute;display:none;';
                    document.getElementById('project-link').style = 'display:inline-block;width:81%;';
                }

            }
        }

        if (fixednavbar == 'on') {
            $(".navbar-static-top").removeClass('navbar-static-top').addClass('navbar-fixed-top');
            body.addClass('fixed-nav');
        }

        if (boxedlayout == 'on') {
            body.addClass('boxed-layout');
        }

        if (fixedfooter == 'on') {
            $(".footer").addClass('fixed');
        }
    }
});

// check if browser support HTML5 local storage
function localStorageSupport() {
    return (('localStorage' in window) && window['localStorage'] !== null)
}

// // For demo purpose - animation css script
// function animationHover(element, animation) {
//     element = $(element);
//     element.hover(
//         function () {
//             element.addClass('animated ' + animation);
//         },
//         function () {
//             //wait for animation to finish before removing classes
//             window.setTimeout(function () {
//                 element.removeClass('animated ' + animation);
//             }, 2000);
//         });
// }

function SmoothlyMenu() {
    if (!$('body').hasClass('mini-navbar') || $('body').hasClass('body-small')) {
        // Hide menu in order to smoothly turn on when maximize menu
        $('#general-contain').removeClass('general-size-laptop-minimise').addClass('general-size-laptop');
        document.getElementById('navbar-header-adevi').style = 'height:156px;text-align:center;';
        document.getElementById('project-plus').style = 'background:transparent;border:none;margin: 1px 1px 1px 65px;position:absolute;';
        // document.getElementById('project-link').style = 'display:inline-block;width:81%;';
        // For smoothly turn on menu
        setTimeout(
            function () {
                $('#side-menu').fadeIn(400);
            }, 200);
        $('#side-menu').hide();
    } else if ($('body').hasClass('fixed-sidebar')) {
        $('#side-menu').hide();
        setTimeout(
            function () {
                $('#side-menu').fadeIn(400);
            }, 100);
    } else {
        // Remove all inline style from jquery fadeIn function to reset menu state
        $('#side-menu').removeAttr('style');
        $('#general-contain').removeClass('general-size-laptop').addClass('general-size-laptop-minimise');
    }
}

// Dragable panels
function WinMove() {
    var element = "[class*=col]";
    var handle = ".ibox-title";
    var connect = "[class*=col]";
    $(element).sortable(
        {
            handle: handle,
            connectWith: connect,
            tolerance: 'pointer',
            forcePlaceholderSize: true,
            opacity: 0.8
        })
        .disableSelection();
}

function projectHover() {
    if ($('body').hasClass('pace-done mini-navbar') && $('#projectSelector').hasClass('active')) {
        document.getElementById('hoverList').style.display = '';
    }
    else {
        document.getElementById('hoverList').style.display = 'none';
    }
}

