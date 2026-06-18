/**
 * Página de login del panel de administración: /admin/login
 * Layout de dos columnas: formulario de acceso a la izquierda y panel
 * visual de bienvenida "¡Hola, Dellcom!" con video de fondo a la derecha.
 */
"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import NextLink from "next/link";

function DellcomLogo({ className = "w-16 h-16" }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={className} xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="50" r="46" stroke="#ff0000" strokeWidth="3" fill="none" opacity="0.85" />
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
      <line x1="50" y1="18" x2="50" y2="82" stroke="#ff0000" strokeWidth="2.5" strokeDasharray="3 3" />
      <path
        d="M 52 24 L 66 24 L 66 32 M 52 38 L 74 38 L 74 46 M 52 50 L 64 50 L 72 58 M 52 64 L 72 64 M 52 74 L 64 74 L 64 68"
        stroke="#ff0000"
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <circle cx="66" cy="32" r="3" fill="#ff0000" />
      <circle cx="74" cy="46" r="3" fill="#ff0000" />
      <circle cx="72" cy="58" r="3" fill="#ff0000" />
      <circle cx="72" cy="64" r="3" fill="#ff0000" />
      <circle cx="64" cy="68" r="3" fill="#ff0000" />
    </svg>
  );
}

export default function AdminLoginPage() {
  const [usuario, setUsuario] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
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
    <div className="w-full min-h-screen md:h-screen flex flex-col md:flex-row overflow-y-auto md:overflow-hidden bg-white selection:bg-primary/20 selection:text-primary">

      {/* Left Column: Welcome Visual Panel (Tech Dark Theme) */}
      <div className="w-full md:w-1/2 min-h-[400px] md:h-full bg-[#0a0a0c] flex flex-col justify-between p-8 md:p-12 lg:p-16 relative overflow-hidden">
        
        {/* Background Video with Blur & Overlay */}
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover z-0 opacity-55 blur-[1px] pointer-events-none"
        >
          <source src="/vid/laptop_video.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-br from-red-950/10 via-black/55 to-black/75 z-0 pointer-events-none"></div>

        {/* Centered Greeting and Slogans */}
        <div className="relative z-20 my-auto py-8 space-y-6">
          <h1 className="font-headline text-5xl lg:text-6xl xl:text-7xl font-black text-white leading-[1.1] tracking-tight">
            ¡Hola, <br />
            <span className="text-primary">Dellcom!</span>
          </h1>
          <p className="text-sm lg:text-base text-white font-semibold leading-relaxed max-w-sm lg:max-w-md">
            Soporte IT de primer nivel, repuestos y licencias originales. Gestiona los servicios técnicos de forma eficiente y segura desde un solo panel.
          </p>

          {/* Red Circle-Icon Checkbox List */}
          <div className="space-y-4 pt-4">
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-full border border-primary/30 bg-primary/10 flex items-center justify-center text-primary shadow-sm shadow-red-950/20">
                <span className="material-symbols-outlined text-base">security</span>
              </span>
              <span className="text-sm text-white/90 font-bold tracking-wide">
                Conexión cifrada extremo a extremo
              </span>
            </div>

            <div className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-full border border-primary/30 bg-primary/10 flex items-center justify-center text-primary shadow-sm shadow-red-950/20">
                <span className="material-symbols-outlined text-base">handyman</span>
              </span>
              <span className="text-sm text-white/90 font-bold tracking-wide">
                Soporte técnico 24/7 disponible
              </span>
            </div>

            <div className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-full border border-primary/30 bg-primary/10 flex items-center justify-center text-primary shadow-sm shadow-red-950/20">
                <span className="material-symbols-outlined text-base">workspace_premium</span>
              </span>
              <span className="text-sm text-white/90 font-bold tracking-wide">
                Repuestos y licencias certificadas
              </span>
            </div>
          </div>
        </div>

        {/* Technical Footer */}
        <div className="relative z-20 border-t border-white/5 pt-4">
          <p className="text-[9px] text-white/35 font-bold uppercase tracking-wider text-center sm:text-left">
            © 2026 DELLCOM SAC - TODOS LOS DERECHOS RESERVADOS
          </p>
        </div>
      </div>

      {/* Right Column: Credentials Form (Clean Light Theme) */}
      <div className="w-full md:w-1/2 min-h-[600px] md:h-full bg-white flex flex-col justify-between p-8 md:p-12 lg:p-16 overflow-y-auto">

        {/* Brand Header */}
        <div className="flex items-center gap-3 justify-center md:justify-start">
          <DellcomLogo className="w-10 h-10 lg:w-12 lg:h-12" />
          <div className="leading-none">
            <span className="font-headline text-base font-black text-slate-800 block">DELLCOM</span>
            <span className="text-[8px] font-bold text-primary uppercase tracking-widest block mt-0.5">Portal de Gestión Interna</span>
          </div>
        </div>

        {/* Form Container */}
        <div className="max-w-md w-full mx-auto my-auto py-8 space-y-6">
          <div className="space-y-2 text-center">
            <h2 className="font-headline text-3xl lg:text-4xl font-extrabold text-slate-800 tracking-tight">
              ¡Bienvenido <span className="text-primary">de nuevo!</span>
            </h2>
            <p className="text-xs lg:text-sm text-slate-400 font-semibold leading-relaxed">
              Ingresa tus credenciales para acceder al panel administrativo.
            </p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-100 text-red-600 text-xs p-3.5 rounded-xl flex items-start gap-2 font-semibold animate-fade-in">
              <span className="material-symbols-outlined text-base mt-0.5">error</span>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Username Input Group */}
            <div className="flex flex-col">
              <label className="block text-[9px] lg:text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">
                Usuario
              </label>
              <div className="relative flex items-center bg-slate-50 border border-slate-100 rounded-xl focus-within:border-primary/40 focus-within:ring-1 focus-within:ring-primary/40 transition-all px-4 py-3">
                <span className="material-symbols-outlined text-slate-400 transition-colors mr-3 text-lg leading-none">person</span>
                <input
                  type="text"
                  required
                  disabled={loading}
                  value={usuario}
                  onChange={(e) => setUsuario(e.target.value)}
                  placeholder="Ingresa tu usuario"
                  className="w-full bg-transparent border-none focus:outline-none focus:ring-0 p-0 text-slate-800 text-sm font-semibold placeholder:text-slate-400/80"
                />
              </div>
            </div>

            {/* Password Input Group */}
            <div className="flex flex-col">
              <label className="block text-[9px] lg:text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">
                Contraseña
              </label>
              <div className="relative flex items-center bg-slate-50 border border-slate-100 rounded-xl focus-within:border-primary/40 focus-within:ring-1 focus-within:ring-primary/40 transition-all px-4 py-3">
                <span className="material-symbols-outlined text-slate-400 transition-colors mr-3 text-lg leading-none">lock</span>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  disabled={loading}
                  value={contrasena}
                  onChange={(e) => setContrasena(e.target.value)}
                  placeholder="Contraseña"
                  className="w-full bg-transparent border-none focus:outline-none focus:ring-0 p-0 text-slate-800 text-sm font-semibold placeholder:text-slate-400/80"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="focus:outline-none text-slate-400 hover:text-slate-600 transition-colors ml-2 flex items-center"
                >
                  <span className="material-symbols-outlined text-lg leading-none">
                    {showPassword ? "visibility_off" : "visibility"}
                  </span>
                </button>
              </div>
            </div>

            {/* Options Row */}
            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  className="rounded border-slate-300 text-primary focus:ring-primary w-4 h-4 cursor-pointer"
                />
                <span className="text-xs text-slate-500 font-semibold">Recordarme</span>
              </label>
              <NextLink
                href="/admin/forgot-password"
                className="text-xs font-bold text-primary hover:text-primary-dark hover:underline transition-all"
              >
                ¿Olvidaste tu contraseña?
              </NextLink>
            </div>

            {/* Buttons */}
            <div className="space-y-3 pt-4">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary hover:bg-primary/95 text-white font-bold py-3.5 px-6 rounded-full text-sm transition-all active:scale-[0.98] shadow-md shadow-primary/10 flex items-center justify-center gap-2 cursor-pointer border-none"
              >
                {loading ? (
                  <span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></span>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-lg leading-none">login</span>
                    Iniciar Sesión
                  </>
                )}
              </button>

              <Link
                href="/"
                className="w-full bg-white hover:bg-slate-50 text-slate-600 border border-slate-200 font-bold py-3 px-6 rounded-full text-sm transition-all active:scale-[0.98] flex items-center justify-center gap-2 shadow-sm"
              >
                <span className="material-symbols-outlined text-lg leading-none">arrow_back</span>
                Volver a Inicio
              </Link>
            </div>
          </form>
        </div>

        {/* Support Link */}
        <div className="text-center w-full text-xs text-slate-400 font-semibold">
          ¿Problemas para acceder?{" "}
          <a
            href="https://wa.me/51987654321"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary font-bold hover:underline"
          >
            Contacta a soporte
          </a>
        </div>
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
