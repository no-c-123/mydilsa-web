export default function Features() {
    return (
      <section className="min-h-[50vh] bg-mydilsa-light py-16 px-6">
        <div className="max-w-7xl mx-auto text-center ">
          <h2 className="text-3xl font-bold text-mydilsa-dark mb-10">¿Por qué elegir a Mydilsa?</h2>
          <div className="grid md:grid-cols-3 gap-10 text-left">
            <div>
              <h3 className="text-xl font-semibold mb-2">Precisión CNC</h3>
              <p className="text-gray-600">
                Trabajamos con tolerancias ajustadas para garantizar piezas perfectas.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">Diseño Personalizado</h3>
              <p className="text-gray-600">
                Desarrollamos soluciones a la medida de tu proyecto industrial.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">Tiempo de Entrega Eficiente</h3>
              <p className="text-gray-600">
                Comprometidos con cumplir plazos sin sacrificar calidad.
              </p>
            </div>
          </div>
        </div>
      </section>
    );
}
  