"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Link from "next/link";

interface Licencia {
  id: number;
  software: string;
  correo_cuenta: string;
  contrasena: string;
  fecha_inicio: string;
  fecha_fin: string | null;
  nombre_cliente: string;
  telefono: string | null;
  estado: string;
  observaciones: string | null;
}

interface ArchivoTecnico {
  id: number;
  nombre: string;
  tipo: string;
  url_archivo: string;
  descripcion: string | null;
  fecha_subida: string;
}

interface Producto {
  id: number;
  nombre: string;
  precio: number | string;
  descripcion: string | null;
  activo: boolean;
}

// Vector SVG Dellcom Logo Component
function DellcomLogo({ className = "w-10 h-10" }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={className} xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="50" r="46" stroke="#dc2626" strokeWidth="3" fill="none" opacity="0.85" />
      <circle cx="50" cy="50" r="43" fill="#000000" />
      <path 
        d="M 48 20 C 40 20, 36 24, 36 28 C 30 28, 27 33, 29 39 C 24 41, 23 48, 26 53 C 21 57, 21 64, 25 68 C 23 74, 28 80, 35 80 C 38 80, 42 78, 44 76 C 46 78, 48 80, 48 80 Z" 
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
      <line x1="50" y1="18" x2="50" y2="82" stroke="#dc2626" strokeWidth="2.5" strokeDasharray="3 3" />
      <path 
        d="M 52 24 L 66 24 L 66 32 M 52 38 L 74 38 L 74 46 M 52 50 L 64 50 L 72 58 M 52 64 L 72 64 M 52 74 L 64 74 L 64 68" 
        stroke="#dc2626" 
        strokeWidth="3.5" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        fill="none" 
      />
      <circle cx="66" cy="32" r="3" fill="#dc2626" />
      <circle cx="74" cy="46" r="3" fill="#dc2626" />
      <circle cx="72" cy="58" r="3" fill="#dc2626" />
      <circle cx="72" cy="64" r="3" fill="#dc2626" />
      <circle cx="64" cy="68" r="3" fill="#dc2626" />
    </svg>
  );
}

