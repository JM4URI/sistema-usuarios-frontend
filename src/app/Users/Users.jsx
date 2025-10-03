import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Container,
    Card,
    CardContent,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Button,
    Box,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle
} from '@mui/material';
import { Delete } from '@mui/icons-material';
import { ApiServices } from '../ApiServices';
import { useAuth } from '../guards/useAuth';

const UsersPage = () => {
    const [users, setUsers] = useState([]);
    const [page, setPage] = useState(1);
    const [usersPerPage, setUsersPerPage] = useState(10);
    const { user } = useAuth();
    const sid = user?.sid;
    const id = user?.id;
    const apiServices = new ApiServices();
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);
    const [userToDelete, setUserToDelete] = useState(null);

    // Abre el modal de confirmación para eliminar un usuario
    const handleClickOpen = (user, e) => {
        e.stopPropagation();
        setUserToDelete(user);
        setOpen(true);
    };

    // Cierra el modal para eliminar un usuario
    const handleClose = () => {
        setOpen(false);
        setUserToDelete(null);
    };

    const handleDelete = async () => {
        if (userToDelete) { // Validar que se tenga un usuario para eliminar
            await apiServices.deleteUser(sid, id, userToDelete.id);
            const fetchedUsers = await apiServices.getUsers(sid, id);
            // Cerrar el modal y actualizar la lista de usuarios
            setUsers(fetchedUsers || []);
            handleClose();
        }
    };

    useEffect(() => {
        // Manejar el tamaño de la lista principal dependiendo de cada pantalla
        const handleResize = () => {
            const screenHeight = window.innerHeight;
            let rows = Math.floor((screenHeight - 250) / 60);
            if (rows < 5) rows = 5;
            setUsersPerPage(rows);
        };

        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    useEffect(() => {
        // Obtener todos los usuarios que pertenezcan al usuario actual
        const fetchUsers = async () => {
            if (sid && id) {
                const fetchedUsers = await apiServices.getUsers(sid, id);
                setUsers(fetchedUsers || []);
            }
        };

        fetchUsers();
    }, [sid, id]);

    const handleUserClick = (userId) => { // Navegar a la página de edición de usuario
        navigate(`/usuarios/edit/${userId}`); 
    };

    const totalPages = users ? Math.ceil(users.length / usersPerPage) : 1;

    // Avanzar una página para mostrar más usuarios en la tabla.
    const handleNextPage = () => {
        setPage((prevPage) => Math.min(prevPage + 1, totalPages));
    };

    // Retroceder una página en la tabla
    const handlePreviousPage = () => {
        setPage((prevPage) => Math.max(prevPage - 1, 1));
    };

    // Avanzar dos
    const handleDoubleNextPage = () => {
        setPage((prevPage) => Math.min(prevPage + 2, totalPages));
    };

    // Retroceder dos
    const handleDoublePreviousPage = () => {
        setPage((prevPage) => Math.max(prevPage - 2, 1));
    };

    const startIndex = (page - 1) * usersPerPage;
    const paginatedUsers = users ? users.slice(startIndex, startIndex + usersPerPage) : [];

    return (
        <Container maxWidth="lg" sx={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-start', minHeight: '90vh' }}>
            <Card sx={{ width: '100%' }}>
                <CardContent>
                    <Typography variant="h4" component="h1" gutterBottom>
                        Tabla de Usuarios
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
                        <Button variant="contained" onClick={() => navigate('/usuarios/create')}>
                            Crear Usuario
                        </Button>
                    </Box>
                    <TableContainer component={Paper}>
                        <Table stickyHeader aria-label="sticky table">
                            <TableHead>
                                <TableRow>
                                    <TableCell>ID</TableCell>
                                    <TableCell>Nombre Completo</TableCell>
                                    <TableCell>Usuario</TableCell>
                                    <TableCell>Teléfono</TableCell>
                                    <TableCell>Email</TableCell>
                                    <TableCell>Fecha de Nacimiento</TableCell>
                                    <TableCell>Estatus</TableCell>
                                    <TableCell>Acción</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {paginatedUsers.length > 0 ? (
                                    paginatedUsers.map((user) => (
                                        <TableRow
                                            key={user.id}
                                            onClick={() => handleUserClick(user.id)}
                                            sx={{ cursor: 'pointer', '&:hover': { backgroundColor: '#f5f5f5' } }}
                                        >
                                            <TableCell>{user.id}</TableCell>
                                            <TableCell>{user.nombres} {user.apellido_paterno} {user.apellido_materno}</TableCell>
                                            <TableCell>{user.usuario}</TableCell>
                                            <TableCell>{user.telefono}</TableCell>
                                            <TableCell>{user.correo}</TableCell>
                                            <TableCell>{user.fecha_nacimiento}</TableCell>
                                            <TableCell>{user.estatus}</TableCell>
                                            <TableCell>
                                                <Button variant="contained" color="error" startIcon={<Delete />} onClick={(e) => handleClickOpen(user, e)}>
                                                    Eliminar
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={8} align="center">
                                            No hay usuarios asignados.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mt: 2 }}>
                        <Button onClick={handleDoublePreviousPage} disabled={page <= 2}>&lt;&lt;</Button>
                        <Button onClick={handlePreviousPage} disabled={page === 1}>&lt;</Button>
                        <Typography sx={{ mx: 2 }}>
                            Página {page} de {totalPages}
                        </Typography>
                        <Button onClick={handleNextPage} disabled={page === totalPages}>&gt;</Button>
                        <Button onClick={handleDoubleNextPage} disabled={page >= totalPages - 1}>&gt;&gt;</Button>
                    </Box>
                </CardContent>
            </Card>
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    {"Confirmar Eliminación"}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        {userToDelete && `Estás seguro de eliminar al ${userToDelete.nombres} ${userToDelete.apellido_paterno}?`}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} variant="outlined">Cancelar</Button>
                    <Button onClick={handleDelete} autoFocus variant="contained" color="error">
                        Eliminar
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default UsersPage;