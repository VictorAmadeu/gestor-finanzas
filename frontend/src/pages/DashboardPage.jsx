import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { supabase } from "../services/supabaseClient";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import MovimientoForm from "../components/MovimientoForm"; // IMPORTANTE

export default function DashboardPage() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  // Estados para mostrar formularios/modal de añadir y editar
  const [showAddIngreso, setShowAddIngreso] = useState(false);
  const [showAddGasto, setShowAddGasto] = useState(false);
  const [editIngreso, setEditIngreso] = useState(null);
  const [editGasto, setEditGasto] = useState(null);

  // Datos de movimientos y categorías
  const [ingresos, setIngresos] = useState([]);
  const [gastos, setGastos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [loadingData, setLoadingData] = useState(true);

  // Fetch inicial de ingresos, gastos y categorías
  useEffect(() => {
    if (!user) return;
    setLoadingData(true);

    const fetchData = async () => {
      try {
        // Cargar ingresos
        const resIngresos = await fetch(
          `http://127.0.0.1:8000/api/ingresos?user_id=${user.id}`
        );
        const ingresosData = await resIngresos.json();
        setIngresos(ingresosData);

        // Cargar gastos
        const resGastos = await fetch(
          `http://127.0.0.1:8000/api/gastos?user_id=${user.id}`
        );
        const gastosData = await resGastos.json();
        setGastos(gastosData);

        // Cargar categorías
        const resCategorias = await fetch(
          "http://127.0.0.1:8000/api/categories"
        );
        const categoriasData = await resCategorias.json();
        setCategorias(categoriasData);
      } catch (err) {
        alert("Error al cargar datos del servidor");
        setIngresos([]);
        setGastos([]);
        setCategorias([]);
      } finally {
        setLoadingData(false);
      }
    };

    fetchData();
  }, [user]);

  // Calcular totales
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

  // CREAR/EDITAR ingreso/gasto
  const handleSave = async (tipo, data) => {
    const endpoint = tipo === "Ingreso" ? "ingresos" : "gastos";
    const url = data.id
      ? `http://127.0.0.1:8000/api/${endpoint}/${data.id}`
      : `http://127.0.0.1:8000/api/${endpoint}`;
    const method = data.id ? "PUT" : "POST";
    if (!data.id) data.user_id = user.id;

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText);
      }
      const saved = await res.json();

      // Actualizar estado según nuevo o editado
      if (data.id) {
        if (tipo === "Ingreso")
          setIngresos((prev) =>
            prev.map((i) => (i.id === saved.id ? saved : i))
          );
        else
          setGastos((prev) => prev.map((g) => (g.id === saved.id ? saved : g)));
      } else {
        if (tipo === "Ingreso") setIngresos((prev) => [saved, ...prev]);
        else setGastos((prev) => [saved, ...prev]);
      }

      // Cierra los formularios/modales de edición/alta después de guardar
      setShowAddIngreso(false);
      setShowAddGasto(false);
      setEditIngreso(null);
      setEditGasto(null);
    } catch (err) {
      alert("Error al guardar: " + err.message);
    }
  };

  // ELIMINAR ingreso/gasto
  const handleDelete = async (tipo, id) => {
    if (!window.confirm("¿Seguro de eliminar?")) return;
    const endpoint = tipo === "Ingreso" ? "ingresos" : "gastos";
    try {
      const res = await fetch(`http://127.0.0.1:8000/api/${endpoint}/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error();
      if (tipo === "Ingreso")
        setIngresos((prev) => prev.filter((i) => i.id !== id));
      else setGastos((prev) => prev.filter((g) => g.id !== id));
    } catch {
      alert("Error al eliminar");
    }
  };

  // Si no hay usuario, redirecciona a login
  if (!user) {
    navigate("/login");
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <main className="flex-1 flex flex-col items-center w-full">
        {/* Loading */}
        {loadingData && (
          <div className="text-center my-10 text-lg">Cargando datos...</div>
        )}
        <div className="w-full max-w-screen-2xl px-2 sm:px-6 lg:px-20 xl:px-36 py-12">
          {/* Header */}
          <header className="flex flex-col md:flex-row justify-between items-center mb-12">
            <h1 className="text-3xl lg:text-4xl font-bold mb-4 md:mb-0 text-gray-800">
              {/* CAMBIO: saludar por nombre si está, si no por email */}
              Hola, {user.user_metadata?.name || user.email}
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
              onClick={() => {
                setShowAddIngreso(true);
                setEditIngreso(null);
              }}
            >
              + Añadir Ingreso
            </button>
            <button
              className="bg-purple-600 text-white px-8 py-2 rounded shadow hover:bg-purple-700"
              onClick={() => {
                setShowAddGasto(true);
                setEditGasto(null);
              }}
            >
              + Añadir Gasto
            </button>
          </div>

          {/* Tablas ultra responsivas */}
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
                          <button
                            className="text-blue-600 hover:underline"
                            onClick={() => {
                              setEditIngreso(item);
                              setShowAddIngreso(true);
                            }}
                          >
                            Editar
                          </button>
                          <button
                            className="text-red-600 ml-2 hover:underline"
                            onClick={() => handleDelete("Ingreso", item.id)}
                          >
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
                          <button
                            className="text-blue-600 hover:underline"
                            onClick={() => {
                              setEditGasto(item);
                              setShowAddGasto(true);
                            }}
                          >
                            Editar
                          </button>
                          <button
                            className="text-red-600 ml-2 hover:underline"
                            onClick={() => handleDelete("Gasto", item.id)}
                          >
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

        {/* Renderizado condicional del formulario modal */}
        {showAddIngreso && (
          <MovimientoForm
            tipo="Ingreso"
            categorias={categorias}
            initialData={editIngreso}
            onSave={(data) => handleSave("Ingreso", data)}
            onCancel={() => {
              setShowAddIngreso(false);
              setEditIngreso(null);
            }}
          />
        )}
        {showAddGasto && (
          <MovimientoForm
            tipo="Gasto"
            categorias={categorias}
            initialData={editGasto}
            onSave={(data) => handleSave("Gasto", data)}
            onCancel={() => {
              setShowAddGasto(false);
              setEditGasto(null);
            }}
          />
        )}
      </main>
      <Footer />
    </div>
  );
}
