/**
 * Página de servicios: /servicios
 * Server Component que obtiene los servicios activos de la base de datos
 * y los muestra en tarjetas con imagen, icono y especificaciones técnicas.
 * Si la DB no responde, usa datos de fallback estáticos (FALLBACK_SERVICES).
 * Enriquece cada servicio con visuals (imagen + specs) desde serviceVisuals.
 */
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import StatusHeader from "../components/StatusHeader";
import CleanFooter from "../components/CleanFooter";
import ScrollRevealObserver from "../components/ScrollRevealObserver";
import PortfolioGallery from "../components/PortfolioGallery";

export const metadata = {
  title: "Servicios — DELLCOM SAC | Soporte de TI y Hardware en Lima Norte",
  description: "Reparación avanzada de laptops, microelectrónica a nivel componente, licenciamiento y consumibles Zebra en Los Olivos, Lima.",
};

interface ServiceVisual {
  image: string;
  icon: string;
  specs: string[];
}

const serviceVisuals: Record<string, ServiceVisual> = {
  "reparación": { 
    image: "/img/servicios/reparacion_laptop.png", 
    icon: "laptop_mac",
    specs: ["Reemplazo de pantallas, teclados y carcasas", "Limpieza profunda y cambio de pasta térmica", "Reparación electrónica en placa madre", "Actualización de hardware (Discos SSD y RAM)"]
  },
  "microelectrónica": { 
    image: "/img/servicios/microelectronica.jpg", 
    icon: "memory",
    specs: ["Diagnóstico electrónico avanzado por osciloscopio", "Reballing de microprocesadores y GPUs", "Recuperación de placas mojadas o en cortocircuito", "Reemplazo de integrados y puertos de carga"]
  },
  "soporte": {
    image: "https://portalinnova.cl/wp-content/uploads/2021/06/Soporte-remoto-de-alta-confiabilidad-Plataforma-resuelve-problemas-tecnicos-en-segundos-y-con-la-maxima-seguridad-que-existe-en-el-mercado-scaled.jpg", 
    icon: "support_agent",
    specs: ["Soporte técnico remoto rápido (AnyDesk/RustDesk)", "Configuración de correos corporativos Workspace/365", "Eliminación activa de virus y optimización de sistema", "Mantenimiento preventivo periódico para oficinas"]
  },
  "corporativo": { 
    image: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&w=800&q=80", 
    icon: "support_agent",
    specs: ["Soporte técnico remoto rápido (AnyDesk/RustDesk)", "Configuración de correos corporativos Workspace/365", "Eliminación activa de virus y optimización de sistema", "Mantenimiento preventivo periódico para oficinas"]
  },
  "licencia": { 
    image: "/img/servicios/licencias_software.png", 
    icon: "verified_user",
    specs: ["Venta de claves de activación originales Windows Retail/OEM", "Licencias permanentes Office 2021 Hogar y Empresa", "Suscripciones antivirus ESET, Kaspersky y Defender", "Auditoría legal y saneamiento de licenciamiento corporativo"]
  },
  "software": { 
    image: "/img/servicios/licencias_software.png", 
    icon: "verified_user",
    specs: ["Venta de claves de activación originales Windows Retail/OEM", "Licencias permanentes Office 2021 Hogar y Empresa", "Suscripciones antivirus ESET, Kaspersky y Defender", "Auditoría legal y saneamiento de licenciamiento corporativo"]
  },
  "ciberseguridad": {
    image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=800&q=80",
    icon: "security",
    specs: ["Auditoría de puertos y vulnerabilidades en red", "Instalación de cortafuegos dedicados (pfSense/Fortinet)", "Políticas de copias de seguridad híbridas e inmutables", "Configuración de accesos VPN seguros para trabajo remoto"]
  },
  "seguridad": {
    image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=800&q=80",
    icon: "security",
    specs: ["Auditoría de puertos y vulnerabilidades en red", "Instalación de cortafuegos dedicados (pfSense/Fortinet)", "Políticas de copias de seguridad híbridas e inmutables", "Configuración de accesos VPN seguros para trabajo remoto"]
  },
  "consultoría": {
    image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=800&q=80",
    icon: "psychology",
    specs: ["Inventariado técnico inicial de parque informático", "Planificación de migraciones de servidores y hosting", "Diseño de topologías de red de alta disponibilidad", "Optimización de inversiones en licencias y hardware"]
  },
  "it": {
    image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=800&q=80",
    icon: "psychology",
    specs: ["Inventariado técnico inicial de parque informático", "Planificación de migraciones de servidores y hosting", "Diseño de topologías de red de alta disponibilidad", "Optimización de inversiones en licencias y hardware"]
  },
  "repuesto": {
    image: "https://s.alicdn.com/@sc04/kf/Hc979084a7689417abcbb22e7beb812cc4/Wholesale-Laptop-Spare-Parts-All-Models-Computer-Accessories-LCD-Screen-Keyboard-Adapter-Computer-Repair-Parts-Replacement.jpg",
    icon: "storefront",
    specs: ["Pantallas LCD/LED originales y compatibles multimarca", "Teclados, baterías y cargadores certificados", "Placas madre, módulos RAM y discos SSD de reemplazo", "Carcasas, bisagras y repuestos de estructura"]
  }
};

