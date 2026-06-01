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
    <div className="min-h-screen flex flex-col justify-center items-center px-4 relative overflow-hidden bg-slate-950">
      {/* Background Video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover z-0 opacity-40 filter brightness-40 contrast-125 saturate-50"
      >
        <source src="/vid/laptop_video.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Cinematic dark gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-950/90 to-red-950/30 z-0"></div>

      {/* Red Glowing Auroras in the background */}
      <div className="absolute top-1/4 left-1/4 w-[350px] h-[350px] bg-red-600/10 rounded-full blur-[120px] pointer-events-none z-0"></div>
      <div className="absolute bottom-1/4 right-1/4 w-[350px] h-[350px] bg-red-600/5 rounded-full blur-[150px] pointer-events-none z-0"></div>

      <div className="w-full max-w-md bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl hover:border-red-600/20 transition-all duration-500 relative z-10">
        <div className="flex flex-col items-center mb-8">
          <DellcomLogo className="w-16 h-16 mb-4 hover:scale-105 transition-transform duration-300" />
          <h2 className="font-headline text-2xl font-extrabold text-white tracking-tight">Portal de Gestión Interna</h2>
          <p className="text-xs text-red-500 font-bold uppercase tracking-widest mt-1">DELLCOM SAC</p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/25 text-red-400 text-sm p-4 rounded-xl mb-6 flex items-start gap-2.5">
            <span className="material-symbols-outlined text-base mt-0.5">error</span>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Usuario</label>
            <input 
              type="text" 
              required
              disabled={loading}
              value={usuario}
              onChange={(e) => setUsuario(e.target.value)}
              placeholder="Ingresa tu usuario"
              className="w-full bg-slate-950/60 border border-white/10 focus:border-red-600 focus:ring-1 focus:ring-red-600 focus:outline-none rounded-xl px-4 py-3.5 text-white text-sm transition-all placeholder:text-slate-600"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Contraseña</label>
            <input 
              type="password" 
              required
              disabled={loading}
              value={contrasena}
              onChange={(e) => setContrasena(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-slate-950/60 border border-white/10 focus:border-red-600 focus:ring-1 focus:ring-red-600 focus:outline-none rounded-xl px-4 py-3.5 text-white text-sm transition-all placeholder:text-slate-600"
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-4 px-4 rounded-xl text-sm transition-all active:scale-98 shadow-lg shadow-red-600/10 flex items-center justify-center gap-2 mt-4"
          >
            {loading ? (
              <span className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></span>
            ) : (
              <>
                <span className="material-symbols-outlined text-lg">login</span>
                Iniciar Sesión
              </>
            )}
          </button>
        </form>

        <div className="mt-8 text-center">
          <Link href="/" className="text-xs text-slate-500 hover:text-red-500 transition-colors">
            Volver a la página principal
          </Link>
        </div>
      </div>
    </div>
  );
}

// Helper mock Next.js Link replacement if next/link is not loaded or for custom bundling
import NextLink from "next/link";
function Link({ href, children, className }: { href: string; children: React.ReactNode; className?: string }) {
  return (
    <NextLink href={href} className={className}>
      {children}
    </NextLink>
  );
}
