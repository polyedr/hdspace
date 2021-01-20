var clockComponents = document.getElementsByClassName('clock-widget');
for (var i = 0; i < clockComponents.length; i++) {
  var component = clockComponents.item(i);
  new Clock(component);
}
