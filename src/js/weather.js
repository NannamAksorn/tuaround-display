import lottie from 'lottie-web'

const weatherIcon = document.getElementById('MyWeatherIcon')
const weatherTempEl = document.getElementById('MyWeatherTemp')
const weatherPrecipEl = document.getElementById('MyWeatherPrecip')

let lottieWeatherIcon = lottie.loadAnimation({
    container: weatherIcon,
    renderer: 'svg',
    loop: true,
    autoplay: true,
    path: `public/weather/clear-day.json`,
    rendererSetting: {
      clearCanvas: true
    }
  })

async function fetchWeather() {
  const res = await fetch('/api/weather')
  const data = await res.json()
  weatherTempEl.innerText = data.currently.apparentTemperature.toFixed(0) + '°C'
  weatherPrecipEl.innerText = (data.currently.precipProbability*100).toFixed(0) + '%'
  lottieWeatherIcon.destroy()
  lottieWeatherIcon = lottie.loadAnimation({
    container: weatherIcon,
    renderer: 'svg',
    loop: true,
    autoplay: true,
    path: `public/weather/${data.currently.icon}.json`,
    rendererSetting: {
      clearCanvas: true
    }
  })
}


fetchWeather()
setInterval(fetchWeather , 1000 * 60 * 60)
