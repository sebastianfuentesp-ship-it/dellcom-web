import { prisma } from "@/lib/prisma";
import Image from "next/image";
import ScrollRevealObserver from "./components/ScrollRevealObserver";

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
    image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=600&q=80",
    icon: "dns"
  },
  "soporte": {
    image: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&w=600&q=80",
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


// Inline Custom SVG Logo based on the Dellcom brand (Brain + Circuits with Glowing Ring)
function DellcomLogo({ className = "w-10 h-10" }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={className} xmlns="http://www.w3.org/2000/svg">
      {/* Outer glowing red ring */}
      <circle cx="50" cy="50" r="46" stroke="#dc2626" strokeWidth="3" fill="none" opacity="0.85" />
      {/* Dark background circle */}
      <circle cx="50" cy="50" r="43" fill="#000000" />
      
      {/* Left side: Stylized Brain in White */}
      <path 
        d="M 48 20 
           C 40 20, 36 24, 36 28 
           C 30 28, 27 33, 29 39 
           C 24 41, 23 48, 26 53 
           C 21 57, 21 64, 25 68 
           C 23 74, 28 80, 35 80 
           C 38 80, 42 78, 44 76
           C 46 78, 48 80, 48 80 Z" 
        stroke="#ffffff" 
        strokeWidth="3.5" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        fill="none" 
      />
      <path 
        d="M 48 32 C 40 32, 38 38, 44 42 C 34 46, 38 56, 44 56 C 36 60, 40 70, 48 70" 
        stroke="#ffffff" 
        strokeWidth="2.5" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        fill="none" 
      />
      
      {/* Center line separator */}
      <line x1="50" y1="18" x2="50" y2="82" stroke="#dc2626" strokeWidth="2.5" strokeDasharray="3 3" />
      
      {/* Right side: Circuit Traces in Crimson Red */}
      <path 
        d="M 52 24 L 66 24 L 66 32 M 52 38 L 74 38 L 74 46 M 52 50 L 64 50 L 72 58 M 52 64 L 72 64 M 52 74 L 64 74 L 64 68" 
        stroke="#dc2626" 
        strokeWidth="3.5" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        fill="none" 
      />
      
      {/* Circuit Nodes (small circles) */}
      <circle cx="66" cy="32" r="3" fill="#dc2626" />
      <circle cx="74" cy="46" r="3" fill="#dc2626" />
      <circle cx="72" cy="58" r="3" fill="#dc2626" />
      <circle cx="72" cy="64" r="3" fill="#dc2626" />
      <circle cx="64" cy="68" r="3" fill="#dc2626" />
    </svg>
  );
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

export default async function Home() {
  const servicios = await getServices();

  return (
    <>
      {/* Header / Top Navigation Bar */}
      <header className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-outline-variant/30 shadow-sm transition-all duration-300" id="main-header">
        <div className="flex justify-between items-center h-16 px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto">
          {/* Logo Brand */}
          <div className="flex items-center gap-3">
            <DellcomLogo className="w-10 h-10 transition-transform hover:scale-105" />
            <div className="flex flex-col">
              <span className="font-headline font-bold text-lg text-on-surface leading-none tracking-tight">DELLCOM SAC</span>
              <span className="text-[10px] text-primary font-bold tracking-widest uppercase">Tu centro de confianza</span>
            </div>
          </div>
          
          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex gap-8 items-center">
            <a className="text-primary font-bold border-b-2 border-primary pb-0.5 text-sm font-semibold" href="#">Inicio</a>
            <a className="text-on-surface-variant hover:text-primary transition-colors text-sm font-semibold" href="/productos">Catálogo</a>
            <a className="text-on-surface-variant hover:text-primary transition-colors text-sm font-semibold" href="/descargas">Descargas</a>
            <a className="text-on-surface-variant hover:text-primary transition-colors text-sm font-semibold" href="#servicios">Servicios</a>
            <a className="text-on-surface-variant hover:text-primary transition-colors text-sm font-semibold" href="#nosotros">Nosotros</a>
            <a className="text-on-surface-variant hover:text-primary transition-colors text-sm font-semibold" href="#contacto">Contacto</a>
            
            {/* AnyDesk Support CTA Link */}
            <a 
              href="https://anydesk.com/download"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-primary hover:bg-primary/95 text-on-primary px-6 py-2.5 rounded-full text-xs font-bold tracking-wider transition-all active:scale-95 shadow-md shadow-primary/20 uppercase"
            >
              Soporte AnyDesk
            </a>
          </nav>
          
          {/* Mobile Menu Icon */}
          <button className="md:hidden text-on-surface hover:text-primary transition-colors">
            <span className="material-symbols-outlined text-3xl">menu</span>
          </button>
        </div>
      </header>

      <main className="pt-16">
        {/* Hero Section */}
        <section className="relative min-h-[85vh] flex items-center overflow-hidden hero-gradient px-margin-mobile md:px-margin-desktop bg-slate-50/30">
          <div className="max-w-container-max mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center w-full py-12">
            
            {/* Left Content */}
            <div className="z-10 space-y-6 animate-fade-in-up">
              <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider">
                <span className="material-symbols-outlined text-[16px] fill-1">verified</span>
                10 Años de Experiencia • Los Olivos, Lima
              </div>
              <h1 className="font-headline text-4xl md:text-6xl font-extrabold text-on-surface leading-tight tracking-tight">
                DELLCOM <span className="text-primary">SAC</span>
              </h1>
              <h2 className="text-2xl font-bold text-primary italic leading-none">Tu centro de confianza</h2>
              <p className="text-base md:text-lg text-on-surface-variant max-w-lg leading-relaxed">
                Brindamos soluciones integrales de infraestructura IT, microelectrónica de precisión, armado de equipos de redes y soporte remoto corporativo. Llevamos más de una década transformando desafíos técnicos en operatividad garantizada para empresas, colegios e institutos.
              </p>
              
              {/* Call to Actions */}
              <div className="flex flex-wrap gap-4 pt-2 justify-center lg:justify-start">
                <a 
                  href="https://wa.me/51987654321?text=Hola%20Dellcom%20SAC,%20deseo%20solicitar%20una%20cotizaci%C3%B3n%20para%20un%20servicio%20tecnol%C3%B3gico."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 bg-primary hover:bg-primary/95 text-on-primary px-6 py-3.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all active:scale-95 shadow-lg shadow-primary/30"
                >
                  <span className="material-symbols-outlined text-[18px]">chat_bubble</span>
                  Cotizar por WhatsApp
                </a>
                <a 
                  href="/productos"
                  className="flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-950 text-white px-6 py-3.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all active:scale-95 shadow-md shadow-slate-900/10"
                >
                  <span className="material-symbols-outlined text-[18px]">grid_view</span>
                  Ver Catálogo
                </a>
                <a 
                  href="https://anydesk.com/download"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 bg-white border border-outline-variant hover:border-primary hover:text-primary text-on-surface px-6 py-3.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all active:scale-95 shadow-sm"
                >
                  <span className="material-symbols-outlined text-[18px]">desktop_windows</span>
                  Soporte AnyDesk
                </a>
              </div>
            </div>
            
            {/* Right Media (3D laptop image render) */}
            <div className="relative flex justify-center items-center">
              <div className="absolute inset-0 bg-primary/5 rounded-full blur-[100px] scale-75"></div>
              <img 
                alt="Dellcom IT Laptop Support Render" 
                className="relative z-10 w-full max-w-[520px] h-auto object-contain drop-shadow-2xl animate-float" 
                src="https://lh3.googleusercontent.com/aida/AP1WRLvOxnBVLTH_yPvHr7sc1YkcjRdZbkyd2YXiI96CiM1GM_ru_MUsoZFYlDgXnlGvZ3cK9M9J93Wj1RT_EclWAn2BFwIVKHbRB2cHrcvNbSTgW2N5cHKSLdj6XejzrabfF0Hyl73TucNRFGTDrkrajdftVCG0z68E16ak9gZ_AMRH5kqmhqAjeJee68ew6yX61uj26tQVgNNy_BGucLmyEgOpHuRGEYAlOr_301McRtpCQJM3myOmRELDzro"
              />
            </div>
          </div>
        </section>

        {/* Stats Summary Section */}
        <section className="bg-surface-container-low py-12 px-margin-mobile md:px-margin-desktop">
          <div className="max-w-container-max mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="scroll-reveal flex flex-col items-center text-center p-6 bg-white rounded-2xl border border-outline-variant/10 shadow-sm transition-transform hover:-translate-y-1" style={{ transitionDelay: "100ms" }}>
              <span className="text-4xl font-bold text-primary mb-1">10+ Años</span>
              <span className="text-xs font-semibold text-on-surface-variant uppercase tracking-widest">De trayectoria en Lima Norte</span>
            </div>
            <div className="scroll-reveal flex flex-col items-center text-center p-6 bg-white rounded-2xl border border-outline-variant/10 shadow-sm transition-transform hover:-translate-y-1" style={{ transitionDelay: "200ms" }}>
              <span className="text-4xl font-bold text-primary mb-1">15k+</span>
              <span className="text-xs font-semibold text-on-surface-variant uppercase tracking-widest">Soportes & Reparaciones Exitosas</span>
            </div>
            <div className="scroll-reveal flex flex-col items-center text-center p-6 bg-white rounded-2xl border border-outline-variant/10 shadow-sm transition-transform hover:-translate-y-1" style={{ transitionDelay: "300ms" }}>
              <span className="text-4xl font-bold text-primary mb-1">100% Original</span>
              <span className="text-xs font-semibold text-on-surface-variant uppercase tracking-widest">Licencias y Repuestos Certificados</span>
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section className="py-20 px-margin-mobile md:px-margin-desktop bg-white" id="servicios">
          <div className="max-w-container-max mx-auto">
            <div className="scroll-reveal text-center mb-16 space-y-3">
              <h2 className="font-headline text-3xl md:text-4xl font-bold text-on-surface">Servicios Técnicos de Alto Nivel</h2>
              <p className="text-sm md:text-base text-on-surface-variant max-w-2xl mx-auto">
                Soluciones IT desarrolladas por expertos certificados en microelectrónica, ensamblaje de servidores e infraestructura corporativa.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter">
              {servicios.map((service, index) => {
                const visuals = getServiceVisuals(service.nombre, service.icono_url || "devices");
                return (
                  <div 
                    key={service.id} 
                    className="scroll-reveal service-card group bg-surface-container-lowest rounded-2xl border border-outline-variant/30 transition-all duration-300 hover:border-primary/20 overflow-hidden flex flex-col justify-between"
                    style={{ transitionDelay: `${(index % 3) * 150}ms` }}
                  >
                    <div className="relative h-48 w-full overflow-hidden bg-slate-100">
                      <img 
                        src={visuals.image} 
                        alt={service.nombre} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-75"></div>
                      <div className="w-12 h-12 bg-primary text-white rounded-xl flex items-center justify-center absolute bottom-4 left-4 shadow-lg transition-transform group-hover:scale-110">
                        <span className="material-symbols-outlined text-white text-2xl">
                          {visuals.icon}
                        </span>
                      </div>
                    </div>
                    
                    <div className="p-6 flex-1 flex flex-col justify-between">
                      <div>
                        <h3 className="font-headline text-lg font-bold text-on-surface mb-2.5 group-hover:text-primary transition-colors leading-tight">{service.nombre}</h3>
                        <p className="text-xs text-on-surface-variant leading-relaxed">{service.descripcion}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Company About / Context Section */}
        <section className="py-20 px-margin-mobile md:px-margin-desktop bg-slate-50/50 border-t border-b border-outline-variant/10" id="nosotros">
          <div className="max-w-container-max mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="scroll-reveal space-y-6">
              <h2 className="font-headline text-3xl md:text-4xl font-bold text-on-surface">De los USBs y Excels al Control Total</h2>
              <p className="text-base text-on-surface-variant leading-relaxed">
                En Dellcom entendemos que el desorden administrativo ralentiza la eficiencia. Por eso, hemos diseñado esta plataforma interna para erradicar las licencias duplicadas, garantizar el acceso instantáneo de nuestros técnicos a las herramientas necesarias y exhibir un portafolio fotográfico de nuestros trabajos terminados.
              </p>
              <p className="text-base text-on-surface-variant leading-relaxed">
                Atendemos de manera personalizada a clientes finales, pymes, colegios e institutos educativos con soporte a domicilio en Los Olivos y de forma remota a nivel nacional.
              </p>
              <div className="pt-2">
                <a 
                  href="https://wa.me/51987654321?text=Hola%20Dellcom,%20deseo%20más%20información%20sobre%20sus%20servicios."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 border-b-2 border-primary text-primary font-bold text-sm hover:text-primary/80 hover:border-primary/80 transition-all pb-1"
                >
                  Conocer más detalles de soporte
                  <span className="material-symbols-outlined text-sm">arrow_forward</span>
                </a>
              </div>
            </div>
            
            {/* Right stats cards/visual container */}
            <div className="scroll-reveal grid grid-cols-2 gap-4 bg-white p-8 rounded-3xl border border-outline-variant/20 shadow-sm relative overflow-hidden" style={{ transitionDelay: "150ms" }}>
              <div className="absolute top-0 right-0 w-24 h-24 bg-primary/10 rounded-full blur-2xl"></div>
              <div className="p-5 bg-slate-50 rounded-2xl">
                <span className="material-symbols-outlined text-primary text-3xl mb-2">devices</span>
                <h4 className="font-headline font-bold text-on-surface">Reparaciones</h4>
                <p className="text-xs text-on-surface-variant mt-1">Laptops, impresoras térmicas, láser y matriciales.</p>
              </div>
              <div className="p-5 bg-slate-50 rounded-2xl">
                <span className="material-symbols-outlined text-primary text-3xl mb-2">lan</span>
                <h4 className="font-headline font-bold text-on-surface">Redes</h4>
                <p className="text-xs text-on-surface-variant mt-1">Cableado estructurado y armado de gabinetes rack.</p>
              </div>
              <div className="p-5 bg-slate-50 rounded-2xl">
                <span className="material-symbols-outlined text-primary text-3xl mb-2">security</span>
                <h4 className="font-headline font-bold text-on-surface">Licencias</h4>
                <p className="text-xs text-on-surface-variant mt-1">Windows, Office, Antivirus certificados.</p>
              </div>
              <div className="p-5 bg-slate-50 rounded-2xl">
                <span className="material-symbols-outlined text-primary text-3xl mb-2">print</span>
                <h4 className="font-headline font-bold text-on-surface">Ribbons y Zebra</h4>
                <p className="text-xs text-on-surface-variant mt-1">Suministros originales de ribbons, tintas y tarjetas Zebra.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Ubicación / Google Maps Section */}
        <section className="py-20 px-margin-mobile md:px-margin-desktop bg-white border-b border-outline-variant/10">
          <div className="max-w-container-max mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Map Info Card */}
            <div className="scroll-reveal lg:col-span-4 space-y-6">
              <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider">
                <span className="material-symbols-outlined text-[16px]">location_on</span>
                ¿Dónde encontrarnos?
              </div>
              <h2 className="font-headline text-3xl font-bold text-on-surface">Visítanos en Los Olivos</h2>
              <p className="text-sm text-on-surface-variant leading-relaxed">
                Estamos ubicados en una zona accesible de Lima Norte. Ven a nuestra sucursal para reparaciones inmediatas de laptops, impresoras, microelectrónica o para cotizar suministros Zebra y licencias corporativas.
              </p>
              
              <div className="space-y-4 pt-2">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-slate-100 rounded-lg text-primary">
                    <span className="material-symbols-outlined">map</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-on-surface">Dirección</h4>
                    <p className="text-xs text-on-surface-variant mt-0.5">Av. Santa Elvira, Mza. E, Lote 59, Urb. San Elías, Los Olivos, Lima</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 bg-slate-100 rounded-lg text-primary">
                    <span className="material-symbols-outlined">schedule</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-on-surface">Horario de Atención</h4>
                    <p className="text-xs text-on-surface-variant mt-0.5">Lunes a Sábado: 9:00 AM - 7:00 PM</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 bg-slate-100 rounded-lg text-primary">
                    <span className="material-symbols-outlined">phone_iphone</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-on-surface">Teléfono de Soporte</h4>
                    <p className="text-xs text-on-surface-variant mt-0.5">+51 987 654 321</p>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <a 
                  href="https://maps.google.com/?q=Av.+Santa+Elvira,+Mza.+E,+Lote+59,+Urb.+San+El%C3%ADas,+Los+Olivos,+Lima"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary/95 text-white px-6 py-3 rounded-xl text-xs font-bold transition-all active:scale-95 shadow-md shadow-primary/20"
                >
                  <span className="material-symbols-outlined text-[16px]">directions</span>
                  Cómo llegar con Google Maps
                </a>
              </div>
            </div>

            {/* Google Maps Iframe */}
            <div className="scroll-reveal lg:col-span-8 w-full h-[400px] bg-slate-100 rounded-3xl overflow-hidden border border-outline-variant/30 shadow-md relative group" style={{ transitionDelay: "150ms" }}>
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3903.1118432328766!2d-77.0756549242084!3d-11.95772378735626!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9105d04c4b69dcfb%3A0xd3b34bdf88ea4eb6!2sAv.%20Santa%20Elvira%2C%20Los%20Olivos%2015306!5e0!3m2!1ses!2spe!4v1717210000000!5m2!1ses!2spe" 
                width="100%" 
                height="100%" 
                style={{ border: 0 }} 
                allowFullScreen={true}
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
                className="w-full h-full grayscale-[20%] group-hover:grayscale-0 transition-all duration-500"
              ></iframe>
            </div>
          </div>
        </section>

        {/* 
          Redesigned CTA Section (Light Theme with Crimson glowing accents for Year 2026) 
          Fixes the dark contrast mismatch and fits the clean branding theme.
        */}
        <section className="scroll-reveal py-24 px-margin-mobile md:px-margin-desktop relative" id="contacto">
          {/* Subtle decorative glowing background circle (Year 2026 design trend) */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-primary/5 rounded-full blur-[140px] pointer-events-none"></div>

          <div className="max-w-container-max mx-auto bg-gradient-to-br from-white via-surface-container-low/40 to-slate-50/50 rounded-[2.5rem] p-12 md:p-20 relative overflow-hidden flex flex-col items-center text-center border border-outline-variant/30 shadow-xl shadow-slate-100">
            {/* Tech Dotted Grid SVG Overlay for modern 2026 IT look */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '16px 16px' }}></div>
            
            <div className="relative z-10 inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider mb-6">
              <span className="material-symbols-outlined text-[16px]">support_agent</span>
              ¿Listo para dar el siguiente paso?
            </div>
            
            <h2 className="relative z-10 font-headline text-3xl md:text-5xl font-extrabold text-on-surface mb-6 max-w-2xl leading-tight">
              ¿Necesitas una solución técnica de alto nivel?
            </h2>
            
            <p className="relative z-10 text-on-surface-variant max-w-lg mb-10 leading-relaxed text-sm md:text-base">
              Consulta nuestro catálogo, solicita soporte AnyDesk o cotiza repuestos sin compromiso. Obtén atención técnica inmediata a través de WhatsApp.
            </p>
            
            <div className="relative z-10 flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <a 
                href="https://wa.me/51987654321?text=Hola%20Dellcom%20SAC,%20deseo%20solicitar%20una%20cotizaci%C3%B3n%20para%20repuestos/servicios."
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 bg-primary hover:bg-primary/95 text-on-primary px-10 py-4.5 rounded-full text-sm font-bold tracking-wider transition-all active:scale-95 shadow-lg shadow-primary/20"
              >
                <span className="material-symbols-outlined">chat_bubble</span>
                Solicitar Cotización Gratis
              </a>
              <a 
                href="https://wa.me/51987654321?text=Hola%20Dellcom%20SAC,%20necesito%20asistencia%20de%20un%20técnico%20TI."
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 bg-white hover:bg-slate-50 text-primary border border-primary/30 hover:border-primary px-10 py-4.5 rounded-full text-sm font-bold tracking-wider transition-all active:scale-95"
              >
                Hablar con un Experto
              </a>
            </div>
          </div>
        </section>
      </main>

      {/* Footer Section */}
      <footer className="bg-surface-container-lowest py-16 border-t border-outline-variant/20">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-gutter px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto">
          
          {/* Brand Info */}
          <div className="col-span-1 md:col-span-1 space-y-4">
            <div className="flex items-center gap-3">
              <DellcomLogo className="w-8 h-8" />
              <span className="font-headline font-bold text-lg text-on-surface tracking-tight">DELLCOM SAC</span>
            </div>
            <p className="text-sm text-on-surface-variant leading-relaxed">
              Ingeniería IT y microelectrónica de vanguardia en Lima Norte. Garantizando operatividad con precisión técnica.
            </p>
            <div className="flex gap-4">
              <a 
                href="https://wa.me/51987654321" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-10 h-10 rounded-full border border-outline-variant/30 flex items-center justify-center text-on-surface-variant hover:text-primary hover:border-primary transition-all"
              >
                <span className="material-symbols-outlined text-[20px]">smartphone</span>
              </a>
              <a 
                href="https://www.dellcom.pe" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-10 h-10 rounded-full border border-outline-variant/30 flex items-center justify-center text-on-surface-variant hover:text-primary hover:border-primary transition-all"
              >
                <span className="material-symbols-outlined text-[20px]">public</span>
              </a>
            </div>
          </div>
          
          {/* Services Column */}
          <div>
            <h4 className="font-headline font-bold text-xs text-on-surface uppercase tracking-wider mb-6">Servicios</h4>
            <ul className="space-y-4">
              <li><a className="text-sm text-on-surface-variant hover:text-primary transition-transform hover:translate-x-1 inline-block" href="#servicios">Reparación de Hardware</a></li>
              <li><a className="text-sm text-on-surface-variant hover:text-primary transition-transform hover:translate-x-1 inline-block" href="#servicios">Soporte Corporativo</a></li>
              <li><a className="text-sm text-on-surface-variant hover:text-primary transition-transform hover:translate-x-1 inline-block" href="#servicios">Microelectrónica</a></li>
              <li><a className="text-sm text-on-surface-variant hover:text-primary transition-transform hover:translate-x-1 inline-block" href="#servicios">Licencias Originales</a></li>
            </ul>
          </div>
          
          {/* Company Info Column */}
          <div>
            <h4 className="font-headline font-bold text-xs text-on-surface uppercase tracking-wider mb-6">Compañía</h4>
            <ul className="space-y-4">
              <li><a className="text-sm text-on-surface-variant hover:text-primary transition-transform hover:translate-x-1 inline-block" href="#nosotros">Sobre Nosotros</a></li>
              <li><a className="text-sm text-on-surface-variant hover:text-primary transition-transform hover:translate-x-1 inline-block" href="#servicios">Casos de Éxito</a></li>
              <li><a className="text-sm text-on-surface-variant hover:text-primary transition-transform hover:translate-x-1 inline-block" href="/productos">Nuestro Catálogo</a></li>
              <li><a className="text-sm text-on-surface-variant hover:text-primary transition-transform hover:translate-x-1 inline-block" href="/descargas">Descargas y Drivers</a></li>
              <li><a className="text-sm text-on-surface-variant hover:text-primary transition-transform hover:translate-x-1 inline-block" href="/admin/login">Portal Interno</a></li>
            </ul>
          </div>
          
          {/* Contact Info Column */}
          <div className="space-y-4">
            <h4 className="font-headline font-bold text-xs text-on-surface uppercase tracking-wider mb-6">Contacto</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <span className="material-symbols-outlined text-primary text-[20px]">location_on</span>
                <span className="text-sm text-on-surface-variant">Av. Santa Elvira, Mza. E, Lote 59, Urb. San Elías, Los Olivos, Lima.</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="material-symbols-outlined text-primary text-[20px]">call</span>
                <span className="text-sm text-on-surface-variant">+51 987 654 321</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="material-symbols-outlined text-primary text-[20px]">mail</span>
                <span className="text-sm text-on-surface-variant">soporte@dellcom.pe</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-16 pt-8 border-t border-outline-variant/20 px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-on-surface-variant">
            © 2026 DELLCOM SAC. Precision IT Engineering. Todos los derechos reservados.
          </p>
          <div className="flex gap-6">
            <a className="text-xs text-on-surface-variant hover:text-primary" href="#">Términos</a>
            <a className="text-xs text-on-surface-variant hover:text-primary" href="#">Privacidad</a>
            <a className="text-xs text-on-surface-variant hover:text-primary" href="/admin/login">Panel Técnico</a>
          </div>
        </div>
      </footer>

      <ScrollRevealObserver />
    </>
  );
}
