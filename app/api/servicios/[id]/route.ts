/**
 * API Route: /api/servicios/[id]
 * Operaciones sobre un servicio específico por su ID.
 * PUT    — actualiza los campos enviados (requiere sesión activa)
 * DELETE — desactiva el servicio (soft delete, requiere sesión activa)
 */
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/apiAuth";
import { z } from "zod";

// Todos los campos son opcionales para permitir actualizaciones parciales
const ServicioUpdateSchema = z.object({
  nombre: z.string().min(1, "El nombre del servicio es requerido").optional(),
  descripcion: z.string().min(1, "La descripción es requerida").optional(),
  icono_url: z.string().nullable().optional(),
  activo: z.boolean().optional(),
});

// Actualiza solo los campos enviados en el body
export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireRole(["admin", "vendedor"]);
  if (!auth.authorized) return auth.errorResponse;

  const { id } = await params;
  const body = await req.json();
  const result = ServicioUpdateSchema.safeParse(body);
  if (!result.success) {
    return NextResponse.json({ errors: result.error.flatten().fieldErrors }, { status: 400 });
  }

  const servicio = await prisma.servicio.update({
    where: { id: Number(id) },
    data: result.data,
  });
  return NextResponse.json(servicio);
}

// Soft delete: marca el servicio como inactivo en vez de borrarlo
export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireRole(["admin"]);
  if (!auth.authorized) return auth.errorResponse;

  const { id } = await params;
  await prisma.servicio.update({ where: { id: Number(id) }, data: { activo: false } });
  return NextResponse.json({ ok: true });
}
