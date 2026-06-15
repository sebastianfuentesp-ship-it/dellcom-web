/**
 * Página del catálogo de productos: /productos
 * Carga los productos desde la API (/api/productos) en el cliente.
 * Funcionalidades:
 *  - Búsqueda por nombre en tiempo real.
 *  - Filtrado por categoría con pestañas.
 *  - Carrito de compras local (estado React) con modal de checkout.
 *  - Lightbox de detalle de producto con botón de cotizar por WhatsApp.
 *  - Componente ProductImage con fallback por ícono según categoría.
 */
"use client";

import { useState, useEffect, useMemo } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import StatusHeader from "../components/StatusHeader";
import CleanFooter from "../components/CleanFooter";
import ScrollRevealObserver from "../components/ScrollRevealObserver";

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

interface CartItem {
  id: number;
  nombre: string;
  precio: number;
  cantidad: number;
  imagen_url: string;
  categoriaNombre: string;
}

import { Printer, Network, Cpu, ShieldCheck, Monitor, Search, Plus, Minus, ShoppingCart, ShoppingBag, X, Trash2, MessageCircle, Eye } from "lucide-react";

// Custom Component for Product Images with dynamic fallback icons
// Custom Component for Product Images with dynamic fallback icons
function ProductImage({ 
  src, 
  alt, 
  categoryName, 
  className = "max-h-[220px]",
  style
}: { 
  src?: string; 
  alt: string; 
  categoryName: string; 
  className?: string;
  style?: React.CSSProperties;
}) {
  const [error, setError] = useState(false);

  // Helper to determine the best lucide icon component based on category name
  const getIconForCategory = (cat: string) => {
    const name = cat.toLowerCase();
    if (name.includes("impres") || name.includes("ribbon") || name.includes("tint") || name.includes("suministr")) return Printer;
    if (name.includes("red") || name.includes("connect") || name.includes("router") || name.includes("cable")) return Network;
    if (name.includes("almacen") || name.includes("memor") || name.includes("disco") || name.includes("ssd") || name.includes("ram")) return Cpu;
    if (name.includes("accesorio") || name.includes("mouse") || name.includes("teclad")) return Monitor;
    if (name.includes("licenc") || name.includes("soft")) return ShieldCheck;
    return Monitor;
  };

  const IconComponent = getIconForCategory(categoryName);

  if (error || !src || src.includes("placeholder.png")) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center bg-slate-100/60 text-slate-400 select-none p-4 min-h-[200px]">
        <IconComponent className="w-14 h-14 text-slate-300 mb-2 group-hover:scale-110 group-hover:text-primary transition-all duration-300" />
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">Dellcom Stock</span>
      </div>
    );
  }

  return (
    <img 
      src={src} 
      alt={alt} 
      className={`w-full h-full object-contain mix-blend-multiply drop-shadow-md group-hover:scale-105 transition-all duration-500 ${className}`}
      style={style}
      onError={() => setError(true)}
    />
  );
}

// Stateful component to zoom in on product image inside the lightbox modal
function ZoomableImage({ src, alt, categoryName }: { src?: string; alt: string; categoryName: string }) {
  const [zoomStyle, setZoomStyle] = useState<{ transformOrigin: string; transform: string } | null>(null);
  const [isZoomed, setIsZoomed] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomStyle({
      transformOrigin: `${x}% ${y}%`,
      transform: "scale(2.2)"
    });
  };

  const handleMouseLeave = () => {
    setZoomStyle(null);
    setIsZoomed(false);
  };

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isZoomed) {
      setZoomStyle(null);
      setIsZoomed(false);
    } else {
      const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
      const x = ((e.clientX - left) / width) * 100;
      const y = ((e.clientY - top) / height) * 100;
      setZoomStyle({
        transformOrigin: `${x}% ${y}%`,
        transform: "scale(2.2)"
      });
      setIsZoomed(true);
    }
  };

  return (
    <div 
      className="relative w-full h-full overflow-hidden flex items-center justify-center cursor-zoom-in select-none"
      onMouseMove={isZoomed ? undefined : handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
    >
      <ProductImage 
        src={src} 
        alt={alt} 
        categoryName={categoryName} 
        className="max-h-[380px] transition-transform duration-150 ease-out"
        style={zoomStyle || { transform: "scale(1)" }}
      />
    </div>
  );
}

const fallbackCategories = [
  { id: 0, nombre: "Todos" },
  { id: 1, nombre: "Ribbons y Tintas" },
  { id: 2, nombre: "Memorias y Discos" },
  { id: 3, nombre: "Tarjetas ZEBRA" },
  { id: 4, nombre: "Redes y Conectividad" },
  { id: 5, nombre: "Periféricos y Accesorios" },
  { id: 6, nombre: "Licencias de Software" }
];

