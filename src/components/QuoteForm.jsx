import { useState } from "react";
import { tipos, materialData, getCompatibleMaterials } from "../data/quoteData";

const steps = ["intro", "tipo", "material", "medidas", "resumen"];

export default function QuoteForm() {
  const [stepIndex, setStepIndex] = useState(0);
  const [tipo, setTipo] = useState("");
  const [material, setMaterial] = useState("");
  const [espesor, setEspesor] = useState("");
  const [ancho, setAncho] = useState("");
  const [largo, setLargo] = useState("");
  const [precio, setPrecio] = useState(null);

  const next = () => setStepIndex((prev) => Math.min(prev + 1, steps.length - 1));
  const back = () => setStepIndex((prev) => Math.max(prev - 1, 0));

  return (
    <section className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-gray-100 to-gray-300 px-6 py-16 relative overflow-hidden">
      {/* Header */}
      <div className="w-full max-w-3xl flex items-center justify-between mb-6 px-2">
        {stepIndex > 0 ? (
          <button
            onClick={back}
            className="text-gray-600 hover:text-black transition text-lg"
          >
            ← Atrás
          </button>
        ) : <div />}
        <div className="text-sm text-gray-700 font-medium italic">
          {tipo && `Tipo: ${tipo}`} {material && `| Material: ${material}`}
        </div>
        <div style={{ width: "60px" }} />
      </div>

      {/* Steps sliding container */}
      <div className="relative w-full max-w-3xl h-[600px] overflow-hidden rounded-xl bg-white shadow-md">
        <div
          className="flex flex-col transition-transform duration-700 ease-in-out"
          style={{ transform: `translateY(-${stepIndex * 20}%)` }}
        >

          {/* Intro */}
          <div className="h-[600px] flex flex-col items-center justify-center px-6 text-center gap-6">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800">¿Quieres cotizar?</h1>
            <button
              onClick={next}
              className="bg-gray-600 text-white px-6 py-3 rounded-full text-lg font-semibold hover:bg-gray-800 transition"
            >
              Empieza a cotizar
            </button>
          </div>

          {/* Tipo */}
          <div className="h-[600px] flex flex-col items-center justify-center px-6 text-center gap-6">
            <h2 className="text-2xl font-semibold text-gray-800">Selecciona un tipo de perfil</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {tipos.map((t, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setTipo(t);
                    setMaterial("");
                    next();
                  }}
                  className="bg-gray-800/20 text-black px-6 py-2 rounded-lg hover:scale-105 transition"
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Material */}
          <div className="h-[600px] flex flex-col items-center justify-center px-6 text-center gap-6">
            <h2 className="text-2xl font-semibold text-gray-800">Elige el material</h2>
            <div className="grid grid-cols-2 sm:grid-cols-2 gap-4">
              {getCompatibleMaterials(tipo).length > 0 ? (
                getCompatibleMaterials(tipo).map((m, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      setMaterial(m);
                      next();
                    }}
                    className="bg-gray-800/20 text-black px-6 py-2 rounded-lg hover:text-green-400 transition"
                  >
                    {m}
                  </button>
                ))
              ) : (
                <button
                  onClick={() => {
                    setMaterial("Sin especificar");
                    next();
                  }}
                  className="bg-gray-400 text-white px-6 py-3 rounded-lg hover:bg-gray-600 transition"
                >
                  Continuar sin material
                </button>
              )}
            </div>
          </div>

          {/* Medidas */}
          <div className="h-[600px] flex flex-col justify-center items-center px-6 text-left text-gray-800">
            <h2 className="text-2xl font-semibold text-center mb-6">Medidas (pulgadas)</h2>
            <div className="space-y-6 w-full max-w-md">
              {["Espesor / Calibre", "Ancho / Diámetro", "Largo"].map((label, i) => (
                <div key={i}>
                  <label className="block font-medium mb-2">{label}</label>
                  <input
                    type="text"
                    value={i === 0 ? espesor : i === 1 ? ancho : largo}
                    onChange={(e) => {
                      const v = e.target.value;
                      if (i === 0) setEspesor(v);
                      else if (i === 1) setAncho(v);
                      else setLargo(v);
                    }}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-mydilsa-accent"
                  />
                </div>
              ))}
              <div className="pt-6 text-center">
                <button
                  className="bg-mydilsa-accent text-white px-6 py-3 rounded-md font-semibold hover:bg-mydilsa-dark transition"
                  onClick={() => {
                    const e = parseFloat(espesor);
                    const a = parseFloat(ancho);
                    const l = parseFloat(largo);

                    if ([e, a, l].some(v => isNaN(v))) {
                      alert("Por favor, ingresa valores válidos.");
                      return;
                    }

                    const volumen = getVolumen(tipo, e, a, l);
                    if (volumen === null) {
                      alert("Tipo no reconocido.");
                      return;
                    }

                    const mat = materialData[material];
                    if (!mat) {
                      alert("Datos de material no encontrados.");
                      return;
                    }

                    const pesoKg = (volumen * mat.densidad) / 1000;
                    const precioEstimado = (pesoKg * mat.precioKilo).toFixed(2);
                    setPrecio(precioEstimado);
                    next();
                  }}
                >
                  Calcular precio
                </button>
              </div>
            </div>
          </div>

          {/* Resumen */}
          <div className="h-[600px] flex flex-col justify-center items-center px-6 space-y-6 text-center text-gray-800">
            <h2 className="text-3xl font-bold">Valor estimado</h2>
            <div className="text-4xl font-semibold text-mydilsa-dark">
              ${precio} MXN
            </div>
            <p className="text-sm text-gray-600 italic max-w-md">
              *Este valor es aproximado y puede variar dependiendo del tipo de trabajo requerido.*
            </p>
            <div className="flex items-center justify-center gap-4">
              <span className="text-sm font-medium text-gray-700">Ver en:</span>
              <button className="px-4 py-1 border border-gray-400 rounded-full text-sm font-medium hover:bg-gray-300 transition">MXN</button>
              <button className="px-4 py-1 border border-gray-400 rounded-full text-sm font-medium hover:bg-gray-300 transition">USD</button>
            </div>
            <button
              onClick={() => alert("Formulario de contacto próximamente...")}
              className="bg-mydilsa-accent text-white px-6 py-3 rounded-md font-semibold hover:bg-mydilsa-dark transition"
            >
              Continuar
            </button>
          </div>

        </div>
      </div>
    </section>
  );
}
