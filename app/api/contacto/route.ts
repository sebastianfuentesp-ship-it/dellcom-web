import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_MAX = 5;
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;

function stripHtml(value: string): string {
  return value.replace(/<[^>]*>/g, "").trim();
}

const ContactSchema = z.object({
  nombre: z.string().min(3, "El nombre debe tener al menos 3 caracteres").transform(stripHtml),
  correo: z.string().email("El correo electrónico no es válido"),
  telefono: z.string().nullable().optional().transform((v) => (v ? stripHtml(v) : v)),
  asunto: z.string().min(3, "El asunto debe tener al menos 3 caracteres").transform(stripHtml),
  mensaje: z.string().min(5, "El mensaje debe tener al menos 5 caracteres").transform(stripHtml),
});

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
    const now = Date.now();
    const entry = rateLimitMap.get(ip);

    if (entry && now < entry.resetAt) {
      if (entry.count >= RATE_LIMIT_MAX) {
        return NextResponse.json(
          { error: "Demasiadas solicitudes. Intente nuevamente en unos minutos." },
          { status: 429 }
        );
      }
      entry.count++;
    } else {
      rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    }

    const body = await req.json();

    const result = ContactSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { errors: result.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { nombre, correo, telefono, asunto, mensaje } = result.data;

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
