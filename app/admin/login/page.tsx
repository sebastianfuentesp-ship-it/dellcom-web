/**
 * Página de login del panel de administración: /admin/login
 * Usa signIn("credentials") de NextAuth con redirect:false para manejar
 * errores sin recargar la página. En caso de éxito redirige al dashboard.
 * Incluye video de fondo y el logo SVG de DELLCOM renderizado en línea.
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
    <div className="min-h-screen w-full flex flex-col md:flex-row bg-white selection:bg-primary/20 selection:text-primary overflow-hidden">
      
      {/* Left Column: Visual Panel (Beautiful light red/rose gradient + video overlay + glassmorphic layers) */}
      <div className="group w-full md:w-1/2 min-h-[380px] md:min-h-screen bg-gradient-to-br from-red-50/70 via-slate-50 to-rose-100/30 p-8 md:p-16 lg:p-24 flex flex-col justify-between relative overflow-hidden border-b md:border-b-0 md:border-r border-slate-200/50">
        
        {/* Background Video */}
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover z-0 opacity-[0.28] pointer-events-none"
        >
          <source src="/vid/laptop_video.mp4" type="video/mp4" />
        </video>

        {/* Glowing Auroras */}
        <div className="absolute top-1/4 left-1/4 w-[260px] h-[260px] bg-primary/6 rounded-full blur-[80px] pointer-events-none z-0"></div>
        <div className="absolute bottom-1/4 right-1/4 w-[260px] h-[260px] bg-rose-500/8 rounded-full blur-[90px] pointer-events-none z-0"></div>

        {/* Concentric tilted rounded box outlines (Styled like 3D glass panes that shift on hover) */}
        <div className="absolute -right-20 -bottom-20 w-[420px] h-[520px] opacity-[0.07] pointer-events-none z-0 rotate-[22deg] border border-slate-800 rounded-[3.5rem] bg-white/5 shadow-[0_8px_30px_rgba(0,0,0,0.01)] backdrop-blur-[1px] transition-all duration-700 ease-out group-hover:translate-x-3 group-hover:translate-y-3 group-hover:rotate-[24deg] group-hover:opacity-[0.1]" />
        <div className="absolute -right-10 -bottom-10 w-[420px] h-[520px] opacity-[0.07] pointer-events-none z-0 rotate-[22deg] border border-slate-800 rounded-[3.5rem] bg-white/5 shadow-[0_8px_30px_rgba(0,0,0,0.01)] backdrop-blur-[1px] transition-all duration-700 ease-out group-hover:translate-x-1.5 group-hover:translate-y-1.5 group-hover:rotate-[23deg]" />
        <div className="absolute right-0 bottom-0 w-[420px] h-[520px] opacity-[0.07] pointer-events-none z-0 rotate-[22deg] border border-slate-800 rounded-[3.5rem] bg-white/5 shadow-[0_8px_30px_rgba(0,0,0,0.01)] backdrop-blur-[1px] transition-all duration-700 ease-out" />
        <div className="absolute right-10 bottom-10 w-[420px] h-[520px] opacity-[0.07] pointer-events-none z-0 rotate-[22deg] border border-slate-800 rounded-[3.5rem] bg-white/5 shadow-[0_8px_30px_rgba(0,0,0,0.01)] backdrop-blur-[1px] transition-all duration-700 ease-out group-hover:-translate-x-1.5 group-hover:-translate-y-1.5 group-hover:rotate-[21deg]" />

        {/* 8-Point Asterisk Icon inside premium glass box */}
        <div className="relative z-10 w-16 h-16 bg-white/70 backdrop-blur-md border border-white/80 shadow-lg shadow-red-100/30 rounded-2xl flex items-center justify-center text-primary transition-all duration-500 ease-out hover:scale-105 hover:rotate-[15deg]">
          <svg className="w-9 h-9" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="7.5" strokeLinecap="round">
            <line x1="50" y1="15" x2="50" y2="85" />
            <line x1="15" y1="50" x2="85" y2="50" />
            <line x1="25.2" y1="25.2" x2="74.8" y2="74.8" />
            <line x1="25.2" y1="74.8" x2="74.8" y2="25.2" />
          </svg>
        </div>

        {/* Main Headline & Paragraph */}
        <div className="relative z-10 my-auto py-12 space-y-6">
          <span className="inline-flex items-center gap-1.5 py-1 px-3 bg-white/90 backdrop-blur-sm border border-slate-200/50 text-primary font-bold text-[9px] rounded-full uppercase tracking-widest shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
            Acceso Autorizado
          </span>
          <h1 className="font-headline text-4xl md:text-5xl lg:text-6xl font-black text-slate-800 leading-none tracking-tight">
            ¡Hola <br />
            <span className="text-primary">Dellcom!</span>
          </h1>
          <p className="text-xs md:text-sm lg:text-base text-slate-500 leading-relaxed font-semibold max-w-sm">
            Soporte IT de primer nivel, repuestos y licencias originales. Gestiona los servicios técnicos de forma eficiente y segura.
          </p>
        </div>

        {/* Footer copyright */}
        <div className="relative z-10">
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-none">
            © 2026 DELLCOM SAC. Todos los derechos reservados.
          </p>
        </div>
      </div>

      {/* Right Column: Form Panel */}
      <div className="w-full md:w-1/2 min-h-[500px] md:min-h-screen bg-white p-8 md:p-16 lg:p-24 flex flex-col justify-between">
        
        {/* Brand Text Logo */}
        <div className="flex items-center gap-2.5 justify-center md:justify-start">
          <DellcomLogo className="w-8 h-8" />
          <span className="font-headline text-lg font-black text-slate-800 tracking-tight leading-none">DELLCOM</span>
        </div>

        {/* Center Auth Form */}
        <div className="max-w-md w-full mx-auto my-auto py-12 space-y-8">
          
          <div className="space-y-2.5">
            <h2 className="font-headline text-3xl md:text-4xl font-black text-slate-800 tracking-tight">
              Welcome Back!
            </h2>
            <p className="text-xs text-slate-400 font-semibold leading-relaxed">
              ¿No tienes una cuenta? <span className="underline text-primary font-bold cursor-pointer hover:text-primary/80 transition-colors">Solicita acceso al administrador</span>. Toma menos de un minuto.
            </p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-100 text-red-600 text-xs p-4 rounded-xl flex items-start gap-2.5 font-semibold animate-fade-in">
              <span className="material-symbols-outlined text-base mt-0.5">error</span>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Username/Email Input with Bottom-Border Style + Icon */}
            <div className="relative flex items-center border-b-2 border-slate-200 focus-within:border-primary transition-all py-1">
              <span className="material-symbols-outlined text-slate-400 mr-3 text-lg leading-none">mail</span>
              <input 
                type="text" 
                required
                disabled={loading}
                value={usuario}
                onChange={(e) => setUsuario(e.target.value)}
                placeholder="Usuario o Correo"
                className="w-full bg-transparent border-none focus:outline-none focus:ring-0 px-0 py-2.5 text-slate-800 text-sm font-semibold placeholder:text-slate-300"
              />
            </div>

            {/* Password Input with Bottom-Border Style + Icon */}
            <div className="relative flex items-center border-b-2 border-slate-200 focus-within:border-primary transition-all py-1">
              <span className="material-symbols-outlined text-slate-400 mr-3 text-lg leading-none">lock</span>
              <input 
                type="password" 
                required
                disabled={loading}
                value={contrasena}
                onChange={(e) => setContrasena(e.target.value)}
                placeholder="Contraseña"
                className="w-full bg-transparent border-none focus:outline-none focus:ring-0 px-0 py-2.5 text-slate-800 text-sm font-semibold placeholder:text-slate-300"
              />
            </div>

            {/* Login button (Dark Slate Solid Button) */}
            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-4 px-4 rounded-xl text-sm transition-all active:scale-[0.98] shadow-sm flex items-center justify-center gap-2 cursor-pointer border-none"
            >
              {loading ? (
                <span className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></span>
              ) : (
                <span>Login Now</span>
              )}
            </button>

            {/* Return to Home button (Bordered Style matching Google button) */}
            <Link 
              href="/"
              className="w-full bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 font-bold py-3.5 px-4 rounded-xl text-sm transition-all active:scale-[0.98] flex items-center justify-center gap-2.5 shadow-sm"
            >
              <span className="material-symbols-outlined text-lg">arrow_back</span>
              Volver a Inicio
            </Link>
          </form>

          {/* Under-form Links */}
          <div className="text-center">
            <span className="text-xs text-slate-400 font-semibold">
              Forgot password? <span className="underline text-slate-800 cursor-pointer font-bold hover:text-slate-600 transition-colors">Click here</span>
            </span>
          </div>

        </div>

        {/* Empty placeholder for alignment */}
        <div className="hidden md:block h-8"></div>
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
