import { Card, CardContent, Typography, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const MenuCard = ({ icon: Icon, title, path }) => {
    const navigate = useNavigate();

    // Navegar a la ruta del componente seleccionado
    const handleClick = () => {
        navigate(path);
    };

    return (
        <Card
            sx={{
                cursor: 'pointer',
                transition: 'transform 0.2s',
                '&:hover': { transform: 'scale(1.05)' },
                width: '100%',
                minWidth: 200,
            }}
            onClick={handleClick} // Maneja el click para navegar a la ruta
        >
            <CardContent sx={{ textAlign: 'center', py: 4 }}>
                <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                    <Icon sx={{ fontSize: 60, color: 'primary.main' }} />
                </Box>
                <Typography variant="h6" component="div">
                    {title}
                </Typography>
            </CardContent>
        </Card>
    );
};

export default MenuCard;