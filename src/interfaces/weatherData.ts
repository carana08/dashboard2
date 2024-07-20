export interface WeatherData {
  main: {
    temp: number;
    temp_max: number;
    temp_min: number;
    pressure: number;
  };
  wind: {
    speed: number;
  };
}