import Link from "next/link";
import { signOut } from "next-auth/react";
import DellcomLogo from "./DellcomLogo";

interface Props {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  openGroups: Record<string, boolean>;
  toggleGroup: (key: string) => void;
  unreadMessagesCount: number;
  totalUrgentLicenses: number;
  expiredLicensesCount: number;
  isAdmin: boolean;
  canEditCatalogo: boolean;
  canEditTecnico: boolean;
}

function NavItem({
  tab, icon, label, badge, activeTab, setActiveTab, setSidebarOpen,
}: {
  tab: string; icon: string; label: string; badge?: React.ReactNode;
  activeTab: string; setActiveTab: (t: string) => void; setSidebarOpen: (o: boolean) => void;
}) {
  return (
    <button
      onClick={() => { setActiveTab(tab); setSidebarOpen(false); }}
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
}

function GroupHeader({ label, groupKey, openGroups, toggleGroup }: {
  label: string; groupKey: string;
  openGroups: Record<string, boolean>; toggleGroup: (key: string) => void;
}) {
  return (
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
}

export default function AdminSidebar({
  activeTab, setActiveTab, sidebarOpen, setSidebarOpen,
  openGroups, toggleGroup,
  unreadMessagesCount, totalUrgentLicenses, expiredLicensesCount,
  isAdmin, canEditCatalogo, canEditTecnico,
}: Props) {
  const navItemProps = { activeTab, setActiveTab, setSidebarOpen };

  return (
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
        <div className="pt-2 pb-1 px-6 text-[9px] font-black text-slate-400 uppercase tracking-widest select-none">Inicio</div>
        <NavItem tab="overview" icon="dashboard" label="Resumen General" {...navItemProps} />

        <GroupHeader label="Clientes y Soporte" groupKey="clientes" openGroups={openGroups} toggleGroup={toggleGroup} />
        {openGroups.clientes && (
          <>
            <NavItem tab="messages" icon="mail" label="Mensajes de Contacto" {...navItemProps} badge={
              unreadMessagesCount > 0 && (
                <span className="w-5 h-5 rounded-full bg-primary text-white text-[10px] font-black flex items-center justify-center animate-pulse shadow-sm">
                  {unreadMessagesCount}
                </span>
              )
            } />
            <NavItem tab="licenses" icon="verified_user" label="Gestión de Licencias" {...navItemProps} badge={
              totalUrgentLicenses > 0 && (
                <span className={`w-5 h-5 rounded-full text-white text-[10px] font-black flex items-center justify-center shadow-sm ${expiredLicensesCount > 0 ? "bg-red-600 animate-pulse" : "bg-orange-500"}`}>
                  {totalUrgentLicenses}
                </span>
              )
            } />
          </>
        )}

        {(canEditCatalogo || canEditTecnico) && (
          <GroupHeader label="Inventario y Recursos" groupKey="inventario" openGroups={openGroups} toggleGroup={toggleGroup} />
        )}
        {openGroups.inventario && (
          <>
            {canEditCatalogo && <NavItem tab="products" icon="inventory_2" label="Catálogo de Suministros" {...navItemProps} />}
            {canEditCatalogo && <NavItem tab="categories" icon="category" label="Categorías Catálogo" {...navItemProps} />}
            {canEditTecnico && <NavItem tab="files" icon="folder_open" label="Archivos y Drivers" {...navItemProps} />}
          </>
        )}

        {(canEditCatalogo || canEditTecnico) && (
          <GroupHeader label="Contenido Público" groupKey="contenido" openGroups={openGroups} toggleGroup={toggleGroup} />
        )}
        {openGroups.contenido && (
          <>
            {canEditCatalogo && <NavItem tab="services" icon="build" label="Gestión de Servicios" {...navItemProps} />}
            {canEditTecnico && <NavItem tab="portfolio" icon="photo_library" label="Trabajos Realizados" {...navItemProps} />}
          </>
        )}

        {isAdmin && (
          <>
            <GroupHeader label="Sistema" groupKey="sistema" openGroups={openGroups} toggleGroup={toggleGroup} />
            {openGroups.sistema && (
              <NavItem tab="users" icon="group" label="Gestión de Personal" {...navItemProps} />
            )}
          </>
        )}
      </nav>

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
  );
}
