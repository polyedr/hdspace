$(document).ready(function(){
    <!-- main content toolbar on click functioning-->
    $("#btn-rotate-screen").click(function(){
        $("#option-container").children().hide();
        <!--ADD ROTATE SCREEN FUNCTIONALITY-->
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


  //  <!-- Navbar on click functioning-->

    $("#device-options").children().click(function() {
        $("#device-options").children().children().css("color", "#d9d9d9");
        //<!-- light grey -->
        var btnClicked = $(this);
        btnClicked.children().css("color", "DarkCyan");

        if (btnClicked.attr('id')=="btn-laptop") {
            $("#btn-rotate-screen1").addClass("hide-content");
            $("#btn-rotate-screen2").addClass("hide-content");
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
            $("#sortable").removeClass("nav-stacked-tablet nav-stacked-mobile").addClass("nav-stacked-laptop");
            $("#sortableR").removeClass("nav-stacked-tablet nav-stacked-mobile").addClass("nav-stacked-laptop");
            displayLaptop();
            changePageStructureLaptop();
            changeButtonLaptop();
            changeMarginLaptop();
        }
        else if (btnClicked.attr('id')=="btn-tablet") {
            $("#btn-rotate-screen1").removeClass("hide-content");
            $("#btn-rotate-screen2").removeClass("hide-content");
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
            $("#group-list").removeClass("tablet-dimension list-group-horizontal").addClass("list-group-horizontal-tablet");
            $("#sortable").removeClass("nav-stacked-laptop nav-stacked-mobile").addClass("nav-stacked-tablet");
            $("#sortableR").removeClass("nav-stacked-laptop nav-stacked-mobile").addClass("nav-stacked-tablet");
           displayTablet();
           changePageStructureTablet();
           changeButtonTablet();
           changeMarginTablet();
        }
        else if (btnClicked.attr('id')=="btn-mobile") {
            $("#btn-rotate-screen1").removeClass("hide-content");
            $("#btn-rotate-screen2").removeClass("hide-content");
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
            $("#sortableSlides").removeClass("laptop-dimension tablet-dimension").addClass("mobile-dimension");
            $("#sortable").removeClass("nav-stacked-laptop nav-stacked-tablet").addClass("nav-stacked-mobile");
            $("#sortableR").removeClass("nav-stacked-laptop nav-stacked-tablet").addClass("nav-stacked-mobile");
            displayMobile();
            changePageStructureMobile();
            changeButtonMobile();
            changeMarginMobile();
        }
    });

    function changeMarginMobile(){
        document.getElementById('marginChange').style = 'margin-left:6%';
        document.getElementById('marginChange1').style = 'margin-left:6%';
        document.getElementById('general-contain').style = 'margin-left:6%';
        document.getElementById('onClick').style = 'max-width:830px';
    }

    function changeMarginTablet(){
        document.getElementById('marginChange').style = 'margin-left:12%';
        document.getElementById('marginChange1').style = 'margin-left:12%';
        document.getElementById('general-contain').style = 'margin-left:4%';
        document.getElementById('onClick').style = 'max-width:940px';
    }

    function changeMarginLaptop(){
        document.getElementById('marginChange').style = 'margin-left:12%';
        document.getElementById('marginChange1').style = 'margin-left:12%';
        document.getElementById('general-contain').style = 'margin-left:4%';
        document.getElementById('onClick').style = 'max-width:830px';
    }

    function changeButtonMobile(){
        document.getElementById('buttonleftLT').style.height = '355px';
        document.getElementById('buttonrightLT').style.height = '355px';

    }

    function changeButtonTablet(){
        document.getElementById('buttonleftLT').style.height = '266px';
        document.getElementById('buttonrightLT').style.height = '266px';

    }

    function changeButtonLaptop(){
        document.getElementById('buttonleftLT').style.height = '110px';
        document.getElementById('buttonrightLT').style.height = '110px';

    }


    //<!--adjustment to individual display type-->

    function displayLaptop(){
        $("#device-frame").removeClass("size-tablet size-mobile").addClass("size-laptop-default");
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
        $("#device-frame").removeClass("size-laptop-default size-mobile").addClass("size-tablet");
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
        $("#container-inside-frame").removeClass("content-inside-frame-laptop " +
            "content-inside-frame-laptop-size1 " +
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
            "content-inside-frame-mobile-size8 ").addClass("content-inside-frame-tablet");
        $(".container-main-content:first-child").css("style","27%");
        $(".container-main-content:last-child").css("style","27%")
    }
    function displayMobile(){
        $("#device-frame").removeClass("size-tablet size-laptop-default").addClass("size-mobile");
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
            "content-inside-frame-laptop ").addClass("content-inside-frame-mobile");
        $(".container-main-content:first-child").css("style","35%")
        $(".container-main-content:last-child").css("style","35%")
    }

     function changePageStructureLaptop(){
        $("#left-col-top").removeClass("col-sm-2 col-sm-2").addClass("col-sm-3");
        $("#mid-col-top").removeClass("col-sm-7 col-sm-6").addClass("col-sm-6");
        $("#right-col-top").removeClass("col-sm-3 col-sm-4").addClass("col-sm-3");
        $("#left-col-tb").removeClass("col-sm-1 col-sm-0").addClass("col-sm-2");
        $("#mid-col-tb").removeClass("col-sm-9 col-sm-8").addClass("col-sm-8");
        $("#right-col-tb").removeClass("col-sm-2 col-sm-4").addClass("col-sm-2");
        $("#left-col").removeClass("w3-col l2 m2 s2" + "w3-col l2 m2 s2").addClass("w3-col l2 m2 s2");
        $("#mid-col").removeClass("w3-col l7 m7 s7" + "w3-col l4 m4 s4").addClass("w3-col l8 m8 s8");
        $("#right-col").removeClass("w3-col l2 m2 s2" + "w3-col l2 m2 s2").addClass("w3-col l2 m2 s2");
        $("#right-dummy-col").removeClass("w3-col l1 m1 s1" + "w3-col l4 m4 s4").addClass("w3-col l0 m0 s0");
        $("#leftCol").removeClass("w3-col l2 m2 s2" + "w3-col l2 m2 s2").addClass("w3-col l2 m2 s2");
        $("#midCol").removeClass("w3-col l7 m7 s7" + "w3-col l4 m4 s4").addClass("w3-col l8 m8 s8");
        $("#rightCol").removeClass("w3-col l2 m2 s2" + "w3-col l2 m2 s2").addClass("w3-col l2 m2 s2");
        $("#spaceRight").removeClass("w3-col l1 m1 s1" + "w3-col l4 m4 s4").addClass("w3-col l0 m0 s0");
        $("#layout1").removeClass("w3-col l2 m2 s2" + "w3-col l2 m2 s2").addClass("w3-col l2 m2 s2");
        $("#layout2").removeClass("w3-col l7 m7 s7" + "w3-col l4 m4 s4").addClass("w3-col l8 m8 s8");
        $("#layout3").removeClass("w3-col l3 m3 s3" + "w3-col l6 m6 s6").addClass("w3-col l2 m2 s2");
        $("#ul-list").removeClass("list-group-horizontal-tablet list-group-horizontal-mobile").addClass("list-group-horizontal");
        $("#sortableSlidesCT").removeClass("tablet-dimension mobile-dimension").addClass("laptop-dimension");
        $("#sortableSlidesST").removeClass("tablet-dimension mobile-dimension").addClass("laptop-dimension");


     }

     function changePageStructureTablet(){
        $("#left-col-top").removeClass("col-sm-3 col-sm-2").addClass("col-sm-2");
        $("#mid-col-top").removeClass("col-sm-6 col-sm-6").addClass("col-sm-7");
        $("#right-col-top").removeClass("col-sm-3 col-sm-4").addClass("col-sm-3");
        $("#left-col-tb").removeClass("col-sm-2 col-sm-0").addClass("col-sm-1");
        $("#mid-col-tb").removeClass("col-sm-8 col-sm-8").addClass("col-sm-9");
        $("#right-col-tb").removeClass("col-sm-2 col-sm-4").addClass("col-sm-2");
        $("#left-col").removeClass("w3-col l2 m2 s2" + "w3-col l2 m2 s2").addClass("w3-col l2 m2 s2");
        $("#mid-col").removeClass("w3-col l8 m8 s8" + "w3-col l4 m4 s4").addClass("w3-col l7 m7 s7");
        $("#right-col").removeClass("w3-col l2 m2 s2" + "w3-col l2 m2 s2").addClass("w3-col l2 m2 s2");
        $("#right-dummy-col").removeClass("w3-col l0 m0 s0" + "w3-col l4 m4 s4").addClass("w3-col l1 m1 s1");
        $("#leftCol").removeClass("w3-col l2 m2 s2" + "w3-col l2 m2 s2").addClass("w3-col l2 m2 s2");
        $("#midCol").removeClass("w3-col l8 m8 s8" + "w3-col l4 m4 s4").addClass("w3-col l7 m7 s7");
        $("#rightCol").removeClass("w3-col l2 m2 s2" + "w3-col l2 m2 s2").addClass("w3-col l2 m2 s2");
        $("#spaceRight").removeClass("w3-col l0 m0 s0" + "w3-col l4 m4 s4").addClass("w3-col l1 m1 s1");
        $("#layout1").removeClass("w3-col l2 m2 s2" + "w3-col l2 m2 s2").addClass("w3-col l2 m2 s2");
        $("#layout2").removeClass("w3-col l8 m8 s8" + "w3-col l4 m4 s4").addClass("w3-col l7 m7 s7");
        $("#layout3").removeClass("w3-col l2 m2 s2" + "w3-col l6 m6 s6").addClass("w3-col l3 m3 s3");
        $("#ul-list").removeClass("list-group-horizontal list-group-horizontal-mobile").addClass("list-group-horizontal-tablet");
        $("#sortableSlidesCT").removeClass("laptop-dimension mobile-dimension").addClass("tablet-dimension");
        $("#sortableSlidesST").removeClass("laptop-dimension mobile-dimension").addClass("tablet-dimension");

     }

     function changePageStructureMobile(){
        $("#left-col-top").removeClass("col-sm-2 col-sm-3").addClass("col-sm-2");
        $("#mid-col-top").removeClass("col-sm-7 col-sm-6").addClass("col-sm-6");
        $("#right-col-top").removeClass("col-sm-3 col-sm-3").addClass("col-sm-4");
        $("#left-col-tb").removeClass("col-sm-2 col-sm-1").addClass("col-sm-0");
        $("#mid-col-tb").removeClass("col-sm-8 col-sm-9").addClass("col-sm-8");
        $("#right-col-tb").removeClass("col-sm-2 col-sm-2").addClass("col-sm-4");
        $("#left-col").removeClass("w3-col l2 m2 s2" + "w3-col l2 m2 s2").addClass("w3-col l2 m2 s2");
        $("#mid-col").removeClass("w3-col l8 m8 s8" + "w3-col l7 m7 s7").addClass("w3-col l4 m4 s4");
        $("#right-col").removeClass("w3-col l2 m2 s2" + "w3-col l2 m2 s2").addClass("w3-col l2 m2 s2");
        $("#right-dummy-col").removeClass("w3-col l0 m0 s0" + "w3-col l1 m1 s1").addClass("w3-col l4 m4 s4");
        $("#leftCol").removeClass("w3-col l2 m2 s2" + "w3-col l2 m2 s2").addClass("w3-col l2 m2 s2");
        $("#midCol").removeClass("w3-col l7 m7 s7" + "w3-col l8 m8 s8").addClass("w3-col l4 m4 s4");
        $("#rightCol").removeClass("w3-col l2 m2 s2" + "w3-col l2 m2 s2").addClass("w3-col l2 m2 s2");
        $("#spaceRight").removeClass("w3-col l1 m1 s1" + "w3-col l0 m0 s0").addClass("w3-col l4 m4 s4");
        $("#layout1").removeClass("w3-col l2 m2 s2" + "w3-col l2 m2 s2").addClass("w3-col l2 m2 s2");
        $("#layout2").removeClass("w3-col l8 m8 s8" + "w3-col l7 m7 s7").addClass("w3-col l4 m4 s4");
        $("#layout3").removeClass("w3-col l2 m2 s2" + "w3-col l3 m3 s3").addClass("w3-col l6 m6 s6");
        $("#ul-list").removeClass("list-group-horizontal list-group-horizontal-tablet").addClass("list-group-horizontal-mobile");
        $("#sortableSlidesCT").removeClass("laptop-dimension tablet-dimension").addClass("mobile-dimension");
        $("#sortableSlidesST").removeClass("laptop-dimension tablet-dimension").addClass("mobile-dimension");
     }


     function modifyLaptop(){
     document.getElementById('changePageSize').style.height = '575px';
     document.getElementById('layoutMenu li').style.width = '700px';
     }

    //<!--Other functionality-->
    /*$("#btn-full-screen").click(function(){
      var theDisplay = $("body");
      requestFullScreen(theDisplay);
    });*/

  /* $("#btn-full-screen").click (function () {
      var elem = document.getElementById("container-main-content");
      var pos = 0;
      var id = setInterval(frame, 5);
      function frame() {
        if (pos == 500) {
          clearInterval(id);
        } else {
          pos++;
          elem.style.width = pos + '%';
          elem.style.height = pos + '%';
        }
      }
})
*/



    function copyDiv() {
        var firstDivContent = document.getElementById('container-inside-frame');
        var secondDivContent = document.getElementById('container-inside-frame-top');
        secondDivContent.innerHTML = firstDivContent.innerHTML;

    }



        $("#btn-full-screen").click (function () {
            $("#btn-full-screen2").removeClass("hide-content");
            $("#btn-full-screen").addClass("hide-content");
            $("#btn-mobile2").addClass("hide-content");
            $("#btn-tablet2").addClass("hide-content");
            $("#btn-laptop2").addClass("hide-content");
            $("#btn-mobile1").removeClass("hide-content");
            $("#btn-tablet1").removeClass("hide-content");
            $("#btn-laptop1").removeClass("hide-content");

        });

        $("#btn-full-screen2").click (function (){
            $("#btn-full-screen2").removeClass("hide-content");
            $("#btn-full-screen").addClass("hide-content");
            $("#btn-mobile2").addClass("hide-content");
            $("#btn-tablet2").addClass("hide-content");
            $("#btn-laptop2").addClass("hide-content");
            $("#btn-mobile1").removeClass("hide-content");
            $("#btn-tablet1").removeClass("hide-content");
            $("#btn-laptop1").removeClass("hide-content");
        });

        $("#btn-mobile1").click (function (){
            $("#btn-mobile1").addClass("hide-content");
            $("#btn-mobile2").removeClass("hide-content");
            $("#btn-tablet2").addClass("hide-content");
            $("#btn-laptop2").addClass("hide-content");
            $("#btn-full-screen2").addClass("hide-content");
            $("#btn-tablet1").removeClass("hide-content");
            $("#btn-laptop1").removeClass("hide-content");
            $("#btn-full-screen").removeClass("hide-content");
        });

        $("#btn-mobile2").click (function (){
            $("#btn-mobile1").addClass("hide-content");
            $("#btn-mobile2").removeClass("hide-content");
            $("#btn-tablet2").addClass("hide-content");
            $("#btn-laptop2").addClass("hide-content");
            $("#btn-full-screen2").addClass("hide-content");
            $("#btn-tablet1").removeClass("hide-content");
            $("#btn-laptop1").removeClass("hide-content");
            $("#btn-full-screen").removeClass("hide-content");
        });

        $("#btn-tablet1").click (function (){
            $("#btn-tablet1").addClass("hide-content");
            $("#btn-tablet2").removeClass("hide-content");
            $("#btn-mobile2").addClass("hide-content");
            $("#btn-laptop2").addClass("hide-content");
            $("#btn-full-screen2").addClass("hide-content");
            $("#btn-mobile1").removeClass("hide-content");
            $("#btn-laptop1").removeClass("hide-content");
            $("#btn-full-screen").removeClass("hide-content");
        });

        $("#btn-tablet2").click (function (){
            $("#btn-tablet1").addClass("hide-content");
            $("#btn-tablet2").removeClass("hide-content");
            $("#btn-mobile2").addClass("hide-content");
            $("#btn-laptop2").addClass("hide-content");
            $("#btn-full-screen2").addClass("hide-content");
            $("#btn-mobile1").removeClass("hide-content");
            $("#btn-laptop1").removeClass("hide-content");
            $("#btn-full-screen").removeClass("hide-content");
        });

        $("#btn-laptop1").click (function (){
            $("#btn-laptop1").addClass("hide-content");
            $("#btn-laptop2").removeClass("hide-content");
            $("#btn-mobile2").addClass("hide-content");
            $("#btn-tablet2").addClass("hide-content");
            $("#btn-full-screen2").addClass("hide-content");
            $("#btn-mobile1").removeClass("hide-content");
            $("#btn-tablet1").removeClass("hide-content");
            $("#btn-full-screen").removeClass("hide-content");
        });

        $("#btn-laptop2").click (function (){
            $("#btn-laptop1").addClass("hide-content");
            $("#btn-laptop2").removeClass("hide-content");
            $("#btn-mobile2").addClass("hide-content");
            $("#btn-tablet2").addClass("hide-content");
            $("#btn-full-screen2").addClass("hide-content");
            $("#btn-mobile1").removeClass("hide-content");
            $("#btn-tablet1").removeClass("hide-content");
            $("#btn-full-screen").removeClass("hide-content");
        });




           /* var elem = document.getElementById("container-inside-frame-top")

            if (elem.style.visibility == hidden)  {
            elem.style.visibility = visible;
            }else
                 {
                     elem.style.visibility = hidden;
                 }
                 */
    // Color transfer preview
    $(".cTransfer").click ( function() {
              const elem1 = this.id;
              copyslide(elem1)
    });

     function copyslide ( idslide )
    {
      document.getElementById('container-inside-frame').style = 'height:inherit';
      var firstDivContent = document.getElementById(idslide);
      var secondDivContent = document.getElementById('container-inside-frame');
      secondDivContent.innerHTML = firstDivContent.innerHTML;
    }

    // Style transfer preview
    $(".sTransfer").click ( function() {
              const style1 = this.id;
              copyabstract(style1)
    });

    function copyabstract ( idabstract )
    {
      document.getElementById('container-inside-frame').style = 'height:inherit';
      var firstDivContent = document.getElementById(idabstract);
      var secondDivContent = document.getElementById('container-inside-frame');
      secondDivContent.innerHTML = firstDivContent.innerHTML;
    }

    // Layout transfer preview
     $(".layout").click ( function() {
              const layout1 = this.id;
              copylayout(layout1)
    });


    function copylayout ( idlayout )
    {
      document.getElementById('container-inside-frame').style = 'height:inherit';
      var firstDivContent = document.getElementById(idlayout);
      var secondDivContent = document.getElementById('container-inside-frame');
      secondDivContent.innerHTML = firstDivContent.innerHTML;
    }


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



    // $(document).ready(
    // function(){
    //     $('#remove-on-click-check').addClass('hidden');
    //     $('#imgUpload').change(
    //         function(){
    //             if ($(this).val()){
    //                     swal({
    //                         title: "Enter Screen Name",
    //                         type: "input",
    //                         inputPlaceholder: "Enter the screen name",
    //                         showCancelButton: true,
    //                         confirmButtonColor: "#18a689",
    //                         confirmButtonText: "Create",
    //                         closeOnConfirm: false,
    //                     },loadingOnclick());
    //                     // $('.sweet-overlay').style.opacity="0.8;";
    //                     $('#upload-visibility').addClass('active move-visibility');
    //             }
    //             else {
    //             }
    //         }
    //     );
    // });

    $(document).ready(
    function(){
        $('#color-remove-on-check').addClass('hidden');
        $('#styleImg').change(
            function(){
                if ($(this).val()){
                    $('#color-remove-fa-download-on-click').removeClass('fa-download');
                    // document.getElementById('color-hover-select').style = 'width: 138px;height: 108px;';
                    $('#color-upload-visibility').addClass('active move-visibility');
                }
                else {
                }
            }
        );
    });


    function changeIDLaptop(){
        changeAspectRatioLaptop();
    }

    function changeIDTablet(){
        changeAspectRatioTablet();
    }

    function changeIDMobile(){
        changeAspectRatioPhone();
    }


     function changeAspectRatioLaptop(){
         $('#tab-body').removeClass('tab-content-tablet tab-content-phone').addClass('tab-content');
         $('#tab-3').removeClass('tab-pane-phone tab-pane-tablet').addClass('tab-pane');
         $('#panel-id').removeClass('panel-body-phone panel-body-tablet').addClass('panel-body');
         $('#midCol').removeClass('testing-phone testing-tablet').addClass('testing');
         $('#device-frame').removeClass('size-tablet background-tablet background-tablet-rotate size-mobile background-mobile background-mobile-rotate').addClass('size-laptop-default background-laptop');
         $('#general-contain').removeClass('general-size-tablet general-size-mobile').addClass('general-size-laptop');
         $('#container-inside-frame').removeClass('content-inside-frame-tablet content-inside-frame-mobile').addClass('content-inside-frame-laptop');
         $("#sortable").removeClass("nav-stacked-tablet nav-stacked-mobile").addClass("nav-stacked-laptop");
         $("#sortableR").removeClass("nav-stacked-tablet nav-stacked-mobile").addClass("nav-stacked-laptop");
         $("#sortableSlidesCT").removeClass("tablet-dimension mobile-dimension").addClass("laptop-dimension");
         $("#contentlistLT").removeClass("layout-tablet-dimension layout-mobile-dimension").addClass("layout-laptop-dimension");
         $('#layout-panel').removeClass("layout-panel-body-tablet layout-panel-body-mobile").addClass("layout-panel-body-laptop");
         document.getElementById('rotate-tablet1').style = 'width: 80px;visibility: hidden;';
         document.getElementById('rotate-tablet2').style = 'width: 80px;visibility: hidden;margin-left:-80px;';
         document.getElementById('rotate-phone1').style = 'width: 80px;visibility: hidden;margin-left:-80px;';
         document.getElementById('rotate-phone2').style = 'width: 80px;visibility: hidden;margin-left:-80px;';
         document.getElementById('panel-id').style = 'padding:0px 0 20px 0;';
         document.getElementById('device-frame').style = 'max-height: 860px;width: 100%;height: 100%;margin-top:15px';
         document.getElementById('general-contain').style = 'margin-left:4%; height:100%;';
         document.getElementById('container-inside-frame').style = 'height:inherit;';
    }

    function changeAspectRatioTablet(){
        $('#tab-body').removeClass('tab-content tab-content-phone').addClass('tab-content-tablet');
        $('#tab-3').removeClass('tab-pane tab-pane-phone').addClass('tab-pane-tablet');
        $('#panel-id').removeClass('panel-body-phone panel-body').addClass('panel-body-tablet');
        $('#midCol').removeClass('testing-phone testing').addClass('testing-tablet');
        $('#device-frame').removeClass('size-laptop-default background-laptop background-tablet-rotate size-mobile background-mobile background-mobile-rotate').addClass('size-tablet background-tablet');
        $('#general-contain').removeClass('general-size-laptop general-size-mobile').addClass('general-size-tablet');
        $('#container-inside-frame').removeClass('content-inside-frame-laptop content-inside-frame-mobile').addClass('content-inside-frame-tablet');
        $("#sortable").removeClass("nav-stacked-laptop nav-stacked-mobile").addClass("nav-stacked-tablet");
        $("#sortableR").removeClass("nav-stacked-laptop nav-stacked-mobile").addClass("nav-stacked-tablet");
        $("#sortableSlidesCT").removeClass("laptop-dimension mobile-dimension").addClass("tablet-dimension");
        $("#contentlistLT").removeClass("layout-laptop-dimension layout-mobile-dimension").addClass("layout-tablet-dimension");
        $('#layout-panel').removeClass("layout-panel-body-laptop layout-panel-body-mobile").addClass("layout-panel-body-tablet");
        document.getElementById('rotate-tablet1').style = 'width: 80px;visibility: visible;';
        document.getElementById('rotate-tablet2').style = 'width: 80px;visibility: hidden;margin-left:-80px;';
        document.getElementById('rotate-phone1').style = 'width: 80px;visibility: hidden;margin-left:-80px;';
        document.getElementById('rotate-phone2').style = 'width: 80px;visibility: hidden;margin-left:-80px;';
        document.getElementById('panel-id').style = 'padding:0px 0 20px 0;height:1995px;';
        document.getElementById('device-frame').style = 'width:75%;height:100%;position: absolute;top: 50%;left: 50%;transform: translate(-50%,-50%);margin-top:15px';
        document.getElementById('general-contain').style = 'margin-left:4%;height:100%;margin-top:-2%;';
        document.getElementById('container-inside-frame').style = 'height:inherit;';
    }

    function changeAspectRatioPhone(){
        $('#tab-body').removeClass('tab-content tab-content-tablet').addClass('tab-content-phone');
        $('#tab-3').removeClass('tab-pane tab-pane-tablet').addClass('tab-pane-phone');
        $('#panel-id').removeClass('panel-body-tablet panel-body').addClass('panel-body-phone');
        $('#midCol').removeClass('testing-tablet testing').addClass('testing-phone');
        $('#device-frame').removeClass('size-laptop-default background-laptop size-tablet background-tablet background-tablet-rotate background-mobile-rotate').addClass('size-mobile background-mobile');
        $('#general-contain').removeClass('general-size-laptop general-size-tablet').addClass('general-size-mobile');
        $('#container-inside-frame').removeClass('content-inside-frame-laptop content-inside-frame-tablet').addClass('content-inside-frame-mobile');
        $("#sortable").removeClass("nav-stacked-laptop nav-stacked-tablet").addClass("nav-stacked-mobile");
        $("#sortableR").removeClass("nav-stacked-laptop nav-stacked-tablet").addClass("nav-stacked-mobile");
        $("#sortableSlidesCT").removeClass("laptop-dimension tablet-dimension").addClass("mobile-dimension");
        $("#contentlistLT").removeClass("layout-laptop-dimension layout-tablet-dimension").addClass("layout-mobile-dimension");
        $('#layout-panel').removeClass("layout-panel-body-tablet layout-panel-body-laptop").addClass("layout-panel-body-mobile");
        document.getElementById('rotate-tablet1').style = 'width: 80px;visibility: hidden;';
        document.getElementById('rotate-tablet2').style = 'width: 80px;visibility: hidden;margin-left:-80px;';
        document.getElementById('rotate-phone1').style = 'width: 80px;visibility: visible;margin-left:-80px;';
        document.getElementById('rotate-phone2').style = 'width: 80px;visibility: hidden;margin-left:-80px;';
        document.getElementById('panel-id').style = 'padding:0px 0 20px 0;height:2000px;';
        document.getElementById('device-frame').style = 'width:50%;height:98%;position: absolute;top: 49%;left: 50%;transform: translate(-50%,-50%);margin-top:15px';
        document.getElementById('general-contain').style = 'margin-left:6%;height:100%;margin-top:-1%;';
        document.getElementById('container-inside-frame').style = 'height:inherit;';
    }

    function testRotateTablet() {
        $('#device-frame').removeClass('background-tablet').addClass('background-tablet-rotate');
        document.getElementById('device-frame').style = 'width:100%;height:60%;position: absolute;left: 51%;transform: translate(-50%,0%);margin-top:15px';
        document.getElementById('general-contain').style = 'margin-left:7%;height:94%;margin-top:-8.5%;padding-bottom:0px';
        document.getElementById('container-inside-frame').style = 'height:inherit;width:82.5%;';
        document.getElementById('rotate-tablet1').style = 'width: 80px;visibility: hidden;';
        document.getElementById('rotate-tablet2').style = 'width: 80px;visibility: visible;margin-left:-80px;';
    }

    function testRotateTablet2() {
        $('#device-frame').removeClass('background-tablet-rotate').addClass('background-tablet');
        document.getElementById('device-frame').style = 'width:75%;height:100%;position: absolute;top: 50%;left: 50%;transform: translate(-50%,-50%);margin-top:15px';
        document.getElementById('general-contain').style = 'margin-left:4%;height:100%;margin-top:-2%;';
        document.getElementById('container-inside-frame').style = 'height:inherit;';
        document.getElementById('rotate-tablet1').style = 'width: 80px;visibility: visible;';
        document.getElementById('rotate-tablet2').style = 'width: 80px;visibility: hidden;margin-left:-80px;';
    }

    function testRotatePhone() {
        $('#device-frame').removeClass('background-mobile').addClass('background-mobile-rotate');
        document.getElementById('device-frame').style = 'width:98%;height:50%;position: absolute;left: 50%;transform: translate(-50%,0%);margin-top:15px';
        document.getElementById('general-contain').style = 'margin-left:11%;height:93.5%;margin-top:-17%;padding-bottom:0px';
        document.getElementById('container-inside-frame').style = 'height:inherit;width:78%;';
        document.getElementById('rotate-phone1').style = 'width: 80px;visibility: hidden;margin-left:-80px;';
        document.getElementById('rotate-phone2').style = 'width: 80px;visibility: visible;margin-left:-80px;';
    }

    function testRotatePhone2() {
        $('#device-frame').removeClass('background-mobile-rotate').addClass('background-mobile');
        document.getElementById('device-frame').style = 'width:50%;height:98%;position: absolute;top: 49%;left: 50%;transform: translate(-50%,-50%);margin-top:15px';
        document.getElementById('general-contain').style = 'margin-left:6%;height:100%;margin-top:-1%;';
        document.getElementById('container-inside-frame').style = 'height:inherit;';
        document.getElementById('rotate-phone1').style = 'width: 80px;visibility: visible;margin-left:-80px;';
        document.getElementById('rotate-phone2').style = 'width: 80px;visibility: hidden;margin-left:-80px;';
    }

    $(document).ready(function() {
        $('input[type="text"]').on('keypress', function() {
            var $this = $(this), value = $this.val();
            if (value.length === 1) {
                $this.val( value.charAt(0).toUpperCase() );
            }
        });
    })









