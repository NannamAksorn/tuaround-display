/* eslint-disable no-extend-native */
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import {ngvListener, iconAddListener, forwardArrivalListener, backwardArrivalListener  } from './socket';
import 'leaflet-polylineoffset';
import routeData from './route-data';
import iconFactory from './iconFactory'

// right
// const INIT_LOCATION = [14.0717, 100.60855];
// left
// const INIT_LOCATION = [14.0717, 100.60205];
// full
const INIT_LOCATION = [14.07198, 100.60256];

const map = L.map('mapid',
  {
    zoomControl: false,
    // dragging: false,
    // scrollWheelZoom: false,
    touchZoom: false,
    zoomSnap: 0.01,
  });
// map.setView(INIT_LOCATION, 16.4);
map.setView(INIT_LOCATION, 16.45);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
}).addTo(map);

// model overlay
const bottomLeft = [14.0799, 100.59287];
const topRight = [14.0649, 100.61767];

let imageUrl = '/public/tu-model/tu-model-0040.jpg';
const imageBounds = [bottomLeft, topRight];
const imageOverlay = L.imageOverlay(imageUrl, imageBounds, {
  zIndex: 5,
  opacity:.8,
  className: 'myoverlay',
});
imageOverlay.addTo(map);
imageOverlay.bringToFront();


Number.prototype.pad = function pad(size) {
  let s = String(this);
  while (s.length < (size || 2)) { s = `0${s}`; }
  return s;
};

// let value = 0;
// setInterval(function(){
//     value = value + 1;
//     if (value > 240) {
//         value = 1;
//     }
//     imageUrl = `/public/tu-model/tu-model-${Number(value).pad(4)}.jpg`;
//     imageOverlay.setUrl(imageUrl);
// } , 100);

const timeControllerText = document.getElementById('timeControllerText');
document.getElementById('timeControllerRange').oninput = function rangeHandler(e) {
  const { value } = e.target;
  const hr = (Math.round(value / 10) + 12) % 24;
  const minute = (value % 10) * 6;
  timeControllerText.textContent = `${Number(hr).pad(2)}:${Number(minute).pad(2)}`;
  // update Image
  imageUrl = `/public/tu-model/tu-model-${Number(value).pad(4)}.jpg`;
  imageOverlay.setUrl(imageUrl);
};

// route layer
const lineWeight = 6;
const outlines = L.layerGroup();
const lineBg = L.layerGroup();
const busLines = L.layerGroup();

routeData.forEach((route) => {
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
    opacity: 0.9,
    className: `route-${route.name}`,
    weight: lineWeight,
    color: route.color,
  }).addTo(busLines);
});
// outlines.addTo(map);
// lineBg.addTo(map);
// busLines.addTo(map);


// ==============================================================================================gps marker layer
const createIcon = (carno, direction, route=3) => {
  // const route = carno.match(/\((.*?)\)/)[1];
  // const no = carno.substr(5, 2);
  const no = carno
  const carHtml = `
  <div id="car-${carno}" class="d-flex flex-column align-items-center">
    <div id="arrow-${carno}" class="arrow-up arrow-${route}" style='transform:rotate(${direction}deg);'></div>
    <div class="car-icon car-icon-${route}">${no}</div>
  </div>`;
  const myIcon = L.divIcon({
    className: 'car-icon-container',
    html: carHtml,
    iconSize: L.point(20, 20),
  });
  return myIcon;
};

const cars = {};
ngvListener((data) => {
  data = JSON.parse(data)
  for(let cid in data) {
    let car = data[cid]
    console.log(car)
    if (!(car.i in cars)) {
      cars[car.i] = {};
      const marker = L.marker([car.a, car.o], { icon: createIcon(car.i, car.d, car.r) });
      marker.addTo(map);
      cars[car.i].marker = marker;

    } else {
      cars[car.i].marker.setLatLng([car.a, car.o]);
      const arrowEl = document.getElementById(`arrow-${car.i}`)
      arrowEl.style.transform = `rotate(${car.d}deg)`
    }
  }
  // if (!(data.carno in cars)) {
  //   cars[data.carno] = {};
  //   // let marker = L.marker([data.lat, data.lon])
  //   console.log(data)
  //   const marker = L.marker([data.lat, data.lon], { icon: createIcon(data.carno, data.direction) });
  //   marker.addTo(map);
  //   cars[data.carno].marker = marker;

  // } else {
  //   cars[data.carno].marker.setLatLng([data.lat, data.lon]);
  //   const arrowEl = document.getElementById(`arrow-${data.carno}`)
  //   arrowEl.style.transform = `rotate(${data.direction}deg)`
  // }
});
// ======================================================================     Prediction
forwardArrivalListener((data) => {
  // data = JSON.parse(data)
  const fpEL= document.getElementById('forwardPrediction')
  fpEL.innerText = data
});

backwardArrivalListener((data) => {
  // data = JSON.parse(data)
  const bwEL= document.getElementById('backwardPrediction')
  bwEL.innerText = data
});



// stop marker layer
// let stopMarker = L.marker([14.06601, 100.60054])
// stopMarker.addTo(map)
// __________________________________________________________________________________STOP_LAYER___________
let stopUrl = '/public/stop/stops.png';
const stopOverlay = L.imageOverlay(stopUrl, imageBounds, {
  zIndex: 5,
  // className: 'myoverlay',
});
stopOverlay.addTo(map);
stopOverlay.bringToFront();


// __________________________________________________________________________________STATION
let stationUrl = '/public/station/green.png';
const stationOverlay = L.imageOverlay(stationUrl, imageBounds, {
  zIndex: 5,
  // className: 'myoverlay',
});
stationOverlay.addTo(map);
stationOverlay.bringToFront();

// __________________________________________________________________________________etc
// let myIconHtml = `
// <div id="i1"></div>`;
// let myIcon = L.divIcon({
//   className: 'car-icon-container',
//   html: myIconHtml,
//   iconSize: L.point(50, 50),
// });
// let marker = L.marker([14.07338, 100.60114], { icon: myIcon });
// marker.addTo(map)

// lottie.loadAnimation({
//     container: document.getElementById(`i1`),
//     renderer: 'svg',
//     loop: true,
//     autoplay: true,
//     path: `public/etc/food.json`,
//     rendererSetting: {
//       clearCanvas: true35
//     }
// })

let myIcon = new iconFactory('lottie', {
  id:1, lat:14.0736, lon:100.60114, width:25, height:25, src:"@food.json"
})
// myIcon.marker.addTo(map)
// myIcon.render()

// myIcon = new iconFactory('text', {
//   id:1, lat:14.0735, lon:100.60114, width:100, height:25, text:"Green"
// })
// myIcon.marker.addTo(map)

// myIcon = new iconFactory('image', {
//   id:1, lat:14.07335, lon:100.60114, width:20, height:20, src:"@spoon_fork.svg"
// })
// myIcon.marker.addTo(map)
let myIconList = {}
iconAddListener(({type, props}) => {
  myIcon = new iconFactory(type, props)
  myIcon.marker.addTo(map)
  if (type === "lottie")
    myIcon.render()
  myIconList[props.id] = myIcon.marker
})