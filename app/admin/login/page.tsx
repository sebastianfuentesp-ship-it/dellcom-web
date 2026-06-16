/**
 * Página de login del panel de administración: /admin/login
 * Rediseñada de acuerdo a la estética de tarjeta redondeada clara con ondas
 * y tarjeta de texto glassmórfica, utilizando el video de fondo sin imágenes de IA.
 */
"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

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
    <div className="min-h-screen w-full flex items-center justify-center p-4 md:p-8 bg-gradient-to-br from-red-50/50 via-slate-100 to-rose-50/50 selection:bg-primary/20 selection:text-primary">
      
      {/* Main Login Card - Rounded and Glass-Shadow styled */}
      <div className="w-full max-w-4xl bg-white border border-slate-200/80 rounded-[2.5rem] md:rounded-[3.5rem] shadow-2xl shadow-slate-200/50 flex flex-col md:flex-row overflow-hidden relative min-h-[550px]">
        
        {/* Left Column: Visual Panel (Waves + Blurred Background Video + Glassmorphic Greeting Card + Image) */}
        <div className="w-full md:w-1/2 min-h-[350px] md:min-h-[500px] bg-slate-50/50 flex flex-col justify-between p-8 md:p-12 relative overflow-hidden border-b md:border-b-0 md:border-r border-slate-200/50">
          
          {/* Background Video with modern blur and scale */}
          <video
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 w-full h-full object-cover z-0 opacity-[0.6] blur-[6px] scale-[1.05] pointer-events-none"
          >
            <source src="/vid/laptop_video.mp4" type="video/mp4" />
          </video>

          {/* Frosted clear overlay */}
          <div className="absolute inset-0 bg-slate-50/30 backdrop-blur-[1px] z-5 pointer-events-none" />

          {/* Layered Gradient Waves */}
          <svg className="absolute top-0 left-0 h-full w-[170px] md:w-[245px] pointer-events-none z-10 opacity-20" viewBox="0 0 100 200" preserveAspectRatio="none">
            <path d="M 0,0 C 95,35 105,95 70,140 C 40,175 50,190 0,200 Z" fill="#f87171" />
          </svg>
          <svg className="absolute top-0 left-0 h-full w-[150px] md:w-[220px] pointer-events-none z-10 opacity-80" viewBox="0 0 100 200" preserveAspectRatio="none">
            <defs>
              <linearGradient id="loginWaveGrad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#dc2626" />
                <stop offset="100%" stopColor="#991b1b" />
              </linearGradient>
            </defs>
            <path d="M 0,0 C 85,30 100,85 65,130 C 35,165 45,185 0,200 Z" fill="url(#loginWaveGrad)" />
          </svg>

          {/* Top Brand Logo */}
          <div className="relative z-20 flex items-center gap-2.5">
            <DellcomLogo className="w-8 h-8" />
            <div>
              <span className="font-headline text-xs font-black text-slate-800 block leading-none">DELLCOM</span>
              <span className="text-[8px] font-bold text-primary uppercase tracking-widest block mt-0.5 leading-none">IT Engineering</span>
            </div>
          </div>

          {/* Centered Glassmorphic Greeting Card with Generated Tech Illustration */}
          <div className="relative z-20 my-auto py-6 flex items-center justify-center">
            <div className="w-full max-w-sm bg-white/90 backdrop-blur-md border border-white/80 rounded-[2rem] shadow-lg shadow-slate-200/50 p-6 md:p-8 space-y-4 hover:-translate-y-1 transition-all duration-300">
              
              {/* Premium Tech Illustration */}
              <div className="w-full aspect-[16/10] rounded-2xl overflow-hidden relative border border-slate-100 bg-slate-50/50 shadow-inner">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src="/img/login_illustration.png" 
                  alt="Dellcom IT Management" 
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-105" 
                />
              </div>

              <span className="inline-flex items-center gap-1.5 py-1 px-3 bg-primary/10 text-primary font-bold text-[9px] rounded-full uppercase tracking-widest leading-none">
                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
                Acceso Técnico
              </span>
              <h1 className="font-headline text-3xl md:text-4xl font-black text-slate-800 leading-none tracking-tight">
                ¡Hola <br />
                <span className="text-primary">Dellcom!</span>
              </h1>
              <p className="text-xs md:text-sm text-slate-500 leading-relaxed font-semibold">
                Soporte IT de primer nivel, repuestos y licencias originales. Gestiona los servicios técnicos de forma eficiente.
              </p>
            </div>
          </div>

          {/* Footer Label */}
          <div className="relative z-20">
            <p className="text-[9px] text-slate-450 font-bold uppercase tracking-widest leading-none">
              © 2026 DELLCOM SAC.
            </p>
          </div>
        </div>

        {/* Right Column: Form Panel (Avatar Circles + Inputs + Pill Buttons) */}
        <div className="w-full md:w-1/2 p-8 md:p-12 lg:p-16 flex flex-col justify-between bg-white min-h-[500px]">
          
          {/* Top Header circles matching original design */}
          <div className="flex justify-center mt-2">
            <div className="flex items-center">
              {/* Circle 1: Security Icon */}
              <div className="w-12 h-12 rounded-full bg-primary/10 border-2 border-white shadow-md flex items-center justify-center text-primary relative z-10 transition-transform duration-300 hover:scale-105">
                <span className="material-symbols-outlined text-lg leading-none">admin_panel_settings</span>
              </div>
              {/* Circle 2: Technical Icon */}
              <div className="w-12 h-12 rounded-full bg-slate-100 border-2 border-white shadow-md flex items-center justify-center text-slate-600 relative -ml-4 z-0 transition-transform duration-300 hover:scale-105">
                <span className="material-symbols-outlined text-lg leading-none">engineering</span>
              </div>
            </div>
          </div>

          {/* Auth Title */}
          <div className="space-y-2.5 mt-4">
            <h2 className="font-headline text-3xl md:text-4xl font-black text-slate-800 tracking-tight text-center">
              ¡Bienvenido de nuevo!
            </h2>
            <p className="text-xs text-slate-400 font-semibold leading-relaxed text-center">
              Acceso exclusivo para personal técnico autorizado de DELLCOM.
            </p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-100 text-red-600 text-xs p-3.5 rounded-xl flex items-start gap-2.5 font-semibold animate-fade-in mt-4">
              <span className="material-symbols-outlined text-base mt-0.5">error</span>
              <span>{error}</span>
            </div>
          )}

          {/* Form with icons and underlined fields */}
          <form onSubmit={handleSubmit} className="space-y-6 mt-6">
            
            {/* Username Field Group */}
            <div className="group relative flex flex-col">
              <label className="block text-[10px] font-bold text-slate-450 uppercase tracking-wider mb-1">
                Usuario
              </label>
              <div className="relative flex items-center border-b-2 border-slate-200 focus-within:border-primary transition-all py-1">
                <span className="material-symbols-outlined text-slate-450 group-focus-within:text-primary transition-colors mr-3 text-lg leading-none">person</span>
                <input 
                  type="text" 
                  required
                  disabled={loading}
                  value={usuario}
                  onChange={(e) => setUsuario(e.target.value)}
                  placeholder="Ingresa tu usuario"
                  className="w-full bg-transparent border-none focus:outline-none focus:ring-0 px-0 py-1.5 text-slate-800 text-sm font-semibold placeholder:text-slate-305"
                />
              </div>
            </div>

            {/* Password Field Group */}
            <div className="group relative flex flex-col">
              <label className="block text-[10px] font-bold text-slate-450 uppercase tracking-wider mb-1">
                Contraseña
              </label>
              <div className="relative flex items-center border-b-2 border-slate-200 focus-within:border-primary transition-all py-1">
                <span className="material-symbols-outlined text-slate-450 group-focus-within:text-primary transition-colors mr-3 text-lg leading-none">lock</span>
                <input 
                  type="password" 
                  required
                  disabled={loading}
                  value={contrasena}
                  onChange={(e) => setContrasena(e.target.value)}
                  placeholder="Contraseña"
                  className="w-full bg-transparent border-none focus:outline-none focus:ring-0 px-0 py-1.5 text-slate-800 text-sm font-semibold placeholder:text-slate-305"
                />
              </div>
            </div>

            {/* Iniciar Sesión button (Pill shaped, Crimson Red) */}
            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-primary hover:bg-primary/95 text-white font-bold py-3.5 px-6 rounded-full text-sm transition-all active:scale-[0.98] shadow-md shadow-primary/10 flex items-center justify-center gap-2 mt-6 cursor-pointer border-none"
            >
              {loading ? (
                <span className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></span>
              ) : (
                <span>Iniciar Sesión</span>
              )}
            </button>

            {/* Volver a Inicio button (Pill shaped, Bordered) */}
            <Link 
              href="/"
              className="w-full bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 font-bold py-3 px-6 rounded-full text-sm transition-all active:scale-[0.98] flex items-center justify-center gap-2 shadow-sm"
            >
              <span className="material-symbols-outlined text-lg">arrow_back</span>
              Volver a Inicio
            </Link>
          </form>

          {/* Under-form placeholder */}
          <div className="h-4"></div>
        </div>
      </div>
    </div>
  );
}

import NextLink from "next/link";
function Link({ href, children, className }: { href: string; children: React.ReactNode; className?: string }) {
  return (
    <NextLink href={href} className={className}>
      {children}
    </NextLink>
  );
}
