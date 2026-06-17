/**
 * Footer corporativo de la landing page.
 * Organizado en 4 columnas: marca, servicios, compañía y contacto.
 * Es un Server Component (sin "use client") porque no necesita interactividad.
 */
import Link from "next/link";
import { Globe, MapPin, Phone, Mail } from "lucide-react";

function DellcomLogo({ className = "w-10 h-10" }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={className} xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="50" r="46" stroke="#ff0000" strokeWidth="3" fill="none" opacity="0.85" />
      <circle cx="50" cy="50" r="43" fill="#000000" />
      <path d="M 48 20 C 40 20, 36 24, 36 28 C 30 28, 27 33, 29 39 C 24 41, 23 48, 26 53 C 21 57, 21 64, 25 68 C 23 74, 28 80, 35 80 C 38 80, 42 78, 44 76 C 46 78, 48 80, 48 80 Z" stroke="#ffffff" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <path d="M 48 32 C 40 32, 38 38, 44 42 C 34 46, 38 56, 44 56 C 36 60, 40 70, 48 70" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <line x1="50" y1="18" x2="50" y2="82" stroke="#ff0000" strokeWidth="2.5" strokeDasharray="3 3" />
      <path d="M 52 24 L 66 24 L 66 32 M 52 38 L 74 38 L 74 46 M 52 50 L 64 50 L 72 58 M 52 64 L 72 64 M 52 74 L 64 74 L 64 68" stroke="#ff0000" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <circle cx="66" cy="32" r="3" fill="#ff0000" />
      <circle cx="74" cy="46" r="3" fill="#ff0000" />
      <circle cx="72" cy="58" r="3" fill="#ff0000" />
      <circle cx="72" cy="64" r="3" fill="#ff0000" />
      <circle cx="64" cy="68" r="3" fill="#ff0000" />
    </svg>
  );
}

export default function CleanFooter() {
  return (
    <footer className="bg-slate-50 border-t border-slate-200/80 py-16 w-full">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-gutter px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto w-full">
        {/* Brand Info */}
        <div className="col-span-1 md:col-span-1 space-y-4">
          <div className="flex items-center gap-3">
            <DellcomLogo className="w-8 h-8" />
            <span className="font-headline font-bold text-lg text-on-surface tracking-tight">DELLCOM SAC</span>
          </div>
          <p className="text-sm text-on-surface-variant leading-relaxed">
            Ingeniería IT y microelectrónica de vanguardia. Garantizando la continuidad operativa con precisión técnica.
          </p>
          <div className="flex gap-4">
            <a 
              href="https://wa.me/51925981741" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center text-on-surface-variant hover:text-primary hover:border-primary transition-all"
              aria-label="WhatsApp"
            >
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
              </svg>
            </a>
          </div>
        </div>
        
        {/* Services Column */}
        <div>
          <h4 className="font-headline font-bold text-xs text-on-surface uppercase tracking-wider mb-6">Servicios</h4>
          <ul className="space-y-4">
            <li><Link className="text-sm text-on-surface-variant hover:text-primary transition-transform hover:translate-x-1 inline-block" href="/servicios">Reparación de Hardware</Link></li>
            <li><Link className="text-sm text-on-surface-variant hover:text-primary transition-transform hover:translate-x-1 inline-block" href="/servicios">Soporte Corporativo</Link></li>
            <li><Link className="text-sm text-on-surface-variant hover:text-primary transition-transform hover:translate-x-1 inline-block" href="/servicios">Microelectrónica</Link></li>
            <li><Link className="text-sm text-on-surface-variant hover:text-primary transition-transform hover:translate-x-1 inline-block" href="/servicios">Licencias Originales</Link></li>
          </ul>
        </div>
        
        {/* Company Info Column */}
        <div>
          <h4 className="font-headline font-bold text-xs text-on-surface uppercase tracking-wider mb-6">Compañía</h4>
          <ul className="space-y-4">
            <li><Link className="text-sm text-on-surface-variant hover:text-primary transition-transform hover:translate-x-1 inline-block" href="/nosotros">Sobre Nosotros</Link></li>
            <li><Link className="text-sm text-on-surface-variant hover:text-primary transition-transform hover:translate-x-1 inline-block" href="/#portafolio">Casos de Éxito</Link></li>
            <li><Link className="text-sm text-on-surface-variant hover:text-primary transition-transform hover:translate-x-1 inline-block" href="/productos">Nuestro Catálogo</Link></li>
            <li><Link className="text-sm text-on-surface-variant hover:text-primary transition-transform hover:translate-x-1 inline-block" href="/descargas">Descargas y Drivers</Link></li>
            <li><Link className="text-sm text-on-surface-variant hover:text-primary transition-transform hover:translate-x-1 inline-block" href="/soporte">Soporte AnyDesk</Link></li>
            <li><Link className="text-sm text-on-surface-variant hover:text-primary transition-transform hover:translate-x-1 inline-block" href="/admin/login">Portal Interno</Link></li>
          </ul>
        </div>
        
        {/* Contact Info Column */}
        <div className="space-y-4">
          <h4 className="font-headline font-bold text-xs text-on-surface uppercase tracking-wider mb-6">Contacto</h4>
          <ul className="space-y-4">
            <li className="flex items-start gap-3">
              <MapPin className="text-primary w-5 h-5 shrink-0 mt-0.5" />
              <span className="text-sm text-on-surface-variant">Av. Santa Elvira, Mza. E, Lote 59, Urb. San Elías, Los Olivos, Lima.</span>
            </li>
            <li className="flex items-start gap-3">
              <Phone className="text-primary w-5 h-5 shrink-0 mt-0.5" />
              <div className="flex flex-col gap-0.5">
                <span className="text-sm text-on-surface-variant">+51 925 981 741</span>
                <span className="text-sm text-on-surface-variant">+51 922 452 929</span>
              </div>
            </li>
            <li className="flex items-center gap-3">
              <Mail className="text-primary w-5 h-5 shrink-0" />
              <span className="text-sm text-on-surface-variant">ventas@dellcom-sac.com</span>
            </li>
          </ul>
        </div>
      </div>
      
      <div className="mt-16 pt-8 border-t border-slate-200/80 px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto flex flex-col md:flex-row justify-between items-center gap-4 w-full">
        <p className="text-xs text-on-surface-variant">
          © 2026 DELLCOM SAC. Precision IT Engineering. Todos los derechos reservados.
        </p>
        <div className="flex gap-6">
          <Link className="text-xs text-on-surface-variant hover:text-primary" href="/#">Términos</Link>
          <Link className="text-xs text-on-surface-variant hover:text-primary" href="/#">Privacidad</Link>
          <Link className="text-xs text-on-surface-variant hover:text-primary" href="/admin/login">Panel Técnico</Link>
        </div>
      </div>
    </footer>
  );
}
