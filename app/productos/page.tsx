"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { ShoppingBag } from "lucide-react";
import StatusHeader from "../components/StatusHeader";
import CleanFooter from "../components/CleanFooter";
import ScrollRevealObserver from "../components/ScrollRevealObserver";
import Pagination from "../components/Pagination";
import ProductFilterPanel from "./components/ProductFilterPanel";
import ProductCard from "./components/ProductCard";
import CartDrawer from "./components/CartDrawer";
import ProductLightbox from "./components/ProductLightbox";
import { Producto, Categoria, CartItem } from "./types";
import { fallbackCategories, fallbackProducts } from "./data";

const PRODUCTS_PER_SECTION = 9;

export default function ProductosPage() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("Todos");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProductDetails, setSelectedProductDetails] = useState<Producto | null>(null);
  const [lightboxImgIdx, setLightboxImgIdx] = useState(0);
  const [mounted, setMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [priceLimit, setPriceLimit] = useState(0);
  const [maxPrice, setMaxPrice] = useState(0);
  const [sortBy, setSortBy] = useState("default");
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
  const [page, setPage] = useState(1);
  const productsGridRef = useRef<HTMLDivElement>(null);

  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAnimatingCartButton, setIsAnimatingCartButton] = useState(false);
  const [confirmingClear, setConfirmingClear] = useState(false);

  useEffect(() => { setMounted(true); return () => setMounted(false); }, []);

  useEffect(() => {
    const saved = localStorage.getItem("dellcom_cart");
    if (saved) { try { setCart(JSON.parse(saved)); } catch { /* ignore */ } }
  }, []);

  useEffect(() => { localStorage.setItem("dellcom_cart", JSON.stringify(cart)); }, [cart]);

  useEffect(() => {
    async function loadData() {
      try {
        const [prodRes, catRes] = await Promise.all([fetch("/api/productos"), fetch("/api/categorias")]);
        let prods = [];
        let cats = [];
        if (prodRes.ok) { try { prods = await prodRes.json(); } catch { /* ignore */ } }
        if (catRes.ok) { try { cats = await catRes.json(); } catch { /* ignore */ } }
        if (!Array.isArray(prods) || prods.length === 0) prods = fallbackProducts;
        cats = (!Array.isArray(cats) || cats.length === 0) ? fallbackCategories : [{ id: 0, nombre: "Todos" }, ...cats];
        const maxP = Math.max(...prods.map((p: Producto) => Number(p.precio)), 0);
        setMaxPrice(maxP); setPriceLimit(maxP);
        setProductos(prods); setCategorias(cats);
      } catch {
        const maxP = Math.max(...fallbackProducts.map(p => Number(p.precio)), 0);
        setMaxPrice(maxP); setPriceLimit(maxP);
        setProductos(fallbackProducts); setCategorias(fallbackCategories);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  const addToCart = (product: Producto) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.id === product.id);
      if (existing) return prev.map((i) => i.id === product.id ? { ...i, cantidad: i.cantidad + 1 } : i);
      return [...prev, { id: product.id, nombre: product.nombre, precio: Number(product.precio), cantidad: 1, imagen_url: (product.imagen_url || "").split("||")[0], categoriaNombre: product.categoria?.nombre || "General" }];
    });
    setIsAnimatingCartButton(true);
    setTimeout(() => setIsAnimatingCartButton(false), 300);
  };

  const updateQuantity = (id: number, delta: number) => {
    setCart((prev) => prev.map((i) => i.id === id ? { ...i, cantidad: i.cantidad + delta } : i).filter((i) => i.cantidad > 0));
  };

  const clearCart = () => { setCart([]); setConfirmingClear(false); };

  const cartItemCount = cart.reduce((t, i) => t + i.cantidad, 0);
  const cartTotal = cart.reduce((t, i) => t + i.precio * i.cantidad, 0);

  const getWhatsAppUrl = () => {
    let msg = "👋 Hola *DELLCOM SAC*, solicito cotización para los siguientes productos:\n\n";
    cart.forEach((i) => { msg += `📦 *${i.cantidad}x* ${i.nombre}\n   🏷️ ${i.categoriaNombre}\n   💰 S/ ${i.precio.toFixed(2)} c/u | Subtotal: S/ ${(i.precio * i.cantidad).toFixed(2)}\n\n`; });
    msg += `💵 *Total Estimado: S/ ${cartTotal.toFixed(2)}*\n\n⚡ Agradezco su pronta respuesta para confirmar disponibilidad y coordinar la entrega/instalación. ¡Gracias!`;
    return `https://wa.me/51925981741?text=${encodeURIComponent(msg)}`;
  };

  const getCategoryCount = (name: string) => {
    if (name === "Todos") return productos.length;
    return productos.filter((p) => p.categoria?.nombre.toLowerCase() === name.toLowerCase()).length;
  };

  const filteredProducts = useMemo(() => productos.filter((p) => {
    const matchesSearch = p.nombre.toLowerCase().includes(searchQuery.toLowerCase()) || (p.descripcion && p.descripcion.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategory === "Todos" || (p.categoria && p.categoria.nombre.toLowerCase() === selectedCategory.toLowerCase());
    const matchesPrice = Number(p.precio) <= (priceLimit || maxPrice || 9999);
    return matchesSearch && matchesCategory && matchesPrice;
  }), [productos, searchQuery, selectedCategory, priceLimit, maxPrice]);

  const sortedProducts = useMemo(() => [...filteredProducts].sort((a, b) => {
    if (sortBy === "price_asc") return Number(a.precio) - Number(b.precio);
    if (sortBy === "price_desc") return Number(b.precio) - Number(a.precio);
    if (sortBy === "name_asc") return a.nombre.localeCompare(b.nombre);
    return 0;
  }), [filteredProducts, sortBy]);

  const totalPages = Math.max(1, Math.ceil(sortedProducts.length / PRODUCTS_PER_SECTION));
  const currentPage = Math.min(Math.max(page, 1), totalPages);
  const paginatedProducts = useMemo(
    () => sortedProducts.slice((currentPage - 1) * PRODUCTS_PER_SECTION, currentPage * PRODUCTS_PER_SECTION),
    [sortedProducts, currentPage]
  );

  const filterKey = `${searchQuery}|${selectedCategory}|${priceLimit}|${sortBy}`;
  const [prevFilterKey, setPrevFilterKey] = useState(filterKey);
  if (filterKey !== prevFilterKey) { setPrevFilterKey(filterKey); setPage(1); }

  const goToPage = (n: number) => { setPage(n); productsGridRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }); };

  return (
    <div className="bg-white min-h-screen flex flex-col justify-between text-on-surface selection:bg-primary/20 selection:text-primary relative overflow-x-hidden">
      <StatusHeader />

      <main className="pt-16">
        <section className="relative py-16 bg-slate-50/50 overflow-hidden border-b border-slate-100">
          <div className="absolute inset-0 opacity-[0.02] pointer-events-none" style={{ backgroundImage: "radial-gradient(#000 1px, transparent 1px)", backgroundSize: "16px 16px" }} />
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] pointer-events-none" />
          <div className="relative px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto w-full text-center z-10 scroll-reveal">
            <span className="inline-block py-1 px-3.5 mb-4 bg-primary/10 border border-primary/15 text-primary font-bold text-[10px] rounded-full uppercase tracking-widest">Catálogo Virtual</span>
            <h1 className="font-headline text-3xl md:text-5xl font-black text-on-surface leading-tight tracking-tight">
              Nuestro <span className="text-primary">Catálogo</span>
            </h1>
            <p className="text-xs md:text-sm text-on-surface-variant max-w-xl mx-auto mt-2 leading-relaxed font-semibold">
              Filtra y cotiza suministros originales Zebra, repuestos de hardware premium, componentes de microelectrónica y licenciamiento oficial.
            </p>
          </div>
        </section>

        <div className="py-16 max-w-container-max mx-auto w-full px-margin-mobile md:px-margin-desktop">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
            <aside className="hidden lg:block lg:col-span-1 sticky top-24 self-start bg-white border border-slate-200/80 p-6 rounded-[2rem] shadow-sm space-y-8 select-none">
              <ProductFilterPanel
                categorias={categorias} searchQuery={searchQuery} setSearchQuery={setSearchQuery}
                selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory}
                priceLimit={priceLimit} setPriceLimit={setPriceLimit} maxPrice={maxPrice}
                getCategoryCount={getCategoryCount}
              />
            </aside>

            <div className="col-span-1 lg:col-span-3 space-y-8">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-50/50 border border-slate-200/60 p-4 rounded-3xl shadow-sm w-full">
                <div className="flex items-center justify-between sm:justify-start gap-4 w-full sm:w-auto">
                  <button
                    onClick={() => setIsMobileFiltersOpen(true)}
                    className="flex lg:hidden items-center gap-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer shadow-sm"
                  >
                    <span className="material-symbols-outlined text-sm">filter_alt</span>
                    Filtros
                  </button>
                  <p className="text-xs text-slate-500 font-bold leading-none uppercase">
                    {isLoading ? "Cargando productos..." : (
                      <>Mostrando <span className="text-slate-800 font-extrabold">{sortedProducts.length}</span> de <span className="text-slate-800 font-extrabold">{productos.length}</span> resultados</>
                    )}
                  </p>
                </div>
                <div className="flex items-center gap-2 self-end sm:self-auto">
                  <span className="text-xs text-slate-500 font-bold uppercase whitespace-nowrap">Ordenar por:</span>
                  <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="bg-white border border-slate-200 focus:border-primary/50 focus:outline-none rounded-xl px-3 py-2 text-xs font-bold text-slate-700 cursor-pointer">
                    <option value="default">Por Defecto</option>
                    <option value="price_asc">Precio: Menor a Mayor</option>
                    <option value="price_desc">Precio: Mayor a Menor</option>
                    <option value="name_asc">Nombre: A - Z</option>
                  </select>
                </div>
              </div>

              {isLoading ? (
                <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                  {Array.from({ length: 6 }).map((_, idx) => (
                    <div key={idx} className="bg-slate-50 border border-slate-200 rounded-3xl h-72 animate-pulse" />
                  ))}
                </section>
              ) : paginatedProducts.length > 0 ? (
                <>
                  <section ref={productsGridRef} className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                    {paginatedProducts.map((prod) => (
                      <ProductCard
                        key={prod.id}
                        prod={prod}
                        cartItem={cart.find((i) => i.id === prod.id)}
                        onOpenDetails={() => { setSelectedProductDetails(prod); setLightboxImgIdx(0); }}
                        onAddToCart={() => addToCart(prod)}
                        onUpdateQuantity={(delta) => updateQuantity(prod.id, delta)}
                      />
                    ))}
                  </section>
                  <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={goToPage} />
                </>
              ) : (
                <div className="py-20 text-center text-on-surface-variant font-headline text-base bg-slate-50 border border-slate-200 rounded-3xl">
                  <ShoppingBag className="w-12 h-12 text-slate-300 mb-3 mx-auto" />
                  No se encontraron productos en esta categoría o precio.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile filters drawer */}
        <div className={`fixed inset-0 z-50 transition-opacity duration-300 lg:hidden ${isMobileFiltersOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}>
          <div onClick={() => setIsMobileFiltersOpen(false)} className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px]" />
          <div className={`absolute inset-y-0 left-0 w-80 max-w-full bg-white shadow-xl flex flex-col p-6 transform transition-transform duration-300 ${isMobileFiltersOpen ? "translate-x-0" : "-translate-x-full"}`}>
            <div className="flex justify-between items-center border-b border-slate-100 pb-4 mb-6">
              <h3 className="font-headline font-bold text-slate-800 text-base">Filtros Avanzados</h3>
              <button onClick={() => setIsMobileFiltersOpen(false)} className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-all cursor-pointer bg-transparent">
                <span className="material-symbols-outlined text-sm font-bold">close</span>
              </button>
            </div>
            <div className="space-y-8 flex-1 overflow-y-auto pr-1 no-scrollbar">
              <ProductFilterPanel
                categorias={categorias} searchQuery={searchQuery} setSearchQuery={setSearchQuery}
                selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory}
                priceLimit={priceLimit} setPriceLimit={setPriceLimit} maxPrice={maxPrice}
                getCategoryCount={getCategoryCount} isMobile onClose={() => setIsMobileFiltersOpen(false)}
              />
            </div>
          </div>
        </div>
      </main>

      <CartDrawer
        cart={cart} isCartOpen={isCartOpen} isAnimatingCartButton={isAnimatingCartButton}
        confirmingClear={confirmingClear} cartItemCount={cartItemCount} cartTotal={cartTotal}
        whatsAppUrl={getWhatsAppUrl()} setIsCartOpen={setIsCartOpen}
        setConfirmingClear={setConfirmingClear} onUpdateQuantity={updateQuantity} onClearCart={clearCart}
      />

      {mounted && selectedProductDetails && (
        <ProductLightbox
          product={selectedProductDetails}
          lightboxImgIdx={lightboxImgIdx}
          setLightboxImgIdx={setLightboxImgIdx}
          onClose={() => setSelectedProductDetails(null)}
          onAddToCart={addToCart}
        />
      )}

      <CleanFooter />
      <ScrollRevealObserver />
    </div>
  );
}
