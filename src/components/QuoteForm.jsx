import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';

export default function QuoteForm() {
  const [modelo, setModelo] = useState('');
  const [tipoPago, setTipoPago] = useState('Contado');
  const [ubicacion, setUbicacion] = useState('');
  const [precio, setPrecio] = useState('');
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUserId(data?.user?.id || null);
    };
    fetchUser();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { error } = await supabase.from('cotizaciones').insert({
      user_id: userId,
      modelo,
      tipo_pago: tipoPago,
      ubicacion,
      precio_total: parseFloat(precio),
    });
    if (error) {
      alert('Error al guardar la cotización');
      console.error(error.message);
    } else {
      alert('Cotización guardada exitosamente ✅');
    }
  };

  return (
    <section className="max-w-2xl mx-auto p-8 mt-12 bg-mydilsa-light text-mydilsa-dark rounded-xl shadow-xl">
      <h2 className="text-3xl font-bold mb-6 text-center">Formulario de Cotización</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block mb-1 font-medium text-mydilsa-steel">Modelo</label>
          <input
            type="text"
            className="w-full px-4 py-2 border border-mydilsa-steel rounded-md bg-white"
            value={modelo}
            onChange={(e) => setModelo(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block mb-1 font-medium text-mydilsa-steel">Tipo de Pago</label>
          <select
            className="w-full px-4 py-2 border border-mydilsa-steel rounded-md bg-white"
            value={tipoPago}
            onChange={(e) => setTipoPago(e.target.value)}
          >
            <option value="Contado">Contado</option>
            <option value="Leasing">Leasing</option>
            <option value="Financiamiento">Financiamiento</option>
          </select>
        </div>

        <div>
          <label className="block mb-1 font-medium text-mydilsa-steel">Ubicación</label>
          <input
            type="text"
            className="w-full px-4 py-2 border border-mydilsa-steel rounded-md bg-white"
            value={ubicacion}
            onChange={(e) => setUbicacion(e.target.value)}
          />
        </div>

        <div>
          <label className="block mb-1 font-medium text-mydilsa-steel">Precio estimado</label>
          <input
            type="number"
            step="0.01"
            className="w-full px-4 py-2 border border-mydilsa-steel rounded-md bg-white"
            value={precio}
            onChange={(e) => setPrecio(e.target.value)}
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-mydilsa-accent text-white py-3 px-6 rounded-md hover:bg-mydilsa-steel transition"
        >
          Guardar Cotización
        </button>
      </form>
    </section>
  );
}