const fallbackVisual: ServiceVisual = {
  image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=80",
  icon: "settings",
  specs: ["Soporte especializado integral", "Garantía de operatividad", "Atención a domicilio en Los Olivos", "Soporte remoto a nivel nacional"]
};

function getServiceVisuals(nombre: string, defaultIcon: string): ServiceVisual {
  const cleanName = nombre.toLowerCase();
  for (const [key, val] of Object.entries(serviceVisuals)) {
    if (cleanName.includes(key)) return val;
  }
  return {
    ...fallbackVisual,
    icon: defaultIcon
  };
}

// Function to fetch services with static fallback if DB connection fails
async function getServices() {
  try {
    const dbServices = await prisma.servicio.findMany({
      where: { activo: true },
      orderBy: { id: "asc" },
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
      nombre: "Reparación de Hardware",
      descripcion: "Diagnóstico avanzado y reparación de nivel componente para laptops, PCs de alto rendimiento y servidores corporativos.",
      icono_url: "computer",
    },
    {
      id: 3,
      nombre: "Soporte Corporativo",
      descripcion: "Mantenimiento preventivo y correctivo con planes de respuesta inmediata para asegurar la productividad de su equipo.",
      icono_url: "business",
    },
    {
      id: 4,
      nombre: "Licenciamiento de Software",
      descripcion: "Gestión y venta de licencias oficiales (Microsoft, Adobe, Autodesk) garantizando cumplimiento legal y seguridad.",
      icono_url: "verified_user",
    },
    {
      id: 5,
      nombre: "Ciberseguridad",
      descripcion: "Protección activa contra amenazas digitales, firewalls avanzados y recuperación de datos críticos ante incidentes.",
      icono_url: "security",
    },
    {
      id: 6,
      nombre: "Consultoría IT",
      descripcion: "Planeación estratégica para el crecimiento tecnológico, optimización de presupuestos y arquitectura de soluciones.",
      icono_url: "psychology",
    },
    {
      id: 7,
      nombre: "Venta de Repuestos de Laptops",
      descripcion: "Distribución de repuestos originales y compatibles para laptops multimarca: pantallas, teclados, baterías, cargadores, placas y carcasas.",
      icono_url: "storefront",
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
    console.warn("Prisma DB connection failed for trabajos. Using static fallback.");
  }

  return [
    {
      id: 1,
      titulo: "Mantenimiento Térmico y Reparación de Laptops",
      descripcion: "Mantenimiento térmico preventivo y correctivo para laptops gaming y corporativas de alta gama. Extracción de acumulación de polvo extremo en turbinas, cambio de almohadillas térmicas (pads) secas, aplicación de pasta térmica de alta conductividad para reducir temperaturas de CPU y GPU, reemplazo de pantallas LED/IPS rotas, y repotenciación con discos SSD M.2 NVMe.",
      imagen_url: "/img/portafolio/WhatsApp Image 2026-06-14 at 9.36.56 PM (1).jpeg",
      fecha: new Date("2026-06-15T12:00:00Z"),
      servicio: { nombre: "Reparación de Laptops e Impresoras" }
    },
    {
      id: 2,
      titulo: "Soporte y Reparación de Impresoras Epson y Zebra",
      descripcion: "Diagnóstico y solución de encendido en impresoras Epson EcoTank CK57 MAIN mediante soldadura de transistores y fusible F1 quemados. Reparación de atascos continuos mediante cambio de engranajes de tracción y calibración de sensores ópticos. Configuración y purgado de sistemas continuos HP Smart Tank e integración inalámbrica en red local.",
      imagen_url: "/img/portafolio/WhatsApp Image 2026-06-14 at 9.41.12 PM (2).jpeg",
      fecha: new Date("2026-06-15T11:00:00Z"),
      servicio: { nombre: "Reparación de Laptops e Impresoras" }
    },
  ];
}

export default async function ServiciosPage() {
  const servicios = await getServices();
  const trabajos = await getTrabajos();

  return (
    <div className="selection:bg-primary/20 selection:text-primary min-h-screen bg-white">
      {/* Reusable Status Header */}
      <StatusHeader />

      <main className="pt-16">
        {/* Asymmetric Header Banner (Space-saving style replacing full-height Hero) */}
        <section className="relative py-16 bg-slate-50/50 overflow-hidden border-b border-slate-100">
          <div className="absolute inset-0 opacity-[0.02] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '16px 16px' }} />
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] pointer-events-none" />

          
          <div className="relative px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto w-full text-center z-10 scroll-reveal">
            <span className="inline-block py-1 px-3.5 mb-4 bg-primary/10 border border-primary/15 text-primary font-bold text-[10px] rounded-full uppercase tracking-widest">
              Nuestras Soluciones IT
            </span>
            <h1 className="font-headline text-3xl md:text-5xl font-black text-on-surface leading-tight tracking-tight">
              Nuestros <span className="text-primary">Servicios</span>
            </h1>
            <p className="text-xs md:text-sm font-semibold text-on-surface-variant max-w-xl mx-auto mt-2 leading-relaxed">
              Diagnósticos rigurosos y microelectrónica de precisión. Haz clic para cotizar o revisar casos de éxito.
            </p>
          </div>
        </section>

        {/* Alternating Row Services Section */}
        <section className="py-24 bg-white" id="servicios-grid">
          <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop space-y-24 md:space-y-36">
            {servicios.map((service, index) => {
              const visuals = getServiceVisuals(service.nombre, service.icono_url || "settings");
              const isEven = index % 2 === 0;

              return (
                <div 
                  key={service.id} 
                  className={`scroll-reveal flex flex-col ${isEven ? "lg:flex-row" : "lg:flex-row-reverse"} gap-12 lg:gap-20 items-center w-full`}
                  style={{ transitionDelay: `${(index % 2) * 100}ms` }}
                >
                  {/* Image Card (cuadro) */}
                  <div className="w-full lg:w-1/2 group">
                    <div className="relative aspect-[4/3] rounded-[2rem] overflow-hidden border border-slate-200 shadow-md bg-slate-50">
                      <img 
                        src={visuals.image} 
                        alt={service.nombre} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                      />
                      {/* Floating Icon Badge */}
                      <div className="absolute top-6 left-6 w-14 h-14 bg-white/90 backdrop-blur-sm border border-slate-100 rounded-2xl flex items-center justify-center text-primary shadow-md">
                        <span className="material-symbols-outlined text-[28px]">{visuals.icon}</span>
                      </div>
                    </div>
                  </div>

                  {/* Description Card */}
                  <div className="w-full lg:w-1/2 space-y-6">
                    <div className="space-y-3">
                      <span className="text-[10px] font-extrabold uppercase tracking-widest text-primary bg-primary/10 px-3 py-1 rounded-full">
                        Servicio
                      </span>
                      <h3 className="font-headline text-2xl md:text-3xl font-black text-on-surface leading-tight">
                        {service.nombre}
                      </h3>
                      <p className="text-sm md:text-base text-on-surface-variant leading-relaxed">
                        {service.descripcion}
                      </p>
                    </div>

                    {/* Features checklist (Specs) */}
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                      {visuals.specs.map((spec, specIdx) => (
                        <li key={specIdx} className="flex items-start gap-2.5 text-xs text-slate-600 font-semibold">
                          <span className="material-symbols-outlined text-primary text-[18px] shrink-0 font-bold">check_circle</span>
                          <span>{spec}</span>
                        </li>
                      ))}
                    </ul>

                    {/* CTA Button */}
                    <div className="pt-4 flex flex-wrap gap-4">
                      <a 
                        href={`https://wa.me/51925981741?text=Hola%20Dellcom,%20me%20interesa%20el%20servicio%20de%20${encodeURIComponent(service.nombre)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 bg-primary hover:bg-primary/95 text-white px-6 py-3 rounded-2xl text-xs font-bold uppercase tracking-wider transition-all active:scale-95 shadow-md shadow-primary/15"
                      >
                        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                        </svg>
                        Cotizar por WhatsApp
                      </a>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Trabajos Realizados / Portafolio Section */}
        <section className="py-24 px-margin-mobile md:px-margin-desktop bg-slate-50/50 border-t border-slate-100" id="portafolio">
          <div className="max-w-container-max mx-auto">
            <div className="scroll-reveal text-center mb-16 space-y-3">
              <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider mb-2">
                <span className="material-symbols-outlined text-[16px]">verified</span>
                Garantía y Casos de Éxito
              </div>
              <h2 className="font-headline text-3xl md:text-4xl font-bold text-on-surface">Trabajos <span className="text-primary">Realizados</span></h2>
              <p className="text-sm md:text-base text-on-surface-variant max-w-2xl mx-auto leading-relaxed font-semibold">
                Explora el registro completo de nuestras reparaciones de hardware y configuraciones corporativas.
              </p>
            </div>

            <div className="scroll-reveal">
              <PortfolioGallery trabajos={trabajos} />
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
