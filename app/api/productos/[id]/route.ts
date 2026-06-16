/**
 * API Route: /api/productos/[id]
 * Operaciones sobre un producto específico por su ID.
 * GET    — obtiene el detalle del producto (público)
 * PUT    — actualiza los campos enviados (requiere sesión activa)
 * DELETE — desactiva el producto (soft delete, requiere sesión activa)
 */
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/apiAuth";
import { z } from "zod";

// Todos los campos son opcionales para permitir actualizaciones parciales
const ProductoUpdateSchema = z.object({
  nombre: z.string().min(1, "El nombre del producto es requerido").optional(),
  precio: z.number({ invalid_type_error: "El precio debe ser un número" }).positive().optional(),
  descripcion: z.string().nullable().optional(),
  id_categoria: z.number().int().positive().optional(),
  imagen_url: z.string().nullable().optional(),
  activo: z.boolean().optional(),
});

// Devuelve el producto con su categoría incluida
export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const producto = await prisma.producto.findUnique({
    where: { id: Number(id) },
    include: { categoria: true },
  });
  if (!producto) return NextResponse.json({ error: "No encontrado" }, { status: 404 });
  return NextResponse.json(producto);
}

// Actualiza solo los campos enviados en el body
export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireRole(["admin", "vendedor"]);
  if (!auth.authorized) return auth.errorResponse;

  const { id } = await params;
  const body = await req.json();
  const result = ProductoUpdateSchema.safeParse(body);
  if (!result.success) {
    return NextResponse.json({ errors: result.error.flatten().fieldErrors }, { status: 400 });
  }

  const producto = await prisma.producto.update({
    where: { id: Number(id) },
    data: result.data,
  });
  return NextResponse.json(producto);
}

// Soft delete: marca el producto como inactivo en vez de borrarlo
export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireRole(["admin"]);
  if (!auth.authorized) return auth.errorResponse;

  const { id } = await params;
  await prisma.producto.update({
    where: { id: Number(id) },
    data: { activo: false },
  });
  return NextResponse.json({ ok: true });
}
