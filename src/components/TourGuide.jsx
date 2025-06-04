import { useEffect, useState } from 'react';

const steps = [
  { selector: '#addPieceBtn', message: 'Haz clic aqu\u00ed para agregar piezas.' },
  { selector: '#exportBtn', message: 'Usa este bot\u00f3n para exportar tu modelo.' }
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

  return (
    <div className="tour-overlay" onClick={next}>
      <div className="tour-card" style={{ top: pos.top, left: pos.left }}>
        <p>{steps[step].message}</p>
        <div className="text-right mt-2">
          <button className="bg-blue-500 text-white px-2 py-1 rounded">
            {step < steps.length - 1 ? 'Siguiente' : 'Cerrar'}
          </button>
        </div>
      </div>
    </div>
  );
}