const fallbackProducts: Producto[] = [
  {
    id: 50,
    nombre: "Ribbon de Cera Zebra 110x74",
    descripcion: "Rollo de cinta ribbon de cera de alta calidad para impresoras térmicas industriales y de escritorio. Transferencia térmica nítida en etiquetas de papel.",
    precio: 45.00,
    imagen_url: "/img/productos/ribbon-cera.jpg",
    categoria: { nombre: "Ribbons y Tintas" }
  },
  {
    id: 51,
    nombre: "Tinta Original HP GT53 Negra",
    descripcion: "Botella de tinta negra original HP GT53. Diseñado para imprimir con calidad profesional constante, evitando impresiones borrosas o fallas.",
    precio: 39.00,
    imagen_url: "/img/productos/tinta-hp-664.jpg",
    categoria: { nombre: "Ribbons y Tintas" }
  },
  {
    id: 52,
    nombre: "Disco Externo 2TB Toshiba",
    descripcion: "Disco duro externo portátil de 2TB de almacenamiento. Conexión USB 3.0 de alta velocidad y diseño ultra compacto resistente a impactos.",
    precio: 289.00,
    imagen_url: "/img/productos/disco-externo-1tb.jpg",
    categoria: { nombre: "Memorias y Discos" }
  },
  {
    id: 53,
    nombre: "Memoria RAM DDR4 8GB Crucial Laptop",
    descripcion: "Memoria RAM DDR4 de alto rendimiento y bajo consumo energético. Ideal para repotenciar laptops y mejorar la capacidad multitarea.",
    precio: 115.00,
    imagen_url: "/img/productos/ram-8gb-ddr4.jpg",
    categoria: { nombre: "Memorias y Discos" }
  },
  {
    id: 54,
    nombre: "Tarjeta de Limpieza Zebra",
    descripcion: "Tarjetas de limpieza originales para cabezal de impresión e rodillo de arrastre en impresoras de tarjetas Zebra. Alarga la vida útil de tu equipo.",
    precio: 75.00,
    imagen_url: "/img/productos/ribbon-zebra-800300-350la.jpg",
    categoria: { nombre: "Tarjetas ZEBRA" }
  },
  {
    id: 55,
    nombre: "Licencia Windows 11 Pro OEM",
    descripcion: "Clave de activación digital original OEM de Windows 11 Professional. Activación permanente en un equipo, vinculable a cuenta Microsoft.",
    precio: 149.00,
    imagen_url: "/img/productos/windows_11_pro.jpg",
    categoria: { nombre: "Licencias de Software" }
  },
  {
    id: 56,
    nombre: "Licencia Office 2024 Professional Plus",
    descripcion: "Clave digital original de activación de la suite Office 2024 Professional Plus. Incluye Word, Excel, PowerPoint, Outlook, Teams, OneNote y Access. Licencia permanente.",
    precio: 349.00,
    imagen_url: "/img/productos/office_2024.jpg",
    categoria: { nombre: "Licencias de Software" }
  },
  {
    id: 67,
    nombre: "Licencia Windows 11 Home Retail",
    descripcion: "Clave de activación digital original Retail de Windows 11 Home. Activación permanente en un equipo, ideal para computadoras del hogar y laptops personales.",
    precio: 119.00,
    imagen_url: "/img/productos/windows_11_home.jpg",
    categoria: { nombre: "Licencias de Software" }
  },
  {
    id: 57,
    nombre: "Disco SSD Kingston A400 480GB SATA",
    descripcion: "Unidad de estado sólido SATA III de 2.5 pulgadas. Increíble velocidad de lectura (hasta 500MB/s) y escritura (450MB/s) para repotenciar laptops y PCs de escritorio.",
    precio: 180.00,
    imagen_url: "/img/productos/ssd-480gb.jpg",
    categoria: { nombre: "Memorias y Discos" }
  },
  {
    id: 58,
    nombre: "Memoria USB 3.2 Kingston Exodia 32GB",
    descripcion: "Memoria USB portátil Kingston DataTraveler Exodia con conexión USB 3.2 Gen 1 rápida. Diseño práctico con capuchón protector y llavero colorido.",
    precio: 29.00,
    imagen_url: "/img/productos/memoria-usb-32gb.jpg",
    categoria: { nombre: "Memorias y Discos" }
  },
  {
    id: 59,
    nombre: "Cinta Ribbon Zebra YMCKO 800300-350LA",
    descripcion: "Cinta ribbon de color original YMCKO de alto rendimiento para impresoras de tarjetas Zebra ZC100 y ZC300. Produce hasta 350 impresiones de alta definición.",
    precio: 290.00,
    imagen_url: "/img/productos/ribbon-zebra-800300-350la.jpg",
    categoria: { nombre: "Tarjetas ZEBRA" }
  },
  {
    id: 60,
    nombre: "Etiquetas Térmicas Directas 102x152mm",
    descripcion: "Rollo de etiquetas térmicas autoadhesivas de alta adherencia. Ideales para despacho de mercadería, Courier, y rotulado de cajas (500 etiquetas).",
    precio: 45.00,
    imagen_url: "/img/productos/etiquetas-termicas.jpg",
    categoria: { nombre: "Ribbons y Tintas" }
  },
  {
    id: 61,
    nombre: "Router Inalámbrico TP-Link TL-WR840N N300",
    descripcion: "Router de banda única de 2.4GHz a 300Mbps. Cuenta con 4 puertos LAN de 10/100Mbps y 2 antenas fijas de alto alcance. Modos router, repetidor y access point.",
    precio: 75.00,
    imagen_url: "/img/productos/router-tplink.jpg",
    categoria: { nombre: "Redes y Conectividad" }
  },
  {
    id: 62,
    nombre: "Cable de Red Cat6 UTP Dixon 100% Cobre (Caja 305m)",
    descripcion: "Caja de cable UTP categoría 6 Dixon de cobre puro. Excelente rendimiento de transmisión Gigabit, conductor multifilar ideal para tendido estructurado.",
    precio: 480.00,
    imagen_url: "/img/productos/cable-cat6.jpg",
    categoria: { nombre: "Redes y Conectividad" }
  },
  {
    id: 63,
    nombre: "Adaptador USB 3.0 a Ethernet RJ45 Gigabit TP-Link",
    descripcion: "Adaptador de red portátil USB a RJ45 hembra. Proporciona conectividad a internet de alta velocidad de hasta 1000Mbps para laptops sin puerto ethernet.",
    precio: 65.00,
    imagen_url: "/img/productos/adaptador-usb-ethernet.jpg",
    categoria: { nombre: "Redes y Conectividad" }
  },
  {
    id: 64,
    nombre: "Mouse Inalámbrico Logitech M170",
    descripcion: "Mouse inalámbrico de 2.4GHz ergonómico y ambidiestro. Receptor USB plug and play con alcance de hasta 10 metros y batería de larga duración.",
    precio: 45.00,
    imagen_url: "/img/productos/mouse-logitech.jpg",
    categoria: { nombre: "Periféricos y Accesorios" }
  },
  {
    id: 65,
    nombre: "Teclado Logitech K120 USB",
    descripcion: "Teclado cableado estándar USB resistente a salpicaduras. Teclas silenciosas, perfil plano y patas ajustables para una escritura cómoda.",
    precio: 38.00,
    imagen_url: "/img/productos/teclado-logitech.jpg",
    categoria: { nombre: "Periféricos y Accesorios" }
  },
  {
    id: 66,
    nombre: "Mousepad Ergonómico con Apoya Muñeca de Gel",
    descripcion: "Mousepad con diseño ergonómico de base antideslizante. Relleno de gel suave que reduce la tensión en la muñeca durante largas jornadas.",
    precio: 25.00,
    imagen_url: "/img/productos/mousepad.jpg",
    categoria: { nombre: "Periféricos y Accesorios" }
  }
];

