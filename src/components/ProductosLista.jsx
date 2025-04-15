export default function ProductosLista() {
    const productos = [
      {
        title: 'Piezas Torneadas',
        desc: 'Ejes, casquillos, roscas y cilindros elaborados con precisión en torno CNC.',
        icon: '🌀',
      },
      {
        title: 'Piezas Fresadas',
        desc: 'Componentes planos, ranurados o con cavidades para ensambles mecánicos complejos.',
        icon: '⚙️',
      },
      {
        title: 'Prototipos Funcionales',
        desc: 'Modelos físicos de prueba fabricados en materiales industriales para validación técnica.',
        icon: '📦',
      },
      {
        title: 'Ensambles Mecanizados',
        desc: 'Conjuntos de piezas listas para integración, con procesos de soldadura o fijación incluidos.',
        icon: '🛠️',
      },
    ];
  
    return (
      <section className="bg-white py-24 px-6 min-h-[80vh]">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12">
          {productos.map((prod, idx) => (
            <div
              key={idx}
              className="p-6 border rounded-xl hover:shadow-lg transition-all duration-300 bg-white"
            >
              <div className="text-4xl mb-4">{prod.icon}</div>
              <h3 className="text-2xl font-bold text-mydilsa-dark mb-2">{prod.title}</h3>
              <p className="text-gray-700 text-base leading-relaxed">{prod.desc}</p>
            </div>
          ))}
        </div>
      </section>
    );
  }
  