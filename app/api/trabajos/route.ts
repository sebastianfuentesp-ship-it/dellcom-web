/**
 * API Route: /api/trabajos
 * Portfolio de trabajos realizados por DELLCOM (mostrados en la landing page).
 * GET  — lista todos los trabajos ordenados por fecha (público)
 * POST — crea un trabajo nuevo (requiere sesión activa)
 */
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/apiAuth";
import { z } from "zod";

// Esquema Zod para crear un trabajo en el portfolio
const TrabajoSchema = z.object({
  titulo: z.string().min(1, "El título del trabajo es requerido"),
  descripcion: z.string().nullable().optional(),
  imagen_url: z.string().min(1, "La imagen del trabajo es requerida"),
  // Relación opcional con un servicio para categorizar el trabajo
  id_servicio: z.number().int().positive().nullable().optional(),
});

// Devuelve todos los trabajos con el servicio relacionado incluido
export async function GET() {
  const trabajos = await prisma.trabajoRealizado.findMany({
    include: { servicio: true },
    orderBy: { fecha: "desc" },
  });
  return NextResponse.json(trabajos);
}

// Crea un trabajo nuevo en el portfolio tras validar el cuerpo con Zod
export async function POST(req: NextRequest) {
  const auth = await requireRole(["admin", "tecnico"]);
  if (!auth.authorized) return auth.errorResponse;

  const body = await req.json();
  const result = TrabajoSchema.safeParse(body);
  if (!result.success) {
    return NextResponse.json({ errors: result.error.flatten().fieldErrors }, { status: 400 });
  }

  const trabajo = await prisma.trabajoRealizado.create({ data: result.data });
  return NextResponse.json(trabajo, { status: 201 });
}
