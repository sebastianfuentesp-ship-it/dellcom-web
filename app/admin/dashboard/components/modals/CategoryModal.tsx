import { Categoria } from "../../types";

interface Props {
  editingCategory: Categoria | null;
  formCategoryName: string; setFormCategoryName: (v: string) => void;
  formCategoryActive: boolean; setFormCategoryActive: (v: boolean) => void;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
}

const inputCls = "w-full bg-slate-50 border border-slate-200 focus:border-red-600 focus:ring-1 focus:ring-red-600 focus:outline-none rounded-xl px-4 py-3 text-sm transition-all";

export default function CategoryModal({
  editingCategory, formCategoryName, setFormCategoryName,
  formCategoryActive, setFormCategoryActive, onClose, onSubmit,
}: Props) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-md shadow-2xl relative overflow-hidden">
        <header className="px-8 py-5 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <h3 className="font-bold text-base text-on-surface">
            {editingCategory ? "Editar Categoría" : "Crear Nueva Categoría"}
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 transition-colors border-none bg-transparent cursor-pointer">
            <span className="material-symbols-outlined">close</span>
          </button>
        </header>

        <form onSubmit={onSubmit} className="p-8 space-y-4">
          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Nombre de la Categoría</label>
            <input type="text" required value={formCategoryName} onChange={e => setFormCategoryName(e.target.value)} placeholder="Ej: Tintas Originales" className={inputCls} />
          </div>

          <div className="flex items-center gap-2 pt-2">
            <input
              type="checkbox"
              id="formCategoryActive"
              checked={formCategoryActive}
              onChange={e => setFormCategoryActive(e.target.checked)}
              className="h-4 w-4 rounded border-slate-300 text-red-600 focus:ring-red-600"
            />
            <label htmlFor="formCategoryActive" className="text-xs font-bold text-slate-600 cursor-pointer">Categoría Activa (Visible al Público)</label>
          </div>

          <footer className="pt-4 border-t border-slate-100 flex justify-end gap-3">
            <button type="button" onClick={onClose} className="px-5 py-3 border border-slate-200 hover:bg-slate-50 rounded-xl text-xs font-bold transition-all cursor-pointer">
              Cancelar
            </button>
            <button type="submit" className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold transition-all active:scale-95 shadow-md shadow-red-600/10 cursor-pointer">
              {editingCategory ? "Actualizar Categoría" : "Guardar Categoría"}
            </button>
          </footer>
        </form>
      </div>
    </div>
  );
}
