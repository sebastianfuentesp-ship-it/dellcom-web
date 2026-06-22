import { Producto, Categoria } from "../../types";

interface Props {
  filteredProductos: Producto[];
  categorias: Categoria[];
  canEditCatalogo: boolean;
  canDelete: boolean;
  setPreviewImage: (url: string | null) => void;
  onOpenCreate: () => void;
  onEdit: (prod: Producto) => void;
  onDelete: (id: number) => void;
}

export default function ProductsTab({ filteredProductos, categorias, canEditCatalogo, canDelete, setPreviewImage, onOpenCreate, onEdit, onDelete }: Props) {
  return (
    <section className="animate-fade-in-up">
      <div className="flex justify-between items-end mb-6">
        <div>
          <h2 className="text-xl font-bold text-on-surface">Productos del Catálogo Web</h2>
          <p className="text-xs text-slate-500 mt-0.5">Control de ribbons, tintas, tarjetas y repuestos mostrados en el catálogo virtual.</p>
        </div>
        {canEditCatalogo && (
          <button
            onClick={onOpenCreate}
            className="bg-red-600 hover:bg-red-700 text-white text-xs font-bold px-5 py-3 rounded-xl transition-all active:scale-95 shadow-md shadow-red-600/10 flex items-center gap-2 cursor-pointer"
          >
            <span className="material-symbols-outlined text-base">add</span>
            Registrar Producto
          </button>
        )}
      </div>

      {/* Products Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {[
          { label: "Productos Activos", value: filteredProductos.filter(p => p.activo).length, icon: "inventory_2", bg: "bg-emerald-50 text-emerald-600" },
          { label: "Total en Catálogo", value: filteredProductos.length, icon: "storefront", bg: "bg-red-50 text-red-600" },
          { label: "Categorías Activas", value: categorias.filter(c => c.activo).length, icon: "local_offer", bg: "bg-slate-100 text-slate-500" },
        ].map((item, i) => (
          <div key={i} className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm flex items-center gap-4 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300">
            <div className={`p-3 rounded-xl ${item.bg}`}>
              <span className="material-symbols-outlined text-2xl">{item.icon}</span>
            </div>
            <div>
              <h4 className="font-bold text-sm text-on-surface">{item.label}</h4>
              <p className="text-xs text-slate-500 mt-0.5"><span className="font-extrabold text-slate-800 text-base">{item.value}</span> registros</p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="px-6 py-3.5 text-xs font-bold text-slate-500 uppercase tracking-wider">Producto</th>
                <th className="px-6 py-3.5 text-xs font-bold text-slate-500 uppercase tracking-wider">Categoría</th>
                <th className="px-6 py-3.5 text-xs font-bold text-slate-500 uppercase tracking-wider">Precio</th>
                <th className="px-6 py-3.5 text-xs font-bold text-slate-500 uppercase tracking-wider">Descripción</th>
                <th className="px-6 py-3.5 text-xs font-bold text-slate-500 uppercase tracking-wider">Estado</th>
                <th className="px-6 py-3.5 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredProductos.length > 0 ? (
                filteredProductos.map((prod) => (
                  <tr key={prod.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {prod.imagen_url && !prod.imagen_url.includes("placeholder.png") ? (
                          <img
                            src={(() => { const f = prod.imagen_url!.split("||")[0]; return f.startsWith("http") || f.startsWith("/") ? f : `/${f}`; })()}
                            alt={prod.nombre}
                            className="w-10 h-10 object-contain rounded-lg border border-slate-200 bg-slate-50 cursor-zoom-in hover:opacity-80 transition-opacity"
                            title="Click para previsualizar"
                            onClick={() => {
                              const f = prod.imagen_url!.split("||")[0];
                              setPreviewImage(f.startsWith("http") || f.startsWith("/") ? f : `/${f}`);
                            }}
                            onError={(e) => {
                              const t = e.currentTarget as HTMLImageElement;
                              t.onerror = null;
                              t.src = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 40 40'><rect width='100%' height='100%' fill='%23f1f5f9'/><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='10' fill='%2394a3b8'>DELLCOM</text></svg>";
                            }}
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-lg border border-slate-200 bg-slate-100 flex items-center justify-center text-slate-400">
                            <span className="material-symbols-outlined text-lg">image</span>
                          </div>
                        )}
                        <span className="font-semibold text-sm text-on-surface">{prod.nombre}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-xs text-slate-600 font-semibold">{prod.categoria?.nombre || "Sin Categoría"}</td>
                    <td className="px-6 py-4 text-xs font-bold text-red-600">S/ {Number(prod.precio).toFixed(2)}</td>
                    <td className="px-6 py-4 text-xs text-slate-500 max-w-xs truncate">{prod.descripcion || "Sin descripción"}</td>
                    <td className="px-6 py-4">
                      {prod.activo ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold uppercase tracking-wider border border-emerald-200">
                          Visible en Web
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[10px] font-bold uppercase tracking-wider border border-slate-200">
                          Oculto
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      {canEditCatalogo && (
                        <button onClick={() => onEdit(prod)} className="text-slate-400 hover:text-red-600 p-1 transition-colors cursor-pointer" title="Editar">
                          <span className="material-symbols-outlined text-[18px]">edit</span>
                        </button>
                      )}
                      {canDelete && (
                        <button onClick={() => onDelete(prod.id)} className="text-slate-400 hover:text-red-700 p-1 transition-colors cursor-pointer" title="Ocultar/Eliminar">
                          <span className="material-symbols-outlined text-[18px]">delete</span>
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-xs text-slate-500">
                    No hay productos registrados en el catálogo.
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
