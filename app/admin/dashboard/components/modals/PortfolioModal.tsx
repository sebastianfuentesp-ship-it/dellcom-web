import { TrabajoRealizado, Servicio } from "../../types";

interface Props {
  editingPortfolio: TrabajoRealizado | null;
  formPortfolioTitle: string; setFormPortfolioTitle: (v: string) => void;
  formPortfolioDesc: string; setFormPortfolioDesc: (v: string) => void;
  formPortfolioImgUrl: string; setFormPortfolioImgUrl: (v: string) => void;
  formPortfolioExtraImgs: string[]; setFormPortfolioExtraImgs: React.Dispatch<React.SetStateAction<string[]>>;
  formPortfolioServiceId: string; setFormPortfolioServiceId: (v: string) => void;
  servicios: Servicio[];
  uploading: boolean;
  uploadingPortfolioExtraIdx: number | null;
  draggingPortfolioMain: boolean; setDraggingPortfolioMain: (v: boolean) => void;
  draggingPortfolioExtraIdx: number | null; setDraggingPortfolioExtraIdx: (idx: number | null) => void;
  setPreviewImage: (url: string | null) => void;
  onUploadFile: (e: React.ChangeEvent<HTMLInputElement>, target: "portfolio" | "portfolio-extra", idx?: number) => void;
  onPortfolioMainDrop: (file: File) => void;
  onPortfolioExtraDrop: (file: File, idx: number) => void;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
}

const inputCls = "w-full bg-white dark:bg-slate-600 border border-slate-200 dark:border-slate-500 focus:border-red-600 focus:ring-1 focus:ring-red-600 focus:outline-none rounded-xl px-4 py-3 text-sm transition-all dark:text-slate-100 dark:placeholder:text-slate-400";

