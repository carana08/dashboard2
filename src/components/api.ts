import axios from 'axios';
import { WeatherData } from '../interfaces/weatherData';

const API_KEY = '590e3a9acf390c64ba2bee56065a0366';
const BASE_URL = 'https://api.openweathermap.org/data/2.5/weather';

export const fetchWeather = async (city: string) => {
  const response = await axios.get<WeatherData>(BASE_URL, {
    params: {
      q: city,
      appid: API_KEY,
      units: 'metric'
    }
  });
  return response.data;
};
//Comentario
