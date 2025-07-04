// src/pages/DashboardPage.jsx
import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { supabase } from "../services/supabaseClient";
import { useNavigate } from "react-router-dom";

// Simula datos para la UI (luego los reemplazarás por fetch real)
const MOCK_INGRESOS = [
  { id: 1, fecha: "2025-07-01", descripcion: "Sueldo", categoria_nombre: "Salario", monto: 2500.0 },
  { id: 2, fecha: "2025-07-10", descripcion: "Venta libro", categoria_nombre: "Extra", monto: 40.5 },
];
const MOCK_GASTOS = [
  { id: 1, fecha: "2025-07-02", descripcion: "Alquiler", categoria_nombre: "Vivienda", monto: 690.0 },
  { id: 2, fecha: "2025-07-03", descripcion: "Supermercado", categoria_nombre: "Comida", monto: 110.75 },
];

export default function DashboardPage() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  // Estado para mostrar modales (añadir/editar) – lo implementarás en la Etapa 7
  const [showAddIngreso, setShowAddIngreso] = useState(false);
  const [showAddGasto, setShowAddGasto] = useState(false);

  // Simula loading de datos (lo harás real en la Etapa 7)
  const [loadingData, setLoadingData] = useState(false);
  const ingresos = MOCK_INGRESOS; // sustituye por datos reales después
  const gastos = MOCK_GASTOS;     // sustituye por datos reales después

  // Totales y balance
  const totalIngresos = ingresos.reduce((sum, item) => sum + Number(item.monto), 0);
  const totalGastos = gastos.reduce((sum, item) => sum + Number(item.monto), 0);
  const balance = totalIngresos - totalGastos;

  // Logout
  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  if (!user) {
    navigate("/login");
    return null;
  }

  return (
    <div className="p-4 max-w-5xl mx-auto">
      {/* Encabezado y navegación */}
      <header className="flex flex-col md:flex-row justify-between items-center mb-6">
        <h1 className="text-2xl font-bold mb-2 md:mb-0">Hola, {user.email}</h1>
        <button
          onClick={handleLogout}
          className="bg-gray-300 px-3 py-1 rounded hover:bg-gray-400 transition"
        >
          Cerrar sesión
        </button>
      </header>

      {/* Resumen mensual */}
      <div className="bg-gray-100 p-4 rounded-md mb-6 flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-8">
        <div>Ingresos: <span className="text-green-600 font-bold">+€{totalIngresos.toFixed(2)}</span></div>
        <div>Gastos: <span className="text-red-600 font-bold">-€{totalGastos.toFixed(2)}</span></div>
        <div>Balance: <span className="font-bold">€{balance.toFixed(2)}</span></div>
      </div>

      {/* Botones para añadir */}
      <div className="mb-4">
        <button
          className="bg-blue-500 text-white px-4 py-2 mr-2 rounded"
          onClick={() => setShowAddIngreso(true)}
        >
          + Añadir Ingreso
        </button>
        <button
          className="bg-purple-500 text-white px-4 py-2 rounded"
          onClick={() => setShowAddGasto(true)}
        >
          + Añadir Gasto
        </button>
      </div>

      {/* Tablas lado a lado en desktop, apiladas en móvil */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Tabla Ingresos */}
        <div>
          <h3 className="text-lg font-semibold mb-2">Ingresos</h3>
          <table className="min-w-full bg-white rounded">
            <thead className="bg-gray-200">
              <tr>
                <th className="text-left p-2">Fecha</th>
                <th className="text-left p-2">Descripción</th>
                <th className="text-left p-2">Categoría</th>
                <th className="text-right p-2">Monto</th>
                <th className="p-2">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {ingresos.map(item => (
                <tr key={item.id} className="border-b">
                  <td className="p-2">{item.fecha}</td>
                  <td className="p-2">{item.descripcion || '-'}</td>
                  <td className="p-2">{item.categoria_nombre || '-'}</td>
                  <td className="p-2 text-right text-green-600 font-bold">
                    +€{Number(item.monto).toFixed(2)}
                  </td>
                  <td className="p-2 text-center">
                    <button className="text-blue-600 hover:underline">Editar</button>
                    <button className="text-red-600 ml-2 hover:underline">Eliminar</button>
                  </td>
                </tr>
              ))}
              {ingresos.length === 0 && !loadingData && (
                <tr><td colSpan="5" className="p-2 text-center text-gray-500">No hay ingresos</td></tr>
              )}
            </tbody>
          </table>
        </div>
        {/* Tabla Gastos */}
        <div>
          <h3 className="text-lg font-semibold mb-2">Gastos</h3>
          <table className="min-w-full bg-white rounded">
            <thead className="bg-gray-200">
              <tr>
                <th className="text-left p-2">Fecha</th>
                <th className="text-left p-2">Descripción</th>
                <th className="text-left p-2">Categoría</th>
                <th className="text-right p-2">Monto</th>
                <th className="p-2">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {gastos.map(item => (
                <tr key={item.id} className="border-b">
                  <td className="p-2">{item.fecha}</td>
                  <td className="p-2">{item.descripcion || '-'}</td>
                  <td className="p-2">{item.categoria_nombre || '-'}</td>
                  <td className="p-2 text-right text-red-600 font-bold">
                    -€{Number(item.monto).toFixed(2)}
                  </td>
                  <td className="p-2 text-center">
                    <button className="text-blue-600 hover:underline">Editar</button>
                    <button className="text-red-600 ml-2 hover:underline">Eliminar</button>
                  </td>
                </tr>
              ))}
              {gastos.length === 0 && !loadingData && (
                <tr><td colSpan="5" className="p-2 text-center text-gray-500">No hay gastos</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      {/* Aquí puedes integrar el modal de añadir/editar en la siguiente etapa */}
      {/* {showAddIngreso && <MovimientoForm tipo="Ingreso" ... />} */}
      {/* {showAddGasto && <MovimientoForm tipo="Gasto" ... />} */}
    </div>
  );
}
