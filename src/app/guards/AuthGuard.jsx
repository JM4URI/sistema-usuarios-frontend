import { useEffect, useState } from 'react';
import { ApiServices } from '../ApiServices';
import { Navigate } from 'react-router-dom';

const apiServices = new ApiServices();

// Guardian de Autenticación del sistema para evitar accesos no autorizados
export default function AuthGuard({ children }) {

    const [isValid, setIsValid] = useState(null);

    useEffect(() => { 
        const SID = localStorage.getItem('SID');

        if (!SID) { // En caso de que no se encuentre un sid almacenado en el Local Storage, no validar la sesión del usuario
            setIsValid(false);
            return;
        }

        // Enviar el SID encontrado para validarlo en el backend
        apiServices.validateSID(SID).then(res => {
            if(res) { // Si la respuesta es correcta, se validara el acceso del usuario
                setIsValid(true);
            } else {
                setIsValid(false);
            }
        });
    }, []);

    // Mientras no se establezca si es valido o no el acceso del usuario, mostrar un mensaje indicando que se espera la respuesta.
    if (isValid === null) {
        return <div>Cargando...</div>;
    }

    // Si se valida el acceso, permitir entrar a la ventana que se este pidiendo acceso, sino enviar al usuario al Login
    return isValid ? children : <Navigate to="/login" replace />;
}