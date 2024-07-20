import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import { CardActionArea } from '@mui/material';

import sunrise from '../assets/sunrise.jpeg'

interface config {
    datos: string;
}

export default function Summary(config: config) {
    return (
        <Card sx={{ maxWidth: 750 }}>
            <CardActionArea>
                <CardMedia
                    component="img"
                    height="140"
                    image={sunrise}
                    alt="Amanecer"
                />
                <CardContent>
                    <Typography gutterBottom component="h2" variant="h6" color="primary">
                        Hora de salida del sol en esta ciudad
                    </Typography>
                    <Typography component="p" variant="h4">
                        
                    </Typography>
                    <Typography color="text.secondary" sx={{ flex: 1 }}>
                    {config.datos.toString()}
                    </Typography>
                </CardContent>
            </CardActionArea>
        </Card>
    )
}