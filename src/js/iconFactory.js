import L from 'leaflet';
import lottie from 'lottie-web'

export default function IconFactory(type, props){
    if (type === "lottie")
      return new LottieFactory(props)
    else if (type === "text")
      return new TextFactory(props)
    else if (type === "image")
      return new ImageFactory(props)
}
// Lottie Factory
class LottieFactory {
  constructor(props){
    this.id = props.id
    this.lat = props.lat
    this.lon = props.lon
    this.width = props.width
    this.height = props.height
    this.src = props.src

    const myIconHtml = `
    <div id="ic${this.id}"></div>`;
    this.myIcon = L.divIcon({
      className: 'car-icon-container',
      html: myIconHtml,
      iconSize: L.point(this.width, this.height),
    });
    this.marker = L.marker([this.lat, this.lon], { icon: this.myIcon });
  }

  render(){
    lottie.loadAnimation({
        container: document.getElementById(`ic${this.id}`),
        renderer: 'svg',
        loop: true,
        autoplay: true,
        path: this.src.replace("@", 'public/etc/'),
        rendererSetting: {
          clearCanvas: true
        }
    })
  }
}

// Text Factory
class TextFactory {
  constructor(props){
    this.id = props.id
    this.lat = props.lat
    this.lon = props.lon
    this.width = props.width
    this.height = props.height
    this.text = props.text

    const myIconHtml = `
    <b id="ic_${this.id}">${this.text}</b>`;
    this.myIcon = L.divIcon({
      className: 'car-icon-container',
      html: myIconHtml,
      iconSize: L.point(this.width, this.height),
    });
    this.marker = L.marker([this.lat, this.lon], { icon: this.myIcon });
  }
}

// Image Factory
class ImageFactory {
  constructor(props){
    this.id = props.id
    this.lat = props.lat
    this.lon = props.lon
    this.width = props.width
    this.height = props.height
    this.src = props.src

    const myIconHtml = `
  <div id="ic_${this.id}">
    <img src="${this.src.replace('@', 'public/etc/')}" 
      width="${this.width}" height="${this.height}"
      alt="im_${this.id}" />
  </div>`;
    this.myIcon = L.divIcon({
      className: 'car-icon-container',
      html: myIconHtml,
      iconSize: L.point(this.width, this.height),
    });
    this.marker = L.marker([this.lat, this.lon], { icon: this.myIcon });
  }
}