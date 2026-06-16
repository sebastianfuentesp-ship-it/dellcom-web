/**
 * API Route: /api/categorias
 * Categorías de productos del catálogo DELLCOM.
 * GET  — lista todas las categorías activas (público)
 * POST — crea una categoría nueva (requiere sesión activa)
 */
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/apiAuth";
import { z } from "zod";

// Esquema Zod para crear una categoría
const CategoriaSchema = z.object({
  nombre: z.string().min(1, "El nombre de la categoría es requerido"),
  activo: z.boolean().default(true),
});

// Solo devuelve categorías activas (las inactivas no aparecen en el catálogo)
export async function GET() {
  const categorias = await prisma.categoria.findMany({ where: { activo: true } });
  return NextResponse.json(categorias);
}

// Crea una categoría nueva tras validar el cuerpo con Zod
export async function POST(req: NextRequest) {
  const auth = await requireRole(["admin", "vendedor"]);
  if (!auth.authorized) return auth.errorResponse;

  const body = await req.json();
  const result = CategoriaSchema.safeParse(body);
  if (!result.success) {
    return NextResponse.json({ errors: result.error.flatten().fieldErrors }, { status: 400 });
  }

  const categoria = await prisma.categoria.create({ data: result.data });
  return NextResponse.json(categoria, { status: 201 });
}
