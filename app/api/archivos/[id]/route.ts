/**
 * API Route: /api/archivos/[id]
 * Operaciones sobre un archivo técnico específico por su ID.
 * PUT    — actualiza los campos enviados (requiere sesión activa)
 * DELETE — elimina el registro permanentemente (requiere sesión activa)
 */
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/apiAuth";
import { z } from "zod";

// Todos los campos son opcionales para permitir actualizaciones parciales
const ArchivoUpdateSchema = z.object({
  nombre: z.string().min(1, "El nombre del archivo es requerido").optional(),
  tipo: z.enum(["programa", "driver", "excel", "link"]).optional(),
  url_archivo: z.string().min(1, "La URL del archivo es requerida").optional(),
  descripcion: z.string().nullable().optional(),
});

// Actualiza los campos del archivo indicados en el body
export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireRole(["admin", "tecnico"]);
  if (!auth.authorized) return auth.errorResponse;

  const { id } = await params;
  const body = await req.json();
  const result = ArchivoUpdateSchema.safeParse(body);
  if (!result.success) {
    return NextResponse.json({ errors: result.error.flatten().fieldErrors }, { status: 400 });
  }

  const archivo = await prisma.archivoTecnico.update({
    where: { id: Number(id) },
    data: result.data,
  });
  return NextResponse.json(archivo);
}

// Elimina el archivo de forma permanente (borrado físico)
export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireRole(["admin"]);
  if (!auth.authorized) return auth.errorResponse;

  const { id } = await params;
  await prisma.archivoTecnico.delete({ where: { id: Number(id) } });
  return NextResponse.json({ ok: true });
}
