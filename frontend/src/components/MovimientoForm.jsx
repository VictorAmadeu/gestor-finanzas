import { useState, useEffect } from "react";

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
    // Si es edición, añade id
    if (initialData?.id) data.id = initialData.id;
    onSave(data);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded shadow max-w-sm w-full">
        <h3 className="text-lg font-bold mb-3">
          {initialData ? "Editar" : "Nuevo"} {tipo}
        </h3>
        <form onSubmit={handleSubmit}>
          <label className="block mb-2 text-sm">Fecha:</label>
          <input
            type="date"
            className="border p-1 mb-3 w-full"
            value={fecha}
            onChange={(e) => setFecha(e.target.value)}
            required
          />

          <label className="block mb-2 text-sm">
            Monto ({tipo === "Ingreso" ? "+" : "-"}) :
          </label>
          <input
            type="number"
            className="border p-1 mb-3 w-full"
            value={monto}
            onChange={(e) => setMonto(e.target.value)}
            required
          />

          <label className="block mb-2 text-sm">Categoría:</label>
          <select
            className="border p-1 mb-3 w-full"
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

          <label className="block mb-2 text-sm">Descripción:</label>
          <input
            type="text"
            className="border p-1 mb-3 w-full"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            placeholder="Opcional"
          />

          <div className="text-right">
            <button type="button" onClick={onCancel} className="mr-2 px-3 py-1">
              Cancelar
            </button>
            <button type="submit" className="bg-blue-600 text-white px-3 py-1">
              {initialData ? "Guardar" : "Añadir"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
