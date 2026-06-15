import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Página no encontrada | DELLCOM SAC",
  description: "La página que buscas no existe o fue movida.",
};

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center px-6 text-center">
      <div className="max-w-md w-full">
        <div className="mb-6 flex justify-center">
          <div className="bg-red-100 rounded-full p-5">
            <span className="material-symbols-outlined text-red-600 text-5xl">error</span>
          </div>
        </div>

        <h1 className="text-8xl font-black text-slate-900 leading-none mb-2">404</h1>
        <h2 className="text-xl font-bold text-slate-700 mb-3">Página no encontrada</h2>
        <p className="text-sm text-slate-500 mb-8">
          La dirección que ingresaste no existe o fue movida. Verifica la URL o regresa al inicio.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white text-sm font-bold px-6 py-3 rounded-xl transition-colors"
          >
            <span className="material-symbols-outlined text-base">home</span>
            Ir al inicio
          </Link>
          <Link
            href="/contacto"
            className="inline-flex items-center justify-center gap-2 bg-white border border-slate-200 hover:border-slate-300 text-slate-700 text-sm font-bold px-6 py-3 rounded-xl transition-colors"
          >
            <span className="material-symbols-outlined text-base">mail</span>
            Contactar soporte
          </Link>
        </div>

        <p className="mt-10 text-xs text-slate-400">
          DELLCOM SAC &mdash; Los Olivos, Lima
        </p>
      </div>
    </div>
  );
}
