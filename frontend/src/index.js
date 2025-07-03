// src/index.js
import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { AuthProvider } from "./context/AuthContext"; // <--- Importa tu Provider

// Creamos el root y renderizamos <App /> envuelto en <AuthProvider>
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>
);

// Hemos eliminado reportWebVitals porque no es necesario para el proyecto.
