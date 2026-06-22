import { TrabajoRealizado } from "../../types";

interface Props {
  filteredTrabajos: TrabajoRealizado[];
  canEditTecnico: boolean;
  canDelete: boolean;
  serviciosCount: number;
  formatDate: (dateStr: string | null) => string;
  setPreviewImage: (url: string | null) => void;
  onOpenCreate: () => void;
  onEdit: (job: TrabajoRealizado) => void;
  onDelete: (id: number) => void;
}

export default function PortfolioTab({ filteredTrabajos, canEditTecnico, canDelete, serviciosCount, formatDate, setPreviewImage, onOpenCreate, onEdit, onDelete }: Props) {
  return (
    <section className="animate-fade-in-up">
      <div className="flex justify-between items-end mb-6">
        <div>
          <h2 className="text-xl font-bold text-on-surface">Trabajos Realizados (Portafolio)</h2>
          <p className="text-xs text-slate-500 mt-0.5">Galería de imágenes de trabajos reales del taller y en campo.</p>
        </div>
        {canEditTecnico && (
          <button
            onClick={onOpenCreate}
            className="bg-red-600 hover:bg-red-700 text-white text-xs font-bold px-5 py-3 rounded-xl transition-all active:scale-95 shadow-md shadow-red-600/10 flex items-center gap-2 cursor-pointer"
          >
            <span className="material-symbols-outlined text-base">add_a_photo</span>
            Registrar Trabajo
          </button>
        )}
      </div>

      {/* Portfolio Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {[
          { label: "Trabajos Realizados", value: filteredTrabajos.length, icon: "photo_library", bg: "bg-red-50 text-red-600" },
          { label: "Con Servicio Asociado", value: filteredTrabajos.filter(t => t.id_servicio).length, icon: "link", bg: "bg-emerald-50 text-emerald-600" },
          { label: "Servicios Disponibles", value: serviciosCount, icon: "build", bg: "bg-slate-100 text-slate-500" },
        ].map((item, i) => (
          <div key={i} className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm flex items-center gap-4 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300">
            <div className={`p-3 rounded-xl ${item.bg}`}>
              <span className="material-symbols-outlined text-2xl">{item.icon}</span>
            </div>
            <div>
              <h4 className="font-bold text-sm text-on-surface">{item.label}</h4>
              <p className="text-xs text-slate-500 mt-0.5"><span className="font-extrabold text-slate-800 text-base">{item.value}</span> elementos</p>
            </div>
          </div>
        ))}
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
                        <img
                          src={job.imagen_url.split("||")[0]}
                          alt={job.titulo}
                          className="w-full h-full object-cover cursor-zoom-in hover:opacity-85 transition-opacity"
                          title="Click para previsualizar"
                          onClick={() => setPreviewImage(job.imagen_url.split("||")[0])}
                        />
                      </div>
                    </td>
                    <td className="px-6 py-4 text-xs font-semibold text-on-surface">
                      <p className="font-bold">{job.titulo}</p>
                      <p className="text-[10px] text-slate-400 font-normal mt-0.5 line-clamp-1">{job.descripcion}</p>
                    </td>
                    <td className="px-6 py-4 text-xs text-slate-600">
                      {job.servicio?.nombre || <span className="text-slate-400 italic">Ninguno</span>}
                    </td>
                    <td className="px-6 py-4 text-xs text-slate-500">{formatDate(job.fecha)}</td>
                    <td className="px-6 py-4 text-right space-x-2">
                      {canEditTecnico && (
                        <button onClick={() => onEdit(job)} className="text-slate-400 hover:text-red-600 p-1 transition-colors cursor-pointer" title="Editar">
                          <span className="material-symbols-outlined text-[18px]">edit</span>
                        </button>
                      )}
                      {canDelete && (
                        <button onClick={() => onDelete(job.id)} className="text-slate-400 hover:text-red-700 p-1 transition-colors cursor-pointer" title="Eliminar">
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
  );
}
