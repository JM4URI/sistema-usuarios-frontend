import { useState, useEffect } from 'react';
import {
    Container,
    Card,
    CardContent,
    Typography,
    Box,
    Button,
    Avatar,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Divider,
    CardHeader
} from '@mui/material';
import {
    Person as PersonIcon,
    Email as EmailIcon,
    Phone as PhoneIcon,
    Cake as CakeIcon,
    AccountCircle as AccountCircleIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { ApiServices } from './../ApiServices';
import { useAuth } from './../guards/useAuth';

const UserProfilePage = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const sid = user?.sid;
    const id = user?.id;
    const apiServices = new ApiServices();

    const [userInfo, setUserInfo] = useState(null);

    useEffect(() => {
        const fetchUser = async () => {
            if (sid && id) {
                const userData = await apiServices.getUserById(sid, id);
                if (userData) {
                    setUserInfo(userData); // Recuperar la informacion del usaurio
                }
            }
        };

        fetchUser();
    }, [sid, id]);

    const handleBack = () => {
        navigate(-1); // Volver a la página anterior
    };

    if (!userInfo) { // Esperar la respuesta de la API
        return <Container sx={{p:5}}>Cargando...</Container>;
    }

    const userInitial = userInfo.nombres ? userInfo.nombres.charAt(0).toUpperCase() : '?';
    const fullName = `${userInfo.nombres || ''} ${userInfo.apellido_paterno || ''} ${userInfo.apellido_materno || ''}`.trim();

    return (
        <Container maxWidth="sm" sx={{ mt: 4 }}>
            <Card 
                sx={{
                    borderRadius: 4,
                    boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
                    backdropFilter: 'blur(4px)',
                    border: '1px solid rgba(255, 255, 255, 0.18)'
                }}
            >
                <CardHeader
                    avatar={
                        <Avatar sx={{ bgcolor: 'primary.main', width: 56, height: 56, fontSize: '1.75rem' }}>
                            {userInitial}
                        </Avatar>
                    }
                    title={<Typography variant="h4" component="h1">{fullName}</Typography>}
                    subheader={<Typography color="text.secondary">{userInfo.usuario}</Typography>}
                    sx={{ pb: 2, pt: 4, px: 4 }}
                />
                <CardContent sx={{ px: 4 }}>
                    <Divider sx={{ my: 2 }} />
                    <List>
                        <ListItem>
                            <ListItemIcon>
                                <EmailIcon color="primary" />
                            </ListItemIcon>
                            <ListItemText primary="Correo Electrónico" secondary={userInfo.correo || 'No especificado'} />
                        </ListItem>
                        <ListItem>
                            <ListItemIcon>
                                <PhoneIcon color="primary" />
                            </ListItemIcon>
                            <ListItemText primary="Teléfono" secondary={userInfo.telefono || 'No especificado'} />
                        </ListItem>
                        <ListItem>
                            <ListItemIcon>
                                <CakeIcon color="primary" />
                            </ListItemIcon>
                            <ListItemText 
                                primary="Fecha de Nacimiento" 
                                secondary={userInfo.fecha_nacimiento ? new Date(userInfo.fecha_nacimiento).toLocaleDateString() : 'No especificada'} 
                            />
                        </ListItem>
                    </List>
                    <Box sx={{ display: 'flex', justifyContent: 'center', pt: 3, pb: 2 }}>
                        <Button variant="contained" onClick={handleBack}>
                            Volver
                        </Button>
                    </Box>
                </CardContent>
            </Card>
        </Container>
    );
};

export default UserProfilePage;