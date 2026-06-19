/**
 * API Route: /api/productos
 * Catálogo de productos de la tienda DELLCOM.
 * GET  — lista productos (públicamente activos, o todos con ?all=true para admin)
 * POST — crea un producto nuevo (requiere sesión activa)
 */
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/apiAuth";
import { z } from "zod";

// Esquema Zod para crear un producto
const ProductoSchema = z.object({
  nombre: z.string().min(1, "El nombre del producto es requerido"),
  precio: z.number({ invalid_type_error: "El precio debe ser un número" }).positive("El precio debe ser mayor a 0"),
  descripcion: z.string().nullable().optional(),
  id_categoria: z.number({ invalid_type_error: "La categoría es requerida" }).int().positive(),
  imagen_url: z.string().nullable().optional(),
  activo: z.boolean().default(true),
});

// ?all=true → devuelve activos e inactivos (uso admin)
// Sin parámetro → solo productos activos (uso público)
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const showAll = searchParams.get("all") === "true";

  const productos = await prisma.producto.findMany({
    include: { categoria: true },
    where: showAll ? {} : { activo: true },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(productos);
}
// Crea un producto nuevo tras validar el cuerpo con Zod
export async function POST(req: NextRequest) {
  const auth = await requireRole(["admin", "vendedor"]);
  if (!auth.authorized) return auth.errorResponse;

  const body = await req.json();
  const result = ProductoSchema.safeParse(body);
  if (!result.success) {
    return NextResponse.json({ errors: result.error.flatten().fieldErrors }, { status: 400 });
  }

  const producto = await prisma.producto.create({
    data: {
      ...result.data,
      id_usuario: auth.userId || null,
    },
  });
  return NextResponse.json(producto, { status: 201 });
}
