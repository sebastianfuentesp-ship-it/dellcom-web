/**
 * Página de login del panel de administración: /admin/login
 * Rediseñada de acuerdo a la estética de tarjeta redondeada clara con ondas
 * y tarjeta de texto glassmórfica, utilizando el video de fondo sin imágenes de IA.
 */
"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import NextLink from "next/link";

function DellcomLogo({ className = "w-16 h-16" }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={className} xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="50" r="46" stroke="#dc2626" strokeWidth="3" fill="none" opacity="0.85" />
      <circle cx="50" cy="50" r="43" fill="#000000" />
      <path 
        d="M 48 20 C 40 20, 36 24, 36 28 C 30 28, 27 33, 29 39 C 24 41, 23 48, 26 53 C 21 57, 21 64, 25 68 C 23 74, 28 80, 35 80 C 38 80, 42 78, 44 76 C 46 78, 48 80, 48 80 Z" 
        stroke="#ffffff" 
        strokeWidth="3.5" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        fill="none" 
      />
      <path 
        d="M 48 32 C 40 32, 38 38, 44 42 C 34 46, 38 56, 44 56 C 36 60, 40 70, 48 70" 
        stroke="#ffffff" 
        strokeWidth="2.5" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        fill="none" 
      />
      <line x1="50" y1="18" x2="50" y2="82" stroke="#dc2626" strokeWidth="2.5" strokeDasharray="3 3" />
      <path 
        d="M 52 24 L 66 24 L 66 32 M 52 38 L 74 38 L 74 46 M 52 50 L 64 50 L 72 58 M 52 64 L 72 64 M 52 74 L 64 74 L 64 68" 
        stroke="#dc2626" 
        strokeWidth="3.5" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        fill="none" 
      />
      <circle cx="66" cy="32" r="3" fill="#dc2626" />
      <circle cx="74" cy="46" r="3" fill="#dc2626" />
      <circle cx="72" cy="58" r="3" fill="#dc2626" />
      <circle cx="72" cy="64" r="3" fill="#dc2626" />
      <circle cx="64" cy="68" r="3" fill="#dc2626" />
    </svg>
  );
}

