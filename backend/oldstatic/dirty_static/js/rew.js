
    $(document).ready(function() {
        // main content toolbar on click functioning
        $("#btn-rotate-screen").click(function () {
            $("#option-container").children().hide();
            // ADD ROTATE SCREEN FUNCTIONALITY
        });
        $("#btn-custom-asset").click(function () {
            $("#option-container").children().hide();
            $("#panel-custom-asset").show();
        });
        $("#btn-edit-layout").click(function () {
            $("#option-container").children().hide();
            $("#panel-edit-layout").show();
        });
        $("#btn-select-font").click(function () {
            alert("button custom asset clicked");
        });
        $("#btn-select-colours").click(function () {
            alert("button custom asset clicked");
        });
        $("#btn-add-widget").click(function () {
            alert("button custom asset clicked");
        });
    });


  //  <!-- Navbar on click functioning-->

    $("#device-options").children().click(function() {
        $("#device-options").children().children().css("color", "#d9d9d9");
        //<!-- light grey -->
        var btnClicked = $(this);
        btnClicked.children().css("color", "DarkCyan");

        if (btnClicked.attr('id') === "btn-laptop") {
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
        else if (btnClicked.attr('id')=== "btn-tablet") {
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
            // noinspection JSNonStrictModeUsed
            $("#laptop-size-selection2").hide();
            $("#laptop-size-selection3").hide();
            $("#laptop-size-selection4").hide();
            $("#laptop-size-selection5").hide();
            $('#laptop-size-selection6').hide();
            $("#laptop-size-selection7").hide();
            $("#group-list").removeClass("tablet-dimension list-group-horizontal").addClass("list-group-horizontal-tablet");
            $("#sortable").removeClass("nav-stacked-laptop nav-stacked-mobile").addClass("nav-stacked-tablet");
            $("#sortableR").removeClass("nav-stacked-laptop nav-stacked-mobile").addClass("nav-stacked-tablet");
           displayTablet();
           changePageStructureTablet();
           changeButtonTablet();
           changeMarginTablet();
        }
        else if (btnClicked.attr('id')=== "btn-mobile") {
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
        $(".container-main-content:last-child").css("style","20%");
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
        $(".container-main-content:last-child").css("style","27%");
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
        $(".container-main-content:first-child").css("style","35%");
        $(".container-main-content:last-child").css("style","35%");
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
              copyslide(elem1);
    });

     function copyslide ( idslide )
    {
      document.getElementById("container-inside-frame").style = "height:inherit";
      var firstDivContent = document.getElementById(idslide);
      var secondDivContent = document.getElementById("container-inside-frame");
      secondDivContent.innerHTML = firstDivContent.innerHTML;
    }

    // Style transfer preview
    $(".sTransfer").click ( function() {
              const style1 = this.id;
              copyabstract(style1);
    });

    function copyabstract ( idabstract )
    {
      document.getElementById("container-inside-frame").style = "height:inherit";
      var firstDivContent = document.getElementById(idabstract);
      var secondDivContent = document.getElementById("container-inside-frame");
      secondDivContent.innerHTML = firstDivContent.innerHTML;
    }

    // Layout transfer preview
     $(".layout").click ( function() {
              const layout1 = this.id;
              copylayout(layout1);
    });


    function copylayout ( idlayout )
    {
      document.getElementById("container-inside-frame").style = "height:inherit";
      var firstDivContent = document.getElementById(idlayout);
      var secondDivContent = document.getElementById("container-inside-frame");
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

    // function handleinput(){
    //     $('#hideOnUpload').attr('style', 'visibility:hidden');
    //     console.log('hi');
    // }


    //Upload Form Submission
    function submitUploadedScreen(){
        var imgsrc, imgresult;
        imgsrc = $('.imgHide').attr('src');
        imgresult = '/static/img/uploaderGif/noPreviewAvailable.png';

        if (imgsrc === imgresult) {
            var timer = 1, // timer in seconds
            isTimerStarted = false;
            (function customSwal() {
                console.log('this is me 1st');
                swal({
                    title: "Upload Screenshot",
                    text: "Closing in " + timer + " seconds...",
                    timer: !isTimerStarted ? timer * 1000 : undefined,
                    showConfirmButton: false,
                    allowEscapeKey: false,
                    closeOnConfirm: true
                });
                isTimerStarted = true;
                if(timer) {
                    timer--;
                    if(timer === 0){
                        swal.closeModal();

                    } else{
                        setTimeout(customSwal, 1000);
                        console.log('I am looping through');
                    }

                }
            })();
        } else {
        $("#changeZ-index").attr('style', 'z-index : 1');
        $('#popupNewSuggester').popup('hide');
        var currentscreen = '';
        $.when(getAllScreen()).done(function(a1) {
            console.log(pagesResult);
            currentscreen = pagesResult;
        });
        swal({
          title: "Enter Screen Name",
          type: "input",
          showCancelButton: false,
          closeOnConfirm: false,
          inputPlaceholder: "Enter text here"
        }, function (inputValue) {
            if (inputValue === false) {
              document.getElementById('preview1').src ='';
              return false;
            }
            if (inputValue === "") {
                swal.showInputError("You need to write something!");
                    return false;
                }
                else if (currentscreen.includes(inputValue)){
                    swal.showInputError("This screenshot name already exists. Please choose something different.");
                    return false;
                }
            else {
              swal.close();
              document.getElementById('filename').innerHTML = inputValue;
              document.getElementById('filename').value = inputValue;
              // document.getElementById('myfile').value = inputValue;
              document.getElementById('uploadNewScreenshotForm').submit();
              loadScreen();
            }
        });
    }
    }


    function chargeCheck()
    {
        $('#hideOnUpload').attr('style', 'visibility:hidden');
        $('#reduceOnUpload').attr('style', 'width: 780px;height: 315px;background-color: #f3f3f4;border-top-style: none;');
        $('#uploadSectionPop').attr('style', 'padding-bottom: 10px;display: inline;');
        $('#searchSuggestionResult').addClass('hidden');
        $('#hideSpanOnUpload').addClass('hidden');
        $('#approveButton').attr('style', 'padding: 0;padding-top: 10px;visibility: hidden;');
        document.body.onfocus = roar;
        console.log('Uploading....')
    }
    function roar()
    {
        var emptyValue = document.getElementById('upload-search').value;
        if (emptyValue.length === 0) {
            $('#hideOnUpload').attr('style', 'padding-top: 0;visibility: visible;height: 109px;');
            $('#reduceOnUpload').attr('style', 'width: 780px;height: 426px;background-color: #f3f3f4;border-top-style: none;');
            $('#hideSpanOnUpload').removeClass('hidden');
            $('#uploadSectionPop').attr('style', 'padding-bottom: 0;display: inline;');
            $('#approveButton').attr('style', 'padding: 0;padding-top: 10px;visibility: hidden;');
        }
        else{
            $('#hideOnUpload').attr('style', 'padding-top: 0;visibility: visible;');
            $('#searchSuggestionResult').removeClass('hidden');
            $('#reduceOnUpload').attr('style', 'width: 780px;height: 695px;background-color: #f3f3f4;border-top-style: none;');
            $('#hideSpanOnUpload').removeClass('hidden');
            $('#uploadSectionPop').attr('style', 'padding-bottom: 10px;display: inline;');
            $('#approveButton').attr('style', 'padding: 0;padding-top: 10px;visibility: visible;');
        }
        document.body.onfocus = null;
        console.log('Cancelled..hh...');
    }

    // $(document).ready(
    // function(){
    //     $('#remove-on-click-check').addClass('hidden');
    //     $('#imgUpload').change(
    //         function(){
    //             if ($(this).val()){
    //                 swal({
    //                     title: "Enter Screen Name",
    //                     type: "input",
    //                     inputPlaceholder: "Enter the screen name",
    //                     showCancelButton: true,
    //                     confirmButtonColor: "#18a689",
    //                     confirmButtonText: "Create",
    //                     closeOnConfirm: false,
    //                 },loadingOnclick());
    //                 // $('.sweet-overlay').style.opacity="0.8;";
    //                 $('#upload-visibility').addClass('active move-visibility');
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

        function searchSelection(){
        var item_list = Object.keys(ticked);
        approved_click(item_list);
    }

    function visibleSuggestions() {

        document.getElementById('reduceOnUpload').style = 'width: 780px;height: 695px;background-color: #f3f3f4;border-top-style: none;';
        document.getElementById('hideOnUpload').style = 'padding-top: 0;visibility: visible;';
        document.getElementById('parentHideOnUpload').style = 'padding: 0;border-top: none;';
        $('#widgetsHidder').attr('style', 'visibility: hidden;height: auto;');
        $('.widgetsHidderClass').attr('style', 'height: 150px;width: 0;float: left;border-top: 1px solid #e7eaec;margin: 5px 0 5px 5px;');
        $('#screensHidder').attr('style', 'visibility: visible;height: auto;');
        $('#searchSuggestionResult').removeClass('hidden');

        if($('.checkIconDeselect').css('visibility') === 'hidden'){
            $('#approveButton').attr('style', 'padding: 0;padding-top: 10px;visibility: hidden;');
        }
        else{
            $('#approveButton').attr('style', 'padding: 0;padding-top: 10px;visibility: visible;');
        }

        if($('#screens_tab').hasClass('active')){
            screenContainer();
        }else if($('#widgets_tab').hasClass('active')){
            widgetsContainer();
        }

        var emptyValue = document.getElementById('upload-search').value;
        if (emptyValue.length === 0){
            document.getElementById('reduceOnUpload').style = 'width: 780px;height: auto;background-color: #f3f3f4;border-top-style: none;';
            document.getElementById('hideOnUpload').style = 'padding-top: 0;visibility: visible;height:109px';
            document.getElementById('parentHideOnUpload').style = 'padding: 0;border-top: none;height:107px';
            $('#searchSuggestionResult').addClass('hidden');
            $('#widgetsHidder').attr('style', 'visibility: hidden;height: auto;');
            $('#screensHidder').attr('style', 'visibility: hidden;height: auto;');
            $('#approveButton').attr('style', 'padding: 0;padding-top: 10px;visibility: hidden;');
            $('#screens_tab').addClass('active');
            $('#widgets_tab').removeClass('active');
        }
    }

    function approved_click(item_list){
        $.ajax({
            type: 'POST',
            url: 'index',
            name: 'approve',
            traditional: true,
            data:{
                'name':'approve',
                'item_ticked[]':item_list
            }
        })
    }

    function searching_screens(key) {

        var result_counter = 0;

        $.ajax({
            type: 'POST',
            url: 'index',
            name: 'search',
            data: {
                'name': 'search',
                'key': key
            }
        })
        .done(function (data) {
                $('.search_results').empty();
                var arrayLength_screens = data.scr.length;
                var toAdd_screens = document.createDocumentFragment();
                for (var i = 0; i < arrayLength_screens; i++) {

                    var searchScreens = document.createElement("p");
                    searchScreens.className = "search_results";
                    searchScreens.id = data.scr[i];

                    result_counter++;

                    searchScreens.innerHTML =
                        '<div class="center hoverer screensHidderClass" style="height: 150px;width: 142px;float: left;border-top: 1px solid #e7eaec;\n' +
                        '        margin: 5px 2.5px 5px 2.5px;display: inline-block;">\n' +
                        '    <div class="tab-content" style="\n' +
                        '        height: 100%;\n' +
                        '        width: 100%;">\n' +
                        '        <div class="tabs-container ui-sortable-handle" style="height: 100%;">\n' +
                        '            <div id="tab-90" class="tab-pane active" style="height: 100%;">\n' +
                        '                <div class="panel-body" style="padding:0;height:100%;">\n' +
                        '                    <div id="imgPreviewScreen" style="height: 100%;">\n' +
                        '                        <img src="/static/screens/' + data.scr[i] + '.png" style="width: 100%;height: 100%;opacity: 1;">\n' +
                        '                            <i class="move-visibility checkIconSelected" onclick="checkOK(event)" aria-hidden="true" data-popup-ordinal="0" style="\n' +
                        '                                position: absolute;\n' +
                        '                                width: 30%;\n' +
                        '                                height: 27%;\n' +
                        '                                z-index: 10000;\n' +
                        '                                left: 33%;\n' +
                        '                                top: 50%;\n' +
                        '                                transform: translate(-50%,-50%);\n' +
                        '                                background-color: #b5b4b4;\n' +
                        '                                border-radius: 50%;\n' +
                        '                                cursor:pointer\n' +
                        '                                ">\n' +
                        '                                <i class="fa fa-check fa-2x" style="color: white;margin: 12%;"></i>\n' +
                        '                            </i>\n' +
                        '                            <i id="deleteScreen\'+ i +\'" class="move-visibility crossDisapear" onclick="deleteSuggestedObject(event)" aria-hidden="true" data-popup-ordinal="0" style="\n' +
                        '                                position: absolute;\n' +
                        '                                width: 30%;\n' +
                        '                                height: 27%;\n' +
                        '                                z-index: 10000;\n' +
                        '                                left: 65%;\n' +
                        '                                top: 50%;\n' +
                        '                                transform: translate(-50%,-50%);\n' +
                        '                                background-color: #b5b4b4;\n' +
                        '                                border-radius: 50%;\n' +
                        '                                cursor:pointer\n' +
                        '                                ">\n' +
                        '                                <i class="fa fa-close fa-2x" style="color: white;margin: 12%;"></i>\n' +
                        '                            </i>\n' +
                        '                            <i class="checkIconDeselect" aria-hidden="true" data-popup-ordinal="0" style="\n' +
                        '                                position: absolute;\n' +
                        '                                width: 30%;\n' +
                        '                                height: 27%;\n' +
                        '                                z-index: 10000;\n' +
                        '                                left: 50%;\n' +
                        '                                top: 50%;\n' +
                        '                                transform: translate(-50%,-50%);\n' +
                        '                                background-color: #b5b4b400;\n' +
                        '                                border-radius: 50%;\n' +
                        '                                cursor: pointer;\n' +
                        '                                visibility: hidden;\n' +
                        '                                ">\n' +
                        '                                <i class="fa fa-check fa-2x checkIcon" onclick="checkOkDeselect(event)" style="color: white;margin: 12%;"></i>\n' +
                        '                            </i>\n' +
                        '                    </div>\n' +
                        '                </div>\n' +
                        '            </div>\n' +
                        '        </div>\n' +
                        '    </div>\n' +
                        ' </div>';

                    toAdd_screens.appendChild(searchScreens);
                };
                document.getElementById("screensHidder").appendChild(toAdd_screens);
                $('#screensHidder').attr('style', 'visibility: visible;width:'+(147*result_counter)+'px;height: 160px;');

            }
        ).done(function(){
            for(var key in ticked) {
                $('#'+ ticked[key]).find('.checkIcon').attr('style', 'color: #18a689;margin: 12%;');
                $('#'+ ticked[key]).find('.checkIconDeselect').attr('style', 'position: absolute;width: 30%;height: 27%;z-index: 10000;left: 50%;top: 50%;transform: translate(-50%,-50%);background-color: #b5b4b400;border-radius: 50%;cursor:pointer');
                $('#'+ ticked[key]).find('.crossDisapear').attr('style', 'visibility:hidden;');
                $('#'+ ticked[key]).find('.checkIconSelected').attr('style', 'visibility:hidden;');
                $('#'+ ticked[key]).find('.imgHideScreen').attr('style', 'width:100%;height:100%;opacity:0.5;');
                $('#'+ ticked[key]).find('.imgHideScreen').attr('style', 'width:100%;height:100%;opacity:0.5;');
                $('#approveButton').attr('style', 'padding: 0;padding-top: 10px;visibility: visible;');
            }
        })


    }

    function searching_widgets(key) {

        var result_counter = 0;

        $.ajax({
            type: 'POST',
            url: 'index',
            name: 'search',
            data: {
                'name': 'search',
                'key': key
            }
        })
        .done(function (data) {

                $('.search_results').empty();
                var arrayLength_widgets = data.wid.length;
                var toAdd_widget = document.createDocumentFragment();
                for (var i = 0; i < arrayLength_widgets; i++) {

                    var searchWidgets = document.createElement("p");
                    searchWidgets.className = "search_results";
                    searchWidgets.id = data.wid[i];

                    result_counter++;

                    searchWidgets.innerHTML =
                        '    <div class="center hoverer widgetsHidderClass" style="height: 150px;width: 142px;float: left;border-top: 1px solid #e7eaec;\n' +
                        '        margin: 5px 2.5px 5px 2.5px; display: inline-block;">\n' +
                        '        <div class="tab-content" style="\n' +
                        '            height: 100%;\n' +
                        '            width: 100%;">\n' +
                        '            <div class="tabs-container ui-sortable-handle" style="height: 100%;">\n' +
                        '                <div id="tab-90" class="tab-pane active" style="height: 100%;">\n' +
                        '                    <div class="panel-body" style="padding:0;height:100%;">\n' +
                        '                        <div id="imgPreviewScreen" style="height: 100%;">\n' +
                        '                            <img src="/static/widgets/' + data.wid[i] + '.jpg" style="width: 100%;height: 100%;opacity: 1;">\n' +
                        '                            <i class="move-visibility checkIconSelected" onclick="checkOK(event)" aria-hidden="true" data-popup-ordinal="0" style="\n' +
                        '                                position: absolute;\n' +
                        '                                width: 30%;\n' +
                        '                                height: 27%;\n' +
                        '                                z-index: 10000;\n' +
                        '                                left: 33%;\n' +
                        '                                top: 50%;\n' +
                        '                                transform: translate(-50%,-50%);\n' +
                        '                                background-color: #b5b4b4;\n' +
                        '                                border-radius: 50%;\n' +
                        '                                cursor:pointer\n' +
                        '                                ">\n' +
                        '                                <i class="fa fa-check fa-2x" style="color: white;margin: 12%;"></i>\n' +
                        '                            </i>\n' +
                        '                            <i id="deleteScreen\'+ i +\'" class="move-visibility crossDisapear" onclick="deleteSuggestedObject(event)" aria-hidden="true" data-popup-ordinal="0" style="\n' +
                        '                                position: absolute;\n' +
                        '                                width: 30%;\n' +
                        '                                height: 27%;\n' +
                        '                                z-index: 10000;\n' +
                        '                                left: 65%;\n' +
                        '                                top: 50%;\n' +
                        '                                transform: translate(-50%,-50%);\n' +
                        '                                background-color: #b5b4b4;\n' +
                        '                                border-radius: 50%;\n' +
                        '                                cursor:pointer\n' +
                        '                                ">\n' +
                        '                                <i class="fa fa-close fa-2x" style="color: white;margin: 12%;"></i>\n' +
                        '                            </i>\n' +
                        '                            <i class="checkIconDeselect" aria-hidden="true" data-popup-ordinal="0" style="\n' +
                        '                                position: absolute;\n' +
                        '                                width: 30%;\n' +
                        '                                height: 27%;\n' +
                        '                                z-index: 10000;\n' +
                        '                                left: 50%;\n' +
                        '                                top: 50%;\n' +
                        '                                transform: translate(-50%,-50%);\n' +
                        '                                background-color: #b5b4b400;\n' +
                        '                                border-radius: 50%;\n' +
                        '                                cursor: pointer;\n' +
                        '                                visibility: hidden;\n' +
                        '                                ">\n' +
                        '                                <i class="fa fa-check fa-2x checkIcon" onclick="checkOkDeselect(event)" style="color: white;margin: 12%;"></i>\n' +
                        '                            </i>\n' +
                        '                        </div>\n' +
                        '                    </div>\n' +
                        '                </div>\n' +
                        '            </div>\n' +
                        '        </div>\n' +
                        '    </div>';
                    toAdd_widget.appendChild(searchWidgets);
                }
                document.getElementById("widgetsHidder").appendChild(toAdd_widget);
                $('#widgetsHidder').attr('style', 'visibility: visible;width:'+(147*result_counter)+'px;height: 160px;');

            }
        ).done(function(){
            for(var key in ticked) {
                $('#'+ ticked[key]).find('.checkIcon').attr('style', 'color: #18a689;margin: 12%;');
                $('#'+ ticked[key]).find('.checkIconDeselect').attr('style', 'position: absolute;width: 30%;height: 27%;z-index: 10000;left: 50%;top: 50%;transform: translate(-50%,-50%);background-color: #b5b4b400;border-radius: 50%;cursor:pointer');
                $('#'+ ticked[key]).find('.crossDisapear').attr('style', 'visibility:hidden;');
                $('#'+ ticked[key]).find('.checkIconSelected').attr('style', 'visibility:hidden;');
                $('#'+ ticked[key]).find('.imgHideScreen').attr('style', 'width:100%;height:100%;opacity:0.5;');
                $('#'+ ticked[key]).find('.imgHideScreen').attr('style', 'width:100%;height:100%;opacity:0.5;');
                $('#approveButton').attr('style', 'padding: 0;padding-top: 10px;visibility: visible;');
            }
        })
    }

    function widgetsContainer(){
        $('#screensHidder').empty();
        $('#widgetsHidder').empty();
        var results = searching_widgets(document.getElementById('upload-search').value);
        document.getElementById('reduceOnUpload').style = 'width: 780px;height: 695px;background-color: #f3f3f4;border-top-style: none;';
        document.getElementById('hideOnUpload').style = 'padding-top: 0;visibility: visible;';
        document.getElementById('parentHideOnUpload').style = 'padding: 0;border-top: none;';
        $('#widgetsHidder').attr('style', 'visibility: visible;height: auto;');
        $('.screensHidderClass').attr('style', 'height: 150px;width: 0;float: left;border-top: 1px solid #e7eaec;margin: 5px 0 5px 5px;');
        $('.widgetsHidderClass').attr('style', 'height: 150px;width: 142px;float: left;border-top: 1px solid #e7eaec;margin: 5px 0 5px 5px;');
        $('#screensHidder').attr('style', 'visibility: hidden;height: auto;');
        $('#searchSuggestionResult').removeClass('hidden');
        $('#widgets_tab').addClass('active');
        $('#screens_tab').removeClass('active');
    }

    function screenContainer(){
        $('#widgetsHidder').empty();
        $('#screensHidder').empty();
        searching_screens(document.getElementById('upload-search').value);
        console.log("create post is working!");
        i++;
        document.getElementById('reduceOnUpload').style = 'width: 780px;height: 695px;background-color: #f3f3f4;border-top-style: none;';
        document.getElementById('hideOnUpload').style = 'padding-top: 0;visibility: visible;';
        document.getElementById('parentHideOnUpload').style = 'padding: 0;border-top: none;';
        $('#widgetsHidder').attr('style', 'visibility: hidden;height: auto;');
        $('.screensHidderClass').attr('style', 'height: 150px;width: 142px;float: left;border-top: 1px solid #e7eaec;margin: 5px 0px 5px 5px;');
        $('.widgetsHidderClass').attr('style', 'height: 150px;width: 0;float: left;border-top: 1px solid #e7eaec;margin: 5px 0 5px 5px;');
        $('#searchSuggestionResult').removeClass('hidden');
        $('#screens_tab').addClass('active');
        $('#widgets_tab').removeClass('active');
    }

    var i = 0;
    var ticked_counter = 0; //count saved data
    var ticked = {}; //save ticked data, can be improve more by separating two dictionaries, one for widgets and one for screens


    function checkOK(e){
        var tar = e.target.closest('p').getAttribute("id");
        ticked_counter++; // add counter to allow approveButton sign to lit up
        ticked[tar] = tar;
        $('#' + tar).find('.checkIcon').attr('style', 'color: #18a689;margin: 12%;');
        $('#' + tar).find('.checkIconDeselect').attr('style', 'position: absolute;width: 30%;height: 27%;z-index: 10000;left: 50%;top: 50%;transform: translate(-50%,-50%);background-color: #b5b4b400;border-radius: 50%;cursor:pointer');
        $('#' + tar).find('.crossDisapear').attr('style', 'visibility:hidden;');
        $('#' + tar).find('.checkIconSelected').attr('style', 'visibility:hidden;');
        $('#' + tar).find('.imgHideScreen').attr('style', 'width:100%;height:100%;opacity:0.5;');
        $('#' + tar).find('.imgHideScreen').attr('style', 'width:100%;height:100%;opacity:0.5;');
        if(ticked_counter > 0){
            $('#approveButton').attr('style', 'padding: 0;padding-top: 10px;visibility: visible;');
        }
    }

    function checkOkDeselect(e) {
        var tar = e.target.closest('p').getAttribute("id");
        ticked_counter--;// decrease counter to allow approveButton to dim if no item is are all deselected
        delete ticked[tar];
        $('#' + tar).find('.crossDisapear').attr('style', 'position: absolute;width: 30%;height: 27%;z-index: 10000;left: 65%;top: 50%;transform: translate(-50%,-50%);background-color: #b5b4b4;border-radius: 50%;cursor:pointer;');
        $('#' + tar).find('.crossDisapear').innerHTML = '<i class="fa fa-close fa-2x" style="color: white;margin: 12%;"></i>';
        $('#' + tar).find('.checkIconSelected').attr('style', 'position: absolute;width: 30%;height: 27%;z-index: 10000;left: 33%;top: 50%;transform: translate(-50%,-50%);background-color: #b5b4b4;border-radius: 50%;cursor:pointer;');
        $('#' + tar).find('.checkIconSelected').innerHTML = '<i class="fa fa-check fa-2x" style="color: white;margin: 12%;"></i>';
        $('#' + tar).find('.checkIconDeselect').attr('style', 'visibility:hidden;');
        $('#' + tar).find('.imgHideScreen').attr('style', 'width:100%;height:100%;opacity:1;');
        $('#' + tar).find('.imgHideWidgets').attr('style', 'width:100%;height:100%;opacity:1;');
        if(ticked_counter <= 0){
            $('#approveButton').attr('style', 'padding: 0;padding-top: 10px;visibility: hidden;');
        }
    }

    function changeAspectRatioLaptop(){
         $('#tab-body').removeClass('tab-content-tablet tab-content-phone').addClass('tab-content');
         document.getElementById('tab-body-color').style = 'padding: 10px 20px 10px 20px;height:442px';
         document.getElementById('tab-body-layout').style = 'padding: 10px 20px 10px 20px;height:442px';
         // document.getElementById('tab-body-layoutCT').style = 'padding: 15px 4px 4px 1px;height:442px';
         $('#tab-3').removeClass('tab-pane-phone tab-pane-tablet').addClass('tab-pane');
         $('#panel-id').removeClass('panel-body-phone panel-body-tablet').addClass('panel-body');
         $('#midCol').removeClass('testing-phone testing-tablet').addClass('testing');
         $('#device-frame').removeClass('size-tablet background-tablet background-tablet-rotate size-mobile background-mobile background-mobile-rotate').addClass('size-laptop-default background-laptop');
         $('#general-contain').removeClass('general-size-tablet general-size-mobile').addClass('general-size-laptop');
         $('#container-inside-frame').removeClass('content-inside-frame-tablet content-inside-frame-mobile').addClass('content-inside-frame-laptop');
         $("#sortable").removeClass("nav-stacked-tablet nav-stacked-mobile").addClass("nav-stacked-laptop");
         $("#sortableCT").removeClass("nav-stacked-tablet nav-stacked-mobile").addClass("nav-stacked-laptop");
         $("#sortableR").removeClass("nav-stacked-tablet nav-stacked-mobile").addClass("nav-stacked-laptop");
         $("#sortableSlidesCT").removeClass("tablet-dimension mobile-dimension").addClass("laptop-dimension");
         $("#contentlistLT").removeClass("layout-tablet-dimension layout-mobile-dimension").addClass("layout-laptop-dimension");
         $("#contentlistCT").removeClass("layout-tablet-dimension layout-mobile-dimension").addClass("layout-laptop-dimension");
         $('#layout-panel').removeClass("layout-panel-body-tablet layout-panel-body-mobile").addClass("layout-panel-body-laptop");
         if ($(window).width() < 768) {
             document.getElementById('rotate-tablet1').style = 'width: 80px;visibility: hidden;margin-left:240px;margin-top:-50px;';
             document.getElementById('rotate-tablet2').style = 'width: 80px;visibility: hidden;margin-left:240px;margin-top:-45px;';
             document.getElementById('rotate-phone1').style = 'width: 80px;visibility: hidden;margin-left:240px;margin-top:-40px;';
             document.getElementById('rotate-phone2').style = 'width: 80px;visibility: hidden;margin-left:240px;margin-top:-40px;';
         } else {
             document.getElementById('rotate-tablet1').style = 'width: 80px;visibility: hidden;';
             document.getElementById('rotate-tablet2').style = 'width: 80px;visibility: hidden;margin-left:-80px;';
             document.getElementById('rotate-phone1').style = 'width: 80px;visibility: hidden;margin-left:-80px;';
             document.getElementById('rotate-phone2').style = 'width: 80px;visibility: hidden;margin-left:-80px;';
         }
         document.getElementById('panel-id').style = 'padding:0px;';
         document.getElementById('device-frame').style = 'max-height: 860px;width: 100%;height: 100%;margin-top:15px';
         document.getElementById('general-contain').style = 'margin-left:4%; height:100%;';
         document.getElementById('container-inside-frame').style = 'height:inherit;';
    }

    function changeAspectRatioTablet(){
        $('#tab-body').removeClass('tab-content tab-content-phone').addClass('tab-content-tablet');
        document.getElementById('tab-body-color').style = 'padding: 10px 20px 10px 20px;height:726px';
        document.getElementById('tab-body-layout').style = 'padding: 10px 20px 10px 20px;height:726px';
        // document.getElementById('tab-body-layoutCT').style = 'padding: 10px 0px 10px 0px;height:726px';
        $('#tab-3').removeClass('tab-pane tab-pane-phone').addClass('tab-pane-tablet');
        $('#panel-id').removeClass('panel-body-phone panel-body').addClass('panel-body-tablet');
        $('#midCol').removeClass('testing-phone testing').addClass('testing-tablet');
        $('#device-frame').removeClass('size-laptop-default background-laptop background-tablet-rotate size-mobile background-mobile background-mobile-rotate').addClass('size-tablet background-tablet');
        $('#general-contain').removeClass('general-size-laptop general-size-mobile').addClass('general-size-tablet');
        $('#container-inside-frame').removeClass('content-inside-frame-laptop content-inside-frame-mobile').addClass('content-inside-frame-tablet');
        $("#sortable").removeClass("nav-stacked-laptop nav-stacked-mobile").addClass("nav-stacked-tablet");
        $("#sortableCT").removeClass("nav-stacked-laptop nav-stacked-mobile").addClass("nav-stacked-tablet");
        $("#sortableR").removeClass("nav-stacked-laptop nav-stacked-mobile").addClass("nav-stacked-tablet");
        $("#sortableSlidesCT").removeClass("laptop-dimension mobile-dimension").addClass("tablet-dimension");
        $("#contentlistLT").removeClass("layout-laptop-dimension layout-mobile-dimension").addClass("layout-tablet-dimension");
        $("#contentlistCT").removeClass("layout-laptop-dimension layout-mobile-dimension").addClass("layout-tablet-dimension");
        $('#layout-panel').removeClass("layout-panel-body-laptop layout-panel-body-mobile").addClass("layout-panel-body-tablet");
        if ($(window).width() < 768) {
            document.getElementById('rotate-tablet1').style = 'width: 80px;visibility: visible;margin-left:240px;margin-top:-50px;';
            document.getElementById('rotate-tablet2').style = 'width: 80px;visibility: hidden;margin-left:240px;margin-top:-45px;';
            document.getElementById('rotate-phone1').style = 'width: 80px;visibility: hidden;margin-left:240px;margin-top:-40px;';
            document.getElementById('rotate-phone2').style = 'width: 80px;visibility: hidden;margin-left:240px;margin-top:-40px;';
        } else {
            document.getElementById('rotate-tablet1').style = 'width: 80px;visibility: visible;';
            document.getElementById('rotate-tablet2').style = 'width: 80px;visibility: hidden;margin-left:-80px;';
            document.getElementById('rotate-phone1').style = 'width: 80px;visibility: hidden;margin-left:-80px;';
            document.getElementById('rotate-phone2').style = 'width: 80px;visibility: hidden;margin-left:-80px;';
        }
        document.getElementById('panel-id').style = 'height:1995px;';
        document.getElementById('device-frame').style = 'width:75%;height:100%;position: absolute;top: 50%;left: 50%;transform: translate(-50%,-50%);margin-top:15px';
        document.getElementById('general-contain').style = 'margin-left:4%;height:100%;margin-top:-2%;';
        document.getElementById('container-inside-frame').style = 'height:inherit;';
    }

    function changeAspectRatioPhone(){
        $('#tab-body').removeClass('tab-content tab-content-tablet').addClass('tab-content-phone');
        document.getElementById('tab-body-color').style = 'padding: 10px 20px 10px 20px;height:657px';
        document.getElementById('tab-body-layout').style = 'padding: 10px 20px 10px 20px;height:657px';
        // document.getElementById('tab-body-layoutCT').style = 'padding: 10px 0px 10px 0px;height:657px';
        $('#tab-3').removeClass('tab-pane tab-pane-tablet').addClass('tab-pane-phone');
        $('#panel-id').removeClass('panel-body-tablet panel-body').addClass('panel-body-phone');
        $('#midCol').removeClass('testing-tablet testing').addClass('testing-phone');
        $('#device-frame').removeClass('size-laptop-default background-laptop size-tablet background-tablet background-tablet-rotate background-mobile-rotate').addClass('size-mobile background-mobile');
        $('#general-contain').removeClass('general-size-laptop general-size-tablet').addClass('general-size-mobile');
        $('#container-inside-frame').removeClass('content-inside-frame-laptop content-inside-frame-tablet').addClass('content-inside-frame-mobile');
        $("#sortable").removeClass("nav-stacked-laptop nav-stacked-tablet").addClass("nav-stacked-mobile");
        $("#sortableCT").removeClass("nav-stacked-laptop nav-stacked-tablet").addClass("nav-stacked-mobile");
        $("#sortableR").removeClass("nav-stacked-laptop nav-stacked-tablet").addClass("nav-stacked-mobile");
        $("#sortableSlidesCT").removeClass("laptop-dimension tablet-dimension").addClass("mobile-dimension");
        $("#contentlistLT").removeClass("layout-laptop-dimension layout-tablet-dimension").addClass("layout-mobile-dimension");
        $("#contentlistCT").removeClass("layout-laptop-dimension layout-tablet-dimension").addClass("layout-mobile-dimension");
        $('#layout-panel').removeClass("layout-panel-body-tablet layout-panel-body-laptop").addClass("layout-panel-body-mobile");
        if ($(window).width() < 768) {
            document.getElementById('rotate-tablet1').style = 'width: 80px;visibility: hidden;margin-left:240px;margin-top:-50px;';
            document.getElementById('rotate-tablet2').style = 'width: 80px;visibility: hidden;margin-left:240px;margin-top:-45px;';
            document.getElementById('rotate-phone1').style = 'width: 80px;visibility: visible;margin-left:240px;margin-top:-40px;';
            document.getElementById('rotate-phone2').style = 'width: 80px;visibility: hidden;margin-left:240px;margin-top:-40px;';
        } else {
            document.getElementById('rotate-tablet1').style = 'width: 80px;visibility: hidden;';
            document.getElementById('rotate-tablet2').style = 'width: 80px;visibility: hidden;margin-left:-80px;';
            document.getElementById('rotate-phone1').style = 'width: 80px;visibility: visible;margin-left:-80px;';
            document.getElementById('rotate-phone2').style = 'width: 80px;visibility: hidden;margin-left:-80px;';
        }
        document.getElementById('panel-id').style = 'height:2000px;';
        document.getElementById('device-frame').style = 'width:50%;height:98%;position: absolute;top: 49%;left: 50%;transform: translate(-50%,-50%);margin-top:15px';
        document.getElementById('general-contain').style = 'margin-left:6%;height:100%;margin-top:-1%;';
        document.getElementById('container-inside-frame').style = 'height:inherit;';
    }

    function testRotateTablet() {
        $('#device-frame').removeClass('background-tablet').addClass('background-tablet-rotate');
        document.getElementById('device-frame').style = 'width:100%;height:60%;position: absolute;left: 51%;transform: translate(-50%,0%);margin-top:15px';
        document.getElementById('general-contain').style = 'margin-left:7%;height:94%;margin-top:-8.5%;padding-bottom:0px';
        document.getElementById('container-inside-frame').style = 'height:inherit;width:82.5%;';
        if ($(window).width() < 768) {
            document.getElementById('rotate-tablet1').style = 'width: 80px;visibility: hidden;margin-left:240px;margin-top:-50px;';
            document.getElementById('rotate-tablet2').style = 'width: 80px;visibility: visible;margin-left:240px;margin-top:-45px;';
        } else {
            document.getElementById('rotate-tablet1').style = 'width: 80px;visibility: hidden;';
            document.getElementById('rotate-tablet2').style = 'width: 80px;visibility: visible;margin-left:-80px;';
        }
    }

    function testRotateTablet2() {
        $('#device-frame').removeClass('background-tablet-rotate').addClass('background-tablet');
        document.getElementById('device-frame').style = 'width:75%;height:100%;position: absolute;top: 50%;left: 50%;transform: translate(-50%,-50%);margin-top:15px';
        document.getElementById('general-contain').style = 'margin-left:4%;height:100%;margin-top:-2%;';
        document.getElementById('container-inside-frame').style = 'height:inherit;';
        if ($(window).width() < 768) {
            document.getElementById('rotate-tablet1').style = 'width: 80px;visibility: visible;margin-left:240px;margin-top:-50px;';
            document.getElementById('rotate-tablet2').style = 'width: 80px;visibility: hidden;margin-left:240px;margin-top:-45px;';
        } else {
            document.getElementById('rotate-tablet1').style = 'width: 80px;visibility: visible;';
            document.getElementById('rotate-tablet2').style = 'width: 80px;visibility: hidden;margin-left:-80px;';
        }
    }

    function testRotatePhone() {
        $('#device-frame').removeClass('background-mobile').addClass('background-mobile-rotate');
        document.getElementById('device-frame').style = 'width:98%;height:50%;position: absolute;left: 50%;transform: translate(-50%,0%);margin-top:15px';
        document.getElementById('general-contain').style = 'margin-left:11%;height:93.5%;margin-top:-17%;padding-bottom:0px';
        document.getElementById('container-inside-frame').style = 'height:inherit;width:78%;';
        if ($(window).width() < 768) {
            document.getElementById('rotate-phone1').style = 'width: 80px;visibility: hidden;margin-left:240px;margin-top:-40px;';
            document.getElementById('rotate-phone2').style = 'width: 80px;visibility: visible;margin-left:240px;margin-top:-40px;';
        } else {
            document.getElementById('rotate-phone1').style = 'width: 80px;visibility: hidden;margin-left:-80px;';
            document.getElementById('rotate-phone2').style = 'width: 80px;visibility: visible;margin-left:-80px;';
        }
    }

    function testRotatePhone2() {
        $('#device-frame').removeClass('background-mobile-rotate').addClass('background-mobile');
        document.getElementById('device-frame').style = 'width:50%;height:98%;position: absolute;top: 49%;left: 50%;transform: translate(-50%,-50%);margin-top:15px';
        document.getElementById('general-contain').style = 'margin-left:6%;height:100%;margin-top:-1%;';
        document.getElementById('container-inside-frame').style = 'height:inherit;';
        if ($(window).width() < 768) {
            document.getElementById('rotate-phone1').style = 'width: 80px;visibility: visible;margin-left:240px;margin-top:-40px;';
            document.getElementById('rotate-phone2').style = 'width: 80px;visibility: hidden;margin-left:240px;margin-top:-40px;';
        } else {
            document.getElementById('rotate-phone1').style = 'width: 80px;visibility: visible;margin-left:-80px;';
            document.getElementById('rotate-phone2').style = 'width: 80px;visibility: hidden;margin-left:-80px;';
        }
    }

    $(document).ready(function() {
        $('input[type="text"]').on('keypress', function() {
            var $this = $(this), value = $this.val();
            if (value.length === 1) {
                $this.val( value.charAt(0).toUpperCase() );
            }
        });
    });

    //Workflow functions
    function closeWorkflow() {
        $('#workflowDisappearer').addClass('hidden');
        $('#workflowTurnOn').addClass('hidden');
        $('#workflowTurnOff').removeClass('hidden');
    }

    //Hide workflow on window loaded
    $(document).ready(function() {
        initialCloseWorkflow();
    });

    function initialCloseWorkflow() {
        $('#workflowDisappearer').addClass('hidden');
        $('#workflowTurnOn').addClass('hidden');
        $('#workflowTurnOff').removeClass('hidden');
    }

     //Prototype mode
    // function prototypeActivater() {
    //     var getLink, i, linkCheck;
    //     $('#changeheightonTabclickI').addClass('hidden');
    //     $('#uploadSection12').addClass('hidden');
    //     $('#changeheightonTabclickPU').removeClass('hidden');
    //     $('#projectSection').removeClass('col-xs-10');
    //     $('#projectSection')  .addClass('col-xs-12');
    //     $('#hideAtPrototypeOff').removeClass('hidden');
    //     //Check if link is clickable
    //     getLink = $('#classContainer-selectorPro').find('button');
    //     //If checking if the link exists
    //     if (getLink.length) {
    //         for (i=0;i<getLink.length;i++){
    //             linkCheck = getLink[i].getAttribute('linkvalue');
    //             if (linkCheck !== null) {
    //                 console.log('link is connected');
    //                 $('#containerTitlePrototype').addClass('hidden');
    //                 checkLockedPro();
    //             }
    //             else {
    //                 console.log('no link');
    //                 $('#containerTitlePrototype').removeClass('hidden');
    //             }
    //         }
    //     } else {
    //         console.log("yes");
    //     }
    // }


    function prototypeDeactivater(){
        $('#prototypeContainer').addClass('hidden');
        $('#changeheightonTabclickPU').addClass('hidden');
        $('#changeheightonTabclickI').removeClass('hidden');
        $('#uploadSection12').removeClass('hidden');
        $('#projectSection').addClass('col-xs-10').removeClass('col-xs-12');
        $('#hideAtPrototypeOff').addClass('hidden');
        checkLocked();
    }


    $(document).ready(function () {
        document.getElementById('classContainer-selectorPro').onmouseover = function (event) {
            console.log("event.target.id");
            console.log(event.target.id);
            var findAllpages = $('#datatables-example').find('.checkImageNameScreenshotSelector');
            //if the mouse is outside the classContainer-selectorPro
            if(event.target.id !== 'classContainer-selectorPro'){
                var elemid = event.target.id;
                var elem = document.getElementById(elemid);
                var elemTagName = elem.tagName;
                console.log("tagName");
                console.log(elemTagName);
                // Checking the element it is button or hyperlink
                if(elemTagName === "BUTTON" || elemTagName === "A"){
                    var linkValue = $('#'+elemid).attr('linkvalue');
                    console.log("linkValue");
                    console.log(linkValue);
                    // Checking we have got the Value in the linkvalue attr in element
                    // if block executes if it has the linkvalue
                    // else block execute if there is no linkvalue
                    if (typeof linkValue !== typeof undefined && linkValue !== false){
                        var element = document.getElementById(elemid);
                        var style = window.getComputedStyle(element, null);
                        var top = parseFloat(style.top);
                        var left = parseFloat(style.left);
                        var width = parseFloat(style.width);
                        var height = parseFloat(style.height);
                        var border = style.border;
                        var borderradius = style.borderRadius;

                        document.getElementById('linktogoto').style.display = '';
                        document.getElementById('linktogo').value = linkValue;
                        document.getElementById('linktogoto').style.top = top + 'px';
                        document.getElementById('linktogoto').style.left = left + 'px';
                        document.getElementById('linktogoto').style.width = width + 'px';
                        document.getElementById('linktogoto').style.height = height + 'px';
                        document.getElementById('linktogoto').style.border = border;
                        document.getElementById('linktogoto').style.borderRadius = borderradius;
                        document.getElementById('linktogoto').style.cursor = 'pointer';

                        for(i=0;i<findAllpages.length;i++){
                            // Real Name of the page
                            var ft = findAllpages[i].title;
                            // screen name that is connected to from the element
                            var fid = findAllpages[i].innerHTML;
                            if(linkValue === fid){
                                document.getElementById(fid).style.border = '2px solid #18a689';
                            }
                        }
                    }
                    else{
                        document.getElementById('testPro').innerHTML = elemid;
                        console.log("elemid");
                        console.log(elemid);
                        // var element1 = document.getElementById(elemid);
                        // console.log("element");
                        // console.log(element1);
                        // console.log()
                        // var style1 = window.getComputedStyle(element1, null);
                        // var rect = document.getElementById(elemid).getBoundingClientRect();
                        $('#linkListPro').remove();
                        var ht = '<div id="linkListPro" class="dropdown" style="z-index: 1; position: absolute"><button id="linkbuttonPro" class="btn btn-default btn-sm dropbtn" data-toggle="dropdown" style="border-radius: 3px;">\n' +
                            '                                        <span class="fa fa-link"><b class="caret" style="margin-left: 5px;"></b></span>\n' +
                            '                                    </button><ul class="dropdown-menu" id="optionListPro"><li>';
                        // console.log("check after ht");
                        for(i=0;i<findAllpages.length;i++) {
                           var v = findAllpages[i].innerHTML;
                           ht += '<a onclick=\"changeUrlPro(\"'+v+'\")\" value=\"' + v + '\">' + v + '</a>' + '\n';
                        }
                        ht += '</li></ul></div></span>';
                        // console.log(ht);
                        $('#dropdownPro').append(ht);

                        $('#'+elemid).removeClass("main");
                        var classTop = document.getElementById(elemid).className.trim();
                        console.log("classTop");
                        console.log(classTop);
                        var top1 = $('.'+classTop).css('top');
                        var left1 = $('.'+classTop).css('left');
                        console.log(top1);
                        console.log(left1);
                        document.getElementById('linkListPro').style.top = top1;
                        document.getElementById('linkListPro').style.left = left1;
                        document.getElementById('linkListPro').style.width = 'auto' + '%';
                        document.getElementById('linkListPro').style.height = 4 + '%';
                        document.getElementById('linkListPro').style.marginLeft = 36 + 'px';
                        document.getElementById('linkListPro').style.visibility = 'visible !important';
                    }
                }
            }
            //if the mouse in inside the classContainer-selectorPro
            else{
                var fid;
                $('#linkListPro').addClass('hidden');
                $('#drag-resizeId').remove();
                console.log("FFFFFFFFFFFFFFFFFFFFf else in class container");
                console.log(findAllpages);
                for(i=0;i<findAllpages.length;i++) {
                    // Real Name of the page
                    // screen name that is connected to from the element
                    fid = findAllpages[i].innerHTML;
                    document.getElementById('linktogoto').style.display = 'none';
                    document.getElementById(fid).style.border = 'none';
                }
            }
        };
    });

    function changeUrlPro (url) {
        console.log("pro changeUrlPro");
        console.log(url);
        //var url = document.getElementById('optionList').value;
        document.getElementById('hrefURL').value = url;
        document.getElementById('idForURL').value = document.getElementById('testPro').innerHTML;
        var id = document.getElementById('testPro').innerHTML;
        // $('#linkListPro').addClass('hidden');
        $.ajax({
            type : 'POST',
            url : '/index/',
            name : 'updateURL',
            data : {'name':'updateURL',
            'id':id,
            'href': url},
            success: function(data){
                console.log('url updated')
            }
        })
    }

    //Window onload Function
    $(document).ready(function() {
    // run test on initial page load
        checkSize();
        // run test on resize of the window
        $(window).resize(checkSize);
    });
        //Function to the css rule

    function checkSize() {
        if ($(window).width() > 1299) {
            $('#projectSection').addClass('col-xs-10');
            $('#uploadSection').addClass('col-xs-2');
        } else {
            $('#projectSection').removeClass('col-xs-10');
            $('#uploadSection').removeClass('col-xs-2');
        }

        if ($(window).width() < 1300 && $(window).width() > 795) {
            $('#projectSection').addClass('col-xs-9');
            $('#uploadSection').removeClass('col-xs-2').addClass('col-xs-3');
        } else {
            $('#projectSection').removeClass('col-xs-9') ;
            $('#uploadSection').removeClass('col-xs-3');
        }

        if ($(window).width() < 796 && $(window).width() > 550) {
            $('#projectSection').addClass('col-xs-8');
            $('#uploadSection').addClass('col-xs-4');
        } else {
            $('#projectSection').removeClass('col-xs-8');
            $('#uploadSection').removeClass('col-xs-4');
        }

        if ($(window).width() < 551 && $(window).width() > 450) {
            $('#projectSection').addClass('col-xs-7');
            $('#uploadSection').addClass('col-xs-5');
        } else {
            $('#projectSection').removeClass('col-xs-7');
            $('#uploadSection').removeClass('col-xs-5');
        }

        if ($(window).width() < 451) {
            $('#projectSection').addClass('col-xs-6');
            $('#uploadSection').addClass('col-xs-6');
        } else {
            $('#projectSection').removeClass('col-xs-6');
            $('#uploadSection').removeClass('col-xs-6');
        }

        if ($(window).width() < 1130 && $(window).width() > 767) {
            $('body').addClass('body-small mini-navbar');
        } else {
            $('body').removeClass('body-small mini-navbar');
        }

        if ($(window).width() < 767) {
            $('body').addClass('body-small');
        } else {
            $('body').removeClass('body-small');
        }

        if ($(window).width() < 1300) {
            $('#layoutTitle').text('Layout');
        } else {
            $('#layoutTitle').text('Layout Variations');
        }

        if ($(window).width() < 1040) {
            $('#colorTitle').text('Color');
        } else {
            $('#colorTitle').text('Color Transfer');
        }

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
    }


    $(window).bind('resize', function(){
        if ($(this).width() < 768){
            if ($('#tablet').hasClass('active')) {
                if (document.getElementById('rotate-tablet1').style === 'width: 80px;visibility:visible;margin-left:-80px;') {
                    document.getElementById('rotate-tablet1').style = 'width: 80px;visibility:visible;margin-left:240px;margin-top:-50px;';
                    document.getElementById('rotate-tablet2').style = 'width: 80px;visibility:hidden;margin-left:240px;margin-top:-45px;';
                    document.getElementById('rotate-phone1').style = 'width: 80px;visibility:hidden;margin-left:240px;margin-top:-40px;';
                    document.getElementById('rotate-phone2').style = 'width: 80px;visibility:hidden;margin-left:240px;margin-top:-40px;';
                } else {
                    document.getElementById('rotate-tablet1').style = 'width: 80px;visibility:hidden;margin-left:240px;margin-top:-50px;';
                    document.getElementById('rotate-tablet2').style = 'width: 80px;visibility:visible;margin-left:240px;margin-top:-45px;';
                    document.getElementById('rotate-phone1').style = 'width: 80px;visibility:hidden;margin-left:240px;margin-top:-40px;';
                    document.getElementById('rotate-phone2').style = 'width: 80px;visibility:hidden;margin-left:240px;margin-top:-40px;';
                }
            } else if ($('#mobile').hasClass('active')) {
                if (document.getElementById('rotate-phone1').style === 'width: 80px;visibility:visible;margin-left:-80px;') {
                    document.getElementById('rotate-tablet1').style = 'width: 80px;visibility:hidden;margin-left:240px;margin-top:-50px;';
                    document.getElementById('rotate-tablet2').style = 'width: 80px;visibility:hidden;margin-left:240px;margin-top:-45px;';
                    document.getElementById('rotate-phone1').style = 'width: 80px;visibility:visible;margin-left:240px;margin-top:-40px;';
                    document.getElementById('rotate-phone2').style = 'width: 80px;visibility:hidden;margin-left:240px;margin-top:-40px;';
                } else {
                    document.getElementById('rotate-tablet1').style = 'width: 80px;visibility:hidden;margin-left:240px;margin-top:-50px;';
                    document.getElementById('rotate-tablet2').style = 'width: 80px;visibility:hidden;margin-left:240px;margin-top:-45px;';
                    document.getElementById('rotate-phone1').style = 'width: 80px;visibility:hidden;margin-left:240px;margin-top:-40px;';
                    document.getElementById('rotate-phone2').style = 'width: 80px;visibility:visible;margin-left:240px;margin-top:-40px;';
                }
            }
        } else {
            if ($('#tablet').hasClass('active')) {
                if (document.getElementById('rotate-tablet1').style === 'width: 80px;visibility:visible;margin-left:240px;margin-top:-50px;') {
                    document.getElementById('rotate-tablet1').style = 'width: 80px;visibility:visible;';
                    document.getElementById('rotate-tablet2').style = 'width: 80px;visibility:hidden;margin-left:-80px;';
                    document.getElementById('rotate-phone1').style = 'width: 80px;visibility:hidden;margin-left:-80px';
                    document.getElementById('rotate-phone2').style = 'width: 80px;visibility:hidden;margin-left:-80px;';
                } else {
                    document.getElementById('rotate-tablet1').style = 'width: 80px;visibility:hidden;';
                    document.getElementById('rotate-tablet2').style = 'width: 80px;visibility:visible;margin-left:-80px;';
                    document.getElementById('rotate-phone1').style = 'width: 80px;visibility:hidden;margin-left:-80px';
                    document.getElementById('rotate-phone2').style = 'width: 80px;visibility:hidden;margin-left:-80px;';
                }
            } else if ($('#mobile').hasClass('active')) {
                if (document.getElementById('rotate-phone1').style === 'width: 80px;visibility:visible;margin-left:240px;margin-top:-40px;') {
                    document.getElementById('rotate-tablet1').style = 'width: 80px;visibility:hidden;';
                    document.getElementById('rotate-tablet2').style = 'width: 80px;visibility:hidden;margin-left:-80px;';
                    document.getElementById('rotate-phone1').style = 'width: 80px;visibility:visible;margin-left:-80px';
                    document.getElementById('rotate-phone2').style = 'width: 80px;visibility:hidden;margin-left:-80px;';
                } else {
                    document.getElementById('rotate-tablet1').style = 'width: 80px;visibility:hidden;';
                    document.getElementById('rotate-tablet2').style = 'width: 80px;visibility:hidden;margin-left:-80px;';
                    document.getElementById('rotate-phone1').style = 'width: 80px;visibility:hidden;margin-left:-80px;';
                    document.getElementById('rotate-phone2').style = 'width: 80px;visibility:visible;margin-left:-80px;';
                }
            }
        }
    });

    // //Search options
    // function visibleSuggestions() {
    //     document.getElementById('reduceOnUpload').style = 'width: 780px;height: 695px;background-color: #f3f3f4;border-top-style: none;';
    //     document.getElementById('hideOnUpload').style = 'padding-top: 0;visibility: visible;';
    //     document.getElementById('parentHideOnUpload').style = 'padding: 0;border-top: none;';
    //     $('#widgetsHidder').attr('style', 'visibility: hidden;height: auto;');
    //     $('.widgetsHidderClass').attr('style', 'height: 150px;width: 0;float: left;border-top: 1px solid #e7eaec;margin: 5px 0 5px 5px;');
    //     $('#screensHidder').attr('style', 'visibility: visible;height: auto;');
    //     $('#searchSuggestionResult').removeClass('hidden');
    //     if($('.checkIconDeselect').css('visibility') === 'hidden'){
    //         $('#approveButton').attr('style', 'padding: 0;padding-top: 10px;visibility: hidden;');
    //     }
    //     else{
    //         $('#approveButton').attr('style', 'padding: 0;padding-top: 10px;visibility: visible;');
    //     }
    //     screenContainer();
    //     var emptyValue = document.getElementById('upload-search').value;
    //     if (emptyValue.length === 0){
    //         document.getElementById('reduceOnUpload').style = 'width: 780px;height: 426px;background-color: #f3f3f4;border-top-style: none;';
    //         document.getElementById('hideOnUpload').style = 'padding-top: 0;visibility: visible;height:109px';
    //         document.getElementById('parentHideOnUpload').style = 'padding: 0;border-top: none;height:107px';
    //         $('#searchSuggestionResult').addClass('hidden');
    //         $('#widgetsHidder').attr('style', 'visibility: visible;height: auto;');
    //         $('#screensHidder').attr('style', 'visibility: hidden;height: auto;');
    //         $('#approveButton').attr('style', 'padding: 0;padding-top: 10px;visibility: hidden;');
    //     }
    // }
    //
    // function widgetsContainer(){
    //     document.getElementById('reduceOnUpload').style = 'width: 780px;height: 695px;background-color: #f3f3f4;border-top-style: none;';
    //     document.getElementById('hideOnUpload').style = 'padding-top: 0;visibility: visible;';
    //     document.getElementById('parentHideOnUpload').style = 'padding: 0;border-top: none;';
    //     $('#widgetsHidder').attr('style', 'visibility: visible;height: auto;');
    //     $('.screensHidderClass').attr('style', 'height: 150px;width: 0;float: left;border-top: 1px solid #e7eaec;margin: 5px 0 5px 5px;');
    //     $('.widgetsHidderClass').attr('style', 'height: 150px;width: 19%;float: left;border-top: 1px solid #e7eaec;margin: 5px 0 5px 5px;');
    //     $('#screensHidder').attr('style', 'visibility: hidden;height: auto;');
    //     $('#searchSuggestionResult').removeClass('hidden');
    // }
    //
    // var i = 0;
    // function screenContainer(){
    //     i++;
    //     document.getElementById('reduceOnUpload').style = 'width: 780px;height: 695px;background-color: #f3f3f4;border-top-style: none;';
    //     document.getElementById('hideOnUpload').style = 'padding-top: 0;visibility: visible;';
    //     document.getElementById('parentHideOnUpload').style = 'padding: 0;border-top: none;';
    //     $('#widgetsHidder').attr('style', 'visibility: hidden;height: auto;');
    //     $('.screensHidderClass').attr('style', 'height: 150px;width: 19%;float: left;border-top: 1px solid #e7eaec;margin: 5px 0 5px 5px;');
    //     $('.widgetsHidderClass').attr('style', 'height: 150px;width: 0;float: left;border-top: 1px solid #e7eaec;margin: 5px 0 5px 5px;');
    //     $('#screensHidder').attr('style', 'visibility: visible;height: auto;');
    //     $('#searchSuggestionResult').removeClass('hidden');
    // }
    //
    // function checkOk() {
    //
    //     $('.checkIcon').attr('style', 'color: #18a689;margin: 12%;');
    //     $('.checkIconDeselect').attr('style', 'position: absolute;width: 30%;height: 27%;z-index: 10000;left: 50%;top: 50%;transform: translate(-50%,-50%);background-color: #b5b4b400;border-radius: 50%;cursor:pointer');
    //     $('.crossDisapear').attr('style', 'visibility:hidden;');
    //     $('.crossDisapear').innerHTML = '';
    //     $('.checkIconSelected').attr('style', 'visibility:hidden;');
    //     $('.checkIconSelected').innerHTML = '';
    //     $('.imgHideScreen').attr('style', 'width:100%;height:100%;opacity:0.5;');
    //     $('.imgHideWidgets').attr('style', 'width:100%;height:100%;opacity:0.5;');
    //     $('#approveButton').attr('style', 'padding: 0;padding-top: 10px;visibility: visible;');
    // }
    //
    // function checkOkDeselect() {
    //     $('.crossDisapear').attr('style', 'position: absolute;width: 30%;height: 27%;z-index: 10000;left: 65%;top: 50%;transform: translate(-50%,-50%);background-color: #b5b4b4;border-radius: 50%;cursor:pointer;');
    //     $('.crossDisapear').innerHTML = '<i class="fa fa-close fa-2x" style="color: white;margin: 12%;"></i>';
    //     $('.checkIconSelected').attr('style', 'position: absolute;width: 30%;height: 27%;z-index: 10000;left: 33%;top: 50%;transform: translate(-50%,-50%);background-color: #b5b4b4;border-radius: 50%;cursor:pointer;');
    //     $('.checkIconSelected').innerHTML = '<i class="fa fa-check fa-2x" style="color: white;margin: 12%;"></i>';
    //     $('.checkIconDeselect').attr('style', 'visibility:hidden;');
    //     $('.imgHideScreen').attr('style', 'width:100%;height:100%;opacity:1;');
    //     $('.imgHideWidgets').attr('style', 'width:100%;height:100%;opacity:1;');
    //     $('#approveButton').attr('style', 'padding: 0;padding-top: 10px;visibility: hidden;');
    // }

    function deleteSuggestedObject(event){
        var getId;
            getId = event.target;
        swal({
            title: "Are you sure?",
            text: "You want to delete this sugessted Screen?",
            type: "warning",
            showCancelButton: true,
            confirmButtonClass: "btn-danger",
            confirmButtonText: "Delete",
            cancelButtonText: "Cancel",
            closeOnConfirm: true,
            closeOnCancel: true
        },
        function(isConfirm) {
            var id;
            if (isConfirm) {
                 id = getId.id;
                 alert(id);
                document.getElementById(getId).parents('.hoverer').remove();
            }
        });
    }

    //Right Side Bar
    function increaseSidebar() {
        document.getElementById('right-sidebar').style = 'width:50%';
        document.getElementById('mid-sidebar').style.display = 'none';
        document.getElementById('full-sidebar').style.display = '';
    }

    function fullSidebar() {
        document.getElementById('right-sidebar').style = 'width:88.3%; z-index: 10000;';
        document.getElementById('full-sidebar').style.display = 'none';
        document.getElementById('mini-sidebar').style.display = '';
    }

    function minimizeSidebar() {
        document.getElementById('right-sidebar').style = 'width:22%';
        document.getElementById('mini-sidebar').style.display = 'none';
        document.getElementById('mid-sidebar').style.display = '';
    }

    function openMessage(element) {
        document.getElementById('chat-title').style.display = 'none';
        document.getElementById('chatpanel').style.display = 'none';
        document.getElementById('message-search').style.display = 'none';
        document.getElementById('job-tab').style.display = 'none';
        document.getElementById('source-tab').style.display = 'none';
        document.getElementById('messagepanel').style.display = '';
        document.getElementById('name-message').innerHTML = element.children[0].children[1].children[0].children[0].innerHTML;
    }

    function openInviteMessage() {
        document.getElementById('chat-title').style.display = 'none';
        document.getElementById('chatpanel').style.display = 'none';
        document.getElementById('message-search').style.display = 'none';
        document.getElementById('job-tab').style.display = 'none';
        document.getElementById('source-tab').style.display = 'none';
        document.getElementById('invitepanel').style.display = '';
    }

    function openAdeviMessage() {
        document.getElementById('chat-title').style.display = 'none';
        document.getElementById('chatpanel').style.display = 'none';
        document.getElementById('message-search').style.display = 'none';
        document.getElementById('job-tab').style.display = 'none';
        document.getElementById('source-tab').style.display = 'none';
        document.getElementById('adevipanel').style.display = '';
    }

    function closeMessage() {
        document.getElementById('chat-title').style.display = '';
        document.getElementById('chatpanel').style.display = '';
        document.getElementById('message-search').style.display = '';
        document.getElementById('job-tab').style.display = '';
        document.getElementById('messagepanel').style.display = 'none';
        document.getElementById('invitepanel').style.display = 'none';
        document.getElementById('adevipanel').style.display = 'none';
    }

    function sendMessage() {
        if (document.getElementById('new-message').value != '') {
            var message = "<div class=\"media task\" style=\"padding-right:15px;padding-left:0;\">" +
                          "<a class=\"testTask\" style=\"width:12px;color:#c1c1c1;display:table-cell;\" onclick=\"selectMessage(this)\"><i class=\"fa fa-check\" style=\"color:inherit\"></i></a>" +
                          "<div class=\"media-body\">" +
                          "<div class=\"panel-default\">" +
                          "<div class=\"panel-body bg-primary text-white b-r-a-3\">" +
                          "<span>" + document.getElementById('new-message').value +"</span>" +
                          "</div>" +
                          "</div>" +
                          "<h6 class=\"m-t-1\"><span>Violette Lehner</span>   <small><span>09:42</span></small></h6>" +
                          "</div>" +
                          "<div class=\"media-right\">" +
                          "<div class=\"avatar avatar-image avatar-sm loaded\">" +
                          "<img class=\"media-object img-circle\" src=\"https://s3.amazonaws.com/uifaces/faces/twitter/woodydotmx/128.jpg\" alt=\"Avatar\">" +
                          "<i class=\"avatar-status avatar-status-bottom bg-success b-brand-gray-darker\"></i>" +
                          "</div>" +
                          "</div>" +
                          "</div>";
            document.getElementById('body-message').innerHTML += message;
            document.getElementById('new-message').value = '';
        }
    }

    function selectMessage(element) {
        var x = element.style.visibility;
        var y = 0;
        var children = document.getElementById('body-message').children;
        for (var i = 0; i < children.length; i++) {
            if ($(children[i]).hasClass('selected')) {
                y = y + 1;
            }
        }
        if (x == 'visible' && (y == 0 || y == 1)) {
            element.style = 'width:12px;color:c1c1c1;display:table-cell;';
            document.getElementById('new-task').style.display = 'none';
            document.getElementById('edit-task').style.display = 'none';
            document.getElementById('body-message').style = 'height:89%;padding:0;overflow:auto;';
            var parent = element.parentNode;
            $(parent).removeClass('selected');
        }
        else if (x == 'visible' && y > 1) {
            element.style = 'width:12px;color:c1c1c1;display:table-cell;';
            var parent = element.parentNode;
            $(parent).removeClass('selected');
        }
        else {
            element.style = 'width:12px;color:#18a689;display:table-cell;visibility:visible';
            document.getElementById('new-task').style.display = '';
            document.getElementById('edit-task').style.display = '';
            document.getElementById('body-message').style = 'height:85%;padding:0;overflow:auto;';
            var parent = element.parentNode;
            $(parent).addClass('selected');
        }
    }

    function changeJob() {
        document.getElementById('job-tab').style.display = '';
        document.getElementById('source-tab').style.display = 'none';
    }

    function changeSource() {
        document.getElementById('job-tab').style.display = 'none';
        document.getElementById('source-tab').style.display = '';
    }

    function selectJobAll() {
        $('#all-job').removeClass('fa-square-o').addClass('fa-check-square');
        $('#dev-job').removeClass('fa-check-square').addClass('fa-square-o');
        $('#mark-job').removeClass('fa-check-square').addClass('fa-square-o');
        var child = document.getElementById('chat-list').children
        for (var i = 0; i < child.length; i++) {
            child[i].style.display = '';
        }
    }

    function selectJobDev() {
        $('#all-job').removeClass('fa-check-square').addClass('fa-square-o');
        $('#dev-job').removeClass('fa-square-o').addClass('fa-check-square');
        $('#mark-job').removeClass('fa-check-square').addClass('fa-square-o');
        document.getElementById('user1').style.display = 'none';
        document.getElementById('user2').style.display = '';
        document.getElementById('user3').style.display = 'none';
        document.getElementById('user4').style.display = 'none';
        document.getElementById('user5').style.display = '';
        document.getElementById('user6').style.display = '';
        document.getElementById('user7').style.display = 'none';
        document.getElementById('user8').style.display = '';
        document.getElementById('user9').style.display = '';
        document.getElementById('user10').style.display = 'none';
        document.getElementById('user11').style.display = 'none';
        document.getElementById('user12').style.display = '';
    }

    function selectJobMark() {
        $('#all-job').removeClass('fa-check-square').addClass('fa-square-o');
        $('#dev-job').removeClass('fa-check-square').addClass('fa-square-o');
        $('#mark-job').removeClass('fa-square-o').addClass('fa-check-square');
        document.getElementById('user1').style.display = '';
        document.getElementById('user2').style.display = 'none';
        document.getElementById('user3').style.display = '';
        document.getElementById('user4').style.display = '';
        document.getElementById('user5').style.display = 'none';
        document.getElementById('user6').style.display = 'none';
        document.getElementById('user7').style.display = '';
        document.getElementById('user8').style.display = 'none';
        document.getElementById('user9').style.display = 'none';
        document.getElementById('user10').style.display = '';
        document.getElementById('user11').style.display = '';
        document.getElementById('user12').style.display = 'none';
    }

    function selectSourceAll() {
        $('#all-source').removeClass('fa-square-o').addClass('fa-check-square');
        $('#linkedin-source').removeClass('fa-check-square').addClass('fa-square-o');
        $('#uwork-source').removeClass('fa-check-square').addClass('fa-square-o');
        var child = document.getElementById('chat-list').children
        for (var i = 0; i < child.length; i++) {
            child[i].style.display = '';
        }
    }

    function selectSourceLinkedin() {
        $('#all-source').removeClass('fa-check-square').addClass('fa-square-o');
        $('#linkedin-source').removeClass('fa-square-o').addClass('fa-check-square');
        $('#uwork-source').removeClass('fa-check-square').addClass('fa-square-o');
        document.getElementById('user1').style.display = '';
        document.getElementById('user2').style.display = 'none';
        document.getElementById('user3').style.display = '';
        document.getElementById('user4').style.display = 'none';
        document.getElementById('user5').style.display = '';
        document.getElementById('user6').style.display = 'none';
        document.getElementById('user7').style.display = 'none';
        document.getElementById('user8').style.display = '';
        document.getElementById('user9').style.display = '';
        document.getElementById('user10').style.display = '';
        document.getElementById('user11').style.display = 'none';
        document.getElementById('user12').style.display = '';
    }

    function selectSourceUwork() {
        $('#all-source').removeClass('fa-check-square').addClass('fa-square-o');
        $('#linkedin-source').removeClass('fa-check-square').addClass('fa-square-o');
        $('#uwork-source').removeClass('fa-square-o').addClass('fa-check-square');
        document.getElementById('user1').style.display = 'none';
        document.getElementById('user2').style.display = '';
        document.getElementById('user3').style.display = 'none';
        document.getElementById('user4').style.display = '';
        document.getElementById('user5').style.display = 'none';
        document.getElementById('user6').style.display = '';
        document.getElementById('user7').style.display = '';
        document.getElementById('user8').style.display = 'none';
        document.getElementById('user9').style.display = 'none';
        document.getElementById('user10').style.display = 'none';
        document.getElementById('user11').style.display = '';
        document.getElementById('user12').style.display = 'none';
    }

    function searchChat() {
        var regex = new RegExp("" + document.getElementById('search-input-chat').value, "i");
        var child = document.getElementById('chat-list').children;
        for (var i = 1; i < child.length; i++) {
            if (i == 5 || i == 9 || i == 13 || i == 17) {
                child[i].style.display = '';
            }
            else {
                var name = child[i].children[0].children[0].children[1].children[0].children[0].innerHTML;
                if (regex.test(name)) {
                    child[i].style.display = '';
                }
                else {
                    child[i].style.display = 'none';
                }
            }
        }
    }

    function openProject() {
        document.getElementById('project-list').style.display = 'none';
        document.getElementById('project-detail').style.display = '';
        // document.getElementById('message-search-project').style.display = 'none';
    }

    function closeProject() {
        document.getElementById('project-list').style.display = '';
        document.getElementById('project-detail').style.display = 'none';
        document.getElementById('message-search-project').style.display = '';
    }

    function editTask(element) {
        var parent = element.parentNode;
        var children = parent.children;
        children[2].style.display = 'none';
        children[3].style.display = 'none';
        children[4].style.display = '';
        children[5].style.display = '';
        children[4].value = children[3].innerHTML;
    }

    function confirmEdit(element) {
        var parent = element.parentNode;
        var children = parent.children;
        children[2].style.display = 'unset';
        children[3].style.display = 'inline-block';
        children[4].style.display = 'none';
        children[5].style.display = 'none';
        children[3].innerHTML = children[4].value;
    }

    function newTask() {
        var task = "<li id=\"task-creation\" class=\"edit-task\" style=\"padding-left:0;\"><input id=\"new-value\" type=\"text\" style=\"width:90%\"><button class=\"btn\" style=\"padding:0 6px\" onclick=\"confirmNewTask()\">Ok</button></li>";
        document.getElementById('task-list').innerHTML += task;
    }

    function confirmNewTask() {
        var confirm = "<span class=\"col-xs-3\">Pending...</span>" +
                      "<a class=\"task-edit\" href=\"#\" onclick=\"editTask(this)\" style=\"display:unset;margin-left:-5px;float:left;\"><i class=\"fa fa-pencil\"></i> </a>" +
                      "<a href=\"#\" class=\"check-link\" onclick=\"completeTask(this)\" style=\"display:unset;margin-left:5px;float:left;\"><i class=\"fa fa-square-o\"></i> </a>" +
                      "<span class=\"m-l-xs\" style=\"display:inline-block;max-width:150px;\">" + document.getElementById('new-value').value + "</span>" +
                      "<input id=\"edit-input\" type=\"text\" style=\"display:none\">" +
                      "<button id=\"edit-confirm\" class=\"btn\" style=\"display:none;padding:0 6px\" onclick=\"confirmEdit(this)\">Ok</button>" +
                      "<span style=\"float:right;padding-right:15px\"><i class=\"fa fa-clock-o\" style=\"color:5a5a5a;\"></i>08:20am</span>";
        document.getElementById('task-creation').innerHTML = confirm;
        document.getElementById('task-creation').id = '';
    }

    function completeTask(element) {
        $(element.firstChild).toggleClass('fa-square-o').toggleClass('fa-check-square');
        $(element).next('span').toggleClass('todo-completed');
    }

    function editProject() {
        $('#tab-1').removeClass('active');
        $('#chat-tab').removeClass('active');
        $('#tab-2').addClass('active');
        $('#project-tab').addClass('active');
        document.getElementById('add-chat-task').style.display = '';
        document.getElementById('project-list').style.display = '';
        document.getElementById('project-detail').style.display = 'none';
    }

    function addChatTask() {
        var children = document.getElementById('body-message').children;
        for (var i = 0; i < children.length; i++) {
            if ($(children[i]).hasClass('selected')) {
                var test = children[i].children[1].children[0].children[0].children;
                var splitted = test[0].innerHTML.split('. ');
                if (splitted.length > 1 && confirm('Do you want to split this message in multiple tasks ?')) {
                    for (var y = 0; y < splitted.length; y++) {
                        if (splitted[y] != '') {
                            var message = "<li id=\"task-creation\" class=\"edit-task\" style=\"padding-left:0;\"><input id=\"new-value\" type=\"text\" value=\"" + splitted[y] + "\" style=\"width:90%\"><button class=\"btn\" style=\"padding:0 6px\" onclick=\"confirmNewTask()\">Ok</button></li>";
                            document.getElementById('task-list').innerHTML += message;
                        }
                    }
                }
                else {
                    var message = "<li id=\"task-creation\" class=\"edit-task\" style=\"padding-left:0;\"><input id=\"new-value\" type=\"text\" value=\"" + test[0].innerHTML + "\" style=\"width:90%\"><button class=\"btn\" style=\"padding:0 6px\" onclick=\"confirmNewTask()\">Ok</button></li>";
                    document.getElementById('task-list').innerHTML += message;
                }
            }
        }
        document.getElementById('add-chat-task').style.display = 'none';
    }

    function newProject() {
        $('#tab-1').removeClass('active');
        $('#chat-tab').removeClass('active');
        $('#tab-2').addClass('active');
        $('#project-tab').addClass('active');
        document.getElementById('new-project-panel').style.display = '';
        document.getElementById('project-list').style.display = 'none';
        document.getElementById('message-search-project').style.display = 'none';
        document.getElementById('project-detail').style.display = 'none';

        var children = document.getElementById('body-message').children;
        for (var i = 0; i < children.length; i++) {
            if ($(children[i]).hasClass('selected')) {
                var test = children[i].children[1].children[0].children[0].children;
                var splitted = test[0].innerHTML.split('. ');
                var child = document.getElementById('new-project-panel').children[0].children;
                if (splitted.length > 1 && confirm('Do you want to split this message in multiple tasks ?')) {
                    for (var y = 0; y < splitted.length; y++) {
                        if (splitted[y] != '') {
                            var message = "<li class=\"edit-task\" style=\"padding-left:0;list-style:none;\">" +
                                          "<span class=\"col-xs-3\" style=\"padding-left:0;\">Pending...</span>" +
                                          "<input class=\"m-l-xs\" value=\"" + splitted[y] + "\" style=\"display:inline-block;max-width:150px;\">" +
                                          "</li>";
                            child[1].innerHTML += message;
                        }
                    }
                }
                else {
                    var message = "<li class=\"edit-task\" style=\"padding-left:0;list-style:none;\">" +
                                  "<span class=\"col-xs-3\" style=\"padding-left:0;\">Pending...</span>" +
                                  "<input class=\"m-l-xs\" value=\"" + test[0].innerHTML + "\" style=\"display:inline-block;max-width:150px;\">" +
                                  "</li>";
                    child[1].innerHTML += message;
                }
            }
        }
    }

    function createProject() {
        if (document.getElementById('new-project-name').value == '') {
            alert('Please choose a project name');
        }
        else {
            document.getElementById('new-project-panel').style.display = 'none';
            document.getElementById('project-list').style.display = '';
            document.getElementById('message-search-project').style.display = '';
            var child = document.getElementById('new-project-panel').childNodes[1].childNodes;
            var project = "<li>" +
                          "<a href=\"#\" onclick=\"openProject()\">" +
                          "<div class=\"small pull-right m-t-xs\">9 hours ago</div>" +
                          "<h4>" + document.getElementById('new-project-name').value + "</h4>" +
                          "It is a long established fact that a reader will be distracted." +
                          "<div class=\"small\">Completion with: 0%</div>" +
                          "<div class=\"progress progress-mini\">" +
                          "<div style=\"width: 0%;\" class=\"progress-bar progress-bar-warning\"></div>" +
                          "</div>" +
                          "</a>" +
                          "</li>";
            document.getElementById('project-list').innerHTML += project;
            child[3].innerHTML = '';
            document.getElementById('new-project-name').value = '';
        }
    }

    function searchProject() {
        var regex = new RegExp("" + document.getElementById('search-input-project').value, "i");
        var child = document.getElementById('project-list').children;
        for (var i = 0; i < child.length; i++) {
            var name = child[i].children[0].children[1].innerHTML;
            if (regex.test(name)) {
                child[i].style.display = '';
            }
            else {
                child[i].style.display = 'none';
            }
        }
    }

    function addChat() {
        $('#tab-5').removeClass('active');
        $('#invite-tab').removeClass('active');
        $('#tab-1').addClass('active in');
        $('#chat-tab').addClass('active');
        document.getElementById('chat-title').style.display = 'none';
        document.getElementById('chatpanel').style.display = 'none';
        document.getElementById('message-search').style.display = 'none';
        document.getElementById('job-tab').style.display = 'none';
        document.getElementById('source-tab').style.display = 'none';
        document.getElementById('invitepanel').style.display = '';
        var chat = "<li role=\"presentation\">" +
                   "<a href=\"javascript: void(0)\" class=\"extra-content-open\" onclick=\"openInviteMessage()\" style=\"padding: 14px 0 0 0;\">" +
                   "<div class=\"media\">" +
                   "<div class=\"media-left media-middle\">" +
                   "<div class=\"avatar avatar-image avatar-sm loaded\">" +
                   "<img class=\"media-object img-circle\" src=\"https://s3.amazonaws.com/uifaces/faces/twitter/murrayswift/128.jpg\" alt=\"Avatar\">" +
                   "<i class=\"avatar-status avatar-status-bottom bg-success b-brand-gray-darker\"></i>" +
                   "</div>" +
                   "</div>" +
                   "<div class=\"media-body\">" +
                   "<h5 class=\"m-t-0 m-b-0\"><span>John Smith</span></h5>" +
                   "<p class=\"small text-gray-lighter m-b-0\"><span>Graphics Designer</span></p>" +
                   "</div>" +
                   "<div class=\"media-right media-middle\">" +
                   "</div>" +
                   "</div>" +
                   "</a>" +
                   "</li>";
        document.getElementById('chat-list').innerHTML += chat;
    }

    function searchInvite() {
        var regex = new RegExp("" + document.getElementById('search-input-invite').value, "i");
        var child = document.getElementById('body-invite-search').children;
        for (var i = 0; i < child.length; i++) {
            var name = child[i].children[0].children[4].innerHTML;
            if (regex.test(name)) {
                child[i].style.display = '';
            }
            else {
                child[i].style.display = 'none';
            }
        }
    }


    /* ---------------- Cropping and Replacing images ---------------- */

    function getRoundedCanvas(sourceCanvas) {
        var canvas = document.createElement('canvas');
        var context = canvas.getContext('2d');
        var width = sourceCanvas.width;
        var height = sourceCanvas.height;

        canvas.width = width;
        canvas.height = height;
        context.beginPath();
        context.arc(width / 2, height / 2, Math.min(width, height) / 2, 0, 2 * Math.PI);
        context.strokeStyle = 'rgba(0,0,0,0)';
        context.stroke();
        context.clip();
        context.drawImage(sourceCanvas, 0, 0, width, height);

        return canvas;
    }

    function getRectangularCanvas(sourceCanvas) {
        var canvas = document.createElement('canvas');
        var context = canvas.getContext('2d');
        var width = sourceCanvas.width;
        var height = sourceCanvas.height;

        canvas.width = width;
        canvas.height = height;
        context.strokeStyle = 'rgba(0,0,0,0)';
        context.stroke();
        context.drawImage(sourceCanvas, 0, 0, width, height);

        return canvas;
    }


    $(function() {
        var $image = $('#image');
        var $button = $('#button');
        var $result = $('#result');
        var croppable = false;
        if ($('#squareCrop').hasClass('active')){
            $image.cropper({
                aspectRatio: 1,
                viewMode: 1,
                ready: function () {
                   croppable = true;
                }
            });
        } else {
            $image.cropper({
                aspectRatio: 0,
                viewMode: 1,
                ready: function () {
                   croppable = true;
                }
            });
        }

        $('#squareCrop').click(function(){
            $('#squareCrop').addClass('active');
            $('#customCrop').removeClass('active');
            $image.cropper('destroy');
            if ($('#squareCrop').hasClass('active')){
                $image.cropper({
                    aspectRatio: 1,
                    viewMode: 1,
                    ready: function () {
                       croppable = true;
                    }
                });
            } else {
                $image.cropper({
                    aspectRatio: 0,
                    viewMode: 1,
                    ready: function () {
                       croppable = true;
                    }
                });
            }
            if (!$('#roundCrop').hasClass('active') && $('#rectCrop').hasClass('active')) {
                $('.cropper-view-box').css('border-radius', '0%');
                $('.cropper-face').css('border-radius', '0%');
            } else if ($('#roundCrop').hasClass('active') && !$('#rectCrop').hasClass('active')) {
                $('.cropper-view-box').css('border-radius', '50%');
                $('.cropper-face').css('border-radius', '50%');
            }
        });

        $('#customCrop').click(function(){
            $('#customCrop').addClass('active');
            $('#squareCrop').removeClass('active');
            $image.cropper('destroy');
            if ($('#squareCrop').hasClass('active')){
                $image.cropper({
                    aspectRatio: 1,
                    viewMode: 1,
                    ready: function () {
                       croppable = true;
                    }
                });
            } else {
                $image.cropper({
                    aspectRatio: 0,
                    viewMode: 1,
                    ready: function () {
                       croppable = true;
                    }
                });
            }
            $('#rectCrop').addClass('active');
            $('#roundCrop').removeClass('active');
            $('#typeCrop').text('Cropping: Rectangle');
            $('.cropper-view-box').css('border-radius', '0%');
            $('.cropper-face').css('border-radius', '0%');
        });

        $(document).ready(function(){
            $('#roundCrop').click(function(){
                if (!$('#roundCrop').hasClass('active') && $('#rectCrop').hasClass('active')){
                    $('#roundCrop').addClass('active');
                    $('#rectCrop').removeClass('active');
                    $('#typeCrop').text('Cropping: Circle');
                    $('#squareCrop').addClass('active');
                    $('#customCrop').removeClass('active');
                    $image.cropper('destroy');
                    $image.cropper({
                        aspectRatio: 1,
                        viewMode: 1,
                        ready: function () {
                           croppable = true;
                        }
                    });
                    setTimeout(function(){
                        $('.cropper-view-box').css('border-radius', '50%');
                        $('.cropper-face').css('border-radius', '50%');
                    }, 0);
                }

            });
            $('#rectCrop').click(function(){
                if ($('#roundCrop').hasClass('active') && !$('#rectCrop').hasClass('active')){
                    $('#rectCrop').addClass('active');
                    $('#roundCrop').removeClass('active');
                    $('#typeCrop').text('Cropping: Rectangle');
                    $('.cropper-view-box').css('border-radius', '0%');
                    $('.cropper-face').css('border-radius', '0%');
                }
            });
            $('#imageCrop').popup('hide');

        });

        $button.on('click', function () {
            var croppedCanvas;
            var roundedCanvas;

            if (!croppable) {
              return;
            }

            if ($('#image').attr('src') == "../../static/cropper-master/dist/imageCrop.png") {
                swal("Please upload the image your need to crop");
            } else {
                // Crop
                croppedCanvas = $image.cropper('getCroppedCanvas');

                // Round
                if (!$('#roundCrop').hasClass('active') && $('#rectCrop').hasClass('active')){
                    roundedCanvas = getRectangularCanvas(croppedCanvas);
                }
                else if ($('#roundCrop').hasClass('active') && !$('#rectCrop').hasClass('active')){
                    roundedCanvas = getRoundedCanvas(croppedCanvas);
                }

                // Show
                $result.html('<img id="outputCrop" class="w3-display-middle" src="' + roundedCanvas.toDataURL() + '">');
                $('img#outputCrop').css('max-height', 190);
                $('img#outputCrop').css('max-width', 178);

                if ($('#uncroppedImage').attr('src') != $('#image').attr('src')) {
                    $('#cropImageContent').find('.cell').remove();
                }

                $('#uncroppedImage').remove();
                var img = $('<img id="uncroppedImage">');
                img.attr('src', $('#image').attr('src'));
                img.appendTo('#uncroppedImageContent');
                document.getElementById('uncroppedImage').style.width = '100%';

                $('#upload-submit-visibility').css('visibility', 'hidden');
                $('#confirm-cancel').css('visibility', 'visible');
            }
        });

    });

    var i=0;
    function confirmCropFunction() {
        i++;
        var div = $('<div class=\"cell inline ex' + i + '\" id=\"cropDIV' + i + '\" style=\"display: inline;width:25%;height:50%;margin-right:1%\"></div>');
        var img = $('<img id=\"crop' + i + '\">');
        var button = $(
            '<div style="z-index: 10; left: 90px; top: -60px; transform: translate(-50%,-50%); position: relative;">' +
                '<i id=\"replace' + i + '\" class="fa fa-check-circle" onclick="replaceCrop(event)" style="font-size:235%; z-index: 50;"></i>' +
                '<i id=\"delete' + i + '\" class="fa fa-times-circle delConfirm_open" onclick= "deleteCrop(event)" style="font-size:235%; z-index: 50;left: 60%;"></i>' +
            '</div>'
        );
        img.attr('src', $('#outputCrop').attr('src'));
        div.appendTo('#cropImageContent');
        img.appendTo('#cropDIV' + i);
        button.appendTo('#cropDIV' + i);
        document.getElementById('crop'+i).style.width = '100%';
        document.getElementById('crop'+i).style.marginRight = '1%';
        document.getElementById('crop'+i).style.marginBottom = '2%';
        $('#outputCrop').remove();
        $('#upload-submit-visibility').css('visibility', 'visible');
        $('#confirm-cancel').css('visibility', 'hidden');

        if ($('#uncroppedImage').attr('src') != $('#image').attr('src')) {
            i=0;
        }
    }

    function cancelCropFunction() {
        $('#outputCrop').remove();
        $('#upload-submit-visibility').css('visibility', 'visible');
        $('#confirm-cancel').css('visibility', 'hidden');
    }

    function imgSubmit() {
        $('#uploadCrop').change(function(){
            swal({
                title: "",
                text: "You image is uploaded successfully.",
                type: "success",
                showCancelButton: false,
                confirmButtonClass: "btn-danger",
                confirmButtonText: "OK",
                cancelButtonText: "Cancel",
                closeOnConfirm: true,
                closeOnCancel: true
            },
            function(isConfirm) {
                if (isConfirm) {
                    $('#image').cropper('destroy');
                    $('#image').cropper({
                        aspectRatio: 0,
                        viewMode: 1,
                        ready: function () {
                           croppable = true;
                        }
                    });
                }
            });
        });
    }

    function deleteCrop(event) {
        var ID;
        ID = event.target.id;
        swal({
            title: "Are you sure?",
            text: "You want to delete this cropped image?",
            type: "warning",
            showCancelButton: true,
            confirmButtonClass: "btn-danger",
            confirmButtonText: "Delete",
            cancelButtonText: "Cancel",
            closeOnConfirm: true,
            closeOnCancel: true
        },
        function(isConfirm) {
            if (isConfirm) {
                $('#' + ID).parents('.cell').remove();
            }
        });
        $('.sweet-alert').css('z-index', 100001);
    }

    function replaceCrop(event) {
        var ID;
        ID = event.target.id;
        swal({
            title: "Are you sure?",
            text: "You want to replace with this cropped image?",
            type: "warning",
            showCancelButton: true,
            confirmButtonClass: "btn-danger",
            confirmButtonText: "Replace",
            cancelButtonText: "Cancel",
            closeOnConfirm: true,
            closeOnCancel: true
        },
        function(isConfirm) {
            if (isConfirm) {
                if ($('.' + replaceClassName).is('img')) {
                    $('.' + replaceClassName).attr('src', $('#' + ID).parents('.cell').children('img').attr('src'));
//                    $('.cell').remove();
//                    $('#uncroppedImage').remove();
//                    $('#image').attr('src', "../../static/cropper-master/dist/imageCrop.png");
                    $('#imageCrop').popup('hide');
//                    $('#image').cropper('destroy');
//                    $('#image').cropper({
//                        aspectRatio: 0,
//                        viewMode: 1,
//                        ready: function () {
//                           croppable = true;
//                        }
//                    });
                }
            }
        });
    }

    var replaceClassName;
    function getSelectedElement(selectedElement) {
        replaceClassName = selectedElement.className;
    }



    /* ---------------- End ---------------- */










