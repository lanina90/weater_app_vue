import {API_KEY, API_URL_5Days, API_URL_ONECALL} from "@/constans";

const PRESSURE_UNITS = 0.750062

export const capitalizedFirstLetter = (str) => {
  if (!str) return ''
  return str.charAt(0).toUpperCase() + str.slice(1)
}

export const getPressureMm = (hpa) => {
  return Math.round(hpa * PRESSURE_UNITS)
}

export const getTime = (sec, timeZone) => {
  return new Date(sec * 1000).toLocaleTimeString('uk-UA', {
    timeZone: timeZone,
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const formatDate = (timestamp) => {
  const date = new Date(timestamp * 1000);
  const day = date.getDate();
  const month = date.toLocaleString('en-En', { month: 'long' });

  return `${day} ${month}`
}

export const fetchWeatherData = async (city) => {
  const lang = localStorage.getItem('lang');
  const cityLat = city.lat ? city.lat : city.latitude
  const cityLon = city.lon ? city.lon : city.longitude
  const queryCity = `lat=${cityLat}&lon=${cityLon}&lang=${lang}`;

  const weatherData = await fetch(`${API_URL_ONECALL}?${queryCity}&exclude=daily,minutely&units=metric&appid=${API_KEY}`)
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    });

  const cityName = city.name ? city.name : city.cityName
  const cityCountry = city.countryCode ? city.countryCode : city.country
  const queryCity2 = `${cityName},${cityCountry}&lang=${lang}`;

  const forecastData = await fetch(`${API_URL_5Days}?q=${queryCity2}&units=metric&appid=${API_KEY}`)
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    });

  return { city, weatherInfo: weatherData, forecast: forecastData };
}