import { useEffect, useState, useContext, useMemo } from "react";
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
  DocumentArrowDownIcon,
} from "@heroicons/react/24/solid";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import icono from "../assets/icono.png";

/**
 * DashboardPage
 *
 * Página principal del gestor de finanzas.
 * Aquí ves ingresos, gastos, balance, puedes filtrar/buscar,
 * exportar datos a PDF, y abrir formularios para editar/crear.
 * Implementa la Etapa 10 del roadmap: filtros y búsquedas avanzadas.
 */
export default function DashboardPage() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  // --- Estados para formularios y edición ---
  const [showAddIngreso, setShowAddIngreso] = useState(false);
  const [showAddGasto, setShowAddGasto] = useState(false);
  const [editIngreso, setEditIngreso] = useState(null);
  const [editGasto, setEditGasto] = useState(null);

  // --- Estados de datos y loading ---
  const [ingresos, setIngresos] = useState([]);
  const [gastos, setGastos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [loadingData, setLoadingData] = useState(true);

  // --- Etapa 10: Filtros y búsqueda ---
  const [search, setSearch] = useState(""); // búsqueda por texto
  const [filterCat, setFilterCat] = useState(""); // filtro por categoría

  useEffect(() => {
    if (!user) return;
    setLoadingData(true);

    // Cargar datos cacheados para mostrar rápido (UX)
    const storedIngresos = localStorage.getItem("ingresos_" + user.id);
    const storedGastos = localStorage.getItem("gastos_" + user.id);
    const storedCategorias = localStorage.getItem("categorias");

    if (storedIngresos) setIngresos(JSON.parse(storedIngresos));
    if (storedGastos) setGastos(JSON.parse(storedGastos));
    if (storedCategorias) setCategorias(JSON.parse(storedCategorias));
    setLoadingData(false);

    // Petición real al backend (Laravel API)
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  // --- Cálculos de totales globales (sin filtrar) ---
  const totalIngresos = ingresos.reduce(
    (sum, item) => sum + Number(item.monto),
    0
  );
  const totalGastos = gastos.reduce((sum, item) => sum + Number(item.monto), 0);
  const balance = totalIngresos - totalGastos;

  // --- Filtros: Listas filtradas para mostrar en tablas ---
  // Se usan useMemo para evitar recalcular en cada render (optimización)
  const filteredIngresos = useMemo(() => {
    const term = search.trim().toLowerCase();
    return ingresos.filter((item) => {
      const matchesSearch =
        term === "" ||
        item.descripcion?.toLowerCase().includes(term) ||
        item.categoria_nombre?.toLowerCase().includes(term);
      const matchesCategory =
        filterCat === "" || item.categoria_nombre === filterCat;
      return matchesSearch && matchesCategory;
    });
  }, [ingresos, search, filterCat]);

  const filteredGastos = useMemo(() => {
    const term = search.trim().toLowerCase();
    return gastos.filter((item) => {
      const matchesSearch =
        term === "" ||
        item.descripcion?.toLowerCase().includes(term) ||
        item.categoria_nombre?.toLowerCase().includes(term);
      const matchesCategory =
        filterCat === "" || item.categoria_nombre === filterCat;
      return matchesSearch && matchesCategory;
    });
  }, [gastos, search, filterCat]);

  // --- LOGOUT ---
  const handleLogout = async () => {
    localStorage.removeItem("ingresos_" + user.id);
    localStorage.removeItem("gastos_" + user.id);
    localStorage.removeItem("categorias");
    await supabase.auth.signOut();
    navigate("/login");
  };

  // --- CRUD Optimista ---
  const handleSave = async (tipo, data) => {
    const endpoint = tipo === "Ingreso" ? "ingresos" : "gastos";
    const url = data.id
      ? `http://127.0.0.1:8000/api/${endpoint}/${data.id}`
      : `http://127.0.0.1:8000/api/${endpoint}`;
    const method = data.id ? "PUT" : "POST";
    if (!data.id) data.user_id = user.id;
    // Encuentra el nombre de la categoría desde la lista global
    const catNombre =
      categorias.find((c) => c.id === data.category_id)?.nombre || null;

    setShowAddIngreso(false);
    setShowAddGasto(false);
    setEditIngreso(null);
    setEditGasto(null);

    // Inserción provisional para mejor UX
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

      // Asegura que categoria_nombre esté presente en el registro insertado
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

  // --- Eliminar registro ---
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

  // --- Exportar a PDF (ingresos + gastos + resumen) ---
  const exportPDF = async () => {
    const doc = new jsPDF("p", "pt", "A4");
    doc.setFontSize(18);

    // Insertar logo
    let imgData;
    if (!window.__pdf_logo_base64) {
      const response = await fetch(icono);
      const blob = await response.blob();
      const reader = new window.FileReader();
      imgData = await new Promise((res) => {
        reader.onload = () => res(reader.result);
        reader.readAsDataURL(blob);
      });
      window.__pdf_logo_base64 = imgData;
    } else {
      imgData = window.__pdf_logo_base64;
    }
    doc.addImage(imgData, "PNG", 40, 25, 40, 40);

    doc.setFontSize(18);
    doc.text("Reporte Financiero", 100, 50);

    // Tabla Ingresos
    doc.setFontSize(14);
    doc.text("Ingresos", 40, 90);
    const ingresosColumnas = ["Fecha", "Descripción", "Categoría", "Monto"];
    const ingresosRows = ingresos.map((item) => [
      new Date(item.fecha).toLocaleDateString("es-ES"),
      item.descripcion || "",
      item.categoria_nombre || "",
      `+€${Number(item.monto).toFixed(2)}`,
    ]);
    autoTable(doc, {
      startY: 100,
      head: [ingresosColumnas],
      body: ingresosRows,
      margin: { left: 40, right: 40 },
      styles: { cellPadding: 3, fontSize: 10 },
      headStyles: { fillColor: [34, 197, 94] },
    });

    // Tabla Gastos
    let lastY = doc.lastAutoTable.finalY || 120;
    doc.setFontSize(14);
    doc.text("Gastos", 40, lastY + 30);
    const gastosColumnas = ["Fecha", "Descripción", "Categoría", "Monto"];
    const gastosRows = gastos.map((item) => [
      new Date(item.fecha).toLocaleDateString("es-ES"),
      item.descripcion || "",
      item.categoria_nombre || "",
      `-€${Number(item.monto).toFixed(2)}`,
    ]);
    autoTable(doc, {
      startY: lastY + 40,
      head: [gastosColumnas],
      body: gastosRows,
      margin: { left: 40, right: 40 },
      styles: { cellPadding: 3, fontSize: 10 },
      headStyles: { fillColor: [239, 68, 68] },
    });

    // Resumen final
    lastY = doc.lastAutoTable.finalY;
    const totalIng = ingresos.reduce((sum, i) => sum + Number(i.monto), 0);
    const totalGas = gastos.reduce((sum, g) => sum + Number(g.monto), 0);
    doc.setFontSize(12);
    doc.text(`Total Ingresos: €${totalIng.toFixed(2)}`, 40, lastY + 30);
    doc.text(`Total Gastos: €${totalGas.toFixed(2)}`, 40, lastY + 50);
    doc.text(`Balance: €${(totalIng - totalGas).toFixed(2)}`, 40, lastY + 70);

    doc.save("reporte_financiero.pdf");
  };

  // --- Si no hay usuario, redirige a login ---
  if (!user) {
    navigate("/login");
    return null;
  }

  // --- Render del Dashboard ---
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <main className="flex-1 flex flex-col items-center w-full">
        {loadingData && (
          <div className="text-center my-10 text-lg">Cargando datos...</div>
        )}
        <div className="w-full max-w-screen-2xl px-1 sm:px-4 lg:px-12 xl:px-24 py-4 sm:py-8">
          {/* HEADER */}
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

          {/* RESUMEN */}
          <section className="mb-7 flex flex-col md:flex-row justify-center items-center gap-4 sm:gap-6">
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

          {/* FILTROS + ACCIONES */}
          <div className="mb-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            {/* Filtros */}
            <div className="flex flex-col sm:flex-row items-center mb-2 md:mb-0 gap-2">
              <input
                type="text"
                placeholder="Buscar..."
                className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring focus:ring-blue-200 w-full sm:w-auto"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <select
                value={filterCat}
                onChange={(e) => setFilterCat(e.target.value)}
                className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring focus:ring-blue-200 w-full sm:w-auto"
              >
                <option value="">Todas las categorías</option>
                {categorias.map((cat) => (
                  <option key={cat.id} value={cat.nombre}>
                    {cat.nombre}
                  </option>
                ))}
              </select>
            </div>
            {/* Acciones */}
            <div className="flex gap-4 sm:gap-6 justify-center">
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
              <button
                onClick={exportPDF}
                className="bg-gray-800 hover:bg-gray-900 text-white font-semibold px-5 py-2 rounded flex items-center gap-2 text-sm sm:text-base"
                title="Exportar datos financieros a PDF"
              >
                <DocumentArrowDownIcon className="h-5 w-5 sm:h-6 sm:w-6" />
                Exportar a PDF
              </button>
            </div>
          </div>

          {/* TABLAS */}
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
                    {filteredIngresos.map((item, idx) => (
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
                    {filteredIngresos.length === 0 && !loadingData && (
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
                    {filteredGastos.map((item, idx) => (
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
                    {filteredGastos.length === 0 && !loadingData && (
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

          {/* GRÁFICOS */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-10 mt-12">
            <div>
              <ChartResumen ingresos={ingresos} gastos={gastos} tipo="line" />
            </div>
            <div>
              <ChartResumen ingresos={ingresos} gastos={gastos} tipo="pie" />
            </div>
          </div>
        </div>

        {/* Formularios de añadir/editar */}
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
