import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';

interface Config {
    title?: string;
    subtitle?: string;
    value: number;
}

export default function Indicator(config: Config) {
    return (
        <Paper
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              marginTop: '10px',
              fontSize: {
                xs: '0.75rem', // Tamaño de fuente más pequeño en xs
                sm: '0.875rem', // Tamaño de fuente estándar en sm y mayores
              }
            }}
          >
            <Typography component="h2" variant="h6" color="primary" gutterBottom>
                {config.title} 
            </Typography>
            <Typography component="p" variant="h4"
            sx={{ 
                fontSize: {
                  xs: '1.5rem', // Tamaño de fuente más pequeño para xs
                  sm: '2.125rem', // Tamaño de fuente estándar para sm y mayores
                }
             }}>
                {config.value.toString()}
            </Typography>
            <Typography color="text.secondary" sx={{ flex: 1 }}>
                {config.subtitle}
            </Typography>
        </Paper> 
    )
}
