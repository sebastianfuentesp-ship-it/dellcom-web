/**
 * Página de descargas: /descargas
 * Muestra el repositorio de archivos técnicos (drivers, programas, Excel, links).
 * Carga los archivos desde /api/archivos y usa FALLBACK_ARCHIVOS si la API falla.
 * Permite filtrar por tipo (Todos/Programa/Driver/Excel/Link) y buscar por nombre.
 * Los archivos de tipo "link" abren en nueva pestaña; los demás descargan directamente.
 */
"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import StatusHeader from "../components/StatusHeader";
import CleanFooter from "../components/CleanFooter";
import ScrollRevealObserver from "../components/ScrollRevealObserver";

interface ArchivoTecnico {
  id: number;
  id_usuario?: number;
  nombre: string;
  tipo: "programa" | "driver" | "excel" | "link";
  url_archivo: string;
  descripcion: string | null;
  fecha_subida: string;
}

const FALLBACK_ARCHIVOS: ArchivoTecnico[] = [
  {
    id: 1,
    nombre: "Controlador de Impresora Zebra GK420t",
    tipo: "driver",
    url_archivo: "https://www.zebra.com/us/en/support-downloads.html",
    descripcion: "Controlador oficial certificado de Windows para la impresora térmica Zebra GK420t. Versión de 32/64 bits.",
    fecha_subida: "2026-05-15T00:00:00.000Z"
  },
  {
    id: 2,
    nombre: "Driver de Impresora de Recibos Epson TM-T20III",
    tipo: "driver",
    url_archivo: "https://download.epson-biz.com/?product=tm-t20iii",
    descripcion: "Epson Advanced Printer Driver (APD) para TM-T20III. Recomendado para integración con sistemas POS.",
    fecha_subida: "2026-05-10T00:00:00.000Z"
  },
  {
    id: 3,
    nombre: "AnyDesk Control Remoto",
    tipo: "programa",
    url_archivo: "https://anydesk.com/download",
    descripcion: "Herramienta de control remoto portátil y ligera para que nuestro personal técnico te asista de inmediato.",
    fecha_subida: "2026-05-01T00:00:00.000Z"
  },
  {
    id: 4,
    nombre: "Plantilla Excel de Control de Inventario Dellcom",
    tipo: "excel",
    url_archivo: "https://docs.google.com/spreadsheets/",
    descripcion: "Plantilla diseñada para el registro, conteo y control periódico de stock de suministros e insumos de oficina.",
    fecha_subida: "2026-04-20T00:00:00.000Z"
  }
];

// Helper to overlay official sizes and compatibility metadata on top of files
const getFileMetadata = (file: ArchivoTecnico) => {
  const name = file.nombre.toLowerCase();
  
  if (name.includes("gk420t")) {
    return { tamano: "12.4 MB", compatibilidad: "Windows 10 / 11 (64-bit)", version: "v5.1.16" };
  }
  if (name.includes("tm-t20iii")) {
    return { tamano: "28.1 MB", compatibilidad: "Windows 7 / 8 / 10 / 11", version: "v6.0.4" };
  }
  if (name.includes("anydesk")) {
    return { tamano: "3.8 MB", compatibilidad: "Windows / macOS / Linux", version: "v8.0.10" };
  }
  if (name.includes("inventario")) {
    return { tamano: "1.2 MB", compatibilidad: "Excel / Google Sheets", version: "v2.0" };
  }
  
  switch (file.tipo) {
    case "programa":
      return { tamano: "---", compatibilidad: "Windows / macOS", version: "Oficial" };
    case "driver":
      return { tamano: "---", compatibilidad: "Windows 10 / 11", version: "Oficial" };
    case "excel":
      return { tamano: "---", compatibilidad: "Hojas de Cálculo", version: "v1.0" };
    case "link":
      return { tamano: "Enlace", compatibilidad: "Navegador Web", version: "Oficial" };
    default:
      return { tamano: "---", compatibilidad: "Universal", version: "Oficial" };
  }
};

