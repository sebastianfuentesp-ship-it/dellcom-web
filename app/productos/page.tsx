"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface Producto {
  id: number;
  nombre: string;
  descripcion: string;
  precio: string | number;
  imagen_url: string;
  categoria: {
    nombre: string;
  };
}

interface Categoria {
  id: number;
  nombre: string;
}

// Inline Dellcom SVG Logo
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

// Custom Component for Product Images with dynamic fallback icons
function ProductImage({ src, alt, categoryName }: { src?: string; alt: string; categoryName: string }) {
  const [error, setError] = useState(false);

  // Helper to determine the best material icon based on category name
  const getIconForCategory = (cat: string) => {
    const name = cat.toLowerCase();
    if (name.includes("impres") || name.includes("ribbon") || name.includes("tint") || name.includes("suministr")) return "print";
    if (name.includes("red") || name.includes("connect") || name.includes("router") || name.includes("cable")) return "router";
    if (name.includes("almacen") || name.includes("memor") || name.includes("disco") || name.includes("ssd") || name.includes("ram")) return "memory";
    if (name.includes("accesorio") || name.includes("mouse") || name.includes("teclad")) return "keyboard";
    if (name.includes("licenc") || name.includes("soft")) return "verified_user";
    return "devices";
  };

  const iconName = getIconForCategory(categoryName);

  if (error || !src || src.includes("placeholder.png")) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center bg-slate-100/60 text-slate-400 select-none p-4 min-h-[200px]">
        <span className="material-symbols-outlined text-[56px] text-slate-300 mb-2 group-hover:scale-110 group-hover:text-primary transition-all duration-300">
          {iconName}
        </span>
        <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400 font-headline">DELLCOM SAC</span>
      </div>
    );
  }

  // Handle local path conversion (e.g. img/productos/... -> /img/productos/...) if they get added to public
  const cleanedSrc = src.startsWith("http") || src.startsWith("/") ? src : `/${src}`;

  return (
    <img 
      alt={alt} 
      className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500 max-h-[220px]" 
      src={cleanedSrc}
      onError={() => setError(true)}
    />
  );
}

// Fallback products and categories data if database is empty/connection fails
const FALLBACK_PRODUCTS: Producto[] = [
  {
    id: 1,
    nombre: "Ribbon Zebra YMCKO Color",
    descripcion: "Cinta ribbon a color original compatible con impresoras Zebra. Ideal para credenciales y fotochecks de alta calidad.",
    precio: 189.00,
    imagen_url: "",
    categoria: { nombre: "Ribbons y Tintas" }
  },
  {
    id: 2,
    nombre: "Disco Externo Portátil 1TB",
    descripcion: "Almacenamiento portátil USB 3.0 de alta velocidad. Excelente para copias de seguridad de datos corporativos.",
    precio: 240.00,
    imagen_url: "",
    categoria: { nombre: "Memorias y Discos Externos" }
  },
  {
    id: 3,
    nombre: "Tarjetas de PVC ZEBRA Premium",
    descripcion: "Paquete de 100 tarjetas plásticas de PVC blanco brillante de alta calidad para impresoras de tarjetas Zebra.",
    precio: 120.00,
    imagen_url: "",
    categoria: { nombre: "Tarjetas ZEBRA" }
  },
  {
    id: 4,
    nombre: "Licencia Original Windows 11 Pro",
    descripcion: "Clave de activación digital original con soporte y actualizaciones oficiales de por vida para entornos corporativos.",
    precio: 150.00,
    imagen_url: "",
    categoria: { nombre: "Licencias de Software" }
  }
];

const FALLBACK_CATEGORIES: Categoria[] = [
  { id: 1, nombre: "Todos" },
  { id: 2, nombre: "Ribbons y Tintas" },
  { id: 3, nombre: "Memorias y Discos Externos" },
  { id: 4, nombre: "Tarjetas ZEBRA" },
  { id: 5, nombre: "Licencias de Software" }
];

