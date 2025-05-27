export default function ResumenMateriales() {
    const materiales = [
      {
        title: "PTR Cuadrado",
        desc: "Tubos estructurales cuadrados, ideales para estructuras metálicas.",
      },
      {
        title: "PTR Redondo",
        desc: "Tubos redondos para herrería, postes y refuerzos.",
      },
      {
        title: "Placa / Lámina",
        desc: "Hojas planas de acero para cortes CNC y recubrimientos.",
      },
      {
        title: "Solera",
        desc: "Barras planas de acero para refuerzos y fabricación.",
      },
      {
        title: "Tubo",
        desc: "Tubo metálico con aplicaciones estructurales e hidráulicas.",
      },
    ];
  
    return (
      <section className="bg-gray-950 text-white py-20">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-8">Materiales Disponibles</h2>
          <p className="text-gray-400 mb-12 max-w-3xl mx-auto">
            Estos son los principales productos que puedes cotizar con nosotros. Cada uno tiene aplicaciones distintas y se adapta a las necesidades de tu proyecto.
          </p>
  
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {materiales.map((mat, index) => (
              <div
                key={index}
                className="bg-white/5 rounded-xl p-6 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition"
              >
                <h3 className="text-xl font-semibold mb-2">{mat.title}</h3>
                <p className="text-gray-300">{mat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }
  