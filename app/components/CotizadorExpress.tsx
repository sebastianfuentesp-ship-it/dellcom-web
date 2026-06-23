/**
 * Cotizador Express de servicios técnicos (3 pasos).
 * Calcula un rango de precio estimado multiplicando:
 *   precio_base_del_equipo × multiplicador_de_falla × multiplicador_de_urgencia
 * Al finalizar, genera un mensaje de WhatsApp con el resumen de la cotización.
 * Los rangos son orientativos; el diagnóstico final se determina en taller.
 */
"use client";

import { useState } from "react";

interface DeviceOption {
  id: string;
  name: string;
  icon: string;
  basePriceMin: number;
  basePriceMax: number;
}

interface FailureOption {
  id: string;
  name: string;
  icon: string;
  multiplier: number;
}

interface UrgencyOption {
  id: string;
  name: string;
  icon: string;
  multiplier: number;
}

const DEVICES: DeviceOption[] = [
  { id: "laptop", name: "Laptop / Notebook", icon: "laptop_mac", basePriceMin: 80, basePriceMax: 150 },
  { id: "pc", name: "PC de Escritorio / Servidor", icon: "computer", basePriceMin: 90, basePriceMax: 200 },
  { id: "zebra", name: "Impresora Térmica / Zebra", icon: "print", basePriceMin: 120, basePriceMax: 250 },
  { id: "other", name: "Otro Equipo", icon: "devices_other", basePriceMin: 80, basePriceMax: 200 }
];

const FAILURES: FailureOption[] = [
  { id: "maintenance", name: "Mantenimiento / Limpieza", icon: "cleaning_services", multiplier: 1.0 },
  { id: "software", name: "Fallo de Software / Configuración", icon: "settings_suggest", multiplier: 1.2 },
  { id: "electronics", name: "Daño Físico o Electrónico (Placas)", icon: "developer_board", multiplier: 1.8 }
];

const URGENCY: UrgencyOption[] = [
  { id: "normal", name: "Estándar (24 - 48h)", icon: "schedule", multiplier: 1.0 },
  { id: "express", name: "Express (Mismo día)", icon: "bolt", multiplier: 1.3 },
  { id: "critical", name: "Emergencia 24/7 (Inmediato)", icon: "warning", multiplier: 2.0 }
];