export default function CatalogoPage() {
  const [productos, setProductos] = useState<Producto[]>(FALLBACK_PRODUCTS);
  const [categorias, setCategorias] = useState<Categoria[]>(FALLBACK_CATEGORIES);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Todos");
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    async function loadData() {
      try {
        const prodRes = await fetch("/api/productos");
        const catRes = await fetch("/api/categorias");
        
        if (prodRes.ok && catRes.ok) {
          const prodData = await prodRes.json();
          const catData = await catRes.json();
          
          if (prodData && prodData.length > 0) {
            setProductos(prodData);
          }
          if (catData && catData.length > 0) {
            // Keep unique categories names from database
            const uniqueCats = [{ id: 0, nombre: "Todos" }, ...catData];
            setCategorias(uniqueCats);
          }
        }
      } catch (err) {
        console.warn("Error fetching data from API, using static fallbacks.", err);
      }
    }
    loadData();
  }, []);

  // Filter products based on search query and category
  const filteredProducts = productos.filter((p) => {
    const matchesSearch = 
      p.nombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.descripcion && p.descripcion.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = 
      selectedCategory === "Todos" || 
      (p.categoria && p.categoria.nombre.toLowerCase() === selectedCategory.toLowerCase());

    return matchesSearch && matchesCategory;
  });

  const handleQuoteClick = () => {
    setCartCount(prev => prev + 1);
  };

  return (
    <div className="bg-slate-50 min-h-screen flex flex-col justify-between text-on-surface">
      
      {/* Header / Top Navigation Bar (Identical to page.tsx) */}
      <header className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-outline-variant/30 shadow-sm transition-all duration-300" id="main-header">
        <div className="flex justify-between items-center h-16 px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto">
          {/* Logo Brand */}
          <Link href="/" className="flex items-center gap-3 group">
            <DellcomLogo className="w-10 h-10 transition-transform group-hover:scale-105" />
            <div className="flex flex-col">
              <span className="font-headline font-bold text-lg text-on-surface leading-none tracking-tight">DELLCOM SAC</span>
              <span className="text-[10px] text-primary font-bold tracking-widest uppercase">Tu centro de confianza</span>
            </div>
          </Link>
          
          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex gap-8 items-center">
            <Link className="text-on-surface-variant hover:text-primary transition-colors text-sm font-semibold" href="/">Inicio</Link>
            <Link className="text-primary font-bold border-b-2 border-primary pb-0.5 text-sm font-semibold" href="/productos">Catálogo</Link>
            <Link className="text-on-surface-variant hover:text-primary transition-colors text-sm font-semibold" href="/descargas">Descargas</Link>
            <Link className="text-on-surface-variant hover:text-primary transition-colors text-sm font-semibold" href="/#servicios">Servicios</Link>
            <Link className="text-on-surface-variant hover:text-primary transition-colors text-sm font-semibold" href="/#nosotros">Nosotros</Link>
            <Link className="text-on-surface-variant hover:text-primary transition-colors text-sm font-semibold" href="/#contacto">Contacto</Link>
            
            {/* Admin Login Link */}
            <Link 
              href="/admin/login"
              className="text-on-surface-variant hover:text-primary transition-colors text-sm font-semibold"
            >
              Acceso Técnico
            </Link>
            
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
          
          {/* Mobile Menu Icon & Cart Overlay */}
          <div className="flex items-center gap-4 md:hidden">
            <button 
              aria-label="Shopping Cart" 
              className="relative p-2 hover:bg-black/5 rounded-full transition-colors"
              onClick={() => alert(`Has solicitado cotizaciones para ${cartCount} producto(s).`)}
            >
              <span className="material-symbols-outlined text-on-surface">shopping_cart</span>
              <span className="absolute top-1 right-1 bg-primary text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                {cartCount}
              </span>
            </button>
            <button className="text-on-surface hover:text-primary transition-colors">
              <span className="material-symbols-outlined text-3xl">menu</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Catalog View Container */}
      <main className="pt-24 pb-20 flex-1 max-w-container-max mx-auto w-full px-margin-mobile md:px-margin-desktop">
        
        {/* Title and Search Bar */}
        <header className="mb-10 text-center md:text-left space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider mb-2">
                <span className="material-symbols-outlined text-[16px]">grid_view</span>
                Catálogo Virtual 2026
              </div>
              <h2 className="font-headline text-3xl md:text-5xl font-extrabold text-on-surface tracking-tight">
                Nuestros <span className="text-primary">Productos</span>
              </h2>
            </div>
            
            {/* Dynamic cart badge for desktop */}
            <div className="hidden md:flex items-center gap-3 bg-white border border-outline-variant/30 rounded-2xl px-5 py-3 shadow-sm select-none">
              <span className="material-symbols-outlined text-primary text-[24px]">shopping_cart</span>
              <div className="flex flex-col text-left">
                <span className="text-xs font-bold text-on-surface leading-tight">Artículos a Cotizar</span>
                <span className="text-[11px] text-on-surface-variant font-medium leading-none">{cartCount} agregados</span>
              </div>
            </div>
          </div>

          <div className="relative max-w-2xl bg-white rounded-2xl shadow-sm border border-outline-variant/30 overflow-hidden">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline-variant">search</span>
            <input 
              className="w-full pl-12 pr-4 py-4 bg-transparent focus:outline-none text-on-surface font-body-md text-sm placeholder:text-slate-400"
              placeholder="Buscar por nombre, marca o especificación..." 
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </header>

        {/* Dynamic Category Navigation Tabs */}
        <section className="mb-8">
          <div className="flex overflow-x-auto no-scrollbar gap-3 pb-3">
            {categorias.map((cat) => (
              <button 
                key={cat.id}
                className={`px-5 py-2.5 rounded-full font-headline text-xs font-bold tracking-wide uppercase transition-all whitespace-nowrap border ${
                  selectedCategory.toLowerCase() === cat.nombre.toLowerCase()
                    ? "bg-primary border-primary text-white shadow-md shadow-primary/20"
                    : "bg-white border-outline-variant/30 text-on-surface-variant hover:bg-slate-50"
                }`}
                onClick={() => setSelectedCategory(cat.nombre)}
              >
                {cat.nombre}
              </button>
            ))}
          </div>
        </section>

        {/* Dynamic Products Grid */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((prod) => (
              <article 
                key={prod.id} 
                className="bg-white rounded-2xl overflow-hidden border border-outline-variant/30 hover:shadow-lg transition-all duration-300 group flex flex-col justify-between"
              >
                {/* Product Image Container with Fallbacks */}
                <div className="aspect-square bg-slate-50/50 p-6 flex items-center justify-center border-b border-outline-variant/10 relative overflow-hidden select-none">
                  <ProductImage 
                    src={prod.imagen_url} 
                    alt={prod.nombre} 
                    categoryName={prod.categoria?.nombre || "General"} 
                  />
                </div>
                
                {/* Product Details Section */}
                <div className="p-5 flex flex-col justify-between flex-1 space-y-4">
                  <div className="space-y-2">
                    <span className="inline-block px-2.5 py-0.5 rounded-md bg-slate-100 text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                      {prod.categoria?.nombre || "General"}
                    </span>
                    <h3 className="font-headline text-base font-bold text-on-surface line-clamp-2 group-hover:text-primary transition-colors leading-snug">
                      {prod.nombre}
                    </h3>
                    <p className="text-xs text-on-surface-variant line-clamp-3 leading-relaxed">
                      {prod.descripcion || "Consúltanos especificaciones, disponibilidad y compatibilidad de este producto."}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-50 mt-auto">
                    <div className="flex flex-col">
                      <span className="text-[10px] text-slate-400 font-bold uppercase leading-none">Precio Aprox.</span>
                      <span className="font-headline text-lg font-extrabold text-primary mt-1">
                        S/ {Number(prod.precio).toFixed(2)}
                      </span>
                    </div>
                    <a 
                      onClick={handleQuoteClick}
                      className="flex items-center gap-1.5 bg-primary hover:bg-primary/95 text-white px-4 py-2.5 rounded-xl text-[11px] font-bold transition-all active:scale-95 shadow-md shadow-primary/10 cursor-pointer" 
                      href={`https://wa.me/51987654321?text=Hola%20Dellcom%20SAC,%20deseo%20cotizar%20el%20producto%20${encodeURIComponent(prod.nombre)}.`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <span className="material-symbols-outlined text-sm">chat</span>
                      Cotizar
                    </a>
                  </div>
                </div>
              </article>
            ))
          ) : (
            <div className="col-span-full py-20 text-center text-on-surface-variant font-headline text-base bg-white border border-outline-variant/30 rounded-3xl">
              <span className="material-symbols-outlined text-5xl text-outline-variant/50 mb-3 block">inventory_2</span>
              No se encontraron productos en esta categoría o búsqueda.
            </div>
          )}
        </section>
      </main>

      {/* Footer Section (Identical to page.tsx) */}
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
              <li><Link className="text-sm text-on-surface-variant hover:text-primary transition-transform hover:translate-x-1 inline-block" href="/#servicios">Reparación de Hardware</Link></li>
              <li><Link className="text-sm text-on-surface-variant hover:text-primary transition-transform hover:translate-x-1 inline-block" href="/#servicios">Soporte Corporativo</Link></li>
              <li><Link className="text-sm text-on-surface-variant hover:text-primary transition-transform hover:translate-x-1 inline-block" href="/#servicios">Microelectrónica</Link></li>
              <li><Link className="text-sm text-on-surface-variant hover:text-primary transition-transform hover:translate-x-1 inline-block" href="/#servicios">Licencias Originales</Link></li>
            </ul>
          </div>
          
          {/* Company Info Column */}
          <div>
            <h4 className="font-headline font-bold text-xs text-on-surface uppercase tracking-wider mb-6">Compañía</h4>
            <ul className="space-y-4">
              <li><Link className="text-sm text-on-surface-variant hover:text-primary transition-transform hover:translate-x-1 inline-block" href="/#nosotros">Sobre Nosotros</Link></li>
              <li><Link className="text-sm text-on-surface-variant hover:text-primary transition-transform hover:translate-x-1 inline-block" href="/#servicios">Casos de Éxito</Link></li>
              <li><Link className="text-sm text-on-surface-variant hover:text-primary transition-transform hover:translate-x-1 inline-block" href="/productos">Nuestro Catálogo</Link></li>
              <li><Link className="text-sm text-on-surface-variant hover:text-primary transition-transform hover:translate-x-1 inline-block" href="/descargas">Descargas y Drivers</Link></li>
              <li><Link className="text-sm text-on-surface-variant hover:text-primary transition-transform hover:translate-x-1 inline-block" href="/admin/login">Portal Interno</Link></li>
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
            <Link className="text-xs text-on-surface-variant hover:text-primary" href="/#">Términos</Link>
            <Link className="text-xs text-on-surface-variant hover:text-primary" href="/#">Privacidad</Link>
            <Link className="text-xs text-on-surface-variant hover:text-primary" href="/admin/login">Panel Técnico</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
