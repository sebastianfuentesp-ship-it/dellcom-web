import { prisma } from "@/lib/prisma";

const serviceVisuals: Record<string, { image: string; icon: string }> = {
  "reparación": { image: "/img/servicios/reparacion_laptop.png", icon: "laptop_mac" },
  "microelectrónica": { image: "/img/servicios/microelectronica.jpg", icon: "memory" },
  "soporte": { image: "https://portalinnova.cl/wp-content/uploads/2021/06/Soporte-remoto-de-alta-confiabilidad-Plataforma-resuelve-problemas-tecnicos-en-segundos-y-con-la-maxima-seguridad-que-existe-en-el-mercado-scaled.jpg", icon: "support_agent" },
  "corporativo": { image: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&w=800&q=80", icon: "support_agent" },
  "licencia": { image: "/img/servicios/licencias_software.png", icon: "verified_user" },
  "software": { image: "/img/servicios/licencias_software.png", icon: "verified_user" },
  "ciberseguridad": { image: "https://tecnicana.org/wp-content/uploads/2026/06/AreaTematica-Ciberseguridad.png", icon: "security" },
  "seguridad": { image: "https://tecnicana.org/wp-content/uploads/2026/06/AreaTematica-Ciberseguridad.png", icon: "security" },
  "consultoría": { image: "https://castellanaconsultores.com/wp-content/uploads/2024/05/consultoria-it.jpg", icon: "psychology" },
  "it": { image: "https://otrs.com/wp-content/uploads/IT_Infrastructure_-_Blog_Image.jpg", icon: "psychology" },
  "repuesto": { image: "https://s.alicdn.com/@sc04/kf/Hc979084a7689417abcbb22e7beb812cc4/Wholesale-Laptop-Spare-Parts-All-Models-Computer-Accessories-LCD-Screen-Keyboard-Adapter-Computer-Repair-Parts-Replacement.jpg", icon: "storefront" },
};

function getServiceVisuals(nombre: string, defaultIcon: string) {
  const cleanName = nombre.toLowerCase();
  for (const [key, val] of Object.entries(serviceVisuals)) {
    if (cleanName.includes(key)) return val;
  }
  return { image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=600&q=80", icon: defaultIcon };
}

const FALLBACK_SERVICES = [
  { id: 1, nombre: "Reparación de Laptops y Equipos", descripcion: "Diagnóstico avanzado y reparación electrónica de hardware multimarca para laptops, impresoras y PCs de escritorio.", icono_url: "laptop_mac" },
  { id: 2, nombre: "Microelectrónica y Placas", descripcion: "Reparación a nivel de componentes en placas madre, reballing, microsoldadura y restauración de circuitos integrados.", icono_url: "memory" },
  { id: 4, nombre: "Soporte Remoto (AnyDesk)", descripcion: "Asistencia técnica remota inmediata para mantenimiento de sistemas operativos, virus, configuraciones y software de oficina.", icono_url: "support_agent" },
  { id: 5, nombre: "Venta de Repuestos de Laptops", descripcion: "Distribución de repuestos originales y compatibles para laptops multimarca: pantallas, teclados, baterías, cargadores, placas y carcasas.", icono_url: "storefront" },
  { id: 6, nombre: "Licencias de Software", descripcion: "Venta e instalación de licencias de software originales para sistemas operativos Windows, suites de Office y antivirus corporativos.", icono_url: "verified_user" },
  { id: 7, nombre: "Correos Corporativos", descripcion: "Configuración, migración y administración de correos profesionales en Google Workspace, Microsoft 365 y Webmail corporativo.", icono_url: "mail" },
];

async function getServices() {
  try {
    const dbServices = await prisma.servicio.findMany({ where: { activo: true }, orderBy: { id: "asc" } });
    if (dbServices && dbServices.length > 0) {
      return dbServices.map(s => ({ id: s.id, nombre: s.nombre, descripcion: s.descripcion, icono_url: s.icono_url || "laptop_mac" }));
    }
  } catch {
    /* Prisma unavailable — use fallback */
  }
  return FALLBACK_SERVICES;
}

export default async function HomeServicesSection() {
  const servicios = await getServices();

  return (
    <section className="py-24 px-margin-mobile md:px-margin-desktop bg-white border-t border-slate-100/50" id="servicios">
      <div className="max-w-container-max mx-auto">
        <div className="scroll-reveal text-center mb-16 space-y-3">
          <span className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider mb-2">
            <span className="material-symbols-outlined text-[16px]">build</span>
            Servicios Técnicos Especializados
          </span>
          <h2 className="font-headline text-3xl md:text-4xl font-bold text-on-surface">Soluciones Integrales <span className="text-primary">para tu Negocio</span></h2>
          <p className="text-sm font-semibold text-on-surface-variant max-w-2xl mx-auto">
            Explora nuestra gama de servicios y soporte certificado. Selecciona la opción que necesitas para cotizar o iniciar tu atención técnica de inmediato.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter items-stretch">
          {servicios.map((service, index) => {
            const visuals = getServiceVisuals(service.nombre, service.icono_url || "devices");
            const count = servicios.length;
            const isLastAlone = count % 2 === 1 && index === count - 1;
            const isFeatured = !isLastAlone && (index % 4 === 0 || index % 4 === 3);

            return (
              <div
                key={service.id}
                className={`scroll-reveal group bg-slate-50/60 border border-slate-200/60 rounded-3xl overflow-hidden hover:border-primary/50 transition-all duration-500 hover:shadow-xl hover:bg-white flex flex-col justify-between ${
                  isLastAlone ? "md:col-span-2 lg:col-span-3" : isFeatured ? "lg:col-span-2" : "lg:col-span-1"
                }`}
                style={{ transitionDelay: `${(index % 3) * 100}ms` }}
              >
                <div className="relative h-48 w-full overflow-hidden bg-slate-100">
                  <img src={visuals.image} alt={service.nombre} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-75" />
                  <div className="w-12 h-12 bg-white text-primary rounded-2xl flex items-center justify-center absolute bottom-4 left-4 shadow-md transition-all group-hover:bg-primary group-hover:text-white">
                    <span className="material-symbols-outlined text-[24px]">{visuals.icon}</span>
                  </div>
                  {isFeatured && (
                    <span className="absolute top-4 right-4 bg-primary text-white text-[9px] font-extrabold uppercase tracking-widest px-2.5 py-1 rounded-full shadow-md">
                      Especialidad Flagship
                    </span>
                  )}
                </div>

                <div className="p-6 md:p-8 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-headline text-xl font-bold text-on-surface mb-3 group-hover:text-primary transition-colors leading-tight">
                      {service.nombre}
                    </h3>
                    <p className="text-sm text-on-surface-variant mb-6 leading-relaxed max-w-2xl">{service.descripcion}</p>
                  </div>
                  <a
                    href={`https://wa.me/51925981741?text=${encodeURIComponent(`👋 Hola Dellcom, me interesa el servicio de *${service.nombre}* 🔧 ¿Podrían brindarme más información y disponibilidad?`)}`}
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
  );
}
