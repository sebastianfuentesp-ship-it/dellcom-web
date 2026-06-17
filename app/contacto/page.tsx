/**
 * Página de contacto: /contacto
 * Formulario conversacional que envía un mensaje a la API /api/contacto (POST).
 * Maneja estados de carga, éxito y errores de validación (devueltos por Zod).
 * Incluye mapa de ubicación con iframe de Google Maps y tabs para seleccionar
 * entre la sede Los Olivos y la sede Santa Anita.
 */
"use client";

import { useState } from "react";
import StatusHeader from "../components/StatusHeader";
import CleanFooter from "../components/CleanFooter";
import ScrollRevealObserver from "../components/ScrollRevealObserver";

export default function ContactoPage() {
  const [selectedBranch, setSelectedBranch] = useState<"olivos" | "santa_anita">("olivos");
  // Conversational Form State
  const [nombre, setNombre] = useState("");
  const [empresa, setEmpresa] = useState("");
  const [asunto, setAsunto] = useState("Soporte Técnico");
  const [telefono, setTelefono] = useState("");
  const [email, setEmail] = useState("");
  const [mensaje, setMensaje] = useState("");

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);
    setErrors({});
    setErrorMessage("");

    try {
      const response = await fetch("/api/contacto", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nombre,
          correo: email,
          telefono: telefono || null,
          asunto,
          mensaje,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.errors) {
          setErrors(data.errors);
        } else {
          setErrorMessage(data.error || "Ocurrio un error al enviar el mensaje.");
        }
        return;
      }

      setSuccess(true);
      setNombre("");
      setAsunto("Soporte Técnico");
      setTelefono("");
      setEmail("");
      setMensaje("");
      setEmpresa("");

      // Desaparecer el mensaje de éxito tras 5 segundos
      setTimeout(() => setSuccess(false), 5000);
    } catch (err) {
      console.error(err);
      setErrorMessage("Error de conexion con el servidor. Intentelo mas tarde.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white min-h-screen flex flex-col justify-between text-on-surface selection:bg-primary/20 selection:text-primary">
      {/* Reusable Status Header */}
      <StatusHeader />

      <main className="pt-16">
        {/* Asymmetric Header Banner */}
        <section className="relative py-16 bg-slate-50/50 overflow-hidden border-b border-slate-100">
          <div className="absolute inset-0 opacity-[0.02] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '16px 16px' }} />
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] pointer-events-none" />

          
          <div className="relative px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto w-full text-center z-10 scroll-reveal">
            <span className="inline-block py-1 px-3.5 mb-4 bg-primary/10 border border-primary/15 text-primary font-bold text-[10px] rounded-full uppercase tracking-widest">
              Hablemos hoy mismo
            </span>
            <h1 className="font-headline text-3xl md:text-5xl font-black text-on-surface leading-tight tracking-tight">
              Estamos Listos para <span className="text-primary">Ayudarte</span>
            </h1>
            <p className="text-xs md:text-sm font-semibold text-on-surface-variant max-w-xl mx-auto mt-2 leading-relaxed">
              Completa la carta de contacto a continuación para describir tu solicitud técnica. Nos comunicaremos contigo el mismo día.
            </p>
          </div>
        </section>

        {/* Form & Map Section Container */}
        <div className="py-20 max-w-container-max mx-auto w-full px-margin-mobile md:px-margin-desktop">
          {/* Form & Map Section */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch">
          
          {/* Left Column: Premium Contact Form */}
          <div className="lg:col-span-7 bg-slate-50/50 border border-slate-200/80 rounded-[2.5rem] p-8 md:p-12 shadow-xl flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full blur-2xl pointer-events-none" />
            
            <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
              <h3 className="font-headline font-bold text-lg text-slate-800 mb-6 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">chat_bubble</span>
                Envíanos un Mensaje
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Nombre */}
                <div className="space-y-2">
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                    Nombre Completo
                  </label>
                  <div className="flex items-center gap-3 bg-white border border-slate-200 focus-within:border-primary focus-within:ring-1 focus-within:ring-primary/20 rounded-2xl px-4 transition-all">
                    <span className="material-symbols-outlined text-slate-400 text-lg select-none">person</span>
                    <input
                      type="text"
                      placeholder="Ej. Juan Pérez"
                      value={nombre}
                      onChange={(e) => setNombre(e.target.value)}
                      required
                      className="w-full py-3.5 bg-transparent border-none text-xs font-semibold focus:outline-none text-on-surface placeholder:text-slate-300"
                    />
                  </div>
                  {errors.nombre && (
                    <p className="text-red-600 text-[10px] font-bold uppercase tracking-wider mt-1 px-1">
                      {errors.nombre[0]}
                    </p>
                  )}
                </div>

                {/* Empresa */}
                <div className="space-y-2">
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                    Empresa / Negocio (Opcional)
                  </label>
                  <div className="flex items-center gap-3 bg-white border border-slate-200 focus-within:border-primary focus-within:ring-1 focus-within:ring-primary/20 rounded-2xl px-4 transition-all">
                    <span className="material-symbols-outlined text-slate-400 text-lg select-none">corporate_fare</span>
                    <input
                      type="text"
                      placeholder="Ej. Dellcom SAC"
                      value={empresa}
                      onChange={(e) => setEmpresa(e.target.value)}
                      className="w-full py-3.5 bg-transparent border-none text-xs font-semibold focus:outline-none text-on-surface placeholder:text-slate-300"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Teléfono */}
                <div className="space-y-2">
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                    Teléfono / Celular
                  </label>
                  <div className="flex items-center gap-3 bg-white border border-slate-200 focus-within:border-primary focus-within:ring-1 focus-within:ring-primary/20 rounded-2xl px-4 transition-all">
                    <span className="material-symbols-outlined text-slate-400 text-lg select-none">call</span>
                    <input
                      type="tel"
                      placeholder="Ej. 987654321"
                      value={telefono}
                      onChange={(e) => setTelefono(e.target.value)}
                      required
                      className="w-full py-3.5 bg-transparent border-none text-xs font-semibold focus:outline-none text-on-surface placeholder:text-slate-300"
                    />
                  </div>
                  {errors.telefono && (
                    <p className="text-red-600 text-[10px] font-bold uppercase tracking-wider mt-1 px-1">
                      {errors.telefono[0]}
                    </p>
                  )}
                </div>

                {/* Correo */}
                <div className="space-y-2">
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                    Correo Electrónico
                  </label>
                  <div className="flex items-center gap-3 bg-white border border-slate-200 focus-within:border-primary focus-within:ring-1 focus-within:ring-primary/20 rounded-2xl px-4 transition-all">
                    <span className="material-symbols-outlined text-slate-400 text-lg select-none">alternate_email</span>
                    <input
                      type="email"
                      placeholder="Ej. juan@correo.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full py-3.5 bg-transparent border-none text-xs font-semibold focus:outline-none text-on-surface placeholder:text-slate-300"
                    />
                  </div>
                  {errors.correo && (
                    <p className="text-red-600 text-[10px] font-bold uppercase tracking-wider mt-1 px-1">
                      {errors.correo[0]}
                    </p>
                  )}
                </div>
              </div>

              {/* Asunto */}
              <div className="space-y-2">
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                  Asunto de la Consulta
                </label>
                <div className="flex items-center gap-3 bg-white border border-slate-200 focus-within:border-primary focus-within:ring-1 focus-within:ring-primary/20 rounded-2xl px-4 transition-all">
                  <span className="material-symbols-outlined text-slate-400 text-lg select-none">support_agent</span>
                  <select
                    value={asunto}
                    onChange={(e) => setAsunto(e.target.value)}
                    className="w-full py-3.5 bg-transparent border-none text-xs font-semibold focus:outline-none text-on-surface cursor-pointer"
                  >
                    <option value="Soporte Técnico">Soporte Técnico</option>
                    <option value="Cotización de Servicio">Cotización de Servicio</option>
                    <option value="Reparación de Hardware">Reparación de Hardware</option>
                    <option value="Licencias y Software">Licencias y Software</option>

                  </select>
                </div>
                {errors.asunto && (
                  <p className="text-red-600 text-[10px] font-bold uppercase tracking-wider mt-1 px-1">
                    {errors.asunto[0]}
                  </p>
                )}
              </div>

              {/* Mensaje */}
              <div className="space-y-2">
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                  Detalle del Mensaje o Síntoma del Equipo
                </label>
                <div className="flex items-start gap-3 bg-white border border-slate-200 focus-within:border-primary focus-within:ring-1 focus-within:ring-primary/20 rounded-2xl px-4 py-3.5 transition-all">
                  <span className="material-symbols-outlined text-slate-400 text-lg select-none mt-1">edit_note</span>
                  <textarea
                    placeholder="Describe aquí detalladamente el requerimiento de soporte o cotización..."
                    value={mensaje}
                    onChange={(e) => setMensaje(e.target.value)}
                    rows={4}
                    className="w-full bg-transparent border-none text-xs font-semibold focus:outline-none text-on-surface placeholder:text-slate-400 leading-relaxed resize-none"
                  />
                </div>
                {errors.mensaje && (
                  <p className="text-red-600 text-[10px] font-bold uppercase tracking-wider mt-1 px-1">
                    {errors.mensaje[0]}
                  </p>
                )}
              </div>

              {/* Status messages & Submit */}
              <div className="flex flex-col sm:flex-row gap-4 items-center">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full sm:w-auto bg-primary hover:bg-primary/95 text-white px-10 py-4.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all active:scale-95 shadow-lg shadow-primary/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <span className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                      Procesando...
                    </>
                  ) : (
                    <>
                      <span className="material-symbols-outlined text-sm">send</span>
                      Enviar Solicitud
                    </>
                  )}
                </button>

                {success && (
                  <div className="bg-emerald-50 border border-emerald-100 text-emerald-800 text-xs font-bold rounded-2xl px-4 py-3.5 flex items-center gap-2 animate-fade-in-up">
                    <span className="material-symbols-outlined text-emerald-500">check_circle</span>
                    ¡Solicitud enviada! Nos pondremos en contacto contigo en breve.
                  </div>
                )}

                {errorMessage && (
                  <div className="bg-red-50 border border-red-100 text-red-800 text-xs font-bold rounded-2xl px-4 py-3.5 flex items-center gap-2 animate-fade-in-up">
                    <span className="material-symbols-outlined text-red-500">error</span>
                    {errorMessage}
                  </div>
                )}
              </div>
            </form>
          </div>

          {/* Right Column: Contact Details & Action */}
          <div className="lg:col-span-5 flex flex-col justify-between gap-6">
            
            {/* Address & Details card */}
            <div className="bg-slate-50/50 border border-slate-200/80 rounded-[2.5rem] p-8 space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="font-headline font-bold text-lg text-slate-800">
                  Nuestras Sedes
                </h3>
              </div>

              {/* Tabs Switcher */}
              <div className="grid grid-cols-2 gap-2 bg-slate-100 p-1.5 rounded-2xl">
                <button
                  type="button"
                  onClick={() => setSelectedBranch("olivos")}
                  className={`py-3 text-xs font-bold uppercase tracking-wider rounded-xl transition-all cursor-pointer border-none ${
                    selectedBranch === "olivos"
                      ? "bg-white text-primary shadow-sm"
                      : "text-slate-500 hover:text-slate-800 bg-transparent"
                  }`}
                >
                  Los Olivos
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedBranch("santa_anita")}
                  className={`py-3 text-xs font-bold uppercase tracking-wider rounded-xl transition-all cursor-pointer border-none ${
                    selectedBranch === "santa_anita"
                      ? "bg-white text-primary shadow-sm"
                      : "text-slate-500 hover:text-slate-800 bg-transparent"
                  }`}
                >
                  Santa Anita
                </button>
              </div>
              
              <div className="space-y-4 min-h-[160px] transition-all duration-300">
                <div className="flex items-start gap-3 text-xs">
                  <div className="bg-primary/10 text-primary p-2.5 rounded-xl mt-0.5">
                    <span className="material-symbols-outlined text-lg leading-none">location_on</span>
                  </div>
                  <div>
                    <p className="font-bold text-on-surface">Ubicación</p>
                    <p className="text-on-surface-variant mt-0.5 leading-relaxed">
                      {selectedBranch === "olivos"
                        ? "Av. Santa Elvira, Mza. E, Lote 59, Urb. San Elías, Los Olivos, Lima."
                        : "Av. Los Nogales 510 - Santa Anita, Lima."}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 text-xs">
                  <div className="bg-primary/10 text-primary p-2.5 rounded-xl mt-0.5">
                    <span className="material-symbols-outlined text-lg leading-none">schedule</span>
                  </div>
                  <div>
                    <p className="font-bold text-on-surface">Horario de Soporte</p>
                    <p className="text-on-surface-variant mt-0.5 leading-relaxed">
                      {selectedBranch === "olivos"
                        ? "Lunes a Sábado: 9:00 AM - 7:00 PM (Soporte presencial y remoto)"
                        : "Lunes a Viernes: 9:00 AM - 8:00 PM | Sábado: 9:00 AM - 6:00 PM"}
                    </p>
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
                      <span className="text-[10px] text-slate-400 mt-1 font-semibold">soporte@dellcom.pe</span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Direct WhatsApp Action */}
              <a
                href={
                  selectedBranch === "olivos"
                    ? "https://wa.me/51925981741?text=Hola%20DELLCOM%20Los%20Olivos,%20deseo%20asistencia%20t%C3%A9cnica%20inmediata."
                    : "https://wa.me/51925981741?text=Hola%20DELLCOM%20Santa%20Anita,%20deseo%20asistencia%20t%C3%A9cnica%20inmediata."
                }
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

            {/* Maps Embed */}
            <div className="bg-slate-100 rounded-[2.5rem] overflow-hidden border border-slate-200/80 shadow-md relative h-[250px] transition-all duration-300">
              <iframe 
                src={
                  selectedBranch === "olivos"
                    ? "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3903.1118432328766!2d-77.0756549242084!3d-11.95772378735626!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9105d04c4b69dcfb%3A0xd3b34bdf88ea4eb6!2sAv.%20Santa%20Elvira%2C%20Los%20Olivos%2015306!5e0!3m2!1ses!2spe!4v1717210000000!5m2!1ses!2spe"
                    : "https://maps.google.com/maps?q=Av.+Los+Nogales+510%2C+Santa+Anita%2C+Lima&t=&z=16&ie=UTF8&iwloc=&output=embed"
                }
                className="w-full h-full border-0 absolute inset-0"
                allowFullScreen={true}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>

          </div>
      </div>
      </div>
    </main>

      {/* Reusable Clean Footer */}
      <CleanFooter />

      <ScrollRevealObserver />
    </div>
  );
}
