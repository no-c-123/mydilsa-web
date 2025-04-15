export default function ServiciosDestacado() {
    return (
      <section className="bg-mydilsa-steel text-white min-h-[80vh] px-6 py-24 flex items-center">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16">
          
          {/* Text content */}
          <div>
            <h2 className="text-4xl font-bold mb-6">Alta capacidad de producción</h2>
            <p className="text-lg mb-6 text-gray-200 leading-relaxed">
              En Mydilsa contamos con equipos industriales de alto rendimiento que nos permiten trabajar con grandes volúmenes de piezas sin comprometer precisión ni calidad.
            </p>
            <ul className="space-y-4 text-gray-100 text-base">
              <li>✔️ Entregas confiables y dentro de plazo</li>
              <li>✔️ Control de calidad en cada etapa</li>
              <li>✔️ Adaptabilidad a distintos sectores industriales</li>
              <li>✔️ Procesos certificados y equipo especializado</li>
            </ul>
          </div>
  
          {/* Visual (can be replaced with real image later) */}
          <div className="flex items-center justify-center">
            <img
              src="Fresado.webp"
              alt="Producción industrial"
              className="w-[500px]  rounded-lg hover:shadow-2xl transition duration-300 ease-in-out"
            />
          </div>
        </div>
      </section>
    );
  }
  