export default function AdminLoginPage() {
  const [usuario, setUsuario] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await signIn("credentials", {
        usuario,
        contrasena,
        redirect: false,
      });

      if (res?.error) {
        setError("Usuario o contraseña incorrectos o cuenta inactiva.");
      } else {
        router.push("/admin/dashboard");
        router.refresh();
      }
    } catch (err) {
      setError("Ocurrió un error inesperado al intentar iniciar sesión.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 md:p-8 relative overflow-hidden bg-slate-100/40">
      
      {/* Background Video covering the entire screen with blur */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover z-0 opacity-[0.55] blur-[8px] scale-[1.05] pointer-events-none"
      >
        <source src="/vid/laptop_video.mp4" type="video/mp4" />
      </video>

      {/* Clear frosted overlay for light theme look */}
      <div className="absolute inset-0 bg-slate-50/40 backdrop-blur-[1px] z-0 pointer-events-none"></div>

      {/* Soft Red/Rose glowing spots in the background */}
      <div className="absolute top-1/4 left-1/4 w-[350px] h-[350px] bg-red-600/5 rounded-full blur-[120px] pointer-events-none z-0"></div>
      <div className="absolute bottom-1/4 right-1/4 w-[350px] h-[350px] bg-rose-500/5 rounded-full blur-[150px] pointer-events-none z-0"></div>

      {/* Main Login Card - Glassmorphic and Centered (Light Theme) */}
      <div className="w-full max-w-md bg-white/85 backdrop-blur-xl border border-slate-200/60 rounded-[2.5rem] p-8 md:p-10 shadow-2xl shadow-slate-200/80 hover:border-primary/20 transition-all duration-500 relative z-10 animate-fade-in flex flex-col justify-between min-h-[500px]">
        
        {/* Brand Logo and Title */}
        <div className="flex flex-col items-center mt-2">
          <DellcomLogo className="w-16 h-16 mb-4 hover:scale-105 transition-transform duration-300" />
          <h2 className="font-headline text-2xl font-black text-slate-800 tracking-tight text-center leading-none">Portal de Gestión Interna</h2>
          <p className="text-[10px] text-primary font-black uppercase tracking-widest mt-2">DELLCOM SAC</p>
        </div>

        {/* Welcome Text */}
        <div className="space-y-1 mt-4 text-center">
          <h3 className="font-headline text-lg font-black text-slate-800">¡Bienvenido de nuevo!</h3>
          <p className="text-[10px] text-slate-500 font-semibold leading-relaxed">
            Acceso exclusivo para personal técnico autorizado.
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-100 text-red-600 text-xs p-4 rounded-xl mt-4 flex items-start gap-2.5 font-semibold animate-fade-in">
            <span className="material-symbols-outlined text-base mt-0.5">error</span>
            <span>{error}</span>
          </div>
        )}

        {/* Form with clean slate style inputs */}
        <form onSubmit={handleSubmit} className="space-y-6 mt-6">
          
          {/* Username Field Group */}
          <div className="group relative flex flex-col">
            <label className="block text-[9px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
              Usuario
            </label>
            <div className="relative flex items-center bg-slate-50/80 border border-slate-200/80 rounded-2xl focus-within:border-primary focus-within:ring-1 focus-within:ring-primary transition-all px-4 py-3">
              <span className="material-symbols-outlined text-slate-400 group-focus-within:text-primary transition-colors mr-3 text-lg leading-none">person</span>
              <input 
                type="text" 
                required
                disabled={loading}
                value={usuario}
                onChange={(e) => setUsuario(e.target.value)}
                placeholder="Ingresa tu usuario"
                className="w-full bg-transparent border-none focus:outline-none focus:ring-0 p-0 text-slate-800 text-sm font-semibold placeholder:text-slate-400"
              />
            </div>
          </div>

          {/* Password Field Group */}
          <div className="group relative flex flex-col">
            <label className="block text-[9px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
              Contraseña
            </label>
            <div className="relative flex items-center bg-slate-50/80 border border-slate-200/80 rounded-2xl focus-within:border-primary focus-within:ring-1 focus-within:ring-primary transition-all px-4 py-3">
              <span className="material-symbols-outlined text-slate-400 group-focus-within:text-primary transition-colors mr-3 text-lg leading-none">lock</span>
              <input 
                type="password" 
                required
                disabled={loading}
                value={contrasena}
                onChange={(e) => setContrasena(e.target.value)}
                placeholder="Contraseña"
                className="w-full bg-transparent border-none focus:outline-none focus:ring-0 p-0 text-slate-800 text-sm font-semibold placeholder:text-slate-400"
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="space-y-3 pt-2">
            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-primary hover:bg-primary/95 text-white font-bold py-3.5 px-6 rounded-full text-sm transition-all active:scale-[0.98] shadow-lg shadow-primary/10 flex items-center justify-center gap-2 cursor-pointer border-none"
            >
              {loading ? (
                <span className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></span>
              ) : (
                <>
                  <span className="material-symbols-outlined text-lg leading-none">login</span>
                  Iniciar Sesión
                </>
              )}
            </button>

            <Link 
              href="/"
              className="w-full bg-white hover:bg-slate-50 text-slate-750 border border-slate-200/85 font-bold py-3 px-6 rounded-full text-sm transition-all active:scale-[0.98] flex items-center justify-center gap-2 shadow-sm"
            >
              <span className="material-symbols-outlined text-lg">arrow_back</span>
              Volver a Inicio
            </Link>
          </div>
        </form>

        <div className="h-2"></div>
      </div>
    </div>
  );
}

function Link({ href, children, className }: { href: string; children: React.ReactNode; className?: string }) {
  return (
    <NextLink href={href} className={className}>
      {children}
    </NextLink>
  );
}
