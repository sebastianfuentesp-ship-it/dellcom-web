import { Licencia, MensajeContacto, ArchivoTecnico } from "../../types";

interface Props {
  licencias: Licencia[];
  mensajes: MensajeContacto[];
  archivos: ArchivoTecnico[];
  filteredLicencias: Licencia[];
  filteredMensajes: MensajeContacto[];
  getLicenseUrgency: (dateStr: string | null) => "ok" | "warning" | "expired";
  formatDate: (dateStr: string | null) => string;
  isAdmin: boolean;
  canEditTecnico: boolean;
  canEditCatalogo: boolean;
  onOpenLicenseModal: () => void;
  onOpenFileModal: () => void;
  onOpenProductModal: () => void;
  setActiveTab: (tab: string) => void;
}

export default function OverviewTab({
  licencias, mensajes, archivos, filteredLicencias, filteredMensajes,
  getLicenseUrgency, formatDate,
  isAdmin, canEditTecnico, canEditCatalogo,
  onOpenLicenseModal, onOpenFileModal, onOpenProductModal, setActiveTab,
}: Props) {
  const totalL = licencias.length;
  const activeL = licencias.filter(l => getLicenseUrgency(l.fecha_fin) === "ok").length;
  const warningL = licencias.filter(l => getLicenseUrgency(l.fecha_fin) === "warning").length;
  const expiredL = licencias.filter(l => getLicenseUrgency(l.fecha_fin) === "expired").length;
  const activePct = totalL > 0 ? (activeL / totalL) * 100 : 0;
  const warningPct = totalL > 0 ? (warningL / totalL) * 100 : 0;
  const expiredPct = totalL > 0 ? (expiredL / totalL) * 100 : 0;

  // Chart data (last 7 days)
  const now = new Date();
  const days: { label: string; date: string; count: number }[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth(), now.getDate() - i);
    const label = d.toLocaleDateString("es-ES", { weekday: "short" });
    const date = d.toLocaleDateString("es-ES", { day: "2-digit", month: "2-digit" });
    const dateStr = d.toDateString();
    const count = mensajes.filter(m => new Date(m.fecha).toDateString() === dateStr).length;
    days.push({ label, date, count });
  }
  const maxCount = Math.max(...days.map(d => d.count), 4);
  const chartWidth = 500;
  const chartHeight = 120;
  const points = days.map((d, i) => ({
    x: i * (chartWidth / 6),
    y: chartHeight - (d.count / maxCount) * 90 - 15,
  }));
  let pathD = `M ${points[0].x} ${points[0].y}`;
  for (let i = 1; i < points.length; i++) {
    const p0 = points[i - 1];
    const p1 = points[i];
    const cpX = p0.x + (p1.x - p0.x) / 2;
    pathD += ` C ${cpX} ${p0.y}, ${cpX} ${p1.y}, ${p1.x} ${p1.y}`;
  }
  const fillD = `${pathD} L ${points[points.length - 1].x} ${chartHeight} L ${points[0].x} ${chartHeight} Z`;

  return (
    <section className="animate-fade-in-up space-y-6">
      <div className="flex justify-between items-end mb-2">
        <div>
          <h2 className="text-xl font-bold text-on-surface font-headline">Resumen General del Sistema</h2>
          <p className="text-xs text-slate-500 mt-0.5">Métricas clave de desempeño, tendencias y próximos vencimientos de DELLCOM SAC.</p>
        </div>
      </div>

      {/* Overview Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: "Licencias Activas", value: licencias.filter(l => l.estado === "activo").length, suffix: "", icon: "verified_user", bg: "bg-emerald-50 text-emerald-600" },
          { label: "Controladores & Drivers", value: archivos.length, suffix: " archivos", icon: "folder_zip", bg: "bg-red-50 text-red-600" },
          { label: "Alertas de Vencimiento", value: licencias.filter(l => getLicenseUrgency(l.fecha_fin) !== "ok").length, suffix: " críticas", icon: "error", bg: "bg-red-100 text-red-700" },
        ].map((item, i) => (
          <div key={i} className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm flex items-center gap-4 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300">
            <div className={`p-3 rounded-xl ${item.bg}`}>
              <span className="material-symbols-outlined text-2xl">{item.icon}</span>
            </div>
            <div>
              <h4 className="font-bold text-sm text-on-surface">{item.label}</h4>
              <p className="text-xs text-slate-500 mt-0.5"><span className="font-extrabold text-slate-800 text-base">{item.value}</span>{item.suffix}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Chart + License Status Row */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* SVG Chart */}
        <div className="xl:col-span-2 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-sm text-on-surface">Tendencia de Consultas (Mensajes)</h3>
            <p className="text-xs text-slate-500">Volumen diario de mensajes de contacto de clientes durante la última semana.</p>
          </div>
          <div className="h-44 w-full mt-4 flex items-end relative">
            <div className="w-full h-full flex flex-row items-stretch">
              <div className="flex flex-col justify-between text-right pr-3 text-[9px] font-black text-slate-400 select-none pb-7 pt-3.5 h-full min-w-[20px]">
                <span>{maxCount}</span>
                <span>{Math.round(maxCount / 2)}</span>
                <span>0</span>
              </div>
              <div className="flex-1 flex flex-col justify-between h-full">
                <div className="flex-1 w-full relative">
                  <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-40 pb-3.5 pt-3.5">
                    <div className="border-b border-dashed border-slate-200 w-full h-0"></div>
                    <div className="border-b border-dashed border-slate-200 w-full h-0"></div>
                    <div className="border-b border-dashed border-slate-200 w-full h-0"></div>
                  </div>
                  <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full h-full overflow-visible" preserveAspectRatio="none">
                    <defs>
                      <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#dc2626" stopOpacity="0.25" />
                        <stop offset="100%" stopColor="#dc2626" stopOpacity="0.0" />
                      </linearGradient>
                    </defs>
                    <path d={fillD} fill="url(#chartGradient)" />
                    <path d={pathD} fill="none" stroke="#dc2626" strokeWidth="3.5" strokeLinecap="round" />
                    {points.map((pt, i) => (
                      <g key={i} className="group/dot cursor-pointer">
                        <circle cx={pt.x} cy={pt.y} r="5" fill="#dc2626" className="transition-all duration-200 group-hover/dot:r-7" />
                        <circle cx={pt.x} cy={pt.y} r="9" fill="none" stroke="#dc2626" strokeWidth="1.5" className="opacity-0 group-hover/dot:opacity-100 transition-opacity" />
                        <title>{`${days[i].count} mensajes`}</title>
                      </g>
                    ))}
                  </svg>
                </div>
                <div className="flex justify-between mt-2 px-1">
                  {days.map((day, i) => (
                    <div key={i} className="text-center">
                      <span className="text-[9px] text-slate-400 font-bold block leading-none">{day.label.replace(".", "")}</span>
                      <span className="text-[9px] text-slate-500 font-black block mt-1 leading-none">{day.date}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* License Status */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-sm text-on-surface">Alertas y Estado de Licencias</h3>
            <p className="text-xs text-slate-500">Distribución de vigencias y alertas críticas de expiración.</p>
          </div>
          <div className="space-y-5 mt-4">
            <div className="flex justify-between items-end">
              <span className="text-xs font-bold text-slate-500">Total Suscripciones</span>
              <span className="text-2xl font-black text-on-surface">{totalL}</span>
            </div>
            <div className="w-full h-4 bg-slate-100 rounded-full overflow-hidden flex">
              {activePct > 0 && <div style={{ width: `${activePct}%` }} className="bg-emerald-500 h-full transition-all duration-500" title={`Activas: ${activePct.toFixed(1)}%`} />}
              {warningPct > 0 && <div style={{ width: `${warningPct}%` }} className="bg-orange-500 h-full transition-all duration-500" title={`Por vencer: ${warningPct.toFixed(1)}%`} />}
              {expiredPct > 0 && <div style={{ width: `${expiredPct}%` }} className="bg-red-600 h-full transition-all duration-500" title={`Vencidas: ${expiredPct.toFixed(1)}%`} />}
              {totalL === 0 && <div className="w-full h-full bg-slate-200" />}
            </div>
            <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-100">
              {[
                { color: "bg-emerald-500", label: "Activas", value: activeL },
                { color: "bg-orange-500", label: "Por vencer", value: warningL },
                { color: "bg-red-600", label: "Vencidas", value: expiredL },
              ].map((item) => (
                <div key={item.label}>
                  <div className="flex items-center gap-1.5">
                    <span className={`w-2.5 h-2.5 rounded-full ${item.color} shrink-0`}></span>
                    <span className="text-[10px] font-bold text-slate-500 uppercase">{item.label}</span>
                  </div>
                  <span className="text-sm font-black text-on-surface block mt-0.5">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h3 className="font-bold text-sm text-on-surface mb-4">Accesos Rápidos Operativos</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {isAdmin && (
            <button
              onClick={onOpenLicenseModal}
              className="group bg-white border border-slate-200 p-6 rounded-2xl shadow-sm text-left hover:border-red-500/50 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-pointer flex items-center justify-between"
            >
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-red-500 uppercase tracking-widest block">Acción de Clientes</span>
                <h4 className="font-black text-sm text-on-surface group-hover:text-primary transition-colors">Registrar Licencia</h4>
                <p className="text-xs text-slate-500">Añadir suscripción de software a un cliente.</p>
              </div>
              <div className="p-4 bg-red-50 text-red-600 rounded-xl group-hover:bg-red-600 group-hover:text-white transition-all">
                <span className="material-symbols-outlined text-2xl">add_moderator</span>
              </div>
            </button>
          )}
          {canEditTecnico && (
            <button
              onClick={onOpenFileModal}
              className="group bg-white border border-slate-200 p-6 rounded-2xl shadow-sm text-left hover:border-blue-500/50 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-pointer flex items-center justify-between"
            >
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-blue-500 uppercase tracking-widest block">Recursos Técnicos</span>
                <h4 className="font-black text-sm text-on-surface group-hover:text-blue-600 transition-colors">Subir Archivo / Driver</h4>
                <p className="text-xs text-slate-500">Almacenar manuales o instaladores.</p>
              </div>
              <div className="p-4 bg-blue-50 text-blue-600 rounded-xl group-hover:bg-blue-600 group-hover:text-white transition-all">
                <span className="material-symbols-outlined text-2xl">upload_file</span>
              </div>
            </button>
          )}
          {canEditCatalogo && (
            <button
              onClick={onOpenProductModal}
              className="group bg-white border border-slate-200 p-6 rounded-2xl shadow-sm text-left hover:border-emerald-500/50 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-pointer flex items-center justify-between"
            >
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest block">Gestión Catálogo</span>
                <h4 className="font-black text-sm text-on-surface group-hover:text-emerald-600 transition-colors">Registrar Producto</h4>
                <p className="text-xs text-slate-500">Publicar tintas, cintas o ribbons.</p>
              </div>
              <div className="p-4 bg-emerald-50 text-emerald-600 rounded-xl group-hover:bg-emerald-500 group-hover:text-white transition-all">
                <span className="material-symbols-outlined text-2xl">add_shopping_cart</span>
              </div>
            </button>
          )}
        </div>
      </div>

      {/* Recent Activity Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Messages */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-4">
              <div>
                <h3 className="font-bold text-sm text-on-surface">Últimos Mensajes de Soporte</h3>
                <p className="text-xs text-slate-500">Consultas de contacto recibidas a través de la web.</p>
              </div>
              <button onClick={() => setActiveTab("messages")} className="text-primary hover:text-red-700 text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer">
                Ver todos<span className="material-symbols-outlined text-xs">arrow_forward</span>
              </button>
            </div>
            <div className="divide-y divide-slate-100">
              {filteredMensajes.length > 0 ? (
                [...filteredMensajes]
                  .sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime())
                  .slice(0, 3)
                  .map((msg) => (
                    <div key={msg.id} className="py-4 flex items-start gap-4 transition-colors hover:bg-slate-50/50 rounded-xl px-2">
                      <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center font-bold text-xs text-slate-600 uppercase shrink-0 border border-slate-200">
                        {msg.nombre.substring(0, 2)}
                      </div>
                      <div className="flex-1 min-w-0 space-y-0.5">
                        <div className="flex justify-between items-baseline gap-2">
                          <h4 className="font-bold text-xs text-on-surface truncate">{msg.nombre}</h4>
                          <span className="text-[10px] text-slate-400 font-bold shrink-0">{formatDate(msg.fecha)}</span>
                        </div>
                        <p className="text-[10px] text-primary font-bold">{msg.asunto}</p>
                        <p className="text-xs text-slate-500 truncate leading-snug">{msg.mensaje}</p>
                      </div>
                      {!msg.leido && <span className="w-2 h-2 rounded-full bg-primary animate-pulse shrink-0 self-center" title="No leído"></span>}
                    </div>
                  ))
              ) : (
                <div className="py-8 text-center text-xs text-slate-400 font-medium">No hay mensajes de contacto registrados.</div>
              )}
            </div>
          </div>
        </div>

        {/* Upcoming License Expirations */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-4">
              <div>
                <h3 className="font-bold text-sm text-on-surface">Próximos Vencimientos de Licencias</h3>
                <p className="text-xs text-slate-500">Suscripciones vigentes ordenadas por proximidad de fin.</p>
              </div>
              <button onClick={() => setActiveTab("licenses")} className="text-primary hover:text-red-700 text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer">
                Gestionar todas<span className="material-symbols-outlined text-xs">arrow_forward</span>
              </button>
            </div>
            <div className="divide-y divide-slate-100">
              {(() => {
                const upcoming = [...filteredLicencias]
                  .filter(l => l.fecha_fin && l.estado === "activo")
                  .sort((a, b) => new Date(a.fecha_fin!).getTime() - new Date(b.fecha_fin!).getTime())
                  .slice(0, 3);
                return upcoming.length > 0 ? (
                  upcoming.map((lic) => {
                    const urgency = getLicenseUrgency(lic.fecha_fin);
                    return (
                      <div key={lic.id} className="py-4 flex items-center justify-between gap-4 transition-colors hover:bg-slate-50/50 rounded-xl px-2">
                        <div className="min-w-0 flex-1 space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="material-symbols-outlined text-sm text-slate-400 shrink-0">verified_user</span>
                            <h4 className="font-bold text-xs text-on-surface truncate">{lic.software}</h4>
                          </div>
                          <p className="text-[10px] text-slate-500 font-bold pl-5 truncate">Cliente: {lic.nombre_cliente}</p>
                          <p className="text-[10px] text-slate-400 pl-5">Vence: {formatDate(lic.fecha_fin)}</p>
                        </div>
                        <div className="shrink-0">
                          {urgency === "expired" ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-red-100 text-red-800 text-[9px] font-extrabold uppercase tracking-wide border border-red-200">Vencido</span>
                          ) : urgency === "warning" ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-orange-100 text-orange-800 text-[9px] font-extrabold uppercase tracking-wide border border-orange-200 animate-pulse">Por vencer</span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[9px] font-extrabold uppercase tracking-wide border border-emerald-200">Al día</span>
                          )}
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="py-8 text-center text-xs text-slate-400 font-medium">No hay licencias activas próximas a vencer.</div>
                );
              })()}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
