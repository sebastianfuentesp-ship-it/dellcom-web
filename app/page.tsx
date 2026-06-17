/**
 * Página principal (Home) de DELLCOM SAC: /
 * Es un Server Component: obtiene servicios y trabajos de la base de datos
 * en el servidor y los pasa como props a los componentes cliente.
 * Si la base de datos no responde, usa datos de fallback estáticos para
 * garantizar que la landing page siempre esté disponible.
 * Secciones: Hero, Servicios, Cotizador Express, Portfolio, CTA.
 */
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import StatusHeader from "./components/StatusHeader";
import CleanFooter from "./components/CleanFooter";
import HomeHeroSearch from "./components/HomeHeroSearch";
import ScrollRevealObserver from "./components/ScrollRevealObserver";
import HomePortfolioBubblePreview from "./components/HomePortfolioBubblePreview";

export const metadata = {
  title: "DELLCOM SAC | Tu centro de confianza",
  description: "Servicios tecnológicos y soporte de TI de alto nivel en Los Olivos, Lima. Reparación de laptops, estructurado de redes, licenciamiento oficial y microelectrónica.",
};

const serviceVisuals: Record<string, { image: string; icon: string }> = {
  "reparación": {
    image: "/img/servicios/reparacion_laptop.png",
    icon: "laptop_mac"
  },
  "microelectrónica": {
    image: "/img/servicios/microelectronica.jpg",
    icon: "memory"
  },
  "redes": {
    image: "/img/servicios/cableado_estructurado.png",
    icon: "dns"
  },
  "soporte": {
    image: "https://portalinnova.cl/wp-content/uploads/2021/06/Soporte-remoto-de-alta-confiabilidad-Plataforma-resuelve-problemas-tecnicos-en-segundos-y-con-la-maxima-seguridad-que-existe-en-el-mercado-scaled.jpg",
    icon: "support_agent"
  },
  "correo": {
    image: "https://images.unsplash.com/photo-1557200134-90327ee9fafa?auto=format&fit=crop&w=600&q=80",
    icon: "mail"
  },
  "licencia": {
    image: "/img/servicios/licencias_software.png",
    icon: "verified_user"
  }
};

function getServiceVisuals(nombre: string, defaultIcon: string) {
  const cleanName = nombre.toLowerCase();
  for (const [key, val] of Object.entries(serviceVisuals)) {
    if (cleanName.includes(key)) return val;
  }
  return {
    image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=600&q=80",
    icon: defaultIcon
  };
}

// Function to fetch services with static fallback if DB connection fails
async function getServices() {
  try {
    const dbServices = await prisma.servicio.findMany({
      where: { activo: true },
    });
    if (dbServices && dbServices.length > 0) {
      return dbServices.map(s => ({
        id: s.id,
        nombre: s.nombre,
        descripcion: s.descripcion,
        icono_url: s.icono_url || "laptop_mac",
      }));
    }
  } catch (error) {
    console.warn("Prisma DB connection failed. Using static fallback services data.");
  }

  return [
    {
      id: 1,
      nombre: "Reparación de Laptops y Equipos",
      descripcion: "Diagnóstico avanzado y reparación electrónica de hardware multimarca para laptops, impresoras y PCs de escritorio.",
      icono_url: "laptop_mac",
    },
    {
      id: 2,
      nombre: "Microelectrónica y Placas",
      descripcion: "Reparación a nivel de componentes en placas madre, reballing, microsoldadura y restauración de circuitos integrados.",
      icono_url: "memory",
    },
    {
      id: 3,
      nombre: "Redes y Servidores",
      descripcion: "Diseño, estructurado y montaje de redes de datos, racks de servidores y mantenimiento de conectividad empresarial.",
      icono_url: "dns",
    },
    {
      id: 4,
      nombre: "Soporte Remoto (AnyDesk)",
      descripcion: "Asistencia técnica remota inmediata para mantenimiento de sistemas operativos, virus, configuraciones y software de oficina.",
      icono_url: "support_agent",
    },
    {
      id: 5,
      nombre: "Correos Corporativos",
      descripcion: "Configuración, migración y administración de correos profesionales en Google Workspace, Microsoft 365 y Webmail corporativo.",
      icono_url: "mail",
    },
    {
      id: 6,
      nombre: "Licencias de Software",
      descripcion: "Venta e instalación de licencias de software originales para sistemas operativos Windows, suites de Office y antivirus corporativos.",
      icono_url: "verified_user",
    },
  ];
}

