/**
 * Página corporativa "Nosotros": /nosotros
 * Server Component estático (sin llamadas a DB). Describe la historia,
 * equipo, valores y diferenciadores de DELLCOM SAC.
 * Incluye una línea de tiempo de hitos y tarjetas del equipo técnico.
 */
import Link from "next/link";
import StatusHeader from "../components/StatusHeader";
import CleanFooter from "../components/CleanFooter";
import ScrollRevealObserver from "../components/ScrollRevealObserver";
import CounterStats from "../components/CounterStats";

export const metadata = {
  title: "Nosotros — DELLCOM SAC | Ingeniería IT en Los Olivos, Lima",
  description:
    "Conoce a DELLCOM SAC: más de 10 años brindando soporte técnico, reparación de equipos, cableado estructurado y licencias certificadas en Lima Norte.",
};

export default function NosotrosPage() {
  return (
    <div className="selection:bg-primary/20 selection:text-primary bg-white min-h-screen flex flex-col justify-between text-on-surface">
      {/* Reusable Status Header */}
      <StatusHeader />

      <main className="flex-1 pt-16">
        {/* Asymmetric Header Banner */}
        <section className="relative py-16 overflow-hidden bg-slate-50/50 border-b border-slate-100">
          <div className="absolute inset-0 tech-pattern pointer-events-none" />
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] pointer-events-none" />

          <div className="relative max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop text-center z-10 scroll-reveal">
            <span className="inline-block py-1 px-3.5 mb-4 bg-slate-100 border border-slate-200/80 text-slate-700 font-bold text-[10px] rounded-full uppercase tracking-widest">
              Nuestra Historia
            </span>
            <h1 className="font-headline text-3xl md:text-5xl font-black text-on-surface leading-tight tracking-tight">
              Sobre <span className="text-primary">Nosotros</span>
            </h1>
            <p className="text-xs md:text-sm font-semibold text-on-surface-variant max-w-xl mx-auto mt-2 leading-relaxed">
              Más de 10 años transformando desafíos técnicos en soluciones de vanguardia para la infraestructura IT más exigente del Perú.
            </p>
          </div>
        </section>

        {/* Narrative & Laboratory Showcase */}
        <section className="py-24 bg-white overflow-hidden">
          <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            
            {/* Redesigned organic image showcase layout matching the HubSpot inspiration */}
            <div className="relative w-full max-w-[480px] mx-auto aspect-[4/5] group scroll-reveal order-last lg:order-first">
              {/* Decorative background blob */}
              <div 
                className="absolute inset-0 bg-primary/5 transform -rotate-6 scale-105 transition-transform duration-700 group-hover:rotate-0" 
                style={{ borderRadius: "40% 60% 70% 30% / 40% 50% 60% 50%" }}
              />
              
              {/* Image container with organic blob shape */}
              <div 
                className="absolute inset-0 overflow-hidden shadow-2xl border-4 border-white"
                style={{ borderRadius: "60% 40% 30% 70% / 60% 30% 70% 40%" }}
              >
                <img 
                  alt="Sede Principal DELLCOM SAC" 
                  className="w-full h-full object-cover transition-transform duration-700 hover:scale-105" 
                  src="/img/servicios/tienda_front.jpg" 
                />
              </div>

              {/* Floating Sede Central Badge */}
              <div className="hidden sm:flex absolute -bottom-6 -left-6 bg-white/95 backdrop-blur-[2px] border border-slate-200/60 p-4 rounded-2xl shadow-xl items-center gap-3 transform -rotate-3 hover:rotate-0 transition-transform duration-300">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined text-xl">location_on</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block leading-none">Sede Central</span>
                  <span className="text-xs font-black text-on-surface mt-1 block">Los Olivos, Lima</span>
                </div>
              </div>

              {/* Floating 100% Certified Badge */}
              <div className="hidden sm:flex absolute -top-6 -right-6 bg-white/95 backdrop-blur-[2px] border border-slate-200/60 py-3 px-4 rounded-2xl shadow-xl items-center gap-2.5 transform rotate-3 hover:rotate-0 transition-transform duration-300">
                <span className="material-symbols-outlined text-primary text-lg">verified</span>
                <span className="text-[10px] font-black uppercase tracking-wider text-on-surface">100% Certificado</span>
              </div>
            </div>
            
            <div className="scroll-reveal space-y-8" style={{ transitionDelay: "150ms" }}>
              <h3 className="font-headline text-2xl md:text-4xl font-black text-on-surface relative pb-3 leading-tight">
                Trayectoria Orientada al <span className="text-primary font-bold">Futuro Digital</span>
                <div className="absolute bottom-0 left-0 w-24 h-1 bg-primary rounded-full" />
              </h3>
              
              <div className="space-y-6 text-sm md:text-base text-on-surface-variant leading-relaxed font-semibold">
                <p>
                  Nacimos con una visión clara: elevar los estándares de soporte técnico y consultoría IT en el mercado nacional. Lo que comenzó como un taller especializado se transformó rápidamente en un centro neurálgico de ingeniería de precisión.
                </p>
                <p>
                  Hoy, DELLCOM SAC es reconocido como un aliado estratégico líder en infraestructura crítica. Nuestra evolución ha sido impulsada por una obsesión constante con el detalle técnico y un compromiso inquebrantable con la continuidad operativa de nuestros socios corporativos.
                </p>
                
                {/* Re-aligned Foundation/Sede central values */}
                <div className="pt-4 flex gap-4">
                  <div className="p-5 bg-slate-50 border border-slate-200/50 rounded-2xl flex-1 flex items-center gap-4 hover:shadow-md hover:bg-white transition-all duration-300">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-xl">event_available</span>
                    </div>
                    <div>
                      <span className="font-headline text-xl font-black text-on-surface block leading-none">2014</span>
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mt-1 leading-none">Fundación</span>
                    </div>
                  </div>
                  <div className="p-5 bg-slate-50 border border-slate-200/50 rounded-2xl flex-1 flex items-center gap-4 hover:shadow-md hover:bg-white transition-all duration-300">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-xl">domain</span>
                    </div>
                    <div>
                      <span className="font-headline text-xl font-black text-on-surface block leading-none">Lima</span>
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mt-1 leading-none">Sede Central</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Mission & Vision Sections (Alternating HubSpot/Dave Style) */}
        <section className="py-24 bg-slate-50/50 border-t border-b border-slate-100/80 overflow-hidden space-y-28">
          <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
            
            {/* Mission Row */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center">
              {/* Text Column */}
              <div className="lg:col-span-7 space-y-5 scroll-reveal">
                <span className="inline-block py-1 px-3 bg-primary/10 border border-primary/15 text-primary font-bold text-[9px] rounded-full uppercase tracking-widest leading-none">
                  Propósito
                </span>
                <h3 className="font-headline text-2xl md:text-4xl font-black text-on-surface leading-tight">
                  Nuestra <span className="text-primary">Misión</span>
                </h3>
                <p className="text-sm md:text-base text-on-surface-variant leading-relaxed font-semibold">
                  Garantizar la continuidad operativa de nuestros clientes mediante la implementación de soluciones de infraestructura robustas y soporte técnico de alta precisión, minimizando riesgos y optimizando el rendimiento tecnológico.
                </p>
              </div>

              {/* Image Column */}
              <div className="lg:col-span-5 relative group scroll-reveal" style={{ transitionDelay: "150ms" }}>
                {/* Decorative background blob */}
                <div 
                  className="absolute inset-0 bg-primary/5 transform -rotate-6 scale-105 transition-transform duration-700 group-hover:rotate-0" 
                  style={{ borderRadius: "50% 50% 30% 70% / 50% 60% 40% 50%" }}
                />
                
                {/* Image container with organic blob shape */}
                <div 
                  className="relative overflow-hidden aspect-[4/3] shadow-xl border-4 border-white"
                  style={{ borderRadius: "60% 40% 30% 70% / 60% 30% 70% 40%" }}
                >
                  <img 
                    alt="Misión DELLCOM SAC" 
                    className="w-full h-full object-cover transition-transform duration-700 hover:scale-105" 
                    src="/img/servicios/reparacion_laptop.jpg" 
                  />
                </div>

                {/* Overlapping badge */}
                <div className="hidden sm:flex absolute -bottom-4 -right-4 bg-white/95 backdrop-blur-[2px] border border-slate-200/60 py-2.5 px-4 rounded-xl shadow-lg items-center gap-2 transform rotate-2 hover:rotate-0 transition-transform duration-300">
                  <span className="material-symbols-outlined text-primary text-base">verified_user</span>
                  <span className="text-[9px] font-black uppercase tracking-wider text-on-surface">Continuidad Operativa</span>
                </div>
              </div>
            </div>

          </div>

          <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
            
            {/* Vision Row */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center">
              {/* Image Column */}
              <div className="lg:col-span-5 relative group scroll-reveal">
                {/* Decorative background blob */}
                <div 
                  className="absolute inset-0 bg-primary/5 transform rotate-6 scale-105 transition-transform duration-700 group-hover:rotate-0" 
                  style={{ borderRadius: "40% 60% 70% 30% / 40% 50% 60% 50%" }}
                />
                
                {/* Image container with organic blob shape */}
                <div 
                  className="relative overflow-hidden aspect-[4/3] shadow-xl border-4 border-white"
                  style={{ borderRadius: "50% 50% 40% 60% / 60% 40% 50% 50%" }}
                >
                  <img 
                    alt="Visión DELLCOM SAC" 
                    className="w-full h-full object-cover transition-transform duration-700 hover:scale-105" 
                    src="/img/servicios/microelectronica.jpg" 
                  />
                </div>

                {/* Overlapping badge */}
                <div className="hidden sm:flex absolute -bottom-4 -left-4 bg-white/95 backdrop-blur-[2px] border border-slate-200/60 py-2.5 px-4 rounded-xl shadow-lg items-center gap-2 transform -rotate-2 hover:rotate-0 transition-transform duration-300">
                  <span className="material-symbols-outlined text-primary text-base">visibility</span>
                  <span className="text-[9px] font-black uppercase tracking-wider text-on-surface">Liderazgo Tecnológico</span>
                </div>
              </div>

              {/* Text Column */}
              <div className="lg:col-span-7 space-y-5 scroll-reveal" style={{ transitionDelay: "150ms" }}>
                <span className="inline-block py-1 px-3 bg-primary/10 border border-primary/15 text-primary font-bold text-[9px] rounded-full uppercase tracking-widest leading-none">
                  Determinación
                </span>
                <h3 className="font-headline text-2xl md:text-4xl font-black text-on-surface leading-tight">
                  Nuestra <span className="text-primary">Visión</span>
                </h3>
                <p className="text-sm md:text-base text-on-surface-variant leading-relaxed font-semibold">
                  Ser el referente nacional en ingeniería de precisión IT, liderando la transformación tecnológica con estándares internacionales de calidad y siendo reconocidos como el socio más confiable para la infraestructura crítica en el Perú.
                </p>
              </div>
            </div>

          </div>
        </section>

        {/* Core Values */}
        <section className="py-24 bg-white border-t border-slate-100">
          <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
            <div className="text-center mb-16 space-y-3 scroll-reveal">
              <span className="inline-flex items-center gap-2 bg-primary/10 border border-primary/15 text-primary px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider mb-2">
                <span className="material-symbols-outlined text-[16px]">stars</span>
                Pilares del Soporte
              </span>
              <h3 className="font-headline text-3xl font-bold text-on-surface">Nuestros <span className="text-primary">Valores Fundamentales</span></h3>
              <p className="text-sm font-semibold text-on-surface-variant max-w-lg mx-auto">
                El ADN que guía cada intervención técnica y decisión estratégica.
              </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { icon: "handshake", title: "Compromiso", desc: "Dedicación total al éxito y tranquilidad de nuestros clientes.", video: "/img/videos/compromiso.mp4" },
                { icon: "biotech", title: "Precisión", desc: "Exactitud técnica rigurosa en cada diagnóstico y reparación.", video: "/img/videos/precision.mp4" },
                { icon: "lightbulb", title: "Innovación", desc: "Búsqueda constante de soluciones disruptivas y eficientes.", video: "/img/videos/innovacion.mp4" },
                { icon: "gavel", title: "Integridad", desc: "Ética profesional y transparencia absoluta en cada proceso.", video: "/img/videos/integridad.mp4" }
              ].map((item, index) => (
                <div
                  key={item.title}
                  className="group relative border border-slate-100 hover:border-primary/30 hover:shadow-xl rounded-[2rem] p-8 transition-all duration-500 overflow-hidden flex flex-col justify-between min-h-[260px]"
                  style={{ transitionDelay: `${index * 100}ms` }}
                >
                  <video
                    src={item.video}
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="absolute inset-0 w-full h-full object-cover opacity-90 transition-opacity duration-500"
                  />
                  <div className="absolute inset-0 bg-black/30 group-hover:bg-primary/92 transition-colors duration-500" />

                  <div className="relative z-10 flex flex-col justify-between h-full">
                    <div>
                      <div className="w-14 h-14 rounded-2xl bg-white border border-white/60 flex items-center justify-center mb-6 text-primary shadow-sm transition-colors duration-300">
                        <span className="material-symbols-outlined text-2xl">{item.icon}</span>
                      </div>
                      <h5 className="font-headline text-lg font-bold text-white mb-2">{item.title}</h5>
                      <p className="text-xs text-white/80 leading-relaxed font-semibold">{item.desc}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Stats Section with Crimson Background & Client Counter Animation */}
        <section className="py-24 relative bg-primary text-white overflow-hidden scroll-reveal">
          <div className="absolute inset-0 opacity-10 mix-blend-overlay pointer-events-none">
            <div className="tech-pattern h-full w-full" />
          </div>
          <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-16 text-center lg:text-left items-center">
              <div>
                <h3 className="font-headline text-3xl font-bold mb-4 text-white">Impacto Medible en la Industria</h3>
                <p className="text-white/80 text-sm leading-relaxed">
                  Resultados tangibles que respaldan nuestra autoridad técnica y capacidad operativa en todo el país.
                </p>
              </div>
              <CounterStats />
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 bg-white">
          <div className="max-w-3xl mx-auto px-margin-mobile text-center scroll-reveal">
            <h3 className="font-headline text-3xl font-bold text-on-surface mb-6">¿Listo para asegurar su infraestructura?</h3>
            <p className="text-sm md:text-base text-on-surface-variant mb-10 max-w-lg mx-auto leading-relaxed">
              Agende una consultoría técnica inicial con nuestros expertos hoy mismo y garantice la continuidad operativa de su empresa.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="https://wa.me/51925981741?text=Hola%20Dellcom%20SAC,%20deseo%20agendar%20una%20consultor%C3%ADa%20IT%20para%20mi%20empresa."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-10 py-4 bg-primary text-white font-bold rounded-full shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all uppercase text-xs tracking-wider"
              >
                <span className="material-symbols-outlined text-[18px]">chat</span>
                Contáctanos por WhatsApp
              </a>
              <Link 
                href="/servicios"
                className="inline-flex items-center justify-center gap-2 px-10 py-4 border-2 border-primary text-primary font-bold rounded-full hover:bg-primary/5 transition-all uppercase text-xs tracking-wider active:scale-95"
              >
                Ver Portafolio de Servicios
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Reusable Clean Footer */}
      <CleanFooter />

      <ScrollRevealObserver />
    </div>
  );
}
