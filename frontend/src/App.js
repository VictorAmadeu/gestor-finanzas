// src/App.js
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import { useContext } from "react";
import { AuthContext } from "./context/AuthContext";

function App() {
  const { user, loading } = useContext(AuthContext);

  // Mientras se verifica la sesión, mostramos un loader
  if (loading) return <div>Cargando...</div>;

  return (
    <BrowserRouter>
      <Routes>
        {/* Ruta de registro */}
        <Route path="/register" element={<RegisterPage />} />
        {/* Ruta de login */}
        <Route path="/login" element={<LoginPage />} />
        {/* Dashboard solo si hay usuario logueado */}
        <Route
          path="/dashboard"
          element={user ? <DashboardPage /> : <Navigate to="/login" />}
        />
        {/* Ruta raíz: redirige automáticamente */}
        <Route
          path="/"
          element={<Navigate to={user ? "/dashboard" : "/login"} />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
