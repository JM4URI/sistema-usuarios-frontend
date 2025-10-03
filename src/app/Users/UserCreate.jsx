import { useNavigate } from 'react-router-dom';
import {
    Container,
    Card,
    CardContent,
    Typography
} from '@mui/material';
import { ApiServices } from '../ApiServices';
import { useAuth } from '../guards/useAuth';
import UserForm from '../components/Users/UserForm';

const UserCreatePage = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const sid = user?.sid;
    const id = user?.id;
    const apiServices = new ApiServices();

    const handleCreateUser = async (userData) => {
        const dataToSend = {
            ...userData,
        }; // Almacenar los datos del nuevo usuario
        const response = await apiServices.createUser(sid, id, dataToSend);
        // Verificar que la respuesta de la API sea exitosa para redirigir al usuario a la lista principal
        if (response && response.success) { 
            navigate('/usuarios');
        } else {
            console.error("Error al crear el usuario:", response); 
        }
    };

    return (
        <Container maxWidth="md">
            <Card sx={{ mt: 6 }}>
                <CardContent>
                    <Typography variant="h4" component="h1" gutterBottom>
                        Crear Nuevo Usuario
                    </Typography>
                    <UserForm onSubmit={handleCreateUser} />
                </CardContent>
            </Card>
        </Container>
    );
};

export default UserCreatePage;
