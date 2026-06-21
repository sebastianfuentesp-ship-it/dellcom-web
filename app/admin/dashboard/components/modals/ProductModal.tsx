import { Producto, Categoria } from "../../types";

interface Props {
  editingProduct: Producto | null;
  formProductName: string; setFormProductName: (v: string) => void;
  formProductPrice: string; setFormProductPrice: (v: string) => void;
  formProductDesc: string; setFormProductDesc: (v: string) => void;
  formProductCategory: string; setFormProductCategory: (v: string) => void;
  formProductImages: string[];
  formProductActive: boolean; setFormProductActive: (v: boolean) => void;
  categorias: Categoria[];
  uploadingProductIdx: number | null;
  draggingProductImgIdx: number | null;
  setDraggingProductImgIdx: (idx: number | null) => void;
  setPreviewImage: (url: string | null) => void;
  addProductImage: () => void;
  removeProductImage: (idx: number) => void;
  updateProductImage: (idx: number, url: string) => void;
  onUploadFile: (e: React.ChangeEvent<HTMLInputElement>, target: "product", idx: number) => void;
  onProductDrop: (file: File, idx: number) => void;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
}

const inputCls = "w-full bg-slate-50 border border-slate-200 focus:border-red-600 focus:ring-1 focus:ring-red-600 focus:outline-none rounded-xl px-4 py-3 text-sm transition-all";

