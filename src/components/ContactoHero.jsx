export default function ContactoHero() {
  return (
    <section className="bg-mydilsa-light min-h-[80vh] flex items-center px-6 py-24 text-center">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-5xl font-bold text-mydilsa-dark mb-6">
          Contáctanos
        </h1>
        <p className="text-xl text-gray-700 mb-8">
          ¿Tienes dudas, quieres cotizar o simplemente saber más sobre nuestros servicios? Estamos para ayudarte.
        </p>
        <a
          href="#contacto"
          className="inline-block bg-mydilsa-accent text-white px-8 py-4 rounded-md font-semibold shadow-md hover:bg-mydilsa-dark transition scroll-smooth duration-300"
        >
          Ir a Cotizar
        </a>
      </div>
    </section>
  );
}
