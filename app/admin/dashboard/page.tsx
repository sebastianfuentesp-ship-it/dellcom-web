/**
 * Panel de administración principal: /admin/dashboard
 * Client Component que consume las APIs internas con fetch del lado del cliente.
 * Módulos incluidos (gestionados con tabs):
 *  - Licencias de software (CRUD completo)
 *  - Productos del catálogo (CRUD + upload de imagen a S3/local)
 *  - Archivos técnicos (CRUD)
 *  - Servicios ofrecidos (CRUD)
 *  - Trabajos del portfolio (CRUD + upload de imagen)
 *  - Categorías de productos (CRUD)
 *  - Mensajes de contacto (lectura + marcar leído + eliminar)
 *  - Gestión de usuarios (solo admin): CRUD + activar/desactivar
 * El acceso se protege en dos niveles: middleware RBAC y useSession() client-side.
 */
"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, useEffect, useMemo } from "react";
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

interface Categoria {
  id: number;
  nombre: string;
  activo: boolean;
}


interface Producto {
  id: number;
  nombre: string;
  precio: number;
  descripcion: string | null;
  activo: boolean;
  id_categoria: number;
  categoria?: {
    id: number;
    nombre: string;
  };
  imagen_url: string | null;
}

interface MensajeContacto {
  id: number;
  nombre: string;
  correo: string;
  telefono: string | null;
  asunto: string;
  mensaje: string;
  leido: boolean;
  fecha: string;
}

interface Usuario {
  id: number;
  nombre: string;
  usuario: string;
  email: string;
  rol: string;
  activo: boolean;
  createdAt: string;
}

interface Servicio {
  id: number;
  nombre: string;
  descripcion: string;
  icono_url: string | null;
  activo: boolean;
}

interface TrabajoRealizado {
  id: number;
  id_servicio: number | null;
  servicio?: Servicio | null;
  titulo: string;
  descripcion: string | null;
  imagen_url: string;
  fecha: string;
}


// Vector SVG Dellcom Logo Component
function DellcomLogo({ className = "w-10 h-10" }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={className} xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="50" r="46" stroke="#ff0000" strokeWidth="3" fill="none" opacity="0.85" />
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
      <line x1="50" y1="18" x2="50" y2="82" stroke="#ff0000" strokeWidth="2.5" strokeDasharray="3 3" />
      <path 
        d="M 52 24 L 66 24 L 66 32 M 52 38 L 74 38 L 74 46 M 52 50 L 64 50 L 72 58 M 52 64 L 72 64 M 52 74 L 64 74 L 64 68" 
        stroke="#ff0000" 
        strokeWidth="3.5" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        fill="none" 
      />
      <circle cx="66" cy="32" r="3" fill="#ff0000" />
      <circle cx="74" cy="46" r="3" fill="#ff0000" />
      <circle cx="72" cy="58" r="3" fill="#ff0000" />
      <circle cx="72" cy="64" r="3" fill="#ff0000" />
      <circle cx="64" cy="68" r="3" fill="#ff0000" />
    </svg>
  );
}

const detectFileType = (name: string, url: string): "programa" | "driver" | "excel" | "link" => {
  const n = name.toLowerCase();
  const u = url.toLowerCase();

  // 1. PDF / Excel / Plantillas (tipo 'excel' en la base de datos)
  if (
    n.endsWith(".pdf") || u.includes(".pdf") || n.includes(" pdf") ||
    n.endsWith(".xlsx") || n.endsWith(".xls") || n.endsWith(".csv") ||
    u.includes(".xlsx") || u.includes(".xls") || u.includes(".csv") ||
    n.includes("excel") || n.includes("planilla") || n.includes("documento") || n.includes("ficha tecnica")
  ) {
    return "excel";
  }

  // 2. Controladores / Drivers
  if (
    n.includes("driver") || n.includes("controlador") || n.includes("drv") ||
    u.includes("driver") || u.includes("controlador") || u.includes("drv") ||
    n.endsWith(".inf") || u.includes(".inf")
  ) {
    return "driver";
  }

  // 3. Programas / Utilidades
  if (
    n.endsWith(".exe") || n.endsWith(".msi") || u.includes(".exe") || u.includes(".msi") ||
    n.includes("setup") || n.includes("install") || n.includes("utility") || n.includes("utilities") ||
    n.includes("programa") || n.includes("aplicacion") || n.includes("anydesk") || n.includes("soporte")
  ) {
    return "programa";
  }

  // 4. Por defecto, si es un link útil o no cumple con lo anterior
  if (u.startsWith("http://") || u.startsWith("https://")) {
    return "link";
  }

  return "programa"; // Valor por defecto seguro
};

