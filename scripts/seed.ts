import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("[LIMPIEZA] Limpiando base de datos anterior...");
  // Clear tables in reverse order of dependencies
  await prisma.mensajeContacto.deleteMany({});
  await prisma.trabajoRealizado.deleteMany({});
  await prisma.producto.deleteMany({});
  await prisma.categoria.deleteMany({});
  await prisma.archivoTecnico.deleteMany({});
  await prisma.licencia.deleteMany({});
  await prisma.servicio.deleteMany({});
  await prisma.usuario.deleteMany({});

  console.log("[INICIO] Iniciando siembra de datos (Seeding)...");

  // 1. Seed Default Admin User
  const contrasena = await bcrypt.hash("admin123", 10);
  const admin = await prisma.usuario.create({
    data: {
      nombre: "Administrador Dellcom",
      usuario: "admin",
      email: "admin@dellcom.pe",
      contrasena,
      rol: "admin",
      activo: true,
    },
  });
  console.log("[OK] Usuario admin creado: admin / admin123");

  // 2. Seed Real Services of ZEBRA & DELLCOM
  const serviciosList = [
    {
      nombre: "Reparación de Laptops e Impresoras",
      descripcion: "Diagnóstico avanzado y reparación electrónica de hardware multimarca para laptops, impresoras térmicas, láser y matriciales.",
      icono_url: "laptop_mac",
      activo: true,
    },
    {
      nombre: "Microelectrónica y Placas",
      descripcion: "Reparación a nivel de componentes en placas madre, reballing, microsoldadura y restauración de circuitos integrados quemados.",
      icono_url: "memory",
      activo: true,
    },
    {
      nombre: "Redes y Servidores",
      descripcion: "Diseño, estructurado y montaje de redes de datos, cableado Cat6/Cat6A, racks de servidores y mantenimiento de conectividad empresarial.",
      icono_url: "dns",
      activo: true,
    },
    {
      nombre: "Soporte Remoto (AnyDesk)",
      descripcion: "Asistencia técnica remota inmediata para mantenimiento de sistemas operativos, virus, configuraciones y software de oficina.",
      icono_url: "support_agent",
      activo: true,
    },
    {
      nombre: "Correos Corporativos",
      descripcion: "Configuración, migración y administración de correos profesionales en Google Workspace, Microsoft 365 y Webmail corporativo.",
      icono_url: "mail",
      activo: true,
    },
    {
      nombre: "Licencias de Software",
      descripcion: "Venta e instalación de licencias de software originales para sistemas operativos Windows, suites de Office y antivirus corporativos.",
      icono_url: "verified_user",
      activo: true,
    },
  ];

  const serviciosMap: Record<string, any> = {};
  for (const s of serviciosList) {
    const created = await prisma.servicio.create({
      data: s,
    });
    serviciosMap[s.nombre] = created;
  }
  console.log("[OK] Servicios reales sembrados en la BD.");

  // 3. Seed Real Categories
  const categoriasList = [
    "Ribbons y Tintas",
    "Memorias y Discos",
    "Tarjetas ZEBRA",
    "Redes y Conectividad",
    "Periféricos y Accesorios",
    "Licencias de Software",
  ];

  const categoriasMap: Record<string, any> = {};
  for (const nombreCat of categoriasList) {
    const created = await prisma.categoria.create({
      data: {
        nombre: nombreCat,
        activo: true,
      },
    });
    categoriasMap[nombreCat] = created;
  }
  console.log("[OK] Categorías reales sembradas en la BD.");

  // 4. Seed Products
  const productos = [
    {
      nombre: "Disco SSD Kingston A400 480GB SATA",
      descripcion: "Unidad de estado sólido SATA III de 2.5 pulgadas. Increíble velocidad de lectura (hasta 500MB/s) y escritura (450MB/s) para repotenciar laptops y PCs de escritorio.",
      precio: 180.00,
      imagen_url: "/img/productos/ssd-480gb.jpg",
      activo: true,
      id_categoria: categoriasMap["Memorias y Discos"].id,
    },
    {
      nombre: "Disco Duro Externo Adata HD330 1TB",
      descripcion: "Disco duro externo resistente a impactos y caídas con carcasa de silicona amortiguadora. Conexión USB 3.2 rápida y cifrado seguro AES de 256 bits.",
      precio: 245.00,
      imagen_url: "/img/productos/disco-externo-1tb.jpg",
      activo: true,
      id_categoria: categoriasMap["Memorias y Discos"].id,
    },
    {
      nombre: "Memoria RAM Kingston Valueram 8GB DDR4 3200MHz",
      descripcion: "Memoria RAM DDR4 de alto rendimiento y bajo consumo energético. Ideal para repotenciar laptops y mejorar la capacidad multitarea.",
      precio: 120.00,
      imagen_url: "/img/productos/ram-8gb-ddr4.jpg",
      activo: true,
      id_categoria: categoriasMap["Memorias y Discos"].id,
    },
    {
      nombre: "Memoria USB 3.2 Kingston Exodia 32GB",
      descripcion: "Memoria USB portátil Kingston DataTraveler Exodia con conexión USB 3.2 Gen 1 rápida. Diseño práctico con capuchón protector y llavero colorido.",
      precio: 29.00,
      imagen_url: "/img/productos/memoria-usb-32gb.jpg",
      activo: true,
      id_categoria: categoriasMap["Memorias y Discos"].id,
    },
    {
      nombre: "Cinta Ribbon Zebra YMCKO 800300-350LA",
      descripcion: "Cinta ribbon de color original YMCKO de alto rendimiento para impresoras de tarjetas Zebra ZC100 y ZC300. Produce hasta 350 impresiones de alta definición.",
      precio: 290.00,
      imagen_url: "/img/productos/ribbon-zebra-800300-350la.jpg",
      activo: true,
      id_categoria: categoriasMap["Tarjetas ZEBRA"].id,
    },
    {
      nombre: "Ribbon de Cera Zebra 110x74",
      descripcion: "Rollo de cinta ribbon de cera de alta calidad para impresoras térmicas industriales y de escritorio. Transferencia térmica nítida en etiquetas de papel.",
      precio: 45.00,
      imagen_url: "/img/productos/ribbon-cera.jpg",
      activo: true,
      id_categoria: categoriasMap["Ribbons y Tintas"].id,
    },
    {
      nombre: "Tinta HP 664 Negra Original",
      descripcion: "Cartucho de tinta negra original HP 664. Diseñado para imprimir con calidad profesional constante, evitando impresiones borrosas o fallas.",
      precio: 65.00,
      imagen_url: "/img/productos/tinta-hp-664.jpg",
      activo: true,
      id_categoria: categoriasMap["Ribbons y Tintas"].id,
    },
    {
      nombre: "Etiquetas Térmicas Directas 102x152mm",
      descripcion: "Rollo de etiquetas térmicas autoadhesivas de alta adherencia. Ideales para despacho de mercadería, Courier, y rotulado de cajas (500 etiquetas).",
      precio: 45.00,
      imagen_url: "/img/productos/etiquetas-termicas.jpg",
      activo: true,
      id_categoria: categoriasMap["Ribbons y Tintas"].id,
    },
    {
      nombre: "Router Inalámbrico TP-Link TL-WR840N N300",
      descripcion: "Router de banda única de 2.4GHz a 300Mbps. Cuenta con 4 puertos LAN de 10/100Mbps y 2 antenas fijas de alto alcance. Modos router, repetidor y access point.",
      precio: 75.00,
      imagen_url: "/img/productos/router-tplink.jpg",
      activo: true,
      id_categoria: categoriasMap["Redes y Conectividad"].id,
    },
    {
      nombre: "Cable de Red Cat6 UTP Dixon 100% Cobre (Caja 305m)",
      descripcion: "Caja de cable UTP categoría 6 Dixon de cobre puro. Excelente rendimiento de transmisión Gigabit, conductor multifilar ideal para tendido estructurado.",
      precio: 480.00,
      imagen_url: "/img/productos/cable-cat6.jpg",
      activo: true,
      id_categoria: categoriasMap["Redes y Conectividad"].id,
    },
    {
      nombre: "Adaptador USB 3.0 a Ethernet RJ45 Gigabit TP-Link",
      descripcion: "Adaptador de red portátil USB a RJ45 hembra. Proporciona conectividad a internet de alta velocidad de hasta 1000Mbps para laptops sin puerto ethernet.",
      precio: 65.00,
      imagen_url: "/img/productos/adaptador-usb-ethernet.jpg",
      activo: true,
      id_categoria: categoriasMap["Redes y Conectividad"].id,
    },
    {
      nombre: "Mouse Inalámbrico Logitech M170",
      descripcion: "Mouse inalámbrico de 2.4GHz ergonómico y ambidiestro. Receptor USB plug and play con alcance de hasta 10 metros y batería de larga duración.",
      precio: 45.00,
      imagen_url: "/img/productos/mouse-logitech.jpg",
      activo: true,
      id_categoria: categoriasMap["Periféricos y Accesorios"].id,
    },
    {
      nombre: "Teclado Logitech K120 USB",
      descripcion: "Teclado cableado estándar USB resistente a salpicaduras. Teclas silenciosas, perfil plano y patas ajustables para una escritura cómoda.",
      precio: 38.00,
      imagen_url: "/img/productos/teclado-logitech.jpg",
      activo: true,
      id_categoria: categoriasMap["Periféricos y Accesorios"].id,
    },
    {
      nombre: "Mousepad Ergonómico con Apoya Muñeca de Gel",
      descripcion: "Mousepad con diseño ergonómico de base antideslizante. Relleno de gel suave que reduce la tensión en la muñeca durante largas jornadas.",
      precio: 25.00,
      imagen_url: "/img/productos/mousepad.jpg",
      activo: true,
      id_categoria: categoriasMap["Periféricos y Accesorios"].id,
    },
    {
      nombre: "Licencia Windows 11 Pro Retail 64-bit",
      descripcion: "Clave de activación digital original Retail de Windows 11 Professional. Activación permanente en un equipo, vinculable a cuenta Microsoft.",
      precio: 120.00,
      imagen_url: "/img/productos/licencias_software.png",
      activo: true,
      id_categoria: categoriasMap["Licencias de Software"].id,
    },
    {
      nombre: "Licencia Office 2021 Professional Plus",
      descripcion: "Clave digital original de activación de la suite Office 2021 Professional Plus. Incluye Word, Excel, PowerPoint y Outlook. Licencia permanente.",
      precio: 280.00,
      imagen_url: "/img/productos/licencias_software.png",
      activo: true,
      id_categoria: categoriasMap["Licencias de Software"].id,
    },
  ];

  for (const p of productos) {
    await prisma.producto.create({
      data: p,
    });
  }
  console.log("[OK] Productos reales sembrados en la BD.");

  // 5. Seed Portfolio / Trabajos Realizados
  const trabajos = [
    {
      titulo: "Mantenimiento Térmico y Reparación de Laptops",
      descripcion: "Mantenimiento térmico preventivo y correctivo para laptops gaming y corporativas de alta gama. Extracción de acumulación de polvo extremo en turbinas, cambio de almohadillas térmicas (pads) secas, aplicación de pasta térmica de alta conductividad para reducir temperaturas de CPU y GPU, reemplazo de pantallas LED/IPS rotas, y repotenciación con discos SSD M.2 NVMe.||/img/portafolio/WhatsApp Image 2026-06-14 at 9.36.56 PM (1).jpeg,/img/portafolio/WhatsApp Image 2026-06-14 at 9.36.56 PM.jpeg,/img/portafolio/WhatsApp Image 2026-06-14 at 9.41.12 PM (4).jpeg,/img/portafolio/WhatsApp Image 2026-06-14 at 9.41.13 PM (6).jpeg",
      imagen_url: "/img/portafolio/WhatsApp Image 2026-06-14 at 9.36.56 PM (1).jpeg",
      id_servicio: serviciosMap["Reparación de Laptops e Impresoras"].id,
      fecha: new Date("2026-06-15T12:00:00Z"),
    },
    {
      titulo: "Soporte y Reparación de Impresoras Epson y Zebra",
      descripcion: "Diagnóstico y solución de encendido en impresoras Epson EcoTank CK57 MAIN mediante soldadura de transistores y fusible F1 quemados. Reparación de atascos continuos mediante cambio de engranajes de tracción y calibración de sensores ópticos. Configuración y purgado de sistemas continuos HP Smart Tank e integración inalámbrica en red local.||/img/portafolio/WhatsApp Image 2026-06-14 at 9.36.56 PM (2).jpeg,/img/portafolio/WhatsApp Image 2026-06-14 at 9.41.12 PM.jpeg,/img/portafolio/WhatsApp Image 2026-06-14 at 9.41.12 PM (1).jpeg",
      imagen_url: "/img/portafolio/WhatsApp Image 2026-06-14 at 9.36.56 PM (2).jpeg",
      id_servicio: serviciosMap["Reparación de Laptops e Impresoras"].id,
      fecha: new Date("2026-06-15T11:00:00Z"),
    },
    {
      titulo: "Reparación Electrónica de Placas Madre a Nivel Componente",
      descripcion: "Laboratorio de microelectrónica de precisión. Reparación de cortocircuitos detectados por termografía infrarroja de alta sensibilidad, microsoldadura de puertos de carga USB-C, programación directa de Bios EEPROM mediante grabadores externos y reballing de chips integrados (GPU/Chipset) con soldadura aleada de alta resistencia.||/img/portafolio/WhatsApp Image 2026-06-14 at 9.36.55 PM.jpeg,/img/portafolio/WhatsApp Image 2026-06-14 at 9.36.57 PM (2).jpeg,/img/portafolio/WhatsApp Image 2026-06-14 at 9.41.12 PM (3).jpeg,/img/portafolio/WhatsApp Image 2026-06-14 at 9.41.13 PM (1).jpeg,/img/portafolio/WhatsApp Image 2026-06-14 at 9.41.13 PM (5).jpeg",
      imagen_url: "/img/portafolio/WhatsApp Image 2026-06-14 at 9.36.55 PM.jpeg",
      id_servicio: serviciosMap["Microelectrónica y Placas"].id,
      fecha: new Date("2026-06-15T10:00:00Z"),
    },
    {
      titulo: "Instalación de Cableado Estructurado Cat6 y Racks de Servidor",
      descripcion: "Montaje y estructurado de cableado de red de datos Cat6 para oficinas. Peinado de cables, ponchado en patch panel, ordenamiento en gabinete rack de servidores, instalación de switches administrables y enrutadores MikroTik/Ubiquiti, y puesta en marcha de servidores NAS de almacenamiento local centralizado con políticas de backup automático.||/img/portafolio/WhatsApp Image 2026-06-14 at 9.41.12 PM (5).jpeg,/img/portafolio/WhatsApp Image 2026-06-14 at 9.41.13 PM.jpeg",
      imagen_url: "/img/portafolio/WhatsApp Image 2026-06-14 at 9.41.12 PM (5).jpeg",
      id_servicio: serviciosMap["Redes y Servidores"].id,
      fecha: new Date("2026-06-15T09:00:00Z"),
    },
    {
      titulo: "Montaje Custom y Gestión de Cables de Computadoras Gamer",
      descripcion: "Diseño y armado a medida de PCs de escritorio para gaming, edición y diseño arquitectónico. Selección balanceada de componentes (procesador, tarjeta gráfica, RAM y disipación líquida), gestión oculta de cables para flujo de aire óptimo y sincronización de ventiladores ARGB.||/img/portafolio/WhatsApp Image 2026-06-14 at 9.36.57 PM (1).jpeg,/img/portafolio/WhatsApp Image 2026-06-14 at 9.36.57 PM.jpeg",
      imagen_url: "/img/portafolio/WhatsApp Image 2026-06-14 at 9.36.57 PM (1).jpeg",
      id_servicio: serviciosMap["Reparación de Laptops e Impresoras"].id,
      fecha: new Date("2026-06-15T08:00:00Z"),
    },
    {
      titulo: "Saneamiento de Software y Configuración de Correos Corporativos",
      descripcion: "Soporte corporativo presencial y remoto vía AnyDesk/RustDesk. Activación legal de licencias oficiales Windows 10/11 Pro OEM/Retail, suites de Microsoft Office 2021 Hogar y Empresas, configuración de correos corporativos en Google Workspace y Microsoft 365 bajo políticas seguras de spam y envío de emails.||/img/portafolio/WhatsApp Image 2026-06-14 at 9.41.12 PM (2).jpeg,/img/portafolio/WhatsApp Image 2026-06-14 at 9.41.13 PM (2).jpeg,/img/portafolio/WhatsApp Image 2026-06-14 at 9.41.13 PM (3).jpeg,/img/portafolio/WhatsApp Image 2026-06-14 at 9.41.13 PM (4).jpeg",
      imagen_url: "/img/portafolio/WhatsApp Image 2026-06-14 at 9.41.12 PM (2).jpeg",
      id_servicio: serviciosMap["Licencias de Software"].id,
      fecha: new Date("2026-06-15T07:00:00Z"),
    },
  ];

  for (const t of trabajos) {
    await prisma.trabajoRealizado.create({
      data: t,
    });
  }
  console.log("[OK] Portafolio de trabajos sembrado en la BD.");

  // 6. Seed Licencias (Para demostración del cron de expiración)
  const licencias = [
    {
      id_usuario: admin.id,
      software: "Microsoft 365 Empresa Estándar",
      correo_cuenta: "gerencia@dellcom.pe",
      contrasena: "Dellcom365*",
      fecha_inicio: new Date("2025-06-15T00:00:00Z"),
      fecha_fin: new Date("2026-06-15T00:00:00Z"), // Activa (vence mañana)
      nombre_cliente: "Inversiones del Norte SAC",
      telefono: "925981741",
      estado: "activo" as const,
      observaciones: "Renovación anual pendiente para mañana.",
    },
    {
      id_usuario: admin.id,
      software: "Antivirus ESET NOD32 (3 PCs)",
      correo_cuenta: "administracion@constructora.com",
      contrasena: "Eset2025!!",
      fecha_inicio: new Date("2024-05-10T00:00:00Z"),
      fecha_fin: new Date("2025-05-10T00:00:00Z"), // Vencida en el pasado
      nombre_cliente: "Constructora San Elías",
      telefono: "922452929",
      estado: "activo" as const, // Inicialmente activo, para demostrar que el cron lo pondrá como vencido
      observaciones: "El cliente solicitó cotización de renovación por correo.",
    },
    {
      id_usuario: admin.id,
      software: "Windows 11 Pro Licencia OEM",
      correo_cuenta: "caja1@tiendaolivos.pe",
      contrasena: "Win11OEM*",
      fecha_inicio: new Date("2025-01-20T00:00:00Z"),
      fecha_fin: null, // Vitalicia
      nombre_cliente: "Mini Market Los Olivos",
      telefono: "925981741",
      estado: "activo" as const,
      observaciones: "Licencia original física pegada en el gabinete.",
    },
  ];

  for (const l of licencias) {
    await prisma.licencia.create({
      data: l,
    });
  }
  console.log("[OK] Licencias de demostración sembradas en la BD.");

  // 7. Seed Archivos Técnicos (Descargas)
  const archivos = [
    {
      id_usuario: admin.id,
      nombre: "Zebra Setup Utilities v1.1.9",
      tipo: "programa" as const,
      url_archivo: "https://www.zebra.com/us/en/support-downloads/software/utilities/zebra-setup-utilities.html",
      descripcion: "Herramienta de configuración oficial para calibración, configuración de red e impresión de prueba en impresoras Zebra.",
    },
    {
      id_usuario: admin.id,
      nombre: "Driver Zebra ZT411 Industrial",
      tipo: "driver" as const,
      url_archivo: "https://www.zebra.com/us/en/support-downloads/printers/industrial/zt411.html",
      descripcion: "Controladores oficiales de Windows para impresoras industriales de etiquetas Zebra serie ZT400.",
    },
    {
      id_usuario: admin.id,
      nombre: "AnyDesk Client Custom Dellcom",
      tipo: "link" as const,
      url_archivo: "https://anydesk.com/download",
      descripcion: "Enlace directo para la descarga del cliente oficial de soporte remoto AnyDesk.",
    },
  ];

  for (const a of archivos) {
    await prisma.archivoTecnico.create({
      data: a,
    });
  }
  console.log("[OK] Archivos técnicos sembrados en la BD.");

  // 8. Seed Mensaje de Contacto de demostración
  await prisma.mensajeContacto.create({
    data: {
      nombre: "Roberto Carlos Díaz",
      correo: "roberto.diaz@gmail.com",
      telefono: "987654321",
      asunto: "Cotización de Servicio",
      mensaje: "Estimados, requiero una cotización para realizar el mantenimiento preventivo y limpieza de 3 impresoras de etiquetas Zebra GK420t en nuestras oficinas de Los Olivos. Agradecería que se comuniquen lo antes posible.",
      leido: false,
    },
  });
  console.log("[OK] Mensaje de contacto de demostración sembrado.");

  console.log("\n[EXITO] ¡Proceso de Seeding de DELLCOM finalizado con éxito!");
}

main()
  .catch((e) => {
    console.error("[ERROR] Error durante el Seeding:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());