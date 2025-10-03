import { useState, useEffect } from 'react';
import {
    TextField,
    Button,
    Box,
    Typography
} from '@mui/material';

// Verificar si los datos del formulario y los datos del usuario son iguales
const deepEqual = (obj1, obj2) => {
    return JSON.stringify(obj1) === JSON.stringify(obj2);
};

// Inicializar los campos del formulario 
const UserForm = ({ initialData, onSubmit, isEditMode = false, isReadOnly = false }) => {
    const [formData, setFormData] = useState({
        nombres: '',
        apellido_paterno: '',
        apellido_materno: '',
        usuario: '',
        telefono: '',
        correo: '',
        fecha_nacimiento: '',
        contrasenha: ''
    });
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [initialState, setInitialState] = useState(formData);
    const [showPasswordFields, setShowPasswordFields] = useState(!isEditMode);

    useEffect(() => {
        // Si se reciben datos(ventana de edicion), cargar los datos del usuario en los campos del formulario
        if (initialData) {
            const formattedDate = initialData.fecha_nacimiento
                ? new Date(initialData.fecha_nacimiento).toISOString().split('T')[0]
                : '';
            const data = { ...initialData, fecha_nacimiento: formattedDate, contrasenha: '' }; 
            setFormData(data);
            setInitialState(data);
        }
    }, [initialData]);

    // Manejar los cambios en cualquier campo del formulario
    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === "confirmPassword") { // Idenficar si se quiere modificar la contraseña del usuario
            setConfirmPassword(value);
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    // Enviar los datos del usaurio
    const handleSubmit = (e) => {
        e.preventDefault();
        if (isReadOnly) return;

        setPasswordError('');

        // Validaciones del campo contraseña
        if (showPasswordFields || !isEditMode) {
            if (formData.contrasenha.length > 0 || confirmPassword.length > 0) {
                if (formData.contrasenha.length < 6) { // Validar los caracteres del campo contraseña
                    setPasswordError('La contraseña debe tener al menos 6 caracteres.');
                    return;
                }
                if (formData.contrasenha !== confirmPassword) { // Verificar que ambos campos coincidan
                    setPasswordError('Las contraseñas no coinciden.');
                    return;
                }
            } else if (!isEditMode) { // Si no se esta editando un usuario, obligar a ingresar una contraseña
                setPasswordError('El campo de contraseña es requerido.');
                return;
            }
        }

        const dataToSubmit = { ...formData }
        // Si no se esta modificando la contraseña, omitrila en los datos a enviar
        if (isEditMode && (!showPasswordFields || !dataToSubmit.contrasenha)) {
            delete dataToSubmit.contrasenha;
        }

        onSubmit(dataToSubmit);
    };

    const isChanged = !deepEqual(initialState, formData) || (isEditMode && showPasswordFields && !!formData.contrasenha);

    return (
        <form onSubmit={handleSubmit}>
            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 2 }}>
                <TextField label="Nombres" name="nombres" value={formData.nombres} onChange={handleChange} fullWidth required disabled={isReadOnly} InputProps={{ readOnly: isReadOnly }} />
                <TextField label="Apellido Paterno" name="apellido_paterno" value={formData.apellido_paterno} onChange={handleChange} fullWidth required disabled={isReadOnly} InputProps={{ readOnly: isReadOnly }} />
                <TextField label="Apellido Materno" name="apellido_materno" value={formData.apellido_materno} onChange={handleChange} fullWidth disabled={isReadOnly} InputProps={{ readOnly: isReadOnly }} />
                <TextField label="Usuario" name="usuario" value={formData.usuario} onChange={handleChange} fullWidth required disabled={isReadOnly} InputProps={{ readOnly: isReadOnly }} />
                <TextField label="Teléfono" name="telefono" value={formData.telefono} onChange={handleChange} fullWidth disabled={isReadOnly} InputProps={{ readOnly: isReadOnly }} />
                <TextField label="Email" name="correo" value={formData.correo} onChange={handleChange} fullWidth required type="email" disabled={isReadOnly} InputProps={{ readOnly: isReadOnly }} />
                <TextField
                    label="Fecha de Nacimiento"
                    name="fecha_nacimiento"
                    value={formData.fecha_nacimiento}
                    onChange={handleChange}
                    fullWidth
                    type="date"
                    InputLabelProps={{ shrink: true }}
                    disabled={isReadOnly}
                    InputProps={{ readOnly: isReadOnly }}
                />
            </Box>

            {isEditMode && (
                <Button onClick={() => setShowPasswordFields(!showPasswordFields)} sx={{ mt: 2 }} disabled={isReadOnly}>
                    {showPasswordFields ? 'Cancelar cambio de contraseña' : 'Cambiar contraseña'}
                </Button>
            )}

            {(showPasswordFields || !isEditMode) && !isReadOnly && (
                <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 2, mt: 2 }}>
                    <TextField label="Contraseña" name="contrasenha" type="password" value={formData.contrasenha} onChange={handleChange} fullWidth required={!isEditMode} />
                    <TextField label="Confirmar Contraseña" name="confirmPassword" type="password" value={confirmPassword} onChange={handleChange} fullWidth required={!isEditMode} />
                </Box>
            )}
            
            {passwordError && (
                <Typography color="error" sx={{ mt: 2 }}>{passwordError}</Typography>
            )}

            {!isReadOnly && (
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
                    <Button type="submit" variant="contained" disabled={isEditMode && !isChanged}>
                        {isEditMode ? 'Guardar Cambios' : 'Crear Usuario'}
                    </Button>
                </Box>
            )}
        </form>
    );
};

export default UserForm;