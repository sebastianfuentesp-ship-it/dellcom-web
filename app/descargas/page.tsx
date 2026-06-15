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
      year: "numeric"
    });
  };

  return (
    <div className="bg-white min-h-screen flex flex-col justify-between text-on-surface selection:bg-primary/20 selection:text-primary">
      {/* Reusable Status Header */}
      <StatusHeader />

      <main className="pt-16">
        {/* Asymmetric Header Banner */}
        <section className="relative py-16 bg-slate-50/50 overflow-hidden border-b border-slate-100">
          <div className="absolute inset-0 opacity-[0.02] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '16px 16px' }} />
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] pointer-events-none" />

          <div className="relative px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto w-full text-center z-10 scroll-reveal">
            <span className="inline-block py-1 px-3.5 mb-4 bg-primary/10 border border-primary/15 text-primary font-bold text-[10px] rounded-full uppercase tracking-widest">
              Repositorio de Recursos Oficiales
            </span>
            <h1 className="font-headline text-3xl md:text-5xl font-black text-on-surface leading-tight tracking-tight">
              Soporte y <span className="text-primary">Descargas</span>
            </h1>
            <p className="text-xs md:text-sm text-on-surface-variant max-w-xl mx-auto mt-2 leading-relaxed font-semibold">
              Descarga controladores oficiales autorizados, manuales de configuración para impresoras Epson y Zebra, o utilidades de diagnóstico recomendadas por DELLCOM SAC.
            </p>
          </div>
        </section>

        {/* Main Downloads View Container */}
        <div className="py-16 max-w-container-max mx-auto w-full px-margin-mobile md:px-margin-desktop space-y-16">
          
          {/* Featured Remote Support Section (Helpful Technical Desk) */}
          <section className="bg-slate-50 border border-slate-200/80 text-on-surface rounded-[2.5rem] p-8 md:p-12 relative overflow-hidden shadow-sm scroll-reveal">
            <div className="absolute inset-0 opacity-[0.02] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '16px 16px' }} />
            <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-primary/5 rounded-full blur-[100px] pointer-events-none" />
            
            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-8 space-y-4">
                <span className="inline-block py-1 px-3.5 bg-primary/10 border border-primary/15 text-primary font-bold text-[10px] rounded-full uppercase tracking-widest">
                  Soporte Remoto Inmediato
                </span>
                <h2 className="font-headline text-2xl md:text-4xl font-black text-on-surface leading-tight">
                  ¿Necesitas asistencia de un <span className="text-primary">ingeniero en tiempo real</span>?
                </h2>
                <p className="text-xs md:text-sm text-on-surface-variant max-w-xl leading-relaxed font-semibold">
                  Descarga AnyDesk, la herramienta portátil oficial elegida por nuestro equipo. Ejecútalo y proporciona tu código de acceso para que un técnico certificado solucione atascos, configure controladores de red o realice soporte de software de inmediato.
                </p>
              </div>
              <div className="lg:col-span-4 flex justify-center lg:justify-end">
                <a 
                  href="https://anydesk.com/download"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2.5 px-8 py-4 bg-primary hover:bg-primary/95 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all duration-300 shadow-md shadow-primary/10 hover:scale-105 active:scale-95 cursor-pointer border-none no-underline"
                >
                  <span className="material-symbols-outlined text-base">laptop_mac</span>
                  Descargar AnyDesk
                </a>
              </div>
            </div>
          </section>

          {/* Resources Control Section */}
          <section className="space-y-12">
            
            {/* Search Box & Category Filters Row */}
            <div className="space-y-8">
              <div className="relative max-w-2xl mx-auto bg-slate-50 border border-slate-200 rounded-2xl shadow-sm overflow-hidden focus-within:border-primary/50 focus-within:ring-2 focus-within:ring-primary/10 transition-all scroll-reveal">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 select-none">search</span>
                <input 
                  className="w-full pl-12 pr-4 py-4 bg-transparent border-none focus:outline-none text-on-surface font-body-md text-sm placeholder:text-slate-400 font-semibold"
                  placeholder="Buscar controlador, programa, manual..." 
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

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
                  return (
                    <div 
                      key={file.id} 
                      className="bg-white border border-slate-200/80 hover:border-slate-300 hover:shadow-lg rounded-[2rem] p-6 transition-all duration-300 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 group"
                    >
                      <div className="flex items-start md:items-center gap-5 flex-1 min-w-0">
                        {/* File Format Visual Icon Badge */}
                        <div className={`w-14 h-14 rounded-2xl flex flex-col items-center justify-center shrink-0 shadow-sm border ${
                          file.tipo === "driver" ? "bg-blue-50 border-blue-100 text-blue-600" :
                          file.tipo === "programa" ? "bg-emerald-50 border-emerald-100 text-emerald-600" :
                          file.tipo === "excel" ? "bg-teal-50 border-teal-100 text-teal-600" :
                          "bg-slate-50 border-slate-200/60 text-slate-600"
                        }`}>
                          <span className="material-symbols-outlined text-2xl leading-none">
                            {getIconForType(file.tipo)}
                          </span>
                          <span className="text-[8px] font-black uppercase tracking-wider mt-1 block leading-none">
                            {file.tipo === "driver" ? "DRV" :
                             file.tipo === "programa" ? "EXE" :
                             file.tipo === "excel" ? "XLS" : "LINK"}
                          </span>
                        </div>

                        <div className="space-y-1 flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-slate-100 text-[10px] text-slate-500 font-bold uppercase tracking-wider leading-none">
                              {getLabelForType(file.tipo)}
                            </span>
                            {meta.version && (
                              <span className="text-[9px] bg-slate-50 border border-slate-200/60 text-slate-500 font-extrabold px-1.5 py-0.5 rounded leading-none">
                                {meta.version}
                              </span>
                            )}
                            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wide leading-none">
                              • Subido {formatDate(file.fecha_subida)}
                            </span>
                          </div>
                          
                          <h3 className="font-headline text-base md:text-lg font-black text-on-surface tracking-tight truncate leading-snug">
                            {file.nombre}
                          </h3>
                          
                          <p className="text-xs text-on-surface-variant font-semibold leading-relaxed line-clamp-2">
                            {file.descripcion || "Recurso oficial provisto por el equipo técnico de DELLCOM SAC."}
                          </p>

                          {/* Technical Specs Meta */}
                          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 pt-1.5 text-[11px] text-slate-400 font-bold uppercase">
                            {meta.tamano !== "---" && (
                              <span className="flex items-center gap-1">
                                <span className="material-symbols-outlined text-xs">database</span>
                                {meta.tamano}
                              </span>
                            )}
                            <span className="flex items-center gap-1 text-slate-500">
                              <span className="material-symbols-outlined text-xs">desktop_windows</span>
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
                          className="w-full md:w-auto inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary/95 text-white font-bold text-xs uppercase tracking-wider py-3.5 rounded-xl transition-all duration-300 active:scale-95 shadow-md shadow-primary/10 cursor-pointer border-none no-underline"
                        >
                          <span className="material-symbols-outlined text-sm">
                            {file.tipo === "link" ? "open_in_new" : "download"}
                          </span>
                          {file.tipo === "link" ? "Abrir Enlace" : "Descargar"}
                        </a>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="py-20 text-center text-on-surface-variant font-headline text-base bg-slate-50 border border-slate-200 rounded-3xl">
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
