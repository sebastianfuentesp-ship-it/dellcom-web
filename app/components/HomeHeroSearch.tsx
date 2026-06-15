/**
 * Buscador de averías en el hero de la home page.
 * Filtra la lista de averías frecuentes por texto (problema o categoría).
 * Al seleccionar un resultado redirige directamente a WhatsApp con un mensaje
 * prefabricado para ese tipo de avería. Cierra el dropdown al hacer click fuera.
 */
"use client";

import { useState, useRef, useEffect } from "react";

interface DiagnosticoItem {
  problema: string;
  categoria: string;
  mensajeWhatsApp: string;
}

const AVERIAS_FRECUENTES: DiagnosticoItem[] = [
  {
    problema: "Laptop enciende pero pantalla queda negra",
    categoria: "Reparación de Hardware",
    mensajeWhatsApp: "Hola DELLCOM, mi laptop enciende pero la pantalla queda negra. Solicito un diagnóstico técnico."
  },
  {
    problema: "Placa madre de computadora o laptop dañada (Microelectrónica)",
    categoria: "Microelectrónica y Placas",
    mensajeWhatsApp: "Hola DELLCOM, necesito reparar una placa madre a nivel de componentes microelectrónicos."
  },
  {
    problema: "Impresora industrial Zebra imprime borroso o no calibra",
    categoria: "Reparación de Impresoras",
    mensajeWhatsApp: "Hola DELLCOM, mi impresora térmica Zebra tiene fallos de calibración/impresión. Deseo cotizar soporte técnico."
  },
  {
    problema: "Epson de tickets TM-T20 no imprime recibos",
    categoria: "Soporte POS",
    mensajeWhatsApp: "Hola DELLCOM, mi ticketera Epson TM-T20 no imprime los recibos de venta. Solicito asistencia."
  },
  {
    problema: "Cableado estructurado desordenado en gabinete rack",
    categoria: "Infraestructura de Red",
    mensajeWhatsApp: "Hola DELLCOM, deseo cotizar el ordenamiento de cables y armado de rack en mi empresa."
  },
  {
    problema: "Configurar correos corporativos Google Workspace / Microsoft 365",
    categoria: "Soporte Corporativo",
    mensajeWhatsApp: "Hola DELLCOM, deseo soporte para configurar los correos corporativos de mi empresa."
  },
  {
    problema: "Licencia de Windows u Office desactivada",
    categoria: "Licenciamiento",
    mensajeWhatsApp: "Hola DELLCOM, deseo adquirir una licencia original certificada de Windows/Office."
  },
  {
    problema: "Recuperación de datos de disco duro formateado o quemado",
    categoria: "Ciberseguridad",
    mensajeWhatsApp: "Hola DELLCOM, necesito recuperar información de un disco duro dañado."
  }
];

export default function HomeHeroSearch() {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<DiagnosticoItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Filter suggestions on query change
  useEffect(() => {
    const cleanQuery = query.replace(/^#+/, "").trim().toLowerCase();
    if (cleanQuery === "") {
      setSuggestions([]);
      return;
    }

    const filtered = AVERIAS_FRECUENTES.filter(item =>
      item.problema.toLowerCase().includes(cleanQuery) ||
      item.categoria.toLowerCase().includes(cleanQuery)
    );
    setSuggestions(filtered);
  }, [query]);

  // Click outside closes dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (item: DiagnosticoItem) => {
    setQuery(item.problema);
    setIsOpen(false);
    
    // Redirect direct to WhatsApp with prefilled message
    const whatsappUrl = `https://wa.me/51925981741?text=${encodeURIComponent(item.mensajeWhatsApp)}`;
    window.open(whatsappUrl, "_blank");
  };

  return (
    <div className="relative w-full max-w-xl mx-auto lg:mx-0 z-20" ref={dropdownRef}>
      {/* Search Input Container */}
      <div className="relative bg-white border border-slate-200 rounded-2xl shadow-xl shadow-slate-900/5 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/10 transition-all overflow-hidden flex items-center">
        <span className="material-symbols-outlined text-slate-400 pl-4 pr-2 select-none">search</span>
        <input
          type="text"
          className="w-full py-4 pr-4 bg-transparent border-none text-slate-800 text-sm font-semibold focus:outline-none placeholder:text-slate-400"
          placeholder="¿Qué avería o equipo deseas diagnosticar hoy?..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
        />
        {query && (
          <button 
            onClick={() => { setQuery(""); setSuggestions([]); }}
            className="p-3 text-slate-400 hover:text-slate-600 transition-colors"
          >
            <span className="material-symbols-outlined text-lg leading-none">close</span>
          </button>
        )}
      </div>

      {/* Suggestion Dropdown */}
      {isOpen && suggestions.length > 0 && (
        <div className="absolute top-full left-0 w-full bg-white border border-slate-200 mt-2 rounded-2xl shadow-2xl overflow-hidden z-30 max-h-[300px] overflow-y-auto animate-fade-in-up">
          <div className="p-3 bg-slate-50 border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            Averías y Diagnósticos Frecuentes
          </div>
          <div className="divide-y divide-slate-100">
            {suggestions.map((item, idx) => (
              <button
                key={idx}
                onClick={() => handleSelect(item)}
                className="w-full text-left p-4 hover:bg-slate-50 transition-colors flex items-start gap-3 group"
              >
                <div className="bg-primary/10 text-primary p-2 rounded-lg shrink-0 mt-0.5 group-hover:bg-primary group-hover:text-white transition-all">
                  <span className="material-symbols-outlined text-base leading-none">build</span>
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-700 leading-snug group-hover:text-primary transition-colors">
                    {item.problema}
                  </div>
                  <div className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider mt-0.5">
                    Categoría: {item.categoria}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Quick Helper Text */}
      <div className="mt-2.5 flex flex-wrap gap-2 items-center text-[10px] text-slate-400 font-semibold uppercase tracking-wide">
        <span>Prueba a buscar:</span>
        {["Zebra", "Laptop", "Cableado", "Licencia"].map((term) => (
          <button 
            key={term}
            onClick={() => { setQuery(term); setIsOpen(true); }}
            className="text-primary hover:underline cursor-pointer"
          >
            #{term}
          </button>
        ))}
      </div>
    </div>
  );
}
