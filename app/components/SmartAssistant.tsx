"use client";

import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

interface Message {
  id: number;
  sender: "bot" | "user";
  text: string;
  timestamp: string;
}

export default function SmartAssistant() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize with greeting
  useEffect(() => {
    const time = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    setMessages([
      {
        id: 1,
        sender: "bot",
        text: "¡Hola! Bienvenido a DELLCOM SAC. Soy tu asistente virtual de atención. ¿En qué te puedo asesorar hoy? Puedes elegir una de las consultas rápidas de abajo o escribirme directamente.",
        timestamp: time,
      },
    ]);
  }, []);

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isOpen]);

  // Hide in administrative panels
  if (pathname && pathname.startsWith("/admin")) {
    return null;
  }

  const quickTopics = [
    { label: "Ubicación", query: "ubicacion" },
    { label: "Horarios de Atención", query: "horarios" },
    { label: "Soporte AnyDesk", query: "anydesk" },
    { label: "Licencias de Software", query: "licencias" },
    { label: "Servicios Técnicos", query: "servicios" },
  ];

  const getBotResponse = (userText: string): string => {
    // Normalizar texto para remover tildes/acentos y simplificar la búsqueda
    const text = userText
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");

    if (
      text.includes("ubicacion") ||
      text.includes("donde estan") ||
      text.includes("donde queda") ||
      text.includes("direccion") ||
      text.includes("mapa") ||
      text.includes("local") ||
      text.includes("olivos") ||
      text.includes("santa anita") ||
      text.includes("nogales") ||
      text.includes("sucursal") ||
      text.includes("sede")
    ) {
      return "Contamos con dos locales de atención técnica y venta:\n\n1. Sede Los Olivos (Principal):\n• Dirección: Av. Santa Elvira, Mza. E, Lote 59, Urb. San Elías, Los Olivos.\n• Horario: Lunes a Sábado: 9:00 AM - 7:00 PM.\n\n2. Sede Santa Anita:\n• Dirección: Av. Los Nogales 510, Santa Anita.\n• Horario: Lunes a Viernes: 9:00 AM - 8:00 PM | Sábados: 9:00 AM - 6:00 PM.";
    }
    if (
      text.includes("horario") ||
      text.includes("hora") ||
      text.includes("atienden") ||
      text.includes("atencion") ||
      text.includes("sabado") ||
      text.includes("lunes")
    ) {
      return "Nuestros horarios de atención son:\n• Sede Los Olivos: Lunes a Sábado de 9:00 AM a 7:00 PM.\n• Sede Santa Anita: Lunes a Viernes de 9:00 AM a 8:00 PM, y Sábados de 9:00 AM a 6:00 PM.\nAmbas sedes permanecen cerradas domingos y feriados.";
    }
    if (
      text.includes("precio") ||
      text.includes("costo") ||
      text.includes("cuanto cuesta") ||
      text.includes("tarifa") ||
      text.includes("presupuesto") ||
      text.includes("cotizar") ||
      text.includes("soles")
    ) {
      return "Los precios de reparaciones electrónicas se determinan tras un diagnóstico en nuestro taller. Para suministros de oficina (tintas, ribbons) o licenciamiento, puedes ver tarifas estimadas en la pestaña de 'Catálogo' en el menú, o escribirnos directamente a WhatsApp para darte un presupuesto exacto de stock.";
    }
    if (
      text.includes("whatsapp") ||
      text.includes("telefono") ||
      text.includes("celular") ||
      text.includes("contacto") ||
      text.includes("llamar") ||
      text.includes("numero")
    ) {
      return "Puedes contactar directamente a nuestros técnicos a través de WhatsApp o llamada telefónica a los números de soporte oficial:\n• +51 925 981 741\n• +51 922 452 929";
    }
    if (
      text.includes("anydesk") ||
      text.includes("soporte remoto") ||
      text.includes("remote") ||
      text.includes("rustdesk") ||
      text.includes("control remoto")
    ) {
      return "Ofrecemos asistencia remota inmediata. Ingresa a la sección 'Soporte' en la barra de navegación para descargar los aplicativos oficiales de AnyDesk y RustDesk, y ver la guía de uso.";
    }
    if (
      text.includes("licencia") ||
      text.includes("windows") ||
      text.includes("office") ||
      text.includes("antivirus") ||
      text.includes("key") ||
      text.includes("clave")
    ) {
      return "Sí, contamos con licencias digitales originales y con garantía permanente para Windows 10/11 Home y Pro, suites de Microsoft Office 2021/365, y antivirus de marcas reconocidas. Revisa el 'Catálogo' para ver precios.";
    }
    if (
      text.includes("laptop") ||
      text.includes("impresora") ||
      text.includes("zebra") ||
      text.includes("computadora") ||
      text.includes("reparacion") ||
      text.includes("mantenimiento") ||
      text.includes("placa") ||
      text.includes("soldadura") ||
      text.includes("servicio") ||
      text.includes("tecnico") ||
      text.includes("soporte")
    ) {
      return "Somos especialistas en soporte correctivo:\n• Microelectrónica y soldadura SMD en placas de laptops y PCs.\n• Mantenimiento y calibración de impresoras térmicas e industriales Zebra.\n• Cableado de red estructurado y gabinetes rack para empresas.";
    }
    if (
      text.includes("hola") ||
      text.includes("buenos dias") ||
      text.includes("buenas tardes") ||
      text.includes("buenas noches") ||
      text.includes("que tal") ||
      text.includes("saludos")
    ) {
      return "¡Hola! Bienvenido a la atención virtual de DELLCOM SAC. ¿En qué te puedo colaborar hoy? Puedes seleccionar una de las consultas de botones rápidos o escribirme tu caso.";
    }

    // Default message indicating WhatsApp redirection
    return "No dispongo de una respuesta exacta para tu consulta en este momento. Te recomiendo comunicarte directamente con uno de nuestros técnicos a través de WhatsApp (pulsando el botón al final de este panel) o rellenando el formulario en nuestra página de Contacto.";
  };

  const handleSend = (textToSend: string) => {
    if (!textToSend.trim()) return;

    const time = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    const userMsg: Message = {
      id: Date.now(),
      sender: "user",
      text: textToSend,
      timestamp: time,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");

    // Simulate response delay
    setTimeout(() => {
      const botReplyText = getBotResponse(textToSend);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: "bot",
          text: botReplyText,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    }, 400);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 font-body">
      {/* Chat Button Toggle */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="w-14 h-14 bg-primary hover:bg-primary/95 text-white rounded-full flex items-center justify-center shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all cursor-pointer border-none"
          title="Asistente Virtual"
        >
          <span className="material-symbols-outlined text-2xl">smart_toy</span>
        </button>
      )}

      {/* Chat Window Panel */}
      {isOpen && (
        <div className="w-[calc(100vw-2rem)] sm:w-96 h-[500px] bg-white rounded-3xl shadow-2xl border border-slate-100 flex flex-col justify-between overflow-hidden animate-fade-in-up">
          {/* Header */}
          <div className="bg-white border-b border-slate-100 px-5 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary relative">
                <span className="material-symbols-outlined text-2xl text-primary">smart_toy</span>
                <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-white animate-pulse" />
              </div>
              <div>
                <h3 className="font-headline text-sm font-bold text-slate-900 leading-none">Soporte DELLCOM</h3>
                <span className="text-[10px] font-bold text-green-600 uppercase tracking-widest leading-none mt-1.5 block">Asistente Online</span>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="w-8 h-8 flex items-center justify-center rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer border-none"
            >
              <span className="material-symbols-outlined text-base">close</span>
            </button>
          </div>

          {/* Messages Body */}
          <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4 no-scrollbar bg-slate-50/50">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col max-w-[80%] ${
                  msg.sender === "user" ? "ml-auto items-end" : "mr-auto items-start"
                }`}
              >
                <div
                  className={`px-4 py-3 rounded-2xl text-xs font-semibold leading-relaxed whitespace-pre-line ${
                    msg.sender === "user"
                      ? "bg-primary text-white rounded-tr-none shadow-md shadow-primary/5"
                      : "bg-white text-slate-800 border border-slate-100 rounded-tl-none shadow-sm"
                  }`}
                >
                  {msg.text}
                </div>
                <span className="text-[8px] font-bold text-slate-400 mt-1 uppercase tracking-wider">
                  {msg.timestamp}
                </span>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Suggestion Buttons */}
          <div className="px-5 py-2 border-t border-slate-100 bg-white flex overflow-x-auto no-scrollbar gap-2 shrink-0">
            {quickTopics.map((topic, i) => (
              <button
                key={i}
                onClick={() => handleSend(topic.label)}
                className="px-3.5 py-1.5 bg-slate-50 hover:bg-primary/5 text-slate-600 hover:text-primary border border-slate-200/60 rounded-full text-[10px] font-bold tracking-wide uppercase transition-all whitespace-nowrap cursor-pointer select-none"
              >
                {topic.label}
              </button>
            ))}
          </div>

          {/* Form Input Footer */}
          <div className="p-4 border-t border-slate-100 bg-white space-y-3 shrink-0">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend(input);
              }}
              className="flex gap-2"
            >
              <input
                type="text"
                placeholder="Escribe tu consulta aquí..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="flex-1 bg-slate-50 border border-slate-200 focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none rounded-xl px-4 py-3 text-xs font-semibold placeholder:text-slate-400 transition-all"
              />
              <button
                type="submit"
                className="w-10 h-10 bg-primary hover:bg-primary/95 text-white rounded-xl flex items-center justify-center shrink-0 shadow-md shadow-primary/10 active:scale-95 transition-all cursor-pointer border-none"
              >
                <span className="material-symbols-outlined text-base">send</span>
              </button>
            </form>

            <a
              href="https://wa.me/51925981741?text=Hola%20Dellcom%20SAC,%20deseo%20comunicarme%20con%20un%20asesor%20para%20asistencia%20tecnica."
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-1.5 w-full bg-green-600 hover:bg-green-700 text-white font-bold text-[10px] uppercase tracking-wider py-2.5 rounded-xl transition-all shadow-md shadow-green-600/10 text-center no-underline cursor-pointer"
            >
              <span className="material-symbols-outlined text-sm">chat</span>
              Contactar Técnico por WhatsApp
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
