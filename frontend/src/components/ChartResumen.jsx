import React, { useMemo } from "react";
import { Line, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Registrar los módulos de Chart.js que vamos a usar
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

/**
 * Este componente muestra solo un gráfico según prop 'tipo':
 * - tipo="line": gráfico de líneas ingresos vs gastos últimos 6 meses
 * - tipo="pie": gráfico de dona gastos por categoría del mes actual
 */
export default function ChartResumen({ ingresos, gastos, tipo = "line" }) {
  // useMemo para no recalcular todo en cada render innecesario
  const { labels, ingresosPorMes, gastosPorMes, pieData } = useMemo(() => {
    const now = new Date();
    const labels = [];
    const ingresosPorMes = [];
    const gastosPorMes = [];

    // Calcula las etiquetas de los últimos 6 meses y suma los montos de cada uno
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthLabel = d.toISOString().substring(0, 7); // "YYYY-MM"
      labels.push(monthLabel);

      // Suma ingresos y gastos de ese mes
      const sumIngresos = ingresos
        .filter((item) => item.fecha?.startsWith(monthLabel))
        .reduce((sum, it) => sum + Number(it.monto || 0), 0);
      const sumGastos = gastos
        .filter((item) => item.fecha?.startsWith(monthLabel))
        .reduce((sum, it) => sum + Number(it.monto || 0), 0);

      ingresosPorMes.push(sumIngresos);
      gastosPorMes.push(sumGastos);
    }

    // Calcular gastos por categoría del mes actual (pie chart)
    const categoriesTotals = {};
    const currentMonth = now.toISOString().substring(0, 7);
    gastos
      .filter((g) => g.fecha?.startsWith(currentMonth))
      .forEach((g) => {
        const cat = g.categoria_nombre || "Sin categoría";
        categoriesTotals[cat] =
          (categoriesTotals[cat] || 0) + Number(g.monto || 0);
      });

    const categoryNames = Object.keys(categoriesTotals);
    const categoryValues = Object.values(categoriesTotals);
    const palette = [
      "#f87171",
      "#fb923c",
      "#facc15",
      "#34d399",
      "#60a5fa",
      "#a78bfa",
    ]; // colores bonitos y variados
    const backgroundColors = categoryNames.map(
      (_, idx) => palette[idx % palette.length]
    );
    const pieData = {
      labels: categoryNames,
      datasets: [{ data: categoryValues, backgroundColor: backgroundColors }],
    };

    return { labels, ingresosPorMes, gastosPorMes, pieData };
  }, [ingresos, gastos]);

  // Configuración y datos para el gráfico de líneas
  const lineData = {
    labels,
    datasets: [
      {
        label: "Ingresos",
        data: ingresosPorMes,
        borderColor: "rgb(34,197,94)", // verde
        backgroundColor: "rgba(34,197,94,0.2)",
        tension: 0.3,
      },
      {
        label: "Gastos",
        data: gastosPorMes,
        borderColor: "rgb(239,68,68)", // rojo
        backgroundColor: "rgba(239,68,68,0.2)",
        tension: 0.3,
      },
    ],
  };
  const lineOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: "bottom" },
      title: { display: true, text: "Ingresos vs Gastos (últimos 6 meses)" },
    },
    scales: {
      x: { title: { display: true, text: "Mes" } },
      y: { title: { display: true, text: "Monto (€)" } },
    },
  };

  // Configuración para el gráfico de dona
  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: "bottom" },
      title: { display: true, text: "Gastos por Categoría (mes actual)" },
    },
  };

  // Renderizado del componente
  return (
    <div
      className="bg-white rounded-xl shadow-md p-4"
      style={{ height: "400px" }}
    >
      {tipo === "line" ? (
        <Line data={lineData} options={lineOptions} />
      ) : tipo === "pie" ? (
        pieData.labels.length > 0 ? (
          <Pie data={pieData} options={pieOptions} />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400">
            Sin datos de categorías
          </div>
        )
      ) : null}
    </div>
  );
}
