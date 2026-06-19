/**
 * API Route: /api/contacto  (pública, sin autenticación)
 * Recibe mensajes del formulario de contacto de la landing page.
 * POST — guarda el mensaje en la base de datos tras validarlo y sanitizarlo.
 *
 * Protecciones:
 *  - Rate limit: máximo 5 peticiones por IP cada 10 minutos (HTTP 429)
 *  - Validación Zod con mensajes de error en español
 *  - Sanitización HTML: stripHtml() elimina etiquetas antes de guardar
 */
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

// Almacén en memoria del rate limiter (se reinicia al reiniciar el servidor)
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_MAX = 5;                        // máximo de peticiones por ventana
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;    // ventana de 10 minutos en ms

// Elimina etiquetas HTML para prevenir XSS antes de guardar en la base de datos
function stripHtml(value: string): string {
  return value.replace(/<[^>]*>/g, "").trim();
}

// Esquema Zod: valida y sanitiza cada campo del formulario de contacto
const ContactSchema = z.object({
  nombre: z.string().min(3, "El nombre debe tener al menos 3 caracteres").transform(stripHtml),
  correo: z.string().email("El correo electrónico no es válido"),
  telefono: z
    .string()
    .length(9, "El teléfono debe tener exactamente 9 dígitos")
    .regex(/^[0-9]+$/, "El teléfono debe contener solo números")
    .transform(stripHtml),
  asunto: z.string().min(3, "El asunto debe tener al menos 3 caracteres").transform(stripHtml),
  mensaje: z.string().min(20, "El mensaje debe tener al menos 20 caracteres para detallar su solicitud").transform(stripHtml),
});

export async function POST(req: NextRequest) {
  try {
    // Extrae la IP real del cliente (detrás de proxies como Vercel/Railway)
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
    const now = Date.now();
    const entry = rateLimitMap.get(ip);

    // Incrementa el contador si la ventana sigue activa; rechaza si supera el límite
    if (entry && now < entry.resetAt) {
      if (entry.count >= RATE_LIMIT_MAX) {
        return NextResponse.json(
          { error: "Demasiadas solicitudes. Intente nuevamente en unos minutos." },
          { status: 429 }
        );
      }
      entry.count++;
    } else {
      // Primera petición o ventana expirada: reinicia el contador
      rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    }

    const body = await req.json();

    // Valida y sanitiza el cuerpo; devuelve 400 si hay errores
    const result = ContactSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { errors: result.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { nombre, correo, telefono, asunto, mensaje } = result.data;

    // Guarda el mensaje sanitizado en la base de datos
    const mensajeGuardado = await prisma.mensajeContacto.create({
      data: {
        nombre,
        correo,
        telefono: telefono || null,
        asunto,
        mensaje,
      },
    });

    return NextResponse.json({ success: true, data: mensajeGuardado }, { status: 201 });
  } catch (error) {
    console.error("[API Contacto Error]:", error);
    return NextResponse.json(
      { error: "Error interno al enviar el mensaje de contacto" },
      { status: 500 }
    );
  }
}
