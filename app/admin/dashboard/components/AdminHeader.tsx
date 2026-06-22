import { Session } from "next-auth";
import { useState } from "react";
import { signOut } from "next-auth/react";

interface Props {
  session: Session | null;
  activeTab: string;
  setSidebarOpen: (open: boolean) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  darkMode: boolean;
  toggleDarkMode: () => void;
  guideVisible: boolean;
  setGuideVisible: React.Dispatch<React.SetStateAction<boolean>>;
  guideMode: "checklist" | "stepper";
  setGuideMode: React.Dispatch<React.SetStateAction<"checklist" | "stepper">>;
  guideStepIndex: Record<string, number>;
  setGuideStepIndex: React.Dispatch<React.SetStateAction<Record<string, number>>>;
  completedSteps: Record<string, boolean[]>;
  setCompletedSteps: React.Dispatch<React.SetStateAction<Record<string, boolean[]>>>;
  isAdmin: boolean;
  userRole: "admin" | "tecnico" | "vendedor" | undefined;
}

const SEARCH_PLACEHOLDERS: Record<string, string> = {
  overview: "Búsqueda rápida en el panel...",
  licenses: "Buscar licencias por cliente, software...",
  files: "Buscar archivos y manuales...",
  products: "Buscar productos...",
  categories: "Buscar categorías...",
  services: "Buscar servicios...",
  portfolio: "Buscar trabajos del portafolio...",
  messages: "Buscar mensajes por remitente, asunto o cuerpo...",
  users: "Buscar personal por nombre, usuario o rol...",
};

const GUIDES: Record<string, { icon: string; title: string; desc: string; steps: string[] }> = {
  overview: {
    icon: "dashboard", title: "Resumen General",
    desc: "Vista de alto nivel de toda la actividad del sistema.",
    steps: [
      "Monitorea las métricas clave de licencias, mensajes recibidos e ingresos en la barra de KPIs superior",
      "Consulta el gráfico de Tendencia de Consultas para ver el flujo de mensajes de la última semana",
      "Revisa la distribución de vigencias en la tarjeta 'Alertas y Estado de Licencias' (barra tricolor)",
      "Verifica los próximos vencimientos en la sección de Actividades Recientes (columna derecha)",
      "Utiliza los Accesos Rápidos para registrar una nueva licencia, subir archivos o registrar productos con un solo clic",
    ],
  },
  messages: {
    icon: "mail", title: "Mensajes de Contacto",
    desc: "Aquí llegan todos los mensajes enviados desde el formulario de contacto del sitio web.",
    steps: ["Los mensajes en negrita son no leídos", "Haz clic en un mensaje para ver el contenido completo", "Márcalos como leídos para limpiar la bandeja", "Solo el admin puede eliminar mensajes"],
  },
  licenses: {
    icon: "verified_user", title: "Gestión de Licencias",
    desc: "Registro de licencias de software vendidas a clientes, con alertas de vencimiento.",
    steps: ["Las licencias en rojo están vencidas, en naranja por vencer pronto", "Usa '+ Nueva Licencia' para registrar una venta", "Edita una licencia para actualizar su estado o fecha", "Filtra por estado para ver solo las activas o vencidas"],
  },
  products: {
    icon: "inventory_2", title: "Catálogo de Suministros",
    desc: "Gestiona los productos que aparecen en el catálogo público del sitio web.",
    steps: ["Sube imágenes desde tu PC o pega una URL directamente", "Asigna categorías para que los clientes puedan filtrar", "Activa/desactiva productos sin eliminarlos", "Los precios se muestran en soles (S/)"],
  },
  categories: {
    icon: "category", title: "Categorías del Catálogo",
    desc: "Las categorías organizan los productos del catálogo público.",
    steps: ["Crea categorías antes de agregar productos", "Desactiva una categoría para ocultar sus productos en la web", "Los nombres deben ser únicos"],
  },
  files: {
    icon: "folder_open", title: "Archivos y Drivers",
    desc: "Repositorio interno de controladores, programas y documentos para el equipo técnico.",
    steps: ["Sube archivos desde tu PC o pega un enlace (Drive, Dropbox, etc.)", "Clasifica por tipo: programa, driver, excel o link", "Solo técnicos y admins pueden subir archivos", "Los archivos solo son visibles para el personal con sesión activa"],
  },
  services: {
    icon: "build", title: "Gestión de Servicios",
    desc: "Los servicios que aparecen en la sección de servicios del sitio web público.",
    steps: ["Cada servicio tiene un icono de Material Symbols (ej: laptop_mac)", "Desactiva un servicio para ocultarlo del sitio sin eliminarlo", "Los trabajos del portafolio se asocian a servicios"],
  },
  portfolio: {
    icon: "photo_library", title: "Trabajos Realizados",
    desc: "Galería de proyectos completados que se muestra en el sitio web público.",
    steps: ["La foto principal es la portada que aparece en la cuadrícula", "Agrega fotos adicionales para crear un carrusel en el lightbox", "Asocia el trabajo a un servicio para que aparezca clasificado", "Los trabajos más recientes aparecen primero en la web"],
  },
  users: {
    icon: "group", title: "Gestión de Personal",
    desc: "Administra las cuentas de acceso al panel. Solo los administradores pueden ver y editar esta sección.",
    steps: ["Al crear un usuario, el sistema genera automáticamente su nombre de usuario y contraseña temporal", "Las credenciales se envían al correo del personal al crearse la cuenta", "El personal nuevo debe cambiar su contraseña en su primer ingreso", "Puedes desactivar cuentas sin eliminarlas"],
  },
};

