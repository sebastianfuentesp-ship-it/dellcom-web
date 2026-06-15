/**
 * Galería de portfolio con filtrado por categoría y lightbox.
 * Funcionalidades principales:
 *  - Pestañas de categoría derivadas dinámicamente de los servicios de cada trabajo.
 *  - Paginación progresiva: muestra 6 trabajos y permite cargar más.
 *  - Lightbox con carrusel de imágenes (soporta múltiples imágenes en el campo
 *    descripcion separadas por "||" y "," → "texto del trabajo||url1,url2,url3").
 *  - El modal se monta con createPortal en document.body para evitar problemas
 *    de z-index y que el estado `mounted` previene la hidratación SSR del portal.
 */
"use client";

import { useState, useMemo, useEffect } from "react";
import { createPortal } from "react-dom";

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

interface PortfolioGalleryProps {
  trabajos: Trabajo[];
}

export default function PortfolioGallery({ trabajos = [] }: PortfolioGalleryProps) {
  const [selectedCategory, setSelectedCategory] = useState("Todos");
  const [visibleCount, setVisibleCount] = useState(6);
  const [activeTrabajo, setActiveTrabajo] = useState<Trabajo | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [mounted, setMounted] = useState(false);

  // Mount check for client-side rendering (prevent SSR hydration mismatch with Portal)
  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  // Extract unique category names from works list dynamically
  const categories = useMemo(() => {
    const serviceNames = trabajos
      .map((t) => t.servicio?.nombre)
      .filter((name): name is string => typeof name === "string" && name.trim() !== "");
    return ["Todos", ...Array.from(new Set(serviceNames))];
  }, [trabajos]);

  // Filter works based on active tab
  const filteredTrabajos = useMemo(() => {
    if (selectedCategory === "Todos") {
      return trabajos;
    }
    return trabajos.filter((t) => t.servicio?.nombre === selectedCategory);
  }, [trabajos, selectedCategory]);

  // Paginated slice
  const visibleTrabajos = useMemo(() => {
    return filteredTrabajos.slice(0, visibleCount);
  }, [filteredTrabajos, visibleCount]);

  const loadMore = () => {
    setVisibleCount((prev) => prev + 6);
  };

  const handleOpenLightbox = (trabajo: Trabajo) => {
    setCurrentImageIndex(0); // Reset slider to first image
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

  // Parse description and optional slider images from description field
  const parsedData = useMemo(() => {
    if (!activeTrabajo) return { text: "", images: [] as string[] };
    
    const parts = activeTrabajo.descripcion?.split("||") || [];
    const text = parts[0] || "";
    const extraImagesString = parts[1] || "";
    
    // Fallback if no extra images: use the main imagen_url
    const imagesList = extraImagesString
      ? extraImagesString.split(",")
      : [activeTrabajo.imagen_url];
      
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
    <div className="w-full animate-fade-in">
      {/* Category Tabs */}
      {categories.length > 2 && (
        <div className="flex flex-wrap justify-center gap-2 md:gap-3 mb-12 max-w-4xl mx-auto px-4">
          {categories.map((cat) => {
            const isActive = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => { setSelectedCategory(cat); setVisibleCount(6); }}
                className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all duration-300 border cursor-pointer ${
                  isActive
                    ? "bg-primary border-primary text-white shadow-md shadow-primary/20 scale-102"
                    : "bg-slate-50 hover:bg-slate-100 text-slate-600 border-slate-200/80 hover:border-slate-300"
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      )}

      {/* Works Grid */}
      {visibleTrabajos.length === 0 ? (
        <div className="text-center py-16 bg-slate-50 rounded-[2.5rem] border border-slate-100">
          <span className="material-symbols-outlined text-4xl text-slate-400 mb-2">
            image_search
          </span>
          <p className="text-sm text-slate-500 font-semibold">
            No se encontraron trabajos en esta categoría por el momento.
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter">
            {visibleTrabajos.map((trabajo, index) => {
              // Parse out only the text for card preview
              const cardParts = trabajo.descripcion?.split("||") || [];
              const cardDesc = cardParts[0] || "";

              return (
                <article
                  key={trabajo.id}
                  onClick={() => handleOpenLightbox(trabajo)}
                  className="group bg-white rounded-[2rem] border border-slate-200/60 overflow-hidden hover:shadow-xl hover:border-primary/20 transition-all duration-500 flex flex-col justify-between cursor-pointer h-full relative"
                  style={{
                    animationDelay: `${(index % 3) * 100}ms`,
                  }}
                >
                  {/* Image Area */}
                  <div className="relative h-52 w-full overflow-hidden bg-slate-50 border-b border-slate-100">
                    <img
                      src={trabajo.imagen_url}
                      alt={trabajo.titulo}
                      className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-700"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    
                    {/* Category Badge */}
                    <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-sm text-white px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider">
                      {trabajo.servicio?.nombre || "Servicio Técnico"}
                    </div>
                  </div>

                  {/* Content Area */}
                  <div className="p-6 flex-1 flex flex-col justify-between space-y-4 bg-white">
                    <div className="space-y-2">
                      <div suppressHydrationWarning className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">
                        Completado el {formatDate(trabajo.fecha)}
                      </div>
                      <h3 className="font-headline text-sm md:text-base font-bold text-on-surface group-hover:text-primary transition-colors duration-300 leading-snug line-clamp-2">
                        {trabajo.titulo}
                      </h3>
                      {cardDesc && (
                        <p className="text-xs text-on-surface-variant leading-relaxed line-clamp-2 font-medium">
                          {cardDesc}
                        </p>
                      )}
                    </div>

                    {/* Action Row */}
                    <div className="pt-4 border-t border-slate-100 flex justify-between items-center text-[9px] font-bold tracking-wider uppercase">
                      <span className="text-emerald-600 flex items-center gap-1 font-semibold">
                        <span className="material-symbols-outlined text-sm font-bold">check_circle</span>
                        Operativo
                      </span>
                      <span className="text-primary flex items-center gap-0.5 group-hover:translate-x-1 transition-transform duration-300">
                        Ver detalles
                        <span className="material-symbols-outlined text-[12px] font-bold">chevron_right</span>
                      </span>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>

          {/* Pagination Button */}
          {filteredTrabajos.length > visibleCount && (
            <div className="text-center mt-12">
              <button
                onClick={loadMore}
                className="inline-flex items-center gap-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200/80 hover:border-primary/40 px-8 py-3.5 rounded-2xl text-xs font-bold uppercase tracking-wider transition-all duration-300 shadow-sm active:scale-95 cursor-pointer"
              >
                Ver más trabajos
                <span className="material-symbols-outlined text-[16px] text-primary">expand_more</span>
              </button>
            </div>
          )}
        </>
      )}

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
                    className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-9 h-9 bg-white/80 hover:bg-white backdrop-blur-sm border border-slate-200/50 rounded-full flex items-center justify-center text-slate-700 hover:text-primary transition-all shadow-md active:scale-95 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[20px] font-bold">chevron_left</span>
                  </button>

                  {/* Right Arrow */}
                  <button
                    onClick={handleNextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-9 h-9 bg-white/80 hover:bg-white backdrop-blur-sm border border-slate-200/50 rounded-full flex items-center justify-center text-slate-700 hover:text-primary transition-all shadow-md active:scale-95 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[20px] font-bold">chevron_right</span>
                  </button>

                  {/* Indicator dots */}
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex gap-1.5 bg-black/35 backdrop-blur-sm px-3.5 py-2 rounded-full">
                    {parsedData.images.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={(e) => {
                          e.stopPropagation();
                          setCurrentImageIndex(idx);
                        }}
                        className={`w-2 h-2 rounded-full transition-all duration-300 cursor-pointer ${
                          idx === currentImageIndex ? "bg-primary w-4" : "bg-white/60 hover:bg-white"
                        }`}
                      ></button>
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
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
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
