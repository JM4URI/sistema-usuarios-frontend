import React, { useState, useContext } from 'react';
import {
    AppBar,
    Toolbar,
    Typography,
    IconButton,
    Menu,
    MenuItem,
    Box,
    Avatar,
    ListItemIcon,
    ListItemText,
    Divider,
    Badge,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    TextField,
    Button,
    Alert
} from '@mui/material';
import {
    Person as PersonIcon,
    Download as DownloadIcon,
    Logout as LogoutIcon,
    AccountCircle,
    Key as KeyIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from './../../contexts/AuthContext';
import { ApiServices } from '../../ApiServices';
import { useAuth } from '../../guards/useAuth';

const Navbar = () => {

    const { logout } = useContext(AuthContext);
    const [anchorEl, setAnchorEl] = useState(null);
    const navigate = useNavigate();
    const { user } = useAuth();
    const sid = user?.sid;
    const id = user?.id;
    const apiServices = new ApiServices();

    const [openPassword, setOpenPassword] = useState(false);
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [currentUserInfo, setCurrentUserInfo] = useState(null);

    const userName = localStorage.getItem('nombres') || 'Usuario';
    const userInitial = userName.charAt(0).toUpperCase();

    // Desplegable del menú de usuario
    const handleMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    // Cerrar el menú de usuario
    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    // Navegar a la página de perfil
    const handleProfile = () => {
        handleMenuClose();
        navigate('/perfil');
    };

    // Cerrar la sesion del usuario
    const handleLogout = () => {
        handleMenuClose();
        logout(navigate);
    }

    // Abrir el diálogo para cambiar la contraseña
    const handleOpenPassword = async () => {
        if (sid && id) {
            const userInfo = await apiServices.getUserById(sid, id);
            setCurrentUserInfo(userInfo);
            setOpenPassword(true);
        }
        handleMenuClose();
    };

    // Cerrar el diálogo para cambiar la contraseña
    const handleClosePassword = () => {
        setOpenPassword(false);
        setNewPassword('');
        setConfirmPassword('');
        setPasswordError('');
    };

    // Manejar el cambio de contraseña y validar los campos
    const handleChangePassword = async () => {
        setPasswordError('');

        // Verificar que la contraseña tenga un mínimo de 6 caracteres
        if (newPassword.length < 6) {
            setPasswordError('La contraseña debe tener al menos 6 caracteres.');
            return;
        }

        // Verificar que los campos de contraseña coincidan
        if (newPassword !== confirmPassword) {
            setPasswordError('Las contraseñas no coinciden.');
            return;
        }

        // Enviar la informacion para editar el campo contraseña del usuario
        if (newPassword && currentUserInfo) {
            const updatedUserInfo = { ...currentUserInfo, contrasenha: newPassword };
            await apiServices.updateUser(sid, id, updatedUserInfo);
            handleClosePassword();
        }
    };

    const isMenuOpen = Boolean(anchorEl);
    const isSaveDisabled = newPassword === '' || newPassword !== confirmPassword;

    return (
        <AppBar
            position="sticky"
            elevation={2}
            sx={{
                margin: 0,
                padding: 0,
                minWidth: '100%',
                width: '100%',
                backgroundColor: 'background.paper',
                color: 'text.primary',
                borderBottom: 1,
                borderColor: 'divider'
            }}
        >
            <Toolbar>
                <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
                    <Typography
                        variant="h6"
                        component="div"
                        sx={{
                            fontWeight: 700,
                            color: 'primary.main',
                        }}
                    >
                        NoCompila
                    </Typography>
                </Box>

                <Box>
                    <IconButton
                        size="large"
                        edge="end"
                        aria-label="cuenta del usuario"
                        aria-controls="menu-appbar"
                        aria-haspopup="true"
                        onClick={handleMenuOpen}
                        color="inherit"
                        sx={{
                            border: 2,
                            borderColor: 'divider',
                            '&:hover': {
                                backgroundColor: 'action.hover'
                            }
                        }}
                    >
                        <Badge
                            overlap="circular"
                            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                            badgeContent={
                                <Avatar
                                    sx={{
                                        width: 24,
                                        height: 24,
                                        bgcolor: 'primary.main',
                                        fontSize: '0.75rem'
                                    }}
                                >
                                    {userInitial}
                                </Avatar>
                            }
                        >
                            <AccountCircle sx={{ fontSize: 32 }} />
                        </Badge>
                    </IconButton>

                    <Menu
                        id="menu-appbar"
                        anchorEl={anchorEl}
                        anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 'right',
                        }}
                        keepMounted
                        transformOrigin={{
                            vertical: 'top',
                            horizontal: 'right',
                        }}
                        open={isMenuOpen}
                        onClose={handleMenuClose}
                        PaperProps={{
                            sx: {
                                width: 280,
                                maxWidth: '100%',
                                mt: 1.5,
                                overflow: 'visible',
                                filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                                '&:before': {
                                    content: '""',
                                    display: 'block',
                                    position: 'absolute',
                                    top: 0,
                                    right: 14,
                                    width: 10,
                                    height: 10,
                                    bgcolor: 'background.paper',
                                    transform: 'translateY(-50%) rotate(45deg)',
                                    zIndex: 0,
                                },
                            },
                        }}
                    >
                        <MenuItem onClick={handleProfile} sx={{ py: 2 }}>
                            <ListItemIcon>
                                <Avatar
                                    sx={{
                                        bgcolor: 'primary.main',
                                        width: 30,
                                        height: 30,
                                        fontSize: '1rem'
                                    }}
                                >
                                    {userInitial}
                                </Avatar>
                            </ListItemIcon>
                            <ListItemText
                                primary={
                                    <Typography variant="subtitle1" fontWeight="medium">
                                        {userName}
                                    </Typography>
                                }
                                secondary={
                                    <Typography variant="body2" color="text.secondary">
                                        Bienvenido
                                    </Typography>
                                }
                            />
                        </MenuItem>

                        <Divider />

                        <MenuItem onClick={handleProfile}>
                            <ListItemIcon>
                                <PersonIcon fontSize="small" />
                            </ListItemIcon>
                            <ListItemText primary="Ver Información" />
                        </MenuItem>

                        <MenuItem onClick={handleOpenPassword}>
                            <ListItemIcon>
                                <KeyIcon fontSize="small" />
                            </ListItemIcon>
                            <ListItemText primary="Cambiar Contraseña" />
                        </MenuItem>

                        <MenuItem>
                            <ListItemIcon>
                                <DownloadIcon fontSize="small" />
                            </ListItemIcon>
                            <ListItemText primary="Descargar App" />
                        </MenuItem>

                        <Divider />

                        <MenuItem onClick={handleLogout} sx={{ color: 'error.main' }}>
                            <ListItemIcon sx={{ color: 'error.main' }}>
                                <LogoutIcon fontSize="small" />
                            </ListItemIcon>
                            <ListItemText primary="Cerrar Sesión" />
                        </MenuItem>
                    </Menu>
                </Box>
            </Toolbar>

            <Dialog open={openPassword} onClose={handleClosePassword} fullWidth maxWidth="xs">
                <DialogTitle>Cambiar Contraseña</DialogTitle>
                <DialogContent>
                    {passwordError && <Alert severity="error" sx={{ mb: 2 }}>{passwordError}</Alert>}
                    <DialogContentText>
                        Para cambiar tu contraseña, ingresa y confirma la nueva contraseña.
                    </DialogContentText>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="password"
                        label="Nueva Contraseña"
                        type="password"
                        fullWidth
                        variant="outlined"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        sx={{ mt: 2 }}
                    />
                    {newPassword && (
                        <TextField
                            margin="dense"
                            id="confirmPassword"
                            label="Confirmar Contraseña"
                            type="password"
                            fullWidth
                            variant="outlined"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                    )}
                </DialogContent>
                <DialogActions sx={{ p: '16px 24px' }}>
                    <Button onClick={handleClosePassword} variant="outlined">Cancelar</Button>
                    <Button onClick={handleChangePassword} variant="contained" disabled={isSaveDisabled}>Guardar</Button>
                </DialogActions>
            </Dialog>
        </AppBar>
    );
};

export default Navbar;