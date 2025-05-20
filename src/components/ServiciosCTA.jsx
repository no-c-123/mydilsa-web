export default function ServiciosCTA() {
  return (
    <section className="bg-mydilsa-light min-h-[70vh] py-24 px-6 flex items-center shadow-inner">
      <div className="max-w-5xl mx-auto text-center">
        <h2 className="text-4xl font-bold text-mydilsa-dark mb-6">
          ¿Listo para poner en marcha tu proyecto?
        </h2>
        <p className="text-lg text-gray-700 mb-8 max-w-2xl mx-auto">
          Nuestro equipo te acompaña desde el diseño hasta la fabricación. Solicita una cotización personalizada y descubre lo que podemos crear juntos.
        </p>
        <a
          href="/contacto"
          className="inline-block bg-mydilsa-accent text-white px-8 py-4 rounded-md font-semibold shadow-md hover:bg-mydilsa-dark transition"
        >
          Solicitar cotización
        </a>
        <p className="mt-6 text-sm text-gray-600">
          Tiempo promedio de respuesta: <span className="font-bold text-mydilsa-dark">menos de 24 horas</span>
        </p>
      </div>
    </section>
  );
}
