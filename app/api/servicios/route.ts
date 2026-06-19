/**
 * API Route: /api/servicios
 * Servicios técnicos ofrecidos por DELLCOM (mostrados en la landing page).
 * GET  — lista todos los servicios activos (público, sin autenticación)
 * POST — crea un servicio nuevo (requiere sesión activa)
 */
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/apiAuth";
import { z } from "zod";

// Esquema Zod para crear un servicio
const ServicioSchema = z.object({
  nombre: z.string().min(1, "El nombre del servicio es requerido"),
  descripcion: z.string().min(1, "La descripción es requerida"),
  // Nombre del ícono de Material Symbols (ej: "laptop_mac", "build")
  icono_url: z.string().nullable().optional(),
  activo: z.boolean().default(true),
});

// Solo devuelve servicios activos (los inactivos no aparecen en la web pública)
export async function GET() {
  const servicios = await prisma.servicio.findMany({ where: { activo: true } });
  return NextResponse.json(servicios);
}

// Crea un servicio nuevo tras validar el cuerpo con Zod
export async function POST(req: NextRequest) {
  const auth = await requireRole(["admin", "vendedor"]);
  if (!auth.authorized) return auth.errorResponse;

  const body = await req.json();
  const result = ServicioSchema.safeParse(body);
  if (!result.success) {
    return NextResponse.json({ errors: result.error.flatten().fieldErrors }, { status: 400 });
  }

  const servicio = await prisma.servicio.create({
    data: {
      ...result.data,
      id_usuario: auth.userId || null,
    },
  });
  return NextResponse.json(servicio, { status: 201 });
}
