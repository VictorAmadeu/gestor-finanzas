import { useState, useContext } from "react";
import { supabase } from "../services/supabaseClient";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";

// Importamos iconos de usuario y candado
import { UserIcon, LockClosedIcon } from "@heroicons/react/24/outline";

export default function LoginPage() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      setError(error.message);
    } else {
      navigate("/dashboard");
    }
  };

  const handleForgotPassword = async () => {
    let inputEmail = email;
    if (!inputEmail) {
      inputEmail = prompt("Introduce tu correo para recuperar la contraseña:");
    }
    if (inputEmail) {
      const { error } = await supabase.auth.resetPasswordForEmail(inputEmail);
      if (error) {
        alert("Error: " + error.message);
      } else {
        alert(
          "Si existe una cuenta con ese correo, recibirás instrucciones para restablecer la contraseña."
        );
      }
    }
  };

  if (user) {
    navigate("/dashboard");
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-grow flex items-center justify-center">
        <div className="max-w-sm w-full mx-auto mt-8 p-6 bg-white rounded shadow">
          <h2 className="text-2xl font-bold mb-4">Iniciar Sesión</h2>
          <form onSubmit={handleLogin}>
            {/* Input de email con icono */}
            <div className="relative mb-3">
              <span className="absolute left-3 top-2.5">
                <UserIcon className="h-5 w-5 text-gray-400" />
              </span>
              <input
                type="email"
                placeholder="Correo electrónico"
                className="border p-2 w-full pl-10"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            {/* Input de password con icono */}
            <div className="relative mb-3">
              <span className="absolute left-3 top-2.5">
                <LockClosedIcon className="h-5 w-5 text-gray-400" />
              </span>
              <input
                type="password"
                placeholder="Contraseña"
                className="border p-2 w-full pl-10"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            {error && <div className="text-red-500 mb-3">{error}</div>}
            <button
              type="submit"
              className="bg-blue-600 text-white py-2 px-4 w-full rounded"
            >
              Iniciar sesión
            </button>
          </form>
          <div className="mt-3">
            <button
              type="button"
              onClick={handleForgotPassword}
              className="text-blue-500 underline bg-transparent border-0 p-0"
            >
              ¿Olvidaste tu contraseña?
            </button>
          </div>
          <div className="mt-2">
            ¿No tienes cuenta?{" "}
            <a href="/register" className="text-blue-500 underline">
              Crear una
            </a>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
