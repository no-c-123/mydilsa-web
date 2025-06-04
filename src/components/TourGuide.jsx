import { useEffect, useState } from 'react';

const steps = [
  { selector: '.select-selected', message: 'Activa el transformador para mover, rotar o escalar.' }, // this targets the "Abrir Transform"
  { selector: '#resetTransformBtn', message: 'Reinicia la posición del objeto al valor por defecto.' },
  { selector: '#clearSelectionBtn', message: 'Haz clic aquí para deseleccionar todo.' },
  { selector: '#snapToggleBtn', message: 'Activa o desactiva el snap a la cuadrícula.' },
  { selector: '#selectedCenterBtn', message: 'Céntrate automáticamente en el objeto.' },
  { selector: '#toggleTransformControlsBtn', message: 'Muestra u oculta los ejes de transformación.' },
  { selector: '#addPieceBtn', message: 'Haz clic aquí para agregar piezas.' },
  { selector: '#deleteObjectBtn', message: 'Elimina el objeto seleccionado.' },
  { selector: '#exportBtn', message: 'Usa este botón para exportar tu modelo.' }
];

export default function TourGuide() {
  const [step, setStep] = useState(0);
  const [visible, setVisible] = useState(true);
  const [pos, setPos] = useState({ top: 0, left: 0 });

  useEffect(() => {
    if (!visible) return;
    const target = document.querySelector(steps[step].selector);
    if (target) {
      const updatePos = () => {
        const rect = target.getBoundingClientRect();
        setPos({ top: rect.bottom + window.scrollY + 10, left: rect.left + window.scrollX });
      };
      updatePos();
      target.scrollIntoView({ behavior: 'smooth', block: 'center' });
      target.classList.add('tour-highlight');
      window.addEventListener('resize', updatePos);
      return () => {
        target.classList.remove('tour-highlight');
        window.removeEventListener('resize', updatePos);
      };
    }
  }, [step, visible]);

  if (!visible) return null;

  const next = () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      setVisible(false);
    }
  };

  const skip = () => {
    setVisible(false);
  }

  return (
    <div className="tour-overlay">
      <div className="tour-card" style={{ top: pos.top, left: pos.left }}>
        <p>{steps[step].message}</p>
        <div className="text-right mt-2">
          <button
            onClick={skip}
            className="bg-blue-500 text-white px-2 py-1 rounded mr-2"
          >
              {step < steps.length + 8 && 'Omitir'}
          </button>
          <button
            className="bg-blue-500 text-white px-2 py-1 rounded"
            onClick={next}
          >
            {step < steps.length - 1 ? 'Siguiente' : 'Cerrar'}
          </button>
        </div>
      </div>
    </div>
  );
}
