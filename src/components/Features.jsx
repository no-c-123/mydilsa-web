export default function Features() {
  return (
    <>
      {/* ¿Por qué elegir a Mydilsa? */}
      <section className="bg-mydilsa-light py-16 px-6 mb-32">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-mydilsa-dark mb-10">
            ¿Por qué elegir a Mydilsa?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 text-left">
            <div>
              <h3 className="text-lg sm:text-xl font-semibold mb-2">Precisión CNC</h3>
              <p className="text-gray-600">
                Trabajamos con tolerancias ajustadas para garantizar piezas perfectas.
              </p>
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-semibold mb-2">Diseño Personalizado</h3>
              <p className="text-gray-600">
                Desarrollamos soluciones a la medida de tu proyecto industrial.
              </p>
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-semibold mb-2">Tiempo de Entrega Eficiente</h3>
              <p className="text-gray-600">
                Comprometidos con cumplir plazos sin sacrificar calidad.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Nuestra Filosofía */}
      <section className="bg-mydilsa-light py-16 px-6 mb-32">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-2xl sm:text-3xl font-bold mb-10">Nuestra Filosofía</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mt-10 text-left">
            <div>
              <h2 className="text-xl font-bold mb-2">Misión</h2>
              <p className="text-base sm:text-lg text-gray-700">
                Somos una empresa unida y creativa orientada a proporcionar a nuestros clientes, productos y
                servicios con un alto nivel de calidad satisfaciendo sus necesidades y expectativas.
              </p>
            </div>
            <div>
              <h2 className="text-xl font-bold mb-2">Visión</h2>
              <p className="text-base sm:text-lg text-gray-700">
                Ser una empresa competitiva y líder a nivel nacional en la industria que participamos,
                certificada por instituciones reconocidas a nivel mundial, buscando siempre estar a la
                vanguardia tecnológica.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