export default function PortfolioModal({
  editingPortfolio,
  formPortfolioTitle, setFormPortfolioTitle,
  formPortfolioDesc, setFormPortfolioDesc,
  formPortfolioImgUrl, setFormPortfolioImgUrl,
  formPortfolioExtraImgs, setFormPortfolioExtraImgs,
  formPortfolioServiceId, setFormPortfolioServiceId,
  servicios, uploading, uploadingPortfolioExtraIdx,
  draggingPortfolioMain, setDraggingPortfolioMain,
  draggingPortfolioExtraIdx, setDraggingPortfolioExtraIdx,
  setPreviewImage, onUploadFile, onPortfolioMainDrop, onPortfolioExtraDrop,
  onClose, onSubmit,
}: Props) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-xl shadow-2xl relative overflow-hidden">
        <header className="px-8 py-5 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <h3 className="font-bold text-base text-on-surface">
            {editingPortfolio ? "Editar Trabajo de Portafolio" : "Registrar Trabajo en Portafolio"}
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 transition-colors border-none bg-transparent cursor-pointer">
            <span className="material-symbols-outlined">close</span>
          </button>
        </header>

        <form onSubmit={onSubmit} className="p-8 space-y-4 max-h-[70vh] overflow-y-auto custom-scrollbar">
          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Título del Trabajo</label>
            <input type="text" required value={formPortfolioTitle} onChange={e => setFormPortfolioTitle(e.target.value)} placeholder="Ej: Cableado Estructurado en Laboratorio" className="w-full bg-slate-50 border border-slate-200 focus:border-red-600 focus:ring-1 focus:ring-red-600 focus:outline-none rounded-xl px-4 py-3 text-sm transition-all" />
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Descripción corta</label>
            <textarea value={formPortfolioDesc} onChange={e => setFormPortfolioDesc(e.target.value)} placeholder="Detalles sobre lo realizado en este proyecto técnico..." rows={3} className="w-full bg-slate-50 border border-slate-200 focus:border-red-600 focus:ring-1 focus:ring-red-600 focus:outline-none rounded-xl px-4 py-3 text-sm transition-all resize-none" />
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Asociar a un Servicio de la Web</label>
            <select value={formPortfolioServiceId} onChange={e => setFormPortfolioServiceId(e.target.value)} className="w-full bg-slate-50 border border-slate-200 focus:border-red-600 focus:ring-1 focus:ring-red-600 focus:outline-none rounded-xl px-4 py-3 text-sm transition-all">
              <option value="">Ninguno / General</option>
              {servicios.map(s => <option key={s.id} value={s.id}>{s.nombre}</option>)}
            </select>
          </div>

          {/* Main image */}
          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Foto principal (portada)</label>
            <div
              className={`border-2 border-dashed rounded-xl p-3 space-y-2 transition-all duration-200 ${
                draggingPortfolioMain ? "border-red-500 bg-red-50/30 scale-[1.01]" : formPortfolioImgUrl ? "border-slate-200 bg-slate-50/50 border-solid" : "border-slate-300 bg-slate-50/30"
              }`}
              onDragOver={e => { e.preventDefault(); e.stopPropagation(); setDraggingPortfolioMain(true); }}
              onDragEnter={e => { e.preventDefault(); e.stopPropagation(); setDraggingPortfolioMain(true); }}
              onDragLeave={e => { e.preventDefault(); e.stopPropagation(); setDraggingPortfolioMain(false); }}
              onDrop={e => { e.preventDefault(); e.stopPropagation(); setDraggingPortfolioMain(false); const f = e.dataTransfer.files?.[0]; if (f) onPortfolioMainDrop(f); }}
            >
              {draggingPortfolioMain && (
                <div className="flex items-center justify-center gap-2 py-2 text-red-500">
                  <span className="material-symbols-outlined text-lg animate-bounce">cloud_upload</span>
                  <span className="text-[11px] font-bold">Suelta la imagen aquí</span>
                </div>
              )}
              <div className={`flex gap-3 items-center ${draggingPortfolioMain ? "opacity-50" : ""}`}>
                {formPortfolioImgUrl && (
                  <img src={formPortfolioImgUrl} alt="portada" className="w-12 h-12 object-cover rounded-xl border border-slate-200 shrink-0 cursor-zoom-in hover:opacity-80 transition-opacity" title="Click para previsualizar" onClick={() => setPreviewImage(formPortfolioImgUrl)} />
                )}
                <input type="text" required value={formPortfolioImgUrl} onChange={e => setFormPortfolioImgUrl(e.target.value)} placeholder="Arrastra una imagen aquí o pega URL →" className={inputCls} />
                <div className="relative shrink-0">
                  <input type="file" id="formPortfolioImgFile" onChange={e => onUploadFile(e, "portfolio")} className="hidden" accept="image/*" />
                  <label htmlFor="formPortfolioImgFile" className="px-4 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold transition-all cursor-pointer inline-flex items-center gap-1.5">
                    {uploading
                      ? <span className="material-symbols-outlined text-sm animate-spin">progress_activity</span>
                      : <span className="material-symbols-outlined text-sm">upload</span>
                    }
                    Subir
                  </label>
                </div>
              </div>
              {uploading && <span className="text-[10px] text-red-600 font-bold block">Cargando archivo...</span>}
            </div>
          </div>

          {/* Extra images */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">Fotos adicionales (carrusel)</label>
              <button type="button" onClick={() => setFormPortfolioExtraImgs(prev => [...prev, ""])} className="inline-flex items-center gap-1 text-[10px] font-bold text-red-600 hover:text-red-700 transition-colors cursor-pointer">
                <span className="material-symbols-outlined text-sm">add_photo_alternate</span>Agregar foto
              </button>
            </div>
            {formPortfolioExtraImgs.length === 0 && (
              <p className="text-[10px] text-slate-400 italic">Sin fotos adicionales — solo se mostrará la portada en el carrusel.</p>
            )}
            <div className="space-y-2">
              {formPortfolioExtraImgs.map((url, idx) => (
                <div
                  key={idx}
                  className={`border-2 border-dashed rounded-xl p-2.5 transition-all duration-200 ${
                    draggingPortfolioExtraIdx === idx ? "border-red-500 bg-red-50/30 scale-[1.01]" : url.trim() ? "border-slate-200 bg-slate-50/50 border-solid" : "border-slate-300 bg-slate-50/30"
                  }`}
                  onDragOver={e => { e.preventDefault(); e.stopPropagation(); setDraggingPortfolioExtraIdx(idx); }}
                  onDragEnter={e => { e.preventDefault(); e.stopPropagation(); setDraggingPortfolioExtraIdx(idx); }}
                  onDragLeave={e => { e.preventDefault(); e.stopPropagation(); if (draggingPortfolioExtraIdx === idx) setDraggingPortfolioExtraIdx(null); }}
                  onDrop={e => { e.preventDefault(); e.stopPropagation(); setDraggingPortfolioExtraIdx(null); const f = e.dataTransfer.files?.[0]; if (f) onPortfolioExtraDrop(f, idx); }}
                >
                  {draggingPortfolioExtraIdx === idx && (
                    <div className="flex items-center justify-center gap-2 py-1 text-red-500">
                      <span className="material-symbols-outlined text-base animate-bounce">cloud_upload</span>
                      <span className="text-[11px] font-bold">Suelta aquí</span>
                    </div>
                  )}
                  <div className={`flex gap-2 items-center ${draggingPortfolioExtraIdx === idx ? "opacity-50" : ""}`}>
                    <div className="w-10 h-10 flex-shrink-0 rounded-lg overflow-hidden border border-slate-200 bg-slate-100">
                      {url && <img src={url} alt="" className="w-full h-full object-cover cursor-zoom-in hover:opacity-80 transition-opacity" title="Click para previsualizar" onClick={() => setPreviewImage(url)} />}
                    </div>
                    <input
                      type="text" value={url}
                      onChange={e => setFormPortfolioExtraImgs(prev => prev.map((u, i) => i === idx ? e.target.value : u))}
                      placeholder="Arrastra una imagen o pega URL →"
                      className="flex-1 bg-white border border-slate-200 focus:border-red-600 focus:ring-1 focus:ring-red-600 focus:outline-none rounded-xl px-3 py-2 text-sm transition-all"
                    />
                    <div className="relative flex-shrink-0">
                      <input type="file" id={`formPortfolioExtra_${idx}`} onChange={e => onUploadFile(e, "portfolio-extra", idx)} className="hidden" accept="image/*" />
                      <label htmlFor={`formPortfolioExtra_${idx}`} className="px-3 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-xl text-xs font-bold transition-all cursor-pointer inline-flex items-center gap-1">
                        {uploadingPortfolioExtraIdx === idx
                          ? <span className="material-symbols-outlined text-sm animate-spin">progress_activity</span>
                          : <span className="material-symbols-outlined text-sm">upload</span>
                        }
                      </label>
                    </div>
                    <button type="button" onClick={() => setFormPortfolioExtraImgs(prev => prev.filter((_, i) => i !== idx))} className="flex-shrink-0 p-2 text-slate-400 hover:text-red-600 transition-colors cursor-pointer">
                      <span className="material-symbols-outlined text-sm">delete</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <footer className="pt-4 border-t border-slate-100 flex justify-end gap-3">
            <button type="button" onClick={onClose} className="px-5 py-3 border border-slate-200 hover:bg-slate-50 rounded-xl text-xs font-bold transition-all cursor-pointer">
              Cancelar
            </button>
            <button type="submit" className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold transition-all active:scale-95 shadow-md shadow-red-600/10 cursor-pointer">
              {editingPortfolio ? "Actualizar Cambios" : "Registrar Trabajo"}
            </button>
          </footer>
        </form>
      </div>
    </div>
  );
}
