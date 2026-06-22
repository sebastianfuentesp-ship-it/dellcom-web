interface Props {
  selectedBranch: "olivos" | "santa_anita";
  setSelectedBranch: (v: "olivos" | "santa_anita") => void;
}

const BRANCH_DATA = {
  olivos: {
    label: "Los Olivos",
    address: "Av. Santa Elvira, Mza. E, Lote 59, Urb. San Elías, Los Olivos, Lima.",
    schedule: "Lunes a Sábado: 9:00 AM - 7:00 PM (Soporte presencial y remoto)",
    whatsapp: `https://wa.me/51925981741?text=${encodeURIComponent("👋 Hola DELLCOM Los Olivos, deseo asistencia técnica inmediata. 🔧 ¿Están disponibles?")}`,
    mapSrc: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3903.1118432328766!2d-77.0756549242084!3d-11.95772378735626!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9105d04c4b69dcfb%3A0xd3b34bdf88ea4eb6!2sAv.%20Santa%20Elvira%2C%20Los%20Olivos%2015306!5e0!3m2!1ses!2spe!4v1717210000000!5m2!1ses!2spe",
  },
  santa_anita: {
    label: "Santa Anita",
    address: "Av. Los Nogales 510 - Santa Anita, Lima.",
    schedule: "Lunes a Viernes: 9:00 AM - 8:00 PM | Sábado: 9:00 AM - 6:00 PM",
    whatsapp: `https://wa.me/51925981741?text=${encodeURIComponent("👋 Hola DELLCOM Santa Anita, deseo asistencia técnica inmediata. 🔧 ¿Están disponibles?")}`,
    mapSrc: "https://maps.google.com/maps?q=Av.+Los+Nogales+510%2C+Santa+Anita%2C+Lima&t=&z=16&ie=UTF8&iwloc=&output=embed",
  },
};

export default function ContactSidebar({ selectedBranch, setSelectedBranch }: Props) {
  const branch = BRANCH_DATA[selectedBranch];

  return (
    <div className="lg:col-span-5 flex flex-col justify-between gap-6">
      <div className="bg-slate-50/50 border border-slate-200/80 rounded-[2.5rem] p-8 space-y-6">
        <h3 className="font-headline font-bold text-lg text-slate-800">Nuestras Sedes</h3>

        <div className="grid grid-cols-2 gap-2 bg-slate-100 p-1.5 rounded-2xl">
          {(["olivos", "santa_anita"] as const).map((key) => (
            <button
              key={key}
              type="button"
              onClick={() => setSelectedBranch(key)}
              className={`py-3 text-xs font-bold uppercase tracking-wider rounded-xl transition-all cursor-pointer border-none ${
                selectedBranch === key ? "bg-white text-primary shadow-sm" : "text-slate-500 hover:text-slate-800 bg-transparent"
              }`}
            >
              {BRANCH_DATA[key].label}
            </button>
          ))}
        </div>

        <div className="space-y-4 min-h-[160px] transition-all duration-300">
          <div className="flex items-start gap-3 text-xs">
            <div className="bg-primary/10 text-primary p-2.5 rounded-xl mt-0.5">
              <span className="material-symbols-outlined text-lg leading-none">location_on</span>
            </div>
            <div>
              <p className="font-bold text-on-surface">Ubicación</p>
              <p className="text-on-surface-variant mt-0.5 leading-relaxed">{branch.address}</p>
            </div>
          </div>

          <div className="flex items-start gap-3 text-xs">
            <div className="bg-primary/10 text-primary p-2.5 rounded-xl mt-0.5">
              <span className="material-symbols-outlined text-lg leading-none">schedule</span>
            </div>
            <div>
              <p className="font-bold text-on-surface">Horario de Soporte</p>
              <p className="text-on-surface-variant mt-0.5 leading-relaxed">{branch.schedule}</p>
            </div>
          </div>

          <div className="flex items-start gap-3 text-xs">
            <div className="bg-primary/10 text-primary p-2.5 rounded-xl mt-0.5">
              <span className="material-symbols-outlined text-lg leading-none">phone_iphone</span>
            </div>
            <div>
              <p className="font-bold text-on-surface">Líneas de Atención</p>
              <p className="text-on-surface-variant mt-0.5 flex flex-col gap-0.5">
                <span>+51 925 981 741</span>
                <span>+51 922 452 929</span>
                <span className="text-[10px] text-slate-400 mt-1 font-semibold">ventas@dellcom-sac.com</span>
              </p>
            </div>
          </div>
        </div>

        <a
          href={branch.whatsapp}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full bg-[#25D366] text-white py-4 rounded-2xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 hover:scale-[1.02] transition-all shadow-lg shadow-green-500/20 active:scale-95 cursor-pointer no-underline"
        >
          <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
          </svg>
          Escribir por WhatsApp
        </a>
      </div>

      <div className="bg-slate-100 rounded-[2.5rem] overflow-hidden border border-slate-200/80 shadow-md relative h-[250px] transition-all duration-300">
        <iframe
          src={branch.mapSrc}
          className="w-full h-full border-0 absolute inset-0"
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>
    </div>
  );
}
