/**
 * API Route: /api/trabajos/[id]
 * Operaciones sobre un trabajo del portfolio específico por su ID.
 * PUT    — actualiza los campos enviados (requiere sesión activa)
 * DELETE — elimina el trabajo permanentemente (requiere sesión activa)
 */
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/apiAuth";
import { z } from "zod";

// Todos los campos son opcionales para permitir actualizaciones parciales
const TrabajoUpdateSchema = z.object({
  titulo: z.string().min(1, "El título del trabajo es requerido").optional(),
  descripcion: z.string().nullable().optional(),
  imagen_url: z.string().min(1, "La imagen es requerida").optional(),
  id_servicio: z.number().int().positive().nullable().optional(),
});

// Actualiza solo los campos enviados en el body
export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireRole(["admin", "tecnico"]);
  if (!auth.authorized) return auth.errorResponse;

  const { id } = await params;
  const body = await req.json();
  const result = TrabajoUpdateSchema.safeParse(body);
  if (!result.success) {
    return NextResponse.json({ errors: result.error.flatten().fieldErrors }, { status: 400 });
  }

  const trabajo = await prisma.trabajoRealizado.update({
    where: { id: Number(id) },
    data: result.data,
  });
  return NextResponse.json(trabajo);
}

// Elimina el trabajo de forma permanente (borrado físico)
export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireRole(["admin"]);
  if (!auth.authorized) return auth.errorResponse;

  const { id } = await params;
  await prisma.trabajoRealizado.delete({ where: { id: Number(id) } });
  return NextResponse.json({ ok: true });
}
