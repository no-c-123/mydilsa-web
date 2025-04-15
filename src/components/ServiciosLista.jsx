export default function ServiciosLista() {
    const servicios = [
      {
        title: 'Maquinado CNC',
        desc: 'Fresado y torneado CNC de alta precisión para componentes metálicos y plásticos.',
        icon: '🛠️',
      },
      {
        title: 'Diseño CAD',
        desc: 'Modelado 3D y planos técnicos listos para manufactura.',
        icon: '📐',
      },
      {
        title: 'Prototipado Rápido',
        desc: 'Desarrollo de prototipos funcionales para validar diseños antes de producción.',
        icon: '🚀',
      },
      {
        title: 'Soldadura y Ensamble',
        desc: 'Servicios de soldadura y armado para soluciones completas llave en mano.',
        icon: '🔩',
      },
    ];
  
    return (
      <section className="bg-white py-24 px-6 min-h-[80vh]">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12">
          {servicios.map((srv, idx) => (
            <div
              key={idx}
              className="p-6 border rounded-xl hover:shadow-lg transition-all duration-300 bg-white"
            >
              <div className="text-4xl mb-4">{srv.icon}</div>
              <h3 className="text-2xl font-bold text-mydilsa-dark mb-2">{srv.title}</h3>
              <p className="text-gray-700 text-base leading-relaxed">{srv.desc}</p>
            </div>
          ))}
        </div>
      </section>
    );
  }
  