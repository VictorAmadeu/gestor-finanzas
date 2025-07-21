// src/components/Header.jsx
export default function Header() {
  return (
    <header className="bg-primary-dark text-white py-3 shadow">
      <div className="flex flex-col items-center justify-center gap-2 sm:flex-row sm:gap-4">
        {/* Logo centrado arriba de la frase en móvil, en línea en escritorio */}
        <img
          src="/icono.png"
          alt="Logo de Victor Amadeu"
          className="h-12 w-12 rounded-full border-2 border-white shadow-lg bg-white"
        />
        <h1 className="text-xl md:text-2xl font-bold tracking-wide text-center">
          Gestor de Finanzas Personales
        </h1>
      </div>
    </header>
  );
}
