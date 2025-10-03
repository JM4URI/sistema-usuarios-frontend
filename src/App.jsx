import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import { useAuth } from './app/guards/useAuth.jsx';
import AuthGuard from "./app/guards/AuthGuard";
import Navbar from "./app/components/Header/Navbar.jsx";
import Login from "./app/Login/Login.jsx";
import Menu from "./app/Menu/Menu.jsx";
import Users from "./app/Users/Users.jsx";
import UserEditPage from "./app/Users/UserEdit.jsx";
import UserCreatePage from "./app/Users/UserCreate.jsx";
import UserProfilePage from "./app/Users/UserProfile.jsx";

function App() {

  const { isLoggedIn } = useAuth();
  const location = useLocation();
  const isLoginPage = location.pathname === '/login';

  // Esperar el estado del login del usuario
  if (isLoggedIn === null) {
    return <div>Cargando...</div>;
  }

  return (
    <>
      {isLoggedIn && !isLoginPage && <Navbar />}
      <Routes>
        <Route
          path="*"
          element={
            <AuthGuard>
              <Menu />
            </AuthGuard>
          }
        />

        <Route
          path="/"
          element={
            <AuthGuard>
              <Menu />
            </AuthGuard>
          }
        />

        <Route
          path="/login"
          element={isLoggedIn ? <Navigate to="/menu" replace /> : <Login />}
        />

        <Route
          path="/menu"
          element={
            <AuthGuard>
              <Menu />
            </AuthGuard>
          }
        />

        <Route
          path="/usuarios"
          element={
            <AuthGuard>
              <Users />
            </AuthGuard>
          }
        />

        <Route
          path="/usuarios/edit/:userId"
          element={
            <AuthGuard>
              <UserEditPage />
            </AuthGuard>
          }
        />

        <Route
          path="/usuarios/create"
          element={
            <AuthGuard>
              <UserCreatePage />
            </AuthGuard>
          }
        />

        <Route
          path="/perfil"
          element={
            <AuthGuard>
              <UserProfilePage />
            </AuthGuard>
          }
        />
      </Routes>
    </>
  );
}

export default App;