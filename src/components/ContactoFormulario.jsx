import '../styles/ContactoFormulario.css'; // ← you'll need to create this CSS file

export default function ContactoFormulario() {
    return (
      <section className="bg-white py-24 px-6 mx-auto grid grid-cols-2">
        <section className="ml-40 w-full max-w-2xl space-y-12">
        <h1 className='text-3xl'>Si tienes dudas, envia un correo.</h1>
          {/* Nombre */}
          <div className="wave-group w-full">
            <input required type="text" className="input w-full" />
            <span className="bar"></span>
            <label className="label">
              {'Nombre'.split('').map((char, i) => (
                <span key={i} className="label-char" style={{ '--index': i }}>
                  {char}
                </span>
              ))}
            </label>
          </div>
  
          {/* Correo */}
          <div className="wave-group w-full">
            <input required type="email" className="input w-full" />
            <span className="bar"></span>
            <label className="label">
              {'Correo'.split('').map((char, i) => (
                <span key={i} className="label-char" style={{ '--index': i }}>
                  {char}
                </span>
              ))}
            </label>
          </div>
  
          {/* Mensaje */}
          <div className="wave-group w-full">
            <textarea required rows="5" className="input w-full" />
            <span className="bar"></span>
            <label className="label">
              {'Mensaje'.split('').map((char, i) => (
                <span key={i} className="label-char" style={{ '--index': i }}>
                  {char}
                </span>
              ))}
            </label>
          </div>
  
          <div className="text-center">
            <button
              type="submit"
              className="bg-mydilsa-accent text-white px-8 py-3 rounded-md font-semibold shadow hover:bg-mydilsa-dark transition"
            >
              Enviar mensaje
            </button>
          </div>
        </section>

        <section className='w-full'>
          <h1 className='text-3xl flex justify-center'>O contacta a la oficina directamente.</h1>
          <div className='flex justify-center'>
            <p>
                Correo:<a href="mailto:ventas1@mydilsa.com"> ventas1@mydilsa.com</a>
            </p>
          </div>
          <div className='flex justify-center'>
            <p>
                Teléfono: <a href="tel:+528183868291"> (81) 8386-8291 </a>
            </p>
          </div>
        </section>
      </section>
    );
}
