function __googleMapsCallback() {
  const maps = document.querySelectorAll('.google-map');
  for (var i = 0; i < maps.length; i++) {
    const container = maps[i];
    const center = JSON.parse(container.getAttribute('data-center'));
    const zoom = container.getAttribute('data-zoom');
    new google.maps.Map(container.childNodes[0], {
      zoom,
      center,
    });
  }
}
