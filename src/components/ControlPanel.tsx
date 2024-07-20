import { useState, useRef } from 'react';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';

interface ControlPanelProps {
    onVariableChange: (variable: string) => void;
  }
  
  export default function ControlPanel({ onVariableChange }: ControlPanelProps) {
    const [selected, setSelected] = useState(0);  // Cambiamos el valor inicial a 0
  
    const descriptionRef = useRef<HTMLDivElement>(null);
  
    const items = [
      { "name": "Todas las Variables", "description": "Se muestran todas las variables meteorológicas." },
      { "name": "Precipitación", "description": "Cantidad de agua, en forma de lluvia, nieve o granizo, que cae sobre una superficie en un período específico." },
      { "name": "Humedad", "description": "Cantidad de vapor de agua presente en el aire, generalmente expresada como un porcentaje." },
      { "name": "Nubosidad", "description": "Grado de cobertura del cielo por nubes, afectando la visibilidad y la cantidad de luz solar recibida." }
    ];
  
    const options = items.map((item, key) => <MenuItem key={key} value={key}>{item["name"]}</MenuItem>);
  
    const handleChange = (event: SelectChangeEvent) => {
      const idx = parseInt(event.target.value);
      setSelected(idx);
  
      if (descriptionRef.current !== null) {
        descriptionRef.current.innerHTML = items[idx]["description"];
      }
  
      onVariableChange(items[idx]["name"]);
    };
  
    return (
      <Paper
        sx={{
          p: 2,
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        <Typography mb={2} component="h3" variant="h6" color="primary">
          Variables Meteorológicas
        </Typography>
  
        <Box sx={{ minWidth: 120 }}>
          <FormControl fullWidth>
            <InputLabel id="simple-select-label">Variables</InputLabel>
            <Select
              labelId="simple-select-label"
              id="simple-select"
              label="Variables"
              value={selected.toString()}
              onChange={handleChange}
            >
              {options}
            </Select>
          </FormControl>
        </Box>
        <Typography ref={descriptionRef} mt={2} component="p" color="text.secondary">
          {items[0].description}
        </Typography>
      </Paper>
    );
  }