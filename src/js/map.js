import "leaflet/dist/leaflet.css"
import L from 'leaflet';
import ngvListener from "./socket"
import "leaflet-polylineoffset"
import routeData from './route-data'

const INIT_LOCATION = [14.07, 100.6065]
var map = L.map('mapid',
                  { 
                     zoomControl: false,
                     dragging: false,
                     scrollWheelZoom: false,
                     touchZoom: false
                  })
map.setView(INIT_LOCATION, 16);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// route layer
var lineWeight = 6;
var outlines = L.layerGroup();
var lineBg = L.layerGroup();
var busLines = L.layerGroup();
routeData.forEach(function(route){
    // outline
    L.polyline(route.shape, {
        // offset: route.offset,
        className: `route-${route.name}`,
        weight: lineWeight + 6,
        color: "#333",
    }).addTo(outlines)
    // line bg
    L.polyline(route.shape, {
        // offset: route.offset,
        className: `route-${route.name}`,
        weight: lineWeight + 4,
        color: "#ddd",
    }).addTo(lineBg)
    // bus route
    L.polyline(route.shape, {
        // offset: route.offset,
        className: `route-${route.name}`,
        weight: lineWeight,
        color: route.color,
    }).addTo(busLines)
})
outlines.addTo(map)
lineBg.addTo(map)
busLines.addTo(map)



// gps marker layer
const createIcon = (carno) => {
    const route = carno.match(/\((.*?)\)/)[1]
    const no = carno.substr(5,2)
    const carHtml = `<div class="car-icon car-icon-${route}">${no}</span>`
    const myIcon = L.divIcon({className:"car-icon-container",
                              html: carHtml,
                              iconSize: L.point(20,20)
                            })
    return myIcon
}

let cars = {}
ngvListener(function (data) {
    console.log(data)
    if (!(data.carno in cars)){
        cars[data.carno] = {}
        // let marker = L.marker([data.lat, data.lon])
        let marker = L.marker([data.lat, data.lon], {icon: createIcon(data.carno)})
        marker.addTo(map)
        cars[data.carno].marker = marker
    } else {
        cars[data.carno].marker.setLatLng([data.lat, data.lon])
    }
})


