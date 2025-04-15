import '../styles/ContactoFormulario.css'; // ← you'll need to create this CSS file

export default function ContactoFormulario() {
    return (
      <section className="bg-white py-24 px-6 flex items-center justify-center">
        <form className="w-full max-w-2xl space-y-12">
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
        </form>
      </section>
    );
}
