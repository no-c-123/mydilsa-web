import React from 'react';

export default function CallToAction() {
    return (
      <section className="bg-white min-h-[70vh] py-16 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-12">
          {/* Text + CTA */}
          <div className="max-w-xl text-center md:text-left">
            <h2 className="text-3xl font-bold text-mydilsa-dark mb-4">
              ¿Listo para comenzar tu próximo proyecto industrial?
            </h2>
            <p className="text-lg text-gray-700 mb-6">
              En Mydilsa te ofrecemos un servicio completo de diseño, maquinado y fabricación con altos estándares de calidad.
            </p>
            <a
              href="/contacto"
              className="inline-block bg-mydilsa-accent text-white px-6 py-3 rounded-md font-semibold shadow hover:bg-mydilsa-dark transition"
            >
              Contáctanos
            </a>
          </div>
  
          {/* Benefits List */}
          <ul className="text-left space-y-4 text-gray-700 text-base">
            <li>✔️ Asesoría técnica gratuita en la primera consulta</li>
            <li>✔️ Entregas puntuales y procesos controlados</li>
            <li>✔️ Materiales y acabados de alta durabilidad</li>
            <li>✔️ Apoyo en diseño CAD para prototipado</li>
          </ul>
        </div>
      </section>
    );
}
  