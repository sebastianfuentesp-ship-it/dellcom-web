import { Usuario } from "../../types";

interface Props {
  filteredUsuarios: Usuario[];
  onOpenCreate: () => void;
  onEdit: (user: Usuario) => void;
  onToggleStatus: (id: number, current: boolean) => void;
}

export default function UsersTab({ filteredUsuarios, onOpenCreate, onEdit, onToggleStatus }: Props) {
  return (
    <section className="animate-fade-in-up">
      <div className="flex justify-between items-end mb-6">
        <div>
          <h2 className="text-xl font-bold text-on-surface">Gestión de Personal y Cuentas</h2>
          <p className="text-xs text-slate-500 mt-0.5">Creación y control de acceso para técnicos y vendedores de DELLCOM SAC.</p>
        </div>
        <button
          onClick={onOpenCreate}
          className="bg-red-600 hover:bg-red-700 text-white text-xs font-bold px-5 py-3 rounded-xl transition-all active:scale-95 shadow-md shadow-red-600/10 flex items-center gap-2 cursor-pointer"
        >
          <span className="material-symbols-outlined text-base">person_add</span>
          Registrar Personal
        </button>
      </div>

      {/* Users Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[
          { label: "Personal Activo", value: filteredUsuarios.filter(u => u.activo).length, icon: "group", bg: "bg-emerald-50 text-emerald-600" },
          { label: "Administradores", value: filteredUsuarios.filter(u => u.rol === "admin").length, icon: "admin_panel_settings", bg: "bg-red-50 text-red-600" },
          { label: "Técnicos", value: filteredUsuarios.filter(u => u.rol === "tecnico").length, icon: "engineering", bg: "bg-blue-50 text-blue-600" },
          { label: "Vendedores", value: filteredUsuarios.filter(u => u.rol === "vendedor").length, icon: "storefront", bg: "bg-amber-50 text-amber-600" },
        ].map((item, i) => (
          <div key={i} className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm flex items-center gap-4 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300">
            <div className={`p-3 rounded-xl ${item.bg}`}>
              <span className="material-symbols-outlined text-2xl">{item.icon}</span>
            </div>
            <div>
              <h4 className="font-bold text-sm text-on-surface">{item.label}</h4>
              <p className="text-xs text-slate-500 mt-0.5"><span className="font-extrabold text-slate-800 text-base">{item.value}</span> personas</p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="px-6 py-3.5 text-xs font-bold text-slate-500 uppercase tracking-wider">Nombre Completo</th>
                <th className="px-6 py-3.5 text-xs font-bold text-slate-500 uppercase tracking-wider">Usuario</th>
                <th className="px-6 py-3.5 text-xs font-bold text-slate-500 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3.5 text-xs font-bold text-slate-500 uppercase tracking-wider">Rol</th>
                <th className="px-6 py-3.5 text-xs font-bold text-slate-500 uppercase tracking-wider">Estado</th>
                <th className="px-6 py-3.5 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredUsuarios.length > 0 ? (
                filteredUsuarios.map((u) => (
                  <tr key={u.id} className="transition-colors hover:bg-slate-50/50">
                    <td className="px-6 py-4 text-xs font-semibold text-on-surface">{u.nombre}</td>
                    <td className="px-6 py-4 text-xs text-slate-600">{u.usuario}</td>
                    <td className="px-6 py-4 text-xs text-slate-500">{u.email}</td>
                    <td className="px-6 py-4 text-xs">
                      <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        u.rol === "admin" ? "bg-red-100 text-red-800" : u.rol === "tecnico" ? "bg-blue-100 text-blue-800" : "bg-slate-100 text-slate-800"
                      }`}>
                        {u.rol}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {u.activo ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>Activo
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-400 text-[10px] font-bold">
                          <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>Desactivado
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <button onClick={() => onEdit(u)} className="text-slate-400 hover:text-red-600 p-1 transition-colors cursor-pointer" title="Editar">
                        <span className="material-symbols-outlined text-[18px]">edit</span>
                      </button>
                      <button onClick={() => onToggleStatus(u.id, u.activo)} className="text-slate-400 hover:text-red-700 p-1 transition-colors cursor-pointer" title={u.activo ? "Desactivar Cuenta" : "Activar Cuenta"}>
                        <span className="material-symbols-outlined text-[18px]">{u.activo ? "block" : "check_circle"}</span>
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-xs text-slate-500">
                    No se encontraron usuarios registrados.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
