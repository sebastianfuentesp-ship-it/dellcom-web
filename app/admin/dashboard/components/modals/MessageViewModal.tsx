import { MensajeContacto } from "../../types";

interface Props {
  mensaje: MensajeContacto;
  formatDate: (dateStr: string | null) => string;
  onClose: () => void;
}

export default function MessageViewModal({ mensaje, formatDate, onClose }: Props) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-lg shadow-2xl relative overflow-hidden">
        <header className="px-8 py-5 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <h3 className="font-bold text-base text-on-surface">{mensaje.asunto}</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 transition-colors border-none bg-transparent cursor-pointer">
            <span className="material-symbols-outlined">close</span>
          </button>
        </header>

        <div className="p-8 space-y-4">
          <div>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Remitente</p>
            <p className="text-sm text-on-surface">{mensaje.nombre}</p>
            <p className="text-xs text-slate-500">{mensaje.correo}</p>
            {mensaje.telefono && <p className="text-xs text-slate-500">{mensaje.telefono}</p>}
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Fecha</p>
            <p className="text-sm text-on-surface">{formatDate(mensaje.fecha)}</p>
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Mensaje</p>
            <p className="text-sm text-on-surface whitespace-pre-wrap">{mensaje.mensaje}</p>
          </div>
        </div>

        <footer className="px-8 pb-8 flex justify-end gap-3">
          <button type="button" onClick={onClose} className="px-5 py-3 border border-slate-200 hover:bg-slate-50 rounded-xl text-xs font-bold transition-all cursor-pointer">
            Cerrar
          </button>
        </footer>
      </div>
    </div>
  );
}