export default function AdminHeader({
  session, activeTab, setSidebarOpen,
  searchQuery, setSearchQuery,
  darkMode, toggleDarkMode,
  guideVisible, setGuideVisible,
  guideMode, setGuideMode,
  guideStepIndex, setGuideStepIndex,
  completedSteps, setCompletedSteps,
  isAdmin, userRole,
}: Props) {
  const [profileOpen, setProfileOpen] = useState(false);
  const g = GUIDES[activeTab];

  const tabCompleted = g ? (completedSteps[activeTab] || new Array(g.steps.length).fill(false)) : [];
  const totalSteps = g ? g.steps.length : 0;
  const completedCount = tabCompleted.filter(Boolean).length;
  const percent = totalSteps > 0 ? Math.round((completedCount / totalSteps) * 100) : 0;
  const currentStepIdx = guideStepIndex[activeTab] || 0;

  const toggleStep = (index: number) => {
    setCompletedSteps((prev) => {
      const current = prev[activeTab] ? [...prev[activeTab]] : new Array(totalSteps).fill(false);
      current[index] = !current[index];
      return { ...prev, [activeTab]: current };
    });
  };

  const resetProgress = () => {
    setCompletedSteps((prev) => ({ ...prev, [activeTab]: new Array(totalSteps).fill(false) }));
    setGuideStepIndex((prev) => ({ ...prev, [activeTab]: 0 }));
  };

  const setStepIdx = (index: number) => {
    setGuideStepIndex((prev) => ({ ...prev, [activeTab]: Math.max(0, Math.min(totalSteps - 1, index)) }));
  };

  return (
    <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 flex justify-between items-center w-full h-16 px-4 sm:px-8 gap-3 sticky top-0 z-40">
      <div className="flex items-center gap-3 sm:gap-6 w-full max-w-md">
        <button
          onClick={() => setSidebarOpen(true)}
          className="lg:hidden w-9 h-9 shrink-0 rounded-lg flex items-center justify-center text-slate-500 hover:text-on-surface hover:bg-slate-100 transition-colors cursor-pointer"
          aria-label="Abrir menú"
        >
          <span className="material-symbols-outlined text-[22px]">menu</span>
        </button>
        <div className="relative w-full">
          <span className="absolute inset-y-0 left-3 flex items-center text-slate-400">
            <span className="material-symbols-outlined text-[20px]">search</span>
          </span>
          <input
            className="w-full bg-slate-100 border-none rounded-xl pl-10 pr-4 py-2 text-xs focus:bg-white focus:scale-[1.01] focus:shadow-md focus:ring-1 focus:ring-red-600/30 focus:outline-none transition-all placeholder:text-slate-500 duration-200"
            placeholder={SEARCH_PLACEHOLDERS[activeTab] || "Buscar..."}
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="flex items-center gap-2">
        {/* Guide popup */}
        <div className="relative">
          <button
            onClick={() => setGuideVisible((v) => !v)}
            className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all hover:scale-105 active:scale-95 hover:shadow-md cursor-pointer ${
              guideVisible
                ? "bg-primary text-white shadow-sm shadow-primary/10"
                : "bg-slate-100 hover:bg-slate-200/80 text-slate-600 hover:text-on-surface dark-theme-toggle"
            }`}
            title={guideVisible ? "Ocultar guía" : "Mostrar guía de esta sección"}
          >
            <span className="material-symbols-outlined text-[20px]">
              {guideVisible ? "help" : "help_outline"}
            </span>
          </button>

          {guideVisible && g && (
            <div className="fixed top-16 right-4 sm:absolute sm:right-0 sm:top-12 z-50 w-[calc(100vw-32px)] sm:w-[420px] bg-white border border-primary/20 rounded-2xl p-5 shadow-2xl animate-fade-in text-left text-on-background guide-popup-card">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-3">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-lg">{g.icon}</span>
                  <span className="text-xs font-bold text-slate-800 font-headline">Guía de {g.title}</span>
                </div>
                <div className="flex items-center gap-1">
                  <button onClick={resetProgress} className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all cursor-pointer flex items-center" title="Reiniciar progreso" type="button">
                    <span className="material-symbols-outlined text-base">restart_alt</span>
                  </button>
                  <button onClick={() => setGuideVisible(false)} className="p-1 rounded-md text-slate-400 hover:text-slate-600 transition-colors cursor-pointer flex items-center" title="Cerrar" type="button">
                    <span className="material-symbols-outlined text-base">close</span>
                  </button>
                </div>
              </div>

              <p className="text-[11px] text-slate-500 mb-3">{g.desc}</p>

              {/* Mode selector */}
              <div className="flex items-center bg-slate-100 rounded-lg p-1 mb-4 border border-slate-200 w-fit">
                {(["checklist", "stepper"] as const).map((mode) => (
                  <button
                    key={mode}
                    onClick={() => setGuideMode(mode)}
                    className={`px-3 py-1 rounded-md text-[10px] font-bold transition-all cursor-pointer ${
                      guideMode === mode ? "bg-white text-primary shadow-sm border border-slate-200" : "text-slate-500 hover:text-slate-700"
                    }`}
                    type="button"
                  >
                    {mode === "checklist" ? "Checklist" : "Paso a paso"}
                  </button>
                ))}
              </div>

              {/* Progress bar */}
              <div className="mb-4">
                <div className="flex justify-between text-[10px] font-bold text-slate-500 mb-1">
                  <span>{completedCount} de {totalSteps} completados</span>
                  <span className="text-primary">{percent}%</span>
                </div>
                <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                  <div className="h-full bg-primary transition-all duration-500 rounded-full" style={{ width: `${percent}%` }} />
                </div>
              </div>

              {guideMode === "checklist" ? (
                <div className="space-y-2">
                  {g.steps.map((step, i) => {
                    const isDone = tabCompleted[i] || false;
                    return (
                      <div
                        key={i}
                        onClick={() => toggleStep(i)}
                        className={`flex items-start gap-2 p-1.5 rounded-lg transition-all cursor-pointer border select-none group ${
                          isDone ? "bg-slate-50 border-slate-200/60" : "bg-white border-slate-100 hover:border-primary/30 hover:shadow-xs"
                        }`}
                      >
                        <div className="mt-0.5 shrink-0">
                          {isDone ? (
                            <span className="material-symbols-outlined text-primary text-[14px] bg-red-50 rounded-full w-4.5 h-4.5 flex items-center justify-center font-bold">check</span>
                          ) : (
                            <span className="w-4.5 h-4.5 rounded-full border border-slate-300 group-hover:border-primary transition-colors flex items-center justify-center text-[8px] text-slate-400 font-bold">{i + 1}</span>
                          )}
                        </div>
                        <span className={`text-[11px] font-semibold leading-normal ${isDone ? "text-slate-400 line-through" : "text-slate-700 group-hover:text-slate-900"}`}>
                          {step}
                        </span>
                      </div>
                    );
                  })}
                  {percent === 100 && (
                    <div className="bg-green-100 border border-green-200 rounded-lg p-2 flex items-center gap-2 animate-fade-in">
                      <span className="material-symbols-outlined text-green-600 text-base">workspace_premium</span>
                      <p className="text-[10px] font-bold text-green-800 m-0">¡Felicidades! Has aprendido todo en este módulo.</p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="bg-white border border-slate-200 rounded-xl p-3.5 shadow-xs relative min-h-[95px] flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-center">
                        <span className="text-[8px] font-black text-primary tracking-wider uppercase">Paso {currentStepIdx + 1} de {totalSteps}</span>
                        <label className="flex items-center gap-1 cursor-pointer select-none text-[9px] font-bold text-slate-500 bg-slate-50 px-1.5 py-0.5 rounded border border-slate-200">
                          <input
                            type="checkbox"
                            checked={tabCompleted[currentStepIdx] || false}
                            onChange={() => toggleStep(currentStepIdx)}
                            className="rounded border-slate-300 text-primary focus:ring-primary w-2.5 h-2.5 cursor-pointer"
                          />
                          <span>Hecho</span>
                        </label>
                      </div>
                      <p className="text-[11px] font-bold text-slate-800 mt-2 leading-relaxed">{g.steps[currentStepIdx]}</p>
                    </div>
                    <div className="flex items-center justify-between border-t border-slate-100 pt-2.5 mt-3">
                      <button
                        onClick={() => setStepIdx(currentStepIdx - 1)}
                        disabled={currentStepIdx === 0}
                        className={`px-2 py-1 rounded text-[10px] font-bold flex items-center gap-0.5 transition-all cursor-pointer ${currentStepIdx === 0 ? "text-slate-300 cursor-not-allowed" : "text-primary hover:bg-red-50"}`}
                        type="button"
                      >
                        <span className="material-symbols-outlined text-xs">arrow_back</span>
                        Atrás
                      </button>
                      <div className="flex items-center gap-1">
                        {g.steps.map((_, i) => (
                          <button
                            key={i}
                            onClick={() => setStepIdx(i)}
                            className={`w-1.5 h-1.5 rounded-full transition-all cursor-pointer ${i === currentStepIdx ? "bg-primary w-3" : tabCompleted[i] ? "bg-primary/30" : "bg-slate-200"}`}
                            type="button"
                          />
                        ))}
                      </div>
                      <button
                        onClick={() => {
                          if (currentStepIdx === totalSteps - 1) { setStepIdx(0); setGuideMode("checklist"); }
                          else { setStepIdx(currentStepIdx + 1); }
                        }}
                        className="px-2 py-1 bg-primary hover:bg-red-700 text-white rounded text-[10px] font-bold flex items-center gap-0.5 transition-all cursor-pointer"
                        type="button"
                      >
                        {currentStepIdx === totalSteps - 1 ? "Fin" : "Siguiente"}
                        <span className="material-symbols-outlined text-xs">{currentStepIdx === totalSteps - 1 ? "check" : "arrow_forward"}</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Dark mode toggle */}
        <button
          onClick={toggleDarkMode}
          className="w-10 h-10 rounded-xl flex items-center justify-center bg-slate-100 hover:bg-slate-200/80 dark-theme-toggle transition-all hover:scale-105 active:scale-95 hover:shadow-md cursor-pointer text-slate-600 hover:text-on-surface animate-fade-in"
          title="Cambiar tema (Claro/Oscuro)"
        >
          <span className="material-symbols-outlined text-[20px]">{darkMode ? "light_mode" : "dark_mode"}</span>
        </button>

        {/* User info */}
        <div className="relative">
          <button
            onClick={() => setProfileOpen(!profileOpen)}
            className="flex items-center gap-3 group/user cursor-pointer border-none bg-transparent focus:outline-none"
            title="Ver información de perfil"
          >
            <div className="text-right hidden sm:block">
              <p className="text-xs font-bold text-on-surface group-hover/user:text-primary transition-colors duration-200">{session?.user?.name || "Usuario Dellcom"}</p>
              <p className="text-[9px] text-red-500 font-bold uppercase tracking-wider">{(session?.user as any)?.role || "Técnico"}</p>
            </div>
            <div className="w-8 h-8 rounded-full bg-red-600 flex items-center justify-center shadow-inner shrink-0 group-hover/user:scale-105 group-hover/user:ring-2 group-hover/user:ring-red-600/35 transition-all duration-200">
              <span className="material-symbols-outlined text-white text-[16px]">
                {isAdmin ? "admin_panel_settings" : userRole === "tecnico" ? "engineering" : "storefront"}
              </span>
            </div>
          </button>

          {profileOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setProfileOpen(false)} />
              <div className="absolute right-0 top-12 z-50 w-64 bg-white border border-slate-200 rounded-2xl p-5 shadow-xl animate-fade-in text-left text-on-background guide-popup-card">
                <div className="flex items-center gap-3 border-b border-slate-100 pb-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-red-600 flex items-center justify-center text-white shrink-0">
                    <span className="material-symbols-outlined text-lg">
                      {isAdmin ? "admin_panel_settings" : userRole === "tecnico" ? "engineering" : "storefront"}
                    </span>
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-xs font-bold text-slate-800 font-headline truncate">{session?.user?.name || "Usuario Dellcom"}</h4>
                    <p className="text-[10px] text-slate-400 truncate">{session?.user?.email || "correo@dellcom.com"}</p>
                  </div>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex justify-between items-center text-slate-500 py-1">
                    <span>Rol asignado:</span>
                    <span className="font-bold text-red-500 uppercase text-[9px] tracking-wider bg-red-50 px-2 py-0.5 rounded border border-red-200">
                      {(session?.user as any)?.role || "Técnico"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-slate-500 py-1">
                    <span>ID de Usuario:</span>
                    <span className="font-mono text-[9px] bg-slate-100 px-1.5 py-0.5 rounded text-slate-700">
                      {(session?.user as any)?.id ? String((session?.user as any)?.id).substring(0, 8) + "..." : "Local"}
                    </span>
                  </div>
                </div>

                <div className="border-t border-slate-100 mt-4 pt-3 flex flex-col gap-1">
                  <button
                    onClick={() => {
                      setProfileOpen(false);
                      signOut({ callbackUrl: "/admin/login" });
                    }}
                    className="w-full flex items-center gap-2 text-left text-xs font-semibold text-slate-600 hover:text-primary hover:bg-red-50/50 p-2 rounded-lg transition-colors cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-sm">logout</span>
                    Cerrar Sesión
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
