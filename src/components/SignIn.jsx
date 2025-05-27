// src/pages/signin.jsx
import { supabase } from "../lib/supabaseClient";
import { useState, useEffect } from "react";
import '../styles/global.css'

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const [role, setRole] = useState(null);

  useEffect(() => {
    const fetchUserRole = async () => {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();
  
      if (user) {
        const { data, error } = await supabase
          .from("profiles") // ✅ use correct table name
          .select("role")
          .eq("id", user.id)
          .single();
  
        if (error) {
          console.error("Error fetching role:", error.message);
        } else if (data) {
          setRole(data.role);
        }
      }
    };
  
    fetchUserRole();
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      alert("Por favor completa todos los campos.");
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password: password.trim(),
    });

    if (error) {
      console.error("Login error:", error);
      alert("Error: " + error.message);
    } else {
      alert("¡Sesión iniciada!");
      window.location.href = "/";
    }

    setLoading(false);
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
      console.error("OAuth error:", error.message);
    }
  };

  return (
    <div className="min-h-screen bg-[#d9d9d9] flex items-center justify-center px-4">
      
      <form
        onSubmit={handleLogin}
        className="bg-white shadow-xl p-10 rounded-xl w-full max-w-md space-y-6"
      >
        <button
          onClick={() => window.history.back()}
          className="absolute  text-black font-semibold "
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 15 3 9m0 0 6-6M3 9h12a6 6 0 0 1 0 12h-3" />
          </svg>

        </button>

        <h1 className="text-2xl font-bold text-center">Iniciar sesión</h1>

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

        <div className="flex items-center gap-2">
          <hr className="flex-grow border-t border-gray-300" />
          <span className="text-sm text-gray-500">o</span>
          <hr className="flex-grow border-t border-gray-300" />
        </div>

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
            Iniciar sesión con Google
          </span>
        </button>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-[#8c8c8c] hover:bg-black text-white font-semibold rounded-lg transition"
        >
          {loading ? "Entrando..." : "Iniciar sesión"}
        </button>

        <p className="text-center text-sm text-gray-500">
          ¿No tienes cuenta?{" "}
          <a
            href="/register"
            className="text-[#666] font-medium underline hover:text-black"
          >
            Regístrate
          </a>
        </p>
        <p className="text-center text-sm text-gray-500">
          
          <a
            href="/resetPassword"
            className="text-[#666] font-medium underline hover:text-black"
            
          >
            ¿Olvidaste tu contraseña?{" "}
          </a>
        </p>
      </form>
    </div>
  );
}
