interface Props {
  src: string;
  onClose: () => void;
}

export default function ImagePreviewModal({ src, onClose }: Props) {
  return (
    <div
      className="fixed inset-0 z-[9999] bg-black/85 backdrop-blur-[4px] flex items-center justify-center p-4 animate-fade-in"
      onClick={onClose}
    >
      <div
        className="relative max-w-4xl max-h-[90vh] bg-white dark:bg-slate-800 rounded-3xl overflow-hidden shadow-2xl p-2 border border-slate-200 dark:border-slate-700 flex flex-col items-center justify-center"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-slate-900/60 hover:bg-slate-950 text-white flex items-center justify-center shadow-lg transition-all active:scale-95 cursor-pointer"
        >
          <span className="material-symbols-outlined text-xl">close</span>
        </button>
        <img src={src} alt="Visualización de imagen" className="max-w-full max-h-[85vh] object-contain rounded-2xl" />
      </div>
    </div>
  );
}