export default function ProductModal({
  editingProduct,
  formProductName, setFormProductName,
  formProductPrice, setFormProductPrice,
  formProductDesc, setFormProductDesc,
  formProductCategory, setFormProductCategory,
  formProductImages, formProductActive, setFormProductActive,
  categorias, uploadingProductIdx, draggingProductImgIdx, setDraggingProductImgIdx,
  setPreviewImage, addProductImage, removeProductImage, updateProductImage,
  onUploadFile, onProductDrop, onClose, onSubmit,
}: Props) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-xl shadow-2xl relative overflow-hidden">
        <header className="px-8 py-5 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <h3 className="font-bold text-base text-on-surface">
            {editingProduct ? "Editar Producto del Catálogo" : "Registrar Nuevo Producto"}
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 transition-colors cursor-pointer">
            <span className="material-symbols-outlined">close</span>
          </button>
        </header>

        <form onSubmit={onSubmit} className="p-8 space-y-4 max-h-[70vh] overflow-y-auto custom-scrollbar">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Nombre del Producto</label>
              <input type="text" required value={formProductName} onChange={e => setFormProductName(e.target.value)} placeholder="Ribbon de Cera Zebra 110mm x 74m" className={inputCls} />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Precio (S/.)</label>
              <input type="number" step="0.01" min="0" required value={formProductPrice} onChange={e => setFormProductPrice(e.target.value)} placeholder="45.00" className={inputCls} />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Categoría</label>
            <select required value={formProductCategory} onChange={e => setFormProductCategory(e.target.value)} className={inputCls}>
              <option value="">Seleccione una categoría</option>
              {categorias.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.nombre}</option>
              ))}
            </select>
          </div>

          {/* Images */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">Imágenes del Producto</label>
              {formProductImages.length < 5 && (
                <button type="button" onClick={addProductImage} className="text-[10px] font-bold text-red-600 hover:text-red-700 flex items-center gap-1 cursor-pointer">
                  <span className="material-symbols-outlined text-sm">add_photo_alternate</span>Agregar imagen
                </button>
              )}
            </div>
            <div className="space-y-3">
              {formProductImages.map((imgUrl, idx) => (
                <div
                  key={idx}
                  className={`border-2 border-dashed rounded-xl p-3 space-y-1.5 transition-all duration-200 ${
                    draggingProductImgIdx === idx
                      ? "border-red-500 bg-red-50/30 scale-[1.01]"
                      : imgUrl.trim() ? "border-slate-200 bg-slate-50/50 border-solid" : "border-slate-300 bg-slate-50/30"
                  }`}
                  onDragOver={e => { e.preventDefault(); e.stopPropagation(); setDraggingProductImgIdx(idx); }}
                  onDragEnter={e => { e.preventDefault(); e.stopPropagation(); setDraggingProductImgIdx(idx); }}
                  onDragLeave={e => { e.preventDefault(); e.stopPropagation(); if (draggingProductImgIdx === idx) setDraggingProductImgIdx(null); }}
                  onDrop={e => { e.preventDefault(); e.stopPropagation(); setDraggingProductImgIdx(null); const f = e.dataTransfer.files?.[0]; if (f) onProductDrop(f, idx); }}
                >
                  {draggingProductImgIdx === idx && (
                    <div className="flex items-center justify-center gap-2 py-2 text-red-500">
                      <span className="material-symbols-outlined text-lg animate-bounce">cloud_upload</span>
                      <span className="text-[11px] font-bold">Suelta la imagen aquí</span>
                    </div>
                  )}
                  <div className={`flex gap-2 items-center ${draggingProductImgIdx === idx ? "opacity-50" : ""}`}>
                    <div className="img-thumb-wrap shrink-0 w-12 h-12 rounded-lg overflow-hidden bg-white border border-slate-200 flex items-center justify-center">
                      {imgUrl.trim() ? (
                        <img src={imgUrl} alt={`Vista previa ${idx + 1}`} className="w-full h-full object-cover cursor-zoom-in hover:opacity-80 transition-opacity" title="Click para previsualizar"
                          onClick={() => setPreviewImage(imgUrl)}
                          onError={e => { (e.target as HTMLImageElement).style.display = "none"; }}
                        />
                      ) : (
                        <span className="material-symbols-outlined text-slate-300 text-xl leading-none">image</span>
                      )}
                    </div>
                    <input
                      type="text" value={imgUrl} onChange={e => updateProductImage(idx, e.target.value)}
                      placeholder="Arrastra una imagen aquí o pega URL →"
                      className="flex-1 bg-white border border-slate-200 focus:border-red-600 focus:ring-1 focus:ring-red-600 focus:outline-none rounded-xl px-3 py-2.5 text-xs transition-all font-mono"
                    />
                    <label htmlFor={`prod-img-file-${idx}`} className="shrink-0 px-3 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-[10px] font-bold cursor-pointer flex items-center gap-1 transition-colors">
                      <span className="material-symbols-outlined text-sm leading-none">upload</span>Subir
                      <input type="file" id={`prod-img-file-${idx}`} accept="image/*" onChange={e => onUploadFile(e, "product", idx)} disabled={uploadingProductIdx !== null} className="hidden" />
                    </label>
                    {formProductImages.length > 1 && (
                      <button type="button" onClick={() => removeProductImage(idx)} className="shrink-0 p-2 text-slate-400 hover:text-red-600 transition-colors rounded-lg hover:bg-red-50 cursor-pointer" title="Quitar imagen">
                        <span className="material-symbols-outlined text-sm leading-none">delete</span>
                      </button>
                    )}
                  </div>
                  {uploadingProductIdx === idx && (
                    <p className="text-[10px] text-primary font-bold animate-pulse pl-14">Subiendo imagen {idx + 1}...</p>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Descripción del Producto</label>
            <textarea value={formProductDesc} onChange={e => setFormProductDesc(e.target.value)} placeholder="Ribbon de cera de alta sensibilidad para impresoras de etiquetas Zebra..." rows={3} className={inputCls} />
          </div>

          <div className="flex items-center gap-2 py-2">
            <input type="checkbox" id="formProductActive" checked={formProductActive} onChange={e => setFormProductActive(e.target.checked)} className="w-4 h-4 rounded text-red-600 border-slate-200 focus:ring-red-600 focus:outline-none" />
            <label htmlFor="formProductActive" className="text-xs font-semibold text-slate-700 select-none cursor-pointer">Producto activo y visible en el catálogo virtual público</label>
          </div>

          <footer className="pt-4 border-t border-slate-100 flex justify-end gap-3">
            <button type="button" onClick={onClose} className="px-5 py-3 border border-slate-200 hover:bg-slate-50 rounded-xl text-xs font-bold transition-all cursor-pointer">
              Cancelar
            </button>
            <button type="submit" className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold transition-all active:scale-95 shadow-md shadow-red-600/10 cursor-pointer">
              {editingProduct ? "Actualizar Cambios" : "Guardar Producto"}
            </button>
          </footer>
        </form>
      </div>
    </div>
  );
}
