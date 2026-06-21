"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, useEffect, useMemo } from "react";

import {
  Licencia, ArchivoTecnico, Categoria, Producto,
  MensajeContacto, Usuario, Servicio, TrabajoRealizado,
} from "./types";
import { detectFileType, formatDate, getLicenseUrgency } from "./utils";

import DarkModeStyles from "./components/DarkModeStyles";
import AdminSidebar from "./components/AdminSidebar";
import AdminHeader from "./components/AdminHeader";

import OverviewTab from "./components/tabs/OverviewTab";
import LicensesTab from "./components/tabs/LicensesTab";
import FilesTab from "./components/tabs/FilesTab";
import ProductsTab from "./components/tabs/ProductsTab";
import MessagesTab from "./components/tabs/MessagesTab";
import UsersTab from "./components/tabs/UsersTab";
import ServicesTab from "./components/tabs/ServicesTab";
import PortfolioTab from "./components/tabs/PortfolioTab";
import CategoriesTab from "./components/tabs/CategoriesTab";

import LicenseModal from "./components/modals/LicenseModal";
import FileModal from "./components/modals/FileModal";
import ProductModal from "./components/modals/ProductModal";
import UserModal from "./components/modals/UserModal";
import ServiceModal from "./components/modals/ServiceModal";
import PortfolioModal from "./components/modals/PortfolioModal";
import CategoryModal from "./components/modals/CategoryModal";
import MessageViewModal from "./components/modals/MessageViewModal";
import ImagePreviewModal from "./components/modals/ImagePreviewModal";

