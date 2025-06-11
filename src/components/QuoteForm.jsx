import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ModelPreview3D } from './ModelPreview';

// Example model templates (replace with your real data or fetch from DB)
const MODEL_TEMPLATES = [
  {
    id: 1,
    nombre: 'Mesa básica',
    tipo_pieza: 'Mesa',
    material: 'Acero',
    largo: '1000',
    ancho: '600',
    espesor: '20',
    acabado: 'Pintura',
    cantidad: 1,
    notas_adicionales: 'Modelo clásico de mesa.',
    modelUrl: '/modelos/mesa.gltf', // Update with your actual model path if available
  },
  {
    id: 2,
    nombre: 'Barandal estándar',
    tipo_pieza: 'Barandal',
    material: 'Aluminio',
    largo: '2000',
    ancho: '100',
    espesor: '10',
    acabado: 'Anodizado',
    cantidad: 1,
    notas_adicionales: 'Barandal para escaleras.',
    modelUrl: '/modelos/barandal.gltf',
  },
  // Add more templates as needed
];

export default function QuoteForm() {
  const [modalModel, setModalModel] = useState(null);

  const openModal = (model) => setModalModel(model);
  const closeModal = () => setModalModel(null);

  const handleUsar = () => {
    window.location.href = `/estimate?modelId=${modalModel.id}`;
  };

  const handleEditar = () => {
    window.location.href = `/3d?modelId=${modalModel.id}`;
  };

  return (
    <section className="max-w-5xl mx-auto p-8 mt-12">
      <h2 className="text-3xl font-bold mb-6 text-center">Elige un modelo para cotizar</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-10">
        {MODEL_TEMPLATES.map((template) => (
          <motion.div
            key={template.id}
            layoutId={`card-${template.id}`}
            className="rounded-xl shadow-md p-6 bg-white flex flex-col items-center border border-gray-200 hover:shadow-lg transition cursor-pointer"
            onClick={() => openModal(template)}
            whileHover={{ scale: 1.03 }}
          >
            {template.modelUrl ? (
              <ModelPreview3D modelUrl={template.modelUrl} width={120} height={120} />
            ) : (
              <div className="w-20 h-20 bg-gray-200 flex items-center justify-center mb-4 rounded">
                <span className="text-gray-400">Sin vista previa</span>
              </div>
            )}
            <h3 className="font-semibold text-lg mb-1">{template.nombre}</h3>
            <p className="text-gray-500 text-sm mb-4">{template.tipo_pieza} - {template.material}</p>
            <button
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
              onClick={e => { e.stopPropagation(); openModal(template); }}
            >
              Más información
            </button>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {modalModel && (
          <>
            {/* Blurred background overlay */}
            <motion.div
              className="fixed inset-0 z-[100] bg-black/30 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeModal}
              aria-label="Cerrar modal"
            />
            {/* Flex centering container */}
            <div className="fixed inset-0 z-[110] flex items-center justify-center">
              <motion.div
                className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-md max-h-[90vh] overflow-y-auto relative"
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.97 }}
                transition={{ duration: 0.25 }}
                tabIndex={-1}
                onKeyDown={e => e.key === 'Escape' && closeModal()}
                role="dialog"
                aria-modal="true"
              >
                <button
                  className="absolute top-3 right-4 text-2xl text-gray-400 hover:text-gray-700"
                  onClick={closeModal}
                  aria-label="Cerrar"
                >
                  ×
                </button>
                <div className="flex flex-col items-center">
                  {modalModel.modelUrl ? (
                    <ModelPreview3D modelUrl={modalModel.modelUrl} width={180} height={180} />
                  ) : (
                    <div className="w-24 h-24 bg-gray-200 flex items-center justify-center mb-4 rounded">
                      <span className="text-gray-400">Sin vista previa</span>
                    </div>
                  )}
                  <h3 className="text-2xl font-bold mb-2">{modalModel.nombre}</h3>
                  <p className="mb-2 text-gray-600">{modalModel.tipo_pieza} - {modalModel.material}</p>
                  <ul className="mb-4 text-gray-700 text-sm w-full">
                    <li><b>Largo:</b> {modalModel.largo} mm</li>
                    <li><b>Ancho:</b> {modalModel.ancho} mm</li>
                    <li><b>Espesor:</b> {modalModel.espesor} mm</li>
                    <li><b>Acabado:</b> {modalModel.acabado}</li>
                    <li><b>Cantidad:</b> {modalModel.cantidad}</li>
                    <li><b>Notas:</b> {modalModel.notas_adicionales}</li>
                  </ul>
                  <div className="flex gap-4 mt-2">
                    <button
                      className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                      onClick={handleUsar}
                    >
                      Usar
                    </button>
                    <button
                      className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400 transition"
                      onClick={handleEditar}
                    >
                      Editar medidas/material
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    </section>
  );
}