/**
 * Sección de Preguntas Frecuentes (FAQ) de la página de inicio.
 * Es un Client Component que maneja la interactividad de los acordeones de preguntas.
 */
"use client";

import { useState, useEffect, useRef } from "react";

interface FaqItem {
  question: string;
  answer: string;
  icon: string;
}

export default function HomeFaqSection() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [isRevealed, setIsRevealed] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsRevealed(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  const faqs: FaqItem[] = [
    {
      question: "¿Realizan diagnósticos a domicilio o debo llevar mi equipo al laboratorio?",
      answer: "Para diagnósticos electrónicos complejos, como reparación de placas base y soldadura SMD, es necesario llevar el equipo a nuestro laboratorio principal en Los Olivos para contar con los instrumentos de precisión adecuados. No obstante, ofrecemos soporte técnico remoto inmediato vía AnyDesk o RustDesk para fallas de software, y visitas técnicas corporativas para infraestructura y cableado de red.",
      icon: "home_repair_service"
    },
    {
      question: "¿Las licencias de software que venden son originales y tienen garantía?",
      answer: "Sí, todas las licencias de software que proveemos (Windows 10/11 Pro y Home, Microsoft Office 2021/365, Antivirus) son digitales, 100% originales y cuentan con garantía permanente. Se registran en nuestra base de datos para que puedas validar su estado de vigencia ante cualquier inconveniente técnico.",
      icon: "verified_user"
    },
    {
      question: "¿Cuánto tiempo toma diagnosticar y reparar una laptop o impresora Zebra?",
      answer: "Los diagnósticos básicos de placas de laptops y calibración de impresoras térmicas Zebra toman un máximo de 24 horas hábiles. Una vez aprobado el presupuesto por el cliente, la reparación física se realiza en un plazo de 24 a 48 horas, sujeto a la disponibilidad de repuestos en stock.",
      icon: "schedule"
    },
    {
      question: "¿Cómo funciona el servicio de asistencia remota en tiempo real?",
      answer: "Es muy rápido: 1) Descarga AnyDesk o RustDesk desde nuestra sección de 'Soporte'. 2) Abre el aplicativo para ver tu ID de 9 dígitos. 3) Escribe el ID en nuestra consola web y pulsa 'Conectar'. Esto enviará un mensaje pre-redactado a nuestros técnicos vía WhatsApp y nos conectaremos en segundos.",
      icon: "support_agent"
    },
    {
      question: "¿Realizan ventas de suministros y repuestos al por mayor?",
      answer: "Sí, proveemos suministros originales para oficinas e industrias (tintas Epson/HP, ribbons Zebra de cera/resina y tarjetas de PVC) tanto al por menor como al por mayor con tarifas competitivas para empresas. Puedes consultar stock enviándonos tu carrito de cotización por la web.",
      icon: "shopping_cart"
    }
  ];

  const toggleFaq = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <section ref={sectionRef} className="py-24 px-margin-mobile md:px-margin-desktop bg-slate-50 border-t border-b border-slate-100/80">
      <div className="max-w-container-max mx-auto space-y-12">
        {/* Section Header */}
        <div className={`text-center max-w-2xl mx-auto space-y-4 scroll-reveal ${isRevealed ? "reveal-active" : ""}`}>
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider">
            <span className="material-symbols-outlined text-[16px]">help</span>
            Resolviendo Dudas
          </div>
          <h2 className="font-headline text-3xl md:text-4xl font-bold text-on-surface">
            Preguntas <span className="text-primary">Frecuentes</span>
          </h2>
          <p className="text-xs md:text-sm font-semibold text-on-surface-variant leading-relaxed">
            Encuentra respuestas rápidas a las consultas más habituales de nuestros clientes sobre soporte técnico, suministros y licencias.
          </p>
        </div>

        {/* FAQ Accordion List */}
        <div className={`max-w-3xl mx-auto space-y-4 scroll-reveal ${isRevealed ? "reveal-active" : ""}`}>
          {faqs.map((faq, index) => {
            const isOpen = activeIndex === index;
            return (
              <div
                key={index}
                className={`bg-white border rounded-[1.5rem] transition-all duration-300 ${
                  isOpen 
                    ? "border-slate-300/80 shadow-md ring-1 ring-slate-100" 
                    : "border-slate-200/80 hover:border-slate-300 shadow-sm"
                }`}
              >
                {/* Accordion Header */}
                <button
                  type="button"
                  onClick={() => toggleFaq(index)}
                  className="w-full flex items-center justify-between p-6 text-left cursor-pointer select-none bg-transparent border-none focus:outline-none"
                >
                  <div className="flex items-center gap-4 pr-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors duration-300 ${
                      isOpen ? "bg-primary/10 text-primary" : "bg-slate-100 text-slate-500"
                    }`}>
                      <span className="material-symbols-outlined text-lg leading-none">{faq.icon}</span>
                    </div>
                    <span className="font-headline font-bold text-sm md:text-base text-slate-800 leading-tight">
                      {faq.question}
                    </span>
                  </div>
                  <span className={`material-symbols-outlined text-slate-400 transition-transform duration-300 ${
                    isOpen ? "rotate-180 text-primary" : ""
                  }`}>
                    keyboard_arrow_down
                  </span>
                </button>

                {/* Accordion Content */}
                <div
                  className={`overflow-hidden transition-all duration-300 ease-in-out ${
                    isOpen ? "max-h-[300px] border-t border-primary/15" : "max-h-0"
                  }`}
                >
                  <div className="p-6 text-xs md:text-sm text-on-surface-variant font-medium leading-relaxed bg-slate-50/50">
                    {faq.answer}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
