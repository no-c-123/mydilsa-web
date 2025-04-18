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
    width: isOpen ? "40rem" : `${initialPosition?.width}px`,
    height: isOpen ? "80vh" : `${initialPosition?.height}px`,
    transform: isOpen ? "translate(-50%, -50%)" : "none",
    zIndex: 50,
    backgroundColor: "white",
    padding: "2rem",
    overflowY: "hidden",
    borderRadius: "1rem",
    transition: "all 0.7s ease-in-out",
    border: "1px solid #e5e7eb",
  };

  return (
    <>
      {/* Backdrop */}
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

      {/* Static Card */}
      <div
        ref={cardRef}
        onClick={handleOpen}
        className="p-6 border w-[40rem] h-[20vh] rounded-xl hover:shadow-lg cursor-pointer bg-white transition-all duration-300"
        style={{ visibility: animating ? "hidden" : "visible" }}
      >
        <div className="text-4xl mb-4">{icon}</div>
        <h3 className="text-2xl font-bold text-mydilsa-dark mb-2">{title}</h3>
        <p className="text-gray-700 leading-relaxed">{desc}</p>
      </div>

      {/* Floating Animated Card */}
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
        </div>
      )}
    </>
  );
}