async function getTrabajos() {
  try {
    const dbTrabajos = await prisma.trabajoRealizado.findMany({
      include: { servicio: true },
      orderBy: { fecha: "desc" },
    });
    if (dbTrabajos && dbTrabajos.length > 0) {
      return dbTrabajos.map(t => ({
        id: t.id,
        titulo: t.titulo,
        descripcion: t.descripcion,
        imagen_url: t.imagen_url,
        fecha: t.fecha,
        servicio: t.servicio ? { nombre: t.servicio.nombre } : null
      }));
    }
  } catch (error) {
    console.warn("Prisma DB connection failed for trabajos. Using static fallback trabajos data.");
  }

  return [
    {
      id: 1,
      titulo: "Mantenimiento y Reballing de Placa Servidor HP ProLiant",
      descripcion: "Diagnóstico electrónico avanzado por cortocircuito y reballing de chip de potencia en placa de servidor HP ProLiant G10. Operatividad restablecida al 100%.",
      imagen_url: "/img/servicios/microelectronica.jpg",
      fecha: new Date("2026-05-10"),
      servicio: { nombre: "Microelectrónica y Placas" }
    },
    {
      id: 2,
      titulo: "Instalación y Configuración de Cableado Estructurado Cat6",
      descripcion: "Montaje y peinado de rack de telecomunicaciones, certificación de 48 puntos de red Gigabit y ordenamiento de switches de núcleo en oficinas corporativas.",
      imagen_url: "/img/servicios/cableado_estructurado.png",
      fecha: new Date("2026-05-05"),
      servicio: { nombre: "Redes y Servidores" }
    },
    {
      id: 3,
      titulo: "Reparación y Mantenimiento de Impresora Industrial Zebra ZT411",
      descripcion: "Calibración de sensor de etiquetas, limpieza del cabezal térmico y reemplazo de rodillo tractor. Configurada para impresión de códigos de barra a alta velocidad.",
      imagen_url: "/img/servicios/impresora_zebra_mantenimiento.png",
      fecha: new Date("2026-04-28"),
      servicio: { nombre: "Reparación de Laptops e Impresoras" }
    }
  ];
}

