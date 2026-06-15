/**
 * Vista previa orgánica del portafolio para la página de Inicio.
 * Muestra los trabajos realizados en forma de círculos/burbujas flotantes de diferentes tamaños,
 * emulando el diseño orgánico y asimétrico solicitado.
 * Permite abrir el lightbox para ver detalles del trabajo y cuenta con un botón principal
 * para redirigir al listado completo filtrable en la página de servicios.
 */
"use client";

import { useState, useMemo, useEffect } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";

interface Servicio {
  nombre: string;
}

interface Trabajo {
  id: number;
  titulo: string;
  descripcion: string | null;
  imagen_url: string;
  fecha: Date | string;
  servicio?: Servicio | null;
}

interface HomePortfolioBubblePreviewProps {
  trabajos: Trabajo[];
}

export default function HomePortfolioBubblePreview({ trabajos = [] }: HomePortfolioBubblePreviewProps) {
  const [activeTrabajo, setActiveTrabajo] = useState<Trabajo | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  // Limit to first 6 works for the 6 scattered bubble positions
  const previewTrabajos = useMemo(() => {
    return trabajos.slice(0, 6);
  }, [trabajos]);

  // Specific absolute coordinates and sizes for desktop organic bubble layout
  const bubbleStyles = [
    { // Laptops (Bubble 1)
      size: "w-28 h-28 lg:w-44 lg:h-44",
      position: "lg:left-[2%] lg:top-[15%]",
      floatDelay: "0s",
    },
    { // Impresoras (Bubble 2)
      size: "w-36 h-36 lg:w-56 lg:h-56",
      position: "lg:left-[20%] lg:top-[5%]",
      floatDelay: "1.2s",
    },
    { // Placas Madre (Bubble 3)
      size: "w-24 h-24 lg:w-36 lg:h-36",
      position: "lg:left-[26%] lg:top-[54%]",
      floatDelay: "2.4s",
    },
    { // Cableado Estructurado (Bubble 4)
      size: "w-36 h-36 lg:w-52 lg:h-52",
      position: "lg:left-[47%] lg:top-[22%]",
      floatDelay: "0.7s",
    },
    { // Gamer PC (Bubble 5)
      size: "w-40 h-40 lg:w-60 lg:h-60",
      position: "lg:left-[70%] lg:top-[8%]",
      floatDelay: "1.8s",
    },
    { // Software (Bubble 6)
      size: "w-30 h-30 lg:w-46 lg:h-46",
      position: "lg:left-[64%] lg:top-[55%]",
      floatDelay: "3.1s",
    }
  ];

  const handleOpenLightbox = (trabajo: Trabajo) => {
    setCurrentImageIndex(0);
    setActiveTrabajo(trabajo);
    document.body.style.overflow = "hidden";
  };

  const handleCloseLightbox = () => {
    setActiveTrabajo(null);
    document.body.style.overflow = "unset";
  };

  const formatDate = (dateVal: Date | string) => {
    try {
      const d = new Date(dateVal);
      return d.toLocaleDateString("es-ES", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
    } catch {
      return "Reciente";
    }
  };

  const parsedData = useMemo(() => {
    if (!activeTrabajo) return { text: "", images: [] as string[] };
    const parts = activeTrabajo.descripcion?.split("||") || [];
    const text = parts[0] || "";
    const extraImagesString = parts[1] || "";
    const imagesList = extraImagesString ? extraImagesString.split(",") : [activeTrabajo.imagen_url];
    return { text, images: imagesList };
  }, [activeTrabajo]);

  const handleNextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev + 1) % parsedData.images.length);
  };

  const handlePrevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev - 1 + parsedData.images.length) % parsedData.images.length);
  };

  const getWhatsAppLink = (trabajo: Trabajo) => {
    const message = `Hola DELLCOM, vi su trabajo de "${trabajo.titulo}" en su portafolio y me gustaría cotizar un servicio similar.`;
    return `https://wa.me/51925981741?text=${encodeURIComponent(message)}`;
  };

  return (
    <div className="w-full">
      {/* Organic Floating Grid Container */}
      <div className="relative min-h-[500px] lg:min-h-[660px] w-full mt-8 select-none">
        
        {/* Scattered Bubbles (Absolute on Desktop, Flex wrap grid on mobile) */}
        <div className="hidden lg:block w-full h-full min-h-[560px]">
          {previewTrabajos.map((trabajo, index) => {
            const style = bubbleStyles[index] || bubbleStyles[0];
            return (
              <div
                key={trabajo.id}
                onClick={() => handleOpenLightbox(trabajo)}
                style={{
                  animation: `float 6s ease-in-out infinite`,
                  animationDelay: style.floatDelay,
                }}
                className={`absolute ${style.position} ${style.size} rounded-full overflow-hidden border-2 border-slate-200/80 shadow-lg hover:shadow-2xl hover:scale-105 hover:border-primary transition-all duration-500 cursor-pointer group z-10`}
              >
                <img
                  src={trabajo.imagen_url}
                  alt={trabajo.titulo}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                {/* Overlay on hover */}
                <div className="absolute inset-0 bg-primary/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-center items-center p-4 text-center">
                  <span className="bg-white/20 text-white text-[8px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-widest mb-1.5">
                    {trabajo.servicio?.nombre || "Garantía IT"}
                  </span>
                  <p className="text-white font-headline text-[10px] md:text-xs font-bold leading-snug line-clamp-3">
                    {trabajo.titulo}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Responsive Mobile Flex Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 lg:hidden px-4">
          {previewTrabajos.map((trabajo) => (
            <div
              key={trabajo.id}
              onClick={() => handleOpenLightbox(trabajo)}
              className="flex flex-col items-center text-center space-y-2 cursor-pointer group"
            >
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden border-2 border-slate-200 shadow-md group-hover:border-primary transition-all duration-300">
                <img
                  src={trabajo.imagen_url}
                  alt={trabajo.titulo}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <span className="text-[9px] text-primary font-bold uppercase tracking-wider">
                {trabajo.servicio?.nombre || "Servicio"}
              </span>
              <h4 className="font-headline text-[10px] sm:text-xs font-bold text-on-surface line-clamp-2 leading-snug px-1">
                {trabajo.titulo}
              </h4>
            </div>
          ))}
        </div>

        {/* Text and Year Badge (Emulating the left text area from screenshot) */}
        <div className="relative lg:absolute lg:left-[5%] lg:bottom-[8%] mt-12 lg:mt-0 max-w-sm px-4 text-center lg:text-left z-20">
          <div className="flex items-center justify-center lg:justify-start gap-3 mb-2">
            <span className="text-3xl lg:text-4xl font-black font-headline text-slate-800 leading-none">2026</span>
            <span className="h-5 w-px bg-slate-350" />
            <span className="text-[10px] text-primary font-extrabold uppercase tracking-widest">Garantía Real</span>
          </div>
          <h3 className="font-headline text-lg lg:text-xl font-black text-on-surface leading-tight">
            Galería de <span className="text-primary">Casos de Éxito</span>
          </h3>
          <p className="text-xs text-on-surface-variant leading-relaxed mt-1 font-semibold">
            Haz clic en los círculos para revisar detalles de reparación de placas, montajes e impresoras.
          </p>
          <div className="mt-4">
            <Link
              href="/servicios#portafolio"
              className="inline-flex items-center gap-2 bg-primary hover:bg-primary/95 text-white px-7 py-3 rounded-2xl text-xs font-bold uppercase tracking-wider transition-all active:scale-95 shadow-md shadow-primary/10"
            >
              Ver todos los trabajos
              <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </Link>
          </div>
        </div>

      </div>

      {/* Lightbox Modal rendered via Portal */}
      {activeTrabajo && mounted && createPortal(
        <div 
          className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-fade-in"
          onClick={handleCloseLightbox}
        >
          <div 
            className="bg-white rounded-[2.5rem] border border-slate-900/15 shadow-2xl max-w-4xl w-full overflow-hidden flex flex-col md:flex-row relative max-h-[90vh] md:max-h-[85vh] animate-scale-up"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={handleCloseLightbox}
              className="absolute top-4 right-4 z-20 w-9 h-9 bg-white/90 backdrop-blur-sm border border-slate-200/50 rounded-full flex items-center justify-center text-slate-500 hover:text-primary hover:scale-105 transition-all shadow-md cursor-pointer"
            >
              <span className="material-symbols-outlined text-[20px] font-bold">close</span>
            </button>

            {/* Left Side: Image Carousel */}
            <div className="w-full md:w-1/2 relative bg-slate-950 min-h-[280px] md:min-h-[460px] flex items-center justify-center select-none overflow-hidden">
              {parsedData.images.map((imgUrl, idx) => (
                <img
                  key={idx}
                  src={imgUrl}
                  alt={`${activeTrabajo.titulo} - Imagen ${idx + 1}`}
                  className={`w-full h-full object-cover absolute inset-0 transition-all duration-700 ease-in-out ${
                    idx === currentImageIndex 
                      ? "opacity-100 scale-100 pointer-events-auto" 
                      : "opacity-0 scale-95 pointer-events-none"
                  }`}
                  loading="lazy"
                />
              ))}
              
              {/* Carousel Controls */}
              {parsedData.images.length > 1 && (
                <>
                  {/* Left Arrow */}
                  <button
                    onClick={handlePrevImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-9 h-9 bg-white/85 backdrop-blur-sm border border-slate-200/40 rounded-full flex items-center justify-center text-slate-700 hover:text-primary hover:scale-105 active:scale-95 transition-all shadow-md cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[18px] font-bold">chevron_left</span>
                  </button>
                  {/* Right Arrow */}
                  <button
                    onClick={handleNextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-9 h-9 bg-white/85 backdrop-blur-sm border border-slate-200/40 rounded-full flex items-center justify-center text-slate-700 hover:text-primary hover:scale-105 active:scale-95 transition-all shadow-md cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[18px] font-bold">chevron_right</span>
                  </button>
                  {/* Dot Indicators */}
                  <div className="absolute bottom-4 flex gap-1.5 justify-center z-10 w-full">
                    {parsedData.images.map((_, dotIdx) => (
                      <button
                        key={dotIdx}
                        onClick={(e) => { e.stopPropagation(); setCurrentImageIndex(dotIdx); }}
                        className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                          dotIdx === currentImageIndex
                            ? "bg-primary w-5"
                            : "bg-white/50 w-2 hover:bg-white"
                        }`}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Right Side: Details */}
            <div className="w-full md:w-1/2 p-6 md:p-9 flex flex-col justify-between overflow-y-auto max-h-[50vh] md:max-h-[85vh] space-y-6">
              <div className="space-y-4">
                <div className="flex flex-wrap gap-2 items-center">
                  <span className="bg-primary/10 text-primary border border-primary/10 px-3 py-1 rounded-full text-[9px] font-extrabold uppercase tracking-wider">
                    {activeTrabajo.servicio?.nombre || "Servicio Técnico"}
                  </span>
                  <span suppressHydrationWarning className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                    {formatDate(activeTrabajo.fecha)}
                  </span>
                </div>

                <h2 className="font-headline text-lg md:text-xl font-bold text-on-surface leading-snug">
                  {activeTrabajo.titulo}
                </h2>

                <div className="h-px bg-slate-100"></div>

                <div className="space-y-2">
                  <h4 className="text-[9px] font-extrabold uppercase tracking-widest text-slate-400">
                    Descripción del Trabajo
                  </h4>
                  <p className="text-xs md:text-sm text-on-surface-variant leading-relaxed font-semibold">
                    {parsedData.text || "Mantenimiento y soporte especializado realizado por técnicos certificados de DELLCOM."}
                  </p>
                </div>

                <div className="bg-slate-50 rounded-2xl p-4 border border-slate-150/50 flex items-start gap-3">
                  <span className="material-symbols-outlined text-emerald-600 font-bold">verified_user</span>
                  <div className="space-y-0.5">
                    <p className="text-[10px] font-extrabold uppercase tracking-wider text-slate-700">Garantía DELLCOM SAC</p>
                    <p className="text-[11px] text-slate-500 font-semibold leading-normal">
                      Todos nuestros trabajos incluyen diagnóstico electrónico preciso y garantía de operatividad.
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Button: WhatsApp CTA */}
              <div className="pt-2">
                <a
                  href={getWhatsAppLink(activeTrabajo)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2.5 bg-[#25D366] hover:bg-[#20ba59] text-white py-4 px-6 rounded-2xl text-xs font-bold uppercase tracking-wider transition-all shadow-md shadow-emerald-500/10 hover:shadow-emerald-500/20 active:scale-[0.98] cursor-pointer"
                >
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                  </svg>
                  Cotizar / Consultar por WhatsApp
                </a>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
