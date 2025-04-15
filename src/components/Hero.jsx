export default function Hero() {
    return (
      <section className="bg-white min-h-screen flex flex-col md:flex-row items-center justify-between max-w-screen mx-auto px-52 pt-12 pb-20">
        {/* Left Text Block */}
        <div className="max-w-xl">
          <h1 className="text-4xl md:text-5xl font-bold text-mydilsa-dark leading-tight">
            Soluciones de Maquinado<br />con Precisión Industrial
          </h1>
          <p className="mt-4 text-lg text-gray-600">
            En Mydilsa, combinamos experiencia y tecnología para ofrecer diseño y fabricación de alta calidad.
          </p>
          <div className="mt-6">
            <a
              href="/servicios"
              className="inline-block bg-mydilsa-accent text-white px-6 py-3 rounded-md shadow hover:bg-mydilsa-dark transition"
            >
              Ver servicios
            </a>
          </div>
        </div>
  
        {/* Right Visual */}
        <div className="mt-10 md:mt-0 md:ml-12">
          <img src="/Logo.webp" alt="Mydilsa Logo" className="w-64 md:w-80" />
        </div>
      </section>
    );
  }
  