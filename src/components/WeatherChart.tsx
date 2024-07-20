import { Chart } from "react-google-charts";
import Paper from '@mui/material/Paper';
  interface WeatherChartProps {
    data: any[];
    selectedVariable: string;
  }
  
  export default function WeatherChart({ data, selectedVariable }: WeatherChartProps) {
    // Filtra los datos basados en la variable seleccionada
    const filteredData = data.map(row => {
      if (selectedVariable === "Todas las Variables") {
        return row;
      } else {
        const index = data[0].indexOf(selectedVariable);
        return [row[0], row[index]];
      }
    });
  
    // Ajusta el título y las opciones basadas en la variable seleccionada
    const title = selectedVariable === "Todas las Variables" 
      ? "Precipitación, Humedad y Nubosidad vs Hora" 
      : `${selectedVariable} vs Hora`;
  
    const options = {
      title: title,
      curveType: "function",
      legend: { position: "right" },
    };
  
    return (
      <Paper
        sx={{
          p: 2,
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        <Chart
          chartType="LineChart"
          data={filteredData}
          width="100%"
          height="400px"
          options={options}
          legendToggle
        />
      </Paper>
    );
  }