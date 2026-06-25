// DELLCOM SAC - Portal Principal
import { prisma } from "@/lib/prisma";
import StatusHeader from "./components/StatusHeader";
import CleanFooter from "./components/CleanFooter";
import HomeHeroSearch from "./components/HomeHeroSearch";
import ScrollRevealObserver from "./components/ScrollRevealObserver";
import HomePortfolioBubblePreview from "./components/HomePortfolioBubblePreview";
import HomeFaqSection from "./components/HomeFaqSection";
import HomeServicesSection from "./components/HomeServicesSection";
import HomeAboutSection from "./components/HomeAboutSection";
import HomeLocationSection from "./components/HomeLocationSection";

export const metadata = {
  title: "DELLCOM SAC | Tu centro de confianza",
  description: "Servicios tecnológicos y soporte de TI de alto nivel en Los Olivos, Lima. Reparación de laptops, licenciamiento oficial y microelectrónica.",
};

export const dynamic = "force-dynamic";

async function getTrabajos() {
  try {
    const dbTrabajos = await prisma.trabajoRealizado.findMany({ include: { servicio: true }, orderBy: { fecha: "desc" } });
    if (dbTrabajos && dbTrabajos.length > 0) {
      return dbTrabajos.map(t => ({ id: t.id, titulo: t.titulo, descripcion: t.descripcion, imagen_url: t.imagen_url, fecha: t.fecha, servicio: t.servicio ? { nombre: t.servicio.nombre } : null }));
    }
  } catch {
    /* Prisma unavailable */
  }
  return [
    { id: 1, titulo: "Mantenimiento y Reballing de Placa Servidor HP ProLiant", descripcion: "Diagnóstico electrónico avanzado por cortocircuito y reballing de chip de potencia en placa de servidor HP ProLiant G10. Operatividad restablecida al 100%.", imagen_url: "/img/servicios/microelectronica.jpg", fecha: new Date("2026-05-10"), servicio: { nombre: "Microelectrónica y Placas" } },
    { id: 3, titulo: "Reparación y Mantenimiento de Impresora Industrial Zebra ZT411", descripcion: "Calibración de sensor de etiquetas, limpieza del cabezal térmico y reemplazo de rodillo tractor. Configurada para impresión de códigos de barra a alta velocidad.", imagen_url: "/img/servicios/impresora_zebra_mantenimiento.png", fecha: new Date("2026-04-28"), servicio: { nombre: "Reparación de Laptops e Impresoras" } },
  ];
}

export default async function Home() {
  const trabajos = await getTrabajos();

  return (
    <>
      <StatusHeader />

      <main className="pt-16 bg-white">
        {/* Hero Section */}
        <section className="relative min-h-[85vh] flex items-center bg-slate-50/40 px-margin-mobile md:px-margin-desktop">
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: "radial-gradient(#000 1px, transparent 1px)", backgroundSize: "20px 20px" }} />
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[100px]" />
          </div>

          <div className="max-w-container-max mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center w-full py-16">
            <div className="relative z-20 space-y-8 animate-fade-in-up">
              <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-1.5 rounded-full text-xs font-bold tracking-wider uppercase">
                <span className="material-symbols-outlined text-[16px] fill-1">verified</span>
                10 Años Liderando el Soporte y la Consultoría IT
              </div>
              <div className="space-y-4">
                <h1 className="font-headline text-4xl md:text-5xl lg:text-6xl font-black text-on-surface leading-tight tracking-tight">
                  Ingeniería IT de <br /><span className="text-primary italic">Alta Precisión</span>
                </h1>
                <p className="text-sm md:text-base text-on-surface-variant max-w-lg leading-relaxed">
                  Desde reparación electrónica a nivel de placa madre hasta licenciamiento oficial. Garantizamos la continuidad operativa de tu empresa con soluciones inmediatas.
                </p>
              </div>
              <HomeHeroSearch />
            </div>

            <div className="relative flex justify-center items-center py-8 animate-float">
              <div className="absolute inset-0 bg-primary/5 rounded-full blur-[100px] scale-75 pointer-events-none" />
              <div className="absolute -top-4 -right-4 w-48 h-48 bg-primary/5 rounded-[40%_60%_70%_30%/_40%_50%_60%_50%] pointer-events-none -z-10 animate-pulse" style={{ animationDuration: "6s" }} />
              <div className="absolute -bottom-6 -left-6 w-36 h-36 bg-primary/5 rounded-[50%_50%_30%_70%/_50%_60%_40%_60%] pointer-events-none -z-10" />
              <div className="absolute -bottom-8 -left-8 w-28 h-28 border border-primary/10 rounded-full pointer-events-none -z-10" />
              <div className="absolute -bottom-12 -left-2 w-20 h-20 border border-primary/5 rounded-full pointer-events-none -z-10" />

              <div className="relative z-10 w-full max-w-[550px]">
                <div className="relative aspect-[4/3] overflow-hidden rounded-[2rem] border-[6px] border-white shadow-2xl hover:scale-[1.02] transition-transform duration-500">
                  <img alt="Sede DELLCOM SAC Counter" className="w-full h-full object-cover" src="/img/portafolio/WhatsApp Image 2026-06-14 at 9.36.54 PM.jpeg" />
                </div>
                <div className="absolute bottom-0 right-[-30] bg-white/95 backdrop-blur-md border border-slate-200/60 py-2.5 px-4 rounded-2xl shadow-xl flex items-center gap-2.5 transform rotate-2 hover:rotate-0 transition-transform duration-300 z-20">
                  <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                    <span className="material-symbols-outlined text-[18px] font-bold animate-pulse">workspace_premium</span>
                  </div>
                  <div>
                    <p className="text-[9px] text-slate-400 font-extrabold uppercase tracking-wider leading-none">Soporte Técnico</p>
                    <p className="text-xs text-slate-800 font-bold mt-0.5 leading-none">100% Certificado</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <HomeServicesSection />

        {/* Portfolio Section */}
        <section className="py-24 px-margin-mobile md:px-margin-desktop bg-slate-50/50 border-t border-slate-100" id="portafolio">
          <div className="max-w-container-max mx-auto">
            <div className="scroll-reveal text-center mb-16 space-y-3">
              <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider mb-2">
                <span className="material-symbols-outlined text-[16px]">verified</span>
                Casos de Éxito y Garantía IT
              </div>
              <h2 className="font-headline text-3xl md:text-4xl font-bold text-on-surface">Trabajos Técnicos <span className="text-primary">Realizados</span></h2>
              <p className="text-sm md:text-base text-on-surface-variant max-w-2xl mx-auto leading-relaxed font-semibold">
                Una muestra de nuestra experiencia en el campo: soluciones precisas en microelectrónica y soporte de hardware certificado.
              </p>
            </div>
            <div className="scroll-reveal">
              <HomePortfolioBubblePreview trabajos={trabajos} />
            </div>
          </div>
        </section>

        <HomeAboutSection />
        <HomeLocationSection />
        <HomeFaqSection />
      </main>

      <CleanFooter />
      <ScrollRevealObserver />
    </>
  );
}
