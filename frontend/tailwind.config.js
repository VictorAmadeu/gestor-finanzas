// tailwind.config.js
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        // Fuente principal para toda la app
        sans: ["Inter", "sans-serif"],
      },
      colors: {
        primary: {
          DEFAULT: "#2563eb", // Azul principal (botones, enlaces)
          light: "#3b82f6", // Azul claro (hover)
          dark: "#1e40af", // Azul oscuro (header)
        },
        secondary: {
          DEFAULT: "#a21caf", // Morado (botón gastos)
        },
        success: {
          DEFAULT: "#22c55e", // Verde (ingresos)
        },
        danger: {
          DEFAULT: "#ef4444", // Rojo (gastos, eliminar)
        },
      },
    },
  },
  plugins: [],
};
