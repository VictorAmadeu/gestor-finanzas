import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";

// Creamos el root y renderizamos el componente principal <App />
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Hemos eliminado reportWebVitals porque no es necesario para el proyecto.
