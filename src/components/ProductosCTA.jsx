export default function ProductosCTA() {
    return (
      <section className="bg-white min-h-[60vh] py-24 px-6 flex items-center">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-mydilsa-dark mb-6">
            ¿Necesitas cotizar una pieza o lote de producción?
          </h2>
          <p className="text-lg text-gray-700 mb-8 max-w-2xl mx-auto">
            Cuéntanos sobre tus requerimientos y recibe una cotización rápida, detallada y sin compromiso. Fabricamos desde prototipos únicos hasta miles de unidades.
          </p>
          <a
            href="/contacto"
            className="inline-block bg-mydilsa-accent text-white px-8 py-4 rounded-md font-semibold shadow-md hover:bg-mydilsa-dark transition"
          >
            Solicitar cotización
          </a>
          <p className="mt-6 text-sm text-gray-600 font-bold">
            Atención personalizada: <span className="font-semibold text-mydilsa-dark">respuesta en menos de 24h</span>
          </p>
        </div>
      </section>
    );
  }
  