export default async function Home() {
  const servicios = await getServices();
  const trabajos = await getTrabajos();

  return (
    <>
      {/* Reusable Status Header */}
      <StatusHeader />

      <main className="pt-16 bg-white">
        {/* Hero Section */}
        <section className="relative min-h-[85vh] flex items-center bg-slate-50/40 px-margin-mobile md:px-margin-desktop">
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[100px]"></div>
          </div>
          
          <div className="max-w-container-max mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center w-full py-16">
            
            {/* Left Content */}
            <div className="relative z-20 space-y-8 animate-fade-in-up">
              <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-1.5 rounded-full text-xs font-bold tracking-wider uppercase">
                <span className="material-symbols-outlined text-[16px] fill-1">verified</span>
                10 Años Liderando el Soporte y la Consultoría IT
              </div>
              
              <div className="space-y-4">
                <h1 className="font-headline text-4xl md:text-5xl lg:text-6xl font-black text-on-surface leading-tight tracking-tight">
                  Ingeniería IT de <br />
                  <span className="text-primary italic">Alta Precisión</span>
                </h1>
                <p className="text-sm md:text-base text-on-surface-variant max-w-lg leading-relaxed">
                  Desde reparación electrónica a nivel de placa madre y configuración de redes estructuradas, hasta licenciamiento oficial. Garantizamos la continuidad operativa de tu empresa con soluciones inmediatas.
                </p>
              </div>
              
              {/* Autocompleting Fault Diagnostics Search (Non-Cliché Element) */}
              <HomeHeroSearch />
            </div>
            
            {/* Right Media (Real showroom/counter photo) */}
            <div className="relative flex justify-center items-center">
              <div className="absolute inset-0 bg-primary/5 rounded-full blur-[100px] scale-75"></div>
              <img 
                alt="Sede DELLCOM SAC Counter" 
                className="relative z-10 w-full max-w-[500px] aspect-[4/3] object-cover rounded-3xl drop-shadow-2xl animate-float" 
                src="/img/portafolio/WhatsApp Image 2026-06-14 at 9.36.54 PM.jpeg"
              />
            </div>
          </div>
        </section>

        {/* Dynamic Bento Grid Services Section */}
        <section className="py-24 px-margin-mobile md:px-margin-desktop bg-white border-t border-slate-100/50" id="servicios">
          <div className="max-w-container-max mx-auto">
            
            <div className="scroll-reveal text-center mb-16 space-y-3">
              <span className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider mb-2">
                <span className="material-symbols-outlined text-[16px]">build</span>
                Servicios Técnicos Especializados
              </span>
              <h2 className="font-headline text-3xl md:text-4xl font-bold text-on-surface">Soluciones Integrales para tu Negocio</h2>
              <p className="text-sm text-on-surface-variant max-w-2xl mx-auto">
                Estructura de bento grid diferenciada por importancia operativa. Haz clic para cotizar directamente en laboratorios.
              </p>
            </div>
            
            {/* Bento Grid with Asymmetric Sizing (Breaking Box Fatigue) */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter items-stretch">
              {servicios.map((service, index) => {
                const visuals = getServiceVisuals(service.nombre, service.icono_url || "devices");
                
                // Asymmetric layout config to make the grid 100% complete and balanced:
                // Index 0 (Hardware), Index 2 (Redes) & Index 5 (Licencias) span 2 columns on desktop
                const isFeatured = index === 0 || index === 2 || index === 5;

                return (
                  <div 
                    key={service.id} 
                    className={`scroll-reveal group bg-slate-50/60 border border-slate-200/60 rounded-3xl overflow-hidden hover:border-primary/50 transition-all duration-500 hover:shadow-xl hover:bg-white flex flex-col justify-between ${
                      isFeatured ? "lg:col-span-2" : "lg:col-span-1"
                    }`}
                    style={{ transitionDelay: `${(index % 3) * 100}ms` }}
                  >
                    {/* Card Top Image Header */}
                    <div className="relative h-48 w-full overflow-hidden bg-slate-100">
                      <img 
                        src={visuals.image} 
                        alt={service.nombre} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-75"></div>
                      
                      {/* Floating Icon Badge */}
                      <div className="w-12 h-12 bg-white text-primary rounded-2xl flex items-center justify-center absolute bottom-4 left-4 shadow-md transition-all group-hover:bg-primary group-hover:text-white">
                        <span className="material-symbols-outlined text-[24px]">
                          {visuals.icon}
                        </span>
                      </div>
                      
                      {/* Floating Flagship Badge */}
                      {isFeatured && (
                        <span className="absolute top-4 right-4 bg-primary text-white text-[9px] font-extrabold uppercase tracking-widest px-2.5 py-1 rounded-full shadow-md">
                          Especialidad Flagship
                        </span>
                      )}
                    </div>

                    {/* Card Bottom Body */}
                    <div className="p-6 md:p-8 flex-1 flex flex-col justify-between">
                      <div>
                        <h3 className="font-headline text-xl font-bold text-on-surface mb-3 group-hover:text-primary transition-colors leading-tight">
                          {service.nombre}
                        </h3>
                        <p className="text-sm text-on-surface-variant mb-6 leading-relaxed max-w-2xl">
                          {service.descripcion}
                        </p>
                      </div>
                      
                      <a 
                        href={`https://wa.me/51925981741?text=Hola%20Dellcom,%20me%20interesa%20el%20servicio%20de%20${encodeURIComponent(service.nombre)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-primary text-xs font-bold uppercase tracking-wider group-hover:gap-4 transition-all pt-2"
                      >
                        Solicitar Asistencia
                        <span className="material-symbols-outlined text-sm">arrow_forward</span>
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Success Stories / Trabajos Realizados Section */}
        <section className="py-24 px-margin-mobile md:px-margin-desktop bg-slate-50/50 border-t border-slate-100" id="portafolio">
          <div className="max-w-container-max mx-auto">
            <div className="scroll-reveal text-center mb-16 space-y-3">
              <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider mb-2">
                <span className="material-symbols-outlined text-[16px]">verified</span>
                Casos de Éxito y Garantía IT
              </div>
              <h2 className="font-headline text-3xl md:text-4xl font-bold text-on-surface">Trabajos Técnicos <span className="text-primary">Realizados</span></h2>
              <p className="text-sm md:text-base text-on-surface-variant max-w-2xl mx-auto leading-relaxed font-semibold">
                Una muestra de nuestra experiencia en el campo: soluciones precisas en microelectrónica, redes estructuradas y soporte de hardware certificado.
              </p>
            </div>

            <div className="scroll-reveal">
              <HomePortfolioBubblePreview trabajos={trabajos} />
            </div>
          </div>
        </section>

        {/* Company About / Context Section */}
        <section className="py-24 px-margin-mobile md:px-margin-desktop bg-white border-t border-b border-slate-100" id="nosotros">
          <div className="max-w-container-max mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="scroll-reveal space-y-6">
              <h2 className="font-headline text-3xl md:text-4xl font-bold text-on-surface">¿Por qué confiar en <span className="text-primary">DELLCOM</span>?</h2>
              <p className="text-sm md:text-base text-on-surface-variant leading-relaxed">
                En DELLCOM SAC somos especialistas en brindar soluciones de infraestructura y soporte tecnológico diseñadas para asegurar la continuidad operativa de tu negocio. Nos enfocamos en diagnósticos de alta precisión a nivel de hardware, estructuración de redes de alto rendimiento, licenciamiento oficial y suministro de consumibles Zebra.
              </p>
              <p className="text-sm md:text-base text-on-surface-variant leading-relaxed">
                Brindamos atención personalizada para empresas, colegios e institutos, con soluciones presenciales y soporte remoto inmediato a nivel nacional, respaldados por personal técnico certificado.
              </p>
              <div className="pt-2">
                <Link 
                  href="/nosotros"
                  className="inline-flex items-center gap-2 border-b-2 border-primary text-primary font-bold text-sm hover:text-primary/80 hover:border-primary/80 transition-all pb-1 uppercase tracking-wider"
                >
                  Conocer más detalles de soporte
                  <span className="material-symbols-outlined text-sm">arrow_forward</span>
                </Link>
              </div>
            </div>
            
            {/* Right stats cards/visual container */}
            <div className="scroll-reveal grid grid-cols-2 gap-4 bg-white p-8 rounded-[2rem] border border-slate-200/60 shadow-sm relative overflow-hidden" style={{ transitionDelay: "150ms" }}>
              <div className="absolute top-0 right-0 w-24 h-24 bg-primary/10 rounded-full blur-2xl"></div>
              
              {/* Card 1: Reparaciones */}
              <div className="group relative p-5 bg-slate-50 rounded-2xl border border-slate-100 hover:border-primary/20 hover:shadow-md transition-all duration-300 overflow-hidden flex flex-col justify-between min-h-[140px]">
                <div 
                  className="absolute inset-0 bg-cover bg-center opacity-[0.25] group-hover:opacity-[0.40] blur-[1px] group-hover:blur-0 group-hover:scale-105 transition-all duration-500 -z-10" 
                  style={{ backgroundImage: `url('/img/servicios/reparacion_laptop.jpg')` }}
                />
                <div className="absolute inset-0 bg-white/75 group-hover:bg-primary/95 transition-all duration-300 -z-10" />
                <div>
                  <span className="material-symbols-outlined text-primary group-hover:text-white text-3xl mb-2 group-hover:scale-110 transition-all duration-300 block">devices</span>
                  <h4 className="font-headline font-bold text-on-surface group-hover:text-white text-sm transition-colors duration-300">Reparaciones</h4>
                  <p className="text-[11px] text-on-surface-variant group-hover:text-white/90 mt-1 leading-snug font-medium transition-colors duration-300">Laptops, impresoras térmicas, láser y matriciales.</p>
                </div>
              </div>

              {/* Card 2: Redes */}
              <div className="group relative p-5 bg-slate-50 rounded-2xl border border-slate-100 hover:border-primary/20 hover:shadow-md transition-all duration-300 overflow-hidden flex flex-col justify-between min-h-[140px]">
                <div 
                  className="absolute inset-0 bg-cover bg-center opacity-[0.25] group-hover:opacity-[0.40] blur-[1px] group-hover:blur-0 group-hover:scale-105 transition-all duration-500 -z-10" 
                  style={{ backgroundImage: `url('/img/servicios/cableado_estructurado.png')` }}
                />
                <div className="absolute inset-0 bg-white/75 group-hover:bg-primary/95 transition-all duration-300 -z-10" />
                <div>
                  <span className="material-symbols-outlined text-primary group-hover:text-white text-3xl mb-2 group-hover:scale-110 transition-all duration-300 block">lan</span>
                  <h4 className="font-headline font-bold text-on-surface group-hover:text-white text-sm transition-colors duration-300">Redes</h4>
                  <p className="text-[11px] text-on-surface-variant group-hover:text-white/90 mt-1 leading-snug font-medium transition-colors duration-300">Cableado estructurado y armado de gabinetes rack.</p>
                </div>
              </div>

              {/* Card 3: Licencias */}
              <div className="group relative p-5 bg-slate-50 rounded-2xl border border-slate-100 hover:border-primary/20 hover:shadow-md transition-all duration-300 overflow-hidden flex flex-col justify-between min-h-[140px]">
                <div 
                  className="absolute inset-0 bg-cover bg-center opacity-[0.25] group-hover:opacity-[0.40] blur-[1px] group-hover:blur-0 group-hover:scale-105 transition-all duration-500 -z-10" 
                  style={{ backgroundImage: `url('/img/servicios/licencias_software.png')` }}
                />
                <div className="absolute inset-0 bg-white/75 group-hover:bg-primary/95 transition-all duration-300 -z-10" />
                <div>
                  <span className="material-symbols-outlined text-primary group-hover:text-white text-3xl mb-2 group-hover:scale-110 transition-all duration-300 block">security</span>
                  <h4 className="font-headline font-bold text-on-surface group-hover:text-white text-sm transition-colors duration-300">Licencias</h4>
                  <p className="text-[11px] text-on-surface-variant group-hover:text-white/90 mt-1 leading-snug font-medium transition-colors duration-300">Windows, Office, Antivirus certificados.</p>
                </div>
              </div>

              {/* Card 4: Ribbons y Zebra */}
              <div className="group relative p-5 bg-slate-50 rounded-2xl border border-slate-100 hover:border-primary/20 hover:shadow-md transition-all duration-300 overflow-hidden flex flex-col justify-between min-h-[140px]">
                <div 
                  className="absolute inset-0 bg-cover bg-center opacity-[0.25] group-hover:opacity-[0.40] blur-[1px] group-hover:blur-0 group-hover:scale-105 transition-all duration-500 -z-10" 
                  style={{ backgroundImage: `url('/img/servicios/impresora_zebra_mantenimiento.png')` }}
                />
                <div className="absolute inset-0 bg-white/75 group-hover:bg-primary/95 transition-all duration-300 -z-10" />
                <div>
                  <span className="material-symbols-outlined text-primary group-hover:text-white text-3xl mb-2 group-hover:scale-110 transition-all duration-300 block">print</span>
                  <h4 className="font-headline font-bold text-on-surface group-hover:text-white text-sm transition-colors duration-300">Ribbons y Zebra</h4>
                  <p className="text-[11px] text-on-surface-variant group-hover:text-white/90 mt-1 leading-snug font-medium transition-colors duration-300">Suministros originales de ribbons, tintas y tarjetas Zebra.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Ubicación / Google Maps Section */}
        <section className="py-24 px-margin-mobile md:px-margin-desktop bg-white border-t border-slate-100">
          <div className="max-w-container-max mx-auto space-y-12">
            <div className="text-center max-w-2xl mx-auto space-y-4">
              <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider">
                <span className="material-symbols-outlined text-[16px]">location_on</span>
                Nuestras Sedes
              </div>
              <h2 className="font-headline text-3xl md:text-4xl font-bold text-on-surface">¿Dónde Encontrarnos?</h2>
              <p className="text-xs md:text-sm text-on-surface-variant leading-relaxed">
                Visítanos en cualquiera de nuestras sucursales para soporte técnico especializado, repuestos de hardware o licencias de software originales.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              {/* Sede Los Olivos */}
              <div className="scroll-reveal bg-slate-50/50 border border-slate-200/80 rounded-[2.5rem] p-8 space-y-6 flex flex-col justify-between shadow-sm hover:shadow-md transition-all">
                <div className="space-y-4">
                  <h3 className="font-headline font-bold text-xl text-slate-800 flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary">store</span>
                    Sede Los Olivos (Sede Principal)
                  </h3>
                  
                  <div className="space-y-3 pt-2">
                    <div className="flex items-start gap-3">
                      <span className="material-symbols-outlined text-primary text-lg mt-0.5">location_on</span>
                      <div className="text-xs">
                        <p className="font-bold text-on-surface">Dirección</p>
                        <p className="text-on-surface-variant mt-0.5">Av. Santa Elvira, Mza. E, Lote 59, Urb. San Elías, Los Olivos, Lima</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="material-symbols-outlined text-primary text-lg mt-0.5">schedule</span>
                      <div className="text-xs">
                        <p className="font-bold text-on-surface">Horario de Atención</p>
                        <p className="text-on-surface-variant mt-0.5">Lunes a Sábado: 9:00 AM - 7:00 PM</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="material-symbols-outlined text-primary text-lg mt-0.5">phone_iphone</span>
                      <div className="text-xs">
                        <p className="font-bold text-on-surface">Contacto</p>
                        <p className="text-on-surface-variant mt-0.5">+51 925 981 741 / +51 922 452 929</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Map Los Olivos */}
                <div className="bg-slate-100 rounded-3xl overflow-hidden border border-slate-200 shadow-sm relative h-[250px] mt-4">
                  <iframe 
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3903.1118432328766!2d-77.0756549242084!3d-11.95772378735626!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9105d04c4b69dcfb%3A0xd3b34bdf88ea4eb6!2sAv.%20Santa%20Elvira%2C%20Los%20Olivos%2015306!5e0!3m2!1ses!2spe!4v1717210000000!5m2!1ses!2spe"
                    className="w-full h-full border-0 absolute inset-0"
                    allowFullScreen={true}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </div>
              </div>

              {/* Sede Santa Anita */}
              <div className="scroll-reveal bg-slate-50/50 border border-slate-200/80 rounded-[2.5rem] p-8 space-y-6 flex flex-col justify-between shadow-sm hover:shadow-md transition-all" style={{ transitionDelay: "100ms" }}>
                <div className="space-y-4">
                  <h3 className="font-headline font-bold text-xl text-slate-800 flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary">store</span>
                    Sede Santa Anita
                  </h3>
                  
                  <div className="space-y-3 pt-2">
                    <div className="flex items-start gap-3">
                      <span className="material-symbols-outlined text-primary text-lg mt-0.5">location_on</span>
                      <div className="text-xs">
                        <p className="font-bold text-on-surface">Dirección</p>
                        <p className="text-on-surface-variant mt-0.5">Av. Los Nogales 510 - Santa Anita, Lima</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="material-symbols-outlined text-primary text-lg mt-0.5">schedule</span>
                      <div className="text-xs">
                        <p className="font-bold text-on-surface">Horario de Atención</p>
                        <p className="text-on-surface-variant mt-0.5">Lunes a Viernes: 9:00 AM - 8:00 PM | Sábado: 9:00 AM - 6:00 PM</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="material-symbols-outlined text-primary text-lg mt-0.5">phone_iphone</span>
                      <div className="text-xs">
                        <p className="font-bold text-on-surface">Contacto</p>
                        <p className="text-on-surface-variant mt-0.5">+51 925 981 741 / +51 922 452 929</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Map Santa Anita */}
                <div className="bg-slate-100 rounded-3xl overflow-hidden border border-slate-200 shadow-sm relative h-[250px] mt-4">
                  <iframe 
                    src="https://maps.google.com/maps?q=Av.+Los+Nogales+510%2C+Santa+Anita%2C+Lima&t=&z=16&ie=UTF8&iwloc=&output=embed"
                    className="w-full h-full border-0 absolute inset-0"
                    allowFullScreen={true}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Reusable Clean Footer */}
      <CleanFooter />

      <ScrollRevealObserver />
    </>
  );
}
