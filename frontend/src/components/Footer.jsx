// src/components/Footer.jsx

export default function Footer() {
  return (
    <footer className="bg-primary-dark text-white py-5 text-center mt-10">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between max-w-4xl mx-auto px-4">
        {/* Derechos */}
        <p className="mb-3 md:mb-0">
          © {new Date().getFullYear()} Victor Amadeu Braga Heleno. Todos los
          derechos reservados.
        </p>
        {/* Enlaces de redes */}
        <div className="flex justify-center gap-6">
          {/* Portafolio (Vue) */}
          <a
            href="https://victoramadeu.github.io/portafolio-vue/#/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center hover:text-primary-light transition"
            title="Portafolio Vue"
          >
            <img src="/vue-logo.png" alt="Vue Logo" className="h-6 w-6 mr-1" />
            Portafolio
          </a>
          {/* LinkedIn */}
          <a
            href="https://www.linkedin.com/in/victor-amadeu-braga-heleno"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center hover:text-primary-light transition"
            title="LinkedIn"
          >
            <img
              src="/linkedin-logo.png"
              alt="LinkedIn Logo"
              className="h-6 w-6 mr-1"
            />
            LinkedIn
          </a>
          {/* Repo Github */}
          <a
            href="https://github.com/VictorAmadeu/gestor-finanzas.git"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center hover:text-primary-light transition"
            title="Repositorio"
          >
            <img
              src="/github-logo.png"
              alt="GitHub Logo"
              className="h-6 w-6 mr-1"
            />
            Repo
          </a>
        </div>
      </div>
    </footer>
  );
}