export default function AdminDashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // --- Navigation ---
  const [activeTab, setActiveTab] = useState("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({
    clientes: false, inventario: false, contenido: false, sistema: false,
  });
  const toggleGroup = (key: string) =>
    setOpenGroups((prev) => ({ ...prev, [key]: !prev[key] }));

  // --- Guide ---
  const [guideVisible, setGuideVisible] = useState(false);
  const [guideMode, setGuideMode] = useState<"checklist" | "stepper">("checklist");
  const [guideStepIndex, setGuideStepIndex] = useState<Record<string, number>>({});
  const [completedSteps, setCompletedSteps] = useState<Record<string, boolean[]>>({});

  // --- Dark mode persist ---
  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("adminDarkMode");
      if (saved === "true") setDarkMode(true);
    }
  }, []);

  const toggleDarkMode = () => {
    const next = !darkMode;
    setDarkMode(next);
    if (typeof window !== "undefined") localStorage.setItem("adminDarkMode", String(next));
  };

  // --- Data ---
  const [licencias, setLicencias] = useState<Licencia[]>([]);
  const [archivos, setArchivos] = useState<ArchivoTecnico[]>([]);
  const [productos, setProductos] = useState<Producto[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [mensajes, setMensajes] = useState<MensajeContacto[]>([]);
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [servicios, setServicios] = useState<Servicio[]>([]);
  const [trabajos, setTrabajos] = useState<TrabajoRealizado[]>([]);

  // --- Search & modals ---
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

  // --- License form ---
  const [formSoftware, setFormSoftware] = useState("");
  const [formCorreo, setFormCorreo] = useState("");
  const [formContrasena, setFormContrasena] = useState("");
  const [formCliente, setFormCliente] = useState("");
  const [formTelefono, setFormTelefono] = useState("");
  const [formFechaInicio, setFormFechaInicio] = useState("");
  const [formFechaFin, setFormFechaFin] = useState("");
  const [formObservaciones, setFormObservaciones] = useState("");

  // --- File form ---
  const [formFileName, setFormFileName] = useState("");
  const [formFileType, setFormFileType] = useState("programa");
  const [formFileUrl, setFormFileUrl] = useState("");
  const [formFileDesc, setFormFileDesc] = useState("");

  // --- Product form ---
  const [formProductName, setFormProductName] = useState("");
  const [formProductPrice, setFormProductPrice] = useState("");
  const [formProductDesc, setFormProductDesc] = useState("");
  const [formProductCategory, setFormProductCategory] = useState("");
  const [formProductImages, setFormProductImages] = useState<string[]>([""]);
  const [formProductActive, setFormProductActive] = useState(true);
  const [uploadingProductIdx, setUploadingProductIdx] = useState<number | null>(null);
  const [draggingProductImgIdx, setDraggingProductImgIdx] = useState<number | null>(null);

  // --- User form ---
  const [formUserNombre, setFormUserNombre] = useState("");
  const [formUserUsuario, setFormUserUsuario] = useState("");
  const [formUserEmail, setFormUserEmail] = useState("");
  const [formUserContrasena, setFormUserContrasena] = useState("");
  const [formUserRol, setFormUserRol] = useState("tecnico");

  // --- Service form ---
  const [formServiceName, setFormServiceName] = useState("");
  const [formServiceDesc, setFormServiceDesc] = useState("");
  const [formServiceIcon, setFormServiceIcon] = useState("laptop_mac");
  const [formServiceActive, setFormServiceActive] = useState(true);

  // --- Portfolio form ---
  const [formPortfolioTitle, setFormPortfolioTitle] = useState("");
  const [formPortfolioDesc, setFormPortfolioDesc] = useState("");
  const [formPortfolioImgUrl, setFormPortfolioImgUrl] = useState("");
  const [formPortfolioExtraImgs, setFormPortfolioExtraImgs] = useState<string[]>([]);
  const [formPortfolioServiceId, setFormPortfolioServiceId] = useState("");
  const [uploadingPortfolioExtraIdx, setUploadingPortfolioExtraIdx] = useState<number | null>(null);
  const [draggingPortfolioMain, setDraggingPortfolioMain] = useState(false);
  const [draggingPortfolioExtraIdx, setDraggingPortfolioExtraIdx] = useState<number | null>(null);

  // --- Category form ---
  const [formCategoryName, setFormCategoryName] = useState("");
  const [formCategoryActive, setFormCategoryActive] = useState(true);

  // --- Upload & preview ---
  const [uploading, setUploading] = useState(false);
  const [selectedMensaje, setSelectedMensaje] = useState<MensajeContacto | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  // --- RBAC ---
  const userRole = (session?.user as any)?.role as "admin" | "tecnico" | "vendedor" | undefined;
  const isAdmin = userRole === "admin";
  const canEditCatalogo = isAdmin || userRole === "vendedor";
  const canEditTecnico = isAdmin || userRole === "tecnico";
  const canDelete = isAdmin;

  // --- Auth redirect ---
  useEffect(() => {
    if (status === "unauthenticated") router.push("/admin/login");
  }, [status, router]);

  // --- Initial data load ---
  useEffect(() => {
    if (status === "authenticated") {
      fetchLicencias();
      fetchArchivos();
      fetchProductos();
      fetchCategorias();
      fetchMensajes();
      fetchServicios();
      fetchTrabajos();
      if ((session?.user as any)?.role === "admin") fetchUsuarios();
    }
  }, [status, session]);

  // --- Fetch functions ---
  const fetchLicencias = async () => {
    try { const r = await fetch("/api/licencias"); if (r.ok) setLicencias(await r.json()); } catch (e) { console.error(e); }
  };
  const fetchArchivos = async () => {
    try { const r = await fetch("/api/archivos"); if (r.ok) setArchivos(await r.json()); } catch (e) { console.error(e); }
  };
  const fetchProductos = async () => {
    try { const r = await fetch("/api/productos?all=true"); if (r.ok) setProductos(await r.json()); } catch (e) { console.error(e); }
  };
  const fetchCategorias = async () => {
    try { const r = await fetch("/api/categorias"); if (r.ok) setCategorias(await r.json()); } catch (e) { console.error(e); }
  };
  const fetchMensajes = async () => {
    try { const r = await fetch("/api/admin/contacto"); if (r.ok) setMensajes(await r.json()); } catch (e) { console.error(e); }
  };
  const fetchUsuarios = async () => {
    try { const r = await fetch("/api/admin/usuarios"); if (r.ok) setUsuarios(await r.json()); } catch (e) { console.error(e); }
  };
  const fetchServicios = async () => {
    try { const r = await fetch("/api/servicios"); if (r.ok) setServicios(await r.json()); } catch (e) { console.error(e); }
  };
  const fetchTrabajos = async () => {
    try { const r = await fetch("/api/trabajos"); if (r.ok) setTrabajos(await r.json()); } catch (e) { console.error(e); }
  };

  // --- Upload handler ---
  const handleUploadFile = async (
    e: React.ChangeEvent<HTMLInputElement>,
    target: "product" | "file" | "portfolio" | "portfolio-extra",
    idx?: number
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const MAX_SIZE = 4.5 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      alert(`El archivo "${file.name}" supera el límite de 4.5MB (Pesa ${(file.size / (1024 * 1024)).toFixed(2)}MB).\n\nPara archivos grandes use la URL directa.`);
      e.target.value = "";
      return;
    }
    if (target === "product" && idx !== undefined) setUploadingProductIdx(idx);
    else if (target === "portfolio-extra" && idx !== undefined) setUploadingPortfolioExtraIdx(idx);
    else setUploading(true);

    const fd = new FormData();
    fd.append("file", file);
    fd.append("folder", target === "product" ? "productos" : (target.startsWith("portfolio") ? "portfolio" : "uploads"));

    try {
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
      if (!res.ok) throw new Error("Upload failed");
      const data = await res.json();
      if (target === "product" && idx !== undefined) {
        setFormProductImages(prev => prev.map((u, i) => i === idx ? data.url : u));
      } else if (target === "portfolio-extra" && idx !== undefined) {
        setFormPortfolioExtraImgs(prev => prev.map((u, i) => i === idx ? data.url : u));
      } else if (target === "portfolio") {
        setFormPortfolioImgUrl(data.url);
      } else {
        setFormFileUrl(data.url);
        if (!formFileName) {
          const clean = file.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " ")
            .split(" ").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
          setFormFileName(clean);
          setFormFileType(detectFileType(clean, data.url));
        } else {
          setFormFileType(detectFileType(formFileName, data.url));
        }
      }
      alert("Archivo cargado y guardado físicamente con éxito.");
    } catch (err) {
      console.error(err);
      alert("Error al intentar subir el archivo.");
    } finally {
      if (target === "product") setUploadingProductIdx(null);
      else if (target === "portfolio-extra") setUploadingPortfolioExtraIdx(null);
      else setUploading(false);
    }
  };

  // --- Product images helpers ---
  const addProductImage = () => setFormProductImages(prev => [...prev, ""]);
  const removeProductImage = (idx: number) => setFormProductImages(prev => prev.filter((_, i) => i !== idx));
  const updateProductImage = (idx: number, url: string) => setFormProductImages(prev => prev.map((u, i) => i === idx ? url : u));

  const handleProductDrop = async (file: File, idx: number) => {
    if (file.size > 4.5 * 1024 * 1024) { alert(`"${file.name}" supera 4.5MB.`); return; }
    if (!file.type.startsWith("image/")) { alert("Solo imágenes."); return; }
    setUploadingProductIdx(idx);
    const fd = new FormData(); fd.append("file", file); fd.append("folder", "productos");
    try {
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setFormProductImages(prev => prev.map((u, i) => i === idx ? data.url : u));
      alert("Imagen cargada con éxito.");
    } catch { alert("Error al subir la imagen."); }
    finally { setUploadingProductIdx(null); }
  };

  const handlePortfolioMainDrop = async (file: File) => {
    if (file.size > 4.5 * 1024 * 1024) { alert(`"${file.name}" supera 4.5MB.`); return; }
    if (!file.type.startsWith("image/")) { alert("Solo imágenes."); return; }
    setUploading(true);
    const fd = new FormData(); fd.append("file", file); fd.append("folder", "portfolio");
    try {
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setFormPortfolioImgUrl(data.url);
      alert("Imagen cargada con éxito.");
    } catch { alert("Error al subir la imagen."); }
    finally { setUploading(false); }
  };

  const handlePortfolioExtraDrop = async (file: File, idx: number) => {
    if (file.size > 4.5 * 1024 * 1024) { alert(`"${file.name}" supera 4.5MB.`); return; }
    if (!file.type.startsWith("image/")) { alert("Solo imágenes."); return; }
    setUploadingPortfolioExtraIdx(idx);
    const fd = new FormData(); fd.append("file", file); fd.append("folder", "portfolio");
    try {
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setFormPortfolioExtraImgs(prev => prev.map((u, i) => i === idx ? data.url : u));
      alert("Imagen cargada con éxito.");
    } catch { alert("Error al subir la imagen."); }
    finally { setUploadingPortfolioExtraIdx(null); }
  };

  // --- Messages ---
  const toggleMensajeLeido = async (id: number, currentRead: boolean) => {
    try {
      const res = await fetch("/api/admin/contacto", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id, leido: !currentRead }) });
      if (res.ok) fetchMensajes(); else alert("No se pudo actualizar el estado del mensaje.");
    } catch (e) { console.error(e); }
  };

  const handleDeleteMensaje = async (id: number) => {
    if (!confirm("¿Está seguro de eliminar este mensaje?")) return;
    try {
      const res = await fetch(`/api/admin/contacto?id=${id}`, { method: "DELETE" });
      if (res.ok) fetchMensajes(); else alert("No se pudo eliminar el mensaje.");
    } catch (e) { console.error(e); }
  };

  // --- Users ---
  const handleCreateOrUpdateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    let userData: any = editingUser
      ? { id: editingUser.id, nombre: formUserNombre, usuario: formUserUsuario, email: formUserEmail, rol: formUserRol }
      : { nombre: formUserNombre, email: formUserEmail, rol: formUserRol };
    if (editingUser && formUserContrasena) userData.contrasena = formUserContrasena;
    try {
      const res = await fetch("/api/admin/usuarios", { method: editingUser ? "PUT" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(userData) });
      const data = await res.json();
      if (res.ok) {
        alert(editingUser ? "Usuario actualizado con éxito." : `Personal registrado. Se ha enviado el usuario y contraseña temporal al correo ${formUserEmail}.`);
        fetchUsuarios(); closeUserModal();
      } else {
        if (data.errors) { alert(`Errores:\n${Object.entries(data.errors).map(([f, m]: any) => `${f}: ${m.join(", ")}`).join("\n")}`); }
        else alert(`Error: ${data.error || "No se pudo guardar el usuario"}`);
      }
    } catch { alert("Error de conexión al guardar el usuario."); }
  };

  const handleToggleUserStatus = async (id: number, current: boolean) => {
    try {
      const res = await fetch("/api/admin/usuarios", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id, activo: !current }) });
      if (res.ok) fetchUsuarios(); else { const d = await res.json(); alert(`Error: ${d.error || "No se pudo cambiar el estado"}`); }
    } catch { alert("Error de conexión."); }
  };

  const openEditUserModal = (user: Usuario) => {
    setEditingUser(user); setFormUserNombre(user.nombre); setFormUserUsuario(user.usuario);
    setFormUserEmail(user.email); setFormUserContrasena(""); setFormUserRol(user.rol);
    setShowUserModal(true);
  };
  const closeUserModal = () => {
    setEditingUser(null); setFormUserNombre(""); setFormUserUsuario(""); setFormUserEmail(""); setFormUserContrasena(""); setFormUserRol("tecnico"); setShowUserModal(false);
  };

  // --- Licenses ---
  const handleCreateOrUpdateLicense = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = { software: formSoftware, correo_cuenta: formCorreo, contrasena: formContrasena, nombre_cliente: formCliente, telefono: formTelefono || null, fecha_inicio: formFechaInicio || new Date().toISOString(), fecha_fin: formFechaFin ? new Date(formFechaFin).toISOString() : null, observaciones: formObservaciones || null, estado: formFechaFin && new Date(formFechaFin) < new Date() ? "vencido" : "activo" };
    try {
      const url = editingLicense ? `/api/licencias/${editingLicense.id}` : "/api/licencias";
      const res = await fetch(url, { method: editingLicense ? "PUT" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
      if (res.ok) { alert(editingLicense ? "Licencia actualizada con éxito" : "Licencia creada con éxito"); fetchLicencias(); }
      else { const err = await res.json(); alert(`Error: ${err.error || "No se pudo guardar"}`); }
      closeLicenseModal();
    } catch { alert("Error de conexión al guardar la licencia."); }
  };

  const handleDeleteLicense = async (id: number) => {
    if (!confirm("¿Está seguro de eliminar esta licencia permanentemente?")) return;
    try {
      const res = await fetch(`/api/licencias/${id}`, { method: "DELETE" });
      if (res.ok) { alert("Licencia eliminada"); fetchLicencias(); }
      else { const err = await res.json(); alert(`Error: ${err.error || "No se pudo eliminar"}`); }
    } catch { alert("Error de conexión."); }
  };

  const openEditLicenseModal = (lic: Licencia) => {
    setEditingLicense(lic); setFormSoftware(lic.software); setFormCorreo(lic.correo_cuenta); setFormContrasena(lic.contrasena);
    setFormCliente(lic.nombre_cliente); setFormTelefono(lic.telefono || "");
    setFormFechaInicio(lic.fecha_inicio ? lic.fecha_inicio.substring(0, 10) : "");
    setFormFechaFin(lic.fecha_fin ? lic.fecha_fin.substring(0, 10) : "");
    setFormObservaciones(lic.observaciones || ""); setShowLicenseModal(true);
  };
  const closeLicenseModal = () => {
    setEditingLicense(null); setFormSoftware(""); setFormCorreo(""); setFormContrasena("");
    setFormCliente(""); setFormTelefono(""); setFormFechaInicio(""); setFormFechaFin(""); setFormObservaciones(""); setShowLicenseModal(false);
  };

  // --- Files ---
  const handleFileNameChange = (val: string) => { setFormFileName(val); setFormFileType(detectFileType(val, formFileUrl)); };
  const handleFileUrlChange = (val: string) => { setFormFileUrl(val); setFormFileType(detectFileType(formFileName, val)); };

  const handleCreateFile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/archivos", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ nombre: formFileName, tipo: formFileType, url_archivo: formFileUrl, descripcion: formFileDesc || null }) });
      if (res.ok) { alert("Archivo / Driver creado con éxito"); fetchArchivos(); closeFileModal(); }
      else { const err = await res.json(); alert(`Error: ${err.error || "No se pudo guardar el archivo"}`); }
    } catch { alert("Error de conexión al registrar el archivo."); }
  };

  const handleDeleteFile = async (id: number) => {
    if (!confirm("¿Está seguro de eliminar este archivo permanentemente?")) return;
    try {
      const res = await fetch(`/api/archivos/${id}`, { method: "DELETE" });
      if (res.ok) { alert("Archivo eliminado"); fetchArchivos(); }
      else { const err = await res.json(); alert(`Error: ${err.error || "No se pudo eliminar"}`); }
    } catch { alert("Error de conexión."); }
  };

  const closeFileModal = () => { setFormFileName(""); setFormFileType("programa"); setFormFileUrl(""); setFormFileDesc(""); setShowFileModal(false); };

  // --- Products ---
  const handleCreateOrUpdateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = { nombre: formProductName, precio: Number(formProductPrice), descripcion: formProductDesc || null, id_categoria: Number(formProductCategory), imagen_url: formProductImages.filter(u => u.trim()).join("||") || null, activo: formProductActive };
    try {
      const url = editingProduct ? `/api/productos/${editingProduct.id}` : "/api/productos";
      const res = await fetch(url, { method: editingProduct ? "PUT" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
      if (res.ok) { alert(editingProduct ? "Producto actualizado con éxito" : "Producto creado con éxito"); fetchProductos(); }
      else { const err = await res.json(); alert(`Error: ${err.error || "No se pudo guardar"}`); }
      closeProductModal();
    } catch { alert("Error de conexión al guardar el producto."); }
  };

  const handleDeleteProduct = async (id: number) => {
    if (!confirm("¿Está seguro de eliminar este producto del catálogo?")) return;
    try {
      const res = await fetch(`/api/productos/${id}`, { method: "DELETE" });
      if (res.ok) { alert("Producto eliminado"); fetchProductos(); }
      else { const err = await res.json(); alert(`Error: ${err.error || "No se pudo eliminar"}`); }
    } catch { alert("Error de conexión."); }
  };

  const openEditProductModal = (prod: Producto) => {
    setEditingProduct(prod); setFormProductName(prod.nombre); setFormProductPrice(String(prod.precio));
    setFormProductDesc(prod.descripcion || ""); setFormProductCategory(String(prod.id_categoria));
    const imgs = (prod.imagen_url || "").split("||").filter(Boolean);
    setFormProductImages(imgs.length > 0 ? imgs : [""]); setFormProductActive(prod.activo); setShowProductModal(true);
  };
  const closeProductModal = () => {
    setEditingProduct(null); setFormProductName(""); setFormProductPrice(""); setFormProductDesc("");
    setFormProductCategory(""); setFormProductImages([""]); setFormProductActive(true); setShowProductModal(false);
  };

  // --- Services ---
  const handleCreateOrUpdateService = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = { nombre: formServiceName, descripcion: formServiceDesc, icono_url: formServiceIcon || "laptop_mac", activo: formServiceActive };
    try {
      const url = editingService ? `/api/servicios/${editingService.id}` : "/api/servicios";
      const res = await fetch(url, { method: editingService ? "PUT" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
      if (res.ok) { alert(editingService ? "Servicio actualizado con éxito" : "Servicio creado con éxito"); fetchServicios(); closeServiceModal(); }
      else { const err = await res.json(); alert(`Error: ${err.error || "No se pudo guardar el servicio"}`); }
    } catch { alert("Error de conexión al guardar el servicio."); }
  };

  const handleDeleteService = async (id: number) => {
    if (!confirm("¿Está seguro de desactivar este servicio de la web?")) return;
    try {
      const res = await fetch(`/api/servicios/${id}`, { method: "DELETE" });
      if (res.ok) { alert("Servicio desactivado"); fetchServicios(); } else alert("No se pudo desactivar el servicio");
    } catch { alert("Error de conexión."); }
  };

  const openEditServiceModal = (srv: Servicio) => {
    setEditingService(srv); setFormServiceName(srv.nombre); setFormServiceDesc(srv.descripcion);
    setFormServiceIcon(srv.icono_url || "laptop_mac"); setFormServiceActive(srv.activo); setShowServiceModal(true);
  };
  const closeServiceModal = () => { setEditingService(null); setFormServiceName(""); setFormServiceDesc(""); setFormServiceIcon("laptop_mac"); setFormServiceActive(true); setShowServiceModal(false); };

  // --- Portfolio ---
  const handleCreateOrUpdatePortfolio = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formPortfolioImgUrl) { alert("Debe subir una imagen para el trabajo de portafolio."); return; }
    const allImgs = [formPortfolioImgUrl, ...formPortfolioExtraImgs.filter(u => u.trim())];
    const data = { titulo: formPortfolioTitle, descripcion: formPortfolioDesc || null, imagen_url: allImgs.join("||"), id_servicio: formPortfolioServiceId ? Number(formPortfolioServiceId) : null };
    try {
      const url = editingPortfolio ? `/api/trabajos/${editingPortfolio.id}` : "/api/trabajos";
      const res = await fetch(url, { method: editingPortfolio ? "PUT" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
      if (res.ok) { alert(editingPortfolio ? "Trabajo actualizado con éxito" : "Trabajo registrado con éxito"); fetchTrabajos(); closePortfolioModal(); }
      else { const err = await res.json(); alert(`Error: ${err.error || "No se pudo guardar el trabajo"}`); }
    } catch { alert("Error de conexión al guardar el trabajo."); }
  };

  const handleDeletePortfolio = async (id: number) => {
    if (!confirm("¿Está seguro de eliminar este trabajo del portafolio?")) return;
    try {
      const res = await fetch(`/api/trabajos/${id}`, { method: "DELETE" });
      if (res.ok) { alert("Trabajo eliminado"); fetchTrabajos(); } else alert("No se pudo eliminar el trabajo");
    } catch { alert("Error de conexión."); }
  };

  const openEditPortfolioModal = (job: TrabajoRealizado) => {
    setEditingPortfolio(job); setFormPortfolioTitle(job.titulo); setFormPortfolioDesc(job.descripcion || "");
    const parts = job.imagen_url.split("||").filter(Boolean);
    setFormPortfolioImgUrl(parts[0] || ""); setFormPortfolioExtraImgs(parts.slice(1));
    setFormPortfolioServiceId(job.id_servicio ? String(job.id_servicio) : ""); setShowPortfolioModal(true);
  };
  const closePortfolioModal = () => {
    setEditingPortfolio(null); setFormPortfolioTitle(""); setFormPortfolioDesc(""); setFormPortfolioImgUrl("");
    setFormPortfolioExtraImgs([]); setFormPortfolioServiceId(""); setShowPortfolioModal(false);
  };

  // --- Categories ---
  const handleCreateOrUpdateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = { nombre: formCategoryName, activo: formCategoryActive };
    try {
      const url = editingCategory ? `/api/categorias/${editingCategory.id}` : "/api/categorias";
      const res = await fetch(url, { method: editingCategory ? "PUT" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
      if (res.ok) { alert(editingCategory ? "Categoría actualizada con éxito" : "Categoría creada con éxito"); fetchCategorias(); closeCategoryModal(); }
      else { const err = await res.json(); alert(`Error: ${err.error || "No se pudo guardar la categoría"}`); }
    } catch { alert("Error de conexión al guardar la categoría."); }
  };

  const handleDeleteCategory = async (id: number) => {
    if (!confirm("¿Está seguro de desactivar esta categoría del catálogo?")) return;
    try {
      const res = await fetch(`/api/categorias/${id}`, { method: "DELETE" });
      if (res.ok) { alert("Categoría desactivada"); fetchCategorias(); } else alert("No se pudo desactivar la categoría");
    } catch { alert("Error de conexión."); }
  };

  const openEditCategoryModal = (cat: Categoria) => {
    setEditingCategory(cat); setFormCategoryName(cat.nombre); setFormCategoryActive(cat.activo); setShowCategoryModal(true);
  };
  const closeCategoryModal = () => { setEditingCategory(null); setFormCategoryName(""); setFormCategoryActive(true); setShowCategoryModal(false); };

  // --- File count helper ---
  const fileCountByType = (type: string) => archivos.filter(a => a.tipo === type).length;

  // --- Stats bar ---
  const tabStats = useMemo(() => {
    switch (activeTab) {
      case "overview": {
        const now = new Date();
        const msgWeek = mensajes.filter(m => { const d = (now.getTime() - new Date(m.fecha).getTime()) / (1000 * 60 * 60 * 24); return d >= 0 && d <= 7; }).length;
        return [
          { label: "Licencias Activas", value: licencias.filter(l => l.estado === "activo").length, suffix: "", icon: "verified_user", bg: "bg-emerald-50/10", fg: "text-emerald-600", valueCls: "text-on-surface" },
          { label: "Mensajes de la Semana", value: msgWeek, suffix: "", icon: "chat", bg: "bg-blue-50/10", fg: "text-blue-600", valueCls: "text-on-surface" },
          { label: "Total en Catálogo", value: productos.length, suffix: " productos", icon: "inventory_2", bg: "bg-amber-50/10", fg: "text-amber-600", valueCls: "text-on-surface" },
        ];
      }
      case "licenses": return [
        { label: "Licencias Activas", value: licencias.filter(l => l.estado === "activo").length, suffix: "", icon: "verified_user", bg: "bg-emerald-50", fg: "text-emerald-600", valueCls: "text-on-surface" },
        { label: "Próximas a Vencer", value: licencias.filter(l => getLicenseUrgency(l.fecha_fin) === "warning").length, suffix: "", icon: "schedule", bg: "bg-orange-50", fg: "text-orange-500", valueCls: "text-orange-500" },
        { label: "Alertas Críticas", value: licencias.filter(l => getLicenseUrgency(l.fecha_fin) === "expired").length, suffix: "", icon: "error", bg: "bg-red-100", fg: "text-red-700", valueCls: "text-red-600" },
      ];
      case "files": return [
        { label: "Total de Archivos", value: archivos.length, suffix: "", icon: "folder_zip", bg: "bg-red-50", fg: "text-red-600", valueCls: "text-on-surface" },
        { label: "Controladores", value: fileCountByType("driver"), suffix: "", icon: "settings_input_component", bg: "bg-blue-50", fg: "text-blue-600", valueCls: "text-on-surface" },
        { label: "Programas (.exe)", value: fileCountByType("programa"), suffix: "", icon: "install_desktop", bg: "bg-slate-100", fg: "text-slate-500", valueCls: "text-on-surface" },
      ];
      case "products": return [
        { label: "Productos Activos", value: productos.filter(p => p.activo).length, suffix: "", icon: "inventory_2", bg: "bg-emerald-50", fg: "text-emerald-600", valueCls: "text-on-surface" },
        { label: "Total en Catálogo", value: productos.length, suffix: "", icon: "storefront", bg: "bg-red-50", fg: "text-red-600", valueCls: "text-on-surface" },
        { label: "Categorías Activas", value: categorias.filter(c => c.activo).length, suffix: "", icon: "local_offer", bg: "bg-slate-100", fg: "text-slate-500", valueCls: "text-on-surface" },
      ];
      case "services": return [
        { label: "Servicios Activos", value: servicios.filter(s => s.activo).length, suffix: "", icon: "build", bg: "bg-emerald-50", fg: "text-emerald-600", valueCls: "text-on-surface" },
        { label: "Total Servicios", value: servicios.length, suffix: "", icon: "design_services", bg: "bg-red-50", fg: "text-red-600", valueCls: "text-on-surface" },
        { label: "Trabajos Portafolio", value: trabajos.length, suffix: "", icon: "photo_library", bg: "bg-slate-100", fg: "text-slate-500", valueCls: "text-on-surface" },
      ];
      case "portfolio": return [
        { label: "Trabajos Realizados", value: trabajos.length, suffix: "", icon: "photo_library", bg: "bg-red-50", fg: "text-red-600", valueCls: "text-on-surface" },
        { label: "Con Servicio Asociado", value: trabajos.filter(t => t.id_servicio).length, suffix: "", icon: "link", bg: "bg-emerald-50", fg: "text-emerald-600", valueCls: "text-on-surface" },
        { label: "Servicios Disponibles", value: servicios.filter(s => s.activo).length, suffix: "", icon: "build", bg: "bg-slate-100", fg: "text-slate-500", valueCls: "text-on-surface" },
      ];
      case "categories": return [
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
      case "users": return [
        { label: "Personal Activo", value: usuarios.filter(u => u.activo).length, suffix: "", icon: "group", bg: "bg-emerald-50", fg: "text-emerald-600", valueCls: "text-on-surface" },
        { label: "Administradores", value: usuarios.filter(u => u.rol === "admin").length, suffix: "", icon: "admin_panel_settings", bg: "bg-red-50", fg: "text-red-600", valueCls: "text-on-surface" },
        { label: "Técnicos", value: usuarios.filter(u => u.rol === "tecnico").length, suffix: "", icon: "engineering", bg: "bg-slate-100", fg: "text-slate-500", valueCls: "text-on-surface" },
      ];
      default: return [
        { label: "Licencias Activas", value: licencias.filter(l => l.estado === "activo").length, suffix: "", icon: "verified_user", bg: "bg-emerald-50", fg: "text-emerald-600", valueCls: "text-on-surface" },
        { label: "Controladores & Drivers", value: archivos.length, suffix: " archivos", icon: "folder_zip", bg: "bg-red-50", fg: "text-red-600", valueCls: "text-on-surface" },
        { label: "Alertas de Vencimiento", value: licencias.filter(l => getLicenseUrgency(l.fecha_fin) !== "ok").length, suffix: " críticas", icon: "error", bg: "bg-red-100", fg: "text-red-700", valueCls: "text-red-600" },
      ];
    }
  }, [activeTab, licencias, archivos, productos, categorias, mensajes, usuarios, servicios, trabajos]);

  // --- Loading / auth guards ---
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

  // --- Filtered data ---
  const filteredLicencias = licencias.filter(l =>
    l.nombre_cliente.toLowerCase().includes(searchQuery.toLowerCase()) ||
    l.software.toLowerCase().includes(searchQuery.toLowerCase()) ||
    l.correo_cuenta.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const filteredArchivos = archivos.filter(a =>
    a.nombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (a.descripcion && a.descripcion.toLowerCase().includes(searchQuery.toLowerCase()))
  );
  const filteredProductos = productos.filter(p =>
    p.nombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (p.descripcion && p.descripcion.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (p.categoria?.nombre && p.categoria.nombre.toLowerCase().includes(searchQuery.toLowerCase()))
  );
  const filteredMensajes = mensajes.filter(m =>
    m.nombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.asunto.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.mensaje.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.correo.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const filteredUsuarios = usuarios.filter(u =>
    u.nombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.usuario.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.rol.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const filteredServicios = servicios.filter(s =>
    s.nombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.descripcion.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const filteredTrabajos = trabajos.filter(t =>
    t.titulo.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (t.descripcion && t.descripcion.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (t.servicio?.nombre && t.servicio.nombre.toLowerCase().includes(searchQuery.toLowerCase()))
  );
  const filteredCategorias = categorias.filter(c =>
    c.nombre.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const unreadMessagesCount = mensajes.filter(m => !m.leido).length;
  const expiredLicensesCount = licencias.filter(l => getLicenseUrgency(l.fecha_fin) === "expired").length;
  const warningLicensesCount = licencias.filter(l => getLicenseUrgency(l.fecha_fin) === "warning").length;
  const totalUrgentLicenses = expiredLicensesCount + warningLicensesCount;

  return (
    <div className={`bg-slate-50 min-h-screen text-on-surface font-headline overflow-hidden flex transition-colors duration-300 ${darkMode ? "dark-theme" : ""}`}>
      <DarkModeStyles />

      <AdminSidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        openGroups={openGroups}
        toggleGroup={toggleGroup}
        unreadMessagesCount={unreadMessagesCount}
        totalUrgentLicenses={totalUrgentLicenses}
        expiredLicensesCount={expiredLicensesCount}
        isAdmin={isAdmin}
        canEditCatalogo={canEditCatalogo}
        canEditTecnico={canEditTecnico}
      />

      <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
        <AdminHeader
          session={session}
          activeTab={activeTab}
          setSidebarOpen={setSidebarOpen}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          darkMode={darkMode}
          toggleDarkMode={toggleDarkMode}
          guideVisible={guideVisible}
          setGuideVisible={setGuideVisible}
          guideMode={guideMode}
          setGuideMode={setGuideMode}
          guideStepIndex={guideStepIndex}
          setGuideStepIndex={setGuideStepIndex}
          completedSteps={completedSteps}
          setCompletedSteps={setCompletedSteps}
          isAdmin={isAdmin}
          userRole={userRole}
        />

        {/* Stats bar */}
        <div className="border-b border-slate-200/80 bg-white px-6 py-3 flex gap-4 overflow-x-auto shrink-0">
          {tabStats.map((stat, i) => (
            <div key={i} className={`flex items-center gap-3 px-4 py-2 rounded-xl ${stat.bg} border border-transparent shrink-0`}>
              <span className={`material-symbols-outlined text-lg ${stat.fg}`}>{stat.icon}</span>
              <div>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider leading-none mb-0.5">{stat.label}</p>
                <p className={`text-base font-black ${stat.valueCls} leading-none`}>{stat.value}{stat.suffix}</p>
              </div>
            </div>
          ))}
        </div>

        <main className="flex-1 overflow-y-auto p-6 space-y-6">
          {activeTab === "overview" && (
            <OverviewTab
              licencias={licencias} mensajes={mensajes}
              filteredLicencias={filteredLicencias} filteredMensajes={filteredMensajes}
              getLicenseUrgency={getLicenseUrgency} formatDate={formatDate}
              isAdmin={isAdmin} canEditTecnico={canEditTecnico} canEditCatalogo={canEditCatalogo}
              onOpenLicenseModal={() => setShowLicenseModal(true)}
              onOpenFileModal={() => setShowFileModal(true)}
              onOpenProductModal={() => setShowProductModal(true)}
              setActiveTab={setActiveTab}
            />
          )}
          {activeTab === "licenses" && (
            <LicensesTab
              filteredLicencias={filteredLicencias} isAdmin={isAdmin} canDelete={canDelete}
              getLicenseUrgency={getLicenseUrgency} formatDate={formatDate}
              onOpenCreate={() => setShowLicenseModal(true)}
              onEdit={openEditLicenseModal}
              onDelete={handleDeleteLicense}
            />
          )}
          {activeTab === "files" && (
            <FilesTab
              filteredArchivos={filteredArchivos} canEditTecnico={canEditTecnico} canDelete={canDelete}
              fileCountByType={fileCountByType} formatDate={formatDate}
              onOpenCreate={() => setShowFileModal(true)}
              onDelete={handleDeleteFile}
            />
          )}
          {activeTab === "products" && (
            <ProductsTab
              filteredProductos={filteredProductos} categorias={categorias}
              canEditCatalogo={canEditCatalogo} canDelete={canDelete}
              setPreviewImage={setPreviewImage}
              onOpenCreate={() => setShowProductModal(true)}
              onEdit={openEditProductModal}
              onDelete={handleDeleteProduct}
            />
          )}
          {activeTab === "messages" && (
            <MessagesTab
              filteredMensajes={filteredMensajes} canDelete={canDelete} formatDate={formatDate}
              onToggleLeido={toggleMensajeLeido}
              onDelete={handleDeleteMensaje}
              onViewMessage={setSelectedMensaje}
            />
          )}
          {activeTab === "users" && isAdmin && (
            <UsersTab
              filteredUsuarios={filteredUsuarios}
              onOpenCreate={() => setShowUserModal(true)}
              onEdit={openEditUserModal}
              onToggleStatus={handleToggleUserStatus}
            />
          )}
          {activeTab === "services" && (
            <ServicesTab
              filteredServicios={filteredServicios} canEditCatalogo={canEditCatalogo} canDelete={canDelete}
              onOpenCreate={() => setShowServiceModal(true)}
              onEdit={openEditServiceModal}
              onDelete={handleDeleteService}
            />
          )}
          {activeTab === "portfolio" && (
            <PortfolioTab
              filteredTrabajos={filteredTrabajos} canEditTecnico={canEditTecnico} canDelete={canDelete}
              formatDate={formatDate} setPreviewImage={setPreviewImage}
              onOpenCreate={() => setShowPortfolioModal(true)}
              onEdit={openEditPortfolioModal}
              onDelete={handleDeletePortfolio}
            />
          )}
          {activeTab === "categories" && (
            <CategoriesTab
              filteredCategorias={filteredCategorias} canEditCatalogo={canEditCatalogo} canDelete={canDelete}
              onOpenCreate={() => setShowCategoryModal(true)}
              onEdit={openEditCategoryModal}
              onDelete={handleDeleteCategory}
            />
          )}
        </main>
      </div>

      {/* Modals */}
      {showLicenseModal && (
        <LicenseModal
          editingLicense={editingLicense}
          formSoftware={formSoftware} setFormSoftware={setFormSoftware}
          formCorreo={formCorreo} setFormCorreo={setFormCorreo}
          formContrasena={formContrasena} setFormContrasena={setFormContrasena}
          formCliente={formCliente} setFormCliente={setFormCliente}
          formTelefono={formTelefono} setFormTelefono={setFormTelefono}
          formFechaInicio={formFechaInicio} setFormFechaInicio={setFormFechaInicio}
          formFechaFin={formFechaFin} setFormFechaFin={setFormFechaFin}
          formObservaciones={formObservaciones} setFormObservaciones={setFormObservaciones}
          onClose={closeLicenseModal}
          onSubmit={handleCreateOrUpdateLicense}
        />
      )}
      {showFileModal && (
        <FileModal
          formFileName={formFileName} formFileType={formFileType}
          formFileUrl={formFileUrl} formFileDesc={formFileDesc} setFormFileDesc={setFormFileDesc}
          uploading={uploading}
          onFileNameChange={handleFileNameChange}
          onFileUrlChange={handleFileUrlChange}
          onUploadFile={(e) => handleUploadFile(e, "file")}
          onClose={closeFileModal}
          onSubmit={handleCreateFile}
        />
      )}
      {showProductModal && (
        <ProductModal
          editingProduct={editingProduct}
          formProductName={formProductName} setFormProductName={setFormProductName}
          formProductPrice={formProductPrice} setFormProductPrice={setFormProductPrice}
          formProductDesc={formProductDesc} setFormProductDesc={setFormProductDesc}
          formProductCategory={formProductCategory} setFormProductCategory={setFormProductCategory}
          formProductImages={formProductImages}
          formProductActive={formProductActive} setFormProductActive={setFormProductActive}
          categorias={categorias}
          uploadingProductIdx={uploadingProductIdx}
          draggingProductImgIdx={draggingProductImgIdx}
          setDraggingProductImgIdx={setDraggingProductImgIdx}
          setPreviewImage={setPreviewImage}
          addProductImage={addProductImage}
          removeProductImage={removeProductImage}
          updateProductImage={updateProductImage}
          onUploadFile={(e, _t, idx) => handleUploadFile(e, "product", idx)}
          onProductDrop={handleProductDrop}
          onClose={closeProductModal}
          onSubmit={handleCreateOrUpdateProduct}
        />
      )}
      {showUserModal && (
        <UserModal
          editingUser={editingUser}
          formUserNombre={formUserNombre} setFormUserNombre={setFormUserNombre}
          formUserUsuario={formUserUsuario} setFormUserUsuario={setFormUserUsuario}
          formUserEmail={formUserEmail} setFormUserEmail={setFormUserEmail}
          formUserContrasena={formUserContrasena} setFormUserContrasena={setFormUserContrasena}
          formUserRol={formUserRol} setFormUserRol={setFormUserRol}
          onClose={closeUserModal}
          onSubmit={handleCreateOrUpdateUser}
        />
      )}
      {showServiceModal && (
        <ServiceModal
          editingService={editingService}
          formServiceName={formServiceName} setFormServiceName={setFormServiceName}
          formServiceDesc={formServiceDesc} setFormServiceDesc={setFormServiceDesc}
          formServiceIcon={formServiceIcon} setFormServiceIcon={setFormServiceIcon}
          formServiceActive={formServiceActive} setFormServiceActive={setFormServiceActive}
          onClose={closeServiceModal}
          onSubmit={handleCreateOrUpdateService}
        />
      )}
      {showPortfolioModal && (
        <PortfolioModal
          editingPortfolio={editingPortfolio}
          formPortfolioTitle={formPortfolioTitle} setFormPortfolioTitle={setFormPortfolioTitle}
          formPortfolioDesc={formPortfolioDesc} setFormPortfolioDesc={setFormPortfolioDesc}
          formPortfolioImgUrl={formPortfolioImgUrl} setFormPortfolioImgUrl={setFormPortfolioImgUrl}
          formPortfolioExtraImgs={formPortfolioExtraImgs} setFormPortfolioExtraImgs={setFormPortfolioExtraImgs}
          formPortfolioServiceId={formPortfolioServiceId} setFormPortfolioServiceId={setFormPortfolioServiceId}
          servicios={servicios}
          uploading={uploading}
          uploadingPortfolioExtraIdx={uploadingPortfolioExtraIdx}
          draggingPortfolioMain={draggingPortfolioMain} setDraggingPortfolioMain={setDraggingPortfolioMain}
          draggingPortfolioExtraIdx={draggingPortfolioExtraIdx} setDraggingPortfolioExtraIdx={setDraggingPortfolioExtraIdx}
          setPreviewImage={setPreviewImage}
          onUploadFile={(e, target, idx) => handleUploadFile(e, target === "portfolio" ? "portfolio" : "portfolio-extra", idx)}
          onPortfolioMainDrop={handlePortfolioMainDrop}
          onPortfolioExtraDrop={handlePortfolioExtraDrop}
          onClose={closePortfolioModal}
          onSubmit={handleCreateOrUpdatePortfolio}
        />
      )}
      {showCategoryModal && (
        <CategoryModal
          editingCategory={editingCategory}
          formCategoryName={formCategoryName} setFormCategoryName={setFormCategoryName}
          formCategoryActive={formCategoryActive} setFormCategoryActive={setFormCategoryActive}
          onClose={closeCategoryModal}
          onSubmit={handleCreateOrUpdateCategory}
        />
      )}
      {selectedMensaje && (
        <MessageViewModal
          mensaje={selectedMensaje}
          formatDate={formatDate}
          onClose={() => setSelectedMensaje(null)}
        />
      )}
      {previewImage && (
        <ImagePreviewModal src={previewImage} onClose={() => setPreviewImage(null)} />
      )}
    </div>
  );
}
