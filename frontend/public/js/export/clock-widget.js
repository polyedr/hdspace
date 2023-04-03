function Clock(element) {
  var uniqueClassName;
  for (var i = 0; i < element.classList.length; i++) {
    var className = element.classList.item(i);
    if (className.startsWith('widget-')) {
      uniqueClassName = className;
      break;
    }
  }

  setInterval(function () {
    var date = new Date();
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var seconds = date.getSeconds();
    var hDeg = hours * 30 + minutes * (360 / 720);
    var mDeg = minutes * 6 + seconds * (360 / 3600);
    var sDeg = seconds * 6;
    var hEl = document.querySelector('.' + uniqueClassName + ' .hour-hand');
    var mEl = document.querySelector('.' + uniqueClassName + ' .minute-hand');
    var sEl = document.querySelector('.' + uniqueClassName + ' .second-hand');
    hEl.style.transform = 'rotate(' + hDeg + 'deg)';
    mEl.style.transform = 'rotate(' + mDeg + 'deg)';
    sEl.style.transform = 'rotate(' + sDeg + 'deg)';
  }, 100);
}
