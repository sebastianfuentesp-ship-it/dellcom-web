import { ArchivoTecnico } from "../../types";

interface Props {
  filteredArchivos: ArchivoTecnico[];
  canEditTecnico: boolean;
  canDelete: boolean;
  fileCountByType: (type: string) => number;
  formatDate: (dateStr: string | null) => string;
  onOpenCreate: () => void;
  onEdit: (file: ArchivoTecnico) => void;
  onDelete: (id: number) => void;
}

function getFileBadge(file: ArchivoTecnico): { bg: string; text: string } {
  const name = file.nombre.toLowerCase();
  const url = file.url_archivo.toLowerCase();
  const isPdf = name.endsWith(".pdf") || url.includes(".pdf") || name.includes(" pdf");
  const isExcel = name.endsWith(".xlsx") || name.endsWith(".xls") || url.includes(".xlsx") || url.includes(".xls") || name.includes("excel");

  if (isPdf) return { bg: "bg-red-50 text-red-600 border-red-100", text: "PDF" };
  if (isExcel) return { bg: "bg-emerald-50 text-emerald-600 border-emerald-100", text: "XLSX" };
  if (file.tipo === "driver") return { bg: "bg-blue-50 text-blue-600 border-blue-100", text: "DRIVER" };
  if (file.tipo === "programa") return { bg: "bg-purple-50 text-purple-600 border-purple-100", text: "PROGRAMA" };
  if (file.tipo === "link") return { bg: "bg-amber-50 text-amber-600 border-amber-100", text: "LINK" };
  return { bg: "bg-slate-100 text-slate-700 border-slate-200", text: file.tipo.toUpperCase() };
}

export default function FilesTab({ filteredArchivos, canEditTecnico, canDelete, fileCountByType, formatDate, onOpenCreate, onEdit, onDelete }: Props) {
  return (
    <section className="animate-fade-in-up">
      <div className="flex justify-between items-end mb-6">
        <div>
          <h2 className="text-xl font-bold text-on-surface">Repositorio de Archivos y Drivers Técnicos</h2>
          <p className="text-xs text-slate-500 mt-0.5">Gestión de recursos, manuales, parches e instaladores de software.</p>
        </div>
        {canEditTecnico && (
          <button
            onClick={onOpenCreate}
            className="bg-red-600 hover:bg-red-700 text-white text-xs font-bold px-5 py-3 rounded-xl transition-all active:scale-95 shadow-md shadow-red-600/10 flex items-center gap-2 cursor-pointer"
          >
            <span className="material-symbols-outlined text-base">cloud_upload</span>
            Registrar Recurso
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {[
          { icon: "laptop_mac", label: "Programas (.exe)", count: fileCountByType("programa"), suffix: " archivos" },
          { icon: "memory", label: "Controladores", count: fileCountByType("driver"), suffix: " drivers" },
          { icon: "description", label: "Planillas Excel", count: fileCountByType("excel"), suffix: " documentos" },
          { icon: "link", label: "Enlaces Útiles", count: fileCountByType("link"), suffix: " links" },
        ].map((item) => (
          <div key={item.icon} className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm flex items-center gap-4 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300">
            <div className="bg-red-50 text-red-600 p-3 rounded-xl">
              <span className="material-symbols-outlined text-2xl">{item.icon}</span>
            </div>
            <div>
              <h4 className="font-bold text-sm text-on-surface">{item.label}</h4>
              <p className="text-xs text-slate-500 mt-0.5">{item.count}{item.suffix}</p>
            </div>
          </div>
        ))}
      </div>

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
                filteredArchivos.map((file) => {
                  const badge = getFileBadge(file);
                  return (
                    <tr key={file.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <span className="font-semibold text-sm text-on-surface block">{file.nombre}</span>
                        {file.descripcion && <span className="text-xs text-slate-500 leading-none">{file.descripcion}</span>}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-block px-2.5 py-1 rounded-md border text-[10px] font-bold uppercase tracking-wider ${badge.bg}`}>
                          {badge.text}
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
                        <div className="flex justify-end items-center gap-1.5">
                          {canEditTecnico && (
                            <button onClick={() => onEdit(file)} className="text-slate-400 hover:text-blue-600 p-1 transition-colors cursor-pointer" title="Editar">
                              <span className="material-symbols-outlined text-[18px]">edit</span>
                            </button>
                          )}
                          {canDelete && (
                            <button onClick={() => onDelete(file.id)} className="text-slate-400 hover:text-red-700 p-1 transition-colors cursor-pointer" title="Eliminar">
                              <span className="material-symbols-outlined text-[18px]">delete</span>
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
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
  );
}
