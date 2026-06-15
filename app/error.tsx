"use client";

import { useEffect } from "react";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error("[GlobalError]:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center px-6 text-center">
      <div className="max-w-md w-full">
        <div className="mb-6 flex justify-center">
          <div className="bg-orange-100 rounded-full p-5">
            <span className="material-symbols-outlined text-orange-600 text-5xl">warning</span>
          </div>
        </div>

        <h1 className="text-2xl font-black text-slate-900 mb-3">Ocurrió un error inesperado</h1>
        <p className="text-sm text-slate-500 mb-8">
          Algo salió mal al cargar esta página. Puedes intentar recargarla o volver al inicio.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={reset}
            className="inline-flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white text-sm font-bold px-6 py-3 rounded-xl transition-colors"
          >
            <span className="material-symbols-outlined text-base">refresh</span>
            Intentar de nuevo
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center gap-2 bg-white border border-slate-200 hover:border-slate-300 text-slate-700 text-sm font-bold px-6 py-3 rounded-xl transition-colors"
          >
            <span className="material-symbols-outlined text-base">home</span>
            Ir al inicio
          </a>
        </div>

        {error.digest && (
          <p className="mt-8 text-[10px] text-slate-400 font-mono">
            Referencia: {error.digest}
          </p>
        )}
      </div>
    </div>
  );
}
