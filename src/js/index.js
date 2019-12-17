
const INIT_LOCATION = [14.07, 100.6065]
var map = L.map('mapid',
                  { zoomControl: false,
                     dragging: false,
                     scrollWheelZoom: false,
                     touchZoom: false
                  })
map.setView(INIT_LOCATION, 16);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

L.marker(INIT_LOCATION).addTo(map)
    .bindPopup('A pretty CSS3 popup.<br> Easily customizable.')
    .openPopup();

map.zoomControl.disable()