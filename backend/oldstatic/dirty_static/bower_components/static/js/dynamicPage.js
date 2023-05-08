/**
 * Created by Santiago on 27/7/17.
 */
$(document).ready(function () {

    interact(".resize-drag").draggable({
        onmove: window.dragMoveListener
    })

        .resizable({
            preserveAspectRatio: true, edges: {
                left: true, right: true, bottom: true, top: true
            }
        })
        .on("resizemove", function (event) {
            var target = event.target, x = (parseFloat(target.getAttribute(data - x)) || 0),
                y = (parseFloat(target.getAttribute(data - y)) || 0);
            target.style.width = event.rect.width + "px";
            target.style.height = event.rect.height + "px";
            x += event.deltaRect.left;
            y += event.deltaRect.top;
            target.style.webkitTransform = target.style.transform = "translate(" + x + "px," + y + "px)";
            target.setAttribute("data-x", x);
            target.setAttribute("data-y", y);
        });

    interact(".draggable").draggable({
        inertia: true, autoScroll: true, onmove: dragMoveListener, onend: function (event) {
            var textEl = event.target.querySelector("p");
            textEl && (textEl.textContent = "moved a distance of " +
                (Math.sqrt(event.dx * event.dx + event.dy * event.dy) | 0) + "px");
        }
    });
    function dragMoveListener(event) {
        var target = event.target,
            x = (parseFloat(target.getAttribute("data-x")) || 0) + event.dx,
            y = (parseFloat(target.getAttribute("data-y")) || 0) + event.dy;
        target.style.webkitTransform = target.style.transform = "translate(" + x + "px, " + y + "px)";
        target.setAttribute("data-x", x);
        target.setAttribute("data-y", y);
    }

    function myFunction2() {
        var ctionaa = prompt("Please enter an action: \n 1 - fontSize \n 2 - new text", "");

        if (ctionaa != null) {
            if (ctionaa == "1") {
                var miercoles = prompt("Please enter a fontSize", "");
                fmiercoles = miercoles + "px"
                if (miercoles != null) {
                    document.getElementById("myP").style.fontSize = miercoles;
                }
            }

            if (ctionaa != null) {
                if (ctionaa == "2") {
                    var miercoles = prompt("Please enter the new Text", "");
                    if (miercoles != null) {

                        if (miercoles == " 5 ") {
                            document.getElementById("myP").innerHTML = "Ouloulou Adevo from Harmohit is rocking it";
                        }
                        if (miercoles != " 5 ") {
                            document.getElementById("myP").innerHTML = miercoles;
                        }
                    }


                }


            }
        }
    }
});