import { Usuario } from "../../types";

interface Props {
  editingUser: Usuario | null;
  formUserNombre: string; setFormUserNombre: (v: string) => void;
  formUserUsuario: string; setFormUserUsuario: (v: string) => void;
  formUserEmail: string; setFormUserEmail: (v: string) => void;
  formUserContrasena: string; setFormUserContrasena: (v: string) => void;
  formUserRol: string; setFormUserRol: (v: string) => void;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
}

const inputCls = "w-full bg-slate-50 border border-slate-200 focus:border-red-600 focus:ring-1 focus:ring-red-600 focus:outline-none rounded-xl px-4 py-3 text-sm transition-all";

export default function UserModal({
  editingUser,
  formUserNombre, setFormUserNombre,
  formUserUsuario, setFormUserUsuario,
  formUserEmail, setFormUserEmail,
  formUserContrasena, setFormUserContrasena,
  formUserRol, setFormUserRol,
  onClose, onSubmit,
}: Props) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-lg shadow-2xl relative overflow-hidden">
        <header className="px-8 py-5 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <h3 className="font-bold text-base text-on-surface">
            {editingUser ? "Editar Personal / Usuario" : "Registrar Nuevo Personal"}
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 transition-colors cursor-pointer">
            <span className="material-symbols-outlined">close</span>
          </button>
        </header>

        <form onSubmit={onSubmit} className="p-8 space-y-4">
          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Nombre Completo</label>
            <input type="text" required value={formUserNombre} onChange={e => setFormUserNombre(e.target.value)} placeholder="Ej. Juan Pérez" className={inputCls} />
          </div>

          {editingUser ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Nombre de Usuario</label>
                <input type="text" required value={formUserUsuario} onChange={e => setFormUserUsuario(e.target.value)} placeholder="Ej. jperez" className={inputCls} />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Rol</label>
                <select value={formUserRol} onChange={e => setFormUserRol(e.target.value)} className={inputCls}>
                  <option value="tecnico">Técnico</option>
                  <option value="vendedor">Vendedor</option>
                  <option value="admin">Administrador</option>
                </select>
              </div>
            </div>
          ) : (
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Rol</label>
              <select value={formUserRol} onChange={e => setFormUserRol(e.target.value)} className={inputCls}>
                <option value="tecnico">Técnico</option>
                <option value="vendedor">Vendedor</option>
                <option value="admin">Administrador</option>
              </select>
            </div>
          )}

          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Correo Electrónico</label>
            <input type="email" required value={formUserEmail} onChange={e => setFormUserEmail(e.target.value)} placeholder="Ej. jperez@dellcom.pe" className={inputCls} />
          </div>

          {editingUser ? (
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Contraseña (Dejar en blanco para conservar actual)</label>
              <input type="password" value={formUserContrasena} onChange={e => setFormUserContrasena(e.target.value)} placeholder="Mínimo 6 caracteres" className={inputCls} />
            </div>
          ) : (
            <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 flex items-start gap-3">
              <span className="material-symbols-outlined text-amber-500 text-base mt-0.5 shrink-0">info</span>
              <p className="text-xs text-amber-700 font-semibold leading-relaxed">
                El usuario y contraseña temporal serán generados automáticamente y enviados al correo ingresado. El personal deberá establecer su propia contraseña al primer ingreso.
              </p>
            </div>
          )}

          <footer className="pt-4 border-t border-slate-100 flex justify-end gap-3">
            <button type="button" onClick={onClose} className="px-5 py-3 border border-slate-200 hover:bg-slate-50 rounded-xl text-xs font-bold transition-all cursor-pointer">
              Cancelar
            </button>
            <button type="submit" className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold transition-all active:scale-95 shadow-md shadow-red-600/10 cursor-pointer">
              {editingUser ? "Actualizar Cambios" : "Guardar Personal"}
            </button>
          </footer>
        </form>
      </div>
    </div>
  );
}
