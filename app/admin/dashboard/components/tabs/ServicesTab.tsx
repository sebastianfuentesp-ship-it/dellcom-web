import { Servicio } from "../../types";

interface Props {
  filteredServicios: Servicio[];
  canEditCatalogo: boolean;
  canDelete: boolean;
  onOpenCreate: () => void;
  onEdit: (srv: Servicio) => void;
  onDelete: (id: number) => void;
}

export default function ServicesTab({ filteredServicios, canEditCatalogo, canDelete, onOpenCreate, onEdit, onDelete }: Props) {
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
