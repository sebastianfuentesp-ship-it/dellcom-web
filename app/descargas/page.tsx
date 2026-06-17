/**
 * Página de descargas: /descargas
 * Muestra el repositorio de archivos técnicos (drivers, programas, Excel, links).
 * Carga los archivos desde /api/archivos y usa FALLBACK_ARCHIVOS si la API falla.
 * Permite filtrar por tipo (Todos/Programa/Driver/Excel/Link) y buscar por nombre.
 * Los archivos de tipo "link" abren en nueva pestaña; los demás descargan directamente.
 */
"use client";

import { useState, useEffect } from "react";
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
        {/* Asymmetric Header Banner */}
        <section className="relative py-20 bg-slate-50/50 overflow-hidden border-b border-slate-100">
          <div className="absolute inset-0 opacity-[0.02] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '16px 16px' }} />
          {/* Glowing bubbles in the background */}
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
          <div className="absolute -bottom-20 -left-20 w-[400px] h-[400px] bg-primary/5 rounded-full blur-[100px] pointer-events-none" />

          <div className="relative px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto w-full z-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              <div className="lg:col-span-7 text-left space-y-5 scroll-reveal">
                <span className="inline-flex items-center gap-2 bg-primary/10 border border-primary/15 text-primary font-bold text-[10px] rounded-full uppercase tracking-widest px-3.5 py-1">
                  <span className="material-symbols-outlined text-[14px]">download_done</span>
                  Recursos Oficiales Dellcom
                </span>
                <h1 className="font-headline text-4xl md:text-5xl font-black text-on-surface leading-tight tracking-tight">
                  Soporte y <span className="text-primary">Descargas</span>
                </h1>
                <p className="text-xs md:text-sm text-on-surface-variant max-w-xl leading-relaxed font-semibold">
                  Accede a nuestro repositorio oficial de utilidades de diagnóstico, plantillas administrativas y controladores autorizados para impresoras Zebra, Epson y equipos corporativos.
                </p>
                <div className="pt-2 max-w-md">
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

              {/* Decorative floating card stack representation of file items */}
              <div className="lg:col-span-5 hidden lg:flex justify-center items-center relative py-6 scroll-reveal" style={{ transitionDelay: '150ms' }}>
                <div className="w-72 h-44 bg-white border border-slate-100 rounded-3xl shadow-xl p-5 transform -rotate-6 translate-y-4 translate-x-4 absolute z-0 opacity-40">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center mb-4"><span className="material-symbols-outlined text-sm">memory</span></div>
                  <div className="w-24 h-3 bg-slate-200 rounded"></div>
                  <div className="w-40 h-2 bg-slate-100 rounded mt-2"></div>
                </div>
                <div className="w-72 h-44 bg-white border border-slate-100 rounded-3xl shadow-xl p-5 transform rotate-3 translate-x-8 absolute z-10 opacity-70">
                  <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center mb-4"><span className="material-symbols-outlined text-sm">description</span></div>
                  <div className="w-24 h-3 bg-slate-200 rounded"></div>
                  <div className="w-40 h-2 bg-slate-100 rounded mt-2"></div>
                </div>
                <div className="w-72 h-44 bg-white border border-slate-200 rounded-3xl shadow-2xl p-6 transform -rotate-3 z-20 animate-float">
                  <div className="flex justify-between items-start mb-4">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shadow-sm"><span className="material-symbols-outlined">download</span></div>
                    <span className="text-[9px] bg-slate-100 text-slate-500 font-bold px-2 py-0.5 rounded-full">v8.0.10</span>
                  </div>
                  <h4 className="font-headline font-bold text-xs text-on-surface">AnyDesk Remote Access</h4>
                  <p className="text-[10px] text-on-surface-variant mt-1 leading-snug">Control de diagnóstico remoto oficial.</p>
                  <div className="w-full bg-slate-100 h-1 rounded mt-4 overflow-hidden">
                    <div className="bg-primary h-full w-[85%]"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Main Downloads View Container */}
        <div className="py-16 max-w-container-max mx-auto w-full px-margin-mobile md:px-margin-desktop space-y-16">
          
          {/* Featured Remote Support Section (Helpful Technical Desk) */}
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

          {/* Resources Control Section */}
          <section className="space-y-12">
            
            {/* Category Filters Row */}
            <div className="space-y-8">
              {/* Visual Category Cards Grid */}
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4 scroll-reveal">
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
                      className={`p-5 rounded-[2rem] border text-left flex flex-col justify-between gap-6 transition-all duration-300 cursor-pointer select-none group ${
                        isActive 
                          ? "bg-primary/10 border-primary/25 text-primary shadow-lg shadow-primary/5 -translate-y-1"
                          : "bg-slate-50/50 border-slate-200/80 text-slate-700 hover:bg-white hover:border-slate-300 hover:shadow-md"
                      }`}
                    >
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
                        isActive ? "bg-primary text-white" : "bg-white border border-slate-200/60 text-primary group-hover:bg-primary group-hover:text-white"
                      }`}>
                        <span className="material-symbols-outlined text-xl">{cat.icon}</span>
                      </div>
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">{cat.label}</span>
                        <span className={`text-xl font-extrabold font-headline mt-1 block leading-none ${isActive ? "text-primary" : "text-slate-800"}`}>
                          {cat.count}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* List of Files (Detailed Rows Layout) */}
            <div className="space-y-4 scroll-reveal">
              {filteredArchivos.length > 0 ? (
                filteredArchivos.map((file) => {
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
          </section>
        </div>
      </main>

      {/* Reusable Clean Footer */}
      <CleanFooter />

      <ScrollRevealObserver />
    </div>
  );
}
