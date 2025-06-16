
import { useState, useEffect } from 'react';  
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
interface RowData {
  rangeHours: string;
  windDirection: string;
  windSpeed: string;
  weeklyTemperature: string;
  // Include other properties as needed
}

 interface Config {
  rows: Array<object>;
}

export default function BasicTable(data: Config) {
  let [rows, setRows] = useState<RowData[]>([]);

  useEffect(() => {
    setRows(data.rows as RowData[]);
  }, [data]);

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Rango de horas</TableCell>
            <TableCell align="right">Temperatura</TableCell>
            <TableCell align="right">Dirección del viento</TableCell>
            <TableCell align="right">Velocidad del viento</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row, index) => (
            <TableRow key={index}>
              <TableCell component="th" scope="row">
                {row.rangeHours}
              </TableCell>
              <TableCell align="right">{row.weeklyTemperature}</TableCell>
              <TableCell align="right">{row.windDirection}</TableCell>
              <TableCell align="right">{row.windSpeed}</TableCell>
              {/* Add other TableCell components as needed */}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}