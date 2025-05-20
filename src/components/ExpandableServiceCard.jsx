import { useState, useRef, useEffect } from "react";

export default function ExpandableServiceCard({ title, desc, icon, fullContent }) {
  const [isOpen, setIsOpen] = useState(false);
  const [animating, setAnimating] = useState(false);
  const cardRef = useRef(null);
  const [initialPosition, setInitialPosition] = useState(null);
  const [closing, setClosing] = useState(false);

  const handleOpen = () => {
    const rect = cardRef.current.getBoundingClientRect();
    setInitialPosition({
      top: rect.top + window.scrollY,
      left: rect.left + window.scrollX,
      width: rect.width,
      height: rect.height,
    });
    setAnimating(true);
    requestAnimationFrame(() => {
      setIsOpen(true);
    });
  };

  const handleClose = () => {
    setClosing(true);
    setIsOpen(false);
    setTimeout(() => {
      setAnimating(false);
      setClosing(false);
    }, 700);
  };

  useEffect(() => {
    if (isOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && isOpen && handleClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen]);

  const floatingStyle = {
    position: "fixed",
    top: isOpen ? "50%" : `${initialPosition?.top}px`,
    left: isOpen ? "50%" : `${initialPosition?.left}px`,
    width: isOpen
      ? window.innerWidth < 640
        ? "90vw"
        : "40rem"
      : `${initialPosition?.width}px`,
    height: isOpen
      ? window.innerWidth < 640
        ? "90vh"
        : "80vh"
      : `${initialPosition?.height}px`,
    transform: isOpen ? "translate(-50%, -50%)" : "none",
    zIndex: 50,
    backgroundColor: "white",
    padding: "1.5rem",
    overflowY: "auto",
    borderRadius: "1rem",
    transition: "all 0.7s ease-in-out",
    border: "1px solid #e5e7eb",
  };

  return (
    <>
      {animating && (
        <div
          onClick={handleClose}
          className={`fixed inset-0 z-40 bg-black/30 backdrop-blur-lg transition-all duration-700 ease-in-out`}
          style={{
            opacity: isOpen ? 1 : 0,
            pointerEvents: isOpen ? "auto" : "none",
          }}
        />
      )}

      <div
        ref={cardRef}
        onClick={handleOpen}
        className="p-6 border w-full max-w-[40rem] h-40 sm:h-[20vh] rounded-xl hover:shadow-lg cursor-pointer bg-white transition-all duration-300"
        style={{ visibility: animating ? "hidden" : "visible" }}
      >
        <div className="text-4xl mb-4">{icon}</div>
        <h3 className="text-2xl font-bold text-mydilsa-dark mb-2">{title}</h3>
        <p className="text-gray-700 leading-relaxed">{desc}</p>
      </div>

      {animating && initialPosition && (
        <div style={floatingStyle} className="shadow-xl">
          <div className="text-4xl mb-4">{icon}</div>
          <h3 className="text-2xl font-bold text-mydilsa-dark mb-2">{title}</h3>
          <p className="text-gray-700 leading-relaxed mb-6">{fullContent}</p>

          {isOpen && (
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 text-sm px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-md"
            >
              Cerrar
            </button>
          )}

          {title === "Diseño CAD" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
              <div className="flex items-center justify-center">
                <img
                  src="/servicios/cad1.jpg"
                  alt="Diseño CAD"
                  className="w-full h-auto max-h-40 object-contain rounded-lg"
                />
              </div>
              <div className="flex items-center justify-center">
                <img
                  src="/servicios/CATIA-LOGO.webp"
                  alt="Diseño CAD"
                  className="w-full h-auto max-h-40 object-contain rounded-lg"
                />
              </div>
              <ul className="list-disc pl-5 space-y-1 text-gray-700 text-base w-max mt-5">
                <li>Planos Listos para manufactura</li>
                <li>Modelado 3D paramétrico</li>
                <li>Archivos compatibles con CATIA</li>
              </ul>
            </div>
          )}

          {title === "Maquinado CNC" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
              <div className="flex items-center justify-center">
                <img
                  src="/servicios/cnc1.png"
                  alt="Maquinado CNC"
                  className="w-full h-auto max-h-40 object-contain rounded-lg"
                />
              </div>
              <div className="flex items-center justify-center">
                <img
                  src="/servicios/cnc2.webp"
                  alt="Maquinado CNC"
                  className="w-full h-auto max-h-56 object-contain rounded-lg"
                />
              </div>
              <ul className="list-disc pl-5 space-y-1 text-gray-700 text-base w-max mt-5">
                <li>Tornos CNC de precisión ideal</li>
                <li>Centros de Maquinado Multieje</li>
                <li>Control de Calidad Dimensional</li>
              </ul>
            </div>
          )}

          {title === "Soldadura y Ensamble" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
              <div className="flex items-center justify-center">
                <img
                  src="/servicios/soldadura1.png"
                  alt="Soldadura y Ensamble"
                  className="w-full h-auto rounded-lg shadow-lg"
                />
              </div>
              <div className="flex items-center justify-center">
                <img
                  src="/servicios/soldadura2.png"
                  alt="Soldadura y Ensamble"
                  className="w-full h-auto rounded-lg shadow-lg"
                />
              </div>
              <ul className="list-disc pl-5 space-y-1 text-gray-700 text-base w-max mt-5">
                <li>Soldadura MIG/TIG Especializada</li>
                <li>Ensambles Mecánicos de Alta Precisión</li>
                <li>Montajes Llave en Mano</li>
              </ul>
            </div>
          )}

          {title === "Prototipado Rápido" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
              <div className="flex items-center justify-center">
                <img
                  src="/servicios/impresion1.png"
                  alt="Impresión 3D"
                  className="w-full h-auto rounded-lg"
                />
              </div>
              <div className="flex items-center justify-center">
                <img
                  src="/servicios/impresion2.png"
                  alt="Impresión 3D"
                  className="w-full h-auto rounded-lg"
                />
              </div>
              <ul className="list-disc pl-5 space-y-1 text-gray-700 text-base w-max mt-5">
                <li>Impresión 3D Funcional</li>
                <li>Maquinado Provisional en Plásticos</li>
                <li>Evaluación y Corrección de Diseño</li>
              </ul>
            </div>
          )}
        </div>
      )}
    </>
  );
}
