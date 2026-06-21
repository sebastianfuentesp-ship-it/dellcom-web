import { Categoria } from "../../types";

interface Props {
  filteredCategorias: Categoria[];
  canEditCatalogo: boolean;
  canDelete: boolean;
  onOpenCreate: () => void;
  onEdit: (cat: Categoria) => void;
  onDelete: (id: number) => void;
}

export default function CategoriesTab({ filteredCategorias, canEditCatalogo, canDelete, onOpenCreate, onEdit, onDelete }: Props) {
  return (
    <section className="animate-fade-in-up">
      <div className="flex justify-between items-end mb-6">
        <div>
          <h2 className="text-xl font-bold text-on-surface">Categorías de Productos</h2>
          <p className="text-xs text-slate-500 mt-0.5">Gestión de las categorías del catálogo virtual de suministros y hardware.</p>
        </div>
        {canEditCatalogo && (
          <button
            onClick={onOpenCreate}
            className="bg-red-600 hover:bg-red-700 text-white text-xs font-bold px-5 py-3 rounded-xl transition-all active:scale-95 shadow-md shadow-red-600/10 flex items-center gap-2 cursor-pointer"
          >
            <span className="material-symbols-outlined text-base">add</span>
            Crear Categoría
          </button>
        )}
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm max-w-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="px-6 py-3.5 text-xs font-bold text-slate-500 uppercase tracking-wider">Nombre de la Categoría</th>
                <th className="px-6 py-3.5 text-xs font-bold text-slate-500 uppercase tracking-wider">Estado</th>
                <th className="px-6 py-3.5 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredCategorias.length > 0 ? (
                filteredCategorias.map((cat) => (
                  <tr key={cat.id} className="transition-colors hover:bg-slate-50/50">
                    <td className="px-6 py-4 text-xs font-semibold text-on-surface">{cat.nombre}</td>
                    <td className="px-6 py-4 text-xs">
                      {cat.activo ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">Activo</span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-400 text-[10px] font-bold">Inactivo</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      {canEditCatalogo && (
                        <button onClick={() => onEdit(cat)} className="text-slate-400 hover:text-red-600 p-1 transition-colors cursor-pointer" title="Editar">
                          <span className="material-symbols-outlined text-[18px]">edit</span>
                        </button>
                      )}
                      {canDelete && (
                        <button onClick={() => onDelete(cat.id)} className="text-slate-400 hover:text-red-700 p-1 transition-colors cursor-pointer" title="Desactivar">
                          <span className="material-symbols-outlined text-[18px]">block</span>
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3} className="px-6 py-12 text-center text-xs text-slate-500">
                    No se encontraron categorías registradas.
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
