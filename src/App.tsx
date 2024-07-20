import { useEffect, useState } from 'react';
import Grid from '@mui/material/Unstable_Grid2';
import Indicator from './components/Indicator';
import Summary from './components/Summary';
import BasicTable from './components/BasicTable';
import ControlPanel from './components/ControlPanel';
import WeatherChart from './components/WeatherChart';
import Weather from './components/Weather';
import { WeatherData } from './interfaces/weatherData';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './App.css';
import { faCalendarAlt, faClock, faEarth, faLocationDot, faMapPin, faTemperatureHigh, faTemperatureLow } from '@fortawesome/free-solid-svg-icons';
interface RowData {
	rangeHours: string;
	windDirection: string;
}

function App() {
	const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
	const [rowsTable, setRowsTable] = useState<RowData[]>([]);
	const [indicators, setIndicators] = useState<JSX.Element[]>([]);
	const [summary, setSumary] = useState<JSX.Element[]>([]);
	const [chartData, setChartData] = useState<any[]>([
		["Hora", "Precipitación", "Humedad", "Nubosidad"]
	]);

	const handleWeatherChange = (data: WeatherData) => {
		setWeatherData(data);
	};

	const [selectedVariable, setSelectedVariable] = useState<string>("Todas las Variables");

	const handleVariableChange = (variable: string) => {
		setSelectedVariable(variable);
	};

	useEffect(() => {
		(async () => {
			let savedTextXML = localStorage.getItem("openWeatherMap");
			let expiringTime = localStorage.getItem("expiringTime");
			let nowTime = (new Date()).getTime();

			if (expiringTime === null || nowTime > parseInt(expiringTime)) {
				let API_KEY = "590e3a9acf390c64ba2bee56065a0366";
				let response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=Guayaquil&mode=xml&appid=${API_KEY}`);
				savedTextXML = await response.text();
				let hours = 1;
				let delay = hours * 3600000;
				localStorage.setItem("openWeatherMap", savedTextXML);
				localStorage.setItem("expiringTime", (nowTime + delay).toString());
			}

			const parser = new DOMParser();
			const xml = parser.parseFromString(savedTextXML || '', 'application/xml');

			let dataToIndicators = new Array();
			let dataToSummary = new Array();

			let location = xml.getElementsByTagName('location')[1];
			let geobaseid = location.getAttribute('geobaseid');
			let latitude = location.getAttribute('latitude');
			let longitude = location.getAttribute('longitude');
			let cityName = xml.getElementsByTagName('name')[0].textContent;

			let timeZone = xml.getElementsByTagName('timezone')[0]?.textContent;
			let timeZoneOffset = parseInt(timeZone ?? '0') / 3600;
			let timeZoneGTM = `GTM${timeZoneOffset >= 0 ? '+' : '-'}${Math.abs(timeZoneOffset)}`;

			let sunriseTime = xml.getElementsByTagName('sun')[0].getAttribute('rise')?.split("T")[1].split("+")[0];
			if (sunriseTime) {
				let sunriseDate = new Date(`1970-01-01T${sunriseTime}Z`);
				sunriseDate.setHours(sunriseDate.getHours() - 5);
				sunriseTime = sunriseDate.toISOString().split("T")[1].split(".")[0] + " A.M";
			}

			let tempMin = xml.getElementsByTagName("temperature")[0].getAttribute("min");
			let tempMax = xml.getElementsByTagName("temperature")[0].getAttribute("max");
			let date = xml.getElementsByTagName("time")[0].getAttribute("from");

			if (tempMax !== null) {
				tempMax = (parseFloat(tempMax) - 273.15).toFixed(2);
			} else {
				tempMax = "N/A";
			}

			if (tempMin !== null) {
				tempMin = (parseFloat(tempMin) - 273.15).toFixed(2);
			} else {
				tempMin = "N/A";
			}

			let iconoUbicacion = <FontAwesomeIcon icon={faLocationDot} color='red' size='3x' />;
			let iconoFecha = <FontAwesomeIcon icon={faCalendarAlt} color='#CB12F4' size='3x' />;
			let iconoLatitud = <FontAwesomeIcon icon={faMapPin} color='#15E55A' size='3x' />;
			let iconoLongitud = <FontAwesomeIcon icon={faMapPin} color='#BBBE09' size='3x' />;
			let iconoPlaneta = <FontAwesomeIcon icon={faEarth} color='green' size='3x' />;
			let iconoTempMax = <FontAwesomeIcon icon={faTemperatureHigh} color='red' size='3x' />;
			let iconoTempMin = <FontAwesomeIcon icon={faTemperatureLow} color='#0B61A2' size='3x' />;
			let iconoReloj = <FontAwesomeIcon icon={faClock} color='#0B61A2' size='3x' />;

			dataToIndicators.push([iconoUbicacion, 'Ciudad', cityName]);
			dataToIndicators.push([iconoPlaneta, 'geobaseid', geobaseid]);
			dataToIndicators.push([iconoLatitud, 'Latitud', latitude]);
			dataToIndicators.push([iconoLongitud, 'Longitud', longitude]);
			dataToIndicators.push([iconoTempMax, 'Temperatura Máxima', tempMax + "°C"]);
			dataToIndicators.push([iconoTempMin, 'Temperatura Mínima', tempMin + "°C"]);
			dataToIndicators.push([iconoFecha, 'Fecha', date?.split("T")[0]]);
			dataToIndicators.push([iconoReloj, 'Zona Horaria', timeZoneGTM]);

			dataToSummary.push([sunriseTime]);

			let indicatorsElements = Array.from(dataToIndicators).map((element) => (
				<Indicator title={element[0]} subtitle={element[1]} value={element[2]} />
			));

			let summaryElements = Array.from(dataToSummary).map((element) => (
				<Summary datos={element[0]} />
			));

			setIndicators(indicatorsElements);
			setSumary(summaryElements);

			let arrayObjects = Array.from(xml.getElementsByTagName("time")).map((timeElement) => {
				let rangeHours = (timeElement.getAttribute("from")?.split("T") ?? "") + " - " + (timeElement.getAttribute("to")?.split("T") ?? "");
				let windDirection = timeElement.getElementsByTagName("windDirection")[0].getAttribute("deg") + " " + timeElement.getElementsByTagName("windDirection")[0].getAttribute("code");
				let windSpeed = timeElement.getElementsByTagName("windSpeed")[0].getAttribute("mps") + " " + timeElement.getElementsByTagName("windSpeed")[0].getAttribute("unit");
				let temperatureClima = (parseFloat(timeElement.getElementsByTagName("temperature")[0].getAttribute("value") ?? '') - 273.15).toFixed(2) + "°C";



				return {
					rangeHours,
					windDirection,
					windSpeed,
					temperatureClima
				};
			});

			arrayObjects = arrayObjects.slice(0, 15);

			//agregado 
			let arrayObjects2 = Array.from(xml.getElementsByTagName("time")).map((timeElement) => {
				let rangeHours2 = (timeElement.getAttribute("from")?.split("T") ?? "") + " - " + (timeElement.getAttribute("to")?.split("T") ?? "");
				let precipitation = parseFloat(timeElement.getElementsByTagName("precipitation")[0]?.getAttribute("value") || "0");
				let humidity = parseFloat(timeElement.getElementsByTagName("humidity")[0]?.getAttribute("value") || "0");
				let cloudiness = parseFloat(timeElement.getElementsByTagName("clouds")[0]?.getAttribute("all") || "0");
				return {
					rangeHours2,
					precipitation,
					humidity,
					cloudiness,
				};

			});

			arrayObjects2 = arrayObjects2.slice(0, 20)


			//agregado y modificado
			// Actualizar rowsTable con los datos procesados
			setRowsTable(arrayObjects.map(obj => ({
				rangeHours: obj.rangeHours,
				windDirection: obj.windDirection,
				windSpeed: obj.windSpeed,
				weeklyTemperature: obj.temperatureClima
			})));

			// Actualizar chartData con los datos procesados
			const chartDataArray = [
				["Hora", "Precipitación", "Humedad", "Nubosidad"],
				...arrayObjects2.map(obj => [obj.rangeHours2, obj.precipitation, obj.humidity, obj.cloudiness])
			];

			setChartData(chartDataArray);
		})();
	}, []);

	return (
		<Grid container spacing={2}>
			<Grid xs={12} sm={12} md={12} lg={12}>
				<h1>Reporte del Tiempo</h1>
			</Grid>
			<Grid xs={12} sm={6} md={3} lg={3}>
				{indicators[0]}
			</Grid>
			<Grid xs={12} sm={6} md={3} lg={3}>
				{indicators[1]}
			</Grid>
			<Grid xs={12} sm={4} md={3} lg={3}>
				{indicators[7]}
			</Grid>
			<Grid xs={12} sm={4} md={3} lg={3}>
				{indicators[6]}
			</Grid>
			<Grid xs={12} sm={4} md={3} lg={6}>
				{indicators[2]}
			</Grid>
			<Grid xs={12} sm={4} md={3} lg={6}>
				{indicators[3]}
			</Grid>
			<Grid xs={12} sm={4} md={3} lg={4}>
				{indicators[4]}
			</Grid>
			<Grid xs={12} sm={4} md={3} lg={4}>
				{indicators[5]}
			</Grid>
			<Grid xs={12} sm={12} md={3} lg={4}>
				{summary[0]}
			</Grid>
      <Grid xs={12} sm={12} md={3} lg={4}>
				{summary[0]}
			</Grid>
      <Grid xs={12} sm={12} md={3} lg={4}>
				{summary[0]}
			</Grid>
      <Grid xs={12} sm={12} md={3} lg={4}>
				{summary[0]}
			</Grid>
			<Grid xs={12} sm={12} md={12} lg={12}>
				<h1>Reporte Semanal</h1>
			</Grid>
			<Grid xs={12} sm={12} md={3} lg={12}>
				<BasicTable rows={rowsTable} />
			</Grid>
			<Grid xs={12} sm={12} md={3} lg={12}>
				<Grid xs={8} lg={2}>
					<ControlPanel onVariableChange={handleVariableChange} />
					<WeatherChart data={chartData} selectedVariable={selectedVariable} />
				</Grid>
			</Grid>
			<Grid xs={12} sm={12} md={12} lg={12}>
				<h1>Indicadores del tiempo en otras ciudades</h1>
				<Weather onWeatherChange={handleWeatherChange} />
			</Grid>
			<Grid xs={12} sm={6} md={3} lg={6}>
				<Indicator title="Temperatura Máx." subtitle="Grados Centrigrados" value={weatherData?.main.temp_max ?? 0} />
			</Grid>
			<Grid xs={12} sm={6} md={3} lg={6}>
				<Indicator title="Temperatura Mín." subtitle="Grados Centigrados" value={weatherData?.main.temp_min ?? 0} />
			</Grid>
			<Grid xs={12} sm={6} md={3} lg={6}>
				<Indicator title="Velocidad del viento" subtitle="m/s" value={weatherData?.wind.speed ?? 0} />
			</Grid>
			<Grid xs={12} sm={6} md={3} lg={6}>
				<Indicator title="Presión Atmosférica" subtitle="hPa" value={weatherData?.main.pressure ?? 0} />
			</Grid>
		</Grid>
	);
}

export default App;
