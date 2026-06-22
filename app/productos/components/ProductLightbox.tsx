import { createPortal } from "react-dom";
import { X, ShoppingCart, MessageCircle } from "lucide-react";
import { Producto } from "../types";
import ZoomableImage from "./ZoomableImage";

interface Props {
  product: Producto;
  lightboxImgIdx: number;
  setLightboxImgIdx: (idx: number) => void;
  onClose: () => void;
  onAddToCart: (prod: Producto) => void;
}

export default function ProductLightbox({ product, lightboxImgIdx, setLightboxImgIdx, onClose, onAddToCart }: Props) {
  const imgs = (product.imagen_url || "").split("||").filter(Boolean);
  const activeIdx = Math.min(lightboxImgIdx, Math.max(imgs.length - 1, 0));
  const hasMultiple = imgs.length > 1;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div onClick={onClose} className="absolute inset-0 bg-slate-900/60 backdrop-blur-[4px] transition-opacity duration-300 animate-fade-in" />
      <div className="relative bg-white rounded-[2rem] shadow-2xl border border-slate-100 max-w-2xl w-full overflow-hidden flex flex-col md:flex-row z-10 max-h-[90vh] md:max-h-none">
        {/* Image column */}
        <div className="md:w-1/2 bg-slate-50/50 p-8 flex items-center justify-center border-b md:border-b-0 md:border-r border-slate-100 relative min-h-[250px] md:min-h-[380px]">
          <div className="w-full h-full max-h-[380px] flex items-center justify-center">
            <ZoomableImage
              src={imgs[activeIdx] || (product.imagen_url || "").split("||")[0]}
              alt={product.nombre}
              categoryName={product.categoria?.nombre || "General"}
            />
          </div>
          <span className="absolute top-4 left-4 inline-block px-3 py-1 rounded-full bg-white/90 backdrop-blur-[2px] border border-slate-200/50 text-[9px] text-slate-500 font-extrabold uppercase tracking-widest shadow-sm">
            {product.categoria?.nombre || "General"}
          </span>
          {hasMultiple && (
            <>
              <button onClick={() => setLightboxImgIdx((activeIdx - 1 + imgs.length) % imgs.length)} className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/90 hover:bg-white border border-slate-200 shadow-sm flex items-center justify-center text-slate-500 hover:text-slate-800 transition-all cursor-pointer z-10">
                <span className="material-symbols-outlined text-base leading-none">chevron_left</span>
              </button>
              <button onClick={() => setLightboxImgIdx((activeIdx + 1) % imgs.length)} className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/90 hover:bg-white border border-slate-200 shadow-sm flex items-center justify-center text-slate-500 hover:text-slate-800 transition-all cursor-pointer z-10">
                <span className="material-symbols-outlined text-base leading-none">chevron_right</span>
              </button>
              <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-1.5">
                {imgs.map((_, i) => (
                  <button key={i} onClick={() => setLightboxImgIdx(i)} className={`w-1.5 h-1.5 rounded-full transition-all cursor-pointer border-none p-0 ${i === activeIdx ? "bg-red-600 w-3" : "bg-slate-300 hover:bg-slate-400"}`} />
                ))}
              </div>
            </>
          )}
        </div>

        {/* Info column */}
        <div className="md:w-1/2 p-8 flex flex-col justify-between overflow-y-auto no-scrollbar">
          <div className="space-y-5">
            <div className="flex justify-between items-start">
              <span className="inline-flex items-center gap-1 text-[9px] font-black text-green-600 bg-green-50 border border-green-100 px-2 py-0.5 rounded-md uppercase tracking-wider">
                <span className="h-1.5 w-1.5 rounded-full bg-green-600 animate-pulse" />
                Disponible
              </span>
              <button onClick={onClose} className="w-8 h-8 rounded-full bg-slate-50 hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors flex items-center justify-center cursor-pointer border-none">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-2">
              <h2 className="font-headline text-lg md:text-xl font-bold text-on-surface leading-snug">{product.nombre}</h2>
              <div className="text-xs text-slate-400 font-bold uppercase tracking-wider">DELLCOM STOCK CERTIFICADO</div>
            </div>
            <p className="text-xs text-on-surface-variant leading-relaxed font-sans">
              {product.descripcion || "Consúltanos especificaciones técnicas detalladas, stock en tienda física y compatibilidad exacta para este producto."}
            </p>
            <div className="border border-slate-100 rounded-2xl p-4 bg-slate-50/50 space-y-2.5">
              <div className="flex justify-between text-xs"><span className="text-slate-400 font-bold">Garantía</span><span className="text-slate-700 font-semibold">12 Meses DELLCOM</span></div>
              <div className="flex justify-between text-xs"><span className="text-slate-400 font-bold">Condición</span><span className="text-slate-700 font-semibold">Nuevo Sellado</span></div>
              <div className="flex justify-between text-xs"><span className="text-slate-400 font-bold">Instalación / Soporte</span><span className="text-slate-700 font-semibold text-primary">Disponible (Opcional)</span></div>
            </div>
          </div>
          <div className="pt-6 border-t border-slate-100 mt-6 md:mt-8 space-y-4">
            <div className="flex justify-between items-baseline">
              <span className="text-xs text-slate-400 font-bold uppercase">Precio de Venta</span>
              <span className="font-headline text-2xl font-black text-primary">S/ {Number(product.precio).toFixed(2)}</span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => { onAddToCart(product); onClose(); }}
                className="flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-wider py-3.5 rounded-xl transition-all shadow-md active:scale-95 cursor-pointer border-none"
              >
                <ShoppingCart className="w-4 h-4" />
                Añadir Lista
              </button>
              <a
                href={`https://wa.me/51925981741?text=${encodeURIComponent(`👋 Hola DELLCOM SAC, deseo cotización inmediata para:\n\n💻 *${product.nombre}*\n💰 Precio aprox: S/ ${Number(product.precio).toFixed(2)}\n\n¿Tienen disponibilidad? ¡Gracias! ✅`)}`}
                target="_blank" rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 bg-primary hover:bg-primary/95 text-white font-bold text-xs uppercase tracking-wider py-3.5 rounded-xl transition-all shadow-md shadow-primary/10 active:scale-95 cursor-pointer text-center no-underline border-none"
              >
                <MessageCircle className="w-4 h-4" />
                Cotizar Ya
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
