// Manejador del contexto de uso del sistema
import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

// Provedor de las autenticaciones de los usuarios
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const sid = localStorage.getItem("SID");
    if (sid) { // Si se encuentra el SID de un usuario en el Local Storage, conservar esos datos.
      setUser({
        id: localStorage.getItem("id"),
        usuario: localStorage.getItem("usuario"),
        nombres: localStorage.getItem("nombres"),
        sid,
      });
    }
  }, []);

  // Almacenar datos del usaurio en el Local Storage al inciar una sesión
  const login = (userData) => {
    setUser(userData);
    localStorage.setItem("id", userData.id);
    localStorage.setItem("usuario", userData.usuario);
    localStorage.setItem("nombres", userData.nombres);
    localStorage.setItem("SID", userData.sid);
  };

  // Eliminar los datos almacenados al cerrar la sesión y redirigir a la ventana de Login
  const logout = (navigate) => {
    setUser(null);
    localStorage.removeItem("id");
    localStorage.removeItem("usuario");
    localStorage.removeItem("nombres");
    localStorage.removeItem("SID");
    if (navigate) {
      navigate('/login');
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoggedIn: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};
