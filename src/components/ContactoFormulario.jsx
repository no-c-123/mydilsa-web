import '../styles/ContactoFormulario.css';
import { useRef } from 'react';
import emailjs from '@emailjs/browser';

export default function ContactoFormulario() {
  const form = useRef();

  const sendEmail = (e) => {
    e.preventDefault();

    emailjs.sendForm(
      'service_m804eco',             // Your EmailJS service ID
      'template_3eftr76',            // Your EmailJS template ID
      form.current,
      '4N3fYRT40a_qjMe25'            // Your EmailJS public key
    )
    .then(() => {
      alert('Mensaje enviado con éxito');
      form.current.reset();
    }, (error) => {
      alert('Hubo un error al enviar el mensaje, intenta de nuevo');
      console.log(error);
    });
  };

  return (
    <section className="bg-white py-24 px-6 mx-auto grid grid-cols-2 gap-10">
      
      {/* Formulario */}
      <section className="ml-10 max-w-[100%] space-y-12 border rounded-lg shadow-md p-6 bg-gray-50">
        <h1 className='text-3xl'>Si tienes dudas, envía un correo.</h1>
        
        <form ref={form} onSubmit={sendEmail} className="space-y-10">
          
          {/* Nombre */}
          <div className="wave-group w-full">
            <input required type="text" name="from_name" className="input w-full" />
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
            <input required type="email" name="from_email" className="input w-full" />
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
            <textarea required rows="5" name="message" className="input w-full" />
            <span className="bar"></span>
            <label className="label">
              {'Mensaje'.split('').map((char, i) => (
                <span key={i} className="label-char" style={{ '--index': i }}>
                  {char}
                </span>
              ))}
            </label>
          </div>

          {/* Botón */}
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

      {/* Contact Info + Mapa */}
      <section className="w-full border rounded-lg shadow-md p-6 bg-gray-50 mr-10 flex flex-col items-center text-center space-y-4">
        <h1 className="text-3xl font-semibold">O contacta a la oficina directamente.</h1>

        <div>
          <p className="text-lg">
            📧 <a href="mailto:ventas1@mydilsa.com" className="text-blue-600 hover:underline">ventas1@mydilsa.com</a>
          </p>
          <p className="text-lg">
            📞 <a href="tel:+528111253156" className="text-blue-600 hover:underline">(81) 1125-3156</a>
          </p>
        </div>

        <div className="text-gray-600">
          <p>📍 Carr. Libre Federal Apodaca -Villa Juárez #200, Col. Campestre Huinalá.</p>
          <p>🕒 Lunes a Viernes, 8:00 AM – 6:30 PM</p>
        </div>

        <div className="w-full h-64 rounded-lg overflow-hidden shadow">
          <iframe
            className="w-full h-full"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3594.4060724545393!2d-100.14433922378018!3d25.72408161015696!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8662ea594adccfe5%3A0xb6fbf19e18c59ee9!2sMaquinado%20y%20dise%C3%B1o%20industrial%20Leal!5e0!3m2!1ses-419!2smx!4v1745080159788!5m2!1ses-419!2smx"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
          />
        </div>
      </section>
    </section>
  );
}
