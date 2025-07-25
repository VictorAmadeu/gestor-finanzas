import { useState, useEffect, useRef } from "react";
import { XMarkIcon } from "@heroicons/react/24/solid";

export default function MovimientoForm({
  tipo,
  initialData,
  categorias,
  onSave,
  onCancel,
}) {
  const [fecha, setFecha] = useState("");
  const [monto, setMonto] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [categoriaId, setCategoriaId] = useState("");
  const modalRef = useRef(null);

  // Accesibilidad: enfoca el primer input al abrir
  useEffect(() => {
    modalRef.current?.focus();
  }, []);

  // Accesibilidad: cerrar con ESC
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") {
        onCancel();
      }
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onCancel]);

  // Cargar datos si es edición
  useEffect(() => {
    if (initialData) {
      setFecha(initialData.fecha);
      setMonto(initialData.monto);
      setDescripcion(initialData.descripcion || "");
      setCategoriaId(initialData.category_id || "");
    } else {
      setFecha(new Date().toISOString().slice(0, 10));
      setMonto("");
      setDescripcion("");
      setCategoriaId("");
    }
  }, [initialData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = {
      fecha,
      monto: Number(monto),
      descripcion,
      category_id: categoriaId || null,
    };
    if (initialData?.id) data.id = initialData.id;
    onSave(data);
  };

  return (
    // Fondo semitransparente con animación de aparición (fade-in)
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50
                 transition-opacity duration-300 animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-titulo"
      tabIndex={-1}
      onClick={onCancel} // Cierra al hacer click fuera del modal
    >
      {/* Detenemos la propagación para que no cierre si clicas dentro */}
      <div
        className="bg-white p-6 rounded-2xl shadow-xl max-w-sm w-full relative animate-fade-in-up transition-transform"
        onClick={(e) => e.stopPropagation()}
        ref={modalRef}
        tabIndex={0}
      >
        {/* Botón cerrar */}
        <button
          type="button"
          aria-label="Cerrar modal"
          onClick={onCancel}
          className="absolute top-3 right-3 text-gray-400 hover:text-red-500 focus:outline-none"
        >
          <XMarkIcon className="w-7 h-7" />
        </button>

        {/* Título */}
        <h3 id="modal-titulo" className="text-lg font-bold mb-3 text-center">
          {initialData ? "Editar" : "Nuevo"} {tipo}
        </h3>

        <form onSubmit={handleSubmit} className="space-y-2">
          {/* Fecha */}
          <div>
            <label htmlFor="fecha" className="block text-sm mb-1">
              Fecha:
            </label>
            <input
              id="fecha"
              type="date"
              className="border p-2 mb-1 w-full rounded focus:ring-primary focus:border-primary"
              value={fecha}
              onChange={(e) => setFecha(e.target.value)}
              required
              autoFocus
            />
          </div>
          {/* Monto */}
          <div>
            <label htmlFor="monto" className="block text-sm mb-1">
              Monto ({tipo === "Ingreso" ? "+" : "-"}) :
            </label>
            <input
              id="monto"
              type="number"
              className="border p-2 mb-1 w-full rounded focus:ring-primary focus:border-primary"
              value={monto}
              onChange={(e) => setMonto(e.target.value)}
              required
              min="0"
              step="0.01"
            />
          </div>
          {/* Categoría */}
          <div>
            <label htmlFor="categoria" className="block text-sm mb-1">
              Categoría:
            </label>
            <select
              id="categoria"
              className="border p-2 mb-1 w-full rounded"
              value={categoriaId}
              onChange={(e) => setCategoriaId(e.target.value)}
            >
              <option value="">- Sin categoría -</option>
              {categorias.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.nombre}
                </option>
              ))}
            </select>
          </div>
          {/* Descripción */}
          <div>
            <label htmlFor="descripcion" className="block text-sm mb-1">
              Descripción:
            </label>
            <input
              id="descripcion"
              type="text"
              className="border p-2 mb-1 w-full rounded"
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              placeholder="Opcional"
              maxLength={50}
            />
          </div>
          {/* Botones */}
          <div className="flex justify-end gap-2 mt-2">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-1 rounded border border-gray-300 hover:bg-gray-100"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700 shadow"
            >
              {initialData ? "Guardar" : "Añadir"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

