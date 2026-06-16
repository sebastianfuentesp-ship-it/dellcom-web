/**
 * API Route: /api/licencias
 * Gestión de licencias de software asignadas a clientes.
 * GET  — lista todas las licencias (requiere sesión activa)
 * POST — crea una nueva licencia (requiere sesión activa)
 */
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { requireRole } from "@/lib/apiAuth";
import { z } from "zod";

// Esquema Zod para crear una licencia nueva
const LicenciaSchema = z.object({
  software: z.string().min(1, "El software es requerido"),
  correo_cuenta: z.string().email("El correo de la cuenta no es válido"),
  contrasena: z.string().min(1, "La contraseña es requerida"),
  nombre_cliente: z.string().min(1, "El nombre del cliente es requerido"),
  telefono: z.string().nullable().optional(),
  fecha_inicio: z.string().min(1, "La fecha de inicio es requerida"),
  fecha_fin: z.string().nullable().optional(),
  observaciones: z.string().nullable().optional(),
  estado: z.enum(["activo", "vencido"]).default("activo"),
});

// Devuelve todas las licencias con el nombre del usuario que las registró
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const licencias = await prisma.licencia.findMany({
    include: { usuario: { select: { nombre: true, usuario: true } } },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(licencias);
}

// Crea una licencia nueva asignada al usuario autenticado
export async function POST(req: NextRequest) {
  const auth = await requireRole(["admin"]);
  if (!auth.authorized) return auth.errorResponse;

  // Busca el usuario para obtener su ID y asignarlo a la licencia
  const user = await prisma.usuario.findUnique({ where: { email: auth.email } });
  if (!user) return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 });

  const body = await req.json();

  // Valida el cuerpo antes de tocar la base de datos
  const result = LicenciaSchema.safeParse(body);
  if (!result.success) {
    return NextResponse.json({ errors: result.error.flatten().fieldErrors }, { status: 400 });
  }

  // Convierte las fechas de string ISO a objetos Date para Prisma
  const { fecha_inicio, fecha_fin, ...rest } = result.data;
  const licencia = await prisma.licencia.create({
    data: {
      ...rest,
      id_usuario: user.id,
      fecha_inicio: new Date(fecha_inicio),
      fecha_fin: fecha_fin ? new Date(fecha_fin) : null,
    },
  });
  return NextResponse.json(licencia, { status: 201 });
}
