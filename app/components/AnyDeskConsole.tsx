/**
 * Consola de conexión de soporte remoto.
 * Permite al cliente elegir entre AnyDesk o RustDesk, ingresar su código de 9 dígitos
 * y enviarlo por WhatsApp con un mensaje prefabricado al técnico de DELLCOM.
 * El código se auto-formatea como 000-000-000 al escribir.
 */
"use client";

import { useState } from "react";

interface AnyDeskConsoleProps {
  onCodeChange?: (code: string) => void;
}

export default function AnyDeskConsole({ onCodeChange }: AnyDeskConsoleProps) {
  const [appType, setAppType] = useState<"AnyDesk" | "RustDesk">("AnyDesk");
  const [code, setCode] = useState("");

  const handleSendCode = () => {
    if (code.trim() === "") {
      alert("Por favor, ingresa tu código de conexión primero.");
      return;
    }
    const cleanCode = code.replace(/\s+/g, "").replace(/-/g, "");
    if (cleanCode.length !== 9 || isNaN(Number(cleanCode))) {
      alert("El código debe tener exactamente 9 dígitos numéricos.");
      return;
    }
    
    // Group code format (e.g. 123 456 789)
    const formatted = `${cleanCode.substring(0, 3)} ${cleanCode.substring(3, 6)} ${cleanCode.substring(6, 9)}`;

    const message = `👋 Hola DELLCOM, solicito asistencia remota 💻 mediante ${appType}.\n\n📟 Mi código de conexión es: *${formatted}*\n\n⏳ Por favor conéctense cuando estén listos. ¡Gracias!`;
    const whatsappUrl = `https://wa.me/51925981741?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");
  };

  const handleInputChange = (val: string) => {
    // Only allow digits and hyphens/spaces
    const clean = val.replace(/[^0-9]/g, "");
    
    // Auto-format as 123-456-789
    let formatted = clean;
    if (clean.length > 3 && clean.length <= 6) {
      formatted = `${clean.substring(0, 3)}-${clean.substring(3)}`;
    } else if (clean.length > 6) {
      formatted = `${clean.substring(0, 3)}-${clean.substring(3, 6)}-${clean.substring(6, 9)}`;
    }
    
    setCode(formatted);
    if (onCodeChange) {
      onCodeChange(formatted);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto bg-white border border-slate-200/80 rounded-[2.5rem] shadow-xl p-8 md:p-10 relative overflow-hidden transition-all duration-300 hover:shadow-2xl">
      {/* Subtle tech background highlight */}
      <div className="absolute top-0 right-0 w-36 h-36 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-slate-100 rounded-full blur-2xl pointer-events-none" />
      
      <div className="relative z-10 space-y-8">
        <div className="text-center space-y-2">
          <span className="inline-flex items-center gap-1.5 bg-primary/10 text-primary px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest">
            <span className="animate-pulse w-1.5 h-1.5 rounded-full bg-primary" />
            Consola de Conexión
          </span>
          <h3 className="font-headline text-lg font-bold text-on-surface">Envía tu Código</h3>
          <p className="text-xs text-on-surface-variant max-w-xs mx-auto leading-relaxed">
            Selecciona la aplicación de soporte que ejecutaste y escribe tu código de dirección.
          </p>
        </div>

        {/* Toggle App Type */}
        <div className="flex bg-slate-100 p-1.5 rounded-2xl border border-slate-200/60">
          <button
            type="button"
            onClick={() => setAppType("AnyDesk")}
            className={`flex-1 text-center py-3 rounded-xl text-xs font-bold transition-all uppercase cursor-pointer flex items-center justify-center gap-2 ${
              appType === "AnyDesk" 
                ? "bg-primary text-white shadow-md shadow-primary/10" 
                : "text-slate-500 hover:text-slate-800 hover:bg-slate-50"
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">monitor</span>
            AnyDesk
          </button>
          <button
            type="button"
            onClick={() => setAppType("RustDesk")}
            className={`flex-1 text-center py-3 rounded-xl text-xs font-bold transition-all uppercase cursor-pointer flex items-center justify-center gap-2 ${
              appType === "RustDesk" 
                ? "bg-primary text-white shadow-md shadow-primary/10" 
                : "text-slate-500 hover:text-slate-800 hover:bg-slate-50"
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">desktop_windows</span>
            RustDesk
          </button>
        </div>

        {/* Code Input */}
        <div className="space-y-2.5">
          <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest text-center">
            Código de Dirección (9 dígitos)
          </label>
          <div className="relative">
            <input
              type="text"
              placeholder="000-000-000"
              value={code}
              onChange={(e) => handleInputChange(e.target.value)}
              maxLength={11}
              className="w-full text-center py-5 bg-slate-50/50 border border-slate-200 focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/10 focus:outline-none rounded-2xl text-2xl font-bold tracking-widest text-slate-900 placeholder:text-slate-300 transition-all"
            />
            {code && (
              <button 
                type="button"
                onClick={() => setCode("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            )}
          </div>
        </div>

        {/* WhatsApp Send CTA */}
        <button
          type="button"
          onClick={handleSendCode}
          className="w-full bg-[#25D366] hover:bg-[#20ba56] text-white py-4 rounded-2xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2.5 hover:scale-[1.02] transition-all shadow-lg shadow-green-500/20 active:scale-95 cursor-pointer"
        >
          <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
          </svg>
          Conectar Soporte Remoto
        </button>
      </div>
    </div>
  );
}
