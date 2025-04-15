export default function ProductosDestacado() {
    return (
      <section className="bg-mydilsa-steel text-white min-h-[80vh] px-6 py-24 flex items-center">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          
          {/* Text Content */}
          <div>
            <h2 className="text-4xl font-bold mb-6">Componentes listos para producción</h2>
            <p className="text-lg mb-6 text-gray-200 leading-relaxed">
              Cada pieza que fabricamos pasa por controles de calidad rigurosos y cumple con tolerancias específicas para su uso inmediato en líneas de producción.
            </p>
            <ul className="space-y-4 text-gray-100 text-base">
              <li>🔩 Tolerancias de hasta ±0.01mm</li>
              <li>📋 Documentación técnica y trazabilidad</li>
              <li>🚚 Entregas empaquetadas para instalación directa</li>
              <li>🧪 Materiales certificados bajo norma</li>
            </ul>
          </div>
  
          {/* Image placeholder */}
          <div className="flex justify-center">
            <img
              src="PiezaMaquinada.webp"
              alt="Pieza mecanizada de precisión"
              className="w-[500px] rounded-lg hover:shadow-2xl transition-all duration-300 ease-in-out"
            />
          </div>
        </div>
      </section>
    );
  }
  