export default function AdminDashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // Navigation and data states
  const [activeTab, setActiveTab] = useState("licenses"); // licenses, files, products
  const [licencias, setLicencias] = useState<Licencia[]>([]);
  const [archivos, setArchivos] = useState<ArchivoTecnico[]>([]);
  const [productos, setProductos] = useState<Producto[]>([]);
  
  // Search & Modals state
  const [searchQuery, setSearchQuery] = useState("");
  const [showLicenseModal, setShowLicenseModal] = useState(false);
  const [showFileModal, setShowFileModal] = useState(false);
  const [editingLicense, setEditingLicense] = useState<Licencia | null>(null);

  // Form states for License Creation/Editing
  const [formSoftware, setFormSoftware] = useState("");
  const [formCorreo, setFormCorreo] = useState("");
  const [formContrasena, setFormContrasena] = useState("");
  const [formCliente, setFormCliente] = useState("");
  const [formTelefono, setFormTelefono] = useState("");
  const [formFechaInicio, setFormFechaInicio] = useState("");
  const [formFechaFin, setFormFechaFin] = useState("");
  const [formObservaciones, setFormObservaciones] = useState("");

  // Form states for File Upload/Creation
  const [formFileName, setFormFileName] = useState("");
  const [formFileType, setFormFileType] = useState("programa"); // programa, driver, excel, link
  const [formFileUrl, setFormFileUrl] = useState("");
  const [formFileDesc, setFormFileDesc] = useState("");

  // Redirect if unauthorized
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/admin/login");
    }
  }, [status, router]);

  // Load backend resources
  useEffect(() => {
    if (status === "authenticated") {
      fetchLicencias();
      fetchArchivos();
      fetchProductos();
    }
  }, [status]);

  const fetchLicencias = async () => {
    try {
      const res = await fetch("/api/licencias");
      if (res.ok) setLicencias(await res.json());
    } catch (e) {
      console.error(e);
    }
  };

  const fetchArchivos = async () => {
    try {
      const res = await fetch("/api/archivos");
      if (res.ok) setArchivos(await res.json());
    } catch (e) {
      console.error(e);
    }
  };

  const fetchProductos = async () => {
    try {
      const res = await fetch("/api/productos");
      if (res.ok) setProductos(await res.json());
    } catch (e) {
      console.error(e);
    }
  };

  const handleCreateOrUpdateLicense = async (e: React.FormEvent) => {
    e.preventDefault();

    const licenseData = {
      software: formSoftware,
      correo_cuenta: formCorreo,
      contrasena: formContrasena,
      nombre_cliente: formCliente,
      telefono: formTelefono || null,
      fecha_inicio: formFechaInicio || new Date().toISOString(),
      fecha_fin: formFechaFin ? new Date(formFechaFin).toISOString() : null,
      observaciones: formObservaciones || null,
      estado: formFechaFin && new Date(formFechaFin) < new Date() ? "vencido" : "activo",
    };

    try {
      if (editingLicense) {
        const res = await fetch(`/api/licencias/${editingLicense.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(licenseData),
        });
        if (res.ok) {
          alert("Licencia actualizada con éxito");
          fetchLicencias();
        } else {
          const err = await res.json();
          alert(`Error: ${err.error || "No se pudo actualizar"}`);
        }
      } else {
        const res = await fetch("/api/licencias", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(licenseData),
        });
        if (res.ok) {
          alert("Licencia creada con éxito");
          fetchLicencias();
        } else {
          const err = await res.json();
          alert(`Error: ${err.error || "No se pudo crear. Asegúrese de ser Admin."}`);
        }
      }
      closeLicenseModal();
    } catch (err) {
      alert("Error de conexión al guardar la licencia.");
    }
  };

  const handleCreateFile = async (e: React.FormEvent) => {
    e.preventDefault();

    const fileData = {
      nombre: formFileName,
      tipo: formFileType,
      url_archivo: formFileUrl,
      descripcion: formFileDesc || null,
    };

    try {
      const res = await fetch("/api/archivos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(fileData),
      });
      if (res.ok) {
        alert("Archivo / Driver creado con éxito");
        fetchArchivos();
        closeFileModal();
      } else {
        const err = await res.json();
        alert(`Error: ${err.error || "No se pudo guardar el archivo. Asegúrese de ser Admin."}`);
      }
    } catch (e) {
      alert("Error de conexión al registrar el archivo.");
    }
  };

  const handleDeleteLicense = async (id: number) => {
    if (!confirm("¿Está seguro de eliminar esta licencia permanentemente?")) return;
    try {
      const res = await fetch(`/api/licencias/${id}`, { method: "DELETE" });
      if (res.ok) {
        alert("Licencia eliminada");
        fetchLicencias();
      } else {
        const err = await res.json();
        alert(`Error: ${err.error || "No se pudo eliminar"}`);
      }
    } catch (e) {
      alert("Error de conexión.");
    }
  };

  const handleDeleteFile = async (id: number) => {
    if (!confirm("¿Está seguro de eliminar este archivo permanentemente?")) return;
    try {
      const res = await fetch(`/api/archivos/${id}`, { method: "DELETE" });
      if (res.ok) {
        alert("Archivo eliminado");
        fetchArchivos();
      } else {
        const err = await res.json();
        alert(`Error: ${err.error || "No se pudo eliminar"}`);
      }
    } catch (e) {
      alert("Error de conexión.");
    }
  };

  const openEditLicenseModal = (lic: Licencia) => {
    setEditingLicense(lic);
    setFormSoftware(lic.software);
    setFormCorreo(lic.correo_cuenta);
    setFormContrasena(lic.contrasena);
    setFormCliente(lic.nombre_cliente);
    setFormTelefono(lic.telefono || "");
    setFormFechaInicio(lic.fecha_inicio ? lic.fecha_inicio.substring(0, 10) : "");
    setFormFechaFin(lic.fecha_fin ? lic.fecha_fin.substring(0, 10) : "");
    setFormObservaciones(lic.observaciones || "");
    setShowLicenseModal(true);
  };

  const closeLicenseModal = () => {
    setEditingLicense(null);
    setFormSoftware("");
    setFormCorreo("");
    setFormContrasena("");
    setFormCliente("");
    setFormTelefono("");
    setFormFechaInicio("");
    setFormFechaFin("");
    setFormObservaciones("");
    setShowLicenseModal(false);
  };

  const closeFileModal = () => {
    setFormFileName("");
    setFormFileType("programa");
    setFormFileUrl("");
    setFormFileDesc("");
    setShowFileModal(false);
  };

  // Helper function to format date strings nicely
  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return "Sin fecha";
    const date = new Date(dateStr);
    return date.toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // Check if a license is expired or expires in <= 10 days
  const getLicenseUrgency = (dateStr: string | null) => {
    if (!dateStr) return "ok";
    const expiration = new Date(dateStr);
    const today = new Date();
    const diffTime = expiration.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return "expired";
    if (diffDays <= 10) return "warning";
    return "ok";
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <span className="w-8 h-8 border-4 border-slate-200 border-t-red-600 rounded-full animate-spin"></span>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 font-headline">
        <div className="text-center">
          <p className="text-on-surface mb-2 font-bold">Redirigiendo al inicio de sesión...</p>
          <span className="text-xs text-slate-500">Debe estar autenticado para acceder.</span>
        </div>
      </div>
    );
  }

  // Filter lists based on search bar
  const filteredLicencias = licencias.filter((l) =>
    l.nombre_cliente.toLowerCase().includes(searchQuery.toLowerCase()) ||
    l.software.toLowerCase().includes(searchQuery.toLowerCase()) ||
    l.correo_cuenta.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredArchivos = archivos.filter((a) =>
    a.nombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (a.descripcion && a.descripcion.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Group files into categories
  const fileCountByType = (type: string) => archivos.filter(a => a.tipo === type).length;

  return (
    <div className="bg-slate-50 min-h-screen text-on-surface font-headline overflow-hidden flex">
      
      {/* SideNavBar - Clean Deep Slate & Crimson Dark Theme */}
      <aside className="bg-slate-900 h-screen w-64 left-0 top-0 fixed shadow-lg flex flex-col py-6 z-50 text-white">
        <div className="px-6 mb-8 flex items-center gap-3">
          <DellcomLogo className="w-10 h-10" />
          <div>
            <h1 className="text-lg font-bold tracking-tight text-white">DELLCOM SAC</h1>
            <p className="text-[10px] text-red-500 font-bold uppercase tracking-widest leading-none">Enterprise Admin</p>
          </div>
        </div>
        
        <nav className="flex-1 space-y-1">
          <button 
            onClick={() => { setActiveTab("licenses"); setSearchQuery(""); }}
            className={`w-full flex items-center gap-3 px-6 py-3.5 transition-colors duration-200 ${
              activeTab === "licenses"
                ? "text-white font-bold border-l-4 border-red-600 bg-red-600/10"
                : "text-slate-400 hover:text-white hover:bg-slate-800"
            }`}
          >
            <span className="material-symbols-outlined text-[20px]">verified_user</span>
            <span className="text-sm">Gestión de Licencias</span>
          </button>
          
          <button 
            onClick={() => { setActiveTab("files"); setSearchQuery(""); }}
            className={`w-full flex items-center gap-3 px-6 py-3.5 transition-colors duration-200 ${
              activeTab === "files"
                ? "text-white font-bold border-l-4 border-red-600 bg-red-600/10"
                : "text-slate-400 hover:text-white hover:bg-slate-800"
            }`}
          >
            <span className="material-symbols-outlined text-[20px]">folder_open</span>
            <span className="text-sm">Archivos y Drivers</span>
          </button>

          <button 
            onClick={() => { setActiveTab("products"); setSearchQuery(""); }}
            className={`w-full flex items-center gap-3 px-6 py-3.5 transition-colors duration-200 ${
              activeTab === "products"
                ? "text-white font-bold border-l-4 border-red-600 bg-red-600/10"
                : "text-slate-400 hover:text-white hover:bg-slate-800"
            }`}
          >
            <span className="material-symbols-outlined text-[20px]">inventory_2</span>
            <span className="text-sm">Catálogo de Suministros</span>
          </button>
        </nav>

        {/* Support & Logout links in sidebar footer */}
        <div className="mt-auto border-t border-slate-800 pt-4 space-y-1">
          <Link href="/" className="flex items-center gap-3 text-slate-400 hover:text-white px-6 py-3 hover:bg-slate-800 transition-colors">
            <span className="material-symbols-outlined text-[20px]">public</span>
            <span className="text-sm">Ver Web Pública</span>
          </Link>
          <button 
            onClick={() => signOut({ callbackUrl: "/admin/login" })}
            className="w-full flex items-center gap-3 text-slate-400 hover:text-red-500 px-6 py-3 hover:bg-slate-800 transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">logout</span>
            <span className="text-sm">Cerrar Sesión</span>
          </button>
        </div>
      </aside>

      {/* TopAppBar - Sleek, Blur Glass effect */}
      <div className="flex-1 flex flex-col min-w-0 pl-64">
        <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 flex justify-between items-center w-full h-16 px-8 sticky top-0 z-40">
          
          {/* Dynamic Search Bar */}
          <div className="flex items-center gap-6 w-full max-w-md">
            <div className="relative w-full">
              <span className="absolute inset-y-0 left-3 flex items-center text-slate-400">
                <span className="material-symbols-outlined text-[20px]">search</span>
              </span>
              <input 
                className="w-full bg-slate-100 border-none rounded-xl pl-10 pr-4 py-2 text-xs focus:ring-1 focus:ring-red-600 focus:outline-none transition-all placeholder:text-slate-500" 
                placeholder={
                  activeTab === "licenses" 
                    ? "Buscar licencias por cliente, software..." 
                    : activeTab === "files"
                    ? "Buscar archivos y manuales..."
                    : "Buscar productos..."
                } 
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          
          {/* User Profile dropdown panel */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-xs font-bold text-on-surface">{session.user?.name || "Usuario Dellcom"}</p>
                <p className="text-[9px] text-red-500 font-bold uppercase tracking-wider">{(session.user as any).role || "Técnico"}</p>
              </div>
              <div className="w-8 h-8 rounded-full bg-red-600 text-white flex items-center justify-center font-bold text-xs uppercase shadow-inner">
                {session.user?.name ? session.user.name.substring(0, 2) : "US"}
              </div>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="p-8 overflow-y-auto h-[calc(100vh-64px)] custom-scrollbar">
          
          {/* Quick Stats Banner (Customized clear Slate & Red style for 2026) */}
          <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white border border-slate-200/80 p-5 rounded-2xl shadow-sm flex items-center justify-between">
              <div>
                <span className="text-slate-500 text-[11px] font-bold uppercase tracking-wider">Licencias Activas</span>
                <h3 className="text-2xl font-black text-on-surface mt-1">{licencias.filter(l => l.estado === "activo").length}</h3>
              </div>
              <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
                <span className="material-symbols-outlined text-2xl">verified_user</span>
              </div>
            </div>

            <div className="bg-white border border-slate-200/80 p-5 rounded-2xl shadow-sm flex items-center justify-between">
              <div>
                <span className="text-slate-500 text-[11px] font-bold uppercase tracking-wider">Controladores & Drivers</span>
                <h3 className="text-2xl font-black text-on-surface mt-1">{archivos.length} archivos</h3>
              </div>
              <div className="p-3 bg-red-50 text-red-600 rounded-xl">
                <span className="material-symbols-outlined text-2xl">folder_zip</span>
              </div>
            </div>

            <div className="bg-white border border-slate-200/80 p-5 rounded-2xl shadow-sm flex items-center justify-between">
              <div>
                <span className="text-slate-500 text-[11px] font-bold uppercase tracking-wider">Alertas de Vencimiento</span>
                <h3 className="text-2xl font-black text-red-600 mt-1">
                  {licencias.filter(l => getLicenseUrgency(l.fecha_fin) !== "ok").length} críticas
                </h3>
              </div>
              <div className="p-3 bg-red-100 text-red-700 rounded-xl">
                <span className="material-symbols-outlined text-2xl">error</span>
              </div>
            </div>
          </section>

          {/* TAB 1: License Management */}
          {activeTab === "licenses" && (
            <section className="animate-fade-in-up">
              <div className="flex justify-between items-end mb-6">
                <div>
                  <h2 className="text-xl font-bold text-on-surface">Gestión de Licencias de Software</h2>
                  <p className="text-xs text-slate-500 mt-0.5">Control centralizado de suscripciones, cuentas de correo y vigencias de clientes.</p>
                </div>
                <button 
                  onClick={() => setShowLicenseModal(true)}
                  className="bg-red-600 hover:bg-red-700 text-white text-xs font-bold px-5 py-3 rounded-xl transition-all active:scale-95 shadow-md shadow-red-600/10 flex items-center gap-2"
                >
                  <span className="material-symbols-outlined text-base">add</span>
                  Registrar Licencia
                </button>
              </div>

              {/* Licenses Data Table */}
              <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200">
                        <th className="px-6 py-3.5 text-xs font-bold text-slate-500 uppercase tracking-wider">Cliente</th>
                        <th className="px-6 py-3.5 text-xs font-bold text-slate-500 uppercase tracking-wider">Software</th>
                        <th className="px-6 py-3.5 text-xs font-bold text-slate-500 uppercase tracking-wider">Cuenta Correo</th>
                        <th className="px-6 py-3.5 text-xs font-bold text-slate-500 uppercase tracking-wider">Vencimiento</th>
                        <th className="px-6 py-3.5 text-xs font-bold text-slate-500 uppercase tracking-wider">Estado</th>
                        <th className="px-6 py-3.5 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Acciones</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredLicencias.length > 0 ? (
                        filteredLicencias.map((lic) => {
                          const urgency = getLicenseUrgency(lic.fecha_fin);
                          const isWarning = urgency === "warning" || urgency === "expired";
                          
                          return (
                            <tr 
                              key={lic.id} 
                              className={`transition-colors hover:bg-slate-50/50 ${
                                urgency === "expired" 
                                  ? "bg-red-500/5 border-l-4 border-red-600" 
                                  : urgency === "warning"
                                  ? "bg-orange-500/5 border-l-4 border-orange-500"
                                  : ""
                              }`}
                            >
                              <td className="px-6 py-4 font-semibold text-sm text-on-surface">{lic.nombre_cliente}</td>
                              <td className="px-6 py-4 text-xs text-slate-600 font-semibold">{lic.software}</td>
                              <td className="px-6 py-4 text-xs text-slate-500">{lic.correo_cuenta}</td>
                              <td className={`px-6 py-4 text-xs font-bold ${isWarning ? "text-red-600" : "text-slate-500"}`}>
                                {formatDate(lic.fecha_fin)}
                              </td>
                              <td className="px-6 py-4">
                                {urgency === "expired" ? (
                                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-100 text-red-800 text-[10px] font-extrabold uppercase tracking-wide border border-red-200">
                                    <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse"></span>
                                    Vencido
                                  </span>
                                ) : urgency === "warning" ? (
                                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-100 text-orange-800 text-[10px] font-extrabold uppercase tracking-wide border border-orange-200">
                                    <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse"></span>
                                    Por Vencer
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-extrabold uppercase tracking-wide border border-emerald-200">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                                    Activo
                                  </span>
                                )}
                              </td>
                              <td className="px-6 py-4 text-right space-x-2">
                                <button 
                                  onClick={() => openEditLicenseModal(lic)}
                                  className="text-slate-400 hover:text-red-600 p-1 transition-colors"
                                  title="Editar"
                                >
                                  <span className="material-symbols-outlined text-[18px]">edit</span>
                                </button>
                                <button 
                                  onClick={() => handleDeleteLicense(lic.id)}
                                  className="text-slate-400 hover:text-red-700 p-1 transition-colors"
                                  title="Eliminar"
                                >
                                  <span className="material-symbols-outlined text-[18px]">delete</span>
                                </button>
                              </td>
                            </tr>
                          );
                        })
                      ) : (
                        <tr>
                          <td colSpan={6} className="px-6 py-12 text-center text-xs text-slate-500">
                            No se encontraron licencias registradas.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </section>
          )}

          {/* TAB 2: Files & Drivers Repository */}
          {activeTab === "files" && (
            <section className="animate-fade-in-up">
              <div className="flex justify-between items-end mb-6">
                <div>
                  <h2 className="text-xl font-bold text-on-surface">Repositorio de Archivos y Drivers Técnicos</h2>
                  <p className="text-xs text-slate-500 mt-0.5">Gestión de recursos, manuales, parches e instaladores de software.</p>
                </div>
                <button 
                  onClick={() => setShowFileModal(true)}
                  className="bg-red-600 hover:bg-red-700 text-white text-xs font-bold px-5 py-3 rounded-xl transition-all active:scale-95 shadow-md shadow-red-600/10 flex items-center gap-2"
                >
                  <span className="material-symbols-outlined text-base">cloud_upload</span>
                  Registrar Recurso
                </button>
              </div>

              {/* Folders Summary Row */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm flex items-center gap-4">
                  <div className="bg-red-50 text-red-600 p-3 rounded-xl">
                    <span className="material-symbols-outlined text-2xl">laptop_mac</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-on-surface">Programas (.exe)</h4>
                    <p className="text-xs text-slate-500 mt-0.5">{fileCountByType("programa")} archivos</p>
                  </div>
                </div>

                <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm flex items-center gap-4">
                  <div className="bg-red-50 text-red-600 p-3 rounded-xl">
                    <span className="material-symbols-outlined text-2xl">memory</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-on-surface">Controladores</h4>
                    <p className="text-xs text-slate-500 mt-0.5">{fileCountByType("driver")} drivers</p>
                  </div>
                </div>

                <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm flex items-center gap-4">
                  <div className="bg-red-50 text-red-600 p-3 rounded-xl">
                    <span className="material-symbols-outlined text-2xl">description</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-on-surface">Planillas Excel</h4>
                    <p className="text-xs text-slate-500 mt-0.5">{fileCountByType("excel")} documentos</p>
                  </div>
                </div>

                <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm flex items-center gap-4">
                  <div className="bg-red-50 text-red-600 p-3 rounded-xl">
                    <span className="material-symbols-outlined text-2xl">link</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-on-surface">Enlaces Útiles</h4>
                    <p className="text-xs text-slate-500 mt-0.5">{fileCountByType("link")} links</p>
                  </div>
                </div>
              </div>

              {/* Files Table List */}
              <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200">
                        <th className="px-6 py-3.5 text-xs font-bold text-slate-500 uppercase tracking-wider">Nombre</th>
                        <th className="px-6 py-3.5 text-xs font-bold text-slate-500 uppercase tracking-wider">Tipo</th>
                        <th className="px-6 py-3.5 text-xs font-bold text-slate-500 uppercase tracking-wider">URL / Enlace</th>
                        <th className="px-6 py-3.5 text-xs font-bold text-slate-500 uppercase tracking-wider">Fecha Registro</th>
                        <th className="px-6 py-3.5 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Acciones</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredArchivos.length > 0 ? (
                        filteredArchivos.map((file) => (
                          <tr key={file.id} className="hover:bg-slate-50/50 transition-colors">
                            <td className="px-6 py-4">
                              <div>
                                <span className="font-semibold text-sm text-on-surface block">{file.nombre}</span>
                                {file.descripcion && (
                                  <span className="text-xs text-slate-500 leading-none">{file.descripcion}</span>
                                )}
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <span className="inline-block px-2.5 py-1 rounded bg-slate-100 text-slate-700 text-[10px] font-bold uppercase tracking-wider">
                                {file.tipo}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-xs text-red-600 font-semibold max-w-[200px] truncate">
                              <a href={file.url_archivo} target="_blank" rel="noopener noreferrer" className="hover:underline flex items-center gap-1">
                                <span className="material-symbols-outlined text-sm">open_in_new</span>
                                {file.url_archivo}
                              </a>
                            </td>
                            <td className="px-6 py-4 text-xs text-slate-500">{formatDate(file.fecha_subida)}</td>
                            <td className="px-6 py-4 text-right">
                              <button 
                                onClick={() => handleDeleteFile(file.id)}
                                className="text-slate-400 hover:text-red-700 p-1 transition-colors"
                              >
                                <span className="material-symbols-outlined text-[18px]">delete</span>
                              </button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={5} className="px-6 py-12 text-center text-xs text-slate-500">
                            No se encontraron archivos registrados en el repositorio.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </section>
          )}

          {/* TAB 3: Product Catalog View */}
          {activeTab === "products" && (
            <section className="animate-fade-in-up">
              <div className="flex justify-between items-end mb-6">
                <div>
                  <h2 className="text-xl font-bold text-on-surface">Productos del Catálogo Web</h2>
                  <p className="text-xs text-slate-500 mt-0.5">Control de ribbons, tintas, tarjetas y repuestos mostrados en el catálogo virtual.</p>
                </div>
              </div>

              {/* Simple Products List */}
              <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200">
                        <th className="px-6 py-3.5 text-xs font-bold text-slate-500 uppercase tracking-wider">Producto</th>
                        <th className="px-6 py-3.5 text-xs font-bold text-slate-500 uppercase tracking-wider">Precio</th>
                        <th className="px-6 py-3.5 text-xs font-bold text-slate-500 uppercase tracking-wider">Descripción</th>
                        <th className="px-6 py-3.5 text-xs font-bold text-slate-500 uppercase tracking-wider">Estado</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {productos.length > 0 ? (
                        productos.map((prod) => (
                          <tr key={prod.id} className="hover:bg-slate-50/50 transition-colors">
                            <td className="px-6 py-4 font-semibold text-sm text-on-surface">{prod.nombre}</td>
                            <td className="px-6 py-4 text-xs font-bold text-red-600">S/ {Number(prod.precio).toFixed(2)}</td>
                            <td className="px-6 py-4 text-xs text-slate-500 max-w-xs truncate">{prod.descripcion || "Sin descripción"}</td>
                            <td className="px-6 py-4">
                              {prod.activo ? (
                                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold uppercase tracking-wider border border-emerald-200">
                                  Visible en Web
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[10px] font-bold uppercase tracking-wider border border-slate-200">
                                  Oculto
                                </span>
                              )}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={4} className="px-6 py-12 text-center text-xs text-slate-500">
                            No hay productos registrados en el catálogo.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </section>
          )}

        </main>
      </div>

      {/* MODAL 1: Create or Edit License */}
      {showLicenseModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-xl shadow-2xl relative overflow-hidden">
            <header className="px-8 py-5 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h3 className="font-bold text-base text-on-surface">
                {editingLicense ? "Editar Licencia de Cliente" : "Registrar Nueva Licencia"}
              </h3>
              <button onClick={closeLicenseModal} className="text-slate-400 hover:text-slate-700 transition-colors">
                <span className="material-symbols-outlined">close</span>
              </button>
            </header>

            <form onSubmit={handleCreateOrUpdateLicense} className="p-8 space-y-4 max-h-[70vh] overflow-y-auto custom-scrollbar">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Nombre del Cliente</label>
                  <input 
                    type="text" 
                    required
                    value={formCliente}
                    onChange={(e) => setFormCliente(e.target.value)}
                    placeholder="Corporación S.A.C."
                    className="w-full bg-slate-50 border border-slate-200 focus:border-red-600 focus:ring-1 focus:ring-red-600 focus:outline-none rounded-xl px-4 py-3 text-sm transition-all"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Teléfono Cliente</label>
                  <input 
                    type="text" 
                    value={formTelefono}
                    onChange={(e) => setFormTelefono(e.target.value)}
                    placeholder="+51 999 999 999"
                    className="w-full bg-slate-50 border border-slate-200 focus:border-red-600 focus:ring-1 focus:ring-red-600 focus:outline-none rounded-xl px-4 py-3 text-sm transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Software de la Licencia</label>
                  <input 
                    type="text" 
                    required
                    value={formSoftware}
                    onChange={(e) => setFormSoftware(e.target.value)}
                    placeholder="Windows 11 Professional"
                    className="w-full bg-slate-50 border border-slate-200 focus:border-red-600 focus:ring-1 focus:ring-red-600 focus:outline-none rounded-xl px-4 py-3 text-sm transition-all"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Correo Electrónico Cuenta</label>
                  <input 
                    type="email" 
                    required
                    value={formCorreo}
                    onChange={(e) => setFormCorreo(e.target.value)}
                    placeholder="soporte@cliente.com"
                    className="w-full bg-slate-50 border border-slate-200 focus:border-red-600 focus:ring-1 focus:ring-red-600 focus:outline-none rounded-xl px-4 py-3 text-sm transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Contraseña de la Cuenta / Clave Licencia</label>
                <input 
                  type="text" 
                  required
                  value={formContrasena}
                  onChange={(e) => setFormContrasena(e.target.value)}
                  placeholder="Clave o contraseña de acceso"
                  className="w-full bg-slate-50 border border-slate-200 focus:border-red-600 focus:ring-1 focus:ring-red-600 focus:outline-none rounded-xl px-4 py-3 text-sm transition-all font-mono"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Fecha de Inicio</label>
                  <input 
                    type="date" 
                    required
                    value={formFechaInicio}
                    onChange={(e) => setFormFechaInicio(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 focus:border-red-600 focus:ring-1 focus:ring-red-600 focus:outline-none rounded-xl px-4 py-3 text-sm transition-all"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Fecha de Vencimiento</label>
                  <input 
                    type="date" 
                    value={formFechaFin}
                    onChange={(e) => setFormFechaFin(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 focus:border-red-600 focus:ring-1 focus:ring-red-600 focus:outline-none rounded-xl px-4 py-3 text-sm transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Observaciones / Notas adicionales</label>
                <textarea 
                  value={formObservaciones}
                  onChange={(e) => setFormObservaciones(e.target.value)}
                  placeholder="Detalles del acuerdo, cantidad de PCs, etc."
                  rows={3}
                  className="w-full bg-slate-50 border border-slate-200 focus:border-red-600 focus:ring-1 focus:ring-red-600 focus:outline-none rounded-xl px-4 py-3 text-sm transition-all"
                />
              </div>

              <footer className="pt-4 border-t border-slate-100 flex justify-end gap-3">
                <button 
                  type="button" 
                  onClick={closeLicenseModal}
                  className="px-5 py-3 border border-slate-200 hover:bg-slate-50 rounded-xl text-xs font-bold transition-all"
                >
                  Cancelar
                </button>
                <button 
                  type="submit" 
                  className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold transition-all active:scale-95 shadow-md shadow-red-600/10"
                >
                  {editingLicense ? "Actualizar Cambios" : "Guardar Licencia"}
                </button>
              </footer>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: Create File Record */}
      {showFileModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-lg shadow-2xl relative overflow-hidden">
            <header className="px-8 py-5 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h3 className="font-bold text-base text-on-surface">Registrar Nuevo Recurso / Driver</h3>
              <button onClick={closeFileModal} className="text-slate-400 hover:text-slate-700 transition-colors">
                <span className="material-symbols-outlined">close</span>
              </button>
            </header>

            <form onSubmit={handleCreateFile} className="p-8 space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Nombre del Recurso</label>
                <input 
                  type="text" 
                  required
                  value={formFileName}
                  onChange={(e) => setFormFileName(e.target.value)}
                  placeholder="Driver de Impresora Zebra GK420t"
                  className="w-full bg-slate-50 border border-slate-200 focus:border-red-600 focus:ring-1 focus:ring-red-600 focus:outline-none rounded-xl px-4 py-3 text-sm transition-all"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Tipo de Recurso</label>
                  <select 
                    value={formFileType}
                    onChange={(e) => setFormFileType(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 focus:border-red-600 focus:ring-1 focus:ring-red-600 focus:outline-none rounded-xl px-4 py-3 text-sm transition-all"
                  >
                    <option value="programa">Programa (.exe)</option>
                    <option value="driver">Controlador (Driver)</option>
                    <option value="excel">Documento / Excel</option>
                    <option value="link">Enlace / Link Útil</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">URL / Link de Descarga</label>
                  <input 
                    type="url" 
                    required
                    value={formFileUrl}
                    onChange={(e) => setFormFileUrl(e.target.value)}
                    placeholder="https://drive.google.com/..."
                    className="w-full bg-slate-50 border border-slate-200 focus:border-red-600 focus:ring-1 focus:ring-red-600 focus:outline-none rounded-xl px-4 py-3 text-sm transition-all font-mono text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Descripción corta</label>
                <textarea 
                  value={formFileDesc}
                  onChange={(e) => setFormFileDesc(e.target.value)}
                  placeholder="Parche para Win 10/11, configurar baudrate a 9600..."
                  rows={3}
                  className="w-full bg-slate-50 border border-slate-200 focus:border-red-600 focus:ring-1 focus:ring-red-600 focus:outline-none rounded-xl px-4 py-3 text-sm transition-all"
                />
              </div>

              <footer className="pt-4 border-t border-slate-100 flex justify-end gap-3">
                <button 
                  type="button" 
                  onClick={closeFileModal}
                  className="px-5 py-3 border border-slate-200 hover:bg-slate-50 rounded-xl text-xs font-bold transition-all"
                >
                  Cancelar
                </button>
                <button 
                  type="submit" 
                  className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold transition-all active:scale-95 shadow-md shadow-red-600/10"
                >
                  Guardar Recurso
                </button>
              </footer>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
