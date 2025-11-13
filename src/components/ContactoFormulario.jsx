import '../styles/ContactoFormulario.css';
import { useRef, useEffect, useState } from 'react';
import emailjs from '@emailjs/browser';


export default function ContactoFormulario() {
  
  const form = useRef();
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userMessage, setUserMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState({ type: '', message: '' });

  // Initialize EmailJS with public key
  useEffect(() => {
    // IMPORTANT: You need to get your EmailJS Public Key from:
    // https://dashboard.emailjs.com/admin/account
    // 
    // The Public Key is different from your User ID.
    // Replace the value below with your actual Public Key.
    // 
    // Option 1: Use environment variable (recommended for production)
    // const publicKey = import.meta.env.PUBLIC_EMAILJS_PUBLIC_KEY || 'YOUR_PUBLIC_KEY';
    // emailjs.init(publicKey);
    //
    // Option 2: Directly set it here (for development)
    // TODO: Replace '4N3fYRT40a_qjMe25' with your actual EmailJS Public Key
    emailjs.init('4N3fYRT40a_qjMe25');
  }, []);

  const sendEmail = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus({ type: '', message: '' });

    try {
      const result = await emailjs.send(
        'service_ooktfnw',
        'template_3eftr76',
        {
          from_name: userName,
          from_email: userEmail,
          message: userMessage,
        }
      );

      console.log('Email sent successfully:', result.text);
      setSubmitStatus({ type: 'success', message: '¡Mensaje enviado con éxito!' });
      
      // Reset form
      setUserName('');
      setUserEmail('');
      setUserMessage('');
      
    } catch (error) {
      console.error('Error sending email:', error);
      setSubmitStatus({ 
        type: 'error', 
        message: 'Error al enviar el mensaje. Por favor, intenta de nuevo.' 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contacto" className="bg-white py-24 px-4 sm:px-6 mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 scroll-smooth duration-300">
      {/* Formulario */}
      <section className="space-y-12 border rounded-lg shadow-md p-6 bg-gray-50 w-full">
        <h1 className='text-2xl sm:text-3xl'>Si tienes dudas, envía un correo.</h1>

        <form ref={form} onSubmit={sendEmail} className="space-y-10">
          {/* Status Message */}
          {submitStatus.message && (
            <div className={`p-4 rounded-md ${
              submitStatus.type === 'success' 
                ? 'bg-green-100 text-green-800 border border-green-300' 
                : 'bg-red-100 text-red-800 border border-red-300'
            }`}>
              {submitStatus.message}
            </div>
          )}

          {/* Nombre */}
          <div className="wave-group w-full">
            <input
              id="from_name"
              required
              type="text"
              name="from_name"
              className="input w-full"
              value={userName}
              onChange={e => setUserName(e.target.value)}
              aria-label="Nombre"
            />
            <span className="bar"></span>
            <label htmlFor="from_name" className="label">
              {'Nombre'.split('').map((char, i) => (
                <span key={i} className="label-char" style={{ '--index': i }}>{char}</span>
              ))}
            </label>
          </div>

          {/* Correo */}
          <div className="wave-group w-full">
            <input
              id="from_email"
              required
              type="email"
              name="from_email"
              className="input w-full"
              value={userEmail}
              onChange={e => setUserEmail(e.target.value)}
              aria-label="Correo electrónico"
            />
            <span className="bar"></span>
            <label htmlFor="from_email" className="label">
              {'Correo'.split('').map((char, i) => (
                <span key={i} className="label-char" style={{ '--index': i }}>{char}</span>
              ))}
            </label>
          </div>

          {/* Mensaje */}
          <div className="wave-group w-full">
            <textarea 
              id="message"
              required 
              rows="5" 
              name="message" 
              className="input w-full" 
              value={userMessage} 
              onChange={e => setUserMessage(e.target.value)}
              aria-label="Mensaje"
            />
            <span className="bar"></span>
            <label htmlFor="message" className="label">
              {'Mensaje'.split('').map((char, i) => (
                <span key={i} className="label-char" style={{ '--index': i }}>{char}</span>
              ))}
            </label>
          </div>

          {/* Archivo */}
          <div className="w-full relative">
            <label htmlFor="attachment" className="block font-medium mb-2 text-gray-700">Adjunta un archivo de referencia</label>
            <div className="border-2 border-dashed border-gray-400 rounded-lg p-6 flex flex-col items-center justify-center text-center bg-white hover:bg-gray-50 transition relative cursor-pointer">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-12">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0 3 3m-3-3-3 3M6.75 19.5a4.5 4.5 0 0 1-1.41-8.775 5.25 5.25 0 0 1 10.233-2.33 3 3 0 0 1 3.758 3.848A3.752 3.752 0 0 1 18 19.5H6.75Z" />
              </svg>
              <p className="text-sm text-gray-600">Arrastra un archivo aquí o haz clic para subirlo</p>
              <input id="attachment" type="file" name="attachment" accept="image/*,.pdf" className="absolute inset-0 opacity-0 cursor-pointer" aria-label="Adjuntar archivo" />
            </div>
          </div>

          {/* Botón */}
          <div className="text-center">
            <button 
              type="submit" 
              disabled={isSubmitting}
              className={`bg-mydilsa-accent text-white px-8 py-3 rounded-md font-semibold shadow transition ${
                isSubmitting 
                  ? 'opacity-50 cursor-not-allowed' 
                  : 'hover:bg-mydilsa-dark'
              }`}
            >
              {isSubmitting ? 'Enviando...' : 'Enviar mensaje'}
            </button>
          </div>
        </form>
      </section>

      {/* Información de contacto */}
      <section className="border rounded-lg shadow-md p-6 bg-gray-50 w-full flex flex-col items-center text-center space-y-4">
        <h1 className="text-2xl sm:text-3xl font-semibold">O contacta a la oficina directamente.</h1>
        <div>
          <p className="text-lg">📧 <a href="mailto:ventas1@mydilsa.com" className="text-blue-600 hover:underline">ventas1@mydilsa.com</a></p>
          <p className="text-lg">📞 <a href="tel:+528111253156" className="text-blue-600 hover:underline">(81) 1125-3156</a></p>
        </div>
        <div className="text-gray-600">
          <p>📍 Carr. Libre Federal Apodaca -Villa Juárez #200, Col. Campestre Huinalá.</p>
          <p>🕒 Lunes a Viernes, 8:00 AM – 6:30 PM</p>
        </div>
        <div className="w-full h-64 rounded-lg overflow-hidden shadow">
        </div>
      </section>
    </section>
  );
}
