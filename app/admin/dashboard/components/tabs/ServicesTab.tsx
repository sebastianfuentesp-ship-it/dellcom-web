import { Servicio } from "../../types";

interface Props {
  filteredServicios: Servicio[];
  canEditCatalogo: boolean;
  canDelete: boolean;
  trabajosCount: number;
  onOpenCreate: () => void;
  onEdit: (srv: Servicio) => void;
  onDelete: (id: number) => void;
}

export default function ServicesTab({ filteredServicios, canEditCatalogo, canDelete, trabajosCount, onOpenCreate, onEdit, onDelete }: Props) {
  return (
    <section className="animate-fade-in-up">
      <div className="flex justify-between items-end mb-6">
        <div>
          <h2 className="text-xl font-bold text-on-surface">Gestión de Servicios de TI</h2>
          <p className="text-xs text-slate-500 mt-0.5">Control del catálogo público de servicios que se ofrecen al cliente.</p>
        </div>
        {canEditCatalogo && (
          <button
            onClick={onOpenCreate}
            className="bg-red-600 hover:bg-red-700 text-white text-xs font-bold px-5 py-3 rounded-xl transition-all active:scale-95 shadow-md shadow-red-600/10 flex items-center gap-2 cursor-pointer"
          >
            <span className="material-symbols-outlined text-base">add</span>
            Crear Servicio
          </button>
        )}
      </div>

      {/* Services Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {[
          { label: "Servicios Activos", value: filteredServicios.filter(s => s.activo).length, icon: "build", bg: "bg-emerald-50 text-emerald-600" },
          { label: "Total Servicios", value: filteredServicios.length, icon: "design_services", bg: "bg-red-50 text-red-600" },
          { label: "Trabajos Portafolio", value: trabajosCount, icon: "photo_library", bg: "bg-slate-100 text-slate-500" },
        ].map((item, i) => (
          <div key={i} className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm flex items-center gap-4 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300">
            <div className={`p-3 rounded-xl ${item.bg}`}>
              <span className="material-symbols-outlined text-2xl">{item.icon}</span>
            </div>
            <div>
              <h4 className="font-bold text-sm text-on-surface">{item.label}</h4>
              <p className="text-xs text-slate-500 mt-0.5"><span className="font-extrabold text-slate-800 text-base">{item.value}</span> elementos</p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="px-6 py-3.5 text-xs font-bold text-slate-500 uppercase tracking-wider">Nombre del Servicio</th>
                <th className="px-6 py-3.5 text-xs font-bold text-slate-500 uppercase tracking-wider">Descripción</th>
                <th className="px-6 py-3.5 text-xs font-bold text-slate-500 uppercase tracking-wider">Icono (Google)</th>
                <th className="px-6 py-3.5 text-xs font-bold text-slate-500 uppercase tracking-wider">Estado</th>
                <th className="px-6 py-3.5 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredServicios.length > 0 ? (
                filteredServicios.map((srv) => (
                  <tr key={srv.id} className="transition-colors hover:bg-slate-50/50">
                    <td className="px-6 py-4 text-xs font-semibold text-on-surface">{srv.nombre}</td>
                    <td className="px-6 py-4 text-xs text-slate-600 max-w-xs truncate">{srv.descripcion}</td>
                    <td className="px-6 py-4 text-xs text-slate-500 font-mono">
                      <span className="flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-sm">{srv.icono_url || "laptop_mac"}</span>
                        {srv.icono_url || "laptop_mac"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {srv.activo ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">Activo</span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-400 text-[10px] font-bold">Inactivo</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      {canEditCatalogo && (
                        <button onClick={() => onEdit(srv)} className="text-slate-400 hover:text-red-600 p-1 transition-colors cursor-pointer" title="Editar">
                          <span className="material-symbols-outlined text-[18px]">edit</span>
                        </button>
                      )}
                      {canDelete && (
                        <button onClick={() => onDelete(srv.id)} className="text-slate-400 hover:text-red-700 p-1 transition-colors cursor-pointer" title="Desactivar">
                          <span className="material-symbols-outlined text-[18px]">block</span>
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-xs text-slate-500">
                    No se encontraron servicios registrados.
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
