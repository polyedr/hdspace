const dialLines = document.getElementsByClassName('diallines');
const clockEl = document.getElementsByClassName('clock')[0];

for (let i = 1; i < 60; i++) {
  clockEl.innerHTML += "<div class='diallines'></div>";
  dialLines[i].style.transform = 'rotate(' + 6 * i + 'deg)';
}

function clock() {
  const d = new Date(),
    h = d.getHours(),
    m = d.getMinutes(),
    s = d.getSeconds(),
    hDeg = h * 30 + m * (360 / 720),
    mDeg = m * 6 + s * (360 / 3600),
    sDeg = s * 6,
    hEl = document.querySelector('.hour-hand'),
    mEl = document.querySelector('.minute-hand'),
    sEl = document.querySelector('.second-hand');

  hEl.style.transform = 'rotate(' + hDeg + 'deg)';
  mEl.style.transform = 'rotate(' + mDeg + 'deg)';
  sEl.style.transform = 'rotate(' + sDeg + 'deg)';
}

setInterval('clock()', 100);
