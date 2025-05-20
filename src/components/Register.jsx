import { useState } from "react";
import { supabase } from "../lib/supabaseClient";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    if (!email || !password || !name) {
      setErrorMsg("Por favor completa todos los campos.");
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password: password.trim(),
        options: {
          data: { full_name: name },
        },
      });

      if (error) {
        setErrorMsg("❌ " + error.message);
        setLoading(false);
        return;
      }

      alert("✅ Registro exitoso. Revisa tu correo para confirmar.");
      window.location.href = "/signin";
    } catch (err) {
      setErrorMsg("Error inesperado: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleOAuthLogin = async (provider) => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: window.location.origin,
      },
    });

    if (error) {
      alert("Error al iniciar sesión con Google: " + error.message);
    }
  };

  return (
    <div className="min-h-screen bg-[#d9d9d9] flex items-center justify-center px-4">
      <form
        onSubmit={handleRegister}
        className="relative bg-white shadow-xl p-10 rounded-xl w-full max-w-md space-y-6"
      >
        {/* Back Button */}
        <button
          type="button"
          onClick={() => window.history.back()}
          className="absolute top-4 left-4 text-black hover:text-gray-800"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <h1 className="text-2xl font-bold text-center">Crear cuenta</h1>

        {errorMsg && (
          <p className="text-center text-red-500 font-medium">{errorMsg}</p>
        )}

        <div className="inputbox">
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <span>Nombre completo</span>
          <i></i>
        </div>

        <div className="inputbox">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <span>Correo electrónico</span>
          <i></i>
        </div>

        <div className="inputbox">
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <span>Contraseña</span>
          <i></i>
        </div>

        {/* Divider */}
        <div className="flex items-center gap-2">
          <hr className="flex-grow border-t border-gray-300" />
          <span className="text-sm text-gray-500">o</span>
          <hr className="flex-grow border-t border-gray-300" />
        </div>

        {/* Google Sign-In Button */}
        <button
          type="button"
          onClick={() => handleOAuthLogin("google")}
          className="w-full flex items-center justify-center gap-2 py-2 px-4 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-100 transition"
        >
          <img
            src="https://www.svgrepo.com/show/475656/google-color.svg"
            alt="Google"
            className="w-5 h-5"
          />
          <span className="text-sm text-gray-700 font-medium">
            Registrarse con Google
          </span>
        </button>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-[#666] hover:bg-black text-white font-semibold rounded-lg transition"
        >
          {loading ? "Creando cuenta..." : "Registrarme"}
        </button>

        {/* Already have an account? */}
        <p className="text-center text-sm text-gray-500">
          ¿Ya tienes cuenta?{" "}
          <a
            href="/signin"
            className="text-[#666] font-medium underline hover:text-black"
          >
            Inicia sesión
          </a>
        </p>
      </form>
    </div>
  );
}
