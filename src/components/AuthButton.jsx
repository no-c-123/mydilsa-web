// src/components/AuthButton.jsx
import React from 'react';
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

export default function AuthButton() {
  const [session, setSession] = useState(null);

  useEffect(() => {
    // Get session on mount
    const getSession = async () => {
      const { data } = await supabase.auth.getSession();
      setSession(data.session);
    };

    getSession();

    // Optional: Listen to auth changes
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = '/'; // redirect to home after logout
  };

  return session ? (
    <button 
        onClick={handleLogout} 
        className="w-full sm:w-auto px-4 py-2 text-sm rounded-lg bg-red-600 text-white hover:bg-red-700 transition font-medium text-center mt-4 sm:mt-0"
    >
      Cerrar sesión
    </button>
  ) : (
    <a 
        href="/signin" 
        className="w-full sm:w-auto px-4 py-2 text-sm rounded-lg bg-mydilsa-accent text-white hover:bg-mydilsa-steel transition font-medium text-center mt-4 sm:mt-0"    
    >
      Iniciar sesión
    </a>
  );
}
