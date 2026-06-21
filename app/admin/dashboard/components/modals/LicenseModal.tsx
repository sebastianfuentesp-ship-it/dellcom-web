import { Licencia } from "../../types";

interface Props {
  editingLicense: Licencia | null;
  formCliente: string; setFormCliente: (v: string) => void;
  formTelefono: string; setFormTelefono: (v: string) => void;
  formSoftware: string; setFormSoftware: (v: string) => void;
  formCorreo: string; setFormCorreo: (v: string) => void;
  formContrasena: string; setFormContrasena: (v: string) => void;
  formFechaInicio: string; setFormFechaInicio: (v: string) => void;
  formFechaFin: string; setFormFechaFin: (v: string) => void;
  formObservaciones: string; setFormObservaciones: (v: string) => void;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
}

const inputCls = "w-full bg-slate-50 border border-slate-200 focus:border-red-600 focus:ring-1 focus:ring-red-600 focus:outline-none rounded-xl px-4 py-3 text-sm transition-all";

export default function LicenseModal({
  editingLicense,
  formCliente, setFormCliente, formTelefono, setFormTelefono,
  formSoftware, setFormSoftware, formCorreo, setFormCorreo,
  formContrasena, setFormContrasena, formFechaInicio, setFormFechaInicio,
  formFechaFin, setFormFechaFin, formObservaciones, setFormObservaciones,
  onClose, onSubmit,
}: Props) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-xl shadow-2xl relative overflow-hidden">
        <header className="px-8 py-5 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <h3 className="font-bold text-base text-on-surface">
            {editingLicense ? "Editar Licencia de Cliente" : "Registrar Nueva Licencia"}
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 transition-colors cursor-pointer">
            <span className="material-symbols-outlined">close</span>
          </button>
        </header>

        <form onSubmit={onSubmit} className="p-8 space-y-4 max-h-[70vh] overflow-y-auto custom-scrollbar">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Nombre del Cliente</label>
              <input type="text" required value={formCliente} onChange={e => setFormCliente(e.target.value)} placeholder="Corporación S.A.C." className={inputCls} />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Teléfono Cliente</label>
              <input type="text" value={formTelefono} onChange={e => setFormTelefono(e.target.value.replace(/\D/g, "").slice(0, 15))} placeholder="Ej. 987654321" className={inputCls} />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Software de la Licencia</label>
              <input type="text" required value={formSoftware} onChange={e => setFormSoftware(e.target.value)} placeholder="Windows 11 Professional" className={inputCls} />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Correo Electrónico Cuenta</label>
              <input type="email" required value={formCorreo} onChange={e => setFormCorreo(e.target.value)} placeholder="soporte@cliente.com" className={inputCls} />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Contraseña de la Cuenta</label>
            <input type="text" required value={formContrasena} onChange={e => setFormContrasena(e.target.value)} placeholder="••••••••" className={inputCls} />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Fecha de Inicio</label>
              <input type="date" value={formFechaInicio} onChange={e => setFormFechaInicio(e.target.value)} className={inputCls} />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Fecha de Vencimiento</label>
              <input type="date" value={formFechaFin} onChange={e => setFormFechaFin(e.target.value)} className={inputCls} />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Observaciones</label>
            <textarea value={formObservaciones} onChange={e => setFormObservaciones(e.target.value)} placeholder="Notas adicionales sobre esta licencia..." rows={3} className={inputCls} />
          </div>

          <footer className="pt-4 border-t border-slate-100 flex justify-end gap-3">
            <button type="button" onClick={onClose} className="px-5 py-3 border border-slate-200 hover:bg-slate-50 rounded-xl text-xs font-bold transition-all cursor-pointer">
              Cancelar
            </button>
            <button type="submit" className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold transition-all active:scale-95 shadow-md shadow-red-600/10 cursor-pointer">
              {editingLicense ? "Actualizar Cambios" : "Guardar Licencia"}
            </button>
          </footer>
        </form>
      </div>
    </div>
  );
}
