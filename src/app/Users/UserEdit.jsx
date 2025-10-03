import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Container,
    Card,
    CardContent,
    Typography,
    Box,
    Button
} from '@mui/material';
import { ApiServices } from '../ApiServices';
import { useAuth } from '../guards/useAuth';
import UserForm from '../components/Users/UserForm';

const UserEditPage = () => {
    const { userId } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const sid = user?.sid;
    const apiServices = new ApiServices();

    const [initialUser, setInitialUser] = useState(null);

    useEffect(() => {
        // Recuperar los datos del usuario previamente seleccionado
        const fetchUser = async () => {
            if (sid && userId) {
                const userToEdit = await apiServices.getUserById(sid, userId);
                if (userToEdit) {
                    setInitialUser(userToEdit); // Almacenar los datos para su uso en el formulario
                }
            }
        };

        fetchUser();
    }, [sid, userId]);

    const handleUpdateUser = async (userData) => {
        const response = await apiServices.updateUser(sid, userId, userData);
        if (response && response.success) {
            // Si la actualización es exitosa, redirigir al usuario a la lista principal
            navigate('/usuarios');
        } else {
            console.error("Error al actualizar el usuario:", response);
        }
    };

    // Si se quiere cancelar la acción redirigir al listado principal
    const handleCancel = () => {
        navigate('/usuarios');
    };

    // Esperar a obtener una respuesta de la API al momento de recuperar los datos del usuario
    if (!initialUser) {
        return <div>Cargando...</div>;
    }

    return (
        <Container maxWidth="md">
            <Card>
                <CardContent>
                    <Typography variant="h4" component="h1" gutterBottom>
                        Editar Usuario
                    </Typography>
                    <UserForm initialData={initialUser} onSubmit={handleUpdateUser} isEditMode={true} />
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
                        <Button onClick={handleCancel} sx={{ mr: 1 }}>
                            Cancelar
                        </Button>
                    </Box>
                </CardContent>
            </Card>
        </Container>
    );
};

export default UserEditPage;
