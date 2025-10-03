import React, { useState, useContext } from "react";
import { useNavigate } from 'react-router-dom';
import { Visibility, VisibilityOff, LockOutlined } from "@mui/icons-material";
import { Box, Paper, TextField, Typography, Button, IconButton, InputAdornment, Snackbar, Alert, Avatar, Grid, Link, } from "@mui/material";
import { ApiServices } from "./../ApiServices";
import { AuthContext } from "./../contexts/AuthContext";

const apiServices = new ApiServices();

export default function Login() {

  const navigate = useNavigate();
  const { login } = useContext(AuthContext); 
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Verificar los datos del usuario
      const response = await apiServices.loginUser(username, password); 

      // Si hay una respuesta correcta de la API, almacenar los datos del usuario en el contexto del sistema y redirigir al menú
      if (response) {
        login(response);
        navigate("/menu");
      } else {
        setError(response.message || "Usuario o contraseña incorrectos");
      }

    } catch (err) { // Si la respuesta de la API falla
       if (err.message === "Credenciales no válidas.") { // Verificar si es un error por credenciales
        setError(err.message);
       } else { // Otro tipo de errores de respuesta en la API
         setError("Error al conectar con el servidor. Inténtalo de nuevo.");
      }
    } finally {
      setLoading(false);
    }

  };

  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f5f5f5",
      }}
    >
      <Paper
        elevation={3}
        sx={{
          p: 4,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          borderRadius: 2,
          width: '100%',
          maxWidth: 400,
          mx: 2,
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
          <LockOutlined />
        </Avatar>
        <Typography component="h1" variant="h5" sx={{ mb: 2 }}>
          Iniciar Sesión
        </Typography>

        <Box component="form" onSubmit={handleLogin} sx={{ mt: 1, width: '100%' }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="username"
            label="Nombre de Usuario"
            name="username"
            autoComplete="username"
            autoFocus
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Contraseña"
            type={showPassword ? "text" : "password"}
            id="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            disabled={loading}
            sx={{ mt: 3, mb: 2, py: 1.5 }}
          >
            {loading ? "Ingresando..." : "Entrar"}
          </Button>
        </Box>
      </Paper>

      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={() => setError("")}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={() => setError("")}
          severity="error"
          sx={{ width: "100%" }}
        >
          {error}
        </Alert>
      </Snackbar>
    </Box>
  );
}
