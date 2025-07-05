// src/components/Footer.jsx
export default function Footer() {
  return (
    <footer className="bg-blue-700 text-white py-4 text-center mt-10">
      <p>
        © {new Date().getFullYear()} Victor Amadeu Braga Heleno. Todos los
        derechos reservados.
      </p>
    </footer>
  );
}
