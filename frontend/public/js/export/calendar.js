const calendarComponents = document.getElementsByClassName('calendar-widget');
for (var i = 0; i < calendarComponents.length; i++) {
  var calendar = calendarComponents.item(i);
  var uniqueClassName;
  for (var j = 0; j < calendar.classList.length; j++) {
    const className = calendar.classList.item(j);
    if (className.startsWith('widget-')) {
      uniqueClassName = className;
      break;
    }
  }
  if (uniqueClassName) {
    new Calendar({
      id: '.' + uniqueClassName,
      theme: 'basic',
      calendarSize: 'small',
      fontFamilyHeader: window.getComputedStyle(calendar.parentElement, null)
        .fontFamily,
    });
  }
}