export default function AdminDashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // Navigation and data states
  const [activeTab, setActiveTab] = useState("overview"); // overview, licenses, files, products, messages, users, services, portfolio, categories

  // Mobile/tablet sidebar visibility (sidebar is always visible on lg+ screens)
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Dark mode state
  const [darkMode, setDarkMode] = useState(false);

  // Sidebar collapsible groups — all closed by default
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({
    clientes: false, inventario: false, contenido: false, sistema: false,
  });
  const toggleGroup = (key: string) =>
    setOpenGroups((prev) => ({ ...prev, [key]: !prev[key] }));

  // Section guide visibility — toggled via the ? button in the header
  const [guideVisible, setGuideVisible] = useState(false);
  const [guideMode, setGuideMode] = useState<"checklist" | "stepper">("checklist");
  const [guideStepIndex, setGuideStepIndex] = useState<Record<string, number>>({});
  const [completedSteps, setCompletedSteps] = useState<Record<string, boolean[]>>({});

  // Load theme preference on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedMode = localStorage.getItem("adminDarkMode");
      if (savedMode === "true") {
        setDarkMode(true);
      }
    }
  }, []);

  const toggleDarkMode = () => {
    const nextMode = !darkMode;
    setDarkMode(nextMode);
    if (typeof window !== "undefined") {
      localStorage.setItem("adminDarkMode", String(nextMode));
    }
  };
  const [licencias, setLicencias] = useState<Licencia[]>([]);
  const [archivos, setArchivos] = useState<ArchivoTecnico[]>([]);
  const [productos, setProductos] = useState<Producto[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [mensajes, setMensajes] = useState<MensajeContacto[]>([]);
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [servicios, setServicios] = useState<Servicio[]>([]);
  const [trabajos, setTrabajos] = useState<TrabajoRealizado[]>([]);
  
  // Search & Modals state
  const [searchQuery, setSearchQuery] = useState("");
  const [showLicenseModal, setShowLicenseModal] = useState(false);
  const [showFileModal, setShowFileModal] = useState(false);
  const [showProductModal, setShowProductModal] = useState(false);
  const [showUserModal, setShowUserModal] = useState(false);
  const [showServiceModal, setShowServiceModal] = useState(false);
  const [showPortfolioModal, setShowPortfolioModal] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);

  const [editingLicense, setEditingLicense] = useState<Licencia | null>(null);
  const [editingProduct, setEditingProduct] = useState<Producto | null>(null);
  const [editingUser, setEditingUser] = useState<Usuario | null>(null);
  const [editingService, setEditingService] = useState<Servicio | null>(null);
  const [editingPortfolio, setEditingPortfolio] = useState<TrabajoRealizado | null>(null);
  const [editingCategory, setEditingCategory] = useState<Categoria | null>(null);

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

  // Form states for Product Creation/Editing
  const [formProductName, setFormProductName] = useState("");
  const [formProductPrice, setFormProductPrice] = useState("");
  const [formProductDesc, setFormProductDesc] = useState("");
  const [formProductCategory, setFormProductCategory] = useState("");
  const [formProductImages, setFormProductImages] = useState<string[]>([""]);
  const [uploadingProductIdx, setUploadingProductIdx] = useState<number | null>(null);
  const [formProductActive, setFormProductActive] = useState(true);
  const [draggingProductImgIdx, setDraggingProductImgIdx] = useState<number | null>(null);
  const [draggingPortfolioMain, setDraggingPortfolioMain] = useState(false);
  const [draggingPortfolioExtraIdx, setDraggingPortfolioExtraIdx] = useState<number | null>(null);

  // Form states for User CRUD (Admin)
  const [formUserNombre, setFormUserNombre] = useState("");
  const [formUserUsuario, setFormUserUsuario] = useState("");
  const [formUserEmail, setFormUserEmail] = useState("");
  const [formUserContrasena, setFormUserContrasena] = useState("");
  const [formUserRol, setFormUserRol] = useState("tecnico"); // admin, tecnico, vendedor

  // Form states for Service CRUD
  const [formServiceName, setFormServiceName] = useState("");
  const [formServiceDesc, setFormServiceDesc] = useState("");
  const [formServiceIcon, setFormServiceIcon] = useState("laptop_mac");
  const [formServiceActive, setFormServiceActive] = useState(true);

  // Form states for Portfolio CRUD
  const [formPortfolioTitle, setFormPortfolioTitle] = useState("");
  const [formPortfolioDesc, setFormPortfolioDesc] = useState("");
  const [formPortfolioImgUrl, setFormPortfolioImgUrl] = useState("");
  const [formPortfolioExtraImgs, setFormPortfolioExtraImgs] = useState<string[]>([]);
  const [formPortfolioServiceId, setFormPortfolioServiceId] = useState("");
  const [uploadingPortfolioExtraIdx, setUploadingPortfolioExtraIdx] = useState<number | null>(null);

  // Form states for Category CRUD
  const [formCategoryName, setFormCategoryName] = useState("");
  const [formCategoryActive, setFormCategoryActive] = useState(true);

  const [uploading, setUploading] = useState(false);

  // Mensaje de contacto seleccionado para ver el texto completo en un modal
  const [selectedMensaje, setSelectedMensaje] = useState<MensajeContacto | null>(null);

  // Permisos por rol: admin tiene acceso total; tecnico y vendedor según su área de trabajo
  const userRole = (session?.user as any)?.role as "admin" | "tecnico" | "vendedor" | undefined;
  const isAdmin = userRole === "admin";
  const canEditCatalogo = isAdmin || userRole === "vendedor"; // Productos, Categorías, Servicios
  const canEditTecnico = isAdmin || userRole === "tecnico"; // Portafolio, Archivos/Drivers
  const canDelete = isAdmin; // Borrar queda exclusivo de admin en todos los módulos

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
      fetchCategorias();
      fetchMensajes();
      fetchServicios();
      fetchTrabajos();
      if ((session?.user as any)?.role === "admin") {
        fetchUsuarios();
      }
    }
  }, [status, session]);

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
      const res = await fetch("/api/productos?all=true");
      if (res.ok) setProductos(await res.json());
    } catch (e) {
      console.error(e);
    }
  };

  const fetchCategorias = async () => {
    try {
      const res = await fetch("/api/categorias");
      if (res.ok) setCategorias(await res.json());
    } catch (e) {
      console.error(e);
    }
  };

  const fetchMensajes = async () => {
    try {
      const res = await fetch("/api/admin/contacto");
      if (res.ok) setMensajes(await res.json());
    } catch (e) {
      console.error(e);
    }
  };

  const fetchUsuarios = async () => {
    try {
      const res = await fetch("/api/admin/usuarios");
      if (res.ok) setUsuarios(await res.json());
    } catch (e) {
      console.error(e);
    }
  };

  const fetchServicios = async () => {
    try {
      const res = await fetch("/api/servicios");
      if (res.ok) setServicios(await res.json());
    } catch (e) {
      console.error(e);
    }
  };

  const fetchTrabajos = async () => {
    try {
      const res = await fetch("/api/trabajos");
      if (res.ok) setTrabajos(await res.json());
    } catch (e) {
      console.error(e);
    }
  };

  const handleUploadFile = async (
    e: React.ChangeEvent<HTMLInputElement>,
    target: "product" | "file" | "portfolio" | "portfolio-extra",
    idx?: number
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validación de límite de tamaño (4.5MB) para evitar el error 413 de Vercel en producción
    const MAX_SIZE = 4.5 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      alert(
        `El archivo "${file.name}" supera el límite permitido para carga directa de 4.5MB (Pesa ${(file.size / (1024 * 1024)).toFixed(2)}MB).\n\n` +
        `Para archivos grandes (como drivers o instaladores pesados), se recomienda colocar la URL directa en el campo de enlace superior.`
      );
      e.target.value = ""; // Limpiar el input
      return;
    }

    if (target === "product" && idx !== undefined) {
      setUploadingProductIdx(idx);
    } else if (target === "portfolio-extra" && idx !== undefined) {
      setUploadingPortfolioExtraIdx(idx);
    } else {
      setUploading(true);
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", target === "product" ? "productos" : (target === "portfolio" || target === "portfolio-extra") ? "portfolio" : "uploads");

    try {
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("No se pudo cargar el archivo");

      const data = await res.json();
      if (target === "product" && idx !== undefined) {
        setFormProductImages(prev => prev.map((u, i) => i === idx ? data.url : u));
      } else if (target === "portfolio-extra" && idx !== undefined) {
        setFormPortfolioExtraImgs(prev => prev.map((u, i) => i === idx ? data.url : u));
      } else if (target === "portfolio") {
        setFormPortfolioImgUrl(data.url);
      } else {
        setFormFileUrl(data.url);
        let newName = formFileName;
        if (!formFileName) {
          const cleanName = file.name
            .replace(/\.[^/.]+$/, "") // Remover extensión
            .replace(/[-_]/g, " ") // Reemplazar guiones por espacios
            .split(" ")
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" ");
          setFormFileName(cleanName);
          newName = cleanName;
        }
        const detected = detectFileType(newName, data.url);
        setFormFileType(detected);
      }
      alert("Archivo cargado y guardado fisicamente con exito.");
    } catch (err) {
      console.error(err);
      alert("Error al intentar subir el archivo.");
    } finally {
      if (target === "product") {
        setUploadingProductIdx(null);
      } else if (target === "portfolio-extra") {
        setUploadingPortfolioExtraIdx(null);
      } else {
        setUploading(false);
      }
    }
  };

  const addProductImage = () => setFormProductImages(prev => [...prev, ""]);
  const removeProductImage = (idx: number) => setFormProductImages(prev => prev.filter((_, i) => i !== idx));
  const updateProductImage = (idx: number, url: string) => setFormProductImages(prev => prev.map((u, i) => i === idx ? url : u));

  // Drag & Drop handler for product images
  const handleProductDrop = async (file: File, idx: number) => {
    const MAX_SIZE = 4.5 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      alert(`El archivo "${file.name}" supera el límite de 4.5MB (Pesa ${(file.size / (1024 * 1024)).toFixed(2)}MB).`);
      return;
    }
    if (!file.type.startsWith("image/")) {
      alert("Solo se permiten archivos de imagen (JPG, PNG, WEBP, etc.).");
      return;
    }
    setUploadingProductIdx(idx);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", "productos");
    try {
      const res = await fetch("/api/admin/upload", { method: "POST", body: formData });
      if (!res.ok) throw new Error("Upload failed");
      const data = await res.json();
      setFormProductImages(prev => prev.map((u, i) => i === idx ? data.url : u));
      alert("Imagen cargada con éxito.");
    } catch (err) {
      console.error(err);
      alert("Error al subir la imagen.");
    } finally {
      setUploadingProductIdx(null);
    }
  };

  const handlePortfolioMainDrop = async (file: File) => {
    const MAX_SIZE = 4.5 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      alert(`El archivo "${file.name}" supera el límite de 4.5MB (Pesa ${(file.size / (1024 * 1024)).toFixed(2)}MB).`);
      return;
    }
    if (!file.type.startsWith("image/")) {
      alert("Solo se permiten archivos de imagen (JPG, PNG, WEBP, etc.).");
      return;
    }
    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", "portfolio");
    try {
      const res = await fetch("/api/admin/upload", { method: "POST", body: formData });
      if (!res.ok) throw new Error("Upload failed");
      const data = await res.json();
      setFormPortfolioImgUrl(data.url);
      alert("Imagen cargada con éxito.");
    } catch (err) {
      console.error(err);
      alert("Error al subir la imagen.");
    } finally {
      setUploading(false);
    }
  };

  const handlePortfolioExtraDrop = async (file: File, idx: number) => {
    const MAX_SIZE = 4.5 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      alert(`El archivo "${file.name}" supera el límite de 4.5MB (Pesa ${(file.size / (1024 * 1024)).toFixed(2)}MB).`);
      return;
    }
    if (!file.type.startsWith("image/")) {
      alert("Solo se permiten archivos de imagen (JPG, PNG, WEBP, etc.).");
      return;
    }
    setUploadingPortfolioExtraIdx(idx);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", "portfolio");
    try {
      const res = await fetch("/api/admin/upload", { method: "POST", body: formData });
      if (!res.ok) throw new Error("Upload failed");
      const data = await res.json();
      setFormPortfolioExtraImgs(prev => prev.map((u, i) => i === idx ? data.url : u));
      alert("Imagen cargada con éxito.");
    } catch (err) {
      console.error(err);
      alert("Error al subir la imagen.");
    } finally {
      setUploadingPortfolioExtraIdx(null);
    }
  };

  const toggleMensajeLeido = async (id: number, currentRead: boolean) => {
    try {
      const res = await fetch("/api/admin/contacto", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, leido: !currentRead }),
      });
      if (res.ok) {
        fetchMensajes();
      } else {
        alert("No se pudo actualizar el estado del mensaje.");
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteMensaje = async (id: number) => {
    if (!confirm("¿Esta seguro de eliminar este mensaje?")) return;
    try {
      const res = await fetch(`/api/admin/contacto?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        fetchMensajes();
      } else {
        alert("No se pudo eliminar el mensaje.");
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleCreateOrUpdateUser = async (e: React.FormEvent) => {
    e.preventDefault();

    let userData: any;

    if (editingUser) {
      userData = {
        id: editingUser.id,
        nombre: formUserNombre,
        usuario: formUserUsuario,
        email: formUserEmail,
        rol: formUserRol,
      };
      if (formUserContrasena) userData.contrasena = formUserContrasena;
    } else {
      // Create: backend generates username and temp password
      userData = {
        nombre: formUserNombre,
        email: formUserEmail,
        rol: formUserRol,
      };
    }

    try {
      const method = editingUser ? "PUT" : "POST";
      const res = await fetch("/api/admin/usuarios", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });

      const data = await res.json();

      if (res.ok) {
        alert(
          editingUser
            ? "Usuario actualizado con exito."
            : `Personal registrado. Se ha enviado el usuario y contraseña temporal al correo ${formUserEmail}.`
        );
        fetchUsuarios();
        closeUserModal();
      } else {
        if (data.errors) {
          const errorsStr = Object.entries(data.errors)
            .map(([field, msgs]: any) => `${field}: ${msgs.join(", ")}`)
            .join("\n");
          alert(`Errores de validacion:\n${errorsStr}`);
        } else {
          alert(`Error: ${data.error || "No se pudo guardar el usuario"}`);
        }
      }
    } catch {
      alert("Error de conexion al guardar el usuario.");
    }
  };

  const handleToggleUserStatus = async (id: number, currentStatus: boolean) => {
    try {
      const res = await fetch("/api/admin/usuarios", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, activo: !currentStatus }),
      });
      if (res.ok) {
        fetchUsuarios();
      } else {
        const data = await res.json();
        alert(`Error: ${data.error || "No se pudo cambiar el estado"}`);
      }
    } catch (e) {
      alert("Error de conexion.");
    }
  };

  const openEditUserModal = (user: Usuario) => {
    setEditingUser(user);
    setFormUserNombre(user.nombre);
    setFormUserUsuario(user.usuario);
    setFormUserEmail(user.email);
    setFormUserContrasena("");
    setFormUserRol(user.rol);
    setShowUserModal(true);
  };

  const closeUserModal = () => {
    setEditingUser(null);
    setFormUserNombre("");
    setFormUserUsuario("");
    setFormUserEmail("");
    setFormUserContrasena("");
    setFormUserRol("tecnico");
    setShowUserModal(false);
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

  const handleFileNameChange = (val: string) => {
    setFormFileName(val);
    const detected = detectFileType(val, formFileUrl);
    setFormFileType(detected);
  };

  const handleFileUrlChange = (val: string) => {
    setFormFileUrl(val);
    const detected = detectFileType(formFileName, val);
    setFormFileType(detected);
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

  const handleCreateOrUpdateProduct = async (e: React.FormEvent) => {
    e.preventDefault();

    const productData = {
      nombre: formProductName,
      precio: Number(formProductPrice),
      descripcion: formProductDesc || null,
      id_categoria: Number(formProductCategory),
      imagen_url: formProductImages.filter(u => u.trim()).join("||") || null,
      activo: formProductActive,
    };

    try {
      if (editingProduct) {
        const res = await fetch(`/api/productos/${editingProduct.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(productData),
        });
        if (res.ok) {
          alert("Producto actualizado con éxito");
          fetchProductos();
        } else {
          const err = await res.json();
          alert(`Error: ${err.error || "No se pudo actualizar"}`);
        }
      } else {
        const res = await fetch("/api/productos", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(productData),
        });
        if (res.ok) {
          alert("Producto creado con éxito");
          fetchProductos();
        } else {
          const err = await res.json();
          alert(`Error: ${err.error || "No se pudo crear. Asegúrese de ser Admin."}`);
        }
      }
      closeProductModal();
    } catch (err) {
      alert("Error de conexión al guardar el producto.");
    }
  };

  const handleDeleteProduct = async (id: number) => {
    if (!confirm("¿Está seguro de ocultar/eliminar este producto del catálogo?")) return;
    try {
      const res = await fetch(`/api/productos/${id}`, { method: "DELETE" });
      if (res.ok) {
        alert("Producto eliminado de la web");
        fetchProductos();
      } else {
        const err = await res.json();
        alert(`Error: ${err.error || "No se pudo eliminar"}`);
      }
    } catch (e) {
      alert("Error de conexión.");
    }
  };

  const openEditProductModal = (prod: Producto) => {
    setEditingProduct(prod);
    setFormProductName(prod.nombre);
    setFormProductPrice(String(prod.precio));
    setFormProductDesc(prod.descripcion || "");
    setFormProductCategory(String(prod.id_categoria));
    const imgs = (prod.imagen_url || "").split("||").filter(Boolean);
    setFormProductImages(imgs.length > 0 ? imgs : [""]);
    setFormProductActive(prod.activo);
    setShowProductModal(true);
  };

  const closeProductModal = () => {
    setEditingProduct(null);
    setFormProductName("");
    setFormProductPrice("");
    setFormProductDesc("");
    setFormProductCategory("");
    setFormProductImages([""]);
    setFormProductActive(true);
    setShowProductModal(false);
  };

  // --- SERVICIOS CRUD ---
  const handleCreateOrUpdateService = async (e: React.FormEvent) => {
    e.preventDefault();
    const serviceData = {
      nombre: formServiceName,
      descripcion: formServiceDesc,
      icono_url: formServiceIcon || "laptop_mac",
      activo: formServiceActive,
    };

    try {
      const method = editingService ? "PUT" : "POST";
      const url = editingService ? `/api/servicios/${editingService.id}` : "/api/servicios";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(serviceData),
      });

      if (res.ok) {
        alert(editingService ? "Servicio actualizado con éxito" : "Servicio creado con éxito");
        fetchServicios();
        closeServiceModal();
      } else {
        const err = await res.json();
        alert(`Error: ${err.error || "No se pudo guardar el servicio"}`);
      }
    } catch (e) {
      alert("Error de conexión al guardar el servicio.");
    }
  };

  const handleDeleteService = async (id: number) => {
    if (!confirm("¿Está seguro de ocultar/desactivar este servicio de la web?")) return;
    try {
      const res = await fetch(`/api/servicios/${id}`, { method: "DELETE" });
      if (res.ok) {
        alert("Servicio desactivado");
        fetchServicios();
      } else {
        alert("No se pudo desactivar el servicio");
      }
    } catch (e) {
      alert("Error de conexión.");
    }
  };

  const openEditServiceModal = (srv: Servicio) => {
    setEditingService(srv);
    setFormServiceName(srv.nombre);
    setFormServiceDesc(srv.descripcion);
    setFormServiceIcon(srv.icono_url || "laptop_mac");
    setFormServiceActive(srv.activo);
    setShowServiceModal(true);
  };

  const closeServiceModal = () => {
    setEditingService(null);
    setFormServiceName("");
    setFormServiceDesc("");
    setFormServiceIcon("laptop_mac");
    setFormServiceActive(true);
    setShowServiceModal(false);
  };

  // --- PORTAFOLIO CRUD ---
  const handleCreateOrUpdatePortfolio = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formPortfolioImgUrl) {
      alert("Debe subir una imagen para el trabajo de portafolio.");
      return;
    }

    const allImgs = [formPortfolioImgUrl, ...formPortfolioExtraImgs.filter(u => u.trim())];

    const portfolioData = {
      titulo: formPortfolioTitle,
      descripcion: formPortfolioDesc || null,
      imagen_url: allImgs.join("||"),
      id_servicio: formPortfolioServiceId ? Number(formPortfolioServiceId) : null,
    };

    try {
      const method = editingPortfolio ? "PUT" : "POST";
      const url = editingPortfolio ? `/api/trabajos/${editingPortfolio.id}` : "/api/trabajos";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(portfolioData),
      });

      if (res.ok) {
        alert(editingPortfolio ? "Trabajo actualizado con éxito" : "Trabajo registrado con éxito");
        fetchTrabajos();
        closePortfolioModal();
      } else {
        const err = await res.json();
        alert(`Error: ${err.error || "No se pudo guardar el trabajo"}`);
      }
    } catch (e) {
      alert("Error de conexión al guardar el trabajo.");
    }
  };

  const handleDeletePortfolio = async (id: number) => {
    if (!confirm("¿Está seguro de eliminar permanentemente este trabajo del portafolio?")) return;
    try {
      const res = await fetch(`/api/trabajos/${id}`, { method: "DELETE" });
      if (res.ok) {
        alert("Trabajo eliminado de la web");
        fetchTrabajos();
      } else {
        alert("No se pudo eliminar el trabajo");
      }
    } catch (e) {
      alert("Error de conexión.");
    }
  };

  const openEditPortfolioModal = (job: TrabajoRealizado) => {
    setEditingPortfolio(job);
    setFormPortfolioTitle(job.titulo);
    setFormPortfolioDesc(job.descripcion || "");
    const imgParts = job.imagen_url.split("||").filter(Boolean);
    setFormPortfolioImgUrl(imgParts[0] || "");
    setFormPortfolioExtraImgs(imgParts.slice(1));
    setFormPortfolioServiceId(job.id_servicio ? String(job.id_servicio) : "");
    setShowPortfolioModal(true);
  };

  const closePortfolioModal = () => {
    setEditingPortfolio(null);
    setFormPortfolioTitle("");
    setFormPortfolioDesc("");
    setFormPortfolioImgUrl("");
    setFormPortfolioExtraImgs([]);
    setFormPortfolioServiceId("");
    setShowPortfolioModal(false);
  };

  // --- CATEGORÍAS CRUD ---
  const handleCreateOrUpdateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    const categoryData = {
      nombre: formCategoryName,
      activo: formCategoryActive,
    };

    try {
      const method = editingCategory ? "PUT" : "POST";
      const url = editingCategory ? `/api/categorias/${editingCategory.id}` : "/api/categorias";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(categoryData),
      });

      if (res.ok) {
        alert(editingCategory ? "Categoría actualizada con éxito" : "Categoría creada con éxito");
        fetchCategorias();
        closeCategoryModal();
      } else {
        const err = await res.json();
        alert(`Error: ${err.error || "No se pudo guardar la categoría"}`);
      }
    } catch (e) {
      alert("Error de conexión al guardar la categoría.");
    }
  };

  const handleDeleteCategory = async (id: number) => {
    if (!confirm("¿Está seguro de ocultar/desactivar esta categoría del catálogo?")) return;
    try {
      const res = await fetch(`/api/categorias/${id}`, { method: "DELETE" });
      if (res.ok) {
        alert("Categoría desactivada");
        fetchCategorias();
      } else {
        alert("No se pudo desactivar la categoría");
      }
    } catch (e) {
      alert("Error de conexión.");
    }
  };

  const openEditCategoryModal = (cat: Categoria) => {
    setEditingCategory(cat);
    setFormCategoryName(cat.nombre);
    setFormCategoryActive(cat.activo);
    setShowCategoryModal(true);
  };

  const closeCategoryModal = () => {
    setEditingCategory(null);
    setFormCategoryName("");
    setFormCategoryActive(true);
    setShowCategoryModal(false);
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

  // Must be before early returns to respect Rules of Hooks
  const fileCountByType = (type: string) => archivos.filter(a => a.tipo === type).length;

  const tabStats = useMemo(() => {
    switch (activeTab) {
      case "overview": {
        const activeLicCount = licencias.filter(l => l.estado === "activo").length;
        const now = new Date();
        const messagesThisWeek = mensajes.filter(m => {
          const msgDate = new Date(m.fecha);
          const diffTime = now.getTime() - msgDate.getTime();
          const diffDays = diffTime / (1000 * 60 * 60 * 24);
          return diffDays >= 0 && diffDays <= 7;
        }).length;
        return [
          { label: "Licencias Activas", value: activeLicCount, suffix: "", icon: "verified_user", bg: "bg-emerald-50/10 dark:bg-emerald-500/10", fg: "text-emerald-600", valueCls: "text-on-surface" },
          { label: "Mensajes de la Semana", value: messagesThisWeek, suffix: "", icon: "chat", bg: "bg-blue-50/10 dark:bg-blue-500/10", fg: "text-blue-600", valueCls: "text-on-surface" },
          { label: "Total en Catálogo", value: productos.length, suffix: " productos", icon: "inventory_2", bg: "bg-amber-50/10 dark:bg-amber-500/10", fg: "text-amber-600", valueCls: "text-on-surface" },
        ];
      }
      case "licenses":
        return [
          { label: "Licencias Activas", value: licencias.filter(l => l.estado === "activo").length, suffix: "", icon: "verified_user", bg: "bg-emerald-50", fg: "text-emerald-600", valueCls: "text-on-surface" },
          { label: "Próximas a Vencer", value: licencias.filter(l => getLicenseUrgency(l.fecha_fin) === "warning").length, suffix: "", icon: "schedule", bg: "bg-orange-50", fg: "text-orange-500", valueCls: "text-orange-500" },
          { label: "Alertas Críticas", value: licencias.filter(l => getLicenseUrgency(l.fecha_fin) === "expired").length, suffix: "", icon: "error", bg: "bg-red-100", fg: "text-red-700", valueCls: "text-red-600" },
        ];
      case "files":
        return [
          { label: "Total de Archivos", value: archivos.length, suffix: "", icon: "folder_zip", bg: "bg-red-50", fg: "text-red-600", valueCls: "text-on-surface" },
          { label: "Controladores", value: fileCountByType("driver"), suffix: "", icon: "settings_input_component", bg: "bg-blue-50", fg: "text-blue-600", valueCls: "text-on-surface" },
          { label: "Programas (.exe)", value: fileCountByType("programa"), suffix: "", icon: "install_desktop", bg: "bg-slate-100", fg: "text-slate-500", valueCls: "text-on-surface" },
        ];
      case "products":
        return [
          { label: "Productos Activos", value: productos.filter(p => p.activo).length, suffix: "", icon: "inventory_2", bg: "bg-emerald-50", fg: "text-emerald-600", valueCls: "text-on-surface" },
          { label: "Total en Catálogo", value: productos.length, suffix: "", icon: "storefront", bg: "bg-red-50", fg: "text-red-600", valueCls: "text-on-surface" },
          { label: "Categorías Activas", value: categorias.filter(c => c.activo).length, suffix: "", icon: "local_offer", bg: "bg-slate-100", fg: "text-slate-500", valueCls: "text-on-surface" },
        ];
      case "services":
        return [
          { label: "Servicios Activos", value: servicios.filter(s => s.activo).length, suffix: "", icon: "build", bg: "bg-emerald-50", fg: "text-emerald-600", valueCls: "text-on-surface" },
          { label: "Total Servicios", value: servicios.length, suffix: "", icon: "design_services", bg: "bg-red-50", fg: "text-red-600", valueCls: "text-on-surface" },
          { label: "Trabajos Portafolio", value: trabajos.length, suffix: "", icon: "photo_library", bg: "bg-slate-100", fg: "text-slate-500", valueCls: "text-on-surface" },
        ];
      case "portfolio":
        return [
          { label: "Trabajos Realizados", value: trabajos.length, suffix: "", icon: "photo_library", bg: "bg-red-50", fg: "text-red-600", valueCls: "text-on-surface" },
          { label: "Con Servicio Asociado", value: trabajos.filter(t => t.id_servicio).length, suffix: "", icon: "link", bg: "bg-emerald-50", fg: "text-emerald-600", valueCls: "text-on-surface" },
          { label: "Servicios Disponibles", value: servicios.filter(s => s.activo).length, suffix: "", icon: "build", bg: "bg-slate-100", fg: "text-slate-500", valueCls: "text-on-surface" },
        ];
      case "categories":
        return [
          { label: "Categorías Activas", value: categorias.filter(c => c.activo).length, suffix: "", icon: "local_offer", bg: "bg-emerald-50", fg: "text-emerald-600", valueCls: "text-on-surface" },
          { label: "Total Categorías", value: categorias.length, suffix: "", icon: "category", bg: "bg-red-50", fg: "text-red-600", valueCls: "text-on-surface" },
          { label: "Productos en Catálogo", value: productos.filter(p => p.activo).length, suffix: "", icon: "inventory_2", bg: "bg-slate-100", fg: "text-slate-500", valueCls: "text-on-surface" },
        ];
      case "messages": {
        const unread = mensajes.filter(m => !m.leido).length;
        return [
          { label: "Sin Leer", value: unread, suffix: "", icon: "mark_email_unread", bg: unread > 0 ? "bg-red-100" : "bg-slate-100", fg: unread > 0 ? "text-red-700" : "text-slate-500", valueCls: unread > 0 ? "text-red-600" : "text-on-surface" },
          { label: "Total Mensajes", value: mensajes.length, suffix: "", icon: "mail", bg: "bg-slate-100", fg: "text-slate-500", valueCls: "text-on-surface" },
          { label: "Leídos", value: mensajes.filter(m => m.leido).length, suffix: "", icon: "mark_email_read", bg: "bg-emerald-50", fg: "text-emerald-600", valueCls: "text-on-surface" },
        ];
      }
      case "users":
        return [
          { label: "Personal Activo", value: usuarios.filter(u => u.activo).length, suffix: "", icon: "group", bg: "bg-emerald-50", fg: "text-emerald-600", valueCls: "text-on-surface" },
          { label: "Administradores", value: usuarios.filter(u => u.rol === "admin").length, suffix: "", icon: "admin_panel_settings", bg: "bg-red-50", fg: "text-red-600", valueCls: "text-on-surface" },
          { label: "Técnicos", value: usuarios.filter(u => u.rol === "tecnico").length, suffix: "", icon: "engineering", bg: "bg-slate-100", fg: "text-slate-500", valueCls: "text-on-surface" },
        ];
      default:
        return [
          { label: "Licencias Activas", value: licencias.filter(l => l.estado === "activo").length, suffix: "", icon: "verified_user", bg: "bg-emerald-50", fg: "text-emerald-600", valueCls: "text-on-surface" },
          { label: "Controladores & Drivers", value: archivos.length, suffix: " archivos", icon: "folder_zip", bg: "bg-red-50", fg: "text-red-600", valueCls: "text-on-surface" },
          { label: "Alertas de Vencimiento", value: licencias.filter(l => getLicenseUrgency(l.fecha_fin) !== "ok").length, suffix: " críticas", icon: "error", bg: "bg-red-100", fg: "text-red-700", valueCls: "text-red-600" },
        ];
    }
  }, [activeTab, licencias, archivos, productos, categorias, mensajes, usuarios, servicios, trabajos]);

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

  const filteredProductos = productos.filter((p) =>
    p.nombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (p.descripcion && p.descripcion.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (p.categoria?.nombre && p.categoria.nombre.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const filteredMensajes = mensajes.filter((m) =>
    m.nombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.asunto.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.mensaje.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.correo.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredUsuarios = usuarios.filter((u) =>
    u.nombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.usuario.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.rol.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredServicios = servicios.filter((s) =>
    s.nombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.descripcion.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredTrabajos = trabajos.filter((t) =>
    t.titulo.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (t.descripcion && t.descripcion.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (t.servicio?.nombre && t.servicio.nombre.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const filteredCategorias = categorias.filter((c) =>
    c.nombre.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const unreadMessagesCount = mensajes.filter((m) => !m.leido).length;
  const expiredLicensesCount = licencias.filter((lic) => getLicenseUrgency(lic.fecha_fin) === "expired").length;
  const warningLicensesCount = licencias.filter((lic) => getLicenseUrgency(lic.fecha_fin) === "warning").length;
  const totalUrgentLicenses = expiredLicensesCount + warningLicensesCount;

  return (
    <div className={`bg-slate-50 min-h-screen text-on-surface font-headline overflow-hidden flex transition-colors duration-300 ${darkMode ? "dark-theme" : ""}`}>
      {/* Estilos para el Modo Oscuro del Panel de Administración */}
      <style dangerouslySetInnerHTML={{ __html: `
        .dark-theme {
          --bg-main: #0b0f19;
          --bg-surface: #1e293b;
          --bg-hover: #334155;
          --border-color: #334155;
          --text-main: #f8fafc;
          --text-muted: #94a3b8;
          --text-active: #ffffff;
          background-color: var(--bg-main) !important;
          color: var(--text-main) !important;
        }

        .dark-theme aside {
          background-color: var(--bg-surface) !important;
          border-color: var(--border-color) !important;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.5) !important;
        }

        .dark-theme aside a,
        .dark-theme aside button {
          color: var(--text-muted) !important;
        }

        .dark-theme aside a:hover,
        .dark-theme aside button:hover {
          background-color: var(--bg-hover) !important;
          color: var(--text-active) !important;
        }

        .dark-theme aside button[class*="text-primary"],
        .dark-theme aside button.text-primary {
          color: #ff7878 !important;
          background-color: rgba(255, 0, 0, 0.15) !important;
          border-color: #ff0000 !important;
        }

        .dark-theme header {
          background-color: rgba(30, 41, 59, 0.8) !important;
          border-color: var(--border-color) !important;
        }

        .dark-theme header input {
          background-color: var(--bg-main) !important;
          color: var(--text-main) !important;
        }

        .dark-theme header input::placeholder {
          color: var(--text-muted) !important;
        }

        .dark-theme main {
          background-color: var(--bg-main) !important;
        }

        .dark-theme .bg-white {
          background-color: var(--bg-surface) !important;
          border-color: var(--border-color) !important;
          color: var(--text-main) !important;
        }

        .dark-theme .border-slate-200,
        .dark-theme .border-slate-200\\/80,
        .dark-theme .border-slate-100,
        .dark-theme .border-slate-300 {
          border-color: var(--border-color) !important;
        }

        .dark-theme .bg-slate-100 {
          background-color: var(--bg-hover) !important;
        }

        .dark-theme .text-slate-500,
        .dark-theme .text-slate-600,
        .dark-theme .text-slate-400 {
          color: var(--text-muted) !important;
        }

        .dark-theme .text-slate-700,
        .dark-theme .text-slate-800,
        .dark-theme .text-slate-900 {
          color: var(--text-main) !important;
        }

        .dark-theme .text-on-surface {
          color: var(--text-main) !important;
        }

        /* Status badges, icon chips & colored accents */
        .dark-theme .bg-red-50,
        .dark-theme .bg-red-100 {
          background-color: rgba(255, 0, 0, 0.15) !important;
        }
        .dark-theme .bg-red-50\\/30 {
          background-color: rgba(255, 0, 0, 0.08) !important;
        }
        .dark-theme .text-red-600,
        .dark-theme .text-red-700,
        .dark-theme .text-red-800 {
          color: #ff7878 !important;
        }
        .dark-theme .border-red-200,
        .dark-theme .border-red-100 {
          border-color: rgba(255, 0, 0, 0.35) !important;
        }

        .dark-theme .bg-emerald-50,
        .dark-theme .bg-emerald-100 {
          background-color: rgba(16, 185, 129, 0.15) !important;
        }
        .dark-theme .text-emerald-500,
        .dark-theme .text-emerald-600,
        .dark-theme .text-emerald-800 {
          color: #34d399 !important;
        }
        .dark-theme .border-emerald-200,
        .dark-theme .border-emerald-100 {
          border-color: rgba(16, 185, 129, 0.35) !important;
        }

        .dark-theme .bg-orange-50,
        .dark-theme .bg-orange-100 {
          background-color: rgba(249, 115, 22, 0.15) !important;
        }
        .dark-theme .text-orange-500,
        .dark-theme .text-orange-800 {
          color: #fb923c !important;
        }
        .dark-theme .border-orange-200 {
          border-color: rgba(249, 115, 22, 0.35) !important;
        }

        .dark-theme .bg-red-50 {
          background-color: rgba(255, 0, 0, 0.08) !important;
        }

        .dark-theme .bg-slate-50 {
          background-color: #1e293b !important;
          color: var(--text-main) !important;
        }

        .dark-theme button.bg-slate-50:hover {
          background-color: #334155 !important;
          color: #ffffff !important;
        }

        .dark-theme .border-red-600 {
          border-color: #ef4444 !important;
        }

        .dark-theme .bg-blue-50,
        .dark-theme .bg-blue-100 {
          background-color: rgba(59, 130, 246, 0.15) !important;
        }
        .dark-theme .text-blue-600,
        .dark-theme .text-blue-500 {
          color: #60a5fa !important;
        }
        .dark-theme .border-blue-100,
        .dark-theme .border-blue-200 {
          border-color: rgba(59, 130, 246, 0.35) !important;
        }

        .dark-theme .bg-purple-50,
        .dark-theme .bg-purple-100 {
          background-color: rgba(168, 85, 247, 0.15) !important;
        }
        .dark-theme .text-purple-600,
        .dark-theme .text-purple-500 {
          color: #c084fc !important;
        }
        .dark-theme .border-purple-100,
        .dark-theme .border-purple-200 {
          border-color: rgba(168, 85, 247, 0.35) !important;
        }

        .dark-theme .bg-amber-50,
        .dark-theme .bg-amber-100 {
          background-color: rgba(245, 158, 11, 0.15) !important;
        }
        .dark-theme .text-amber-600 {
          color: #fbbf24 !important;
        }
        .dark-theme .border-amber-100,
        .dark-theme .border-amber-200 {
          border-color: rgba(245, 158, 11, 0.35) !important;
        }

        .dark-theme table thead tr {
          background-color: #111827 !important;
          border-color: var(--border-color) !important;
        }

        .dark-theme table tbody tr {
          border-color: var(--border-color) !important;
        }

        .dark-theme table tbody tr:hover {
          background-color: rgba(51, 65, 85, 0.4) !important;
        }

        .dark-theme table th {
          color: var(--text-muted) !important;
          border-color: var(--border-color) !important;
        }

        .dark-theme table td {
          color: var(--text-main) !important;
        }

        .dark-theme .dark-theme-toggle {
          background-color: var(--bg-hover) !important;
          color: var(--text-main) !important;
        }
        
        .dark-theme .dark-theme-toggle:hover {
          background-color: #475569 !important;
        }

        /* Modals */
        .dark-theme .fixed .bg-white {
          background-color: var(--bg-surface) !important;
          border-color: var(--border-color) !important;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5) !important;
        }

        .dark-theme .fixed header {
          background-color: #111827 !important;
          border-color: var(--border-color) !important;
        }

        .dark-theme .fixed header button:hover {
          color: var(--text-active) !important;
        }

        .dark-theme input[type="file"]::file-selector-button {
          background-color: var(--bg-hover) !important;
          color: var(--text-main) !important;
        }

        .dark-theme .fixed form input,
        .dark-theme .fixed form textarea,
        .dark-theme .fixed form select {
          background-color: var(--bg-main) !important;
          border-color: var(--border-color) !important;
          color: var(--text-main) !important;
        }

        .dark-theme .fixed form input:focus,
        .dark-theme .fixed form textarea:focus,
        .dark-theme .fixed form select:focus {
          border-color: #ef4444 !important;
          box-shadow: 0 0 0 1px #ef4444 !important;
        }

        .dark-theme .fixed footer {
          border-color: var(--border-color) !important;
        }

        .dark-theme .fixed footer button:not([class*="bg-red"]) {
          border-color: var(--border-color) !important;
          color: var(--text-main) !important;
        }

        .dark-theme .fixed footer button:not([class*="bg-red"]):hover {
          background-color: var(--bg-hover) !important;
        }

        /* Card hover in dark mode */
        .dark-theme .bg-white:hover,
        .dark-theme .hover\\:bg-slate-50:hover {
          background-color: #27374d !important;
        }

        /* Material icons visible in dark mode */
        .dark-theme .material-symbols-outlined {
          color: inherit !important;
        }
        .dark-theme .text-slate-400 .material-symbols-outlined,
        .dark-theme span.material-symbols-outlined.text-slate-400 {
          color: #94a3b8 !important;
        }

        /* Product / portfolio image containers in dark mode */
        .dark-theme .border-slate-100.bg-white,
        .dark-theme .bg-white.border-slate-100 {
          background-color: #1e293b !important;
          border-color: #334155 !important;
        }
        .dark-theme img {
          border-color: transparent !important;
        }

        /* Stat card icon chips */
        .dark-theme .rounded-xl.bg-slate-100 {
          background-color: #334155 !important;
        }
        .dark-theme .rounded-xl.bg-slate-100 .material-symbols-outlined {
          color: #94a3b8 !important;
        }

        /* Image preview thumbnail border */
        .dark-theme .img-thumb-wrap {
          background-color: #1e293b !important;
          border-color: #334155 !important;
        }

        /* Estilos del popup de guía en modo oscuro */
        .dark-theme .guide-popup-card {
          background-color: #0f172a !important;
          border-color: rgba(255, 0, 0, 0.4) !important;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.7) !important;
        }
        /* Texto principal dentro del popup */
        .dark-theme .guide-popup-card .text-slate-800,
        .dark-theme .guide-popup-card .text-slate-700,
        .dark-theme .guide-popup-card .text-on-background {
          color: #f1f5f9 !important;
        }
        .dark-theme .guide-popup-card .text-slate-500,
        .dark-theme .guide-popup-card .text-slate-400 {
          color: #94a3b8 !important;
        }
        /* Divisor del header */
        .dark-theme .guide-popup-card .border-slate-100 {
          border-color: #334155 !important;
        }
        /* Selector de modo (pill) */
        .dark-theme .guide-popup-card .bg-slate-100 {
          background-color: #1e293b !important;
          border-color: #334155 !important;
        }
        /* Barra de progreso (track) */
        .dark-theme .guide-popup-card .bg-slate-200 {
          background-color: #334155 !important;
        }
        /* Items de paso (undone y done) */
        .dark-theme .guide-popup-card .bg-white {
          background-color: #1e293b !important;
        }
        .dark-theme .guide-popup-card .bg-slate-50 {
          background-color: #172033 !important;
        }
        .dark-theme .guide-popup-card .border-slate-200,
        .dark-theme .guide-popup-card .border-slate-200\\/60,
        .dark-theme .guide-popup-card .border-slate-100 {
          border-color: #334155 !important;
        }
        /* Check icon bg */
        .dark-theme .guide-popup-card .bg-red-50 {
          background-color: rgba(255, 0, 0, 0.15) !important;
        }
        /* "Hecho" label */
        .dark-theme .guide-popup-card .border-slate-200 {
          border-color: #334155 !important;
        }
        .dark-theme .text-on-background {
          color: var(--text-main) !important;
        }
      ` }} />
      
      {/* Mobile/tablet backdrop overlay - click to close sidebar */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-slate-900/50 z-40 lg:hidden cursor-pointer"
          aria-hidden="true"
        />
      )}

      {/* SideNavBar - Clean Premium Light Theme */}
      <aside className={`bg-white h-screen w-64 left-0 top-0 fixed border-r border-slate-200/80 flex flex-col py-6 z-50 shadow-sm transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      }`}>
        <div className="px-6 mb-8 flex items-center gap-3 justify-between">
          <div className="flex items-center gap-3">
            <DellcomLogo className="w-10 h-10" />
            <div>
              <h1 className="text-lg font-bold tracking-tight text-on-surface">DELLCOM SAC</h1>
              <p className="text-[10px] text-primary font-bold uppercase tracking-widest leading-none">Portal de Gestión Interna</p>
            </div>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-on-surface hover:bg-slate-100 transition-colors cursor-pointer shrink-0"
            aria-label="Cerrar menú"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto max-h-[calc(100vh-180px)] no-scrollbar pb-6">

          {/* NavItem helper rendered inline */}
          {(() => {
            const NavItem = ({ tab, icon, label, badge }: { tab: string; icon: string; label: string; badge?: React.ReactNode }) => (
              <button
                onClick={() => { setActiveTab(tab); setSearchQuery(""); setSidebarOpen(false); }}
                className={`w-full flex items-center gap-3 px-6 py-3 transition-colors duration-150 border-l-4 cursor-pointer text-left ${
                  activeTab === tab
                    ? "text-primary font-extrabold border-primary bg-primary/5"
                    : "text-slate-500 border-transparent hover:text-on-surface hover:bg-slate-50"
                }`}
              >
                <span className={`material-symbols-outlined text-[20px] shrink-0 ${activeTab === tab ? "text-primary" : "text-slate-400"}`}>{icon}</span>
                <span className="text-sm leading-tight">{label}</span>
                {badge && <span className="ml-auto shrink-0">{badge}</span>}
              </button>
            );

            const GroupHeader = ({ label, groupKey }: { label: string; groupKey: string }) => (
              <button
                onClick={() => toggleGroup(groupKey)}
                className="w-full flex items-center justify-between px-6 pt-5 pb-1 text-[9px] font-black text-slate-400 uppercase tracking-widest select-none hover:text-slate-600 transition-colors cursor-pointer"
              >
                <span>{label}</span>
                <span className={`material-symbols-outlined text-sm transition-transform duration-200 ${openGroups[groupKey] ? "rotate-0" : "-rotate-90"}`}>
                  expand_more
                </span>
              </button>
            );

            return (
              <>
                {/* INICIO — always open */}
                <div className="pt-2 pb-1 px-6 text-[9px] font-black text-slate-400 uppercase tracking-widest select-none">Inicio</div>
                <NavItem tab="overview" icon="dashboard" label="Resumen General" />

                {/* CLIENTES Y SOPORTE */}
                <GroupHeader label="Clientes y Soporte" groupKey="clientes" />
                {openGroups.clientes && (
                  <>
                    <NavItem tab="messages" icon="mail" label="Mensajes de Contacto" badge={
                      unreadMessagesCount > 0 && (
                        <span className="w-5 h-5 rounded-full bg-primary text-white text-[10px] font-black flex items-center justify-center animate-pulse shadow-sm">
                          {unreadMessagesCount}
                        </span>
                      )
                    } />
                    <NavItem tab="licenses" icon="verified_user" label="Gestión de Licencias" badge={
                      totalUrgentLicenses > 0 && (
                        <span className={`w-5 h-5 rounded-full text-white text-[10px] font-black flex items-center justify-center shadow-sm ${expiredLicensesCount > 0 ? "bg-red-600 animate-pulse" : "bg-orange-500"}`}>
                          {totalUrgentLicenses}
                        </span>
                      )
                    } />
                  </>
                )}

                {/* INVENTARIO Y RECURSOS */}
                <GroupHeader label="Inventario y Recursos" groupKey="inventario" />
                {openGroups.inventario && (
                  <>
                    <NavItem tab="products" icon="inventory_2" label="Catálogo de Suministros" />
                    <NavItem tab="categories" icon="category" label="Categorías Catálogo" />
                    <NavItem tab="files" icon="folder_open" label="Archivos y Drivers" />
                  </>
                )}

                {/* CONTENIDO PÚBLICO */}
                <GroupHeader label="Contenido Público" groupKey="contenido" />
                {openGroups.contenido && (
                  <>
                    <NavItem tab="services" icon="build" label="Gestión de Servicios" />
                    <NavItem tab="portfolio" icon="photo_library" label="Trabajos Realizados" />
                  </>
                )}

                {/* SISTEMA — admin only */}
                {(session?.user as any)?.role === "admin" && (
                  <>
                    <GroupHeader label="Sistema" groupKey="sistema" />
                    {openGroups.sistema && (
                      <NavItem tab="users" icon="group" label="Gestión de Personal" />
                    )}
                  </>
                )}
              </>
            );
          })()}
        </nav>

        {/* Support & Logout links in sidebar footer */}
        <div className="mt-auto border-t border-slate-100 pt-4 space-y-1">


          <Link href="/" className="flex items-center gap-3 text-slate-500 hover:text-on-surface px-6 py-3 hover:bg-slate-50 transition-colors">
            <span className="material-symbols-outlined text-[20px] text-slate-400">public</span>
            <span className="text-sm">Ver Web Pública</span>
          </Link>
          <button
            onClick={() => signOut({ callbackUrl: "/admin/login" })}
            className="w-full flex items-center gap-3 text-slate-500 hover:text-primary px-6 py-3 hover:bg-red-50 transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px] text-slate-400">logout</span>
            <span className="text-sm">Cerrar Sesión</span>
          </button>
        </div>
      </aside>

      {/* TopAppBar - Sleek, Blur Glass effect */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-64">
        <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 flex justify-between items-center w-full h-16 px-4 sm:px-8 gap-3 sticky top-0 z-40">

          {/* Hamburger menu (mobile/tablet only) + Dynamic Search Bar */}
          <div className="flex items-center gap-3 sm:gap-6 w-full max-w-md">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden w-9 h-9 shrink-0 rounded-lg flex items-center justify-center text-slate-500 hover:text-on-surface hover:bg-slate-100 transition-colors cursor-pointer"
              aria-label="Abrir menú"
            >
              <span className="material-symbols-outlined text-[22px]">menu</span>
            </button>
            <div className="relative w-full">
              <span className="absolute inset-y-0 left-3 flex items-center text-slate-400">
                <span className="material-symbols-outlined text-[20px]">search</span>
              </span>
              <input 
                className="w-full bg-slate-100 border-none rounded-xl pl-10 pr-4 py-2 text-xs focus:ring-1 focus:ring-red-600 focus:outline-none transition-all placeholder:text-slate-500" 
                placeholder={
                  activeTab === "overview"
                    ? "Búsqueda rápida en el panel..."
                    : activeTab === "licenses" 
                    ? "Buscar licencias por cliente, software..." 
                    : activeTab === "files"
                    ? "Buscar archivos y manuales..."
                    : activeTab === "products"
                    ? "Buscar productos..."
                    : activeTab === "categories"
                    ? "Buscar categorías..."
                    : activeTab === "services"
                    ? "Buscar servicios..."
                    : activeTab === "portfolio"
                    ? "Buscar trabajos del portafolio..."
                    : activeTab === "messages"
                    ? "Buscar mensajes por remitente, asunto o cuerpo..."
                    : "Buscar personal por nombre, usuario o rol..."
                } 
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          
          {/* User Profile dropdown panel */}
          <div className="flex items-center gap-2">
            {/* Guía de sección */}
            {/* Guía de sección */}
            <div className="relative">
              <button
                onClick={() => setGuideVisible((v) => !v)}
                className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all cursor-pointer ${
                  guideVisible
                    ? "bg-primary text-white shadow-sm shadow-primary/10"
                    : "bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-on-surface dark-theme-toggle"
                }`}
                title={guideVisible ? "Ocultar guía" : "Mostrar guía de esta sección"}
              >
                <span className="material-symbols-outlined text-[20px]">
                  {guideVisible ? "help" : "help_outline"}
                </span>
              </button>

              {guideVisible && (() => {
                const guides: Record<string, { icon: string; title: string; desc: string; steps: string[] }> = {
                  overview: {
                    icon: "dashboard", title: "Resumen General",
                    desc: "Vista de alto nivel de toda la actividad del sistema.",
                    steps: [
                      "Monitorea las métricas clave de licencias, mensajes recibidos e ingresos en la barra de KPIs superior",
                      "Consulta el gráfico de Tendencia de Consultas para ver el flujo de mensajes de la última semana",
                      "Revisa la distribución de vigencias en la tarjeta 'Alertas y Estado de Licencias' (barra tricolor)",
                      "Verifica los próximos vencimientos en la sección de Actividades Recientes (columna derecha)",
                      "Utiliza los Accesos Rápidos para registrar una nueva licencia, subir archivos o registrar productos con un solo clic"
                    ],
                  },
                  messages: {
                    icon: "mail", title: "Mensajes de Contacto",
                    desc: "Aquí llegan todos los mensajes enviados desde el formulario de contacto del sitio web.",
                    steps: ["Los mensajes en negrita son no leídos", "Haz clic en un mensaje para ver el contenido completo", "Márcalos como leídos para limpiar la bandeja", "Solo el admin puede eliminar mensajes"],
                  },
                  licenses: {
                    icon: "verified_user", title: "Gestión de Licencias",
                    desc: "Registro de licencias de software vendidas a clientes, con alertas de vencimiento.",
                    steps: ["Las licencias en rojo están vencidas, en naranja por vencer pronto", "Usa '+ Nueva Licencia' para registrar una venta", "Edita una licencia para actualizar su estado o fecha", "Filtra por estado para ver solo las activas o vencidas"],
                  },
                  products: {
                    icon: "inventory_2", title: "Catálogo de Suministros",
                    desc: "Gestiona los productos que aparecen en el catálogo público del sitio web.",
                    steps: ["Sube imágenes desde tu PC o pega una URL directamente", "Asigna categorías para que los clientes puedan filtrar", "Activa/desactiva productos sin eliminarlos", "Los precios se muestran en soles (S/)"],
                  },
                  categories: {
                    icon: "category", title: "Categorías del Catálogo",
                    desc: "Las categorías organizan los productos del catálogo público.",
                    steps: ["Crea categorías antes de agregar productos", "Desactiva una categoría para ocultar sus productos en la web", "Los nombres deben ser únicos"],
                  },
                  files: {
                    icon: "folder_open", title: "Archivos y Drivers",
                    desc: "Repositorio interno de controladores, programas y documentos para el equipo técnico.",
                    steps: ["Sube archivos desde tu PC o pega un enlace (Drive, Dropbox, etc.)", "Clasifica por tipo: programa, driver, excel o link", "Solo técnicos y admins pueden subir archivos", "Los archivos solo son visibles para el personal con sesión activa"],
                  },
                  services: {
                    icon: "build", title: "Gestión de Servicios",
                    desc: "Los servicios que aparecen en la sección de servicios del sitio web público.",
                    steps: ["Cada servicio tiene un icono de Material Symbols (ej: laptop_mac)", "Desactiva un servicio para ocultarlo del sitio sin eliminarlo", "Los trabajos del portafolio se asocian a servicios"],
                  },
                  portfolio: {
                    icon: "photo_library", title: "Trabajos Realizados",
                    desc: "Galería de proyectos completados que se muestra en el sitio web público.",
                    steps: ["La foto principal es la portada que aparece en la cuadrícula", "Agrega fotos adicionales para crear un carrusel en el lightbox", "Asocia el trabajo a un servicio para que aparezca clasificado", "Los trabajos más recientes aparecen primero en la web"],
                  },
                  users: {
                    icon: "group", title: "Gestión de Personal",
                    desc: "Administra las cuentas de acceso al panel. Solo los administradores pueden ver y editar esta sección.",
                    steps: ["Al crear un usuario, el sistema genera automáticamente su nombre de usuario y contraseña temporal", "Las credenciales se envían al correo del personal al crearse la cuenta", "El personal nuevo debe cambiar su contraseña en su primer ingreso", "Puedes desactivar cuentas sin eliminarlas"],
                  },
                };
                const g = guides[activeTab];
                if (!g) return null;

                const tabCompleted = completedSteps[activeTab] || new Array(g.steps.length).fill(false);
                const totalSteps = g.steps.length;
                const completedCount = tabCompleted.filter(Boolean).length;
                const percent = Math.round((completedCount / totalSteps) * 100);
                const currentStepIdx = guideStepIndex[activeTab] || 0;

                const toggleStep = (index: number) => {
                  setCompletedSteps((prev) => {
                    const current = prev[activeTab] ? [...prev[activeTab]] : new Array(totalSteps).fill(false);
                    current[index] = !current[index];
                    return { ...prev, [activeTab]: current };
                  });
                };

                const resetProgress = () => {
                  setCompletedSteps((prev) => ({ ...prev, [activeTab]: new Array(totalSteps).fill(false) }));
                  setGuideStepIndex((prev) => ({ ...prev, [activeTab]: 0 }));
                };

                const setStepIdx = (index: number) => {
                  setGuideStepIndex((prev) => ({ ...prev, [activeTab]: Math.max(0, Math.min(totalSteps - 1, index)) }));
                };

                return (
                  <div className="fixed top-16 right-4 sm:absolute sm:right-0 sm:top-12 z-50 w-[calc(100vw-32px)] sm:w-[420px] bg-white border border-primary/20 rounded-2xl p-5 shadow-2xl animate-fade-in text-left text-on-background guide-popup-card">

                    {/* Header Row */}
                    <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-3">
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary text-lg">{g.icon}</span>
                        <span className="text-xs font-bold text-slate-800 font-headline">Guía de {g.title}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={resetProgress}
                          className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all cursor-pointer flex items-center"
                          title="Reiniciar progreso"
                          type="button"
                        >
                          <span className="material-symbols-outlined text-base">restart_alt</span>
                        </button>
                        <button
                          onClick={() => setGuideVisible(false)}
                          className="p-1 rounded-md text-slate-400 hover:text-slate-600 transition-colors cursor-pointer flex items-center"
                          title="Cerrar"
                          type="button"
                        >
                          <span className="material-symbols-outlined text-base">close</span>
                        </button>
                      </div>
                    </div>

                    {/* Mode selector */}
                    <div className="flex items-center justify-between bg-slate-100 border border-slate-200 p-0.5 rounded-lg mb-3">
                      <button
                        onClick={() => setGuideMode("checklist")}
                        className={`flex-1 py-1 rounded-md text-[10px] font-extrabold flex items-center justify-center gap-1 transition-all cursor-pointer ${
                          guideMode === "checklist"
                            ? "bg-primary text-white shadow-xs"
                            : "text-slate-500 hover:text-slate-700"
                        }`}
                        type="button"
                      >
                        <span className="material-symbols-outlined text-xs">checklist</span>
                        Lista de tareas
                      </button>
                      <button
                        onClick={() => setGuideMode("stepper")}
                        className={`flex-1 py-1 rounded-md text-[10px] font-extrabold flex items-center justify-center gap-1 transition-all cursor-pointer ${
                          guideMode === "stepper"
                            ? "bg-primary text-white shadow-xs"
                            : "text-slate-500 hover:text-slate-700"
                        }`}
                        type="button"
                      >
                        <span className="material-symbols-outlined text-xs">auto_stories</span>
                        Paso a paso
                      </button>
                    </div>

                    {/* Content */}
                    {guideMode === "checklist" ? (
                      <div className="space-y-3">
                        {/* Progress */}
                        <div>
                          <div className="flex justify-between items-center text-[9px] font-bold text-slate-400 tracking-wider">
                            <span>PROGRESO</span>
                            <span>{completedCount}/{totalSteps} ({percent}%)</span>
                          </div>
                          <div className="w-full bg-slate-200 rounded-full h-1.5 mt-1 overflow-hidden">
                            <div className="bg-primary h-full rounded-full transition-all duration-300" style={{ width: `${percent}%` }}></div>
                          </div>
                        </div>

                        {/* List */}
                        <div className="space-y-1.5 max-h-[200px] overflow-y-auto pr-1">
                          {g.steps.map((step, i) => {
                            const isDone = tabCompleted[i];
                            return (
                              <div
                                key={i}
                                onClick={() => toggleStep(i)}
                                className={`flex items-start gap-2 p-1.5 rounded-lg transition-all cursor-pointer border select-none group ${
                                  isDone
                                    ? "bg-slate-50 border-slate-200/60"
                                    : "bg-white border-slate-100 hover:border-primary/30 hover:shadow-xs"
                                }`}
                              >
                                <div className="mt-0.5 shrink-0">
                                  {isDone ? (
                                    <span className="material-symbols-outlined text-primary text-[14px] bg-red-50 rounded-full w-4.5 h-4.5 flex items-center justify-center font-bold">check</span>
                                  ) : (
                                    <span className="w-4.5 h-4.5 rounded-full border border-slate-300 group-hover:border-primary transition-colors flex items-center justify-center text-[8px] text-slate-400 font-bold">{i + 1}</span>
                                  )}
                                </div>
                                <span className={`text-[11px] font-semibold leading-normal ${isDone ? "text-slate-400 line-through" : "text-slate-700 group-hover:text-slate-900"}`}>
                                  {step}
                                </span>
                              </div>
                            );
                          })}
                        </div>

                        {percent === 100 && (
                          <div className="bg-green-100 border border-green-200 rounded-lg p-2 flex items-center gap-2 animate-fade-in">
                            <span className="material-symbols-outlined text-green-600 text-base">workspace_premium</span>
                            <p className="text-[10px] font-bold text-green-800 m-0">¡Felicidades! Has aprendido todo en este módulo.</p>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <div className="bg-white border border-slate-200 rounded-xl p-3.5 shadow-xs relative min-h-[95px] flex flex-col justify-between">
                          <div>
                            <div className="flex justify-between items-center">
                              <span className="text-[8px] font-black text-primary tracking-wider uppercase">Paso {currentStepIdx + 1} de {totalSteps}</span>
                              <label className="flex items-center gap-1 cursor-pointer select-none text-[9px] font-bold text-slate-500 bg-slate-50 px-1.5 py-0.5 rounded border border-slate-200">
                                <input
                                  type="checkbox"
                                  checked={tabCompleted[currentStepIdx] || false}
                                  onChange={() => toggleStep(currentStepIdx)}
                                  className="rounded border-slate-300 text-primary focus:ring-primary w-2.5 h-2.5 cursor-pointer"
                                />
                                <span>Hecho</span>
                              </label>
                            </div>
                            <p className="text-[11px] font-bold text-slate-800 mt-2 leading-relaxed">{g.steps[currentStepIdx]}</p>
                          </div>

                          <div className="flex items-center justify-between border-t border-slate-100 pt-2.5 mt-3">
                            <button
                              onClick={() => setStepIdx(currentStepIdx - 1)}
                              disabled={currentStepIdx === 0}
                              className={`px-2 py-1 rounded text-[10px] font-bold flex items-center gap-0.5 transition-all cursor-pointer ${
                                currentStepIdx === 0 ? "text-slate-300 cursor-not-allowed" : "text-primary hover:bg-red-50"
                              }`}
                              type="button"
                            >
                              <span className="material-symbols-outlined text-xs">arrow_back</span>
                              Atrás
                            </button>

                            <div className="flex items-center gap-1">
                              {g.steps.map((_, i) => (
                                <button
                                  key={i}
                                  onClick={() => setStepIdx(i)}
                                  className={`w-1.5 h-1.5 rounded-full transition-all cursor-pointer ${
                                    i === currentStepIdx ? "bg-primary w-3" : tabCompleted[i] ? "bg-primary/30" : "bg-slate-200"
                                  }`}
                                  type="button"
                                ></button>
                              ))}
                            </div>

                            <button
                              onClick={() => {
                                if (currentStepIdx === totalSteps - 1) {
                                  setStepIdx(0);
                                  setGuideMode("checklist");
                                } else {
                                  setStepIdx(currentStepIdx + 1);
                                }
                              }}
                              className="px-2 py-1 bg-primary hover:bg-red-700 text-white rounded text-[10px] font-bold flex items-center gap-0.5 transition-all cursor-pointer"
                              type="button"
                            >
                              {currentStepIdx === totalSteps - 1 ? "Fin" : "Siguiente"}
                              <span className="material-symbols-outlined text-xs">
                                {currentStepIdx === totalSteps - 1 ? "check" : "arrow_forward"}
                              </span>
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })()}
            </div>


            {/* Toggle Modo Oscuro */}
            <button
              onClick={toggleDarkMode}
              className="w-10 h-10 rounded-xl flex items-center justify-center bg-slate-100 hover:bg-slate-200 dark-theme-toggle transition-all cursor-pointer text-slate-600 hover:text-on-surface animate-fade-in"
              title="Cambiar tema (Claro/Oscuro)"
            >
              <span className="material-symbols-outlined text-[20px]">
                {darkMode ? "light_mode" : "dark_mode"}
              </span>
            </button>

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
        <main className="p-4 sm:p-6 lg:p-8 overflow-y-auto h-[calc(100vh-64px)] custom-scrollbar">
          
          {/* Quick Stats Banner — contextual per active tab */}
          <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {tabStats.map((stat, i) => (
              <div key={i} className="bg-white border border-slate-200/80 p-5 rounded-2xl shadow-sm flex items-center justify-between">
                <div>
                  <span className="text-slate-500 text-[11px] font-bold uppercase tracking-wider">{stat.label}</span>
                  <h3 className={`text-2xl font-black mt-1 ${stat.valueCls}`}>
                    {stat.value}{stat.suffix}
                  </h3>
                </div>
                <div className={`p-3 ${stat.bg} ${stat.fg} rounded-xl`}>
                  <span className="material-symbols-outlined text-2xl">{stat.icon}</span>
                </div>
              </div>
            ))}
          </section>




          {/* TAB: Overview (Resumen General) */}
          {activeTab === "overview" && (
            <section className="animate-fade-in-up space-y-6">
              <div className="flex justify-between items-end mb-2">
                <div>
                  <h2 className="text-xl font-bold text-on-surface font-headline">Resumen General del Sistema</h2>
                  <p className="text-xs text-slate-500 mt-0.5">Métricas clave de desempeño, tendencias y próximos vencimientos de DELLCOM SAC.</p>
                </div>
              </div>
              
              {/* Analytics & Charts Row */}
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                
                {/* Curve SVG Chart for Messages (Tendencia de Consultas) */}
                <div className="xl:col-span-2 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
                  <div>
                    <h3 className="font-bold text-sm text-on-surface">Tendencia de Consultas (Mensajes)</h3>
                    <p className="text-xs text-slate-500">Volumen diario de mensajes de contacto de clientes durante la última semana.</p>
                  </div>
                  
                  {/* Chart Visual */}
                  <div className="h-44 w-full mt-4 flex items-end relative">
                    {(() => {
                      const now = new Date();
                      const days: { label: string; count: number }[] = [];
                      for (let i = 6; i >= 0; i--) {
                        const d = new Date(now.getFullYear(), now.getMonth(), now.getDate() - i);
                        const label = d.toLocaleDateString("es-ES", { weekday: "short" });
                        const dateStr = d.toDateString();
                        const count = mensajes.filter(m => new Date(m.fecha).toDateString() === dateStr).length;
                        days.push({ label, count });
                      }
                      
                      const maxCount = Math.max(...days.map(d => d.count), 4);
                      const chartWidth = 500;
                      const chartHeight = 120;
                      
                      const points = days.map((d, i) => {
                        const x = i * (chartWidth / 6);
                        const y = chartHeight - (d.count / maxCount) * 90 - 15;
                        return { x, y };
                      });
                      
                      let pathD = `M ${points[0].x} ${points[0].y}`;
                      for (let i = 1; i < points.length; i++) {
                        const p0 = points[i - 1];
                        const p1 = points[i];
                        const cpX1 = p0.x + (p1.x - p0.x) / 2;
                        const cpY1 = p0.y;
                        const cpX2 = p0.x + (p1.x - p0.x) / 2;
                        const cpY2 = p1.y;
                        pathD += ` C ${cpX1} ${cpY1}, ${cpX2} ${cpY2}, ${p1.x} ${p1.y}`;
                      }
                      const fillD = `${pathD} L ${points[points.length - 1].x} ${chartHeight} L ${points[0].x} ${chartHeight} Z`;
                      
                      return (
                        <div className="w-full h-full flex flex-col justify-between">
                          <div className="flex-1 w-full relative">
                            {/* Gridlines */}
                            <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-40">
                              <div className="border-b border-dashed border-slate-200 w-full h-0"></div>
                              <div className="border-b border-dashed border-slate-200 w-full h-0"></div>
                              <div className="border-b border-dashed border-slate-200 w-full h-0"></div>
                            </div>
                            
                            <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full h-full overflow-visible" preserveAspectRatio="none">
                              <defs>
                                <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                                  <stop offset="0%" stopColor="#dc2626" stopOpacity="0.25" />
                                  <stop offset="100%" stopColor="#dc2626" stopOpacity="0.0" />
                                </linearGradient>
                              </defs>
                              {/* Filled area */}
                              <path d={fillD} fill="url(#chartGradient)" />
                              {/* Smooth curve line */}
                              <path d={pathD} fill="none" stroke="#dc2626" strokeWidth="3.5" strokeLinecap="round" />
                              {/* Dots at points */}
                              {points.map((pt, i) => (
                                <g key={i} className="group/dot cursor-pointer">
                                  <circle cx={pt.x} cy={pt.y} r="5" fill="#dc2626" className="transition-all duration-200 group-hover/dot:r-7" />
                                  <circle cx={pt.x} cy={pt.y} r="9" fill="none" stroke="#dc2626" strokeWidth="1.5" className="opacity-0 group-hover/dot:opacity-100 transition-opacity" />
                                  <title>{`${days[i].count} mensajes`}</title>
                                </g>
                              ))}
                            </svg>
                          </div>
                          
                          {/* Labels */}
                          <div className="flex justify-between mt-2 px-1">
                            {days.map((day, i) => (
                              <div key={i} className="text-center">
                                <span className="text-[10px] text-slate-500 font-bold block">{day.label}</span>
                                <span className="text-[11px] font-black text-on-surface block mt-0.5">{day.count}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                </div>
                
                {/* Donut / Stacked Progress segment card (Estado de Licencias) */}
                <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
                  <div>
                    <h3 className="font-bold text-sm text-on-surface">Alertas y Estado de Licencias</h3>
                    <p className="text-xs text-slate-500">Distribución de vigencias y alertas críticas de expiración.</p>
                  </div>
                  
                  {(() => {
                    const totalL = licencias.length;
                    const activeL = licencias.filter(l => getLicenseUrgency(l.fecha_fin) === "ok").length;
                    const warningL = licencias.filter(l => getLicenseUrgency(l.fecha_fin) === "warning").length;
                    const expiredL = licencias.filter(l => getLicenseUrgency(l.fecha_fin) === "expired").length;
                    
                    const activePct = totalL > 0 ? (activeL / totalL) * 100 : 0;
                    const warningPct = totalL > 0 ? (warningL / totalL) * 100 : 0;
                    const expiredPct = totalL > 0 ? (expiredL / totalL) * 100 : 0;
                    
                    return (
                      <div className="space-y-5 mt-4">
                        <div className="flex justify-between items-end">
                          <span className="text-xs font-bold text-slate-500">Total Suscripciones</span>
                          <span className="text-2xl font-black text-on-surface">{totalL}</span>
                        </div>
                        
                        {/* Segmented Progress Bar */}
                        <div className="w-full h-4 bg-slate-100 rounded-full overflow-hidden flex">
                          {activePct > 0 && (
                            <div 
                              style={{ width: `${activePct}%` }} 
                              className="bg-emerald-500 h-full transition-all duration-500" 
                              title={`Activas: ${activePct.toFixed(1)}%`}
                            />
                          )}
                          {warningPct > 0 && (
                            <div 
                              style={{ width: `${warningPct}%` }} 
                              className="bg-orange-500 h-full transition-all duration-500" 
                              title={`Por vencer: ${warningPct.toFixed(1)}%`}
                            />
                          )}
                          {expiredPct > 0 && (
                            <div 
                              style={{ width: `${expiredPct}%` }} 
                              className="bg-red-600 h-full transition-all duration-500" 
                              title={`Vencidas: ${expiredPct.toFixed(1)}%`}
                            />
                          )}
                          {totalL === 0 && <div className="w-full h-full bg-slate-200" />}
                        </div>
                        
                        {/* Legend */}
                        <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-100">
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0"></span>
                              <span className="text-[10px] font-bold text-slate-500 uppercase">Activas</span>
                            </div>
                            <span className="text-sm font-black text-on-surface block mt-0.5">{activeL}</span>
                          </div>
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="w-2.5 h-2.5 rounded-full bg-orange-500 shrink-0"></span>
                              <span className="text-[10px] font-bold text-slate-500 uppercase">Por vencer</span>
                            </div>
                            <span className="text-sm font-black text-on-surface block mt-0.5">{warningL}</span>
                          </div>
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="w-2.5 h-2.5 rounded-full bg-red-600 shrink-0"></span>
                              <span className="text-[10px] font-bold text-slate-500 uppercase">Vencidas</span>
                            </div>
                            <span className="text-sm font-black text-on-surface block mt-0.5">{expiredL}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })()}
                </div>
                
              </div>
              
              {/* Accesos Rápidos Row */}
              <div>
                <h3 className="font-bold text-sm text-on-surface mb-4">Accesos Rápidos Operativos</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  
                  {/* Action 1: Crear Licencia (solo admin) */}
                  {isAdmin && (
                    <button
                      onClick={() => { closeLicenseModal(); setShowLicenseModal(true); }}
                      className="group bg-white border border-slate-200 p-6 rounded-2xl shadow-sm text-left hover:border-red-500/50 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-pointer flex items-center justify-between"
                    >
                      <div className="space-y-1">
                        <span className="text-[10px] font-bold text-red-500 uppercase tracking-widest block">Acción de Clientes</span>
                        <h4 className="font-black text-sm text-on-surface group-hover:text-primary transition-colors">Registrar Licencia</h4>
                        <p className="text-xs text-slate-500">Añadir suscripción de software a un cliente.</p>
                      </div>
                      <div className="p-4 bg-red-50 text-red-600 rounded-xl group-hover:bg-red-600 group-hover:text-white transition-all">
                        <span className="material-symbols-outlined text-2xl">add_moderator</span>
                      </div>
                    </button>
                  )}

                  {/* Action 2: Subir Archivo (admin o tecnico) */}
                  {canEditTecnico && (
                    <button
                      onClick={() => { closeFileModal(); setShowFileModal(true); }}
                      className="group bg-white border border-slate-200 p-6 rounded-2xl shadow-sm text-left hover:border-blue-500/50 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-pointer flex items-center justify-between"
                    >
                      <div className="space-y-1">
                        <span className="text-[10px] font-bold text-blue-500 uppercase tracking-widest block">Recursos Técnicos</span>
                        <h4 className="font-black text-sm text-on-surface group-hover:text-blue-600 transition-colors">Subir Archivo / Driver</h4>
                        <p className="text-xs text-slate-500">Almacenar manuales o instaladores.</p>
                      </div>
                      <div className="p-4 bg-blue-50 text-blue-600 rounded-xl group-hover:bg-blue-600 group-hover:text-white transition-all">
                        <span className="material-symbols-outlined text-2xl">upload_file</span>
                      </div>
                    </button>
                  )}

                  {/* Action 3: Registrar Producto (admin o vendedor) */}
                  {canEditCatalogo && (
                    <button
                      onClick={() => { closeProductModal(); setShowProductModal(true); }}
                      className="group bg-white border border-slate-200 p-6 rounded-2xl shadow-sm text-left hover:border-emerald-500/50 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-pointer flex items-center justify-between"
                    >
                      <div className="space-y-1">
                        <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest block">Gestión Catálogo</span>
                        <h4 className="font-black text-sm text-on-surface group-hover:text-emerald-600 transition-colors">Registrar Producto</h4>
                        <p className="text-xs text-slate-500">Publicar tintas, cintas o ribbons.</p>
                      </div>
                      <div className="p-4 bg-emerald-50 text-emerald-600 rounded-xl group-hover:bg-emerald-500 group-hover:text-white transition-all">
                        <span className="material-symbols-outlined text-2xl">add_shopping_cart</span>
                      </div>
                    </button>
                  )}

                </div>
              </div>
              
              {/* Actividades Recientes Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                
                {/* Column Left: Últimos 3 Mensajes de Contacto */}
                <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <div>
                        <h3 className="font-bold text-sm text-on-surface">Últimos Mensajes de Soporte</h3>
                        <p className="text-xs text-slate-500">Consultas de contacto recibidas a través de la web.</p>
                      </div>
                      <button 
                        onClick={() => setActiveTab("messages")}
                        className="text-primary hover:text-red-700 text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer"
                      >
                        Ver todos
                        <span className="material-symbols-outlined text-xs">arrow_forward</span>
                      </button>
                    </div>
                    
                    <div className="divide-y divide-slate-100">
                      {filteredMensajes.length > 0 ? (
                        [...filteredMensajes]
                          .sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime())
                          .slice(0, 3)
                          .map((msg) => (
                            <div key={msg.id} className="py-4 flex items-start gap-4 transition-colors hover:bg-slate-50/50 rounded-xl px-2">
                              <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center font-bold text-xs text-slate-600 uppercase shrink-0 border border-slate-200">
                                {msg.nombre.substring(0, 2)}
                              </div>
                              <div className="flex-1 min-w-0 space-y-0.5">
                                <div className="flex justify-between items-baseline gap-2">
                                  <h4 className="font-bold text-xs text-on-surface truncate">{msg.nombre}</h4>
                                  <span className="text-[10px] text-slate-400 font-bold shrink-0">{formatDate(msg.fecha)}</span>
                                </div>
                                <p className="text-[10px] text-primary font-bold">{msg.asunto}</p>
                                <p className="text-xs text-slate-500 truncate leading-snug">{msg.mensaje}</p>
                              </div>
                              {!msg.leido && (
                                <span className="w-2 h-2 rounded-full bg-primary animate-pulse shrink-0 self-center" title="No leído"></span>
                              )}
                            </div>
                          ))
                      ) : (
                        <div className="py-8 text-center text-xs text-slate-400 font-medium">
                          No hay mensajes de contacto registrados.
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                {/* Column Right: Próximas 3 Licencias por Vencer */}
                <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <div>
                        <h3 className="font-bold text-sm text-on-surface">Próximos Vencimientos de Licencias</h3>
                        <p className="text-xs text-slate-500">Suscripciones vigentes ordenadas por proximidad de fin.</p>
                      </div>
                      <button 
                        onClick={() => setActiveTab("licenses")}
                        className="text-primary hover:text-red-700 text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer"
                      >
                        Gestionar todas
                        <span className="material-symbols-outlined text-xs">arrow_forward</span>
                      </button>
                    </div>
                    
                    <div className="divide-y divide-slate-100">
                      {(() => {
                        const upcoming = [...filteredLicencias]
                          .filter(l => l.fecha_fin && l.estado === "activo")
                          .sort((a, b) => new Date(a.fecha_fin!).getTime() - new Date(b.fecha_fin!).getTime())
                          .slice(0, 3);
                          
                        return upcoming.length > 0 ? (
                          upcoming.map((lic) => {
                            const urgency = getLicenseUrgency(lic.fecha_fin);
                            return (
                              <div key={lic.id} className="py-4 flex items-center justify-between gap-4 transition-colors hover:bg-slate-50/50 rounded-xl px-2">
                                <div className="min-w-0 flex-1 space-y-1">
                                  <div className="flex items-center gap-2">
                                    <span className="material-symbols-outlined text-sm text-slate-400 shrink-0">verified_user</span>
                                    <h4 className="font-bold text-xs text-on-surface truncate">{lic.software}</h4>
                                  </div>
                                  <p className="text-[10px] text-slate-500 font-bold pl-5 truncate">Cliente: {lic.nombre_cliente}</p>
                                  <p className="text-[10px] text-slate-400 pl-5">Vence: {formatDate(lic.fecha_fin)}</p>
                                </div>
                                <div className="shrink-0">
                                  {urgency === "expired" ? (
                                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-red-100 text-red-800 text-[9px] font-extrabold uppercase tracking-wide border border-red-200">
                                      Vencido
                                    </span>
                                  ) : urgency === "warning" ? (
                                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-orange-100 text-orange-800 text-[9px] font-extrabold uppercase tracking-wide border border-orange-200 animate-pulse">
                                      Por vencer
                                    </span>
                                  ) : (
                                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[9px] font-extrabold uppercase tracking-wide border border-emerald-200">
                                      Al día
                                    </span>
                                  )}
                                </div>
                              </div>
                            );
                          })
                        ) : (
                          <div className="py-8 text-center text-xs text-slate-400 font-medium">
                            No hay licencias activas próximas a vencer.
                          </div>
                        );
                      })()}
                    </div>
                  </div>
                </div>
                
              </div>
              
            </section>
          )}

          {/* TAB 1: License Management */}
          {activeTab === "licenses" && (
            <section className="animate-fade-in-up">
              <div className="flex justify-between items-end mb-6">
                <div>
                  <h2 className="text-xl font-bold text-on-surface">Gestión de Licencias de Software</h2>
                  <p className="text-xs text-slate-500 mt-0.5">Control centralizado de suscripciones, cuentas de correo y vigencias de clientes.</p>
                </div>
                {isAdmin && (
                  <button
                    onClick={() => setShowLicenseModal(true)}
                    className="bg-red-600 hover:bg-red-700 text-white text-xs font-bold px-5 py-3 rounded-xl transition-all active:scale-95 shadow-md shadow-red-600/10 flex items-center gap-2 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-base">add</span>
                    Registrar Licencia
                  </button>
                )}
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
                                {isAdmin && (
                                  <button
                                    onClick={() => openEditLicenseModal(lic)}
                                    className="text-slate-400 hover:text-red-600 p-1 transition-colors cursor-pointer"
                                    title="Editar"
                                  >
                                    <span className="material-symbols-outlined text-[18px]">edit</span>
                                  </button>
                                )}
                                {canDelete && (
                                  <button
                                    onClick={() => handleDeleteLicense(lic.id)}
                                    className="text-slate-400 hover:text-red-700 p-1 transition-colors cursor-pointer"
                                    title="Eliminar"
                                  >
                                    <span className="material-symbols-outlined text-[18px]">delete</span>
                                  </button>
                                )}
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
                {canEditTecnico && (
                  <button
                    onClick={() => setShowFileModal(true)}
                    className="bg-red-600 hover:bg-red-700 text-white text-xs font-bold px-5 py-3 rounded-xl transition-all active:scale-95 shadow-md shadow-red-600/10 flex items-center gap-2 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-base">cloud_upload</span>
                    Registrar Recurso
                  </button>
                )}
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
                              {(() => {
                                const name = file.nombre.toLowerCase();
                                const url = file.url_archivo.toLowerCase();
                                const isPdf = name.endsWith(".pdf") || url.includes(".pdf") || name.includes(" pdf");
                                const isExcel = name.endsWith(".xlsx") || name.endsWith(".xls") || url.includes(".xlsx") || url.includes(".xls") || name.includes("excel");
                                
                                let badgeBg = "bg-slate-100 text-slate-700 border-slate-200";
                                let badgeText = file.tipo.toUpperCase();
                                
                                if (isPdf) {
                                  badgeBg = "bg-red-50 text-red-600 border-red-100";
                                  badgeText = "PDF";
                                } else if (isExcel) {
                                  badgeBg = "bg-emerald-50 text-emerald-600 border-emerald-100";
                                  badgeText = "XLSX";
                                } else if (file.tipo === "driver") {
                                  badgeBg = "bg-blue-50 text-blue-600 border-blue-100";
                                  badgeText = "DRIVER";
                                } else if (file.tipo === "programa") {
                                  badgeBg = "bg-purple-50 text-purple-600 border-purple-100";
                                  badgeText = "PROGRAMA";
                                } else if (file.tipo === "link") {
                                  badgeBg = "bg-amber-50 text-amber-600 border-amber-100";
                                  badgeText = "LINK";
                                }

                                return (
                                  <span className={`inline-block px-2.5 py-1 rounded-md border text-[10px] font-bold uppercase tracking-wider ${badgeBg}`}>
                                    {badgeText}
                                  </span>
                                );
                              })()}
                            </td>
                            <td className="px-6 py-4 text-xs text-red-600 font-semibold max-w-[200px] truncate">
                              <a href={file.url_archivo} target="_blank" rel="noopener noreferrer" className="hover:underline flex items-center gap-1">
                                <span className="material-symbols-outlined text-sm">open_in_new</span>
                                {file.url_archivo}
                              </a>
                            </td>
                            <td className="px-6 py-4 text-xs text-slate-500">{formatDate(file.fecha_subida)}</td>
                            <td className="px-6 py-4 text-right">
                              {canDelete && (
                                <button
                                  onClick={() => handleDeleteFile(file.id)}
                                  className="text-slate-400 hover:text-red-700 p-1 transition-colors cursor-pointer"
                                >
                                  <span className="material-symbols-outlined text-[18px]">delete</span>
                                </button>
                              )}
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
                {canEditCatalogo && (
                  <button
                    onClick={() => {
                      setEditingProduct(null);
                      setFormProductName("");
                      setFormProductPrice("");
                      setFormProductDesc("");
                      setFormProductCategory(categorias[0]?.id ? String(categorias[0].id) : "");
                      setFormProductImages([""]);
                      setFormProductActive(true);
                      setShowProductModal(true);
                    }}
                    className="bg-red-600 hover:bg-red-700 text-white text-xs font-bold px-5 py-3 rounded-xl transition-all active:scale-95 shadow-md shadow-red-600/10 flex items-center gap-2 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-base">add</span>
                    Registrar Producto
                  </button>
                )}
              </div>

              {/* Products List Table */}
              <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200">
                        <th className="px-6 py-3.5 text-xs font-bold text-slate-500 uppercase tracking-wider">Producto</th>
                        <th className="px-6 py-3.5 text-xs font-bold text-slate-500 uppercase tracking-wider">Categoría</th>
                        <th className="px-6 py-3.5 text-xs font-bold text-slate-500 uppercase tracking-wider">Precio</th>
                        <th className="px-6 py-3.5 text-xs font-bold text-slate-500 uppercase tracking-wider">Descripción</th>
                        <th className="px-6 py-3.5 text-xs font-bold text-slate-500 uppercase tracking-wider">Estado</th>
                        <th className="px-6 py-3.5 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Acciones</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredProductos.length > 0 ? (
                        filteredProductos.map((prod) => (
                          <tr key={prod.id} className="hover:bg-slate-50/50 transition-colors">
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                {prod.imagen_url && !prod.imagen_url.includes("placeholder.png") ? (
                                  <img 
                                    src={(() => { const firstImg = prod.imagen_url!.split("||")[0]; return firstImg.startsWith("http") || firstImg.startsWith("/") ? firstImg : `/${firstImg}`; })()} 
                                    alt={prod.nombre} 
                                    className="w-10 h-10 object-contain rounded-lg border border-slate-200 bg-slate-50"
                                    onError={(e) => {
                                      const target = e.currentTarget as HTMLImageElement;
                                      target.onerror = null;
                                      target.src = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 40 40'><rect width='100%' height='100%' fill='%23f1f5f9'/><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='10' fill='%2394a3b8'>DELLCOM</text></svg>";
                                    }}
                                  />
                                ) : (
                                  <div className="w-10 h-10 rounded-lg border border-slate-200 bg-slate-100 flex items-center justify-center text-slate-400">
                                    <span className="material-symbols-outlined text-lg">image</span>
                                  </div>
                                )}
                                <span className="font-semibold text-sm text-on-surface">{prod.nombre}</span>
                              </div>
                            </td>
                            <td className="px-6 py-4 text-xs text-slate-600 font-semibold">
                              {prod.categoria?.nombre || "Sin Categoría"}
                            </td>
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
                            <td className="px-6 py-4 text-right space-x-2">
                              {canEditCatalogo && (
                                <button
                                  onClick={() => openEditProductModal(prod)}
                                  className="text-slate-400 hover:text-red-600 p-1 transition-colors cursor-pointer"
                                  title="Editar"
                                >
                                  <span className="material-symbols-outlined text-[18px]">edit</span>
                                </button>
                              )}
                              {canDelete && (
                                <button
                                  onClick={() => handleDeleteProduct(prod.id)}
                                  className="text-slate-400 hover:text-red-700 p-1 transition-colors cursor-pointer"
                                  title="Ocultar/Eliminar"
                                >
                                  <span className="material-symbols-outlined text-[18px]">delete</span>
                                </button>
                              )}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={6} className="px-6 py-12 text-center text-xs text-slate-500">
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

          {activeTab === "messages" && (
            <section className="animate-fade-in-up">
              <div className="flex justify-between items-end mb-6">
                <div>
                  <h2 className="text-xl font-bold text-on-surface">Mensajes de Contacto</h2>
                  <p className="text-xs text-slate-500 mt-0.5">Mensajes enviados por clientes a través del formulario de contacto público.</p>
                </div>
              </div>

              <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200">
                        <th className="px-6 py-3.5 text-xs font-bold text-slate-500 uppercase tracking-wider">Fecha</th>
                        <th className="px-6 py-3.5 text-xs font-bold text-slate-500 uppercase tracking-wider">Remitente</th>
                        <th className="px-6 py-3.5 text-xs font-bold text-slate-500 uppercase tracking-wider">Asunto</th>
                        <th className="px-6 py-3.5 text-xs font-bold text-slate-500 uppercase tracking-wider">Mensaje</th>
                        <th className="px-6 py-3.5 text-xs font-bold text-slate-500 uppercase tracking-wider">Estado</th>
                        <th className="px-6 py-3.5 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Acciones</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredMensajes.length > 0 ? (
                        filteredMensajes.map((msg) => (
                          <tr key={msg.id} className={`transition-colors hover:bg-slate-50/50 ${!msg.leido ? "bg-red-50/30 font-semibold" : ""}`}>
                            <td className="px-6 py-4 text-xs text-slate-500">{formatDate(msg.fecha)}</td>
                            <td className="px-6 py-4 text-xs text-on-surface">
                              <div>{msg.nombre}</div>
                              <div className="text-[10px] text-slate-400">{msg.correo}</div>
                              {msg.telefono && <div className="text-[10px] text-slate-400">{msg.telefono}</div>}
                            </td>
                            <td className="px-6 py-4 text-xs text-slate-600 font-semibold">{msg.asunto}</td>
                            <td
                              className="px-6 py-4 text-xs text-slate-500 max-w-xs truncate cursor-pointer hover:text-primary hover:underline"
                              title="Clic para ver el mensaje completo"
                              onClick={() => setSelectedMensaje(msg)}
                            >
                              {msg.mensaje}
                            </td>
                            <td className="px-6 py-4">
                              {msg.leido ? (
                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[10px] font-bold">
                                  Leído
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-red-100 text-red-800 text-[10px] font-bold">
                                  Nuevo
                                </span>
                              )}
                            </td>
                            <td className="px-6 py-4 text-right space-x-2">
                              <button
                                onClick={() => setSelectedMensaje(msg)}
                                className="text-slate-400 hover:text-primary p-1 transition-colors cursor-pointer"
                                title="Ver mensaje completo"
                              >
                                <span className="material-symbols-outlined text-[18px]">visibility</span>
                              </button>
                              <button
                                onClick={() => toggleMensajeLeido(msg.id, msg.leido)}
                                className="text-slate-400 hover:text-red-600 p-1 transition-colors cursor-pointer"
                                title={msg.leido ? "Marcar como no leído" : "Marcar como leído"}
                              >
                                <span className="material-symbols-outlined text-[18px]">
                                  {msg.leido ? "mark_email_unread" : "mark_email_read"}
                                </span>
                              </button>
                              {canDelete && (
                                <button
                                  onClick={() => handleDeleteMensaje(msg.id)}
                                  className="text-slate-400 hover:text-red-700 p-1 transition-colors cursor-pointer"
                                  title="Eliminar"
                                >
                                  <span className="material-symbols-outlined text-[18px]">delete</span>
                                </button>
                              )}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={6} className="px-6 py-12 text-center text-xs text-slate-500">
                            No se encontraron mensajes de contacto.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </section>
          )}

          {activeTab === "users" && (session?.user as any)?.role === "admin" && (
            <section className="animate-fade-in-up">
              <div className="flex justify-between items-end mb-6">
                <div>
                  <h2 className="text-xl font-bold text-on-surface">Gestión de Personal y Cuentas</h2>
                  <p className="text-xs text-slate-500 mt-0.5">Creación y control de acceso para técnicos y vendedores de DELLCOM SAC.</p>
                </div>
                <button 
                  onClick={() => setShowUserModal(true)}
                  className="bg-red-600 hover:bg-red-700 text-white text-xs font-bold px-5 py-3 rounded-xl transition-all active:scale-95 shadow-md shadow-red-600/10 flex items-center gap-2 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-base">person_add</span>
                  Registrar Personal
                </button>
              </div>

              <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200">
                        <th className="px-6 py-3.5 text-xs font-bold text-slate-500 uppercase tracking-wider">Nombre Completo</th>
                        <th className="px-6 py-3.5 text-xs font-bold text-slate-500 uppercase tracking-wider">Usuario</th>
                        <th className="px-6 py-3.5 text-xs font-bold text-slate-500 uppercase tracking-wider">Email</th>
                        <th className="px-6 py-3.5 text-xs font-bold text-slate-500 uppercase tracking-wider">Rol</th>
                        <th className="px-6 py-3.5 text-xs font-bold text-slate-500 uppercase tracking-wider">Estado</th>
                        <th className="px-6 py-3.5 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Acciones</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredUsuarios.length > 0 ? (
                        filteredUsuarios.map((u) => (
                          <tr key={u.id} className="transition-colors hover:bg-slate-50/50">
                            <td className="px-6 py-4 text-xs font-semibold text-on-surface">{u.nombre}</td>
                            <td className="px-6 py-4 text-xs text-slate-600">{u.usuario}</td>
                            <td className="px-6 py-4 text-xs text-slate-500">{u.email}</td>
                            <td className="px-6 py-4 text-xs">
                              <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                                u.rol === "admin" 
                                  ? "bg-red-100 text-red-800" 
                                  : u.rol === "tecnico" 
                                  ? "bg-blue-100 text-blue-800" 
                                  : "bg-slate-100 text-slate-800"
                              }`}>
                                {u.rol}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              {u.activo ? (
                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                                  Activo
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-400 text-[10px] font-bold">
                                  <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
                                  Desactivado
                                </span>
                              )}
                            </td>
                            <td className="px-6 py-4 text-right space-x-2">
                              <button
                                onClick={() => openEditUserModal(u)}
                                className="text-slate-400 hover:text-red-600 p-1 transition-colors cursor-pointer"
                                title="Editar"
                              >
                                <span className="material-symbols-outlined text-[18px]">edit</span>
                              </button>
                              <button
                                onClick={() => handleToggleUserStatus(u.id, u.activo)}
                                className="text-slate-400 hover:text-red-700 p-1 transition-colors cursor-pointer"
                                title={u.activo ? "Desactivar Cuenta" : "Activar Cuenta"}
                              >
                                <span className="material-symbols-outlined text-[18px]">
                                  {u.activo ? "block" : "check_circle"}
                                </span>
                              </button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={6} className="px-6 py-12 text-center text-xs text-slate-500">
                            No se encontraron usuarios registrados.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </section>
          )}

          {/* TAB 6: Services Management */}
          {activeTab === "services" && (
            <section className="animate-fade-in-up">
              <div className="flex justify-between items-end mb-6">
                <div>
                  <h2 className="text-xl font-bold text-on-surface">Gestión de Servicios de TI</h2>
                  <p className="text-xs text-slate-500 mt-0.5">Control del catálogo público de servicios que se ofrecen al cliente.</p>
                </div>
                {canEditCatalogo && (
                  <button
                    onClick={() => setShowServiceModal(true)}
                    className="bg-red-600 hover:bg-red-700 text-white text-xs font-bold px-5 py-3 rounded-xl transition-all active:scale-95 shadow-md shadow-red-600/10 flex items-center gap-2 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-base">add</span>
                    Crear Servicio
                  </button>
                )}
              </div>

              <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200">
                        <th className="px-6 py-3.5 text-xs font-bold text-slate-500 uppercase tracking-wider">Nombre del Servicio</th>
                        <th className="px-6 py-3.5 text-xs font-bold text-slate-500 uppercase tracking-wider">Descripción</th>
                        <th className="px-6 py-3.5 text-xs font-bold text-slate-500 uppercase tracking-wider">Icono (Google)</th>
                        <th className="px-6 py-3.5 text-xs font-bold text-slate-500 uppercase tracking-wider">Estado</th>
                        <th className="px-6 py-3.5 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Acciones</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredServicios.length > 0 ? (
                        filteredServicios.map((srv) => (
                          <tr key={srv.id} className="transition-colors hover:bg-slate-50/50">
                            <td className="px-6 py-4 text-xs font-semibold text-on-surface">{srv.nombre}</td>
                            <td className="px-6 py-4 text-xs text-slate-600 max-w-xs truncate">{srv.descripcion}</td>
                            <td className="px-6 py-4 text-xs text-slate-500 font-mono">
                              <span className="flex items-center gap-1.5">
                                <span className="material-symbols-outlined text-sm">{srv.icono_url || "laptop_mac"}</span>
                                {srv.icono_url || "laptop_mac"}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              {srv.activo ? (
                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                                  Activo
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-400 text-[10px] font-bold">
                                  Inactivo
                                </span>
                              )}
                            </td>
                            <td className="px-6 py-4 text-right space-x-2">
                              {canEditCatalogo && (
                                <button
                                  onClick={() => openEditServiceModal(srv)}
                                  className="text-slate-400 hover:text-red-600 p-1 transition-colors cursor-pointer"
                                  title="Editar"
                                >
                                  <span className="material-symbols-outlined text-[18px]">edit</span>
                                </button>
                              )}
                              {canDelete && (
                                <button
                                  onClick={() => handleDeleteService(srv.id)}
                                  className="text-slate-400 hover:text-red-700 p-1 transition-colors cursor-pointer"
                                  title="Desactivar"
                                >
                                  <span className="material-symbols-outlined text-[18px]">block</span>
                                </button>
                              )}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={5} className="px-6 py-12 text-center text-xs text-slate-500">
                            No se encontraron servicios registrados.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </section>
          )}

          {/* TAB 7: Portfolio Management */}
          {activeTab === "portfolio" && (
            <section className="animate-fade-in-up">
              <div className="flex justify-between items-end mb-6">
                <div>
                  <h2 className="text-xl font-bold text-on-surface">Trabajos Realizados (Portafolio)</h2>
                  <p className="text-xs text-slate-500 mt-0.5">Galería de imágenes de trabajos reales del taller y en campo.</p>
                </div>
                {canEditTecnico && (
                  <button
                    onClick={() => setShowPortfolioModal(true)}
                    className="bg-red-600 hover:bg-red-700 text-white text-xs font-bold px-5 py-3 rounded-xl transition-all active:scale-95 shadow-md shadow-red-600/10 flex items-center gap-2 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-base">add_a_photo</span>
                    Registrar Trabajo
                  </button>
                )}
              </div>

              <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200">
                        <th className="px-6 py-3.5 text-xs font-bold text-slate-500 uppercase tracking-wider">Imagen</th>
                        <th className="px-6 py-3.5 text-xs font-bold text-slate-500 uppercase tracking-wider">Título del Trabajo</th>
                        <th className="px-6 py-3.5 text-xs font-bold text-slate-500 uppercase tracking-wider">Asociado a Servicio</th>
                        <th className="px-6 py-3.5 text-xs font-bold text-slate-500 uppercase tracking-wider">Fecha Registro</th>
                        <th className="px-6 py-3.5 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Acciones</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredTrabajos.length > 0 ? (
                        filteredTrabajos.map((job) => (
                          <tr key={job.id} className="transition-colors hover:bg-slate-50/50">
                            <td className="px-6 py-3">
                              <div className="w-12 h-12 rounded-xl overflow-hidden border border-slate-200 bg-slate-50 flex items-center justify-center">
                                <img src={job.imagen_url.split("||")[0]} alt={job.titulo} className="w-full h-full object-cover" />
                              </div>
                            </td>
                            <td className="px-6 py-4 text-xs font-semibold text-on-surface">
                              <div>
                                <p className="font-bold">{job.titulo}</p>
                                <p className="text-[10px] text-slate-400 font-normal mt-0.5 line-clamp-1">{job.descripcion}</p>
                              </div>
                            </td>
                            <td className="px-6 py-4 text-xs text-slate-600">
                              {job.servicio?.nombre || <span className="text-slate-400 italic">Ninguno</span>}
                            </td>
                            <td className="px-6 py-4 text-xs text-slate-500">
                              {formatDate(job.fecha)}
                            </td>
                            <td className="px-6 py-4 text-right space-x-2">
                              {canEditTecnico && (
                                <button
                                  onClick={() => openEditPortfolioModal(job)}
                                  className="text-slate-400 hover:text-red-600 p-1 transition-colors cursor-pointer"
                                  title="Editar"
                                >
                                  <span className="material-symbols-outlined text-[18px]">edit</span>
                                </button>
                              )}
                              {canDelete && (
                                <button
                                  onClick={() => handleDeletePortfolio(job.id)}
                                  className="text-slate-400 hover:text-red-700 p-1 transition-colors cursor-pointer"
                                  title="Eliminar"
                                >
                                  <span className="material-symbols-outlined text-[18px]">delete</span>
                                </button>
                              )}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={5} className="px-6 py-12 text-center text-xs text-slate-500">
                            No se encontraron trabajos de portafolio registrados.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </section>
          )}

          {/* TAB 8: Category Management */}
          {activeTab === "categories" && (
            <section className="animate-fade-in-up">
              <div className="flex justify-between items-end mb-6">
                <div>
                  <h2 className="text-xl font-bold text-on-surface">Categorías de Productos</h2>
                  <p className="text-xs text-slate-500 mt-0.5">Gestión de las categorías del catálogo virtual de suministros y hardware.</p>
                </div>
                {canEditCatalogo && (
                  <button
                    onClick={() => setShowCategoryModal(true)}
                    className="bg-red-600 hover:bg-red-700 text-white text-xs font-bold px-5 py-3 rounded-xl transition-all active:scale-95 shadow-md shadow-red-600/10 flex items-center gap-2 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-base">add</span>
                    Crear Categoría
                  </button>
                )}
              </div>

              <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm max-w-2xl">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200">
                        <th className="px-6 py-3.5 text-xs font-bold text-slate-500 uppercase tracking-wider">Nombre de la Categoría</th>
                        <th className="px-6 py-3.5 text-xs font-bold text-slate-500 uppercase tracking-wider">Estado</th>
                        <th className="px-6 py-3.5 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Acciones</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredCategorias.length > 0 ? (
                        filteredCategorias.map((cat) => (
                          <tr key={cat.id} className="transition-colors hover:bg-slate-50/50">
                            <td className="px-6 py-4 text-xs font-semibold text-on-surface">{cat.nombre}</td>
                            <td className="px-6 py-4 text-xs">
                              {cat.activo ? (
                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                                  Activo
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-400 text-[10px] font-bold">
                                  Inactivo
                                </span>
                              )}
                            </td>
                            <td className="px-6 py-4 text-right space-x-2">
                              {canEditCatalogo && (
                                <button
                                  onClick={() => openEditCategoryModal(cat)}
                                  className="text-slate-400 hover:text-red-600 p-1 transition-colors cursor-pointer"
                                  title="Editar"
                                >
                                  <span className="material-symbols-outlined text-[18px]">edit</span>
                                </button>
                              )}
                              {canDelete && (
                                <button
                                  onClick={() => handleDeleteCategory(cat.id)}
                                  className="text-slate-400 hover:text-red-700 p-1 transition-colors cursor-pointer"
                                  title="Desactivar"
                                >
                                  <span className="material-symbols-outlined text-[18px]">block</span>
                                </button>
                              )}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={3} className="px-6 py-12 text-center text-xs text-slate-500">
                            No se encontraron categorías registradas.
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
              <button onClick={closeLicenseModal} className="text-slate-400 hover:text-slate-700 transition-colors cursor-pointer">
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
                    onChange={(e) => setFormTelefono(e.target.value.replace(/\D/g, "").slice(0, 15))}
                    placeholder="Ej. 987654321"
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
                  className="px-5 py-3 border border-slate-200 hover:bg-slate-50 rounded-xl text-xs font-bold transition-all cursor-pointer"
                >
                  Cancelar
                </button>
                <button 
                  type="submit" 
                  className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold transition-all active:scale-95 shadow-md shadow-red-600/10 cursor-pointer"
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
              <button onClick={closeFileModal} className="text-slate-400 hover:text-slate-700 transition-colors cursor-pointer">
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
                  onChange={(e) => handleFileNameChange(e.target.value)}
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
                    type="text" 
                    required
                    value={formFileUrl}
                    onChange={(e) => handleFileUrlChange(e.target.value)}
                    placeholder="https://drive.google.com/..."
                    className="w-full bg-slate-50 border border-slate-200 focus:border-red-600 focus:ring-1 focus:ring-red-600 focus:outline-none rounded-xl px-4 py-3 text-sm transition-all font-mono text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1 font-bold">Subir Archivo de Soporte (Carga Física)</label>
                <input 
                  type="file" 
                  onChange={(e) => handleUploadFile(e, "file")}
                  disabled={uploading}
                  className="w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-slate-100 file:text-slate-700 hover:file:bg-slate-200 cursor-pointer"
                />
                {uploading ? (
                  <p className="text-[10px] text-primary font-bold mt-1 animate-pulse">Subiendo archivo...</p>
                ) : (
                  <p className="text-[9px] text-slate-400 mt-1">Límite de 4.5MB para carga directa. Para archivos más pesados, coloca el enlace directo arriba.</p>
                )}
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
                  className="px-5 py-3 border border-slate-200 hover:bg-slate-50 rounded-xl text-xs font-bold transition-all cursor-pointer"
                >
                  Cancelar
                </button>
                <button 
                  type="submit" 
                  className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold transition-all active:scale-95 shadow-md shadow-red-600/10 cursor-pointer"
                >
                  Guardar Recurso
                </button>
              </footer>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: Create or Edit Product */}
      {showProductModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-xl shadow-2xl relative overflow-hidden">
            <header className="px-8 py-5 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h3 className="font-bold text-base text-on-surface">
                {editingProduct ? "Editar Producto del Catálogo" : "Registrar Nuevo Producto"}
              </h3>
              <button onClick={closeProductModal} className="text-slate-400 hover:text-slate-700 transition-colors cursor-pointer">
                <span className="material-symbols-outlined">close</span>
              </button>
            </header>

            <form onSubmit={handleCreateOrUpdateProduct} className="p-8 space-y-4 max-h-[70vh] overflow-y-auto custom-scrollbar">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Nombre del Producto</label>
                  <input 
                    type="text" 
                    required
                    value={formProductName}
                    onChange={(e) => setFormProductName(e.target.value)}
                    placeholder="Ribbon de Cera Zebra 110mm x 74m"
                    className="w-full bg-slate-50 border border-slate-200 focus:border-red-600 focus:ring-1 focus:ring-red-600 focus:outline-none rounded-xl px-4 py-3 text-sm transition-all"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Precio (S/.)</label>
                  <input 
                    type="number" 
                    step="0.01"
                    min="0"
                    required
                    value={formProductPrice}
                    onChange={(e) => setFormProductPrice(e.target.value)}
                    placeholder="45.00"
                    className="w-full bg-slate-50 border border-slate-200 focus:border-red-600 focus:ring-1 focus:ring-red-600 focus:outline-none rounded-xl px-4 py-3 text-sm transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Categoría</label>
                <select
                  required
                  value={formProductCategory}
                  onChange={(e) => setFormProductCategory(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 focus:border-red-600 focus:ring-1 focus:ring-red-600 focus:outline-none rounded-xl px-4 py-3 text-sm transition-all"
                >
                  <option value="">Seleccione una categoría</option>
                  {categorias.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.nombre}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">Imágenes del Producto</label>
                  {formProductImages.length < 5 && (
                    <button
                      type="button"
                      onClick={addProductImage}
                      className="text-[10px] font-bold text-red-600 hover:text-red-700 flex items-center gap-1 cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-sm">add_photo_alternate</span>
                      Agregar imagen
                    </button>
                  )}
                </div>
                <div className="space-y-3">
                  {formProductImages.map((imgUrl, idx) => (
                    <div
                      key={idx}
                      className={`border-2 border-dashed rounded-xl p-3 space-y-1.5 transition-all duration-200 ${
                        draggingProductImgIdx === idx
                          ? "border-red-500 bg-red-50/30 dark:bg-red-500/10 scale-[1.01]"
                          : imgUrl.trim()
                            ? "border-slate-200 dark:border-slate-600 bg-slate-50/50 dark:bg-slate-700/50 border-solid"
                            : "border-slate-300 dark:border-slate-500 bg-slate-50/30 dark:bg-slate-700/30"
                      }`}
                      onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); setDraggingProductImgIdx(idx); }}
                      onDragEnter={(e) => { e.preventDefault(); e.stopPropagation(); setDraggingProductImgIdx(idx); }}
                      onDragLeave={(e) => { e.preventDefault(); e.stopPropagation(); if (draggingProductImgIdx === idx) setDraggingProductImgIdx(null); }}
                      onDrop={(e) => {
                        e.preventDefault(); e.stopPropagation();
                        setDraggingProductImgIdx(null);
                        const file = e.dataTransfer.files?.[0];
                        if (file) handleProductDrop(file, idx);
                      }}
                    >
                      {/* Drop zone hint when empty and dragging */}
                      {draggingProductImgIdx === idx && (
                        <div className="flex items-center justify-center gap-2 py-2 text-red-500 dark:text-red-400">
                          <span className="material-symbols-outlined text-lg animate-bounce">cloud_upload</span>
                          <span className="text-[11px] font-bold">Suelta la imagen aquí</span>
                        </div>
                      )}
                      <div className={`flex gap-2 items-center ${draggingProductImgIdx === idx ? "opacity-50" : ""}`}>
                        {/* Thumbnail preview beside input */}
                        <div className="img-thumb-wrap shrink-0 w-12 h-12 rounded-lg overflow-hidden bg-white dark:bg-slate-600 border border-slate-200 dark:border-slate-500 flex items-center justify-center">
                          {imgUrl.trim() ? (
                            <img
                              src={imgUrl}
                              alt={`Vista previa ${idx + 1}`}
                              className="w-full h-full object-cover"
                              onError={(e) => { (e.target as HTMLImageElement).src = ""; (e.target as HTMLImageElement).style.display = "none"; }}
                            />
                          ) : (
                            <span className="material-symbols-outlined text-slate-300 dark:text-slate-400 text-xl leading-none">image</span>
                          )}
                        </div>
                        <input
                          type="text"
                          value={imgUrl}
                          onChange={(e) => updateProductImage(idx, e.target.value)}
                          placeholder="Arrastra una imagen aquí o pega URL →"
                          className="flex-1 bg-white dark:bg-slate-600 border border-slate-200 dark:border-slate-500 focus:border-red-600 focus:ring-1 focus:ring-red-600 focus:outline-none rounded-xl px-3 py-2.5 text-xs transition-all font-mono dark:text-slate-100 dark:placeholder:text-slate-400"
                        />
                        <label
                          htmlFor={`prod-img-file-${idx}`}
                          className="shrink-0 px-3 py-2.5 bg-slate-800 hover:bg-slate-700 dark:bg-slate-500 dark:hover:bg-slate-400 text-white rounded-xl text-[10px] font-bold cursor-pointer flex items-center gap-1 transition-colors"
                        >
                          <span className="material-symbols-outlined text-sm leading-none">upload</span>
                          Subir
                          <input
                            type="file"
                            id={`prod-img-file-${idx}`}
                            accept="image/*"
                            onChange={(e) => handleUploadFile(e, "product", idx)}
                            disabled={uploadingProductIdx !== null}
                            className="hidden"
                          />
                        </label>
                        {formProductImages.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeProductImage(idx)}
                            className="shrink-0 p-2 text-slate-400 hover:text-red-600 dark:hover:text-red-400 transition-colors rounded-lg hover:bg-red-50 dark:hover:bg-red-500/10 cursor-pointer"
                            title="Quitar imagen"
                          >
                            <span className="material-symbols-outlined text-sm leading-none">delete</span>
                          </button>
                        )}
                      </div>
                      {uploadingProductIdx === idx && (
                        <p className="text-[10px] text-primary font-bold animate-pulse pl-14">Subiendo imagen {idx + 1}...</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Descripción del Producto</label>
                <textarea 
                  value={formProductDesc}
                  onChange={(e) => setFormProductDesc(e.target.value)}
                  placeholder="Ribbon de cera de alta sensibilidad para impresoras de etiquetas Zebra..."
                  rows={3}
                  className="w-full bg-slate-50 border border-slate-200 focus:border-red-600 focus:ring-1 focus:ring-red-600 focus:outline-none rounded-xl px-4 py-3 text-sm transition-all"
                />
              </div>

              <div className="flex items-center gap-2 py-2">
                <input 
                  type="checkbox" 
                  id="formProductActive"
                  checked={formProductActive}
                  onChange={(e) => setFormProductActive(e.target.checked)}
                  className="w-4 h-4 rounded text-red-600 border-slate-200 focus:ring-red-600 focus:outline-none"
                />
                <label htmlFor="formProductActive" className="text-xs font-semibold text-slate-700 select-none cursor-pointer">
                  Producto activo y visible en el catálogo virtual público
                </label>
              </div>

              <footer className="pt-4 border-t border-slate-100 flex justify-end gap-3">
                <button 
                  type="button" 
                  onClick={closeProductModal}
                  className="px-5 py-3 border border-slate-200 hover:bg-slate-50 rounded-xl text-xs font-bold transition-all cursor-pointer"
                >
                  Cancelar
                </button>
                <button 
                  type="submit" 
                  className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold transition-all active:scale-95 shadow-md shadow-red-600/10 cursor-pointer"
                >
                  {editingProduct ? "Actualizar Cambios" : "Guardar Producto"}
                </button>
              </footer>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 4: Create or Edit User */}
      {showUserModal && (session?.user as any)?.role === "admin" && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-lg shadow-2xl relative overflow-hidden">
            <header className="px-8 py-5 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h3 className="font-bold text-base text-on-surface">
                {editingUser ? "Editar Personal / Usuario" : "Registrar Nuevo Personal"}
              </h3>
              <button onClick={closeUserModal} className="text-slate-400 hover:text-slate-700 transition-colors cursor-pointer">
                <span className="material-symbols-outlined">close</span>
              </button>
            </header>

            <form onSubmit={handleCreateOrUpdateUser} className="p-8 space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Nombre Completo</label>
                <input
                  type="text"
                  required
                  value={formUserNombre}
                  onChange={(e) => setFormUserNombre(e.target.value)}
                  placeholder="Ej. Juan Pérez"
                  className="w-full bg-slate-50 border border-slate-200 focus:border-red-600 focus:ring-1 focus:ring-red-600 focus:outline-none rounded-xl px-4 py-3 text-sm transition-all"
                />
              </div>

              {editingUser ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Nombre de Usuario</label>
                    <input
                      type="text"
                      required
                      value={formUserUsuario}
                      onChange={(e) => setFormUserUsuario(e.target.value)}
                      placeholder="Ej. jperez"
                      className="w-full bg-slate-50 border border-slate-200 focus:border-red-600 focus:ring-1 focus:ring-red-600 focus:outline-none rounded-xl px-4 py-3 text-sm transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Rol</label>
                    <select
                      value={formUserRol}
                      onChange={(e) => setFormUserRol(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 focus:border-red-600 focus:ring-1 focus:ring-red-600 focus:outline-none rounded-xl px-4 py-3 text-sm transition-all"
                    >
                      <option value="tecnico">Técnico</option>
                      <option value="vendedor">Vendedor</option>
                      <option value="admin">Administrador</option>
                    </select>
                  </div>
                </div>
              ) : (
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Rol</label>
                  <select
                    value={formUserRol}
                    onChange={(e) => setFormUserRol(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 focus:border-red-600 focus:ring-1 focus:ring-red-600 focus:outline-none rounded-xl px-4 py-3 text-sm transition-all"
                  >
                    <option value="tecnico">Técnico</option>
                    <option value="vendedor">Vendedor</option>
                    <option value="admin">Administrador</option>
                  </select>
                </div>
              )}

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Correo Electrónico</label>
                <input
                  type="email"
                  required
                  value={formUserEmail}
                  onChange={(e) => setFormUserEmail(e.target.value)}
                  placeholder="Ej. jperez@dellcom.pe"
                  className="w-full bg-slate-50 border border-slate-200 focus:border-red-600 focus:ring-1 focus:ring-red-600 focus:outline-none rounded-xl px-4 py-3 text-sm transition-all"
                />
              </div>

              {editingUser ? (
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                    Contraseña (Dejar en blanco para conservar actual)
                  </label>
                  <input
                    type="password"
                    value={formUserContrasena}
                    onChange={(e) => setFormUserContrasena(e.target.value)}
                    placeholder="Mínimo 6 caracteres"
                    className="w-full bg-slate-50 border border-slate-200 focus:border-red-600 focus:ring-1 focus:ring-red-600 focus:outline-none rounded-xl px-4 py-3 text-sm transition-all"
                  />
                </div>
              ) : (
                <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 flex items-start gap-3">
                  <span className="material-symbols-outlined text-amber-500 text-base mt-0.5 shrink-0">info</span>
                  <p className="text-xs text-amber-700 font-semibold leading-relaxed">
                    El usuario y contraseña temporal serán generados automáticamente y enviados al correo ingresado. El personal deberá establecer su propia contraseña al primer ingreso.
                  </p>
                </div>
              )}

              <footer className="pt-4 border-t border-slate-100 flex justify-end gap-3">
                <button 
                  type="button" 
                  onClick={closeUserModal}
                  className="px-5 py-3 border border-slate-200 hover:bg-slate-50 rounded-xl text-xs font-bold transition-all cursor-pointer"
                >
                  Cancelar
                </button>
                <button 
                  type="submit" 
                  className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold transition-all active:scale-95 shadow-md shadow-red-600/10 cursor-pointer"
                >
                  {editingUser ? "Actualizar Cambios" : "Guardar Personal"}
                </button>
              </footer>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 5: Create or Edit Service */}
      {showServiceModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-xl shadow-2xl relative overflow-hidden">
            <header className="px-8 py-5 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h3 className="font-bold text-base text-on-surface">
                {editingService ? "Editar Servicio" : "Registrar Nuevo Servicio"}
              </h3>
              <button onClick={closeServiceModal} className="text-slate-400 hover:text-slate-700 transition-colors border-none bg-transparent cursor-pointer">
                <span className="material-symbols-outlined">close</span>
              </button>
            </header>

            <form onSubmit={handleCreateOrUpdateService} className="p-8 space-y-4 max-h-[70vh] overflow-y-auto custom-scrollbar">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Nombre del Servicio</label>
                <input 
                  type="text" 
                  required
                  value={formServiceName}
                  onChange={(e) => setFormServiceName(e.target.value)}
                  placeholder="Ej: Mantenimiento Electrónico"
                  className="w-full bg-slate-50 border border-slate-200 focus:border-red-600 focus:ring-1 focus:ring-red-600 focus:outline-none rounded-xl px-4 py-3 text-sm transition-all"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Descripción del Servicio</label>
                <textarea 
                  required
                  value={formServiceDesc}
                  onChange={(e) => setFormServiceDesc(e.target.value)}
                  placeholder="Detalle estructurado del servicio técnico..."
                  rows={4}
                  className="w-full bg-slate-50 border border-slate-200 focus:border-red-600 focus:ring-1 focus:ring-red-600 focus:outline-none rounded-xl px-4 py-3 text-sm transition-all resize-none"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Icono del Servicio</label>
                
                {/* Grid de Iconos Comunes */}
                <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 mb-3">
                  {[
                    { name: "laptop_mac", label: "Laptop" },
                    { name: "devices", label: "Equipos" },
                    { name: "memory", label: "Chip/Placa" },
                    { name: "dns", label: "Servidores" },
                    { name: "lan", label: "Red / LAN" },
                    { name: "router", label: "Router/Wifi" },
                    { name: "print", label: "Impresora" },
                    { name: "verified_user", label: "Licencia" },
                    { name: "security", label: "Seguridad" },
                    { name: "support_agent", label: "Soporte" },
                    { name: "mail", label: "Correo" },
                    { name: "psychology", label: "Asesoría" }
                  ].map((ico) => {
                    const isSelected = formServiceIcon === ico.name;
                    return (
                      <button
                        key={ico.name}
                        type="button"
                        onClick={() => setFormServiceIcon(ico.name)}
                        className={`flex flex-col items-center justify-center p-2.5 rounded-xl border text-center transition-all cursor-pointer select-none ${
                          isSelected
                            ? "bg-red-50 border-red-600 text-red-600 font-bold"
                            : "bg-slate-50 border-slate-200 text-slate-500 hover:bg-slate-100 hover:text-slate-700"
                        }`}
                      >
                        <span className="material-symbols-outlined text-lg mb-1">{ico.name}</span>
                        <span className="text-[9px] block truncate max-w-full leading-none">{ico.label}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Input para Icono Personalizado */}
                <div className="flex gap-3 items-center">
                  <div className="flex-1">
                    <input 
                      type="text" 
                      required
                      value={formServiceIcon}
                      onChange={(e) => setFormServiceIcon(e.target.value)}
                      placeholder="Nombre de icono personalizado (ej: computer)"
                      className="w-full bg-slate-50 border border-slate-200 focus:border-red-600 focus:ring-1 focus:ring-red-600 focus:outline-none rounded-xl px-4 py-2 text-xs transition-all font-mono"
                    />
                  </div>
                  <div className="w-10 h-10 border border-slate-200 rounded-xl bg-slate-50 flex items-center justify-center text-red-600 shadow-sm shrink-0">
                    <span className="material-symbols-outlined text-lg">{formServiceIcon || "help"}</span>
                  </div>
                </div>
                <span className="text-[9px] text-slate-400 mt-1.5 block">
                  Puedes seleccionar un icono predeterminado arriba o escribir uno libremente desde <a href="https://fonts.google.com/icons" target="_blank" rel="noopener noreferrer" className="text-red-600 hover:underline">Google Icons</a>.
                </span>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input 
                  type="checkbox"
                  id="formServiceActive"
                  checked={formServiceActive}
                  onChange={(e) => setFormServiceActive(e.target.checked)}
                  className="h-4 w-4 rounded border-slate-300 text-red-600 focus:ring-red-600"
                />
                <label htmlFor="formServiceActive" className="text-xs font-bold text-slate-600 cursor-pointer">Servicio Activo (Visible al Público)</label>
              </div>

              <footer className="pt-4 border-t border-slate-100 flex justify-end gap-3">
                <button 
                  type="button" 
                  onClick={closeServiceModal}
                  className="px-5 py-3 border border-slate-200 hover:bg-slate-50 rounded-xl text-xs font-bold transition-all cursor-pointer"
                >
                  Cancelar
                </button>
                <button 
                  type="submit" 
                  className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold transition-all active:scale-95 shadow-md shadow-red-600/10 cursor-pointer"
                >
                  {editingService ? "Actualizar Servicio" : "Guardar Servicio"}
                </button>
              </footer>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 6: Create or Edit Portfolio Job */}
      {showPortfolioModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-xl shadow-2xl relative overflow-hidden">
            <header className="px-8 py-5 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h3 className="font-bold text-base text-on-surface">
                {editingPortfolio ? "Editar Trabajo de Portafolio" : "Registrar Trabajo en Portafolio"}
              </h3>
              <button onClick={closePortfolioModal} className="text-slate-400 hover:text-slate-700 transition-colors border-none bg-transparent cursor-pointer">
                <span className="material-symbols-outlined">close</span>
              </button>
            </header>

            <form onSubmit={handleCreateOrUpdatePortfolio} className="p-8 space-y-4 max-h-[70vh] overflow-y-auto custom-scrollbar">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Título del Trabajo</label>
                <input 
                  type="text" 
                  required
                  value={formPortfolioTitle}
                  onChange={(e) => setFormPortfolioTitle(e.target.value)}
                  placeholder="Ej: Cableado Estructurado en Laboratorio"
                  className="w-full bg-slate-50 border border-slate-200 focus:border-red-600 focus:ring-1 focus:ring-red-600 focus:outline-none rounded-xl px-4 py-3 text-sm transition-all"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Descripción corta</label>
                <textarea 
                  value={formPortfolioDesc}
                  onChange={(e) => setFormPortfolioDesc(e.target.value)}
                  placeholder="Detalles sobre lo realizado en este proyecto técnico..."
                  rows={3}
                  className="w-full bg-slate-50 border border-slate-200 focus:border-red-600 focus:ring-1 focus:ring-red-600 focus:outline-none rounded-xl px-4 py-3 text-sm transition-all resize-none"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Asociar a un Servicio de la Web</label>
                <select 
                  value={formPortfolioServiceId}
                  onChange={(e) => setFormPortfolioServiceId(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 focus:border-red-600 focus:ring-1 focus:ring-red-600 focus:outline-none rounded-xl px-4 py-3 text-sm transition-all"
                >
                  <option value="">Ninguno / General</option>
                  {servicios.map((s) => (
                    <option key={s.id} value={s.id}>{s.nombre}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Foto principal (portada)</label>
                <div
                  className={`border-2 border-dashed rounded-xl p-3 space-y-2 transition-all duration-200 ${
                    draggingPortfolioMain
                      ? "border-red-500 bg-red-50/30 scale-[1.01]"
                      : formPortfolioImgUrl
                        ? "border-slate-200 bg-slate-50/50 border-solid"
                        : "border-slate-300 bg-slate-50/30"
                  }`}
                  onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); setDraggingPortfolioMain(true); }}
                  onDragEnter={(e) => { e.preventDefault(); e.stopPropagation(); setDraggingPortfolioMain(true); }}
                  onDragLeave={(e) => { e.preventDefault(); e.stopPropagation(); setDraggingPortfolioMain(false); }}
                  onDrop={(e) => {
                    e.preventDefault(); e.stopPropagation();
                    setDraggingPortfolioMain(false);
                    const file = e.dataTransfer.files?.[0];
                    if (file) handlePortfolioMainDrop(file);
                  }}
                >
                  {draggingPortfolioMain && (
                    <div className="flex items-center justify-center gap-2 py-2 text-red-500">
                      <span className="material-symbols-outlined text-lg animate-bounce">cloud_upload</span>
                      <span className="text-[11px] font-bold">Suelta la imagen aquí</span>
                    </div>
                  )}
                  <div className={`flex gap-3 items-center ${draggingPortfolioMain ? "opacity-50" : ""}`}>
                    {formPortfolioImgUrl && (
                      <img src={formPortfolioImgUrl} alt="portada" className="w-12 h-12 object-cover rounded-xl border border-slate-200 shrink-0" />
                    )}
                    <input
                      type="text"
                      required
                      value={formPortfolioImgUrl}
                      onChange={(e) => setFormPortfolioImgUrl(e.target.value)}
                      placeholder="Arrastra una imagen aquí o pega URL →"
                      className="flex-1 bg-white border border-slate-200 focus:border-red-600 focus:ring-1 focus:ring-red-600 focus:outline-none rounded-xl px-4 py-3 text-sm transition-all"
                    />
                    <div className="relative shrink-0">
                      <input
                        type="file"
                        id="formPortfolioImgFile"
                        onChange={(e) => handleUploadFile(e, "portfolio")}
                        className="hidden"
                        accept="image/*"
                      />
                      <label
                        htmlFor="formPortfolioImgFile"
                        className="px-4 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold transition-all cursor-pointer inline-flex items-center gap-1.5"
                      >
                        {uploading
                          ? <span className="material-symbols-outlined text-sm animate-spin">progress_activity</span>
                          : <span className="material-symbols-outlined text-sm">upload</span>
                        }
                        Subir
                      </label>
                    </div>
                  </div>
                  {uploading && <span className="text-[10px] text-red-600 font-bold block">Cargando archivo...</span>}
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">Fotos adicionales (carrusel)</label>
                  <button
                    type="button"
                    onClick={() => setFormPortfolioExtraImgs(prev => [...prev, ""])}
                    className="inline-flex items-center gap-1 text-[10px] font-bold text-red-600 hover:text-red-700 transition-colors cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-sm">add_photo_alternate</span>
                    Agregar foto
                  </button>
                </div>
                {formPortfolioExtraImgs.length === 0 && (
                  <p className="text-[10px] text-slate-400 italic">Sin fotos adicionales — solo se mostrará la portada en el carrusel.</p>
                )}
                <div className="space-y-2">
                  {formPortfolioExtraImgs.map((url, idx) => (
                    <div
                      key={idx}
                      className={`border-2 border-dashed rounded-xl p-2.5 transition-all duration-200 ${
                        draggingPortfolioExtraIdx === idx
                          ? "border-red-500 bg-red-50/30 scale-[1.01]"
                          : url.trim()
                            ? "border-slate-200 bg-slate-50/50 border-solid"
                            : "border-slate-300 bg-slate-50/30"
                      }`}
                      onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); setDraggingPortfolioExtraIdx(idx); }}
                      onDragEnter={(e) => { e.preventDefault(); e.stopPropagation(); setDraggingPortfolioExtraIdx(idx); }}
                      onDragLeave={(e) => { e.preventDefault(); e.stopPropagation(); if (draggingPortfolioExtraIdx === idx) setDraggingPortfolioExtraIdx(null); }}
                      onDrop={(e) => {
                        e.preventDefault(); e.stopPropagation();
                        setDraggingPortfolioExtraIdx(null);
                        const file = e.dataTransfer.files?.[0];
                        if (file) handlePortfolioExtraDrop(file, idx);
                      }}
                    >
                      {draggingPortfolioExtraIdx === idx && (
                        <div className="flex items-center justify-center gap-2 py-1 text-red-500">
                          <span className="material-symbols-outlined text-base animate-bounce">cloud_upload</span>
                          <span className="text-[11px] font-bold">Suelta aquí</span>
                        </div>
                      )}
                      <div className={`flex gap-2 items-center ${draggingPortfolioExtraIdx === idx ? "opacity-50" : ""}`}>
                        <div className="w-10 h-10 flex-shrink-0 rounded-lg overflow-hidden border border-slate-200 bg-slate-100">
                          {url && <img src={url} alt="" className="w-full h-full object-cover" />}
                        </div>
                        <input
                          type="text"
                          value={url}
                          onChange={(e) => setFormPortfolioExtraImgs(prev => prev.map((u, i) => i === idx ? e.target.value : u))}
                          placeholder="Arrastra una imagen o pega URL →"
                          className="flex-1 bg-white border border-slate-200 focus:border-red-600 focus:ring-1 focus:ring-red-600 focus:outline-none rounded-xl px-3 py-2 text-sm transition-all"
                        />
                        <div className="relative flex-shrink-0">
                          <input
                            type="file"
                            id={`formPortfolioExtra_${idx}`}
                            onChange={(e) => handleUploadFile(e, "portfolio-extra", idx)}
                            className="hidden"
                            accept="image/*"
                          />
                          <label
                            htmlFor={`formPortfolioExtra_${idx}`}
                            className="px-3 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-xl text-xs font-bold transition-all cursor-pointer inline-flex items-center gap-1"
                          >
                            {uploadingPortfolioExtraIdx === idx
                              ? <span className="material-symbols-outlined text-sm animate-spin">progress_activity</span>
                              : <span className="material-symbols-outlined text-sm">upload</span>
                            }
                          </label>
                        </div>
                        <button
                          type="button"
                          onClick={() => setFormPortfolioExtraImgs(prev => prev.filter((_, i) => i !== idx))}
                          className="flex-shrink-0 p-2 text-slate-400 hover:text-red-600 transition-colors cursor-pointer"
                        >
                          <span className="material-symbols-outlined text-sm">delete</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <footer className="pt-4 border-t border-slate-100 flex justify-end gap-3">
                <button 
                  type="button" 
                  onClick={closePortfolioModal}
                  className="px-5 py-3 border border-slate-200 hover:bg-slate-50 rounded-xl text-xs font-bold transition-all cursor-pointer"
                >
                  Cancelar
                </button>
                <button 
                  type="submit" 
                  className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold transition-all active:scale-95 shadow-md shadow-red-600/10 cursor-pointer"
                >
                  {editingPortfolio ? "Actualizar Cambios" : "Registrar Trabajo"}
                </button>
              </footer>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 7: Create or Edit Category */}
      {showCategoryModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-md shadow-2xl relative overflow-hidden">
            <header className="px-8 py-5 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h3 className="font-bold text-base text-on-surface">
                {editingCategory ? "Editar Categoría" : "Crear Nueva Categoría"}
              </h3>
              <button onClick={closeCategoryModal} className="text-slate-400 hover:text-slate-700 transition-colors border-none bg-transparent cursor-pointer">
                <span className="material-symbols-outlined">close</span>
              </button>
            </header>

            <form onSubmit={handleCreateOrUpdateCategory} className="p-8 space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Nombre de la Categoría</label>
                <input 
                  type="text" 
                  required
                  value={formCategoryName}
                  onChange={(e) => setFormCategoryName(e.target.value)}
                  placeholder="Ej: Tintas Originales"
                  className="w-full bg-slate-50 border border-slate-200 focus:border-red-600 focus:ring-1 focus:ring-red-600 focus:outline-none rounded-xl px-4 py-3 text-sm transition-all"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input 
                  type="checkbox"
                  id="formCategoryActive"
                  checked={formCategoryActive}
                  onChange={(e) => setFormCategoryActive(e.target.checked)}
                  className="h-4 w-4 rounded border-slate-300 text-red-600 focus:ring-red-600"
                />
                <label htmlFor="formCategoryActive" className="text-xs font-bold text-slate-600 cursor-pointer">Categoría Activa (Visible al Público)</label>
              </div>

              <footer className="pt-4 border-t border-slate-100 flex justify-end gap-3">
                <button 
                  type="button" 
                  onClick={closeCategoryModal}
                  className="px-5 py-3 border border-slate-200 hover:bg-slate-50 rounded-xl text-xs font-bold transition-all cursor-pointer"
                >
                  Cancelar
                </button>
                <button 
                  type="submit" 
                  className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold transition-all active:scale-95 shadow-md shadow-red-600/10 cursor-pointer"
                >
                  {editingCategory ? "Actualizar Categoría" : "Guardar Categoría"}
                </button>
              </footer>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Ver Mensaje de Contacto Completo */}
      {selectedMensaje && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-lg shadow-2xl relative overflow-hidden">
            <header className="px-8 py-5 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h3 className="font-bold text-base text-on-surface">{selectedMensaje.asunto}</h3>
              <button onClick={() => setSelectedMensaje(null)} className="text-slate-400 hover:text-slate-700 transition-colors border-none bg-transparent cursor-pointer">
                <span className="material-symbols-outlined">close</span>
              </button>
            </header>

            <div className="p-8 space-y-4">
              <div>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Remitente</p>
                <p className="text-sm text-on-surface">{selectedMensaje.nombre}</p>
                <p className="text-xs text-slate-500">{selectedMensaje.correo}</p>
                {selectedMensaje.telefono && <p className="text-xs text-slate-500">{selectedMensaje.telefono}</p>}
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Fecha</p>
                <p className="text-sm text-on-surface">{formatDate(selectedMensaje.fecha)}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Mensaje</p>
                <p className="text-sm text-on-surface whitespace-pre-wrap">{selectedMensaje.mensaje}</p>
              </div>
            </div>

            <footer className="px-8 pb-8 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setSelectedMensaje(null)}
                className="px-5 py-3 border border-slate-200 hover:bg-slate-50 rounded-xl text-xs font-bold transition-all cursor-pointer"
              >
                Cerrar
              </button>
            </footer>
          </div>
        </div>
      )}
    </div>
  );
}
