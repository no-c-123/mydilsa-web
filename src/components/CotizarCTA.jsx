export default function CotizarCTA() {
    return (
      <div className="relative z-10 py-20 overflow-hidden bg-black text-white">
        {/* Blurred background layer */}
        <div className="absolute inset-0 bg-gradient-to-br from-neutral-900 to-gray-700 opacity-80 blur-md" />
  
        {/* Content */}
        <div className="relative z-20 max-w-4xl mx-auto text-center px-6">
          <h2 className="text-4xl font-bold mb-4">¿Listo para cotizar?</h2>
          <p className="mb-6 text-lg text-gray-300">
            Comienza tu proyecto hoy mismo con una cotización personalizada.
          </p>
          <a
            href="/form"
            className="inline-block bg-white text-black px-8 py-3 rounded-lg font-semibold hover:bg-gray-200 transition"
          >
            Iniciar Cotización
          </a>
        </div>
      </div>
    );
  }
  