export default function ProductosPage() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("Todos");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProductDetails, setSelectedProductDetails] = useState<Producto | null>(null);
  const [mounted, setMounted] = useState(false);

  // Advanced Filters & Sorting
  const [priceLimit, setPriceLimit] = useState<number>(0);
  const [maxPrice, setMaxPrice] = useState<number>(0);
  const [sortBy, setSortBy] = useState("default");
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  // Carrito de Cotización
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAnimatingCartButton, setIsAnimatingCartButton] = useState(false);
  const [confirmingClear, setConfirmingClear] = useState(false);

  // Load cart from localStorage after mount (Hydration-safe)
  useEffect(() => {
    const savedCart = localStorage.getItem("dellcom_cart");
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (e) {
        console.error("Error parsing cart data from localStorage", e);
      }
    }
  }, []);

  // Save cart to localStorage when it changes
  useEffect(() => {
    localStorage.setItem("dellcom_cart", JSON.stringify(cart));
  }, [cart]);

  // Fetch categories & products from DB APIs
  useEffect(() => {
    async function loadData() {
      try {
        const prodRes = await fetch("/api/productos");
        const catRes = await fetch("/api/categorias");
        
        let prods = [];
        let cats = [];

        if (prodRes.ok) {
          try {
            prods = await prodRes.json();
          } catch (e) {
            console.warn("Failed to parse products API response as JSON.", e);
          }
        }
        if (catRes.ok) {
          try {
            cats = await catRes.json();
          } catch (e) {
            console.warn("Failed to parse categories API response as JSON.", e);
          }
        }

        if (!Array.isArray(prods) || prods.length === 0) {
          prods = fallbackProducts;
        }
        if (!Array.isArray(cats) || cats.length === 0) {
          cats = fallbackCategories;
        } else {
          cats = [{ id: 0, nombre: "Todos" }, ...cats];
        }

        // Calculate maximum product price dynamically
        const computedMaxPrice = Math.max(...prods.map(p => Number(p.precio)), 0);
        setMaxPrice(computedMaxPrice);
        setPriceLimit(computedMaxPrice);

        setProductos(prods);
        setCategorias(cats);
      } catch (err) {
        console.error("Error fetching product data from Next API. Using static fallbacks.", err);
        const computedMaxPrice = Math.max(...fallbackProducts.map(p => Number(p.precio)), 0);
        setMaxPrice(computedMaxPrice);
        setPriceLimit(computedMaxPrice);
        setProductos(fallbackProducts);
        setCategorias(fallbackCategories);
      }
    }
    loadData();
  }, []);

  // Cart Management Functions
  const addToCart = (product: Producto) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === product.id);
      if (existingItem) {
        return prevCart.map((item) =>
          item.id === product.id ? { ...item, cantidad: item.cantidad + 1 } : item
        );
      }
      return [
        ...prevCart,
        {
          id: product.id,
          nombre: product.nombre,
          precio: Number(product.precio),
          cantidad: 1,
          imagen_url: product.imagen_url || "",
          categoriaNombre: product.categoria?.nombre || "General",
        },
      ];
    });
    // Trigger pulse animation
    setIsAnimatingCartButton(true);
    setTimeout(() => setIsAnimatingCartButton(false), 300);
  };

  const updateQuantity = (id: number, delta: number) => {
    setCart((prevCart) => {
      return prevCart
        .map((item) => {
          if (item.id === id) {
            const newQty = item.cantidad + delta;
            return { ...item, cantidad: newQty };
          }
          return item;
        })
        .filter((item) => item.cantidad > 0);
    });
  };

  const clearCart = () => {
    setCart([]);
    setConfirmingClear(false);
  };

  const cartItemCount = cart.reduce((total, item) => total + item.cantidad, 0);
  const cartTotal = cart.reduce((total, item) => total + item.precio * item.cantidad, 0);

  const getWhatsAppUrl = () => {
    let message = "Hola DELLCOM SAC, deseo solicitar una cotización para los siguientes productos:\n\n";
    
    cart.forEach((item) => {
      message += `• *${item.cantidad}x* ${item.nombre}\n`;
      message += `  Categoría: ${item.categoriaNombre}\n`;
      message += `  Precio aprox: S/ ${item.precio.toFixed(2)} c/u | Subtotal: S/ ${(item.precio * item.cantidad).toFixed(2)}\n\n`;
    });
    
    message += `*Total Estimado: S/ ${cartTotal.toFixed(2)}*\n\n`;
    message += "Agradezco su pronta respuesta para confirmar la disponibilidad y coordinar la entrega/instalación.";
    
    return `https://wa.me/51925981741?text=${encodeURIComponent(message)}`;
  };

  // Count items per category dynamically
  const getCategoryCount = (categoryName: string) => {
    if (categoryName === "Todos") return productos.length;
    return productos.filter(
      (p) => p.categoria?.nombre.toLowerCase() === categoryName.toLowerCase()
    ).length;
  };

  // Filter products by query search, category, and price limit
  const filteredProducts = useMemo(() => productos.filter((p) => {
    const matchesSearch =
      p.nombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.descripcion && p.descripcion.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory =
      selectedCategory === "Todos" ||
      (p.categoria && p.categoria.nombre.toLowerCase() === selectedCategory.toLowerCase());

    const matchesPrice = Number(p.precio) <= (priceLimit || maxPrice || 9999);

    return matchesSearch && matchesCategory && matchesPrice;
  }), [productos, searchQuery, selectedCategory, priceLimit, maxPrice]);

  // Sort products based on criteria selection
  const sortedProducts = useMemo(() => [...filteredProducts].sort((a, b) => {
    if (sortBy === "price_asc") return Number(a.precio) - Number(b.precio);
    if (sortBy === "price_desc") return Number(b.precio) - Number(a.precio);
    if (sortBy === "name_asc") return a.nombre.localeCompare(b.nombre);
    return 0;
  }), [filteredProducts, sortBy]);

  // Render sidebar filters for reuse in desktop aside and mobile drawer
  const renderSidebarFilters = (isMobile: boolean = false) => {
    return (
      <div className="space-y-8">
        {/* Search */}
        <div>
          <h4 className="font-headline font-bold text-xs uppercase text-slate-500 tracking-wider mb-3">Buscar Producto</h4>
          <div className="relative bg-slate-50 border border-slate-200 rounded-xl overflow-hidden focus-within:border-primary/50 focus-within:ring-2 focus-within:ring-primary/10 transition-all">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4 pointer-events-none" />
            <input 
              className="w-full pl-9 pr-8 py-2.5 bg-transparent border-none focus:outline-none text-on-surface text-xs font-semibold placeholder:text-slate-400"
              placeholder="Buscar..." 
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors border-none bg-transparent cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Categories Checkboxes */}
        <div>
          <h4 className="font-headline font-bold text-xs uppercase text-slate-500 tracking-wider mb-3">Categorías</h4>
          <div className="space-y-2 max-h-60 overflow-y-auto pr-1 no-scrollbar">
            {categorias.map((cat) => {
              const isSelected = selectedCategory.toLowerCase() === cat.nombre.toLowerCase();
              const count = getCategoryCount(cat.nombre);
              return (
                <button
                  key={cat.id}
                  onClick={() => {
                    setSelectedCategory(cat.nombre);
                    if (isMobile) setIsMobileFiltersOpen(false);
                  }}
                  className={`w-full flex items-center justify-between text-left py-2 px-3 rounded-xl transition-all cursor-pointer border-none text-xs font-semibold ${
                    isSelected 
                      ? "bg-primary/5 text-primary"
                      : "bg-transparent text-slate-600 hover:bg-slate-50 hover:text-slate-800"
                  }`}
                >
                  <div className="flex items-center gap-2.5 truncate mr-2">
                    <div className={`w-4 h-4 rounded-full border flex items-center justify-center transition-all ${
                      isSelected ? "border-primary bg-primary" : "border-slate-300 bg-white"
                    }`}>
                      {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                    </div>
                    <span className="truncate">{cat.nombre}</span>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full transition-all shrink-0 ${
                    isSelected ? "bg-primary/10 text-primary" : "bg-slate-100 text-slate-500"
                  }`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Price Slider */}
        {maxPrice > 0 && (
          <div>
            <h4 className="font-headline font-bold text-xs uppercase text-slate-500 tracking-wider mb-2">Filtrar por Precio</h4>
            <div className="space-y-3 pt-2">
              <input 
                type="range"
                min="0"
                max={maxPrice}
                value={priceLimit || maxPrice}
                onChange={(e) => setPriceLimit(Number(e.target.value))}
                className="w-full accent-primary h-1 bg-slate-200 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between items-center text-[10px] sm:text-xs">
                <span className="text-slate-500 font-bold">Máx: S/ {maxPrice.toFixed(0)}</span>
                <span className="text-primary font-extrabold bg-primary/5 px-2.5 py-1 rounded-lg">Hasta S/ {(priceLimit || maxPrice).toFixed(0)}</span>
              </div>
            </div>
          </div>
        )}

        {/* Clear filters button */}
        {(searchQuery || selectedCategory !== "Todos" || (priceLimit > 0 && priceLimit < maxPrice)) && (
          <button
            onClick={() => {
              setSearchQuery("");
              setSelectedCategory("Todos");
              setPriceLimit(maxPrice);
              if (isMobile) setIsMobileFiltersOpen(false);
            }}
            className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-800 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer border-none"
          >
            Limpiar Filtros
          </button>
        )}
      </div>
    );
  };

  return (
    <div className="bg-white min-h-screen flex flex-col justify-between text-on-surface selection:bg-primary/20 selection:text-primary relative overflow-x-hidden">
      
      {/* Reusable Status Header */}
      <StatusHeader />

      <main className="pt-16">
        {/* Asymmetric Header Banner */}
        <section className="relative py-16 bg-slate-50/50 overflow-hidden border-b border-slate-100">
          <div className="absolute inset-0 opacity-[0.02] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '16px 16px' }} />
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] pointer-events-none" />
          
          <div className="relative px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto w-full text-center z-10 scroll-reveal">
            <span className="inline-block py-1 px-3.5 mb-4 bg-primary/10 border border-primary/15 text-primary font-bold text-[10px] rounded-full uppercase tracking-widest">
              Catálogo Virtual Oficial 2026
            </span>
            <h1 className="font-headline text-3xl md:text-5xl font-black text-on-surface leading-tight tracking-tight">
              Nuestro <span className="text-primary">Catálogo</span>
            </h1>
            <p className="text-xs md:text-sm text-on-surface-variant max-w-xl mx-auto mt-2 leading-relaxed font-semibold">
              Filtra y cotiza suministros originales Zebra, repuestos de hardware premium, componentes de microelectrónica y licenciamiento oficial.
            </p>
          </div>
        </section>

        {/* Main Catalog Content Container */}
        <div className="py-16 max-w-container-max mx-auto w-full px-margin-mobile md:px-margin-desktop">
          
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
            
            {/* Sidebar Filters (Desktop version) */}
            <aside className="hidden lg:block lg:col-span-1 sticky top-24 self-start bg-white border border-slate-200/80 p-6 rounded-[2rem] shadow-sm space-y-8 select-none">
              {renderSidebarFilters(false)}
            </aside>
            
            {/* Products Content Column */}
            <div className="col-span-1 lg:col-span-3 space-y-8">
              
              {/* Filter controls and Sorting Header */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-50/50 border border-slate-200/60 p-4 rounded-3xl shadow-sm w-full">
                
                {/* Mobile Filter Button + Results Count */}
                <div className="flex items-center justify-between sm:justify-start gap-4 w-full sm:w-auto">
                  <button
                    onClick={() => setIsMobileFiltersOpen(true)}
                    className="flex lg:hidden items-center gap-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer shadow-sm"
                  >
                    <span className="material-symbols-outlined text-sm">filter_alt</span>
                    Filtros
                  </button>
                  <p className="text-xs text-slate-500 font-bold leading-none uppercase">
                    Mostrando <span className="text-slate-800 font-extrabold">{sortedProducts.length}</span> de <span className="text-slate-800 font-extrabold">{productos.length}</span> resultados
                  </p>
                </div>

                {/* Sorting Dropdown */}
                <div className="flex items-center gap-2 self-end sm:self-auto">
                  <span className="text-xs text-slate-500 font-bold uppercase whitespace-nowrap">Ordenar por:</span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="bg-white border border-slate-200 focus:border-primary/50 focus:outline-none rounded-xl px-3 py-2 text-xs font-bold text-slate-700 cursor-pointer"
                  >
                    <option value="default">Por Defecto</option>
                    <option value="price_asc">Precio: Menor a Mayor</option>
                    <option value="price_desc">Precio: Mayor a Menor</option>
                    <option value="name_asc">Nombre: A - Z</option>
                  </select>
                </div>
              </div>

              {/* Dynamic Products Grid */}
              <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {sortedProducts.length > 0 ? (
                  sortedProducts.map((prod) => {
                    const cartItem = cart.find((item) => item.id === prod.id);

                    return (
                      <article 
                        key={prod.id} 
                        className="bg-white rounded-3xl overflow-hidden border border-slate-200/80 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group flex flex-col justify-between relative"
                      >
                        {/* Dynamic Sale Badge (Visual Vibe) */}
                        <span className="absolute top-4 right-4 bg-primary/10 text-primary border border-primary/20 text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full z-10">
                          Original
                        </span>

                        {/* Product Image Container with Fallbacks */}
                        <div 
                          onClick={() => setSelectedProductDetails(prod)}
                          className="aspect-square bg-slate-50/40 p-4 flex items-center justify-center border-b border-slate-100/80 relative overflow-hidden select-none cursor-pointer group/img"
                        >
                          <ProductImage 
                            src={prod.imagen_url} 
                            alt={prod.nombre} 
                            categoryName={prod.categoria?.nombre || "General"} 
                          />
                          <div className="absolute inset-0 bg-slate-900/5 opacity-0 group-hover/img:opacity-100 transition-all duration-300 flex items-center justify-center backdrop-blur-[0.5px]">
                            <div className="bg-white/95 backdrop-blur-[2px] shadow-sm border border-slate-200/50 text-slate-800 text-[10px] font-bold uppercase tracking-wider py-2 px-3 rounded-xl flex items-center gap-1.5 transform translate-y-2 group-hover/img:translate-y-0 transition-all duration-300">
                              <Eye className="w-3.5 h-3.5 text-slate-600" />
                              Vista Rápida
                            </div>
                          </div>
                        </div>
                        
                        {/* Product Details Section */}
                        <div className="p-5 flex flex-col justify-between flex-1 space-y-4">
                          <div className="space-y-2">
                            <span className="inline-block px-2.5 py-0.5 rounded-md bg-slate-100 text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                              {prod.categoria?.nombre || "General"}
                            </span>
                            <h3 
                              onClick={() => setSelectedProductDetails(prod)}
                              className="font-headline text-sm md:text-base font-bold text-on-surface line-clamp-2 hover:text-primary transition-colors leading-snug cursor-pointer"
                            >
                              {prod.nombre}
                            </h3>
                            <p className="text-xs text-on-surface-variant line-clamp-3 leading-relaxed font-semibold">
                              {prod.descripcion || "Consúltanos especificaciones, disponibilidad y compatibilidad de este producto."}
                            </p>
                          </div>

                          <div className="flex items-center justify-between pt-4 border-t border-slate-100 mt-auto">
                            <div className="flex flex-col">
                              <span className="text-[10px] text-slate-400 font-bold uppercase leading-none">Precio Aprox.</span>
                              <span className="font-headline text-base font-extrabold text-primary leading-none mt-1">
                                S/ {Number(prod.precio).toFixed(2)}
                              </span>
                            </div>

                            {cartItem ? (
                              /* Quantity selector if already in cart */
                              <div className="flex items-center bg-slate-100 rounded-xl border border-slate-200/60 p-0.5">
                                <button 
                                  onClick={() => updateQuantity(prod.id, -1)}
                                  className="w-7 h-7 flex items-center justify-center text-slate-600 hover:text-primary active:scale-90 transition-all font-bold cursor-pointer border-none bg-transparent"
                                >
                                  <Minus className="w-3.5 h-3.5" />
                                </button>
                                <span className="w-7 text-center text-xs font-bold text-slate-800">
                                  {cartItem.cantidad}
                                </span>
                                <button 
                                  onClick={() => updateQuantity(prod.id, 1)}
                                  className="w-7 h-7 flex items-center justify-center text-slate-600 hover:text-primary active:scale-90 transition-all font-bold cursor-pointer border-none bg-transparent"
                                >
                                  <Plus className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            ) : (
                              /* Add button if not in cart */
                              <button 
                                onClick={() => addToCart(prod)}
                                className="flex items-center gap-1.5 bg-primary hover:bg-primary/95 text-white px-4 py-2.5 rounded-xl text-[11px] font-bold transition-all active:scale-95 shadow-md shadow-primary/10 cursor-pointer select-none border-none"
                              >
                                <ShoppingCart className="w-3.5 h-3.5" />
                                Añadir
                              </button>
                            )}
                          </div>
                        </div>
                      </article>
                    );
                  })
                ) : (
                  <div className="col-span-full py-20 text-center text-on-surface-variant font-headline text-base bg-slate-50 border border-slate-200 rounded-3xl">
                    <ShoppingBag className="w-12 h-12 text-slate-300 mb-3 mx-auto" />
                    No se encontraron productos en esta categoría o precio.
                  </div>
                )}
              </section>
            </div>
          </div>
        </div>

        {/* Mobile Filters Drawer Modal */}
        <div className={`fixed inset-0 z-50 transition-opacity duration-300 lg:hidden ${isMobileFiltersOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}>
          <div onClick={() => setIsMobileFiltersOpen(false)} className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px]" />
          <div className={`absolute inset-y-0 left-0 w-80 max-w-full bg-white shadow-xl flex flex-col p-6 transform transition-transform duration-300 ${isMobileFiltersOpen ? "translate-x-0" : "-translate-x-full"}`}>
            <div className="flex justify-between items-center border-b border-slate-100 pb-4 mb-6">
              <h3 className="font-headline font-bold text-slate-800 text-base">Filtros Avanzados</h3>
              <button 
                onClick={() => setIsMobileFiltersOpen(false)}
                className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-all cursor-pointer bg-transparent"
              >
                <span className="material-symbols-outlined text-sm font-bold">close</span>
              </button>
            </div>
            <div className="space-y-8 flex-1 overflow-y-auto pr-1 no-scrollbar">
              {renderSidebarFilters(true)}
            </div>
          </div>
        </div>
      </main>

      {/* Floating Cart Badge Button */}
      {cartItemCount > 0 && (
        <button
          onClick={() => setIsCartOpen(true)}
          className={`fixed bottom-24 right-6 z-40 flex items-center gap-3 bg-primary hover:bg-primary/95 text-white px-5 py-4 rounded-2xl shadow-xl shadow-primary/20 transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer border-none ${
            isAnimatingCartButton ? "scale-110 animate-pulse" : ""
          }`}
        >
          <div className="relative flex items-center justify-center">
            <ShoppingBag className="w-6 h-6" />
            <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-slate-900 text-[10px] font-black text-white">
              {cartItemCount}
            </span>
          </div>
          <div className="hidden sm:flex flex-col items-start leading-none text-left">
            <span className="text-[9px] uppercase tracking-wider font-bold opacity-80">Lista de Cotización</span>
            <span className="text-sm font-extrabold mt-0.5">S/ {cartTotal.toFixed(2)}</span>
          </div>
        </button>
      )}
      {/* Cart Drawer / Slide-Over Modal */}
      <div 
        className={`fixed inset-0 z-50 transition-opacity duration-300 ${
          isCartOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      >
        {/* Dark Backdrop Overlay */}
        <div
          onClick={() => { setIsCartOpen(false); setConfirmingClear(false); }}
          className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px] transition-opacity"
        />

        {/* Drawer Slide Panel */}
        <div className="absolute inset-y-0 right-0 max-w-full flex">
          <div 
            className={`w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between transform transition-transform duration-300 ease-in-out border-l border-slate-100 ${
              isCartOpen ? "translate-x-0" : "translate-x-full"
            }`}
          >
            {/* Header */}
            <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-6 h-6 text-primary" />
                <div>
                  <h2 className="font-headline text-lg font-bold text-on-surface">Tu Cotización</h2>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider leading-none mt-1">
                    {cartItemCount} {cartItemCount === 1 ? "artículo" : "artículos"}
                  </p>
                </div>
              </div>
              <button
                onClick={() => { setIsCartOpen(false); setConfirmingClear(false); }}
                className="w-9 h-9 flex items-center justify-center rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer border-none"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* List Body */}
            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4 no-scrollbar">
              {cart.length > 0 ? (
                cart.map((item) => (
                  <div key={item.id} className="flex gap-4 p-3 bg-slate-50/60 rounded-2xl border border-slate-100 hover:border-slate-200/60 transition-all">
                    {/* Item Thumbnail */}
                    <div className="w-16 h-16 bg-white rounded-xl border border-slate-200 p-2 flex items-center justify-center shrink-0 overflow-hidden relative">
                      {(() => {
                        if (item.imagen_url && !item.imagen_url.includes("placeholder")) {
                          return <img src={item.imagen_url} alt={item.nombre} className="w-full h-full object-contain" />;
                        }
                        const name = item.categoriaNombre.toLowerCase();
                        let Icon = Monitor;
                        if (name.includes("impres") || name.includes("ribbon") || name.includes("tint") || name.includes("suministr")) Icon = Printer;
                        else if (name.includes("red") || name.includes("connect") || name.includes("router") || name.includes("cable")) Icon = Network;
                        else if (name.includes("almacen") || name.includes("memor") || name.includes("disco") || name.includes("ssd") || name.includes("ram")) Icon = Cpu;
                        else if (name.includes("licenc") || name.includes("soft")) Icon = ShieldCheck;
                        return <Icon className="w-8 h-8 text-slate-300" />;
                      })()}
                    </div>

                    {/* Item Info */}
                    <div className="flex-1 flex flex-col justify-between min-w-0">
                      <div>
                        <h4 className="text-xs font-bold text-slate-800 line-clamp-1 leading-snug">{item.nombre}</h4>
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wide">{item.categoriaNombre}</span>
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs font-extrabold text-primary">S/ {(item.precio * item.cantidad).toFixed(2)}</span>
                        
                        {/* Selector de cantidad */}
                        <div className="flex items-center bg-white rounded-lg border border-slate-200 p-0.5">
                          <button 
                            onClick={() => updateQuantity(item.id, -1)}
                            className="w-6 h-6 flex items-center justify-center text-slate-500 hover:text-primary transition-colors font-bold cursor-pointer border-none bg-transparent"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-6 text-center text-[11px] font-bold text-slate-700">{item.cantidad}</span>
                          <button 
                            onClick={() => updateQuantity(item.id, 1)}
                            className="w-6 h-6 flex items-center justify-center text-slate-500 hover:text-primary transition-colors font-bold cursor-pointer border-none bg-transparent"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center text-slate-400 py-16">
                  <ShoppingBag className="w-16 h-16 text-slate-200 mb-2 mx-auto" />
                  <p className="text-sm font-semibold">Tu lista de cotización está vacía</p>
                  <p className="text-xs text-slate-400 mt-1">Explora nuestro catálogo y añade suministros o licencias.</p>
                </div>
              )}
            </div>

            {/* Footer */}
            {cart.length > 0 && (
              <div className="p-6 border-t border-slate-100 bg-slate-50/50 space-y-4">
                <div className="flex justify-between items-center text-slate-800 font-bold">
                  <span className="text-xs uppercase tracking-wider text-slate-400 font-bold">Total Estimado</span>
                  <span className="font-headline text-xl font-extrabold text-slate-900">S/ {cartTotal.toFixed(2)}</span>
                </div>
                
                {confirmingClear ? (
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-500 font-semibold flex-1">¿Vaciar lista?</span>
                    <button
                      onClick={() => setConfirmingClear(false)}
                      className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl text-xs font-bold transition-colors cursor-pointer border-none"
                    >
                      No
                    </button>
                    <button
                      onClick={clearCart}
                      className="px-4 py-2.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl text-xs font-bold transition-colors cursor-pointer border-none"
                    >
                      Sí, vaciar
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-5 gap-2">
                    <button
                      onClick={() => setConfirmingClear(true)}
                      className="col-span-1 flex items-center justify-center bg-white hover:bg-slate-100 text-slate-500 hover:text-red-500 border border-slate-200 rounded-xl py-3.5 transition-colors cursor-pointer"
                      title="Vaciar Lista"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                    <a
                      href={getWhatsAppUrl()}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="col-span-4 flex items-center justify-center gap-2 bg-primary hover:bg-primary/95 text-white font-bold text-xs uppercase tracking-wider py-3.5 rounded-xl transition-all shadow-md shadow-primary/10 active:scale-95 cursor-pointer text-center no-underline"
                    >
                      <MessageCircle className="w-5 h-5" />
                      Enviar Cotización por WhatsApp
                    </a>
                  </div>
                )}
                <p className="text-[9px] text-slate-400 font-medium text-center leading-relaxed">
                  *Los precios mostrados son aproximados y pueden variar según stock y tipo de cambio. Un técnico se contactará para confirmar su solicitud.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick View Product Modal (React Portal) */}
      {mounted && selectedProductDetails && createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div 
            onClick={() => setSelectedProductDetails(null)}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-[4px] transition-opacity duration-300 animate-fade-in"
          />

          {/* Modal Content Card */}
          <div className="relative bg-white rounded-[2rem] shadow-2xl border border-slate-100 max-w-2xl w-full overflow-hidden flex flex-col md:flex-row z-10 transform scale-100 animate-scale-up transition-all duration-300 max-h-[90vh] md:max-h-none">
            
            {/* Left Column: Image */}
            <div className="md:w-1/2 bg-slate-50/50 p-8 flex items-center justify-center border-b md:border-b-0 md:border-r border-slate-100 relative min-h-[250px] md:min-h-[380px]">
              <div className="w-full h-full max-h-[380px] flex items-center justify-center">
                <ZoomableImage 
                  src={selectedProductDetails.imagen_url} 
                  alt={selectedProductDetails.nombre} 
                  categoryName={selectedProductDetails.categoria?.nombre || "General"} 
                />
              </div>
              <span className="absolute top-4 left-4 inline-block px-3 py-1 rounded-full bg-white/90 backdrop-blur-[2px] border border-slate-200/50 text-[9px] text-slate-500 font-extrabold uppercase tracking-widest shadow-sm">
                {selectedProductDetails.categoria?.nombre || "General"}
              </span>
            </div>

            {/* Right Column: Information */}
            <div className="md:w-1/2 p-8 flex flex-col justify-between overflow-y-auto no-scrollbar">
              <div className="space-y-5">
                <div className="flex justify-between items-start">
                  <span className="inline-flex items-center gap-1 text-[9px] font-black text-green-600 bg-green-50 border border-green-100 px-2 py-0.5 rounded-md uppercase tracking-wider">
                    <span className="h-1.5 w-1.5 rounded-full bg-green-600 animate-pulse" />
                    Disponible
                  </span>
                  <button 
                    onClick={() => setSelectedProductDetails(null)}
                    className="w-8 h-8 rounded-full bg-slate-50 hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors flex items-center justify-center cursor-pointer border-none"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-2">
                  <h2 className="font-headline text-lg md:text-xl font-bold text-on-surface leading-snug">
                    {selectedProductDetails.nombre}
                  </h2>
                  <div className="text-xs text-slate-400 font-bold uppercase tracking-wider">
                    DELLCOM STOCK CERTIFICADO
                  </div>
                </div>

                <p className="text-xs text-on-surface-variant leading-relaxed font-semibold">
                  {selectedProductDetails.descripcion || "Consúltanos especificaciones técnicas detalladas, stock en tienda física y compatibilidad exacta para este producto."}
                </p>

                {/* Tech Specs Summary Table */}
                <div className="border border-slate-100 rounded-2xl p-4 bg-slate-50/50 space-y-2.5">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-400 font-bold">Garantía</span>
                    <span className="text-slate-700 font-extrabold">12 Meses DELLCOM</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-400 font-bold">Condición</span>
                    <span className="text-slate-700 font-extrabold">Nuevo Sellado</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-400 font-bold">Instalación / Soporte</span>
                    <span className="text-slate-700 font-extrabold text-primary">Disponible (Opcional)</span>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-slate-100 mt-6 md:mt-8 space-y-4">
                <div className="flex justify-between items-baseline">
                  <span className="text-xs text-slate-400 font-bold uppercase">Precio de Venta</span>
                  <span className="font-headline text-2xl font-black text-primary">
                    S/ {Number(selectedProductDetails.precio).toFixed(2)}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <button 
                    onClick={() => {
                      addToCart(selectedProductDetails);
                      setSelectedProductDetails(null);
                    }}
                    className="flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-wider py-3.5 rounded-xl transition-all shadow-md active:scale-95 cursor-pointer border-none"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    Añadir Lista
                  </button>
                  <a 
                    href={`https://wa.me/51925981741?text=${encodeURIComponent(
                      `Hola DELLCOM SAC, deseo solicitar información y cotización inmediata para el producto: *${selectedProductDetails.nombre}* (Precio aprox: S/ ${Number(selectedProductDetails.precio).toFixed(2)})`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 bg-primary hover:bg-primary/95 text-white font-bold text-xs uppercase tracking-wider py-3.5 rounded-xl transition-all shadow-md shadow-primary/10 active:scale-95 cursor-pointer text-center no-underline border-none"
                  >
                    <MessageCircle className="w-4 h-4" />
                    Cotizar Ya
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* Reusable Clean Footer */}
      <CleanFooter />

      <ScrollRevealObserver />
    </div>
  );
}
