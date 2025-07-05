import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { supabase } from "../services/supabaseClient";
import { useNavigate } from "react-router-dom";

// MOCK DATA para pruebas (cámbialo en la Etapa 7 por fetch real)
const MOCK_INGRESOS = [
  {
    id: 1,
    fecha: "2025-07-01",
    descripcion: "Sueldo",
    categoria_nombre: "Salario",
    monto: 2500.0,
  },
  {
    id: 2,
    fecha: "2025-07-10",
    descripcion: "Venta libro",
    categoria_nombre: "Extra",
    monto: 40.5,
  },
];
const MOCK_GASTOS = [
  {
    id: 1,
    fecha: "2025-07-02",
    descripcion: "Alquiler",
    categoria_nombre: "Vivienda",
    monto: 690.0,
  },
  {
    id: 2,
    fecha: "2025-07-03",
    descripcion: "Supermercado",
    categoria_nombre: "Comida",
    monto: 110.75,
  },
];

export default function DashboardPage() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [showAddIngreso, setShowAddIngreso] = useState(false);
  const [showAddGasto, setShowAddGasto] = useState(false);
  const [loadingData] = useState(false);

  const ingresos = MOCK_INGRESOS;
  const gastos = MOCK_GASTOS;

  const totalIngresos = ingresos.reduce(
    (sum, item) => sum + Number(item.monto),
    0
  );
  const totalGastos = gastos.reduce((sum, item) => sum + Number(item.monto), 0);
  const balance = totalIngresos - totalGastos;

  // Logout handler
  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  if (!user) {
    navigate("/login");
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <main className="flex-1 flex flex-col items-center w-full">
        {/* Contenedor principal ultra ancho y paddings grandes */}
        <div className="w-full max-w-screen-2xl px-2 sm:px-6 lg:px-20 xl:px-36 py-12">
          {/* Header */}
          <header className="flex flex-col md:flex-row justify-between items-center mb-12">
            <h1 className="text-3xl lg:text-4xl font-bold mb-4 md:mb-0 text-gray-800">
              Hola, {user.email}
            </h1>
            <button
              onClick={handleLogout}
              className="bg-gray-300 px-5 py-2 rounded hover:bg-gray-400 transition text-base"
            >
              Cerrar sesión
            </button>
          </header>

          {/* Resumen mensual */}
          <section className="bg-gray-100 p-8 rounded-lg mb-12 flex flex-col md:flex-row md:justify-center items-center space-y-4 md:space-y-0 md:space-x-20 shadow">
            <div>
              Ingresos:{" "}
              <span className="text-green-600 font-bold">
                +€{totalIngresos.toFixed(2)}
              </span>
            </div>
            <div>
              Gastos:{" "}
              <span className="text-red-600 font-bold">
                -€{totalGastos.toFixed(2)}
              </span>
            </div>
            <div>
              Balance: <span className="font-bold">€{balance.toFixed(2)}</span>
            </div>
          </section>

          {/* Botones de acción */}
          <div className="mb-8 flex gap-6 justify-center">
            <button
              className="bg-blue-600 text-white px-8 py-2 rounded shadow hover:bg-blue-700"
              onClick={() => setShowAddIngreso(true)}
            >
              + Añadir Ingreso
            </button>
            <button
              className="bg-purple-600 text-white px-8 py-2 rounded shadow hover:bg-purple-700"
              onClick={() => setShowAddGasto(true)}
            >
              + Añadir Gasto
            </button>
          </div>

          {/* Tablas: ultra responsivas y sin cortes */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {/* Ingresos */}
            <div>
              <h3 className="text-lg font-semibold mb-3">Ingresos</h3>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[520px] bg-white rounded shadow text-sm md:text-base">
                  <thead className="bg-gray-200">
                    <tr>
                      <th className="text-left p-3">Fecha</th>
                      <th className="text-left p-3">Descripción</th>
                      <th className="text-left p-3">Categoría</th>
                      <th className="text-right p-3">Monto</th>
                      <th className="p-3">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ingresos.map((item) => (
                      <tr key={item.id} className="border-b last:border-0">
                        <td className="p-3">{item.fecha}</td>
                        <td className="p-3">{item.descripcion || "-"}</td>
                        <td className="p-3">{item.categoria_nombre || "-"}</td>
                        <td className="p-3 text-right text-green-600 font-bold">
                          +€{Number(item.monto).toFixed(2)}
                        </td>
                        <td className="p-3 text-center">
                          <button className="text-blue-600 hover:underline">
                            Editar
                          </button>
                          <button className="text-red-600 ml-2 hover:underline">
                            Eliminar
                          </button>
                        </td>
                      </tr>
                    ))}
                    {ingresos.length === 0 && !loadingData && (
                      <tr>
                        <td
                          colSpan="5"
                          className="p-3 text-center text-gray-500"
                        >
                          No hay ingresos
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
            {/* Gastos */}
            <div>
              <h3 className="text-lg font-semibold mb-3">Gastos</h3>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[520px] bg-white rounded shadow text-sm md:text-base">
                  <thead className="bg-gray-200">
                    <tr>
                      <th className="text-left p-3">Fecha</th>
                      <th className="text-left p-3">Descripción</th>
                      <th className="text-left p-3">Categoría</th>
                      <th className="text-right p-3">Monto</th>
                      <th className="p-3">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {gastos.map((item) => (
                      <tr key={item.id} className="border-b last:border-0">
                        <td className="p-3">{item.fecha}</td>
                        <td className="p-3">{item.descripcion || "-"}</td>
                        <td className="p-3">{item.categoria_nombre || "-"}</td>
                        <td className="p-3 text-right text-red-600 font-bold">
                          -€{Number(item.monto).toFixed(2)}
                        </td>
                        <td className="p-3 text-center">
                          <button className="text-blue-600 hover:underline">
                            Editar
                          </button>
                          <button className="text-red-600 ml-2 hover:underline">
                            Eliminar
                          </button>
                        </td>
                      </tr>
                    ))}
                    {gastos.length === 0 && !loadingData && (
                      <tr>
                        <td
                          colSpan="5"
                          className="p-3 text-center text-gray-500"
                        >
                          No hay gastos
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
