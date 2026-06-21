import { Servicio } from "../../types";

interface Props {
  editingService: Servicio | null;
  formServiceName: string; setFormServiceName: (v: string) => void;
  formServiceDesc: string; setFormServiceDesc: (v: string) => void;
  formServiceIcon: string; setFormServiceIcon: (v: string) => void;
  formServiceActive: boolean; setFormServiceActive: (v: boolean) => void;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
}

const COMMON_ICONS = [
  { name: "laptop_mac", label: "Laptop" },
  { name: "devices", label: "Equipos" },
  { name: "memory", label: "Chip/Placa" },
  { name: "dns", label: "Servidores" },
  { name: "lan", label: "Red / LAN" },
  { name: "router", label: "Router/Wifi" },
  { name: "print", label: "Impresora" },
  { name: "verified_user", label: "Licencia" },
  { name: "security", label: "Seguridad" },
  { name: "support_agent", label: "Soporte" },
  { name: "mail", label: "Correo" },
  { name: "psychology", label: "Asesoría" },
];

const inputCls = "w-full bg-slate-50 border border-slate-200 focus:border-red-600 focus:ring-1 focus:ring-red-600 focus:outline-none rounded-xl px-4 py-3 text-sm transition-all";

export default function ServiceModal({
  editingService,
  formServiceName, setFormServiceName,
  formServiceDesc, setFormServiceDesc,
  formServiceIcon, setFormServiceIcon,
  formServiceActive, setFormServiceActive,
  onClose, onSubmit,
}: Props) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-xl shadow-2xl relative overflow-hidden">
        <header className="px-8 py-5 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <h3 className="font-bold text-base text-on-surface">
            {editingService ? "Editar Servicio" : "Registrar Nuevo Servicio"}
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 transition-colors border-none bg-transparent cursor-pointer">
            <span className="material-symbols-outlined">close</span>
          </button>
        </header>

        <form onSubmit={onSubmit} className="p-8 space-y-4 max-h-[70vh] overflow-y-auto custom-scrollbar">
          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Nombre del Servicio</label>
            <input type="text" required value={formServiceName} onChange={e => setFormServiceName(e.target.value)} placeholder="Ej: Mantenimiento Electrónico" className={inputCls} />
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Descripción del Servicio</label>
            <textarea required value={formServiceDesc} onChange={e => setFormServiceDesc(e.target.value)} placeholder="Detalle estructurado del servicio técnico..." rows={4} className={`${inputCls} resize-none`} />
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Icono del Servicio</label>
            <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 mb-3">
              {COMMON_ICONS.map((ico) => (
                <button
                  key={ico.name}
                  type="button"
                  onClick={() => setFormServiceIcon(ico.name)}
                  className={`flex flex-col items-center justify-center p-2.5 rounded-xl border text-center transition-all cursor-pointer select-none ${
                    formServiceIcon === ico.name
                      ? "bg-red-50 border-red-600 text-red-600 font-bold"
                      : "bg-slate-50 border-slate-200 text-slate-500 hover:bg-slate-100 hover:text-slate-700"
                  }`}
                >
                  <span className="material-symbols-outlined text-lg mb-1">{ico.name}</span>
                  <span className="text-[9px] block truncate max-w-full leading-none">{ico.label}</span>
                </button>
              ))}
            </div>
            <div className="flex gap-3 items-center">
              <div className="flex-1">
                <input type="text" required value={formServiceIcon} onChange={e => setFormServiceIcon(e.target.value)} placeholder="Nombre de icono personalizado (ej: computer)" className={`${inputCls} py-2 text-xs font-mono`} />
              </div>
              <div className="w-10 h-10 border border-slate-200 rounded-xl bg-slate-50 flex items-center justify-center text-red-600 shadow-sm shrink-0">
                <span className="material-symbols-outlined text-lg">{formServiceIcon || "help"}</span>
              </div>
            </div>
            <span className="text-[9px] text-slate-400 mt-1.5 block">
              Puedes seleccionar un icono predeterminado arriba o escribir uno libremente desde{" "}
              <a href="https://fonts.google.com/icons" target="_blank" rel="noopener noreferrer" className="text-red-600 hover:underline">Google Icons</a>.
            </span>
          </div>

          <div className="flex items-center gap-2 pt-2">
            <input type="checkbox" id="formServiceActive" checked={formServiceActive} onChange={e => setFormServiceActive(e.target.checked)} className="h-4 w-4 rounded border-slate-300 text-red-600 focus:ring-red-600" />
            <label htmlFor="formServiceActive" className="text-xs font-bold text-slate-600 cursor-pointer">Servicio Activo (Visible al Público)</label>
          </div>

          <footer className="pt-4 border-t border-slate-100 flex justify-end gap-3">
            <button type="button" onClick={onClose} className="px-5 py-3 border border-slate-200 hover:bg-slate-50 rounded-xl text-xs font-bold transition-all cursor-pointer">
              Cancelar
            </button>
            <button type="submit" className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold transition-all active:scale-95 shadow-md shadow-red-600/10 cursor-pointer">
              {editingService ? "Actualizar Servicio" : "Guardar Servicio"}
            </button>
          </footer>
        </form>
      </div>
    </div>
  );
}