export default function CotizadorExpress() {
  const [step, setStep] = useState(1);
  const [selectedDevice, setSelectedDevice] = useState<DeviceOption>(DEVICES[0]);
  const [selectedFailure, setSelectedFailure] = useState<FailureOption>(FAILURES[0]);
  const [selectedUrgency, setSelectedUrgency] = useState<UrgencyOption>(URGENCY[0]);

  const calcPriceRange = () => {
    const min = Math.round(selectedDevice.basePriceMin * selectedFailure.multiplier * selectedUrgency.multiplier);
    const max = Math.round(selectedDevice.basePriceMax * selectedFailure.multiplier * selectedUrgency.multiplier);
    return { min, max };
  };

  const { min, max } = calcPriceRange();

  const handleWhatsappSend = () => {
    const message = `👋 Hola DELLCOM, acabo de cotizar en su web 🧾:\n\n🖥️ Equipo: ${selectedDevice.name}\n🔧 Tipo de Falla: ${selectedFailure.name}\n⚡ Prioridad: ${selectedUrgency.name}\n💰 Presupuesto Estimado: S/. ${min} - S/. ${max}\n\n📅 Solicito agendar soporte técnico. ¡Gracias!`;
    const whatsappUrl = `https://wa.me/51925981741?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");
  };

  return (
    <div className="w-full bg-white/80 backdrop-blur-md border border-slate-200/80 rounded-[2.5rem] shadow-xl p-8 md:p-12 relative overflow-hidden">
      {/* Red circles background */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-primary/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col lg:flex-row gap-12 items-stretch">
        
        {/* Left Side: Step inputs */}
        <div className="flex-1 space-y-8">
          
          {/* Header */}
          <div className="space-y-2">
            <span className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
              <span className="material-symbols-outlined text-xs">calculate</span>
              Cotizador Inteligente
            </span>
            <h3 className="font-headline text-2xl font-bold text-on-surface">Calcula tu Presupuesto IT</h3>
            <p className="text-xs text-on-surface-variant max-w-sm leading-relaxed">
              Estima los costos de mantenimiento o reparación de tu equipamiento técnico en segundos.
            </p>
          </div>

          {/* Stepper Indicators */}
          <div className="flex gap-4">
            {[1, 2, 3].map((s) => (
              <button
                key={s}
                onClick={() => setStep(s)}
                className={`h-2.5 flex-1 rounded-full transition-all ${
                  s === step ? "bg-primary w-1/2" : s < step ? "bg-primary/45" : "bg-slate-100"
                }`}
                title={`Paso ${s}`}
              />
            ))}
          </div>

          {/* Step Panels */}
          <div>
            {step === 1 && (
              <div className="space-y-4 animate-fade-in-up">
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  Paso 1: Selecciona el Dispositivo
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {DEVICES.map((d) => (
                    <button
                      key={d.id}
                      onClick={() => setSelectedDevice(d)}
                      className={`flex items-center gap-4 p-4 rounded-2xl border text-left transition-all ${
                        selectedDevice.id === d.id
                          ? "bg-primary/5 border-primary shadow-sm"
                          : "bg-slate-50/50 border-slate-200 hover:bg-slate-50"
                      }`}
                    >
                      <div className={`p-2.5 rounded-xl ${selectedDevice.id === d.id ? "bg-primary text-white" : "bg-white text-slate-500 border border-slate-200"}`}>
                        <span className="material-symbols-outlined text-xl leading-none">{d.icon}</span>
                      </div>
                      <span className="text-sm font-bold text-slate-700">{d.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4 animate-fade-in-up">
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  Paso 2: Describe el Tipo de Avería
                </label>
                <div className="grid grid-cols-1 gap-4">
                  {FAILURES.map((f) => (
                    <button
                      key={f.id}
                      onClick={() => setSelectedFailure(f)}
                      className={`flex items-center gap-4 p-4 rounded-2xl border text-left transition-all ${
                        selectedFailure.id === f.id
                          ? "bg-primary/5 border-primary shadow-sm"
                          : "bg-slate-50/50 border-slate-200 hover:bg-slate-50"
                      }`}
                    >
                      <div className={`p-2.5 rounded-xl ${selectedFailure.id === f.id ? "bg-primary text-white" : "bg-white text-slate-500 border border-slate-200"}`}>
                        <span className="material-symbols-outlined text-xl leading-none">{f.icon}</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-slate-700">{f.name}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-4 animate-fade-in-up">
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  Paso 3: Nivel de Urgencia
                </label>
                <div className="grid grid-cols-1 gap-4">
                  {URGENCY.map((u) => (
                    <button
                      key={u.id}
                      onClick={() => setSelectedUrgency(u)}
                      className={`flex items-center gap-4 p-4 rounded-2xl border text-left transition-all ${
                        selectedUrgency.id === u.id
                          ? "bg-primary/5 border-primary shadow-sm"
                          : "bg-slate-50/50 border-slate-200 hover:bg-slate-50"
                      }`}
                    >
                      <div className={`p-2.5 rounded-xl ${selectedUrgency.id === u.id ? "bg-primary text-white" : "bg-white text-slate-500 border border-slate-200"}`}>
                        <span className="material-symbols-outlined text-xl leading-none">{u.icon}</span>
                      </div>
                      <span className="text-sm font-bold text-slate-700">{u.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Nav Controls */}
          <div className="flex justify-between items-center pt-2">
            {step > 1 ? (
              <button
                onClick={() => setStep(step - 1)}
                className="flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors cursor-pointer select-none"
              >
                <span className="material-symbols-outlined text-base">arrow_back</span>
                Atrás
              </button>
            ) : (
              <div />
            )}
            {step < 3 ? (
              <button
                onClick={() => setStep(step + 1)}
                className="bg-slate-900 text-white px-6 py-2.5 rounded-xl text-xs font-bold transition-all hover:bg-slate-800 cursor-pointer active:scale-95"
              >
                Siguiente
              </button>
            ) : (
              <div />
            )}
          </div>

        </div>

        {/* Right Side: Estimated range result */}
        <div className="lg:w-[350px] bg-slate-50 border border-slate-200 rounded-3xl p-6 md:p-8 flex flex-col justify-between items-stretch">
          
          <div className="space-y-4">
            <h4 className="font-headline font-bold text-slate-500 uppercase tracking-widest text-[10px]">
              Resumen de Estimación
            </h4>
            
            <div className="space-y-3 divide-y divide-slate-200/60 text-xs font-semibold text-slate-600">
              <div className="flex justify-between py-2">
                <span className="text-slate-400">Equipo:</span>
                <span className="text-slate-800 font-bold">{selectedDevice.name}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-slate-400">Diagnóstico:</span>
                <span className="text-slate-800 font-bold max-w-[180px] text-right leading-tight">
                  {selectedFailure.name.split(" (")[0]}
                </span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-slate-400">Urgencia:</span>
                <span className="text-slate-800 font-bold">{selectedUrgency.name.split(" (")[0]}</span>
              </div>
            </div>

            <div className="pt-4 border-t-2 border-dashed border-slate-200 text-center">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Presupuesto Estimado
              </span>
              <div className="text-3xl font-extrabold text-primary leading-none">
                S/. {min} - S/. {max}
              </div>
              <span className="text-[10px] text-slate-400 mt-2 block leading-snug">
                *Incluye IGV. Diagnóstico final sujeto a revisión técnica en laboratorio.
              </span>
            </div>
          </div>

          <button
            onClick={handleWhatsappSend}
            className="bg-[#25D366] text-white py-4 rounded-2xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 hover:scale-[1.02] transition-all shadow-lg shadow-green-500/20 active:scale-95 cursor-pointer mt-6"
          >
            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
            </svg>
            Agendar por WhatsApp
          </button>

        </div>

      </div>
    </div>
  );
}