export default function DescargasPage() {
  const [archivos, setArchivos] = useState<ArchivoTecnico[]>(FALLBACK_ARCHIVOS);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState<string>("Todos");

  useEffect(() => {
    async function loadArchivos() {
      try {
        const res = await fetch("/api/archivos");
        if (res.ok) {
          try {
            const data = await res.json();
            if (Array.isArray(data) && data.length > 0) {
              setArchivos(data);
            }
          } catch (e) {
            console.warn("Failed to parse files API response as JSON.", e);
          }
        }
      } catch (err) {
        console.warn("Error fetching files from API, using static fallbacks.", err);
      }
    }
    loadArchivos();
  }, []);

  const filteredArchivos = archivos.filter((a) => {
    const matchesSearch = 
      a.nombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (a.descripcion && a.descripcion.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesType = 
      selectedType === "Todos" ||
      (selectedType === "Controladores" && a.tipo === "driver") ||
      (selectedType === "Programas" && a.tipo === "programa") ||
      (selectedType === "Documentos" && a.tipo === "excel") ||
      (selectedType === "Enlaces" && a.tipo === "link");

    return matchesSearch && matchesType;
  });

  // Paginación (4 recursos por página)
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 4;
  const downloadsListRef = useRef<HTMLDivElement>(null);

  // Reset a la página 1 cuando cambia el filtro o la búsqueda
  const filterKey = `${searchQuery}|${selectedType}`;
  const [prevFilterKey, setPrevFilterKey] = useState(filterKey);
  if (filterKey !== prevFilterKey) {
    setPrevFilterKey(filterKey);
    setCurrentPage(1);
  }

  const totalPages = Math.max(1, Math.ceil(filteredArchivos.length / ITEMS_PER_PAGE));
  const activePage = Math.min(Math.max(currentPage, 1), totalPages);

  const paginatedArchivos = filteredArchivos.slice(
    (activePage - 1) * ITEMS_PER_PAGE,
    activePage * ITEMS_PER_PAGE
  );

  const goToPage = (n: number) => {
    setCurrentPage(n);
    downloadsListRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const getPageNumbers = (current: number, total: number): (number | "...")[] => {
    if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);

    const keep = new Set<number>([1, 2, total - 1, total, current - 1, current, current + 1]);
    const sorted = [...keep].filter((p) => p >= 1 && p <= total).sort((a, b) => a - b);

    const result: (number | "...")[] = [];
    let prev = 0;
    for (const p of sorted) {
      if (prev && p - prev > 1) result.push("...");
      result.push(p);
      prev = p;
    }
    return result;
  };

  const getIconForType = (type: string) => {
    switch (type) {
      case "programa": return "laptop_mac";
      case "driver": return "memory";
      case "excel": return "description";
      case "link": return "link";
      default: return "folder_open";
    }
  };

  const getLabelForType = (type: string) => {
    switch (type) {
      case "programa": return "Programa (.exe)";
      case "driver": return "Controlador (Driver)";
      case "excel": return "Documento / Excel";
      case "link": return "Enlace Útil";
      default: return "Archivo";
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      timeZone: "UTC"
    });
  };

  return (
    <div className="bg-white min-h-screen flex flex-col justify-between text-on-surface selection:bg-primary/20 selection:text-primary">
      {/* Reusable Status Header */}
      <StatusHeader />

      <main className="pt-16">
        {/* Page Header (Consistent centered layout) */}
        <section className="relative py-16 bg-slate-50/50 overflow-hidden border-b border-slate-100">
          <div className="absolute inset-0 opacity-[0.02] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '16px 16px' }} />
          {/* Glowing bubbles in the background */}
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
          <div className="absolute -bottom-20 -left-20 w-[400px] h-[400px] bg-primary/5 rounded-full blur-[100px] pointer-events-none" />

          <div className="relative px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto w-full text-center z-10 scroll-reveal">
            <span className="inline-block py-1 px-3.5 mb-4 bg-primary/10 border border-primary/15 text-primary font-bold text-[10px] rounded-full uppercase tracking-widest">
              Soporte y Utilidades
            </span>
            <h1 className="font-headline text-3xl md:text-5xl font-black text-on-surface leading-tight tracking-tight">
              Soporte y <span className="text-primary">Descargas</span>
            </h1>
            <p className="text-xs md:text-sm font-semibold text-on-surface-variant max-w-xl mx-auto mt-2 leading-relaxed">
              Accede a nuestro repositorio oficial de utilidades de diagnóstico, plantillas administrativas y controladores autorizados para impresoras Zebra, Epson y equipos corporativos.
            </p>
            
            <div className="pt-6 max-w-md mx-auto">
              <div className="relative bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden focus-within:border-primary/50 focus-within:ring-2 focus-within:ring-primary/10 transition-all">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 select-none">search</span>
                <input 
                  className="w-full pl-12 pr-4 py-3.5 bg-transparent border-none focus:outline-none text-on-surface text-sm placeholder:text-slate-400 font-semibold"
                  placeholder="Buscar controlador, programa, manual..." 
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </div>
        </section>

        {/* Main Downloads View Container */}
        <div className="py-16 max-w-container-max mx-auto w-full px-margin-mobile md:px-margin-desktop space-y-20">
          
          {/* Resources Control Section */}
          <section className="space-y-12">
            
            {/* Category Filters Row */}
            <div className="flex flex-wrap items-center justify-center gap-3 scroll-reveal">
              {[
                { id: "Todos", label: "Todos", icon: "folder_open", count: archivos.length },
                { id: "Controladores", label: "Drivers", icon: "memory", count: archivos.filter(a => a.tipo === "driver").length },
                { id: "Programas", label: "Programas", icon: "laptop_mac", count: archivos.filter(a => a.tipo === "programa").length },
                { id: "Documentos", label: "Documentos", icon: "description", count: archivos.filter(a => a.tipo === "excel").length },
                { id: "Enlaces", label: "Enlaces", icon: "link", count: archivos.filter(a => a.tipo === "link").length }
              ].map((cat) => {
                const isActive = selectedType === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedType(cat.id)}
                    className={`inline-flex items-center gap-2 px-5 py-3 rounded-full border text-xs font-bold transition-all duration-200 cursor-pointer select-none ${
                      isActive 
                        ? "bg-primary border-primary text-white shadow-md shadow-primary/10 -translate-y-0.5"
                        : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-800"
                    }`}
                  >
                    <span className="material-symbols-outlined text-[18px] leading-none">{cat.icon}</span>
                    <span>{cat.label}</span>
                    <span className={`text-[10px] font-black px-2 py-0.5 rounded-full leading-none transition-all ${
                      isActive ? "bg-white/20 text-white" : "bg-slate-200 text-slate-500"
                    }`}>
                      {cat.count}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* List of Files (Detailed Rows Layout) */}
            <div ref={downloadsListRef} className="space-y-4 scroll-reveal">
              {paginatedArchivos.length > 0 ? (
                paginatedArchivos.map((file) => {
                  const meta = getFileMetadata(file);
                  const isFeatured = file.nombre.toLowerCase().includes("anydesk") || file.nombre.toLowerCase().includes("zebra");
                  return (
                    <div 
                      key={file.id} 
                      className="relative bg-white border border-slate-200/80 hover:border-slate-300/80 hover:shadow-xl rounded-[2.5rem] p-6 md:p-8 transition-all duration-300 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 group overflow-hidden"
                    >
                      {/* Left vertical visual line highlight on hover */}
                      <div className="absolute top-0 left-0 bottom-0 w-1.5 bg-primary scale-y-0 group-hover:scale-y-100 transition-transform duration-300 origin-top rounded-l-[2.5rem]" />

                      <div className="flex items-start md:items-center gap-6 flex-1 min-w-0">
                        {/* File Format Visual Icon Badge */}
                        <div className={`w-16 h-16 rounded-2xl flex flex-col items-center justify-center shrink-0 shadow-sm border transition-colors duration-300 ${
                          file.tipo === "driver" ? "bg-blue-50/50 border-blue-100 text-blue-600 group-hover:bg-blue-50" :
                          file.tipo === "programa" ? "bg-emerald-50/50 border-emerald-100 text-emerald-600 group-hover:bg-emerald-50" :
                          file.tipo === "excel" ? "bg-teal-50/50 border-teal-100 text-teal-600 group-hover:bg-teal-50" :
                          "bg-slate-50/50 border-slate-200/60 text-slate-600 group-hover:bg-slate-50"
                        }`}>
                          <span className="material-symbols-outlined text-2xl leading-none">
                            {getIconForType(file.tipo)}
                          </span>
                          <span className="text-[9px] font-extrabold uppercase tracking-wider mt-1 block leading-none">
                            {file.tipo === "driver" ? "DRV" :
                             file.tipo === "programa" ? "EXE" :
                             file.tipo === "excel" ? "XLS" : "LINK"}
                          </span>
                        </div>

                        <div className="space-y-2 flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-slate-100 text-[10px] text-slate-500 font-bold uppercase tracking-wider leading-none">
                              {getLabelForType(file.tipo)}
                            </span>
                            {meta.version && (
                              <span className="text-[9px] bg-slate-50 border border-slate-200/60 text-slate-500 font-extrabold px-2 py-0.5 rounded leading-none">
                                {meta.version}
                              </span>
                            )}
                            {isFeatured && (
                              <span className="text-[9px] bg-primary/10 text-primary border border-primary/15 font-extrabold px-2 py-0.5 rounded-full leading-none uppercase tracking-wider">
                                Destacado
                              </span>
                            )}
                            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wide leading-none">
                              • Subido {formatDate(file.fecha_subida)}
                            </span>
                          </div>
                          
                          <h3 className="font-headline text-base md:text-xl font-black text-on-surface tracking-tight truncate leading-snug group-hover:text-primary transition-colors">
                            {file.nombre}
                          </h3>
                          
                          <p className="text-xs text-on-surface-variant font-semibold leading-relaxed line-clamp-2">
                            {file.descripcion || "Recurso oficial provisto por el equipo técnico de DELLCOM SAC."}
                          </p>

                          {/* Technical Specs Meta */}
                          <div className="flex flex-wrap items-center gap-x-5 gap-y-1 pt-1 text-[11px] text-slate-400 font-bold uppercase">
                            {meta.tamano !== "---" && (
                              <span className="flex items-center gap-1.5">
                                <span className="material-symbols-outlined text-[14px]">database</span>
                                {meta.tamano}
                              </span>
                            )}
                            <span className="flex items-center gap-1.5 text-slate-500">
                              <span className="material-symbols-outlined text-[14px]">desktop_windows</span>
                              {meta.compatibilidad}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* CTA Action */}
                      <div className="w-full md:w-auto shrink-0 pt-2 md:pt-0">
                        <a 
                          href={file.url_archivo}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full md:w-auto inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary/95 text-white font-bold text-xs uppercase tracking-wider px-6 py-4 rounded-2xl transition-all duration-300 active:scale-95 shadow-md shadow-primary/10 cursor-pointer border-none no-underline group/btn"
                        >
                          <span className="material-symbols-outlined text-sm transition-transform group-hover/btn:translate-y-0.5">
                            {file.tipo === "link" ? "open_in_new" : "download"}
                          </span>
                          {file.tipo === "link" ? "Abrir Enlace" : "Descargar"}
                        </a>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="py-20 text-center text-on-surface-variant font-headline text-base bg-slate-50 border border-slate-200 rounded-[2.5rem]">
                  <span className="material-symbols-outlined text-5xl text-slate-300 mb-3 block">folder_open</span>
                  No se encontraron recursos técnicos de esta categoría o búsqueda.
                </div>
              )}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 pt-8 flex-wrap">
                <button
                  onClick={() => goToPage(activePage - 1)}
                  disabled={activePage === 1}
                  className="w-9 h-9 flex items-center justify-center rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer bg-white"
                >
                  <span className="material-symbols-outlined text-base">chevron_left</span>
                </button>

                {getPageNumbers(activePage, totalPages).map((p, idx) =>
                  p === "..." ? (
                    <span key={`dots-${idx}`} className="w-9 h-9 flex items-center justify-center text-slate-400 text-xs font-bold">
                      ···
                    </span>
                  ) : (
                    <button
                      key={p}
                      onClick={() => goToPage(p)}
                      className={`w-9 h-9 flex items-center justify-center rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                        p === activePage
                          ? "bg-primary text-white border-primary shadow-md shadow-primary/20"
                          : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                      }`}
                    >
                      {p}
                    </button>
                  )
                )}

                <button
                  onClick={() => goToPage(activePage + 1)}
                  disabled={activePage === totalPages}
                  className="w-9 h-9 flex items-center justify-center rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer bg-white"
                >
                  <span className="material-symbols-outlined text-base">chevron_right</span>
                </button>
              </div>
            )}
          </section>

          {/* Featured Remote Support Section (Helpful Technical Desk - Moved to the bottom as a CTA) */}
          <section className="bg-gradient-to-br from-slate-50 to-white border-l-4 border-l-primary border-t border-r border-b border-slate-200/80 text-on-surface rounded-[2.5rem] p-8 md:p-12 relative overflow-hidden shadow-sm scroll-reveal">
            <div className="absolute inset-0 opacity-[0.01] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '16px 16px' }} />
            <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-primary/5 rounded-full blur-[80px] pointer-events-none" />
            
            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-8 space-y-5">
                <span className="inline-flex items-center gap-1.5 py-1 px-3 bg-primary/10 border border-primary/15 text-primary font-bold text-[10px] rounded-full uppercase tracking-widest">
                  <span className="material-symbols-outlined text-[14px]">support_agent</span>
                  Asistencia Inmediata en Línea
                </span>
                <h2 className="font-headline text-2xl md:text-3xl font-black text-on-surface leading-tight">
                  ¿Necesitas soporte técnico <span className="text-primary">remoto en tiempo real</span>?
                </h2>
                <p className="text-xs md:text-sm text-on-surface-variant max-w-xl leading-relaxed font-semibold">
                  Descarga AnyDesk, la herramienta oficial recomendada por nuestro laboratorio. Un ingeniero certificado te guiará y tomará control remoto para solucionar problemas de impresión, atascos o activación de software.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  {[
                    "Instalación de controladores Zebra/Epson",
                    "Configuración de red e impresoras de tickets",
                    "Saneamiento y optimización de software",
                    "Diagnóstico a nivel lógico de Bios"
                  ].map((bullet, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs text-slate-600 font-semibold">
                      <span className="material-symbols-outlined text-primary text-[18px] font-bold">check_circle</span>
                      <span>{bullet}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="lg:col-span-4 flex justify-center lg:justify-end">
                <a 
                  href="https://anydesk.com/download"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2.5 px-8 py-4 bg-primary hover:bg-primary/95 text-white font-bold text-xs uppercase tracking-wider rounded-2xl transition-all duration-300 shadow-md shadow-primary/15 hover:scale-[1.03] active:scale-95 cursor-pointer border-none no-underline"
                >
                  <span className="material-symbols-outlined text-base">laptop_mac</span>
                  Descargar AnyDesk
                </a>
              </div>
            </div>
          </section>
        </div>
      </main>

      {/* Reusable Clean Footer */}
      <CleanFooter />

      <ScrollRevealObserver />
    </div>
  );
}
