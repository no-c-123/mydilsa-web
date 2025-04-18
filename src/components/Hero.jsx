export default function Hero() {
    return (
      <>
        <section className="bg-white min-h-[70vh] flex flex-col md:flex-row items-center justify-between max-w-screen mx-auto px-52 pt-12 pb-20">
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
            <img src="/Logo-name.webp" alt="Mydilsa Logo" className="w-64 md:w-80" />
          </div>
        </section>

        <section className="h-[40vh] bg-white py-16 px-6 mt-[-150px]">
          <div className="max-w-7xl mx-auto mb-10 text-center">
            <h1 className="text-3xl font-bold mb-10">¿Quienes Somos?</h1>
            <div className="">
              <h2 className="text-2xl font-bold mb-4">MAQUINADO Y DISEÑO INDUSTRIAL LEAL</h2>
              <p className="text-xl">
                Somos una compañía fundada en 
                el año de 1996 con la visión de ofrecer siempre una solución satisfactoria a nuestros clientes, basando 
                nuestro potencial en nuestro compromiso de ofrecer siempre productos de alta calidad a precio 
                competitivo y con excelente tiempo de entrega.
                Dicha visión se ha mantenido como base principal de nuestra filosofía, impulsando así un crecimiento natural 
                de nuestra empresa, motivado por las altas exigencias del mercado de la industria metal mecánica que es 
                hacia donde canalizamos nuestros esfuerzos.
                Contamos con maquinaria y equipo de primera para la fabricación de nuestros productos lo cual nos 
                permite estar siempre a la cabeza en nuestro ramo
              </p>
            </div>
          </div>

        </section>
      </>
    );
  }
  