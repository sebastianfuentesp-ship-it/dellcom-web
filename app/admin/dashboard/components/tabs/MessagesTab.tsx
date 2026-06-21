import { MensajeContacto } from "../../types";

interface Props {
  filteredMensajes: MensajeContacto[];
  canDelete: boolean;
  formatDate: (dateStr: string | null) => string;
  onToggleLeido: (id: number, current: boolean) => void;
  onDelete: (id: number) => void;
  onViewMessage: (msg: MensajeContacto) => void;
}

export default function MessagesTab({ filteredMensajes, canDelete, formatDate, onToggleLeido, onDelete, onViewMessage }: Props) {
  return (
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
                      onClick={() => onViewMessage(msg)}
                    >
                      {msg.mensaje}
                    </td>
                    <td className="px-6 py-4">
                      {msg.leido ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[10px] font-bold">Leído</span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-red-100 text-red-800 text-[10px] font-bold">Nuevo</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <button onClick={() => onViewMessage(msg)} className="text-slate-400 hover:text-primary p-1 transition-colors cursor-pointer" title="Ver mensaje completo">
                        <span className="material-symbols-outlined text-[18px]">visibility</span>
                      </button>
                      <button onClick={() => onToggleLeido(msg.id, msg.leido)} className="text-slate-400 hover:text-red-600 p-1 transition-colors cursor-pointer" title={msg.leido ? "Marcar como no leído" : "Marcar como leído"}>
                        <span className="material-symbols-outlined text-[18px]">{msg.leido ? "mark_email_unread" : "mark_email_read"}</span>
                      </button>
                      {canDelete && (
                        <button onClick={() => onDelete(msg.id)} className="text-slate-400 hover:text-red-700 p-1 transition-colors cursor-pointer" title="Eliminar">
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
  );
}
