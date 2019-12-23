import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import ngvListener from './socket';
import 'leaflet-polylineoffset';
import routeData from './route-data';

const INIT_LOCATION = [14.0716, 100.6085];
var map = L.map('mapid',
                  { 
                     zoomControl: false,
                     dragging: false,
                     scrollWheelZoom: false,
                     touchZoom: false,
                     zoomSnap: 0.1
                  });
map.setView(INIT_LOCATION, 16.4);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// model overlay
const bottom_left = [14.0799, 100.59287];
const top_right = [14.0649, 100.61767];

let imageUrl = '/public/tu-model/tu-model-0150.jpg';
const imageBounds = [bottom_left, top_right];
const imageOverlay = L.imageOverlay(imageUrl, imageBounds, {
    zIndex: 5,
    className: 'myoverlay'
});
imageOverlay.addTo(map);
imageOverlay.bringToFront();

let value = 0;

Number.prototype.pad = function(size) {
    var s = String(this);
    while (s.length < (size || 2)) {s = '0' + s;}
    return s;
};

setInterval(function(){
    value = value + 1;
    if (value > 240) {
        value = 1;
    }
    imageUrl = `/public/tu-model/tu-model-${Number(value).pad(4)}.jpg`;
    imageOverlay.setUrl(imageUrl);
} , 100);

// route layer
var lineWeight = 6;
var outlines = L.layerGroup();
var lineBg = L.layerGroup();
var busLines = L.layerGroup();

routeData.forEach(function(route){
    // outline
    L.polyline(route.shape, {
        // offset: route.offset,
        // opacity: .5,
        className: `route-${route.name}`,
        weight: lineWeight + 5,
        color: '#333',
    }).addTo(outlines);
    // line bg
    L.polyline(route.shape, {
        // offset: route.offset,
        // opacity: .5,
        className: `route-${route.name}`,
        weight: lineWeight + 3,
        color: '#999',
    }).addTo(lineBg);
    // bus route
    L.polyline(route.shape, {
        // offset: route.offset,
        opacity: .9,
        className: `route-${route.name}`,
        weight: lineWeight,
        color: route.color,
    }).addTo(busLines);
});
// outlines.addTo(map);
// lineBg.addTo(map);
// busLines.addTo(map);


// gps marker layer
const createIcon = (carno) => {
    const route = carno.match(/\((.*?)\)/)[1];
    const no = carno.substr(5,2);
    const carHtml = `<div class="car-icon car-icon-${route}">${no}</span>`;
    const myIcon = L.divIcon({className:'car-icon-container',
                              html: carHtml,
                              iconSize: L.point(20,20)
                            });
    return myIcon;
};

let cars = {};
ngvListener(function (data) {
    console.log(data);
    if (!(data.carno in cars)){
        cars[data.carno] = {};
        // let marker = L.marker([data.lat, data.lon])
        let marker = L.marker([data.lat, data.lon], {icon: createIcon(data.carno)});
        marker.addTo(map);
        cars[data.carno].marker = marker;
    } else {
        cars[data.carno].marker.setLatLng([data.lat, data.lon]);
    }
});
