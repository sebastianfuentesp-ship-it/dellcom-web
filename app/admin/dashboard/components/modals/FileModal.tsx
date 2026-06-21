interface Props {
  formFileName: string;
  formFileType: string; setFormFileType: (v: string) => void;
  formFileUrl: string;
  formFileDesc: string; setFormFileDesc: (v: string) => void;
  uploading: boolean;
  onFileNameChange: (v: string) => void;
  onFileUrlChange: (v: string) => void;
  onUploadFile: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
}

const inputCls = "w-full bg-slate-50 border border-slate-200 focus:border-red-600 focus:ring-1 focus:ring-red-600 focus:outline-none rounded-xl px-4 py-3 text-sm transition-all";

export default function FileModal({
  formFileName, formFileType, setFormFileType,
  formFileUrl, formFileDesc, setFormFileDesc,
  uploading, onFileNameChange, onFileUrlChange, onUploadFile,
  onClose, onSubmit,
}: Props) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-lg shadow-2xl relative overflow-hidden">
        <header className="px-8 py-5 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <h3 className="font-bold text-base text-on-surface">Registrar Nuevo Recurso / Driver</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 transition-colors cursor-pointer">
            <span className="material-symbols-outlined">close</span>
          </button>
        </header>

        <form onSubmit={onSubmit} className="p-8 space-y-4">
          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Nombre del Recurso</label>
            <input type="text" required value={formFileName} onChange={e => onFileNameChange(e.target.value)} placeholder="Driver de Impresora Zebra GK420t" className={inputCls} />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Tipo de Recurso</label>
              <select value={formFileType} onChange={e => setFormFileType(e.target.value)} className={inputCls}>
                <option value="programa">Programa (.exe)</option>
                <option value="driver">Controlador (Driver)</option>
                <option value="excel">Documento / Excel</option>
                <option value="link">Enlace / Link Útil</option>
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">URL / Link de Descarga</label>
              <input type="text" required value={formFileUrl} onChange={e => onFileUrlChange(e.target.value)} placeholder="https://drive.google.com/..." className={`${inputCls} font-mono text-xs`} />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Subir Archivo de Soporte (Carga Física)</label>
            <input
              type="file"
              onChange={onUploadFile}
              disabled={uploading}
              className="w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-slate-100 file:text-slate-700 hover:file:bg-slate-200 cursor-pointer"
            />
            {uploading ? (
              <p className="text-[10px] text-primary font-bold mt-1 animate-pulse">Subiendo archivo...</p>
            ) : (
              <p className="text-[9px] text-slate-400 mt-1">Límite de 4.5MB para carga directa. Para archivos más pesados, coloca el enlace directo arriba.</p>
            )}
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Descripción corta</label>
            <textarea value={formFileDesc} onChange={e => setFormFileDesc(e.target.value)} placeholder="Parche para Win 10/11, configurar baudrate a 9600..." rows={3} className={inputCls} />
          </div>

          <footer className="pt-4 border-t border-slate-100 flex justify-end gap-3">
            <button type="button" onClick={onClose} className="px-5 py-3 border border-slate-200 hover:bg-slate-50 rounded-xl text-xs font-bold transition-all cursor-pointer">
              Cancelar
            </button>
            <button type="submit" className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold transition-all active:scale-95 shadow-md shadow-red-600/10 cursor-pointer">
              Guardar Recurso
            </button>
          </footer>
        </form>
      </div>
    </div>
  );
}
