import { Licencia } from "../../types";

interface Props {
  filteredLicencias: Licencia[];
  isAdmin: boolean;
  canDelete: boolean;
  getLicenseUrgency: (dateStr: string | null) => "ok" | "warning" | "expired";
  formatDate: (dateStr: string | null) => string;
  onOpenCreate: () => void;
  onEdit: (lic: Licencia) => void;
  onDelete: (id: number) => void;
}

export default function LicensesTab({ filteredLicencias, isAdmin, canDelete, getLicenseUrgency, formatDate, onOpenCreate, onEdit, onDelete }: Props) {
  return (
    <section className="animate-fade-in-up">
      <div className="flex justify-between items-end mb-6">
        <div>
          <h2 className="text-xl font-bold text-on-surface">Gestión de Licencias de Software</h2>
          <p className="text-xs text-slate-500 mt-0.5">Control centralizado de suscripciones, cuentas de correo y vigencias de clientes.</p>
        </div>
        {isAdmin && (
          <button
            onClick={onOpenCreate}
            className="bg-red-600 hover:bg-red-700 text-white text-xs font-bold px-5 py-3 rounded-xl transition-all active:scale-95 shadow-md shadow-red-600/10 flex items-center gap-2 cursor-pointer"
          >
            <span className="material-symbols-outlined text-base">add</span>
            Registrar Licencia
          </button>
        )}
      </div>

      {/* Licenses Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {[
          { label: "Licencias Activas", value: filteredLicencias.filter(l => l.estado === "activo").length, icon: "verified_user", bg: "bg-emerald-50 text-emerald-600" },
          { label: "Próximas a Vencer", value: filteredLicencias.filter(l => getLicenseUrgency(l.fecha_fin) === "warning").length, icon: "schedule", bg: "bg-orange-50 text-orange-500" },
          { label: "Alertas Críticas", value: filteredLicencias.filter(l => getLicenseUrgency(l.fecha_fin) === "expired").length, icon: "error", bg: "bg-red-50 text-red-600" },
        ].map((item, i) => (
          <div key={i} className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm flex items-center gap-4 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300">
            <div className={`p-3 rounded-xl ${item.bg}`}>
              <span className="material-symbols-outlined text-2xl">{item.icon}</span>
            </div>
            <div>
              <h4 className="font-bold text-sm text-on-surface">{item.label}</h4>
              <p className="text-xs text-slate-500 mt-0.5"><span className="font-extrabold text-slate-800 text-base">{item.value}</span> licencias</p>
            </div>
          </div>
        ))}
      </div>

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
                            <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse"></span>Vencido
                          </span>
                        ) : urgency === "warning" ? (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-100 text-orange-800 text-[10px] font-extrabold uppercase tracking-wide border border-orange-200">
                            <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse"></span>Por Vencer
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-extrabold uppercase tracking-wide border border-emerald-200">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>Activo
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right space-x-2">
                        {isAdmin && (
                          <button onClick={() => onEdit(lic)} className="text-slate-400 hover:text-red-600 p-1 transition-colors cursor-pointer" title="Editar">
                            <span className="material-symbols-outlined text-[18px]">edit</span>
                          </button>
                        )}
                        {canDelete && (
                          <button onClick={() => onDelete(lic.id)} className="text-slate-400 hover:text-red-700 p-1 transition-colors cursor-pointer" title="Eliminar">
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
  );
}
