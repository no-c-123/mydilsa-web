import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

export default function QuoteForm() {
  const [formData, setFormData] = useState({
    nombre_cliente: '',
    correo_cliente: '',
    tipo_pieza: '',
    material: '',
    largo: '',
    ancho: '',
    espesor: '',
    acabado: '',
    cantidad: 1,
    notas_adicionales: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { error } = await supabase.from('cotizaciones').insert([formData]);
    if (error) {
      alert('Error al guardar la cotización');
      console.error(error.message);
    } else {
      alert('Cotización enviada correctamente ✅');
    }
  };

  return (
    <section className="max-w-3xl mx-auto p-8 mt-12 bg-mydilsa-light text-mydilsa-dark rounded-xl shadow-xl">
      <h2 className="text-3xl font-bold mb-6 text-center">Solicitud de Cotización</h2>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid md:grid-cols-2 gap-4">
          <input name="nombre_cliente" placeholder="Nombre completo" onChange={handleChange} className="input" required />
          <input name="correo_cliente" placeholder="Correo electrónico" onChange={handleChange} className="input" required />
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          <input name="tipo_pieza" placeholder="Tipo de pieza" onChange={handleChange} className="input" required />
          <select name="material" onChange={handleChange} className="input" required>
            <option value="">Material</option>
            <option>Acero</option>
            <option>Aluminio</option>
            <option>Plástico</option>
          </select>
          <input name="acabado" placeholder="Acabado" onChange={handleChange} className="input" />
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          <input name="largo" placeholder="Largo (mm)" onChange={handleChange} className="input" required />
          <input name="ancho" placeholder="Ancho (mm)" onChange={handleChange} className="input" required />
          <input name="espesor" placeholder="Espesor (mm)" onChange={handleChange} className="input" required />
        </div>

        <div>
          <input name="cantidad" type="number" placeholder="Cantidad" onChange={handleChange} className="input" min="1" required />
        </div>

        <div>
          <textarea name="notas_adicionales" placeholder="Notas adicionales (opcional)" onChange={handleChange} className="input" rows="3" />
        </div>

        <button type="submit" className="w-full bg-mydilsa-accent text-white py-3 px-6 rounded-md hover:bg-mydilsa-steel transition">
          Enviar Cotización
        </button>
      </form>
    </section>
  );
}
