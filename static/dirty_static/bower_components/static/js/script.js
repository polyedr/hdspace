
$(document).ready(function(){
    // main content toolbar on click functioning
    $("#btn-rotate-screen").click(function(){
        $("#option-container").children().hide();
        //ADD ROTATE SCREEN FUNCTIONALITY
    });
    $("#btn-custom-asset").click(function(){
        $("#option-container").children().hide();
        $("#panel-custom-asset").show();
    });
    $("#btn-edit-layout").click(function(){
        $("#option-container").children().hide();
        $("#panel-edit-layout").show();
    });
    $("#btn-select-font").click(function(){
        alert("button custom asset clicked")
    });
    $("#btn-select-colours").click(function(){
        alert("button custom asset clicked")
    });
    $("#btn-add-widget").click(function(){
        alert("button custom asset clicked")
    });


    // Navbar on click functioning

    $("#device-options").children().click(function() {
        $("#device-options").children().children().css("color", "#d9d9d9");
        // light grey
        var btnClicked = $(this);
        btnClicked.children().css("color", "DarkCyan");

        if (btnClicked.attr('id')=="btn-laptop") {
            $("#btn-rotate-screen").hide();
            $("#phone-size-selection1").hide();
            $("#phone-size-selection2").hide();
            $("#phone-size-selection3").hide();
            $("#phone-size-selection4").hide();
            $("#phone-size-selection5").hide();
            $("#phone-size-selection6").hide();
            $("#phone-size-selection7").hide();
            $("#phone-size-selection8").hide();
            $("#phone-size-selection9").hide();
            $("#phone-size-selection10").hide();
            $("#phone-size-selection11").hide();
            $("#phone-size-selection12").hide();
            $("#phone-size-selection13").hide();
            $("#phone-size-selection14").hide();
            $("#phone-size-selection15").hide();
            $("#phone-size-selection16").hide();
            $("#phone-size-selection17").hide();
            $("#phone-size-selection18").hide();
            $("#phone-size-selection19").hide();
            $("#phone-size-selection20").hide();
            $("#phone-size-selection21").hide();
            $("#phone-size-selection22").hide();
            $("#phone-size-selection23").hide();
            $("#phone-size-selection24").hide();
            $("#phone-size-selection25").hide();
            $("#phone-size-selection26").hide();
            $("#phone-size-selection27").hide();
            $("#phone-size-selection28").hide();
            $("#phone-size-selection29").hide();
            $("#phone-size-selection30").hide();
            $("#phone-size-selection31").hide();
            $("#phone-size-selection32").hide();
            $("#tablet-size-selection1").hide();
            $("#tablet-size-selection2").hide();
            $("#tablet-size-selection3").hide();
            $("#tablet-size-selection4").hide();
            $("#tablet-size-selection5").hide();
            $("#tablet-size-selection6").hide();
            $("#tablet-size-selection7").hide();
            $("#tablet-size-selection8").hide();
            $("#tablet-size-selection9").hide();
            $("#tablet-size-selection10").hide();
            $("#tablet-size-selection11").hide();
            $("#tablet-size-selection12").hide();
            $("#tablet-size-selection13").hide();
            $("#tablet-size-selection14").hide();
            $("#tablet-size-selection15").hide();
            $("#tablet-size-selection16").hide();
            $("#tablet-size-selection17").hide();
            $("#tablet-size-selection18").hide();
            $("#tablet-size-selection19").hide();
            $("#tablet-size-selection20").hide();
            $("#laptop-size-selection1").show();
            $("#laptop-size-selection2").show();
            $("#laptop-size-selection3").show();
            $("#laptop-size-selection4").show();
            $("#laptop-size-selection5").show();
            $("#laptop-size-selection6").show();
            $("#laptop-size-selection7").show();
            displayLaptop();
        }
        else if (btnClicked.attr('id')=="btn-tablet") {

            $("#btn-rotate-screen").show();
            $("#phone-size-selection1").hide();
            $("#phone-size-selection2").hide();
            $("#phone-size-selection3").hide();
            $("#phone-size-selection4").hide();
            $("#phone-size-selection5").hide();
            $("#phone-size-selection6").hide();
            $("#phone-size-selection7").hide();
            $("#phone-size-selection8").hide();
            $("#phone-size-selection9").hide();
            $("#phone-size-selection10").hide();
            $("#phone-size-selection11").hide();
            $("#phone-size-selection12").hide();
            $("#phone-size-selection13").hide();
            $("#phone-size-selection14").hide();
            $("#phone-size-selection15").hide();
            $("#phone-size-selection16").hide();
            $("#phone-size-selection17").hide();
            $("#phone-size-selection18").hide();
            $("#phone-size-selection19").hide();
            $("#phone-size-selection20").hide();
            $("#phone-size-selection21").hide();
            $("#phone-size-selection22").hide();
            $("#phone-size-selection23").hide();
            $("#phone-size-selection24").hide();
            $("#phone-size-selection25").hide();
            $("#phone-size-selection26").hide();
            $("#phone-size-selection27").hide();
            $("#phone-size-selection28").hide();
            $("#phone-size-selection29").hide();
            $("#phone-size-selection30").hide();
            $("#phone-size-selection31").hide();
            $("#phone-size-selection32").hide();
            $("#tablet-size-selection1").show();
            $("#tablet-size-selection2").show();
            $("#tablet-size-selection3").show();
            $("#tablet-size-selection4").show();
            $("#tablet-size-selection5").show();
            $("#tablet-size-selection6").show();
            $("#tablet-size-selection7").show();
            $("#tablet-size-selection8").show();
            $("#tablet-size-selection9").show();
            $("#tablet-size-selection10").show();
            $("#tablet-size-selection11").show();
            $("#tablet-size-selection12").show();
            $("#tablet-size-selection13").show();
            $("#tablet-size-selection14").show();
            $("#tablet-size-selection15").show();
            $("#tablet-size-selection16").show();
            $("#tablet-size-selection17").show();
            $("#tablet-size-selection18").show();
            $("#tablet-size-selection19").show();
            $("#tablet-size-selection20").show();
            $("#laptop-size-selection1").hide();
            $("#laptop-size-selection2").hide();
            $("#laptop-size-selection3").hide();
            $("#laptop-size-selection4").hide();
            $("#laptop-size-selection5").hide();
            $("#laptop-size-selection6").hide();
            $("#laptop-size-selection7").hide();
           displayTablet();
        }
        else if (btnClicked.attr('id')=="btn-mobile") {
            $("#btn-rotate-screen").show();
            $("#phone-size-selection1").show();
            $("#phone-size-selection2").show();
            $("#phone-size-selection3").show();
            $("#phone-size-selection4").show();
            $("#phone-size-selection5").show();
            $("#phone-size-selection6").show();
            $("#phone-size-selection7").show();
            $("#phone-size-selection8").show();
            $("#phone-size-selection9").show();
            $("#phone-size-selection10").show();
            $("#phone-size-selection11").show();
            $("#phone-size-selection12").show();
            $("#phone-size-selection13").show();
            $("#phone-size-selection14").show();
            $("#phone-size-selection15").show();
            $("#phone-size-selection16").show();
            $("#phone-size-selection17").show();
            $("#phone-size-selection18").show();
            $("#phone-size-selection19").show();
            $("#phone-size-selection20").show();
            $("#phone-size-selection21").show();
            $("#phone-size-selection22").show();
            $("#phone-size-selection23").show();
            $("#phone-size-selection24").show();
            $("#phone-size-selection25").show();
            $("#phone-size-selection26").show();
            $("#phone-size-selection27").show();
            $("#phone-size-selection28").show();
            $("#phone-size-selection29").show();
            $("#phone-size-selection30").show();
            $("#phone-size-selection31").show();
            $("#phone-size-selection32").show();
            $("#tablet-size-selection1").hide();
            $("#tablet-size-selection2").hide();
            $("#tablet-size-selection3").hide();
            $("#tablet-size-selection4").hide();
            $("#tablet-size-selection5").hide();
            $("#tablet-size-selection6").hide();
            $("#tablet-size-selection7").hide();
            $("#tablet-size-selection8").hide();
            $("#tablet-size-selection9").hide();
            $("#tablet-size-selection10").hide();
            $("#tablet-size-selection11").hide();
            $("#tablet-size-selection12").hide();
            $("#tablet-size-selection13").hide();
            $("#tablet-size-selection14").hide();
            $("#tablet-size-selection15").hide();
            $("#tablet-size-selection16").hide();
            $("#tablet-size-selection17").hide();
            $("#tablet-size-selection18").hide();
            $("#tablet-size-selection19").hide();
            $("#tablet-size-selection20").hide();
            $("#laptop-size-selection1").hide();
            $("#laptop-size-selection2").hide();
            $("#laptop-size-selection3").hide();
            $("#laptop-size-selection4").hide();
            $("#laptop-size-selection5").hide();
            $("#laptop-size-selection6").hide();
            $("#laptop-size-selection7").hide();
            displayMobile();
        }
    });


    //adjustment to individual display type

    function displayLaptop(){
        $("#device-frame").removeClass("size-tablet size-mobile").addClass("size-laptop");
        $("#device-frame").removeClass("background-laptop-chromebook11 " +
            "background-tablet-ipad " +
            "background-tablet-surfacePro4 " +
            "background-tablet background-mobile " +
            "background-mobile-iphone " +
            "background-mobile-iphone4 " +
            "background-mobile-nexus4 " +
            "background-mobile-androidOne " +
            "background-mobile-googlePixel").addClass("background-laptop");
        $("#general-contain").removeClass("general-size-tablet general-size-mobile").addClass("general-size-laptop");
        $("#container-inside-frame").removeClass("content-inside-frame-laptop-size1 " +
            "content-inside-frame-laptop-size2 " +
            "content-inside-frame-laptop-size3 " +
            "content-inside-frame-laptop-size4 " +
            "content-inside-frame-tablet-size1 " +
            "content-inside-frame-tablet-size2 " +
            "content-inside-frame-tablet-size3 " +
            "content-inside-frame-tablet-size4 " +
            "content-inside-frame-tablet-size5 " +
            "content-inside-frame-tablet-size6 " +
            "content-inside-frame-tablet-size7 " +
            "content-inside-frame-tablet-size8 " +
            "content-inside-frame-tablet-size9 " +
            "content-inside-frame-tablet " +
            "content-inside-frame-mobile " +
            "content-inside-frame-mobile-size1 " +
            "content-inside-frame-mobile-size2 " +
            "content-inside-frame-mobile-size3 " +
            "content-inside-frame-mobile-size4 " +
            "content-inside-frame-mobile-size5 " +
            "content-inside-frame-mobile-size6 " +
            "content-inside-frame-mobile-size7 " +
            "content-inside-frame-mobile-size8").addClass("content-inside-frame-laptop");
        $(".container-main-content:first-child").css("style","20%");
        $(".container-main-content:last-child").css("style","20%")
    }
    function displayTablet(){
        $("#device-frame").removeClass("size-laptop size-mobile").addClass("size-tablet");
        $("#device-frame").removeClass("background-laptop-chromebook11 " +
            "background-tablet-ipad " +
            "background-tablet-surfacePro4 " +
            "background-laptop " +
            "background-mobile " +
            "background-mobile-iphone " +
            "background-mobile-iphone4 " +
            "background-mobile-nexus4 " +
            "background-mobile-androidOne " +
            "background-mobile-googlePixel").addClass("background-tablet");
        $("#general-contain").removeClass("general-size-laptop general-size-mobile").addClass("general-size-tablet");
        $("#container-inside-frame").removeClass("content-inside-frame-laptop-size1 " +
            "content-inside-frame-laptop-size2 " +
            "content-inside-frame-laptop-size3 " +
            "content-inside-frame-laptop-size4 " +
            "content-inside-frame-tablet-size1 " +
            "content-inside-frame-tablet-size2 " +
            "content-inside-frame-tablet-size3 " +
            "content-inside-frame-tablet-size4 " +
            "content-inside-frame-tablet-size5 " +
            "content-inside-frame-tablet-size6 " +
            "content-inside-frame-tablet-size7 " +
            "content-inside-frame-tablet-size8 " +
            "content-inside-frame-tablet-size9 " +
            "content-inside-frame-mobile " +
            "content-inside-frame-mobile-size1 " +
            "content-inside-frame-mobile-size2 " +
            "content-inside-frame-mobile-size3 " +
            "content-inside-frame-mobile-size4 " +
            "content-inside-frame-mobile-size5 " +
            "content-inside-frame-mobile-size6 " +
            "content-inside-frame-mobile-size7 " +
            "content-inside-frame-mobile-size8 " +
            "content-inside-frame-laptop").addClass("content-inside-frame-tablet");
        $(".container-main-content:first-child").css("style","27%");
        $(".container-main-content:last-child").css("style","27%")
    }
    function displayMobile(){
        $("#device-frame").removeClass("size-tablet size-laptop").addClass("size-mobile");
        $("#device-frame").removeClass("background-laptop-chromebook11 " +
            "background-tablet-ipad " +
            "background-tablet-surfacePro4 " +
            "background-tablet " +
            "background-laptop " +
            "background-mobile-iphone " +
            "background-mobile-iphone4 " +
            "background-mobile-nexus4 " +
            "background-mobile-androidOne " +
            "background-mobile-googlePixel").addClass("background-mobile");
        $("#general-contain").removeClass("general-size-tablet general-size-laptop").addClass("general-size-mobile");
        $("#container-inside-frame").removeClass("content-inside-frame-laptop-size1 " +
            "content-inside-frame-laptop-size2 " +
            "content-inside-frame-laptop-size3 " +
            "content-inside-frame-laptop-size4 " +
            "content-inside-frame-tablet " +
            "content-inside-frame-tablet-size1 " +
            "content-inside-frame-tablet-size2 " +
            "content-inside-frame-tablet-size3 " +
            "content-inside-frame-tablet-size4 " +
            "content-inside-frame-tablet-size5 " +
            "content-inside-frame-tablet-size6 " +
            "content-inside-frame-tablet-size7 " +
            "content-inside-frame-tablet-size8 " +
            "content-inside-frame-tablet-size9 " +
            "content-inside-frame-mobile-size1 " +
            "content-inside-frame-mobile-size2 " +
            "content-inside-frame-mobile-size3 " +
            "content-inside-frame-mobile-size4 " +
            "content-inside-frame-mobile-size5 " +
            "content-inside-frame-mobile-size6 " +
            "content-inside-frame-mobile-size7 " +
            "content-inside-frame-mobile-size8 " +
            "content-inside-frame-laptop " +
            "content-inside-frame-tablet").addClass("content-inside-frame-mobile");
        $(".container-main-content:last-child").css("style","35%")
    }

    function copyDiv() {
        var firstDivContent = document.getElementById('container-inside-frame');
        var secondDivContent = document.getElementById('container-inside-frame-top');
        secondDivContent.innerHTML = firstDivContent.innerHTML;
    }

    function copyslide ( idslide )
    {
      var firstDivContent = document.getElementById(idslide);
      var secondDivContent = document.getElementById('container-inside-frame');
      secondDivContent.innerHTML = firstDivContent.innerHTML;
    }

        $("#btn-full-screen").click (function () {
            $("#container-inside-frame-top").removeClass("hide-content");
            $("#btn-full-screen").addClass("hide-content");
            $("#btn-full-screen2").removeClass("hide-content");
            copyDiv();


         });

        $("#slide1").click ( function() {
              const elem1 = "slide1";
              copyslide(elem1)
          });

        $("#slide2").click ( function () {
              const elem2 = "slide2";
              copyslide(elem2)
          });

        $("#btn-full-screen2").click (function (){
              $("#container-inside-frame-top").addClass("hide-content");
              $("#btn-full-screen2").addClass("hide-content");
              $("#btn-full-screen").removeClass("hide-content");
});

        $( "#body" ).keydown(function() {
            $("#container-inside-frame-top").addClass("hide-content");
            $("#btn-full-screen2").addClass("hide-content");
            $("#btn-full-screen").removeClass("hide-content");
            /*( function() {
            var elem1 = document.getElementById("#container-inside-frame-top");
            var elem2 = document.getElementById("#container-inside-frame");
            if (elem1. != elem2.htmlText){
               elem1.htmlText = elem2.htmlText ;
            } });*/
            });


    $( function() {
    $( "#sortable" ).sortable({
      revert: true
    });
    $( "#draggable" ).draggable({
      connectToSortable: "#sortable",
      helper: "clone",
      revert: "invalid"
    });
    $( "ul, li" ).disableSelection();
  } );


     /* MOBILE SIZE SCREEN */

    $(".size19-29").click(function(){
        $("#container-inside-frame").removeClass("content-inside-frame-mobile " +
            "content-inside-frame-mobile-size2 " +
            "content-inside-frame-mobile-size3 " +
            "content-inside-frame-mobile-size4 " +
            "content-inside-frame-mobile-size5 " +
            "content-inside-frame-mobile-size6 " +
            "content-inside-frame-mobile-size7 " +
            "content-inside-frame-mobile-size8").addClass("content-inside-frame-mobile-size1");
    });

    $(".size20-29").click(function(){
        $("#container-inside-frame").removeClass("content-inside-frame-mobile " +
            "content-inside-frame-mobile-size1 " +
            "content-inside-frame-mobile-size3 " +
            "content-inside-frame-mobile-size4 " +
            "content-inside-frame-mobile-size5 " +
            "content-inside-frame-mobile-size6 " +
            "content-inside-frame-mobile-size7 " +
            "content-inside-frame-mobile-size8").addClass("content-inside-frame-mobile-size2");
    });

    $(".size32-40").click(function(){
        $("#container-inside-frame").removeClass("content-inside-frame-mobile " +
            "content-inside-frame-mobile-size2 " +
            "content-inside-frame-mobile-size1 " +
            "content-inside-frame-mobile-size4 " +
            "content-inside-frame-mobile-size5 " +
            "content-inside-frame-mobile-size6 " +
            "content-inside-frame-mobile-size7 " +
            "content-inside-frame-mobile-size8").addClass("content-inside-frame-mobile-size3");
    });
    $(".size22-39").click(function(){
        $("#container-inside-frame").removeClass("content-inside-frame-mobile " +
            "content-inside-frame-mobile-size2 " +
            "content-inside-frame-mobile-size3 " +
            "content-inside-frame-mobile-size1 " +
            "content-inside-frame-mobile-size5 " +
            "content-inside-frame-mobile-size6 " +
            "content-inside-frame-mobile-size7 " +
            "content-inside-frame-mobile-size8").addClass("content-inside-frame-mobile-size4");
    });
    $(".size25-44").click(function(){
        $("#container-inside-frame").removeClass("content-inside-frame-mobile " +
            "content-inside-frame-mobile-size2 " +
            "content-inside-frame-mobile-size3 " +
            "content-inside-frame-mobile-size4 " +
            "content-inside-frame-mobile-size1 " +
            "content-inside-frame-mobile-size6 " +
            "content-inside-frame-mobile-size7 " +
            "content-inside-frame-mobile-size8").addClass("content-inside-frame-mobile-size5");
    });
    $(".size480-853").click(function(){
        $("#container-inside-frame").removeClass("content-inside-frame-mobile " +
            "content-inside-frame-mobile-size2 " +
            "content-inside-frame-mobile-size3 " +
            "content-inside-frame-mobile-size4 " +
            "content-inside-frame-mobile-size5 " +
            "content-inside-frame-mobile-size1 " +
            "content-inside-frame-mobile-size7 " +
            "content-inside-frame-mobile-size8").addClass("content-inside-frame-mobile-size6");
    });
    $(".size384-640").click(function(){
        $("#container-inside-frame").removeClass("content-inside-frame-mobile " +
            "content-inside-frame-mobile-size2 " +
            "content-inside-frame-mobile-size3 " +
            "content-inside-frame-mobile-size4 " +
            "content-inside-frame-mobile-size5 " +
            "content-inside-frame-mobile-size6 " +
            "content-inside-frame-mobile-size1 " +
            "content-inside-frame-mobile-size8").addClass("content-inside-frame-mobile-size7");
    });
    $(".size540-960").click(function(){
        $("#container-inside-frame").removeClass("content-inside-frame-mobile " +
            "content-inside-frame-mobile-size2 " +
            "content-inside-frame-mobile-size3 " +
            "content-inside-frame-mobile-size4 " +
            "content-inside-frame-mobile-size5 " +
            "content-inside-frame-mobile-size6 " +
            "content-inside-frame-mobile-size7 " +
            "content-inside-frame-mobile-size1").addClass("content-inside-frame-mobile-size8");
    });

    /* MOBILE BACKGROUNDS */


    $(".imgIphone").click(function(){
        $("#device-frame").removeClass("background-laptop-chromebook11 " +
            "background-tablet " +
            "background-laptop " +
            "background-mobile " +
            "background-mobile-iphone4 " +
            "background-mobile-nexus4 " +
            "background-mobile-androidOne " +
            "background-mobile-googlePixel " +
            "background-tablet-surfacePro4").addClass("background-mobile-iphone");
    });
    $(".imgIphone4").click(function(){
        $("#device-frame").removeClass("background-laptop-chromebook11 " +
            "background-tablet " +
            "background-laptop " +
            "background-mobile " +
            "background-mobile-iphone " +
            "background-mobile-nexus4 " +
            "background-mobile-androidOne " +
            "background-mobile-googlePixel " +
            "background-tablet-surfacePro4").addClass("background-mobile-iphone4");
    });
    $(".imgNexus4").click(function(){
        $("#device-frame").removeClass("background-laptop-chromebook11 " +
            "background-tablet " +
            "background-laptop " +
            "background-mobile " +
            "background-mobile-iphone " +
            "background-mobile-iphone4 " +
            "background-mobile-androidOne " +
            "background-mobile-googlePixel " +
            "background-tablet-surfacePro4").addClass("background-mobile-nexus4");
    });
    $(".imgAndroidOne").click(function(){
        $("#device-frame").removeClass("background-laptop-chromebook11 " +
            "background-tablet " +
            "background-laptop " +
            "background-mobile " +
            "background-mobile-iphone " +
            "background-mobile-iphone4 " +
            "background-mobile-nexus4 " +
            "background-mobile-googlePixel " +
            "background-tablet-surfacePro4").addClass("background-mobile-androidOne");
    });
    $(".imgGooglePixel").click(function(){
        $("#device-frame").removeClass("background-laptop-chromebook11 " +
            "background-tablet " +
            "background-laptop " +
            "background-mobile " +
            "background-mobile-iphone " +
            "background-mobile-iphone4 " +
            "background-mobile-nexus4 " +
            "background-mobile-androidOne " +
            "background-tablet-surfacePro4").addClass("background-mobile-googlePixel");
    });


    /* LAPTOP SIZE SCREEN */


    $(".size101-57").click(function(){
        $("#container-inside-frame").removeClass("content-inside-frame-laptop " +
            "content-inside-frame-laptop-size2 " +
            "content-inside-frame-laptop-size3 " +
            "content-inside-frame-laptop-size4 " +
            "background-tablet-ipad").addClass("content-inside-frame-laptop-size1");
    });

    $(".size1280-850").click(function(){
        $("#container-inside-frame").removeClass("content-inside-frame-laptop " +
            "content-inside-frame-laptop-size1 " +
            "content-inside-frame-laptop-size3 " +
            "content-inside-frame-laptop-size4 " +
            "background-tablet-ipad").addClass("content-inside-frame-laptop-size2");
    });

    $(".size1280-800").click(function(){
        $("#container-inside-frame").removeClass("content-inside-frame-laptop " +
            "content-inside-frame-laptop-size2 " +
            "content-inside-frame-laptop-size1 " +
            "content-inside-frame-laptop-size4 " +
            "background-tablet-ipad").addClass("content-inside-frame-laptop-size3");
    });
    $(".size1440-900").click(function(){
        $("#container-inside-frame").removeClass("content-inside-frame-laptop " +
            "content-inside-frame-laptop-size2 " +
            "content-inside-frame-laptop-size3 " +
            "content-inside-frame-laptop-size1 " +
            "background-tablet-ipad").addClass("content-inside-frame-laptop-size4");
    });

    /* TABLET BACKGROUNDS */


    $(".imgChromebook11").click(function(){
        $("#device-frame").removeClass("background-tablet " +
            "background-laptop " +
            "background-mobile " +
            "background-mobile-iphone4 " +
            "background-mobile-nexus4 " +
            "background-mobile-androidOne " +
            "background-mobile-googlePixel " +
            "background-mobile-googlePixel " +
            "background-tablet-ipad " +
            "background-tablet-surfacePro4").addClass("background-laptop-chromebook11");
    });


    /* TABLET SIZE SCREEN */


    $(".size103-69").click(function(){
        $("#container-inside-frame").removeClass("content-inside-frame-tablet " +
            "content-inside-frame-tablet-size2 " +
            "content-inside-frame-tablet-size3 " +
            "content-inside-frame-tablet-size4 " +
            "content-inside-frame-tablet-size5 " +
            "content-inside-frame-tablet-size6 " +
            "content-inside-frame-tablet-size7 " +
            "content-inside-frame-tablet-size8 " +
            "content-inside-frame-tablet-size9").addClass("content-inside-frame-tablet-size1");
    });

    $(".size58-78").click(function(){
        $("#container-inside-frame").removeClass("content-inside-frame-tablet " +
            "content-inside-frame-tablet-size1 " +
            "content-inside-frame-tablet-size3 " +
            "content-inside-frame-tablet-size4 " +
            "content-inside-frame-tablet-size5 " +
            "content-inside-frame-tablet-size6 " +
            "content-inside-frame-tablet-size7 " +
            "content-inside-frame-tablet-size8 " +
            "content-inside-frame-tablet-size9").addClass("content-inside-frame-tablet-size2");
    });

    $(".size1024-1366").click(function(){
        $("#container-inside-frame").removeClass("content-inside-frame-tablet " +
            "content-inside-frame-tablet-size2 " +
            "content-inside-frame-tablet-size1 " +
            "content-inside-frame-tablet-size4 " +
            "content-inside-frame-tablet-size5 " +
            "content-inside-frame-tablet-size6 " +
            "content-inside-frame-tablet-size7 " +
            "content-inside-frame-tablet-size8 " +
            "content-inside-frame-tablet-size9").addClass("content-inside-frame-tablet-size3");
    });
    $(".size410-960").click(function(){
        $("#container-inside-frame").removeClass("content-inside-frame-tablet " +
            "content-inside-frame-tablet-size2 " +
            "content-inside-frame-tablet-size3 " +
            "content-inside-frame-tablet-size1 " +
            "content-inside-frame-tablet-size5 " +
            "content-inside-frame-tablet-size6 " +
            "content-inside-frame-tablet-size7 " +
            "content-inside-frame-tablet-size8 " +
            "content-inside-frame-tablet-size9").addClass("content-inside-frame-tablet-size4");
    });
    $(".size600-960").click(function(){
        $("#container-inside-frame").removeClass("content-inside-frame-tablet " +
            "content-inside-frame-tablet-size2 " +
            "content-inside-frame-tablet-size3 " +
            "content-inside-frame-tablet-size4 " +
            "content-inside-frame-tablet-size1 " +
            "content-inside-frame-tablet-size6 " +
            "content-inside-frame-tablet-size7 " +
            "content-inside-frame-tablet-size8 " +
            "content-inside-frame-tablet-size9").addClass("content-inside-frame-tablet-size5");
    });
    $(".size768-1366").click(function(){
        $("#container-inside-frame").removeClass("content-inside-frame-tablet " +
            "content-inside-frame-tablet-size2 " +
            "content-inside-frame-tablet-size3 " +
            "content-inside-frame-tablet-size4 " +
            "content-inside-frame-tablet-size5 " +
            "content-inside-frame-tablet-size1 " +
            "content-inside-frame-tablet-size7 " +
            "content-inside-frame-tablet-size8 " +
            "content-inside-frame-tablet-size9").addClass("content-inside-frame-tablet-size6");
    });
    $(".size1000-1500").click(function(){
        $("#container-inside-frame").removeClass("content-inside-frame-tablet " +
            "content-inside-frame-tablet-size2 " +
            "content-inside-frame-tablet-size3 " +
            "content-inside-frame-tablet-size4 " +
            "content-inside-frame-tablet-size5 " +
            "content-inside-frame-tablet-size6 " +
            "content-inside-frame-tablet-size1 " +
            "content-inside-frame-tablet-size8 " +
            "content-inside-frame-tablet-size9").addClass("content-inside-frame-tablet-size7");
    });
    $(".size960-1440").click(function(){
        $("#container-inside-frame").removeClass("content-inside-frame-tablet " +
            "content-inside-frame-tablet-size2 " +
            "content-inside-frame-tablet-size3 " +
            "content-inside-frame-tablet-size4 " +
            "content-inside-frame-tablet-size5 " +
            "content-inside-frame-tablet-size6 " +
            "content-inside-frame-tablet-size7 " +
            "content-inside-frame-tablet-size1 " +
            "content-inside-frame-tablet-size9").addClass("content-inside-frame-tablet-size8");
    });
    $(".size912-1368").click(function(){
        $("#container-inside-frame").removeClass("content-inside-frame-tablet " +
            "content-inside-frame-tablet-size2 " +
            "content-inside-frame-tablet-size3 " +
            "content-inside-frame-tablet-size4 " +
            "content-inside-frame-tablet-size5 " +
            "content-inside-frame-tablet-size6 " +
            "content-inside-frame-tablet-size7 " +
            "content-inside-frame-tablet-size8 " +
            "content-inside-frame-tablet-size1").addClass("content-inside-frame-tablet-size9");
    });

     /* TABLET BACKGROUNDS */

    $(".imgSurfacePro4").click(function(){
        $("#device-frame").removeClass("background-laptop-chromebook11 " +
            "background-tablet " +
            "background-laptop " +
            "background-mobile " +
            "background-mobile-iphone4 " +
            "background-mobile-nexus4 " +
            "background-mobile-androidOne " +
            "background-mobile-googlePixel " +
            "background-tablet-ipad").addClass("background-tablet-surfacePro4");
    });
    $(".imgIpad").click(function(){
        $("#device-frame").removeClass("background-laptop-chromebook11 " +
            "background-tablet " +
            "background-laptop " +
            "background-mobile " +
            "background-mobile-iphone4 " +
            "background-mobile-nexus4 " +
            "background-mobile-androidOne " +
            "background-mobile-googlePixel " +
            "background-tablet-surfacePro4").addClass("background-tablet-ipad");
    });

    /*
    $(".general-size-mobile").hover(function(){
        $("#wrapper").addClass("overflowWrapperFixed")
    });
    $(".general-size-laptop").hover(function(){
        $("#wrapper").addClass("overflowWrapperFixed")
    });
    $(".general-size-tablet").hover(function(){
        $("#wrapper").addClass("overflowWrapperFixed")
    });
    */

    /*jonathan*/
    var step = 120;
    var scrolling = false;

    // Wire up events for the 'scrollUp' link:
    $("#scrollUp").bind("click", function(event) {

        event.preventDefault();
        // Animates the scrollTop property by the specified
        // step.
        $("#sortable").animate({
            scrollTop: "-=" + step * 2 + "px"

        });

    }).bind("mouseover", function(event) {
        scrolling = true;
        scrollContent("up");
    }).bind("mouseout", function(event) {
        scrolling = false;
    });

    $("#scrollDown").bind("click", function(event) {
        event.preventDefault();
        $("#sortable").animate({
            scrollTop: "+=" + step * 2 + "px"
        });
    }).bind("mouseover", function(event) {
        scrolling = true;
        scrollContent("down");
    }).bind("mouseout", function(event) {
        scrolling = false;
    });

    function scrollContent(direction) {
        var amount = (direction === "up" ? "-=5px" : "+=5px");
        $("#sortable").animate({
            scrollTop: amount
        }, 1, function() {
            if (scrolling) {
                scrollContent(direction);
            }
        });
    }

    $("#addslide").click(function() {

        var nslide = document.getElementById("sortable");
        var numslide = nslide.childElementCount;

        numslide = numslide;
        var nameslide = String("slide" + numslide);
        var newslide = document.createElement("LI");
        newslide.setAttribute("id", nameslide);
        newslide.setAttribute("class", "size-slide");
        newslide.setAttribute("href", "#");
        newslide.setAttribute("onclick", "reply_click(this.id)");

        nslide = nslide.appendChild(newslide);

    });

    function removedragg(elem2) {
        elem2.removeAttribute("draggable");
        elem2.setAttribute("class", " switcher ui-state-active");
        console.log(elem2);

    }

    $("#buttonswitch").mouseup(function() {

        var elem = document.getElementById('buttonswitch');
        var elems = document.getElementById("containerinsideframe").children;

        console.log(elems);

        if (elem.innerText == 'draggable') {
            elem.innerText = 'resize';
            var i;
            for (i = 0; i < elems.length; i++) {

                var elemid = elems[i].id;
                console.log(elemid);
                var elem2 = document.getElementById(elemid);
                console.log(elem2);
                removedragg(elem2);

            }
        } else {
            elem.innerText = 'draggable';
            for (i = 0; i < elems.length; i++) {

                var elem2 = document.getElementById(elems[i].id);
                elem2.setAttribute("class", "draggable switcher");
                console.log(elem2 + "rajoute");

            }

        }

    });


    $( "#pi1" ).resizable({
      containment: "#containerinsideframe"
    });

    $( "#1234" ).resizable({
      containment: "#containerinsideframe"
    });

    $( "#id597d34226d5075031cf168e1" ).resizable({
      containment: "#container-inside-frame"
    });
    //resize function

    $( "#child" ).resizable({
      containment: "#parent"
    });

    /* double click
     */
    var editing = false;

    function catchIt(e) {
        if (editing) return;
        if (!document.getElementById || !document.createElement) return;
        if (!e) var obj = window.event.srcElement;
        else var obj = e.target;

        while (obj.nodeType != 1) {//Find the tag or element node of event source
            obj = obj.parentNode;
        }
        //If still on text area, do nothing
        if (obj.tagName == 'TEXTAREA' || obj.tagName == 'A') return;
        //Select the HTML elements that are classified as valid to edit, else keep tranverse up its parents
        //valid element -> list, label, button, paragraph
        while (obj.nodeName != 'LI' && obj.nodeName != 'LABEL' && obj.nodeName != 'BUTTON' && obj.nodeName != 'P' && obj.nodeName != 'HTML') {
            obj = obj.parentNode;
        }
        if (obj.nodeName == 'HTML') return;

        var style = obj.style;//Get initial style
        var posi = $(obj).position();//Get position of object
        var x = obj.innerHTML;//Get the current inner HTML
        var y = document.createElement('TEXTAREA');
        var z = obj.parentNode;
        z.insertBefore(y, obj);//Insert the text area before current object

        $(y).css('position','relative');
        $(y).css('top',posi.top + 'px');
        $(y).css('left',posi.left + 'px');
        obj.style.display = "none";//hide the current object
        y.value = x;
        y.focus();
        $(y).blur(function(){
            saveEdit(obj,y);
        });
        editing = true;

    }

    function saveEdit(obj,textArea) {
        var z = textArea.parentNode;
        obj.innerHTML = textArea.value;
        obj.style.display = "flex";
        //obj.style = style;
        z.removeChild(textArea);
        editing = false;
    }
    document.ondblclick = catchIt;


});
