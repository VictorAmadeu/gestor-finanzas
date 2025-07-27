import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { supabase } from "../services/supabaseClient";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import MovimientoForm from "../components/MovimientoForm";
import ChartResumen from "../components/ChartResumen";
import {
  PlusCircleIcon,
  PencilSquareIcon,
  TrashIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  BanknotesIcon,
  UserCircleIcon,
} from "@heroicons/react/24/solid";

export default function DashboardPage() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  // Estados para formularios/modal
  const [showAddIngreso, setShowAddIngreso] = useState(false);
  const [showAddGasto, setShowAddGasto] = useState(false);
  const [editIngreso, setEditIngreso] = useState(null);
  const [editGasto, setEditGasto] = useState(null);

  // Estados de movimientos y categorías
  const [ingresos, setIngresos] = useState([]);
  const [gastos, setGastos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    if (!user) return;
    setLoadingData(true);

    // Cargar datos cacheados de localStorage para mostrar instantáneamente
    const storedIngresos = localStorage.getItem("ingresos_" + user.id);
    const storedGastos = localStorage.getItem("gastos_" + user.id);
    const storedCategorias = localStorage.getItem("categorias");

    if (storedIngresos) setIngresos(JSON.parse(storedIngresos));
    if (storedGastos) setGastos(JSON.parse(storedGastos));
    if (storedCategorias) setCategorias(JSON.parse(storedCategorias));

    setLoadingData(false);

    // Fetch real del backend
    const fetchData = async () => {
      try {
        const resIngresos = await fetch(
          `http://127.0.0.1:8000/api/ingresos?user_id=${user.id}`
        );
        const ingresosData = await resIngresos.json();
        setIngresos(ingresosData);
        localStorage.setItem(
          "ingresos_" + user.id,
          JSON.stringify(ingresosData)
        );

        const resGastos = await fetch(
          `http://127.0.0.1:8000/api/gastos?user_id=${user.id}`
        );
        const gastosData = await resGastos.json();
        setGastos(gastosData);
        localStorage.setItem("gastos_" + user.id, JSON.stringify(gastosData));

        const resCategorias = await fetch(
          "http://127.0.0.1:8000/api/categories"
        );
        const categoriasData = await resCategorias.json();
        setCategorias(categoriasData);
        localStorage.setItem("categorias", JSON.stringify(categoriasData));
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
    // eslint-disable-next-line
  }, [user]);

  // Calcular totales
  const totalIngresos = ingresos.reduce(
    (sum, item) => sum + Number(item.monto),
    0
  );
  const totalGastos = gastos.reduce((sum, item) => sum + Number(item.monto), 0);
  const balance = totalIngresos - totalGastos;

  // LOGOUT
  const handleLogout = async () => {
    localStorage.removeItem("ingresos_" + user.id);
    localStorage.removeItem("gastos_" + user.id);
    localStorage.removeItem("categorias");
    await supabase.auth.signOut();
    navigate("/login");
  };

  // CRUD optimista
  const handleSave = async (tipo, data) => {
    const endpoint = tipo === "Ingreso" ? "ingresos" : "gastos";
    const url = data.id
      ? `http://127.0.0.1:8000/api/${endpoint}/${data.id}`
      : `http://127.0.0.1:8000/api/${endpoint}`;
    const method = data.id ? "PUT" : "POST";
    if (!data.id) data.user_id = user.id;
    const catNombre =
      categorias.find((c) => c.id === data.category_id)?.nombre || null;

    setShowAddIngreso(false);
    setShowAddGasto(false);
    setEditIngreso(null);
    setEditGasto(null);

    const tempId = data.id || `tmp-${Date.now()}`;
    const provisional = { ...data, id: tempId, categoria_nombre: catNombre };

    if (data.id) {
      if (tipo === "Ingreso")
        setIngresos((prev) =>
          prev.map((i) => (i.id === provisional.id ? provisional : i))
        );
      else
        setGastos((prev) =>
          prev.map((g) => (g.id === provisional.id ? provisional : g))
        );
    } else {
      if (tipo === "Ingreso") setIngresos((prev) => [provisional, ...prev]);
      else setGastos((prev) => [provisional, ...prev]);
    }

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

      if (tipo === "Ingreso") {
        setIngresos((prev) =>
          prev.map((i) =>
            i.id === tempId ? { ...saved, categoria_nombre: catNombre } : i
          )
        );
        localStorage.setItem(
          "ingresos_" + user.id,
          JSON.stringify(
            ingresos.map((i) =>
              i.id === tempId ? { ...saved, categoria_nombre: catNombre } : i
            )
          )
        );
      } else {
        setGastos((prev) =>
          prev.map((g) =>
            g.id === tempId ? { ...saved, categoria_nombre: catNombre } : g
          )
        );
        localStorage.setItem(
          "gastos_" + user.id,
          JSON.stringify(
            gastos.map((g) =>
              g.id === tempId ? { ...saved, categoria_nombre: catNombre } : g
            )
          )
        );
      }
    } catch (err) {
      alert("Error al guardar: " + err.message);
      if (tipo === "Ingreso")
        setIngresos((prev) => prev.filter((i) => i.id !== tempId));
      else setGastos((prev) => prev.filter((g) => g.id !== tempId));
    }
  };

  const handleDelete = async (tipo, id) => {
    if (!window.confirm("¿Seguro de eliminar?")) return;
    const endpoint = tipo === "Ingreso" ? "ingresos" : "gastos";
    const prevIngresos = ingresos;
    const prevGastos = gastos;

    if (tipo === "Ingreso")
      setIngresos((prev) => prev.filter((i) => i.id !== id));
    else setGastos((prev) => prev.filter((g) => g.id !== id));

    try {
      const res = await fetch(`http://127.0.0.1:8000/api/${endpoint}/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error();
      if (tipo === "Ingreso")
        localStorage.setItem(
          "ingresos_" + user.id,
          JSON.stringify(prevIngresos.filter((i) => i.id !== id))
        );
      else
        localStorage.setItem(
          "gastos_" + user.id,
          JSON.stringify(prevGastos.filter((g) => g.id !== id))
        );
    } catch {
      alert("Error al eliminar");
      if (tipo === "Ingreso") setIngresos(prevIngresos);
      else setGastos(prevGastos);
    }
  };

  if (!user) {
    navigate("/login");
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <main className="flex-1 flex flex-col items-center w-full">
        {loadingData && (
          <div className="text-center my-10 text-lg">Cargando datos...</div>
        )}
        <div className="w-full max-w-screen-2xl px-1 sm:px-4 lg:px-12 xl:px-24 py-4 sm:py-8">
          {/* HEADER con orden responsive */}
          <header className="flex flex-col md:flex-row justify-between items-center mb-6 w-full gap-0 md:gap-0">
            <div className="w-full md:w-auto flex justify-end md:order-2 order-1">
              <button
                onClick={handleLogout}
                className="bg-red-600 text-white px-6 py-2 rounded shadow hover:bg-red-700 transition text-base font-semibold mt-2 md:mt-0"
              >
                Cerrar sesión
              </button>
            </div>
            <div className="w-full md:w-auto flex justify-start md:order-1 order-2">
              <div className="flex items-center gap-4 bg-white shadow-md rounded-2xl px-4 sm:px-6 py-3 sm:py-4 mb-4">
                <UserCircleIcon className="h-12 w-12 text-primary" />
                <div>
                  <div className="text-gray-500 text-sm font-medium">
                    Bienvenido/a
                  </div>
                  <div className="text-xl sm:text-2xl md:text-3xl font-bold">
                    <span className="text-primary">
                      {user.user_metadata?.name || user.email}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </header>

          {/* RESUMEN modular con tarjetas */}
          <section className="mb-7 flex flex-col md:flex-row justify-center items-center gap-4 sm:gap-6">
            {/* Ingresos */}
            <div className="flex-1 min-w-[150px] max-w-xs bg-green-50 rounded-xl shadow p-4 sm:p-6 flex items-center gap-2 sm:gap-4">
              <ArrowTrendingUpIcon className="h-7 w-7 sm:h-8 sm:w-8 text-success" />
              <div>
                <div className="text-xs sm:text-sm text-gray-500 font-medium">
                  Ingresos
                </div>
                <div className="text-xl sm:text-2xl font-bold text-success">
                  +€{totalIngresos.toFixed(2)}
                </div>
              </div>
            </div>
            {/* Gastos */}
            <div className="flex-1 min-w-[150px] max-w-xs bg-red-50 rounded-xl shadow p-4 sm:p-6 flex items-center gap-2 sm:gap-4">
              <ArrowTrendingDownIcon className="h-7 w-7 sm:h-8 sm:w-8 text-danger" />
              <div>
                <div className="text-xs sm:text-sm text-gray-500 font-medium">
                  Gastos
                </div>
                <div className="text-xl sm:text-2xl font-bold text-danger">
                  -€{totalGastos.toFixed(2)}
                </div>
              </div>
            </div>
            {/* Balance */}
            <div className="flex-1 min-w-[150px] max-w-xs bg-blue-50 rounded-xl shadow p-4 sm:p-6 flex items-center gap-2 sm:gap-4">
              <BanknotesIcon className="h-7 w-7 sm:h-8 sm:w-8 text-primary" />
              <div>
                <div className="text-xs sm:text-sm text-gray-500 font-medium">
                  Balance
                </div>
                <div className="text-xl sm:text-2xl font-bold text-primary">
                  €{balance.toFixed(2)}
                </div>
              </div>
            </div>
          </section>

          {/* Botones de acción con iconos */}
          <div className="mb-5 flex gap-4 sm:gap-6 justify-center">
            <button
              className="bg-blue-600 text-white px-5 py-2 rounded shadow hover:bg-blue-700 flex items-center gap-2 text-sm sm:text-base"
              onClick={() => {
                setShowAddIngreso(true);
                setEditIngreso(null);
              }}
            >
              <PlusCircleIcon className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
              Añadir Ingreso
            </button>
            <button
              className="bg-purple-600 text-white px-5 py-2 rounded shadow hover:bg-purple-700 flex items-center gap-2 text-sm sm:text-base"
              onClick={() => {
                setShowAddGasto(true);
                setEditGasto(null);
              }}
            >
              <PlusCircleIcon className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
              Añadir Gasto
            </button>
          </div>

          {/* Tablas ultra responsivas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-10">
            {/* Ingresos */}
            <div>
              <h3 className="text-base sm:text-lg font-semibold mb-2 sm:mb-3">
                Ingresos
              </h3>
              <div className="overflow-x-auto w-full">
                <table className="w-full min-w-[400px] sm:min-w-[520px] bg-white rounded shadow text-xs sm:text-base">
                  <thead className="bg-gray-200">
                    <tr>
                      <th className="text-left p-2 sm:p-3">Fecha</th>
                      <th className="text-left p-2 sm:p-3">Descripción</th>
                      <th className="text-left p-2 sm:p-3">Categoría</th>
                      <th className="text-right p-2 sm:p-3">Monto</th>
                      <th className="p-2 sm:p-3">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ingresos.map((item, idx) => (
                      <tr
                        key={item.id}
                        className={`border-b last:border-0 ${
                          idx % 2 === 1 ? "bg-gray-50" : ""
                        }`}
                      >
                        <td className="p-2 sm:p-3">{item.fecha}</td>
                        <td className="p-2 sm:p-3">
                          {item.descripcion || "-"}
                        </td>
                        <td className="p-2 sm:p-3">
                          {item.categoria_nombre || "-"}
                        </td>
                        <td className="p-2 sm:p-3 text-right text-green-600 font-bold">
                          +€{Number(item.monto).toFixed(2)}
                        </td>
                        <td className="p-2 sm:p-3 text-center flex justify-center gap-2">
                          <button
                            className="text-blue-600 hover:bg-blue-100 p-1 rounded flex items-center"
                            onClick={() => {
                              setEditIngreso(item);
                              setShowAddIngreso(true);
                            }}
                            title="Editar"
                          >
                            <PencilSquareIcon className="h-4 w-4 sm:h-5 sm:w-5" />
                          </button>
                          <button
                            className="text-red-600 hover:bg-red-100 p-1 rounded flex items-center"
                            onClick={() => handleDelete("Ingreso", item.id)}
                            title="Eliminar"
                          >
                            <TrashIcon className="h-4 w-4 sm:h-5 sm:w-5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                    {ingresos.length === 0 && !loadingData && (
                      <tr>
                        <td
                          colSpan="5"
                          className="p-2 sm:p-3 text-center text-gray-500"
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
              <h3 className="text-base sm:text-lg font-semibold mb-2 sm:mb-3">
                Gastos
              </h3>
              <div className="overflow-x-auto w-full">
                <table className="w-full min-w-[400px] sm:min-w-[520px] bg-white rounded shadow text-xs sm:text-base">
                  <thead className="bg-gray-200">
                    <tr>
                      <th className="text-left p-2 sm:p-3">Fecha</th>
                      <th className="text-left p-2 sm:p-3">Descripción</th>
                      <th className="text-left p-2 sm:p-3">Categoría</th>
                      <th className="text-right p-2 sm:p-3">Monto</th>
                      <th className="p-2 sm:p-3">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {gastos.map((item, idx) => (
                      <tr
                        key={item.id}
                        className={`border-b last:border-0 ${
                          idx % 2 === 1 ? "bg-gray-50" : ""
                        }`}
                      >
                        <td className="p-2 sm:p-3">{item.fecha}</td>
                        <td className="p-2 sm:p-3">
                          {item.descripcion || "-"}
                        </td>
                        <td className="p-2 sm:p-3">
                          {item.categoria_nombre || "-"}
                        </td>
                        <td className="p-2 sm:p-3 text-right text-red-600 font-bold">
                          -€{Number(item.monto).toFixed(2)}
                        </td>
                        <td className="p-2 sm:p-3 text-center flex justify-center gap-2">
                          <button
                            className="text-blue-600 hover:bg-blue-100 p-1 rounded flex items-center"
                            onClick={() => {
                              setEditGasto(item);
                              setShowAddGasto(true);
                            }}
                            title="Editar"
                          >
                            <PencilSquareIcon className="h-4 w-4 sm:h-5 sm:w-5" />
                          </button>
                          <button
                            className="text-red-600 hover:bg-red-100 p-1 rounded flex items-center"
                            onClick={() => handleDelete("Gasto", item.id)}
                            title="Eliminar"
                          >
                            <TrashIcon className="h-4 w-4 sm:h-5 sm:w-5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                    {gastos.length === 0 && !loadingData && (
                      <tr>
                        <td
                          colSpan="5"
                          className="p-2 sm:p-3 text-center text-gray-500"
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

          {/* GRÁFICOS perfectamente alineados en grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-10 mt-12">
            <div>
              <ChartResumen ingresos={ingresos} gastos={gastos} tipo="line" />
            </div>
            <div>
              <ChartResumen ingresos={ingresos} gastos={gastos} tipo="pie" />
            </div>
          </div>
        </div>

        {/* Modal */}
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
// Aquí termina el componente DashboardPage
